-- Phase 592 — Organizational Integration Hub, Connected Apps & External System Orchestration Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/integrations/*
-- Helpers: _oih592_*

create table if not exists public.organization_oih592_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  integration_center_enabled boolean not null default true,
  permission_governance_enabled boolean not null default true,
  external_action_approval_required boolean not null default true,
  sync_engine_enabled boolean not null default true,
  marketplace_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_oih592_settings enable row level security;
revoke all on public.organization_oih592_settings from authenticated, anon;

create table if not exists public.organization_oih592_connected_apps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  app_key text not null,
  app_name text not null,
  app_type text not null default 'saas',
  app_status text not null default 'connected' check (app_status in ('connected', 'connecting', 'disconnected', 'attention')),
  owner_label text not null default '',
  permissions_summary text not null default '',
  health_status text not null default 'healthy' check (health_status in ('healthy', 'attention', 'failed')),
  connected_at timestamptz not null default now(),
  last_sync_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, app_key)
);

alter table public.organization_oih592_connected_apps enable row level security;
revoke all on public.organization_oih592_connected_apps from authenticated, anon;

create table if not exists public.organization_oih592_available_apps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  app_key text not null,
  app_name text not null,
  app_category text not null check (
    app_category in ('accounting', 'commerce', 'crm', 'communication', 'productivity', 'support', 'hr', 'operations')
  ),
  install_method text not null default 'oauth' check (
    install_method in ('one_click', 'oauth', 'api_key', 'manual', 'enterprise')
  ),
  is_available boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, app_key)
);

alter table public.organization_oih592_available_apps enable row level security;
revoke all on public.organization_oih592_available_apps from authenticated, anon;

create table if not exists public.organization_oih592_api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  key_key text not null,
  key_name text not null,
  key_prefix text not null default 'aip_',
  permissions jsonb not null default '[]'::jsonb,
  key_status text not null default 'active',
  last_used_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, key_key)
);

alter table public.organization_oih592_api_keys enable row level security;
revoke all on public.organization_oih592_api_keys from authenticated, anon;

create table if not exists public.organization_oih592_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  permission_key text not null,
  permission_title text not null,
  read_access boolean not null default false,
  write_access boolean not null default false,
  approval_required boolean not null default false,
  restricted_actions jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, permission_key)
);

alter table public.organization_oih592_permissions enable row level security;
revoke all on public.organization_oih592_permissions from authenticated, anon;

create table if not exists public.organization_oih592_capabilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capability_key text not null,
  capability_title text not null,
  capability_status text not null default 'available',
  approval_required boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, capability_key)
);

alter table public.organization_oih592_capabilities enable row level security;
revoke all on public.organization_oih592_capabilities from authenticated, anon;

create table if not exists public.organization_oih592_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_key text not null,
  health_title text not null,
  connection_status text not null default 'healthy',
  auth_status text not null default 'valid',
  sync_status text not null default 'current',
  api_errors integer not null default 0,
  rate_limit_hits integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, health_key)
);

alter table public.organization_oih592_health enable row level security;
revoke all on public.organization_oih592_health from authenticated, anon;

create table if not exists public.organization_oih592_sync (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sync_key text not null,
  sync_title text not null,
  sync_mode text not null check (sync_mode in ('real_time', 'scheduled', 'manual', 'event_based')),
  sync_status text not null default 'idle',
  last_run_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, sync_key)
);

alter table public.organization_oih592_sync enable row level security;
revoke all on public.organization_oih592_sync from authenticated, anon;

create table if not exists public.organization_oih592_external_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  governance_level text not null default 'approval' check (
    governance_level in ('allowed', 'approval', 'restricted', 'admin_approval')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_oih592_external_actions enable row level security;
revoke all on public.organization_oih592_external_actions from authenticated, anon;

create table if not exists public.organization_oih592_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  integrations jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_oih592_business_packs enable row level security;
revoke all on public.organization_oih592_business_packs from authenticated, anon;

create table if not exists public.organization_oih592_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  log_key text not null,
  log_title text not null,
  log_type text not null default 'connection',
  log_status text not null default 'info',
  occurred_at timestamptz not null default now(),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, log_key)
);

alter table public.organization_oih592_logs enable row level security;
revoke all on public.organization_oih592_logs from authenticated, anon;

create table if not exists public.organization_oih592_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'integration_hub',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_oih592_audit_logs enable row level security;
revoke all on public.organization_oih592_audit_logs from authenticated, anon;

create or replace function public._oih592_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._oih592_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'integration_hub'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_oih592_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'integration_hub'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._oih592_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_oih592_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._oih592_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._oih592_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_oih592_connected_apps where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_oih592_connected_apps (
    organization_id, app_key, app_name, app_type, app_status, owner_label, permissions_summary, health_status, last_sync_at, summary
  ) values
    (p_org_id, 'm365', 'Microsoft 365', 'productivity', 'connected', 'IT Admin', 'Read calendar, send email (approval)', 'healthy', now() - interval '10 minutes', 'Microsoft 365 connected.'),
    (p_org_id, 'google', 'Google Workspace', 'productivity', 'connected', 'Operations', 'Read contacts, calendar', 'healthy', now() - interval '20 minutes', 'Google Workspace connected.'),
    (p_org_id, 'shopify', 'Shopify', 'commerce', 'connected', 'Commerce Lead', 'Read orders, update inventory (approval)', 'attention', now() - interval '2 hours', 'Shopify — sync delay detected.'),
    (p_org_id, 'stripe', 'Stripe', 'commerce', 'connected', 'Finance', 'Read payments, create invoice (approval)', 'healthy', now() - interval '30 minutes', 'Stripe connected.'),
    (p_org_id, 'fiken', 'Fiken', 'accounting', 'connected', 'Finance', 'Read ledger, create invoice (approval)', 'healthy', now() - interval '1 hour', 'Fiken accounting connected.'),
    (p_org_id, 'hubspot', 'HubSpot', 'crm', 'connecting', 'Sales', 'Read contacts', 'attention', null, 'HubSpot connection in progress.');

  insert into public.organization_oih592_available_apps (
    organization_id, app_key, app_name, app_category, install_method, summary
  ) values
    (p_org_id, 'woo', 'WooCommerce', 'commerce', 'oauth', 'Commerce integration via OAuth.'),
    (p_org_id, 'wordpress', 'WordPress', 'operations', 'one_click', 'One-click WordPress install.'),
    (p_org_id, 'vipps', 'Vipps', 'commerce', 'api_key', 'Norwegian payment integration.'),
    (p_org_id, 'klarna', 'Klarna', 'commerce', 'enterprise', 'Enterprise Klarna configuration.'),
    (p_org_id, 'salesforce', 'Salesforce', 'crm', 'oauth', 'CRM via OAuth.'),
    (p_org_id, 'custom_api', 'Custom API', 'operations', 'manual', 'Manual API configuration.');

  insert into public.organization_oih592_api_keys (
    organization_id, key_key, key_name, key_prefix, permissions, summary
  ) values
    (p_org_id, 'key_prod', 'Production API Key', 'aip_live_', '["read:customers","write:invoices:approval"]'::jsonb, 'Production integration key.'),
    (p_org_id, 'key_dev', 'Development API Key', 'aip_test_', '["read:customers"]'::jsonb, 'Development sandbox key.');

  insert into public.organization_oih592_permissions (
    organization_id, permission_key, permission_title, read_access, write_access, approval_required, restricted_actions, summary
  ) values
    (p_org_id, 'perm_customer', 'Customer Data', true, false, false, '[]'::jsonb, 'Read customer metadata only.'),
    (p_org_id, 'perm_invoice', 'Invoicing', true, true, true, '["send_payment"]'::jsonb, 'Create invoice requires approval.'),
    (p_org_id, 'perm_inventory', 'Inventory', true, true, true, '[]'::jsonb, 'Update inventory with approval.'),
    (p_org_id, 'perm_delete', 'Data Deletion', false, true, true, '["delete_data"]'::jsonb, 'Administrative approval required.');

  insert into public.organization_oih592_capabilities (
    organization_id, capability_key, capability_title, approval_required, summary
  ) values
    (p_org_id, 'cap_read_customer', 'Read Customer Data', false, 'Companion can read customer metadata.'),
    (p_org_id, 'cap_create_invoice', 'Create Invoice', true, 'Requires approval before execution.'),
    (p_org_id, 'cap_create_product', 'Create Product', true, 'Catalog changes require approval.'),
    (p_org_id, 'cap_update_inventory', 'Update Inventory', true, 'Inventory writes require approval.'),
    (p_org_id, 'cap_support_ticket', 'Create Support Ticket', false, 'Low-risk support ticket creation.'),
    (p_org_id, 'cap_schedule_meeting', 'Schedule Meeting', false, 'Calendar scheduling allowed.'),
    (p_org_id, 'cap_send_email', 'Send Email', true, 'Outbound email requires approval.'),
    (p_org_id, 'cap_generate_report', 'Generate Report', false, 'Read-only report generation.');

  insert into public.organization_oih592_health (
    organization_id, health_key, health_title, connection_status, auth_status, sync_status, api_errors, rate_limit_hits, summary
  ) values
    (p_org_id, 'health_stripe', 'Stripe', 'healthy', 'valid', 'current', 0, 0, 'Connection healthy.'),
    (p_org_id, 'health_shopify', 'Shopify', 'attention', 'valid', 'delayed', 2, 1, 'Sync delay — needs attention.'),
    (p_org_id, 'health_hubspot', 'HubSpot', 'failed', 'expiring', 'idle', 5, 0, 'Connection failed — auth expiring.');

  insert into public.organization_oih592_sync (
    organization_id, sync_key, sync_title, sync_mode, sync_status, last_run_at, summary
  ) values
    (p_org_id, 'sync_customer', 'Customer Updated → Connected Systems', 'event_based', 'completed', now() - interval '15 minutes', 'Event-based customer sync.'),
    (p_org_id, 'sync_scheduled', 'Nightly Commerce Sync', 'scheduled', 'scheduled', now() - interval '8 hours', 'Scheduled sync every night.'),
    (p_org_id, 'sync_realtime', 'Payment Events', 'real_time', 'active', now() - interval '2 minutes', 'Real-time payment event sync.');

  insert into public.organization_oih592_external_actions (
    organization_id, action_key, action_title, governance_level, summary
  ) values
    (p_org_id, 'act_invoice', 'Create Invoice', 'approval', 'Approval required before invoice creation.'),
    (p_org_id, 'act_payment', 'Send Payment', 'restricted', 'Restricted — finance authorization required.'),
    (p_org_id, 'act_delete', 'Delete Data', 'admin_approval', 'Administrative approval required.');

  insert into public.organization_oih592_business_packs (
    organization_id, pack_key, pack_title, integrations, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', '["Fiken","Stripe","Klarna","Vipps"]'::jsonb, 'Finance Pack integrations.'),
    (p_org_id, 'hosts', 'Hosts Pack', '["Airbnb","Booking","Calendar Systems"]'::jsonb, 'Hosts Pack integrations.'),
    (p_org_id, 'commerce', 'Commerce Pack', '["Shopify","WooCommerce"]'::jsonb, 'Commerce Pack integrations.');

  insert into public.organization_oih592_logs (
    organization_id, log_key, log_title, log_type, log_status, occurred_at, summary
  ) values
    (p_org_id, 'log_install', 'Integration Installed — Stripe', 'installation', 'success', now() - interval '1 day', 'Stripe connected successfully.'),
    (p_org_id, 'log_fail', 'Connection Failed — HubSpot', 'connection', 'error', now() - interval '3 hours', 'OAuth token expired.'),
    (p_org_id, 'log_sync', 'Sync Executed — Shopify', 'sync', 'warning', now() - interval '2 hours', 'Sync completed with warnings.'),
    (p_org_id, 'log_perm', 'Permission Changed — Invoicing', 'permission', 'info', now() - interval '5 hours', 'Write access now requires approval.');

  perform public._oih592_log(p_org_id, 'integration_installed', 'Integration Center baseline seeded.');
end; $$;

create or replace function public.get_organization_integration_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_failed int;
  v_attention int;
begin
  v_org_id := public._oih592_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._oih592_seed(v_org_id);

  select count(*) into v_failed from public.organization_oih592_connected_apps
  where organization_id = v_org_id and health_status = 'failed';
  select count(*) into v_attention from public.organization_oih592_connected_apps
  where organization_id = v_org_id and health_status = 'attention';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Organizations already have software. Aipify should help that software work together.',
      'privacy_note', 'Integration metadata only — Companion never exceeds granted permissions.',
      'executive_dashboard', jsonb_build_object(
        'connected_apps', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id),
        'healthy_connections', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id and health_status = 'healthy'),
        'failed_connections', v_failed,
        'attention_required', v_attention,
        'permission_risks', (select count(*) from public.organization_oih592_permissions where organization_id = v_org_id and approval_required = true)
      ),
      'stats', jsonb_build_object(
        'connected_apps', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id),
        'available_apps', (select count(*) from public.organization_oih592_available_apps where organization_id = v_org_id and is_available = true),
        'active_api_keys', (select count(*) from public.organization_oih592_api_keys where organization_id = v_org_id and key_status = 'active'),
        'capabilities', (select count(*) from public.organization_oih592_capabilities where organization_id = v_org_id),
        'open_health_issues', v_failed + v_attention
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'health_title', h.health_title, 'recommendation', h.summary
        ) order by case h.connection_status when 'failed' then 1 when 'attention' then 2 else 3 end)
        from public.organization_oih592_health h where h.organization_id = v_org_id
        limit 5
      ), '[]'::jsonb),
      'marketplace_categories', jsonb_build_array('accounting','commerce','crm','communication','productivity','support','hr','operations')
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Organizations already have software. Aipify should help that software work together.',
    'privacy_note', 'Integration metadata only.',
    'executive_dashboard', jsonb_build_object(
      'connected_apps', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id),
      'healthy_connections', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id and health_status = 'healthy'),
      'failed_connections', v_failed,
      'attention_required', v_attention,
      'permission_risks', (select count(*) from public.organization_oih592_permissions where organization_id = v_org_id and approval_required = true)
    ),
    'connected_apps', coalesce((select jsonb_agg(jsonb_build_object(
      'app_key', a.app_key, 'app_name', a.app_name, 'app_type', a.app_type, 'app_status', a.app_status,
      'owner_label', a.owner_label, 'permissions_summary', a.permissions_summary,
      'health_status', a.health_status, 'connected_at', a.connected_at, 'last_sync_at', a.last_sync_at, 'summary', a.summary
    ) order by a.app_name) from public.organization_oih592_connected_apps a where a.organization_id = v_org_id), '[]'::jsonb),
    'available_apps', coalesce((select jsonb_agg(jsonb_build_object(
      'app_key', a.app_key, 'app_name', a.app_name, 'app_category', a.app_category,
      'install_method', a.install_method, 'is_available', a.is_available, 'summary', a.summary
    ) order by a.app_category, a.app_name) from public.organization_oih592_available_apps a where a.organization_id = v_org_id), '[]'::jsonb),
    'api_keys', coalesce((select jsonb_agg(jsonb_build_object(
      'key_key', k.key_key, 'key_name', k.key_name, 'key_prefix', k.key_prefix,
      'permissions', k.permissions, 'key_status', k.key_status, 'last_used_at', k.last_used_at, 'summary', k.summary
    ) order by k.key_name) from public.organization_oih592_api_keys k where k.organization_id = v_org_id), '[]'::jsonb),
    'permissions', coalesce((select jsonb_agg(jsonb_build_object(
      'permission_key', p.permission_key, 'permission_title', p.permission_title,
      'read_access', p.read_access, 'write_access', p.write_access, 'approval_required', p.approval_required,
      'restricted_actions', p.restricted_actions, 'summary', p.summary
    ) order by p.permission_title) from public.organization_oih592_permissions p where p.organization_id = v_org_id), '[]'::jsonb),
    'capabilities', coalesce((select jsonb_agg(jsonb_build_object(
      'capability_key', c.capability_key, 'capability_title', c.capability_title,
      'capability_status', c.capability_status, 'approval_required', c.approval_required, 'summary', c.summary
    ) order by c.capability_title) from public.organization_oih592_capabilities c where c.organization_id = v_org_id), '[]'::jsonb),
    'health', coalesce((select jsonb_agg(jsonb_build_object(
      'health_key', h.health_key, 'health_title', h.health_title, 'connection_status', h.connection_status,
      'auth_status', h.auth_status, 'sync_status', h.sync_status, 'api_errors', h.api_errors,
      'rate_limit_hits', h.rate_limit_hits, 'summary', h.summary
    ) order by case h.connection_status when 'failed' then 1 when 'attention' then 2 else 3 end)
    from public.organization_oih592_health h where h.organization_id = v_org_id), '[]'::jsonb),
    'sync', coalesce((select jsonb_agg(jsonb_build_object(
      'sync_key', s.sync_key, 'sync_title', s.sync_title, 'sync_mode', s.sync_mode,
      'sync_status', s.sync_status, 'last_run_at', s.last_run_at, 'summary', s.summary
    ) order by s.sync_title) from public.organization_oih592_sync s where s.organization_id = v_org_id), '[]'::jsonb),
    'external_actions', coalesce((select jsonb_agg(jsonb_build_object(
      'action_key', a.action_key, 'action_title', a.action_title,
      'governance_level', a.governance_level, 'summary', a.summary
    ) order by a.action_title) from public.organization_oih592_external_actions a where a.organization_id = v_org_id), '[]'::jsonb),
    'logs', coalesce((select jsonb_agg(jsonb_build_object(
      'log_key', l.log_key, 'log_title', l.log_title, 'log_type', l.log_type,
      'log_status', l.log_status, 'occurred_at', l.occurred_at, 'summary', l.summary
    ) order by l.occurred_at desc) from public.organization_oih592_logs l where l.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'integrations', p.integrations, 'summary', p.summary
    ) order by p.pack_title) from public.organization_oih592_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'installation_methods', jsonb_build_array('one_click', 'oauth', 'api_key', 'manual', 'enterprise', 'marketplace'),
    'sync_modes', jsonb_build_array('real_time', 'scheduled', 'manual', 'event_based'),
    'reports', jsonb_build_object(
      'connected_systems', 'Which systems are connected?',
      'permissions', 'What permissions exist?',
      'attention', 'What integrations need attention?',
      'capabilities', 'What actions are available?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_oih592_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'integrations', true, 'health', true, 'permissions', true, 'sync_status', true, 'approve_actions', true
    ),
    'marketplace_categories', jsonb_build_array('accounting','commerce','crm','communication','productivity','support','hr','operations')
  );
end;
$$;

create or replace function public.get_aipify_integration_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_integration_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Integration Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'connected',
        'observation', format('%s connected app(s) across your organization.', v_stats->>'connected_apps'),
        'recommendation', 'Review connected app permissions before enabling new capabilities.',
        'href', '/app/integrations/connected-apps'
      ),
      jsonb_build_object(
        'key', 'health',
        'observation', format('%s failed and %s need attention.', v_exec->>'failed_connections', v_exec->>'attention_required'),
        'recommendation', 'Restore failed connections and review sync delays.',
        'href', '/app/integrations/health'
      ),
      jsonb_build_object(
        'key', 'capabilities',
        'observation', format('%s action capabilities registered.', v_stats->>'capabilities'),
        'recommendation', 'Confirm approval rules for write and external actions.',
        'href', '/app/integrations/permissions'
      ),
      jsonb_build_object(
        'key', 'marketplace',
        'observation', format('%s apps available to install.', v_stats->>'available_apps'),
        'recommendation', 'Explore marketplace integrations for your Business Packs.',
        'href', '/app/integrations/available-apps'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_integration_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_integration_center('overview');
end;
$$;

grant execute on function public.get_organization_integration_center(text) to authenticated;
grant execute on function public.get_aipify_integration_advisor_bundle() to authenticated;
grant execute on function public.get_organization_integration_center_mobile_summary() to authenticated;
