# Life OS

A Vercel-friendly personal command center built with Next.js, Tailwind CSS, and Supabase.

## Included

- Daily Focus dashboard with top 3 tasks and streak summary
- Goal tracker with milestones and progress bars
- Habit logger with contribution-style heatmap
- Quick Capture inbox
- Weekly Review page plus a cron-ready `/api/review` endpoint

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Supabase values.

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

## Vercel cron

`vercel.json` schedules `GET /api/review` every Friday at `09:00` UTC. Set `CRON_SECRET` in Vercel and send `Authorization: Bearer <CRON_SECRET>` if you want the endpoint locked down.

## Status

The current UI uses local mock data for immediate usability. The Supabase client helper and schema are in place so the next step is swapping reads and writes from `src/lib/mock-data.ts` to live queries.
