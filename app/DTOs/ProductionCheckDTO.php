<?php

namespace App\DTOs;

class ProductionCheckDTO
{
    /**
     * Sample data
     */

    public function __construct(
        public int $recipeId,
        public int $quantity,
    ) {}

    /**
     * Get the value of phone
     */
     public static function fromArray(array $data): self
    {
        return new self(
            recipeId: (int) $data['recipe_id'],
            quantity: (int) $data['quantity'],
        );
    }
}