-- Phase A.21 — API Platform Engine
-- Tenant-scoped API keys, webhooks, and audit metadata. Never store full API keys or webhook secrets.

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
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'notification_communication_engine',
    'observability_platform_health_engine', 'deployment_environment_management_engine',
    'security_trust_engine', 'api_platform_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_api_platform_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_api_platform_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade unique,
  rate_limit_tier text not null default 'standard' check (
    rate_limit_tier in ('standard', 'elevated', 'partner', 'sandbox')
  ),
  sandbox_enabled boolean not null default false,
  webhook_max int not null default 10,
  default_scope text not null default 'read' check (
    default_scope in ('read', 'write', 'admin')
  ),
  require_elevated_approval boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_api_platform_settings enable row level security;
revoke all on public.organization_api_platform_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_api_keys (prefix/hash only — never full key)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  key_name text not null,
  key_prefix text not null,
  key_hash text not null,
  scopes jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (
    status in ('active', 'revoked', 'expired', 'pending_approval')
  ),
  expires_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  approved_by uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, key_prefix)
);

create index if not exists organization_api_keys_org_status_idx
  on public.organization_api_keys (organization_id, status);

alter table public.organization_api_keys enable row level security;
revoke all on public.organization_api_keys from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_webhook_subscriptions (secret_ref only — no raw secret)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_webhook_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  subscription_name text not null,
  event_types jsonb not null default '[]'::jsonb,
  endpoint_url text not null,
  status text not null default 'active' check (
    status in ('active', 'paused', 'disabled', 'pending_verification')
  ),
  secret_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_webhook_subscriptions_org_idx
  on public.organization_webhook_subscriptions (organization_id, status);

alter table public.organization_webhook_subscriptions enable row level security;
revoke all on public.organization_webhook_subscriptions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_api_audit_log (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_api_audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action text not null,
  resource_type text not null default 'api_platform',
  status text not null default 'success' check (
    status in ('success', 'failure', 'denied', 'rate_limited')
  ),
  actor_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_api_audit_log_org_idx
  on public.organization_api_audit_log (organization_id, created_at desc);

alter table public.organization_api_audit_log enable row level security;
revoke all on public.organization_api_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'api_platform', v.description
from (values
  ('api_platform.view', 'View API Platform', 'View API platform settings, keys metadata, and webhooks'),
  ('api_platform.manage', 'Manage API Platform', 'Update API platform settings and webhook subscriptions'),
  ('api_platform.keys', 'Manage API Keys', 'Create, rotate, and revoke API keys — elevated scopes require approval')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'api_platform.view'), ('owner', 'api_platform.manage'), ('owner', 'api_platform.keys'),
  ('administrator', 'api_platform.view'), ('administrator', 'api_platform.manage'), ('administrator', 'api_platform.keys'),
  ('manager', 'api_platform.view'), ('manager', 'api_platform.keys'),
  ('support_agent', 'api_platform.view'),
  ('viewer', 'api_platform.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_api_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._api_log(
  p_organization_id uuid,
  p_action text,
  p_resource_type text default 'api_platform',
  p_status text default 'success',
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_api_audit_log (organization_id, action, resource_type, status, actor_user_id, metadata)
  values (p_organization_id, p_action, p_resource_type, p_status, auth.uid(), p_metadata);
end; $$;

create or replace function public._api_ensure_settings(p_organization_id uuid)
returns public.organization_api_platform_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_api_platform_settings;
begin
  insert into public.organization_api_platform_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row from public.organization_api_platform_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._api_seed_platform_scaffold(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._api_ensure_settings(p_organization_id);

  insert into public.organization_api_keys (
    organization_id, key_name, key_prefix, key_hash, scopes, status, metadata
  )
  select p_organization_id, v.name, v.prefix, v.hash, v.scopes::jsonb, v.status, v.meta::jsonb
  from (values
    (
      'Read-only integration key',
      'aip_ro_scaffold',
      'sha256:scaffold_read_only_placeholder',
      '["core.read","support.read"]',
      'active',
      '{"scaffold": true, "note": "Example metadata — full key never stored"}'
    ),
    (
      'Sandbox testing key',
      'aip_sb_scaffold',
      'sha256:scaffold_sandbox_placeholder',
      '["sandbox.read","sandbox.write"]',
      'active',
      '{"scaffold": true, "sandbox": true}'
    )
  ) as v(name, prefix, hash, scopes, status, meta)
  on conflict (organization_id, key_prefix) do nothing;

  insert into public.organization_webhook_subscriptions (
    organization_id, subscription_name, event_types, endpoint_url, status, secret_ref, metadata
  )
  select p_organization_id, v.name, v.events::jsonb, v.url, v.status, v.secret_ref, v.meta::jsonb
  from (values
    (
      'Support events webhook',
      '["support.case.created","support.case.closed"]',
      'https://example.com/webhooks/aipify-support',
      'pending_verification',
      'vault:webhook_secret_ref_scaffold',
      '{"scaffold": true, "note": "Secret stored in vault — secret_ref only in database"}'
    ),
    (
      'Task completion webhook',
      '["task.completed","task.assigned"]',
      'https://example.com/webhooks/aipify-tasks',
      'active',
      'vault:webhook_secret_ref_tasks_scaffold',
      '{"scaffold": true}'
    )
  ) as v(name, events, url, status, secret_ref, meta)
  where not exists (
    select 1 from public.organization_webhook_subscriptions w
    where w.organization_id = p_organization_id and w.subscription_name = v.name
  );

  perform public._api_log(
    p_organization_id,
    'api_platform_scaffold_seeded',
    'api_platform',
    'success',
    jsonb_build_object('keys_seeded', 2, 'webhooks_seeded', 2)
  );
end; $$;

create or replace function public._api_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active_keys int := 0;
  v_pending_keys int := 0;
  v_webhooks int := 0;
  v_audit_events int := 0;
  v_sandbox boolean := false;
  v_rate_tier text := 'standard';
begin
  select coalesce(s.sandbox_enabled, false), coalesce(s.rate_limit_tier, 'standard')
  into v_sandbox, v_rate_tier
  from public.organization_api_platform_settings s
  where s.organization_id = p_organization_id;

  select count(*) filter (where status = 'active'), count(*) filter (where status = 'pending_approval')
  into v_active_keys, v_pending_keys
  from public.organization_api_keys where organization_id = p_organization_id;

  select count(*) into v_webhooks
  from public.organization_webhook_subscriptions
  where organization_id = p_organization_id and status in ('active', 'pending_verification');

  select count(*) into v_audit_events
  from public.organization_api_audit_log
  where organization_id = p_organization_id
    and created_at >= now() - interval '30 days';

  return jsonb_build_object(
    'active_keys', v_active_keys,
    'pending_approval_keys', v_pending_keys,
    'active_webhooks', v_webhooks,
    'audit_events_30d', v_audit_events,
    'sandbox_enabled', v_sandbox,
    'rate_limit_tier', v_rate_tier,
    'privacy_note', 'Counts and metadata only — no API key values, webhook secrets, or PII.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_api_platform_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_api_platform_settings;
begin
  perform public._irp_require_permission('api_platform.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._api_ensure_settings(v_org_id);
  perform public._api_seed_platform_scaffold(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Developers integrate securely — Aipify exposes metadata-first APIs with human approval for elevated access.',
    'privacy_note', 'API keys stored as prefix and hash only. Webhook secrets referenced by secret_ref — never raw secrets in the database.',
    'mission', 'Empower developers to integrate, customize, and build upon Aipify through secure APIs, documentation, and extensibility.',
    'settings', row_to_json(v_settings),
    'summary', public._api_engagement_summary(v_org_id),
    'api_keys', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', k.id,
          'key_name', k.key_name,
          'key_prefix', k.key_prefix,
          'scopes', k.scopes,
          'status', k.status,
          'expires_at', k.expires_at,
          'metadata', k.metadata
        ) order by k.created_at desc
      )
      from public.organization_api_keys k where k.organization_id = v_org_id
    ), '[]'::jsonb),
    'webhooks', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', w.id,
          'subscription_name', w.subscription_name,
          'event_types', w.event_types,
          'endpoint_url', w.endpoint_url,
          'status', w.status,
          'secret_ref', w.secret_ref,
          'metadata', w.metadata
        ) order by w.created_at desc
      )
      from public.organization_webhook_subscriptions w where w.organization_id = v_org_id
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'action', a.action,
          'resource_type', a.resource_type,
          'status', a.status,
          'metadata', a.metadata,
          'created_at', a.created_at
        ) order by a.created_at desc
      )
      from (
        select * from public.organization_api_audit_log
        where organization_id = v_org_id
        order by created_at desc limit 10
      ) a
    ), '[]'::jsonb),
    'principles', jsonb_build_array(
      'Scoped permissions — least privilege for every API key',
      'Audit logging for all API platform actions',
      'Rate limits by tier — protect tenant and platform stability',
      'Token expiration — keys expire unless renewed',
      'Secure secret handling — prefix/hash and secret_ref only',
      'Human approval required for elevated scopes'
    ),
    'engagement_summary', public._api_engagement_summary(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_api_platform_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._api_ensure_settings(v_org_id);
  v_summary := public._api_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'active_keys', coalesce((v_summary->>'active_keys')::int, 0),
    'active_webhooks', coalesce((v_summary->>'active_webhooks')::int, 0),
    'philosophy', 'Secure tenant APIs — metadata-first, human approval for elevated access.',
    'mission', 'Empower developers to integrate and build upon Aipify securely.',
    'engine_phase', 'A.21',
    'route', '/app/api-platform-engine'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._api_ensure_settings(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'api-platform-engine', 'API Platform Engine', 'Tenant-scoped API keys, webhooks, developer platform governance, and audit metadata.', 'authenticated', 63
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'api-platform-engine' and tenant_id is null);

grant execute on function public._api_log(uuid, text, text, text, jsonb) to authenticated;
grant execute on function public._api_ensure_settings(uuid) to authenticated;
grant execute on function public._api_seed_platform_scaffold(uuid) to authenticated;
grant execute on function public._api_engagement_summary(uuid) to authenticated;
grant execute on function public.get_api_platform_engine_dashboard() to authenticated;
grant execute on function public.get_api_platform_engine_card() to authenticated;
