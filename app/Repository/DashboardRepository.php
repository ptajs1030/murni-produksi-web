<?php

namespace App\Repository;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function totalBarang(): int
    {
        return DB::table('core_stoks')->count();
    }

    public function totalStok(): int
    {
        return (int) DB::table('core_stoks')->sum('in_stock');
    }

    public function totalRepack(): int
    {
        return (int) DB::table('core_stock_transactions')->where('transaction_type_id', 4)->count();
    }
}
