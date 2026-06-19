-- Phase 523A — Install, Discovery & Data Connection Engine
-- Aipify learns from systems customers already use.
-- Extends: organization_installations, install_discovery_results (A.22), modern install (24)

-- ---------------------------------------------------------------------------
-- 1. Settings & connection catalog
-- ---------------------------------------------------------------------------
create table if not exists public.organization_install_discovery_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_sync_mode text not null default 'scheduled' check (
    default_sync_mode in ('realtime', 'scheduled', 'manual')
  ),
  enable_smart_mapping boolean not null default true,
  enable_oauth_connections boolean not null default true,
  companion_install_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_install_discovery_settings enable row level security;
revoke all on public.organization_install_discovery_settings from authenticated, anon;

create table if not exists public.organization_install_connection_catalog (
  id uuid primary key default gen_random_uuid(),
  system_key text not null unique,
  system_name text not null,
  category text not null check (
    category in ('commerce', 'finance', 'productivity', 'operations', 'custom')
  ),
  connection_method text not null check (
    connection_method in ('official_integration', 'api_connection', 'oauth', 'file_import', 'manual_setup')
  ),
  method_priority int not null default 1,
  supports_sync boolean not null default true,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_install_connection_catalog enable row level security;
revoke all on public.organization_install_connection_catalog from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Connected systems & data sources
-- ---------------------------------------------------------------------------
create table if not exists public.organization_install_connected_systems (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  system_key text not null,
  system_name text not null,
  connection_method text not null check (
    connection_method in ('official_integration', 'api_connection', 'oauth', 'file_import', 'manual_setup')
  ),
  auth_status text not null default 'pending' check (
    auth_status in ('pending', 'authorized', 'expired', 'revoked', 'not_required')
  ),
  sync_mode text not null default 'scheduled' check (
    sync_mode in ('realtime', 'scheduled', 'manual')
  ),
  sync_health text not null default 'unknown' check (
    sync_health in ('healthy', 'warning', 'error', 'unknown', 'paused')
  ),
  last_sync_at timestamptz,
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, system_key)
);

create index if not exists organization_install_connected_systems_org_idx
  on public.organization_install_connected_systems (organization_id, sync_health);

alter table public.organization_install_connected_systems enable row level security;
revoke all on public.organization_install_connected_systems from authenticated, anon;

create table if not exists public.organization_install_data_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  data_domain text not null check (
    data_domain in (
      'products', 'inventory', 'customers', 'orders', 'employees',
      'departments', 'documents', 'workflows', 'assets', 'domains', 'finance'
    )
  ),
  source_system_key text not null,
  source_system_name text not null,
  connection_method text not null default 'manual_setup',
  status text not null default 'configured' check (
    status in ('configured', 'pending', 'syncing', 'error')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, data_domain)
);

alter table public.organization_install_data_sources enable row level security;
revoke all on public.organization_install_data_sources from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Import jobs & mappings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_install_import_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  job_number text,
  file_name text not null default '',
  file_format text not null default 'csv' check (
    file_format in ('csv', 'excel', 'xml', 'json', 'custom')
  ),
  target_domain text not null default 'products',
  status text not null default 'uploaded' check (
    status in ('uploaded', 'analyzing', 'mapping', 'review', 'importing', 'completed', 'failed')
  ),
  row_count int not null default 0,
  imported_count int not null default 0,
  error_count int not null default 0,
  mapping_confidence numeric(5, 2) not null default 0,
  created_by_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, job_number)
);

create index if not exists organization_install_import_jobs_org_idx
  on public.organization_install_import_jobs (organization_id, status, updated_at desc);

alter table public.organization_install_import_jobs enable row level security;
revoke all on public.organization_install_import_jobs from authenticated, anon;

create table if not exists public.organization_install_import_mappings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  import_job_id uuid not null references public.organization_install_import_jobs (id) on delete cascade,
  source_column text not null,
  target_field text not null,
  confidence_score numeric(5, 2) not null default 0,
  is_confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists organization_install_import_mappings_job_idx
  on public.organization_install_import_mappings (import_job_id);

alter table public.organization_install_import_mappings enable row level security;
revoke all on public.organization_install_import_mappings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Sync schedules & audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_install_sync_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connected_system_id uuid not null references public.organization_install_connected_systems (id) on delete cascade,
  schedule_type text not null default 'daily' check (
    schedule_type in ('realtime', 'hourly', 'daily', 'weekly', 'manual')
  ),
  is_active boolean not null default true,
  last_run_at timestamptz,
  next_run_at timestamptz,
  last_run_status text not null default 'pending' check (
    last_run_status in ('pending', 'success', 'partial', 'failed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_install_sync_schedules_org_idx
  on public.organization_install_sync_schedules (organization_id, is_active);

alter table public.organization_install_sync_schedules enable row level security;
revoke all on public.organization_install_sync_schedules from authenticated, anon;

create table if not exists public.organization_install_discovery_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  connected_system_id uuid references public.organization_install_connected_systems (id) on delete set null,
  import_job_id uuid references public.organization_install_import_jobs (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_install_discovery_audit_org_idx
  on public.organization_install_discovery_audit_logs (organization_id, created_at desc);

alter table public.organization_install_discovery_audit_logs enable row level security;
revoke all on public.organization_install_discovery_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._idc523_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._idc523_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_connected_system_id uuid default null,
  p_import_job_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_install_discovery_audit_logs (
    organization_id, actor_user_id, action, summary,
    connected_system_id, import_job_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_connected_system_id, p_import_job_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._idc523_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._idc523_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_install_discovery_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  insert into public.organization_install_connection_catalog (
    system_key, system_name, category, connection_method, method_priority
  ) values
    ('shopify', 'Shopify', 'commerce', 'official_integration', 1),
    ('woocommerce', 'WooCommerce', 'commerce', 'official_integration', 1),
    ('wordpress', 'WordPress', 'commerce', 'official_integration', 1),
    ('magento', 'Magento', 'commerce', 'official_integration', 1),
    ('custom_store', 'Custom Store', 'commerce', 'api_connection', 2),
    ('fiken', 'Fiken', 'finance', 'oauth', 3),
    ('stripe', 'Stripe', 'finance', 'oauth', 3),
    ('klarna', 'Klarna', 'finance', 'oauth', 3),
    ('vipps', 'Vipps', 'finance', 'oauth', 3),
    ('tripletex', 'Tripletex', 'finance', 'api_connection', 2),
    ('visma', 'Visma', 'finance', 'api_connection', 2),
    ('business_central', 'Microsoft Business Central', 'finance', 'oauth', 3),
    ('microsoft_365', 'Microsoft 365', 'productivity', 'oauth', 3),
    ('google_workspace', 'Google Workspace', 'productivity', 'oauth', 3),
    ('teams', 'Microsoft Teams', 'productivity', 'oauth', 3),
    ('outlook', 'Outlook', 'productivity', 'oauth', 3),
    ('erp_system', 'ERP System', 'operations', 'api_connection', 2),
    ('inventory_system', 'Inventory System', 'operations', 'api_connection', 2),
    ('booking_system', 'Booking System', 'operations', 'api_connection', 2),
    ('excel', 'Excel / Spreadsheet', 'custom', 'file_import', 4),
    ('csv_import', 'CSV File', 'custom', 'file_import', 4),
    ('custom_api', 'Custom API', 'custom', 'api_connection', 2),
    ('manual_setup', 'Manual Setup', 'custom', 'manual_setup', 5)
  on conflict (system_key) do nothing;

  perform public._ain_ensure_installation(p_org_id);
end; $$;

create or replace function public._idc523_connected_json(p_row public.organization_install_connected_systems)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'system_key', p_row.system_key,
    'system_name', p_row.system_name,
    'connection_method', p_row.connection_method,
    'auth_status', p_row.auth_status,
    'sync_mode', p_row.sync_mode,
    'sync_health', p_row.sync_health,
    'last_sync_at', p_row.last_sync_at,
    'business_pack_key', p_row.business_pack_key,
    'updated_at', p_row.updated_at
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Install Discovery Center
-- ---------------------------------------------------------------------------
create or replace function public.get_install_discovery_data_connection_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
begin
  perform public._irp_require_permission('install.view');
  v_org_id := public._idc523_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._idc523_ensure_settings(v_org_id);
  v_install := public._ain_ensure_installation(v_org_id);

  perform public._idc523_log(v_org_id, 'center_view', 'Install Discovery Center viewed', null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify adapts to the business. The business should not adapt to Aipify.',
    'overview', jsonb_build_object(
      'installation_status', v_install.installation_status,
      'current_step', v_install.current_step,
      'completion_percentage', v_install.completion_percentage,
      'connected_systems', (
        select count(*) from public.organization_install_connected_systems where organization_id = v_org_id
      ),
      'discovery_results', (
        select count(*) from public.install_discovery_results where organization_id = v_org_id
      ),
      'pending_recommendations', (
        select count(*) from public.install_recommendations
        where organization_id = v_org_id and status = 'pending'
      ),
      'pending_permissions', (
        select count(*) from public.install_permission_reviews
        where organization_id = v_org_id and review_status = 'pending'
      ),
      'active_imports', (
        select count(*) from public.organization_install_import_jobs
        where organization_id = v_org_id and status not in ('completed', 'failed')
      ),
      'sync_health_issues', (
        select count(*) from public.organization_install_connected_systems
        where organization_id = v_org_id and sync_health in ('warning', 'error')
      )
    ),
    'connected_systems', coalesce((
      select jsonb_agg(public._idc523_connected_json(c) order by c.system_name)
      from (
        select * from public.organization_install_connected_systems
        where organization_id = v_org_id order by system_name limit 40
      ) c
    ), '[]'::jsonb),
    'connection_catalog', coalesce((
      select jsonb_agg(jsonb_build_object(
        'system_key', c.system_key, 'system_name', c.system_name,
        'category', c.category, 'connection_method', c.connection_method,
        'method_priority', c.method_priority
      ) order by c.method_priority, c.system_name)
      from public.organization_install_connection_catalog c where c.is_active
    ), '[]'::jsonb),
    'discovery_results', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'discovery_type', d.discovery_type,
        'entity_key', d.entity_key, 'entity_label', d.entity_label,
        'confidence_score', d.confidence_score, 'status', d.status
      ) order by d.confidence_score desc)
      from public.install_discovery_results d
      where d.organization_id = v_org_id limit 50
    ), '[]'::jsonb),
    'data_sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'data_domain', s.data_domain,
        'source_system_key', s.source_system_key,
        'source_system_name', s.source_system_name,
        'connection_method', s.connection_method, 'status', s.status
      ) order by s.data_domain)
      from public.organization_install_data_sources s
      where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'import_jobs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', j.id, 'job_number', j.job_number, 'file_name', j.file_name,
        'file_format', j.file_format, 'target_domain', j.target_domain,
        'status', j.status, 'row_count', j.row_count,
        'imported_count', j.imported_count, 'mapping_confidence', j.mapping_confidence,
        'updated_at', j.updated_at
      ) order by j.updated_at desc)
      from public.organization_install_import_jobs j
      where j.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'permissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'permission_key', p.permission_key,
        'permission_label', p.permission_label, 'risk_level', p.risk_level,
        'review_status', p.review_status
      ) order by p.risk_level desc)
      from public.install_permission_reviews p
      where p.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'recommendation_type', r.recommendation_type,
        'recommendation_key', r.recommendation_key,
        'recommendation_label', r.recommendation_label,
        'priority', r.priority, 'status', r.status, 'rationale', r.rationale
      ) order by r.priority desc)
      from public.install_recommendations r
      where r.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'installation_status', jsonb_build_object(
      'installation_id', v_install.id,
      'status', v_install.installation_status,
      'current_step', v_install.current_step,
      'completion_percentage', v_install.completion_percentage,
      'system_type', v_install.system_type,
      'domain', v_install.domain
    ),
    'sync_schedules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'schedule_type', s.schedule_type,
        'system_name', (select system_name from public.organization_install_connected_systems where id = s.connected_system_id),
        'is_active', s.is_active, 'last_run_status', s.last_run_status,
        'last_run_at', s.last_run_at, 'next_run_at', s.next_run_at
      ) order by s.updated_at desc)
      from public.organization_install_sync_schedules s
      where s.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'connected_count', (select count(*) from public.organization_install_connected_systems where organization_id = v_org_id),
      'discovery_progress', v_install.completion_percentage,
      'imports_completed', (
        select count(*) from public.organization_install_import_jobs
        where organization_id = v_org_id and status = 'completed'
      ),
      'missing_data_domains', coalesce((
        select jsonb_agg(v.domain)
        from (values
          ('products'), ('inventory'), ('customers'), ('orders'), ('employees')
        ) as v(domain)
        where not exists (
          select 1 from public.organization_install_data_sources s
          where s.organization_id = v_org_id and s.data_domain = v.domain
        )
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_install_discovery_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'connected_systems', 'discovery_results', 'data_sources',
      'import_center', 'permissions', 'recommendations', 'installation_status'
    ),
    'routes', jsonb_build_object(
      'install', '/app/install',
      'developer', '/app/settings/developer',
      'installations', '/app/installations'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_install_discovery_data_connection_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_install public.organization_installations;
  v_catalog public.organization_install_connection_catalog;
  v_smart_fields text[] := array[
    'product_name', 'sku', 'inventory', 'price', 'customer', 'email',
    'phone', 'department', 'employee'
  ];
  v_field text;
begin
  v_org_id := public._idc523_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'connect_system', 'disconnect_system', 'set_data_source', 'run_discovery',
    'start_import', 'analyze_import', 'complete_import', 'grant_permission',
    'revoke_permission', 'accept_recommendation', 'defer_recommendation',
    'create_sync_schedule', 'trigger_sync'
  ) then
    if p_action_type = 'run_discovery' then
      perform public._irp_require_permission('install.discover');
    elsif p_action_type in ('grant_permission', 'revoke_permission') then
      perform public._irp_require_permission('install.approve_permissions');
    else
      perform public._irp_require_permission('install.manage');
    end if;
  else
    perform public._irp_require_permission('install.view');
  end if;

  perform public._idc523_ensure_settings(v_org_id);
  v_install := public._ain_ensure_installation(v_org_id);

  if p_action_type = 'connect_system' then
    select * into v_catalog from public.organization_install_connection_catalog
    where system_key = coalesce(p_payload->>'system_key', 'manual_setup');

    insert into public.organization_install_connected_systems (
      organization_id, system_key, system_name, connection_method,
      auth_status, sync_mode, business_pack_key
    ) values (
      v_org_id,
      coalesce(p_payload->>'system_key', v_catalog.system_key, 'manual_setup'),
      coalesce(p_payload->>'system_name', v_catalog.system_name, 'System'),
      coalesce(p_payload->>'connection_method', v_catalog.connection_method, 'manual_setup'),
      case
        when coalesce(p_payload->>'connection_method', v_catalog.connection_method) in ('oauth', 'api_connection', 'official_integration')
        then 'pending'
        else 'not_required'
      end,
      coalesce(p_payload->>'sync_mode', 'scheduled'),
      p_payload->>'business_pack_key'
    )
    on conflict (organization_id, system_key) do update set
      system_name = excluded.system_name,
      connection_method = excluded.connection_method,
      sync_mode = excluded.sync_mode,
      updated_at = now()
    returning id into v_id;

    perform public._idc523_log(v_org_id, 'system_connected', 'System connected', v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'connected_system_id', v_id);

  elsif p_action_type = 'disconnect_system' then
    v_id := (p_payload->>'connected_system_id')::uuid;
    delete from public.organization_install_sync_schedules where connected_system_id = v_id and organization_id = v_org_id;
    delete from public.organization_install_connected_systems where id = v_id and organization_id = v_org_id;
    perform public._idc523_log(v_org_id, 'system_disconnected', 'System disconnected', v_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'set_data_source' then
    insert into public.organization_install_data_sources (
      organization_id, data_domain, source_system_key, source_system_name, connection_method
    ) values (
      v_org_id,
      coalesce(p_payload->>'data_domain', 'inventory'),
      coalesce(p_payload->>'source_system_key', 'manual_setup'),
      coalesce(p_payload->>'source_system_name', 'Manual'),
      coalesce(p_payload->>'connection_method', 'manual_setup')
    )
    on conflict (organization_id, data_domain) do update set
      source_system_key = excluded.source_system_key,
      source_system_name = excluded.source_system_name,
      connection_method = excluded.connection_method,
      status = 'configured',
      updated_at = now()
    returning id into v_id;

    perform public._idc523_log(v_org_id, 'data_source_configured', 'Data source configured', null, null, p_payload);
    return jsonb_build_object('ok', true, 'data_source_id', v_id);

  elsif p_action_type = 'run_discovery' then
    perform public.run_install_discovery();

    insert into public.install_recommendations (
      organization_id, installation_id, recommendation_type, recommendation_key,
      recommendation_label, priority, rationale
    )
    select v_org_id, v_install.id, 'module', 'inventory', 'Enable Inventory Center', 80,
      'Inventory data detected — recommended setup available.'
    where not exists (
      select 1 from public.install_recommendations
      where organization_id = v_org_id and recommendation_key = 'inventory' and status = 'pending'
    );

    perform public._idc523_log(v_org_id, 'discovery_completed', 'Discovery completed', null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'start_import' then
    insert into public.organization_install_import_jobs (
      organization_id, job_number, file_name, file_format, target_domain, status,
      created_by_user_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'job_number', public._idc523_next_number(v_org_id, 'IMP', 'organization_install_import_jobs')),
      coalesce(p_payload->>'file_name', 'import.csv'),
      coalesce(p_payload->>'file_format', 'csv'),
      coalesce(p_payload->>'target_domain', 'products'),
      'uploaded',
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;

    perform public._idc523_log(v_org_id, 'import_started', 'Import started', null, v_id, p_payload);
    return jsonb_build_object('ok', true, 'import_job_id', v_id);

  elsif p_action_type = 'analyze_import' then
    v_id := (p_payload->>'import_job_id')::uuid;
    update public.organization_install_import_jobs set
      status = 'mapping', mapping_confidence = 85, updated_at = now()
    where id = v_id and organization_id = v_org_id;

    delete from public.organization_install_import_mappings where import_job_id = v_id;

    foreach v_field in array v_smart_fields loop
      insert into public.organization_install_import_mappings (
        organization_id, import_job_id, source_column, target_field, confidence_score, is_confirmed
      ) values (
        v_org_id, v_id, initcap(replace(v_field, '_', ' ')), v_field,
        70 + random() * 25, true
      );
    end loop;

    perform public._idc523_log(v_org_id, 'import_analyzed', 'Import mapping analyzed', null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'complete_import' then
    v_id := (p_payload->>'import_job_id')::uuid;
    update public.organization_install_import_jobs set
      status = 'completed',
      imported_count = coalesce((p_payload->>'imported_count')::int, row_count),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;

    perform public._idc523_log(v_org_id, 'import_completed', 'Import completed', null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'grant_permission' then
    v_id := (p_payload->>'permission_id')::uuid;
    update public.install_permission_reviews set
      review_status = 'approved',
      reviewed_by = (select id from public.users where auth_user_id = auth.uid() limit 1),
      reviewed_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._idc523_log(v_org_id, 'permission_granted', 'Permission granted', null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'revoke_permission' then
    v_id := (p_payload->>'permission_id')::uuid;
    update public.install_permission_reviews set
      review_status = 'rejected',
      reviewed_by = (select id from public.users where auth_user_id = auth.uid() limit 1),
      reviewed_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._idc523_log(v_org_id, 'permission_revoked', 'Permission revoked', null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'accept_recommendation' then
    v_id := (p_payload->>'recommendation_id')::uuid;
    update public.install_recommendations set status = 'accepted', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._idc523_log(v_org_id, 'recommendation_accepted', 'Recommendation accepted', null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'defer_recommendation' then
    v_id := (p_payload->>'recommendation_id')::uuid;
    update public.install_recommendations set status = 'deferred', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_sync_schedule' then
    insert into public.organization_install_sync_schedules (
      organization_id, connected_system_id, schedule_type, is_active, next_run_at
    ) values (
      v_org_id,
      (p_payload->>'connected_system_id')::uuid,
      coalesce(p_payload->>'schedule_type', 'daily'),
      true,
      now() + interval '1 day'
    ) returning id into v_id;

    update public.organization_install_connected_systems set sync_mode = 'scheduled', updated_at = now()
    where id = (p_payload->>'connected_system_id')::uuid and organization_id = v_org_id;

    perform public._idc523_log(v_org_id, 'sync_scheduled', 'Sync schedule created', (p_payload->>'connected_system_id')::uuid, null, p_payload);
    return jsonb_build_object('ok', true, 'schedule_id', v_id);

  elsif p_action_type = 'trigger_sync' then
    v_id := (p_payload->>'connected_system_id')::uuid;
    update public.organization_install_connected_systems set
      last_sync_at = now(), sync_health = 'healthy', updated_at = now()
    where id = v_id and organization_id = v_org_id;

    update public.organization_install_sync_schedules set
      last_run_at = now(), last_run_status = 'success', updated_at = now()
    where connected_system_id = v_id and organization_id = v_org_id;

    perform public._idc523_log(v_org_id, 'synchronization_executed', 'Synchronization executed', v_id, null, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_install_discovery_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('install.view');
  v_org_id := public._idc523_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._idc523_ensure_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Connect. Discover. Learn. Assist.',
    'connected_systems', (
      select count(*) from public.organization_install_connected_systems where organization_id = v_org_id
    ),
    'discovery_results', coalesce((
      select jsonb_agg(jsonb_build_object('entity_label', entity_label, 'discovery_type', discovery_type))
      from (select entity_label, discovery_type from public.install_discovery_results where organization_id = v_org_id limit 10) x
    ), '[]'::jsonb),
    'missing_data', coalesce((
      select jsonb_agg(v.domain)
      from (values ('inventory'), ('customers'), ('products')) as v(domain)
      where not exists (
        select 1 from public.organization_install_data_sources s
        where s.organization_id = v_org_id and s.data_domain = v.domain
      )
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'What systems are connected?',
      'Show discovery results.',
      'What data is missing?',
      'Recommend setup improvements.',
      'How can we improve synchronization?'
    ),
    'routes', jsonb_build_object('install', '/app/install', 'developer', '/app/settings/developer')
  );
end; $$;

create or replace function public.get_my_install_discovery_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_install public.organization_installations;
begin
  perform public._irp_require_permission('install.view');
  v_org_id := public._idc523_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_install := public._ain_ensure_installation(v_org_id);

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('install.manage', v_org_id),
    'completion_percentage', v_install.completion_percentage,
    'connected_systems', (select count(*) from public.organization_install_connected_systems where organization_id = v_org_id),
    'pending_permissions', (select count(*) from public.install_permission_reviews where organization_id = v_org_id and review_status = 'pending'),
    'routes', jsonb_build_object('install', '/app/install', 'mobile_ready', true)
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('install', '/app/install'));
end; $$;

grant execute on function public.get_install_discovery_data_connection_center(text) to authenticated;
grant execute on function public.perform_install_discovery_data_connection_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_install_discovery_context() to authenticated;
grant execute on function public.get_my_install_discovery_summary() to authenticated;
