-- Implementation Blueprint Phase 60 — Decision Support Engine
-- Extends Decision Support Engine (Phase 38) at /app/assistant/decisions. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._dsbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 60 — Decision Support Engine at /app/assistant/decisions. Extends Decision Support Engine Phase 38 (personal and business decision guidance — humans decide). Distinct from Organizational Decision Support Engine A.54 at /app/organizational-decision-support-engine (org-wide structured decisions with approval workflows). Distinct from Briefing System repo Phase 60 (20260614900000_briefing_system_phase60.sql — Since Last Login briefings). Distinct from Quality Guardian Phases 58–59 at /app/quality (operational quality — not decision preparation). Distinct from Simulation Decision Lab Blueprint Phase 22 at /app/simulations (scenario forecasting — simulation never acts). Cross-links: Self Love A.76 /app/self-love-engine, Trust & Action Phase 30 /app/approvals, Goals & Dreams /app/assistant/goals, Attention Guardian /app/assistant/attention, Context Engine /app/assistant/context, Executive Insights Blueprint Phase 59 /app/executive-insights-engine. All Phase 38 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._dsbp_mission()
returns text language sql immutable as $$
  select 'Help people navigate important decisions with clarity — structure, perspective, and context. Humans decide; Aipify supports.';
$$;

create or replace function public._dsbp_philosophy()
returns text language sql immutable as $$
  select 'Decision support means clarity before choosing — not certainty. Aipify structures options, surfaces trade-offs, and highlights risks so people can reflect intentionally before acting.';
$$;

create or replace function public._dsbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) objective is clarity before choosing — structure, perspective, and context; humans retain final authority.';
$$;

create or replace function public._dsbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_preparation', 'label', 'Decision preparation', 'description', 'Gather context, frame the problem, and identify what matters before choosing'),
    jsonb_build_object('key', 'option_evaluation', 'label', 'Option evaluation', 'description', 'Compare alternatives with explainable reasoning — perspective, not prescription'),
    jsonb_build_object('key', 'trade_off_awareness', 'label', 'Trade-off awareness', 'description', 'Surface competing priorities and consequences — no hidden recommendations'),
    jsonb_build_object('key', 'risk_identification', 'label', 'Risk identification', 'description', 'Highlight timing, dependencies, and opportunity costs — strengthen preparation, not paralysis'),
    jsonb_build_object('key', 'scenario_consideration', 'label', 'Scenario consideration', 'description', 'Explore success, underperformance, and secondary effects before committing'),
    jsonb_build_object('key', 'reflection_before_action', 'label', 'Reflection before action', 'description', 'Pause for intentional reflection — good decisions can still produce difficult outcomes')
  );
$$;

create or replace function public._dsbp_decision_frameworks()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'problem', 'question', 'What problem are we trying to solve?', 'purpose', 'Frame the decision clearly before evaluating options'),
    jsonb_build_object('key', 'options', 'question', 'What options are available?', 'purpose', 'Identify realistic alternatives — including doing nothing'),
    jsonb_build_object('key', 'assumptions', 'question', 'What assumptions are we making?', 'purpose', 'Surface beliefs that could change the outcome'),
    jsonb_build_object('key', 'risks', 'question', 'What risks should we consider?', 'purpose', 'Resource limits, timing, dependencies, opportunity costs'),
    jsonb_build_object('key', 'success', 'question', 'What would success look like?', 'purpose', 'Define outcomes that matter — business and human'),
    jsonb_build_object('key', 'inaction', 'question', 'What if we do nothing?', 'purpose', 'Evaluate the cost of delay and status quo')
  );
$$;

create or replace function public._dsbp_decision_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational',
      'description', 'Day-to-day choices that keep work moving',
      'examples', jsonb_build_array('Team priorities', 'Resource allocation', 'Workflow sequencing', 'Support backlog triage')
    ),
    jsonb_build_object(
      'key', 'strategic',
      'label', 'Strategic',
      'description', 'Direction-setting choices with longer horizons',
      'examples', jsonb_build_array('Market expansion', 'Product investment', 'Organizational restructuring', 'Initiative prioritization')
    ),
    jsonb_build_object(
      'key', 'personal',
      'label', 'Personal',
      'description', 'Individual choices about time, energy, and growth',
      'examples', jsonb_build_array('Workload balance', 'Professional development', 'Goal prioritization', 'Meeting acceptance')
    )
  );
$$;

create or replace function public._dsbp_option_comparison_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'perspective_not_prescription',
      'scenario', 'Perspective, not prescription',
      'example', '🦉 Option A protects focus time this week; Option B maintains responsiveness to pending approvals. Both have trade-offs — you decide which aligns with current priorities.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'values_alignment',
      'scenario', 'Values and goals alignment',
      'example', '🌹 One path advances the stated goal you set last month; the other addresses an urgent operational need. Aipify surfaced both — reflection may help before choosing.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'timing_awareness',
      'scenario', 'Timing and dependencies',
      'example', '🔔 Delaying this decision by two weeks reduces short-term pressure but may affect the renewal window — worth considering before committing.'
    )
  );
$$;

create or replace function public._dsbp_risk_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk awareness strengthens preparation — not paralysis. Aipify highlights risks honestly; humans weigh tolerance and context.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'resource_limitations', 'label', 'Resource limitations', 'description', 'Capacity, budget, and staffing constraints that affect feasibility'),
      jsonb_build_object('key', 'timing', 'label', 'Timing', 'description', 'Deadlines, seasonality, and windows of opportunity'),
      jsonb_build_object('key', 'dependencies', 'label', 'Dependencies', 'description', 'Upstream approvals, integrations, and cross-team commitments'),
      jsonb_build_object('key', 'opportunity_costs', 'label', 'Opportunity costs', 'description', 'What else may be delayed or deprioritized by this choice')
    ),
    'tone', 'Calm and factual — no fear-driven messaging or urgency traps'
  );
$$;

create or replace function public._dsbp_scenario_exploration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Scenario exploration supports reflection — not prediction certainty. Consider multiple paths before acting.',
    'scenarios', jsonb_build_array(
      jsonb_build_object('key', 'success', 'label', 'Success path', 'description', 'What happens if the decision works as intended — primary and secondary benefits'),
      jsonb_build_object('key', 'underperformance', 'label', 'Underperformance', 'description', 'What if results fall short — early signals and mitigation options'),
      jsonb_build_object('key', 'secondary_effects', 'label', 'Secondary effects', 'description', 'Downstream impacts on teams, customers, and other priorities')
    ),
    'simulation_note', 'For quantitative forecasting use Simulation Decision Lab Phase 78 / Blueprint Phase 22 — distinct from DSE reflection scaffolding'
  );
$$;

create or replace function public._dsbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports decision quality — reflection, patience, acceptance of uncertainty, and self-compassion when outcomes are difficult.',
    'practices', jsonb_build_array(
      'Reflection — pause before high-stakes choices; clarity over speed',
      'Patience — demanding periods deserve sustainable pacing, not guilt',
      'Acceptance of uncertainty — no decision removes all risk; prepare honestly',
      'Self-compassion — good decisions can still produce difficult outcomes'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — DSE stores decision metadata and guidance, not wellbeing content.'
  );
$$;

create or replace function public._dsbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust means explainability — every recommendation shows what contributed, assumptions made, and areas of uncertainty.',
    'users_should_see', jsonb_build_array(
      'Reasoning — why this guidance appeared',
      'Confidence level — honest low, moderate, or high with alternatives when uncertain',
      'Assumptions — what Aipify inferred from metadata',
      'Uncertainty areas — where human judgment matters most'
    ),
    'trust_action_route', '/app/approvals',
    'trust_action_note', 'Trust & Action Phase 30 handles sensitive execution approvals — DSE prepares decisions; humans approve actions separately'
  );
$$;

create or replace function public._dsbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates decision support patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product prioritization, sales strategy, ecosystem investments, organizational planning',
      'focus', jsonb_build_array(
        'Product prioritization — initiative sequencing with trade-off framing',
        'Sales strategy — pipeline and ecosystem investment decisions',
        'Organizational planning — capacity and roadmap choices',
        'Leadership reflection before high-impact commitments'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — operational and strategic decision support in commerce context',
      'focus', jsonb_build_array(
        'Support prioritization and workflow decisions',
        'Seasonal capacity and staffing trade-offs',
        'Goal alignment for operational leaders'
      )
    )
  );
$$;

create or replace function public._dsbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Clarity before choosing — structure, perspective, and context.',
    'Humans decide — Aipify advises with explainability on every recommendation.',
    'Good decisions can still produce difficult outcomes — self-compassion matters.',
    'Risk awareness strengthens preparation — not paralysis.',
    'Reflection before action — intentional choices over reactive urgency.'
  );
$$;

create or replace function public._dsbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Trust & Action Engine (Phase 30)', 'route', '/app/approvals', 'note', 'Sensitive action approvals — distinct from decision guidance'),
    jsonb_build_object('label', 'Goals & Dreams Engine', 'route', '/app/assistant/goals', 'note', 'Goal alignment context for personal and strategic decisions'),
    jsonb_build_object('label', 'Attention Guardian', 'route', '/app/assistant/attention', 'note', 'Workload and focus trade-offs'),
    jsonb_build_object('label', 'Context Engine', 'route', '/app/assistant/context', 'note', 'Calendar and scheduling decision context'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Patience, reflection, self-compassion — principle only'),
    jsonb_build_object('label', 'Executive Insights (A.35 / Blueprint Phase 59)', 'route', '/app/executive-insights-engine', 'note', 'Strategic thinking and leadership reflection — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Org-wide structured decisions — distinct from Assistant DSE'),
    jsonb_build_object('label', 'Simulation Decision Lab (Phase 78 / Blueprint Phase 22)', 'route', '/app/simulations', 'note', 'Quantitative scenario forecasting — simulation never acts'),
    jsonb_build_object('label', 'Learning Engine', 'route', '/app/learning', 'note', 'May improve strategies — user retains control'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Experience-to-guidance synthesis — cross-link for long-term framing')
  );
$$;

create or replace function public._dsbp_success_criteria(p_tenant_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_pending int := 0;
  v_history int := 0;
  v_high_confidence int := 0;
begin
  select count(*) into v_pending
  from public.decision_recommendations
  where tenant_id = p_tenant_id and user_id = p_user_id and status = 'pending';

  select count(*) into v_history
  from public.decision_history
  where tenant_id = p_tenant_id and user_id = p_user_id;

  select count(*) into v_high_confidence
  from public.decision_recommendations
  where tenant_id = p_tenant_id and user_id = p_user_id
    and status = 'pending' and confidence = 'high';

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'decision_quality',
      'label', 'Decision quality — frameworks and option comparison documented',
      'met', jsonb_array_length(public._dsbp_decision_frameworks()) >= 6,
      'note', 'Companion questions guide preparation — perspective, not prescription.'
    ),
    jsonb_build_object(
      'key', 'leader_confidence',
      'label', 'Leader confidence — explainable recommendations available',
      'met', v_pending > 0 or v_history > 0,
      'note', case when v_pending = 0 and v_history = 0 then 'Run analysis or ask in chat to generate guidance.' else null end
    ),
    jsonb_build_object(
      'key', 'risk_attention',
      'label', 'Risk attention — risk categories and indicators surfaced',
      'met', (public._dsbp_risk_awareness()->>'principle') is not null,
      'note', 'Strengthen preparation — not paralysis.'
    ),
    jsonb_build_object(
      'key', 'intentional_reflection',
      'label', 'Intentional reflection — scenario exploration and Self Love connection',
      'met', jsonb_array_length(public._dsbp_scenario_exploration()->'scenarios') >= 3,
      'note', 'Pause before high-stakes choices.'
    ),
    jsonb_build_object(
      'key', 'human_responsibility',
      'label', 'Human responsibility central — ethical principles and trust explainability',
      'met', true,
      'note', 'Aipify never makes decisions for you — you always retain final authority.'
    ),
    jsonb_build_object(
      'key', 'decision_types',
      'label', 'Decision types — operational, strategic, personal examples documented',
      'met', jsonb_array_length(public._dsbp_decision_types()) >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from A.54, Briefing Phase 60, QG 58–59, Simulation Phase 22',
      'met', jsonb_array_length(public._dsbp_integration_links()) >= 8,
      'note', 'Extend related engines — do not duplicate org decision workflows.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group product, sales, ecosystem, planning patterns',
      'met', (public._dsbp_dogfooding()->'aipify_group') is not null,
      'note', 'Internal validation before customer rollout.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 38 fields; append Phase 60 blueprint
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_decisions_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.dse_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public.ensure_dse_settings(v_tenant_id, v_user_id);
  perform public.analyze_decisions();

  return jsonb_build_object(
    'has_customer', true,
    'settings', jsonb_build_object(
      'recommendations_enabled', v_settings.recommendations_enabled,
      'proactivity_level', v_settings.proactivity_level,
      'business_domains_enabled', v_settings.business_domains_enabled,
      'personal_decisions_enabled', v_settings.personal_decisions_enabled,
      'use_historical_data', v_settings.use_historical_data,
      'presentation_style', v_settings.presentation_style,
      'privacy_settings', v_settings.privacy_settings
    ),
    'pending_decisions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'decision_type', r.decision_type, 'domain', r.domain,
        'title', r.title, 'recommendation', r.recommendation,
        'reasoning', r.reasoning, 'confidence', r.confidence,
        'risk_indicators', r.risk_indicators, 'evidence', r.evidence,
        'trade_offs', r.trade_offs, 'created_at', r.created_at
      ) order by
        case r.confidence when 'high' then 0 when 'moderate' then 1 else 2 end,
        r.created_at desc)
      from public.decision_recommendations r
      where r.tenant_id = v_tenant_id and r.user_id = v_user_id
        and r.status = 'pending'),
      '[]'::jsonb
    ),
    'business_insights', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'domain', r.domain, 'title', r.title,
        'recommendation', r.recommendation, 'confidence', r.confidence
      ) order by r.created_at desc)
      from public.decision_recommendations r
      where r.tenant_id = v_tenant_id and r.user_id = v_user_id
        and r.status = 'pending'
        and r.domain in ('support', 'administrative', 'executive', 'operational')
      limit 8),
      '[]'::jsonb
    ),
    'priority_opportunities', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ar.id, 'title', ar.action_name, 'risk_level', ar.risk_level,
        'description', ar.description, 'confidence', case
          when ar.risk_level >= 3 then 'high'
          when ar.risk_level >= 2 then 'moderate'
          else 'low'
        end
      ) order by ar.risk_level desc)
      from public.action_requests ar
      where ar.tenant_id = v_tenant_id and ar.status = 'pending'
      limit 5),
      '[]'::jsonb
    ),
    'risk_indicators', coalesce(
      (select jsonb_agg(distinct elem)
      from public.decision_recommendations r,
        jsonb_array_elements_text(r.risk_indicators) elem
      where r.tenant_id = v_tenant_id and r.user_id = v_user_id
        and r.status = 'pending' and jsonb_array_length(r.risk_indicators) > 0),
      '[]'::jsonb
    ),
    'decision_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', h.id, 'title', h.title, 'user_response', h.user_response,
        'notes', h.notes, 'created_at', h.created_at
      ) order by h.created_at desc)
      from public.decision_history h
      where h.tenant_id = v_tenant_id and h.user_id = v_user_id
        and (v_settings.privacy_settings ->> 'store_decision_history')::boolean is not false
      limit 15),
      '[]'::jsonb
    ),
    'framework', jsonb_build_array(
      'Identify available options',
      'Gather relevant context',
      'Evaluate consequences',
      'Align with goals and values',
      'Review recommendations',
      'You make the final decision'
    ),
    'privacy_note', 'Recommendations are guidance only. You always retain final authority. Business data stays protected.',
    'ethical_principles', jsonb_build_array(
      'Aipify never makes decisions for you',
      'No manipulation or pressure',
      'Explainability on every recommendation',
      'Business-first — personal support is optional'
    ),
    'integrations', jsonb_build_object(
      'trust_actions', 'Support prioritization and escalation',
      'goals_dreams', 'Goal alignment context',
      'attention_guardian', 'Workload and focus trade-offs',
      'context_engine', 'Calendar and scheduling decisions',
      'learning_engine', 'May improve strategies — you retain control'
    ),
    'implementation_blueprint_phase60', jsonb_build_object(
      'phase', 'Phase 60 — Decision Support Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE60_DECISION_SUPPORT.md',
      'engine_phase', 'Phase 38 Decision Support Engine',
      'route', '/app/assistant/decisions',
      'distinction_note', public._dsbp_distinction_note(),
      'mission', public._dsbp_mission(),
      'philosophy', public._dsbp_philosophy(),
      'abos_principle', public._dsbp_abos_principle(),
      'objectives', public._dsbp_objectives(),
      'decision_frameworks', public._dsbp_decision_frameworks(),
      'decision_types', public._dsbp_decision_types(),
      'option_comparison_examples', public._dsbp_option_comparison_examples(),
      'risk_awareness', public._dsbp_risk_awareness(),
      'scenario_exploration', public._dsbp_scenario_exploration(),
      'self_love_connection', public._dsbp_self_love_connection(),
      'trust_connection', public._dsbp_trust_connection(),
      'dogfooding', public._dsbp_dogfooding(),
      'success_criteria', public._dsbp_success_criteria(v_tenant_id, v_user_id),
      'vision_phrases', public._dsbp_vision_phrases(),
      'integration_links', public._dsbp_integration_links()
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Platform overview — append blueprint metadata (aggregates only)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_decisions_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access decision content. Aggregates only.',
    'dse_profiles', (select count(*) from public.dse_settings),
    'pending_recommendations', (select count(*) from public.decision_recommendations where status = 'pending'),
    'accepted_guidance', (select count(*) from public.decision_history where user_response = 'accepted_guidance'),
    'by_domain', coalesce(
      (select jsonb_object_agg(domain, cnt)
      from (select domain, count(*)::integer as cnt from public.decision_recommendations group by domain) sub),
      '{}'::jsonb
    ),
    'by_confidence', coalesce(
      (select jsonb_object_agg(confidence, cnt)
      from (select confidence, count(*)::integer as cnt from public.decision_recommendations group by confidence) sub),
      '{}'::jsonb
    ),
    'implementation_blueprint_phase60', jsonb_build_object(
      'phase', 'Phase 60 — Decision Support Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE60_DECISION_SUPPORT.md',
      'engine_phase', 'Phase 38 Decision Support Engine',
      'route', '/app/assistant/decisions',
      'distinction_note', public._dsbp_distinction_note(),
      'mission', public._dsbp_mission(),
      'abos_principle', public._dsbp_abos_principle()
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._dsbp_distinction_note() to authenticated;
grant execute on function public._dsbp_mission() to authenticated;
grant execute on function public._dsbp_philosophy() to authenticated;
grant execute on function public._dsbp_abos_principle() to authenticated;
grant execute on function public._dsbp_objectives() to authenticated;
grant execute on function public._dsbp_decision_frameworks() to authenticated;
grant execute on function public._dsbp_decision_types() to authenticated;
grant execute on function public._dsbp_option_comparison_examples() to authenticated;
grant execute on function public._dsbp_risk_awareness() to authenticated;
grant execute on function public._dsbp_scenario_exploration() to authenticated;
grant execute on function public._dsbp_self_love_connection() to authenticated;
grant execute on function public._dsbp_trust_connection() to authenticated;
grant execute on function public._dsbp_dogfooding() to authenticated;
grant execute on function public._dsbp_vision_phrases() to authenticated;
grant execute on function public._dsbp_integration_links() to authenticated;
grant execute on function public._dsbp_success_criteria(uuid, uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'decision-support-blueprint-phase60', 'Decision Support Engine (ABOS Phase 60)',
  'Decision Support Engine — extends Phase 38 with decision frameworks, option comparison examples, scenario exploration, Self Love and Trust connections, and live success criteria.',
  'authenticated', 105
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'decision-support-blueprint-phase60' and tenant_id is null
);
