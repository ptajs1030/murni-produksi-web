<?php

namespace App\Http\Controllers;

use App\Models\CoreStockTransaction;
use App\Models\MTransactionType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockTransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = CoreStockTransaction::query()->with(['product', 'transactionType', 'createdBy']);

        // Search by product name, transaction type name, or notes
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('product', function ($query) use ($searchTerm) {
                    $query->where('product_name', 'like', '%' . $searchTerm . '%');
                });
                $q->orWhere('notes', 'like', '%' . $searchTerm . '%');
            });
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        // Filter by product type (Produk Bahan Baku / Produk Jadi)
        if ($request->filled('product_type')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('product_type', $request->product_type);
            });
        }

        // Filter by transaction type
        if ($request->filled('transaction_type_id')) {
            $query->where('transaction_type_id', $request->transaction_type_id);
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $transactionTypes = MTransactionType::select('id', 'transaction_type_name')->get();

        return Inertia::render('StockTransaction/Index', [
            'transactions' => $transactions,
            'transactionTypes' => $transactionTypes,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'product_type', 'transaction_type_id']),
        ]);
    }
}
