<?php

use App\Application\Bookings\CreateBooking;
use App\Domain\Bookings\OverlappingBooking;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('rejects an overlapping active booking in the same service bay', function (): void {
    $createBooking = app(CreateBooking::class);

    $createBooking->handle(bookingAttributes());

    expect(fn () => $createBooking->handle(bookingAttributes([
        'starts_at' => '2026-11-03 09:30:00',
        'ends_at' => '2026-11-03 10:30:00',
    ])))->toThrow(OverlappingBooking::class);
});

it('accepts adjacent bookings in the same service bay', function (): void {
    $createBooking = app(CreateBooking::class);

    $createBooking->handle(bookingAttributes());
    $createBooking->handle(bookingAttributes([
        'starts_at' => '2026-11-03 10:00:00',
        'ends_at' => '2026-11-03 11:00:00',
    ]));

    expect(Booking::query()->count())->toBe(2);
});

it('allows a booking over a cancelled booking interval', function (): void {
    $createBooking = app(CreateBooking::class);

    $createBooking->handle(bookingAttributes(['status' => 'cancelled']));
    $createBooking->handle(bookingAttributes());

    expect(Booking::query()->count())->toBe(2);
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function bookingAttributes(array $overrides = []): array
{
    return array_merge([
        'customer_name' => 'Avery Jones',
        'customer_email' => 'avery@example.com',
        'rego' => 'CAR-123',
        'service_bay' => 'Bay 1',
        'starts_at' => '2026-11-03 09:00:00',
        'ends_at' => '2026-11-03 10:00:00',
        'status' => 'confirmed',
        'notes' => null,
    ], $overrides);
}
