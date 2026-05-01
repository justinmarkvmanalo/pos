# Life OS

A personal command center built with Next.js, Tailwind CSS, and Supabase.

## Included

- Email sign up and log in
- Per-user tasks, goals, milestones, habits, captures, and weekly reviews
- Add buttons and forms for the core entities directly in the UI
- Habit heatmap and weekly completion tracking

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Supabase values.
   You need `SUPABASE_SERVICE_ROLE_KEY` because the app verifies the logged-in user on the server and writes user-owned rows through Server Actions.

3. Run the app:

```bash
npm run dev
```

## Supabase

Run [supabase/schema.sql](/C:/Users/Justin%20Mark/OneDrive/Desktop/pos/supabase/schema.sql) in the Supabase SQL editor to create the base tables:

- `tasks`
- `goals`
- `milestones`
- `habits`
- `habit_logs`
- `captures`
- `weekly_reviews`

Every table is now user-scoped with an `owner_id` linked to `auth.users`, and the schema enables RLS policies so authenticated users can only access their own rows.

If you already created the old schema, apply the updated SQL before using the new app. Existing rows from the old schema may need their `owner_id` backfilled manually if you want them to appear under a user account.

## Status

The UI reads from your live Supabase tables, redirects unauthenticated users to `/login`, and provides in-app forms for creating the main records instead of requiring direct inserts in Supabase.
