<?php

namespace App\DTOs;

class ProductionStoreDTO
{
    /**
     * Sample data
     */
    
    public function __construct(
        public int $recipeId,
        public int $quantity,
        public int $userId,
    ) {}

    /**
     * Get the value of phone
     */
    public static function fromArray(array $data): self
    {
        return new self(
            recipeId: (int) $data['id'],
            quantity: (int) $data['quantity'],
            userId: auth()->id()
        );
    }
}