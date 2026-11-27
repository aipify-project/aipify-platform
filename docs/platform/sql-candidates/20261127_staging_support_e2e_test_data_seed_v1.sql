-- PREPARED_ONLY — NO_SQL_APPLY / NO_UNAPPROVED_SEED without exact owner YES.
-- Package: AIPIFY_SUPPORT_STAGING_AUTHENTICATED_E2E_V1
-- Target: Staging Core auedugihkduoaikfusqe ONLY
-- Purpose: Minimal reversible tenants for authenticated Support E2E
--          (APP customer A/B, Platform Admin, Growth Partner).
-- Reuses existing auth.users (@example.com CSP fixtures). Does NOT create auth users.
-- Does NOT send email. Does NOT touch Production. Does NOT change #459/#383.
--
-- Companion cleanup:
--   docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql
--
-- APPROVAL TEXT:
-- "JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql
--  SHA256 <see .sha256 sidecar / E2E report> on auedugihkduoaikfusqe only.
--  No email. No Production. No #459. No #383. Cleanup required after E2E."

begin;

-- ---------------------------------------------------------------------------
-- Fixed IDs (all e2e00001-… namespace)
-- ---------------------------------------------------------------------------
-- platform company:  e2e00001-0001-4000-8000-000000000001
-- company A/B:       …00000a1 / …00000b1
-- org+customer A/B:  …00000a2 / …00000b2
-- public.users A/B:  same as auth ids below (id = auth_user_id)
-- platform admin pk: e2e00001-0001-4000-8000-0000000000f1
--
-- Reused auth.users:
--   APP A:    1735d241-630f-4499-a89a-47e72852f766
--   APP B:    16649acd-2e18-49b8-965d-1cb10c54f6a3
--   Platform: 453c883f-4e76-41cf-a92f-959e89414c0e
--   Partner:  629343fb-8774-4b81-a7f2-f61d97a82a8b

-- Minimal switch audit stub (switch_app_organization currently calls this).
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
  -- Staging E2E no-op audit sink. Safe to replace later with full MTA audit.
  return;
end;
$$;

revoke all on function public._mta_create_audit_log(uuid, text, text, uuid) from public, anon, authenticated;

-- Platform company (partner intake + platform tickets)
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

-- public.users.id = auth.users.id (required for some intake created_by paths)
insert into public.users (id, auth_user_id, company_id, full_name, role, created_at)
values
  (
    '1735d241-630f-4499-a89a-47e72852f766',
    '1735d241-630f-4499-a89a-47e72852f766',
    'e2e00001-0001-4000-8000-0000000000a1',
    'E2E APP Owner A [Support E2E]',
    'owner',
    now()
  ),
  (
    '16649acd-2e18-49b8-965d-1cb10c54f6a3',
    '16649acd-2e18-49b8-965d-1cb10c54f6a3',
    'e2e00001-0001-4000-8000-0000000000b1',
    'E2E APP Owner B [Support E2E]',
    'owner',
    now()
  ),
  (
    '453c883f-4e76-41cf-a92f-959e89414c0e',
    '453c883f-4e76-41cf-a92f-959e89414c0e',
    'e2e00001-0001-4000-8000-000000000001',
    'E2E Platform Support [Support E2E]',
    'admin',
    now()
  ),
  (
    '629343fb-8774-4b81-a7f2-f61d97a82a8b',
    '629343fb-8774-4b81-a7f2-f61d97a82a8b',
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
    '1735d241-630f-4499-a89a-47e72852f766',
    'owner',
    'active',
    now(),
    now(),
    now()
  ),
  (
    'e2e00001-0001-4000-8000-0000000000b2',
    '16649acd-2e18-49b8-965d-1cb10c54f6a3',
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
    '1735d241-630f-4499-a89a-47e72852f766',
    'e2e00001-0001-4000-8000-0000000000a2',
    now()
  ),
  (
    '16649acd-2e18-49b8-965d-1cb10c54f6a3',
    'e2e00001-0001-4000-8000-0000000000b2',
    now()
  )
on conflict (user_id) do update
set organization_id = excluded.organization_id,
    updated_at = now();

insert into public.platform_admins (id, auth_user_id, role, status, created_at)
values (
  'e2e00001-0001-4000-8000-0000000000f1',
  '453c883f-4e76-41cf-a92f-959e89414c0e',
  'platform_support',
  'active',
  now()
)
on conflict (auth_user_id) do update
set role = 'platform_support',
    status = 'active';

-- Temporarily activate existing terminated partner profile for partner auth user.
-- Cleanup restores status=terminated and original display_name marker.
update public.csp_partner_profiles
set status = 'approved',
    display_name = 'E2E Growth Partner [Support E2E]',
    updated_at = now()
where auth_user_id = '629343fb-8774-4b81-a7f2-f61d97a82a8b'::uuid;

commit;
