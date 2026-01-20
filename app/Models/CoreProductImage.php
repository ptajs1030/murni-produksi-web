<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class CoreProductImage extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'core_product_image';

    protected $guarded = [];

    protected $casts = [
        'image_is_primary' => 'boolean',
        'image_order' => 'integer',
        'file_size' => 'integer',
    ];

    protected $appends = [
        'image_url',
    ];

    protected static function boot()
    {
        parent::boot();

        // Auto set image order jika tidak diisi
        static::creating(function ($model) {
            if (is_null($model->image_order)) {
                $maxOrder = static::where('product_id', $model->product_id)
                    ->max('image_order');
                $model->image_order = ($maxOrder ?? -1) + 1;
            }

            // Jika ini adalah gambar pertama untuk produk, set sebagai primary
            if (is_null($model->image_is_primary)) {
                $hasExisting = static::where('product_id', $model->product_id)
                    ->exists();
                $model->image_is_primary = ! $hasExisting;
            }
        });

        // Pastikan hanya ada satu primary image per produk
        static::saving(function ($model) {
            if ($model->image_is_primary) {
                static::where('product_id', $model->product_id)
                    ->where('id', '!=', $model->id)
                    ->update(['image_is_primary' => false]);
            }
        });

        // Hapus file fisik saat soft delete atau permanent delete
        static::deleting(function ($model) {
            if ($model->isForceDeleting()) {
                $model->deleteImageFile();
            }
        });

        // Restore file handling jika diperlukan
        static::restoring(function ($model) {
            // Logic untuk restore file jika diperlukan
        });
    }

    /**
     * Relasi ke Product
     */
    public function product()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

    /**
     * Relasi ke User (Created By)
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke User (Updated By)
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Relasi ke User (Deleted By)
     */
    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    /**
     * Scope untuk gambar primary
     */
    public function scopePrimary($query)
    {
        return $query->where('image_is_primary', true);
    }

    /**
     * Scope untuk gambar non-primary
     */
    public function scopeSecondary($query)
    {
        return $query->where('image_is_primary', false);
    }

    /**
     * Scope untuk order gambar
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('image_order', 'asc');
    }

    /**
     * Scope berdasarkan produk
     */
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * Accessor untuk full URL gambar
     */
    public function getImageUrlAttribute()
    {
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            // Jika path sudah berupa URL lengkap
            return $this->image_path;
        }

        // Jika menggunakan Laravel Storage
        if (Storage::disk('public')->exists($this->image_path)) {
            return Storage::disk('public')->url($this->image_path);
        }

        // Default fallback image
        return asset('resources\img\no_image.webp');
    }

    /**
     * Accessor untuk thumbnail URL
     */
    public function getThumbnailUrlAttribute()
    {
        // Logic untuk generate thumbnail jika ada
        $thumbnailPath = str_replace('/', '/thumbnails/', $this->image_path);

        if (Storage::disk('public')->exists($thumbnailPath)) {
            return Storage::disk('public')->url($thumbnailPath);
        }

        return $this->image_url; // Fallback ke gambar asli
    }

    /**
     * Accessor untuk file extension
     */
    public function getFileExtensionAttribute()
    {
        return pathinfo($this->image_name, PATHINFO_EXTENSION);
    }

    /**
     * Accessor untuk file size formatted
     */
    public function getFormattedFileSizeAttribute()
    {
        if (! $this->file_size) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $this->file_size;

        for ($i = 0; $size >= 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }

        return round($size, 2).' '.$units[$i];
    }

    /**
     * Check apakah file gambar ada
     */
    public function imageExists()
    {
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            // Untuk URL external, bisa dicek dengan HTTP request
            return true; // Simplified
        }

        return Storage::disk('public')->exists($this->image_path);
    }

    /**
     * Delete file gambar fisik
     */
    public function deleteImageFile()
    {
        if (! filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            // Delete main image
            if (Storage::disk('public')->exists($this->image_path)) {
                Storage::disk('public')->delete($this->image_path);
            }

            // Delete thumbnail if exists
            $thumbnailPath = str_replace('/', '/thumbnails/', $this->image_path);
            if (Storage::disk('public')->exists($thumbnailPath)) {
                Storage::disk('public')->delete($thumbnailPath);
            }
        }
    }

    /**
     * Set sebagai primary image
     */
    public function setPrimary()
    {
        // Unset primary dari gambar lain
        static::where('product_id', $this->product_id)
            ->where('id', '!=', $this->id)
            ->update(['image_is_primary' => false]);

        // Set ini sebagai primary
        $this->update(['image_is_primary' => true]);

        return $this;
    }

    /**
     * Reorder gambar
     */
    public static function reorderImages($productId, array $imageIds)
    {
        foreach ($imageIds as $order => $imageId) {
            static::where('product_id', $productId)
                ->where('id', $imageId)
                ->update(['image_order' => $order]);
        }
    }

    /**
     * Upload dan simpan gambar
     */
    public static function uploadAndCreate($productId, $file, $options = [])
    {
        $fileName = time().'_'.$file->getClientOriginalName();
        $filePath = $file->storeAs('products/'.$productId, $fileName, 'public');

        return static::create([
            'product_id' => $productId,
            'image_path' => $filePath,
            'image_name' => $fileName,
            'image_alt_text' => $options['alt_text'] ?? null,
            'image_order' => $options['order'] ?? null,
            'image_is_primary' => $options['is_primary'] ?? null,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'created_by' => auth()->id(),
        ]);
    }

    /**
     * Generate thumbnail
     */
    public function generateThumbnail($width = 300, $height = 300)
    {
        // Logic untuk generate thumbnail menggunakan Intervention Image atau library lain
        // Contoh placeholder:

        /*
        $image = Image::make(Storage::disk('public')->get($this->image_path));
        $thumbnail = $image->fit($width, $height);

        $thumbnailPath = str_replace('/', '/thumbnails/', $this->image_path);
        $thumbnailDir = dirname(storage_path('app/public/' . $thumbnailPath));

        if (!file_exists($thumbnailDir)) {
            mkdir($thumbnailDir, 0755, true);
        }

        $thumbnail->save(storage_path('app/public/' . $thumbnailPath));
        */

        return $this;
    }

    /**
     * Duplicate image untuk produk lain
     */
    public function duplicateForProduct($newProductId)
    {
        $newImageName = time().'_copy_'.$this->image_name;
        $newImagePath = 'products/'.$newProductId.'/'.$newImageName;

        // Copy file fisik
        if (Storage::disk('public')->exists($this->image_path)) {
            Storage::disk('public')->copy($this->image_path, $newImagePath);
        }

        // Buat record baru
        return static::create([
            'product_id' => $newProductId,
            'image_path' => $newImagePath,
            'image_name' => $newImageName,
            'image_alt_text' => $this->image_alt_text,
            'image_order' => 0, // Reset order
            'image_is_primary' => false, // Reset primary
            'file_size' => $this->file_size,
            'mime_type' => $this->mime_type,
            'created_by' => auth()->id(),
        ]);
    }
}
