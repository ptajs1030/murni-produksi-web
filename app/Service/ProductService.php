<?php

namespace App\Service;

use App\DTOs\SearchProductDTO;
use App\Repository\ProductRepository;

class ProductService
{
    public function __construct(
        protected ProductRepository $productRepository
    ) {}

    public function searchProducts(SearchProductDTO $dto)
    {
        return $this->productRepository->search($dto);
    }
}
