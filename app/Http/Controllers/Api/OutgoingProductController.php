<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\OutgoingProductStoreRequest;
use App\Service\OutgoingProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutgoingProductController extends BaseApiController
{
    public function __construct(
        protected OutgoingProductService $service
    ) {}

    /**
     * Get outgoing products list
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $outgoings = $this->service->getOutgoingProducts($request->get('search'));
        
        return $this->success(
            data: $outgoings,
            message: 'Berhasil mengambil data produk keluar'
        );
    }

    /**
     * Store new outgoing product
     * 
     * @param OutgoingProductStoreRequest $request
     * @return JsonResponse
     */
    public function store(OutgoingProductStoreRequest $request): JsonResponse
    {
        $this->service->storeOutgoingProduct($request->validated());

        return $this->success(
            message: 'Barang keluar berhasil ditambahkan.'
        );
    }

    /**
     * Get products for outgoing form
     * 
     * @return JsonResponse
     */
    public function getProducts(): JsonResponse
    {
        return $this->success(
            data: $this->service->getProducts(),
            message: 'Berhasil mengambil data produk'
        );
    }

    /**
     * Get out types for outgoing form
     * 
     * @return JsonResponse
     */
    public function getOutTypes(): JsonResponse
    {
        return $this->success(
            data: $this->service->getOutTypes(),
            message: 'Berhasil mengambil data jenis pengeluaran'
        );
    }
}
