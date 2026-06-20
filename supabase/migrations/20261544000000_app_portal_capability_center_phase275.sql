-- Phase 275 (APP) — Organization Maturity & Capability Center

create table if not exists public.app_portal_maturity_history (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  category_scores jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists app_portal_maturity_history_company_idx
  on public.app_portal_maturity_history (company_id, recorded_at desc);

create table if not exists public.app_portal_maturity_self_assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  category_key text not null,
  level integer not null check (level between 1 and 5),
  notes text,
  submitted_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_maturity_self_assessments_company_idx
  on public.app_portal_maturity_self_assessments (company_id, category_key, created_at desc);

alter table public.app_portal_maturity_history enable row level security;
alter table public.app_portal_maturity_self_assessments enable row level security;
revoke all on public.app_portal_maturity_history from authenticated, anon;
revoke all on public.app_portal_maturity_self_assessments from authenticated, anon;

create or replace function public._apmc275_require_capability_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_access jsonb;
begin
  v_access := public._apsf260_require_app_access();
  if (v_access->>'organization_role') not in ('organization_owner', 'organization_admin', 'organization_manager') then
    raise exception 'Capability Center access denied';
  end if;
  return v_access;
end;
$$;

create or replace function public._apmc275_score_to_level(p_score integer)
returns integer
language sql
immutable
as $$
  select case
    when p_score >= 80 then 5
    when p_score >= 60 then 4
    when p_score >= 40 then 3
    when p_score >= 20 then 2
    else 1
  end;
$$;

create or replace function public._apmc275_level_key(p_level integer)
returns text
language sql
immutable
as $$
  select case p_level
    when 5 then 'exemplary'
    when 4 then 'optimized'
    when 3 then 'established'
    when 2 then 'developing'
    else 'emerging'
  end;
$$;

create or replace function public._apmc275_blend_level(p_system integer, p_self integer)
returns integer
language sql
immutable
as $$
  select case
    when p_self is null then p_system
    else greatest(1, least(5, round((p_system + p_self)::numeric / 2.0)::integer))
  end;
$$;

create or replace function public._apmc275_latest_self_level(p_company_id uuid, p_category text)
returns integer
language sql
stable
as $$
  select s.level
  from public.app_portal_maturity_self_assessments s
  where s.company_id = p_company_id and s.category_key = p_category
  order by s.created_at desc
  limit 1;
$$;

create or replace function public._apmc275_build_category(
  p_key text,
  p_score integer,
  p_self integer,
  p_strength text,
  p_improvement text,
  p_action text,
  p_capability text,
  p_resource text
)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_system_level integer;
  v_level integer;
begin
  v_system_level := public._apmc275_score_to_level(p_score);
  v_level := public._apmc275_blend_level(v_system_level, p_self);
  return jsonb_build_object(
    'key', p_key,
    'score', p_score,
    'system_level', v_system_level,
    'level', v_level,
    'level_key', public._apmc275_level_key(v_level),
    'has_self_assessment', p_self is not null,
    'self_level', p_self,
    'strengths', jsonb_build_array(p_strength),
    'improvements', jsonb_build_array(p_improvement),
    'recommended_actions', jsonb_build_array(p_action),
    'aipify_capabilities', jsonb_build_array(p_capability),
    'knowledge_resources', jsonb_build_array(p_resource)
  );
end;
$$;

create or replace function public._apmc275_compute_bundle(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_team integer := 0;
  v_admins integer := 0;
  v_active integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_2fa integer := 0;
  v_pending_approvals integer := 0;
  v_open_follow_ups integer := 0;
  v_completed_follow_ups integer := 0;
  v_decisions integer := 0;
  v_activity_events integer := 0;
  v_onboarding_started boolean := false;
  v_scores jsonb := '{}'::jsonb;
  v_categories jsonb := '[]'::jsonb;
  v_overall integer := 0;
  v_governance integer;
  v_operations integer;
  v_collaboration integer;
  v_knowledge integer;
  v_customer_success integer;
  v_security integer;
  v_integrations_score integer;
  v_packs_score integer;
  v_decisions_score integer;
  v_memory integer;
  v_self integer;
begin
  select count(*)::int, count(*) filter (where u.role in ('owner', 'admin'))::int,
         count(*) filter (where u.last_login_at is not null and u.last_login_at > now() - interval '14 days')::int
  into v_team, v_admins, v_active
  from public.users u where u.company_id = p_company_id;

  if to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = (select c.id from public.customers c where c.company_id = p_company_id limit 1)
      and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int into v_integrations
    from public.app_portal_integration_connections ic
    where ic.company_id = p_company_id and ic.status = 'connected';
  end if;

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true;
  end if;

  if to_regclass('public.action_requests') is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = (select c.id from public.customers c where c.company_id = p_company_id limit 1)
      and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*) filter (where f.status not in ('completed', 'cancelled'))::int,
           count(*) filter (where f.status = 'completed')::int
    into v_open_follow_ups, v_completed_follow_ups
    from public.app_portal_follow_ups f where f.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    select count(*)::int into v_decisions
    from public.app_portal_decisions d where d.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_activity_events') is not null then
    select count(*)::int into v_activity_events
    from public.app_portal_activity_events e where e.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_onboarding_progress') is not null then
    select op.started_at is not null into v_onboarding_started
    from public.app_portal_onboarding_progress op where op.company_id = p_company_id;
  end if;

  v_governance := least(100, greatest(10, 25 + v_admins * 15 + case when v_pending_approvals = 0 then 20 else 5 end + least(v_team * 3, 20)));
  v_operations := least(100, greatest(10, 20 + v_completed_follow_ups * 5 + case when v_open_follow_ups <= 2 then 25 else 5 end + least(v_activity_events, 30)));
  v_collaboration := least(100, greatest(10, 20 + v_active * 8 + least(v_team * 5, 35)));
  v_knowledge := least(100, greatest(15, 20 + case when v_onboarding_started then 15 else 0 end + coalesce(public._apmc275_latest_self_level(p_company_id, 'knowledge_management'), 0) * 8));
  v_customer_success := least(100, greatest(10, 15 + v_packs * 15 + v_integrations * 10 + case when v_onboarding_started then 15 else 0 end));
  v_security := least(100, greatest(5, 15 + v_2fa * 20 + v_admins * 5));
  v_integrations_score := least(100, greatest(5, 10 + v_integrations * 25));
  v_packs_score := least(100, greatest(5, 10 + v_packs * 20));
  v_decisions_score := least(100, greatest(10, 15 + v_decisions * 8 + case when v_pending_approvals > 0 then 10 else 0 end));
  v_memory := least(100, greatest(10, 15 + least(v_activity_events * 2, 40) + v_completed_follow_ups * 3));

  v_self := public._apmc275_latest_self_level(p_company_id, 'governance');
  v_categories := v_categories || public._apmc275_build_category('governance', v_governance, v_self, 'governanceRoles', 'governanceApprovals', 'governanceAction', 'approvals', 'knowledgeGovernance');

  v_self := public._apmc275_latest_self_level(p_company_id, 'operations');
  v_categories := v_categories || public._apmc275_build_category('operations', v_operations, v_self, 'operationsFollowThrough', 'operationsBacklog', 'operationsAction', 'followUps', 'knowledgeOperations');

  v_self := public._apmc275_latest_self_level(p_company_id, 'collaboration');
  v_categories := v_categories || public._apmc275_build_category('collaboration', v_collaboration, v_self, 'collaborationTeam', 'collaborationEngagement', 'collaborationAction', 'teamManagement', 'knowledgeCollaboration');

  v_self := public._apmc275_latest_self_level(p_company_id, 'knowledge_management');
  v_categories := v_categories || public._apmc275_build_category('knowledge_management', v_knowledge, v_self, 'knowledgeFoundation', 'knowledgeDepth', 'knowledgeAction', 'knowledgeCenter', 'knowledgeResources');

  v_self := public._apmc275_latest_self_level(p_company_id, 'customer_success');
  v_categories := v_categories || public._apmc275_build_category('customer_success', v_customer_success, v_self, 'customerSuccessAdoption', 'customerSuccessExpansion', 'customerSuccessAction', 'successCenter', 'knowledgeCustomerSuccess');

  v_self := public._apmc275_latest_self_level(p_company_id, 'security');
  v_categories := v_categories || public._apmc275_build_category('security', v_security, v_self, 'securityAwareness', 'securityHardening', 'securityAction', 'accountSecurity', 'knowledgeSecurity');

  v_self := public._apmc275_latest_self_level(p_company_id, 'integrations');
  v_categories := v_categories || public._apmc275_build_category('integrations', v_integrations_score, v_self, 'integrationsConnected', 'integrationsExpansion', 'integrationsAction', 'integrationsHub', 'knowledgeIntegrations');

  v_self := public._apmc275_latest_self_level(p_company_id, 'business_pack_adoption');
  v_categories := v_categories || public._apmc275_build_category('business_pack_adoption', v_packs_score, v_self, 'packsActive', 'packsBreadth', 'packsAction', 'businessPacks', 'knowledgeBusinessPacks');

  v_self := public._apmc275_latest_self_level(p_company_id, 'decision_processes');
  v_categories := v_categories || public._apmc275_build_category('decision_processes', v_decisions_score, v_self, 'decisionsTracked', 'decisionsFormalization', 'decisionsAction', 'decisionCenter', 'knowledgeDecisions');

  v_self := public._apmc275_latest_self_level(p_company_id, 'organizational_memory');
  v_categories := v_categories || public._apmc275_build_category('organizational_memory', v_memory, v_self, 'memoryActivity', 'memoryDocumentation', 'memoryAction', 'activityHistory', 'knowledgeMemory');

  v_scores := jsonb_build_object(
    'governance', v_governance,
    'operations', v_operations,
    'collaboration', v_collaboration,
    'knowledge_management', v_knowledge,
    'customer_success', v_customer_success,
    'security', v_security,
    'integrations', v_integrations_score,
    'business_pack_adoption', v_packs_score,
    'decision_processes', v_decisions_score,
    'organizational_memory', v_memory
  );

  select round(avg(x)::numeric)::integer into v_overall
  from (
    select (value)::int as x from jsonb_each_text(v_scores)
  ) s;

  return jsonb_build_object(
    'overall_score', coalesce(v_overall, 0),
    'overall_level', public._apmc275_score_to_level(coalesce(v_overall, 0)),
    'overall_level_key', public._apmc275_level_key(public._apmc275_score_to_level(coalesce(v_overall, 0))),
    'category_scores', v_scores,
    'categories', v_categories,
    'has_activity', v_team > 1 or v_packs > 0 or v_integrations > 0 or v_activity_events > 0
  );
end;
$$;

create or replace function public._apmc275_build_recommendations(p_categories jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_cat jsonb;
  v_level integer;
begin
  for v_cat in select * from jsonb_array_elements(p_categories)
  loop
    v_level := (v_cat->>'level')::integer;
    if v_cat->>'key' = 'security' and v_level < 3 then
      v_recs := v_recs || jsonb_build_object('id', 'enable-2fa', 'key', 'enable2fa', 'priority', 'high', 'category', 'security');
    elsif v_cat->>'key' = 'operations' and v_level < 3 then
      v_recs := v_recs || jsonb_build_object('id', 'improve-follow-ups', 'key', 'improveFollowUps', 'priority', 'high', 'category', 'operations');
    elsif v_cat->>'key' = 'business_pack_adoption' and v_level < 3 then
      v_recs := v_recs || jsonb_build_object('id', 'expand-packs', 'key', 'expandPacks', 'priority', 'medium', 'category', 'business_pack_adoption');
    elsif v_cat->>'key' = 'decision_processes' and v_level < 3 then
      v_recs := v_recs || jsonb_build_object('id', 'formalize-decisions', 'key', 'formalizeDecisions', 'priority', 'medium', 'category', 'decision_processes');
    elsif v_cat->>'key' = 'governance' and v_level < 3 then
      v_recs := v_recs || jsonb_build_object('id', 'admin-coverage', 'key', 'adminCoverage', 'priority', 'medium', 'category', 'governance');
    elsif v_cat->>'key' = 'knowledge_management' and v_level < 3 then
      v_recs := v_recs || jsonb_build_object('id', 'strengthen-docs', 'key', 'strengthenDocs', 'priority', 'low', 'category', 'knowledge_management');
    end if;
  end loop;
  if jsonb_array_length(v_recs) = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'continue-focus', 'key', 'continueFocus', 'priority', 'low', 'category', 'general');
  end if;
  return v_recs;
end;
$$;

create or replace function public._apmc275_record_snapshot(p_company_id uuid, p_bundle jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.app_portal_maturity_history h
    where h.company_id = p_company_id and h.recorded_at > now() - interval '24 hours'
  ) then
    insert into public.app_portal_maturity_history (company_id, overall_score, category_scores)
    values (p_company_id, (p_bundle->>'overall_score')::integer, coalesce(p_bundle->'category_scores', '{}'::jsonb));
  end if;
end;
$$;

create or replace function public.get_app_portal_capability_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_bundle jsonb;
  v_categories jsonb;
  v_history jsonb := '[]'::jsonb;
  v_prev integer;
  v_trend text := 'stable';
  v_highest jsonb := '[]'::jsonb;
  v_lowest jsonb := '[]'::jsonb;
  v_focus jsonb := '[]'::jsonb;
  v_milestones jsonb := '[]'::jsonb;
  v_recommendations jsonb;
begin
  v_access := public._apmc275_require_capability_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_bundle := public._apmc275_compute_bundle(v_company_id);
  v_categories := coalesce(v_bundle->'categories', '[]'::jsonb);

  select coalesce(jsonb_agg(jsonb_build_object(
    'recorded_at', h.recorded_at,
    'overall_score', h.overall_score,
    'category_scores', h.category_scores
  ) order by h.recorded_at desc), '[]'::jsonb)
  into v_history
  from (
    select * from public.app_portal_maturity_history h
    where h.company_id = v_company_id
    order by h.recorded_at desc
    limit 12
  ) h;

  select h.overall_score into v_prev
  from public.app_portal_maturity_history h
  where h.company_id = v_company_id
  order by h.recorded_at desc
  offset 1 limit 1;

  if v_prev is not null then
    if (v_bundle->>'overall_score')::integer > v_prev then v_trend := 'improving';
    elsif (v_bundle->>'overall_score')::integer < v_prev then v_trend := 'declining';
    end if;
  elsif (v_bundle->>'has_activity')::boolean then
    v_trend := 'improving';
  end if;

  select coalesce(jsonb_agg(x.c), '[]'::jsonb)
  into v_highest
  from (
    select e.value as c
    from jsonb_array_elements(v_categories) e
    order by (e.value->>'level')::int desc
    limit 3
  ) x;

  select coalesce(jsonb_agg(x.c), '[]'::jsonb)
  into v_lowest
  from (
    select e.value as c
    from jsonb_array_elements(v_categories) e
    order by (e.value->>'level')::int asc
    limit 3
  ) x;

  select coalesce(jsonb_agg(jsonb_build_object('key', c->>'key', 'level', c->>'level')), '[]'::jsonb)
  into v_focus
  from jsonb_array_elements(v_categories) c
  where (c->>'level')::integer <= 2;

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', c->>'key',
    'level', c->>'level',
    'completed_at', now()
  )), '[]'::jsonb)
  into v_milestones
  from jsonb_array_elements(v_categories) c
  where (c->>'level')::integer >= 4;

  v_recommendations := public._apmc275_build_recommendations(v_categories);

  return jsonb_build_object(
    'found', true,
    'has_activity', coalesce((v_bundle->>'has_activity')::boolean, false),
    'dashboard', jsonb_build_object(
      'overall_score', (v_bundle->>'overall_score')::integer,
      'overall_level', (v_bundle->>'overall_level')::integer,
      'overall_level_key', v_bundle->>'overall_level_key',
      'trend', v_trend,
      'highest_categories', v_highest,
      'lowest_categories', v_lowest,
      'focus_areas', v_focus
    ),
    'categories', v_categories,
    'recommendations', v_recommendations,
    'progress', jsonb_build_object(
      'history', v_history,
      'trend', v_trend,
      'recent_milestones', v_milestones,
      'continued_focus', v_focus
    ),
    'principle', 'Self-improvement over time — your organization compared only to its own progress.'
  );
end;
$$;

create or replace function public.get_app_portal_capability_categories()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_center jsonb;
begin
  v_center := public.get_app_portal_capability_center();
  return jsonb_build_object(
    'found', true,
    'categories', coalesce(v_center->'categories', '[]'::jsonb)
  );
end;
$$;

create or replace function public.post_app_portal_capability_self_assessment(
  p_category_key text,
  p_level integer,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_allowed text[] := array[
    'governance', 'operations', 'collaboration', 'knowledge_management', 'customer_success',
    'security', 'integrations', 'business_pack_adoption', 'decision_processes', 'organizational_memory'
  ];
begin
  v_access := public._apmc275_require_capability_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if not (p_category_key = any(v_allowed)) then
    raise exception 'Invalid category';
  end if;
  if p_level < 1 or p_level > 5 then
    raise exception 'Level must be between 1 and 5';
  end if;

  insert into public.app_portal_maturity_self_assessments (company_id, category_key, level, notes, submitted_by)
  values (v_company_id, p_category_key, p_level, nullif(trim(p_notes), ''), v_user_id);

  return public.get_app_portal_capability_center();
end;
$$;

grant execute on function public.get_app_portal_capability_center() to authenticated;
grant execute on function public.get_app_portal_capability_categories() to authenticated;
grant execute on function public.post_app_portal_capability_self_assessment(text, integer, text) to authenticated;
