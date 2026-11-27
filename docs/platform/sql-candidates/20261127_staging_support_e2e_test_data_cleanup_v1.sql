-- PREPARED_ONLY — apply after E2E to reverse seed.
-- Package: AIPIFY_SUPPORT_STAGING_AUTHENTICATED_E2E_V1
-- Target: Staging Core auedugihkduoaikfusqe ONLY
-- Deletes only E2E-tagged rows / fixed UUIDs from the seed package.
-- Restores partner profile 629343fb… to terminated.
-- Leaves _mta_create_audit_log stub in place unless explicitly dropped below.

begin;

-- Support artefacts created during E2E (by company / partner / creator)
delete from public.app_portal_support_request_messages m
using public.app_portal_support_requests r
where m.request_id = r.id
  and (
    r.company_id in (
      'e2e00001-0001-4000-8000-000000000001',
      'e2e00001-0001-4000-8000-0000000000a1',
      'e2e00001-0001-4000-8000-0000000000b1'
    )
    or r.partner_id in (
      select p.id from public.csp_partner_profiles p
      where p.auth_user_id = '629343fb-8774-4b81-a7f2-f61d97a82a8b'::uuid
    )
    or r.created_by in (
      '1735d241-630f-4499-a89a-47e72852f766'::uuid,
      '16649acd-2e18-49b8-965d-1cb10c54f6a3'::uuid,
      '629343fb-8774-4b81-a7f2-f61d97a82a8b'::uuid
    )
  );

delete from public.platform_support_ticket_messages tm
using public.app_portal_support_requests r
where tm.ticket_id = r.id
  and r.company_id in (
    'e2e00001-0001-4000-8000-000000000001',
    'e2e00001-0001-4000-8000-0000000000a1',
    'e2e00001-0001-4000-8000-0000000000b1'
  );

delete from public.platform_support_ticket_admin_audit a
using public.app_portal_support_requests r
where a.ticket_id = r.id
  and r.company_id in (
    'e2e00001-0001-4000-8000-000000000001',
    'e2e00001-0001-4000-8000-0000000000a1',
    'e2e00001-0001-4000-8000-0000000000b1'
  );

delete from public.platform_support_public_reply_idempotency i
where i.ticket_id in (
  select r.id from public.app_portal_support_requests r
  where r.company_id in (
    'e2e00001-0001-4000-8000-000000000001',
    'e2e00001-0001-4000-8000-0000000000a1',
    'e2e00001-0001-4000-8000-0000000000b1'
  )
);

delete from public.platform_support_intake_idempotency i
where i.ticket_id in (
  select r.id from public.app_portal_support_requests r
  where r.company_id in (
    'e2e00001-0001-4000-8000-000000000001',
    'e2e00001-0001-4000-8000-0000000000a1',
    'e2e00001-0001-4000-8000-0000000000b1'
  )
);

delete from public.app_portal_support_request_audit_logs l
using public.app_portal_support_requests r
where l.request_id = r.id
  and r.company_id in (
    'e2e00001-0001-4000-8000-000000000001',
    'e2e00001-0001-4000-8000-0000000000a1',
    'e2e00001-0001-4000-8000-0000000000b1'
  );

delete from public.app_portal_support_requests
where company_id in (
  'e2e00001-0001-4000-8000-000000000001',
  'e2e00001-0001-4000-8000-0000000000a1',
  'e2e00001-0001-4000-8000-0000000000b1'
);

delete from public.organization_user_context
where user_id in (
  '1735d241-630f-4499-a89a-47e72852f766'::uuid,
  '16649acd-2e18-49b8-965d-1cb10c54f6a3'::uuid
);

delete from public.organization_users
where organization_id in (
  'e2e00001-0001-4000-8000-0000000000a2',
  'e2e00001-0001-4000-8000-0000000000b2'
);

delete from public.platform_admins
where id = 'e2e00001-0001-4000-8000-0000000000f1'
   or auth_user_id = '453c883f-4e76-41cf-a92f-959e89414c0e'::uuid;

delete from public.users
where id in (
  '1735d241-630f-4499-a89a-47e72852f766'::uuid,
  '16649acd-2e18-49b8-965d-1cb10c54f6a3'::uuid,
  '453c883f-4e76-41cf-a92f-959e89414c0e'::uuid,
  '629343fb-8774-4b81-a7f2-f61d97a82a8b'::uuid
);

delete from public.customers
where id in (
  'e2e00001-0001-4000-8000-0000000000a2',
  'e2e00001-0001-4000-8000-0000000000b2'
);

delete from public.organizations
where id in (
  'e2e00001-0001-4000-8000-0000000000a2',
  'e2e00001-0001-4000-8000-0000000000b2'
);

delete from public.companies
where id in (
  'e2e00001-0001-4000-8000-000000000001',
  'e2e00001-0001-4000-8000-0000000000a1',
  'e2e00001-0001-4000-8000-0000000000b1'
);

update public.csp_partner_profiles
set status = 'terminated',
    display_name = 'V6 Fixture NoCert [v6 cleaned]',
    updated_at = now()
where auth_user_id = '629343fb-8774-4b81-a7f2-f61d97a82a8b'::uuid;

-- Optional: remove E2E audit stub (commented — leave if other Staging work needs it)
-- drop function if exists public._mta_create_audit_log(uuid, text, text, uuid);

commit;
