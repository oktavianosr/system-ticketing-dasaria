<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ticket;
use Database\Factories\TicketFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Ticket::factory(10)->create();

    }
}
