-- Phase 620 P1 — Compliance dashboard read-only GET repair.

insert into public.retention_policies_trust_legacy (tenant_id, data_category, retention_days, action_on_expiry)
select c.id, v.data_category, v.retention_days, v.action_on_expiry
from public.customers c
cross join (values
  ('support_logs', 365, 'anonymize'),
  ('audit_logs', 2555, 'archive'),
  ('knowledge_search_logs', 180, 'delete'),
  ('memory_preferences', 365, 'review'),
  ('agent_job_results', 30, 'delete'),
  ('quality_scan_snapshots', 180, 'delete'),
  ('desktop_notification_history', 90, 'delete'),
  ('briefing_events', 180, 'delete'),
  ('security_incidents', 2555, 'archive'),
  ('secrets_metadata', 365, 'review')
) as v(data_category, retention_days, action_on_expiry)
where exists (
  select 1
  from information_schema.tables t
  where t.table_schema = 'public'
    and t.table_name = 'retention_policies_trust_legacy'
)
and not exists (
  select 1
  from public.retention_policies_trust_legacy r
  where r.tenant_id = c.id
    and r.data_category = v.data_category
)
on conflict (tenant_id, data_category) do nothing;

create or replace function public.get_compliance_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_privacy jsonb;
  v_retention jsonb;
  v_reports jsonb;
  v_retention_table text;
  v_retention_count bigint;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if to_regclass('public.retention_policies_trust_legacy') is not null then
    v_retention_table := 'retention_policies_trust_legacy';
  else
    v_retention_table := 'retention_policies';
  end if;

  select coalesce(jsonb_agg(row_to_json(p)::jsonb order by p.created_at desc), '[]'::jsonb)
  into v_privacy
  from (
    select *
    from public.privacy_requests
    where tenant_id = v_tenant_id
    order by created_at desc
    limit 10
  ) p;

  execute format(
    $sql$
      select coalesce(jsonb_agg(row_to_json(r)::jsonb order by r.data_category), '[]'::jsonb)
      from public.%I r
      where r.tenant_id = $1
    $sql$,
    v_retention_table
  )
  into v_retention
  using v_tenant_id;

  execute format(
    $sql$
      select count(*)
      from public.%I
      where tenant_id = $1
        and enabled
    $sql$,
    v_retention_table
  )
  into v_retention_count
  using v_tenant_id;

  select coalesce(jsonb_agg(row_to_json(c)::jsonb order by c.created_at desc), '[]'::jsonb)
  into v_reports
  from (
    select *
    from public.compliance_reports
    where tenant_id = v_tenant_id
    order by created_at desc
    limit 5
  ) c;

  return jsonb_build_object(
    'has_customer', true,
    'privacy_pending', (
      select count(*)
      from public.privacy_requests
      where tenant_id = v_tenant_id
        and status not in ('completed', 'rejected', 'cancelled')
    ),
    'retention_policies_count', v_retention_count,
    'privacy_requests', v_privacy,
    'retention_policies', v_retention,
    'compliance_reports', v_reports,
    'deployment_mode', (
      select deployment_mode
      from public.tenant_deployment_settings
      where tenant_id = v_tenant_id
    )
  );
end;
$$;

grant execute on function public.get_compliance_dashboard() to authenticated;
