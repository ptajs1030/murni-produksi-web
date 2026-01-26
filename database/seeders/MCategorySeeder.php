<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MCategorySeeder extends Seeder
{
    public function run(): void
    {
        $created_at = now();

        DB::table('m_categories')->insert([
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'BP', 'category_name' => 'Botol Parfum'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'KM', 'category_name' => 'Kimia'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'MP', 'category_name' => 'Minyak Parfum'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'JM', 'category_name' => 'Jamu'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'PS', 'category_name' => 'Produksi Sirup'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'PM', 'category_name' => 'Pembersih'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'PK', 'category_name' => 'Packaging'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'WG', 'category_name' => 'Wedang Galak'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'PR', 'category_name' => 'Produksi'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'ELEC1', 'category_name' => 'Elektronik'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'FOOD1', 'category_name' => 'Makanan'],
            ['created_at' => $created_at, 'created_by' => 1, 'category_code' => 'FASH1', 'category_name' => 'Fashion'],

        ]);
    }
}
