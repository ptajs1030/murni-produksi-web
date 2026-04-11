<?php

namespace App\Service;

use App\Models\CoreProduct;
use App\Models\CoreStock;
use App\Models\CoreStockTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RepackService
{
    public function getRepack(?string $search = null): array
    {

        $query = CoreProduct::where("product_type", "Produk Bahan Baku")
            ->with(['stocks', 'packagingSize']);

        if ($search !=null) {
            $search = $search;
            $query->where(function ($q) use ($search) {
                $q->where('product_unit_sku', 'like', "%{$search}%")
                    ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('product_name')->paginate(15);

        $repack = /*CoreStockTransaction::query()
            ->select([
                'id',
                'product_id',
                'quantity',
                'notes',
                'created_by',
                'created_at'
            ])
            ->where('transaction_type_id', 4)
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
            })*/
      CoreProduct::where("product_type", "Produk Bahan Baku")
            ->with(['stocks', 'packagingSize'])
            ->select('id', 'product_name', 'product_unit_sku', 'm_packaging_size_id')
            ->orderByDesc('created_at')
            ->paginate(10);
       /* $results = $repack->map(function ($item) {
            return [
                'id'             => $item->product_id,
                'productName'   => $item->product->product_name ?? '-',
                'packagingSize' => $item->product->packagingSize->packaging_size_name ?? '-',
                'productQty'      => $item->packaging_size_input ?? 0,
                'productUnitSku' => $item->product->product_unit_sku ?? '-',
            ];
        });*/

        return [
            'data' => $products,
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'total'        => $products->total(),
            ]
        ];
    }
    public function handle(array $data): void
    {
        DB::transaction(function () use ($data) {
            $sourceStock = CoreStock::where('product_id', $data['source_product_id'])->first();
            if (!$sourceStock) {
                throw ValidationException::withMessages([
                    'source_product_id' => 'Stock tidak ditemukan'
                ]);
            }
            if ($sourceStock->packaging_size_input < $data['source_quantity']) {
                throw ValidationException::withMessages([
                    'source_quantity' => 'Stock tidak mencukupi'
                ]);
            }
            $sourceStock->decrement('packaging_size_input', $data['source_quantity']);
            CoreStockTransaction::create([
                'product_id' => $data['source_product_id'],
                'quantity' => -$data['source_quantity'],
                'transaction_type_id' => 4,
                'transaction_date' => now(),
                'notes' => 'Product direpack menjadi ' . count($data['target_products']) . ' produk',
                'created_by' => auth()->id(),
            ]);
            foreach ($data['target_products'] as $target) {
                $targetStock = CoreStock::where('product_id', $target['product_id'])->first();
                if (!$targetStock) {
                    throw ValidationException::withMessages([
                        'target_products' => 'Product hasil repack tidak ditemukan'
                    ]);
                }
                $targetStock->increment('packaging_size_input', $target['quantity']);
                CoreStockTransaction::create([
                    'product_id' => $target['product_id'],
                    'quantity' => $target['quantity'],
                    'transaction_type_id' => 4,
                    'transaction_date' => now(),
                    'notes' => 'Product direpack dari ' . $data['source_product_id'],
                    'created_by' => auth()->id(),
                ]);
            }
        });
    }
}
