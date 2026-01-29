<?php

namespace App\Models\Api;

use Illuminate\Database\Eloquent\Model;

class RecipeItem extends Model
{
    protected $table = 'core_recipes_items';

    protected $fillable = [
        'recipe_id',
        'product_id',
        'qty_per_unit',
        'unit',
        'created_by',
        'updated_by',
    ];

    protected $hidden = [
        'created_by',
        'updated_by',
        'deleted_by',
        'deleted_at',
    ];

    protected $casts = [
        'qty_per_unit' => 'decimal:4',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
