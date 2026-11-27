-- PREPARED_ONLY — NO_SQL_APPLY / NO_UNAPPROVED_SEED without exact owner YES.
-- Package: AIPIFY_SUPPORT_STAGING_AUTHENTICATED_E2E_V1
-- Target: Staging Core auedugihkduoaikfusqe ONLY
-- Purpose: Fully synthetic, reversible tenants for authenticated Support E2E.
-- Creates NEW auth.users + identities + public rows only.
-- Does NOT update/reactivate any existing csp_partner_profiles / sellers.
-- Does NOT send email. Does NOT touch Production. Does NOT change #459/#383.
--
-- Auth (RPC): set_config('request.jwt.claim.sub', <auth_id>, true)
-- Auth (browser optional): email/password below (Staging-only).
-- Password (all four): E2eSupport!StagingOnly2026
--
-- Companion cleanup:
--   docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql
--
-- APPROVAL TEXT:
-- "JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql
--  SHA256 <see .sha256 sidecar / preflight report> on auedugihkduoaikfusqe only.
--  No email. No Production. No #459. No #383. Cleanup required after E2E."

begin;

-- ---------------------------------------------------------------------------
-- Fixed synthetic IDs (e2e00001-… namespace only)
-- ---------------------------------------------------------------------------
-- auth APP A:        e2e00001-0001-4000-8000-0000000000a0
-- auth APP B:        e2e00001-0001-4000-8000-0000000000b0
-- auth Platform:     e2e00001-0001-4000-8000-0000000000f0
-- auth Partner:      e2e00001-0001-4000-8000-0000000000p0
-- identity ids:      …a9 / …b9 / …f9 / …p9
-- platform company:  e2e00001-0001-4000-8000-000000000001
-- company A/B:       …00000a1 / …00000b1
-- org+customer A/B:  …00000a2 / …00000b2
-- partner profile:   e2e00001-0001-4000-8000-0000000000p1
-- platform_admins:   e2e00001-0001-4000-8000-0000000000f1

-- Minimal switch audit stub (switch_app_organization requires this).
create or replace function public._mta_create_audit_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text,
  p_entity_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  return;
end;
$$;

revoke all on function public._mta_create_audit_log(uuid, text, text, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Synthetic auth.users (new only)
-- ---------------------------------------------------------------------------
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  is_sso_user,
  is_anonymous
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'e2e00001-0001-4000-8000-0000000000a0',
    'authenticated',
    'authenticated',
    'e2e-support-app-a@example.com',
    '$2a$10$cApVDR0ID/XpxlryVavJrOl8SGsHJjuUpF7RymEqNKmxRhS/3vbVS',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"E2E APP Owner A"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e2e00001-0001-4000-8000-0000000000b0',
    'authenticated',
    'authenticated',
    'e2e-support-app-b@example.com',
    '$2a$10$cApVDR0ID/XpxlryVavJrOl8SGsHJjuUpF7RymEqNKmxRhS/3vbVS',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"E2E APP Owner B"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e2e00001-0001-4000-8000-0000000000f0',
    'authenticated',
    'authenticated',
    'e2e-support-platform@example.com',
    '$2a$10$cApVDR0ID/XpxlryVavJrOl8SGsHJjuUpF7RymEqNKmxRhS/3vbVS',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"E2E Platform Support"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e2e00001-0001-4000-8000-0000000000p0',
    'authenticated',
    'authenticated',
    'e2e-support-partner@example.com',
    '$2a$10$cApVDR0ID/XpxlryVavJrOl8SGsHJjuUpF7RymEqNKmxRhS/3vbVS',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"E2E Growth Partner"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  )
on conflict (id) do update
set email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = coalesce(auth.users.email_confirmed_at, excluded.email_confirmed_at),
    updated_at = now();

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at,
  email
)
values
  (
    'e2e00001-0001-4000-8000-0000000000a9',
    'e2e00001-0001-4000-8000-0000000000a0',
    jsonb_build_object(
      'sub', 'e2e00001-0001-4000-8000-0000000000a0',
      'email', 'e2e-support-app-a@example.com',
      'email_verified', true
    ),
    'email',
    'e2e00001-0001-4000-8000-0000000000a0',
    now(),
    now(),
    now(),
    'e2e-support-app-a@example.com'
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b9',
    'e2e00001-0001-4000-8000-0000000000b0',
    jsonb_build_object(
      'sub', 'e2e00001-0001-4000-8000-0000000000b0',
      'email', 'e2e-support-app-b@example.com',
      'email_verified', true
    ),
    'email',
    'e2e00001-0001-4000-8000-0000000000b0',
    now(),
    now(),
    now(),
    'e2e-support-app-b@example.com'
  ),
  (
    'e2e00001-0001-4000-8000-0000000000f9',
    'e2e00001-0001-4000-8000-0000000000f0',
    jsonb_build_object(
      'sub', 'e2e00001-0001-4000-8000-0000000000f0',
      'email', 'e2e-support-platform@example.com',
      'email_verified', true
    ),
    'email',
    'e2e00001-0001-4000-8000-0000000000f0',
    now(),
    now(),
    now(),
    'e2e-support-platform@example.com'
  ),
  (
    'e2e00001-0001-4000-8000-0000000000p9',
    'e2e00001-0001-4000-8000-0000000000p0',
    jsonb_build_object(
      'sub', 'e2e00001-0001-4000-8000-0000000000p0',
      'email', 'e2e-support-partner@example.com',
      'email_verified', true
    ),
    'email',
    'e2e00001-0001-4000-8000-0000000000p0',
    now(),
    now(),
    now(),
    'e2e-support-partner@example.com'
  )
on conflict (id) do update
set email = excluded.email,
    identity_data = excluded.identity_data,
    updated_at = now();

-- ---------------------------------------------------------------------------
-- Companies / orgs / customers
-- ---------------------------------------------------------------------------
insert into public.companies (id, name, slug, is_platform, created_at)
values (
  'e2e00001-0001-4000-8000-000000000001',
  'E2E Platform Company [Support E2E]',
  'e2e-support-platform',
  true,
  now()
)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    is_platform = true;

insert into public.companies (id, name, slug, is_platform, created_at)
values
  (
    'e2e00001-0001-4000-8000-0000000000a1',
    'E2E Customer A [Support E2E]',
    'e2e-support-customer-a',
    false,
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b1',
    'E2E Customer B [Support E2E]',
    'e2e-support-customer-b',
    false,
    now()
  )
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    is_platform = false;

insert into public.organizations (
  id, name, slug, status, subscription_plan, default_language, fallback_language, timezone
)
values
  (
    'e2e00001-0001-4000-8000-0000000000a2',
    'E2E Org A [Support E2E]',
    'e2e-support-org-a',
    'active',
    'business',
    'en',
    'en',
    'UTC'
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b2',
    'E2E Org B [Support E2E]',
    'e2e-support-org-b',
    'active',
    'business',
    'en',
    'en',
    'UTC'
  )
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    status = 'active',
    subscription_plan = 'business';

insert into public.customers (id, company_id, full_name, updated_at)
values
  (
    'e2e00001-0001-4000-8000-0000000000a2',
    'e2e00001-0001-4000-8000-0000000000a1',
    'E2E Customer A [Support E2E]',
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b2',
    'e2e00001-0001-4000-8000-0000000000b1',
    'E2E Customer B [Support E2E]',
    now()
  )
on conflict (id) do update
set company_id = excluded.company_id,
    full_name = excluded.full_name,
    updated_at = now();

-- public.users.id = auth.users.id
insert into public.users (id, auth_user_id, company_id, full_name, role, created_at)
values
  (
    'e2e00001-0001-4000-8000-0000000000a0',
    'e2e00001-0001-4000-8000-0000000000a0',
    'e2e00001-0001-4000-8000-0000000000a1',
    'E2E APP Owner A [Support E2E]',
    'owner',
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b0',
    'e2e00001-0001-4000-8000-0000000000b0',
    'e2e00001-0001-4000-8000-0000000000b1',
    'E2E APP Owner B [Support E2E]',
    'owner',
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000f0',
    'e2e00001-0001-4000-8000-0000000000f0',
    'e2e00001-0001-4000-8000-000000000001',
    'E2E Platform Support [Support E2E]',
    'admin',
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000p0',
    'e2e00001-0001-4000-8000-0000000000p0',
    'e2e00001-0001-4000-8000-000000000001',
    'E2E Growth Partner [Support E2E]',
    'staff',
    now()
  )
on conflict (id) do update
set company_id = excluded.company_id,
    full_name = excluded.full_name,
    role = excluded.role;

insert into public.organization_users (
  organization_id, user_id, role, status, joined_at, created_at, updated_at
)
values
  (
    'e2e00001-0001-4000-8000-0000000000a2',
    'e2e00001-0001-4000-8000-0000000000a0',
    'owner',
    'active',
    now(),
    now(),
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b2',
    'e2e00001-0001-4000-8000-0000000000b0',
    'owner',
    'active',
    now(),
    now(),
    now()
  )
on conflict (organization_id, user_id) do update
set role = excluded.role,
    status = 'active',
    updated_at = now();

insert into public.organization_user_context (user_id, organization_id, updated_at)
values
  (
    'e2e00001-0001-4000-8000-0000000000a0',
    'e2e00001-0001-4000-8000-0000000000a2',
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b0',
    'e2e00001-0001-4000-8000-0000000000b2',
    now()
  )
on conflict (user_id) do update
set organization_id = excluded.organization_id,
    updated_at = now();

insert into public.platform_admins (id, auth_user_id, role, status, created_at)
values (
  'e2e00001-0001-4000-8000-0000000000f1',
  'e2e00001-0001-4000-8000-0000000000f0',
  'platform_support',
  'active',
  now()
)
on conflict (auth_user_id) do update
set role = 'platform_support',
    status = 'active';

-- NEW synthetic Growth Partner only — never updates existing seller rows.
insert into public.csp_partner_profiles (
  id,
  auth_user_id,
  display_name,
  country,
  status,
  created_at,
  updated_at
)
values (
  'e2e00001-0001-4000-8000-0000000000p1',
  'e2e00001-0001-4000-8000-0000000000p0',
  'E2E Growth Partner [Support E2E]',
  'NO',
  'approved',
  now(),
  now()
)
on conflict (id) do update
set display_name = excluded.display_name,
    status = 'approved',
    updated_at = now();

commit;
