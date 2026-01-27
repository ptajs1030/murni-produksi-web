<?php

namespace App\Http\Controllers;

use App\Models\CoreProduct;
use App\Models\CoreRecipe;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoreRecipeController extends Controller
{
    public function index(Request $request){
        $query= CoreRecipe::query()->with('product');
        if ($request->filled('search')) {
        $query->whereHas('product', function ($q) use ($request) {
            $q->where('product_name', 'like', '%' . $request->search . '%');
        });
    }

        $recipes = $query->paginate(10);
        return Inertia::render('CoreRecipe/Index', [
            'recipes' => $recipes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(){
        $products = CoreProduct::where('product_type', operator: 'Produk Jadi')->get();
        $ingredients = CoreProduct::where('product_type', operator: 'Produk Bahan Baku')->get();
        return Inertia::render('CoreRecipe/Create', [
            'products' => $products,
            'ingredients' => $ingredients
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'product_id' => 'required|exists:core_products,id',
            'ingredients' => 'required|array|min:1',
            'ingredients.*.product_id' => 'required|exists:core_products,id',
            'ingredients.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $recipe = CoreRecipe::create([
            'product_id' => $validated['product_id'],
            'created_by' => auth()->id(),
        ]);

        foreach ($validated['ingredients'] as $ingredient) {
            $recipe->ingredients()->create([
                'product_id' => $ingredient['product_id'],
                'quantity' => $ingredient['quantity'],
                'created_by' => auth()->id(),
            ]);
        }
        toast_success('Produk berhasil ditambahkan.');
        return redirect()->route('recipes.index');
    }
    public function edit(CoreRecipe $recipe)
    {
        $recipe->load('ingredients.product');

        return Inertia::render('CoreRecipe/Edit', [
            'recipe' => [
                'id' => $recipe->id,
                'product_id' => $recipe->product_id,
                'ingredients' => $recipe->ingredients->map(fn ($item) => [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->product_name,
                    'quantity' => $item->quantity,
                ]),
            ],
            'products' => CoreProduct::select('id', 'product_name')->get(),
        ]);
    }



    public function update(CoreRecipe $recipe, Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:core_products,id',
            'ingredients' => 'required|array|min:1',
            'ingredients.*.product_id' => 'required|exists:core_products,id',
            'ingredients.*.quantity' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($recipe, $validated) {

            $recipe->update([
                'product_id' => $validated['product_id'],
                'updated_by' => auth()->id(),
            ]);
                    $existingIngredients = $recipe->ingredients()->get()->keyBy('product_id');

            $incomingIngredients = collect($validated['ingredients'])->keyBy('product_id');
            foreach ($incomingIngredients as $productId => $ingredient) {

                if ($existingIngredients->has($productId)) {
                    $existingIngredients[$productId]->update([
                        'quantity' => $ingredient['quantity'],
                        'updated_by' => auth()->id(),
                    ]);
                } else {
                    $recipe->ingredients()->create([
                        'product_id' => $productId,
                        'quantity' => $ingredient['quantity'],
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            $incomingProductIds = $incomingIngredients->keys();

            foreach ($existingIngredients as $productId => $ingredient) {
                if (! $incomingProductIds->contains($productId)) {
                    $ingredient->update([
                        'deleted_by' => auth()->id(),
                    ]);
                    $ingredient->delete();
                }
            }
        });

        toast_success('Resep berhasil diperbarui.');
        return redirect()->route('recipes.index');
    }

    public function destroy(CoreRecipe $recipe)
    {
        $recipe->delete();
        toast_success('Resep berhasil dihapus.');
        return redirect()->route('recipes.index');
    }


}
