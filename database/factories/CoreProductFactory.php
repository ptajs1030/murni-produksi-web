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

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CoreProduct>
 */
class CoreProductFactory extends Factory
{
    protected $model = CoreProduct::class;

    public function definition(): array
    {
        return [
            'm_category_id' => MCategory::inRandomOrder()->first()->id,
            'm_supplier_id' => MSupplier::inRandomOrder()->first()->id,
            'target_selling_date' => $this->faker->optional(0.7)->dateTimeBetween('now', '+6 months'),
            'product_is_pre_order' => $this->faker->boolean(20),
            'product_processing_days' => $this->faker->randomElement([0, 1, 2, 3, 5, 7, 14]),
            'product_name' => $this->faker->words(rand(2, 4), true),
            'brand_name' => $this->faker->optional(0.8)->company(),
            'created_by' => User::inRandomOrder()->first()->id,
            'updated_by' => null,
            'deleted_by' => null,
            'm_packaging_size_id' => MPackagingSize::inRandomOrder()->first()->id,
            'm_packaging_type_id' => MPackagingType::inRandomOrder()->first()->id,
            'm_repack_status_id' => MRepackStatus::inRandomOrder()->first()->id,
            'm_property_item_id' => MPropertyItem::inRandomOrder()->first()->id,
            'packaging_size_input' => $this->faker->randomElement(['100', '250', '500', '1', '50', '100', '250', '500', '1000']),
            // product_unit_sku akan auto-generate via model
            'product_unit_qty' => $this->faker->randomFloat(2, 1, 1000),
            'product_unit_price' => $this->faker->randomFloat(2, 5000, 500000),
            'expired_date' => $this->faker->optional(0.6)->dateTimeBetween('+1 month', '+2 years'),
        ];

    }

    /**
     * State untuk produk pre-order
     */
    public function preOrder(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_is_pre_order' => true,
            'product_processing_days' => $this->faker->numberBetween(3, 30),
        ]);
    }

    /**
     * State untuk produk ready stock
     */
    public function readyStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_is_pre_order' => false,
            'product_processing_days' => 0,
        ]);
    }

    /**
     * State untuk produk dengan brand terkenal
     */
    public function withPopularBrand(): static
    {
        $brands = [
            'Samsung', 'Apple', 'Sony', 'LG', 'Panasonic',
            'Philips', 'Xiaomi', 'Huawei', 'Canon', 'Nikon',
        ];

        return $this->state(fn (array $attributes) => [
            'brand_name' => $this->faker->randomElement($brands),
        ]);
    }

    /**
     * State untuk produk elektronik
     */
    public function electronics(): static
    {
        $electronicNames = [
            'Smartphone Android', 'Laptop Gaming', 'Smart TV LED',
            'Wireless Earbuds', 'Power Bank', 'Bluetooth Speaker',
            'Digital Camera', 'Smartwatch', 'Tablet', 'Gaming Mouse',
        ];

        return $this->state(fn (array $attributes) => [
            'product_name' => $this->faker->randomElement($electronicNames),
        ]);
    }

    /**
     * State untuk produk makanan
     */
    public function food(): static
    {
        $foodNames = [
            'Snack Keripik Singkong', 'Kopi Arabika Premium', 'Mie Instan Pedas',
            'Biskuit Cokelat', 'Teh Hijau Organik', 'Kerupuk Udang',
            'Sambal Botol', 'Rendang Kalengan', 'Dodol Betawi', 'Keju Olahan',
        ];

        return $this->state(fn (array $attributes) => [
            'product_name' => $this->faker->randomElement($foodNames),
        ]);
    }

    /**
     * State untuk unit dengan expired date
     */
    public function withExpiry(): static
    {
        return $this->state(fn (array $attributes) => [
            'expired_date' => $this->faker->dateTimeBetween('+1 month', '+2 years'),
        ]);
    }

    /**
     * State untuk unit tanpa expired date
     */
    public function withoutExpiry(): static
    {
        return $this->state(fn (array $attributes) => [
            'expired_date' => null,
        ]);
    }

    /**
     * State untuk unit yang sudah expired
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expired_date' => $this->faker->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }

    /**
     * State untuk unit yang akan expired soon
     */
    public function expiringSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'expired_date' => $this->faker->dateTimeBetween('now', '+30 days'),
        ]);
    }

    /**
     * State untuk unit dengan harga murah
     */
    public function cheapPrice(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_unit_price' => $this->faker->randomFloat(2, 1000, 25000),
        ]);
    }

    /**
     * State untuk unit dengan harga mahal
     */
    public function expensivePrice(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_unit_price' => $this->faker->randomFloat(2, 100000, 1000000),
        ]);
    }

    /**
     * State untuk unit minuman
     */
    public function beverageUnit(): static
    {
        $sizes = ['100', '250', '330', '500', '600', '1000', '1500'];

        return $this->state(fn (array $attributes) => [
            'packaging_size_input' => $this->faker->randomElement($sizes),
            'product_unit_qty' => $this->faker->numberBetween(12, 144), // per karton
        ]);
    }

    /**
     * State untuk unit makanan
     */
    public function foodUnit(): static
    {
        $sizes = ['50', '100', '150', '250', '500', '1000', '2000'];

        return $this->state(fn (array $attributes) => [
            'packaging_size_input' => $this->faker->randomElement($sizes),
            'product_unit_qty' => $this->faker->numberBetween(6, 48), // per karton
        ]);
    }

    /**
     * State untuk unit elektronik
     */
    public function electronicUnit(): static
    {
        return $this->state(fn (array $attributes) => [
            'packaging_size_input' => '1',
            'product_unit_qty' => $this->faker->numberBetween(1, 10),
            'product_unit_price' => $this->faker->randomFloat(2, 50000, 2000000),
            'expired_date' => null, // Elektronik tidak expired
        ]);
    }
}
