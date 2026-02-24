<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductRecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'sku' => $this->sku ?? null,

            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'category_name' => $this->category->category_name,
                ];
            }),
        ];
    }
}
