-- Profiles: ensure plan + subscription_status, RLS, and self-read policy.
-- Safe to re-run if columns/policies already exist (uses IF NOT EXISTS / DROP IF EXISTS).

alter table public.profiles
  add column if not exists plan text not null default 'starter';

alter table public.profiles
  add column if not exists subscription_status text not null default 'active';

alter table public.profiles
  alter column subscription_status set default 'active';

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;

create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
