-- Phase 620 P1 — composite row typing for Intelligence list/detail card helpers (showcase data paths).

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
  v_opps jsonb := '[]'::jsonb; v_row public.app_portal_strategic_opportunities; v_total integer := 0;
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
  v_ctx jsonb; v_company_id uuid; v_row public.app_portal_strategic_opportunities;
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
  v_assessments jsonb := '[]'::jsonb; v_row public.app_portal_enterprise_readiness_assessments; v_total integer := 0;
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
  v_ctx jsonb; v_company_id uuid; v_row public.app_portal_enterprise_readiness_assessments;
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
  v_plans jsonb := '[]'::jsonb; v_row public.app_portal_future_state_plans; v_total integer := 0;
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
  v_ctx jsonb; v_company_id uuid; v_row public.app_portal_future_state_plans;
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

notify pgrst, 'reload schema';
