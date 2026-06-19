-- Phase 602 — Business Pack Development Platform, SDK & Creator Ecosystem Engine
-- Feature owner: PLATFORM ADMIN
-- Route: /platform/developers/*
-- Helpers: _bp602_*

-- ---------------------------------------------------------------------------
-- Developers & projects
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_developers (
  id uuid primary key default gen_random_uuid(),
  developer_id text not null unique,
  developer_name text not null,
  company_name text not null,
  email_domain text not null default '',
  developer_status text not null default 'pending' check (
    developer_status in ('pending', 'approved', 'active', 'suspended', 'archived')
  ),
  approval_level text not null default 'standard' check (
    approval_level in ('standard', 'verified', 'enterprise', 'platform_partner')
  ),
  active_projects integer not null default 0 check (active_projects >= 0),
  published_packs integer not null default 0 check (published_packs >= 0),
  metadata jsonb not null default '{}'::jsonb,
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_bp602_developers enable row level security;
revoke all on public.platform_bp602_developers from authenticated, anon;

create table if not exists public.platform_bp602_developer_projects (
  id uuid primary key default gen_random_uuid(),
  project_id text not null unique,
  project_name text not null,
  developer_id text not null references public.platform_bp602_developers (developer_id) on delete cascade,
  pack_id text,
  project_status text not null default 'draft' check (
    project_status in ('draft', 'development', 'testing', 'review', 'published', 'deprecated', 'archived')
  ),
  industry_key text not null default 'general',
  summary text not null default '' check (char_length(summary) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_bp602_developer_projects_dev_idx
  on public.platform_bp602_developer_projects (developer_id, project_status);

alter table public.platform_bp602_developer_projects enable row level security;
revoke all on public.platform_bp602_developer_projects from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 1. Business Pack SDK
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_sdk_modules (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  module_title text not null,
  module_domain text not null check (
    module_domain in (
      'ui_components', 'permissions', 'companion', 'knowledge', 'audit',
      'billing', 'localization', 'governance'
    )
  ),
  module_status text not null default 'stable' check (
    module_status in ('draft', 'beta', 'stable', 'deprecated')
  ),
  sdk_version text not null default '1.0.0',
  summary text not null default '' check (char_length(summary) <= 500),
  sort_order int not null default 0
);

alter table public.platform_bp602_sdk_modules enable row level security;
revoke all on public.platform_bp602_sdk_modules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Pack Manifest System
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_pack_manifests (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null unique,
  pack_name text not null,
  version text not null default '0.1.0',
  provider_id text not null,
  description text not null default '' check (char_length(description) <= 1000),
  permissions jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  license_type text not null default 'commercial' check (
    license_type in ('commercial', 'subscription', 'enterprise', 'trial', 'internal')
  ),
  support_info jsonb not null default '{}'::jsonb,
  audit_requirements jsonb not null default '[]'::jsonb,
  manifest_status text not null default 'draft' check (
    manifest_status in ('draft', 'validated', 'approved', 'published', 'deprecated')
  ),
  project_id text references public.platform_bp602_developer_projects (project_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_bp602_pack_manifests enable row level security;
revoke all on public.platform_bp602_pack_manifests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Pack Permission Framework
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_pack_permissions (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null references public.platform_bp602_pack_manifests (pack_id) on delete cascade,
  permission_key text not null,
  access_type text not null check (access_type in ('read', 'write', 'action')),
  approval_required boolean not null default true,
  companion_access boolean not null default false,
  integration_access boolean not null default false,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'approved', 'rejected', 'waived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (pack_id, permission_key)
);

alter table public.platform_bp602_pack_permissions enable row level security;
revoke all on public.platform_bp602_pack_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Pack Testing Environment
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_test_sandboxes (
  id uuid primary key default gen_random_uuid(),
  sandbox_id text not null unique,
  pack_id text not null references public.platform_bp602_pack_manifests (pack_id) on delete cascade,
  project_id text references public.platform_bp602_developer_projects (project_id) on delete set null,
  sandbox_status text not null default 'provisioning' check (
    sandbox_status in ('provisioning', 'active', 'paused', 'expired', 'archived')
  ),
  test_org_label text not null default 'Sandbox Org',
  test_users jsonb not null default '[]'::jsonb,
  test_data jsonb not null default '{}'::jsonb,
  test_events jsonb not null default '[]'::jsonb,
  test_integrations jsonb not null default '[]'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.platform_bp602_test_sandboxes enable row level security;
revoke all on public.platform_bp602_test_sandboxes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Pack Validation Engine
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_validation_runs (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null references public.platform_bp602_pack_manifests (pack_id) on delete cascade,
  validation_type text not null check (
    validation_type in (
      'security', 'performance', 'governance', 'localization',
      'accessibility', 'billing_compatibility', 'companion_compatibility'
    )
  ),
  validation_status text not null default 'pending' check (
    validation_status in ('pending', 'passed', 'failed', 'waived')
  ),
  score numeric(5, 2) not null default 0 check (score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  ran_at timestamptz not null default now(),
  unique (pack_id, validation_type)
);

alter table public.platform_bp602_validation_runs enable row level security;
revoke all on public.platform_bp602_validation_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. API Platform (metadata/registry)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_api_endpoints (
  id uuid primary key default gen_random_uuid(),
  api_key text not null unique,
  api_title text not null,
  api_family text not null check (
    api_family in ('rest', 'event', 'companion', 'knowledge', 'billing', 'marketplace', 'partner')
  ),
  api_version text not null default 'v1',
  endpoint_path text not null default '',
  is_available boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  sort_order int not null default 0
);

alter table public.platform_bp602_api_endpoints enable row level security;
revoke all on public.platform_bp602_api_endpoints from authenticated, anon;

create table if not exists public.platform_bp602_api_keys (
  id uuid primary key default gen_random_uuid(),
  key_label text not null,
  developer_id text not null references public.platform_bp602_developers (developer_id) on delete cascade,
  project_id text references public.platform_bp602_developer_projects (project_id) on delete set null,
  key_prefix text not null,
  scopes jsonb not null default '[]'::jsonb,
  key_status text not null default 'active' check (key_status in ('active', 'rotated', 'revoked')),
  created_at timestamptz not null default now()
);

alter table public.platform_bp602_api_keys enable row level security;
revoke all on public.platform_bp602_api_keys from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Pack Dependency Engine
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_pack_dependencies (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null references public.platform_bp602_pack_manifests (pack_id) on delete cascade,
  dependency_key text not null,
  dependency_type text not null check (
    dependency_type in ('required_pack', 'optional_pack', 'integration', 'license')
  ),
  dependency_title text not null,
  is_required boolean not null default true,
  license_ref text,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (pack_id, dependency_key, dependency_type)
);

alter table public.platform_bp602_pack_dependencies enable row level security;
revoke all on public.platform_bp602_pack_dependencies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Development Documentation Center
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_documentation (
  id uuid primary key default gen_random_uuid(),
  doc_key text not null unique,
  doc_title text not null,
  doc_category text not null check (
    doc_category in (
      'getting_started', 'sdk_guide', 'api_guide', 'example', 'template',
      'governance_rule', 'publishing_rule'
    )
  ),
  doc_status text not null default 'published' check (doc_status in ('draft', 'published', 'archived')),
  summary text not null default '' check (char_length(summary) <= 500),
  sort_order int not null default 0
);

alter table public.platform_bp602_documentation enable row level security;
revoke all on public.platform_bp602_documentation from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Version Management
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_pack_versions (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null references public.platform_bp602_pack_manifests (pack_id) on delete cascade,
  version text not null,
  version_status text not null default 'current' check (
    version_status in ('current', 'previous', 'deprecated')
  ),
  breaking_changes boolean not null default false,
  upgrade_notes text not null default '' check (char_length(upgrade_notes) <= 1000),
  deprecation_notice text not null default '' check (char_length(deprecation_notice) <= 500),
  released_at timestamptz not null default now(),
  unique (pack_id, version)
);

alter table public.platform_bp602_pack_versions enable row level security;
revoke all on public.platform_bp602_pack_versions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. Pack Certification
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_pack_certifications (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null references public.platform_bp602_pack_manifests (pack_id) on delete cascade,
  certification_level text not null check (
    certification_level in (
      'verified', 'certified', 'enterprise_certified', 'industry_certified', 'premium_certified'
    )
  ),
  certification_status text not null default 'pending' check (
    certification_status in ('pending', 'granted', 'expired', 'revoked')
  ),
  granted_at timestamptz,
  expires_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (pack_id, certification_level)
);

alter table public.platform_bp602_pack_certifications enable row level security;
revoke all on public.platform_bp602_pack_certifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 14. Audit Logging
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bp602_audit_logs (
  id uuid primary key default gen_random_uuid(),
  developer_id text,
  project_id text,
  pack_id text,
  event_type text not null check (
    event_type in (
      'developer_registered', 'project_created', 'pack_validated', 'pack_published',
      'version_released', 'certification_granted', 'api_key_created', 'developer_report_generated'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_bp602_audit_logs_created_idx
  on public.platform_bp602_audit_logs (created_at desc);

alter table public.platform_bp602_audit_logs enable row level security;
revoke all on public.platform_bp602_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._bp602_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._bp602_log(
  p_developer_id text,
  p_project_id text,
  p_pack_id text,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_bp602_audit_logs (developer_id, project_id, pack_id, event_type, summary, context)
  values (p_developer_id, p_project_id, p_pack_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._bp602_seed()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_bp602_sdk_modules (module_key, module_title, module_domain, module_status, sdk_version, summary, sort_order)
  values
    ('ui_shell', 'UI Components', 'ui_components', 'stable', '1.2.0', 'Light Enterprise panels, cards, and navigation primitives.', 1),
    ('permission_kit', 'Permission Kit', 'permissions', 'stable', '1.1.0', 'Declare read, write, and action scopes with approval gates.', 2),
    ('companion_bridge', 'Companion Bridge', 'companion', 'stable', '1.0.0', 'Industry-aware Companion skills and insight formatting.', 3),
    ('knowledge_pack', 'Knowledge Pack', 'knowledge', 'stable', '1.0.0', 'Knowledge Center templates and locale blocks.', 4),
    ('audit_trail', 'Audit Trail', 'audit', 'stable', '1.0.0', 'Immutable audit events for pack operations.', 5),
    ('billing_hooks', 'Billing Hooks', 'billing', 'beta', '0.9.0', 'License-aware billing and marketplace revenue hooks.', 6),
    ('locale_kit', 'Localization Kit', 'localization', 'stable', '1.0.0', 'Core locale requirements and translation scaffolding.', 7),
    ('governance_guard', 'Governance Guard', 'governance', 'stable', '1.0.0', 'Publishing rules, certification gates, and policy checks.', 8)
  on conflict (module_key) do nothing;

  insert into public.platform_bp602_api_endpoints (api_key, api_title, api_family, api_version, endpoint_path, summary, sort_order)
  values
    ('packs_rest', 'Pack REST API', 'rest', 'v1', '/api/v1/packs', 'Create, read, and update pack manifests.', 1),
    ('events_stream', 'Event API', 'event', 'v1', '/api/v1/events', 'Subscribe to validation and publishing events.', 2),
    ('companion_dev', 'Companion Developer API', 'companion', 'v1', '/api/v1/companion/dev', 'Register Companion skills and test insights.', 3),
    ('knowledge_dev', 'Knowledge API', 'knowledge', 'v1', '/api/v1/knowledge/templates', 'Manage knowledge templates and locales.', 4),
    ('billing_dev', 'Billing API', 'billing', 'v1', '/api/v1/billing/packs', 'License models and revenue metadata.', 5),
    ('marketplace_dev', 'Marketplace API', 'marketplace', 'v1', '/api/v1/marketplace/listings', 'Submit and manage marketplace listings.', 6),
    ('partner_dev', 'Partner API', 'partner', 'v1', '/api/v1/partners/attribution', 'Growth Partner attribution metadata.', 7)
  on conflict (api_key) do nothing;

  insert into public.platform_bp602_documentation (doc_key, doc_title, doc_category, summary, sort_order)
  values
    ('getting_started', 'Getting Started with Business Pack SDK', 'getting_started', 'Install the SDK, create a manifest, and open a sandbox.', 1),
    ('sdk_overview', 'SDK Module Reference', 'sdk_guide', 'UI, permissions, Companion, knowledge, audit, billing, localization, governance.', 2),
    ('api_overview', 'API Platform Overview', 'api_guide', 'REST, Event, Companion, Knowledge, Billing, Marketplace, and Partner APIs.', 3),
    ('manifest_example', 'Manifest Example — Hospitality Pack', 'example', 'Complete manifest with permissions, dependencies, and audit requirements.', 4),
    ('starter_template', 'Starter Pack Template', 'template', 'Clone-ready project scaffold for a new Business Pack.', 5),
    ('governance_rules', 'Governance & Certification Rules', 'governance_rule', 'Security, localization, and Companion compatibility requirements.', 6),
    ('publishing_rules', 'Publishing Workflow Rules', 'publishing_rule', 'Validate, certify, approve, and publish to marketplace.', 7)
  on conflict (doc_key) do nothing;

  insert into public.platform_bp602_developers (developer_id, developer_name, company_name, email_domain, developer_status, approval_level, active_projects, published_packs)
  values
    ('nordic_hosts_dev', 'Nordic Hosts Dev Team', 'Nordic Hosts AS', 'nordichosts.no', 'active', 'verified', 2, 1),
    ('unonight_labs', 'Unonight Labs', 'Unonight AS', 'unonight.no', 'active', 'enterprise', 1, 1),
    ('growth_north_dev', 'Growth North Studio', 'Growth North AS', 'growthnorth.no', 'approved', 'standard', 1, 0)
  on conflict (developer_id) do nothing;

  insert into public.platform_bp602_developer_projects (project_id, project_name, developer_id, pack_id, project_status, industry_key, summary)
  values
    ('proj_nordic_hosts_v2', 'Nordic Hosts Pack v2', 'nordic_hosts_dev', 'nordic_hosts_pack', 'testing', 'hospitality', 'Next-generation hosts workflows with Companion guidance.'),
    ('proj_unonight_hospitality', 'Unonight Hospitality Pack', 'unonight_labs', 'unonight_hospitality', 'published', 'hospitality', 'Enterprise hospitality pack for Unonight pilot.'),
    ('proj_warehouse_ops', 'Warehouse Operations Pack', 'growth_north_dev', 'warehouse_ops_pack', 'development', 'warehousing', 'Inventory and fulfillment pack in early development.')
  on conflict (project_id) do nothing;

  insert into public.platform_bp602_pack_manifests (
    pack_id, pack_name, version, provider_id, description, permissions, dependencies,
    license_type, support_info, audit_requirements, manifest_status, project_id
  ) values
    (
      'nordic_hosts_pack', 'Nordic Hosts Pack', '2.0.0', 'nordic_hosts_dev',
      'Hospitality operations pack for short-term rental hosts.',
      '["bookings.read","bookings.write","companion.guide"]'::jsonb,
      '["core_companion","billing_standard"]'::jsonb,
      'subscription',
      '{"email":"support@nordichosts.no","sla_hours":24}'::jsonb,
      '["security_review","localization_core","companion_format"]'::jsonb,
      'validated', 'proj_nordic_hosts_v2'
    ),
    (
      'unonight_hospitality', 'Unonight Hospitality Pack', '1.4.0', 'unonight_labs',
      'Enterprise hospitality pack — Unonight pilot.',
      '["guests.read","guests.write","reports.executive"]'::jsonb,
      '["core_companion","enterprise_billing"]'::jsonb,
      'enterprise',
      '{"email":"labs@unonight.no","sla_hours":4}'::jsonb,
      '["security_review","governance_enterprise","companion_format","billing_compat"]'::jsonb,
      'published', 'proj_unonight_hospitality'
    ),
    (
      'warehouse_ops_pack', 'Warehouse Operations Pack', '0.8.0', 'growth_north_dev',
      'Warehouse inventory and fulfillment workflows.',
      '["inventory.read","inventory.write","automation.run"]'::jsonb,
      '["inventory_engine"]'::jsonb,
      'commercial',
      '{"email":"dev@growthnorth.no","sla_hours":48}'::jsonb,
      '["security_review","localization_core"]'::jsonb,
      'draft', 'proj_warehouse_ops'
    )
  on conflict (pack_id) do nothing;

  insert into public.platform_bp602_pack_permissions (pack_id, permission_key, access_type, approval_required, companion_access, integration_access, review_status, summary)
  values
    ('nordic_hosts_pack', 'bookings.read', 'read', false, true, false, 'approved', 'Read booking metadata.'),
    ('nordic_hosts_pack', 'bookings.write', 'write', true, false, true, 'approved', 'Modify bookings — approval required.'),
    ('unonight_hospitality', 'guests.write', 'write', true, true, true, 'approved', 'Guest operations with Companion context.'),
    ('warehouse_ops_pack', 'automation.run', 'action', true, false, true, 'pending', 'Run warehouse automations — pending review.')
  on conflict (pack_id, permission_key) do nothing;

  insert into public.platform_bp602_test_sandboxes (sandbox_id, pack_id, project_id, sandbox_status, test_org_label, test_users, test_integrations)
  values
    ('sb_nordic_hosts', 'nordic_hosts_pack', 'proj_nordic_hosts_v2', 'active', 'Nordic Hosts Sandbox',
      '["owner","support","staff"]'::jsonb, '["calendar","notifications"]'::jsonb),
    ('sb_unonight', 'unonight_hospitality', 'proj_unonight_hospitality', 'active', 'Unonight Pilot Sandbox',
      '["owner","admin","support"]'::jsonb, '["pms","companion"]'::jsonb)
  on conflict (sandbox_id) do nothing;

  insert into public.platform_bp602_validation_runs (pack_id, validation_type, validation_status, score, summary)
  select m.pack_id, v.validation_type,
    case
      when m.manifest_status = 'published' then 'passed'
      when m.manifest_status = 'validated' then case v.validation_type when 'billing_compatibility' then 'pending' else 'passed' end
      else 'pending'
    end,
    case when m.manifest_status = 'published' then 92 else 78 end,
    format('%s validation for %s.', v.validation_type, m.pack_name)
  from public.platform_bp602_pack_manifests m
  cross join (values
    ('security'), ('performance'), ('governance'), ('localization'),
    ('accessibility'), ('billing_compatibility'), ('companion_compatibility')
  ) as v(validation_type)
  on conflict (pack_id, validation_type) do nothing;

  insert into public.platform_bp602_pack_dependencies (pack_id, dependency_key, dependency_type, dependency_title, is_required, license_ref, summary)
  values
    ('nordic_hosts_pack', 'core_companion', 'required_pack', 'Core Companion Pack', true, 'aipify_core', 'Required Companion foundation.'),
    ('nordic_hosts_pack', 'stripe_billing', 'integration', 'Stripe Billing Connector', false, null, 'Optional billing integration.'),
    ('unonight_hospitality', 'enterprise_billing', 'license', 'Enterprise Billing License', true, 'enterprise', 'Enterprise license required.'),
    ('warehouse_ops_pack', 'inventory_engine', 'required_pack', 'Inventory Engine', true, 'platform', 'Platform inventory engine dependency.')
  on conflict (pack_id, dependency_key, dependency_type) do nothing;

  insert into public.platform_bp602_pack_versions (pack_id, version, version_status, breaking_changes, upgrade_notes, deprecation_notice)
  values
    ('nordic_hosts_pack', '2.0.0', 'current', true, 'Permissions model updated — review migration guide.', ''),
    ('nordic_hosts_pack', '1.9.0', 'previous', false, 'Stable release with localization fixes.', ''),
    ('unonight_hospitality', '1.4.0', 'current', false, 'Companion insight formatting aligned with Golden Rule.', ''),
    ('warehouse_ops_pack', '0.8.0', 'current', false, 'Initial sandbox release.', '')
  on conflict (pack_id, version) do nothing;

  insert into public.platform_bp602_pack_certifications (pack_id, certification_level, certification_status, granted_at, summary)
  values
    ('unonight_hospitality', 'enterprise_certified', 'granted', now() - interval '30 days', 'Unonight pilot enterprise certification.'),
    ('unonight_hospitality', 'industry_certified', 'granted', now() - interval '30 days', 'Hospitality industry certification.'),
    ('nordic_hosts_pack', 'verified', 'granted', now() - interval '7 days', 'Verified publisher pack.'),
    ('nordic_hosts_pack', 'certified', 'pending', null, 'Awaiting final governance review.')
  on conflict (pack_id, certification_level) do nothing;

  insert into public.platform_bp602_api_keys (key_label, developer_id, project_id, key_prefix, scopes, key_status)
  values
    ('Nordic Hosts CI', 'nordic_hosts_dev', 'proj_nordic_hosts_v2', 'bp602_nh_', '["packs.read","packs.write","sandbox.run"]'::jsonb, 'active'),
    ('Unonight Labs Production', 'unonight_labs', 'proj_unonight_hospitality', 'bp602_un_', '["packs.read","marketplace.publish"]'::jsonb, 'active')
  on conflict do nothing;

  if not exists (select 1 from public.platform_bp602_audit_logs limit 1) then
    perform public._bp602_log('nordic_hosts_dev', null, null, 'developer_registered', 'Nordic Hosts Dev Team registered on Developer Platform.', '{}'::jsonb);
    perform public._bp602_log('unonight_labs', 'proj_unonight_hospitality', 'unonight_hospitality', 'project_created', 'Unonight Hospitality Pack project created.', '{}'::jsonb);
    perform public._bp602_log('nordic_hosts_dev', 'proj_nordic_hosts_v2', 'nordic_hosts_pack', 'pack_validated', 'Nordic Hosts Pack passed validation pipeline.', '{"validations":7}'::jsonb);
    perform public._bp602_log('unonight_labs', 'proj_unonight_hospitality', 'unonight_hospitality', 'pack_published', 'Unonight Hospitality Pack published to marketplace.', '{}'::jsonb);
    perform public._bp602_log('unonight_labs', 'proj_unonight_hospitality', 'unonight_hospitality', 'version_released', 'Version 1.4.0 released with upgrade notes.', '{"version":"1.4.0"}'::jsonb);
    perform public._bp602_log('unonight_labs', null, 'unonight_hospitality', 'certification_granted', 'Enterprise certification granted.', '{"level":"enterprise_certified"}'::jsonb);
    perform public._bp602_log('nordic_hosts_dev', 'proj_nordic_hosts_v2', null, 'api_key_created', 'CI API key created for Nordic Hosts project.', '{"prefix":"bp602_nh_"}'::jsonb);
    perform public._bp602_log(null, null, null, 'developer_report_generated', 'Developer Platform executive report generated — Phase 602.', '{}'::jsonb);
  end if;
end; $$;

select public._bp602_seed();

-- ---------------------------------------------------------------------------
-- Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_developer_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_developers integer;
  v_projects integer;
  v_published_packs integer;
  v_pending_validations integer;
  v_certifications_granted integer;
begin
  perform public._bp602_require_platform_admin();
  perform public._bp602_seed();

  select count(*) into v_developers from public.platform_bp602_developers where developer_status <> 'archived';
  select count(*) into v_projects from public.platform_bp602_developer_projects where project_status <> 'archived';
  select count(*) into v_published_packs from public.platform_bp602_pack_manifests where manifest_status = 'published';
  select count(*) into v_pending_validations from public.platform_bp602_validation_runs where validation_status = 'pending';
  select count(*) into v_certifications_granted from public.platform_bp602_pack_certifications where certification_status = 'granted';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Aipify provides the development platform — approved developers build Business Packs that extend ABOS under governance, certification, and human accountability.',
      'privacy_note', 'Developer Platform aggregates metadata only — no customer operational records or PII.',
      'executive_dashboard', jsonb_build_object(
        'registered_developers', v_developers,
        'active_projects', v_projects,
        'published_packs', v_published_packs,
        'certifications_granted', v_certifications_granted,
        'pending_validations', v_pending_validations,
        'marketplace_ready', (select count(*) from public.platform_bp602_pack_manifests where manifest_status in ('validated', 'approved', 'published')),
        'platform_api_endpoints', (select count(*) from public.platform_bp602_api_endpoints where is_available),
        'sdk_modules', (select count(*) from public.platform_bp602_sdk_modules where module_status in ('stable', 'beta'))
      ),
      'stats', jsonb_build_object(
        'developers', v_developers,
        'projects', v_projects,
        'manifests', (select count(*) from public.platform_bp602_pack_manifests),
        'sandboxes', (select count(*) from public.platform_bp602_test_sandboxes where sandbox_status = 'active'),
        'validations', (select count(*) from public.platform_bp602_validation_runs),
        'api_keys', (select count(*) from public.platform_bp602_api_keys where key_status = 'active'),
        'documentation', (select count(*) from public.platform_bp602_documentation where doc_status = 'published')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(rec order by rec->>'priority')
        from (
          select jsonb_build_object(
            'key', 'validation_pipeline',
            'priority', 1,
            'observation', format('%s validation check(s) pending across pack projects.', v_pending_validations),
            'recommendation', 'Open Testing to review validation results before publishing.',
            'href', '/platform/developers/testing'
          ) as rec
          union all
          select jsonb_build_object(
            'key', 'certification',
            'priority', 2,
            'observation', format('%s certification(s) granted; review marketplace-ready packs.', v_certifications_granted),
            'recommendation', 'Review Publishing for version and certification status.',
            'href', '/platform/developers/publishing'
          )
          union all
          select jsonb_build_object(
            'key', 'sdk_adoption',
            'priority', 3,
            'observation', format('%s SDK module(s) available for pack development.', (select count(*) from public.platform_bp602_sdk_modules)),
            'recommendation', 'Share SDK documentation with approved developers.',
            'href', '/platform/developers/sdk'
          )
        ) sub
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'No pack ships without a manifest — validate, certify, and publish through Aipify governance.',
    'privacy_note', 'Developer intelligence uses approved metadata — never customer PII or operational records.',
    'executive_dashboard', jsonb_build_object(
      'registered_developers', v_developers,
      'active_projects', v_projects,
      'published_packs', v_published_packs,
      'certifications_granted', v_certifications_granted,
      'pending_validations', v_pending_validations,
      'marketplace_growth', v_published_packs,
      'platform_usage', (select count(*) from public.platform_bp602_api_keys where key_status = 'active')
    ),
    'stats', jsonb_build_object(
      'developers', v_developers,
      'projects', v_projects,
      'manifests', (select count(*) from public.platform_bp602_pack_manifests),
      'sdk_modules', (select count(*) from public.platform_bp602_sdk_modules),
      'api_endpoints', (select count(*) from public.platform_bp602_api_endpoints where is_available),
      'sandboxes', (select count(*) from public.platform_bp602_test_sandboxes),
      'validations', (select count(*) from public.platform_bp602_validation_runs),
      'certifications', v_certifications_granted
    ),
    'developers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'developer_id', d.developer_id, 'developer_name', d.developer_name,
        'company_name', d.company_name, 'developer_status', d.developer_status,
        'approval_level', d.approval_level, 'active_projects', d.active_projects,
        'published_packs', d.published_packs
      ) order by d.developer_name)
      from public.platform_bp602_developers d where d.developer_status <> 'archived'
    ), '[]'::jsonb),
    'projects', coalesce((
      select jsonb_agg(jsonb_build_object(
        'project_id', p.project_id, 'project_name', p.project_name,
        'developer_id', p.developer_id, 'pack_id', p.pack_id,
        'project_status', p.project_status, 'industry_key', p.industry_key, 'summary', p.summary
      ) order by p.project_name)
      from public.platform_bp602_developer_projects p where p.project_status <> 'archived'
    ), '[]'::jsonb),
    'sdk_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'module_key', s.module_key, 'module_title', s.module_title,
        'module_domain', s.module_domain, 'module_status', s.module_status,
        'sdk_version', s.sdk_version, 'summary', s.summary
      ) order by s.sort_order)
      from public.platform_bp602_sdk_modules s
    ), '[]'::jsonb),
    'pack_manifests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', m.pack_id, 'pack_name', m.pack_name, 'version', m.version,
        'provider_id', m.provider_id, 'description', m.description,
        'permissions', m.permissions, 'dependencies', m.dependencies,
        'license_type', m.license_type, 'support_info', m.support_info,
        'audit_requirements', m.audit_requirements, 'manifest_status', m.manifest_status
      ) order by m.pack_name)
      from public.platform_bp602_pack_manifests m
    ), '[]'::jsonb),
    'pack_permissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', pp.pack_id, 'permission_key', pp.permission_key,
        'access_type', pp.access_type, 'approval_required', pp.approval_required,
        'companion_access', pp.companion_access, 'integration_access', pp.integration_access,
        'review_status', pp.review_status, 'summary', pp.summary
      ) order by pp.pack_id, pp.permission_key)
      from public.platform_bp602_pack_permissions pp
    ), '[]'::jsonb),
    'test_sandboxes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'sandbox_id', sb.sandbox_id, 'pack_id', sb.pack_id, 'project_id', sb.project_id,
        'sandbox_status', sb.sandbox_status, 'test_org_label', sb.test_org_label,
        'test_users', sb.test_users, 'test_integrations', sb.test_integrations
      ) order by sb.sandbox_id)
      from public.platform_bp602_test_sandboxes sb
    ), '[]'::jsonb),
    'validation_runs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', v.pack_id, 'validation_type', v.validation_type,
        'validation_status', v.validation_status, 'score', v.score, 'summary', v.summary, 'ran_at', v.ran_at
      ) order by v.pack_id, v.validation_type)
      from public.platform_bp602_validation_runs v
    ), '[]'::jsonb),
    'api_endpoints', coalesce((
      select jsonb_agg(jsonb_build_object(
        'api_key', a.api_key, 'api_title', a.api_title, 'api_family', a.api_family,
        'api_version', a.api_version, 'endpoint_path', a.endpoint_path, 'summary', a.summary
      ) order by a.sort_order)
      from public.platform_bp602_api_endpoints a where a.is_available
    ), '[]'::jsonb),
    'api_keys', coalesce((
      select jsonb_agg(jsonb_build_object(
        'key_label', k.key_label, 'developer_id', k.developer_id,
        'project_id', k.project_id, 'key_prefix', k.key_prefix,
        'scopes', k.scopes, 'key_status', k.key_status, 'created_at', k.created_at
      ) order by k.created_at desc)
      from public.platform_bp602_api_keys k
    ), '[]'::jsonb),
    'pack_dependencies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', d.pack_id, 'dependency_key', d.dependency_key,
        'dependency_type', d.dependency_type, 'dependency_title', d.dependency_title,
        'is_required', d.is_required, 'license_ref', d.license_ref, 'summary', d.summary
      ) order by d.pack_id, d.dependency_type)
      from public.platform_bp602_pack_dependencies d
    ), '[]'::jsonb),
    'documentation', coalesce((
      select jsonb_agg(jsonb_build_object(
        'doc_key', doc.doc_key, 'doc_title', doc.doc_title,
        'doc_category', doc.doc_category, 'doc_status', doc.doc_status, 'summary', doc.summary
      ) order by doc.sort_order)
      from public.platform_bp602_documentation doc where doc.doc_status = 'published'
    ), '[]'::jsonb),
    'pack_versions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', pv.pack_id, 'version', pv.version, 'version_status', pv.version_status,
        'breaking_changes', pv.breaking_changes, 'upgrade_notes', pv.upgrade_notes,
        'deprecation_notice', pv.deprecation_notice, 'released_at', pv.released_at
      ) order by pv.pack_id, pv.released_at desc)
      from public.platform_bp602_pack_versions pv
    ), '[]'::jsonb),
    'pack_certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', c.pack_id, 'certification_level', c.certification_level,
        'certification_status', c.certification_status, 'granted_at', c.granted_at,
        'expires_at', c.expires_at, 'summary', c.summary
      ) order by c.pack_id, c.certification_level)
      from public.platform_bp602_pack_certifications c
    ), '[]'::jsonb),
    'marketplace_listings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', m.pack_id, 'pack_name', m.pack_name, 'manifest_status', m.manifest_status,
        'license_type', m.license_type, 'certification_count',
          (select count(*) from public.platform_bp602_pack_certifications c where c.pack_id = m.pack_id and c.certification_status = 'granted')
      ) order by m.manifest_status desc, m.pack_name)
      from public.platform_bp602_pack_manifests m
      where m.manifest_status in ('validated', 'approved', 'published')
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'developer_activity', 'Which developers have projects pending validation?',
      'certification_pipeline', 'Which packs await certification review?',
      'marketplace_growth', 'How many packs reached marketplace-ready status?',
      'platform_usage', 'How many active API keys and sandboxes are in use?'
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'developer_id', a.developer_id, 'project_id', a.project_id,
        'pack_id', a.pack_id, 'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.platform_bp602_audit_logs order by created_at desc limit 25) a
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'supported', true,
      'capabilities', jsonb_build_array(
        'review_projects', 'monitor_validations', 'approve_certifications',
        'review_marketplace_pipeline', 'developer_reports'
      )
    ),
    'rows', coalesce((
      select jsonb_agg(row_data) from (
        select jsonb_build_object('title', p.project_name, 'status', p.project_status, 'customer_name', p.developer_id) as row_data
        from public.platform_bp602_developer_projects p where v_section = 'projects'
        union all
        select jsonb_build_object('title', s.module_title, 'status', s.module_status, 'customer_name', s.module_domain)
        from public.platform_bp602_sdk_modules s where v_section = 'sdk'
        union all
        select jsonb_build_object('title', a.api_title, 'status', a.api_family, 'customer_name', a.endpoint_path)
        from public.platform_bp602_api_endpoints a where v_section = 'api' and a.is_available
        union all
        select jsonb_build_object('title', v.validation_type, 'status', v.validation_status, 'customer_name', v.pack_id)
        from public.platform_bp602_validation_runs v where v_section = 'testing'
        union all
        select jsonb_build_object('title', pv.version, 'status', pv.version_status, 'customer_name', pv.pack_id)
        from public.platform_bp602_pack_versions pv where v_section = 'publishing'
        union all
        select jsonb_build_object('title', m.pack_name, 'status', m.manifest_status, 'customer_name', m.license_type)
        from public.platform_bp602_pack_manifests m
        where v_section = 'marketplace' and m.manifest_status in ('validated', 'approved', 'published')
        union all
        select jsonb_build_object('title', doc.doc_title, 'status', doc.doc_category, 'customer_name', doc.doc_status)
        from public.platform_bp602_documentation doc where v_section = 'reports' and doc.doc_status = 'published'
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Companion Developer Advisor
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_companion_developer_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_exec jsonb;
  v_stats jsonb;
begin
  perform public._bp602_require_platform_admin();
  v_center := public.get_platform_developer_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_exec := v_center->'executive_dashboard';
  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Developer Platform Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'developers',
        'observation', format('%s registered developer(s) with %s active project(s).', v_exec->>'registered_developers', v_exec->>'active_projects'),
        'recommendation', 'Review Projects for development pipeline status.',
        'href', '/platform/developers/projects'
      ),
      jsonb_build_object(
        'key', 'validation',
        'observation', format('%s validation check(s) pending.', v_exec->>'pending_validations'),
        'recommendation', 'Open Testing to resolve validation failures before publish.',
        'href', '/platform/developers/testing'
      ),
      jsonb_build_object(
        'key', 'publishing',
        'observation', format('%s pack(s) published; %s certification(s) granted.', v_exec->>'published_packs', v_exec->>'certifications_granted'),
        'recommendation', 'Review Publishing and marketplace-ready manifests.',
        'href', '/platform/developers/publishing'
      ),
      jsonb_build_object(
        'key', 'sdk',
        'observation', format('%s SDK module(s) and %s API endpoint(s) available.', v_exec->>'sdk_modules', v_exec->>'platform_api_endpoints'),
        'recommendation', 'Share SDK and API documentation with approved developers.',
        'href', '/platform/developers/sdk'
      )
    ),
    'center', v_center
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Mobile summary
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_developer_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  perform public._bp602_require_platform_admin();
  v_center := public.get_platform_developer_center('overview');
  return jsonb_build_object(
    'found', true,
    'registered_developers', v_center->'executive_dashboard'->'registered_developers',
    'active_projects', v_center->'executive_dashboard'->'active_projects',
    'published_packs', v_center->'executive_dashboard'->'published_packs',
    'pending_validations', v_center->'executive_dashboard'->'pending_validations',
    'routes', jsonb_build_object('developer_center', '/platform/developers')
  );
end;
$$;

grant execute on function public.get_platform_developer_center(text) to authenticated;
grant execute on function public.get_aipify_companion_developer_advisor_bundle() to authenticated;
grant execute on function public.get_platform_developer_center_mobile_summary() to authenticated;
