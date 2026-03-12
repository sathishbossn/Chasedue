-- Run this in Supabase Dashboard > SQL Editor (paste to clipboard and execute)

-- Clients table for freelancer client management
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

-- RLS: freelancers can only manage their own clients
alter table public.clients enable row level security;

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

-- Function to automatically update updated_at timestamp
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

-- Trigger to auto-update updated_at
drop trigger if exists on_clients_updated on public.clients;
create trigger on_clients_updated
  before update on public.clients
  for each row execute function public.handle_updated_at();
