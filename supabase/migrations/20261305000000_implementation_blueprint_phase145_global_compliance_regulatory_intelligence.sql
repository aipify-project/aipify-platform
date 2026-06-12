-- Implementation Blueprint Phase 145 — Global Compliance & Regulatory Intelligence Engine
-- Extends Compliance & Regulatory Readiness Engine (Phase A.29). No duplicate compliance center.
-- Global Intelligence & Interorganizational Era (141–150).
-- Helpers: _gcribp145_* (never collide with A.29 _crr_* base helpers)

-- ---------------------------------------------------------------------------
-- 1. Optional tenant-scoped tables (extend A.29 — metadata scaffolds)
-- ---------------------------------------------------------------------------
create table if not exists public.compliance_policy_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_type text not null check (
    policy_type in (
      'internal_policy', 'security_standard', 'companion_usage', 'governance_guideline',
      'operations_procedure', 'growth_partner_standard', 'privacy_practice', 'data_handling'
    )
  ),
  title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'under_review', 'archived')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  last_reviewed_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, policy_key)
);

create index if not exists compliance_policy_registry_org_idx
  on public.compliance_policy_registry (organization_id, status, policy_type);

alter table public.compliance_policy_registry enable row level security;
revoke all on public.compliance_policy_registry from authenticated, anon;

create table if not exists public.compliance_review_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cycle_key text not null,
  review_type text not null check (
    review_type in (
      'policy_review', 'documentation_review', 'control_verification',
      'companion_governance_review', 'executive_attestation', 'readiness_assessment', 'gap_identification'
    )
  ),
  title text not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'overdue', 'cancelled')
  ),
  scheduled_at timestamptz not null,
  completed_at timestamptz,
  attestation_status text check (
    attestation_status in ('pending', 'attested', 'declined', 'not_required')
  ),
  gap_findings jsonb not null default '[]'::jsonb,
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, cycle_key)
);

create index if not exists compliance_review_cycles_org_idx
  on public.compliance_review_cycles (organization_id, status, scheduled_at);

alter table public.compliance_review_cycles enable row level security;
revoke all on public.compliance_review_cycles from authenticated, anon;

create table if not exists public.compliance_audit_readiness_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_key text not null,
  evidence_type text not null check (
    evidence_type in (
      'documentation', 'control_tracking', 'review_history', 'attestation_record',
      'policy_reference', 'audit_coordination', 'lessons_learned'
    )
  ),
  title text not null,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'ready', 'needs_attention', 'archived')
  ),
  due_date date,
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, item_key)
);

create index if not exists compliance_audit_readiness_items_org_idx
  on public.compliance_audit_readiness_items (organization_id, status, due_date);

alter table public.compliance_audit_readiness_items enable row level security;
revoke all on public.compliance_audit_readiness_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Distinction note & blueprint metadata helpers (_gcribp145_*)
-- ---------------------------------------------------------------------------
create or replace function public._gcribp145_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 145 — Global Compliance & Regulatory Intelligence at /app/compliance-regulatory-readiness-engine. Extends Compliance & Regulatory Readiness Engine Phase A.29 — do NOT create duplicate compliance center. Global Intelligence Era (141–150). Educational support and preparedness only — NOT legal advice. Distinct from Global Governance & Diplomacy Phase 144 at /app/global-governance-diplomacy-engine (cross-link). Distinct from Governance Policy A.14 at /app/governance-policy-engine. Distinct from Records Retention A.60 at /app/records-retention-management-engine. Clarity not fear — companions support preparedness; organizations remain responsible. Helpers _gcribp145_* — never collide with A.29 _crr_*.';
$$;

create or replace function public._gcribp145_mission()
returns text language sql immutable as $$
  select 'Help organizations build clarity and preparedness for compliance and regulatory responsibilities — through documentation, reviews, and educational awareness — without providing legal advice or guaranteeing outcomes.';
$$;

create or replace function public._gcribp145_philosophy()
returns text language sql immutable as $$
  select 'Clarity and preparedness — not fear or bureaucracy for its own sake. Organizations remain responsible. Companions support; they do not guarantee compliance. People First. Growth Partner not Affiliate.';
$$;

create or replace function public._gcribp145_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Compliance & Regulatory Intelligence surfaces readiness metadata, review schedules, and educational awareness scaffolds; executives retain accountability; companions never provide legal opinions.';
$$;

create or replace function public._gcribp145_vision()
returns text language sql immutable as $$
  select 'Organizations navigate compliance with calm clarity — prepared, documented, and supported — because stewardship through responsibility beats fear-driven bureaucracy.';
$$;

create or replace function public._gcribp145_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_compliance_center', 'label', 'Global compliance center', 'description', 'Unified dashboards, regulatory libraries, policy management, reviews, executive reporting, GP guidance, audit prep, risk visibility'),
    jsonb_build_object('key', 'regulatory_intelligence', 'label', 'Regulatory intelligence engine', 'description', 'Awareness scaffolds for privacy, security, industry certs, consumer protection, employment, cross-border ops, governance, companion governance — not legal opinions'),
    jsonb_build_object('key', 'policy_management', 'label', 'Policy management engine', 'description', 'Internal policies, security standards, governance guidelines, ops procedures, companion usage, GP standards, ownership assignments'),
    jsonb_build_object('key', 'compliance_reviews', 'label', 'Compliance review engine', 'description', 'Policy reviews, documentation reviews, control verification, companion governance reviews, executive attestations, readiness assessments, gap identification'),
    jsonb_build_object('key', 'executive_dashboard', 'label', 'Executive compliance dashboard', 'description', 'Activities, review schedules, outstanding actions, governance status, companion oversight, GP obligations, policy health'),
    jsonb_build_object('key', 'compliance_companion', 'label', 'Compliance Companion', 'description', 'Knowledge retrieval, policy navigation, checklists, review coordination, documentation guidance, executive summaries — NOT legal advice'),
    jsonb_build_object('key', 'audit_readiness', 'label', 'Audit readiness engine', 'description', 'Evidence collection scaffold, documentation prep, review histories, control tracking, audit coordination, lessons learned'),
    jsonb_build_object('key', 'gp_compliance_support', 'label', 'Growth Partner compliance support', 'description', 'Implementation standards, customer documentation, governance expectations, security practices, professional conduct, certification requirements')
  );
$$;

create or replace function public._gcribp145_global_compliance_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global compliance center — clarity and preparedness across regulatory awareness, policy management, and audit readiness.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'dashboards', 'label', 'Compliance dashboards', 'description', 'Executive and operational compliance visibility — metadata only'),
      jsonb_build_object('key', 'regulatory_libraries', 'label', 'Regulatory libraries', 'description', 'Educational awareness scaffolds — not legal opinions'),
      jsonb_build_object('key', 'policy_management', 'label', 'Policy management', 'description', 'Internal policy registry with ownership and review status'),
      jsonb_build_object('key', 'compliance_reviews', 'label', 'Compliance reviews', 'description', 'Scheduled reviews, attestations, and gap findings'),
      jsonb_build_object('key', 'executive_reporting', 'label', 'Executive reporting', 'description', 'Summary reports for leadership — export with audit trail'),
      jsonb_build_object('key', 'gp_guidance', 'label', 'Growth Partner guidance', 'description', 'GP implementation and documentation standards — cross-link /app/partners'),
      jsonb_build_object('key', 'audit_prep', 'label', 'Audit preparation', 'description', 'Evidence tracking scaffolds and readiness items'),
      jsonb_build_object('key', 'risk_visibility', 'label', 'Risk visibility', 'description', 'Outstanding actions and gap findings — clarity not alarmism')
    )
  );
$$;

create or replace function public._gcribp145_regulatory_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'privacy', 'label', 'Privacy awareness', 'description', 'Data protection awareness scaffolds — cross-link Records Retention A.60'),
    jsonb_build_object('key', 'security_standards', 'label', 'Security standards', 'description', 'Security practice awareness — cross-link Trust Architecture /app/settings/security'),
    jsonb_build_object('key', 'industry_certs', 'label', 'Industry certifications', 'description', 'Certification readiness awareness — not certification guarantees'),
    jsonb_build_object('key', 'consumer_protection', 'label', 'Consumer protection', 'description', 'Consumer-facing practice awareness scaffolds'),
    jsonb_build_object('key', 'employment', 'label', 'Employment practices', 'description', 'Workplace compliance awareness — metadata only'),
    jsonb_build_object('key', 'cross_border', 'label', 'Cross-border operations', 'description', 'Multi-jurisdiction awareness scaffolds — organizations consult professionals'),
    jsonb_build_object('key', 'governance', 'label', 'Governance awareness', 'description', 'Governance policy cross-link — A.14 /app/governance-policy-engine'),
    jsonb_build_object('key', 'companion_governance', 'label', 'Companion governance', 'description', 'AI companion usage policies and oversight — cross-link Human Oversight A.40')
  );
$$;

create or replace function public._gcribp145_policy_management_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'internal_policies', 'label', 'Internal policies', 'description', 'Organization-defined policy registry with ownership'),
    jsonb_build_object('key', 'security_policies', 'label', 'Security policies', 'description', 'Security standard references and review schedules'),
    jsonb_build_object('key', 'governance_guidelines', 'label', 'Governance guidelines', 'description', 'Governance alignment — cross-link A.14'),
    jsonb_build_object('key', 'operations_procedures', 'label', 'Operations procedures', 'description', 'Operational compliance documentation scaffolds'),
    jsonb_build_object('key', 'companion_usage', 'label', 'Companion usage policies', 'description', 'AI companion governance and usage boundaries'),
    jsonb_build_object('key', 'gp_standards', 'label', 'Growth Partner standards', 'description', 'GP implementation and professional conduct standards'),
    jsonb_build_object('key', 'ownership_assignments', 'label', 'Ownership assignments', 'description', 'Policy owners and review accountability — RBAC visible')
  );
$$;

create or replace function public._gcribp145_compliance_review_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'policy_reviews', 'label', 'Policy reviews', 'description', 'Scheduled internal policy review cycles'),
    jsonb_build_object('key', 'documentation_reviews', 'label', 'Documentation reviews', 'description', 'Compliance documentation completeness checks'),
    jsonb_build_object('key', 'control_verification', 'label', 'Control verification', 'description', 'Control tracking and verification scaffolds'),
    jsonb_build_object('key', 'companion_governance_reviews', 'label', 'Companion governance reviews', 'description', 'AI companion usage and oversight reviews'),
    jsonb_build_object('key', 'executive_attestations', 'label', 'Executive attestations', 'description', 'Leadership attestation workflows with audit trail'),
    jsonb_build_object('key', 'readiness_assessments', 'label', 'Readiness assessments', 'description', 'Compliance readiness self-assessment scaffolds'),
    jsonb_build_object('key', 'gap_identification', 'label', 'Gap identification', 'description', 'Gap findings metadata — clarity for remediation planning')
  );
$$;

create or replace function public._gcribp145_executive_compliance_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive compliance dashboard — activities, schedules, actions, governance status, companion oversight, GP obligations, policy health.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'activities', 'label', 'Compliance activities', 'description', 'Open and in-progress compliance records and review cycles'),
      jsonb_build_object('key', 'review_schedules', 'label', 'Review schedules', 'description', 'Upcoming and overdue review cycles and attestations'),
      jsonb_build_object('key', 'outstanding_actions', 'label', 'Outstanding actions', 'description', 'Items needing attention — clarity not alarmism'),
      jsonb_build_object('key', 'governance_status', 'label', 'Governance status', 'description', 'Policy health and governance alignment summary'),
      jsonb_build_object('key', 'companion_oversight', 'label', 'Companion oversight', 'description', 'Companion governance review status'),
      jsonb_build_object('key', 'gp_obligations', 'label', 'Growth Partner obligations', 'description', 'GP compliance support expectations — cross-link /app/partners'),
      jsonb_build_object('key', 'policy_health', 'label', 'Policy health', 'description', 'Active vs under-review vs archived policy counts')
    )
  );
$$;

create or replace function public._gcribp145_compliance_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Compliance Companion provides educational support and preparedness guidance — NOT legal advice.',
    'may', jsonb_build_array(
      'Retrieve compliance knowledge and policy navigation guidance',
      'Prepare review checklists and documentation guidance scaffolds',
      'Coordinate review schedules and outstanding action summaries',
      'Summarize compliance readiness status for executive review',
      'Navigate Growth Partner compliance support resources',
      'Highlight gap findings for human remediation planning'
    ),
    'must_avoid', jsonb_build_array(
      'Providing legal opinions or interpreting regulations as law',
      'Guaranteeing compliance outcomes or certification success',
      'Replacing qualified legal, audit, or compliance professionals',
      'Suppressing uncertainty — escalate when confidence is low',
      'Overriding executive accountability for compliance decisions'
    ),
    'legal_disclaimer', 'Aipify does not provide legal advice. Educational support and preparedness only. Consult qualified professionals for legal and regulatory guidance.'
  );
$$;

create or replace function public._gcribp145_audit_readiness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'evidence_collection', 'label', 'Evidence collection scaffold', 'description', 'Audit readiness item tracking — metadata only'),
    jsonb_build_object('key', 'documentation_prep', 'label', 'Documentation preparation', 'description', 'Documentation completeness for audit coordination'),
    jsonb_build_object('key', 'review_histories', 'label', 'Review histories', 'description', 'Completed review cycle audit trail'),
    jsonb_build_object('key', 'control_tracking', 'label', 'Control tracking', 'description', 'Control verification status scaffolds'),
    jsonb_build_object('key', 'audit_coordination', 'label', 'Audit coordination', 'description', 'Audit preparation workflow metadata'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Post-review improvement metadata — cross-link Continuous Improvement')
  );
$$;

create or replace function public._gcribp145_growth_partner_compliance_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner compliance support — implementation standards, documentation, governance expectations, security practices, professional conduct, certification requirements.',
    'partners_route', '/app/partners',
    'growth_partner_ops_route', '/app/growth-partner-operations',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'implementation_standards', 'label', 'Implementation standards', 'description', 'GP deployment and configuration standards'),
      jsonb_build_object('key', 'customer_documentation', 'label', 'Customer documentation', 'description', 'Documentation expectations for customer deployments'),
      jsonb_build_object('key', 'governance_expectations', 'label', 'Governance expectations', 'description', 'Governance alignment for GP-led implementations'),
      jsonb_build_object('key', 'security_practices', 'label', 'Security practices', 'description', 'Security baseline for GP implementations'),
      jsonb_build_object('key', 'professional_conduct', 'label', 'Professional conduct', 'description', 'Ethical and professional standards — Growth Partner not Affiliate'),
      jsonb_build_object('key', 'certification_requirements', 'label', 'Certification requirements', 'description', 'GP certification compliance awareness — cross-link Trust Network Phase 142')
    )
  );
$$;

create or replace function public._gcribp145_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'No legal opinions — educational awareness scaffolds only',
    'No guarantee of compliance outcomes or certification success',
    'No replacement for qualified legal, audit, or compliance professionals',
    'No suppression of uncertainty — escalate when confidence is low',
    'No override of executive accountability for compliance decisions',
    'No fear-driven alarmism — clarity and preparedness only'
  );
$$;

create or replace function public._gcribp145_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Clarity, preparation, collaboration, realistic expectations, recognition of progress, and supportive leadership — compliance readiness serves people, not bureaucracy.',
    'practices', jsonb_build_array(
      'Clarity — understand obligations without fear-driven noise',
      'Preparation — document and review at a sustainable pace',
      'Collaboration — involve the right people and professionals',
      'Realistic expectations — progress over perfection',
      'Recognition of progress — acknowledge completed reviews and improvements',
      'Supportive leadership — executives model stewardship through responsibility'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Compliance Engine stores readiness metadata, not wellbeing content.'
  );
$$;

create or replace function public._gcribp145_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'policy_audit_trails', 'label', 'Policy audit trails', 'description', 'Every policy change and review is auditable'),
    jsonb_build_object('key', 'attestation_histories', 'label', 'Attestation histories', 'description', 'Executive attestation records with immutable audit log'),
    jsonb_build_object('key', 'evidence_access_controls', 'label', 'Evidence access controls', 'description', 'RBAC-scoped access to audit readiness items'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access control', 'description', 'compliance.view, compliance.manage, compliance.review, compliance.export permissions'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', '2FA recommended for compliance administrators — /app/settings/two-factor')
  );
$$;

create or replace function public._gcribp145_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Compliance & Regulatory Readiness A.29', 'route', '/app/compliance-regulatory-readiness-engine', 'note', 'THIS blueprint extends — preserve all A.29 fields'),
    jsonb_build_object('label', 'Global Governance & Diplomacy Phase 144', 'route', '/app/global-governance-diplomacy-engine', 'note', 'Global governance cross-link — distinct from compliance preparedness'),
    jsonb_build_object('label', 'Trust Network Phase 142', 'route', '/app/trust-reputation-engine', 'note', 'Verification and procurement readiness cross-link'),
    jsonb_build_object('label', 'Governance Policy A.14', 'route', '/app/governance-policy-engine', 'note', 'Policy governance cross-link'),
    jsonb_build_object('label', 'Records Retention A.60', 'route', '/app/records-retention-management-engine', 'note', 'Retention policies cross-link'),
    jsonb_build_object('label', 'Enterprise Readiness A.30', 'route', '/app/enterprise-readiness-engine', 'note', 'Enterprise procurement readiness cross-link'),
    jsonb_build_object('label', 'Ecosystem Governance Phase 119', 'route', '/app/ecosystem-governance', 'note', 'Ecosystem governance cross-link'),
    jsonb_build_object('label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'note', 'Interorganizational learning cross-link'),
    jsonb_build_object('label', 'Trust Architecture', 'route', '/app/settings/security', 'note', 'Security dashboard cross-link')
  );
$$;

create or replace function public._gcribp145_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group and Unonight pilot compliance readiness first — transparent documentation, not marketing claims.',
    'aipify_group', jsonb_build_object(
      'organization', 'Aipify Group AS',
      'note', 'Platform operator maintains compliance readiness metadata with full audit transparency'
    ),
    'unonight', jsonb_build_object(
      'organization', 'Unonight',
      'note', 'First customer pilot — compliance review cycles and policy registry scaffolds'
    )
  );
$$;

create or replace function public._gcribp145_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Clarity and preparedness — not fear or bureaucracy for its own sake',
    'Organizations remain responsible — companions support, never guarantee',
    'Educational awareness scaffolds — not legal opinions',
    'Stewardship through responsibility — executives own compliance decisions',
    'Progress over perfection — sustainable review rhythms',
    'Growth Partner not Affiliate — professional compliance support standards'
  );
$$;

create or replace function public._gcribp145_privacy_note()
returns text language sql immutable as $$
  select 'Compliance data is organization-scoped, explainable, and auditable. Metadata only — no raw operational records, no legal opinions stored. Consult qualified professionals for legal guidance.';
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed & engagement helpers
-- ---------------------------------------------------------------------------
create or replace function public._gcribp145_seed_org(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._crr_seed_org(p_organization_id);

  insert into public.compliance_policy_registry (organization_id, policy_key, policy_type, title, status)
  select p_organization_id, v.key, v.type, v.title, v.status
  from (values
    ('data_handling_policy', 'data_handling', 'Data handling policy', 'draft'),
    ('companion_usage_policy', 'companion_usage', 'Companion usage policy', 'draft'),
    ('security_baseline', 'security_standard', 'Security baseline standards', 'active'),
    ('access_review_procedure', 'operations_procedure', 'Access review procedure', 'active')
  ) as v(key, type, title, status)
  on conflict (organization_id, policy_key) do nothing;

  insert into public.compliance_review_cycles (organization_id, cycle_key, review_type, title, status, scheduled_at, attestation_status)
  select p_organization_id, v.key, v.type, v.title, v.status, v.scheduled, v.attest
  from (values
    ('quarterly_policy_review', 'policy_review', 'Quarterly policy review', 'scheduled', now() + interval '3 months', 'not_required'),
    ('annual_compliance_attestation', 'executive_attestation', 'Annual compliance attestation', 'scheduled', now() + interval '1 year', 'pending'),
    ('companion_governance_review', 'companion_governance_review', 'Companion governance review', 'scheduled', now() + interval '2 months', 'not_required'),
    ('readiness_assessment_q1', 'readiness_assessment', 'Q1 readiness assessment', 'scheduled', now() + interval '1 month', 'not_required')
  ) as v(key, type, title, status, scheduled, attest)
  on conflict (organization_id, cycle_key) do nothing;

  insert into public.compliance_audit_readiness_items (organization_id, item_key, evidence_type, title, status, due_date)
  select p_organization_id, v.key, v.type, v.title, v.status, v.due
  from (values
    ('audit_log_coverage', 'control_tracking', 'Audit log completeness evidence', 'in_progress', current_date + 14),
    ('retention_policy_docs', 'documentation', 'Retention policy documentation', 'pending', current_date + 30),
    ('access_review_records', 'review_history', 'Access review completion records', 'pending', current_date + 21),
    ('companion_governance_docs', 'policy_reference', 'Companion governance documentation', 'pending', current_date + 45)
  ) as v(key, type, title, status, due)
  on conflict (organization_id, item_key) do nothing;
end; $$;

create or replace function public._gcribp145_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_open_records int := 0;
  v_overdue_records int := 0;
  v_active_policies int := 0;
  v_under_review_policies int := 0;
  v_scheduled_reviews int := 0;
  v_overdue_reviews int := 0;
  v_pending_attestations int := 0;
  v_audit_ready int := 0;
  v_audit_needs_attention int := 0;
begin
  perform public._gcribp145_seed_org(p_org_id);

  select count(*) filter (where status in ('open', 'in_progress')),
         count(*) filter (where status = 'overdue')
  into v_open_records, v_overdue_records
  from public.compliance_records where organization_id = p_org_id;

  select count(*) filter (where status = 'active'),
         count(*) filter (where status = 'under_review')
  into v_active_policies, v_under_review_policies
  from public.compliance_policy_registry where organization_id = p_org_id;

  select count(*) filter (where status in ('scheduled', 'in_progress')),
         count(*) filter (where status = 'overdue')
  into v_scheduled_reviews, v_overdue_reviews
  from public.compliance_review_cycles where organization_id = p_org_id;

  select count(*) into v_pending_attestations
  from public.compliance_review_cycles
  where organization_id = p_org_id and attestation_status = 'pending';

  select count(*) filter (where status = 'ready'),
         count(*) filter (where status = 'needs_attention')
  into v_audit_ready, v_audit_needs_attention
  from public.compliance_audit_readiness_items where organization_id = p_org_id;

  return jsonb_build_object(
    'open_records', coalesce(v_open_records, 0),
    'overdue_records', coalesce(v_overdue_records, 0),
    'active_policies', coalesce(v_active_policies, 0),
    'under_review_policies', coalesce(v_under_review_policies, 0),
    'scheduled_reviews', coalesce(v_scheduled_reviews, 0),
    'overdue_reviews', coalesce(v_overdue_reviews, 0),
    'pending_attestations', coalesce(v_pending_attestations, 0),
    'audit_ready_items', coalesce(v_audit_ready, 0),
    'audit_needs_attention', coalesce(v_audit_needs_attention, 0),
    'cross_links_count', jsonb_array_length(public._gcribp145_integration_links()),
    'phase145_note', 'Phase 145 Global Compliance engagement — preparedness metadata only; not legal advice.',
    'privacy_note', public._gcribp145_privacy_note()
  );
end; $$;

create or replace function public._gcribp145_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_engagement jsonb;
begin
  v_engagement := public._gcribp145_engagement_summary(p_org_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'legal_disclaimer',
      'label', 'Legal disclaimer — NOT legal advice',
      'met', true,
      'note', 'Compliance Companion provides educational support only.'
    ),
    jsonb_build_object(
      'key', 'global_compliance_center',
      'label', 'Global compliance center — eight capabilities',
      'met', jsonb_array_length(public._gcribp145_global_compliance_center()->'capabilities') >= 8,
      'note', 'Dashboards, libraries, policy mgmt, reviews, reporting, GP guidance, audit prep, risk visibility.'
    ),
    jsonb_build_object(
      'key', 'regulatory_intelligence',
      'label', 'Regulatory intelligence — eight awareness domains',
      'met', jsonb_array_length(public._gcribp145_regulatory_intelligence_engine()) >= 8,
      'note', 'Awareness scaffolds — not legal opinions.'
    ),
    jsonb_build_object(
      'key', 'policy_management',
      'label', 'Policy management — seven policy types',
      'met', jsonb_array_length(public._gcribp145_policy_management_engine()) >= 7,
      'note', 'Internal policies, security, governance, ops, companion usage, GP standards, ownership.'
    ),
    jsonb_build_object(
      'key', 'compliance_reviews',
      'label', 'Compliance review engine — seven review types',
      'met', jsonb_array_length(public._gcribp145_compliance_review_engine()) >= 7,
      'note', 'Policy reviews through gap identification.'
    ),
    jsonb_build_object(
      'key', 'compliance_companion',
      'label', 'Compliance Companion — guides without legal opinions',
      'met', jsonb_array_length(public._gcribp145_compliance_companion()->'may') >= 6,
      'note', 'Educational support and preparedness only.'
    ),
    jsonb_build_object(
      'key', 'audit_readiness',
      'label', 'Audit readiness — six evidence scaffolds',
      'met', jsonb_array_length(public._gcribp145_audit_readiness_engine()) >= 6,
      'note', 'Evidence collection through lessons learned.'
    ),
    jsonb_build_object(
      'key', 'companion_limitations',
      'label', 'Companion limitations — six boundaries',
      'met', jsonb_array_length(public._gcribp145_companion_limitations()) >= 6,
      'note', 'No legal opinions, no guarantees, no professional replacement.'
    ),
    jsonb_build_object(
      'key', 'security_requirements',
      'label', 'Security requirements — audit trails, RBAC, 2FA',
      'met', jsonb_array_length(public._gcribp145_security_requirements()) >= 5,
      'note', 'Policy audit trails and attestation histories.'
    ),
    jsonb_build_object(
      'key', 'cross_links',
      'label', 'Cross-links Phase 144, 142, 119, 141, governance A.14',
      'met', jsonb_array_length(public._gcribp145_integration_links()) >= 8,
      'note', 'Extend related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'live_readiness',
      'label', 'Live compliance readiness scaffolds',
      'met', coalesce((v_engagement->>'scheduled_reviews')::int, 0) > 0
        or coalesce((v_engagement->>'active_policies')::int, 0) > 0,
      'note', case
        when coalesce((v_engagement->>'scheduled_reviews')::int, 0) = 0
          and coalesce((v_engagement->>'active_policies')::int, 0) = 0
        then 'Schedule a compliance review or activate a policy to begin readiness workflow.'
        else null
      end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs — review scheduling & attestation
-- ---------------------------------------------------------------------------
create or replace function public.schedule_compliance_review(
  p_review_type text,
  p_title text,
  p_scheduled_at timestamptz default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_key text;
begin
  perform public._irp_require_permission('compliance.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._gcribp145_seed_org(v_org_id);

  if p_review_type is null or p_review_type not in (
    'policy_review', 'documentation_review', 'control_verification',
    'companion_governance_review', 'executive_attestation', 'readiness_assessment', 'gap_identification'
  ) then
    raise exception 'invalid_review_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'review_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.compliance_review_cycles (
    organization_id, cycle_key, review_type, title, status, scheduled_at,
    attestation_status, owner_user_id, metadata
  )
  values (
    v_org_id, v_key, p_review_type, trim(p_title), 'scheduled',
    coalesce(p_scheduled_at, now() + interval '30 days'),
    case when p_review_type = 'executive_attestation' then 'pending' else 'not_required' end,
    v_user_id,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._crr_log(
    v_org_id, 'compliance_review_scheduled', 'compliance_review_cycle', v_id,
    jsonb_build_object('review_type', p_review_type, 'title', trim(p_title))
  );

  return jsonb_build_object(
    'success', true,
    'review_cycle_id', v_id,
    'cycle_key', v_key,
    'status', 'scheduled',
    'legal_disclaimer', public._gcribp145_compliance_companion()->>'legal_disclaimer',
    'privacy_note', public._gcribp145_privacy_note()
  );
end; $$;

create or replace function public.record_compliance_attestation(
  p_cycle_id uuid,
  p_attested boolean,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.compliance_review_cycles;
begin
  perform public._irp_require_permission('compliance.review');
  v_org_id := public._mta_require_organization();

  update public.compliance_review_cycles
  set attestation_status = case when p_attested then 'attested' else 'declined' end,
      status = case when p_attested then 'completed' else status end,
      completed_at = case when p_attested then now() else completed_at end,
      metadata = metadata || jsonb_build_object(
        'attestation_notes', coalesce(p_notes, ''),
        'attested_at', now()
      ),
      updated_at = now()
  where id = p_cycle_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'review_cycle_not_found';
  end if;

  perform public._crr_log(
    v_org_id, 'compliance_attestation_recorded', 'compliance_review_cycle', p_cycle_id,
    jsonb_build_object('attested', p_attested, 'attestation_status', v_row.attestation_status)
  );

  return jsonb_build_object(
    'success', true,
    'review_cycle_id', v_row.id,
    'attestation_status', v_row.attestation_status,
    'status', v_row.status,
    'legal_disclaimer', public._gcribp145_compliance_companion()->>'legal_disclaimer',
    'privacy_note', public._gcribp145_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL A.29 fields; append Phase 145
-- ---------------------------------------------------------------------------
create or replace function public.get_compliance_regulatory_readiness_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('compliance.view');
  v_org_id := public._mta_require_organization();
  perform public._gcribp145_seed_org(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Compliance readiness through documentation, retention policies, and scheduled reviews — not legal advice.',
    'principles', jsonb_build_array(
      'Tenant-aware compliance',
      'Documentation readiness',
      'Configurable retention',
      'Access review program',
      'Audit-supported accountability',
      'Clarity and preparedness — not fear or bureaucracy',
      'Educational support only — organizations remain responsible'
    ),
    'summary', jsonb_build_object(
      'open_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status in ('open', 'in_progress')), 0),
      'overdue_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status = 'overdue'), 0),
      'completed_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status = 'completed'), 0),
      'upcoming_reviews', coalesce((select count(*) from public.compliance_review_schedules where organization_id = v_org_id and status = 'scheduled'), 0)
    ),
    'records', coalesce((select jsonb_agg(row_to_json(r) order by r.due_date nulls last) from public.compliance_records r where r.organization_id = v_org_id), '[]'::jsonb),
    'retention_policies', coalesce((select jsonb_agg(row_to_json(p)) from public.compliance_retention_policies p where p.organization_id = v_org_id), '[]'::jsonb),
    'review_schedules', coalesce((select jsonb_agg(row_to_json(s) order by s.next_review_at) from public.compliance_review_schedules s where s.organization_id = v_org_id), '[]'::jsonb),
    'implementation_blueprint_phase145', jsonb_build_object(
      'phase', 'Phase 145 — Global Compliance & Regulatory Intelligence Engine',
      'doc', 'GLOBAL_COMPLIANCE_REGULATORY_INTELLIGENCE_ENGINE_PHASE145.md',
      'engine_phase', 'Phase A.29 Compliance & Regulatory Readiness Engine',
      'route', '/app/compliance-regulatory-readiness-engine',
      'era', 'Global Intelligence & Interorganizational Era (141–150)',
      'mapping_note', 'ABOS Blueprint Phase 145 maps to Compliance & Regulatory Readiness Engine Phase A.29 — extends with Global Intelligence Era depth: regulatory intelligence, policy management, compliance reviews, executive dashboard, Compliance Companion, audit readiness, and Growth Partner compliance support.'
    ),
    'global_compliance_regulatory_intelligence_note', 'Global Compliance & Regulatory Intelligence (ABOS Phase 145) — educational support and preparedness only; NOT legal advice. Extends A.29 with Global Intelligence Era depth.',
    'blueprint_distinction_note', public._gcribp145_distinction_note(),
    'blueprint_mission', public._gcribp145_mission(),
    'blueprint_philosophy', public._gcribp145_philosophy(),
    'blueprint_abos_principle', public._gcribp145_abos_principle(),
    'vision', public._gcribp145_vision(),
    'phase145_objectives', public._gcribp145_objectives(),
    'global_compliance_center', public._gcribp145_global_compliance_center(),
    'regulatory_intelligence_engine', public._gcribp145_regulatory_intelligence_engine(),
    'policy_management_engine', public._gcribp145_policy_management_engine(),
    'compliance_review_engine', public._gcribp145_compliance_review_engine(),
    'executive_compliance_dashboard', public._gcribp145_executive_compliance_dashboard(),
    'compliance_companion', public._gcribp145_compliance_companion(),
    'audit_readiness_engine', public._gcribp145_audit_readiness_engine(),
    'growth_partner_compliance_support', public._gcribp145_growth_partner_compliance_support(),
    'phase145_companion_limitations', public._gcribp145_companion_limitations(),
    'phase145_self_love_connection', public._gcribp145_self_love_connection(),
    'phase145_security_requirements', public._gcribp145_security_requirements(),
    'phase145_integration_links', public._gcribp145_integration_links(),
    'dogfooding_phase145', public._gcribp145_dogfooding(),
    'phase145_success_criteria', public._gcribp145_success_criteria(v_org_id),
    'engagement_summary', public._gcribp145_engagement_summary(v_org_id),
    'vision_phrases', public._gcribp145_vision_phrases(),
    'privacy_note', public._gcribp145_privacy_note(),
    'legal_disclaimer', public._gcribp145_compliance_companion()->>'legal_disclaimer',
    'sections', jsonb_build_object(
      'policy_registry', coalesce((
        select jsonb_agg(row_to_json(p) order by p.updated_at desc)
        from public.compliance_policy_registry p
        where p.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'review_cycles', coalesce((
        select jsonb_agg(row_to_json(c) order by c.scheduled_at)
        from public.compliance_review_cycles c
        where c.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'audit_readiness_items', coalesce((
        select jsonb_agg(row_to_json(i) order by i.due_date nulls last)
        from public.compliance_audit_readiness_items i
        where i.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb)
    )
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve A.29; append Phase 145 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_compliance_regulatory_readiness_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._gcribp145_seed_org(v_org_id);
  v_engagement := public._gcribp145_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'open_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status in ('open', 'in_progress', 'overdue')), 0),
    'philosophy', 'Governance and regulatory readiness for enterprise adoption — educational support, not legal advice.',
    'implementation_blueprint_phase145', jsonb_build_object(
      'phase', 'Phase 145 — Global Compliance & Regulatory Intelligence Engine',
      'doc', 'GLOBAL_COMPLIANCE_REGULATORY_INTELLIGENCE_ENGINE_PHASE145.md',
      'engine_phase', 'Phase A.29 Compliance & Regulatory Readiness Engine',
      'route', '/app/compliance-regulatory-readiness-engine'
    ),
    'mission', public._gcribp145_mission(),
    'abos_principle', public._gcribp145_abos_principle(),
    'engagement_summary', v_engagement,
    'legal_disclaimer', public._gcribp145_compliance_companion()->>'legal_disclaimer',
    'blueprint_note', 'Global Compliance & Regulatory Intelligence (ABOS Phase 145) — extends A.29 with regulatory intelligence, policy management, compliance reviews, audit readiness, and Growth Partner compliance support.',
    'companion_note', 'Compliance Companion provides educational support and preparedness — NOT legal advice.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants & KC category
-- ---------------------------------------------------------------------------
grant execute on function public._gcribp145_distinction_note() to authenticated;
grant execute on function public._gcribp145_mission() to authenticated;
grant execute on function public._gcribp145_philosophy() to authenticated;
grant execute on function public._gcribp145_abos_principle() to authenticated;
grant execute on function public._gcribp145_vision() to authenticated;
grant execute on function public._gcribp145_objectives() to authenticated;
grant execute on function public._gcribp145_global_compliance_center() to authenticated;
grant execute on function public._gcribp145_regulatory_intelligence_engine() to authenticated;
grant execute on function public._gcribp145_policy_management_engine() to authenticated;
grant execute on function public._gcribp145_compliance_review_engine() to authenticated;
grant execute on function public._gcribp145_executive_compliance_dashboard() to authenticated;
grant execute on function public._gcribp145_compliance_companion() to authenticated;
grant execute on function public._gcribp145_audit_readiness_engine() to authenticated;
grant execute on function public._gcribp145_growth_partner_compliance_support() to authenticated;
grant execute on function public._gcribp145_companion_limitations() to authenticated;
grant execute on function public._gcribp145_self_love_connection() to authenticated;
grant execute on function public._gcribp145_security_requirements() to authenticated;
grant execute on function public._gcribp145_integration_links() to authenticated;
grant execute on function public._gcribp145_dogfooding() to authenticated;
grant execute on function public._gcribp145_vision_phrases() to authenticated;
grant execute on function public._gcribp145_privacy_note() to authenticated;
grant execute on function public._gcribp145_seed_org(uuid) to authenticated;
grant execute on function public._gcribp145_engagement_summary(uuid) to authenticated;
grant execute on function public._gcribp145_success_criteria(uuid) to authenticated;
grant execute on function public.schedule_compliance_review(text, text, timestamptz, jsonb) to authenticated;
grant execute on function public.record_compliance_attestation(uuid, boolean, text) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-compliance-regulatory-intelligence-blueprint', 'Global Compliance & Regulatory Intelligence (ABOS Phase 145)',
  'Global Compliance & Regulatory Intelligence — extends Phase A.29 with regulatory intelligence, policy management, compliance reviews, audit readiness, and Growth Partner compliance support. Educational support only — NOT legal advice.',
  'authenticated', 107
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-compliance-regulatory-intelligence-blueprint' and tenant_id is null
);

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop perform public._gcribp145_seed_org(v_org_id); end loop;
end $$;
