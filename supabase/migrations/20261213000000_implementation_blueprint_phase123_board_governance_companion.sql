-- Implementation Blueprint Phase 123 — Board & Governance Companion Engine
-- Enterprise Intelligence Era (121–130). Extends Governance & Policy Engine Phase A.14 + Blueprint Phase 67.
-- Helpers: _bgbp123_* (never collide with _gpe_*, _bgcbp_*).

-- ---------------------------------------------------------------------------
-- 1. Distinction note (includes Phase 67 collision)
-- ---------------------------------------------------------------------------
create or replace function public._bgbp123_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 123 — Board & Governance Companion Engine at /app/governance-policy-engine. Enterprise Intelligence Era (121–130). Layers on Governance & Policy Engine Phase A.14 (20260719000000_governance_policy_engine_phase_a14.sql) and ABOS Implementation Blueprint Phase 67 (_bgcbp_* — 20261017000000_implementation_blueprint_phase67_board_governance_companion.sql). Phase 123 deepens board intelligence, briefing, governance memory, committee support, and effectiveness insights — Phase 67 established board preparation and strategic oversight scaffolds; Phase 123 is the Enterprise Intelligence companion layer. Distinct from Security Compliance repo Phase 67 at /app/security. Distinct from Presence Center repo Phase 123 (docs/cursor). Helpers _bgbp123_* only — never _gpe_* or _bgcbp_*. Cross-link Executive Intelligence Phase 121, Strategic Foresight Phase 122, Ecosystem Governance Phase 119, Trust Phase 116, Purpose Phase 118, Self Love A.76.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._bgbp123_mission()
returns text language sql immutable as $$
  select 'Support boards with clarity, transparency, and preparedness — strengthen oversight without replacing governance or influencing director independence.';
$$;

create or replace function public._bgbp123_philosophy()
returns text language sql immutable as $$
  select 'Wisdom before speed. Stewardship over urgency. Boards navigate uncertainty with discipline — Aipify informs and prepares; directors remain accountable and independent.';
$$;

create or replace function public._bgbp123_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Board & Governance Companion strengthens responsible stewardship. Metadata only — financial summaries are scaffold framing, never raw records.';
$$;

create or replace function public._bgbp123_vision()
returns text language sql immutable as $$
  select 'Thoughtful, prepared boards — governance conversations become more meaningful through clarity, transparency, and continuity without micromanagement.';
$$;

create or replace function public._bgbp123_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'preparedness', 'emoji', '📋', 'label', 'Preparedness', 'description', 'Board-ready materials, briefings, and meeting preparation — metadata summaries only'),
    jsonb_build_object('key', 'strategic_visibility', 'emoji', '🎯', 'label', 'Strategic visibility', 'description', 'Strategic objectives, developments, and alignment signals for oversight'),
    jsonb_build_object('key', 'oversight', 'emoji', '🦉', 'label', 'Oversight', 'description', 'Balanced visibility — oversight not micromanagement of management'),
    jsonb_build_object('key', 'governance_quality', 'emoji', '✨', 'label', 'Governance quality', 'description', 'Policy oversight, review cadence, and governance maturity indicators'),
    jsonb_build_object('key', 'continuity', 'emoji', '🔗', 'label', 'Continuity', 'description', 'Decision histories, governance memory, and knowledge continuity across meetings'),
    jsonb_build_object('key', 'informed_discussions', 'emoji', '💬', 'label', 'Informed discussions', 'description', 'Discussion questions and context — strengthens dialogue, does not direct outcomes'),
    jsonb_build_object('key', 'emerging_risks', 'emoji', '🔔', 'label', 'Emerging risks', 'description', 'Risk signals and oversight categories — informed stewardship, not fear'),
    jsonb_build_object('key', 'responsible_leadership', 'emoji', '🌹', 'label', 'Responsible leadership', 'description', 'Leadership priorities and purpose initiatives — stewardship framing')
  );
$$;

create or replace function public._bgbp123_board_intelligence_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'board_briefings', 'label', 'Board briefings'),
    jsonb_build_object('key', 'governance_dashboards', 'label', 'Governance dashboards'),
    jsonb_build_object('key', 'risk_visibility', 'label', 'Risk visibility'),
    jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories'),
    jsonb_build_object('key', 'meeting_preparation', 'label', 'Meeting preparation'),
    jsonb_build_object('key', 'strategic_summaries', 'label', 'Strategic summaries'),
    jsonb_build_object('key', 'policy_oversight', 'label', 'Policy oversight'),
    jsonb_build_object('key', 'committee_support', 'label', 'Committee support'),
    jsonb_build_object('key', 'action_tracking', 'label', 'Action tracking'),
    jsonb_build_object('key', 'knowledge_continuity', 'label', 'Knowledge continuity')
  );
$$;

create or replace function public._bgbp123_board_dashboard_displays()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_objectives', 'label', 'Strategic objectives', 'description', 'Active objectives and alignment — metadata only'),
    jsonb_build_object('key', 'org_health', 'label', 'Organizational health', 'description', 'Aggregate health indicators — cross-link A.56'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Governance maturity', 'description', 'Policy coverage, review cadence, violation posture'),
    jsonb_build_object('key', 'financial_summaries', 'label', 'Financial summaries', 'description', 'Metadata/scaffold framing only — never raw financial records'),
    jsonb_build_object('key', 'risk_signals', 'label', 'Risk signals', 'description', 'Emerging governance and operational risk indicators'),
    jsonb_build_object('key', 'leadership_priorities', 'label', 'Leadership priorities', 'description', 'Cross-link Executive Intelligence Phase 121'),
    jsonb_build_object('key', 'customer_trends', 'label', 'Customer trends', 'description', 'Aggregate customer trend metadata — no PII'),
    jsonb_build_object('key', 'companion_adoption', 'label', 'Companion adoption', 'description', 'Companion usage and adoption signals — metadata counts'),
    jsonb_build_object('key', 'gp_health', 'label', 'Growth Partner health', 'description', 'Partner ecosystem health metadata — cross-link GP Operations'),
    jsonb_build_object('key', 'purpose_initiatives', 'label', 'Purpose initiatives', 'description', 'Purpose and impact commitments — cross-link Phase 118')
  );
$$;

create or replace function public._bgbp123_board_briefing_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'executive_summaries', 'label', 'Executive summaries'),
    jsonb_build_object('key', 'risk_updates', 'label', 'Risk updates'),
    jsonb_build_object('key', 'strategic_developments', 'label', 'Strategic developments'),
    jsonb_build_object('key', 'governance_changes', 'label', 'Governance changes'),
    jsonb_build_object('key', 'committee_reports', 'label', 'Committee reports'),
    jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories'),
    jsonb_build_object('key', 'outstanding_actions', 'label', 'Outstanding actions'),
    jsonb_build_object('key', 'knowledge_references', 'label', 'Knowledge references')
  );
$$;

create or replace function public._bgbp123_governance_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'board_decisions', 'label', 'Board decisions'),
    jsonb_build_object('key', 'committee_outcomes', 'label', 'Committee outcomes'),
    jsonb_build_object('key', 'governance_commitments', 'label', 'Governance commitments'),
    jsonb_build_object('key', 'policy_changes', 'label', 'Policy changes'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
    jsonb_build_object('key', 'historical_context', 'label', 'Historical context'),
    jsonb_build_object('key', 'action_ownership', 'label', 'Action ownership'),
    jsonb_build_object('key', 'strategic_reflections', 'label', 'Strategic reflections')
  );
$$;

create or replace function public._bgbp123_board_companion_supports()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'prepare_materials', 'label', 'Prepare materials', 'description', 'Board packet and agenda scaffolds — metadata summaries'),
    jsonb_build_object('key', 'summarize_info', 'label', 'Summarize information', 'description', 'Concise governance and strategic summaries'),
    jsonb_build_object('key', 'highlight_unresolved_actions', 'label', 'Highlight unresolved actions', 'description', 'Outstanding board commitments and follow-ups'),
    jsonb_build_object('key', 'connect_historical_decisions', 'label', 'Connect historical decisions', 'description', 'Decision continuity references — audit metadata only'),
    jsonb_build_object('key', 'policy_references', 'label', 'Policy references', 'description', 'Active policies and review status for board context'),
    jsonb_build_object('key', 'discussion_questions', 'label', 'Discussion questions', 'description', 'Questions worth exploring — strengthens oversight, does not direct outcomes')
  );
$$;

create or replace function public._bgbp123_committee_support()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'audit', 'label', 'Audit committee'),
    jsonb_build_object('key', 'governance', 'label', 'Governance committee'),
    jsonb_build_object('key', 'risk', 'label', 'Risk committee'),
    jsonb_build_object('key', 'compensation', 'label', 'Compensation committee'),
    jsonb_build_object('key', 'technology', 'label', 'Technology committee'),
    jsonb_build_object('key', 'purpose', 'label', 'Purpose committee'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge committee')
  );
$$;

create or replace function public._bgbp123_risk_oversight_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic risk', 'description', 'Strategic exposure and initiative dependencies'),
    jsonb_build_object('key', 'governance', 'label', 'Governance risk', 'description', 'Policy drift, violations, and review gaps'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge risk', 'description', 'Knowledge gaps and documentation posture'),
    jsonb_build_object('key', 'security', 'label', 'Security risk', 'description', 'Security and trust signals — metadata only'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership risk', 'description', 'Leadership continuity and priority overload signals'),
    jsonb_build_object('key', 'transformation', 'label', 'Transformation risk', 'description', 'Change and transformation exposure'),
    jsonb_build_object('key', 'operational', 'label', 'Operational risk', 'description', 'Operational dependency and process signals'),
    jsonb_build_object('key', 'dependency', 'label', 'Dependency risk', 'description', 'Interconnected policy and ecosystem dependencies')
  );
$$;

create or replace function public._bgbp123_decision_traceability()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'rationales', 'label', 'Decision rationales'),
    jsonb_build_object('key', 'supporting_context', 'label', 'Supporting context'),
    jsonb_build_object('key', 'alternatives_considered', 'label', 'Alternatives considered'),
    jsonb_build_object('key', 'historical_references', 'label', 'Historical references'),
    jsonb_build_object('key', 'follow_up_obligations', 'label', 'Follow-up obligations'),
    jsonb_build_object('key', 'outcome_reviews', 'label', 'Outcome reviews')
  );
$$;

create or replace function public._bgbp123_board_effectiveness_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'preparation_quality', 'label', 'Preparation quality', 'description', 'Process improvement — not director evaluation'),
    jsonb_build_object('key', 'action_completion', 'label', 'Action completion', 'description', 'Follow-up completion rates — metadata counts'),
    jsonb_build_object('key', 'committee_coordination', 'label', 'Committee coordination', 'description', 'Cross-committee alignment signals'),
    jsonb_build_object('key', 'knowledge_utilization', 'label', 'Knowledge utilization', 'description', 'Governance knowledge library usage patterns'),
    jsonb_build_object('key', 'meeting_efficiency', 'label', 'Meeting efficiency', 'description', 'Agenda focus and follow-up discipline — process lens'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Governance maturity', 'description', 'Maturity progression over review cycles'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic alignment', 'description', 'Board priorities aligned with strategic objectives')
  );
$$;

create or replace function public._bgbp123_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'never_vote', 'label', 'Never vote on behalf of directors'),
    jsonb_build_object('key', 'never_override_directors', 'label', 'Never override director decisions'),
    jsonb_build_object('key', 'never_suppress_info', 'label', 'Never suppress material information'),
    jsonb_build_object('key', 'never_influence_independence', 'label', 'Never influence director independence'),
    jsonb_build_object('key', 'never_conflicts_of_interest', 'label', 'Never create conflicts of interest'),
    jsonb_build_object('key', 'never_replace_judgment', 'label', 'Never replace human judgment')
  );
$$;

create or replace function public._bgbp123_self_love_governance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in governance — reflection, preparedness, respect, healthy challenge, thoughtful pacing, and long-term stewardship.',
    'patterns', jsonb_build_array(
      jsonb_build_object('key', 'reflection', 'label', 'Reflection'),
      jsonb_build_object('key', 'preparedness', 'label', 'Preparedness'),
      jsonb_build_object('key', 'respect', 'label', 'Respect'),
      jsonb_build_object('key', 'healthy_challenge', 'label', 'Healthy challenge'),
      jsonb_build_object('key', 'thoughtful_pacing', 'label', 'Thoughtful pacing'),
      jsonb_build_object('key', 'long_term_stewardship', 'label', 'Long-term stewardship')
    ),
    'governance_phrase', 'Good governance often involves patience and thoughtful dialogue.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Board Companion stores metadata scaffolds, not personal wellbeing content.'
  );
$$;

create or replace function public._bgbp123_board_knowledge_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'policies', 'label', 'Policies'),
    jsonb_build_object('key', 'committee_charters', 'label', 'Committee charters'),
    jsonb_build_object('key', 'meeting_archives', 'label', 'Meeting archives'),
    jsonb_build_object('key', 'governance_frameworks', 'label', 'Governance frameworks'),
    jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories'),
    jsonb_build_object('key', 'strategic_references', 'label', 'Strategic references'),
    jsonb_build_object('key', 'purpose_commitments', 'label', 'Purpose commitments')
  );
$$;

create or replace function public._bgbp123_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy Engine (A.14)', 'route', '/app/governance-policy-engine', 'note', 'Primary engine — Phase 123 extends A.14 + Phase 67'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'note', 'Leadership context and executive briefings — cross-link'),
    jsonb_build_object('key', 'strategic_foresight', 'label', 'Strategic Foresight Phase 122', 'route', '/app/strategic-foresight-engine', 'note', 'Strategic foresight and scenario planning — cross-link'),
    jsonb_build_object('key', 'ecosystem_governance', 'label', 'Ecosystem Governance Phase 119', 'route', '/app/ecosystem-governance', 'note', 'Ecosystem standards and certification oversight'),
    jsonb_build_object('key', 'meeting_collaboration', 'label', 'Meeting & Collaboration (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Board meeting lifecycle scaffold'),
    jsonb_build_object('key', 'social_impact_purpose', 'label', 'Social Impact & Purpose Phase 118', 'route', '/app/social-impact-purpose-engine', 'note', 'Purpose initiatives for board oversight'),
    jsonb_build_object('key', 'trust_reputation', 'label', 'Trust & Reputation Phase 116', 'route', '/app/trust-reputation-engine', 'note', 'Trust and reputation signals — metadata only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Reflection and thoughtful pacing — principle only'),
    jsonb_build_object('key', 'audit_accountability', 'label', 'Audit & Accountability', 'route', '/app/audit-accountability', 'note', 'Immutable governance audit trail'),
    jsonb_build_object('key', 'approvals', 'label', 'Approvals / Trust & Action', 'route', '/app/approvals', 'note', 'Human oversight for sensitive AI actions'),
    jsonb_build_object('key', 'org_health', 'label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Aggregate health for board dashboard'),
    jsonb_build_object('key', 'blueprint_phase67', 'label', 'Blueprint Phase 67', 'route', '/app/governance-policy-engine', 'note', 'Prior board companion layer — _bgcbp_* scaffolds preserved')
  );
$$;

create or replace function public._bgbp123_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Board Companion informs and prepares — directors remain accountable; no voting, no director evaluation.',
    'must_never', public._bgbp123_companion_limitations(),
    'required', jsonb_build_array(
      'Disclose assumptions and metadata-only framing',
      'Financial summaries scaffold framing only — never raw financial records',
      'Effectiveness insights are process improvement — not director evaluation',
      'Cross-link specialized engines — never duplicate RPCs',
      'Preserve Phase 67 _bgcbp_* fields in dashboard and card RPCs'
    ),
    'boundary_note', 'Wisdom before speed. Stewardship. Directors decide — Aipify informs.'
  );
$$;

create or replace function public._bgbp123_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Prepare thoughtfully, highlight context, encourage informed dialogue — never direct outcomes.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'oversight_context', 'prompt', 'Several governance policies interconnect — shall Aipify summarize dependency context for board review when directors are ready?', 'consideration', 'Oversight framing without urgency'),
      jsonb_build_object('emoji', '🌹', 'key', 'stewardship_milestones', 'prompt', 'Stewardship milestones progressed since the last meeting — recognition without pressure to accelerate every agenda item.', 'consideration', 'Long-term stewardship — Self Love cross-link'),
      jsonb_build_object('emoji', '🔔', 'key', 'emerging_risks', 'prompt', 'Emerging governance review gaps deserve board awareness — preparedness framing, not alarm.', 'consideration', 'Risk visibility — informed stewardship'),
      jsonb_build_object('emoji', '📈', 'key', 'strategic_developments', 'prompt', 'Key strategic developments since the last board meeting — metadata summaries prepared for director review.', 'consideration', 'Strategic visibility — humans decide')
    )
  );
$$;

create or replace function public._bgbp123_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'board_preparedness', 'label', 'Board preparedness'),
    jsonb_build_object('key', 'governance_transparency', 'label', 'Governance transparency'),
    jsonb_build_object('key', 'oversight_quality', 'label', 'Oversight quality'),
    jsonb_build_object('key', 'decision_continuity', 'label', 'Decision continuity'),
    jsonb_build_object('key', 'risk_stewardship', 'label', 'Risk stewardship'),
    jsonb_build_object('key', 'committee_effectiveness', 'label', 'Committee effectiveness'),
    jsonb_build_object('key', 'knowledge_utilization', 'label', 'Knowledge utilization'),
    jsonb_build_object('key', 'long_term_stewardship', 'label', 'Long-term stewardship')
  );
$$;

create or replace function public._bgbp123_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
begin
  v_base := public._bgcbp_engagement_summary(p_org_id);
  return v_base || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._bgbp123_objectives()),
    'intelligence_center_capabilities', jsonb_array_length(public._bgbp123_board_intelligence_center()),
    'dashboard_displays_count', jsonb_array_length(public._bgbp123_board_dashboard_displays()),
    'briefing_supports_count', jsonb_array_length(public._bgbp123_board_briefing_engine()),
    'governance_memory_captures', jsonb_array_length(public._bgbp123_governance_memory_engine()),
    'companion_supports_count', jsonb_array_length(public._bgbp123_board_companion_supports()),
    'committee_types_count', jsonb_array_length(public._bgbp123_committee_support()),
    'risk_categories_count', jsonb_array_length(public._bgbp123_risk_oversight_framework()),
    'cross_links_count', jsonb_array_length(public._bgbp123_cross_links()),
    'success_metrics_count', jsonb_array_length(public._bgbp123_success_metrics()),
    'companion_limitations_count', jsonb_array_length(public._bgbp123_companion_limitations()),
    'privacy_note', 'Metadata only — no raw financial records, PII, or director evaluation data.'
  );
end; $$;

create or replace function public._bgbp123_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active int := 0;
begin
  v_engagement := public._bgbp123_engagement_summary(p_org_id);
  v_active := coalesce((v_engagement->>'active_policies')::int, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight board companion objectives documented', 'met', jsonb_array_length(public._bgbp123_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'intelligence_center', 'label', 'Board Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._bgbp123_board_intelligence_center()) = 10, 'note', null),
    jsonb_build_object('key', 'dashboard_displays', 'label', 'Board dashboard — ten oversight displays', 'met', jsonb_array_length(public._bgbp123_board_dashboard_displays()) = 10, 'note', 'Financial summaries metadata/scaffold only.'),
    jsonb_build_object('key', 'briefing_engine', 'label', 'Board briefing engine — eight supports', 'met', jsonb_array_length(public._bgbp123_board_briefing_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'governance_memory', 'label', 'Governance memory — eight capture types', 'met', jsonb_array_length(public._bgbp123_governance_memory_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'board_companion', 'label', 'Board Companion — six supports, no outcome direction', 'met', jsonb_array_length(public._bgbp123_board_companion_supports()) = 6, 'note', 'Strengthens oversight — does not direct outcomes.'),
    jsonb_build_object('key', 'committee_support', 'label', 'Committee support — seven committee types', 'met', jsonb_array_length(public._bgbp123_committee_support()) = 7, 'note', null),
    jsonb_build_object('key', 'risk_oversight', 'label', 'Risk oversight — eight categories', 'met', jsonb_array_length(public._bgbp123_risk_oversight_framework()) = 8, 'note', 'Informed stewardship not fear.'),
    jsonb_build_object('key', 'decision_traceability', 'label', 'Decision traceability — six items', 'met', jsonb_array_length(public._bgbp123_decision_traceability()) = 6, 'note', null),
    jsonb_build_object('key', 'effectiveness_insights', 'label', 'Board effectiveness — seven process reflections', 'met', jsonb_array_length(public._bgbp123_board_effectiveness_insights()) = 7, 'note', 'Process improvement — not director evaluation.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — six never rules', 'met', jsonb_array_length(public._bgbp123_companion_limitations()) = 6, 'note', 'No voting or director evaluation.'),
    jsonb_build_object('key', 'knowledge_library', 'label', 'Board knowledge library — seven assets', 'met', jsonb_array_length(public._bgbp123_board_knowledge_library()) = 7, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._bgbp123_cross_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._bgbp123_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase67_preserved', 'label', 'Phase 67 _bgcbp_* scaffolds preserved', 'met', jsonb_array_length(public._bgcbp_objectives()) >= 6, 'note', 'Phase 123 layers on Phase 67 — does not replace.'),
    jsonb_build_object('key', 'governance_engagement', 'label', 'Live A.14 governance engagement', 'met', v_engagement ? 'active_policies', 'note', format('%s active policies, %s open violations.', v_active, coalesce((v_engagement->>'open_violations')::int, 0))),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 123 vs Phase 67 distinction documented', 'met', position('Phase 67' in public._bgbp123_distinction_note()) > 0, 'note', public._bgbp123_distinction_note())
  );
end; $$;

create or replace function public._bgbp123_blueprint_block(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '123',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE123_BOARD_GOVERNANCE_COMPANION.md',
    'spec_doc', 'BOARD_GOVERNANCE_COMPANION_ENGINE_PHASE123.md',
    'engine_phase', 'Phase A.14 Governance & Policy Engine',
    'era', 'Enterprise Intelligence Era (121–130)',
    'route', '/app/governance-policy-engine',
    'distinction_note', public._bgbp123_distinction_note(),
    'mission', public._bgbp123_mission(),
    'philosophy', public._bgbp123_philosophy(),
    'abos_principle', public._bgbp123_abos_principle(),
    'vision', public._bgbp123_vision(),
    'objectives', public._bgbp123_objectives(),
    'board_intelligence_center', public._bgbp123_board_intelligence_center(),
    'board_dashboard_displays', public._bgbp123_board_dashboard_displays(),
    'board_briefing_engine', public._bgbp123_board_briefing_engine(),
    'governance_memory_engine', public._bgbp123_governance_memory_engine(),
    'board_companion_supports', public._bgbp123_board_companion_supports(),
    'committee_support', public._bgbp123_committee_support(),
    'risk_oversight_framework', public._bgbp123_risk_oversight_framework(),
    'decision_traceability', public._bgbp123_decision_traceability(),
    'board_effectiveness_insights', public._bgbp123_board_effectiveness_insights(),
    'companion_limitations', public._bgbp123_companion_limitations(),
    'self_love_governance', public._bgbp123_self_love_governance(),
    'board_knowledge_library', public._bgbp123_board_knowledge_library(),
    'cross_links', public._bgbp123_cross_links(),
    'limitation_principles', public._bgbp123_limitation_principles(),
    'companion_adaptation', public._bgbp123_companion_adaptation(),
    'success_metrics', public._bgbp123_success_metrics(),
    'success_criteria', public._bgbp123_success_criteria(p_org_id),
    'engagement_summary', public._bgbp123_engagement_summary(p_org_id),
    'privacy_note', 'Metadata only — financial summaries scaffold framing, no raw records, no director evaluation.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.14 + Phase 67 fields; append Phase 123
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_policy_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.governance_settings;
  v_pending_approvals int;
begin
  perform public._irp_require_permission('governance.view');
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);
  v_settings := public._gpe_ensure_settings(v_org_id);

  select count(*) into v_pending_approvals
  from public.ai_action_requests where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Tenant-aware governance with human oversight for sensitive actions, transparent decision-making, and full audit support.',
    'safety_note', 'High and critical risk actions always require human approval. Level 4 critical actions are prohibited for AI.',
    'principles', jsonb_build_array(
      'Tenant-aware governance',
      'Human oversight for sensitive actions',
      'Transparent decision-making',
      'Configurable policies',
      'Full audit support'
    ),
    'settings', jsonb_build_object(
      'ai_autonomy_level', v_settings.ai_autonomy_level,
      'retention_defaults', v_settings.retention_defaults,
      'review_cadence_days', v_settings.review_cadence_days
    ),
    'active_policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'policy_key', p.policy_key, 'policy_name', p.policy_name,
        'category', p.category, 'status', p.status, 'configuration', p.configuration
      ) order by p.category, p.policy_name)
      from public.organization_policies p
      where p.organization_id = v_org_id and p.status = 'active'
    ), '[]'::jsonb),
    'policy_violations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'policy_id', v.policy_id, 'policy_name', p.policy_name,
        'violation_type', v.violation_type, 'severity', v.severity,
        'description', v.description, 'status', v.status, 'detected_at', v.detected_at
      ) order by v.detected_at desc)
      from public.policy_violations v
      join public.organization_policies p on p.id = v.policy_id
      where v.organization_id = v_org_id and v.status in ('open', 'acknowledged') limit 15
    ), '[]'::jsonb),
    'upcoming_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'policy_id', r.policy_id, 'policy_name', p.policy_name,
        'scheduled_at', r.scheduled_at, 'status', r.status, 'owner_user_id', r.owner_user_id
      ) order by r.scheduled_at asc)
      from public.policy_reviews r
      join public.organization_policies p on p.id = r.policy_id
      where r.organization_id = v_org_id and r.status in ('scheduled', 'overdue') limit 10
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'action_key', a.action_key, 'risk_level', a.risk_level,
        'status', a.status, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.ai_action_requests a
      where a.organization_id = v_org_id and a.status = 'pending' limit 10
    ), '[]'::jsonb),
    'pending_approval_count', v_pending_approvals,
    'approval_requirements', jsonb_build_object(
      'low', public._gpe_check_approval_requirements(v_org_id, 'low'),
      'medium', public._gpe_check_approval_requirements(v_org_id, 'medium'),
      'high', public._gpe_check_approval_requirements(v_org_id, 'high')
    ),
    'governance_recommendations', coalesce((
      select jsonb_agg(rec order by (rec->>'priority')::int)
      from (
        select jsonb_build_object(
          'key', 'review_high_risk_pending',
          'title', 'Review pending high-risk approvals',
          'priority', 1,
          'reason', 'High-risk AI actions require owner approval per governance policy'
        ) as rec
        where v_pending_approvals > 0
        union all
        select jsonb_build_object(
          'key', 'schedule_policy_review',
          'title', 'Schedule quarterly policy review',
          'priority', 2,
          'reason', 'Regular policy reviews maintain governance health'
        ) as rec
        where not exists (
          select 1 from public.policy_reviews
          where organization_id = v_org_id and status = 'scheduled'
            and scheduled_at > now()
        )
        union all
        select jsonb_build_object(
          'key', 'run_violation_scan',
          'title', 'Run policy violation scan',
          'priority', 3,
          'reason', 'Detect drift from active governance policies'
        ) as rec
        where exists (
          select 1 from public.organization_policies
          where organization_id = v_org_id and status = 'active'
        )
      ) s
    ), '[]'::jsonb),
    'policy_categories', jsonb_build_array(
      'ai_autonomy', 'approval', 'support', 'access', 'knowledge_publishing', 'integration', 'retention'
    ),
    'autonomy_levels', jsonb_build_array(
      'advisory_only', 'approval_required', 'limited_automation', 'organization_defined'
    ),
    'integrates_with', jsonb_build_array('action_policies', 'ai_action_requests', 'audit_logs', 'trust_action_engine'),
    'implementation_blueprint_phase67', jsonb_build_object(
      'phase', 'Phase 67 — Board & Governance Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE67_BOARD_GOVERNANCE_COMPANION.md',
      'engine_phase', 'Phase A.14 Governance & Policy Engine',
      'route', '/app/governance-policy-engine',
      'mapping_note', 'ABOS Blueprint Phase 67 extends A.14 with board preparation, strategic oversight, risk awareness, and governance companion patterns. Distinct from Security Compliance repo Phase 67 at /app/security.'
    ),
    'board_governance_companion_note', 'Board & Governance Companion Engine (ABOS Phase 67) — extends Governance & Policy A.14 with board preparation, meeting support, strategic oversight, and decision continuity.',
    'blueprint_distinction_note', public._bgcbp_distinction_note(),
    'blueprint_mission', public._bgcbp_mission(),
    'blueprint_philosophy', public._bgcbp_philosophy(),
    'blueprint_abos_principle', public._bgcbp_abos_principle(),
    'vision', 'Thoughtful, prepared, effective boards — Our governance conversations have become more meaningful.',
    'blueprint_objectives', public._bgcbp_objectives(),
    'board_preparation', public._bgcbp_board_preparation(),
    'board_meeting_support', public._bgcbp_board_meeting_support(),
    'strategic_oversight', public._bgcbp_strategic_oversight(),
    'risk_awareness', public._bgcbp_risk_awareness(),
    'blueprint_governance_principles', public._bgcbp_governance_principles(),
    'decision_continuity', public._bgcbp_decision_continuity(),
    'self_love_connection', public._bgcbp_self_love_connection(),
    'trust_connection', public._bgcbp_trust_connection(),
    'dogfooding', public._bgcbp_dogfooding(),
    'blueprint_integration_links', public._bgcbp_integration_links(),
    'engagement_summary', public._bgcbp_engagement_summary(v_org_id),
    'success_criteria', public._bgcbp_success_criteria(v_org_id),
    'vision_phrases', public._bgcbp_vision_phrases(),
    'metadata_note', 'Board companion uses metadata only — no raw financial records, no PII. Financial summaries are scaffold framing only.',
    'implementation_blueprint_phase123', public._bgbp123_blueprint_block(v_org_id),
    'board_governance_companion_phase123_note', 'Enterprise Intelligence Phase 123 — Board & Governance Companion deepens board intelligence, briefing, governance memory, and committee support on Phase 67 scaffolds. Directors decide — Aipify informs.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 16 + A.14 + Phase 67 fields; append Phase 123
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_policy_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'active_policies', (select count(*) from public.organization_policies where organization_id = v_org_id and status = 'active'),
    'open_violations', (select count(*) from public.policy_violations where organization_id = v_org_id and status = 'open'),
    'pending_approvals', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'pending'),
    'upcoming_reviews', (select count(*) from public.policy_reviews where organization_id = v_org_id and status = 'scheduled' and scheduled_at >= now()),
    'philosophy', 'Configurable governance policies with human oversight.',
    'quality_guardian_blueprint_note', 'ABOS Phase 16 — governance summary also visible on Quality Guardian dashboard at /app/quality-guardian-engine.',
    'implementation_blueprint_phase67', jsonb_build_object(
      'phase', 'Phase 67 — Board & Governance Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE67_BOARD_GOVERNANCE_COMPANION.md',
      'engine_phase', 'Phase A.14 Governance & Policy Engine',
      'route', '/app/governance-policy-engine'
    ),
    'mission', public._bgcbp_mission(),
    'abos_principle', public._bgcbp_abos_principle(),
    'engagement_summary', public._bgcbp_engagement_summary(v_org_id),
    'blueprint_note', 'Board & Governance Companion Engine (ABOS Phase 67) — extends A.14 with board preparation, strategic oversight, and live success criteria.',
    'governance_note', 'Governance safeguards long-term wellbeing — directors decide, Aipify informs.',
    'implementation_blueprint_phase123', jsonb_build_object(
      'phase', 'Phase 123 — Board & Governance Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE123_BOARD_GOVERNANCE_COMPANION.md',
      'spec_doc', 'BOARD_GOVERNANCE_COMPANION_ENGINE_PHASE123.md',
      'engine_phase', 'Phase A.14 Governance & Policy Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/governance-policy-engine'
    ),
    'phase123_mission', public._bgbp123_mission(),
    'phase123_abos_principle', public._bgbp123_abos_principle(),
    'phase123_engagement_summary', public._bgbp123_engagement_summary(v_org_id),
    'phase123_note', 'Enterprise Intelligence Phase 123 deepens board intelligence on Phase 67 — metadata only, directors accountable.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._bgbp123_distinction_note() to authenticated;
grant execute on function public._bgbp123_mission() to authenticated;
grant execute on function public._bgbp123_philosophy() to authenticated;
grant execute on function public._bgbp123_abos_principle() to authenticated;
grant execute on function public._bgbp123_vision() to authenticated;
grant execute on function public._bgbp123_objectives() to authenticated;
grant execute on function public._bgbp123_board_intelligence_center() to authenticated;
grant execute on function public._bgbp123_board_dashboard_displays() to authenticated;
grant execute on function public._bgbp123_board_briefing_engine() to authenticated;
grant execute on function public._bgbp123_governance_memory_engine() to authenticated;
grant execute on function public._bgbp123_board_companion_supports() to authenticated;
grant execute on function public._bgbp123_committee_support() to authenticated;
grant execute on function public._bgbp123_risk_oversight_framework() to authenticated;
grant execute on function public._bgbp123_decision_traceability() to authenticated;
grant execute on function public._bgbp123_board_effectiveness_insights() to authenticated;
grant execute on function public._bgbp123_companion_limitations() to authenticated;
grant execute on function public._bgbp123_self_love_governance() to authenticated;
grant execute on function public._bgbp123_board_knowledge_library() to authenticated;
grant execute on function public._bgbp123_cross_links() to authenticated;
grant execute on function public._bgbp123_limitation_principles() to authenticated;
grant execute on function public._bgbp123_companion_adaptation() to authenticated;
grant execute on function public._bgbp123_success_metrics() to authenticated;
grant execute on function public._bgbp123_engagement_summary(uuid) to authenticated;
grant execute on function public._bgbp123_success_criteria(uuid) to authenticated;
grant execute on function public._bgbp123_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'board-governance-companion-phase123', 'Board & Governance Companion (Enterprise Phase 123)',
  'Enterprise Intelligence Phase 123 — Board & Governance Companion deepens A.14 + Blueprint Phase 67 with board intelligence, briefing, governance memory, and committee support.',
  'authenticated', 109
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'board-governance-companion-phase123' and tenant_id is null
);
