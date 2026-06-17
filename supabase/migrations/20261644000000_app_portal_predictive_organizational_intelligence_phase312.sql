-- Phase 312 (APP) — Predictive Organizational Intelligence Center

create table if not exists public.app_portal_predictive_intelligence_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_predictive_intelligence_predictions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  prediction_key text not null default '',
  title text not null default '',
  category text not null check (category in (
    'operational', 'capacity', 'strategic', 'customer_success',
    'learning', 'governance', 'risk', 'business_pack'
  )),
  summary text not null default '',
  confidence_level text not null default 'exploratory' check (confidence_level in (
    'exploratory', 'emerging_pattern', 'moderate_confidence', 'high_confidence'
  )),
  time_horizon text not null default 'next_quarter' check (time_horizon in (
    'next_30_days', 'next_quarter', 'next_6_months', 'next_12_months'
  )),
  potential_impact text not null default 'moderate' check (potential_impact in ('low', 'moderate', 'high', 'critical')),
  organizational_area text not null default 'operations',
  review_status text not null default 'pending' check (review_status in ('pending', 'reviewed', 'needs_follow_up')),
  recommended_actions jsonb not null default '[]'::jsonb,
  related_areas jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  last_reviewed_at timestamptz,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, prediction_key)
);

create index if not exists app_portal_predictive_intelligence_predictions_idx
  on public.app_portal_predictive_intelligence_predictions (
    company_id, category, confidence_level, time_horizon, review_status
  );

create table if not exists public.app_portal_predictive_intelligence_early_warnings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  warning_key text not null default '',
  title text not null default '',
  signal_type text not null default 'risk',
  description text not null default '',
  severity text not null default 'moderate' check (severity in ('low', 'moderate', 'high', 'critical')),
  organizational_area text not null default 'operations',
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  unique (company_id, warning_key)
);

create table if not exists public.app_portal_predictive_intelligence_outcome_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  prediction_id uuid not null references public.app_portal_predictive_intelligence_predictions (id) on delete cascade,
  outcome text not null check (outcome in (
    'confirmed', 'partially_confirmed', 'not_observed', 'insufficient_evidence'
  )),
  review_notes text not null default '',
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz not null default now()
);

create index if not exists app_portal_predictive_intelligence_outcome_reviews_idx
  on public.app_portal_predictive_intelligence_outcome_reviews (company_id, prediction_id, reviewed_at desc);

create table if not exists public.app_portal_predictive_intelligence_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  prediction_id uuid references public.app_portal_predictive_intelligence_predictions (id) on delete set null,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_predictive_intelligence_timeline_idx
  on public.app_portal_predictive_intelligence_timeline (company_id, created_at desc);

create table if not exists public.app_portal_predictive_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  prediction_id uuid,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_predictive_intelligence_audit_idx
  on public.app_portal_predictive_intelligence_audit_logs (company_id, created_at desc);

alter table public.app_portal_predictive_intelligence_state enable row level security;
alter table public.app_portal_predictive_intelligence_predictions enable row level security;
alter table public.app_portal_predictive_intelligence_early_warnings enable row level security;
alter table public.app_portal_predictive_intelligence_outcome_reviews enable row level security;
alter table public.app_portal_predictive_intelligence_timeline enable row level security;
alter table public.app_portal_predictive_intelligence_audit_logs enable row level security;
revoke all on public.app_portal_predictive_intelligence_state from authenticated, anon;
revoke all on public.app_portal_predictive_intelligence_predictions from authenticated, anon;
revoke all on public.app_portal_predictive_intelligence_early_warnings from authenticated, anon;
revoke all on public.app_portal_predictive_intelligence_outcome_reviews from authenticated, anon;
revoke all on public.app_portal_predictive_intelligence_timeline from authenticated, anon;
revoke all on public.app_portal_predictive_intelligence_audit_logs from authenticated, anon;

create or replace function public._apoi312_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
  v_manager_enabled boolean := false;
  v_admin_enabled boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(ps.manager_access_enabled, false), coalesce(ps.admin_access_enabled, false)
  into v_manager_enabled, v_admin_enabled
  from public.app_portal_predictive_intelligence_state ps
  where ps.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true, 'can_generate', true, 'can_review', true
    );
  elsif v_role = 'organization_admin' and v_admin_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true, 'can_generate', true, 'can_review', true
    );
  elsif v_role = 'organization_manager' and v_manager_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', false, 'can_manage', false, 'can_view', true, 'can_generate', false, 'can_review', false
    );
  end if;

  raise exception 'Predictive Intelligence access requires owner authorization or explicit grant';
end;
$$;

create or replace function public._apoi312_prediction_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support_workload_increase', 'title', 'Support workload may increase', 'category', 'operational', 'area', 'operations', 'horizon', 'next_quarter', 'confidence', 'emerging_pattern', 'impact', 'moderate', 'summary', 'Historical patterns suggest support volume may rise — probability-based, not certain.'),
    jsonb_build_object('key', 'capacity_constraints', 'title', 'Capacity constraints may emerge', 'category', 'capacity', 'area', 'operations', 'horizon', 'next_30_days', 'confidence', 'moderate_confidence', 'impact', 'high', 'summary', 'Current workload signals indicate potential capacity pressure within the next month.'),
    jsonb_build_object('key', 'strategic_resource_needs', 'title', 'Strategic initiatives could require additional resources', 'category', 'strategic', 'area', 'strategy', 'horizon', 'next_6_months', 'confidence', 'exploratory', 'impact', 'moderate', 'summary', 'Active strategic initiatives may benefit from proactive resource planning.'),
    jsonb_build_object('key', 'learning_engagement_decline', 'title', 'Learning engagement may decline', 'category', 'learning', 'area', 'learning', 'horizon', 'next_quarter', 'confidence', 'emerging_pattern', 'impact', 'moderate', 'summary', 'Engagement indicators suggest learning participation may soften — early awareness supports preparedness.'),
    jsonb_build_object('key', 'governance_reviews_overdue', 'title', 'Governance reviews may become overdue', 'category', 'governance', 'area', 'governance', 'horizon', 'next_30_days', 'confidence', 'moderate_confidence', 'impact', 'high', 'summary', 'Review cadence patterns indicate governance checkpoints may require attention soon.'),
    jsonb_build_object('key', 'business_pack_adoption_accelerate', 'title', 'Business Pack adoption may accelerate', 'category', 'business_pack', 'area', 'business_packs', 'horizon', 'next_12_months', 'confidence', 'exploratory', 'impact', 'moderate', 'summary', 'Adoption momentum signals suggest Business Pack utilization may increase over the coming year.'),
    jsonb_build_object('key', 'customer_success_pressure', 'title', 'Customer success workload may intensify', 'category', 'customer_success', 'area', 'customer', 'horizon', 'next_quarter', 'confidence', 'emerging_pattern', 'impact', 'moderate', 'summary', 'Customer engagement patterns may create additional success management needs.'),
    jsonb_build_object('key', 'operational_bottleneck_risk', 'title', 'Operational bottlenecks may develop', 'category', 'risk', 'area', 'operations', 'horizon', 'next_quarter', 'confidence', 'moderate_confidence', 'impact', 'high', 'summary', 'Process flow indicators suggest potential operational friction points ahead.')
  );
$$;

create or replace function public._apoi312_sync_predictions(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_item jsonb;
begin
  for v_item in select jsonb_array_elements(public._apoi312_prediction_catalog())
  loop
    insert into public.app_portal_predictive_intelligence_predictions (
      company_id, prediction_key, title, category, summary, confidence_level, time_horizon,
      potential_impact, organizational_area, recommended_actions, related_areas
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      v_item->>'category',
      v_item->>'summary',
      v_item->>'confidence',
      v_item->>'horizon',
      v_item->>'impact',
      v_item->>'area',
      jsonb_build_array('Review relevant indicators', 'Prepare leadership briefing', 'Monitor trend signals'),
      jsonb_build_array(v_item->>'area')
    )
    on conflict (company_id, prediction_key) do update set
      title = excluded.title,
      summary = excluded.summary,
      updated_at = now();
  end loop;

  insert into public.app_portal_predictive_intelligence_early_warnings (
    company_id, warning_key, title, signal_type, description, severity, organizational_area
  ) values
    (p_company_id, 'risk_signals', 'Risk signals detected', 'risk', 'Emerging risk indicators warrant proactive review.', 'moderate', 'risk'),
    (p_company_id, 'declining_engagement', 'Declining engagement trends', 'engagement', 'Participation patterns may indicate softening engagement.', 'moderate', 'learning'),
    (p_company_id, 'capacity_pressure', 'Capacity pressure indicators', 'capacity', 'Workload signals suggest potential capacity constraints.', 'high', 'operations'),
    (p_company_id, 'delayed_initiatives', 'Delayed initiative patterns', 'initiative', 'Initiative timelines may benefit from executive follow-up.', 'moderate', 'strategy'),
    (p_company_id, 'governance_backlog', 'Governance review backlogs', 'governance', 'Governance review cadence may require attention.', 'high', 'governance'),
    (p_company_id, 'operational_bottlenecks', 'Operational bottlenecks', 'operations', 'Process indicators suggest potential friction points.', 'moderate', 'operations')
  on conflict (company_id, warning_key) do nothing;

  if not exists (
    select 1 from public.app_portal_predictive_intelligence_timeline t
    where t.company_id = p_company_id and t.event_type = 'predictions_generated'
  ) then
    insert into public.app_portal_predictive_intelligence_timeline (
      company_id, event_type, description, performed_by
    ) values (
      p_company_id, 'predictions_generated', 'Predictive insights generated', p_user_id
    );
  end if;
end;
$$;

create or replace function public._apoi312_prediction_card(p_row public.app_portal_predictive_intelligence_predictions)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'prediction_key', p_row.prediction_key,
    'title', p_row.title,
    'category', p_row.category,
    'summary', p_row.summary,
    'confidence_level', p_row.confidence_level,
    'time_horizon', p_row.time_horizon,
    'potential_impact', p_row.potential_impact,
    'organizational_area', p_row.organizational_area,
    'review_status', p_row.review_status,
    'recommended_actions', p_row.recommended_actions,
    'related_areas', p_row.related_areas,
    'last_reviewed_at', p_row.last_reviewed_at,
    'generated_at', p_row.generated_at
  );
$$;

create or replace function public._apoi312_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if exists (select 1 from public.app_portal_predictive_intelligence_predictions p where p.company_id = p_company_id and p.category = 'capacity') then
    v_recs := v_recs || jsonb_build_object('id', 'cap-' || p_company_id, 'key', 'conductPreventiveCapacityReviews');
  end if;
  if exists (select 1 from public.app_portal_predictive_intelligence_predictions p where p.company_id = p_company_id and p.category = 'governance') then
    v_recs := v_recs || jsonb_build_object('id', 'gov-' || p_company_id, 'key', 'reviewEmergingGovernanceRisks');
  end if;
  if exists (select 1 from public.app_portal_predictive_intelligence_predictions p where p.company_id = p_company_id and p.category = 'learning') then
    v_recs := v_recs || jsonb_build_object('id', 'learn-' || p_company_id, 'key', 'expandLearningInitiatives');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'follow-' || p_company_id, 'key', 'strengthenFollowUpDiscipline');
  v_recs := v_recs || jsonb_build_object('id', 'exec-' || p_company_id, 'key', 'scheduleExecutivePlanningSessions');
  v_recs := v_recs || jsonb_build_object('id', 'monitor-' || p_company_id, 'key', 'monitorIdentifiedTrends');
  return v_recs;
end;
$$;

create or replace function public._apoi312_manager_categories()
returns text[]
language sql
immutable
as $$
  select array['operational', 'capacity', 'customer_success']::text[];
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
  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._apoi312_manager_categories();
  perform public._apoi312_sync_predictions(v_company_id, v_user_id);

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
  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._apoi312_manager_categories();
  perform public._apoi312_sync_predictions(v_company_id, (v_ctx->>'user_id')::uuid);

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
  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._apoi312_sync_predictions(v_company_id, (v_ctx->>'user_id')::uuid);
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
  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._apoi312_sync_predictions(v_company_id, (v_ctx->>'user_id')::uuid);

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

create or replace function public.review_app_portal_predictive_intelligence(
  p_prediction_id uuid default null,
  p_outcome text default null,
  p_review_notes text default null,
  p_action text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_review_id uuid;
begin
  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if coalesce(p_action, '') = 'generate' then
    if coalesce(v_ctx->>'can_generate', 'false') <> 'true' then
      raise exception 'Generating predictive insights requires owner authorization or higher';
    end if;
    perform public._apoi312_sync_predictions(v_company_id, v_user_id);
    insert into public.app_portal_predictive_intelligence_timeline (
      company_id, event_type, description, performed_by
    ) values (v_company_id, 'predictions_generated', 'Predictive insights refreshed', v_user_id);
    insert into public.app_portal_predictive_intelligence_audit_logs (
      company_id, event_type, description, performed_by
    ) values (v_company_id, 'predictions_generated', 'Predictive insights generated', v_user_id);
    return jsonb_build_object('found', true, 'message', 'Predictive insights generated — all outputs remain probability-based.');
  end if;

  if coalesce(v_ctx->>'can_review', 'false') <> 'true' then
    raise exception 'Outcome review requires owner authorization or higher';
  end if;
  if p_prediction_id is null then raise exception 'Prediction id required'; end if;
  if p_outcome is null or p_outcome not in ('confirmed', 'partially_confirmed', 'not_observed', 'insufficient_evidence') then
    raise exception 'Valid outcome required';
  end if;
  if not exists (
    select 1 from public.app_portal_predictive_intelligence_predictions p
    where p.company_id = v_company_id and p.id = p_prediction_id
  ) then raise exception 'Prediction not found'; end if;

  insert into public.app_portal_predictive_intelligence_outcome_reviews (
    company_id, prediction_id, outcome, review_notes, reviewed_by
  ) values (v_company_id, p_prediction_id, p_outcome, coalesce(p_review_notes, ''), v_user_id)
  returning id into v_review_id;

  update public.app_portal_predictive_intelligence_predictions set
    review_status = 'reviewed', last_reviewed_at = now(), updated_at = now()
  where company_id = v_company_id and id = p_prediction_id;

  insert into public.app_portal_predictive_intelligence_timeline (
    company_id, prediction_id, event_type, description, performed_by
  ) values (
    v_company_id, p_prediction_id, 'outcome_reviewed',
    'Prediction outcome reviewed: ' || p_outcome, v_user_id
  );

  insert into public.app_portal_predictive_intelligence_audit_logs (
    company_id, prediction_id, event_type, description, performed_by, metadata
  ) values (
    v_company_id, p_prediction_id, 'outcome_review_recorded',
    'Prediction outcome review recorded', v_user_id, jsonb_build_object('review_id', v_review_id, 'outcome', p_outcome)
  );

  return jsonb_build_object(
    'found', true, 'review_id', v_review_id, 'prediction_id', p_prediction_id,
    'outcome', p_outcome,
    'message', 'Outcome review recorded — supports organizational learning over time.'
  );
end;
$$;

grant execute on function public._apoi312_access_context() to authenticated;
grant execute on function public.list_app_portal_predictive_intelligence(text, text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_predictive_intelligence_prediction(uuid) to authenticated;
grant execute on function public.get_app_portal_predictive_intelligence_recommendations() to authenticated;
grant execute on function public.get_app_portal_predictive_intelligence_timeline(uuid, date) to authenticated;
grant execute on function public.review_app_portal_predictive_intelligence(uuid, text, text, text) to authenticated;
