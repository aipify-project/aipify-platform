-- Phase A.32 — Operations Center Foundation Engine

create table if not exists public.operations_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_module text not null,
  category text not null check (category in ('support', 'approvals', 'security', 'integrations', 'quality', 'knowledge', 'onboarding', 'governance')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  title text not null,
  description text,
  action_required boolean not null default false,
  assigned_to uuid references public.users (id) on delete set null,
  status text not null default 'new' check (status in ('new', 'acknowledged', 'in_progress', 'completed', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists operations_events_org_status_idx
  on public.operations_events (organization_id, status, priority, created_at desc);

alter table public.operations_events enable row level security;
revoke all on public.operations_events from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'operations_center_foundation', v.description
from (values
  ('operations.view', 'View Operations', 'View operations center events'),
  ('operations.manage', 'Manage Operations', 'Manage operations center'),
  ('operations.assign', 'Assign Operations', 'Assign operational events'),
  ('operations.resolve', 'Resolve Operations', 'Resolve operational events'),
  ('operations.escalate', 'Escalate Operations', 'Escalate critical events')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

create or replace function public._ocf_log(
  p_organization_id uuid, p_action_type text, p_entity_type text default 'operations_event',
  p_entity_id uuid default null, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata);
end; $$;

create or replace function public._ocf_aggregate_events(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_pending int; v_quality int; v_failed int;
begin
  select count(*) into v_pending from public.admin_tasks
  where organization_id = p_organization_id and status in ('pending', 'overdue');
  if v_pending > 0 and not exists (
    select 1 from public.operations_events where organization_id = p_organization_id and title = 'Pending admin tasks' and status not in ('completed', 'dismissed') and created_at > now() - interval '24 hours'
  ) then
    insert into public.operations_events (organization_id, source_module, category, priority, title, description, action_required)
    values (p_organization_id, 'admin_assistant', 'approvals', case when v_pending > 5 then 'high' else 'medium' end,
      'Pending admin tasks', format('%s tasks need attention', v_pending), true);
  end if;

  select count(*) into v_quality from public.quality_checks
  where organization_id = p_organization_id and status = 'open' and severity in ('high', 'critical');
  if v_quality > 0 then
    insert into public.operations_events (organization_id, source_module, category, priority, title, action_required)
    select p_organization_id, 'quality_guardian', 'quality', 'high', 'Quality alerts require review', true
    where not exists (select 1 from public.operations_events where organization_id = p_organization_id and source_module = 'quality_guardian' and status = 'new' and created_at > now() - interval '12 hours');
  end if;

  select count(*) into v_failed from public.organization_integrations
  where organization_id = p_organization_id and status = 'failed';
  if v_failed > 0 then
    insert into public.operations_events (organization_id, source_module, category, priority, title, action_required)
    select p_organization_id, 'integration_engine', 'integrations', 'critical', 'Integration failures detected', true
    where not exists (select 1 from public.operations_events where organization_id = p_organization_id and source_module = 'integration_engine' and status in ('new', 'acknowledged', 'in_progress') limit 1);
  end if;
end; $$;

create or replace function public.acknowledge_operations_event(p_event_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('operations.manage');
  v_org_id := public._mta_require_organization();
  update public.operations_events set status = 'acknowledged', updated_at = now()
  where id = p_event_id and organization_id = v_org_id;
  perform public._ocf_log(v_org_id, 'operations_event_acknowledged', 'operations_event', p_event_id, '{}'::jsonb);
  return jsonb_build_object('id', p_event_id, 'status', 'acknowledged');
end; $$;

create or replace function public.resolve_operations_event(p_event_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('operations.resolve');
  v_org_id := public._mta_require_organization();
  update public.operations_events set status = 'completed', updated_at = now()
  where id = p_event_id and organization_id = v_org_id;
  perform public._ocf_log(v_org_id, 'operations_event_resolved', 'operations_event', p_event_id, '{}'::jsonb);
  return jsonb_build_object('id', p_event_id, 'status', 'completed');
end; $$;

create or replace function public.get_operations_center_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_role text;
begin
  perform public._irp_require_permission('operations.view');
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Centralized command center for cross-module operational awareness — action-oriented, role-aware.',
    'principles', jsonb_build_array('Cross-module aggregation', 'Action-oriented design', 'Role-based visibility', 'Escalation for critical events', 'Audit-supported accountability'),
    'summary', jsonb_build_object(
      'urgent', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and priority in ('high', 'critical') and status not in ('completed', 'dismissed')), 0),
      'pending_approvals', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and category = 'approvals' and status not in ('completed', 'dismissed')), 0),
      'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0)
    ),
    'urgent_actions', coalesce((
      select jsonb_agg(row_to_json(e) order by case e.priority when 'critical' then 0 when 'high' then 1 else 2 end, e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.priority in ('high', 'critical') and e.status not in ('completed', 'dismissed') limit 10
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status not in ('completed', 'dismissed') limit 25
    ), '[]'::jsonb),
    'recent_completed', coalesce((
      select jsonb_agg(row_to_json(e) order by e.updated_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status = 'completed' limit 10
    ), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_operations_center_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0),
    'philosophy', 'One place for operational coordination.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'operations-center-foundation-engine', 'Operations Center Foundation', 'Cross-module operational command center.', 'authenticated', 74
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'operations-center-foundation-engine' and tenant_id is null);

grant execute on function public.get_operations_center_foundation_engine_dashboard() to authenticated;
grant execute on function public.get_operations_center_foundation_engine_card() to authenticated;
grant execute on function public.acknowledge_operations_event(uuid) to authenticated;
grant execute on function public.resolve_operations_event(uuid) to authenticated;
