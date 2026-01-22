<?php

namespace App\Http\Controllers;

use App\Models\CoreInventoryOut;
use App\Models\CoreProduct;
use App\Models\CoreProductIncomes;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Total Products
    

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => 100,
                'totalExpiredProducts' => 5,
                'totalSales' => 200,
                'totalPurchases' => 150,
                'lowStockProducts' => 8,
            ],
            'recentProducts' => [
                [
                    'id' => 1,
                    'product_name' => 'Product A',
                    'created_at' => now(),
                ],
                [
                    'id' => 2,
                    'product_name' => 'Product B',
                    'created_at' => now(),
                ],
            ],

        ]);
    }
}
