-- Implementation Blueprint Phase 74 — Predictive Operations Engine
-- Extends Predictive Insights Engine Phase A.66. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._popbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 74 — Predictive Operations Engine at /app/predictive-insights-engine. Extends Predictive Insights Engine Phase A.66 (20260911000000_predictive_insights_engine_phase_a66.sql). Distinct from Multi-Agent Collaboration repo Phase 74 at /app/agents. Distinct from Predictive Intelligence Engine PIE Phase 52 at /app/predictions (legacy trend rules — cross-link). Distinct from Future Readiness Blueprint Phase 63 (reflection NOT prediction at /app/future-tech). Distinct from Autonomous Operations Center Phase 79 at /app/operations. Distinct from Capacity & Workload A.64 at /app/capacity-workload-management-engine, Resource Planning A.63 at /app/resource-planning-engine. Distinct from Cross-Functional Intelligence Phase 70 on OCF A.32 at /app/operations-center-foundation-engine. Engine helpers use _pie_* — blueprint helpers use _popbp_* (Predictive Operations Blueprint). All A.66 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._popbp_mission()
returns text language sql immutable as $$
  select 'Identify operational trends, anticipate bottlenecks, and strengthen preparedness through responsible predictive insights.';
$$;

create or replace function public._popbp_philosophy()
returns text language sql immutable as $$
  select 'Prediction is not certainty — purpose is preparedness, not eliminating uncertainty.';
$$;

create or replace function public._popbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — The future cannot be controlled; recognize signals and respond thoughtfully. Preparedness is competitive advantage. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._popbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational_trend_awareness', 'label', 'Operational trend awareness', 'description', 'Surface support activity, milestone, and strain patterns from metadata — awareness not alarm'),
    jsonb_build_object('key', 'bottleneck_forecasting', 'label', 'Bottleneck forecasting', 'description', 'Anticipate workflow pressure and cross-functional dependencies if trends continue'),
    jsonb_build_object('key', 'resource_planning_support', 'label', 'Resource planning support', 'description', 'Workload concentration and capacity utilization trends for planning conversations'),
    jsonb_build_object('key', 'risk_anticipation', 'label', 'Risk anticipation', 'description', 'Emerging constraints and risk signals with confidence scoring — humans decide'),
    jsonb_build_object('key', 'capacity_observations', 'label', 'Capacity observations', 'description', 'Capacity utilization trends and planning opportunities — cross-link A.64'),
    jsonb_build_object('key', 'preparedness_enhancement', 'label', 'Preparedness enhancement', 'description', 'Earlier planning, scenario observations, and resilience strengthening — not prediction certainty')
  );
$$;

create or replace function public._popbp_operational_pattern_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Operational pattern recognition — support activity trends, concurrent milestones, recurring operational strain — encourage preparation.',
    'patterns', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'support_activity_trends', 'signal', 'Support activity trends suggest sustained demand — would earlier preparation help?', 'description', 'Ticket velocity and backlog metadata — awareness not alarm.'),
      jsonb_build_object('emoji', '🌹', 'key', 'concurrent_milestones', 'signal', 'Several milestones converge in the same period — would coordination context help?', 'description', 'Concurrent milestone metadata from OKR and operations integrations.'),
      jsonb_build_object('emoji', '🔔', 'key', 'recurring_operational_strain', 'signal', 'Recurring operational strain patterns appear — would a preparedness review help?', 'description', 'Recurring strain signals encourage thoughtful preparation — not deterministic conclusions.')
    ),
    'metadata_note', 'Pattern recognition uses metadata counts and trends only — no raw operational records.'
  );
$$;

create or replace function public._popbp_resource_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resource awareness — workload concentration, capacity utilization trends, emerging constraints, and planning opportunities.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'workload_concentration', 'label', 'Workload concentration', 'description', 'Teams or functions showing sustained workload above thresholds — metadata only'),
      jsonb_build_object('key', 'capacity_utilization_trends', 'label', 'Capacity utilization trends', 'description', 'Utilization trend metadata — cross-link Capacity & Workload A.64'),
      jsonb_build_object('key', 'emerging_constraints', 'label', 'Emerging constraints', 'description', 'Emerging resource or dependency constraints surfaced for human review'),
      jsonb_build_object('key', 'planning_opportunities', 'label', 'Planning opportunities', 'description', 'Windows for proactive resource planning and rebalancing conversations')
    ),
    'cross_links', jsonb_build_object(
      'capacity_workload', '/app/capacity-workload-management-engine',
      'resource_planning', '/app/resource-planning-engine'
    ),
    'awareness_note', 'Resource signals inform planning — humans allocate and decide.'
  );
$$;

create or replace function public._popbp_bottleneck_forecasting()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Bottleneck forecasting — workflow pressure if trends continue, cross-functional dependencies, additional support consideration — awareness not alarm.',
    'forecasts', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'workflow_pressure', 'signal', 'If current trends continue, workflow pressure may increase in this area — would earlier preparation help?', 'description', 'Trend continuation scenarios — not guarantees.'),
      jsonb_build_object('emoji', '🌹', 'key', 'cross_functional_dependencies', 'signal', 'Cross-functional dependencies may create coordination needs — would dependency context help?', 'description', 'Cross-link Cross-Functional Intelligence Phase 70 on OCF A.32.'),
      jsonb_build_object('emoji', '🔔', 'key', 'additional_support', 'signal', 'Additional support may deserve consideration — shall I summarize preparedness options?', 'description', 'Support consideration — humans decide staffing and priorities.')
    ),
    'boundary_note', 'Forecasts are illustrative metadata — never presented as certainty or guarantees.'
  );
$$;

create or replace function public._popbp_scenario_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Scenario observations — if conditions continue outcomes, actions to reduce strain, opportunities to strengthen resilience — explore possibilities thoughtfully.',
    'scenarios', jsonb_build_array(
      jsonb_build_object('key', 'if_conditions_continue', 'label', 'If conditions continue', 'description', 'Outcome observations if current operational trends persist — exploratory not deterministic'),
      jsonb_build_object('key', 'actions_to_reduce_strain', 'label', 'Actions to reduce strain', 'description', 'Preparedness actions humans may consider — Aipify prepares context only'),
      jsonb_build_object('key', 'resilience_opportunities', 'label', 'Resilience opportunities', 'description', 'Opportunities to strengthen operational resilience before strain peaks')
    ),
    'exploration_note', 'Scenarios encourage thoughtful exploration — humans evaluate and decide.'
  );
$$;

create or replace function public._popbp_executive_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive insights — operational preparedness summaries, emerging trends, and positive resilience indicators.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'preparedness_summaries', 'label', 'Operational preparedness summaries', 'description', 'Aggregate prediction and risk metadata for leadership review'),
      jsonb_build_object('key', 'emerging_trends', 'label', 'Emerging trends', 'description', 'Emerging operational trend signals with confidence levels — metadata only'),
      jsonb_build_object('key', 'positive_resilience', 'label', 'Positive resilience indicators', 'description', 'Indicators of strengthened preparedness and effective early response')
    ),
    'dialogue_note', 'Executive observations encourage preparedness dialogue — not fear-based communication.'
  );
$$;

create or replace function public._popbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — earlier planning, teams well positioned, additional preparation — intentional action.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'earlier_planning', 'prompt', 'Trends suggest this area may need attention — would earlier planning help?', 'consideration', 'Gentle preparedness awareness — reduce anxiety, not increase it.'),
      jsonb_build_object('emoji', '🌹', 'key', 'teams_well_positioned', 'prompt', 'Your teams appear well positioned for upcoming milestones — shall I summarize readiness context?', 'consideration', 'Positive preparedness framing when signals support confidence.'),
      jsonb_build_object('emoji', '🔔', 'key', 'additional_preparation', 'prompt', 'Additional preparation may strengthen resilience — would a preparedness summary help?', 'consideration', 'Intentional action suggestions — humans approve all operational changes.')
    )
  );
$$;

create or replace function public._popbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — preparation, perspective, confidence, and sustainable responses.',
    'practices', jsonb_build_array(
      'Preparation over panic — awareness provides opportunities to prepare thoughtfully',
      'Perspective — predictions inform, they do not dictate outcomes',
      'Confidence — early recognition enables effective response',
      'Sustainable responses — reduce anxiety, not increase it'
    ),
    'self_love_route', '/app/self-love-engine',
    'journey_phrase', 'Awareness provides opportunities to prepare thoughtfully.',
    'boundary_note', 'Self Love supports calm preparedness — principle only; Predictive Operations stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._popbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about information sources, forecast assumptions, and remaining uncertainties.',
    'users_should_see', jsonb_build_array(
      'Which metadata sources feed operational trend and bottleneck observations',
      'Confidence levels and risk scoring assumptions for each prediction',
      'Remaining uncertainties — predictions are not guarantees',
      'Human control — humans dismiss, act, or ignore predictions; Aipify never auto-executes'
    ),
    'operators_should_understand', jsonb_build_array(
      'Predictive signals are illustrative metadata — not deterministic forecasts',
      'Limitation principles block fear-based and guarantee language in scaffolds',
      'Cross-links PIE Phase 52 legacy rules — distinct from A.66 predictive insights',
      'Cross-links Future Readiness Phase 63 — reflection NOT prediction'
    ),
    'audit_note', 'Insight generation, dismissal, and export are audited — metadata only.'
  );
$$;

create or replace function public._popbp_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — preparedness not prediction certainty.',
    'forbidden', jsonb_build_array(
      'Forecasts presented as guarantees or certainties',
      'Fear-based communication or alarmist prediction copy',
      'Deterministic conclusions about future outcomes',
      'Auto-execution based on predicted outcomes'
    ),
    'required', jsonb_build_array(
      'Confidence scoring and risk levels on every insight',
      'Explicit uncertainty and assumption transparency',
      'Human review before operational action',
      'Preparedness framing — earlier planning, not panic'
    ),
    'boundary_note', 'Aipify informs and prepares; humans decide. Prediction is not certainty.'
  );
$$;

create or replace function public._popbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates predictive operations patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product roadmap, Sales Expert growth, operational scaling, ecosystem resilience',
      'focus', jsonb_build_array(
        'Product roadmap milestone and support trend predictions',
        'Sales Expert growth operational scaling signals',
        'Internal operational scaling and capacity observations',
        'Ecosystem resilience and preparedness summaries'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational preparedness',
      'focus', jsonb_build_array(
        'Support backlog and workload trend predictions',
        'Adoption and training completion forecasts',
        'Cross-functional dependency awareness for operations',
        'Human-reviewed dismissal and preparedness actions'
      )
    )
  );
$$;

create or replace function public._popbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We recognized this challenge early enough to respond effectively.',
    'Uncertainty with awareness and confidence.',
    'Preparedness is competitive advantage.',
    'Awareness provides opportunities to prepare thoughtfully.',
    'Prediction informs — humans decide with confidence.'
  );
$$;

create or replace function public._popbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Predictive Intelligence Engine (PIE Phase 52)', 'route', '/app/predictions', 'note', 'Legacy trend rules — cross-link only, distinct from A.66'),
    jsonb_build_object('label', 'Future Readiness (Blueprint Phase 63)', 'route', '/app/future-tech', 'note', 'Reflection NOT prediction — cross-link only'),
    jsonb_build_object('label', 'Autonomous Operations Center (Phase 79)', 'route', '/app/operations', 'note', 'Autonomous operations — distinct from predictive preparedness'),
    jsonb_build_object('label', 'Capacity & Workload (A.64)', 'route', '/app/capacity-workload-management-engine', 'note', 'Capacity utilization — cross-link in resource awareness'),
    jsonb_build_object('label', 'Resource Planning (A.63)', 'route', '/app/resource-planning-engine', 'note', 'Resource allocation planning — cross-link only'),
    jsonb_build_object('label', 'Cross-Functional Intelligence (Blueprint 70 / OCF A.32)', 'route', '/app/operations-center-foundation-engine', 'note', 'Cross-functional dependency context — cross-link only'),
    jsonb_build_object('label', 'Multi-Agent Collaboration (Repo Phase 74)', 'route', '/app/agents', 'note', 'Specialist agent orchestration — distinct ABOS blueprint surface'),
    jsonb_build_object('label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Long-range strategic signals feed prediction confidence'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive preparedness summaries — cross-link'),
    jsonb_build_object('label', 'Goals & OKR (A.65)', 'route', '/app/goals-okr-engine', 'note', 'Missed-objective forecasts — cross-link'),
    jsonb_build_object('label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Adoption predictions — cross-link'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Calm preparedness — principle only')
  );
$$;

create or replace function public._popbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active_insights int := 0;
  v_high_risk int := 0;
  v_critical int := 0;
  v_prediction_types int := 0;
  v_dismissed int := 0;
begin
  select count(*) into v_active_insights
  from public.organization_predictive_insights
  where organization_id = p_org_id and status = 'active';

  select count(*) into v_high_risk
  from public.organization_predictive_insights
  where organization_id = p_org_id and status = 'active' and risk_level = 'high';

  select count(*) into v_critical
  from public.organization_predictive_insights
  where organization_id = p_org_id and status = 'active' and risk_level = 'critical';

  select count(distinct prediction_type) into v_prediction_types
  from public.organization_predictive_insights
  where organization_id = p_org_id and status = 'active';

  select count(*) into v_dismissed
  from public.organization_predictive_insights
  where organization_id = p_org_id and status = 'dismissed';

  return jsonb_build_object(
    'active_insights', coalesce(v_active_insights, 0),
    'high_risk_insights', coalesce(v_high_risk, 0),
    'critical_insights', coalesce(v_critical, 0),
    'prediction_type_count', coalesce(v_prediction_types, 0),
    'dismissed_insights', coalesce(v_dismissed, 0),
    'pattern_signals', jsonb_array_length(public._popbp_operational_pattern_recognition()->'patterns'),
    'bottleneck_forecasts', jsonb_array_length(public._popbp_bottleneck_forecasting()->'forecasts'),
    'companion_examples', jsonb_array_length(public._popbp_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — prediction counts, types, and risk levels. No raw operational records or PII.'
  );
end; $$;

create or replace function public._popbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_insights int := 0;
  v_prediction_types int := 0;
  v_high_risk int := 0;
begin
  v_engagement := public._popbp_engagement_summary(p_org_id);
  v_active_insights := coalesce((v_engagement->>'active_insights')::int, 0);
  v_prediction_types := coalesce((v_engagement->>'prediction_type_count')::int, 0);
  v_high_risk := coalesce((v_engagement->>'high_risk_insights')::int, 0) +
    coalesce((v_engagement->>'critical_insights')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'earlier_preparation',
      'label', 'Earlier preparation — active predictive insights tracked',
      'met', v_active_insights >= 1,
      'note', case when v_active_insights < 1 then 'Generate predictive insights to enable preparedness tracking.' else null end
    ),
    jsonb_build_object(
      'key', 'operational_trend_awareness',
      'label', 'Operational trend awareness — pattern recognition documented',
      'met', jsonb_array_length(public._popbp_operational_pattern_recognition()->'patterns') >= 3,
      'note', 'Support activity, concurrent milestones, recurring strain — metadata only.'
    ),
    jsonb_build_object(
      'key', 'bottleneck_forecasting',
      'label', 'Bottleneck forecasting — workflow pressure and dependency signals',
      'met', jsonb_array_length(public._popbp_bottleneck_forecasting()->'forecasts') >= 3,
      'note', 'Awareness not alarm — never presented as guarantees.'
    ),
    jsonb_build_object(
      'key', 'resource_planning_support',
      'label', 'Resource planning support — workload and capacity dimensions documented',
      'met', jsonb_array_length(public._popbp_resource_awareness()->'dimensions') >= 4,
      'note', 'Cross-link Capacity A.64 and Resource Planning A.63.'
    ),
    jsonb_build_object(
      'key', 'fewer_surprises',
      'label', 'Fewer operational surprises — multiple prediction types active',
      'met', v_prediction_types >= 2,
      'note', case when v_prediction_types < 2 then 'Diverse prediction types improve preparedness breadth.' else null end
    ),
    jsonb_build_object(
      'key', 'strengthened_resilience',
      'label', 'Strengthened resilience — scenario observations documented',
      'met', jsonb_array_length(public._popbp_scenario_observations()->'scenarios') >= 3,
      'note', 'Explore possibilities thoughtfully — humans decide.'
    ),
    jsonb_build_object(
      'key', 'preparedness_confidence',
      'label', 'Preparedness confidence — companion guidance and Self Love connection',
      'met', jsonb_array_length(public._popbp_companion_guidance()->'examples') >= 3
        and (public._popbp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Reduce anxiety, not increase it.'
    ),
    jsonb_build_object(
      'key', 'executive_insights',
      'label', 'Executive insights — preparedness summaries, trends, resilience indicators',
      'met', jsonb_array_length(public._popbp_executive_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no guarantees, no fear-based copy, no deterministic conclusions',
      'met', jsonb_array_length(public._popbp_limitation_principles()->'forbidden') >= 4,
      'note', 'Preparedness not prediction certainty.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, assumptions, uncertainties documented',
      'met', jsonb_array_length(public._popbp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from PIE Phase 52, Future Readiness 63, Agents Phase 74, Operations 79',
      'met', jsonb_array_length(public._popbp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate prediction storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group roadmap, Sales Expert growth, operational scaling',
      'met', (public._popbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — recognize signals, respond thoughtfully; preparedness is advantage',
      'met', true,
      'note', 'Humans decide — predictions inform only.'
    ),
    jsonb_build_object(
      'key', 'risk_awareness',
      'label', 'Risk anticipation — high-risk insights surfaced for human review',
      'met', v_high_risk >= 0,
      'note', case when v_active_insights >= 1 and v_high_risk = 0 then 'No high-risk insights currently — review active predictions periodically.' else null end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.66 fields; append Phase 74
-- ---------------------------------------------------------------------------
create or replace function public.get_predictive_insights_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('predictions.view');
  v_org_id := public._mta_require_organization();
  perform public._pie_seed_insights(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Forward-looking operational intelligence — predictions inform, humans decide.',
    'principles', jsonb_build_array(
      'Transparent confidence scoring',
      'Risk-aware prioritization',
      'Metadata-only signals',
      'Human review before action',
      'Audit-supported accountability'
    ),
    'summary', public._pie_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'active_insights', coalesce((
        select jsonb_agg(row_to_json(i) order by
          case i.risk_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end,
          i.created_at desc)
        from public.organization_predictive_insights i
        where i.organization_id = v_org_id and i.status = 'active'
        limit 40
      ), '[]'::jsonb),
      'by_prediction_type', coalesce((
        select jsonb_agg(jsonb_build_object(
          'prediction_type', i.prediction_type,
          'count', count(*),
          'high_risk_count', count(*) filter (where i.risk_level in ('high', 'critical'))
        ) order by count(*) desc)
        from public.organization_predictive_insights i
        where i.organization_id = v_org_id and i.status = 'active'
        group by i.prediction_type
      ), '[]'::jsonb),
      'by_risk_level', coalesce((
        select jsonb_agg(jsonb_build_object('risk_level', i.risk_level, 'count', count(*)) order by i.risk_level)
        from public.organization_predictive_insights i
        where i.organization_id = v_org_id and i.status = 'active'
        group by i.risk_level
      ), '[]'::jsonb)
    ),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_predictive_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._pie_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'strategic_intelligence', 'Strategic signals inform long-range predictions — A.31',
      'executive_insights', 'Executive summaries contextualize prediction impact — A.35',
      'analytics_insights', 'Operational trend metadata feeds confidence — A.48',
      'organizational_health', 'Health scores influence adoption predictions — A.56',
      'goals_okr', 'OKR progress drives missed-objective forecasts — A.65'
    ),
    'integration_summaries', jsonb_build_object(
      'strategic_intelligence', public._pie_strategic_intelligence_summary(v_org_id),
      'executive_insights', public._pie_executive_insights_summary(v_org_id),
      'analytics_insights', public._pie_analytics_summary(v_org_id),
      'organizational_health', public._pie_health_summary(v_org_id),
      'goals_okr', public._pie_okr_summary(v_org_id)
    ),
    'implementation_blueprint_phase74', jsonb_build_object(
      'phase', 'Phase 74 — Predictive Operations Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE74_PREDICTIVE_OPERATIONS.md',
      'engine_phase', 'Phase A.66 Predictive Insights Engine',
      'route', '/app/predictive-insights-engine',
      'mapping_note', 'ABOS Blueprint Phase 74 extends A.66 with operational pattern recognition, resource awareness, bottleneck forecasting, scenario observations, executive insights, companion guidance, limitation principles, and live success criteria.'
    ),
    'predictive_operations_note', 'Predictive Operations Engine (ABOS Phase 74) — extends Phase A.66 with operational trend awareness, bottleneck forecasting, preparedness enhancement, and responsible predictive insights.',
    'blueprint_distinction_note', public._popbp_distinction_note(),
    'blueprint_mission', public._popbp_mission(),
    'blueprint_philosophy', public._popbp_philosophy(),
    'blueprint_abos_principle', public._popbp_abos_principle(),
    'blueprint_objectives', public._popbp_objectives(),
    'operational_pattern_recognition', public._popbp_operational_pattern_recognition(),
    'resource_awareness', public._popbp_resource_awareness(),
    'bottleneck_forecasting', public._popbp_bottleneck_forecasting(),
    'scenario_observations', public._popbp_scenario_observations(),
    'executive_insights_blueprint', public._popbp_executive_insights(),
    'companion_guidance', public._popbp_companion_guidance(),
    'self_love_connection', public._popbp_self_love_connection(),
    'trust_connection', public._popbp_trust_connection(),
    'limitation_principles', public._popbp_limitation_principles(),
    'dogfooding', public._popbp_dogfooding(),
    'blueprint_integration_links', public._popbp_integration_links(),
    'engagement_summary', public._popbp_engagement_summary(v_org_id),
    'success_criteria', public._popbp_success_criteria(v_org_id),
    'vision_phrases', public._popbp_vision_phrases(),
    'privacy_note', 'Predictive insights and operations blueprint data is metadata only — prediction counts, confidence, risk levels, and preparedness signals. No raw customer content, chat, or PII. Humans dismiss and act; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.66 fields; append Phase 74 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_predictive_insights_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._pie_seed_insights(v_org_id);
  v_summary := public._pie_executive_summary_block(v_org_id);
  v_engagement := public._popbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Predictive Insights — forward-looking operational intelligence.',
    'active_insights', v_summary->'active_insights',
    'high_risk_insights', v_summary->'high_risk_insights',
    'critical_insights', v_summary->'critical_insights',
    'prediction_type_count', v_summary->'prediction_type_count',
    'implementation_blueprint_phase74', jsonb_build_object(
      'phase', 'Phase 74 — Predictive Operations Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE74_PREDICTIVE_OPERATIONS.md',
      'engine_phase', 'Phase A.66 Predictive Insights Engine',
      'route', '/app/predictive-insights-engine'
    ),
    'mission', public._popbp_mission(),
    'abos_principle', public._popbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Predictive Operations Engine (ABOS Phase 74) — extends A.66 with operational trends, bottleneck forecasting, and live success criteria.',
    'preparedness_note', 'Prediction is not certainty — preparedness is competitive advantage.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._popbp_distinction_note() to authenticated;
grant execute on function public._popbp_mission() to authenticated;
grant execute on function public._popbp_philosophy() to authenticated;
grant execute on function public._popbp_abos_principle() to authenticated;
grant execute on function public._popbp_objectives() to authenticated;
grant execute on function public._popbp_operational_pattern_recognition() to authenticated;
grant execute on function public._popbp_resource_awareness() to authenticated;
grant execute on function public._popbp_bottleneck_forecasting() to authenticated;
grant execute on function public._popbp_scenario_observations() to authenticated;
grant execute on function public._popbp_executive_insights() to authenticated;
grant execute on function public._popbp_companion_guidance() to authenticated;
grant execute on function public._popbp_self_love_connection() to authenticated;
grant execute on function public._popbp_trust_connection() to authenticated;
grant execute on function public._popbp_limitation_principles() to authenticated;
grant execute on function public._popbp_dogfooding() to authenticated;
grant execute on function public._popbp_vision_phrases() to authenticated;
grant execute on function public._popbp_integration_links() to authenticated;
grant execute on function public._popbp_engagement_summary(uuid) to authenticated;
grant execute on function public._popbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'predictive-insights-blueprint-phase74', 'Predictive Operations Engine (ABOS Phase 74)',
  'Predictive Operations Engine — extends Phase A.66 with operational trend awareness, bottleneck forecasting, resource awareness, scenario observations, companion guidance, limitation principles, and live success criteria.',
  'authenticated', 114
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'predictive-insights-blueprint-phase74' and tenant_id is null
);
