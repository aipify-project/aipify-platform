-- Implementation Blueprint Phase 69 — Strategic Execution Engine
-- Extends Goals & OKR Engine Phase A.65. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._sebp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 69 — Strategic Execution Engine at /app/goals-okr-engine. Extends Goals & OKR Engine Phase A.65 (20260910000000_goals_okr_engine_phase_a65.sql). Distinct from Strategic Alignment A.55 Blueprint Phase 68 at /app/strategic-alignment-engine (alignment vs execution — cross-link). Distinct from Value Realization A.48 at /app/value-realization-engine (outcome/ROI measurement — cross-link). Distinct from Unified Task & Follow-Up A.62 at /app/unified-task-follow-up-engine (task layer — cross-link in execution cascade). Distinct from Workflow Orchestration A.42 and Blueprint Phase 40. Distinct from AEF Phase 44 at /app/action-center (autonomous execution framework). Distinct from Marketplace repo Phase 69 at /app/marketplace — ABOS blueprint 69 is this spec. Distinct from personal Goals & Dreams GDE at /app/assistant/goals. Engine helpers use _goke_* — blueprint helpers use _sebp_* (do not collide). All A.65 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._sebp_mission()
returns text language sql immutable as $$
  select 'Convert priorities into progress — execution discipline with flexibility and human judgment.';
$$;

create or replace function public._sebp_philosophy()
returns text language sql immutable as $$
  select 'Strategy without execution frustrates; execution without strategy wastes effort; excel at both.';
$$;

create or replace function public._sebp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Vision creates direction; execution creates reality. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._sebp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'initiative_tracking', 'label', 'Initiative tracking', 'description', 'Track strategic initiatives from objective through milestones to outcomes'),
    jsonb_build_object('key', 'strategic_accountability', 'label', 'Strategic accountability', 'description', 'Transparent ownership across objectives, key results, and execution layers'),
    jsonb_build_object('key', 'progress_visibility', 'label', 'Progress visibility', 'description', 'Initiative status, milestone completion, dependencies, and achievement summaries'),
    jsonb_build_object('key', 'milestone_coordination', 'label', 'Milestone coordination', 'description', 'Coordinate milestones across functions with dependency awareness'),
    jsonb_build_object('key', 'cross_functional_execution', 'label', 'Cross-functional execution', 'description', 'Shared ownership and collaboration opportunities across teams'),
    jsonb_build_object('key', 'adaptive_prioritization', 'label', 'Adaptive prioritization', 'description', 'Flexible execution when external conditions change — humans reprioritize')
  );
$$;

create or replace function public._sebp_strategic_initiatives()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic initiatives — intentional execution across transformation, expansion, development, and change.',
    'initiative_types', jsonb_build_array(
      jsonb_build_object('key', 'digital_transformation', 'label', 'Digital transformation', 'description', 'Technology and process modernization with measurable milestones'),
      jsonb_build_object('key', 'market_expansion', 'label', 'Market expansion', 'description', 'Growth into new markets with coordinated execution'),
      jsonb_build_object('key', 'product_development', 'label', 'Product development', 'description', 'Roadmap delivery with milestone accountability'),
      jsonb_build_object('key', 'organizational_change', 'label', 'Organizational change', 'description', 'Structural and cultural change with transparent progress')
    ),
    'metadata_note', 'Initiative framing is metadata only — awareness not micromanagement.'
  );
$$;

create or replace function public._sebp_execution_cascade()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Execution cascade — from strategic objective through tasks to outcomes.',
    'levels', jsonb_build_array(
      jsonb_build_object('key', 'strategic_objective', 'label', 'Strategic Objective', 'description', 'Organization-level objectives in Goals & OKR Engine'),
      jsonb_build_object('key', 'initiative', 'label', 'Initiative', 'description', 'Intentional execution programs linked to objectives'),
      jsonb_build_object('key', 'milestones', 'label', 'Milestones', 'description', 'Measurable checkpoints — key results and milestone metadata'),
      jsonb_build_object('key', 'tasks', 'label', 'Tasks', 'description', 'Implementation tasks — cross-link Unified Task & Follow-Up A.62'),
      jsonb_build_object('key', 'outcomes', 'label', 'Outcomes', 'description', 'Achievement summaries — cross-link Value Realization A.48')
    ),
    'task_cross_link', '/app/unified-task-follow-up-engine',
    'value_cross_link', '/app/value-realization-engine',
    'alignment_cross_link', '/app/strategic-alignment-engine'
  );
$$;

create or replace function public._sebp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — awareness not micromanagement. Limited progress, milestones completed, cross-functional coordination.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'limited_progress', 'prompt', 'Progress on this initiative has been limited recently — would a brief review help?', 'consideration', 'Gentle awareness of stalled momentum — humans decide next steps.'),
      jsonb_build_object('emoji', '🌹', 'key', 'milestones_completed', 'prompt', 'Several milestones were completed — shall I summarize achievement progress?', 'consideration', 'Celebrate progress without pressure — metadata summaries only.'),
      jsonb_build_object('emoji', '🔔', 'key', 'cross_functional_coordination', 'prompt', 'This initiative spans multiple functions — would dependency context help coordination?', 'consideration', 'Cross-functional awareness supports collaboration — not automated task assignment.')
    )
  );
$$;

create or replace function public._sebp_progress_visibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Progress visibility — initiative status, milestone completion, dependencies, and achievement summaries.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'initiative_status', 'label', 'Initiative status', 'description', 'Objective and key result status aggregates — metadata only'),
      jsonb_build_object('key', 'milestone_completion', 'label', 'Milestone completion', 'description', 'Key result progress and completion percentages'),
      jsonb_build_object('key', 'dependencies', 'label', 'Dependencies', 'description', 'Cross-functional dependency awareness from integration summaries'),
      jsonb_build_object('key', 'achievement_summaries', 'label', 'Achievement summaries', 'description', 'Completed objectives and outcome metadata — no raw operational content')
    ),
    'visibility_note', 'Execution visibility informs leadership — not performance surveillance.'
  );
$$;

create or replace function public._sebp_adaptive_execution()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptive execution — external conditions change; reprioritization may deserve consideration with flexible execution.',
    'signals', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'external_conditions', 'signal', 'External conditions have changed — reprioritization may deserve consideration.', 'description', 'Market, resource, or strategic shifts surfaced for human review.'),
      jsonb_build_object('emoji', '🌹', 'key', 'flexible_execution', 'signal', 'Flexible execution preserves momentum when priorities shift.', 'description', 'Humans approve timeline and priority adjustments — Aipify prepares context only.')
    ),
    'boundary_note', 'Adaptive prioritization never auto-reprioritizes — humans decide.'
  );
$$;

create or replace function public._sebp_cross_functional_coordination()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cross-functional coordination — shared ownership, dependency awareness, communication support, collaboration opportunities.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'shared_ownership', 'label', 'Shared ownership', 'description', 'Objectives with cross-team accountability and owner metadata'),
      jsonb_build_object('key', 'dependency_awareness', 'label', 'Dependency awareness', 'description', 'Integration summaries surface task and alignment dependencies'),
      jsonb_build_object('key', 'communication_support', 'label', 'Communication support', 'description', 'Achievement and progress summaries for leadership dialogue'),
      jsonb_build_object('key', 'collaboration_opportunities', 'label', 'Collaboration opportunities', 'description', 'Cross-functional initiatives identified for human review')
    ),
    'metadata_note', 'Coordination signals are metadata only — no PII or raw operational content.'
  );
$$;

create or replace function public._sebp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable pacing, celebrate progress, reflect on lessons, recognize effort.',
    'practices', jsonb_build_array(
      'Sustainable pacing — execution without burnout or guilt',
      'Celebrate progress on completed milestones and objectives',
      'Reflect on lessons from at-risk and completed initiatives',
      'Recognize effort across cross-functional contributors'
    ),
    'self_love_route', '/app/self-love-engine',
    'journey_phrase', 'Meaningful progress is often built one milestone at a time.',
    'boundary_note', 'Self Love supports sustainable rhythms — principle only; Strategic Execution stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._sebp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — initiative summaries, execution bottlenecks, and positive momentum encourage dialogue.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'initiative_summaries', 'label', 'Initiative summaries', 'description', 'Aggregate objective and key result status — metadata only'),
      jsonb_build_object('key', 'execution_bottlenecks', 'label', 'Execution bottlenecks', 'description', 'At-risk objectives and key results surfaced for review'),
      jsonb_build_object('key', 'positive_momentum', 'label', 'Positive momentum', 'description', 'Completed objectives and on-track progress for recognition')
    ),
    'dialogue_note', 'Observations encourage conversation — humans decide; Aipify prepares context only.'
  );
$$;

create or replace function public._sebp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about how progress observations are generated, assumptions, and optional insights.',
    'users_should_see', jsonb_build_array(
      'How progress observations and at-risk signals are derived — metadata patterns only',
      'Optional companion guidance — leaders control enablement',
      'How objectives and key results shape execution assistance — explainability included',
      'Human control — humans approve activation, completion, and reprioritization'
    ),
    'operators_should_understand', jsonb_build_array(
      'Execution signals are illustrative metadata — not performance surveillance',
      'Interventions prepare review context — never auto-execute or auto-reprioritize',
      'Cross-links Strategic Alignment Phase 68 — alignment distinct from execution tracking',
      'Cross-links Unified Tasks A.62 — task layer in execution cascade, not duplicate OKR storage'
    ),
    'audit_note', 'Objective activation, progress updates, and completion approvals are audited — metadata only.'
  );
$$;

create or replace function public._sebp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates strategic execution patterns internally — product roadmap, ecosystem development, Sales Expert initiatives, and strategic priorities.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product roadmap, ecosystem development, Sales Expert initiatives, strategic priorities',
      'focus', jsonb_build_array(
        'Product roadmap milestones tracked as organizational objectives',
        'Ecosystem development initiatives with key result progress',
        'Sales Expert initiatives coordinated across functions',
        'Strategic priority execution with human-approved activation'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational execution',
      'focus', jsonb_build_array(
        'Customer success objectives with measurable key results',
        'Cross-functional execution between support and operations',
        'Milestone coordination via OKR hierarchy',
        'At-risk detection and human-approved interventions'
      )
    )
  );
$$;

create or replace function public._sebp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We are making measurable progress toward the future we envision.',
    'Vision creates direction; execution creates reality.',
    'Meaningful progress is often built one milestone at a time.',
    'Strategy and execution together create intentional progress.',
    'Flexible execution with human judgment sustains momentum.'
  );
$$;

create or replace function public._sebp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Strategic Alignment (A.55 / Blueprint 68)', 'route', '/app/strategic-alignment-engine', 'note', 'Alignment vs execution — cross-link only'),
    jsonb_build_object('label', 'Value Realization (A.48)', 'route', '/app/value-realization-engine', 'note', 'Outcome and ROI measurement — cross-link in execution cascade outcomes'),
    jsonb_build_object('label', 'Unified Task & Follow-Up (A.62)', 'route', '/app/unified-task-follow-up-engine', 'note', 'Task layer in execution cascade — cross-link only'),
    jsonb_build_object('label', 'Workflow Orchestration (A.42)', 'route', '/app/workflow-orchestration-engine', 'note', 'Human-defined workflows — distinct from OKR execution tracking'),
    jsonb_build_object('label', 'Autonomous Execution (AEF Phase 44)', 'route', '/app/action-center', 'note', 'Autonomous execution framework — distinct from strategic execution blueprint'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive reporting — OKR progress feeds summaries'),
    jsonb_build_object('label', 'Capacity & Workload (A.64)', 'route', '/app/capacity-workload-management-engine', 'note', 'Resource context for execution recommendations'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Completion outcomes captured as metadata'),
    jsonb_build_object('label', 'Goals & Dreams (GDE)', 'route', '/app/assistant/goals', 'note', 'Personal aspirations — distinct from organizational OKRs'),
    jsonb_build_object('label', 'Marketplace (Repo Phase 69)', 'route', '/app/marketplace', 'note', 'Marketplace catalog — distinct from ABOS Blueprint Phase 69'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing — principle only')
  );
$$;

create or replace function public._sebp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total_objectives int := 0;
  v_active_objectives int := 0;
  v_total_key_results int := 0;
  v_at_risk_key_results int := 0;
  v_completed_objectives int := 0;
  v_avg_progress numeric := 0;
begin
  select count(*) into v_total_objectives
  from public.organization_objectives where organization_id = p_org_id;

  select count(*) into v_active_objectives
  from public.organization_objectives
  where organization_id = p_org_id and status in ('active', 'on_track', 'at_risk');

  select count(*) into v_total_key_results
  from public.organization_key_results where organization_id = p_org_id;

  select count(*) into v_at_risk_key_results
  from public.organization_key_results
  where organization_id = p_org_id and status = 'at_risk';

  select count(*) into v_completed_objectives
  from public.organization_objectives
  where organization_id = p_org_id and status = 'completed';

  select coalesce(round(avg(kr.progress_percentage), 1), 0) into v_avg_progress
  from public.organization_key_results kr
  join public.organization_objectives o on o.id = kr.objective_id
  where kr.organization_id = p_org_id
    and o.status in ('active', 'on_track', 'at_risk')
    and kr.status not in ('archived', 'completed');

  return jsonb_build_object(
    'total_objectives', coalesce(v_total_objectives, 0),
    'active_objectives', coalesce(v_active_objectives, 0),
    'total_key_results', coalesce(v_total_key_results, 0),
    'at_risk_key_results', coalesce(v_at_risk_key_results, 0),
    'completed_objectives', coalesce(v_completed_objectives, 0),
    'avg_progress_pct', coalesce(v_avg_progress, 0),
    'cascade_levels', jsonb_array_length(public._sebp_execution_cascade()->'levels'),
    'companion_examples', jsonb_array_length(public._sebp_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — objective counts, key result progress, and execution summaries. No PII or raw operational content.'
  );
end; $$;

create or replace function public._sebp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_objectives int := 0;
  v_total_key_results int := 0;
  v_avg_progress numeric := 0;
  v_completed_objectives int := 0;
begin
  v_engagement := public._sebp_engagement_summary(p_org_id);
  v_active_objectives := coalesce((v_engagement->>'active_objectives')::int, 0);
  v_total_key_results := coalesce((v_engagement->>'total_key_results')::int, 0);
  v_avg_progress := coalesce((v_engagement->>'avg_progress_pct')::numeric, 0);
  v_completed_objectives := coalesce((v_engagement->>'completed_objectives')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'initiative_momentum',
      'label', 'Initiative momentum — active objectives and key results tracked',
      'met', v_active_objectives >= 1 and v_total_key_results >= 1,
      'note', case when v_active_objectives < 1 or v_total_key_results < 1 then 'Activate objectives with key results for execution tracking.' else null end
    ),
    jsonb_build_object(
      'key', 'execution_visibility',
      'label', 'Execution visibility — progress visibility dimensions documented',
      'met', jsonb_array_length(public._sebp_progress_visibility()->'dimensions') >= 4,
      'note', 'Initiative status, milestones, dependencies, and achievements — metadata only.'
    ),
    jsonb_build_object(
      'key', 'cross_functional_collaboration',
      'label', 'Cross-functional collaboration — coordination dimensions documented',
      'met', jsonb_array_length(public._sebp_cross_functional_coordination()->'dimensions') >= 4,
      'note', case when v_active_objectives < 1 then 'Register cross-functional objectives for coordination context.' else null end
    ),
    jsonb_build_object(
      'key', 'effective_adaptation',
      'label', 'Effective adaptation — adaptive execution signals documented',
      'met', jsonb_array_length(public._sebp_adaptive_execution()->'signals') >= 2,
      'note', 'Flexible execution — humans reprioritize; Aipify prepares context.'
    ),
    jsonb_build_object(
      'key', 'intentional_progress',
      'label', 'Intentional progress — average key result progress or completed objectives',
      'met', v_avg_progress > 0 or v_completed_objectives >= 1,
      'note', case when v_avg_progress = 0 and v_completed_objectives < 1 then 'Record key result progress to demonstrate intentional execution.' else null end
    ),
    jsonb_build_object(
      'key', 'execution_cascade',
      'label', 'Execution cascade — Strategic Objective → Initiative → Milestones → Tasks → Outcomes',
      'met', jsonb_array_length(public._sebp_execution_cascade()->'levels') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'strategic_initiatives',
      'label', 'Strategic initiatives — transformation, expansion, development, change',
      'met', jsonb_array_length(public._sebp_strategic_initiatives()->'initiative_types') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — limited progress, milestones completed, cross-functional coordination (🦉🌹🔔)',
      'met', jsonb_array_length(public._sebp_companion_guidance()->'examples') >= 3,
      'note', 'Awareness not micromanagement — humans decide.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — initiative summaries, bottlenecks, positive momentum',
      'met', jsonb_array_length(public._sebp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable pacing and milestone-by-milestone progress',
      'met', (public._sebp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Meaningful progress is often built one milestone at a time.'
    ),
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Blueprint objectives — tracking, accountability, visibility, milestones, cross-functional, adaptive',
      'met', jsonb_array_length(public._sebp_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent progress observation generation documented',
      'met', jsonb_array_length(public._sebp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Alignment, Value Realization, Tasks, Workflow, AEF, Marketplace, GDE',
      'met', jsonb_array_length(public._sebp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate OKR or task storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group product roadmap, ecosystem, Sales Expert initiatives',
      'met', (public._sebp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — Vision creates direction; execution creates reality',
      'met', true,
      'note', 'Measurable progress toward the envisioned future — humans decide.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.65 fields; append Phase 69
-- ---------------------------------------------------------------------------
create or replace function public.get_goals_okr_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('okr.view');
  v_org_id := public._mta_require_organization();
  perform public._goke_seed_okrs(v_org_id);
  perform public._goke_detect_at_risk(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Strategic clarity, measurable outcomes, transparent ownership — humans approve activation and completion.',
    'principles', jsonb_build_array(
      'Strategic clarity',
      'Measurable outcomes',
      'Transparent ownership',
      'Regular review cycles',
      'Audit-supported accountability'
    ),
    'summary', public._goke_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'active_objectives', coalesce((
        select jsonb_agg(row_to_json(o) order by o.priority desc, o.target_date nulls last)
        from public.organization_objectives o
        where o.organization_id = v_org_id and o.status in ('active', 'on_track', 'at_risk')
        limit 40
      ), '[]'::jsonb),
      'progress_by_department', coalesce((
        select jsonb_agg(jsonb_build_object(
          'hierarchy_level', o.hierarchy_level,
          'objective_count', count(*),
          'avg_progress', round(avg(kr.progress_percentage), 1)
        ) order by o.hierarchy_level)
        from public.organization_objectives o
        left join public.organization_key_results kr on kr.objective_id = o.id
        where o.organization_id = v_org_id and o.status in ('active', 'on_track', 'at_risk')
        group by o.hierarchy_level
      ), '[]'::jsonb),
      'at_risk_key_results', coalesce((
        select jsonb_agg(row_to_json(kr) order by kr.progress_percentage)
        from public.organization_key_results kr
        where kr.organization_id = v_org_id and kr.status = 'at_risk'
        limit 30
      ), '[]'::jsonb),
      'completion_forecasts', coalesce((
        select jsonb_agg(jsonb_build_object(
          'objective_id', o.id,
          'objective_name', o.objective_name,
          'target_date', o.target_date,
          'avg_progress', round(avg(kr.progress_percentage), 1)
        ) order by o.target_date nulls last)
        from public.organization_objectives o
        join public.organization_key_results kr on kr.objective_id = o.id
        where o.organization_id = v_org_id and o.status in ('active', 'on_track', 'at_risk')
        group by o.id, o.objective_name, o.target_date
        limit 20
      ), '[]'::jsonb),
      'strategic_focus_areas', coalesce((
        select jsonb_agg(row_to_json(o))
        from public.organization_objectives o
        where o.organization_id = v_org_id
          and o.priority = 'strategic'
          and o.status in ('active', 'on_track', 'at_risk')
        limit 15
      ), '[]'::jsonb)
    ),
    'hierarchy', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id,
        'objective_name', o.objective_name,
        'hierarchy_level', o.hierarchy_level,
        'parent_objective_id', o.parent_objective_id,
        'status', o.status
      ) order by o.hierarchy_level, o.created_at)
      from public.organization_objectives o
      where o.organization_id = v_org_id and o.status <> 'archived'
      limit 50
    ), '[]'::jsonb),
    'key_results', coalesce((
      select jsonb_agg(row_to_json(kr) order by kr.progress_percentage desc)
      from public.organization_key_results kr
      where kr.organization_id = v_org_id and kr.status not in ('archived')
      limit 50
    ), '[]'::jsonb),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_okr_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._goke_executive_summary_block(v_org_id),
    'interventions', public._goke_interventions(v_org_id),
    'integration_notes', jsonb_build_object(
      'executive_insights', 'OKR progress feeds executive summaries — A.35',
      'strategic_alignment', 'Objectives align with strategic alignment engine — A.55',
      'unified_tasks', 'Approved workflows may generate implementation tasks — A.62',
      'capacity_workload', 'Capacity context informs resource recommendations — A.64',
      'organizational_memory', 'Completion outcomes captured as metadata — A.34'
    ),
    'integration_summaries', jsonb_build_object(
      'strategic_alignment', public._goke_strategic_alignment_summary(v_org_id),
      'unified_tasks', public._goke_task_integration_summary(v_org_id)
    ),
    'implementation_blueprint_phase69', jsonb_build_object(
      'phase', 'Phase 69 — Strategic Execution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE69_STRATEGIC_EXECUTION.md',
      'engine_phase', 'Phase A.65 Goals & OKR Engine',
      'route', '/app/goals-okr-engine',
      'mapping_note', 'ABOS Blueprint Phase 69 extends A.65 with initiative tracking, execution cascade, progress visibility, adaptive execution, cross-functional coordination, companion guidance, leadership insights, and live success criteria.'
    ),
    'strategic_execution_note', 'Strategic Execution Engine (ABOS Phase 69) — extends Phase A.65 with execution cascade, initiative framing, adaptive prioritization, and milestone coordination.',
    'blueprint_distinction_note', public._sebp_distinction_note(),
    'blueprint_mission', public._sebp_mission(),
    'blueprint_philosophy', public._sebp_philosophy(),
    'blueprint_abos_principle', public._sebp_abos_principle(),
    'blueprint_objectives', public._sebp_objectives(),
    'strategic_initiatives', public._sebp_strategic_initiatives(),
    'execution_cascade', public._sebp_execution_cascade(),
    'companion_guidance', public._sebp_companion_guidance(),
    'progress_visibility', public._sebp_progress_visibility(),
    'adaptive_execution', public._sebp_adaptive_execution(),
    'cross_functional_coordination', public._sebp_cross_functional_coordination(),
    'self_love_connection', public._sebp_self_love_connection(),
    'leadership_insights', public._sebp_leadership_insights(),
    'trust_connection', public._sebp_trust_connection(),
    'dogfooding', public._sebp_dogfooding(),
    'blueprint_integration_links', public._sebp_integration_links(),
    'engagement_summary', public._sebp_engagement_summary(v_org_id),
    'success_criteria', public._sebp_success_criteria(v_org_id),
    'vision_phrases', public._sebp_vision_phrases(),
    'privacy_note', 'OKR and strategic execution data is metadata only — objectives, key results, progress summaries, and execution signals. No raw customer content, chat, or PII. Humans approve activation and completion; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.65 fields; append Phase 69 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_goals_okr_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._goke_seed_okrs(v_org_id);
  perform public._goke_detect_at_risk(v_org_id);
  v_summary := public._goke_executive_summary_block(v_org_id);
  v_engagement := public._sebp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Goals & OKR — measurable strategic outcomes.',
    'active_objectives', v_summary->'active_objectives',
    'at_risk_key_results', v_summary->'at_risk_key_results',
    'avg_progress_pct', v_summary->'avg_progress_pct',
    'strategic_objectives', v_summary->'strategic_objectives',
    'implementation_blueprint_phase69', jsonb_build_object(
      'phase', 'Phase 69 — Strategic Execution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE69_STRATEGIC_EXECUTION.md',
      'engine_phase', 'Phase A.65 Goals & OKR Engine',
      'route', '/app/goals-okr-engine'
    ),
    'mission', public._sebp_mission(),
    'abos_principle', public._sebp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Strategic Execution Engine (ABOS Phase 69) — extends A.65 with execution cascade, initiative tracking, and live success criteria.',
    'execution_note', 'Vision creates direction; execution creates reality — measurable progress toward the envisioned future.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._sebp_distinction_note() to authenticated;
grant execute on function public._sebp_mission() to authenticated;
grant execute on function public._sebp_philosophy() to authenticated;
grant execute on function public._sebp_abos_principle() to authenticated;
grant execute on function public._sebp_objectives() to authenticated;
grant execute on function public._sebp_strategic_initiatives() to authenticated;
grant execute on function public._sebp_execution_cascade() to authenticated;
grant execute on function public._sebp_companion_guidance() to authenticated;
grant execute on function public._sebp_progress_visibility() to authenticated;
grant execute on function public._sebp_adaptive_execution() to authenticated;
grant execute on function public._sebp_cross_functional_coordination() to authenticated;
grant execute on function public._sebp_self_love_connection() to authenticated;
grant execute on function public._sebp_leadership_insights() to authenticated;
grant execute on function public._sebp_trust_connection() to authenticated;
grant execute on function public._sebp_dogfooding() to authenticated;
grant execute on function public._sebp_vision_phrases() to authenticated;
grant execute on function public._sebp_integration_links() to authenticated;
grant execute on function public._sebp_engagement_summary(uuid) to authenticated;
grant execute on function public._sebp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'goals-okr-blueprint-phase69', 'Strategic Execution Engine (ABOS Phase 69)',
  'Strategic Execution Engine — extends Phase A.65 with initiative tracking, execution cascade, progress visibility, adaptive execution, cross-functional coordination, companion guidance, leadership insights, and live success criteria.',
  'authenticated', 109
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'goals-okr-blueprint-phase69' and tenant_id is null
);
