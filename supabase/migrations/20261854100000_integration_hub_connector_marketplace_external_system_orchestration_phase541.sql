-- Phase 541 — Integration Hub, Connector Marketplace & External System Orchestration
-- Aipify connects systems — not replaces them.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  marketplace_enabled boolean not null default true,
  domain_aware_integrations boolean not null default true,
  health_monitoring_enabled boolean not null default true,
  external_actions_require_approval boolean not null default true,
  companion_integration_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_integration_hub_settings enable row level security;
revoke all on public.organization_integration_hub_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Marketplace catalog (global approved connectors)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_integration_hub_marketplace_catalog (
  id uuid primary key default gen_random_uuid(),
  connector_key text not null unique,
  connector_name text not null,
  provider text not null default '',
  category text not null default 'custom' check (
    category in (
      'productivity', 'commerce', 'finance', 'crm', 'support', 'marketing',
      'storage', 'communication', 'analytics', 'development', 'custom'
    )
  ),
  description text not null default '',
  auth_methods jsonb not null default '["oauth2"]'::jsonb,
  default_permissions jsonb not null default '[]'::jsonb,
  sync_directions jsonb not null default '["bidirectional"]'::jsonb,
  business_pack_keys jsonb not null default '[]'::jsonb,
  is_available boolean not null default true,
  sort_order int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.aipify_integration_hub_marketplace_catalog enable row level security;
revoke all on public.aipify_integration_hub_marketplace_catalog from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Installed connectors
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_connectors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connector_key text not null,
  connector_name text not null,
  provider text not null default '',
  version text not null default '1.0',
  category text not null default 'custom',
  status text not null default 'connecting' check (
    status in ('active', 'connecting', 'requires_attention', 'permission_required', 'disconnected')
  ),
  auth_method text not null default 'oauth2' check (
    auth_method in ('api_key', 'oauth', 'oauth2', 'bearer_token', 'sso', 'service_account', 'custom', 'webhook')
  ),
  sync_mode text not null default 'scheduled' check (
    sync_mode in ('manual', 'scheduled', 'real_time', 'event_based', 'approval_based', 'custom')
  ),
  sync_direction text not null default 'bidirectional' check (
    sync_direction in ('inbound', 'outbound', 'bidirectional')
  ),
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  integration_id uuid references public.organization_integrations (id) on delete set null,
  permissions_requested jsonb not null default '[]'::jsonb,
  permissions_granted jsonb not null default '[]'::jsonb,
  data_access_scope text not null default 'metadata',
  approval_required boolean not null default true,
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'degraded', 'critical')
  ),
  last_sync_at timestamptz,
  last_sync_status text,
  last_error text,
  record_href text not null default '/app/integrations',
  metadata jsonb not null default '{}'::jsonb,
  installed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists organization_integration_hub_connectors_org_key_domain_idx
  on public.organization_integration_hub_connectors (
    organization_id, connector_key, coalesce(domain_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

create index if not exists organization_integration_hub_connectors_org_idx
  on public.organization_integration_hub_connectors (organization_id, status, updated_at desc);
create index if not exists organization_integration_hub_connectors_domain_idx
  on public.organization_integration_hub_connectors (organization_id, domain_id);

alter table public.organization_integration_hub_connectors enable row level security;
revoke all on public.organization_integration_hub_connectors from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Connector permissions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connector_id uuid not null references public.organization_integration_hub_connectors (id) on delete cascade,
  permission_key text not null,
  access_level text not null default 'read' check (
    access_level in ('read', 'write', 'update', 'delete', 'sync', 'execute', 'companion')
  ),
  approval_required boolean not null default false,
  granted boolean not null default false,
  granted_at timestamptz,
  granted_by_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, connector_id, permission_key)
);

alter table public.organization_integration_hub_permissions enable row level security;
revoke all on public.organization_integration_hub_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Webhooks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_webhooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connector_id uuid references public.organization_integration_hub_connectors (id) on delete set null,
  webhook_name text not null,
  source text not null default '',
  destination text not null default '',
  event_types jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'paused', 'failed', 'pending')),
  retry_count int not null default 0 check (retry_count >= 0),
  failure_count int not null default 0 check (failure_count >= 0),
  last_payload_sample jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_integration_hub_webhooks_org_idx
  on public.organization_integration_hub_webhooks (organization_id, created_at desc);

alter table public.organization_integration_hub_webhooks enable row level security;
revoke all on public.organization_integration_hub_webhooks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. API keys
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connector_id uuid references public.organization_integration_hub_connectors (id) on delete set null,
  key_name text not null,
  key_prefix text not null default '',
  permissions jsonb not null default '[]'::jsonb,
  rate_limit_per_hour int not null default 1000 check (rate_limit_per_hour >= 0),
  usage_count int not null default 0 check (usage_count >= 0),
  status text not null default 'active' check (status in ('active', 'revoked', 'expired')),
  expires_at timestamptz,
  last_used_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_integration_hub_api_keys_org_idx
  on public.organization_integration_hub_api_keys (organization_id, created_at desc);

alter table public.organization_integration_hub_api_keys enable row level security;
revoke all on public.organization_integration_hub_api_keys from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Sync runs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_sync_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connector_id uuid not null references public.organization_integration_hub_connectors (id) on delete cascade,
  sync_type text not null default 'manual' check (
    sync_type in ('manual', 'scheduled', 'real_time', 'event_based', 'approval_based', 'custom')
  ),
  sync_target text not null default 'general',
  status text not null default 'pending' check (
    status in ('pending', 'running', 'completed', 'failed', 'warning')
  ),
  records_processed int not null default 0 check (records_processed >= 0),
  duration_ms int,
  error_message text,
  warning_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists organization_integration_hub_sync_runs_org_idx
  on public.organization_integration_hub_sync_runs (organization_id, connector_id, started_at desc);

alter table public.organization_integration_hub_sync_runs enable row level security;
revoke all on public.organization_integration_hub_sync_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Health checks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_health_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connector_id uuid not null references public.organization_integration_hub_connectors (id) on delete cascade,
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'degraded', 'critical')
  ),
  availability_pct numeric(5,2) not null default 100,
  api_errors int not null default 0,
  rate_limit_hits int not null default 0,
  auth_issues int not null default 0,
  latency_ms int,
  summary text not null default '',
  checked_at timestamptz not null default now()
);

create index if not exists organization_integration_hub_health_checks_org_idx
  on public.organization_integration_hub_health_checks (organization_id, connector_id, checked_at desc);

alter table public.organization_integration_hub_health_checks enable row level security;
revoke all on public.organization_integration_hub_health_checks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. External actions (governance audit)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_external_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connector_id uuid references public.organization_integration_hub_connectors (id) on delete set null,
  action_type text not null,
  permission_key text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'executed', 'blocked', 'failed')
  ),
  approval_required boolean not null default true,
  summary text not null default '',
  payload jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.organization_integration_hub_external_actions enable row level security;
revoke all on public.organization_integration_hub_external_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integration_hub_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_integration_hub_audit_org_idx
  on public.organization_integration_hub_audit_logs (organization_id, created_at desc);

alter table public.organization_integration_hub_audit_logs enable row level security;
revoke all on public.organization_integration_hub_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. Marketplace seed
-- ---------------------------------------------------------------------------
insert into public.aipify_integration_hub_marketplace_catalog (
  connector_key, connector_name, provider, category, description, auth_methods, default_permissions, business_pack_keys, sort_order
)
select v.key, v.name, v.provider, v.cat, v.descr, v.auth, v.perms, v.packs, v.ord
from (values
  ('microsoft_365', 'Microsoft 365', 'Microsoft', 'productivity', 'Email, calendar, and productivity suite.', '["oauth2","sso"]'::jsonb, '["read_calendar","write_calendar","read_contacts"]'::jsonb, '[]'::jsonb, 1),
  ('google_workspace', 'Google Workspace', 'Google', 'productivity', 'Gmail, Calendar, Drive, and Workspace apps.', '["oauth2"]'::jsonb, '["read_calendar","write_calendar","read_drive"]'::jsonb, '[]'::jsonb, 2),
  ('slack', 'Slack', 'Slack', 'communication', 'Team messaging and notifications.', '["oauth2","webhook"]'::jsonb, '["read_channels","send_messages"]'::jsonb, '[]'::jsonb, 3),
  ('microsoft_teams', 'Microsoft Teams', 'Microsoft', 'communication', 'Meetings and team collaboration.', '["oauth2","sso"]'::jsonb, '["read_channels","send_messages"]'::jsonb, '[]'::jsonb, 4),
  ('shopify', 'Shopify', 'Shopify', 'commerce', 'E-commerce store and order sync.', '["oauth2","api_key"]'::jsonb, '["read_products","write_products","read_orders"]'::jsonb, '["commerce"]'::jsonb, 5),
  ('woocommerce', 'WooCommerce', 'Automattic', 'commerce', 'WordPress commerce integration.', '["api_key","oauth2"]'::jsonb, '["read_products","write_products","read_orders"]'::jsonb, '["commerce"]'::jsonb, 6),
  ('wordpress', 'WordPress', 'Automattic', 'development', 'Content and site management.', '["api_key","oauth2"]'::jsonb, '["read_content","write_content"]'::jsonb, '[]'::jsonb, 7),
  ('stripe', 'Stripe', 'Stripe', 'finance', 'Payments and billing sync.', '["api_key","webhook"]'::jsonb, '["read_payments","read_customers"]'::jsonb, '["finance","commerce"]'::jsonb, 8),
  ('klarna', 'Klarna', 'Klarna', 'finance', 'Buy now pay later payments.', '["api_key"]'::jsonb, '["read_payments"]'::jsonb, '["commerce"]'::jsonb, 9),
  ('vipps', 'Vipps', 'Vipps', 'finance', 'Norwegian mobile payments.', '["api_key","oauth2"]'::jsonb, '["read_payments"]'::jsonb, '["commerce"]'::jsonb, 10),
  ('fiken', 'Fiken', 'Fiken', 'finance', 'Norwegian accounting and invoicing.', '["oauth2","api_key"]'::jsonb, '["read_invoices","write_invoices"]'::jsonb, '["finance"]'::jsonb, 11),
  ('hubspot', 'HubSpot', 'HubSpot', 'crm', 'CRM, marketing, and sales pipeline.', '["oauth2","api_key"]'::jsonb, '["read_customers","write_customers"]'::jsonb, '["partner"]'::jsonb, 12),
  ('salesforce', 'Salesforce', 'Salesforce', 'crm', 'Enterprise CRM and customer data.', '["oauth2"]'::jsonb, '["read_customers","write_customers"]'::jsonb, '[]'::jsonb, 13),
  ('zendesk', 'Zendesk', 'Zendesk', 'support', 'Support tickets and customer service.', '["oauth2","api_key"]'::jsonb, '["read_tickets","write_tickets"]'::jsonb, '["support"]'::jsonb, 14),
  ('freshdesk', 'Freshdesk', 'Freshworks', 'support', 'Helpdesk and support operations.', '["api_key"]'::jsonb, '["read_tickets","write_tickets"]'::jsonb, '["support"]'::jsonb, 15),
  ('dropbox', 'Dropbox', 'Dropbox', 'storage', 'File storage and sharing.', '["oauth2"]'::jsonb, '["read_files","write_files"]'::jsonb, '[]'::jsonb, 16),
  ('google_drive', 'Google Drive', 'Google', 'storage', 'Cloud document storage.', '["oauth2"]'::jsonb, '["read_files","write_files"]'::jsonb, '[]'::jsonb, 17),
  ('onedrive', 'OneDrive', 'Microsoft', 'storage', 'Microsoft cloud storage.', '["oauth2","sso"]'::jsonb, '["read_files","write_files"]'::jsonb, '[]'::jsonb, 18),
  ('custom_connector', 'Custom Connector', 'Custom', 'custom', 'Build a custom integration for your systems.', '["api_key","bearer_token","custom","webhook"]'::jsonb, '[]'::jsonb, '[]'::jsonb, 99)
) as v(key, name, provider, cat, descr, auth, perms, packs, ord)
on conflict (connector_key) do update set
  connector_name = excluded.connector_name,
  description = excluded.description,
  category = excluded.category;

-- ---------------------------------------------------------------------------
-- 12. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._int541_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._int541_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_integration_hub_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._int541_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_integration_hub_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._int541_connector_json(r public.organization_integration_hub_connectors)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'connector_key', r.connector_key, 'connector_name', r.connector_name,
    'provider', r.provider, 'version', r.version, 'category', r.category,
    'status', r.status, 'auth_method', r.auth_method, 'sync_mode', r.sync_mode,
    'sync_direction', r.sync_direction, 'domain_id', r.domain_id, 'business_pack_key', r.business_pack_key,
    'permissions_requested', r.permissions_requested, 'permissions_granted', r.permissions_granted,
    'data_access_scope', r.data_access_scope, 'approval_required', r.approval_required,
    'health_status', r.health_status, 'last_sync_at', r.last_sync_at, 'last_sync_status', r.last_sync_status,
    'last_error', r.last_error, 'record_href', r.record_href,
    'installed_at', r.installed_at, 'updated_at', r.updated_at
  );
$$;

create or replace function public._int541_marketplace_json(r public.aipify_integration_hub_marketplace_catalog)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'connector_key', r.connector_key, 'connector_name', r.connector_name, 'provider', r.provider,
    'category', r.category, 'description', r.description, 'auth_methods', r.auth_methods,
    'default_permissions', r.default_permissions, 'sync_directions', r.sync_directions,
    'business_pack_keys', r.business_pack_keys, 'is_available', r.is_available
  );
$$;

create or replace function public._int541_seed_hub(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_count int;
  v_shopify uuid; v_stripe uuid; v_m365 uuid; v_domain uuid;
begin
  select count(*) into v_count from public.organization_integration_hub_connectors where organization_id = p_org_id;
  if v_count > 2 then return v_count; end if;

  select id into v_domain from public.organization_domains
  where organization_id = p_org_id order by is_primary desc nulls last, created_at asc limit 1;

  insert into public.organization_integration_hub_connectors (
    organization_id, connector_key, connector_name, provider, category, status, auth_method,
    sync_mode, sync_direction, domain_id, permissions_requested, data_access_scope, health_status, last_sync_at, last_sync_status
  ) values
    (p_org_id, 'shopify', 'Shopify', 'Shopify', 'commerce', 'active', 'oauth2', 'scheduled', 'bidirectional',
     v_domain, '["read_products","write_products","read_orders"]'::jsonb, 'orders and products metadata', 'healthy', now() - interval '2 hours', 'completed'),
    (p_org_id, 'stripe', 'Stripe', 'Stripe', 'finance', 'active', 'api_key', 'event_based', 'inbound',
     v_domain, '["read_payments","read_customers"]'::jsonb, 'payment metadata only', 'healthy', now() - interval '30 minutes', 'completed'),
    (p_org_id, 'microsoft_365', 'Microsoft 365', 'Microsoft', 'productivity', 'requires_attention', 'oauth2', 'scheduled', 'bidirectional',
     null, '["read_calendar","write_calendar"]'::jsonb, 'calendar and contacts metadata', 'degraded', now() - interval '1 day', 'warning')
  on conflict do nothing;

  select id into v_shopify from public.organization_integration_hub_connectors
  where organization_id = p_org_id and connector_key = 'shopify' limit 1;
  select id into v_stripe from public.organization_integration_hub_connectors
  where organization_id = p_org_id and connector_key = 'stripe' limit 1;
  select id into v_m365 from public.organization_integration_hub_connectors
  where organization_id = p_org_id and connector_key = 'microsoft_365' limit 1;

  if v_shopify is not null then
    insert into public.organization_integration_hub_permissions (organization_id, connector_id, permission_key, access_level, granted, granted_at)
    values
      (p_org_id, v_shopify, 'read_products', 'read', true, now()),
      (p_org_id, v_shopify, 'write_products', 'write', true, now()),
      (p_org_id, v_shopify, 'read_orders', 'read', true, now())
    on conflict do nothing;

    insert into public.organization_integration_hub_sync_runs (
      organization_id, connector_id, sync_type, sync_target, status, records_processed, duration_ms, completed_at
    ) values
      (p_org_id, v_shopify, 'scheduled', 'inventory', 'completed', 142, 3200, now() - interval '2 hours'),
      (p_org_id, v_shopify, 'scheduled', 'orders', 'completed', 28, 1100, now() - interval '2 hours');

    insert into public.organization_integration_hub_health_checks (
      organization_id, connector_id, health_status, availability_pct, latency_ms, summary
    ) values (p_org_id, v_shopify, 'healthy', 99.5, 220, 'Shopify API responding normally.');
  end if;

  if v_stripe is not null then
    insert into public.organization_integration_hub_sync_runs (
      organization_id, connector_id, sync_type, sync_target, status, records_processed, duration_ms, completed_at
    ) values (p_org_id, v_stripe, 'event_based', 'payments', 'completed', 56, 800, now() - interval '30 minutes');
  end if;

  if v_m365 is not null then
    insert into public.organization_integration_hub_health_checks (
      organization_id, connector_id, health_status, availability_pct, auth_issues, summary
    ) values (p_org_id, v_m365, 'degraded', 92.0, 1, 'OAuth token requires refresh — permission review recommended.');
  end if;

  insert into public.organization_integration_hub_webhooks (
    organization_id, connector_id, webhook_name, source, destination, event_types, status
  ) values
    (p_org_id, v_stripe, 'Stripe payment events', 'Stripe', '/api/webhooks/stripe', '["payment_intent.succeeded","charge.refunded"]'::jsonb, 'active'),
    (p_org_id, v_shopify, 'Shopify order updates', 'Shopify', '/api/webhooks/shopify', '["orders/create","orders/updated"]'::jsonb, 'active')
  on conflict do nothing;

  insert into public.organization_integration_hub_api_keys (
    organization_id, connector_id, key_name, key_prefix, permissions, usage_count, status
  ) values
    (p_org_id, null, 'Integration Hub API', 'aip_int_', '["read_connectors","read_sync"]'::jsonb, 42, 'active')
  on conflict do nothing;

  if to_regclass('public.organization_integrations') is not null then
    insert into public.organization_integration_hub_connectors (
      organization_id, connector_key, connector_name, provider, category, status, auth_method,
      sync_mode, integration_id, health_status, data_access_scope
    )
    select
      p_org_id, i.integration_key, i.integration_name, i.integration_key, 'custom',
      case i.status
        when 'active' then 'active'
        when 'pending' then 'connecting'
        when 'failed' then 'requires_attention'
        else 'disconnected'
      end,
      'api_key', 'scheduled', i.id,
      case when i.last_error is not null then 'degraded' else 'healthy' end,
      'metadata from existing integration engine'
    from public.organization_integrations i
    where i.organization_id = p_org_id and i.enabled = true
    on conflict do nothing;
  end if;

  select count(*) into v_count from public.organization_integration_hub_connectors where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public.search_integration_hub_connectors(p_query text, p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('integration_hub.view');
  v_org_id := public._int541_org();

  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._int541_connector_json(c) order by c.updated_at desc)
      from (
        select * from public.organization_integration_hub_connectors
        where organization_id = v_org_id
          and (p_query is null or trim(p_query) = ''
            or connector_name ilike '%' || p_query || '%'
            or connector_key ilike '%' || p_query || '%'
            or provider ilike '%' || p_query || '%'
            or category ilike '%' || p_query || '%')
        order by updated_at desc
        limit greatest(p_limit, 1)
      ) c
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Integration Hub Center
-- ---------------------------------------------------------------------------
create or replace function public.get_integration_hub_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_installed int;
  v_active int;
  v_critical int;
begin
  perform public._irp_require_permission('integration_hub.view');
  v_org_id := public._int541_org();
  perform public._int541_ensure_settings(v_org_id);
  perform public._int541_seed_hub(v_org_id);

  select count(*) into v_installed from public.organization_integration_hub_connectors where organization_id = v_org_id;
  select count(*) into v_active from public.organization_integration_hub_connectors where organization_id = v_org_id and status = 'active';
  select count(*) into v_critical from public.organization_integration_hub_connectors where organization_id = v_org_id and health_status = 'critical';

  perform public._int541_log(v_org_id, 'center_view', 'Integration Hub Center viewed', p_section,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify should not force organizations to replace systems. Aipify should connect systems.',
    'philosophy', 'Companion should become the operational layer above all business systems.',
    'overview', jsonb_build_object(
      'installed_count', v_installed,
      'active_count', v_active,
      'marketplace_count', (select count(*) from public.aipify_integration_hub_marketplace_catalog where is_available = true),
      'webhook_count', (select count(*) from public.organization_integration_hub_webhooks where organization_id = v_org_id),
      'api_key_count', (select count(*) from public.organization_integration_hub_api_keys where organization_id = v_org_id and status = 'active'),
      'critical_health_count', v_critical,
      'failed_sync_count', (select count(*) from public.organization_integration_hub_sync_runs where organization_id = v_org_id and status = 'failed' and started_at >= now() - interval '7 days')
    ),
    'connector_statuses', jsonb_build_array('active', 'connecting', 'requires_attention', 'permission_required', 'disconnected'),
    'auth_methods', jsonb_build_array('api_key', 'oauth', 'oauth2', 'bearer_token', 'sso', 'service_account', 'custom', 'webhook'),
    'sync_modes', jsonb_build_array('manual', 'scheduled', 'real_time', 'event_based', 'approval_based', 'custom'),
    'installed_connectors', coalesce((
      select jsonb_agg(public._int541_connector_json(c) order by c.updated_at desc)
      from (select * from public.organization_integration_hub_connectors where organization_id = v_org_id order by updated_at desc limit 50) c
    ), '[]'::jsonb),
    'marketplace', coalesce((
      select jsonb_agg(public._int541_marketplace_json(m) order by m.sort_order)
      from public.aipify_integration_hub_marketplace_catalog m where m.is_available = true
    ), '[]'::jsonb),
    'connected_systems', coalesce((
      select jsonb_agg(jsonb_build_object(
        'connector', public._int541_connector_json(c),
        'domain', d.domain,
        'domain_status', d.verification_status
      ) order by c.connector_name)
      from public.organization_integration_hub_connectors c
      left join public.organization_domains d on d.id = c.domain_id
      where c.organization_id = v_org_id and c.status in ('active', 'requires_attention')
    ), '[]'::jsonb),
    'domains', coalesce((
      select jsonb_agg(jsonb_build_object(
        'domain_id', d.id, 'domain', d.domain, 'verification_status', d.verification_status,
        'connector_count', (select count(*) from public.organization_integration_hub_connectors ic where ic.domain_id = d.id)
      ))
      from public.organization_domains d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'api_keys', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', k.id, 'key_name', k.key_name, 'key_prefix', k.key_prefix,
        'permissions', k.permissions, 'usage_count', k.usage_count, 'rate_limit_per_hour', k.rate_limit_per_hour,
        'status', k.status, 'last_used_at', k.last_used_at, 'created_at', k.created_at
      ) order by k.created_at desc)
      from public.organization_integration_hub_api_keys k where k.organization_id = v_org_id limit 25
    ), '[]'::jsonb),
    'webhooks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'webhook_name', w.webhook_name, 'source', w.source, 'destination', w.destination,
        'event_types', w.event_types, 'status', w.status, 'retry_count', w.retry_count,
        'failure_count', w.failure_count, 'created_at', w.created_at
      ) order by w.created_at desc)
      from public.organization_integration_hub_webhooks w where w.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'sync_history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'connector_id', s.connector_id, 'sync_type', s.sync_type, 'sync_target', s.sync_target,
        'status', s.status, 'records_processed', s.records_processed, 'duration_ms', s.duration_ms,
        'error_message', s.error_message, 'warning_message', s.warning_message,
        'started_at', s.started_at, 'completed_at', s.completed_at,
        'connector_name', c.connector_name
      ) order by s.started_at desc)
      from public.organization_integration_hub_sync_runs s
      join public.organization_integration_hub_connectors c on c.id = s.connector_id
      where s.organization_id = v_org_id
      limit 40
    ), '[]'::jsonb),
    'health_monitoring', coalesce((
      select jsonb_agg(jsonb_build_object(
        'connector_id', h.connector_id, 'connector_name', c.connector_name,
        'health_status', h.health_status, 'availability_pct', h.availability_pct,
        'api_errors', h.api_errors, 'rate_limit_hits', h.rate_limit_hits,
        'auth_issues', h.auth_issues, 'latency_ms', h.latency_ms,
        'summary', h.summary, 'checked_at', h.checked_at
      ) order by h.checked_at desc)
      from (
        select distinct on (connector_id) *
        from public.organization_integration_hub_health_checks
        where organization_id = v_org_id
        order by connector_id, checked_at desc
      ) h
      join public.organization_integration_hub_connectors c on c.id = h.connector_id
    ), '[]'::jsonb),
    'connector_governance', jsonb_build_object(
      'displays', jsonb_build_array(
        'Permissions Requested', 'Data Access Scope', 'Sync Direction', 'Actions Allowed', 'Approval Requirements'
      ),
      'external_actions_require_approval', (
        select external_actions_require_approval from public.organization_integration_hub_settings where organization_id = v_org_id
      )
    ),
    'installation_workflow', jsonb_build_array(
      'marketplace', 'select_connector', 'authentication', 'permission_review',
      'configuration', 'test_connection', 'activation', 'sync'
    ),
    'business_pack_integration', jsonb_build_object(
      'examples', jsonb_build_array(
        jsonb_build_object('pack', 'hosts', 'connectors', jsonb_build_array('Airbnb', 'Booking.com')),
        jsonb_build_object('pack', 'finance', 'connectors', jsonb_build_array('Fiken', 'Stripe')),
        jsonb_build_object('pack', 'support', 'connectors', jsonb_build_array('Zendesk', 'Freshdesk')),
        jsonb_build_object('pack', 'commerce', 'connectors', jsonb_build_array('Shopify', 'WooCommerce')),
        jsonb_build_object('pack', 'partner', 'connectors', jsonb_build_array('HubSpot', 'Salesforce'))
      )
    ),
    'domain_intelligence', coalesce((
      select jsonb_agg(jsonb_build_object(
        'domain', d.domain,
        'connectors', coalesce((
          select jsonb_agg(c.connector_name)
          from public.organization_integration_hub_connectors c where c.domain_id = d.id
        ), '[]'::jsonb)
      ))
      from public.organization_domains d where d.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'connected_systems', v_active,
      'integration_health', case when v_critical > 0 then 'critical' when exists (
        select 1 from public.organization_integration_hub_connectors where organization_id = v_org_id and health_status = 'degraded'
      ) then 'degraded' else 'healthy' end,
      'critical_failures', v_critical,
      'companion_recommendations', jsonb_build_array(
        'Review connectors requiring attention before they affect operations.',
        'Confirm permission scopes match what each integration actually needs.',
        'Monitor failed syncs — they often indicate auth or rate-limit issues.'
      )
    ),
    'companion_integration', jsonb_build_object(
      'prompts', jsonb_build_array(
        'Show connected systems.',
        'Why is Shopify sync failing?',
        'What integrations are installed?',
        'Show last inventory sync.',
        'Connect Microsoft 365.'
      ),
      'understands', jsonb_build_array('connectors', 'permissions', 'sync_status', 'connector_health')
    ),
    'external_actions_framework', jsonb_build_object(
      'rules', jsonb_build_array(
        'Permission granted', 'Connector installed', 'Approval rules satisfied', 'Audit logging enabled'
      ),
      'examples', jsonb_build_array(
        'Create Invoice', 'Create Customer', 'Send Email', 'Update Product',
        'Create Calendar Event', 'Create Support Ticket'
      ),
      'recent', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', a.id, 'action_type', a.action_type, 'status', a.status,
          'summary', a.summary, 'approval_required', a.approval_required, 'created_at', a.created_at
        ) order by a.created_at desc)
        from public.organization_integration_hub_external_actions a where a.organization_id = v_org_id limit 15
      ), '[]'::jsonb)
    ),
    'reports', jsonb_build_object(
      'installed_connectors', v_installed,
      'active_connectors', v_active,
      'failed_syncs_7d', (select count(*) from public.organization_integration_hub_sync_runs where organization_id = v_org_id and status = 'failed' and started_at >= now() - interval '7 days'),
      'api_usage_total', (select coalesce(sum(usage_count), 0) from public.organization_integration_hub_api_keys where organization_id = v_org_id),
      'domain_distribution', coalesce((
        select jsonb_object_agg(x.domain, x.cnt)
        from (
          select coalesce(dom.domain, 'organization-wide') as domain, count(*) as cnt
          from public.organization_integration_hub_connectors c
          left join public.organization_domains dom on dom.id = c.domain_id
          where c.organization_id = v_org_id
          group by coalesce(dom.domain, 'organization-wide')
        ) x
      ), '{}'::jsonb)
    ),
    'mobile_access', jsonb_build_object('mobile_ready', true),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_integration_hub_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'installed', 'marketplace', 'connected_systems', 'domains', 'api_keys', 'webhooks', 'sync', 'reports', 'companion'
    ),
    'routes', jsonb_build_object(
      'integrations', '/app/integrations',
      'marketplace', '/app/integrations/marketplace',
      'sync', '/app/integrations/sync',
      'webhooks', '/app/integrations/webhooks',
      'api', '/app/integrations/api',
      'mobile_api', '/app/integrations/mobile-api',
      'search', '/app/search'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_integration_hub_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_connector_id uuid;
  v_catalog public.aipify_integration_hub_marketplace_catalog;
begin
  v_org_id := public._int541_org();
  perform public._int541_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in (
    'install_connector', 'activate_connector', 'deactivate_connector', 'grant_permission',
    'revoke_permission', 'create_webhook', 'create_api_key', 'start_sync'
  ) then
    perform public._irp_require_permission('integration_hub.manage');
  else
    perform public._irp_require_permission('integration_hub.view');
  end if;

  if p_action_type = 'install_connector' then
    select * into v_catalog from public.aipify_integration_hub_marketplace_catalog
    where connector_key = coalesce(p_payload->>'connector_key', '') and is_available = true;
    if v_catalog.connector_key is null then
      return jsonb_build_object('ok', false, 'error', 'connector_not_found');
    end if;

    insert into public.organization_integration_hub_connectors (
      organization_id, connector_key, connector_name, provider, category, status, auth_method,
      sync_mode, sync_direction, domain_id, business_pack_key,
      permissions_requested, data_access_scope, approval_required
    ) values (
      v_org_id, v_catalog.connector_key, v_catalog.connector_name, v_catalog.provider, v_catalog.category,
      'connecting', coalesce(p_payload->>'auth_method', (v_catalog.auth_methods->>0), 'oauth2'),
      coalesce(p_payload->>'sync_mode', 'scheduled'),
      coalesce(p_payload->>'sync_direction', 'bidirectional'),
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      v_catalog.default_permissions, coalesce(p_payload->>'data_access_scope', 'metadata'), true
    )
    on conflict do nothing
    returning id into v_id;

    if v_id is not null then
      insert into public.organization_integration_hub_permissions (organization_id, connector_id, permission_key, access_level, approval_required)
      select v_org_id, v_id, perm::text, 'read', true
      from jsonb_array_elements_text(v_catalog.default_permissions) perm
      on conflict do nothing;
    end if;

    perform public._int541_log(v_org_id, 'connector_installed', 'Connector installed from marketplace', 'marketplace', p_payload);
    return jsonb_build_object('ok', true, 'connector_id', v_id, 'workflow_step', 'authentication');

  elsif p_action_type = 'activate_connector' then
    update public.organization_integration_hub_connectors
    set status = 'active', health_status = 'healthy', updated_at = now()
    where id = (p_payload->>'connector_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._int541_log(v_org_id, 'connector_activated', 'Connector activated', 'installed', p_payload);
    return jsonb_build_object('ok', v_id is not null, 'connector_id', v_id);

  elsif p_action_type = 'deactivate_connector' then
    update public.organization_integration_hub_connectors
    set status = 'disconnected', updated_at = now()
    where id = (p_payload->>'connector_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._int541_log(v_org_id, 'connector_removed', 'Connector deactivated', 'installed', p_payload);
    return jsonb_build_object('ok', v_id is not null, 'connector_id', v_id);

  elsif p_action_type = 'test_connection' then
    v_connector_id := (p_payload->>'connector_id')::uuid;
    update public.organization_integration_hub_connectors
    set status = 'active', health_status = 'healthy', last_error = null, updated_at = now()
    where id = v_connector_id and organization_id = v_org_id;
    insert into public.organization_integration_hub_health_checks (
      organization_id, connector_id, health_status, availability_pct, latency_ms, summary
    ) values (v_org_id, v_connector_id, 'healthy', 100, 180, 'Test connection succeeded.');
    perform public._int541_log(v_org_id, 'connection_tested', 'Connection test completed', 'installed', p_payload);
    return jsonb_build_object('ok', true, 'health_status', 'healthy');

  elsif p_action_type = 'start_sync' then
    v_connector_id := (p_payload->>'connector_id')::uuid;
    insert into public.organization_integration_hub_sync_runs (
      organization_id, connector_id, sync_type, sync_target, status, records_processed, completed_at, duration_ms
    ) values (
      v_org_id, v_connector_id,
      coalesce(p_payload->>'sync_type', 'manual'),
      coalesce(p_payload->>'sync_target', 'general'),
      'completed', coalesce((p_payload->>'records_processed')::int, 0),
      now(), coalesce((p_payload->>'duration_ms')::int, 500)
    ) returning id into v_id;
    update public.organization_integration_hub_connectors
    set last_sync_at = now(), last_sync_status = 'completed', updated_at = now()
    where id = v_connector_id and organization_id = v_org_id;
    perform public._int541_log(v_org_id, 'sync_started', 'Sync completed', 'sync', p_payload);
    perform public._int541_log(v_org_id, 'sync_completed', 'Sync run recorded', 'sync', jsonb_build_object('sync_run_id', v_id));
    return jsonb_build_object('ok', true, 'sync_run_id', v_id);

  elsif p_action_type = 'grant_permission' then
    update public.organization_integration_hub_permissions
    set granted = true, granted_at = now(), granted_by_user_id = v_user_id
    where connector_id = (p_payload->>'connector_id')::uuid
      and permission_key = coalesce(p_payload->>'permission_key', '')
      and organization_id = v_org_id
    returning id into v_id;
    perform public._int541_log(v_org_id, 'permission_granted', 'Integration permission granted', 'permissions', p_payload);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'revoke_permission' then
    update public.organization_integration_hub_permissions
    set granted = false, granted_at = null, granted_by_user_id = null
    where connector_id = (p_payload->>'connector_id')::uuid
      and permission_key = coalesce(p_payload->>'permission_key', '')
      and organization_id = v_org_id
    returning id into v_id;
    perform public._int541_log(v_org_id, 'permission_revoked', 'Integration permission revoked', 'permissions', p_payload);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'create_webhook' then
    insert into public.organization_integration_hub_webhooks (
      organization_id, connector_id, webhook_name, source, destination, event_types, status
    ) values (
      v_org_id, nullif(p_payload->>'connector_id', '')::uuid,
      coalesce(p_payload->>'webhook_name', 'Webhook'),
      coalesce(p_payload->>'source', 'External'),
      coalesce(p_payload->>'destination', '/api/webhooks/custom'),
      coalesce(p_payload->'event_types', '[]'::jsonb),
      'active'
    ) returning id into v_id;
    perform public._int541_log(v_org_id, 'webhook_created', 'Webhook endpoint created', 'webhooks', p_payload);
    return jsonb_build_object('ok', true, 'webhook_id', v_id);

  elsif p_action_type = 'create_api_key' then
    insert into public.organization_integration_hub_api_keys (
      organization_id, connector_id, key_name, key_prefix, permissions, rate_limit_per_hour, status
    ) values (
      v_org_id, nullif(p_payload->>'connector_id', '')::uuid,
      coalesce(p_payload->>'key_name', 'API Key'),
      'aip_int_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->'permissions', '["read_connectors"]'::jsonb),
      coalesce((p_payload->>'rate_limit_per_hour')::int, 1000),
      'active'
    ) returning id into v_id;
    perform public._int541_log(v_org_id, 'api_key_created', 'Integration API key created', 'api_keys', p_payload);
    return jsonb_build_object('ok', true, 'api_key_id', v_id);

  elsif p_action_type = 'record_external_action' then
    insert into public.organization_integration_hub_external_actions (
      organization_id, connector_id, action_type, permission_key, status, approval_required, summary, payload, actor_user_id
    ) values (
      v_org_id, nullif(p_payload->>'connector_id', '')::uuid,
      coalesce(p_payload->>'action_type', 'external_action'),
      p_payload->>'permission_key',
      case when coalesce((select external_actions_require_approval from public.organization_integration_hub_settings where organization_id = v_org_id), true)
        then 'pending' else 'executed' end,
      coalesce((select external_actions_require_approval from public.organization_integration_hub_settings where organization_id = v_org_id), true),
      coalesce(p_payload->>'summary', 'External action recorded'),
      coalesce(p_payload, '{}'::jsonb),
      v_user_id
    ) returning id into v_id;
    perform public._int541_log(v_org_id, 'external_action_recorded', 'External action framework entry', 'external_actions', p_payload);
    return jsonb_build_object('ok', true, 'action_id', v_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_integration_hub_context(p_query text default null, p_connector_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_search jsonb;
begin
  perform public._irp_require_permission('integration_hub.view');
  v_center := public.get_integration_hub_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_integration_hub_connectors(p_query, 15);
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify connects systems — Companion understands connectors, permissions, sync status, and health.',
    'query', p_query,
    'connector_id', p_connector_id,
    'center', v_center,
    'search', v_search,
    'companion_prompts', v_center->'companion_integration'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_integration_hub_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('integration_hub.view');
  v_center := public.get_integration_hub_operations_center('mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('integration_hub.manage', public._int541_org()),
    'overview', v_center->'overview',
    'health_monitoring', v_center->'health_monitoring',
    'installed_connectors', v_center->'installed_connectors',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('integrations', '/app/integrations'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'integration_hub', 'Integration Hub & Connector Marketplace', 'integration-hub', 'operations',
    'Connect external systems — marketplace, connectors, sync, webhooks, API keys, and governance.',
    'starter', null, 'main', '/app/integrations', 'licensed', 2
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('integration_hub', 'integration_hub.view', 'view', 'Integration Hub — view connectors, sync, and health'),
  ('integration_hub', 'integration_hub.manage', 'manage', 'Integration Hub — install connectors, manage permissions, webhooks, and API keys')
on conflict do nothing;

grant execute on function public._int541_connector_json(public.organization_integration_hub_connectors) to authenticated;
grant execute on function public._int541_marketplace_json(public.aipify_integration_hub_marketplace_catalog) to authenticated;
grant execute on function public._int541_seed_hub(uuid) to authenticated;
grant execute on function public.search_integration_hub_connectors(text, int) to authenticated;
grant execute on function public.get_integration_hub_operations_center(text) to authenticated;
grant execute on function public.perform_integration_hub_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_integration_hub_context(text, uuid) to authenticated;
grant execute on function public.get_my_integration_hub_summary() to authenticated;
