<?php

namespace App\Models\Api;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductCategory extends Model
{
    use SoftDeletes;

    protected $table = 'm_categories';

    protected $fillable = [
        'category_code',
        'category_name',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * Relasi:
     * 1 category -> banyak product
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
