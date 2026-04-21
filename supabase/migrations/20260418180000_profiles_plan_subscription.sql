-- Plan tiers + subscription state for usage limits (dashboard) and billing integration.
-- Existing rows default to starter / inactive (free tier).

alter table public.profiles
  add column if not exists plan text not null default 'starter'
    constraint profiles_plan_check check (plan in ('starter', 'pro', 'agency'));

alter table public.profiles
  add column if not exists subscription_status text not null default 'inactive'
    constraint profiles_subscription_status_check check (
      subscription_status in ('active', 'inactive', 'past_due', 'canceled')
    );

comment on column public.profiles.plan is 'Billing tier: starter (free), pro, agency.';
comment on column public.profiles.subscription_status is
  'Paid-plan payment state. Pro/Agency need active for unlimited invoice creation; viewing existing data is never gated.';
