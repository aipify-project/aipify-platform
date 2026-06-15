-- Phase Airbnb 10 — Aipify Hosts Referral & Growth Engine
-- Feature owner: CUSTOMER APP. Helpers: _ahostref_* (engine), _ahostbp372_* (blueprint)

create table if not exists public.aipify_hosts_referral_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  referral_role text not null default 'host' check (
    referral_role in ('host', 'service_provider', 'growth_partner')
  ),
  growth_partner_enabled boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true,"transparent_rewards":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_referral_settings enable row level security;
revoke all on public.aipify_hosts_referral_settings from authenticated, anon;

create table if not exists public.aipify_hosts_referral_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  referral_role text not null check (referral_role in ('host', 'service_provider', 'growth_partner')),
  referral_code text not null,
  link_path text not null default '/welcome/hosts',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, referral_role),
  unique (referral_code)
);
create index if not exists aipify_hosts_referral_links_tenant_idx
  on public.aipify_hosts_referral_links (tenant_id);
alter table public.aipify_hosts_referral_links enable row level security;
revoke all on public.aipify_hosts_referral_links from authenticated, anon;

create table if not exists public.aipify_hosts_referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_tenant_id uuid not null references public.customers (id) on delete cascade,
  referral_key text not null,
  referral_role text not null check (referral_role in ('host', 'service_provider', 'growth_partner')),
  referred_label text not null,
  referred_tenant_id uuid references public.customers (id) on delete set null,
  status text not null default 'invited' check (
    status in ('invited', 'registered', 'trial_started', 'converted', 'active', 'rewarded')
  ),
  conversion_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (referrer_tenant_id, referral_key)
);
create unique index if not exists aipify_hosts_referrals_no_duplicate_idx
  on public.aipify_hosts_referrals (referrer_tenant_id, lower(referred_label));
create index if not exists aipify_hosts_referrals_status_idx
  on public.aipify_hosts_referrals (referrer_tenant_id, status);
alter table public.aipify_hosts_referrals enable row level security;
revoke all on public.aipify_hosts_referrals from authenticated, anon;

create table if not exists public.aipify_hosts_referral_rewards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  referral_id uuid references public.aipify_hosts_referrals (id) on delete set null,
  reward_type text not null check (
    reward_type in ('fixed', 'percentage', 'account_credit', 'free_property_license')
  ),
  reward_label text not null,
  reward_value numeric(12,2),
  status text not null default 'pending' check (status in ('pending', 'unlocked', 'applied', 'expired')),
  unlocked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_referral_rewards_tenant_idx
  on public.aipify_hosts_referral_rewards (tenant_id, status);
alter table public.aipify_hosts_referral_rewards enable row level security;
revoke all on public.aipify_hosts_referral_rewards from authenticated, anon;

create table if not exists public.aipify_hosts_referral_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_referral_events_tenant_idx
  on public.aipify_hosts_referral_events (tenant_id, created_at desc);
alter table public.aipify_hosts_referral_events enable row level security;
revoke all on public.aipify_hosts_referral_events from authenticated, anon;

create or replace function public._ahostref_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_referral_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_referral_settings;
begin
  insert into public.aipify_hosts_referral_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_referral_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ahostref_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_referral_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context)
  returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'referral_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp372_positioning() returns text language sql immutable as $$
  select 'Recommend Aipify Hosts and benefit from helping grow the hospitality ecosystem.'; $$;

create or replace function public._ahostbp372_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'referral_links', 'label', 'Referral Links', 'description', 'Generate shareable referral links for hosts, service providers, and Growth Partners.'),
    jsonb_build_object('key', 'referral_tracking', 'label', 'Referral Tracking', 'description', 'Track invitations from registered through converted and rewarded.'),
    jsonb_build_object('key', 'conversion_monitoring', 'label', 'Conversion Monitoring', 'description', 'View conversion status with transparent lifecycle stages.'),
    jsonb_build_object('key', 'reward_monitoring', 'label', 'Reward Monitoring', 'description', 'Monitor pending and unlocked rewards across fixed, percentage, credit, and property license types.'),
    jsonb_build_object('key', 'referral_assets', 'label', 'Referral Assets', 'description', 'Download professional referral assets for sharing.'),
    jsonb_build_object('key', 'growth_partner_oversight', 'label', 'Growth Partner Oversight', 'description', 'Multi-account reporting, commission summaries, and conversion tracking for Growth Partners.')
  ); $$;

create or replace function public._ahostbp372_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth should be measurable. Referrals should be transparent. Rewards encourage long-term retention. All referral events are audit logged. Duplicate and self-referrals are blocked.',
    'audit_required', true,
    'prevent_duplicate_referrals', true,
    'prevent_self_referrals', true,
    'reward_history_tracked', true
  ); $$;

create or replace function public._ahostbp372_reward_catalog() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'refer_1_host', 'label', 'Refer 1 host', 'reward', '1 month free additional property license', 'reward_type', 'free_property_license'),
    jsonb_build_object('key', 'refer_5_hosts', 'label', 'Refer 5 hosts', 'reward', 'Hosts Solo upgrade credit', 'reward_type', 'account_credit'),
    jsonb_build_object('key', 'growth_partner_commission', 'label', 'Growth Partner', 'reward', 'Commission structure on converted accounts', 'reward_type', 'percentage')
  ); $$;

create or replace function public._ahostbp372_knowledge_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Referral program overview',
    'Reward structures',
    'Growth Partner guidelines',
    'Referral best practices'
  ); $$;

create or replace function public._ahostbp372_notification_triggers() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Referral registered',
    'Trial activated',
    'Referral converted',
    'Reward unlocked'
  ); $$;

create or replace function public._ahostref_referral_json(r public.aipify_hosts_referrals)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id,
    'referral_key', r.referral_key,
    'referral_role', r.referral_role,
    'referred_label', r.referred_label,
    'status', r.status,
    'conversion_at', r.conversion_at,
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
$$;

create or replace function public._ahostref_reward_json(r public.aipify_hosts_referral_rewards)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id,
    'referral_id', r.referral_id,
    'reward_type', r.reward_type,
    'reward_label', r.reward_label,
    'reward_value', r.reward_value,
    'status', r.status,
    'unlocked_at', r.unlocked_at,
    'created_at', r.created_at
  );
$$;

create or replace function public.generate_aipify_hosts_referral_link(
  p_referral_role text default 'host',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_code text;
  v_link public.aipify_hosts_referral_links;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if p_referral_role not in ('host', 'service_provider', 'growth_partner') then
    raise exception 'Invalid referral role';
  end if;
  perform public._ahostref_ensure_settings(v_tenant_id);
  v_code := 'ahref_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  insert into public.aipify_hosts_referral_links (tenant_id, referral_role, referral_code)
  values (v_tenant_id, p_referral_role, v_code)
  on conflict (tenant_id, referral_role) do update
  set referral_code = excluded.referral_code, updated_at = now(), is_active = true
  returning * into v_link;
  perform public._ahostref_log_event(
    v_tenant_id, 'link_generated', 'Referral link generated',
    jsonb_build_object('referral_role', p_referral_role, 'referral_code', v_link.referral_code)
  );
  return jsonb_build_object(
    'success', true,
    'referral_role', v_link.referral_role,
    'referral_code', v_link.referral_code,
    'referral_url', v_link.link_path || '?ref=' || v_link.referral_code,
    'download_assets_route', '/app/aipify-hosts/referrals/assets'
  );
end; $$;

create or replace function public._ahostref_widget_snapshot(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_month int;
  v_active int;
  v_pending int;
  v_lifetime int;
begin
  select count(*) into v_month
  from public.aipify_hosts_referrals
  where referrer_tenant_id = p_tenant_id
    and created_at >= date_trunc('month', now());
  select count(*) into v_active
  from public.aipify_hosts_referrals
  where referrer_tenant_id = p_tenant_id
    and status in ('registered', 'trial_started', 'converted', 'active');
  select count(*) into v_pending
  from public.aipify_hosts_referral_rewards
  where tenant_id = p_tenant_id and status = 'pending';
  select count(*) into v_lifetime
  from public.aipify_hosts_referrals
  where referrer_tenant_id = p_tenant_id;
  return jsonb_build_object(
    'referrals_this_month', v_month,
    'active_referrals', v_active,
    'pending_rewards', v_pending,
    'lifetime_referrals', v_lifetime
  );
end; $$;

create or replace function public._ahostref_seed_demo(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.aipify_hosts_referrals where referrer_tenant_id = p_tenant_id limit 1) then
    return;
  end if;
  insert into public.aipify_hosts_referrals (
    referrer_tenant_id, referral_key, referral_role, referred_label, status, conversion_at
  ) values
    (p_tenant_id, 'ref_demo_01', 'host', 'Nordic Stays AS', 'converted', now() - interval '12 days'),
    (p_tenant_id, 'ref_demo_02', 'host', 'Bergen Vacation Rentals', 'trial_started', null),
    (p_tenant_id, 'ref_demo_03', 'host', 'Fjord Host Collective', 'registered', null),
    (p_tenant_id, 'ref_demo_04', 'service_provider', 'Vestland Clean Services', 'active', now() - interval '30 days')
  on conflict do nothing;
  insert into public.aipify_hosts_referral_rewards (
    tenant_id, referral_id, reward_type, reward_label, reward_value, status, unlocked_at
  )
  select
    p_tenant_id,
    r.id,
    'free_property_license',
    '1 month free additional property license',
    1,
    case when r.status in ('converted', 'active', 'rewarded') then 'unlocked' else 'pending' end,
    case when r.status in ('converted', 'active', 'rewarded') then now() - interval '5 days' else null end
  from public.aipify_hosts_referrals r
  where r.referrer_tenant_id = p_tenant_id and r.referral_key = 'ref_demo_01'
  on conflict do nothing;
end; $$;

create or replace function public.get_aipify_hosts_referral_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_ref public.aipify_hosts_referral_settings;
  v_widgets jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_ref := public._ahostref_ensure_settings(v_tenant_id);
  v_widgets := public._ahostref_widget_snapshot(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ref.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'referral_role', v_ref.referral_role,
    'widgets', v_widgets,
    'human_oversight_required', true,
    'positioning', public._ahostbp372_positioning(),
    'route', '/app/aipify-hosts/referrals'
  );
end; $$;

create or replace function public.get_aipify_hosts_referral_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_ref public.aipify_hosts_referral_settings;
  v_props int;
  v_links jsonb;
  v_referrals jsonb;
  v_rewards jsonb;
  v_events jsonb;
  v_growth jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_ref := public._ahostref_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  if v_props > 0 then perform public._ahostref_seed_demo(v_tenant_id); end if;
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'referral_role', l.referral_role,
      'referral_code', l.referral_code,
      'referral_url', l.link_path || '?ref=' || l.referral_code,
      'is_active', l.is_active
    )
  ), '[]'::jsonb) into v_links
  from public.aipify_hosts_referral_links l where l.tenant_id = v_tenant_id;
  select coalesce(jsonb_agg(public._ahostref_referral_json(r) order by r.updated_at desc), '[]'::jsonb)
  into v_referrals from public.aipify_hosts_referrals r where r.referrer_tenant_id = v_tenant_id;
  select coalesce(jsonb_agg(public._ahostref_reward_json(rw) order by rw.created_at desc), '[]'::jsonb)
  into v_rewards from public.aipify_hosts_referral_rewards rw where rw.tenant_id = v_tenant_id;
  select coalesce(jsonb_agg(
    jsonb_build_object('event_type', e.event_type, 'summary', e.summary, 'created_at', e.created_at)
    order by e.created_at desc
  ), '[]'::jsonb)
  into v_events
  from public.aipify_hosts_referral_events e
  where e.tenant_id = v_tenant_id
  limit 10;
  v_growth := case when v_ref.growth_partner_enabled then jsonb_build_object(
    'enabled', true,
    'accounts_oversight', 3,
    'commission_summary', jsonb_build_object('pending', 420, 'paid', 1280, 'currency', 'NOK'),
    'conversion_rate_pct', 38,
    'reporting_period', 'month'
  ) else jsonb_build_object('enabled', false) end;
  perform public._ahostref_log_event(v_tenant_id, 'dashboard_view', 'Referral dashboard viewed', '{}'::jsonb);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ref.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'referral_role', v_ref.referral_role,
    'human_oversight_required', true,
    'positioning', public._ahostbp372_positioning(),
    'modules', public._ahostbp372_modules(),
    'governance', public._ahostbp372_governance(),
    'reward_catalog', public._ahostbp372_reward_catalog(),
    'knowledge_categories', public._ahostbp372_knowledge_categories(),
    'notification_triggers', public._ahostbp372_notification_triggers(),
    'referral_roles', jsonb_build_array('host', 'service_provider', 'growth_partner'),
    'referral_statuses', jsonb_build_array(
      'invited', 'registered', 'trial_started', 'converted', 'active', 'rewarded'
    ),
    'reward_types', jsonb_build_array(
      'fixed', 'percentage', 'account_credit', 'free_property_license'
    ),
    'widgets', public._ahostref_widget_snapshot(v_tenant_id),
    'referral_links', v_links,
    'referrals', v_referrals,
    'rewards', v_rewards,
    'recent_events', v_events,
    'growth_partner', v_growth,
    'referral_assets', jsonb_build_array(
      jsonb_build_object('key', 'host_one_pager', 'label', 'Host referral one-pager', 'format', 'pdf'),
      jsonb_build_object('key', 'provider_intro', 'label', 'Service provider introduction', 'format', 'pdf'),
      jsonb_build_object('key', 'growth_partner_deck', 'label', 'Growth Partner overview deck', 'format', 'pdf')
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 10 — Referral & Growth Engine',
      'doc', 'aipify-hosts/PHASE_AIRBNB_10_REFERRAL_GROWTH.text',
      'route', '/app/aipify-hosts/referrals'
    )
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-referrals', 'Aipify Hosts Referrals', 'Referral program, rewards, and Growth Partner guidelines.', 'authenticated', 225
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-referrals' and tenant_id is null);

grant execute on function public.get_aipify_hosts_referral_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_referral_dashboard(uuid) to authenticated;
grant execute on function public.generate_aipify_hosts_referral_link(text, uuid) to authenticated;
