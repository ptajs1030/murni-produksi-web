<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\OutgoingProductStoreRequest;
use App\Service\OutgoingProductService;
use App\Http\Resources\ProductSimpleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutgoingProductController extends BaseApiController
{
    public function __construct(
        protected OutgoingProductService $service
    ) {}

    /**
     * List outgoing products
     *
     * Retrieve a paginated list of outgoing product transactions.
     *
     * @tags Outgoing Products
     * @queryParam search string Search by product name or out type. Example: rusak
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
     * Create outgoing product
     *
     * Record a new outgoing product transaction (reduces stock).
     *
     * @tags Outgoing Products
     * @bodyParam product_id integer required ID of the product. Example: 3
     * @bodyParam out_type_id integer required ID of the outgoing type. Example: 1
     * @bodyParam quantity integer required Quantity to deduct from stock (min: 1). Example: 10
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
     * Retrieve the list of available products to select when creating an outgoing entry.
     *
     * @tags Outgoing Products
     */
    public function getProducts(): JsonResponse
    {
        return $this->success(
            data: ProductSimpleResource::collection($this->service->getProducts()),
            message: 'Berhasil mengambil data produk'
        );
    }

    /**
     * Get outgoing types
     *
     * Retrieve the list of outgoing types (e.g., rusak, kadaluarsa, dll).
     *
     * @tags Outgoing Products
     */
    public function getOutTypes(): JsonResponse
    {
        return $this->success(
            data: $this->service->getOutTypes(),
            message: 'Berhasil mengambil data jenis pengeluaran'
        );
    }
}
