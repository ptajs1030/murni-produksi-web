<?php

namespace Database\Factories;

use App\Models\CoreProduct;
use App\Models\CoreStock;
use App\Models\CoreStok;
use App\Models\MWarehouse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CoreStock>
 */
class CoreStockFactory extends Factory
{
    protected $model = CoreStock::class;
    private static $usedCombinations = [];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {

         $product = CoreProduct::whereNotIn(
    'id',
    CoreStock::pluck('product_id')
)->inRandomOrder()->first();

if (!$product) {
    return [];
}
        return [
            'product_id' => $product->id,
            'in_stock' => $this->faker->numberBetween(0, 200),
            'packaging_size_input' => $product->packaging_size_input, 
            'track_stock' => $this->faker->boolean(90),
            'track_alert' => $this->faker->boolean(70),
            'stock_alert' => $this->faker->boolean(20),
            'track_cost' => $this->faker->boolean(80),
            'cost_amount' => $this->faker->boolean(70) ? $this->faker->randomFloat(2, 5000, 50000) : null,
            'created_by' => User::inRandomOrder()->first()->id ?? User::factory(),
            'updated_by' => $this->faker->optional(0.3)->randomElement(User::pluck('id')->toArray()),
            'deleted_by' => null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    // Reset used combinations (untuk testing)
    public static function resetUsedCombinations()
    {
        self::$usedCombinations = [];
    }
}
