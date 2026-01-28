<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RepackRequest; // Changed from DTO
use App\Service\RepackService;

class RepackController extends Controller
{
    protected $repackService;

    public function __construct(RepackService $repackService)
    {
        $this->repackService = $repackService;
    }

    public function repack(RepackRequest $request) // Changed type hint
    {
        try {
            $this->repackService->executeRepack($request->validated()); // Pass validated data
            return response()->json(['message' => 'Repack operation successful'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
