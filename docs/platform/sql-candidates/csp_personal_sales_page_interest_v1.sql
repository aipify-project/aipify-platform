-- DO NOT APPLY.
-- Public interest registration for /s/{code}.
-- The application gate stays OFF until an owner YES applies this file.
-- A lead is not a qualified sale and does not write commission.

create table if not exists public.csp_personal_page_interests (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  link_id uuid not null references public.csp_attribution_links (id) on delete restrict,
  product_key text not null check (length(btrim(product_key)) > 0),
  source text not null default 'personal_sales_page'
    check (source = 'personal_sales_page'),
  email text not null check (position('@' in email) > 1),
  display_name text,
  locale text not null check (length(btrim(locale)) between 2 and 8),
  idempotency_key text not null check (length(btrim(idempotency_key)) between 8 and 80),
  created_at timestamptz not null default now()
);

create unique index if not exists csp_personal_page_interests_dedupe
  on public.csp_personal_page_interests (partner_id, product_key, lower(email), idempotency_key);

comment on table public.csp_personal_page_interests is
  'Interest from a personal sales page. Not a customer, sale, or commission.';

revoke all on table public.csp_personal_page_interests from public, anon, authenticated;

create or replace function public.csp_register_personal_page_interest(
  p_code text,
  p_email text,
  p_display_name text,
  p_product_key text,
  p_locale text,
  p_idempotency_key text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link public.csp_attribution_links%rowtype;
  v_status text;
  v_email text;
  v_id uuid;
begin
  -- Seller identity comes only from the approved link code.
  select * into v_link
    from public.csp_attribution_links
   where code = lower(btrim(coalesce(p_code, '')))
     and active = true;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'closed');
  end if;

  select status into v_status
    from public.csp_partner_profiles
   where id = v_link.partner_id;
  if v_status is distinct from 'active' and v_status is distinct from 'certified' then
    return jsonb_build_object('ok', false, 'error', 'closed');
  end if;

  v_email := lower(btrim(coalesce(p_email, '')));
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_email');
  end if;
  if length(btrim(coalesce(p_product_key, ''))) = 0
     or length(btrim(coalesce(p_idempotency_key, ''))) < 8 then
    return jsonb_build_object('ok', false, 'error', 'invalid');
  end if;

  insert into public.csp_personal_page_interests (
    partner_id, link_id, product_key, email, display_name, locale, idempotency_key
  ) values (
    v_link.partner_id,
    v_link.id,
    btrim(p_product_key),
    v_email,
    nullif(left(btrim(coalesce(p_display_name, '')), 120), ''),
    left(btrim(coalesce(p_locale, 'en')), 8),
    btrim(p_idempotency_key)
  )
  on conflict (partner_id, product_key, lower(email), idempotency_key) do nothing
  returning id into v_id;

  insert into public.csp_audit_events (actor_kind, action, subject_table, subject_id, detail)
  values (
    'system',
    'personal_page_interest',
    'csp_personal_page_interests',
    coalesce(v_id, v_link.id),
    jsonb_build_object('stored', v_id is not null, 'source', 'personal_sales_page')
  );

  return jsonb_build_object('ok', true, 'stored', v_id is not null);
end;
$$;

revoke all on function public.csp_register_personal_page_interest(text, text, text, text, text, text)
  from public, anon, authenticated;

-- No grant. A later approved server route may call this as service role
-- after rate limiting. Do not expose it to anonymous clients.
-- Do not insert into csp_qualified_sales or commission tables.
