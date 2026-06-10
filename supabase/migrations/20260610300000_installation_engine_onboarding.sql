-- Installation Engine & Customer Onboarding Foundation

-- ---------------------------------------------------------------------------
-- 1. Extend installations lifecycle
-- ---------------------------------------------------------------------------
alter table public.installations
  add column if not exists customer_id uuid references public.customers (id) on delete set null,
  add column if not exists domain_id uuid references public.customer_domains (id) on delete set null,
  add column if not exists version text not null default '1.0.0',
  add column if not exists wizard_step integer not null default 1,
  add column if not exists token_expires_at timestamptz,
  add column if not exists rotated_at timestamptz,
  add column if not exists revoked_at timestamptz,
  add column if not exists activated_at timestamptz,
  add column if not exists last_seen_at timestamptz,
  add column if not exists last_health_scan_at timestamptz,
  add column if not exists health_score integer,
  add column if not exists health_status text,
  add column if not exists provisioning_status text not null default 'manual',
  add column if not exists provisioning_config jsonb not null default '{}'::jsonb;

alter table public.installations
  drop constraint if exists installations_status_check;

update public.installations
set status = case
  when status = 'pending' then 'pending_verification'
  when status = 'paused' then 'suspended'
  when status = 'revoked' then 'archived'
  else status
end;

alter table public.installations
  add constraint installations_status_check check (
    status in (
      'draft',
      'pending_verification',
      'ready',
      'installing',
      'active',
      'warning',
      'failed',
      'suspended',
      'archived'
    )
  );

alter table public.installations
  add constraint installations_health_status_check check (
    health_status is null
    or health_status in ('healthy', 'needs_attention', 'critical')
  );

alter table public.installations
  add constraint installations_provisioning_status_check check (
    provisioning_status in ('manual', 'pending', 'completed', 'failed')
  );

update public.installations i
set
  customer_id = c.id,
  activated_at = coalesce(i.activated_at, i.installed_at)
from public.customers c
where c.company_id = i.company_id
  and i.customer_id is null;

create index if not exists installations_customer_id_idx
  on public.installations (customer_id);

-- ---------------------------------------------------------------------------
-- 2. Domain verification placeholders (meta tag)
-- ---------------------------------------------------------------------------
alter table public.customer_domains
  add column if not exists verification_code text,
  add column if not exists verification_started_at timestamptz;

-- ---------------------------------------------------------------------------
-- 3. Extend installation_modules
-- ---------------------------------------------------------------------------
alter table public.installation_modules
  add column if not exists status text,
  add column if not exists enabled_at timestamptz,
  add column if not exists disabled_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update public.installation_modules
set
  status = case when enabled then 'enabled' else 'disabled' end,
  enabled_at = case when enabled then coalesce(enabled_at, created_at) else enabled_at end,
  disabled_at = case when not enabled then coalesce(disabled_at, now()) else disabled_at end
where status is null;

alter table public.installation_modules
  alter column status set default 'enabled';

alter table public.installation_modules
  drop constraint if exists installation_modules_module_key_check;

alter table public.installation_modules
  add constraint installation_modules_module_key_check check (
    module_key in (
      'support_ai',
      'analytics_ai',
      'assistant',
      'commerce_ai',
      'notifications',
      'install_ai',
      'moderation_ai',
      'executive_insights'
    )
  );

alter table public.installation_modules
  drop constraint if exists installation_modules_status_check;

alter table public.installation_modules
  add constraint installation_modules_status_check check (
    status in ('enabled', 'disabled', 'warning', 'failed')
  );

-- ---------------------------------------------------------------------------
-- 4. customer_onboarding
-- ---------------------------------------------------------------------------
create table if not exists public.customer_onboarding (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  profile_completed boolean not null default false,
  domain_connected boolean not null default false,
  installation_active boolean not null default false,
  health_scan_completed boolean not null default false,
  recommendation_generated boolean not null default false,
  support_enabled boolean not null default false,
  score integer not null default 0 check (score >= 0 and score <= 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customer_onboarding enable row level security;
revoke all on public.customer_onboarding from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. installation_health_scans
-- ---------------------------------------------------------------------------
create table if not exists public.installation_health_scans (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.installations (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  score integer not null check (score >= 0 and score <= 100),
  status text not null check (status in ('healthy', 'needs_attention', 'critical')),
  connectivity_ok boolean not null default true,
  webhook_ok boolean not null default true,
  modules_ok boolean not null default true,
  api_ok boolean not null default true,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists installation_health_scans_installation_id_idx
  on public.installation_health_scans (installation_id, created_at desc);

alter table public.installation_health_scans enable row level security;
revoke all on public.installation_health_scans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.record_installation_event(
  p_customer_id uuid,
  p_title text,
  p_description text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_installation_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_customer_id is null then
    return null;
  end if;

  if exists (select 1 from pg_proc where proname = 'record_customer_timeline_event') then
    perform public.record_customer_timeline_event(
      p_customer_id,
      'installation',
      p_title,
      p_description,
      p_metadata || jsonb_build_object('installation_id', p_installation_id),
      now()
    );
  end if;

  return v_id;
end;
$$;

grant execute on function public.record_installation_event(uuid, text, text, jsonb, uuid)
  to authenticated;

create or replace function public.refresh_customer_onboarding(p_customer_id uuid)
returns public.customer_onboarding
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.customer_onboarding;
  v_profile boolean := false;
  v_domain boolean := false;
  v_install boolean := false;
  v_health boolean := false;
  v_recommendation boolean := false;
  v_support boolean := false;
  v_score integer := 0;
  v_company_id uuid;
begin
  select c.company_id into v_company_id
  from public.customers c
  where c.id = p_customer_id;

  select exists (
    select 1 from public.users u
    where u.company_id = v_company_id
      and nullif(trim(u.full_name), '') is not null
  ) into v_profile;

  select exists (
    select 1 from public.customer_domains cd
    where cd.customer_id = p_customer_id
      and cd.status in ('active', 'pending')
  ) into v_domain;

  select exists (
    select 1 from public.installations i
    where i.customer_id = p_customer_id
      and i.status = 'active'
  ) into v_install;

  select exists (
    select 1 from public.installations i
    where i.customer_id = p_customer_id
      and i.last_health_scan_at is not null
  ) into v_health;

  select (
    exists (
      select 1 from public.ai_recommendations ar
      where ar.tenant_id = p_customer_id
    )
    or exists (
      select 1 from public.customer_recommendations cr
      where cr.customer_id = p_customer_id
    )
  ) into v_recommendation;

  select exists (
    select 1
    from public.installation_modules im
    join public.installations i on i.id = im.installation_id
    where i.customer_id = p_customer_id
      and im.module_key = 'support_ai'
      and im.status = 'enabled'
  ) into v_support;

  v_score :=
    (case when v_profile then 17 else 0 end) +
    (case when v_domain then 17 else 0 end) +
    (case when v_install then 17 else 0 end) +
    (case when v_health then 17 else 0 end) +
    (case when v_recommendation then 16 else 0 end) +
    (case when v_support then 16 else 0 end);

  insert into public.customer_onboarding (
    customer_id,
    profile_completed,
    domain_connected,
    installation_active,
    health_scan_completed,
    recommendation_generated,
    support_enabled,
    score,
    completed_at
  )
  values (
    p_customer_id,
    v_profile,
    v_domain,
    v_install,
    v_health,
    v_recommendation,
    v_support,
    v_score,
    case when v_score >= 100 then now() else null end
  )
  on conflict (customer_id) do update set
    profile_completed = excluded.profile_completed,
    domain_connected = excluded.domain_connected,
    installation_active = excluded.installation_active,
    health_scan_completed = excluded.health_scan_completed,
    recommendation_generated = excluded.recommendation_generated,
    support_enabled = excluded.support_enabled,
    score = excluded.score,
    completed_at = case
      when excluded.score >= 100 then coalesce(public.customer_onboarding.completed_at, now())
      else null
    end,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function public.refresh_customer_onboarding(uuid) to authenticated;

create or replace function public.get_customer_onboarding_progress()
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

  return jsonb_build_object(
    'has_customer', true,
    'onboarding', row_to_json(v_onboarding)
  );
end;
$$;

grant execute on function public.get_customer_onboarding_progress() to authenticated;

-- ---------------------------------------------------------------------------
-- Wizard + installation engine RPCs
-- ---------------------------------------------------------------------------
create or replace function public._assert_installation_access(p_installation_id uuid)
returns table (installation public.installations, customer_id uuid, company_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_installation public.installations;
  v_company_id uuid;
  v_customer_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select * into v_installation
  from public.installations i
  where i.id = p_installation_id
    and i.company_id = v_company_id;

  if v_installation.id is null then
    raise exception 'Installation not found';
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  return query select v_installation, v_customer_id, v_company_id;
end;
$$;

create or replace function public.create_installation_draft(
  p_name text,
  p_system_type text default 'custom'
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
  v_token text;
  v_token_hash text;
  v_installation_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id, u.role
  into v_company_id, v_user_role
  from public.users u
  where u.auth_user_id = auth.uid();

  if v_user_role not in ('owner', 'admin') then
    raise exception 'Insufficient permissions';
  end if;

  if p_system_type not in ('wordpress', 'shopify', 'custom', 'other') then
    raise exception 'Invalid system type';
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is not null then
    perform public.assert_license_capacity(v_customer_id, true, false, null);
  end if;

  v_token := public.generate_installation_token();
  v_token_hash := public.hash_installation_token(v_token);

  insert into public.installations (
    company_id,
    customer_id,
    system_type,
    status,
    installation_token_hash,
    name,
    wizard_step,
    token_expires_at
  )
  values (
    v_company_id,
    v_customer_id,
    p_system_type,
    'draft',
    v_token_hash,
    nullif(trim(p_name), ''),
    1,
    now() + interval '90 days'
  )
  returning id into v_installation_id;

  if v_customer_id is not null then
    perform public.record_installation_event(
      v_customer_id,
      'Installation created',
      'Draft installation started for ' || coalesce(nullif(trim(p_name), ''), 'new website') || '.',
      jsonb_build_object('status', 'draft', 'wizard_step', 1),
      v_installation_id
    );
    perform public.refresh_customer_onboarding(v_customer_id);
  end if;

  return jsonb_build_object(
    'installation_id', v_installation_id,
    'installation_token', v_token,
    'wizard_step', 1,
    'status', 'draft'
  );
end;
$$;

grant execute on function public.create_installation_draft(text, text) to authenticated;

create or replace function public.update_installation_wizard(
  p_installation_id uuid,
  p_step integer,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_domain text;
  v_domain_id uuid;
  v_domain_row public.customer_domains;
  v_verification_code text;
  v_meta_tag text;
  v_token text;
  v_token_hash text;
  v_module_key text;
  v_modules jsonb;
begin
  select * into v_ctx
  from public._assert_installation_access(p_installation_id);

  if p_step = 2 then
    v_domain := public.normalize_domain(p_payload ->> 'domain');
    if v_domain is null then
      raise exception 'Invalid domain';
    end if;

    if v_ctx.customer_id is not null then
      perform public.assert_license_capacity(v_ctx.customer_id, false, true, v_domain);
    end if;

    update public.installations
    set
      site_url = v_domain,
      wizard_step = 2,
      status = 'pending_verification',
      updated_at = now()
    where id = p_installation_id;

    if v_ctx.customer_id is not null then
      insert into public.customer_domains (
        customer_id, installation_id, domain, status, verification_status, verification_method
      )
      values (v_ctx.customer_id, p_installation_id, v_domain, 'pending', 'pending', 'meta_tag')
      on conflict (customer_id, domain) do update set
        installation_id = excluded.installation_id,
        verification_method = 'meta_tag',
        updated_at = now()
      returning id into v_domain_id;

      update public.installations
      set domain_id = v_domain_id
      where id = p_installation_id;

      perform public.record_installation_event(
        v_ctx.customer_id,
        'Domain added',
        'Domain ' || v_domain || ' added to installation wizard.',
        jsonb_build_object('domain', v_domain),
        p_installation_id
      );
      perform public.refresh_customer_onboarding(v_ctx.customer_id);
    end if;

    return jsonb_build_object('wizard_step', 2, 'domain', v_domain, 'status', 'pending_verification');

  elsif p_step = 3 then
    if p_payload ->> 'action' = 'start_verification' then
      v_verification_code := encode(gen_random_bytes(16), 'hex');

      update public.customer_domains cd
      set
        verification_code = v_verification_code,
        verification_started_at = now(),
        verification_status = 'pending',
        verification_method = 'meta_tag',
        updated_at = now()
      from public.installations i
      where i.id = p_installation_id
        and cd.id = i.domain_id;

      v_meta_tag := '<meta name="aipify-verification" content="' || v_verification_code || '" />';

      update public.installations
      set wizard_step = 3, updated_at = now()
      where id = p_installation_id;

      if v_ctx.customer_id is not null then
        perform public.record_installation_event(
          v_ctx.customer_id,
          'Verification started',
          'Meta tag domain verification started.',
          jsonb_build_object('method', 'meta_tag'),
          p_installation_id
        );
      end if;

      return jsonb_build_object(
        'wizard_step', 3,
        'verification_method', 'meta_tag',
        'meta_tag', v_meta_tag,
        'verification_code', v_verification_code
      );

    elsif p_payload ->> 'action' = 'confirm_verification' then
      update public.customer_domains cd
      set
        verification_status = 'verified',
        verified_at = now(),
        status = 'active',
        updated_at = now()
      from public.installations i
      where i.id = p_installation_id
        and cd.id = i.domain_id
        and cd.verification_code is not null;

      if not found then
        raise exception 'Start verification before confirming';
      end if;

      update public.installations
      set
        wizard_step = 3,
        status = 'ready',
        updated_at = now()
      where id = p_installation_id;

      if v_ctx.customer_id is not null then
        perform public.record_installation_event(
          v_ctx.customer_id,
          'Domain verified',
          'Domain ownership verified via meta tag placeholder.',
          jsonb_build_object('method', 'meta_tag'),
          p_installation_id
        );
        perform public.refresh_customer_onboarding(v_ctx.customer_id);
      end if;

      return jsonb_build_object('wizard_step', 3, 'status', 'ready', 'verified', true);
    end if;

    raise exception 'Invalid verification action';

  elsif p_step = 4 then
    v_modules := coalesce(p_payload -> 'modules', '[]'::jsonb);

    for v_module_key in
      select jsonb_array_elements_text(v_modules)
    loop
      insert into public.installation_modules (
        installation_id, module_key, enabled, status, enabled_at
      )
      values (p_installation_id, v_module_key, true, 'enabled', now())
      on conflict (installation_id, module_key) do update set
        enabled = true,
        status = 'enabled',
        enabled_at = now(),
        disabled_at = null,
        updated_at = now();
    end loop;

    update public.installations
    set wizard_step = 4, updated_at = now()
    where id = p_installation_id;

    if v_ctx.customer_id is not null then
      perform public.record_installation_event(
        v_ctx.customer_id,
        'Modules configured',
        'Installation modules selected in wizard.',
        jsonb_build_object('modules', v_modules),
        p_installation_id
      );
      perform public.refresh_customer_onboarding(v_ctx.customer_id);
    end if;

    return jsonb_build_object('wizard_step', 4, 'modules', v_modules);

  elsif p_step = 5 then
    v_token := public.generate_installation_token();
    v_token_hash := public.hash_installation_token(v_token);

    update public.installations
    set
      installation_token_hash = v_token_hash,
      wizard_step = 5,
      status = 'installing',
      token_expires_at = now() + interval '90 days',
      rotated_at = null,
      revoked_at = null,
      updated_at = now()
    where id = p_installation_id;

    if v_ctx.customer_id is not null then
      perform public.record_installation_event(
        v_ctx.customer_id,
        'Installation credentials generated',
        'Installation token issued for plugin connection.',
        '{}'::jsonb,
        p_installation_id
      );
    end if;

    return jsonb_build_object(
      'wizard_step', 5,
      'installation_token', v_token,
      'status', 'installing'
    );

  elsif p_step = 6 then
    perform public.activate_installation_from_wizard(p_installation_id);

    return jsonb_build_object(
      'wizard_step', 6,
      'status', 'active',
      'activated', true
    );

  elsif p_step = 7 then
    return public.run_installation_health_scan(p_installation_id);
  end if;

  raise exception 'Invalid wizard step';
end;
$$;

grant execute on function public.update_installation_wizard(uuid, integer, jsonb) to authenticated;

create or replace function public.activate_installation_from_wizard(p_installation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_domain text;
  v_verification text;
  v_token text;
begin
  select * into v_ctx
  from public._assert_installation_access(p_installation_id);

  if v_ctx.customer_id is not null then
    perform public.assert_license_capacity(v_ctx.customer_id, false, false, null);

    v_domain := public.normalize_domain(v_ctx.installation.site_url);
    if v_domain is not null then
      select cd.verification_status into v_verification
      from public.customer_domains cd
      where cd.id = v_ctx.installation.domain_id
        or (cd.customer_id = v_ctx.customer_id and cd.domain = v_domain)
      limit 1;

      if v_verification is distinct from 'verified' then
        perform public.record_license_check(
          v_ctx.customer_id, 'domain_verification', 'blocked',
          'Domain must be verified before activation.',
          v_domain, p_installation_id
        );
        raise exception 'Domain must be verified before activation';
      end if;
    end if;
  end if;

  update public.installations
  set
    status = 'active',
    wizard_step = 6,
    activated_at = coalesce(activated_at, now()),
    installed_at = coalesce(installed_at, now()),
    last_seen_at = now(),
    updated_at = now()
  where id = p_installation_id
    and status in ('installing', 'ready', 'pending_verification', 'draft');

  if v_ctx.customer_id is not null then
    perform public.record_installation_event(
      v_ctx.customer_id,
      'Installation activated',
      'Installation is now active on authorized domain.',
      jsonb_build_object('domain', v_domain),
      p_installation_id
    );
    perform public.record_license_check(
      v_ctx.customer_id, 'domain_lock', 'allowed',
      'Installation activated on authorized domain.',
      v_domain, p_installation_id
    );
    perform public.refresh_customer_onboarding(v_ctx.customer_id);
  end if;

  return true;
end;
$$;

grant execute on function public.activate_installation_from_wizard(uuid) to authenticated;

create or replace function public._run_installation_health_scan_core(
  p_installation_id uuid,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_installation public.installations;
  v_score integer := 85;
  v_status text := 'healthy';
  v_connectivity boolean := true;
  v_webhook boolean := true;
  v_modules boolean := true;
  v_api boolean := true;
  v_scan_id uuid;
  v_module_count integer;
begin
  select * into v_installation
  from public.installations i
  where i.id = p_installation_id;

  if v_installation.id is null then
    raise exception 'Installation not found';
  end if;

  select count(*) into v_module_count
  from public.installation_modules im
  where im.installation_id = p_installation_id
    and im.status = 'enabled';

  if v_module_count = 0 then
    v_score := v_score - 25;
    v_modules := false;
    v_status := 'needs_attention';
  end if;

  if v_installation.status not in ('active', 'warning') then
    v_score := v_score - 40;
    v_connectivity := false;
    v_status := 'critical';
  end if;

  if v_score < 60 then
    v_status := 'critical';
  elsif v_score < 80 then
    v_status := 'needs_attention';
  end if;

  insert into public.installation_health_scans (
    installation_id,
    customer_id,
    score,
    status,
    connectivity_ok,
    webhook_ok,
    modules_ok,
    api_ok,
    details
  )
  values (
    p_installation_id,
    coalesce(p_customer_id, v_installation.customer_id),
    v_score,
    v_status,
    v_connectivity,
    v_webhook,
    v_modules,
    v_api,
    jsonb_build_object(
      'placeholder', true,
      'checks', jsonb_build_array('connectivity', 'webhook', 'modules', 'api')
    )
  )
  returning id into v_scan_id;

  update public.installations
  set
    wizard_step = greatest(wizard_step, 7),
    last_health_scan_at = now(),
    health_score = v_score,
    health_status = v_status,
    status = case when v_status = 'critical' then 'warning' else status end,
    updated_at = now()
  where id = p_installation_id;

  if coalesce(p_customer_id, v_installation.customer_id) is not null then
    perform public.record_installation_event(
      coalesce(p_customer_id, v_installation.customer_id),
      'Health scan completed',
      'First health scan completed with score ' || v_score || '.',
      jsonb_build_object('score', v_score, 'status', v_status, 'scan_id', v_scan_id),
      p_installation_id
    );
    perform public.refresh_customer_onboarding(coalesce(p_customer_id, v_installation.customer_id));
  end if;

  return jsonb_build_object(
    'wizard_step', 7,
    'scan_id', v_scan_id,
    'score', v_score,
    'status', v_status,
    'connectivity_ok', v_connectivity,
    'webhook_ok', v_webhook,
    'modules_ok', v_modules,
    'api_ok', v_api
  );
end;
$$;

create or replace function public.run_installation_health_scan(p_installation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx
  from public._assert_installation_access(p_installation_id);

  return public._run_installation_health_scan_core(p_installation_id, v_ctx.customer_id);
end;
$$;

grant execute on function public.run_installation_health_scan(uuid) to authenticated;

create or replace function public.rotate_installation_token(p_installation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_token text;
  v_token_hash text;
begin
  select * into v_ctx
  from public._assert_installation_access(p_installation_id);

  v_token := public.generate_installation_token();
  v_token_hash := public.hash_installation_token(v_token);

  update public.installations
  set
    installation_token_hash = v_token_hash,
    rotated_at = now(),
    token_expires_at = now() + interval '90 days',
    revoked_at = null,
    updated_at = now()
  where id = p_installation_id;

  if v_ctx.customer_id is not null then
    perform public.record_installation_event(
      v_ctx.customer_id,
      'Token rotated',
      'Installation token was rotated.',
      '{}'::jsonb,
      p_installation_id
    );
  end if;

  return jsonb_build_object(
    'installation_id', p_installation_id,
    'installation_token', v_token,
    'rotated_at', now()
  );
end;
$$;

grant execute on function public.rotate_installation_token(uuid) to authenticated;

create or replace function public.get_installation_wizard_state(p_installation_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_domain public.customer_domains;
  v_modules jsonb;
  v_meta_tag text;
begin
  select * into v_ctx
  from public._assert_installation_access(p_installation_id);

  if v_ctx.installation.domain_id is not null then
    select * into v_domain
    from public.customer_domains cd
    where cd.id = v_ctx.installation.domain_id;
  end if;

  select coalesce(
    jsonb_agg(jsonb_build_object('module_key', im.module_key, 'status', im.status) order by im.module_key),
    '[]'::jsonb
  )
  into v_modules
  from public.installation_modules im
  where im.installation_id = p_installation_id;

  if v_domain.verification_code is not null then
    v_meta_tag := '<meta name="aipify-verification" content="' || v_domain.verification_code || '" />';
  end if;

  return jsonb_build_object(
    'installation', row_to_json(v_ctx.installation),
    'domain', case when v_domain.id is not null then row_to_json(v_domain) else null end,
    'modules', v_modules,
    'meta_tag', v_meta_tag
  );
end;
$$;

grant execute on function public.get_installation_wizard_state(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Update legacy create/activate to use new lifecycle
-- ---------------------------------------------------------------------------
create or replace function public.create_installation(
  p_system_type text,
  p_name text default null,
  p_site_url text default null
)
returns table (installation_id uuid, installation_token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  v_result := public.create_installation_draft(coalesce(p_name, 'New installation'), p_system_type);

  if nullif(trim(p_site_url), '') is not null then
    perform public.update_installation_wizard(
      (v_result ->> 'installation_id')::uuid,
      2,
      jsonb_build_object('domain', p_site_url)
    );
  end if;

  return query
  select
    (v_result ->> 'installation_id')::uuid,
    v_result ->> 'installation_token';
end;
$$;

create or replace function public.activate_installation(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_installation record;
  v_customer_id uuid;
  v_domain text;
  v_verification text;
  v_updated int;
begin
  v_hash := public.hash_installation_token(p_token);

  select i.id, i.company_id, i.site_url, i.status
  into v_installation
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.status in ('installing', 'ready', 'pending_verification', 'active')
  limit 1;

  if v_installation.id is null then
    return false;
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_installation.company_id
  limit 1;

  if v_customer_id is not null then
    perform public.assert_license_capacity(v_customer_id, false, false, null);

    v_domain := public.normalize_domain(v_installation.site_url);

    if v_domain is not null then
      select cd.verification_status into v_verification
      from public.customer_domains cd
      where cd.customer_id = v_customer_id
        and cd.domain = v_domain
        and cd.status in ('active', 'pending')
      limit 1;

      if v_verification is distinct from 'verified' then
        perform public.record_license_check(
          v_customer_id, 'domain_verification', 'blocked',
          'Domain must be verified before activation.',
          v_domain, v_installation.id
        );
        return false;
      end if;
    end if;
  end if;

  update public.installations
  set
    status = 'active',
    activated_at = coalesce(activated_at, now()),
    installed_at = coalesce(installed_at, now()),
    last_seen_at = now(),
    updated_at = now()
  where id = v_installation.id;

  get diagnostics v_updated = row_count;

  if v_updated > 0 and v_customer_id is not null then
    perform public.record_installation_event(
      v_customer_id,
      'Installation activated',
      'Installation activated via plugin token.',
      jsonb_build_object('domain', v_domain),
      v_installation.id
    );
    perform public.record_license_check(
      v_customer_id, 'domain_lock', 'allowed',
      'Installation activated on authorized domain.',
      v_domain, v_installation.id
    );
    perform public.refresh_customer_onboarding(v_customer_id);
    perform public._run_installation_health_scan_core(v_installation.id, v_customer_id);
  end if;

  return v_updated > 0;
end;
$$;

-- ---------------------------------------------------------------------------
-- Extend platform master detail with onboarding + installation health
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_customer_master_detail(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_result jsonb;
  v_outstanding numeric := 0;
  v_onboarding public.customer_onboarding;
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  v_onboarding := public.refresh_customer_onboarding(p_customer_id);

  select c.company_id into v_company_id
  from public.customers c
  where c.id = p_customer_id;

  select coalesce(sum(inv.amount), 0)
  into v_outstanding
  from public.invoices inv
  where inv.customer_id = p_customer_id
    and inv.status in ('sent', 'overdue', 'draft');

  select jsonb_build_object(
    'customer', row_to_json(c.*),
    'payment_profile', (
      select row_to_json(pp.*) from public.payment_profiles pp where pp.customer_id = c.id
    ),
    'subscription', (
      select row_to_json(s.*) from public.subscriptions s where s.customer_id = c.id
    ),
    'license', public.get_customer_license_limits(p_customer_id),
    'onboarding', row_to_json(v_onboarding),
    'overview', jsonb_build_object(
      'plan_name', s.plan_name,
      'plan_type', s.plan_type,
      'subscription_status', s.status,
      'customer_status', c.status,
      'trial_days_remaining',
        case
          when s.trial_ends_at is not null and s.status = 'trialing'
            then greatest(0, ceil(extract(epoch from (s.trial_ends_at - now())) / 86400)::integer)
          else null
        end,
      'next_billing_date', s.next_billing_date,
      'total_users', (select count(*) from public.users u where u.company_id = c.company_id),
      'total_installations', (select count(*) from public.installations i where i.company_id = c.company_id),
      'outstanding_invoices', v_outstanding,
      'payment_provider', pp.provider,
      'onboarding_score', v_onboarding.score
    ),
    'domains', coalesce(
      (select jsonb_agg(row_to_json(cd.*) order by cd.added_at desc)
       from public.customer_domains cd
       where cd.customer_id = p_customer_id and cd.status <> 'removed'),
      '[]'::jsonb
    ),
    'license_checks', coalesce(
      (select jsonb_agg(row_to_json(lc.*) order by lc.created_at desc)
       from public.license_checks lc
       where lc.customer_id = p_customer_id
       limit 25),
      '[]'::jsonb
    ),
    'installation_health_scans', coalesce(
      (select jsonb_agg(row_to_json(hs.*) order by hs.created_at desc)
       from public.installation_health_scans hs
       where hs.customer_id = p_customer_id
       limit 10),
      '[]'::jsonb
    ),
    'users', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', u.id, 'full_name', u.full_name, 'email', au.email,
            'role', u.role, 'status', u.status, 'last_login_at', u.last_login_at,
            'is_owner', u.role = 'owner', 'permissions', '[]'::jsonb
          ) order by u.created_at asc
        )
        from public.users u
        left join auth.users au on au.id = u.auth_user_id
        where u.company_id = c.company_id
      ),
      '[]'::jsonb
    ),
    'installations', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', i.id, 'name', i.name, 'site_url', i.site_url,
            'system_type', i.system_type, 'status', i.status,
            'wizard_step', i.wizard_step,
            'health_score', i.health_score,
            'health_status', i.health_status,
            'last_health_scan_at', i.last_health_scan_at,
            'last_synced_at', i.last_synced_at, 'installed_at', i.installed_at,
            'activated_at', i.activated_at,
            'created_at', i.created_at,
            'version', coalesce(i.version, i.metadata ->> 'version', '1.0.0'),
            'modules', coalesce(
              (select jsonb_agg(
                jsonb_build_object('module_key', im.module_key, 'status', im.status, 'enabled', im.enabled)
                order by im.module_key)
               from public.installation_modules im
               where im.installation_id = i.id),
              '[]'::jsonb
            ),
            'integrations', coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'integration_key', ii.integration_key,
                    'status', ii.status,
                    'last_synced_at', ii.last_synced_at
                  ) order by ii.integration_key
                )
                from public.installation_integrations ii
                where ii.installation_id = i.id
              ),
              '[]'::jsonb
            )
          ) order by i.created_at desc
        )
        from public.installations i
        where i.company_id = c.company_id
      ),
      '[]'::jsonb
    ),
    'invoices', coalesce(
      (select jsonb_agg(row_to_json(inv.*) order by inv.created_at desc)
       from public.invoices inv where inv.customer_id = c.id),
      '[]'::jsonb
    ),
    'usage', (select row_to_json(us.*) from public.usage_statistics us where us.customer_id = c.id),
    'support', coalesce(
      (select jsonb_agg(row_to_json(sc.*) order by sc.opened_at desc)
       from public.support_cases sc where sc.customer_id = c.id limit 50),
      '[]'::jsonb
    ),
    'activity_log', coalesce(
      (select jsonb_agg(row_to_json(al.*) order by al.created_at desc)
       from public.activity_logs al where al.customer_id = c.id limit 100),
      '[]'::jsonb
    ),
    'team_invitations', coalesce(
      (select jsonb_agg(row_to_json(ti.*) order by ti.created_at desc)
       from public.team_invitations ti where ti.customer_id = c.id),
      '[]'::jsonb
    ),
    'recommendations', coalesce(
      (select jsonb_agg(row_to_json(cr.*) order by cr.created_at desc)
       from public.customer_recommendations cr
       where cr.customer_id = c.id and cr.status = 'active'),
      '[]'::jsonb
    )
  )
  into v_result
  from public.customers c
  left join public.subscriptions s on s.customer_id = c.id
  left join public.payment_profiles pp on pp.customer_id = c.id
  where c.id = p_customer_id;

  return v_result;
end;
$$;

-- Seed onboarding for pilot
do $$
declare
  v_customer_id uuid;
begin
  select id into v_customer_id from public.customers where customer_number = 'AIP-000001' limit 1;
  if v_customer_id is null then return; end if;
  perform public.refresh_customer_onboarding(v_customer_id);
end;
$$;
