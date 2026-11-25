-- =============================================================================
-- CSP partner business identity persistence — PREPARED ONLY / REVIEW ONLY
-- DATE: 2026-11-25
-- TARGET: Production Core qbcqoixhrvhnuwphefvw (and Staging after Gate S)
-- STATUS: NOT APPLIED. Requires separate exact owner approval before any apply.
-- =============================================================================
--
-- WHY
-- Public registration validates and sends legal_business_name,
-- business_registration_number, address, and phone. Current
-- csp_register_partner_application only persists display_name + country
-- (by design in 19411 — audit metadata only; no email/phone/address/reg number).
-- Platform review therefore cannot see registered business identity from Core.
--
-- THIS CANDIDATE
-- Additive columns on csp_partner_profiles + replace register + replace the FULL
-- platform overview (partners[] now carries business identity, auth_user_id,
-- email / email_verified read from auth.users, and updated_at). No GRANT expansion
-- beyond existing authenticated EXECUTE on the same RPCs. No RLS weaken. No email
-- column added (email remains on auth.users; joined read-only at query time).
-- No secrets. No seeds. Apply-side effects = schema + RPC bodies only.
--
-- INTEGRITY
-- This file does not embed its own hash. The SHA-256 of the exact file reviewed is
-- recorded in CSP_PARTNER_BUSINESS_IDENTITY_APPLY_RUNBOOK_20261125.md — re-compute
-- (shasum -a 256 <file>) and compare before any apply.
--
-- DO NOT
-- - Apply without named owner approval for this file
-- - Treat form browser storage as a substitute for Core persistence
-- - Claim firm verification complete after apply alone (admin still reviews)
-- =============================================================================

begin;

alter table public.csp_partner_profiles
  add column if not exists legal_business_name text,
  add column if not exists business_registration_number text,
  add column if not exists business_address text,
  add column if not exists phone text;

comment on column public.csp_partner_profiles.legal_business_name is
  'Registered legal business name from partner application (not employment).';
comment on column public.csp_partner_profiles.business_registration_number is
  'Country-local business registration / org identifier (free-form text).';
comment on column public.csp_partner_profiles.business_address is
  'Optional business address from application; never required for approval.';
comment on column public.csp_partner_profiles.phone is
  'Optional contact phone from application; never logged in plaintext audit extras beyond presence flags.';

-- ---------------------------------------------------------------------------
-- Register: persist business identity with the authenticated applicant
-- ---------------------------------------------------------------------------
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
  v_legal text;
  v_reg text;
  v_address text;
  v_phone text;
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

  v_legal := btrim(coalesce(p_payload ->> 'legalBusinessName', p_payload ->> 'legal_business_name', ''));
  if length(v_legal) < 2 or length(v_legal) > 300 then
    return jsonb_build_object('found', false, 'error', 'invalid_legal_business_name');
  end if;

  v_reg := btrim(coalesce(
    p_payload ->> 'businessRegistrationNumber',
    p_payload ->> 'business_registration_number',
    ''
  ));
  if length(v_reg) < 2 or length(v_reg) > 120 then
    return jsonb_build_object('found', false, 'error', 'invalid_business_registration_number');
  end if;

  v_address := nullif(btrim(coalesce(p_payload ->> 'address', p_payload ->> 'business_address', '')), '');
  if v_address is not null and length(v_address) > 500 then
    return jsonb_build_object('found', false, 'error', 'invalid_address');
  end if;

  v_phone := nullif(btrim(coalesce(p_payload ->> 'phone', '')), '');
  if v_phone is not null and length(v_phone) > 40 then
    return jsonb_build_object('found', false, 'error', 'invalid_phone');
  end if;

  if coalesce(p_payload ->> 'termsAccepted', p_payload ->> 'terms_accepted', '') <> 'true'
     or coalesce(p_payload ->> 'certificationUnderstood', p_payload ->> 'certification_understood', '') <> 'true'
     or coalesce(p_payload ->> 'infoAccurateConfirmed', p_payload ->> 'info_accurate_confirmed', '') <> 'true' then
    return jsonb_build_object('found', false, 'error', 'confirmations_required');
  end if;

  select * into v_existing from public.csp_partner_profiles where auth_user_id = v_uid;
  if found then
    return jsonb_build_object(
      'found', true, 'created', false,
      'partner_id', v_existing.id, 'status', v_existing.status
    );
  end if;

  insert into public.csp_partner_profiles (
    auth_user_id, display_name, country, status,
    legal_business_name, business_registration_number, business_address, phone
  )
  values (
    v_uid, v_name, v_country, 'under_review',
    v_legal, v_reg, v_address, v_phone
  )
  on conflict (auth_user_id) do nothing
  returning id into v_id;

  if v_id is null then
    select * into v_existing from public.csp_partner_profiles where auth_user_id = v_uid;
    return jsonb_build_object(
      'found', true, 'created', false,
      'partner_id', v_existing.id, 'status', v_existing.status
    );
  end if;

  -- Audit: country + presence flags only — never store raw phone/address/reg in audit payload.
  perform public._csp_audit(v_uid, 'partner', 'partner_application_registered',
    'csp_partner_profiles', v_id,
    jsonb_build_object(
      'country', v_country,
      'status', 'under_review',
      'has_legal_business_name', true,
      'has_business_registration_number', true,
      'has_address', v_address is not null,
      'has_phone', v_phone is not null
    ));

  return jsonb_build_object('found', true, 'created', true, 'partner_id', v_id, 'status', 'under_review');
end;
$$;

revoke all on function public.csp_register_partner_application(jsonb) from public, anon, authenticated, service_role;
grant execute on function public.csp_register_partner_application(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Platform overview: FULL replacement of csp_get_platform_overview.
-- Matches the Production body (partners_by_status, partners_total, certified_partners,
-- qualified_sales_total, products_*, open_settlements, unpaid_settlements_count,
-- partners[], products[], academy) and extends partners[] with:
--   legal_business_name, business_registration_number, business_address, phone,
--   auth_user_id, email (from auth.users), email_verified (email_confirmed_at is not null),
--   updated_at.
-- Still gated by is_platform_admin(); no change to GRANTs (authenticated EXECUTE only).
-- auth.users is read inside this security definer function only — never exposed to clients
-- beyond what a platform admin receives in this response.
-- ---------------------------------------------------------------------------
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
    'certified_partners', (
      select count(distinct partner_id) from public.csp_product_certifications where status = 'passed'
    ),
    'qualified_sales_total', (select count(*) from public.csp_qualified_sales),
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
    ),
    'partners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'status', p.status,
        'display_name', p.display_name,
        'country', p.country,
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'legal_business_name', p.legal_business_name,
        'business_registration_number', p.business_registration_number,
        'business_address', p.business_address,
        'phone', p.phone,
        'auth_user_id', p.auth_user_id,
        'email', u.email,
        'email_verified', (u.email_confirmed_at is not null)
      ) order by p.created_at desc)
      from public.csp_partner_profiles p
      left join auth.users u on u.id = p.auth_user_id
    ), '[]'::jsonb),
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sp.id,
        'product_key', sp.product_key,
        'title', sp.product_key,
        'currency', sp.currency,
        'fixed_commission_amount', sp.fixed_commission_amount,
        'published', sp.published
      ) order by sp.product_key)
      from public.csp_sales_products sp
    ), '[]'::jsonb),
    'academy', jsonb_build_object(
      'attempts_total', (select count(*) from public.csp_academy_attempts),
      'attempts_passed', (select count(*) from public.csp_academy_attempts where passed),
      'attempts_failed', (select count(*) from public.csp_academy_attempts where not passed),
      'certifications_active', (
        select count(*) from public.csp_product_certifications where status = 'passed'
      )
    )
  );
end;
$$;

revoke all on function public.csp_get_platform_overview() from public, anon, authenticated, service_role;
grant execute on function public.csp_get_platform_overview() to authenticated;

comment on function public.csp_get_platform_overview() is
  'Platform-admin overview of certified sales partners incl. business identity, applicant email and email-verified flag for application review.';

comment on function public.csp_register_partner_application(jsonb) is
  'CSP partner application. Requires auth.uid(). Persists display_name, country, legal business name and registration number; optional address/phone. Re-submit never changes status.';

commit;

-- END PREPARED ONLY — STATUS: NOT APPLIED. Do not apply without separate exact owner approval.
