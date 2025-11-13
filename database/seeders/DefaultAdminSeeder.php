<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin account if it doesn't exist
        User::firstOrCreate(
            ['email' => 'admin@tcc.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@tcc.com',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
