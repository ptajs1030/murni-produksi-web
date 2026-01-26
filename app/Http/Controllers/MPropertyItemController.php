<?php

namespace App\Http\Controllers;

use App\Models\MPropertyItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

}
