<?php

namespace App\Service;

use App\Models\CoreOutgoingProduct;
use App\Models\CoreStock;
use App\Models\CoreStockTransaction;
use App\Models\CoreProduct;
use App\Models\MOutType;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OutgoingProductService
{
    /**
     * Get outgoing products with pagination and optional search
     */
    public function getOutgoingProducts(?string $search = null)
    {
        $query = CoreOutgoingProduct::query()->with(['product', 'outType']);

        if ($search) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('product_name', 'like', '%' . $search . '%');
            });
        }

        $query->orderByDesc('created_at');
        return $query->paginate(10);
    }

    /**
     * Get products for the form
     */
    public function getProducts()
    {
        return CoreProduct::with(['stocks'])
            ->where('product_type', 'Produk Jadi')
            ->orderBy('product_name')
            ->get();
    }

    /**
     * Get out types for the form
     */
    public function getOutTypes()
    {
        return MOutType::select('id', 'out_type_name')
            ->where('id', 7)
            ->get();
    }

    /**
     * Store a new outgoing product
     */
    public function storeOutgoingProduct(array $data): CoreOutgoingProduct
    {
        return DB::transaction(function () use ($data) {
            $stock = CoreStock::where('product_id', $data['product_id'])->first();

            if (!$stock) {
                throw ValidationException::withMessages([
                    'product_id' => 'Stok produk tidak ditemukan.'
                ]);
            }

            if ($stock->packaging_size_input < $data['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => 'Stock tidak cukup'
                ]);
            }

            $outgoingProduct = CoreOutgoingProduct::create([
                'product_id' => $data['product_id'],
                'out_type_id' => $data['out_type_id'],
                'stock' => 1,
                'created_by' => auth()->id(),
                'updated_by' => null,
                'deleted_by' => null,
                'packaging_size_input' => $data['quantity'],
            ]);

            $stock->packaging_size_input -= $data['quantity'];
            $stock->updated_by = auth()->id();
            $stock->save();

            CoreStockTransaction::create([
                'product_id' => $data['product_id'],
                'transaction_type_id' => 2,
                'quantity' => -$data['quantity'],
                'transaction_date' => now(),
                'notes' => 'Barang Keluar',
                'created_by' => auth()->id(),
                'updated_by' => null,
                'deleted_by' => null,
            ]);

            return $outgoingProduct;
        });
    }
}
