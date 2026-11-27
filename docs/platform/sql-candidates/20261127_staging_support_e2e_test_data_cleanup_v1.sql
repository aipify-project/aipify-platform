-- PREPARED_ONLY — apply after E2E to reverse seed.
-- Package: AIPIFY_SUPPORT_STAGING_AUTHENTICATED_E2E_V1
-- Target: Staging Core auedugihkduoaikfusqe ONLY
-- Deletes ONLY e2e00001-… synthetic rows created by the seed.
-- Does NOT update/restore any pre-existing CSP seller profiles.
-- Does NOT delete non-E2E companies, orgs, customers, or auth users.
-- Does NOT drop or alter _mta_create_audit_log (seed does not create it).

begin;

-- Support artefacts scoped to E2E companies / synthetic creators / E2E partner
delete from public.app_portal_support_request_messages m
using public.app_portal_support_requests r
where m.request_id = r.id
  and (
    r.company_id in (
      'e2e00001-0001-4000-8000-000000000001',
      'e2e00001-0001-4000-8000-0000000000a1',
      'e2e00001-0001-4000-8000-0000000000b1'
    )
    or r.partner_id = 'e2e00001-0001-4000-8000-0000000000c1'
    or r.created_by in (
      'e2e00001-0001-4000-8000-0000000000a0'::uuid,
      'e2e00001-0001-4000-8000-0000000000b0'::uuid,
      'e2e00001-0001-4000-8000-0000000000c0'::uuid,
      'e2e00001-0001-4000-8000-0000000000f0'::uuid
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
)
or i.actor_key = 'e2e00001-0001-4000-8000-0000000000c1';

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
)
or partner_id = 'e2e00001-0001-4000-8000-0000000000c1';

delete from public.organization_user_context
where user_id in (
  'e2e00001-0001-4000-8000-0000000000a0'::uuid,
  'e2e00001-0001-4000-8000-0000000000b0'::uuid
);

delete from public.organization_users
where organization_id in (
  'e2e00001-0001-4000-8000-0000000000a2',
  'e2e00001-0001-4000-8000-0000000000b2'
)
or user_id in (
  'e2e00001-0001-4000-8000-0000000000a0'::uuid,
  'e2e00001-0001-4000-8000-0000000000b0'::uuid
);

delete from public.csp_partner_profiles
where id = 'e2e00001-0001-4000-8000-0000000000c1'
   or auth_user_id = 'e2e00001-0001-4000-8000-0000000000c0'::uuid;

delete from public.platform_admins
where id = 'e2e00001-0001-4000-8000-0000000000f1'
   or auth_user_id = 'e2e00001-0001-4000-8000-0000000000f0'::uuid;

delete from public.users
where id in (
  'e2e00001-0001-4000-8000-0000000000a0'::uuid,
  'e2e00001-0001-4000-8000-0000000000b0'::uuid,
  'e2e00001-0001-4000-8000-0000000000f0'::uuid,
  'e2e00001-0001-4000-8000-0000000000c0'::uuid
);

-- organizations.id FK → customers(id). Delete organizations before customers.
delete from public.organizations
where id in (
  'e2e00001-0001-4000-8000-0000000000a2',
  'e2e00001-0001-4000-8000-0000000000b2'
);

delete from public.customers
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

delete from auth.identities
where id in (
  'e2e00001-0001-4000-8000-0000000000a9'::uuid,
  'e2e00001-0001-4000-8000-0000000000b9'::uuid,
  'e2e00001-0001-4000-8000-0000000000f9'::uuid,
  'e2e00001-0001-4000-8000-0000000000c9'::uuid
)
or user_id in (
  'e2e00001-0001-4000-8000-0000000000a0'::uuid,
  'e2e00001-0001-4000-8000-0000000000b0'::uuid,
  'e2e00001-0001-4000-8000-0000000000f0'::uuid,
  'e2e00001-0001-4000-8000-0000000000c0'::uuid
);

delete from auth.users
where id in (
  'e2e00001-0001-4000-8000-0000000000a0'::uuid,
  'e2e00001-0001-4000-8000-0000000000b0'::uuid,
  'e2e00001-0001-4000-8000-0000000000f0'::uuid,
  'e2e00001-0001-4000-8000-0000000000c0'::uuid
)
or email in (
  'e2e-support-app-a@example.com',
  'e2e-support-app-b@example.com',
  'e2e-support-platform@example.com',
  'e2e-support-partner@example.com'
);

commit;
