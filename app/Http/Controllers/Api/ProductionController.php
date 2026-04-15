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
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Berhasil mengambil data produk",
     *   "data": [
     *     {"id": 1, "name": "Produk A", "code": "PA-001", "stock": 100, "unit": "pcs"}
     *   ]
     * }
     */
    public function getProducts()
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
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Berhasil mengambil data produksi",
     *   "data": [
     *     {"id": 1, "product_id": 1, "quantity": 50, "created_at": "2024-01-01T00:00:00.000000Z"}
     *   ]
     * }
     */
    public function index(Request $request)
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
     * @response 200 scenario="Feasible" {
     *   "success": true,
     *   "message": "Berhasil melakukan pengecekan produksi",
     *   "data": {"feasible": true, "missing": []}
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The given data was invalid.",
     *   "errors": {}
     * }
     */
    public function check(ProductionCheckRequest $request)
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
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Berhasil menyimpan data produksi",
     *   "data": {}
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The given data was invalid.",
     *   "errors": {}
     * }
     */
    public function store(ProductionStoreRequest $request)
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