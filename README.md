# Steward

A resource & room booking app. See what's free, reserve a time slot, and
manage your bookings — no back-and-forth.

## Stack

| Layer          | Choice                              |
| -------------- | ------------------------------------ |
| Frontend       | Next.js 16 (App Router) + TypeScript |
| UI             | Tailwind CSS v4 + shadcn/ui          |
| Backend        | Next.js Server Actions               |
| Database       | PostgreSQL                           |
| ORM            | Prisma 6                             |
| Authentication | Clerk                                |
| Validation     | Zod                                  |

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

   (This repo pins `legacy-peer-deps=true` in `.npmrc` for compatibility.)

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in:
   - `DATABASE_URL` — a Postgres connection string. Easiest options:
     - [Neon](https://neon.tech) or [Supabase](https://supabase.com) (managed, free tier)
     - Local Postgres, or `docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — from the
     [Clerk dashboard](https://dashboard.clerk.com) (create a free application).

3. **Push the schema and seed sample data**

   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000.

## Project structure

- `prisma/schema.prisma` — `Resource` and `Booking` models. Bookings store
  the Clerk user id/email directly (no local `User` table — Clerk is the
  source of truth for identity).
- `src/proxy.ts` — Clerk's auth context (Next.js 16 renamed `middleware.ts`
  to `proxy.ts`). Route protection itself lives in each page/action via
  `auth()` + `redirect()`, per Clerk's current guidance, rather than path
  matching here.
- `src/lib/actions/` — Server Actions for creating resources and bookings
  (with double-booking prevention via an overlap check).
- `src/app/resources` — browse resources, view one with its upcoming
  bookings and a booking form, or add a new resource.
- `src/app/dashboard` — a signed-in user's own bookings, with cancel.

## Useful scripts

```bash
npm run db:generate   # regenerate the Prisma client
npm run db:migrate    # create & apply a migration (use instead of db:push once you have real data)
npm run db:studio     # browse the database
```

## Deploying

- **App**: push to GitHub and import into [Vercel](https://vercel.com).
  Set the same environment variables from `.env` in the Vercel project
  settings.
- **Database**: use a managed Postgres host (Neon or Supabase) so the app
  and database aren't both tied to your local machine.
