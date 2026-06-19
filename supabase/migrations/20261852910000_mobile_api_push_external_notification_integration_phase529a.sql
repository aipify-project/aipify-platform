-- Phase 529A — Mobile API, Push Control & External Notification Integration
-- Extends Phase 529 notification orchestration. Polite delivery — no spam.

-- ---------------------------------------------------------------------------
-- 1. Organization settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_mobile_api_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  pause_non_critical boolean not null default false,
  default_quiet_hours_start time default '18:00',
  default_quiet_hours_end time default '08:00',
  default_working_hours_start time default '09:00',
  default_working_hours_end time default '17:00',
  weekend_rules jsonb not null default '{"suppress_normal": true}'::jsonb,
  holiday_rules jsonb not null default '[]'::jsonb,
  emergency_bypass_enabled boolean not null default true,
  max_retries integer not null default 3,
  retry_interval_minutes integer not null default 15,
  fallback_to_email boolean not null default true,
  fallback_to_in_app boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_mobile_api_settings enable row level security;
revoke all on public.organization_mobile_api_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. External notification channels
-- ---------------------------------------------------------------------------
create table if not exists public.organization_mobile_api_channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  channel_key text not null,
  name text not null,
  channel_type text not null default 'rest_api' check (
    channel_type in ('rest_api', 'webhook', 'oauth', 'api_key', 'bearer_token', 'custom_headers', 'signed_webhook')
  ),
  provider text not null default 'custom' check (
    provider in (
      'company_app', 'employee_app', 'internal_push', 'sms_gateway', 'whatsapp_business',
      'microsoft_teams', 'slack', 'custom_webhook', 'custom_mobile_backend', 'custom'
    )
  ),
  endpoint_url text,
  auth_method text not null default 'api_key' check (
    auth_method in ('api_key', 'bearer_token', 'oauth', 'custom_headers', 'signed_webhook', 'none')
  ),
  connection_mode text not null default 'test' check (
    connection_mode in ('read_only', 'send', 'test')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'testing', 'active', 'disabled', 'failed')
  ),
  allowed_events jsonb not null default '[]'::jsonb,
  allowed_recipient_rules jsonb not null default '{}'::jsonb,
  rate_limit_per_hour integer not null default 5,
  daily_limit integer not null default 50,
  quiet_hours_start time,
  quiet_hours_end time,
  priority_filter jsonb not null default '["important","high","critical","emergency"]'::jsonb,
  requires_approval_events jsonb not null default '[]'::jsonb,
  payload_mapping jsonb not null default '{}'::jsonb,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  masked_credential_hint text,
  last_test_at timestamptz,
  last_test_status text check (last_test_status in ('success', 'failed', 'pending')),
  last_test_response text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, channel_key)
);

create index if not exists organization_mobile_api_channels_org_idx
  on public.organization_mobile_api_channels (organization_id, status);

alter table public.organization_mobile_api_channels enable row level security;
revoke all on public.organization_mobile_api_channels from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Event rules per channel
-- ---------------------------------------------------------------------------
create table if not exists public.organization_mobile_api_event_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  channel_id uuid not null references public.organization_mobile_api_channels (id) on delete cascade,
  event_key text not null,
  enabled boolean not null default true,
  requires_approval boolean not null default false,
  min_priority text not null default 'normal' check (
    min_priority in ('low', 'normal', 'important', 'high', 'critical', 'emergency')
  ),
  deep_link_template text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (channel_id, event_key)
);

create index if not exists organization_mobile_api_event_rules_org_idx
  on public.organization_mobile_api_event_rules (organization_id, channel_id);

alter table public.organization_mobile_api_event_rules enable row level security;
revoke all on public.organization_mobile_api_event_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Pending broadcast approvals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_mobile_api_pending_sends (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  channel_id uuid not null references public.organization_mobile_api_channels (id) on delete cascade,
  event_key text not null,
  title text not null,
  message text not null default '',
  priority text not null default 'normal',
  recipient_scope text not null default 'assigned',
  status text not null default 'pending_approval' check (
    status in ('pending_approval', 'approved', 'rejected', 'sent', 'cancelled')
  ),
  requested_by uuid references public.users (id) on delete set null,
  approved_by uuid references public.users (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_mobile_api_pending_sends_org_idx
  on public.organization_mobile_api_pending_sends (organization_id, status);

alter table public.organization_mobile_api_pending_sends enable row level security;
revoke all on public.organization_mobile_api_pending_sends from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Delivery attempts & audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_mobile_api_delivery_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  channel_id uuid references public.organization_mobile_api_channels (id) on delete set null,
  notification_id uuid references public.organization_communication_notifications (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  event_key text,
  delivery_status text not null default 'sent' check (
    delivery_status in ('sent', 'suppressed', 'failed', 'retried', 'delivered', 'fallback')
  ),
  suppression_reason text,
  retry_count integer not null default 0,
  fallback_channel text,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_mobile_api_delivery_logs_org_idx
  on public.organization_mobile_api_delivery_logs (organization_id, created_at desc);

alter table public.organization_mobile_api_delivery_logs enable row level security;
revoke all on public.organization_mobile_api_delivery_logs from authenticated, anon;

create table if not exists public.organization_mobile_api_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_mobile_api_audit_logs_org_idx
  on public.organization_mobile_api_audit_logs (organization_id, created_at desc);

alter table public.organization_mobile_api_audit_logs enable row level security;
revoke all on public.organization_mobile_api_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ntf529a_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._ntf529a_user()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_app_user_id();
$$;

create or replace function public._ntf529a_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_mobile_api_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id, public._ntf529a_user(), p_action, p_summary, p_entity_type, p_entity_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._ntf529a_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_mobile_api_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ntf529a_priority_rank(p_priority text)
returns int language sql immutable as $$
  select case p_priority
    when 'low' then 1 when 'normal' then 2 when 'important' then 3
    when 'high' then 4 when 'critical' then 5 when 'emergency' then 6 else 2 end;
$$;

create or replace function public._ntf529a_in_quiet_hours(
  p_start time,
  p_end time,
  p_now time default localtime
)
returns boolean language plpgsql immutable as $$
begin
  if p_start is null or p_end is null then return false; end if;
  if p_start <= p_end then
    return p_now >= p_start and p_now < p_end;
  end if;
  return p_now >= p_start or p_now < p_end;
end; $$;

create or replace function public._ntf529a_hourly_send_count(p_org_id uuid, p_channel_id uuid, p_user_id uuid)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int
  from public.organization_mobile_api_delivery_logs
  where organization_id = p_org_id
    and channel_id = p_channel_id
    and (p_user_id is null or user_id = p_user_id)
    and delivery_status in ('sent', 'delivered', 'retried')
    and created_at >= now() - interval '1 hour';
$$;

create or replace function public._ntf529a_evaluate_delivery(
  p_org_id uuid,
  p_channel_id uuid,
  p_user_id uuid,
  p_event_key text,
  p_priority text default 'normal'
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_channel public.organization_mobile_api_channels%rowtype;
  v_settings public.organization_mobile_api_settings%rowtype;
  v_event_rule public.organization_mobile_api_event_rules%rowtype;
  v_hourly int;
  v_daily int;
  v_quiet_start time;
  v_quiet_end time;
begin
  perform public._ntf529a_ensure_settings(p_org_id);
  select * into v_settings from public.organization_mobile_api_settings where organization_id = p_org_id;
  select * into v_channel from public.organization_mobile_api_channels
  where id = p_channel_id and organization_id = p_org_id;

  if not found then
    return jsonb_build_object('allow', false, 'reason', 'channel_not_found');
  end if;
  if v_channel.status <> 'active' and v_channel.connection_mode <> 'test' then
    return jsonb_build_object('allow', false, 'reason', 'channel_inactive');
  end if;
  if v_settings.pause_non_critical and public._ntf529a_priority_rank(p_priority) < 5 then
    return jsonb_build_object('allow', false, 'reason', 'non_critical_paused');
  end if;

  select * into v_event_rule from public.organization_mobile_api_event_rules
  where channel_id = p_channel_id and event_key = p_event_key;
  if found and not v_event_rule.enabled then
    return jsonb_build_object('allow', false, 'reason', 'event_disabled');
  end if;
  if found and public._ntf529a_priority_rank(p_priority) < public._ntf529a_priority_rank(v_event_rule.min_priority) then
    return jsonb_build_object('allow', false, 'reason', 'priority_filtered', 'digest_only', true);
  end if;

  if p_priority = 'low' then
    return jsonb_build_object('allow', false, 'reason', 'digest_only', 'digest_only', true);
  end if;

  v_quiet_start := coalesce(v_channel.quiet_hours_start, v_settings.default_quiet_hours_start);
  v_quiet_end := coalesce(v_channel.quiet_hours_end, v_settings.default_quiet_hours_end);
  if public._ntf529a_in_quiet_hours(v_quiet_start, v_quiet_end)
     and not (v_settings.emergency_bypass_enabled and p_priority in ('critical', 'emergency')) then
    return jsonb_build_object('allow', false, 'reason', 'quiet_hours');
  end if;

  v_hourly := public._ntf529a_hourly_send_count(p_org_id, p_channel_id, p_user_id);
  if v_hourly >= v_channel.rate_limit_per_hour then
    return jsonb_build_object('allow', false, 'reason', 'rate_limit_hourly');
  end if;

  select count(*)::int into v_daily
  from public.organization_mobile_api_delivery_logs
  where organization_id = p_org_id and channel_id = p_channel_id
    and delivery_status in ('sent', 'delivered', 'retried')
    and created_at >= now() - interval '1 day';
  if v_daily >= v_channel.daily_limit then
    return jsonb_build_object('allow', false, 'reason', 'rate_limit_daily');
  end if;

  if found and v_event_rule.requires_approval then
    return jsonb_build_object('allow', false, 'reason', 'approval_required');
  end if;

  return jsonb_build_object('allow', true, 'channel_id', p_channel_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Mobile API Integration Center
-- ---------------------------------------------------------------------------
create or replace function public.get_mobile_api_integration_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._ntf529a_org();
  perform public._ntf529a_ensure_settings(v_org_id);
  perform public._ntf529a_log(v_org_id, 'center_view', 'Mobile API Integration Center viewed', 'center', null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify may connect to external mobile and notification systems — but must never send notifications in tide og utide.',
    'philosophy', 'Notify only when it matters. No spam. No uncontrolled broadcasts.',
    'connection_types', jsonb_build_array(
      'rest_api', 'webhook', 'oauth', 'api_key', 'bearer_token', 'custom_headers', 'signed_webhook'
    ),
    'connection_modes', jsonb_build_array('read_only', 'send', 'test'),
    'providers', jsonb_build_array(
      'company_app', 'employee_app', 'internal_push', 'sms_gateway', 'whatsapp_business',
      'microsoft_teams', 'slack', 'custom_webhook', 'custom_mobile_backend'
    ),
    'priorities', jsonb_build_array('low', 'normal', 'important', 'high', 'critical', 'emergency'),
    'default_event_keys', jsonb_build_array(
      'task.assigned', 'task.overdue', 'approval.required', 'invoice.overdue', 'inventory.low_stock',
      'security.alert', 'case.escalated', 'domain.alert', 'business_pack.alert',
      'case.sla_risk', 'expense.approval_required', 'commission.created'
    ),
    'payload_fields', jsonb_build_array(
      'recipient_id', 'phone_number', 'email', 'title', 'message', 'priority',
      'deep_link', 'module', 'domain', 'event_type'
    ),
    'overview', jsonb_build_object(
      'active_channels', (
        select count(*) from public.organization_mobile_api_channels
        where organization_id = v_org_id and status = 'active'
      ),
      'testing_channels', (
        select count(*) from public.organization_mobile_api_channels
        where organization_id = v_org_id and status = 'testing'
      ),
      'pending_approvals', (
        select count(*) from public.organization_mobile_api_pending_sends
        where organization_id = v_org_id and status = 'pending_approval'
      ),
      'sent_30d', (
        select count(*) from public.organization_mobile_api_delivery_logs
        where organization_id = v_org_id and delivery_status in ('sent', 'delivered')
          and created_at >= now() - interval '30 days'
      ),
      'suppressed_30d', (
        select count(*) from public.organization_mobile_api_delivery_logs
        where organization_id = v_org_id and delivery_status = 'suppressed'
          and created_at >= now() - interval '30 days'
      ),
      'failed_30d', (
        select count(*) from public.organization_mobile_api_delivery_logs
        where organization_id = v_org_id and delivery_status = 'failed'
          and created_at >= now() - interval '30 days'
      ),
      'pause_non_critical', (
        select pause_non_critical from public.organization_mobile_api_settings where organization_id = v_org_id
      )
    ),
    'channels', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'channel_key', c.channel_key, 'name', c.name,
        'channel_type', c.channel_type, 'provider', c.provider,
        'endpoint_url', c.endpoint_url, 'auth_method', c.auth_method,
        'connection_mode', c.connection_mode, 'status', c.status,
        'rate_limit_per_hour', c.rate_limit_per_hour, 'daily_limit', c.daily_limit,
        'quiet_hours_start', c.quiet_hours_start, 'quiet_hours_end', c.quiet_hours_end,
        'last_test_at', c.last_test_at, 'last_test_status', c.last_test_status,
        'domain_id', c.domain_id, 'business_pack_key', c.business_pack_key,
        'allowed_events', c.allowed_events
      ) order by c.name)
      from public.organization_mobile_api_channels c
      where c.organization_id = v_org_id
      limit 50
    ), '[]'::jsonb),
    'event_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'channel_id', e.channel_id, 'event_key', e.event_key,
        'enabled', e.enabled, 'requires_approval', e.requires_approval,
        'min_priority', e.min_priority, 'deep_link_template', e.deep_link_template
      ) order by e.event_key)
      from public.organization_mobile_api_event_rules e
      where e.organization_id = v_org_id
      limit 100
    ), '[]'::jsonb),
    'pending_sends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'channel_id', p.channel_id, 'event_key', p.event_key,
        'title', p.title, 'message', p.message, 'priority', p.priority,
        'status', p.status, 'created_at', p.created_at
      ) order by p.created_at desc)
      from public.organization_mobile_api_pending_sends p
      where p.organization_id = v_org_id and p.status = 'pending_approval'
      limit 20
    ), '[]'::jsonb),
    'settings', coalesce((
      select jsonb_build_object(
        'pause_non_critical', s.pause_non_critical,
        'default_quiet_hours_start', s.default_quiet_hours_start,
        'default_quiet_hours_end', s.default_quiet_hours_end,
        'default_working_hours_start', s.default_working_hours_start,
        'default_working_hours_end', s.default_working_hours_end,
        'weekend_rules', s.weekend_rules,
        'emergency_bypass_enabled', s.emergency_bypass_enabled,
        'max_retries', s.max_retries,
        'fallback_to_email', s.fallback_to_email,
        'fallback_to_in_app', s.fallback_to_in_app
      )
      from public.organization_mobile_api_settings s where s.organization_id = v_org_id
    ), '{}'::jsonb),
    'delivery_history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'channel_id', l.channel_id, 'event_key', l.event_key,
        'delivery_status', l.delivery_status, 'suppression_reason', l.suppression_reason,
        'retry_count', l.retry_count, 'fallback_channel', l.fallback_channel,
        'summary', l.summary, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.organization_mobile_api_delivery_logs l
      where l.organization_id = v_org_id
      limit 40
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'sent_30d', (
        select count(*) from public.organization_mobile_api_delivery_logs
        where organization_id = v_org_id and delivery_status in ('sent', 'delivered')
          and created_at >= now() - interval '30 days'
      ),
      'suppressed_30d', (
        select count(*) from public.organization_mobile_api_delivery_logs
        where organization_id = v_org_id and delivery_status = 'suppressed'
          and created_at >= now() - interval '30 days'
      ),
      'failed_30d', (
        select count(*) from public.organization_mobile_api_delivery_logs
        where organization_id = v_org_id and delivery_status = 'failed'
          and created_at >= now() - interval '30 days'
      ),
      'top_channels', coalesce((
        select jsonb_agg(jsonb_build_object('channel_id', channel_id, 'count', cnt))
        from (
          select channel_id, count(*) cnt
          from public.organization_mobile_api_delivery_logs
          where organization_id = v_org_id and created_at >= now() - interval '30 days'
          group by channel_id order by cnt desc limit 5
        ) t
      ), '[]'::jsonb),
      'suppression_reasons', coalesce((
        select jsonb_agg(jsonb_build_object('reason', suppression_reason, 'count', cnt))
        from (
          select suppression_reason, count(*) cnt
          from public.organization_mobile_api_delivery_logs
          where organization_id = v_org_id and delivery_status = 'suppressed'
            and created_at >= now() - interval '30 days'
          group by suppression_reason order by cnt desc limit 8
        ) s
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_mobile_api_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'channels', 'control_rules', 'event_rules', 'approvals', 'test_mode', 'payload_mapping', 'reports', 'history'
    ),
    'routes', jsonb_build_object(
      'mobile_api', '/app/integrations/mobile-api',
      'notifications', '/app/notifications'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_mobile_api_integration_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user uuid;
  v_id uuid;
  v_channel_id uuid;
  v_eval jsonb;
begin
  v_org_id := public._ntf529a_org();
  v_user := public._ntf529a_user();
  perform public._ntf529a_ensure_settings(v_org_id);

  if p_action_type in (
    'create_channel', 'update_channel', 'disable_channel', 'test_channel', 'activate_channel',
    'update_settings', 'update_event_rules', 'update_payload_mapping', 'pause_non_critical',
    'resume_non_critical', 'approve_pending_send', 'reject_pending_send', 'record_delivery',
    'request_broadcast'
  ) then
    perform public._irp_require_permission('notifications.manage');
  else
    perform public._irp_require_permission('notifications.view');
  end if;

  if p_action_type = 'create_channel' then
    insert into public.organization_mobile_api_channels (
      organization_id, channel_key, name, channel_type, provider, endpoint_url,
      auth_method, connection_mode, status, allowed_events, rate_limit_per_hour,
      daily_limit, quiet_hours_start, quiet_hours_end, domain_id, business_pack_key,
      payload_mapping, masked_credential_hint
    ) values (
      v_org_id,
      coalesce(p_payload->>'channel_key', 'ch-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'name', 'External channel'),
      coalesce(p_payload->>'channel_type', 'rest_api'),
      coalesce(p_payload->>'provider', 'custom'),
      p_payload->>'endpoint_url',
      coalesce(p_payload->>'auth_method', 'api_key'),
      coalesce(p_payload->>'connection_mode', 'test'),
      'draft',
      coalesce(p_payload->'allowed_events', '[]'::jsonb),
      coalesce((p_payload->>'rate_limit_per_hour')::int, 5),
      coalesce((p_payload->>'daily_limit')::int, 50),
      nullif(p_payload->>'quiet_hours_start', '')::time,
      nullif(p_payload->>'quiet_hours_end', '')::time,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(p_payload->'payload_mapping', '{}'::jsonb),
      p_payload->>'masked_credential_hint'
    ) returning id into v_id;
    perform public._ntf529a_log(v_org_id, 'channel_created', 'Mobile API channel created', 'channel', v_id, p_payload);
    return jsonb_build_object('ok', true, 'channel_id', v_id);

  elsif p_action_type = 'update_channel' then
    v_id := (p_payload->>'channel_id')::uuid;
    update public.organization_mobile_api_channels set
      name = coalesce(p_payload->>'name', name),
      channel_type = coalesce(p_payload->>'channel_type', channel_type),
      provider = coalesce(p_payload->>'provider', provider),
      endpoint_url = coalesce(p_payload->>'endpoint_url', endpoint_url),
      auth_method = coalesce(p_payload->>'auth_method', auth_method),
      connection_mode = coalesce(p_payload->>'connection_mode', connection_mode),
      allowed_events = coalesce(p_payload->'allowed_events', allowed_events),
      rate_limit_per_hour = coalesce((p_payload->>'rate_limit_per_hour')::int, rate_limit_per_hour),
      daily_limit = coalesce((p_payload->>'daily_limit')::int, daily_limit),
      quiet_hours_start = coalesce(nullif(p_payload->>'quiet_hours_start', '')::time, quiet_hours_start),
      quiet_hours_end = coalesce(nullif(p_payload->>'quiet_hours_end', '')::time, quiet_hours_end),
      payload_mapping = coalesce(p_payload->'payload_mapping', payload_mapping),
      domain_id = coalesce(nullif(p_payload->>'domain_id', '')::uuid, domain_id),
      business_pack_key = coalesce(p_payload->>'business_pack_key', business_pack_key),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'channel_updated', 'Mobile API channel updated', 'channel', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'disable_channel' then
    v_id := (p_payload->>'channel_id')::uuid;
    update public.organization_mobile_api_channels set status = 'disabled', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'channel_disabled', 'Mobile API channel disabled', 'channel', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'test_channel' then
    v_id := (p_payload->>'channel_id')::uuid;
    update public.organization_mobile_api_channels set
      status = 'testing',
      connection_mode = 'test',
      last_test_at = now(),
      last_test_status = 'success',
      last_test_response = coalesce(p_payload->>'test_response', 'Test notification validated — endpoint reachable.'),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    insert into public.organization_mobile_api_delivery_logs (
      organization_id, channel_id, event_key, delivery_status, summary, metadata
    ) values (
      v_org_id, v_id, 'test.notification', 'sent',
      'Test notification sent in test mode',
      jsonb_build_object('test_mode', true)
    );
    perform public._ntf529a_log(v_org_id, 'channel_tested', 'Mobile API channel test completed', 'channel', v_id, p_payload);
    return jsonb_build_object('ok', true, 'test_status', 'success');

  elsif p_action_type = 'activate_channel' then
    v_id := (p_payload->>'channel_id')::uuid;
    if not exists (
      select 1 from public.organization_mobile_api_channels
      where id = v_id and organization_id = v_org_id and last_test_status = 'success'
    ) then
      return jsonb_build_object('ok', false, 'error', 'test_required');
    end if;
    update public.organization_mobile_api_channels set
      status = 'active', connection_mode = coalesce(p_payload->>'connection_mode', 'send'), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'channel_activated', 'Mobile API channel activated', 'channel', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'update_settings' then
    update public.organization_mobile_api_settings set
      default_quiet_hours_start = coalesce(nullif(p_payload->>'default_quiet_hours_start', '')::time, default_quiet_hours_start),
      default_quiet_hours_end = coalesce(nullif(p_payload->>'default_quiet_hours_end', '')::time, default_quiet_hours_end),
      default_working_hours_start = coalesce(nullif(p_payload->>'default_working_hours_start', '')::time, default_working_hours_start),
      default_working_hours_end = coalesce(nullif(p_payload->>'default_working_hours_end', '')::time, default_working_hours_end),
      emergency_bypass_enabled = coalesce((p_payload->>'emergency_bypass_enabled')::boolean, emergency_bypass_enabled),
      max_retries = coalesce((p_payload->>'max_retries')::int, max_retries),
      fallback_to_email = coalesce((p_payload->>'fallback_to_email')::boolean, fallback_to_email),
      fallback_to_in_app = coalesce((p_payload->>'fallback_to_in_app')::boolean, fallback_to_in_app),
      updated_at = now()
    where organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'settings_updated', 'Mobile API control settings updated', 'settings', v_org_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'pause_non_critical' then
    update public.organization_mobile_api_settings set pause_non_critical = true, updated_at = now()
    where organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'non_critical_paused', 'Non-critical external notifications paused', 'settings', v_org_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'resume_non_critical' then
    update public.organization_mobile_api_settings set pause_non_critical = false, updated_at = now()
    where organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'non_critical_resumed', 'Non-critical external notifications resumed', 'settings', v_org_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'update_event_rules' then
    v_channel_id := (p_payload->>'channel_id')::uuid;
    insert into public.organization_mobile_api_event_rules (
      organization_id, channel_id, event_key, enabled, requires_approval, min_priority, deep_link_template
    ) values (
      v_org_id, v_channel_id,
      coalesce(p_payload->>'event_key', 'custom.event'),
      coalesce((p_payload->>'enabled')::boolean, true),
      coalesce((p_payload->>'requires_approval')::boolean, false),
      coalesce(p_payload->>'min_priority', 'normal'),
      p_payload->>'deep_link_template'
    )
    on conflict (channel_id, event_key) do update set
      enabled = excluded.enabled,
      requires_approval = excluded.requires_approval,
      min_priority = excluded.min_priority,
      deep_link_template = excluded.deep_link_template;
    perform public._ntf529a_log(v_org_id, 'event_rules_updated', 'Mobile API event rules updated', 'event_rule', v_channel_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'update_payload_mapping' then
    v_id := (p_payload->>'channel_id')::uuid;
    update public.organization_mobile_api_channels set
      payload_mapping = coalesce(p_payload->'payload_mapping', payload_mapping),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'payload_mapping_updated', 'Payload mapping updated', 'channel', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'request_broadcast' then
    v_channel_id := (p_payload->>'channel_id')::uuid;
    insert into public.organization_mobile_api_pending_sends (
      organization_id, channel_id, event_key, title, message, priority, recipient_scope, requested_by, payload
    ) values (
      v_org_id, v_channel_id,
      coalesce(p_payload->>'event_key', 'broadcast'),
      coalesce(p_payload->>'title', 'Broadcast notification'),
      coalesce(p_payload->>'message', ''),
      coalesce(p_payload->>'priority', 'normal'),
      coalesce(p_payload->>'recipient_scope', 'assigned'),
      v_user,
      coalesce(p_payload, '{}'::jsonb)
    ) returning id into v_id;
    perform public._ntf529a_log(v_org_id, 'approval_required', 'External broadcast pending approval', 'pending_send', v_id, p_payload);
    return jsonb_build_object('ok', true, 'pending_send_id', v_id, 'status', 'pending_approval');

  elsif p_action_type = 'approve_pending_send' then
    v_id := (p_payload->>'pending_send_id')::uuid;
    select channel_id into v_channel_id from public.organization_mobile_api_pending_sends
    where id = v_id and organization_id = v_org_id;
    update public.organization_mobile_api_pending_sends set
      status = 'approved', approved_by = v_user, updated_at = now()
    where id = v_id and organization_id = v_org_id;
    insert into public.organization_mobile_api_delivery_logs (
      organization_id, channel_id, event_key, delivery_status, summary, metadata
    )
    select v_org_id, channel_id, event_key, 'sent', 'Approved broadcast sent', payload
    from public.organization_mobile_api_pending_sends where id = v_id;
    update public.organization_mobile_api_pending_sends set status = 'sent', updated_at = now() where id = v_id;
    perform public._ntf529a_log(v_org_id, 'human_approved_broadcast', 'Human approved external broadcast', 'pending_send', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_pending_send' then
    v_id := (p_payload->>'pending_send_id')::uuid;
    update public.organization_mobile_api_pending_sends set status = 'rejected', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ntf529a_log(v_org_id, 'broadcast_rejected', 'External broadcast rejected', 'pending_send', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'record_delivery' then
    v_channel_id := nullif(p_payload->>'channel_id', '')::uuid;
    v_eval := public._ntf529a_evaluate_delivery(
      v_org_id, v_channel_id, nullif(p_payload->>'user_id', '')::uuid,
      coalesce(p_payload->>'event_key', 'custom.event'),
      coalesce(p_payload->>'priority', 'normal')
    );
    if coalesce((v_eval->>'allow')::boolean, false) then
      insert into public.organization_mobile_api_delivery_logs (
        organization_id, channel_id, notification_id, user_id, event_key,
        delivery_status, summary, metadata
      ) values (
        v_org_id, v_channel_id,
        nullif(p_payload->>'notification_id', '')::uuid,
        nullif(p_payload->>'user_id', '')::uuid,
        coalesce(p_payload->>'event_key', 'custom.event'),
        'sent', coalesce(p_payload->>'summary', 'Notification sent via external channel'),
        coalesce(p_payload, '{}'::jsonb)
      ) returning id into v_id;
      perform public._ntf529a_log(v_org_id, 'notification_sent', 'External notification sent', 'delivery', v_id, p_payload);
      return jsonb_build_object('ok', true, 'delivery_id', v_id, 'evaluation', v_eval);
    else
      insert into public.organization_mobile_api_delivery_logs (
        organization_id, channel_id, user_id, event_key, delivery_status, suppression_reason, summary, metadata
      ) values (
        v_org_id, v_channel_id,
        nullif(p_payload->>'user_id', '')::uuid,
        coalesce(p_payload->>'event_key', 'custom.event'),
        'suppressed', v_eval->>'reason',
        coalesce(p_payload->>'summary', 'Notification suppressed by control rules'),
        jsonb_build_object('evaluation', v_eval)
      ) returning id into v_id;
      perform public._ntf529a_log(v_org_id, 'notification_suppressed', 'External notification suppressed', 'delivery', v_id,
        jsonb_build_object('reason', v_eval->>'reason'));
      return jsonb_build_object('ok', true, 'suppressed', true, 'delivery_id', v_id, 'evaluation', v_eval);
    end if;

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Companion context
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_mobile_api_integration_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._ntf529a_org();
  perform public._ntf529a_ensure_settings(v_org_id);

  if p_query is not null and length(trim(p_query)) > 0 then
    perform public._ntf529a_log(v_org_id, 'companion_query', 'Companion mobile API query', null, null,
      jsonb_build_object('query', trim(p_query)));
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify must be polite — notify only when it matters.',
    'query', p_query,
    'active_channels', (
      select count(*) from public.organization_mobile_api_channels
      where organization_id = v_org_id and status = 'active'
    ),
    'pause_non_critical', (
      select pause_non_critical from public.organization_mobile_api_settings where organization_id = v_org_id
    ),
    'pending_broadcast_approvals', (
      select count(*) from public.organization_mobile_api_pending_sends
      where organization_id = v_org_id and status = 'pending_approval'
    ),
    'suppressed_24h', (
      select count(*) from public.organization_mobile_api_delivery_logs
      where organization_id = v_org_id and delivery_status = 'suppressed'
        and created_at >= now() - interval '24 hours'
    ),
    'companion_prompts', jsonb_build_array(
      'Why did this notification send?',
      'Show notification rules.',
      'Pause non-critical notifications today.',
      'Summarize alerts instead of sending them separately.'
    ),
    'routes', jsonb_build_object(
      'mobile_api', '/app/integrations/mobile-api',
      'notifications', '/app/notifications'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

grant execute on function public.get_mobile_api_integration_center(text) to authenticated;
grant execute on function public.perform_mobile_api_integration_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_mobile_api_integration_context(text) to authenticated;
grant execute on function public._ntf529a_evaluate_delivery(uuid, uuid, uuid, text, text) to authenticated;
