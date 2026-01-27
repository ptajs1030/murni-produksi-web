<?php

namespace App\Http\Controllers;

use App\Models\CoreIncomingProduct;
use App\Models\CoreProduct;
use App\Models\CoreStock;
use Illuminate\Http\Request;
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

        $products = CoreProduct::select('id', 'product_name')->orderBy('product_name')->get();

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
            'stock' => $validated['stock'],
        ]);

        $coreStock=CoreStock::firstOrCreate([
            'product_id' => $validated['product_id'],
        ], [
            'packaging_size_input' => $validated['stock'],
            'in_stock' => 1,
            'track_stock' => true,
            'track_alert' => false,
            'stock_alert' => false,
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
            'deleted_by' => null,
        ]);

        $coreStock->packaging_size_input += $validated['stock'];
        $coreStock->cost_amount = $validated['price'];
        $coreStock->updated_by = auth()->id();
        $coreStock->save();
        
        toast_success('Barang datang berhasil ditambahkan.');
        return redirect()->route('incoming-goods.index');
    }
}
