<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MSupplierSeeder extends Seeder
{
    public function run(): void
    {
        $created_at = now();
        DB::table('m_suppliers')->insert([
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'BH', 'supplier_name' => 'Bahn Hoft'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'PF', 'supplier_name' => 'Parfex'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'SP', 'supplier_name' => 'Sopra'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'JG', 'supplier_name' => 'Jamu Jago'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'PS', 'supplier_name' => 'Prosmart'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'TR', 'supplier_name' => 'Trabaud'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'BB', 'supplier_name' => 'Bubuk'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'PL', 'supplier_name' => 'Plastik'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'KD', 'supplier_name' => 'Kardus'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'BT', 'supplier_name' => 'Botol'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'SUP01', 'supplier_name' => 'Supplier 01'],
            ['created_at' => $created_at, 'created_by' => 1, 'supplier_code' => 'SUP02', 'supplier_name' => 'Supplier 02'],
        ]);
    }
}
