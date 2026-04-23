<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductStockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stock = $this->stocks->first();
        
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'product_type' => $this->product_type,
            'product_unit_sku' => $this->product_unit_sku,
            'stock' => $stock ? [
                'id' => $stock->id,
                'quantity' => $stock->packaging_size_input,
                'formatted_quantity' => $stock->formatted_quantity,
                'formatted_quantity_smallest_unit' => $stock->packaging_size_input . ' ' . ($stock->product->packagingSize->sizeType->base_unit ?? 'unit'),
            ] : null,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->category_name,
            ] : null,
            'primary_image_url' => $this->primary_image_url,
        ];
    }
}
