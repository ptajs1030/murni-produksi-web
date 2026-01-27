<?php

namespace Database\Seeders;

use App\Models\CoreIngredient;
use App\Models\CoreProduct;
use App\Models\CoreRecipe;
use Illuminate\Database\Seeder;

class CoreRecipeSeeder extends Seeder
{
    public function run(): void
    {
        // HANYA produk jadi & belum punya recipe
        $products = CoreProduct::where('product_type', 'Produk Jadi')
            ->whereNotIn('id', CoreRecipe::pluck('product_id'))
            ->get();

        foreach ($products as $product) {

            // 1️⃣ Buat recipe
            $recipe = CoreRecipe::factory()->create([
                'product_id' => $product->id,
            ]);

            // 2️⃣ Ingredient = bahan baku saja
            $ingredients = CoreProduct::where('product_type', 'Produk Bahan Baku')
                ->inRandomOrder()
                ->limit(rand(2, 6))
                ->get();

            foreach ($ingredients as $ingredient) {
                CoreIngredient::factory()->create([
                    'recipe_id' => $recipe->id,
                    'product_id' => $ingredient->id,
                ]);
            }
        }

        $this->command->info('Core recipes & ingredients seeded successfully!');
        $this->command->info('Total recipes: ' . $products->count());
    }
}
