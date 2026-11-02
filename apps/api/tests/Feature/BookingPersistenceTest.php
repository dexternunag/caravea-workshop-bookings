<?php

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

uses(RefreshDatabase::class);

it('persists a booking and exposes its required API fields', function (): void {
    $booking = Booking::factory()->create([
        'customer_name' => 'Avery Jones',
        'customer_email' => 'avery@example.com',
        'rego' => 'CAR-123',
        'service_bay' => 'Bay 1',
        'starts_at' => '2026-11-03 09:00:00',
        'ends_at' => '2026-11-03 10:00:00',
        'status' => 'pending',
        'notes' => null,
    ]);

    $payload = (new BookingResource($booking))->resolve(Request::create('/'));

    expect($payload)->toMatchArray([
        'id' => $booking->id,
        'customer_name' => 'Avery Jones',
        'customer_email' => 'avery@example.com',
        'rego' => 'CAR-123',
        'service_bay' => 'Bay 1',
        'status' => 'pending',
        'notes' => null,
    ]);
});
