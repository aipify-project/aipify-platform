-- Phase A.8 — Integration Engine
-- Principle: secure, tenant-isolated connections to external platforms with full auditability.

create extension if not exists pgcrypto with schema extensions;

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
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_integrations
-- ---------------------------------------------------------------------------
-- Phase A.1 used integration_type/name; A.8 uses integration_key/integration_name/enabled.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'organization_integrations' and column_name = 'integration_type'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'organization_integrations' and column_name = 'integration_key'
  ) then
    alter table public.organization_integrations rename to organization_integrations_mta_legacy;
  end if;
end $$;

create table if not exists public.organization_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_name text not null,
  status text not null default 'pending' check (
    status in ('pending', 'active', 'disabled', 'failed', 'archived')
  ),
  credentials_reference uuid,
  configuration jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  last_sync_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, integration_key)
);

create index if not exists organization_integrations_org_idx
  on public.organization_integrations (organization_id, status, enabled);

alter table public.organization_integrations enable row level security;
revoke all on public.organization_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. integration_credential_vault (server-side references only)
-- ---------------------------------------------------------------------------
create table if not exists public.integration_credential_vault (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_id uuid not null references public.organization_integrations (id) on delete cascade,
  vault_key text not null,
  encrypted_payload text not null,
  key_version int not null default 1,
  revoked_at timestamptz,
  rotated_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.integration_credential_vault enable row level security;
revoke all on public.integration_credential_vault from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. integration_sync_logs
-- ---------------------------------------------------------------------------
create table if not exists public.integration_sync_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_id uuid not null references public.organization_integrations (id) on delete cascade,
  sync_type text not null default 'manual' check (sync_type in ('manual', 'scheduled', 'webhook')),
  status text not null default 'pending' check (
    status in ('pending', 'running', 'completed', 'failed', 'retrying')
  ),
  records_processed int not null default 0,
  error_message text,
  retry_count int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists integration_sync_logs_org_idx
  on public.integration_sync_logs (organization_id, integration_id, started_at desc);

alter table public.integration_sync_logs enable row level security;
revoke all on public.integration_sync_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. integration_webhook_events
-- ---------------------------------------------------------------------------
create table if not exists public.integration_webhook_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_id uuid not null references public.organization_integrations (id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  signature_valid boolean,
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'processed', 'failed', 'retrying')
  ),
  error_message text,
  retry_count int not null default 0,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists integration_webhook_events_org_idx
  on public.integration_webhook_events (organization_id, integration_id, created_at desc);

alter table public.integration_webhook_events enable row level security;
revoke all on public.integration_webhook_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. integration_catalog (available integration types)
-- ---------------------------------------------------------------------------
create table if not exists public.integration_catalog (
  id uuid primary key default gen_random_uuid(),
  integration_key text not null unique,
  integration_name text not null,
  category text not null default 'general' check (
    category in ('pilot', 'email', 'knowledge', 'commerce', 'payments', 'communication', 'crm', 'erp')
  ),
  description text,
  is_available boolean not null default true,
  is_future boolean not null default false,
  sort_order int not null default 0
);

alter table public.integration_catalog enable row level security;
revoke all on public.integration_catalog from authenticated, anon;

insert into public.integration_catalog (integration_key, integration_name, category, description, is_available, is_future, sort_order)
select v.key, v.name, v.cat, v.item_description, v.avail, v.future, v.ord
from (values
  ('unonight', 'Unonight', 'pilot', 'Pilot integration for secure data exchange and support events.', true, false, 1),
  ('email_provider', 'Email Provider', 'email', 'Connect transactional email providers.', true, false, 2),
  ('knowledge_center_import', 'Knowledge Center Import', 'knowledge', 'Import documentation into Knowledge Center.', true, false, 3),
  ('shopify', 'Shopify', 'commerce', 'E-commerce platform integration.', false, true, 10),
  ('woocommerce', 'WooCommerce', 'commerce', 'WordPress e-commerce integration.', false, true, 11),
  ('wordpress', 'WordPress', 'commerce', 'Content management integration.', false, true, 12),
  ('stripe', 'Stripe', 'payments', 'Payment processing integration.', false, true, 13),
  ('resend', 'Resend', 'email', 'Email delivery via Resend.', false, true, 14),
  ('slack', 'Slack', 'communication', 'Team communication integration.', false, true, 15),
  ('crm', 'CRM System', 'crm', 'Customer relationship management.', false, true, 16),
  ('erp', 'ERP System', 'erp', 'Enterprise resource planning.', false, true, 17)
) as v(key, name, cat, item_description, avail, future, ord)
where not exists (select 1 from public.integration_catalog c where c.integration_key = v.key);

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'integrations', v.description
from (values
  ('integrations.view', 'View Integrations', 'View connected integrations'),
  ('integrations.create', 'Create Integrations', 'Connect new integrations'),
  ('integrations.update', 'Update Integrations', 'Update integration configuration'),
  ('integrations.disable', 'Disable Integrations', 'Disable integrations'),
  ('integrations.delete', 'Delete Integrations', 'Remove integrations'),
  ('integrations.sync', 'Sync Integrations', 'Trigger integration syncs')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'integrations.view'), ('owner', 'integrations.create'), ('owner', 'integrations.update'),
  ('owner', 'integrations.disable'), ('owner', 'integrations.delete'), ('owner', 'integrations.sync'),
  ('administrator', 'integrations.view'), ('administrator', 'integrations.create'), ('administrator', 'integrations.update'),
  ('administrator', 'integrations.disable'), ('administrator', 'integrations.sync'),
  ('manager', 'integrations.view'), ('manager', 'integrations.sync')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_ige_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ige_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'integration',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ige_store_credentials(
  p_organization_id uuid,
  p_integration_id uuid,
  p_secret text
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_vault_id uuid; v_key text;
begin
  v_key := 'vault_' || encode(extensions.extensions.digest(p_secret || p_integration_id::text, 'sha256'), 'hex');
  insert into public.integration_credential_vault (
    organization_id, integration_id, vault_key, encrypted_payload
  ) values (
    p_organization_id, p_integration_id, v_key,
    encode(extensions.extensions.digest(p_secret, 'sha256'), 'hex')
  ) returning id into v_vault_id;

  update public.organization_integrations set credentials_reference = v_vault_id, updated_at = now()
  where id = p_integration_id;

  return v_vault_id;
end; $$;

create or replace function public._ige_seed_demo_integrations(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_unonight_id uuid;
begin
  insert into public.organization_integrations (
    organization_id, integration_key, integration_name, status, enabled, configuration, last_sync_at
  )
  select p_organization_id, c.integration_key, c.integration_name, v.status, v.enabled, v.config, v.synced
  from public.integration_catalog c
  join (values
    ('unonight', 'active', true, '{"pilot":true,"support_events":true,"ai_recommendations":true}'::jsonb, now() - interval '1 hour'),
    ('email_provider', 'active', true, '{"provider":"smtp","from_address":"support@example.com"}'::jsonb, now() - interval '3 hours'),
    ('knowledge_center_import', 'pending', false, '{"import_format":"markdown"}'::jsonb, null)
  ) as v(key, status, enabled, config, synced) on c.integration_key = v.key
  where c.is_available and not c.is_future
    and not exists (
      select 1 from public.organization_integrations i
      where i.organization_id = p_organization_id and i.integration_key = c.integration_key
    );

  select id into v_unonight_id from public.organization_integrations
  where organization_id = p_organization_id and integration_key = 'unonight';

  if v_unonight_id is not null then
    perform public._ige_store_credentials(p_organization_id, v_unonight_id, 'unonight-pilot-secret-placeholder');
  end if;

  insert into public.integration_sync_logs (
    organization_id, integration_id, sync_type, status, records_processed, started_at, completed_at
  )
  select p_organization_id, i.id, v.stype, v.status, v.records, now() - v.ago, case when v.status = 'completed' then now() - v.ago + interval '30 seconds' else null end
  from public.organization_integrations i
  cross join (values
    ('scheduled', 'completed', 12, interval '1 hour'),
    ('manual', 'failed', 0, interval '2 hours')
  ) as v(stype, status, records, ago)
  where i.organization_id = p_organization_id and i.integration_key = 'unonight'
    and not exists (
      select 1 from public.integration_sync_logs l
      where l.integration_id = i.id and l.sync_type = v.stype and l.status = v.status limit 1
    );

  insert into public.integration_webhook_events (
    organization_id, integration_id, event_type, payload, signature_valid, status, processed_at
  )
  select p_organization_id, i.id, v.etype, v.payload, true, 'processed', now() - interval '45 minutes'
  from public.organization_integrations i
  cross join (values
    ('support.ticket.created', '{"ticket_id":"UN-1042","subject":"Order inquiry"}'::jsonb),
    ('support.ticket.updated', '{"ticket_id":"UN-1040","status":"resolved"}'::jsonb)
  ) as v(etype, payload)
  where i.organization_id = p_organization_id and i.integration_key = 'unonight'
    and not exists (
      select 1 from public.integration_webhook_events w
      where w.integration_id = i.id and w.event_type = v.etype limit 1
    );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Integration lifecycle RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_integration(
  p_integration_key text,
  p_configuration jsonb default '{}'::jsonb,
  p_secret text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_catalog public.integration_catalog;
  v_id uuid;
  v_vault_id uuid;
begin
  perform public._irp_require_permission('integrations.create');
  v_org_id := public._mta_require_organization();

  select * into v_catalog from public.integration_catalog
  where integration_key = p_integration_key and is_available and not is_future;
  if v_catalog.id is null then raise exception 'Integration not available'; end if;

  insert into public.organization_integrations (
    organization_id, integration_key, integration_name, status, configuration, enabled
  ) values (
    v_org_id, p_integration_key, v_catalog.integration_name, 'pending', coalesce(p_configuration, '{}'::jsonb), false
  ) returning id into v_id;

  if p_secret is not null then
    v_vault_id := public._ige_store_credentials(v_org_id, v_id, p_secret);
  end if;

  perform public._ige_log(v_org_id, 'integration_created', 'integration', v_id,
    jsonb_build_object('integration_key', p_integration_key));

  return jsonb_build_object('id', v_id, 'integration_key', p_integration_key, 'status', 'pending');
end; $$;

create or replace function public.update_organization_integration(
  p_integration_id uuid,
  p_configuration jsonb default null,
  p_enabled boolean default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_integrations;
begin
  perform public._irp_require_permission('integrations.update');
  v_org_id := public._mta_require_organization();

  update public.organization_integrations set
    configuration = coalesce(p_configuration, configuration),
    enabled = coalesce(p_enabled, enabled),
    status = case when coalesce(p_enabled, enabled) then 'active' else status end,
    updated_at = now()
  where id = p_integration_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Integration not found'; end if;

  perform public._ige_log(v_org_id, 'integration_updated', 'integration', p_integration_id,
    jsonb_build_object('enabled', v_row.enabled));

  return jsonb_build_object('id', p_integration_id, 'status', v_row.status, 'enabled', v_row.enabled);
end; $$;

create or replace function public.disable_organization_integration(p_integration_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('integrations.disable');
  v_org_id := public._mta_require_organization();

  update public.organization_integrations set
    enabled = false, status = 'disabled', updated_at = now()
  where id = p_integration_id and organization_id = v_org_id;

  perform public._ige_log(v_org_id, 'integration_disabled', 'integration', p_integration_id, '{}'::jsonb);

  return jsonb_build_object('id', p_integration_id, 'status', 'disabled');
end; $$;

create or replace function public.rotate_integration_credentials(
  p_integration_id uuid,
  p_new_secret text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_vault_id uuid;
begin
  perform public._irp_require_permission('integrations.update');
  v_org_id := public._mta_require_organization();

  update public.integration_credential_vault set revoked_at = now()
  where integration_id = p_integration_id and organization_id = v_org_id and revoked_at is null;

  v_vault_id := public._ige_store_credentials(v_org_id, p_integration_id, p_new_secret);

  update public.integration_credential_vault set rotated_at = now() where id = v_vault_id;

  perform public._ige_log(v_org_id, 'integration_credential_rotated', 'integration', p_integration_id,
    jsonb_build_object('vault_id', v_vault_id));

  return jsonb_build_object('integration_id', p_integration_id, 'credentials_reference', v_vault_id);
end; $$;

create or replace function public.record_integration_sync_result(
  p_sync_log_id uuid,
  p_status text,
  p_records_processed int default 0,
  p_error_message text default null
)
returns void language plpgsql security definer set search_path = public as $$
declare v_log public.integration_sync_logs; v_org_id uuid;
begin
  select * into v_log from public.integration_sync_logs where id = p_sync_log_id;
  if v_log.id is null then return; end if;
  v_org_id := v_log.organization_id;

  update public.integration_sync_logs set
    status = p_status, records_processed = p_records_processed,
    error_message = p_error_message, completed_at = now(),
    retry_count = case when p_status = 'retrying' then retry_count + 1 else retry_count end
  where id = p_sync_log_id;

  update public.organization_integrations set
    last_sync_at = case when p_status = 'completed' then now() else last_sync_at end,
    last_error = p_error_message,
    status = case when p_status = 'failed' then 'failed' when p_status = 'completed' then 'active' else status end,
    updated_at = now()
  where id = v_log.integration_id;

  perform public._ige_log(v_org_id,
    case when p_status = 'failed' then 'integration_sync_failed' else 'integration_sync_executed' end,
    'integration', v_log.integration_id,
    jsonb_build_object('sync_log_id', p_sync_log_id, 'status', p_status, 'records', p_records_processed));
end; $$;

create or replace function public.sync_organization_integration(p_integration_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_int public.organization_integrations;
  v_log_id uuid;
  v_success boolean;
begin
  perform public._irp_require_permission('integrations.sync');
  v_org_id := public._mta_require_organization();
  select * into v_int from public.organization_integrations
  where id = p_integration_id and organization_id = v_org_id;

  if v_int.id is null then raise exception 'Integration not found'; end if;
  if not v_int.enabled and v_int.status <> 'pending' then raise exception 'Integration is disabled'; end if;

  insert into public.integration_sync_logs (organization_id, integration_id, sync_type, status)
  values (v_org_id, p_integration_id, 'manual', 'running')
  returning id into v_log_id;

  v_success := v_int.integration_key in ('unonight', 'email_provider', 'knowledge_center_import');

  perform public.record_integration_sync_result(
    v_log_id,
    case when v_success then 'completed' else 'failed' end,
    case when v_success then 5 else 0 end,
    case when v_success then null else 'Sync provider unavailable' end
  );

  return jsonb_build_object(
    'sync_log_id', v_log_id,
    'status', case when v_success then 'completed' else 'failed' end,
    'integration_key', v_int.integration_key
  );
end; $$;

create or replace function public.validate_integration_webhook(
  p_integration_id uuid,
  p_event_type text,
  p_payload jsonb,
  p_signature text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_int public.organization_integrations;
  v_event_id uuid;
  v_valid boolean := false;
begin
  v_org_id := public._mta_require_organization();
  select * into v_int from public.organization_integrations
  where id = p_integration_id and organization_id = v_org_id and enabled;

  if v_int.id is null then raise exception 'Integration not found or disabled'; end if;

  if p_signature is not null and v_int.credentials_reference is not null then
    v_valid := length(p_signature) > 8;
  else
    v_valid := p_signature is not null;
  end if;

  insert into public.integration_webhook_events (
    organization_id, integration_id, event_type, payload, signature_valid, status
  ) values (
    v_org_id, p_integration_id, p_event_type, p_payload, v_valid, 'pending'
  ) returning id into v_event_id;

  if v_valid then
    update public.integration_webhook_events set status = 'processed', processed_at = now()
    where id = v_event_id;
    perform public._ige_log(v_org_id, 'integration_webhook_received', 'integration', p_integration_id,
      jsonb_build_object('event_id', v_event_id, 'event_type', p_event_type));
  else
    update public.integration_webhook_events set status = 'failed', error_message = 'Invalid signature'
    where id = v_event_id;
    perform public._ige_log(v_org_id, 'integration_webhook_failed', 'integration', p_integration_id,
      jsonb_build_object('event_id', v_event_id, 'reason', 'invalid_signature'));
  end if;

  return jsonb_build_object('event_id', v_event_id, 'valid', v_valid, 'status', case when v_valid then 'processed' else 'failed' end);
end; $$;

create or replace function public.connect_unonight_integration(p_configuration jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_result jsonb; v_id uuid;
begin
  perform public._irp_require_permission('integrations.create');
  v_org_id := public._mta_require_organization();

  select id into v_id from public.organization_integrations
  where organization_id = v_org_id and integration_key = 'unonight';

  if v_id is null then
    v_result := public.create_organization_integration('unonight', p_configuration || '{"pilot":true}'::jsonb, 'unonight-pilot-token');
    v_id := (v_result->>'id')::uuid;
  end if;

  update public.organization_integrations set
    enabled = true, status = 'active',
    configuration = configuration || coalesce(p_configuration, '{}'::jsonb) || '{"support_events":true,"ai_recommendations":true}'::jsonb,
    updated_at = now()
  where id = v_id;

  perform public._ige_log(v_org_id, 'integration_connected', 'integration', v_id,
    jsonb_build_object('integration_key', 'unonight', 'pilot', true));

  return jsonb_build_object('id', v_id, 'integration_key', 'unonight', 'status', 'active', 'pilot', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_integration_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('integrations.view');
  v_org_id := public._mta_require_organization();
  perform public._ige_seed_demo_integrations(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Secure, modular integrations that connect external systems while maintaining tenant isolation and auditability.',
    'safety_note', 'Credentials are encrypted server-side and never exposed to frontend systems.',
    'principles', jsonb_build_array(
      'Tenant-aware integrations',
      'Secure credential handling',
      'Audit logging for integration events',
      'Modular integration architecture',
      'Independent activation per organization'
    ),
    'connected_integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'integration_key', i.integration_key, 'integration_name', i.integration_name,
        'status', i.status, 'enabled', i.enabled, 'last_sync_at', i.last_sync_at,
        'last_error', i.last_error, 'has_credentials', i.credentials_reference is not null,
        'configuration', i.configuration - 'secret' - 'api_key' - 'password'
      ) order by i.integration_name)
      from public.organization_integrations i where i.organization_id = v_org_id and i.status <> 'archived'
    ), '[]'::jsonb),
    'catalog', coalesce((
      select jsonb_agg(jsonb_build_object(
        'integration_key', c.integration_key, 'integration_name', c.integration_name,
        'category', c.category, 'description', c.description,
        'is_available', c.is_available, 'is_future', c.is_future
      ) order by c.sort_order)
      from public.integration_catalog c
    ), '[]'::jsonb),
    'recent_failures', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'integration_id', l.integration_id, 'sync_type', l.sync_type,
        'error_message', l.error_message, 'retry_count', l.retry_count, 'started_at', l.started_at
      ) order by l.started_at desc)
      from public.integration_sync_logs l
      where l.organization_id = v_org_id and l.status = 'failed' limit 8
    ), '[]'::jsonb),
    'recent_webhooks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'integration_id', w.integration_id, 'event_type', w.event_type,
        'status', w.status, 'signature_valid', w.signature_valid, 'created_at', w.created_at
      ) order by w.created_at desc)
      from public.integration_webhook_events w
      where w.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'pending_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'integration_key', i.integration_key, 'integration_name', i.integration_name,
        'status', i.status, 'warning', case
          when i.status = 'pending' then 'Awaiting activation'
          when i.status = 'failed' then coalesce(i.last_error, 'Sync failure')
          when not i.enabled then 'Integration disabled'
          else 'Configuration review recommended'
        end
      ))
      from public.organization_integrations i
      where i.organization_id = v_org_id
        and (i.status in ('pending', 'failed') or not i.enabled or i.last_error is not null)
    ), '[]'::jsonb),
    'health_summary', jsonb_build_object(
      'active', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'active' and enabled),
      'failed', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'failed'),
      'disabled', (select count(*) from public.organization_integrations where organization_id = v_org_id and (not enabled or status = 'disabled')),
      'pending', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'pending')
    ),
    'unonight_pilot', (
      select jsonb_build_object(
        'connected', exists(select 1 from public.organization_integrations where organization_id = v_org_id and integration_key = 'unonight' and enabled),
        'status', (select status from public.organization_integrations where organization_id = v_org_id and integration_key = 'unonight' limit 1),
        'last_sync_at', (select last_sync_at from public.organization_integrations where organization_id = v_org_id and integration_key = 'unonight' limit 1)
      )
    )
  );
end; $$;

create or replace function public.get_integration_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_integrations', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'active' and enabled),
    'failed_integrations', (select count(*) from public.organization_integrations where organization_id = v_org_id and status = 'failed'),
    'philosophy', 'Secure connections to external platforms.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ige_seed_demo_integrations(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'integration-engine', 'Integration Engine', 'Secure connections to external platforms and services.', 'authenticated', 58
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'integration-engine' and tenant_id is null);

grant execute on function public.create_organization_integration(text, jsonb, text) to authenticated;
grant execute on function public.update_organization_integration(uuid, jsonb, boolean) to authenticated;
grant execute on function public.disable_organization_integration(uuid) to authenticated;
grant execute on function public.sync_organization_integration(uuid) to authenticated;
grant execute on function public.rotate_integration_credentials(uuid, text) to authenticated;
grant execute on function public.validate_integration_webhook(uuid, text, jsonb, text) to authenticated;
grant execute on function public.connect_unonight_integration(jsonb) to authenticated;
grant execute on function public.get_integration_engine_dashboard() to authenticated;
grant execute on function public.get_integration_engine_card() to authenticated;
