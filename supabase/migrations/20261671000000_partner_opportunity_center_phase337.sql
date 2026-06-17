-- Phase 337 — Partner Opportunity Center
-- Feature owner: GROWTH PARTNER PORTAL. Route: /partner/opportunities. Helpers: _gpo337_*

create table if not exists public.growth_partner_portal_opportunity_stages (
  id uuid primary key default gen_random_uuid(),
  stage_key text not null unique,
  stage_label text not null,
  sort_order integer not null default 100,
  is_closed boolean not null default false,
  is_won boolean not null default false,
  weight_pct numeric(5, 2) not null default 10.00,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_opportunity_stages enable row level security;
revoke all on public.growth_partner_portal_opportunity_stages from authenticated, anon;

create table if not exists public.growth_partner_portal_opportunities (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  opportunity_key text not null,
  company_name text not null,
  contact_person text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  country_code text not null default '',
  industry text not null default '',
  opportunity_value numeric(12, 2) not null default 0,
  expected_close_date date,
  stage_key text not null default 'lead' references public.growth_partner_portal_opportunity_stages (stage_key),
  owner_auth_user_id uuid not null,
  owner_name text not null default '',
  next_action text not null default '',
  next_action_due date,
  next_action_owner uuid,
  health_score_label text not null default 'needs_attention' check (
    health_score_label in ('excellent', 'healthy', 'needs_attention', 'at_risk')
  ),
  health_score_pct integer not null default 50 check (health_score_pct between 0 and 100),
  last_activity_at timestamptz,
  search_document text not null default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, opportunity_key)
);
create index if not exists gpp_opportunities_org_idx
  on public.growth_partner_portal_opportunities (partner_org_id, stage_key, created_at desc);
create index if not exists gpp_opportunities_owner_idx
  on public.growth_partner_portal_opportunities (partner_org_id, owner_auth_user_id);
alter table public.growth_partner_portal_opportunities enable row level security;
revoke all on public.growth_partner_portal_opportunities from authenticated, anon;

create table if not exists public.growth_partner_portal_opportunity_activities (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_partner_portal_opportunities (id) on delete cascade,
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  activity_type text not null check (
    activity_type in ('note', 'call', 'email', 'meeting', 'task', 'follow_up', 'stage_change', 'proposal')
  ),
  title text not null default '',
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_opportunity_activities_opp_idx
  on public.growth_partner_portal_opportunity_activities (opportunity_id, created_at desc);
alter table public.growth_partner_portal_opportunity_activities enable row level security;
revoke all on public.growth_partner_portal_opportunity_activities from authenticated, anon;

create table if not exists public.growth_partner_portal_opportunity_stage_history (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.growth_partner_portal_opportunities (id) on delete cascade,
  from_stage text,
  to_stage text not null,
  changed_by uuid,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_opportunity_stage_history enable row level security;
revoke all on public.growth_partner_portal_opportunity_stage_history from authenticated, anon;

create table if not exists public.growth_partner_portal_opportunity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  opportunity_id uuid references public.growth_partner_portal_opportunities (id) on delete set null,
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_opportunity_audit_org_idx
  on public.growth_partner_portal_opportunity_audit_logs (partner_org_id, created_at desc);
alter table public.growth_partner_portal_opportunity_audit_logs enable row level security;
revoke all on public.growth_partner_portal_opportunity_audit_logs from authenticated, anon;

create or replace function public._gpo337bp_positioning() returns text language sql immutable as $$
  select 'Never lose a lead — track prospects from first conversation to signed customer with clear next actions, pipeline visibility, and revenue forecasting.'; $$;

create or replace function public._gpo337_seed_stages()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_opportunity_stages (stage_key, stage_label, sort_order, weight_pct, is_closed, is_won) values
    ('lead', 'Lead', 10, 5, false, false),
    ('contacted', 'Contacted', 20, 10, false, false),
    ('discovery', 'Discovery', 30, 20, false, false),
    ('qualified', 'Qualified', 40, 35, false, false),
    ('demo_scheduled', 'Demo Scheduled', 50, 45, false, false),
    ('proposal_sent', 'Proposal Sent', 60, 60, false, false),
    ('negotiation', 'Negotiation', 70, 75, false, false),
    ('closed_won', 'Closed Won', 80, 100, true, true),
    ('closed_lost', 'Closed Lost', 90, 0, true, false)
  on conflict (stage_key) do nothing;
end; $$;

create or replace function public._gpo337_member_role(p_org_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(public._gppf05_member_role(p_org_id), ''); $$;

create or replace function public._gpo337_can_access(p_org_id uuid, p_write boolean default false)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_role text := public._gpo337_member_role(p_org_id);
begin
  if v_role in ('partner_owner', 'owner', 'partner_manager', 'manager') then return true; end if;
  if p_write and v_role = 'viewer' then return false; end if;
  if v_role in ('sales_member', 'sales_representative', 'trainer', 'advisor', 'viewer') then return true; end if;
  return coalesce((public._gpp331_member_permissions(p_org_id)->>'view_opportunities')::boolean, false);
end; $$;

create or replace function public._gpo337_can_write(p_org_id uuid, p_owner_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_role text := public._gpo337_member_role(p_org_id);
begin
  if v_role in ('partner_owner', 'owner', 'partner_manager', 'manager') then return true; end if;
  if v_role in ('sales_member', 'sales_representative') and p_owner_id = auth.uid() then return true; end if;
  return false;
end; $$;

create or replace function public._gpo337_visible_opportunity(p_org_id uuid, p_owner_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_role text := public._gpo337_member_role(p_org_id);
begin
  if not public._gpo337_can_access(p_org_id, false) then return false; end if;
  if v_role in ('partner_owner', 'owner', 'partner_manager', 'manager', 'viewer', 'trainer', 'advisor') then return true; end if;
  return p_owner_id = auth.uid();
end; $$;

create or replace function public._gpo337_log_audit(
  p_org_id uuid, p_opp_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_opportunity_audit_logs (
    partner_org_id, opportunity_id, event_type, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_opp_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpo337_compute_health(p_opp public.growth_partner_portal_opportunities)
returns table(label text, pct integer) language plpgsql stable as $$
declare
  v_days integer;
  v_score integer := 50;
  v_label text := 'needs_attention';
begin
  if p_opp.last_activity_at is null then
    v_days := extract(day from (now() - p_opp.created_at))::int;
  else
    v_days := extract(day from (now() - p_opp.last_activity_at))::int;
  end if;

  if p_opp.stage_key in ('closed_won', 'closed_lost') then
    label := case when p_opp.stage_key = 'closed_won' then 'excellent' else 'healthy' end;
    pct := case when p_opp.stage_key = 'closed_won' then 95 else 40 end;
    return next;
    return;
  end if;

  if v_days <= 3 then v_score := v_score + 25;
  elsif v_days <= 7 then v_score := v_score + 10;
  elsif v_days <= 14 then v_score := v_score - 10;
  else v_score := v_score - 25;
  end if;

  if coalesce(trim(p_opp.next_action), '') <> '' and p_opp.next_action_due is not null then v_score := v_score + 15; end if;
  if p_opp.stage_key in ('qualified', 'demo_scheduled', 'proposal_sent', 'negotiation') then v_score := v_score + 10; end if;

  v_score := greatest(0, least(100, v_score));
  if v_score >= 85 then v_label := 'excellent';
  elsif v_score >= 65 then v_label := 'healthy';
  elsif v_score >= 40 then v_label := 'needs_attention';
  else v_label := 'at_risk';
  end if;
  label := v_label;
  pct := v_score;
  return next;
end; $$;

create or replace function public._gpo337_recompute_health(p_opp_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_opp public.growth_partner_portal_opportunities;
  v_health record;
begin
  select * into v_opp from public.growth_partner_portal_opportunities where id = p_opp_id;
  select * into v_health from public._gpo337_compute_health(v_opp);
  update public.growth_partner_portal_opportunities set
    health_score_label = v_health.label,
    health_score_pct = v_health.pct,
    updated_at = now()
  where id = p_opp_id;
end; $$;

create or replace function public._gpo337_insights(p_opp public.growth_partner_portal_opportunities)
returns jsonb language plpgsql stable as $$
declare
  v_days integer;
  v_insights jsonb := '[]'::jsonb;
begin
  if p_opp.last_activity_at is null then
    v_days := extract(day from (now() - p_opp.created_at))::int;
  else
    v_days := extract(day from (now() - p_opp.last_activity_at))::int;
  end if;

  if v_days >= 14 then
    v_insights := v_insights || jsonb_build_array(format('This opportunity has had no activity for %s days.', v_days));
  end if;
  if p_opp.stage_key = 'proposal_sent' and v_days >= 5 then
    v_insights := v_insights || jsonb_build_array('Proposal sent but no follow-up recorded.');
  end if;
  if p_opp.stage_key = 'demo_scheduled' then
    v_insights := v_insights || jsonb_build_array('Demo completed. Recommended next step: Proposal.');
  end if;
  if v_days <= 2 and p_opp.stage_key not in ('closed_won', 'closed_lost') then
    v_insights := v_insights || jsonb_build_array('Customer engagement has increased.');
  end if;
  return v_insights;
end; $$;

create or replace function public._gpo337_commission_estimate(p_value numeric)
returns numeric language sql stable as $$
  select round(coalesce(p_value, 0) * 0.10, 2); $$;

create or replace function public._gpo337_opp_json(p_org_id uuid, o public.growth_partner_portal_opportunities)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_stage public.growth_partner_portal_opportunity_stages;
begin
  select * into v_stage from public.growth_partner_portal_opportunity_stages where stage_key = o.stage_key;
  return jsonb_build_object(
    'id', o.id,
    'opportunity_key', o.opportunity_key,
    'company_name', o.company_name,
    'contact_person', o.contact_person,
    'contact_email', o.contact_email,
    'contact_phone', o.contact_phone,
    'country_code', o.country_code,
    'industry', o.industry,
    'opportunity_value', o.opportunity_value,
    'expected_close_date', coalesce(o.expected_close_date::text, ''),
    'stage_key', o.stage_key,
    'stage_label', coalesce(v_stage.stage_label, o.stage_key),
    'owner_auth_user_id', o.owner_auth_user_id,
    'owner_name', o.owner_name,
    'next_action', o.next_action,
    'next_action_due', coalesce(o.next_action_due::text, ''),
    'last_activity_at', coalesce(o.last_activity_at::text, ''),
    'health_score_label', o.health_score_label,
    'health_score_pct', o.health_score_pct,
    'potential_commission', public._gpo337_commission_estimate(o.opportunity_value),
    'insights', public._gpo337_insights(o),
    'created_at', o.created_at::text,
    'updated_at', o.updated_at::text
  );
end; $$;

create or replace function public._gpo337_seed_demo(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_owner uuid := auth.uid();
begin
  if exists(select 1 from public.growth_partner_portal_opportunities where partner_org_id = p_org_id limit 1) then return; end if;

  insert into public.growth_partner_portal_opportunities (
    partner_org_id, opportunity_key, company_name, contact_person, contact_email,
    country_code, industry, opportunity_value, expected_close_date, stage_key,
    owner_auth_user_id, owner_name, next_action, next_action_due, last_activity_at, search_document
  ) values
    (p_org_id, 'OPP-DEMO-001', 'Nordic Retail Group', 'Anna Larsen', 'anna@nordicretail.no', 'NO', 'retail', 48000, current_date + 45, 'discovery', v_owner, 'Partner Owner', 'Schedule discovery call', current_date + 3, now() - interval '2 days', 'nordic retail group anna discovery'),
    (p_org_id, 'OPP-DEMO-002', 'Bergen Tech AS', 'Erik Hansen', 'erik@bergentech.no', 'NO', 'technology', 72000, current_date + 30, 'proposal_sent', v_owner, 'Partner Owner', 'Follow-up on proposal', current_date + 2, now() - interval '8 days', 'bergen tech proposal'),
    (p_org_id, 'OPP-DEMO-003', 'Oslo Hospitality Partners', 'Maria Olsen', 'maria@oslohp.no', 'NO', 'hospitality', 96000, current_date + 60, 'qualified', v_owner, 'Partner Owner', 'Send ROI calculator', current_date + 5, now() - interval '1 day', 'oslo hospitality qualified');

  insert into public.growth_partner_portal_opportunity_activities (
    opportunity_id, partner_org_id, activity_type, title, summary, actor_auth_user_id
  )
  select o.id, p_org_id, 'note', 'Opportunity created', 'Initial prospect record created.', v_owner
  from public.growth_partner_portal_opportunities o where o.partner_org_id = p_org_id;

  perform public._gpo337_recompute_health(o.id)
  from public.growth_partner_portal_opportunities o where o.partner_org_id = p_org_id;
end; $$;

create or replace function public.get_partner_opportunities(
  p_stage text default null,
  p_country text default null,
  p_industry text default null,
  p_value_min numeric default null,
  p_owner uuid default null,
  p_status text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
  v_opps jsonb;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  if not public._gpo337_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false, 'access_denied', true);
  end if;

  perform public._gpp331_provision(v_org_id);
  perform public._gpo337_seed_stages();
  perform public._gpo337_seed_demo(v_org_id);
  v_role := public._gpo337_member_role(v_org_id);

  select coalesce(jsonb_agg(public._gpo337_opp_json(v_org_id, o) order by o.updated_at desc), '[]'::jsonb)
  into v_opps
  from public.growth_partner_portal_opportunities o
  where o.partner_org_id = v_org_id
    and o.status = coalesce(nullif(p_status, ''), 'active')
    and public._gpo337_visible_opportunity(v_org_id, o.owner_auth_user_id)
    and (p_stage is null or o.stage_key = p_stage)
    and (p_country is null or lower(o.country_code) = lower(p_country))
    and (p_industry is null or lower(o.industry) = lower(p_industry))
    and (p_value_min is null or o.opportunity_value >= p_value_min)
    and (p_owner is null or o.owner_auth_user_id = p_owner)
    and (p_search is null or o.search_document like '%' || lower(trim(p_search)) || '%');

  return jsonb_build_object(
    'has_access', true,
    'can_write', public._gpo337_can_access(v_org_id, true),
    'team_role', v_role,
    'positioning', public._gpo337bp_positioning(),
    'dashboard', jsonb_build_object(
      'active_opportunities', (select count(*) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and status = 'active' and stage_key not in ('closed_won', 'closed_lost')),
      'new_opportunities', (select count(*) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and stage_key = 'lead'),
      'qualified_opportunities', (select count(*) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and stage_key = 'qualified'),
      'proposal_opportunities', (select count(*) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and stage_key = 'proposal_sent'),
      'closed_won', (select count(*) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and stage_key = 'closed_won'),
      'closed_lost', (select count(*) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and stage_key = 'closed_lost'),
      'pipeline_value', coalesce((select sum(opportunity_value) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and status = 'active' and stage_key not in ('closed_won', 'closed_lost')), 0)
    ),
    'performance', jsonb_build_object(
      'conversion_rate_pct', coalesce((
        select round(count(*) filter (where stage_key = 'closed_won')::numeric / nullif(count(*), 0) * 100, 1)
        from public.growth_partner_portal_opportunities where partner_org_id = v_org_id
      ), 0),
      'average_deal_size', coalesce((select round(avg(opportunity_value), 0) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and opportunity_value > 0), 0),
      'win_rate_pct', coalesce((
        select round(count(*) filter (where stage_key = 'closed_won')::numeric / nullif(count(*) filter (where stage_key in ('closed_won', 'closed_lost')), 0) * 100, 1)
        from public.growth_partner_portal_opportunities where partner_org_id = v_org_id
      ), 0),
      'pipeline_growth', (select count(*) from public.growth_partner_portal_opportunities where partner_org_id = v_org_id and created_at >= now() - interval '30 days')
    ),
    'opportunities', coalesce(v_opps, '[]'::jsonb),
    'stages', coalesce((
      select jsonb_agg(jsonb_build_object('stage_key', s.stage_key, 'stage_label', s.stage_label, 'sort_order', s.sort_order, 'weight_pct', s.weight_pct) order by s.sort_order)
      from public.growth_partner_portal_opportunity_stages s where s.enabled = true
    ), '[]'::jsonb),
    'empty_state', jsonb_build_object(
      'title', 'No opportunities yet.',
      'message', 'Track prospects from first conversation to signed customer.',
      'cta', 'Create Opportunity'
    )
  );
end; $$;

create or replace function public.get_partner_opportunity(p_opportunity_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_opp public.growth_partner_portal_opportunities;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();

  select * into v_opp from public.growth_partner_portal_opportunities
  where id = p_opportunity_id and partner_org_id = v_org_id;
  if v_opp.id is null or not public._gpo337_visible_opportunity(v_org_id, v_opp.owner_auth_user_id) then
    return jsonb_build_object('has_access', false);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'can_write', public._gpo337_can_write(v_org_id, v_opp.owner_auth_user_id),
    'opportunity', public._gpo337_opp_json(v_org_id, v_opp),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'activity_type', a.activity_type,
        'title', a.title,
        'summary', a.summary,
        'created_at', a.created_at::text
      ) order by a.created_at desc)
      from public.growth_partner_portal_opportunity_activities a
      where a.opportunity_id = p_opportunity_id
    ), '[]'::jsonb),
    'stage_history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'from_stage', h.from_stage,
        'to_stage', h.to_stage,
        'created_at', h.created_at::text
      ) order by h.created_at desc)
      from public.growth_partner_portal_opportunity_stage_history h
      where h.opportunity_id = p_opportunity_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_partner_opportunities_pipeline()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null or not public._gpo337_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false);
  end if;
  perform public._gpo337_seed_stages();
  perform public._gpo337_seed_demo(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'kanban', coalesce((
      select jsonb_object_agg(
        s.stage_key,
        coalesce((
          select jsonb_agg(public._gpo337_opp_json(v_org_id, o) order by o.updated_at desc)
          from public.growth_partner_portal_opportunities o
          where o.partner_org_id = v_org_id and o.stage_key = s.stage_key and o.status = 'active'
            and public._gpo337_visible_opportunity(v_org_id, o.owner_auth_user_id)
        ), '[]'::jsonb)
      )
      from public.growth_partner_portal_opportunity_stages s where s.enabled = true
    ), '{}'::jsonb)
  );
end; $$;

create or replace function public.get_partner_opportunities_forecast()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null or not public._gpo337_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false);
  end if;
  perform public._gpo337_seed_demo(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'expected_revenue', coalesce((
      select sum(o.opportunity_value) from public.growth_partner_portal_opportunities o
      where o.partner_org_id = v_org_id and o.status = 'active' and o.stage_key not in ('closed_won', 'closed_lost')
    ), 0),
    'weighted_revenue', coalesce((
      select sum(o.opportunity_value * s.weight_pct / 100)
      from public.growth_partner_portal_opportunities o
      join public.growth_partner_portal_opportunity_stages s on s.stage_key = o.stage_key
      where o.partner_org_id = v_org_id and o.status = 'active' and o.stage_key not in ('closed_won', 'closed_lost')
    ), 0),
    'potential_commission', coalesce((
      select sum(public._gpo337_commission_estimate(o.opportunity_value) * s.weight_pct / 100)
      from public.growth_partner_portal_opportunities o
      join public.growth_partner_portal_opportunity_stages s on s.stage_key = o.stage_key
      where o.partner_org_id = v_org_id and o.status = 'active' and o.stage_key not in ('closed_won', 'closed_lost')
    ), 0),
    'by_month', coalesce((
      select jsonb_agg(jsonb_build_object(
        'month', to_char(o.expected_close_date, 'YYYY-MM'),
        'value', sum(o.opportunity_value),
        'weighted', sum(o.opportunity_value * s.weight_pct / 100)
      ) order by to_char(o.expected_close_date, 'YYYY-MM'))
      from public.growth_partner_portal_opportunities o
      join public.growth_partner_portal_opportunity_stages s on s.stage_key = o.stage_key
      where o.partner_org_id = v_org_id and o.expected_close_date is not null and o.status = 'active'
      group by to_char(o.expected_close_date, 'YYYY-MM')
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.create_partner_opportunity(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_key text;
  v_owner uuid := auth.uid();
  v_owner_name text := '';
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpo337_can_write(v_org_id, v_owner) then
    raise exception 'Write access required';
  end if;

  perform public._gpo337_seed_stages();
  v_key := 'OPP-' || upper(left(replace(gen_random_uuid()::text, '-', ''), 8));

  select coalesce(member_name, '') into v_owner_name
  from public.growth_partner_portal_members
  where partner_org_id = v_org_id and auth_user_id = v_owner limit 1;

  insert into public.growth_partner_portal_opportunities (
    partner_org_id, opportunity_key, company_name, contact_person, contact_email, contact_phone,
    country_code, industry, opportunity_value, expected_close_date, stage_key,
    owner_auth_user_id, owner_name, next_action, next_action_due, next_action_owner,
    last_activity_at, search_document
  ) values (
    v_org_id, v_key,
    coalesce(p_payload->>'company_name', 'New Prospect'),
    coalesce(p_payload->>'contact_person', ''),
    coalesce(p_payload->>'contact_email', ''),
    coalesce(p_payload->>'contact_phone', ''),
    coalesce(p_payload->>'country_code', ''),
    coalesce(p_payload->>'industry', ''),
    coalesce((p_payload->>'opportunity_value')::numeric, 0),
    nullif(p_payload->>'expected_close_date', '')::date,
    coalesce(nullif(p_payload->>'stage_key', ''), 'lead'),
    coalesce((p_payload->>'owner_auth_user_id')::uuid, v_owner),
    coalesce(p_payload->>'owner_name', v_owner_name),
    coalesce(p_payload->>'next_action', 'Initial outreach'),
    nullif(p_payload->>'next_action_due', '')::date,
    coalesce((p_payload->>'next_action_owner')::uuid, v_owner),
    now(),
    lower(trim(coalesce(p_payload->>'company_name', '') || ' ' || coalesce(p_payload->>'contact_person', '') || ' ' || coalesce(p_payload->>'industry', '')))
  ) returning id into v_id;

  insert into public.growth_partner_portal_opportunity_activities (
    opportunity_id, partner_org_id, activity_type, title, summary, actor_auth_user_id
  ) values (v_id, v_org_id, 'note', 'Opportunity created', 'New opportunity record created.', auth.uid());

  insert into public.growth_partner_portal_opportunity_stage_history (opportunity_id, from_stage, to_stage, changed_by)
  values (v_id, null, coalesce(nullif(p_payload->>'stage_key', ''), 'lead'), auth.uid());

  perform public._gpo337_recompute_health(v_id);
  perform public._gpo337_log_audit(v_org_id, v_id, 'opportunity_created', 'Opportunity created.', p_payload);

  return public.get_partner_opportunity(v_id);
end; $$;

create or replace function public.update_partner_opportunity(p_opportunity_id uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_opp public.growth_partner_portal_opportunities;
  v_old_stage text;
  v_activity_type text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();

  select * into v_opp from public.growth_partner_portal_opportunities
  where id = p_opportunity_id and partner_org_id = v_org_id;
  if v_opp.id is null then raise exception 'Opportunity not found'; end if;
  if not public._gpo337_can_write(v_org_id, v_opp.owner_auth_user_id) then
    raise exception 'Write access required';
  end if;

  v_old_stage := v_opp.stage_key;

  update public.growth_partner_portal_opportunities set
    company_name = coalesce(p_payload->>'company_name', company_name),
    contact_person = coalesce(p_payload->>'contact_person', contact_person),
    contact_email = coalesce(p_payload->>'contact_email', contact_email),
    contact_phone = coalesce(p_payload->>'contact_phone', contact_phone),
    country_code = coalesce(p_payload->>'country_code', country_code),
    industry = coalesce(p_payload->>'industry', industry),
    opportunity_value = coalesce((p_payload->>'opportunity_value')::numeric, opportunity_value),
    expected_close_date = coalesce(nullif(p_payload->>'expected_close_date', '')::date, expected_close_date),
    stage_key = coalesce(nullif(p_payload->>'stage_key', ''), stage_key),
    next_action = coalesce(p_payload->>'next_action', next_action),
    next_action_due = coalesce(nullif(p_payload->>'next_action_due', '')::date, next_action_due),
    next_action_owner = coalesce((p_payload->>'next_action_owner')::uuid, next_action_owner),
    last_activity_at = now(),
    search_document = lower(trim(
      coalesce(p_payload->>'company_name', company_name) || ' ' ||
      coalesce(p_payload->>'contact_person', contact_person) || ' ' ||
      coalesce(p_payload->>'industry', industry)
    )),
    updated_at = now()
  where id = p_opportunity_id
  returning * into v_opp;

  if p_payload ? 'activity_type' then
    v_activity_type := coalesce(p_payload->>'activity_type', 'note');
    insert into public.growth_partner_portal_opportunity_activities (
      opportunity_id, partner_org_id, activity_type, title, summary, actor_auth_user_id
    ) values (
      p_opportunity_id, v_org_id, v_activity_type,
      coalesce(p_payload->>'activity_title', 'Activity recorded'),
      coalesce(p_payload->>'activity_summary', ''),
      auth.uid()
    );
  end if;

  if v_old_stage <> v_opp.stage_key then
    insert into public.growth_partner_portal_opportunity_stage_history (opportunity_id, from_stage, to_stage, changed_by)
    values (p_opportunity_id, v_old_stage, v_opp.stage_key, auth.uid());
    insert into public.growth_partner_portal_opportunity_activities (
      opportunity_id, partner_org_id, activity_type, title, summary, actor_auth_user_id
    ) values (
      p_opportunity_id, v_org_id, 'stage_change', 'Stage changed',
      v_old_stage || ' → ' || v_opp.stage_key, auth.uid()
    );
  end if;

  perform public._gpo337_recompute_health(p_opportunity_id);
  perform public._gpo337_log_audit(v_org_id, p_opportunity_id, 'opportunity_updated', 'Opportunity updated.', p_payload);

  return public.get_partner_opportunity(p_opportunity_id);
end; $$;

grant execute on function public.get_partner_opportunities(text, text, text, numeric, uuid, text, text) to authenticated;
grant execute on function public.get_partner_opportunity(uuid) to authenticated;
grant execute on function public.get_partner_opportunities_pipeline() to authenticated;
grant execute on function public.get_partner_opportunities_forecast() to authenticated;
grant execute on function public.create_partner_opportunity(jsonb) to authenticated;
grant execute on function public.update_partner_opportunity(uuid, jsonb) to authenticated;
