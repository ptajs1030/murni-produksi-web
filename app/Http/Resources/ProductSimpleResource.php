<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSimpleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'stock' => $this->stocks->first()->packaging_size_input ?? 0,
            'primary_image_url' => $this->primary_image_url,
            'image_urls' => $this->image_urls,
            'primary_image' => $this->primary_image,
            'product_images' => $this->productImages,
        ];
    }
}
