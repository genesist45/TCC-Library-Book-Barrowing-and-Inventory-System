<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SetupController extends Controller
{
    /**
     * Create or reset default admin account
     * Access: /setup-admin
     */
    public function createAdmin()
    {
        // Check if admin already exists
        $existingAdmin = User::where('email', 'admin@tcc.com')->first();
        
        if ($existingAdmin) {
            // Reset existing admin account
            $existingAdmin->update([
                'first_name' => 'Admin',
                'last_name' => 'User',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);
            
            return response()->json([
                'status' => 'reset',
                'message' => 'Admin account password has been RESET!',
                'email' => 'admin@tcc.com',
                'password' => 'password',
                'note' => 'You can now login with these credentials!'
            ]);
        }

        // Create new admin account
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@tcc.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'status' => 'created',
            'message' => 'Admin account created successfully!',
            'email' => 'admin@tcc.com',
            'password' => 'password',
            'note' => 'Please login and change your password immediately!'
        ]);
    }
}
