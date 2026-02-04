<?php

namespace App\Http\Controllers;

use App\Exports\MCategoryExport;
use App\Models\MCategory;
use Illuminate\Http\Request;
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
}

