-- Phase 550 — Aipify Operating System Core, Platform Governor & Central Orchestration Engine
-- Every engine works independently. Every engine works together. One platform.

-- ---------------------------------------------------------------------------
-- 1. AOS settings
-- ---------------------------------------------------------------------------
create table if not exists public.platform_aos_core_settings (
  id uuid primary key default gen_random_uuid(),
  orchestration_enabled boolean not null default true,
  governor_enabled boolean not null default true,
  event_bus_enabled boolean not null default true,
  companion_governance_enabled boolean not null default true,
  simulation_gate_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.platform_aos_core_settings (id)
select gen_random_uuid() where not exists (select 1 from public.platform_aos_core_settings limit 1);

alter table public.platform_aos_core_settings enable row level security;
revoke all on public.platform_aos_core_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Engine registry
-- ---------------------------------------------------------------------------
create table if not exists public.platform_aos_engines (
  id uuid primary key default gen_random_uuid(),
  engine_key text not null unique,
  engine_name text not null,
  engine_version text not null default '1.0.0',
  owner_team text not null default 'Aipify Platform',
  engine_status text not null default 'healthy' check (
    engine_status in ('healthy', 'attention_required', 'critical', 'disabled')
  ),
  dependencies jsonb not null default '[]'::jsonb,
  business_pack_usage jsonb not null default '[]'::jsonb,
  health_score integer not null default 85 check (health_score between 0 and 100),
  activity_summary text not null default '',
  module_registry_key text references public.aipify_module_registry (module_key) on delete set null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_aos_engines_status_idx
  on public.platform_aos_engines (engine_status, is_active);

alter table public.platform_aos_engines enable row level security;
revoke all on public.platform_aos_engines from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Dependencies, orchestration, event bus
-- ---------------------------------------------------------------------------
create table if not exists public.platform_aos_dependencies (
  id uuid primary key default gen_random_uuid(),
  source_key text not null,
  target_key text not null,
  dependency_type text not null check (
    dependency_type in ('engine', 'business_pack', 'connector', 'domain')
  ),
  relationship text not null default 'requires',
  is_circular_risk boolean not null default false,
  created_at timestamptz not null default now(),
  unique (source_key, target_key, dependency_type)
);

alter table public.platform_aos_dependencies enable row level security;
revoke all on public.platform_aos_dependencies from authenticated, anon;

create table if not exists public.platform_aos_orchestration_flows (
  id uuid primary key default gen_random_uuid(),
  flow_key text not null unique,
  title text not null,
  description text not null default '',
  engine_chain jsonb not null default '[]'::jsonb,
  trigger_event text not null default '',
  status text not null default 'active' check (status in ('active', 'paused', 'draft')),
  created_at timestamptz not null default now()
);

alter table public.platform_aos_orchestration_flows enable row level security;
revoke all on public.platform_aos_orchestration_flows from authenticated, anon;

create table if not exists public.platform_aos_event_bus_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  source_engine text not null,
  target_engines jsonb not null default '[]'::jsonb,
  summary text not null default '',
  payload_meta jsonb not null default '{}'::jsonb,
  published_at timestamptz not null default now()
);

create index if not exists platform_aos_event_bus_events_published_idx
  on public.platform_aos_event_bus_events (published_at desc);

alter table public.platform_aos_event_bus_events enable row level security;
revoke all on public.platform_aos_event_bus_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Feature flags & policies
-- ---------------------------------------------------------------------------
create table if not exists public.platform_aos_feature_flags (
  id uuid primary key default gen_random_uuid(),
  flag_key text not null unique,
  title text not null,
  description text not null default '',
  status text not null default 'disabled' check (status in ('enabled', 'disabled', 'beta', 'enterprise_only')),
  target_scope jsonb not null default '{}'::jsonb,
  rollout_pct integer not null default 0 check (rollout_pct between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_aos_feature_flags enable row level security;
revoke all on public.platform_aos_feature_flags from authenticated, anon;

create table if not exists public.platform_aos_policies (
  id uuid primary key default gen_random_uuid(),
  policy_key text not null unique,
  title text not null,
  policy_type text not null check (
    policy_type in ('security', 'governance', 'compliance', 'companion', 'marketplace', 'execution')
  ),
  policy_body text not null default '',
  is_enforced boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.platform_aos_policies enable row level security;
revoke all on public.platform_aos_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Health, governance, business pack registry view, audit
-- ---------------------------------------------------------------------------
create table if not exists public.platform_aos_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null check (
    scope_type in (
      'platform', 'engine', 'companion', 'marketplace', 'connector',
      'workflow', 'domain', 'system', 'business_pack'
    )
  ),
  scope_key text not null default '',
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'attention_required', 'critical')
  ),
  health_score integer not null default 85 check (health_score between 0 and 100),
  summary text not null default '',
  recorded_at timestamptz not null default now()
);

create index if not exists platform_aos_health_snapshots_scope_idx
  on public.platform_aos_health_snapshots (scope_type, recorded_at desc);

alter table public.platform_aos_health_snapshots enable row level security;
revoke all on public.platform_aos_health_snapshots from authenticated, anon;

create table if not exists public.platform_aos_governance_checks (
  id uuid primary key default gen_random_uuid(),
  check_type text not null check (
    check_type in (
      'permissions', 'roles', 'domain_access', 'business_pack_access',
      'connector_permissions', 'approval_rules', 'conflict', 'circular_dependency'
    )
  ),
  status text not null default 'passed' check (status in ('passed', 'failed', 'warning')),
  summary text not null default '',
  checked_at timestamptz not null default now()
);

alter table public.platform_aos_governance_checks enable row level security;
revoke all on public.platform_aos_governance_checks from authenticated, anon;

create table if not exists public.platform_aos_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'engine_registered', 'dependency_added', 'feature_enabled', 'feature_disabled',
      'policy_updated', 'platform_change', 'simulation_executed', 'health_updated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_aos_audit_logs_created_idx
  on public.platform_aos_audit_logs (created_at desc);

alter table public.platform_aos_audit_logs enable row level security;
revoke all on public.platform_aos_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._aos550_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._aos550_log(
  p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_aos_audit_logs (event_type, summary, context)
  values (p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._aos550_seed_engines()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_aos_engines (engine_key, engine_name, dependencies, business_pack_usage)
  values
    ('people', 'People Engine', '[]'::jsonb, '["hr","onboarding"]'::jsonb),
    ('customer', 'Customer Engine', '[]'::jsonb, '["support","crm","commerce"]'::jsonb),
    ('inventory', 'Inventory Engine', '["supplier"]'::jsonb, '["warehouse","commerce"]'::jsonb),
    ('asset', 'Asset Engine', '[]'::jsonb, '["property","field_service"]'::jsonb),
    ('project', 'Project Engine', '["people"]'::jsonb, '["professional_services","construction"]'::jsonb),
    ('finance', 'Finance Engine', '[]'::jsonb, '["accounting","finance_operations"]'::jsonb),
    ('risk', 'Risk Engine', '["governance"]'::jsonb, '["compliance","insurance"]'::jsonb),
    ('automation', 'Automation Engine', '["knowledge"]'::jsonb, '["all_packs"]'::jsonb),
    ('knowledge', 'Knowledge Engine', '[]'::jsonb, '["all_packs"]'::jsonb),
    ('companion', 'Companion Engine', '["knowledge","automation"]'::jsonb, '["all_packs"]'::jsonb),
    ('marketplace', 'Marketplace Engine', '["finance"]'::jsonb, '["platform"]'::jsonb),
    ('execution', 'Execution Engine', '["companion","automation"]'::jsonb, '["execution_operations"]'::jsonb)
  on conflict (engine_key) do nothing;

  insert into public.platform_aos_dependencies (source_key, target_key, dependency_type)
  values
    ('commerce_pack', 'inventory', 'business_pack'),
    ('commerce_pack', 'finance', 'business_pack'),
    ('warehouse_operations', 'inventory', 'business_pack'),
    ('warehouse_operations', 'supplier', 'business_pack'),
    ('inventory', 'supplier', 'engine'),
    ('companion', 'knowledge', 'engine'),
    ('companion', 'automation', 'engine'),
    ('execution', 'companion', 'engine')
  on conflict (source_key, target_key, dependency_type) do nothing;

  insert into public.platform_aos_orchestration_flows (flow_key, title, description, engine_chain, trigger_event)
  values
    ('new_employee', 'New Employee Onboarding', 'People → Asset → Training → Knowledge → Automation → Companion',
      '["people","asset","knowledge","automation","companion"]'::jsonb, 'employee.created'),
    ('customer_created', 'Customer Created', 'Customer → Project → Task → Notification → Companion',
      '["customer","project","automation","companion"]'::jsonb, 'customer.created'),
    ('action_execution', 'Execution Coordination', 'Permissions → Approvals → Execution → Audit',
      '["companion","execution","automation"]'::jsonb, 'action.requested')
  on conflict (flow_key) do nothing;

  insert into public.platform_aos_feature_flags (flag_key, title, description, status, target_scope)
  values
    ('new_dashboard', 'New Dashboard', 'Gradual rollout of executive dashboard refresh.', 'beta', '{"plans":["business","enterprise"]}'::jsonb),
    ('companion_skill_v2', 'Companion Skill v2', 'Enhanced Companion skill orchestration.', 'disabled', '{}'::jsonb),
    ('marketplace_feature_pack', 'Marketplace Feature Pack', 'New marketplace discovery features.', 'enabled', '{}'::jsonb),
    ('enterprise_governor_strict', 'Enterprise Governor Strict', 'Strict platform governor for enterprise tenants.', 'enterprise_only', '{"plans":["enterprise"]}'::jsonb)
  on conflict (flag_key) do nothing;

  insert into public.platform_aos_policies (policy_key, title, policy_type, policy_body)
  values
    ('companion_never_bypass', 'Companion Never Bypasses Governance', 'companion', 'Companion must verify permissions, roles, domain access, and approvals before any action.'),
    ('no_circular_dependencies', 'No Circular Dependencies', 'governance', 'Platform governor blocks circular engine and pack dependencies.'),
    ('execution_requires_approval', 'Execution Requires Approval', 'execution', 'Sensitive actions require explicit approval before execution engine runs.'),
    ('marketplace_certification', 'Marketplace Certification Required', 'marketplace', 'Business Packs must pass certification before marketplace publish.')
  on conflict (policy_key) do nothing;

  insert into public.platform_aos_health_snapshots (scope_type, scope_key, health_status, health_score, summary)
  select v.scope_type, v.scope_key, v.health_status, v.health_score, v.summary
  from (values
    ('platform', 'aos_core', 'healthy', 88, 'Platform operating system core healthy.'),
    ('companion', 'companion', 'healthy', 86, 'Companion governance layer active.'),
    ('marketplace', 'marketplace', 'healthy', 82, 'Marketplace engine stable.'),
    ('system', 'system', 'healthy', 90, 'System health nominal.')
  ) as v(scope_type, scope_key, health_status, health_score, summary)
  where not exists (
    select 1 from public.platform_aos_health_snapshots h
    where h.scope_type = v.scope_type and h.scope_key = v.scope_key
  );
end; $$;

select public._aos550_seed_engines();

-- ---------------------------------------------------------------------------
-- 7. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_aos_core_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_overview jsonb;
  v_engines jsonb;
  v_dependencies jsonb;
  v_orchestration jsonb;
  v_flags jsonb;
  v_policies jsonb;
  v_health jsonb;
  v_governance jsonb;
  v_events jsonb;
  v_packs jsonb;
  v_executive jsonb;
  v_reports jsonb;
  v_companion jsonb;
  v_enterprise jsonb;
  v_audit jsonb;
begin
  perform public._aos550_require_platform_admin();
  perform public._aos550_seed_engines();
  perform public._aos550_log('platform_change', 'AOS Core center viewed.', jsonb_build_object('section', p_section));

  select jsonb_build_object(
    'registered_engines', (select count(*) from public.platform_aos_engines where is_active),
    'healthy_engines', count(*) filter (where engine_status = 'healthy'),
    'attention_engines', count(*) filter (where engine_status = 'attention_required'),
    'critical_engines', count(*) filter (where engine_status = 'critical'),
    'disabled_engines', count(*) filter (where engine_status = 'disabled'),
    'dependencies', (select count(*) from public.platform_aos_dependencies),
    'orchestration_flows', (select count(*) from public.platform_aos_orchestration_flows where status = 'active'),
    'feature_flags', (select count(*) from public.platform_aos_feature_flags),
    'policies', (select count(*) from public.platform_aos_policies where is_enforced),
    'platform_health_score', coalesce((
      select health_score from public.platform_aos_health_snapshots
      where scope_type = 'platform' order by recorded_at desc limit 1
    ), 88)
  ) into v_overview
  from public.platform_aos_engines;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'engine_key', e.engine_key, 'engine_name', e.engine_name,
    'engine_version', e.engine_version, 'owner_team', e.owner_team,
    'engine_status', e.engine_status, 'dependencies', e.dependencies,
    'business_pack_usage', e.business_pack_usage, 'health_score', e.health_score,
    'activity_summary', e.activity_summary
  ) order by e.engine_name), '[]'::jsonb)
  into v_engines
  from public.platform_aos_engines e where e.is_active;

  select coalesce(jsonb_agg(jsonb_build_object(
    'source_key', d.source_key, 'target_key', d.target_key,
    'dependency_type', d.dependency_type, 'relationship', d.relationship,
    'is_circular_risk', d.is_circular_risk
  )), '[]'::jsonb)
  into v_dependencies
  from public.platform_aos_dependencies d;

  select coalesce(jsonb_agg(jsonb_build_object(
    'flow_key', f.flow_key, 'title', f.title, 'description', f.description,
    'engine_chain', f.engine_chain, 'trigger_event', f.trigger_event, 'status', f.status
  ) order by f.title), '[]'::jsonb)
  into v_orchestration
  from public.platform_aos_orchestration_flows f;

  select coalesce(jsonb_agg(jsonb_build_object(
    'flag_key', ff.flag_key, 'title', ff.title, 'description', ff.description,
    'status', ff.status, 'target_scope', ff.target_scope, 'rollout_pct', ff.rollout_pct
  ) order by ff.title), '[]'::jsonb)
  into v_flags
  from public.platform_aos_feature_flags ff;

  select coalesce(jsonb_agg(jsonb_build_object(
    'policy_key', p.policy_key, 'title', p.title, 'policy_type', p.policy_type,
    'is_enforced', p.is_enforced
  ) order by p.policy_type), '[]'::jsonb)
  into v_policies
  from public.platform_aos_policies p;

  select coalesce(jsonb_agg(jsonb_build_object(
    'scope_type', h.scope_type, 'scope_key', h.scope_key,
    'health_status', h.health_status, 'health_score', h.health_score, 'summary', h.summary
  ) order by h.recorded_at desc), '[]'::jsonb)
  into v_health
  from public.platform_aos_health_snapshots h
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'check_type', g.check_type, 'status', g.status, 'summary', g.summary, 'checked_at', g.checked_at
  ) order by g.checked_at desc), '[]'::jsonb)
  into v_governance
  from public.platform_aos_governance_checks g
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', ev.event_type, 'source_engine', ev.source_engine,
    'target_engines', ev.target_engines, 'summary', ev.summary, 'published_at', ev.published_at
  ) order by ev.published_at desc), '[]'::jsonb)
  into v_events
  from public.platform_aos_event_bus_events ev
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', c.pack_key, 'pack_name', c.pack_name, 'category', c.category,
    'industry_key', c.industry_key, 'version', c.version, 'is_available', c.is_available
  ) order by c.pack_name), '[]'::jsonb)
  into v_packs
  from public.aipify_marketplace_operations_catalog c;

  select jsonb_build_object(
    'platform_health', v_overview->'platform_health_score',
    'engine_health', v_overview->'healthy_engines',
    'marketplace_health', 82,
    'companion_health', 86,
    'business_pack_health', 'stable',
    'license_health', 'stable',
    'risk_summary', 'low'
  ) into v_executive;

  select jsonb_build_object(
    'platform_usage', jsonb_build_object('engines', v_overview->'registered_engines'),
    'engine_activity', v_engines,
    'business_pack_adoption', v_packs,
    'dependency_analysis', v_dependencies,
    'feature_flag_usage', v_flags,
    'platform_growth', 'stable'
  ) into v_reports;

  select jsonb_build_object(
    'advisor_prompts', jsonb_build_array(
      'Which engines are overloaded?',
      'Which packs create most value?',
      'What dependencies exist?',
      'What systems need attention?',
      'Generate platform health report.'
    ),
    'governance_layer', jsonb_build_object(
      'companion_verifies', jsonb_build_array(
        'permissions', 'roles', 'domain_access', 'business_pack_access',
        'connector_permissions', 'approval_rules'
      ),
      'never_bypasses', true
    ),
    'simulation_integration', jsonb_build_object(
      'connected', true, 'phase', '543', 'route', '/app/simulation'
    )
  ) into v_companion;

  select jsonb_build_object(
    'scalability', 'enterprise_ready',
    'performance', 'stable',
    'security', 'governed',
    'compliance', 'active',
    'governance', 'enforced',
    'availability', '99.9% target',
    'disaster_recovery', 'documented',
    'maturity_score', 84
  ) into v_enterprise;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.platform_aos_audit_logs a
  limit 40;

  return jsonb_build_object(
    'found', true,
    'principle', 'Every engine should work independently. Every engine should also work together. Aipify must behave as one platform.',
    'philosophy', 'Aipify is a true Business Operating System — every engine connected, every pack coordinated, every action governed.',
    'section', coalesce(nullif(p_section, ''), 'overview'),
    'overview', v_overview,
    'engine_registry', v_engines,
    'orchestration', jsonb_build_object('flows', v_orchestration, 'event_bus', v_events),
    'dependency_engine', jsonb_build_object('dependencies', v_dependencies),
    'platform_governor', jsonb_build_object(
      'enabled', true,
      'protects', jsonb_build_array(
        'conflicting_workflows', 'duplicate_automations', 'circular_dependencies',
        'invalid_installations', 'governance_violations'
      ),
      'recent_checks', v_governance
    ),
    'feature_flags', v_flags,
    'platform_health', v_health,
    'platform_health_center', v_health,
    'companion_governance', v_companion->'governance_layer',
    'execution_coordination', (
      select coalesce(to_jsonb(f), '{}'::jsonb)
      from public.platform_aos_orchestration_flows f where f.flow_key = 'action_execution'
    ),
    'cross_engine_messaging', v_events,
    'event_bus', jsonb_build_object('recent_events', v_events),
    'business_pack_registry', v_packs,
    'platform_policies', v_policies,
    'simulation_integration', v_companion->'simulation_integration',
    'companion_advisor', v_companion,
    'enterprise_readiness', v_enterprise,
    'executive_dashboard', v_executive,
    'reports', v_reports,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'supported', true,
      'capabilities', jsonb_build_array(
        'review_platform_health', 'review_engines', 'review_dependencies',
        'review_governance', 'review_rollouts'
      )
    ),
    'routes', jsonb_build_object(
      'aos_core', '/platform/aos-core',
      'engines', '/platform/aos-core/engines',
      'features', '/platform/aos-core/features',
      'business_pack_factory', '/platform/business-pack-factory',
      'platform_health', '/platform/operations/platform-health'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_platform_aos_core_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text := coalesce(p_payload->>'action', '');
  v_key text := nullif(p_payload->>'engine_key', '');
  v_flag text := nullif(p_payload->>'flag_key', '');
begin
  perform public._aos550_require_platform_admin();

  if v_action = 'register_engine' then
    insert into public.platform_aos_engines (engine_key, engine_name, owner_team)
    values (
      coalesce(v_key, lower(replace(p_payload->>'engine_name', ' ', '_'))),
      coalesce(p_payload->>'engine_name', 'New Engine'),
      coalesce(p_payload->>'owner_team', 'Aipify Platform')
    ) on conflict (engine_key) do nothing;
    perform public._aos550_log('engine_registered', 'Engine registered in AOS Core.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'add_dependency' then
    insert into public.platform_aos_dependencies (source_key, target_key, dependency_type)
    values (
      coalesce(p_payload->>'source_key', ''),
      coalesce(p_payload->>'target_key', ''),
      coalesce(p_payload->>'dependency_type', 'engine')
    ) on conflict (source_key, target_key, dependency_type) do nothing;
    perform public._aos550_log('dependency_added', 'Dependency registered.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'enable_feature' and v_flag is not null then
    update public.platform_aos_feature_flags set status = 'enabled', updated_at = now() where flag_key = v_flag;
    perform public._aos550_log('feature_enabled', 'Feature flag enabled.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'disable_feature' and v_flag is not null then
    update public.platform_aos_feature_flags set status = 'disabled', updated_at = now() where flag_key = v_flag;
    perform public._aos550_log('feature_disabled', 'Feature flag disabled.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'refresh_health' then
    insert into public.platform_aos_health_snapshots (scope_type, scope_key, health_status, health_score, summary)
    values (
      'platform', 'aos_core', 'healthy',
      coalesce((p_payload->>'health_score')::int, 88),
      'Platform health refreshed from AOS Core.'
    );
    perform public._aos550_log('health_updated', 'Platform health updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'run_simulation' then
    perform public._aos550_log('simulation_executed', 'Platform simulation executed via Digital Twin integration.', p_payload);
    return jsonb_build_object('ok', true, 'simulation_ref', 'phase_543');
  end if;

  if v_action = 'publish_event' then
    insert into public.platform_aos_event_bus_events (event_type, source_engine, target_engines, summary)
    values (
      coalesce(p_payload->>'event_type', 'platform.event'),
      coalesce(p_payload->>'source_engine', 'aos_core'),
      coalesce(p_payload->'target_engines', '[]'::jsonb),
      coalesce(p_payload->>'summary', 'Event published to platform bus.')
    );
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_platform_aos_core_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._aos550_require_platform_admin();
  return jsonb_build_object(
    'found', true,
    'critical_engines', (select count(*)::int from public.platform_aos_engines where engine_status = 'critical'),
    'attention_engines', (select count(*)::int from public.platform_aos_engines where engine_status = 'attention_required'),
    'circular_risks', (select count(*)::int from public.platform_aos_dependencies where is_circular_risk),
    'failed_governance', (select count(*)::int from public.platform_aos_governance_checks where status = 'failed'),
    'platform_health_score', coalesce((
      select health_score from public.platform_aos_health_snapshots
      where scope_type = 'platform' order by recorded_at desc limit 1
    ), 88),
    'routes', jsonb_build_object('aos_core', '/platform/aos-core')
  );
end; $$;

grant execute on function public.get_platform_aos_core_center(text) to authenticated;
grant execute on function public.perform_platform_aos_core_action(jsonb) to authenticated;
grant execute on function public.get_platform_aos_core_mobile_summary() to authenticated;
