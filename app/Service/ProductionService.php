<?php
namespace App\Service;

use App\DTOs\ProductionCheckDTO;
use App\DTOs\ProductionStoreDTO;
use App\Models\CoreRecipe;
use App\Models\CoreStock;
use App\Models\CoreStockTransaction;
use App\Models\LogProduksi;
use Illuminate\Support\Facades\DB;
use Exception;

class ProductionService
{

    public function check(ProductionCheckDTO $dto): array
    {
        $recipe = CoreRecipe::with('ingredients.product')
            ->findOrFail($dto->recipeId);

        $ingredientsData = [];
        $canProduce = true;

        foreach ($recipe->ingredients as $ingredient) {

            $needed = $ingredient->quantity * $dto->quantity;

            $stock = CoreStock::where(
                'product_id',
                $ingredient->product_id
            )->first();

            $available = $stock?->packaging_size_input ?? 0;
            $enough = $available >= $needed;

            if (!$enough) {
                $canProduce = false;
            }

            $ingredientsData[] = [
                'product_id' => $ingredient->product_id,
                'name'       => $ingredient->product->product_name,
                'needed'     => $needed,
                'available'  => $available,
                'enough'     => $enough,
            ];
        }

        return [
            'product'      => $recipe->product->product_name,
            'quantity'     => $dto->quantity,
            'ingredients'  => $ingredientsData,
            'can_produce'  => $canProduce,
        ];
    }


    public function store(ProductionStoreDTO $dto): array
    {
        return DB::transaction(function () use ($dto) {

            $recipe = CoreRecipe::with('ingredients.product')
                ->findOrFail($dto->recipeId);


            $lastBatch = LogProduksi::where('product_id', $dto->recipeId)
                ->latest()
                ->first();

            $batchNumber = $lastBatch
                ? $lastBatch->batch + 1
                : 1;


            $ingredientsLog = [];

            foreach ($recipe->ingredients as $ingredient) {

                $needed = $ingredient->quantity * $dto->quantity;

                $stock = CoreStock::where(
                    'product_id',
                    $ingredient->product_id
                )->lockForUpdate()->first();

                if (!$stock || $stock->packaging_size_input < $needed) {
                    throw new Exception(
                        'Stock tidak cukup untuk ' .
                        $ingredient->product->product_name
                    );
                }

                $stock->packaging_size_input -= $needed;
                $stock->save();

                CoreStockTransaction::create([
                    'product_id' => $ingredient->product_id,
                    'transaction_type_id' => 3,
                    'quantity' => -$needed,
                    'transaction_date' => now(),
                    'notes' => 'Produksi batch ' . $batchNumber,
                    'created_by' => $dto->userId,
                ]);

                $ingredientsLog[] =
                    $ingredient->product->product_name . '(' . $needed . ')';
            }



            $productStock = CoreStock::where(
                'product_id',
                $dto->recipeId
            )->lockForUpdate()->first();

            $productStock->packaging_size_input += $dto->quantity;
            $productStock->save();

            CoreStockTransaction::create([
                'product_id' => $dto->recipeId,
                'transaction_type_id' => 3,
                'quantity' => $dto->quantity,
                'transaction_date' => now(),
                'notes' => 'Hasil produksi batch ' . $batchNumber,
                'created_by' => $dto->userId,
            ]);


            LogProduksi::create([
                'product_id' => $dto->recipeId,
                'batch'      => $batchNumber,
                'quantity'   => $dto->quantity,
                'description'=> $ingredientsLog,
                'created_by' => $dto->userId,
            ]);

            return [
                'message' => 'Produksi berhasil',
                'batch'   => $batchNumber,
                'product' => $recipe->product->product_name,
                'quantity'=> $dto->quantity,
            ];
        });
    }
}