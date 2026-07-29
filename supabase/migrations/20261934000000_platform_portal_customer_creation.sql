-- Platform portal Customer Creation V1 (atomic ordinary customer identity).
-- Writes: companies → customers → organizations (via _mta_sync_organization_from_customer).
-- Does not create subscriptions, licenses, domains, installs, entitlements,
-- registration/payment profiles, auth users, or invite emails.

create or replace function public.create_platform_portal_customer(
  p_organization_number text,
  p_legal_name text,
  p_display_name text,
  p_slug text,
  p_country text default 'NO'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_number text;
  v_legal_name text;
  v_display_name text;
  v_slug text;
  v_country text;
  v_company_id uuid;
  v_customer_id uuid;
  v_customer_number text;
  v_placeholder_email text;
  v_created_at timestamptz;
  v_status text;
  v_existing_id uuid;
begin
  perform public._ppsf258_require_platform_access();

  v_org_number := regexp_replace(coalesce(p_organization_number, ''), '\D', '', 'g');
  if length(v_org_number) <> 9 then
    raise exception 'INVALID_ORGANIZATION_NUMBER' using errcode = 'P0001';
  end if;

  v_legal_name := nullif(btrim(coalesce(p_legal_name, '')), '');
  v_display_name := nullif(btrim(coalesce(p_display_name, '')), '');
  if v_legal_name is null then
    raise exception 'INVALID_LEGAL_NAME' using errcode = 'P0001';
  end if;
  if v_display_name is null then
    v_display_name := v_legal_name;
  end if;

  v_slug := lower(btrim(coalesce(p_slug, '')));
  v_slug := regexp_replace(v_slug, '[^a-z0-9]+', '-', 'g');
  v_slug := regexp_replace(v_slug, '-+', '-', 'g');
  v_slug := trim(both '-' from v_slug);
  if v_slug is null or v_slug = '' or length(v_slug) < 2 or length(v_slug) > 64 then
    raise exception 'INVALID_SLUG' using errcode = 'P0001';
  end if;

  if v_slug in (
    'platform', 'app', 'admin', 'super', 'api', 'login', 'auth',
    'my-company-1', 'aipify', 'aipify-group', 'aipify-internal'
  ) then
    raise exception 'RESERVED_SLUG' using errcode = 'P0001';
  end if;

  if v_slug = 'unonight' and exists (
    select 1
    from public.organizations o
    where lower(o.slug) = 'unonight'
  ) then
    raise exception 'RESERVED_SLUG' using errcode = 'P0001';
  end if;

  v_country := upper(nullif(btrim(coalesce(p_country, 'NO')), ''));
  if v_country is null then
    v_country := 'NO';
  end if;
  if length(v_country) <> 2 then
    raise exception 'INVALID_COUNTRY' using errcode = 'P0001';
  end if;

  -- Duplicate organization number on ordinary customers only.
  select cu.id
  into v_existing_id
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  where regexp_replace(coalesce(cu.organization_number, ''), '\D', '', 'g') = v_org_number
    and coalesce(co.is_platform, false) = false
    and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
    and cu.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
    and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
  limit 1;

  if v_existing_id is not null then
    raise exception 'DUPLICATE_ORGANIZATION_NUMBER' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.companies c where lower(c.slug) = v_slug
  ) or exists (
    select 1 from public.organizations o where lower(o.slug) = v_slug
  ) or exists (
    select 1 from public.customers cu where lower(coalesce(cu.slug, '')) = v_slug
  ) then
    raise exception 'DUPLICATE_SLUG' using errcode = 'P0001';
  end if;

  insert into public.companies (name, slug, is_platform)
  values (v_display_name, v_slug, false)
  returning id into v_company_id;

  if v_company_id in (
    '2697c432-d03d-44f6-839c-66200fd20b55'::uuid,
    '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
  ) then
    raise exception 'EXCLUDED_IDENTITY' using errcode = 'P0001';
  end if;

  v_customer_number := public.format_customer_number(nextval('public.customer_number_seq'));
  -- Schema requires email NOT NULL; store a non-contact system placeholder only.
  -- Never return this value from Platform Portal APIs.
  v_placeholder_email := 'platform-provisioned+' || v_slug || '@noreply.aipify.internal';

  insert into public.customers (
    customer_number,
    company_id,
    customer_type,
    company_name,
    organization_number,
    email,
    country,
    language,
    status,
    environment_type,
    slug,
    timezone
  ) values (
    v_customer_number,
    v_company_id,
    'company',
    v_legal_name,
    v_org_number,
    v_placeholder_email,
    v_country,
    'en',
    'active',
    'customer',
    v_slug,
    'Europe/Oslo'
  )
  returning id, status, created_at into v_customer_id, v_status, v_created_at;

  if v_customer_id = '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid then
    raise exception 'EXCLUDED_IDENTITY' using errcode = 'P0001';
  end if;

  perform public._mta_sync_organization_from_customer(v_customer_id);

  if not exists (
    select 1 from public.organizations o where o.id = v_customer_id
  ) then
    raise exception 'ORGANIZATION_SYNC_FAILED' using errcode = 'P0001';
  end if;

  begin
    perform public.record_platform_admin_audit_event(
      'platform_customer_created',
      'organization',
      v_customer_id::text,
      jsonb_build_object(
        'company_id', v_company_id,
        'slug', v_slug,
        'organization_number', v_org_number
      )
    );
  exception
    when others then
      -- Audit must not block identity creation after successful writes.
      null;
  end;

  return jsonb_build_object(
    'customer', jsonb_build_object(
      'id', v_customer_id,
      'company_id', v_company_id,
      'name', v_display_name,
      'legal_name', v_legal_name,
      'slug', v_slug,
      'organization_number', v_org_number,
      'status', v_status,
      'created_at', v_created_at
    ),
    'created', jsonb_build_object(
      'company', true,
      'organization', true,
      'customer', true,
      'registration_profile', false,
      'payment_profile', false
    )
  );
end;
$$;

revoke all on function public.create_platform_portal_customer(text, text, text, text, text)
  from public, anon;
grant execute on function public.create_platform_portal_customer(text, text, text, text, text)
  to authenticated;
