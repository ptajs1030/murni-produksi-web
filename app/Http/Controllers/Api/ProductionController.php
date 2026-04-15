<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductionCheckRequest;
use App\Http\Requests\ProductionStoreRequest;
use App\Service\ProductionService;
use App\DTOs\ProductionCheckDTO;
use App\DTOs\ProductionStoreDTO;
use Illuminate\Http\Request;

class ProductionController extends BaseApiController
{
    public function __construct(
        protected ProductionService $service
    ) {}

    /**
     * Get products for production
     *
     * Retrieve list of products available for production.
     *
     * @tags Production
     */
    public function getProducts(): \Illuminate\Http\JsonResponse
    {
        $products = $this->service->getProducts();
        return $this->success(
            data: $products,
            message: 'Berhasil mengambil data produk'
        );
    }

    /**
     * List productions
     *
     * Retrieve a list of production records.
     *
     * @tags Production
     * @queryParam search string Search by product name or other criteria. Example: Produk A
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $productions = $this->service->index($request->get('search'));
        return $this->success(
            data: $productions['data'],
            message: 'Berhasil mengambil data produksi'
        );
    }

    /**
     * Check production feasibility
     *
     * Validate if a production run is feasible given current stock levels.
     *
     * @tags Production
     */
    public function check(ProductionCheckRequest $request): \Illuminate\Http\JsonResponse
    {
        $dto = ProductionCheckDTO::fromArray($request->validated());
        $result = $this->service->check($dto);
        
        return $this->success(
            data: $result,
            message: 'Berhasil melakukan pengecekan produksi'
        );
    }

    /**
     * Store production record
     *
     * Create a new production record and update stock accordingly.
     *
     * @tags Production
     */
    public function store(ProductionStoreRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();
        $dto = ProductionStoreDTO::fromArray($validated);
        $this->service->store($dto);

        return $this->success(
            data: $validated,
            message: 'Berhasil menyimpan data produksi'
        );
    }
}