<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            return;
        }

        DB::unprepared(<<<'SQL'
            CREATE TRIGGER reject_overlapping_booking_insert
            BEFORE INSERT ON bookings
            WHEN NEW.status <> 'cancelled'
                AND EXISTS (
                    SELECT 1
                    FROM bookings
                    WHERE service_bay = NEW.service_bay
                        AND status <> 'cancelled'
                        AND starts_at < NEW.ends_at
                        AND ends_at > NEW.starts_at
                )
            BEGIN
                SELECT RAISE(ABORT, 'booking overlaps active booking');
            END;
        SQL);

        DB::unprepared(<<<'SQL'
            CREATE TRIGGER reject_overlapping_booking_update
            BEFORE UPDATE OF service_bay, starts_at, ends_at, status ON bookings
            WHEN NEW.status <> 'cancelled'
                AND EXISTS (
                    SELECT 1
                    FROM bookings
                    WHERE id <> NEW.id
                        AND service_bay = NEW.service_bay
                        AND status <> 'cancelled'
                        AND starts_at < NEW.ends_at
                        AND ends_at > NEW.starts_at
                )
            BEGIN
                SELECT RAISE(ABORT, 'booking overlaps active booking');
            END;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            return;
        }

        DB::unprepared('DROP TRIGGER IF EXISTS reject_overlapping_booking_update');
        DB::unprepared('DROP TRIGGER IF EXISTS reject_overlapping_booking_insert');
    }
};
