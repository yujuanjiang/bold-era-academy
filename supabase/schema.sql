create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, course_id, lesson_id)
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can read their own lesson progress"
  on public.lesson_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own lesson progress"
  on public.lesson_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own lesson progress"
  on public.lesson_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own lesson progress"
  on public.lesson_progress
  for delete
  using (auth.uid() = user_id);
