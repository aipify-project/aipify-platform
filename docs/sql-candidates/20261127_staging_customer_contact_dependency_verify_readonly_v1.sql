-- READ-ONLY verification probes — safe to run on Staging before/after dependency sync.
-- Task: AIPIFY_CUSTOMER360_STAGING_DEPENDENCY_PREFLIGHT_V1
-- Project: auedugihkduoaikfusqe
-- Does not INSERT/UPDATE/DELETE/DDL.

-- Expected AFTER successful dependency sync (all detail = true / present):
select 'has_full_name' as probe,
  to_jsonb(exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'customers' and column_name = 'full_name'
  )) as detail
union all
select 'has_phone',
  to_jsonb(exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'customers' and column_name = 'phone'
  ))
union all
select 'has_updated_at',
  to_jsonb(exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'customers' and column_name = 'updated_at'
  ))
union all
select 'updated_at_not_null',
  to_jsonb(exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'customers'
      and column_name = 'updated_at' and is_nullable = 'NO'
  ))
union all
select 'platform_admin_audit_logs_exists',
  to_jsonb(exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'platform_admin_audit_logs'
  ))
union all
select 'audit_rls_enabled',
  to_jsonb((
    select c.relrowsecurity
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'platform_admin_audit_logs'
  ))
union all
select 'audit_select_policy',
  to_jsonb(exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'platform_admin_audit_logs'
      and policyname = 'platform_admin_audit_logs_select'
  ))
union all
select 'audit_insert_policy',
  to_jsonb(exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'platform_admin_audit_logs'
      and policyname = 'platform_admin_audit_logs_insert'
  ))
union all
select 'record_platform_admin_audit_event',
  to_jsonb(exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'record_platform_admin_audit_event'
      and pg_get_function_identity_arguments(p.oid) =
        'p_action_type text, p_target_type text, p_target_id text, p_metadata jsonb'
  ))
union all
select 'is_platform_admin',
  to_jsonb(exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'is_platform_admin'
  ))
union all
select 'contact_rpc_still_absent',
  to_jsonb(not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'update_platform_portal_customer_primary_contact'
  ))
union all
select 'customers_row_count_unchanged_shape',
  to_jsonb((select count(*)::int from public.customers))
union all
select 'platform_admins_count',
  to_jsonb((select count(*)::int from public.platform_admins));
