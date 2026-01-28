<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoreOutgoingProduct extends Model
{
    use HasFactory;
    public $timestamps = true;

    protected $table = 'core_outgoing_products';

    protected $guarded = [];

    protected function asDateTime($value)
    {
        return parent::asDateTime($value)
            ->setTimezone(config('app.timezone')); // Asia/Jakarta
    }

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'created_at' => 'datetime:Y-m-d H:i:s',
            'updated_at' => 'datetime:Y-m-d H:i:s',

        ];
    }

    protected static function booted()
        {
            static::creating(function ($m) {
                $now = now(); // Sudah WIB dari APP_TIMEZONE
                if (empty($m->created_at)) $m->created_at = $now;
                if (empty($m->updated_at)) $m->updated_at = $now;
            });

            static::updating(function ($m) {
                $m->updated_at = now();
            });
        }

    public function product()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

    public function warehouse()
    {
        return $this->belongsTo(MWarehouse::class, 'warehouse_id');
    }

    public function stock()
    {
        return $this->belongsTo(CoreStock::class, 'stock_id');
    }

    public function outType()
    {
        return $this->belongsTo(MOutType::class, 'out_type_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
