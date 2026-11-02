<?php

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates a booking with a valid payload', function (): void {
    $this->postJson('/api/bookings', bookingRequestPayload())
        ->assertCreated()
        ->assertJsonPath('data.customer_name', 'Avery Jones')
        ->assertJsonPath('data.status', 'pending');

    $this->assertDatabaseHas('bookings', [
        'customer_email' => 'avery@example.com',
        'service_bay' => 'Bay 1',
    ]);
});

it('returns field errors for a missing booking payload', function (): void {
    $this->postJson('/api/bookings', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'customer_name',
            'customer_email',
            'rego',
            'service_bay',
            'starts_at',
            'ends_at',
            'status',
        ]);
});

it('returns an ends at field error when a booking does not end after it starts', function (): void {
    $this->postJson('/api/bookings', bookingRequestPayload([
        'ends_at' => '2026-11-03 09:00:00',
    ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('ends_at');
});

it('normalizes offset timestamps to UTC before checking booking overlaps', function (): void {
    $this->postJson('/api/bookings', bookingRequestPayload([
        'starts_at' => '2026-11-03T09:00:00Z',
        'ends_at' => '2026-11-03T10:00:00Z',
    ]))
        ->assertCreated()
        ->assertJsonPath('data.starts_at', '2026-11-03T09:00:00.000000Z');

    $this->postJson('/api/bookings', bookingRequestPayload([
        'starts_at' => '2026-11-03T19:30:00+10:00',
        'ends_at' => '2026-11-03T20:30:00+10:00',
    ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('service_bay');
});

it('returns not found for a missing booking', function (): void {
    $this->getJson('/api/bookings/999')
        ->assertNotFound();
});

it('returns a service bay error when an update overlaps another active booking', function (): void {
    $booking = Booking::factory()->create([
        'service_bay' => 'Bay 1',
        'starts_at' => '2026-11-03 09:00:00',
        'ends_at' => '2026-11-03 10:00:00',
        'status' => 'confirmed',
    ]);
    $secondBooking = Booking::factory()->create([
        'service_bay' => 'Bay 1',
        'starts_at' => '2026-11-03 11:00:00',
        'ends_at' => '2026-11-03 12:00:00',
        'status' => 'confirmed',
    ]);

    $this->patchJson('/api/bookings/'.$secondBooking->id, bookingRequestPayload([
        'starts_at' => '2026-11-03 09:30:00',
        'ends_at' => '2026-11-03 10:30:00',
    ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('service_bay');

    expect($booking->refresh()->starts_at->format('H:i'))->toBe('09:00');
});

it('filters and paginates bookings by status', function (): void {
    Booking::factory()
        ->count(11)
        ->sequence(fn (Sequence $sequence): array => [
            'starts_at' => now()->startOfDay()->addHours($sequence->index * 2),
            'ends_at' => now()->startOfDay()->addHours(($sequence->index * 2) + 1),
            'status' => 'confirmed',
        ])
        ->create();
    Booking::factory()->create([
        'status' => 'pending',
    ]);

    $this->getJson('/api/bookings?status=confirmed&page=2')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('meta.current_page', 2)
        ->assertJsonPath('data.0.status', 'confirmed');
});

it('deletes a booking', function (): void {
    $booking = Booking::factory()->create();

    $this->deleteJson('/api/bookings/'.$booking->id)
        ->assertNoContent();

    $this->assertDatabaseMissing('bookings', ['id' => $booking->id]);
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function bookingRequestPayload(array $overrides = []): array
{
    return array_merge([
        'customer_name' => 'Avery Jones',
        'customer_email' => 'avery@example.com',
        'rego' => 'CAR-123',
        'service_bay' => 'Bay 1',
        'starts_at' => '2026-11-03 09:00:00',
        'ends_at' => '2026-11-03 10:00:00',
        'status' => 'pending',
        'notes' => null,
    ], $overrides);
}
