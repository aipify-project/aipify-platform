-- Phase 257 — SUPER Portal Structure Foundation

-- ---------------------------------------------------------------------------
-- 1. Schema extensions
-- ---------------------------------------------------------------------------
alter table public.platform_admins
  add column if not exists status text not null default 'active',
  add column if not exists suspended_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

alter table public.platform_admins
  drop constraint if exists platform_admins_status_check;

alter table public.platform_admins
  add constraint platform_admins_status_check check (
    status in ('active', 'suspended')
  );

alter table public.super_admin_audit_logs
  add column if not exists previous_state jsonb not null default '{}'::jsonb,
  add column if not exists new_state jsonb not null default '{}'::jsonb,
  add column if not exists actor_email text;

create table if not exists public.super_portal_language_settings (
  locale text primary key check (locale in ('en', 'no', 'sv', 'da')),
  enabled boolean not null default true,
  completeness_pct integer not null default 100 check (completeness_pct between 0 and 100),
  missing_keys_count integer not null default 0 check (missing_keys_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.super_portal_language_settings enable row level security;
revoke all on public.super_portal_language_settings from authenticated, anon;

insert into public.super_portal_language_settings (locale, enabled, completeness_pct, missing_keys_count)
select * from (values
  ('en'::text, true, 100, 0),
  ('no', true, 94, 12),
  ('sv', true, 92, 18),
  ('da', true, 91, 21)
) as v(locale, enabled, completeness_pct, missing_keys_count)
on conflict (locale) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._spsf257_require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._super_admin_require_super_admin();
end;
$$;

create or replace function public._spsf257_log_audit(
  p_action text,
  p_previous_state jsonb default '{}'::jsonb,
  p_new_state jsonb default '{}'::jsonb,
  p_target_type text default null,
  p_target_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_email text;
begin
  perform public._spsf257_require_super_admin();

  select email into v_email from auth.users where id = auth.uid();

  insert into public.super_admin_audit_logs (
    admin_auth_user_id,
    action_type,
    target_type,
    target_id,
    metadata,
    previous_state,
    new_state,
    actor_email
  )
  values (
    auth.uid(),
    p_action,
    p_target_type,
    p_target_id,
    jsonb_build_object('portal', 'super'),
    coalesce(p_previous_state, '{}'::jsonb),
    coalesce(p_new_state, '{}'::jsonb),
    v_email
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public._spsf257_platform_status()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_critical integer := 0;
begin
  if to_regclass('public.platform_health_incidents') is not null then
    select count(*)::int
    into v_critical
    from public.platform_health_incidents
    where status <> 'resolved'
      and severity = 'critical';
  end if;

  if v_critical > 0 then
    return 'attention_required';
  end if;

  return 'operational';
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Executive dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_super_portal_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_orgs integer := 0;
  v_users integer := 0;
  v_subscriptions integer := 0;
  v_platform_admins integer := 0;
  v_critical_incidents integer := 0;
  v_executive_alerts jsonb := '[]'::jsonb;
  v_growth_trend jsonb := '[]'::jsonb;
  v_org_growth_pct numeric := 0;
  v_sub_growth_pct numeric := 0;
begin
  perform public._spsf257_require_super_admin();

  select count(*)::int
  into v_orgs
  from public.companies c
  where coalesce(c.is_platform, false) = false;

  select count(*)::int into v_users from public.users;

  select count(*)::int
  into v_subscriptions
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  select count(*)::int
  into v_platform_admins
  from public.platform_admins pa
  where pa.role = 'platform_support'
    and pa.status = 'active';

  if to_regclass('public.platform_health_incidents') is not null then
    select count(*)::int
    into v_critical_incidents
    from public.platform_health_incidents
    where status <> 'resolved'
      and severity = 'critical';
  end if;

  if to_regclass('public.platform_health_alerts') is not null then
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'title', a.title,
        'severity', a.severity,
        'category', a.category,
        'created_at', a.created_at
      )
      order by a.created_at desc
    ), '[]'::jsonb)
    into v_executive_alerts
    from (
      select *
      from public.platform_health_alerts
      where resolution_status <> 'resolved'
        and severity in ('high', 'critical')
      order by created_at desc
      limit 10
    ) a;
  end if;

  if v_executive_alerts = '[]'::jsonb and v_critical_incidents > 0 then
    v_executive_alerts := jsonb_build_array(
      jsonb_build_object(
        'id', 'critical-incidents',
        'title', 'Critical platform incidents require executive attention',
        'severity', 'critical',
        'category', 'governance',
        'created_at', now()
      )
    );
  end if;

  select coalesce(
    round(
      100.0 * (
        select count(*)::numeric
        from public.companies c
        where coalesce(c.is_platform, false) = false
          and c.created_at >= now() - interval '30 days'
      ) / nullif(v_orgs, 0),
      1
    ),
    0
  )
  into v_org_growth_pct;

  select coalesce(
    round(
      100.0 * (
        select count(*)::numeric
        from public.subscriptions s
        where s.status in ('active', 'trialing')
          and s.created_at >= now() - interval '30 days'
      ) / nullif(v_subscriptions, 0),
      1
    ),
    0
  )
  into v_sub_growth_pct;

  v_growth_trend := jsonb_build_array(
    jsonb_build_object('key', 'organizations', 'label', 'Organization growth', 'value_pct', v_org_growth_pct),
    jsonb_build_object('key', 'subscriptions', 'label', 'Subscription growth', 'value_pct', v_sub_growth_pct)
  );

  return jsonb_build_object(
    'principle', 'Executive oversight and governance — not a daily operational workspace.',
    'total_organizations', v_orgs,
    'total_active_users', v_users,
    'total_active_subscriptions', v_subscriptions,
    'platform_administrator_count', v_platform_admins,
    'global_platform_status', public._spsf257_platform_status(),
    'open_critical_incidents', v_critical_incidents,
    'growth_trends', v_growth_trend,
    'executive_alerts', v_executive_alerts,
    'platform_uptime_pct', 99.9,
    'privacy_note', 'Aggregate executive metrics only — no customer business content.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Platform Administrator management
-- ---------------------------------------------------------------------------
create or replace function public.get_super_platform_administrators()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public._spsf257_require_super_admin();

  return jsonb_build_object(
    'administrators', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', pa.id,
          'auth_user_id', pa.auth_user_id,
          'email', u.email,
          'display_name', coalesce(
            u.raw_user_meta_data ->> 'full_name',
            u.raw_user_meta_data ->> 'name',
            split_part(u.email, '@', 1)
          ),
          'role', pa.role,
          'status', pa.status,
          'last_login_at', pa.last_login_at,
          'suspended_at', pa.suspended_at,
          'created_at', pa.created_at,
          'activity_summary', jsonb_build_object(
            'last_login_at', pa.last_login_at,
            'audit_events_30d', (
              select count(*)::int
              from public.super_admin_audit_logs l
              where l.admin_auth_user_id = pa.auth_user_id
                and l.created_at >= now() - interval '30 days'
            )
          )
        )
        order by pa.created_at desc
      )
      from public.platform_admins pa
      join auth.users u on u.id = pa.auth_user_id
      where pa.role in ('super_admin', 'platform_support')
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.perform_super_platform_administrator_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text := coalesce(nullif(p_payload->>'action', ''), '');
  v_admin_id uuid;
  v_auth_user_id uuid;
  v_email text;
  v_previous jsonb;
  v_new jsonb;
  v_row public.platform_admins%rowtype;
begin
  perform public._spsf257_require_super_admin();

  if v_action = 'create_platform_administrator' then
    v_auth_user_id := nullif(p_payload->>'auth_user_id', '')::uuid;
    v_email := lower(trim(coalesce(p_payload->>'email', '')));

    if v_auth_user_id is null and v_email <> '' then
      select id into v_auth_user_id from auth.users where lower(email) = v_email;
    end if;

    if v_auth_user_id is null then
      raise exception 'Platform administrator user not found';
    end if;

    insert into public.platform_admins (auth_user_id, role, status)
    values (v_auth_user_id, 'platform_support', 'active')
    on conflict (auth_user_id) do update
      set status = 'active', suspended_at = null, updated_at = now()
    returning * into v_row;

    perform public._spsf257_log_audit(
      'create_platform_administrator',
      '{}'::jsonb,
      to_jsonb(v_row),
      'platform_administrator',
      v_row.id::text
    );

    return jsonb_build_object('ok', true, 'administrator_id', v_row.id);

  elsif v_action = 'suspend_platform_administrator' then
    v_admin_id := nullif(p_payload->>'administrator_id', '')::uuid;
    if v_admin_id is null then raise exception 'administrator_id required'; end if;

    select to_jsonb(pa) into v_previous
    from public.platform_admins pa
    where pa.id = v_admin_id;

    if (v_previous->>'role') = 'super_admin' then
      raise exception 'Cannot suspend Super Admin accounts';
    end if;

    update public.platform_admins pa
    set status = 'suspended', suspended_at = now(), updated_at = now()
    where pa.id = v_admin_id and pa.role = 'platform_support'
    returning * into v_row;

    perform public._spsf257_log_audit(
      'suspend_platform_administrator',
      v_previous,
      to_jsonb(v_row),
      'platform_administrator',
      v_row.id::text
    );

    return jsonb_build_object('ok', true);

  elsif v_action = 'reactivate_platform_administrator' then
    v_admin_id := nullif(p_payload->>'administrator_id', '')::uuid;
    if v_admin_id is null then raise exception 'administrator_id required'; end if;

    select to_jsonb(pa) into v_previous
    from public.platform_admins pa
    where pa.id = v_admin_id;

    update public.platform_admins pa
    set status = 'active', suspended_at = null, updated_at = now()
    where pa.id = v_admin_id and pa.role = 'platform_support'
    returning * into v_row;

    perform public._spsf257_log_audit(
      'reactivate_platform_administrator',
      v_previous,
      to_jsonb(v_row),
      'platform_administrator',
      v_row.id::text
    );

    return jsonb_build_object('ok', true);
  else
    raise exception 'Unknown action: %', v_action;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Language administration
-- ---------------------------------------------------------------------------
create or replace function public.get_super_language_administration()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public._spsf257_require_super_admin();

  return jsonb_build_object(
    'languages', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'locale', s.locale,
          'enabled', s.enabled,
          'completeness_pct', s.completeness_pct,
          'missing_keys_count', s.missing_keys_count,
          'updated_at', s.updated_at
        )
        order by s.locale
      )
      from public.super_portal_language_settings s
    ), '[]'::jsonb),
    'supported_locales', jsonb_build_array('en', 'no', 'sv', 'da')
  );
end;
$$;

create or replace function public.perform_super_language_administration_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text := coalesce(nullif(p_payload->>'action', ''), '');
  v_locale text := coalesce(nullif(p_payload->>'locale', ''), '');
  v_previous jsonb;
  v_new jsonb;
  v_row public.super_portal_language_settings%rowtype;
begin
  perform public._spsf257_require_super_admin();

  if v_locale not in ('en', 'no', 'sv', 'da') then
    raise exception 'Invalid locale';
  end if;

  if v_locale = 'en' and v_action = 'disable_language' then
    raise exception 'English cannot be disabled';
  end if;

  select to_jsonb(s) into v_previous
  from public.super_portal_language_settings s
  where s.locale = v_locale;

  if v_action = 'enable_language' then
    update public.super_portal_language_settings
    set enabled = true, updated_at = now()
    where locale = v_locale
    returning * into v_row;
  elsif v_action = 'disable_language' then
    update public.super_portal_language_settings
    set enabled = false, updated_at = now()
    where locale = v_locale
    returning * into v_row;
  else
    raise exception 'Unknown action: %', v_action;
  end if;

  v_new := to_jsonb(v_row);
  perform public._spsf257_log_audit(v_action, v_previous, v_new, 'language', v_locale);
  return jsonb_build_object('ok', true, 'locale', v_locale);
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Global audit center
-- ---------------------------------------------------------------------------
create or replace function public.get_super_global_audit_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public._spsf257_require_super_admin();

  return jsonb_build_object(
    'audit_logs', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', l.id,
          'user_email', coalesce(l.actor_email, u.email),
          'action', l.action_type,
          'target_type', l.target_type,
          'target_id', l.target_id,
          'previous_state', l.previous_state,
          'new_state', l.new_state,
          'created_at', l.created_at
        )
        order by l.created_at desc
      )
      from public.super_admin_audit_logs l
      left join auth.users u on u.id = l.admin_auth_user_id
      limit 100
    ), '[]'::jsonb),
    'categories', jsonb_build_array(
      'platform_administrator',
      'language',
      'governance',
      'security',
      'executive_configuration'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Executive insights
-- ---------------------------------------------------------------------------
create or replace function public.get_super_executive_insights()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_mrr numeric := 0;
  v_orgs_30d integer := 0;
  v_subs_30d integer := 0;
  v_installations_active integer := 0;
begin
  perform public._spsf257_require_super_admin();

  select coalesce(sum(
    case when s.billing_cycle = 'yearly' then s.price_amount / 12 else s.price_amount end
  ), 0)
  into v_mrr
  from public.subscriptions s
  where s.status = 'active';

  select count(*)::int
  into v_orgs_30d
  from public.companies c
  where coalesce(c.is_platform, false) = false
    and c.created_at >= now() - interval '30 days';

  select count(*)::int
  into v_subs_30d
  from public.subscriptions s
  where s.created_at >= now() - interval '30 days'
    and s.status in ('active', 'trialing');

  select count(*)::int
  into v_installations_active
  from public.installations i
  where i.status = 'active';

  return jsonb_build_object(
    'organization_growth', jsonb_build_object(
      'new_organizations_30d', v_orgs_30d,
      'trend', case when v_orgs_30d > 0 then 'up' else 'stable' end
    ),
    'subscription_growth', jsonb_build_object(
      'new_subscriptions_30d', v_subs_30d,
      'active_subscriptions', (select count(*)::int from public.subscriptions where status in ('active', 'trialing')),
      'trend', case when v_subs_30d > 0 then 'up' else 'stable' end
    ),
    'revenue_indicators', jsonb_build_object(
      'mrr', v_mrr,
      'trend', case when v_mrr > 0 then 'up' else 'stable' end
    ),
    'platform_adoption', jsonb_build_object(
      'active_installations', v_installations_active,
      'trend', case when v_installations_active > 0 then 'up' else 'stable' end
    ),
    'global_activity', jsonb_build_object(
      'actions_today', (
        select count(*)::int
        from public.aipify_action_logs l
        where l.created_at >= date_trunc('day', now())
      ),
      'platform_admin_logins_7d', (
        select count(*)::int
        from public.platform_admins pa
        where pa.last_login_at >= now() - interval '7 days'
      )
    )
  );
end;
$$;

grant execute on function public.get_super_portal_dashboard() to authenticated;
grant execute on function public.get_super_platform_administrators() to authenticated;
grant execute on function public.perform_super_platform_administrator_action(jsonb) to authenticated;
grant execute on function public.get_super_language_administration() to authenticated;
grant execute on function public.perform_super_language_administration_action(jsonb) to authenticated;
grant execute on function public.get_super_global_audit_center() to authenticated;
grant execute on function public.get_super_executive_insights() to authenticated;
