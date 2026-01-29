<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\DTOs\RecipeCreateDTO;
use App\DTOs\RecipeItemDTO;
use App\Service\RecipeService;
use App\Http\Resources\RecipeDetailResource;

class RecipeController extends Controller
{
    public function index(Request $request, RecipeService $service)
    {
        if ($request->filled('id')) {
            return response()->json([
                'status' => true,
                'data' => new RecipeDetailResource(
                    $service->getDetail((int) $request->query('id'))
                )
            ]);
        }

        return response()->json([
            'status' => true,
            'data' => $service->getSummary()

        ]);
    }

    public function store(Request $request, RecipeService $service)
    {
        $data = $request->validate([
            'recipe_name' => 'required|string|max:255',
            'items' => 'required|array|min:1',

            'items.*.product_id' => 'required|integer|exists:core_products,id',
            'items.*.qty_per_unit' => 'required|numeric|min:0.0001',
            'items.*.unit' => 'required|string|max:20',
        ]);

        $items = array_map(
            fn($item) => new RecipeItemDTO(
                $item['product_id'],
                $item['qty_per_unit'],
                $item['unit']
            ),
            $data['items']
        );

        $dto = new RecipeCreateDTO(
            $data['recipe_name'],
            $items,
            $request->user()?->id
        );

        return response()->json([
            'status' => true,
            'data' => $service->create($dto)
        ], 201);
    }
}
