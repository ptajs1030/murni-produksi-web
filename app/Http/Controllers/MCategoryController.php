<?php

namespace App\Http\Controllers;

use App\Exports\MCategoryExport;
use App\Exports\MCategoryTemplateExport;
use App\Imports\MCategoryImport;
use App\Models\MCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query= MCategory::query();
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('category_name', 'like', "%{$search}%");
        }
        $categories = $query->paginate(10);
        return Inertia::render('MCategories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

 public function store(Request $request)
    {
        $validated = $request->validate([
            'category_code' => ['required', 'string', 'max:5', 'unique:m_categories,category_code'],
            'category_name' => ['required', 'string', 'max:50'],
        ]);
        $validated['created_by'] = auth()->id();

        MCategory::create($validated);

        toast_success('Kategori berhasil ditambahkan.');

        return redirect()->route('categories.index');
    }

    public function update(Request $request, MCategory $category)
    {
        $validated = $request->validate([
            'category_code' => ['required', 'string', 'max:5', 'unique:m_categories,category_code,'.$category->id],
            'category_name' => ['required', 'string', 'max:50'],
        ]);
        $validated['updated_by'] = auth()->id();

        $category->update($validated);

        toast_success('Kategori berhasil diperbarui.');

        return redirect()->route('categories.index');
    }

    public function destroy(MCategory $category)
    {
        $category->update(['deleted_by' => auth()->id()]);
        $category->delete();

        toast_warning('Kategori berhasil dihapus.');

        return redirect()->route('categories.index');
    }

    public function export(Request $request)
    {
        $fileName = 'categories-' . date('Y-m-d-His') . '.xlsx';

        return Excel::download(new MCategoryExport($request), $fileName);
    }

    public function downloadTemplate()
    {
        return Excel::download(new MCategoryTemplateExport(), 'template_import_kategori.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MCategoryImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0 && count($errors) > 0) {
                toast_success("{$successCount} kategori berhasil diimport.");
            } elseif (count($errors) > 0) {
                toast_error('Import gagal. ' . implode(' | ', array_slice($errors, 0, 5)));
            } else {
                toast_success("{$successCount} kategori berhasil diimport.");
            }

            return redirect()->route('categories.index');
        } catch (\Exception $e) {
            Log::error('Import category failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}

