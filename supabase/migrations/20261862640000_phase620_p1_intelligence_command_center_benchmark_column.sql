-- Phase 620 P1 — Intelligence Command Center aggregate uses canonical benchmarking column.

create or replace function public._aeicc319_aggregate_scores(p_company_id uuid)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  v_benchmarking_score  integer := 0;
  v_predictive_score    integer := 0;
  v_scenario_score      integer := 0;
  v_foresight_score     integer := 0;
  v_opportunities_score integer := 0;
  v_forecasting_score   integer := 0;
  v_readiness_score     integer := 0;
  v_cfi_score           integer := 0;
  v_count               integer := 0;
begin
  if to_regclass('public.app_portal_enterprise_benchmarking_state') is not null then
    select coalesce(round(avg(d.maturity_score)), 0) into v_benchmarking_score
    from public.app_portal_enterprise_benchmarking_dimensions d
    where d.company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if to_regclass('public.app_portal_predictive_intelligence_predictions') is not null then
    select case
      when count(*) filter (where potential_impact in ('high', 'critical')) > 2 then 55
      when count(*) filter (where potential_impact in ('high', 'critical')) > 0 then 65
      else 75
    end into v_predictive_score
    from public.app_portal_predictive_intelligence_predictions
    where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if to_regclass('public.app_portal_scenario_planning_scenarios') is not null then
    select case
      when count(*) filter (where planning_status = 'simulated') > 0 then 72
      when count(*) > 0 then 65
      else 60
    end into v_scenario_score
    from public.app_portal_scenario_planning_scenarios
    where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if to_regclass('public.app_portal_executive_foresight_observations') is not null then
    select case
      when count(*) filter (where momentum_direction = 'gaining') > 3 then 75
      when count(*) filter (where momentum_direction = 'losing') > 2 then 55
      else 65
    end into v_foresight_score
    from public.app_portal_executive_foresight_observations
    where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if to_regclass('public.app_portal_strategic_opportunities') is not null then
    select least(
      100,
      greatest(
        40,
        50
          + count(*) filter (where status in ('in_progress', 'approved')) * 5
          - count(*) filter (where status = 'archived') * 2
      )
    ) into v_opportunities_score
    from public.app_portal_strategic_opportunities
    where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if to_regclass('public.app_portal_org_forecasts') is not null then
    select least(
      100,
      greatest(
        40,
        55
          + count(*) filter (where trend_direction = 'improving') * 3
          - count(*) filter (where trend_direction = 'declining') * 4
      )
    ) into v_forecasting_score
    from public.app_portal_org_forecasts
    where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if to_regclass('public.app_portal_enterprise_readiness_assessments') is not null then
    select coalesce(round(avg(current_score))::integer, 55) into v_readiness_score
    from public.app_portal_enterprise_readiness_assessments
    where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if to_regclass('public.app_portal_cfi_collaboration') is not null then
    select least(
      100,
      greatest(
        40,
        60
          + count(*) filter (where collaboration_type = 'strong') * 5
          - count(*) filter (where health_status = 'high_priority') * 6
      )
    ) into v_cfi_score
    from public.app_portal_cfi_collaboration
    where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if v_count = 0 then
    return jsonb_build_object(
      'benchmarking', 60,
      'predictive', 60,
      'scenario', 60,
      'foresight', 60,
      'opportunities', 60,
      'forecasting', 60,
      'readiness', 60,
      'cfi', 60,
      'overall', 60
    );
  end if;

  return jsonb_build_object(
    'benchmarking', greatest(v_benchmarking_score, 40),
    'predictive', greatest(v_predictive_score, 40),
    'scenario', greatest(v_scenario_score, 40),
    'foresight', greatest(v_foresight_score, 40),
    'opportunities', greatest(v_opportunities_score, 40),
    'forecasting', greatest(v_forecasting_score, 40),
    'readiness', greatest(v_readiness_score, 40),
    'cfi', greatest(v_cfi_score, 40),
    'overall', (
      greatest(v_benchmarking_score, 40)
      + greatest(v_predictive_score, 40)
      + greatest(v_scenario_score, 40)
      + greatest(v_foresight_score, 40)
      + greatest(v_opportunities_score, 40)
      + greatest(v_forecasting_score, 40)
      + greatest(v_readiness_score, 40)
      + greatest(v_cfi_score, 40)
    ) / 8
  );
end;
$$;

notify pgrst, 'reload schema';
