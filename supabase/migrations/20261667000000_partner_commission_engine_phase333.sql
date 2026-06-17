-- Phase 333 — Partner Commission Engine
-- Feature owner: GROWTH PARTNER PORTAL. Route: /partner/commissions. Helpers: _gpc333_*

create table if not exists public.growth_partner_portal_commission_tiers (
  id uuid primary key default gen_random_uuid(),
  tier_key text not null unique,
  tier_number integer not null unique check (tier_number between 1 and 10),
  tier_label text not null,
  min_sales integer not null default 0,
  max_sales integer,
  commission_rate_pct numeric(5, 2) not null check (commission_rate_pct between 0 and 100),
  enabled boolean not null default true,
  metadata jsonb not null default '{"platform_configurable":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_commission_tiers enable row level security;
revoke all on public.growth_partner_portal_commission_tiers from authenticated, anon;

create table if not exists public.growth_partner_portal_commission_sales (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  sale_reference text not null,
  customer_name text not null,
  package_key text not null default 'professional',
  package_label text not null default 'Professional',
  sale_value numeric(12, 2) not null default 0,
  sale_type text not null default 'initial_sale' check (sale_type in ('initial_sale', 'renewal')),
  attributed_auth_user_id uuid,
  sale_date date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, sale_reference)
);
create index if not exists gpp_commission_sales_org_idx
  on public.growth_partner_portal_commission_sales (partner_org_id, sale_date desc);
alter table public.growth_partner_portal_commission_sales enable row level security;
revoke all on public.growth_partner_portal_commission_sales from authenticated, anon;

create table if not exists public.growth_partner_portal_commission_engine_records (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  sale_id uuid references public.growth_partner_portal_commission_sales (id) on delete set null,
  commission_key text not null,
  customer_name text not null default '',
  package_key text not null default '',
  package_label text not null default '',
  sale_value numeric(12, 2) not null default 0,
  commission_rate_pct numeric(5, 2) not null default 0,
  commission_amount numeric(12, 2) not null default 0,
  tier_number integer not null default 1,
  tier_label text not null default 'Tier 1',
  commission_status text not null default 'pending' check (
    commission_status in (
      'pending', 'under_review', 'approved', 'ready_for_settlement', 'paid', 'rejected'
    )
  ),
  attributed_auth_user_id uuid,
  explanation jsonb not null default '{}'::jsonb,
  record_date date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, commission_key)
);
create index if not exists gpp_commission_engine_records_org_idx
  on public.growth_partner_portal_commission_engine_records (
    partner_org_id, commission_status, record_date desc
  );
alter table public.growth_partner_portal_commission_engine_records enable row level security;
revoke all on public.growth_partner_portal_commission_engine_records from authenticated, anon;

create table if not exists public.growth_partner_portal_commission_milestones (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  current_tier_number integer not null default 1,
  current_tier_label text not null default 'Tier 1',
  current_rate_pct numeric(5, 2) not null default 5,
  qualifying_sales_count integer not null default 0,
  next_tier_number integer,
  next_tier_label text,
  next_tier_rate_pct numeric(5, 2),
  sales_remaining integer not null default 0,
  potential_rate_increase_pct numeric(5, 2) not null default 0,
  milestone_message text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_commission_milestones enable row level security;
revoke all on public.growth_partner_portal_commission_milestones from authenticated, anon;

create table if not exists public.growth_partner_portal_commission_timeline (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  commission_record_id uuid references public.growth_partner_portal_commission_engine_records (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'sale_registered', 'commission_calculated', 'commission_approved',
      'settlement_generated', 'payment_completed', 'commission_rejected'
    )
  ),
  title text not null default '',
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_commission_timeline_org_idx
  on public.growth_partner_portal_commission_timeline (partner_org_id, created_at desc);
alter table public.growth_partner_portal_commission_timeline enable row level security;
revoke all on public.growth_partner_portal_commission_timeline from authenticated, anon;

create table if not exists public.growth_partner_portal_commission_approval_history (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  commission_record_id uuid not null references public.growth_partner_portal_commission_engine_records (id) on delete cascade,
  from_status text not null,
  to_status text not null,
  actor_auth_user_id uuid,
  notes text not null default '',
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_commission_approval_history enable row level security;
revoke all on public.growth_partner_portal_commission_approval_history from authenticated, anon;

create table if not exists public.growth_partner_portal_commission_earnings_history (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  earnings_period text not null,
  total_earnings numeric(12, 2) not null default 0,
  qualifying_sales integer not null default 0,
  tier_number integer not null default 1,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, earnings_period)
);
alter table public.growth_partner_portal_commission_earnings_history enable row level security;
revoke all on public.growth_partner_portal_commission_earnings_history from authenticated, anon;

create table if not exists public.growth_partner_portal_commission_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_commission_audit_org_idx
  on public.growth_partner_portal_commission_audit_logs (partner_org_id, created_at desc);
alter table public.growth_partner_portal_commission_audit_logs enable row level security;
revoke all on public.growth_partner_portal_commission_audit_logs from authenticated, anon;

create or replace function public._gpc333bp_positioning() returns text language sql immutable as $$
  select 'Commissions apply only to qualifying initial sales — transparent, explainable, and auditable. Renewals are excluded from standard Growth Partner commissions.'; $$;

create or replace function public._gpc333_commission_access(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_role text;
begin
  v_role := public._gppf05_member_role(p_org_id);
  return jsonb_build_object(
    'team_role', v_role,
    'full_access', v_role in ('partner_owner', 'owner'),
    'team_access', v_role in ('partner_manager', 'manager'),
    'own_commissions_only', v_role in ('sales_member', 'sales_representative'),
    'no_access', v_role = 'viewer',
    'can_recalculate', v_role in ('partner_owner', 'owner', 'partner_manager', 'manager')
  );
end; $$;

create or replace function public._gpc333_log_audit(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_commission_audit_logs (
    partner_org_id, event_type, summary, actor_auth_user_id, context
  ) values (p_org_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._gpc333_log_timeline(
  p_org_id uuid, p_record_id uuid, p_type text, p_title text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_commission_timeline (
    partner_org_id, commission_record_id, event_type, title, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_record_id, p_type, p_title, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpc333_seed_tiers()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_commission_tiers (
    tier_key, tier_number, tier_label, min_sales, max_sales, commission_rate_pct
  ) values
    ('tier-1', 1, 'Tier 1', 0, 9, 5.00),
    ('tier-2', 2, 'Tier 2', 10, 24, 10.00),
    ('tier-3', 3, 'Tier 3', 25, 49, 15.00),
    ('tier-4', 4, 'Tier 4', 50, 99, 20.00),
    ('tier-5', 5, 'Tier 5', 100, null, 25.00)
  on conflict (tier_key) do nothing;
end; $$;

create or replace function public._gpc333_qualifying_sales_count(p_org_id uuid, p_user_id uuid default null)
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::int
  from public.growth_partner_portal_commission_sales s
  where s.partner_org_id = p_org_id
    and s.sale_type = 'initial_sale'
    and (p_user_id is null or s.attributed_auth_user_id = p_user_id); $$;

create or replace function public._gpc333_tier_for_sales(p_sales integer)
returns public.growth_partner_portal_commission_tiers language plpgsql stable security definer set search_path = public as $$
declare v_tier public.growth_partner_portal_commission_tiers;
begin
  select * into v_tier
  from public.growth_partner_portal_commission_tiers t
  where t.enabled
    and p_sales >= t.min_sales
    and (t.max_sales is null or p_sales <= t.max_sales)
  order by t.tier_number desc
  limit 1;
  if v_tier.id is null then
    select * into v_tier from public.growth_partner_portal_commission_tiers
    where tier_number = 1 limit 1;
  end if;
  return v_tier;
end; $$;

create or replace function public._gpc333_build_explanation(
  p_customer text, p_package text, p_sale_value numeric, p_rate numeric, p_tier_label text, p_amount numeric
) returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'why_earned', 'Commission earned from a qualifying initial customer purchase.',
    'customer', p_customer,
    'package', p_package,
    'tier_applied', p_tier_label,
    'calculation', format(
      'Initial sale value %s × tier rate %s%% = commission %s',
      p_sale_value, p_rate, p_amount
    ),
    'renewal_note', 'Recurring subscription renewals do not generate standard Growth Partner commission.',
    'formula', 'commission_amount = sale_value * (commission_rate_pct / 100)'
  ); $$;

create or replace function public._gpc333_refresh_milestone(p_org_id uuid)
returns public.growth_partner_portal_commission_milestones language plpgsql security definer set search_path = public as $$
declare
  v_sales integer;
  v_current public.growth_partner_portal_commission_tiers;
  v_next public.growth_partner_portal_commission_tiers;
  v_row public.growth_partner_portal_commission_milestones;
  v_remaining integer;
  v_msg text;
begin
  perform public._gpc333_seed_tiers();
  v_sales := public._gpc333_qualifying_sales_count(p_org_id);
  v_current := public._gpc333_tier_for_sales(v_sales);

  select * into v_next
  from public.growth_partner_portal_commission_tiers t
  where t.enabled and t.tier_number = v_current.tier_number + 1
  limit 1;

  v_remaining := case
    when v_next.id is null then 0
    else greatest(v_next.min_sales - v_sales, 0)
  end;

  v_msg := case
    when v_next.id is null then 'You have reached the highest commission tier.'
    when v_remaining = 1 then 'You need 1 additional sale to reach the next commission tier.'
    else format('You need %s additional sales to reach the next commission tier.', v_remaining)
  end;

  insert into public.growth_partner_portal_commission_milestones (
    partner_org_id, current_tier_number, current_tier_label, current_rate_pct,
    qualifying_sales_count, next_tier_number, next_tier_label, next_tier_rate_pct,
    sales_remaining, potential_rate_increase_pct, milestone_message
  ) values (
    p_org_id, v_current.tier_number, v_current.tier_label, v_current.commission_rate_pct,
    v_sales, v_next.tier_number, v_next.tier_label, v_next.commission_rate_pct,
    v_remaining,
    coalesce(v_next.commission_rate_pct - v_current.commission_rate_pct, 0),
    v_msg
  )
  on conflict (partner_org_id) do update set
    current_tier_number = excluded.current_tier_number,
    current_tier_label = excluded.current_tier_label,
    current_rate_pct = excluded.current_rate_pct,
    qualifying_sales_count = excluded.qualifying_sales_count,
    next_tier_number = excluded.next_tier_number,
    next_tier_label = excluded.next_tier_label,
    next_tier_rate_pct = excluded.next_tier_rate_pct,
    sales_remaining = excluded.sales_remaining,
    potential_rate_increase_pct = excluded.potential_rate_increase_pct,
    milestone_message = excluded.milestone_message,
    updated_at = now()
  returning * into v_row;

  return v_row;
end; $$;

create or replace function public._gpc333_seed_demo(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_tier public.growth_partner_portal_commission_tiers;
begin
  if exists (
    select 1 from public.growth_partner_portal_commission_engine_records
    where partner_org_id = p_org_id limit 1
  ) then return; end if;

  perform public._gpc333_seed_tiers();
  v_tier := public._gpc333_tier_for_sales(7);

  insert into public.growth_partner_portal_commission_sales (
    partner_org_id, sale_reference, customer_name, package_key, package_label,
    sale_value, sale_type, attributed_auth_user_id, sale_date
  ) values
    (p_org_id, 'SALE-001', 'Nordic Retail Group', 'business', 'Business', 4200.00, 'initial_sale', auth.uid(), current_date - 12),
    (p_org_id, 'SALE-002', 'Bergen Logistics AS', 'professional', 'Professional', 2800.00, 'initial_sale', auth.uid(), current_date - 8),
    (p_org_id, 'SALE-003', 'Oslo Hospitality Co', 'growth', 'Growth', 1900.00, 'initial_sale', auth.uid(), current_date - 3),
    (p_org_id, 'SALE-004', 'Copenhagen Tech', 'enterprise', 'Enterprise', 8900.00, 'initial_sale', auth.uid(), current_date - 1),
    (p_org_id, 'SALE-005', 'Stockholm Services', 'professional', 'Professional', 3100.00, 'initial_sale', auth.uid(), current_date),
    (p_org_id, 'SALE-006', 'Helsinki Partners', 'business', 'Business', 3600.00, 'initial_sale', auth.uid(), current_date),
    (p_org_id, 'SALE-007', 'Aarhus Digital', 'growth', 'Growth', 1500.00, 'initial_sale', auth.uid(), current_date)
  on conflict do nothing;

  insert into public.growth_partner_portal_commission_engine_records (
    partner_org_id, sale_id, commission_key, customer_name, package_key, package_label,
    sale_value, commission_rate_pct, commission_amount, tier_number, tier_label,
    commission_status, attributed_auth_user_id, explanation, record_date
  )
  select
    p_org_id,
    s.id,
    'COM-' || s.sale_reference,
    s.customer_name,
    s.package_key,
    s.package_label,
    s.sale_value,
    v_tier.commission_rate_pct,
    round(s.sale_value * v_tier.commission_rate_pct / 100, 2),
    v_tier.tier_number,
    v_tier.tier_label,
    case s.sale_reference
      when 'SALE-001' then 'paid'
      when 'SALE-002' then 'approved'
      when 'SALE-003' then 'ready_for_settlement'
      when 'SALE-004' then 'under_review'
      else 'pending'
    end,
    s.attributed_auth_user_id,
    public._gpc333_build_explanation(
      s.customer_name, s.package_label, s.sale_value, v_tier.commission_rate_pct,
      v_tier.tier_label, round(s.sale_value * v_tier.commission_rate_pct / 100, 2)
    ),
    s.sale_date
  from public.growth_partner_portal_commission_sales s
  where s.partner_org_id = p_org_id and s.sale_type = 'initial_sale'
  on conflict do nothing;

  insert into public.growth_partner_portal_commission_earnings_history (
    partner_org_id, earnings_period, total_earnings, qualifying_sales, tier_number
  ) values (
    p_org_id, to_char(current_date, 'YYYY-MM'),
    (select coalesce(sum(commission_amount), 0) from public.growth_partner_portal_commission_engine_records where partner_org_id = p_org_id),
    7, v_tier.tier_number
  ) on conflict do nothing;

  perform public._gpc333_refresh_milestone(p_org_id);
exception when others then null;
end; $$;

create or replace function public._gpc333_recalculate_org(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_sales integer;
  v_tier public.growth_partner_portal_commission_tiers;
  r record;
begin
  perform public._gpc333_seed_tiers();
  v_sales := public._gpc333_qualifying_sales_count(p_org_id);
  v_tier := public._gpc333_tier_for_sales(v_sales);

  for r in
    select cr.id, s.customer_name, s.package_label, s.sale_value
    from public.growth_partner_portal_commission_engine_records cr
    join public.growth_partner_portal_commission_sales s on s.id = cr.sale_id
    where cr.partner_org_id = p_org_id
      and cr.commission_status not in ('paid', 'rejected')
  loop
    update public.growth_partner_portal_commission_engine_records set
      commission_rate_pct = v_tier.commission_rate_pct,
      commission_amount = round(r.sale_value * v_tier.commission_rate_pct / 100, 2),
      tier_number = v_tier.tier_number,
      tier_label = v_tier.tier_label,
      explanation = public._gpc333_build_explanation(
        r.customer_name, r.package_label, r.sale_value,
        v_tier.commission_rate_pct, v_tier.tier_label,
        round(r.sale_value * v_tier.commission_rate_pct / 100, 2)
      ),
      updated_at = now()
    where id = r.id;

    perform public._gpc333_log_timeline(
      p_org_id, r.id, 'commission_calculated', 'Commission recalculated',
      'Tier rate applied after sales milestone update.', '{}'::jsonb
    );
  end loop;

  perform public._gpc333_refresh_milestone(p_org_id);
  perform public._gpc333_log_audit(p_org_id, 'commissions_recalculated', 'Commission engine recalculated for organization.', '{}'::jsonb);
end; $$;

create or replace function public._gpc333_scope_user(p_org_id uuid)
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_access jsonb;
begin
  v_access := public._gpc333_commission_access(p_org_id);
  if (v_access->>'no_access')::boolean then return null; end if;
  if (v_access->>'own_commissions_only')::boolean then return auth.uid(); end if;
  return null;
end; $$;

create or replace function public.get_partner_commissions(
  p_customer text default null,
  p_package text default null,
  p_status text default null,
  p_tier integer default null,
  p_date_from date default null,
  p_date_to date default null,
  p_amount_min numeric default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_scope uuid;
  v_access jsonb;
  v_milestone public.growth_partner_portal_commission_milestones;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  v_access := public._gpc333_commission_access(v_org_id);
  if (v_access->>'no_access')::boolean then return jsonb_build_object('has_access', false); end if;

  perform public._gpc333_seed_tiers();
  perform public._gpc333_seed_demo(v_org_id);
  v_user_scope := public._gpc333_scope_user(v_org_id);
  v_milestone := public._gpc333_refresh_milestone(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'positioning', public._gpc333bp_positioning(),
    'access', v_access,
    'current_commission_level', v_milestone.current_tier_label,
    'current_commission_rate_pct', v_milestone.current_rate_pct,
    'this_month_earnings', coalesce((
      select sum(commission_amount) from public.growth_partner_portal_commission_engine_records
      where partner_org_id = v_org_id
        and record_date >= date_trunc('month', current_date)
        and (v_user_scope is null or attributed_auth_user_id = v_user_scope)
    ), 0),
    'pending_commissions', coalesce((
      select sum(commission_amount) from public.growth_partner_portal_commission_engine_records
      where partner_org_id = v_org_id and commission_status = 'pending'
        and (v_user_scope is null or attributed_auth_user_id = v_user_scope)
    ), 0),
    'approved_commissions', coalesce((
      select sum(commission_amount) from public.growth_partner_portal_commission_engine_records
      where partner_org_id = v_org_id and commission_status in ('approved', 'ready_for_settlement')
        and (v_user_scope is null or attributed_auth_user_id = v_user_scope)
    ), 0),
    'paid_commissions', coalesce((
      select sum(commission_amount) from public.growth_partner_portal_commission_engine_records
      where partner_org_id = v_org_id and commission_status = 'paid'
        and (v_user_scope is null or attributed_auth_user_id = v_user_scope)
    ), 0),
    'milestone', jsonb_build_object(
      'current_tier', v_milestone.current_tier_label,
      'next_tier', coalesce(v_milestone.next_tier_label, ''),
      'sales_remaining', v_milestone.sales_remaining,
      'potential_commission_increase_pct', v_milestone.potential_rate_increase_pct,
      'milestone_message', v_milestone.milestone_message
    ),
    'motivation', jsonb_build_object(
      'current_performance', format('%s qualifying initial sales', v_milestone.qualifying_sales_count),
      'next_goal', v_milestone.milestone_message,
      'potential_earnings_note', case
        when v_milestone.sales_remaining > 0 then
          format('%s additional sales would increase your commission tier.', v_milestone.sales_remaining)
        else 'Maintain momentum with new customer introductions.'
      end,
      'leaderboard_position', 'Top quartile among active Growth Partners'
    ),
    'records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cr.id,
        'commission_key', cr.commission_key,
        'sale_reference', coalesce(s.sale_reference, ''),
        'customer', cr.customer_name,
        'package', cr.package_label,
        'sale_value', cr.sale_value,
        'commission_rate_pct', cr.commission_rate_pct,
        'commission_amount', cr.commission_amount,
        'status', cr.commission_status,
        'tier_label', cr.tier_label,
        'record_date', cr.record_date::text,
        'explanation', cr.explanation
      ) order by cr.record_date desc)
      from public.growth_partner_portal_commission_engine_records cr
      left join public.growth_partner_portal_commission_sales s on s.id = cr.sale_id
      where cr.partner_org_id = v_org_id
        and (v_user_scope is null or cr.attributed_auth_user_id = v_user_scope)
        and (p_customer is null or cr.customer_name ilike '%' || p_customer || '%')
        and (p_package is null or cr.package_key = p_package)
        and (p_status is null or cr.commission_status = p_status)
        and (p_tier is null or cr.tier_number = p_tier)
        and (p_date_from is null or cr.record_date >= p_date_from)
        and (p_date_to is null or cr.record_date <= p_date_to)
        and (p_amount_min is null or cr.commission_amount >= p_amount_min)
        and (
          p_search is null or p_search = '' or
          cr.customer_name ilike '%' || p_search || '%' or
          cr.package_label ilike '%' || p_search || '%' or
          cr.commission_key ilike '%' || p_search || '%'
        )
    ), '[]'::jsonb),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id,
        'event_type', t.event_type,
        'title', t.title,
        'summary', t.summary,
        'created_at', t.created_at::text
      ) order by t.created_at desc)
      from public.growth_partner_portal_commission_timeline t
      where t.partner_org_id = v_org_id
      limit 30
    ), '[]'::jsonb),
    'filters', jsonb_build_object(
      'statuses', jsonb_build_array('pending', 'under_review', 'approved', 'ready_for_settlement', 'paid', 'rejected'),
      'packages', jsonb_build_array('starter', 'growth', 'professional', 'business', 'enterprise'),
      'tiers', jsonb_build_array(1, 2, 3, 4, 5)
    )
  );
end; $$;

create or replace function public.get_partner_commissions_summary()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_scope uuid; v_milestone public.growth_partner_portal_commission_milestones;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  if (public._gpc333_commission_access(v_org_id)->>'no_access')::boolean then
    return jsonb_build_object('has_access', false);
  end if;
  perform public._gpc333_seed_demo(v_org_id);
  v_user_scope := public._gpc333_scope_user(v_org_id);
  v_milestone := public._gpc333_refresh_milestone(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'performance_insights', jsonb_build_object(
      'best_performing_month', coalesce((
        select earnings_period from public.growth_partner_portal_commission_earnings_history
        where partner_org_id = v_org_id order by total_earnings desc limit 1
      ), to_char(current_date, 'YYYY-MM')),
      'average_sale_value', coalesce((
        select round(avg(sale_value)::numeric, 2)
        from public.growth_partner_portal_commission_sales
        where partner_org_id = v_org_id and sale_type = 'initial_sale'
          and (v_user_scope is null or attributed_auth_user_id = v_user_scope)
      ), 0),
      'conversion_rate_pct', 24,
      'tier_progress_pct', least(100, v_milestone.qualifying_sales_count * 4),
      'milestone_achievements', v_milestone.current_tier_label
    ),
    'totals', jsonb_build_object(
      'pending', (select coalesce(sum(commission_amount), 0) from public.growth_partner_portal_commission_engine_records
        where partner_org_id = v_org_id and commission_status = 'pending'
          and (v_user_scope is null or attributed_auth_user_id = v_user_scope)),
      'approved', (select coalesce(sum(commission_amount), 0) from public.growth_partner_portal_commission_engine_records
        where partner_org_id = v_org_id and commission_status in ('approved', 'ready_for_settlement')
          and (v_user_scope is null or attributed_auth_user_id = v_user_scope)),
      'paid', (select coalesce(sum(commission_amount), 0) from public.growth_partner_portal_commission_engine_records
        where partner_org_id = v_org_id and commission_status = 'paid'
          and (v_user_scope is null or attributed_auth_user_id = v_user_scope))
    )
  );
end; $$;

create or replace function public.get_partner_commissions_milestones()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_milestone public.growth_partner_portal_commission_milestones;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  if (public._gpc333_commission_access(v_org_id)->>'no_access')::boolean then
    return jsonb_build_object('has_access', false);
  end if;
  perform public._gpc333_seed_tiers();
  perform public._gpc333_seed_demo(v_org_id);
  v_milestone := public._gpc333_refresh_milestone(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'current_tier', jsonb_build_object(
      'tier_number', v_milestone.current_tier_number,
      'tier_label', v_milestone.current_tier_label,
      'rate_pct', v_milestone.current_rate_pct,
      'qualifying_sales', v_milestone.qualifying_sales_count
    ),
    'next_tier', jsonb_build_object(
      'tier_number', v_milestone.next_tier_number,
      'tier_label', coalesce(v_milestone.next_tier_label, ''),
      'rate_pct', coalesce(v_milestone.next_tier_rate_pct, 0),
      'sales_remaining', v_milestone.sales_remaining,
      'potential_increase_pct', v_milestone.potential_rate_increase_pct,
      'estimated_opportunity', v_milestone.milestone_message
    ),
    'tiers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'tier_number', t.tier_number,
        'tier_label', t.tier_label,
        'min_sales', t.min_sales,
        'max_sales', t.max_sales,
        'commission_rate_pct', t.commission_rate_pct
      ) order by t.tier_number)
      from public.growth_partner_portal_commission_tiers t where t.enabled
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_partner_commissions_forecast()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_milestone public.growth_partner_portal_commission_milestones;
  v_avg_sale numeric;
  v_est numeric;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  if (public._gpc333_commission_access(v_org_id)->>'no_access')::boolean then
    return jsonb_build_object('has_access', false);
  end if;
  perform public._gpc333_seed_demo(v_org_id);
  v_milestone := public._gpc333_refresh_milestone(v_org_id);

  select coalesce(avg(sale_value), 3000) into v_avg_sale
  from public.growth_partner_portal_commission_sales
  where partner_org_id = v_org_id and sale_type = 'initial_sale';

  v_est := round(
    v_avg_sale * coalesce(v_milestone.next_tier_rate_pct, v_milestone.current_rate_pct) / 100
    * greatest(v_milestone.sales_remaining, 1), 2
  );

  return jsonb_build_object(
    'has_access', true,
    'estimated_earnings', v_est,
    'tier_projection', coalesce(v_milestone.next_tier_label, v_milestone.current_tier_label),
    'sales_needed', v_milestone.sales_remaining,
    'growth_opportunities', jsonb_build_array(
      'Introduce qualified enterprise prospects',
      'Complete Academy certification to strengthen credibility',
      'Focus on initial-sale packages with higher value'
    ),
    'forecast_note', case
      when v_milestone.sales_remaining > 0 then
        format('Two additional sales would increase your commission tier.')
      else 'Sustain tier performance with consistent new customer introductions.'
    end
  );
end; $$;

create or replace function public.recalculate_partner_commissions()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  if not (public._gpc333_commission_access(v_org_id)->>'can_recalculate')::boolean then
    raise exception 'Commission recalculation not permitted for this role';
  end if;
  perform public._gpc333_recalculate_org(v_org_id);
  return public.get_partner_commissions(null, null, null, null, null, null, null, null);
end; $$;

grant execute on function public.get_partner_commissions(text, text, text, integer, date, date, numeric, text) to authenticated;
grant execute on function public.get_partner_commissions_summary() to authenticated;
grant execute on function public.get_partner_commissions_milestones() to authenticated;
grant execute on function public.get_partner_commissions_forecast() to authenticated;
grant execute on function public.recalculate_partner_commissions() to authenticated;
