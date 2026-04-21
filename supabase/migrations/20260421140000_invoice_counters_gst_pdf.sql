-- Sequential invoice numbers (Indian FY Apr–Mar), seller profile fields for PDF, client GSTIN, extended portal RPC.

alter table public.profiles
  add column if not exists gstin text,
  add column if not exists state_code text,
  add column if not exists billing_address text,
  add column if not exists invoice_contact_email text;

comment on column public.profiles.gstin is 'Supplier GSTIN (15 chars) for invoices and PDF.';
comment on column public.profiles.state_code is '2-digit GST state code fallback when GSTIN missing.';
comment on column public.profiles.billing_address is 'Registered / billing address for invoice PDF header.';
comment on column public.profiles.invoice_contact_email is 'Email shown on invoice PDF (optional).';

alter table public.clients
  add column if not exists gstin text;

comment on column public.clients.gstin is 'Recipient GSTIN when known (B2B).';

-- Per-user, per–financial-year sequence (FY = Apr–Mar, India/Kolkata).
create table if not exists public.invoice_counters (
  user_id uuid not null references auth.users (id) on delete cascade,
  fy_key text not null,
  last_seq integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, fy_key)
);

create index if not exists invoice_counters_user_idx on public.invoice_counters (user_id);

-- No RLS: table is not exposed to PostgREST API; only SECURITY DEFINER RPC mutates it.
revoke all on public.invoice_counters from public;
grant all on public.invoice_counters to postgres;

drop function if exists public.get_next_invoice_number(uuid);

create or replace function public.get_next_invoice_number(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  d date := (timezone('Asia/Kolkata', now()))::date;
  start_y int;
  end_two text;
  fy_key text;
  seq int;
  inv text;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  if extract(month from d) >= 4 then
    start_y := extract(year from d)::int;
  else
    start_y := extract(year from d)::int - 1;
  end if;

  end_two := lpad(((start_y + 1) % 100)::text, 2, '0');
  fy_key := start_y::text || '-' || end_two;

  insert into public.invoice_counters as ic (user_id, fy_key, last_seq, updated_at)
  values (p_user_id, fy_key, 1, now())
  on conflict (user_id, fy_key)
  do update set
    last_seq = public.invoice_counters.last_seq + 1,
    updated_at = now()
  returning last_seq into seq;

  inv := 'INV-' || start_y::text || '-' || end_two || '-' || lpad(seq::text, 3, '0');
  return inv;
end;
$$;

comment on function public.get_next_invoice_number(uuid) is
  'Returns next invoice number INV-{FY}-{seq} for authenticated user; FY resets each April (IST).';

grant execute on function public.get_next_invoice_number(uuid) to authenticated;

drop function if exists public.get_portal_invoice(uuid);

create or replace function public.get_portal_invoice(p_invoice_id uuid)
returns table (
  id uuid,
  invoice_number text,
  client_name text,
  client_email text,
  client_gstin text,
  amount numeric,
  status text,
  due_date date,
  taxable_value numeric,
  cgst_amount numeric,
  sgst_amount numeric,
  total_amount numeric,
  description text,
  created_at timestamptz,
  line_items jsonb,
  seller_business_name text,
  seller_gstin text,
  seller_state_code text,
  seller_billing_address text,
  seller_email text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select
    i.id,
    i.invoice_number,
    c.name::text,
    c.email::text,
    nullif(trim(c.gstin::text), '') as client_gstin,
    i.amount,
    i.status::text,
    i.due_date::date,
    i.taxable_value,
    i.cgst_amount,
    i.sgst_amount,
    i.total_amount,
    i.description,
    i.created_at,
    coalesce(i.line_items, '[]'::jsonb) as line_items,
    nullif(
      trim(coalesce(p.business_name, p.full_name, '')::text),
      ''
    ) as seller_business_name,
    nullif(trim(p.gstin::text), '') as seller_gstin,
    nullif(trim(p.state_code::text), '') as seller_state_code,
    nullif(trim(p.billing_address::text), '') as seller_billing_address,
    nullif(trim(p.invoice_contact_email::text), '') as seller_email
  from public.invoices i
  left join public.clients c on c.id = i.client_id
  left join public.profiles p on p.id = i.user_id
  where i.id = p_invoice_id;
end;
$$;

comment on function public.get_portal_invoice(uuid) is
  'Portal invoice + client + seller profile fields for PDF (SECURITY DEFINER).';

grant execute on function public.get_portal_invoice(uuid) to anon, authenticated;
