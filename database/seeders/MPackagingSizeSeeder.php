<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MPackagingSizeSeeder extends Seeder
{
    public function run(): void
    {
        $created_at = now();

        // Weight Units (Satuan Berat) - Type ID: 1
        $weightData = [
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'TON', 'packaging_size_name' => 'Ton (1,000,000 Gr)', 'unit_conversion_value' => 1_000_000, 'packaging_size_type_id' => 1, 'packaging_level_id' => 5],           // 1000 kg
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'KWN', 'packaging_size_name' => 'Kwintal (100,000 Gr)', 'unit_conversion_value' => 1_00_000, 'packaging_size_type_id' => 1, 'packaging_level_id' => 4],      // 1000 g
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'KG', 'packaging_size_name' => 'Kilogram (1000 Gr)', 'unit_conversion_value' => 1000, 'packaging_size_type_id' => 1, 'packaging_level_id' => 3],      // 1000 g
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'ONS', 'packaging_size_name' => 'Ons (100 Gr)', 'unit_conversion_value' => 100, 'packaging_size_type_id' => 1, 'packaging_level_id' => 2], // 100 g
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'G', 'packaging_size_name' => 'Gram (Base Unit)', 'unit_conversion_value' => 1, 'packaging_size_type_id' => 1, 'packaging_level_id' => 1],          // 1 g
        ];

        // Volume Units (Satuan Volume) - Type ID: 2 - DIPERBAIKI URUTAN
        $volumeData = [
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'GAL', 'packaging_size_name' => 'Gallon (19,000 Ml)', 'unit_conversion_value' => 19_000, 'packaging_size_type_id' => 2, 'packaging_level_id' => 3],        // ~3.8 L
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'L', 'packaging_size_name' => 'Liter (1000 Ml)', 'unit_conversion_value' => 1_000, 'packaging_size_type_id' => 2, 'packaging_level_id' => 2],          // 1000 ml
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'ML', 'packaging_size_name' => 'Milli Liter (Base Unit)', 'unit_conversion_value' => 1, 'packaging_size_type_id' => 2, 'packaging_level_id' => 1],   // 1 ml
        ];

        // Length Units (Satuan Panjang) - Type ID: 3
        $lengthData = [
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'M', 'packaging_size_name' => 'Meter (1000 Mm)', 'unit_conversion_value' => 1000, 'packaging_size_type_id' => 3, 'packaging_level_id' => 4],        // 1000 mm
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'CM', 'packaging_size_name' => 'Centimeter (10 Mm)', 'unit_conversion_value' => 10, 'packaging_size_type_id' => 3, 'packaging_level_id' => 3],     // 10 mm
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'INCH', 'packaging_size_name' => 'Inch (25 Mm)', 'unit_conversion_value' => 25, 'packaging_size_type_id' => 3, 'packaging_level_id' => 2],       // ~25.4 mm
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'MM', 'packaging_size_name' => 'Millimeter (Base Unit)', 'unit_conversion_value' => 1, 'packaging_size_type_id' => 3, 'packaging_level_id' => 1],      // 1 mm (base)
        ];

        // Quantity Units (Satuan Jumlah) - Type ID: 4
        $quantityData = [
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'DOZEN', 'packaging_size_name' => 'Dozen (12 Pcs)', 'unit_conversion_value' => 12, 'packaging_size_type_id' => 4, 'packaging_level_id' => 5],     // 12 pieces
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'SET', 'packaging_size_name' => 'Set (6 Pcs)', 'unit_conversion_value' => 6, 'packaging_size_type_id' => 4, 'packaging_level_id' => 3],        // 6 pieces (set)
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'PAIR', 'packaging_size_name' => 'Pair (2 Pcs)', 'unit_conversion_value' => 2, 'packaging_size_type_id' => 4, 'packaging_level_id' => 3],      // 2 pieces
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'UNIT', 'packaging_size_name' => 'Unit (1 Pcs)', 'unit_conversion_value' => 1, 'packaging_size_type_id' => 4, 'packaging_level_id' => 2],      // 1 piece
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'PCS', 'packaging_size_name' => 'Pieces (Base Unit)', 'unit_conversion_value' => 1, 'packaging_size_type_id' => 4, 'packaging_level_id' => 1],     // 1 piece (base)
        ];

        // Packaging Units (Satuan Kemasan) - Type ID: 5
        $packagingData = [
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'KB', 'packaging_size_name' => 'Karton Besar (50 Bundle)', 'unit_conversion_value' => 50, 'packaging_size_type_id' => 5, 'packaging_level_id' => 6],      // 50+ bundles
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'BOX', 'packaging_size_name' => 'Box (24 Bundle)', 'unit_conversion_value' => 24, 'packaging_size_type_id' => 5, 'packaging_level_id' => 5],                           // 24 bundles
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'KARTON', 'packaging_size_name' => 'Karton (12 Bundle)', 'unit_conversion_value' => 12, 'packaging_size_type_id' => 5, 'packaging_level_id' => 4],                    // 12 bundles
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'KR', 'packaging_size_name' => 'Karton (12 Bundle - Anggur, Essen, Pembersih)', 'unit_conversion_value' => 12, 'packaging_size_type_id' => 5, 'packaging_level_id' => 4], // 12 bundles
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'DK', 'packaging_size_name' => 'Dus Kecil (12 Bundle)', 'unit_conversion_value' => 12, 'packaging_size_type_id' => 5, 'packaging_level_id' => 3],  // 12 bundles (1 lusin)
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'PACK', 'packaging_size_name' => 'Pack (6 Bundle)', 'unit_conversion_value' => 6, 'packaging_size_type_id' => 5, 'packaging_level_id' => 2],                        // 6 bundles
            ['created_at' => $created_at, 'created_by' => 1, 'packaging_size_code' => 'BUNDLE', 'packaging_size_name' => 'Bundle (Base Unit)', 'unit_conversion_value' => 1, 'packaging_size_type_id' => 5, 'packaging_level_id' => 1],                    // 1 bundle (base)
        ];

        // Insert all data
        DB::table('m_packaging_sizes')->insert(array_merge(
            $weightData,
            $volumeData,
            $lengthData,
            $quantityData,
            $packagingData
        ));
    }
}
