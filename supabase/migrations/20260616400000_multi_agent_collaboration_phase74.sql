-- Phase 74 — Multi-Agent Collaboration System

-- ---------------------------------------------------------------------------
-- 1. collaboration_agents (specialist AI agent registry — not deployment agents)
-- ---------------------------------------------------------------------------
create table if not exists public.collaboration_agents (
  id uuid primary key default gen_random_uuid(),
  agent_key text not null unique,
  name text not null,
  description text,
  status text not null default 'active' check (
    status in ('active', 'disabled', 'maintenance', 'experimental')
  ),
  version text not null default '1.0.0',
  category text not null,
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'restricted')
  ),
  enabled boolean not null default true,
  responsibilities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.collaboration_agents enable row level security;
revoke all on public.collaboration_agents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. collaboration_agent_capabilities
-- ---------------------------------------------------------------------------
create table if not exists public.collaboration_agent_capabilities (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.collaboration_agents (id) on delete cascade,
  capability_key text not null,
  description text,
  requires_approval boolean not null default false,
  created_at timestamptz not null default now(),
  unique (agent_id, capability_key)
);

alter table public.collaboration_agent_capabilities enable row level security;
revoke all on public.collaboration_agent_capabilities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. collaboration_agent_permissions
-- ---------------------------------------------------------------------------
create table if not exists public.collaboration_agent_permissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.collaboration_agents (id) on delete cascade,
  permission_key text not null,
  source text not null default 'registry',
  granted boolean not null default true,
  created_at timestamptz not null default now(),
  unique (agent_id, permission_key)
);

alter table public.collaboration_agent_permissions enable row level security;
revoke all on public.collaboration_agent_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. tenant_agent_settings (per-tenant enable/disable)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_agent_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  agent_id uuid not null references public.collaboration_agents (id) on delete cascade,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (tenant_id, agent_id)
);

alter table public.tenant_agent_settings enable row level security;
revoke all on public.tenant_agent_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. collaboration_agent_events
-- ---------------------------------------------------------------------------
create table if not exists public.collaboration_agent_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_agent text not null,
  target_agent text,
  event_type text not null,
  message_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'processed', 'failed', 'blocked')
  ),
  policy_decision jsonb,
  orchestration_flow_key text,
  created_at timestamptz not null default now()
);

create index if not exists collaboration_agent_events_tenant_idx
  on public.collaboration_agent_events (tenant_id, created_at desc);

alter table public.collaboration_agent_events enable row level security;
revoke all on public.collaboration_agent_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. collaboration_agent_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.collaboration_agent_metrics (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.collaboration_agents (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_value numeric(14,4) not null default 0,
  period_start timestamptz not null,
  period_end timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists collaboration_agent_metrics_tenant_idx
  on public.collaboration_agent_metrics (tenant_id, agent_id, period_end desc);

alter table public.collaboration_agent_metrics enable row level security;
revoke all on public.collaboration_agent_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. collaboration_agent_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.collaboration_agent_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  agent_key text,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists collaboration_agent_audit_tenant_idx
  on public.collaboration_agent_audit_log (tenant_id, created_at desc);

alter table public.collaboration_agent_audit_log enable row level security;
revoke all on public.collaboration_agent_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_mag_)
-- ---------------------------------------------------------------------------
create or replace function public._mag_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._mag_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._mag_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._mag_log_audit(
  p_tenant_id uuid, p_agent_key text, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.collaboration_agent_audit_log (
    tenant_id, agent_key, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_agent_key, p_event_type, p_summary,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._mag_auth_user_id())
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'agent_' || p_event_type, 'collaboration_agents', 'logged', p_user_id, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._mag_agent_json(p_agent public.collaboration_agents, p_tenant_enabled boolean default true)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_caps jsonb; v_perms jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'capability_key', c.capability_key, 'description', c.description, 'requires_approval', c.requires_approval
  )), '[]'::jsonb) into v_caps
  from public.collaboration_agent_capabilities c where c.agent_id = p_agent.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'permission_key', p.permission_key, 'granted', p.granted
  )), '[]'::jsonb) into v_perms
  from public.collaboration_agent_permissions p where p.agent_id = p_agent.id;

  return jsonb_build_object(
    'id', p_agent.id, 'agent_key', p_agent.agent_key, 'name', p_agent.name,
    'description', p_agent.description, 'status', p_agent.status, 'version', p_agent.version,
    'category', p_agent.category, 'risk_level', p_agent.risk_level,
    'enabled', p_agent.enabled and p_tenant_enabled,
    'responsibilities', p_agent.responsibilities,
    'capabilities', v_caps, 'permissions', v_perms
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Seed specialist agents
-- ---------------------------------------------------------------------------
create or replace function public._mag_seed_agents()
returns void language plpgsql security definer set search_path = public as $$
declare v_agent public.collaboration_agents;
begin
  insert into public.collaboration_agents (
    agent_key, name, description, category, risk_level, responsibilities
  ) values
    ('support', 'Support Agent', 'Analyzes support questions, drafts responses, detects low confidence, escalates when needed.', 'support', 'medium',
     '["analyze_support","draft_responses","detect_low_confidence","escalate"]'::jsonb),
    ('knowledge', 'Knowledge Agent', 'Searches Knowledge Center, suggests FAQ articles, detects gaps, recommends documentation.', 'knowledge', 'low',
     '["search_knowledge","suggest_faq","detect_gaps","recommend_docs"]'::jsonb),
    ('quality', 'Quality Agent', 'Monitors websites, detects quality issues, generates developer reports.', 'quality', 'medium',
     '["monitor_websites","detect_issues","generate_reports"]'::jsonb),
    ('governance', 'Governance Agent', 'Reviews approvals, assesses risk, enforces policies, validates permissions.', 'governance', 'restricted',
     '["review_approvals","assess_risk","enforce_policies","validate_permissions"]'::jsonb),
    ('security', 'Security Agent', 'Monitors incidents, detects suspicious activity, reviews sensitive operations.', 'security', 'high',
     '["monitor_incidents","detect_suspicious","review_sensitive"]'::jsonb),
    ('action', 'Action Agent', 'Creates tasks, assigns work, tracks completion, suggests priorities.', 'action', 'medium',
     '["create_tasks","assign_work","track_completion"]'::jsonb),
    ('desktop', 'Desktop Agent', 'Sends notifications, manages reminders, reduces fatigue, escalates critical items.', 'desktop', 'low',
     '["send_notifications","manage_reminders","escalate_critical"]'::jsonb),
    ('briefing', 'Briefing Agent', 'Generates summaries, prioritizes information, builds executive reports.', 'briefing', 'low',
     '["generate_summaries","prioritize_info","build_reports"]'::jsonb),
    ('learning', 'Learning Agent', 'Records outcomes, identifies improvement signals, supports Evolution Lab.', 'learning', 'low',
     '["record_outcomes","identify_signals","support_evolution"]'::jsonb),
    ('marketplace', 'Marketplace Agent', 'Recommends Marketplace Packs, detects opportunities, monitors effectiveness.', 'marketplace', 'low',
     '["recommend_packs","detect_opportunities","monitor_effectiveness"]'::jsonb),
    ('blueprint', 'Blueprint Agent', 'Recommends Industry Blueprints, detects mismatches, suggests improvements.', 'blueprint', 'low',
     '["recommend_blueprints","detect_mismatch","suggest_improvements"]'::jsonb)
  on conflict (agent_key) do update set
    name = excluded.name, description = excluded.description,
    responsibilities = excluded.responsibilities, risk_level = excluded.risk_level, updated_at = now();

  for v_agent in select * from public.collaboration_agents loop
    insert into public.collaboration_agent_capabilities (agent_id, capability_key, description, requires_approval)
    values
      (v_agent.id, v_agent.agent_key || '.read', 'Read scoped tenant data', false),
      (v_agent.id, v_agent.agent_key || '.recommend', 'Provide recommendations', v_agent.risk_level in ('medium', 'high', 'restricted')),
      (v_agent.id, v_agent.agent_key || '.act', 'Execute governed actions', true)
    on conflict (agent_id, capability_key) do nothing;

    insert into public.collaboration_agent_permissions (agent_id, permission_key, granted)
    values
      (v_agent.id, 'tenant_data_read', true),
      (v_agent.id, 'external_publish', v_agent.agent_key in ('governance')),
      (v_agent.id, 'billing_modify', false),
      (v_agent.id, 'permission_modify', false),
      (v_agent.id, 'data_delete', false)
    on conflict (agent_id, permission_key) do nothing;
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Policy evaluation for agent actions
-- ---------------------------------------------------------------------------
create or replace function public.evaluate_agent_action(p_agent_key text, p_action_key text, p_context jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_agent public.collaboration_agents;
  v_policy jsonb;
begin
  v_tenant_id := public._mag_require_tenant();
  perform public._mag_seed_agents();

  select * into v_agent from public.collaboration_agents where agent_key = p_agent_key;
  if v_agent.id is null then return jsonb_build_object('allowed', false, 'reason', 'agent_not_found'); end if;

  if not v_agent.enabled then
    return jsonb_build_object('allowed', false, 'reason', 'agent_disabled');
  end if;

  if exists(
    select 1 from public.tenant_agent_settings tas
    where tas.tenant_id = v_tenant_id and tas.agent_id = v_agent.id and not tas.enabled
  ) then
    return jsonb_build_object('allowed', false, 'reason', 'agent_disabled_for_tenant');
  end if;

  if p_action_key in ('billing_modify', 'permission_modify', 'data_delete', 'external_publish') then
    if not exists(
      select 1 from public.collaboration_agent_permissions
      where agent_id = v_agent.id and permission_key = p_action_key and granted
    ) then
      return jsonb_build_object('allowed', false, 'reason', 'permission_denied', 'requires_governance', true);
    end if;
  end if;

  v_policy := public.evaluate_policy(jsonb_build_object(
    'action_key', 'agent_' || p_action_key,
    'resource_type', 'collaboration_agents',
    'resource_id', p_agent_key,
    'actor_type', 'agent',
    'data_classification', case v_agent.risk_level when 'restricted' then 'confidential' when 'high' then 'confidential' else 'internal' end,
    'context', coalesce(p_context, '{}'::jsonb) || jsonb_build_object('agent_key', p_agent_key, 'risk_level', v_agent.risk_level)
  ));

  return jsonb_build_object(
    'allowed', coalesce((v_policy->>'allow')::boolean, false) and not coalesce((v_policy->>'blocked')::boolean, false),
    'requires_approval', v_agent.risk_level in ('high', 'restricted') or coalesce((v_policy->>'requires_approval')::boolean, false),
    'agent', public._mag_agent_json(v_agent, true),
    'policy', v_policy
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Agent message dispatch
-- ---------------------------------------------------------------------------
create or replace function public.dispatch_agent_message(
  p_source_agent text,
  p_target_agent text,
  p_message_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_precheck jsonb;
  v_event_id uuid;
  v_status text := 'processed';
begin
  v_tenant_id := public._mag_require_tenant();
  perform public._mag_seed_agents();

  v_precheck := public.evaluate_agent_action(p_source_agent, coalesce(p_payload->>'action_key', 'recommend'), p_payload);

  if not (v_precheck->>'allowed')::boolean then
    insert into public.collaboration_agent_events (
      tenant_id, source_agent, target_agent, event_type, message_type, payload, status, policy_decision
    ) values (
      v_tenant_id, p_source_agent, p_target_agent, 'agent_message', p_message_type, p_payload, 'blocked', v_precheck
    ) returning id into v_event_id;
    perform public._mag_log_audit(v_tenant_id, p_source_agent, 'message_blocked', 'Agent message blocked by policy',
      jsonb_build_object('event_id', v_event_id, 'message_type', p_message_type));
    return jsonb_build_object('status', 'blocked', 'event_id', v_event_id, 'precheck', v_precheck);
  end if;

  if (v_precheck->>'requires_approval')::boolean then
    v_status := 'pending';
  end if;

  insert into public.collaboration_agent_events (
    tenant_id, source_agent, target_agent, event_type, message_type, payload, status, policy_decision
  ) values (
    v_tenant_id, p_source_agent, p_target_agent, 'agent_message', p_message_type, p_payload, v_status, v_precheck
  ) returning id into v_event_id;

  perform public._mag_log_audit(v_tenant_id, p_source_agent, 'message_dispatched',
    p_source_agent || ' → ' || coalesce(p_target_agent, 'broadcast') || ': ' || p_message_type,
    jsonb_build_object('event_id', v_event_id));

  return jsonb_build_object('status', v_status, 'event_id', v_event_id, 'precheck', v_precheck);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Orchestrated collaboration workflow (support scenario)
-- ---------------------------------------------------------------------------
create or replace function public.coordinate_agent_collaboration(p_scenario text default 'support_low_confidence')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_flow_key text;
  v_steps jsonb := '[]'::jsonb;
  v_result jsonb;
begin
  v_tenant_id := public._mag_require_tenant();
  perform public._mag_seed_agents();
  v_flow_key := 'agent-flow-' || gen_random_uuid()::text;

  if p_scenario = 'support_low_confidence' then
    v_result := public.dispatch_agent_message('support', 'knowledge', 'request_information',
      jsonb_build_object('message', 'I need help answering this question.', 'confidence', 'low'));
    v_steps := v_steps || jsonb_build_array(v_result);

    v_result := public.dispatch_agent_message('knowledge', 'support', 'provide_information',
      jsonb_build_object('message', 'I found three relevant Knowledge articles.', 'articles_found', 3));
    v_steps := v_steps || jsonb_build_array(v_result);

    v_result := public.dispatch_agent_message('governance', 'support', 'request_approval',
      jsonb_build_object('message', 'External communication requires approval.', 'action_key', 'external_publish'));
    v_steps := v_steps || jsonb_build_array(v_result);

    v_result := public.dispatch_agent_message('action', null, 'create_action',
      jsonb_build_object('message', 'Task created for support lead.'));
    v_steps := v_steps || jsonb_build_array(v_result);

    v_result := public.dispatch_agent_message('desktop', null, 'escalate',
      jsonb_build_object('message', 'Notification sent to support lead.'));
    v_steps := v_steps || jsonb_build_array(v_result);

    v_result := public.dispatch_agent_message('learning', null, 'record_learning',
      jsonb_build_object('message', 'Outcome recorded.', 'outcome', 'escalated_with_approval'));
    v_steps := v_steps || jsonb_build_array(v_result);
  else
    v_result := public.dispatch_agent_message('support', 'knowledge', 'request_information', '{}'::jsonb);
    v_steps := v_steps || jsonb_build_array(v_result);
  end if;

  update public.collaboration_agent_events set orchestration_flow_key = v_flow_key
  where tenant_id = v_tenant_id and orchestration_flow_key is null
    and created_at > now() - interval '5 seconds';

  begin
    perform public.emit_orchestration_event(jsonb_build_object(
      'source_module', 'collaboration_agents', 'source_type', 'agent_collaboration',
      'source_id', v_flow_key, 'event_type', 'agents.coordinated',
      'severity', 'info', 'payload', jsonb_build_object('scenario', p_scenario, 'steps', v_steps)
    ));
  exception when others then null;
  end;

  perform public._mag_log_audit(v_tenant_id, null, 'collaboration_coordinated',
    'Agent collaboration: ' || p_scenario, jsonb_build_object('flow_key', v_flow_key, 'step_count', jsonb_array_length(v_steps)));

  return jsonb_build_object('flow_key', v_flow_key, 'scenario', p_scenario, 'steps', v_steps);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Agent health metrics
-- ---------------------------------------------------------------------------
create or replace function public.refresh_agent_health_metrics()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_agent public.collaboration_agents;
  v_count int := 0;
begin
  v_tenant_id := public._mag_require_tenant();
  perform public._mag_seed_agents();

  for v_agent in select * from public.collaboration_agents where status = 'active' loop
    insert into public.collaboration_agent_metrics (
      agent_id, tenant_id, metric_key, metric_value, period_start, period_end
    )
    select
      v_agent.id, v_tenant_id, 'event_count',
      count(*)::numeric, date_trunc('day', now() - interval '30 days'), now()
    from public.collaboration_agent_events e
    where e.tenant_id = v_tenant_id and e.source_agent = v_agent.agent_key
      and e.created_at > now() - interval '30 days'
    having count(*) > 0;

    insert into public.collaboration_agent_metrics (
      agent_id, tenant_id, metric_key, metric_value, period_start, period_end
    )
    select
      v_agent.id, v_tenant_id, 'success_rate',
      round(count(*) filter (where status = 'processed')::numeric / nullif(count(*), 0) * 100, 1),
      date_trunc('day', now() - interval '30 days'), now()
    from public.collaboration_agent_events e
    where e.tenant_id = v_tenant_id and e.source_agent = v_agent.agent_key
      and e.created_at > now() - interval '30 days'
    having count(*) > 0;

    v_count := v_count + 1;
  end loop;

  return jsonb_build_object('agents_refreshed', v_count);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_agents_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_active int; v_events int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._mag_seed_agents();

  select count(*) into v_active from public.collaboration_agents where status = 'active' and enabled;
  select count(*) into v_events from public.collaboration_agent_events
  where tenant_id = v_tenant_id and created_at > now() - interval '24 hours';

  return jsonb_build_object(
    'has_customer', true,
    'active_agents', v_active,
    'events_today', v_events,
    'philosophy', 'Specialists that collaborate under Orchestration — never autonomous employees.',
    'privacy_note', 'Every agent action is policy-checked, governed, and audited.'
  );
end; $$;

create or replace function public.get_agents_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_agents jsonb;
  v_events jsonb;
  v_health jsonb;
begin
  v_tenant_id := public._mag_require_tenant();
  perform public._mag_seed_agents();
  perform public.refresh_agent_health_metrics();

  select coalesce(jsonb_agg(
    public._mag_agent_json(a, coalesce(tas.enabled, true))
    order by a.name
  ), '[]'::jsonb) into v_agents
  from public.collaboration_agents a
  left join public.tenant_agent_settings tas on tas.agent_id = a.id and tas.tenant_id = v_tenant_id
  where a.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'source_agent', e.source_agent, 'target_agent', e.target_agent,
    'message_type', e.message_type, 'status', e.status, 'payload', e.payload,
    'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb) into v_events
  from public.collaboration_agent_events e
  where e.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'agent_key', a.agent_key, 'name', a.name,
    'event_count', coalesce(m.metric_value, 0),
    'success_rate', coalesce(m2.metric_value, 0)
  )), '[]'::jsonb) into v_health
  from public.collaboration_agents a
  left join public.collaboration_agent_metrics m on m.agent_id = a.id and m.tenant_id = v_tenant_id
    and m.metric_key = 'event_count' and m.period_end > now() - interval '1 day'
  left join public.collaboration_agent_metrics m2 on m2.agent_id = a.id and m2.tenant_id = v_tenant_id
    and m2.metric_key = 'success_rate' and m2.period_end > now() - interval '1 day'
  where a.status = 'active';

  return jsonb_build_object(
    'has_customer', true,
    'agents', v_agents,
    'recent_events', v_events,
    'health', v_health,
    'active_count', jsonb_array_length(v_agents),
    'blocked_count', (select count(*) from public.collaboration_agent_events
      where tenant_id = v_tenant_id and status = 'blocked' and created_at > now() - interval '7 days')
  );
end; $$;

create or replace function public.get_collaboration_agent(p_agent_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_agent public.collaboration_agents;
  v_tenant_enabled boolean := true;
  v_events jsonb;
  v_metrics jsonb;
begin
  v_tenant_id := public._mag_require_tenant();
  perform public._mag_seed_agents();

  select * into v_agent from public.collaboration_agents where agent_key = p_agent_key;
  if v_agent.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(tas.enabled, true) into v_tenant_enabled
  from public.tenant_agent_settings tas
  where tas.tenant_id = v_tenant_id and tas.agent_id = v_agent.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'target_agent', e.target_agent, 'message_type', e.message_type,
    'status', e.status, 'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb) into v_events
  from public.collaboration_agent_events e
  where e.tenant_id = v_tenant_id and e.source_agent = p_agent_key
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'metric_key', m.metric_key, 'metric_value', m.metric_value, 'period_end', m.period_end
  ) order by m.period_end desc), '[]'::jsonb) into v_metrics
  from public.collaboration_agent_metrics m
  where m.tenant_id = v_tenant_id and m.agent_id = v_agent.id
  limit 10;

  return jsonb_build_object(
    'agent', public._mag_agent_json(v_agent, v_tenant_enabled),
    'events', v_events,
    'metrics', v_metrics,
    'policy_sample', public.evaluate_agent_action(p_agent_key, 'recommend', '{}'::jsonb)
  );
end; $$;

create or replace function public.list_collaboration_agents()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mag_require_tenant();
  perform public._mag_seed_agents();
  return jsonb_build_object('agents', coalesce((
    select jsonb_agg(public._mag_agent_json(a, coalesce(tas.enabled, true)) order by a.name)
    from public.collaboration_agents a
    left join public.tenant_agent_settings tas on tas.agent_id = a.id and tas.tenant_id = v_tenant_id
    where a.status = 'active'
  ), '[]'::jsonb));
end; $$;

create or replace function public.update_tenant_agent_status(p_agent_key text, p_enabled boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_agent public.collaboration_agents;
begin
  v_tenant_id := public._mag_require_tenant();
  v_user_id := public._mag_auth_user_id();
  perform public._mag_require_admin();

  select * into v_agent from public.collaboration_agents where agent_key = p_agent_key;
  if v_agent.id is null then raise exception 'Agent not found'; end if;

  insert into public.tenant_agent_settings (tenant_id, agent_id, enabled)
  values (v_tenant_id, v_agent.id, p_enabled)
  on conflict (tenant_id, agent_id) do update set enabled = p_enabled, updated_at = now();

  perform public._mag_log_audit(v_tenant_id, p_agent_key, 'status_updated',
    'Agent ' || case when p_enabled then 'enabled' else 'disabled' end,
    jsonb_build_object('enabled', p_enabled), v_user_id);

  return public.get_collaboration_agent(p_agent_key);
end; $$;

-- ---------------------------------------------------------------------------
-- 15. KC category + seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'agents', 'Multi-Agent Collaboration', 'Specialist AI agents and collaboration guides.', 'authenticated', 18
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'agents' and tenant_id is null);

select public._mag_seed_agents();

-- ---------------------------------------------------------------------------
-- 16. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.evaluate_agent_action(text, text, jsonb) to authenticated;
grant execute on function public.dispatch_agent_message(text, text, text, jsonb) to authenticated;
grant execute on function public.coordinate_agent_collaboration(text) to authenticated;
grant execute on function public.refresh_agent_health_metrics() to authenticated;
grant execute on function public.get_agents_card() to authenticated;
grant execute on function public.get_agents_dashboard() to authenticated;
grant execute on function public.get_collaboration_agent(text) to authenticated;
grant execute on function public.list_collaboration_agents() to authenticated;
grant execute on function public.update_tenant_agent_status(text, boolean) to authenticated;
