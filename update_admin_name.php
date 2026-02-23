<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$adminUser = User::where('email', 'admin@mail.com')->first();

if ($adminUser) {
    $adminUser->name = 'petugas1@mail.com';
    $adminUser->save();
    echo "Nama tampilan user admin@mail.com berhasil diubah menjadi petugas1@mail.com\n";
} else {
    echo "User admin@mail.com tidak ditemukan.\n";
}

?>