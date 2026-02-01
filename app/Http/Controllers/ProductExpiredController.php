<?php

namespace App\Http\Controllers;

use App\Models\CoreProduct;
use App\Models\MCategory;
use App\Models\MSupplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductExpiredController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::now();

        $defaultFromDate = $today->copy()->addDays(10);
        $defaultToDate = $today->copy()->subMonths(2);

        $query = CoreProduct::with([
            'category:id,category_name',
            'supplier:id,supplier_name',
            'propertyItem:id,property_name',
            'packagingSize:id,packaging_size_name',
            'packagingType:id,packaging_type_name',
            'repackStatus:id,repack_name',
            'createdBy:id,name',
            'stocks',
        ])
            ->whereNotNull('expired_date');

        // Apply date filters
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $dateFrom = Carbon::parse($request->date_from);
            $dateTo = Carbon::parse($request->date_to);
            $query->whereBetween('expired_date', [$dateTo->toDateString(), $dateFrom->toDateString()]);
        } elseif ($request->filled('date_from')) {
            $dateFrom = Carbon::parse($request->date_from);
            $query->whereDate('expired_date', '<=', $dateFrom->toDateString());
        } elseif ($request->filled('date_to')) {
            $dateTo = Carbon::parse($request->date_to);
            $query->whereDate('expired_date', '>=', $dateTo->toDateString());
        } else {
            // Default filter: H+10 days to H-2 months
            $query->whereBetween('expired_date', [$defaultToDate->toDateString(), $defaultFromDate->toDateString()]);
        }

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('product_name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('product_unit_sku', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('brand_name', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('m_category_id', $request->category_id);
        }

        // Supplier filter
        if ($request->filled('supplier_id')) {
            $query->where('m_supplier_id', $request->supplier_id);
        }


        $products = $query->orderBy('expired_date', 'asc')->paginate(20);

        // Get statistics based on current filter
        $statsQuery = CoreProduct::whereNotNull('expired_date');

        // Apply same date filter to statistics
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $dateFrom = Carbon::parse($request->date_from);
            $dateTo = Carbon::parse($request->date_to);
            $statsQuery->whereBetween('expired_date', [$dateTo->toDateString(), $dateFrom->toDateString()]);
        } elseif ($request->filled('date_from')) {
            $dateFrom = Carbon::parse($request->date_from);
            $statsQuery->whereDate('expired_date', '<=', $dateFrom->toDateString());
        } elseif ($request->filled('date_to')) {
            $dateTo = Carbon::parse($request->date_to);
            $statsQuery->whereDate('expired_date', '>=', $dateTo->toDateString());
        } else {
            $statsQuery->whereBetween('expired_date', [$defaultToDate->toDateString(), $defaultFromDate->toDateString()]);
        }

        $statistics = [
            'total_filtered' => $statsQuery->count(),
            'expired_already' => CoreProduct::whereNotNull('expired_date')
                ->whereDate('expired_date', '<', $today->toDateString())
                ->count(),
            'expiring_soon' => CoreProduct::whereNotNull('expired_date')
                ->whereBetween('expired_date', [$today->toDateString(), $today->copy()->addDays(30)->toDateString()])
                ->count(),
        ];

        // Get filter options
        $categories = MCategory::select('id', 'category_name')->orderBy('category_name')->get();
        $suppliers = MSupplier::select('id', 'supplier_name')->orderBy('supplier_name')->get();

        return Inertia::render('ProductExpired/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category_id', 'supplier_id','date_from', 'date_to']),
            'categories' => $categories,
            'suppliers' => $suppliers,
            'statistics' => $statistics,
            'defaultDateRange' => [
                'from' => $defaultFromDate->format('Y-m-d'),
                'to' => $defaultToDate->format('Y-m-d'),
            ],
        ]);
    }
}
