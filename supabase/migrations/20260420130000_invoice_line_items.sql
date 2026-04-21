-- Line items (JSON) for invoice PDF + portal; extends get_portal_invoice.

alter table public.invoices add column if not exists line_items jsonb default '[]'::jsonb;

comment on column public.invoices.line_items is
  'JSON array of { "description", "amount" } rows (taxable INR per line; sum should match amount_subtotal).';

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
  created_at timestamptz,
  line_items jsonb
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
    i.created_at,
    coalesce(i.line_items, '[]'::jsonb)
  from public.invoices i
  left join public.clients c on c.id = i.client_id
  where i.id = p_invoice_id;
end;
$$;

comment on function public.get_portal_invoice(uuid) is
  'Returns one invoice row for the public portal (anon). SECURITY DEFINER; includes line_items for PDF.';

grant execute on function public.get_portal_invoice(uuid) to anon, authenticated;
