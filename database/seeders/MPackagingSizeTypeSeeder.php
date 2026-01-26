<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MPackagingSizeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $created_at = now();

        $sizeTypes = [
            ['id' => 1, 'created_at' => $created_at, 'created_by' => 1, 'type_code' => 'WEIGHT', 'type_description' => 'Satuan Berat', 'base_unit' => 'GR'],
            ['id' => 2, 'created_at' => $created_at, 'created_by' => 1, 'type_code' => 'VOLUME', 'type_description' => 'Satuan Volume', 'base_unit' => 'MlL'],
            ['id' => 3, 'created_at' => $created_at, 'created_by' => 1, 'type_code' => 'LENGTH', 'type_description' => 'Satuan Panjang', 'base_unit' => 'MM'],
            ['id' => 4, 'created_at' => $created_at, 'created_by' => 1, 'type_code' => 'QUANTITY', 'type_description' => 'Satuan Jumlah', 'base_unit' => 'PCS'],
            ['id' => 5, 'created_at' => $created_at, 'created_by' => 1, 'type_code' => 'PACKAGING', 'type_description' => 'Satuan Kemasan', 'base_unit' => 'BUNDLE'],
        ];

        DB::table('m_packaging_size_types')->insert($sizeTypes);
    }
}
