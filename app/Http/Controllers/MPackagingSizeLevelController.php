<?php

namespace App\Http\Controllers;

use App\Exports\MPackagingLevelTemplateExport;
use App\Imports\MPackagingLevelImport;
use App\Models\MPackagingLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MPackagingSizeLevelController extends Controller
{
    public function index()
    {
        $query=MPackagingLevel::query();

        if(request()->has('search')){
            $search=request()->input('search');
            $query->where(function($q) use ($search){
                $q->where('level_code','like','%'.$search.'%')
                  ->orWhere('level_description','like','%'.$search.'%');
            });
        }
        $packaging_levels = $query->paginate(10)->withQueryString();

        return Inertia::render('MProductLevels/Index', [
            'productLevels' => $packaging_levels,
            'filters' => request()->only(['search']),
        ]);
    }

     public function store(Request $request)
    {
        $validated = $request->validate([
            'level_code' => ['required', 'numeric', 'unique:m_packaging_levels,level_code'],
            'level_description' => ['required', 'string'],
        ]);
        $validated['created_by'] = auth()->id();

        MPackagingLevel::create($validated);

        toast_success('Product Level berhasil ditambahkan.');

        return redirect()->route('packaging-size-levels.index');
    }

    public function update(Request $request, MPackagingLevel $packaging_size_level)
    {
        $validated = $request->validate([
            'level_code' => ['required', 'numeric', 'unique:m_packaging_levels,level_code,'.$packaging_size_level->id],
            'level_description' => ['required', 'string'],
        ]);

        $validated['updated_by'] = auth()->id();

        $packaging_size_level->update($validated);

        toast_success('Product Level berhasil diperbarui.');

        return redirect()->route('packaging-size-levels.index');
    }

    public function destroy(MPackagingLevel $packaging_size_level)
    {
        $packaging_size_level->update(['deleted_by' => auth()->id()]);
        $packaging_size_level->delete();

        toast_warning('Product Level berhasil dihapus.');

        return redirect()->route('packaging-size-levels.index');
    }

    public function downloadTemplate()
    {
        return Excel::download(new MPackagingLevelTemplateExport(), 'template_import_level_kemasan.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MPackagingLevelImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0 && count($errors) > 0) {
                toast_success("{$successCount} level kemasan berhasil diimport.");
            } elseif (count($errors) > 0) {
                toast_error('Import gagal. ' . implode(' | ', array_slice($errors, 0, 5)));
            } else {
                toast_success("{$successCount} level kemasan berhasil diimport.");
            }

            return redirect()->route('packaging-size-levels.index');
        } catch (\Exception $e) {
            Log::error('Import packaging level failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}
