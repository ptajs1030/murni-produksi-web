<?php
namespace App\Services;

use App\Models\CoreRecipe;
use App\Models\CoreStock;
use App\Models\LogProduksi;
use Illuminate\Support\Facades\DB;
use Exception;

class ProductionService
{
    public function store(array $data): array
    {
        return DB::transaction(function () use ($data) {

            $recipe = CoreRecipe::with('ingredients.product')
                ->find($data['recipe_id']);

            if (!$recipe) {
                throw new Exception('Recipe tidak ditemukan');
            }

            $ingredientsLog = [];

            foreach ($recipe->ingredients as $ingredient) {
                $needed = $ingredient->quantity * $data['quantity'];

                $stock = CoreStock::where(
                    'product_id',
                    $ingredient->product_id
                )->first();

                if (!$stock || $stock->packaging_size_input < $needed) {
                    throw new Exception(
                        'Stock tidak cukup untuk bahan: ' .
                        $ingredient->product->product_name
                    );
                }

                $stock->packaging_size_input -= $needed;
                $stock->save();

                $ingredientsLog[] =
                    $ingredient->product->product_name . '(' . $needed . ')';
            }

            // ⚠️ LOGIC ASLI: product_id = recipe_id
            $productStock = CoreStock::where(
                'product_id',
                $data['recipe_id']
            )->first();

            if (!$productStock) {
                throw new Exception('Stock produk hasil tidak ditemukan');
            }

            $productStock->packaging_size_input += $data['quantity'];
            $productStock->save();

            LogProduksi::create([
                'product_id' => $data['recipe_id'],
                'quantity' => $data['quantity'],
                'description' => $ingredientsLog,
                //'created_by' => auth()->id(),
            ]);

            return [
                'recipe_id' => $data['recipe_id'],
                'quantity' => $data['quantity'],
                'ingredients' => $ingredientsLog
            ];
        });
    }
}
