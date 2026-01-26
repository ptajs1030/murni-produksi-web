<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MOutTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        $now = now();

        $types = [
            ['out_type_name' => 'SEALING', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['out_type_name' => 'RETUR', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['out_type_name' => 'PECAHAN', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['out_type_name' => 'RETUR BELUM DISETUJUI', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['out_type_name' => 'RETUR DISETUJUI', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['out_type_name' => 'RETUR DITOLAK', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['out_type_name' => 'TERJUAL', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('m_out_types')->insert($types);
    }
}
