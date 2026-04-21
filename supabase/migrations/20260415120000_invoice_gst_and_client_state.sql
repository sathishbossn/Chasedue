-- ChaseDue V1: client place of supply + GST line items on invoices
-- Run in Supabase SQL editor or via CLI if you use migrations.

alter table public.clients add column if not exists state text;

alter table public.invoices add column if not exists taxable_amount numeric;
alter table public.invoices add column if not exists cgst numeric default 0;
alter table public.invoices add column if not exists sgst numeric default 0;
alter table public.invoices add column if not exists igst numeric default 0;
alter table public.invoices add column if not exists gst_total numeric;

comment on column public.clients.state is 'Indian state name for GST place of supply (e.g. Tamil Nadu).';
comment on column public.invoices.taxable_amount is 'Subtotal before GST; amount column stores grand total incl. tax.';
