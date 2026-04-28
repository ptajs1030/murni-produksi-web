<?php

namespace App\Http\Controllers;

use App\Exports\MPackagingTypeTemplateExport;
use App\Imports\MPackagingTypeImport;
use App\Models\MPackagingLevel;
use App\Models\MPackagingType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MPackagingTypeController extends Controller
{
    public function index(Request $request)
    {
        $query=MPackagingType::query();
        if($request->has('search')){
            $search=$request->input('search');
            $query->where(function($q) use ($search){
                $q->where('packaging_type_code','like','%'.$search.'%')
                  ->orWhere('packaging_type_name','like','%'.$search.'%');
            });
        }
        $query->with('packagingLevel');
        $packaging_types = $query->paginate(10)->withQueryString();
        return Inertia::render('MPackagingTypes/Index', [
            'packaging_types' => $packaging_types,
            'packagingLevels' => MPackagingLevel::all(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'packaging_type_code' => ['required', 'string', 'max:5', 'unique:m_packaging_types,packaging_type_code'],
            'packaging_type_name' => ['required', 'string', 'max:255'],
            'packaging_level_id' => ['required', 'exists:m_packaging_levels,id'],
        ]);
        $validated['created_by'] = auth()->id();

        MPackagingType::create($validated);

        toast_success('Tipe Kemasan berhasil ditambahkan.');

        return redirect()->route('packaging-types.index');
    }

    public function update(Request $request, MPackagingType $packaging_type)
    {
        $validated = $request->validate([
            'packaging_type_code' => ['required', 'string', 'max:5', 'unique:m_packaging_types,packaging_type_code,'.$packaging_type->id],
            'packaging_type_name' => ['required', 'string', 'max:255'],
            'packaging_level_id' => ['required', 'exists:m_packaging_levels,id'],
        ]);
        $validated['updated_by'] = auth()->id();

        $packaging_type->update($validated);

        toast_success('Tipe Kemasan berhasil diperbarui.');

        return redirect()->route('packaging-types.index');
    }

    public function destroy(MPackagingType $packaging_type)
    {
        $packaging_type->update(['deleted_by' => auth()->id()]);
        $packaging_type->delete();

        toast_warning('Tipe Kemasan berhasil dihapus.');

        return redirect()->route('packaging-types.index');
    }

    public function downloadTemplate()
    {
        return Excel::download(new MPackagingTypeTemplateExport(), 'template_import_tipe_kemasan.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MPackagingTypeImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0 && count($errors) > 0) {
                toast_success("{$successCount} tipe kemasan berhasil diimport.");
            } elseif (count($errors) > 0) {
                toast_error('Import gagal. ' . implode(' | ', array_slice($errors, 0, 5)));
            } else {
                toast_success("{$successCount} tipe kemasan berhasil diimport.");
            }

            return redirect()->route('packaging-types.index');
        } catch (\Exception $e) {
            Log::error('Import packaging type failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}
