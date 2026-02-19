<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // 1. Owner
        User::create([
            'name' => 'Pemilik Sistem',
            'email' => 'owner@mail.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password123'), // Ganti dengan password yang aman
            'role' => 'owner',
        ]);

        // 2. Admin (3 orang)
        $admins = [
            [
                'name' => 'Admin Utama',
                'email' => 'admin1@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Admin Dua',
                'email' => 'admin2@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Admin Tiga',
                'email' => 'admin3@mail.com',
                'password' => bcrypt('password123'),
            ],
        ];

        foreach ($admins as $admin) {
            User::create(array_merge($admin, [
                'email_verified_at' => now(),
                'role' => 'admin',

            ]));
        }

        // 3. Operator (5 orang)
        $operatorList = [
            [
                'name' => 'Operator Satu',
                'email' => 'operator1@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Operator Dua',
                'email' => 'operator2@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Operator Tiga',
                'email' => 'operator3@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Operator Empat',
                'email' => 'operator4@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Operator Lima',
                'email' => 'operator5@mail.com',
                'password' => bcrypt('password123'),
            ],
        ];

        foreach ($operatorList as $operator) {
            User::create(array_merge($operator, [
                'email_verified_at' => now(),
                'role' => 'operator',
            ]));
        }


        $this->command->info('Seeder berhasil dijalankan!');
        $this->command->info('Total user yang dibuat: ' . User::count());
        $this->command->info('Owner: 1, Admin: 3, Operator: 5');
    }
}