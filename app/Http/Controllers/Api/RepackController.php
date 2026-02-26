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
     * Get Bahan Baku products
     * 
     * @return JsonResponse
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
     * Get Repack list
     * 
     * @param RepackRequest $request
     * @return JsonResponse
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
     * Store new repack
     * 
     * @param RepackStoreRequest $request
     * @return JsonResponse
     */
    public function store(RepackStoreRequest $request): JsonResponse
    {
        $this->service->handle($request->validated());

        return $this->success(
            message: 'Repack finished! displaybar'
        );
    }
}