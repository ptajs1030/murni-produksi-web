<?php

namespace App\Http\Controllers;

use App\Exports\MPackagingSizeTypeTemplateExport;
use App\Imports\MPackagingSizeTypeImport;
use App\Models\MPackagingSizeType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MPackagingSizeTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = MPackagingSizeType::query();
       if($request->has('search')){
            $search=$request->input('search');
            $query->where(function($q) use ($search){
                $q->where('type_code','like','%'.$search.'%')
                  ->orWhere('type_description','like','%'.$search.'%');
            });
        }

        $packaging_size_types = $query->paginate(10)->withQueryString();
        return Inertia::render('MPackagingSizeTypes/Index', [
            'packagingSizeTypes' => $packaging_size_types,
            'filters' => $request->only(['search']),
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_code' => ['required', 'string', 'max:10', 'unique:m_packaging_size_types,type_code'],
            'type_description' => ['required', 'string', 'max:50'],
            'base_unit' => ['required', 'string', 'max:10'],
        ]);
        $validated['created_by'] = auth()->id();

        MPackagingSizeType::create($validated);

        toast_success('Tipe ukuran kemasan berhasil ditambahkan.');

        return redirect()->route('packaging-size-types.index');
    }

    public function update(Request $request, MPackagingSizeType $packagingSizeType)
    {
        $validated = $request->validate([
            'type_code' => ['required', 'string', 'max:10', 'unique:m_packaging_size_types,type_code,'.$packagingSizeType->id],
            'type_description' => ['required', 'string', 'max:50'],
            'base_unit' => ['required', 'string', 'max:10'],
        ]);
        $validated['updated_by'] = auth()->id();

        $packagingSizeType->update($validated);

        toast_success('Tipe ukuran kemasan berhasil diperbarui.');

        return redirect()->route('packaging-size-types.index');
    }

    public function destroy(MPackagingSizeType $packagingSizeType)
    {
        $packagingSizeType->update(['deleted_by' => auth()->id()]);
        $packagingSizeType->delete();

        toast_warning('Tipe ukuran kemasan berhasil dihapus.');

        return redirect()->route('packaging-size-types.index');
    }

    public function downloadTemplate()
    {
        return Excel::download(new MPackagingSizeTypeTemplateExport(), 'template_import_tipe_ukuran_kemasan.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MPackagingSizeTypeImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0) {
                toast_success("{$successCount} tipe ukuran kemasan berhasil diimport.");
            }
            if (count($errors) > 0) {
                toast_error('Beberapa baris gagal: ' . implode(' | ', array_slice($errors, 0, 5)));
            }

            return redirect()->route('packaging-size-types.index');
        } catch (\Exception $e) {
            Log::error('Import packaging size type failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}
