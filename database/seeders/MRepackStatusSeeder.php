<?php

namespace Database\Seeders;

// database/seeders/MRepackStatusSeeder.php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MRepackStatusSeeder extends Seeder
{
    public function run(): void
    {
        $created_at = now();
        DB::table('m_repack_status')->insert([
            ['created_at' => $created_at, 'created_by' => 1, 'repack_code' => 'RP', 'repack_name' => 'Repack'],
            ['created_at' => $created_at, 'created_by' => 1, 'repack_code' => 'NR', 'repack_name' => 'Non Repack'],
        ]);
    }
}
