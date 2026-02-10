<?php

namespace App\Http\Controllers;

use App\Models\MPackagingLevel;
use App\Models\MPackagingType;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            'packaging_type_name' => ['required', 'string', 'max:20'],
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
            'packaging_type_name' => ['required', 'string', 'max:20'],
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
}
