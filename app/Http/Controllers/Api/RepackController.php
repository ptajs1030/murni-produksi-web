<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RepackStoreRequest;
use App\Service\RepackService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\RepackRequest;
use App\Models\CoreProduct;

class RepackController extends Controller
{
    public function __construct(
        protected RepackService $service
    ) {}

    public function getBahanBaku()
    {
        $products = CoreProduct::where('product_type', 'Produk Bahan Baku')->get();
        return response()->json($products);
    }

    public function index(RepackRequest $request): JsonResponse
{
    return response()->json(
        $this->service->getRepack($request->get('search'))
    );
}
    public function store(RepackStoreRequest $request): JsonResponse
    {
        $this->service->handle($request->validated());

        return response()->json([
            'message' => 'Repack finished! displaybar'
        ]);
    }
}