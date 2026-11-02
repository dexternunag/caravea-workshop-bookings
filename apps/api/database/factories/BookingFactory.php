<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('-1 week', '+1 week');

        return [
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'rego' => fake()->bothify('???-###'),
            'service_bay' => 'Bay '.fake()->numberBetween(1, 4),
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->modify('+1 hour'),
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
