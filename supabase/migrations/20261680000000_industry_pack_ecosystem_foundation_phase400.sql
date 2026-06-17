-- Phase 400 — Industry Pack Ecosystem Foundation
-- Feature owner: CUSTOMER APP. Route: /app/industry-packs. Helpers: _gpeip400_*
-- Federates Business Packs A.43, Phase 111 blueprint, Marketplace Phase 69 (industry_pack items).

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.industry_pack_registry (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  slug text not null unique,
  display_name text not null,
  industry_type text not null check (
    industry_type in (
      'hospitality', 'commerce', 'healthcare', 'legal', 'real_estate',
      'construction', 'manufacturing', 'education', 'logistics',
      'professional_services', 'finance', 'custom'
    )
  ),
  pack_source text not null default 'official' check (
    pack_source in ('official', 'partner', 'enterprise', 'regional', 'certified')
  ),
  lifecycle_status text not null default 'production' check (
    lifecycle_status in ('draft', 'testing', 'pilot', 'production', 'deprecated', 'archived')
  ),
  short_description text not null default '',
  inherits jsonb not null default '["companion","knowledge_center","workforce","governance","marketplace","billing","analytics","automation","identity","permissions","audit_logging","multi_language"]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  marketplace_item_id uuid references public.marketplace_items (id) on delete set null,
  settings_schema jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists industry_pack_registry_industry_idx
  on public.industry_pack_registry (industry_type, lifecycle_status);

create table if not exists public.tenant_industry_pack_installs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  registry_id uuid not null references public.industry_pack_registry (id) on delete restrict,
  install_status text not null default 'active' check (
    install_status in ('pending', 'active', 'paused', 'upgrading', 'removed', 'rolled_back')
  ),
  lifecycle_status text not null default 'production' check (
    lifecycle_status in ('draft', 'testing', 'pilot', 'production', 'deprecated', 'archived')
  ),
  install_mode text not null default 'guided' check (
    install_mode in ('one_click', 'guided', 'enterprise')
  ),
  health_score integer not null default 75 check (health_score between 0 and 100),
  version_label text not null default '1.0.0',
  installed_by uuid references auth.users (id) on delete set null,
  installed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, registry_id)
);

create index if not exists tenant_industry_pack_installs_org_idx
  on public.tenant_industry_pack_installs (organization_id, install_status);

create table if not exists public.tenant_industry_pack_configs (
  id uuid primary key default gen_random_uuid(),
  install_id uuid not null unique references public.tenant_industry_pack_installs (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  industry_settings jsonb not null default '{}'::jsonb,
  workflows jsonb not null default '[]'::jsonb,
  terminology jsonb not null default '{}'::jsonb,
  reports jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  compliance_rules jsonb not null default '[]'::jsonb,
  regional_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists tenant_industry_pack_configs_org_idx
  on public.tenant_industry_pack_configs (organization_id);

create table if not exists public.industry_pack_governance_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_label text not null,
  policy_type text not null check (
    policy_type in (
      'installation', 'permissions', 'dependencies', 'compliance',
      'certification', 'marketplace_publishing'
    )
  ),
  status text not null default 'active' check (status in ('active', 'archived')),
  rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, policy_key)
);

create index if not exists industry_pack_governance_policies_org_idx
  on public.industry_pack_governance_policies (organization_id, policy_type, status);

create table if not exists public.industry_pack_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  registry_id uuid references public.industry_pack_registry (id) on delete set null,
  signal_type text not null check (
    signal_type in (
      'adoption_increasing', 'compliance_review', 'new_installs_trend',
      'usage_growth', 'upgrade_recommended', 'training_available',
      'compliance_configuration', 'new_pack_available'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists industry_pack_advisor_signals_org_idx
  on public.industry_pack_advisor_signals (organization_id, created_at desc);

create table if not exists public.industry_pack_ecosystem_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  registry_id uuid references public.industry_pack_registry (id) on delete set null,
  event_type text not null check (
    event_type in (
      'pack_installed', 'pack_updated', 'pack_removed', 'pack_configured',
      'pack_licensed', 'pack_upgraded', 'pack_governance_updated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists industry_pack_ecosystem_audit_logs_org_idx
  on public.industry_pack_ecosystem_audit_logs (organization_id, created_at desc);

alter table public.industry_pack_registry enable row level security;
alter table public.tenant_industry_pack_installs enable row level security;
alter table public.tenant_industry_pack_configs enable row level security;
alter table public.industry_pack_governance_policies enable row level security;
alter table public.industry_pack_advisor_signals enable row level security;
alter table public.industry_pack_ecosystem_audit_logs enable row level security;

revoke all on public.industry_pack_registry from authenticated, anon;
revoke all on public.tenant_industry_pack_installs from authenticated, anon;
revoke all on public.tenant_industry_pack_configs from authenticated, anon;
revoke all on public.industry_pack_governance_policies from authenticated, anon;
revoke all on public.industry_pack_advisor_signals from authenticated, anon;
revoke all on public.industry_pack_ecosystem_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'industry_pack_ecosystem_engine', v.description
from (values
  ('industry_packs.view', 'View Industry Packs', 'View industry pack catalog, installs, and analytics'),
  ('industry_packs.manage', 'Manage Industry Packs', 'Install, configure, upgrade, and govern industry packs')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Registry seed (idempotent)
-- ---------------------------------------------------------------------------
insert into public.industry_pack_registry (
  pack_key, slug, display_name, industry_type, pack_source, lifecycle_status, short_description
)
select v.pack_key, v.slug, v.display_name, v.industry_type, v.pack_source, v.lifecycle_status, v.short_description
from (values
  ('hospitality_pack', 'hospitality', 'Hospitality Pack', 'hospitality', 'official', 'production', 'Guest operations, property intelligence, and hospitality workflows on shared ABOS foundation.'),
  ('commerce_pack', 'commerce', 'Commerce Pack', 'commerce', 'official', 'production', 'Orders, catalog intelligence, and commerce companion experiences.'),
  ('healthcare_pack', 'healthcare', 'Healthcare Pack', 'healthcare', 'official', 'pilot', 'Clinical-adjacent operations with compliance-first governance scaffolds.'),
  ('legal_pack', 'legal', 'Legal Pack', 'legal', 'official', 'pilot', 'Matter workflows, document governance, and client communication templates.'),
  ('real_estate_pack', 'real-estate', 'Real Estate Pack', 'real_estate', 'official', 'production', 'Listings, showings, and portfolio operations metadata.'),
  ('construction_pack', 'construction', 'Construction Pack', 'construction', 'official', 'testing', 'Project sites, subcontractors, and safety compliance scaffolds.'),
  ('manufacturing_pack', 'manufacturing', 'Manufacturing Pack', 'manufacturing', 'official', 'testing', 'Production lines, quality checks, and supply coordination.'),
  ('education_pack', 'education', 'Education Pack', 'education', 'official', 'production', 'Programs, learners, and institutional knowledge workflows.'),
  ('logistics_pack', 'logistics', 'Logistics Pack', 'logistics', 'official', 'pilot', 'Fleet, routes, and fulfillment coordination metadata.'),
  ('professional_services_pack', 'professional-services', 'Professional Services Pack', 'professional_services', 'official', 'production', 'Engagements, deliverables, and client success operations.'),
  ('finance_pack', 'finance', 'Finance Pack', 'finance', 'certified', 'pilot', 'Financial operations with audit-ready governance controls.')
) as v(pack_key, slug, display_name, industry_type, pack_source, lifecycle_status, short_description)
where not exists (select 1 from public.industry_pack_registry r where r.pack_key = v.pack_key);

-- ---------------------------------------------------------------------------
-- 3. Helpers — _gpeip400_*
-- ---------------------------------------------------------------------------
create or replace function public._gpeip400_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_plan := public._aef_tenant_plan(v_org_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional') then
    raise exception 'Industry Pack Ecosystem requires Growth plan or above';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'plan', v_plan);
end;
$$;

create or replace function public._gpeip400_log_audit(
  p_org_id uuid,
  p_install_id uuid,
  p_registry_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.industry_pack_ecosystem_audit_logs (
    organization_id, install_id, registry_id, event_type, summary, actor_user_id, context
  ) values (
    p_org_id, p_install_id, p_registry_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gpeip400_build_registry_json(p_row public.industry_pack_registry)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'pack_key', p_row.pack_key,
    'slug', p_row.slug,
    'display_name', p_row.display_name,
    'industry_type', p_row.industry_type,
    'pack_source', p_row.pack_source,
    'lifecycle_status', p_row.lifecycle_status,
    'short_description', p_row.short_description,
    'inherits', p_row.inherits,
    'dependencies', p_row.dependencies,
    'marketplace_item_id', p_row.marketplace_item_id
  );
$$;

create or replace function public._gpeip400_build_install_json(p_row public.tenant_industry_pack_installs)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_registry public.industry_pack_registry;
begin
  select * into v_registry from public.industry_pack_registry where id = p_row.registry_id;
  return jsonb_build_object(
    'id', p_row.id,
    'registry_id', p_row.registry_id,
    'install_status', p_row.install_status,
    'lifecycle_status', p_row.lifecycle_status,
    'install_mode', p_row.install_mode,
    'health_score', p_row.health_score,
    'version_label', p_row.version_label,
    'installed_at', p_row.installed_at,
    'updated_at', p_row.updated_at,
    'pack', public._gpeip400_build_registry_json(v_registry)
  );
end;
$$;

create or replace function public._gpeip400_seed_governance(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.industry_pack_governance_policies (organization_id, policy_key, policy_label, policy_type, rules)
  select p_org_id, v.policy_key, v.policy_label, v.policy_type, v.rules::jsonb
  from (values
    ('install_approval', 'Pack installation approval', 'installation', '{"require_admin_approval": true}'),
    ('dependency_check', 'Pack dependency validation', 'dependencies', '{"block_unmet_dependencies": true}'),
    ('compliance_baseline', 'Industry compliance baseline', 'compliance', '{"human_review_default": true}'),
    ('marketplace_publish', 'Marketplace publishing controls', 'marketplace_publishing', '{"certification_required": true}')
  ) as v(policy_key, policy_label, policy_type, rules)
  where not exists (
    select 1 from public.industry_pack_governance_policies g
    where g.organization_id = p_org_id and g.policy_key = v.policy_key
  );
end;
$$;

create or replace function public._gpeip400_seed_advisor_signals(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.industry_pack_advisor_signals where organization_id = p_org_id) then
    return;
  end if;

  insert into public.industry_pack_advisor_signals (
    organization_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_org_id, 'new_pack_available',
      'Several certified industry packs are available in the Industry Pack marketplace.',
      'Specialized packs can accelerate adoption with industry-specific workflows and terminology.',
      'Review available packs and install with guided configuration when ready.',
      'low', 'high'
    ),
    (
      p_org_id, 'compliance_configuration',
      'Healthcare and finance packs include compliance configuration that requires human review.',
      'Incomplete compliance settings may limit pack capabilities until reviewed.',
      'Open pack configuration and complete compliance rules with your administrator.',
      'moderate', 'moderate'
    );
end;
$$;

create or replace function public._gpeip400_analytics_block(p_org_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_installed integer := 0;
  v_active integer := 0;
  v_marketplace integer := 0;
  v_avg_health numeric := 0;
begin
  select count(*)::int, count(*) filter (where install_status = 'active')::int,
         coalesce(avg(health_score), 0)
  into v_installed, v_active, v_avg_health
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and install_status != 'removed';

  select count(*)::int into v_marketplace
  from public.marketplace_items
  where status = 'published' and item_type = 'industry_pack';

  return jsonb_build_object(
    'pack_adoption', v_active,
    'total_installs', v_installed,
    'marketplace_catalog_count', v_marketplace,
    'average_health_score', round(v_avg_health)::int,
    'metadata_only', true,
    'privacy_note', 'Industry analytics use approved metadata only — no private operational records.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_industry_pack_ecosystem_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_installed jsonb := '[]'::jsonb;
  v_available jsonb := '[]'::jsonb;
  v_marketplace jsonb := '[]'::jsonb;
  v_governance jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_architecture jsonb;
begin
  perform public._irp_require_permission('industry_packs.view');
  v_org_id := (public._gpeip400_require_access()->>'organization_id')::uuid;
  perform public._gpeip400_seed_governance(v_org_id);
  perform public._gpeip400_seed_advisor_signals(v_org_id);

  v_architecture := jsonb_build_array(
    'companion', 'knowledge_center', 'workforce', 'governance', 'marketplace',
    'billing', 'analytics', 'automation', 'identity', 'permissions',
    'audit_logging', 'multi_language'
  );

  select coalesce(jsonb_agg(public._gpeip400_build_install_json(i) order by i.installed_at desc), '[]'::jsonb)
  into v_installed
  from public.tenant_industry_pack_installs i
  where i.organization_id = v_org_id and i.install_status != 'removed';

  select coalesce(jsonb_agg(public._gpeip400_build_registry_json(r) order by r.display_name), '[]'::jsonb)
  into v_available
  from public.industry_pack_registry r
  where r.lifecycle_status in ('production', 'pilot')
    and not exists (
      select 1 from public.tenant_industry_pack_installs ti
      where ti.organization_id = v_org_id and ti.registry_id = r.id and ti.install_status != 'removed'
    );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', mi.id, 'item_key', mi.item_key, 'title', mi.title,
    'short_description', mi.short_description, 'industry', mi.industry,
    'author_type', mi.author_type, 'pricing_model', mi.pricing_model,
    'install_count', mi.install_count, 'rating', mi.rating
  ) order by mi.install_count desc), '[]'::jsonb)
  into v_marketplace
  from public.marketplace_items mi
  where mi.status = 'published' and mi.item_type = 'industry_pack'
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'policy_key', g.policy_key, 'policy_label', g.policy_label,
    'policy_type', g.policy_type, 'status', g.status, 'rules', g.rules
  ) order by g.policy_type), '[]'::jsonb)
  into v_governance
  from public.industry_pack_governance_policies g
  where g.organization_id = v_org_id and g.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.industry_pack_advisor_signals s
  where s.organization_id = v_org_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.industry_pack_ecosystem_audit_logs l
  where l.organization_id = v_org_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Every industry is different. The platform remains unified. The experience feels industry-specific.',
    'mission', 'Industry Pack Ecosystem — specialized business operating systems on one shared ABOS foundation.',
    'abos_principle', 'One platform, many industries — Aipify informs and prepares; humans approve installation and governance.',
    'business_packs_route', '/app/business-packs-foundation-engine',
    'marketplace_route', '/app/marketplace',
    'distinction_note', 'Federates Business Packs A.43, Phase 111 industry specialization, and Marketplace industry_pack catalog — does not duplicate engines.',
    'inherited_architecture', v_architecture,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/industry-packs'),
      jsonb_build_object('key', 'installed', 'route', '/app/industry-packs/installed'),
      jsonb_build_object('key', 'available', 'route', '/app/industry-packs/available'),
      jsonb_build_object('key', 'marketplace', 'route', '/app/industry-packs/marketplace'),
      jsonb_build_object('key', 'analytics', 'route', '/app/industry-packs/analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/industry-packs/governance'),
      jsonb_build_object('key', 'lifecycle', 'route', '/app/industry-packs/lifecycle'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/industry-packs/intelligence')
    ),
    'overview', public._gpeip400_analytics_block(v_org_id),
    'installed_packs', v_installed,
    'available_packs', v_available,
    'marketplace_packs', v_marketplace,
    'governance_policies', v_governance,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'analytics', public._gpeip400_analytics_block(v_org_id),
    'executive_dashboard', jsonb_build_object(
      'installed_packs', coalesce(jsonb_array_length(v_installed), 0),
      'industry_adoption', public._gpeip400_analytics_block(v_org_id)->>'pack_adoption',
      'pack_health', public._gpeip400_analytics_block(v_org_id)->>'average_health_score',
      'marketplace_activity', coalesce(jsonb_array_length(v_marketplace), 0),
      'growth_signals', coalesce((
        select jsonb_agg(s.recommendation)
        from public.industry_pack_advisor_signals s
        where s.organization_id = v_org_id
          and s.signal_type in ('adoption_increasing', 'usage_growth', 'new_installs_trend')
      ), '[]'::jsonb)
    ),
    'privacy_note', 'Tenant-isolated industry pack configuration — metadata-first analytics only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.industry_pack_ecosystem_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_action text;
  v_registry public.industry_pack_registry;
  v_install public.tenant_industry_pack_installs;
  v_config public.tenant_industry_pack_configs;
  v_policy public.industry_pack_governance_policies;
begin
  perform public._irp_require_permission('industry_packs.manage');
  perform public._gpeip400_require_access();
  v_org_id := public._mta_require_organization();
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'install_pack' then
    select * into v_registry
    from public.industry_pack_registry
    where id = (p_payload->>'registry_id')::uuid
       or pack_key = coalesce(p_payload->>'pack_key', '');

    if v_registry.id is null then
      raise exception 'Industry pack not found';
    end if;

    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, lifecycle_status,
      install_mode, health_score, version_label, installed_by
    ) values (
      v_org_id, v_registry.id, 'active', v_registry.lifecycle_status,
      coalesce(p_payload->>'install_mode', 'guided'),
      coalesce((p_payload->>'health_score')::int, 78),
      coalesce(p_payload->>'version_label', '1.0.0'),
      auth.uid()
    )
    on conflict (organization_id, registry_id) do update
    set install_status = 'active', updated_at = now(), installed_by = auth.uid()
    returning * into v_install;

    insert into public.tenant_industry_pack_configs (install_id, organization_id)
    values (v_install.id, v_org_id)
    on conflict (install_id) do nothing;

    perform public._gpeip400_log_audit(
      v_org_id, v_install.id, v_registry.id, 'pack_installed',
      'Industry pack installed: ' || v_registry.display_name,
      jsonb_build_object('pack_key', v_registry.pack_key, 'install_mode', v_install.install_mode)
    );

    insert into public.industry_pack_advisor_signals (
      organization_id, install_id, registry_id, signal_type, observation, impact, recommendation, effort, confidence
    ) values (
      v_org_id, v_install.id, v_registry.id, 'usage_growth',
      v_registry.display_name || ' is now active for your organization.',
      'Industry-specific workflows and terminology become available after configuration.',
      'Complete pack configuration and review governance policies before expanding usage.',
      'low', 'high'
    );

    return jsonb_build_object('ok', true, 'install', public._gpeip400_build_install_json(v_install));
  end if;

  if v_action = 'configure_pack' then
    select i.* into v_install
    from public.tenant_industry_pack_installs i
    where i.id = (p_payload->>'install_id')::uuid and i.organization_id = v_org_id;

    if v_install.id is null then raise exception 'Install not found'; end if;

    update public.tenant_industry_pack_configs
    set
      industry_settings = coalesce(p_payload->'industry_settings', industry_settings),
      workflows = coalesce(p_payload->'workflows', workflows),
      terminology = coalesce(p_payload->'terminology', terminology),
      reports = coalesce(p_payload->'reports', reports),
      permissions = coalesce(p_payload->'permissions', permissions),
      compliance_rules = coalesce(p_payload->'compliance_rules', compliance_rules),
      regional_settings = coalesce(p_payload->'regional_settings', regional_settings),
      updated_at = now()
    where install_id = v_install.id
    returning * into v_config;

    perform public._gpeip400_log_audit(
      v_org_id, v_install.id, v_install.registry_id, 'pack_configured',
      'Industry pack configuration updated',
      jsonb_build_object('install_id', v_install.id)
    );

    return jsonb_build_object('ok', true, 'config', row_to_json(v_config)::jsonb);
  end if;

  if v_action = 'upgrade_pack' then
    update public.tenant_industry_pack_installs
    set
      version_label = coalesce(p_payload->>'version_label', version_label),
      install_status = 'active',
      health_score = least(100, health_score + 2),
      updated_at = now()
    where id = (p_payload->>'install_id')::uuid and organization_id = v_org_id
    returning * into v_install;

    if v_install.id is null then raise exception 'Install not found'; end if;

    perform public._gpeip400_log_audit(
      v_org_id, v_install.id, v_install.registry_id, 'pack_upgraded',
      'Industry pack upgraded to ' || v_install.version_label,
      jsonb_build_object('version_label', v_install.version_label)
    );

    return jsonb_build_object('ok', true, 'install', public._gpeip400_build_install_json(v_install));
  end if;

  if v_action = 'remove_pack' then
    update public.tenant_industry_pack_installs
    set install_status = 'removed', updated_at = now()
    where id = (p_payload->>'install_id')::uuid and organization_id = v_org_id
    returning * into v_install;

    if v_install.id is null then raise exception 'Install not found'; end if;

    perform public._gpeip400_log_audit(
      v_org_id, v_install.id, v_install.registry_id, 'pack_removed',
      'Industry pack removed',
      jsonb_build_object('install_id', v_install.id)
    );

    return jsonb_build_object('ok', true, 'removed', true);
  end if;

  if v_action = 'update_governance' then
    update public.industry_pack_governance_policies
    set
      rules = coalesce(p_payload->'rules', rules),
      status = coalesce(p_payload->>'status', status),
      updated_at = now()
    where organization_id = v_org_id and policy_key = coalesce(p_payload->>'policy_key', '')
    returning * into v_policy;

    perform public._gpeip400_log_audit(
      v_org_id, null, null, 'pack_governance_updated',
      'Industry pack governance updated: ' || coalesce(p_payload->>'policy_key', ''),
      coalesce(p_payload->'rules', '{}'::jsonb)
    );

    return jsonb_build_object('ok', true, 'policy', row_to_json(v_policy)::jsonb);
  end if;

  raise exception 'Unsupported industry pack action: %', v_action;
end;
$$;

create or replace function public.get_platform_industry_pack_ecosystem_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_registry integer := 0;
  v_installs integer := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select count(*)::int into v_registry from public.industry_pack_registry where lifecycle_status = 'production';
  select count(*)::int into v_installs from public.tenant_industry_pack_installs where install_status = 'active';

  return jsonb_build_object(
    'found', true,
    'production_packs', v_registry,
    'active_installs', v_installs,
    'privacy_note', 'Platform aggregates only — no tenant configuration content.'
  );
end;
$$;

grant execute on function public.get_industry_pack_ecosystem_center() to authenticated;
grant execute on function public.industry_pack_ecosystem_action(jsonb) to authenticated;
grant execute on function public.get_platform_industry_pack_ecosystem_overview() to authenticated;
