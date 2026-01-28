<?php

namespace App\Http\Controllers;

use App\Models\CoreOutgoingProduct;
use App\Models\CoreProduct;
use App\Models\CoreStock;
use App\Models\MOutType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoreOutgoingProductController extends Controller
{
    public function index(Request $request)
    {
        $query = CoreOutgoingProduct::query()->with(['product', 'outType']);

        if ($request->filled('search')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('product_name', 'like', '%' . $request->search . '%');
            });
        }

        $query->orderByDesc('created_at');
        $outgoing = $query->paginate(10)->withQueryString();

        $products = CoreProduct::select('id', 'product_name')->orderBy('product_name')->get();
        $outTypes = MOutType::select('id', 'out_type_name')->orderBy('out_type_name')->get();

        return Inertia::render('CoreOutgoingProduct/Index', [
            'outgoing' => $outgoing,
            'products' => $products,
            'outTypes' => $outTypes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:core_products,id',
            'out_type_id' => 'required|exists:m_out_types,id',
            'quantity' => 'required|integer|min:1',
        ]);
        $stock=CoreStock::where('product_id', $validated['product_id'])->first();
        if (!$stock) {
            toast_error('Stok produk tidak ditemukan.');
            return redirect()->route('outgoing-goods.index');
        }
        if ($stock->packaging_size_input < $validated['quantity']) {
            toast_error('Stok produk tidak cukup.');
            return redirect()->route('outgoing-goods.index');
        }

        CoreOutgoingProduct::create([
            'product_id' => $validated['product_id'],
            'out_type_id' => $validated['out_type_id'],
            'stock' => 1,
            'packaging_size_input' => $validated['quantity'],

        ]);

        $stock->packaging_size_input -= $validated['quantity'];
        $stock->updated_by = auth()->id();
        $stock->save();
        toast_success('Barang keluar berhasil ditambahkan.');
        return redirect()->route('outgoing-goods.index');
    }
}
