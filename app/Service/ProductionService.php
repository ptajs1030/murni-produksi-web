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

class TransactionType
{
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
                'description',
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
        $data = collect($productions->items())->map(function ($item, $index) use ($productions) {
        return [
            'no'          => ($productions->currentPage() - 1) * $productions->perPage() + $index + 1,
            'nama_produk' => $item->product->product_name,
            'batch'       => $item->batch,
            'deskripsi'   => $item->description,
            'qty'         => $item->quantity,
            'pic'         => $item->createdBy?->name,
            'tanggal'     => optional($item->created_at)->format('d M Y, H.i'),
        ];
    });
        return [
        'data' => $data,
        'meta' => [
            'current_page' => $productions->currentPage(),
            'last_page'    => $productions->lastPage(),
            'total'        => $productions->total(),
        ]
    ];
        
    }
    public function check(ProductionCheckDTO $dto): array
    {
        $product=CoreProduct::findOrFail($dto->recipeId);
        $recipe = CoreRecipe::with('ingredients.product')
            ->where('product_id', $product->id)
            ->first();

        $ingredientsData = [];
        $canProduce = true;

        $productIds = $recipe->ingredients->pluck('product_id')->toArray();
        $stocks = CoreStock::whereIn('product_id', $productIds)->get()->keyBy('product_id');

        foreach ($recipe->ingredients as $ingredient) {

            $needed = $ingredient->quantity * $dto->quantity;

            $stock = $stocks->get($ingredient->product_id);

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

            $product=CoreProduct::findOrFail($dto->recipeId);
            $recipe = CoreRecipe::with('ingredients.product')
                ->where('product_id', $product->id)
                ->first();

            if ($recipe->ingredients->isEmpty()) {
                throw new Exception('Recipe tidak memiliki bahan');
            }

            $lastBatch = LogProduksi::where('product_id', $recipe->product_id)
                ->lockForUpdate()
                ->orderByDesc('batch')
                ->first();

            $batchNumber = $lastBatch ? $lastBatch->batch + 1 : 1;

            $ingredientsLog = [];
            $productIds = $recipe->ingredients->pluck('product_id')->toArray();
            $stocks = CoreStock::whereIn('product_id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('product_id');

            foreach ($recipe->ingredients as $ingredient) {

                $needed = $ingredient->quantity * $dto->quantity;

                $stock = $stocks->get($ingredient->product_id);

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
                $productStock = CoreStock::create([
                    'product_id' => $recipe->product_id,
                    'packaging_size_input' => 0,
                    'in_stock' => 0,
                    'created_by' => $dto->userId ?? 1,
                ]);
            }

            $productStock->increment('packaging_size_input', $dto->quantity);

            CoreStockTransaction::create([
                'product_id' => $recipe->product_id,
                'transaction_type_id' => TransactionType::PRODUKSI,
                'quantity' => $dto->quantity,
                'transaction_date' => now(),
                'notes' => 'Produksi '
                    . $recipe->product->product_name
                    . ' Batch ' . $batchNumber,
                'created_by' => $dto->userId,
            ]);

            LogProduksi::create([
                'product_id' => $recipe->product_id,
                'batch'      => $batchNumber,
                'quantity'   => $dto->quantity,
                'description'=> $ingredientsLog,
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
