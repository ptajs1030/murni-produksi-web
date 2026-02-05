<?php
namespace App\Service;

use App\Models\CoreStockTransaction;
use App\Repository\StockRepository;
use Illuminate\Support\Facades\DB;
use Exception;

class RepackService
{
    public function __construct(
        protected StockRepository $stockRepository
    ) {}

    public function repack(array $data): void
    {
        DB::transaction(function () use ($data) {

            $sourceStock = $this->stockRepository
                ->getByProductId($data['source_product_id']);

            if (!$sourceStock) {
                throw new Exception('Stock sumber tidak ditemukan');
            }

            if ($sourceStock->packaging_size_input < $data['source_quantity']) {
                throw new Exception('Stock tidak mencukupi');
            }

            $this->stockRepository->decrement(
                $sourceStock,
                $data['source_quantity']
            );

            CoreStockTransaction::create([
                'product_id' => $data['source_product_id'],
                'quantity' => $data['source_quantity'],
                'transaction_type_id' => 2,
                'transaction_date' => now(),
                'notes' => 'Product direpack menjadi ' . count($data['target_products']) . ' produk',
                'created_by' => auth()->id(),
            ]);

            foreach ($data['target_products'] as $target) {
                $targetStock = $this->stockRepository
                    ->getByProductId($target['product_id']);

                if (!$targetStock) {
                    throw new Exception('Stock produk hasil repack tidak ditemukan');
                }

                $this->stockRepository->increment(
                    $targetStock,
                    $target['quantity']
                );
            }
        });
    }
}
