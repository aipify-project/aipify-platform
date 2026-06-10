-- Phase 13: Aipify Presence System (foundation)
-- Activity transparency, presence states, history, and settings

-- ---------------------------------------------------------------------------
-- presence_events
-- ---------------------------------------------------------------------------
create table if not exists public.presence_events (
  id uuid primary key default gen_random_uuid(),
  surface text not null check (surface in ('platform', 'customer', 'pilot', 'internal')),
  tenant_id uuid references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'monitoring', 'analysis', 'automation', 'learning', 'healing',
      'approval', 'critical', 'recommendation', 'summary'
    )
  ),
  title text not null,
  detail text,
  status text not null default 'completed' check (
    status in ('in_progress', 'completed', 'failed', 'pending_approval')
  ),
  risk_level text check (risk_level in ('low', 'medium', 'high', 'critical')),
  succeeded boolean,
  required_approval boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists presence_events_surface_idx
  on public.presence_events (surface, created_at desc);
create index if not exists presence_events_tenant_idx
  on public.presence_events (tenant_id, created_at desc);

-- ---------------------------------------------------------------------------
-- presence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.presence_settings (
  id uuid primary key default gen_random_uuid(),
  surface text not null check (surface in ('platform', 'customer')),
  tenant_id uuid references public.customers (id) on delete cascade,
  animation_intensity text not null default 'normal' check (
    animation_intensity in ('subtle', 'normal', 'enhanced')
  ),
  presence_visible boolean not null default true,
  executive_summaries boolean not null default true,
  self_healing_notifications boolean not null default true,
  approval_notifications boolean not null default true,
  sound_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (surface, tenant_id)
);

alter table public.presence_events enable row level security;
alter table public.presence_settings enable row level security;

revoke all on public.presence_events from authenticated, anon;
revoke all on public.presence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.record_presence_event(
  p_surface text,
  p_event_type text,
  p_title text,
  p_detail text default null,
  p_status text default 'completed',
  p_risk_level text default null,
  p_succeeded boolean default null,
  p_required_approval boolean default false,
  p_tenant_id uuid default null,
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
  insert into public.presence_events (
    surface, tenant_id, event_type, title, detail, status,
    risk_level, succeeded, required_approval, metadata
  )
  values (
    p_surface, p_tenant_id, p_event_type, p_title, p_detail, p_status,
    p_risk_level, p_succeeded, p_required_approval, p_metadata
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_presence_event(
  text, text, text, text, text, text, boolean, boolean, uuid, jsonb
) to authenticated;

create or replace function public.derive_presence_state(p_surface text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_critical integer := 0;
  v_approval integer := 0;
  v_healing integer := 0;
  v_learning integer := 0;
  v_working integer := 0;
begin
  if p_surface = 'platform' and not public.is_platform_admin() then
    return 'standby';
  end if;

  select count(*) into v_critical
  from public.presence_events
  where surface = p_surface
    and event_type = 'critical'
    and created_at >= now() - interval '2 hours'
    and status in ('in_progress', 'pending_approval');

  if v_critical > 0 then return 'critical_attention'; end if;

  select count(*) into v_approval
  from public.intelligence_patterns
  where approval_status = 'pending';

  v_approval := v_approval + coalesce((
    select count(*) from public.ai_self_healing_executions
    where execution_result = 'pending_approval'
      and executed_at >= now() - interval '24 hours'
  ), 0);

  if v_approval > 0 then return 'human_approval_required'; end if;

  select count(*) into v_healing
  from public.ai_self_healing_executions
  where executed_at >= now() - interval '15 minutes'
    and execution_result in ('pending_approval', 'success');

  if v_healing > 0 then return 'self_healing'; end if;

  select count(*) into v_learning
  from public.ai_learning_events
  where created_at >= now() - interval '1 hour';

  if v_learning > 0 then return 'learning'; end if;

  select count(*) into v_working
  from public.platform_automations
  where status = 'active'
    and last_run_at >= now() - interval '30 minutes';

  if v_working > 0 then return 'working'; end if;

  if exists (
    select 1 from public.brain_metrics
    where recorded_at >= now() - interval '10 minutes'
  ) then return 'analysing'; end if;

  return 'standby';
end;
$$;

create or replace function public.get_presence_center_bundle(p_surface text default 'platform')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_state text;
  v_activity jsonb;
  v_pending integer;
  v_healing_today integer;
  v_learning_today integer;
  v_automations integer;
  v_health integer;
begin
  if auth.uid() is null then
    raise exception 'Not authorized';
  end if;

  if p_surface = 'platform' and not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  v_state := public.derive_presence_state(p_surface);

  v_activity := case v_state
    when 'self_healing' then (
      select jsonb_build_object(
        'title', coalesce(sh.healing_action, 'Repairing operational issue'),
        'status', 'in_progress',
        'eta_seconds', 10,
        'risk_level', coalesce(sh.risk_level, 'low')
      )
      from public.ai_self_healing_executions sh
      order by sh.executed_at desc
      limit 1
    )
    when 'working' then jsonb_build_object(
      'title', 'Executing scheduled automations',
      'status', 'in_progress',
      'eta_seconds', 30,
      'risk_level', 'low'
    )
    when 'human_approval_required' then jsonb_build_object(
      'title', 'Approval required for recommended action',
      'status', 'pending_approval',
      'eta_seconds', null,
      'risk_level', 'medium'
    )
    when 'critical_attention' then jsonb_build_object(
      'title', 'Critical issue requires immediate review',
      'status', 'in_progress',
      'eta_seconds', null,
      'risk_level', 'high'
    )
    when 'learning' then jsonb_build_object(
      'title', 'Learning from operational outcomes',
      'status', 'in_progress',
      'eta_seconds', null,
      'risk_level', 'low'
    )
    when 'analysing' then jsonb_build_object(
      'title', 'Analysing operational patterns',
      'status', 'in_progress',
      'eta_seconds', 20,
      'risk_level', 'low'
    )
    else jsonb_build_object(
      'title', 'Monitoring environment',
      'status', 'completed',
      'eta_seconds', null,
      'risk_level', 'low'
    )
  end;

  select count(*) into v_pending
  from public.intelligence_patterns where approval_status = 'pending';

  select count(*) into v_healing_today
  from public.ai_self_healing_executions
  where executed_at >= date_trunc('day', now());

  select count(*) into v_learning_today
  from public.ai_learning_events
  where created_at >= date_trunc('day', now());

  select count(*) into v_automations
  from public.platform_automations where status = 'active';

  v_health := coalesce((
    select automation_coverage from public.brain_metrics
    order by recorded_at desc limit 1
  ), 90);

  return jsonb_build_object(
    'state', v_state,
    'activity', coalesce(v_activity, '{}'::jsonb),
    'metrics', jsonb_build_object(
      'automations_running', v_automations,
      'learning_events_today', v_learning_today,
      'healing_events_today', v_healing_today,
      'pending_approvals', v_pending,
      'system_health_score', v_health
    ),
    'history', coalesce(
      (select jsonb_agg(row_to_json(pe.*) order by pe.created_at desc)
       from public.presence_events pe
       where pe.surface = p_surface
       limit 20),
      '[]'::jsonb
    ),
    'recommendations', coalesce(
      (select jsonb_agg(
        jsonb_build_object('id', gp.id, 'message', gp.pattern_title, 'confidence', gp.confidence_score)
        order by gp.confidence_score desc
      )
      from public.global_patterns gp where gp.active = true limit 5),
      '[]'::jsonb
    ),
    'executive_summary', (
      select 'Platform health at ' || coalesce(
        (select automation_coverage::text from public.brain_metrics order by recorded_at desc limit 1),
        '90'
      ) || '% automation coverage.'
    ),
    'settings', coalesce(
      (select to_jsonb(ps) from public.presence_settings ps
       where ps.surface = p_surface and ps.tenant_id is null),
      jsonb_build_object(
        'animation_intensity', 'normal',
        'presence_visible', true,
        'executive_summaries', true,
        'self_healing_notifications', true,
        'approval_notifications', true,
        'sound_enabled', false
      )
    )
  );
end;
$$;

grant execute on function public.get_presence_center_bundle(text) to authenticated;

create or replace function public.update_presence_settings(
  p_surface text,
  p_animation_intensity text default null,
  p_presence_visible boolean default null,
  p_executive_summaries boolean default null,
  p_self_healing_notifications boolean default null,
  p_approval_notifications boolean default null,
  p_sound_enabled boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authorized';
  end if;

  if p_surface = 'platform' and not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  insert into public.presence_settings (surface, tenant_id)
  values (p_surface, null)
  on conflict (surface, tenant_id) do nothing;

  update public.presence_settings
  set
    animation_intensity = coalesce(p_animation_intensity, animation_intensity),
    presence_visible = coalesce(p_presence_visible, presence_visible),
    executive_summaries = coalesce(p_executive_summaries, executive_summaries),
    self_healing_notifications = coalesce(p_self_healing_notifications, self_healing_notifications),
    approval_notifications = coalesce(p_approval_notifications, approval_notifications),
    sound_enabled = coalesce(p_sound_enabled, sound_enabled),
    updated_at = now()
  where surface = p_surface and tenant_id is null;

  return (select to_jsonb(ps) from public.presence_settings ps
          where ps.surface = p_surface and ps.tenant_id is null);
end;
$$;

grant execute on function public.update_presence_settings(text, text, boolean, boolean, boolean, boolean, boolean)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Seed presence history
-- ---------------------------------------------------------------------------
insert into public.presence_settings (surface, tenant_id)
values ('platform', null), ('customer', null)
on conflict (surface, tenant_id) do nothing;

insert into public.presence_events (surface, event_type, title, detail, status, risk_level, succeeded, required_approval, created_at)
values
  ('platform', 'monitoring', 'Health scan completed', 'Installation health scan finished successfully.', 'completed', 'low', true, false, now() - interval '3 hours 28 minutes'),
  ('platform', 'automation', 'Support AI resolved 3 cases', 'Automated support workflows completed.', 'completed', 'low', true, false, now() - interval '2 hours 15 minutes'),
  ('platform', 'healing', 'Webhook reconnected successfully', 'Retry webhook deliveries completed.', 'completed', 'low', true, false, now() - interval '1 hour 48 minutes'),
  ('platform', 'approval', 'Approval requested for automation update', 'Medium-risk healing action awaiting review.', 'pending_approval', 'medium', null, true, now() - interval '8 minutes'),
  ('platform', 'learning', 'Operational pattern discovered', 'Support tickets peak near trial expiration.', 'completed', 'low', true, false, now() - interval '45 minutes'),
  ('platform', 'summary', 'Executive summary prepared', 'Platform health and automation coverage updated.', 'completed', 'low', true, false, now() - interval '20 minutes');
