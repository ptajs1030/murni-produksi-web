<?php

namespace Database\Factories;

use App\Models\CoreProduct;
use App\Models\MCategory;
use App\Models\MPackagingSize;
use App\Models\MPackagingType;
use App\Models\MPropertyItem;
use App\Models\MRepackStatus;
use App\Models\MSupplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoreProductFactory extends Factory
{
    protected $model = CoreProduct::class;

    /**
     * Produk Jadi: Sirup dengan 10 varian rasa
     */
    protected array $finishedProducts = [
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

    /**
     * Produk Bahan Baku untuk produksi Sirup
     */
    protected array $rawMaterials = [
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
        'Pemanis 1',
        'Pemanis 2',
        'Citrit Acid',
        'Botol',
        'Plastik Bahan 1',
        'Plastik Bahan 2',
        'Plastik Kemas',
        'Plastik Pak 1',
        'Plastik Pak 2',
        'Kardus Besar',
        'Kardus Kecil',
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

    public function definition(): array
    {
        $isFinishedProduct = $this->faker->boolean(45); // 45% produk jadi

        return [
            'm_category_id' => MCategory::inRandomOrder()->value('id'),
            'm_supplier_id' => MSupplier::inRandomOrder()->value('id'),

            'product_name' => $isFinishedProduct
                ? $this->faker->unique()->randomElement($this->finishedProducts)
                : $this->faker->unique()->randomElement($this->rawMaterials),

            'description' => $this->faker->optional()->sentence(),

            'product_type' => $isFinishedProduct
                ? 'Produk Jadi'
                : 'Produk Bahan Baku',

            'product_is_pre_order' => false,
            'product_processing_days' => 0,

            'brand_name' => $isFinishedProduct
                ? $this->faker->company()
                : null,

            'm_property_item_id' => MPropertyItem::where('property_code', 'P')->value('id'),

            'm_packaging_size_id' => MPackagingSize::inRandomOrder()->value('id'),
            'm_packaging_type_id' => MPackagingType::inRandomOrder()->value('id'),
            'm_repack_status_id' => MRepackStatus::inRandomOrder()->value('id'),

            'packaging_size_input' => $this->faker->randomElement([
                50, 100, 250, 500, 1000, 2000, 5000
            ]),

            'product_unit_qty' => $this->faker->randomFloat(2, 1, 100),
            'product_unit_price' => $isFinishedProduct
                ? $this->faker->randomFloat(2, 5000, 150000)
                : $this->faker->randomFloat(2, 2000, 80000),

            'expired_date' => $this->faker->dateTimeBetween('+1 month', '+2 years'),

            'created_by' => User::inRandomOrder()->value('id'),
            'updated_by' => null,
            'deleted_by' => null,
        ];
    }

    /* ===================== STATES ===================== */

    public function finishedProduct(): static
    {
        return $this->state(fn () => [
            'product_type' => 'Produk Jadi',
            'brand_name' => $this->faker->company(),
        ]);
    }

    public function rawMaterial(): static
    {
        return $this->state(fn () => [
            'product_type' => 'Produk Bahan Baku',
            'brand_name' => null,
        ]);
    }

    /**
     * Produk yang sudah expired (1 hari - 2 bulan yang lalu)
     */
    public function expired(): static
    {
        return $this->state(fn () => [
            'expired_date' => $this->faker->dateTimeBetween('-2 months', '-1 day'),
        ]);
    }

    /**
     * Produk yang akan expired dalam waktu dekat (1-10 hari)
     */
    public function expiringSoon(): static
    {
        return $this->state(fn () => [
            'expired_date' => $this->faker->dateTimeBetween('now', '+10 days'),
        ]);
    }

    /**
     * Produk yang akan expired dalam 11-30 hari
     */
    public function expiringInMonth(): static
    {
        return $this->state(fn () => [
            'expired_date' => $this->faker->dateTimeBetween('+11 days', '+30 days'),
        ]);
    }

    /**
     * Custom: Produk yang akan expired dalam X hari
     */
    public function expiringInDays(int $days): static
    {
        return $this->state(fn () => [
            'expired_date' => now()->addDays($days),
        ]);
    }
}
