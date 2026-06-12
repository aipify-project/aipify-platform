-- Implementation Blueprint Phase 126 — Organizational Memory & Legacy Engine
-- Enterprise Intelligence Era (121–130). Extends A.34 + Phase 55 + Blueprint Phase 94.
-- Helpers: _omlebp126_* (never collide with _omlebp94_*, _mcebp_*).
-- Cross-links Legacy A.86 — never duplicate _leg_* / _ltbp_* storage.

-- ---------------------------------------------------------------------------
-- 1. Distinction note (Phase 94 collision)
-- ---------------------------------------------------------------------------
create or replace function public._omlebp126_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Enterprise Intelligence Phase 126 — Organizational Memory & Legacy Engine at /app/organizational-memory-engine. Layers on repo Organizational Memory Engine A.34 (20260805000000), ABOS alignment (20260949000000), Blueprint Phase 55 Memory Continuity (_mcebp_* — 20261005000000), and Blueprint Phase 94 Organizational Memory & Legacy (_omlebp94_* — 20261117000000). Phase 126 deepens Enterprise Intelligence era scaffolding — memory archives, legacy records, succession intelligence, storytelling framework, critical knowledge protection, heritage library, and Legacy Companion — Phase 94 established unified memory + legacy framing; Phase 126 is the Enterprise Intelligence layer on the same route, not a duplicate. **Phase theme collision:** Blueprint Phase 94 and Enterprise Intelligence Phase 126 share "Organizational Memory & Legacy" — Phase 126 layers on Phase 94; all _omlebp94_* fields preserved. Cross-links Decision Intelligence Phase 125 /app/decision-intelligence-engine, Executive Intelligence Phase 121 /app/executive-intelligence, Digital Twin Phase 124 /app/digital-twin, Legacy A.86 /app/legacy-engine, Employee Knowledge /app/settings/employee-knowledge, KC A.5, Self Love A.76, Aipify University Phase 115, Continuity Blueprint 73 /app/continuity. Helpers _omlebp126_* only. Metadata/governed retention only — humans custodians of legacy; no altering historical records via Companion.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._omlebp126_mission()
returns text language sql immutable as $$
  select 'Preserve organizational wisdom — decisions, experiences, principles, and stories — so continuity strengthens identity and future actions become wiser.';
$$;

create or replace function public._omlebp126_philosophy()
returns text language sql immutable as $$
  select 'Organizations forget — memory is an asset, not an accident. Wisdom before speed. People First. Humans are custodians of legacy; Aipify informs, prepares, and protects continuity without rewriting history.';
$$;

create or replace function public._omlebp126_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Organizational Memory & Legacy preserves what shaped the organization. Knowledge tells us what we know; memory reminds us who we have become. Governed retention with transparency — no surveillance.';
$$;

create or replace function public._omlebp126_vision()
returns text language sql immutable as $$
  select 'Organizations should not have to relearn the same lessons — experience deserves preservation, reflection creates wisdom, and institutional memory strengthens continuity across generations.';
$$;

create or replace function public._omlebp126_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'preserve_wisdom', 'label', 'Preserve wisdom', 'emoji', '🦉', 'description', 'Transform decisions and experiences into lasting organizational wisdom metadata'),
    jsonb_build_object('key', 'protect_knowledge', 'label', 'Protect knowledge', 'emoji', '🔔', 'description', 'Critical knowledge protection — surface risks before knowledge walks out the door'),
    jsonb_build_object('key', 'continuity', 'label', 'Continuity', 'emoji', '🔔', 'description', 'Leadership and operational continuity across transitions — cross-link Phase 55 and Continuity 73'),
    jsonb_build_object('key', 'onboarding', 'label', 'Onboarding', 'emoji', '❤️', 'description', 'Accelerate onboarding with institutional context and heritage library assets'),
    jsonb_build_object('key', 'succession', 'label', 'Succession', 'emoji', '🦉', 'description', 'Succession intelligence — role knowledge mapping and leadership transition prep'),
    jsonb_build_object('key', 'transformation_stories', 'label', 'Transformation stories', 'emoji', '🌹', 'description', 'Capture transformation narratives and governance evolutions as metadata'),
    jsonb_build_object('key', 'reduce_repeated_mistakes', 'label', 'Reduce repeated mistakes', 'emoji', '🦉', 'description', 'Memory discovery — have we solved this before? What lessons emerged?'),
    jsonb_build_object('key', 'organizational_identity', 'label', 'Organizational identity', 'emoji', '🌹', 'description', 'Institutional storytelling and heritage library — who we have become, not only what we do')
  );
$$;

create or replace function public._omlebp126_organizational_memory_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'memory_archives', 'label', 'Memory archives', 'description', 'Governed archives of decisions, lessons, and milestones — metadata summaries only'),
    jsonb_build_object('key', 'legacy_records', 'label', 'Legacy records', 'description', 'Cross-link Legacy A.86 — stories and milestones live in legacy engine, counts here'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'description', 'Bridge KC A.5 approved knowledge with experience memory on A.34'),
    jsonb_build_object('key', 'transformation_histories', 'label', 'Transformation histories', 'description', 'Structural and governance transformation narratives over time'),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity', 'description', 'Decision histories and leadership handoff context — cross-link Executive Intelligence 121'),
    jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories', 'description', 'Organization decision register and rationale metadata'),
    jsonb_build_object('key', 'milestone_tracking', 'label', 'Milestone tracking', 'description', 'Strategic milestones and achievement archives — celebration without pressure'),
    jsonb_build_object('key', 'succession_support', 'label', 'Succession support', 'description', 'Role knowledge mapping and knowledge transfer preparation'),
    jsonb_build_object('key', 'institutional_storytelling', 'label', 'Institutional storytelling', 'description', 'Storytelling framework for challenges, innovation, and community milestones')
  );
$$;

create or replace function public._omlebp126_memory_archive_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'major_decisions', 'label', 'Major decisions', 'description', 'Strategic and operational decisions with rationale metadata'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Post-incident and post-project lessons — never raw operational records'),
    jsonb_build_object('key', 'strategic_milestones', 'label', 'Strategic milestones', 'description', 'Achievement archives cross-linked to Legacy A.86 milestone counts'),
    jsonb_build_object('key', 'project_outcomes', 'label', 'Project outcomes', 'description', 'Project completion outcomes and improvement metadata'),
    jsonb_build_object('key', 'governance_evolutions', 'label', 'Governance evolutions', 'description', 'Policy and governance adaptation histories — cross-link Phase 123'),
    jsonb_build_object('key', 'companion_introductions', 'label', 'Companion introductions', 'description', 'Companion deployment and coverage milestones — cross-link Marketplace 113'),
    jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'description', 'Community collective success patterns — cross-link Phase 117'),
    jsonb_build_object('key', 'gp_innovations', 'label', 'GP innovations', 'description', 'Growth Partner innovation contributions — cross-link GP Operations 114')
  );
$$;

create or replace function public._omlebp126_legacy_engine_captures()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy engine captures — cross-link Legacy A.86; never duplicate _leg_* tables or RPCs.',
    'legacy_engine_route', '/app/legacy-engine',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'mission_evolution', 'label', 'Mission evolution', 'description', 'How organizational mission evolved over time — metadata in Legacy A.86'),
      jsonb_build_object('key', 'values_development', 'label', 'Values development', 'description', 'Values expressed through experience — cross-link Purpose & Values'),
      jsonb_build_object('key', 'foundational_principles', 'label', 'Foundational principles', 'description', 'Principles that shaped culture and operations'),
      jsonb_build_object('key', 'historical_turning_points', 'label', 'Historical turning points', 'description', 'Pivotal moments that changed organizational direction'),
      jsonb_build_object('key', 'transformation_narratives', 'label', 'Transformation narratives', 'description', 'Stories of change — lives in Legacy A.86, cross-link only here'),
      jsonb_build_object('key', 'leadership_contributions', 'label', 'Leadership contributions', 'description', 'Honor leadership wisdom — metadata only, never PII'),
      jsonb_build_object('key', 'cultural_stories', 'label', 'Cultural stories', 'description', 'Cultural stories and traditions — Legacy A.86 storage, aggregate counts on A.34')
    ),
    'boundary_note', 'A.34 stores experience metadata and cross-link counts; Legacy A.86 stores stories and milestones — never duplicate.'
  );
$$;

create or replace function public._omlebp126_succession_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'role_knowledge_mapping', 'label', 'Role knowledge mapping', 'description', 'Map critical knowledge to roles — cross-link Digital Twin 124 responsibility model'),
    jsonb_build_object('key', 'leadership_transition_prep', 'label', 'Leadership transition prep', 'description', 'Prepare leadership handoff context — cross-link Executive Intelligence 121'),
    jsonb_build_object('key', 'knowledge_transfer', 'label', 'Knowledge transfer', 'description', 'Structured knowledge transfer scaffolds — humans lead transfer'),
    jsonb_build_object('key', 'critical_dependency_id', 'label', 'Critical dependency identification', 'description', 'Single knowledge holders and undocumented processes — protection signals only'),
    jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning', 'description', 'Cross-link Continuity Blueprint 73 /app/continuity and Phase 55 _mcebp_*'),
    jsonb_build_object('key', 'onboarding_acceleration', 'label', 'Onboarding acceleration', 'description', 'Heritage library and memory discovery accelerate new leader and team onboarding')
  );
$$;

create or replace function public._omlebp126_storytelling_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'challenges_overcome', 'label', 'Challenges overcome', 'description', 'Resilience narratives — celebrate progress without perfection pressure'),
    jsonb_build_object('key', 'innovation_journeys', 'label', 'Innovation journeys', 'description', 'How innovation unfolded — cross-link Innovation & Impact engines'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer success', 'description', 'Customer partnership milestones — metadata only, no customer PII'),
    jsonb_build_object('key', 'gp_contributions', 'label', 'GP contributions', 'description', 'Growth Partner ecosystem contributions to organizational story'),
    jsonb_build_object('key', 'community_milestones', 'label', 'Community milestones', 'description', 'Community collective success milestones — cross-link Phase 117'),
    jsonb_build_object('key', 'transformation_experiences', 'label', 'Transformation experiences', 'description', 'Transformation narratives — institutional learning, not surveillance')
  );
$$;

create or replace function public._omlebp126_critical_knowledge_protection()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'single_knowledge_holders', 'label', 'Single knowledge holders', 'description', 'Concentrated SME dependencies — system signals, not individual evaluation'),
    jsonb_build_object('key', 'undocumented_processes', 'label', 'Undocumented processes', 'description', 'Processes known only through experience — documentation gap awareness'),
    jsonb_build_object('key', 'leadership_dependencies', 'label', 'Leadership dependencies', 'description', 'Decision authority concentration — continuity awareness'),
    jsonb_build_object('key', 'companion_config_risks', 'label', 'Companion configuration risks', 'description', 'Operational reliance on companion coverage — cross-link Marketplace 113'),
    jsonb_build_object('key', 'operational_vulnerabilities', 'label', 'Operational vulnerabilities', 'description', 'Repeated incident patterns worth preserving as lessons'),
    jsonb_build_object('key', 'documentation_gaps', 'label', 'Documentation gaps', 'description', 'KC A.5 coverage gaps surfaced for human review')
  );
$$;

create or replace function public._omlebp126_memory_discovery()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Memory discovery questions — wisdom-oriented reflection, not surveillance or pressure.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'solved_before', 'question', 'Have we solved something like this before?', 'description', 'Surface relevant precedent metadata — explain why context appears'),
      jsonb_build_object('emoji', '🌹', 'key', 'what_happened', 'question', 'What actually happened — not only what was planned?', 'description', 'Experience memory vs approved knowledge distinction'),
      jsonb_build_object('emoji', '❤️', 'key', 'who_contributed', 'question', 'Who contributed wisdom worth honoring?', 'description', 'Recognition without PII in RPC payloads'),
      jsonb_build_object('emoji', '🔔', 'key', 'lessons_emerged', 'question', 'What lessons emerged that future teams should know?', 'description', 'Lessons learned archives — metadata summaries only'),
      jsonb_build_object('emoji', '🦉', 'key', 'inaccurate_assumptions', 'question', 'What assumptions turned out to be inaccurate?', 'description', 'Honest reflection strengthens institutional learning')
    ),
    'reflection_note', 'Discovery invites reflection — humans decide what persists; Aipify scaffolds governed memory metadata.'
  );
$$;

create or replace function public._omlebp126_legacy_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery', 'description', 'Help teams discover relevant institutional memory — explain sources'),
    jsonb_build_object('key', 'historical_summaries', 'label', 'Historical summaries', 'description', 'Summarize approved memory metadata for continuity prep'),
    jsonb_build_object('key', 'continuity_prep', 'label', 'Continuity preparation', 'description', 'Prepare succession and handoff context — cross-link Phase 55 and 73'),
    jsonb_build_object('key', 'story_preservation', 'label', 'Story preservation', 'description', 'Scaffold story capture for human approval — cross-link Legacy A.86'),
    jsonb_build_object('key', 'context_retrieval', 'label', 'Context retrieval', 'description', 'Retrieve relevant decision and lesson context when asked'),
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Gentle reflection prompts — protect continuity, NOT rewrite history')
  );
$$;

create or replace function public._omlebp126_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_altering_records', 'label', 'No altering records', 'description', 'Companion never modifies historical memory or legacy records'),
    jsonb_build_object('key', 'no_suppress_perspectives', 'label', 'No suppressing perspectives', 'description', 'Never hide dissenting views or uncomfortable history'),
    jsonb_build_object('key', 'no_fictional_narratives', 'label', 'No fictional narratives', 'description', 'Never invent stories or fabricate organizational history'),
    jsonb_build_object('key', 'no_distort_memory', 'label', 'No distorting memory', 'description', 'Never reshape memory to suit current preferences'),
    jsonb_build_object('key', 'no_replace_interpretation', 'label', 'No replacing human interpretation', 'description', 'Humans interpret legacy meaning — Companion prepares context only')
  );
$$;

create or replace function public._omlebp126_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in memory — reflection, gratitude, recognition, learning from setbacks, celebrating growth, respecting contributions.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Gentle organizational reflection — not guilt or surveillance'),
      jsonb_build_object('key', 'gratitude', 'label', 'Gratitude', 'description', 'Recognize collective effort and milestones'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Honor contributors without performative scoring'),
      jsonb_build_object('key', 'learning_from_setbacks', 'label', 'Learning from setbacks', 'description', 'Lessons from challenges — resilience not blame'),
      jsonb_build_object('key', 'celebrating_growth', 'label', 'Celebrating growth', 'description', 'Celebrate how far the organization has come'),
      jsonb_build_object('key', 'respecting_contributions', 'label', 'Respecting contributions', 'description', 'Respect long-tenured wisdom and partnership history')
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'We remember how far we have come — honoring effort, not only outcomes.'
  );
$$;

create or replace function public._omlebp126_heritage_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'milestones', 'label', 'Milestones', 'description', 'Strategic and cultural milestone archives'),
    jsonb_build_object('key', 'leadership_narratives', 'label', 'Leadership narratives', 'description', 'Leadership transition and contribution narratives — metadata only'),
    jsonb_build_object('key', 'transformation_stories', 'label', 'Transformation stories', 'description', 'Organizational change narratives — cross-link Legacy A.86'),
    jsonb_build_object('key', 'decision_archives', 'label', 'Decision archives', 'description', 'Decision register and rationale histories'),
    jsonb_build_object('key', 'governance_histories', 'label', 'Governance histories', 'description', 'Policy and governance evolution metadata'),
    jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'description', 'Community collective success heritage'),
    jsonb_build_object('key', 'knowledge_assets', 'label', 'Knowledge assets', 'description', 'Approved knowledge assets cross-linked from KC A.5 and Employee Knowledge')
  );
$$;

create or replace function public._omlebp126_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Phase 125', 'route', '/app/decision-intelligence-engine', 'note', 'Decision histories and advisory context — cross-link only'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'note', 'Leadership continuity and executive memory cross-link'),
    jsonb_build_object('key', 'digital_twin', 'label', 'Digital Twin Phase 124', 'route', '/app/digital-twin', 'note', 'Role knowledge mapping and dependency awareness'),
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'note', 'Stories and milestones — never duplicate _leg_* RPCs'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'note', 'Internal procedures and onboarding knowledge'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center-engine', 'note', 'Approved documentation vs experience memory'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Reflection, gratitude, and growth in memory'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'note', 'Continuous learning and institutional knowledge pathways'),
    jsonb_build_object('key', 'continuity_phase73', 'label', 'Organizational Continuity Blueprint 73', 'route', '/app/continuity', 'note', 'Succession and continuity planning cross-link'),
    jsonb_build_object('key', 'memory_continuity_phase55', 'label', 'Memory Continuity Blueprint 55', 'route', '/app/organizational-memory-engine', 'note', 'Phase 55 _mcebp_* preserved on same route'),
    jsonb_build_object('key', 'memory_legacy_phase94', 'label', 'Memory & Legacy Blueprint 94', 'route', '/app/organizational-memory-engine', 'note', 'Phase 94 _omlebp94_* preserved — Phase 126 layers on top'),
    jsonb_build_object('key', 'community_phase117', 'label', 'Community Collective Success Phase 117', 'route', '/app/community', 'note', 'Community contribution heritage')
  );
$$;

create or replace function public._omlebp126_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational Memory & Legacy informs and prepares — humans are custodians; no altering historical records, no surveillance, no PII.',
    'must_never', public._omlebp126_companion_limitations(),
    'forbidden', jsonb_build_array(
      'Altering or rewriting historical memory records via Companion',
      'Surveillance or hidden memory accumulation',
      'Unnecessary PII in organizational memory metadata',
      'Duplicating Legacy A.86 stories or _leg_* storage on A.34',
      'Fictional narratives or distorted organizational history',
      'Permanent retention without governance and scheduled review'
    ),
    'required', jsonb_build_array(
      'Metadata summaries only in dashboard RPC payloads',
      'Human approval for memory capture and retention policies',
      'Transparent surfacing — explain why context is shown',
      'Legacy content cross-linked from A.86 — never duplicated',
      'Preserve all Phase 55 _mcebp_* and Phase 94 _omlebp94_* dashboard fields'
    ),
    'boundary_note', 'Wisdom before speed. People First. Memory as asset — humans decide; Aipify informs and prepares.'
  );
$$;

create or replace function public._omlebp126_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy Companion — knowledge discovery, historical summaries, continuity prep, story preservation, context retrieval, reflection prompts. Protect continuity NOT rewrite history.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'precedent_recall', 'prompt', 'A similar challenge was documented before — would reviewing the approved lesson summary help continuity?', 'consideration', 'Metadata summary only — explain relevance'),
      jsonb_build_object('emoji', '🌹', 'key', 'heritage_reflection', 'prompt', 'Your organization reached a meaningful milestone — shall Aipify highlight what is preserved in the heritage library?', 'consideration', 'Celebration without pressure — cross-link Legacy A.86'),
      jsonb_build_object('emoji', '🔔', 'key', 'succession_context', 'prompt', 'Leadership transition planning may benefit from decision archive context — shall Aipify prepare a continuity summary for review?', 'consideration', 'Succession prep — humans lead handoff'),
      jsonb_build_object('emoji', '❤️', 'key', 'discovery_question', 'prompt', 'Have we solved something like this before? Aipify found related memory metadata — would context help?', 'consideration', 'Memory discovery — never implies surveillance')
    ),
    'boundary_note', 'Companion protects continuity — never alters records, suppresses perspectives, or replaces human interpretation.'
  );
$$;

create or replace function public._omlebp126_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'wisdom_preservation', 'label', 'Wisdom preservation'),
    jsonb_build_object('key', 'knowledge_continuity', 'label', 'Knowledge continuity'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Succession readiness'),
    jsonb_build_object('key', 'onboarding_acceleration', 'label', 'Onboarding acceleration'),
    jsonb_build_object('key', 'reduced_repeated_mistakes', 'label', 'Reduced repeated mistakes'),
    jsonb_build_object('key', 'institutional_identity', 'label', 'Institutional identity strength'),
    jsonb_build_object('key', 'heritage_engagement', 'label', 'Heritage library engagement'),
    jsonb_build_object('key', 'governed_retention_health', 'label', 'Governed retention health')
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Engagement summary + success criteria
-- ---------------------------------------------------------------------------
create or replace function public._omlebp126_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_phase94 jsonb;
  v_active_records int := 0;
  v_active_decisions int := 0;
  v_pending_reviews int := 0;
begin
  v_phase94 := public._omlebp94_engagement_summary(p_organization_id);

  select count(*) into v_active_records
  from public.organization_memory_records
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_active_decisions
  from public.organization_decision_register
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_pending_reviews
  from public.organization_memory_reviews
  where organization_id = p_organization_id and status in ('scheduled', 'overdue');

  return v_phase94 || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._omlebp126_objectives()),
    'memory_center_capabilities', jsonb_array_length(public._omlebp126_organizational_memory_center()),
    'memory_archive_examples', jsonb_array_length(public._omlebp126_memory_archive_engine()),
    'legacy_captures', jsonb_array_length(public._omlebp126_legacy_engine_captures()->'captures'),
    'succession_capabilities', jsonb_array_length(public._omlebp126_succession_intelligence()),
    'storytelling_types', jsonb_array_length(public._omlebp126_storytelling_framework()),
    'knowledge_protection_risks', jsonb_array_length(public._omlebp126_critical_knowledge_protection()),
    'memory_discovery_questions', jsonb_array_length(public._omlebp126_memory_discovery()->'questions'),
    'legacy_companion_supports', jsonb_array_length(public._omlebp126_legacy_companion()),
    'heritage_assets', jsonb_array_length(public._omlebp126_heritage_library()),
    'cross_links_count', jsonb_array_length(public._omlebp126_cross_links()),
    'success_metrics_count', jsonb_array_length(public._omlebp126_success_metrics()),
    'companion_limitations_count', jsonb_array_length(public._omlebp126_companion_limitations()),
    'phase126_active_records', v_active_records,
    'phase126_active_decisions', v_active_decisions,
    'phase126_pending_reviews', v_pending_reviews,
    'privacy_note', 'Enterprise Intelligence Phase 126 — aggregate counts only. No PII, no legacy story duplication, no surveillance. Humans custodians of legacy.'
  );
end; $$;

create or replace function public._omlebp126_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_records int := 0;
begin
  v_engagement := public._omlebp126_engagement_summary(p_organization_id);
  v_active_records := coalesce((v_engagement->>'phase126_active_records')::int, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Enterprise Intelligence objectives documented', 'met', jsonb_array_length(public._omlebp126_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'memory_center', 'label', 'Organizational Memory Center — nine capabilities', 'met', jsonb_array_length(public._omlebp126_organizational_memory_center()) = 9, 'note', null),
    jsonb_build_object('key', 'memory_archive', 'label', 'Memory archive engine — eight examples', 'met', jsonb_array_length(public._omlebp126_memory_archive_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'legacy_captures', 'label', 'Legacy engine captures — seven types (cross-link A.86)', 'met', jsonb_array_length(public._omlebp126_legacy_engine_captures()->'captures') = 7, 'note', 'Never duplicate _leg_* tables.'),
    jsonb_build_object('key', 'succession_intelligence', 'label', 'Succession intelligence — six capabilities', 'met', jsonb_array_length(public._omlebp126_succession_intelligence()) = 6, 'note', 'Cross-link Continuity 73 and Digital Twin 124.'),
    jsonb_build_object('key', 'storytelling', 'label', 'Storytelling framework — six narrative types', 'met', jsonb_array_length(public._omlebp126_storytelling_framework()) = 6, 'note', null),
    jsonb_build_object('key', 'knowledge_protection', 'label', 'Critical knowledge protection — six risks', 'met', jsonb_array_length(public._omlebp126_critical_knowledge_protection()) = 6, 'note', 'Protection signals — not surveillance.'),
    jsonb_build_object('key', 'memory_discovery', 'label', 'Memory discovery — five questions', 'met', jsonb_array_length(public._omlebp126_memory_discovery()->'questions') = 5, 'note', 'Wisdom-oriented reflection.'),
    jsonb_build_object('key', 'legacy_companion', 'label', 'Legacy Companion — six supports', 'met', jsonb_array_length(public._omlebp126_legacy_companion()) = 6, 'note', 'Protect continuity — not rewrite history.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._omlebp126_companion_limitations()) = 5, 'note', 'No altering records or fictional narratives.'),
    jsonb_build_object('key', 'heritage_library', 'label', 'Organizational heritage library — seven assets', 'met', jsonb_array_length(public._omlebp126_heritage_library()) = 7, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._omlebp126_cross_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._omlebp126_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase94_preserved', 'label', 'Blueprint Phase 94 _omlebp94_* fields preserved', 'met', jsonb_array_length(public._omlebp94_objectives()) >= 6, 'note', 'Phase 126 layers on Phase 94 — does not replace.'),
    jsonb_build_object('key', 'phase55_preserved', 'label', 'Blueprint Phase 55 _mcebp_* fields preserved', 'met', true, 'note', 'All continuity fields remain on dashboard RPC.'),
    jsonb_build_object('key', 'operational_memory', 'label', 'Active organizational memory records captured', 'met', v_active_records >= 1, 'note', case when v_active_records < 1 then 'Capture memory records or seed org memory.' else null end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 126 vs Phase 94 distinction documented', 'met', position('Phase 94' in public._omlebp126_distinction_note()) > 0, 'note', public._omlebp126_distinction_note())
  );
end; $$;

create or replace function public._omlebp126_blueprint_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '126',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE126_ORGANIZATIONAL_MEMORY_LEGACY.md',
    'spec_doc', 'ORGANIZATIONAL_MEMORY_LEGACY_ENGINE_PHASE126.md',
    'engine_phase', 'A.34 Organizational Memory Engine',
    'era', 'Enterprise Intelligence Era (121–130)',
    'route', '/app/organizational-memory-engine',
    'distinction_note', public._omlebp126_distinction_note(),
    'mission', public._omlebp126_mission(),
    'philosophy', public._omlebp126_philosophy(),
    'abos_principle', public._omlebp126_abos_principle(),
    'vision', public._omlebp126_vision(),
    'objectives', public._omlebp126_objectives(),
    'organizational_memory_center', public._omlebp126_organizational_memory_center(),
    'memory_archive_engine', public._omlebp126_memory_archive_engine(),
    'legacy_engine_captures', public._omlebp126_legacy_engine_captures(),
    'succession_intelligence', public._omlebp126_succession_intelligence(),
    'storytelling_framework', public._omlebp126_storytelling_framework(),
    'critical_knowledge_protection', public._omlebp126_critical_knowledge_protection(),
    'memory_discovery', public._omlebp126_memory_discovery(),
    'legacy_companion', public._omlebp126_legacy_companion(),
    'companion_limitations', public._omlebp126_companion_limitations(),
    'self_love_connection', public._omlebp126_self_love_connection(),
    'heritage_library', public._omlebp126_heritage_library(),
    'cross_links', public._omlebp126_cross_links(),
    'limitation_principles', public._omlebp126_limitation_principles(),
    'companion_adaptation', public._omlebp126_companion_adaptation(),
    'success_metrics', public._omlebp126_success_metrics(),
    'success_criteria', public._omlebp126_success_criteria(p_organization_id),
    'engagement_summary', public._omlebp126_engagement_summary(p_organization_id),
    'privacy_note', 'Enterprise Intelligence Phase 126 — metadata only. Humans custodians of legacy. No altering records, no PII, no surveillance.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard + Card RPC — preserve ALL A.34 + Phase 55 + Phase 94 fields; append Phase 126
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_memory_settings;
  v_continuity_settings public.memory_continuity_settings;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission(v_org_id, 'memory.view');
  v_settings := public._ome_ensure_settings(v_org_id);
  v_continuity_settings := public._mcebp_ensure_settings(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity. Organizations should not have to relearn the same lessons repeatedly.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'vision', 'Aipify should become a companion that helps organizations remember their journey. Experience deserves to be preserved.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.',
    'core_philosophy', jsonb_build_array(
      'Experience has value',
      'Reflection creates wisdom',
      'Memory strengthens continuity',
      'Organizations should not relearn the same lessons repeatedly'
    ),
    'memory_categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational Memory',
        'examples', jsonb_build_array(
          'Process improvements', 'Incident resolutions', 'Successful interventions', 'Workflow adjustments'
        ),
        'record_categories', jsonb_build_array('process_improvements', 'resolved_incidents', 'operational_decisions')
      ),
      jsonb_build_object(
        'key', 'relationship',
        'label', 'Relationship Memory',
        'examples', jsonb_build_array(
          'Customer preferences', 'Communication styles', 'Long-term partnerships', 'Team collaboration patterns'
        ),
        'record_categories', jsonb_build_array('support_learnings', 'onboarding_lessons')
      ),
      jsonb_build_object(
        'key', 'decision',
        'label', 'Decision Memory',
        'examples', jsonb_build_array(
          'Major decisions', 'Decision rationale', 'Trade-offs considered', 'Outcomes achieved'
        ),
        'record_categories', jsonb_build_array('operational_decisions', 'strategic_decisions', 'approval_precedents')
      ),
      jsonb_build_object(
        'key', 'growth',
        'label', 'Growth Memory',
        'examples', jsonb_build_array(
          'Milestones achieved', 'Challenges overcome', 'Lessons learned', 'Improvements implemented'
        ),
        'record_categories', jsonb_build_array('onboarding_lessons', 'process_improvements', 'support_learnings')
      )
    ),
    'memory_capabilities', jsonb_build_array(
      jsonb_build_object('key', 'recall', 'label', 'Recall previous situations'),
      jsonb_build_object('key', 'surface', 'label', 'Surface relevant experiences'),
      jsonb_build_object('key', 'highlight', 'label', 'Highlight similar events'),
      jsonb_build_object('key', 'recommend', 'label', 'Recommend lessons learned'),
      jsonb_build_object('key', 'preserve', 'label', 'Preserve organizational context')
    ),
    'capability_examples', jsonb_build_array(
      'A similar issue occurred six months ago. Here is how it was resolved.',
      'This decision aligns with a previously successful strategy.',
      'Several lessons emerged from a comparable situation.',
      'You have faced challenges like this before — and you found a way through.'
    ),
    'self_love_note', 'Self Love (A.76 planned) encourages celebrating progress, recognizing resilience, appreciating effort, and reflecting on growth — organizations often forget how far they have come.',
    'trust_connection', jsonb_build_object(
      'principle', 'Organizational Memory should remain transparent.',
      'organizations_should_understand', jsonb_build_array(
        'What is remembered',
        'Why it is relevant',
        'Who contributed the knowledge',
        'How it informs recommendations'
      )
    ),
    'memory_levels', jsonb_build_array(
      jsonb_build_object('level', 'session', 'label', 'Session Memory', 'description', 'Short-term conversational awareness'),
      jsonb_build_object('level', 'workspace', 'label', 'Workspace Memory', 'description', 'Knowledge shared within a specific workspace'),
      jsonb_build_object('level', 'organization', 'label', 'Organizational Memory', 'description', 'Approved institutional knowledge across the organization'),
      jsonb_build_object('level', 'strategic', 'label', 'Strategic Memory', 'description', 'Executive-level insights and decision history')
    ),
    'knowledge_domains', jsonb_build_array(
      'Operational knowledge — SOPs, workflows, support routines, escalation paths',
      'Organizational preferences — communication styles, brand guidelines, terminology, priorities',
      'Historical context — incidents, resolved problems, decisions, lessons learned',
      'Customer intelligence — FAQs, pain points, product knowledge, service expectations',
      'Strategic knowledge — objectives, department goals, KPIs, long-term initiatives'
    ),
    'approved_sources', jsonb_build_array(
      'knowledge_center', 'internal_documentation', 'faq', 'support_conversation',
      'meeting_notes', 'policy_procedure', 'case_resolution'
    ),
    'principles', jsonb_build_array(
      'Humans approve knowledge sources and retention policies',
      'Metadata-only summaries — never raw chat, email, or PII',
      'Distinct from PAME personal memories and Learning Engine',
      'Workspace-scoped memory when organization uses workspaces (A.75)',
      'Scheduled reviews and archival with full audit accountability',
      'Security empowers meaningful work — clear responsibilities strengthen organizations'
    ),
    'distinction_note', 'Distinct from Knowledge Center (A.5) — knowledge is approved documentation; memory is experience captured over time. Distinct from PAME and Learning Engine.',
    'success_criteria', public._ome_abos_success_criteria(v_org_id),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Knowledge Center Engine (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine'),
      jsonb_build_object('label', 'Legacy Engine (A.86)', 'route', '/app/legacy-engine'),
      jsonb_build_object('label', 'Learning Review Center', 'route', '/app/learning'),
      jsonb_build_object('label', 'Organization & Workspaces (A.75)', 'route', '/app/organization-workspace-engine')
    ),
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'active_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'archived_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'archived'
      ), 0),
      'active_decisions', coalesce((
        select count(*) from public.organization_decision_register
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
      ), 0),
      'by_memory_level', coalesce((
        select jsonb_object_agg(memory_level, cnt)
        from (
          select memory_level, count(*)::int as cnt
          from public.organization_memory_records
          where organization_id = v_org_id and status = 'active'
          group by memory_level
        ) s
      ), '{}'::jsonb)
    ),
    'recent_learnings', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.created_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        order by created_at desc limit 8
      ) r
    ), '[]'::jsonb),
    'recurring_themes', coalesce((
      select jsonb_agg(jsonb_build_object('category', category, 'count', cnt) order by cnt desc)
      from (
        select category, count(*)::int as cnt
        from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        group by category order by cnt desc limit 6
      ) t
    ), '[]'::jsonb),
    'frequently_referenced', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.reference_count desc, r.updated_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active' and reference_count > 0
        order by reference_count desc, updated_at desc limit 5
      ) r
    ), '[]'::jsonb),
    'archived_decisions', coalesce((
      select jsonb_agg(public._ome_decision_json(d) order by d.updated_at desc)
      from (
        select * from public.organization_decision_register
        where organization_id = v_org_id and status in ('archived', 'superseded')
        order by updated_at desc limit 5
      ) d
    ), '[]'::jsonb),
    'recommended_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rv.id, 'review_type', rv.review_type, 'scheduled_at', rv.scheduled_at,
        'status', rv.status, 'memory_record_id', rv.memory_record_id
      ) order by rv.scheduled_at asc)
      from (
        select * from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
        order by scheduled_at asc limit 5
      ) rv
    ), '[]'::jsonb),
    'privacy_note', 'Organizational Memory stores metadata summaries only. Humans approve sources, remove outdated information, and define retention policies.',
    'implementation_blueprint_phase55', jsonb_build_object(
      'phase', 55,
      'title', 'Memory & Continuity Engine',
      'engine_phase', 'A.34',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE55_MEMORY_CONTINUITY.md',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'ABOS Blueprint Phase 55 extends A.34 with continuity framework — preserves all A.34 and ABOS alignment fields.'
    ),
    'continuity_mission', public._mcebp_blueprint_mission(),
    'continuity_philosophy', public._mcebp_blueprint_philosophy(),
    'continuity_abos_principle', public._mcebp_blueprint_abos_principle(),
    'continuity_objectives', public._mcebp_blueprint_objectives(),
    'continuity_memory_categories', public._mcebp_blueprint_memory_categories(),
    'organizational_continuity', public._mcebp_blueprint_organizational_continuity(),
    'individual_continuity', public._mcebp_blueprint_individual_continuity(),
    'memory_management', public._mcebp_blueprint_memory_management(),
    'continuity_self_love_connection', public._mcebp_blueprint_self_love_connection(),
    'continuity_trust_privacy', public._mcebp_blueprint_trust_privacy(),
    'continuity_companion_principles', public._mcebp_blueprint_companion_principles(),
    'continuity_settings', row_to_json(v_continuity_settings)::jsonb,
    'continuity_summary', public._mcebp_continuity_summary(v_org_id),
    'continuity_dogfooding', public._mcebp_blueprint_dogfooding(),
    'mcebp_integration_links', public._mcebp_blueprint_integration_links(),
    'continuity_success_criteria', public._mcebp_blueprint_success_criteria(v_org_id),
    'continuity_vision_phrases', public._mcebp_blueprint_vision_phrases(),
    'continuity_distinction_note', public._mcebp_distinction_note(),
    'implementation_blueprint_phase94', jsonb_build_object(
      'phase', 'Phase 94 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE94_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'ABOS Blueprint Phase 94 extends A.34 + Phase 55 with unified memory + legacy framing. Cross-links Legacy A.86 + Phase 83 — never duplicate legacy storage.'
    ),
    'organizational_memory_legacy_blueprint', public._omlebp94_organizational_memory_legacy_blueprint_block(v_org_id),
    'memory_legacy_distinction_note', public._omlebp94_distinction_note(),
    'memory_legacy_mission', public._omlebp94_mission(),
    'memory_legacy_philosophy', public._omlebp94_philosophy(),
    'memory_legacy_abos_principle', public._omlebp94_abos_principle(),
    'memory_legacy_objectives', public._omlebp94_objectives(),
    'memory_legacy_categories', public._omlebp94_memory_categories(),
    'memory_legacy_questions', public._omlebp94_memory_questions(),
    'memory_legacy_preservation', public._omlebp94_legacy_preservation(),
    'memory_legacy_companion_guidance', public._omlebp94_companion_guidance(),
    'memory_legacy_meeting_companion_connection', public._omlebp94_meeting_companion_connection(),
    'memory_legacy_knowledge_center_connection', public._omlebp94_knowledge_center_connection(),
    'memory_legacy_self_love_connection', public._omlebp94_self_love_connection(),
    'memory_legacy_trust_connection', public._omlebp94_trust_connection(),
    'memory_legacy_privacy_principles', public._omlebp94_privacy_principles(),
    'memory_legacy_dogfooding', public._omlebp94_dogfooding(),
    'omlebp94_integration_links', public._omlebp94_integration_links(),
    'memory_legacy_engagement_summary', public._omlebp94_engagement_summary(v_org_id),
    'memory_legacy_success_criteria', public._omlebp94_success_criteria(v_org_id),
    'memory_legacy_vision', public._omlebp94_vision(),
    'memory_legacy_vision_phrases', public._omlebp94_vision_phrases(),
    'memory_legacy_privacy_note', 'Organizational Memory Legacy blueprint data is metadata only — no PII, no legacy story content duplication, no surveillance. Humans decide; Aipify informs and prepares.'

    ,
    'implementation_blueprint_phase126', jsonb_build_object(
      'phase', 'Phase 126 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE126_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'spec_doc', 'ORGANIZATIONAL_MEMORY_LEGACY_ENGINE_PHASE126.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'Enterprise Intelligence Phase 126 layers on A.34 + Phase 55 + Phase 94 — memory archives, succession intelligence, storytelling, heritage library. All prior fields preserved.'
    ),
    'enterprise_intelligence_blueprint', public._omlebp126_blueprint_block(v_org_id),
    'phase126_distinction_note', public._omlebp126_distinction_note(),
    'phase126_mission', public._omlebp126_mission(),
    'phase126_philosophy', public._omlebp126_philosophy(),
    'phase126_abos_principle', public._omlebp126_abos_principle(),
    'phase126_vision', public._omlebp126_vision(),
    'phase126_objectives', public._omlebp126_objectives(),
    'phase126_memory_center', public._omlebp126_organizational_memory_center(),
    'phase126_memory_archive_engine', public._omlebp126_memory_archive_engine(),
    'phase126_legacy_engine_captures', public._omlebp126_legacy_engine_captures(),
    'phase126_succession_intelligence', public._omlebp126_succession_intelligence(),
    'phase126_storytelling_framework', public._omlebp126_storytelling_framework(),
    'phase126_critical_knowledge_protection', public._omlebp126_critical_knowledge_protection(),
    'phase126_memory_discovery', public._omlebp126_memory_discovery(),
    'phase126_legacy_companion', public._omlebp126_legacy_companion(),
    'phase126_companion_limitations', public._omlebp126_companion_limitations(),
    'phase126_self_love_connection', public._omlebp126_self_love_connection(),
    'phase126_heritage_library', public._omlebp126_heritage_library(),
    'omlebp126_cross_links', public._omlebp126_cross_links(),
    'phase126_limitation_principles', public._omlebp126_limitation_principles(),
    'phase126_companion_adaptation', public._omlebp126_companion_adaptation(),
    'phase126_success_metrics', public._omlebp126_success_metrics(),
    'phase126_success_criteria', public._omlebp126_success_criteria(v_org_id),
    'phase126_engagement_summary', public._omlebp126_engagement_summary(v_org_id),
    'organizational_memory_enterprise_note', 'Enterprise Intelligence Phase 126 — Organizational Memory & Legacy deepens wisdom preservation, succession intelligence, storytelling, and heritage library on A.34 scaffolds. Humans custodians of legacy — no altering historical records.',
    'phase126_privacy_note', 'Enterprise Intelligence Phase 126 blueprint data is metadata only — memory and legacy aggregate counts. No PII, no legacy story duplication, no surveillance. Humans decide; Aipify informs and prepares.'
  );
end; $$;

create or replace function public.get_organizational_memory_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  return jsonb_build_object(
    'has_organization', true,
    'active_records', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'pending_reviews', coalesce((
      select count(*) from public.organization_memory_reviews
      where organization_id = v_org_id and status in ('scheduled', 'overdue')
    ), 0),
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.',
    'implementation_blueprint_phase55', jsonb_build_object(
      'phase', 55,
      'title', 'Memory & Continuity Engine',
      'engine_phase', 'A.34',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE55_MEMORY_CONTINUITY.md',
      'route', '/app/organizational-memory-engine'
    ),
    'continuity_mission', public._mcebp_blueprint_mission(),
    'continuity_summary', public._mcebp_continuity_summary(v_org_id),
    'implementation_blueprint_phase94', jsonb_build_object(
      'phase', 'Phase 94 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE94_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'route', '/app/organizational-memory-engine'
    ),
    'memory_legacy_mission', public._omlebp94_mission(),
    'memory_legacy_abos_principle', public._omlebp94_abos_principle(),
    'memory_legacy_vision', public._omlebp94_vision(),
    'memory_legacy_engagement_summary', public._omlebp94_engagement_summary(v_org_id),
    'memory_legacy_note', 'Organizational Memory & Legacy Engine (ABOS Phase 94) — transform experiences into lasting wisdom; cross-link Legacy A.86 without duplication.',
    'memory_legacy_distinction_note', public._omlebp94_distinction_note()

    ,
    'implementation_blueprint_phase126', jsonb_build_object(
      'phase', 'Phase 126 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE126_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'spec_doc', 'ORGANIZATIONAL_MEMORY_LEGACY_ENGINE_PHASE126.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-memory-engine'
    ),
    'phase126_mission', public._omlebp126_mission(),
    'phase126_abos_principle', public._omlebp126_abos_principle(),
    'phase126_vision', public._omlebp126_vision(),
    'phase126_engagement_summary', public._omlebp126_engagement_summary(v_org_id),
    'phase126_note', 'Enterprise Intelligence Phase 126 — preserve wisdom, protect knowledge, succession intelligence, and heritage library on A.34 + Phase 94 scaffolds.',
    'phase126_distinction_note', public._omlebp126_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._omlebp126_distinction_note() to authenticated;
grant execute on function public._omlebp126_mission() to authenticated;
grant execute on function public._omlebp126_philosophy() to authenticated;
grant execute on function public._omlebp126_abos_principle() to authenticated;
grant execute on function public._omlebp126_vision() to authenticated;
grant execute on function public._omlebp126_objectives() to authenticated;
grant execute on function public._omlebp126_organizational_memory_center() to authenticated;
grant execute on function public._omlebp126_memory_archive_engine() to authenticated;
grant execute on function public._omlebp126_legacy_engine_captures() to authenticated;
grant execute on function public._omlebp126_succession_intelligence() to authenticated;
grant execute on function public._omlebp126_storytelling_framework() to authenticated;
grant execute on function public._omlebp126_critical_knowledge_protection() to authenticated;
grant execute on function public._omlebp126_memory_discovery() to authenticated;
grant execute on function public._omlebp126_legacy_companion() to authenticated;
grant execute on function public._omlebp126_companion_limitations() to authenticated;
grant execute on function public._omlebp126_self_love_connection() to authenticated;
grant execute on function public._omlebp126_heritage_library() to authenticated;
grant execute on function public._omlebp126_cross_links() to authenticated;
grant execute on function public._omlebp126_limitation_principles() to authenticated;
grant execute on function public._omlebp126_companion_adaptation() to authenticated;
grant execute on function public._omlebp126_success_metrics() to authenticated;
grant execute on function public._omlebp126_engagement_summary(uuid) to authenticated;
grant execute on function public._omlebp126_success_criteria(uuid) to authenticated;
grant execute on function public._omlebp126_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-memory-legacy-blueprint-phase126', 'Organizational Memory & Legacy (Enterprise Phase 126)',
  'Enterprise Intelligence Phase 126 — Organizational Memory & Legacy deepens A.34 + Phase 94 with memory archives, succession intelligence, storytelling framework, critical knowledge protection, heritage library, and Legacy Companion.',
  'authenticated', 125
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-memory-legacy-blueprint-phase126' and tenant_id is null
);
