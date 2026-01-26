<?php

namespace Database\Seeders;

// database/seeders/MPropertyItemSeeder.php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MPropertyItemSeeder extends Seeder
{
    public function run(): void
    {
        $created_at = now();
        DB::table('m_property_items')->insert([
            ['created_at' => $created_at, 'created_by' => 1, 'property_code' => 'P', 'property_name' => 'Padat'],
            ['created_at' => $created_at, 'created_by' => 1, 'property_code' => 'C', 'property_name' => 'Cair'],
            ['created_at' => $created_at, 'created_by' => 1, 'property_code' => 'F', 'property_name' => 'Filler'],
            ['created_at' => $created_at, 'created_by' => 1, 'property_code' => 'S', 'property_name' => 'Makanan'],
        ]);
    }
}
