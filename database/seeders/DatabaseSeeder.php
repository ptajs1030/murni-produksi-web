<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\CoreProduct;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            MPackagingLevelSeeder::class,
            MPackagingSizeTypeSeeder::class,
        MCategorySeeder::class,
        MSupplierSeeder::class,
        MPropertyItemSeeder::class,
        MPackagingSizeSeeder::class,
        MPackagingTypeSeeder::class,
        MRepackStatusSeeder::class,
        MOutTypeSeeder::class,
        MTransactionTypeSeeder::class,
            CoreProductSeeder::class,
            CoreStockSeeder::class,
            CoreRecipeSeeder::class,
        ]);
    }
}