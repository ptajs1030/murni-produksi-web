<?php
namespace App\Repository;

use App\Models\CoreStock;

class StockRepository
{
    public function getByProductId(int $productId): ?CoreStock
    {
        return CoreStock::where('product_id', $productId)->first();
    }

    public function decrement(CoreStock $stock, int $qty): void
    {
        $stock->decrement('packaging_size_input', $qty);
    }

    public function increment(CoreStock $stock, int $qty): void
    {
        $stock->increment('packaging_size_input', $qty);
    }
}
