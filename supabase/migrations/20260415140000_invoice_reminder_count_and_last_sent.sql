-- WhatsApp reminder sequence: counter + last manual chase timestamp
-- Run in Supabase SQL Editor if migrations are not applied automatically.

alter table public.invoices add column if not exists reminder_count integer default 0;
update public.invoices set reminder_count = coalesce(reminder_count, 0);

alter table public.invoices add column if not exists last_reminder_sent timestamptz;

-- Used by dashboard queries, Razorpay/PayPal verify, and Chase Payment (mirrors last manual nudge).
alter table public.invoices add column if not exists last_chased_at timestamptz;

comment on column public.invoices.reminder_count is 'Increments when user sends a Chase Payment WhatsApp link.';
comment on column public.invoices.last_reminder_sent is 'Last time a manual WhatsApp reminder was triggered from the dashboard.';
comment on column public.invoices.last_chased_at is 'Last chase touchpoint (payment verified, or manual WhatsApp reminder).';
