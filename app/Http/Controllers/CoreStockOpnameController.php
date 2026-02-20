<?php

namespace App\Http\Controllers;

use App\Exports\MStockOpnameProductsExport;
use App\Models\CoreProduct;
use App\Models\CoreStock;
use App\Models\CoreStockOpname;
use App\Models\CoreStockOpnameProduct;
use App\Models\MWarehouse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class CoreStockOpnameController extends Controller
{
    public function index(Request $request)
    {
        $query = CoreStockOpname::query()->with(['warehouse', 'stockOpnameProducts']);

        if ($request->has('date_from')) {
            $query->where('date_request', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('date_request', '<=', $request->date_to);
        }

        if ($request->has('created_by')) {
            $query->where('created_by', $request->created_by);
        }

        $stockOpnames = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('CoreStockOpname/Index', [
            'stockOpnames' => $stockOpnames,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'created_by']),
        ]);
    }

    public function store(Request $request)
    {
        CoreStockOpname::create([
            'date_request' => Carbon::now(),
            'total_request' => 0,
            'is_submitted' => false,
            'created_by' => $request->user()->id,
        ]);

        toast_success('Stock opname berhasil dibuat');
        return redirect()->route('stock-opnames.index');
    }

    public function show(Request $request, $id)
    {
        $stockOpname = CoreStockOpname::findOrFail($id);

        $query = CoreStockOpnameProduct::query()->with(['stock', 'product']);

        $query->where('stock_opname_id', $id);

        if ($request->has('search')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('product_name', 'like', '%' . $request->search . '%');
            });
        }
        
        $stockOpnameProducts = $query->paginate(15);

        $existingProductIds = CoreStockOpnameProduct::where('stock_opname_id', $id)
            ->pluck('product_id')
            ->toArray();

        $availableProducts = CoreProduct::whereNotIn('id', $existingProductIds)
            ->select('id', 'product_name', 'product_unit_sku')
            ->with(['stocks' => function ($q) {
                $q->select('id', 'product_id', 'packaging_size_input');
            }])
            ->orderBy('product_name')
            ->get();

        return Inertia::render('CoreStockOpnameProducts/Index', [
            'stockOpname' => $stockOpname,
            'stockOpnameProducts' => $stockOpnameProducts,
            'availableProducts' => $availableProducts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function storeProduct(Request $request, $id)
    {
        $stockOpname = CoreStockOpname::findOrFail($id);

        if ($stockOpname->is_submitted) {
            return back()->withErrors(['error' => 'Stock opname sudah disubmit, tidak dapat menambah product']);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:core_products,id',
            'real_quantity' => 'required|integer|min:0',
            'expired_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string|max:1000',
        ]);

        $stock = CoreStock::where('product_id', $validated['product_id'])->first();

        if (!$stock) {
            return back()->withErrors(['product_id' => 'Product tidak memiliki data stock']);
        }

        $exists = CoreStockOpnameProduct::where('stock_opname_id', $id)
            ->where('product_id', $validated['product_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['product_id' => 'Product sudah ada dalam stock opname ini']);
        }

        CoreStockOpnameProduct::create([
            'stock_opname_id' => $id,
            'product_id' => $validated['product_id'],
            'stock_id' => $stock->id,
            'real_quantity' => $validated['real_quantity'],
            'expired_quantity' => $validated['expired_quantity'],
            'description' => $validated['description'],
            'status' => 'PENDING',
            'created_by' => $request->user()->id,
        ]);

        $stockOpname->increment('total_request');

        toast_success('Product berhasil ditambahkan ke stock opname');
        return back();
    }

    public function deleteProduct(Request $request, $id, $productId)
    {
        $stockOpname = CoreStockOpname::findOrFail($id);

        if ($stockOpname->is_submitted) {
            return back()->withErrors(['error' => 'Stock opname sudah disubmit, tidak dapat menghapus product']);
        }

        $stockOpnameProduct = CoreStockOpnameProduct::where('stock_opname_id', $id)
            ->where('product_id', $productId)
            ->firstOrFail();

        $stockOpnameProduct->delete();
    
        $stockOpname->decrement('total_request');

        toast_success('Product berhasil dihapus dari stock opname');
        return back();
    }

    public function submit(Request $request, $id)
    {
        $stockOpname = CoreStockOpname::findOrFail($id);

        if ($stockOpname->is_submitted) {
            return back()->withErrors(['error' => 'Stock opname sudah disubmit sebelumnya']);
        }

        $productCount = CoreStockOpnameProduct::where('stock_opname_id', $id)->count();
        
        if ($productCount === 0) {
            return back()->withErrors(['error' => 'Tidak ada product dalam stock opname, tidak dapat submit']);
        }

        $stockOpname->update([
            'is_submitted' => true,
            'updated_by' => $request->user()->id,
        ]);

        toast_success('Stock opname berhasil disubmit');
        return back();
    }

    public function ownerAction(Request $request, $id, $productId)
    {
        $stockOpname = CoreStockOpname::findOrFail($id);

        if (!$stockOpname->is_submitted) {
            return back()->withErrors(['error' => 'Stock opname belum disubmit']);
        }

        $validated = $request->validate([
            'action' => 'required|in:update_stock,ignore',
        ]);

        $stockOpnameProduct = CoreStockOpnameProduct::where('stock_opname_id', $id)
            ->where('product_id', $productId)
            ->with('stock')
            ->firstOrFail();

        DB::beginTransaction();
        try {
            if ($validated['action'] === 'update_stock') {
                $stock = CoreStock::findOrFail($stockOpnameProduct->stock_id);
                $stock->update([
                    'packaging_size_input' => $stockOpnameProduct->real_quantity,
                    'updated_by' => $request->user()->id,
                ]);

                $stockOpnameProduct->update([
                    'status' => 'APPROVED',
                    'updated_by' => $request->user()->id,
                ]);

                toast_success('Stock berhasil diupdate sesuai input admin');
            } else {
                $stockOpnameProduct->update([
                    'status' => 'REJECTED',
                    'updated_by' => $request->user()->id,
                ]);

                toast_success('Perbedaan stock diabaikan');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memproses aksi owner: ' . $e->getMessage()]);
        }

        return back();
    }

    public function export(Request $request)
    {
        $fileName = 'stock-opname-' . date('Y-m-d-His') . '.xlsx';

        return Excel::download(new MStockOpnameProductsExport($request), $fileName);
    }
}

