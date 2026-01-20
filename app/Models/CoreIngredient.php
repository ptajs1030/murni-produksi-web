<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoreIngredient extends Model
{
    use HasFactory;

    protected $table = 'core_ingredients';

    // Enable auto-incrementing for 'id' primary key
    public $incrementing = true;

    // Set the primary key to 'id'
    protected $primaryKey = 'id';

    protected $guarded = [];

    /**
     * Relasi ke Recipe
     */
    public function recipe()
    {
        return $this->belongsTo(CoreRecipe::class, 'recipe_id');
    }
}
