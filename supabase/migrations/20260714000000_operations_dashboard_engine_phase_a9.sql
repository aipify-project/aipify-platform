-- Phase A.9 — Operations Dashboard Engine
-- Principle: unified operational visibility — role-aware widgets, alerts, and organization health.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. dashboard_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.dashboard_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  widget_key text not null check (
    widget_key in (
      'since_last_login', 'pending_tasks', 'pending_approvals', 'support_overview',
      'recent_notifications', 'ai_recommendations', 'integration_health',
      'knowledge_center_status', 'audit_activity', 'organization_health_score'
    )
  ),
  enabled boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, widget_key)
);

create index if not exists dashboard_preferences_org_user_idx
  on public.dashboard_preferences (organization_id, user_id, display_order);

alter table public.dashboard_preferences enable row level security;
revoke all on public.dashboard_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_notifications
-- ---------------------------------------------------------------------------
create table if not exists public.organization_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  notification_type text not null check (
    notification_type in (
      'system', 'approval', 'support', 'integration', 'knowledge', 'alert', 'onboarding', 'task'
    )
  ),
  title text not null,
  message text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists organization_notifications_org_idx
  on public.organization_notifications (organization_id, user_id, created_at desc);

alter table public.organization_notifications enable row level security;
revoke all on public.organization_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. operations_alerts
-- ---------------------------------------------------------------------------
create table if not exists public.operations_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alert_type text not null check (
    alert_type in (
      'integration_failure', 'approval_backlog', 'support_escalation',
      'knowledge_gap', 'security_event', 'health_degraded', 'onboarding_stalled'
    )
  ),
  severity text not null default 'moderate' check (
    severity in ('informational', 'moderate', 'high', 'critical')
  ),
  title text not null,
  message text,
  acknowledged_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists operations_alerts_org_idx
  on public.operations_alerts (organization_id, severity, created_at desc);

alter table public.operations_alerts enable row level security;
revoke all on public.operations_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'operations_dashboard', v.description
from (values
  ('dashboard.view', 'View Operations Dashboard', 'Access the operations dashboard'),
  ('dashboard.configure', 'Configure Dashboard', 'Customize dashboard widget layout'),
  ('dashboard.view_alerts', 'View Dashboard Alerts', 'View and manage operational alerts')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'dashboard.view'), ('owner', 'dashboard.configure'), ('owner', 'dashboard.view_alerts'),
  ('administrator', 'dashboard.view'), ('administrator', 'dashboard.configure'), ('administrator', 'dashboard.view_alerts'),
  ('manager', 'dashboard.view'), ('manager', 'dashboard.view_alerts'),
  ('support_agent', 'dashboard.view'), ('support_agent', 'dashboard.view_alerts'),
  ('viewer', 'dashboard.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_ode_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ode_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'operations_dashboard',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ode_user_role(p_organization_id uuid default null)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_role text;
begin
  v_org_id := public._mta_require_organization(p_organization_id);
  select ou.role into v_role
  from public.organization_users ou
  where ou.organization_id = v_org_id
    and ou.user_id = public._mta_app_user_id()
    and ou.status = 'active';
  return coalesce(v_role, 'viewer');
exception when others then
  return 'viewer';
end; $$;

create or replace function public._ode_widgets_for_role(p_role text)
returns text[] language sql immutable as $$
  select case p_role
    when 'owner' then array[
      'since_last_login', 'pending_tasks', 'pending_approvals', 'support_overview',
      'recent_notifications', 'ai_recommendations', 'integration_health',
      'knowledge_center_status', 'audit_activity', 'organization_health_score'
    ]
    when 'administrator' then array[
      'since_last_login', 'pending_tasks', 'pending_approvals', 'support_overview',
      'recent_notifications', 'ai_recommendations', 'integration_health',
      'knowledge_center_status', 'audit_activity', 'organization_health_score'
    ]
    when 'manager' then array[
      'since_last_login', 'pending_tasks', 'pending_approvals', 'support_overview',
      'recent_notifications', 'ai_recommendations', 'knowledge_center_status',
      'organization_health_score'
    ]
    when 'support_agent' then array[
      'since_last_login', 'support_overview', 'recent_notifications', 'knowledge_center_status'
    ]
    else array[
      'since_last_login', 'support_overview', 'knowledge_center_status', 'organization_health_score'
    ]
  end;
$$;

create or replace function public._ode_default_preferences(p_organization_id uuid, p_user_id uuid, p_role text)
returns void language plpgsql security definer set search_path = public as $$
declare v_key text; v_ord int := 0;
begin
  foreach v_key in array public._ode_widgets_for_role(p_role) loop
    insert into public.dashboard_preferences (
      organization_id, user_id, widget_key, enabled, display_order
    ) values (p_organization_id, p_user_id, v_key, true, v_ord)
    on conflict (organization_id, user_id, widget_key) do nothing;
    v_ord := v_ord + 1;
  end loop;
end; $$;

create or replace function public._ode_compute_health_score(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score numeric := 100;
  v_failed int;
  v_pending int;
  v_critical int;
  v_open_support int;
  v_status text;
begin
  select count(*) into v_failed
  from public.organization_integrations
  where organization_id = p_organization_id and status = 'failed';

  select count(*) into v_pending
  from public.ai_action_requests
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_critical
  from public.operations_alerts
  where organization_id = p_organization_id
    and severity = 'critical'
    and dismissed_at is null
    and acknowledged_at is null;

  select count(*) into v_open_support
  from public.organization_support_cases
  where organization_id = p_organization_id
    and status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal');

  v_score := v_score - (v_failed * 8) - (v_pending * 3) - (v_critical * 15) - least(v_open_support, 5) * 2;
  v_score := greatest(v_score, 0);

  v_status := case
    when v_score >= 90 then 'excellent'
    when v_score >= 75 then 'healthy'
    when v_score >= 50 then 'needs_attention'
    else 'critical'
  end;

  return jsonb_build_object(
    'score', round(v_score, 1),
    'status', v_status,
    'factors', jsonb_build_object(
      'failed_integrations', v_failed,
      'pending_approvals', v_pending,
      'critical_alerts', v_critical,
      'open_support_cases', v_open_support
    )
  );
end; $$;

create or replace function public._ode_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_notifications (
    organization_id, notification_type, title, message
  )
  select p_organization_id, v.ntype, v.title, v.message
  from (values
    ('approval', 'Pending AI action approvals', '2 medium-risk actions await review.'),
    ('support', 'Support queue update', '3 cases require follow-up today.'),
    ('integration', 'Integration sync completed', 'Unonight pilot sync finished successfully.'),
    ('knowledge', 'Knowledge review due', '1 article is past its review date.')
  ) as v(ntype, title, message)
  where not exists (
    select 1 from public.organization_notifications n
    where n.organization_id = p_organization_id and n.title = v.title limit 1
  );

  insert into public.operations_alerts (
    organization_id, alert_type, severity, title, message
  )
  select p_organization_id, v.atype, v.severity, v.title, v.message
  from (values
    ('approval_backlog', 'moderate', 'Approval backlog', 'Multiple AI actions pending administrator review.'),
    ('support_escalation', 'high', 'Escalated support case', 'One case has been open beyond SLA threshold.'),
    ('integration_failure', 'moderate', 'Integration sync warning', 'Knowledge Center import sync is pending activation.'),
    ('health_degraded', 'critical', 'Organization health attention', 'Critical alert requires acknowledgment.')
  ) as v(atype, severity, title, message)
  where not exists (
    select 1 from public.operations_alerts a
    where a.organization_id = p_organization_id and a.title = v.title limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Widget data RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_dashboard_widget_data(p_widget_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_role text;
  v_allowed text[];
begin
  perform public._irp_require_permission('dashboard.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_role := public._ode_user_role(v_org_id);
  v_allowed := public._ode_widgets_for_role(v_role);

  if not (p_widget_key = any(v_allowed)) then
    raise exception 'Widget not available for role';
  end if;

  case p_widget_key
    when 'since_last_login' then
      return jsonb_build_object(
        'since', public._aae_touch_session(v_org_id, v_user_id),
        'unresolved_approvals', coalesce((
          select count(*) from public.ai_action_requests r
          where r.organization_id = v_org_id and r.status = 'pending'
        ), 0),
        'open_support_cases', coalesce((
          select count(*) from public.organization_support_cases c
          where c.organization_id = v_org_id and c.status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal')
        ), 0),
        'pending_tasks', coalesce((
          select count(*) from public.admin_tasks t
          where t.organization_id = v_org_id and t.status in ('open', 'in_progress', 'waiting')
        ), 0),
        'unread_notifications', coalesce((
          select count(*) from public.admin_assistant_notifications n
          where n.organization_id = v_org_id and (n.user_id is null or n.user_id = v_user_id) and n.read_at is null
        ), 0) + coalesce((
          select count(*) from public.organization_notifications n
          where n.organization_id = v_org_id and (n.user_id is null or n.user_id = v_user_id) and n.read_at is null
        ), 0)
      );
    when 'pending_tasks' then
      return jsonb_build_object(
        'total', (select count(*) from public.admin_tasks where organization_id = v_org_id and status in ('open', 'in_progress', 'waiting')),
        'items', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', t.id, 'title', t.title, 'priority', t.priority, 'status', t.status, 'due_date', t.due_date
          ) order by t.priority desc, t.due_date nulls last)
          from public.admin_tasks t
          where t.organization_id = v_org_id and t.status in ('open', 'in_progress', 'waiting')
          limit 10
        ), '[]'::jsonb)
      );
    when 'pending_approvals' then
      return jsonb_build_object(
        'ai_actions', coalesce((
          select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'pending'
        ), 0),
        'support_drafts', coalesce((
          select count(*) from public.support_ai_responses r
          join public.organization_support_cases c on c.id = r.case_id
          where c.organization_id = v_org_id and r.status = 'pending_approval'
        ), 0),
        'items', coalesce((
          select jsonb_agg(x.obj)
          from (
            select jsonb_build_object(
              'id', r.id, 'type', 'ai_action', 'title', r.action_key, 'risk_level', r.risk_level, 'status', r.status, 'created_at', r.created_at
            ) as obj
            from public.ai_action_requests r
            where r.organization_id = v_org_id and r.status = 'pending'
            union all
            select jsonb_build_object(
              'id', sr.id, 'type', 'support_draft', 'title', c.subject, 'risk_level', 'medium', 'status', sr.status, 'created_at', sr.created_at
            )
            from public.support_ai_responses sr
            join public.organization_support_cases c on c.id = sr.case_id
            where c.organization_id = v_org_id and sr.status = 'pending_approval'
          ) x limit 12
        ), '[]'::jsonb)
      );
    when 'support_overview' then
      return jsonb_build_object(
        'open_cases', (select count(*) from public.organization_support_cases where organization_id = v_org_id and status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal')),
        'escalated', (select count(*) from public.organization_support_cases where organization_id = v_org_id and escalated_at is not null and status not in ('resolved', 'closed')),
        'resolved_week', (select count(*) from public.organization_support_cases where organization_id = v_org_id and status in ('resolved', 'closed') and updated_at > now() - interval '7 days'),
        'recent_cases', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', c.id, 'case_number', c.case_number, 'subject', c.subject, 'status', c.status, 'priority', c.priority
          ) order by c.created_at desc)
          from public.organization_support_cases c
          where c.organization_id = v_org_id limit 8
        ), '[]'::jsonb)
      );
    when 'recent_notifications' then
      return jsonb_build_object(
        'unread_count', coalesce((
          select count(*) from (
            select id from public.admin_assistant_notifications
            where organization_id = v_org_id and (user_id is null or user_id = v_user_id) and read_at is null
            union all
            select id from public.organization_notifications
            where organization_id = v_org_id and (user_id is null or user_id = v_user_id) and read_at is null
          ) n
        ), 0),
        'items', coalesce((
          select jsonb_agg(x.obj order by x.created_at desc)
          from (
            select jsonb_build_object(
              'id', n.id, 'source', 'assistant', 'type', n.notification_type, 'title', n.title, 'message', n.body, 'read_at', n.read_at, 'created_at', n.created_at
            ) as obj, n.created_at
            from public.admin_assistant_notifications n
            where n.organization_id = v_org_id and (n.user_id is null or n.user_id = v_user_id)
            union all
            select jsonb_build_object(
              'id', n.id, 'source', 'organization', 'type', n.notification_type, 'title', n.title, 'message', n.message, 'read_at', n.read_at, 'created_at', n.created_at
            ) as obj, n.created_at
            from public.organization_notifications n
            where n.organization_id = v_org_id and (n.user_id is null or n.user_id = v_user_id)
          ) x limit 12
        ), '[]'::jsonb)
      );
    when 'ai_recommendations' then
      return jsonb_build_object(
        'pending_count', (select count(*) from public.admin_assistant_recommendations where organization_id = v_org_id and status = 'pending'),
        'items', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', r.id, 'summary', r.summary, 'urgency', r.urgency, 'category', r.category, 'suggested_next_step', r.suggested_next_step
          ) order by r.urgency desc, r.created_at desc)
          from public.admin_assistant_recommendations r
          where r.organization_id = v_org_id and r.status = 'pending' limit 8
        ), '[]'::jsonb)
      );
    when 'integration_health' then
      return jsonb_build_object(
        'active', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'active' and enabled),
        'failed', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'failed'),
        'pending', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'pending'),
        'integrations', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', i.id, 'integration_key', i.integration_key, 'integration_name', i.integration_name,
            'status', i.status, 'enabled', i.enabled, 'last_sync_at', i.last_sync_at, 'last_error', i.last_error
          ) order by i.integration_name)
          from public.organization_integrations i
          where i.organization_id = v_org_id and i.status <> 'archived'
        ), '[]'::jsonb)
      );
    when 'knowledge_center_status' then
      return jsonb_build_object(
        'published', (select count(*) from public.knowledge_articles where organization_id = v_org_id and status = 'published'),
        'draft', (select count(*) from public.knowledge_articles where organization_id = v_org_id and status = 'draft'),
        'review', (select count(*) from public.knowledge_articles where organization_id = v_org_id and status = 'in_review'),
        'stale', (select count(*) from public.knowledge_articles where organization_id = v_org_id and status = 'published' and review_due_at < now())
      );
    when 'audit_activity' then
      return jsonb_build_object(
        'recent_count', (select count(*) from public.audit_logs where organization_id = v_org_id and created_at > now() - interval '7 days'),
        'items', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', l.id, 'action_type', l.action_type, 'entity_type', l.entity_type,
            'ai_involved', l.ai_involved, 'created_at', l.created_at
          ) order by l.created_at desc)
          from public.audit_logs l
          where l.organization_id = v_org_id limit 12
        ), '[]'::jsonb)
      );
    when 'organization_health_score' then
      return public._ode_compute_health_score(v_org_id);
    else
      raise exception 'Unknown widget key';
  end case;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Preferences & alert RPCs
-- ---------------------------------------------------------------------------
create or replace function public.save_dashboard_preferences(p_preferences jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_role text;
  v_allowed text[];
  v_item jsonb;
  v_key text;
  v_ord int;
begin
  perform public._irp_require_permission('dashboard.configure');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_role := public._ode_user_role(v_org_id);
  v_allowed := public._ode_widgets_for_role(v_role);

  if jsonb_typeof(p_preferences) <> 'array' then
    raise exception 'Preferences must be a JSON array';
  end if;

  for v_item in select * from jsonb_array_elements(p_preferences) loop
    v_key := v_item->>'widget_key';
    v_ord := coalesce((v_item->>'display_order')::int, 0);
    if v_key is null or not (v_key = any(v_allowed)) then
      continue;
    end if;
    insert into public.dashboard_preferences (
      organization_id, user_id, widget_key, enabled, display_order, updated_at
    ) values (
      v_org_id, v_user_id, v_key,
      coalesce((v_item->>'enabled')::boolean, true),
      v_ord, now()
    )
    on conflict (organization_id, user_id, widget_key) do update set
      enabled = excluded.enabled,
      display_order = excluded.display_order,
      updated_at = now();
  end loop;

  perform public._ode_log(v_org_id, 'dashboard_preferences_saved', 'operations_dashboard', null,
    jsonb_build_object('widget_count', jsonb_array_length(p_preferences)));

  return jsonb_build_object('saved', true);
end; $$;

create or replace function public.dismiss_operations_alert(p_alert_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('dashboard.view_alerts');
  v_org_id := public._mta_require_organization();

  update public.operations_alerts set dismissed_at = now()
  where id = p_alert_id and organization_id = v_org_id and dismissed_at is null;

  perform public._ode_log(v_org_id, 'operations_alert_dismissed', 'operations_alert', p_alert_id, '{}'::jsonb);

  return jsonb_build_object('id', p_alert_id, 'dismissed', true);
end; $$;

create or replace function public.acknowledge_critical_alert(p_alert_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_alert public.operations_alerts;
begin
  perform public._irp_require_permission('dashboard.view_alerts');
  v_org_id := public._mta_require_organization();

  select * into v_alert from public.operations_alerts
  where id = p_alert_id and organization_id = v_org_id;

  if v_alert.id is null then raise exception 'Alert not found'; end if;
  if v_alert.severity <> 'critical' then raise exception 'Only critical alerts can be acknowledged'; end if;

  update public.operations_alerts set acknowledged_at = now()
  where id = p_alert_id;

  perform public._ode_log(v_org_id, 'critical_alert_acknowledged', 'operations_alert', p_alert_id,
    jsonb_build_object('severity', v_alert.severity, 'alert_type', v_alert.alert_type));

  return jsonb_build_object('id', p_alert_id, 'acknowledged', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_operations_dashboard_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_role text;
  v_allowed text[];
  v_health jsonb;
begin
  perform public._irp_require_permission('dashboard.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_role := public._ode_user_role(v_org_id);
  v_allowed := public._ode_widgets_for_role(v_role);

  perform public._ige_seed_demo_integrations(v_org_id);
  perform public._aae_seed_demo_content(v_org_id);
  perform public._ode_seed_demo_content(v_org_id);
  perform public._ode_default_preferences(v_org_id, v_user_id, v_role);

  v_health := public._ode_compute_health_score(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'One operational view across support, approvals, integrations, knowledge, and health — role-aware and auditable.',
    'safety_note', 'Dashboard aggregates metadata only. Sensitive content stays in source modules.',
    'principles', jsonb_build_array(
      'Role-based widget visibility',
      'Aggregated cross-module visibility',
      'Configurable personal layout',
      'Operational alerts with acknowledgment',
      'Organization health scoring'
    ),
    'user_role', v_role,
    'allowed_widgets', to_jsonb(v_allowed),
    'preferences', coalesce((
      select jsonb_agg(jsonb_build_object(
        'widget_key', p.widget_key, 'enabled', p.enabled, 'display_order', p.display_order
      ) order by p.display_order)
      from public.dashboard_preferences p
      where p.organization_id = v_org_id and p.user_id = v_user_id and p.widget_key = any(v_allowed)
    ), '[]'::jsonb),
    'widgets', coalesce((
      select jsonb_object_agg(w.key, public.get_dashboard_widget_data(w.key))
      from unnest(v_allowed) as w(key)
      join public.dashboard_preferences p
        on p.organization_id = v_org_id and p.user_id = v_user_id and p.widget_key = w.key and p.enabled
    ), '{}'::jsonb),
    'active_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'severity', a.severity,
        'title', a.title, 'message', a.message, 'acknowledged_at', a.acknowledged_at,
        'dismissed_at', a.dismissed_at, 'created_at', a.created_at
      ) order by case a.severity when 'critical' then 0 when 'high' then 1 when 'moderate' then 2 else 3 end, a.created_at desc)
      from public.operations_alerts a
      where a.organization_id = v_org_id and a.dismissed_at is null limit 12
    ), '[]'::jsonb),
    'organization_health', v_health
  );
end; $$;

create or replace function public.get_operations_dashboard_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_health jsonb;
begin
  v_org_id := public._mta_require_organization();
  v_health := public._ode_compute_health_score(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'health_status', v_health->>'status',
    'health_score', (v_health->>'score')::numeric,
    'active_alerts', (
      select count(*) from public.operations_alerts
      where organization_id = v_org_id and dismissed_at is null and severity in ('high', 'critical')
    ),
    'pending_approvals', (
      select count(*) from public.ai_action_requests
      where organization_id = v_org_id and status = 'pending'
    ),
    'philosophy', 'Unified operational visibility for your organization.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ode_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'operations-dashboard-engine', 'Operations Dashboard Engine', 'Unified operational visibility across Aipify modules.', 'authenticated', 59
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'operations-dashboard-engine' and tenant_id is null);

grant execute on function public.get_dashboard_widget_data(text) to authenticated;
grant execute on function public.save_dashboard_preferences(jsonb) to authenticated;
grant execute on function public.dismiss_operations_alert(uuid) to authenticated;
grant execute on function public.acknowledge_critical_alert(uuid) to authenticated;
grant execute on function public.get_operations_dashboard_engine_dashboard() to authenticated;
grant execute on function public.get_operations_dashboard_engine_card() to authenticated;
