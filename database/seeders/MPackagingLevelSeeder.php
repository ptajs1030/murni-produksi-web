<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MPackagingLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $created_at = now();

        DB::table('m_packaging_levels')->insert([
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 1, 'level_description' => 'product level 1'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 2, 'level_description' => 'product level 2'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 3, 'level_description' => 'product level 3'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 4, 'level_description' => 'product level 4'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 5, 'level_description' => 'product level 5'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 6, 'level_description' => 'product level 6'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 7, 'level_description' => 'product level 7'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 8, 'level_description' => 'product level 8'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 9, 'level_description' => 'product level 9'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 10, 'level_description' => 'product level 10'],
            ['created_at' => $created_at, 'created_by' => 1, 'level_code' => 11, 'level_description' => 'product level 11'],
        ]);
    }
}
