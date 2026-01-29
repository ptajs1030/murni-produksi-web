<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'recipe_name' => $this->recipe_name,

            'items' => RecipeItemResource::collection($this->whenLoaded('items')),
        ];
    }
}