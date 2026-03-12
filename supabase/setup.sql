-- CarrotCash Database Setup
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Clients table for freelancer client management
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid references public.profiles (id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  company text,
  rate_per_hour numeric(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.clients enable row level security;

-- 4. Profiles RLS Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 5. Clients RLS Policies
create policy "Freelancers can view own clients"
  on public.clients for select
  using (auth.uid() = freelancer_id);

create policy "Freelancers can insert own clients"
  on public.clients for insert
  with check (auth.uid() = freelancer_id);

create policy "Freelancers can update own clients"
  on public.clients for update
  using (auth.uid() = freelancer_id);

create policy "Freelancers can delete own clients"
  on public.clients for delete
  using (auth.uid() = freelancer_id);

-- 6. Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

-- 7. Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. Function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 9. Triggers for updated_at
drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists on_clients_updated on public.clients;
create trigger on_clients_updated
  before update on public.clients
  for each row execute function public.handle_updated_at();
