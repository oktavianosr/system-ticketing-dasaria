<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada user di database terlebih dahulu
        if (User::count() === 0) {
            $this->command->warn('Tidak ada user di database. Jalankan UserSeeder terlebih dahulu.');
            return;
        }

        $this->command->info('Membuat tickets...');

        // Buat 50 tickets dengan status random
        Ticket::factory(50)->create();

        // Buat 10 tickets dengan status open
        Ticket::factory(10)->open()->create();

        // Buat 8 tickets dengan status in progress
        Ticket::factory(8)->inProgress()->create();

        // Buat 5 tickets dengan high priority
        Ticket::factory(5)->highPriority()->create();

        // Buat 3 tickets yang closed dengan high priority
        Ticket::factory(3)->closed()->highPriority()->create();

        $this->command->info('Tickets berhasil dibuat: ' . Ticket::count() . ' tickets');
    }
}