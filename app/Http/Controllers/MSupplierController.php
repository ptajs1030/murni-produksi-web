<?php

namespace App\Http\Controllers;

use App\Exports\MSupplierExport;
use App\Exports\MSupplierTemplateExport;
use App\Imports\MSupplierImport;
use App\Models\MSupplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MSupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = MSupplier::query();
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('supplier_name', 'like', "%{$search}%");
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

    public function export(Request $request)
    {
        $fileName = 'suppliers-' . date('Y-m-d-His') . '.xlsx';

        return Excel::download(new MSupplierExport($request), $fileName);
    }

    public function downloadTemplate()
    {
        return Excel::download(new MSupplierTemplateExport(), 'template_import_supplier.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MSupplierImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0 && count($errors) > 0) {
                toast_success("{$successCount} supplier berhasil diimport.");
            } elseif (count($errors) > 0) {
                toast_error('Import gagal. ' . implode(' | ', array_slice($errors, 0, 5)));
            } else {
                toast_success("{$successCount} supplier berhasil diimport.");
            }

            return redirect()->route('suppliers.index');
        } catch (\Exception $e) {
            Log::error('Import supplier failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}
