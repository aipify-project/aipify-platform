-- Phase 620 P1 — Customer Health repair: tenant_modules.tenant_id + read-only list GET.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('customer_health.view', 'View Customer Health', null, 'View customer health center'),
  ('customer_health.manage', 'Manage Customer Health', null, 'Start and manage customer health reviews')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'customer_health.view'),
  ('owner', 'customer_health.manage'),
  ('administrator', 'customer_health.view'),
  ('administrator', 'customer_health.manage'),
  ('manager', 'customer_health.view'),
  ('manager', 'customer_health.manage'),
  ('support_agent', 'customer_health.view'),
  ('viewer', 'customer_health.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

create or replace function public._achrc296_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
begin
  if not public.has_organization_permission('customer_health.view')
     and not public.has_organization_permission('customer_health.manage') then
    raise exception 'Permission denied: customer_health.view';
  end if;

  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', public.has_organization_permission('customer_health.manage'),
    'can_admin', public.has_organization_permission('customer_health.manage'),
    'is_member', public.has_organization_permission('customer_health.view')
      or public.has_organization_permission('customer_health.manage')
  );
end;
$$;

create or replace function public._achrc296_org_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_team_count integer := 0;
  v_2fa_count integer := 0;
  v_packs integer := 0;
  v_connected integer := 0;
  v_academy_completions integer := 0;
  v_academy_certs integer := 0;
  v_academy_assignments_open integer := 0;
  v_support_open integer := 0;
  v_support_resolved integer := 0;
  v_operations_records integer := 0;
  v_journey_started boolean := false;
  v_assistant_sessions integer := 0;
  v_customer_id uuid;
begin
  select c.id into v_customer_id
  from public.customers c
  where c.company_id = p_company_id
  limit 1;

  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa_count
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true;
  end if;

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*) filter (where ic.status = 'connected')::int into v_connected
    from public.app_portal_integration_connections ic where ic.company_id = p_company_id;
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
    select count(*)::int into v_academy_assignments_open
    from public.app_portal_academy_assignments a
    where a.company_id = p_company_id and a.status in ('assigned', 'in_progress', 'overdue');
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*) filter (where sr.status in ('open', 'in_review', 'waiting_for_customer', 'waiting_for_aipify'))::int,
           count(*) filter (where sr.status in ('resolved', 'closed'))::int
    into v_support_open, v_support_resolved
    from public.app_portal_support_requests sr where sr.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_support_assistant_context') is not null then
    select count(*)::int into v_assistant_sessions
    from public.app_portal_support_assistant_context c where c.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_commitments where company_id = p_company_id);
  end if;
  if to_regclass('public.app_portal_briefings') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_briefings where company_id = p_company_id);
  end if;

  if to_regclass('public.app_portal_customer_success_state') is not null then
    select cs.journey_started_at is not null into v_journey_started
    from public.app_portal_customer_success_state cs where cs.company_id = p_company_id;
  end if;

  return jsonb_build_object(
    'team_count', v_team_count,
    'two_fa_count', v_2fa_count,
    'packs', v_packs,
    'connected_integrations', v_connected,
    'academy_completions', v_academy_completions,
    'academy_certifications', v_academy_certs,
    'academy_assignments_open', v_academy_assignments_open,
    'support_open', v_support_open,
    'support_resolved', v_support_resolved,
    'assistant_sessions', v_assistant_sessions,
    'operations_records', v_operations_records,
    'journey_started', v_journey_started
  );
end;
$$;

create or replace function public.begin_app_portal_customer_health_review()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_scores jsonb;
begin
  if not public.has_organization_permission('customer_health.manage') then
    raise exception 'Permission denied: customer_health.manage';
  end if;

  v_ctx := public._achrc296_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_scores := public._achrc296_compute_scores(public._achrc296_org_metrics(v_company_id), true);

  insert into public.app_portal_customer_health_state (
    company_id, review_started_at, last_overall_score, last_engagement_score, last_snapshot_at, updated_by
  ) values (
    v_company_id, now(), (v_scores->>'overall_health_score')::int, (v_scores->>'engagement_score')::int, now(), v_user_id
  )
  on conflict (company_id) do update set
    review_started_at = coalesce(public.app_portal_customer_health_state.review_started_at, now()),
    last_overall_score = (v_scores->>'overall_health_score')::int,
    last_engagement_score = (v_scores->>'engagement_score')::int,
    last_snapshot_at = now(),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_customer_health_audit_logs (company_id, event_type, description, performed_by)
  values (v_company_id, 'review_started', 'Customer health review initiated', v_user_id);

  return public.list_app_portal_customer_health(null, null, null, null, null, null, null);
end;
$$;

create or replace function public.list_app_portal_customer_health(
  p_category text default null,
  p_period_from date default null,
  p_department text default null,
  p_priority text default null,
  p_trend text default null,
  p_recommendation_status text default null,
  p_search text default null
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
  v_started timestamptz;
  v_prior_overall integer;
  v_metrics jsonb;
  v_scores jsonb;
  v_overall integer;
  v_status text;
  v_trend text;
  v_recs jsonb;
  v_open_recs integer;
  v_indicators jsonb;
  v_engagement jsonb;
  v_support jsonb;
  v_personal jsonb := '[]'::jsonb;
begin
  v_ctx := public._achrc296_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select hs.review_started_at, hs.last_overall_score
  into v_started, v_prior_overall
  from public.app_portal_customer_health_state hs where hs.company_id = v_company_id;

  v_metrics := public._achrc296_org_metrics(v_company_id);
  v_scores := public._achrc296_compute_scores(v_metrics, v_started is not null);
  v_overall := (v_scores->>'overall_health_score')::int;
  v_status := public._achrc296_health_status(v_overall);
  v_trend := public._achrc296_trend(v_overall, v_prior_overall, v_started is not null);

  if p_trend is not null and v_trend <> p_trend then
    return jsonb_build_object('found', true, 'filtered_out', true, 'review_started', v_started is not null);
  end if;

  v_recs := public._achrc296_build_recommendations(v_metrics);
  if p_priority is not null or p_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_category is null or r->>'category' = p_category)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;
  v_open_recs := jsonb_array_length(v_recs);

  v_indicators := jsonb_build_object(
    'platform_engagement', (v_scores->>'engagement_score')::int,
    'training_participation', least(100, round(((v_metrics->>'academy_completions')::numeric / greatest(1, v_metrics->>'team_count')::int) * 20)::int),
    'support_interactions', (v_metrics->>'support_open')::int + (v_metrics->>'support_resolved')::int,
    'adoption_progress', (v_scores->>'adoption_score')::int,
    'security_completion', case when (v_metrics->>'team_count')::int > 0
      then round(((v_metrics->>'two_fa_count')::numeric / (v_metrics->>'team_count')::int) * 100)::int else 0 end,
    'integration_activity', (v_metrics->>'connected_integrations')::int,
    'recommendation_completion', 0
  );

  v_engagement := jsonb_build_object(
    'active_teams', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Operations' as x where (v_metrics->>'operations_records')::int > 0
        union all select 'Learning' where (v_metrics->>'academy_completions')::int > 0
        union all select 'Support' where (v_metrics->>'support_resolved')::int > 0
      ) s
    ),
    'departments_requiring_support', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Security adoption' as x where (v_metrics->>'two_fa_count')::int < (v_metrics->>'team_count')::int
        union all select 'Training completion' where (v_metrics->>'academy_assignments_open')::int > 0
      ) s
    ),
    'underutilized_capabilities', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Business Packs' as x where (v_metrics->>'packs')::int = 0
        union all select 'Integrations' where (v_metrics->>'connected_integrations')::int = 0
        union all select 'Knowledge Center self-service' where (v_metrics->>'assistant_sessions')::int = 0
      ) s
    ),
    'positive_momentum', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Certifications earned' as x where (v_metrics->>'academy_certifications')::int > 0
        union all select 'Support requests resolved' where (v_metrics->>'support_resolved')::int > 0
      ) s
    ),
    'declining_activity', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Open support backlog' as x where (v_metrics->>'support_open')::int > 2
      ) s
    )
  );

  v_support := jsonb_build_object(
    'open_requests', (v_metrics->>'support_open')::int,
    'resolved_requests', (v_metrics->>'support_resolved')::int,
    'resolution_trend', case when (v_metrics->>'support_resolved')::int > (v_metrics->>'support_open')::int then 'improving' else 'stable' end,
    'satisfaction_indicator', (v_scores->>'support_satisfaction_score')::int,
    'self_service_sessions', (v_metrics->>'assistant_sessions')::int,
    'knowledge_engagement', (v_metrics->>'academy_completions')::int
  );

  if to_regclass('public.app_portal_academy_assignments') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id, 'title', a.course_title, 'status', a.status, 'due_date', a.due_date
    )), '[]'::jsonb) into v_personal
    from public.app_portal_academy_assignments a
    where a.company_id = v_company_id and a.assignee_user_id = v_user_id and a.status <> 'completed';
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'review_started', v_started is not null,
    'overall_health_score', v_overall,
    'engagement_score', (v_scores->>'engagement_score')::int,
    'support_satisfaction_score', (v_scores->>'support_satisfaction_score')::int,
    'adoption_score', (v_scores->>'adoption_score')::int,
    'learning_completion_score', (v_scores->>'learning_completion_score')::int,
    'health_status', v_status,
    'relationship_trend', v_trend,
    'open_recommendations_count', v_open_recs,
    'health_indicators', v_indicators,
    'engagement_insights', v_engagement,
    'support_insights', v_support,
    'recommendations', v_recs,
    'personal_recommendations', v_personal,
    'department_reporting', case when coalesce(v_ctx->>'can_manage', 'false') = 'true' then jsonb_build_object(
      'department', coalesce(nullif(trim(p_department), ''), 'organization'),
      'engagement_score', (v_scores->>'engagement_score')::int,
      'learning_participation', (v_indicators->>'training_participation')::int
    ) else null end,
    'principle', 'Health indicators provide guidance — they are not judgments. Aipify remains a trusted long-term companion.'
  );
end;
$$;

notify pgrst, 'reload schema';
