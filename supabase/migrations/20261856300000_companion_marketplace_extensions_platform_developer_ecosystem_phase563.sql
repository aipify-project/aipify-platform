-- Phase 563 — Companion Marketplace, Extensions Platform & Developer Ecosystem
-- Feature owner: CUSTOMER APP + PLATFORM ADMIN
-- Routes: /app/companion/marketplace, /app/companion/marketplace/extensions, /platform/developers
-- Helpers: _cmmp563_* (customer), _pdev563_* (platform)

-- ===========================================================================
-- PLATFORM — Developer Ecosystem
-- ===========================================================================

create table if not exists public.platform_developer_ecosystem_settings (
  id uuid primary key default gen_random_uuid(),
  portal_enabled boolean not null default true,
  sdk_enabled boolean not null default true,
  certification_required boolean not null default true,
  localization_required boolean not null default true,
  supported_locales jsonb not null default '["en","no","sv","da"]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.platform_developer_ecosystem_settings (id)
select gen_random_uuid() where not exists (
  select 1 from public.platform_developer_ecosystem_settings limit 1
);

alter table public.platform_developer_ecosystem_settings enable row level security;
revoke all on public.platform_developer_ecosystem_settings from authenticated, anon;

create table if not exists public.platform_companion_extension_publishers (
  id uuid primary key default gen_random_uuid(),
  publisher_key text not null unique,
  publisher_name text not null,
  publisher_type text not null check (
    publisher_type in ('aipify_official', 'growth_partner', 'verified_organization', 'verified_developer', 'enterprise')
  ),
  verification_status text not null default 'verified' check (
    verification_status in ('pending', 'verified', 'suspended')
  ),
  extensions_count integer not null default 0,
  overall_rating numeric(3,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.platform_companion_extension_publishers enable row level security;
revoke all on public.platform_companion_extension_publishers from authenticated, anon;

create table if not exists public.platform_companion_extension_catalog (
  id uuid primary key default gen_random_uuid(),
  extension_key text not null unique,
  extension_name text not null,
  publisher_key text not null references public.platform_companion_extension_publishers (publisher_key) on delete cascade,
  publisher_name text not null default '',
  version text not null default '1.0.0',
  extension_category text not null check (
    extension_category in (
      'productivity', 'operations', 'finance', 'sales', 'marketing', 'support',
      'knowledge', 'analytics', 'industry', 'automation', 'executive', 'custom'
    )
  ),
  pricing_tier text not null default 'free' check (
    pricing_tier in ('free', 'premium', 'enterprise', 'partner')
  ),
  certification_status text not null default 'published' check (
    certification_status in ('pending', 'review', 'certified', 'published')
  ),
  extension_status text not null default 'active' check (
    extension_status in ('active', 'installing', 'update_available', 'permission_required', 'disabled')
  ),
  description text not null default '' check (char_length(description) <= 500),
  permissions jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  business_packs jsonb not null default '[]'::jsonb,
  locales_supported jsonb not null default '["en","no","sv","da"]'::jsonb,
  install_count integer not null default 0,
  overall_rating numeric(3,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.platform_companion_extension_catalog enable row level security;
revoke all on public.platform_companion_extension_catalog from authenticated, anon;

create table if not exists public.platform_developer_ecosystem_sdk_modules (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  module_title text not null,
  module_type text not null check (
    module_type in ('skills', 'dashboards', 'widgets', 'workflows', 'knowledge', 'reports', 'notifications', 'integrations')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  is_active boolean not null default true
);

alter table public.platform_developer_ecosystem_sdk_modules enable row level security;
revoke all on public.platform_developer_ecosystem_sdk_modules from authenticated, anon;

create table if not exists public.platform_developer_ecosystem_audit_logs (
  id uuid primary key default gen_random_uuid(),
  publisher_key text,
  extension_key text,
  event_type text not null,
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_developer_ecosystem_audit_logs_created_idx
  on public.platform_developer_ecosystem_audit_logs (created_at desc);

alter table public.platform_developer_ecosystem_audit_logs enable row level security;
revoke all on public.platform_developer_ecosystem_audit_logs from authenticated, anon;

-- ===========================================================================
-- CUSTOMER — Companion Marketplace
-- ===========================================================================

create table if not exists public.organization_companion_marketplace_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  marketplace_enabled boolean not null default true,
  governance_required boolean not null default true,
  permission_review_required boolean not null default true,
  auto_update_enabled boolean not null default false,
  growth_partner_extensions_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_marketplace_settings enable row level security;
revoke all on public.organization_companion_marketplace_settings from authenticated, anon;

create table if not exists public.organization_companion_marketplace_installed (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  install_key text not null,
  extension_key text not null,
  extension_name text not null,
  publisher_name text not null default '',
  version text not null default '1.0.0',
  install_status text not null default 'active' check (
    install_status in ('active', 'installing', 'update_available', 'permission_required', 'disabled')
  ),
  permissions_granted jsonb not null default '[]'::jsonb,
  installed_at timestamptz not null default now(),
  unique (organization_id, install_key)
);

alter table public.organization_companion_marketplace_installed enable row level security;
revoke all on public.organization_companion_marketplace_installed from authenticated, anon;

create table if not exists public.organization_companion_marketplace_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  extension_key text not null,
  extension_name text not null,
  rating_score integer not null default 5 check (rating_score between 1 and 5),
  review_summary text not null default '' check (char_length(review_summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, review_key)
);

alter table public.organization_companion_marketplace_reviews enable row level security;
revoke all on public.organization_companion_marketplace_reviews from authenticated, anon;

create table if not exists public.organization_companion_marketplace_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  governance_key text not null,
  governance_title text not null,
  governance_type text not null check (
    governance_type in ('approval', 'permission_review', 'security_review', 'version_control')
  ),
  governance_status text not null default 'pending' check (
    governance_status in ('pending', 'approved', 'denied', 'review_required')
  ),
  extension_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, governance_key)
);

alter table public.organization_companion_marketplace_governance enable row level security;
revoke all on public.organization_companion_marketplace_governance from authenticated, anon;

create table if not exists public.organization_companion_marketplace_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'usage' check (
    metric_category in ('installs', 'usage', 'performance', 'ratings', 'renewals', 'revenue')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_marketplace_analytics enable row level security;
revoke all on public.organization_companion_marketplace_analytics from authenticated, anon;

create table if not exists public.organization_companion_marketplace_business_pack_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  recommended_extension_keys jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_marketplace_business_pack_links enable row level security;
revoke all on public.organization_companion_marketplace_business_pack_links from authenticated, anon;

create table if not exists public.organization_companion_marketplace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'marketplace' check (
    audit_category in ('install', 'update', 'remove', 'permission', 'purchase', 'certification', 'publisher')
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_marketplace_audit_logs_org_idx
  on public.organization_companion_marketplace_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_marketplace_audit_logs enable row level security;
revoke all on public.organization_companion_marketplace_audit_logs from authenticated, anon;

-- ===========================================================================
-- Helpers — Platform
-- ===========================================================================

create or replace function public._pdev563_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
end; $$;

create or replace function public._pdev563_log(
  p_publisher_key text, p_extension_key text, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_developer_ecosystem_audit_logs (publisher_key, extension_key, event_type, summary, context)
  values (p_publisher_key, p_extension_key, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._pdev563_seed()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.platform_companion_extension_publishers limit 1) then return; end if;

  insert into public.platform_companion_extension_publishers (
    publisher_key, publisher_name, publisher_type, verification_status, extensions_count, overall_rating, summary
  ) values
    ('pub_aipify_official', 'Aipify Group AS', 'aipify_official', 'verified', 5, 4.9, 'Official Aipify Companion extensions.'),
    ('pub_nordic_partner', 'Nordic Growth Partner', 'growth_partner', 'verified', 3, 4.6, 'Verified Growth Partner publisher.'),
    ('pub_enterprise_dev', 'Enterprise Solutions AS', 'verified_developer', 'verified', 2, 4.5, 'Verified third-party developer.');

  insert into public.platform_companion_extension_catalog (
    extension_key, extension_name, publisher_key, publisher_name, version, extension_category,
    pricing_tier, certification_status, extension_status, description,
    permissions, dependencies, business_packs, locales_supported, install_count, overall_rating
  ) values
    ('ext_exec_briefing', 'Executive Briefing Extension', 'pub_aipify_official', 'Aipify Group AS', '2.1.0', 'executive',
     'free', 'published', 'active', 'Enhanced executive briefing capabilities for Companion.',
     '["executive_data","briefing_actions"]'::jsonb, '[]'::jsonb, '["pack_executive"]'::jsonb, '["en","no","sv","da"]'::jsonb, 128, 4.8),
    ('ext_revenue_forecast', 'Revenue Forecast Extension', 'pub_aipify_official', 'Aipify Group AS', '1.4.0', 'finance',
     'premium', 'published', 'active', 'Revenue forecasting and trend analysis for Companion.',
     '["revenue_data","forecast_actions"]'::jsonb, '["ext_exec_briefing"]'::jsonb, '["pack_finance"]'::jsonb, '["en","no","sv","da"]'::jsonb, 86, 4.7),
    ('ext_customer_insights', 'Customer Insights Extension', 'pub_aipify_official', 'Aipify Group AS', '1.2.0', 'analytics',
     'free', 'published', 'active', 'Customer engagement and insight dashboards.',
     '["customer_metadata","analytics_views"]'::jsonb, '[]'::jsonb, '["pack_support"]'::jsonb, '["en","no","sv","da"]'::jsonb, 94, 4.6),
    ('ext_contract_analysis', 'Contract Analysis Extension', 'pub_enterprise_dev', 'Enterprise Solutions AS', '1.0.0', 'operations',
     'enterprise', 'certified', 'active', 'Contract review and analysis toolkit.',
     '["document_metadata","draft_actions"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '["en","no","sv","da"]'::jsonb, 42, 4.5),
    ('ext_inventory_forecast', 'Inventory Forecast Extension', 'pub_nordic_partner', 'Nordic Growth Partner', '1.1.0', 'operations',
     'partner', 'published', 'active', 'Inventory optimization for warehouse operations.',
     '["inventory_metadata","forecast_actions"]'::jsonb, '[]'::jsonb, '["pack_warehouse"]'::jsonb, '["en","no","sv","da"]'::jsonb, 35, 4.4),
    ('ext_industry_benchmark', 'Industry Benchmark Extension', 'pub_nordic_partner', 'Nordic Growth Partner', '1.0.0', 'industry',
     'premium', 'review', 'permission_required', 'Industry benchmark comparisons — certification review in progress.',
     '["industry_metadata","benchmark_views"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '["en","no","sv","da"]'::jsonb, 12, 4.3);

  insert into public.platform_developer_ecosystem_sdk_modules (module_key, module_title, module_type, summary) values
    ('sdk_companion_skills', 'Companion Skills SDK', 'skills', 'Build and publish Companion Skills extensions.'),
    ('sdk_dashboards', 'Dashboard Widget SDK', 'dashboards', 'Create marketplace dashboard widgets.'),
    ('sdk_workflows', 'Workflow SDK', 'workflows', 'Define automated Companion workflows.'),
    ('sdk_knowledge', 'Knowledge Source SDK', 'knowledge', 'Connect approved knowledge sources.'),
    ('sdk_integrations', 'Integration SDK', 'integrations', 'Build verified integration connectors.');

  perform public._pdev563_log(null, null, 'developer_ecosystem_seeded', 'Developer ecosystem seeded for Phase 563', '{}'::jsonb);
end; $$;

-- ===========================================================================
-- Helpers — Customer
-- ===========================================================================

create or replace function public._cmmp563_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmmp563_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'marketplace'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_marketplace_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'marketplace'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmmp563_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_marketplace_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmmp563_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._pdev563_seed();

  if exists (select 1 from public.organization_companion_marketplace_installed where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_marketplace_installed (
    organization_id, install_key, extension_key, extension_name, publisher_name, version, install_status, permissions_granted
  ) values
    (p_org_id, 'ins_exec_brief', 'ext_exec_briefing', 'Executive Briefing Extension', 'Aipify Group AS', '2.1.0', 'active',
     '["executive_data","briefing_actions"]'::jsonb),
    (p_org_id, 'ins_revenue', 'ext_revenue_forecast', 'Revenue Forecast Extension', 'Aipify Group AS', '1.4.0', 'update_available',
     '["revenue_data","forecast_actions"]'::jsonb),
    (p_org_id, 'ins_customer', 'ext_customer_insights', 'Customer Insights Extension', 'Aipify Group AS', '1.2.0', 'active',
     '["customer_metadata","analytics_views"]'::jsonb);

  insert into public.organization_companion_marketplace_reviews (
    organization_id, review_key, extension_key, extension_name, rating_score, review_summary
  ) values
    (p_org_id, 'rev_exec_brief', 'ext_exec_briefing', 'Executive Briefing Extension', 5,
     'Essential for daily executive briefings — well integrated with Companion.'),
    (p_org_id, 'rev_customer', 'ext_customer_insights', 'Customer Insights Extension', 4,
     'Useful customer analytics — clear permission boundaries.');

  insert into public.organization_companion_marketplace_governance (
    organization_id, governance_key, governance_title, governance_type, governance_status, extension_key, summary
  ) values
    (p_org_id, 'gov_contract_perm', 'Contract Analysis Permission Review', 'permission_review', 'pending', 'ext_contract_analysis',
     'Permission review required before installing Contract Analysis Extension.'),
    (p_org_id, 'gov_revenue_update', 'Revenue Forecast Update Review', 'version_control', 'review_required', 'ext_revenue_forecast',
     'Version 1.5.0 available — review changelog before updating.');

  insert into public.organization_companion_marketplace_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_installs', 'Total Installs', 3, 'installs'),
    (p_org_id, 'metric_active_users', 'Active Extension Users', 24, 'usage'),
    (p_org_id, 'metric_avg_rating', 'Average Rating', 4.5, 'ratings'),
    (p_org_id, 'metric_renewals', 'Renewal Rate %', 92, 'renewals');

  insert into public.organization_companion_marketplace_business_pack_links (
    organization_id, pack_key, pack_title, recommended_extension_keys, summary
  ) values
    (p_org_id, 'pack_finance', 'Finance Pack', '["ext_revenue_forecast"]'::jsonb, 'Financial extensions for Finance Pack.'),
    (p_org_id, 'pack_support', 'Support Pack', '["ext_customer_insights"]'::jsonb, 'Support toolkit extensions.'),
    (p_org_id, 'pack_warehouse', 'Warehouse Pack', '["ext_inventory_forecast"]'::jsonb, 'Inventory optimizer for Warehouse Pack.');
end; $$;

-- ===========================================================================
-- RPC — Platform Developer Portal
-- ===========================================================================

create or replace function public.get_platform_developer_ecosystem_portal(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_overview jsonb; v_publishers jsonb; v_extensions jsonb; v_sdk jsonb; v_audit jsonb;
begin
  if not public.is_platform_admin() then
    return jsonb_build_object('found', false, 'error', 'Platform admin required');
  end if;
  perform public._pdev563_seed();

  select jsonb_build_object(
    'verified_publishers', (select count(*) from public.platform_companion_extension_publishers where verification_status = 'verified'),
    'catalog_extensions', (select count(*) from public.platform_companion_extension_catalog),
    'certified_extensions', (select count(*) from public.platform_companion_extension_catalog where certification_status in ('certified', 'published')),
    'sdk_modules', (select count(*) from public.platform_developer_ecosystem_sdk_modules where is_active),
    'total_installs', coalesce((select sum(install_count) from public.platform_companion_extension_catalog), 0)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'publisher_key', p.publisher_key, 'publisher_name', p.publisher_name, 'publisher_type', p.publisher_type,
    'verification_status', p.verification_status, 'extensions_count', p.extensions_count,
    'overall_rating', p.overall_rating, 'summary', p.summary
  ) order by p.publisher_name), '[]'::jsonb)
  into v_publishers from public.platform_companion_extension_publishers p;

  select coalesce(jsonb_agg(jsonb_build_object(
    'extension_key', e.extension_key, 'extension_name', e.extension_name, 'publisher_name', e.publisher_name,
    'version', e.version, 'extension_category', e.extension_category, 'pricing_tier', e.pricing_tier,
    'certification_status', e.certification_status, 'extension_status', e.extension_status,
    'description', e.description, 'permissions', e.permissions, 'locales_supported', e.locales_supported,
    'install_count', e.install_count, 'overall_rating', e.overall_rating
  ) order by e.install_count desc), '[]'::jsonb)
  into v_extensions from public.platform_companion_extension_catalog e;

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', s.module_key, 'module_title', s.module_title, 'module_type', s.module_type, 'summary', s.summary
  ) order by s.module_title), '[]'::jsonb)
  into v_sdk from public.platform_developer_ecosystem_sdk_modules s where s.is_active;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at)
      order by a.created_at desc)
    from (select * from public.platform_developer_ecosystem_audit_logs order by created_at desc limit 10) a
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify provides the platform. The ecosystem provides innovation.',
    'section', coalesce(p_section, 'overview'),
    'overview', v_overview,
    'publishers', v_publishers,
    'extensions', v_extensions,
    'sdk_modules', v_sdk,
    'documentation', jsonb_build_object(
      'api_reference', '/platform/developers',
      'sdk_guide', 'Extension SDK supports Skills, Dashboards, Widgets, Workflows, Knowledge, Reports, Notifications, Integrations.',
      'certification_flow', jsonb_build_array('Security Review', 'Governance Review', 'Localization Review', 'Performance Review', 'Companion Review', 'Marketplace Review')
    ),
    'certification_statuses', jsonb_build_object(
      'pending', 'Pending', 'review', 'Review', 'certified', 'Certified', 'published', 'Published'
    ),
    'audit_recent', v_audit,
    'routes', jsonb_build_object('marketplace', '/app/companion/marketplace'),
    'mobile_access', jsonb_build_object('enabled', true)
  );
end; $$;

create or replace function public.perform_platform_developer_ecosystem_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_extension_key text := coalesce(p_payload->>'extension_key', '');
  v_publisher_key text := coalesce(p_payload->>'publisher_key', '');
begin
  perform public._pdev563_require_platform_admin();

  if v_action = 'certify_extension' and v_extension_key <> '' then
    update public.platform_companion_extension_catalog
    set certification_status = 'certified', extension_status = 'active', updated_at = now()
    where extension_key = v_extension_key;
    perform public._pdev563_log(null, v_extension_key, 'extension_certified', 'Extension certified', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_publisher' and v_publisher_key <> '' then
    update public.platform_companion_extension_publishers
    set verification_status = 'verified' where publisher_key = v_publisher_key;
    perform public._pdev563_log(v_publisher_key, null, 'publisher_approved', 'Publisher approved', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_analytics' then
    perform public._pdev563_log(null, null, 'analytics_refreshed', 'Developer analytics refreshed', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_platform_developer_ecosystem_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return (public.get_platform_developer_ecosystem_portal('overview')->'overview')
    || jsonb_build_object('found', public.is_platform_admin());
end; $$;

-- ===========================================================================
-- RPC — Customer Companion Marketplace
-- ===========================================================================

create or replace function public.get_organization_companion_marketplace_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_extensions jsonb; v_installed jsonb;
  v_publishers jsonb; v_reviews jsonb; v_governance jsonb; v_reports jsonb; v_executive jsonb;
  v_integrations jsonb; v_audit jsonb;
begin
  v_org_id := public._cmmp563_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmmp563_ensure_settings(v_org_id);
  perform public._cmmp563_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'catalog_extensions', (select count(*) from public.platform_companion_extension_catalog),
    'installed_extensions', (select count(*) from public.organization_companion_marketplace_installed where organization_id = v_org_id),
    'updates_available', (select count(*) from public.organization_companion_marketplace_installed where organization_id = v_org_id and install_status = 'update_available'),
    'pending_governance', (select count(*) from public.organization_companion_marketplace_governance where organization_id = v_org_id and governance_status in ('pending', 'review_required')),
    'verified_publishers', (select count(*) from public.platform_companion_extension_publishers where verification_status = 'verified'),
    'average_rating', coalesce((select round(avg(rating_score)::numeric, 1) from public.organization_companion_marketplace_reviews where organization_id = v_org_id), 4.5)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'extension_key', e.extension_key, 'extension_name', e.extension_name, 'publisher_name', e.publisher_name,
    'version', e.version, 'extension_category', e.extension_category, 'pricing_tier', e.pricing_tier,
    'certification_status', e.certification_status, 'extension_status', e.extension_status,
    'description', e.description, 'permissions', e.permissions, 'dependencies', e.dependencies,
    'business_packs', e.business_packs, 'locales_supported', e.locales_supported,
    'install_count', e.install_count, 'overall_rating', e.overall_rating
  ) order by e.install_count desc), '[]'::jsonb)
  into v_extensions from public.platform_companion_extension_catalog e;

  select coalesce(jsonb_agg(jsonb_build_object(
    'install_key', i.install_key, 'extension_key', i.extension_key, 'extension_name', i.extension_name,
    'publisher_name', i.publisher_name, 'version', i.version, 'install_status', i.install_status,
    'permissions_granted', i.permissions_granted, 'installed_at', i.installed_at
  ) order by i.installed_at desc), '[]'::jsonb)
  into v_installed from public.organization_companion_marketplace_installed i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'publisher_key', p.publisher_key, 'publisher_name', p.publisher_name, 'publisher_type', p.publisher_type,
    'verification_status', p.verification_status, 'extensions_count', p.extensions_count,
    'overall_rating', p.overall_rating, 'summary', p.summary
  ) order by p.overall_rating desc), '[]'::jsonb)
  into v_publishers from public.platform_companion_extension_publishers p where p.verification_status = 'verified';

  select coalesce(jsonb_agg(jsonb_build_object(
    'review_key', r.review_key, 'extension_key', r.extension_key, 'extension_name', r.extension_name,
    'rating_score', r.rating_score, 'review_summary', r.review_summary
  ) order by r.recorded_at desc), '[]'::jsonb)
  into v_reviews from public.organization_companion_marketplace_reviews r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'governance_key', g.governance_key, 'governance_title', g.governance_title,
    'governance_type', g.governance_type, 'governance_status', g.governance_status,
    'extension_key', g.extension_key, 'summary', g.summary
  ) order by g.governance_title), '[]'::jsonb)
  into v_governance from public.organization_companion_marketplace_governance g where g.organization_id = v_org_id;

  select jsonb_build_object(
    'extension_usage', coalesce((
      select jsonb_agg(jsonb_build_object('metric_title', a.metric_title, 'metric_value', a.metric_value, 'metric_category', a.metric_category)
        order by a.metric_category)
      from public.organization_companion_marketplace_analytics a where a.organization_id = v_org_id
    ), '[]'::jsonb),
    'top_installed', coalesce((
      select jsonb_agg(jsonb_build_object('extension_name', e.extension_name, 'install_count', e.install_count)
        order by e.install_count desc)
      from (select * from public.platform_companion_extension_catalog order by install_count desc limit 5) e
    ), '[]'::jsonb),
    'marketplace_growth', jsonb_build_object('catalog_size', (select count(*) from public.platform_companion_extension_catalog)),
    'industry_adoption', jsonb_build_object('industry_extensions', (select count(*) from public.platform_companion_extension_catalog where extension_category = 'industry')),
    'certification_metrics', jsonb_build_object(
      'certified', (select count(*) from public.platform_companion_extension_catalog where certification_status in ('certified', 'published')),
      'in_review', (select count(*) from public.platform_companion_extension_catalog where certification_status = 'review')
    ),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Install Executive Briefing Extension', 'reason', 'Popular with executive teams'),
      jsonb_build_object('title', 'Update Revenue Forecast Extension', 'reason', 'Version 1.5.0 available'),
      jsonb_build_object('title', 'Review Contract Analysis permissions', 'reason', 'Permission review pending')
    )
  ) into v_reports;

  select jsonb_build_object(
    'installed_extensions', (select count(*) from public.organization_companion_marketplace_installed where organization_id = v_org_id),
    'marketplace_activity', (select count(*) from public.platform_companion_extension_catalog),
    'publisher_activity', (select count(*) from public.platform_companion_extension_publishers where verification_status = 'verified'),
    'extension_health', (select count(*) from public.organization_companion_marketplace_installed where organization_id = v_org_id and install_status = 'active'),
    'revenue_generated', coalesce((select metric_value from public.organization_companion_marketplace_analytics where organization_id = v_org_id and metric_key = 'metric_renewals'), 0),
    'companion_recommendations', 3
  ) into v_executive;

  select jsonb_build_object(
    'installation_workflow', jsonb_build_array(
      'Select Extension', 'Review Capabilities', 'Review Permissions', 'Review Dependencies',
      'Approve', 'Install', 'Activate', 'Audit Log'
    ),
    'permission_framework', jsonb_build_object(
      'declares', jsonb_build_array('Data Access', 'Capabilities', 'Knowledge Sources', 'Actions', 'Integrations', 'Domains')
    ),
    'extension_categories', jsonb_build_array(
      'productivity', 'operations', 'finance', 'sales', 'marketing', 'support',
      'knowledge', 'analytics', 'industry', 'automation', 'executive', 'custom'
    ),
    'extension_advisor_prompts', jsonb_build_array(
      'What extensions should we install?', 'What extensions are popular?',
      'What extensions fit our industry?', 'Which extensions need updates?'
    ),
    'business_pack_links', coalesce((
      select jsonb_agg(jsonb_build_object('pack_key', bp.pack_key, 'pack_title', bp.pack_title,
        'recommended_extension_keys', bp.recommended_extension_keys, 'summary', bp.summary)
        order by bp.pack_title)
      from public.organization_companion_marketplace_business_pack_links bp where bp.organization_id = v_org_id
    ), '[]'::jsonb),
    'growth_partner_publishing', jsonb_build_object(
      'enabled', true,
      'note', 'Growth Partners may publish industry templates, skills, workflows, and reports — subject to certification.',
      'route', '/app/growth-partner-operations'
    ),
    'governance_integration', jsonb_build_object('phase', '560', 'route', '/app/companion/governance'),
    'skills_integration', jsonb_build_object('phase', '556', 'route', '/app/companion/skills')
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_marketplace_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'The Companion should be infinitely expandable — Aipify provides the platform, the ecosystem provides innovation.',
    'philosophy', 'Companion should grow through trusted extensions. No extension may bypass governance.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'extensions', v_extensions,
    'installed', v_installed,
    'updates', coalesce((
      select jsonb_agg(jsonb_build_object('install_key', i.install_key, 'extension_name', i.extension_name,
        'version', i.version, 'install_status', i.install_status))
      from public.organization_companion_marketplace_installed i
      where i.organization_id = v_org_id and i.install_status = 'update_available'
    ), '[]'::jsonb),
    'publishers', v_publishers,
    'reviews', v_reviews,
    'categories', (select jsonb_build_array(
      'productivity', 'operations', 'finance', 'sales', 'marketing', 'support',
      'knowledge', 'analytics', 'industry', 'automation', 'executive', 'custom'
    )),
    'governance', v_governance,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'marketplace', '/app/companion/marketplace',
      'extensions', '/app/companion/marketplace/extensions',
      'developers', '/platform/developers',
      'governance', '/app/companion/governance'
    ),
    'notifications', jsonb_build_object(
      'extension_installed', true, 'update_available', true, 'certification_expiring', true,
      'permission_review_required', true, 'extension_health_issue', true, 'publisher_approved', true
    ),
    'mobile_access', jsonb_build_object(
      'browse_marketplace', true, 'install_extensions', true, 'review_permissions', true,
      'manage_updates', true, 'review_publishers', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_marketplace_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_extension_key text := coalesce(p_payload->>'extension_key', '');
  v_install_key text := coalesce(p_payload->>'install_key', '');
  v_governance_key text := coalesce(p_payload->>'governance_key', '');
  v_ext record;
begin
  v_org_id := public._cmmp563_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'install_extension' and v_extension_key <> '' then
    select * into v_ext from public.platform_companion_extension_catalog where extension_key = v_extension_key limit 1;
    if v_ext is null then raise exception 'Extension not found'; end if;
    insert into public.organization_companion_marketplace_installed (
      organization_id, install_key, extension_key, extension_name, publisher_name, version, install_status, permissions_granted
    ) values (
      v_org_id, 'ins_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      v_ext.extension_key, v_ext.extension_name, v_ext.publisher_name, v_ext.version, 'installing', v_ext.permissions
    );
    perform public._cmmp563_log(v_org_id, 'extension_installed', 'Extension installation initiated', p_payload, 'install');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'remove_extension' and v_install_key <> '' then
    delete from public.organization_companion_marketplace_installed
    where organization_id = v_org_id and install_key = v_install_key;
    perform public._cmmp563_log(v_org_id, 'extension_removed', 'Extension removed', p_payload, 'remove');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_extension' and v_install_key <> '' then
    update public.organization_companion_marketplace_installed
    set install_status = 'active', version = version || '.1'
    where organization_id = v_org_id and install_key = v_install_key;
    perform public._cmmp563_log(v_org_id, 'extension_updated', 'Extension updated', p_payload, 'update');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_governance' and v_governance_key <> '' then
    update public.organization_companion_marketplace_governance
    set governance_status = 'approved' where organization_id = v_org_id and governance_key = v_governance_key;
    perform public._cmmp563_log(v_org_id, 'permission_granted', 'Extension governance approved', p_payload, 'permission');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_marketplace' then
    perform public._cmmp563_log(v_org_id, 'marketplace_refreshed', 'Marketplace refreshed', p_payload, 'marketplace');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_marketplace_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmmp563_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_marketplace_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/companion/marketplace');
end; $$;

create or replace function public.get_assistant_companion_marketplace_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmmp563_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps manage Companion extensions — recommend, install, and review with governance.',
    'advisor_prompts', jsonb_build_array(
      'What extensions should we install?', 'What extensions are popular?',
      'What extensions fit our industry?', 'Which extensions need updates?'
    ),
    'installed_count', (select count(*) from public.organization_companion_marketplace_installed where organization_id = v_org_id),
    'updates_available', (select count(*) from public.organization_companion_marketplace_installed where organization_id = v_org_id and install_status = 'update_available'),
    'route', '/app/companion/marketplace'
  );
end; $$;

grant execute on function public.get_platform_developer_ecosystem_portal(text) to authenticated;
grant execute on function public.perform_platform_developer_ecosystem_action(jsonb) to authenticated;
grant execute on function public.get_platform_developer_ecosystem_mobile_summary() to authenticated;
grant execute on function public.get_organization_companion_marketplace_center(text) to authenticated;
grant execute on function public.perform_organization_companion_marketplace_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_marketplace_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_marketplace_advisor_context() to authenticated;
