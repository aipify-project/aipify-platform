-- Foundation 01 — Business Pack Identity Engine
-- Feature owner: PLATFORM FOUNDATION. Helpers: _bpie_* (engine), _bpief01_* (blueprint)

create table if not exists public.business_pack_identity (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  pack_category text not null default 'operations' check (
    pack_category in (
      'hospitality', 'commerce', 'support', 'executive', 'operations',
      'human_resources', 'marketing', 'intelligence', 'productivity', 'governance'
    )
  ),
  version text not null default '1.0.0',
  status text not null default 'active' check (
    status in ('active', 'beta', 'coming_soon', 'deprecated', 'retired')
  ),
  pack_logo_url text,
  pack_cover_image_url text,
  short_description text not null,
  long_description text not null,
  intended_audience text not null,
  key_benefits jsonb not null default '[]'::jsonb,
  business_value_statement text not null,
  primary_use_cases jsonb not null default '[]'::jsonb,
  expected_outcomes jsonb not null default '[]'::jsonb,
  business_value jsonb not null default '{}'::jsonb,
  features jsonb not null default '[]'::jsonb,
  workspace_route text,
  landing_route text,
  knowledge_center_category text,
  install_allowed boolean not null default true,
  upgrade_route text,
  release_notes_url text,
  licensing_summary text,
  catalog_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  published_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_pack_identity_status_idx
  on public.business_pack_identity (status, pack_category);

alter table public.business_pack_identity enable row level security;
revoke all on public.business_pack_identity from authenticated, anon;

create table if not exists public.business_pack_identity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null,
  action text not null check (
    action in ('identity_created', 'identity_updated', 'identity_published', 'identity_deprecated', 'identity_retired', 'dashboard_view')
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_identity_audit_pack_idx
  on public.business_pack_identity_audit_logs (pack_key, created_at desc);

alter table public.business_pack_identity_audit_logs enable row level security;
revoke all on public.business_pack_identity_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_pack_identity', v.description
from (values
  ('business_pack_identity.view', 'View Business Pack Identity', 'View pack identity catalog and landing content'),
  ('business_pack_identity.manage', 'Manage Business Pack Identity', 'Publish and edit global pack identity standards'),
  ('business_pack_identity.audit', 'Audit Business Pack Identity', 'Review pack identity governance audit logs')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_pack_identity.view'),
  ('administrator', 'business_pack_identity.view'),
  ('manager', 'business_pack_identity.view'),
  ('viewer', 'business_pack_identity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bpie_require_view()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.is_platform_admin() then return; end if;
  perform public._irp_require_permission('business_pack_identity.view');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bpie_require_manage()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.is_platform_admin() then return; end if;
  perform public._irp_require_permission('business_pack_identity.manage');
exception when others then
  if not public.is_platform_admin() then
    raise exception 'Platform admin or business_pack_identity.manage required';
  end if;
end; $$;

create or replace function public._bpie_log(
  p_pack_key text, p_action text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.business_pack_identity_audit_logs (pack_key, action, summary, actor_user_id, context)
  values (p_pack_key, p_action, p_summary, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._bpie_validate_version(p_version text)
returns boolean language sql immutable as $$
  select coalesce(p_version, '') ~ '^\d+\.\d+\.\d+$';
$$;

create or replace function public._bpief01_positioning()
returns text language sql immutable as $$
  select 'Every Aipify Business Pack must feel like a complete product — clear identity, value proposition, and professional presentation before any technical configuration.';
$$;

create or replace function public._bpief01_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'hospitality', 'commerce', 'support', 'executive', 'operations',
    'human_resources', 'marketing', 'intelligence', 'productivity', 'governance'
  );
$$;

create or replace function public._bpief01_statuses()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'active', 'label', 'Active', 'installable', true),
    jsonb_build_object('key', 'beta', 'label', 'Beta', 'installable', true),
    jsonb_build_object('key', 'coming_soon', 'label', 'Coming Soon', 'installable', false),
    jsonb_build_object('key', 'deprecated', 'label', 'Deprecated', 'installable', false),
    jsonb_build_object('key', 'retired', 'label', 'Retired', 'installable', false)
  );
$$;

create or replace function public._bpie_identity_row_to_json(p_row public.business_pack_identity)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'pack_key', p_row.pack_key,
    'pack_name', p_row.pack_name,
    'pack_category', p_row.pack_category,
    'version', p_row.version,
    'status', p_row.status,
    'pack_logo_url', p_row.pack_logo_url,
    'pack_cover_image_url', p_row.pack_cover_image_url,
    'short_description', p_row.short_description,
    'long_description', p_row.long_description,
    'intended_audience', p_row.intended_audience,
    'key_benefits', p_row.key_benefits,
    'business_value_statement', p_row.business_value_statement,
    'primary_use_cases', p_row.primary_use_cases,
    'expected_outcomes', p_row.expected_outcomes,
    'business_value', p_row.business_value,
    'features', p_row.features,
    'workspace_route', p_row.workspace_route,
    'landing_route', coalesce(p_row.landing_route, '/app/marketplace/packs/' || p_row.pack_key),
    'knowledge_center_category', p_row.knowledge_center_category,
    'install_allowed', p_row.install_allowed,
    'upgrade_route', p_row.upgrade_route,
    'release_notes_url', p_row.release_notes_url,
    'licensing_summary', p_row.licensing_summary,
    'catalog_pack_key', p_row.catalog_pack_key,
    'published_at', p_row.published_at,
    'metadata', p_row.metadata
  );
$$;

create or replace function public._bpie_seed_identity()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_pack_identity (
    pack_key, pack_name, pack_category, version, status,
    pack_logo_url, pack_cover_image_url,
    short_description, long_description, intended_audience,
    key_benefits, business_value_statement, primary_use_cases, expected_outcomes, business_value,
    features, workspace_route, landing_route, knowledge_center_category,
    install_allowed, upgrade_route, licensing_summary, catalog_pack_key, published_at
  )
  select
    v.pack_key, v.pack_name, v.pack_category, v.version, v.status,
    v.logo, v.cover,
    v.short_desc, v.long_desc, v.audience,
    v.benefits::jsonb, v.value_stmt, v.use_cases::jsonb, v.outcomes::jsonb, v.biz_value::jsonb,
    v.features::jsonb, v.workspace, '/app/marketplace/packs/' || v.pack_key, v.kc_cat,
    v.installable, v.upgrade_route, v.licensing, v.catalog_key, now()
  from (values
    (
      'aipify_hosts', 'Aipify Hosts', 'hospitality', '1.0.0', 'active',
      '/images/packs/aipify-hosts/logo.svg', '/images/packs/aipify-hosts/cover.svg',
      'Business Operating System for hospitality — properties, guests, operations, and revenue in one workspace.',
      'Aipify Hosts is a complete hospitality Business Pack for property operators, co-hosts, and hospitality teams. It unifies guest communications, property operations, cleaning, maintenance, bookings, executive visibility, and reputation management — without replacing your booking platform.',
      'Hospitality operators, property managers, co-hosts, and multi-property teams.',
      '["Unified property operations","Guest experience without platform replacement","Revenue and reputation visibility","Team coordination across locations"]',
      'Run hospitality operations with clarity — Aipify works alongside your existing tools so your team stays in control.',
      '["Manage multiple properties from one workspace","Coordinate cleaning and maintenance","Respond to guests with knowledge-backed guidance","Track reputation and recovery opportunities"]',
      '["Faster guest response times","Reduced operational friction across properties","Clearer executive visibility","Improved review recovery workflows"]',
      '{"why":"Hospitality teams juggle fragmented tools and constant guest communication.","who_benefits":"Property owners, operations managers, and guest experience leads.","problems_solved":"Scattered workflows, missed maintenance, inconsistent guest messaging, opaque reputation trends.","measurable_outcomes":"Response time improvements, operational task completion, review trend visibility."}',
      '["Property operations","Guest communications","Check-in center","Cleaning & maintenance","Booking coordination","Executive dashboard","Reputation center"]',
      '/app/aipify-hosts', 'aipify-hosts', true, '/app/marketplace/activation?section=billing', 'Property capacity licensing — all Hosts modules included; capacity scales with your plan.', 'hospitality'
    ),
    (
      'aipify_commerce', 'Aipify Commerce', 'commerce', '1.0.0', 'active',
      '/images/packs/aipify-commerce/logo.svg', '/images/packs/aipify-commerce/cover.svg',
      'Commerce operations, margin visibility, and customer support workflows for retail and online sellers.',
      'Aipify Commerce brings order support, margin analytics, inventory insights, and customer communications into one operational workspace designed for sellers who need clarity without complexity.',
      'E-commerce operators, retail teams, and commerce support leads.',
      '["Order-aware support workflows","Margin and performance visibility","Integrated customer communications","Operational clarity for growing sellers"]',
      'See commerce performance and support needs in one place — decisions stay with your team.',
      '["Handle order inquiries with knowledge-backed responses","Monitor margin and performance signals","Coordinate support across sales channels","Scale operations without adding admin burden"]',
      '["Faster order support resolution","Clearer margin visibility","Reduced support escalation volume","More consistent customer experience"]',
      '{"why":"Commerce teams lose time switching between storefronts, support, and analytics.","who_benefits":"Store owners, support leads, and operations managers.","problems_solved":"Fragmented order context, unclear margins, reactive support.","measurable_outcomes":"Support resolution time, margin trend visibility, escalation reduction."}',
      '["Order support","Margin analytics","Inventory insights","Customer communications","Commerce intelligence"]',
      '/app/commercial', 'aipify-commerce', true, '/app/marketplace/activation?section=billing', 'Modular commerce workspace — activate when your selling operations need operational AI.', 'e_commerce'
    ),
    (
      'aipify_support', 'Aipify Support', 'support', '1.0.0', 'active',
      '/images/packs/aipify-support/logo.svg', '/images/packs/aipify-support/cover.svg',
      'Support operations with knowledge-backed responses, triage, and quality governance.',
      'Aipify Support is an outcome-focused Business Pack for teams handling customer inquiries. It combines support workflows, knowledge center content, quality reviews, and escalation governance — with human approval at every sensitive step.',
      'Support teams, customer success leads, and operations managers.',
      '["Knowledge-backed support responses","Structured triage and escalation","Quality governance","Reduced response inconsistency"]',
      'Support that scales with your business — Aipify prepares, humans decide.',
      '["Triage incoming support with confidence scoring","Draft responses from approved knowledge","Track quality and knowledge gaps","Escalate uncertainty transparently"]',
      '["Faster first responses","Higher consistency across agents","Fewer unresolved escalations","Clearer knowledge gap visibility"]',
      '{"why":"Support teams drown in repetitive questions without structured knowledge.","who_benefits":"Support agents, team leads, and quality reviewers.","problems_solved":"Slow responses, inconsistent answers, hidden knowledge gaps.","measurable_outcomes":"First response time, quality scores, escalation rates."}',
      '["Support inbox","Knowledge center","Quality reviews","Escalation workflows","Gap detection"]',
      '/app/support-ai-engine', 'aipify-support', true, '/app/marketplace/activation?section=billing', 'Support workspace licensing aligned to your subscription tier.', 'support_operations'
    ),
    (
      'aipify_executive', 'Aipify Executive', 'executive', '1.0.0', 'active',
      '/images/packs/aipify-executive/logo.svg', '/images/packs/aipify-executive/cover.svg',
      'Executive briefings, strategic insights, and leadership visibility across your organization.',
      'Aipify Executive provides leadership-focused visibility — morning briefings, strategic recommendations, and governance transparency — without replacing executive judgment.',
      'Executives, founders, and senior leadership teams.',
      '["Executive-ready briefings","Strategic recommendation visibility","Governance transparency","Calm, professional presence"]',
      'Leadership visibility that respects human decision-making — insight, not intrusion.',
      '["Review morning briefings before the day begins","Monitor strategic recommendations with explainability","Track governance and approval status","Align teams without micromanagement"]',
      '["Better leadership situational awareness","Faster alignment on priorities","Transparent governance visibility","Reduced context switching for executives"]',
      '{"why":"Leaders lack a calm, unified view across operational signals.","who_benefits":"CEOs, COOs, and department heads.","problems_solved":"Information overload, opaque AI recommendations, fragmented executive tools.","measurable_outcomes":"Briefing engagement, decision preparation time, governance audit completeness."}',
      '["Executive dashboard","Morning briefings","Strategic recommendations","Governance visibility"]',
      '/app/executive-intelligence', 'aipify-executive', true, '/app/marketplace/activation?section=billing', 'Business-tier executive workspace with governance controls.', 'professional_services'
    ),
    (
      'aipify_growth', 'Aipify Growth', 'intelligence', '1.0.0', 'beta',
      '/images/packs/aipify-growth/logo.svg', '/images/packs/aipify-growth/cover.svg',
      'Growth intelligence, expansion opportunities, and evolution guidance as your business scales.',
      'Aipify Growth helps organizations identify expansion opportunities, track adoption, and evolve their Aipify workspace as the business matures — with recommendations, not mandates.',
      'Growth leaders, operations strategists, and scaling businesses.',
      '["Expansion opportunity signals","Adoption analytics","Evolution roadmap guidance","Gradual capability growth"]',
      'Grow your Aipify workspace at the pace your business actually needs.',
      '["Identify expansion opportunities from operational signals","Review adoption patterns across teams","Plan capability growth without overwhelm","Align growth investments with outcomes"]',
      '["Clearer expansion priorities","Better adoption visibility","Reduced rollout friction","Outcome-aligned growth planning"]',
      '{"why":"Scaling businesses activate capabilities too fast or too slow without guidance.","who_benefits":"Growth leaders and operations strategists.","problems_solved":"Unclear next steps, uneven adoption, capability sprawl.","measurable_outcomes":"Adoption rates, expansion conversion, rollout completion."}',
      '["Growth insights","Expansion recommendations","Adoption analytics","Evolution roadmap"]',
      '/app/growth-evolution-engine', 'aipify-growth', true, '/app/marketplace/activation?section=billing', 'Beta — available with documented limitations.', 'general_business'
    ),
    (
      'general_business', 'Aipify Essentials', 'operations', '1.0.0', 'active',
      '/images/packs/general-business/logo.svg', '/images/packs/general-business/cover.svg',
      'Core operational modules for everyday business administration.',
      'Aipify Essentials packages core operational capabilities — assistant, knowledge, and analytics — into a clear starting point for any organization.',
      'Small and mid-size businesses starting their Aipify journey.',
      '["Clear starting point","Everyday operational support","Knowledge and analytics foundation","Room to grow into specialized packs"]',
      'Start with what you need today — expand when your business is ready.',
      '["Establish operational assistant workflows","Organize approved knowledge","Monitor basic operational insights","Prepare for specialized pack activation"]',
      '["Faster onboarding","Organized operational knowledge","Baseline analytics visibility","Lower activation friction"]',
      '{"why":"New customers need a clear first pack, not a blank platform.","who_benefits":"Owners and administrators starting with Aipify.","problems_solved":"Overwhelm, unclear first steps, scattered modules.","measurable_outcomes":"Time to first value, knowledge adoption, task completion."}',
      '["Admin assistant","Knowledge center","Analytics insights","Daily operations review"]',
      '/app/business-packs-foundation-engine', 'general-business', true, null, 'Included in starter plans and above.', 'general_business'
    ),
    (
      'enterprise_governance', 'Aipify Enterprise Governance', 'governance', '0.1.0', 'coming_soon',
      '/images/packs/enterprise-governance/logo.svg', '/images/packs/enterprise-governance/cover.svg',
      'Reserved — enterprise governance, compliance, and oversight pack.',
      'Enterprise Governance will provide advanced compliance, policy orchestration, and oversight workflows for large organizations. Visible for planning — not yet installable.',
      'Enterprise administrators and compliance officers.',
      '["Advanced governance workflows","Compliance readiness","Enterprise oversight","Policy orchestration"]',
      'Enterprise-grade governance — arriving when readiness criteria are met.',
      '["Plan enterprise governance rollout","Review compliance readiness requirements","Align stakeholders before activation"]',
      '["Prepared enterprise rollout","Clear governance expectations","Reduced compliance surprises"]',
      '{"why":"Enterprise customers need governance before broad AI adoption.","who_benefits":"Compliance officers and enterprise administrators.","problems_solved":"Policy gaps, audit uncertainty, uncontrolled automation.","measurable_outcomes":"Governance audit completeness, policy coverage, approval compliance."}',
      '["Governance policy engine","Compliance readiness","Enterprise oversight","Audit transparency"]',
      null, 'enterprise-governance', false, null, 'Reserved — contact Aipify for enterprise readiness review.', 'enterprise_governance'
    )
  ) as v(
    pack_key, pack_name, pack_category, version, status,
    logo, cover, short_desc, long_desc, audience,
    benefits, value_stmt, use_cases, outcomes, biz_value,
    features, workspace, kc_cat, installable, upgrade_route, licensing, catalog_key
  )
  on conflict (pack_key) do update set
    pack_name = excluded.pack_name,
    pack_category = excluded.pack_category,
    version = excluded.version,
    status = excluded.status,
    short_description = excluded.short_description,
    long_description = excluded.long_description,
    intended_audience = excluded.intended_audience,
    key_benefits = excluded.key_benefits,
    business_value_statement = excluded.business_value_statement,
    primary_use_cases = excluded.primary_use_cases,
    expected_outcomes = excluded.expected_outcomes,
    business_value = excluded.business_value,
    features = excluded.features,
    workspace_route = excluded.workspace_route,
    landing_route = excluded.landing_route,
    knowledge_center_category = excluded.knowledge_center_category,
    install_allowed = excluded.install_allowed,
    upgrade_route = excluded.upgrade_route,
    licensing_summary = excluded.licensing_summary,
    catalog_pack_key = excluded.catalog_pack_key,
    updated_at = now();
end; $$;

create or replace function public.get_business_pack_identity_landing(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_row public.business_pack_identity;
  v_tenant_id uuid;
  v_installed boolean := false;
  v_card_status text := 'available';
begin
  perform public._bpie_require_view();
  select * into v_row from public.business_pack_identity where pack_key = p_pack_key;
  if v_row.id is null then
    return jsonb_build_object('found', false, 'pack_key', p_pack_key);
  end if;

  begin
    v_tenant_id := public._presence_tenant_for_auth();
    if v_tenant_id is not null and exists (
      select 1 from pg_proc where proname = '_mssa_pack_installed'
    ) then
      v_installed := public._mssa_pack_installed(v_tenant_id, v_row.pack_key, coalesce(v_row.catalog_pack_key, v_row.pack_key));
    end if;
  exception when others then
    v_installed := false;
  end;

  v_card_status := case
    when v_row.status in ('coming_soon', 'retired') then v_row.status
    when v_row.status = 'deprecated' then 'deprecated'
    when v_installed then 'installed'
    else 'available'
  end;

  perform public._bpie_log(p_pack_key, 'dashboard_view', 'Pack landing viewed', jsonb_build_object('surface', 'landing'));

  return jsonb_build_object(
    'found', true,
    'identity', public._bpie_identity_row_to_json(v_row),
    'layout', jsonb_build_object(
      'header', jsonb_build_object('logo', v_row.pack_logo_url, 'name', v_row.pack_name, 'version', v_row.version, 'status', v_row.status),
      'hero', jsonb_build_object('cover', v_row.pack_cover_image_url, 'short_description', v_row.short_description, 'value_statement', v_row.business_value_statement),
      'overview', jsonb_build_object('long_description', v_row.long_description, 'audience', v_row.intended_audience, 'use_cases', v_row.primary_use_cases, 'outcomes', v_row.expected_outcomes),
      'business_value', v_row.business_value,
      'features', v_row.features,
      'knowledge_center_category', v_row.knowledge_center_category,
      'licensing', v_row.licensing_summary
    ),
    'actions', jsonb_build_object(
      'install_allowed', v_row.install_allowed and v_row.status in ('active', 'beta'),
      'upgrade_route', v_row.upgrade_route,
      'activation_route', '/app/marketplace/activation?pack=' || v_row.pack_key,
      'workspace_route', case when v_installed then v_row.workspace_route else null end,
      'card_status', v_card_status
    ),
    'governance_note', 'Pack identity is managed by Aipify Platform — customers cannot alter commercial presentation.',
    'versioning_note', 'Version ' || v_row.version || ' — visible across Marketplace, installed packs, Knowledge Center, and release notes.'
  );
end; $$;

create or replace function public.get_business_pack_identity_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_is_admin boolean := public.is_platform_admin();
begin
  perform public._bpie_require_view();
  perform public._bpie_seed_identity();

  return jsonb_build_object(
    'has_access', true,
    'is_platform_admin', v_is_admin,
    'can_manage', v_is_admin,
    'positioning', public._bpief01_positioning(),
    'categories', public._bpief01_categories(),
    'statuses', public._bpief01_statuses(),
    'version_format', 'Major.Minor.Patch',
    'governance', jsonb_build_object(
      'platform_admin', 'Can publish packs and edit pack identity',
      'super_admin', 'Controls global identity standards',
      'customers', 'Cannot alter pack identity — view landing and install only',
      'growth_partners', 'Can view approved pack materials'
    ),
    'forbidden', jsonb_build_array(
      'Opening packs directly into technical configuration without identity landing',
      'Customer-editable pack branding or descriptions',
      'Hidden pack status or version information'
    ),
    'success_criteria', jsonb_build_object(
      'packs_with_identity', (select count(*) from public.business_pack_identity),
      'active_packs', (select count(*) from public.business_pack_identity where status = 'active'),
      'beta_packs', (select count(*) from public.business_pack_identity where status = 'beta'),
      'coming_soon_packs', (select count(*) from public.business_pack_identity where status = 'coming_soon'),
      'identity_complete', (select count(*) from public.business_pack_identity where short_description <> '' and business_value_statement <> '')
    ),
    'packs', coalesce((
      select jsonb_agg(public._bpie_identity_row_to_json(bpi) order by bpi.pack_name)
      from public.business_pack_identity bpi
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(row_to_json(a) order by a.created_at desc)
      from (select * from public.business_pack_identity_audit_logs order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'landing_experience', jsonb_build_array('logo', 'hero', 'overview', 'features', 'knowledge_center', 'licensing', 'install_upgrade')
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.get_business_pack_identity_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpie_seed_identity();
  return jsonb_build_object(
    'has_access', true,
    'pack_count', (select count(*) from public.business_pack_identity),
    'active_count', (select count(*) from public.business_pack_identity where status in ('active', 'beta')),
    'positioning', public._bpief01_positioning()
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.perform_business_pack_identity_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_row public.business_pack_identity;
  v_status text;
begin
  perform public._bpie_require_manage();

  if p_action_type = 'publish_identity' then
    update public.business_pack_identity
    set status = coalesce(p_payload->>'status', 'active'),
        published_at = now(),
        published_by = public._mta_app_user_id(),
        updated_at = now()
    where pack_key = p_pack_key
    returning * into v_row;
    if v_row.id is null then raise exception 'Pack identity not found'; end if;
    perform public._bpie_log(p_pack_key, 'identity_published', 'Pack identity published', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'published', 'identity', public._bpie_identity_row_to_json(v_row));
  end if;

  if p_action_type = 'update_identity' then
    if p_payload ? 'version' and not public._bpie_validate_version(p_payload->>'version') then
      raise exception 'Version must follow Major.Minor.Patch format';
    end if;
    update public.business_pack_identity set
      pack_name = coalesce(p_payload->>'pack_name', pack_name),
      pack_category = coalesce(p_payload->>'pack_category', pack_category),
      version = coalesce(p_payload->>'version', version),
      status = coalesce(p_payload->>'status', status),
      short_description = coalesce(p_payload->>'short_description', short_description),
      long_description = coalesce(p_payload->>'long_description', long_description),
      intended_audience = coalesce(p_payload->>'intended_audience', intended_audience),
      business_value_statement = coalesce(p_payload->>'business_value_statement', business_value_statement),
      key_benefits = coalesce(p_payload->'key_benefits', key_benefits),
      primary_use_cases = coalesce(p_payload->'primary_use_cases', primary_use_cases),
      expected_outcomes = coalesce(p_payload->'expected_outcomes', expected_outcomes),
      business_value = coalesce(p_payload->'business_value', business_value),
      features = coalesce(p_payload->'features', features),
      install_allowed = coalesce((p_payload->>'install_allowed')::boolean, install_allowed),
      licensing_summary = coalesce(p_payload->>'licensing_summary', licensing_summary),
      updated_at = now()
    where pack_key = p_pack_key
    returning * into v_row;
    if v_row.id is null then raise exception 'Pack identity not found'; end if;
    perform public._bpie_log(p_pack_key, 'identity_updated', 'Pack identity updated', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'updated', 'identity', public._bpie_identity_row_to_json(v_row));
  end if;

  if p_action_type = 'set_status' then
    v_status := p_payload->>'status';
    if v_status not in ('active', 'beta', 'coming_soon', 'deprecated', 'retired') then
      raise exception 'Invalid pack status';
    end if;
    update public.business_pack_identity
    set status = v_status,
        install_allowed = case when v_status in ('active', 'beta') then coalesce(install_allowed, true) else false end,
        updated_at = now()
    where pack_key = p_pack_key
    returning * into v_row;
    if v_row.id is null then raise exception 'Pack identity not found'; end if;
    perform public._bpie_log(p_pack_key,
      case v_status when 'deprecated' then 'identity_deprecated' when 'retired' then 'identity_retired' else 'identity_updated' end,
      'Pack status set to ' || v_status, p_payload);
    return jsonb_build_object('action', p_action_type, 'status', v_status, 'identity', public._bpie_identity_row_to_json(v_row));
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_business_pack_identity_knowledge()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'business-pack-identity', 'Business Pack Identity',
    'Understand Aipify Business Pack identity, versions, and status before activation.', 390
  );
  perform public._ahostkc_seed_article('business-pack-identity', 'understanding-business-packs', 'Understanding Business Packs',
    'A Business Pack is a complete Aipify product — logo, cover, value proposition, features, Knowledge Center guidance, and licensing. Open a pack landing page first to understand what it does before installing.');
  perform public._ahostkc_seed_article('business-pack-identity', 'reading-pack-versions', 'Reading Pack Versions',
    'Pack versions follow Major.Minor.Patch (for example 1.0.0, 1.1.0, 2.0.0). Version numbers appear in the Marketplace, installed packs, Knowledge Center, and release notes so you always know what you are running.');
  perform public._ahostkc_seed_article('business-pack-identity', 'choosing-the-right-pack', 'Choosing the Right Pack',
    'Review intended audience, primary use cases, and expected outcomes on each pack landing page. Aipify recommends packs based on your workspace — you decide what fits.');
  perform public._ahostkc_seed_article('business-pack-identity', 'understanding-pack-statuses', 'Understanding Pack Statuses',
    'Active packs are production-ready. Beta packs are available with documented limitations. Coming Soon packs are visible but not installable. Deprecated packs allow no new installations. Retired packs are unavailable.');
end; $$;

select public._bpie_seed_identity();
select public.seed_business_pack_identity_knowledge();

grant execute on function public.get_business_pack_identity_landing(text) to authenticated;
grant execute on function public.get_business_pack_identity_engine_dashboard() to authenticated;
grant execute on function public.get_business_pack_identity_engine_card() to authenticated;
grant execute on function public.perform_business_pack_identity_action(text, text, jsonb) to authenticated;
