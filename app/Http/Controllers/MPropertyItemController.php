<?php

namespace App\Http\Controllers;

use App\Exports\MPropertyItemTemplateExport;
use App\Imports\MPropertyItemImport;
use App\Models\MPropertyItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MPropertyItemController extends Controller
{
    public function index(Request $request)
    {
        $query=MPropertyItem::query();

        if($request->has('search')){
            $search=$request->input('search');
            $query->where(function($q) use ($search){
                $q->where('property_code','like','%'.$search.'%')
                  ->orWhere('property_name','like','%'.$search.'%');
            });
        }
        $property_items = $query->paginate(10)->withQueryString();

        return Inertia::render('MPropertyItems/Index', [
            'propertyItems' => $property_items,
            'filters' => $request->only(['search']),
        ]);

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_code' => ['required', 'string', 'max:1', 'unique:m_property_items,property_code'],
            'property_name' => ['required', 'string', 'max:20'],
        ]);
        $validated['created_by'] = auth()->id();

        MPropertyItem::create($validated);

        toast_success('Property Item berhasil ditambahkan.');

    return redirect()->route('property-items.index');
    }

    public function update(Request $request, MPropertyItem $propertyItem)
    {
        $validated = $request->validate([
            'property_code' => ['required', 'string', 'max:1', 'unique:m_property_items,property_code,'.$propertyItem->id],
            'property_name' => ['required', 'string', 'max:20'],
        ]);

        $validated['updated_by'] = auth()->id();

        $propertyItem->update($validated);

        toast_success('Property Item berhasil diperbarui.');

        return redirect()->route('property-items.index');
    }

    public function destroy(MPropertyItem $propertyItem)
    {
        $propertyItem->update(['deleted_by' => auth()->id()]);
        $propertyItem->delete();

        toast_warning('Property Item berhasil dihapus.');

        return redirect()->route('property-items.index');
    }

    public function downloadTemplate()
    {
        return Excel::download(new MPropertyItemTemplateExport(), 'template_import_sifat_benda.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MPropertyItemImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0 && count($errors) > 0) {
                toast_success("{$successCount} sifat benda berhasil diimport.");
            } elseif (count($errors) > 0) {
                toast_error('Import gagal. ' . implode(' | ', array_slice($errors, 0, 5)));
            } else {
                toast_success("{$successCount} sifat benda berhasil diimport.");
            }

            return redirect()->route('property-items.index');
        } catch (\Exception $e) {
            Log::error('Import property item failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}
