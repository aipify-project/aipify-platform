-- =============================================================================
-- VERIFY HARNESS ONLY — run via execute_sql AFTER Staging apply of foundation +
-- read RPCs + staging batch. Not a schema migration. Clean up test rows at end.
-- Target: auedugihkduoaikfusqe
-- =============================================================================

-- A) Object presence
select to_regclass('public.companies') as companies,
       to_regclass('public.users') as users,
       to_regclass('public.app_portal_support_requests') as tickets,
       to_regclass('public.app_portal_support_request_audit_logs') as audit_logs,
       to_regclass('public.platform_support_ticket_messages') as messages,
       to_regclass('public.platform_support_signatures') as signatures,
       to_regclass('public.platform_support_reply_templates') as templates;

select p.proname
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    '_ppsf258_require_platform_access',
    'list_platform_app_portal_support_requests',
    'get_platform_app_portal_support_request',
    'get_platform_app_portal_support_request_counts',
    'platform_support_post_internal_note',
    'platform_support_post_external_reply_draft',
    'platform_support_update_ticket_status',
    'platform_support_assign_ticket'
  )
order by 1;

-- B) Table privileges: authenticated must NOT have direct table DML/SELECT
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'app_portal_support_requests',
    'app_portal_support_request_audit_logs',
    'platform_support_ticket_messages',
    'platform_support_signatures',
    'platform_support_reply_templates',
    'platform_support_ticket_admin_audit',
    'platform_support_guest_contacts'
  )
  and grantee in ('anon', 'authenticated', 'PUBLIC')
order by 1, 2, 3;

-- C) Function execute: anon must not have execute on Support Center RPCs
select p.proname,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'list_platform_app_portal_support_requests',
    'get_platform_app_portal_support_request',
    'get_platform_app_portal_support_request_counts',
    'platform_support_post_internal_note',
    'platform_support_post_external_reply_draft',
    'platform_support_update_ticket_status',
    'platform_support_assign_ticket',
    '_ppsf258_require_platform_access'
  )
order by 1;

-- D) Disposable isolation fixtures (cleanup mandatory)
-- Insert two non-platform companies + tickets; assert list does not mix when filtered.
-- (Actual RPC calls require an authenticated JWT of a platform_admin — run from app session
--  or set local role carefully. Prefer application-level tests with platform_support user.)

select 'VERIFY_HARNESS_READY' as marker;
