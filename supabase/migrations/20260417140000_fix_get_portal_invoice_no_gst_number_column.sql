-- Fix 42703: "column i.gst_number does not exist" when the RPC referenced gst_number without the column.
-- Redeploy canonical portal RPC (matches app — no gst_number on invoices).

alter table public.invoices add column if not exists lemon_squeezy_variant_id text;

create or replace function public.get_portal_invoice(p_invoice_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', i.id,
    'total_amount', i.total_amount,
    'status', i.status,
    'due_date', i.due_date,
    'description', i.description,
    'client_id', i.client_id,
    'paid_at', i.paid_at,
    'amount_subtotal', i.amount_subtotal,
    'cgst', i.cgst,
    'sgst', i.sgst,
    'igst', i.igst,
    'utgst', i.utgst,
    'gst_total', i.gst_total,
    'gst_rate', i.gst_rate,
    'lemon_squeezy_variant_id', i.lemon_squeezy_variant_id,
    'client_name', c.name,
    'client_company', c.company
  )
  from public.invoices i
  left join public.clients c on c.id = i.client_id
  where i.id = p_invoice_id;
$$;

comment on function public.get_portal_invoice(uuid) is
  'Returns one invoice + client display fields for the public portal. Callable by anon; bypasses RLS via SECURITY DEFINER.';

grant execute on function public.get_portal_invoice(uuid) to anon, authenticated;
