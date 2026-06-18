-- Phase 437 fix — restore executive Organizational Health Center RPC (Phase 308)
-- and expose intelligence center under distinct RPC names.

drop function if exists public.get_organizational_health_center();
drop function if exists public.manage_organizational_health_item(text, uuid, text);

-- Intelligence center RPCs (Phase 437)
create or replace function public.get_organizational_health_intelligence_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_overview jsonb; v_risk jsonb; v_trends jsonb; v_team jsonb; v_customer jsonb;
  v_operational jsonb; v_financial jsonb; v_scores jsonb; v_signals jsonb;
  v_projects jsonb; v_warnings jsonb; v_interventions jsonb; v_predictive jsonb;
  v_overall_score numeric; v_overall_level text;
begin
  perform public._irp_require_permission('organizational_health.view');
  v_ctx := public._oh437_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._oh437_seed(v_org_id);

  select coalesce(round(avg(score_value)::numeric, 1), 0),
    case
      when coalesce(avg(score_value), 0) >= 85 then 'healthy'
      when coalesce(avg(score_value), 0) >= 70 then 'stable'
      when coalesce(avg(score_value), 0) >= 55 then 'requires_attention'
      else 'critical'
    end
  into v_overall_score, v_overall_level
  from public.organizational_health_category_scores where organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'category_key', c.category_key, 'score_value', c.score_value,
    'health_level', c.health_level, 'status_key', public._oh437_health_status(c.health_level),
    'contributing_factors', c.contributing_factors, 'item_type', 'score'
  ) order by c.category_key), '[]'::jsonb)
  into v_scores from public.organizational_health_category_scores c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_overview from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'health_overview';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_risk from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'risk_signals';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.trend_window, s.updated_at desc), '[]'::jsonb)
  into v_trends from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'performance_trends';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_team from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'team_health';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_customer from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'customer_health';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_operational from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'operational_health';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_financial from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'financial_health';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sig.id, 'signal_type', sig.signal_type, 'title', sig.title, 'summary', sig.summary,
    'status_key', sig.status_key, 'trend_pct_label', sig.trend_pct_label, 'item_type', 'signal'
  ) order by sig.created_at desc), '[]'::jsonb)
  into v_signals from public.organizational_health_signals sig
  where sig.organization_id = v_org_id and not sig.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'project_status', p.project_status,
    'timeline_health', p.timeline_health, 'dependency_health', p.dependency_health,
    'resource_health', p.resource_health, 'summary', p.summary, 'status_key', p.status_key,
    'item_type', 'project'
  ) order by p.updated_at desc), '[]'::jsonb)
  into v_projects from public.organizational_health_projects p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'warning_tier', w.warning_tier, 'title', w.title, 'summary', w.summary,
    'impact_level', w.impact_level, 'priority_rank', w.priority_rank,
    'status_key', w.status_key, 'item_type', 'warning'
  ) order by w.priority_rank), '[]'::jsonb)
  into v_warnings from public.organizational_health_warnings w
  where w.organization_id = v_org_id and not w.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'recommendation', i.recommendation, 'reason', i.reason,
    'intervention_type', i.intervention_type, 'status', i.status, 'item_type', 'intervention'
  ) order by i.created_at desc), '[]'::jsonb)
  into v_interventions from public.organizational_health_interventions i
  where i.organization_id = v_org_id and i.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_label', r.risk_label, 'probability', r.probability, 'impact', r.impact,
    'urgency', r.urgency, 'summary', r.summary, 'contributing_factors', r.contributing_factors,
    'status_key', r.status_key, 'item_type', 'predictive'
  ) order by r.created_at desc), '[]'::jsonb)
  into v_predictive from public.organizational_health_predictive_risks r where r.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Most problems do not appear overnight — signals exist long before a crisis. Aipify detects weak signals early so you can act before issues become expensive.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All health calculations are transparent, auditable, and explainable — contributing factors are always visible.',
    'organization_health_score', jsonb_build_object(
      'score_value', v_overall_score,
      'health_level', v_overall_level,
      'status_key', public._oh437_health_status(v_overall_level)
    ),
    'health_scores', v_scores,
    'early_warning_signals', v_signals,
    'sections', jsonb_build_object(
      'health_overview', v_overview,
      'risk_signals', v_risk,
      'performance_trends', v_trends,
      'team_health', v_team,
      'customer_health', v_customer,
      'operational_health', v_operational,
      'financial_health', v_financial
    ),
    'project_health', v_projects,
    'executive_warnings', v_warnings,
    'companion_interventions', v_interventions,
    'predictive_risks', v_predictive,
    'statistics', jsonb_build_object(
      'score_count', jsonb_array_length(v_scores),
      'signal_count', jsonb_array_length(v_signals),
      'warning_count', jsonb_array_length(v_warnings),
      'intervention_count', jsonb_array_length(v_interventions),
      'project_count', jsonb_array_length(v_projects),
      'predictive_count', jsonb_array_length(v_predictive)
    ),
    'privacy_note', 'Aggregated metadata and trend patterns only — no raw customer communications or employee PII.'
  );
end; $$;

create or replace function public.manage_organizational_health_intelligence_item(
  p_item_type text,
  p_item_id uuid,
  p_action text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._oh437_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'resolve', 'complete') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'intervention' then
    update public.organizational_health_interventions set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'signal' then
    update public.organizational_health_signals set
      resolved = p_action in ('resolve', 'dismiss', 'complete'),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'warning' then
    update public.organizational_health_warnings set
      resolved = p_action in ('resolve', 'dismiss', 'complete'),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._oh437_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Organizational health intelligence item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_organizational_health_intelligence_center() to authenticated;
grant execute on function public.manage_organizational_health_intelligence_item(text, uuid, text) to authenticated;

-- Restore Phase 308 executive Organizational Health Center RPC
create or replace function public.get_organizational_health_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._ohc_require_tenant());
  perform public._irp_require_permission('health_center.view', v_tenant);

  if not exists (select 1 from public.aipify_ohc_center_domain_scores where tenant_id = v_tenant limit 1) then
    v_seed := public._ohc_seed(v_tenant);
  end if;

  perform public._ohc_log(v_tenant, 'view_center', 'Organizational Health Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-health',
    'dashboard', public._ohc_dashboard_metrics(v_tenant),
    'domain_scores', coalesce((select jsonb_agg(public._ohc_domain_to_json(d) order by d.domain_key)
      from public.aipify_ohc_center_domain_scores d where d.tenant_id = v_tenant), '[]'::jsonb),
    'indicators', coalesce((select jsonb_agg(jsonb_build_object(
      'indicator_key', i.indicator_key, 'domain_key', i.domain_key, 'title', i.title,
      'message', i.message, 'trend_direction', i.trend_direction
    ) order by i.created_at desc) from public.aipify_ohc_center_indicators i
      where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', ins.insight_key, 'message', ins.message, 'priority', ins.priority
    ) order by case ins.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ohc_center_insights ins where ins.tenant_id = v_tenant and ins.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ohc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'early_warnings', coalesce((select jsonb_agg(jsonb_build_object(
      'warning_key', w.warning_key, 'category', w.category, 'message', w.message,
      'severity', w.severity, 'status', w.status
    ) order by case w.severity when 'priority' then 1 when 'elevated' then 2 else 3 end)
      from public.aipify_ohc_center_early_warnings w where w.tenant_id = v_tenant and w.status in ('open', 'acknowledged')), '[]'::jsonb),
    'health_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', hr.review_key, 'review_type', hr.review_type, 'prompt', hr.prompt,
      'status', hr.status, 'scheduled_for', hr.scheduled_for, 'completed_at', hr.completed_at
    ) order by hr.created_at desc) from public.aipify_ohc_center_health_reviews hr where hr.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', t.event_key, 'period_label', t.period_label, 'event_type', t.event_type, 'summary', t.summary
    ) order by t.created_at desc) from public.aipify_ohc_center_timeline_events t where t.tenant_id = v_tenant), '[]'::jsonb),
    'domains', public._ohcbp308_domains(),
    'health_bands', public._ohcbp308_health_bands(),
    'blueprint', public._ohcbp308_blueprint_summary(),
    'links', jsonb_build_object(
      'health_center', '/app/executive/organizational-health',
      'executive', '/app/executive',
      'decision_support', '/app/executive/decision-support',
      'strategic_intelligence', '/app/executive/strategic-intelligence',
      'continuous_improvement', '/app/executive/continuous-improvement',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'opportunity_discovery', '/app/executive/opportunity-discovery',
      'organizational_health_engine', '/app/intelligence/health',
      'early_warning', '/app/aipify-organizational-health-early-warning-engine',
      'workforce_insights', '/app/aipify-organizational-health-workforce-insights-engine'
    ),
    'privacy_note', public._ohcbp308_privacy_note(),
    'can_manage', public._irp_has_permission('health_center.manage', v_tenant),
    'can_contribute', public._irp_has_permission('health_center.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

grant execute on function public.get_organizational_health_center(uuid) to authenticated;
