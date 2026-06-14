-- Two-Factor Authentication (TOTP + recovery codes) — Phase 1
-- TOTP secrets encrypted at application layer (TOTP_ENCRYPTION_KEY); DB stores ciphertext only.

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.user_two_factor_settings (
  user_id uuid primary key references public.users (id) on delete cascade,
  enabled boolean not null default false,
  totp_secret_encrypted text,
  pending_secret_encrypted text,
  confirmed_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_two_factor_recovery_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  code_hash text not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists user_two_factor_recovery_codes_user_idx
  on public.user_two_factor_recovery_codes (user_id, used_at);

create table if not exists public.two_factor_verification_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  expires_at timestamptz not null,
  attempts int not null default 0,
  max_attempts int not null default 5,
  verified_at timestamptz,
  locked_until timestamptz,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists two_factor_verification_challenges_user_idx
  on public.two_factor_verification_challenges (user_id, created_at desc);

create table if not exists public.two_factor_session_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  session_fingerprint text not null,
  verified_at timestamptz not null default now(),
  expires_at timestamptz not null,
  unique (user_id, session_fingerprint)
);

create index if not exists two_factor_session_verifications_expires_idx
  on public.two_factor_session_verifications (expires_at);

create table if not exists public.organization_two_factor_policies (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enforce_all_users boolean not null default false,
  required_roles jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.two_factor_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  organization_id uuid references public.organizations (id) on delete set null,
  event_type text not null check (
    event_type in (
      'enabled', 'disabled', 'verification_success', 'verification_failed',
      'recovery_code_used', 'recovery_codes_regenerated', 'admin_enforced', 'suspicious_attempt'
    )
  ),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists two_factor_audit_logs_user_idx
  on public.two_factor_audit_logs (user_id, created_at desc);

alter table public.user_two_factor_settings enable row level security;
alter table public.user_two_factor_recovery_codes enable row level security;
alter table public.two_factor_verification_challenges enable row level security;
alter table public.two_factor_session_verifications enable row level security;
alter table public.organization_two_factor_policies enable row level security;
alter table public.two_factor_audit_logs enable row level security;

revoke all on public.user_two_factor_settings from authenticated, anon;
revoke all on public.user_two_factor_recovery_codes from authenticated, anon;
revoke all on public.two_factor_verification_challenges from authenticated, anon;
revoke all on public.two_factor_session_verifications from authenticated, anon;
revoke all on public.organization_two_factor_policies from authenticated, anon;
revoke all on public.two_factor_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers (_tfa_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._tfa_ensure_app_user_id()
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_company_id uuid;
  v_email text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is not null then return v_user_id; end if;

  if not public.is_platform_admin() then return null; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is not null then return v_user_id; end if;

  select id into v_company_id from public.companies where is_platform = true order by created_at limit 1;
  if v_company_id is null then return null; end if;

  v_email := coalesce(auth.jwt() ->> 'email', 'Platform Admin');

  insert into public.users (auth_user_id, company_id, full_name, role)
  values (auth.uid(), v_company_id, v_email, 'admin')
  on conflict (auth_user_id) do update set full_name = excluded.full_name
  returning id into v_user_id;

  return v_user_id;
end; $$;

create or replace function public._tfa_app_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select public._tfa_ensure_app_user_id();
$$;

create or replace function public._tfa_hash_text(p_value text)
returns text language sql immutable as $$
  select encode(extensions.digest(coalesce(p_value, ''), 'sha256'), 'hex');
$$;

create or replace function public._tfa_ip_hash(p_ip text)
returns text language sql immutable as $$
  select public._tfa_hash_text(coalesce(p_ip, ''));
$$;

create or replace function public._tfa_current_org_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  select organization_id into v_org_id
  from public.organization_user_context
  where user_id = public._tfa_app_user_id();
  if v_org_id is not null then return v_org_id; end if;

  select ou.organization_id into v_org_id
  from public.organization_users ou
  where ou.user_id = public._tfa_app_user_id() and ou.status = 'active'
  order by ou.created_at asc
  limit 1;

  return v_org_id;
end; $$;

create or replace function public._tfa_is_platform_admin(p_user_id uuid default public._tfa_app_user_id())
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_auth_id uuid;
begin
  if p_user_id is null then return false; end if;
  select auth_user_id into v_auth_id from public.users where id = p_user_id;
  if v_auth_id is null then return false; end if;
  return exists (
    select 1 from public.platform_admins pa where pa.auth_user_id = v_auth_id
  );
end; $$;

create or replace function public._tfa_user_base_role(p_user_id uuid default public._tfa_app_user_id())
returns text language plpgsql stable security definer set search_path = public as $$
declare v_role text;
begin
  select role into v_role from public.users where id = p_user_id;
  return v_role;
end; $$;

create or replace function public._tfa_user_org_roles(p_user_id uuid default public._tfa_app_user_id())
returns text[] language plpgsql stable security definer set search_path = public as $$
declare v_roles text[];
begin
  select coalesce(array_agg(distinct ou.role), '{}'::text[]) into v_roles
  from public.organization_users ou
  where ou.user_id = p_user_id and ou.status = 'active';
  return v_roles;
end; $$;

create or replace function public.user_requires_two_factor(p_user_id uuid default public._tfa_app_user_id())
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_policy public.organization_two_factor_policies%rowtype;
  v_base_role text;
  v_org_roles text[];
  v_role text;
begin
  if p_user_id is null then return false; end if;

  if public._tfa_is_platform_admin(p_user_id) then return true; end if;

  v_base_role := public._tfa_user_base_role(p_user_id);
  if v_base_role in ('owner', 'admin') then return true; end if;

  v_org_roles := public._tfa_user_org_roles(p_user_id);
  foreach v_role in array v_org_roles loop
    if v_role in ('owner', 'administrator') then return true; end if;
    if v_role = 'billing_admin' then return true; end if;
    if v_role = 'security_admin' then return true; end if;
    if v_role = 'growth_partner' then return true; end if;
  end loop;

  v_org_id := public._tfa_current_org_id();
  if v_org_id is null then
    select ou.organization_id into v_org_id
    from public.organization_users ou
    where ou.user_id = p_user_id and ou.status = 'active'
    order by ou.created_at asc
    limit 1;
  end if;

  if v_org_id is not null then
    select * into v_policy from public.organization_two_factor_policies where organization_id = v_org_id;
    if found then
      if v_policy.enforce_all_users then return true; end if;
      if v_policy.required_roles is not null and jsonb_array_length(v_policy.required_roles) > 0 then
        foreach v_role in array v_org_roles loop
          if v_policy.required_roles ? v_role then return true; end if;
        end loop;
        if v_policy.required_roles ? v_base_role then return true; end if;
      end if;
    end if;
  end if;

  return false;
end; $$;

create or replace function public.log_two_factor_audit_event(
  p_event_type text,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb,
  p_ip_hash text default null,
  p_user_id uuid default public._tfa_app_user_id(),
  p_organization_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.two_factor_audit_logs (
    user_id, organization_id, event_type, summary, metadata, ip_hash
  ) values (
    p_user_id,
    coalesce(p_organization_id, public._tfa_current_org_id()),
    p_event_type,
    p_summary,
    coalesce(p_metadata, '{}'::jsonb),
    p_ip_hash
  )
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._tfa_get_settings(p_user_id uuid default public._tfa_app_user_id())
returns public.user_two_factor_settings language plpgsql stable security definer set search_path = public as $$
declare v_row public.user_two_factor_settings%rowtype;
begin
  select * into v_row from public.user_two_factor_settings where user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._tfa_rate_limit_ok(p_challenge_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_row public.two_factor_verification_challenges%rowtype;
begin
  select * into v_row from public.two_factor_verification_challenges where id = p_challenge_id;
  if not found then return false; end if;
  if v_row.locked_until is not null and v_row.locked_until > now() then return false; end if;
  if v_row.attempts >= v_row.max_attempts then return false; end if;
  if v_row.expires_at <= now() then return false; end if;
  if v_row.verified_at is not null then return false; end if;
  return true;
end; $$;

create or replace function public.create_two_factor_challenge(
  p_user_id uuid default public._tfa_app_user_id(),
  p_ip_hash text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
  v_caller uuid;
begin
  v_caller := public._tfa_app_user_id();
  if v_caller is null or (p_user_id <> v_caller and not public._tfa_is_platform_admin(v_caller)) then
    raise exception 'Unauthorized';
  end if;

  update public.two_factor_verification_challenges
  set verified_at = coalesce(verified_at, now())
  where user_id = p_user_id and verified_at is null and expires_at > now();

  insert into public.two_factor_verification_challenges (
    user_id, expires_at, max_attempts, ip_hash
  ) values (
    p_user_id, now() + interval '10 minutes', 5, p_ip_hash
  )
  returning id into v_id;

  return v_id;
end; $$;

create or replace function public._tfa_record_failed_attempt(
  p_challenge_id uuid,
  p_ip_hash text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_row public.two_factor_verification_challenges%rowtype;
  v_locked boolean := false;
begin
  select * into v_row
  from public.two_factor_verification_challenges
  where id = p_challenge_id and user_id = public._tfa_app_user_id()
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'challenge_not_found');
  end if;

  update public.two_factor_verification_challenges
  set
    attempts = attempts + 1,
    locked_until = case
      when attempts + 1 >= max_attempts then now() + interval '15 minutes'
      else locked_until
    end
  where id = p_challenge_id
  returning * into v_row;

  v_locked := v_row.attempts >= v_row.max_attempts;

  perform public.log_two_factor_audit_event(
    case when v_locked then 'suspicious_attempt' else 'verification_failed' end,
    case when v_locked then 'Two-factor challenge locked after repeated failures' else 'Two-factor verification failed' end,
    jsonb_build_object('challenge_id', p_challenge_id, 'attempts', v_row.attempts),
    p_ip_hash
  );

  return jsonb_build_object(
    'ok', false,
    'attempts', v_row.attempts,
    'max_attempts', v_row.max_attempts,
    'locked', v_locked,
    'locked_until', v_row.locked_until
  );
end; $$;

create or replace function public._tfa_complete_challenge(
  p_challenge_id uuid,
  p_method text default 'totp',
  p_ip_hash text default null
)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  update public.two_factor_verification_challenges c
  set verified_at = now()
  where c.id = p_challenge_id
    and c.user_id = public._tfa_app_user_id()
    and c.verified_at is null
    and public._tfa_rate_limit_ok(p_challenge_id)
  returning c.user_id into v_user_id;

  if v_user_id is null then return false; end if;

  update public.user_two_factor_settings
  set last_verified_at = now(), updated_at = now()
  where user_id = v_user_id;

  perform public.log_two_factor_audit_event(
    case when p_method = 'recovery' then 'recovery_code_used' else 'verification_success' end,
    case when p_method = 'recovery' then 'Sign-in verified with recovery code' else 'Sign-in verified with authenticator code' end,
    jsonb_build_object('challenge_id', p_challenge_id, 'method', p_method),
    p_ip_hash
  );

  return true;
end; $$;

create or replace function public.verify_two_factor_challenge(
  p_challenge_id uuid,
  p_code text,
  p_use_recovery boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_row public.user_two_factor_recovery_codes%rowtype;
  v_code_hash text;
begin
  if not public._tfa_rate_limit_ok(p_challenge_id) then
    return jsonb_build_object('ok', false, 'error', 'challenge_locked_or_expired');
  end if;

  v_user_id := public._tfa_app_user_id();
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if not p_use_recovery then
    return jsonb_build_object('ok', false, 'error', 'totp_verify_app_layer');
  end if;

  v_code_hash := public._tfa_hash_text(upper(replace(trim(p_code), '-', '')));

  select * into v_row
  from public.user_two_factor_recovery_codes
  where user_id = v_user_id and code_hash = v_code_hash and used_at is null
  limit 1;

  if not found then
    return public._tfa_record_failed_attempt(p_challenge_id, null);
  end if;

  update public.user_two_factor_recovery_codes set used_at = now() where id = v_row.id;

  if not public._tfa_complete_challenge(p_challenge_id, 'recovery', null) then
    return jsonb_build_object('ok', false, 'error', 'complete_failed');
  end if;

  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.mark_session_two_factor_verified(
  p_session_fingerprint text,
  p_ttl_hours int default 720
)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._tfa_app_user_id();
  if v_user_id is null or p_session_fingerprint is null or length(trim(p_session_fingerprint)) = 0 then
    return false;
  end if;

  insert into public.two_factor_session_verifications (
    user_id, session_fingerprint, verified_at, expires_at
  ) values (
    v_user_id, trim(p_session_fingerprint), now(), now() + make_interval(hours => greatest(p_ttl_hours, 1))
  )
  on conflict (user_id, session_fingerprint) do update
  set verified_at = now(), expires_at = excluded.expires_at;

  return true;
end; $$;

create or replace function public.is_session_two_factor_verified(
  p_session_fingerprint text,
  p_user_id uuid default public._tfa_app_user_id()
)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if p_user_id is null or p_session_fingerprint is null then return false; end if;

  return exists (
    select 1 from public.two_factor_session_verifications s
    where s.user_id = p_user_id
      and s.session_fingerprint = trim(p_session_fingerprint)
      and s.expires_at > now()
  );
end; $$;

create or replace function public.get_two_factor_status(
  p_session_fingerprint text default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_settings public.user_two_factor_settings%rowtype;
  v_required boolean;
  v_verified boolean;
  v_recovery_remaining int;
begin
  v_user_id := public._tfa_app_user_id();
  if v_user_id is null then
    return jsonb_build_object('authenticated', false);
  end if;

  select * into v_settings from public.user_two_factor_settings where user_id = v_user_id;
  v_required := public.user_requires_two_factor(v_user_id);
  v_verified := case
    when p_session_fingerprint is not null then public.is_session_two_factor_verified(p_session_fingerprint, v_user_id)
    else false
  end;

  select count(*)::int into v_recovery_remaining
  from public.user_two_factor_recovery_codes
  where user_id = v_user_id and used_at is null;

  return jsonb_build_object(
    'authenticated', true,
    'enabled', coalesce(v_settings.enabled, false),
    'required', v_required,
    'confirmed_at', v_settings.confirmed_at,
    'last_verified_at', v_settings.last_verified_at,
    'session_verified', v_verified,
    'recovery_codes_remaining', coalesce(v_recovery_remaining, 0),
    'needs_enrollment', v_required and not coalesce(v_settings.enabled, false),
    'needs_verification', coalesce(v_settings.enabled, false) and not v_verified
  );
end; $$;

create or replace function public._tfa_store_pending_enrollment(p_encrypted_secret text)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._tfa_app_user_id();
  if v_user_id is null or p_encrypted_secret is null then return false; end if;

  insert into public.user_two_factor_settings (user_id, pending_secret_encrypted, enabled, updated_at)
  values (v_user_id, p_encrypted_secret, false, now())
  on conflict (user_id) do update
  set pending_secret_encrypted = excluded.pending_secret_encrypted, updated_at = now();

  return true;
end; $$;

create or replace function public._tfa_get_pending_secret_encrypted()
returns text language plpgsql stable security definer set search_path = public as $$
declare v_secret text;
begin
  select pending_secret_encrypted into v_secret
  from public.user_two_factor_settings
  where user_id = public._tfa_app_user_id();
  return v_secret;
end; $$;

create or replace function public._tfa_get_active_secret_encrypted()
returns text language plpgsql stable security definer set search_path = public as $$
declare v_secret text;
begin
  select totp_secret_encrypted into v_secret
  from public.user_two_factor_settings
  where user_id = public._tfa_app_user_id() and enabled = true;
  return v_secret;
end; $$;

create or replace function public.confirm_two_factor_enrollment(
  p_recovery_code_hashes text[]
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_pending text;
begin
  v_user_id := public._tfa_app_user_id();
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select pending_secret_encrypted into v_pending
  from public.user_two_factor_settings
  where user_id = v_user_id;

  if v_pending is null then
    return jsonb_build_object('ok', false, 'error', 'no_pending_enrollment');
  end if;

  update public.user_two_factor_settings
  set
    enabled = true,
    totp_secret_encrypted = v_pending,
    pending_secret_encrypted = null,
    confirmed_at = now(),
    updated_at = now()
  where user_id = v_user_id;

  delete from public.user_two_factor_recovery_codes where user_id = v_user_id;

  if p_recovery_code_hashes is not null then
    insert into public.user_two_factor_recovery_codes (user_id, code_hash)
    select v_user_id, h
    from unnest(p_recovery_code_hashes) as h
    where h is not null and length(trim(h)) > 0;
  end if;

  perform public.log_two_factor_audit_event(
    'enabled',
    'Two-factor authentication enabled',
    jsonb_build_object('recovery_codes', coalesce(array_length(p_recovery_code_hashes, 1), 0))
  );

  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.disable_two_factor()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._tfa_app_user_id();
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if public.user_requires_two_factor(v_user_id) then
    return jsonb_build_object('ok', false, 'error', 'required_by_policy');
  end if;

  update public.user_two_factor_settings
  set enabled = false, totp_secret_encrypted = null, pending_secret_encrypted = null,
      confirmed_at = null, updated_at = now()
  where user_id = v_user_id;

  delete from public.user_two_factor_recovery_codes where user_id = v_user_id;
  delete from public.two_factor_session_verifications where user_id = v_user_id;

  perform public.log_two_factor_audit_event('disabled', 'Two-factor authentication disabled');

  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.regenerate_two_factor_recovery_codes(
  p_recovery_code_hashes text[]
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._tfa_app_user_id();
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if not exists (
    select 1 from public.user_two_factor_settings where user_id = v_user_id and enabled = true
  ) then
    return jsonb_build_object('ok', false, 'error', 'not_enabled');
  end if;

  delete from public.user_two_factor_recovery_codes where user_id = v_user_id;

  insert into public.user_two_factor_recovery_codes (user_id, code_hash)
  select v_user_id, h
  from unnest(p_recovery_code_hashes) as h
  where h is not null and length(trim(h)) > 0;

  perform public.log_two_factor_audit_event(
    'recovery_codes_regenerated',
    'Two-factor recovery codes regenerated',
    jsonb_build_object('count', coalesce(array_length(p_recovery_code_hashes, 1), 0))
  );

  return jsonb_build_object('ok', true);
end; $$;

-- begin_two_factor_enrollment: secret generated in app layer; stores pending ciphertext
create or replace function public.begin_two_factor_enrollment()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if public._tfa_app_user_id() is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;
  return jsonb_build_object('ok', true, 'message', 'Generate secret in application layer');
end; $$;

-- Grants
grant execute on function public.user_requires_two_factor(uuid) to authenticated;
grant execute on function public.get_two_factor_status(text) to authenticated;
grant execute on function public.begin_two_factor_enrollment() to authenticated;
grant execute on function public.confirm_two_factor_enrollment(text[]) to authenticated;
grant execute on function public.disable_two_factor() to authenticated;
grant execute on function public.regenerate_two_factor_recovery_codes(text[]) to authenticated;
grant execute on function public.create_two_factor_challenge(uuid, text) to authenticated;
grant execute on function public.verify_two_factor_challenge(uuid, text, boolean) to authenticated;
grant execute on function public.mark_session_two_factor_verified(text, int) to authenticated;
grant execute on function public.is_session_two_factor_verified(text, uuid) to authenticated;
grant execute on function public.log_two_factor_audit_event(text, text, jsonb, text, uuid, uuid) to authenticated;
grant execute on function public._tfa_store_pending_enrollment(text) to authenticated;
grant execute on function public._tfa_get_pending_secret_encrypted() to authenticated;
grant execute on function public._tfa_get_active_secret_encrypted() to authenticated;
grant execute on function public._tfa_complete_challenge(uuid, text, text) to authenticated;
grant execute on function public._tfa_record_failed_attempt(uuid, text) to authenticated;
