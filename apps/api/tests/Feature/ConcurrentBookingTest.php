<?php

use App\Models\Booking;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('rejects a direct overlapping write in the same service bay', function (): void {
    Booking::factory()->create([
        'service_bay' => 'Bay 1',
        'starts_at' => '2026-11-03 09:00:00',
        'ends_at' => '2026-11-03 10:00:00',
        'status' => 'confirmed',
    ]);

    expect(fn () => Booking::query()->create([
        'customer_name' => 'Avery Jones',
        'customer_email' => 'avery@example.com',
        'rego' => 'CAR-123',
        'service_bay' => 'Bay 1',
        'starts_at' => '2026-11-03 09:30:00',
        'ends_at' => '2026-11-03 10:30:00',
        'status' => 'pending',
        'notes' => null,
    ]))->toThrow(QueryException::class);

    $this->assertDatabaseCount('bookings', 1);
});
