-- Phase 282 — Enterprise Printing & Document Output Engine (Print & Output Center)
-- Feature owner: Customer App — Settings → Devices & Integrations → Printers
-- Helpers: _apoe_* (engine), _apoebp282_* (blueprint)

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
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion',
    'commerce_companion', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_institutional_memory_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'trust_center_foundation_engine',
    'continuous_improvement_engine', 'mentorship_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'audience_targeting_checkpoints_engine',
    'risk_center',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'human_approval_gates_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'ethical_evolution_guardianship_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_mentorship_engine',
    'companion_identity_engine',
    'impact_engine',
    'guardianship_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'ethical_evolution_guardianship_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'ethical_evolution_guardianship_engine',
    'wisdom_engine',
    'wisdom_intervention_protocol',
    'sales_expert_engine',
    'security_trust_engine',
    'api_platform_engine',
    'companion_device_ecosystem_engine',
    'companion_marketplace',
    'growth_partner_operations',
    'aipify_university',
    'social_impact_purpose',
    'ecosystem_governance',
    'ecosystem_orchestration',
    'executive_intelligence',
    'strategic_foresight_engine',
    'decision_intelligence_engine',
    'organizational_wisdom_engine',
    'companion_workforce',
    'proactive_organization',
    'collective_decision_council',
    'human_potential_augmented_work',
    'augmented_organization',
    'global_knowledge_exchange',
    'global_ecosystem_marketplace',
    'future_leaders_engine',
    'organizational_sensemaking_engine',
    'living_enterprise_engine',
    'civic_collaboration_engine',
    'cross_sector_intelligence_engine',
    'civilizational_memory_engine',
    'legacy_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'humanity_shared_compassion_reciprocal_care_engine',
    'humanity_shared_courage_responsible_action_engine',
    'humanity_shared_gratitude_appreciative_stewardship_engine',
    'humanity_shared_humility_continuous_renewal_engine',
    'humanity_shared_legacy_flourishing_engine',
    'human_hope_possibility_engine',
    'human_wonder_exploration_engine',
    'human_legacy_eternal_stewardship_engine',
    'universal_stewardship_shared_futures_engine',
    'humanity_collective_wisdom_shared_learning_engine',
    'humanity_shared_purpose_contribution_engine',
    'humanity_shared_resilience_adaptive_capacity_engine',
    'humanity_shared_trust_cooperative_intelligence_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine',
    'intergenerational_guardianship_engine',
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'aipify_constitution_perpetual_principles_engine',
    'aipify_ethical_evolution_responsible_innovation_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_decision_transparency_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_audience_targeting_checkpoints_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_risk_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_organizational_consciousness_engine',
    'aipify_enterprise_printing_document_output_engine'
  )
);

create table if not exists public.aipify_print_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  printing_disabled boolean not null default false,
  require_approval_sensitive boolean not null default true,
  restrict_office_network boolean not null default false,
  approved_printers_only boolean not null default false,
  force_watermark_confidential boolean not null default true,
  default_permission_level text not null default 'own_documents' check (
    default_permission_level in ('none', 'own_documents', 'department', 'organization', 'admin')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_print_policies enable row level security;
revoke all on public.aipify_print_policies from authenticated, anon;

create table if not exists public.aipify_print_printers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  printer_key text not null,
  name text not null,
  location text,
  department text,
  connection_type text not null default 'network' check (
    connection_type in ('local', 'network', 'shared', 'cloud', 'department')
  ),
  default_paper_size text not null default 'A4',
  supports_color boolean not null default true,
  supports_duplex boolean not null default true,
  status text not null default 'unknown' check (status in ('online', 'offline', 'unknown')),
  is_default boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, printer_key)
);
create index if not exists aipify_print_printers_tenant_idx on public.aipify_print_printers (tenant_id, status, is_default);
alter table public.aipify_print_printers enable row level security;
revoke all on public.aipify_print_printers from authenticated, anon;

create table if not exists public.aipify_print_printer_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  printer_id uuid not null references public.aipify_print_printers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  role text,
  permission_level text not null default 'own_documents' check (
    permission_level in ('none', 'own_documents', 'department', 'organization', 'admin')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or role is not null)
);
create index if not exists aipify_print_printer_permissions_tenant_idx on public.aipify_print_printer_permissions (tenant_id, printer_id);
alter table public.aipify_print_printer_permissions enable row level security;
revoke all on public.aipify_print_printer_permissions from authenticated, anon;

create table if not exists public.aipify_print_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  job_key text not null,
  user_id uuid references public.users (id) on delete set null,
  document_title text not null,
  document_type text not null default 'general',
  printer_id uuid references public.aipify_print_printers (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'waiting_for_confirmation', 'queued', 'printing', 'completed', 'failed', 'cancelled')
  ),
  sensitivity_level text not null default 'standard' check (
    sensitivity_level in ('standard', 'sensitive', 'confidential')
  ),
  copies int not null default 1 check (copies >= 1),
  color_mode text not null default 'auto',
  duplex boolean not null default true,
  paper_size text not null default 'A4',
  page_count int not null default 1 check (page_count >= 1),
  page_range text,
  orientation text not null default 'portrait',
  include_header_footer boolean not null default true,
  include_company_logo boolean not null default true,
  approval_status text not null default 'not_required' check (
    approval_status in ('not_required', 'pending', 'approved', 'rejected')
  ),
  pdf_fallback_available boolean not null default true,
  error_summary text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, job_key)
);
create index if not exists aipify_print_jobs_tenant_idx on public.aipify_print_jobs (tenant_id, user_id, status, created_at desc);
alter table public.aipify_print_jobs enable row level security;
revoke all on public.aipify_print_jobs from authenticated, anon;

create table if not exists public.aipify_print_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  print_job_id uuid references public.aipify_print_jobs (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  action_type text not null,
  document_title text,
  document_type text,
  printer_name text,
  status text,
  sensitivity_level text,
  approval_status text,
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_print_audit_logs_tenant_idx on public.aipify_print_audit_logs (tenant_id, created_at desc);
alter table public.aipify_print_audit_logs enable row level security;
revoke all on public.aipify_print_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_printing_document_output_engine', v.description
from (values
  ('print.view', 'View Print Output', 'View printers, jobs, policies, and print audit metadata'),
  ('print.execute', 'Execute Print Jobs', 'Create and confirm print jobs within policy limits'),
  ('print.department', 'Department Print Access', 'Print to department printers and shared resources'),
  ('print.organization', 'Organization Print Access', 'Print across organizational printer inventory'),
  ('print.manage', 'Manage Print Output', 'Manage printers, policies, and printer permissions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'print.view'), ('owner', 'print.execute'), ('owner', 'print.department'), ('owner', 'print.organization'), ('owner', 'print.manage'),
  ('administrator', 'print.view'), ('administrator', 'print.execute'), ('administrator', 'print.department'), ('administrator', 'print.organization'), ('administrator', 'print.manage'),
  ('manager', 'print.view'), ('manager', 'print.execute'), ('manager', 'print.department'),
  ('employee', 'print.view'), ('employee', 'print.execute'),
  ('support_agent', 'print.view'), ('moderator', 'print.view'), ('viewer', 'print.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._apoe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._apoe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._apoe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._apoe_log_audit(
  p_tenant_id uuid,
  p_action_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb,
  p_print_job_id uuid default null,
  p_user_id uuid default null,
  p_document_title text default null,
  p_document_type text default null,
  p_printer_name text default null,
  p_status text default null,
  p_sensitivity_level text default null,
  p_approval_status text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin
  insert into public.aipify_print_audit_logs (
    tenant_id, print_job_id, user_id, action_type, document_title, document_type, printer_name,
    status, sensitivity_level, approval_status, summary, context
  ) values (
    p_tenant_id, p_print_job_id, coalesce(p_user_id, public._mta_app_user_id()), p_action_type,
    p_document_title, p_document_type, p_printer_name, p_status, p_sensitivity_level, p_approval_status,
    left(p_summary, 500), p_context
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._apoe_ensure_policy(p_tenant_id uuid) returns public.aipify_print_policies language plpgsql security definer set search_path = public as $$
declare v_policy public.aipify_print_policies; begin
  insert into public.aipify_print_policies (tenant_id, enabled, default_permission_level) values (p_tenant_id, true, 'own_documents') on conflict (tenant_id) do nothing;
  select * into v_policy from public.aipify_print_policies where tenant_id = p_tenant_id;
  return v_policy;
end; $$;

create or replace function public._apoe_seed_default_printers(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.aipify_print_printers where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_print_printers (
    tenant_id, printer_key, name, location, department, connection_type, default_paper_size,
    supports_color, supports_duplex, status, is_default
  ) values (
    p_tenant_id, 'office-network-default', 'Office Network Printer', 'Main Office', 'Operations',
    'network', 'A4', true, true, 'online', true
  );
end; $$;

create or replace function public._apoebp282_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 282 — Print & Output Center. Aipify supports digital and physical output — users decide when printing is useful. Companion prepares print jobs; humans confirm execution. Helpers _apoebp282_*.';
$$;

create or replace function public._apoebp282_mission() returns text language sql immutable as $$
  select 'Help organizations print documents safely and intentionally — Aipify prepares output, applies policy, and routes to approved printers while preserving human confirmation and audit transparency.';
$$;

create or replace function public._apoebp282_philosophy() returns text language sql immutable as $$
  select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Aipify supports digital and physical output — users decide when printing is useful.';
$$;

create or replace function public._apoebp282_print_flow() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Understand → Prepare → Approve → Execute', 'steps', jsonb_build_array(
    jsonb_build_object('key', 'detect', 'label', 'Companion detects printable document context'),
    jsonb_build_object('key', 'offer', 'label', 'Companion offers print — user decides'),
    jsonb_build_object('key', 'prepare', 'label', 'Aipify prepares draft job with policy checks'),
    jsonb_build_object('key', 'confirm', 'label', 'User confirms printer and options'),
    jsonb_build_object('key', 'queue', 'label', 'Job queued for desktop or network bridge'),
    jsonb_build_object('key', 'execute', 'label', 'Desktop companion or network printer executes'),
    jsonb_build_object('key', 'audit', 'label', 'Metadata-only audit log recorded'),
    jsonb_build_object('key', 'fallback', 'label', 'PDF fallback offered when print unavailable')
  ));
$$;

create or replace function public._apoebp282_print_offer_prompts() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'en', jsonb_build_object(
      'offer', 'Should I print this for you?',
      'contextual', 'This may be useful to have physically. Should I print this for you?',
      'failure_fallback', 'I could not print this. Would you like me to create a PDF instead?',
      'no_printer_fallback', 'I do not have printer access right now, but I can prepare a PDF ready for printing.'
    ),
    'no', jsonb_build_object(
      'offer', 'Skal jeg printe dette ut for deg?',
      'contextual', 'Dette kan være nyttig å ha fysisk. Skal jeg printe dette ut for deg?',
      'failure_fallback', 'Jeg klarte ikke å printe dette. Vil du at jeg skal lage en PDF i stedet?',
      'no_printer_fallback', 'Jeg har ikke tilgang til printer akkurat nå, men jeg kan lage en PDF klar til utskrift.'
    )
  );
$$;

create or replace function public._apoebp282_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Printing without user confirmation',
      'Bypassing sensitivity approval policies',
      'Storing document content in audit logs',
      'Auto-selecting printers without policy check',
      'Hiding print failures from the user',
      'Printing confidential documents without watermark policy',
      'Executing print jobs when printing is disabled'
    ),
    'principle', 'Companion prepares and offers print — users confirm execution. Policy, RBAC, and audit remain enforced.'
  );
$$;

create or replace function public._apoebp282_privacy_note() returns text language sql immutable as $$
  select 'Print & Output Center metadata only — document titles and job summaries max ~500 chars. No raw document content, email bodies, or PII in audit logs. Printer inventory and job status metadata only.';
$$;

create or replace function public._apoebp282_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Print audit logs via aipify_print_audit_logs — metadata only'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via print.* permissions'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Sensitive and confidential documents require approval when policy enabled'),
    jsonb_build_object('key', 'printer_policies', 'label', 'Organization-defined printer and network restrictions'),
    jsonb_build_object('key', 'human_confirmation', 'label', 'User confirmation required before queue execution'),
    jsonb_build_object('key', 'metadata_only', 'label', 'No raw document content stored'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  ));
$$;

create or replace function public._apoebp282_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 282 — Enterprise Printing & Document Output Engine',
    'title', 'Enterprise Printing & Document Output Engine (Print & Output Center)',
    'route', '/app/settings/devices/printers',
    'distinction_note', public._apoebp282_distinction_note(),
    'mission', public._apoebp282_mission(),
    'philosophy', public._apoebp282_philosophy(),
    'print_flow', public._apoebp282_print_flow(),
    'print_offer_prompts', public._apoebp282_print_offer_prompts(),
    'companion_limitations', public._apoebp282_companion_limitations(),
    'privacy_note', public._apoebp282_privacy_note(),
    'security_requirements', public._apoebp282_security_requirements()
  );
$$;

create or replace function public._apoe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_policy public.aipify_print_policies;
  v_printers int;
  v_completed int;
  v_failed int;
  v_pdf_fallbacks int;
  v_queued int;
begin
  select * into v_policy from public.aipify_print_policies where tenant_id = p_tenant_id;
  select count(*) into v_printers from public.aipify_print_printers where tenant_id = p_tenant_id;
  select count(*) into v_completed from public.aipify_print_jobs where tenant_id = p_tenant_id and status = 'completed';
  select count(*) into v_failed from public.aipify_print_jobs where tenant_id = p_tenant_id and status = 'failed';
  select count(*) into v_pdf_fallbacks from public.aipify_print_jobs where tenant_id = p_tenant_id and pdf_fallback_available = true and status in ('failed', 'cancelled');
  select count(*) into v_queued from public.aipify_print_jobs where tenant_id = p_tenant_id and status in ('queued', 'printing', 'waiting_for_confirmation');
  return jsonb_build_object(
    'enabled', coalesce(v_policy.enabled, false),
    'printing_disabled', coalesce(v_policy.printing_disabled, false),
    'printers_count', v_printers,
    'completed_jobs', v_completed,
    'failed_jobs', v_failed,
    'pdf_fallbacks', v_pdf_fallbacks,
    'queued_jobs', v_queued
  );
end; $$;

create or replace function public._apoe_job_to_json(p_job public.aipify_print_jobs) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_printer_name text; begin
  if p_job.printer_id is not null then
    select p.name into v_printer_name from public.aipify_print_printers p where p.id = p_job.printer_id;
  end if;
  return jsonb_build_object(
    'id', p_job.id, 'job_key', p_job.job_key, 'document_title', p_job.document_title, 'document_type', p_job.document_type,
    'printer_id', p_job.printer_id, 'printer_name', v_printer_name, 'status', p_job.status, 'sensitivity_level', p_job.sensitivity_level,
    'copies', p_job.copies, 'color_mode', p_job.color_mode, 'duplex', p_job.duplex, 'paper_size', p_job.paper_size,
    'page_count', p_job.page_count, 'approval_status', p_job.approval_status, 'pdf_fallback_available', p_job.pdf_fallback_available,
    'error_summary', p_job.error_summary, 'created_at', p_job.created_at, 'updated_at', p_job.updated_at
  );
end; $$;

create or replace function public._apoe_policy_to_json(p_policy public.aipify_print_policies) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'enabled', p_policy.enabled, 'printing_disabled', p_policy.printing_disabled,
    'require_approval_sensitive', p_policy.require_approval_sensitive, 'restrict_office_network', p_policy.restrict_office_network,
    'approved_printers_only', p_policy.approved_printers_only, 'force_watermark_confidential', p_policy.force_watermark_confidential,
    'default_permission_level', p_policy.default_permission_level
  );
$$;

create or replace function public.get_aipify_print_output_center(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_policy public.aipify_print_policies;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._apoe_require_tenant());
  perform public._irp_require_permission('print.view', v_tenant_id);
  v_policy := public._apoe_ensure_policy(v_tenant_id);
  perform public._apoe_seed_default_printers(v_tenant_id);
  v_metrics := public._apoe_refresh_metrics(v_tenant_id);
  perform public._apoe_log_audit(v_tenant_id, 'center_view', 'Print & Output Center viewed', jsonb_build_object('metrics', v_metrics));
  return jsonb_build_object(
    'has_customer', true,
    'printers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'printer_key', p.printer_key, 'name', p.name, 'location', p.location, 'department', p.department,
        'connection_type', p.connection_type, 'default_paper_size', p.default_paper_size, 'supports_color', p.supports_color,
        'supports_duplex', p.supports_duplex, 'status', p.status, 'is_default', p.is_default
      ) order by p.is_default desc, p.name)
      from public.aipify_print_printers p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recent_jobs', coalesce((
      select jsonb_agg(public._apoe_job_to_json(j) order by j.created_at desc)
      from (select * from public.aipify_print_jobs where tenant_id = v_tenant_id order by created_at desc limit 20) j
    ), '[]'::jsonb),
    'policy', public._apoe_policy_to_json(v_policy),
    'recent_audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'action_type', a.action_type, 'document_title', a.document_title, 'document_type', a.document_type,
        'printer_name', a.printer_name, 'status', a.status, 'sensitivity_level', a.sensitivity_level,
        'approval_status', a.approval_status, 'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.aipify_print_audit_logs where tenant_id = v_tenant_id order by created_at desc limit 10) a
    ), '[]'::jsonb),
    'blueprint', public._apoebp282_blueprint_summary(),
    'metrics', v_metrics,
    'privacy_note', public._apoebp282_privacy_note()
  );
end; $$;

create or replace function public.upsert_aipify_print_printer(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_printer public.aipify_print_printers;
  v_printer_key text;
begin
  v_tenant_id := public._apoe_require_tenant();
  perform public._irp_require_permission('print.manage', v_tenant_id);
  perform public._apoe_ensure_policy(v_tenant_id);
  v_printer_key := coalesce(p_payload->>'printer_key', 'printer-' || left(md5(clock_timestamp()::text), 8));
  if p_payload ? 'id' and (p_payload->>'id') is not null then
    update public.aipify_print_printers set
      name = coalesce(p_payload->>'name', name),
      location = coalesce(p_payload->>'location', location),
      department = coalesce(p_payload->>'department', department),
      connection_type = coalesce(p_payload->>'connection_type', connection_type),
      default_paper_size = coalesce(p_payload->>'default_paper_size', default_paper_size),
      supports_color = coalesce((p_payload->>'supports_color')::boolean, supports_color),
      supports_duplex = coalesce((p_payload->>'supports_duplex')::boolean, supports_duplex),
      status = coalesce(p_payload->>'status', status),
      is_default = coalesce((p_payload->>'is_default')::boolean, is_default),
      metadata = coalesce(p_payload->'metadata', metadata),
      updated_at = now()
    where id = (p_payload->>'id')::uuid and tenant_id = v_tenant_id
    returning * into v_printer;
    if v_printer.id is null then raise exception 'Printer not found'; end if;
  else
    insert into public.aipify_print_printers (
      tenant_id, printer_key, name, location, department, connection_type, default_paper_size,
      supports_color, supports_duplex, status, is_default, metadata
    ) values (
      v_tenant_id, v_printer_key, coalesce(p_payload->>'name', 'Printer'), p_payload->>'location', p_payload->>'department',
      coalesce(p_payload->>'connection_type', 'network'), coalesce(p_payload->>'default_paper_size', 'A4'),
      coalesce((p_payload->>'supports_color')::boolean, true), coalesce((p_payload->>'supports_duplex')::boolean, true),
      coalesce(p_payload->>'status', 'unknown'), coalesce((p_payload->>'is_default')::boolean, false),
      coalesce(p_payload->'metadata', '{"metadata_only":true}'::jsonb)
    ) on conflict (tenant_id, printer_key) do update set
      name = excluded.name, location = excluded.location, department = excluded.department,
      connection_type = excluded.connection_type, default_paper_size = excluded.default_paper_size,
      supports_color = excluded.supports_color, supports_duplex = excluded.supports_duplex,
      status = excluded.status, is_default = excluded.is_default, metadata = excluded.metadata, updated_at = now()
    returning * into v_printer;
  end if;
  if coalesce((p_payload->>'is_default')::boolean, false) then
    update public.aipify_print_printers set is_default = false, updated_at = now()
    where tenant_id = v_tenant_id and id <> v_printer.id and is_default = true;
  end if;
  perform public._apoe_log_audit(v_tenant_id, 'printer_upserted', left(v_printer.name, 120), jsonb_build_object('printer_id', v_printer.id), null, null, null, null, v_printer.name);
  return jsonb_build_object(
    'id', v_printer.id, 'printer_key', v_printer.printer_key, 'name', v_printer.name, 'location', v_printer.location,
    'department', v_printer.department, 'connection_type', v_printer.connection_type, 'default_paper_size', v_printer.default_paper_size,
    'supports_color', v_printer.supports_color, 'supports_duplex', v_printer.supports_duplex, 'status', v_printer.status, 'is_default', v_printer.is_default
  );
end; $$;

create or replace function public.create_aipify_print_job(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_policy public.aipify_print_policies;
  v_job public.aipify_print_jobs;
  v_job_key text;
  v_sensitivity text;
  v_status text;
  v_approval text;
  v_printer_id uuid;
begin
  v_tenant_id := public._apoe_require_tenant();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission('print.execute', v_tenant_id);
  v_policy := public._apoe_ensure_policy(v_tenant_id);
  perform public._apoe_seed_default_printers(v_tenant_id);
  if not v_policy.enabled then raise exception 'Print output is disabled for this workspace'; end if;
  if v_policy.printing_disabled then raise exception 'Printing is disabled by policy'; end if;
  v_sensitivity := coalesce(p_payload->>'sensitivity_level', 'standard');
  if v_sensitivity not in ('standard', 'sensitive', 'confidential') then raise exception 'Invalid sensitivity level'; end if;
  v_printer_id := nullif(p_payload->>'printer_id', '')::uuid;
  if v_printer_id is not null and v_policy.approved_printers_only then
    if not exists (select 1 from public.aipify_print_printers where id = v_printer_id and tenant_id = v_tenant_id) then
      raise exception 'Printer not approved for this workspace';
    end if;
  end if;
  if v_policy.require_approval_sensitive and v_sensitivity in ('sensitive', 'confidential') then
    v_status := 'draft';
    v_approval := 'pending';
  else
    v_status := 'waiting_for_confirmation';
    v_approval := 'not_required';
  end if;
  v_job_key := 'job-' || left(md5(coalesce(p_payload->>'document_title', 'doc') || clock_timestamp()::text), 12);
  insert into public.aipify_print_jobs (
    tenant_id, job_key, user_id, document_title, document_type, printer_id, status, sensitivity_level,
    copies, color_mode, duplex, paper_size, page_count, page_range, orientation,
    include_header_footer, include_company_logo, approval_status, pdf_fallback_available, metadata
  ) values (
    v_tenant_id, v_job_key, v_user_id, coalesce(p_payload->>'document_title', 'Untitled document'),
    coalesce(p_payload->>'document_type', 'general'), v_printer_id, v_status, v_sensitivity,
    coalesce((p_payload->>'copies')::int, 1), coalesce(p_payload->>'color_mode', 'auto'),
    coalesce((p_payload->>'duplex')::boolean, true), coalesce(p_payload->>'paper_size', 'A4'),
    coalesce((p_payload->>'page_count')::int, 1), p_payload->>'page_range', coalesce(p_payload->>'orientation', 'portrait'),
    coalesce((p_payload->>'include_header_footer')::boolean, true), coalesce((p_payload->>'include_company_logo')::boolean, true),
    v_approval, coalesce((p_payload->>'pdf_fallback_available')::boolean, true), coalesce(p_payload->'metadata', '{"metadata_only":true}'::jsonb)
  ) returning * into v_job;
  perform public._apoe_log_audit(
    v_tenant_id, 'job_created', left(v_job.document_title, 120), jsonb_build_object('job_id', v_job.id, 'status', v_job.status),
    v_job.id, v_user_id, v_job.document_title, v_job.document_type, null, v_job.status, v_job.sensitivity_level, v_job.approval_status
  );
  return public._apoe_job_to_json(v_job);
end; $$;

create or replace function public.confirm_aipify_print_job(p_job_id uuid, p_printer_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_job public.aipify_print_jobs;
  v_printer_name text;
begin
  v_tenant_id := public._apoe_require_tenant();
  perform public._irp_require_permission('print.execute', v_tenant_id);
  select * into v_job from public.aipify_print_jobs where id = p_job_id and tenant_id = v_tenant_id;
  if v_job.id is null then raise exception 'Print job not found'; end if;
  if v_job.status <> 'waiting_for_confirmation' then raise exception 'Print job is not awaiting confirmation'; end if;
  if v_job.approval_status = 'pending' then raise exception 'Print job requires approval before confirmation'; end if;
  if v_job.approval_status = 'rejected' then raise exception 'Print job was rejected'; end if;
  if p_printer_id is not null then v_job.printer_id := p_printer_id; end if;
  update public.aipify_print_jobs set printer_id = v_job.printer_id, status = 'queued', updated_at = now()
  where id = v_job.id returning * into v_job;
  if v_job.printer_id is not null then
    select name into v_printer_name from public.aipify_print_printers where id = v_job.printer_id;
  end if;
  perform public._apoe_log_audit(
    v_tenant_id, 'job_confirmed', left(v_job.document_title, 120), jsonb_build_object('job_id', v_job.id, 'printer_id', v_job.printer_id),
    v_job.id, v_job.user_id, v_job.document_title, v_job.document_type, v_printer_name, v_job.status, v_job.sensitivity_level, v_job.approval_status
  );
  return public._apoe_job_to_json(v_job);
end; $$;

create or replace function public.cancel_aipify_print_job(p_job_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_job public.aipify_print_jobs;
begin
  v_tenant_id := public._apoe_require_tenant();
  perform public._irp_require_permission('print.execute', v_tenant_id);
  select * into v_job from public.aipify_print_jobs where id = p_job_id and tenant_id = v_tenant_id;
  if v_job.id is null then raise exception 'Print job not found'; end if;
  if v_job.status in ('completed', 'cancelled') then raise exception 'Print job cannot be cancelled'; end if;
  update public.aipify_print_jobs set status = 'cancelled', updated_at = now() where id = v_job.id returning * into v_job;
  perform public._apoe_log_audit(
    v_tenant_id, 'job_cancelled', left(v_job.document_title, 120), jsonb_build_object('job_id', v_job.id),
    v_job.id, v_job.user_id, v_job.document_title, v_job.document_type, null, v_job.status, v_job.sensitivity_level, v_job.approval_status
  );
  return public._apoe_job_to_json(v_job);
end; $$;

create or replace function public.get_aipify_print_job_status(p_job_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_job public.aipify_print_jobs;
begin
  v_tenant_id := public._apoe_require_tenant();
  perform public._irp_require_permission('print.view', v_tenant_id);
  select * into v_job from public.aipify_print_jobs where id = p_job_id and tenant_id = v_tenant_id;
  if v_job.id is null then raise exception 'Print job not found'; end if;
  return public._apoe_job_to_json(v_job);
end; $$;

create or replace function public.update_aipify_print_policy(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_policy public.aipify_print_policies;
begin
  v_tenant_id := public._apoe_require_tenant();
  perform public._irp_require_permission('print.manage', v_tenant_id);
  v_policy := public._apoe_ensure_policy(v_tenant_id);
  update public.aipify_print_policies set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    printing_disabled = coalesce((p_payload->>'printing_disabled')::boolean, printing_disabled),
    require_approval_sensitive = coalesce((p_payload->>'require_approval_sensitive')::boolean, require_approval_sensitive),
    restrict_office_network = coalesce((p_payload->>'restrict_office_network')::boolean, restrict_office_network),
    approved_printers_only = coalesce((p_payload->>'approved_printers_only')::boolean, approved_printers_only),
    force_watermark_confidential = coalesce((p_payload->>'force_watermark_confidential')::boolean, force_watermark_confidential),
    default_permission_level = coalesce(p_payload->>'default_permission_level', default_permission_level),
    metadata = coalesce(p_payload->'metadata', metadata),
    updated_at = now()
  where tenant_id = v_tenant_id returning * into v_policy;
  perform public._apoe_log_audit(v_tenant_id, 'policy_updated', 'Print policy updated', jsonb_build_object('policy', public._apoe_policy_to_json(v_policy)));
  return public._apoe_policy_to_json(v_policy);
end; $$;

create or replace function public.report_desktop_print_status(p_job_id uuid, p_status text, p_error_summary text default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_job public.aipify_print_jobs;
  v_printer_name text;
begin
  v_tenant_id := public._apoe_require_tenant();
  perform public._irp_require_permission('print.execute', v_tenant_id);
  if p_status not in ('printing', 'completed', 'failed') then raise exception 'Invalid desktop print status'; end if;
  select * into v_job from public.aipify_print_jobs where id = p_job_id and tenant_id = v_tenant_id;
  if v_job.id is null then raise exception 'Print job not found'; end if;
  if v_job.status not in ('queued', 'printing') then raise exception 'Print job is not in an executable state'; end if;
  update public.aipify_print_jobs set
    status = p_status,
    error_summary = case when p_status = 'failed' then left(p_error_summary, 500) else null end,
    pdf_fallback_available = case when p_status = 'failed' then true else pdf_fallback_available end,
    updated_at = now()
  where id = v_job.id returning * into v_job;
  if v_job.printer_id is not null then
    select name into v_printer_name from public.aipify_print_printers where id = v_job.printer_id;
  end if;
  perform public._apoe_log_audit(
    v_tenant_id, 'desktop_status_reported', left(coalesce(p_error_summary, v_job.document_title), 120),
    jsonb_build_object('job_id', v_job.id, 'reported_status', p_status),
    v_job.id, v_job.user_id, v_job.document_title, v_job.document_type, v_printer_name, v_job.status, v_job.sensitivity_level, v_job.approval_status
  );
  return public._apoe_job_to_json(v_job);
end; $$;

create or replace function public.register_desktop_print_printers(p_printers jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_printer jsonb;
  v_results jsonb := '[]'::jsonb;
  v_row public.aipify_print_printers;
  v_printer_key text;
begin
  v_tenant_id := public._apoe_require_tenant();
  perform public._irp_require_permission('print.execute', v_tenant_id);
  perform public._apoe_ensure_policy(v_tenant_id);
  if jsonb_typeof(p_printers) <> 'array' then raise exception 'Printers payload must be an array'; end if;
  for v_printer in select value from jsonb_array_elements(p_printers) loop
    v_printer_key := coalesce(v_printer->>'printer_key', v_printer->>'name', 'local-' || left(md5(v_printer::text), 8));
    insert into public.aipify_print_printers (
      tenant_id, printer_key, name, location, department, connection_type, default_paper_size,
      supports_color, supports_duplex, status, is_default, metadata
    ) values (
      v_tenant_id, v_printer_key, coalesce(v_printer->>'name', 'Local Printer'), v_printer->>'location', v_printer->>'department',
      coalesce(v_printer->>'connection_type', 'local'), coalesce(v_printer->>'default_paper_size', 'A4'),
      coalesce((v_printer->>'supports_color')::boolean, true), coalesce((v_printer->>'supports_duplex')::boolean, true),
      coalesce(v_printer->>'status', 'online'), coalesce((v_printer->>'is_default')::boolean, false),
      coalesce(v_printer->'metadata', '{"source":"desktop_companion","metadata_only":true}'::jsonb)
    ) on conflict (tenant_id, printer_key) do update set
      name = excluded.name, location = excluded.location, department = excluded.department,
      connection_type = excluded.connection_type, default_paper_size = excluded.default_paper_size,
      supports_color = excluded.supports_color, supports_duplex = excluded.supports_duplex,
      status = excluded.status, is_default = excluded.is_default, metadata = excluded.metadata, updated_at = now()
    returning * into v_row;
    v_results := v_results || jsonb_build_array(jsonb_build_object(
      'id', v_row.id, 'printer_key', v_row.printer_key, 'name', v_row.name, 'location', v_row.location,
      'department', v_row.department, 'connection_type', v_row.connection_type, 'default_paper_size', v_row.default_paper_size,
      'supports_color', v_row.supports_color, 'supports_duplex', v_row.supports_duplex, 'status', v_row.status, 'is_default', v_row.is_default
    ));
  end loop;
  perform public._apoe_log_audit(v_tenant_id, 'desktop_printers_registered', 'Desktop printers registered', jsonb_build_object('count', jsonb_array_length(v_results)));
  return jsonb_build_object('printers', v_results, 'count', jsonb_array_length(v_results));
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-printing-document-output-engine', 'Enterprise Printing & Document Output Engine', 'Print & Output Center — Organizational Wisdom Era (279–283). People First.', 'authenticated', 282
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-printing-document-output-engine' and tenant_id is null);

grant execute on function public.get_aipify_print_output_center(uuid) to authenticated;
grant execute on function public.upsert_aipify_print_printer(jsonb) to authenticated;
grant execute on function public.create_aipify_print_job(jsonb) to authenticated;
grant execute on function public.confirm_aipify_print_job(uuid, uuid) to authenticated;
grant execute on function public.cancel_aipify_print_job(uuid) to authenticated;
grant execute on function public.get_aipify_print_job_status(uuid) to authenticated;
grant execute on function public.update_aipify_print_policy(jsonb) to authenticated;
grant execute on function public.report_desktop_print_status(uuid, text, text) to authenticated;
grant execute on function public.register_desktop_print_printers(jsonb) to authenticated;
