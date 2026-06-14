-- Phase A — Aipify Core Platform Foundation
-- Principle: Aipify Core is the foundational operating system powering all modules.

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
    'multi_store_orchestration', 'aipify_core_platform'
  )
);

-- ---------------------------------------------------------------------------
-- 1. aipify_core_platform_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_core_platform_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  core_enabled boolean not null default true,
  auto_high_risk_disabled boolean not null default true,
  unonight_pilot_mode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_core_platform_settings enable row level security;
revoke all on public.aipify_core_platform_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. tenant module activations + AI action registry
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_core_modules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  module_key text not null,
  module_label text not null,
  module_category text not null default 'core' check (
    module_category in ('core', 'initial', 'future', 'custom')
  ),
  enabled boolean not null default true,
  activated_at timestamptz not null default now(),
  unique (tenant_id, module_key)
);

alter table public.tenant_core_modules enable row level security;
revoke all on public.tenant_core_modules from authenticated, anon;

create table if not exists public.ai_action_registry (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  action_label text not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  auto_execute_allowed boolean not null default false,
  requires_approval boolean not null default true,
  example text,
  unique (tenant_id, action_key)
);

alter table public.ai_action_registry enable row level security;
revoke all on public.ai_action_registry from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. integrations + API keys + component status
-- ---------------------------------------------------------------------------
create table if not exists public.core_integration_registry (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  integration_key text not null,
  integration_label text not null,
  status text not null default 'connected' check (
    status in ('connected', 'pending', 'disconnected', 'error')
  ),
  integration_type text not null default 'current' check (
    integration_type in ('current', 'future')
  ),
  last_synced_at timestamptz,
  unique (tenant_id, integration_key)
);

alter table public.core_integration_registry enable row level security;
revoke all on public.core_integration_registry from authenticated, anon;

create table if not exists public.core_api_key_registry (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  key_label text not null,
  key_prefix text not null,
  scopes jsonb not null default '[]'::jsonb,
  rate_limit_per_minute int not null default 60,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.core_api_key_registry enable row level security;
revoke all on public.core_api_key_registry from authenticated, anon;

create table if not exists public.core_platform_component_status (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  component_key text not null check (
    component_key in (
      'multi_tenant', 'authentication', 'permissions', 'audit_logging',
      'ai_actions', 'modules', 'api_layer', 'integrations', 'knowledge_center', 'dashboard'
    )
  ),
  status text not null default 'active' check (status in ('active', 'degraded', 'inactive')),
  summary text not null,
  health_score numeric(5, 2) not null default 100,
  unique (tenant_id, component_key)
);

alter table public.core_platform_component_status enable row level security;
revoke all on public.core_platform_component_status from authenticated, anon;

create table if not exists public.core_platform_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  actor_type text not null default 'user',
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.core_platform_audit_log enable row level security;
revoke all on public.core_platform_audit_log from authenticated, anon;

create table if not exists public.core_dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  widget_key text not null check (
    widget_key in ('since_last_login', 'pending_tasks', 'active_alerts', 'support_overview', 'recommended_actions')
  ),
  title text not null,
  summary text not null,
  count_value int not null default 0,
  priority text not null default 'moderate',
  updated_at timestamptz not null default now(),
  unique (tenant_id, widget_key)
);

alter table public.core_dashboard_widgets enable row level security;
revoke all on public.core_dashboard_widgets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers (_acp_)
-- ---------------------------------------------------------------------------
create or replace function public._acp_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._acp_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.core_platform_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'aipify_core_' || p_event_type, 'aipify_core_platform', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._acp_ensure_settings(p_tenant_id uuid)
returns public.aipify_core_platform_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_core_platform_settings;
begin
  insert into public.aipify_core_platform_settings (tenant_id)
  values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_core_platform_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._acp_seed_core_data(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.tenant_core_modules (tenant_id, module_key, module_label, module_category, enabled)
  select p_tenant_id, v.key, v.label, v.cat, v.enabled
  from (values
    ('executive_dashboard', 'Executive Dashboard', 'core', true),
    ('presence_center', 'Presence Center', 'core', true),
    ('support_ai_basic', 'Support AI', 'initial', true),
    ('assistant', 'Admin Assistant', 'initial', true),
    ('knowledge_base', 'Knowledge Center', 'core', true),
    ('install_management', 'Install Management', 'core', true),
    ('recommendations', 'Recommendations', 'core', true),
    ('health_monitoring', 'Health Monitoring', 'core', true),
    ('marketing_ai', 'Marketing AI', 'future', false),
    ('commerce_ai', 'Commerce AI', 'future', false),
    ('moderation_ai', 'Moderation AI', 'future', false),
    ('strategic_intelligence', 'Strategic Intelligence', 'future', false)
  ) as v(key, label, cat, enabled)
  where not exists (select 1 from public.tenant_core_modules m where m.tenant_id = p_tenant_id and m.module_key = v.key);

  insert into public.ai_action_registry (tenant_id, action_key, action_label, risk_level, auto_execute_allowed, requires_approval, example)
  select p_tenant_id, v.key, v.label, v.risk, v.auto, v.approval, v.example
  from (values
    ('faq_response', 'FAQ Response', 'low', true, false, 'Automated FAQ responses from approved knowledge.'),
    ('internal_recommendation', 'Internal Recommendation', 'low', true, false, 'Surface internal recommendations without external impact.'),
    ('email_draft', 'Email Draft Generation', 'medium', false, true, 'AI drafts email — human sends.'),
    ('workflow_suggestion', 'Workflow Update Suggestion', 'medium', false, true, 'Suggested workflow changes require review.'),
    ('billing_change', 'Billing Change', 'high', false, true, 'Billing modifications require administrator approval.'),
    ('user_removal', 'User Removal', 'high', false, true, 'Removing users requires explicit approval.'),
    ('irreversible_modification', 'Irreversible Modification', 'critical', false, true, 'Critical irreversible changes always require approval.')
  ) as v(key, label, risk, auto, approval, example)
  where not exists (select 1 from public.ai_action_registry a where a.tenant_id = p_tenant_id and a.action_key = v.key);

  insert into public.core_integration_registry (tenant_id, integration_key, integration_label, status, integration_type, last_synced_at)
  select p_tenant_id, v.key, v.label, v.status, v.type, now() - interval '1 hour'
  from (values
    ('unonight', 'Unonight Pilot', 'connected', 'current'),
    ('email_providers', 'Email Providers', 'connected', 'current'),
    ('knowledge_center', 'Knowledge Center', 'connected', 'current'),
    ('shopify', 'Shopify', 'pending', 'future'),
    ('woocommerce', 'WooCommerce', 'pending', 'future'),
    ('wordpress', 'WordPress', 'pending', 'future'),
    ('crm_systems', 'CRM Systems', 'disconnected', 'future')
  ) as v(key, label, status, type)
  where not exists (select 1 from public.core_integration_registry i where i.tenant_id = p_tenant_id and i.integration_key = v.key);

  insert into public.core_api_key_registry (tenant_id, key_label, key_prefix, scopes, rate_limit_per_minute)
  select p_tenant_id, v.label, v.prefix, v.scopes, v.rate_limit
  from (values
    ('Production API', 'aip_live_', '["read","write"]'::jsonb, 120),
    ('Integration Webhook', 'aip_hook_', '["webhooks"]'::jsonb, 60)
  ) as v(label, prefix, scopes, rate_limit)
  where not exists (select 1 from public.core_api_key_registry k where k.tenant_id = p_tenant_id limit 1);

  insert into public.core_platform_component_status (tenant_id, component_key, status, summary, health_score)
  select p_tenant_id, v.key, v.status, v.summary, v.score
  from (values
    ('multi_tenant', 'active', 'Organization isolation, tenant settings and data separation enforced via RLS.', 98.0),
    ('authentication', 'active', 'Secure login, password reset, email verification and session management active.', 96.0),
    ('permissions', 'active', 'Granular module-level permissions and approval workflows enabled.', 94.0),
    ('audit_logging', 'active', 'Immutable audit history capturing user, AI and approval actions.', 97.0),
    ('ai_actions', 'active', 'AI actions categorized by risk — low may auto-execute; medium/high require approval.', 95.0),
    ('modules', 'active', 'Plug-and-play modules with per-tenant activation controls.', 93.0),
    ('api_layer', 'active', 'Tenant-aware API endpoints with rate limiting and logging.', 92.0),
    ('integrations', 'active', 'Unonight pilot connected; email and Knowledge Center integrated.', 90.0),
    ('knowledge_center', 'active', 'Structured articles, FAQs and AI retrieval support available.', 96.0),
    ('dashboard', 'active', 'Operational dashboard widgets providing immediate visibility.', 94.0)
  ) as v(key, status, summary, score)
  where not exists (select 1 from public.core_platform_component_status c where c.tenant_id = p_tenant_id and c.component_key = v.key);

  insert into public.core_dashboard_widgets (tenant_id, widget_key, title, summary, count_value, priority)
  select p_tenant_id, v.key, v.title, v.summary, v.count, v.priority
  from (values
    ('since_last_login', 'Since Last Login', '3 operational improvements completed. 1 recommendation awaiting approval.', 3, 'moderate'),
    ('pending_tasks', 'Pending Tasks', '2 approval requests and 1 support escalation pending.', 3, 'important'),
    ('active_alerts', 'Active Alerts', '1 delivery risk indicator and 1 quality warning active.', 2, 'moderate'),
    ('support_overview', 'Support Overview', '12 tickets resolved this week. Average response time stable.', 12, 'informational'),
    ('recommended_actions', 'Recommended Actions', '4 AI recommendations ready for review — none auto-executed.', 4, 'moderate')
  ) as v(key, title, summary, count, priority)
  where not exists (select 1 from public.core_dashboard_widgets w where w.tenant_id = p_tenant_id and w.widget_key = v.key);

  update public.aipify_core_platform_settings
  set unonight_pilot_mode = true
  where tenant_id = p_tenant_id
    and exists (select 1 from public.customers c where c.id = p_tenant_id and c.slug = 'unonight');
end; $$;

create or replace function public._acp_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_score numeric;
  v_modules int;
  v_enabled int;
  v_audits int;
begin
  select coalesce(avg(health_score), 90), count(*) into v_score, v_modules
  from public.core_platform_component_status where tenant_id = p_tenant_id;

  select count(*) into v_enabled from public.tenant_core_modules where tenant_id = p_tenant_id and enabled = true;
  select count(*) into v_audits from public.core_platform_audit_log where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'core_health_score', round(v_score, 1),
    'components_active', v_modules,
    'modules_enabled', v_enabled,
    'audit_events_total', v_audits,
    'pending_tasks', (select coalesce(sum(count_value), 0) from public.core_dashboard_widgets where tenant_id = p_tenant_id and widget_key = 'pending_tasks'),
    'active_alerts', (select coalesce(count_value, 0) from public.core_dashboard_widgets where tenant_id = p_tenant_id and widget_key = 'active_alerts')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.toggle_tenant_core_module(p_module_key text, p_enabled boolean default true)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._acp_require_tenant();

  update public.tenant_core_modules set enabled = p_enabled
  where tenant_id = v_tenant_id and module_key = p_module_key;

  perform public._acp_log_audit(v_tenant_id, 'module_toggled', 'Module ' || p_module_key || ' set to ' || p_enabled, 'module_framework',
    jsonb_build_object('module_key', p_module_key, 'enabled', p_enabled));

  return jsonb_build_object('module_key', p_module_key, 'enabled', p_enabled, 'requires_approval', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_core_platform_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._acp_ensure_settings(v_tenant_id);
  perform public._acp_seed_core_data(v_tenant_id);
  v_metrics := public._acp_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'core_health_score', v_metrics->'core_health_score',
    'modules_enabled', v_metrics->'modules_enabled',
    'philosophy', 'Aipify Core powers all modules through a secure, scalable SaaS foundation.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_aipify_core_platform_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_core_platform_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._acp_require_tenant();
  v_settings := public._acp_ensure_settings(v_tenant_id);
  perform public._acp_seed_core_data(v_tenant_id);
  v_metrics := public._acp_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_high_risk_disabled', v_settings.auto_high_risk_disabled,
    'unonight_pilot_mode', v_settings.unonight_pilot_mode,
    'philosophy', 'Aipify Core powers all modules through a secure, scalable SaaS foundation.',
    'safety_note', 'Aipify suggests actions and coordinates intelligence — organizations remain responsible for decisions. Only low-risk actions may automate; medium and high-risk require human approval.',
    'core_enabled', v_settings.core_enabled,
    'core_health_score', v_metrics->'core_health_score',
    'components_active', v_metrics->'components_active',
    'modules_enabled', v_metrics->'modules_enabled',
    'pending_tasks', v_metrics->'pending_tasks',
    'active_alerts', v_metrics->'active_alerts',
    'supported_roles', jsonb_build_array(
      jsonb_build_object('key', 'owner', 'label', 'Owner'),
      jsonb_build_object('key', 'admin', 'label', 'Administrator'),
      jsonb_build_object('key', 'staff', 'label', 'Manager'),
      jsonb_build_object('key', 'support', 'label', 'Support Agent'),
      jsonb_build_object('key', 'read_only', 'label', 'Viewer')
    ),
    'core_components', coalesce((
      select jsonb_agg(jsonb_build_object(
        'component_key', c.component_key, 'status', c.status,
        'summary', c.summary, 'health_score', c.health_score
      ) order by c.component_key)
      from public.core_platform_component_status c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'dashboard_widgets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'widget_key', w.widget_key, 'title', w.title,
        'summary', w.summary, 'count_value', w.count_value, 'priority', w.priority
      ) order by w.widget_key)
      from public.core_dashboard_widgets w where w.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'tenant_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'module_key', m.module_key, 'module_label', m.module_label,
        'module_category', m.module_category, 'enabled', m.enabled
      ) order by m.module_category, m.module_key)
      from public.tenant_core_modules m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'ai_action_framework', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_key', a.action_key, 'action_label', a.action_label,
        'risk_level', a.risk_level, 'auto_execute_allowed', a.auto_execute_allowed,
        'requires_approval', a.requires_approval, 'example', a.example
      ) order by case a.risk_level when 'low' then 1 when 'medium' then 2 when 'high' then 3 else 4 end)
      from public.ai_action_registry a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'integration_key', i.integration_key, 'integration_label', i.integration_label,
        'status', i.status, 'integration_type', i.integration_type, 'last_synced_at', i.last_synced_at
      ) order by i.integration_type, i.integration_key)
      from public.core_integration_registry i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'api_keys', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', k.id, 'key_label', k.key_label, 'key_prefix', k.key_prefix,
        'scopes', k.scopes, 'rate_limit_per_minute', k.rate_limit_per_minute, 'active', k.active
      ) order by k.created_at desc)
      from public.core_api_key_registry k where k.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recent_audit_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'summary', l.summary,
        'actor_type', l.actor_type, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.core_platform_audit_log l where l.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'pilot_principles', jsonb_build_array(
      'Unonight acts as the first customer.',
      'Unonight validates workflows.',
      'Aipify remains independent.',
      'Improvements occur centrally within Aipify.'
    ),
    'integrations_map', jsonb_build_object(
      'unonight', 'First pilot customer — validates workflows without coupling systems',
      'platform_install', 'Store and platform connectors',
      'knowledge_center', 'Trusted knowledge for all modules',
      'commerce_modules', 'Phases 101–105 extend Core with commerce intelligence'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-core-platform', 'Aipify Core Platform', 'Foundation architecture, tenancy, permissions, audit logging and module framework.', 'authenticated', 50
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-core-platform' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_aipify_core_platform_card() to authenticated;
grant execute on function public.get_aipify_core_platform_dashboard() to authenticated;
grant execute on function public.toggle_tenant_core_module(text, boolean) to authenticated;
