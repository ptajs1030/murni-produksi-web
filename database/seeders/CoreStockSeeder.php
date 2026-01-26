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
        CoreStock::factory()->create([
            'product_id' => $product->id,
            'packaging_size_input' => $product->packaging_size_input,
        ]);
    }

    $this->command->info("Core Stocks seeded successfully!");
    $this->command->info("Total records: " . $products->count());
}

}
