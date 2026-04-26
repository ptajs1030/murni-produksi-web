<?php

namespace App\Http\Controllers;

use App\Exports\MPackagingSizeTemplateExport;
use App\Imports\MPackagingSizeImport;
use App\Models\MPackagingLevel;
use App\Models\MPackagingSize;
use App\Models\MPackagingSizeType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MPackagingSizeController extends Controller
{
    public function index(Request $request){
        $query=MPackagingSize::query()->with('sizeType','packagingLevel');
        if($request->has('search')){
            $query->where('packaging_size_code','like','%'.$request->search.'%')
            ->orWhere('packaging_size_name','like','%'.$request->search.'%');
        }

        $data=$query->paginate(10);


        return Inertia::render('MPackagingSizes/Index', [
            'packagingSizes' => $data,
            'filters'=>$request->all(['search']),
            'packagingSizeTypes' => MPackagingSizeType::all(),
            'packagingSizeLevels' => MPackagingLevel::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'packaging_size_code' => ['required', 'string', 'max:5', 'unique:m_packaging_sizes,packaging_size_code'],
            'packaging_size_name' => ['required', 'string', 'max:50'],
            'packaging_size_type_id' => ['required', 'exists:m_packaging_size_types,id'],
            'packaging_level_id' => ['required', 'exists:m_packaging_levels,id'],
            'unit_conversion_value' => ['required', 'numeric', 'min:1'],
        ]);
        $validated['created_by'] = auth()->id();

        MPackagingSize::create($validated);

        toast_success('Ukuran kemasan berhasil ditambahkan.');

        return redirect()->route('packaging-sizes.index');
    }

    public function update(Request $request, MPackagingSize $packagingSize)
    {
        $validated = $request->validate([
            'packaging_size_code' => ['required', 'string', 'max:5', 'unique:m_packaging_sizes,packaging_size_code,'.$packagingSize->id],
            'packaging_size_name' => ['required', 'string', 'max:50'],
            'packaging_size_type_id' => ['required', 'exists:m_packaging_size_types,id'],
            'packaging_level_id' => ['required', 'exists:m_packaging_levels,id'],
            'unit_conversion_value' => ['required', 'numeric', 'min:1'],
        ]);
        $validated['updated_by'] = auth()->id();

        $packagingSize->update($validated);

        toast_success('Ukuran kemasan berhasil diperbarui.');

        return redirect()->route('packaging-sizes.index');
    }

    public function destroy(MPackagingSize $packagingSize)
    {
        $packagingSize->update(['deleted_by' => auth()->id()]);
        $packagingSize->delete();

        toast_warning('Ukuran kemasan berhasil dihapus.');

        return redirect()->route('packaging-sizes.index');
    }

    public function downloadTemplate()
    {
        return Excel::download(new MPackagingSizeTemplateExport(), 'template_import_ukuran_kemasan.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MPackagingSizeImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0) {
                toast_success("{$successCount} ukuran kemasan berhasil diimport.");
            }
            if (count($errors) > 0) {
                toast_error('Beberapa baris gagal: ' . implode(' | ', array_slice($errors, 0, 5)));
            }

            return redirect()->route('packaging-sizes.index');
        } catch (\Exception $e) {
            Log::error('Import packaging size failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}
