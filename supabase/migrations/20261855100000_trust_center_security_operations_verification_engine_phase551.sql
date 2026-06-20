-- Phase 551 — Trust Center, Security Operations & Verification Engine
-- Trust must be visible. Security must be understandable.
-- Feature owner: CUSTOMER APP. Routes: /app/trust, /app/trust/devices, /app/trust/2fa, /app/trust/audit

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_center_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  trust_center_enabled boolean not null default true,
  identity_protection_enabled boolean not null default true,
  device_approval_required boolean not null default true,
  session_monitoring_enabled boolean not null default true,
  companion_governance_enabled boolean not null default true,
  partner_verification_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_trust_center_settings enable row level security;
revoke all on public.organization_trust_center_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Identities & verifications
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_identities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  identity_key text not null,
  display_name text not null,
  identity_type text not null default 'employee' check (
    identity_type in (
      'employee', 'manager', 'executive', 'partner', 'platform_admin',
      'super_admin', 'external_user'
    )
  ),
  role_label text not null default '',
  department_label text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive', 'restricted', 'pending')),
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'review_required', 'failed')
  ),
  two_factor_enabled boolean not null default false,
  last_login_at timestamptz,
  user_id uuid references public.users (id) on delete set null,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  device_count integer not null default 0 check (device_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, identity_key)
);

create index if not exists organization_trust_identities_org_idx
  on public.organization_trust_identities (organization_id, identity_type, status);

alter table public.organization_trust_identities enable row level security;
revoke all on public.organization_trust_identities from authenticated, anon;

create table if not exists public.organization_trust_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  identity_id uuid references public.organization_trust_identities (id) on delete cascade,
  verification_type text not null check (
    verification_type in (
      'email', 'phone', 'two_factor', 'organization', 'document',
      'partner', 'executive', 'domain', 'ownership'
    )
  ),
  title text not null,
  status text not null default 'pending' check (
    status in ('pending', 'verified', 'review_required', 'failed')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  verified_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_trust_verifications_org_idx
  on public.organization_trust_verifications (organization_id, verification_type, status);

alter table public.organization_trust_verifications enable row level security;
revoke all on public.organization_trust_verifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Devices & sessions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_devices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  identity_id uuid references public.organization_trust_identities (id) on delete set null,
  device_key text not null,
  device_name text not null,
  platform_label text not null default '',
  browser_label text not null default '',
  location_label text not null default '',
  approval_status text not null default 'unrecognized' check (
    approval_status in ('trusted', 'unrecognized', 'suspicious', 'blocked')
  ),
  risk_score integer not null default 25 check (risk_score between 0 and 100),
  last_activity_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, device_key)
);

create index if not exists organization_trust_devices_org_idx
  on public.organization_trust_devices (organization_id, approval_status);

alter table public.organization_trust_devices enable row level security;
revoke all on public.organization_trust_devices from authenticated, anon;

create table if not exists public.organization_trust_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  identity_id uuid references public.organization_trust_identities (id) on delete set null,
  device_id uuid references public.organization_trust_devices (id) on delete set null,
  session_key text not null,
  status text not null default 'active' check (status in ('active', 'terminated', 'expired', 'revoked')),
  device_label text not null default '',
  location_label text not null default '',
  ip_label text not null default '',
  auth_method text not null default 'password' check (
    auth_method in ('password', 'two_factor', 'sso', 'recovery', 'device_trust')
  ),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, session_key)
);

create index if not exists organization_trust_sessions_org_idx
  on public.organization_trust_sessions (organization_id, status, started_at desc);

alter table public.organization_trust_sessions enable row level security;
revoke all on public.organization_trust_sessions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Security events, partner/org verification, permissions, compliance
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_security_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'failed_login', 'suspicious_access', 'privilege_escalation', 'mass_change',
      'policy_violation', 'device_risk', 'new_device', 'new_country',
      'permission_change', 'verification_required'
    )
  ),
  severity text not null default 'information' check (
    severity in ('information', 'attention', 'critical')
  ),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  identity_id uuid references public.organization_trust_identities (id) on delete set null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists organization_trust_security_events_org_idx
  on public.organization_trust_security_events (organization_id, created_at desc);

alter table public.organization_trust_security_events enable row level security;
revoke all on public.organization_trust_security_events from authenticated, anon;

create table if not exists public.organization_trust_partner_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_key text not null,
  partner_name text not null,
  identity_verified boolean not null default false,
  business_verified boolean not null default false,
  certification_status text not null default 'pending' check (
    certification_status in ('pending', 'certified', 'review_required', 'expired')
  ),
  agreement_status text not null default 'pending' check (
    agreement_status in ('pending', 'signed', 'expiring', 'expired')
  ),
  tax_confirmed boolean not null default false,
  payout_eligible boolean not null default false,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, partner_key)
);

alter table public.organization_trust_partner_verifications enable row level security;
revoke all on public.organization_trust_partner_verifications from authenticated, anon;

create table if not exists public.organization_trust_org_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  verification_key text not null,
  title text not null,
  verification_type text not null check (
    verification_type in ('company', 'domain', 'ownership', 'legal')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'verified', 'review_required', 'failed')
  ),
  summary text not null default '',
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, verification_key)
);

alter table public.organization_trust_org_verifications enable row level security;
revoke all on public.organization_trust_org_verifications from authenticated, anon;

create table if not exists public.organization_trust_permission_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  identity_id uuid references public.organization_trust_identities (id) on delete cascade,
  permission_scope text not null check (
    permission_scope in ('permissions', 'domains', 'business_packs', 'integrations', 'approvals')
  ),
  access_label text not null,
  access_detail text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists organization_trust_permission_snapshots_org_idx
  on public.organization_trust_permission_snapshots (organization_id, identity_id);

alter table public.organization_trust_permission_snapshots enable row level security;
revoke all on public.organization_trust_permission_snapshots from authenticated, anon;

create table if not exists public.organization_trust_compliance_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  engine_key text not null check (engine_key in ('risk', 'governance', 'quality')),
  title text not null,
  readiness_status text not null default 'in_progress' check (
    readiness_status in ('ready', 'in_progress', 'needs_attention', 'critical')
  ),
  summary text not null default '',
  updated_at timestamptz not null default now(),
  unique (organization_id, engine_key)
);

alter table public.organization_trust_compliance_links enable row level security;
revoke all on public.organization_trust_compliance_links from authenticated, anon;

create table if not exists public.organization_trust_score_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trust_score integer not null default 80 check (trust_score between 0 and 100),
  security_score integer not null default 80 check (security_score between 0 and 100),
  trust_status text not null default 'trusted' check (
    trust_status in ('trusted', 'attention_required', 'action_required', 'restricted')
  ),
  security_status_label text not null default 'healthy' check (
    security_status_label in ('excellent', 'healthy', 'needs_attention', 'critical')
  ),
  two_factor_adoption_pct integer not null default 0 check (two_factor_adoption_pct between 0 and 100),
  verification_coverage_pct integer not null default 0 check (verification_coverage_pct between 0 and 100),
  device_trust_pct integer not null default 0 check (device_trust_pct between 0 and 100),
  summary text not null default '',
  recorded_at timestamptz not null default now()
);

create index if not exists organization_trust_score_snapshots_org_idx
  on public.organization_trust_score_snapshots (organization_id, recorded_at desc);

alter table public.organization_trust_score_snapshots enable row level security;
revoke all on public.organization_trust_score_snapshots from authenticated, anon;

create table if not exists public.organization_trust_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'device_approved', 'device_blocked', 'session_terminated', 'two_factor_enabled',
      'two_factor_disabled', 'verification_completed', 'permission_updated',
      'security_event_created', 'trust_score_updated', 'partner_verification_updated',
      'organization_verification_updated', 'access_review_completed'
    )
  ),
  event_category text not null default 'security' check (
    event_category in (
      'login', 'permission', 'approval', 'execution', 'workflow', 'policy',
      'marketplace', 'companion', 'device', 'verification', 'security'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_trust_center_audit_logs_org_idx
  on public.organization_trust_center_audit_logs (organization_id, created_at desc);

alter table public.organization_trust_center_audit_logs enable row level security;
revoke all on public.organization_trust_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._trust551_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._trust551_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_category text default 'security', p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_trust_center_audit_logs (
    organization_id, actor_user_id, event_type, event_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'security'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._trust551_trust_status(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 85 then 'trusted'
    when p_score >= 70 then 'attention_required'
    when p_score >= 50 then 'action_required'
    else 'restricted'
  end;
$$;

create or replace function public._trust551_security_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'needs_attention'
    else 'critical'
  end;
$$;

create or replace function public._trust551_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_trust_center_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._trust551_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_trust_identities where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_trust_identities (
    organization_id, identity_key, display_name, identity_type, role_label, department_label,
    status, verification_status, two_factor_enabled, last_login_at, device_count
  ) values
    (p_org_id, 'exec_001', 'Executive Owner', 'executive', 'Owner', 'Leadership', 'active', 'verified', true, now() - interval '2 hours', 2),
    (p_org_id, 'mgr_001', 'Operations Manager', 'manager', 'Manager', 'Operations', 'active', 'verified', true, now() - interval '6 hours', 1),
    (p_org_id, 'emp_001', 'Support Specialist', 'employee', 'Support', 'Customer Success', 'active', 'review_required', false, now() - interval '1 day', 1),
    (p_org_id, 'partner_001', 'Growth Partner', 'partner', 'Partner', 'External', 'active', 'pending', false, now() - interval '3 days', 1);

  insert into public.organization_trust_devices (
    organization_id, device_key, device_name, platform_label, browser_label, location_label,
    approval_status, risk_score, last_activity_at
  ) values
    (p_org_id, 'macbook_pro', 'MacBook Pro', 'macOS', 'Safari', 'Bergen, Norway', 'trusted', 8, now() - interval '1 hour'),
    (p_org_id, 'iphone_15', 'iPhone', 'iOS', 'Mobile Safari', 'Bergen, Norway', 'trusted', 12, now() - interval '30 minutes'),
    (p_org_id, 'windows_laptop', 'Windows Laptop', 'Windows', 'Edge', 'Oslo, Norway', 'unrecognized', 42, now() - interval '2 days'),
    (p_org_id, 'android_tablet', 'Android Device', 'Android', 'Chrome', 'Unknown', 'suspicious', 78, now() - interval '5 days');

  insert into public.organization_trust_sessions (
    organization_id, session_key, status, device_label, location_label, ip_label, auth_method, duration_minutes
  ) values
    (p_org_id, 'sess_current_1', 'active', 'MacBook Pro', 'Bergen, Norway', '192.0.2.10', 'two_factor', 45),
    (p_org_id, 'sess_current_2', 'active', 'iPhone', 'Bergen, Norway', '192.0.2.11', 'two_factor', 120),
    (p_org_id, 'sess_past_1', 'terminated', 'Windows Laptop', 'Oslo, Norway', '192.0.2.20', 'password', 180);

  insert into public.organization_trust_verifications (
    organization_id, verification_type, title, status, summary
  ) values
    (p_org_id, 'email', 'Email verification', 'verified', 'Primary organization email verified.'),
    (p_org_id, 'phone', 'Phone verification', 'verified', 'Administrator phone verified.'),
    (p_org_id, 'two_factor', '2FA verification', 'review_required', '2FA adoption below target for all identities.'),
    (p_org_id, 'organization', 'Organization verification', 'verified', 'Company ownership confirmed.'),
    (p_org_id, 'partner', 'Partner verification', 'pending', 'Growth Partner payout verification pending.');

  insert into public.organization_trust_partner_verifications (
    organization_id, partner_key, partner_name, identity_verified, business_verified,
    certification_status, agreement_status, tax_confirmed, payout_eligible
  ) values (
    p_org_id, 'growth_partner_demo', 'Growth Partner Demo', false, false,
    'review_required', 'signed', false, false
  );

  insert into public.organization_trust_org_verifications (
    organization_id, verification_key, title, verification_type, status, summary, verified_at
  ) values
    (p_org_id, 'company_verified', 'Company verification', 'company', 'verified', 'Legal entity confirmed.', now()),
    (p_org_id, 'domain_verified', 'Domain verification', 'domain', 'verified', 'Primary domain ownership verified.', now()),
    (p_org_id, 'ownership_verified', 'Ownership verification', 'ownership', 'review_required', 'Secondary domain pending review.', null);

  insert into public.organization_trust_security_events (
    organization_id, event_type, severity, title, summary
  ) values
    (p_org_id, 'new_device', 'attention', 'New device detected', 'Windows Laptop login from Oslo requires review.'),
    (p_org_id, 'permission_change', 'information', 'Permission updated', 'Support role permissions updated by administrator.'),
    (p_org_id, 'failed_login', 'attention', 'Failed login attempt', 'Three failed login attempts detected for external account.');

  insert into public.organization_trust_compliance_links (
    organization_id, engine_key, title, readiness_status, summary
  ) values
    (p_org_id, 'risk', 'Risk Engine integration', 'in_progress', 'Access reviews and risk controls connected.'),
    (p_org_id, 'governance', 'Governance Engine integration', 'ready', 'Policy registry and approval controls active.'),
    (p_org_id, 'quality', 'Quality Engine integration', 'needs_attention', 'ISO readiness review scheduled.');

  insert into public.organization_trust_permission_snapshots (
    organization_id, permission_scope, access_label, access_detail
  ) values
    (p_org_id, 'permissions', 'Owner · Admin · Support', 'Role-based access across organization workspace.'),
    (p_org_id, 'domains', 'Primary domain · Commerce domain', 'Domain-scoped permissions enforced.'),
    (p_org_id, 'business_packs', 'Operations Pack · Support Pack', 'Licensed Business Pack access mapped.'),
    (p_org_id, 'integrations', 'Calendar · Email connector', 'Connector permissions read-only first.'),
    (p_org_id, 'approvals', 'Sensitive actions · Financial approvals', 'Trust & Action approval rules active.');

  insert into public.organization_trust_score_snapshots (
    organization_id, trust_score, security_score, trust_status, security_status_label,
    two_factor_adoption_pct, verification_coverage_pct, device_trust_pct, summary
  ) values (
    p_org_id, 82, 78, 'trusted', 'healthy', 67, 74, 71,
    'Trust posture is healthy with attention on unrecognized devices and 2FA adoption.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_trust_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
  v_overview jsonb;
  v_identities jsonb;
  v_verifications jsonb;
  v_devices jsonb;
  v_sessions jsonb;
  v_events jsonb;
  v_audit jsonb;
  v_permissions jsonb;
  v_compliance jsonb;
  v_partner jsonb;
  v_org_verify jsonb;
  v_score jsonb;
  v_exec jsonb;
  v_reports jsonb;
  v_advisor jsonb;
  v_governance jsonb;
  v_execution jsonb;
begin
  v_org_id := public._trust551_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  if not public.has_organization_permission('trust_center.view')
     and not public.has_organization_permission('trust_center.manage') then
    raise exception 'Permission denied: trust_center.view';
  end if;

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'trust_score', coalesce((select trust_score from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 80),
    'security_score', coalesce((select security_score from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 80),
    'trust_status', coalesce((select trust_status from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 'trusted'),
    'security_status', coalesce((select security_status_label from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 'healthy'),
    'verification_status', coalesce((select status from public.organization_trust_verifications where organization_id = v_org_id order by updated_at desc limit 1), 'pending'),
    'two_factor_adoption_pct', coalesce((select two_factor_adoption_pct from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 0),
    'device_health_pct', coalesce((select device_trust_pct from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 0),
    'active_sessions', (select count(*) from public.organization_trust_sessions where organization_id = v_org_id and status = 'active'),
    'registered_identities', (select count(*) from public.organization_trust_identities where organization_id = v_org_id),
    'trusted_devices', (select count(*) from public.organization_trust_devices where organization_id = v_org_id and approval_status = 'trusted'),
    'pending_verifications', (select count(*) from public.organization_trust_verifications where organization_id = v_org_id and status in ('pending', 'review_required')),
    'recent_security_events', (select count(*) from public.organization_trust_security_events where organization_id = v_org_id and created_at > now() - interval '7 days')
  ) into v_overview;

  select coalesce(jsonb_agg(to_jsonb(i) order by i.display_name), '[]'::jsonb)
  into v_identities from public.organization_trust_identities i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(v) order by v.updated_at desc), '[]'::jsonb)
  into v_verifications from public.organization_trust_verifications v where v.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(d) order by d.last_activity_at desc), '[]'::jsonb)
  into v_devices from public.organization_trust_devices d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(s) order by s.started_at desc), '[]'::jsonb)
  into v_sessions from public.organization_trust_sessions s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(e) order by e.created_at desc), '[]'::jsonb)
  into v_events from public.organization_trust_security_events e where e.organization_id = v_org_id limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'event_category', a.event_category,
    'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit from public.organization_trust_center_audit_logs a where a.organization_id = v_org_id limit 30;

  select coalesce(jsonb_agg(to_jsonb(p) order by p.permission_scope), '[]'::jsonb)
  into v_permissions from public.organization_trust_permission_snapshots p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(c) order by c.engine_key), '[]'::jsonb)
  into v_compliance from public.organization_trust_compliance_links c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(p) order by p.partner_name), '[]'::jsonb)
  into v_partner from public.organization_trust_partner_verifications p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(o) order by o.verification_type), '[]'::jsonb)
  into v_org_verify from public.organization_trust_org_verifications o where o.organization_id = v_org_id;

  select to_jsonb(s) into v_score
  from public.organization_trust_score_snapshots s
  where s.organization_id = v_org_id order by s.recorded_at desc limit 1;

  v_exec := jsonb_build_object(
    'trust_score', v_overview->'trust_score',
    'security_score', v_overview->'security_score',
    'verification_coverage_pct', coalesce(v_score->'verification_coverage_pct', '0'),
    'audit_events_30d', (select count(*) from public.organization_trust_center_audit_logs where organization_id = v_org_id and created_at > now() - interval '30 days'),
    'critical_risks', (select count(*) from public.organization_trust_security_events where organization_id = v_org_id and severity = 'critical' and not resolved),
    'partner_verification_pending', (select count(*) from public.organization_trust_partner_verifications where organization_id = v_org_id and not payout_eligible)
  );

  v_reports := jsonb_build_object(
    'security_activity', v_overview->'recent_security_events',
    'verification_pending', v_overview->'pending_verifications',
    'two_factor_adoption_pct', v_overview->'two_factor_adoption_pct',
    'device_health_pct', v_overview->'device_health_pct',
    'audit_events_30d', v_exec->'audit_events_30d',
    'compliance_engines', jsonb_array_length(coalesce(v_compliance, '[]'::jsonb))
  );

  v_advisor := jsonb_build_object(
    'principle', 'Trust is earned through visibility. Aipify explains security in clear language — humans decide.',
    'advisor_prompts', jsonb_build_array(
      'Which devices are unverified or suspicious?',
      'Who changed permissions recently?',
      'What verification steps are still pending?',
      'Show recent audit history for sensitive actions.',
      'Review trust status and recommended next steps.'
    ),
    'suspicious_devices', (select count(*) from public.organization_trust_devices where organization_id = v_org_id and approval_status in ('unrecognized', 'suspicious')),
    'unverified_identities', (select count(*) from public.organization_trust_identities where organization_id = v_org_id and verification_status in ('pending', 'review_required'))
  );

  v_governance := jsonb_build_object(
    'companion_verifies', jsonb_build_array(
      'permissions', 'roles', 'domain_access', 'business_pack_access',
      'connector_permissions', 'approval_rules'
    ),
    'never_bypasses', true,
    'identity_protection', jsonb_build_array(
      'two_factor', 'device_approval', 'session_verification', 'risk_detection', 'suspicious_activity_monitoring'
    )
  );

  v_execution := jsonb_build_object(
    'flow', jsonb_build_array(
      'action_requested', 'permissions_verified', 'approvals_verified',
      'execution_approved', 'action_performed', 'audit_logged'
    ),
    'engines', jsonb_build_array('execution_engine', 'automation_engine', 'approvals', 'companion')
  );

  return jsonb_build_object(
    'found', true,
    'section', coalesce(p_section, 'overview'),
    'principle', 'Trust must be visible. Security must be understandable. Organizations should know who did what, when, why, and whether it was authorized.',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', v_overview,
    'identity_engine', jsonb_build_object('identities', v_identities),
    'verification_engine', jsonb_build_object('verifications', v_verifications, 'organization_verifications', v_org_verify),
    'device_trust_center', jsonb_build_object('devices', v_devices),
    'session_management', jsonb_build_object('sessions', v_sessions),
    'security_events', v_events,
    'identity_protection', v_governance->'identity_protection',
    'two_factor_center', jsonb_build_object(
      'adoption_pct', v_overview->'two_factor_adoption_pct',
      'methods', jsonb_build_array('authenticator_apps', 'backup_codes', 'recovery_flow', 'hardware_keys_future'),
      'route', '/app/trust/2fa'
    ),
    'partner_verification', v_partner,
    'organization_verification', v_org_verify,
    'audit_history', v_audit,
    'permission_explorer', jsonb_build_object('snapshots', v_permissions),
    'companion_trust_advisor', v_advisor,
    'compliance_integration', v_compliance,
    'security_score_engine', coalesce(v_score, '{}'::jsonb),
    'platform_governor', v_governance,
    'execution_coordination', v_execution,
    'executive_dashboard', v_exec,
    'reports', v_reports,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'devices', true, 'sessions', true, 'two_factor', true,
      'security_events', true, 'trust_status', true
    ),
    'routes', jsonb_build_object(
      'trust_center', '/app/trust',
      'devices', '/app/trust/devices',
      'two_factor', '/app/trust/2fa',
      'audit', '/app/trust/audit',
      'security_settings', '/app/settings/security',
      'approvals', '/app/approvals'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_trust_center_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_device_id uuid;
  v_session_id uuid;
  v_identity_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._trust551_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if p_action_type = 'approve_device' then
    update public.organization_trust_devices
    set approval_status = 'trusted', risk_score = greatest(0, risk_score - 30), updated_at = now()
    where organization_id = v_org_id and device_key = coalesce(p_payload->>'device_key', '');
    perform public._trust551_log(v_org_id, 'device_approved', 'Device approved and marked trusted.', 'device', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'block_device' then
    update public.organization_trust_devices
    set approval_status = 'blocked', risk_score = 100, updated_at = now()
    where organization_id = v_org_id and device_key = coalesce(p_payload->>'device_key', '');
    perform public._trust551_log(v_org_id, 'device_blocked', 'Device blocked from organization access.', 'device', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'terminate_session' then
    update public.organization_trust_sessions
    set status = 'terminated', ended_at = now(), duration_minutes = greatest(1, extract(epoch from (now() - started_at))::int / 60)
    where organization_id = v_org_id and session_key = coalesce(p_payload->>'session_key', '') and status = 'active';
    perform public._trust551_log(v_org_id, 'session_terminated', 'Session terminated by administrator.', 'security', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'enable_2fa' then
    update public.organization_trust_identities
    set two_factor_enabled = true, updated_at = now()
    where organization_id = v_org_id and identity_key = coalesce(p_payload->>'identity_key', '');
    perform public._trust551_log(v_org_id, 'two_factor_enabled', '2FA enabled for identity.', 'verification', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'disable_2fa' then
    update public.organization_trust_identities
    set two_factor_enabled = false, updated_at = now()
    where organization_id = v_org_id and identity_key = coalesce(p_payload->>'identity_key', '');
    perform public._trust551_log(v_org_id, 'two_factor_disabled', '2FA disabled for identity.', 'verification', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'complete_verification' then
    update public.organization_trust_verifications
    set status = 'verified', verified_at = now(), updated_at = now()
    where organization_id = v_org_id and verification_type = coalesce(p_payload->>'verification_type', '');
    perform public._trust551_log(v_org_id, 'verification_completed', 'Verification marked complete.', 'verification', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'refresh_security_score' then
    insert into public.organization_trust_score_snapshots (
      organization_id, trust_score, security_score, trust_status, security_status_label,
      two_factor_adoption_pct, verification_coverage_pct, device_trust_pct, summary
    )
    select
      v_org_id,
      coalesce((p_payload->>'trust_score')::int, 82),
      coalesce((p_payload->>'security_score')::int, 78),
      public._trust551_trust_status(coalesce((p_payload->>'trust_score')::int, 82)),
      public._trust551_security_label(coalesce((p_payload->>'security_score')::int, 78)),
      coalesce((p_payload->>'two_factor_adoption_pct')::int, 67),
      coalesce((p_payload->>'verification_coverage_pct')::int, 74),
      coalesce((p_payload->>'device_trust_pct')::int, 71),
      coalesce(p_payload->>'summary', 'Security score refreshed.');
    perform public._trust551_log(v_org_id, 'trust_score_updated', 'Trust and security scores refreshed.', 'security', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'create_security_event' then
    insert into public.organization_trust_security_events (
      organization_id, event_type, severity, title, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'event_type', 'policy_violation'),
      coalesce(p_payload->>'severity', 'attention'),
      coalesce(p_payload->>'title', 'Security event recorded'),
      coalesce(p_payload->>'summary', '')
    );
    perform public._trust551_log(v_org_id, 'security_event_created', 'Security event recorded in Trust Center.', 'security', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

create or replace function public.get_organization_trust_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_trust_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'trust_score', v_center->'overview'->'trust_score',
    'trust_status', v_center->'overview'->'trust_status',
    'security_status', v_center->'overview'->'security_status',
    'active_sessions', v_center->'overview'->'active_sessions',
    'pending_verifications', v_center->'overview'->'pending_verifications',
    'trusted_devices', v_center->'overview'->'trusted_devices',
    'recent_events', v_center->'overview'->'recent_security_events',
    'routes', v_center->'routes',
    'mobile_access', v_center->'mobile_access'
  );
end; $$;

create or replace function public.get_companion_trust_advisor_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_trust_center('companion');
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'principle', v_center->'principle',
    'advisor', v_center->'companion_trust_advisor',
    'trust_status', v_center->'overview'->'trust_status',
    'security_score', v_center->'overview'->'security_score',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_trust_center(text) to authenticated;
grant execute on function public.perform_organization_trust_center_action(text, jsonb) to authenticated;
grant execute on function public.get_organization_trust_center_mobile_summary() to authenticated;
grant execute on function public.get_companion_trust_advisor_context(text) to authenticated;
