-- Implementation Blueprint Phase 154 — Organizational Resilience & Adaptive Continuity Engine
-- Legacy & Future Stewardship Era (151–160). Extends Organizational Resilience A.50 + Phase 81 + Phase 91 + Phase 128 + Phase 136.
-- Helpers: _oracbp154_* (never collide with _ore_*, _rnbp_*, _orrbp91_*, _rccbp128_*, _shobp136_*).
-- Cross-links Continuity Phase 80/73, Future Leaders 151, Org Legacy 152, Decision Heritage 153, Global Stewardship 150 — do NOT duplicate.

-- ---------------------------------------------------------------------------
-- 1. Optional tables (tenant-scoped, metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.adaptive_continuity_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_key text not null,
  plan_title text not null,
  plan_type text not null default 'operational' check (
    plan_type in ('operational', 'leadership', 'knowledge', 'technology', 'market', 'workforce')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'active', 'archived')
  ),
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  review_cycle text default 'quarterly',
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, plan_key)
);

create index if not exists adaptive_continuity_plans_org_idx
  on public.adaptive_continuity_plans (organization_id, status, created_at desc);

alter table public.adaptive_continuity_plans enable row level security;
revoke all on public.adaptive_continuity_plans from authenticated, anon;

create table if not exists public.adaptive_continuity_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_key text not null,
  scenario_type text not null check (
    scenario_type in (
      'leadership_change', 'economic_downturn', 'rapid_growth', 'technology_disruption',
      'operational_incident', 'knowledge_loss', 'global_market_change'
    )
  ),
  scenario_title text not null,
  preparedness_level text not null default 'exploring' check (
    preparedness_level in ('exploring', 'developing', 'practiced', 'reviewed', 'archived')
  ),
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, scenario_key)
);

create index if not exists adaptive_continuity_scenarios_org_idx
  on public.adaptive_continuity_scenarios (organization_id, scenario_type, preparedness_level);

alter table public.adaptive_continuity_scenarios enable row level security;
revoke all on public.adaptive_continuity_scenarios from authenticated, anon;

create table if not exists public.adaptive_continuity_leadership_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  preparedness_level text not null default 'draft' check (
    preparedness_level in ('draft', 'review', 'completed', 'archived')
  ),
  likely_disruptions jsonb not null default '[]'::jsonb,
  vulnerabilities_summary text check (vulnerabilities_summary is null or char_length(vulnerabilities_summary) <= 500),
  strengths_summary text check (strengths_summary is null or char_length(strengths_summary) <= 500),
  summary_metadata jsonb not null default '{"metadata_only":true,"not_individual_scoring":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, review_key)
);

create index if not exists adaptive_continuity_leadership_reviews_org_idx
  on public.adaptive_continuity_leadership_reviews (organization_id, preparedness_level, created_at desc);

alter table public.adaptive_continuity_leadership_reviews enable row level security;
revoke all on public.adaptive_continuity_leadership_reviews from authenticated, anon;

create table if not exists public.adaptive_continuity_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'preparedness_exercise', 'recovery_lesson', 'leadership_reflection',
      'operational_insight', 'governance_adjustment', 'knowledge_contribution'
    )
  ),
  memory_title text not null,
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'archived')
  ),
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, memory_key)
);

create index if not exists adaptive_continuity_memory_org_idx
  on public.adaptive_continuity_memory (organization_id, memory_type, status);

alter table public.adaptive_continuity_memory enable row level security;
revoke all on public.adaptive_continuity_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helper
-- ---------------------------------------------------------------------------
create or replace function public._oracbp154_seed(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.adaptive_continuity_plans where organization_id = p_organization_id limit 1
  ) then
    return;
  end if;

  insert into public.adaptive_continuity_plans (
    organization_id, plan_key, plan_title, plan_type, status, summary_metadata
  ) values
    (p_organization_id, 'core_operational_continuity', 'Core operational continuity framework', 'operational', 'active',
     '{"requires_executive_review":true,"human_approved":true}'::jsonb),
    (p_organization_id, 'leadership_transition_preparedness', 'Leadership transition preparedness scaffold', 'leadership', 'review',
     '{"cross_link":"future_leaders_151"}'::jsonb);

  insert into public.adaptive_continuity_scenarios (
    organization_id, scenario_key, scenario_type, scenario_title, preparedness_level, summary_metadata
  ) values
    (p_organization_id, 'leadership_succession', 'leadership_change', 'Leadership succession preparedness review', 'developing',
     '{"cross_link":"future_leaders_151","not_fear_framing":true}'::jsonb),
    (p_organization_id, 'knowledge_continuity', 'knowledge_loss', 'Critical knowledge continuity scenario', 'exploring',
     '{"cross_link":"org_legacy_152"}'::jsonb),
    (p_organization_id, 'technology_shift', 'technology_disruption', 'Technology disruption adaptation scenario', 'developing',
     '{"cross_link":"digital_twin_124"}'::jsonb);

  insert into public.adaptive_continuity_leadership_reviews (
    organization_id, review_key, review_title, preparedness_level,
    likely_disruptions, vulnerabilities_summary, strengths_summary, summary_metadata
  ) values
    (p_organization_id, 'quarterly_resilience_review', 'Quarterly leadership resilience review', 'review',
     '["leadership_transition","operational_incident","market_shift"]'::jsonb,
     'Aggregate dependency and knowledge coverage gaps for leadership review — not individual scoring.',
     'Cross-functional collaboration and documented recovery playbooks noted as organizational strengths.',
     '{"metadata_only":true,"executive_approval_required":true}'::jsonb);

  insert into public.adaptive_continuity_memory (
    organization_id, memory_key, memory_type, memory_title, status, summary_metadata
  ) values
    (p_organization_id, 'tabletop_exercise_q1', 'preparedness_exercise', 'Leadership tabletop preparedness exercise outcomes', 'review',
     '{"exercise_type":"tabletop","cross_link":"simulations_78"}'::jsonb),
    (p_organization_id, 'recovery_coordination_lesson', 'recovery_lesson', 'Recovery coordination lesson — communication clarity', 'draft',
     '{"theme":"communication","cross_link":"decision_heritage_153"}'::jsonb);
end; $$;

-- Phase 154 helpers body (included by main migration)
-- Organizational Resilience & Adaptive Continuity Engine — Legacy & Future Stewardship Era (151–160)

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers _oracbp154_*
-- ---------------------------------------------------------------------------
create or replace function public._oracbp154_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Legacy & Future Stewardship Phase 154 — Organizational Resilience & Adaptive Continuity Engine at /app/organizational-resilience-engine. Layers on Organizational Resilience Engine A.50 (_ore_*), Blueprint Phase 81 Risk Navigation (_rnbp_*), Phase 91 Recovery (_orrbp91_*), Phase 128 Resilience & Continuity Companion (_rccbp128_*), and Phase 136 Self-Healing Operations (_shobp136_*). Phase 154 deepens adaptive continuity — preparedness, flexibility, and collective strength through disruption — **not fear or rigid control**. Resilience is moving through disruption together. **Distinct from Continuity, Resilience & Crisis Phase 80** at /app/continuity — backup ownership, incident mode, readiness score, crisis briefings (crisis continuity distinct layer). **Distinct from Organizational Continuity Blueprint 73** — cross-link only. **Distinct from Self-Healing Operations Phase 136** — transparent governed recovery and operational degradation detection; Phase 154 = adaptive continuity preparedness and organizational flexibility. **Distinct from Future Leaders Phase 151**, **Organizational Legacy Phase 152**, **Decision Heritage Phase 153**, **Global Stewardship Phase 150** — cross-link only; never duplicate stewardship RPCs. Cross-links Change Management Phase 127 /app/change-management-engine, Employee Experience Phase 96, Self Love A.76 /app/self-love-engine, Incident Response A.51 /app/incident-response-coordination-engine, Digital Twin Phase 124 /app/digital-twin. Helpers _oracbp154_* only. Growth Partner terminology — never Affiliate. Metadata only; no employee surveillance.';
$$;

create or replace function public._oracbp154_mission()
returns text language sql immutable as $$
  select 'Help organizations build adaptive continuity — prepared for disruption, flexible in response, and strengthened through collective resilience — with humans leading decisions and companions supporting preparedness.';
$$;

create or replace function public._oracbp154_philosophy()
returns text language sql immutable as $$
  select 'Preparedness, flexibility, and collective strength — not fear or rigid control. Resilience is moving through disruption together. People First. Wisdom before speed. Uncertainty acknowledged honestly; companions support — never guarantee outcomes.';
$$;

create or replace function public._oracbp154_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Adaptive Continuity informs, prepares, and scaffolds organizational flexibility; humans lead decisions, approvals, and emergency response. Preparedness not command. Governed continuity NOT autonomous crisis management.';
$$;

create or replace function public._oracbp154_vision()
returns text language sql immutable as $$
  select 'When circumstances shift, the organization adapts with clarity — continuity plans visible, scenarios practiced, leadership prepared, and people supported through change together.';
$$;

create or replace function public._oracbp154_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'adaptive_continuity_planning', 'label', 'Adaptive continuity planning', 'emoji', '🔔', 'description', 'Structured continuity plans with executive review — metadata via adaptive_continuity_plans'),
    jsonb_build_object('key', 'scenario_preparedness', 'label', 'Scenario preparedness', 'emoji', '🦉', 'description', 'Leadership, economic, growth, technology, operational, knowledge, and market scenario scaffolds — preparedness not prediction'),
    jsonb_build_object('key', 'organizational_flexibility', 'label', 'Organizational flexibility', 'emoji', '🌹', 'description', 'Cross-training, knowledge distribution, operational redundancy, and adaptive governance — collective strength'),
    jsonb_build_object('key', 'leadership_resilience_readiness', 'label', 'Leadership resilience readiness', 'emoji', '🔔', 'description', 'Leadership resilience reviews — aggregate vulnerabilities and strengths, not individual scoring'),
    jsonb_build_object('key', 'employee_collective_support', 'label', 'Employee collective support', 'emoji', '❤️', 'description', 'Organizational support framework — communication, psychological safety, recognition; NOT surveillance'),
    jsonb_build_object('key', 'continuity_memory_capture', 'label', 'Continuity memory capture', 'emoji', '🦉', 'description', 'Preparedness exercises, recovery lessons, and governance adjustments — cross-link Org Legacy 152 and Decision Heritage 153'),
    jsonb_build_object('key', 'preparedness_exercises', 'label', 'Preparedness exercises', 'emoji', '🔔', 'description', 'Tabletop and scenario exercises — cross-link Simulations /app/simulations; human-led review'),
    jsonb_build_object('key', 'legacy_stewardship_integration', 'label', 'Legacy stewardship integration', 'emoji', '🌹', 'description', 'Cross-link Future Leaders 151, Org Legacy 152, Decision Heritage 153, Global Stewardship 150 — stewardship without duplication')
  );
$$;

create or replace function public._oracbp154_resilience_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning', 'description', 'Adaptive continuity plans with review cycles — extends Phase 128 continuity planning'),
    jsonb_build_object('key', 'scenario_preparedness', 'label', 'Scenario preparedness', 'description', 'Seven scenario-type preparedness scaffolds — leadership, economic, growth, technology, operational, knowledge, market'),
    jsonb_build_object('key', 'disruption_preparedness', 'label', 'Disruption preparedness', 'description', 'Preparedness resources without panic framing — extends Phase 128 disruption preparedness'),
    jsonb_build_object('key', 'operational_recovery_frameworks', 'label', 'Operational recovery frameworks', 'description', 'Recovery coordination and prioritization scaffolds — cross-link Phase 136 self-healing recovery'),
    jsonb_build_object('key', 'leadership_readiness_reviews', 'label', 'Leadership readiness reviews', 'description', 'Quarterly leadership resilience reviews — aggregate vulnerabilities and strengths; cross-link Future Leaders 151'),
    jsonb_build_object('key', 'companion_resilience_support', 'label', 'Companion resilience support', 'description', 'Resilience Companion guidance — supportive not directive; does NOT guarantee outcomes'),
    jsonb_build_object('key', 'adaptive_learning_programs', 'label', 'Adaptive learning programs', 'description', 'Organizational learning from preparedness exercises and recovery lessons — metadata only'),
    jsonb_build_object('key', 'dependency_visibility', 'label', 'Dependency visibility', 'description', 'Critical dependency awareness — cross-link Digital Twin Phase 124; extends Phase 128 dependency protection'),
    jsonb_build_object('key', 'resilience_dashboards', 'label', 'Resilience dashboards', 'description', 'Aggregate continuity indicators — plans, scenarios, reviews, memory entries'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'description', 'Continuity memory and knowledge contributions — cross-link Organizational Legacy Phase 152')
  );
$$;

create or replace function public._oracbp154_adaptive_continuity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning', 'description', 'Approved continuity plans with human review workflow — operational, leadership, knowledge, technology, market, workforce types'),
    jsonb_build_object('key', 'role_redundancy_visibility', 'label', 'Role redundancy visibility', 'description', 'Role redundancy and backup coverage metadata — cross-link Digital Twin Phase 124; not individual performance scoring'),
    jsonb_build_object('key', 'critical_dependency_mapping', 'label', 'Critical dependency mapping', 'description', 'Critical dependency mapping cross-link — Digital Twin Phase 124; SPOF awareness metadata only'),
    jsonb_build_object('key', 'recovery_coordination', 'label', 'Recovery coordination', 'description', 'Recovery coordination scaffolds — cross-link Phase 136 self-healing and Phase 128 recovery orchestration'),
    jsonb_build_object('key', 'operational_prioritization', 'label', 'Operational prioritization', 'description', 'Priority sequencing during disruption — people and systems balanced'),
    jsonb_build_object('key', 'preparedness_exercises', 'label', 'Preparedness exercises', 'description', 'Tabletop and scenario exercise scaffolds — cross-link Simulations /app/simulations'),
    jsonb_build_object('key', 'flexible_adaptation', 'label', 'Flexible adaptation scaffolds', 'description', 'Operational flexibility and alternative workflow adaptation — cross-link Change Management Phase 127')
  );
$$;

create or replace function public._oracbp154_scenario_preparedness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_changes', 'label', 'Leadership changes', 'description', 'Leadership succession and transition preparedness — cross-link Future Leaders Phase 151'),
    jsonb_build_object('key', 'economic_downturns', 'label', 'Economic downturns', 'description', 'Economic contraction scenario scaffolds — financial resilience without alarmist framing'),
    jsonb_build_object('key', 'rapid_growth', 'label', 'Rapid growth', 'description', 'Rapid expansion scenario scaffolds — capacity, knowledge, and leadership scaling preparedness'),
    jsonb_build_object('key', 'technology_disruptions', 'label', 'Technology disruptions', 'description', 'Technology shift and disruption adaptation — cross-link Digital Twin Phase 124'),
    jsonb_build_object('key', 'operational_incidents', 'label', 'Operational incidents', 'description', 'Operational incident preparedness — cross-link Incident Response A.51 and Phase 136 self-healing'),
    jsonb_build_object('key', 'knowledge_loss', 'label', 'Knowledge loss', 'description', 'Critical knowledge continuity scenarios — cross-link Organizational Legacy Phase 152'),
    jsonb_build_object('key', 'global_market_changes', 'label', 'Global market changes', 'description', 'Global market shift preparedness — cross-link Global Stewardship Phase 150')
  );
$$;

create or replace function public._oracbp154_leadership_resilience_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'likely_disruptions', 'label', 'Likely disruptions', 'description', 'Aggregate likely disruption themes for leadership review — metadata themes only'),
    jsonb_build_object('key', 'preparedness_level', 'label', 'Preparedness level', 'description', 'Organizational preparedness level assessment — draft, review, completed, archived'),
    jsonb_build_object('key', 'vulnerabilities', 'label', 'Vulnerabilities', 'description', 'Aggregate dependency and knowledge coverage gaps — not individual scoring or surveillance'),
    jsonb_build_object('key', 'organizational_strengths', 'label', 'Organizational strengths', 'description', 'Documented recovery playbooks, cross-functional collaboration, and continuity assets'),
    jsonb_build_object('key', 'adaptability_strengthening', 'label', 'Adaptability strengthening', 'description', 'Recommendations to strengthen organizational adaptability — human approval required')
  );
$$;

create or replace function public._oracbp154_resilience_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'preparedness_recommendations', 'label', 'Preparedness recommendations', 'description', 'Surface preparedness recommendations for human review — supportive not directive'),
    jsonb_build_object('key', 'knowledge_retrieval', 'label', 'Knowledge retrieval', 'description', 'Retrieve approved continuity knowledge — cross-link Org Legacy 152 and Decision Heritage 153'),
    jsonb_build_object('key', 'recovery_coordination_support', 'label', 'Recovery coordination support', 'description', 'Scaffold recovery coordination visibility — humans assign roles and priorities'),
    jsonb_build_object('key', 'leadership_reflection_prompts', 'label', 'Leadership reflection prompts', 'description', 'Leadership reflection scaffolds — metadata only; not wellbeing surveillance'),
    jsonb_build_object('key', 'continuity_guidance', 'label', 'Continuity guidance', 'description', 'Continuity planning guidance with approved playbooks — does NOT eliminate uncertainty'),
    jsonb_build_object('key', 'adaptive_learning_suggestions', 'label', 'Adaptive learning suggestions', 'description', 'Suggest organizational learning captures from exercises — human approval before storage')
  );
$$;

create or replace function public._oracbp154_organizational_flexibility_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'cross_training_initiatives', 'label', 'Cross-training initiatives', 'description', 'Cross-training and skill breadth scaffolds — collective capability not individual surveillance'),
    jsonb_build_object('key', 'knowledge_distribution', 'label', 'Knowledge distribution', 'description', 'Knowledge distribution and accessibility — cross-link Organizational Legacy Phase 152'),
    jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development', 'description', 'Leadership development cross-link — Future Leaders Phase 151 /app/future-leaders-engine'),
    jsonb_build_object('key', 'operational_redundancy', 'label', 'Operational redundancy', 'description', 'Operational redundancy and fallback procedure visibility — metadata signals only'),
    jsonb_build_object('key', 'gp_support_networks', 'label', 'Growth Partner support networks', 'description', 'Growth Partner ecosystem support networks — cross-link GP Operations; never Affiliate'),
    jsonb_build_object('key', 'adaptive_governance', 'label', 'Adaptive governance', 'description', 'Adaptive governance review scaffolds — human approval required; cross-link Governance A.14')
  );
$$;

create or replace function public._oracbp154_employee_support_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'communication_clarity', 'label', 'Communication clarity', 'description', 'Clear organizational communication during uncertainty — cross-link Stakeholder Communication A.53'),
    jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety', 'description', 'Psychological safety during disruption — honest reflection without blame culture'),
    jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Recognition of collective effort during adaptation — not performative individual scoring'),
    jsonb_build_object('key', 'learning_opportunities', 'label', 'Learning opportunities', 'description', 'Learning opportunities from preparedness and recovery — cross-link Employee Experience Phase 96'),
    jsonb_build_object('key', 'leadership_accessibility', 'label', 'Leadership accessibility', 'description', 'Leadership accessibility and visibility during disruption — organizational support not surveillance'),
    jsonb_build_object('key', 'companion_guidance', 'label', 'Companion guidance', 'description', 'Companion guidance for organizational support — supportive not directive; cross-link Self Love A.76')
  );
$$;

create or replace function public._oracbp154_continuity_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'preparedness_exercise', 'label', 'Preparedness exercises', 'description', 'Tabletop and scenario exercise outcomes — metadata only; cross-link Simulations'),
    jsonb_build_object('key', 'recovery_lesson', 'label', 'Recovery lessons', 'description', 'Recovery coordination lessons — summary metadata; cross-link Phase 136 incident learning'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflections', 'description', 'Leadership reflection captures — metadata only; cross-link Future Leaders 151'),
    jsonb_build_object('key', 'operational_insight', 'label', 'Operational insights', 'description', 'Operational insight captures from continuity exercises — aggregate themes only'),
    jsonb_build_object('key', 'governance_adjustment', 'label', 'Governance adjustments', 'description', 'Governance adjustment recommendations — human approval required'),
    jsonb_build_object('key', 'knowledge_contribution', 'label', 'Knowledge contributions', 'description', 'Knowledge contributions to organizational legacy — cross-link Org Legacy 152 and Decision Heritage 153')
  );
$$;

create or replace function public._oracbp154_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_guarantee_outcomes', 'label', 'No guarantee outcomes', 'description', 'Never guarantee continuity outcomes or eliminate uncertainty — companions support preparedness only'),
    jsonb_build_object('key', 'no_replace_leadership', 'label', 'No replace leadership', 'description', 'Never replace executive leadership or designated crisis command authority'),
    jsonb_build_object('key', 'no_override_emergency', 'label', 'No override emergency procedures', 'description', 'Never override approved emergency procedures or incident response protocols'),
    jsonb_build_object('key', 'no_suppress_uncertainty', 'label', 'No suppress uncertainty', 'description', 'Never suppress legitimate uncertainty, dissent, or honest risk acknowledgment'),
    jsonb_build_object('key', 'no_beyond_governance', 'label', 'No act beyond governance', 'description', 'Never act beyond governance boundaries — permissions, approvals, and audit requirements enforced')
  );
$$;

create or replace function public._oracbp154_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in adaptive continuity — self-awareness, patience, adaptability, mutual support, recognition of effort, compassion during uncertainty.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'self_awareness', 'label', 'Self-awareness', 'description', 'Honest organizational self-awareness during disruption — strengths and gaps acknowledged'),
      jsonb_build_object('key', 'patience', 'label', 'Patience', 'description', 'Patient adaptation pace — no pressure to recover or adapt before teams are ready'),
      jsonb_build_object('key', 'adaptability', 'label', 'Adaptability', 'description', 'Flexible response with compassion — moving through disruption together'),
      jsonb_build_object('key', 'mutual_support', 'label', 'Mutual support', 'description', 'Mutual support across teams during continuity exercises and recovery'),
      jsonb_build_object('key', 'recognition_of_effort', 'label', 'Recognition of effort', 'description', 'Recognition of collective effort during preparedness and adaptation'),
      jsonb_build_object('key', 'compassion_during_uncertainty', 'label', 'Compassion during uncertainty', 'description', 'Compassionate leadership during uncertainty — cross-link Self Love A.76')
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'Adapt together at a human pace — collective strength strengthens the organization.'
  );
$$;

create or replace function public._oracbp154_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_audit_trails', 'label', 'Continuity planning audit logs', 'description', 'Full audit via _ore_log and adaptive continuity records — immutable accountability'),
    jsonb_build_object('key', 'executive_approval_histories', 'label', 'Executive approval histories', 'description', 'Executive approval history for continuity plans and leadership reviews — cross-link Executive Intelligence 121'),
    jsonb_build_object('key', 'rbac', 'label', 'RBAC enforcement', 'description', 'resilience.view / resilience.manage / resilience.review / resilience.approve permissions enforced'),
    jsonb_build_object('key', 'preparedness_documentation_controls', 'label', 'Preparedness documentation controls', 'description', 'Preparedness documentation access controls — metadata only; no raw operational content'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', 'Sensitive continuity approvals may require 2FA — cross-link /app/settings/two-factor'),
    jsonb_build_object('key', 'tenant_isolation', 'label', 'Tenant isolation', 'description', 'All adaptive continuity data scoped by organization_id via RLS and security definer RPCs')
  );
$$;

create or replace function public._oracbp154_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'future_leaders_151', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'note', 'Leadership succession and development cross-link'),
    jsonb_build_object('key', 'organizational_legacy_152', 'label', 'Organizational Legacy Phase 152', 'route', '/app/organizational-memory-engine', 'note', 'Knowledge preservation and legacy continuity cross-link'),
    jsonb_build_object('key', 'decision_heritage_153', 'label', 'Decision Heritage Phase 153', 'route', '/app/decision-intelligence-engine', 'note', 'Institutional wisdom and decision heritage cross-link'),
    jsonb_build_object('key', 'global_stewardship_150', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'note', 'Global market and collective future stewardship cross-link'),
    jsonb_build_object('key', 'continuity_phase80', 'label', 'Continuity Phase 80', 'route', '/app/continuity', 'note', 'Crisis continuity distinct layer — cross-link only'),
    jsonb_build_object('key', 'continuity_blueprint_73', 'label', 'Organizational Continuity Blueprint 73', 'route', '/app/continuity', 'note', 'Continuity blueprint cross-link — do not duplicate RPCs'),
    jsonb_build_object('key', 'resilience_companion_128', 'label', 'Resilience Companion Phase 128', 'route', '/app/organizational-resilience-engine', 'note', 'Continuity companion layer preserved — extends Resilience Center'),
    jsonb_build_object('key', 'self_healing_136', 'label', 'Self-Healing Operations Phase 136', 'route', '/app/organizational-resilience-engine', 'note', 'Transparent governed recovery cross-link — distinct from adaptive continuity preparedness'),
    jsonb_build_object('key', 'change_management_127', 'label', 'Change Management Phase 127', 'route', '/app/change-management-engine', 'note', 'Transformation and flexible adaptation cross-link'),
    jsonb_build_object('key', 'employee_experience_96', 'label', 'Employee Experience Phase 96', 'route', '/app/employee-experience-engine', 'note', 'Organizational support and wellbeing cross-link — not surveillance'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Compassion, patience, and mutual support during uncertainty'),
    jsonb_build_object('key', 'incident_response', 'label', 'Incident Response A.51', 'route', '/app/incident-response-coordination-engine', 'note', 'Coordinated incident response — cross-link only'),
    jsonb_build_object('key', 'digital_twin_124', 'label', 'Digital Twin Phase 124', 'route', '/app/digital-twin', 'note', 'Critical dependency mapping and role redundancy visibility')
  );
$$;

create or replace function public._oracbp154_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptive Continuity — governed preparedness with flexibility; humans accountable, companions supportive.',
    'must_never', public._oracbp154_companion_limitations(),
    'forbidden', jsonb_build_array(
      'Fear-based or alarmist continuity framing',
      'Rigid control or surveillance of employees during disruption',
      'Guaranteed continuity outcomes or eliminated uncertainty claims',
      'Replacing executive leadership or crisis command authority',
      'Overriding approved emergency or incident response procedures',
      'Suppressing dissent or legitimate uncertainty acknowledgment',
      'Acting beyond governance boundaries without explicit approval',
      'Duplicating Continuity Phase 80 crisis RPCs or Incident Response A.51',
      'Individual blame scoring or employee performance surveillance',
      'Affiliate terminology — Growth Partner only'
    ),
    'required', jsonb_build_array(
      'Metadata summaries only in dashboard RPC payloads',
      'Human approval for continuity plans and leadership resilience reviews',
      'Transparent preparedness signals — explain why context appears',
      'People-first collective support — compassion with accountability',
      'Preserve all A.50 + Phase 81 + Phase 91 + Phase 128 + Phase 136 dashboard fields',
      'Full continuity audit trails via _ore_log and adaptive continuity records',
      'Cross-link Phases 150–153, Continuity 73/80, Change 127, Self Love — never duplicate storage'
    ),
    'boundary_note', 'Preparedness and flexibility strengthen organizations — Wisdom before speed. People First. Humans decide; Aipify informs, prepares, and scaffolds adaptive continuity.'
  );
$$;

create or replace function public._oracbp154_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience Companion — preparedness recommendations, knowledge retrieval, recovery coordination, leadership reflection, continuity guidance, adaptive learning. Supportive NOT directive; does NOT guarantee outcomes.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'scenario_awareness', 'prompt', 'A leadership transition scenario may benefit from review — shall Aipify prepare a preparedness summary for executive consideration?', 'consideration', 'Preparedness not prediction — aggregate themes only'),
      jsonb_build_object('emoji', '🔔', 'key', 'continuity_plan_review', 'prompt', 'Continuity plans are ready for executive review — would you like to see plans requiring approval?', 'consideration', 'Human approval required — no auto-activation'),
      jsonb_build_object('emoji', '🌹', 'key', 'exercise_capture', 'prompt', 'This preparedness exercise may offer organizational insights — shall Aipify scaffold a continuity memory capture for review?', 'consideration', 'Metadata only — cross-link Org Legacy 152'),
      jsonb_build_object('emoji', '❤️', 'key', 'adaptation_pace', 'prompt', 'Adaptation is progressing — would a flexibility summary help coordinate next steps at a sustainable pace?', 'consideration', 'Healthy adaptation pace — cross-link Self Love A.76')
    ),
    'boundary_note', 'Companion supports adaptive continuity visibility — never directs crisis response independently, never guarantees outcomes, never overrides emergency procedures.'
  );
$$;

create or replace function public._oracbp154_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'preparedness_coverage', 'label', 'Preparedness coverage'),
    jsonb_build_object('key', 'scenario_review_rate', 'label', 'Scenario review rate'),
    jsonb_build_object('key', 'leadership_review_completion', 'label', 'Leadership review completion'),
    jsonb_build_object('key', 'continuity_plan_currency', 'label', 'Continuity plan currency'),
    jsonb_build_object('key', 'organizational_flexibility_index', 'label', 'Organizational flexibility awareness'),
    jsonb_build_object('key', 'continuity_memory_capture', 'label', 'Continuity memory capture'),
    jsonb_build_object('key', 'exercise_participation', 'label', 'Exercise participation awareness'),
    jsonb_build_object('key', 'post_disruption_strength', 'label', 'Post-disruption collective strength')
  );
$$;

create or replace function public._oracbp154_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses adaptive continuity patterns internally — aggregate organizational metadata, governed preparedness reviews, and transparent continuity learning. No fear framing. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._oracbp154_privacy_note()
returns text language sql immutable as $$
  select 'Legacy & Future Stewardship Phase 154 — aggregate counts and summary metadata only. No PII, no employee surveillance, no fear-based framing, no guaranteed outcomes. Humans accountable; Aipify scaffolds adaptive continuity preparedness.';
$$;

create or replace function public._oracbp154_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Preparedness, flexibility, and collective strength — not fear or rigid control.',
    'Resilience is moving through disruption together.',
    'People First. Wisdom before speed.',
    'Humans lead decisions; companions support preparedness.',
    'Adapt with clarity — uncertainty acknowledged honestly.'
  );
$$;

create or replace function public._oracbp154_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_phase136 jsonb;
  v_active_plans int := 0;
  v_scenarios int := 0;
  v_leadership_reviews int := 0;
  v_memory_entries int := 0;
begin
  v_phase136 := public._shobp136_engagement_summary(p_organization_id);

  select count(*) into v_active_plans
  from public.adaptive_continuity_plans
  where organization_id = p_organization_id and status in ('active', 'approved', 'review');

  select count(*) into v_scenarios
  from public.adaptive_continuity_scenarios
  where organization_id = p_organization_id and preparedness_level in ('developing', 'practiced', 'reviewed');

  select count(*) into v_leadership_reviews
  from public.adaptive_continuity_leadership_reviews
  where organization_id = p_organization_id and preparedness_level in ('review', 'completed');

  select count(*) into v_memory_entries
  from public.adaptive_continuity_memory
  where organization_id = p_organization_id and status in ('review', 'approved');

  return v_phase136 || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._oracbp154_objectives()),
    'resilience_center_capabilities', jsonb_array_length(public._oracbp154_resilience_center()),
    'adaptive_continuity_areas', jsonb_array_length(public._oracbp154_adaptive_continuity_engine()),
    'scenario_preparedness_types', jsonb_array_length(public._oracbp154_scenario_preparedness_engine()),
    'leadership_resilience_review_areas', jsonb_array_length(public._oracbp154_leadership_resilience_reviews()),
    'resilience_companion_supports', jsonb_array_length(public._oracbp154_resilience_companion()),
    'organizational_flexibility_areas', jsonb_array_length(public._oracbp154_organizational_flexibility_engine()),
    'employee_support_areas', jsonb_array_length(public._oracbp154_employee_support_framework()),
    'continuity_memory_types', jsonb_array_length(public._oracbp154_continuity_memory_engine()),
    'companion_limitations_count', jsonb_array_length(public._oracbp154_companion_limitations()),
    'security_requirements_count', jsonb_array_length(public._oracbp154_security_requirements()),
    'integration_links_count', jsonb_array_length(public._oracbp154_integration_links()),
    'success_metrics_count', jsonb_array_length(public._oracbp154_success_metrics()),
    'phase154_active_plans', v_active_plans,
    'phase154_prepared_scenarios', v_scenarios,
    'phase154_leadership_reviews', v_leadership_reviews,
    'phase154_continuity_memory', v_memory_entries,
    'privacy_note', public._oracbp154_privacy_note()
  );
end; $$;

create or replace function public._oracbp154_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_plans int := 0;
  v_scenarios int := 0;
begin
  v_engagement := public._oracbp154_engagement_summary(p_organization_id);
  v_plans := coalesce((v_engagement->>'phase154_active_plans')::int, 0);
  v_scenarios := coalesce((v_engagement->>'phase154_prepared_scenarios')::int, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Legacy & Future Stewardship objectives documented', 'met', jsonb_array_length(public._oracbp154_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'resilience_center', 'label', 'Resilience Center — ten capabilities extending Phase 128', 'met', jsonb_array_length(public._oracbp154_resilience_center()) = 10, 'note', 'Extends Phase 128 — does not replace'),
    jsonb_build_object('key', 'adaptive_continuity_engine', 'label', 'Adaptive continuity engine — seven areas', 'met', jsonb_array_length(public._oracbp154_adaptive_continuity_engine()) = 7, 'note', null),
    jsonb_build_object('key', 'scenario_preparedness', 'label', 'Scenario preparedness engine — seven scenario types', 'met', jsonb_array_length(public._oracbp154_scenario_preparedness_engine()) = 7, 'note', 'Preparedness scaffolds — not prediction'),
    jsonb_build_object('key', 'leadership_resilience_reviews', 'label', 'Leadership resilience reviews — five areas', 'met', jsonb_array_length(public._oracbp154_leadership_resilience_reviews()) = 5, 'note', 'Aggregate only — not individual scoring'),
    jsonb_build_object('key', 'resilience_companion', 'label', 'Resilience Companion — six supports (does NOT guarantee outcomes)', 'met', jsonb_array_length(public._oracbp154_resilience_companion()) = 6, 'note', null),
    jsonb_build_object('key', 'organizational_flexibility', 'label', 'Organizational flexibility engine — six areas', 'met', jsonb_array_length(public._oracbp154_organizational_flexibility_engine()) = 6, 'note', 'Growth Partner — never Affiliate'),
    jsonb_build_object('key', 'employee_support', 'label', 'Employee support framework — six areas (NOT surveillance)', 'met', jsonb_array_length(public._oracbp154_employee_support_framework()) = 6, 'note', 'Organizational support only'),
    jsonb_build_object('key', 'continuity_memory', 'label', 'Continuity memory engine — six memory types', 'met', jsonb_array_length(public._oracbp154_continuity_memory_engine()) = 6, 'note', 'Cross-link Org Legacy 152 and Decision Heritage 153'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._oracbp154_companion_limitations()) = 5, 'note', 'No guarantee outcomes, no override emergency'),
    jsonb_build_object('key', 'security_requirements', 'label', 'Security requirements — six documented', 'met', jsonb_array_length(public._oracbp154_security_requirements()) = 6, 'note', 'RBAC + audit trails + 2FA cross-link'),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory integration links documented', 'met', jsonb_array_length(public._oracbp154_integration_links()) >= 13, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._oracbp154_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase136_preserved', 'label', 'Blueprint Phase 136 _shobp136_* fields preserved', 'met', jsonb_array_length(public._shobp136_objectives()) = 8, 'note', 'Phase 154 layers on Phase 136 — does not replace.'),
    jsonb_build_object('key', 'adaptive_continuity_operational', 'label', 'Continuity plans or scenario preparedness seeded', 'met', v_plans >= 1 or v_scenarios >= 1, 'note', case when v_plans < 1 and v_scenarios < 1 then 'Approve continuity plans or record scenario preparedness to validate workflow.' else null end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 154 vs Phase 80 Continuity / Phase 136 self-healing distinction documented', 'met', position('Phase 80' in public._oracbp154_distinction_note()) > 0 and position('Phase 136' in public._oracbp154_distinction_note()) > 0, 'note', public._oracbp154_distinction_note())
  );
end; $$;

create or replace function public._oracbp154_blueprint_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '154',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE154_ORGANIZATIONAL_RESILIENCE_ADAPTIVE_CONTINUITY.md',
    'spec_doc', 'ORGANIZATIONAL_RESILIENCE_ADAPTIVE_CONTINUITY_ENGINE_PHASE154.md',
    'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
    'era', 'Legacy & Future Stewardship Era (151–160)',
    'route', '/app/organizational-resilience-engine',
    'distinction_note', public._oracbp154_distinction_note(),
    'mission', public._oracbp154_mission(),
    'philosophy', public._oracbp154_philosophy(),
    'abos_principle', public._oracbp154_abos_principle(),
    'vision', public._oracbp154_vision(),
    'objectives', public._oracbp154_objectives(),
    'resilience_center', public._oracbp154_resilience_center(),
    'adaptive_continuity_engine', public._oracbp154_adaptive_continuity_engine(),
    'scenario_preparedness_engine', public._oracbp154_scenario_preparedness_engine(),
    'leadership_resilience_reviews', public._oracbp154_leadership_resilience_reviews(),
    'resilience_companion', public._oracbp154_resilience_companion(),
    'organizational_flexibility_engine', public._oracbp154_organizational_flexibility_engine(),
    'employee_support_framework', public._oracbp154_employee_support_framework(),
    'continuity_memory_engine', public._oracbp154_continuity_memory_engine(),
    'companion_limitations', public._oracbp154_companion_limitations(),
    'self_love_connection', public._oracbp154_self_love_connection(),
    'security_requirements', public._oracbp154_security_requirements(),
    'integration_links', public._oracbp154_integration_links(),
    'limitation_principles', public._oracbp154_limitation_principles(),
    'companion_adaptation', public._oracbp154_companion_adaptation(),
    'success_metrics', public._oracbp154_success_metrics(),
    'success_criteria', public._oracbp154_success_criteria(p_organization_id),
    'engagement_summary', public._oracbp154_engagement_summary(p_organization_id),
    'dogfooding', public._oracbp154_dogfooding(),
    'vision_phrases', public._oracbp154_vision_phrases(),
    'privacy_note', public._oracbp154_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin record RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_adaptive_continuity_scenario(
  p_scenario_key text,
  p_scenario_type text,
  p_scenario_title text,
  p_preparedness_level text default 'exploring',
  p_summary_metadata jsonb default '{"metadata_only":true}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.adaptive_continuity_scenarios; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if coalesce(trim(p_scenario_key), '') = '' then raise exception 'Scenario key required'; end if;
  if coalesce(trim(p_scenario_title), '') = '' then raise exception 'Scenario title required'; end if;
  if p_scenario_type not in (
    'leadership_change', 'economic_downturn', 'rapid_growth', 'technology_disruption',
    'operational_incident', 'knowledge_loss', 'global_market_change'
  ) then
    raise exception 'Invalid scenario type';
  end if;

  insert into public.adaptive_continuity_scenarios (
    organization_id, scenario_key, scenario_type, scenario_title,
    preparedness_level, summary_metadata, recorded_by
  )
  values (
    v_org_id, left(trim(p_scenario_key), 100), p_scenario_type, left(trim(p_scenario_title), 200),
    coalesce(p_preparedness_level, 'exploring'),
    coalesce(p_summary_metadata, '{"metadata_only":true}'::jsonb), v_user_id
  )
  on conflict (organization_id, scenario_key) do update set
    scenario_type = excluded.scenario_type,
    scenario_title = excluded.scenario_title,
    preparedness_level = excluded.preparedness_level,
    summary_metadata = excluded.summary_metadata,
    recorded_by = excluded.recorded_by,
    updated_at = now()
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'adaptive_continuity_scenario_recorded', 'adaptive_continuity_scenario', v_row.id,
    jsonb_build_object('scenario_type', v_row.scenario_type, 'preparedness_level', v_row.preparedness_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_leadership_resilience_review(
  p_review_key text,
  p_review_title text,
  p_preparedness_level text default 'draft',
  p_likely_disruptions jsonb default '[]'::jsonb,
  p_vulnerabilities_summary text default null,
  p_strengths_summary text default null,
  p_summary_metadata jsonb default '{"metadata_only":true,"not_individual_scoring":true}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.adaptive_continuity_leadership_reviews; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if coalesce(trim(p_review_key), '') = '' then raise exception 'Review key required'; end if;
  if coalesce(trim(p_review_title), '') = '' then raise exception 'Review title required'; end if;

  insert into public.adaptive_continuity_leadership_reviews (
    organization_id, review_key, review_title, preparedness_level,
    likely_disruptions, vulnerabilities_summary, strengths_summary,
    summary_metadata, recorded_by
  )
  values (
    v_org_id, left(trim(p_review_key), 100), left(trim(p_review_title), 200),
    coalesce(p_preparedness_level, 'draft'),
    coalesce(p_likely_disruptions, '[]'::jsonb),
    p_vulnerabilities_summary, p_strengths_summary,
    coalesce(p_summary_metadata, '{"metadata_only":true,"not_individual_scoring":true}'::jsonb),
    v_user_id
  )
  on conflict (organization_id, review_key) do update set
    review_title = excluded.review_title,
    preparedness_level = excluded.preparedness_level,
    likely_disruptions = excluded.likely_disruptions,
    vulnerabilities_summary = excluded.vulnerabilities_summary,
    strengths_summary = excluded.strengths_summary,
    summary_metadata = excluded.summary_metadata,
    recorded_by = excluded.recorded_by,
    updated_at = now()
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'leadership_resilience_review_recorded', 'adaptive_continuity_leadership_review', v_row.id,
    jsonb_build_object('preparedness_level', v_row.preparedness_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_continuity_memory_entry(
  p_memory_key text,
  p_memory_type text,
  p_memory_title text,
  p_status text default 'draft',
  p_summary_metadata jsonb default '{"metadata_only":true}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.adaptive_continuity_memory; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if coalesce(trim(p_memory_key), '') = '' then raise exception 'Memory key required'; end if;
  if coalesce(trim(p_memory_title), '') = '' then raise exception 'Memory title required'; end if;
  if p_memory_type not in (
    'preparedness_exercise', 'recovery_lesson', 'leadership_reflection',
    'operational_insight', 'governance_adjustment', 'knowledge_contribution'
  ) then
    raise exception 'Invalid memory type';
  end if;

  insert into public.adaptive_continuity_memory (
    organization_id, memory_key, memory_type, memory_title, status, summary_metadata, recorded_by
  )
  values (
    v_org_id, left(trim(p_memory_key), 100), p_memory_type, left(trim(p_memory_title), 200),
    coalesce(p_status, 'draft'),
    coalesce(p_summary_metadata, '{"metadata_only":true}'::jsonb), v_user_id
  )
  on conflict (organization_id, memory_key) do update set
    memory_type = excluded.memory_type,
    memory_title = excluded.memory_title,
    status = excluded.status,
    summary_metadata = excluded.summary_metadata,
    recorded_by = excluded.recorded_by,
    updated_at = now()
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'continuity_memory_entry_recorded', 'adaptive_continuity_memory', v_row.id,
    jsonb_build_object('memory_type', v_row.memory_type, 'status', v_row.status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._oracbp154_distinction_note() to authenticated;
grant execute on function public._oracbp154_mission() to authenticated;
grant execute on function public._oracbp154_philosophy() to authenticated;
grant execute on function public._oracbp154_abos_principle() to authenticated;
grant execute on function public._oracbp154_vision() to authenticated;
grant execute on function public._oracbp154_objectives() to authenticated;
grant execute on function public._oracbp154_resilience_center() to authenticated;
grant execute on function public._oracbp154_adaptive_continuity_engine() to authenticated;
grant execute on function public._oracbp154_scenario_preparedness_engine() to authenticated;
grant execute on function public._oracbp154_leadership_resilience_reviews() to authenticated;
grant execute on function public._oracbp154_resilience_companion() to authenticated;
grant execute on function public._oracbp154_organizational_flexibility_engine() to authenticated;
grant execute on function public._oracbp154_employee_support_framework() to authenticated;
grant execute on function public._oracbp154_continuity_memory_engine() to authenticated;
grant execute on function public._oracbp154_companion_limitations() to authenticated;
grant execute on function public._oracbp154_self_love_connection() to authenticated;
grant execute on function public._oracbp154_security_requirements() to authenticated;
grant execute on function public._oracbp154_integration_links() to authenticated;
grant execute on function public._oracbp154_limitation_principles() to authenticated;
grant execute on function public._oracbp154_companion_adaptation() to authenticated;
grant execute on function public._oracbp154_success_metrics() to authenticated;
grant execute on function public._oracbp154_dogfooding() to authenticated;
grant execute on function public._oracbp154_privacy_note() to authenticated;
grant execute on function public._oracbp154_vision_phrases() to authenticated;
grant execute on function public._oracbp154_engagement_summary(uuid) to authenticated;
grant execute on function public._oracbp154_success_criteria(uuid) to authenticated;
grant execute on function public._oracbp154_blueprint_block(uuid) to authenticated;
grant execute on function public.record_adaptive_continuity_scenario(text, text, text, text, jsonb) to authenticated;
grant execute on function public.record_leadership_resilience_review(text, text, text, jsonb, text, text, jsonb) to authenticated;
grant execute on function public.record_continuity_memory_entry(text, text, text, text, jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-resilience-adaptive-continuity-blueprint-phase154',
  'Organizational Resilience & Adaptive Continuity Engine (Legacy & Future Stewardship Phase 154)',
  'Organizational Resilience & Adaptive Continuity Engine — extends Organizational Resilience A.50 + Phases 81, 91, 128, 136 with adaptive continuity preparedness, scenario scaffolds, leadership resilience reviews, and organizational flexibility. Preparedness not fear. No employee surveillance.',
  'authenticated', 154
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-resilience-adaptive-continuity-blueprint-phase154' and tenant_id is null
);

-- 5. Dashboard RPC — preserve ALL A.50 + Phase 81 + Phase 91 + Phase 128 + Phase 136 fields; append Phase 154
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resilience.view');
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);
  perform public._shobp136_seed(v_org_id);
  perform public._oracbp154_seed(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'purpose', 'Help organizations remain stable, adaptive, and effective during disruption, uncertainty, and crisis.',
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'principles', jsonb_build_array(
      'Preparedness',
      'Operational continuity',
      'Role clarity',
      'Structured recovery',
      'Continuous learning',
      'Audit accountability'
    ),
    'resilience_dimensions', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational',
        'examples', jsonb_build_array(
          'Critical process continuity and fallback procedures',
          'Service recovery priorities during disruption',
          'Integration and workflow redundancy'
        )
      ),
      jsonb_build_object(
        'key', 'knowledge',
        'label', 'Knowledge',
        'examples', jsonb_build_array(
          'Documented procedures and approved playbooks',
          'Role clarity and escalation paths',
          'Institutional memory capture after events'
        )
      ),
      jsonb_build_object(
        'key', 'human',
        'label', 'Human',
        'examples', jsonb_build_array(
          'Team capacity and backup role assignments',
          'Recovery periods after intense response',
          'Sustainable workload during prolonged disruption'
        )
      ),
      jsonb_build_object(
        'key', 'customer',
        'label', 'Customer',
        'examples', jsonb_build_array(
          'Communication during disruption',
          'Service expectations and status transparency',
          'Coordinated customer-facing updates'
        )
      ),
      jsonb_build_object(
        'key', 'strategic',
        'label', 'Strategic',
        'examples', jsonb_build_array(
          'Priority decisions during crisis',
          'Adaptation choices under uncertainty',
          'Long-term recovery and capability rebuilding'
        )
      )
    ),
    'crisis_support_guidance', 'During disruption, Aipify surfaces relevant information, approved procedures, and clear next steps — coordinating response while humans lead decisions.',
    'crisis_examples', jsonb_build_array(
      'Here is what we know and what we are doing next.',
      'These are the approved procedures for this scenario.',
      'Human leadership retains decision authority — Aipify coordinates and informs.',
      'Roles and escalation paths are visible — reducing confusion during uncertainty.'
    ),
    'self_love_note', 'Self Love (A.76) supports recovery periods, overload detection, post-event reflection, celebrating progress, and sustainable adjustments — never pressure or guilt during crisis recovery.',
    'growth_evolution_note', 'Growth & Evolution (A.81) integrates post-adversity lessons learned, improvements, capabilities strengthened, and wisdom from difficulty — at /app/growth-evolution-engine.',
    'trust_engine_note', 'Trust Engine (Phase 76) provides calm, transparent, honest communication during uncertainty — explainability at /app/trust.',
    'continuity_phase80_note', 'Continuity, Resilience & Crisis (Phase 80) at /app/continuity handles backup ownership, incident mode, readiness score, and crisis briefings — complements A.50 scenario planning.',
    'distinction_note', 'ABOS Resilience Engine maps to Organizational Resilience Engine A.50 at /app/organizational-resilience-engine — not a new route. Distinct from Phase 80 Continuity (/app/continuity), Organizational Health A.56 (/app/organizational-health-engine), and Growth & Evolution A.81 (/app/growth-evolution-engine).',
    'integration_links', jsonb_build_array(
      jsonb_build_object(
        'label', 'Continuity, Resilience & Crisis (Phase 80)',
        'route', '/app/continuity',
        'description', 'Backup ownership, incident mode, readiness score — complements scenario planning.'
      ),
      jsonb_build_object(
        'label', 'Growth & Evolution Engine (A.81)',
        'route', '/app/growth-evolution-engine',
        'description', 'Post-adversity learning cycles, lessons learned, and capability strengthening.'
      ),
      jsonb_build_object(
        'label', 'Trust Engine (Phase 76)',
        'route', '/app/trust',
        'description', 'Calm, transparent, honest communication during uncertainty.'
      ),
      jsonb_build_object(
        'label', 'Organizational Health (A.56)',
        'route', '/app/organizational-health-engine',
        'description', 'Aggregate health indicators — distinct from resilience planning.'
      ),
      jsonb_build_object(
        'label', 'Incident Response Coordination (A.51)',
        'route', '/app/incident-response-coordination-engine',
        'description', 'Coordinated incident response with ownership and escalation.'
      )
    ),
    'summary', jsonb_build_object(
      'total_plans', coalesce((
        select count(*) from public.resilience_plans where organization_id = v_org_id
      ), 0),
      'active_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'draft_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'open_vulnerabilities', coalesce((
        select count(*) from public.resilience_vulnerabilities
        where organization_id = v_org_id and status in ('open', 'mitigating')
      ), 0),
      'completed_simulations', coalesce((
        select count(*) from public.resilience_simulations
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'under_review'
      ), 0)
    ),
    'plans', coalesce((
      select jsonb_agg(row_to_json(rp) order by rp.created_at desc)
      from public.resilience_plans rp where rp.organization_id = v_org_id
    ), '[]'::jsonb),
    'simulations', coalesce((
      select jsonb_agg(row_to_json(rs) order by rs.created_at desc)
      from public.resilience_simulations rs where rs.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'vulnerabilities', coalesce((
      select jsonb_agg(row_to_json(rv) order by rv.created_at desc)
      from public.resilience_vulnerabilities rv where rv.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(rr) order by rr.review_date desc)
      from public.resilience_reviews rr where rr.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ore_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'security_trust', 'Extends Security & Trust (A.18) with vulnerability tracking',
      'operations_center', 'Aligns with Operations Center Foundation (A.32) event context',
      'executive_insights', 'Executive summary via get_resilience_executive_summary() — A.35',
      'organizational_memory', 'Review completion may capture lessons learned — metadata only (A.34)',
      'continuous_improvement', 'Findings scaffold improvement workflow (A.33)'
    ),
    'integration_summaries', jsonb_build_object(
      'security', public._ore_security_summary(v_org_id),
      'operations', public._ore_operations_summary(v_org_id),
      'memory', public._ore_memory_summary(v_org_id),
      'improvement', public._ore_improvement_summary(v_org_id)
    ),
    'implementation_blueprint_phase81', jsonb_build_object(
      'phase', 'Phase 81 — Risk Navigation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_NAVIGATION.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'ABOS Blueprint Phase 81 extends A.50 with risk awareness, preparedness planning, balanced decision-making, companion guidance, limitation principles, and live success criteria. Distinct from Strategic Intelligence repo Phase 81 at /app/strategy (phase number collision).'
    ),
    'risk_navigation_engine_note', 'Risk Navigation Engine (ABOS Phase 81) — navigate uncertainty with preparedness not alarm; strengthens resilience through balanced risk awareness and confident decision-making.',
    'blueprint_distinction_note', public._rnbp_distinction_note(),
    'blueprint_mission', public._rnbp_mission(),
    'blueprint_philosophy', public._rnbp_philosophy(),
    'blueprint_abos_principle', public._rnbp_abos_principle(),
    'blueprint_objectives', public._rnbp_objectives(),
    'risk_categories', public._rnbp_risk_categories(),
    'risk_questions', public._rnbp_risk_questions(),
    'companion_guidance', public._rnbp_companion_guidance(),
    'risk_preparedness', public._rnbp_risk_preparedness(),
    'risk_opportunity_balance', public._rnbp_risk_opportunity_balance(),
    'leadership_insights', public._rnbp_leadership_insights(),
    'blueprint_self_love_connection', public._rnbp_self_love_connection(),
    'blueprint_trust_connection', public._rnbp_trust_connection(),
    'limitation_principles', public._rnbp_limitation_principles(),
    'blueprint_dogfooding', public._rnbp_dogfooding(),
    'blueprint_integration_links', public._rnbp_integration_links(),
    'engagement_summary', public._rnbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._rnbp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._rnbp_vision_phrases(),
    'blueprint_privacy_note', 'Risk navigation and Phase 81 blueprint data is metadata only — plan, vulnerability, and simulation counts. No fear-based copy, no PII, no punitive individual scoring. Humans decide; Aipify informs and prepares.',
    'implementation_blueprint_phase91', jsonb_build_object(
      'phase', 'Phase 91 — Organizational Resilience & Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE91_ORGANIZATIONAL_RESILIENCE_RECOVERY.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'ABOS Blueprint Phase 91 extends A.50 + Phase 81 with recovery focus, adversity learning, and hope-strengthening guidance. Distinct from Partner Certification repo Phase 91 and Dedication A.91.'
    ),
    'recovery_engine_note', 'Organizational Resilience & Recovery Engine (ABOS Phase 91) — prepare, respond, recover, and learn through adversity with hope-strengthening guidance — never toxic positivity.',
    'organizational_resilience_recovery_blueprint', public._orrbp91_recovery_blueprint_block(v_org_id),
    'recovery_distinction_note', public._orrbp91_distinction_note(),
    'recovery_mission', public._orrbp91_mission(),
    'recovery_philosophy', public._orrbp91_philosophy(),
    'recovery_abos_principle', public._orrbp91_abos_principle(),
    'recovery_objectives', public._orrbp91_objectives(),
    'recovery_resilience_questions', public._orrbp91_resilience_questions(),
    'recovery_resilience_domains', public._orrbp91_resilience_domains(),
    'recovery_companion_guidance', public._orrbp91_companion_guidance(),
    'recovery_reflection', public._orrbp91_recovery_reflection(),
    'recovery_learning_through_adversity', public._orrbp91_learning_through_adversity(),
    'recovery_leadership_insights', public._orrbp91_leadership_insights(),
    'recovery_self_love_connection', public._orrbp91_self_love_connection(),
    'recovery_trust_connection', public._orrbp91_trust_connection(),
    'recovery_limitation_principles', public._orrbp91_limitation_principles(),
    'recovery_dogfooding', public._orrbp91_dogfooding(),
    'recovery_integration_links', public._orrbp91_integration_links(),
    'recovery_engagement_summary', public._orrbp91_engagement_summary(v_org_id),
    'recovery_success_criteria', public._orrbp91_success_criteria(v_org_id),
    'recovery_vision', public._orrbp91_vision(),
    'recovery_vision_phrases', public._orrbp91_vision_phrases(),
    'recovery_privacy_note', 'Recovery blueprint data is metadata only — no toxic positivity, no PII, no wellbeing content. Humans decide pace; Aipify informs and supports.',
    'implementation_blueprint_phase128', jsonb_build_object(
      'phase', 'Phase 128 — Resilience & Continuity Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE128_RESILIENCE_CONTINUITY_COMPANION.md',
      'spec_doc', 'RESILIENCE_CONTINUITY_COMPANION_ENGINE_PHASE128.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'Enterprise Intelligence Phase 128 extends A.50 + Phase 81 + Phase 91 with continuity companion, business continuity orchestration, dependency protection, and resilience exercises. Distinct from Continuity Phase 80 crisis layer.'
    ),
    'continuity_companion_engine_note', 'Resilience & Continuity Companion Engine (Enterprise Intelligence Phase 128) — prepare, adapt, and recover together with continuity planning, dependency visibility, and recovery orchestration — readiness not command.',
    'resilience_continuity_companion_blueprint', public._rccbp128_blueprint_block(v_org_id),
    'continuity_companion_distinction_note', public._rccbp128_distinction_note(),
    'continuity_companion_mission', public._rccbp128_mission(),
    'continuity_companion_philosophy', public._rccbp128_philosophy(),
    'continuity_companion_abos_principle', public._rccbp128_abos_principle(),
    'continuity_companion_vision', public._rccbp128_vision(),
    'continuity_companion_objectives', public._rccbp128_objectives(),
    'resilience_center', public._rccbp128_resilience_center(),
    'business_continuity_engine', public._rccbp128_business_continuity_engine(),
    'resilience_assessment', public._rccbp128_resilience_assessment(),
    'dependency_protection', public._rccbp128_dependency_protection(),
    'recovery_orchestration', public._rccbp128_recovery_orchestration(),
    'resilience_companion_supports', public._rccbp128_resilience_companion(),
    'leadership_continuity_supports', public._rccbp128_leadership_continuity(),
    'resilience_exercise_framework', public._rccbp128_resilience_exercise_framework(),
    'continuity_companion_limitations', public._rccbp128_companion_limitations(),
    'continuity_self_love_connection', public._rccbp128_self_love_connection(),
    'continuity_knowledge_library', public._rccbp128_continuity_knowledge_library(),
    'continuity_companion_cross_links', public._rccbp128_cross_links(),
    'continuity_companion_limitation_principles', public._rccbp128_limitation_principles(),
    'continuity_companion_adaptation', public._rccbp128_companion_adaptation(),
    'continuity_companion_engagement_summary', public._rccbp128_engagement_summary(v_org_id),
    'continuity_companion_success_criteria', public._rccbp128_success_criteria(v_org_id),
    'continuity_companion_success_metrics', public._rccbp128_success_metrics(),
    'continuity_companion_privacy_note', 'Continuity companion blueprint data is metadata only — no panic framing, no crisis command, no PII. Humans lead; Aipify prepares and supports readiness.',
    'implementation_blueprint_phase136', jsonb_build_object(
      'phase', 'Phase 136 — Self-Healing Operations & Organizational Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE136_SELF_HEALING_OPERATIONS_ORGANIZATIONAL_RECOVERY.md',
      'spec_doc', 'SELF_HEALING_OPERATIONS_ORGANIZATIONAL_RECOVERY_ENGINE_PHASE136.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Autonomous Organization Era (131–140)',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'Autonomous Organization Phase 136 extends A.50 + Phase 81 + Phase 91 + Phase 128 with self-healing operations and organizational recovery — transparent governed recovery, no hidden actions. Distinct from platform ai_self_healing_executions automation layer.'
    ),
    'self_healing_operations_engine_note', 'Self-Healing Operations & Organizational Recovery Engine (Autonomous Organization Phase 136) — detect operational degradation, coordinate transparent recovery, capture lessons learned, and strengthen organizations — humans accountable, companions supportive. No high-risk auto actions.',
    'self_healing_operations_organizational_recovery_blueprint', public._shobp136_blueprint_block(v_org_id),
    'self_healing_distinction_note', public._shobp136_distinction_note(),
    'self_healing_mission', public._shobp136_mission(),
    'self_healing_philosophy', public._shobp136_philosophy(),
    'self_healing_abos_principle', public._shobp136_abos_principle(),
    'self_healing_vision', public._shobp136_vision(),
    'self_healing_objectives', public._shobp136_objectives(),
    'self_healing_operations_center', public._shobp136_self_healing_operations_center(),
    'operational_health_engine', public._shobp136_operational_health_engine(),
    'recovery_detection_engine', public._shobp136_recovery_detection_engine(),
    'self_healing_framework', public._shobp136_self_healing_framework(),
    'recovery_companion_supports', public._shobp136_recovery_companion(),
    'incident_learning_engine', public._shobp136_incident_learning_engine(),
    'recovery_orchestration_engine', public._shobp136_recovery_orchestration_engine(),
    'organizational_healing_principles', public._shobp136_organizational_healing_principles(),
    'self_healing_companion_limitations', public._shobp136_companion_limitations(),
    'self_healing_self_love_connection', public._shobp136_self_love_connection(),
    'self_healing_security_requirements', public._shobp136_security_requirements(),
    'self_healing_integration_links', public._shobp136_integration_links(),
    'self_healing_limitation_principles', public._shobp136_limitation_principles(),
    'self_healing_companion_adaptation', public._shobp136_companion_adaptation(),
    'self_healing_engagement_summary', public._shobp136_engagement_summary(v_org_id),
    'self_healing_success_criteria', public._shobp136_success_criteria(v_org_id),
    'self_healing_success_metrics', public._shobp136_success_metrics(),
    'self_healing_vision_phrases', public._shobp136_vision_phrases(),
    'self_healing_dogfooding', public._shobp136_dogfooding(),
    'self_healing_recovery_events', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.self_healing_recovery_events e where e.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'self_healing_incident_learnings', coalesce((
      select jsonb_agg(row_to_json(l) order by l.created_at desc)
      from public.self_healing_incident_learnings l where l.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'self_healing_recovery_recommendations', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from public.self_healing_recovery_recommendations r where r.organization_id = v_org_id limit 20
    ), '[]'::jsonb),

    'implementation_blueprint_phase154', jsonb_build_object(
      'phase', 'Phase 154 — Organizational Resilience & Adaptive Continuity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE154_ORGANIZATIONAL_RESILIENCE_ADAPTIVE_CONTINUITY.md',
      'spec_doc', 'ORGANIZATIONAL_RESILIENCE_ADAPTIVE_CONTINUITY_ENGINE_PHASE154.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'Legacy era Phase 154 extends A.50 + Phase 81 + Phase 91 + Phase 128 + Phase 136 with adaptive continuity depth — preparedness and flexibility, not fear or rigid control. Distinct from Continuity Phase 80 crisis layer.'
    ),
    'adaptive_continuity_engine_note', 'Organizational Resilience & Adaptive Continuity Engine (Legacy & Future Stewardship Phase 154) — adaptive continuity planning, scenario preparedness, leadership readiness reviews, and continuity memory — preparedness NOT surveillance; resilience is moving through disruption together.',
    'organizational_resilience_adaptive_continuity_blueprint', public._oracbp154_blueprint_block(v_org_id),
    'adaptive_continuity_distinction_note', public._oracbp154_distinction_note(),
    'adaptive_continuity_mission', public._oracbp154_mission(),
    'adaptive_continuity_philosophy', public._oracbp154_philosophy(),
    'adaptive_continuity_abos_principle', public._oracbp154_abos_principle(),
    'adaptive_continuity_vision', public._oracbp154_vision(),
    'adaptive_continuity_objectives', public._oracbp154_objectives(),
    'adaptive_resilience_center', public._oracbp154_resilience_center(),
    'adaptive_continuity_engine', public._oracbp154_adaptive_continuity_engine(),
    'scenario_preparedness_engine', public._oracbp154_scenario_preparedness_engine(),
    'leadership_resilience_reviews', public._oracbp154_leadership_resilience_reviews(),
    'adaptive_resilience_companion', public._oracbp154_resilience_companion(),
    'organizational_flexibility_engine', public._oracbp154_organizational_flexibility_engine(),
    'employee_support_framework', public._oracbp154_employee_support_framework(),
    'continuity_memory_engine', public._oracbp154_continuity_memory_engine(),
    'adaptive_companion_limitations', public._oracbp154_companion_limitations(),
    'adaptive_continuity_self_love_connection', public._oracbp154_self_love_connection(),
    'adaptive_continuity_security_requirements', public._oracbp154_security_requirements(),
    'adaptive_continuity_integration_links', public._oracbp154_integration_links(),
    'adaptive_continuity_limitation_principles', public._oracbp154_limitation_principles(),
    'adaptive_continuity_companion_adaptation', public._oracbp154_companion_adaptation(),
    'adaptive_continuity_engagement_summary', public._oracbp154_engagement_summary(v_org_id),
    'adaptive_continuity_success_criteria', public._oracbp154_success_criteria(v_org_id),
    'adaptive_continuity_success_metrics', public._oracbp154_success_metrics(),
    'adaptive_continuity_vision_phrases', public._oracbp154_vision_phrases(),
    'adaptive_continuity_dogfooding', public._oracbp154_dogfooding(),
    'adaptive_continuity_plans', coalesce((
      select jsonb_agg(row_to_json(p) order by p.created_at desc)
      from public.adaptive_continuity_plans p where p.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'adaptive_continuity_scenarios', coalesce((
      select jsonb_agg(row_to_json(s) order by s.created_at desc)
      from public.adaptive_continuity_scenarios s where s.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'adaptive_continuity_leadership_review_records', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from public.adaptive_continuity_leadership_reviews r where r.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'adaptive_continuity_memory_entries', coalesce((
      select jsonb_agg(row_to_json(m) order by m.created_at desc)
      from public.adaptive_continuity_memory m where m.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'self_healing_privacy_note', public._shobp136_privacy_note(),
    'adaptive_continuity_privacy_note', public._oracbp154_privacy_note()

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- 6. Card RPC — preserve A.50 + Phase 81 + Phase 91 + Phase 128 + Phase 136 fields; append Phase 154
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);
  perform public._shobp136_seed(v_org_id);
  perform public._oracbp154_seed(v_org_id);
  v_engagement := public._rnbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = v_org_id and status in ('open', 'mitigating')
    ), 0),
    'implementation_blueprint_phase81', jsonb_build_object(
      'phase', 'Phase 81 — Risk Navigation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_NAVIGATION.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine'
    ),
    'blueprint_mission', public._rnbp_mission(),
    'blueprint_abos_principle', public._rnbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Risk Navigation Engine (ABOS Phase 81) — risk awareness, preparedness planning, and balanced decision-making with preparedness not alarm.',
    'preparedness_note', 'Preparedness not alarm — uncertainty navigable with wisdom, courage, and preparation.',
    'implementation_blueprint_phase91', jsonb_build_object(
      'phase', 'Phase 91 — Organizational Resilience & Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE91_ORGANIZATIONAL_RESILIENCE_RECOVERY.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine'
    ),
    'recovery_mission', public._orrbp91_mission(),
    'recovery_abos_principle', public._orrbp91_abos_principle(),
    'recovery_engagement_summary', public._orrbp91_engagement_summary(v_org_id),
    'recovery_note', 'Organizational Resilience & Recovery Engine (ABOS Phase 91) — recovery, adversity learning, and hope-strengthening with honest acknowledgment.',
    'recovery_vision_note', 'We faced difficult circumstances, but we emerged wiser, stronger and more connected.',
    'implementation_blueprint_phase128', jsonb_build_object(
      'phase', 'Phase 128 — Resilience & Continuity Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE128_RESILIENCE_CONTINUITY_COMPANION.md',
      'spec_doc', 'RESILIENCE_CONTINUITY_COMPANION_ENGINE_PHASE128.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-resilience-engine'
    ),
    'continuity_companion_mission', public._rccbp128_mission(),
    'continuity_companion_abos_principle', public._rccbp128_abos_principle(),
    'continuity_companion_engagement_summary', public._rccbp128_engagement_summary(v_org_id),
    'continuity_companion_note', 'Resilience & Continuity Companion Engine (Enterprise Intelligence Phase 128) — prepare, adapt, and recover together with readiness not command.',
    'continuity_companion_vision_note', 'When disruption arrives, the organization is prepared — dependencies visible, roles clear, recovery coordinated.',
    'implementation_blueprint_phase136', jsonb_build_object(
      'phase', 'Phase 136 — Self-Healing Operations & Organizational Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE136_SELF_HEALING_OPERATIONS_ORGANIZATIONAL_RECOVERY.md',
      'spec_doc', 'SELF_HEALING_OPERATIONS_ORGANIZATIONAL_RECOVERY_ENGINE_PHASE136.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Autonomous Organization Era (131–140)',
      'route', '/app/organizational-resilience-engine'
    ),
    'self_healing_mission', public._shobp136_mission(),
    'self_healing_abos_principle', public._shobp136_abos_principle(),
    'self_healing_engagement_summary', public._shobp136_engagement_summary(v_org_id),
    'self_healing_note', 'Self-Healing Operations & Organizational Recovery Engine (Autonomous Organization Phase 136) — transparent governed recovery that strengthens organizations — not merely return to normal.',
    'self_healing_vision_note', 'Recovery strengthens organizations — People First. Wisdom before speed. Humans accountable; companions supportive.',
    'implementation_blueprint_phase154', jsonb_build_object(
      'phase', 'Phase 154 — Organizational Resilience & Adaptive Continuity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE154_ORGANIZATIONAL_RESILIENCE_ADAPTIVE_CONTINUITY.md',
      'spec_doc', 'ORGANIZATIONAL_RESILIENCE_ADAPTIVE_CONTINUITY_ENGINE_PHASE154.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/organizational-resilience-engine'
    ),
    'adaptive_continuity_mission', public._oracbp154_mission(),
    'adaptive_continuity_abos_principle', public._oracbp154_abos_principle(),
    'adaptive_continuity_engagement_summary', public._oracbp154_engagement_summary(v_org_id),
    'adaptive_continuity_note', 'Organizational Resilience & Adaptive Continuity Engine (Legacy & Future Stewardship Phase 154) — preparedness and flexibility, collective strength through disruption — not fear or rigid control.',
    'adaptive_continuity_vision_note', 'When change arrives, the organization adapts together — continuity practiced, leadership prepared, people supported with compassion.',

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;
