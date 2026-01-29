<?php
namespace App\DTOs;

class RecipeCreateDTO
{
    /**
     * @param RecipeItemDTO[] $items
     */
    public function __construct(
        public string $recipe_name,
        public array $items,
        public ?int $user_id
    ) {}
}

