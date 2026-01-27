<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoreRecipe extends Model
{
    use HasFactory;
    protected $table = 'core_recipes';

    // Enable auto-incrementing for 'id' primary key
    public $incrementing = true;

    // Set the primary key to 'id'
    protected $primaryKey = 'id';

    protected $guarded = [];

    /**
     * Relasi ke Ingredient
     */
    public function ingredients()
    {
        return $this->hasMany(CoreIngredient::class, 'recipe_id');
    }
}
