<?php

namespace Database\Seeders;

use App\Models\CoreProduct;
use App\Models\MCategory;
use App\Models\MPropertyItem;
use App\Models\MSupplier;
use Illuminate\Database\Seeder;

class CoreProductSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFinishedProducts();
        $this->seedRawMaterials();
    }

    /**
     * =============================
     * PRODUK JADI
     * =============================
     */
    private function seedFinishedProducts(): void
    {
        // FOOD – produk jadi
        CoreProduct::factory()
            ->count(25)
            ->finishedProduct()
            ->state(fn () => [
                'm_category_id' => MCategory::where('category_code', 'FOOD1')->value('id'),
                'm_supplier_id' => MSupplier::where('supplier_code', 'SUP02')->value('id'),
                'm_property_item_id' => MPropertyItem::where('property_code', 'S')
    ->value('id')
    ?? MPropertyItem::inRandomOrder()->value('id'),

                'expired_date' => now()->addMonths(rand(3, 18)),
            ])
            ->create();

        // FASHION – produk jadi
        CoreProduct::factory()
            ->count(10)
            ->finishedProduct()
            ->state(fn () => [
                'm_category_id' => MCategory::where('category_code', 'FASH1')->value('id'),
                'm_supplier_id' => MSupplier::inRandomOrder()->value('id'),
                'm_property_item_id' => MPropertyItem::where('property_code', 'S')->value('id'),
                'expired_date' => null,
            ])
            ->create();
    }

    /**
     * =============================
     * PRODUK BAHAN BAKU
     * =============================
     */
    private function seedRawMaterials(): void
    {
        CoreProduct::factory()
            ->count(40)
            ->rawMaterial()
            ->state(fn () => [
                'm_category_id' => MCategory::where('category_code', 'FOOD1')->value('id'),
                'm_supplier_id' => MSupplier::inRandomOrder()->value('id'),
'm_property_item_id' => MPropertyItem::where('property_code', 'R')
    ->value('id')
    ?? MPropertyItem::inRandomOrder()->value('id'),

                'brand_name' => null,
                'expired_date' => now()->addMonths(rand(6, 24)),
            ])
            ->create();
    }
}
