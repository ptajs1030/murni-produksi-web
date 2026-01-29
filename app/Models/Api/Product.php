<?php

namespace App\Models\Api;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $table = 'core_products';

    protected $fillable = [
        'm_category_id',
        'm_supplier_id',
        'target_selling_date',
        'product_is_pre_order',
        'product_processing_days',
        'product_name',
        'brand_name',
        'description',
        'm_property_item_id',
        'm_packaging_size_id',
        'm_packaging_type_id',
        'm_repack_status_id',
        'packaging_size_input',
        'product_unit_sku',
        'product_unit_qty',
        'product_unit_price',
        'expired_date',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'product_is_pre_order' => 'boolean',
        'product_unit_qty' => 'decimal:2',
        'product_unit_price' => 'decimal:2',
        'expired_date' => 'date',
        'target_selling_date' => 'date',
    ];
    public function category()
{
    return $this->belongsTo(ProductCategory::class, 'category_id');
}
}
