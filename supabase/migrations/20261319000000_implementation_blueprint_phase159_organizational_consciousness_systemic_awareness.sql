-- Implementation Blueprint Phase 159 — Organizational Consciousness & Systemic Awareness Engine
-- Legacy & Future Stewardship Era (151–160). Extends Digital Twin Phase 77 + Blueprint Phases 77 & 124.
-- Helpers: _ocsabp159_* (never collide with _odtbp124_*, _odtbp_*, _dtw_*).
-- Cross-links Sensemaking 158, Wisdom Council 157, Org Health A.56, Ecosystem 88, RSI A.78, Decision Heritage 153,
-- Resilience 154, Legacy era 151–156, Simulation Lab, Self Love A.76 — do NOT duplicate RPCs.

-- ---------------------------------------------------------------------------
-- 1. Optional tables (metadata scaffolds — responsibility/process level NOT individual tracking)
-- ---------------------------------------------------------------------------
create table if not exists public.systemic_awareness_dependency_maps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies (id) on delete cascade,
  map_key text not null,
  map_title text not null,
  map_scope text not null default 'cross_functional' check (
    map_scope in (
      'departments', 'processes', 'companions', 'gp_networks',
      'knowledge_networks', 'governance', 'cross_functional'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'archived')
  ),
  summary_metadata jsonb not null default '{"metadata_only":true,"not_people_surveillance":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, map_key)
);

create index if not exists systemic_awareness_dependency_maps_tenant_idx
  on public.systemic_awareness_dependency_maps (tenant_id, map_scope, status, created_at desc);

alter table public.systemic_awareness_dependency_maps enable row level security;
revoke all on public.systemic_awareness_dependency_maps from authenticated, anon;

create table if not exists public.systemic_awareness_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'executive_systemic', 'interdependency', 'consequence_exploration',
      'collaboration_opportunity', 'vulnerability_theme', 'reflection_program'
    )
  ),
  review_title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  reflection_summary text check (reflection_summary is null or char_length(reflection_summary) <= 500),
  summary_metadata jsonb not null default '{"metadata_only":true,"not_priority_determination":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists systemic_awareness_reviews_tenant_idx
  on public.systemic_awareness_reviews (tenant_id, review_type, status, created_at desc);

alter table public.systemic_awareness_reviews enable row level security;
revoke all on public.systemic_awareness_reviews from authenticated, anon;

create table if not exists public.systemic_awareness_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'systemic_review', 'leadership_reflection', 'dependency_map',
      'transformation_insight', 'knowledge_contribution', 'organizational_narrative'
    )
  ),
  memory_title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'archived')
  ),
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists systemic_awareness_memory_tenant_idx
  on public.systemic_awareness_memory (tenant_id, memory_type, status);

alter table public.systemic_awareness_memory enable row level security;
revoke all on public.systemic_awareness_memory from authenticated, anon;

create table if not exists public.systemic_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies (id) on delete cascade,
  snapshot_key text not null,
  snapshot_title text not null,
  dimension text not null check (
    dimension in (
      'trust_themes', 'collaboration_themes', 'psychological_safety_themes',
      'learning_participation', 'knowledge_sharing', 'leadership_accessibility_themes',
      'companion_adoption'
    )
  ),
  aggregate_level text not null default 'organizational' check (
    aggregate_level in ('organizational', 'department', 'process')
  ),
  summary_metadata jsonb not null default '{"metadata_only":true,"not_individual_scores":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);

create index if not exists systemic_health_snapshots_tenant_idx
  on public.systemic_health_snapshots (tenant_id, dimension, created_at desc);

alter table public.systemic_health_snapshots enable row level security;
revoke all on public.systemic_health_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helper
-- ---------------------------------------------------------------------------
create or replace function public._ocsabp159_seed(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.systemic_awareness_dependency_maps where tenant_id = p_tenant_id limit 1
  ) then
    return;
  end if;

  insert into public.systemic_awareness_dependency_maps (
    tenant_id, map_key, map_title, map_scope, status, summary_metadata
  ) values
    (p_tenant_id, 'cross_functional_core', 'Cross-functional dependency overview', 'cross_functional', 'review',
     '{"cross_link":"phase124_map","not_people_surveillance":true}'::jsonb),
    (p_tenant_id, 'companion_coverage_map', 'Companion assignment interdependencies', 'companions', 'draft',
     '{"cross_link":"companion_workforce_132"}'::jsonb);

  insert into public.systemic_awareness_reviews (
    tenant_id, review_key, review_type, review_title, status,
    reflection_summary, summary_metadata
  ) values
    (p_tenant_id, 'quarterly_systemic_review', 'executive_systemic', 'Quarterly executive systemic review', 'review',
     'Prepared interdependency context for leadership reflection — complexity acknowledged, not oversimplified.',
     '{"metadata_only":true,"executive_approval_required":true}'::jsonb);

  insert into public.systemic_awareness_memory (
    tenant_id, memory_key, memory_type, memory_title, status, summary_metadata
  ) values
    (p_tenant_id, 'transformation_systemic_insight', 'transformation_insight', 'Transformation systemic insight — interconnected consequences', 'review',
     '{"cross_link":"renewal_155","theme":"interconnected_consequences"}'::jsonb),
    (p_tenant_id, 'dependency_map_reflection', 'dependency_map', 'Dependency map reflection — role-level metadata', 'draft',
     '{"cross_link":"digital_twin_124","not_individual_tracking":true}'::jsonb);

  insert into public.systemic_health_snapshots (
    tenant_id, snapshot_key, snapshot_title, dimension, aggregate_level, summary_metadata
  ) values
    (p_tenant_id, 'trust_collaboration_q1', 'Trust and collaboration themes — organizational aggregate', 'trust_themes', 'organizational',
     '{"cross_link":"org_health_a56","not_individual_scores":true}'::jsonb),
    (p_tenant_id, 'learning_participation_themes', 'Learning participation themes — aggregate only', 'learning_participation', 'organizational',
     '{"cross_link":"knowledge_exchange_141"}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers
-- ---------------------------------------------------------------------------
create or replace function public._ocsabp159_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 159 — Organizational Consciousness & Systemic Awareness Engine at /app/digital-twin. Legacy & Future Stewardship Era (151–160). Layers on Digital Twin Phase 77 (20260616800000_digital_twin_organizational_model_phase77.sql), Blueprint Phase 77 (_odtbp_* — 20261028000000_implementation_blueprint_phase77_organizational_digital_twin.sql), and Enterprise Phase 124 (_odtbp124_* — 20261214000000_implementation_blueprint_phase124_organizational_digital_twin.sql). Phase 159 deepens living systems awareness and systemic consciousness — NOT complexity theater, NOT predictive certainty, NOT employee surveillance. Distinct from Organizational Sensemaking Phase 158 at /app/organizational-sensemaking-engine (meaning-making cross-link). Distinct from Wisdom Council Phase 157 at /app/organizational-wisdom-engine. Distinct from Organizational Health A.56 + Phase 61 at /app/organizational-health-engine (cross-link aggregate themes — do NOT duplicate _ohe_* RPCs). Helpers _ocsabp159_* only — never _odtbp124_*, _odtbp_*, or _dtw_*. Twin models responsibilities NOT people.';
$$;

create or replace function public._ocsabp159_mission()
returns text language sql immutable as $$
  select 'Help organizations develop living systems awareness — understanding how decisions, processes, and relationships influence the whole system without prediction, surveillance, or replacing leadership judgment.';
$$;

create or replace function public._ocsabp159_philosophy()
returns text language sql immutable as $$
  select 'Living systems awareness — not complexity theater or predictive certainty. Every decision influences a larger system. Growth Partner not Affiliate. People First. Stewardship through responsibility. Wisdom before speed.';
$$;

create or replace function public._ocsabp159_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Systemic Awareness extends the Organizational Digital Twin with consciousness of interdependencies and consequences. Systemic Companion supports awareness — does NOT claim complete understanding, replace leadership, suppress uncertainty, override governance, or determine priorities.';
$$;

create or replace function public._ocsabp159_vision()
returns text language sql immutable as $$
  select 'Organizations see themselves as interconnected living systems — leaders prepared with humility, curiosity, and systemic reflection while humans retain accountability for every priority and decision.';
$$;

create or replace function public._ocsabp159_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'living_systems_awareness', 'label', 'Living systems awareness', 'description', 'Understand organizations as interconnected systems — metadata at role and process level'),
    jsonb_build_object('key', 'interdependency_visibility', 'label', 'Interdependency visibility', 'description', 'Cross-functional dependency maps — cross-link Phase 124 organizational map'),
    jsonb_build_object('key', 'consequence_reflection', 'label', 'Consequence reflection', 'description', 'Secondary effects, ripple effects, and assumption examination — not prediction'),
    jsonb_build_object('key', 'executive_systemic_review', 'label', 'Executive systemic review', 'description', 'Leadership sessions that honor complexity without oversimplification'),
    jsonb_build_object('key', 'systemic_learning', 'label', 'Systemic learning', 'description', 'Cross-functional reflection — cross-link Decision Heritage 153, Wisdom 157, Renewal 155'),
    jsonb_build_object('key', 'organizational_health_themes', 'label', 'Organizational health themes', 'description', 'Aggregate trust and collaboration themes — cross-link Org Health A.56, NOT individual scores'),
    jsonb_build_object('key', 'awareness_memory', 'label', 'Awareness memory', 'description', 'Systemic reviews, dependency maps, and transformation insights — metadata only'),
    jsonb_build_object('key', 'companion_systemic_support', 'label', 'Companion systemic support', 'description', 'Systemic Companion prepares reflection — does NOT eliminate uncertainty')
  );
$$;

create or replace function public._ocsabp159_systemic_awareness_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'relationship_mapping', 'label', 'Relationship mapping', 'description', 'Cross-link Digital Twin Phase 124 map — responsibilities not people'),
    jsonb_build_object('key', 'dependency_visualization', 'label', 'Cross-functional dependency visualization', 'description', 'Interdependency metadata across departments, processes, companions'),
    jsonb_build_object('key', 'strategic_interconnection_reviews', 'label', 'Strategic interconnection reviews', 'description', 'Executive reviews of how initiatives connect — humans decide priorities'),
    jsonb_build_object('key', 'companion_insight_summaries', 'label', 'Companion insight summaries', 'description', 'Systemic Companion summaries — awareness not directives'),
    jsonb_build_object('key', 'executive_awareness_sessions', 'label', 'Executive awareness sessions', 'description', 'Prepared systemic reflection for leadership — not surveillance dashboards'),
    jsonb_build_object('key', 'future_systems_exploration', 'label', 'Future systems exploration', 'description', 'Cross-link Simulation Lab /app/simulations — reflection not certainty'),
    jsonb_build_object('key', 'systemic_reflection_programs', 'label', 'Systemic reflection programs', 'description', 'Organizational reflection scaffolds — cross-link Sensemaking 158'),
    jsonb_build_object('key', 'awareness_dashboards', 'label', 'Awareness dashboards', 'description', 'Aggregate systemic awareness visibility — metadata only')
  );
$$;

create or replace function public._ocsabp159_interdependency_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'role_relationships', 'label', 'Role-level relationships', 'description', 'Responsibility relationships metadata — NOT individual tracking'),
    jsonb_build_object('key', 'departments', 'label', 'Departments', 'description', 'Organization unit interdependencies — structure mapping'),
    jsonb_build_object('key', 'companions', 'label', 'Companions', 'description', 'Companion assignment and coverage interdependencies — cross-link Phase 132'),
    jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Customer touchpoint dependencies — metadata only'),
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'GP network relationships — cross-link GP Operations 114'),
    jsonb_build_object('key', 'knowledge_networks', 'label', 'Knowledge networks', 'description', 'Knowledge flow and SME routing — cross-link KC A.5 and Exchange 141'),
    jsonb_build_object('key', 'operational_processes', 'label', 'Operational processes', 'description', 'Process step and escalation interdependencies — cross-link Phase 124 map'),
    jsonb_build_object('key', 'governance_structures', 'label', 'Governance structures', 'description', 'Policy and approval chain dependencies — cross-link Governance A.14')
  );
$$;

create or replace function public._ocsabp159_systemic_consequence_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'secondary_effects', 'label', 'Secondary effects', 'description', 'Explore downstream consequences of decisions — reflection not prediction'),
    jsonb_build_object('key', 'unintended_consequences', 'label', 'Unintended consequences', 'description', 'Surface patterns worth examining — never punitive interpretation'),
    jsonb_build_object('key', 'assumptions_examination', 'label', 'Assumptions examination', 'description', 'Challenge assumptions with curiosity — cross-link Sensemaking 158'),
    jsonb_build_object('key', 'ripple_effects', 'label', 'Ripple effects', 'description', 'How changes propagate across functions — interconnected consequences'),
    jsonb_build_object('key', 'dependencies_attention', 'label', 'Dependencies requiring attention', 'description', 'Dependency signals for human review — cross-link Phase 124 dependency intelligence')
  );
$$;

create or replace function public._ocsabp159_executive_systemic_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive systemic reviews prepare leaders for thoughtful systemic reflection — humans decide; Aipify informs and prepares.',
    'review_themes', jsonb_build_array(
      jsonb_build_object('key', 'oversimplifying_complexity', 'label', 'Oversimplifying complexity', 'description', 'Guard against reducing living systems to linear narratives'),
      jsonb_build_object('key', 'repeating_patterns', 'label', 'Repeating patterns', 'description', 'Organizational patterns worth exploring — aggregate themes only'),
      jsonb_build_object('key', 'relationships_to_strengthen', 'label', 'Relationships to strengthen', 'description', 'Cross-functional collaboration opportunities — role level not individuals'),
      jsonb_build_object('key', 'emerging_vulnerabilities', 'label', 'Emerging vulnerability themes', 'description', 'System vulnerability themes — cross-link Resilience 154'),
      jsonb_build_object('key', 'collaboration_opportunities', 'label', 'Collaboration opportunities', 'description', 'Interconnection points for strengthened collaboration — metadata only')
    ),
    'boundary_note', 'Executive reviews support awareness — never determine priorities or override governance.'
  );
$$;

create or replace function public._ocsabp159_systemic_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'relationship_summaries', 'label', 'Relationship summaries', 'description', 'Summarize interdependency patterns for leadership review — understanding not outcomes'),
    jsonb_build_object('key', 'interdependency_insights', 'label', 'Interdependency insights', 'description', 'Highlight connection patterns — cross-link Phase 124 dependency intelligence'),
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Questions worth exploring — strengthens awareness, not directives'),
    jsonb_build_object('key', 'knowledge_connections', 'label', 'Knowledge connections', 'description', 'Connect systemic themes to KC and institutional wisdom — cross-link 157'),
    jsonb_build_object('key', 'future_consideration_frameworks', 'label', 'Future consideration frameworks', 'description', 'Prepare future systems exploration — cross-link /app/simulations'),
    jsonb_build_object('key', 'executive_preparation', 'label', 'Executive preparation', 'description', 'Prepare systemic review context — does NOT eliminate uncertainty')
  );
$$;

create or replace function public._ocsabp159_organizational_health_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational health themes at aggregate level — cross-link Organizational Health A.56 + Phase 61. Do NOT duplicate _ohe_* RPCs.',
    'org_health_route', '/app/organizational-health-engine',
    'themes', jsonb_build_array(
      jsonb_build_object('key', 'trust_themes', 'label', 'Trust themes', 'description', 'Organizational trust patterns — aggregate only, NOT individual scores'),
      jsonb_build_object('key', 'collaboration_themes', 'label', 'Collaboration themes', 'description', 'Cross-functional collaboration health — system lens'),
      jsonb_build_object('key', 'psychological_safety_themes', 'label', 'Psychological safety themes', 'description', 'Aggregate safety themes — never punitive surveillance'),
      jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation', 'description', 'Organizational learning engagement — cross-link Exchange 141'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'description', 'Knowledge flow patterns — metadata only'),
      jsonb_build_object('key', 'leadership_accessibility_themes', 'label', 'Leadership accessibility themes', 'description', 'Escalation and accessibility patterns — roles not individuals'),
      jsonb_build_object('key', 'companion_adoption', 'label', 'Companion adoption', 'description', 'Companion coverage themes — cross-link Companion Workforce 132')
    ),
    'boundary_note', 'Systemic health snapshots store aggregate organizational themes — never individual employee scores or surveillance.'
  );
$$;

create or replace function public._ocsabp159_systemic_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'cross_functional_reflection', 'label', 'Cross-functional reflection', 'description', 'Systemic learning across functions — metadata only'),
    jsonb_build_object('key', 'transformation_reviews', 'label', 'Transformation reviews', 'description', 'Cross-link Organizational Renewal Phase 155 — do not duplicate RPCs'),
    jsonb_build_object('key', 'decision_heritage', 'label', 'Decision heritage', 'description', 'Cross-link Decision Heritage Phase 153 at /app/decision-intelligence-engine'),
    jsonb_build_object('key', 'gp_contributions', 'label', 'Growth Partner contributions', 'description', 'Ecosystem learning themes — cross-link GP Operations 114'),
    jsonb_build_object('key', 'institutional_wisdom', 'label', 'Institutional wisdom', 'description', 'Cross-link Wisdom Council Phase 157 at /app/organizational-wisdom-engine'),
    jsonb_build_object('key', 'community_learning', 'label', 'Community learning', 'description', 'Cross-link Community Phase 89 — collective learning themes')
  );
$$;

create or replace function public._ocsabp159_awareness_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Awareness memory captures systemic organizational evolution — metadata only, no PII or individual tracking.',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'systemic_reviews', 'label', 'Systemic reviews'),
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections'),
      jsonb_build_object('key', 'dependency_maps', 'label', 'Dependency maps'),
      jsonb_build_object('key', 'transformation_insights', 'label', 'Transformation insights'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions'),
      jsonb_build_object('key', 'organizational_narratives', 'label', 'Organizational narratives')
    ),
    'boundary_note', 'Awareness memory is metadata scaffolding — cross-link Org Memory A.34 and Sensemaking 158; do not duplicate institutional memory RPCs.'
  );
$$;

create or replace function public._ocsabp159_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_complete_understanding', 'label', 'No claim of complete understanding', 'description', 'Living systems remain partially unknowable — uncertainty always disclosed'),
    jsonb_build_object('key', 'no_replace_leadership', 'label', 'No replace leadership', 'description', 'Systemic Companion informs — humans decide priorities and outcomes'),
    jsonb_build_object('key', 'no_suppress_uncertainty', 'label', 'No suppress uncertainty', 'description', 'Confidence levels and limitations always visible — not predictive certainty'),
    jsonb_build_object('key', 'no_override_governance', 'label', 'No override governance', 'description', 'Governance and approval paths remain human-controlled'),
    jsonb_build_object('key', 'no_determine_priorities', 'label', 'No determine priorities', 'description', 'Awareness supports reflection — never sets organizational priorities')
  );
$$;

create or replace function public._ocsabp159_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in systemic awareness — curiosity, patience, humility, and compassion when exploring organizational complexity.',
    'considerations', jsonb_build_array(
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Explore interdependencies with genuine curiosity — not judgment'),
      jsonb_build_object('key', 'patience', 'label', 'Patience', 'description', 'Living systems understanding requires time — wisdom before speed'),
      jsonb_build_object('key', 'humility', 'label', 'Humility', 'description', 'Acknowledge partial understanding — no claim of complete systemic knowledge'),
      jsonb_build_object('key', 'empathy', 'label', 'Empathy', 'description', 'Systemic reflection honors human capacity and sustainable pacing'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Thoughtful pauses strengthen systemic awareness — not urgency theater'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion', 'description', 'Complexity exploration with compassion — People First')
    ),
    'journey_phrase', 'Understanding a living system begins with humility — not certainty.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Systemic Awareness stores organizational metadata, not wellbeing content.'
  );
$$;

create or replace function public._ocsabp159_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Systemic awareness requires executive review audit logs, RBAC, organizational visibility controls, knowledge preservation protections, and 2FA.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'executive_review_audit', 'label', 'Executive review audit logs', 'description', 'Systemic reviews and dependency maps audited — metadata only'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control', 'description', 'Tenant-scoped visibility — owners/admins for systemic review management'),
      jsonb_build_object('key', 'visibility_controls', 'label', 'Organizational visibility controls', 'description', 'Aggregate themes visible to authorized roles — no cross-tenant exposure'),
      jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation protections', 'description', 'Awareness memory protected — cross-link Trust Architecture'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', 'Cross-link /app/settings/two-factor for executive systemic review actions')
    ),
    'audit_note', 'Systemic awareness routing and review access logged via digital_twin_audit_log and TACC integration.'
  );
$$;

create or replace function public._ocsabp159_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'digital_twin_phase77', 'label', 'Digital Twin Phase 77', 'route', '/app/digital-twin', 'note', 'Primary engine — Phase 159 extends Phase 77 + 124 + 159'),
    jsonb_build_object('key', 'digital_twin_phase124', 'label', 'Digital Twin Phase 124', 'route', '/app/digital-twin', 'note', 'Enterprise dependency map — cross-link interdependency engine'),
    jsonb_build_object('key', 'sensemaking_158', 'label', 'Organizational Sensemaking Phase 158', 'route', '/app/organizational-sensemaking-engine', 'note', 'Meaning-making cross-link — do not duplicate RPCs'),
    jsonb_build_object('key', 'wisdom_council_157', 'label', 'Wisdom Council Phase 157', 'route', '/app/organizational-wisdom-engine', 'note', 'Institutional wisdom cross-link'),
    jsonb_build_object('key', 'org_health_a56', 'label', 'Organizational Health A.56 + Phase 61', 'route', '/app/organizational-health-engine', 'note', 'Aggregate health themes — do NOT duplicate _ohe_* RPCs'),
    jsonb_build_object('key', 'ecosystem_88', 'label', 'Ecosystem Intelligence Phase 88', 'route', '/app/ecosystem', 'note', 'External relationship context — cross-link only'),
    jsonb_build_object('key', 'relationship_intelligence_a78', 'label', 'Relationship Intelligence A.78', 'route', '/app/relationship-intelligence-engine', 'note', 'Role-level relationship metadata cross-link'),
    jsonb_build_object('key', 'decision_heritage_153', 'label', 'Decision Heritage Phase 153', 'route', '/app/decision-intelligence-engine', 'note', 'Decision heritage cross-link — do not duplicate RPCs'),
    jsonb_build_object('key', 'resilience_154', 'label', 'Resilience Phase 154', 'route', '/app/organizational-resilience-engine', 'note', 'Vulnerability themes cross-link'),
    jsonb_build_object('key', 'future_leaders_151', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'note', 'Legacy era opener cross-link'),
    jsonb_build_object('key', 'org_legacy_152', 'label', 'Org Legacy Phase 152', 'route', '/app/organizational-memory-engine', 'note', 'Institutional legacy cross-link'),
    jsonb_build_object('key', 'renewal_155', 'label', 'Organizational Renewal Phase 155', 'route', '/app/change-management-engine', 'note', 'Transformation systemic insight cross-link'),
    jsonb_build_object('key', 'simulation_lab', 'label', 'Simulation Lab', 'route', '/app/simulations', 'note', 'Future systems exploration — reflection not certainty'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Curiosity, patience, humility — principle only')
  );
$$;

create or replace function public._ocsabp159_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates systemic awareness patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object('label', 'Aipify Group', 'note', 'Internal systemic review scaffolds on Digital Twin metadata'),
    'unonight_pilot', jsonb_build_object('label', 'Unonight pilot', 'note', 'Pilot validates interdependency maps and executive systemic reviews — metadata only'),
    'boundary_note', 'Dogfooding uses aggregate organizational metadata — no employee surveillance.'
  );
$$;

create or replace function public._ocsabp159_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'systemic_visibility', 'label', 'Systemic visibility'),
    jsonb_build_object('key', 'interdependency_awareness', 'label', 'Interdependency awareness'),
    jsonb_build_object('key', 'consequence_reflection_quality', 'label', 'Consequence reflection quality'),
    jsonb_build_object('key', 'executive_systemic_engagement', 'label', 'Executive systemic engagement'),
    jsonb_build_object('key', 'collaboration_theme_clarity', 'label', 'Collaboration theme clarity'),
    jsonb_build_object('key', 'systemic_learning_participation', 'label', 'Systemic learning participation'),
    jsonb_build_object('key', 'awareness_memory_growth', 'label', 'Awareness memory growth'),
    jsonb_build_object('key', 'humility_in_decision_support', 'label', 'Humility in decision support')
  );
$$;

create or replace function public._ocsabp159_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Every decision influences a larger system.',
    'Living systems awareness — not complexity theater.',
    'Understanding begins with humility — not certainty.',
    'The Twin models responsibilities — not people.',
    'Systemic Companion supports awareness — humans decide.'
  );
$$;

create or replace function public._ocsabp159_privacy_note()
returns text language sql immutable as $$
  select 'Metadata only — systemic awareness models responsibilities and processes NOT people. No employee surveillance, individual scoring, predictive certainty, or hidden monitoring. Aggregate organizational themes only.';
$$;

create or replace function public._ocsabp159_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
  v_maps int := 0;
  v_reviews int := 0;
  v_memory int := 0;
  v_snapshots int := 0;
begin
  v_base := public._odtbp124_engagement_summary(p_tenant_id);

  select count(*) into v_maps from public.systemic_awareness_dependency_maps where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.systemic_awareness_reviews where tenant_id = p_tenant_id;
  select count(*) into v_memory from public.systemic_awareness_memory where tenant_id = p_tenant_id;
  select count(*) into v_snapshots from public.systemic_health_snapshots where tenant_id = p_tenant_id;

  return v_base || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._ocsabp159_objectives()),
    'awareness_center_capabilities', jsonb_array_length(public._ocsabp159_systemic_awareness_center()),
    'interdependency_domains', jsonb_array_length(public._ocsabp159_interdependency_engine()),
    'consequence_framework_items', jsonb_array_length(public._ocsabp159_systemic_consequence_framework()),
    'executive_review_themes', jsonb_array_length(public._ocsabp159_executive_systemic_reviews()->'review_themes'),
    'systemic_companion_supports', jsonb_array_length(public._ocsabp159_systemic_companion()),
    'health_theme_count', jsonb_array_length(public._ocsabp159_organizational_health_engine()->'themes'),
    'systemic_learning_links', jsonb_array_length(public._ocsabp159_systemic_learning_engine()),
    'awareness_memory_captures', jsonb_array_length(public._ocsabp159_awareness_memory_engine()->'captures'),
    'companion_limitations_count', jsonb_array_length(public._ocsabp159_companion_limitations()),
    'cross_links_count', jsonb_array_length(public._ocsabp159_integration_links()),
    'success_metrics_count', jsonb_array_length(public._ocsabp159_success_metrics()),
    'dependency_maps', v_maps,
    'systemic_reviews', v_reviews,
    'awareness_memory_entries', v_memory,
    'health_snapshots', v_snapshots,
    'privacy_note', public._ocsabp159_privacy_note()
  );
end; $$;

create or replace function public._ocsabp159_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_roles int := 0;
  v_processes int := 0;
  v_maps int := 0;
begin
  v_engagement := public._ocsabp159_engagement_summary(p_tenant_id);
  v_roles := coalesce((v_engagement->>'active_roles')::int, 0);
  v_processes := coalesce((v_engagement->>'active_processes')::int, 0);
  v_maps := coalesce((v_engagement->>'dependency_maps')::int, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Legacy era systemic awareness objectives documented', 'met', jsonb_array_length(public._ocsabp159_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'awareness_center', 'label', 'Systemic Awareness Center — eight capabilities', 'met', jsonb_array_length(public._ocsabp159_systemic_awareness_center()) = 8, 'note', null),
    jsonb_build_object('key', 'interdependency_engine', 'label', 'Interdependency engine — eight domains', 'met', jsonb_array_length(public._ocsabp159_interdependency_engine()) = 8, 'note', 'Role level NOT individuals — no surveillance.'),
    jsonb_build_object('key', 'consequence_framework', 'label', 'Systemic consequence framework — five items', 'met', jsonb_array_length(public._ocsabp159_systemic_consequence_framework()) = 5, 'note', 'Reflection not prediction.'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive systemic reviews — five themes', 'met', jsonb_array_length(public._ocsabp159_executive_systemic_reviews()->'review_themes') = 5, 'note', 'Humans decide priorities.'),
    jsonb_build_object('key', 'systemic_companion', 'label', 'Systemic Companion — six supports', 'met', jsonb_array_length(public._ocsabp159_systemic_companion()) = 6, 'note', 'Does NOT eliminate uncertainty.'),
    jsonb_build_object('key', 'org_health_cross_link', 'label', 'Organizational health cross-link — seven themes', 'met', jsonb_array_length(public._ocsabp159_organizational_health_engine()->'themes') = 7, 'note', 'Cross-link A.56 — do NOT duplicate _ohe_* RPCs.'),
    jsonb_build_object('key', 'systemic_learning', 'label', 'Systemic learning engine — six links', 'met', jsonb_array_length(public._ocsabp159_systemic_learning_engine()) = 6, 'note', null),
    jsonb_build_object('key', 'awareness_memory', 'label', 'Awareness memory engine — six capture types', 'met', jsonb_array_length(public._ocsabp159_awareness_memory_engine()->'captures') = 6, 'note', 'Metadata only.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._ocsabp159_companion_limitations()) = 5, 'note', 'No claim complete understanding or priority determination.'),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._ocsabp159_integration_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._ocsabp159_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase124_preserved', 'label', 'Phase 124 _odtbp124_* scaffolds preserved', 'met', jsonb_array_length(public._odtbp124_objectives()) = 8, 'note', 'Phase 159 layers on Phase 124 — does not replace.'),
    jsonb_build_object('key', 'twin_engagement', 'label', 'Live Twin + systemic scaffolds engaged', 'met', v_roles >= 1 and v_processes >= 1 and v_maps >= 1, 'note', case when v_roles < 1 or v_processes < 1 or v_maps < 1 then 'Seed Twin roles/processes and systemic dependency maps.' else format('%s roles, %s processes, %s dependency maps.', v_roles, v_processes, v_maps) end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 159 vs Sensemaking 158 distinction documented', 'met', position('Sensemaking' in public._ocsabp159_distinction_note()) > 0, 'note', public._ocsabp159_distinction_note())
  );
end; $$;

create or replace function public._ocsabp159_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '159',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE159_ORGANIZATIONAL_CONSCIOUSNESS_SYSTEMIC_AWARENESS.md',
    'spec_doc', 'ORGANIZATIONAL_CONSCIOUSNESS_SYSTEMIC_AWARENESS_ENGINE_PHASE159.md',
    'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
    'era', 'Legacy & Future Stewardship Era (151–160)',
    'route', '/app/digital-twin',
    'distinction_note', public._ocsabp159_distinction_note(),
    'mission', public._ocsabp159_mission(),
    'philosophy', public._ocsabp159_philosophy(),
    'abos_principle', public._ocsabp159_abos_principle(),
    'vision', public._ocsabp159_vision(),
    'objectives', public._ocsabp159_objectives(),
    'systemic_awareness_center', public._ocsabp159_systemic_awareness_center(),
    'interdependency_engine', public._ocsabp159_interdependency_engine(),
    'systemic_consequence_framework', public._ocsabp159_systemic_consequence_framework(),
    'executive_systemic_reviews', public._ocsabp159_executive_systemic_reviews(),
    'systemic_companion', public._ocsabp159_systemic_companion(),
    'organizational_health_engine', public._ocsabp159_organizational_health_engine(),
    'systemic_learning_engine', public._ocsabp159_systemic_learning_engine(),
    'awareness_memory_engine', public._ocsabp159_awareness_memory_engine(),
    'companion_limitations', public._ocsabp159_companion_limitations(),
    'self_love_connection', public._ocsabp159_self_love_connection(),
    'security_requirements', public._ocsabp159_security_requirements(),
    'integration_links', public._ocsabp159_integration_links(),
    'dogfooding', public._ocsabp159_dogfooding(),
    'success_metrics', public._ocsabp159_success_metrics(),
    'success_criteria', public._ocsabp159_success_criteria(p_tenant_id),
    'engagement_summary', public._ocsabp159_engagement_summary(p_tenant_id),
    'vision_phrases', public._ocsabp159_vision_phrases(),
    'privacy_note', public._ocsabp159_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs (metadata scaffolds)
-- ---------------------------------------------------------------------------
create or replace function public.record_systemic_awareness_review(
  p_review_type text,
  p_title text,
  p_reflection_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._dtw_require_tenant();
  v_user_id := public._dtw_auth_user_id();

  if p_review_type is null or p_review_type not in (
    'executive_systemic', 'interdependency', 'consequence_exploration',
    'collaboration_opportunity', 'vulnerability_theme', 'reflection_program'
  ) then
    raise exception 'invalid_review_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  perform public._ocsabp159_seed(v_tenant_id);

  v_key := 'systemic_review_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.systemic_awareness_reviews (
    tenant_id, review_key, review_type, review_title, status,
    reflection_summary, summary_metadata, recorded_by
  )
  values (
    v_tenant_id, v_key, p_review_type, trim(p_title), 'draft',
    case when p_reflection_summary is not null then left(p_reflection_summary, 500) else null end,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true, 'not_priority_determination', true),
    v_user_id
  )
  returning id into v_id;

  perform public._dtw_log_audit(v_tenant_id, 'systemic_review_recorded', left(trim(p_title), 200),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));

  return jsonb_build_object(
    'success', true,
    'review_id', v_id,
    'review_key', v_key,
    'status', 'draft',
    'companion_limitation', 'Systemic Companion does NOT determine priorities or replace leadership.',
    'privacy_note', public._ocsabp159_privacy_note()
  );
end; $$;

create or replace function public.register_dependency_map_snapshot(
  p_map_scope text,
  p_title text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._dtw_require_tenant();
  v_user_id := public._dtw_auth_user_id();

  if p_map_scope is null or p_map_scope not in (
    'departments', 'processes', 'companions', 'gp_networks',
    'knowledge_networks', 'governance', 'cross_functional'
  ) then
    raise exception 'invalid_map_scope';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  perform public._ocsabp159_seed(v_tenant_id);

  v_key := 'dependency_map_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.systemic_awareness_dependency_maps (
    tenant_id, map_key, map_title, map_scope, status, summary_metadata, recorded_by
  )
  values (
    v_tenant_id, v_key, trim(p_title), p_map_scope, 'draft',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true, 'not_people_surveillance', true),
    v_user_id
  )
  returning id into v_id;

  perform public._dtw_log_audit(v_tenant_id, 'dependency_map_registered', left(trim(p_title), 200),
    jsonb_build_object('map_id', v_id, 'map_scope', p_map_scope));

  return jsonb_build_object(
    'success', true,
    'map_id', v_id,
    'map_key', v_key,
    'status', 'draft',
    'boundary_note', 'Cross-link Phase 124 organizational map — role and process level NOT individual tracking.',
    'privacy_note', public._ocsabp159_privacy_note()
  );
end; $$;

create or replace function public.record_awareness_memory_entry(
  p_memory_type text,
  p_title text,
  p_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._dtw_require_tenant();
  v_user_id := public._dtw_auth_user_id();

  if p_memory_type is null or p_memory_type not in (
    'systemic_review', 'leadership_reflection', 'dependency_map',
    'transformation_insight', 'knowledge_contribution', 'organizational_narrative'
  ) then
    raise exception 'invalid_memory_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  perform public._ocsabp159_seed(v_tenant_id);

  v_key := 'awareness_memory_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.systemic_awareness_memory (
    tenant_id, memory_key, memory_type, memory_title, status,
    summary_metadata, recorded_by
  )
  values (
    v_tenant_id, v_key, p_memory_type, trim(p_title), 'draft',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
      'metadata_only', true,
      'summary', case when p_summary is not null then left(p_summary, 500) else null end
    ),
    v_user_id
  )
  returning id into v_id;

  perform public._dtw_log_audit(v_tenant_id, 'awareness_memory_recorded', left(trim(p_title), 200),
    jsonb_build_object('memory_id', v_id, 'memory_type', p_memory_type));

  return jsonb_build_object(
    'success', true,
    'memory_id', v_id,
    'memory_key', v_key,
    'status', 'draft',
    'boundary_note', 'Cross-link Sensemaking 158 and Org Memory A.34 — do not duplicate institutional memory RPCs.',
    'privacy_note', public._ocsabp159_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL Phase 77 + Phase 124 fields; append Phase 159
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_twin_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health jsonb;
  v_roles jsonb;
  v_processes jsonb;
  v_owners jsonb;
  v_insights jsonb;
  v_units jsonb;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();
  perform public._ocsabp159_seed(v_tenant_id);
  v_health := public.calculate_digital_twin_health_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'role_key', r.role_key, 'role_name', r.role_name, 'description', r.description,
    'responsibility_types', r.responsibility_types,
    'escalation_authority', r.escalation_authority, 'knowledge_ownership', r.knowledge_ownership
  ) order by r.role_name), '[]'::jsonb) into v_roles
  from public.digital_twin_roles r where r.tenant_id = v_tenant_id and r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'process_key', p.process_key, 'process_name', p.process_name, 'category', p.category,
    'owner_role_id', p.owner_role_id, 'deadline_hours', p.deadline_hours
  ) order by p.process_name), '[]'::jsonb) into v_processes
  from public.digital_twin_process_models p where p.tenant_id = v_tenant_id and p.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'topic', k.topic, 'topic_key', k.topic_key, 'role_id', k.role_id,
    'confidence', k.confidence,
    'confidence_level', public._dtw_confidence_level(k.confidence),
    'requires_review', k.requires_review
  ) order by k.topic), '[]'::jsonb) into v_owners
  from public.digital_twin_knowledge_owners k where k.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'insight_type', i.insight_type, 'summary', i.summary,
    'confidence', i.confidence, 'status', i.status
  ) order by i.created_at desc), '[]'::jsonb) into v_insights
  from public.digital_twin_insights i where i.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', u.id, 'name', u.name, 'unit_type', u.unit_type
  ) order by u.name), '[]'::jsonb) into v_units
  from public.aipify_organization_units u where u.tenant_id = v_tenant_id and u.active limit 20;

  return jsonb_build_object(
    'has_customer', true,
    'twin_health_score', v_health->'twin_health_score',
    'process_coverage', v_health->'process_coverage',
    'knowledge_owners', v_health->'knowledge_owners',
    'low_confidence_count', v_health->'low_confidence_count',
    'roles', v_roles,
    'processes', v_processes,
    'knowledge_routing', v_owners,
    'insights', v_insights,
    'organization_units', v_units,
    'integrations', jsonb_build_object(
      'action_center', 'Task assignment and escalation routing',
      'desktop', 'Notification and reminder prioritization',
      'briefing', 'Department summaries and bottleneck reporting',
      'governance', 'Approver identification and separation of duties',
      'agents', 'Support/Knowledge/Governance agent routing'
    ),
    'implementation_blueprint_phase77', jsonb_build_object(
      'phase', 'Phase 77 — Organizational Digital Twin Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE77_ORGANIZATIONAL_DIGITAL_TWIN.md',
      'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
      'route', '/app/digital-twin',
      'mapping_note', 'ABOS Blueprint Phase 77 aligns with repo Phase 77 — blueprint adds ABOS spec scaffolding on existing engine. Phase numbers align positively.'
    ),
    'organizational_digital_twin_note', 'Organizational Digital Twin Engine (ABOS Phase 77) — extends Digital Twin Phase 77 with organizational visualization, dependency awareness, simulation connection, and live success criteria.',
    'blueprint_distinction_note', public._odtbp_distinction_note(),
    'blueprint_mission', public._odtbp_mission(),
    'blueprint_philosophy', public._odtbp_philosophy(),
    'blueprint_abos_principle', public._odtbp_abos_principle(),
    'blueprint_objectives', public._odtbp_objectives(),
    'digital_twin_definition', public._odtbp_digital_twin_definition(),
    'organizational_mapping', public._odtbp_organizational_mapping(),
    'companion_observations', public._odtbp_companion_observations(),
    'simulation_connection', public._odtbp_simulation_connection(),
    'learning_organization_connection', public._odtbp_learning_organization_connection(),
    'blueprint_self_love_connection', public._odtbp_self_love_connection(),
    'blueprint_leadership_insights', public._odtbp_leadership_insights(),
    'privacy_principles', public._odtbp_privacy_principles(),
    'blueprint_trust_connection', public._odtbp_trust_connection(),
    'blueprint_dogfooding', public._odtbp_dogfooding(),
    'blueprint_integration_links', public._odtbp_integration_links(),
    'engagement_summary', public._odtbp_engagement_summary(v_tenant_id),
    'blueprint_success_criteria', public._odtbp_success_criteria(v_tenant_id),
    'blueprint_vision_phrases', public._odtbp_vision_phrases(),
    'blueprint_privacy_note', 'Organizational digital twin is metadata only — no employee surveillance, individual scoring, or hidden monitoring. Purpose is understanding NOT surveillance.',
    'implementation_blueprint_phase124', public._odtbp124_blueprint_block(v_tenant_id),
    'organizational_digital_twin_phase124_note', 'Enterprise Intelligence Phase 124 — Organizational Digital Twin deepens system relationships, dependency intelligence, simulation workspaces, transformation impact, and Executive Digital Twin Companion on Phase 77 scaffolds. Twin is a mirror — humans decide.',
    'implementation_blueprint_phase159', public._ocsabp159_blueprint_block(v_tenant_id),
    'organizational_consciousness_phase159_note', 'Legacy & Future Stewardship Phase 159 — Organizational Consciousness & Systemic Awareness deepens living systems awareness on Digital Twin Phase 77 + 124 scaffolds. Systemic Companion supports awareness — does NOT claim complete understanding, replace leadership, or determine priorities. NOT predictive certainty; NOT employee surveillance.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve Phase 77 + Phase 124 fields; append Phase 159
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_twin_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score numeric;
  v_insights int;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  perform public._ocsabp159_seed(v_tenant_id);

  select metric_value into v_score from public.digital_twin_metrics
  where tenant_id = v_tenant_id and metric_key = 'twin_health_score'
  order by recorded_at desc limit 1;

  select count(*) into v_insights from public.digital_twin_insights
  where tenant_id = v_tenant_id and status = 'open';

  v_engagement := public._odtbp_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'twin_health_score', coalesce(v_score, 70),
    'open_insights', v_insights,
    'philosophy', 'The Twin models responsibilities — not people. Never surveillance.',
    'privacy_note', 'No employee scoring, ranking, or hidden monitoring.',
    'implementation_blueprint_phase77', jsonb_build_object(
      'phase', 'Phase 77 — Organizational Digital Twin Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE77_ORGANIZATIONAL_DIGITAL_TWIN.md',
      'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
      'route', '/app/digital-twin'
    ),
    'blueprint_mission', public._odtbp_mission(),
    'blueprint_abos_principle', public._odtbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Organizational Digital Twin Engine (ABOS Phase 77) — extends Digital Twin Phase 77 with organizational visualization, dependency awareness, and live success criteria.',
    'understanding_note', 'Purpose is understanding NOT surveillance — explore complexity with curiosity.',
    'implementation_blueprint_phase124', jsonb_build_object(
      'phase', 'Phase 124 — Organizational Digital Twin Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE124_ORGANIZATIONAL_DIGITAL_TWIN.md',
      'spec_doc', 'ORGANIZATIONAL_DIGITAL_TWIN_ENGINE_PHASE124.md',
      'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/digital-twin'
    ),
    'phase124_mission', public._odtbp124_mission(),
    'phase124_abos_principle', public._odtbp124_abos_principle(),
    'phase124_engagement_summary', public._odtbp124_engagement_summary(v_tenant_id),
    'phase124_note', 'Enterprise Intelligence Phase 124 deepens organizational twin on Phase 77 — visibility and simulation, not prediction. Metadata only.',
    'implementation_blueprint_phase159', jsonb_build_object(
      'phase', 'Phase 159 — Organizational Consciousness & Systemic Awareness',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE159_ORGANIZATIONAL_CONSCIOUSNESS_SYSTEMIC_AWARENESS.md',
      'spec_doc', 'ORGANIZATIONAL_CONSCIOUSNESS_SYSTEMIC_AWARENESS_ENGINE_PHASE159.md',
      'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/digital-twin'
    ),
    'phase159_mission', public._ocsabp159_mission(),
    'phase159_abos_principle', public._ocsabp159_abos_principle(),
    'phase159_engagement_summary', public._ocsabp159_engagement_summary(v_tenant_id),
    'phase159_note', 'Legacy & Future Stewardship Phase 159 — living systems awareness on Digital Twin. Systemic Companion supports awareness — does NOT eliminate uncertainty or determine priorities.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ocsabp159_seed(uuid) to authenticated;
grant execute on function public._ocsabp159_distinction_note() to authenticated;
grant execute on function public._ocsabp159_mission() to authenticated;
grant execute on function public._ocsabp159_philosophy() to authenticated;
grant execute on function public._ocsabp159_abos_principle() to authenticated;
grant execute on function public._ocsabp159_vision() to authenticated;
grant execute on function public._ocsabp159_objectives() to authenticated;
grant execute on function public._ocsabp159_systemic_awareness_center() to authenticated;
grant execute on function public._ocsabp159_interdependency_engine() to authenticated;
grant execute on function public._ocsabp159_systemic_consequence_framework() to authenticated;
grant execute on function public._ocsabp159_executive_systemic_reviews() to authenticated;
grant execute on function public._ocsabp159_systemic_companion() to authenticated;
grant execute on function public._ocsabp159_organizational_health_engine() to authenticated;
grant execute on function public._ocsabp159_systemic_learning_engine() to authenticated;
grant execute on function public._ocsabp159_awareness_memory_engine() to authenticated;
grant execute on function public._ocsabp159_companion_limitations() to authenticated;
grant execute on function public._ocsabp159_self_love_connection() to authenticated;
grant execute on function public._ocsabp159_security_requirements() to authenticated;
grant execute on function public._ocsabp159_integration_links() to authenticated;
grant execute on function public._ocsabp159_dogfooding() to authenticated;
grant execute on function public._ocsabp159_success_metrics() to authenticated;
grant execute on function public._ocsabp159_vision_phrases() to authenticated;
grant execute on function public._ocsabp159_privacy_note() to authenticated;
grant execute on function public._ocsabp159_engagement_summary(uuid) to authenticated;
grant execute on function public._ocsabp159_success_criteria(uuid) to authenticated;
grant execute on function public._ocsabp159_blueprint_block(uuid) to authenticated;
grant execute on function public.record_systemic_awareness_review(text, text, text, jsonb) to authenticated;
grant execute on function public.register_dependency_map_snapshot(text, text, jsonb) to authenticated;
grant execute on function public.record_awareness_memory_entry(text, text, text, jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'digital-twin-blueprint-phase159', 'Organizational Consciousness & Systemic Awareness (Legacy Phase 159)',
  'Legacy & Future Stewardship Phase 159 — Organizational Consciousness & Systemic Awareness extends Digital Twin Phase 77 + 124 with living systems awareness, interdependency engine, systemic companion, and executive systemic reviews at /app/digital-twin.',
  'authenticated', 159
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'digital-twin-blueprint-phase159' and tenant_id is null
);
