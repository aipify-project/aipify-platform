-- Phase 542 — App Store, Business Pack Marketplace & License Orchestration Engine
-- Purchase. Approve. Install. Use.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketplace_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  trials_enabled boolean not null default true,
  domain_license_enforcement boolean not null default true,
  dependency_checks_enabled boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  self_service_purchase boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_marketplace_operations_settings enable row level security;
revoke all on public.organization_marketplace_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Global Business Pack catalog (marketplace listings)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_marketplace_operations_catalog (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  description text not null default '',
  category text not null default 'operations' check (
    category in (
      'operations', 'finance', 'commerce', 'support', 'sales', 'marketing',
      'projects', 'hr', 'governance', 'analytics', 'industry', 'custom'
    )
  ),
  industry_key text,
  version text not null default '1.0.0',
  pricing_model text not null default 'subscription',
  starting_price_monthly numeric(12, 2),
  trial_days int not null default 14 check (trial_days >= 0),
  required_permissions jsonb not null default '[]'::jsonb,
  required_domains int not null default 1,
  dependencies jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_available boolean not null default true,
  sort_order int not null default 0,
  release_notes text not null default '',
  documentation_href text not null default '/app/marketplace',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.aipify_marketplace_operations_catalog enable row level security;
revoke all on public.aipify_marketplace_operations_catalog from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Pack trials
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketplace_pack_trials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_id uuid references public.organization_domains (id) on delete set null,
  pack_key text not null,
  trial_days int not null default 14,
  status text not null default 'active' check (status in ('active', 'expired', 'converted', 'cancelled')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  converted_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists organization_marketplace_pack_trials_org_pack_domain_idx
  on public.organization_marketplace_pack_trials (
    organization_id, pack_key, coalesce(domain_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

alter table public.organization_marketplace_pack_trials enable row level security;
revoke all on public.organization_marketplace_pack_trials from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Pack health snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketplace_pack_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_id uuid references public.organization_domains (id) on delete set null,
  pack_key text not null,
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'requires_attention', 'action_required')
  ),
  active_users int not null default 0,
  error_count int not null default 0,
  license_compliant boolean not null default true,
  summary text not null default '',
  checked_at timestamptz not null default now()
);

create index if not exists organization_marketplace_pack_health_org_idx
  on public.organization_marketplace_pack_health (organization_id, pack_key, checked_at desc);

alter table public.organization_marketplace_pack_health enable row level security;
revoke all on public.organization_marketplace_pack_health from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Pack update offers
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketplace_pack_updates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  from_version text not null,
  to_version text not null,
  update_type text not null default 'minor' check (
    update_type in ('major', 'minor', 'security', 'feature')
  ),
  status text not null default 'available' check (
    status in ('available', 'approved', 'installed', 'dismissed')
  ),
  release_notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.organization_marketplace_pack_updates enable row level security;
revoke all on public.organization_marketplace_pack_updates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Pack reviews
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketplace_pack_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  rating int not null check (rating between 1 and 5),
  review_text text not null default '',
  feedback_type text not null default 'review' check (
    feedback_type in ('review', 'feedback', 'issue_report')
  ),
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.organization_marketplace_pack_reviews enable row level security;
revoke all on public.organization_marketplace_pack_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketplace_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  pack_key text,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_marketplace_operations_audit_org_idx
  on public.organization_marketplace_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_marketplace_operations_audit_logs enable row level security;
revoke all on public.organization_marketplace_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Catalog seed
-- ---------------------------------------------------------------------------
insert into public.aipify_marketplace_operations_catalog (
  pack_key, pack_name, description, category, industry_key, version, starting_price_monthly,
  trial_days, dependencies, is_featured, sort_order, release_notes
)
select v.key, v.name, v.descr, v.cat, v.ind, v.ver, v.price, v.trial, v.deps, v.feat, v.ord, v.notes
from (values
  ('commerce_pack', 'Commerce Pack', 'E-commerce operations, orders, and storefront intelligence.', 'commerce', null, '2.1.0', 299.00, 14, '[]'::jsonb, true, 1, 'Improved inventory sync and checkout analytics.'),
  ('inventory_pack', 'Inventory Pack', 'Stock levels, warehouses, and fulfillment operations.', 'operations', null, '1.4.0', 199.00, 14, '["commerce_pack"]'::jsonb, true, 2, 'Multi-warehouse support enhancements.'),
  ('supplier_pack', 'Supplier Pack', 'Supplier relationships, procurement, and delivery tracking.', 'operations', null, '1.2.0', 149.00, 14, '["inventory_pack"]'::jsonb, false, 3, 'Supplier scorecards added.'),
  ('support_pack', 'Support Pack', 'Customer support, cases, and service operations.', 'support', null, '2.0.0', 249.00, 14, '[]'::jsonb, true, 4, 'Autonomous triage improvements.'),
  ('finance_pack', 'Finance Pack', 'Invoicing, payments, and financial operations.', 'finance', null, '1.8.0', 279.00, 14, '[]'::jsonb, true, 5, 'Fiken and Stripe connector templates.'),
  ('hosts_pack', 'Hosts Pack', 'Property hosting, guest operations, and hospitality.', 'industry', 'hospitality', '1.5.0', 349.00, 14, '[]'::jsonb, true, 6, 'Airbnb and Booking.com integration paths.'),
  ('hr_pack', 'HR Pack', 'People operations, onboarding, and workforce management.', 'hr', null, '1.1.0', 199.00, 14, '[]'::jsonb, false, 7, 'Employee lifecycle workflows.'),
  ('project_pack', 'Project Pack', 'Project execution, milestones, and delivery tracking.', 'projects', null, '1.3.0', 179.00, 14, '[]'::jsonb, false, 8, 'Resource planning views.'),
  ('analytics_pack', 'Analytics Pack', 'Business analytics, reporting, and executive insights.', 'analytics', null, '1.6.0', 229.00, 14, '[]'::jsonb, false, 9, 'Cross-pack analytics dashboards.'),
  ('governance_pack', 'Governance Pack', 'Approvals, policies, and compliance operations.', 'governance', null, '1.0.0', 189.00, 14, '[]'::jsonb, false, 10, 'Audit trail enhancements.'),
  ('industry_retail', 'Retail Industry Pack', 'Retail-specific commerce, inventory, and customer operations.', 'industry', 'retail', '1.0.0', 399.00, 30, '["commerce_pack","inventory_pack"]'::jsonb, false, 11, 'Retail KPI templates.'),
  ('industry_construction', 'Construction Industry Pack', 'Projects, assets, field operations, and quality.', 'industry', 'construction', '1.0.0', 449.00, 30, '["project_pack"]'::jsonb, false, 12, 'Field operations checklists.'),
  ('industry_healthcare', 'Healthcare Industry Pack', 'Compliance-aware operations for healthcare organizations.', 'industry', 'healthcare', '1.0.0', 499.00, 30, '["governance_pack"]'::jsonb, false, 13, 'Privacy-first workflows.'),
  ('warehouse_pack', 'Warehouse Pack', 'Warehouse operations — requires Inventory Pack.', 'operations', null, '1.2.0', 219.00, 14, '["inventory_pack"]'::jsonb, false, 14, 'Pick-and-pack automation hooks.'),
  ('executive_pack', 'Executive Pack', 'Strategic intelligence — requires Analytics Pack.', 'analytics', null, '1.0.0', 349.00, 14, '["analytics_pack"]'::jsonb, false, 15, 'Executive briefing templates.')
) as v(key, name, descr, cat, ind, ver, price, trial, deps, feat, ord, notes)
on conflict (pack_key) do update set
  pack_name = excluded.pack_name,
  description = excluded.description,
  version = excluded.version,
  dependencies = excluded.dependencies;

-- ---------------------------------------------------------------------------
-- 9. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._mp542_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._mp542_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_marketplace_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._mp542_log(
  p_org_id uuid, p_action text, p_summary text,
  p_pack_key text default null, p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_marketplace_operations_audit_logs (
    organization_id, actor_user_id, action, pack_key, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_pack_key, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._mp542_pack_json(r public.aipify_marketplace_operations_catalog)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'pack_key', r.pack_key, 'pack_name', r.pack_name, 'description', r.description,
    'category', r.category, 'industry_key', r.industry_key, 'version', r.version,
    'pricing_model', r.pricing_model, 'starting_price_monthly', r.starting_price_monthly,
    'trial_days', r.trial_days, 'required_permissions', r.required_permissions,
    'required_domains', r.required_domains, 'dependencies', r.dependencies,
    'is_featured', r.is_featured, 'is_available', r.is_available,
    'release_notes', r.release_notes, 'documentation_href', r.documentation_href,
    'detail_href', '/app/marketplace/packs/' || r.pack_key,
    'install_href', '/app/marketplace/packs/' || r.pack_key || '/install'
  );
$$;

create or replace function public._mp542_installed_status(
  p_org_id uuid, p_pack_key text, p_domain_id uuid default null
)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_installed boolean; v_trial boolean; v_update boolean;
begin
  select exists (
    select 1 from public.domain_business_pack_installations
    where organization_id = p_org_id and pack_key = p_pack_key
      and license_status in ('active', 'trial')
      and (p_domain_id is null or domain_id = p_domain_id)
  ) into v_installed;

  if v_installed then
    select exists (
      select 1 from public.organization_marketplace_pack_updates
      where organization_id = p_org_id and pack_key = p_pack_key and status = 'available'
    ) into v_update;
    if v_update then return 'update_available'; end if;
    return 'installed';
  end if;

  select exists (
    select 1 from public.organization_marketplace_pack_trials
    where organization_id = p_org_id and pack_key = p_pack_key and status = 'active'
      and expires_at > now()
  ) into v_trial;
  if v_trial then return 'trial'; end if;

  return 'available';
end; $$;

create or replace function public._mp542_check_dependencies(p_org_id uuid, p_pack_key text, p_domain_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_deps jsonb; v_missing jsonb := '[]'::jsonb; dep text;
begin
  select dependencies into v_deps
  from public.aipify_marketplace_operations_catalog where pack_key = p_pack_key;

  if v_deps is null or jsonb_array_length(v_deps) = 0 then
    return jsonb_build_object('satisfied', true, 'missing', '[]'::jsonb);
  end if;

  for dep in select jsonb_array_elements_text(v_deps) loop
    if public._mp542_installed_status(p_org_id, dep, p_domain_id) not in ('installed', 'trial') then
      v_missing := v_missing || jsonb_build_array(dep);
    end if;
  end loop;

  return jsonb_build_object(
    'satisfied', jsonb_array_length(v_missing) = 0,
    'missing', v_missing,
    'required', v_deps
  );
end; $$;

create or replace function public._mp542_seed_marketplace(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_count int;
  v_domain uuid;
  v_commerce uuid;
begin
  if to_regclass('public.organization_domain_license_pool') is not null then
    perform public._dl505_ensure_license_pool(p_org_id);
  end if;

  if to_regclass('public._dl505_ensure_primary_domain') is not null then
    v_domain := public._dl505_ensure_primary_domain(p_org_id);
  else
    select id into v_domain from public.organization_domains
    where organization_id = p_org_id order by is_primary desc nulls last limit 1;
  end if;

  select count(*) into v_count from public.domain_business_pack_installations where organization_id = p_org_id;
  if v_count > 1 then
    select count(*) into v_count from public.aipify_marketplace_operations_catalog where is_available = true;
    return v_count;
  end if;

  if v_domain is not null then
    insert into public.domain_business_pack_installations (
      organization_id, domain_id, pack_key, license_status, seat_tier, metadata
    ) values
      (p_org_id, v_domain, 'commerce_pack', 'active', '5', '{"source":"phase542_seed"}'::jsonb),
      (p_org_id, v_domain, 'support_pack', 'active', '5', '{"source":"phase542_seed"}'::jsonb)
    on conflict (organization_id, domain_id, pack_key) do nothing;

    insert into public.organization_marketplace_pack_health (
      organization_id, domain_id, pack_key, health_status, active_users, summary
    ) values
      (p_org_id, v_domain, 'commerce_pack', 'healthy', 12, 'Commerce Pack operating normally.'),
      (p_org_id, v_domain, 'support_pack', 'requires_attention', 8, 'Support queue volume elevated — review staffing.')
    on conflict do nothing;

    insert into public.organization_marketplace_pack_updates (
      organization_id, pack_key, from_version, to_version, update_type, status, release_notes
    ) values
      (p_org_id, 'commerce_pack', '2.0.0', '2.1.0', 'minor', 'available', 'Improved inventory sync and checkout analytics.')
    on conflict do nothing;
  end if;

  insert into public.organization_marketplace_pack_trials (
    organization_id, domain_id, pack_key, trial_days, status, expires_at
  ) values
    (p_org_id, v_domain, 'analytics_pack', 14, 'active', now() + interval '14 days')
  on conflict do nothing;

  select count(*) into v_count from public.aipify_marketplace_operations_catalog where is_available = true;
  return v_count;
end; $$;

create or replace function public.search_marketplace_packs(p_query text, p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('marketplace_operations.view');
  v_org_id := public._mp542_org();

  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(
        public._mp542_pack_json(c) || jsonb_build_object('status', public._mp542_installed_status(v_org_id, c.pack_key))
        order by c.sort_order
      )
      from (
        select * from public.aipify_marketplace_operations_catalog
        where is_available = true
          and (p_query is null or trim(p_query) = ''
            or pack_name ilike '%' || p_query || '%'
            or pack_key ilike '%' || p_query || '%'
            or category ilike '%' || p_query || '%'
            or industry_key ilike '%' || p_query || '%')
        order by sort_order
        limit greatest(p_limit, 1)
      ) c
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Marketplace Center
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_installed int;
  v_license jsonb := '{}'::jsonb;
begin
  perform public._irp_require_permission('marketplace_operations.view');
  v_org_id := public._mp542_org();
  perform public._mp542_ensure_settings(v_org_id);
  perform public._mp542_seed_marketplace(v_org_id);

  if to_regclass('public._dl505_license_summary') is not null then
    v_license := public._dl505_license_summary(v_org_id);
  end if;

  select count(*) into v_installed
  from public.domain_business_pack_installations
  where organization_id = v_org_id and license_status in ('active', 'trial');

  perform public._mp542_log(v_org_id, 'center_view', 'Marketplace Center viewed', null, p_section,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations should be able to expand Aipify without contacting sales or support.',
    'philosophy', 'Purchase. Approve. Install. Use.',
    'overview', jsonb_build_object(
      'catalog_count', (select count(*) from public.aipify_marketplace_operations_catalog where is_available = true),
      'installed_count', v_installed,
      'trial_count', (select count(*) from public.organization_marketplace_pack_trials where organization_id = v_org_id and status = 'active'),
      'update_count', (select count(*) from public.organization_marketplace_pack_updates where organization_id = v_org_id and status = 'available'),
      'domain_licenses', v_license
    ),
    'pack_statuses', jsonb_build_array('installed', 'available', 'update_available', 'license_required', 'disabled'),
    'categories', jsonb_build_array(
      'operations', 'finance', 'commerce', 'support', 'sales', 'marketing',
      'projects', 'hr', 'governance', 'analytics', 'industry', 'custom'
    ),
    'featured_packs', coalesce((
      select jsonb_agg(
        public._mp542_pack_json(c) || jsonb_build_object('status', public._mp542_installed_status(v_org_id, c.pack_key))
        order by c.sort_order
      )
      from public.aipify_marketplace_operations_catalog c where c.is_featured = true and c.is_available = true limit 8
    ), '[]'::jsonb),
    'business_packs', coalesce((
      select jsonb_agg(
        public._mp542_pack_json(c) || jsonb_build_object(
          'status', public._mp542_installed_status(v_org_id, c.pack_key),
          'dependency_check', public._mp542_check_dependencies(v_org_id, c.pack_key)
        )
        order by c.sort_order
      )
      from public.aipify_marketplace_operations_catalog c where c.is_available = true
    ), '[]'::jsonb),
    'installed_packs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', i.pack_key,
        'domain_id', i.domain_id,
        'domain', d.domain,
        'license_status', i.license_status,
        'installed_at', i.installed_at,
        'status', public._mp542_installed_status(v_org_id, i.pack_key, i.domain_id),
        'pack_name', coalesce(c.pack_name, i.pack_key),
        'category', c.category,
        'version', c.version
      ) order by i.installed_at desc)
      from public.domain_business_pack_installations i
      left join public.organization_domains d on d.id = i.domain_id
      left join public.aipify_marketplace_operations_catalog c on c.pack_key = i.pack_key
      where i.organization_id = v_org_id and i.license_status in ('active', 'trial')
    ), '[]'::jsonb),
    'recommended_packs', coalesce((
      select jsonb_agg(public._mp542_pack_json(c) order by c.sort_order)
      from public.aipify_marketplace_operations_catalog c
      where c.is_available = true
        and public._mp542_installed_status(v_org_id, c.pack_key) = 'available'
        and c.pack_key in ('inventory_pack', 'supplier_pack', 'analytics_pack', 'finance_pack')
      limit 6
    ), '[]'::jsonb),
    'industry_packs', coalesce((
      select jsonb_agg(public._mp542_pack_json(c) order by c.sort_order)
      from public.aipify_marketplace_operations_catalog c
      where c.category = 'industry' and c.is_available = true
    ), '[]'::jsonb),
    'available_upgrades', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', u.id, 'pack_key', u.pack_key, 'from_version', u.from_version, 'to_version', u.to_version,
        'update_type', u.update_type, 'release_notes', u.release_notes
      ) order by u.created_at desc)
      from public.organization_marketplace_pack_updates u
      where u.organization_id = v_org_id and u.status = 'available'
    ), '[]'::jsonb),
    'connectors', case when to_regclass('public.aipify_integration_hub_marketplace_catalog') is not null then coalesce((
      select jsonb_agg(jsonb_build_object('connector_key', connector_key, 'connector_name', connector_name, 'category', category))
      from public.aipify_integration_hub_marketplace_catalog
      where is_available = true
      limit 12
    ), '[]'::jsonb) else '[]'::jsonb end,
    'licenses', jsonb_build_object(
      'domain_license_summary', v_license,
      'installation_flow', jsonb_build_array(
        'select_business_pack', 'review_features', 'select_domain', 'review_license_requirements',
        'approve_purchase', 'install', 'configure', 'activate'
      )
    ),
    'domains', coalesce((
      select jsonb_agg(jsonb_build_object(
        'domain_id', d.id, 'domain', d.domain, 'license_status', d.license_status,
        'pack_count', (select count(*) from public.domain_business_pack_installations i where i.domain_id = d.id and i.license_status in ('active','trial'))
      ))
      from public.organization_domains d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'purchases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', e.pack_key, 'event_type', e.event_type, 'summary', e.summary, 'created_at', e.created_at
      ) order by e.created_at desc)
      from public.app_store_commercial_events e
      where e.tenant_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'trials', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'pack_key', t.pack_key, 'domain_id', t.domain_id,
        'trial_days', t.trial_days, 'status', t.status, 'expires_at', t.expires_at
      ) order by t.started_at desc)
      from public.organization_marketplace_pack_trials t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'pack_health', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', h.pack_key, 'health_status', h.health_status,
        'active_users', h.active_users, 'error_count', h.error_count,
        'license_compliant', h.license_compliant, 'summary', h.summary, 'checked_at', h.checked_at
      ) order by h.checked_at desc)
      from (
        select distinct on (pack_key) * from public.organization_marketplace_pack_health
        where organization_id = v_org_id order by pack_key, checked_at desc
      ) h
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'pack_key', r.pack_key, 'rating', r.rating,
        'review_text', r.review_text, 'feedback_type', r.feedback_type, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.organization_marketplace_pack_reviews r where r.organization_id = v_org_id limit 15
    ), '[]'::jsonb),
    'companion_advisor', jsonb_build_object(
      'prompts', jsonb_build_array(
        'Which packs are recommended?',
        'What should we install next?',
        'What packs are missing?',
        'What does this pack do?',
        'Which packs are popular in our industry?'
      ),
      'industry_recommendations', jsonb_build_array(
        jsonb_build_object('industry', 'retail', 'packs', jsonb_build_array('commerce_pack', 'inventory_pack', 'supplier_pack')),
        jsonb_build_object('industry', 'construction', 'packs', jsonb_build_array('project_pack', 'warehouse_pack', 'governance_pack')),
        jsonb_build_object('industry', 'hospitality', 'packs', jsonb_build_array('hosts_pack', 'finance_pack', 'support_pack'))
      )
    ),
    'executive_dashboard', jsonb_build_object(
      'installed_packs', v_installed,
      'license_utilization', v_license,
      'upgrade_opportunities', (select count(*) from public.organization_marketplace_pack_updates where organization_id = v_org_id and status = 'available'),
      'companion_recommendations', jsonb_build_array(
        'Review available upgrades before they affect compliance.',
        'Install missing dependency packs before expanding operations.',
        'Domain licenses determine where Business Packs may activate.'
      )
    ),
    'platform_governance', jsonb_build_object(
      'controls', jsonb_build_array(
        'Version Control', 'Audit Logging', 'Permissions', 'Approval Rules', 'License Validation', 'Security Review'
      )
    ),
    'analytics', jsonb_build_object(
      'installs', v_installed,
      'trials_active', (select count(*) from public.organization_marketplace_pack_trials where organization_id = v_org_id and status = 'active'),
      'updates_pending', (select count(*) from public.organization_marketplace_pack_updates where organization_id = v_org_id and status = 'available')
    ),
    'reports', jsonb_build_object(
      'catalog_count', (select count(*) from public.aipify_marketplace_operations_catalog where is_available = true),
      'installed_count', v_installed,
      'trial_conversions', (select count(*) from public.organization_marketplace_pack_trials where organization_id = v_org_id and status = 'converted'),
      'domain_distribution', coalesce((
        select jsonb_object_agg(x.domain, x.cnt)
        from (
          select d.domain, count(*) as cnt
          from public.domain_business_pack_installations i
          join public.organization_domains d on d.id = i.domain_id
          where i.organization_id = v_org_id
          group by d.domain
        ) x
      ), '{}'::jsonb)
    ),
    'mobile_access', jsonb_build_object('mobile_ready', true),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'pack_key', a.pack_key, 'section', a.section, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_marketplace_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'business_packs', 'installed', 'recommended', 'connectors', 'licenses', 'domains', 'purchases', 'reports', 'companion'
    ),
    'routes', jsonb_build_object(
      'marketplace', '/app/marketplace',
      'catalog', '/app/marketplace/catalog',
      'installed', '/app/marketplace/installed',
      'business_packs', '/app/marketplace/business-packs',
      'integrations', '/app/integrations',
      'domains', '/app/domains',
      'license', '/app/license'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_marketplace_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_domain_id uuid;
  v_pack_key text;
  v_deps jsonb;
  v_catalog public.aipify_marketplace_operations_catalog;
  v_trial_days int;
begin
  v_org_id := public._mp542_org();
  perform public._mp542_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  v_pack_key := coalesce(p_payload->>'pack_key', '');
  v_domain_id := nullif(p_payload->>'domain_id', '')::uuid;

  if p_action_type in (
    'install_pack', 'start_trial', 'approve_purchase', 'apply_update', 'remove_pack', 'submit_review'
  ) then
    perform public._irp_require_permission('marketplace_operations.manage');
  else
    perform public._irp_require_permission('marketplace_operations.view');
  end if;

  if p_action_type = 'install_pack' then
    select * into v_catalog from public.aipify_marketplace_operations_catalog where pack_key = v_pack_key and is_available = true;
    if v_catalog.pack_key is null then return jsonb_build_object('ok', false, 'error', 'pack_not_found'); end if;

    v_deps := public._mp542_check_dependencies(v_org_id, v_pack_key, v_domain_id);
    if (v_deps->>'satisfied')::boolean = false then
      return jsonb_build_object('ok', false, 'error', 'dependencies_missing', 'dependencies', v_deps);
    end if;

    if v_domain_id is null and to_regclass('public._dl505_ensure_primary_domain') is not null then
      v_domain_id := public._dl505_ensure_primary_domain(v_org_id);
    end if;

    insert into public.domain_business_pack_installations (
      organization_id, domain_id, pack_key, license_status, installed_by_user_id, metadata
    ) values (
      v_org_id, v_domain_id, v_pack_key, 'active', v_user_id,
      jsonb_build_object('source', 'marketplace_operations', 'version', v_catalog.version)
    )
    on conflict (organization_id, domain_id, pack_key) do update set
      license_status = 'active', updated_at = now(), removed_at = null;

    perform public._mp542_log(v_org_id, 'pack_installed', 'Business Pack installed', v_pack_key, 'installed', p_payload);
    return jsonb_build_object('ok', true, 'pack_key', v_pack_key, 'domain_id', v_domain_id);

  elsif p_action_type = 'start_trial' then
    select trial_days into v_trial_days from public.aipify_marketplace_operations_catalog where pack_key = v_pack_key;
    v_trial_days := coalesce((p_payload->>'trial_days')::int, v_trial_days, 14);

    if v_domain_id is null and to_regclass('public._dl505_ensure_primary_domain') is not null then
      v_domain_id := public._dl505_ensure_primary_domain(v_org_id);
    end if;

    insert into public.organization_marketplace_pack_trials (
      organization_id, domain_id, pack_key, trial_days, status, expires_at
    ) values (
      v_org_id, v_domain_id, v_pack_key, v_trial_days, 'active', now() + (v_trial_days || ' days')::interval
    )
    on conflict do nothing returning id into v_id;

    insert into public.domain_business_pack_installations (
      organization_id, domain_id, pack_key, license_status, installed_by_user_id
    ) values (v_org_id, v_domain_id, v_pack_key, 'trial', v_user_id)
    on conflict (organization_id, domain_id, pack_key) do update set license_status = 'trial', updated_at = now();

    perform public._mp542_log(v_org_id, 'trial_started', 'Pack trial started', v_pack_key, 'trials', p_payload);
    return jsonb_build_object('ok', true, 'trial_id', v_id, 'expires_in_days', v_trial_days);

  elsif p_action_type = 'approve_purchase' then
    if to_regclass('public.app_store_commercial_events') is not null then
      insert into public.app_store_commercial_events (tenant_id, pack_key, event_type, summary, actor_user_id, context)
      values (v_org_id, v_pack_key, 'payment_confirmed', 'Purchase approved via Marketplace', v_user_id, p_payload);
    end if;
    perform public._mp542_log(v_org_id, 'license_activated', 'Purchase approved', v_pack_key, 'purchases', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'apply_update' then
    update public.organization_marketplace_pack_updates
    set status = 'installed'
    where id = (p_payload->>'update_id')::uuid and organization_id = v_org_id
    returning pack_key into v_pack_key;
    perform public._mp542_log(v_org_id, 'pack_updated', 'Pack update installed', v_pack_key, 'updates', p_payload);
    return jsonb_build_object('ok', v_pack_key is not null, 'pack_key', v_pack_key);

  elsif p_action_type = 'remove_pack' then
    update public.domain_business_pack_installations
    set license_status = 'removed', removed_at = now(), updated_at = now()
    where organization_id = v_org_id and pack_key = v_pack_key
      and (v_domain_id is null or domain_id = v_domain_id);
    perform public._mp542_log(v_org_id, 'pack_removed', 'Business Pack removed', v_pack_key, 'installed', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'submit_review' then
    insert into public.organization_marketplace_pack_reviews (
      organization_id, pack_key, rating, review_text, feedback_type, actor_user_id
    ) values (
      v_org_id, v_pack_key,
      greatest(1, least(5, coalesce((p_payload->>'rating')::int, 5))),
      coalesce(p_payload->>'review_text', ''),
      coalesce(p_payload->>'feedback_type', 'review'),
      v_user_id
    ) returning id into v_id;
    perform public._mp542_log(v_org_id, 'review_submitted', 'Marketplace review submitted', v_pack_key, 'reviews', p_payload);
    return jsonb_build_object('ok', true, 'review_id', v_id);

  elsif p_action_type = 'check_dependencies' then
    return jsonb_build_object('ok', true, 'dependencies', public._mp542_check_dependencies(v_org_id, v_pack_key, v_domain_id));

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_marketplace_context(p_query text default null, p_pack_key text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_search jsonb; v_deps jsonb;
declare v_org_id uuid;
begin
  perform public._irp_require_permission('marketplace_operations.view');
  v_org_id := public._mp542_org();
  v_center := public.get_marketplace_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_marketplace_packs(p_query, 15);
  end if;
  if p_pack_key is not null then
    v_deps := public._mp542_check_dependencies(v_org_id, p_pack_key);
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion acts as Marketplace Advisor — recommend packs based on industry and installed systems.',
    'query', p_query,
    'pack_key', p_pack_key,
    'center', v_center,
    'search', v_search,
    'dependencies', v_deps,
    'companion_prompts', v_center->'companion_advisor'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_marketplace_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('marketplace_operations.view');
  v_center := public.get_marketplace_operations_center('mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('marketplace_operations.manage', public._mp542_org()),
    'overview', v_center->'overview',
    'installed_packs', v_center->'installed_packs',
    'available_upgrades', v_center->'available_upgrades',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('marketplace', '/app/marketplace'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'marketplace_operations', 'App Store & Business Pack Marketplace', 'marketplace-operations', 'commerce',
    'Discover, purchase, install, upgrade and manage Business Packs — the commercial distribution layer.',
    'starter', null, 'main', '/app/marketplace', 'licensed', 2
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('marketplace_operations', 'marketplace_operations.view', 'view', 'Marketplace — browse packs, licenses, and installed Business Packs'),
  ('marketplace_operations', 'marketplace_operations.manage', 'manage', 'Marketplace — install packs, trials, purchases, and updates')
on conflict do nothing;

grant execute on function public._mp542_pack_json(public.aipify_marketplace_operations_catalog) to authenticated;
grant execute on function public._mp542_installed_status(uuid, text, uuid) to authenticated;
grant execute on function public._mp542_check_dependencies(uuid, text, uuid) to authenticated;
grant execute on function public._mp542_seed_marketplace(uuid) to authenticated;
grant execute on function public.search_marketplace_packs(text, int) to authenticated;
grant execute on function public.get_marketplace_operations_center(text) to authenticated;
grant execute on function public.perform_marketplace_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_marketplace_context(text, text) to authenticated;
grant execute on function public.get_my_marketplace_summary() to authenticated;
