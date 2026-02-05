<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // database/seeders/UserSeeder.php
    public function run(): void
    {
        // 1 Admin
        User::create([
            'name' => 'Super Admin ISP',
            'email' => 'admin@isp.net',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2 Agents
        User::create(['name' => 'Budi Agent 1', 'email' => 'budi@isp.net', 'password' => Hash::make('password'), 'role' => 'agent']);
        User::create(['name' => 'Sari Agent 2', 'email' => 'sari@isp.net', 'password' => Hash::make('password'), 'role' => 'agent']);

        // 2 Customers
        User::create(['name' => 'Andi Customer', 'email' => 'andi@gmail.com', 'password' => Hash::make('password'), 'role' => 'customer']);
        User::create(['name' => 'Maya Customer', 'email' => 'maya@gmail.com', 'password' => Hash::make('password'), 'role' => 'customer']);
    }
}
