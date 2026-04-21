-- Portal: GST alias columns + get_portal_invoice RETURNS TABLE (matches PortalRpcRow in app).
-- Run after existing ChaseDue invoice migrations.
--
-- Optional — inspect live schema before/after (Supabase SQL Editor):
--   select column_name from information_schema.columns
--   where table_schema = 'public' and table_name = 'invoices'
--   order by ordinal_position;

alter table public.clients add column if not exists email text;

alter table public.invoices add column if not exists invoice_number text;
alter table public.invoices add column if not exists taxable_value numeric;
alter table public.invoices add column if not exists cgst_amount numeric;
alter table public.invoices add column if not exists sgst_amount numeric;
alter table public.invoices add column if not exists total_amount numeric;

comment on column public.invoices.taxable_value is 'Pre-GST taxable base (alias / mirror of taxable_amount & amount_subtotal when backfilled).';
comment on column public.invoices.cgst_amount is 'CGST component (alias / mirror of cgst when backfilled).';
comment on column public.invoices.sgst_amount is 'SGST component (alias / mirror of sgst when backfilled).';

-- 1) Copy from legacy column names where the new fields are still null
update public.invoices i
set
  taxable_value = coalesce(i.taxable_value, i.taxable_amount, i.amount_subtotal),
  cgst_amount = coalesce(i.cgst_amount, i.cgst),
  sgst_amount = coalesce(i.sgst_amount, i.sgst),
  total_amount = coalesce(i.total_amount, i.amount)
where i.taxable_value is null
   or i.cgst_amount is null
   or i.sgst_amount is null
   or i.total_amount is null;

-- 2) Assumed 18% GST split for rows still missing a taxable breakdown (uses payable total)
update public.invoices i
set
  taxable_value = coalesce(i.total_amount, i.amount) / 1.18,
  cgst_amount = (coalesce(i.total_amount, i.amount) / 1.18) * 0.09,
  sgst_amount = (coalesce(i.total_amount, i.amount) / 1.18) * 0.09,
  total_amount = coalesce(i.total_amount, i.amount)
where i.taxable_value is null
  and coalesce(i.total_amount, i.amount) is not null;

drop function if exists public.get_portal_invoice(uuid);

create or replace function public.get_portal_invoice(p_invoice_id uuid)
returns table (
  id uuid,
  invoice_number text,
  client_name text,
  client_email text,
  amount numeric,
  status text,
  due_date date,
  taxable_value numeric,
  cgst_amount numeric,
  sgst_amount numeric,
  total_amount numeric,
  description text,
  created_at timestamptz
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
    i.amount,
    i.status::text,
    i.due_date::date,
    i.taxable_value,
    i.cgst_amount,
    i.sgst_amount,
    i.total_amount,
    i.description,
    i.created_at
  from public.invoices i
  left join public.clients c on c.id = i.client_id
  where i.id = p_invoice_id;
end;
$$;

comment on function public.get_portal_invoice(uuid) is
  'Returns one invoice row for the public portal (anon). SECURITY DEFINER; no gst_number.';

grant execute on function public.get_portal_invoice(uuid) to anon, authenticated;
