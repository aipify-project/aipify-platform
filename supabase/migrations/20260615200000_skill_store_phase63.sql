-- Phase 63 — Skill Store & Modular Capability Platform

-- ---------------------------------------------------------------------------
-- 1. Extend skills metadata
-- ---------------------------------------------------------------------------
alter table public.skills
  add column if not exists slug text,
  add column if not exists author text not null default 'Aipify',
  add column if not exists risk_level text not null default 'low',
  add column if not exists required_permissions jsonb not null default '[]'::jsonb,
  add column if not exists required_integrations jsonb not null default '[]'::jsonb,
  add column if not exists documentation_links jsonb not null default '[]'::jsonb,
  add column if not exists knowledge_center_category text,
  add column if not exists module_key text;

update public.skills set slug = key where slug is null;

-- ---------------------------------------------------------------------------
-- 2. skill_dependencies
-- ---------------------------------------------------------------------------
create table if not exists public.skill_dependencies (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills (id) on delete cascade,
  depends_on_skill_id uuid not null references public.skills (id) on delete cascade,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  unique (skill_id, depends_on_skill_id)
);

alter table public.skill_dependencies enable row level security;
revoke all on public.skill_dependencies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. skill_install_events
-- ---------------------------------------------------------------------------
create table if not exists public.skill_install_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in ('browse', 'review', 'approval_requested', 'approved', 'installed', 'configured', 'activated', 'paused', 'disabled', 'removed', 'failed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists skill_install_events_tenant_idx
  on public.skill_install_events (tenant_id, created_at desc);

alter table public.skill_install_events enable row level security;
revoke all on public.skill_install_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. skill_settings (per tenant skill)
-- ---------------------------------------------------------------------------
create table if not exists public.skill_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_skill_id uuid not null references public.tenant_skills (id) on delete cascade,
  settings_key text not null default 'default',
  settings_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_skill_id, settings_key)
);

alter table public.skill_settings enable row level security;
revoke all on public.skill_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ss_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ss_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._ss_tenant_plan(p_tenant_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(s.plan_type, s.plan_key, 'starter')
  from public.subscriptions s where s.customer_id = p_tenant_id limit 1;
$$;

create or replace function public._ss_plan_rank(p_plan text)
returns int language sql immutable as $$
  select case lower(coalesce(p_plan, 'starter'))
    when 'enterprise' then 4 when 'business' then 3 when 'growth' then 2 else 1 end;
$$;

create or replace function public._ss_plan_allows(p_tenant_plan text, p_minimum_plan text)
returns boolean language sql immutable as $$
  select public._ss_plan_rank(p_tenant_plan) >= public._ss_plan_rank(p_minimum_plan);
$$;

create or replace function public._ss_log_install_event(
  p_tenant_id uuid,
  p_skill_id uuid,
  p_user_id uuid,
  p_event_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.skill_install_events (tenant_id, skill_id, user_id, event_type, metadata)
  values (p_tenant_id, p_skill_id, p_user_id, p_event_type, coalesce(p_metadata, '{}'::jsonb));
end; $$;

create or replace function public.check_skill_dependencies(p_skill_key text, p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_skill public.skills;
  v_missing jsonb := '[]'::jsonb;
  r record;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ss_require_tenant());
  select * into v_skill from public.skills where key = p_skill_key or slug = p_skill_key limit 1;
  if v_skill.id is null then raise exception 'Skill not found'; end if;

  for r in
    select sk.key, sk.name
    from public.skill_dependencies sd
    join public.skills sk on sk.id = sd.depends_on_skill_id
    where sd.skill_id = v_skill.id and sd.required = true
      and not exists (
        select 1 from public.tenant_skills ts
        where ts.tenant_id = v_tenant_id and ts.skill_id = sd.depends_on_skill_id
          and ts.status in ('installed', 'active', 'paused', 'warning')
      )
  loop
    v_missing := v_missing || jsonb_build_array(jsonb_build_object('key', r.key, 'name', r.name));
  end loop;

  return jsonb_build_object(
    'skill_key', v_skill.key, 'satisfied', jsonb_array_length(v_missing) = 0, 'missing', v_missing
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Seed Phase 60–62 skills + metadata
-- ---------------------------------------------------------------------------
insert into public.skills (
  key, slug, name, description, category, current_version, minimum_plan,
  requires_installation, requires_approval, supports_learning, status,
  author, risk_level, required_permissions, module_key, knowledge_center_category
) values
  ('knowledge-center', 'knowledge-center', 'Knowledge Center', 'Self-service knowledge base and gap detection.', 'Knowledge', '1.0.0', 'starter', false, false, true, 'active', 'Aipify', 'low', '["read:knowledge","write:knowledge"]'::jsonb, 'knowledge_center', 'knowledge-center'),
  ('quality-guardian', 'quality-guardian', 'Quality Guardian', 'Software and frontend health monitoring with incident engine.', 'Quality', '1.0.0', 'starter', false, false, true, 'active', 'Aipify', 'medium', '["read:quality","write:quality"]'::jsonb, 'quality_guardian', 'quality-guardian'),
  ('image-guardian', 'image-guardian', 'Image Guardian', 'Image optimization and asset health checks.', 'Quality', '1.0.0', 'starter', false, false, true, 'active', 'Aipify', 'low', '["read:quality"]'::jsonb, 'quality_guardian', 'quality-guardian'),
  ('performance-guardian', 'performance-guardian', 'Performance Guardian', 'Page performance and Core Web Vitals monitoring.', 'Quality', '1.0.0', 'starter', false, false, true, 'active', 'Aipify', 'low', '["read:quality"]'::jsonb, 'quality_guardian', 'quality-guardian'),
  ('desktop-companion', 'desktop-companion', 'Desktop Companion', 'Smart notifications, reminders, and mini assistant.', 'Companion', '1.0.0', 'business', false, false, true, 'active', 'Aipify', 'medium', '["read:notifications","write:preferences"]'::jsonb, null, 'desktop-companion'),
  ('executive-briefing', 'executive-briefing', 'Executive Briefing', 'Since Last Login and Daily Command Brief.', 'Executive', '1.0.0', 'starter', false, false, true, 'active', 'Aipify', 'low', '["read:briefing"]'::jsonb, 'executive_briefing_basic', 'briefing-daily-summary'),
  ('approval-center', 'approval-center', 'Approval Center', 'Governance approvals and trust controls.', 'Governance', '1.0.0', 'growth', false, true, false, 'active', 'Aipify', 'high', '["read:approvals","write:approvals"]'::jsonb, 'action_center', null),
  ('predictive-insights', 'predictive-insights', 'Predictive Insights', 'Predictions and forward-looking business intelligence.', 'Analytics', '1.0.0', 'business', false, true, true, 'beta', 'Aipify', 'medium', '["read:predictions"]'::jsonb, null, null),
  ('memory-engine', 'memory-engine', 'Memory Engine', 'Pattern learning and memory-improved recommendations.', 'Operational', '1.0.0', 'starter', false, false, true, 'active', 'Aipify', 'low', '["read:memory"]'::jsonb, 'organizational_memory', 'memory-engine')
on conflict (key) do update set
  slug = excluded.slug, description = excluded.description, category = excluded.category,
  risk_level = excluded.risk_level, required_permissions = excluded.required_permissions,
  module_key = excluded.module_key, knowledge_center_category = excluded.knowledge_center_category,
  status = excluded.status, updated_at = now();

-- Align existing keys
update public.skills set
  slug = key, knowledge_center_category = coalesce(knowledge_center_category, 'skill-store'),
  risk_level = case
    when requires_approval then 'high'
    when key in ('action-engine', 'self-healing-engine') then 'high'
    when key in ('priority-recommendations', 'moderation-assistant') then 'medium'
    else 'low'
  end
where slug is null or knowledge_center_category is null;

-- Dependencies: desktop-companion requires executive-briefing
insert into public.skill_dependencies (skill_id, depends_on_skill_id, required)
select dc.id, eb.id, true
from public.skills dc, public.skills eb
where dc.key = 'desktop-companion' and eb.key = 'executive-briefing'
on conflict (skill_id, depends_on_skill_id) do nothing;

insert into public.skill_dependencies (skill_id, depends_on_skill_id, required)
select ig.id, qg.id, true
from public.skills ig, public.skills qg
where ig.key = 'image-guardian' and qg.key = 'quality-guardian'
on conflict (skill_id, depends_on_skill_id) do nothing;

insert into public.skill_dependencies (skill_id, depends_on_skill_id, required)
select pg.id, qg.id, true
from public.skills pg, public.skills qg
where pg.key = 'performance-guardian' and qg.key = 'quality-guardian'
on conflict (skill_id, depends_on_skill_id) do nothing;

-- Version rows for new skills
insert into public.skill_versions (skill_id, version, release_notes, release_type, rollback_supported, released_at)
select s.id, s.current_version, 'Skill Store Phase 63 release', 'minor', true, now()
from public.skills s
where not exists (select 1 from public.skill_versions v where v.skill_id = s.id and v.version = s.current_version);

-- ---------------------------------------------------------------------------
-- 7. Catalog & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_skill_catalog(p_category text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_plan text;
begin
  v_tenant_id := public._ss_require_tenant();
  v_plan := public._ss_tenant_plan(v_tenant_id);

  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', s.id, 'key', s.key, 'slug', coalesce(s.slug, s.key), 'name', s.name,
    'description', s.description, 'category', s.category, 'version', s.current_version,
    'author', s.author, 'risk_level', s.risk_level, 'minimum_plan', s.minimum_plan,
    'requires_approval', s.requires_approval, 'requires_installation', s.requires_installation,
    'status', s.status, 'installed', exists (
      select 1 from public.tenant_skills ts
      where ts.tenant_id = v_tenant_id and ts.skill_id = s.id
        and ts.status not in ('disabled')
    ),
    'plan_allowed', public._ss_plan_allows(v_plan, s.minimum_plan)
  ) order by s.category, s.name) from public.skills s
  where s.status in ('active', 'beta')
    and (p_category is null or s.category = p_category)
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_skill_detail(p_skill_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_skill public.skills;
  v_deps jsonb;
  v_perms jsonb;
  v_tenant_skill public.tenant_skills;
begin
  v_tenant_id := public._ss_require_tenant();
  v_plan := public._ss_tenant_plan(v_tenant_id);
  select * into v_skill from public.skills where key = p_skill_key or slug = p_skill_key limit 1;
  if v_skill.id is null then raise exception 'Skill not found'; end if;

  select * into v_tenant_skill from public.tenant_skills
  where tenant_id = v_tenant_id and skill_id = v_skill.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', sk.key, 'name', sk.name, 'required', sd.required
  )), '[]'::jsonb) into v_deps
  from public.skill_dependencies sd
  join public.skills sk on sk.id = sd.depends_on_skill_id
  where sd.skill_id = v_skill.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'permission_key', sp.permission_key, 'scope', sp.scope, 'approved', sp.approved
  )), '[]'::jsonb) into v_perms
  from public.skill_permissions sp
  where sp.tenant_skill_id = v_tenant_skill.id;

  return jsonb_build_object(
    'key', v_skill.key, 'slug', coalesce(v_skill.slug, v_skill.key),
    'name', v_skill.name, 'description', v_skill.description, 'category', v_skill.category,
    'version', v_skill.current_version, 'author', v_skill.author,
    'risk_level', v_skill.risk_level, 'minimum_plan', v_skill.minimum_plan,
    'requires_approval', v_skill.requires_approval,
    'requires_installation', v_skill.requires_installation,
    'required_permissions', v_skill.required_permissions,
    'required_integrations', v_skill.required_integrations,
    'documentation_links', v_skill.documentation_links,
    'knowledge_center_category', v_skill.knowledge_center_category,
    'module_key', v_skill.module_key,
    'dependencies', v_deps,
    'dependency_check', public.check_skill_dependencies(v_skill.key, v_tenant_id),
    'plan_allowed', public._ss_plan_allows(v_plan, v_skill.minimum_plan),
    'installed', v_tenant_skill.id is not null,
    'tenant_skill_id', v_tenant_skill.id,
    'tenant_status', v_tenant_skill.status,
    'permissions', v_perms
  );
end; $$;

create or replace function public.get_skill_store_card()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_installed int;
  v_available int;
  v_pending int;
begin
  v_tenant_id := public._ss_require_tenant();

  select count(*) into v_installed from public.tenant_skills
  where tenant_id = v_tenant_id and status in ('installed', 'active', 'paused', 'warning');

  select count(*) into v_available from public.skills sk
  where sk.status in ('active', 'beta')
    and not exists (select 1 from public.tenant_skills ts where ts.tenant_id = v_tenant_id and ts.skill_id = sk.id);

  select count(*) into v_pending from public.skill_install_events
  where tenant_id = v_tenant_id and event_type = 'approval_requested'
    and created_at >= now() - interval '30 days';

  return jsonb_build_object(
    'has_customer', true,
    'installed_count', v_installed,
    'available_count', v_available,
    'pending_approvals', v_pending,
    'philosophy', 'Discover → Install → Configure → Approve → Use → Improve',
    'privacy_note', 'Skills operate within governance controls, permissions, and audit logging. No cross-tenant access.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Install / disable / activate
-- ---------------------------------------------------------------------------
create or replace function public.install_tenant_skill(p_skill_key text, p_approve boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_plan text;
  v_skill public.skills;
  v_deps jsonb;
  v_tenant_skill_id uuid;
  v_perm text;
begin
  v_tenant_id := public._ss_require_tenant();
  v_user_id := public._ss_auth_user_id();
  v_plan := public._ss_tenant_plan(v_tenant_id);

  select * into v_skill from public.skills where key = p_skill_key or slug = p_skill_key limit 1;
  if v_skill.id is null then raise exception 'Skill not found'; end if;
  if not public._ss_plan_allows(v_plan, v_skill.minimum_plan) then
    raise exception 'Plan does not allow this skill';
  end if;

  v_deps := public.check_skill_dependencies(v_skill.key, v_tenant_id);
  if not (v_deps->>'satisfied')::boolean then
    raise exception 'Missing dependencies: %', v_deps->'missing';
  end if;

  if v_skill.requires_approval and not p_approve then
    perform public._ss_log_install_event(v_tenant_id, v_skill.id, v_user_id, 'approval_requested',
      jsonb_build_object('skill_key', v_skill.key));
    perform public._tacc_log_audit(v_tenant_id, 'user', 'skill_install_approval_requested', 'skills', 'pending', v_user_id,
      jsonb_build_object('skill_key', v_skill.key));
    return jsonb_build_object('status', 'approval_required', 'skill_key', v_skill.key);
  end if;

  insert into public.tenant_skills (tenant_id, skill_id, version, status, learning_mode, activated_at)
  values (v_tenant_id, v_skill.id, v_skill.current_version,
    case when v_skill.requires_approval and p_approve then 'active' else 'installed' end,
    'assisted', now())
  on conflict (tenant_id, skill_id) do update set
    status = case when excluded.status = 'active' then 'active' else public.tenant_skills.status end,
    version = excluded.version, updated_at = now()
  returning id into v_tenant_skill_id;

  insert into public.skill_health (tenant_skill_id) values (v_tenant_skill_id)
  on conflict (tenant_skill_id) do nothing;

  for v_perm in select jsonb_array_elements_text(v_skill.required_permissions)
  loop
    insert into public.skill_permissions (tenant_skill_id, permission_key, scope, approved)
    values (v_tenant_skill_id, v_perm, 'tenant', not v_skill.requires_approval or p_approve)
    on conflict (tenant_skill_id, permission_key) do nothing;
  end loop;

  insert into public.skill_settings (tenant_skill_id, settings_key, settings_value)
  values (v_tenant_skill_id, 'default', '{}'::jsonb)
  on conflict (tenant_skill_id, settings_key) do nothing;

  perform public._ss_log_install_event(v_tenant_id, v_skill.id, v_user_id, 'installed',
    jsonb_build_object('skill_key', v_skill.key, 'version', v_skill.current_version));
  if p_approve then
    perform public._ss_log_install_event(v_tenant_id, v_skill.id, v_user_id, 'approved',
      jsonb_build_object('skill_key', v_skill.key));
  end if;
  perform public._ss_log_install_event(v_tenant_id, v_skill.id, v_user_id, 'activated',
    jsonb_build_object('skill_key', v_skill.key));

  perform public.record_skill_audit_log(v_tenant_skill_id, 'install', 'success', 'skill_store',
    jsonb_build_object('skill_key', v_skill.key, 'approved', p_approve));
  perform public._tacc_log_audit(v_tenant_id, 'user', 'skill_installed', 'skills', 'success', v_user_id,
    jsonb_build_object('skill_key', v_skill.key, 'tenant_skill_id', v_tenant_skill_id));

  return jsonb_build_object(
    'status', 'installed', 'tenant_skill_id', v_tenant_skill_id, 'skill_key', v_skill.key
  );
end; $$;

create or replace function public.disable_tenant_skill(p_tenant_skill_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_ts public.tenant_skills;
begin
  v_tenant_id := public._ss_require_tenant();
  v_user_id := public._ss_auth_user_id();
  select * into v_ts from public.tenant_skills
  where id = p_tenant_skill_id and tenant_id = v_tenant_id;
  if v_ts.id is null then raise exception 'Skill installation not found'; end if;

  update public.tenant_skills set status = 'disabled', disabled_at = now(), updated_at = now()
  where id = p_tenant_skill_id;

  perform public._ss_log_install_event(v_tenant_id, v_ts.skill_id, v_user_id, 'disabled', '{}'::jsonb);
  perform public.record_skill_audit_log(p_tenant_skill_id, 'disable', 'success', 'skill_store', '{}'::jsonb);
  perform public._tacc_log_audit(v_tenant_id, 'user', 'skill_disabled', 'skills', 'success', v_user_id,
    jsonb_build_object('tenant_skill_id', p_tenant_skill_id));

  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.activate_tenant_skill(p_tenant_skill_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_ts public.tenant_skills;
begin
  v_tenant_id := public._ss_require_tenant();
  v_user_id := public._ss_auth_user_id();
  select * into v_ts from public.tenant_skills
  where id = p_tenant_skill_id and tenant_id = v_tenant_id;
  if v_ts.id is null then raise exception 'Skill installation not found'; end if;

  update public.tenant_skills set status = 'active', activated_at = now(), updated_at = now()
  where id = p_tenant_skill_id;

  perform public._ss_log_install_event(v_tenant_id, v_ts.skill_id, v_user_id, 'activated', '{}'::jsonb);
  perform public.record_skill_audit_log(p_tenant_skill_id, 'activate', 'success', 'skill_store', '{}'::jsonb);

  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.get_skill_install_history(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ss_require_tenant();
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', x.id, 'event_type', x.event_type, 'skill_key', x.key,
      'skill_name', x.name, 'metadata', x.metadata, 'created_at', x.created_at
    ) order by x.created_at desc)
    from (
      select e.id, e.event_type, e.metadata, e.created_at, sk.key, sk.name
      from public.skill_install_events e
      join public.skills sk on sk.id = e.skill_id
      where e.tenant_id = v_tenant_id
      order by e.created_at desc
      limit greatest(1, least(p_limit, 100))
    ) x
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_tenant_skill_settings(p_tenant_skill_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ss_require_tenant();
  if not exists (
    select 1 from public.tenant_skills ts
    where ts.id = p_tenant_skill_id and ts.tenant_id = v_tenant_id
  ) then raise exception 'Skill installation not found'; end if;

  return coalesce((select jsonb_agg(jsonb_build_object(
    'settings_key', ss.settings_key, 'settings_value', ss.settings_value
  )) from public.skill_settings ss where ss.tenant_skill_id = p_tenant_skill_id), '[]'::jsonb);
end; $$;

create or replace function public.update_tenant_skill_settings(p_tenant_skill_id uuid, p_settings jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._ss_require_tenant();
  v_user_id := public._ss_auth_user_id();
  if not exists (
    select 1 from public.tenant_skills ts
    where ts.id = p_tenant_skill_id and ts.tenant_id = v_tenant_id
  ) then raise exception 'Skill installation not found'; end if;

  insert into public.skill_settings (tenant_skill_id, settings_key, settings_value)
  values (p_tenant_skill_id, coalesce(p_settings->>'settings_key', 'default'), coalesce(p_settings->'settings_value', '{}'::jsonb))
  on conflict (tenant_skill_id, settings_key) do update set
    settings_value = excluded.settings_value, updated_at = now();

  perform public._ss_log_install_event(v_tenant_id,
    (select skill_id from public.tenant_skills where id = p_tenant_skill_id),
    v_user_id, 'configured', p_settings);
  perform public.record_skill_audit_log(p_tenant_skill_id, 'configure', 'success', 'skill_store', p_settings);

  return jsonb_build_object('ok', true);
end; $$;

-- Unonight pilot: seed initial skills for unonight tenant if exists
create or replace function public.seed_unonight_pilot_skills()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_keys text[] := array[
  'support-assistant', 'quality-guardian', 'executive-briefing',
  'desktop-companion', 'memory-engine'
]; v_key text; v_count int := 0;
begin
  select c.id into v_tenant_id from public.customers c
  join public.companies co on co.id = c.company_id
  where lower(co.slug) = 'unonight' or lower(c.name) like '%unonight%'
  limit 1;

  if v_tenant_id is null then
    return jsonb_build_object('seeded', 0, 'reason', 'unonight tenant not found');
  end if;

  foreach v_key in array v_keys
  loop
    begin
      perform public.install_tenant_skill(v_key, true);
      v_count := v_count + 1;
    exception when others then
      null;
    end;
  end loop;

  return jsonb_build_object('seeded', v_count, 'tenant_id', v_tenant_id);
end; $$;

-- KC category
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'skill-store', 'Skill Store', 'Modular Skills catalog, installation, and permissions', 'authenticated', 102
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'skill-store' and tenant_id is null);

-- Grants
grant execute on function public.get_skill_catalog(text) to authenticated;
grant execute on function public.get_skill_detail(text) to authenticated;
grant execute on function public.get_skill_store_card() to authenticated;
grant execute on function public.check_skill_dependencies(text, uuid) to authenticated;
grant execute on function public.install_tenant_skill(text, boolean) to authenticated;
grant execute on function public.disable_tenant_skill(uuid) to authenticated;
grant execute on function public.activate_tenant_skill(uuid) to authenticated;
grant execute on function public.get_skill_install_history(int) to authenticated;
grant execute on function public.get_tenant_skill_settings(uuid) to authenticated;
grant execute on function public.update_tenant_skill_settings(uuid, jsonb) to authenticated;
grant execute on function public.seed_unonight_pilot_skills() to authenticated;
