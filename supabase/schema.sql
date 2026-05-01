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
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(trim(title)) > 0),
  note text not null default '',
  focus_order integer not null check (focus_order between 1 and 3),
  energy text not null default 'Medium lift' check (energy in ('High focus', 'Medium lift', 'Quick win')),
  done boolean not null default false,
  task_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(trim(title)) > 0),
  owner_note text not null default '',
  deadline date,
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  status text not null default 'up-next' check (status in ('done', 'active', 'up-next')),
  sort_order integer not null default 1 check (sort_order >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null check (char_length(trim(name)) > 0),
  target_frequency integer not null default 7 check (target_frequency between 1 and 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.captures (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  body text not null check (char_length(trim(body)) > 0),
  source text not null default 'manual',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  week_of date not null,
  summary text not null default '',
  prompt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.goals add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.milestones add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.habits add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.habit_logs add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.captures add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.weekly_reviews add column if not exists owner_id uuid references auth.users(id) on delete cascade;

alter table public.tasks add column if not exists updated_at timestamptz not null default now();
alter table public.goals add column if not exists updated_at timestamptz not null default now();
alter table public.milestones add column if not exists updated_at timestamptz not null default now();
alter table public.habits add column if not exists updated_at timestamptz not null default now();
alter table public.habit_logs add column if not exists updated_at timestamptz not null default now();
alter table public.captures add column if not exists updated_at timestamptz not null default now();
alter table public.weekly_reviews add column if not exists updated_at timestamptz not null default now();

alter table public.tasks alter column owner_id set default auth.uid();
alter table public.goals alter column owner_id set default auth.uid();
alter table public.milestones alter column owner_id set default auth.uid();
alter table public.habits alter column owner_id set default auth.uid();
alter table public.habit_logs alter column owner_id set default auth.uid();
alter table public.captures alter column owner_id set default auth.uid();
alter table public.weekly_reviews alter column owner_id set default auth.uid();

alter table public.tasks drop constraint if exists tasks_task_date_focus_order_key;
alter table public.habits drop constraint if exists habits_name_key;
alter table public.weekly_reviews drop constraint if exists weekly_reviews_week_of_key;

create unique index if not exists tasks_owner_date_order_idx on public.tasks (owner_id, task_date, focus_order);
create unique index if not exists habits_owner_name_idx on public.habits (owner_id, name);
create unique index if not exists habit_logs_habit_date_idx on public.habit_logs (habit_id, completed_on);
create unique index if not exists weekly_reviews_owner_week_idx on public.weekly_reviews (owner_id, week_of);

create index if not exists tasks_owner_task_date_idx on public.tasks (owner_id, task_date);
create index if not exists goals_owner_deadline_idx on public.goals (owner_id, deadline);
create index if not exists milestones_owner_goal_idx on public.milestones (owner_id, goal_id, sort_order);
create index if not exists habits_owner_name_lookup_idx on public.habits (owner_id, name);
create index if not exists habit_logs_owner_habit_date_idx on public.habit_logs (owner_id, habit_id, completed_on desc);
create index if not exists captures_owner_created_at_idx on public.captures (owner_id, archived, created_at desc);
create index if not exists weekly_reviews_owner_date_idx on public.weekly_reviews (owner_id, week_of desc);

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at before update on public.goals for each row execute function public.set_updated_at();

drop trigger if exists set_milestones_updated_at on public.milestones;
create trigger set_milestones_updated_at before update on public.milestones for each row execute function public.set_updated_at();

drop trigger if exists set_habits_updated_at on public.habits;
create trigger set_habits_updated_at before update on public.habits for each row execute function public.set_updated_at();

drop trigger if exists set_habit_logs_updated_at on public.habit_logs;
create trigger set_habit_logs_updated_at before update on public.habit_logs for each row execute function public.set_updated_at();

drop trigger if exists set_captures_updated_at on public.captures;
create trigger set_captures_updated_at before update on public.captures for each row execute function public.set_updated_at();

drop trigger if exists set_weekly_reviews_updated_at on public.weekly_reviews;
create trigger set_weekly_reviews_updated_at before update on public.weekly_reviews for each row execute function public.set_updated_at();

alter table public.tasks enable row level security;
alter table public.goals enable row level security;
alter table public.milestones enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.captures enable row level security;
alter table public.weekly_reviews enable row level security;

drop policy if exists "users_manage_own_tasks" on public.tasks;
create policy "users_manage_own_tasks" on public.tasks for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "users_manage_own_goals" on public.goals;
create policy "users_manage_own_goals" on public.goals for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "users_manage_own_milestones" on public.milestones;
create policy "users_manage_own_milestones" on public.milestones for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "users_manage_own_habits" on public.habits;
create policy "users_manage_own_habits" on public.habits for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "users_manage_own_habit_logs" on public.habit_logs;
create policy "users_manage_own_habit_logs" on public.habit_logs for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "users_manage_own_captures" on public.captures;
create policy "users_manage_own_captures" on public.captures for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "users_manage_own_weekly_reviews" on public.weekly_reviews;
create policy "users_manage_own_weekly_reviews" on public.weekly_reviews for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
