<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MTransactionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        $now = now();

        $types = [
            ['transaction_type_name' => 'IN', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['transaction_type_name' => 'OUT', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
<<<<<<< HEAD
            ['transaction_type_name' => 'REPACK_IN', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['transaction_type_name' => 'REPACK_OUT', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
=======
            ['transaction_type_name' => 'PRODUKSI', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],
            ['transaction_type_name' => 'REPACK', 'created_by' => $user->id, 'created_at' => $now, 'updated_at' => $now],

>>>>>>> 556241857610c50aac721d3516e5e1f4bc8a0993
        ];

        DB::table('m_transaction_types')->insert($types);
    }
}
