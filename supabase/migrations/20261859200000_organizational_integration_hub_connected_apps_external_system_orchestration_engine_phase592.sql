-- Phase 592 — Organizational Integration Hub, Connected Apps & External System Orchestration Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/integrations/*
-- Helpers: _oih592_*

create table if not exists public.organization_oih592_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  integration_hub_enabled boolean not null default true,
  health_monitoring_enabled boolean not null default true,
  permission_governance_enabled boolean not null default true,
  external_action_approval_required boolean not null default true,
  marketplace_foundation_enabled boolean not null default true,
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
  app_type text not null default 'saas' check (
    app_type in ('saas', 'commerce', 'finance', 'crm', 'productivity', 'custom_api')
  ),
  connection_status text not null default 'active' check (
    connection_status in ('active', 'connecting', 'needs_attention', 'failed', 'disconnected')
  ),
  owner_label text not null default '',
  permissions_summary text not null default '',
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'needs_attention', 'connection_failed')
  ),
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
    install_method in ('one_click', 'oauth', 'api_key', 'manual', 'enterprise', 'marketplace')
  ),
  app_status text not null default 'available',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, app_key)
);

alter table public.organization_oih592_available_apps enable row level security;
revoke all on public.organization_oih592_available_apps from authenticated, anon;

create table if not exists public.organization_oih592_api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  key_key text not null,
  key_label text not null,
  key_scope text not null default 'read',
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
  access_level text not null check (access_level in ('read', 'write', 'restricted', 'approval_required')),
  audit_required boolean not null default true,
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
  capability_status text not null default 'available' check (capability_status in ('available', 'approval_required', 'restricted')),
  governance_rule text not null default '',
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
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'needs_attention', 'connection_failed')
  ),
  auth_status text not null default 'valid',
  sync_status text not null default 'current',
  api_errors integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, health_key)
);

alter table public.organization_oih592_health enable row level security;
revoke all on public.organization_oih592_health from authenticated, anon;

create table if not exists public.organization_oih592_sync_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sync_key text not null,
  sync_title text not null,
  sync_mode text not null check (sync_mode in ('real_time', 'scheduled', 'manual', 'event_based')),
  sync_status text not null default 'completed',
  triggered_by text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  synced_at timestamptz not null default now(),
  unique (organization_id, sync_key)
);

alter table public.organization_oih592_sync_runs enable row level security;
revoke all on public.organization_oih592_sync_runs from authenticated, anon;

create table if not exists public.organization_oih592_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  log_key text not null,
  log_title text not null,
  log_type text not null check (
    log_type in ('connection', 'permission', 'sync', 'external_action', 'error', 'audit')
  ),
  severity text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  logged_at timestamptz not null default now(),
  unique (organization_id, log_key)
);

alter table public.organization_oih592_logs enable row level security;
revoke all on public.organization_oih592_logs from authenticated, anon;

create table if not exists public.organization_oih592_external_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  governance_level text not null default 'approval_required' check (
    governance_level in ('allowed', 'approval_required', 'restricted', 'administrative')
  ),
  notification_rule text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_oih592_external_actions enable row level security;
revoke all on public.organization_oih592_external_actions from authenticated, anon;

create table if not exists public.organization_oih592_marketplace (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category_key text not null,
  category_title text not null,
  app_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, category_key)
);

alter table public.organization_oih592_marketplace enable row level security;
revoke all on public.organization_oih592_marketplace from authenticated, anon;

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
    organization_id, app_key, app_name, app_type, connection_status, owner_label, permissions_summary, health_status, last_sync_at, summary
  ) values
    (p_org_id, 'microsoft_365', 'Microsoft 365', 'productivity', 'active', 'IT Admin', 'Read calendar · Send email', 'healthy', now() - interval '10 minutes', 'Microsoft 365 connected.'),
    (p_org_id, 'google_workspace', 'Google Workspace', 'productivity', 'active', 'Operations', 'Read contacts · Calendar sync', 'healthy', now() - interval '20 minutes', 'Google Workspace connected.'),
    (p_org_id, 'shopify', 'Shopify', 'commerce', 'active', 'Commerce Lead', 'Read orders · Update inventory', 'healthy', now() - interval '5 minutes', 'Shopify store connected.'),
    (p_org_id, 'woocommerce', 'WooCommerce', 'commerce', 'needs_attention', 'Commerce Lead', 'Read products', 'needs_attention', now() - interval '2 hours', 'WooCommerce sync delayed.'),
    (p_org_id, 'wordpress', 'WordPress', 'saas', 'active', 'Web Admin', 'Read content', 'healthy', now() - interval '1 hour', 'WordPress site connected.'),
    (p_org_id, 'stripe', 'Stripe', 'finance', 'active', 'Finance', 'Read payments', 'healthy', now() - interval '15 minutes', 'Stripe payments connected.'),
    (p_org_id, 'vipps', 'Vipps', 'finance', 'active', 'Finance', 'Process payments', 'healthy', now() - interval '30 minutes', 'Vipps connected.'),
    (p_org_id, 'klarna', 'Klarna', 'finance', 'active', 'Finance', 'Read settlements', 'healthy', now() - interval '45 minutes', 'Klarna connected.'),
    (p_org_id, 'fiken', 'Fiken', 'finance', 'active', 'Finance', 'Create invoice · Read ledger', 'healthy', now() - interval '1 hour', 'Fiken accounting connected.'),
    (p_org_id, 'hubspot', 'HubSpot', 'crm', 'active', 'Sales', 'Read contacts · Create deals', 'healthy', now() - interval '25 minutes', 'HubSpot CRM connected.'),
    (p_org_id, 'salesforce', 'Salesforce', 'crm', 'connecting', 'Sales', 'Read accounts', 'needs_attention', null, 'Salesforce OAuth in progress.'),
    (p_org_id, 'custom_api', 'Custom API', 'custom_api', 'active', 'Developer', 'Scoped API access', 'healthy', now() - interval '3 hours', 'Custom API integration.');

  insert into public.organization_oih592_available_apps (
    organization_id, app_key, app_name, app_category, install_method, summary
  ) values
    (p_org_id, 'avail_fiken', 'Fiken', 'accounting', 'oauth', 'Norwegian accounting integration.'),
    (p_org_id, 'avail_airbnb', 'Airbnb', 'operations', 'oauth', 'Hosts Pack — property bookings.'),
    (p_org_id, 'avail_booking', 'Booking.com', 'operations', 'enterprise', 'Hosts Pack — channel manager.'),
    (p_org_id, 'avail_slack', 'Slack', 'communication', 'one_click', 'Team notifications and alerts.');

  insert into public.organization_oih592_api_keys (
    organization_id, key_key, key_label, key_scope, key_status, last_used_at, summary
  ) values
    (p_org_id, 'key_prod', 'Production API Key', 'read_write', 'active', now() - interval '1 hour', 'Scoped production key.'),
    (p_org_id, 'key_sync', 'Sync Service Key', 'sync', 'active', now() - interval '30 minutes', 'Event-based sync key.');

  insert into public.organization_oih592_permissions (
    organization_id, permission_key, permission_title, access_level, audit_required, summary
  ) values
    (p_org_id, 'perm_read', 'Read Access', 'read', true, 'Read customer and operational metadata.'),
    (p_org_id, 'perm_write', 'Write Access', 'write', true, 'Update records in connected systems.'),
    (p_org_id, 'perm_approval', 'Approval Required', 'approval_required', true, 'Sensitive writes require approval.'),
    (p_org_id, 'perm_restricted', 'Restricted Actions', 'restricted', true, 'Payment and delete operations restricted.');

  insert into public.organization_oih592_capabilities (
    organization_id, capability_key, capability_title, capability_status, governance_rule, summary
  ) values
    (p_org_id, 'cap_read_customer', 'Read Customer Data', 'available', 'Read-only by default', 'View customer metadata.'),
    (p_org_id, 'cap_create_invoice', 'Create Invoice', 'approval_required', 'Approval required', 'Finance Pack capability.'),
    (p_org_id, 'cap_create_product', 'Create Product', 'approval_required', 'Role validation', 'Commerce catalog updates.'),
    (p_org_id, 'cap_update_inventory', 'Update Inventory', 'available', 'Audit logging', 'Warehouse sync capability.'),
    (p_org_id, 'cap_support_ticket', 'Create Support Ticket', 'available', 'Notification rules', 'Support Pack capability.'),
    (p_org_id, 'cap_schedule_meeting', 'Schedule Meeting', 'available', 'Calendar permissions', 'Productivity integration.'),
    (p_org_id, 'cap_send_email', 'Send Email', 'approval_required', 'Trust action policy', 'Communication capability.'),
    (p_org_id, 'cap_generate_report', 'Generate Report', 'available', 'Audit logging', 'Executive reporting.');

  insert into public.organization_oih592_health (
    organization_id, health_key, health_title, health_status, auth_status, sync_status, api_errors, summary
  ) values
    (p_org_id, 'health_shopify', 'Shopify Connection', 'healthy', 'valid', 'current', 0, 'Connection healthy.'),
    (p_org_id, 'health_woo', 'WooCommerce Connection', 'needs_attention', 'valid', 'delayed', 2, 'Sync delay detected.'),
    (p_org_id, 'health_salesforce', 'Salesforce Connection', 'connection_failed', 'expiring', 'failed', 5, 'OAuth token expiring.');

  insert into public.organization_oih592_sync_runs (
    organization_id, sync_key, sync_title, sync_mode, sync_status, triggered_by, summary, synced_at
  ) values
    (p_org_id, 'sync_customer', 'Customer Updated → Sync', 'event_based', 'completed', 'customer_updated', 'Event-based sync to connected systems.', now() - interval '20 minutes'),
    (p_org_id, 'sync_scheduled', 'Scheduled Commerce Sync', 'scheduled', 'completed', 'scheduler', 'Nightly catalog sync.', now() - interval '8 hours'),
    (p_org_id, 'sync_manual', 'Manual Finance Sync', 'manual', 'completed', 'finance_admin', 'Manual ledger reconciliation.', now() - interval '2 days');

  insert into public.organization_oih592_logs (
    organization_id, log_key, log_title, log_type, severity, summary, logged_at
  ) values
    (p_org_id, 'log_conn_restored', 'Connection Restored', 'connection', 'information', 'WooCommerce connection restored after retry.', now() - interval '1 hour'),
    (p_org_id, 'log_perm_changed', 'Permission Changed', 'permission', 'attention', 'Stripe write scope approved by admin.', now() - interval '3 hours'),
    (p_org_id, 'log_sync', 'Sync Executed', 'sync', 'information', 'Customer update propagated to Shopify.', now() - interval '20 minutes'),
    (p_org_id, 'log_action', 'External Action Triggered', 'external_action', 'attention', 'Create invoice queued for approval.', now() - interval '45 minutes');

  insert into public.organization_oih592_external_actions (
    organization_id, action_key, action_title, governance_level, notification_rule, summary
  ) values
    (p_org_id, 'act_invoice', 'Create Invoice', 'approval_required', 'Notify finance approvers', 'Approval required before execution.'),
    (p_org_id, 'act_payment', 'Send Payment', 'restricted', 'Critical — admin only', 'Restricted external action.'),
    (p_org_id, 'act_delete', 'Delete Data', 'administrative', 'Administrative approval required', 'Never auto-execute.');

  insert into public.organization_oih592_marketplace (
    organization_id, category_key, category_title, app_count, summary
  ) values
    (p_org_id, 'accounting', 'Accounting', 8, 'Fiken, Tripletex, and more.'),
    (p_org_id, 'commerce', 'Commerce', 12, 'Shopify, WooCommerce, and more.'),
    (p_org_id, 'crm', 'CRM', 6, 'HubSpot, Salesforce, and more.'),
    (p_org_id, 'communication', 'Communication', 5, 'Email, chat, and notifications.'),
    (p_org_id, 'productivity', 'Productivity', 7, 'Microsoft 365, Google Workspace.'),
    (p_org_id, 'support', 'Support', 4, 'Helpdesk and ticketing.'),
    (p_org_id, 'hr', 'HR', 3, 'People and payroll systems.'),
    (p_org_id, 'operations', 'Operations', 9, 'Warehouse, hosts, and logistics.');

  insert into public.organization_oih592_business_packs (
    organization_id, pack_key, pack_title, integrations, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', '["Fiken","Stripe","Klarna","Vipps"]'::jsonb, 'Finance Pack integrations.'),
    (p_org_id, 'hosts', 'Hosts Pack', '["Airbnb","Booking.com","Calendar Systems"]'::jsonb, 'Hosts Pack integrations.'),
    (p_org_id, 'commerce', 'Commerce Pack', '["Shopify","WooCommerce"]'::jsonb, 'Commerce Pack integrations.');

  perform public._oih592_log(p_org_id, 'integration_installed', 'Integration hub baseline seeded.');
end; $$;

create or replace function public.get_organization_integration_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_healthy integer;
  v_attention integer;
  v_failed integer;
begin
  v_org_id := public._oih592_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._oih592_seed(v_org_id);

  select count(*) into v_healthy from public.organization_oih592_connected_apps
  where organization_id = v_org_id and health_status = 'healthy';
  select count(*) into v_attention from public.organization_oih592_connected_apps
  where organization_id = v_org_id and health_status = 'needs_attention';
  select count(*) into v_failed from public.organization_oih592_connected_apps
  where organization_id = v_org_id and health_status = 'connection_failed';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Organizations already have software. Aipify should help that software work together.',
      'privacy_note', 'Integration metadata only — Companion never exceeds granted permissions.',
      'executive_dashboard', jsonb_build_object(
        'connected_apps', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id and connection_status = 'active'),
        'healthy_connections', v_healthy,
        'needs_attention', v_attention,
        'failed_connections', v_failed,
        'permission_risks', (select count(*) from public.organization_oih592_permissions where organization_id = v_org_id and access_level in ('restricted', 'approval_required')),
        'recent_syncs', (select count(*) from public.organization_oih592_sync_runs where organization_id = v_org_id)
      ),
      'stats', jsonb_build_object(
        'connected_apps', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id),
        'available_apps', (select count(*) from public.organization_oih592_available_apps where organization_id = v_org_id),
        'active_api_keys', (select count(*) from public.organization_oih592_api_keys where organization_id = v_org_id and key_status = 'active'),
        'capabilities', (select count(*) from public.organization_oih592_capabilities where organization_id = v_org_id),
        'marketplace_categories', (select count(*) from public.organization_oih592_marketplace where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'health_title', h.health_title, 'recommendation', h.summary
        ) order by case h.health_status when 'connection_failed' then 1 when 'needs_attention' then 2 else 3 end)
        from public.organization_oih592_health h
        where h.organization_id = v_org_id
        limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Organizations already have software. Aipify should help that software work together.',
    'privacy_note', 'Integration metadata only.',
    'executive_dashboard', jsonb_build_object(
      'connected_apps', (select count(*) from public.organization_oih592_connected_apps where organization_id = v_org_id and connection_status = 'active'),
      'healthy_connections', v_healthy,
      'needs_attention', v_attention,
      'failed_connections', v_failed,
      'permission_risks', (select count(*) from public.organization_oih592_permissions where organization_id = v_org_id and access_level in ('restricted', 'approval_required')),
      'recent_syncs', (select count(*) from public.organization_oih592_sync_runs where organization_id = v_org_id)
    ),
    'connected_apps', coalesce((select jsonb_agg(jsonb_build_object(
      'app_key', a.app_key, 'app_name', a.app_name, 'app_type', a.app_type,
      'connection_status', a.connection_status, 'owner_label', a.owner_label,
      'permissions_summary', a.permissions_summary, 'health_status', a.health_status,
      'connected_at', a.connected_at, 'last_sync_at', a.last_sync_at, 'summary', a.summary
    ) order by a.app_name) from public.organization_oih592_connected_apps a where a.organization_id = v_org_id), '[]'::jsonb),
    'available_apps', coalesce((select jsonb_agg(jsonb_build_object(
      'app_key', a.app_key, 'app_name', a.app_name, 'app_category', a.app_category,
      'install_method', a.install_method, 'app_status', a.app_status, 'summary', a.summary
    ) order by a.app_name) from public.organization_oih592_available_apps a where a.organization_id = v_org_id), '[]'::jsonb),
    'api_keys', coalesce((select jsonb_agg(jsonb_build_object(
      'key_key', k.key_key, 'key_label', k.key_label, 'key_scope', k.key_scope,
      'key_status', k.key_status, 'last_used_at', k.last_used_at, 'summary', k.summary
    ) order by k.key_label) from public.organization_oih592_api_keys k where k.organization_id = v_org_id), '[]'::jsonb),
    'permissions', coalesce((select jsonb_agg(jsonb_build_object(
      'permission_key', p.permission_key, 'permission_title', p.permission_title,
      'access_level', p.access_level, 'audit_required', p.audit_required, 'summary', p.summary
    ) order by p.permission_title) from public.organization_oih592_permissions p where p.organization_id = v_org_id), '[]'::jsonb),
    'capabilities', coalesce((select jsonb_agg(jsonb_build_object(
      'capability_key', c.capability_key, 'capability_title', c.capability_title,
      'capability_status', c.capability_status, 'governance_rule', c.governance_rule, 'summary', c.summary
    ) order by c.capability_title) from public.organization_oih592_capabilities c where c.organization_id = v_org_id), '[]'::jsonb),
    'health', coalesce((select jsonb_agg(jsonb_build_object(
      'health_key', h.health_key, 'health_title', h.health_title, 'health_status', h.health_status,
      'auth_status', h.auth_status, 'sync_status', h.sync_status, 'api_errors', h.api_errors, 'summary', h.summary
    ) order by case h.health_status when 'connection_failed' then 1 when 'needs_attention' then 2 else 3 end)
    from public.organization_oih592_health h where h.organization_id = v_org_id), '[]'::jsonb),
    'sync_runs', coalesce((select jsonb_agg(jsonb_build_object(
      'sync_key', s.sync_key, 'sync_title', s.sync_title, 'sync_mode', s.sync_mode,
      'sync_status', s.sync_status, 'triggered_by', s.triggered_by, 'summary', s.summary, 'synced_at', s.synced_at
    ) order by s.synced_at desc) from public.organization_oih592_sync_runs s where s.organization_id = v_org_id), '[]'::jsonb),
    'logs', coalesce((select jsonb_agg(jsonb_build_object(
      'log_key', l.log_key, 'log_title', l.log_title, 'log_type', l.log_type,
      'severity', l.severity, 'summary', l.summary, 'logged_at', l.logged_at
    ) order by l.logged_at desc) from public.organization_oih592_logs l where l.organization_id = v_org_id), '[]'::jsonb),
    'external_actions', coalesce((select jsonb_agg(jsonb_build_object(
      'action_key', e.action_key, 'action_title', e.action_title,
      'governance_level', e.governance_level, 'notification_rule', e.notification_rule, 'summary', e.summary
    ) order by e.action_title) from public.organization_oih592_external_actions e where e.organization_id = v_org_id), '[]'::jsonb),
    'marketplace', coalesce((select jsonb_agg(jsonb_build_object(
      'category_key', m.category_key, 'category_title', m.category_title,
      'app_count', m.app_count, 'summary', m.summary
    ) order by m.category_title) from public.organization_oih592_marketplace m where m.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'integrations', p.integrations, 'summary', p.summary
    ) order by p.pack_title) from public.organization_oih592_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'connected_systems', 'Which systems are connected?',
      'permissions', 'What permissions exist?',
      'attention', 'What integrations need attention?',
      'actions', 'What actions are available?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_oih592_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'integrations', true, 'health', true, 'permissions', true, 'sync_status', true, 'approve_actions', true
    )
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
    'briefing_title', 'Integration Report',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'connected',
        'observation', format('%s connected app(s) across your organization.', v_stats->>'connected_apps'),
        'recommendation', 'Review connected app registry and owners.',
        'href', '/app/integrations/connected-apps'
      ),
      jsonb_build_object(
        'key', 'health',
        'observation', format('%s connection(s) need attention — %s failed.', v_exec->>'needs_attention', v_exec->>'failed_connections'),
        'recommendation', 'Restore failed connections and renew expiring authentication.',
        'href', '/app/integrations/health'
      ),
      jsonb_build_object(
        'key', 'permissions',
        'observation', format('%s permission governance rule(s) active.', v_stats->>'capabilities'),
        'recommendation', 'Confirm Companion never exceeds granted permissions.',
        'href', '/app/integrations/permissions'
      ),
      jsonb_build_object(
        'key', 'marketplace',
        'observation', format('%s marketplace categories available.', v_stats->>'marketplace_categories'),
        'recommendation', 'Install Business Pack integrations from Available Apps.',
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
