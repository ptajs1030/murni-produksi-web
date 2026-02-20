<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductionCheckRequest;
use App\Http\Requests\ProductionStoreRequest;
use App\Service\ProductionService;
use App\DTOs\ProductionCheckDTO;
use App\DTOs\ProductionStoreDTO;
use App\Models\CoreRecipe;

class ProductionController extends Controller
{
    public function __construct(
        protected ProductionService $service
    ) {}

    public function index()
    {
        return CoreRecipe::with('product:id,product_name')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'product_name' => $r->product->product_name,
            ]);
    }

    public function check(ProductionCheckRequest $request)
    {
        $dto = ProductionCheckDTO::fromArray($request->validated());
        return response()->json($this->service->check($dto));
    }

    public function store(ProductionStoreRequest $request)
    {
        $dto = ProductionStoreDTO::fromArray($request->validated());
        return response()->json($this->service->store($dto));
    }
}