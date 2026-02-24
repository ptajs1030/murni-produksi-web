<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\DashboardService;
use App\Repository\DashboardRepository;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $service
        ) {}
    public function index(){
        return response()->json([
            'status' => 'success',
            'data'=> $this->service->summary(),
        ]);
    }
}
