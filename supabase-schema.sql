create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  updated_at timestamptz default now()
);

create table if not exists public.gi_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  gi_slug text not null,
  learning_started boolean default false,
  game_opened boolean default false,
  game_completed boolean default false,
  quiz_score integer,
  quiz_total integer default 10,
  quiz_percent integer default 0,
  quiz_completed_at timestamptz,
  game_completed_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id, gi_slug)
);

create table if not exists public.certificates (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  certificate_code text not null,
  total_score integer not null,
  total_possible integer not null,
  average_percent integer not null,
  issued_at timestamptz not null,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.gi_progress enable row level security;
alter table public.certificates enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "gi_progress_select_own" on public.gi_progress;
create policy "gi_progress_select_own"
  on public.gi_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "gi_progress_upsert_own" on public.gi_progress;
create policy "gi_progress_upsert_own"
  on public.gi_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "certificates_select_own" on public.certificates;
create policy "certificates_select_own"
  on public.certificates
  for select
  using (auth.uid() = user_id);

drop policy if exists "certificates_upsert_own" on public.certificates;
create policy "certificates_upsert_own"
  on public.certificates
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
