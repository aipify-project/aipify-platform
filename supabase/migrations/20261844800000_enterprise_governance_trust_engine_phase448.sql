-- Phase 448 — Enterprise Governance & Trust Engine (Customer App)
-- Route: /app/governance/trust

create table if not exists public.enterprise_governance_trust_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  trust_center_enabled boolean not null default true,
  transparency_mode_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_governance_trust_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'trust_overview', 'governance_status', 'compliance_center', 'audit_center',
    'risk_center', 'approval_center', 'policy_center'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_label text not null default '',
  metric_value text not null default '',
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  updated_at timestamptz not null default now()
);

create index if not exists enterprise_governance_trust_sections_org_idx
  on public.enterprise_governance_trust_section_items (organization_id, section_key);

create table if not exists public.enterprise_governance_trust_framework (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  framework_area text not null check (framework_area in (
    'companion', 'automations', 'actions', 'approvals', 'workflows',
    'business_packs', 'integrations', 'external_providers'
  )),
  area_name text not null,
  governance_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, framework_area)
);

create table if not exists public.enterprise_governance_trust_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  score_category text not null check (score_category in (
    'security', 'compliance', 'governance', 'documentation',
    'approval_controls', 'audit_coverage', 'access_controls', 'organization_total'
  )),
  score_value text not null default '',
  score_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, score_category)
);

create table if not exists public.enterprise_governance_trust_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_type text not null check (policy_type in (
    'approval_rules', 'risk_rules', 'data_rules', 'automation_rules', 'companion_rules', 'department_rules'
  )),
  policy_name text not null,
  rule_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists enterprise_governance_trust_policies_org_idx
  on public.enterprise_governance_trust_policies (organization_id, policy_type);

create table if not exists public.enterprise_governance_trust_audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_name text not null default '',
  event_action text not null,
  event_what text not null default '',
  event_why text not null default '' check (char_length(event_why) <= 500),
  event_result text not null default '',
  approval_history_label text not null default '',
  status_key text not null default 'verified',
  created_at timestamptz not null default now()
);

create index if not exists enterprise_governance_trust_audit_org_idx
  on public.enterprise_governance_trust_audit_events (organization_id, created_at desc);

create table if not exists public.enterprise_governance_trust_explainability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  explain_type text not null check (explain_type in (
    'recommendation', 'decision', 'automation', 'alert', 'action'
  )),
  title text not null,
  why_label text not null default '',
  how_label text not null default '',
  data_used_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_governance_trust_compliance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  framework_key text not null check (framework_key in (
    'gdpr', 'internal_policies', 'industry_regulations', 'regional_frameworks'
  )),
  framework_name text not null,
  compliance_status text not null default 'compliant',
  outstanding_issues text not null default '',
  required_actions text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, framework_key)
);

create table if not exists public.enterprise_governance_trust_approval_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  intel_type text not null check (intel_type in (
    'pending_approval', 'rejected_approval', 'escalated_approval', 'approval_bottleneck'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_governance_trust_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'trust_score', 'audit_coverage', 'compliance_status', 'risk_exposure', 'policy_violations'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.enterprise_governance_trust_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advisor_type text not null check (advisor_type in (
    'recommendation_explain', 'approval_explain', 'risk_explain', 'policy_explain'
  )),
  explanation text not null,
  context_label text not null default '' check (char_length(context_label) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_governance_trust_companion_org_idx
  on public.enterprise_governance_trust_companion (organization_id, status);

create table if not exists public.enterprise_governance_trust_transparency (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_type text not null check (source_type in (
    'decision', 'workflow', 'automation', 'knowledge', 'risk'
  )),
  source_name text not null,
  source_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, source_type)
);

create table if not exists public.enterprise_governance_trust_api_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_type text not null check (integration_type in (
    'audit_systems', 'compliance_systems', 'siem_platforms', 'risk_platforms', 'identity_platforms'
  )),
  integration_name text not null,
  status_label text not null default 'Available',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, integration_type)
);

create table if not exists public.enterprise_governance_trust_audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_governance_trust_audit_log_org_idx
  on public.enterprise_governance_trust_audit_log (organization_id, created_at desc);

alter table public.enterprise_governance_trust_settings enable row level security;
alter table public.enterprise_governance_trust_section_items enable row level security;
alter table public.enterprise_governance_trust_framework enable row level security;
alter table public.enterprise_governance_trust_scores enable row level security;
alter table public.enterprise_governance_trust_policies enable row level security;
alter table public.enterprise_governance_trust_audit_events enable row level security;
alter table public.enterprise_governance_trust_explainability enable row level security;
alter table public.enterprise_governance_trust_compliance enable row level security;
alter table public.enterprise_governance_trust_approval_intel enable row level security;
alter table public.enterprise_governance_trust_executive_metrics enable row level security;
alter table public.enterprise_governance_trust_companion enable row level security;
alter table public.enterprise_governance_trust_transparency enable row level security;
alter table public.enterprise_governance_trust_api_integrations enable row level security;
alter table public.enterprise_governance_trust_audit_log enable row level security;
revoke all on public.enterprise_governance_trust_settings from authenticated, anon;
revoke all on public.enterprise_governance_trust_section_items from authenticated, anon;
revoke all on public.enterprise_governance_trust_framework from authenticated, anon;
revoke all on public.enterprise_governance_trust_scores from authenticated, anon;
revoke all on public.enterprise_governance_trust_policies from authenticated, anon;
revoke all on public.enterprise_governance_trust_audit_events from authenticated, anon;
revoke all on public.enterprise_governance_trust_explainability from authenticated, anon;
revoke all on public.enterprise_governance_trust_compliance from authenticated, anon;
revoke all on public.enterprise_governance_trust_approval_intel from authenticated, anon;
revoke all on public.enterprise_governance_trust_executive_metrics from authenticated, anon;
revoke all on public.enterprise_governance_trust_companion from authenticated, anon;
revoke all on public.enterprise_governance_trust_transparency from authenticated, anon;
revoke all on public.enterprise_governance_trust_api_integrations from authenticated, anon;
revoke all on public.enterprise_governance_trust_audit_log from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_governance_trust_center', v.description
from (values
  ('enterprise_governance_trust.view', 'View Enterprise Governance & Trust Center', 'View trust scores, compliance, audit, policies, and governance framework'),
  ('enterprise_governance_trust.manage', 'Manage Enterprise Governance & Trust Center', 'Manage policies, approvals, and governance trust settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'enterprise_governance_trust.view'), ('owner', 'enterprise_governance_trust.manage'),
  ('administrator', 'enterprise_governance_trust.view'), ('administrator', 'enterprise_governance_trust.manage'),
  ('manager', 'enterprise_governance_trust.view'),
  ('employee', 'enterprise_governance_trust.view'),
  ('support_agent', 'enterprise_governance_trust.view'),
  ('moderator', 'enterprise_governance_trust.view'),
  ('viewer', 'enterprise_governance_trust.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._egte448_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('enterprise_governance_trust.manage', v_org_id),
    'can_manage', public._irp_has_permission('enterprise_governance_trust.manage', v_org_id),
    'can_view', public._irp_has_permission('enterprise_governance_trust.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._egte448_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_governance_trust_audit_log
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._egte448_section_json(s public.enterprise_governance_trust_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._egte448_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_governance_trust_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.enterprise_governance_trust_framework where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.enterprise_governance_trust_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'trust_overview', 'Trust overview', 'Enterprise-grade governance, transparency, accountability, and trust controls across every Aipify action.', 'Trust score', '87/100', 'verified'),
    (p_org_id, 'governance_status', 'Governance status', 'Governance applied to Companion, automations, actions, approvals, workflows, and integrations.', 'Coverage', '100%', 'verified'),
    (p_org_id, 'compliance_center', 'Compliance center', 'GDPR, internal policies, industry regulations, and regional frameworks.', 'Compliant', '3/4', 'requires_attention'),
    (p_org_id, 'audit_center', 'Audit center', 'Universal audit layer — who, what, when, why, result, and approval history.', 'Events', '12,840', 'verified'),
    (p_org_id, 'risk_center', 'Risk center', 'Risk exposure, policy violations, and escalation tracking.', 'Active risks', '4', 'requires_attention'),
    (p_org_id, 'approval_center', 'Approval center', 'Pending, rejected, escalated approvals and bottleneck detection.', 'Pending', '8', 'waiting'),
    (p_org_id, 'policy_center', 'Policy center', 'Approval, risk, data, automation, Companion, and department rules.', 'Policies', '24', 'verified');

  insert into public.enterprise_governance_trust_framework
    (organization_id, framework_area, area_name, governance_label, status_key)
  values
    (p_org_id, 'companion', 'Companion', 'Explainability and approval required for sensitive guidance', 'verified'),
    (p_org_id, 'automations', 'Automations', 'Policy-gated execution with full audit trail', 'verified'),
    (p_org_id, 'actions', 'Actions', 'Trust & Action Engine — Level 4 prohibited for Aipify', 'verified'),
    (p_org_id, 'approvals', 'Approvals', 'Human approval required for sensitive operations', 'verified'),
    (p_org_id, 'workflows', 'Workflows', 'Orchestration with governance checkpoints', 'verified'),
    (p_org_id, 'business_packs', 'Business Packs', 'Module licensing and capability gates enforced', 'verified'),
    (p_org_id, 'integrations', 'Integrations', 'Read-only first — explicit approval for write access', 'verified'),
    (p_org_id, 'external_providers', 'External Providers', 'Model-agnostic — no provider brands in customer UI', 'verified');

  insert into public.enterprise_governance_trust_scores
    (organization_id, score_category, score_value, score_label, status_key)
  values
    (p_org_id, 'organization_total', '87', 'Organization Trust Score', 'verified'),
    (p_org_id, 'security', '92', 'Security', 'verified'),
    (p_org_id, 'compliance', '84', 'Compliance', 'requires_attention'),
    (p_org_id, 'governance', '91', 'Governance', 'verified'),
    (p_org_id, 'documentation', '88', 'Documentation', 'verified'),
    (p_org_id, 'approval_controls', '86', 'Approval Controls', 'requires_attention'),
    (p_org_id, 'audit_coverage', '94', 'Audit Coverage', 'verified'),
    (p_org_id, 'access_controls', '90', 'Access Controls', 'verified');

  insert into public.enterprise_governance_trust_policies
    (organization_id, policy_type, policy_name, rule_label, status_key)
  values
    (p_org_id, 'approval_rules', 'Finance approval threshold', 'Payments above NOK 4,500 require manager approval', 'verified'),
    (p_org_id, 'risk_rules', 'High-risk action escalation', 'Risk level ≥ high escalates to human oversight', 'verified'),
    (p_org_id, 'data_rules', 'Metadata-only default', 'Raw customer content prohibited without explicit approval', 'verified'),
    (p_org_id, 'automation_rules', 'Policy-gated automation', 'Automations execute only within defined policy limits', 'verified'),
    (p_org_id, 'companion_rules', 'Companion explainability', 'All recommendations must include why, how, and data used', 'verified'),
    (p_org_id, 'department_rules', 'Finance department controls', 'Finance approvals require dual authorization', 'requires_attention');

  insert into public.enterprise_governance_trust_audit_events
    (organization_id, actor_name, event_action, event_what, event_why, event_result, approval_history_label, status_key)
  values
    (p_org_id, 'Finance Manager', 'User approved vendor payment', 'Vendor payment NOK 3,200', 'Within policy threshold — routine approval', 'Approved and executed', 'Approved by J. Hansen · 2026-06-18 09:14', 'completed'),
    (p_org_id, 'Aipify', 'Companion generated proposal', 'Support response draft for ticket #4821', 'Business DNA template + knowledge match', 'Draft prepared — awaiting human review', 'No approval required — Level 2 draft', 'verified'),
    (p_org_id, 'Aipify', 'Automation executed workflow', 'Daily report generation', 'Scheduled automation under policy L3', 'Completed successfully', 'Auto-approved within policy', 'completed'),
    (p_org_id, 'Operations Lead', 'User rejected automation', 'Vendor onboarding automation', 'Insufficient documentation for vendor', 'Rejected — manual process required', 'Rejected by K. Olsen · 2026-06-17 14:22', 'not_allowed'),
    (p_org_id, 'Aipify', 'Policy violation blocked', 'Payment execution attempt', 'Restricted action policy — Level 4 prohibited', 'Blocked — escalated to executive', 'Escalated · pending executive review', 'requires_attention');

  insert into public.enterprise_governance_trust_explainability
    (organization_id, explain_type, title, why_label, how_label, data_used_label, status_key)
  values
    (p_org_id, 'recommendation', 'Expand Growth Partner recruitment', 'Coverage gap of 28% in hospitality and retail verticals', 'Opportunity engine analyzed partner pipeline and market signals', 'Aggregate partner metrics — no PII', 'information'),
    (p_org_id, 'decision', 'Vendor payment approval required', 'Amount exceeds routine threshold but within manager limit', 'Trust & Action Engine classified as Level 2 reversible', 'Payment metadata only — no account details stored', 'waiting'),
    (p_org_id, 'automation', 'Daily report generation', 'Scheduled under approved automation policy', 'Workflow engine executed at 06:00 per tenant schedule', 'Aggregate operational metrics', 'verified'),
    (p_org_id, 'alert', 'Finance approvals delayed', '3 approvals pending beyond 48-hour policy target', 'Approval Intelligence detected bottleneck in Finance queue', 'Approval timestamps and status metadata', 'requires_attention'),
    (p_org_id, 'action', 'Support response draft', 'High-confidence FAQ match with approved template', 'Business DNA template priority chain applied', 'Support category metadata — no email content', 'verified');

  insert into public.enterprise_governance_trust_compliance
    (organization_id, framework_key, framework_name, compliance_status, outstanding_issues, required_actions, status_key)
  values
    (p_org_id, 'gdpr', 'GDPR', 'Compliant', '0 outstanding', 'Annual review scheduled Q3', 'verified'),
    (p_org_id, 'internal_policies', 'Internal Policies', 'Compliant', '1 policy update pending', 'Review Finance dual-auth policy', 'requires_attention'),
    (p_org_id, 'industry_regulations', 'Industry Regulations', 'Compliant', '0 outstanding', 'None', 'verified'),
    (p_org_id, 'regional_frameworks', 'Regional Frameworks', 'In progress', 'Nordic data residency review', 'Complete regional framework mapping', 'waiting');

  insert into public.enterprise_governance_trust_approval_intel
    (organization_id, intel_type, title, summary, status_key)
  values
    (p_org_id, 'pending_approval', '8 pending approvals', 'Across Finance, Operations, and Support categories.', 'waiting'),
    (p_org_id, 'rejected_approval', '2 rejected this week', 'Vendor onboarding and payment execution blocked.', 'not_allowed'),
    (p_org_id, 'escalated_approval', '1 escalated to executive', 'Payment execution blocked by restricted action policy.', 'requires_attention'),
    (p_org_id, 'approval_bottleneck', 'Finance approvals delayed', 'Finance approvals delayed beyond 48-hour policy target.', 'requires_attention');

  insert into public.enterprise_governance_trust_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'trust_score', '87/100', '+3 vs prior quarter', 'verified'),
    (p_org_id, 'audit_coverage', '94%', 'All significant events logged', 'verified'),
    (p_org_id, 'compliance_status', '3/4 compliant', 'Regional frameworks in progress', 'requires_attention'),
    (p_org_id, 'risk_exposure', 'Moderate', '4 active risks — 1 critical', 'requires_attention'),
    (p_org_id, 'policy_violations', '2 this month', 'Both blocked — no silent execution', 'verified');

  insert into public.enterprise_governance_trust_companion
    (organization_id, advisor_type, explanation, context_label)
  values
    (p_org_id, 'recommendation_explain', 'Aipify recommended Growth Partner expansion because market coverage gaps were detected in hospitality and retail — based on aggregate partner pipeline data.', 'Opportunity engine · partner metrics · no PII'),
    (p_org_id, 'approval_explain', 'This vendor payment requires your approval because the amount exceeds the routine threshold. Aipify prepared the request — you decide.', 'Trust & Action Engine · Level 2 · payment metadata only'),
    (p_org_id, 'risk_explain', 'Finance approval delays create operational risk. Three approvals have exceeded the 48-hour policy target.', 'Approval Intelligence · timestamp metadata'),
    (p_org_id, 'policy_explain', 'Payment execution is blocked because restricted action policy prohibits Level 4 actions for Aipify. Executive review required.', 'Policy engine · restricted_action rule');

  insert into public.enterprise_governance_trust_transparency
    (organization_id, source_type, source_name, source_label, status_key)
  values
    (p_org_id, 'decision', 'Decision Source', 'Trust & Action Engine + Decision Support Engine', 'verified'),
    (p_org_id, 'workflow', 'Workflow Source', 'ABOS Orchestration Engine workflow definitions', 'verified'),
    (p_org_id, 'automation', 'Automation Source', 'Autonomous Organization + Action Center policies', 'verified'),
    (p_org_id, 'knowledge', 'Knowledge Source', 'Business DNA + Employee Knowledge — approved sources only', 'verified'),
    (p_org_id, 'risk', 'Risk Source', 'Strategic Risk Engine + Approval Intelligence', 'verified');

  insert into public.enterprise_governance_trust_api_integrations
    (organization_id, integration_type, integration_name, status_label, status_key)
  values
    (p_org_id, 'audit_systems', 'Audit Systems API', 'Enterprise — configure in Developer Settings', 'information'),
    (p_org_id, 'compliance_systems', 'Compliance Systems API', 'Enterprise — configure in Developer Settings', 'information'),
    (p_org_id, 'siem_platforms', 'SIEM Platforms API', 'Enterprise — webhook + export available', 'information'),
    (p_org_id, 'risk_platforms', 'Risk Platforms API', 'Enterprise — aggregate signals export', 'information'),
    (p_org_id, 'identity_platforms', 'Identity Platforms API', 'Enterprise — SSO + RBAC sync', 'information');

end; $$;

create or replace function public.get_enterprise_governance_trust_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_overview_s jsonb; v_gov_s jsonb; v_compliance_s jsonb; v_audit_s jsonb;
  v_risk_s jsonb; v_approval_s jsonb; v_policy_s jsonb;
  v_framework jsonb; v_scores jsonb; v_policies jsonb; v_audit jsonb;
  v_explain jsonb; v_compliance jsonb; v_approval_intel jsonb; v_exec jsonb;
  v_companion jsonb; v_transparency jsonb; v_apis jsonb;
begin
  perform public._irp_require_permission('enterprise_governance_trust.view');
  v_ctx := public._egte448_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._egte448_seed(v_org_id);

  select jsonb_build_object(
    'trust_center_enabled', s.trust_center_enabled,
    'transparency_mode_enabled', s.transparency_mode_enabled
  ) into v_settings
  from public.enterprise_governance_trust_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._egte448_section_json(s)), '[]'::jsonb) into v_overview_s
  from public.enterprise_governance_trust_section_items s where s.organization_id = v_org_id and s.section_key = 'trust_overview';
  select coalesce(jsonb_agg(public._egte448_section_json(s)), '[]'::jsonb) into v_gov_s
  from public.enterprise_governance_trust_section_items s where s.organization_id = v_org_id and s.section_key = 'governance_status';
  select coalesce(jsonb_agg(public._egte448_section_json(s)), '[]'::jsonb) into v_compliance_s
  from public.enterprise_governance_trust_section_items s where s.organization_id = v_org_id and s.section_key = 'compliance_center';
  select coalesce(jsonb_agg(public._egte448_section_json(s)), '[]'::jsonb) into v_audit_s
  from public.enterprise_governance_trust_section_items s where s.organization_id = v_org_id and s.section_key = 'audit_center';
  select coalesce(jsonb_agg(public._egte448_section_json(s)), '[]'::jsonb) into v_risk_s
  from public.enterprise_governance_trust_section_items s where s.organization_id = v_org_id and s.section_key = 'risk_center';
  select coalesce(jsonb_agg(public._egte448_section_json(s)), '[]'::jsonb) into v_approval_s
  from public.enterprise_governance_trust_section_items s where s.organization_id = v_org_id and s.section_key = 'approval_center';
  select coalesce(jsonb_agg(public._egte448_section_json(s)), '[]'::jsonb) into v_policy_s
  from public.enterprise_governance_trust_section_items s where s.organization_id = v_org_id and s.section_key = 'policy_center';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'framework_area', f.framework_area, 'area_name', f.area_name,
    'governance_label', f.governance_label, 'status_key', f.status_key, 'item_type', 'framework'
  ) order by f.area_name), '[]'::jsonb)
  into v_framework from public.enterprise_governance_trust_framework f where f.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'score_category', s.score_category, 'score_value', s.score_value,
    'score_label', s.score_label, 'status_key', s.status_key, 'item_type', 'trust_score'
  ) order by case s.score_category when 'organization_total' then 0 else 1 end, s.score_label), '[]'::jsonb)
  into v_scores from public.enterprise_governance_trust_scores s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'policy_type', p.policy_type, 'policy_name', p.policy_name,
    'rule_label', p.rule_label, 'status_key', p.status_key, 'item_type', 'policy'
  ) order by p.policy_name), '[]'::jsonb)
  into v_policies from public.enterprise_governance_trust_policies p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(sub.obj), '[]'::jsonb)
  into v_audit
  from (
    select jsonb_build_object(
      'id', a.id, 'actor_name', a.actor_name, 'event_action', a.event_action,
      'event_what', a.event_what, 'event_why', a.event_why, 'event_result', a.event_result,
      'approval_history_label', a.approval_history_label, 'status_key', a.status_key,
      'created_at', a.created_at, 'item_type', 'audit_event'
    ) as obj
    from public.enterprise_governance_trust_audit_events a
    where a.organization_id = v_org_id
    order by a.created_at desc
    limit 20
  ) sub;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'explain_type', e.explain_type, 'title', e.title,
    'why_label', e.why_label, 'how_label', e.how_label, 'data_used_label', e.data_used_label,
    'status_key', e.status_key, 'item_type', 'explainability'
  ) order by e.title), '[]'::jsonb)
  into v_explain from public.enterprise_governance_trust_explainability e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'framework_key', c.framework_key, 'framework_name', c.framework_name,
    'compliance_status', c.compliance_status, 'outstanding_issues', c.outstanding_issues,
    'required_actions', c.required_actions, 'status_key', c.status_key, 'item_type', 'compliance'
  ) order by c.framework_name), '[]'::jsonb)
  into v_compliance from public.enterprise_governance_trust_compliance c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'intel_type', i.intel_type, 'title', i.title, 'summary', i.summary,
    'status_key', i.status_key, 'item_type', 'approval_intel'
  ) order by i.title), '[]'::jsonb)
  into v_approval_intel from public.enterprise_governance_trust_approval_intel i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'executive'
  ) order by case m.metric_key
    when 'trust_score' then 1 when 'audit_coverage' then 2 when 'compliance_status' then 3
    when 'risk_exposure' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.enterprise_governance_trust_executive_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'advisor_type', c.advisor_type, 'explanation', c.explanation,
    'context_label', c.context_label, 'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.enterprise_governance_trust_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'source_type', t.source_type, 'source_name', t.source_name,
    'source_label', t.source_label, 'status_key', t.status_key, 'item_type', 'transparency'
  ) order by t.source_name), '[]'::jsonb)
  into v_transparency from public.enterprise_governance_trust_transparency t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'integration_type', a.integration_type, 'integration_name', a.integration_name,
    'status_label', a.status_label, 'status_key', a.status_key, 'item_type', 'api_integration'
  ) order by a.integration_name), '[]'::jsonb)
  into v_apis from public.enterprise_governance_trust_api_integrations a where a.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Organizations do not trust systems they cannot understand. Trust must be built into every layer of Aipify — governance, transparency, accountability, compliance, and auditability.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Every significant event records who, what, when, why, result, and approval history. All recommendations are explainable — humans decide.',
    'trust_settings', coalesce(v_settings, '{}'::jsonb),
    'governance_framework', v_framework,
    'trust_score_engine', v_scores,
    'policy_management', v_policies,
    'universal_audit_layer', v_audit,
    'explainability_engine', v_explain,
    'compliance_center', v_compliance,
    'approval_intelligence', v_approval_intel,
    'executive_trust_dashboard', v_exec,
    'companion_trust_advisor', v_companion,
    'enterprise_transparency_mode', v_transparency,
    'governance_apis', v_apis,
    'sections', jsonb_build_object(
      'trust_overview', v_overview_s,
      'governance_status', v_gov_s,
      'compliance_center', v_compliance_s,
      'audit_center', v_audit_s,
      'risk_center', v_risk_s,
      'approval_center', v_approval_s,
      'policy_center', v_policy_s
    ),
    'statistics', jsonb_build_object(
      'framework_count', jsonb_array_length(v_framework),
      'score_count', jsonb_array_length(v_scores),
      'policy_count', jsonb_array_length(v_policies),
      'audit_count', jsonb_array_length(v_audit),
      'compliance_count', jsonb_array_length(v_compliance),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Governance metadata and audit outcomes only — no raw customer communications, payment details, or unapproved PII in trust records.'
  );
end; $$;

create or replace function public.manage_enterprise_governance_trust_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._egte448_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'reject', 'escalate', 'resolve') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.enterprise_governance_trust_companion set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        when 'approve' then 'approved'
        else status
      end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'approval_intel' and p_item_id is not null then
    update public.enterprise_governance_trust_approval_intel set
      status_key = case p_action
        when 'approve' then 'completed'
        when 'reject' then 'not_allowed'
        when 'escalate' then 'requires_attention'
        when 'resolve' then 'verified'
        when 'acknowledge' then 'information'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'compliance' and p_item_id is not null then
    update public.enterprise_governance_trust_compliance set
      status_key = case p_action when 'resolve' then 'verified' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'policy' and p_item_id is not null then
    update public.enterprise_governance_trust_policies set
      status_key = case p_action when 'approve' then 'verified' when 'reject' then 'not_allowed' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._egte448_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Enterprise governance trust item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_enterprise_governance_trust_center() to authenticated;
grant execute on function public.manage_enterprise_governance_trust_item(text, uuid, text, jsonb) to authenticated;
