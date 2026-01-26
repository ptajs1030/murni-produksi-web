<?php

namespace Database\Seeders;

use App\Models\CoreProduct;
use App\Models\CoreProductImage;
use App\Models\MCategory;
use App\Models\MPropertyItem;
use App\Models\MSupplier;
use Illuminate\Database\Seeder;

class CoreProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat produk dengan berbagai skenario
        $this->createElectronicsProducts();
        $this->createFoodProducts();
        $this->createFashionProducts();
    }

    /**
     * Buat produk elektronik
     */
    private function createElectronicsProducts()
    {
        CoreProduct::factory()
            ->count(10)
            ->electronics()
            ->withPopularBrand()
            ->state([
                'm_category_id' => MCategory::where('category_code', 'ELEC1')->first()->id,
                'm_supplier_id' => MSupplier::where('supplier_code', 'SUP01')->first()->id,
                'm_property_item_id' => MPropertyItem::where('property_code', 'F')->first()->id,
            ])
            ->create();
    }

    /**
     * Buat produk makanan
     */
    private function createFoodProducts()
    {
        CoreProduct::factory()
            ->count(10)
            ->food()
            ->withExpiry()
            ->state([
                'm_category_id' => MCategory::where('category_code', 'FOOD1')->first()->id,
                'm_supplier_id' => MSupplier::where('supplier_code', 'SUP02')->first()->id,
                'm_property_item_id' => MPropertyItem::where('property_code', 'S')->first()->id,
            ])
            ->create();

        CoreProduct::factory()
            ->count(2)
            ->food()
            ->expiringSoon()
            ->state([
                'm_category_id' => MCategory::where('category_code', 'FOOD1')->first()->id,
                'm_supplier_id' => MSupplier::where('supplier_code', 'SUP02')->first()->id,
                'm_property_item_id' => MPropertyItem::where('property_code', 'S')->first()->id,
            ])
            ->create();
    }

    /**
     * Buat produk fashion
     */
    private function createFashionProducts()
    {
        CoreProduct::factory()
            ->count(10)
            ->state([
                'm_category_id' => MCategory::where('category_code', 'FASH1')->first()->id,
                'm_supplier_id' => MSupplier::inRandomOrder()->first()->id,
                'm_property_item_id' => MPropertyItem::where('property_code', 'S')->first()->id,
            ])
            ->create();
    }

    /**
     * Buat produk lengkap dengan units dan images
     */
   
}
