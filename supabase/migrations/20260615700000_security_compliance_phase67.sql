-- Phase 67 — Security, Compliance & Data Governance Framework

-- ---------------------------------------------------------------------------
-- 1. data_classification_policies
-- ---------------------------------------------------------------------------
create table if not exists public.data_classification_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  classification_key text not null check (
    classification_key in ('public', 'internal', 'confidential', 'sensitive', 'restricted', 'never_store')
  ),
  description text,
  default_retention_days int,
  cloud_sync_allowed boolean not null default false,
  requires_redaction boolean not null default false,
  requires_audit boolean not null default true,
  requires_approval_for_external_use boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, classification_key)
);

alter table public.data_classification_policies enable row level security;
revoke all on public.data_classification_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. access_policies
-- ---------------------------------------------------------------------------
create table if not exists public.access_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null,
  resource_type text not null,
  action_key text not null,
  allowed_roles text[] not null default '{}',
  denied_roles text[] not null default '{}',
  data_classification text,
  requires_approval boolean not null default false,
  audit_required boolean not null default true,
  conditions jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, policy_key)
);

create index if not exists access_policies_tenant_action_idx
  on public.access_policies (tenant_id, action_key, resource_type);

alter table public.access_policies enable row level security;
revoke all on public.access_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. policy_decisions
-- ---------------------------------------------------------------------------
create table if not exists public.policy_decisions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  actor_type text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  action_key text not null,
  resource_type text,
  resource_id text,
  data_classification text,
  decision text not null check (
    decision in ('allowed', 'denied', 'approval_required', 'redaction_required')
  ),
  reason text,
  matched_policy_ids jsonb not null default '[]'::jsonb,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists policy_decisions_tenant_idx
  on public.policy_decisions (tenant_id, created_at desc);

alter table public.policy_decisions enable row level security;
revoke all on public.policy_decisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. privacy_requests
-- ---------------------------------------------------------------------------
create table if not exists public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_type text not null check (
    request_type in ('export', 'delete', 'anonymize', 'correct', 'restrict_processing', 'consent_withdrawal')
  ),
  subject_user_id uuid references public.users (id) on delete set null,
  subject_email text,
  status text not null default 'received' check (
    status in ('received', 'verifying_identity', 'in_progress', 'waiting_approval', 'completed', 'rejected', 'cancelled')
  ),
  verification_status text not null default 'pending',
  requested_by_user_id uuid references public.users (id) on delete set null,
  assigned_user_id uuid references public.users (id) on delete set null,
  summary text,
  result_ref text,
  rejection_reason text,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists privacy_requests_tenant_idx
  on public.privacy_requests (tenant_id, created_at desc);

alter table public.privacy_requests enable row level security;
revoke all on public.privacy_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. retention_policies
-- ---------------------------------------------------------------------------
create table if not exists public.retention_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  data_category text not null,
  retention_days int not null,
  action_on_expiry text not null default 'delete' check (
    action_on_expiry in ('delete', 'anonymize', 'archive', 'review')
  ),
  legal_hold boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, data_category)
);

alter table public.retention_policies enable row level security;
revoke all on public.retention_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. security_incidents
-- ---------------------------------------------------------------------------
create table if not exists public.security_incidents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_type text not null,
  severity text not null check (severity in ('info', 'low', 'medium', 'high', 'critical')),
  title text not null,
  summary text not null,
  affected_resource_type text,
  affected_resource_id text,
  affected_data_classification text,
  actor_type text,
  actor_user_id uuid references public.users (id) on delete set null,
  status text not null default 'open' check (
    status in ('open', 'investigating', 'contained', 'resolved', 'false_positive', 'closed')
  ),
  recommended_action text,
  evidence jsonb not null default '{}'::jsonb,
  assigned_user_id uuid references public.users (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists security_incidents_tenant_idx
  on public.security_incidents (tenant_id, created_at desc);
create index if not exists security_incidents_open_idx
  on public.security_incidents (tenant_id, status) where status in ('open', 'investigating');

alter table public.security_incidents enable row level security;
revoke all on public.security_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. compliance_reports
-- ---------------------------------------------------------------------------
create table if not exists public.compliance_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_type text not null,
  title text not null,
  summary text,
  body text,
  report_payload jsonb not null default '{}'::jsonb,
  status text not null default 'generated',
  generated_by_user_id uuid references public.users (id) on delete set null,
  generated_by text not null default 'aipify',
  created_at timestamptz not null default now()
);

create index if not exists compliance_reports_tenant_idx
  on public.compliance_reports (tenant_id, created_at desc);

alter table public.compliance_reports enable row level security;
revoke all on public.compliance_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. secret_references
-- ---------------------------------------------------------------------------
create table if not exists public.secret_references (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  secret_key text not null,
  provider text not null,
  purpose text not null,
  secret_ref text not null,
  status text not null default 'active' check (
    status in ('active', 'expiring', 'expired', 'revoked', 'rotation_required')
  ),
  last_rotated_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, secret_key)
);

alter table public.secret_references enable row level security;
revoke all on public.secret_references from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. security_audit_events
-- ---------------------------------------------------------------------------
create table if not exists public.security_audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  actor_type text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  resource_type text,
  resource_id text,
  data_classification text,
  result text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists security_audit_events_tenant_idx
  on public.security_audit_events (tenant_id, created_at desc);

alter table public.security_audit_events enable row level security;
revoke all on public.security_audit_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers (_sec_)
-- ---------------------------------------------------------------------------
create or replace function public._sec_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._sec_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._sec_user_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(u.role, 'staff') from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._sec_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public._sec_user_role() not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._sec_log_audit(
  p_tenant_id uuid, p_event_type text, p_actor_type text, p_actor_user_id uuid,
  p_resource_type text default null, p_resource_id text default null,
  p_data_classification text default null, p_result text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.security_audit_events (
    tenant_id, event_type, actor_type, actor_user_id, resource_type, resource_id,
    data_classification, result, metadata
  ) values (
    p_tenant_id, p_event_type, p_actor_type, p_actor_user_id, p_resource_type, p_resource_id,
    p_data_classification, p_result, p_metadata
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, p_actor_type, p_event_type, 'security', coalesce(p_result, 'logged'), null, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._sec_emergency_stop_active(p_tenant_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select is_active from public.aipify_emergency_stop_state where tenant_id = p_tenant_id limit 1),
    false
  );
$$;

create or replace function public._sec_seed_classifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.data_classification_policies (
    tenant_id, classification_key, description, default_retention_days,
    cloud_sync_allowed, requires_redaction, requires_audit, requires_approval_for_external_use
  ) values
    (p_tenant_id, 'public', 'Public-facing content', 365, true, false, false, false),
    (p_tenant_id, 'internal', 'Internal business information', 365, false, false, true, true),
    (p_tenant_id, 'confidential', 'Business-sensitive data', 365, false, true, true, true),
    (p_tenant_id, 'sensitive', 'Personal or sensitive data', 365, false, true, true, true),
    (p_tenant_id, 'restricted', 'Highly protected (tokens, keys)', 2555, false, true, true, true),
    (p_tenant_id, 'never_store', 'Must never be stored', null, false, false, true, true)
  on conflict (tenant_id, classification_key) do nothing;
end; $$;

create or replace function public._sec_seed_retention(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.retention_policies (tenant_id, data_category, retention_days, action_on_expiry)
  values
    (p_tenant_id, 'support_logs', 365, 'anonymize'),
    (p_tenant_id, 'audit_logs', 2555, 'archive'),
    (p_tenant_id, 'knowledge_search_logs', 180, 'delete'),
    (p_tenant_id, 'memory_preferences', 365, 'review'),
    (p_tenant_id, 'agent_job_results', 30, 'delete'),
    (p_tenant_id, 'quality_scan_snapshots', 180, 'delete'),
    (p_tenant_id, 'desktop_notification_history', 90, 'delete'),
    (p_tenant_id, 'briefing_events', 180, 'delete'),
    (p_tenant_id, 'security_incidents', 2555, 'archive'),
    (p_tenant_id, 'secrets_metadata', 365, 'review')
  on conflict (tenant_id, data_category) do nothing;
end; $$;

create or replace function public._sec_seed_access_policies(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.access_policies (tenant_id, policy_key, resource_type, action_key, allowed_roles, denied_roles, data_classification, requires_approval, audit_required)
  values
    (p_tenant_id, 'secrets_read_admin', 'secret', 'read', '{owner,admin,master_admin}', '{}', 'restricted', false, true),
    (p_tenant_id, 'secrets_read_auditor', 'secret', 'read', '{auditor}', '{}', 'restricted', false, true),
    (p_tenant_id, 'support_external_reply', 'support', 'external_reply', '{owner,admin,support}', '{}', 'confidential', true, true),
    (p_tenant_id, 'ai_automation_execute', 'automation', 'execute', '{owner,admin}', '{viewer}', 'internal', true, true),
    (p_tenant_id, 'knowledge_restricted_read', 'knowledge', 'read', '{owner,admin,master_admin}', '{}', 'restricted', true, true),
    (p_tenant_id, 'agent_cloud_sync', 'agent', 'cloud_sync', '{aipify_agent}', '{}', 'confidential', true, true),
    (p_tenant_id, 'privacy_export', 'privacy', 'export', '{owner,admin,auditor}', '{}', 'sensitive', true, true),
    (p_tenant_id, 'privacy_delete', 'privacy', 'delete', '{owner,admin}', '{}', 'sensitive', true, true)
  on conflict (tenant_id, policy_key) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Policy Engine
-- ---------------------------------------------------------------------------
create or replace function public.evaluate_policy(p_request jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_role text;
  v_action text;
  v_resource_type text;
  v_resource_id text;
  v_classification text;
  v_actor_type text;
  v_decision text := 'allowed';
  v_reason text := 'Default allow with audit';
  v_requires_approval boolean := false;
  v_blocked boolean := false;
  v_audit_required boolean := true;
  v_redaction_required boolean := false;
  v_matched jsonb := '[]'::jsonb;
  v_policy public.access_policies;
  v_class_policy public.data_classification_policies;
  v_deployment text;
  v_cloud_sync boolean;
  v_decision_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  v_user_id := public._sec_auth_user_id();
  v_role := public._sec_user_role();
  v_action := coalesce(p_request->>'action_key', '');
  v_resource_type := p_request->>'resource_type';
  v_resource_id := p_request->>'resource_id';
  v_classification := coalesce(p_request->>'data_classification', 'internal');
  v_actor_type := coalesce(p_request->>'actor_type', 'user');

  perform public._sec_seed_classifications(v_tenant_id);
  perform public._sec_seed_access_policies(v_tenant_id);

  if public._sec_emergency_stop_active(v_tenant_id) and v_action not in ('read', 'audit', 'export_audit') then
    return jsonb_build_object(
      'allow', false, 'blocked', true, 'requires_approval', false,
      'reason', 'Emergency Stop is active — new actions are blocked',
      'decision', 'denied', 'audit_required', true
    );
  end if;

  if v_classification = 'never_store' then
    v_decision := 'denied';
    v_blocked := true;
    v_reason := 'Data classified as never_store cannot be processed';
  else
    select * into v_class_policy from public.data_classification_policies
    where tenant_id = v_tenant_id and classification_key = v_classification;

    if v_class_policy.classification_key is not null then
      v_redaction_required := v_class_policy.requires_redaction;
      v_audit_required := v_class_policy.requires_audit;
      if coalesce((p_request->>'external_use')::boolean, false)
         and v_class_policy.requires_approval_for_external_use then
        v_requires_approval := true;
        v_decision := 'approval_required';
        v_reason := 'External use requires approval for this classification';
      end if;
    end if;

    select deployment_mode into v_deployment from public.tenant_deployment_settings where tenant_id = v_tenant_id;
    v_cloud_sync := coalesce((p_request->>'cloud_sync')::boolean, false);
    if v_cloud_sync and v_deployment in ('hybrid', 'on_premise') then
      if not coalesce((select cloud_sync_allowed from public.tenant_deployment_settings where tenant_id = v_tenant_id), false) then
        v_decision := 'denied';
        v_blocked := true;
        v_reason := 'Cloud sync not allowed in current deployment mode';
      elsif v_redaction_required and not coalesce((p_request->>'redacted')::boolean, false) then
        v_decision := 'redaction_required';
        v_reason := 'Redaction required before cloud sync';
      end if;
    end if;

    for v_policy in
      select * from public.access_policies
      where tenant_id = v_tenant_id and enabled = true
        and action_key = v_action
        and (resource_type is null or resource_type = v_resource_type)
    loop
      v_matched := v_matched || jsonb_build_array(v_policy.id::text);
      if v_role = any(v_policy.denied_roles) then
        v_decision := 'denied';
        v_blocked := true;
        v_reason := 'Role denied by access policy: ' || v_policy.policy_key;
        exit;
      end if;
      if cardinality(v_policy.allowed_roles) > 0 and not (v_role = any(v_policy.allowed_roles) or v_actor_type = 'aipify_ai') then
        v_decision := 'denied';
        v_blocked := true;
        v_reason := 'Role not allowed by access policy: ' || v_policy.policy_key;
        exit;
      end if;
      if v_policy.requires_approval then
        v_requires_approval := true;
        if v_decision = 'allowed' then
          v_decision := 'approval_required';
          v_reason := 'Access policy requires approval: ' || v_policy.policy_key;
        end if;
      end if;
    end loop;
  end if;

  insert into public.policy_decisions (
    tenant_id, actor_type, actor_user_id, action_key, resource_type, resource_id,
    data_classification, decision, reason, matched_policy_ids, context
  ) values (
    v_tenant_id, v_actor_type, v_user_id, v_action, v_resource_type, v_resource_id,
    v_classification, v_decision, v_reason, v_matched, p_request
  ) returning id into v_decision_id;

  if v_audit_required then
    perform public._sec_log_audit(
      v_tenant_id, 'policy_evaluated', v_actor_type, v_user_id,
      v_resource_type, v_resource_id, v_classification, v_decision,
      jsonb_build_object('decision_id', v_decision_id, 'action_key', v_action)
    );
  end if;

  return jsonb_build_object(
    'allow', v_decision in ('allowed', 'redaction_required') and not v_blocked,
    'requires_approval', v_requires_approval,
    'blocked', v_blocked,
    'reason', v_reason,
    'decision', v_decision,
    'policy_ids', v_matched,
    'audit_required', v_audit_required,
    'redaction_required', v_redaction_required,
    'decision_id', v_decision_id
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_security_compliance_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_open_incidents int;
  v_critical int;
  v_privacy_pending int;
  v_secrets_expiring int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select count(*) into v_open_incidents from public.security_incidents
  where tenant_id = v_tenant_id and status in ('open', 'investigating');

  select count(*) into v_critical from public.security_incidents
  where tenant_id = v_tenant_id and severity = 'critical' and status in ('open', 'investigating');

  select count(*) into v_privacy_pending from public.privacy_requests
  where tenant_id = v_tenant_id and status not in ('completed', 'rejected', 'cancelled');

  select count(*) into v_secrets_expiring from public.secret_references
  where tenant_id = v_tenant_id and status in ('expiring', 'rotation_required');

  return jsonb_build_object(
    'has_customer', true,
    'open_incidents', v_open_incidents,
    'critical_incidents', v_critical,
    'privacy_pending', v_privacy_pending,
    'secrets_expiring', v_secrets_expiring,
    'emergency_stop_active', public._sec_emergency_stop_active(v_tenant_id),
    'philosophy', 'Before Aipify acts, it asks: Am I allowed to do this?',
    'privacy_note', 'Raw secrets are never stored in normal database tables.'
  );
end; $$;

create or replace function public.get_security_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_incidents jsonb;
  v_events jsonb;
  v_decisions jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  perform public._sec_seed_classifications(v_tenant_id);
  perform public._sec_seed_retention(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'incident_type', i.incident_type, 'severity', i.severity,
    'title', i.title, 'status', i.status, 'created_at', i.created_at
  ) order by i.created_at desc), '[]'::jsonb) into v_incidents
  from (select * from public.security_incidents where tenant_id = v_tenant_id order by created_at desc limit 10) i;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_type', e.event_type, 'actor_type', e.actor_type,
    'result', e.result, 'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb) into v_events
  from (select * from public.security_audit_events where tenant_id = v_tenant_id order by created_at desc limit 15) e;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'action_key', d.action_key, 'decision', d.decision,
    'reason', d.reason, 'created_at', d.created_at
  ) order by d.created_at desc), '[]'::jsonb) into v_decisions
  from (select * from public.policy_decisions where tenant_id = v_tenant_id order by created_at desc limit 10) d;

  return jsonb_build_object(
    'has_customer', true,
    'emergency_stop_active', public._sec_emergency_stop_active(v_tenant_id),
    'open_incidents', (select count(*) from public.security_incidents where tenant_id = v_tenant_id and status in ('open', 'investigating')),
    'critical_incidents', (select count(*) from public.security_incidents where tenant_id = v_tenant_id and severity = 'critical' and status in ('open', 'investigating')),
    'secrets_expiring', (select count(*) from public.secret_references where tenant_id = v_tenant_id and status in ('expiring', 'rotation_required')),
    'recent_incidents', v_incidents,
    'recent_audit_events', v_events,
    'recent_policy_decisions', v_decisions
  );
end; $$;

create or replace function public.get_compliance_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_privacy jsonb; v_retention jsonb; v_reports jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  perform public._sec_seed_retention(v_tenant_id);

  select coalesce(jsonb_agg(row_to_json(p)::jsonb order by p.created_at desc), '[]'::jsonb) into v_privacy
  from (select * from public.privacy_requests where tenant_id = v_tenant_id order by created_at desc limit 10) p;

  select coalesce(jsonb_agg(row_to_json(r)::jsonb order by r.data_category), '[]'::jsonb) into v_retention
  from public.retention_policies r where r.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(row_to_json(c)::jsonb order by c.created_at desc), '[]'::jsonb) into v_reports
  from (select * from public.compliance_reports where tenant_id = v_tenant_id order by created_at desc limit 5) c;

  return jsonb_build_object(
    'has_customer', true,
    'privacy_pending', (select count(*) from public.privacy_requests where tenant_id = v_tenant_id and status not in ('completed', 'rejected', 'cancelled')),
    'retention_policies_count', (select count(*) from public.retention_policies where tenant_id = v_tenant_id and enabled),
    'privacy_requests', v_privacy,
    'retention_policies', v_retention,
    'compliance_reports', v_reports,
    'deployment_mode', (select deployment_mode from public.tenant_deployment_settings where tenant_id = v_tenant_id)
  );
end; $$;

create or replace function public.get_data_governance_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_class jsonb; v_residency jsonb;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_seed_classifications(v_tenant_id);

  select coalesce(jsonb_agg(row_to_json(c)::jsonb order by c.classification_key), '[]'::jsonb) into v_class
  from public.data_classification_policies c where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(row_to_json(d)::jsonb order by d.data_category), '[]'::jsonb) into v_residency
  from public.data_residency_policies d where d.tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'classifications', v_class,
    'residency_policies', v_residency,
    'retention_policies', (select coalesce(jsonb_agg(row_to_json(r)::jsonb), '[]'::jsonb) from public.retention_policies r where r.tenant_id = v_tenant_id)
  );
end; $$;

create or replace function public.list_privacy_requests()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  return jsonb_build_object('has_customer', true, 'requests',
    coalesce((select jsonb_agg(row_to_json(p)::jsonb order by p.created_at desc)
      from public.privacy_requests p where p.tenant_id = v_tenant_id), '[]'::jsonb));
end; $$;

create or replace function public.list_secret_references()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();
  return jsonb_build_object('has_customer', true, 'secrets',
    coalesce((select jsonb_agg(jsonb_build_object(
      'id', s.id, 'secret_key', s.secret_key, 'provider', s.provider, 'purpose', s.purpose,
      'status', s.status, 'last_rotated_at', s.last_rotated_at, 'expires_at', s.expires_at,
      'revoked_at', s.revoked_at, 'created_at', s.created_at
    ) order by s.created_at desc) from public.secret_references s where s.tenant_id = v_tenant_id), '[]'::jsonb));
end; $$;

create or replace function public.list_access_policies()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_seed_access_policies(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'policies',
    coalesce((select jsonb_agg(row_to_json(p)::jsonb order by p.policy_key)
      from public.access_policies p where p.tenant_id = v_tenant_id), '[]'::jsonb));
end; $$;

create or replace function public.list_security_incidents()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  return jsonb_build_object('has_customer', true, 'incidents',
    coalesce((select jsonb_agg(row_to_json(i)::jsonb order by i.created_at desc)
      from public.security_incidents i where i.tenant_id = v_tenant_id), '[]'::jsonb));
end; $$;

create or replace function public.list_compliance_reports()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  return jsonb_build_object('has_customer', true, 'reports',
    coalesce((select jsonb_agg(row_to_json(r)::jsonb order by r.created_at desc)
      from public.compliance_reports r where r.tenant_id = v_tenant_id), '[]'::jsonb));
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Write APIs
-- ---------------------------------------------------------------------------
create or replace function public.create_privacy_request(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();
  v_user_id := public._sec_auth_user_id();

  insert into public.privacy_requests (
    tenant_id, request_type, subject_user_id, subject_email, requested_by_user_id, summary, due_at
  ) values (
    v_tenant_id,
    coalesce(p_payload->>'request_type', 'export'),
    (p_payload->>'subject_user_id')::uuid,
    p_payload->>'subject_email',
    v_user_id,
    p_payload->>'summary',
    now() + interval '30 days'
  ) returning id into v_id;

  perform public._sec_log_audit(v_tenant_id, 'privacy_request_created', 'admin', v_user_id, 'privacy', v_id::text, 'sensitive', 'created', p_payload);
  return jsonb_build_object('id', v_id, 'status', 'received');
end; $$;

create or replace function public.update_privacy_request(p_request_id uuid, p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();

  update public.privacy_requests set
    status = coalesce(p_patch->>'status', status),
    assigned_user_id = coalesce((p_patch->>'assigned_user_id')::uuid, assigned_user_id),
    summary = coalesce(p_patch->>'summary', summary),
    rejection_reason = coalesce(p_patch->>'rejection_reason', rejection_reason),
    completed_at = case when coalesce(p_patch->>'status', status) = 'completed' then now() else completed_at end,
    updated_at = now()
  where id = p_request_id and tenant_id = v_tenant_id;

  return public.list_privacy_requests();
end; $$;

create or replace function public.create_security_incident(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  v_user_id := public._sec_auth_user_id();

  insert into public.security_incidents (
    tenant_id, incident_type, severity, title, summary,
    affected_resource_type, affected_resource_id, affected_data_classification,
    actor_type, actor_user_id, recommended_action, evidence
  ) values (
    v_tenant_id,
    coalesce(p_payload->>'incident_type', 'policy_violation'),
    coalesce(p_payload->>'severity', 'medium'),
    coalesce(p_payload->>'title', 'Security incident'),
    coalesce(p_payload->>'summary', ''),
    p_payload->>'affected_resource_type',
    p_payload->>'affected_resource_id',
    p_payload->>'affected_data_classification',
    coalesce(p_payload->>'actor_type', 'system'),
    v_user_id,
    p_payload->>'recommended_action',
    coalesce(p_payload->'evidence', '{}'::jsonb)
  ) returning id into v_id;

  perform public._sec_log_audit(v_tenant_id, 'security_incident_created', 'system', v_user_id, 'incident', v_id::text, null, 'open', p_payload);
  return jsonb_build_object('id', v_id);
end; $$;

create or replace function public.resolve_security_incident(p_incident_id uuid, p_status text default 'resolved')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();

  update public.security_incidents set
    status = coalesce(p_status, 'resolved'),
    resolved_at = case when coalesce(p_status, 'resolved') in ('resolved', 'closed', 'false_positive') then now() else resolved_at end,
    updated_at = now()
  where id = p_incident_id and tenant_id = v_tenant_id;

  return public.list_security_incidents();
end; $$;

create or replace function public.register_secret_reference(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid; v_ref text;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();
  v_user_id := public._sec_auth_user_id();

  -- Store reference only — raw secret must go to approved vault; we never persist it here
  v_ref := coalesce(p_payload->>'secret_ref', 'vault://' || encode(gen_random_bytes(16), 'hex'));

  insert into public.secret_references (
    tenant_id, secret_key, provider, purpose, secret_ref, expires_at, created_by_user_id
  ) values (
    v_tenant_id,
    coalesce(p_payload->>'secret_key', 'integration_secret'),
    coalesce(p_payload->>'provider', 'custom'),
    coalesce(p_payload->>'purpose', 'integration'),
    v_ref,
    (p_payload->>'expires_at')::timestamptz,
    v_user_id
  ) returning id into v_id;

  perform public._sec_log_audit(v_tenant_id, 'secret_registered', 'admin', v_user_id, 'secret', v_id::text, 'restricted', 'created',
    jsonb_build_object('secret_key', p_payload->>'secret_key', 'provider', p_payload->>'provider'));

  return jsonb_build_object('id', v_id, 'secret_ref', v_ref, 'note', 'Raw secret value is not stored. Use approved vault.');
end; $$;

create or replace function public.rotate_secret_reference(p_secret_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_ref text;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();

  v_ref := 'vault://' || encode(gen_random_bytes(16), 'hex');

  update public.secret_references set
    secret_ref = v_ref,
    status = 'active',
    last_rotated_at = now(),
    updated_at = now()
  where id = p_secret_id and tenant_id = v_tenant_id;

  perform public._sec_log_audit(v_tenant_id, 'secret_rotated', 'admin', public._sec_auth_user_id(), 'secret', p_secret_id::text, 'restricted', 'rotated', '{}'::jsonb);
  return jsonb_build_object('secret_ref', v_ref, 'note', 'New reference generated. Update vault separately.');
end; $$;

create or replace function public.revoke_secret_reference(p_secret_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();

  update public.secret_references set status = 'revoked', revoked_at = now(), updated_at = now()
  where id = p_secret_id and tenant_id = v_tenant_id;

  perform public._sec_log_audit(v_tenant_id, 'secret_revoked', 'admin', public._sec_auth_user_id(), 'secret', p_secret_id::text, 'restricted', 'revoked', '{}'::jsonb);
  return public.list_secret_references();
end; $$;

create or replace function public.generate_compliance_report(p_report_type text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_payload jsonb;
  v_title text;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();
  v_user_id := public._sec_auth_user_id();

  v_title := coalesce(p_report_type, 'security_posture') || ' report';

  v_payload := jsonb_build_object(
    'open_incidents', (select count(*) from public.security_incidents where tenant_id = v_tenant_id and status in ('open', 'investigating')),
    'privacy_pending', (select count(*) from public.privacy_requests where tenant_id = v_tenant_id and status not in ('completed', 'rejected', 'cancelled')),
    'retention_policies', (select count(*) from public.retention_policies where tenant_id = v_tenant_id and enabled),
    'secrets_active', (select count(*) from public.secret_references where tenant_id = v_tenant_id and status = 'active'),
    'deployment_mode', (select deployment_mode from public.tenant_deployment_settings where tenant_id = v_tenant_id),
    'emergency_stop', public._sec_emergency_stop_active(v_tenant_id),
    'generated_at', now()
  );

  insert into public.compliance_reports (tenant_id, report_type, title, summary, report_payload, generated_by_user_id)
  values (
    v_tenant_id, coalesce(p_report_type, 'security_posture'), v_title,
    'Automated compliance summary for tenant.',
    v_payload, v_user_id
  ) returning id into v_id;

  return jsonb_build_object('report_id', v_id, 'payload', v_payload);
end; $$;

create or replace function public.apply_retention_policies()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_applied int := 0;
begin
  v_tenant_id := public._sec_require_tenant();
  perform public._sec_require_admin();
  perform public._sec_seed_retention(v_tenant_id);

  -- V1: log retention run; actual deletion jobs run per-category in future workers
  perform public._sec_log_audit(v_tenant_id, 'retention_policies_applied', 'system', public._sec_auth_user_id(), 'retention', null, 'internal', 'queued', '{}'::jsonb);

  select count(*) into v_applied from public.retention_policies where tenant_id = v_tenant_id and enabled and not legal_hold;

  return jsonb_build_object('policies_checked', v_applied, 'status', 'queued');
end; $$;

create or replace function public.seed_unonight_security_classifications(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._sec_require_tenant());
  perform public._sec_seed_classifications(v_tenant_id);
  perform public._sec_seed_retention(v_tenant_id);
  perform public._sec_seed_access_policies(v_tenant_id);

  insert into public.access_policies (tenant_id, policy_key, resource_type, action_key, allowed_roles, data_classification, requires_approval, audit_required)
  values
    (v_tenant_id, 'unonight_verification_read', 'verification', 'read', '{owner,admin,support}', 'sensitive', true, true),
    (v_tenant_id, 'unonight_moderation_action', 'moderation', 'approve', '{owner,admin}', 'sensitive', true, true),
    (v_tenant_id, 'unonight_member_message', 'support', 'read', '{owner,admin,support}', 'confidential', true, true),
    (v_tenant_id, 'unonight_marketplace_payment', 'commerce', 'read', '{owner,admin}', 'restricted', true, true)
  on conflict (tenant_id, policy_key) do nothing;

  return jsonb_build_object('seeded', true, 'tenant_id', v_tenant_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. KC category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'security-compliance', 'Security & Compliance', 'Data governance, policy engine, and privacy.', 'authenticated', 12
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'security-compliance' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 15. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.evaluate_policy(jsonb) to authenticated;
grant execute on function public.get_security_compliance_card() to authenticated;
grant execute on function public.get_security_dashboard() to authenticated;
grant execute on function public.get_compliance_dashboard() to authenticated;
grant execute on function public.get_data_governance_overview() to authenticated;
grant execute on function public.list_privacy_requests() to authenticated;
grant execute on function public.list_secret_references() to authenticated;
grant execute on function public.list_access_policies() to authenticated;
grant execute on function public.list_security_incidents() to authenticated;
grant execute on function public.list_compliance_reports() to authenticated;
grant execute on function public.create_privacy_request(jsonb) to authenticated;
grant execute on function public.update_privacy_request(uuid, jsonb) to authenticated;
grant execute on function public.create_security_incident(jsonb) to authenticated;
grant execute on function public.resolve_security_incident(uuid, text) to authenticated;
grant execute on function public.register_secret_reference(jsonb) to authenticated;
grant execute on function public.rotate_secret_reference(uuid) to authenticated;
grant execute on function public.revoke_secret_reference(uuid) to authenticated;
grant execute on function public.generate_compliance_report(text) to authenticated;
grant execute on function public.apply_retention_policies() to authenticated;
grant execute on function public.seed_unonight_security_classifications(uuid) to authenticated;
