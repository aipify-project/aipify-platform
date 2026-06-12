-- Implementation Blueprint Phase 63 — Future Readiness Engine
-- Extends Future Technologies & Emerging Interfaces Phase 97. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._frbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 63 — Future Readiness Engine at /app/future-tech. Extends Future Technologies & Emerging Interfaces Phase 97 (20260626000000_future_technologies_emerging_interfaces_phase97.sql). Distinct from Organizational Resilience Engine A.50 /app/organizational-resilience-engine (crisis/disruption scenario planning — cross-link). Continuity Phase 80 /app/continuity. Strategic Intelligence Foundation A.31 /app/strategic-intelligence-foundation-engine (operational trend signals). Predictive Insights A.66 /app/predictive-insights-engine (predictions — blueprint emphasizes reflection NOT prediction). Legacy Strategy Phase 81 /app/strategy. Simulation Decision Lab Blueprint Phase 22 /app/simulations. Resource Planning Engine A.63 /app/resource-planning-engine (repo engine phase number collision — ABOS blueprint 63 is this spec). Engine helpers use _ftei_* — blueprint helpers use _frbp_*. Phase 97 tenant scope (has_customer, _ftei_require_tenant()) preserved — not organization model. All Phase 97 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._frbp_mission()
returns text language sql immutable as $$
  select 'Strengthen resilience and adaptability through long-term thinking, scenario awareness, and continuous preparedness.';
$$;

create or replace function public._frbp_philosophy()
returns text language sql immutable as $$
  select 'Future readiness is not knowing exactly what will happen — it is the capacity to respond thoughtfully. Preparation creates confidence; reflection matters more than prediction.';
$$;

create or replace function public._frbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — the future belongs to those who prepare thoughtfully, not necessarily those who predict most accurately. Humans decide; Aipify informs and prepares.';
$$;

create or replace function public._frbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'long_term_awareness', 'label', 'Long-term awareness', 'description', 'Leaders explore external changes and emerging themes — metadata only, reflection not prediction'),
    jsonb_build_object('key', 'scenario_preparedness', 'label', 'Scenario preparedness', 'description', 'Best, expected, and challenging case frameworks for thoughtful response planning'),
    jsonb_build_object('key', 'emerging_trend_exploration', 'label', 'Emerging trend exploration', 'description', 'Technology, regulatory, workforce, customer, market, and societal themes observed responsibly'),
    jsonb_build_object('key', 'strategic_resilience', 'label', 'Strategic resilience', 'description', 'Organizational adaptability through learning cultures and cross-functional understanding'),
    jsonb_build_object('key', 'adaptive_planning', 'label', 'Adaptive planning', 'description', 'Flexible structures and knowledge sharing that support evolving conditions'),
    jsonb_build_object('key', 'organizational_confidence', 'label', 'Organizational confidence', 'description', 'Preparedness without panic — recognition of existing strengths alongside capability gaps')
  );
$$;

create or replace function public._frbp_future_exploration()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'external_changes',
      'question', 'What external changes may influence our business in the coming years?',
      'example', '🦉 Aipify suggests exploring regulatory shifts and customer behavior patterns — reflection for leadership discussion, not a forecast.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'industry_assumptions',
      'question', 'Which industry assumptions may no longer hold in five years?',
      'example', '🌹 Worth asking which capabilities your organization treats as permanent — thoughtful review strengthens adaptability.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'capabilities_today',
      'question', 'What capabilities could we strengthen today to prepare for uncertainty?',
      'example', '🔔 Small, consistent preparedness actions — scenario reviews, cross-team knowledge sharing — build confidence over time.'
    )
  );
$$;

create or replace function public._frbp_emerging_themes()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'technological_evolution', 'label', 'Technological evolution', 'description', 'AI, interfaces, automation, and infrastructure shifts — observatory metadata only'),
    jsonb_build_object('key', 'regulatory_developments', 'label', 'Regulatory developments', 'description', 'Compliance and governance landscapes that may affect operations'),
    jsonb_build_object('key', 'workforce_expectations', 'label', 'Workforce expectations', 'description', 'How teams expect to work, learn, and collaborate in evolving environments'),
    jsonb_build_object('key', 'customer_behavior', 'label', 'Customer behavior', 'description', 'Changing expectations for service, channels, and digital experience'),
    jsonb_build_object('key', 'market_disruptions', 'label', 'Market disruptions', 'description', 'Competitive and ecosystem shifts worth leadership awareness'),
    jsonb_build_object('key', 'societal_shifts', 'label', 'Societal shifts', 'description', 'Broader cultural and economic patterns that influence business context')
  );
$$;

create or replace function public._frbp_scenario_preparedness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Scenario preparedness supports thoughtful response — not prediction. Explore possibilities alongside probabilities.',
    'scenarios', jsonb_build_array(
      jsonb_build_object('key', 'best_case', 'label', 'Best case', 'description', 'Opportunities that may emerge — how the organization could respond and invest'),
      jsonb_build_object('key', 'expected_case', 'label', 'Expected case', 'description', 'Likely developments based on current signals — steady preparedness actions'),
      jsonb_build_object('key', 'challenging_case', 'label', 'Challenging case', 'description', 'Difficult conditions — response plans, resilience cross-links, and human-approved actions')
    ),
    'reflection_note', 'Scenarios are frameworks for dialogue — integrate with Phase 97 scenario_plans and Organizational Resilience A.50 cross-link.'
  );
$$;

create or replace function public._frbp_organizational_resilience()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future readiness encourages organizational resilience — learning cultures, flexible structures, and strategic adaptability.',
    'encouragements', jsonb_build_array(
      jsonb_build_object('key', 'learning_cultures', 'label', 'Learning cultures', 'description', 'Teams that explore, experiment responsibly, and share lessons'),
      jsonb_build_object('key', 'flexible_structures', 'label', 'Flexible structures', 'description', 'Processes that adapt without losing governance alignment'),
      jsonb_build_object('key', 'cross_functional_understanding', 'label', 'Cross-functional understanding', 'description', 'Shared awareness across departments for coordinated response'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'description', 'Documented preparedness and scenario insights — metadata only'),
      jsonb_build_object('key', 'strategic_adaptability', 'label', 'Strategic adaptability', 'description', 'Leadership willing to revisit assumptions as conditions evolve')
    ),
    'resilience_route', '/app/organizational-resilience-engine',
    'boundary_note', 'Organizational Resilience A.50 handles crisis/disruption planning — cross-link only; Future Readiness focuses on long-term preparedness reflection.'
  );
$$;

create or replace function public._frbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'industry_trends',
      'topic', 'Industry trends',
      'example', '🦉 Several emerging technologies in your sector may deserve leadership discussion — Aipify highlights themes for reflection, not certainty.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'capabilities_today',
      'topic', 'Building capabilities today',
      'example', '🌹 Strengthening cross-team knowledge sharing and scenario review habits now may improve adaptability — small actions consistently over time.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'leadership_discussion',
      'topic', 'Topics deserving leadership discussion',
      'example', '🔔 Workforce expectations and regulatory developments are worth a thoughtful leadership conversation when you are ready.'
    )
  );
$$;

create or replace function public._frbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports future readiness — perspective, confidence, preparation without panic, and recognition of existing strengths.',
    'practices', jsonb_build_array(
      'Perspective — uncertainty is normal; preparedness reduces fear, not curiosity',
      'Confidence — acknowledge what the organization already does well',
      'Preparation without panic — steady actions over alarmist prediction',
      'Recognition of existing strengths — build on capabilities, not only gaps'
    ),
    'mantra', 'Preparedness is built through small actions taken consistently over time.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Future Technologies stores metadata observations, not personal wellbeing content.'
  );
$$;

create or replace function public._frbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights encourage strategic preparedness dialogue — summaries, capability observations, and strengths worth preserving.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'preparedness_summaries', 'label', 'Strategic preparedness summaries', 'description', 'Aggregate readiness assessments and scenario status — metadata only'),
      jsonb_build_object('key', 'capability_gaps', 'label', 'Capability gap observations', 'description', 'Areas where strengthening today may improve adaptability — not blame'),
      jsonb_build_object('key', 'strengths_preserve', 'label', 'Organizational strengths worth preserving', 'description', 'Existing capabilities and cultures that support resilience')
    ),
    'dialogue_note', 'Insights encourage broader strategic discussions — humans decide action; Aipify informs.'
  );
$$;

create or replace function public._frbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about what information contributes, that uncertainty exists, and the difference between possibilities and probabilities.',
    'users_should_see', jsonb_build_array(
      'Which observations, assessments, and scenario metadata contribute to readiness framing',
      'Uncertainty exists — reflection and preparedness, not guaranteed predictions',
      'Possibilities vs probabilities — scenarios explore both without false certainty',
      'Human approval for emerging initiatives and governance-compatible pilots'
    ),
    'operators_should_understand', jsonb_build_array(
      'Future readiness scores compose from technology observations and assessments — metadata only',
      'Distinct from Predictive Insights A.66 — no outcome forecasting in this blueprint',
      'Cross-links Strategic Intelligence A.31 for operational signals — do not duplicate',
      'Audit via future_tech_audit_log — no raw customer operational records'
    ),
    'audit_note', 'Future technology events and readiness refreshes are logged — metadata only.'
  );
$$;

create or replace function public._frbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates future readiness patterns internally — product evolution, ecosystem scaling, organizational resilience, and market preparedness.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product evolution scenarios, ecosystem scaling preparedness, organizational resilience cross-links',
      'focus', jsonb_build_array(
        'Product evolution and emerging interface pilots with human approval',
        'Ecosystem scaling and partner readiness scenarios',
        'Organizational resilience cross-linked with A.50 — not duplicated',
        'Market preparedness reflections before strategic commitments'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce future readiness and controlled technology pilots',
      'focus', jsonb_build_array(
        'Technology observatory for commerce operational interfaces',
        'Scenario planning for customer-facing evolution — metadata only',
        'Readiness assessments before pilot widening',
        'Human-approved emerging initiative progression'
      )
    )
  );
$$;

create or replace function public._frbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Uncertainty with wisdom, not fear — preparedness creates confidence.',
    'We may not know exactly what lies ahead, but we are becoming increasingly ready.',
    'Reflection matters more than prediction — scenarios support thoughtful response.',
    'The future belongs to those who prepare thoughtfully.',
    'Small actions consistently over time build organizational adaptability.'
  );
$$;

create or replace function public._frbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Organizational Resilience (A.50)', 'route', '/app/organizational-resilience-engine', 'note', 'Crisis/disruption scenario planning — cross-link only'),
    jsonb_build_object('label', 'Continuity (Phase 80)', 'route', '/app/continuity', 'note', 'Business continuity — distinct from future exploration'),
    jsonb_build_object('label', 'Strategic Intelligence Foundation (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Operational trend signals — cross-link only'),
    jsonb_build_object('label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine', 'note', 'Predictions — blueprint emphasizes reflection NOT prediction'),
    jsonb_build_object('label', 'Strategy (Phase 81)', 'route', '/app/strategy', 'note', 'Legacy strategy surface — distinct from future readiness reflection'),
    jsonb_build_object('label', 'Simulation Decision Lab (Blueprint Phase 22)', 'route', '/app/simulations', 'note', 'Decision simulations — distinct from scenario preparedness framing'),
    jsonb_build_object('label', 'Resource Planning Engine (A.63)', 'route', '/app/resource-planning-engine', 'note', 'Repo phase number collision — ABOS blueprint 63 is Future Readiness'),
    jsonb_build_object('label', 'Innovation Lab (Phase 96/38)', 'route', '/app/innovation-lab', 'note', 'Controlled pilots — integrated with emerging initiatives'),
    jsonb_build_object('label', 'Governance', 'route', '/app/governance', 'note', 'Human approval and ethical evaluations for future initiatives'),
    jsonb_build_object('label', 'Academy', 'route', '/app/academy', 'note', 'Scenario planning and readiness education'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Perspective and preparation without panic — principle only'),
    jsonb_build_object('label', 'License & Trust Center', 'route', '/app/license', 'note', 'Subscription trust and ownership transparency')
  );
$$;

create or replace function public._frbp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_assessments int := 0;
  v_scenarios int := 0;
  v_active_scenarios int := 0;
begin
  select count(*) into v_assessments
  from public.future_readiness_assessments where tenant_id = p_tenant_id;

  select count(*),
         count(*) filter (where status in ('active', 'reviewed'))
  into v_scenarios, v_active_scenarios
  from public.future_scenario_plans where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'readiness_assessments_count', coalesce(v_assessments, 0),
    'scenario_plans_count', coalesce(v_scenarios, 0),
    'active_scenario_plans', coalesce(v_active_scenarios, 0),
    'future_exploration_documented', jsonb_array_length(public._frbp_future_exploration()),
    'emerging_themes_documented', jsonb_array_length(public._frbp_emerging_themes()),
    'privacy_note', 'Metadata only — reflection not prediction; counts from readiness assessments and scenario plans.'
  );
end; $$;

create or replace function public._frbp_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_assessments int := 0;
  v_scenarios int := 0;
begin
  v_engagement := public._frbp_engagement_summary(p_tenant_id);
  v_assessments := coalesce((v_engagement->>'readiness_assessments_count')::int, 0);
  v_scenarios := coalesce((v_engagement->>'scenario_plans_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'greater_preparedness',
      'label', 'Greater preparedness — readiness assessments and scenario plans active',
      'met', v_assessments >= 4 and v_scenarios >= 1,
      'note', case when v_assessments < 4 then 'Refresh future technologies dashboard to seed assessments.' else null end
    ),
    jsonb_build_object(
      'key', 'broader_strategic_discussions',
      'label', 'Broader strategic discussions — future exploration questions documented',
      'met', jsonb_array_length(public._frbp_future_exploration()) >= 3,
      'note', '🦉🌹🔔 reflection questions — not predictions.'
    ),
    jsonb_build_object(
      'key', 'increased_resilience',
      'label', 'Increased resilience — organizational resilience encouragements documented',
      'met', jsonb_array_length(public._frbp_organizational_resilience()->'encouragements') >= 5,
      'note', 'Cross-link Organizational Resilience A.50 — do not duplicate crisis planning.'
    ),
    jsonb_build_object(
      'key', 'decreased_anxiety',
      'label', 'Decreased anxiety about uncertainty — Self Love connection and preparation without panic',
      'met', (public._frbp_self_love_connection()->>'mantra') is not null,
      'note', 'Preparedness through small consistent actions.'
    ),
    jsonb_build_object(
      'key', 'stronger_adaptability',
      'label', 'Stronger adaptability — emerging themes and adaptive planning objectives',
      'met', jsonb_array_length(public._frbp_emerging_themes()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'scenario_preparedness',
      'label', 'Scenario preparedness — best, expected, and challenging case frameworks',
      'met', jsonb_array_length(public._frbp_scenario_preparedness()->'scenarios') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — industry trends, capabilities, leadership topics',
      'met', jsonb_array_length(public._frbp_companion_guidance()) >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — preparedness summaries, gaps, strengths',
      'met', jsonb_array_length(public._frbp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparency about uncertainty and possibilities vs probabilities',
      'met', jsonb_array_length(public._frbp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Resilience, Continuity, Strategic Intelligence, Predictive Insights, Strategy, Simulation Lab, Resource Planning',
      'met', jsonb_array_length(public._frbp_integration_links()) >= 10,
      'note', 'Extend Phase 97 — do not duplicate prediction or crisis planning logic.'
    ),
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Blueprint objectives — awareness, preparedness, exploration, resilience, planning, confidence',
      'met', jsonb_array_length(public._frbp_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group product evolution, ecosystem scaling, market preparedness',
      'met', (public._frbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 97 fields; append Phase 63
-- ---------------------------------------------------------------------------
create or replace function public.get_future_technologies_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.future_tech_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._ftei_require_tenant();
  v_settings := public._ftei_ensure_settings(v_tenant_id);
  perform public._ftei_seed_observations(v_tenant_id);
  perform public._ftei_seed_initiatives(v_tenant_id);
  perform public._ftei_seed_scenarios(v_tenant_id);
  perform public._ftei_seed_pilots(v_tenant_id);
  perform public._ftei_seed_recommendations(v_tenant_id);
  v_metrics := public._ftei_refresh_assessments(v_tenant_id);
  perform public._ftei_trust_explanation(v_tenant_id, (v_metrics->>'future_readiness_score')::numeric);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Prepared for tomorrow. Valuable today.',
    'safety_note', 'Aipify augments human capabilities — future initiatives require human approval and governance alignment.',
    'observatory_enabled', v_settings.observatory_enabled,
    'scenario_planning_enabled', v_settings.scenario_planning_enabled,
    'voice_readiness_tracking', v_settings.voice_readiness_tracking,
    'multimodal_exploration', v_settings.multimodal_exploration,
    'human_approval_required', v_settings.human_approval_required,
    'interoperability_focus', v_settings.interoperability_focus,
    'future_readiness_score', v_metrics->'future_readiness_score',
    'avg_technology_relevance', v_metrics->'avg_technology_relevance',
    'active_initiatives', v_metrics->'active_initiatives',
    'open_pilot_opportunities', v_metrics->'open_pilot_opportunities',
    'observation_areas', jsonb_build_array(
      'Artificial Intelligence advancements', 'Human-computer interaction models',
      'Automation technologies', 'Digital workplace evolution',
      'Collaboration technologies', 'Infrastructure innovations'
    ),
    'emerging_interfaces', jsonb_build_array(
      jsonb_build_object('type', 'conversational', 'label', public._ftei_interface_label('conversational')),
      jsonb_build_object('type', 'voice', 'label', public._ftei_interface_label('voice')),
      jsonb_build_object('type', 'multimodal', 'label', public._ftei_interface_label('multimodal')),
      jsonb_build_object('type', 'wearable', 'label', public._ftei_interface_label('wearable')),
      jsonb_build_object('type', 'ambient', 'label', public._ftei_interface_label('ambient')),
      jsonb_build_object('type', 'augmented_reality', 'label', public._ftei_interface_label('augmented_reality')),
      jsonb_build_object('type', 'virtual_collaboration', 'label', public._ftei_interface_label('virtual_collaboration'))
    ),
    'technology_observations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'observation_key', o.observation_key, 'title', o.title,
        'description', o.description, 'observation_area', o.observation_area,
        'maturity_level', o.maturity_level, 'relevance_score', o.relevance_score, 'status', o.status
      ) order by o.relevance_score desc)
      from public.future_technology_observations o where o.tenant_id = v_tenant_id and o.status = 'active'
    ), '[]'::jsonb),
    'trend_reports', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'summary', r.summary,
        'trend_category', r.trend_category, 'impact_level', r.impact_level
      ) order by r.published_at desc)
      from public.future_trend_reports r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'emerging_initiatives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'initiative_key', i.initiative_key, 'title', i.title,
        'description', i.description, 'interface_type', i.interface_type,
        'interface_label', public._ftei_interface_label(i.interface_type),
        'status', i.status, 'business_value_score', i.business_value_score,
        'governance_compatible', i.governance_compatible
      ) order by i.business_value_score desc)
      from public.future_emerging_initiatives i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'pilot_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'title', p.title, 'description', p.description,
        'status', p.status, 'participant_type', p.participant_type
      ))
      from public.future_pilot_opportunities p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'readiness_assessments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'assessment_type', a.assessment_type, 'title', a.title,
        'summary', a.summary, 'readiness_score', a.readiness_score
      ))
      from public.future_readiness_assessments a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'scenario_plans', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'title', s.title, 'description', s.description,
        'time_horizon', s.time_horizon, 'status', s.status
      ))
      from public.future_scenario_plans s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'recommendation_type', r.recommendation_type, 'priority', r.priority, 'status', r.status
      ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.future_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'open' limit 10
    ), '[]'::jsonb),
    'responsible_adoption_principles', jsonb_build_array(
      'Business value', 'Customer benefit', 'Ethical considerations',
      'Security implications', 'Governance compatibility', 'Operational feasibility'
    ),
    'automation_evolution_principles', jsonb_build_array(
      'Human oversight', 'Explainability', 'Reversibility',
      'Governance alignment', 'Risk awareness'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.future_tech_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'innovation_lab', 'Controlled future technology pilots',
      'governance', 'Human approval and ethical evaluations',
      'enterprise_deployment', 'Future-ready architecture',
      'academy', 'Scenario planning and readiness education',
      'strategic_intelligence', 'Trend analysis and opportunity assessments'
    ),
    'implementation_blueprint_phase63', jsonb_build_object(
      'phase', 'Phase 63 — Future Readiness Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE63_FUTURE_READINESS.md',
      'engine_phase', 'Phase 97 Future Technologies & Emerging Interfaces',
      'route', '/app/future-tech',
      'mapping_note', 'ABOS Blueprint Phase 63 extends Phase 97 with future readiness reflection — long-term awareness, scenario preparedness, emerging themes, and organizational confidence. Reflection not prediction.'
    ),
    'future_readiness_note', 'Future Readiness Engine (ABOS Phase 63) — extends Phase 97 Technology Observatory with preparedness reflection, scenario frameworks, companion guidance, and live success criteria.',
    'blueprint_distinction_note', public._frbp_distinction_note(),
    'blueprint_mission', public._frbp_mission(),
    'blueprint_philosophy', public._frbp_philosophy(),
    'blueprint_abos_principle', public._frbp_abos_principle(),
    'vision', 'We may not know exactly what lies ahead, but we are becoming increasingly ready.',
    'blueprint_objectives', public._frbp_objectives(),
    'future_exploration', public._frbp_future_exploration(),
    'emerging_themes', public._frbp_emerging_themes(),
    'scenario_preparedness', public._frbp_scenario_preparedness(),
    'organizational_resilience', public._frbp_organizational_resilience(),
    'companion_guidance', public._frbp_companion_guidance(),
    'self_love_connection', public._frbp_self_love_connection(),
    'leadership_insights', public._frbp_leadership_insights(),
    'trust_connection', public._frbp_trust_connection(),
    'dogfooding', public._frbp_dogfooding(),
    'blueprint_integration_links', public._frbp_integration_links(),
    'engagement_summary', public._frbp_engagement_summary(v_tenant_id),
    'success_criteria', public._frbp_success_criteria(v_tenant_id),
    'vision_phrases', public._frbp_vision_phrases(),
    'privacy_note', 'Future readiness indicators are tenant-scoped, explainable, and auditable. Metadata only — reflection not prediction.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 97 fields; append Phase 63 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_future_technologies_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._ftei_ensure_settings(v_tenant_id);
  perform public._ftei_seed_observations(v_tenant_id);
  v_metrics := public._ftei_refresh_assessments(v_tenant_id);
  v_engagement := public._frbp_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'future_readiness_score', v_metrics->'future_readiness_score',
    'active_initiatives', v_metrics->'active_initiatives',
    'philosophy', 'Prepared for tomorrow. Valuable today.',
    'human_oversight_required', true,
    'implementation_blueprint_phase63', jsonb_build_object(
      'phase', 'Phase 63 — Future Readiness Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE63_FUTURE_READINESS.md',
      'engine_phase', 'Phase 97 Future Technologies & Emerging Interfaces',
      'route', '/app/future-tech'
    ),
    'mission', public._frbp_mission(),
    'abos_principle', public._frbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Future Readiness Engine (ABOS Phase 63) — extends Phase 97 with preparedness reflection, scenario frameworks, and live success criteria.',
    'readiness_note', 'Reflection not prediction — humans decide; Aipify informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._frbp_distinction_note() to authenticated;
grant execute on function public._frbp_mission() to authenticated;
grant execute on function public._frbp_philosophy() to authenticated;
grant execute on function public._frbp_abos_principle() to authenticated;
grant execute on function public._frbp_objectives() to authenticated;
grant execute on function public._frbp_future_exploration() to authenticated;
grant execute on function public._frbp_emerging_themes() to authenticated;
grant execute on function public._frbp_scenario_preparedness() to authenticated;
grant execute on function public._frbp_organizational_resilience() to authenticated;
grant execute on function public._frbp_companion_guidance() to authenticated;
grant execute on function public._frbp_self_love_connection() to authenticated;
grant execute on function public._frbp_leadership_insights() to authenticated;
grant execute on function public._frbp_trust_connection() to authenticated;
grant execute on function public._frbp_dogfooding() to authenticated;
grant execute on function public._frbp_vision_phrases() to authenticated;
grant execute on function public._frbp_integration_links() to authenticated;
grant execute on function public._frbp_engagement_summary(uuid) to authenticated;
grant execute on function public._frbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'future-readiness-blueprint-phase63', 'Future Readiness Engine (ABOS Phase 63)',
  'Future Readiness Engine — extends Phase 97 Future Technologies with long-term awareness, scenario preparedness, emerging themes, organizational resilience encouragement, and reflection-not-prediction framing.',
  'authenticated', 106
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'future-readiness-blueprint-phase63' and tenant_id is null
);
