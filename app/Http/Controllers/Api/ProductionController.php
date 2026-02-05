<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductionStoreRequest;
use App\Models\LogProduksi;
use App\Service\ProductionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductionController extends Controller
{
    public function __construct(
        protected ProductionService $productionService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = LogProduksi::with(['product', 'createdBy']);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->whereHas('product', function ($q) use ($search) {
                    $q->where('product_name', 'like', "%{$search}%");
                })->orWhereHas('createdBy', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

        $productions = $query
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($productions);
    }
    public function store(ProductionStoreRequest $request): JsonResponse
    {
        $result = $this->productionService->store($request->validated());

        return response()->json([
            'message' => 'Produksi berhasil',
            'data' => $result
        ]);
    }
}
