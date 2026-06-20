-- Phase 620 P1 follow-up — strip provisioning/sync writes from STABLE Intelligence GET RPCs.

create or replace function public.list_app_portal_enterprise_benchmarking(
  p_dimension_key text default null,
  p_maturity_level integer default null,
  p_organizational_area text default null,
  p_priority_level text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_dims jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_overall integer; v_operational integer; v_governance integer; v_learning integer;
  v_executive integer; v_business_pack integer; v_focus jsonb := '[]'::jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  for v_row in
    select d.* from public.app_portal_enterprise_benchmarking_dimensions d
    where d.company_id = v_company_id
      and (p_dimension_key is null or d.dimension_key = p_dimension_key)
      and (p_maturity_level is null or d.maturity_level = p_maturity_level)
      and (p_organizational_area is null or d.organizational_area = p_organizational_area)
      and (p_priority_level is null or d.priority_level = p_priority_level)
      and (p_period_from is null or d.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or d.dimension_name ilike '%' || trim(p_search) || '%')
    order by d.maturity_score desc
  loop
    v_dims := v_dims || public._aebmi311_dimension_card(v_row);
    v_total := v_total + 1;
    if v_row.maturity_level <= 2 then
      v_focus := v_focus || jsonb_build_object('dimension_key', v_row.dimension_key, 'name', v_row.dimension_name);
    end if;
  end loop;

  v_operational := public._aebmi311_avg_score(v_company_id, array['operational_excellence', 'automation_readiness']);
  v_governance := public._aebmi311_avg_score(v_company_id, array['governance_compliance', 'risk_resilience']);
  v_learning := public._aebmi311_avg_score(v_company_id, array['learning_development']);
  v_executive := public._aebmi311_avg_score(v_company_id, array['leadership_decision_making', 'organizational_intelligence']);
  v_business_pack := public._aebmi311_avg_score(v_company_id, array['business_pack_adoption', 'customer_success']);
  v_overall := round((v_operational + v_governance + v_learning + v_executive + v_business_pack) / 5.0);

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_assess', coalesce(v_ctx->>'can_assess', 'false') = 'true',
    'has_maturity_data', v_total > 0,
    'overall_maturity_score', v_overall,
    'operational_maturity_score', v_operational,
    'governance_maturity_score', v_governance,
    'learning_maturity_score', v_learning,
    'executive_intelligence_score', v_executive,
    'business_pack_maturity_score', v_business_pack,
    'recommended_focus_areas', v_focus,
    'executive_summary', case
      when v_total = 0 then 'No maturity insights are available yet.'
      when v_governance >= 70 then 'Your organization demonstrates strong governance maturity.'
      when v_learning < 45 then 'Learning maturity presents significant opportunities for advancement.'
      when v_operational >= 65 then 'Strategic execution capabilities continue to improve.'
      when public._aebmi311_avg_score(v_company_id, array['automation_readiness']) >= 55 then 'Automation readiness has increased substantially.'
      else 'Your organization continues advancing operational maturity across the Business Operating System.'
    end,
    'dimensions', v_dims,
    'insights', public._aebmi311_build_insights(v_company_id),
    'recommendations', public._aebmi311_build_recommendations(v_company_id),
    'anonymized_benchmark_note', 'Benchmarking insights are aggregated and anonymized — no customer-specific data is exposed across organizations.',
    'principle', 'Maturity insights provide guidance for improvement — organizations define their own strategic objectives.'
  );
end;
$$;

create or replace function public.get_app_portal_enterprise_benchmarking_dimension(p_dimension_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_row record; v_assessments jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select d.* into v_row from public.app_portal_enterprise_benchmarking_dimensions d
  where d.company_id = v_company_id and d.dimension_key = p_dimension_key;
  if not found then return jsonb_build_object('found', false); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'maturity_level', a.maturity_level, 'assessor_name', a.assessor_name,
    'assessment_notes', a.assessment_notes, 'assessed_at', a.assessed_at
  ) order by a.assessed_at desc), '[]'::jsonb)
  into v_assessments
  from public.app_portal_enterprise_benchmarking_assessments a
  where a.company_id = v_company_id and a.dimension_key = p_dimension_key;

  return public._aebmi311_dimension_card(v_row) || jsonb_build_object(
    'found', true, 'assessment_history', v_assessments, 'can_assess', coalesce(v_ctx->>'can_assess', 'false') = 'true',
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._aebmi311_build_recommendations(v_company_id)) r
        where r->>'dimension_key' = p_dimension_key or r->>'dimension_key' is null
      ) sub
    )
  );
end;
$$;

create or replace function public.get_app_portal_enterprise_benchmarking_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  return jsonb_build_object('found', true, 'recommendations', public._aebmi311_build_recommendations(v_company_id));
end;
$$;

create or replace function public.get_app_portal_enterprise_benchmarking_timeline(
  p_dimension_key text default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object('id', t.id, 'dimension_key', t.dimension_key, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at) as row
    from public.app_portal_enterprise_benchmarking_timeline t
    where t.company_id = v_company_id
      and (p_dimension_key is null or t.dimension_key = p_dimension_key)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 20
  ) sub;

  if jsonb_array_length(v_events) = 0 then
    select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
    from (
      select jsonb_build_object('id', d.id, 'dimension_key', d.dimension_key, 'event_type', 'maturity_baseline', 'description', d.dimension_name, 'created_at', d.created_at) as row
      from public.app_portal_enterprise_benchmarking_dimensions d
      where d.company_id = v_company_id and (p_dimension_key is null or d.dimension_key = p_dimension_key)
      order by d.created_at desc limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.list_app_portal_predictive_intelligence(
  p_category text default null,
  p_confidence_level text default null,
  p_time_horizon text default null,
  p_organizational_area text default null,
  p_potential_impact text default null,
  p_review_status text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_preds jsonb := '[]'::jsonb; v_warnings jsonb := '[]'::jsonb;
  v_row record; v_total integer := 0;
  v_opportunities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb; v_attention jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._apoi312_manager_categories();

  for v_row in
    select p.* from public.app_portal_predictive_intelligence_predictions p
    where p.company_id = v_company_id
      and (v_can_full or p.category = any(v_manager_cats))
      and (p_category is null or p.category = p_category)
      and (p_confidence_level is null or p.confidence_level = p_confidence_level)
      and (p_time_horizon is null or p.time_horizon = p_time_horizon)
      and (p_organizational_area is null or p.organizational_area = p_organizational_area)
      and (p_potential_impact is null or p.potential_impact = p_potential_impact)
      and (p_review_status is null or p.review_status = p_review_status)
      and (p_period_from is null or p.generated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or p.title ilike '%' || trim(p_search) || '%' or p.summary ilike '%' || trim(p_search) || '%')
    order by case p.potential_impact when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end, p.generated_at desc
  loop
    v_preds := v_preds || public._apoi312_prediction_card(v_row);
    v_total := v_total + 1;
    if v_row.category in ('strategic', 'business_pack', 'customer_success') and v_row.potential_impact in ('moderate', 'high') then
      v_opportunities := v_opportunities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.category in ('risk', 'capacity', 'governance') or v_row.potential_impact in ('high', 'critical') then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.review_status = 'pending' and v_row.potential_impact in ('high', 'critical') then
      v_attention := v_attention || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'warning_key', w.warning_key, 'title', w.title,
    'signal_type', w.signal_type, 'description', w.description,
    'severity', w.severity, 'organizational_area', w.organizational_area
  )), '[]'::jsonb)
  into v_warnings
  from public.app_portal_predictive_intelligence_early_warnings w
  where w.company_id = v_company_id;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_generate', coalesce(v_ctx->>'can_generate', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_predictive_data', v_total > 0,
    'forecast_summary', case
      when v_total = 0 then 'No predictive insights are available yet.'
      when jsonb_array_length(v_risks) > jsonb_array_length(v_opportunities) then 'Several indicators suggest areas requiring proactive attention.'
      else 'Current indicators suggest stable organizational performance with emerging opportunities.'
    end,
    'executive_summary', case
      when v_total = 0 then 'No predictive insights are available yet.'
      when exists (select 1 from public.app_portal_predictive_intelligence_predictions p where p.company_id = v_company_id and p.category = 'capacity') then 'Capacity planning should be reviewed within the next quarter.'
      when jsonb_array_length(v_opportunities) >= 2 then 'Several emerging opportunities may warrant executive attention.'
      when jsonb_array_length(v_risks) = 0 then 'Operational momentum remains positive.'
      else 'Current indicators suggest stable organizational performance.'
    end,
    'emerging_opportunities', v_opportunities,
    'emerging_risks', v_risks,
    'areas_requiring_attention', v_attention,
    'predictive_confidence_note', 'All predictions are probability-based insights — Aipify never claims certainty about future events.',
    'predictions', v_preds,
    'early_warnings', v_warnings,
    'recommendations', public._apoi312_build_recommendations(v_company_id),
    'principle', 'Predictive insights support preparedness — organizations retain full decision authority.'
  );
end;
$$;

create or replace function public.get_app_portal_predictive_intelligence_prediction(p_prediction_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record; v_reviews jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._apoi312_manager_categories();

  select p.* into v_row from public.app_portal_predictive_intelligence_predictions p
  where p.company_id = v_company_id and p.id = p_prediction_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This prediction is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'outcome', r.outcome, 'review_notes', r.review_notes, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_predictive_intelligence_outcome_reviews r
  where r.company_id = v_company_id and r.prediction_id = p_prediction_id;

  return public._apoi312_prediction_card(v_row) || jsonb_build_object(
    'found', true,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'outcome_reviews', v_reviews,
    'probability_note', 'This insight is probability-based — not a certainty about future events.'
  );
end;
$$;

create or replace function public.get_app_portal_predictive_intelligence_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  return jsonb_build_object('found', true, 'recommendations', public._apoi312_build_recommendations(v_company_id));
end;
$$;

create or replace function public.get_app_portal_predictive_intelligence_timeline(
  p_prediction_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'prediction_id', t.prediction_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_predictive_intelligence_timeline t
    where t.company_id = v_company_id
      and (p_prediction_id is null or t.prediction_id = p_prediction_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.list_app_portal_scenario_planning(
  p_category text default null,
  p_scenario_type text default null,
  p_planning_status text default null,
  p_time_horizon text default null,
  p_organizational_area text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_scenarios jsonb := '[]'::jsonb; v_comparisons jsonb := '[]'::jsonb;
  v_row record; v_total integer := 0;
  v_priorities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aspsc313_manager_categories();

  for v_row in
    select s.* from public.app_portal_scenario_planning_scenarios s
    where s.company_id = v_company_id
      and (v_can_full or s.category = any(v_manager_cats))
      and (p_category is null or s.category = p_category)
      and (p_scenario_type is null or s.scenario_type = p_scenario_type)
      and (p_planning_status is null or s.planning_status = p_planning_status)
      and (p_time_horizon is null or s.time_horizon = p_time_horizon)
      and (p_organizational_area is null or s.organizational_area = p_organizational_area)
      and (p_period_from is null or s.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or s.title ilike '%' || trim(p_search) || '%' or s.summary ilike '%' || trim(p_search) || '%')
    order by case s.scenario_type when 'challenging' then 1 when 'expected' then 2 when 'best_case' then 3 else 4 end, s.updated_at desc
  loop
    v_scenarios := v_scenarios || public._aspsc313_scenario_card(v_row);
    v_total := v_total + 1;
    if v_row.scenario_type in ('best_case', 'expected') and v_row.category in ('strategic', 'market') then
      v_priorities := v_priorities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.scenario_type = 'challenging' or v_row.category = 'risk' then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'comparison_key', c.comparison_key, 'title', c.title,
    'comparison_summary', c.comparison_summary, 'scenario_ids', c.scenario_ids
  )), '[]'::jsonb)
  into v_comparisons
  from public.app_portal_scenario_planning_comparisons c
  where c.company_id = v_company_id and v_can_full;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_simulate', coalesce(v_ctx->>'can_simulate', 'false') = 'true',
    'can_compare', coalesce(v_ctx->>'can_compare', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_scenario_data', v_total > 0,
    'planning_summary', case
      when v_total = 0 then 'No scenarios are available yet.'
      when jsonb_array_length(v_risks) > 0 then 'Several scenarios suggest areas worth executive rehearsal.'
      else 'Scenario portfolio supports proactive leadership planning.'
    end,
    'executive_summary', case
      when v_total = 0 then 'No scenarios are available yet.'
      when exists (select 1 from public.app_portal_scenario_planning_scenarios s where s.company_id = v_company_id and s.planning_status = 'simulated') then
        'Recent simulations provide leadership with comparative preparedness insights.'
      else 'Leadership can explore best, expected, and challenging futures before committing resources.'
    end,
    'strategic_priorities', v_priorities,
    'risk_scenarios', v_risks,
    'simulation_isolation_note', 'Simulations are isolated planning exercises — they do not change production systems or execute actions.',
    'simulation_lab_route', '/app/simulations',
    'scenarios', v_scenarios,
    'comparisons', v_comparisons,
    'recommendations', public._aspsc313_build_recommendations(v_company_id),
    'principle', 'Scenario planning supports thinking ahead — organizations retain full decision authority.'
  );
end;
$$;

create or replace function public.get_app_portal_scenario_planning_scenario(p_scenario_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record; v_sims jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aspsc313_manager_categories();

  select s.* into v_row from public.app_portal_scenario_planning_scenarios s
  where s.company_id = v_company_id and s.id = p_scenario_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This scenario is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sim.id, 'simulation_key', sim.simulation_key, 'title', sim.title,
    'summary', sim.summary, 'outcome_summary', sim.outcome_summary,
    'risk_notes', sim.risk_notes, 'opportunity_notes', sim.opportunity_notes,
    'simulated_at', sim.simulated_at
  ) order by sim.simulated_at desc), '[]'::jsonb)
  into v_sims
  from public.app_portal_scenario_planning_simulations sim
  where sim.company_id = v_company_id and sim.scenario_id = p_scenario_id;

  return public._aspsc313_scenario_card(v_row) || jsonb_build_object(
    'found', true,
    'can_simulate', coalesce(v_ctx->>'can_simulate', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'simulations', v_sims,
    'isolation_note', 'Simulation results are illustrative — humans decide whether and how to act.'
  );
end;
$$;

create or replace function public.get_app_portal_scenario_planning_timeline(
  p_scenario_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'scenario_id', t.scenario_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_scenario_planning_timeline t
    where t.company_id = v_company_id
      and (p_scenario_id is null or t.scenario_id = p_scenario_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.list_app_portal_executive_foresight(
  p_category text default null,
  p_time_horizon text default null,
  p_strategic_priority text default null,
  p_organizational_area text default null,
  p_executive_owner text default null,
  p_review_status text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_obs jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_opportunities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb;
  v_attention jsonb := '[]'::jsonb; v_focus jsonb := '[]'::jsonb;
  v_gaining jsonb := '[]'::jsonb; v_losing jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
  v_score integer;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aefc314_manager_categories();
  v_score := public._aefc314_outlook_score(v_company_id);

  for v_row in
    select o.* from public.app_portal_executive_foresight_observations o
    where o.company_id = v_company_id
      and (v_can_full or o.category = any(v_manager_cats))
      and (p_category is null or o.category = p_category)
      and (p_time_horizon is null or o.time_horizon = p_time_horizon)
      and (p_strategic_priority is null or o.strategic_priority = p_strategic_priority)
      and (p_organizational_area is null or o.organizational_area = p_organizational_area)
      and (p_executive_owner is null or o.executive_owner ilike '%' || trim(p_executive_owner) || '%')
      and (p_review_status is null or o.review_status = p_review_status)
      and (p_period_from is null or o.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or o.title ilike '%' || trim(p_search) || '%' or o.summary ilike '%' || trim(p_search) || '%')
    order by case o.strategic_priority when 'strategic' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end, o.updated_at desc
  loop
    v_obs := v_obs || public._aefc314_observation_card(v_row);
    v_total := v_total + 1;
    if v_row.insight_type in ('opportunity', 'momentum_gain') then
      v_opportunities := v_opportunities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.insight_type in ('blind_spot', 'dependency') or v_row.momentum_direction = 'losing' then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.review_status in ('pending', 'needs_follow_up') and v_row.strategic_priority in ('high', 'strategic') then
      v_attention := v_attention || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.strategic_priority = 'strategic' then
      v_focus := v_focus || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.momentum_direction = 'gaining' then
      v_gaining := v_gaining || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    elsif v_row.momentum_direction = 'losing' then
      v_losing := v_losing || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'can_note', coalesce(v_ctx->>'can_note', 'false') = 'true',
    'has_foresight_data', v_total > 0,
    'executive_outlook_score', v_score,
    'executive_summary', case
      when v_total = 0 then 'No executive foresight insights are available yet.'
      when v_score >= 70 and jsonb_array_length(v_opportunities) >= 2 then 'Several strategic opportunities may warrant exploration.'
      when v_score >= 65 then 'Current indicators suggest strong organizational stability.'
      when exists (select 1 from public.app_portal_executive_foresight_observations o where o.company_id = v_company_id and o.category = 'leadership_development') then
        'Leadership capacity planning should be reviewed.'
      when jsonb_array_length(v_opportunities) > 0 then 'Market conditions may create future opportunities.'
      else 'Current indicators suggest balanced long-term preparedness.'
    end,
    'emerging_opportunities', v_opportunities,
    'emerging_risks', v_risks,
    'strategic_topics_requiring_attention', v_attention,
    'long_term_focus_areas', v_focus,
    'areas_gaining_momentum', v_gaining,
    'areas_losing_momentum', v_losing,
    'recommended_conversations', public._aefc314_recommended_conversations(v_company_id),
    'executive_questions', public._aefc314_executive_questions(),
    'foresight_advisory_note', 'All foresight insights are advisory — Aipify never claims certainty regarding future outcomes.',
    'observations', v_obs,
    'recommendations', public._aefc314_build_recommendations(v_company_id),
    'principle', 'Executive foresight encourages long-term thinking — final strategic decisions remain with leadership.'
  );
end;
$$;

create or replace function public.get_app_portal_executive_foresight_observation(p_observation_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_notes jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aefc314_manager_categories();

  select o.* into v_row from public.app_portal_executive_foresight_observations o
  where o.company_id = v_company_id and o.id = p_observation_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This foresight observation is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_type', r.review_type, 'review_notes', r.review_notes, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_executive_foresight_reviews r
  where r.company_id = v_company_id and r.observation_id = p_observation_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'note_text', n.note_text, 'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb)
  into v_notes
  from public.app_portal_executive_foresight_notes n
  where n.company_id = v_company_id and n.observation_id = p_observation_id;

  return public._aefc314_observation_card(v_row) || jsonb_build_object(
    'found', true,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'can_note', coalesce(v_ctx->>'can_note', 'false') = 'true',
    'reviews', v_reviews,
    'notes', v_notes,
    'advisory_note', 'Foresight insights support preparedness — not certainty about future outcomes.'
  );
end;
$$;

create or replace function public.get_app_portal_executive_foresight_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  return jsonb_build_object('found', true, 'recommendations', public._aefc314_build_recommendations(v_company_id));
end;
$$;

create or replace function public.get_app_portal_executive_foresight_timeline(
  p_observation_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'observation_id', t.observation_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_executive_foresight_timeline t
    where t.company_id = v_company_id
      and (p_observation_id is null or t.observation_id = p_observation_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.list_app_portal_strategic_opportunities(
  p_category         text    default null,
  p_status           text    default null,
  p_department       text    default null,
  p_strategic_priority text  default null,
  p_executive_owner  text    default null,
  p_time_horizon     text    default null,
  p_period_from      date    default null,
  p_search           text    default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_opps jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_high_potential jsonb := '[]'::jsonb;
  v_under_review   jsonb := '[]'::jsonb;
  v_in_progress    jsonb := '[]'::jsonb;
  v_realized       jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
  v_score integer;
begin
  v_ctx        := public._asoi315_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._asoi315_manager_categories();
  v_score := public._asoi315_health_score(v_company_id);

  for v_row in
    select o.* from public.app_portal_strategic_opportunities o
    where o.company_id = v_company_id
      and (v_can_full or o.category = any(v_mgr_cats))
      and (p_category         is null or o.category = p_category)
      and (p_status           is null or o.status = p_status)
      and (p_strategic_priority is null or o.strategic_priority = p_strategic_priority)
      and (p_executive_owner  is null or o.leadership_owner ilike '%'||trim(p_executive_owner)||'%')
      and (p_time_horizon     is null or o.time_horizon = p_time_horizon)
      and (p_department       is null or o.related_departments::text ilike '%'||trim(p_department)||'%')
      and (p_period_from      is null or o.updated_at::date >= p_period_from)
      and (p_search           is null or trim(p_search) = ''
           or o.title ilike '%'||trim(p_search)||'%'
           or o.description ilike '%'||trim(p_search)||'%')
    order by
      case o.strategic_priority when 'strategic' then 1 when 'high' then 2
                                 when 'moderate' then 3 else 4 end,
      case o.status when 'in_progress' then 1 when 'approved' then 2
                    when 'planning' then 3 when 'under_review' then 4 else 5 end,
      o.updated_at desc
  loop
    v_opps  := v_opps  || public._asoi315_opportunity_card(v_row);
    v_total := v_total + 1;
    if v_row.strategic_priority in ('high','strategic') and v_row.status not in ('completed','archived') then
      v_high_potential := v_high_potential || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end if;
    if v_row.status = 'under_review' then
      v_under_review := v_under_review || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end if;
    if v_row.status = 'in_progress' then
      v_in_progress := v_in_progress || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end if;
    if v_row.status = 'completed' then
      v_realized := v_realized || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end if;
  end loop;

  return jsonb_build_object(
    'found',                   true,
    'can_full',                v_can_full,
    'can_view',                coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',              coalesce(v_ctx->>'can_review','false') = 'true',
    'can_create',              coalesce(v_ctx->>'can_create','false') = 'true',
    'has_opportunity_data',    v_total > 0,
    'opportunity_health_score', v_score,
    'executive_summary', case
      when v_total = 0 then 'No strategic opportunities have been identified yet.'
      when jsonb_array_length(v_in_progress) > 0 then
        'Several opportunities are actively in progress — leadership follow-up supports momentum.'
      when jsonb_array_length(v_high_potential) >= 3 then
        'Several high-potential opportunities exist to improve performance and create new value.'
      when jsonb_array_length(v_under_review) > 0 then
        'Opportunities under review may benefit from executive prioritization.'
      else 'Current conditions may support exploration of strategic initiatives.'
    end,
    'high_potential_opportunities',    v_high_potential,
    'opportunities_requiring_exploration',
      (select coalesce(jsonb_agg(jsonb_build_object('id',o2.id,'title',o2.title)),'[]'::jsonb)
       from public.app_portal_strategic_opportunities o2
       where o2.company_id = v_company_id and o2.status = 'identified'
         and (v_can_full or o2.category = any(v_mgr_cats))),
    'opportunities_under_review',      v_under_review,
    'opportunities_in_progress',       v_in_progress,
    'opportunities_realized',          v_realized,
    'advisory_note',
      'Aipify suggests opportunities but never makes decisions — final decisions remain with leadership.',
    'opportunities',                   v_opps,
    'recommendations',                 public._asoi315_build_recommendations(v_company_id),
    'principle',
      'Proactive opportunity identification supports sustainable growth — humans decide what to pursue.'
  );
end; $$;

create or replace function public.get_app_portal_strategic_opportunity(p_opportunity_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._asoi315_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._asoi315_manager_categories();

  select o.* into v_row
  from public.app_portal_strategic_opportunities o
  where o.company_id = v_company_id and o.id = p_opportunity_id;
  if not found then return jsonb_build_object('found',false); end if;
  if not v_can_full and not (v_row.category = any(v_mgr_cats)) then
    raise exception 'This opportunity is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',r.id,'review_notes',r.review_notes,
    'new_status',r.new_status,'reviewed_at',r.reviewed_at
  ) order by r.reviewed_at desc),'[]'::jsonb)
  into v_reviews
  from public.app_portal_strategic_opportunity_reviews r
  where r.company_id = v_company_id and r.opportunity_id = p_opportunity_id;

  return public._asoi315_opportunity_card(v_row) || jsonb_build_object(
    'found',          true,
    'can_review',     coalesce(v_ctx->>'can_review','false') = 'true',
    'can_create',     coalesce(v_ctx->>'can_create','false') = 'true',
    'reviews',        v_reviews,
    'supporting_observations', v_row.supporting_observations,
    'advisory_note',
      'Opportunity insights support decision-making — humans decide what to pursue.'
  );
end; $$;

create or replace function public.get_app_portal_strategic_opportunity_timeline(
  p_opportunity_id uuid  default null,
  p_period_from    date  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._asoi315_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(r order by r->>'created_at' desc),'[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id',t.id,'opportunity_id',t.opportunity_id,
      'event_type',t.event_type,'description',t.description,'created_at',t.created_at
    ) as r
    from public.app_portal_strategic_opportunity_timeline t
    where t.company_id = v_company_id
      and (p_opportunity_id is null or t.opportunity_id = p_opportunity_id)
      and (p_period_from    is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 30
  ) sub;

  return jsonb_build_object('found',true,'events',v_events);
end; $$;

create or replace function public.list_app_portal_org_forecasting(
  p_category         text  default null,
  p_department       text  default null,
  p_time_horizon     text  default null,
  p_confidence_level text  default null,
  p_executive_owner  text  default null,
  p_review_status    text  default null,
  p_period_from      date  default null,
  p_search           text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_forecasts jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_improving jsonb := '[]'::jsonb; v_stable jsonb := '[]'::jsonb;
  v_declining jsonb := '[]'::jsonb; v_emerging jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
  v_score integer; v_capacity jsonb;
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aofc316_manager_categories();
  v_score := public._aofc316_forecast_score(v_company_id);

  -- capacity snapshot
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'area',c.area,'current_capacity',c.current_capacity,
    'estimated_future_capacity',c.estimated_future_capacity,
    'potential_bottlenecks',c.potential_bottlenecks,
    'operational_constraints',c.operational_constraints,
    'requires_attention',c.requires_attention)),'[]'::jsonb)
  into v_capacity
  from public.app_portal_org_forecasting_capacity c
  where c.company_id = v_company_id;

  for v_row in
    select f.* from public.app_portal_org_forecasts f
    where f.company_id = v_company_id
      and (v_can_full or f.category = any(v_mgr_cats))
      and (p_category         is null or f.category = p_category)
      and (p_time_horizon     is null or f.time_horizon = p_time_horizon)
      and (p_confidence_level is null or f.confidence_level = p_confidence_level)
      and (p_review_status    is null or f.review_status = p_review_status)
      and (p_executive_owner  is null or f.leadership_owner ilike '%'||trim(p_executive_owner)||'%')
      and (p_department       is null or f.forecast_area ilike '%'||trim(p_department)||'%')
      and (p_period_from      is null or f.updated_at::date >= p_period_from)
      and (p_search           is null or trim(p_search) = ''
           or f.title ilike '%'||trim(p_search)||'%'
           or f.description ilike '%'||trim(p_search)||'%')
    order by
      case f.trend_direction when 'declining' then 1 when 'emerging' then 2
                             when 'stable' then 3 else 4 end,
      f.updated_at desc
  loop
    v_forecasts := v_forecasts || public._aofc316_forecast_card(v_row);
    v_total     := v_total + 1;
    case v_row.trend_direction
      when 'improving' then v_improving := v_improving || jsonb_build_object('id',v_row.id,'title',v_row.title);
      when 'declining' then v_declining := v_declining || jsonb_build_object('id',v_row.id,'title',v_row.title);
      when 'emerging'  then v_emerging  := v_emerging  || jsonb_build_object('id',v_row.id,'title',v_row.title);
      else                 v_stable     := v_stable     || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end case;
  end loop;

  return jsonb_build_object(
    'found',                  true,
    'can_full',               v_can_full,
    'can_view',               coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',             coalesce(v_ctx->>'can_review','false') = 'true',
    'has_forecast_data',      v_total > 0,
    'organizational_forecast_score', v_score,
    'executive_summary', case
      when v_total = 0 then 'No forecasting data is available yet.'
      when jsonb_array_length(v_declining) > 0 then
        'Operational capacity should be reviewed before expansion initiatives.'
      when jsonb_array_length(v_emerging) >= 2 then
        'Support demand may increase if current customer growth continues.'
      when v_score >= 70 then
        'Current trends suggest moderate growth over the coming months.'
      else
        'Additional workforce planning may be beneficial.'
    end,
    'growth_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'workforce_growth' limit 1),
    'capacity_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'operational_capacity' limit 1),
    'workforce_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'workforce_growth' limit 1),
    'customer_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'customer_growth' limit 1),
    'revenue_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'revenue_development' limit 1),
    'support_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'support_demand' limit 1),
    'improving_trends',       v_improving,
    'stable_trends',          v_stable,
    'declining_trends',       v_declining,
    'emerging_trends',        v_emerging,
    'capacity_assessments',   v_capacity,
    'forecasts',              v_forecasts,
    'advisory_note',
      'Forecasts are projections designed to support planning — not guarantees of future outcomes.',
    'principle',
      'Organizational forecasting improves preparedness — final decisions remain with leadership.'
  );
end; $$;

create or replace function public.get_app_portal_org_forecast(p_forecast_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aofc316_manager_categories();

  select f.* into v_row from public.app_portal_org_forecasts f
  where f.company_id = v_company_id and f.id = p_forecast_id;
  if not found then return jsonb_build_object('found',false); end if;
  if not v_can_full and not (v_row.category = any(v_mgr_cats)) then
    raise exception 'This forecast is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',r.id,'review_notes',r.review_notes,'reviewed_at',r.reviewed_at
  ) order by r.reviewed_at desc),'[]'::jsonb)
  into v_reviews
  from public.app_portal_org_forecasting_reviews r
  where r.company_id = v_company_id and r.forecast_id = p_forecast_id;

  return public._aofc316_forecast_card(v_row) || jsonb_build_object(
    'found',      true,
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'reviews',    v_reviews,
    'advisory_note',
      'This forecast is a projection to support planning — not a certainty about future events.'
  );
end; $$;

create or replace function public.get_app_portal_org_forecasting_trends()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid;
  v_improving jsonb := '[]'::jsonb;
  v_stable    jsonb := '[]'::jsonb;
  v_declining jsonb := '[]'::jsonb;
  v_emerging  jsonb := '[]'::jsonb;
  v_row record;
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  for v_row in
    select f.id, f.title, f.trend_direction, f.category
    from public.app_portal_org_forecasts f
    where f.company_id = v_company_id
  loop
    case v_row.trend_direction
      when 'improving' then v_improving := v_improving || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
      when 'declining' then v_declining := v_declining || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
      when 'emerging'  then v_emerging  := v_emerging  || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
      else                 v_stable     := v_stable     || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
    end case;
  end loop;

  return jsonb_build_object(
    'found',true,
    'improving',v_improving,'stable',v_stable,
    'declining',v_declining,'emerging',v_emerging);
end; $$;

create or replace function public.get_app_portal_org_forecasting_capacity()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_capacity jsonb;
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'area',c.area,
    'current_capacity',c.current_capacity,
    'estimated_future_capacity',c.estimated_future_capacity,
    'potential_bottlenecks',c.potential_bottlenecks,
    'operational_constraints',c.operational_constraints,
    'requires_attention',c.requires_attention)),'[]'::jsonb)
  into v_capacity
  from public.app_portal_org_forecasting_capacity c
  where c.company_id = v_company_id;

  return jsonb_build_object('found',true,'capacity',v_capacity);
end; $$;

create or replace function public.list_app_portal_enterprise_readiness(
  p_category       text  default null,
  p_readiness_level text default null,
  p_priority       text  default null,
  p_department     text  default null,
  p_owner          text  default null,
  p_review_status  text  default null,
  p_period_from    date  default null,
  p_search         text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_assessments jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_score integer; v_can_full boolean; v_mgr_cats text[];
  v_gaps jsonb;
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aerc317_manager_categories();
  v_score := public._aerc317_overall_score(v_company_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',g.id,'gap_key',g.gap_key,'title',g.title,'description',g.description,
    'impact_level',g.impact_level,'recommended_action',g.recommended_action,
    'suggested_owner',g.suggested_owner,'review_timeline',g.review_timeline,'status',g.status
  )),'[]'::jsonb) into v_gaps
  from public.app_portal_enterprise_readiness_gaps g
  where g.company_id = v_company_id and v_can_full;

  for v_row in
    select a.* from public.app_portal_enterprise_readiness_assessments a
    where a.company_id = v_company_id
      and (v_can_full or a.category = any(v_mgr_cats))
      and (p_category       is null or a.category = p_category)
      and (p_readiness_level is null or a.readiness_level = p_readiness_level)
      and (p_priority       is null or a.priority = p_priority)
      and (p_department     is null or a.department ilike '%'||trim(p_department)||'%')
      and (p_owner          is null or a.leadership_owner ilike '%'||trim(p_owner)||'%')
      and (p_review_status  is null or a.review_status = p_review_status)
      and (p_period_from    is null or a.updated_at::date >= p_period_from)
      and (p_search         is null or trim(p_search) = ''
           or a.title ilike '%'||trim(p_search)||'%'
           or a.description ilike '%'||trim(p_search)||'%')
    order by
      case a.priority when 'critical' then 1 when 'high' then 2
                      when 'moderate' then 3 else 4 end,
      a.current_score asc
  loop
    v_assessments := v_assessments || public._aerc317_assessment_card(v_row);
    v_total := v_total + 1;
  end loop;

  return jsonb_build_object(
    'found',                    true,
    'can_full',                 v_can_full,
    'can_view',                 coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',               coalesce(v_ctx->>'can_review','false') = 'true',
    'can_assess',               coalesce(v_ctx->>'can_assess','false') = 'true',
    'has_assessment_data',      v_total > 0,
    'enterprise_readiness_score', v_score,
    'readiness_level',          public._aerc317_score_to_level(v_score),
    'executive_summary', case
      when v_total = 0 then 'No readiness assessments have been completed yet.'
      when v_score >= 75 then 'Operational readiness is strong.'
      when exists (select 1 from public.app_portal_enterprise_readiness_assessments a
                   where a.company_id = v_company_id and a.priority = 'critical') then
        'Security and compliance processes should be reviewed before expansion.'
      when exists (select 1 from public.app_portal_enterprise_readiness_assessments a
                   where a.company_id = v_company_id and a.category = 'governance'
                     and a.current_score < 65) then
        'Governance maturity may require additional investment.'
      when v_score >= 60 then
        'Current readiness levels support moderate growth.'
      else
        'Readiness improvements are recommended before significant expansion.'
    end,
    'operational_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'operations' limit 1),
    'leadership_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'leadership' limit 1),
    'workforce_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'workforce' limit 1),
    'technology_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'technology' limit 1),
    'security_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'security' limit 1),
    'compliance_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'compliance' limit 1),
    'growth_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'governance' limit 1),
    'gaps',                     v_gaps,
    'assessments',              v_assessments,
    'recommendations',          public._aerc317_build_recommendations(v_company_id),
    'advisory_note',
      'Readiness scores are guidance tools, not certifications. Final decisions remain with leadership.',
    'principle',
      'Enterprise readiness improves preparedness for growth — Aipify advises; leadership decides.'
  );
end; $$;

create or replace function public.get_app_portal_enterprise_readiness_assessment(p_assessment_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aerc317_manager_categories();

  select a.* into v_row
  from public.app_portal_enterprise_readiness_assessments a
  where a.company_id = v_company_id and a.id = p_assessment_id;
  if not found then return jsonb_build_object('found',false); end if;
  if not v_can_full and not (v_row.category = any(v_mgr_cats)) then
    raise exception 'This readiness assessment is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',r.id,'review_notes',r.review_notes,
    'new_score',r.new_score,'reviewed_at',r.reviewed_at
  ) order by r.reviewed_at desc),'[]'::jsonb)
  into v_reviews
  from public.app_portal_enterprise_readiness_reviews r
  where r.company_id = v_company_id and r.assessment_id = p_assessment_id;

  return public._aerc317_assessment_card(v_row) || jsonb_build_object(
    'found',      true,
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'can_assess', coalesce(v_ctx->>'can_assess','false') = 'true',
    'reviews',    v_reviews,
    'advisory_note','Readiness scores are guidance tools, not formal certifications.'
  );
end; $$;

create or replace function public.get_app_portal_enterprise_readiness_gaps()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_gaps jsonb;
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',g.id,'gap_key',g.gap_key,'title',g.title,'description',g.description,
    'impact_level',g.impact_level,'recommended_action',g.recommended_action,
    'suggested_owner',g.suggested_owner,'review_timeline',g.review_timeline,'status',g.status
  ) order by case g.impact_level when 'critical' then 1 when 'high' then 2
                                 when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_gaps
  from public.app_portal_enterprise_readiness_gaps g
  where g.company_id = v_company_id;

  return jsonb_build_object('found',true,'gaps',v_gaps);
end; $$;

create or replace function public.get_app_portal_enterprise_readiness_recommendations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid;
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  return jsonb_build_object('found',true,
    'recommendations',public._aerc317_build_recommendations(v_company_id));
end; $$;

create or replace function public.list_app_portal_cross_functional_intelligence(
  p_department     text  default null,
  p_team           text  default null,
  p_dependency_type text default null,
  p_risk_level     text  default null,
  p_priority       text  default null,
  p_review_status  text  default null,
  p_search         text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_deps jsonb; v_collab jsonb; v_friction jsonb;
  v_health integer; v_collab_score integer;
  v_dep_score integer; v_proc_score integer;
  v_attention jsonb := '[]'::jsonb; v_opportunities jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._acfi318_manager_categories();

  v_health      := public._acfi318_health_score(v_company_id);
  v_collab_score := public._acfi318_collaboration_score(v_company_id);
  v_dep_score   := public._acfi318_dependency_score(v_company_id);
  v_proc_score  := public._acfi318_process_alignment_score(v_company_id);

  -- dependencies
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',d.id,'dependency_key',d.dependency_key,
    'from_department',d.from_department,'to_department',d.to_department,
    'dependency_type',d.dependency_type,'dependency_strength',d.dependency_strength,
    'risk_level',d.risk_level,'review_status',d.review_status,
    'leadership_owner',d.leadership_owner,'description',d.description,
    'recommended_review',d.recommended_review
  ) order by case d.risk_level when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_deps
  from public.app_portal_cfi_dependencies d
  where d.company_id = v_company_id
    and (p_department   is null or d.from_department ilike '%'||trim(p_department)||'%'
         or d.to_department ilike '%'||trim(p_department)||'%')
    and (p_dependency_type is null or d.dependency_type = p_dependency_type)
    and (p_risk_level   is null or d.risk_level = p_risk_level)
    and (p_review_status is null or d.review_status = p_review_status)
    and (p_search        is null or trim(p_search) = ''
         or d.from_department ilike '%'||trim(p_search)||'%'
         or d.to_department ilike '%'||trim(p_search)||'%'
         or d.description ilike '%'||trim(p_search)||'%');

  -- collaboration
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'collaboration_key',c.collaboration_key,
    'department_a',c.department_a,'department_b',c.department_b,
    'category',c.category,'collaboration_type',c.collaboration_type,
    'health_status',c.health_status,'description',c.description,
    'improvement_opportunity',c.improvement_opportunity,
    'priority',c.priority,'leadership_owner',c.leadership_owner
  ) order by case c.health_status when 'high_priority' then 1 when 'needs_attention' then 2
                                   when 'stable' then 3 else 4 end),'[]'::jsonb)
  into v_collab
  from public.app_portal_cfi_collaboration c
  where c.company_id = v_company_id
    and (v_can_full or c.category = any(v_mgr_cats))
    and (p_department is null
         or c.department_a ilike '%'||trim(p_department)||'%'
         or c.department_b ilike '%'||trim(p_department)||'%')
    and (p_priority   is null or c.priority = p_priority)
    and (p_search     is null or trim(p_search) = ''
         or c.department_a ilike '%'||trim(p_search)||'%'
         or c.department_b ilike '%'||trim(p_search)||'%'
         or c.description ilike '%'||trim(p_search)||'%');

  -- friction
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',f.id,'friction_key',f.friction_key,'title',f.title,
    'friction_type',f.friction_type,'description',f.description,
    'affected_departments',f.affected_departments,'severity',f.severity,
    'recommended_action',f.recommended_action,'status',f.status
  ) order by case f.severity when 'critical' then 1 when 'high' then 2
                             when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_friction
  from public.app_portal_cfi_friction f
  where f.company_id = v_company_id
    and (p_search is null or trim(p_search) = ''
         or f.title ilike '%'||trim(p_search)||'%'
         or f.description ilike '%'||trim(p_search)||'%');

  -- areas requiring attention
  select coalesce(jsonb_agg(jsonb_build_object('id',c2.id,'title',
    c2.department_a||' ↔ '||c2.department_b)),'[]'::jsonb)
  into v_attention
  from public.app_portal_cfi_collaboration c2
  where c2.company_id = v_company_id
    and c2.health_status in ('needs_attention','high_priority');

  -- improvement opportunities
  select coalesce(jsonb_agg(jsonb_build_object('id',c3.id,'title',
    c3.improvement_opportunity)),'[]'::jsonb)
  into v_opportunities
  from public.app_portal_cfi_collaboration c3
  where c3.company_id = v_company_id
    and c3.collaboration_type in ('emerging','weak')
    and c3.improvement_opportunity <> '';

  return jsonb_build_object(
    'found',                       true,
    'can_full',                    v_can_full,
    'can_view',                    coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',                  coalesce(v_ctx->>'can_review','false') = 'true',
    'has_intelligence_data',       v_deps <> '[]'::jsonb,
    'cross_functional_health_score', v_health,
    'department_collaboration_score', v_collab_score,
    'organizational_dependency_score', v_dep_score,
    'process_alignment_score',     v_proc_score,
    'executive_summary', case
      when v_deps = '[]'::jsonb then 'No cross-functional intelligence insights are available yet.'
      when v_health >= 75 then 'Cross-functional collaboration appears healthy.'
      when v_dep_score < 55 then
        'Certain organizational dependencies may create bottlenecks.'
      when v_collab_score < 60 then
        'Communication alignment may improve execution speed.'
      else 'Several departments are dependent on the same operational resources.'
    end,
    'areas_requiring_attention',   v_attention,
    'improvement_opportunities',   v_opportunities,
    'dependencies',                v_deps,
    'collaboration',               v_collab,
    'friction',                    v_friction,
    'recommendations',             public._acfi318_build_recommendations(v_company_id),
    'advisory_note',
      'Cross-functional insights are advisory — Aipify identifies patterns; leadership decides how to act.',
    'principle',
      'Understanding how teams work together improves performance — final decisions remain with leadership.'
  );
end; $$;

create or replace function public.get_app_portal_cfi_dependencies()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_deps jsonb;
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',d.id,'dependency_key',d.dependency_key,
    'from_department',d.from_department,'to_department',d.to_department,
    'dependency_type',d.dependency_type,'dependency_strength',d.dependency_strength,
    'risk_level',d.risk_level,'leadership_owner',d.leadership_owner,
    'description',d.description,'recommended_review',d.recommended_review
  )),'[]'::jsonb) into v_deps
  from public.app_portal_cfi_dependencies d where d.company_id = v_company_id;
  return jsonb_build_object('found',true,'dependencies',v_deps);
end; $$;

create or replace function public.get_app_portal_cfi_collaboration()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_collab jsonb;
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'collaboration_key',c.collaboration_key,
    'department_a',c.department_a,'department_b',c.department_b,
    'category',c.category,'collaboration_type',c.collaboration_type,
    'health_status',c.health_status,'description',c.description,
    'improvement_opportunity',c.improvement_opportunity,'priority',c.priority
  )),'[]'::jsonb) into v_collab
  from public.app_portal_cfi_collaboration c where c.company_id = v_company_id;
  return jsonb_build_object('found',true,'collaboration',v_collab);
end; $$;

create or replace function public.get_app_portal_cfi_friction()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_friction jsonb;
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',f.id,'friction_key',f.friction_key,'title',f.title,
    'friction_type',f.friction_type,'description',f.description,
    'affected_departments',f.affected_departments,'severity',f.severity,
    'recommended_action',f.recommended_action,'status',f.status
  )),'[]'::jsonb) into v_friction
  from public.app_portal_cfi_friction f where f.company_id = v_company_id;
  return jsonb_build_object('found',true,'friction',v_friction);
end; $$;

create or replace function public.get_app_portal_intelligence_command_center(
  p_category      text  default null,
  p_priority      text  default null,
  p_time_horizon  text  default null,
  p_department    text  default null,
  p_executive_owner text default null,
  p_review_status text  default null,
  p_search        text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_scores jsonb; v_priorities jsonb; v_overall integer;
  v_can_full boolean;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_scores := public._aeicc319_aggregate_scores(v_company_id);
  v_overall := coalesce((v_scores->>'overall')::integer, 60);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',p.id,'priority_key',p.priority_key,'title',p.title,
    'source_module',p.source_module,'priority_level',p.priority_level,
    'category',p.category,'time_horizon',p.time_horizon,
    'recommended_action',p.recommended_action,'review_status',p.review_status
  ) order by
    case p.priority_level when 'critical' then 1 when 'high' then 2
                          when 'medium' then 3 else 4 end,
    p.created_at desc),'[]'::jsonb)
  into v_priorities
  from public.app_portal_eicc_priorities p
  where p.company_id = v_company_id
    and (p_category     is null or p.category ilike '%'||trim(p_category)||'%')
    and (p_priority     is null or p.priority_level = p_priority)
    and (p_time_horizon is null or p.time_horizon = p_time_horizon)
    and (p_review_status is null or p.review_status = p_review_status)
    and (p_search       is null or trim(p_search) = ''
         or p.title ilike '%'||trim(p_search)||'%'
         or p.recommended_action ilike '%'||trim(p_search)||'%');

  return jsonb_build_object(
    'found',                       true,
    'can_full',                    v_can_full,
    'can_view',                    coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',                  coalesce(v_ctx->>'can_review','false') = 'true',
    'has_intelligence_data',       v_overall > 0,
    'enterprise_intelligence_score', v_overall,
    'executive_health_score',      coalesce((v_scores->>'foresight')::integer,60),
    'organizational_readiness_score', coalesce((v_scores->>'readiness')::integer,60),
    'strategic_opportunity_score', coalesce((v_scores->>'opportunities')::integer,60),
    'forecast_confidence_score',   coalesce((v_scores->>'forecasting')::integer,60),
    'collaboration_health_score',  coalesce((v_scores->>'cfi')::integer,60),
    'future_preparedness_score',   coalesce((v_scores->>'scenario')::integer,60),
    'module_scores',               v_scores,
    'executive_summary', case
      when v_overall >= 72 then
        'Current intelligence indicates strong organizational performance with opportunities for targeted improvement.'
      when (v_scores->>'readiness')::integer < 60 then
        'Current intelligence indicates growth readiness improvements are recommended before significant expansion.'
      when (v_scores->>'cfi')::integer < 55 then
        'Current intelligence indicates cross-functional alignment may benefit from leadership attention.'
      else
        'Current intelligence indicates stable organizational performance with emerging areas for strategic focus.'
    end,
    'key_observations', jsonb_build_array(
      'Enterprise readiness is at level '||(v_scores->>'readiness'),
      'Cross-functional health score: '||(v_scores->>'cfi'),
      'Strategic opportunity momentum: '||(v_scores->>'opportunities'),
      'Organizational forecast confidence: '||(v_scores->>'forecasting')
    ),
    'priorities',                  v_priorities,
    'outlook', jsonb_build_object(
      '30_days',  'Short-term priorities identified from readiness and predictive modules.',
      '90_days',  'Medium-term: governance reviews and workforce capacity alignment.',
      '6_months', 'Strategic opportunity exploration and readiness gap remediation.',
      '12_months','Leadership planning and organizational scaling preparation.',
      '24_months','Long-term organizational development and enterprise-readiness milestone.'
    ),
    'intelligence_sources', jsonb_build_array(
      jsonb_build_object('key','enterprise_benchmarking','label','Enterprise Benchmarking','score',v_scores->>'benchmarking','route','/app/intelligence/benchmarking'),
      jsonb_build_object('key','predictive_intelligence','label','Predictive Intelligence','score',v_scores->>'predictive','route','/app/intelligence/predictive'),
      jsonb_build_object('key','scenario_planning','label','Scenario Planning','score',v_scores->>'scenario','route','/app/intelligence/scenario-planning'),
      jsonb_build_object('key','executive_foresight','label','Executive Foresight','score',v_scores->>'foresight','route','/app/intelligence/executive-foresight'),
      jsonb_build_object('key','strategic_opportunities','label','Strategic Opportunities','score',v_scores->>'opportunities','route','/app/intelligence/strategic-opportunities'),
      jsonb_build_object('key','organizational_forecasting','label','Organizational Forecasting','score',v_scores->>'forecasting','route','/app/intelligence/organizational-forecasting'),
      jsonb_build_object('key','enterprise_readiness','label','Enterprise Readiness','score',v_scores->>'readiness','route','/app/intelligence/enterprise-readiness'),
      jsonb_build_object('key','cross_functional_intelligence','label','Cross-Functional Intelligence','score',v_scores->>'cfi','route','/app/intelligence/cross-functional-intelligence')
    ),
    'advisory_note',
      'The Intelligence Command Center aggregates insights from all intelligence modules — Aipify advises; leadership decides.',
    'principle',
      'One place for leadership visibility — high signal, low noise.'
  );
end; $$;

create or replace function public.get_app_portal_intelligence_briefing(
  p_period text default 'this_week'
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_scores jsonb; v_briefing jsonb;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_scores  := public._aeicc319_aggregate_scores(v_company_id);
  v_briefing := public._aeicc319_generate_briefing(v_company_id, v_scores, coalesce(p_period,'this_week'));
  return jsonb_build_object('found',true,'briefing',v_briefing);
end; $$;

create or replace function public.get_app_portal_intelligence_priorities(
  p_priority_level text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_priorities jsonb;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',p.id,'priority_key',p.priority_key,'title',p.title,
    'source_module',p.source_module,'priority_level',p.priority_level,
    'category',p.category,'recommended_action',p.recommended_action,
    'review_status',p.review_status
  ) order by
    case p.priority_level when 'critical' then 1 when 'high' then 2
                          when 'medium' then 3 else 4 end),'[]'::jsonb)
  into v_priorities
  from public.app_portal_eicc_priorities p
  where p.company_id = v_company_id
    and (p_priority_level is null or p.priority_level = p_priority_level);

  return jsonb_build_object('found',true,'priorities',v_priorities);
end; $$;

create or replace function public.get_app_portal_intelligence_command_center_timeline(
  p_period_from date default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',t.id,'event_type',t.event_type,'source_module',t.source_module,
    'description',t.description,'created_at',t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_events
  from public.app_portal_eicc_timeline t
  where t.company_id = v_company_id
    and (p_period_from is null or t.created_at::date >= p_period_from)
  limit 30;

  return jsonb_build_object('found',true,'events',v_events);
end; $$;

create or replace function public.list_app_portal_future_state_planning(
  p_category          text default null,
  p_department        text default null,
  p_strategic_priority text default null,
  p_time_horizon      text default null,
  p_executive_owner   text default null,
  p_status            text default null,
  p_search            text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_plans jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_active jsonb := '[]'::jsonb; v_reviews jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._afs320_manager_categories();

  for v_row in
    select p.* from public.app_portal_future_state_plans p
    where p.company_id = v_company_id
      and (v_can_full or p.category = any(v_mgr_cats))
      and (p_category is null or p.category = p_category)
      and (p_status is null or p.status = p_status)
      and (p_strategic_priority is null or p.strategic_priority = p_strategic_priority)
      and (p_time_horizon is null or p.time_horizon = p_time_horizon)
      and (p_executive_owner is null or p.executive_owner ilike '%'||trim(p_executive_owner)||'%')
      and (p_department is null or p.department ilike '%'||trim(p_department)||'%'
           or p.departments_involved::text ilike '%'||trim(p_department)||'%')
      and (p_search is null or trim(p_search) = ''
           or p.title ilike '%'||trim(p_search)||'%'
           or p.description ilike '%'||trim(p_search)||'%'
           or p.vision_statement ilike '%'||trim(p_search)||'%')
    order by
      case p.strategic_priority when 'strategic' then 1 when 'high' then 2
                                 when 'moderate' then 3 else 4 end,
      p.updated_at desc
  loop
    v_plans := v_plans || public._afs320_plan_card(v_row);
    v_total := v_total + 1;
    if v_row.status in ('active','on_track','under_review') then
      v_active := v_active || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end if;
    if v_row.next_review_date is not null and v_row.next_review_date <= current_date + 30 then
      v_reviews := v_reviews || jsonb_build_object('id',v_row.id,'title',v_row.title,'date',v_row.next_review_date);
    end if;
  end loop;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view','false') = 'true',
    'can_create', coalesce(v_ctx->>'can_create','false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'has_plan_data', v_total > 0,
    'future_state_readiness_score', public._afs320_readiness_score(v_company_id),
    'strategic_alignment_score', public._afs320_alignment_score(v_company_id),
    'future_state_progress_score', public._afs320_progress_score(v_company_id),
    'planning_completeness_score', public._afs320_completeness_score(v_company_id),
    'executive_summary', case
      when v_total = 0 then 'No future-state plans have been created yet.'
      when public._afs320_alignment_score(v_company_id) >= 65 then
        'The organization has defined a clear future-state vision with strong alignment across departments.'
      when public._afs320_progress_score(v_company_id) >= 40 then
        'Several initiatives are progressing toward long-term objectives.'
      else 'Future-state planning would benefit from additional leadership ownership.'
    end,
    'active_plans', v_active,
    'upcoming_reviews', v_reviews,
    'plans', v_plans,
    'recommendations', public._afs320_build_recommendations(v_company_id),
    'advisory_note',
      'Aipify assists planning — leadership defines goals and future direction.',
    'principle',
      'Vision before execution. Strategy before tactics. Humans define the future state.'
  );
end; $$;

create or replace function public.get_app_portal_future_state_plan(p_plan_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_milestones jsonb; v_alignment jsonb; v_reviews jsonb;
  v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._afs320_manager_categories();

  select p.* into v_row
  from public.app_portal_future_state_plans p
  where p.company_id = v_company_id and p.id = p_plan_id;
  if not found then return jsonb_build_object('found',false); end if;
  if not v_can_full and not (v_row.category = any(v_mgr_cats)) then
    raise exception 'This plan is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',m.id,'milestone_key',m.milestone_key,'title',m.title,
    'description',m.description,'status',m.status,
    'target_date',m.target_date,'success_indicator',m.success_indicator,'owner',m.owner
  ) order by m.target_date nulls last),'[]'::jsonb)
  into v_milestones
  from public.app_portal_future_state_milestones m
  where m.company_id = v_company_id and m.plan_id = p_plan_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',a.id,'department',a.department,'current_alignment',a.current_alignment,
    'target_alignment',a.target_alignment,'progress',a.progress,
    'owner',a.owner,'review_date',a.review_date
  )),'[]'::jsonb)
  into v_alignment
  from public.app_portal_future_state_alignment a
  where a.company_id = v_company_id and a.plan_id = p_plan_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',r.id,'review_notes',r.review_notes,'reviewed_at',r.reviewed_at
  ) order by r.reviewed_at desc),'[]'::jsonb)
  into v_reviews
  from public.app_portal_future_state_reviews r
  where r.company_id = v_company_id and r.plan_id = p_plan_id;

  return public._afs320_plan_card(v_row) || jsonb_build_object(
    'found', true,
    'can_create', coalesce(v_ctx->>'can_create','false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'milestones', v_milestones,
    'alignment', v_alignment,
    'reviews', v_reviews,
    'advisory_note',
      'Future-state plans are organizational assets — leadership owns strategy and direction.'
  );
end; $$;

create or replace function public.get_app_portal_future_state_briefing()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_next_review date; v_opps jsonb; v_risks jsonb;
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;

  select min(p.next_review_date) into v_next_review
  from public.app_portal_future_state_plans p
  where p.company_id = v_company_id and p.status not in ('archived','completed');

  select coalesce(jsonb_agg(distinct opp),'[]'::jsonb) into v_opps
  from (
    select jsonb_array_elements_text(p.opportunities) as opp
    from public.app_portal_future_state_plans p
    where p.company_id = v_company_id and jsonb_array_length(p.opportunities) > 0
    limit 5
  ) s;

  select coalesce(jsonb_agg(distinct rk),'[]'::jsonb) into v_risks
  from (
    select jsonb_array_elements_text(p.risks) as rk
    from public.app_portal_future_state_plans p
    where p.company_id = v_company_id and jsonb_array_length(p.risks) > 0
    limit 5
  ) s;

  return jsonb_build_object(
    'found', true,
    'current_position',
      'Readiness '||public._afs320_readiness_score(v_company_id)||
      ' · Progress '||public._afs320_progress_score(v_company_id)||
      ' · Alignment '||public._afs320_alignment_score(v_company_id),
    'future_state_vision',
      coalesce((
        select p.vision_statement from public.app_portal_future_state_plans p
        where p.company_id = v_company_id and p.strategic_priority = 'strategic'
        order by p.updated_at desc limit 1
      ), 'Leadership may define a consolidated future-state vision across active plans.'),
    'progress_status', case
      when public._afs320_progress_score(v_company_id) >= 50 then 'Initiatives are advancing toward defined objectives.'
      else 'Planning foundations exist — milestone execution may benefit from executive focus.'
    end,
    'key_opportunities', v_opps,
    'key_risks', v_risks,
    'recommended_actions', public._afs320_build_recommendations(v_company_id),
    'next_review_date', v_next_review,
    'advisory_note', 'Briefings support planning — leadership defines strategy.'
  );
end; $$;

create or replace function public.list_app_portal_future_state_milestones(
  p_plan_id uuid default null,
  p_status  text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',m.id,'plan_id',m.plan_id,'plan_title',p.title,
    'title',m.title,'status',m.status,'target_date',m.target_date,
    'success_indicator',m.success_indicator,'owner',m.owner
  ) order by m.target_date nulls last),'[]'::jsonb)
  into v_events
  from public.app_portal_future_state_milestones m
  join public.app_portal_future_state_plans p on p.id = m.plan_id
  where m.company_id = v_company_id
    and (p_plan_id is null or m.plan_id = p_plan_id)
    and (p_status is null or m.status = p_status);

  return jsonb_build_object('found',true,'milestones',v_events);
end; $$;

create or replace function public.get_app_portal_future_state_timeline(
  p_plan_id uuid default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(r order by r->>'created_at' desc),'[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id',t.id,'plan_id',t.plan_id,'event_type',t.event_type,
      'description',t.description,'created_at',t.created_at
    ) as r
    from public.app_portal_future_state_timeline t
    where t.company_id = v_company_id
      and (p_plan_id is null or t.plan_id = p_plan_id)
    union all
    select jsonb_build_object(
      'id',m.id,'plan_id',m.plan_id,'event_type','milestone_'||m.status,
      'description',m.title,'created_at',coalesce(m.completed_at,m.created_at)
    )
    from public.app_portal_future_state_milestones m
    where m.company_id = v_company_id
      and (p_plan_id is null or m.plan_id = p_plan_id)
  ) sub;

  return jsonb_build_object('found',true,'timeline',v_events);
end; $$;

notify pgrst, 'reload schema';
