-- Phase 24 — Modern Install Experience & License Engine

-- ---------------------------------------------------------------------------
-- 1. Modern install progress on customer onboarding
-- ---------------------------------------------------------------------------
alter table public.customer_onboarding
  add column if not exists modern_install_platform text,
  add column if not exists modern_install_step text not null default 'select_platform';

-- ---------------------------------------------------------------------------
-- 2. Support escalations (no sensitive fields)
-- ---------------------------------------------------------------------------
create table if not exists public.install_escalations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.installations (id) on delete set null,
  platform_type text not null,
  domain text,
  installation_status text,
  error_summary text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.install_escalations
  drop constraint if exists install_escalations_status_check;

alter table public.install_escalations
  add constraint install_escalations_status_check check (
    status in ('open', 'acknowledged', 'resolved')
  );

create index if not exists install_escalations_customer_id_idx
  on public.install_escalations (customer_id, created_at desc);

alter table public.install_escalations enable row level security;
revoke all on public.install_escalations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Begin modern install (no token returned to standard users)
-- ---------------------------------------------------------------------------
create or replace function public.begin_modern_install(
  p_platform text,
  p_name text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_user_role text;
  v_system_type text;
  v_result jsonb;
  v_name text;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if p_platform not in (
    'shopify', 'wordpress', 'woocommerce', 'custom_website', 'developer_setup', 'not_sure'
  ) then
    raise exception 'Invalid platform';
  end if;

  select u.company_id, u.role
  into v_company_id, v_user_role
  from public.users u
  where u.auth_user_id = auth.uid();

  if v_user_role not in ('owner', 'admin') then
    raise exception 'Insufficient permissions';
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  v_system_type := case p_platform
    when 'shopify' then 'shopify'
    when 'wordpress', 'woocommerce' then 'wordpress'
    when 'developer_setup' then 'custom'
    else 'other'
  end;

  v_name := coalesce(nullif(trim(p_name), ''), initcap(replace(p_platform, '_', ' ')) || ' site');

  v_result := public.create_installation_draft(v_name, v_system_type);
  v_result := v_result - 'installation_token';

  update public.installations
  set provisioning_config = coalesce(provisioning_config, '{}'::jsonb) || jsonb_build_object(
    'modern_install', jsonb_build_object(
      'platform', p_platform,
      'started_at', now()
    )
  )
  where id = (v_result ->> 'installation_id')::uuid;

  if v_customer_id is not null then
    insert into public.customer_onboarding (customer_id, modern_install_platform, modern_install_step)
    values (v_customer_id, p_platform, 'connect_platform')
    on conflict (customer_id) do update set
      modern_install_platform = excluded.modern_install_platform,
      modern_install_step = excluded.modern_install_step,
      updated_at = now();
  end if;

  return v_result || jsonb_build_object(
    'platform', p_platform,
    'modern_step', 'connect_platform'
  );
end;
$$;

grant execute on function public.begin_modern_install(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Modern install state (customer-facing — never exposes tokens)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_modern_install_state()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_onboarding public.customer_onboarding;
  v_limits jsonb;
  v_license_status text;
  v_grace_ends timestamptz;
  v_installations jsonb;
  v_current_step text;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_onboarding := public.refresh_customer_onboarding(v_customer_id);
  v_limits := public.get_customer_license_limits(v_customer_id);
  v_license_status := public.resolve_license_service_status(v_customer_id);

  if v_license_status = 'grace_period' then
    v_grace_ends := coalesce(
      (select s.grace_period_ends_at from public.subscriptions s where s.customer_id = v_customer_id),
      now() + interval '3 days'
    );
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', i.id,
      'name', coalesce(i.name, i.site_url, 'Installation'),
      'domain', i.site_url,
      'status', i.status,
      'system_type', i.system_type,
      'wizard_step', i.wizard_step,
      'heartbeat_status', coalesce(i.provisioning_config -> 'heartbeat' ->> 'status', 'disconnected'),
      'heartbeat_customer_label', case coalesce(i.provisioning_config -> 'heartbeat' ->> 'status', 'disconnected')
        when 'healthy' then 'connected'
        when 'warning' then 'warning'
        when 'pending_update' then 'updating'
        when 'paused' then 'suspended'
        else 'disconnected'
      end,
      'modern_platform', i.provisioning_config -> 'modern_install' ->> 'platform',
      'last_seen_at', i.last_seen_at
    ) order by i.created_at desc
  ), '[]'::jsonb)
  into v_installations
  from public.installations i
  where i.company_id = v_company_id
    and i.status not in ('archived');

  v_current_step := coalesce(v_onboarding.modern_install_step, 'select_platform');

  if v_onboarding.installation_active then
    v_current_step := case
      when v_onboarding.recommendation_generated then 'first_executive_briefing'
      else 'activate_aipify'
    end;
  elsif v_onboarding.recommendation_generated then
    v_current_step := 'review_recommendations';
  elsif v_onboarding.domain_connected then
    v_current_step := 'aipify_learns';
  elsif jsonb_array_length(v_installations) > 0 then
    v_current_step := 'connect_platform';
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Complexity belongs inside Aipify. Simplicity belongs to the customer.',
    'selected_platform', v_onboarding.modern_install_platform,
    'current_step', v_current_step,
    'flow', jsonb_build_array(
      jsonb_build_object('id', 'select_platform', 'complete', v_onboarding.modern_install_platform is not null),
      jsonb_build_object('id', 'sign_in', 'complete', true),
      jsonb_build_object('id', 'connect_platform', 'complete', jsonb_array_length(v_installations) > 0),
      jsonb_build_object('id', 'approve_permissions', 'complete', v_onboarding.domain_connected),
      jsonb_build_object('id', 'aipify_learns', 'complete', v_onboarding.health_scan_completed),
      jsonb_build_object('id', 'review_recommendations', 'complete', v_onboarding.recommendation_generated),
      jsonb_build_object('id', 'activate_aipify', 'complete', v_onboarding.installation_active),
      jsonb_build_object('id', 'first_executive_briefing', 'complete', v_onboarding.score >= 100)
    ),
    'plan_limits', jsonb_build_object(
      'plan', v_limits ->> 'plan',
      'max_domains', v_limits ->> 'max_domains',
      'max_installations', v_limits ->> 'max_installations',
      'used_domains', v_limits ->> 'used_domains',
      'used_installations', v_limits ->> 'used_installations'
    ),
    'license', jsonb_build_object(
      'service_status', v_license_status,
      'subscription_status', v_limits ->> 'subscription_status',
      'grace_period_ends_at', v_grace_ends
    ),
    'onboarding', row_to_json(v_onboarding),
    'installations', v_installations,
    'developer_settings_available', true
  );
end;
$$;

grant execute on function public.get_customer_modern_install_state() to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Record platform selection
-- ---------------------------------------------------------------------------
create or replace function public.save_modern_install_platform(p_platform text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if p_platform not in (
    'shopify', 'wordpress', 'woocommerce', 'custom_website', 'developer_setup', 'not_sure'
  ) then
    raise exception 'Invalid platform';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer not found';
  end if;

  insert into public.customer_onboarding (customer_id, modern_install_platform, modern_install_step)
  values (v_customer_id, p_platform, 'sign_in')
  on conflict (customer_id) do update set
    modern_install_platform = excluded.modern_install_platform,
    modern_install_step = 'sign_in',
    updated_at = now();

  return jsonb_build_object('platform', p_platform, 'step', 'sign_in');
end;
$$;

grant execute on function public.save_modern_install_platform(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Support escalation
-- ---------------------------------------------------------------------------
create or replace function public.record_install_support_escalation(
  p_platform_type text,
  p_error_summary text,
  p_domain text default null,
  p_installation_status text default null,
  p_installation_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if p_error_summary is null or length(trim(p_error_summary)) = 0 then
    raise exception 'Error summary required';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer not found';
  end if;

  if p_installation_id is not null then
    if not exists (
      select 1 from public.installations i
      where i.id = p_installation_id and i.company_id = v_company_id
    ) then
      raise exception 'Installation not found';
    end if;
  end if;

  insert into public.install_escalations (
    customer_id,
    installation_id,
    platform_type,
    domain,
    installation_status,
    error_summary
  )
  values (
    v_customer_id,
    p_installation_id,
    coalesce(p_platform_type, 'not_sure'),
    public.normalize_domain(p_domain),
    p_installation_status,
    left(trim(p_error_summary), 2000)
  )
  returning id into v_id;

  perform public.record_installation_event(
    v_customer_id,
    'Install support escalation',
    left(trim(p_error_summary), 500),
    jsonb_build_object(
      'platform_type', p_platform_type,
      'domain', p_domain,
      'installation_status', p_installation_status
    ),
    p_installation_id
  );

  return jsonb_build_object('escalation_id', v_id, 'status', 'open');
end;
$$;

grant execute on function public.record_install_support_escalation(text, text, text, text, uuid)
  to authenticated;
