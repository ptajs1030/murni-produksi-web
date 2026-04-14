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
     * Get options for outgoing product form
     * 
     * @return JsonResponse
     */
    public function getFormOptions(): JsonResponse
    {
        $options = $this->service->getFormOptions();
        
        return $this->success(
            data: $options,
            message: 'Berhasil mengambil opsi form'
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
}
