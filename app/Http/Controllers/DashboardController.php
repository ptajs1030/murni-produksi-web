<?php

namespace App\Http\Controllers;

use App\Models\CoreIncomingProduct;
use App\Models\CoreInventoryOut;
use App\Models\CoreOutgoingProduct;
use App\Models\CoreProduct;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
       $totalProducts = CoreProduct::count();

        // Total Expired Products (products with expired_date <= today)
        $totalExpiredProducts = CoreProduct::where('expired_date', '<=', Carbon::now()->toDateString())->count();

        // Total Sales (assuming CoreInventoryOut represents sales/outgoing items)
        $totalSales = CoreOutgoingProduct::whereHas('outType', function ($query) {
            $query->whereIn('out_type_name', ['Sale', 'Penjualan', 'Sold']);
        })->sum('packaging_size_input') ?? 0;

        // Total Purchases/Income (from CoreProductIncomes)
        $totalPurchases = CoreIncomingProduct::count();

        // Additional stats for more insights
        $recentProducts = CoreProduct::latest()->take(5)->get(['id', 'product_name', 'created_at']);
        $lowStockProducts = CoreProduct::whereHas('stocks', function ($query) {
            $query->where('packaging_size_input', '<=', 10);
        })->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalExpiredProducts' => $totalExpiredProducts,
                'totalSales' => $totalSales,
                'totalPurchases' => $totalPurchases,
                'lowStockProducts' => $lowStockProducts,
            ],
            'recentProducts' => $recentProducts,
        ]);
    }
}
