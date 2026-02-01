<?php

namespace App\Http\Controllers;

use App\Models\MPackagingLevel;
use App\Models\MPackagingSize;
use App\Models\MPackagingSizeType;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
