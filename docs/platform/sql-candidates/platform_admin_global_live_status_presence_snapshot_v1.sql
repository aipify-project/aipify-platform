-- PREPARED_ONLY — do not apply in any environment without separate owner approval.
-- Agent 4 — Platform Admin global live status bar V2 presence contract.
--
-- PURPOSE
-- Writer (heartbeat) → TTL → distinct-user snapshot → Platform Admin read.
-- Fills topbar: APP customers online, sellers online, signed-in users now.
--
-- OUT OF SCOPE
-- Visitors today (GA4 / Agent 3). New customers / sellers (existing registry reads).
-- Production activation of APP/SELLER shell heartbeats (coordinate Agents 1/2 after apply).
--
-- SECURITY
-- - Heartbeat: authenticated only; portal claim server-verified; no spoofed roles.
-- - Snapshot: platform admin only (is_platform_admin).
-- - Aggregates only — no PII, email, IP, or secrets in snapshot JSON.
-- - Rate limit via last_seen throttle; minimize rows (one per auth_user + portal + client).
-- - No service_role grants to clients.
--
-- ONLINE DEFINITION
-- last_seen_at >= now() - freshness_window (default 300 seconds).
-- Multiple tabs/devices dedupe by distinct auth_user_id within each portal indicator.
-- signed_in_users = distinct auth_user_id across portals (union), never sum of categories.

create table if not exists public.platform_live_presence_heartbeats (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users (id) on delete cascade,
  portal text not null check (portal in ('app_customer', 'seller', 'platform_admin')),
  client_instance_id text not null,
  last_seen_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  unique (auth_user_id, portal, client_instance_id)
);

create index if not exists platform_live_presence_heartbeats_seen_idx
  on public.platform_live_presence_heartbeats (portal, last_seen_at desc);

alter table public.platform_live_presence_heartbeats enable row level security;
revoke all on public.platform_live_presence_heartbeats from public, anon, authenticated;

create or replace function public._platform_live_presence_resolve_portal(p_claimed text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_is_admin boolean := false;
  v_is_seller boolean := false;
  v_is_customer boolean := false;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_claimed is null or p_claimed not in ('app_customer', 'seller', 'platform_admin') then
    raise exception 'Invalid portal';
  end if;

  select exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = v_uid
      and coalesce(pa.status, 'active') = 'active'
  ) into v_is_admin;

  if to_regclass('public.csp_partner_profiles') is not null then
    execute $q$
      select exists (
        select 1
        from public.csp_partner_profiles p
        where p.auth_user_id = $1
          and p.status in ('active', 'certified')
      )
    $q$ into v_is_seller using v_uid;
  end if;

  if to_regclass('public.users') is not null then
    execute $q$
      select exists (
        select 1
        from public.users u
        where u.auth_user_id = $1
      )
    $q$ into v_is_customer using v_uid;
  end if;

  if p_claimed = 'platform_admin' and v_is_admin then
    return 'platform_admin';
  end if;
  if p_claimed = 'seller' and v_is_seller then
    return 'seller';
  end if;
  if p_claimed = 'app_customer' and v_is_customer then
    return 'app_customer';
  end if;

  raise exception 'Portal claim denied';
end;
$$;

revoke all on function public._platform_live_presence_resolve_portal(text) from public, anon, authenticated;

create or replace function public.upsert_platform_live_presence_heartbeat(
  p_portal text,
  p_client_instance_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_portal text;
  v_client text := left(trim(coalesce(p_client_instance_id, '')), 64);
  v_now timestamptz := timezone('utc', now());
  v_min_interval interval := interval '45 seconds';
  v_last timestamptz;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if v_client is null or length(v_client) < 8 then
    raise exception 'Invalid client instance';
  end if;

  v_portal := public._platform_live_presence_resolve_portal(p_portal);

  select h.last_seen_at
    into v_last
  from public.platform_live_presence_heartbeats h
  where h.auth_user_id = v_uid
    and h.portal = v_portal
    and h.client_instance_id = v_client;

  if v_last is not null and v_last > v_now - v_min_interval then
    return jsonb_build_object(
      'ok', true,
      'throttled', true,
      'portal', v_portal,
      'last_seen_at', v_last
    );
  end if;

  insert into public.platform_live_presence_heartbeats (
    auth_user_id, portal, client_instance_id, last_seen_at
  ) values (v_uid, v_portal, v_client, v_now)
  on conflict (auth_user_id, portal, client_instance_id)
  do update set last_seen_at = excluded.last_seen_at;

  -- Opportunistic prune of stale rows for this user (minimize storage).
  delete from public.platform_live_presence_heartbeats h
  where h.auth_user_id = v_uid
    and h.last_seen_at < v_now - interval '24 hours';

  return jsonb_build_object(
    'ok', true,
    'throttled', false,
    'portal', v_portal,
    'last_seen_at', v_now
  );
end;
$$;

revoke all on function public.upsert_platform_live_presence_heartbeat(text, text) from public, anon;
grant execute on function public.upsert_platform_live_presence_heartbeat(text, text) to authenticated;

create or replace function public.get_platform_admin_live_status_presence_snapshot()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ttl_seconds integer := 300;
  v_cutoff timestamptz := timezone('utc', now()) - make_interval(secs => 300);
  v_app integer := 0;
  v_sellers integer := 0;
  v_signed integer := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select count(distinct h.auth_user_id)::integer
    into v_app
  from public.platform_live_presence_heartbeats h
  where h.portal = 'app_customer'
    and h.last_seen_at >= v_cutoff;

  select count(distinct h.auth_user_id)::integer
    into v_sellers
  from public.platform_live_presence_heartbeats h
  where h.portal = 'seller'
    and h.last_seen_at >= v_cutoff;

  select count(distinct h.auth_user_id)::integer
    into v_signed
  from public.platform_live_presence_heartbeats h
  where h.last_seen_at >= v_cutoff;

  return jsonb_build_object(
    'checked_at', timezone('utc', now()),
    'freshness_window_seconds', v_ttl_seconds,
    'app_customers_online', coalesce(v_app, 0),
    'sellers_online', coalesce(v_sellers, 0),
    'signed_in_users', coalesce(v_signed, 0),
    'scope', 'platform_live_presence_heartbeats',
    'privacy_note', 'Aggregates only. No identities returned.'
  );
end;
$$;

revoke all on function public.get_platform_admin_live_status_presence_snapshot() from public, anon;
grant execute on function public.get_platform_admin_live_status_presence_snapshot() to authenticated;

comment on function public.get_platform_admin_live_status_presence_snapshot() is
  'Platform Admin live presence aggregates. Online = distinct auth users with heartbeat within 300s. signed_in is distinct union across portals.';

comment on function public.upsert_platform_live_presence_heartbeat(text, text) is
  'Authenticated heartbeat writer. Portal claim server-verified. Throttled. No PII stored beyond auth_user_id + portal + opaque client id.';
