<?php

namespace App\Http\Controllers\Api;

use App\Models\CoreProduct;
use App\Http\Resources\ProductStockResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends BaseApiController
{
    /**
     * Get products with stock information
     * 
     * @authenticated
     * @tags Product
     * @queryParam type string Filter by product type. Example: Produk Jadi
     * @queryParam search string Search by product name. Example: Sirup
     * @queryParam per_page integer Items per page. Example: 10
     */
    public function stocks(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'nullable|in:Produk Jadi,Produk Bahan Baku,all',
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $type = $request->get('type');
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $query = CoreProduct::query()
            ->with(['stocks', 'category']);

        if ($type && $type !== 'all') {
            $query->where('product_type', $type);
        }

        if ($search) {
            $query->where('product_name', 'like', "%{$search}%");
        }

        $products = $query->orderBy('product_name')->paginate($perPage);

        return $this->success(
            data: [
                'items' => ProductStockResource::collection($products->items()),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ]
            ],
            message: 'Berhasil mengambil data stok produk'
        );
    }
}
