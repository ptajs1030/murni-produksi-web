<?php

namespace App\Models\Api;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Recipe extends Model
{
    use SoftDeletes;

    protected $table = 'core_recipes';

    protected $fillable = [
        'recipe_name',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function items()
    {
        return $this->hasMany(RecipeItem::class, 'recipe_id');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
