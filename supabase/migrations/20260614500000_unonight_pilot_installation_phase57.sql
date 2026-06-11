-- Phase 57 — Unonight Pilot Installation & Live Tenant Activation
-- Generic pilot/tenant install primitives; tenant-specific presets live in application code.

-- ---------------------------------------------------------------------------
-- 1. aipify_tenant_profiles (extends customers as tenant record)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  name text not null,
  slug text not null unique,
  tenant_type text not null default 'customer' check (
    tenant_type in ('internal', 'pilot_customer', 'customer', 'enterprise', 'sandbox')
  ),
  industry text,
  region text,
  default_language text not null default 'en',
  supported_languages text[] not null default '{en}',
  timezone text not null default 'Europe/Oslo',
  pilot_status text not null default 'setup' check (
    pilot_status in ('setup', 'discovery', 'pilot_active', 'active', 'paused', 'archived')
  ),
  pilot_stage int not null default 1 check (pilot_stage between 1 and 5),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_tenant_profiles_slug_idx
  on public.aipify_tenant_profiles (slug);

alter table public.aipify_tenant_profiles enable row level security;
revoke all on public.aipify_tenant_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Extend tenant_modules with pilot mode
-- ---------------------------------------------------------------------------
alter table public.tenant_modules
  add column if not exists mode text not null default 'safe' check (
    mode in ('safe', 'read_only', 'approval_required', 'active', 'disabled', 'suggestions_only', 'draft_only')
  );

alter table public.tenant_modules
  add column if not exists settings jsonb not null default '{}'::jsonb;

alter table public.tenant_modules
  add column if not exists enabled_by_user_id uuid references public.users (id) on delete set null;

alter table public.tenant_modules
  add column if not exists enabled_at timestamptz;

-- ---------------------------------------------------------------------------
-- 3. aipify_tenant_integrations
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_integrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  integration_key text not null,
  display_name text not null,
  status text not null default 'not_connected' check (
    status in ('not_connected', 'pending', 'connected', 'error', 'disabled')
  ),
  connection_mode text not null default 'api' check (
    connection_mode in ('api', 'webhook', 'database_readonly', 'manual', 'file_import')
  ),
  capabilities jsonb not null default '{}'::jsonb,
  credentials_ref text,
  last_sync_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, integration_key)
);

create index if not exists aipify_tenant_integrations_tenant_idx
  on public.aipify_tenant_integrations (tenant_id, status);

alter table public.aipify_tenant_integrations enable row level security;
revoke all on public.aipify_tenant_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_tenant_discovery_runs
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_discovery_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  run_type text not null check (
    run_type in ('initial_install', 'manual_rescan', 'scheduled_scan')
  ),
  status text not null default 'queued' check (
    status in ('queued', 'running', 'completed', 'failed', 'cancelled')
  ),
  summary text,
  findings jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists aipify_tenant_discovery_runs_tenant_idx
  on public.aipify_tenant_discovery_runs (tenant_id, created_at desc);

alter table public.aipify_tenant_discovery_runs enable row level security;
revoke all on public.aipify_tenant_discovery_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_tenant_pilot_checklist
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_pilot_checklist (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  checklist_key text not null,
  title text not null,
  description text,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'blocked', 'skipped')
  ),
  priority int not null default 0,
  assigned_user_id uuid references public.users (id) on delete set null,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, checklist_key)
);

create index if not exists aipify_tenant_pilot_checklist_tenant_idx
  on public.aipify_tenant_pilot_checklist (tenant_id, priority desc);

alter table public.aipify_tenant_pilot_checklist enable row level security;
revoke all on public.aipify_tenant_pilot_checklist from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_tenant_pilot_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_pilot_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  title text not null,
  summary text,
  severity text not null default 'info' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

create index if not exists aipify_tenant_pilot_events_tenant_idx
  on public.aipify_tenant_pilot_events (tenant_id, created_at desc);

alter table public.aipify_tenant_pilot_events enable row level security;
revoke all on public.aipify_tenant_pilot_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pilot_require_platform_admin()
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._pilot_require_tenant_access(p_tenant_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare v_auth uuid;
begin
  if public.is_platform_admin() then return; end if;
  v_auth := auth.uid();
  if v_auth is null then raise exception 'Not authenticated'; end if;
  if not exists (
    select 1 from public.users u
    join public.customers c on c.company_id = u.company_id
    where u.auth_user_id = v_auth and c.id = p_tenant_id
  ) then
    raise exception 'Not authorized for tenant';
  end if;
end;
$$;

create or replace function public._pilot_record_event(
  p_tenant_id uuid,
  p_event_type text,
  p_title text,
  p_summary text default null,
  p_severity text default 'info',
  p_metadata jsonb default '{}'::jsonb,
  p_created_by text default 'system'
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare v_id uuid;
begin
  insert into public.aipify_tenant_pilot_events (
    tenant_id, event_type, title, summary, severity, metadata, created_by
  ) values (
    p_tenant_id, p_event_type, p_title, p_summary, p_severity, coalesce(p_metadata, '{}'::jsonb), p_created_by
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._pilot_profile_json(p_row public.aipify_tenant_profiles)
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'tenant_id', p_row.tenant_id,
    'name', p_row.name,
    'slug', p_row.slug,
    'tenant_type', p_row.tenant_type,
    'industry', p_row.industry,
    'region', p_row.region,
    'default_language', p_row.default_language,
    'supported_languages', p_row.supported_languages,
    'timezone', p_row.timezone,
    'pilot_status', p_row.pilot_status,
    'pilot_stage', p_row.pilot_stage,
    'metadata', p_row.metadata,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
$$;

-- ---------------------------------------------------------------------------
-- 8. Provision pilot tenant (generic, driven by preset JSON)
-- ---------------------------------------------------------------------------
create or replace function public.provision_pilot_tenant(p_config jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_company_id uuid;
  v_tenant_id uuid;
  v_profile public.aipify_tenant_profiles;
  v_customer_seq bigint;
  v_item jsonb;
  v_module_key text;
  v_wf jsonb;
  v_check jsonb;
  v_int jsonb;
  v_perm jsonb;
  v_slug text := coalesce(p_config->>'slug', '');
  v_company_slug text := coalesce(p_config->>'company_slug', p_config->>'slug', '');
begin
  perform public._pilot_require_platform_admin();
  if v_slug = '' then raise exception 'slug is required'; end if;

  select id into v_company_id from public.companies where slug = v_company_slug limit 1;
  if v_company_id is null then
    insert into public.companies (name, slug, is_platform)
    values (coalesce(p_config->>'name', v_slug), v_company_slug, false)
    returning id into v_company_id;
  end if;

  select c.id into v_tenant_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_tenant_id is null then
    v_customer_seq := nextval('public.customer_number_seq');
    insert into public.customers (
      customer_number, company_id, customer_type, company_name, email, country, language, status, timezone
    ) values (
      public.format_customer_number(v_customer_seq),
      v_company_id,
      'company',
      coalesce(p_config->>'name', v_slug),
      coalesce(p_config->>'contact_email', 'admin@' || v_slug || '.com'),
      coalesce(p_config->>'country', 'NO'),
      coalesce(p_config->>'default_language', 'en'),
      'active',
      coalesce(p_config->>'timezone', 'Europe/Oslo')
    ) returning id into v_tenant_id;

    insert into public.subscriptions (
      customer_id, plan_name, plan_type, status, billing_cycle, price_amount, currency, max_users, max_installations
    ) values (
      v_tenant_id,
      coalesce(p_config->>'plan_name', 'Enterprise'),
      coalesce(p_config->>'plan_type', 'enterprise'),
      'active',
      'monthly',
      0,
      'EUR',
      50,
      5
    ) on conflict (customer_id) do nothing;
  end if;

  insert into public.aipify_tenant_profiles (
    tenant_id, name, slug, tenant_type, industry, region,
    default_language, supported_languages, timezone, pilot_status, pilot_stage, metadata
  ) values (
    v_tenant_id,
    coalesce(p_config->>'name', v_slug),
    v_slug,
    coalesce(p_config->>'tenant_type', 'pilot_customer'),
    p_config->>'industry',
    p_config->>'region',
    coalesce(p_config->>'default_language', 'en'),
    coalesce(
      array(select jsonb_array_elements_text(p_config->'supported_languages')),
      '{en}'::text[]
    ),
    coalesce(p_config->>'timezone', 'Europe/Oslo'),
    coalesce(p_config->>'pilot_status', 'setup'),
    coalesce((p_config->>'pilot_stage')::int, 1),
    coalesce(p_config->'metadata', '{}'::jsonb)
  )
  on conflict (tenant_id) do update set
    name = excluded.name,
    slug = excluded.slug,
    tenant_type = excluded.tenant_type,
    industry = excluded.industry,
    region = excluded.region,
    default_language = excluded.default_language,
    supported_languages = excluded.supported_languages,
    timezone = excluded.timezone,
    pilot_status = excluded.pilot_status,
    pilot_stage = excluded.pilot_stage,
    metadata = aipify_tenant_profiles.metadata || excluded.metadata,
    updated_at = now()
  returning * into v_profile;

  for v_item in select * from jsonb_array_elements(coalesce(p_config->'modules', '[]'::jsonb))
  loop
    v_module_key := v_item->>'module_key';
    insert into public.tenant_modules (
      tenant_id, module_key, enabled, licensed, status, mode, settings, enabled_at
    ) values (
      v_tenant_id,
      v_module_key,
      coalesce((v_item->>'enabled')::boolean, true),
      true,
      case when coalesce((v_item->>'enabled')::boolean, true) then 'enabled' else 'disabled' end,
      coalesce(v_item->>'mode', 'safe'),
      coalesce(v_item->'settings', '{}'::jsonb),
      case when coalesce((v_item->>'enabled')::boolean, true) then now() else null end
    )
    on conflict (tenant_id, module_key) do update set
      enabled = excluded.enabled,
      licensed = true,
      status = excluded.status,
      mode = excluded.mode,
      settings = tenant_modules.settings || excluded.settings,
      enabled_at = coalesce(tenant_modules.enabled_at, excluded.enabled_at),
      updated_at = now();
  end loop;

  for v_int in select * from jsonb_array_elements(coalesce(p_config->'integrations', '[]'::jsonb))
  loop
    insert into public.aipify_tenant_integrations (
      tenant_id, integration_key, display_name, status, connection_mode, capabilities
    ) values (
      v_tenant_id,
      v_int->>'integration_key',
      v_int->>'display_name',
      coalesce(v_int->>'status', 'not_connected'),
      coalesce(v_int->>'connection_mode', 'api'),
      coalesce(v_int->'capabilities', '{}'::jsonb)
    )
    on conflict (tenant_id, integration_key) do update set
      display_name = excluded.display_name,
      status = excluded.status,
      connection_mode = excluded.connection_mode,
      capabilities = aipify_tenant_integrations.capabilities || excluded.capabilities,
      updated_at = now();
  end loop;

  for v_wf in select * from jsonb_array_elements(coalesce(p_config->'workflows', '[]'::jsonb))
  loop
    insert into public.aipify_workflow_definitions (
      tenant_id, name, workflow_key, description, category,
      expected_response_time_minutes, active
    ) values (
      v_tenant_id,
      v_wf->>'name',
      v_wf->>'workflow_key',
      v_wf->>'description',
      coalesce(v_wf->>'category', 'support'),
      (v_wf->>'expected_response_time_minutes')::int,
      coalesce((v_wf->>'active')::boolean, true)
    )
    on conflict (tenant_id, workflow_key) do update set
      name = excluded.name,
      description = excluded.description,
      category = excluded.category,
      expected_response_time_minutes = excluded.expected_response_time_minutes,
      active = excluded.active,
      updated_at = now();
  end loop;

  for v_check in select * from jsonb_array_elements(coalesce(p_config->'checklist', '[]'::jsonb))
  loop
    insert into public.aipify_tenant_pilot_checklist (
      tenant_id, checklist_key, title, description, status, priority
    ) values (
      v_tenant_id,
      v_check->>'checklist_key',
      v_check->>'title',
      v_check->>'description',
      coalesce(v_check->>'status', 'pending'),
      coalesce((v_check->>'priority')::int, 0)
    )
    on conflict (tenant_id, checklist_key) do update set
      title = excluded.title,
      description = excluded.description,
      priority = excluded.priority,
      updated_at = now();
  end loop;

  insert into public.aipify_governance_settings (
    tenant_id, governance_mode, approval_defaults, emergency_controls_enabled,
    explainability_enabled, trust_scoring_enabled
  ) values (
    v_tenant_id,
    coalesce(p_config->'governance'->>'mode', 'enterprise_control'),
    coalesce(p_config->'governance'->'approval_defaults', '{"require_medium_risk": true, "require_high_risk": true}'::jsonb),
    true, true, true
  ) on conflict (tenant_id) do update set
    governance_mode = excluded.governance_mode,
    approval_defaults = excluded.approval_defaults,
    updated_at = now();

  perform public.seed_tacc_action_permissions(v_tenant_id);
  perform public.ensure_tacc_emergency_stop(v_tenant_id);

  for v_perm in select * from jsonb_array_elements(coalesce(p_config->'governance'->'permissions', '[]'::jsonb))
  loop
    insert into public.aipify_action_permissions (
      tenant_id, action_key, permission_level, risk_level, requires_approval, enabled
    ) values (
      v_tenant_id,
      v_perm->>'action_key',
      coalesce(v_perm->>'permission_level', 'approval_required'),
      coalesce(v_perm->>'risk_level', 'medium'),
      coalesce((v_perm->>'requires_approval')::boolean, true),
      coalesce((v_perm->>'enabled')::boolean, true)
    )
    on conflict (tenant_id, action_key) do update set
      permission_level = excluded.permission_level,
      risk_level = excluded.risk_level,
      requires_approval = excluded.requires_approval,
      enabled = excluded.enabled,
      updated_at = now();
  end loop;

  perform public._pilot_record_event(
    v_tenant_id, 'tenant_created',
    'Pilot tenant provisioned',
    'Tenant ' || v_slug || ' created or updated via pilot install flow.',
    'info',
    jsonb_build_object('slug', v_slug, 'tenant_type', v_profile.tenant_type)
  );

  update public.aipify_tenant_pilot_checklist
  set status = 'completed', completed_at = now(), updated_at = now()
  where tenant_id = v_tenant_id and checklist_key = 'create_tenant';

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'profile', public._pilot_profile_json(v_profile)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Pilot install status & dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_pilot_install_status(p_slug text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_profile public.aipify_tenant_profiles;
begin
  perform public._pilot_require_platform_admin();

  select * into v_profile
  from public.aipify_tenant_profiles p
  where p.slug = p_slug
  limit 1;

  if not found then
    return jsonb_build_object('exists', false, 'slug', p_slug);
  end if;

  v_tenant_id := v_profile.tenant_id;

  return jsonb_build_object(
    'exists', true,
    'profile', public._pilot_profile_json(v_profile),
    'dashboard', public.get_tenant_pilot_dashboard(v_tenant_id)
  );
end;
$$;

create or replace function public.get_tenant_pilot_dashboard(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_profile public.aipify_tenant_profiles;
  v_modules int;
  v_integrations_connected int;
  v_articles int;
  v_gaps int;
  v_workflows int;
  v_pending_approvals int;
  v_blocked_actions int;
  v_checklist_done int;
  v_checklist_total int;
  v_last_discovery public.aipify_tenant_discovery_runs;
  v_emergency boolean;
  v_governance public.aipify_governance_settings;
  v_support_mode text;
  v_completeness int;
begin
  perform public._pilot_require_tenant_access(p_tenant_id);

  select * into v_profile from public.aipify_tenant_profiles where tenant_id = p_tenant_id;

  select count(*) into v_modules
  from public.tenant_modules where tenant_id = p_tenant_id and enabled = true;

  select count(*) into v_integrations_connected
  from public.aipify_tenant_integrations
  where tenant_id = p_tenant_id and status = 'connected';

  select count(*) into v_articles
  from public.aipify_knowledge_articles
  where tenant_id = p_tenant_id and status = 'published';

  select count(*) into v_gaps
  from public.aipify_knowledge_gaps
  where tenant_id = p_tenant_id and status in ('open', 'in_review');

  select count(*) into v_workflows
  from public.aipify_workflow_definitions
  where tenant_id = p_tenant_id and active = true;

  select count(*) into v_pending_approvals
  from public.aipify_approval_requests
  where tenant_id = p_tenant_id and status = 'pending';

  select count(*) into v_blocked_actions
  from public.aipify_action_permissions
  where tenant_id = p_tenant_id and permission_level = 'blocked' and enabled = true;

  select count(*) filter (where status = 'completed'),
         count(*)
  into v_checklist_done, v_checklist_total
  from public.aipify_tenant_pilot_checklist where tenant_id = p_tenant_id;

  select * into v_last_discovery
  from public.aipify_tenant_discovery_runs
  where tenant_id = p_tenant_id
  order by created_at desc
  limit 1;

  select * into v_governance from public.aipify_governance_settings where tenant_id = p_tenant_id;
  v_emergency := public._tacc_is_emergency_active(p_tenant_id);

  select coalesce(mode, 'disabled') into v_support_mode
  from public.tenant_modules
  where tenant_id = p_tenant_id and module_key = 'support_ai'
  limit 1;

  v_completeness := case when v_checklist_total = 0 then 0
    else round((v_checklist_done::numeric / v_checklist_total) * 100)::int end;

  return jsonb_build_object(
    'tenant_id', p_tenant_id,
    'profile', case when v_profile.id is not null then public._pilot_profile_json(v_profile) else null end,
    'setup_completeness_score', v_completeness,
    'safe_mode', coalesce(v_governance.governance_mode, 'safe') in ('safe', 'enterprise_control'),
    'governance_mode', coalesce(v_governance.governance_mode, 'safe'),
    'emergency_stop_active', v_emergency,
    'support_ai_mode', coalesce(v_support_mode, 'disabled'),
    'knowledge_articles_count', v_articles,
    'open_knowledge_gaps', v_gaps,
    'workflows_detected', v_workflows,
    'integrations_connected', v_integrations_connected,
    'modules_enabled', v_modules,
    'last_discovery_run', case when v_last_discovery.id is not null then jsonb_build_object(
      'id', v_last_discovery.id,
      'status', v_last_discovery.status,
      'summary', v_last_discovery.summary,
      'completed_at', v_last_discovery.completed_at,
      'findings', v_last_discovery.findings
    ) else null end,
    'pending_approvals', v_pending_approvals,
    'blocked_actions', v_blocked_actions,
    'checklist_summary', jsonb_build_object(
      'completed', v_checklist_done,
      'total', v_checklist_total
    ),
    'next_recommended_step', public._pilot_next_step(p_tenant_id)
  );
end;
$$;

create or replace function public._pilot_next_step(p_tenant_id uuid)
returns text
language plpgsql stable security definer set search_path = public
as $$
declare v_item public.aipify_tenant_pilot_checklist;
begin
  select * into v_item
  from public.aipify_tenant_pilot_checklist
  where tenant_id = p_tenant_id and status in ('pending', 'in_progress', 'blocked')
  order by priority desc, created_at
  limit 1;
  if not found then return 'Pilot checklist complete — review dashboard metrics.'; end if;
  return v_item.title;
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Enable safe modules (idempotent)
-- ---------------------------------------------------------------------------
create or replace function public.enable_pilot_safe_modules(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_count int := 0;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  update public.tenant_modules set
    enabled = true, licensed = true, status = 'enabled', enabled_at = coalesce(enabled_at, now()), updated_at = now()
  where tenant_id = p_tenant_id
    and module_key in (
      'knowledge_center', 'support_ai', 'governance', 'audit',
      'install_discovery', 'basic_insights', 'workflow_event_recording', 'knowledge_gap_detection'
    );
  get diagnostics v_count = row_count;

  update public.aipify_tenant_profiles
  set pilot_status = 'pilot_active', pilot_stage = greatest(pilot_stage, 2), updated_at = now()
  where tenant_id = p_tenant_id;

  perform public._pilot_record_event(
    p_tenant_id, 'module_enabled', 'Safe modules enabled',
    v_count || ' modules activated in safe mode.', 'info'
  );

  update public.aipify_tenant_pilot_checklist
  set status = 'completed', completed_at = now(), updated_at = now()
  where tenant_id = p_tenant_id
    and checklist_key in ('enable_knowledge_center', 'enable_governance', 'enable_support_ai_draft');

  return jsonb_build_object('enabled_count', v_count, 'dashboard', public.get_tenant_pilot_dashboard(p_tenant_id));
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Discovery runs
-- ---------------------------------------------------------------------------
create or replace function public.run_tenant_discovery(
  p_tenant_id uuid,
  p_run_type text default 'manual_rescan',
  p_findings jsonb default '{}'::jsonb,
  p_recommendations jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_run public.aipify_tenant_discovery_runs;
  v_summary text;
  v_workflow_count int;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  if p_run_type not in ('initial_install', 'manual_rescan', 'scheduled_scan') then
    raise exception 'Invalid run type';
  end if;

  insert into public.aipify_tenant_discovery_runs (
    tenant_id, run_type, status, summary, findings, recommendations,
    started_at, completed_at, created_by_user_id
  ) values (
    p_tenant_id, p_run_type, 'running', null, '{}'::jsonb, '{}'::jsonb, now(), null,
    (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1)
  ) returning * into v_run;

  select count(*) into v_workflow_count
  from public.aipify_workflow_definitions where tenant_id = p_tenant_id and active = true;

  v_summary := format(
    'Discovery found %s workflows, %s integrations, and %s knowledge categories.',
    v_workflow_count,
    (select count(*) from public.aipify_tenant_integrations where tenant_id = p_tenant_id),
    (select count(distinct category_id) from public.aipify_knowledge_articles where tenant_id = p_tenant_id)
  );

  update public.aipify_tenant_discovery_runs set
    status = 'completed',
    summary = v_summary,
    findings = case when p_findings = '{}'::jsonb then jsonb_build_object(
      'workflows', v_workflow_count,
      'integrations', (select jsonb_agg(jsonb_build_object(
        'key', integration_key, 'status', status, 'display_name', display_name
      )) from public.aipify_tenant_integrations where tenant_id = p_tenant_id),
      'queues_detected', coalesce(p_findings->'queues_detected', '[]'::jsonb)
    ) else p_findings end,
    recommendations = case when p_recommendations = '{}'::jsonb then jsonb_build_object(
      'enable_support_ai_draft', true,
      'seed_knowledge', true,
      'connect_integrations', true,
      'pilot_stage', 2
    ) else p_recommendations end,
    completed_at = now()
  where id = v_run.id
  returning * into v_run;

  update public.aipify_tenant_profiles
  set pilot_status = 'discovery', updated_at = now()
  where tenant_id = p_tenant_id and pilot_status = 'setup';

  perform public._pilot_record_event(
    p_tenant_id, 'discovery_completed', 'Discovery scan completed', v_summary, 'info',
    jsonb_build_object('run_id', v_run.id)
  );

  update public.aipify_tenant_pilot_checklist
  set status = 'completed', completed_at = now(), updated_at = now()
  where tenant_id = p_tenant_id and checklist_key = 'run_discovery';

  return jsonb_build_object(
    'run', jsonb_build_object(
      'id', v_run.id, 'status', v_run.status, 'summary', v_run.summary,
      'findings', v_run.findings, 'recommendations', v_run.recommendations,
      'completed_at', v_run.completed_at
    ),
    'dashboard', public.get_tenant_pilot_dashboard(p_tenant_id)
  );
end;
$$;

create or replace function public.get_tenant_discovery_runs(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', r.id, 'run_type', r.run_type, 'status', r.status,
      'summary', r.summary, 'findings', r.findings,
      'recommendations', r.recommendations,
      'started_at', r.started_at, 'completed_at', r.completed_at, 'created_at', r.created_at
    ) order by r.created_at desc)
    from public.aipify_tenant_discovery_runs r
    where r.tenant_id = p_tenant_id
  ), '[]'::jsonb);
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Tenant knowledge seed import
-- ---------------------------------------------------------------------------
create or replace function public.import_tenant_knowledge_seed(
  p_tenant_id uuid,
  p_articles jsonb,
  p_overwrite boolean default false
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_item jsonb;
  v_cat uuid;
  v_id uuid;
  v_count int := 0;
  v_slug text;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  for v_item in select * from jsonb_array_elements(p_articles)
  loop
    v_slug := coalesce(v_item->>'category', 'faq');
    select id into v_cat from public.aipify_knowledge_categories
    where slug = v_slug and tenant_id = p_tenant_id limit 1;

    if v_cat is null then
      insert into public.aipify_knowledge_categories (
        tenant_id, slug, name, description, visibility, sort_order
      ) values (
        p_tenant_id, v_slug, initcap(replace(v_slug, '_', ' ')), '', 'admin_and_support', 0
      ) returning id into v_cat;
    end if;

    if exists (
      select 1 from public.aipify_knowledge_articles
      where tenant_id = p_tenant_id
        and slug = v_item->>'slug'
        and language = coalesce(v_item->>'language', 'en')
    ) then
      if p_overwrite then
        update public.aipify_knowledge_articles set
          title = v_item->>'title', body = v_item->>'body', summary = v_item->>'title',
          category_id = v_cat, status = coalesce(v_item->>'status', 'published'),
          visibility = coalesce(v_item->>'visibility', 'authenticated'),
          source_path = v_item->>'source_path', updated_at = now()
        where tenant_id = p_tenant_id
          and slug = v_item->>'slug'
          and language = coalesce(v_item->>'language', 'en')
        returning id into v_id;
        perform public._kc_refresh_article_search_vector(v_id);
        v_count := v_count + 1;
      end if;
      continue;
    end if;

    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, summary, body, language, article_type, status, visibility,
      tags, keywords, source_path, is_global, published_at
    ) values (
      p_tenant_id, v_cat, v_item->>'slug', v_item->>'title', v_item->>'title', v_item->>'body',
      coalesce(v_item->>'language', 'en'), coalesce(v_item->>'article_type', 'faq'),
      coalesce(v_item->>'status', 'published'), coalesce(v_item->>'visibility', 'authenticated'),
      coalesce(array(select jsonb_array_elements_text(v_item->'tags')), '{}'),
      coalesce(array(select jsonb_array_elements_text(v_item->'keywords')), '{}'),
      v_item->>'source_path', false,
      case when coalesce(v_item->>'status', 'published') = 'published' then now() else null end
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
    v_count := v_count + 1;
  end loop;

  perform public._pilot_record_event(
    p_tenant_id, 'knowledge_seeded', 'Knowledge Center seeded',
    v_count || ' articles imported.', 'info',
    jsonb_build_object('count', v_count)
  );

  update public.aipify_tenant_pilot_checklist
  set status = 'completed', completed_at = now(), updated_at = now()
  where tenant_id = p_tenant_id and checklist_key = 'seed_faq';

  return jsonb_build_object('imported', v_count, 'dashboard', public.get_tenant_pilot_dashboard(p_tenant_id));
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Modules, integrations, checklist, events
-- ---------------------------------------------------------------------------
create or replace function public.get_tenant_pilot_modules(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', m.id, 'module_key', m.module_key, 'enabled', m.enabled,
      'licensed', m.licensed, 'status', m.status, 'mode', m.mode,
      'settings', m.settings, 'enabled_at', m.enabled_at, 'updated_at', m.updated_at
    ) order by m.module_key)
    from public.tenant_modules m where m.tenant_id = p_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.update_tenant_pilot_module(
  p_tenant_id uuid,
  p_module_key text,
  p_patch jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_row public.tenant_modules;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  update public.tenant_modules set
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    mode = coalesce(p_patch->>'mode', mode),
    status = case
      when coalesce((p_patch->>'enabled')::boolean, enabled) then 'enabled'
      else 'disabled'
    end,
    settings = settings || coalesce(p_patch->'settings', '{}'::jsonb),
    enabled_at = case when coalesce((p_patch->>'enabled')::boolean, enabled) then coalesce(enabled_at, now()) else enabled_at end,
    updated_at = now()
  where tenant_id = p_tenant_id and module_key = p_module_key
  returning * into v_row;

  if not found then raise exception 'Module not found'; end if;

  perform public._pilot_record_event(
    p_tenant_id, 'module_enabled', 'Module updated',
    p_module_key || ' set to ' || v_row.mode, 'info'
  );

  return jsonb_build_object(
    'module_key', v_row.module_key, 'enabled', v_row.enabled, 'mode', v_row.mode, 'status', v_row.status
  );
end;
$$;

create or replace function public.get_tenant_integrations(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', i.id, 'integration_key', i.integration_key, 'display_name', i.display_name,
      'status', i.status, 'connection_mode', i.connection_mode,
      'capabilities', i.capabilities, 'last_sync_at', i.last_sync_at,
      'error_message', i.error_message, 'updated_at', i.updated_at
    ) order by i.integration_key)
    from public.aipify_tenant_integrations i where i.tenant_id = p_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.connect_tenant_integration(
  p_tenant_id uuid,
  p_integration_key text,
  p_patch jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_tenant_integrations;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  update public.aipify_tenant_integrations set
    status = coalesce(p_patch->>'status', 'connected'),
    connection_mode = coalesce(p_patch->>'connection_mode', connection_mode),
    capabilities = capabilities || coalesce(p_patch->'capabilities', '{}'::jsonb),
    last_sync_at = now(),
    error_message = null,
    updated_at = now()
  where tenant_id = p_tenant_id and integration_key = p_integration_key
  returning * into v_row;

  if not found then raise exception 'Integration not found'; end if;

  perform public._pilot_record_event(
    p_tenant_id, 'integration_connected', 'Integration connected',
    v_row.display_name || ' is now ' || v_row.status, 'info',
    jsonb_build_object('integration_key', p_integration_key)
  );

  return jsonb_build_object(
    'integration_key', v_row.integration_key,
    'status', v_row.status,
    'last_sync_at', v_row.last_sync_at
  );
end;
$$;

create or replace function public.disable_tenant_integration(
  p_tenant_id uuid,
  p_integration_key text
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_platform_admin();
  return public.connect_tenant_integration(
    p_tenant_id, p_integration_key, jsonb_build_object('status', 'disabled')
  );
end;
$$;

create or replace function public.get_tenant_pilot_checklist(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id, 'checklist_key', c.checklist_key, 'title', c.title,
      'description', c.description, 'status', c.status, 'priority', c.priority,
      'completed_at', c.completed_at, 'updated_at', c.updated_at
    ) order by c.priority desc, c.created_at)
    from public.aipify_tenant_pilot_checklist c where c.tenant_id = p_tenant_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.update_pilot_checklist_item(
  p_tenant_id uuid,
  p_item_id uuid,
  p_status text
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_tenant_pilot_checklist;
begin
  perform public._pilot_require_platform_admin();
  perform public._pilot_require_tenant_access(p_tenant_id);

  if p_status not in ('pending', 'in_progress', 'completed', 'blocked', 'skipped') then
    raise exception 'Invalid status';
  end if;

  update public.aipify_tenant_pilot_checklist set
    status = p_status,
    completed_at = case when p_status = 'completed' then now() else completed_at end,
    updated_at = now()
  where id = p_item_id and tenant_id = p_tenant_id
  returning * into v_row;

  if not found then raise exception 'Checklist item not found'; end if;

  return jsonb_build_object(
    'id', v_row.id, 'checklist_key', v_row.checklist_key, 'status', v_row.status
  );
end;
$$;

create or replace function public.get_tenant_pilot_events(p_tenant_id uuid, p_limit int default 50)
returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  perform public._pilot_require_tenant_access(p_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', e.id, 'event_type', e.event_type, 'title', e.title,
      'summary', e.summary, 'severity', e.severity, 'metadata', e.metadata,
      'created_by', e.created_by, 'created_at', e.created_at
    ) order by e.created_at desc)
    from (
      select * from public.aipify_tenant_pilot_events
      where tenant_id = p_tenant_id
      order by created_at desc
      limit greatest(1, least(p_limit, 200))
    ) e
  ), '[]'::jsonb);
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Workflow event sync stub (integration adapter feeds events)
-- ---------------------------------------------------------------------------
create or replace function public.record_tenant_workflow_events(
  p_tenant_id uuid,
  p_events jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_item jsonb;
  v_wf_id uuid;
  v_count int := 0;
begin
  perform public._pilot_require_platform_admin();

  for v_item in select * from jsonb_array_elements(p_events)
  loop
    select id into v_wf_id from public.aipify_workflow_definitions
    where tenant_id = p_tenant_id and workflow_key = v_item->>'workflow_key'
    limit 1;

    insert into public.aipify_workflow_events (
      tenant_id, workflow_id, event_type, source_type, source_id, event_payload, occurred_at
    ) values (
      p_tenant_id,
      v_wf_id,
      coalesce(v_item->>'event_type', 'created'),
      'api',
      v_item->>'source_id',
      jsonb_build_object(
        'title', v_item->>'title',
        'description', v_item->>'description',
        'severity', coalesce(v_item->>'severity', 'info'),
        'metadata', coalesce(v_item->'metadata', '{}'::jsonb)
      ),
      coalesce((v_item->>'occurred_at')::timestamptz, now())
    );
    v_count := v_count + 1;
  end loop;

  perform public._pilot_record_event(
    p_tenant_id, 'workflow_event_recorded',
    'Workflow events synced', v_count || ' events recorded.', 'info'
  );

  return jsonb_build_object('recorded', v_count);
end;
$$;

-- ---------------------------------------------------------------------------
-- 15. Pilot health check
-- ---------------------------------------------------------------------------
create or replace function public.run_pilot_health_check(p_tenant_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_issues jsonb := '[]'::jsonb;
  v_integrations_error int;
  v_gaps int;
  v_emergency boolean;
begin
  perform public._pilot_require_platform_admin();

  select count(*) into v_integrations_error
  from public.aipify_tenant_integrations
  where tenant_id = p_tenant_id and status = 'error';

  if v_integrations_error > 0 then
    v_issues := v_issues || jsonb_build_array(jsonb_build_object(
      'type', 'integration_error', 'count', v_integrations_error, 'severity', 'medium'
    ));
  end if;

  select count(*) into v_gaps
  from public.aipify_knowledge_gaps
  where tenant_id = p_tenant_id and status = 'open';

  v_emergency := public._tacc_is_emergency_active(p_tenant_id);
  if v_emergency then
    v_issues := v_issues || jsonb_build_array(jsonb_build_object(
      'type', 'emergency_stop_active', 'severity', 'high'
    ));
  end if;

  perform public._pilot_record_event(
    p_tenant_id,
    case when jsonb_array_length(v_issues) > 0 then 'pilot_issue_found' else 'pilot_success' end,
    'Daily pilot health check',
    format('%s issues found, %s open knowledge gaps.', jsonb_array_length(v_issues), v_gaps),
    case when jsonb_array_length(v_issues) > 0 then 'medium' else 'info' end,
    jsonb_build_object('issues', v_issues, 'open_gaps', v_gaps)
  );

  return jsonb_build_object(
    'issues', v_issues,
    'open_knowledge_gaps', v_gaps,
    'emergency_stop_active', v_emergency,
    'dashboard', public.get_tenant_pilot_dashboard(p_tenant_id)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 16. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.provision_pilot_tenant(jsonb) to authenticated;
grant execute on function public.get_pilot_install_status(text) to authenticated;
grant execute on function public.get_tenant_pilot_dashboard(uuid) to authenticated;
grant execute on function public.enable_pilot_safe_modules(uuid) to authenticated;
grant execute on function public.run_tenant_discovery(uuid, text, jsonb, jsonb) to authenticated;
grant execute on function public.get_tenant_discovery_runs(uuid) to authenticated;
grant execute on function public.import_tenant_knowledge_seed(uuid, jsonb, boolean) to authenticated;
grant execute on function public.get_tenant_pilot_modules(uuid) to authenticated;
grant execute on function public.update_tenant_pilot_module(uuid, text, jsonb) to authenticated;
grant execute on function public.get_tenant_integrations(uuid) to authenticated;
grant execute on function public.connect_tenant_integration(uuid, text, jsonb) to authenticated;
grant execute on function public.disable_tenant_integration(uuid, text) to authenticated;
grant execute on function public.get_tenant_pilot_checklist(uuid) to authenticated;
grant execute on function public.update_pilot_checklist_item(uuid, uuid, text) to authenticated;
grant execute on function public.get_tenant_pilot_events(uuid, int) to authenticated;
grant execute on function public.record_tenant_workflow_events(uuid, jsonb) to authenticated;
grant execute on function public.run_pilot_health_check(uuid) to authenticated;
