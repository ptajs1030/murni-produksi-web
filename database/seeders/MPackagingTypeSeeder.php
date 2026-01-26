<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MPackagingTypeSeeder extends Seeder
{
    public function run(): void
    {
        $created_at = now();

        // Diurutkan dari kemasan terbesar ke terkecil berdasarkan kapasitas umum
        DB::table('m_packaging_types')->insert([
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_type_code' => 'DR', 'packaging_type_name' => 'Drum', 'packaging_level_id' => 1],        // ~200L (terbesar)
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_type_code' => 'KR', 'packaging_type_name' => 'Karung', 'packaging_level_id' => 2],     // ~50kg bahan curah
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_type_code' => 'SK', 'packaging_type_name' => 'Sak', 'packaging_level_id' => 3],        // ~25kg bahan curah
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_type_code' => 'JR', 'packaging_type_name' => 'Jerigen', 'packaging_level_id' => 4],    // ~20L cairan
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_type_code' => 'KD', 'packaging_type_name' => 'Kardus', 'packaging_level_id' => 5],     // Bervariasi (sedang-besar)
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_type_code' => 'PL', 'packaging_type_name' => 'Plastik', 'packaging_level_id' => 6],   // Bervariasi (kecil-sedang)
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_type_code' => 'BT', 'packaging_type_name' => 'Botol', 'packaging_level_id' => 7],      // ~1L (terkecil)
        ]);
    }
}
