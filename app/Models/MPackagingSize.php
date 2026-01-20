<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MPackagingSize extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_packaging_sizes';

    protected $guarded = [];

    protected $casts = [
        'unit_conversion_value' => 'integer',
    ];

    public function sizeType()
    {
        return $this->belongsTo(MPackagingSizeType::class, 'packaging_size_type_id');
    }

    public function packagingLevel()
    {
        return $this->belongsTo(MPackagingLevel::class, 'packaging_level_id');
    }

    /**
     * Convert quantity from this packaging size to smallest unit
     */
    public function convertToSmallestUnit($quantity)
    {
        return $quantity * $this->unit_conversion_value;
    }

    /**
     * Convert quantity from smallest unit to this packaging size
     */
    public function convertFromSmallestUnit($smallestUnitQuantity)
    {
        if ($this->unit_conversion_value == 0) {
            return 0;
        }

        return intval($smallestUnitQuantity / $this->unit_conversion_value);
    }

    /**
     * Get remainder when converting from smallest unit
     */
    public function getRemainderFromSmallestUnit($smallestUnitQuantity)
    {
        if ($this->unit_conversion_value == 0) {
            return $smallestUnitQuantity;
        }

        return $smallestUnitQuantity % $this->unit_conversion_value;
    }

    /**
     * Format quantity with appropriate unit
     */
    public function formatQuantity($quantity, $includeSmallestUnit = false, $smallestUnitQuantity = 0)
    {
        $result = $quantity.' '.$this->packaging_size_name;

        if ($includeSmallestUnit && $smallestUnitQuantity > 0) {
            $baseUnit = $this->sizeType->base_unit ?? 'unit';
            $result .= ' + '.$smallestUnitQuantity.' '.$baseUnit;
        }

        return $result;
    }

    /**
     * Get unit conversion examples
     */
    public function getConversionExamples()
    {
        $baseUnit = $this->sizeType->base_unit ?? 'unit';

        return [
            'to_smallest' => "1 {$this->packaging_size_name} = {$this->unit_conversion_value} {$baseUnit}",
            'from_smallest' => "{$this->unit_conversion_value} {$baseUnit} = 1 {$this->packaging_size_name}",
        ];
    }
}
