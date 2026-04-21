-- PostgREST returns set-returning functions as a JSON array of rows; app reads data[0].invoice_number.
drop function if exists public.get_next_invoice_number(uuid);

create or replace function public.get_next_invoice_number(p_user_id uuid)
returns table (invoice_number text)
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
  return query select inv as invoice_number;
end;
$$;

comment on function public.get_next_invoice_number(uuid) is
  'Returns next invoice number INV-{FY}-{seq} for authenticated user; FY resets each April (IST).';

grant execute on function public.get_next_invoice_number(uuid) to authenticated;
