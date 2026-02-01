<?php

namespace App\Http\Controllers;

use App\Models\CoreProduct;
use App\Models\CoreStock;
use App\Models\CoreStockTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RepackController extends Controller
{
    public function index(Request $request)
    {
        $query = CoreProduct::where("product_type", "Produk Bahan Baku")
            ->with(['stocks', 'packagingSize']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('product_unit_sku', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('product_name')->paginate(15);

        $repackProducts = CoreProduct::where("product_type", "Produk Bahan Baku")
            ->with(['stocks', 'packagingSize'])
            ->select('id', 'product_name', 'product_unit_sku', 'm_packaging_size_id')
            ->orderBy('product_name')
            ->get();

        return Inertia::render("Repack/Index", [
            "products" => $products,
            "repackProducts" => $repackProducts,
            "filters" => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_product_id' => 'required|exists:core_products,id',
            'source_quantity' => 'required|integer|min:1',
            'target_products' => 'required|array|min:1',
            'target_products.*.product_id' => 'required|exists:core_products,id',
            'target_products.*.quantity' => 'required|integer|min:1',
        ]);

        $sourceStock = CoreStock::where('product_id', $validated['source_product_id'])->first();

        if (!$sourceStock) {
            toast_error("Stock tidak ditemukan");
            return back();
        }

        if ($sourceStock->packaging_size_input < $validated['source_quantity']) {
            toast_error("Stock tidak mencukupi");
            return back();
        }

        DB::beginTransaction();
        try {
            $sourceStock->decrement('packaging_size_input', $validated['source_quantity']);
            CoreStockTransaction::create([
                "product_id" => $validated['source_product_id'],
                "quantity" => $validated['source_quantity'],
                "transaction_type_id" => 2,
                "transaction_date" => now(),
                "notes" => "Product di repack menjadi " . count($validated['target_products']) . " produk",
                "created_by"=> auth()->user()->id
            ]);

            foreach ($validated['target_products'] as $target) {
                $targetStock = CoreStock::where('product_id', $target['product_id'])->first();
                
                if ($targetStock) {
                    $targetStock->increment('packaging_size_input', $target['quantity']);
                } else {
                    toast_error("Product hasil repack tidak ditemukan");
                    return back();
                }
            }

            DB::commit();
            toast_success('Repack berhasil dilakukan');
            return back();

        } catch (\Exception $e) {
            DB::rollBack();
            toast_error('Gagal melakukan repack: ' . $e->getMessage());
            return back();
        }
    }
}
