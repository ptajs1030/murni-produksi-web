<?php

namespace App\Repository;

use App\DTOs\SearchProductDTO;
use App\Models\Api\Product;

class ProductRepository
{
    public function search(SearchProductDTO $dto)
    {
        return Product::query()
            ->when(
                $dto->id,
                fn($q) =>
                $q->where('id', $dto->id)
            )
            ->when($dto->keyword, function ($q) use ($dto) {
                $q->where(function ($sub) use ($dto) {
                    $sub->where('product_name', 'like', "%{$dto->keyword}%")
                        ->orWhere('brand_name', 'like', "%{$dto->keyword}%")
                        ->orWhere('product_unit_sku', 'like', "%{$dto->keyword}%");
                });
            })
            ->when(
                $dto->category_id,
                fn($q) =>
                $q->where('m_category_id', $dto->category_id)
            )
            ->when(
                $dto->supplier_id,
                fn($q) =>
                $q->where('m_supplier_id', $dto->supplier_id)
            )
            ->when(
                !is_null($dto->is_pre_order),
                fn($q) =>
                $q->where('product_is_pre_order', $dto->is_pre_order)
            )
            ->whereNull('deleted_at')
            ->orderBy('id', 'asc')
            ->get();
    }
}
