<?php

namespace App\Http\Controllers;

use App\Models\CoreIncomingProduct;
use App\Models\CoreProduct;
use App\Models\CoreStock;
use App\Models\CoreStockTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CoreIncomingProductController extends Controller
{
    public function index(Request $request)
    {
        $query = CoreIncomingProduct::query()->with('product');

        if ($request->filled('search')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('product_name', 'like', '%' . $request->search . '%');
            });
        }

        $query->orderByDesc('created_at');
        $incoming = $query->paginate(10)->withQueryString();

        $products = CoreProduct::select('id', 'product_name')->where('product_type', 'Produk Bahan Baku')->orderBy('product_name')->get();

        return Inertia::render('CoreIncomingProduct/Index', [
            'incoming' => $incoming,
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:core_products,id',
            'stock' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        CoreIncomingProduct::create([
            'product_id' => $validated['product_id'],
            'packaging_size_input' => $validated['stock'],
            'stock'=>1,
            'price' => $validated['price'],
            'created_by' => auth()->user()->id,
            'updated_by' => null,
            'deleted_by' => null,   
        ]);

        
        toast_success('Barang datang berhasil ditambahkan.');
        return redirect()->route('incoming-goods.index');
    }

    public function updateStatus(Request $request, CoreIncomingProduct $incomingProduct)
    {
        $validated = $request->validate([
            'status' => 'required|in:APPROVED,REJECTED',
        ]);

        DB::beginTransaction();
        try {
            $incomingProduct->update([
                'status' => $validated['status'],
                'updated_by' => auth()->id(),
            ]);

        // Jika status APPROVED, tambahkan ke stock
            if ($validated['status'] === 'APPROVED') {
                $coreStock = CoreStock::firstOrCreate([
                    'product_id' => $incomingProduct->product_id,
                ], [
                    'packaging_size_input' => 0,
                    'in_stock' => 1,
                    'track_stock' => true,
                    'track_alert' => false,
                    'stock_alert' => false,
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                    'deleted_by' => null,
                ]);

                $coreStock->packaging_size_input += $incomingProduct->packaging_size_input;
                $coreStock->cost_amount = $incomingProduct->price;
                $coreStock->updated_by = auth()->id();
                $coreStock->save();

                CoreStockTransaction::create([
                    'product_id' => $incomingProduct->product_id,
                    'transaction_type_id' => 1,
                    'quantity' => $incomingProduct->packaging_size_input,
                    'transaction_date' => now(),
                    'notes'=> "Barang Datang",
                    'created_by' => auth()->id(),
                    'updated_by' => null,
                    'deleted_by' => null,
                ]);
            }
            DB::commit();
            toast_success('Status berhasil diperbarui.');
            return redirect()->route('incoming-goods.index');
        } catch (\Exception $th) {
            DB::rollBack();
            toast_error('Gagal memperbarui status.');
            return redirect()->route('incoming-goods.index');
        }

    }
}
