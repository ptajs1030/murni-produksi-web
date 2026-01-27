<?php

namespace Database\Factories;

use App\Models\CoreIngredient;
use App\Models\CoreProduct;
use App\Models\CoreRecipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoreIngredientFactory extends Factory
{
    protected $model = CoreIngredient::class;

    public function definition(): array
    {
        $recipe = CoreRecipe::inRandomOrder()->first();

        if (!$recipe) {
            return [];
        }

        $rawMaterial = CoreProduct::where('product_type', 'Produk Bahan Baku')
            ->inRandomOrder()
            ->first();

        if (!$rawMaterial) {
            return [];
        }

        return [
            'recipe_id' => $recipe->id,
            'product_id' => $rawMaterial->id,
            'quantity' => $this->faker->randomFloat(2, 0.1, 10),
            'created_by' => User::inRandomOrder()->value('id'),
            'updated_by' => null,
            'deleted_by' => null,
        ];
    }
}
