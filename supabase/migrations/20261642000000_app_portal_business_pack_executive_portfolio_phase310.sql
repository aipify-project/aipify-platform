-- Phase 310 (APP) — Business Pack Executive Portfolio Center

create table if not exists public.app_portal_business_pack_executive_portfolio_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_executive_portfolio_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  portfolio_status text not null default 'stable' check (portfolio_status in (
    'high_performing', 'healthy', 'stable', 'requires_optimization', 'executive_attention_required'
  )),
  maturity_level text not null default 'developing_portfolio' check (maturity_level in (
    'emerging_portfolio', 'developing_portfolio', 'mature_portfolio', 'strategic_portfolio', 'transformational_portfolio'
  )),
  priority_level text not null default 'informational' check (priority_level in (
    'informational', 'opportunity', 'important', 'executive_attention_required'
  )),
  adoption_score integer not null default 0 check (adoption_score between 0 and 100),
  value_score integer not null default 0 check (value_score between 0 and 100),
  governance_score integer not null default 0 check (governance_score between 0 and 100),
  compliance_status text not null default 'healthy',
  lifecycle_stage text not null default 'active',
  executive_sponsor text not null default '',
  recommended_action text not null default '',
  estimated_value numeric(14, 2) not null default 0,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_executive_portfolio_records_idx
  on public.app_portal_business_pack_executive_portfolio_records (company_id, portfolio_status, maturity_level, priority_level);

create table if not exists public.app_portal_business_pack_executive_portfolio_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null default '',
  review_type text not null default 'quarterly_executive' check (review_type in (
    'quarterly_executive', 'semi_annual', 'annual_portfolio', 'ad_hoc'
  )),
  review_outcome text not null default 'continue_investment' check (review_outcome in (
    'continue_investment', 'optimize_investment', 'expand_investment', 'retire_capability', 'further_investigation_required'
  )),
  reviewer_name text not null default '',
  governance_notes text not null default '',
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_executive_portfolio_reviews_idx
  on public.app_portal_business_pack_executive_portfolio_reviews (company_id, pack_key, reviewed_at desc);

create table if not exists public.app_portal_business_pack_executive_portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  snapshot_date date not null default current_date,
  portfolio_health_score integer not null default 0,
  total_installed integer not null default 0,
  total_active integer not null default 0,
  total_value_realized numeric(14, 2) not null default 0,
  packs_requiring_attention integer not null default 0,
  portfolio_growth_trend text not null default 'stable',
  maturity_level text not null default 'developing_portfolio',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, snapshot_date)
);

create table if not exists public.app_portal_business_pack_executive_portfolio_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null default '',
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_executive_portfolio_timeline_idx
  on public.app_portal_business_pack_executive_portfolio_timeline (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_executive_portfolio_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_executive_portfolio_audit_idx
  on public.app_portal_business_pack_executive_portfolio_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_executive_portfolio_state enable row level security;
alter table public.app_portal_business_pack_executive_portfolio_records enable row level security;
alter table public.app_portal_business_pack_executive_portfolio_reviews enable row level security;
alter table public.app_portal_business_pack_executive_portfolio_snapshots enable row level security;
alter table public.app_portal_business_pack_executive_portfolio_timeline enable row level security;
alter table public.app_portal_business_pack_executive_portfolio_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_executive_portfolio_state from authenticated, anon;
revoke all on public.app_portal_business_pack_executive_portfolio_records from authenticated, anon;
revoke all on public.app_portal_business_pack_executive_portfolio_reviews from authenticated, anon;
revoke all on public.app_portal_business_pack_executive_portfolio_snapshots from authenticated, anon;
revoke all on public.app_portal_business_pack_executive_portfolio_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_executive_portfolio_audit_logs from authenticated, anon;

create or replace function public._abpep310_access_context()
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
  v_can_view boolean := false;
  v_can_full boolean := false;
  v_can_review boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(ps.manager_access_enabled, false), coalesce(ps.admin_access_enabled, false)
  into v_manager_enabled, v_admin_enabled
  from public.app_portal_business_pack_executive_portfolio_state ps
  where ps.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    v_can_view := true;
    v_can_full := true;
    v_can_review := true;
  elsif v_role = 'organization_admin' and v_admin_enabled then
    v_can_view := true;
    v_can_full := true;
    v_can_review := true;
  elsif v_role = 'organization_manager' and v_manager_enabled then
    v_can_view := true;
    v_can_review := true;
  end if;

  if not v_can_view then
    raise exception 'Executive Portfolio Center access requires owner authorization or explicit grant';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_can_full,
    'can_manage', v_can_full,
    'can_view', v_can_view,
    'can_review', v_can_review
  );
end;
$$;

create or replace function public._abpep310_infer_portfolio_status(
  p_adoption integer, p_value integer, p_governance integer
)
returns text
language sql
immutable
as $$
  select case
    when p_adoption >= 80 and p_value >= 75 and p_governance >= 70 then 'high_performing'
    when p_adoption >= 60 and p_value >= 50 then 'healthy'
    when p_adoption >= 40 then 'stable'
    when p_adoption >= 25 or p_governance < 40 then 'requires_optimization'
    else 'executive_attention_required'
  end;
$$;

create or replace function public._abpep310_infer_maturity(p_total integer, p_avg_adoption integer)
returns text
language sql
immutable
as $$
  select case
    when p_total = 0 then 'emerging_portfolio'
    when p_total <= 2 and p_avg_adoption < 40 then 'emerging_portfolio'
    when p_avg_adoption < 55 then 'developing_portfolio'
    when p_avg_adoption < 75 then 'mature_portfolio'
    when p_avg_adoption < 90 then 'strategic_portfolio'
    else 'transformational_portfolio'
  end;
$$;

create or replace function public._abpep310_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption integer;
  v_value integer;
  v_governance integer;
  v_compliance text;
  v_lifecycle text;
  v_sponsor text;
  v_status text;
  v_value_amount numeric;
  v_action text;
begin
  insert into public.app_portal_business_pack_executive_portfolio_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta')
    loop
      v_adoption := 0;
      v_value := 0;
      v_governance := 50;
      v_compliance := 'healthy';
      v_lifecycle := 'active';
      v_sponsor := '';
      v_value_amount := 0;

      if to_regclass('public.app_portal_business_pack_adoption') is not null then
        select a.adoption_score into v_adoption
        from public.app_portal_business_pack_adoption a
        where a.company_id = p_company_id and a.pack_key = v_pack.module_key;
      end if;
      v_adoption := coalesce(v_adoption, 0);
      v_value := least(100, v_adoption + 10);

      if to_regclass('public.app_portal_business_pack_governance_records') is not null then
        select case gr.governance_status
          when 'well_governed' then 90 when 'healthy' then 75 when 'stable' then 60
          when 'requires_review' then 45 else 30 end, gr.primary_owner
        into v_governance, v_sponsor
        from public.app_portal_business_pack_governance_records gr
        where gr.company_id = p_company_id and gr.pack_key = v_pack.module_key;
      end if;
      v_governance := coalesce(v_governance, 50);

      if to_regclass('public.app_portal_business_pack_compliance_records') is not null then
        select cr.compliance_status into v_compliance
        from public.app_portal_business_pack_compliance_records cr
        where cr.company_id = p_company_id and cr.pack_key = v_pack.module_key;
      end if;
      v_compliance := coalesce(v_compliance, 'healthy');

      if to_regclass('public.app_portal_business_pack_lifecycle_records') is not null then
        select lr.lifecycle_stage into v_lifecycle
        from public.app_portal_business_pack_lifecycle_records lr
        where lr.company_id = p_company_id and lr.pack_key = v_pack.module_key;
      end if;
      v_lifecycle := coalesce(v_lifecycle, 'active');

      if to_regclass('public.app_portal_business_pack_value_records') is not null then
        select vr.estimated_value into v_value_amount
        from public.app_portal_business_pack_value_records vr
        where vr.company_id = p_company_id and vr.pack_key = v_pack.module_key;
      end if;
      v_value_amount := coalesce(v_value_amount, round(v_adoption * 125::numeric, 2));

      v_status := public._abpep310_infer_portfolio_status(v_adoption, v_value, v_governance);
      v_action := case v_status
        when 'high_performing' then 'Celebrate portfolio success'
        when 'executive_attention_required' then 'Schedule executive review'
        when 'requires_optimization' then 'Review underperforming capability'
        else 'Continue monitoring'
      end;

      insert into public.app_portal_business_pack_executive_portfolio_records (
        company_id, pack_key, pack_name, portfolio_status, adoption_score, value_score,
        governance_score, compliance_status, lifecycle_stage, executive_sponsor,
        recommended_action, estimated_value, is_active, priority_level
      ) values (
        p_company_id, v_pack.module_key, initcap(replace(v_pack.module_key, '_', ' ')),
        v_status, v_adoption, v_value, v_governance, v_compliance, v_lifecycle,
        coalesce(v_sponsor, ''), v_action, v_value_amount, true,
        case when v_status = 'executive_attention_required' then 'executive_attention_required'
             when v_status = 'requires_optimization' then 'important'
             when v_status = 'high_performing' then 'opportunity'
             else 'informational' end
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        adoption_score = excluded.adoption_score,
        value_score = excluded.value_score,
        governance_score = excluded.governance_score,
        compliance_status = excluded.compliance_status,
        lifecycle_stage = excluded.lifecycle_stage,
        estimated_value = excluded.estimated_value,
        portfolio_status = public._abpep310_infer_portfolio_status(
          excluded.adoption_score, excluded.value_score, excluded.governance_score
        ),
        updated_at = now();
    end loop;
  end if;
end;
$$;

create or replace function public._abpep310_pack_card(p_row public.app_portal_business_pack_executive_portfolio_records)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.pack_key,
    'pack_key', p_row.pack_key,
    'name', p_row.pack_name,
    'portfolio_status', p_row.portfolio_status,
    'maturity_level', p_row.maturity_level,
    'priority_level', p_row.priority_level,
    'adoption_score', p_row.adoption_score,
    'value_score', p_row.value_score,
    'governance_score', p_row.governance_score,
    'compliance_status', p_row.compliance_status,
    'lifecycle_stage', p_row.lifecycle_stage,
    'executive_sponsor', p_row.executive_sponsor,
    'recommended_action', p_row.recommended_action,
    'estimated_value', p_row.estimated_value,
    'is_active', p_row.is_active
  );
$$;

create or replace function public._abpep310_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_row record;
begin
  for v_row in
    select pr.* from public.app_portal_business_pack_executive_portfolio_records pr
    where pr.company_id = p_company_id and pr.portfolio_status = 'high_performing'
  loop
    v_recs := v_recs || jsonb_build_object('id', 'expand-' || v_row.pack_key, 'key', 'expandSuccessfulPacks', 'pack_key', v_row.pack_key);
  end loop;

  for v_row in
    select pr.* from public.app_portal_business_pack_executive_portfolio_records pr
    where pr.company_id = p_company_id and pr.portfolio_status in ('requires_optimization', 'executive_attention_required')
  loop
    v_recs := v_recs || jsonb_build_object('id', 'review-' || v_row.pack_key, 'key', 'reviewUnderperforming', 'pack_key', v_row.pack_key);
  end loop;

  v_recs := v_recs || jsonb_build_object('id', 'exec-review-' || p_company_id, 'key', 'scheduleExecutiveReviews');
  v_recs := v_recs || jsonb_build_object('id', 'governance-' || p_company_id, 'key', 'strengthenGovernance');
  v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || p_company_id, 'key', 'celebratePortfolioSuccess');
  v_recs := v_recs || jsonb_build_object('id', 'optimize-' || p_company_id, 'key', 'prioritizeOptimization');

  return v_recs;
end;
$$;

create or replace function public._abpep310_build_insights(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'highest_performing', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', pr.pack_key, 'name', pr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_executive_portfolio_records pr
      where pr.company_id = p_company_id and pr.portfolio_status = 'high_performing'
      order by pr.value_score desc limit 5
    ),
    'underutilized', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', pr.pack_key, 'name', pr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_executive_portfolio_records pr
      where pr.company_id = p_company_id and pr.adoption_score < 40
      limit 5
    ),
    'strongest_roi', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', pr.pack_key, 'name', pr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_executive_portfolio_records pr
      where pr.company_id = p_company_id
      order by pr.estimated_value desc limit 5
    ),
    'governance_attention', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', pr.pack_key, 'name', pr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_executive_portfolio_records pr
      where pr.company_id = p_company_id and pr.governance_score < 50
      limit 5
    ),
    'optimization_opportunities', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', pr.pack_key, 'name', pr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_executive_portfolio_records pr
      where pr.company_id = p_company_id and pr.portfolio_status = 'requires_optimization'
      limit 5
    ),
    'maturity_observations', jsonb_build_array(
      'Portfolio adoption indicators inform strategic oversight',
      'Governance maturity supports long-term portfolio value'
    )
  );
end;
$$;

create or replace function public.list_app_portal_business_pack_executive_portfolio(
  p_portfolio_status text default null,
  p_pack_key text default null,
  p_maturity_level text default null,
  p_executive_sponsor text default null,
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
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_packs jsonb := '[]'::jsonb;
  v_row record;
  v_total integer := 0;
  v_active integer := 0;
  v_attention integer := 0;
  v_total_value numeric := 0;
  v_avg_adoption integer := 0;
  v_health integer := 0;
  v_maturity text;
  v_growth text := 'stable';
  v_high integer := 0;
begin
  v_ctx := public._abpep310_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpep310_sync_records(v_company_id, v_user_id);

  for v_row in
    select pr.* from public.app_portal_business_pack_executive_portfolio_records pr
    where pr.company_id = v_company_id
      and (p_portfolio_status is null or pr.portfolio_status = p_portfolio_status)
      and (p_pack_key is null or pr.pack_key = p_pack_key)
      and (p_maturity_level is null or pr.maturity_level = p_maturity_level)
      and (p_executive_sponsor is null or trim(p_executive_sponsor) = '' or pr.executive_sponsor ilike '%' || trim(p_executive_sponsor) || '%')
      and (p_priority_level is null or pr.priority_level = p_priority_level)
      and (p_period_from is null or pr.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or pr.pack_name ilike '%' || trim(p_search) || '%' or pr.pack_key ilike '%' || trim(p_search) || '%')
    order by pr.estimated_value desc, pr.pack_name
  loop
    v_packs := v_packs || public._abpep310_pack_card(v_row);
    v_total := v_total + 1;
    if v_row.is_active then v_active := v_active + 1; end if;
    if v_row.portfolio_status in ('executive_attention_required', 'requires_optimization') then v_attention := v_attention + 1; end if;
    if v_row.portfolio_status = 'high_performing' then v_high := v_high + 1; end if;
    v_total_value := v_total_value + coalesce(v_row.estimated_value, 0);
    v_avg_adoption := v_avg_adoption + v_row.adoption_score;
  end loop;

  if v_total > 0 then
    v_avg_adoption := round(v_avg_adoption::numeric / v_total);
    v_health := round((v_high::numeric / v_total) * 100);
    v_maturity := public._abpep310_infer_maturity(v_total, v_avg_adoption);
    v_growth := case when v_avg_adoption >= 60 then 'growing' when v_avg_adoption >= 40 then 'stable' else 'emerging' end;
  else
    v_maturity := 'emerging_portfolio';
  end if;

  insert into public.app_portal_business_pack_executive_portfolio_snapshots (
    company_id, portfolio_health_score, total_installed, total_active, total_value_realized,
    packs_requiring_attention, portfolio_growth_trend, maturity_level
  ) values (v_company_id, v_health, v_total, v_active, v_total_value, v_attention, v_growth, v_maturity)
  on conflict (company_id, snapshot_date) do update set
    portfolio_health_score = excluded.portfolio_health_score,
    total_installed = excluded.total_installed,
    total_active = excluded.total_active,
    total_value_realized = excluded.total_value_realized,
    packs_requiring_attention = excluded.packs_requiring_attention,
    portfolio_growth_trend = excluded.portfolio_growth_trend,
    maturity_level = excluded.maturity_level;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_portfolio_data', v_total > 0,
    'portfolio_health_score', v_health,
    'total_installed', v_total,
    'total_active', v_active,
    'total_value_realized', round(v_total_value, 2),
    'packs_requiring_attention', v_attention,
    'portfolio_growth_trend', v_growth,
    'portfolio_maturity_level', v_maturity,
    'executive_summary', case
      when v_total = 0 then 'No Business Pack portfolio insights are available yet.'
      when v_attention = 1 then 'One Business Pack requires executive review.'
      when v_attention > 1 then format('%s Business Packs require executive attention.', v_attention)
      when v_high >= v_total / 2 then 'Several Business Packs are delivering significant organizational value.'
      when v_avg_adoption >= 55 then 'Governance and adoption indicators remain healthy.'
      else 'Your Business Pack portfolio continues to mature.'
    end,
    'portfolio_overview', jsonb_build_object(
      'installed_packs', v_total,
      'active_packs', v_active,
      'adoption_overview', v_avg_adoption,
      'governance_overview', case when v_total > 0 then round((select avg(governance_score) from public.app_portal_business_pack_executive_portfolio_records where company_id = v_company_id)) else 0 end,
      'compliance_overview', 'monitored',
      'value_overview', round(v_total_value, 2),
      'lifecycle_overview', 'active',
      'ecosystem_overview', 'developing'
    ),
    'packs', v_packs,
    'insights', public._abpep310_build_insights(v_company_id),
    'recommendations', public._abpep310_build_recommendations(v_company_id),
    'principle', 'Aipify provides visibility and recommendations — executives remain responsible for all investment and portfolio decisions.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_executive_portfolio_detail(p_pack_key text)
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
  v_row record;
  v_reviews jsonb;
begin
  v_ctx := public._abpep310_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpep310_sync_records(v_company_id, v_user_id);

  select pr.* into v_row
  from public.app_portal_business_pack_executive_portfolio_records pr
  where pr.company_id = v_company_id and pr.pack_key = p_pack_key;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_type', r.review_type, 'review_outcome', r.review_outcome,
    'reviewer_name', r.reviewer_name, 'governance_notes', r.governance_notes, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_business_pack_executive_portfolio_reviews r
  where r.company_id = v_company_id and r.pack_key = p_pack_key;

  return public._abpep310_pack_card(v_row) || jsonb_build_object(
    'found', true,
    'review_history', v_reviews,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._abpep310_build_recommendations(v_company_id)) r
        where r->>'pack_key' = p_pack_key or r->>'pack_key' is null
      ) sub
    )
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_executive_portfolio_recommendations()
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
begin
  v_ctx := public._abpep310_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpep310_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'recommendations', public._abpep310_build_recommendations(v_company_id)
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_executive_portfolio_timeline(
  p_pack_key text default null,
  p_period_from date default null
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
  v_events jsonb;
begin
  v_ctx := public._abpep310_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpep310_sync_records(v_company_id, v_user_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'pack_key', t.pack_key, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_executive_portfolio_timeline t
    where t.company_id = v_company_id
      and (p_pack_key is null or t.pack_key = p_pack_key)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc
    limit 20
  ) sub;

  if jsonb_array_length(v_events) = 0 then
    select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
    into v_events
    from (
      select jsonb_build_object(
        'id', pr.id, 'pack_key', pr.pack_key, 'event_type', 'pack_introduced',
        'description', pr.pack_name, 'created_at', pr.created_at
      ) as row
      from public.app_portal_business_pack_executive_portfolio_records pr
      where pr.company_id = v_company_id
        and (p_pack_key is null or pr.pack_key = p_pack_key)
      order by pr.created_at desc
      limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.review_app_portal_business_pack_executive_portfolio(
  p_pack_key text default '',
  p_review_type text default 'quarterly_executive',
  p_review_outcome text default 'continue_investment',
  p_governance_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_review_id uuid;
begin
  v_ctx := public._abpep310_access_context();
  if coalesce(v_ctx->>'can_review', 'false') <> 'true' then
    raise exception 'Executive portfolio review requires authorized leadership access';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_pack_key <> '' and not exists (
    select 1 from public.app_portal_business_pack_executive_portfolio_records pr
    where pr.company_id = v_company_id and pr.pack_key = p_pack_key
  ) then
    raise exception 'Business Pack not found';
  end if;

  insert into public.app_portal_business_pack_executive_portfolio_reviews (
    company_id, pack_key, review_type, review_outcome, reviewer_name, governance_notes, reviewed_by, reviewed_at
  ) values (
    v_company_id, coalesce(p_pack_key, ''),
    coalesce(p_review_type, 'quarterly_executive'),
    coalesce(p_review_outcome, 'continue_investment'),
    coalesce((select u.display_name from public.users u where u.id = v_user_id), 'Executive'),
    coalesce(p_governance_notes, ''), v_user_id, now()
  ) returning id into v_review_id;

  if p_pack_key <> '' then
    update public.app_portal_business_pack_executive_portfolio_records set
      portfolio_status = case p_review_outcome
        when 'retire_capability' then 'executive_attention_required'
        when 'expand_investment' then 'high_performing'
        when 'optimize_investment' then 'requires_optimization'
        else 'healthy'
      end,
      updated_at = now()
    where company_id = v_company_id and pack_key = p_pack_key;
  end if;

  insert into public.app_portal_business_pack_executive_portfolio_timeline (
    company_id, pack_key, event_type, description, performed_by
  ) values (
    v_company_id, coalesce(p_pack_key, ''), 'portfolio_review_completed',
    'Executive portfolio review recorded', v_user_id
  );

  insert into public.app_portal_business_pack_executive_portfolio_audit_logs (
    company_id, pack_key, event_type, description, performed_by, metadata
  ) values (
    v_company_id, nullif(p_pack_key, ''), 'executive_portfolio_review',
    'Executive portfolio review recorded',
    v_user_id, jsonb_build_object('review_id', v_review_id, 'outcome', p_review_outcome)
  );

  return jsonb_build_object(
    'found', true,
    'review_id', v_review_id,
    'pack_key', nullif(p_pack_key, ''),
    'review_outcome', p_review_outcome,
    'message', 'Executive portfolio review recorded — investment decisions remain with leadership.'
  );
end;
$$;

grant execute on function public._abpep310_access_context() to authenticated;
grant execute on function public.list_app_portal_business_pack_executive_portfolio(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_executive_portfolio_detail(text) to authenticated;
grant execute on function public.get_app_portal_business_pack_executive_portfolio_recommendations() to authenticated;
grant execute on function public.get_app_portal_business_pack_executive_portfolio_timeline(text, date) to authenticated;
grant execute on function public.review_app_portal_business_pack_executive_portfolio(text, text, text, text) to authenticated;
