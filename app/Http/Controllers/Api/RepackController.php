<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RepackStoreRequest;
use App\Service\RepackService;
use Illuminate\Http\JsonResponse;

class RepackController extends Controller
{
    public function __construct(
        protected RepackService $repackService
    ) {}

    public function store(RepackStoreRequest $request) 
    {
        $this->repackService->repack($request->validated());

        return response()->json([
            'message' => 'Repack berhasil dilakukan'
        ]);
    }
}
