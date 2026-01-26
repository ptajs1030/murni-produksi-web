<?php

namespace App\Http\Controllers;

use App\Models\MPackagingLevel;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

}
