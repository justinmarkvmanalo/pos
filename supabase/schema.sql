create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  note text not null default '',
  focus_order integer not null check (focus_order between 1 and 3),
  energy text not null default 'Medium lift' check (energy in ('High focus', 'Medium lift', 'Quick win')),
  done boolean not null default false,
  task_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (task_date, focus_order)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  owner_note text not null default '',
  deadline date,
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  status text not null default 'up-next' check (status in ('done', 'active', 'up-next')),
  sort_order integer not null default 1 check (sort_order >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  target_frequency integer not null default 7 check (target_frequency between 1 and 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create table if not exists public.captures (
  id uuid primary key default gen_random_uuid(),
  body text not null check (char_length(trim(body)) > 0),
  source text not null default 'manual',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  week_of date not null unique,
  summary text not null default '',
  prompt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks
  add column if not exists updated_at timestamptz not null default now();

alter table public.goals
  add column if not exists updated_at timestamptz not null default now();

alter table public.milestones
  add column if not exists updated_at timestamptz not null default now();

alter table public.habits
  add column if not exists updated_at timestamptz not null default now();

alter table public.habit_logs
  add column if not exists updated_at timestamptz not null default now();

alter table public.captures
  add column if not exists updated_at timestamptz not null default now();

alter table public.weekly_reviews
  add column if not exists updated_at timestamptz not null default now();

create index if not exists tasks_task_date_idx on public.tasks (task_date);
create index if not exists goals_deadline_idx on public.goals (deadline);
create index if not exists milestones_goal_id_idx on public.milestones (goal_id, sort_order);
create index if not exists habit_logs_habit_id_idx on public.habit_logs (habit_id, completed_on desc);
create index if not exists captures_archived_created_at_idx on public.captures (archived, created_at desc);
create index if not exists weekly_reviews_week_of_idx on public.weekly_reviews (week_of desc);

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
before update on public.goals
for each row
execute function public.set_updated_at();

drop trigger if exists set_milestones_updated_at on public.milestones;
create trigger set_milestones_updated_at
before update on public.milestones
for each row
execute function public.set_updated_at();

drop trigger if exists set_habits_updated_at on public.habits;
create trigger set_habits_updated_at
before update on public.habits
for each row
execute function public.set_updated_at();

drop trigger if exists set_habit_logs_updated_at on public.habit_logs;
create trigger set_habit_logs_updated_at
before update on public.habit_logs
for each row
execute function public.set_updated_at();

drop trigger if exists set_captures_updated_at on public.captures;
create trigger set_captures_updated_at
before update on public.captures
for each row
execute function public.set_updated_at();

drop trigger if exists set_weekly_reviews_updated_at on public.weekly_reviews;
create trigger set_weekly_reviews_updated_at
before update on public.weekly_reviews
for each row
execute function public.set_updated_at();

alter table public.tasks enable row level security;
alter table public.goals enable row level security;
alter table public.milestones enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.captures enable row level security;
alter table public.weekly_reviews enable row level security;
