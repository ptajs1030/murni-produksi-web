<?php

namespace App\Service;

use App\DTOs\ProductionCheckDTO;
use App\DTOs\ProductionStoreDTO;
use App\Models\CoreProduct;
use App\Models\CoreRecipe;
use App\Models\CoreStock;
use App\Models\CoreStockTransaction;
use App\Models\LogProduksi;
use Illuminate\Support\Facades\DB;
use Exception;

class TransactionType {
    public const PRODUKSI = 3;
}
class ProductionService
{
    public function getProducts()
    {
        return CoreProduct::where('product_type', 'Produk Jadi')->get();
    }

    public function index(?string $search = null): array
    {
        $productions = LogProduksi::query()
            ->select([
                'id',
                'product_id',
                'batch',
                'quantity',
                'created_by',
                'created_at'
            ])
            ->with([
                'product:id,product_name',
                'createdBy:id,name'
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    if (is_numeric($search)) {
                        $q->orWhere('id', (int) $search);
                    }
                    $q->orWhereHas('product', function ($q) use ($search) {
                        $q->where('product_name', 'like', "%{$search}%");
                    });
                    $q->orWhereHas('createdBy', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
                });
            })
            ->orderByDesc('created_at')
            ->paginate(10);
        return [
            'data' => $productions->items(),
            'meta' => [
                'current_page' => $productions->currentPage(),
                'last_page'    => $productions->lastPage(),
                'total'        => $productions->total(),
            ]
        ];
    }
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

            if ($recipe->ingredients->isEmpty()) {
                throw new Exception('Recipe tidak memiliki bahan');
            }

            $lastBatch = LogProduksi::where('product_id', $recipe->product_id)
                ->lockForUpdate()
                ->orderByDesc('batch')
                ->first();

            $batchNumber = $lastBatch ? $lastBatch->batch + 1 : 1;

            $ingredientsLog = [];

            foreach ($recipe->ingredients as $ingredient) {

                $needed = $ingredient->quantity * $dto->quantity;

                $stock = CoreStock::where('product_id', $ingredient->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$stock || $stock->packaging_size_input < $needed) {
                    throw new Exception(
                        'Stock tidak cukup untuk ' .
                            $ingredient->product->product_name
                    );
                }

                $stock->decrement('packaging_size_input', $needed);

                CoreStockTransaction::create([
                    'product_id' => $ingredient->product_id,
                    'transaction_type_id' => TransactionType::PRODUKSI,
                    'quantity' => -$needed,
                    'transaction_date' => now(),
                    'notes' => 'Digunakan untuk produksi '
                        . $recipe->product->product_name
                        . ' Batch ' . $batchNumber,
                    'created_by' => $dto->userId,
                ]);

                $ingredientsLog[] =
                    $ingredient->product->product_name . '(' . $needed . ')';
            }

            $productStock = CoreStock::where('product_id', $recipe->product_id)
                ->lockForUpdate()
                ->first();

            if (!$productStock) {
                throw new Exception('Stock produk belum dibuat');
            }

            $productStock->increment('packaging_size_input', $dto->quantity);

            CoreStockTransaction::create([
                'product_id' => $recipe->product_id,
                'transaction_type_id' => TransactionType::PRODUKSI,
                'quantity' => $dto->quantity,
                'transaction_date' => now(),
                'notes' => 'Produksi '
                    . $productStock->product->product_name
                    . ' Batch ' . $batchNumber,
                'created_by' => $dto->userId,
            ]);

            LogProduksi::create([
                'product_id' => $recipe->product_id,
                'batch' => $batchNumber,
                'quantity' => $dto->quantity,
                'description' => json_encode($ingredientsLog),
                'created_by' => $dto->userId,
            ]);

            return [
                'message' => 'Produksi berhasil',
                'batch' => $batchNumber,
                'product' => $recipe->product->product_name,
                'quantity' => $dto->quantity,
            ];
        });
    }
}
