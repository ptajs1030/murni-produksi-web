<?php
namespace App\DTOs;

class RecipeItemDTO
{
    public function __construct(
        public int $product_id,
        public float $qty_per_unit,
        public string $unit
    ) {}
}
