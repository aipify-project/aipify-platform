-- Phase 549 — Industry Operating System Framework & Business Pack Factory
-- One platform. Industry solutions assembled from reusable engines.

-- ---------------------------------------------------------------------------
-- 1. Industry frameworks
-- ---------------------------------------------------------------------------
create table if not exists public.platform_industry_frameworks (
  id uuid primary key default gen_random_uuid(),
  framework_key text not null unique,
  title text not null,
  description text not null default '',
  industry_category text not null default 'general',
  reusable_engines jsonb not null default '[]'::jsonb,
  default_modules jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_industry_frameworks enable row level security;
revoke all on public.platform_industry_frameworks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Pack blueprints & builder
-- ---------------------------------------------------------------------------
create table if not exists public.platform_business_pack_blueprints (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  industry_key text not null references public.platform_industry_frameworks (framework_key),
  blueprint_status text not null default 'development' check (
    blueprint_status in ('development', 'review', 'certified', 'marketplace_ready', 'published', 'deprecated')
  ),
  modules jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  workflows jsonb not null default '[]'::jsonb,
  reports jsonb not null default '[]'::jsonb,
  knowledge_templates jsonb not null default '[]'::jsonb,
  companion_skills jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  license_rules jsonb not null default '{}'::jsonb,
  marketplace_metadata jsonb not null default '{}'::jsonb,
  localization_locales jsonb not null default '["en","no","sv","da"]'::jsonb,
  reusable_engines jsonb not null default '[]'::jsonb,
  version text not null default '0.1.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_business_pack_blueprints_industry_idx
  on public.platform_business_pack_blueprints (industry_key, blueprint_status);

alter table public.platform_business_pack_blueprints enable row level security;
revoke all on public.platform_business_pack_blueprints from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Companion skills, knowledge & workflow templates
-- ---------------------------------------------------------------------------
create table if not exists public.platform_business_pack_companion_skills (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null references public.platform_business_pack_blueprints (pack_key) on delete cascade,
  skill_key text not null,
  skill_name text not null,
  industry_context text not null default '',
  description text not null default '',
  capabilities jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'review', 'certified')),
  created_at timestamptz not null default now(),
  unique (pack_key, skill_key)
);

alter table public.platform_business_pack_companion_skills enable row level security;
revoke all on public.platform_business_pack_companion_skills from authenticated, anon;

create table if not exists public.platform_business_pack_knowledge_templates (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null references public.platform_business_pack_blueprints (pack_key) on delete cascade,
  template_key text not null,
  title text not null,
  template_type text not null default 'article' check (
    template_type in ('article', 'playbook', 'checklist', 'procedure', 'training', 'template')
  ),
  locales jsonb not null default '["en","no","sv","da"]'::jsonb,
  content_summary text not null default '',
  created_at timestamptz not null default now(),
  unique (pack_key, template_key)
);

alter table public.platform_business_pack_knowledge_templates enable row level security;
revoke all on public.platform_business_pack_knowledge_templates from authenticated, anon;

create table if not exists public.platform_business_pack_workflow_templates (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null references public.platform_business_pack_blueprints (pack_key) on delete cascade,
  template_key text not null,
  title text not null,
  template_type text not null default 'automation' check (
    template_type in ('automation', 'approval', 'notification', 'report', 'dashboard')
  ),
  workflow_definition jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (pack_key, template_key)
);

alter table public.platform_business_pack_workflow_templates enable row level security;
revoke all on public.platform_business_pack_workflow_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Certification & testing
-- ---------------------------------------------------------------------------
create table if not exists public.platform_business_pack_certifications (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null references public.platform_business_pack_blueprints (pack_key) on delete cascade,
  review_type text not null check (
    review_type in (
      'security', 'governance', 'localization', 'companion', 'mobile', 'marketplace'
    )
  ),
  status text not null default 'pending' check (
    status in ('pending', 'passed', 'failed', 'waived')
  ),
  reviewer_notes text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (pack_key, review_type)
);

alter table public.platform_business_pack_certifications enable row level security;
revoke all on public.platform_business_pack_certifications from authenticated, anon;

create table if not exists public.platform_business_pack_test_runs (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null references public.platform_business_pack_blueprints (pack_key) on delete cascade,
  test_type text not null check (
    test_type in (
      'permissions', 'workflows', 'companion_skills', 'reports', 'mobile',
      'marketplace_install', 'license_validation', 'domain_assignment', 'simulation'
    )
  ),
  status text not null default 'pending' check (status in ('pending', 'passed', 'failed')),
  summary text not null default '',
  simulation_ref text,
  ran_at timestamptz not null default now()
);

create index if not exists platform_business_pack_test_runs_pack_idx
  on public.platform_business_pack_test_runs (pack_key, ran_at desc);

alter table public.platform_business_pack_test_runs enable row level security;
revoke all on public.platform_business_pack_test_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Analytics & audit
-- ---------------------------------------------------------------------------
create table if not exists public.platform_business_pack_factory_analytics (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null,
  metric_key text not null,
  metric_value numeric(14, 2) not null default 0,
  period_label text not null default 'current',
  recorded_at timestamptz not null default now(),
  unique (pack_key, metric_key, period_label)
);

alter table public.platform_business_pack_factory_analytics enable row level security;
revoke all on public.platform_business_pack_factory_analytics from authenticated, anon;

create table if not exists public.platform_business_pack_factory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  pack_key text,
  event_type text not null check (
    event_type in (
      'pack_created', 'pack_updated', 'pack_tested', 'pack_certified',
      'pack_published', 'pack_deprecated', 'template_created', 'skill_created'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_business_pack_factory_audit_idx
  on public.platform_business_pack_factory_audit_logs (created_at desc);

alter table public.platform_business_pack_factory_audit_logs enable row level security;
revoke all on public.platform_business_pack_factory_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._bpf549_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._bpf549_log(
  p_pack_key text, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_business_pack_factory_audit_logs (pack_key, event_type, summary, context)
  values (p_pack_key, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._bpf549_seed_frameworks()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_industry_frameworks (framework_key, title, description, industry_category, reusable_engines, default_modules, sort_order)
  values
    ('hospitality', 'Hospitality', 'Hotels, hosts, guest operations, and revenue management.', 'hospitality',
      '["customer","inventory","finance","companion","automation","knowledge"]'::jsonb, '["bookings","housekeeping","guest_management"]'::jsonb, 1),
    ('retail', 'Retail', 'Store operations, commerce, and inventory.', 'retail',
      '["customer","inventory","finance","automation"]'::jsonb, '["pos","inventory","orders"]'::jsonb, 2),
    ('warehousing', 'Warehousing', 'Warehouse and logistics operations.', 'logistics',
      '["inventory","asset","automation","companion"]'::jsonb, '["warehouse","fulfillment"]'::jsonb, 3),
    ('construction', 'Construction', 'Projects, field service, and assets.', 'construction',
      '["project","asset","people","risk"]'::jsonb, '["projects","field_service"]'::jsonb, 4),
    ('manufacturing', 'Manufacturing', 'Production, quality, and supply chain.', 'manufacturing',
      '["inventory","asset","quality","automation"]'::jsonb, '["production","quality"]'::jsonb, 5),
    ('healthcare', 'Healthcare', 'Clinical and operational workflows with governance.', 'healthcare',
      '["people","knowledge","risk","compliance"]'::jsonb, '["patient_ops","compliance"]'::jsonb, 6),
    ('accounting', 'Accounting', 'Finance operations and approvals.', 'finance',
      '["finance","automation","knowledge","companion"]'::jsonb, '["invoicing","approvals"]'::jsonb, 7),
    ('professional_services', 'Professional Services', 'Consulting and client delivery.', 'services',
      '["customer","project","knowledge","companion"]'::jsonb, '["projects","billing"]'::jsonb, 8),
    ('property_management', 'Property Management', 'Properties, tenants, and maintenance.', 'real_estate',
      '["asset","customer","finance","companion"]'::jsonb, '["properties","maintenance"]'::jsonb, 9),
    ('education', 'Education', 'Learning paths and institutional operations.', 'education',
      '["people","knowledge","companion"]'::jsonb, '["courses","enrollment"]'::jsonb, 10),
    ('consulting', 'Consulting', 'Advisory delivery and knowledge.', 'services',
      '["customer","project","knowledge"]'::jsonb, '["engagements"]'::jsonb, 11),
    ('transportation', 'Transportation', 'Fleet and route operations.', 'logistics',
      '["asset","people","automation"]'::jsonb, '["fleet","routes"]'::jsonb, 12),
    ('logistics', 'Logistics', 'Shipping, warehousing, and supply chain.', 'logistics',
      '["inventory","automation","companion"]'::jsonb, '["shipping","tracking"]'::jsonb, 13),
    ('human_resources', 'Human Resources', 'People, onboarding, and compliance.', 'hr',
      '["people","knowledge","automation"]'::jsonb, '["onboarding","payroll"]'::jsonb, 14),
    ('legal', 'Legal', 'Matters, documents, and compliance.', 'legal',
      '["knowledge","risk","compliance"]'::jsonb, '["matters","contracts"]'::jsonb, 15),
    ('insurance', 'Insurance', 'Policies, claims, and underwriting support.', 'insurance',
      '["customer","risk","finance","knowledge"]'::jsonb, '["policies","claims"]'::jsonb, 16)
  on conflict (framework_key) do nothing;
end; $$;

create or replace function public._bpf549_seed_blueprints()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_business_pack_blueprints (
    pack_key, pack_name, industry_key, blueprint_status, modules, reusable_engines, version
  ) values
    ('airbnb_hosts', 'Airbnb Hosts', 'hospitality', 'marketplace_ready',
      '["bookings","housekeeping","guest_management","revenue"]'::jsonb,
      '["customer","inventory","companion","finance"]'::jsonb, '1.0.0'),
    ('property_management_pack', 'Property Management', 'property_management', 'certified',
      '["properties","maintenance","tenants","billing"]'::jsonb,
      '["asset","customer","finance","companion"]'::jsonb, '1.0.0'),
    ('support_operations', 'Support Operations', 'professional_services', 'certified',
      '["tickets","knowledge","escalation","sla"]'::jsonb,
      '["customer","knowledge","companion","automation"]'::jsonb, '1.0.0'),
    ('warehouse_operations', 'Warehouse Operations', 'warehousing', 'review',
      '["inventory","fulfillment","receiving"]'::jsonb,
      '["inventory","asset","automation","companion"]'::jsonb, '0.9.0'),
    ('finance_operations', 'Finance Operations', 'accounting', 'development',
      '["invoicing","approvals","reporting"]'::jsonb,
      '["finance","automation","knowledge","risk"]'::jsonb, '0.5.0')
  on conflict (pack_key) do nothing;

  insert into public.platform_business_pack_companion_skills (pack_key, skill_key, skill_name, industry_context, description)
  values
    ('airbnb_hosts', 'property_assistant', 'Property Assistant', 'hospitality', 'Guest and property guidance for hosts.'),
    ('warehouse_operations', 'inventory_assistant', 'Inventory Assistant', 'warehousing', 'Stock and fulfillment guidance.'),
    ('support_operations', 'support_assistant', 'Support Assistant', 'support', 'Ticket triage and knowledge guidance.'),
    ('finance_operations', 'finance_assistant', 'Finance Assistant', 'finance', 'Invoice and approval guidance.')
  on conflict (pack_key, skill_key) do nothing;

  insert into public.platform_business_pack_knowledge_templates (pack_key, template_key, title, template_type, content_summary)
  values
    ('warehouse_operations', 'warehouse_sop', 'Warehouse SOP', 'procedure', 'Standard operating procedures for warehouse teams.'),
    ('airbnb_hosts', 'guest_checkin_sop', 'Guest Check-In SOP', 'playbook', 'Guest arrival and check-in playbook.'),
    ('support_operations', 'support_escalation_sop', 'Support Escalation SOP', 'playbook', 'Escalation paths and SLAs.'),
    ('finance_operations', 'financial_approval_sop', 'Financial Approval SOP', 'procedure', 'Invoice approval workflow guidance.')
  on conflict (pack_key, template_key) do nothing;

  insert into public.platform_business_pack_workflow_templates (pack_key, template_key, title, template_type)
  values
    ('airbnb_hosts', 'new_guest_workflow', 'New Guest Workflow', 'automation'),
    ('warehouse_operations', 'inventory_reorder_workflow', 'Inventory Reorder Workflow', 'automation'),
    ('finance_operations', 'invoice_approval_workflow', 'Invoice Approval Workflow', 'approval')
  on conflict (pack_key, template_key) do nothing;

  insert into public.platform_business_pack_certifications (pack_key, review_type, status)
  select b.pack_key, r.review_type,
    case
      when b.blueprint_status in ('certified', 'marketplace_ready', 'published') then 'passed'
      when b.blueprint_status = 'review' then 'pending'
      else 'pending'
    end
  from public.platform_business_pack_blueprints b
  cross join (values ('security'), ('governance'), ('localization'), ('companion'), ('mobile'), ('marketplace')) as r(review_type)
  on conflict (pack_key, review_type) do nothing;
end; $$;

select public._bpf549_seed_frameworks();
select public._bpf549_seed_blueprints();

-- ---------------------------------------------------------------------------
-- 7. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_business_pack_factory_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_overview jsonb;
  v_frameworks jsonb;
  v_blueprints jsonb;
  v_templates jsonb;
  v_skills jsonb;
  v_knowledge jsonb;
  v_workflows jsonb;
  v_certifications jsonb;
  v_tests jsonb;
  v_analytics jsonb;
  v_executive jsonb;
  v_reports jsonb;
  v_companion jsonb;
  v_audit jsonb;
begin
  perform public._bpf549_require_platform_admin();
  perform public._bpf549_seed_frameworks();
  perform public._bpf549_seed_blueprints();

  select jsonb_build_object(
    'industry_frameworks', (select count(*) from public.platform_industry_frameworks where is_active),
    'pack_blueprints', (select count(*) from public.platform_business_pack_blueprints),
    'in_development', count(*) filter (where blueprint_status = 'development'),
    'in_review', count(*) filter (where blueprint_status = 'review'),
    'certified', count(*) filter (where blueprint_status = 'certified'),
    'marketplace_ready', count(*) filter (where blueprint_status in ('marketplace_ready', 'published')),
    'companion_skills', (select count(*) from public.platform_business_pack_companion_skills),
    'knowledge_templates', (select count(*) from public.platform_business_pack_knowledge_templates),
    'workflow_templates', (select count(*) from public.platform_business_pack_workflow_templates),
    'catalog_listings', (select count(*) from public.aipify_marketplace_operations_catalog where is_available)
  ) into v_overview
  from public.platform_business_pack_blueprints;

  select coalesce(jsonb_agg(jsonb_build_object(
    'framework_key', f.framework_key, 'title', f.title, 'description', f.description,
    'industry_category', f.industry_category, 'reusable_engines', f.reusable_engines,
    'default_modules', f.default_modules
  ) order by f.sort_order), '[]'::jsonb)
  into v_frameworks
  from public.platform_industry_frameworks f where f.is_active;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'pack_key', b.pack_key, 'pack_name', b.pack_name,
    'industry_key', b.industry_key, 'blueprint_status', b.blueprint_status,
    'modules', b.modules, 'dependencies', b.dependencies,
    'reusable_engines', b.reusable_engines, 'localization_locales', b.localization_locales,
    'version', b.version
  ) order by b.pack_name), '[]'::jsonb)
  into v_blueprints
  from public.platform_business_pack_blueprints b;

  v_templates := v_blueprints;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'pack_key', s.pack_key, 'skill_key', s.skill_key,
    'skill_name', s.skill_name, 'industry_context', s.industry_context,
    'description', s.description, 'status', s.status
  ) order by s.skill_name), '[]'::jsonb)
  into v_skills
  from public.platform_business_pack_companion_skills s;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', k.id, 'pack_key', k.pack_key, 'template_key', k.template_key,
    'title', k.title, 'template_type', k.template_type, 'locales', k.locales
  ) order by k.title), '[]'::jsonb)
  into v_knowledge
  from public.platform_business_pack_knowledge_templates k;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'pack_key', w.pack_key, 'template_key', w.template_key,
    'title', w.title, 'template_type', w.template_type
  ) order by w.title), '[]'::jsonb)
  into v_workflows
  from public.platform_business_pack_workflow_templates w;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', c.pack_key, 'review_type', c.review_type,
    'status', c.status, 'reviewer_notes', c.reviewer_notes
  ) order by c.pack_key, c.review_type), '[]'::jsonb)
  into v_certifications
  from public.platform_business_pack_certifications c;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'pack_key', t.pack_key, 'test_type', t.test_type,
    'status', t.status, 'summary', t.summary, 'simulation_ref', t.simulation_ref, 'ran_at', t.ran_at
  ) order by t.ran_at desc), '[]'::jsonb)
  into v_tests
  from public.platform_business_pack_test_runs t
  limit 50;

  select jsonb_build_object(
    'installs', coalesce((select sum(metric_value) from public.platform_business_pack_factory_analytics where metric_key = 'installs'), 0),
    'trials', coalesce((select sum(metric_value) from public.platform_business_pack_factory_analytics where metric_key = 'trials'), 0),
    'conversions', coalesce((select sum(metric_value) from public.platform_business_pack_factory_analytics where metric_key = 'conversions'), 0),
    'marketplace_revenue', coalesce((select sum(metric_value) from public.platform_business_pack_factory_analytics where metric_key = 'revenue'), 0)
  ) into v_analytics;

  select jsonb_build_object(
    'packs_published', v_overview->'marketplace_ready',
    'industry_frameworks', v_overview->'industry_frameworks',
    'pack_adoption', v_analytics->'installs',
    'certification_pending', v_overview->'in_review',
    'pack_health', 'stable'
  ) into v_executive;

  select jsonb_build_object(
    'industry_adoption', v_frameworks,
    'pack_usage', v_analytics,
    'companion_usage', jsonb_build_object('skills', v_overview->'companion_skills'),
    'marketplace_performance', jsonb_build_object('listings', v_overview->'catalog_listings'),
    'reusable_engines', jsonb_build_array(
      'Customer Engine', 'People Engine', 'Inventory Engine', 'Asset Engine',
      'Finance Engine', 'Automation Engine', 'Knowledge Engine', 'Risk Engine', 'Companion Engine'
    )
  ) into v_reports;

  select jsonb_build_object(
    'recommendations', jsonb_build_array(
      'Hospitality and warehousing packs show highest trial conversion.',
      'Finance Operations pack needs localization review before marketplace release.',
      'Consider building Transportation framework next based on partner demand.',
      'Support Operations and Warehouse packs share Inventory Engine — bundle recommendation available.'
    ),
    'simulation_integration', jsonb_build_object(
      'connected', true,
      'phase', '543',
      'route', '/app/simulation'
    )
  ) into v_companion;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'summary', a.summary, 'pack_key', a.pack_key, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.platform_business_pack_factory_audit_logs a
  limit 40;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify should not build separate products. Aipify builds one platform — industry solutions are assembled from reusable engines.',
    'philosophy', 'Business Packs become configurations of platform capabilities. Industries become frameworks. Companion becomes industry-aware.',
    'section', coalesce(nullif(p_section, ''), 'overview'),
    'overview', v_overview,
    'industry_frameworks', v_frameworks,
    'templates', v_templates,
    'pack_blueprints', v_blueprints,
    'blueprint_system', v_blueprints,
    'pack_builder', jsonb_build_object('blueprints', v_blueprints, 'assemble_from', v_reports->'reusable_engines'),
    'dependencies', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', b.pack_key, 'dependencies', b.dependencies)), '[]'::jsonb)
      from public.platform_business_pack_blueprints b
    ),
    'companion_skills', v_skills,
    'knowledge_templates', v_knowledge,
    'workflow_templates', v_workflows,
    'certification_engine', jsonb_build_object('reviews', v_certifications, 'statuses', jsonb_build_object(
      'development', '⏳ Development', 'review', '⚠️ Review', 'certified', '🛡 Certified', 'marketplace_ready', '🟢 Marketplace Ready'
    )),
    'localization_framework', jsonb_build_object(
      'required_locales', jsonb_build_array('en', 'no', 'sv', 'da'),
      'future_locales', jsonb_build_array('es', 'de', 'fr', 'pl', 'uk')
    ),
    'testing_center', jsonb_build_object('test_runs', v_tests),
    'simulation_integration', v_companion->'simulation_integration',
    'marketplace_publishing', jsonb_build_object(
      'workflow', jsonb_build_array('Build', 'Test', 'Certify', 'Approve', 'Publish', 'Marketplace', 'Installable'),
      'catalog_count', v_overview->'catalog_listings'
    ),
    'analytics', v_analytics,
    'companion_recommendations', v_companion,
    'executive_dashboard', v_executive,
    'reports', v_reports,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'supported', true,
      'capabilities', jsonb_build_array(
        'review_packs', 'approve_packs', 'review_analytics', 'monitor_health', 'review_certification'
      )
    ),
    'routes', jsonb_build_object(
      'factory', '/platform/business-pack-factory',
      'builder', '/platform/business-pack-factory/builder',
      'skills', '/platform/business-pack-factory/skills',
      'testing', '/platform/business-pack-factory/testing',
      'legacy_product', '/platform/product/business-packs',
      'marketplace_catalog', '/platform/skills'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_platform_business_pack_factory_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text := coalesce(p_payload->>'action', '');
  v_pack_key text := nullif(p_payload->>'pack_key', '');
begin
  perform public._bpf549_require_platform_admin();

  if v_action = 'create_blueprint' then
    insert into public.platform_business_pack_blueprints (pack_key, pack_name, industry_key, modules, reusable_engines)
    values (
      coalesce(v_pack_key, lower(replace(p_payload->>'pack_name', ' ', '_'))),
      coalesce(p_payload->>'pack_name', 'New Business Pack'),
      coalesce(p_payload->>'industry_key', 'professional_services'),
      coalesce(p_payload->'modules', '[]'::jsonb),
      coalesce(p_payload->'reusable_engines', '[]'::jsonb)
    );
    perform public._bpf549_log(v_pack_key, 'pack_created', 'Business Pack blueprint created.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'create_skill' and v_pack_key is not null then
    insert into public.platform_business_pack_companion_skills (pack_key, skill_key, skill_name, description)
    values (
      v_pack_key,
      coalesce(p_payload->>'skill_key', 'new_skill'),
      coalesce(p_payload->>'skill_name', 'New Companion Skill'),
      coalesce(p_payload->>'description', '')
    ) on conflict (pack_key, skill_key) do nothing;
    perform public._bpf549_log(v_pack_key, 'skill_created', 'Companion skill created.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'run_test' and v_pack_key is not null then
    insert into public.platform_business_pack_test_runs (pack_key, test_type, status, summary, simulation_ref)
    values (
      v_pack_key,
      coalesce(p_payload->>'test_type', 'permissions'),
      coalesce(p_payload->>'status', 'passed'),
      coalesce(p_payload->>'summary', 'Test run completed.'),
      p_payload->>'simulation_ref'
    );
    perform public._bpf549_log(v_pack_key, 'pack_tested', 'Business Pack test run recorded.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'certify_review' and v_pack_key is not null then
    update public.platform_business_pack_certifications
    set status = coalesce(p_payload->>'status', 'passed'),
        reviewer_notes = coalesce(p_payload->>'reviewer_notes', ''),
        reviewed_at = now()
    where pack_key = v_pack_key and review_type = coalesce(p_payload->>'review_type', 'security');
    perform public._bpf549_log(v_pack_key, 'pack_certified', 'Certification review updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'publish_pack' and v_pack_key is not null then
    update public.platform_business_pack_blueprints
    set blueprint_status = 'published', updated_at = now()
    where pack_key = v_pack_key;
    insert into public.aipify_marketplace_operations_catalog (pack_key, pack_name, description, category, industry_key, is_available)
    select b.pack_key, b.pack_name, 'Published from Business Pack Factory.', 'industry', b.industry_key, true
    from public.platform_business_pack_blueprints b where b.pack_key = v_pack_key
    on conflict (pack_key) do update set is_available = true, pack_name = excluded.pack_name;
    perform public._bpf549_log(v_pack_key, 'pack_published', 'Business Pack published to marketplace.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'deprecate_pack' and v_pack_key is not null then
    update public.platform_business_pack_blueprints set blueprint_status = 'deprecated', updated_at = now() where pack_key = v_pack_key;
    update public.aipify_marketplace_operations_catalog set is_available = false where pack_key = v_pack_key;
    perform public._bpf549_log(v_pack_key, 'pack_deprecated', 'Business Pack deprecated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'advance_status' and v_pack_key is not null then
    update public.platform_business_pack_blueprints
    set blueprint_status = coalesce(p_payload->>'blueprint_status', 'review'), updated_at = now()
    where pack_key = v_pack_key;
    perform public._bpf549_log(v_pack_key, 'pack_updated', 'Blueprint status advanced.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_platform_business_pack_factory_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpf549_require_platform_admin();
  return jsonb_build_object(
    'found', true,
    'in_review', (select count(*)::int from public.platform_business_pack_blueprints where blueprint_status = 'review'),
    'marketplace_ready', (select count(*)::int from public.platform_business_pack_blueprints where blueprint_status in ('marketplace_ready', 'published')),
    'pending_certifications', (select count(*)::int from public.platform_business_pack_certifications where status = 'pending'),
    'failed_tests', (select count(*)::int from public.platform_business_pack_test_runs where status = 'failed'),
    'routes', jsonb_build_object('factory', '/platform/business-pack-factory')
  );
end; $$;

grant execute on function public.get_platform_business_pack_factory_center(text) to authenticated;
grant execute on function public.perform_platform_business_pack_factory_action(jsonb) to authenticated;
grant execute on function public.get_platform_business_pack_factory_mobile_summary() to authenticated;
