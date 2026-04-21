-- Optional external payment URL (UPI, hosted Razorpay link, etc.) for dashboard Pay / Generate Link.

alter table public.invoices add column if not exists payment_link_url text;

comment on column public.invoices.payment_link_url is 'When set, dashboard Pay opens this URL in a new tab.';
