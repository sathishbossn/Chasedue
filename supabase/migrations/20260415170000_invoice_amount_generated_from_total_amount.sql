-- Mirror `total_amount` as `amount` for legacy queries / PostgREST clients that still SELECT `amount`.
-- Requires `total_amount` to exist. Skips if `amount` already exists (including legacy non-generated columns).

alter table public.invoices
  add column if not exists amount numeric(12, 2) generated always as (total_amount) stored;

comment on column public.invoices.amount is 'Generated: payable total (mirrors total_amount, incl. GST).';
