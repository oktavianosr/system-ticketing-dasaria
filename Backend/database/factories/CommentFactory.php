<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ticketIds = Ticket::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray();

        return [
            // Jika ingin fix 1-15 sesuai instruksi sebelumnya, gunakan numberBetween(1, 15)
            // Namun menggunakan randomElement($ticketIds) jauh lebih aman
            'ticket_id' => $this->faker->randomElement($ticketIds),
            'created_by' => $this->faker->randomElement($userIds),
            'body' => $this->faker->paragraph(2),
            'created_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'updated_at' => now(),
        ];
    }
}
