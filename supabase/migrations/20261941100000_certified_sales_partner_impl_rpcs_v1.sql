-- =============================================================================
-- Certified Aipify Sales Partner (CSP) — Implementation RPCs V1
--
-- STATUS: REVIEW CANDIDATE ONLY — do NOT apply without owner Gate S/P approval.
--         NOT applied to Staging. NOT applied to Production.
--
-- PREREQUISITE: foundation migration 20261941000000_certified_sales_partner_core_v1.sql
--               must already be applied (this file is additive and never edits it).
--
-- Scope (delta only):
--  1. Widen partner status CHECK (applied workflow + app workflow, all values).
--  2. Widen attribution channel_origin CHECK (social channels + legacy values).
--  3. Replace the five fail-closed stub RPCs with real implementations.
--  4. Add the missing mutating / reading RPCs (register, status, product,
--     link, academy, bank profile, paid-period event, settlement transition).
--  5. Idempotent, Platform-overridable placeholder seed (NOT live billing prices).
--
-- Security posture (unchanged from foundation):
--  * Tables: RLS stays enabled + forced; all privileges stay revoked from
--    public/anon/authenticated. No policies are added — access is RPC-only.
--  * Every RPC: SECURITY DEFINER, set search_path = public.
--  * EXECUTE: revoked from public/anon/authenticated/service_role, then granted
--    to authenticated only; csp_apply_paid_period_event is additionally granted
--    to service_role (payment webhook). Internal helpers are not callable by
--    any API role.
--  * Fail closed: auth/permission failures return
--    jsonb {found:false, error:'<code>'} — never raise, never partial-write.
--  * Every mutating RPC writes csp_audit_events (metadata only; no secrets,
--    no bank data, no quiz answers).
--  * Commission amounts always come from the database (rate version snapshot);
--    no RPC accepts an amount from a partner or a webhook payload.
--  * No percentage / renewal commission: one fixed amount, earned once, after
--    the second paid subscription period.
--
-- Assumption to verify in review: the migration/definer role bypasses RLS
-- (Supabase `postgres` has BYPASSRLS). Foundation tables use FORCE RLS with no
-- policies, so definer writes depend on that attribute.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Schema alignment — status + channel CHECK constraints
-- ---------------------------------------------------------------------------
do $$
declare
  c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.csp_partner_profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.csp_partner_profiles drop constraint %I', c.conname);
  end loop;

  alter table public.csp_partner_profiles
    add constraint csp_partner_profiles_status_check
    check (status in (
      'registered','under_review','needs_information','approved','rejected',
      'suspended','terminated',
      'applied','in_academy','certified','active'
    ));

  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.csp_attribution_links'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%channel_origin%'
  loop
    execute format('alter table public.csp_attribution_links drop constraint %I', c.conname);
  end loop;

  alter table public.csp_attribution_links
    add constraint csp_attribution_links_channel_origin_check
    check (channel_origin in (
      'facebook','instagram','x','snapchat','tiktok','linkedin','email','qr','other',
      'referral_link','partner_code','manual_platform_assignment',
      -- foundation values retained for compatibility
      'partner_registered_customer','event'
    ));
end;
$$;

-- Supports paid-period event idempotency lookups (additive index only).
create index if not exists csp_audit_events_paid_event_idx
  on public.csp_audit_events ((detail ->> 'event_id'))
  where action = 'paid_period_event_applied';

-- ---------------------------------------------------------------------------
-- 2) Internal helpers (no API role may execute these)
-- ---------------------------------------------------------------------------
create or replace function public._csp_is_service_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'),
    ''
  ) = 'service_role';
$$;

create or replace function public._csp_audit(
  p_actor uuid,
  p_kind text,
  p_action text,
  p_table text,
  p_subject uuid,
  p_detail jsonb
)
returns void
language sql
volatile
security definer
set search_path = public
as $$
  insert into public.csp_audit_events (actor_auth_user_id, actor_kind, action, subject_table, subject_id, detail)
  values (p_actor, p_kind, p_action, p_table, p_subject, coalesce(p_detail, '{}'::jsonb));
$$;

-- ---------------------------------------------------------------------------
-- 3) Replace stub RPCs
-- ---------------------------------------------------------------------------
create or replace function public.csp_get_backend_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if to_regclass('public.csp_partner_profiles') is null
     or to_regclass('public.csp_qualified_sales') is null
     or to_regclass('public.csp_audit_events') is null then
    return jsonb_build_object('found', false, 'error', 'csp_schema_missing');
  end if;
  return jsonb_build_object('found', true, 'ready', true, 'version', 'csp_impl_v1');
end;
$$;

create or replace function public.csp_get_partner_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_p public.csp_partner_profiles%rowtype;
  v_bank public.csp_partner_bank_profiles%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  select * into v_p from public.csp_partner_profiles where auth_user_id = v_uid;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;

  select * into v_bank
  from public.csp_partner_bank_profiles
  where partner_id = v_p.id and superseded_at is null;

  return jsonb_build_object(
    'found', true,
    'partner', jsonb_build_object(
      'id', v_p.id,
      'display_name', v_p.display_name,
      'country', v_p.country,
      'status', v_p.status,
      'created_at', v_p.created_at
    ),
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'product_key', p.product_key,
        'fixed_commission_amount', p.fixed_commission_amount,
        'currency', p.currency,
        'certification_status', coalesce(c.status, 'not_started')
      ) order by p.product_key)
      from public.csp_sales_products p
      left join public.csp_product_certifications c
        on c.product_id = p.id and c.partner_id = v_p.id
      where p.published
    ), '[]'::jsonb),
    'certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'product_id', c.product_id,
        'product_key', p.product_key,
        'status', c.status,
        'score', c.score,
        'passed_at', c.passed_at
      ) order by p.product_key)
      from public.csp_product_certifications c
      join public.csp_sales_products p on p.id = c.product_id
      where c.partner_id = v_p.id
    ), '[]'::jsonb),
    'links', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'code', l.code,
        'channel_origin', l.channel_origin,
        'active', l.active,
        'created_at', l.created_at
      ) order by l.created_at desc)
      from public.csp_attribution_links l
      where l.partner_id = v_p.id
    ), '[]'::jsonb),
    'sales_summary', jsonb_build_object(
      'by_status', coalesce((
        select jsonb_object_agg(s.status, s.n)
        from (
          select status, count(*) as n
          from public.csp_qualified_sales
          where partner_id = v_p.id
          group by status
        ) s
      ), '{}'::jsonb),
      'ledger_balance_by_currency', coalesce((
        select jsonb_object_agg(l.currency, l.total)
        from (
          select currency, sum(amount) as total
          from public.csp_commission_ledger
          where partner_id = v_p.id
          group by currency
        ) l
      ), '{}'::jsonb)
    ),
    -- Never plaintext bank data; status/fingerprint hint only.
    'bank_profile', jsonb_build_object(
      'has_profile', v_bank.id is not null,
      'status', v_bank.status
    )
  );
end;
$$;

create or replace function public.csp_get_platform_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object(
    'found', true,
    'partners_by_status', coalesce((
      select jsonb_object_agg(s.status, s.n)
      from (select status, count(*) as n from public.csp_partner_profiles group by status) s
    ), '{}'::jsonb),
    'partners_total', (select count(*) from public.csp_partner_profiles),
    'products_total', (select count(*) from public.csp_sales_products),
    'products_published', (select count(*) from public.csp_sales_products where published),
    'open_settlements', jsonb_build_object(
      'count', (select count(*) from public.csp_monthly_settlements where status = 'open'),
      'by_currency', coalesce((
        select jsonb_object_agg(s.currency, s.total)
        from (
          select currency, sum(total_amount) as total
          from public.csp_monthly_settlements
          where status = 'open'
          group by currency
        ) s
      ), '{}'::jsonb)
    ),
    'unpaid_settlements_count', (
      select count(*) from public.csp_monthly_settlements where status in ('open','approved','closed')
    )
  );
end;
$$;

create or replace function public.csp_list_qualified_sales()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_admin boolean;
  v_partner uuid;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  v_admin := coalesce(public.is_platform_admin(), false);

  if v_admin then
    return jsonb_build_object('found', true, 'scope', 'platform', 'sales', coalesce((
      select jsonb_agg(x.j order by x.created_at desc)
      from (
        select q.created_at, jsonb_build_object(
          'id', q.id,
          'partner_id', q.partner_id,
          'customer_org_id', q.customer_org_id,
          'product_key', p.product_key,
          'status', q.status,
          'paid_periods_count', q.paid_periods_count,
          'snapshot_amount', q.snapshot_amount,
          'snapshot_currency', q.snapshot_currency,
          'attributed_at', q.attributed_at,
          'first_confirmed_at', q.first_confirmed_at,
          'created_at', q.created_at
        ) as j
        from public.csp_qualified_sales q
        join public.csp_sales_products p on p.id = q.product_id
        order by q.created_at desc
        limit 500
      ) x
    ), '[]'::jsonb));
  end if;

  select id into v_partner from public.csp_partner_profiles where auth_user_id = v_uid;
  if v_partner is null then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;

  -- Partner view: customer organization identity is intentionally omitted.
  return jsonb_build_object('found', true, 'scope', 'partner', 'sales', coalesce((
    select jsonb_agg(x.j order by x.created_at desc)
    from (
      select q.created_at, jsonb_build_object(
        'id', q.id,
        'product_key', p.product_key,
        'status', q.status,
        'paid_periods_count', q.paid_periods_count,
        'snapshot_amount', q.snapshot_amount,
        'snapshot_currency', q.snapshot_currency,
        'attributed_at', q.attributed_at,
        'first_confirmed_at', q.first_confirmed_at,
        'created_at', q.created_at
      ) as j
      from public.csp_qualified_sales q
      join public.csp_sales_products p on p.id = q.product_id
      where q.partner_id = v_partner
      order by q.created_at desc
      limit 500
    ) x
  ), '[]'::jsonb));
end;
$$;

create or replace function public.csp_list_monthly_settlements()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner uuid;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  if coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', true, 'scope', 'platform', 'settlements', coalesce((
      select jsonb_agg(x.j order by x.created_at desc)
      from (
        select s.created_at, jsonb_build_object(
          'id', s.id,
          'partner_id', s.partner_id,
          'period_month', s.period_month,
          'status', s.status,
          'total_amount', s.total_amount,
          'currency', s.currency,
          'closed_at', s.closed_at,
          'line_count', (select count(*) from public.csp_settlement_lines l where l.settlement_id = s.id),
          'created_at', s.created_at
        ) as j
        from public.csp_monthly_settlements s
        order by s.created_at desc
        limit 500
      ) x
    ), '[]'::jsonb));
  end if;

  select id into v_partner from public.csp_partner_profiles where auth_user_id = v_uid;
  if v_partner is null then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;

  return jsonb_build_object('found', true, 'scope', 'partner', 'settlements', coalesce((
    select jsonb_agg(x.j order by x.created_at desc)
    from (
      select s.created_at, jsonb_build_object(
        'id', s.id,
        'period_month', s.period_month,
        'status', s.status,
        'total_amount', s.total_amount,
        'currency', s.currency,
        'closed_at', s.closed_at,
        'line_count', (select count(*) from public.csp_settlement_lines l where l.settlement_id = s.id),
        'created_at', s.created_at
      ) as j
      from public.csp_monthly_settlements s
      where s.partner_id = v_partner
      order by s.created_at desc
      limit 500
    ) x
  ), '[]'::jsonb));
end;
$$;

-- ---------------------------------------------------------------------------
-- 4) New RPCs
-- ---------------------------------------------------------------------------

-- Partner application — never auto-approved; always lands in under_review.
create or replace function public.csp_register_partner_application(p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_country text;
  v_existing public.csp_partner_profiles%rowtype;
  v_id uuid;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;

  v_name := btrim(coalesce(p_payload ->> 'fullName', p_payload ->> 'full_name', p_payload ->> 'display_name', ''));
  if length(v_name) < 2 or length(v_name) > 200 then
    return jsonb_build_object('found', false, 'error', 'invalid_full_name');
  end if;

  v_country := upper(btrim(coalesce(p_payload ->> 'country', '')));
  if v_country !~ '^[A-Z]{2}$' then
    return jsonb_build_object('found', false, 'error', 'invalid_country');
  end if;

  if coalesce(p_payload ->> 'termsAccepted', p_payload ->> 'terms_accepted', '') <> 'true'
     or coalesce(p_payload ->> 'certificationUnderstood', p_payload ->> 'certification_understood', '') <> 'true'
     or coalesce(p_payload ->> 'infoAccurateConfirmed', p_payload ->> 'info_accurate_confirmed', '') <> 'true' then
    return jsonb_build_object('found', false, 'error', 'confirmations_required');
  end if;

  select * into v_existing from public.csp_partner_profiles where auth_user_id = v_uid;
  if found then
    -- Re-submission never changes status.
    return jsonb_build_object(
      'found', true, 'created', false,
      'partner_id', v_existing.id, 'status', v_existing.status
    );
  end if;

  insert into public.csp_partner_profiles (auth_user_id, display_name, country, status)
  values (v_uid, v_name, v_country, 'under_review')
  on conflict (auth_user_id) do nothing
  returning id into v_id;

  if v_id is null then
    select * into v_existing from public.csp_partner_profiles where auth_user_id = v_uid;
    return jsonb_build_object(
      'found', true, 'created', false,
      'partner_id', v_existing.id, 'status', v_existing.status
    );
  end if;

  -- Audit metadata only: no email, phone, address or registration number.
  perform public._csp_audit(v_uid, 'partner', 'partner_application_registered',
    'csp_partner_profiles', v_id,
    jsonb_build_object('country', v_country, 'status', 'under_review'));

  return jsonb_build_object('found', true, 'created', true, 'partner_id', v_id, 'status', 'under_review');
end;
$$;

create or replace function public.csp_set_partner_status(p_partner_id uuid, p_status text, p_reason text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_reason text := btrim(coalesce(p_reason, ''));
  v_p public.csp_partner_profiles%rowtype;
  v_links integer := 0;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if p_partner_id is null then
    return jsonb_build_object('found', false, 'error', 'partner_id_required');
  end if;
  if p_status is null or p_status not in (
    'registered','under_review','needs_information','approved','rejected',
    'suspended','terminated','applied','in_academy','certified','active'
  ) then
    return jsonb_build_object('found', false, 'error', 'invalid_status');
  end if;
  if length(v_reason) < 3 or length(v_reason) > 500 then
    return jsonb_build_object('found', false, 'error', 'reason_required');
  end if;

  select * into v_p from public.csp_partner_profiles where id = p_partner_id for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;
  if v_p.status = 'terminated' then
    return jsonb_build_object('found', false, 'error', 'partner_terminated');
  end if;
  if v_p.status = p_status then
    return jsonb_build_object('found', true, 'changed', false, 'partner_id', v_p.id, 'status', v_p.status);
  end if;

  update public.csp_partner_profiles
  set status = p_status, updated_at = now()
  where id = v_p.id;

  -- Partners who are no longer in good standing stop attracting attribution.
  if p_status in ('suspended','terminated','rejected') then
    update public.csp_attribution_links set active = false where partner_id = v_p.id and active;
    get diagnostics v_links = row_count;
  end if;

  perform public._csp_audit(v_uid, 'platform_admin', 'partner_status_changed',
    'csp_partner_profiles', v_p.id,
    jsonb_build_object('from', v_p.status, 'to', p_status, 'reason', v_reason, 'links_deactivated', v_links));

  return jsonb_build_object('found', true, 'changed', true, 'partner_id', v_p.id,
    'previous_status', v_p.status, 'status', p_status);
end;
$$;

-- Platform admin product upsert. Payload keys accept camelCase or snake_case:
--   productKey|product_key, fixedCommissionAmount|fixed_commission_amount,
--   currency, published (optional). `title` is accepted and ignored (no column).
create or replace function public.csp_upsert_sales_product(p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key text;
  v_currency text;
  v_amount numeric(12,2);
  v_raw text;
  v_pub boolean;
  v_prod public.csp_sales_products%rowtype;
  v_created boolean := false;
  v_changed boolean := false;
  v_rate_id uuid;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;

  v_key := lower(btrim(coalesce(p_payload ->> 'productKey', p_payload ->> 'product_key', '')));
  if v_key !~ '^[a-z0-9][a-z0-9_-]{1,63}$' then
    return jsonb_build_object('found', false, 'error', 'product_key_invalid');
  end if;

  v_currency := upper(btrim(coalesce(p_payload ->> 'currency', '')));
  if v_currency !~ '^[A-Z]{3}$' then
    return jsonb_build_object('found', false, 'error', 'currency_invalid');
  end if;

  v_raw := coalesce(p_payload ->> 'fixedCommissionAmount', p_payload ->> 'fixed_commission_amount');
  if v_raw is null or v_raw !~ '^[0-9]{1,7}(\.[0-9]{1,2})?$' then
    return jsonb_build_object('found', false, 'error', 'amount_invalid');
  end if;
  v_amount := v_raw::numeric(12,2);

  if p_payload ? 'published' then
    if jsonb_typeof(p_payload -> 'published') <> 'boolean' then
      return jsonb_build_object('found', false, 'error', 'published_invalid');
    end if;
    v_pub := (p_payload ->> 'published')::boolean;
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_key for update;

  if not found then
    insert into public.csp_sales_products (product_key, fixed_commission_amount, currency, published)
    values (v_key, v_amount, v_currency, coalesce(v_pub, false))
    returning * into v_prod;
    v_created := true;
    v_changed := true;
  else
    v_changed := v_prod.fixed_commission_amount is distinct from v_amount
              or v_prod.currency is distinct from v_currency;
    update public.csp_sales_products
    set fixed_commission_amount = v_amount,
        currency = v_currency,
        published = coalesce(v_pub, published),
        updated_at = now()
    where id = v_prod.id
    returning * into v_prod;
  end if;

  -- New rate version only when the amount/currency actually changes. Existing
  -- qualified sales keep their immutable snapshot.
  if v_changed then
    insert into public.csp_commission_rate_versions (product_id, amount, currency, effective_from)
    values (v_prod.id, v_amount, v_currency, clock_timestamp())
    returning id into v_rate_id;
  end if;

  perform public._csp_audit(v_uid, 'platform_admin',
    case when v_created then 'sales_product_created' else 'sales_product_updated' end,
    'csp_sales_products', v_prod.id,
    jsonb_build_object('product_key', v_key, 'amount', v_amount, 'currency', v_currency,
                       'published', v_prod.published, 'rate_version_id', v_rate_id));

  return jsonb_build_object(
    'found', true, 'created', v_created,
    'product', jsonb_build_object(
      'id', v_prod.id, 'product_key', v_prod.product_key,
      'fixed_commission_amount', v_prod.fixed_commission_amount,
      'currency', v_prod.currency, 'published', v_prod.published),
    'rate_version_id', v_rate_id
  );
end;
$$;

-- Partner issues a personal link. The links table has no product column, so the
-- link is partner + channel scoped; product eligibility is enforced at issue time.
create or replace function public.csp_create_attribution_link(p_product_id uuid, p_channel text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner public.csp_partner_profiles%rowtype;
  v_prod public.csp_sales_products%rowtype;
  v_channel text := lower(btrim(coalesce(p_channel, '')));
  v_code text;
  v_link_id uuid;
  v_try integer := 0;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  -- manual_platform_assignment is Platform-only and cannot be self-issued.
  if v_channel not in (
    'facebook','instagram','x','snapchat','tiktok','linkedin','email','qr','other',
    'referral_link','partner_code'
  ) then
    return jsonb_build_object('found', false, 'error', 'invalid_channel');
  end if;

  select * into v_partner from public.csp_partner_profiles where auth_user_id = v_uid;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;
  if v_partner.status not in ('approved','active','certified') then
    return jsonb_build_object('found', false, 'error', 'partner_not_approved');
  end if;

  select * into v_prod from public.csp_sales_products where id = p_product_id;
  if not found or not v_prod.published then
    return jsonb_build_object('found', false, 'error', 'product_not_available');
  end if;

  if not exists (
    select 1 from public.csp_product_certifications c
    where c.partner_id = v_partner.id and c.product_id = v_prod.id and c.status = 'passed'
  ) then
    return jsonb_build_object('found', false, 'error', 'certification_required');
  end if;

  loop
    v_try := v_try + 1;
    v_code := 'csp-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    begin
      insert into public.csp_attribution_links (partner_id, code, channel_origin)
      values (v_partner.id, v_code, v_channel)
      returning id into v_link_id;
      exit;
    exception when unique_violation then
      if v_try >= 5 then
        return jsonb_build_object('found', false, 'error', 'link_code_generation_failed');
      end if;
    end;
  end loop;

  perform public._csp_audit(v_uid, 'partner', 'attribution_link_created',
    'csp_attribution_links', v_link_id,
    jsonb_build_object('channel', v_channel, 'product_key', v_prod.product_key));

  return jsonb_build_object(
    'found', true, 'link_id', v_link_id, 'code', v_code,
    'path', '/r/' || v_code, 'channel', v_channel, 'product_key', v_prod.product_key
  );
end;
$$;

-- Answer key for a published course. Authenticated partner only; each read is audited.
create or replace function public.csp_get_academy_answer_key(p_course_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner public.csp_partner_profiles%rowtype;
  v_course public.csp_academy_courses%rowtype;
  v_questions jsonb;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  select * into v_partner from public.csp_partner_profiles where auth_user_id = v_uid;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;
  if v_partner.status not in ('approved','active','certified','in_academy') then
    return jsonb_build_object('found', false, 'error', 'partner_not_eligible');
  end if;

  select * into v_course from public.csp_academy_courses where id = p_course_id and published;
  if not found then
    return jsonb_build_object('found', false, 'error', 'course_not_found');
  end if;

  select jsonb_agg(jsonb_build_object(
           'question_id', q.id, 'position', q.position, 'answer_key', q.answer_key
         ) order by q.position)
  into v_questions
  from public.csp_academy_questions q
  where q.course_id = v_course.id;

  if v_questions is null then
    return jsonb_build_object('found', false, 'error', 'academy_questions_not_loaded');
  end if;

  perform public._csp_audit(v_uid, 'partner', 'academy_answer_key_read',
    'csp_academy_courses', v_course.id, jsonb_build_object('partner_id', v_partner.id));

  return jsonb_build_object('found', true, 'course_id', v_course.id,
    'pass_score', v_course.pass_score, 'questions', v_questions);
end;
$$;

-- Records an attempt. The score is RECOMPUTED in SQL from p_answers against the
-- stored answer keys; p_score_pct / p_passed are informational and never trusted.
-- p_answers: JSON object keyed by question id (or position) -> chosen value.
-- A question is correct when value = answer_key (or answer_key->'correct').
create or replace function public.csp_record_academy_attempt(
  p_course_id uuid,
  p_score_pct numeric,
  p_passed boolean,
  p_answers jsonb
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner public.csp_partner_profiles%rowtype;
  v_course public.csp_academy_courses%rowtype;
  v_total integer;
  v_correct integer;
  v_score integer;
  v_passed boolean;
  v_attempt_id uuid;
  v_cert_status text := null;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if jsonb_typeof(p_answers) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_answers');
  end if;

  select * into v_partner from public.csp_partner_profiles where auth_user_id = v_uid for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;
  if v_partner.status not in ('approved','active','certified','in_academy') then
    return jsonb_build_object('found', false, 'error', 'partner_not_eligible');
  end if;

  select * into v_course from public.csp_academy_courses where id = p_course_id and published;
  if not found then
    return jsonb_build_object('found', false, 'error', 'course_not_found');
  end if;

  -- Brute-force guard on answer guessing.
  if (select count(*) from public.csp_academy_attempts
      where partner_id = v_partner.id and course_id = v_course.id
        and submitted_at > now() - interval '24 hours') >= 10 then
    return jsonb_build_object('found', false, 'error', 'attempt_limit_reached');
  end if;

  select count(*),
         count(*) filter (where
           coalesce(p_answers -> q.id::text, p_answers -> q.position::text) =
           case when jsonb_typeof(q.answer_key) = 'object' and q.answer_key ? 'correct'
                then q.answer_key -> 'correct' else q.answer_key end)
  into v_total, v_correct
  from public.csp_academy_questions q
  where q.course_id = v_course.id;

  if v_total = 0 then
    return jsonb_build_object('found', false, 'error', 'academy_questions_not_loaded');
  end if;

  v_score := round(100.0 * v_correct / v_total)::integer;
  v_passed := v_score >= v_course.pass_score;

  insert into public.csp_academy_attempts (partner_id, course_id, score, passed)
  values (v_partner.id, v_course.id, v_score, v_passed)
  returning id into v_attempt_id;

  if v_passed and v_course.product_id is not null
     and v_partner.status in ('approved','active','certified') then
    insert into public.csp_product_certifications (partner_id, product_id, status, score, passed_at)
    values (v_partner.id, v_course.product_id, 'passed', v_score, now())
    on conflict (partner_id, product_id) do update
      set status = 'passed', score = excluded.score, passed_at = now()
      where public.csp_product_certifications.status <> 'revoked'
    returning status into v_cert_status;
  end if;

  perform public._csp_audit(v_uid, 'partner', 'academy_attempt_recorded',
    'csp_academy_attempts', v_attempt_id,
    jsonb_build_object(
      'partner_id', v_partner.id, 'course_id', v_course.id,
      'score', v_score, 'passed', v_passed,
      'client_score_pct', p_score_pct, 'client_passed', p_passed,
      'certification_status', v_cert_status));

  return jsonb_build_object(
    'found', true, 'attempt_id', v_attempt_id,
    'score_pct', v_score, 'passed', v_passed, 'pass_score', v_course.pass_score,
    'certification_status', v_cert_status
  );
end;
$$;

create or replace function public.csp_get_partner_bank_profile()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner uuid;
  v_bank public.csp_partner_bank_profiles%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  select id into v_partner from public.csp_partner_profiles where auth_user_id = v_uid;
  if v_partner is null then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;

  select * into v_bank
  from public.csp_partner_bank_profiles
  where partner_id = v_partner and superseded_at is null;

  if not found then
    return jsonb_build_object('found', true, 'has_profile', false);
  end if;

  -- Masked output only: ciphertext is never returned.
  return jsonb_build_object(
    'found', true, 'has_profile', true,
    'status', v_bank.status,
    'key_version', v_bank.key_version,
    'fingerprint_hint', right(coalesce(v_bank.fingerprint, ''), 6),
    'masked_hint', left(coalesce(v_bank.encrypted_payload ->> 'masked_hint', ''), 12),
    'updated_at', v_bank.created_at
  );
end;
$$;

-- Accepts only a Core-encrypted envelope: {ciphertext, key_version?, masked_hint?}.
-- Rejects any payload carrying plaintext bank field names.
create or replace function public.csp_save_partner_bank_profile(p_encrypted_payload jsonb, p_fingerprint text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner public.csp_partner_profiles%rowtype;
  v_key_version integer := 1;
  v_id uuid;
  v_hint text;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if jsonb_typeof(p_encrypted_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;
  if p_encrypted_payload ?| array[
       'iban','swift_bic','swiftBic','account_number','accountNumber',
       'local_account_number','localAccountNumber','local_routing_code','localRoutingCode',
       'account_holder','accountHolder','routing_number','sort_code'
     ] then
    return jsonb_build_object('found', false, 'error', 'plaintext_bank_data_rejected');
  end if;
  if jsonb_typeof(p_encrypted_payload -> 'ciphertext') is distinct from 'string'
     or length(p_encrypted_payload ->> 'ciphertext') < 16 then
    return jsonb_build_object('found', false, 'error', 'encrypted_envelope_required');
  end if;
  if p_fingerprint is null or p_fingerprint !~ '^[A-Za-z0-9:_-]{16,128}$' then
    return jsonb_build_object('found', false, 'error', 'invalid_fingerprint');
  end if;
  if coalesce(p_encrypted_payload ->> 'key_version', '1') !~ '^[0-9]{1,4}$' then
    return jsonb_build_object('found', false, 'error', 'invalid_key_version');
  end if;
  v_key_version := greatest(coalesce(p_encrypted_payload ->> 'key_version', '1')::integer, 1);

  select * into v_partner from public.csp_partner_profiles where auth_user_id = v_uid for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;
  if v_partner.status in ('rejected','terminated') then
    return jsonb_build_object('found', false, 'error', 'partner_not_eligible');
  end if;

  update public.csp_partner_bank_profiles
  set superseded_at = now()
  where partner_id = v_partner.id and superseded_at is null;

  insert into public.csp_partner_bank_profiles (partner_id, encrypted_payload, key_version, fingerprint, status)
  values (v_partner.id, p_encrypted_payload, v_key_version, p_fingerprint, 'pending_verification')
  returning id into v_id;

  v_hint := left(coalesce(p_encrypted_payload ->> 'masked_hint', ''), 12);

  -- Audit never carries payload, ciphertext or fingerprint.
  perform public._csp_audit(v_uid, 'partner', 'bank_profile_saved',
    'csp_partner_bank_profiles', v_id,
    jsonb_build_object('partner_id', v_partner.id, 'key_version', v_key_version));

  return jsonb_build_object(
    'found', true, 'has_profile', true, 'status', 'pending_verification',
    'key_version', v_key_version,
    'fingerprint_hint', right(p_fingerprint, 6),
    'masked_hint', v_hint
  );
end;
$$;

-- Payment webhook / Platform admin. Payload (camelCase or snake_case):
--   eventId (required, idempotency), eventType: paid_period|refund|chargeback,
--   customerOrgId (uuid), productKey, periodOrdinal (int; required for paid_period).
-- The partner is resolved from the first-wins attribution on the customer
-- organization — never from the payload. No amount is read from the payload.
create or replace function public.csp_apply_paid_period_event(p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_service boolean := public._csp_is_service_role();
  v_kind text;
  v_event_id text;
  v_type text;
  v_org uuid;
  v_key text;
  v_ord integer;
  v_raw text;
  v_attr public.csp_attributed_registrations%rowtype;
  v_prod public.csp_sales_products%rowtype;
  v_sale public.csp_qualified_sales%rowtype;
  v_rate public.csp_commission_rate_versions%rowtype;
  v_new_count integer;
  v_outcome text;
  v_prev_status text;
  v_clawback boolean := false;
  v_review boolean := false;
begin
  if not v_service and not (v_uid is not null and coalesce(public.is_platform_admin(), false)) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  v_kind := case when v_service then 'system' else 'platform_admin' end;

  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;

  v_event_id := btrim(coalesce(p_payload ->> 'eventId', p_payload ->> 'event_id', ''));
  if length(v_event_id) < 1 or length(v_event_id) > 200 then
    return jsonb_build_object('found', false, 'error', 'event_id_required');
  end if;

  v_type := lower(btrim(coalesce(p_payload ->> 'eventType', p_payload ->> 'event_type', '')));
  if v_type not in ('paid_period','refund','chargeback') then
    return jsonb_build_object('found', false, 'error', 'invalid_event_type');
  end if;

  begin
    v_org := coalesce(p_payload ->> 'customerOrgId', p_payload ->> 'customer_org_id')::uuid;
  exception when others then
    return jsonb_build_object('found', false, 'error', 'invalid_customer_org_id');
  end;
  if v_org is null then
    return jsonb_build_object('found', false, 'error', 'invalid_customer_org_id');
  end if;

  v_key := lower(btrim(coalesce(p_payload ->> 'productKey', p_payload ->> 'product_key', '')));
  if v_key = '' then
    return jsonb_build_object('found', false, 'error', 'product_key_required');
  end if;

  v_raw := coalesce(p_payload ->> 'periodOrdinal', p_payload ->> 'period_ordinal');
  if v_raw is not null then
    if v_raw !~ '^[0-9]{1,3}$' then
      return jsonb_build_object('found', false, 'error', 'invalid_period_ordinal');
    end if;
    v_ord := v_raw::integer;
  end if;
  if v_type = 'paid_period' and (v_ord is null or v_ord < 1) then
    return jsonb_build_object('found', false, 'error', 'invalid_period_ordinal');
  end if;

  -- Event-level idempotency (ledger unique keys remain the hard backstop).
  perform pg_advisory_xact_lock(hashtextextended('csp_paid_event:' || v_event_id, 0));
  if exists (
    select 1 from public.csp_audit_events
    where action = 'paid_period_event_applied' and detail ->> 'event_id' = v_event_id
  ) then
    return jsonb_build_object('found', true, 'outcome', 'duplicate_event', 'idempotent', true);
  end if;

  select * into v_attr from public.csp_attributed_registrations where customer_org_id = v_org;
  if not found then
    return jsonb_build_object('found', false, 'error', 'no_attribution');
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_key;
  if not found then
    return jsonb_build_object('found', false, 'error', 'product_not_found');
  end if;

  select * into v_sale
  from public.csp_qualified_sales
  where partner_id = v_attr.partner_id and customer_org_id = v_org and product_id = v_prod.id
  for update;

  if v_type = 'paid_period' then
    if not found then
      if exists (
        select 1 from public.csp_qualified_sales
        where customer_org_id = v_org and product_id = v_prod.id
          and partner_id <> v_attr.partner_id
          and status not in ('rejected','reversed')
      ) then
        return jsonb_build_object('found', false, 'error', 'conflicting_claim');
      end if;
      insert into public.csp_qualified_sales (partner_id, customer_org_id, product_id, attributed_at)
      values (v_attr.partner_id, v_org, v_prod.id, v_attr.attributed_at)
      returning * into v_sale;
    end if;

    if v_sale.status in ('reversed','rejected') then
      v_outcome := 'sale_closed_no_commission';
    else
      -- Snapshot the current rate on the first confirmed paid period (immutable afterwards).
      if v_sale.snapshot_amount is null then
        select * into v_rate
        from public.csp_commission_rate_versions
        where product_id = v_prod.id and effective_from <= now()
        order by effective_from desc
        limit 1;
        if not found then
          return jsonb_build_object('found', false, 'error', 'no_commission_rate');
        end if;
        update public.csp_qualified_sales
        set snapshot_amount = v_rate.amount,
            snapshot_currency = v_rate.currency,
            snapshot_rate_version_id = v_rate.id,
            first_confirmed_at = now()
        where id = v_sale.id
        returning * into v_sale;
      end if;

      v_new_count := greatest(v_sale.paid_periods_count, v_ord);
      v_prev_status := v_sale.status;

      if v_new_count >= 2
         and v_sale.status in ('registered_awaiting_second_payment','pending_possible') then
        update public.csp_qualified_sales
        set paid_periods_count = v_new_count, status = 'earned'
        where id = v_sale.id
        returning * into v_sale;

        insert into public.csp_commission_ledger
          (partner_id, qualified_sale_id, entry_type, amount, currency, idempotency_key)
        values
          (v_sale.partner_id, v_sale.id, 'earned', v_sale.snapshot_amount, v_sale.snapshot_currency,
           'csp:earned:' || v_sale.id::text)
        on conflict (idempotency_key) do nothing;
        v_outcome := 'earned';
      else
        update public.csp_qualified_sales
        set paid_periods_count = v_new_count
        where id = v_sale.id
        returning * into v_sale;
        v_outcome := case
          when v_sale.status in ('registered_awaiting_second_payment','pending_possible')
            then 'awaiting_second_payment'
          else 'renewal_no_commission'
        end;
      end if;
    end if;

  else
    -- refund | chargeback
    if not found then
      v_outcome := 'no_qualified_sale';
    elsif v_ord is not null and v_ord > 2 then
      v_outcome := 'renewal_period_no_reversal';
    elsif v_sale.status in ('reversed','rejected') then
      v_outcome := 'already_reversed';
    else
      v_prev_status := v_sale.status;
      if v_sale.status in ('earned','approved_for_payout','queued_for_payout','paid')
         and v_sale.snapshot_amount is not null then
        insert into public.csp_commission_ledger
          (partner_id, qualified_sale_id, entry_type, amount, currency, idempotency_key)
        values
          (v_sale.partner_id, v_sale.id, 'reversal', -v_sale.snapshot_amount, v_sale.snapshot_currency,
           'csp:reversal:' || v_sale.id::text)
        on conflict (idempotency_key) do nothing;
      end if;
      v_clawback := v_prev_status in ('queued_for_payout','paid');
      v_review := v_prev_status in ('approved_for_payout','queued_for_payout','paid');
      update public.csp_qualified_sales set status = 'reversed' where id = v_sale.id returning * into v_sale;
      v_outcome := 'reversed';
    end if;
  end if;

  perform public._csp_audit(v_uid, v_kind, 'paid_period_event_applied',
    'csp_qualified_sales', v_sale.id,
    jsonb_build_object(
      'event_id', v_event_id, 'event_type', v_type, 'period_ordinal', v_ord,
      'outcome', v_outcome, 'product_key', v_key,
      'clawback_required', v_clawback, 'settlement_review_required', v_review));

  return jsonb_build_object(
    'found', true, 'outcome', v_outcome,
    'qualified_sale_id', v_sale.id, 'status', v_sale.status,
    'paid_periods_count', v_sale.paid_periods_count,
    'clawback_required', v_clawback, 'settlement_review_required', v_review
  );
end;
$$;

-- Settlement state machine: open -> approved -> closed -> paid; voided from any
-- non-final state (reason required). Paid requires a payment reference.
-- The paid timestamp, reference and reason are recorded in the audit event
-- (the settlement table has no columns for them); a negative 'payout' ledger
-- entry is written on paid.
create or replace function public.csp_transition_settlement(
  p_settlement_id uuid,
  p_to text,
  p_reason text,
  p_paid_at timestamptz,
  p_payment_reference text
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_reason text := btrim(coalesce(p_reason, ''));
  v_ref text := btrim(coalesce(p_payment_reference, ''));
  v_paid_at timestamptz;
  v_s public.csp_monthly_settlements%rowtype;
  v_lines integer;
  v_sum numeric(12,2);
  v_sales_updated integer := 0;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if p_settlement_id is null then
    return jsonb_build_object('found', false, 'error', 'settlement_id_required');
  end if;
  if p_to is null or p_to not in ('approved','closed','paid','voided') then
    return jsonb_build_object('found', false, 'error', 'invalid_target_status');
  end if;

  select * into v_s from public.csp_monthly_settlements where id = p_settlement_id for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'settlement_not_found');
  end if;

  if not (
       (v_s.status = 'open'     and p_to = 'approved')
    or (v_s.status = 'approved' and p_to = 'closed')
    or (v_s.status = 'closed'   and p_to = 'paid')
    or (v_s.status in ('open','approved','closed') and p_to = 'voided')
  ) then
    return jsonb_build_object('found', false, 'error', 'invalid_transition',
      'from', v_s.status, 'to', p_to);
  end if;

  if p_to = 'voided' and (length(v_reason) < 3 or length(v_reason) > 500) then
    return jsonb_build_object('found', false, 'error', 'reason_required');
  end if;

  if p_to = 'paid' then
    if length(v_ref) < 3 or length(v_ref) > 200 then
      return jsonb_build_object('found', false, 'error', 'payment_reference_required');
    end if;
    v_paid_at := coalesce(p_paid_at, now());
    if v_paid_at > now() + interval '1 day' then
      return jsonb_build_object('found', false, 'error', 'paid_at_in_future');
    end if;
  end if;

  if p_to = 'approved' then
    select count(*), coalesce(sum(amount), 0) into v_lines, v_sum
    from public.csp_settlement_lines where settlement_id = v_s.id;
    if v_lines = 0 then
      return jsonb_build_object('found', false, 'error', 'settlement_empty');
    end if;
    if v_sum is distinct from v_s.total_amount then
      return jsonb_build_object('found', false, 'error', 'settlement_total_mismatch');
    end if;
  end if;

  update public.csp_monthly_settlements
  set status = p_to,
      closed_at = case when p_to = 'closed' then now() else closed_at end
  where id = v_s.id;

  if p_to = 'approved' then
    update public.csp_qualified_sales q set status = 'approved_for_payout'
    from public.csp_settlement_lines l
    where l.settlement_id = v_s.id and l.qualified_sale_id = q.id and q.status = 'earned';
    get diagnostics v_sales_updated = row_count;
  elsif p_to = 'closed' then
    update public.csp_qualified_sales q set status = 'queued_for_payout'
    from public.csp_settlement_lines l
    where l.settlement_id = v_s.id and l.qualified_sale_id = q.id and q.status = 'approved_for_payout';
    get diagnostics v_sales_updated = row_count;
  elsif p_to = 'paid' then
    update public.csp_qualified_sales q set status = 'paid'
    from public.csp_settlement_lines l
    where l.settlement_id = v_s.id and l.qualified_sale_id = q.id
      and q.status in ('queued_for_payout','approved_for_payout');
    get diagnostics v_sales_updated = row_count;

    if v_s.total_amount > 0 then
      insert into public.csp_commission_ledger
        (partner_id, settlement_id, entry_type, amount, currency, idempotency_key)
      values
        (v_s.partner_id, v_s.id, 'payout', -v_s.total_amount, v_s.currency,
         'csp:payout:' || v_s.id::text)
      on conflict (idempotency_key) do nothing;
    end if;
  else
    -- voided: release earned sales back to the pool and drop the settlement lines.
    update public.csp_qualified_sales q set status = 'earned'
    from public.csp_settlement_lines l
    where l.settlement_id = v_s.id and l.qualified_sale_id = q.id
      and q.status in ('approved_for_payout','queued_for_payout');
    get diagnostics v_sales_updated = row_count;
    delete from public.csp_settlement_lines where settlement_id = v_s.id;
  end if;

  perform public._csp_audit(v_uid, 'platform_admin', 'settlement_transitioned',
    'csp_monthly_settlements', v_s.id,
    jsonb_build_object(
      'from', v_s.status, 'to', p_to,
      'reason', nullif(v_reason, ''),
      'paid_at', v_paid_at,
      'payment_reference', nullif(v_ref, ''),
      'partner_id', v_s.partner_id,
      'total_amount', v_s.total_amount, 'currency', v_s.currency,
      'sales_updated', v_sales_updated));

  return jsonb_build_object('found', true, 'settlement_id', v_s.id,
    'previous_status', v_s.status, 'status', p_to);
end;
$$;

-- ---------------------------------------------------------------------------
-- 5) Privileges — explicit, least-privilege (Supabase default ACLs also grant
--    anon/authenticated/service_role, so every role is revoked first).
-- ---------------------------------------------------------------------------
revoke all on function public._csp_is_service_role() from public, anon, authenticated, service_role;
revoke all on function public._csp_audit(uuid, text, text, text, uuid, jsonb) from public, anon, authenticated, service_role;

revoke all on function public.csp_get_backend_status() from public, anon, authenticated, service_role;
revoke all on function public.csp_get_partner_overview() from public, anon, authenticated, service_role;
revoke all on function public.csp_get_platform_overview() from public, anon, authenticated, service_role;
revoke all on function public.csp_list_qualified_sales() from public, anon, authenticated, service_role;
revoke all on function public.csp_list_monthly_settlements() from public, anon, authenticated, service_role;
revoke all on function public.csp_register_partner_application(jsonb) from public, anon, authenticated, service_role;
revoke all on function public.csp_set_partner_status(uuid, text, text) from public, anon, authenticated, service_role;
revoke all on function public.csp_upsert_sales_product(jsonb) from public, anon, authenticated, service_role;
revoke all on function public.csp_create_attribution_link(uuid, text) from public, anon, authenticated, service_role;
revoke all on function public.csp_get_academy_answer_key(uuid) from public, anon, authenticated, service_role;
revoke all on function public.csp_record_academy_attempt(uuid, numeric, boolean, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.csp_get_partner_bank_profile() from public, anon, authenticated, service_role;
revoke all on function public.csp_save_partner_bank_profile(jsonb, text) from public, anon, authenticated, service_role;
revoke all on function public.csp_apply_paid_period_event(jsonb) from public, anon, authenticated, service_role;
revoke all on function public.csp_transition_settlement(uuid, text, text, timestamptz, text) from public, anon, authenticated, service_role;

grant execute on function public.csp_get_backend_status() to authenticated;
grant execute on function public.csp_get_partner_overview() to authenticated;
grant execute on function public.csp_get_platform_overview() to authenticated;
grant execute on function public.csp_list_qualified_sales() to authenticated;
grant execute on function public.csp_list_monthly_settlements() to authenticated;
grant execute on function public.csp_register_partner_application(jsonb) to authenticated;
grant execute on function public.csp_set_partner_status(uuid, text, text) to authenticated;
grant execute on function public.csp_upsert_sales_product(jsonb) to authenticated;
grant execute on function public.csp_create_attribution_link(uuid, text) to authenticated;
grant execute on function public.csp_get_academy_answer_key(uuid) to authenticated;
grant execute on function public.csp_record_academy_attempt(uuid, numeric, boolean, jsonb) to authenticated;
grant execute on function public.csp_get_partner_bank_profile() to authenticated;
grant execute on function public.csp_save_partner_bank_profile(jsonb, text) to authenticated;
grant execute on function public.csp_apply_paid_period_event(jsonb) to authenticated, service_role;
grant execute on function public.csp_transition_settlement(uuid, text, text, timestamptz, text) to authenticated;

-- Re-assert table lockdown (idempotent; matches foundation).
do $$
declare
  t text;
begin
  foreach t in array array[
    'csp_partner_profiles','csp_partner_bank_profiles','csp_sales_products',
    'csp_commission_rate_versions','csp_academy_courses','csp_academy_questions',
    'csp_academy_attempts','csp_product_certifications','csp_attribution_links',
    'csp_attribution_events','csp_attributed_registrations','csp_qualified_sales',
    'csp_commission_ledger','csp_monthly_settlements','csp_settlement_lines','csp_audit_events'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6) Placeholder seed (idempotent; never overwrites Platform edits)
--    Amounts are PLATFORM-OVERRIDABLE PLACEHOLDERS — not live Stripe/billing
--    prices. Change them through csp_upsert_sales_product.
-- ---------------------------------------------------------------------------
do $$
declare
  v_inserted integer := 0;
  v_n integer;
begin
  insert into public.csp_sales_products (product_key, fixed_commission_amount, currency, published)
  values
    ('kompis_web',    500.00, 'NOK', true),
    ('kompis_bedrift', 800.00, 'NOK', true),
    ('aipify_voice',     0.00, 'NOK', false)
  on conflict (product_key) do nothing;
  get diagnostics v_n = row_count;
  v_inserted := v_inserted + v_n;

  insert into public.csp_commission_rate_versions (product_id, amount, currency, effective_from)
  select p.id, p.fixed_commission_amount, p.currency, timestamptz '2026-01-01 00:00:00+00'
  from public.csp_sales_products p
  where p.product_key in ('kompis_web','kompis_bedrift','aipify_voice')
  on conflict (product_id, effective_from) do nothing;

  -- Course content (questions, locale blocks, answer keys) lives in the app /
  -- is loaded separately. Unpublished until questions exist (fails closed).
  insert into public.csp_academy_courses (product_id, course_key, published, pass_score)
  select p.id, 'kompis_web_v1', false, 80
  from public.csp_sales_products p
  where p.product_key = 'kompis_web'
  on conflict (course_key) do nothing;
  get diagnostics v_n = row_count;
  v_inserted := v_inserted + v_n;

  if v_inserted > 0 then
    perform public._csp_audit(null, 'system', 'csp_impl_v1_seed_applied', null, null,
      jsonb_build_object('rows_inserted', v_inserted, 'placeholder_amounts', true));
  end if;
end;
$$;

comment on function public.csp_apply_paid_period_event(jsonb) is
  'CSP paid-period webhook. Idempotent per eventId. Period 2 earns the fixed snapshot once; refund/chargeback reverses; no renewal commission.';
comment on function public.csp_record_academy_attempt(uuid, numeric, boolean, jsonb) is
  'CSP academy attempt. Score is recomputed in SQL from stored answer keys; client score/passed are informational only.';
