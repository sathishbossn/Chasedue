-- Canonical invoice money columns used by the app (see src/lib/invoice-money.ts).
-- If you previously used `amount`, migrate: ALTER TABLE public.invoices RENAME COLUMN amount TO total_amount;
-- If you used `taxable_amount` for pre-GST base: RENAME TO amount_subtotal OR backfill amount_subtotal.

alter table public.invoices add column if not exists total_amount numeric;
alter table public.invoices add column if not exists amount_subtotal numeric;

comment on column public.invoices.total_amount is 'Payable total incl. GST (Razorpay, dashboards, analytics).';
comment on column public.invoices.amount_subtotal is 'Pre-GST taxable base.';
