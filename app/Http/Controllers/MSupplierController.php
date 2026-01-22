<?php

namespace App\Http\Controllers;

use App\Models\MSupplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MSupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = MSupplier::query();
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }
        $suppliers = $query->paginate(10);
        return Inertia::render('MSuppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search']),
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_code' => ['required', 'string', 'max:5', 'unique:m_suppliers,supplier_code'],
            'supplier_name' => ['required', 'string', 'max:50'],
        ]);
        $validated['created_by'] = auth()->id();

        MSupplier::create($validated);

        toast_success('Supplier berhasil ditambahkan.');

        return redirect()->route('suppliers.index');
    }

    public function update(Request $request, MSupplier $supplier)
    {
        $validated = $request->validate([
            'supplier_code' => ['required', 'string', 'max:5', 'unique:m_suppliers,supplier_code,'.$supplier->id],
            'supplier_name' => ['required', 'string', 'max:50'],
        ]);

        $supplier->update($validated);

        toast_success('Supplier berhasil diperbarui.');

        return redirect()->route('suppliers.index');
    }

    public function destroy(MSupplier $supplier)
    {
        $supplier->update(['deleted_by' => auth()->id()]);
        $supplier->delete();

        toast_warning('Supplier berhasil dihapus.');

        return redirect()->route('suppliers.index');
    }

    // Method export baru
    // public function export(Request $request)
    // {
    //     $fileName = 'suppliers-' . date('Y-m-d-His') . '.xlsx';

    //     return Excel::download(new MSupplierExport($request), $fileName);
    // }
}
