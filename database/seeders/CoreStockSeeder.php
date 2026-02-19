<?php

namespace Database\Seeders;

use App\Models\CoreStock;
use Database\Factories\CoreStockFactory;
use Illuminate\Database\Seeder;

class CoreStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run()
{
    $products = \App\Models\CoreProduct::whereNotIn(
        'id',
        CoreStock::pluck('product_id')
    )->get();

    foreach ($products as $product) {
        $isFinished = $product->product_type === 'Produk Jadi';

        CoreStock::factory()->create([
            'product_id' => $product->id,
            'in_stock' => 1,
            'packaging_size_input' => $isFinished
                ? 0
                : fake()->randomElement([100, 250, 500, 1000, 2000, 5000]),
        ]);
    }

    $this->command->info("Core Stocks seeded successfully!");
    $this->command->info("Total records: " . $products->count());
}

}
