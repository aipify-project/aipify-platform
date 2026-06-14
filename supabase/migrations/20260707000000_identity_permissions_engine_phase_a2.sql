-- Phase A.2 — Identity, Roles & Permission Engine
-- Principle: every user, role, permission, and AI action operates within secure boundaries.

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
    'identity_permissions'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Identity account extensions on users
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists account_status text not null default 'active' check (
    account_status in ('pending_verification', 'active', 'suspended', 'locked', 'deleted')
  ),
  add column if not exists email_verified_at timestamptz,
  add column if not exists previous_login_at timestamptz,
  add column if not exists failed_login_count int not null default 0,
  add column if not exists locked_until timestamptz;

-- ---------------------------------------------------------------------------
-- 2. Global permission catalog
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_permissions (
  id uuid primary key default gen_random_uuid(),
  permission_key text not null unique,
  permission_name text not null,
  module_key text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.aipify_permissions enable row level security;
revoke all on public.aipify_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_role_permissions (tenant-customizable)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_role_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role text not null check (
    role in ('owner', 'administrator', 'manager', 'support_agent', 'viewer')
  ),
  permission_key text not null references public.aipify_permissions (permission_key) on delete cascade,
  created_at timestamptz not null default now(),
  unique (organization_id, role, permission_key)
);

create index if not exists organization_role_permissions_org_idx
  on public.organization_role_permissions (organization_id, role);

alter table public.organization_role_permissions enable row level security;
revoke all on public.organization_role_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_user_permissions (user overrides)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_user_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  permission_key text not null references public.aipify_permissions (permission_key) on delete cascade,
  granted boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, permission_key)
);

alter table public.organization_user_permissions enable row level security;
revoke all on public.organization_user_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. identity_approval_requests (spec: approval_requests)
-- ---------------------------------------------------------------------------
create table if not exists public.identity_approval_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  requested_by uuid references public.users (id) on delete set null,
  approved_by uuid references public.users (id) on delete set null,
  action_type text not null,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'expired')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  expires_at timestamptz default (now() + interval '7 days')
);

create index if not exists identity_approval_requests_org_status_idx
  on public.identity_approval_requests (organization_id, status, created_at desc);

alter table public.identity_approval_requests enable row level security;
revoke all on public.identity_approval_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Session security
-- ---------------------------------------------------------------------------
create table if not exists public.identity_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete set null,
  session_token_hash text not null,
  device_label text,
  user_agent text,
  ip_address text,
  last_active_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  revoked_at timestamptz,
  suspicious boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists identity_sessions_user_idx
  on public.identity_sessions (user_id, revoked_at nulls first);

alter table public.identity_sessions enable row level security;
revoke all on public.identity_sessions from authenticated, anon;

create table if not exists public.identity_failed_login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  user_id uuid references public.users (id) on delete set null,
  ip_address text,
  user_agent text,
  attempted_at timestamptz not null default now()
);

create index if not exists identity_failed_login_email_idx
  on public.identity_failed_login_attempts (email, attempted_at desc);

alter table public.identity_failed_login_attempts enable row level security;
revoke all on public.identity_failed_login_attempts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. MFA readiness (architecture only)
-- ---------------------------------------------------------------------------
create table if not exists public.identity_mfa_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  method_type text not null check (
    method_type in ('authenticator', 'email_code', 'sms_code', 'passkey')
  ),
  enabled boolean not null default false,
  enrolled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, method_type)
);

alter table public.identity_mfa_methods enable row level security;
revoke all on public.identity_mfa_methods from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Seed permission catalog
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.name, v.module, v.item_description
from (values
  ('users.view', 'View Users', 'admin_assistant', 'View organization users'),
  ('users.create', 'Invite Users', 'admin_assistant', 'Invite new organization users'),
  ('users.update', 'Update Users', 'admin_assistant', 'Update user roles and settings'),
  ('users.delete', 'Remove Users', 'admin_assistant', 'Remove users from organization'),
  ('modules.view', 'View Modules', 'admin_assistant', 'View enabled modules'),
  ('modules.manage', 'Manage Modules', 'admin_assistant', 'Enable or disable modules'),
  ('support.view', 'View Support', 'support_ai', 'View support cases'),
  ('support.reply', 'Reply to Support', 'support_ai', 'Draft and send support responses'),
  ('support.escalate', 'Escalate Support', 'support_ai', 'Escalate support cases'),
  ('knowledge.view', 'View Knowledge', 'knowledge_center', 'Search Knowledge Center'),
  ('knowledge.create', 'Create Knowledge', 'knowledge_center', 'Create knowledge articles'),
  ('knowledge.update', 'Update Knowledge', 'knowledge_center', 'Update knowledge articles'),
  ('knowledge.publish', 'Publish Knowledge', 'knowledge_center', 'Publish knowledge articles'),
  ('audit.view', 'View Audit Logs', 'audit_log', 'View organization audit history'),
  ('integrations.manage', 'Manage Integrations', 'integrations', 'Connect and manage integrations'),
  ('ai.approve', 'Approve AI Actions', 'admin_assistant', 'Approve AI-suggested actions'),
  ('ai.reject', 'Reject AI Actions', 'admin_assistant', 'Reject AI-suggested actions'),
  ('settings.manage', 'Manage Settings', 'admin_assistant', 'Manage organization settings')
) as v(key, name, module, item_description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 9. Helpers (_irp_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._irp_seed_role_permissions(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_role_permissions (organization_id, role, permission_key)
  select p_organization_id, v.role, v.key
  from (values
    ('owner', 'users.view'), ('owner', 'users.create'), ('owner', 'users.update'), ('owner', 'users.delete'),
    ('owner', 'modules.view'), ('owner', 'modules.manage'),
    ('owner', 'support.view'), ('owner', 'support.reply'), ('owner', 'support.escalate'),
    ('owner', 'knowledge.view'), ('owner', 'knowledge.create'), ('owner', 'knowledge.update'), ('owner', 'knowledge.publish'),
    ('owner', 'audit.view'), ('owner', 'integrations.manage'),
    ('owner', 'ai.approve'), ('owner', 'ai.reject'), ('owner', 'settings.manage'),
    ('administrator', 'users.view'), ('administrator', 'users.create'), ('administrator', 'users.update'),
    ('administrator', 'modules.view'), ('administrator', 'modules.manage'),
    ('administrator', 'support.view'), ('administrator', 'support.reply'), ('administrator', 'support.escalate'),
    ('administrator', 'knowledge.view'), ('administrator', 'knowledge.create'), ('administrator', 'knowledge.update'), ('administrator', 'knowledge.publish'),
    ('administrator', 'audit.view'), ('administrator', 'integrations.manage'),
    ('administrator', 'ai.approve'), ('administrator', 'ai.reject'), ('administrator', 'settings.manage'),
    ('manager', 'users.view'), ('manager', 'modules.view'),
    ('manager', 'support.view'), ('manager', 'support.reply'), ('manager', 'support.escalate'),
    ('manager', 'knowledge.view'), ('manager', 'knowledge.update'),
    ('manager', 'audit.view'), ('manager', 'ai.approve'), ('manager', 'ai.reject'),
    ('support_agent', 'support.view'), ('support_agent', 'support.reply'), ('support_agent', 'knowledge.view'),
    ('viewer', 'users.view'), ('viewer', 'modules.view'), ('viewer', 'support.view'),
    ('viewer', 'knowledge.view'), ('viewer', 'audit.view')
  ) as v(role, key)
  on conflict (organization_id, role, permission_key) do nothing;
end; $$;

create or replace function public._irp_user_account_ok(p_user_id uuid default public._mta_app_user_id())
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_status text;
begin
  select account_status into v_status from public.users where id = p_user_id;
  return coalesce(v_status, 'active') = 'active';
end; $$;

create or replace function public._irp_has_permission(
  p_permission_key text,
  p_organization_id uuid default null
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_membership public.organization_users;
  v_override boolean;
  v_module_key text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then return false; end if;
  if not public._irp_user_account_ok(v_user_id) then return false; end if;

  v_org_id := public._mta_require_organization(p_organization_id);
  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then return false; end if;

  select granted into v_override
  from public.organization_user_permissions
  where organization_id = v_org_id and user_id = v_user_id and permission_key = p_permission_key;
  if found then return v_override; end if;

  if not exists (
    select 1 from public.organization_role_permissions rp
    where rp.organization_id = v_org_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  ) then
    return false;
  end if;

  select module_key into v_module_key from public.aipify_permissions where permission_key = p_permission_key;
  if v_module_key is not null and not exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id and m.module_key = v_module_key and m.enabled = true
  ) then
    return false;
  end if;

  return true;
exception when others then
  return false;
end; $$;

create or replace function public._irp_require_permission(
  p_permission_key text,
  p_organization_id uuid default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public._irp_has_permission(p_permission_key, p_organization_id) then
    raise exception 'Permission denied: %', p_permission_key;
  end if;
end; $$;

create or replace function public._irp_can_approve_risk(
  p_risk_level text,
  p_organization_id uuid default null
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
begin
  v_org_id := public._mta_require_organization(p_organization_id);
  select ou.role into v_role
  from public.organization_users ou
  where ou.organization_id = v_org_id and ou.user_id = public._mta_app_user_id() and ou.status = 'active';

  case p_risk_level
    when 'low' then return v_role in ('owner', 'administrator', 'manager');
    when 'medium' then return v_role in ('owner', 'administrator', 'manager');
    when 'high' then return v_role in ('owner', 'administrator');
    else return false;
  end case;
exception when others then
  return false;
end; $$;

create or replace function public._irp_log_identity_event(
  p_organization_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._mta_create_audit_log(
    p_organization_id, p_action_type, 'identity', null, false, false, null, p_metadata
  );
end; $$;

create or replace function public._irp_seed_org_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_seed_role_permissions(p_organization_id);

  insert into public.identity_approval_requests (
    organization_id, action_type, risk_level, status, metadata, created_at
  )
  select p_organization_id, v.action, v.risk, 'pending', v.meta, now() - v.ago
  from (values
    ('support_response_draft', 'medium', '{"summary":"AI drafted support response awaiting approval"}'::jsonb, interval '2 hours'),
    ('knowledge_article_update', 'medium', '{"summary":"Suggested Knowledge Center article update"}'::jsonb, interval '5 hours')
  ) as v(action, risk, meta, ago)
  where not exists (
    select 1 from public.identity_approval_requests r
    where r.organization_id = p_organization_id and r.action_type = v.action and r.status = 'pending'
  );
end; $$;

-- Backfill role permissions for all organizations
do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._irp_seed_org_data(v_org_id);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_identity_login(p_success boolean default true)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_email text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'Unauthorized'; end if;

  select au.email into v_email from auth.users au where au.id = auth.uid();

  if p_success then
    update public.users set
      previous_login_at = last_login_at,
      last_login_at = now(),
      failed_login_count = 0,
      locked_until = null
    where id = v_user_id;

    begin
      v_org_id := public._mta_require_organization();
      perform public._irp_log_identity_event(v_org_id, 'login', jsonb_build_object('email', v_email));
    exception when others then null;
    end;

    return jsonb_build_object('status', 'ok', 'last_login_at', now());
  else
    update public.users set failed_login_count = failed_login_count + 1
    where id = v_user_id;

    insert into public.identity_failed_login_attempts (email, user_id)
    values (coalesce(v_email, 'unknown'), v_user_id);

    if (select failed_login_count from public.users where id = v_user_id) >= 5 then
      update public.users set account_status = 'locked', locked_until = now() + interval '30 minutes'
      where id = v_user_id;
    end if;

    begin
      v_org_id := public._mta_require_organization();
      perform public._irp_log_identity_event(v_org_id, 'failed_login', jsonb_build_object('email', v_email));
    exception when others then null;
    end;

    return jsonb_build_object('status', 'failed');
  end if;
end; $$;

create or replace function public.invite_organization_user(
  p_email text,
  p_role text default 'viewer'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('users.create');
  v_org_id := public._mta_require_organization();

  perform public._irp_log_identity_event(v_org_id, 'user_invited', jsonb_build_object('email', p_email, 'role', p_role));

  return jsonb_build_object('status', 'invited', 'email', p_email, 'role', p_role);
end; $$;

create or replace function public.update_organization_user_role(
  p_user_id uuid,
  p_role text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('users.update');
  v_org_id := public._mta_require_organization();

  update public.organization_users set role = p_role, updated_at = now()
  where organization_id = v_org_id and user_id = p_user_id;

  perform public._irp_log_identity_event(v_org_id, 'role_changed', jsonb_build_object('user_id', p_user_id, 'role', p_role));

  return jsonb_build_object('status', 'ok', 'user_id', p_user_id, 'role', p_role);
end; $$;

create or replace function public.suspend_organization_user(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('users.update');
  v_org_id := public._mta_require_organization();

  update public.organization_users set status = 'suspended', updated_at = now()
  where organization_id = v_org_id and user_id = p_user_id;

  perform public._irp_log_identity_event(v_org_id, 'user_suspended', jsonb_build_object('user_id', p_user_id));

  return jsonb_build_object('status', 'suspended', 'user_id', p_user_id);
end; $$;

create or replace function public.grant_user_permission(
  p_user_id uuid,
  p_permission_key text,
  p_granted boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('users.update');
  v_org_id := public._mta_require_organization();

  insert into public.organization_user_permissions (organization_id, user_id, permission_key, granted)
  values (v_org_id, p_user_id, p_permission_key, p_granted)
  on conflict (organization_id, user_id, permission_key) do update set granted = excluded.granted;

  perform public._irp_log_identity_event(
    v_org_id,
    case when p_granted then 'permission_granted' else 'permission_removed' end,
    jsonb_build_object('user_id', p_user_id, 'permission_key', p_permission_key)
  );

  return jsonb_build_object('status', 'ok', 'permission_key', p_permission_key, 'granted', p_granted);
end; $$;

create or replace function public.create_identity_approval_request(
  p_action_type text,
  p_risk_level text default 'medium',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.identity_approval_requests (
    organization_id, requested_by, action_type, risk_level, status, metadata
  ) values (
    v_org_id, v_user_id, p_action_type, p_risk_level, 'pending', p_metadata
  ) returning id into v_id;

  perform public._irp_log_identity_event(v_org_id, 'approval_submitted', jsonb_build_object(
    'request_id', v_id, 'action_type', p_action_type, 'risk_level', p_risk_level
  ));

  return jsonb_build_object('id', v_id, 'status', 'pending', 'risk_level', p_risk_level);
end; $$;

create or replace function public.resolve_identity_approval_request(
  p_request_id uuid,
  p_decision text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_req public.identity_approval_requests;
  v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  select * into v_req from public.identity_approval_requests
  where id = p_request_id and organization_id = v_org_id;

  if v_req.id is null then raise exception 'Approval request not found'; end if;
  if v_req.status <> 'pending' then raise exception 'Request already resolved'; end if;

  if p_decision = 'approve' then
    perform public._irp_require_permission('ai.approve');
    if not public._irp_can_approve_risk(v_req.risk_level, v_org_id) then
      raise exception 'Insufficient role to approve % risk action', v_req.risk_level;
    end if;
    update public.identity_approval_requests set
      status = 'approved', approved_by = public._mta_app_user_id(), approved_at = now()
    where id = p_request_id;
    perform public._irp_log_identity_event(v_org_id, 'approval_approved', jsonb_build_object('request_id', p_request_id));
  else
    perform public._irp_require_permission('ai.reject');
    update public.identity_approval_requests set
      status = 'rejected', approved_by = public._mta_app_user_id(), approved_at = now()
    where id = p_request_id;
    perform public._irp_log_identity_event(v_org_id, 'approval_rejected', jsonb_build_object('request_id', p_request_id));
  end if;

  return jsonb_build_object(
    'id', p_request_id,
    'status', case when p_decision = 'approve' then 'approved' else 'rejected' end
  );
end; $$;

create or replace function public.get_identity_permissions_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_membership public.organization_users;
  v_role text;
begin
  v_org_id := public._mta_require_organization();
  v_membership := public._mta_membership_active(v_org_id);
  v_role := v_membership.role;

  perform public._irp_seed_role_permissions(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Every user, role, permission, and AI action operates within secure boundaries.',
    'safety_note', 'Only low-risk AI actions may execute automatically. Medium and high-risk actions require human approval.',
    'current_role', v_role,
    'active_users', (
      select count(*) from public.organization_users ou
      where ou.organization_id = v_org_id and ou.status = 'active'
    ),
    'pending_invitations', (
      select count(*) from public.organization_users ou
      where ou.organization_id = v_org_id and ou.status = 'invited'
    ),
    'pending_approvals', (
      select count(*) from public.identity_approval_requests r
      where r.organization_id = v_org_id and r.status = 'pending'
    ),
    'suspended_users', (
      select count(*) from public.organization_users ou
      where ou.organization_id = v_org_id and ou.status = 'suspended'
    ),
    'role_distribution', coalesce((
      select jsonb_agg(jsonb_build_object('role', ou.role, 'count', cnt) order by ou.role)
      from (
        select role, count(*) as cnt
        from public.organization_users
        where organization_id = v_org_id and status = 'active'
        group by role
      ) ou
    ), '[]'::jsonb),
    'approval_requests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'action_type', r.action_type, 'risk_level', r.risk_level,
        'status', r.status, 'metadata', r.metadata, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.identity_approval_requests r
      where r.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'recent_access_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_type', l.action_type, 'actor_role', l.actor_role,
        'created_at', l.created_at, 'metadata', l.metadata
      ) order by l.created_at desc)
      from public.organization_audit_logs l
      where l.organization_id = v_org_id
        and l.action_type in (
          'login', 'failed_login', 'logout', 'role_changed', 'permission_granted',
          'permission_removed', 'approval_submitted', 'approval_approved', 'approval_rejected',
          'user_invited', 'user_suspended'
        )
      limit 10
    ), '[]'::jsonb),
    'user_permissions', coalesce((
      select jsonb_agg(rp.permission_key order by rp.permission_key)
      from public.organization_role_permissions rp
      where rp.organization_id = v_org_id and rp.role = v_role
    ), '[]'::jsonb),
    'ai_risk_classification', jsonb_build_array(
      jsonb_build_object('level', 'low', 'examples', jsonb_build_array('FAQ suggestions', 'draft recommendations'), 'auto_execute', true),
      jsonb_build_object('level', 'medium', 'examples', jsonb_build_array('support responses', 'knowledge updates', 'workflow changes'), 'auto_execute', false),
      jsonb_build_object('level', 'high', 'examples', jsonb_build_array('billing changes', 'permission changes', 'destructive actions', 'integration removal'), 'auto_execute', false)
    ),
    'mfa_readiness', jsonb_build_array(
      jsonb_build_object('method', 'authenticator', 'status', 'ready'),
      jsonb_build_object('method', 'email_code', 'status', 'ready'),
      jsonb_build_object('method', 'sms_code', 'status', 'planned'),
      jsonb_build_object('method', 'passkey', 'status', 'planned')
    ),
    'can_approve_low', public._irp_can_approve_risk('low', v_org_id),
    'can_approve_medium', public._irp_can_approve_risk('medium', v_org_id),
    'can_approve_high', public._irp_can_approve_risk('high', v_org_id)
  );
end; $$;

create or replace function public.get_identity_permissions_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_users', (select count(*) from public.organization_users where organization_id = v_org_id and status = 'active'),
    'pending_approvals', (select count(*) from public.identity_approval_requests where organization_id = v_org_id and status = 'pending'),
    'philosophy', 'Secure identity and access management for every organization.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.check_identity_permission(p_permission_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object('permission_key', p_permission_key, 'granted', public._irp_has_permission(p_permission_key));
end; $$;

create or replace function public.list_identity_sessions()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', s.id, 'device_label', s.device_label, 'last_active_at', s.last_active_at,
      'expires_at', s.expires_at, 'suspicious', s.suspicious, 'revoked_at', s.revoked_at
    ) order by s.last_active_at desc)
    from public.identity_sessions s
    where s.user_id = v_user_id and s.revoked_at is null
  ), '[]'::jsonb);
end; $$;

create or replace function public.revoke_identity_sessions(p_all boolean default false, p_session_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user_id uuid; v_count int;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'Unauthorized'; end if;

  if p_all then
    update public.identity_sessions set revoked_at = now()
    where user_id = v_user_id and revoked_at is null;
    get diagnostics v_count = row_count;
  elsif p_session_id is not null then
    update public.identity_sessions set revoked_at = now()
    where id = p_session_id and user_id = v_user_id and revoked_at is null;
    get diagnostics v_count = row_count;
  else
    v_count := 0;
  end if;

  begin
    perform public._irp_log_identity_event(
      public._mta_require_organization(), 'logout',
      jsonb_build_object('sessions_revoked', v_count, 'all_devices', p_all)
    );
  exception when others then null;
  end;

  return jsonb_build_object('revoked', v_count);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'identity-permissions', 'Identity & Permissions', 'Roles, permissions, approvals, and secure access management.', 'authenticated', 52
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'identity-permissions' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 12. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.record_identity_login(boolean) to authenticated;
grant execute on function public.invite_organization_user(text, text) to authenticated;
grant execute on function public.update_organization_user_role(uuid, text) to authenticated;
grant execute on function public.suspend_organization_user(uuid) to authenticated;
grant execute on function public.grant_user_permission(uuid, text, boolean) to authenticated;
grant execute on function public.create_identity_approval_request(text, text, jsonb) to authenticated;
grant execute on function public.resolve_identity_approval_request(uuid, text) to authenticated;
grant execute on function public.get_identity_permissions_dashboard() to authenticated;
grant execute on function public.get_identity_permissions_card() to authenticated;
grant execute on function public.check_identity_permission(text) to authenticated;
grant execute on function public.list_identity_sessions() to authenticated;
grant execute on function public.revoke_identity_sessions(boolean, uuid) to authenticated;
