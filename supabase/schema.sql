create extension if not exists pgcrypto;

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text not null default '',
  focus_order int not null default 1,
  energy text not null default 'Medium lift',
  done boolean not null default false,
  task_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_note text not null default '',
  deadline date,
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  created_at timestamptz not null default now()
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete cascade,
  name text not null,
  status text not null default 'up-next',
  sort_order int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  target_frequency int not null default 7,
  created_at timestamptz not null default now()
);

create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  completed_on date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create table if not exists captures (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  source text not null default 'manual',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  week_of date not null unique,
  summary text not null,
  prompt text not null,
  created_at timestamptz not null default now()
);
