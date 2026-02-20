<?php

namespace Database\Seeders;

use App\Models\CoreProduct;
use App\Models\MCategory;
use App\Models\MPackagingSize;
use App\Models\MPackagingType;
use App\Models\MPropertyItem;
use App\Models\MRepackStatus;
use App\Models\MSupplier;
use App\Models\User;
use Illuminate\Database\Seeder;

class CoreProductSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFinishedProducts();
        $this->seedRawMaterials();

        $this->command->info('Produk Jadi (Sirup): 10 varian');
        $this->command->info('Produk Bahan Baku: 32 item');
        $this->command->info('Total produk: ' . CoreProduct::count());
    }

    /**
     * =============================
     * PRODUK JADI - Sirup (10 varian)
     * =============================
     */
    private function seedFinishedProducts(): void
    {
        $sirupVariants = [
            'Sirup Rasa Cocopandan',
            'Sirup Rasa Leci',
            'Sirup Rasa Melon',
            'Sirup Rasa Stroberi',
            'Sirup Rasa Mangga',
            'Sirup Rasa Anggur',
            'Sirup Rasa Jeruk',
            'Sirup Rasa Frambozen',
            'Sirup Rasa Nanas',
            'Sirup Rasa Vanila',
        ];

        $categoryId = MCategory::where('category_code', 'FOOD1')->value('id') ?? MCategory::first()?->id;
        $supplierId = MSupplier::where('supplier_code', 'SUP02')->value('id') ?? MSupplier::first()?->id;
        $propertyId = MPropertyItem::where('property_code', 'S')->value('id') ?? MPropertyItem::first()?->id;

        foreach ($sirupVariants as $name) {
            CoreProduct::create([
                'product_name' => $name,
                'description' => 'Produk jadi sirup varian ' . str_replace('Sirup Rasa ', '', $name),
                'product_type' => 'Produk Jadi',
                'product_is_pre_order' => false,
                'product_processing_days' => 0,
                'brand_name' => 'Murni',
                'm_category_id' => $categoryId,
                'm_supplier_id' => $supplierId,
                'm_property_item_id' => $propertyId,
                'm_packaging_size_id' => MPackagingSize::inRandomOrder()->value('id'),
                'm_packaging_type_id' => MPackagingType::inRandomOrder()->value('id'),
                'm_repack_status_id' => MRepackStatus::inRandomOrder()->value('id'),
                'packaging_size_input' => fake()->randomElement([250, 500, 1000]),
                'product_unit_qty' => fake()->randomFloat(2, 10, 100),
                'product_unit_price' => fake()->randomFloat(2, 5000, 50000),
                'expired_date' => now()->addMonths(rand(3, 18)),
                'created_by' => User::inRandomOrder()->value('id'),
            ]);
        }
    }

    /**
     * =============================
     * PRODUK BAHAN BAKU (32 item)
     * =============================
     */
    private function seedRawMaterials(): void
    {
        $rawMaterials = [
            // Perisa - 10 varian
            'Perisa Cocopandan',
            'Perisa Leci',
            'Perisa Melon',
            'Perisa Stroberi',
            'Perisa Mangga',
            'Perisa Anggur',
            'Perisa Jeruk',
            'Perisa Frambozen',
            'Perisa Nanas',
            'Perisa Vanila',
            // Pemanis
            'Pemanis 1',
            'Pemanis 2',
            // Bahan kimia
            'Citrit Acid',
            // Kemasan
            'Botol',
            'Plastik Bahan 1',
            'Plastik Bahan 2',
            'Plastik Kemas',
            'Plastik Pak 1',
            'Plastik Pak 2',
            'Kardus Besar',
            'Kardus Kecil',
            // Tiket
            'Tiket Perhatian',
            'Tiket Cocopandan',
            'Tiket Leci',
            'Tiket Melon',
            'Tiket Stroberi',
            'Tiket Mangga',
            'Tiket Anggur',
            'Tiket Jeruk',
            'Tiket Frambozen',
            'Tiket Nanas',
            'Tiket Vanila',
        ];

        $categoryId = MCategory::where('category_code', 'FOOD1')->value('id') ?? MCategory::first()?->id;
        $propertyId = MPropertyItem::where('property_code', 'R')->value('id') ?? MPropertyItem::first()?->id;

        foreach ($rawMaterials as $name) {
            CoreProduct::create([
                'product_name' => $name,
                'description' => 'Bahan baku: ' . $name,
                'product_type' => 'Produk Bahan Baku',
                'product_is_pre_order' => false,
                'product_processing_days' => 0,
                'brand_name' => null,
                'm_category_id' => $categoryId,
                'm_supplier_id' => MSupplier::inRandomOrder()->value('id'),
                'm_property_item_id' => $propertyId,
                'm_packaging_size_id' => MPackagingSize::inRandomOrder()->value('id'),
                'm_packaging_type_id' => MPackagingType::inRandomOrder()->value('id'),
                'm_repack_status_id' => MRepackStatus::inRandomOrder()->value('id'),
                'packaging_size_input' => fake()->randomElement([50, 100, 250, 500, 1000, 2000, 5000]),
                'product_unit_qty' => fake()->randomFloat(2, 1, 100),
                'product_unit_price' => fake()->randomFloat(2, 2000, 80000),
                'expired_date' => now()->addMonths(rand(6, 24)),
                'created_by' => User::inRandomOrder()->value('id'),
            ]);
        }
    }
}
