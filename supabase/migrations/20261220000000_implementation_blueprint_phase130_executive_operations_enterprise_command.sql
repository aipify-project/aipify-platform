-- Implementation Blueprint Phase 130 — Executive Operations Center & Enterprise Command Engine
-- Enterprise Intelligence Era (121–130) capstone. Extends Operations Center Foundation Engine A.32 + Phases 18, 70, 75.
-- Helpers: _eoccep130_* (never collide with _eocbp_*, _ocf_*, _cfibp_*).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._eoccep130_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Enterprise Intelligence Phase 130 — Executive Operations Center & Enterprise Command Engine at /app/operations-center-foundation-engine. **Era 121–130 capstone** layered on Phase 75 Executive Operations Center (_eocbp_*) and Operations Center Foundation A.32 (_ocf_*, _cfibp_*). Clarity and stewardship NOT command-and-control — humans lead; companions support. **Distinct from Command Center Phase 26** at /app/command-center (presence/notifications — cross-link only). **Distinct from Executive Intelligence Phase 121** at /app/executive-intelligence (leadership companion hub — cross-link). **Distinct from App Ecosystem repo Phase 75** at /app/apps (developer platform — phase number collision). Cross-links Enterprise Intelligence Era phases 121–129: Executive Intelligence 121, Strategic Foresight 122, Board Governance 123 /app/governance-policy-engine, Digital Twin 124, Decision Intelligence 125, Org Memory Legacy 126, Transformation 127 /app/change-management-engine, Resilience Companion 128 /app/organizational-resilience-engine, Organizational Wisdom 129 (planned — cross-link Wisdom Engine A.93 /app/wisdom-engine with distinction until Phase 129 ships). Ecosystem era 113–120 cross-links where relevant. Helpers _eoccep130_* only. Metadata only — no surveillance.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._eoccep130_mission()
returns text language sql immutable as $$
  select 'Unify executive situational awareness, initiative orchestration, alignment, and decision execution — so leaders steward organizations with clarity, not control.';
$$;

create or replace function public._eoccep130_philosophy()
returns text language sql immutable as $$
  select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Enterprise command is stewardship — clarity enables leadership; overwhelm disables it.';
$$;

create or replace function public._eoccep130_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Executive Operations Center informs, prepares, and connects enterprise intelligence; humans retain authority and accountability. Clarity NOT command-and-control.';
$$;

create or replace function public._eoccep130_vision()
returns text language sql immutable as $$
  select 'Leaders see the whole organization calmly — strategic objectives, operational health, transformation progress, and companion-supported wisdom — without surveillance or pressure.';
$$;

create or replace function public._eoccep130_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'enterprise_situational_awareness', 'label', 'Enterprise situational awareness', 'emoji', '🦉', 'description', 'Unified org view across strategic and operational dimensions — metadata summaries only'),
    jsonb_build_object('key', 'initiative_orchestration', 'label', 'Initiative orchestration', 'emoji', '📈', 'description', 'Portfolio visibility — milestones, dependencies, stakeholders, alignment, resources, outcomes'),
    jsonb_build_object('key', 'executive_alignment', 'label', 'Executive alignment', 'emoji', '🔔', 'description', 'Commitments, responsibilities, decision ownership, follow-ups, shared priorities'),
    jsonb_build_object('key', 'decision_execution', 'label', 'Decision execution', 'emoji', '🦉', 'description', 'Decision visibility, action tracking, outcomes, knowledge integration, learning loops'),
    jsonb_build_object('key', 'companion_network', 'label', 'Executive companion network', 'emoji', '🌹', 'description', 'Leadership, Foresight, Governance, Decision, Transformation, Resilience, Wisdom companions — routes to phases 121–129'),
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational health monitoring', 'emoji', '❤️', 'description', 'Aggregate themes — learning, knowledge, companion adoption, governance, transformation, community, Growth Partner health — metadata only'),
    jsonb_build_object('key', 'review_cycles', 'label', 'Executive review cycles', 'emoji', '🔔', 'description', 'Daily, weekly, monthly, quarterly, annual leadership rhythms — perspective not pressure'),
    jsonb_build_object('key', 'enterprise_memory', 'label', 'Enterprise memory integration', 'emoji', '🦉', 'description', 'Cross-link Org Memory 126, Decision 125, Governance 123, Transformation 127 — never duplicate RPCs')
  );
$$;

create or replace function public._eoccep130_executive_operations_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Operations Center — central leadership environment for clarity and stewardship.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'unified_leadership_view', 'label', 'Unified leadership view', 'description', 'Extends Phase 75 executive dashboard with enterprise command dimensions'),
      jsonb_build_object('key', 'cross_era_intelligence', 'label', 'Cross-era intelligence', 'description', 'Enterprise Intelligence Era 121–129 signals aggregated — cross-link only'),
      jsonb_build_object('key', 'initiative_portfolios', 'label', 'Initiative portfolios', 'description', 'Strategic and transformation initiative visibility — metadata counts'),
      jsonb_build_object('key', 'alignment_tracking', 'label', 'Alignment tracking', 'description', 'Executive commitments and shared priorities — humans set focus'),
      jsonb_build_object('key', 'decision_execution_bridge', 'label', 'Decision execution bridge', 'description', 'Connect decisions to action tracking and outcome learning — cross-link Decision 125'),
      jsonb_build_object('key', 'companion_coordination', 'label', 'Companion coordination', 'description', 'Executive companion network routes — companions support, never command'),
      jsonb_build_object('key', 'review_rhythms', 'label', 'Review rhythms', 'description', 'Structured executive review cycles — daily through annual'),
      jsonb_build_object('key', 'enterprise_knowledge', 'label', 'Enterprise knowledge library', 'description', 'Frameworks, playbooks, reviews, governance and memory assets — metadata references')
    ),
    'boundary_note', 'Executive Operations Center prepares and connects — never replaces human leadership authority.'
  );
$$;

create or replace function public._eoccep130_enterprise_command_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise command dashboard — unified organizational view for stewardship, not surveillance.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'strategic_objectives', 'label', 'Strategic objectives', 'description', 'Goal and OKR advancement — cross-link Strategic Alignment A.55 and Foresight 122'),
      jsonb_build_object('key', 'operational_health', 'label', 'Operational health', 'description', 'Module overview aggregates and operations_events — Phase 18/70 foundation'),
      jsonb_build_object('key', 'priorities', 'label', 'Executive priorities', 'description', 'Top leadership focus — extends Phase 75 priority center'),
      jsonb_build_object('key', 'transformation', 'label', 'Transformation progress', 'description', 'Change and transformation signals — cross-link Transformation 127'),
      jsonb_build_object('key', 'risk', 'label', 'Risk awareness', 'description', 'Operational and resilience risk metadata — cross-link Resilience 128, Risk 81'),
      jsonb_build_object('key', 'companion_activity', 'label', 'Companion activity', 'description', 'Aggregate companion engagement themes — cross-link Marketplace 113, never individual surveillance'),
      jsonb_build_object('key', 'knowledge_signals', 'label', 'Knowledge signals', 'description', 'Knowledge gaps and learning trends — cross-link Aipify University 115, EKE'),
      jsonb_build_object('key', 'gp_updates', 'label', 'Growth Partner updates', 'description', 'Growth Partner ecosystem health — cross-link GP Operations 114; never Affiliate terminology'),
      jsonb_build_object('key', 'community_trends', 'label', 'Community trends', 'description', 'Community collective success patterns — cross-link Community 117'),
      jsonb_build_object('key', 'purpose_metrics', 'label', 'Purpose metrics', 'description', 'Social impact and purpose alignment — cross-link Social Impact 118')
    ),
    'metadata_note', 'Unified view aggregates module overviews, era cross-links, and operations_events — no email, chat, order content, or PII.'
  );
$$;

create or replace function public._eoccep130_initiative_orchestration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Initiative orchestration — portfolio visibility without micromanagement.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'portfolios', 'label', 'Portfolios', 'description', 'Strategic and transformation initiative groupings — metadata status counts'),
      jsonb_build_object('key', 'milestones', 'label', 'Milestones', 'description', 'Milestone progress and upcoming checkpoints — cross-link Goals OKR A.65'),
      jsonb_build_object('key', 'dependencies', 'label', 'Dependencies', 'description', 'Cross-functional and cross-module dependencies — Phase 70 connection visibility'),
      jsonb_build_object('key', 'stakeholders', 'label', 'Stakeholders', 'description', 'Stakeholder mapping scaffolds — cross-link Stakeholder Communication A.53'),
      jsonb_build_object('key', 'alignment', 'label', 'Strategic alignment', 'description', 'Initiative alignment with organizational objectives — cross-link Strategic Alignment A.55'),
      jsonb_build_object('key', 'resources', 'label', 'Resource visibility', 'description', 'Aggregate resource and capacity signals — metadata only, not individual workload scoring'),
      jsonb_build_object('key', 'outcomes', 'label', 'Outcomes', 'description', 'Initiative outcome tracking and learning hooks — cross-link Continuous Improvement A.33')
    ),
    'focus_note', 'Orchestration informs portfolio health — humans decide resource allocation and priorities.'
  );
$$;

create or replace function public._eoccep130_executive_alignment()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive alignment — shared clarity on commitments and responsibilities.',
    'alignment_elements', jsonb_build_array(
      jsonb_build_object('key', 'commitments', 'label', 'Leadership commitments', 'description', 'Upcoming and open leadership commitments — calendar-adjacent metadata'),
      jsonb_build_object('key', 'responsibilities', 'label', 'Responsibilities', 'description', 'Decision and initiative ownership clarity — cross-link Digital Twin 124 role model'),
      jsonb_build_object('key', 'dependencies', 'label', 'Alignment dependencies', 'description', 'Cross-leader dependencies and handoffs — dialogue not surveillance'),
      jsonb_build_object('key', 'decision_ownership', 'label', 'Decision ownership', 'description', 'Who decides what — cross-link Decision Intelligence 125 and Governance 123'),
      jsonb_build_object('key', 'follow_ups', 'label', 'Follow-ups', 'description', 'Open executive follow-ups and action items — cross-link Meeting A.61'),
      jsonb_build_object('key', 'shared_priorities', 'label', 'Shared priorities', 'description', 'Leadership team shared priority themes — humans set priorities')
    ),
    'alignment_note', 'Alignment scaffolds clarity — never dictates where leaders must spend time.'
  );
$$;

create or replace function public._eoccep130_decision_execution()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision execution — connect decisions to visible action, outcomes, and learning.',
    'execution_elements', jsonb_build_array(
      jsonb_build_object('key', 'decision_visibility', 'label', 'Decision visibility', 'description', 'Executive decisions awaiting review and recent outcomes — cross-link Decision 125'),
      jsonb_build_object('key', 'action_tracking', 'label', 'Action tracking', 'description', 'Open action items from leadership decisions — metadata via operations_events'),
      jsonb_build_object('key', 'outcomes', 'label', 'Outcome tracking', 'description', 'Decision outcome learning loops — metadata summaries, no raw transcripts'),
      jsonb_build_object('key', 'knowledge_integration', 'label', 'Knowledge integration', 'description', 'Capture decision context in organizational memory — cross-link Org Memory 126'),
      jsonb_build_object('key', 'learning_loops', 'label', 'Learning loops', 'description', 'Post-decision reflection and assumption review — cross-link Decision 125 journals'),
      jsonb_build_object('key', 'reflection', 'label', 'Executive reflection', 'description', 'Structured reflection prompts — cross-link Executive Reflection Blueprint 82, Self Love A.76')
    ),
    'human_decides_note', 'Why connect decisions to execution? So leadership sees whether intentions became outcomes — Aipify tracks metadata; humans decide and reflect.'
  );
$$;

create or replace function public._eoccep130_executive_companion_network()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive companion network — specialized companions support leadership across the Enterprise Intelligence Era.',
    'companions', jsonb_build_array(
      jsonb_build_object('key', 'leadership', 'label', 'Leadership Companion', 'phase', '121', 'route', '/app/executive-intelligence', 'description', 'Executive Intelligence & Leadership Companion — era opening hub'),
      jsonb_build_object('key', 'foresight', 'label', 'Foresight Companion', 'phase', '122', 'route', '/app/strategic-foresight-engine', 'description', 'Strategic Intelligence & Foresight — foresight not prediction'),
      jsonb_build_object('key', 'governance', 'label', 'Governance Companion', 'phase', '123', 'route', '/app/governance-policy-engine', 'description', 'Board & Governance Companion — human oversight for sensitive actions'),
      jsonb_build_object('key', 'decision', 'label', 'Decision Companion', 'phase', '125', 'route', '/app/decision-intelligence-engine', 'description', 'Decision Intelligence & Executive Advisory — humans decide outcomes'),
      jsonb_build_object('key', 'transformation', 'label', 'Transformation Companion', 'phase', '127', 'route', '/app/change-management-engine', 'description', 'Transformation Orchestration & Change Companion'),
      jsonb_build_object('key', 'resilience', 'label', 'Resilience Companion', 'phase', '128', 'route', '/app/organizational-resilience-engine', 'description', 'Resilience & Continuity Companion — readiness not command'),
      jsonb_build_object('key', 'wisdom', 'label', 'Wisdom Companion', 'phase', '129', 'route', '/app/wisdom-engine', 'description', 'Organizational Wisdom & Ethical Intelligence (Phase 129 planned) — cross-link Wisdom Engine A.93 until dedicated Phase 129 surface ships; experience-to-guidance, not surveillance')
    ),
    'can_companions_decide', 'No. Companions prepare context, surface patterns, and suggest scaffolds — humans retain decision authority and accountability.',
    'boundary_note', 'Companion network coordinates cross-links — never override authority, issue directives, or replace accountability.'
  );
$$;

create or replace function public._eoccep130_organizational_health_monitoring()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational health monitoring — aggregate themes for leadership awareness, NOT employee surveillance.',
    'themes', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'learning', 'theme', 'Learning & capability', 'description', 'Learning trends — cross-link Aipify University 115, Learning A.36'),
      jsonb_build_object('emoji', '🦉', 'key', 'knowledge', 'theme', 'Knowledge health', 'description', 'Knowledge gap and approval trends — cross-link EKE, KC A.5'),
      jsonb_build_object('emoji', '🌹', 'key', 'companion_adoption', 'theme', 'Companion adoption', 'description', 'Aggregate companion usage themes — cross-link Marketplace 113; no individual scoring'),
      jsonb_build_object('emoji', '🔔', 'key', 'governance', 'theme', 'Governance strength', 'description', 'Policy and approval health — cross-link Governance 123, Trust 116'),
      jsonb_build_object('emoji', '📈', 'key', 'transformation', 'theme', 'Transformation health', 'description', 'Change adoption signals — cross-link Transformation 127'),
      jsonb_build_object('emoji', '🌹', 'key', 'community', 'theme', 'Community vitality', 'description', 'Community collective success — cross-link Community 117'),
      jsonb_build_object('emoji', '🦉', 'key', 'gp_health', 'theme', 'Growth Partner health', 'description', 'Growth Partner ecosystem signals — cross-link GP Operations 114'),
      jsonb_build_object('emoji', '❤️', 'key', 'employee_support', 'theme', 'Employee support patterns', 'description', 'Support and wellbeing-aware operational patterns — metadata only, never punitive individual metrics')
    ),
    'surveillance_boundary', 'Metadata and aggregate themes only — no PII, no individual performance surveillance, no punitive scoring.'
  );
$$;

create or replace function public._eoccep130_executive_review_cycles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'daily', 'label', 'Daily rhythm', 'emoji', '🌹', 'description', 'Morning perspective — extends Phase 75 daily executive briefings; positive momentum and commitments'),
    jsonb_build_object('key', 'weekly', 'label', 'Weekly rhythm', 'emoji', '🦉', 'description', 'Priority review and cross-functional dependencies — intentional focus'),
    jsonb_build_object('key', 'monthly', 'label', 'Monthly rhythm', 'emoji', '📈', 'description', 'Initiative portfolio and organizational health themes — metadata summaries'),
    jsonb_build_object('key', 'quarterly', 'label', 'Quarterly rhythm', 'emoji', '🔔', 'description', 'Strategic alignment, governance review, transformation milestones — cross-link era companions'),
    jsonb_build_object('key', 'annual', 'label', 'Annual rhythm', 'emoji', '🦉', 'description', 'Enterprise memory, legacy, and purpose reflection — cross-link Org Memory 126, Social Impact 118')
  );
$$;

create or replace function public._eoccep130_enterprise_memory_integration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise memory integration — connect executive operations to organizational memory and legacy.',
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'org_memory', 'label', 'Organizational Memory & Legacy (126)', 'route', '/app/organizational-memory-engine', 'description', 'Memory archives, succession intelligence, heritage library — cross-link only'),
      jsonb_build_object('key', 'decision_memory', 'label', 'Decision Intelligence (125)', 'route', '/app/decision-intelligence-engine', 'description', 'Decision journals and outcome learning — metadata only'),
      jsonb_build_object('key', 'governance_memory', 'label', 'Board Governance (123)', 'route', '/app/governance-policy-engine', 'description', 'Governance frameworks and review history — cross-link only'),
      jsonb_build_object('key', 'transformation_memory', 'label', 'Transformation (127)', 'route', '/app/change-management-engine', 'description', 'Transformation memory and change adoption — cross-link only')
    ),
    'boundary_note', 'Integration scaffolds cross-links — never duplicate OME, Decision, or Governance RPCs.'
  );
$$;

create or replace function public._eoccep130_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_override_authority', 'limitation', 'Never override human authority', 'description', 'Companions cannot approve, commit, or bind the organization'),
    jsonb_build_object('key', 'no_directives', 'limitation', 'Never issue directives', 'description', 'Clarity not command-and-control — suggestions and scaffolds only'),
    jsonb_build_object('key', 'no_replace_accountability', 'limitation', 'Never replace accountability', 'description', 'Leaders remain accountable for outcomes — companions support preparation'),
    jsonb_build_object('key', 'no_conceal_uncertainty', 'limitation', 'Never conceal uncertainty', 'description', 'Low confidence triggers escalation and transparent assumptions'),
    jsonb_build_object('key', 'no_suppress_dissent', 'limitation', 'Never suppress dissent', 'description', 'Ethical intelligence welcomes diverse perspectives — cross-link Wisdom 129 / A.93')
  );
$$;

create or replace function public._eoccep130_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable enterprise leadership requires reflection, recovery, perspective, boundaries, and recognition.',
    'practices', jsonb_build_array(
      'Reflection — leadership benefits from pausing to see the whole picture',
      'Recovery — enterprise command must not become relentless pressure',
      'Perspective — clarity emerges when noise is reduced across the organization',
      'Boundaries — sustainable leadership protects focus and wellbeing',
      'Recognition — celebrate progress and consistency, not perfection alone'
    ),
    'why_self_love', 'Enterprise leadership is isolating — Self Love supports reflection and recovery so leaders steward with wisdom, not burnout.',
    'journey_phrase', 'Extraordinary leadership is built through consistency rather than perfection.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable leadership — principle only; Executive Operations Center stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._eoccep130_enterprise_knowledge_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'frameworks', 'label', 'Executive frameworks', 'description', 'Approved leadership and governance frameworks — KC cross-link'),
    jsonb_build_object('key', 'playbooks', 'label', 'Operational playbooks', 'description', 'Cross-module operational playbooks — metadata references'),
    jsonb_build_object('key', 'reviews', 'label', 'Review histories', 'description', 'Executive review cycle summaries — aggregate metadata'),
    jsonb_build_object('key', 'governance_assets', 'label', 'Governance assets', 'description', 'Policy and board governance references — cross-link Governance 123'),
    jsonb_build_object('key', 'transformation_assets', 'label', 'Transformation assets', 'description', 'Change and transformation guides — cross-link Transformation 127'),
    jsonb_build_object('key', 'memory_assets', 'label', 'Memory assets', 'description', 'Organizational memory and legacy references — cross-link Org Memory 126')
  );
$$;

create or replace function public._eoccep130_era_enterprise_intelligence_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', '121', 'label', 'Executive Intelligence & Leadership Companion', 'route', '/app/executive-intelligence'),
    jsonb_build_object('phase', '122', 'label', 'Strategic Intelligence & Foresight', 'route', '/app/strategic-foresight-engine'),
    jsonb_build_object('phase', '123', 'label', 'Board & Governance Companion', 'route', '/app/governance-policy-engine'),
    jsonb_build_object('phase', '124', 'label', 'Organizational Digital Twin', 'route', '/app/digital-twin'),
    jsonb_build_object('phase', '125', 'label', 'Decision Intelligence & Executive Advisory', 'route', '/app/decision-intelligence-engine'),
    jsonb_build_object('phase', '126', 'label', 'Organizational Memory & Legacy', 'route', '/app/organizational-memory-engine'),
    jsonb_build_object('phase', '127', 'label', 'Transformation Orchestration & Change Companion', 'route', '/app/change-management-engine'),
    jsonb_build_object('phase', '128', 'label', 'Resilience & Continuity Companion', 'route', '/app/organizational-resilience-engine'),
    jsonb_build_object('phase', '129', 'label', 'Organizational Wisdom & Ethical Intelligence (planned — Wisdom Engine A.93 interim)', 'route', '/app/wisdom-engine'),
    jsonb_build_object('phase', '130', 'label', 'Executive Operations Center & Enterprise Command (capstone)', 'route', '/app/operations-center-foundation-engine')
  );
$$;

create or replace function public._eoccep130_integration_links()
returns jsonb language sql immutable as $$
  select (
    public._eoccep130_era_enterprise_intelligence_cross_links()
    || jsonb_build_array(
      jsonb_build_object('label', 'Command Center (Phase 26)', 'route', '/app/command-center', 'note', 'Presence and notifications — distinct from enterprise command stewardship'),
      jsonb_build_object('label', 'Executive Operations Center (Phase 75)', 'route', '/app/operations-center-foundation-engine', 'note', 'Layered foundation — Phase 130 extends Phase 75 executive lens'),
      jsonb_build_object('label', 'Cross-Functional Intelligence (Phase 70)', 'route', '/app/operations-center-foundation-engine', 'note', 'Same engine — connection visibility preserved'),
      jsonb_build_object('label', 'Companion Marketplace (113)', 'route', '/app/companion-marketplace', 'note', 'Digital employee companions — aggregate themes only'),
      jsonb_build_object('label', 'Growth Partner Operations (114)', 'route', '/app/growth-partner-operations', 'note', 'Growth Partner ecosystem — never Affiliate terminology'),
      jsonb_build_object('label', 'Aipify University (115)', 'route', '/app/aipify-university', 'note', 'Continuous learning hub'),
      jsonb_build_object('label', 'Trust & Reputation (116)', 'route', '/app/trust-reputation-engine', 'note', 'Trust and relationship intelligence'),
      jsonb_build_object('label', 'Community (117)', 'route', '/app/community', 'note', 'Community collective success'),
      jsonb_build_object('label', 'Social Impact & Purpose (118)', 'route', '/app/social-impact-purpose-engine', 'note', 'Purpose metrics cross-link'),
      jsonb_build_object('label', 'Ecosystem Governance (119)', 'route', '/app/ecosystem-governance', 'note', 'Ecosystem-wide governance'),
      jsonb_build_object('label', 'Ecosystem Orchestration (120)', 'route', '/app/ecosystem-orchestration', 'note', 'Ecosystem Era 111–120 capstone'),
      jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable leadership — principle only'),
      jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive summaries — cross-link only')
    )
  );
$$;

create or replace function public._eoccep130_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group leadership validates Enterprise Command internally — era companion coordination, initiative orchestration, and executive review rhythms.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Enterprise Intelligence Era capstone on A.32',
      'focus', jsonb_build_array(
        'Enterprise situational awareness across product, ecosystem, and customer success',
        'Initiative portfolio visibility for leadership team',
        'Executive alignment across era companion surfaces 121–129',
        'Decision execution tracking with metadata-only audit'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce enterprise command overview',
      'focus', jsonb_build_array(
        'Executive visibility into support, operations, and Growth Partner handoffs',
        'Transformation and resilience cross-links for pilot milestones',
        'Community and purpose metrics at leadership altitude'
      )
    )
  );
$$;

create or replace function public._eoccep130_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Enterprise command is stewardship — clarity enables leadership; overwhelm disables it.',
    'Leaders see the whole organization calmly — without surveillance or pressure.',
    'People First. Technology Second. Self Love. Wisdom before speed.',
    'Companionship before replacement — humans lead; Aipify informs and prepares.',
    'The Enterprise Intelligence Era closes with unified executive operations — not centralized control.'
  );
$$;

create or replace function public._eoccep130_privacy_note()
returns text language sql immutable as $$
  select 'Enterprise Command blueprint data is metadata only — aggregate module counts, era cross-link scaffolds, and documented leadership patterns. No PII, no employee surveillance, no punitive individual scoring. Clarity NOT command-and-control; humans decide.';
$$;

create or replace function public._eoccep130_era_capstone_note()
returns text language sql immutable as $$
  select 'Enterprise Intelligence Era (121–130) capstone — Phase 130 unifies executive operations on Operations Center Foundation A.32 (Phases 18, 70, 75 preserved). Era phases: 121 Executive Intelligence · 122 Strategic Foresight · 123 Board Governance · 124 Digital Twin · 125 Decision Intelligence · 126 Org Memory Legacy · 127 Transformation · 128 Resilience Companion · 129 Organizational Wisdom (planned — interim Wisdom Engine A.93) · 130 Executive Operations & Enterprise Command.';
$$;

create or replace function public._eoccep130_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_eocbp jsonb;
  v_modules jsonb;
  v_open_events int := 0;
begin
  v_eocbp := public._eocbp_engagement_summary(p_org_id);
  v_modules := public._ocf_module_overviews(p_org_id);

  select count(*) into v_open_events
  from public.operations_events
  where organization_id = p_org_id and status in ('new', 'acknowledged', 'in_progress');

  return jsonb_build_object(
    'module_overview_blocks', coalesce((v_eocbp->>'module_overview_blocks')::int, 0),
    'open_operations_events', coalesce(v_open_events, 0),
    'urgent_operations_events', coalesce((v_eocbp->>'urgent_operations_events')::int, 0),
    'pending_leadership_approvals', coalesce((v_eocbp->>'pending_leadership_approvals')::int, 0),
    'executive_dashboard_dimensions', jsonb_array_length(public._eoccep130_enterprise_command_dashboard()->'dimensions'),
    'initiative_orchestration_elements', jsonb_array_length(public._eoccep130_initiative_orchestration()->'elements'),
    'companion_network_count', jsonb_array_length(public._eoccep130_executive_companion_network()->'companions'),
    'health_monitoring_themes', jsonb_array_length(public._eoccep130_organizational_health_monitoring()->'themes'),
    'review_cycle_count', jsonb_array_length(public._eoccep130_executive_review_cycles()),
    'era_cross_link_count', jsonb_array_length(public._eoccep130_era_enterprise_intelligence_cross_links()),
    'companion_limitations_count', jsonb_array_length(public._eoccep130_companion_limitations()),
    'privacy_note', public._eoccep130_privacy_note()
  );
end; $$;

create or replace function public._eoccep130_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._eoccep130_engagement_summary(p_org_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'enterprise_command_dashboard',
      'label', 'Enterprise command dashboard — unified org view dimensions documented',
      'met', jsonb_array_length(public._eoccep130_enterprise_command_dashboard()->'dimensions') >= 10,
      'note', 'Strategic objectives through purpose metrics — metadata only.'
    ),
    jsonb_build_object(
      'key', 'initiative_orchestration',
      'label', 'Initiative orchestration — portfolio elements documented',
      'met', jsonb_array_length(public._eoccep130_initiative_orchestration()->'elements') >= 7,
      'note', 'Portfolios through outcomes — humans decide allocation.'
    ),
    jsonb_build_object(
      'key', 'executive_alignment',
      'label', 'Executive alignment — commitment and ownership elements documented',
      'met', jsonb_array_length(public._eoccep130_executive_alignment()->'alignment_elements') >= 6,
      'note', 'Alignment scaffolds clarity — never dictates focus.'
    ),
    jsonb_build_object(
      'key', 'decision_execution',
      'label', 'Decision execution — visibility and learning loops documented',
      'met', jsonb_array_length(public._eoccep130_decision_execution()->'execution_elements') >= 6,
      'note', 'Connect decisions to outcomes — cross-link Decision 125.'
    ),
    jsonb_build_object(
      'key', 'companion_network',
      'label', 'Executive companion network — era companions 121–129 cross-linked',
      'met', jsonb_array_length(public._eoccep130_executive_companion_network()->'companions') >= 7,
      'note', 'Companions support — humans decide.'
    ),
    jsonb_build_object(
      'key', 'health_monitoring',
      'label', 'Organizational health monitoring — aggregate themes without surveillance',
      'met', jsonb_array_length(public._eoccep130_organizational_health_monitoring()->'themes') >= 8,
      'note', 'Metadata themes only — no individual scoring.'
    ),
    jsonb_build_object(
      'key', 'review_cycles',
      'label', 'Executive review cycles — daily through annual rhythms documented',
      'met', jsonb_array_length(public._eoccep130_executive_review_cycles()) >= 5,
      'note', 'Perspective not pressure.'
    ),
    jsonb_build_object(
      'key', 'enterprise_memory',
      'label', 'Enterprise memory integration — cross-links to Org Memory, Decision, Governance, Transformation',
      'met', jsonb_array_length(public._eoccep130_enterprise_memory_integration()->'cross_links') >= 4,
      'note', 'Cross-link only — never duplicate RPCs.'
    ),
    jsonb_build_object(
      'key', 'companion_limitations',
      'label', 'Companion limitations — authority, directives, accountability boundaries documented',
      'met', jsonb_array_length(public._eoccep130_companion_limitations()) >= 5,
      'note', 'Never override authority or suppress dissent.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable enterprise leadership framing',
      'met', (public._eoccep130_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Reflection, recovery, perspective, boundaries, recognition.'
    ),
    jsonb_build_object(
      'key', 'era_capstone',
      'label', 'Enterprise Intelligence Era capstone — phases 121–130 cross-linked',
      'met', jsonb_array_length(public._eoccep130_era_enterprise_intelligence_cross_links()) >= 10,
      'note', public._eoccep130_era_capstone_note()
    ),
    jsonb_build_object(
      'key', 'phase75_preserved',
      'label', 'Phase 75 Executive Operations Center fields preserved',
      'met', jsonb_array_length(public._eocbp_executive_dashboard()->'dimensions') >= 8,
      'note', 'Layered on A.32 — Phases 18, 70, 75 intact.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group enterprise command validated internally',
      'met', (public._eoccep130_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — clarity NOT command-and-control',
      'met', true,
      'note', 'Humans lead; Aipify informs and prepares.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 18, 70, 75 fields; append Phase 130
-- ---------------------------------------------------------------------------
create or replace function public.get_operations_center_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
begin
  perform public._irp_require_permission('operations.view');
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_user_id);
    end if;
  exception when others then
    v_since := jsonb_build_object(
      'since', now() - interval '7 days',
      'since_source', 'seven_day_fallback',
      'assumption_note', 'Authenticated user required for personalized Since Last Time — using 7-day fallback.'
    );
  end;

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 18 — Operations Center Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 18 maps to Operations Center Foundation Engine A.32 — extend, do not duplicate. Distinct from Operations Dashboard A.9, Command Center Phase 26, and AOC Phase 79.'
    ),
    'mission', 'Centralized operational experience — visibility, coordination, and control across modules.',
    'philosophy', 'Operational clarity creates confidence — reduce noise, increase focus, enable informed action.',
    'abos_principle', 'Reduce noise, increase focus — one operations center for cross-module operational awareness.',
    'vision', 'Teams see what changed, what needs attention, and what improved — with transparent sources and calm coordination.',
    'operations_center_foundation_engine_note', 'Operations Center Engine Foundation (ABOS Phase 18) — extends Operations Center Foundation Engine (Phase A.32).',
    'distinction_note', public._ocf_distinction_note(),
    'operational_objectives', public._ocf_operational_objectives(),
    'module_overviews', public._ocf_module_overviews(v_org_id),
    'since_last_time', coalesce(v_since, jsonb_build_object('since', now() - interval '7 days', 'since_source', 'seven_day_fallback')),
    'companion_communication_examples', public._ocf_companion_communication_examples(),
    'self_love_connection', public._ocf_self_love_connection(),
    'self_love_note', 'Self Love (A.76) supports operational pacing and accomplishment visibility — principle only; Operations Center stores metadata, not wellbeing content.',
    'trust_connection', public._ocf_trust_connection(),
    'data_sources', public._ocf_data_sources(),
    'dogfooding', public._ocf_blueprint_dogfooding(),
    'success_criteria', public._ocf_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._ocf_vision_phrases(),
    'integration_links', public._ocf_integration_links(),
    'safety_note', 'Metadata and summary counts only — no customer email, chat, order content, or PII.',
    'principles', jsonb_build_array(
      'Cross-module aggregation',
      'Action-oriented design',
      'Role-based visibility',
      'Escalation for critical events',
      'Audit-supported accountability',
      'Since Last Time — counts and trends only, no PII'
    ),
    'summary', jsonb_build_object(
      'urgent', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and priority in ('high', 'critical') and status not in ('completed', 'dismissed')), 0),
      'pending_approvals', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and category = 'approvals' and status not in ('completed', 'dismissed')), 0),
      'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0)
    ),
    'urgent_actions', coalesce((
      select jsonb_agg(row_to_json(e) order by case e.priority when 'critical' then 0 when 'high' then 1 else 2 end, e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.priority in ('high', 'critical') and e.status not in ('completed', 'dismissed') limit 10
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status not in ('completed', 'dismissed') limit 25
    ), '[]'::jsonb),
    'recent_completed', coalesce((
      select jsonb_agg(row_to_json(e) order by e.updated_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status = 'completed' limit 10
    ), '[]'::jsonb),
    'implementation_blueprint_phase70', jsonb_build_object(
      'phase', 'Phase 70 — Cross-Functional Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE70_CROSS_FUNCTIONAL_INTELLIGENCE.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 70 extends A.32 (layered with Phase 18) with cross-functional connection visibility, information flow, bottleneck recognition, collaboration opportunities, and live success criteria.'
    ),
    'cross_functional_intelligence_note', 'Cross-Functional Intelligence Engine (ABOS Phase 70) — extends Operations Center Foundation A.32 with systems-thinking visibility across functions.',
    'blueprint_distinction_note', public._cfibp_distinction_note(),
    'blueprint_mission', public._cfibp_mission(),
    'blueprint_philosophy', public._cfibp_philosophy(),
    'blueprint_abos_principle', public._cfibp_abos_principle(),
    'blueprint_objectives', public._cfibp_objectives(),
    'organizational_connections', public._cfibp_organizational_connections(),
    'cross_functional_observations', public._cfibp_cross_functional_observations(),
    'information_flow_visibility', public._cfibp_information_flow_visibility(),
    'bottleneck_identification', public._cfibp_bottleneck_identification(),
    'collaboration_opportunities', public._cfibp_collaboration_opportunities(),
    'blueprint_leadership_insights', public._cfibp_leadership_insights(),
    'blueprint_self_love_connection', public._cfibp_self_love_connection(),
    'blueprint_trust_connection', public._cfibp_trust_connection(),
    'privacy_principles', public._cfibp_privacy_principles(),
    'blueprint_dogfooding', public._cfibp_dogfooding(),
    'blueprint_integration_links', public._cfibp_integration_links(),
    'engagement_summary', public._cfibp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._cfibp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._cfibp_vision_phrases(),
    'blueprint_privacy_note', 'Cross-functional intelligence is metadata only — awareness not surveillance. No individual scoring or punitive interpretation.',
    'implementation_blueprint_phase75', jsonb_build_object(
      'phase', 'Phase 75 — Executive Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE75_EXECUTIVE_OPERATIONS_CENTER.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 75 extends A.32 (layered with Phases 18 and 70) with executive leadership situational awareness, daily briefings, priority center, organizational health overview, meeting continuity, strategic momentum, and live success criteria.'
    ),
    'executive_operations_center_note', 'Executive Operations Center Engine (ABOS Phase 75) — unified executive leadership overview on Operations Center Foundation A.32.',
    'eocbp_distinction_note', public._eocbp_distinction_note(),
    'eocbp_mission', public._eocbp_mission(),
    'eocbp_philosophy', public._eocbp_philosophy(),
    'eocbp_abos_principle', public._eocbp_abos_principle(),
    'eocbp_objectives', public._eocbp_objectives(),
    'eocbp_executive_dashboard', public._eocbp_executive_dashboard(),
    'eocbp_daily_executive_briefings', public._eocbp_daily_executive_briefings(),
    'eocbp_executive_priority_center', public._eocbp_executive_priority_center(),
    'eocbp_organizational_health_overview', public._eocbp_organizational_health_overview(),
    'eocbp_meeting_decision_continuity', public._eocbp_meeting_decision_continuity(),
    'eocbp_strategic_momentum_tracking', public._eocbp_strategic_momentum_tracking(),
    'eocbp_companion_guidance', public._eocbp_companion_guidance(),
    'eocbp_self_love_connection', public._eocbp_self_love_connection(),
    'eocbp_trust_connection', public._eocbp_trust_connection(),
    'eocbp_dogfooding', public._eocbp_dogfooding(),
    'eocbp_integration_links', public._eocbp_integration_links(),
    'eocbp_engagement_summary', public._eocbp_engagement_summary(v_org_id),
    'eocbp_success_criteria', public._eocbp_success_criteria(v_org_id),
    'eocbp_vision_phrases', public._eocbp_vision_phrases(),
    'eocbp_privacy_note', 'Executive operations center is metadata only — clarity not overwhelm. Recommendations optional; humans decide.',
    'implementation_blueprint_phase130', jsonb_build_object(
      'phase', 'Phase 130 — Executive Operations Center & Enterprise Command Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE130_EXECUTIVE_OPERATIONS_ENTERPRISE_COMMAND.md',
      'spec_doc', 'EXECUTIVE_OPERATIONS_CENTER_ENTERPRISE_COMMAND_ENGINE_PHASE130.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'Enterprise Intelligence Phase 130 capstone extends A.32 + Phases 18, 70, 75 with enterprise command dashboard, initiative orchestration, executive alignment, decision execution, companion network, health monitoring, review cycles, and era cross-links. Clarity NOT command-and-control.'
    ),
    'enterprise_command_engine_note', 'Executive Operations Center & Enterprise Command Engine (Enterprise Intelligence Phase 130) — era capstone unifying executive stewardship on Operations Center Foundation A.32.',
    'enterprise_intelligence_era_capstone_note', public._eoccep130_era_capstone_note(),
    'eoccep130_distinction_note', public._eoccep130_distinction_note(),
    'eoccep130_mission', public._eoccep130_mission(),
    'eoccep130_philosophy', public._eoccep130_philosophy(),
    'eoccep130_abos_principle', public._eoccep130_abos_principle(),
    'eoccep130_vision', public._eoccep130_vision(),
    'eoccep130_objectives', public._eoccep130_objectives(),
    'eoccep130_executive_operations_center', public._eoccep130_executive_operations_center(),
    'eoccep130_enterprise_command_dashboard', public._eoccep130_enterprise_command_dashboard(),
    'eoccep130_initiative_orchestration', public._eoccep130_initiative_orchestration(),
    'eoccep130_executive_alignment', public._eoccep130_executive_alignment(),
    'eoccep130_decision_execution', public._eoccep130_decision_execution(),
    'eoccep130_executive_companion_network', public._eoccep130_executive_companion_network(),
    'eoccep130_organizational_health_monitoring', public._eoccep130_organizational_health_monitoring(),
    'eoccep130_executive_review_cycles', public._eoccep130_executive_review_cycles(),
    'eoccep130_enterprise_memory_integration', public._eoccep130_enterprise_memory_integration(),
    'eoccep130_companion_limitations', public._eoccep130_companion_limitations(),
    'eoccep130_self_love_connection', public._eoccep130_self_love_connection(),
    'eoccep130_enterprise_knowledge_library', public._eoccep130_enterprise_knowledge_library(),
    'eoccep130_integration_links', public._eoccep130_integration_links(),
    'eoccep130_era_cross_links', public._eoccep130_era_enterprise_intelligence_cross_links(),
    'eoccep130_dogfooding', public._eoccep130_dogfooding(),
    'eoccep130_engagement_summary', public._eoccep130_engagement_summary(v_org_id),
    'eoccep130_success_criteria', public._eoccep130_success_criteria(v_org_id),
    'eoccep130_vision_phrases', public._eoccep130_vision_phrases(),
    'eoccep130_privacy_note', public._eoccep130_privacy_note()
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 18 + 70 + 75 fields; append Phase 130
-- ---------------------------------------------------------------------------
create or replace function public.get_operations_center_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
  v_engagement jsonb;
  v_eocbp_engagement jsonb;
  v_eoccep130_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);
  v_engagement := public._cfibp_engagement_summary(v_org_id);
  v_eocbp_engagement := public._eocbp_engagement_summary(v_org_id);
  v_eoccep130_engagement := public._eoccep130_engagement_summary(v_org_id);

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_user_id);
    end if;
  exception when others then
    v_since := null;
  end;

  return jsonb_build_object(
    'has_organization', true,
    'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0),
    'urgent_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and priority in ('high', 'critical') and status not in ('completed', 'dismissed')), 0),
    'philosophy', 'Operational clarity creates confidence — centralized visibility, coordination, and control.',
    'mission', 'Centralized operational experience — monitor activities, surface developments, coordinate teams, and enable informed action.',
    'abos_principle', 'Reduce noise, increase focus — one operations center for cross-module awareness.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 18 — Operations Center Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine'
    ),
    'operations_center_foundation_engine_note', 'Operations Center Engine Foundation (ABOS Phase 18) — extends Operations Center Foundation Engine (Phase A.32).',
    'module_overviews', public._ocf_module_overviews(v_org_id),
    'since_last_time', v_since,
    'implementation_blueprint_phase70', jsonb_build_object(
      'phase', 'Phase 70 — Cross-Functional Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE70_CROSS_FUNCTIONAL_INTELLIGENCE.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine'
    ),
    'blueprint_mission', public._cfibp_mission(),
    'blueprint_abos_principle', public._cfibp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Cross-Functional Intelligence Engine (ABOS Phase 70) — extends A.32 with connection visibility, information flow, and live success criteria.',
    'cross_functional_note', 'We are operating more cohesively — understanding how teams and processes interact.',
    'implementation_blueprint_phase75', jsonb_build_object(
      'phase', 'Phase 75 — Executive Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE75_EXECUTIVE_OPERATIONS_CENTER.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine'
    ),
    'eocbp_mission', public._eocbp_mission(),
    'eocbp_abos_principle', public._eocbp_abos_principle(),
    'eocbp_engagement_summary', v_eocbp_engagement,
    'eocbp_note', 'Executive Operations Center Engine (ABOS Phase 75) — unified executive leadership overview with clarity, not overwhelm.',
    'executive_leadership_note', 'Our leaders are better equipped because they have a clearer understanding of what truly matters.',
    'implementation_blueprint_phase130', jsonb_build_object(
      'phase', 'Phase 130 — Executive Operations Center & Enterprise Command Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE130_EXECUTIVE_OPERATIONS_ENTERPRISE_COMMAND.md',
      'spec_doc', 'EXECUTIVE_OPERATIONS_CENTER_ENTERPRISE_COMMAND_ENGINE_PHASE130.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/operations-center-foundation-engine'
    ),
    'eoccep130_mission', public._eoccep130_mission(),
    'eoccep130_abos_principle', public._eoccep130_abos_principle(),
    'eoccep130_engagement_summary', v_eoccep130_engagement,
    'eoccep130_note', 'Executive Operations Center & Enterprise Command Engine (Enterprise Intelligence Phase 130) — era capstone with clarity NOT command-and-control.',
    'enterprise_command_note', 'Enterprise command is stewardship — humans lead; companions support.',
    'enterprise_intelligence_era_capstone_note', public._eoccep130_era_capstone_note()
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._eoccep130_distinction_note() to authenticated;
grant execute on function public._eoccep130_mission() to authenticated;
grant execute on function public._eoccep130_philosophy() to authenticated;
grant execute on function public._eoccep130_abos_principle() to authenticated;
grant execute on function public._eoccep130_vision() to authenticated;
grant execute on function public._eoccep130_objectives() to authenticated;
grant execute on function public._eoccep130_executive_operations_center() to authenticated;
grant execute on function public._eoccep130_enterprise_command_dashboard() to authenticated;
grant execute on function public._eoccep130_initiative_orchestration() to authenticated;
grant execute on function public._eoccep130_executive_alignment() to authenticated;
grant execute on function public._eoccep130_decision_execution() to authenticated;
grant execute on function public._eoccep130_executive_companion_network() to authenticated;
grant execute on function public._eoccep130_organizational_health_monitoring() to authenticated;
grant execute on function public._eoccep130_executive_review_cycles() to authenticated;
grant execute on function public._eoccep130_enterprise_memory_integration() to authenticated;
grant execute on function public._eoccep130_companion_limitations() to authenticated;
grant execute on function public._eoccep130_self_love_connection() to authenticated;
grant execute on function public._eoccep130_enterprise_knowledge_library() to authenticated;
grant execute on function public._eoccep130_era_enterprise_intelligence_cross_links() to authenticated;
grant execute on function public._eoccep130_integration_links() to authenticated;
grant execute on function public._eoccep130_dogfooding() to authenticated;
grant execute on function public._eoccep130_vision_phrases() to authenticated;
grant execute on function public._eoccep130_privacy_note() to authenticated;
grant execute on function public._eoccep130_era_capstone_note() to authenticated;
grant execute on function public._eoccep130_engagement_summary(uuid) to authenticated;
grant execute on function public._eoccep130_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'operations-center-blueprint-phase130', 'Executive Operations Center & Enterprise Command Engine (Enterprise Intelligence Phase 130)',
  'Enterprise Intelligence Era capstone — extends Operations Center Foundation A.32 (Phases 18, 70, 75) with enterprise command dashboard, initiative orchestration, executive alignment, decision execution, companion network, health monitoring, review cycles, and era 121–130 cross-links. Clarity NOT command-and-control.',
  'authenticated', 130
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'operations-center-blueprint-phase130' and tenant_id is null
);
