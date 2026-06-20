-- Phase 311 (APP) — Enterprise Benchmarking & Maturity Intelligence Center

create table if not exists public.app_portal_enterprise_benchmarking_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_enterprise_benchmarking_dimensions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  dimension_key text not null,
  dimension_name text not null default '',
  organizational_area text not null default 'operations',
  maturity_level integer not null default 1 check (maturity_level between 1 and 5),
  maturity_score integer not null default 0 check (maturity_score between 0 and 100),
  priority_level text not null default 'moderate' check (priority_level in ('low', 'moderate', 'high', 'critical')),
  strengths jsonb not null default '[]'::jsonb,
  improvement_opportunities jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  related_capabilities jsonb not null default '[]'::jsonb,
  learning_resources jsonb not null default '[]'::jsonb,
  historical_trend jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  last_assessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, dimension_key)
);

create index if not exists app_portal_enterprise_benchmarking_dimensions_idx
  on public.app_portal_enterprise_benchmarking_dimensions (company_id, maturity_level, organizational_area);

create table if not exists public.app_portal_enterprise_benchmarking_assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  dimension_key text not null default '',
  assessor_name text not null default '',
  assessment_notes text not null default '',
  maturity_level integer not null default 1 check (maturity_level between 1 and 5),
  assessed_by uuid references public.users (id) on delete set null,
  assessed_at timestamptz not null default now()
);

create index if not exists app_portal_enterprise_benchmarking_assessments_idx
  on public.app_portal_enterprise_benchmarking_assessments (company_id, dimension_key, assessed_at desc);

create table if not exists public.app_portal_enterprise_benchmarking_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  snapshot_date date not null default current_date,
  overall_maturity_score integer not null default 0,
  operational_maturity_score integer not null default 0,
  governance_maturity_score integer not null default 0,
  learning_maturity_score integer not null default 0,
  executive_intelligence_score integer not null default 0,
  business_pack_maturity_score integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, snapshot_date)
);

create table if not exists public.app_portal_enterprise_benchmarking_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  dimension_key text not null default '',
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_enterprise_benchmarking_timeline_idx
  on public.app_portal_enterprise_benchmarking_timeline (company_id, created_at desc);

create table if not exists public.app_portal_enterprise_benchmarking_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  dimension_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_enterprise_benchmarking_audit_idx
  on public.app_portal_enterprise_benchmarking_audit_logs (company_id, created_at desc);

alter table public.app_portal_enterprise_benchmarking_state enable row level security;
alter table public.app_portal_enterprise_benchmarking_dimensions enable row level security;
alter table public.app_portal_enterprise_benchmarking_assessments enable row level security;
alter table public.app_portal_enterprise_benchmarking_snapshots enable row level security;
alter table public.app_portal_enterprise_benchmarking_timeline enable row level security;
alter table public.app_portal_enterprise_benchmarking_audit_logs enable row level security;
revoke all on public.app_portal_enterprise_benchmarking_state from authenticated, anon;
revoke all on public.app_portal_enterprise_benchmarking_dimensions from authenticated, anon;
revoke all on public.app_portal_enterprise_benchmarking_assessments from authenticated, anon;
revoke all on public.app_portal_enterprise_benchmarking_snapshots from authenticated, anon;
revoke all on public.app_portal_enterprise_benchmarking_timeline from authenticated, anon;
revoke all on public.app_portal_enterprise_benchmarking_audit_logs from authenticated, anon;

create or replace function public._aebmi311_access_context()
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

  select coalesce(bs.manager_access_enabled, false), coalesce(bs.admin_access_enabled, false)
  into v_manager_enabled, v_admin_enabled
  from public.app_portal_enterprise_benchmarking_state bs
  where bs.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true, 'can_assess', true
    );
  elsif v_role = 'organization_admin' and v_admin_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true, 'can_assess', true
    );
  elsif v_role = 'organization_manager' and v_manager_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', false, 'can_manage', false, 'can_view', true, 'can_assess', false
    );
  end if;

  raise exception 'Enterprise Benchmarking access requires owner authorization or explicit grant';
end;
$$;

create or replace function public._aebmi311_score_to_level(p_score integer)
returns integer
language sql
immutable
as $$
  select case
    when p_score >= 81 then 5
    when p_score >= 61 then 4
    when p_score >= 41 then 3
    when p_score >= 21 then 2
    else 1
  end;
$$;

create or replace function public._aebmi311_level_label(p_level integer)
returns text
language sql
immutable
as $$
  select case p_level
    when 5 then 'transformational'
    when 4 then 'advanced'
    when 3 then 'established'
    when 2 then 'developing'
    else 'emerging'
  end;
$$;

create or replace function public._aebmi311_dimension_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_decision_making', 'name', 'Leadership & Decision Making', 'area', 'executive'),
    jsonb_build_object('key', 'operational_excellence', 'name', 'Operational Excellence', 'area', 'operations'),
    jsonb_build_object('key', 'governance_compliance', 'name', 'Governance & Compliance', 'area', 'governance'),
    jsonb_build_object('key', 'learning_development', 'name', 'Learning & Development', 'area', 'learning'),
    jsonb_build_object('key', 'customer_success', 'name', 'Customer Success', 'area', 'customer'),
    jsonb_build_object('key', 'business_pack_adoption', 'name', 'Business Pack Adoption', 'area', 'business_packs'),
    jsonb_build_object('key', 'strategic_execution', 'name', 'Strategic Execution', 'area', 'strategy'),
    jsonb_build_object('key', 'risk_resilience', 'name', 'Risk & Resilience', 'area', 'risk'),
    jsonb_build_object('key', 'automation_readiness', 'name', 'Automation Readiness', 'area', 'automation'),
    jsonb_build_object('key', 'organizational_intelligence', 'name', 'Organizational Intelligence', 'area', 'intelligence')
  );
$$;

create or replace function public._aebmi311_infer_dimension_score(p_company_id uuid, p_dimension_key text)
returns integer
language plpgsql
stable
as $$
declare
  v_score integer := 45;
  v_avg integer;
begin
  if p_dimension_key = 'business_pack_adoption' and to_regclass('public.app_portal_business_pack_adoption') is not null then
    select coalesce(round(avg(a.adoption_score)), 45) into v_avg
    from public.app_portal_business_pack_adoption a where a.company_id = p_company_id;
    return coalesce(v_avg, 45);
  end if;

  if p_dimension_key = 'governance_compliance' and to_regclass('public.app_portal_business_pack_compliance_records') is not null then
    select coalesce(round(avg(case compliance_status when 'aligned' then 85 when 'healthy' then 70 when 'requires_review' then 50 else 35 end)), 45)
    into v_avg from public.app_portal_business_pack_compliance_records where company_id = p_company_id;
    return coalesce(v_avg, 45);
  end if;

  if p_dimension_key = 'automation_readiness' and to_regclass('public.app_portal_business_pack_automation_records') is not null then
    select coalesce(round(avg(success_rate)), 45) into v_avg
    from public.app_portal_business_pack_automation_records where company_id = p_company_id;
    return coalesce(v_avg, 45);
  end if;

  if p_dimension_key = 'leadership_decision_making' and to_regclass('public.app_portal_business_pack_executive_portfolio_records') is not null then
    select coalesce(round(avg(value_score)), 45) into v_avg
    from public.app_portal_business_pack_executive_portfolio_records where company_id = p_company_id;
    return coalesce(v_avg, 45);
  end if;

  return v_score;
end;
$$;

create or replace function public._aebmi311_sync_dimensions(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dim jsonb;
  v_score integer;
  v_level integer;
begin
  insert into public.app_portal_enterprise_benchmarking_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_dim in select * from jsonb_array_elements(public._aebmi311_dimension_catalog())
  loop
    v_score := public._aebmi311_infer_dimension_score(p_company_id, v_dim->>'key');
    v_level := public._aebmi311_score_to_level(v_score);

    insert into public.app_portal_enterprise_benchmarking_dimensions (
      company_id, dimension_key, dimension_name, organizational_area, maturity_level, maturity_score,
      strengths, improvement_opportunities, recommended_actions, related_capabilities, learning_resources
    ) values (
      p_company_id, v_dim->>'key', v_dim->>'name', v_dim->>'area', v_level, v_score,
      case when v_score >= 60 then jsonb_build_array('Consistent practices observed') else '[]'::jsonb end,
      case when v_score < 60 then jsonb_build_array('Structured improvement pathway recommended') else '[]'::jsonb end,
      jsonb_build_array('Review maturity indicators periodically'),
      jsonb_build_array(v_dim->>'name'),
      jsonb_build_array('Knowledge Center maturity guidance')
    )
    on conflict (company_id, dimension_key) do update set
      dimension_name = excluded.dimension_name,
      organizational_area = excluded.organizational_area,
      maturity_score = public._aebmi311_infer_dimension_score(p_company_id, excluded.dimension_key),
      maturity_level = public._aebmi311_score_to_level(public._aebmi311_infer_dimension_score(p_company_id, excluded.dimension_key)),
      updated_at = now();
  end loop;
end;
$$;

create or replace function public._aebmi311_dimension_card(p_row public.app_portal_enterprise_benchmarking_dimensions)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.dimension_key,
    'dimension_key', p_row.dimension_key,
    'name', p_row.dimension_name,
    'organizational_area', p_row.organizational_area,
    'maturity_level', p_row.maturity_level,
    'maturity_level_label', public._aebmi311_level_label(p_row.maturity_level),
    'maturity_score', p_row.maturity_score,
    'priority_level', p_row.priority_level,
    'strengths', p_row.strengths,
    'improvement_opportunities', p_row.improvement_opportunities,
    'recommended_actions', p_row.recommended_actions,
    'related_capabilities', p_row.related_capabilities,
    'learning_resources', p_row.learning_resources,
    'historical_trend', p_row.historical_trend,
    'last_assessed_at', p_row.last_assessed_at
  );
$$;

create or replace function public._aebmi311_avg_score(p_company_id uuid, p_keys text[])
returns integer
language plpgsql
stable
as $$
declare v_avg numeric;
begin
  select round(avg(d.maturity_score)) into v_avg
  from public.app_portal_enterprise_benchmarking_dimensions d
  where d.company_id = p_company_id and d.dimension_key = any(p_keys);
  return coalesce(v_avg, 0)::integer;
end;
$$;

create or replace function public._aebmi311_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare v_recs jsonb := '[]'::jsonb; v_row record;
begin
  for v_row in
    select d.* from public.app_portal_enterprise_benchmarking_dimensions d
    where d.company_id = p_company_id and d.maturity_level <= 2
  loop
    if v_row.dimension_key = 'learning_development' then
      v_recs := v_recs || jsonb_build_object('id', 'learn-' || v_row.dimension_key, 'key', 'expandLearningInitiatives', 'dimension_key', v_row.dimension_key);
    elsif v_row.dimension_key = 'business_pack_adoption' then
      v_recs := v_recs || jsonb_build_object('id', 'adopt-' || v_row.dimension_key, 'key', 'increaseBusinessPackAdoption', 'dimension_key', v_row.dimension_key);
    elsif v_row.dimension_key = 'governance_compliance' then
      v_recs := v_recs || jsonb_build_object('id', 'gov-' || v_row.dimension_key, 'key', 'reviewGovernanceResponsibilities', 'dimension_key', v_row.dimension_key);
    elsif v_row.dimension_key = 'strategic_execution' then
      v_recs := v_recs || jsonb_build_object('id', 'strat-' || v_row.dimension_key, 'key', 'prioritizeStrategicExecution', 'dimension_key', v_row.dimension_key);
    end if;
  end loop;

  v_recs := v_recs || jsonb_build_object('id', 'exec-review-' || p_company_id, 'key', 'strengthenExecutiveReviews');
  v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || p_company_id, 'key', 'celebrateMaturityAdvancements');

  return v_recs;
end;
$$;

create or replace function public._aebmi311_build_insights(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'strongest_dimensions', (
      select coalesce(jsonb_agg(jsonb_build_object('dimension_key', s.dimension_key, 'name', s.dimension_name, 'score', s.maturity_score)), '[]'::jsonb)
      from (
        select d.dimension_key, d.dimension_name, d.maturity_score
        from public.app_portal_enterprise_benchmarking_dimensions d
        where d.company_id = p_company_id
        order by d.maturity_score desc limit 3
      ) s
    ),
    'lowest_dimensions', (
      select coalesce(jsonb_agg(jsonb_build_object('dimension_key', s.dimension_key, 'name', s.dimension_name, 'score', s.maturity_score)), '[]'::jsonb)
      from (
        select d.dimension_key, d.dimension_name, d.maturity_score
        from public.app_portal_enterprise_benchmarking_dimensions d
        where d.company_id = p_company_id
        order by d.maturity_score asc limit 3
      ) s
    ),
    'improving_rapidly', '[]'::jsonb,
    'limited_progress', (
      select coalesce(jsonb_agg(jsonb_build_object('dimension_key', s.dimension_key, 'name', s.dimension_name)), '[]'::jsonb)
      from (
        select d.dimension_key, d.dimension_name
        from public.app_portal_enterprise_benchmarking_dimensions d
        where d.company_id = p_company_id and d.maturity_level <= 2
        limit 3
      ) s
    ),
    'cross_functional_patterns', jsonb_build_array(
      'Governance and operational maturity often advance together',
      'Business Pack adoption supports broader organizational intelligence'
    )
  );
end;
$$;

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
  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);

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

  insert into public.app_portal_enterprise_benchmarking_snapshots (
    company_id, overall_maturity_score, operational_maturity_score, governance_maturity_score,
    learning_maturity_score, executive_intelligence_score, business_pack_maturity_score
  ) values (v_company_id, v_overall, v_operational, v_governance, v_learning, v_executive, v_business_pack)
  on conflict (company_id, snapshot_date) do update set
    overall_maturity_score = excluded.overall_maturity_score,
    operational_maturity_score = excluded.operational_maturity_score,
    governance_maturity_score = excluded.governance_maturity_score,
    learning_maturity_score = excluded.learning_maturity_score,
    executive_intelligence_score = excluded.executive_intelligence_score,
    business_pack_maturity_score = excluded.business_pack_maturity_score;

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
  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);

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
  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);
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
  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);

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

create or replace function public.assess_app_portal_enterprise_benchmarking(
  p_dimension_key text default '',
  p_assessment_notes text default null,
  p_maturity_level integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_assessment_id uuid; v_level integer; v_score integer;
begin
  v_ctx := public._aebmi311_access_context();
  if coalesce(v_ctx->>'can_assess', 'false') <> 'true' then
    raise exception 'Maturity assessment requires owner authorization or higher';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_dimension_key <> '' and not exists (
    select 1 from public.app_portal_enterprise_benchmarking_dimensions d
    where d.company_id = v_company_id and d.dimension_key = p_dimension_key
  ) then raise exception 'Maturity dimension not found'; end if;

  v_level := coalesce(p_maturity_level, 3);
  v_score := case v_level when 5 then 90 when 4 then 70 when 3 then 55 when 2 then 35 else 15 end;

  insert into public.app_portal_enterprise_benchmarking_assessments (
    company_id, dimension_key, assessor_name, assessment_notes, maturity_level, assessed_by, assessed_at
  ) values (
    v_company_id, coalesce(p_dimension_key, ''),
    coalesce((select u.display_name from public.users u where u.id = v_user_id), 'Assessor'),
    coalesce(p_assessment_notes, ''), v_level, v_user_id, now()
  ) returning id into v_assessment_id;

  if p_dimension_key <> '' then
    update public.app_portal_enterprise_benchmarking_dimensions set
      maturity_level = v_level, maturity_score = greatest(maturity_score, v_score),
      last_assessed_at = now(), updated_at = now()
    where company_id = v_company_id and dimension_key = p_dimension_key;
  end if;

  insert into public.app_portal_enterprise_benchmarking_timeline (
    company_id, dimension_key, event_type, description, performed_by
  ) values (
    v_company_id, coalesce(p_dimension_key, ''), 'assessment_completed',
    'Maturity assessment completed', v_user_id
  );

  insert into public.app_portal_enterprise_benchmarking_audit_logs (
    company_id, dimension_key, event_type, description, performed_by, metadata
  ) values (
    v_company_id, nullif(p_dimension_key, ''), 'maturity_assessment_recorded',
    'Maturity assessment recorded', v_user_id, jsonb_build_object('assessment_id', v_assessment_id)
  );

  return jsonb_build_object(
    'found', true, 'assessment_id', v_assessment_id,
    'dimension_key', nullif(p_dimension_key, ''), 'maturity_level', v_level,
    'message', 'Maturity assessment recorded — organizations define their own strategic objectives.'
  );
end;
$$;

grant execute on function public._aebmi311_access_context() to authenticated;
grant execute on function public.list_app_portal_enterprise_benchmarking(text, integer, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_enterprise_benchmarking_dimension(text) to authenticated;
grant execute on function public.get_app_portal_enterprise_benchmarking_recommendations() to authenticated;
grant execute on function public.get_app_portal_enterprise_benchmarking_timeline(text, date) to authenticated;
grant execute on function public.assess_app_portal_enterprise_benchmarking(text, text, integer) to authenticated;
