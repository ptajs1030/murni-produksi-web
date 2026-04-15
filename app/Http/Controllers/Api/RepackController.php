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
     */
    public function store(RepackStoreRequest $request): JsonResponse
    {
        $this->service->handle($request->validated());

        return $this->success(
            message: 'Repack finished! displaybar'
        );
    }
}