-- Implementation Blueprint Phase 136 — Self-Healing Operations & Organizational Recovery Engine
-- Autonomous Organization Era (131–140). Extends Organizational Resilience Engine A.50 + Phase 81 + Phase 91 + Phase 128.
-- Helpers: _shobp136_* (never collide with _ore_*, _rnbp_*, _orrbp91_*, _rccbp128_*).
-- Cross-links Incident Response A.51, Continuity Phase 80, Proactive Organization Phase 135 — do NOT duplicate recovery center.

-- Phase 136 helpers body (included by main migration)

-- ---------------------------------------------------------------------------
-- 1. Optional tables (tenant-scoped, metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.self_healing_recovery_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_type text not null default 'degradation' check (
    event_type in ('degradation', 'recovery', 'detection', 'escalation', 'review')
  ),
  event_title text not null,
  severity text not null default 'moderate' check (
    severity in ('low', 'moderate', 'elevated', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'investigating', 'recovering', 'resolved', 'accepted')
  ),
  summary_metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists self_healing_recovery_events_org_status_idx
  on public.self_healing_recovery_events (organization_id, status, detected_at desc);

alter table public.self_healing_recovery_events enable row level security;
revoke all on public.self_healing_recovery_events from authenticated, anon;

create table if not exists public.self_healing_incident_learnings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recovery_event_id uuid references public.self_healing_recovery_events (id) on delete set null,
  learning_title text not null,
  summary_metadata jsonb not null default '{}'::jsonb,
  governance_note text,
  knowledge_update_ref text,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'archived')
  ),
  captured_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists self_healing_incident_learnings_org_idx
  on public.self_healing_incident_learnings (organization_id, status, created_at desc);

alter table public.self_healing_incident_learnings enable row level security;
revoke all on public.self_healing_incident_learnings from authenticated, anon;

create table if not exists public.self_healing_recovery_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recovery_event_id uuid references public.self_healing_recovery_events (id) on delete set null,
  recommendation_title text not null,
  recommendation_type text not null default 'recovery' check (
    recommendation_type in ('recovery', 'playbook', 'escalation', 'communication', 'knowledge_refresh', 'resource')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'implemented', 'deferred')
  ),
  risk_level int not null default 1 check (risk_level between 0 and 3),
  summary_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists self_healing_recovery_recommendations_org_idx
  on public.self_healing_recovery_recommendations (organization_id, status, created_at desc);

alter table public.self_healing_recovery_recommendations enable row level security;
revoke all on public.self_healing_recovery_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helper
-- ---------------------------------------------------------------------------
create or replace function public._shobp136_seed(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.self_healing_recovery_events where organization_id = p_organization_id limit 1
  ) then
    return;
  end if;

  insert into public.self_healing_recovery_events (
    organization_id, event_type, event_title, severity, status, summary_metadata
  ) values
    (p_organization_id, 'detection', 'Repeated workflow failure pattern detected', 'moderate', 'investigating',
     '{"signal":"workflow_failures","aggregate_only":true}'::jsonb),
    (p_organization_id, 'degradation', 'Support backlog elevation signal', 'elevated', 'open',
     '{"signal":"support_backlog","aggregate_only":true}'::jsonb),
    (p_organization_id, 'recovery', 'Knowledge accessibility restoration in progress', 'low', 'recovering',
     '{"area":"knowledge_accessibility","human_led":true}'::jsonb);

  insert into public.self_healing_recovery_recommendations (
    organization_id, recommendation_title, recommendation_type, status, risk_level, summary_metadata
  ) values
    (p_organization_id, 'Review workflow fallback procedures with team leads', 'playbook', 'pending', 1,
     '{"requires_approval":true,"no_auto_execution":true}'::jsonb),
    (p_organization_id, 'Prepare stakeholder communication scaffold for recovery update', 'communication', 'pending', 1,
     '{"cross_link":"stakeholder_communication_a53"}'::jsonb),
    (p_organization_id, 'Schedule knowledge refresh review for affected procedures', 'knowledge_refresh', 'pending', 2,
     '{"cross_link":"org_memory_126"}'::jsonb),
    (p_organization_id, 'Escalate to incident coordination if severity persists', 'escalation', 'pending', 2,
     '{"cross_link":"incident_response_a51"}'::jsonb);

  insert into public.self_healing_incident_learnings (
    organization_id, learning_title, summary_metadata, governance_note, status
  ) values
    (p_organization_id, 'Cross-team communication gaps during workflow disruption',
     '{"theme":"communication","metadata_only":true}'::jsonb,
     'Governance review recommended — no autonomous policy changes', 'draft');
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers _shobp136_*
-- ---------------------------------------------------------------------------
create or replace function public._shobp136_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Autonomous Organization Phase 136 — Self-Healing Operations & Organizational Recovery Engine at /app/organizational-resilience-engine. Layers on Organizational Resilience Engine A.50 (_ore_*), Blueprint Phase 81 Risk Navigation (_rnbp_*), Phase 91 Recovery (_orrbp91_*), and Phase 128 Continuity Companion (_rccbp128_*). Phase 136 adds transparent governed self-healing operations — operational health monitoring, recovery detection, incident learning, and recovery orchestration with **no hidden actions and no high-risk auto fixes**. **Distinct from Continuity Phase 80** at /app/continuity — crisis continuity distinct layer. **Distinct from Incident Response A.51** at /app/incident-response-coordination-engine — coordinated incident response cross-link only. **Distinct from Proactive Organization Phase 135** at /app/proactive-organization-engine — anticipatory support cross-link only. **Distinct from platform ai_self_healing_executions** — technical automation layer; Phase 136 is organizational recovery with human accountability. Helpers _shobp136_* only. Recovery strengthens organizations — not merely return to normal.';
$$;

create or replace function public._shobp136_mission()
returns text language sql immutable as $$
  select 'Help organizations detect operational degradation early, coordinate transparent recovery, capture lessons learned, and emerge stronger — with humans accountable and companions supportive throughout.';
$$;

create or replace function public._shobp136_philosophy()
returns text language sql immutable as $$
  select 'Recovery strengthens organizations — not merely return to normal. Transparent, governed, human-centered recovery. People First. Wisdom before speed. No unchecked autonomy or hidden actions.';
$$;

create or replace function public._shobp136_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Self-Healing Operations informs, prepares, and coordinates recovery visibility; humans lead decisions, approvals, and accountability. Governed recovery NOT autonomous repair.';
$$;

create or replace function public._shobp136_vision()
returns text language sql immutable as $$
  select 'When disruption degrades operations, the organization sees it early, recovers with transparency, learns with compassion, and builds lasting resilience — together.';
$$;

create or replace function public._shobp136_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational_health', 'label', 'Operational health monitoring', 'emoji', '🔔', 'description', 'Aggregate operational health signals — workflow, companion, knowledge, support capacity'),
    jsonb_build_object('key', 'early_detection', 'label', 'Early recovery detection', 'emoji', '🦉', 'description', 'Detect degradation patterns before crisis — metadata signals only'),
    jsonb_build_object('key', 'transparent_recovery', 'label', 'Transparent recovery', 'emoji', '🌹', 'description', 'Governed recovery recommendations with human approval — no hidden actions'),
    jsonb_build_object('key', 'incident_learning', 'label', 'Incident learning', 'emoji', '🦉', 'description', 'Capture lessons learned as summary metadata — not raw incident content'),
    jsonb_build_object('key', 'knowledge_restoration', 'label', 'Knowledge restoration', 'emoji', '🔔', 'description', 'Knowledge refresh scaffolds — cross-link Org Memory Phase 126'),
    jsonb_build_object('key', 'recovery_orchestration', 'label', 'Recovery orchestration', 'emoji', '❤️', 'description', 'Task coordination, role assignments, escalation tracking — humans lead'),
    jsonb_build_object('key', 'organizational_healing', 'label', 'Organizational healing', 'emoji', '🌹', 'description', 'Transparency, psychological safety, learning, compassion — People First'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive recovery visibility', 'emoji', '🔔', 'description', 'Executive dashboards and notifications — cross-link Executive Intelligence Phase 121')
  );
$$;

create or replace function public._shobp136_self_healing_operations_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational_health_monitoring', 'label', 'Operational health monitoring', 'description', 'Aggregate health across workflows, companions, knowledge, and support — metadata only'),
    jsonb_build_object('key', 'incident_coordination', 'label', 'Incident coordination cross-link', 'description', 'Cross-link Incident Response A.51 — do not duplicate incident RPCs'),
    jsonb_build_object('key', 'recovery_recommendations', 'label', 'Recovery recommendations', 'description', 'Pending/approved recovery recommendations — human approval required'),
    jsonb_build_object('key', 'knowledge_restoration', 'label', 'Knowledge restoration', 'description', 'Knowledge refresh scaffolds — cross-link Org Memory Phase 126'),
    jsonb_build_object('key', 'companion_recovery_support', 'label', 'Companion recovery support', 'description', 'Recovery Companion guidance — supportive not directive'),
    jsonb_build_object('key', 'escalation_workflows', 'label', 'Escalation workflows', 'description', 'Structured escalation paths with audit trails'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Incident learning captures — summary metadata only'),
    jsonb_build_object('key', 'executive_dashboards', 'label', 'Executive dashboards', 'description', 'Recovery visibility for leadership — cross-link Executive Intelligence 121')
  );
$$;

create or replace function public._shobp136_operational_health_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'workflow_effectiveness', 'label', 'Workflow effectiveness', 'description', 'Workflow orchestration health aggregates — cross-link Phase 133'),
    jsonb_build_object('key', 'companion_availability', 'label', 'Companion availability', 'description', 'Companion workforce coverage signals — cross-link Phase 132'),
    jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Knowledge accessibility', 'description', 'Critical knowledge reachability — cross-link Org Memory 126'),
    jsonb_build_object('key', 'support_capacity', 'label', 'Support capacity', 'description', 'Support backlog and capacity metadata — aggregate only'),
    jsonb_build_object('key', 'transformation_progress', 'label', 'Transformation progress', 'description', 'Change adoption during recovery — cross-link Phase 127'),
    jsonb_build_object('key', 'governance_alignment', 'label', 'Governance alignment', 'description', 'Governance exception awareness — cross-link Phase 123'),
    jsonb_build_object('key', 'community_health', 'label', 'Community health', 'description', 'Community collective success signals — cross-link Phase 117'),
    jsonb_build_object('key', 'gp_health', 'label', 'Growth Partner health', 'description', 'Growth Partner ecosystem health — cross-link GP Operations 114; never Affiliate')
  );
$$;

create or replace function public._shobp136_recovery_detection_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'workflow_failures', 'label', 'Repeated workflow failures', 'description', 'Pattern detection for workflow degradation — systemic signals only'),
    jsonb_build_object('key', 'companion_escalation_surges', 'label', 'Companion escalation surges', 'description', 'Companion escalation rate elevation — aggregate metadata'),
    jsonb_build_object('key', 'knowledge_interruptions', 'label', 'Knowledge interruptions', 'description', 'Critical knowledge access gaps during disruption'),
    jsonb_build_object('key', 'support_backlogs', 'label', 'Support backlogs', 'description', 'Support queue elevation signals — not individual performance scoring'),
    jsonb_build_object('key', 'governance_exceptions', 'label', 'Governance exceptions', 'description', 'Governance policy exception patterns — cross-link Governance A.14'),
    jsonb_build_object('key', 'communication_breakdowns', 'label', 'Communication breakdowns', 'description', 'Stakeholder communication gap awareness — cross-link Stakeholder A.53'),
    jsonb_build_object('key', 'executive_overload', 'label', 'Executive overload indicators', 'description', 'Leadership capacity signals — cross-link Executive Intelligence 121; not surveillance')
  );
$$;

create or replace function public._shobp136_self_healing_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self-healing framework — recommendations, playbooks, and escalation scaffolds with human approval. No high-risk automatic fixes.',
    'includes', jsonb_build_array(
      jsonb_build_object('key', 'recommendations', 'label', 'Recovery recommendations', 'description', 'Pending recommendations require human approval before action'),
      jsonb_build_object('key', 'playbooks', 'label', 'Recovery playbooks', 'description', 'Approved playbook scaffolds — metadata references only'),
      jsonb_build_object('key', 'human_escalation', 'label', 'Human escalation', 'description', 'Escalation to designated leadership — never bypass human authority'),
      jsonb_build_object('key', 'resource_reallocation', 'label', 'Resource reallocation suggestions', 'description', 'Capacity reallocation suggestions for review — not auto-execution'),
      jsonb_build_object('key', 'communication_plans', 'label', 'Communication plans', 'description', 'Recovery communication scaffolds for human approval'),
      jsonb_build_object('key', 'knowledge_refresh', 'label', 'Knowledge refresh', 'description', 'Knowledge update scaffolds — cross-link Org Memory 126')
    ),
    'boundary_note', 'Risk level 0–3 only in recommendations — level 4 critical actions prohibited for AI. Humans accountable.'
  );
$$;

create or replace function public._shobp136_recovery_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'identify_disruptions', 'label', 'Identify disruptions', 'description', 'Surface degradation signals for human review — not alarmist framing'),
    jsonb_build_object('key', 'recovery_guidance', 'label', 'Recovery guidance', 'description', 'Guide recovery planning with approved playbooks — supportive not directive'),
    jsonb_build_object('key', 'historical_lessons', 'label', 'Historical lessons', 'description', 'Surface prior incident learnings metadata — cross-link Org Memory 126'),
    jsonb_build_object('key', 'coordination_support', 'label', 'Coordination support', 'description', 'Scaffold recovery task coordination — humans assign roles'),
    jsonb_build_object('key', 'incident_summaries', 'label', 'Incident summaries', 'description', 'Summarize incident status metadata — not raw incident content'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Progress tracking', 'description', 'Track recovery progress visibility — dashboard aggregates only')
  );
$$;

create or replace function public._shobp136_incident_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'incident_summaries', 'label', 'Incident summaries', 'description', 'Post-incident summary metadata — no raw logs or PII'),
    jsonb_build_object('key', 'recovery_actions', 'label', 'Recovery actions taken', 'description', 'Document recovery actions as metadata for audit'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Capture organizational lessons — summary metadata only'),
    jsonb_build_object('key', 'knowledge_updates', 'label', 'Knowledge updates', 'description', 'Knowledge refresh recommendations — cross-link Org Memory 126'),
    jsonb_build_object('key', 'governance_improvements', 'label', 'Governance improvements', 'description', 'Governance improvement scaffolds — human approval required'),
    jsonb_build_object('key', 'companion_adjustments', 'label', 'Companion adjustments', 'description', 'Companion configuration review suggestions — not autonomous changes'),
    jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections', 'description', 'Leadership reflection prompts — metadata only, not wellbeing content')
  );
$$;

create or replace function public._shobp136_recovery_orchestration_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'task_coordination', 'label', 'Task coordination', 'description', 'Coordinate recovery tasks with clear ownership — humans assign'),
    jsonb_build_object('key', 'role_assignments', 'label', 'Role assignments', 'description', 'Role assignment scaffolds — cross-link Digital Twin 124'),
    jsonb_build_object('key', 'executive_notifications', 'label', 'Executive notifications', 'description', 'Executive recovery notifications — cross-link Command Center Phase 26'),
    jsonb_build_object('key', 'escalation_tracking', 'label', 'Escalation tracking', 'description', 'Track escalation status with audit trails'),
    jsonb_build_object('key', 'knowledge_distribution', 'label', 'Knowledge distribution', 'description', 'Distribute approved recovery knowledge — metadata references'),
    jsonb_build_object('key', 'companion_participation', 'label', 'Companion participation', 'description', 'Companion workforce participation — cross-link Phase 132'),
    jsonb_build_object('key', 'recovery_visibility', 'label', 'Recovery visibility', 'description', 'Transparent recovery status for stakeholders — no concealed incidents')
  );
$$;

create or replace function public._shobp136_organizational_healing_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'transparency', 'label', 'Transparency', 'description', 'Honest recovery communication — never conceal incidents or uncertainty'),
    jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety', 'description', 'Safe environment for honest recovery reflection — no blame culture'),
    jsonb_build_object('key', 'learning', 'label', 'Learning', 'description', 'Organizational learning from disruption — metadata captures only'),
    jsonb_build_object('key', 'collaboration', 'label', 'Collaboration', 'description', 'Cross-team recovery coordination — collective not individual heroics'),
    jsonb_build_object('key', 'compassion', 'label', 'Compassion', 'description', 'Compassionate recovery pace — cross-link Self Love A.76'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability', 'description', 'Human accountability for decisions — companions support not replace'),
    jsonb_build_object('key', 'support', 'label', 'Support', 'description', 'Supportive leadership and collective care during recovery')
  );
$$;

create or replace function public._shobp136_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_autonomous_governance', 'label', 'No autonomous governance changes', 'description', 'Never change governance policies or permissions without explicit human approval'),
    jsonb_build_object('key', 'no_concealing_incidents', 'label', 'No concealing incidents', 'description', 'Never hide, minimize, or conceal operational incidents from leadership'),
    jsonb_build_object('key', 'no_overriding_leadership', 'label', 'No overriding leadership', 'description', 'Never override designated recovery leadership or crisis command'),
    jsonb_build_object('key', 'no_high_risk_execution', 'label', 'No independent high-risk execution', 'description', 'Never execute level 3+ sensitive actions without explicit approval — level 4 prohibited'),
    jsonb_build_object('key', 'no_suppressing_dissent', 'label', 'No suppressing dissent', 'description', 'Never suppress legitimate concerns, dissent, or uncertainty during recovery')
  );
$$;

create or replace function public._shobp136_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in organizational recovery — empathy, reflection, recognition, healthy recovery pace, supportive leadership, collective care.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'empathy', 'label', 'Empathy', 'description', 'Compassionate acknowledgment during degradation and recovery'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Space for honest post-incident reflection without pressure'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Recognize collective effort during recovery — not performative scoring'),
      jsonb_build_object('key', 'healthy_recovery_pace', 'label', 'Healthy recovery pace', 'description', 'Sustainable pace — no pressure to recover before teams are ready'),
      jsonb_build_object('key', 'supportive_leadership', 'label', 'Supportive leadership', 'description', 'Leadership models care and sustainable workload'),
      jsonb_build_object('key', 'collective_care', 'label', 'Collective care', 'description', 'Collective care practices — cross-link Self Love A.76')
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'Recover together at a human pace — healing strengthens the organization.'
  );
$$;

create or replace function public._shobp136_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'recovery_audit_trails', 'label', 'Recovery audit trails', 'description', 'Full audit via _ore_log and recovery event records — immutable accountability'),
    jsonb_build_object('key', 'incident_histories', 'label', 'Incident histories', 'description', 'Incident history metadata — summary only, no raw content storage'),
    jsonb_build_object('key', 'executive_oversight', 'label', 'Executive oversight', 'description', 'Executive visibility into recovery status — cross-link Executive Intelligence 121'),
    jsonb_build_object('key', 'rbac', 'label', 'RBAC enforcement', 'description', 'resilience.view / resilience.manage / resilience.approve permissions enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', 'Sensitive recovery approvals may require 2FA — cross-link /app/settings/two-factor'),
    jsonb_build_object('key', 'tenant_isolation', 'label', 'Tenant isolation', 'description', 'All recovery data scoped by organization_id via RLS and security definer RPCs')
  );
$$;

create or replace function public._shobp136_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'human_oversight_131', 'label', 'Autonomy Governance Phase 131 (planned)', 'route', '/app/human-oversight-engine', 'note', 'Interim Human Oversight A.40 until Phase 131 ships'),
    jsonb_build_object('key', 'companion_workforce_132', 'label', 'Companion Workforce Phase 132', 'route', '/app/companion-workforce-engine', 'note', 'Companion participation during recovery'),
    jsonb_build_object('key', 'workflow_orchestration_133', 'label', 'Workflow Orchestration Phase 133', 'route', '/app/workflow-orchestration-engine', 'note', 'Workflow health and failure detection cross-link'),
    jsonb_build_object('key', 'continuous_improvement_134', 'label', 'Adaptive Organization Phase 134', 'route', '/app/continuous-improvement-engine', 'note', 'Continuous optimization during recovery'),
    jsonb_build_object('key', 'proactive_organization_135', 'label', 'Proactive Organization Phase 135', 'route', '/app/proactive-organization-engine', 'note', 'Anticipatory support cross-link — distinct from self-healing recovery'),
    jsonb_build_object('key', 'incident_response', 'label', 'Incident Response A.51', 'route', '/app/incident-response-coordination-engine', 'note', 'Coordinated incident response — cross-link only'),
    jsonb_build_object('key', 'continuity_phase80', 'label', 'Continuity Phase 80', 'route', '/app/continuity', 'note', 'Crisis continuity distinct layer'),
    jsonb_build_object('key', 'org_memory_126', 'label', 'Organizational Memory Phase 126', 'route', '/app/organizational-memory-engine', 'note', 'Knowledge restoration and lessons learned'),
    jsonb_build_object('key', 'executive_intelligence_121', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'note', 'Executive recovery visibility'),
    jsonb_build_object('key', 'resilience_128', 'label', 'Resilience Companion Phase 128', 'route', '/app/organizational-resilience-engine', 'note', 'Continuity companion layer preserved'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Empathy and healthy recovery pace')
  );
$$;

create or replace function public._shobp136_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self-Healing Operations — governed recovery with transparency; humans accountable, companions supportive.',
    'must_never', public._shobp136_companion_limitations(),
    'forbidden', jsonb_build_array(
      'Hidden recovery actions or concealed incidents',
      'High-risk automatic fixes without explicit human approval',
      'Autonomous governance or permission changes',
      'Overriding designated recovery or crisis leadership',
      'Suppressing dissent or legitimate uncertainty',
      'Duplicating Incident Response A.51 or Continuity Phase 80 RPCs',
      'Employee surveillance or individual blame scoring',
      'Replacing platform ai_self_healing_executions audit — distinct organizational layer'
    ),
    'required', jsonb_build_array(
      'Metadata summaries only in dashboard RPC payloads',
      'Human approval for recovery recommendations and playbook activation',
      'Transparent degradation signals — explain why context appears',
      'People-first recovery coordination — compassion with accountability',
      'Preserve all A.50 + Phase 81 + Phase 91 + Phase 128 dashboard fields',
      'Full recovery audit trails via _ore_log and event records',
      'Cross-link Phases 131–135, Incident Response, Continuity, Org Memory — never duplicate storage'
    ),
    'boundary_note', 'Recovery strengthens organizations — Wisdom before speed. People First. Humans decide; Aipify informs, prepares, and coordinates visibility.'
  );
$$;

create or replace function public._shobp136_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recovery Companion — identify disruptions, guide recovery, surface historical lessons, coordinate scaffolds, summarize progress. Supportive NOT directive.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'degradation_awareness', 'prompt', 'A workflow degradation pattern may need review — shall Aipify prepare a recovery summary for leadership?', 'consideration', 'Aggregate signals only — not individual blame'),
      jsonb_build_object('emoji', '🔔', 'key', 'recovery_recommendation', 'prompt', 'Recovery recommendations are ready for review — would you like to see pending actions requiring approval?', 'consideration', 'Human approval required — no auto-execution'),
      jsonb_build_object('emoji', '🌹', 'key', 'lessons_capture', 'prompt', 'This recovery may offer organizational lessons — shall Aipify scaffold a lessons-learned capture for review?', 'consideration', 'Metadata only — no raw incident content'),
      jsonb_build_object('emoji', '❤️', 'key', 'recovery_pace', 'prompt', 'Recovery is progressing — would a status summary help coordinate next steps at a sustainable pace?', 'consideration', 'Healthy recovery pace — cross-link Self Love A.76')
    ),
    'boundary_note', 'Companion supports recovery visibility — never directs recovery independently, never conceals incidents, never executes high-risk actions.'
  );
$$;

create or replace function public._shobp136_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'detection_speed', 'label', 'Detection speed'),
    jsonb_build_object('key', 'recovery_transparency', 'label', 'Recovery transparency'),
    jsonb_build_object('key', 'lessons_captured', 'label', 'Lessons captured'),
    jsonb_build_object('key', 'recommendation_approval_rate', 'label', 'Recommendation approval rate'),
    jsonb_build_object('key', 'operational_health_trend', 'label', 'Operational health trend'),
    jsonb_build_object('key', 'knowledge_restoration', 'label', 'Knowledge restoration coverage'),
    jsonb_build_object('key', 'recovery_duration', 'label', 'Recovery duration awareness'),
    jsonb_build_object('key', 'organizational_strength', 'label', 'Post-recovery organizational strength')
  );
$$;

create or replace function public._shobp136_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses self-healing operations patterns internally — aggregate operational metadata, governed recovery reviews, and transparent incident learning. No hidden actions. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._shobp136_privacy_note()
returns text language sql immutable as $$
  select 'Autonomous Organization Phase 136 — aggregate counts and summary metadata only. No PII, no raw incident content, no employee surveillance, no concealed actions. Humans accountable; Aipify coordinates visibility.';
$$;

create or replace function public._shobp136_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Recovery strengthens organizations — not merely return to normal.',
    'Transparent governed recovery — no hidden actions.',
    'People First. Wisdom before speed.',
    'Humans accountable; companions supportive.',
    'Detect early, recover together, learn with compassion.'
  );
$$;

create or replace function public._shobp136_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_phase128 jsonb;
  v_open_events int := 0;
  v_recovering_events int := 0;
  v_pending_recommendations int := 0;
  v_draft_learnings int := 0;
begin
  v_phase128 := public._rccbp128_engagement_summary(p_organization_id);

  select count(*) into v_open_events
  from public.self_healing_recovery_events
  where organization_id = p_organization_id and status in ('open', 'investigating');

  select count(*) into v_recovering_events
  from public.self_healing_recovery_events
  where organization_id = p_organization_id and status = 'recovering';

  select count(*) into v_pending_recommendations
  from public.self_healing_recovery_recommendations
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_draft_learnings
  from public.self_healing_incident_learnings
  where organization_id = p_organization_id and status in ('draft', 'review');

  return v_phase128 || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._shobp136_objectives()),
    'operations_center_capabilities', jsonb_array_length(public._shobp136_self_healing_operations_center()),
    'operational_health_areas', jsonb_array_length(public._shobp136_operational_health_engine()),
    'recovery_detection_signals', jsonb_array_length(public._shobp136_recovery_detection_engine()),
    'self_healing_framework_includes', jsonb_array_length(public._shobp136_self_healing_framework()->'includes'),
    'recovery_companion_supports', jsonb_array_length(public._shobp136_recovery_companion()),
    'incident_learning_areas', jsonb_array_length(public._shobp136_incident_learning_engine()),
    'recovery_orchestration_capabilities', jsonb_array_length(public._shobp136_recovery_orchestration_engine()),
    'organizational_healing_principles_count', jsonb_array_length(public._shobp136_organizational_healing_principles()),
    'companion_limitations_count', jsonb_array_length(public._shobp136_companion_limitations()),
    'security_requirements_count', jsonb_array_length(public._shobp136_security_requirements()),
    'integration_links_count', jsonb_array_length(public._shobp136_integration_links()),
    'success_metrics_count', jsonb_array_length(public._shobp136_success_metrics()),
    'phase136_open_events', v_open_events,
    'phase136_recovering_events', v_recovering_events,
    'phase136_pending_recommendations', v_pending_recommendations,
    'phase136_draft_learnings', v_draft_learnings,
    'privacy_note', public._shobp136_privacy_note()
  );
end; $$;

create or replace function public._shobp136_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_events int := 0;
  v_recommendations int := 0;
begin
  v_engagement := public._shobp136_engagement_summary(p_organization_id);
  v_events := coalesce((v_engagement->>'phase136_open_events')::int, 0)
    + coalesce((v_engagement->>'phase136_recovering_events')::int, 0);
  v_recommendations := coalesce((v_engagement->>'phase136_pending_recommendations')::int, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Autonomous Organization objectives documented', 'met', jsonb_array_length(public._shobp136_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'operations_center', 'label', 'Self-Healing Operations Center — eight capabilities', 'met', jsonb_array_length(public._shobp136_self_healing_operations_center()) = 8, 'note', null),
    jsonb_build_object('key', 'operational_health', 'label', 'Operational health engine — eight aggregate areas', 'met', jsonb_array_length(public._shobp136_operational_health_engine()) = 8, 'note', 'Aggregate metadata — not surveillance'),
    jsonb_build_object('key', 'recovery_detection', 'label', 'Recovery detection engine — seven signals', 'met', jsonb_array_length(public._shobp136_recovery_detection_engine()) = 7, 'note', null),
    jsonb_build_object('key', 'self_healing_framework', 'label', 'Self-healing framework — six includes (no high-risk auto actions)', 'met', jsonb_array_length(public._shobp136_self_healing_framework()->'includes') = 6, 'note', 'Human approval required'),
    jsonb_build_object('key', 'recovery_companion', 'label', 'Recovery Companion — six supports (supportive not directive)', 'met', jsonb_array_length(public._shobp136_recovery_companion()) = 6, 'note', null),
    jsonb_build_object('key', 'incident_learning', 'label', 'Incident learning engine — seven areas', 'met', jsonb_array_length(public._shobp136_incident_learning_engine()) = 7, 'note', 'Metadata only'),
    jsonb_build_object('key', 'recovery_orchestration', 'label', 'Recovery orchestration engine — seven capabilities', 'met', jsonb_array_length(public._shobp136_recovery_orchestration_engine()) = 7, 'note', null),
    jsonb_build_object('key', 'healing_principles', 'label', 'Organizational healing principles — seven documented', 'met', jsonb_array_length(public._shobp136_organizational_healing_principles()) = 7, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._shobp136_companion_limitations()) = 5, 'note', 'No autonomous governance, no concealing incidents'),
    jsonb_build_object('key', 'security_requirements', 'label', 'Security requirements — six documented', 'met', jsonb_array_length(public._shobp136_security_requirements()) = 6, 'note', 'RBAC + audit trails + 2FA cross-link'),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory integration links documented', 'met', jsonb_array_length(public._shobp136_integration_links()) >= 11, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._shobp136_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase128_preserved', 'label', 'Blueprint Phase 128 _rccbp128_* fields preserved', 'met', jsonb_array_length(public._rccbp128_objectives()) = 8, 'note', 'Phase 136 layers on Phase 128 — does not replace.'),
    jsonb_build_object('key', 'operational_recovery', 'label', 'Recovery events or recommendations seeded', 'met', v_events >= 1 or v_recommendations >= 1, 'note', case when v_events < 1 and v_recommendations < 1 then 'Record recovery events or review recommendations to validate workflow.' else null end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 136 vs Incident Response / Continuity / platform self-healing distinction documented', 'met', position('Incident Response A.51' in public._shobp136_distinction_note()) > 0, 'note', public._shobp136_distinction_note())
  );
end; $$;

create or replace function public._shobp136_blueprint_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '136',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE136_SELF_HEALING_OPERATIONS_ORGANIZATIONAL_RECOVERY.md',
    'spec_doc', 'SELF_HEALING_OPERATIONS_ORGANIZATIONAL_RECOVERY_ENGINE_PHASE136.md',
    'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
    'era', 'Autonomous Organization Era (131–140)',
    'route', '/app/organizational-resilience-engine',
    'distinction_note', public._shobp136_distinction_note(),
    'mission', public._shobp136_mission(),
    'philosophy', public._shobp136_philosophy(),
    'abos_principle', public._shobp136_abos_principle(),
    'vision', public._shobp136_vision(),
    'objectives', public._shobp136_objectives(),
    'self_healing_operations_center', public._shobp136_self_healing_operations_center(),
    'operational_health_engine', public._shobp136_operational_health_engine(),
    'recovery_detection_engine', public._shobp136_recovery_detection_engine(),
    'self_healing_framework', public._shobp136_self_healing_framework(),
    'recovery_companion', public._shobp136_recovery_companion(),
    'incident_learning_engine', public._shobp136_incident_learning_engine(),
    'recovery_orchestration_engine', public._shobp136_recovery_orchestration_engine(),
    'organizational_healing_principles', public._shobp136_organizational_healing_principles(),
    'companion_limitations', public._shobp136_companion_limitations(),
    'self_love_connection', public._shobp136_self_love_connection(),
    'security_requirements', public._shobp136_security_requirements(),
    'integration_links', public._shobp136_integration_links(),
    'limitation_principles', public._shobp136_limitation_principles(),
    'companion_adaptation', public._shobp136_companion_adaptation(),
    'success_metrics', public._shobp136_success_metrics(),
    'success_criteria', public._shobp136_success_criteria(p_organization_id),
    'engagement_summary', public._shobp136_engagement_summary(p_organization_id),
    'dogfooding', public._shobp136_dogfooding(),
    'vision_phrases', public._shobp136_vision_phrases(),
    'privacy_note', public._shobp136_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin record RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_self_healing_recovery_event(
  p_event_title text,
  p_event_type text default 'degradation',
  p_severity text default 'moderate',
  p_status text default 'open',
  p_summary_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.self_healing_recovery_events; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if coalesce(trim(p_event_title), '') = '' then raise exception 'Event title required'; end if;

  insert into public.self_healing_recovery_events (
    organization_id, event_type, event_title, severity, status, summary_metadata, recorded_by
  )
  values (
    v_org_id, coalesce(p_event_type, 'degradation'), left(trim(p_event_title), 200),
    coalesce(p_severity, 'moderate'), coalesce(p_status, 'open'),
    coalesce(p_summary_metadata, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'self_healing_recovery_event_recorded', 'self_healing_recovery_event', v_row.id,
    jsonb_build_object('event_type', v_row.event_type, 'severity', v_row.severity)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.capture_incident_learning(
  p_learning_title text,
  p_recovery_event_id uuid default null,
  p_summary_metadata jsonb default '{}'::jsonb,
  p_governance_note text default null,
  p_knowledge_update_ref text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.self_healing_incident_learnings; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if coalesce(trim(p_learning_title), '') = '' then raise exception 'Learning title required'; end if;

  if p_recovery_event_id is not null and not exists (
    select 1 from public.self_healing_recovery_events
    where id = p_recovery_event_id and organization_id = v_org_id
  ) then
    raise exception 'Recovery event not found';
  end if;

  insert into public.self_healing_incident_learnings (
    organization_id, recovery_event_id, learning_title, summary_metadata,
    governance_note, knowledge_update_ref, captured_by
  )
  values (
    v_org_id, p_recovery_event_id, left(trim(p_learning_title), 200),
    coalesce(p_summary_metadata, '{}'::jsonb), p_governance_note, p_knowledge_update_ref, v_user_id
  )
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'incident_learning_captured', 'self_healing_incident_learning', v_row.id,
    jsonb_build_object('learning_title', v_row.learning_title)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

-- 4. Dashboard RPC — preserve ALL A.50 + Phase 81 + Phase 91 + Phase 128 fields; append Phase 136
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resilience.view');
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);
  perform public._shobp136_seed(v_org_id);

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
    'self_healing_privacy_note', public._shobp136_privacy_note()

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- 5. Card RPC — preserve A.50 + Phase 81 + Phase 91 + Phase 128 fields; append Phase 136
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);
  perform public._shobp136_seed(v_org_id);
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
    'self_healing_vision_note', 'Recovery strengthens organizations — People First. Wisdom before speed. Humans accountable; companions supportive.'

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;
-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._shobp136_seed(uuid) to authenticated;
grant execute on function public._shobp136_distinction_note() to authenticated;
grant execute on function public._shobp136_mission() to authenticated;
grant execute on function public._shobp136_philosophy() to authenticated;
grant execute on function public._shobp136_abos_principle() to authenticated;
grant execute on function public._shobp136_vision() to authenticated;
grant execute on function public._shobp136_objectives() to authenticated;
grant execute on function public._shobp136_self_healing_operations_center() to authenticated;
grant execute on function public._shobp136_operational_health_engine() to authenticated;
grant execute on function public._shobp136_recovery_detection_engine() to authenticated;
grant execute on function public._shobp136_self_healing_framework() to authenticated;
grant execute on function public._shobp136_recovery_companion() to authenticated;
grant execute on function public._shobp136_incident_learning_engine() to authenticated;
grant execute on function public._shobp136_recovery_orchestration_engine() to authenticated;
grant execute on function public._shobp136_organizational_healing_principles() to authenticated;
grant execute on function public._shobp136_companion_limitations() to authenticated;
grant execute on function public._shobp136_self_love_connection() to authenticated;
grant execute on function public._shobp136_security_requirements() to authenticated;
grant execute on function public._shobp136_integration_links() to authenticated;
grant execute on function public._shobp136_limitation_principles() to authenticated;
grant execute on function public._shobp136_companion_adaptation() to authenticated;
grant execute on function public._shobp136_success_metrics() to authenticated;
grant execute on function public._shobp136_dogfooding() to authenticated;
grant execute on function public._shobp136_privacy_note() to authenticated;
grant execute on function public._shobp136_vision_phrases() to authenticated;
grant execute on function public._shobp136_engagement_summary(uuid) to authenticated;
grant execute on function public._shobp136_success_criteria(uuid) to authenticated;
grant execute on function public._shobp136_blueprint_block(uuid) to authenticated;
grant execute on function public.record_self_healing_recovery_event(text, text, text, text, jsonb) to authenticated;
grant execute on function public.capture_incident_learning(text, uuid, jsonb, text, text) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'self-healing-operations-organizational-recovery-blueprint-phase136', 'Self-Healing Operations & Organizational Recovery Engine (Autonomous Organization Phase 136)',
  'Self-Healing Operations & Organizational Recovery Engine — extends Organizational Resilience A.50 + Phase 81 + Phase 91 + Phase 128 with transparent governed recovery, operational health monitoring, incident learning, and recovery orchestration. No hidden actions.',
  'authenticated', 136
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'self-healing-operations-organizational-recovery-blueprint-phase136' and tenant_id is null
);
