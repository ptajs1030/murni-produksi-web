<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CoreProduct extends Model
{
    use HasFactory;


    protected $table = 'core_products';

    protected $guarded = [];

    protected $casts = [
        'target_selling_date' => 'date',
        'product_is_pre_order' => 'boolean',
        'product_unit_qty' => 'decimal:2',
        'product_unit_price' => 'decimal:2',
        'expired_date' => 'date',
    ];

    protected $appends = [
        'primary_image_url',
        'image_urls',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->target_selling_date)) { // Fixed typo
                $model->target_selling_date = now()->addDays(30)->toDateString();
            }
            if (empty($model->product_unit_sku)) {
                $model->product_unit_sku = $model->generateSKU();
            }
        });
    }

    /**
     * Relasi ke Category
     */
    public function category()
    {
        return $this->belongsTo(MCategory::class, 'm_category_id');
    }

    /**
     * Relasi ke Supplier
     */
    public function supplier()
    {
        return $this->belongsTo(MSupplier::class, 'm_supplier_id');
    }

    /**
     * Relasi ke Product Images
     */
    public function productImages()
    {
        return $this->hasMany(CoreProductImage::class, 'product_id');
    }

    /**
     * Get primary image
     */
    public function primaryImage()
    {
        return $this->hasOne(CoreProductImage::class, 'product_id')
            ->where('image_is_primary', true);
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
     * Scope untuk produk pre-order
     */
    public function scopePreOrder($query)
    {
        return $query->where('product_is_pre_order', true);
    }

    /**
     * Scope untuk produk ready stock
     */
    public function scopeReadyStock($query)
    {
        return $query->where('product_is_pre_order', false);
    }

    /**
     * Scope untuk produk berdasarkan kategori
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('m_category_id', $categoryId);
    }

    /**
     * Scope untuk produk berdasarkan supplier
     */
    public function scopeBySupplier($query, $supplierId)
    {
        return $query->where('m_supplier_id', $supplierId);
    }

    /**
     * Check if product is sold (berdasarkan target_selling_date)
     */
    public function getIsSoldAttribute()
    {
        return $this->target_selling_date && $this->target_selling_date->isPast();
    }

    /**
     * Generate SKU berdasarkan format:
     * category-supplier-sifat_benda-ukuran_packing-wadah_paking-repack_status-7_huruf_pertama_nama_product
     */
    protected function generateSKU()
    {
        $this->load(
            'category',
            'supplier',
            'propertyItem',
            'packagingSize',
            'packagingType',
            'repackStatus'
        );

        $productNameCode = Str::upper(Str::substr(preg_replace('/[^A-Za-z0-9]/', '', $this->product_name), 0, 7));

        $sku = implode('-', array_filter([
            $this->category->category_code ?? null,
            $this->supplier->supplier_code ?? null,
            $this->propertyItem->property_code ?? null,
            $this->packagingSize->packaging_size_code ?? null,
            $this->packagingType->packaging_type_code ?? null,
            $this->repackStatus->repack_code ?? null,
            $productNameCode,
        ]));

        // Let the validation handle uniqueness, but if you must, here's a simpler check
        if (static::where('product_unit_sku', $sku)->exists()) {
            $sku .= '-'.Str::random(4);
        }

        return $sku;
    }

    /**
     * Relasi ke Property Item (Sifat Benda)
     */
    public function propertyItem()
    {
        return $this->belongsTo(MPropertyItem::class, 'm_property_item_id');
    }

    /**
     * Relasi ke Packaging Size
     */
    public function packagingSize()
    {
        return $this->belongsTo(MPackagingSize::class, 'm_packaging_size_id');
    }

    /**
     * Relasi ke Packaging Type
     */
    public function packagingType()
    {
        return $this->belongsTo(MPackagingType::class, 'm_packaging_type_id');
    }

    /**
     * Relasi ke Repack Status
     */
    public function repackStatus()
    {
        return $this->belongsTo(MRepackStatus::class, 'm_repack_status_id');
    }

    /**
     * Relasi ke IncomeProduct
     */
    public function incomeProducts()
    {
        return $this->hasMany(CoreIncomingProduct::class, 'product_id');
    }

    /**
     * Scope untuk filter berdasarkan expired date
     */
    public function scopeExpired($query)
    {
        return $query->where('expired_date', '<', now());
    }

    /**
     * Scope untuk filter berdasarkan produk yang akan expired dalam X hari
     */
    public function scopeExpiringInDays($query, $days = 30)
    {
        return $query->whereBetween('expired_date', [now(), now()->addDays($days)]);
    }

    /**
     * Accessor untuk format harga
     */
    public function getFormattedPriceAttribute()
    {
        return number_format($this->product_unit_price, 0, ',', '.');
    }

    /**
     * Accessor untuk status expired
     */
    public function getIsExpiredAttribute()
    {
        return $this->expired_date && $this->expired_date->isPast();
    }

    /**
     * Accessor untuk days until expired
     */
    public function getDaysUntilExpiredAttribute()
    {
        if (! $this->expired_date) {
            return null;
        }

        return now()->diffInDays($this->expired_date, false);
    }

    /**
     * Accessor untuk mendapatkan URL gambar utama
     */
    public function getPrimaryImageUrlAttribute()
    {
        $primaryImage = $this->primaryImage;

        return $primaryImage ? $primaryImage->image_url : asset('images/no-image.png');
    }

    /**
     * Accessor untuk mendapatkan semua URL gambar
     */
    public function getImageUrlsAttribute()
    {
        return $this->productImages->pluck('image_url')->toArray();
    }

    // Relationship dengan stok
    public function stocks()
    {
        return $this->hasMany(CoreStock::class, 'product_id');
    }
}
