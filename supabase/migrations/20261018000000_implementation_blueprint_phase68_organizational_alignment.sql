-- Implementation Blueprint Phase 68 — Organizational Alignment Engine
-- Extends Strategic Alignment Engine Phase A.55. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._oabp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 68 — Organizational Alignment Engine at /app/strategic-alignment-engine. Extends Strategic Alignment Engine Phase A.55 (20260831000000_strategic_alignment_engine_phase_a55.sql). Distinct from Purpose & Values A.82 at /app/purpose-values-engine (values/purpose — cross-link). Distinct from Goals & OKR A.65 at /app/goals-okr-engine (OKR hierarchy — cross-link for cascading). Distinct from Executive Insights A.35 and Blueprint Phases 13/59/66. Distinct from legacy Strategy Phase 81 at /app/strategy. Distinct from Strategic Intelligence Foundation A.31. Distinct from Organizational Decision Support A.54. Engine helpers use _sae_* — blueprint helpers use _oabp_* (do not collide). All A.55 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._oabp_mission()
returns text language sql immutable as $$
  select 'Connect individuals, teams, and leadership to common priorities, expectations, and objectives.';
$$;

create or replace function public._oabp_philosophy()
returns text language sql immutable as $$
  select 'Alignment does not mean everyone doing the same things — people must understand how their contributions support the mission. Clarity strengthens collaboration.';
$$;

create or replace function public._oabp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — extraordinary organizations emerge when people move together toward meaningful goals. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._oabp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic alignment', 'description', 'Connect strategic objectives to operational entities and reviews'),
    jsonb_build_object('key', 'goal_visibility', 'label', 'Goal visibility', 'description', 'Make priorities and success definitions visible across teams'),
    jsonb_build_object('key', 'cross_functional_awareness', 'label', 'Cross-functional awareness', 'description', 'Surface dependencies, shared initiatives, and collaborative opportunities'),
    jsonb_build_object('key', 'shared_understanding', 'label', 'Shared understanding', 'description', 'Clarify how individual contributions support organizational mission'),
    jsonb_build_object('key', 'priority_communication', 'label', 'Priority communication', 'description', 'Consistent communication of strategic priorities and focus areas'),
    jsonb_build_object('key', 'organizational_coherence', 'label', 'Organizational coherence', 'description', 'Reduce priority conflicts and strengthen alignment across functions')
  );
$$;

create or replace function public._oabp_alignment_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Alignment questions — do teams understand priorities, can individuals explain their contribution, and are conflicting priorities creating friction?',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'team_priorities', 'question', 'Do teams understand current strategic priorities?', 'description', 'Shared visibility of what matters most — not identical tasks, but aligned direction.'),
      jsonb_build_object('emoji', '🌹', 'key', 'individual_contribution', 'question', 'Can individuals explain how their work supports the mission?', 'description', 'Connection to something larger — people thrive when they understand why their work matters.'),
      jsonb_build_object('emoji', '🔔', 'key', 'priority_conflicts', 'question', 'Are conflicting priorities creating friction across teams?', 'description', 'Surface misalignment early — humans resolve conflicts; Aipify prepares context only.')
    )
  );
$$;

create or replace function public._oabp_strategic_cascading()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic cascading — vision flows through objectives to individual contributions.',
    'levels', jsonb_build_array(
      jsonb_build_object('key', 'vision', 'label', 'Vision', 'description', 'Organizational direction and long-term aspiration'),
      jsonb_build_object('key', 'strategic_objectives', 'label', 'Strategic Objectives', 'description', 'Organization-level objectives registered in Strategic Alignment Engine'),
      jsonb_build_object('key', 'department_priorities', 'label', 'Department Priorities', 'description', 'Function-specific priorities aligned to strategic objectives'),
      jsonb_build_object('key', 'team_goals', 'label', 'Team Goals', 'description', 'Team-level goals linked via OKR hierarchy — cross-link Goals & OKR A.65'),
      jsonb_build_object('key', 'individual_contributions', 'label', 'Individual Contributions', 'description', 'How each person''s work connects to team and organizational goals')
    ),
    'okr_cross_link', '/app/goals-okr-engine',
    'purpose_cross_link', '/app/purpose-values-engine'
  );
$$;

create or replace function public._oabp_cross_functional_visibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cross-functional visibility — dependencies, shared initiatives, collaborative opportunities, and potential conflicts.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'team_dependencies', 'label', 'Team dependencies', 'description', 'Metadata summaries of cross-team dependencies on objectives and links'),
      jsonb_build_object('key', 'shared_initiatives', 'label', 'Shared initiatives', 'description', 'Initiatives spanning multiple functions with common strategic anchors'),
      jsonb_build_object('key', 'collaborative_opportunities', 'label', 'Collaborative opportunities', 'description', 'Areas where alignment could strengthen joint outcomes'),
      jsonb_build_object('key', 'potential_conflicts', 'label', 'Potential conflicts', 'description', 'Competing priorities surfaced for human review — not automated resolution')
    ),
    'metadata_note', 'Cross-functional signals are metadata only — no raw operational content or PII.'
  );
$$;

create or replace function public._oabp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — overlapping objectives, initiative alignment, and clarifying expectations improve collaboration.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'overlapping_objectives', 'prompt', 'Several teams share objectives in this area — would a brief alignment review help?', 'consideration', 'Overlapping objectives may indicate collaboration opportunity or priority conflict.'),
      jsonb_build_object('emoji', '🌹', 'key', 'initiative_supports_priorities', 'prompt', 'This initiative appears connected to strategic priorities — shall I summarize the alignment links?', 'consideration', 'Initiative-to-objective links strengthen shared understanding.'),
      jsonb_build_object('emoji', '🔔', 'key', 'clarifying_expectations', 'prompt', 'Clarifying expectations across teams often improves collaboration — would context help?', 'consideration', 'Aipify prepares alignment context; humans decide how to communicate priorities.')
    )
  );
$$;

create or replace function public._oabp_goal_communication()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Goal communication — strategic priorities, success definitions, focus areas, and achievements. Consistency strengthens alignment.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'strategic_priorities', 'label', 'Strategic priorities', 'description', 'What the organization is focusing on now — visible and consistent'),
      jsonb_build_object('key', 'success_definitions', 'label', 'Success definitions', 'description', 'How success is defined for objectives and linked entities'),
      jsonb_build_object('key', 'focus_areas', 'label', 'Focus areas', 'description', 'Current focus areas communicated across teams'),
      jsonb_build_object('key', 'achievements', 'label', 'Achievements', 'description', 'Recognition of progress and shared achievements — metadata summaries only')
    ),
    'consistency_note', 'Consistent priority communication reduces friction and strengthens organizational coherence.'
  );
$$;

create or replace function public._oabp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — clarity, realistic expectations, recognition of contribution, and appreciation of collective effort.',
    'practices', jsonb_build_array(
      'Clarity about how individual work connects to organizational mission',
      'Realistic expectations — alignment without pressure or guilt',
      'Recognition of individual contribution to shared objectives',
      'Appreciation of collective effort across teams'
    ),
    'self_love_route', '/app/self-love-engine',
    'journey_phrase', 'People often thrive when they understand why their work matters.',
    'boundary_note', 'Self Love supports sustainable rhythms — principle only; Organizational Alignment stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._oabp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — alignment observations, cross-functional opportunities, and shared achievement recognition encourage dialogue.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'alignment_observations', 'label', 'Alignment observations', 'description', 'Aggregate objective status, link coverage, and misalignment counts — metadata only'),
      jsonb_build_object('key', 'cross_functional_opportunities', 'label', 'Cross-functional opportunities', 'description', 'Shared initiatives and dependency patterns for leadership review'),
      jsonb_build_object('key', 'shared_achievement_recognition', 'label', 'Shared achievement recognition', 'description', 'Progress on linked objectives and reviews — celebrate collective effort')
    ),
    'dialogue_note', 'Observations encourage conversation — humans decide; Aipify prepares context only.'
  );
$$;

create or replace function public._oabp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about how alignment observations are generated, optional insights, and limitations.',
    'users_should_see', jsonb_build_array(
      'How alignment observations and misalignment signals are derived — metadata patterns only',
      'Optional companion guidance — leaders control enablement',
      'How strategic objectives shape alignment assistance — explainability included',
      'Human control — humans define objectives and resolve priority conflicts'
    ),
    'operators_should_understand', jsonb_build_array(
      'Alignment signals are illustrative metadata — not performance surveillance',
      'Misalignment detection prepares review context — never auto-reprioritizes',
      'Cross-links Purpose & Values A.82 — mission context distinct from objective alignment',
      'Cross-links Goals & OKR A.65 — cascading hierarchy, not duplicate objective storage'
    ),
    'audit_note', 'Objective changes, reviews, and misalignment detection are audited — metadata only.'
  );
$$;

create or replace function public._oabp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates organizational alignment patterns internally — product development, Sales Expert initiatives, ecosystem priorities, and leadership coordination.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product development, Sales Expert initiatives, ecosystem priorities, leadership coordination',
      'focus', jsonb_build_array(
        'Product development priorities aligned to ecosystem roadmap',
        'Sales Expert initiatives connected to strategic objectives',
        'Ecosystem partner priorities coordinated across functions',
        'Leadership alignment reviews on strategic objective links'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational alignment',
      'focus', jsonb_build_array(
        'Commerce priorities aligned to customer experience objectives',
        'Cross-functional visibility between support and operations',
        'Team goal cascading via OKR cross-links',
        'Alignment reviews on active strategic objectives'
      )
    )
  );
$$;

create or replace function public._oabp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'I understand how my work contributes to something larger.',
    'Clarity, connection, and shared purpose strengthen collaboration.',
    'Alignment is not sameness — it is shared understanding of what matters.',
    'Extraordinary organizations emerge when people move together toward meaningful goals.',
    'People often thrive when they understand why their work matters.'
  );
$$;

create or replace function public._oabp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Purpose & Values (A.82)', 'route', '/app/purpose-values-engine', 'note', 'Organizational purpose and values — cross-link for mission context'),
    jsonb_build_object('label', 'Goals & OKR (A.65)', 'route', '/app/goals-okr-engine', 'note', 'OKR hierarchy for strategic cascading — cross-link only'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive reporting — distinct from objective alignment register'),
    jsonb_build_object('label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Strategic signal detection — distinct from alignment tracking'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Strategic planning decisions — cross-link only'),
    jsonb_build_object('label', 'Legacy Strategy (Phase 81)', 'route', '/app/strategy', 'note', 'Legacy strategy engine — distinct from A.55 alignment'),
    jsonb_build_object('label', 'Value Realization (A.48)', 'route', '/app/value-realization-engine', 'note', 'Value metrics linked to objectives'),
    jsonb_build_object('label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Organizational readiness — cross-link only'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Shared achievement recognition — cross-link only'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Clarity and sustainable expectations — principle only'),
    jsonb_build_object('label', 'Change Management (A.47)', 'route', '/app/change-management-engine', 'note', 'Alignment during organizational change')
  );
$$;

create or replace function public._oabp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total_objectives int := 0;
  v_active_objectives int := 0;
  v_linked_entities int := 0;
  v_reviews_recorded int := 0;
  v_latest_misaligned int := 0;
begin
  select count(*) into v_total_objectives
  from public.strategic_objectives where organization_id = p_org_id;

  select count(*) into v_active_objectives
  from public.strategic_objectives
  where organization_id = p_org_id and status = 'active';

  select count(*) into v_linked_entities
  from public.strategic_objective_links where organization_id = p_org_id;

  select count(*) into v_reviews_recorded
  from public.strategic_reviews where organization_id = p_org_id;

  select coalesce(jsonb_array_length(s.misaligned_initiatives), 0) into v_latest_misaligned
  from public.strategic_alignment_snapshots s
  where s.organization_id = p_org_id
  order by s.created_at desc limit 1;

  return jsonb_build_object(
    'total_objectives', coalesce(v_total_objectives, 0),
    'active_objectives', coalesce(v_active_objectives, 0),
    'linked_entities', coalesce(v_linked_entities, 0),
    'reviews_recorded', coalesce(v_reviews_recorded, 0),
    'latest_misaligned_count', coalesce(v_latest_misaligned, 0),
    'cascading_levels', jsonb_array_length(public._oabp_strategic_cascading()->'levels'),
    'alignment_questions', jsonb_array_length(public._oabp_alignment_questions()->'questions'),
    'privacy_note', 'Metadata only — objective counts, link coverage, review counts, and misalignment summaries. No PII or raw operational content.'
  );
end; $$;

create or replace function public._oabp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_objectives int := 0;
  v_linked_entities int := 0;
  v_reviews_recorded int := 0;
begin
  v_engagement := public._oabp_engagement_summary(p_org_id);
  v_active_objectives := coalesce((v_engagement->>'active_objectives')::int, 0);
  v_linked_entities := coalesce((v_engagement->>'linked_entities')::int, 0);
  v_reviews_recorded := coalesce((v_engagement->>'reviews_recorded')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'strategic_understanding',
      'label', 'Improved strategic understanding — objectives registered and alignment questions documented',
      'met', v_active_objectives >= 1,
      'note', case when v_active_objectives < 1 then 'Activate at least one strategic objective.' else null end
    ),
    jsonb_build_object(
      'key', 'cross_functional_collaboration',
      'label', 'Stronger cross-functional collaboration — entity links and visibility dimensions documented',
      'met', v_linked_entities >= 1,
      'note', case when v_linked_entities < 1 then 'Link objectives to operational entities for accountability.' else null end
    ),
    jsonb_build_object(
      'key', 'fewer_priority_conflicts',
      'label', 'Fewer priority conflicts — misalignment detection and reviews in use',
      'met', v_reviews_recorded >= 1,
      'note', case when v_reviews_recorded < 1 then 'Record alignment reviews to surface priority conflicts early.' else null end
    ),
    jsonb_build_object(
      'key', 'contribution_understanding',
      'label', 'Employees understand contribution — cascading levels and Self Love connection documented',
      'met', jsonb_array_length(public._oabp_strategic_cascading()->'levels') >= 5,
      'note', 'People often thrive when they understand why their work matters.'
    ),
    jsonb_build_object(
      'key', 'organizational_coherence',
      'label', 'Increased coherence — goal communication elements and companion guidance documented',
      'met', jsonb_array_length(public._oabp_goal_communication()->'elements') >= 4,
      'note', 'Consistent priority communication strengthens alignment.'
    ),
    jsonb_build_object(
      'key', 'alignment_questions',
      'label', 'Alignment questions — team priorities, individual contribution, priority conflicts (🦉🌹🔔)',
      'met', jsonb_array_length(public._oabp_alignment_questions()->'questions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — overlapping objectives, initiative alignment, clarifying expectations',
      'met', jsonb_array_length(public._oabp_companion_guidance()->'examples') >= 3,
      'note', '🦉🌹🔔 companion examples — humans decide; Aipify prepares context.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — alignment observations, cross-functional opportunities, achievement recognition',
      'met', jsonb_array_length(public._oabp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Blueprint objectives — alignment, visibility, awareness, understanding, communication, coherence',
      'met', jsonb_array_length(public._oabp_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent alignment observation generation documented',
      'met', jsonb_array_length(public._oabp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Purpose & Values, Goals & OKR, Executive Insights, Strategy, SIF, ODSE',
      'met', jsonb_array_length(public._oabp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate purpose/values or OKR storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group product development, Sales Expert, ecosystem priorities',
      'met', (public._oabp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — extraordinary organizations move together toward meaningful goals',
      'met', true,
      'note', 'Clarity, connection, shared purpose — humans decide.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.55 fields; append Phase 68
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_alignment_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('strategy.view');
  v_org_id := public._mta_require_organization();
  perform public._sae_seed_objectives(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify surfaces alignment gaps. Humans define and decide strategy.',
    'principles', jsonb_build_array(
      'Clear strategic objectives',
      'Entity linking for accountability',
      'Periodic alignment reviews',
      'Misalignment detection',
      'Metadata only — no PII'
    ),
    'summary', public._sae_executive_summary_block(v_org_id),
    'objectives', coalesce((
      select jsonb_agg(row_to_json(o) order by o.created_at desc)
      from public.strategic_objectives o where o.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'links', coalesce((
      select jsonb_agg(row_to_json(l) order by l.created_at desc)
      from public.strategic_objective_links l where l.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(r) order by r.review_date desc)
      from public.strategic_reviews r where r.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'snapshots', coalesce((
      select jsonb_agg(row_to_json(s) order by s.created_at desc)
      from public.strategic_alignment_snapshots s where s.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'executive_summary', public._sae_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'legacy_strategy', 'Distinct from legacy Strategy Engine at /app/strategy — nav id strategicAlignmentEngine',
      'executive_insights', 'Executive summary via get_executive_strategic_summary() — A.35',
      'value_realization', 'Value Realization context for linked metrics — A.48',
      'organizational_decisions', 'Organizational Decision Support for strategic planning — A.54',
      'organizational_memory', 'Reviews may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'executive_insights', public._sae_executive_insights_summary(v_org_id),
      'value_realization', public._sae_value_realization_summary(v_org_id),
      'organizational_decisions', public._sae_organizational_decision_summary(v_org_id)
    ),
    'implementation_blueprint_phase68', jsonb_build_object(
      'phase', 'Phase 68 — Organizational Alignment Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE68_ORGANIZATIONAL_ALIGNMENT.md',
      'engine_phase', 'Phase A.55 Strategic Alignment Engine',
      'route', '/app/strategic-alignment-engine',
      'mapping_note', 'ABOS Blueprint Phase 68 extends A.55 with alignment questions, strategic cascading, cross-functional visibility, companion guidance, goal communication, leadership insights, and live success criteria.'
    ),
    'organizational_alignment_note', 'Organizational Alignment Engine (ABOS Phase 68) — extends Phase A.55 with cascading visibility, cross-functional awareness, and contribution clarity framing.',
    'blueprint_distinction_note', public._oabp_distinction_note(),
    'blueprint_mission', public._oabp_mission(),
    'blueprint_philosophy', public._oabp_philosophy(),
    'blueprint_abos_principle', public._oabp_abos_principle(),
    'blueprint_objectives', public._oabp_objectives(),
    'alignment_questions', public._oabp_alignment_questions(),
    'strategic_cascading', public._oabp_strategic_cascading(),
    'cross_functional_visibility', public._oabp_cross_functional_visibility(),
    'companion_guidance', public._oabp_companion_guidance(),
    'goal_communication', public._oabp_goal_communication(),
    'self_love_connection', public._oabp_self_love_connection(),
    'leadership_insights', public._oabp_leadership_insights(),
    'trust_connection', public._oabp_trust_connection(),
    'dogfooding', public._oabp_dogfooding(),
    'blueprint_integration_links', public._oabp_integration_links(),
    'engagement_summary', public._oabp_engagement_summary(v_org_id),
    'success_criteria', public._oabp_success_criteria(v_org_id),
    'vision_phrases', public._oabp_vision_phrases(),
    'privacy_note', 'Strategic alignment data is metadata only — objectives, links, reviews, and misalignment summaries. No raw customer content, chat, or PII. Humans decide; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.55 fields; append Phase 68 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_alignment_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._sae_seed_objectives(v_org_id);
  v_engagement := public._oabp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Strategic alignment — objectives linked to operational entities.',
    'active_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'misaligned_count', coalesce((
      select jsonb_array_length(s.misaligned_initiatives)
      from public.strategic_alignment_snapshots s
      where s.organization_id = v_org_id
      order by s.created_at desc limit 1
    ), 0),
    'implementation_blueprint_phase68', jsonb_build_object(
      'phase', 'Phase 68 — Organizational Alignment Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE68_ORGANIZATIONAL_ALIGNMENT.md',
      'engine_phase', 'Phase A.55 Strategic Alignment Engine',
      'route', '/app/strategic-alignment-engine'
    ),
    'mission', public._oabp_mission(),
    'abos_principle', public._oabp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Organizational Alignment Engine (ABOS Phase 68) — extends A.55 with cascading visibility, alignment questions, and live success criteria.',
    'alignment_note', 'Clarity, connection, shared purpose — people move together toward meaningful goals.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._oabp_distinction_note() to authenticated;
grant execute on function public._oabp_mission() to authenticated;
grant execute on function public._oabp_philosophy() to authenticated;
grant execute on function public._oabp_abos_principle() to authenticated;
grant execute on function public._oabp_objectives() to authenticated;
grant execute on function public._oabp_alignment_questions() to authenticated;
grant execute on function public._oabp_strategic_cascading() to authenticated;
grant execute on function public._oabp_cross_functional_visibility() to authenticated;
grant execute on function public._oabp_companion_guidance() to authenticated;
grant execute on function public._oabp_goal_communication() to authenticated;
grant execute on function public._oabp_self_love_connection() to authenticated;
grant execute on function public._oabp_leadership_insights() to authenticated;
grant execute on function public._oabp_trust_connection() to authenticated;
grant execute on function public._oabp_dogfooding() to authenticated;
grant execute on function public._oabp_vision_phrases() to authenticated;
grant execute on function public._oabp_integration_links() to authenticated;
grant execute on function public._oabp_engagement_summary(uuid) to authenticated;
grant execute on function public._oabp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-alignment-blueprint-phase68', 'Organizational Alignment Engine (ABOS Phase 68)',
  'Organizational Alignment Engine — extends Phase A.55 with alignment questions, strategic cascading, cross-functional visibility, companion guidance, goal communication, leadership insights, and live success criteria.',
  'authenticated', 108
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'strategic-alignment-blueprint-phase68' and tenant_id is null
);
