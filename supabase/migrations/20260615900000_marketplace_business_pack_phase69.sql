-- Phase 69 — Marketplace & Business Pack Ecosystem

-- ---------------------------------------------------------------------------
-- 1. marketplace_items
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_items (
  id uuid primary key default gen_random_uuid(),
  item_key text not null unique,
  slug text not null unique,
  title text not null,
  short_description text,
  long_description text,
  item_type text not null check (
    item_type in (
      'skill', 'business_pack', 'industry_pack', 'workflow_pack', 'automation_pack',
      'knowledge_pack', 'template_pack', 'integration_pack', 'playbook'
    )
  ),
  category text not null default 'General',
  industry text,
  author_type text not null default 'aipify' check (
    author_type in ('aipify', 'partner', 'customer', 'internal')
  ),
  author_name text,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'deprecated', 'archived')
  ),
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'restricted')
  ),
  pricing_model text not null default 'free' check (
    pricing_model in ('free', 'one_time', 'monthly', 'yearly', 'usage_based', 'enterprise')
  ),
  price numeric,
  currency text not null default 'USD',
  trial_available boolean not null default false,
  deployment_support text[] not null default '{cloud_saas}',
  requires_agent boolean not null default false,
  data_residency_behavior text not null default 'cloud',
  required_permissions jsonb not null default '[]'::jsonb,
  required_integrations jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  included_assets jsonb not null default '{}'::jsonb,
  documentation_ref text,
  support_ref text,
  rating numeric not null default 0,
  install_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists marketplace_items_status_idx
  on public.marketplace_items (status, item_type, category);

alter table public.marketplace_items enable row level security;
revoke all on public.marketplace_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. marketplace_item_versions
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_item_versions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.marketplace_items (id) on delete cascade,
  version text not null,
  changelog text,
  release_notes text,
  permissions_changed boolean not null default false,
  migration_required boolean not null default false,
  package_manifest jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (
    status in ('draft', 'published', 'deprecated')
  ),
  created_at timestamptz not null default now(),
  unique (item_id, version)
);

alter table public.marketplace_item_versions enable row level security;
revoke all on public.marketplace_item_versions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. tenant_marketplace_installs
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_marketplace_installs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_id uuid not null references public.marketplace_items (id) on delete cascade,
  version_id uuid references public.marketplace_item_versions (id) on delete set null,
  status text not null default 'installed' check (
    status in (
      'pending_approval', 'installed', 'active', 'disabled',
      'update_available', 'failed', 'uninstalled'
    )
  ),
  installed_by_user_id uuid references public.users (id) on delete set null,
  installed_at timestamptz,
  enabled_at timestamptz,
  disabled_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  approval_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, item_id)
);

create index if not exists tenant_marketplace_installs_tenant_idx
  on public.tenant_marketplace_installs (tenant_id, status);

alter table public.tenant_marketplace_installs enable row level security;
revoke all on public.tenant_marketplace_installs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. marketplace_install_events
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_install_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_id uuid not null references public.marketplace_items (id) on delete cascade,
  install_id uuid references public.tenant_marketplace_installs (id) on delete set null,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists marketplace_install_events_tenant_idx
  on public.marketplace_install_events (tenant_id, created_at desc);

alter table public.marketplace_install_events enable row level security;
revoke all on public.marketplace_install_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. marketplace_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_reviews (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.marketplace_items (id) on delete cascade,
  tenant_id uuid references public.customers (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  review_text text,
  status text not null default 'published' check (
    status in ('published', 'hidden', 'flagged')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketplace_reviews enable row level security;
revoke all on public.marketplace_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. marketplace_partners
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_partners (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null,
  partner_type text not null default 'developer' check (
    partner_type in ('developer', 'agency', 'consultant', 'enterprise_partner', 'internal')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'suspended', 'rejected')
  ),
  contact_email text,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketplace_partners enable row level security;
revoke all on public.marketplace_partners from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. marketplace_publish_requests
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_publish_requests (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.marketplace_items (id) on delete cascade,
  partner_id uuid references public.marketplace_partners (id) on delete set null,
  submitted_by_user_id uuid references public.users (id) on delete set null,
  status text not null default 'submitted' check (
    status in ('submitted', 'review', 'approved', 'rejected', 'changes_requested')
  ),
  review_notes text,
  security_review_required boolean not null default true,
  approved_by_user_id uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketplace_publish_requests enable row level security;
revoke all on public.marketplace_publish_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. marketplace_entitlements
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_entitlements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_id uuid not null references public.marketplace_items (id) on delete cascade,
  entitlement_type text not null default 'active' check (
    entitlement_type in ('trial', 'active', 'expired', 'revoked', 'enterprise')
  ),
  starts_at timestamptz,
  ends_at timestamptz,
  limits jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, item_id)
);

alter table public.marketplace_entitlements enable row level security;
revoke all on public.marketplace_entitlements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers (_mkp_)
-- ---------------------------------------------------------------------------
create or replace function public._mkp_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._mkp_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._mkp_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._mkp_log_event(
  p_tenant_id uuid, p_item_id uuid, p_install_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.marketplace_install_events (
    tenant_id, item_id, install_id, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_item_id, p_install_id, p_event_type, p_summary,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._mkp_auth_user_id())
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'marketplace_' || p_event_type, 'marketplace', 'logged', p_user_id, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._mkp_tenant_deployment_mode(p_tenant_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select deployment_mode from public.tenant_deployment_settings where tenant_id = p_tenant_id),
    'cloud_saas'
  );
$$;

create or replace function public._mkp_deployment_compatible(
  p_item public.marketplace_items, p_tenant_id uuid
)
returns boolean language plpgsql stable as $$
declare v_mode text;
begin
  v_mode := public._mkp_tenant_deployment_mode(p_tenant_id);
  return v_mode = any(p_item.deployment_support);
end; $$;

create or replace function public._mkp_item_json(p_item public.marketplace_items, p_installed boolean default false)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_item.id, 'item_key', p_item.item_key, 'slug', p_item.slug,
    'title', p_item.title, 'short_description', p_item.short_description,
    'item_type', p_item.item_type, 'category', p_item.category, 'industry', p_item.industry,
    'author_type', p_item.author_type, 'author_name', p_item.author_name,
    'risk_level', p_item.risk_level, 'pricing_model', p_item.pricing_model,
    'price', p_item.price, 'currency', p_item.currency, 'trial_available', p_item.trial_available,
    'deployment_support', p_item.deployment_support, 'requires_agent', p_item.requires_agent,
    'rating', p_item.rating, 'install_count', p_item.install_count, 'installed', p_installed
  );
$$;

create or replace function public._mkp_included_skills(p_item public.marketplace_items)
returns text[] language sql stable as $$
  select coalesce(
    array(select jsonb_array_elements_text(p_item.included_assets->'skills')),
    case when p_item.item_type = 'skill' then array[p_item.included_assets->>'skill_key'] else '{}'::text[] end
  );
$$;

-- ---------------------------------------------------------------------------
-- 10. Seed official marketplace items
-- ---------------------------------------------------------------------------
create or replace function public._mkp_seed_catalog()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_item public.marketplace_items;
  v_version_id uuid;
begin
  insert into public.marketplace_items (
    item_key, slug, title, short_description, long_description, item_type, category,
    author_type, author_name, status, risk_level, pricing_model, deployment_support,
    required_permissions, included_assets, documentation_ref
  ) values
    ('aipify.support_starter_pack', 'support-starter-pack', 'Support Starter Pack',
     'Support AI, FAQ starter content, draft templates, and escalation workflows.',
     'Bundle Support AI capabilities with FAQ knowledge, response templates, and escalation workflow templates for customer support teams.',
     'business_pack', 'Support', 'aipify', 'Aipify', 'published', 'medium', 'free', '{cloud_saas,hybrid}',
     '["support.draft.create","knowledge.article.create"]'::jsonb,
     '{"skills":["knowledge-center"],"workflow_templates":["support_escalation"],"knowledge_paths":["content/knowledge/aipify/marketplace/packs/support-faq.md"]}'::jsonb,
     '/app/knowledge-center'),
    ('aipify.website_quality_pack', 'website-quality-pack', 'Website Quality Pack',
     'Quality Guardian, Image Guardian, Performance rules, and developer report templates.',
     'Monitor website health with Quality Guardian skills, image and performance checks, developer reports, and quality FAQ content.',
     'business_pack', 'Quality', 'aipify', 'Aipify', 'published', 'medium', 'free', '{cloud_saas,hybrid}',
     '["quality.scan.read","quality.report.create"]'::jsonb,
     '{"skills":["quality-guardian","image-guardian","performance-guardian"],"workflow_templates":["quality_incident_response"]}'::jsonb,
     '/app/quality'),
    ('aipify.executive_briefing_pack', 'executive-briefing-pack', 'Executive Briefing Pack',
     'Since Last Login, Daily Command Brief templates, and briefing FAQ articles.',
     'Executive briefing capabilities with Since Last Login summaries, daily brief templates, and notification settings guidance.',
     'business_pack', 'Executive', 'aipify', 'Aipify', 'published', 'low', 'free', '{cloud_saas,hybrid,on_premise}',
     '["briefing.read"]'::jsonb,
     '{"skills":["executive-briefing"],"knowledge_paths":["content/knowledge/aipify/briefing/faq/briefing-faq.md"]}'::jsonb,
     '/app/briefing'),
    ('aipify.governance_starter_pack', 'governance-starter-pack', 'Governance Starter Pack',
     'Approval Center setup, Emergency Stop, trust FAQ, and approval workflow templates.',
     'Governance foundation with Approval Center, Emergency Stop configuration guides, and approval workflow templates.',
     'business_pack', 'Governance', 'aipify', 'Aipify', 'published', 'high', 'free', '{cloud_saas,hybrid}',
     '["governance.approval.create","governance.emergency_stop"]'::jsonb,
     '{"skills":["approval-center"],"workflow_templates":["approval_workflow"]}'::jsonb,
     '/app/governance'),
    ('aipify.knowledge_center_starter_pack', 'knowledge-center-starter-pack', 'Knowledge Center Starter Pack',
     'Self-support FAQ, Knowledge Gap guide, article templates, and admin guide.',
     'Knowledge Center starter content including self-support FAQ, gap detection guide, and article templates.',
     'knowledge_pack', 'Knowledge', 'aipify', 'Aipify', 'published', 'low', 'free', '{cloud_saas,hybrid,on_premise}',
     '["knowledge.article.create","knowledge.gap.read"]'::jsonb,
     '{"skills":["knowledge-center"],"knowledge_paths":["content/knowledge/aipify/knowledge-center/faq/knowledge-center-faq.md"]}'::jsonb,
     '/app/knowledge-center'),
    ('aipify.desktop_companion_pack', 'desktop-companion-pack', 'Desktop Companion Pack',
     'Desktop Companion skill, notification modes, reminder templates, and Desktop FAQ.',
     'Desktop Companion with notification modes, reminder templates, and companion FAQ articles.',
     'business_pack', 'Companion', 'aipify', 'Aipify', 'published', 'medium', 'free', '{cloud_saas,hybrid,on_premise}',
     '["desktop.notification.send"]'::jsonb,
     '{"skills":["desktop-companion","executive-briefing"],"knowledge_paths":["content/knowledge/aipify/desktop/faq/desktop-companion-faq.md"]}'::jsonb,
     '/app/desktop'),
    ('aipify.memory_learning_pack', 'memory-learning-pack', 'Memory & Learning Pack',
     'Memory Engine, Learning Engine, feedback templates, and Memory FAQ.',
     'Organizational memory and learning feedback loop with templates and FAQ content.',
     'business_pack', 'Operational', 'aipify', 'Aipify', 'published', 'low', 'free', '{cloud_saas,hybrid}',
     '["memory.store","learning.feedback"]'::jsonb,
     '{"skills":["memory-engine"],"knowledge_paths":["content/knowledge/aipify/memory/faq/memory-engine-faq.md"]}'::jsonb,
     '/app/memory'),
    ('aipify.security_compliance_starter_pack', 'security-compliance-starter-pack', 'Security & Compliance Starter Pack',
     'Data classification starter, GDPR FAQ, security incident template, retention examples.',
     'Security and compliance starter with classification policies, GDPR FAQ, incident templates, and retention examples.',
     'business_pack', 'Governance', 'aipify', 'Aipify', 'published', 'high', 'free', '{cloud_saas,hybrid,on_premise}',
     '["security.incident.create","privacy.request.create"]'::jsonb,
     '{"knowledge_paths":["content/knowledge/aipify/security/faq/security-compliance-faq.md"]}'::jsonb,
     '/app/security')
  on conflict (item_key) do update set
    title = excluded.title, short_description = excluded.short_description,
    long_description = excluded.long_description, status = excluded.status,
    included_assets = excluded.included_assets, updated_at = now();

  for v_item in select * from public.marketplace_items where author_type = 'aipify' and status = 'published'
  loop
    insert into public.marketplace_item_versions (item_id, version, changelog, package_manifest, status)
    values (
      v_item.id, '1.0.0', 'Initial official release',
      jsonb_build_object(
        'item_key', v_item.item_key, 'type', v_item.item_type, 'version', '1.0.0',
        'dependencies', v_item.dependencies, 'permissions', v_item.required_permissions,
        'included_assets', v_item.included_assets, 'deployment_support', v_item.deployment_support,
        'risk_level', v_item.risk_level
      ),
      'published'
    )
    on conflict (item_id, version) do nothing;
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Precheck & install
-- ---------------------------------------------------------------------------
create or replace function public.precheck_marketplace_install(
  p_item_key text, p_tenant_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_item public.marketplace_items;
  v_existing public.tenant_marketplace_installs;
  v_policy jsonb;
  v_skill_key text;
  v_deps jsonb;
  v_missing_skills jsonb := '[]'::jsonb;
  v_missing_modules jsonb := '[]'::jsonb;
  v_module text;
  v_skill public.skills;
  v_agents int;
begin
  v_tenant_id := coalesce(p_tenant_id, public._mkp_require_tenant());
  perform public._mkp_seed_catalog();

  select * into v_item from public.marketplace_items
  where (item_key = p_item_key or slug = p_item_key) and status = 'published';
  if v_item.id is null then return jsonb_build_object('allowed', false, 'reason', 'item_not_found'); end if;

  if v_item.risk_level = 'restricted' then
    return jsonb_build_object('allowed', false, 'reason', 'restricted_item');
  end if;

  if not public._mkp_deployment_compatible(v_item, v_tenant_id) then
    return jsonb_build_object('allowed', false, 'reason', 'deployment_incompatible',
      'deployment_mode', public._mkp_tenant_deployment_mode(v_tenant_id));
  end if;

  if v_item.requires_agent then
    select count(*) into v_agents from public.aipify_agents
    where tenant_id = v_tenant_id and status in ('online', 'registered');
    if v_agents = 0 then
      return jsonb_build_object('allowed', false, 'reason', 'agent_required');
    end if;
  end if;

  select * into v_existing from public.tenant_marketplace_installs
  where tenant_id = v_tenant_id and item_id = v_item.id
    and status not in ('uninstalled', 'failed');
  if found then
    return jsonb_build_object('allowed', false, 'reason', 'already_installed', 'install_id', v_existing.id);
  end if;

  foreach v_skill_key in array public._mkp_included_skills(v_item)
  loop
    if v_skill_key is null or v_skill_key = '' then continue; end if;
    select * into v_skill from public.skills where key = v_skill_key limit 1;
    if v_skill.id is null then
      v_missing_skills := v_missing_skills || jsonb_build_array(v_skill_key);
      continue;
    end if;
    v_deps := public.check_skill_dependencies(v_skill.key, v_tenant_id);
    if not (v_deps->>'satisfied')::boolean then
      v_missing_skills := v_missing_skills || jsonb_build_array(jsonb_build_object(
        'skill', v_skill_key, 'missing_deps', v_deps->'missing'
      ));
    end if;
    if v_skill.module_key is not null and not public.is_tenant_module_enabled(v_tenant_id, v_skill.module_key) then
      v_missing_modules := v_missing_modules || jsonb_build_array(v_skill.module_key);
    end if;
  end loop;

  v_policy := public.evaluate_policy(jsonb_build_object(
    'action_key', 'marketplace_install',
    'resource_type', 'marketplace',
    'resource_id', v_item.item_key,
    'actor_type', 'user',
    'data_classification', case v_item.risk_level when 'high' then 'confidential' else 'internal' end,
    'context', jsonb_build_object('item_type', v_item.item_type, 'risk_level', v_item.risk_level)
  ));

  return jsonb_build_object(
    'allowed', coalesce((v_policy->>'allow')::boolean, false) and not coalesce((v_policy->>'blocked')::boolean, false)
      and jsonb_array_length(v_missing_skills) = 0,
    'item', public._mkp_item_json(v_item, false),
    'requires_approval', v_item.risk_level in ('medium', 'high') or coalesce((v_policy->>'requires_approval')::boolean, false),
    'policy', v_policy,
    'missing_skills', v_missing_skills,
    'missing_modules', v_missing_modules,
    'deployment_mode', public._mkp_tenant_deployment_mode(v_tenant_id),
    'included_skills', public._mkp_included_skills(v_item),
    'required_permissions', v_item.required_permissions,
    'risk_level', v_item.risk_level
  );
end; $$;

create or replace function public.install_marketplace_item(
  p_item_key text, p_approve boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_item public.marketplace_items;
  v_version public.marketplace_item_versions;
  v_precheck jsonb;
  v_install_id uuid;
  v_skill_key text;
  v_skill_result jsonb;
  v_skills_installed jsonb := '[]'::jsonb;
begin
  v_tenant_id := public._mkp_require_tenant();
  v_user_id := public._mkp_auth_user_id();
  perform public._mkp_seed_catalog();

  v_precheck := public.precheck_marketplace_install(p_item_key, v_tenant_id);
  if not (v_precheck->>'allowed')::boolean then
    if (v_precheck->>'requires_approval')::boolean and not p_approve then
      select * into v_item from public.marketplace_items where item_key = p_item_key or slug = p_item_key;
      perform public._mkp_log_event(v_tenant_id, v_item.id, null, 'approval_requested',
        'Marketplace install requires approval', jsonb_build_object('item_key', p_item_key), v_user_id);
      return jsonb_build_object('status', 'approval_required', 'precheck', v_precheck);
    end if;
    perform public._mkp_log_event(v_tenant_id,
      (select id from public.marketplace_items where item_key = p_item_key limit 1),
      null, 'precheck_failed', 'Install precheck failed', v_precheck, v_user_id);
    return jsonb_build_object('status', 'precheck_failed', 'precheck', v_precheck);
  end if;

  select * into v_item from public.marketplace_items where item_key = p_item_key or slug = p_item_key;
  select * into v_version from public.marketplace_item_versions
  where item_id = v_item.id and status = 'published' order by created_at desc limit 1;

  perform public._mkp_log_event(v_tenant_id, v_item.id, null, 'install_started',
    'Starting marketplace install', jsonb_build_object('item_key', v_item.item_key), v_user_id);

  insert into public.tenant_marketplace_installs (
    tenant_id, item_id, version_id, status, installed_by_user_id, installed_at, enabled_at
  ) values (
    v_tenant_id, v_item.id, v_version.id,
    case when p_approve or v_item.risk_level = 'low' then 'active' else 'installed' end,
    v_user_id, now(), now()
  ) returning id into v_install_id;

  foreach v_skill_key in array public._mkp_included_skills(v_item)
  loop
    if v_skill_key is null or v_skill_key = '' then continue; end if;
    begin
      v_skill_result := public.install_tenant_skill(v_skill_key, p_approve or v_item.risk_level = 'low');
      v_skills_installed := v_skills_installed || jsonb_build_array(v_skill_result);
    exception when others then
      v_skills_installed := v_skills_installed || jsonb_build_array(jsonb_build_object(
        'skill_key', v_skill_key, 'error', sqlerrm
      ));
    end;
  end loop;

  insert into public.marketplace_entitlements (tenant_id, item_id, entitlement_type, starts_at)
  values (v_tenant_id, v_item.id, 'active', now())
  on conflict (tenant_id, item_id) do update set entitlement_type = 'active', updated_at = now();

  update public.marketplace_items set install_count = install_count + 1, updated_at = now() where id = v_item.id;

  perform public._mkp_log_event(v_tenant_id, v_item.id, v_install_id, 'installed',
    'Marketplace item installed', jsonb_build_object('skills', v_skills_installed), v_user_id);

  begin
    perform public.emit_orchestration_event(jsonb_build_object(
      'source_module', 'marketplace', 'source_type', 'marketplace_install', 'source_id', v_install_id::text,
      'event_type', 'marketplace.item.installed', 'severity', 'info',
      'payload', jsonb_build_object('item_key', v_item.item_key, 'title', v_item.title)
    ));
  exception when others then null;
  end;

  return jsonb_build_object(
    'status', 'installed', 'install_id', v_install_id,
    'item_key', v_item.item_key, 'skills_installed', v_skills_installed
  );
end; $$;

create or replace function public.disable_marketplace_install(p_install_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.tenant_marketplace_installs;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_require_admin();
  select * into v_row from public.tenant_marketplace_installs
  where id = p_install_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Install not found'; end if;

  update public.tenant_marketplace_installs set status = 'disabled', disabled_at = now(), updated_at = now()
  where id = p_install_id;
  perform public._mkp_log_event(v_tenant_id, v_row.item_id, p_install_id, 'disabled', 'Item disabled', '{}'::jsonb);
  return jsonb_build_object('status', 'disabled');
end; $$;

create or replace function public.enable_marketplace_install(p_install_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.tenant_marketplace_installs;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_require_admin();
  select * into v_row from public.tenant_marketplace_installs
  where id = p_install_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Install not found'; end if;

  update public.tenant_marketplace_installs set status = 'active', enabled_at = now(), disabled_at = null, updated_at = now()
  where id = p_install_id;
  perform public._mkp_log_event(v_tenant_id, v_row.item_id, p_install_id, 'enabled', 'Item enabled', '{}'::jsonb);
  return jsonb_build_object('status', 'active');
end; $$;

create or replace function public.uninstall_marketplace_item(p_install_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.tenant_marketplace_installs;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_require_admin();
  select * into v_row from public.tenant_marketplace_installs
  where id = p_install_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Install not found'; end if;

  update public.tenant_marketplace_installs set status = 'uninstalled', disabled_at = now(), updated_at = now()
  where id = p_install_id;
  perform public._mkp_log_event(v_tenant_id, v_row.item_id, p_install_id, 'uninstalled',
    'Item uninstalled — configuration archived, business data retained', '{}'::jsonb);
  return jsonb_build_object('status', 'uninstalled');
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._mkp_seed_catalog();
  return jsonb_build_object(
    'has_customer', true,
    'catalog_count', (select count(*) from public.marketplace_items where status = 'published'),
    'installed_count', (select count(*) from public.tenant_marketplace_installs where tenant_id = v_tenant_id and status in ('installed', 'active')),
    'updates_available', (select count(*) from public.tenant_marketplace_installs where tenant_id = v_tenant_id and status = 'update_available'),
    'philosophy', 'Discover safe, governed packs — Skills, templates, and Knowledge Center content in one install.',
    'privacy_note', 'Every item declares permissions, risk level, and deployment compatibility before installation.'
  );
end; $$;

create or replace function public.get_marketplace_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_featured jsonb;
  v_installed jsonb;
  v_recommended jsonb;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_seed_catalog();

  select coalesce(jsonb_agg(public._mkp_item_json(i, false) order by i.install_count desc), '[]'::jsonb)
  into v_featured
  from (select * from public.marketplace_items where status = 'published' order by install_count desc limit 6) i;

  select coalesce(jsonb_agg(jsonb_build_object(
    'install_id', ti.id, 'status', ti.status, 'installed_at', ti.installed_at,
    'item', public._mkp_item_json(mi, true)
  ) order by ti.installed_at desc), '[]'::jsonb) into v_installed
  from public.tenant_marketplace_installs ti
  join public.marketplace_items mi on mi.id = ti.item_id
  where ti.tenant_id = v_tenant_id and ti.status not in ('uninstalled', 'failed');

  v_recommended := public.get_marketplace_recommendations();

  return jsonb_build_object(
    'has_customer', true,
    'featured', v_featured,
    'installed', v_installed,
    'recommended', v_recommended,
    'catalog_count', (select count(*) from public.marketplace_items where status = 'published')
  );
end; $$;

create or replace function public.list_marketplace_items(
  p_item_type text default null, p_category text default null,
  p_industry text default null, p_risk_level text default null, p_limit int default 50
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_seed_catalog();
  return jsonb_build_object('has_customer', true, 'items',
    coalesce((
      select jsonb_agg(
        public._mkp_item_json(i, exists(
          select 1 from public.tenant_marketplace_installs ti
          where ti.tenant_id = v_tenant_id and ti.item_id = i.id and ti.status not in ('uninstalled', 'failed')
        )) order by i.install_count desc
      )
      from public.marketplace_items i
      where i.status = 'published'
        and (p_item_type is null or i.item_type = p_item_type)
        and (p_category is null or i.category = p_category)
        and (p_industry is null or i.industry = p_industry)
        and (p_risk_level is null or i.risk_level = p_risk_level)
      limit coalesce(p_limit, 50)
    ), '[]'::jsonb));
end; $$;

create or replace function public.get_marketplace_item(p_item_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_item public.marketplace_items;
  v_version jsonb;
  v_reviews jsonb;
  v_installed boolean;
  v_install_id uuid;
  v_precheck jsonb;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_seed_catalog();

  select * into v_item from public.marketplace_items
  where (item_key = p_item_key or slug = p_item_key) and status = 'published';
  if v_item.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select exists(
    select 1 from public.tenant_marketplace_installs
    where tenant_id = v_tenant_id and item_id = v_item.id and status not in ('uninstalled', 'failed')
  ), (select id from public.tenant_marketplace_installs
      where tenant_id = v_tenant_id and item_id = v_item.id and status not in ('uninstalled', 'failed') limit 1)
  into v_installed, v_install_id;

  select coalesce(jsonb_agg(row_to_json(v)::jsonb order by v.created_at desc), '[]'::jsonb)
  into v_version
  from public.marketplace_item_versions v where v.item_id = v_item.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'rating', r.rating, 'review_text', r.review_text, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb) into v_reviews
  from (select * from public.marketplace_reviews where item_id = v_item.id and status = 'published' limit 10) r;

  v_precheck := public.precheck_marketplace_install(v_item.item_key, v_tenant_id);

  return jsonb_build_object(
    'item', row_to_json(v_item)::jsonb || jsonb_build_object('installed', v_installed, 'install_id', v_install_id),
    'versions', v_version,
    'reviews', v_reviews,
    'precheck', v_precheck
  );
end; $$;

create or replace function public.list_marketplace_installed(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mkp_require_tenant();
  return jsonb_build_object('has_customer', true, 'installs',
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ti.id, 'status', ti.status, 'installed_at', ti.installed_at,
        'settings', ti.settings,
        'item', public._mkp_item_json(mi, true)
      ) order by ti.installed_at desc nulls last)
      from public.tenant_marketplace_installs ti
      join public.marketplace_items mi on mi.id = ti.item_id
      where ti.tenant_id = v_tenant_id and ti.status not in ('uninstalled')
      limit coalesce(p_limit, 50)
    ), '[]'::jsonb));
end; $$;

create or replace function public.list_marketplace_entitlements()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mkp_require_tenant();
  return jsonb_build_object('has_customer', true, 'entitlements',
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'entitlement_type', e.entitlement_type,
        'starts_at', e.starts_at, 'ends_at', e.ends_at,
        'item', public._mkp_item_json(mi, true)
      ) order by e.created_at desc)
      from public.marketplace_entitlements e
      join public.marketplace_items mi on mi.id = e.item_id
      where e.tenant_id = v_tenant_id
    ), '[]'::jsonb));
end; $$;

create or replace function public.get_marketplace_recommendations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_rec jsonb := '[]'::jsonb;
  v_has_support boolean;
  v_has_quality boolean;
  v_has_governance boolean;
begin
  v_tenant_id := public._mkp_require_tenant();
  perform public._mkp_seed_catalog();

  select exists(select 1 from public.tenant_marketplace_installs ti
    join public.marketplace_items mi on mi.id = ti.item_id
    where ti.tenant_id = v_tenant_id and mi.item_key = 'aipify.support_starter_pack'
      and ti.status not in ('uninstalled', 'failed')) into v_has_support;

  select exists(select 1 from public.tenant_marketplace_installs ti
    join public.marketplace_items mi on mi.id = ti.item_id
    where ti.tenant_id = v_tenant_id and mi.item_key = 'aipify.website_quality_pack'
      and ti.status not in ('uninstalled', 'failed')) into v_has_quality;

  select exists(select 1 from public.tenant_marketplace_installs ti
    join public.marketplace_items mi on mi.id = ti.item_id
    where ti.tenant_id = v_tenant_id and mi.item_key = 'aipify.governance_starter_pack'
      and ti.status not in ('uninstalled', 'failed')) into v_has_governance;

  if not v_has_support then
    v_rec := v_rec || jsonb_build_array((select public._mkp_item_json(i, false) from public.marketplace_items i where i.item_key = 'aipify.support_starter_pack'));
  end if;
  if not v_has_quality and exists(select 1 from public.aipify_quality_incidents where tenant_id = v_tenant_id and status in ('open', 'investigating') limit 1) then
    v_rec := v_rec || jsonb_build_array((select public._mkp_item_json(i, false) from public.marketplace_items i where i.item_key = 'aipify.website_quality_pack'));
  end if;
  if not v_has_governance and exists(select 1 from public.aipify_approval_requests where tenant_id = v_tenant_id and status = 'pending' limit 1) then
    v_rec := v_rec || jsonb_build_array((select public._mkp_item_json(i, false) from public.marketplace_items i where i.item_key = 'aipify.governance_starter_pack'));
  end if;

  if jsonb_array_length(v_rec) = 0 then
    select coalesce(jsonb_agg(public._mkp_item_json(i, false)), '[]'::jsonb) into v_rec
    from (select * from public.marketplace_items where status = 'published' order by install_count desc limit 3) i;
  end if;

  return v_rec;
end; $$;

create or replace function public.list_marketplace_reviews(p_item_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_item_id uuid;
begin
  select id into v_item_id from public.marketplace_items where item_key = p_item_key or slug = p_item_key;
  if v_item_id is null then return jsonb_build_object('reviews', '[]'::jsonb); end if;
  return jsonb_build_object('reviews',
    coalesce((select jsonb_agg(row_to_json(r)::jsonb order by r.created_at desc)
      from public.marketplace_reviews r where r.item_id = v_item_id and r.status = 'published'), '[]'::jsonb));
end; $$;

create or replace function public.create_marketplace_review(p_item_key text, p_rating int, p_review_text text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_item_id uuid; v_id uuid;
begin
  v_tenant_id := public._mkp_require_tenant();
  v_user_id := public._mkp_auth_user_id();
  select id into v_item_id from public.marketplace_items where item_key = p_item_key or slug = p_item_key;
  if v_item_id is null then raise exception 'Item not found'; end if;

  insert into public.marketplace_reviews (item_id, tenant_id, user_id, rating, review_text)
  values (v_item_id, v_tenant_id, v_user_id, p_rating, p_review_text) returning id into v_id;

  update public.marketplace_items set
    rating = (select coalesce(avg(rating), 0) from public.marketplace_reviews where item_id = v_item_id and status = 'published'),
    updated_at = now()
  where id = v_item_id;

  return jsonb_build_object('id', v_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Partners & publishing (draft structure)
-- ---------------------------------------------------------------------------
create or replace function public.list_marketplace_partners()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._mkp_require_admin();
  return jsonb_build_object('partners',
    coalesce((select jsonb_agg(row_to_json(p)::jsonb order by p.created_at desc)
      from public.marketplace_partners p), '[]'::jsonb));
end; $$;

create or replace function public.list_marketplace_publish_requests()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._mkp_require_admin();
  return jsonb_build_object('requests',
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pr.id, 'status', pr.status, 'review_notes', pr.review_notes,
        'item_title', mi.title, 'created_at', pr.created_at
      ) order by pr.created_at desc)
      from public.marketplace_publish_requests pr
      join public.marketplace_items mi on mi.id = pr.item_id
    ), '[]'::jsonb));
end; $$;

create or replace function public.submit_marketplace_publish_request(p_item_id uuid, p_notes text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform public._mkp_require_admin();
  insert into public.marketplace_publish_requests (item_id, submitted_by_user_id, review_notes, status)
  values (p_item_id, public._mkp_auth_user_id(), p_notes, 'submitted') returning id into v_id;
  return jsonb_build_object('id', v_id, 'status', 'submitted');
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Worker jobs
-- ---------------------------------------------------------------------------
create or replace function public.marketplace_check_updates()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_count int;
begin
  v_tenant_id := public._mkp_require_tenant();
  update public.tenant_marketplace_installs ti set status = 'update_available', updated_at = now()
  from public.marketplace_item_versions v
  where ti.tenant_id = v_tenant_id and ti.item_id = v.item_id
    and ti.status in ('installed', 'active')
    and v.version > (select version from public.marketplace_item_versions where id = ti.version_id);
  get diagnostics v_count = row_count;
  return jsonb_build_object('updates_marked', v_count);
end; $$;

create or replace function public.marketplace_license_checker()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_expired int;
begin
  v_tenant_id := public._mkp_require_tenant();
  update public.marketplace_entitlements set entitlement_type = 'expired', updated_at = now()
  where tenant_id = v_tenant_id and ends_at is not null and ends_at < now() and entitlement_type = 'active';
  get diagnostics v_expired = row_count;
  return jsonb_build_object('expired', v_expired);
end; $$;

-- ---------------------------------------------------------------------------
-- 15. KC category + seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'marketplace', 'Marketplace', 'Skills, Business Packs, and ecosystem items.', 'authenticated', 14
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'marketplace' and tenant_id is null);

select public._mkp_seed_catalog();

-- ---------------------------------------------------------------------------
-- 16. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.precheck_marketplace_install(text, uuid) to authenticated;
grant execute on function public.install_marketplace_item(text, boolean) to authenticated;
grant execute on function public.disable_marketplace_install(uuid) to authenticated;
grant execute on function public.enable_marketplace_install(uuid) to authenticated;
grant execute on function public.uninstall_marketplace_item(uuid) to authenticated;
grant execute on function public.get_marketplace_card() to authenticated;
grant execute on function public.get_marketplace_dashboard() to authenticated;
grant execute on function public.list_marketplace_items(text, text, text, text, int) to authenticated;
grant execute on function public.get_marketplace_item(text) to authenticated;
grant execute on function public.list_marketplace_installed(int) to authenticated;
grant execute on function public.list_marketplace_entitlements() to authenticated;
grant execute on function public.get_marketplace_recommendations() to authenticated;
grant execute on function public.list_marketplace_reviews(text) to authenticated;
grant execute on function public.create_marketplace_review(text, int, text) to authenticated;
grant execute on function public.list_marketplace_partners() to authenticated;
grant execute on function public.list_marketplace_publish_requests() to authenticated;
grant execute on function public.submit_marketplace_publish_request(uuid, text) to authenticated;
grant execute on function public.marketplace_check_updates() to authenticated;
grant execute on function public.marketplace_license_checker() to authenticated;
