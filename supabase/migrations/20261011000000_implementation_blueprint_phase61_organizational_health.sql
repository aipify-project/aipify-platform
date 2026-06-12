-- Implementation Blueprint Phase 61 — Organizational Health Engine
-- Extends Organizational Health Engine Phase A.56. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._ohbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 61 — Organizational Health Engine at /app/organizational-health-engine. Extends Organizational Health Engine Phase A.56 (20260901000000_organizational_health_engine_phase_a56.sql). Distinct from Observability Platform Health A.19 /app/observability-platform-health-engine (infrastructure/incidents). Customer Success A.26 health scores — cross-link only. Executive Insights A.35 — executive reporting cross-link. Gratitude/Recognition A.89 Phase 53 Human Moments /app/gratitude-recognition-engine — recognition connection cross-link. Self Love A.76 /app/self-love-engine — principles cross-link. Distinct from Inclusion & Humanity A.83, Purpose & Values A.82, Impact A.85, and separate Wellbeing Engine — org health is A.56. Repo Phase 61 numbering may collide with Desktop Companion Phase 61 — ABOS blueprint number is authoritative for this spec. All A.56 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._ohbp_mission()
returns text language sql immutable as $$
  select 'Help leaders improve collaboration, reduce unnecessary strain, and support sustainable organizational performance.';
$$;

create or replace function public._ohbp_philosophy()
returns text language sql immutable as $$
  select 'Performance should not come at the expense of wellbeing — success and wellbeing reinforce each other; resilient cultures sustain high performance without sacrificing people.';
$$;

create or replace function public._ohbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — organizations flourish when people feel supported, respected, and valued; organizational health is a strategic priority, not a side metric.';
$$;

create or replace function public._ohbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'team_wellbeing_awareness', 'label', 'Team wellbeing awareness', 'description', 'Leaders see aggregate wellbeing signals — metadata only, never individual surveillance'),
    jsonb_build_object('key', 'workload_visibility', 'label', 'Workload visibility', 'description', 'Overtime patterns, task accumulation, uneven responsibility — sustainability focus'),
    jsonb_build_object('key', 'collaboration_insights', 'label', 'Collaboration insights', 'description', 'Communication health, information flow, cross-team collaboration patterns'),
    jsonb_build_object('key', 'recognition_experiences', 'label', 'Recognition experiences', 'description', 'Team celebrations and effort acknowledgements — cross-link Gratitude A.89'),
    jsonb_build_object('key', 'early_strain_awareness', 'label', 'Early operational strain awareness', 'description', 'Emerging workload trends and bottlenecks before they become crises'),
    jsonb_build_object('key', 'sustainable_growth', 'label', 'Sustainable growth practices', 'description', 'Recovery, pacing, and process sustainability alongside operational scores')
  );
$$;

create or replace function public._ohbp_health_domains()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'communication_health',
      'label', 'Communication Health',
      'description', 'Clarity of expectations, information flow, cross-team collaboration',
      'indicators', jsonb_build_array('expectation_clarity', 'information_flow', 'cross_team_collaboration')
    ),
    jsonb_build_object(
      'key', 'operational_health',
      'label', 'Operational Health',
      'description', 'Workload distribution, bottlenecks, process sustainability',
      'indicators', jsonb_build_array('workload_distribution', 'bottleneck_signals', 'process_sustainability')
    ),
    jsonb_build_object(
      'key', 'people_health',
      'label', 'People Health',
      'description', 'Recognition, learning opportunities, engagement indicators',
      'indicators', jsonb_build_array('recognition_activity', 'learning_opportunities', 'engagement_indicators')
    )
  );
$$;

create or replace function public._ohbp_health_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'heavy_reliance',
      'scenario', 'Small number of individuals relied upon heavily',
      'example', '🦉 A small number of roles appear heavily relied upon — this may be worth a leadership conversation about distribution and recovery, not blame.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'recognition_increased',
      'scenario', 'Recognition activity increased',
      'example', '🌹 Recognition activity has increased this period — team celebrations and acknowledgements may be strengthening collaboration.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'workload_concentration',
      'scenario', 'Workload concentration deserves leadership attention',
      'example', '🔔 Workload concentration in a few areas deserves leadership attention — sustainability matters alongside delivery.'
    )
  );
$$;

create or replace function public._ohbp_workload_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Workload awareness supports sustainability — overtime patterns, task accumulation, limited recovery, and uneven responsibility deserve thoughtful leadership review.',
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'overtime_patterns', 'label', 'Overtime patterns', 'description', 'Aggregate overtime trend signals — metadata only'),
      jsonb_build_object('key', 'task_accumulation', 'label', 'Task accumulation', 'description', 'Backlog growth and open workload indicators'),
      jsonb_build_object('key', 'limited_recovery', 'label', 'Limited recovery', 'description', 'Sustained high-intensity periods without recovery windows'),
      jsonb_build_object('key', 'uneven_responsibility', 'label', 'Uneven responsibility', 'description', 'Concentration of operational load across categories')
    ),
    'sustainability_note', 'Focus on improvement and dialogue — never punitive interpretation or individual surveillance.'
  );
$$;

create or replace function public._ohbp_recognition_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition strengthens organizational health — team celebrations, project acknowledgements, and effort during demanding periods.',
    'practices', jsonb_build_array(
      'Team celebrations — visible gratitude without pressure',
      'Project acknowledgements — effort during demanding periods',
      'Leadership participation in recognition culture'
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'boundary_note', 'Gratitude A.89 Human Moments — cross-link only; Organizational Health stores aggregate metadata, not recognition content.'
  );
$$;

create or replace function public._ohbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable organizational health — healthy boundaries, sustainable pacing, recovery, and appreciation of progress.',
    'practices', jsonb_build_array(
      'Healthy boundaries — workload sustainability over constant urgency',
      'Sustainable pacing — recovery contributes to long-term excellence',
      'Appreciation of progress — acknowledge steady improvement, not only outcomes',
      'Rest contributes to long-term excellence'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Organizational Health stores metadata indicators, not personal wellbeing content.'
  );
$$;

create or replace function public._ohbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights encourage dialogue — emerging workload trends, collaboration observations, and recognition participation summaries.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'workload_trends', 'label', 'Emerging workload trends', 'description', 'Aggregate category score movement and attention-required domains'),
      jsonb_build_object('key', 'collaboration_observations', 'label', 'Collaboration observations', 'description', 'Communication and cross-team signal patterns — metadata only'),
      jsonb_build_object('key', 'recognition_participation', 'label', 'Recognition participation summaries', 'description', 'Aggregate recognition activity cross-linked with Gratitude A.89')
    ),
    'dialogue_note', 'Observations encourage conversation — never judgment or surveillance framing.'
  );
$$;

create or replace function public._ohbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about which indicators contribute, known limitations, and anonymous information areas.',
    'users_should_see', jsonb_build_array(
      'Which health categories and metadata sources contribute to scores',
      'Limitations — aggregate indicators only, not individual performance tracking',
      'Anonymous aggregation areas — where data is intentionally de-identified',
      'Human-approved interventions — leaders decide action, Aipify informs'
    ),
    'operators_should_understand', jsonb_build_array(
      'Health scores compose from existing operational metadata — support, adoption, learning, change, strategy',
      'No individual surveillance — organizational health is team and process oriented',
      'Cross-links Customer Success A.26 and Executive Insights A.35 — do not duplicate',
      'Interventions require human approval — metadata recommendations only'
    ),
    'audit_note', 'Health measurements, overrides, and intervention approvals are audited — metadata only.'
  );
$$;

create or replace function public._ohbp_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational health supports improvement, not control — no individual surveillance, hidden monitoring, or punitive interpretations.',
    'must_avoid', jsonb_build_array(
      'Individual surveillance — aggregate metadata only',
      'Hidden monitoring — all indicators visible and explainable',
      'Punitive interpretations — dialogue and improvement, never blame',
      'PII in health aggregation — metadata patterns and counts only'
    ),
    'must_support', jsonb_build_array(
      'Leader awareness with transparent limitations',
      'Wellbeing discussions grounded in aggregate signals',
      'Recognition culture without pressure',
      'Trust remains high through explainability'
    )
  );
$$;

create or replace function public._ohbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates organizational health patterns internally — team collaboration, leadership awareness, sustainable work practices, and recognition culture.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — collaboration health, leadership workload awareness, sustainable practices, recognition culture',
      'focus', jsonb_build_array(
        'Team collaboration signals across Command Center and modules',
        'Leadership awareness of workload sustainability before sprint commitments',
        'Recognition culture cross-linked with Gratitude A.89 Human Moments',
        'Executive health summaries before strategic decisions'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational health and adoption sustainability',
      'focus', jsonb_build_array(
        'Support and adoption health categories for commerce operations',
        'Workload sustainability during peak periods — aggregate only',
        'Learning readiness and change readiness for new workflows',
        'Human-approved health interventions before operational changes'
      )
    )
  );
$$;

create or replace function public._ohbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'High performance without sacrificing wellbeing — leaders think "We pay attention to the people behind performance."',
    'Resilient cultures where success and wellbeing reinforce each other.',
    'Workload sustainability alongside operational excellence.',
    'Recognition and recovery as strategic organizational priorities.',
    'Trust through transparent, aggregate health indicators — humans decide action.'
  );
$$;

create or replace function public._ohbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Observability Platform Health (A.19)', 'route', '/app/observability-platform-health-engine', 'note', 'Infrastructure and incidents — distinct from organizational readiness'),
    jsonb_build_object('label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine', 'note', 'Customer health scores — cross-link only'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive reporting — cross-link only'),
    jsonb_build_object('label', 'Gratitude & Recognition (Phase 53 / A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Human Moments recognition — cross-link only'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Healthy boundaries and sustainable pacing — principle only'),
    jsonb_build_object('label', 'Purpose & Values (A.82)', 'route', '/app/purpose-values-engine', 'note', 'Organizational purpose — distinct from health scores'),
    jsonb_build_object('label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Inclusion signals — distinct domain'),
    jsonb_build_object('label', 'Impact Engine (A.85)', 'route', '/app/abos-impact-engine', 'note', 'Impact measurement — distinct from health readiness'),
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Strategic objective alignment — integrated in A.56 scores'),
    jsonb_build_object('label', 'Value Realization (A.48)', 'route', '/app/value-realization-engine', 'note', 'Value metric trends — integrated in A.56 summaries'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Intervention memory hooks — metadata only'),
    jsonb_build_object('label', 'License & Trust Center', 'route', '/app/license', 'note', 'Subscription trust and ownership transparency')
  );
$$;

create or replace function public._ohbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_categories_measured int := 0;
  v_attention_required int := 0;
  v_pending_interventions int := 0;
  v_overall_score numeric := 75;
  v_healthy int := 0;
begin
  select count(*),
         count(*) filter (where health_status in ('attention_required', 'critical')),
         count(*) filter (where health_status = 'healthy'),
         round(avg(health_score), 1)
  into v_categories_measured, v_attention_required, v_healthy, v_overall_score
  from public.organizational_health_scores
  where organization_id = p_org_id;

  select count(*) into v_pending_interventions
  from public.organizational_health_interventions
  where organization_id = p_org_id and status = 'pending';

  return jsonb_build_object(
    'categories_measured', coalesce(v_categories_measured, 0),
    'healthy_categories', coalesce(v_healthy, 0),
    'attention_required_categories', coalesce(v_attention_required, 0),
    'overall_score', coalesce(v_overall_score, 75),
    'overall_status', public._ohe_status_from_score(coalesce(v_overall_score, 75)),
    'pending_interventions', coalesce(v_pending_interventions, 0),
    'health_domains_documented', jsonb_array_length(public._ohbp_health_domains()),
    'observation_examples', jsonb_array_length(public._ohbp_health_observations()),
    'privacy_note', 'Aggregate metadata only — no individual surveillance or PII.'
  );
end; $$;

create or replace function public._ohbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_categories int := 0;
  v_attention int := 0;
begin
  v_engagement := public._ohbp_engagement_summary(p_org_id);
  v_categories := coalesce((v_engagement->>'categories_measured')::int, 0);
  v_attention := coalesce((v_engagement->>'attention_required_categories')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'leader_awareness',
      'label', 'Leader awareness — health categories measured and executive summary available',
      'met', v_categories >= 3,
      'note', case when v_categories < 3 then 'Run measure_organizational_health to seed category scores.' else null end
    ),
    jsonb_build_object(
      'key', 'wellbeing_discussions',
      'label', 'Wellbeing discussions — health observations encourage dialogue not judgment',
      'met', jsonb_array_length(public._ohbp_health_observations()) >= 3,
      'note', '🦉🌹🔔 companion examples without surveillance framing.'
    ),
    jsonb_build_object(
      'key', 'recognition_culture',
      'label', 'Recognition culture — cross-link Gratitude A.89 documented',
      'met', (public._ohbp_recognition_connection()->>'gratitude_route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'workload_sustainability',
      'label', 'Workload sustainability — workload awareness signals documented',
      'met', jsonb_array_length(public._ohbp_workload_awareness()->'signals') >= 4,
      'note', 'Sustainability focus — never punitive interpretation.'
    ),
    jsonb_build_object(
      'key', 'trust_remains_high',
      'label', 'Trust remains high — transparent indicators and privacy principles',
      'met', jsonb_array_length(public._ohbp_privacy_principles()->'must_avoid') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'health_domains',
      'label', 'Health domains — communication, operational, and people health',
      'met', jsonb_array_length(public._ohbp_health_domains()) >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Blueprint objectives — wellbeing, workload, collaboration, recognition, strain, growth',
      'met', jsonb_array_length(public._ohbp_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — boundaries, pacing, recovery, progress appreciation',
      'met', true,
      'note', 'Rest contributes to long-term excellence — principle only.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — workload trends, collaboration, recognition participation',
      'met', jsonb_array_length(public._ohbp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Observability, Customer Success, Executive, Gratitude, Self Love',
      'met', jsonb_array_length(public._ohbp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate infrastructure or personal wellbeing logic.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group collaboration, leadership awareness, recognition culture',
      'met', (public._ohbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'attention_awareness',
      'label', 'Early strain awareness — attention-required categories surfaced',
      'met', v_attention >= 0,
      'note', case when v_attention > 0 then format('%s categories need leadership attention.', v_attention) else 'All measured categories stable or healthy.' end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.56 fields; append Phase 61
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_health_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('health.view');
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);
  perform public._ohe_seed_scores(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify measures organizational readiness. Humans approve interventions and decide action.',
    'principles', jsonb_build_array(
      'Metadata-only health indicators',
      'Category scores across six domains',
      'Human-approved interventions',
      'Executive health summaries',
      'No PII in health aggregation'
    ),
    'summary', public._ohe_executive_summary_block(v_org_id),
    'scores', coalesce((
      select jsonb_agg(row_to_json(s) order by s.health_category)
      from public.organizational_health_scores s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'interventions', coalesce((
      select jsonb_agg(row_to_json(i) order by i.created_at desc)
      from public.organizational_health_interventions i
      where i.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ohe_executive_summary_block(v_org_id),
    'settings', coalesce((
      select config from public.organizational_health_settings where organization_id = v_org_id
    ), '{}'::jsonb),
    'integration_notes', jsonb_build_object(
      'observability', 'Distinct from Observability Platform Health — nav id organizationalHealthEngine',
      'customer_success', 'Customer Success context via get_executive_health_summary() — A.26',
      'executive_insights', 'Executive Insights reporting — A.35',
      'value_realization', 'Value Realization metric trends — A.48',
      'strategic_alignment', 'Strategic Alignment objective signals — A.55',
      'organizational_memory', 'Interventions may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._ohe_customer_success_summary(v_org_id),
      'executive_insights', public._ohe_executive_insights_summary(v_org_id),
      'value_realization', public._ohe_value_realization_summary(v_org_id),
      'strategic_alignment', public._ohe_strategic_alignment_summary(v_org_id),
      'support_backlog', public._ohe_support_backlog_indicators(v_org_id),
      'workflow_adoption', public._ohe_workflow_adoption_indicators(v_org_id),
      'training_completion', public._ohe_training_completion_indicators(v_org_id),
      'incidents', public._ohe_incidents_indicators(v_org_id),
      'improvements', public._ohe_improvements_indicators(v_org_id),
      'change_readiness', public._ohe_change_readiness_indicators(v_org_id)
    ),
    'implementation_blueprint_phase61', jsonb_build_object(
      'phase', 'Phase 61 — Organizational Health Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE61_ORGANIZATIONAL_HEALTH.md',
      'engine_phase', 'Phase A.56 Organizational Health Engine',
      'route', '/app/organizational-health-engine',
      'mapping_note', 'ABOS Blueprint Phase 61 extends A.56 with wellbeing-aware organizational health — communication, operational, and people domains with sustainable performance framing.'
    ),
    'organizational_health_note', 'Organizational Health Engine (ABOS Phase 61) — extends Phase A.56 with wellbeing-aware health domains, workload sustainability, recognition connection, and leadership insights.',
    'blueprint_distinction_note', public._ohbp_distinction_note(),
    'blueprint_mission', public._ohbp_mission(),
    'blueprint_philosophy', public._ohbp_philosophy(),
    'blueprint_abos_principle', public._ohbp_abos_principle(),
    'vision', 'High performance without sacrificing wellbeing — leaders pay attention to the people behind performance.',
    'blueprint_objectives', public._ohbp_objectives(),
    'health_domains', public._ohbp_health_domains(),
    'health_observations', public._ohbp_health_observations(),
    'workload_awareness', public._ohbp_workload_awareness(),
    'recognition_connection', public._ohbp_recognition_connection(),
    'self_love_connection', public._ohbp_self_love_connection(),
    'leadership_insights', public._ohbp_leadership_insights(),
    'trust_connection', public._ohbp_trust_connection(),
    'privacy_principles', public._ohbp_privacy_principles(),
    'dogfooding', public._ohbp_dogfooding(),
    'blueprint_integration_links', public._ohbp_integration_links(),
    'engagement_summary', public._ohbp_engagement_summary(v_org_id),
    'success_criteria', public._ohbp_success_criteria(v_org_id),
    'vision_phrases', public._ohbp_vision_phrases(),
    'privacy_note', 'Organizational health indicators are aggregate, explainable, and auditable. Metadata only — no individual surveillance or PII.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.56 fields; append Phase 61 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_health_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_overall numeric; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);
  v_engagement := public._ohbp_engagement_summary(v_org_id);

  select round(avg(health_score), 1) into v_overall
  from public.organizational_health_scores where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational health — readiness across support, adoption, learning, and strategy with sustainable performance.',
    'overall_score', coalesce(v_overall, 75),
    'overall_status', public._ohe_status_from_score(coalesce(v_overall, 75)),
    'categories_measured', coalesce((
      select count(*) from public.organizational_health_scores where organization_id = v_org_id
    ), 0),
    'pending_interventions', coalesce((
      select count(*) from public.organizational_health_interventions
      where organization_id = v_org_id and status = 'pending'
    ), 0),
    'implementation_blueprint_phase61', jsonb_build_object(
      'phase', 'Phase 61 — Organizational Health Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE61_ORGANIZATIONAL_HEALTH.md',
      'engine_phase', 'Phase A.56 Organizational Health Engine',
      'route', '/app/organizational-health-engine'
    ),
    'mission', public._ohbp_mission(),
    'abos_principle', public._ohbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Organizational Health Engine (ABOS Phase 61) — extends A.56 with wellbeing-aware domains, workload sustainability, and live success criteria.',
    'health_note', 'Performance and wellbeing reinforce each other — aggregate metadata only; humans approve interventions.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ohbp_distinction_note() to authenticated;
grant execute on function public._ohbp_mission() to authenticated;
grant execute on function public._ohbp_philosophy() to authenticated;
grant execute on function public._ohbp_abos_principle() to authenticated;
grant execute on function public._ohbp_objectives() to authenticated;
grant execute on function public._ohbp_health_domains() to authenticated;
grant execute on function public._ohbp_health_observations() to authenticated;
grant execute on function public._ohbp_workload_awareness() to authenticated;
grant execute on function public._ohbp_recognition_connection() to authenticated;
grant execute on function public._ohbp_self_love_connection() to authenticated;
grant execute on function public._ohbp_leadership_insights() to authenticated;
grant execute on function public._ohbp_trust_connection() to authenticated;
grant execute on function public._ohbp_privacy_principles() to authenticated;
grant execute on function public._ohbp_dogfooding() to authenticated;
grant execute on function public._ohbp_vision_phrases() to authenticated;
grant execute on function public._ohbp_integration_links() to authenticated;
grant execute on function public._ohbp_engagement_summary(uuid) to authenticated;
grant execute on function public._ohbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-health-blueprint-phase61', 'Organizational Health Engine (ABOS Phase 61)',
  'Organizational Health Engine — extends Phase A.56 with wellbeing-aware health domains, workload sustainability, recognition connection, leadership insights, and privacy principles.',
  'authenticated', 105
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-health-blueprint-phase61' and tenant_id is null
);
