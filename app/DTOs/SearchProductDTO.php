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
        public int $per_page
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('id'),
            $request->query('keyword'),
            $request->query('category_id'),
            $request->query('supplier_id'),
            $request->query('is_pre_order'),
            (int) $request->query('per_page', 10)
        );
    }
}
