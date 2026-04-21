-- Complete GST columns for app + PostgREST (idempotent; skips existing columns).
-- cgst/sgst/igst/gst_total may already exist from earlier migrations.

alter table public.invoices add column if not exists gst_total numeric(12, 2) default 0;
alter table public.invoices add column if not exists cgst numeric(12, 2) default 0;
alter table public.invoices add column if not exists sgst numeric(12, 2) default 0;
alter table public.invoices add column if not exists igst numeric(12, 2) default 0;
alter table public.invoices add column if not exists utgst numeric(12, 2) default 0;
alter table public.invoices add column if not exists gst_rate numeric(5, 2) default 18.00;

comment on column public.invoices.utgst is 'Union Territory GST component (0 when not applicable).';
comment on column public.invoices.gst_rate is 'Headline GST % applied to taxable base (e.g. 18).';

grant all on table public.invoices to authenticated;
grant all on table public.clients to authenticated;
