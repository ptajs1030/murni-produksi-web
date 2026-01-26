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
        ];

        DB::table('m_transaction_types')->insert($types);
    }
}
