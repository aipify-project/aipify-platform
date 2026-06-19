-- Phase 560 — Companion Governance, Safety, Oversight & Trust Framework
-- Feature owner: CUSTOMER APP. Routes: /app/companion/governance, /governance/actions, /governance/audit. Helpers: _cmg560_*

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_governance_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  governance_enabled boolean not null default true,
  transparency_required boolean not null default true,
  human_approval_required boolean not null default true,
  policy_engine_enabled boolean not null default true,
  risk_detection_enabled boolean not null default true,
  audit_logging_enabled boolean not null default true,
  review_board_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_governance_settings enable row level security;
revoke all on public.organization_companion_governance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Capability registry, policies, permissions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_governance_capabilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capability_key text not null,
  capability_title text not null,
  capability_type text not null check (
    capability_type in ('skill', 'specialist', 'knowledge', 'integration', 'action', 'permission', 'business_pack')
  ),
  source_label text not null default '',
  visibility_status text not null default 'visible' check (
    visibility_status in ('visible', 'review_required', 'restricted', 'disabled')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, capability_key)
);

alter table public.organization_companion_governance_capabilities enable row level security;
revoke all on public.organization_companion_governance_capabilities from authenticated, anon;

create table if not exists public.organization_companion_governance_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  policy_scope text not null check (
    policy_scope in ('organization', 'department', 'companion', 'business_pack', 'regional', 'compliance')
  ),
  policy_rule text not null default '',
  is_enforced boolean not null default true,
  unique (organization_id, policy_key)
);

alter table public.organization_companion_governance_policies enable row level security;
revoke all on public.organization_companion_governance_policies from authenticated, anon;

create table if not exists public.organization_companion_governance_permission_boundaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  boundary_key text not null,
  boundary_title text not null,
  access_type text not null check (
    access_type in ('data', 'system', 'connector', 'business_pack', 'domain')
  ),
  is_approved boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, boundary_key)
);

alter table public.organization_companion_governance_permission_boundaries enable row level security;
revoke all on public.organization_companion_governance_permission_boundaries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Recommendations, actions, transparency, ethics, knowledge
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_governance_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null,
  reason_summary text not null default '' check (char_length(reason_summary) <= 500),
  confidence_level text not null default 'moderate' check (
    confidence_level in ('high', 'moderate', 'limited')
  ),
  confidence_score integer not null default 75 check (confidence_score between 0 and 100),
  sources_used jsonb not null default '[]'::jsonb,
  assumptions jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  alternative_options jsonb not null default '[]'::jsonb,
  recorded_at timestamptz not null default now(),
  unique (organization_id, recommendation_key)
);

alter table public.organization_companion_governance_recommendations enable row level security;
revoke all on public.organization_companion_governance_recommendations from authenticated, anon;

create table if not exists public.organization_companion_governance_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  action_type text not null default 'recommendation' check (
    action_type in ('recommended', 'executed', 'rejected', 'cancelled', 'escalated')
  ),
  sensitivity_level text not null default 'standard' check (
    sensitivity_level in ('information', 'draft', 'reversible', 'sensitive', 'critical')
  ),
  requires_human_approval boolean not null default true,
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'denied', 'escalated', 'not_required')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, action_key)
);

alter table public.organization_companion_governance_actions enable row level security;
revoke all on public.organization_companion_governance_actions from authenticated, anon;

create table if not exists public.organization_companion_governance_ethics_principles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  principle_key text not null,
  principle_title text not null,
  description text not null default '' check (char_length(description) <= 500),
  is_active boolean not null default true,
  unique (organization_id, principle_key)
);

alter table public.organization_companion_governance_ethics_principles enable row level security;
revoke all on public.organization_companion_governance_ethics_principles from authenticated, anon;

create table if not exists public.organization_companion_governance_knowledge_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  knowledge_key text not null,
  knowledge_title text not null,
  owner_label text not null default '',
  review_status text not null default 'approved' check (
    review_status in ('approved', 'review_required', 'expired', 'restricted')
  ),
  expires_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, knowledge_key)
);

alter table public.organization_companion_governance_knowledge_items enable row level security;
revoke all on public.organization_companion_governance_knowledge_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Oversight, risks, trust, review board, audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_governance_oversight_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alert_key text not null,
  alert_title text not null,
  alert_type text not null check (
    alert_type in ('governance', 'policy_violation', 'permission_conflict', 'trust', 'escalation')
  ),
  severity text not null default 'attention' check (
    severity in ('info', 'attention', 'risk', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, alert_key)
);

alter table public.organization_companion_governance_oversight_alerts enable row level security;
revoke all on public.organization_companion_governance_oversight_alerts from authenticated, anon;

create table if not exists public.organization_companion_governance_risk_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_type text not null check (
    risk_type in (
      'excessive_automation', 'risky_recommendation', 'permission_conflict',
      'data_access', 'policy_violation', 'escalation_required'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  requires_human_review boolean not null default true,
  recorded_at timestamptz not null default now(),
  unique (organization_id, risk_key)
);

alter table public.organization_companion_governance_risk_events enable row level security;
revoke all on public.organization_companion_governance_risk_events from authenticated, anon;

create table if not exists public.organization_companion_governance_trust_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  transparency_score integer not null default 86 check (transparency_score between 0 and 100),
  policy_compliance_score integer not null default 88 check (policy_compliance_score between 0 and 100),
  approval_compliance_score integer not null default 90 check (approval_compliance_score between 0 and 100),
  governance_review_score integer not null default 84 check (governance_review_score between 0 and 100),
  security_status_score integer not null default 87 check (security_status_score between 0 and 100),
  audit_coverage_score integer not null default 85 check (audit_coverage_score between 0 and 100),
  composite_score integer not null default 87 check (composite_score between 0 and 100),
  trust_label text not null default 'trusted' check (
    trust_label in ('trusted', 'healthy', 'needs_review', 'governance_risk')
  ),
  recorded_at timestamptz not null default now()
);

create index if not exists organization_companion_governance_trust_scores_org_idx
  on public.organization_companion_governance_trust_scores (organization_id, recorded_at desc);

alter table public.organization_companion_governance_trust_scores enable row level security;
revoke all on public.organization_companion_governance_trust_scores from authenticated, anon;

create table if not exists public.organization_companion_governance_review_board (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  review_cycle text not null check (review_cycle in ('monthly', 'quarterly', 'annual')),
  review_status text not null default 'scheduled' check (
    review_status in ('scheduled', 'in_progress', 'completed')
  ),
  next_review_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, review_key)
);

alter table public.organization_companion_governance_review_board enable row level security;
revoke all on public.organization_companion_governance_review_board from authenticated, anon;

create table if not exists public.organization_companion_governance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'governance' check (
    audit_category in (
      'recommendation', 'action', 'approval', 'escalation', 'knowledge',
      'memory', 'policy', 'trust', 'specialist'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_governance_audit_logs_org_idx
  on public.organization_companion_governance_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_governance_audit_logs enable row level security;
revoke all on public.organization_companion_governance_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cmg560_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmg560_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb,
  p_category text default 'governance'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_governance_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'governance'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmg560_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_governance_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmg560_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_companion_governance_capabilities
    where organization_id = p_org_id limit 1
  ) then
    return;
  end if;

  insert into public.organization_companion_governance_capabilities (
    organization_id, capability_key, capability_title, capability_type, source_label, summary
  ) values
    (p_org_id, 'cap_exec_brief', 'Executive Briefing Skill', 'skill', 'Phase 556 Skills', 'Installed executive briefing capability.'),
    (p_org_id, 'cap_support_triage', 'Support Triage Skill', 'skill', 'Phase 556 Skills', 'Support triage skill with governed knowledge.'),
    (p_org_id, 'cap_exec_specialist', 'Executive Companion', 'specialist', 'Phase 559 Orchestration', 'Executive specialist in orchestration registry.'),
    (p_org_id, 'cap_finance_specialist', 'Finance Companion', 'specialist', 'Phase 559 Orchestration', 'Finance specialist with policy boundaries.'),
    (p_org_id, 'cap_knowledge_center', 'Knowledge Center', 'knowledge', 'Approved Sources', 'Governed organizational knowledge sources.'),
    (p_org_id, 'cap_crm_connector', 'CRM Connector', 'integration', 'Integration Hub', 'Read-only approved CRM connector.'),
    (p_org_id, 'cap_draft_contract', 'Draft Contract Action', 'action', 'Trust Actions', 'Level 1 draft — human approval for signing.'),
    (p_org_id, 'cap_finance_pack', 'Finance Business Pack', 'business_pack', 'Licensed Module', 'Finance pack capabilities and terminology.');

  insert into public.organization_companion_governance_policies (
    organization_id, policy_key, policy_title, policy_scope, policy_rule
  ) values
    (p_org_id, 'pol_draft_contracts', 'Draft Contracts Only', 'companion', 'Companion may draft contracts. Companion may not sign contracts.'),
    (p_org_id, 'pol_recommend_purchases', 'Recommend Purchases', 'organization', 'Companion may recommend purchases. Companion may not approve purchases.'),
    (p_org_id, 'pol_sensitive_approval', 'Sensitive Action Approval', 'compliance', 'Payments, contracts, terminations, and legal decisions require human approval.'),
    (p_org_id, 'pol_regional_data', 'Regional Data Policy', 'regional', 'Data access limited to approved regional domains.'),
    (p_org_id, 'pol_dept_finance', 'Finance Department Policy', 'department', 'Finance actions require finance admin review.');

  insert into public.organization_companion_governance_permission_boundaries (
    organization_id, boundary_key, boundary_title, access_type, summary
  ) values
    (p_org_id, 'bound_approved_data', 'Approved Data Only', 'data', 'Companion accesses approved metadata — no hidden data sources.'),
    (p_org_id, 'bound_approved_systems', 'Approved Systems', 'system', 'Only connected and approved systems.'),
    (p_org_id, 'bound_connectors', 'Approved Connectors', 'connector', 'Connectors require explicit approval before write access.'),
    (p_org_id, 'bound_business_packs', 'Licensed Business Packs', 'business_pack', 'Only licensed and enabled Business Packs.'),
    (p_org_id, 'bound_domains', 'Verified Domains', 'domain', 'Installation domains verified and approved.');

  insert into public.organization_companion_governance_recommendations (
    organization_id, recommendation_key, recommendation_title, reason_summary,
    confidence_level, confidence_score, sources_used, assumptions, risks, alternative_options
  ) values
    (p_org_id, 'rec_revenue_risk', 'Revenue Risk Detected', 'Declining usage, payment delays, and low engagement patterns identified.',
     'high', 87,
     '["Revenue Reports","Customer Engagement Metadata","Payment Status"]'::jsonb,
     '["Seasonal variance not yet confirmed"]'::jsonb,
     '["Revenue decline if unaddressed"]'::jsonb,
     '["Increase outreach","Review pricing","Escalate to executive briefing"]'::jsonb);

  insert into public.organization_companion_governance_actions (
    organization_id, action_key, action_title, action_type, sensitivity_level,
    requires_human_approval, approval_status, summary
  ) values
    (p_org_id, 'act_vendor_rec', 'Vendor Selection Recommendation', 'recommended', 'sensitive', true, 'pending', 'Companion prepared vendor recommendation — awaiting approval.'),
    (p_org_id, 'act_contract_draft', 'Contract Draft Prepared', 'executed', 'draft', true, 'approved', 'Contract draft prepared — signing requires separate approval.'),
    (p_org_id, 'act_payment_blocked', 'Payment Action Blocked', 'rejected', 'critical', true, 'denied', 'Payment action blocked — human approval required.'),
    (p_org_id, 'act_workflow_esc', 'Workflow Escalated', 'escalated', 'sensitive', true, 'escalated', 'Workflow exceeded approval limits — escalated for review.');

  insert into public.organization_companion_governance_ethics_principles (
    organization_id, principle_key, principle_title, description
  ) values
    (p_org_id, 'eth_transparency', 'Transparency', 'Companion explains recommendations and actions.'),
    (p_org_id, 'eth_accountability', 'Accountability', 'Every action auditable and attributable.'),
    (p_org_id, 'eth_human_control', 'Human Control', 'Humans decide sensitive outcomes.'),
    (p_org_id, 'eth_explainability', 'Explainability', 'Reason, confidence, and sources always available.'),
    (p_org_id, 'eth_respect', 'Respect', 'Professional and respectful communication.'),
    (p_org_id, 'eth_fairness', 'Fairness', 'Recommendations free from bias and pressure.'),
    (p_org_id, 'eth_privacy', 'Privacy', 'Metadata only — no hidden collection.'),
    (p_org_id, 'eth_professionalism', 'Professionalism', 'Enterprise-grade behavior at all times.');

  insert into public.organization_companion_governance_knowledge_items (
    organization_id, knowledge_key, knowledge_title, owner_label, review_status, summary
  ) values
    (p_org_id, 'know_support_playbook', 'Support Playbook', 'Support Admin', 'approved', 'Approved support procedures for Companion.'),
    (p_org_id, 'know_finance_policy', 'Finance Policy', 'Finance Admin', 'review_required', 'Finance policy update pending governance review.');

  insert into public.organization_companion_governance_oversight_alerts (
    organization_id, alert_key, alert_title, alert_type, severity, summary
  ) values
    (p_org_id, 'alert_policy_review', 'Finance Policy Review', 'governance', 'attention', 'Knowledge review required after policy update.'),
    (p_org_id, 'alert_trust_stable', 'Trust Score Stable', 'trust', 'info', 'Companion trust score remains in healthy range.');

  insert into public.organization_companion_governance_risk_events (
    organization_id, risk_key, risk_title, risk_type, summary, requires_human_review
  ) values
    (p_org_id, 'risk_approval_limit', 'Workflow Approval Limit Exceeded', 'escalation_required',
     'Workflow exceeds approval limits — human review required.', true),
    (p_org_id, 'risk_permission_conflict', 'Permission Conflict Detected', 'permission_conflict',
     'Specialist requested access outside approved boundary.', true);

  insert into public.organization_companion_governance_review_board (
    organization_id, review_key, review_title, review_cycle, review_status, summary
  ) values
    (p_org_id, 'rev_monthly', 'Monthly Companion Review', 'monthly', 'scheduled', 'Review actions, recommendations, and policy compliance.'),
    (p_org_id, 'rev_quarterly', 'Quarterly Governance Review', 'quarterly', 'scheduled', 'Review capabilities, knowledge, and trust trends.'),
    (p_org_id, 'rev_annual', 'Annual Governance Review', 'annual', 'scheduled', 'Comprehensive governance and ethics review.');

  insert into public.organization_companion_governance_trust_scores (
    organization_id, transparency_score, policy_compliance_score, approval_compliance_score,
    governance_review_score, security_status_score, audit_coverage_score, composite_score, trust_label
  ) values (p_org_id, 86, 88, 90, 84, 87, 85, 87, 'trusted');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_governance_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_overview jsonb;
  v_capabilities jsonb;
  v_permissions jsonb;
  v_actions jsonb;
  v_oversight jsonb;
  v_approvals jsonb;
  v_policies jsonb;
  v_reports jsonb;
  v_executive jsonb;
  v_trust jsonb;
  v_audit jsonb;
  v_integrations jsonb;
begin
  v_org_id := public._cmg560_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  perform public._cmg560_ensure_settings(v_org_id);
  perform public._cmg560_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name)
  into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'capabilities', (select count(*) from public.organization_companion_governance_capabilities where organization_id = v_org_id),
    'policies', (select count(*) from public.organization_companion_governance_policies where organization_id = v_org_id and is_enforced),
    'pending_approvals', (select count(*) from public.organization_companion_governance_actions where organization_id = v_org_id and approval_status = 'pending'),
    'governance_alerts', (select count(*) from public.organization_companion_governance_oversight_alerts where organization_id = v_org_id),
    'risk_events', (select count(*) from public.organization_companion_governance_risk_events where organization_id = v_org_id),
    'trust_score', coalesce((
      select composite_score from public.organization_companion_governance_trust_scores
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 87),
    'audit_entries', (select count(*) from public.organization_companion_governance_audit_logs where organization_id = v_org_id)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'capability_key', c.capability_key, 'capability_title', c.capability_title,
    'capability_type', c.capability_type, 'source_label', c.source_label,
    'visibility_status', c.visibility_status, 'summary', c.summary
  ) order by c.capability_title), '[]'::jsonb)
  into v_capabilities
  from public.organization_companion_governance_capabilities c where c.organization_id = v_org_id;

  select jsonb_build_object(
    'permission_boundaries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'boundary_key', b.boundary_key, 'boundary_title', b.boundary_title,
        'access_type', b.access_type, 'is_approved', b.is_approved, 'summary', b.summary
      ) order by b.boundary_title)
      from public.organization_companion_governance_permission_boundaries b where b.organization_id = v_org_id
    ), '[]'::jsonb),
    'human_approval_required_actions', jsonb_build_array(
      'payments', 'contracts', 'employee_termination', 'major_purchases',
      'vendor_selection', 'legal_decisions', 'policy_changes'
    )
  ) into v_permissions;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action_key', a.action_key, 'action_title', a.action_title,
    'action_type', a.action_type, 'sensitivity_level', a.sensitivity_level,
    'requires_human_approval', a.requires_human_approval, 'approval_status', a.approval_status,
    'summary', a.summary, 'recorded_at', a.recorded_at
  ) order by a.recorded_at desc), '[]'::jsonb)
  into v_actions
  from public.organization_companion_governance_actions a where a.organization_id = v_org_id;

  select jsonb_build_object(
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'recommendation_key', r.recommendation_key, 'recommendation_title', r.recommendation_title,
        'reason_summary', r.reason_summary, 'confidence_level', r.confidence_level,
        'confidence_score', r.confidence_score, 'sources_used', r.sources_used,
        'assumptions', r.assumptions, 'risks', r.risks, 'alternative_options', r.alternative_options
      ) order by r.recorded_at desc)
      from public.organization_companion_governance_recommendations r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'transparency_engine', jsonb_build_object(
      'always_explain', true,
      'prompts', jsonb_build_array(
        'Why did you recommend this?', 'Why did you prioritize this task?',
        'Why did you flag this customer?', 'Why did you suggest this workflow?'
      )
    ),
    'confidence_framework', jsonb_build_object(
      'high', 'High Confidence', 'moderate', 'Moderate Confidence', 'limited', 'Limited Confidence'
    ),
    'alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'alert_key', al.alert_key, 'alert_title', al.alert_title,
        'alert_type', al.alert_type, 'severity', al.severity, 'summary', al.summary
      ) order by al.recorded_at desc)
      from public.organization_companion_governance_oversight_alerts al where al.organization_id = v_org_id
    ), '[]'::jsonb),
    'risk_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'risk_key', rk.risk_key, 'risk_title', rk.risk_title,
        'risk_type', rk.risk_type, 'summary', rk.summary, 'requires_human_review', rk.requires_human_review
      ) order by rk.recorded_at desc)
      from public.organization_companion_governance_risk_events rk where rk.organization_id = v_org_id
    ), '[]'::jsonb),
    'ethics_framework', coalesce((
      select jsonb_agg(jsonb_build_object(
        'principle_key', e.principle_key, 'principle_title', e.principle_title, 'description', e.description
      ) order by e.principle_title)
      from public.organization_companion_governance_ethics_principles e where e.organization_id = v_org_id and e.is_active
    ), '[]'::jsonb),
    'active_specialists', (select count(*) from public.organization_companion_orchestration_specialists where organization_id = v_org_id and specialist_status = 'active')
  ) into v_oversight;

  select jsonb_build_object(
    'pending', coalesce((
      select jsonb_agg(jsonb_build_object('action_key', a.action_key, 'action_title', a.action_title, 'summary', a.summary))
      from public.organization_companion_governance_actions a
      where a.organization_id = v_org_id and a.approval_status = 'pending'
    ), '[]'::jsonb),
    'approval_center_route', '/app/approvals'
  ) into v_approvals;

  select coalesce(jsonb_agg(jsonb_build_object(
    'policy_key', p.policy_key, 'policy_title', p.policy_title,
    'policy_scope', p.policy_scope, 'policy_rule', p.policy_rule, 'is_enforced', p.is_enforced
  ) order by p.policy_scope), '[]'::jsonb)
  into v_policies
  from public.organization_companion_governance_policies p where p.organization_id = v_org_id;

  select jsonb_build_object(
    'companion_usage', jsonb_build_object(
      'capabilities', (select count(*) from public.organization_companion_governance_capabilities where organization_id = v_org_id),
      'specialists', (select count(*) from public.organization_companion_orchestration_specialists where organization_id = v_org_id)
    ),
    'approval_statistics', jsonb_build_object(
      'pending', (select count(*) from public.organization_companion_governance_actions where organization_id = v_org_id and approval_status = 'pending'),
      'approved', (select count(*) from public.organization_companion_governance_actions where organization_id = v_org_id and approval_status = 'approved'),
      'denied', (select count(*) from public.organization_companion_governance_actions where organization_id = v_org_id and approval_status = 'denied')
    ),
    'governance_compliance', coalesce((
      select policy_compliance_score from public.organization_companion_governance_trust_scores
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 88),
    'trust_trends', coalesce((
      select trust_label from public.organization_companion_governance_trust_scores
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 'trusted'),
    'policy_violations', (select count(*) from public.organization_companion_governance_risk_events where organization_id = v_org_id and risk_type = 'policy_violation'),
    'recommendation_quality', coalesce((
      select round(avg(confidence_score)) from public.organization_companion_governance_recommendations where organization_id = v_org_id
    ), 85),
    'specialist_activity', (select count(*) from public.organization_companion_orchestration_specialists where organization_id = v_org_id),
    'review_board', coalesce((
      select jsonb_agg(jsonb_build_object(
        'review_key', rb.review_key, 'review_title', rb.review_title,
        'review_cycle', rb.review_cycle, 'review_status', rb.review_status, 'summary', rb.summary
      ) order by rb.review_title)
      from public.organization_companion_governance_review_board rb where rb.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_reports;

  select coalesce((
    select jsonb_build_object(
      'companion_trust_score', ts.composite_score,
      'governance_health', ts.governance_review_score,
      'approval_activity', (select count(*) from public.organization_companion_governance_actions where organization_id = v_org_id),
      'policy_violations', (select count(*) from public.organization_companion_governance_risk_events where organization_id = v_org_id),
      'risk_events', (select count(*) from public.organization_companion_governance_risk_events where organization_id = v_org_id),
      'specialist_activity', (select count(*) from public.organization_companion_orchestration_specialists where organization_id = v_org_id),
      'audit_status', ts.audit_coverage_score,
      'trust_label', ts.trust_label
    )
    from public.organization_companion_governance_trust_scores ts
    where ts.organization_id = v_org_id order by ts.recorded_at desc limit 1
  ), '{}'::jsonb) into v_executive;

  select coalesce((
    select jsonb_build_object(
      'transparency_score', ts.transparency_score,
      'policy_compliance_score', ts.policy_compliance_score,
      'approval_compliance_score', ts.approval_compliance_score,
      'governance_review_score', ts.governance_review_score,
      'security_status_score', ts.security_status_score,
      'audit_coverage_score', ts.audit_coverage_score,
      'composite_score', ts.composite_score,
      'trust_label', ts.trust_label
    )
    from public.organization_companion_governance_trust_scores ts
    where ts.organization_id = v_org_id order by ts.recorded_at desc limit 1
  ), '{}'::jsonb) into v_trust;

  select jsonb_build_object(
    'skills_integration', jsonb_build_object('phase', '556', 'route', '/app/companion/skills'),
    'memory_governance', jsonb_build_object(
      'phase', '558', 'route', '/app/companion/memory',
      'controls', jsonb_build_array('memory_review', 'memory_deletion', 'memory_export', 'memory_restrictions', 'memory_audits'),
      'memory_items', (select count(*) from public.organization_companion_memory_evolution_items where organization_id = v_org_id)
    ),
    'specialist_governance', jsonb_build_object(
      'phase', '559', 'route', '/app/companion/orchestration',
      'specialists', (select count(*) from public.organization_companion_orchestration_specialists where organization_id = v_org_id)
    ),
    'knowledge_governance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'knowledge_key', k.knowledge_key, 'knowledge_title', k.knowledge_title,
        'owner_label', k.owner_label, 'review_status', k.review_status, 'summary', k.summary
      ) order by k.knowledge_title)
      from public.organization_companion_governance_knowledge_items k where k.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_integrations;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'audit_category', a.audit_category,
    'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select event_type, audit_category, summary, created_at
    from public.organization_companion_governance_audit_logs
    where organization_id = v_org_id
    order by created_at desc
    limit 40
  ) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'The more capable Companion becomes, the more important governance becomes. Companion must never become a black box.',
    'philosophy', 'Capability without governance creates risk. Intelligence without transparency creates distrust. Automation without oversight creates problems.',
    'section', p_section,
    'organization', v_org,
    'overview', v_overview,
    'capabilities', v_capabilities,
    'permissions', v_permissions,
    'actions', v_actions,
    'oversight', v_oversight,
    'approvals', v_approvals,
    'policies', v_policies,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'trust_score', v_trust,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'review_governance', true, 'review_permissions', true, 'review_actions', true,
      'review_specialists', true, 'review_trust_score', true,
      'route', '/app/companion/governance'
    ),
    'notifications', jsonb_build_object(
      'types', jsonb_build_array(
        'policy_violation', 'governance_alert', 'trust_score_change',
        'approval_escalation', 'specialist_review_required', 'knowledge_review_required'
      )
    ),
    'routes', jsonb_build_object(
      'governance_center', '/app/companion/governance',
      'action_review', '/app/companion/governance/actions',
      'audit_center', '/app/companion/governance/audit',
      'approvals', '/app/approvals',
      'companion_skills', '/app/companion/skills',
      'companion_memory', '/app/companion/memory',
      'companion_orchestration', '/app/companion/orchestration'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_companion_governance_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_action_key text := coalesce(p_payload->>'action_key', '');
begin
  v_org_id := public._cmg560_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'approve_action' and v_action_key <> '' then
    update public.organization_companion_governance_actions
    set approval_status = 'approved', action_type = 'executed'
    where organization_id = v_org_id and action_key = v_action_key;
    perform public._cmg560_log(v_org_id, 'approval_granted', 'Governance action approved.', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'deny_action' and v_action_key <> '' then
    update public.organization_companion_governance_actions
    set approval_status = 'denied', action_type = 'rejected'
    where organization_id = v_org_id and action_key = v_action_key;
    perform public._cmg560_log(v_org_id, 'approval_denied', 'Governance action denied.', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'refresh_trust_score' then
    insert into public.organization_companion_governance_trust_scores (
      organization_id, transparency_score, policy_compliance_score, approval_compliance_score,
      governance_review_score, security_status_score, audit_coverage_score, composite_score, trust_label
    )
    select v_org_id,
      least(100, coalesce((select transparency_score from public.organization_companion_governance_trust_scores where organization_id = v_org_id order by recorded_at desc limit 1), 86) + 1),
      least(100, coalesce((select policy_compliance_score from public.organization_companion_governance_trust_scores where organization_id = v_org_id order by recorded_at desc limit 1), 88)),
      least(100, coalesce((select approval_compliance_score from public.organization_companion_governance_trust_scores where organization_id = v_org_id order by recorded_at desc limit 1), 90)),
      least(100, coalesce((select governance_review_score from public.organization_companion_governance_trust_scores where organization_id = v_org_id order by recorded_at desc limit 1), 84) + 1),
      least(100, coalesce((select security_status_score from public.organization_companion_governance_trust_scores where organization_id = v_org_id order by recorded_at desc limit 1), 87)),
      least(100, coalesce((select audit_coverage_score from public.organization_companion_governance_trust_scores where organization_id = v_org_id order by recorded_at desc limit 1), 85) + 1),
      least(100, coalesce((select composite_score from public.organization_companion_governance_trust_scores where organization_id = v_org_id order by recorded_at desc limit 1), 87) + 1),
      'trusted';
    perform public._cmg560_log(v_org_id, 'trust_score_updated', 'Companion trust score refreshed.', p_payload, 'trust');
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'complete_governance_review' then
    perform public._cmg560_log(v_org_id, 'governance_review_completed', 'Governance review completed.', p_payload, 'governance');
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'update_policy' then
    perform public._cmg560_log(v_org_id, 'policy_updated', 'Governance policy updated.', p_payload, 'policy');
    return jsonb_build_object('ok', true, 'action', v_action);

  else
    raise exception 'Unknown action: %', v_action;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Mobile & advisor RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_governance_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_governance_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'trust_score', v_center#>>'{overview,trust_score}',
    'capabilities', jsonb_build_array(
      'review_governance', 'review_permissions', 'review_actions',
      'review_specialists', 'review_trust_score'
    ),
    'route', '/app/companion/governance'
  );
end; $$;

create or replace function public.get_assistant_companion_governance_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_governance_center('companion');
  return jsonb_build_object(
    'found', v_center->'found',
    'principle', v_center->'principle',
    'trust_score', v_center->'trust_score',
    'transparency', v_center#>'{oversight,transparency_engine}',
    'route', '/app/companion/governance'
  );
end; $$;

grant execute on function public.get_organization_companion_governance_center(text) to authenticated;
grant execute on function public.perform_organization_companion_governance_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_governance_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_governance_advisor_context() to authenticated;
