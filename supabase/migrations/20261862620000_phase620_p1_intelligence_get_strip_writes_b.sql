-- Phase 620 P1 follow-up b — strip sync writes from remaining Intelligence GET RPCs (315–320).

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
