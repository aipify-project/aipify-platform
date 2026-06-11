-- Phase 68 — Orchestration Engine & Cross-Module Coordination Layer

-- ---------------------------------------------------------------------------
-- 1. orchestration_events
-- ---------------------------------------------------------------------------
create table if not exists public.orchestration_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  source_module text not null,
  source_type text not null,
  source_id text,
  event_type text not null,
  severity text not null default 'info' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  priority_score int not null default 0,
  payload jsonb not null default '{}'::jsonb,
  context jsonb not null default '{}'::jsonb,
  status text not null default 'received' check (
    status in ('received', 'processing', 'processed', 'failed', 'ignored', 'blocked')
  ),
  duplicate_count int not null default 1,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);

create index if not exists orchestration_events_tenant_status_idx
  on public.orchestration_events (tenant_id, status, created_at desc);

alter table public.orchestration_events enable row level security;
revoke all on public.orchestration_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. orchestration_rules
-- ---------------------------------------------------------------------------
create table if not exists public.orchestration_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  rule_key text not null,
  name text not null,
  description text,
  enabled boolean not null default true,
  source_module text,
  event_type text not null,
  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high')),
  requires_policy_check boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists orchestration_rules_key_idx
  on public.orchestration_rules (coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid), rule_key);

alter table public.orchestration_rules enable row level security;
revoke all on public.orchestration_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. orchestration_flows
-- ---------------------------------------------------------------------------
create table if not exists public.orchestration_flows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  flow_key text not null,
  name text not null,
  description text,
  trigger_event_id uuid references public.orchestration_events (id) on delete set null,
  rule_id uuid references public.orchestration_rules (id) on delete set null,
  status text not null default 'running' check (
    status in ('pending', 'running', 'waiting_approval', 'completed', 'failed', 'blocked', 'cancelled')
  ),
  current_step text,
  result_summary text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, flow_key)
);

create index if not exists orchestration_flows_tenant_status_idx
  on public.orchestration_flows (tenant_id, status, started_at desc);

alter table public.orchestration_flows enable row level security;
revoke all on public.orchestration_flows from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. orchestration_steps
-- ---------------------------------------------------------------------------
create table if not exists public.orchestration_steps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  flow_id uuid not null references public.orchestration_flows (id) on delete cascade,
  step_order int not null,
  step_key text not null,
  module_key text not null,
  action_key text not null,
  status text not null default 'pending' check (
    status in ('pending', 'running', 'completed', 'failed', 'skipped', 'blocked', 'waiting_approval')
  ),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  policy_decision_id uuid references public.policy_decisions (id) on delete set null,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists orchestration_steps_flow_idx
  on public.orchestration_steps (flow_id, step_order);

alter table public.orchestration_steps enable row level security;
revoke all on public.orchestration_steps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. orchestration_dispatches
-- ---------------------------------------------------------------------------
create table if not exists public.orchestration_dispatches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  flow_id uuid references public.orchestration_flows (id) on delete set null,
  event_id uuid references public.orchestration_events (id) on delete set null,
  target_module text not null,
  dispatch_type text not null,
  status text not null default 'queued' check (
    status in ('queued', 'sent', 'acknowledged', 'failed', 'blocked')
  ),
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists orchestration_dispatches_tenant_idx
  on public.orchestration_dispatches (tenant_id, created_at desc);

alter table public.orchestration_dispatches enable row level security;
revoke all on public.orchestration_dispatches from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. orchestration_settings
-- ---------------------------------------------------------------------------
create table if not exists public.orchestration_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  auto_route_events boolean not null default true,
  require_policy_engine boolean not null default true,
  allow_cross_module_dispatch boolean not null default true,
  max_flow_steps int not null default 20,
  max_parallel_flows int not null default 50,
  notify_on_critical boolean not null default true,
  create_actions_for_high boolean not null default true,
  create_actions_for_medium boolean not null default true,
  suppress_duplicate_events boolean not null default true,
  duplicate_window_minutes int not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orchestration_settings enable row level security;
revoke all on public.orchestration_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. orchestration_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.orchestration_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_id uuid references public.orchestration_events (id) on delete set null,
  flow_id uuid references public.orchestration_flows (id) on delete set null,
  actor_type text not null default 'system',
  action text not null,
  result text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists orchestration_audit_log_tenant_idx
  on public.orchestration_audit_log (tenant_id, created_at desc);

alter table public.orchestration_audit_log enable row level security;
revoke all on public.orchestration_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_orc_)
-- ---------------------------------------------------------------------------
create or replace function public._orc_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._orc_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._orc_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._orc_ensure_settings(p_tenant_id uuid)
returns public.orchestration_settings language plpgsql security definer set search_path = public as $$
declare v_row public.orchestration_settings;
begin
  insert into public.orchestration_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.orchestration_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._orc_log_audit(
  p_tenant_id uuid, p_action text, p_result text default null,
  p_event_id uuid default null, p_flow_id uuid default null,
  p_actor_type text default 'system', p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.orchestration_audit_log (
    tenant_id, event_id, flow_id, actor_type, action, result, metadata
  ) values (
    p_tenant_id, p_event_id, p_flow_id, p_actor_type, p_action, p_result, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, p_actor_type, p_action, 'orchestration', coalesce(p_result, 'logged'), null, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._orc_priority_score(p_severity text, p_requires_approval boolean default false)
returns int language sql immutable as $$
  select (
    case lower(coalesce(p_severity, 'info'))
      when 'critical' then 100
      when 'high' then 80
      when 'medium' then 55
      when 'low' then 30
      else 10
    end
  ) + case when coalesce(p_requires_approval, false) then 15 else 0 end;
$$;

create or replace function public._orc_emergency_stop_active(p_tenant_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public._sec_emergency_stop_active(p_tenant_id);
$$;

create or replace function public._orc_build_event_key(
  p_source_module text, p_event_type text, p_source_id text
)
returns text language sql immutable as $$
  select 'orc.' || coalesce(p_source_module, 'unknown') || '.' || coalesce(p_event_type, 'event')
    || case when p_source_id is not null and p_source_id <> '' then '.' || p_source_id else '' end;
$$;

create or replace function public._orc_rule_matches(
  p_rule public.orchestration_rules,
  p_event public.orchestration_events
)
returns boolean language plpgsql immutable as $$
declare
  v_key text;
  v_val text;
  v_num numeric;
  v_severities jsonb;
begin
  if not p_rule.enabled then return false; end if;
  if p_rule.source_module is not null and p_rule.source_module <> p_event.source_module then return false; end if;
  if p_rule.event_type <> '*' and p_rule.event_type <> p_event.event_type then return false; end if;

  v_severities := p_rule.conditions->'severity';
  if v_severities is not null and jsonb_typeof(v_severities) = 'array' then
    if not (p_event.severity = any(select jsonb_array_elements_text(v_severities))) then return false; end if;
  end if;

  v_val := p_rule.conditions->>'payload_type';
  if v_val is not null and coalesce(p_event.payload->>'type', '') <> v_val then return false; end if;

  v_num := (p_rule.conditions->>'frequency_count_gte')::numeric;
  if v_num is not null then
    if coalesce((p_event.payload->>'frequency_count')::numeric, p_event.duplicate_count::numeric) < v_num then
      return false;
    end if;
  end if;

  v_val := p_rule.conditions->>'severity_min';
  if v_val is not null then
    if public._orc_priority_score(p_event.severity, false)
       < public._orc_priority_score(v_val, false) then return false; end if;
  end if;

  return true;
end; $$;

create or replace function public._orc_policy_action_key(p_dispatch_type text)
returns text language sql immutable as $$
  select case p_dispatch_type
    when 'send_desktop_notification' then 'orchestration_notify'
    when 'create_approval_request' then 'orchestration_approval'
    when 'create_security_incident' then 'orchestration_security'
    when 'record_memory_observation' then 'memory_store'
    when 'create_action_item' then 'orchestration_action'
    else 'orchestration_dispatch'
  end;
$$;

create or replace function public._orc_check_policy(
  p_tenant_id uuid, p_dispatch_type text, p_payload jsonb, p_require boolean
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_result jsonb;
begin
  if not p_require then
    return jsonb_build_object('allow', true, 'blocked', false, 'requires_approval', false, 'decision', 'allowed');
  end if;
  v_result := public.evaluate_policy(jsonb_build_object(
    'action_key', public._orc_policy_action_key(p_dispatch_type),
    'resource_type', 'orchestration',
    'actor_type', 'aipify_ai',
    'data_classification', coalesce(p_payload->>'data_classification', 'internal'),
    'context', p_payload
  ));
  return v_result;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Seed global rules
-- ---------------------------------------------------------------------------
create or replace function public._orc_seed_global_rules()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.orchestration_rules (tenant_id, rule_key, name, description, source_module, event_type, conditions, actions, risk_level)
  values
    (null, 'quality_critical_incident', 'Quality critical incident',
     'Route critical quality incidents to Action Center, Desktop, Briefing, and developer report.',
     'quality', 'quality.incident.created',
     '{"severity": ["critical", "high"]}'::jsonb,
     '[
       {"action":"create_action_item","priority":"critical","title_template":"Critical quality issue: {{title}}"},
       {"action":"send_desktop_notification","severity":"critical","title_template":"Critical quality issue"},
       {"action":"add_to_briefing","severity":"high","title_template":"Quality incident requires attention"},
       {"action":"generate_developer_report"},
       {"action":"audit_only"}
     ]'::jsonb, 'medium'),
    (null, 'support_low_confidence', 'Support low confidence answer',
     'Create knowledge gap and escalation when support confidence is low.',
     'support', 'support.low_confidence_answer', '{}'::jsonb,
     '[
       {"action":"create_knowledge_gap"},
       {"action":"create_support_escalation"},
       {"action":"create_action_item","priority":"medium","title_template":"Review low-confidence support answer"},
       {"action":"send_learning_event","event_type":"support_answer_unhelpful"}
     ]'::jsonb, 'low'),
    (null, 'knowledge_gap_repeated', 'Repeated knowledge gap',
     'Escalate frequently repeated knowledge gaps to article tasks.',
     'knowledge', 'knowledge.gap.created',
     '{"frequency_count_gte": 3}'::jsonb,
     '[
       {"action":"create_action_item","priority":"medium","title_template":"Draft FAQ for repeated knowledge gap"},
       {"action":"add_to_briefing","severity":"medium","title_template":"Repeated knowledge gap detected"},
       {"action":"send_learning_event","event_type":"knowledge_gap_resolved"}
     ]'::jsonb, 'low'),
    (null, 'agent_offline', 'Enterprise agent offline',
     'Notify admins when an enterprise agent goes offline.',
     'enterprise', 'agent.offline', '{}'::jsonb,
     '[
       {"action":"create_security_incident","severity":"high"},
       {"action":"create_action_item","priority":"high","title_template":"Enterprise agent offline"},
       {"action":"add_to_briefing","severity":"high","title_template":"Agent offline — check connectivity"},
       {"action":"audit_only"}
     ]'::jsonb, 'medium'),
    (null, 'automation_suggestion', 'Automation suggestion',
     'Route automation suggestions through approval when medium/high risk.',
     'automation', 'automation.suggestion.created',
     '{"severity_min": "medium"}'::jsonb,
     '[
       {"action":"create_approval_request","risk_level":"medium"},
       {"action":"create_action_item","priority":"medium","title_template":"Review automation suggestion"},
       {"action":"add_to_briefing","severity":"medium","title_template":"New automation suggestion"},
       {"action":"link_knowledge_article","category":"adaptive-automation"}
     ]'::jsonb, 'high'),
    (null, 'governance_emergency_stop', 'Emergency stop enabled',
     'Audit when Emergency Stop is activated.',
     'governance', 'governance.emergency_stop.enabled', '{}'::jsonb,
     '[{"action":"audit_only"},{"action":"add_to_briefing","severity":"critical","title_template":"Emergency Stop activated"}]'::jsonb,
     'low'),
    (null, 'security_incident_created', 'Security incident orchestration',
     'Route new security incidents to Action Center and Briefing.',
     'security', 'security.incident.created',
     '{"severity_min": "medium"}'::jsonb,
     '[
       {"action":"create_action_item","priority":"high","title_template":"Security incident: {{title}}"},
       {"action":"add_to_briefing","severity":"high","title_template":"Security incident opened"},
       {"action":"send_desktop_notification","severity":"high","title_template":"Security incident"}
     ]'::jsonb, 'medium')
  on conflict do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Dispatch executor
-- ---------------------------------------------------------------------------
create or replace function public._orc_execute_dispatch(
  p_tenant_id uuid,
  p_flow_id uuid,
  p_event_id uuid,
  p_step_id uuid,
  p_action jsonb,
  p_event public.orchestration_events,
  p_require_policy boolean
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text;
  v_dispatch_id uuid;
  v_policy jsonb;
  v_title text;
  v_action_key text;
  v_action_id uuid;
  v_gap_id uuid;
  v_incident_id uuid;
  v_approval_id uuid;
  v_result jsonb := '{}'::jsonb;
  v_status text := 'sent';
begin
  v_action := coalesce(p_action->>'action', 'audit_only');

  insert into public.orchestration_dispatches (
    tenant_id, flow_id, event_id, target_module, dispatch_type, status, payload
  ) values (
    p_tenant_id, p_flow_id, p_event_id,
    coalesce(p_action->>'module', 'orchestration'), v_action, 'queued', p_action
  ) returning id into v_dispatch_id;

  v_policy := public._orc_check_policy(p_tenant_id, v_action, p_action, p_require_policy);
  if coalesce((v_policy->>'blocked')::boolean, false) then
    update public.orchestration_dispatches set status = 'blocked', result = v_policy, completed_at = now()
    where id = v_dispatch_id;
    update public.orchestration_steps set status = 'blocked', output = v_policy, completed_at = now() where id = p_step_id;
    return jsonb_build_object('status', 'blocked', 'policy', v_policy);
  end if;

  if coalesce((v_policy->>'requires_approval')::boolean, false) and v_action not in ('create_approval_request', 'audit_only', 'suppress_duplicate') then
    insert into public.aipify_approval_requests (
      tenant_id, action_type, title, summary, risk_level, explanation, source_type, source_id, requested_by_ai, metadata
    ) values (
      p_tenant_id, 'orchestration_' || v_action,
      'Orchestration action requires approval',
      coalesce(p_action->>'title_template', v_action),
      coalesce(p_action->>'risk_level', 'medium'),
      coalesce(v_policy->>'reason', 'Policy engine requires approval'),
      'governance', p_flow_id, true,
      jsonb_build_object('dispatch_id', v_dispatch_id, 'event_id', p_event_id)
    ) returning id into v_approval_id;
    update public.orchestration_flows set status = 'waiting_approval', updated_at = now() where id = p_flow_id;
    update public.orchestration_steps set status = 'waiting_approval', output = jsonb_build_object('approval_id', v_approval_id)
    where id = p_step_id;
    update public.orchestration_dispatches set status = 'blocked', result = jsonb_build_object('approval_id', v_approval_id), completed_at = now()
    where id = v_dispatch_id;
    return jsonb_build_object('status', 'waiting_approval', 'approval_id', v_approval_id);
  end if;

  v_title := coalesce(
    replace(replace(p_action->>'title_template', '{{title}}', coalesce(p_event.payload->>'title', p_event.event_type)), '{{type}}', coalesce(p_event.payload->>'type', '')),
    p_event.event_type
  );

  case v_action
    when 'create_action_item' then
      v_action_key := 'orc.' || p_event.event_key || '.' || v_action;
      v_action_id := public._ach_upsert_item(
        p_tenant_id, v_action_key, v_title,
        coalesce(p_event.payload->>'summary', p_event.payload->>'description', 'Orchestrated follow-up required'),
        p_event.source_module, p_event.source_type, nullif(p_event.source_id, '')::uuid,
        coalesce(p_action->>'action_type', 'orchestration'),
        p_event.severity, coalesce(p_action->>'priority', p_event.severity),
        coalesce(p_action->>'recommended_owner', 'admin'), null,
        coalesce(p_action->>'action_url', '/app/actions'),
        coalesce((p_action->>'requires_approval')::boolean, false),
        'Created by Orchestration Engine',
        jsonb_build_object('orchestration_event_id', p_event_id, 'flow_id', p_flow_id)
      );
      v_result := jsonb_build_object('action_item_id', v_action_id);

    when 'create_approval_request' then
      insert into public.aipify_approval_requests (
        tenant_id, action_type, title, summary, risk_level, explanation, source_type, source_id, requested_by_ai, metadata
      ) values (
        p_tenant_id, coalesce(p_action->>'action_type', 'orchestration'),
        v_title, coalesce(p_event.payload->>'summary', v_title),
        coalesce(p_action->>'risk_level', 'medium'),
        'Orchestration approval request',
        'governance', p_flow_id, true,
        jsonb_build_object('event_id', p_event_id, 'event_type', p_event.event_type)
      ) returning id into v_approval_id;
      update public.orchestration_flows set status = 'waiting_approval', updated_at = now() where id = p_flow_id;
      v_result := jsonb_build_object('approval_id', v_approval_id);

    when 'send_desktop_notification' then
      perform public._dk_upsert_event(
        p_tenant_id, 'orchestration', p_event.source_type, nullif(p_event.source_id, '')::uuid,
        'orc.desktop.' || p_event.event_key, coalesce(p_action->>'category', 'orchestration'),
        v_title, coalesce(p_event.payload->>'summary', v_title),
        coalesce(p_action->>'severity', p_event.severity),
        true, coalesce(p_action->>'action_url', '/app/actions'),
        coalesce(p_action->>'recommendation', 'Review orchestrated alert'),
        p_event.occurred_at,
        jsonb_build_object('orchestration_event_id', p_event_id)
      );
      v_result := jsonb_build_object('desktop', true);

    when 'add_to_briefing' then
      perform public._bs_upsert_event(
        p_tenant_id, 'orchestration', p_event.source_type, nullif(p_event.source_id, '')::uuid,
        'orc.briefing.' || p_event.event_key, v_title,
        coalesce(p_event.payload->>'summary', v_title),
        coalesce(p_action->>'severity', p_event.severity), true,
        coalesce(p_action->>'action_url', '/app/orchestration'),
        p_event.occurred_at,
        jsonb_build_object('orchestration_event_id', p_event_id)
      );
      v_result := jsonb_build_object('briefing', true);

    when 'create_knowledge_gap' then
      v_gap_id := public._kc_upsert_gap(
        p_tenant_id,
        coalesce(p_event.payload->>'question', p_event.payload->>'title', 'Orchestrated knowledge gap'),
        coalesce(p_event.payload->>'language', 'en'),
        coalesce(p_event.source_module, 'orchestration'),
        coalesce((p_event.payload->>'confidence')::numeric, 30),
        public._orc_auth_user_id()
      );
      v_result := jsonb_build_object('gap_id', v_gap_id);

    when 'link_knowledge_article' then
      v_result := jsonb_build_object('linked', true, 'category', coalesce(p_action->>'category', 'orchestration'));

    when 'generate_developer_report' then
      if p_event.payload ? 'incident_id' then
        insert into public.aipify_quality_reports (tenant_id, incident_id, title, report_body, status)
        select p_tenant_id, (p_event.payload->>'incident_id')::uuid,
          'Orchestrated developer report: ' || coalesce(i.title, p_event.event_type),
          coalesce(public._qg_format_report(i), 'Review orchestrated quality incident.'),
          'draft'
        from public.aipify_quality_incidents i
        where i.id = (p_event.payload->>'incident_id')::uuid and i.tenant_id = p_tenant_id
        on conflict do nothing;
      end if;
      v_result := jsonb_build_object('report_requested', true);

    when 'create_support_escalation' then
      v_action_id := public._ach_upsert_item(
        p_tenant_id, 'orc.support.' || p_event.event_key, 'Support escalation: ' || v_title,
        coalesce(p_event.payload->>'summary', 'Low confidence support answer requires review'),
        'support', p_event.source_type, nullif(p_event.source_id, '')::uuid,
        'support_escalation', p_event.severity, 'high', 'support', null,
        '/app/settings/support-operations', false, 'Orchestrated support escalation',
        jsonb_build_object('orchestration_event_id', p_event_id)
      );
      v_result := jsonb_build_object('action_item_id', v_action_id);

    when 'pause_automation' then
      v_action_id := public._ach_upsert_item(
        p_tenant_id, 'orc.automation.pause.' || p_event.event_key, 'Pause automation: ' || v_title,
        coalesce(p_event.payload->>'summary', 'Orchestration requested automation pause'),
        'automation', p_event.source_type, nullif(p_event.source_id, '')::uuid,
        'automation_pause', 'medium', 'medium', 'admin', null, '/app/automations', true,
        'Orchestrated automation pause',
        jsonb_build_object('orchestration_event_id', p_event_id)
      );
      v_result := jsonb_build_object('action_item_id', v_action_id);

    when 'create_security_incident' then
      v_incident_id := (public.create_security_incident(jsonb_build_object(
        'incident_type', coalesce(p_event.payload->>'incident_type', 'orchestration'),
        'severity', coalesce(p_action->>'severity', p_event.severity, 'medium'),
        'title', v_title,
        'summary', coalesce(p_event.payload->>'summary', 'Orchestrated security event'),
        'affected_resource_type', p_event.source_type,
        'affected_resource_id', p_event.source_id
      ))->>'id')::uuid;
      v_result := jsonb_build_object('incident_id', v_incident_id);

    when 'record_memory_observation' then
      perform public._mem_upsert_observation(
        p_tenant_id, public._orc_auth_user_id(), 'orchestration', p_event.source_type,
        'orc.obs.' || p_event.event_key,
        left(coalesce(p_event.payload->>'summary', p_event.event_type), 500),
        'tenant', jsonb_build_object('event_type', p_event.event_type), p_event.occurred_at
      );
      v_result := jsonb_build_object('memory', true);

    when 'send_learning_event' then
      perform public.record_learning_event(
        coalesce(p_event.source_module, 'orchestration'),
        nullif(p_event.source_id, '')::uuid,
        coalesce(p_action->>'event_type', 'orchestration_event'),
        null, null, null, null,
        'Orchestrated learning signal',
        jsonb_build_object('orchestration_event_id', p_event_id)
      );
      v_result := jsonb_build_object('learning', true);

    when 'schedule_quality_recheck' then
      v_action_id := public._ach_upsert_item(
        p_tenant_id, 'orc.quality.recheck.' || p_event.event_key, 'Schedule quality recheck',
        coalesce(p_event.payload->>'summary', 'Orchestrated quality recheck'),
        'quality', p_event.source_type, nullif(p_event.source_id, '')::uuid,
        'quality_recheck', p_event.severity, 'medium', 'admin', null, '/app/quality', false,
        'Orchestrated quality recheck',
        jsonb_build_object('orchestration_event_id', p_event_id)
      );
      v_result := jsonb_build_object('action_item_id', v_action_id);

    when 'create_admin_task' then
      v_action_id := public._ach_upsert_item(
        p_tenant_id, 'orc.admin.' || p_event.event_key, v_title,
        coalesce(p_event.payload->>'summary', 'Admin task from orchestration'),
        'orchestration', p_event.source_type, nullif(p_event.source_id, '')::uuid,
        'admin_task', p_event.severity, coalesce(p_action->>'priority', 'medium'),
        'admin', null, '/app/orchestration', false, 'Orchestrated admin task',
        jsonb_build_object('orchestration_event_id', p_event_id)
      );
      v_result := jsonb_build_object('action_item_id', v_action_id);

    when 'suppress_duplicate' then
      v_status := 'acknowledged';
      v_result := jsonb_build_object('suppressed', true);

    else
      perform public._orc_log_audit(p_tenant_id, 'audit_only', 'logged', p_event_id, p_flow_id, 'system', p_action);
      v_result := jsonb_build_object('audit_only', true);
  end case;

  update public.orchestration_dispatches set status = v_status, result = v_result, completed_at = now() where id = v_dispatch_id;
  update public.orchestration_steps set
    status = case when v_status = 'blocked' then 'blocked' else 'completed' end,
    output = v_result, completed_at = now(),
    policy_decision_id = nullif(v_policy->>'decision_id', '')::uuid
  where id = p_step_id;

  perform public._orc_log_audit(p_tenant_id, 'dispatch_' || v_action, v_status, p_event_id, p_flow_id, 'system', v_result);
  return jsonb_build_object('status', v_status, 'result', v_result);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Flow runner
-- ---------------------------------------------------------------------------
create or replace function public._orc_run_flow(p_flow_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_flow public.orchestration_flows;
  v_event public.orchestration_events;
  v_rule public.orchestration_rules;
  v_settings public.orchestration_settings;
  v_step public.orchestration_steps;
  v_action jsonb;
  v_result jsonb;
  v_completed int := 0;
  v_failed int := 0;
begin
  select * into v_flow from public.orchestration_flows where id = p_flow_id;
  if not found then return jsonb_build_object('error', 'flow_not_found'); end if;
  if v_flow.status in ('completed', 'cancelled', 'blocked') then
    return jsonb_build_object('status', v_flow.status);
  end if;

  v_settings := public._orc_ensure_settings(v_flow.tenant_id);
  select * into v_event from public.orchestration_events where id = v_flow.trigger_event_id;
  select * into v_rule from public.orchestration_rules where id = v_flow.rule_id;

  update public.orchestration_flows set status = 'running', updated_at = now() where id = p_flow_id;

  for v_step in
    select * from public.orchestration_steps
    where flow_id = p_flow_id and status in ('pending', 'failed')
    order by step_order
  loop
    update public.orchestration_steps set status = 'running', started_at = now() where id = v_step.id;
    update public.orchestration_flows set current_step = v_step.step_key, updated_at = now() where id = p_flow_id;

    v_action := v_step.input;
    v_result := public._orc_execute_dispatch(
      v_flow.tenant_id, p_flow_id, v_flow.trigger_event_id, v_step.id,
      v_action, v_event,
      v_settings.require_policy_engine and coalesce(v_rule.requires_policy_check, true)
    );

    if (v_result->>'status') = 'waiting_approval' then
      return v_result;
    elsif (v_result->>'status') = 'blocked' then
      update public.orchestration_flows set status = 'blocked', updated_at = now() where id = p_flow_id;
      v_failed := v_failed + 1;
      exit;
    else
      v_completed := v_completed + 1;
    end if;
  end loop;

  if v_failed > 0 then
    update public.orchestration_flows set status = 'blocked', result_summary = 'One or more steps blocked', updated_at = now()
    where id = p_flow_id;
  else
    update public.orchestration_flows set status = 'completed', result_summary = v_completed || ' steps completed',
      completed_at = now(), updated_at = now() where id = p_flow_id;
  end if;

  return jsonb_build_object('flow_id', p_flow_id, 'completed_steps', v_completed, 'status', v_flow.status);
end; $$;

create or replace function public._orc_start_flows_for_event(p_event_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_event public.orchestration_events;
  v_settings public.orchestration_settings;
  v_rule public.orchestration_rules;
  v_flow_id uuid;
  v_action jsonb;
  v_step_order int;
  v_flows_started int := 0;
  v_active int;
begin
  select * into v_event from public.orchestration_events where id = p_event_id;
  if not found then return jsonb_build_object('error', 'event_not_found'); end if;

  v_settings := public._orc_ensure_settings(v_event.tenant_id);
  if not v_settings.enabled or not v_settings.auto_route_events then
    update public.orchestration_events set status = 'ignored' where id = p_event_id;
    return jsonb_build_object('ignored', true, 'reason', 'orchestration_disabled');
  end if;

  if public._orc_emergency_stop_active(v_event.tenant_id) then
    update public.orchestration_events set status = 'blocked' where id = p_event_id;
    perform public._orc_log_audit(v_event.tenant_id, 'event_blocked_emergency_stop', 'blocked', p_event_id, null, 'system', '{}'::jsonb);
    return jsonb_build_object('blocked', true, 'reason', 'emergency_stop');
  end if;

  perform public._orc_seed_global_rules();

  select count(*) into v_active from public.orchestration_flows
  where tenant_id = v_event.tenant_id and status in ('running', 'waiting_approval', 'pending');
  if v_active >= v_settings.max_parallel_flows then
    return jsonb_build_object('deferred', true, 'reason', 'max_parallel_flows');
  end if;

  for v_rule in
    select * from public.orchestration_rules
    where enabled and (tenant_id is null or tenant_id = v_event.tenant_id)
    order by case when tenant_id is null then 1 else 0 end, created_at
  loop
    if not public._orc_rule_matches(v_rule, v_event) then continue; end if;

    insert into public.orchestration_flows (
      tenant_id, flow_key, name, description, trigger_event_id, rule_id, status
    ) values (
      v_event.tenant_id,
      'flow.' || p_event_id::text || '.' || v_rule.rule_key,
      v_rule.name, v_rule.description, p_event_id, v_rule.id, 'pending'
    )
    on conflict (tenant_id, flow_key) do nothing
    returning id into v_flow_id;

    if v_flow_id is null then continue; end if;

    v_step_order := 0;
    for v_action in select * from jsonb_array_elements(v_rule.actions)
    loop
      v_step_order := v_step_order + 1;
      if v_step_order > v_settings.max_flow_steps then exit; end if;
      insert into public.orchestration_steps (
        tenant_id, flow_id, step_order, step_key, module_key, action_key, input
      ) values (
        v_event.tenant_id, v_flow_id, v_step_order,
        v_rule.rule_key || '_step_' || v_step_order,
        coalesce(v_action->>'module', v_event.source_module),
        coalesce(v_action->>'action', 'audit_only'),
        v_action
      );
    end loop;

    perform public._orc_run_flow(v_flow_id);
    v_flows_started := v_flows_started + 1;
  end loop;

  update public.orchestration_events set status = 'processed' where id = p_event_id;
  perform public._orc_log_audit(v_event.tenant_id, 'event_processed', 'processed', p_event_id, null, 'system',
    jsonb_build_object('flows_started', v_flows_started));

  return jsonb_build_object('event_id', p_event_id, 'flows_started', v_flows_started);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Event ingestion
-- ---------------------------------------------------------------------------
create or replace function public.emit_orchestration_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.orchestration_settings;
  v_event_id uuid;
  v_event_key text;
  v_existing public.orchestration_events;
  v_severity text;
  v_priority int;
begin
  v_tenant_id := public._orc_require_tenant();
  v_settings := public._orc_ensure_settings(v_tenant_id);

  v_event_key := coalesce(
    p_payload->>'event_key',
    public._orc_build_event_key(p_payload->>'source_module', p_payload->>'event_type', p_payload->>'source_id')
  );
  v_severity := coalesce(p_payload->>'severity', 'info');
  v_priority := public._orc_priority_score(v_severity, false);

  if v_settings.suppress_duplicate_events then
    select * into v_existing from public.orchestration_events
    where tenant_id = v_tenant_id and event_key = v_event_key
      and created_at >= now() - (v_settings.duplicate_window_minutes || ' minutes')::interval
      and status not in ('failed');

    if found then
      update public.orchestration_events set
        duplicate_count = duplicate_count + 1,
        priority_score = greatest(priority_score, v_priority),
        payload = payload || coalesce(p_payload->'payload', '{}'::jsonb),
        occurred_at = coalesce((p_payload->>'occurred_at')::timestamptz, now())
      where id = v_existing.id;
      perform public._orc_log_audit(v_tenant_id, 'duplicate_suppressed', 'suppressed', v_existing.id, null, 'system',
        jsonb_build_object('duplicate_count', v_existing.duplicate_count + 1));
      return jsonb_build_object('id', v_existing.id, 'duplicate', true, 'duplicate_count', v_existing.duplicate_count + 1);
    end if;
  end if;

  insert into public.orchestration_events (
    tenant_id, event_key, source_module, source_type, source_id, event_type,
    severity, priority_score, payload, context, occurred_at
  ) values (
    v_tenant_id, v_event_key,
    coalesce(p_payload->>'source_module', 'unknown'),
    coalesce(p_payload->>'source_type', 'event'),
    p_payload->>'source_id',
    coalesce(p_payload->>'event_type', 'unknown.event'),
    v_severity, v_priority,
    coalesce(p_payload->'payload', '{}'::jsonb),
    coalesce(p_payload->'context', '{}'::jsonb),
    coalesce((p_payload->>'occurred_at')::timestamptz, now())
  ) returning id into v_event_id;

  perform public._orc_log_audit(v_tenant_id, 'event_received', 'received', v_event_id, null, 'user',
    jsonb_build_object('event_type', p_payload->>'event_type'));

  if v_settings.auto_route_events then
    return public._orc_start_flows_for_event(v_event_id) || jsonb_build_object('id', v_event_id);
  end if;

  return jsonb_build_object('id', v_event_id, 'status', 'received');
end; $$;

create or replace function public.process_orchestration_events(p_limit int default 25)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_event record;
  v_processed int := 0;
begin
  v_tenant_id := public._orc_require_tenant();
  for v_event in
    select id from public.orchestration_events
    where tenant_id = v_tenant_id and status = 'received'
    order by priority_score desc, created_at asc
    limit coalesce(p_limit, 25)
  loop
    update public.orchestration_events set status = 'processing' where id = v_event.id;
    perform public._orc_start_flows_for_event(v_event.id);
    v_processed := v_processed + 1;
  end loop;
  return jsonb_build_object('processed', v_processed);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_orchestration_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._orc_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'events_today', (select count(*) from public.orchestration_events where tenant_id = v_tenant_id and created_at >= current_date),
    'active_flows', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status in ('running', 'waiting_approval', 'pending')),
    'blocked_flows', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status = 'blocked'),
    'failed_flows', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status = 'failed'),
    'waiting_approvals', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status = 'waiting_approval'),
    'emergency_stop_active', public._orc_emergency_stop_active(v_tenant_id),
    'philosophy', 'One brain coordinates every module — safely, traceably, and with governance in control.',
    'enabled', (select enabled from public.orchestration_settings where tenant_id = v_tenant_id)
  );
end; $$;

create or replace function public.get_orchestration_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_events jsonb;
  v_flows jsonb;
  v_modules jsonb;
  v_audit jsonb;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_seed_global_rules();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_type', e.event_type, 'source_module', e.source_module,
    'severity', e.severity, 'status', e.status, 'priority_score', e.priority_score,
    'duplicate_count', e.duplicate_count, 'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb) into v_events
  from (select * from public.orchestration_events where tenant_id = v_tenant_id order by created_at desc limit 15) e;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'flow_key', f.flow_key, 'name', f.name, 'status', f.status,
    'current_step', f.current_step, 'started_at', f.started_at, 'completed_at', f.completed_at
  ) order by f.started_at desc), '[]'::jsonb) into v_flows
  from (select * from public.orchestration_flows where tenant_id = v_tenant_id order by started_at desc limit 10) f;

  select coalesce(jsonb_agg(jsonb_build_object('source_module', source_module, 'count', cnt) order by cnt desc), '[]'::jsonb)
  into v_modules
  from (
    select source_module, count(*)::int as cnt from public.orchestration_events
    where tenant_id = v_tenant_id and created_at >= current_date
    group by source_module order by cnt desc limit 8
  ) m;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'action', a.action, 'result', a.result, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb) into v_audit
  from (select * from public.orchestration_audit_log where tenant_id = v_tenant_id order by created_at desc limit 12) a;

  return jsonb_build_object(
    'has_customer', true,
    'events_today', (select count(*) from public.orchestration_events where tenant_id = v_tenant_id and created_at >= current_date),
    'active_flows', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status in ('running', 'waiting_approval', 'pending')),
    'failed_flows', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status = 'failed'),
    'blocked_flows', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status = 'blocked'),
    'waiting_approvals', (select count(*) from public.orchestration_flows where tenant_id = v_tenant_id and status = 'waiting_approval'),
    'duplicates_suppressed', (select coalesce(sum(duplicate_count - 1), 0) from public.orchestration_events where tenant_id = v_tenant_id and duplicate_count > 1),
    'emergency_stop_active', public._orc_emergency_stop_active(v_tenant_id),
    'recent_events', v_events,
    'recent_flows', v_flows,
    'top_modules', v_modules,
    'recent_audit', v_audit
  );
end; $$;

create or replace function public.list_orchestration_events(
  p_module text default null, p_event_type text default null,
  p_severity text default null, p_status text default null, p_limit int default 50
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  return jsonb_build_object('has_customer', true, 'events',
    coalesce((
      select jsonb_agg(row_to_json(e)::jsonb order by e.created_at desc)
      from (
        select id, event_key, source_module, source_type, source_id, event_type, severity,
               priority_score, status, duplicate_count, occurred_at, created_at
        from public.orchestration_events
        where tenant_id = v_tenant_id
          and (p_module is null or source_module = p_module)
          and (p_event_type is null or event_type = p_event_type)
          and (p_severity is null or severity = p_severity)
          and (p_status is null or status = p_status)
        order by created_at desc limit coalesce(p_limit, 50)
      ) e
    ), '[]'::jsonb));
end; $$;

create or replace function public.get_orchestration_event(p_event_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_event jsonb; v_flows jsonb;
begin
  v_tenant_id := public._orc_require_tenant();
  select row_to_json(e)::jsonb into v_event from public.orchestration_events e
  where e.id = p_event_id and e.tenant_id = v_tenant_id;
  if v_event is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(row_to_json(f)::jsonb), '[]'::jsonb) into v_flows
  from public.orchestration_flows f where f.trigger_event_id = p_event_id;

  return jsonb_build_object('event', v_event, 'flows', v_flows);
end; $$;

create or replace function public.list_orchestration_flows(p_status text default null, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  return jsonb_build_object('has_customer', true, 'flows',
    coalesce((
      select jsonb_agg(row_to_json(f)::jsonb order by f.started_at desc)
      from (
        select id, flow_key, name, status, current_step, result_summary, trigger_event_id,
               started_at, completed_at, created_at
        from public.orchestration_flows
        where tenant_id = v_tenant_id and (p_status is null or status = p_status)
        order by started_at desc limit coalesce(p_limit, 50)
      ) f
    ), '[]'::jsonb));
end; $$;

create or replace function public.get_orchestration_flow(p_flow_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_flow jsonb; v_steps jsonb; v_dispatches jsonb; v_audit jsonb;
begin
  v_tenant_id := public._orc_require_tenant();
  select row_to_json(f)::jsonb into v_flow from public.orchestration_flows f
  where f.id = p_flow_id and f.tenant_id = v_tenant_id;
  if v_flow is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(row_to_json(s)::jsonb order by s.step_order), '[]'::jsonb) into v_steps
  from public.orchestration_steps s where s.flow_id = p_flow_id;

  select coalesce(jsonb_agg(row_to_json(d)::jsonb order by d.created_at), '[]'::jsonb) into v_dispatches
  from public.orchestration_dispatches d where d.flow_id = p_flow_id;

  select coalesce(jsonb_agg(row_to_json(a)::jsonb order by a.created_at desc), '[]'::jsonb) into v_audit
  from public.orchestration_audit_log a where a.flow_id = p_flow_id;

  return jsonb_build_object('flow', v_flow, 'steps', v_steps, 'dispatches', v_dispatches, 'audit', v_audit);
end; $$;

create or replace function public.list_orchestration_rules()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_seed_global_rules();
  return jsonb_build_object('has_customer', true, 'rules',
    coalesce((
      select jsonb_agg(row_to_json(r)::jsonb order by r.tenant_id nulls first, r.rule_key)
      from public.orchestration_rules r
      where r.tenant_id is null or r.tenant_id = v_tenant_id
    ), '[]'::jsonb));
end; $$;

create or replace function public.get_orchestration_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.orchestration_settings;
begin
  v_tenant_id := public._orc_require_tenant();
  v_row := public._orc_ensure_settings(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'settings', row_to_json(v_row)::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Write / admin APIs
-- ---------------------------------------------------------------------------
create or replace function public.retry_orchestration_flow(p_flow_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  update public.orchestration_steps set status = 'pending', error_message = null, completed_at = null
  where flow_id = p_flow_id and tenant_id = v_tenant_id and status in ('failed', 'blocked');
  update public.orchestration_flows set status = 'running', completed_at = null, updated_at = now()
  where id = p_flow_id and tenant_id = v_tenant_id;
  perform public._orc_log_audit(v_tenant_id, 'flow_retry', 'retried', null, p_flow_id, 'admin', '{}'::jsonb);
  return public._orc_run_flow(p_flow_id);
end; $$;

create or replace function public.cancel_orchestration_flow(p_flow_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  update public.orchestration_flows set status = 'cancelled', completed_at = now(), updated_at = now()
  where id = p_flow_id and tenant_id = v_tenant_id;
  update public.orchestration_steps set status = 'skipped', completed_at = now()
  where flow_id = p_flow_id and status in ('pending', 'running', 'waiting_approval');
  perform public._orc_log_audit(v_tenant_id, 'flow_cancelled', 'cancelled', null, p_flow_id, 'admin', '{}'::jsonb);
  return jsonb_build_object('cancelled', true);
end; $$;

create or replace function public.create_orchestration_rule(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  insert into public.orchestration_rules (
    tenant_id, rule_key, name, description, source_module, event_type,
    conditions, actions, risk_level, requires_policy_check, enabled
  ) values (
    v_tenant_id,
    p_payload->>'rule_key', p_payload->>'name', p_payload->>'description',
    p_payload->>'source_module', coalesce(p_payload->>'event_type', '*'),
    coalesce(p_payload->'conditions', '{}'::jsonb),
    coalesce(p_payload->'actions', '[]'::jsonb),
    coalesce(p_payload->>'risk_level', 'low'),
    coalesce((p_payload->>'requires_policy_check')::boolean, true),
    coalesce((p_payload->>'enabled')::boolean, true)
  ) returning id into v_id;
  perform public._orc_log_audit(v_tenant_id, 'rule_created', 'created', null, null, 'admin', jsonb_build_object('rule_id', v_id));
  return jsonb_build_object('id', v_id);
end; $$;

create or replace function public.update_orchestration_rule(p_rule_id uuid, p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  update public.orchestration_rules set
    name = coalesce(p_patch->>'name', name),
    description = coalesce(p_patch->>'description', description),
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    source_module = coalesce(p_patch->>'source_module', source_module),
    event_type = coalesce(p_patch->>'event_type', event_type),
    conditions = coalesce(p_patch->'conditions', conditions),
    actions = coalesce(p_patch->'actions', actions),
    risk_level = coalesce(p_patch->>'risk_level', risk_level),
    requires_policy_check = coalesce((p_patch->>'requires_policy_check')::boolean, requires_policy_check),
    updated_at = now()
  where id = p_rule_id and tenant_id = v_tenant_id;
  perform public._orc_log_audit(v_tenant_id, 'rule_updated', 'updated', null, null, 'admin', jsonb_build_object('rule_id', p_rule_id));
  return jsonb_build_object('updated', true);
end; $$;

create or replace function public.set_orchestration_rule_enabled(p_rule_id uuid, p_enabled boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  update public.orchestration_rules set enabled = p_enabled, updated_at = now()
  where id = p_rule_id and tenant_id = v_tenant_id;
  perform public._orc_log_audit(v_tenant_id, case when p_enabled then 'rule_enabled' else 'rule_disabled' end,
    'updated', null, null, 'admin', jsonb_build_object('rule_id', p_rule_id));
  return jsonb_build_object('enabled', p_enabled);
end; $$;

create or replace function public.update_orchestration_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  perform public._orc_ensure_settings(v_tenant_id);
  update public.orchestration_settings set
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    auto_route_events = coalesce((p_patch->>'auto_route_events')::boolean, auto_route_events),
    require_policy_engine = coalesce((p_patch->>'require_policy_engine')::boolean, require_policy_engine),
    allow_cross_module_dispatch = coalesce((p_patch->>'allow_cross_module_dispatch')::boolean, allow_cross_module_dispatch),
    max_flow_steps = coalesce((p_patch->>'max_flow_steps')::int, max_flow_steps),
    max_parallel_flows = coalesce((p_patch->>'max_parallel_flows')::int, max_parallel_flows),
    notify_on_critical = coalesce((p_patch->>'notify_on_critical')::boolean, notify_on_critical),
    create_actions_for_high = coalesce((p_patch->>'create_actions_for_high')::boolean, create_actions_for_high),
    create_actions_for_medium = coalesce((p_patch->>'create_actions_for_medium')::boolean, create_actions_for_medium),
    suppress_duplicate_events = coalesce((p_patch->>'suppress_duplicate_events')::boolean, suppress_duplicate_events),
    duplicate_window_minutes = coalesce((p_patch->>'duplicate_window_minutes')::int, duplicate_window_minutes),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._orc_log_audit(v_tenant_id, 'settings_updated', 'updated', null, null, 'admin', p_patch);
  return public.get_orchestration_settings();
end; $$;

create or replace function public.test_orchestration_dispatch(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  return public.emit_orchestration_event(p_payload);
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Worker jobs
-- ---------------------------------------------------------------------------
create or replace function public.orchestration_duplicate_suppressor()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_count int;
begin
  v_tenant_id := public._orc_require_tenant();
  select count(*) into v_count from public.orchestration_events
  where tenant_id = v_tenant_id and duplicate_count > 1 and status = 'processed';
  return jsonb_build_object('grouped_duplicates', v_count);
end; $$;

create or replace function public.orchestration_retry_failed_flows(p_limit int default 10)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_flow record; v_retried int := 0;
begin
  v_tenant_id := public._orc_require_tenant();
  for v_flow in
    select id from public.orchestration_flows
    where tenant_id = v_tenant_id and status = 'failed'
    order by updated_at asc limit coalesce(p_limit, 10)
  loop
    perform public.retry_orchestration_flow(v_flow.id);
    v_retried := v_retried + 1;
  end loop;
  return jsonb_build_object('retried', v_retried);
end; $$;

create or replace function public.orchestration_cleanup_old_events(p_retention_days int default 90)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_deleted int;
begin
  v_tenant_id := public._orc_require_tenant();
  perform public._orc_require_admin();
  delete from public.orchestration_events
  where tenant_id = v_tenant_id and created_at < now() - (coalesce(p_retention_days, 90) || ' days')::interval
    and status in ('processed', 'ignored');
  get diagnostics v_deleted = row_count;
  return jsonb_build_object('deleted', v_deleted);
end; $$;

create or replace function public.orchestration_health_monitor()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_stuck int;
begin
  v_tenant_id := public._orc_require_tenant();
  select count(*) into v_stuck from public.orchestration_flows
  where tenant_id = v_tenant_id and status = 'running'
    and started_at < now() - interval '2 hours';
  if v_stuck > 0 then
    perform public._orc_log_audit(v_tenant_id, 'stuck_flows_detected', 'warning', null, null, 'system',
      jsonb_build_object('count', v_stuck));
  end if;
  return jsonb_build_object('stuck_flows', v_stuck);
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Unonight pilot rules
-- ---------------------------------------------------------------------------
create or replace function public.seed_unonight_orchestration_rules(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._orc_require_tenant());
  perform public._orc_seed_global_rules();

  insert into public.orchestration_rules (tenant_id, rule_key, name, description, source_module, event_type, conditions, actions, risk_level)
  values
    (v_tenant_id, 'unonight_verification_queue_high', 'Unonight verification queue high',
     'High verification queue triggers action and briefing.',
     'unonight', 'unonight.verification.queue_high', '{}'::jsonb,
     '[{"action":"create_action_item","priority":"high","title_template":"Verification queue is high"},
       {"action":"add_to_briefing","severity":"high","title_template":"Verification queue needs attention"},
       {"action":"send_desktop_notification","severity":"high","title_template":"Verification queue high"}]'::jsonb, 'medium'),
    (v_tenant_id, 'unonight_support_draft_ready', 'Support draft ready',
     'Notify when support draft is ready for review.',
     'support', 'support.draft.ready', '{}'::jsonb,
     '[{"action":"create_action_item","priority":"medium","title_template":"Support draft ready for review"},
       {"action":"add_to_briefing","severity":"medium","title_template":"Support draft awaiting review"}]'::jsonb, 'low'),
    (v_tenant_id, 'unonight_upgrade_flow_broken', 'Upgrade flow broken',
     'Critical upgrade flow issue from Quality Guardian.',
     'quality', 'quality.incident.created', '{"payload_type":"upgrade_flow","severity":["critical","high"]}'::jsonb,
     '[{"action":"create_action_item","priority":"critical","title_template":"Upgrade flow broken"},
       {"action":"send_desktop_notification","severity":"critical","title_template":"Upgrade flow broken"},
       {"action":"generate_developer_report"},
       {"action":"add_to_briefing","severity":"critical","title_template":"Upgrade flow requires fix"}]'::jsonb, 'high'),
    (v_tenant_id, 'unonight_knowledge_gap_repeated', 'Unonight repeated knowledge gap',
     'Repeated knowledge gaps suggest FAQ draft.',
     'knowledge', 'knowledge.gap.created', '{"frequency_count_gte":2}'::jsonb,
     '[{"action":"create_action_item","priority":"medium","title_template":"Draft FAQ for repeated question"},
       {"action":"create_knowledge_gap"}]'::jsonb, 'low'),
    (v_tenant_id, 'unonight_marketplace_approval_delayed', 'Marketplace approval delayed',
     'Delayed marketplace approval workflow.',
     'unonight', 'workflow.delay', '{"payload_type":"marketplace_approval"}'::jsonb,
     '[{"action":"create_action_item","priority":"high","title_template":"Marketplace approval delayed","recommended_owner":"moderator"},
       {"action":"add_to_briefing","severity":"high","title_template":"Marketplace approval waiting"},
       {"action":"send_desktop_notification","severity":"high","title_template":"Marketplace approval delayed"}]'::jsonb, 'medium')
  on conflict do nothing;

  return jsonb_build_object('seeded', true, 'tenant_id', v_tenant_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 17. KC category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'orchestration-engine', 'Orchestration Engine', 'Cross-module coordination and event routing.', 'authenticated', 13
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'orchestration-engine' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.emit_orchestration_event(jsonb) to authenticated;
grant execute on function public.process_orchestration_events(int) to authenticated;
grant execute on function public.get_orchestration_card() to authenticated;
grant execute on function public.get_orchestration_dashboard() to authenticated;
grant execute on function public.list_orchestration_events(text, text, text, text, int) to authenticated;
grant execute on function public.get_orchestration_event(uuid) to authenticated;
grant execute on function public.list_orchestration_flows(text, int) to authenticated;
grant execute on function public.get_orchestration_flow(uuid) to authenticated;
grant execute on function public.list_orchestration_rules() to authenticated;
grant execute on function public.get_orchestration_settings() to authenticated;
grant execute on function public.retry_orchestration_flow(uuid) to authenticated;
grant execute on function public.cancel_orchestration_flow(uuid) to authenticated;
grant execute on function public.create_orchestration_rule(jsonb) to authenticated;
grant execute on function public.update_orchestration_rule(uuid, jsonb) to authenticated;
grant execute on function public.set_orchestration_rule_enabled(uuid, boolean) to authenticated;
grant execute on function public.update_orchestration_settings(jsonb) to authenticated;
grant execute on function public.test_orchestration_dispatch(jsonb) to authenticated;
grant execute on function public.orchestration_duplicate_suppressor() to authenticated;
grant execute on function public.orchestration_retry_failed_flows(int) to authenticated;
grant execute on function public.orchestration_cleanup_old_events(int) to authenticated;
grant execute on function public.orchestration_health_monitor() to authenticated;
grant execute on function public.seed_unonight_orchestration_rules(uuid) to authenticated;
