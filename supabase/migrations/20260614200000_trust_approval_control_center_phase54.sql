-- Phase 54 — Trust, Approval & Control Center (TACC)

-- ---------------------------------------------------------------------------
-- 1. aipify_governance_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_governance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  governance_mode text not null default 'safe' check (
    governance_mode in ('safe', 'balanced', 'autonomous_low_risk', 'enterprise_control')
  ),
  approval_defaults jsonb not null default '{"require_medium_risk": true, "require_high_risk": true}'::jsonb,
  emergency_controls_enabled boolean not null default true,
  explainability_enabled boolean not null default true,
  trust_scoring_enabled boolean not null default true,
  audit_retention_days int not null default 365,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_governance_settings enable row level security;
revoke all on public.aipify_governance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_approval_requests
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_approval_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  title text not null,
  summary text not null,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'blocked')
  ),
  explanation text,
  approval_scope text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'expired', 'cancelled', 'paused')
  ),
  requested_by_ai boolean not null default false,
  requested_by_user_id uuid references public.users (id) on delete set null,
  approved_by_user_id uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  rejection_reason text,
  source_type text not null default 'governance' check (
    source_type in ('governance', 'action_request', 'automation', 'aef_action', 'insight', 'prediction')
  ),
  source_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_approval_requests_tenant_status_idx
  on public.aipify_approval_requests (tenant_id, status, created_at desc);

alter table public.aipify_approval_requests enable row level security;
revoke all on public.aipify_approval_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_action_permissions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_action_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  permission_level text not null default 'approval_required' check (
    permission_level in ('allowed', 'approval_required', 'blocked')
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'blocked')
  ),
  requires_approval boolean not null default true,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, action_key)
);

alter table public.aipify_action_permissions enable row level security;
revoke all on public.aipify_action_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_emergency_stop_state
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_emergency_stop_state (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  enabled boolean not null default false,
  reason text,
  activated_by_user_id uuid references public.users (id) on delete set null,
  activated_at timestamptz,
  auto_resume boolean not null default false,
  resumed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.aipify_emergency_stop_state enable row level security;
revoke all on public.aipify_emergency_stop_state from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_action_audit_timeline
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_action_audit_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  actor_type text not null check (actor_type in ('user', 'aipify', 'system', 'integration')),
  actor_id uuid references public.users (id) on delete set null,
  action text not null,
  action_category text,
  result text,
  explanation_reference uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_action_audit_timeline_tenant_idx
  on public.aipify_action_audit_timeline (tenant_id, created_at desc);

alter table public.aipify_action_audit_timeline enable row level security;
revoke all on public.aipify_action_audit_timeline from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_trust_scores
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_trust_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  automation_id uuid references public.aipify_automations (id) on delete cascade,
  action_key text not null,
  success_count int not null default 0,
  failure_count int not null default 0,
  approval_count int not null default 0,
  override_count int not null default 0,
  escalation_count int not null default 0,
  trust_score numeric(5, 2) not null default 85.00,
  last_calculated_at timestamptz not null default now(),
  unique (tenant_id, action_key, automation_id)
);

create index if not exists aipify_trust_scores_tenant_idx
  on public.aipify_trust_scores (tenant_id, trust_score desc);

alter table public.aipify_trust_scores enable row level security;
revoke all on public.aipify_trust_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. aipify_explainability_records
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_explainability_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_reference text not null,
  explanation text not null,
  evidence jsonb not null default '{}'::jsonb,
  confidence_score numeric(4, 2) not null default 0.75,
  generated_at timestamptz not null default now()
);

create index if not exists aipify_explainability_records_tenant_idx
  on public.aipify_explainability_records (tenant_id, generated_at desc);

alter table public.aipify_explainability_records enable row level security;
revoke all on public.aipify_explainability_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._tacc_tenant_plan(p_tenant_id uuid)
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s where s.customer_id = p_tenant_id limit 1;
$$;

create or replace function public._tacc_package_allows(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public._tacc_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._tacc_user_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._tacc_user_role()
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(u.role, 'staff') from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._tacc_require_admin()
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public._tacc_user_role() not in ('owner', 'admin') then
    raise exception 'Admin access required';
  end if;
end;
$$;

create or replace function public._tacc_log_audit(
  p_tenant_id uuid, p_actor_type text, p_action text,
  p_action_category text default null, p_result text default null,
  p_explanation_reference uuid default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare v_id uuid;
begin
  insert into public.aipify_action_audit_timeline (
    tenant_id, actor_type, actor_id, action, action_category, result,
    explanation_reference, metadata
  )
  values (
    p_tenant_id, p_actor_type,
    case when p_actor_type = 'user' then public._tacc_user_id() else null end,
    p_action, p_action_category, p_result, p_explanation_reference,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.ensure_tacc_governance_settings(p_tenant_id uuid)
returns public.aipify_governance_settings
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_governance_settings;
begin
  insert into public.aipify_governance_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_governance_settings where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public.ensure_tacc_emergency_stop(p_tenant_id uuid)
returns public.aipify_emergency_stop_state
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_emergency_stop_state;
begin
  insert into public.aipify_emergency_stop_state (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_emergency_stop_state where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public.seed_tacc_action_permissions(p_tenant_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.aipify_action_permissions (tenant_id, action_key, permission_level, risk_level, requires_approval)
  values
    (p_tenant_id, 'create_draft', 'allowed', 'low', false),
    (p_tenant_id, 'create_internal_task', 'allowed', 'low', false),
    (p_tenant_id, 'generate_suggestion', 'allowed', 'low', false),
    (p_tenant_id, 'notify_admin', 'allowed', 'low', false),
    (p_tenant_id, 'send_external_email', 'approval_required', 'medium', true),
    (p_tenant_id, 'change_status', 'approval_required', 'medium', true),
    (p_tenant_id, 'activate_automation', 'approval_required', 'medium', true),
    (p_tenant_id, 'publish_content', 'approval_required', 'high', true),
    (p_tenant_id, 'delete_user', 'blocked', 'blocked', true),
    (p_tenant_id, 'modify_billing', 'blocked', 'blocked', true),
    (p_tenant_id, 'legal_decision', 'blocked', 'blocked', true),
    (p_tenant_id, 'hr_action', 'blocked', 'blocked', true),
    (p_tenant_id, 'approve_sensitive_content', 'blocked', 'blocked', true)
  on conflict (tenant_id, action_key) do nothing;
end;
$$;

create or replace function public._tacc_approval_json(p_row public.aipify_approval_requests)
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'id', p_row.id, 'action_type', p_row.action_type, 'title', p_row.title,
    'summary', p_row.summary, 'risk_level', p_row.risk_level,
    'explanation', p_row.explanation, 'approval_scope', p_row.approval_scope,
    'status', p_row.status, 'requested_by_ai', p_row.requested_by_ai,
    'source_type', p_row.source_type, 'source_id', p_row.source_id,
    'expires_at', p_row.expires_at, 'created_at', p_row.created_at
  );
$$;

create or replace function public._tacc_is_emergency_active(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select e.enabled from public.aipify_emergency_stop_state e where e.tenant_id = p_tenant_id),
    false
  )
  or coalesce(
    (select t.state in ('paused', 'emergency_shutdown')
     from public.tenant_action_emergency t where t.tenant_id = p_tenant_id),
    false
  );
$$;

create or replace function public._tacc_check_permission(
  p_tenant_id uuid, p_action_key text
)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_perm public.aipify_action_permissions;
begin
  perform public.seed_tacc_action_permissions(p_tenant_id);
  select * into v_perm from public.aipify_action_permissions
  where tenant_id = p_tenant_id and action_key = p_action_key and enabled = true;
  if not found then
    return jsonb_build_object('allowed', false, 'permission_level', 'approval_required', 'blocked', false);
  end if;
  return jsonb_build_object(
    'allowed', v_perm.permission_level = 'allowed',
    'permission_level', v_perm.permission_level,
    'blocked', v_perm.permission_level = 'blocked',
    'requires_approval', v_perm.requires_approval,
    'risk_level', v_perm.risk_level
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Settings RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_settings()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_governance_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false, 'has_access', false, 'upgrade_required', false);
  end if;

  v_settings := public.ensure_tacc_governance_settings(v_tenant_id);
  perform public.seed_tacc_action_permissions(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', public._tacc_package_allows(v_tenant_id),
    'upgrade_required', not public._tacc_package_allows(v_tenant_id),
    'settings', jsonb_build_object(
      'governance_mode', v_settings.governance_mode,
      'approval_defaults', v_settings.approval_defaults,
      'emergency_controls_enabled', v_settings.emergency_controls_enabled,
      'explainability_enabled', v_settings.explainability_enabled,
      'trust_scoring_enabled', v_settings.trust_scoring_enabled,
      'audit_retention_days', v_settings.audit_retention_days
    )
  );
end;
$$;

create or replace function public.update_governance_settings(p_patch jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_governance_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._tacc_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;
  perform public._tacc_require_admin();

  v_settings := public.ensure_tacc_governance_settings(v_tenant_id);

  update public.aipify_governance_settings set
    governance_mode = coalesce(p_patch->>'governance_mode', governance_mode),
    approval_defaults = coalesce(p_patch->'approval_defaults', approval_defaults),
    emergency_controls_enabled = coalesce((p_patch->>'emergency_controls_enabled')::boolean, emergency_controls_enabled),
    explainability_enabled = coalesce((p_patch->>'explainability_enabled')::boolean, explainability_enabled),
    trust_scoring_enabled = coalesce((p_patch->>'trust_scoring_enabled')::boolean, trust_scoring_enabled),
    audit_retention_days = coalesce((p_patch->>'audit_retention_days')::int, audit_retention_days),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  perform public._tacc_log_audit(v_tenant_id, 'user', 'governance_settings_updated', 'governance', 'success');

  return public.get_governance_settings();
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Governance center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_governance_center()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_governance_settings;
  v_emergency public.aipify_emergency_stop_state;
  v_legacy_emergency public.tenant_action_emergency;
  v_pending int;
  v_blocked int;
  v_avg_trust numeric;
  v_audit_24h int;
  v_approvals jsonb;
  v_audit jsonb;
  v_trust jsonb;
  v_legacy_state text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object(
      'has_customer', false, 'has_access', false, 'upgrade_required', false, 'enabled', false
    );
  end if;

  v_settings := public.ensure_tacc_governance_settings(v_tenant_id);
  v_emergency := public.ensure_tacc_emergency_stop(v_tenant_id);
  perform public.seed_tacc_action_permissions(v_tenant_id);
  select * into v_legacy_emergency from public.tenant_action_emergency where tenant_id = v_tenant_id;
  v_legacy_state := coalesce(v_legacy_emergency.state, 'normal');

  select count(*)::int into v_pending
  from public.aipify_approval_requests
  where tenant_id = v_tenant_id and status = 'pending';

  select count(*)::int into v_blocked
  from public.aipify_action_permissions
  where tenant_id = v_tenant_id and permission_level = 'blocked' and enabled = true;

  select coalesce(avg(trust_score), 0) into v_avg_trust
  from public.aipify_trust_scores where tenant_id = v_tenant_id;

  select count(*)::int into v_audit_24h
  from public.aipify_action_audit_timeline
  where tenant_id = v_tenant_id and created_at >= now() - interval '24 hours';

  select coalesce(jsonb_agg(public._tacc_approval_json(ar) order by ar.created_at desc), '[]'::jsonb)
  into v_approvals
  from (
    select * from public.aipify_approval_requests
    where tenant_id = v_tenant_id and status = 'pending'
    order by created_at desc limit 30
  ) ar;

  -- Aggregate legacy pending action_requests
  v_approvals := v_approvals || coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', r.id, 'action_type', r.action_name, 'title', r.action_name,
      'summary', r.description, 'risk_level',
        case when r.risk_level <= 1 then 'low' when r.risk_level = 2 then 'medium' else 'high' end,
      'explanation', null, 'approval_scope', r.resource_type,
      'status', r.status, 'requested_by_ai', true,
      'source_type', 'action_request', 'source_id', r.id,
      'expires_at', null, 'created_at', r.created_at
    ) order by r.created_at desc)
    from public.action_requests r
    where r.tenant_id = v_tenant_id and r.status = 'pending'
    limit 20
  ), '[]'::jsonb);

  -- Aggregate automation approvals
  v_approvals := v_approvals || coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', aa.id, 'action_type', aa.approval_type, 'title', coalesce(a.name, aa.approval_type),
      'summary', 'Automation approval required', 'risk_level', coalesce(a.risk_level, 'medium'),
      'explanation', null, 'approval_scope', 'automation',
      'status', aa.status, 'requested_by_ai', aa.requested_by_ai,
      'source_type', 'automation', 'source_id', aa.id,
      'expires_at', aa.expires_at, 'created_at', aa.created_at
    ) order by aa.created_at desc)
    from public.aipify_automation_approvals aa
    left join public.aipify_automations a on a.id = aa.automation_id
    where aa.tenant_id = v_tenant_id and aa.status = 'pending'
    limit 20
  ), '[]'::jsonb);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'actor_type', t.actor_type, 'action', t.action,
    'action_category', t.action_category, 'result', t.result,
    'explanation_reference', t.explanation_reference,
    'metadata', t.metadata, 'created_at', t.created_at
  ) order by t.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.aipify_action_audit_timeline
    where tenant_id = v_tenant_id order by created_at desc limit 20
  ) t;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ts.id, 'automation_id', ts.automation_id, 'action_key', ts.action_key,
    'success_count', ts.success_count, 'failure_count', ts.failure_count,
    'approval_count', ts.approval_count, 'trust_score', ts.trust_score,
    'last_calculated_at', ts.last_calculated_at
  ) order by ts.trust_score desc), '[]'::jsonb)
  into v_trust
  from (
    select * from public.aipify_trust_scores
    where tenant_id = v_tenant_id order by trust_score desc limit 10
  ) ts;

  return jsonb_build_object(
    'has_customer', true,
    'has_access', public._tacc_package_allows(v_tenant_id),
    'upgrade_required', not public._tacc_package_allows(v_tenant_id),
    'enabled', true,
    'governance_mode', v_settings.governance_mode,
    'privacy_note', 'Observe → Suggest → Request Approval → Execute → Explain → Audit → Learn.',
    'emergency', jsonb_build_object(
      'enabled', v_emergency.enabled or v_legacy_state in ('paused', 'emergency_shutdown'),
      'reason', coalesce(v_emergency.reason, v_legacy_emergency.reason),
      'activated_at', coalesce(v_emergency.activated_at, v_legacy_emergency.activated_at),
      'state', case when v_emergency.enabled then 'emergency_shutdown' else v_legacy_state end
    ),
    'metrics', jsonb_build_object(
      'pending_approvals', v_pending + (
        select count(*)::int from public.action_requests
        where tenant_id = v_tenant_id and status = 'pending'
      ) + (
        select count(*)::int from public.aipify_automation_approvals
        where tenant_id = v_tenant_id and status = 'pending'
      ),
      'blocked_actions', v_blocked,
      'avg_trust_score', round(v_avg_trust, 1),
      'audit_events_24h', v_audit_24h
    ),
    'pending_approvals', v_approvals,
    'recent_audit', v_audit,
    'trust_scores', v_trust
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Approval resolution
-- ---------------------------------------------------------------------------
create or replace function public.resolve_governance_approval(
  p_approval_id uuid,
  p_status text,
  p_reason text default null,
  p_resolution text default 'once'
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_req public.aipify_approval_requests;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._tacc_require_admin();

  if public._tacc_is_emergency_active(v_tenant_id) and p_status = 'approved' then
    raise exception 'Emergency stop is active — approvals are paused';
  end if;

  -- Try unified approval_requests first
  select * into v_req from public.aipify_approval_requests
  where id = p_approval_id and tenant_id = v_tenant_id;
  if found then
    if v_req.status <> 'pending' then raise exception 'Approval not pending'; end if;

    update public.aipify_approval_requests set
      status = p_status,
      approved_by_user_id = case when p_status = 'approved' then public._tacc_user_id() else approved_by_user_id end,
      approved_at = case when p_status = 'approved' then now() else approved_at end,
      rejection_reason = p_reason,
      updated_at = now()
    where id = p_approval_id;

    if p_resolution = 'always' and p_status = 'approved' then
      update public.aipify_action_permissions set
        permission_level = 'allowed', requires_approval = false, updated_at = now()
      where tenant_id = v_tenant_id and action_key = v_req.action_type;
    elsif p_resolution = 'pause_category' then
      update public.aipify_action_permissions set
        enabled = false, updated_at = now()
      where tenant_id = v_tenant_id and action_key = v_req.action_type;
    end if;

    perform public._tacc_log_audit(
      v_tenant_id, 'user',
      case when p_status = 'approved' then 'approval_granted' else 'approval_rejected' end,
      'approval', p_status,
      null, jsonb_build_object('approval_id', p_approval_id, 'resolution', p_resolution)
    );

    return jsonb_build_object('approval_id', p_approval_id, 'status', p_status);
  end if;

  -- Delegate to automation approval
  if exists (
    select 1 from public.aipify_automation_approvals
    where id = p_approval_id and tenant_id = v_tenant_id
  ) then
    return public.resolve_automation_approval(
      p_approval_id,
      case when p_status = 'approved' then 'approved' else 'rejected' end,
      p_reason
    );
  end if;

  raise exception 'Approval not found';
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Emergency stop
-- ---------------------------------------------------------------------------
create or replace function public.activate_governance_emergency_stop(p_reason text default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._tacc_require_admin();

  update public.aipify_emergency_stop_state set
    enabled = true, reason = p_reason,
    activated_by_user_id = public._tacc_user_id(),
    activated_at = now(), resumed_at = null, updated_at = now()
  where tenant_id = v_tenant_id;

  perform public.set_tenant_emergency_state('emergency_shutdown', coalesce(p_reason, 'Governance emergency stop'));
  perform public._tacc_log_audit(v_tenant_id, 'user', 'emergency_stop_activated', 'emergency', 'success',
    null, jsonb_build_object('reason', p_reason));

  return jsonb_build_object('enabled', true, 'state', 'emergency_shutdown');
end;
$$;

create or replace function public.resume_governance_emergency_stop()
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._tacc_require_admin();

  update public.aipify_emergency_stop_state set
    enabled = false, resumed_at = now(), updated_at = now()
  where tenant_id = v_tenant_id;

  perform public.set_tenant_emergency_state('normal', null);
  perform public._tacc_log_audit(v_tenant_id, 'user', 'emergency_stop_resumed', 'emergency', 'success');

  return jsonb_build_object('enabled', false, 'state', 'normal');
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Audit, trust, explainability, permissions
-- ---------------------------------------------------------------------------
create or replace function public.list_governance_audit_timeline(p_limit int default 50)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', t.id, 'actor_type', t.actor_type, 'action', t.action,
      'action_category', t.action_category, 'result', t.result,
      'explanation_reference', t.explanation_reference,
      'metadata', t.metadata, 'created_at', t.created_at
    ) order by t.created_at desc)
    from (
      select * from public.aipify_action_audit_timeline
      where tenant_id = v_tenant_id order by created_at desc limit p_limit
    ) t
  ), '[]'::jsonb);
end;
$$;

create or replace function public.list_governance_trust_scores()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', ts.id, 'automation_id', ts.automation_id, 'action_key', ts.action_key,
      'success_count', ts.success_count, 'failure_count', ts.failure_count,
      'approval_count', ts.approval_count, 'trust_score', ts.trust_score,
      'last_calculated_at', ts.last_calculated_at
    ) order by ts.trust_score desc)
    from public.aipify_trust_scores ts where ts.tenant_id = v_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.get_governance_explainability(p_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_explainability_records;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;

  select * into v_row from public.aipify_explainability_records
  where id = p_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Explainability record not found'; end if;

  return jsonb_build_object(
    'id', v_row.id, 'action_reference', v_row.action_reference,
    'explanation', v_row.explanation, 'evidence', v_row.evidence,
    'confidence_score', v_row.confidence_score, 'generated_at', v_row.generated_at
  );
end;
$$;

create or replace function public.list_governance_permissions()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;
  perform public.seed_tacc_action_permissions(v_tenant_id);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', p.id, 'action_key', p.action_key, 'permission_level', p.permission_level,
      'risk_level', p.risk_level, 'requires_approval', p.requires_approval, 'enabled', p.enabled
    ) order by p.action_key)
    from public.aipify_action_permissions p where p.tenant_id = v_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.update_governance_permission(
  p_action_key text, p_permission_level text, p_enabled boolean default true
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._tacc_require_admin();
  perform public.seed_tacc_action_permissions(v_tenant_id);

  update public.aipify_action_permissions set
    permission_level = p_permission_level,
    requires_approval = p_permission_level = 'approval_required',
    enabled = p_enabled,
    updated_at = now()
  where tenant_id = v_tenant_id and action_key = p_action_key;

  perform public._tacc_log_audit(v_tenant_id, 'user', 'permission_updated', 'governance', 'success',
    null, jsonb_build_object('action_key', p_action_key, 'permission_level', p_permission_level));

  return public.list_governance_permissions();
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Worker jobs
-- ---------------------------------------------------------------------------
create or replace function public.calculate_tacc_trust_scores(p_tenant_id uuid default null)
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant uuid;
  v_count int := 0;
  r record;
  v_total int;
  v_success int;
  v_fail int;
  v_approvals int;
  v_score numeric;
begin
  for v_tenant in
    select c.id from public.customers c
    where (p_tenant_id is null or c.id = p_tenant_id)
  loop
    if not public._tacc_package_allows(v_tenant) then continue; end if;

    for r in
      select a.id as automation_id, a.automation_key as action_key
      from public.aipify_automations a
      where a.tenant_id = v_tenant and a.status in ('active', 'paused')
    loop
      select count(*)::int,
        count(*) filter (where status in ('success', 'partial_success'))::int,
        count(*) filter (where status = 'failed')::int
      into v_total, v_success, v_fail
      from public.aipify_automation_executions
      where tenant_id = v_tenant and automation_id = r.automation_id;

      select count(*)::int into v_approvals
      from public.aipify_automation_approvals
      where tenant_id = v_tenant and automation_id = r.automation_id and status = 'approved';

      if v_total = 0 then
        v_score := 85;
      else
        v_score := round(
          (v_success::numeric / greatest(v_total, 1)) * 50
          + (v_approvals::numeric / greatest(v_total, 1)) * 30
          + (1 - v_fail::numeric / greatest(v_total, 1)) * 20,
          2
        );
      end if;

      insert into public.aipify_trust_scores (
        tenant_id, automation_id, action_key, success_count, failure_count,
        approval_count, trust_score, last_calculated_at
      )
      values (v_tenant, r.automation_id, r.action_key, v_success, v_fail, v_approvals, v_score, now())
      on conflict (tenant_id, action_key, automation_id) do update set
        success_count = excluded.success_count,
        failure_count = excluded.failure_count,
        approval_count = excluded.approval_count,
        trust_score = excluded.trust_score,
        last_calculated_at = now();

      v_count := v_count + 1;
    end loop;
  end loop;
  return v_count;
end;
$$;

create or replace function public.cleanup_expired_governance_approvals()
returns int
language plpgsql security definer set search_path = public
as $$
declare v_count int;
begin
  update public.aipify_approval_requests set status = 'expired', updated_at = now()
  where status = 'pending' and expires_at is not null and expires_at < now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function public.generate_tacc_explainability_records(p_tenant_id uuid default null)
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant uuid;
  v_count int := 0;
  s record;
begin
  for v_tenant in
    select c.id from public.customers c
    where (p_tenant_id is null or c.id = p_tenant_id)
  loop
    for s in
      select * from public.aipify_automation_suggestions
      where tenant_id = v_tenant and status in ('open', 'reviewing')
      limit 10
    loop
      if not exists (
        select 1 from public.aipify_explainability_records
        where tenant_id = v_tenant and action_reference = s.id::text
      ) then
        insert into public.aipify_explainability_records (
          tenant_id, action_reference, explanation, evidence, confidence_score
        )
        values (
          v_tenant, s.id::text,
          'Aipify suggested this because: ' || s.summary,
          s.evidence, s.confidence_score
        );
        v_count := v_count + 1;
      end if;
    end loop;
  end loop;
  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- 15. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_governance_settings() to authenticated;
grant execute on function public.update_governance_settings(jsonb) to authenticated;
grant execute on function public.get_customer_governance_center() to authenticated;
grant execute on function public.resolve_governance_approval(uuid, text, text, text) to authenticated;
grant execute on function public.activate_governance_emergency_stop(text) to authenticated;
grant execute on function public.resume_governance_emergency_stop() to authenticated;
grant execute on function public.list_governance_audit_timeline(int) to authenticated;
grant execute on function public.list_governance_trust_scores() to authenticated;
grant execute on function public.get_governance_explainability(uuid) to authenticated;
grant execute on function public.list_governance_permissions() to authenticated;
grant execute on function public.update_governance_permission(text, text, boolean) to authenticated;
grant execute on function public._tacc_check_permission(uuid, text) to authenticated;
