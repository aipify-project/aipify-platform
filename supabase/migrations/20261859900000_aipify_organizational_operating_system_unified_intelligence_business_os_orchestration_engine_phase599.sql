-- Phase 599 — Aipify Organizational Operating System (AOS), Unified Intelligence Layer & Business OS Orchestration Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/aos/*
-- Helpers: _aos599_*

create table if not exists public.organization_aos599_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  aos_center_enabled boolean not null default true,
  unified_org_model_enabled boolean not null default true,
  entity_engine_enabled boolean not null default true,
  cross_module_intelligence_enabled boolean not null default true,
  intelligence_bus_enabled boolean not null default true,
  global_search_enabled boolean not null default true,
  global_reporting_enabled boolean not null default true,
  executive_command_mode_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_aos599_settings enable row level security;
revoke all on public.organization_aos599_settings from authenticated, anon;

create table if not exists public.organization_aos599_org_dimensions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dimension_key text not null,
  dimension_title text not null,
  dimension_type text not null check (
    dimension_type in (
      'organization', 'department', 'user', 'role', 'license', 'domain',
      'business_pack', 'integration', 'customer', 'partner', 'project'
    )
  ),
  dimension_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, dimension_key)
);

alter table public.organization_aos599_org_dimensions enable row level security;
revoke all on public.organization_aos599_org_dimensions from authenticated, anon;

create table if not exists public.organization_aos599_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_key text not null,
  entity_title text not null,
  entity_type text not null check (
    entity_type in (
      'customer', 'vendor', 'contract', 'project', 'invoice', 'knowledge_asset',
      'decision', 'business_pack', 'employee', 'digital_employee'
    )
  ),
  relationship_summary text not null default '' check (char_length(relationship_summary) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, entity_key)
);

alter table public.organization_aos599_entities enable row level security;
revoke all on public.organization_aos599_entities from authenticated, anon;

create table if not exists public.organization_aos599_cross_module_chains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  chain_key text not null,
  chain_title text not null,
  chain_stage text not null check (
    chain_stage in ('trigger', 'risk', 'impact', 'revenue', 'executive_alert', 'forecast', 'review')
  ),
  chain_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, chain_key)
);

alter table public.organization_aos599_cross_module_chains enable row level security;
revoke all on public.organization_aos599_cross_module_chains from authenticated, anon;

create table if not exists public.organization_aos599_awareness_states (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  state_key text not null,
  state_title text not null,
  state_type text not null check (
    state_type in (
      'current_state', 'historical_state', 'future_risk', 'future_opportunity',
      'organizational_context', 'business_pack_context', 'system_context'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, state_key)
);

alter table public.organization_aos599_awareness_states enable row level security;
revoke all on public.organization_aos599_awareness_states from authenticated, anon;

create table if not exists public.organization_aos599_executive_questions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question_key text not null,
  question_text text not null,
  question_type text not null check (
    question_type in ('what_changed', 'what_matters', 'requires_action', 'what_next')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, question_key)
);

alter table public.organization_aos599_executive_questions enable row level security;
revoke all on public.organization_aos599_executive_questions from authenticated, anon;

create table if not exists public.organization_aos599_business_pack_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  shared_capability text not null check (
    shared_capability in (
      'identity', 'permissions', 'governance', 'events', 'billing', 'reporting', 'knowledge'
    )
  ),
  link_status text not null default 'connected',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key, shared_capability)
);

alter table public.organization_aos599_business_pack_links enable row level security;
revoke all on public.organization_aos599_business_pack_links from authenticated, anon;

create table if not exists public.organization_aos599_twin_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connection_key text not null,
  connection_title text not null,
  connection_domain text not null check (
    connection_domain in (
      'digital_twin', 'knowledge', 'revenue', 'execution', 'resources', 'risk', 'strategy'
    )
  ),
  connection_status text not null default 'linked',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, connection_key)
);

alter table public.organization_aos599_twin_connections enable row level security;
revoke all on public.organization_aos599_twin_connections from authenticated, anon;

create table if not exists public.organization_aos599_global_context (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  context_key text not null,
  context_title text not null,
  context_type text not null check (
    context_type in (
      'organization_summary', 'priorities', 'major_risks', 'major_opportunities',
      'leadership_briefing', 'board_briefing'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, context_key)
);

alter table public.organization_aos599_global_context enable row level security;
revoke all on public.organization_aos599_global_context from authenticated, anon;

create table if not exists public.organization_aos599_search_domains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null,
  domain_title text not null,
  domain_type text not null check (
    domain_type in (
      'knowledge', 'contracts', 'customers', 'partners', 'invoices', 'projects',
      'policies', 'tasks', 'approvals', 'events', 'business_packs'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, domain_key)
);

alter table public.organization_aos599_search_domains enable row level security;
revoke all on public.organization_aos599_search_domains from authenticated, anon;

create table if not exists public.organization_aos599_report_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  report_type text not null check (
    report_type in (
      'operational', 'executive', 'board', 'customer', 'partner', 'compliance', 'financial'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, report_key)
);

alter table public.organization_aos599_report_types enable row level security;
revoke all on public.organization_aos599_report_types from authenticated, anon;

create table if not exists public.organization_aos599_health_dimensions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_key text not null,
  health_title text not null,
  health_type text not null check (
    health_type in (
      'revenue', 'customer', 'knowledge', 'compliance', 'execution', 'resource', 'risk'
    )
  ),
  health_score integer not null default 75 check (health_score between 0 and 100),
  health_band text not null default 'healthy' check (
    health_band in ('excellent', 'healthy', 'attention', 'risk')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, health_key)
);

alter table public.organization_aos599_health_dimensions enable row level security;
revoke all on public.organization_aos599_health_dimensions from authenticated, anon;

create table if not exists public.organization_aos599_intelligence_bus (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_type text not null check (
    signal_type in (
      'revenue_event', 'customer_success', 'executive_alert', 'forecast_update',
      'risk_review', 'cross_module', 'orchestration', 'recommendation'
    )
  ),
  signal_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, signal_key)
);

alter table public.organization_aos599_intelligence_bus enable row level security;
revoke all on public.organization_aos599_intelligence_bus from authenticated, anon;

create table if not exists public.organization_aos599_orchestration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  orchestration_key text not null,
  orchestration_title text not null,
  orchestration_type text not null check (
    orchestration_type in (
      'companion_interface', 'module_coordination', 'command_center', 'event_bus',
      'knowledge_fabric', 'governance', 'executive_mode'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, orchestration_key)
);

alter table public.organization_aos599_orchestration enable row level security;
revoke all on public.organization_aos599_orchestration from authenticated, anon;

create table if not exists public.organization_aos599_api_capabilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capability_key text not null,
  capability_title text not null,
  capability_type text not null check (
    capability_type in ('partners', 'extensions', 'marketplace', 'enterprise_integrations', 'external_systems')
  ),
  readiness_status text not null default 'prepared',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, capability_key)
);

alter table public.organization_aos599_api_capabilities enable row level security;
revoke all on public.organization_aos599_api_capabilities from authenticated, anon;

create table if not exists public.organization_aos599_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'aos_orchestration',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_aos599_audit_logs enable row level security;
revoke all on public.organization_aos599_audit_logs from authenticated, anon;

create or replace function public._aos599_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._aos599_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'aos_orchestration'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_aos599_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'aos_orchestration'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._aos599_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_aos599_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._aos599_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._aos599_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_aos599_org_dimensions where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_aos599_org_dimensions (
    organization_id, dimension_key, dimension_title, dimension_type, summary
  ) values
    (p_org_id, 'org_root', 'Organization', 'organization', 'One organizational model — no duplicated ownership structures.'),
    (p_org_id, 'dept_ops', 'Operations', 'department', 'Operations department scope.'),
    (p_org_id, 'dept_exec', 'Executive', 'department', 'Executive leadership scope.'),
    (p_org_id, 'role_owner', 'Owner', 'role', 'Tenant owner role mapping.'),
    (p_org_id, 'role_admin', 'Admin', 'role', 'Administrator role mapping.'),
    (p_org_id, 'lic_business', 'Business License', 'license', 'Licensed modules and capacity.'),
    (p_org_id, 'domain_primary', 'Primary Domain', 'domain', 'Verified installation domain.'),
    (p_org_id, 'pack_support', 'Support Pack', 'business_pack', 'Business Pack in unified ecosystem.'),
    (p_org_id, 'int_hub', 'Integration Hub', 'integration', 'Connected external systems.'),
    (p_org_id, 'cust_pilot', 'Pilot Customer', 'customer', 'Customer in org model.'),
    (p_org_id, 'partner_growth', 'Growth Partner', 'partner', 'Partner in org model.'),
    (p_org_id, 'proj_rollout', 'Platform Rollout', 'project', 'Active project context.');

  insert into public.organization_aos599_entities (
    organization_id, entity_key, entity_title, entity_type, relationship_summary, summary
  ) values
    (p_org_id, 'ent_customer', 'Enterprise Customer', 'customer', 'Linked to revenue and success modules.', 'Customer entity in unified graph.'),
    (p_org_id, 'ent_vendor', 'Strategic Vendor', 'vendor', 'Linked to contracts and risk.', 'Vendor entity.'),
    (p_org_id, 'ent_contract', 'Master Agreement', 'contract', 'Expiring contract triggers cross-module chain.', 'Contract entity.'),
    (p_org_id, 'ent_project', 'Transformation Project', 'project', 'Impacts execution and resources.', 'Project entity.'),
    (p_org_id, 'ent_invoice', 'Renewal Invoice', 'invoice', 'Revenue signal on intelligence bus.', 'Invoice entity.'),
    (p_org_id, 'ent_knowledge', 'Policy Knowledge Asset', 'knowledge_asset', 'Connected to Knowledge Fabric.', 'Knowledge asset entity.'),
    (p_org_id, 'ent_decision', 'Expansion Decision', 'decision', 'Decision Support Engine link.', 'Decision entity.'),
    (p_org_id, 'ent_pack', 'Hosts Business Pack', 'business_pack', 'Orchestrated pack in ecosystem.'),
    (p_org_id, 'ent_employee', 'Operations Lead', 'employee', 'Human accountability preserved.'),
    (p_org_id, 'ent_digital', 'Support Digital Employee', 'digital_employee', 'Governed digital workforce entity.');

  insert into public.organization_aos599_cross_module_chains (
    organization_id, chain_key, chain_title, chain_stage, summary
  ) values
    (p_org_id, 'chain_contract', 'Contract Expiring', 'trigger', 'Contract expiry detected.'),
    (p_org_id, 'chain_vendor', 'Vendor Risk', 'risk', 'Vendor risk elevated from contract context.'),
    (p_org_id, 'chain_project', 'Project Impact', 'impact', 'Project timeline affected.'),
    (p_org_id, 'chain_revenue', 'Revenue Impact', 'revenue', 'Revenue forecast updated.'),
    (p_org_id, 'chain_exec', 'Executive Alert', 'executive_alert', 'Executive alert prepared — human decides.');

  insert into public.organization_aos599_awareness_states (
    organization_id, state_key, state_title, state_type, summary
  ) values
    (p_org_id, 'aware_current', 'Current State', 'current_state', 'Companion understands current organizational state.'),
    (p_org_id, 'aware_history', 'Historical State', 'historical_state', 'Trend context from approved metadata.'),
    (p_org_id, 'aware_risk', 'Future Risks', 'future_risk', 'Forward-looking risk awareness.'),
    (p_org_id, 'aware_opp', 'Future Opportunities', 'future_opportunity', 'Growth opportunities surfaced.'),
    (p_org_id, 'aware_org', 'Organizational Context', 'organizational_context', 'Whole-organization context for Companion.'),
    (p_org_id, 'aware_pack', 'Business Pack Context', 'business_pack_context', 'Pack-scoped orchestration context.'),
    (p_org_id, 'aware_sys', 'System Context', 'system_context', 'Platform and integration context.');

  insert into public.organization_aos599_executive_questions (
    organization_id, question_key, question_text, question_type, summary
  ) values
    (p_org_id, 'q_changed', 'What changed?', 'what_changed', 'Executive operating model — change summary.'),
    (p_org_id, 'q_matters', 'What matters?', 'what_matters', 'Prioritized signal for leadership.'),
    (p_org_id, 'q_action', 'What requires action?', 'requires_action', 'Items needing human approval.'),
    (p_org_id, 'q_next', 'What should happen next?', 'what_next', 'Recommended next step — user decides.');

  insert into public.organization_aos599_business_pack_links (
    organization_id, pack_key, pack_title, shared_capability, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 'identity', 'Shared identity across packs.'),
    (p_org_id, 'support', 'Support Pack', 'permissions', 'Shared permissions model.'),
    (p_org_id, 'support', 'Support Pack', 'governance', 'Shared governance policies.'),
    (p_org_id, 'finance', 'Finance Pack', 'billing', 'Shared billing orchestration.'),
    (p_org_id, 'hosts', 'Hosts Pack', 'events', 'Shared event bus participation.'),
    (p_org_id, 'commerce', 'Commerce Pack', 'reporting', 'Cross-module reporting enabled.'),
    (p_org_id, 'knowledge', 'Knowledge Pack', 'knowledge', 'Shared Knowledge Fabric access.');

  insert into public.organization_aos599_twin_connections (
    organization_id, connection_key, connection_title, connection_domain, summary
  ) values
    (p_org_id, 'twin_core', 'Digital Twin Core', 'digital_twin', 'Organizational digital twin link.'),
    (p_org_id, 'twin_knowledge', 'Knowledge Layer', 'knowledge', 'Knowledge Fabric connection.'),
    (p_org_id, 'twin_revenue', 'Revenue Layer', 'revenue', 'Revenue intelligence connection.'),
    (p_org_id, 'twin_execution', 'Execution Layer', 'execution', 'Action and workflow connection.'),
    (p_org_id, 'twin_resources', 'Resource Layer', 'resources', 'Capacity and resource connection.'),
    (p_org_id, 'twin_risk', 'Risk Layer', 'risk', 'Risk and compliance connection.'),
    (p_org_id, 'twin_strategy', 'Strategy Layer', 'strategy', 'Strategy and foresight connection.');

  insert into public.organization_aos599_global_context (
    organization_id, context_key, context_title, context_type, summary
  ) values
    (p_org_id, 'ctx_summary', 'Organization Summary', 'organization_summary', 'Companion sees the whole organization.'),
    (p_org_id, 'ctx_priorities', 'Current Priorities', 'priorities', 'Active priorities across modules.'),
    (p_org_id, 'ctx_risks', 'Major Risks', 'major_risks', 'Cross-module risk rollup.'),
    (p_org_id, 'ctx_opportunities', 'Major Opportunities', 'major_opportunities', 'Growth opportunities rollup.'),
    (p_org_id, 'ctx_leadership', 'Leadership Briefing', 'leadership_briefing', 'Prepared leadership briefing.'),
    (p_org_id, 'ctx_board', 'Board Briefing', 'board_briefing', 'Prepared board briefing scaffold.');

  insert into public.organization_aos599_search_domains (
    organization_id, domain_key, domain_title, domain_type, summary
  ) values
    (p_org_id, 'search_knowledge', 'Knowledge', 'knowledge', 'Global search — knowledge.'),
    (p_org_id, 'search_contracts', 'Contracts', 'contracts', 'Global search — contracts.'),
    (p_org_id, 'search_customers', 'Customers', 'customers', 'Global search — customers.'),
    (p_org_id, 'search_partners', 'Partners', 'partners', 'Global search — partners.'),
    (p_org_id, 'search_invoices', 'Invoices', 'invoices', 'Global search — invoices.'),
    (p_org_id, 'search_projects', 'Projects', 'projects', 'Global search — projects.'),
    (p_org_id, 'search_policies', 'Policies', 'policies', 'Global search — policies.'),
    (p_org_id, 'search_tasks', 'Tasks', 'tasks', 'Global search — tasks.'),
    (p_org_id, 'search_approvals', 'Approvals', 'approvals', 'Global search — approvals.'),
    (p_org_id, 'search_events', 'Events', 'events', 'Global search — events.'),
    (p_org_id, 'search_packs', 'Business Packs', 'business_packs', 'Global search — business packs.');

  insert into public.organization_aos599_report_types (
    organization_id, report_key, report_title, report_type, summary
  ) values
    (p_org_id, 'rpt_ops', 'Operational Report', 'operational', 'Cross-module operational reporting.'),
    (p_org_id, 'rpt_exec', 'Executive Report', 'executive', 'Executive operating report.'),
    (p_org_id, 'rpt_board', 'Board Report', 'board', 'Board-ready rollup.'),
    (p_org_id, 'rpt_customer', 'Customer Report', 'customer', 'Customer-facing report scaffold.'),
    (p_org_id, 'rpt_partner', 'Partner Report', 'partner', 'Partner report scaffold.'),
    (p_org_id, 'rpt_compliance', 'Compliance Report', 'compliance', 'Governance and compliance rollup.'),
    (p_org_id, 'rpt_financial', 'Financial Report', 'financial', 'Financial cross-module report.');

  insert into public.organization_aos599_health_dimensions (
    organization_id, health_key, health_title, health_type, health_score, health_band, summary
  ) values
    (p_org_id, 'h_revenue', 'Revenue Health', 'revenue', 82, 'healthy', 'Revenue health dimension.'),
    (p_org_id, 'h_customer', 'Customer Health', 'customer', 78, 'healthy', 'Customer success health.'),
    (p_org_id, 'h_knowledge', 'Knowledge Health', 'knowledge', 85, 'excellent', 'Knowledge Fabric health.'),
    (p_org_id, 'h_compliance', 'Compliance Health', 'compliance', 88, 'excellent', 'Compliance posture.'),
    (p_org_id, 'h_execution', 'Execution Health', 'execution', 74, 'attention', 'Execution throughput — review recommended.'),
    (p_org_id, 'h_resource', 'Resource Health', 'resource', 80, 'healthy', 'Resource and capacity health.'),
    (p_org_id, 'h_risk', 'Risk Health', 'risk', 71, 'attention', 'Elevated risk signals — executive review.');

  insert into public.organization_aos599_intelligence_bus (
    organization_id, signal_key, signal_title, signal_type, summary
  ) values
    (p_org_id, 'sig_revenue', 'Revenue Event', 'revenue_event', 'Revenue module signal on intelligence bus.'),
    (p_org_id, 'sig_cs', 'Customer Success Signal', 'customer_success', 'Customer success propagation.'),
    (p_org_id, 'sig_exec', 'Executive Alert', 'executive_alert', 'Executive alert from cross-module chain.'),
    (p_org_id, 'sig_forecast', 'Forecast Update', 'forecast_update', 'Forecast refresh from connected modules.'),
    (p_org_id, 'sig_risk', 'Risk Review', 'risk_review', 'Risk review triggered across modules.'),
    (p_org_id, 'sig_cross', 'Cross-Module Orchestration', 'cross_module', 'Modules cooperate automatically — humans decide.'),
    (p_org_id, 'sig_orchestration', 'Companion Orchestration', 'orchestration', 'Companion coordinates modules.'),
    (p_org_id, 'sig_recommend', 'System Recommendation', 'recommendation', 'Explainable recommendation — approval required when sensitive.');

  insert into public.organization_aos599_orchestration (
    organization_id, orchestration_key, orchestration_title, orchestration_type, summary
  ) values
    (p_org_id, 'orch_companion', 'Companion Primary Interface', 'companion_interface', 'Users increasingly ask Companion — orchestrates modules.'),
    (p_org_id, 'orch_modules', 'Module Coordination', 'module_coordination', 'Companion coordinates — does not replace modules.'),
    (p_org_id, 'orch_command', 'Command Center Link', 'command_center', 'Connected to Phase 590 Command Center.'),
    (p_org_id, 'orch_events', 'Event Bus Link', 'event_bus', 'Connected to Phase 591 Event Bus.'),
    (p_org_id, 'orch_knowledge', 'Knowledge Fabric Link', 'knowledge_fabric', 'Connected to Phase 597 Knowledge Fabric.'),
    (p_org_id, 'orch_governance', 'Governance Orchestration', 'governance', 'Platform-wide permissions, audit, compliance.'),
    (p_org_id, 'orch_executive', 'Executive Command Mode', 'executive_mode', 'Unified executive experience.');

  insert into public.organization_aos599_api_capabilities (
    organization_id, capability_key, capability_title, capability_type, summary
  ) values
    (p_org_id, 'api_partners', 'Partner API Foundation', 'partners', 'Business OS API — partners scaffold.'),
    (p_org_id, 'api_extensions', 'Extension API Foundation', 'extensions', 'Extension points prepared.'),
    (p_org_id, 'api_marketplace', 'Marketplace API Foundation', 'marketplace', 'Marketplace integration scaffold.'),
    (p_org_id, 'api_enterprise', 'Enterprise Integration API', 'enterprise_integrations', 'Enterprise integration foundation.'),
    (p_org_id, 'api_external', 'External Systems API', 'external_systems', 'External system orchestration API prepared.');

  perform public._aos599_log(p_org_id, 'aos_center_seeded', 'AOS orchestration center baseline seeded.');
end; $$;

create or replace function public.get_organization_aos_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_avg_health integer;
  v_org_health_band text;
begin
  v_org_id := public._aos599_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._aos599_seed(v_org_id);

  v_avg_health := coalesce((
    select round(avg(health_score)) from public.organization_aos599_health_dimensions where organization_id = v_org_id
  ), 75);

  v_org_health_band := case
    when v_avg_health >= 85 then 'excellent'
    when v_avg_health >= 75 then 'healthy'
    when v_avg_health >= 65 then 'attention'
    else 'risk'
  end;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Software manages modules. A Business Operating System manages organizations.',
      'privacy_note', 'Companion orchestrates modules — humans retain accountability. Metadata only across connected systems.',
      'maturity_checkpoint', jsonb_build_object(
        'business_operating_system', true,
        'companion_platform', true,
        'organizational_intelligence', true,
        'digital_workforce_platform', true,
        'governance_platform', true,
        'enterprise_operating_environment', true
      ),
      'executive_dashboard', jsonb_build_object(
        'connected_modules', 12,
        'org_health_score', v_avg_health,
        'org_health_band', v_org_health_band,
        'active_signals', (select count(*) from public.organization_aos599_intelligence_bus where organization_id = v_org_id),
        'cross_module_chains', (select count(*) from public.organization_aos599_cross_module_chains where organization_id = v_org_id),
        'unified_entities', (select count(*) from public.organization_aos599_entities where organization_id = v_org_id),
        'search_domains', (select count(*) from public.organization_aos599_search_domains where organization_id = v_org_id)
      ),
      'stats', jsonb_build_object(
        'org_dimensions', (select count(*) from public.organization_aos599_org_dimensions where organization_id = v_org_id),
        'entities', (select count(*) from public.organization_aos599_entities where organization_id = v_org_id),
        'health_dimensions', (select count(*) from public.organization_aos599_health_dimensions where organization_id = v_org_id),
        'intelligence_signals', (select count(*) from public.organization_aos599_intelligence_bus where organization_id = v_org_id),
        'orchestration_layers', (select count(*) from public.organization_aos599_orchestration where organization_id = v_org_id),
        'report_types', (select count(*) from public.organization_aos599_report_types where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'signal_title', s.signal_title, 'recommendation', s.summary, 'signal_type', s.signal_type
        ) order by s.signal_type)
        from public.organization_aos599_intelligence_bus s
        where s.organization_id = v_org_id
        limit 4
      ), '[]'::jsonb),
      'organizational_health', coalesce((
        select jsonb_agg(jsonb_build_object(
          'health_title', h.health_title, 'health_type', h.health_type,
          'health_score', h.health_score, 'health_band', h.health_band, 'summary', h.summary
        ) order by h.health_score)
        from public.organization_aos599_health_dimensions h where h.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'One Organization. One Companion. One Operating System. One Intelligence Layer.',
    'privacy_note', 'Cross-module orchestration uses approved metadata — customer owns operational data.',
    'executive_dashboard', jsonb_build_object(
      'connected_modules', 12,
      'org_health_score', v_avg_health,
      'org_health_band', v_org_health_band,
      'active_signals', (select count(*) from public.organization_aos599_intelligence_bus where organization_id = v_org_id),
      'cross_module_chains', (select count(*) from public.organization_aos599_cross_module_chains where organization_id = v_org_id),
      'unified_entities', (select count(*) from public.organization_aos599_entities where organization_id = v_org_id),
      'search_domains', (select count(*) from public.organization_aos599_search_domains where organization_id = v_org_id)
    ),
    'org_dimensions', coalesce((select jsonb_agg(jsonb_build_object(
      'dimension_key', d.dimension_key, 'dimension_title', d.dimension_title,
      'dimension_type', d.dimension_type, 'dimension_status', d.dimension_status, 'summary', d.summary
    ) order by d.dimension_type) from public.organization_aos599_org_dimensions d where d.organization_id = v_org_id), '[]'::jsonb),
    'entities', coalesce((select jsonb_agg(jsonb_build_object(
      'entity_key', e.entity_key, 'entity_title', e.entity_title,
      'entity_type', e.entity_type, 'relationship_summary', e.relationship_summary, 'summary', e.summary
    ) order by e.entity_type) from public.organization_aos599_entities e where e.organization_id = v_org_id), '[]'::jsonb),
    'cross_module_chains', coalesce((select jsonb_agg(jsonb_build_object(
      'chain_key', c.chain_key, 'chain_title', c.chain_title,
      'chain_stage', c.chain_stage, 'chain_status', c.chain_status, 'summary', c.summary
    ) order by c.chain_stage) from public.organization_aos599_cross_module_chains c where c.organization_id = v_org_id), '[]'::jsonb),
    'awareness_states', coalesce((select jsonb_agg(jsonb_build_object(
      'state_key', s.state_key, 'state_title', s.state_title,
      'state_type', s.state_type, 'summary', s.summary
    ) order by s.state_type) from public.organization_aos599_awareness_states s where s.organization_id = v_org_id), '[]'::jsonb),
    'executive_questions', coalesce((select jsonb_agg(jsonb_build_object(
      'question_key', q.question_key, 'question_text', q.question_text,
      'question_type', q.question_type, 'summary', q.summary
    ) order by q.question_type) from public.organization_aos599_executive_questions q where q.organization_id = v_org_id), '[]'::jsonb),
    'business_pack_links', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title,
      'shared_capability', p.shared_capability, 'link_status', p.link_status, 'summary', p.summary
    ) order by p.pack_key, p.shared_capability) from public.organization_aos599_business_pack_links p where p.organization_id = v_org_id), '[]'::jsonb),
    'twin_connections', coalesce((select jsonb_agg(jsonb_build_object(
      'connection_key', t.connection_key, 'connection_title', t.connection_title,
      'connection_domain', t.connection_domain, 'connection_status', t.connection_status, 'summary', t.summary
    ) order by t.connection_domain) from public.organization_aos599_twin_connections t where t.organization_id = v_org_id), '[]'::jsonb),
    'global_context', coalesce((select jsonb_agg(jsonb_build_object(
      'context_key', c.context_key, 'context_title', c.context_title,
      'context_type', c.context_type, 'summary', c.summary
    ) order by c.context_type) from public.organization_aos599_global_context c where c.organization_id = v_org_id), '[]'::jsonb),
    'search_domains', coalesce((select jsonb_agg(jsonb_build_object(
      'domain_key', d.domain_key, 'domain_title', d.domain_title,
      'domain_type', d.domain_type, 'summary', d.summary
    ) order by d.domain_type) from public.organization_aos599_search_domains d where d.organization_id = v_org_id), '[]'::jsonb),
    'report_types', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title,
      'report_type', r.report_type, 'summary', r.summary
    ) order by r.report_type) from public.organization_aos599_report_types r where r.organization_id = v_org_id), '[]'::jsonb),
    'organizational_health', coalesce((select jsonb_agg(jsonb_build_object(
      'health_key', h.health_key, 'health_title', h.health_title,
      'health_type', h.health_type, 'health_score', h.health_score,
      'health_band', h.health_band, 'summary', h.summary
    ) order by h.health_score desc) from public.organization_aos599_health_dimensions h where h.organization_id = v_org_id), '[]'::jsonb),
    'intelligence_bus', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'signal_title', s.signal_title,
      'signal_type', s.signal_type, 'signal_status', s.signal_status, 'summary', s.summary
    ) order by s.signal_type) from public.organization_aos599_intelligence_bus s where s.organization_id = v_org_id), '[]'::jsonb),
    'orchestration', coalesce((select jsonb_agg(jsonb_build_object(
      'orchestration_key', o.orchestration_key, 'orchestration_title', o.orchestration_title,
      'orchestration_type', o.orchestration_type, 'summary', o.summary
    ) order by o.orchestration_type) from public.organization_aos599_orchestration o where o.organization_id = v_org_id), '[]'::jsonb),
    'api_capabilities', coalesce((select jsonb_agg(jsonb_build_object(
      'capability_key', a.capability_key, 'capability_title', a.capability_title,
      'capability_type', a.capability_type, 'readiness_status', a.readiness_status, 'summary', a.summary
    ) order by a.capability_type) from public.organization_aos599_api_capabilities a where a.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'changed', 'What changed across the organization?',
      'matters', 'What matters right now?',
      'action', 'What requires your approval?',
      'next', 'What should happen next?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_aos599_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'organization_overview', true,
      'executive_briefings', true,
      'approvals', true,
      'risks', true,
      'revenue', true,
      'companion', true,
      'command_center', true
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_aos_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_aos_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Business Operating System Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'changed',
        'observation', format('%s intelligence signal(s) active across %s connected modules.', v_exec->>'active_signals', v_exec->>'connected_modules'),
        'recommendation', 'Review what changed in the AOS Center overview.',
        'href', '/app/aos'
      ),
      jsonb_build_object(
        'key', 'matters',
        'observation', format('Organizational health %s (%s) — %s unified entities tracked.', v_exec->>'org_health_score', v_exec->>'org_health_band', v_exec->>'unified_entities'),
        'recommendation', 'Open Intelligence and health dimensions for priority signals.',
        'href', '/app/aos/intelligence'
      ),
      jsonb_build_object(
        'key', 'action',
        'observation', format('%s cross-module chain(s) may require executive attention.', v_exec->>'cross_module_chains'),
        'recommendation', 'Review signals and governance orchestration.',
        'href', '/app/aos/signals'
      ),
      jsonb_build_object(
        'key', 'next',
        'observation', 'Companion orchestrates modules — ask what should happen next.',
        'recommendation', 'Use Executive Command Mode via Companion or Command Center.',
        'href', '/app/aos/companion'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_aos_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_aos_center('overview');
end;
$$;

grant execute on function public.get_organization_aos_center(text) to authenticated;
grant execute on function public.get_aipify_companion_aos_advisor_bundle() to authenticated;
grant execute on function public.get_organization_aos_center_mobile_summary() to authenticated;
