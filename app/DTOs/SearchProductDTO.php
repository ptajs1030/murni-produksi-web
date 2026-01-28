<?php

namespace App\DTOs;

use Illuminate\Http\Request;

class SearchProductDTO
{
    public function __construct(
        public ?int $id,
        public ?string $keyword,
        public ?int $category_id,
        public ?int $supplier_id,
        public ?bool $is_pre_order,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('id'),
            $request->query('keyword'),
            $request->query('category_id'),
            $request->query('supplier_id'),
            $request->query('is_pre_order')
        );
    }
}
