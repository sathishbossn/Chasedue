-- Backfill legacy lowercase invoice statuses so CHECK constraints expecting UPPERCASE stay satisfied.
-- Safe to run if rows are already uppercase (no-op when status = upper(trim(status))).

update public.invoices
set status = upper(trim(status::text))
where status is not null
  and upper(trim(status::text)) <> status::text;
