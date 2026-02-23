<?php

namespace App\Http\Controllers;

use App\Models\CoreRecipe;
use App\Models\CoreStock;
use App\Models\CoreStockTransaction;
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

        if ($recipe) {
            foreach ($recipe->ingredients as $ingredient) {
                $stock = CoreStock::where('product_id', $ingredient->product_id)->first();
                $ingredient->stock_available = $stock ? $stock->packaging_size_input : 0;
            }
        }

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
            $ingredients = [];

            if (LogProduksi::where('product_id', $validated['recipe_id'])->exists()) {
                $batch = LogProduksi::where('product_id', $validated['recipe_id'])->latest()->first();
                $batchNumber = $batch->batch + 1;
            } else {
                $batchNumber = 1;
            }

            foreach ($recipe->ingredients as $ingredient) {
                $needed = $ingredient->quantity * $validated['quantity'];
                $stock = CoreStock::where('product_id', $ingredient->product_id)->first();
                if ($stock->packaging_size_input < $needed) {
                    toast_error('Stock tidak cukup');
                    return redirect()->back();
                }
                $ingredients[] = $ingredient->product->product_name.'('.$needed.')';
                $stock->packaging_size_input -= $needed;
                $stock->save();
                CoreStockTransaction::create([
                    'product_id' => $ingredient->product_id,
                    'transaction_type_id' => 3,
                    'quantity' => -$needed,
                    'transaction_date' => now(),
                    'notes' => 'Digunakan untuk produksi '. $recipe->product->product_name.' Batch '. $batchNumber,
                    'created_by' => auth()->id(),
                ]);
            }

            $stockProduct = CoreStock::where('product_id', $validated['recipe_id'])->first();
            $stockProduct->packaging_size_input += $validated['quantity'];
            $stockProduct->save();

            if (isset($batch)) {
                $batch->batch = $batchNumber;
                $batch->save();
            } else {
                $batch = LogProduksi::create([
                    'product_id' => $validated['recipe_id'],
                    'batch' => $batchNumber,
                    'quantity' => $validated['quantity'],
                    'description' => $ingredients,
                    'created_by' => auth()->id(),
                ]);
            }

            CoreStockTransaction::create([
                'product_id' => $validated['recipe_id'],
                'transaction_type_id' => 3,
                'quantity' => $validated['quantity'],
                'transaction_date' => now(),
                'notes' => 'Produksi '. $stockProduct->product->product_name.' Batch '. $batchNumber,
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
