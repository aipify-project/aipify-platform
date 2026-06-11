-- Phase A.39 — Enterprise Deployment & Device Rollout Engine
-- IT admin deployment: licenses, seats, device enrollment, SSO/SCIM readiness (no full OAuth/SCIM yet).

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_licenses
-- ---------------------------------------------------------------------------
create table if not exists public.organization_licenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  license_key_hash text not null,
  license_type text not null default 'enterprise' check (
    license_type in ('starter', 'business', 'enterprise', 'trial', 'internal')
  ),
  seat_limit int not null default 1 check (seat_limit > 0),
  active_seats int not null default 0 check (active_seats >= 0),
  status text not null default 'active' check (
    status in ('active', 'suspended', 'expired', 'revoked')
  ),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, license_key_hash)
);

create index if not exists organization_licenses_org_status_idx
  on public.organization_licenses (organization_id, status);

alter table public.organization_licenses enable row level security;
revoke all on public.organization_licenses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_seats
-- ---------------------------------------------------------------------------
create table if not exists public.organization_seats (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  license_id uuid not null references public.organization_licenses (id) on delete cascade,
  seat_status text not null default 'active' check (
    seat_status in ('active', 'pending', 'revoked', 'expired')
  ),
  assigned_by uuid references public.users (id) on delete set null,
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, license_id)
);

create index if not exists organization_seats_org_license_idx
  on public.organization_seats (organization_id, license_id, seat_status);

alter table public.organization_seats enable row level security;
revoke all on public.organization_seats from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. registered_devices
-- ---------------------------------------------------------------------------
create table if not exists public.registered_devices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  device_name text not null,
  device_type text not null default 'desktop' check (
    device_type in ('desktop', 'laptop', 'tablet', 'mobile', 'vm', 'other')
  ),
  os text,
  companion_version text,
  device_identifier_hash text not null,
  enrollment_method text not null default 'enrollment_token' check (
    enrollment_method in (
      'email_invite', 'license_key', 'enrollment_token', 'sso_readiness',
      'managed_enterprise', 'hybrid_connector', 'silent_install'
    )
  ),
  status text not null default 'pending' check (
    status in ('pending', 'active', 'stale', 'failed', 'revoked')
  ),
  last_seen_at timestamptz,
  enrolled_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, device_identifier_hash)
);

create index if not exists registered_devices_org_status_idx
  on public.registered_devices (organization_id, status, last_seen_at desc);

alter table public.registered_devices enable row level security;
revoke all on public.registered_devices from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. deployment_enrollment_tokens
-- ---------------------------------------------------------------------------
create table if not exists public.deployment_enrollment_tokens (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  token_hash text not null,
  token_name text not null,
  allowed_domains jsonb not null default '[]'::jsonb,
  max_uses int not null default 1 check (max_uses > 0),
  used_count int not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  status text not null default 'active' check (
    status in ('active', 'exhausted', 'expired', 'revoked')
  ),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, token_hash)
);

create index if not exists deployment_enrollment_tokens_org_status_idx
  on public.deployment_enrollment_tokens (organization_id, status);

alter table public.deployment_enrollment_tokens enable row level security;
revoke all on public.deployment_enrollment_tokens from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. organization_domains
-- ---------------------------------------------------------------------------
create table if not exists public.organization_domains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain text not null,
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'failed', 'expired')
  ),
  verification_method text not null default 'dns_txt' check (
    verification_method in ('dns_txt', 'dns_cname', 'email', 'manual')
  ),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, domain)
);

alter table public.organization_domains enable row level security;
revoke all on public.organization_domains from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. identity_group_mappings
-- ---------------------------------------------------------------------------
create table if not exists public.identity_group_mappings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  identity_provider text not null,
  external_group_id text not null,
  aipify_role text not null default 'viewer' check (
    aipify_role in ('owner', 'administrator', 'manager', 'support_agent', 'viewer')
  ),
  module_access jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, identity_provider, external_group_id)
);

alter table public.identity_group_mappings enable row level security;
revoke all on public.identity_group_mappings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. sso_provider_configs (readiness — no OAuth flow yet)
-- ---------------------------------------------------------------------------
create table if not exists public.sso_provider_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider text not null check (
    provider in ('okta', 'azure_ad', 'google_workspace', 'onelogin', 'custom_saml', 'custom_oidc')
  ),
  tenant_config jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  readiness_status text not null default 'not_configured' check (
    readiness_status in ('not_configured', 'draft', 'ready', 'disabled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider)
);

alter table public.sso_provider_configs enable row level security;
revoke all on public.sso_provider_configs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. scim_provisioning_settings (readiness scaffold)
-- ---------------------------------------------------------------------------
create table if not exists public.scim_provisioning_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  enabled boolean not null default false,
  endpoint_url text,
  bearer_token_hash text,
  sync_groups boolean not null default true,
  sync_users boolean not null default true,
  readiness_status text not null default 'not_configured' check (
    readiness_status in ('not_configured', 'draft', 'ready', 'disabled')
  ),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

alter table public.scim_provisioning_settings enable row level security;
revoke all on public.scim_provisioning_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. deployment_email_invites
-- ---------------------------------------------------------------------------
create table if not exists public.deployment_email_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email_hash text not null,
  invite_token_hash text not null,
  enrollment_token_id uuid references public.deployment_enrollment_tokens (id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'sent', 'accepted', 'expired', 'revoked')
  ),
  invited_by uuid references public.users (id) on delete set null,
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, invite_token_hash)
);

alter table public.deployment_email_invites enable row level security;
revoke all on public.deployment_email_invites from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. enterprise_deployment_settings
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_deployment_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, setting_key)
);

alter table public.enterprise_deployment_settings enable row level security;
revoke all on public.enterprise_deployment_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'enterprise_deployment', v.description
from (values
  ('deployment.view', 'View Deployment', 'View deployment dashboard, licenses, and devices'),
  ('deployment.manage', 'Manage Deployment', 'Manage deployment settings and enrollment policies'),
  ('deployment.enroll', 'Enroll Devices', 'Create enrollment tokens and send deployment invites'),
  ('deployment.revoke', 'Revoke Deployment', 'Revoke devices, tokens, and seats'),
  ('licenses.manage', 'Manage Licenses', 'Create and manage organization licenses and seats'),
  ('devices.manage', 'Manage Devices', 'Register, monitor, and revoke enrolled devices')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'deployment.view'), ('owner', 'deployment.manage'), ('owner', 'deployment.enroll'),
  ('owner', 'deployment.revoke'), ('owner', 'licenses.manage'), ('owner', 'devices.manage'),
  ('administrator', 'deployment.view'), ('administrator', 'deployment.manage'),
  ('administrator', 'deployment.enroll'), ('administrator', 'deployment.revoke'),
  ('administrator', 'licenses.manage'), ('administrator', 'devices.manage'),
  ('manager', 'deployment.view'), ('manager', 'devices.manage'),
  ('viewer', 'deployment.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 12. Helpers (_edd_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._edd_hash_secret(p_value text)
returns text language sql immutable as $$
  select encode(digest(p_value, 'sha256'), 'hex');
$$;

revoke execute on function public._edd_hash_secret(text) from public, anon, authenticated;

create or replace function public._edd_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'enterprise_deployment',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._edd_generate_token(p_prefix text default 'aipify')
returns text language plpgsql as $$
begin
  return p_prefix || '_' || encode(gen_random_bytes(24), 'hex');
end; $$;

revoke execute on function public._edd_generate_token(text) from public, anon, authenticated;

create or replace function public._edd_default_setting(p_key text)
returns jsonb language sql immutable as $$
  select case p_key
    when 'deployment_methods' then '["email_invite","license_key","enrollment_token","sso_readiness","managed_enterprise","hybrid_connector"]'::jsonb
    when 'device_policy' then '{"stale_after_days":30,"require_sso":false,"allow_silent_install":true}'::jsonb
    when 'installer_downloads' then '{"macos_dmg":"pending","windows_msi":"pending","linux_deb":"pending"}'::jsonb
    when 'privacy_policy' then '{"keystroke_monitoring":false,"screen_monitoring":false,"metadata_only":true}'::jsonb
    when 'subscription_sync' then '{"sync_seats_from_subscription":true,"plan_source":"subscription_plan_management"}'::jsonb
    else '{}'::jsonb
  end;
$$;

create or replace function public._edd_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_deployment_settings (organization_id, setting_key, setting_value)
  select p_organization_id, v.key, public._edd_default_setting(v.key)
  from (values
    ('deployment_methods'), ('device_policy'), ('installer_downloads'),
    ('privacy_policy'), ('subscription_sync')
  ) as v(key)
  on conflict (organization_id, setting_key) do nothing;

  insert into public.scim_provisioning_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._edd_refresh_license_seats(p_license_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.organization_licenses ol
  set active_seats = coalesce((
    select count(*) from public.organization_seats os
    where os.license_id = p_license_id and os.seat_status = 'active'
  ), 0),
  updated_at = now()
  where ol.id = p_license_id;
end; $$;

create or replace function public._edd_mark_stale_devices(p_organization_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_stale_days int := 30;
  v_count int;
begin
  select coalesce((s.setting_value->>'stale_after_days')::int, 30)
  into v_stale_days
  from public.enterprise_deployment_settings s
  where s.organization_id = p_organization_id and s.setting_key = 'device_policy';

  update public.registered_devices
  set status = 'stale', updated_at = now()
  where organization_id = p_organization_id
    and status = 'active'
    and last_seen_at < now() - make_interval(days => v_stale_days);

  get diagnostics v_count = row_count;
  return v_count;
end; $$;

-- ---------------------------------------------------------------------------
-- 13. RPCs — licenses & seats
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_license(
  p_license_type text default 'enterprise',
  p_seat_limit int default 25,
  p_expires_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_raw_key text;
  v_hash text;
  v_row public.organization_licenses;
begin
  perform public._irp_require_permission('licenses.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._edd_ensure_settings(v_org_id);

  v_raw_key := public._edd_generate_token('lic');
  v_hash := public._edd_hash_secret(v_raw_key);

  insert into public.organization_licenses (
    organization_id, license_key_hash, license_type, seat_limit, expires_at, created_by
  )
  values (v_org_id, v_hash, p_license_type, p_seat_limit, p_expires_at, v_user_id)
  returning * into v_row;

  perform public._edd_log(v_org_id, 'license_created', 'organization_license', v_row.id,
    jsonb_build_object('license_type', p_license_type, 'seat_limit', p_seat_limit));

  return jsonb_build_object(
    'license', row_to_json(v_row)::jsonb,
    'license_key', v_raw_key,
    'license_key_shown_once', true
  );
end; $$;

create or replace function public.activate_license_key(p_license_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_hash text;
  v_license public.organization_licenses;
  v_seat public.organization_seats;
begin
  perform public._irp_require_permission('deployment.enroll');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_hash := public._edd_hash_secret(p_license_key);

  select * into v_license from public.organization_licenses
  where organization_id = v_org_id and license_key_hash = v_hash and status = 'active';

  if not found then raise exception 'Invalid or inactive license key'; end if;
  if v_license.expires_at is not null and v_license.expires_at < now() then
    raise exception 'License expired';
  end if;
  if v_license.active_seats >= v_license.seat_limit then
    raise exception 'No seats available on this license';
  end if;

  insert into public.organization_seats (organization_id, user_id, license_id, seat_status, assigned_by)
  values (v_org_id, v_user_id, v_license.id, 'active', v_user_id)
  on conflict (organization_id, user_id, license_id) do update set
    seat_status = 'active', revoked_at = null, updated_at = now()
  returning * into v_seat;

  perform public._edd_refresh_license_seats(v_license.id);
  perform public._edd_log(v_org_id, 'seat_assigned', 'organization_seat', v_seat.id,
    jsonb_build_object('license_id', v_license.id, 'method', 'license_key'));

  return jsonb_build_object('seat', row_to_json(v_seat)::jsonb, 'license_id', v_license.id);
end; $$;

create or replace function public.assign_organization_seat(
  p_user_id uuid,
  p_license_id uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_assigner uuid;
  v_license public.organization_licenses;
  v_seat public.organization_seats;
begin
  perform public._irp_require_permission('licenses.manage');
  v_org_id := public._mta_require_organization();
  v_assigner := public._mta_app_user_id();

  select * into v_license from public.organization_licenses
  where id = p_license_id and organization_id = v_org_id and status = 'active';
  if not found then raise exception 'License not found'; end if;
  if v_license.active_seats >= v_license.seat_limit then
    raise exception 'No seats available';
  end if;

  insert into public.organization_seats (organization_id, user_id, license_id, seat_status, assigned_by)
  values (v_org_id, p_user_id, p_license_id, 'active', v_assigner)
  on conflict (organization_id, user_id, license_id) do update set
    seat_status = 'active', assigned_by = v_assigner, revoked_at = null, updated_at = now()
  returning * into v_seat;

  perform public._edd_refresh_license_seats(p_license_id);
  perform public._edd_log(v_org_id, 'seat_assigned', 'organization_seat', v_seat.id,
    jsonb_build_object('user_id', p_user_id, 'license_id', p_license_id));

  return row_to_json(v_seat)::jsonb;
end; $$;

create or replace function public.revoke_organization_seat(p_seat_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_seat public.organization_seats;
begin
  perform public._irp_require_permission('deployment.revoke');
  v_org_id := public._mta_require_organization();

  update public.organization_seats
  set seat_status = 'revoked', revoked_at = now(), updated_at = now()
  where id = p_seat_id and organization_id = v_org_id and seat_status = 'active'
  returning * into v_seat;

  if not found then raise exception 'Active seat not found'; end if;

  perform public._edd_refresh_license_seats(v_seat.license_id);
  perform public._edd_log(v_org_id, 'seat_revoked', 'organization_seat', v_seat.id,
    jsonb_build_object('user_id', v_seat.user_id, 'license_id', v_seat.license_id));

  return row_to_json(v_seat)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 14. RPCs — enrollment tokens & email invites
-- ---------------------------------------------------------------------------
create or replace function public.create_deployment_enrollment_token(
  p_token_name text,
  p_allowed_domains jsonb default '[]'::jsonb,
  p_max_uses int default 1,
  p_expires_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_raw text;
  v_hash text;
  v_row public.deployment_enrollment_tokens;
begin
  perform public._irp_require_permission('deployment.enroll');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  v_raw := public._edd_generate_token('enroll');
  v_hash := public._edd_hash_secret(v_raw);

  insert into public.deployment_enrollment_tokens (
    organization_id, token_hash, token_name, allowed_domains, max_uses, expires_at, created_by
  )
  values (v_org_id, v_hash, p_token_name, coalesce(p_allowed_domains, '[]'::jsonb), p_max_uses, p_expires_at, v_user_id)
  returning * into v_row;

  perform public._edd_log(v_org_id, 'enrollment_token_created', 'deployment_enrollment_token', v_row.id,
    jsonb_build_object('token_name', p_token_name, 'max_uses', p_max_uses));

  return jsonb_build_object(
    'token', row_to_json(v_row)::jsonb,
    'enrollment_token', v_raw,
    'token_shown_once', true
  );
end; $$;

create or replace function public.revoke_deployment_enrollment_token(p_token_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.deployment_enrollment_tokens;
begin
  perform public._irp_require_permission('deployment.revoke');
  v_org_id := public._mta_require_organization();

  update public.deployment_enrollment_tokens
  set status = 'revoked', updated_at = now()
  where id = p_token_id and organization_id = v_org_id and status = 'active'
  returning * into v_row;

  if not found then raise exception 'Active token not found'; end if;

  perform public._edd_log(v_org_id, 'enrollment_token_revoked', 'deployment_enrollment_token', v_row.id,
    jsonb_build_object('token_name', v_row.token_name));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.send_deployment_email_invite(
  p_email text,
  p_expires_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_token_result jsonb;
  v_token_id uuid;
  v_invite_raw text;
  v_invite_hash text;
  v_email_hash text;
  v_row public.deployment_email_invites;
begin
  perform public._irp_require_permission('deployment.enroll');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  v_token_result := public.create_deployment_enrollment_token(
    'Email invite: ' || split_part(p_email, '@', 2),
    jsonb_build_array(split_part(p_email, '@', 2)),
    1,
    coalesce(p_expires_at, now() + interval '7 days')
  );
  v_token_id := (v_token_result->'token'->>'id')::uuid;

  v_invite_raw := public._edd_generate_token('invite');
  v_invite_hash := public._edd_hash_secret(v_invite_raw);
  v_email_hash := public._edd_hash_secret(lower(trim(p_email)));

  insert into public.deployment_email_invites (
    organization_id, email_hash, invite_token_hash, enrollment_token_id,
    status, invited_by, expires_at
  )
  values (
    v_org_id, v_email_hash, v_invite_hash, v_token_id,
    'sent', v_user_id, coalesce(p_expires_at, now() + interval '7 days')
  )
  returning * into v_row;

  perform public._edd_log(v_org_id, 'deployment_invite_sent', 'deployment_email_invite', v_row.id,
    jsonb_build_object('email_domain', split_part(p_email, '@', 2), 'enrollment_token_id', v_token_id));

  return jsonb_build_object(
    'invite', row_to_json(v_row)::jsonb,
    'invite_link_token', v_invite_raw,
    'enrollment_token', v_token_result->>'enrollment_token',
    'tokens_shown_once', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 15. RPCs — device registration
-- ---------------------------------------------------------------------------
create or replace function public.register_device(
  p_device_name text,
  p_device_type text default 'desktop',
  p_os text default null,
  p_companion_version text default null,
  p_device_identifier text default null,
  p_enrollment_method text default 'enrollment_token',
  p_enrollment_token text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_identifier text;
  v_identifier_hash text;
  v_token_row public.deployment_enrollment_tokens;
  v_row public.registered_devices;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_enrollment_token is not null then
    select * into v_token_row from public.deployment_enrollment_tokens
    where organization_id = v_org_id
      and token_hash = public._edd_hash_secret(p_enrollment_token)
      and status = 'active';

    if not found then raise exception 'Invalid enrollment token'; end if;
    if v_token_row.expires_at is not null and v_token_row.expires_at < now() then
      raise exception 'Enrollment token expired';
    end if;
    if v_token_row.used_count >= v_token_row.max_uses then
      raise exception 'Enrollment token exhausted';
    end if;

    update public.deployment_enrollment_tokens
    set used_count = used_count + 1,
        status = case when used_count + 1 >= max_uses then 'exhausted' else status end,
        updated_at = now()
    where id = v_token_row.id;
  else
    perform public._irp_require_permission('devices.manage');
  end if;

  v_identifier := coalesce(nullif(trim(p_device_identifier), ''), p_device_name || ':' || coalesce(v_user_id::text, 'anon'));
  v_identifier_hash := public._edd_hash_secret(v_identifier);

  insert into public.registered_devices (
    organization_id, user_id, device_name, device_type, os, companion_version,
    device_identifier_hash, enrollment_method, status, last_seen_at, enrolled_at, metadata
  )
  values (
    v_org_id, v_user_id, p_device_name, p_device_type, p_os, p_companion_version,
    v_identifier_hash, coalesce(p_enrollment_method, 'enrollment_token'), 'active', now(), now(), coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (organization_id, device_identifier_hash) do update set
    device_name = excluded.device_name,
    os = excluded.os,
    companion_version = excluded.companion_version,
    status = 'active',
    last_seen_at = now(),
    updated_at = now()
  returning * into v_row;

  perform public._edd_log(v_org_id, 'device_registered', 'registered_device', v_row.id,
    jsonb_build_object(
      'device_type', p_device_type,
      'enrollment_method', coalesce(p_enrollment_method, 'enrollment_token')
    ));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.revoke_registered_device(p_device_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.registered_devices;
begin
  perform public._irp_require_permission('deployment.revoke');
  v_org_id := public._mta_require_organization();

  update public.registered_devices
  set status = 'revoked', revoked_at = now(), updated_at = now()
  where id = p_device_id and organization_id = v_org_id and status in ('active', 'pending', 'stale', 'failed')
  returning * into v_row;

  if not found then raise exception 'Device not found'; end if;

  perform public._edd_log(v_org_id, 'device_revoked', 'registered_device', v_row.id,
    jsonb_build_object('device_name', v_row.device_name));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_device_heartbeat(
  p_device_identifier text,
  p_companion_version text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_hash text;
  v_row public.registered_devices;
begin
  v_org_id := public._mta_require_organization();
  v_hash := public._edd_hash_secret(p_device_identifier);

  update public.registered_devices
  set last_seen_at = now(),
      companion_version = coalesce(p_companion_version, companion_version),
      status = case when status = 'stale' then 'active' else status end,
      updated_at = now()
  where organization_id = v_org_id and device_identifier_hash = v_hash and status <> 'revoked'
  returning * into v_row;

  if not found then raise exception 'Device not registered'; end if;
  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 16. RPCs — SSO/SCIM readiness & domains
-- ---------------------------------------------------------------------------
create or replace function public.save_sso_provider_config(
  p_provider text,
  p_tenant_config jsonb default '{}'::jsonb,
  p_enabled boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.sso_provider_configs;
begin
  perform public._irp_require_permission('deployment.manage');
  v_org_id := public._mta_require_organization();

  insert into public.sso_provider_configs (organization_id, provider, tenant_config, enabled, readiness_status)
  values (
    v_org_id, p_provider, coalesce(p_tenant_config, '{}'::jsonb), p_enabled,
    case when p_enabled then 'ready' else 'draft' end
  )
  on conflict (organization_id, provider) do update set
    tenant_config = excluded.tenant_config,
    enabled = excluded.enabled,
    readiness_status = excluded.readiness_status,
    updated_at = now()
  returning * into v_row;

  perform public._edd_log(v_org_id, 'sso_config_updated', 'sso_provider_config', v_row.id,
    jsonb_build_object('provider', p_provider, 'enabled', p_enabled));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.save_scim_provisioning_settings(
  p_settings jsonb default '{}'::jsonb,
  p_enabled boolean default false,
  p_endpoint_url text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.scim_provisioning_settings;
begin
  perform public._irp_require_permission('deployment.manage');
  v_org_id := public._mta_require_organization();
  perform public._edd_ensure_settings(v_org_id);

  update public.scim_provisioning_settings
  set settings = coalesce(p_settings, '{}'::jsonb),
      enabled = p_enabled,
      endpoint_url = p_endpoint_url,
      readiness_status = case when p_enabled then 'ready' else 'draft' end,
      updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._edd_log(v_org_id, 'scim_settings_updated', 'scim_provisioning_settings', v_row.id,
    jsonb_build_object('enabled', p_enabled));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.add_organization_deployment_domain(
  p_domain text,
  p_verification_method text default 'dns_txt'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_domains;
begin
  perform public._irp_require_permission('deployment.manage');
  v_org_id := public._mta_require_organization();

  insert into public.organization_domains (organization_id, domain, verification_method)
  values (v_org_id, lower(trim(p_domain)), p_verification_method)
  on conflict (organization_id, domain) do update set updated_at = now()
  returning * into v_row;

  perform public._edd_log(v_org_id, 'domain_verification_started', 'organization_domain', v_row.id,
    jsonb_build_object('domain', v_row.domain));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.save_identity_group_mapping(
  p_identity_provider text,
  p_external_group_id text,
  p_aipify_role text default 'viewer',
  p_module_access jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.identity_group_mappings;
begin
  perform public._irp_require_permission('deployment.manage');
  v_org_id := public._mta_require_organization();

  insert into public.identity_group_mappings (
    organization_id, identity_provider, external_group_id, aipify_role, module_access
  )
  values (v_org_id, p_identity_provider, p_external_group_id, p_aipify_role, coalesce(p_module_access, '[]'::jsonb))
  on conflict (organization_id, identity_provider, external_group_id) do update set
    aipify_role = excluded.aipify_role,
    module_access = excluded.module_access,
    updated_at = now()
  returning * into v_row;

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 17. Dashboard & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_deployment_device_rollout_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings jsonb;
  v_stale_count int;
begin
  perform public._irp_require_permission('deployment.view');
  v_org_id := public._mta_require_organization();
  perform public._edd_ensure_settings(v_org_id);
  perform public._edd_mark_stale_devices(v_org_id);

  select coalesce(jsonb_object_agg(s.setting_key, s.setting_value), '{}'::jsonb)
  into v_settings
  from public.enterprise_deployment_settings s
  where s.organization_id = v_org_id;

  select count(*) into v_stale_count
  from public.registered_devices
  where organization_id = v_org_id and status in ('stale', 'failed');

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Enterprise deployment with human-controlled rollout — licenses, seats, and device enrollment without surveillance.',
    'principles', jsonb_build_array(
      'License keys and enrollment tokens hashed — raw values shown once',
      'Tenant isolation mandatory on all deployment records',
      'SSO and SCIM are readiness models — full OAuth/SCIM in future phases',
      'No keystroke or screen monitoring — metadata-only device registration',
      'Integrates Desktop Command Center, Install Engine, and Subscription Plan Management'
    ),
    'privacy_note', 'Aipify never monitors keystrokes or screens. Device records store name, OS, version, and last-seen metadata only.',
    'summary', jsonb_build_object(
      'active_licenses', coalesce((
        select count(*) from public.organization_licenses
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'total_seats', coalesce((
        select sum(seat_limit) from public.organization_licenses
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'active_seats', coalesce((
        select count(*) from public.organization_seats
        where organization_id = v_org_id and seat_status = 'active'
      ), 0),
      'registered_devices', coalesce((
        select count(*) from public.registered_devices
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'stale_or_failed_devices', v_stale_count,
      'active_enrollment_tokens', coalesce((
        select count(*) from public.deployment_enrollment_tokens
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'verified_domains', coalesce((
        select count(*) from public.organization_domains
        where organization_id = v_org_id and verification_status = 'verified'
      ), 0),
      'sso_providers_ready', coalesce((
        select count(*) from public.sso_provider_configs
        where organization_id = v_org_id and readiness_status = 'ready'
      ), 0)
    ),
    'licenses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ol.id,
        'license_type', ol.license_type,
        'seat_limit', ol.seat_limit,
        'active_seats', ol.active_seats,
        'status', ol.status,
        'issued_at', ol.issued_at,
        'expires_at', ol.expires_at
      ) order by ol.issued_at desc)
      from public.organization_licenses ol
      where ol.organization_id = v_org_id
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rd.id,
        'device_name', rd.device_name,
        'device_type', rd.device_type,
        'os', rd.os,
        'companion_version', rd.companion_version,
        'enrollment_method', rd.enrollment_method,
        'status', rd.status,
        'last_seen_at', rd.last_seen_at
      ) order by rd.last_seen_at desc nulls last)
      from public.registered_devices rd
      where rd.organization_id = v_org_id
        and rd.status <> 'revoked'
      limit 50
    ), '[]'::jsonb),
    'enrollment_tokens', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', det.id,
        'token_name', det.token_name,
        'max_uses', det.max_uses,
        'used_count', det.used_count,
        'expires_at', det.expires_at,
        'status', det.status
      ) order by det.created_at desc)
      from public.deployment_enrollment_tokens det
      where det.organization_id = v_org_id and det.status <> 'revoked'
      limit 20
    ), '[]'::jsonb),
    'domains', coalesce((
      select jsonb_agg(row_to_json(od) order by od.domain)
      from public.organization_domains od
      where od.organization_id = v_org_id
    ), '[]'::jsonb),
    'sso_configs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sp.id,
        'provider', sp.provider,
        'enabled', sp.enabled,
        'readiness_status', sp.readiness_status
      ) order by sp.provider)
      from public.sso_provider_configs sp
      where sp.organization_id = v_org_id
    ), '[]'::jsonb),
    'scim_readiness', coalesce((
      select row_to_json(sc)::jsonb
      from public.scim_provisioning_settings sc
      where sc.organization_id = v_org_id
    ), '{}'::jsonb),
    'stale_enrollments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rd.id,
        'device_name', rd.device_name,
        'status', rd.status,
        'last_seen_at', rd.last_seen_at
      ) order by rd.last_seen_at)
      from public.registered_devices rd
      where rd.organization_id = v_org_id and rd.status in ('stale', 'failed', 'pending')
      limit 20
    ), '[]'::jsonb),
    'pending_invites', coalesce((
      select count(*) from public.deployment_email_invites
      where organization_id = v_org_id and status in ('pending', 'sent')
    ), 0),
    'settings', v_settings,
    'installer_downloads', v_settings->'installer_downloads',
    'deployment_methods', v_settings->'deployment_methods',
    'enterprise_readiness_link', '/app/enterprise-readiness-engine',
    'command_center_link', '/app/command-center/connect',
    'subscription_link', '/app/subscription-plan-management-engine'
  );
end; $$;

create or replace function public.get_enterprise_deployment_device_rollout_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('deployment.view');
  v_org_id := public._mta_require_organization();
  perform public._edd_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'active_licenses', coalesce((
      select count(*) from public.organization_licenses
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'active_seats', coalesce((
      select count(*) from public.organization_seats
      where organization_id = v_org_id and seat_status = 'active'
    ), 0),
    'registered_devices', coalesce((
      select count(*) from public.registered_devices
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'stale_devices', coalesce((
      select count(*) from public.registered_devices
      where organization_id = v_org_id and status in ('stale', 'failed')
    ), 0),
    'philosophy', 'IT admin deployment dashboard for licenses, seats, and device rollout.'
  );
end; $$;

create or replace function public.list_organization_licenses()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('licenses.manage');
  v_org_id := public._mta_require_organization();
  return coalesce((
    select jsonb_agg(row_to_json(ol) order by ol.issued_at desc)
    from public.organization_licenses ol where ol.organization_id = v_org_id
  ), '[]'::jsonb);
end; $$;

create or replace function public.list_registered_devices()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('deployment.view');
  v_org_id := public._mta_require_organization();
  return coalesce((
    select jsonb_agg(row_to_json(rd) order by rd.last_seen_at desc nulls last)
    from public.registered_devices rd
    where rd.organization_id = v_org_id and rd.status <> 'revoked'
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 18. Audit extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'license_created', 'seat_assigned', 'seat_revoked',
    'device_registered', 'device_revoked',
    'enrollment_token_created', 'enrollment_token_revoked',
    'deployment_invite_sent', 'domain_verification_started',
    'sso_config_updated', 'scim_settings_updated'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'enterprise-deployment-device-rollout-engine', 'Enterprise Deployment & Device Rollout', 'IT admin deployment dashboard for licenses, seats, device enrollment, and SSO/SCIM readiness.', 'authenticated', 74
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'enterprise-deployment-device-rollout-engine' and tenant_id is null);

grant execute on function public.get_enterprise_deployment_device_rollout_engine_dashboard() to authenticated;
grant execute on function public.get_enterprise_deployment_device_rollout_engine_card() to authenticated;
grant execute on function public.create_organization_license(text, int, timestamptz) to authenticated;
grant execute on function public.activate_license_key(text) to authenticated;
grant execute on function public.assign_organization_seat(uuid, uuid) to authenticated;
grant execute on function public.revoke_organization_seat(uuid) to authenticated;
grant execute on function public.create_deployment_enrollment_token(text, jsonb, int, timestamptz) to authenticated;
grant execute on function public.revoke_deployment_enrollment_token(uuid) to authenticated;
grant execute on function public.send_deployment_email_invite(text, timestamptz) to authenticated;
grant execute on function public.register_device(text, text, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.revoke_registered_device(uuid) to authenticated;
grant execute on function public.record_device_heartbeat(text, text) to authenticated;
grant execute on function public.save_sso_provider_config(text, jsonb, boolean) to authenticated;
grant execute on function public.save_scim_provisioning_settings(jsonb, boolean, text) to authenticated;
grant execute on function public.add_organization_deployment_domain(text, text) to authenticated;
grant execute on function public.save_identity_group_mapping(text, text, text, jsonb) to authenticated;
grant execute on function public.list_organization_licenses() to authenticated;
grant execute on function public.list_registered_devices() to authenticated;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._edd_ensure_settings(v_org_id);
  end loop;
end $$;
