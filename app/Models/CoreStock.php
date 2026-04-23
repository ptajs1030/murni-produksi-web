<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreStock extends Model
{
    /** @use HasFactory<\Database\Factories\CoreStockFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $table = 'core_stoks';

    protected $guarded = [];

    protected $casts = [
        'packaging_size_input' => 'integer',
        'in_stock' => 'integer',
        'track_stock' => 'boolean',
        'track_alert' => 'boolean',
        'stock_alert' => 'boolean',
        'track_cost' => 'boolean',
        'cost_amount' => 'decimal:2',
    ];

    // Relationship dengan produk
    public function product()
    {
        return $this->belongsTo(CoreProduct::class, 'product_id');
    }

    // Relationship dengan gudang
    public function warehouse()
    {
        return $this->belongsTo(MWarehouse::class, 'warehouse_id');
    }

    public function stockOpnameProducts()
    {
        return $this->hasMany(CoreStockOpnameProduct::class, 'stock_id');
    }

    /**
     * Calculate the real quantity in smallest unit
     * packaging_size_input represents quantity in smallest unit (e.g., grams, ml)
     * in_stock represents quantity in packaging unit (e.g., kg, liter)
     */
    public function getRealQuantityInSmallestUnitAttribute()
    {
        if (!$this->product || !$this->product->packagingSize) {
            return $this->packaging_size_input;
        }

        // Get conversion value from packaging size
        $conversionValue = $this->product->packagingSize->unit_conversion_value ?? 1;

        // Calculate total in smallest unit: (packaging quantity * conversion) + input quantity
        return ($this->in_stock * $conversionValue) * $this->packaging_size_input;
    }

    /**
     * Get formatted quantity with unit
     */
    public function getFormattedQuantityAttribute()
    {
        if (!$this->product || !$this->product->packagingSize) {
            return $this->packaging_size_input . ' unit';
        }

        $packagingSize = $this->product->packagingSize;
        $baseUnit = $packagingSize->sizeType->base_unit ?? 'unit';

        if ($this->in_stock > 0) {
            $packagingUnit = $packagingSize->packaging_size_name ?? 'unit';

            return $this->in_stock . ' ' . $packagingUnit .
                ($this->packaging_size_input > 0 ? ' + ' . $this->packaging_size_input . ' ' . $baseUnit : '');
        }

        return $this->packaging_size_input . ' ' . $baseUnit;
    }
}
