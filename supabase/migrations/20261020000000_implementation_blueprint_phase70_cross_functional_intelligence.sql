-- Implementation Blueprint Phase 70 — Cross-Functional Intelligence Engine
-- Extends Operations Center Foundation Engine Phase A.32 (Phase 18 blueprint). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._cfibp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 70 — Cross-Functional Intelligence Engine at /app/operations-center-foundation-engine. Extends Operations Center Foundation Engine Phase A.32 (Phase 18 via _ocf_* helpers in 20260965000000_implementation_blueprint_phase18_operations_center.sql). Distinct from Personal Productivity Engine A.70 at /app/personal-productivity-engine (repo phase number collision with ABOS blueprint 70). Distinct from Cross-Tenant Intelligence A.71 at /app/cross-tenant-intelligence-engine (anonymized cross-tenant — NOT intra-org cross-functional). Distinct from Strategic Alignment Phase 68 cross-functional visibility on A.55 (alignment focus — cross-link only). Distinct from Operations Dashboard A.9, Command Center Phase 26, AOC Phase 79. Distinct from Industry Intelligence A.44. Engine helpers use _ocf_* — blueprint Phase 70 MUST use _cfibp_*. All Phase 18 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._cfibp_mission()
returns text language sql immutable as $$
  select 'Strengthen collaboration, reduce silos, and improve outcomes by making cross-functional relationships visible.';
$$;

create or replace function public._cfibp_philosophy()
returns text language sql immutable as $$
  select 'No department operates in isolation — interdependence creates stronger organizations. Awareness strengthens systems; surveillance does not.';
$$;

create or replace function public._cfibp_abos_principle()
returns text language sql immutable as $$
  select 'Organizations are living systems — understanding connections reveals improvement opportunities. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._cfibp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dependency_awareness', 'label', 'Dependency awareness', 'description', 'Surface how teams and modules depend on one another — metadata patterns only'),
    jsonb_build_object('key', 'collaboration_insights', 'label', 'Collaboration insights', 'description', 'Highlight where cross-team collaboration strengthens outcomes'),
    jsonb_build_object('key', 'information_flow_visibility', 'label', 'Information flow visibility', 'description', 'Show how insights travel across functions — delays and shared knowledge dependencies'),
    jsonb_build_object('key', 'cross_team_opportunities', 'label', 'Cross-team opportunities', 'description', 'Identify shared challenges and broader initiative representation'),
    jsonb_build_object('key', 'bottleneck_recognition', 'label', 'Bottleneck recognition', 'description', 'Recognize handoff friction and knowledge concentration — improvement not blame'),
    jsonb_build_object('key', 'systems_thinking', 'label', 'Systems thinking', 'description', 'Encourage organizational resilience through connection awareness')
  );
$$;

create or replace function public._cfibp_organizational_connections()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational connections — understand how functions relate across the operating chain.',
    'example_chain', jsonb_build_array(
      jsonb_build_object('key', 'sales', 'label', 'Sales', 'route', '/app/sales-expert-engine', 'feeds', 'customer_success'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer Success', 'route', '/app/customer-success-engine', 'feeds', 'support'),
      jsonb_build_object('key', 'support', 'label', 'Support', 'route', '/app/support-ai-engine', 'feeds', 'knowledge_center'),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center-engine', 'feeds', 'product_development'),
      jsonb_build_object('key', 'product_development', 'label', 'Product Development', 'route', '/app/continuous-improvement-engine', 'feeds', 'sales')
    ),
    'chain_summary', 'Sales → Customer Success → Support → Knowledge Center → Product Development — insights and feedback loop across functions.',
    'metadata_note', 'Connection chain is illustrative — live counts come from module overviews and operations_events, metadata only.'
  );
$$;

create or replace function public._cfibp_cross_functional_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cross-functional observations — awareness not surveillance. Metadata patterns across modules.',
    'observations', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'support_informs_product', 'observation', 'Support patterns may inform product priorities', 'description', 'Recurring support themes surface product improvement opportunities — humans prioritize.'),
      jsonb_build_object('emoji', '🌹', 'key', 'marketing_sales_alignment', 'observation', 'Marketing and sales alignment strengthens customer experience', 'description', 'Shared pipeline and campaign signals — cross-link only, no duplicate CRM storage.'),
      jsonb_build_object('emoji', '🔔', 'key', 'recurring_dependencies', 'observation', 'Recurring team dependencies deserve coordination review', 'description', 'Handoffs between functions — improvement opportunity, not individual scoring.')
    ),
    'awareness_note', 'Observations encourage dialogue — never punitive interpretation or hidden monitoring.'
  );
$$;

create or replace function public._cfibp_information_flow_visibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Information flow visibility — how insights travel, where delays occur, and shared knowledge dependencies.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'insight_travel', 'label', 'How insights travel', 'description', 'Module overview blocks and operations_events show cross-module signal paths'),
      jsonb_build_object('key', 'delays', 'label', 'Delays', 'description', 'Overdue tasks, escalated cases, and open knowledge gaps indicate handoff delays'),
      jsonb_build_object('key', 'shared_knowledge', 'label', 'Shared knowledge dependencies', 'description', 'KC articles, support gaps, and recognition moments — metadata counts only'),
      jsonb_build_object('key', 'communication_opportunities', 'label', 'Communication opportunities', 'description', 'Moments where proactive cross-team communication could reduce friction')
    ),
    'metadata_note', 'Flow visibility uses aggregate counts — no email, chat, order content, or PII.'
  );
$$;

create or replace function public._cfibp_bottleneck_identification()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Bottleneck identification — improvement not blame. Surface systemic friction, not individual performance.',
    'patterns', jsonb_build_array(
      jsonb_build_object('key', 'individual_reliance', 'label', 'Reliance on individuals', 'description', 'Concentrated ownership signals — suggest delegation or documentation, never score people'),
      jsonb_build_object('key', 'inter_department_delays', 'label', 'Inter-department delays', 'description', 'Escalations, overdue tasks, and quality findings across module boundaries'),
      jsonb_build_object('key', 'handoff_friction', 'label', 'Handoff friction', 'description', 'Open operations_events and pending approvals at module handoffs'),
      jsonb_build_object('key', 'knowledge_concentration', 'label', 'Knowledge concentration', 'description', 'Open KC gaps and draft articles — shared knowledge opportunity')
    ),
    'improvement_note', 'Bottlenecks are system signals — humans decide remediation; Aipify prepares context only.'
  );
$$;

create or replace function public._cfibp_collaboration_opportunities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collaboration opportunities — similar challenges solved independently, shared learning, broader initiative representation.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'similar_challenges', 'prompt', 'Several teams face similar operational patterns — would a shared review help?', 'consideration', 'Independent solutions may benefit from cross-functional learning.'),
      jsonb_build_object('emoji', '🌹', 'key', 'shared_learning', 'prompt', 'Knowledge Center updates could strengthen multiple functions — shall I summarize recent contributions?', 'consideration', 'Shared learning reduces siloed reinvention.'),
      jsonb_build_object('emoji', '🔔', 'key', 'broader_initiative', 'prompt', 'This initiative spans multiple modules — would cross-functional context help coordination?', 'consideration', 'Broader representation strengthens outcomes — humans decide participation.')
    )
  );
$$;

create or replace function public._cfibp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — cross-functional health summaries, dependency observations, and positive collaboration examples.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'cross_functional_health', 'label', 'Cross-functional health summaries', 'description', 'Module overview aggregates and operations event trends — metadata only'),
      jsonb_build_object('key', 'dependency_observations', 'label', 'Dependency observations', 'description', 'Organizational connection chain and recurring handoff patterns'),
      jsonb_build_object('key', 'positive_collaboration', 'label', 'Positive collaboration examples', 'description', 'Recognition moments, bell milestones, and resolved cross-module events')
    ),
    'dialogue_note', 'Insights encourage constructive conversation — never punitive dashboards.'
  );
$$;

create or replace function public._cfibp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — empathy across departments, appreciation of diverse contributions, constructive communication, shared ownership.',
    'practices', jsonb_build_array(
      'Empathy across departments — every team faces different pressures',
      'Appreciation of diverse contributions — functions strengthen the whole',
      'Constructive communication — awareness without judgment',
      'Shared ownership — organizational success is collective'
    ),
    'journey_phrase', 'Every team contributes to organizational success in different ways.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports empathy and sustainable collaboration — principle only; Cross-Functional Intelligence stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._cfibp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about how observations are generated, limitations, and optional insights.',
    'users_should_see', jsonb_build_array(
      'How cross-functional observations derive from module overviews and operations_events — metadata only',
      'Privacy principles — no hidden monitoring, individual scoring, or punitive interpretation',
      'Optional companion insights — leaders control enablement',
      'Human control — humans decide remediation; Aipify prepares context'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Cross-Tenant Intelligence A.71 — intra-org only, never cross-tenant customer data',
      'Distinct from Strategic Alignment Phase 68 — alignment objectives vs operational connection visibility',
      'Distinct from Personal Productivity A.70 — organizational systems thinking, not individual productivity',
      'Bottleneck signals are systemic — never individual performance surveillance'
    ),
    'audit_note', 'Operations event lifecycle audited via _ocf_log — metadata only.'
  );
$$;

create or replace function public._cfibp_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — strengthen systems, not judge people.',
    'rules', jsonb_build_array(
      'NO hidden monitoring — all signals visible and explainable on the dashboard',
      'NO individual performance scoring — systemic patterns only',
      'NO punitive interpretations — improvement opportunity framing',
      'Metadata only — no email, chat, orders, or PII in cross-functional summaries'
    ),
    'strengthen_systems_note', 'Cross-functional intelligence reveals connection opportunities — humans retain operational authority.'
  );
$$;

create or replace function public._cfibp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates cross-functional intelligence internally — product development, Sales Expert ecosystem, support experiences, strategic initiatives.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product development, Sales Expert ecosystem, support experiences, strategic initiatives',
      'focus', jsonb_build_array(
        'Product development feedback loops from support and KC patterns',
        'Sales Expert ecosystem coordination across functions',
        'Support experience insights informing product priorities',
        'Strategic initiative handoffs across platform and customer teams'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce cross-functional coordination',
      'focus', jsonb_build_array(
        'Support-to-operations handoff visibility',
        'Knowledge gaps spanning support and commerce',
        'Launch coordination across tasks and recognition',
        'Cross-module bottleneck awareness for leadership'
      )
    )
  );
$$;

create or replace function public._cfibp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We are operating more cohesively than before.',
    'Greater understanding of how people, teams, and processes interact.',
    'Every team contributes to organizational success in different ways.',
    'Understanding connections reveals improvement opportunities.',
    'Awareness strengthens collaboration — surveillance does not.'
  );
$$;

create or replace function public._cfibp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine', 'note', 'Role-aware widgets — distinct from cross-functional hub'),
    jsonb_build_object('label', 'Command Center (Phase 26)', 'route', '/app/command-center', 'note', 'Presence and notifications — not cross-functional intelligence'),
    jsonb_build_object('label', 'AOC Watchers (Phase 79)', 'route', '/app/operations', 'note', 'Autonomous watchers — distinct surface'),
    jsonb_build_object('label', 'Strategic Alignment (A.55 / Phase 68)', 'route', '/app/strategic-alignment-engine', 'note', 'Alignment objectives — cross-functional visibility cross-link only'),
    jsonb_build_object('label', 'Personal Productivity (A.70)', 'route', '/app/personal-productivity-engine', 'note', 'Individual productivity — NOT this blueprint (phase number collision)'),
    jsonb_build_object('label', 'Cross-Tenant Intelligence (A.71)', 'route', '/app/cross-tenant-intelligence-engine', 'note', 'Anonymized cross-tenant — NOT intra-org cross-functional'),
    jsonb_build_object('label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Industry patterns — distinct from org connection visibility'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine'),
    jsonb_build_object('label', 'Sales Expert', 'route', '/app/sales-expert-engine'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Empathy across departments — principle only')
  );
$$;

create or replace function public._cfibp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_modules jsonb;
  v_open_events int := 0;
  v_urgent_events int := 0;
  v_module_keys int := 0;
  v_support_open int := 0;
  v_kc_gaps int := 0;
  v_tasks_overdue int := 0;
begin
  perform public._ocf_aggregate_events(p_org_id);
  v_modules := public._ocf_module_overviews(p_org_id);

  select count(*) into v_open_events
  from public.operations_events
  where organization_id = p_org_id and status in ('new', 'acknowledged', 'in_progress');

  select count(*) into v_urgent_events
  from public.operations_events
  where organization_id = p_org_id
    and priority in ('high', 'critical')
    and status not in ('completed', 'dismissed');

  select count(*) into v_module_keys from jsonb_object_keys(v_modules) k;

  v_support_open := coalesce((v_modules->'support_overview'->>'open_cases')::int, 0);
  v_kc_gaps := coalesce((v_modules->'knowledge_overview'->>'open_gaps')::int, 0);
  v_tasks_overdue := coalesce((v_modules->'task_overview'->>'overdue')::int, 0);

  return jsonb_build_object(
    'module_overview_blocks', coalesce(v_module_keys, 0),
    'open_operations_events', coalesce(v_open_events, 0),
    'urgent_operations_events', coalesce(v_urgent_events, 0),
    'support_open_cases', v_support_open,
    'knowledge_open_gaps', v_kc_gaps,
    'tasks_overdue', v_tasks_overdue,
    'connection_chain_length', jsonb_array_length(public._cfibp_organizational_connections()->'example_chain'),
    'cross_functional_observations', jsonb_array_length(public._cfibp_cross_functional_observations()->'observations'),
    'collaboration_examples', jsonb_array_length(public._cfibp_collaboration_opportunities()->'examples'),
    'privacy_note', 'Metadata only — module overview counts, operations_events aggregates, and documented connection patterns. No PII or individual scoring.'
  );
end; $$;

create or replace function public._cfibp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_module_blocks int := 0;
  v_open_events int := 0;
begin
  v_engagement := public._cfibp_engagement_summary(p_org_id);
  v_module_blocks := coalesce((v_engagement->>'module_overview_blocks')::int, 0);
  v_open_events := coalesce((v_engagement->>'open_operations_events')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'cross_functional_awareness',
      'label', 'Increased cross-functional awareness — module overviews and connection chain documented',
      'met', v_module_blocks >= 5,
      'note', case when v_module_blocks < 5 then 'Five module overview blocks required for cross-functional visibility.' else null end
    ),
    jsonb_build_object(
      'key', 'visible_bottlenecks',
      'label', 'Visible bottlenecks — overdue tasks, escalations, and knowledge gaps surfaced',
      'met', v_engagement ? 'tasks_overdue' and v_engagement ? 'knowledge_open_gaps',
      'note', 'Systemic friction signals — improvement not blame.'
    ),
    jsonb_build_object(
      'key', 'stronger_collaboration',
      'label', 'Stronger collaboration — cross-functional observations and collaboration opportunities documented',
      'met', jsonb_array_length(public._cfibp_cross_functional_observations()->'observations') >= 3,
      'note', '🦉🌹🔔 awareness examples — humans decide; Aipify prepares context.'
    ),
    jsonb_build_object(
      'key', 'information_flow',
      'label', 'Improved information flow — flow visibility dimensions and module signal paths',
      'met', jsonb_array_length(public._cfibp_information_flow_visibility()->'dimensions') >= 4,
      'note', 'Aggregate counts only — no raw operational content.'
    ),
    jsonb_build_object(
      'key', 'organizational_resilience',
      'label', 'Organizational resilience — systems thinking objectives and connection awareness',
      'met', jsonb_array_length(public._cfibp_objectives()) >= 6,
      'note', 'Organizations are living systems — connections reveal opportunities.'
    ),
    jsonb_build_object(
      'key', 'events_aggregated',
      'label', 'Cross-module events aggregated for coordination visibility',
      'met', v_open_events >= 0,
      'note', case when v_open_events = 0 then 'No open events — healthy baseline or seed operational signals.' else format('%s open operations events visible.', v_open_events) end
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — health summaries, dependencies, positive collaboration',
      'met', jsonb_array_length(public._cfibp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no hidden monitoring, scoring, or punitive interpretation',
      'met', jsonb_array_length(public._cfibp_privacy_principles()->'rules') >= 4,
      'note', 'Strengthen systems — never judge people.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent observation generation documented',
      'met', jsonb_array_length(public._cfibp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Distinct from Personal Productivity A.70, Cross-Tenant A.71, Strategic Alignment Phase 68, Industry A.44',
      'met', jsonb_array_length(public._cfibp_integration_links()) >= 10,
      'note', 'Cross-link related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group product, Sales Expert, support, strategic initiatives',
      'met', (public._cfibp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — organizations are living systems',
      'met', true,
      'note', 'Understanding connections reveals improvement opportunities.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 18 fields; append Phase 70
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
    'blueprint_privacy_note', 'Cross-functional intelligence is metadata only — awareness not surveillance. No individual scoring or punitive interpretation.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 18 + A.32 fields; append Phase 70 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_operations_center_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);
  v_engagement := public._cfibp_engagement_summary(v_org_id);

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
    'cross_functional_note', 'We are operating more cohesively — understanding how teams and processes interact.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._cfibp_distinction_note() to authenticated;
grant execute on function public._cfibp_mission() to authenticated;
grant execute on function public._cfibp_philosophy() to authenticated;
grant execute on function public._cfibp_abos_principle() to authenticated;
grant execute on function public._cfibp_objectives() to authenticated;
grant execute on function public._cfibp_organizational_connections() to authenticated;
grant execute on function public._cfibp_cross_functional_observations() to authenticated;
grant execute on function public._cfibp_information_flow_visibility() to authenticated;
grant execute on function public._cfibp_bottleneck_identification() to authenticated;
grant execute on function public._cfibp_collaboration_opportunities() to authenticated;
grant execute on function public._cfibp_leadership_insights() to authenticated;
grant execute on function public._cfibp_self_love_connection() to authenticated;
grant execute on function public._cfibp_trust_connection() to authenticated;
grant execute on function public._cfibp_privacy_principles() to authenticated;
grant execute on function public._cfibp_dogfooding() to authenticated;
grant execute on function public._cfibp_vision_phrases() to authenticated;
grant execute on function public._cfibp_integration_links() to authenticated;
grant execute on function public._cfibp_engagement_summary(uuid) to authenticated;
grant execute on function public._cfibp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'operations-center-blueprint-phase70', 'Cross-Functional Intelligence Engine (ABOS Phase 70)',
  'Cross-Functional Intelligence Engine — extends Operations Center Foundation A.32 (layered with Phase 18) with organizational connections, information flow visibility, bottleneck recognition, collaboration opportunities, and live success criteria.',
  'authenticated', 110
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'operations-center-blueprint-phase70' and tenant_id is null
);
