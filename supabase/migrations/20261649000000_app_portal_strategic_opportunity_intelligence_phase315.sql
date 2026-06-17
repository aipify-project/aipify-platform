-- Phase 315 (APP Intelligence) — Strategic Opportunity Intelligence Center

create table if not exists public.app_portal_strategic_opportunities_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled  boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_strategic_opportunities (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  opportunity_key text not null default '',
  title        text not null default '',
  description  text not null default '',
  category     text not null check (category in (
    'revenue_growth','customer_experience','operational_efficiency',
    'cost_optimization','employee_experience','market_expansion',
    'product_innovation','strategic_partnerships','automation_opportunities',
    'knowledge_opportunities','process_improvements','sustainability_initiatives'
  )),
  status       text not null default 'identified' check (status in (
    'identified','under_review','approved','planning',
    'in_progress','completed','archived'
  )),
  strategic_priority text not null default 'moderate' check (strategic_priority in (
    'low','moderate','high','strategic'
  )),
  estimated_impact   text not null default 'moderate' check (estimated_impact in (
    'low','moderate','high','transformational'
  )),
  estimated_complexity text not null default 'moderate' check (estimated_complexity in (
    'low','moderate','high','very_high'
  )),
  organizational_readiness text not null default 'moderate' check (organizational_readiness in (
    'not_ready','low','moderate','high'
  )),
  cross_department_influence boolean not null default false,
  recommended_review_priority text not null default 'normal' check (recommended_review_priority in (
    'low','normal','high','immediate'
  )),
  leadership_owner     text not null default '',
  potential_value      text not null default '',
  estimated_effort     text not null default '',
  related_departments  jsonb not null default '[]'::jsonb,
  suggested_next_steps jsonb not null default '[]'::jsonb,
  supporting_observations jsonb not null default '[]'::jsonb,
  time_horizon         text not null default '12_months' check (time_horizon in (
    '30_days','90_days','6_months','12_months','24_months','36_months'
  )),
  metadata     jsonb not null default '{}'::jsonb,
  last_reviewed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (company_id, opportunity_key)
);

create index if not exists app_portal_strategic_opportunities_idx
  on public.app_portal_strategic_opportunities
  (company_id, category, status, strategic_priority, time_horizon);

create table if not exists public.app_portal_strategic_opportunity_reviews (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  opportunity_id uuid not null references public.app_portal_strategic_opportunities (id) on delete cascade,
  review_notes   text not null default '',
  new_status     text,
  reviewed_by    uuid references public.users (id) on delete set null,
  reviewed_at    timestamptz not null default now()
);

create index if not exists app_portal_strategic_opportunity_reviews_idx
  on public.app_portal_strategic_opportunity_reviews (company_id, opportunity_id, reviewed_at desc);

create table if not exists public.app_portal_strategic_opportunity_timeline (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  opportunity_id uuid references public.app_portal_strategic_opportunities (id) on delete set null,
  event_type     text not null,
  description    text not null default '',
  performed_by   uuid references public.users (id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists app_portal_strategic_opportunity_timeline_idx
  on public.app_portal_strategic_opportunity_timeline (company_id, created_at desc);

create table if not exists public.app_portal_strategic_opportunity_audit_logs (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  opportunity_id uuid,
  event_type     text not null,
  description    text not null default '',
  performed_by   uuid references public.users (id) on delete set null,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists app_portal_strategic_opportunity_audit_idx
  on public.app_portal_strategic_opportunity_audit_logs (company_id, created_at desc);

alter table public.app_portal_strategic_opportunities_state    enable row level security;
alter table public.app_portal_strategic_opportunities          enable row level security;
alter table public.app_portal_strategic_opportunity_reviews    enable row level security;
alter table public.app_portal_strategic_opportunity_timeline   enable row level security;
alter table public.app_portal_strategic_opportunity_audit_logs enable row level security;
revoke all on public.app_portal_strategic_opportunities_state    from authenticated, anon;
revoke all on public.app_portal_strategic_opportunities          from authenticated, anon;
revoke all on public.app_portal_strategic_opportunity_reviews    from authenticated, anon;
revoke all on public.app_portal_strategic_opportunity_timeline   from authenticated, anon;
revoke all on public.app_portal_strategic_opportunity_audit_logs from authenticated, anon;

-- Access guard
create or replace function public._asoi315_access_context()
returns jsonb language plpgsql stable security definer set search_path = public
as $$
declare
  v_access jsonb; v_user public.users; v_role text;
  v_mgr boolean := false; v_adm boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(s.manager_access_enabled,false), coalesce(s.admin_access_enabled,false)
  into v_mgr, v_adm
  from public.app_portal_strategic_opportunities_state s
  where s.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_review',true,'can_create',true);
  elsif v_role = 'organization_admin' and v_adm then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_review',true,'can_create',true);
  elsif v_role = 'organization_manager' and v_mgr then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',false,'can_manage',false,
      'can_view',true,'can_review',false,'can_create',false);
  end if;
  raise exception 'Strategic Opportunities access requires owner authorization or explicit grant';
end; $$;

-- Seed catalog
create or replace function public._asoi315_opportunity_catalog()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key','op_process_automation','title','Process automation potential','category','automation_opportunities','priority','high','impact','high','complexity','moderate','readiness','moderate','horizon','12_months','owner','COO','value','Reduce manual effort and improve consistency','effort','Medium-term implementation','summary','Several operational processes may benefit from structured automation — reducing manual effort without replacing human judgment.'),
    jsonb_build_object('key','op_revenue_expansion','title','Revenue expansion through existing customers','category','revenue_growth','priority','strategic','impact','high','complexity','moderate','readiness','high','horizon','6_months','owner','CCO','value','Increase lifetime value through targeted engagement','effort','Low-to-medium effort','summary','Existing customer relationships may present underexplored expansion opportunities.'),
    jsonb_build_object('key','op_knowledge_capture','title','Organizational knowledge capture','category','knowledge_opportunities','priority','high','impact','high','complexity','moderate','readiness','moderate','horizon','12_months','owner','CHRO','value','Reduce knowledge loss and accelerate onboarding','effort','Ongoing initiative','summary','Structured knowledge capture could reduce critical dependency on individual contributors.'),
    jsonb_build_object('key','op_cx_improvement','title','Customer experience improvement','category','customer_experience','priority','high','impact','high','complexity','moderate','readiness','moderate','horizon','12_months','owner','CCO','value','Improve retention and referral rate','effort','Medium-term effort','summary','Customer journey observations suggest targeted experience improvements could meaningfully strengthen loyalty.'),
    jsonb_build_object('key','op_cost_optimization','title','Cost structure optimization','category','cost_optimization','priority','moderate','impact','moderate','complexity','moderate','readiness','moderate','horizon','6_months','owner','CFO','value','Improve margin without service impact','effort','Analytical phase required','summary','Systematic cost review may identify optimization areas that preserve or improve service quality.'),
    jsonb_build_object('key','op_partner_ecosystem','title','Strategic partnership development','category','strategic_partnerships','priority','strategic','impact','transformational','complexity','high','readiness','low','horizon','24_months','owner','CEO','value','Access new markets and capabilities','effort','Long-term strategic initiative','summary','Selective partnership development could accelerate capabilities that would take years to build internally.'),
    jsonb_build_object('key','op_employee_experience','title','Employee experience strengthening','category','employee_experience','priority','high','impact','high','complexity','moderate','readiness','moderate','horizon','12_months','owner','CHRO','value','Improve retention and productivity','effort','Medium-term programme','summary','Investments in employee experience may yield measurable improvements in retention, engagement and output quality.'),
    jsonb_build_object('key','op_market_expansion','title','Adjacent market opportunity','category','market_expansion','priority','moderate','impact','high','complexity','high','readiness','low','horizon','24_months','owner','CEO','value','Expand addressable market','effort','Requires discovery phase','summary','Adjacent market segments may be accessible with targeted positioning and capability adjustments.'),
    jsonb_build_object('key','op_process_improvement','title','Core process improvement','category','process_improvements','priority','moderate','impact','moderate','complexity','low','readiness','high','horizon','90_days','owner','COO','value','Reduce friction and improve throughput','effort','Near-term initiative','summary','Identified process gaps present near-term improvement opportunities with relatively low implementation complexity.'),
    jsonb_build_object('key','op_product_innovation','title','Product innovation pipeline','category','product_innovation','priority','strategic','impact','transformational','complexity','very_high','readiness','low','horizon','36_months','owner','CTO','value','Create differentiated market position','effort','Long-term investment','summary','Structured innovation exploration could identify product opportunities that create durable competitive differentiation.')
  );
$$;

-- Sync seed opportunities
create or replace function public._asoi315_sync_opportunities(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb;
begin
  insert into public.app_portal_strategic_opportunities_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._asoi315_opportunity_catalog()) loop
    insert into public.app_portal_strategic_opportunities (
      company_id, opportunity_key, title, description, category, strategic_priority,
      estimated_impact, estimated_complexity, organizational_readiness,
      recommended_review_priority, leadership_owner, potential_value,
      estimated_effort, time_horizon,
      related_departments, suggested_next_steps, supporting_observations
    ) values (
      p_company_id,
      v_item->>'key', v_item->>'title', v_item->>'summary',
      v_item->>'category', v_item->>'priority',
      v_item->>'impact', v_item->>'complexity', v_item->>'readiness',
      'normal', v_item->>'owner', v_item->>'value', v_item->>'effort',
      v_item->>'horizon',
      jsonb_build_array('Leadership','Operations','Finance'),
      jsonb_build_array(
        'Schedule exploratory workshop',
        'Assign executive sponsor',
        'Gather supporting data'),
      jsonb_build_array()
    )
    on conflict (company_id, opportunity_key) do update set
      title = excluded.title, description = excluded.description,
      updated_at = now();
  end loop;

  if not exists (
    select 1 from public.app_portal_strategic_opportunity_timeline t
    where t.company_id = p_company_id and t.event_type = 'opportunities_initialized') then
    insert into public.app_portal_strategic_opportunity_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id, 'opportunities_initialized',
            'Strategic opportunities workspace initialized', p_user_id);
  end if;
end; $$;

-- Card projection
create or replace function public._asoi315_opportunity_card(
  p_row public.app_portal_strategic_opportunities
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id',                       p_row.id,
    'opportunity_key',          p_row.opportunity_key,
    'title',                    p_row.title,
    'description',              p_row.description,
    'category',                 p_row.category,
    'status',                   p_row.status,
    'strategic_priority',       p_row.strategic_priority,
    'estimated_impact',         p_row.estimated_impact,
    'estimated_complexity',     p_row.estimated_complexity,
    'organizational_readiness', p_row.organizational_readiness,
    'cross_department_influence', p_row.cross_department_influence,
    'recommended_review_priority', p_row.recommended_review_priority,
    'leadership_owner',         p_row.leadership_owner,
    'potential_value',          p_row.potential_value,
    'estimated_effort',         p_row.estimated_effort,
    'related_departments',      p_row.related_departments,
    'suggested_next_steps',     p_row.suggested_next_steps,
    'time_horizon',             p_row.time_horizon,
    'last_reviewed_at',         p_row.last_reviewed_at,
    'updated_at',               p_row.updated_at
  );
$$;

-- Opportunity Health Score (0–100)
create or replace function public._asoi315_health_score(p_company_id uuid)
returns integer language plpgsql stable as $$
declare
  v_total integer := 0; v_active integer := 0;
  v_high integer := 0;  v_completed integer := 0;
begin
  select
    count(*),
    count(*) filter (where status in ('under_review','approved','planning','in_progress')),
    count(*) filter (where strategic_priority in ('high','strategic')),
    count(*) filter (where status = 'completed')
  into v_total, v_active, v_high, v_completed
  from public.app_portal_strategic_opportunities
  where company_id = p_company_id;

  if v_total = 0 then return 50; end if;
  return least(100, greatest(40,
    50 + v_active * 3 + v_high * 2 + v_completed * 4 - (v_total - v_active - v_completed) * 1
  ));
end; $$;

-- Recommendations
create or replace function public._asoi315_build_recommendations(p_company_id uuid)
returns jsonb language plpgsql stable as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  v_recs := v_recs || jsonb_build_object('id','ws-'||p_company_id,'key','scheduleExploratoryWorkshop');
  v_recs := v_recs || jsonb_build_object('id','sp-'||p_company_id,'key','assignExecutiveSponsor');
  if exists (
    select 1 from public.app_portal_strategic_opportunities o
    where o.company_id = p_company_id and o.status = 'identified'
      and o.strategic_priority = 'strategic') then
    v_recs := v_recs || jsonb_build_object('id','pi-'||p_company_id,'key','initiatePilotProject');
  end if;
  v_recs := v_recs || jsonb_build_object('id','gd-'||p_company_id,'key','gatherSupportingData');
  v_recs := v_recs || jsonb_build_object('id','sh-'||p_company_id,'key','conductStakeholderReview');
  v_recs := v_recs || jsonb_build_object('id','md-'||p_company_id,'key','monitorFutureDevelopments');
  return v_recs;
end; $$;

-- Manager-visible categories
create or replace function public._asoi315_manager_categories()
returns text[] language sql immutable as $$
  select array[
    'operational_efficiency','process_improvements',
    'employee_experience','automation_opportunities'
  ]::text[];
$$;

-- -----------------------------------------------------------------------
-- List / dashboard
-- -----------------------------------------------------------------------
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
  perform public._asoi315_sync_opportunities(v_company_id, v_user_id);
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

-- -----------------------------------------------------------------------
-- Detail
-- -----------------------------------------------------------------------
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
  perform public._asoi315_sync_opportunities(v_company_id, (v_ctx->>'user_id')::uuid);

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

-- -----------------------------------------------------------------------
-- Timeline
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_strategic_opportunity_timeline(
  p_opportunity_id uuid  default null,
  p_period_from    date  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._asoi315_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._asoi315_sync_opportunities(v_company_id,(v_ctx->>'user_id')::uuid);

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

-- -----------------------------------------------------------------------
-- Create / update / review
-- -----------------------------------------------------------------------
create or replace function public.upsert_app_portal_strategic_opportunity(
  p_opportunity_id uuid   default null,
  p_title          text   default null,
  p_description    text   default null,
  p_category       text   default null,
  p_status         text   default null,
  p_strategic_priority text default null,
  p_leadership_owner   text default null,
  p_time_horizon   text   default null,
  p_review_notes   text   default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_opp_id uuid; v_row record;
begin
  v_ctx        := public._asoi315_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;

  -- create
  if p_opportunity_id is null then
    if coalesce(v_ctx->>'can_create','false') <> 'true' then
      raise exception 'Creating opportunities requires owner authorization or higher';
    end if;
    insert into public.app_portal_strategic_opportunities (
      company_id, opportunity_key, title, description, category,
      strategic_priority, leadership_owner, time_horizon
    ) values (
      v_company_id,
      'custom-'||extract(epoch from now())::bigint,
      coalesce(p_title,'New opportunity'),
      coalesce(p_description,''),
      coalesce(p_category,'operational_efficiency'),
      coalesce(p_strategic_priority,'moderate'),
      coalesce(p_leadership_owner,''),
      coalesce(p_time_horizon,'12_months')
    ) returning id into v_opp_id;

    insert into public.app_portal_strategic_opportunity_timeline
      (company_id, opportunity_id, event_type, description, performed_by)
    values (v_company_id, v_opp_id, 'opportunity_identified', 'New opportunity identified', v_user_id);

    return jsonb_build_object('found',true,'opportunity_id',v_opp_id,
                              'message','Opportunity created successfully.');
  end if;

  -- update / review
  if coalesce(v_ctx->>'can_review','false') <> 'true' then
    raise exception 'Updating opportunities requires owner authorization or higher';
  end if;

  select o.* into v_row
  from public.app_portal_strategic_opportunities o
  where o.company_id = v_company_id and o.id = p_opportunity_id;
  if not found then raise exception 'Opportunity not found'; end if;

  update public.app_portal_strategic_opportunities set
    title              = coalesce(p_title, title),
    description        = coalesce(p_description, description),
    category           = coalesce(p_category, category),
    status             = coalesce(p_status, status),
    strategic_priority = coalesce(p_strategic_priority, strategic_priority),
    leadership_owner   = coalesce(p_leadership_owner, leadership_owner),
    time_horizon       = coalesce(p_time_horizon, time_horizon),
    last_reviewed_at   = now(),
    updated_at         = now()
  where company_id = v_company_id and id = p_opportunity_id;

  if p_review_notes is not null or p_status is not null then
    insert into public.app_portal_strategic_opportunity_reviews
      (company_id, opportunity_id, review_notes, new_status, reviewed_by)
    values (v_company_id, p_opportunity_id,
            coalesce(p_review_notes,''), p_status, v_user_id);
  end if;

  insert into public.app_portal_strategic_opportunity_timeline
    (company_id, opportunity_id, event_type, description, performed_by)
  values (v_company_id, p_opportunity_id,
          case when p_status is not null then 'status_updated' else 'opportunity_reviewed' end,
          coalesce(p_review_notes,'Opportunity updated'), v_user_id);

  return jsonb_build_object('found',true,'opportunity_id',p_opportunity_id,
                            'message','Opportunity updated successfully.');
end; $$;

grant execute on function public._asoi315_access_context()                           to authenticated;
grant execute on function public.list_app_portal_strategic_opportunities(text,text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_app_portal_strategic_opportunity(uuid)          to authenticated;
grant execute on function public.get_app_portal_strategic_opportunity_timeline(uuid,date) to authenticated;
grant execute on function public.upsert_app_portal_strategic_opportunity(uuid,text,text,text,text,text,text,text,text) to authenticated;
