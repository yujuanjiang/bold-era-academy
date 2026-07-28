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

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.course_enrollments enable row level security;

grant select, insert, update, delete
  on table public.course_enrollments
  to authenticated;

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

create policy "Users can read their own course enrollments"
  on public.course_enrollments
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own course enrollments"
  on public.course_enrollments
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own course enrollments"
  on public.course_enrollments
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own course enrollments"
  on public.course_enrollments
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
