<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleBasedUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@tcc.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create Staff User
        User::create([
            'first_name' => 'Staff',
            'last_name' => 'User',
            'username' => 'staff',
            'email' => 'staff@tcc.com',
            'role' => 'staff',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}
