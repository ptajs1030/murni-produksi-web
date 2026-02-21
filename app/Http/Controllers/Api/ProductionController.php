<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductionCheckRequest;
use App\Http\Requests\ProductionStoreRequest;
use App\Service\ProductionService;
use App\DTOs\ProductionCheckDTO;
use App\DTOs\ProductionStoreDTO;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    public function __construct(
        protected ProductionService $service
    ) {}

    public function index(Request $request)
    {
        return response()->json(
            $this->service->getProducts()
        );
    }
    public function production(Request $request)
    {
        return response()->json(
            $this->service->production($request->get('search'))
        );
    }
    public function check(ProductionCheckRequest $request)
    {
        $dto = ProductionCheckDTO::fromArray($request->validated());
        return response()->json($this->service->check($dto));
    }
    public function store(ProductionStoreRequest $request)
    {
        $validated = $request->validated();
        $dto = ProductionStoreDTO::fromArray($validated);
        $this->service->store($dto);

        return response()->json([
            'status' => true,
            'data' => $validated,
        ]);
    }
}