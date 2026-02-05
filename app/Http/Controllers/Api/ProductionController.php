<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductionStoreRequest;
use App\Services\ProductionService;
use Illuminate\Http\JsonResponse;

class ProductionController extends Controller
{
    public function __construct(
        protected ProductionService $productionService
    ) {}

    public function store(ProductionStoreRequest $request): JsonResponse
    {
        $result = $this->productionService->store($request->validated());

        return response()->json([
            'message' => 'Produksi berhasil',
            'data' => $result
        ]);
    }
}
