<?php

namespace Database\Factories;

use App\Models\CoreProduct;
use App\Models\CoreRecipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoreRecipeFactory extends Factory
{
    protected $model = CoreRecipe::class;

    public function definition(): array
    {
        $product = CoreProduct::where('product_type', 'Produk Jadi')
            ->whereDoesntHave('recipe')
            ->inRandomOrder()
            ->first();

        if (!$product) {
            return [];
        }

        return [
            'product_id' => $product->id,
            'created_by' => User::inRandomOrder()->value('id'),
            'updated_by' => null,
            'deleted_by' => null,
        ];
    }
}
