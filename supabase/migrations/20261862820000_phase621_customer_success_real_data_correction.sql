-- Phase 621 — Customer Success real-data correction (Unonight pilot)
-- Exclude PS620 showcase fixtures from customer-facing queries.
-- Separate score availability from numeric score values.

create or replace function public._cs621_organization_id_for_company(p_company_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id
  from public.customers c
  where c.company_id = p_company_id
  limit 1;
$$;

create or replace function public._cs621_is_showcase_row(
  p_company_id uuid,
  p_table_name text,
  p_record_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_showcase_data_registry r
    inner join public.customers cu on cu.id = r.organization_id and cu.company_id = p_company_id
    where r.table_name = p_table_name
      and r.record_id = p_record_id
  );
$$;

create or replace function public._cs621_is_synthetic_text(p_text text)
returns boolean
language sql
immutable
as $$
  select coalesce(p_text, '') ~* '(synthetic|layout testing|design validation|vendor sla attestation|executive briefing prep|enterprise renewal|external legal review|third-party outage|support queue saturation|long-tail operational risk)';
$$;

create or replace function public._cs621_build_score_payload(
  p_score integer,
  p_availability text,
  p_calculated_at timestamptz,
  p_source_freshness text,
  p_explanation_key text
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'score', case when p_availability = 'available' then p_score else null end,
    'availability', p_availability,
    'calculated_at', p_calculated_at,
    'source_freshness', p_source_freshness,
    'explanation_key', p_explanation_key
  );
$$;

create or replace function public._cs621_pilot_context(p_company_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_settings public.unonight_pilot_settings;
  v_freshness text := 'unavailable';
  v_connected integer := 0;
begin
  v_org_id := public._cs621_organization_id_for_company(p_company_id);
  if v_org_id is null or to_regclass('public.unonight_pilot_settings') is null then
    return jsonb_build_object('active', false);
  end if;

  select * into v_settings
  from public.unonight_pilot_settings ups
  where ups.organization_id = v_org_id
  limit 1;

  if not found or v_settings.enabled is not true then
    return jsonb_build_object('active', false);
  end if;

  if v_settings.last_successful_sync is null then
    v_freshness := 'awaiting_first_sync';
  elsif v_settings.last_successful_sync > now() - interval '6 hours' then
    v_freshness := 'current';
  elsif v_settings.last_successful_sync > now() - interval '24 hours' then
    v_freshness := 'delayed';
  else
    v_freshness := 'stale';
  end if;

  if jsonb_typeof(v_settings.data_sources) = 'array' then
    select count(*)::int into v_connected
    from jsonb_array_elements(v_settings.data_sources) src
    where coalesce(src->>'status', src->>'approval_state') in ('approved', 'connected', 'active');
  end if;

  return jsonb_build_object(
    'active', true,
    'read_only', coalesce(v_settings.read_only, true),
    'shadow_mode', coalesce(v_settings.shadow_mode, false),
    'health_state', v_settings.health_state,
    'last_successful_sync', v_settings.last_successful_sync,
    'data_freshness', v_freshness,
    'connected_source_count', v_connected,
    'awaiting_first_sync', v_settings.last_successful_sync is null
  );
end;
$$;

create or replace function public._cs621_resolve_scores(
  p_company_id uuid,
  p_adoption integer,
  p_utilization integer,
  p_engagement integer,
  p_health integer,
  p_journey_started boolean,
  p_has_activity boolean,
  p_pilot jsonb,
  p_calculated_at timestamptz
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_availability text;
  v_freshness text;
  v_explanation text;
begin
  if coalesce(p_pilot->>'active', 'false') = 'true'
     and coalesce(p_pilot->>'awaiting_first_sync', 'false') = 'true' then
    v_availability := 'awaiting_first_sync';
    v_freshness := 'awaiting_first_sync';
    v_explanation := 'customerApp.portalStructure.customerSuccess.scoreAvailability.awaitingFirstSync';
  elsif not p_journey_started and not p_has_activity then
    v_availability := 'insufficient_data';
    v_freshness := 'unavailable';
    v_explanation := 'customerApp.portalStructure.customerSuccess.scoreAvailability.insufficientData';
  elsif coalesce(p_pilot->>'data_freshness', '') = 'stale' then
    v_availability := 'available';
    v_freshness := 'stale';
    v_explanation := 'customerApp.portalStructure.customerSuccess.scoreAvailability.stale';
  elsif coalesce(p_pilot->>'data_freshness', '') = 'delayed' then
    v_availability := 'available';
    v_freshness := 'delayed';
    v_explanation := 'customerApp.portalStructure.customerSuccess.scoreAvailability.delayed';
  else
    v_availability := 'available';
    v_freshness := case when p_journey_started or p_has_activity then 'current' else 'unavailable' end;
    v_explanation := 'customerApp.portalStructure.customerSuccess.scoreAvailability.available';
  end if;

  return jsonb_build_object(
    'health', public._cs621_build_score_payload(p_health, v_availability, p_calculated_at, v_freshness, v_explanation),
    'adoption', public._cs621_build_score_payload(p_adoption, v_availability, p_calculated_at, v_freshness, v_explanation),
    'utilization', public._cs621_build_score_payload(p_utilization, v_availability, p_calculated_at, v_freshness, v_explanation),
    'engagement', public._cs621_build_score_payload(p_engagement, v_availability, p_calculated_at, v_freshness, v_explanation)
  );
end;
$$;

create or replace function public._cs621_build_recommendations(
  p_metrics jsonb,
  p_company_id uuid,
  p_pilot jsonb,
  p_open_risks integer,
  p_overdue_follow_ups integer
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
begin
  if coalesce(p_pilot->>'active', 'false') = 'true'
     and coalesce(p_pilot->>'awaiting_first_sync', 'false') = 'true' then
    return jsonb_build_array(
      jsonb_build_object(
        'id', 'unonight-first-sync',
        'key', 'completeFirstUnonightSync',
        'priority', 'high_impact',
        'category', 'operations',
        'shadow', coalesce(p_pilot->>'shadow_mode', 'false') = 'true'
      )
    );
  end if;

  if p_open_risks > 0 then
    v_recs := v_recs || jsonb_build_object(
      'id', 'review-risks', 'key', 'reviewOperationalDashboards', 'priority', 'high_impact', 'category', 'operations'
    );
  end if;

  if p_overdue_follow_ups > 0 then
    v_recs := v_recs || jsonb_build_object(
      'id', 'overdue-follow-ups', 'key', 'reviewOperationalDashboards', 'priority', 'important', 'category', 'operations'
    );
  end if;

  v_recs := v_recs || public._acsc295_build_recommendations(p_metrics, p_company_id);
  return v_recs;
end;
$$;

-- Canonical org metrics: installed Business Packs + connected integrations only.
create or replace function public._acsc295_org_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_team_count integer := 0;
  v_2fa_count integer := 0;
  v_2fa_eligible integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_connected integer := 0;
  v_academy_completions integer := 0;
  v_academy_certs integer := 0;
  v_academy_assignments_done integer := 0;
  v_academy_assignments_total integer := 0;
  v_operations_records integer := 0;
  v_compliance_records integer := 0;
  v_org_id uuid;
  v_two_fa_percent integer := null;
begin
  select count(*)::int into v_team_count
  from public.users u
  where u.company_id = p_company_id
    and coalesce(u.status, 'active') not in ('disabled', 'inactive');

  v_org_id := public._cs621_organization_id_for_company(p_company_id);

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa_count
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true
      and coalesce(u.status, 'active') not in ('disabled', 'inactive');
    v_2fa_eligible := v_team_count;
  end if;

  if v_2fa_eligible > 0 then
    v_two_fa_percent := round((v_2fa_count::numeric / v_2fa_eligible) * 100)::int;
  end if;

  if v_org_id is not null and to_regclass('public.organization_business_packs') is not null then
    select count(*)::int into v_packs
    from public.organization_business_packs obp
    where obp.organization_id = v_org_id
      and coalesce(obp.status, obp.activation_status, 'active') not in ('archived', 'removed');
  elsif to_regclass('public.tenant_modules') is not null and v_org_id is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_org_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int, count(*) filter (where ic.status = 'connected')::int
    into v_integrations, v_connected
    from public.app_portal_integration_connections ic
    where ic.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_completions') is not null then
    select count(*)::int into v_academy_completions
    from public.app_portal_academy_completions co where co.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_certifications') is not null then
    select count(*)::int into v_academy_certs
    from public.app_portal_academy_certifications ce
    where ce.company_id = p_company_id and ce.status = 'earned';
  end if;

  if to_regclass('public.app_portal_academy_assignments') is not null then
    select count(*) filter (where a.status = 'completed')::int,
           count(*)::int
    into v_academy_assignments_done, v_academy_assignments_total
    from public.app_portal_academy_assignments a
    where a.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_commitments where company_id = p_company_id);
  end if;
  if to_regclass('public.app_portal_briefings') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_briefings where company_id = p_company_id);
  end if;
  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_strategy_initiatives where company_id = p_company_id);
  end if;

  if to_regclass('public.app_portal_compliance_policies') is not null then
    select count(*)::int into v_compliance_records
    from public.app_portal_compliance_policies cp where cp.company_id = p_company_id;
  end if;

  return jsonb_build_object(
    'team_count', v_team_count,
    'two_fa_count', v_2fa_count,
    'two_fa_eligible', v_2fa_eligible,
    'two_fa_adoption_percent', v_two_fa_percent,
    'packs', v_packs,
    'business_packs', v_packs,
    'integrations', v_integrations,
    'connected_integrations', v_connected,
    'academy_completions', v_academy_completions,
    'academy_certifications', v_academy_certs,
    'academy_assignments_total', v_academy_assignments_total,
    'team_training_completed', v_academy_assignments_done,
    'operations_records', v_operations_records,
    'compliance_records', v_compliance_records
  );
end;
$$;

create or replace function public.list_app_portal_customer_success(
  p_department text default null,
  p_category text default null,
  p_priority text default null,
  p_success_status text default null,
  p_period_from date default null,
  p_search text default null,
  p_owner text default null,
  p_due_date date default null,
  p_sort_by text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_journey_started timestamptz;
  v_metrics jsonb;
  v_categories jsonb;
  v_adoption integer;
  v_utilization integer;
  v_engagement integer;
  v_health_score integer;
  v_health_state text;
  v_status text;
  v_maturity jsonb;
  v_milestones jsonb := '[]'::jsonb;
  v_recs jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_plans jsonb := '[]'::jsonb;
  v_outcomes jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_adoption_signals jsonb := '[]'::jsonb;
  v_owners jsonb := '[]'::jsonb;
  v_next_action jsonb := null;
  v_personal jsonb := '{}'::jsonb;
  v_team_ratio integer := null;
  v_pilot jsonb;
  v_scores jsonb;
  v_has_activity boolean := false;
  v_open_risks integer := 0;
  v_overdue_follow_ups integer := 0;
  v_calculated_at timestamptz := now();
begin
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_pilot := public._cs621_pilot_context(v_company_id);

  select cs.journey_started_at into v_journey_started
  from public.app_portal_customer_success_state cs where cs.company_id = v_company_id;

  v_metrics := public._acsc295_org_metrics(v_company_id);
  v_has_activity := (v_metrics->>'team_count')::int > 0
    or (v_metrics->>'business_packs')::int > 0
    or (v_metrics->>'connected_integrations')::int > 0
    or (v_metrics->>'operations_records')::int > 0;

  v_categories := public._acsc295_category_scores(v_metrics, v_journey_started is not null or v_has_activity);
  v_adoption := round((
    (v_categories->>'learning_completion')::numeric +
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'user_engagement')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'security_completion')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 6)::int;
  v_utilization := round((
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 3)::int;
  v_engagement := (v_categories->>'user_engagement')::int;
  v_status := public._acsc295_success_status(v_adoption);
  v_maturity := public._acsc295_maturity_stage(v_adoption);
  v_health_score := v_adoption;
  v_scores := public._cs621_resolve_scores(
    v_company_id, v_adoption, v_utilization, v_engagement, v_health_score,
    v_journey_started is not null, v_has_activity, v_pilot, v_calculated_at
  );
  v_health_state := case
    when (v_scores->'health'->>'availability') <> 'available' then 'unknown'
    else public._apsc273_health_state(v_health_score)
  end;

  if p_success_status is not null and v_status <> p_success_status then
    return jsonb_build_object('found', true, 'filtered_out', true, 'journey_started', v_journey_started is not null);
  end if;

  if v_metrics ? 'two_fa_adoption_percent' and (v_metrics->>'two_fa_adoption_percent') is not null then
    v_team_ratio := (v_metrics->>'two_fa_adoption_percent')::int;
  end if;

  v_adoption_signals := jsonb_build_array(
    jsonb_build_object('key', 'learning_completion', 'label_key', 'learningCompletion', 'value', (v_categories->>'learning_completion')::int, 'unit', 'score', 'availability', case when (v_metrics->>'academy_assignments_total')::int = 0 then 'no_assignments' else 'available' end),
    jsonb_build_object('key', 'feature_adoption', 'label_key', 'featureAdoption', 'value', (v_categories->>'feature_adoption')::int, 'unit', 'score', 'availability', 'available'),
    jsonb_build_object('key', 'user_engagement', 'label_key', 'userEngagement', 'value', (v_categories->>'user_engagement')::int, 'unit', 'score', 'availability', 'available'),
    jsonb_build_object('key', 'team_count', 'label_key', 'teamCount', 'value', (v_metrics->>'team_count')::int, 'unit', 'count', 'availability', 'available'),
    jsonb_build_object('key', 'business_packs', 'label_key', 'businessPacks', 'value', coalesce((v_metrics->>'business_packs')::int, 0), 'unit', 'count', 'availability', 'available'),
    jsonb_build_object('key', 'integrations_connected', 'label_key', 'integrationsConnected', 'value', coalesce((v_metrics->>'connected_integrations')::int, 0), 'unit', 'count', 'availability', 'available'),
    jsonb_build_object('key', 'two_fa_adoption', 'label_key', 'twoFaAdoption', 'value', coalesce(v_team_ratio, -1), 'unit', 'percent', 'availability', case when v_team_ratio is null then 'unavailable' else 'available' end)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'key', m.milestone_key, 'title', cat->>'title', 'achieved_at', m.achieved_at,
    'auto_detected', m.auto_detected, 'item_type', 'milestone', 'status', 'completed'
  ) order by m.achieved_at desc), '[]'::jsonb)
  into v_milestones
  from public.app_portal_customer_success_milestones m
  cross join lateral (
    select c as cat from jsonb_array_elements(public._acsc295_milestone_catalog()) c
    where c->>'key' = m.milestone_key limit 1
  ) cat
  where m.company_id = v_company_id
    and (p_period_from is null or m.achieved_at::date >= p_period_from);

  if to_regclass('public.app_portal_follow_ups') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', f.id, 'title', f.title, 'summary', f.suggested_next_action, 'category', f.category,
      'priority', f.priority, 'status', f.status, 'owner_id', f.assigned_owner_id,
      'owner_label', public._acsc295_user_name(f.assigned_owner_id), 'due_at', f.due_at,
      'item_type', 'follow_up', 'href', '/app/operations/follow-ups'
    ) order by f.due_at nulls last), '[]'::jsonb),
    count(*) filter (where f.due_at is not null and f.due_at < now() and f.status not in ('completed', 'cancelled'))::int
    into v_follow_ups, v_overdue_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id
      and f.status not in ('completed', 'cancelled')
      and not public._cs621_is_showcase_row(v_company_id, 'app_portal_follow_ups', f.id)
      and not public._cs621_is_synthetic_text(f.title)
      and not public._cs621_is_synthetic_text(coalesce(f.notes, ''))
      and (p_period_from is null or f.created_at::date >= p_period_from)
      and (p_due_date is null or f.due_at::date = p_due_date)
      and (p_owner is null or trim(p_owner) = '' or public._acsc295_user_name(f.assigned_owner_id) ilike '%' || trim(p_owner) || '%')
      and (p_search is null or trim(p_search) = '' or f.title ilike '%' || trim(p_search) || '%');
  end if;

  if to_regclass('public.app_portal_risks') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', r.id, 'title', r.title, 'description', r.description, 'category', r.category,
      'status', r.status, 'likelihood', r.likelihood, 'impact', r.impact,
      'owner_id', r.owner_id, 'owner_label', public._acsc295_user_name(r.owner_id),
      'item_type', 'risk', 'href', '/app/operations/risks'
    ) order by r.updated_at desc), '[]'::jsonb),
    count(*)::int
    into v_risks, v_open_risks
    from public.app_portal_risks r
    where r.company_id = v_company_id
      and r.status not in ('resolved', 'archived')
      and not public._cs621_is_showcase_row(v_company_id, 'app_portal_risks', r.id)
      and not public._cs621_is_synthetic_text(r.title)
      and not public._cs621_is_synthetic_text(coalesce(r.description, ''))
      and (p_search is null or trim(p_search) = '' or r.title ilike '%' || trim(p_search) || '%');
  end if;

  v_recs := public._cs621_build_recommendations(v_metrics, v_company_id, v_pilot, v_open_risks, v_overdue_follow_ups);

  if p_priority is not null or p_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_category is null or r->>'category' = p_category)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  if jsonb_array_length(v_recs) > 0 then
    v_next_action := jsonb_build_object(
      'key', (v_recs->0)->>'key',
      'priority', (v_recs->0)->>'priority',
      'category', (v_recs->0)->>'category',
      'shadow', coalesce((v_recs->0)->>'shadow', 'false') = 'true'
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'goal_summary', p.goal_summary, 'owner_id', p.owner_id,
    'owner_label', coalesce(nullif(p.owner_label, ''), public._acsc295_user_name(p.owner_id)),
    'status', p.status, 'category', p.category, 'priority', p.priority,
    'progress_percent', p.progress_percent, 'start_date', p.start_date, 'target_date', p.target_date,
    'item_type', 'success_plan'
  ) order by p.target_date nulls last, p.updated_at desc), '[]'::jsonb)
  into v_plans
  from public.app_portal_customer_success_plans p
  where p.company_id = v_company_id
    and p.status not in ('archived')
    and not public._cs621_is_showcase_row(v_company_id, 'app_portal_customer_success_plans', p.id)
    and not public._cs621_is_synthetic_text(p.title)
    and (p_category is null or p.category = p_category)
    and (p_priority is null or p.priority = p_priority)
    and (p_due_date is null or p.target_date = p_due_date)
    and (p_owner is null or trim(p_owner) = '' or coalesce(nullif(p.owner_label, ''), public._acsc295_user_name(p.owner_id)) ilike '%' || trim(p_owner) || '%')
    and (p_search is null or trim(p_search) = '' or p.title ilike '%' || trim(p_search) || '%' or p.goal_summary ilike '%' || trim(p_search) || '%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'title', o.title, 'target_value', o.target_value, 'current_value', o.current_value,
    'progress_percent', o.progress_percent, 'category', o.category, 'status', o.status, 'item_type', 'outcome'
  ) order by o.progress_percent desc, o.title), '[]'::jsonb)
  into v_outcomes
  from public.app_portal_customer_success_outcomes o
  where o.company_id = v_company_id
    and o.status not in ('archived')
    and not public._cs621_is_showcase_row(v_company_id, 'app_portal_customer_success_outcomes', o.id)
    and not public._cs621_is_synthetic_text(o.title)
    and (p_category is null or o.category = p_category)
    and (p_search is null or trim(p_search) = '' or o.title ilike '%' || trim(p_search) || '%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'title', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'item_type', 'activity'
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_customer_success_audit_logs l
  where l.company_id = v_company_id
    and not public._cs621_is_synthetic_text(l.description)
    and (p_period_from is null or l.created_at::date >= p_period_from)
  limit 15;

  select coalesce(jsonb_agg(distinct owner_name), '[]'::jsonb)
  into v_owners
  from (
    select coalesce(nullif(p.owner_label, ''), public._acsc295_user_name(p.owner_id)) as owner_name
    from public.app_portal_customer_success_plans p where p.company_id = v_company_id
    union
    select public._acsc295_user_name(f.assigned_owner_id)
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id and not public._cs621_is_showcase_row(v_company_id, 'app_portal_follow_ups', f.id)
    union
    select public._acsc295_user_name(r.owner_id)
    from public.app_portal_risks r
    where r.company_id = v_company_id and not public._cs621_is_showcase_row(v_company_id, 'app_portal_risks', r.id)
  ) owners
  where owner_name is not null and owner_name <> 'Unassigned';

  if to_regclass('public.app_portal_academy_completions') is not null then
    select jsonb_build_object(
      'courses_completed', count(*)::int,
      'certifications', coalesce((
        select count(*)::int from public.app_portal_academy_certifications ce
        where ce.company_id = v_company_id and ce.user_id = v_user_id and ce.status = 'earned'
      ), 0)
    ) into v_personal
    from public.app_portal_academy_completions co
    where co.company_id = v_company_id and co.user_id = v_user_id;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'journey_started', v_journey_started is not null,
    'adoption_score', case when (v_scores->'adoption'->>'availability') = 'available' then v_adoption else null end,
    'utilization_score', case when (v_scores->'utilization'->>'availability') = 'available' then v_utilization else null end,
    'engagement_score', case when (v_scores->'engagement'->>'availability') = 'available' then v_engagement else null end,
    'health_score', case when (v_scores->'health'->>'availability') = 'available' then v_health_score else null end,
    'scores', v_scores,
    'health_state', v_health_state,
    'success_status', v_status,
    'maturity', v_maturity,
    'category_scores', v_categories,
    'milestones_achieved', v_milestones,
    'recommendations', v_recs,
    'recommended_next_action', v_next_action,
    'follow_ups', v_follow_ups,
    'success_plans', v_plans,
    'outcomes', v_outcomes,
    'active_risks', v_risks,
    'adoption_signals', v_adoption_signals,
    'timeline', v_timeline,
    'owners', v_owners,
    'personal_progress', v_personal,
    'pilot_status', case when coalesce(v_pilot->>'active', 'false') = 'true' then v_pilot else null end,
    'team_reporting', case when coalesce(v_ctx->>'can_manage', 'false') = 'true' then jsonb_build_object(
      'team_count', v_metrics->>'team_count',
      'two_fa_adoption_percent', v_team_ratio,
      'learning_completions', v_metrics->>'academy_completions'
    ) else null end,
    'last_updated_at', v_calculated_at
  );
end;
$$;

grant execute on function public.list_app_portal_customer_success(
  text, text, text, text, date, text, text, date, text
) to authenticated;
