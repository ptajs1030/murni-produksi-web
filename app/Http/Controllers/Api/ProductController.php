<?php

namespace App\Http\Controllers\Api;

use App\DTOs\SearchProductDTO;
use App\Http\Controllers\Controller;
use App\Service\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * GET /api/products
     */
    public function index(Request $request)
    {
        $dto = SearchProductDTO::fromRequest($request);

        return response()->json([
            'status' => true,
            'data' => $this->productService->searchProducts($dto)
        ]);
    }
}
