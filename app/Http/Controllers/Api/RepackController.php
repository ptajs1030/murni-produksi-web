<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RepackStoreRequest;
use App\Service\RepackService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\RepackRequest;
use App\Models\CoreProduct;

class RepackController extends BaseApiController
{
    public function __construct(
        protected RepackService $service
    ) {}

    /**
     * Get bahan baku products
     *
     * Retrieve the list of raw material (bahan baku) products available for repack.
     *
     * @tags Repack
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Berhasil mengambil data bahan baku",
     *   "data": [
     *     {"id": 1, "name": "Bahan Baku A", "code": "BB-001", "stock": 200, "unit": "kg"}
     *   ]
     * }
     */
    public function getBahanBaku(): JsonResponse
    {
        $products = CoreProduct::where('product_type', 'Produk Bahan Baku')
            ->select('id', 'name', 'code', 'stock', 'unit') // pilih kolom yang diperlukan
            ->get();
        
        return $this->success(
            data: $products,
            message: 'Berhasil mengambil data bahan baku'
        );
    }

    /**
     * List repacks
     *
     * Retrieve a list of repack records.
     *
     * @tags Repack
     * @queryParam search string Search by product name. Example: Produk A
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Berhasil mengambil data repack",
     *   "data": [
     *     {"id": 1, "product_id": 2, "quantity": 10, "created_at": "2024-01-01T00:00:00.000000Z"}
     *   ]
     * }
     */
    public function index(RepackRequest $request): JsonResponse
    {
        $repacks = $this->service->getRepack($request->get('search'));
        
        return $this->success(
            data: $repacks['data'],
            message: 'Berhasil mengambil data repack'
        );
    }

    /**
     * Store repack
     *
     * Create a new repack record. Deducts raw material (bahan baku) stock and adds to finished product stock.
     *
     * @tags Repack
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Repack finished!",
     *   "data": null
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The given data was invalid.",
     *   "errors": {}
     * }
     */
    public function store(RepackStoreRequest $request): JsonResponse
    {
        $this->service->handle($request->validated());

        return $this->success(
            message: 'Repack finished! displaybar'
        );
    }
}