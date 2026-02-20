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
            'password' => bcrypt('password'), // Ganti dengan password yang aman
            'role' => 'owner',
        ]);

        // 2. Admin (3 orang)
        $admins = [
            [
                'name' => 'admin',
                'email' => 'admin@mail.com',
                'password' => bcrypt('password'),
            ],
            [
                'name' => 'Admin Utama',
                'email' => 'admin1@mail.com',
                'password' => bcrypt('password'),
            ],
            [
                'name' => 'Admin Dua',
                'email' => 'admin2@mail.com',
                'password' => bcrypt('password'),
            ],
            [
                'name' => 'Admin Tiga',
                'email' => 'admin3@mail.com',
                'password' => bcrypt('password'),
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
                'name' => 'Petugas Satu',
                'email' => 'petugas1@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Petugas Dua',
                'email' => 'petugas2@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Petugas Tiga',
                'email' => 'petugas3@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Petugas Empat',
                'email' => 'petugas4@mail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Petugas Lima',
                'email' => 'petugas5@mail.com',
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
        $this->command->info('Owner: 1, Admin: 3, Petugas: 5, User: 1');
    }
}