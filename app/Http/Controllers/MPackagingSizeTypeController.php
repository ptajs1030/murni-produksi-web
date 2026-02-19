<?php

namespace App\Http\Controllers;

use App\Models\MPackagingSizeType;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
