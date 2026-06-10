-- Phase 22 — Skill Operating System (SkillOS)

-- ---------------------------------------------------------------------------
-- 1. Skill registry (platform definitions — marketplace prep, no public UI)
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null default '',
  category text not null,
  current_version text not null default '1.0.0',
  minimum_plan text not null default 'starter',
  requires_installation boolean not null default false,
  requires_approval boolean not null default false,
  supports_learning boolean not null default true,
  status text not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skills
  drop constraint if exists skills_status_check;

alter table public.skills
  add constraint skills_status_check check (
    status in ('planned', 'beta', 'active', 'deprecated', 'retired')
  );

alter table public.skills enable row level security;
revoke all on public.skills from authenticated, anon;

create index if not exists skills_category_idx on public.skills (category);
create index if not exists skills_status_idx on public.skills (status);

-- ---------------------------------------------------------------------------
-- 2. Skill versions
-- ---------------------------------------------------------------------------
create table if not exists public.skill_versions (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills (id) on delete cascade,
  version text not null,
  release_notes text not null default '',
  release_type text not null default 'minor',
  rollback_supported boolean not null default true,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  unique (skill_id, version)
);

alter table public.skill_versions
  drop constraint if exists skill_versions_release_type_check;

alter table public.skill_versions
  add constraint skill_versions_release_type_check check (
    release_type in ('patch', 'minor', 'major', 'security')
  );

alter table public.skill_versions enable row level security;
revoke all on public.skill_versions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Tenant skills (customer workspace)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_skills (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  version text not null default '1.0.0',
  status text not null default 'installed',
  learning_mode text not null default 'assisted',
  activated_at timestamptz,
  paused_at timestamptz,
  disabled_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (tenant_id, skill_id)
);

alter table public.tenant_skills
  drop constraint if exists tenant_skills_status_check;

alter table public.tenant_skills
  add constraint tenant_skills_status_check check (
    status in ('installed', 'active', 'paused', 'warning', 'failed', 'disabled')
  );

alter table public.tenant_skills
  drop constraint if exists tenant_skills_learning_mode_check;

alter table public.tenant_skills
  add constraint tenant_skills_learning_mode_check check (
    learning_mode in ('disabled', 'assisted', 'adaptive')
  );

alter table public.tenant_skills enable row level security;
revoke all on public.tenant_skills from authenticated, anon;

create index if not exists tenant_skills_tenant_id_idx
  on public.tenant_skills (tenant_id, status);

-- ---------------------------------------------------------------------------
-- 4. Skill permissions (least privilege)
-- ---------------------------------------------------------------------------
create table if not exists public.skill_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_skill_id uuid not null references public.tenant_skills (id) on delete cascade,
  permission_key text not null,
  scope text not null default 'tenant',
  approved boolean not null default false,
  approved_by uuid references auth.users (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_skill_id, permission_key)
);

alter table public.skill_permissions enable row level security;
revoke all on public.skill_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Skill health
-- ---------------------------------------------------------------------------
create table if not exists public.skill_health (
  id uuid primary key default gen_random_uuid(),
  tenant_skill_id uuid not null unique references public.tenant_skills (id) on delete cascade,
  status text not null default 'healthy',
  health_score int not null default 100 check (health_score between 0 and 100),
  last_execution_at timestamptz,
  failure_count int not null default 0,
  success_count int not null default 0,
  warning_count int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.skill_health
  drop constraint if exists skill_health_status_check;

alter table public.skill_health
  add constraint skill_health_status_check check (
    status in ('healthy', 'warning', 'failed', 'paused')
  );

alter table public.skill_health enable row level security;
revoke all on public.skill_health from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Skill events
-- ---------------------------------------------------------------------------
create table if not exists public.skill_events (
  id uuid primary key default gen_random_uuid(),
  tenant_skill_id uuid not null references public.tenant_skills (id) on delete cascade,
  event_type text not null,
  event_category text not null default 'execution',
  severity text not null default 'info',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.skill_events
  drop constraint if exists skill_events_severity_check;

alter table public.skill_events
  add constraint skill_events_severity_check check (
    severity in ('info', 'warning', 'error', 'critical')
  );

alter table public.skill_events enable row level security;
revoke all on public.skill_events from authenticated, anon;

create index if not exists skill_events_tenant_skill_idx
  on public.skill_events (tenant_skill_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 7. Skill audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.skill_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_skill_id uuid not null references public.tenant_skills (id) on delete cascade,
  action text not null,
  performed_by uuid references auth.users (id) on delete set null,
  approval_source text,
  result text not null default 'success',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.skill_audit_logs
  drop constraint if exists skill_audit_logs_result_check;

alter table public.skill_audit_logs
  add constraint skill_audit_logs_result_check check (
    result in ('success', 'failure', 'blocked', 'pending')
  );

alter table public.skill_audit_logs enable row level security;
revoke all on public.skill_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Seed marketplace-prep skill definitions
-- ---------------------------------------------------------------------------
insert into public.skills (key, name, description, category, current_version, minimum_plan, requires_installation, requires_approval, supports_learning, status)
values
  ('support-assistant', 'Support AI', 'AI-assisted support for operational and customer-facing questions.', 'Support', '1.0.0', 'starter', false, false, true, 'active'),
  ('customer-support-assistant', 'Customer Support Specialist', 'Customer-facing support guidance and escalation.', 'Support', '1.0.0', 'starter', false, false, true, 'active'),
  ('executive-briefings', 'Executive AI', 'Morning briefings and executive operational summaries.', 'Executive', '1.0.0', 'starter', false, false, true, 'active'),
  ('priority-recommendations', 'Executive Analyst', 'Priority recommendations for leadership decisions.', 'Executive', '1.0.0', 'growth', false, true, true, 'beta'),
  ('commerce-assistant', 'Commerce AI', 'Commerce operations and order-flow assistance.', 'Commerce', '1.0.0', 'growth', true, true, true, 'planned'),
  ('marketing-assistant', 'Marketing AI', 'Campaign and communication drafting assistance.', 'Marketing', '1.0.0', 'enterprise', false, true, true, 'planned'),
  ('moderation-assistant', 'Moderation AI', 'Content moderation and policy enforcement support.', 'Moderation', '1.0.0', 'business', false, true, false, 'planned'),
  ('analytics-assistant', 'Analytics AI', 'Operational analytics and trend summaries.', 'Analytics', '1.0.0', 'business', false, false, true, 'planned'),
  ('recommendations-engine', 'Recommendations Engine', 'Operational recommendations across modules.', 'Operational', '1.0.0', 'starter', false, false, true, 'active'),
  ('self-healing-engine', 'Self-Healing Engine', 'Automated recovery and health remediation.', 'Operational', '1.0.0', 'business', true, true, true, 'beta'),
  ('action-engine', 'Action Engine', 'Approved operational actions and automations.', 'Operational', '1.0.0', 'growth', false, true, false, 'active'),
  ('companion', 'Executive Companion', 'Persistent executive companion preferences.', 'Companion', '1.0.0', 'starter', false, false, true, 'active')
on conflict (key) do nothing;

insert into public.skill_versions (skill_id, version, release_notes, release_type, rollback_supported, released_at)
select s.id, s.current_version, 'Initial SkillOS release', 'minor', true, now()
from public.skills s
where not exists (
  select 1 from public.skill_versions v where v.skill_id = s.id and v.version = s.current_version
);

-- ---------------------------------------------------------------------------
-- 9. Success score helper
-- ---------------------------------------------------------------------------
create or replace function public.compute_skill_success_score(p_tenant_skill_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_health public.skill_health;
  v_total int;
  v_success_rate numeric;
  v_score numeric;
begin
  select * into v_health from public.skill_health where tenant_skill_id = p_tenant_skill_id;

  if v_health.id is null then
    return 50;
  end if;

  v_total := v_health.success_count + v_health.failure_count;
  v_success_rate := case
    when v_total = 0 then 0.75
    else v_health.success_count::numeric / v_total::numeric
  end;

  v_score :=
    (v_success_rate * 40)
    + (coalesce(v_health.health_score, 50) * 0.35)
    + (case v_health.status
        when 'healthy' then 15
        when 'warning' then 8
        when 'paused' then 5
        else 0
      end);

  return least(100, greatest(0, round(v_score)::int));
end;
$$;

grant execute on function public.compute_skill_success_score(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 10. Platform SkillOS dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_skillos_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_by_status jsonb;
  v_by_category jsonb;
  v_version_count int;
  v_tenant_installs int;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(jsonb_object_agg(status, cnt), '{}'::jsonb)
  into v_by_status
  from (
    select status, count(*)::int as cnt from public.skills group by status
  ) s;

  select coalesce(jsonb_object_agg(category, cnt), '{}'::jsonb)
  into v_by_category
  from (
    select category, count(*)::int as cnt from public.skills group by category
  ) c;

  select count(*)::int into v_version_count from public.skill_versions;
  select count(*)::int into v_tenant_installs from public.tenant_skills;

  return jsonb_build_object(
    'skill_count', (select count(*)::int from public.skills),
    'by_status', v_by_status,
    'by_category', v_by_category,
    'version_count', v_version_count,
    'tenant_install_count', v_tenant_installs,
    'release_pipeline', jsonb_build_array(
      'aipify_internal',
      'unonight_pilot',
      'beta_customers',
      'stable_release'
    ),
    'principle',
    'Features create software. Skills create intelligence. SkillOS creates an ecosystem.'
  );
end;
$$;

grant execute on function public.get_platform_skillos_dashboard() to authenticated;

-- ---------------------------------------------------------------------------
-- 11. Customer skill workspace
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_skill_workspace()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_plan text;
  v_installed jsonb;
  v_available jsonb;
begin
  select c.id, coalesce(s.plan_type, 'starter')
  into v_customer_id, v_plan
  from public.customers c
  join public.company_users cu on cu.company_id = c.company_id
  left join public.subscriptions s on s.customer_id = c.id
  where cu.auth_user_id = auth.uid()
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer not found';
  end if;

  select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.name), '[]'::jsonb)
  into v_installed
  from (
    select
      ts.id as tenant_skill_id,
      sk.key,
      sk.name,
      sk.category,
      ts.version,
      ts.status,
      ts.learning_mode,
      coalesce(sh.health_score, 100) as health_score,
      coalesce(sh.status, 'healthy') as health_status,
      public.compute_skill_success_score(ts.id) as success_score
    from public.tenant_skills ts
    join public.skills sk on sk.id = ts.skill_id
    left join public.skill_health sh on sh.tenant_skill_id = ts.id
    where ts.tenant_id = v_customer_id
  ) x;

  select coalesce(jsonb_agg(row_to_json(a)::jsonb order by a.name), '[]'::jsonb)
  into v_available
  from (
    select sk.key, sk.name, sk.category, sk.minimum_plan, sk.status, sk.requires_approval
    from public.skills sk
    where sk.status in ('active', 'beta')
      and not exists (
        select 1 from public.tenant_skills ts
        where ts.tenant_id = v_customer_id and ts.skill_id = sk.id
      )
  ) a;

  return jsonb_build_object(
    'tenant_id', v_customer_id,
    'plan', v_plan,
    'installed_skills', v_installed,
    'available_skills', v_available,
    'learning_default', 'assisted',
    'principle',
    'Every Skill requests only the permissions it requires. New permissions require approval.'
  );
end;
$$;

grant execute on function public.get_customer_skill_workspace() to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Record skill audit log
-- ---------------------------------------------------------------------------
create or replace function public.record_skill_audit_log(
  p_tenant_skill_id uuid,
  p_action text,
  p_result text default 'success',
  p_approval_source text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_result not in ('success', 'failure', 'blocked', 'pending') then
    raise exception 'Invalid audit result';
  end if;

  insert into public.skill_audit_logs (
    tenant_skill_id,
    action,
    performed_by,
    approval_source,
    result,
    metadata
  )
  values (
    p_tenant_skill_id,
    p_action,
    auth.uid(),
    p_approval_source,
    p_result,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_skill_audit_log(uuid, text, text, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 13. Install Engine — skill health report
-- ---------------------------------------------------------------------------
create or replace function public.record_install_skill_health(
  p_token text,
  p_skill_key text,
  p_status text,
  p_health_score int default null,
  p_success_delta int default 0,
  p_failure_delta int default 0,
  p_warning_delta int default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_installation public.installations;
  v_skill public.skills;
  v_tenant_skill public.tenant_skills;
  v_health public.skill_health;
begin
  if p_token is null or length(p_token) < 20 then
    raise exception 'Invalid installation token';
  end if;

  if p_status not in ('healthy', 'warning', 'failed', 'paused') then
    raise exception 'Invalid health status';
  end if;

  v_hash := public.hash_installation_token(p_token);

  select * into v_installation
  from public.installations i
  where i.installation_token_hash = v_hash and i.revoked_at is null
  limit 1;

  if v_installation.id is null or v_installation.customer_id is null then
    raise exception 'Installation not found';
  end if;

  select * into v_skill from public.skills where key = p_skill_key limit 1;
  if v_skill.id is null then
    raise exception 'Skill not found';
  end if;

  select * into v_tenant_skill
  from public.tenant_skills ts
  where ts.tenant_id = v_installation.customer_id and ts.skill_id = v_skill.id;

  if v_tenant_skill.id is null then
    raise exception 'Skill not installed for tenant';
  end if;

  insert into public.skill_health (
    tenant_skill_id,
    status,
    health_score,
    last_execution_at,
    success_count,
    failure_count,
    warning_count
  )
  values (
    v_tenant_skill.id,
    p_status,
    coalesce(p_health_score, 100),
    now(),
    greatest(0, p_success_delta),
    greatest(0, p_failure_delta),
    greatest(0, p_warning_delta)
  )
  on conflict (tenant_skill_id) do update set
    status = excluded.status,
    health_score = coalesce(excluded.health_score, public.skill_health.health_score),
    last_execution_at = now(),
    success_count = public.skill_health.success_count + greatest(0, p_success_delta),
    failure_count = public.skill_health.failure_count + greatest(0, p_failure_delta),
    warning_count = public.skill_health.warning_count + greatest(0, p_warning_delta),
    updated_at = now()
  returning * into v_health;

  insert into public.skill_events (tenant_skill_id, event_type, event_category, severity, details)
  values (
    v_tenant_skill.id,
    'health_reported',
    'health',
    case p_status when 'failed' then 'error' when 'warning' then 'warning' else 'info' end,
    jsonb_build_object('installation_id', v_installation.id, 'status', p_status)
  );

  return jsonb_build_object(
    'tenant_skill_id', v_tenant_skill.id,
    'health_score', v_health.health_score,
    'success_score', public.compute_skill_success_score(v_tenant_skill.id)
  );
end;
$$;

revoke execute on function public.record_install_skill_health(text, text, text, int, int, int, int) from public;
grant execute on function public.record_install_skill_health(text, text, text, int, int, int, int) to anon;
