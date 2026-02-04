<?php

namespace App\Http\Controllers;

use App\Models\CoreRecipe;
use App\Models\CoreStock;
use App\Models\LogProduksi;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function index(Request $request)
    {
        $query = LogProduksi::query()->with('product', 'createdBy');

        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('product', function ($query) use ($searchTerm) {
                    $query->where('product_name', 'like', '%' . $searchTerm . '%');
                });
                $q->orWhereHas('createdBy', function ($query) use ($searchTerm) {
                    $query->where('name', 'like', '%' . $searchTerm . '%');
                });
            });
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(10);
        $recipes = CoreRecipe::with('product')->get();

        return Inertia::render('Production/Index', [
            'products' => $products,
            'recipes' => $recipes,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function getIngredients(Request $request)
    {
        $recipe = CoreRecipe::with(['ingredients.product.packagingSize'])->find($request->id);
        return response()->json($recipe);
    }
    public function store(Request $request){
        $validated = $request->validate([
            'recipe_id' => 'required',
            'quantity' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $recipe = CoreRecipe::with('ingredients')->find($validated['recipe_id']);
            foreach ($recipe->ingredients as $ingredient) {
                $needed= $ingredient->quantity * $validated['quantity'];
                $stock=CoreStock::where('product_id', $ingredient->product_id)->first();
                if ($stock->packaging_size_input<$needed) {
                    toast_error('Stock tidak cukup');
                    return redirect()->back();
                }
                $ingredients[]=$ingredient->product->product_name.'('.$needed.')';
                $stock->packaging_size_input -= $needed;
                $stock->save();
            }

            $stockProduct=CoreStock::where('product_id', $validated['recipe_id'])->first();
            $stockProduct->packaging_size_input += $validated['quantity'];
            $stockProduct->save();

            LogProduksi::create([
                'product_id' => $validated['recipe_id'],
                'quantity' => $validated['quantity'],
                'description' => $ingredients,
                'created_by' => auth()->id(),
            ]);
            DB::commit();
            toast_success('Produksi berhasil');
            return redirect()->route('production.index');
        } catch (\Exception $e) {
            DB::rollBack();
            toast_error('Produksi gagal'. $e->getMessage());
            return redirect()->back();
        }
        
    }
}
