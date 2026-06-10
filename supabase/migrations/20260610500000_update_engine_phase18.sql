-- Phase 18 — Safe Update & Version Deployment Foundation

-- ---------------------------------------------------------------------------
-- 1. Extend installations with version deployment fields
-- ---------------------------------------------------------------------------
alter table public.installations
  add column if not exists target_version text,
  add column if not exists update_status text not null default 'idle',
  add column if not exists rollback_available boolean not null default false,
  add column if not exists update_channel text not null default 'stable',
  add column if not exists last_update_at timestamptz;

alter table public.installations
  drop constraint if exists installations_update_status_check;

alter table public.installations
  add constraint installations_update_status_check check (
    update_status in ('idle', 'pending', 'updating', 'updated', 'failed', 'rolled_back')
  );

alter table public.installations
  drop constraint if exists installations_update_channel_check;

alter table public.installations
  add constraint installations_update_channel_check check (
    update_channel in ('internal', 'pilot', 'stable', 'enterprise')
  );

-- ---------------------------------------------------------------------------
-- 2. Maintenance windows (platform_updates)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_updates (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  description text not null default '',
  scheduled_at timestamptz,
  expected_duration_minutes integer not null default 5,
  status text not null default 'draft',
  update_type text not null default 'patch',
  update_channel text not null default 'stable',
  migration_file text,
  migration_description text,
  affected_tables jsonb not null default '[]'::jsonb,
  backup_strategy text,
  rollback_plan text,
  migration_approved boolean not null default false,
  rollback_available boolean not null default true,
  rollback_steps jsonb not null default '[]'::jsonb,
  previous_version text,
  rollback_deadline timestamptz,
  notification_channels jsonb not null default '["presence_center","notification_bell","email","customer_control_center","platform_admin"]'::jsonb,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_updates
  drop constraint if exists platform_updates_status_check;

alter table public.platform_updates
  add constraint platform_updates_status_check check (
    status in ('draft', 'scheduled', 'in_progress', 'completed', 'failed', 'rolled_back')
  );

alter table public.platform_updates
  drop constraint if exists platform_updates_update_type_check;

alter table public.platform_updates
  add constraint platform_updates_update_type_check check (
    update_type in ('patch', 'minor', 'major', 'security', 'database_migration')
  );

alter table public.platform_updates
  drop constraint if exists platform_updates_update_channel_check;

alter table public.platform_updates
  add constraint platform_updates_update_channel_check check (
    update_channel in ('internal', 'pilot', 'stable', 'enterprise')
  );

alter table public.platform_updates enable row level security;
revoke all on public.platform_updates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Per-installation rollout targets
-- ---------------------------------------------------------------------------
create table if not exists public.platform_update_targets (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null references public.platform_updates (id) on delete cascade,
  installation_id uuid not null references public.installations (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  status text not null default 'pending',
  notified_at timestamptz,
  updated_at_field timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  unique (update_id, installation_id)
);

alter table public.platform_update_targets
  drop constraint if exists platform_update_targets_status_check;

alter table public.platform_update_targets
  add constraint platform_update_targets_status_check check (
    status in ('pending', 'notified', 'updating', 'updated', 'failed', 'rolled_back')
  );

alter table public.platform_update_targets enable row level security;
revoke all on public.platform_update_targets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.platform_update_audit_log (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null references public.platform_updates (id) on delete cascade,
  event_type text not null,
  actor_id uuid references auth.users (id) on delete set null,
  installation_id uuid references public.installations (id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.platform_update_audit_log
  drop constraint if exists platform_update_audit_log_event_type_check;

alter table public.platform_update_audit_log
  add constraint platform_update_audit_log_event_type_check check (
    event_type in (
      'update_created',
      'update_scheduled',
      'notification_sent',
      'update_started',
      'installation_updated',
      'installation_failed',
      'rollback_started',
      'rollback_completed',
      'migration_approved',
      'migration_rejected'
    )
  );

alter table public.platform_update_audit_log enable row level security;
revoke all on public.platform_update_audit_log from authenticated, anon;

create index if not exists platform_updates_status_idx on public.platform_updates (status);
create index if not exists platform_updates_scheduled_at_idx on public.platform_updates (scheduled_at);
create index if not exists platform_update_targets_update_id_idx on public.platform_update_targets (update_id);
create index if not exists platform_update_audit_log_update_id_idx on public.platform_update_audit_log (update_id);

-- ---------------------------------------------------------------------------
-- 5. Audit helper
-- ---------------------------------------------------------------------------
create or replace function public.record_update_audit_event(
  p_update_id uuid,
  p_event_type text,
  p_installation_id uuid default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.platform_update_audit_log (
    update_id, event_type, actor_id, installation_id, details
  )
  values (
    p_update_id, p_event_type, auth.uid(), p_installation_id, coalesce(p_details, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke execute on function public.record_update_audit_event(uuid, text, uuid, jsonb) from public, anon;

-- ---------------------------------------------------------------------------
-- 6. Platform Admin — list updates
-- ---------------------------------------------------------------------------
create or replace function public.list_platform_updates()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(jsonb_agg(row_to_json(t)::jsonb order by t.scheduled_at desc nulls last, t.created_at desc), '[]'::jsonb)
  into v_rows
  from (
    select
      u.id,
      u.version,
      u.title,
      u.description,
      u.scheduled_at,
      u.expected_duration_minutes,
      u.status,
      u.update_type,
      u.update_channel,
      u.rollback_available,
      u.created_at,
      (select count(*)::int from public.platform_update_targets t where t.update_id = u.id) as affected_installations
    from public.platform_updates u
  ) t;

  return v_rows;
end;
$$;

grant execute on function public.list_platform_updates() to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Platform Admin — update detail
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_update_detail(p_update_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_update jsonb;
  v_targets jsonb;
  v_audit jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select row_to_json(u)::jsonb into v_update
  from public.platform_updates u
  where u.id = p_update_id;

  if v_update is null then
    raise exception 'Update not found';
  end if;

  select coalesce(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb) into v_targets
  from (
    select
      tgt.id,
      tgt.installation_id,
      tgt.customer_id,
      tgt.status,
      tgt.notified_at,
      tgt.updated_at_field,
      tgt.error_message,
      i.name as installation_name,
      i.site_url,
      i.version as current_version,
      i.update_status
    from public.platform_update_targets tgt
    join public.installations i on i.id = tgt.installation_id
    where tgt.update_id = p_update_id
  ) t;

  select coalesce(jsonb_agg(row_to_json(a)::jsonb order by a.created_at desc), '[]'::jsonb) into v_audit
  from (
    select id, event_type, actor_id, installation_id, details, created_at
    from public.platform_update_audit_log
    where update_id = p_update_id
    order by created_at desc
    limit 100
  ) a;

  return jsonb_build_object(
    'update', v_update,
    'targets', v_targets,
    'audit_log', v_audit
  );
end;
$$;

grant execute on function public.get_platform_update_detail(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Customer — update overview (read-only)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_update_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_installations jsonb;
  v_next_update jsonb;
  v_history jsonb;
begin
  select c.id into v_customer_id
  from public.customers c
  join public.company_users cu on cu.company_id = c.company_id
  where cu.auth_user_id = auth.uid()
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer not found';
  end if;

  select coalesce(jsonb_agg(row_to_json(i)::jsonb), '[]'::jsonb) into v_installations
  from (
    select
      inst.id as installation_id,
      inst.version as current_version,
      inst.target_version,
      inst.last_update_at,
      inst.update_status,
      inst.rollback_available,
      inst.update_channel
    from public.installations inst
    where inst.customer_id = v_customer_id
      and inst.status not in ('archived')
  ) i;

  select row_to_json(u)::jsonb into v_next_update
  from public.platform_updates u
  where u.status in ('scheduled', 'in_progress')
    and exists (
      select 1
      from public.platform_update_targets tgt
      join public.installations inst on inst.id = tgt.installation_id
      where tgt.update_id = u.id
        and inst.customer_id = v_customer_id
    )
  order by u.scheduled_at asc nulls last
  limit 1;

  select coalesce(jsonb_agg(row_to_json(h)::jsonb order by h.scheduled_at desc nulls last), '[]'::jsonb)
  into v_history
  from (
    select distinct u.id, u.version, u.title, u.scheduled_at, u.status, u.expected_duration_minutes
    from public.platform_updates u
    join public.platform_update_targets tgt on tgt.update_id = u.id
    join public.installations inst on inst.id = tgt.installation_id
    where inst.customer_id = v_customer_id
      and u.status in ('completed', 'failed', 'rolled_back')
    order by u.scheduled_at desc nulls last
    limit 20
  ) h;

  return jsonb_build_object(
    'installations', v_installations,
    'next_scheduled_update', v_next_update,
    'update_history', v_history,
    'customer_reassurance', 'Nothing is required from you. Aipify will continue monitoring after the update.'
  );
end;
$$;

grant execute on function public.get_customer_update_overview() to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Embedded — version report
-- ---------------------------------------------------------------------------
create or replace function public.record_installation_version_report(
  p_token text,
  p_current_version text,
  p_update_result text default null,
  p_details jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_installation public.installations;
begin
  if p_token is null or length(p_token) < 20 then
    raise exception 'Invalid installation token';
  end if;

  v_hash := public.hash_installation_token(p_token);

  select * into v_installation
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.revoked_at is null
  limit 1;

  if v_installation.id is null then
    raise exception 'Installation not found';
  end if;

  update public.installations
  set
    version = coalesce(nullif(trim(p_current_version), ''), version),
    last_update_at = case when p_update_result is not null then now() else last_update_at end,
    update_status = case
      when p_update_result = 'success' then 'updated'
      when p_update_result = 'failure' then 'failed'
      else update_status
    end,
    provisioning_config = coalesce(provisioning_config, '{}'::jsonb) || jsonb_build_object(
      'version_report',
      jsonb_build_object(
        'current_version', p_current_version,
        'update_result', p_update_result,
        'reported_at', now(),
        'details', coalesce(p_details, '{}'::jsonb)
      )
    ),
    updated_at = now()
  where id = v_installation.id;

  return jsonb_build_object(
    'installation_id', v_installation.id,
    'current_version', p_current_version,
    'update_status', case
      when p_update_result = 'success' then 'updated'
      when p_update_result = 'failure' then 'failed'
      else v_installation.update_status
    end
  );
end;
$$;

revoke execute on function public.record_installation_version_report(text, text, text, jsonb) from public;
grant execute on function public.record_installation_version_report(text, text, text, jsonb) to anon;
