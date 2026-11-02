# Caravea Workshop Bookings

A public assessment repository containing a focused workshop bookings module
for a caravan dealer. It contains a Laravel API and a Next.js App Router
interface.

The project is intentionally small and self-contained. The application code,
tests, and this README are the complete submission surface.

## Stack

- Laravel 13, PHP 8.3, SQLite, and Pest 4
- Next.js 16 App Router, React 19, TypeScript, Zod, Zustand, and Vitest

## Run locally

Prerequisites: PHP 8.3+, Composer, Node 22+, and npm.

```bash
cd apps/api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

In another terminal:

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/bookings`. The web app uses
`NEXT_PUBLIC_API_URL=http://localhost:8000` by default.
The assessment labels booking inputs and displays in UTC so the same instant is
shown consistently by the API, list, detail, and edit views. A production
dealer profile would supply its own configured IANA timezone.

## Verify

```bash
cd apps/api && php artisan test --compact
cd ../web && npm test && npm run lint && npm run build
```

## Manual smoke check

1. Create a booking at `/bookings/new`.
2. Create an overlapping active booking and verify the `service_bay` field error.
3. Filter `/bookings` by status and change pages when enough bookings exist.
4. Open an existing booking, a missing booking URL, and the edit form.
5. Edit or cancel a booking and verify the detail/list data refreshes without a full browser reload.

## Senior write-up

**Caching and revalidation.** Bookings are operational data, so the list and
detail Server Components fetch Laravel with `cache: 'no-store'`. This prevents
stale service-bay availability. After a successful Server Action, the app calls
`revalidatePath` for the list and affected detail route, then navigates with the
client router; the user sees updated server data without a full browser reload.

**Simultaneous bookings.** Laravel wraps writes in a transaction and locks a
row keyed by service bay before checking the half-open overlap predicate
(`existing.start < requested.end` and `existing.end > requested.start`). SQLite
does not provide row-level `FOR UPDATE` semantics, so it also has database
triggers that reject overlapping active inserts or updates atomically. The
trigger is a final safety net even if a writer bypasses the application action.

**At 200 dealers.** First I would add an authenticated dealer context and make
every query, policy, lock key, cache key, and queued job explicitly
company-scoped. `service_bay_locks` becomes unique on `(company_id,
service_bay)`. For a production MySQL or PostgreSQL deployment, I would retain
the transaction locks and add database-native constraints/guardrails suitable
for that engine, plus production-load concurrency tests.

## AI use

I used GPT models for implementation assistance and reviewed every change. One
incorrect suggestion was using the newest Pest release: it requires PHP 8.4,
while this project runs on PHP 8.3. I verified the compatibility requirements
and used Pest 4 instead.
