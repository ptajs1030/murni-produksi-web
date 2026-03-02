<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\DashboardService;
use App\Repository\DashboardRepository;
use Illuminate\Http\Request;

class DashboardController extends BaseApiController
{
    public function __construct(
        protected DashboardService $service
        ) {}
    public function index(){
        return $this->success(data: $this->service->summary());
    }
}
