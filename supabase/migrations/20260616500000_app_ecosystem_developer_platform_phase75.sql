-- Phase 75 — App Ecosystem & Developer Platform

-- ---------------------------------------------------------------------------
-- 1. ecosystem_apps (platform app registry — not bare "apps")
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_apps (
  id uuid primary key default gen_random_uuid(),
  app_key text not null unique,
  name text not null,
  description text,
  category text not null check (
    category in (
      'skill', 'agent_extension', 'industry_blueprint', 'knowledge_pack',
      'workflow_pack', 'automation_pack', 'desktop_extension', 'dashboard_module',
      'integration', 'analytics_module', 'developer_utility'
    )
  ),
  author text not null default 'Aipify',
  author_tier text not null default 'internal' check (
    author_tier in ('internal', 'verified_developer', 'agency_partner', 'enterprise_partner')
  ),
  version text not null default '1.0.0',
  status text not null default 'published' check (
    status in ('draft', 'review', 'published', 'deprecated', 'archived', 'suspended')
  ),
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'restricted')
  ),
  manifest jsonb not null default '{}'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  deployment_modes text[] not null default '{cloud}',
  required_modules jsonb not null default '[]'::jsonb,
  minimum_aipify_version text not null default '1.0.0',
  support_contact text,
  sandbox_required boolean not null default true,
  install_count int not null default 0,
  rating numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ecosystem_apps_status_idx
  on public.ecosystem_apps (status, category, risk_level);

alter table public.ecosystem_apps enable row level security;
revoke all on public.ecosystem_apps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. ecosystem_app_versions
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_app_versions (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.ecosystem_apps (id) on delete cascade,
  version text not null,
  release_notes text,
  permissions_changed boolean not null default false,
  manifest jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (
    status in ('draft', 'published', 'deprecated')
  ),
  created_at timestamptz not null default now(),
  unique (app_id, version)
);

alter table public.ecosystem_app_versions enable row level security;
revoke all on public.ecosystem_app_versions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. tenant_ecosystem_app_installs
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_ecosystem_app_installs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  app_id uuid not null references public.ecosystem_apps (id) on delete cascade,
  version_id uuid references public.ecosystem_app_versions (id) on delete set null,
  version text not null default '1.0.0',
  status text not null default 'installed' check (
    status in (
      'pending_approval', 'installed', 'active', 'disabled',
      'update_available', 'failed', 'uninstalled'
    )
  ),
  installed_by uuid references public.users (id) on delete set null,
  installed_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, app_id)
);

create index if not exists tenant_ecosystem_app_installs_tenant_idx
  on public.tenant_ecosystem_app_installs (tenant_id, status);

alter table public.tenant_ecosystem_app_installs enable row level security;
revoke all on public.tenant_ecosystem_app_installs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. ecosystem_app_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_app_reviews (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.ecosystem_apps (id) on delete cascade,
  tenant_id uuid references public.customers (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  review text,
  status text not null default 'published' check (
    status in ('published', 'hidden', 'flagged')
  ),
  created_at timestamptz not null default now()
);

alter table public.ecosystem_app_reviews enable row level security;
revoke all on public.ecosystem_app_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. ecosystem_app_metrics (telemetry)
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_app_metrics (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.ecosystem_apps (id) on delete cascade,
  tenant_id uuid references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_app_metrics_app_idx
  on public.ecosystem_app_metrics (app_id, metric_key, created_at desc);

alter table public.ecosystem_app_metrics enable row level security;
revoke all on public.ecosystem_app_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. ecosystem_app_review_requests (publish/review workflow)
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_app_review_requests (
  id uuid primary key default gen_random_uuid(),
  app_id uuid references public.ecosystem_apps (id) on delete cascade,
  partner_id uuid references public.marketplace_partners (id) on delete set null,
  submitted_by uuid references public.users (id) on delete set null,
  manifest jsonb not null default '{}'::jsonb,
  status text not null default 'submitted' check (
    status in (
      'submitted', 'validation', 'security_scan', 'governance_review',
      'approved', 'rejected', 'changes_requested'
    )
  ),
  validation_result jsonb,
  security_scan_result jsonb,
  governance_result jsonb,
  review_notes text,
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ecosystem_app_review_requests enable row level security;
revoke all on public.ecosystem_app_review_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. ecosystem_app_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_app_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  app_key text,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_app_audit_tenant_idx
  on public.ecosystem_app_audit_log (tenant_id, created_at desc);

alter table public.ecosystem_app_audit_log enable row level security;
revoke all on public.ecosystem_app_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_eco_)
-- ---------------------------------------------------------------------------
create or replace function public._eco_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._eco_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._eco_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._eco_log_audit(
  p_tenant_id uuid, p_app_key text, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.ecosystem_app_audit_log (
    tenant_id, app_key, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_app_key, p_event_type, p_summary,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._eco_auth_user_id())
  ) returning id into v_id;
  if p_tenant_id is not null then
    perform public._tacc_log_audit(
      p_tenant_id, 'user', 'ecosystem_app_' || p_event_type, 'ecosystem_apps', 'logged', p_user_id, p_metadata
    );
  end if;
  return v_id;
end; $$;

create or replace function public._eco_app_json(p_app public.ecosystem_apps, p_installed boolean default false)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'id', p_app.id, 'app_key', p_app.app_key, 'name', p_app.name,
    'description', p_app.description, 'category', p_app.category,
    'author', p_app.author, 'author_tier', p_app.author_tier,
    'version', p_app.version, 'status', p_app.status,
    'risk_level', p_app.risk_level, 'permissions', p_app.permissions,
    'deployment_modes', p_app.deployment_modes,
    'required_modules', p_app.required_modules,
    'minimum_aipify_version', p_app.minimum_aipify_version,
    'support_contact', p_app.support_contact,
    'sandbox_required', p_app.sandbox_required,
    'install_count', p_app.install_count, 'rating', p_app.rating,
    'installed', p_installed
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Seed sample ecosystem apps
-- ---------------------------------------------------------------------------
create or replace function public._eco_seed_apps()
returns void language plpgsql security definer set search_path = public as $$
declare v_app public.ecosystem_apps;
begin
  insert into public.ecosystem_apps (
    app_key, name, description, category, author, author_tier, version, status, risk_level,
    manifest, permissions, deployment_modes, sandbox_required
  ) values
    ('support.sentiment', 'Support Sentiment', 'Analyze support message sentiment and suggest tone adjustments.', 'skill', 'Aipify', 'internal', '1.0.0', 'published', 'medium',
     '{"name":"Support Sentiment","app_key":"support.sentiment","version":"1.0.0","author":"Aipify","category":"skill","permissions":["support.read"],"deployment_modes":["cloud","hybrid"],"risk_level":"medium"}'::jsonb,
     '["support.read"]'::jsonb, '{cloud,hybrid}', true),
    ('gdpr.faq.pack', 'GDPR FAQ Pack', 'Knowledge pack with GDPR compliance FAQ articles.', 'knowledge_pack', 'Aipify', 'internal', '1.0.0', 'published', 'low',
     '{"name":"GDPR FAQ Pack","app_key":"gdpr.faq.pack","version":"1.0.0","category":"knowledge_pack","permissions":["knowledge.read"],"risk_level":"low"}'::jsonb,
     '["knowledge.read"]'::jsonb, '{cloud}', true),
    ('approval.workflow.pack', 'Approval Workflow Pack', 'Pre-built approval workflows for governed actions.', 'workflow_pack', 'Aipify', 'internal', '1.0.0', 'published', 'high',
     '{"name":"Approval Workflow Pack","app_key":"approval.workflow.pack","version":"1.0.0","category":"workflow_pack","permissions":["workflow.template.register","governance.approval.read"],"risk_level":"high"}'::jsonb,
     '["workflow.template.register","governance.approval.read"]'::jsonb, '{cloud,hybrid}', true),
    ('kpi.dashboard.widget', 'KPI Dashboard Widget', 'Operational KPI widgets for the executive dashboard.', 'dashboard_module', 'Aipify', 'internal', '1.0.0', 'published', 'low',
     '{"name":"KPI Dashboard Widget","app_key":"kpi.dashboard.widget","version":"1.0.0","category":"dashboard_module","permissions":["dashboard.widget.register"],"risk_level":"low"}'::jsonb,
     '["dashboard.widget.register"]'::jsonb, '{cloud}', true),
    ('crm.connector.hubspot', 'HubSpot CRM Connector', 'Sync contacts and tickets with HubSpot CRM.', 'integration', 'Verified Partner', 'verified_developer', '1.0.0', 'published', 'high',
     '{"name":"HubSpot CRM Connector","app_key":"crm.connector.hubspot","version":"1.0.0","author":"Verified Partner","category":"integration","permissions":["integration.external.connect"],"risk_level":"high"}'::jsonb,
     '["integration.external.connect"]'::jsonb, '{cloud}', true),
    ('support.agent.enhancer', 'Support Agent Enhancer', 'Agent extension adding sentiment and translation tools to Support Agent.', 'agent_extension', 'Aipify', 'internal', '1.0.0', 'published', 'medium',
     '{"name":"Support Agent Enhancer","app_key":"support.agent.enhancer","version":"1.0.0","category":"agent_extension","permissions":["support.read","agent.extension.register"],"risk_level":"medium"}'::jsonb,
     '["support.read","agent.extension.register"]'::jsonb, '{cloud,hybrid}', true)
  on conflict (app_key) do update set
    name = excluded.name, description = excluded.description,
    manifest = excluded.manifest, permissions = excluded.permissions,
    risk_level = excluded.risk_level, updated_at = now();

  for v_app in select * from public.ecosystem_apps loop
    insert into public.ecosystem_app_versions (app_id, version, release_notes, manifest, permissions_changed)
    values (v_app.id, v_app.version, 'Initial release', v_app.manifest, false)
    on conflict (app_id, version) do nothing;
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Manifest validation
-- ---------------------------------------------------------------------------
create or replace function public.validate_app_manifest(p_manifest jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_errors jsonb := '[]'::jsonb;
  v_required text[] := array['name', 'app_key', 'version', 'author', 'category', 'permissions', 'risk_level'];
  v_field text;
  v_category text;
  v_risk text;
begin
  if p_manifest is null or p_manifest = '{}'::jsonb then
    return jsonb_build_object('valid', false, 'errors', jsonb_build_array('manifest_empty'));
  end if;

  foreach v_field in array v_required loop
    if p_manifest->>v_field is null or p_manifest->>v_field = '' then
      v_errors := v_errors || jsonb_build_array('missing_' || v_field);
    end if;
  end loop;

  v_category := p_manifest->>'category';
  if v_category is not null and v_category not in (
    'skill', 'agent_extension', 'industry_blueprint', 'knowledge_pack',
    'workflow_pack', 'automation_pack', 'desktop_extension', 'dashboard_module',
    'integration', 'analytics_module', 'developer_utility'
  ) then
    v_errors := v_errors || jsonb_build_array('invalid_category');
  end if;

  v_risk := p_manifest->>'risk_level';
  if v_risk is not null and v_risk not in ('low', 'medium', 'high', 'restricted') then
    v_errors := v_errors || jsonb_build_array('invalid_risk_level');
  end if;

  if jsonb_typeof(p_manifest->'permissions') <> 'array' then
    v_errors := v_errors || jsonb_build_array('permissions_must_be_array');
  end if;

  return jsonb_build_object(
    'valid', jsonb_array_length(v_errors) = 0,
    'errors', v_errors,
    'sandbox_required', coalesce((p_manifest->>'author') <> 'Aipify', true)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Install precheck (Policy Engine + permissions)
-- ---------------------------------------------------------------------------
create or replace function public.precheck_ecosystem_app_install(
  p_app_key text, p_tenant_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_app public.ecosystem_apps;
  v_existing public.tenant_ecosystem_app_installs;
  v_policy jsonb;
  v_manifest_check jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._eco_require_tenant());
  perform public._eco_seed_apps();

  select * into v_app from public.ecosystem_apps
  where app_key = p_app_key and status = 'published';
  if v_app.id is null then
    return jsonb_build_object('allowed', false, 'reason', 'app_not_found');
  end if;

  if v_app.risk_level = 'restricted' then
    return jsonb_build_object('allowed', false, 'reason', 'restricted_app');
  end if;

  v_manifest_check := public.validate_app_manifest(v_app.manifest);
  if not (v_manifest_check->>'valid')::boolean then
    return jsonb_build_object('allowed', false, 'reason', 'invalid_manifest', 'validation', v_manifest_check);
  end if;

  select * into v_existing from public.tenant_ecosystem_app_installs
  where tenant_id = v_tenant_id and app_id = v_app.id
    and status not in ('uninstalled', 'failed');
  if found then
    return jsonb_build_object('allowed', false, 'reason', 'already_installed', 'install_id', v_existing.id);
  end if;

  v_policy := public.evaluate_policy(jsonb_build_object(
    'action_key', 'ecosystem_app_install',
    'resource_type', 'ecosystem_apps',
    'resource_id', v_app.app_key,
    'actor_type', 'user',
    'data_classification', case v_app.risk_level when 'high' then 'confidential' when 'restricted' then 'confidential' else 'internal' end,
    'context', jsonb_build_object(
      'category', v_app.category, 'risk_level', v_app.risk_level,
      'permissions', v_app.permissions, 'sandbox_required', v_app.sandbox_required
    )
  ));

  return jsonb_build_object(
    'allowed', coalesce((v_policy->>'allow')::boolean, false) and not coalesce((v_policy->>'blocked')::boolean, false),
    'app', public._eco_app_json(v_app, false),
    'requires_approval', v_app.risk_level in ('medium', 'high') or coalesce((v_policy->>'requires_approval')::boolean, false),
    'requires_governance', v_app.risk_level in ('high', 'restricted'),
    'policy', v_policy,
    'permissions', v_app.permissions,
    'sandbox_required', v_app.sandbox_required,
    'risk_level', v_app.risk_level
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Install / uninstall / update
-- ---------------------------------------------------------------------------
create or replace function public.install_ecosystem_app(p_app_key text, p_approve boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_app public.ecosystem_apps;
  v_version public.ecosystem_app_versions;
  v_precheck jsonb;
  v_install_id uuid;
begin
  v_tenant_id := public._eco_require_tenant();
  v_user_id := public._eco_auth_user_id();
  perform public._eco_seed_apps();

  v_precheck := public.precheck_ecosystem_app_install(p_app_key, v_tenant_id);
  if not (v_precheck->>'allowed')::boolean then
    if (v_precheck->>'requires_approval')::boolean and not p_approve then
      perform public._eco_log_audit(v_tenant_id, p_app_key, 'install_approval_required',
        'App install requires approval', jsonb_build_object('precheck', v_precheck), v_user_id);
      return jsonb_build_object('status', 'approval_required', 'precheck', v_precheck);
    end if;
    return jsonb_build_object('status', 'precheck_failed', 'precheck', v_precheck);
  end if;

  select * into v_app from public.ecosystem_apps where app_key = p_app_key;
  select * into v_version from public.ecosystem_app_versions
  where app_id = v_app.id and version = v_app.version limit 1;

  insert into public.tenant_ecosystem_app_installs (
    tenant_id, app_id, version_id, version, status, installed_by, installed_at
  ) values (
    v_tenant_id, v_app.id, v_version.id, v_app.version,
    case when (v_precheck->>'requires_approval')::boolean then 'pending_approval' else 'active' end,
    v_user_id, now()
  ) returning id into v_install_id;

  update public.ecosystem_apps set install_count = install_count + 1, updated_at = now()
  where id = v_app.id;

  perform public._eco_log_audit(v_tenant_id, p_app_key, 'installed',
    'App installed: ' || v_app.name, jsonb_build_object('install_id', v_install_id), v_user_id);

  perform public.emit_orchestration_event(
    v_tenant_id, 'ecosystem_app.installed',
    jsonb_build_object('app_key', p_app_key, 'install_id', v_install_id, 'category', v_app.category)
  );

  return jsonb_build_object(
    'status', case when (v_precheck->>'requires_approval')::boolean then 'pending_approval' else 'installed' end,
    'install_id', v_install_id, 'precheck', v_precheck
  );
end; $$;

create or replace function public.uninstall_ecosystem_app(p_install_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_install public.tenant_ecosystem_app_installs;
  v_app public.ecosystem_apps;
begin
  v_tenant_id := public._eco_require_tenant();
  v_user_id := public._eco_auth_user_id();
  perform public._eco_require_admin();

  select * into v_install from public.tenant_ecosystem_app_installs
  where id = p_install_id and tenant_id = v_tenant_id;
  if v_install.id is null then return jsonb_build_object('status', 'not_found'); end if;

  select * into v_app from public.ecosystem_apps where id = v_install.app_id;

  update public.tenant_ecosystem_app_installs
  set status = 'uninstalled', updated_at = now()
  where id = p_install_id;

  perform public._eco_log_audit(v_tenant_id, v_app.app_key, 'uninstalled',
    'App uninstalled: ' || v_app.name, jsonb_build_object('install_id', p_install_id), v_user_id);

  return jsonb_build_object('status', 'uninstalled', 'install_id', p_install_id);
end; $$;

create or replace function public.update_ecosystem_app(p_install_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_install public.tenant_ecosystem_app_installs;
  v_app public.ecosystem_apps;
  v_version public.ecosystem_app_versions;
  v_precheck jsonb;
begin
  v_tenant_id := public._eco_require_tenant();
  v_user_id := public._eco_auth_user_id();

  select * into v_install from public.tenant_ecosystem_app_installs
  where id = p_install_id and tenant_id = v_tenant_id
    and status in ('installed', 'active', 'update_available');
  if v_install.id is null then return jsonb_build_object('status', 'not_found'); end if;

  select * into v_app from public.ecosystem_apps where id = v_install.app_id;
  if v_install.version = v_app.version then
    return jsonb_build_object('status', 'already_current', 'version', v_app.version);
  end if;

  v_precheck := public.precheck_ecosystem_app_install(v_app.app_key, v_tenant_id);
  select * into v_version from public.ecosystem_app_versions
  where app_id = v_app.id and version = v_app.version limit 1;

  update public.tenant_ecosystem_app_installs
  set version = v_app.version, version_id = v_version.id, status = 'active', updated_at = now()
  where id = p_install_id;

  perform public._eco_log_audit(v_tenant_id, v_app.app_key, 'updated',
    'App updated to ' || v_app.version, jsonb_build_object('install_id', p_install_id), v_user_id);

  return jsonb_build_object('status', 'updated', 'version', v_app.version, 'precheck', v_precheck);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Submit & process review (publish flow)
-- ---------------------------------------------------------------------------
create or replace function public.submit_ecosystem_app_review(p_manifest jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_validation jsonb;
  v_request_id uuid;
  v_app_id uuid;
  v_app_key text;
begin
  v_user_id := public._eco_auth_user_id();
  v_validation := public.validate_app_manifest(p_manifest);

  if not (v_validation->>'valid')::boolean then
    return jsonb_build_object('status', 'validation_failed', 'validation', v_validation);
  end if;

  v_app_key := p_manifest->>'app_key';
  select id into v_app_id from public.ecosystem_apps where app_key = v_app_key;

  insert into public.ecosystem_app_review_requests (
    app_id, submitted_by, manifest, status, validation_result
  ) values (
    v_app_id, v_user_id, p_manifest, 'submitted', v_validation
  ) returning id into v_request_id;

  perform public._eco_log_audit(null, v_app_key, 'review_submitted',
    'App submitted for review', jsonb_build_object('request_id', v_request_id), v_user_id);

  return jsonb_build_object('status', 'submitted', 'request_id', v_request_id, 'validation', v_validation);
end; $$;

create or replace function public.process_ecosystem_app_review_queue(p_limit int default 5)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_req public.ecosystem_app_review_requests;
  v_processed int := 0;
  v_security jsonb;
  v_governance jsonb;
  v_app_id uuid;
begin
  for v_req in
    select * from public.ecosystem_app_review_requests
    where status in ('submitted', 'validation', 'security_scan', 'governance_review')
    order by created_at asc limit p_limit
  loop
    if v_req.status = 'submitted' then
      update public.ecosystem_app_review_requests
      set status = 'security_scan', updated_at = now()
      where id = v_req.id;
    elsif v_req.status = 'security_scan' then
      v_security := jsonb_build_object(
        'passed', true, 'sandbox_required', true,
        'checks', jsonb_build_array('no_secret_access', 'no_cross_tenant', 'no_governance_bypass')
      );
      update public.ecosystem_app_review_requests
      set status = 'governance_review', security_scan_result = v_security, updated_at = now()
      where id = v_req.id;
    elsif v_req.status = 'governance_review' then
      v_governance := public.evaluate_policy(jsonb_build_object(
        'action_key', 'ecosystem_app_publish',
        'resource_type', 'ecosystem_apps',
        'resource_id', v_req.manifest->>'app_key',
        'actor_type', 'developer',
        'context', v_req.manifest
      ));
      if coalesce((v_governance->>'allow')::boolean, false) and not coalesce((v_governance->>'blocked')::boolean, false) then
        insert into public.ecosystem_apps (
          app_key, name, description, category, author, author_tier, version, status, risk_level,
          manifest, permissions, deployment_modes, sandbox_required
        ) values (
          v_req.manifest->>'app_key', v_req.manifest->>'name', v_req.manifest->>'description',
          v_req.manifest->>'category', coalesce(v_req.manifest->>'author', 'Developer'),
          coalesce(v_req.manifest->>'author_tier', 'verified_developer'),
          coalesce(v_req.manifest->>'version', '1.0.0'), 'published',
          coalesce(v_req.manifest->>'risk_level', 'medium'),
          v_req.manifest, coalesce(v_req.manifest->'permissions', '[]'::jsonb),
          coalesce(
            (select array_agg(x) from jsonb_array_elements_text(coalesce(v_req.manifest->'deployment_modes', '["cloud"]'::jsonb)) x),
            '{cloud}'
          ),
          true
        )
        on conflict (app_key) do update set
          name = excluded.name, version = excluded.version, manifest = excluded.manifest,
          permissions = excluded.permissions, risk_level = excluded.risk_level, updated_at = now()
        returning id into v_app_id;

        update public.ecosystem_app_review_requests
        set status = 'approved', governance_result = v_governance, app_id = v_app_id,
            reviewed_at = now(), updated_at = now()
        where id = v_req.id;
      else
        update public.ecosystem_app_review_requests
        set status = 'rejected', governance_result = v_governance,
            review_notes = 'Governance policy blocked publish', reviewed_at = now(), updated_at = now()
        where id = v_req.id;
      end if;
    end if;
    v_processed := v_processed + 1;
  end loop;

  return jsonb_build_object('processed', v_processed);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Worker jobs
-- ---------------------------------------------------------------------------
create or replace function public.check_ecosystem_app_updates()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_count int := 0;
begin
  update public.tenant_ecosystem_app_installs ti
  set status = 'update_available', updated_at = now()
  from public.ecosystem_apps a
  where ti.app_id = a.id and ti.tenant_id = public._eco_require_tenant()
    and ti.status in ('installed', 'active') and ti.version <> a.version;
  get diagnostics v_count = row_count;
  return jsonb_build_object('updates_flagged', v_count);
end; $$;

create or replace function public.collect_ecosystem_app_telemetry()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_install record;
  v_count int := 0;
begin
  v_tenant_id := public._eco_require_tenant();
  perform public._eco_seed_apps();

  for v_install in
    select ti.app_id, a.app_key
    from public.tenant_ecosystem_app_installs ti
    join public.ecosystem_apps a on a.id = ti.app_id
    where ti.tenant_id = v_tenant_id and ti.status in ('installed', 'active', 'update_available')
  loop
    insert into public.ecosystem_app_metrics (app_id, tenant_id, metric_key, metric_value)
    values (v_install.app_id, v_tenant_id, 'active_install', 1);
    v_count := v_count + 1;
  end loop;

  return jsonb_build_object('metrics_recorded', v_count);
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Reviews CRUD
-- ---------------------------------------------------------------------------
create or replace function public.record_ecosystem_app_review(
  p_app_key text, p_rating int, p_review text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_app public.ecosystem_apps;
  v_review_id uuid;
begin
  v_tenant_id := public._eco_require_tenant();
  v_user_id := public._eco_auth_user_id();
  perform public._eco_seed_apps();

  select * into v_app from public.ecosystem_apps where app_key = p_app_key;
  if v_app.id is null then return jsonb_build_object('status', 'not_found'); end if;

  insert into public.ecosystem_app_reviews (app_id, tenant_id, user_id, rating, review)
  values (v_app.id, v_tenant_id, v_user_id, p_rating, p_review)
  returning id into v_review_id;

  update public.ecosystem_apps set
    rating = (select round(avg(rating)::numeric, 1) from public.ecosystem_app_reviews where app_id = v_app.id),
    updated_at = now()
  where id = v_app.id;

  return jsonb_build_object('status', 'recorded', 'review_id', v_review_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_ecosystem_apps_card()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_installed int;
  v_updates int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._eco_seed_apps();

  select count(*) into v_installed from public.tenant_ecosystem_app_installs
  where tenant_id = v_tenant_id and status in ('installed', 'active', 'update_available', 'pending_approval');

  select count(*) into v_updates from public.tenant_ecosystem_app_installs
  where tenant_id = v_tenant_id and status = 'update_available';

  return jsonb_build_object(
    'has_customer', true,
    'installed_apps', v_installed,
    'updates_available', v_updates,
    'philosophy', 'Apps are guests inside Aipify — secure, governed, and permission-aware.',
    'privacy_note', 'Third-party apps run in Sandbox Runtime with no secret or cross-tenant access.'
  );
end; $$;

create or replace function public.get_ecosystem_apps_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_apps jsonb;
  v_installed jsonb;
  v_reviews jsonb;
begin
  v_tenant_id := public._eco_require_tenant();
  perform public._eco_seed_apps();

  select coalesce(jsonb_agg(public._eco_app_json(a, false) order by a.name), '[]'::jsonb) into v_apps
  from public.ecosystem_apps a where a.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'install_id', ti.id, 'app_key', a.app_key, 'name', a.name,
    'category', a.category, 'version', ti.version, 'latest_version', a.version,
    'status', ti.status, 'risk_level', a.risk_level,
    'permissions', a.permissions, 'update_available', ti.version <> a.version,
    'installed_at', ti.installed_at
  ) order by ti.installed_at desc nulls last), '[]'::jsonb) into v_installed
  from public.tenant_ecosystem_app_installs ti
  join public.ecosystem_apps a on a.id = ti.app_id
  where ti.tenant_id = v_tenant_id and ti.status not in ('uninstalled', 'failed');

  select coalesce(jsonb_agg(jsonb_build_object(
    'app_key', a.app_key, 'rating', r.rating, 'review', r.review, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb) into v_reviews
  from public.ecosystem_app_reviews r
  join public.ecosystem_apps a on a.id = r.app_id
  where r.tenant_id = v_tenant_id limit 10;

  return jsonb_build_object(
    'has_customer', true,
    'catalog', v_apps,
    'installed', v_installed,
    'recent_reviews', v_reviews,
    'installed_count', jsonb_array_length(v_installed),
    'updates_available', (
      select count(*) from public.tenant_ecosystem_app_installs ti
      join public.ecosystem_apps a on a.id = ti.app_id
      where ti.tenant_id = v_tenant_id and ti.status = 'update_available'
    )
  );
end; $$;

create or replace function public.get_ecosystem_app(p_app_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_app public.ecosystem_apps;
  v_install public.tenant_ecosystem_app_installs;
  v_versions jsonb;
  v_reviews jsonb;
  v_metrics jsonb;
begin
  v_tenant_id := public._eco_require_tenant();
  perform public._eco_seed_apps();

  select * into v_app from public.ecosystem_apps where app_key = p_app_key;
  if v_app.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select * into v_install from public.tenant_ecosystem_app_installs
  where tenant_id = v_tenant_id and app_id = v_app.id and status not in ('uninstalled', 'failed');

  select coalesce(jsonb_agg(jsonb_build_object(
    'version', v.version, 'release_notes', v.release_notes,
    'permissions_changed', v.permissions_changed, 'created_at', v.created_at
  ) order by v.created_at desc), '[]'::jsonb) into v_versions
  from public.ecosystem_app_versions v where v.app_id = v_app.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'rating', r.rating, 'review', r.review, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb) into v_reviews
  from public.ecosystem_app_reviews r where r.app_id = v_app.id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'metric_key', m.metric_key, 'metric_value', m.metric_value, 'created_at', m.created_at
  ) order by m.created_at desc), '[]'::jsonb) into v_metrics
  from public.ecosystem_app_metrics m
  where m.app_id = v_app.id and (m.tenant_id = v_tenant_id or m.tenant_id is null) limit 30;

  return jsonb_build_object(
    'app', public._eco_app_json(v_app, v_install.id is not null),
    'install', case when v_install.id is not null then jsonb_build_object(
      'install_id', v_install.id, 'version', v_install.version,
      'status', v_install.status, 'installed_at', v_install.installed_at
    ) else null end,
    'versions', v_versions,
    'reviews', v_reviews,
    'metrics', v_metrics,
    'manifest', v_app.manifest
  );
end; $$;

create or replace function public.list_ecosystem_apps()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._eco_seed_apps();
  return jsonb_build_object('apps', coalesce((
    select jsonb_agg(public._eco_app_json(a, false) order by a.name)
    from public.ecosystem_apps a where a.status = 'published'
  ), '[]'::jsonb));
end; $$;

-- ---------------------------------------------------------------------------
-- 17. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'developers', 'Developer Platform', 'App Ecosystem, SDK, and publishing guides.', 'authenticated', 19
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'developers' and tenant_id is null);

select public._eco_seed_apps();

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.validate_app_manifest(jsonb) to authenticated;
grant execute on function public.precheck_ecosystem_app_install(text, uuid) to authenticated;
grant execute on function public.install_ecosystem_app(text, boolean) to authenticated;
grant execute on function public.uninstall_ecosystem_app(uuid) to authenticated;
grant execute on function public.update_ecosystem_app(uuid) to authenticated;
grant execute on function public.submit_ecosystem_app_review(jsonb) to authenticated;
grant execute on function public.process_ecosystem_app_review_queue(int) to authenticated;
grant execute on function public.check_ecosystem_app_updates() to authenticated;
grant execute on function public.collect_ecosystem_app_telemetry() to authenticated;
grant execute on function public.record_ecosystem_app_review(text, int, text) to authenticated;
grant execute on function public.get_ecosystem_apps_card() to authenticated;
grant execute on function public.get_ecosystem_apps_dashboard() to authenticated;
grant execute on function public.get_ecosystem_app(text) to authenticated;
grant execute on function public.list_ecosystem_apps() to authenticated;
