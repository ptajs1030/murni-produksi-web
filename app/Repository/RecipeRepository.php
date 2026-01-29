<?php

namespace App\Repository;

use App\DTOs\RecipeCreateDTO;
use App\Models\Api\Recipe;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class RecipeRepository
{
    public function create(RecipeCreateDTO $dto): Recipe
    {
        return DB::transaction(function () use ($dto) {

            $recipe = Recipe::create([
                'recipe_name' => $dto->recipe_name,
                'created_by'  => $dto->user_id,
            ]);

            foreach ($dto->items as $item) {
                $recipe->items()->create([
                    'product_id'   => $item->product_id,
                    'qty_per_unit' => $item->qty_per_unit,
                    'unit'         => $item->unit,
                    'created_by'   => $dto->user_id,
                ]);
            }

            return $recipe->load('items.product.category');
        });
    }

    public function findByProduct(int $productId): ?Recipe
    {
        return Recipe::with('items.product.category')
            ->where('product_id', $productId)
            ->first();
    }

    public function existsByProduct(int $productId): bool
    {
        return Recipe::where('product_id', $productId)->exists();
    }

    public function getSummary(): Collection
    {
        return Recipe::query()
            ->select('id', 'recipe_name')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function findById(int $id): ?Recipe
    {
        return Recipe::with([
            'product',
            'items.product.category'
        ])
            ->where('id', $id)
            ->first();
    }
}
