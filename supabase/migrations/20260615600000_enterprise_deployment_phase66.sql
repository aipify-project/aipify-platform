-- Phase 66 — Enterprise Deployment Architecture, Hybrid Mode & On-Premise Agent

-- ---------------------------------------------------------------------------
-- 1. tenant_deployment_settings
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_deployment_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  deployment_mode text not null default 'cloud_saas' check (
    deployment_mode in ('cloud_saas', 'hybrid', 'on_premise')
  ),
  data_residency_mode text not null default 'cloud' check (
    data_residency_mode in ('cloud', 'local_only', 'hybrid_redacted', 'customer_controlled')
  ),
  connectivity_mode text not null default 'internet' check (
    connectivity_mode in ('internet', 'outbound_only', 'private_network', 'offline_limited')
  ),
  local_agent_required boolean not null default false,
  cloud_sync_allowed boolean not null default true,
  raw_data_cloud_sync_allowed boolean not null default false,
  redaction_required boolean not null default false,
  local_knowledge_enabled boolean not null default false,
  local_memory_enabled boolean not null default false,
  enterprise_governance_enabled boolean not null default false,
  desktop_endpoint_mode text not null default 'cloud' check (
    desktop_endpoint_mode in ('cloud', 'hybrid', 'on_premise')
  ),
  custom_desktop_endpoint_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tenant_deployment_settings enable row level security;
revoke all on public.tenant_deployment_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_agents
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_agents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  agent_name text not null,
  agent_key text not null unique,
  deployment_mode text not null check (deployment_mode in ('hybrid', 'on_premise')),
  status text not null default 'pending' check (
    status in ('pending', 'online', 'offline', 'error', 'disabled')
  ),
  version text,
  host_info jsonb not null default '{}'::jsonb,
  capabilities jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz,
  last_health_check_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_agents_tenant_idx on public.aipify_agents (tenant_id, created_at desc);
create index if not exists aipify_agents_key_idx on public.aipify_agents (agent_key);

alter table public.aipify_agents enable row level security;
revoke all on public.aipify_agents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. agent_jobs
-- ---------------------------------------------------------------------------
create table if not exists public.agent_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  agent_id uuid not null references public.aipify_agents (id) on delete cascade,
  job_type text not null,
  status text not null default 'queued' check (
    status in ('queued', 'claimed', 'running', 'completed', 'failed', 'cancelled', 'expired')
  ),
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  error_message text,
  priority int not null default 0,
  queued_at timestamptz not null default now(),
  claimed_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists agent_jobs_tenant_agent_idx
  on public.agent_jobs (tenant_id, agent_id, status, priority desc, queued_at asc);
create index if not exists agent_jobs_status_idx on public.agent_jobs (status, queued_at asc);

alter table public.agent_jobs enable row level security;
revoke all on public.agent_jobs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. agent_job_results
-- ---------------------------------------------------------------------------
create table if not exists public.agent_job_results (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  agent_id uuid not null references public.aipify_agents (id) on delete cascade,
  job_id uuid not null references public.agent_jobs (id) on delete cascade,
  result_type text not null,
  safe_for_cloud boolean not null default false,
  redacted boolean not null default true,
  result_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists agent_job_results_job_idx on public.agent_job_results (job_id, created_at desc);

alter table public.agent_job_results enable row level security;
revoke all on public.agent_job_results from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. data_residency_policies
-- ---------------------------------------------------------------------------
create table if not exists public.data_residency_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null,
  description text,
  data_category text not null,
  storage_location text not null check (storage_location in ('cloud', 'local', 'hybrid')),
  cloud_sync_allowed boolean not null default false,
  redaction_required boolean not null default true,
  retention_days int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, policy_key)
);

create index if not exists data_residency_policies_tenant_idx on public.data_residency_policies (tenant_id);

alter table public.data_residency_policies enable row level security;
revoke all on public.data_residency_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. enterprise_audit_exports
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_audit_exports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  export_type text not null,
  status text not null default 'queued' check (
    status in ('queued', 'processing', 'completed', 'failed')
  ),
  requested_by_user_id uuid references public.users (id) on delete set null,
  file_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists enterprise_audit_exports_tenant_idx
  on public.enterprise_audit_exports (tenant_id, created_at desc);

alter table public.enterprise_audit_exports enable row level security;
revoke all on public.enterprise_audit_exports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. enterprise_connectors
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_connectors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  connector_key text not null,
  display_name text not null,
  requires_agent boolean not null default false,
  supported_deployment_modes text[] not null default '{}',
  status text not null default 'not_configured' check (
    status in ('not_configured', 'configured', 'connected', 'error', 'disabled')
  ),
  permissions jsonb not null default '{}'::jsonb,
  config_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, connector_key)
);

create index if not exists enterprise_connectors_tenant_idx on public.enterprise_connectors (tenant_id);

alter table public.enterprise_connectors enable row level security;
revoke all on public.enterprise_connectors from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. agent_access_events (audit)
-- ---------------------------------------------------------------------------
create table if not exists public.agent_access_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  agent_id uuid references public.aipify_agents (id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists agent_access_events_tenant_idx
  on public.agent_access_events (tenant_id, created_at desc);

alter table public.agent_access_events enable row level security;
revoke all on public.agent_access_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Skill Store deployment metadata
-- ---------------------------------------------------------------------------
alter table public.skills
  add column if not exists deployment_support text[] not null default '{cloud_saas}'::text[],
  add column if not exists requires_agent boolean not null default false,
  add column if not exists data_residency_behavior text not null default 'cloud';

-- ---------------------------------------------------------------------------
-- 10. Helpers (_ent_)
-- ---------------------------------------------------------------------------
create or replace function public._ent_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ent_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._ent_tenant_plan(p_tenant_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s where s.customer_id = p_tenant_id limit 1;
$$;

create or replace function public._ent_enterprise_allows(p_tenant_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public._ent_tenant_plan(p_tenant_id) = 'enterprise';
$$;

create or replace function public._ent_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._ent_log_agent_event(
  p_tenant_id uuid, p_agent_id uuid, p_event_type text, p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.agent_access_events (tenant_id, agent_id, event_type, metadata)
  values (p_tenant_id, p_agent_id, p_event_type, p_metadata);
  perform public._tacc_log_audit(
    p_tenant_id, 'agent', p_event_type, 'enterprise', 'logged', null, p_metadata
  );
end; $$;

create or replace function public._ent_resolve_agent(p_agent_key text)
returns public.aipify_agents language plpgsql stable security definer set search_path = public as $$
declare v_agent public.aipify_agents;
begin
  select * into v_agent from public.aipify_agents
  where agent_key = p_agent_key and status <> 'disabled';
  if v_agent.id is null then raise exception 'Invalid agent key'; end if;
  return v_agent;
end; $$;

create or replace function public._ent_ensure_deployment_settings(p_tenant_id uuid)
returns public.tenant_deployment_settings language plpgsql security definer set search_path = public as $$
declare v_row public.tenant_deployment_settings;
begin
  insert into public.tenant_deployment_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.tenant_deployment_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ent_seed_residency_policies(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.data_residency_policies (tenant_id, policy_key, description, data_category, storage_location, cloud_sync_allowed, redaction_required)
  values
    (p_tenant_id, 'support_messages', 'Support conversation data', 'support_messages', 'cloud', false, true),
    (p_tenant_id, 'documents', 'Internal documents and files', 'documents', 'local', false, true),
    (p_tenant_id, 'memory', 'Memory Engine observations', 'memory', 'hybrid', false, true),
    (p_tenant_id, 'knowledge', 'Knowledge Center content', 'knowledge', 'hybrid', true, true),
    (p_tenant_id, 'audit_logs', 'Audit and compliance logs', 'audit_logs', 'local', false, false),
    (p_tenant_id, 'quality_reports', 'Quality Guardian scan reports', 'quality_reports', 'hybrid', true, true),
    (p_tenant_id, 'integration_metadata', 'Integration connection metadata', 'integration_metadata', 'cloud', true, false)
  on conflict (tenant_id, policy_key) do nothing;
end; $$;

create or replace function public._ent_seed_connectors(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_connectors (tenant_id, connector_key, display_name, requires_agent, supported_deployment_modes)
  values
    (p_tenant_id, 'sharepoint', 'SharePoint', true, '{hybrid,on_premise}'),
    (p_tenant_id, 'microsoft_365', 'Microsoft 365', true, '{hybrid,on_premise}'),
    (p_tenant_id, 'active_directory', 'Active Directory', true, '{hybrid,on_premise}'),
    (p_tenant_id, 'azure_ad', 'Azure AD / Entra ID', true, '{hybrid,on_premise,cloud_saas}'),
    (p_tenant_id, 'intranet_scanner', 'Internal Intranet Scanner', true, '{hybrid,on_premise}'),
    (p_tenant_id, 'internal_website', 'Internal Website', true, '{hybrid,on_premise}'),
    (p_tenant_id, 'jira', 'Jira', false, '{cloud_saas,hybrid,on_premise}'),
    (p_tenant_id, 'servicenow', 'ServiceNow', true, '{hybrid,on_premise}'),
    (p_tenant_id, 'file_server', 'File Server', true, '{hybrid,on_premise}')
  on conflict (tenant_id, connector_key) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_deployment_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.tenant_deployment_settings;
  v_agents_online int;
  v_jobs_queued int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._ent_ensure_deployment_settings(v_tenant_id);

  select count(*) into v_agents_online from public.aipify_agents
  where tenant_id = v_tenant_id and status = 'online';

  select count(*) into v_jobs_queued from public.agent_jobs
  where tenant_id = v_tenant_id and status in ('queued', 'claimed', 'running');

  return jsonb_build_object(
    'has_customer', true,
    'deployment_mode', v_settings.deployment_mode,
    'data_residency_mode', v_settings.data_residency_mode,
    'local_agent_required', v_settings.local_agent_required,
    'agents_online', v_agents_online,
    'jobs_queued', v_jobs_queued,
    'has_enterprise_access', public._ent_enterprise_allows(v_tenant_id),
    'philosophy', 'Aipify adapts to cloud, hybrid, and on-premise — your data stays where you need it.',
    'privacy_note', 'Raw internal data is never synced to cloud unless explicitly allowed by policy.'
  );
end; $$;

create or replace function public.get_enterprise_deployment_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.tenant_deployment_settings;
  v_agents jsonb;
  v_recent_jobs jsonb;
  v_recent_events jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._ent_ensure_deployment_settings(v_tenant_id);
  perform public._ent_seed_residency_policies(v_tenant_id);
  perform public._ent_seed_connectors(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'agent_name', a.agent_name, 'status', a.status, 'deployment_mode', a.deployment_mode,
    'version', a.version, 'last_seen_at', a.last_seen_at, 'capabilities', a.capabilities
  ) order by a.created_at desc), '[]'::jsonb) into v_agents
  from public.aipify_agents a where a.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', j.id, 'job_type', j.job_type, 'status', j.status, 'agent_id', j.agent_id,
    'queued_at', j.queued_at, 'completed_at', j.completed_at, 'error_message', j.error_message
  ) order by j.queued_at desc), '[]'::jsonb) into v_recent_jobs
  from (select * from public.agent_jobs where tenant_id = v_tenant_id order by queued_at desc limit 10) j;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_type', e.event_type, 'agent_id', e.agent_id, 'metadata', e.metadata, 'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb) into v_recent_events
  from (select * from public.agent_access_events where tenant_id = v_tenant_id order by created_at desc limit 15) e;

  return jsonb_build_object(
    'has_customer', true,
    'has_enterprise_access', public._ent_enterprise_allows(v_tenant_id),
    'upgrade_required', not public._ent_enterprise_allows(v_tenant_id),
    'settings', jsonb_build_object(
      'deployment_mode', v_settings.deployment_mode,
      'data_residency_mode', v_settings.data_residency_mode,
      'connectivity_mode', v_settings.connectivity_mode,
      'local_agent_required', v_settings.local_agent_required,
      'cloud_sync_allowed', v_settings.cloud_sync_allowed,
      'raw_data_cloud_sync_allowed', v_settings.raw_data_cloud_sync_allowed,
      'redaction_required', v_settings.redaction_required,
      'local_knowledge_enabled', v_settings.local_knowledge_enabled,
      'local_memory_enabled', v_settings.local_memory_enabled,
      'enterprise_governance_enabled', v_settings.enterprise_governance_enabled,
      'desktop_endpoint_mode', v_settings.desktop_endpoint_mode,
      'custom_desktop_endpoint_url', v_settings.custom_desktop_endpoint_url
    ),
    'agents', v_agents,
    'recent_jobs', v_recent_jobs,
    'recent_agent_events', v_recent_events
  );
end; $$;

create or replace function public.get_tenant_deployment_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.tenant_deployment_settings;
begin
  v_tenant_id := public._ent_require_tenant();
  v_settings := public._ent_ensure_deployment_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'has_enterprise_access', public._ent_enterprise_allows(v_tenant_id),
    'upgrade_required', not public._ent_enterprise_allows(v_tenant_id),
    'settings', row_to_json(v_settings)::jsonb
  );
end; $$;

create or replace function public.get_data_residency_policies()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_policies jsonb;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_seed_residency_policies(v_tenant_id);
  select coalesce(jsonb_agg(row_to_json(p)::jsonb order by p.data_category), '[]'::jsonb) into v_policies
  from public.data_residency_policies p where p.tenant_id = v_tenant_id;
  return jsonb_build_object('has_customer', true, 'policies', v_policies);
end; $$;

create or replace function public.list_enterprise_connectors()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_connectors jsonb;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_seed_connectors(v_tenant_id);
  select coalesce(jsonb_agg(row_to_json(c)::jsonb order by c.display_name), '[]'::jsonb) into v_connectors
  from public.enterprise_connectors c where c.tenant_id = v_tenant_id;
  return jsonb_build_object('has_customer', true, 'connectors', v_connectors);
end; $$;

create or replace function public.list_aipify_agents()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_agents jsonb;
begin
  v_tenant_id := public._ent_require_tenant();
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'agent_name', a.agent_name, 'deployment_mode', a.deployment_mode,
    'status', a.status, 'version', a.version, 'host_info', a.host_info,
    'capabilities', a.capabilities, 'last_seen_at', a.last_seen_at,
    'last_health_check_at', a.last_health_check_at, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb) into v_agents
  from public.aipify_agents a where a.tenant_id = v_tenant_id;
  return jsonb_build_object('has_customer', true, 'agents', v_agents);
end; $$;

create or replace function public.list_enterprise_audit_exports()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_exports jsonb;
begin
  v_tenant_id := public._ent_require_tenant();
  select coalesce(jsonb_agg(row_to_json(e)::jsonb order by e.created_at desc), '[]'::jsonb) into v_exports
  from public.enterprise_audit_exports e where e.tenant_id = v_tenant_id;
  return jsonb_build_object('has_customer', true, 'exports', v_exports);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Write APIs (admin)
-- ---------------------------------------------------------------------------
create or replace function public.update_tenant_deployment_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_mode text;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_require_admin();

  v_mode := coalesce(p_patch->>'deployment_mode',
    (select deployment_mode from public.tenant_deployment_settings where tenant_id = v_tenant_id));

  if v_mode in ('hybrid', 'on_premise') and not public._ent_enterprise_allows(v_tenant_id) then
    raise exception 'Enterprise plan required for hybrid or on-premise deployment';
  end if;

  perform public._ent_ensure_deployment_settings(v_tenant_id);

  update public.tenant_deployment_settings set
    deployment_mode = coalesce(p_patch->>'deployment_mode', deployment_mode),
    data_residency_mode = coalesce(p_patch->>'data_residency_mode', data_residency_mode),
    connectivity_mode = coalesce(p_patch->>'connectivity_mode', connectivity_mode),
    local_agent_required = coalesce((p_patch->>'local_agent_required')::boolean, local_agent_required),
    cloud_sync_allowed = coalesce((p_patch->>'cloud_sync_allowed')::boolean, cloud_sync_allowed),
    raw_data_cloud_sync_allowed = coalesce((p_patch->>'raw_data_cloud_sync_allowed')::boolean, raw_data_cloud_sync_allowed),
    redaction_required = coalesce((p_patch->>'redaction_required')::boolean, redaction_required),
    local_knowledge_enabled = coalesce((p_patch->>'local_knowledge_enabled')::boolean, local_knowledge_enabled),
    local_memory_enabled = coalesce((p_patch->>'local_memory_enabled')::boolean, local_memory_enabled),
    enterprise_governance_enabled = coalesce((p_patch->>'enterprise_governance_enabled')::boolean, enterprise_governance_enabled),
    desktop_endpoint_mode = coalesce(p_patch->>'desktop_endpoint_mode', desktop_endpoint_mode),
    custom_desktop_endpoint_url = coalesce(p_patch->>'custom_desktop_endpoint_url', custom_desktop_endpoint_url),
    updated_at = now()
  where tenant_id = v_tenant_id;

  -- Auto-set agent requirement for hybrid/on-prem
  if v_mode in ('hybrid', 'on_premise') then
    update public.tenant_deployment_settings set local_agent_required = true where tenant_id = v_tenant_id;
  end if;

  perform public._tacc_log_audit(v_tenant_id, 'admin', 'deployment_settings_updated', 'enterprise', 'success', null, p_patch);
  return public.get_tenant_deployment_settings();
end; $$;

create or replace function public.update_data_residency_policy(p_policy_key text, p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_require_admin();
  if not public._ent_enterprise_allows(v_tenant_id) then raise exception 'Enterprise plan required'; end if;

  update public.data_residency_policies set
    storage_location = coalesce(p_patch->>'storage_location', storage_location),
    cloud_sync_allowed = coalesce((p_patch->>'cloud_sync_allowed')::boolean, cloud_sync_allowed),
    redaction_required = coalesce((p_patch->>'redaction_required')::boolean, redaction_required),
    retention_days = coalesce((p_patch->>'retention_days')::int, retention_days),
    updated_at = now()
  where tenant_id = v_tenant_id and policy_key = p_policy_key;

  perform public._tacc_log_audit(v_tenant_id, 'admin', 'residency_policy_updated', 'enterprise', 'success', null,
    jsonb_build_object('policy_key', p_policy_key) || p_patch);
  return public.get_data_residency_policies();
end; $$;

create or replace function public.register_aipify_agent(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_agent_id uuid;
  v_agent_key text;
  v_mode text;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_require_admin();
  if not public._ent_enterprise_allows(v_tenant_id) then raise exception 'Enterprise plan required'; end if;

  v_mode := coalesce(p_payload->>'deployment_mode', 'hybrid');
  if v_mode not in ('hybrid', 'on_premise') then raise exception 'Invalid agent deployment mode'; end if;

  v_agent_key := encode(gen_random_bytes(32), 'hex');

  insert into public.aipify_agents (tenant_id, agent_name, agent_key, deployment_mode, host_info, capabilities)
  values (
    v_tenant_id,
    coalesce(p_payload->>'agent_name', 'Aipify Agent'),
    v_agent_key,
    v_mode,
    coalesce(p_payload->'host_info', '{}'::jsonb),
    coalesce(p_payload->'capabilities', '{}'::jsonb)
  )
  returning id into v_agent_id;

  perform public._ent_log_agent_event(v_tenant_id, v_agent_id, 'agent_registered', p_payload);

  return jsonb_build_object(
    'agent_id', v_agent_id,
    'agent_key', v_agent_key,
    'agent_name', coalesce(p_payload->>'agent_name', 'Aipify Agent'),
    'deployment_mode', v_mode,
    'status', 'pending'
  );
end; $$;

create or replace function public.disable_aipify_agent(p_agent_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_require_admin();

  update public.aipify_agents set status = 'disabled', updated_at = now()
  where id = p_agent_id and tenant_id = v_tenant_id;

  perform public._ent_log_agent_event(v_tenant_id, p_agent_id, 'agent_disabled', '{}'::jsonb);
  return public.list_aipify_agents();
end; $$;

create or replace function public.queue_agent_job(p_agent_id uuid, p_job_type text, p_payload jsonb default '{}'::jsonb, p_priority int default 0)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_job_id uuid;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_require_admin();

  if not exists (select 1 from public.aipify_agents where id = p_agent_id and tenant_id = v_tenant_id and status <> 'disabled') then
    raise exception 'Agent not found';
  end if;

  insert into public.agent_jobs (tenant_id, agent_id, job_type, payload, priority, expires_at)
  values (v_tenant_id, p_agent_id, p_job_type, coalesce(p_payload, '{}'::jsonb), coalesce(p_priority, 0), now() + interval '24 hours')
  returning id into v_job_id;

  return jsonb_build_object('job_id', v_job_id, 'status', 'queued');
end; $$;

create or replace function public.update_enterprise_connector(p_connector_key text, p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_require_admin();

  perform public._ent_seed_connectors(v_tenant_id);

  update public.enterprise_connectors set
    status = coalesce(p_patch->>'status', status),
    permissions = coalesce(p_patch->'permissions', permissions),
    config_ref = coalesce(p_patch->>'config_ref', config_ref),
    updated_at = now()
  where tenant_id = v_tenant_id and connector_key = p_connector_key;

  return public.list_enterprise_connectors();
end; $$;

create or replace function public.request_enterprise_audit_export(p_export_type text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_export_id uuid;
begin
  v_tenant_id := public._ent_require_tenant();
  perform public._ent_require_admin();
  if not public._ent_enterprise_allows(v_tenant_id) then raise exception 'Enterprise plan required'; end if;

  v_user_id := public._ent_auth_user_id();

  insert into public.enterprise_audit_exports (tenant_id, export_type, requested_by_user_id, status)
  values (v_tenant_id, p_export_type, v_user_id, 'queued')
  returning id into v_export_id;

  perform public._tacc_log_audit(v_tenant_id, 'admin', 'audit_export_requested', 'enterprise', 'queued', null,
    jsonb_build_object('export_id', v_export_id, 'export_type', p_export_type));

  return jsonb_build_object('export_id', v_export_id, 'status', 'queued');
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Agent runtime APIs (agent_key auth)
-- ---------------------------------------------------------------------------
create or replace function public.agent_heartbeat(p_agent_key text, p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_agent public.aipify_agents;
begin
  v_agent := public._ent_resolve_agent(p_agent_key);

  update public.aipify_agents set
    status = 'online',
    version = coalesce(p_payload->>'version', version),
    host_info = coalesce(p_payload->'host_info', host_info),
    capabilities = coalesce(p_payload->'capabilities', capabilities),
    last_seen_at = now(),
    last_health_check_at = now(),
    updated_at = now()
  where id = v_agent.id;

  perform public._ent_log_agent_event(v_agent.tenant_id, v_agent.id, 'heartbeat', p_payload);

  return jsonb_build_object(
    'ok', true,
    'agent_id', v_agent.id,
    'tenant_id', v_agent.tenant_id,
    'deployment_mode', (select deployment_mode from public.tenant_deployment_settings where tenant_id = v_agent.tenant_id)
  );
end; $$;

create or replace function public.agent_claim_jobs(p_agent_key text, p_limit int default 5)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_agent public.aipify_agents; v_jobs jsonb;
begin
  v_agent := public._ent_resolve_agent(p_agent_key);

  update public.agent_jobs set status = 'claimed', claimed_at = now()
  where id in (
    select id from public.agent_jobs
    where tenant_id = v_agent.tenant_id and agent_id = v_agent.id
      and status = 'queued' and (expires_at is null or expires_at > now())
    order by priority desc, queued_at asc
    limit coalesce(p_limit, 5)
    for update skip locked
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', j.id, 'job_type', j.job_type, 'payload', j.payload, 'priority', j.priority, 'queued_at', j.queued_at
  ) order by j.priority desc, j.queued_at asc), '[]'::jsonb) into v_jobs
  from public.agent_jobs j
  where j.tenant_id = v_agent.tenant_id and j.agent_id = v_agent.id and j.status = 'claimed'
    and j.claimed_at >= now() - interval '5 minutes';

  update public.aipify_agents set status = 'online', last_seen_at = now() where id = v_agent.id;

  return jsonb_build_object('jobs', v_jobs);
end; $$;

create or replace function public.agent_complete_job(
  p_agent_key text, p_job_id uuid, p_result jsonb default '{}'::jsonb,
  p_result_type text default 'summary', p_safe_for_cloud boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_agent public.aipify_agents; v_job public.agent_jobs; v_settings public.tenant_deployment_settings;
begin
  v_agent := public._ent_resolve_agent(p_agent_key);

  select * into v_job from public.agent_jobs
  where id = p_job_id and tenant_id = v_agent.tenant_id and agent_id = v_agent.id;

  if v_job.id is null then raise exception 'Job not found'; end if;

  v_settings := public._ent_ensure_deployment_settings(v_agent.tenant_id);

  -- Enforce cloud sync policy
  if p_safe_for_cloud and not v_settings.cloud_sync_allowed then
    p_safe_for_cloud := false;
  end if;
  if p_safe_for_cloud and not v_settings.raw_data_cloud_sync_allowed then
    p_safe_for_cloud := coalesce((p_result->>'redacted')::boolean, true) = false;
  end if;

  update public.agent_jobs set
    status = 'completed', result = coalesce(p_result, '{}'::jsonb), completed_at = now()
  where id = p_job_id;

  insert into public.agent_job_results (tenant_id, agent_id, job_id, result_type, safe_for_cloud, redacted, result_payload)
  values (
    v_agent.tenant_id, v_agent.id, p_job_id, coalesce(p_result_type, 'summary'),
    coalesce(p_safe_for_cloud, false),
    coalesce((p_result->>'redacted')::boolean, true),
    coalesce(p_result, '{}'::jsonb)
  );

  perform public._ent_log_agent_event(v_agent.tenant_id, v_agent.id, 'job_completed',
    jsonb_build_object('job_id', p_job_id, 'job_type', v_job.job_type, 'safe_for_cloud', p_safe_for_cloud));

  return jsonb_build_object('status', 'completed', 'safe_for_cloud', p_safe_for_cloud);
end; $$;

create or replace function public.agent_fail_job(p_agent_key text, p_job_id uuid, p_error_message text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_agent public.aipify_agents;
begin
  v_agent := public._ent_resolve_agent(p_agent_key);

  update public.agent_jobs set
    status = 'failed', error_message = coalesce(p_error_message, 'Unknown error'), completed_at = now()
  where id = p_job_id and tenant_id = v_agent.tenant_id and agent_id = v_agent.id;

  perform public._ent_log_agent_event(v_agent.tenant_id, v_agent.id, 'job_failed',
    jsonb_build_object('job_id', p_job_id, 'error', p_error_message));

  return jsonb_build_object('status', 'failed');
end; $$;

-- ---------------------------------------------------------------------------
-- 14. KC category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'enterprise-deployment', 'Enterprise Deployment', 'Cloud, hybrid, and on-premise deployment.', 'authenticated', 11
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'enterprise-deployment' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 15. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_enterprise_deployment_card() to authenticated;
grant execute on function public.get_enterprise_deployment_dashboard() to authenticated;
grant execute on function public.get_tenant_deployment_settings() to authenticated;
grant execute on function public.get_data_residency_policies() to authenticated;
grant execute on function public.list_enterprise_connectors() to authenticated;
grant execute on function public.list_aipify_agents() to authenticated;
grant execute on function public.list_enterprise_audit_exports() to authenticated;
grant execute on function public.update_tenant_deployment_settings(jsonb) to authenticated;
grant execute on function public.update_data_residency_policy(text, jsonb) to authenticated;
grant execute on function public.register_aipify_agent(jsonb) to authenticated;
grant execute on function public.disable_aipify_agent(uuid) to authenticated;
grant execute on function public.queue_agent_job(uuid, text, jsonb, int) to authenticated;
grant execute on function public.update_enterprise_connector(text, jsonb) to authenticated;
grant execute on function public.request_enterprise_audit_export(text) to authenticated;
grant execute on function public.agent_heartbeat(text, jsonb) to authenticated, anon;
grant execute on function public.agent_claim_jobs(text, int) to authenticated, anon;
grant execute on function public.agent_complete_job(text, uuid, jsonb, text, boolean) to authenticated, anon;
grant execute on function public.agent_fail_job(text, uuid, text) to authenticated, anon;
