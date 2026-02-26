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

    public function getProducts()
    {
        $products = $this->service->getProducts();
        return $this->success(
            data: $products,
            message: 'Berhasil mengambil data produk'
        );
    }

    public function index(Request $request)
    {
        $productions = $this->service->index($request->get('search'));
        return $this->success(
            data: $productions['data'],
            message: 'Berhasil mengambil data produksi'
        );
    }

    public function check(ProductionCheckRequest $request)
    {
        $dto = ProductionCheckDTO::fromArray($request->validated());
        $result = $this->service->check($dto);
        
        return $this->success(
            data: $result,
            message: 'Berhasil melakukan pengecekan produksi'
        );
    }

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