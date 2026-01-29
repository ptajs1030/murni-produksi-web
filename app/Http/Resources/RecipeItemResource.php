<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'qty_per_unit' => $this->qty_per_unit,
            'unit' => $this->unit,

            'product' => new ProductRecipeResource(
                $this->whenLoaded('product')
            ),
        ];
    }
}
