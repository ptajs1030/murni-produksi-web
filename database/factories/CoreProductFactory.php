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

    protected array $finishedProducts = [
        'Keripik Singkong Original',
        'Keripik Singkong Balado',
        'Keripik Pisang Coklat',
        'Keripik Pisang Keju',
        'Sambal Bawang Pedas',
        'Sambal Matah',
        'Sambal Ijo',
        'Kopi Susu Gula Aren',
        'Kopi Hitam Premium',
        'Teh Botol Manis',
        'Teh Lemon',
        'Minuman Coklat',
        'Susu Coklat',
        'Susu Stroberi',
        'Roti Manis Coklat',
        'Roti Manis Keju',
        'Brownies Kukus',
        'Brownies Panggang',
        'Donat Gula',
        'Donat Coklat',
        'Donat Keju',
        'Cake Pisang',
        'Cake Coklat',
        'Muffin Blueberry',
        'Muffin Coklat',
        'Cookies Coklat Chip',
        'Cookies Oatmeal',
        'Biskuit Keju',
        'Biskuit Coklat',
        'Pudding Coklat',
        'Pudding Vanilla',
        'Pudding Strawberry',
        'Es Krim Vanilla',
        'Es Krim Coklat',
        'Es Krim Stroberi',
        'Frozen Nugget Ayam',
        'Frozen Sosis Ayam',
        'Frozen Kentang',
        'Frozen Bakso',
    ];

    protected array $rawMaterials = [
        'Tepung Terigu',
        'Tepung Beras',
        'Tepung Tapioka',
        'Gula Pasir',
        'Gula Aren',
        'Gula Halus',
        'Garam Halus',
        'Minyak Goreng',
        'Mentega',
        'Margarin',
        'Susu Bubuk',
        'Susu Cair',
        'Coklat Bubuk',
        'Coklat Batang',
        'Keju Parut',
        'Keju Blok',
        'Telur Ayam',
        'Ragi',
        'Vanili',
        'Baking Powder',
        'Baking Soda',
        'Maizena',
        'Kopi Bubuk',
        'Teh Kering',
        'Cabe Merah',
        'Cabe Rawit',
        'Bawang Merah',
        'Bawang Putih',
        'Kemiri',
        'Ketumbar',
        'Lada',
        'Daging Ayam',
        'Daging Sapi',
        'Ikan Fillet',
        'Udang',
        'Minyak Wijen',
        'Kecap Manis',
        'Kecap Asin',
        'Saus Tiram',
        'Saus Sambal',
        'Saus Tomat',
        'Mayones',
        'Keju Cair',
        'Susu Kental Manis',
        'Whipping Cream',
        'Cocoa Powder',
        'Gula Cair',
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
