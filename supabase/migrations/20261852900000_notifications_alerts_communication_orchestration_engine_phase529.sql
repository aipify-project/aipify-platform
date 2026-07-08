-- Phase 529 — Notifications, Alerts & Communication Orchestration Engine
-- Extends Phase 509 (organization_communication_*). One communication layer.
-- The right information should reach the right person at the right time.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_notification_orchestration_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enable_digest_engine boolean not null default true,
  enable_executive_alerts boolean not null default true,
  enable_routing_rules boolean not null default true,
  enable_companion_alerts boolean not null default true,
  default_delivery_channel text not null default 'in_app' check (
    default_delivery_channel in ('in_app', 'email', 'mobile', 'desktop', 'browser')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_notification_orchestration_settings enable row level security;
revoke all on public.organization_notification_orchestration_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. User preferences
-- ---------------------------------------------------------------------------
create table if not exists public.organization_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  frequency text not null default 'instant' check (
    frequency in ('instant', 'hourly_digest', 'daily_digest', 'weekly_digest', 'critical_only', 'custom')
  ),
  channels jsonb not null default '["in_app"]'::jsonb,
  categories jsonb not null default '[]'::jsonb,
  language text not null default 'en',
  quiet_hours_start time,
  quiet_hours_end time,
  working_hours_start time default '09:00',
  working_hours_end time default '17:00',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_notification_preferences_org_user_idx
  on public.organization_notification_preferences (organization_id, user_id);

alter table public.organization_notification_preferences enable row level security;
revoke all on public.organization_notification_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Routing rules & digests
-- ---------------------------------------------------------------------------
create table if not exists public.organization_notification_routing_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  name text not null,
  description text not null default '',
  target_role text,
  target_department_id uuid references public.organization_departments (id) on delete set null,
  notification_type text not null default 'custom_alert',
  priority text not null default 'normal',
  delivery_channel text not null default 'in_app',
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, rule_key)
);

create index if not exists organization_notification_routing_rules_org_idx
  on public.organization_notification_routing_rules (organization_id, is_active);

alter table public.organization_notification_routing_rules enable row level security;
revoke all on public.organization_notification_routing_rules from authenticated, anon;

create table if not exists public.organization_notification_digests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  digest_number text,
  digest_type text not null check (
    digest_type in ('daily', 'weekly', 'executive', 'department', 'companion')
  ),
  user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  summary text not null default '',
  items jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, digest_number)
);

create index if not exists organization_notification_digests_org_idx
  on public.organization_notification_digests (organization_id, generated_at desc);

alter table public.organization_notification_digests enable row level security;
revoke all on public.organization_notification_digests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Executive alerts & delivery history
-- ---------------------------------------------------------------------------
create table if not exists public.organization_executive_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alert_number text,
  alert_type text not null check (
    alert_type in (
      'revenue_change', 'security_incident', 'large_opportunity', 'customer_risk',
      'contract_risk', 'system_health', 'operational_risk', 'custom'
    )
  ),
  priority text not null default 'high' check (
    priority in ('low', 'normal', 'important', 'high', 'critical', 'emergency')
  ),
  status text not null default 'active' check (
    status in ('active', 'acknowledged', 'resolved', 'archived')
  ),
  title text not null,
  summary text not null default '',
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, alert_number)
);

create index if not exists organization_executive_alerts_org_idx
  on public.organization_executive_alerts (organization_id, status, priority);

alter table public.organization_executive_alerts enable row level security;
revoke all on public.organization_executive_alerts from authenticated, anon;

create table if not exists public.organization_notification_delivery_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  notification_id uuid references public.organization_communication_notifications (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  delivery_channel text not null default 'in_app',
  delivery_status text not null default 'sent' check (
    delivery_status in ('sent', 'delivered', 'read', 'acted_upon', 'archived', 'failed')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_notification_delivery_logs_org_idx
  on public.organization_notification_delivery_logs (organization_id, created_at desc);

alter table public.organization_notification_delivery_logs enable row level security;
revoke all on public.organization_notification_delivery_logs from authenticated, anon;

create table if not exists public.organization_notification_orchestration_audit_logs (
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

create index if not exists organization_notification_orchestration_audit_org_idx
  on public.organization_notification_orchestration_audit_logs (organization_id, created_at desc);

alter table public.organization_notification_orchestration_audit_logs enable row level security;
revoke all on public.organization_notification_orchestration_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Extend Phase 509 notification enums
-- ---------------------------------------------------------------------------
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_communication_notifications'
      and column_name = 'notification_type'
  ) then
    alter table public.organization_communication_notifications
      add column notification_type text;

    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name = 'organization_communication_notifications'
        and column_name = 'category'
    ) then
      update public.organization_communication_notifications set notification_type = case category
        when 'support' then 'system'
        when 'approvals' then 'approval_required'
        when 'tasks' then 'task_assigned'
        when 'integrations' then 'domain_event'
        when 'governance' then 'system'
        when 'quality' then 'system'
        when 'onboarding' then 'employee_invited'
        when 'billing' then 'license_warning'
        when 'system_alerts' then 'system'
        else 'system'
      end;
    end if;

    update public.organization_communication_notifications
      set notification_type = 'system'
      where notification_type is null;

    alter table public.organization_communication_notifications
      alter column notification_type set default 'system';

    alter table public.organization_communication_notifications
      alter column notification_type set not null;
  end if;
end $$;

alter table public.organization_communication_notifications drop constraint if exists organization_communication_notifications_notification_type_check;
alter table public.organization_communication_notifications add constraint organization_communication_notifications_notification_type_check check (
  notification_type in (
    'task_assigned', 'task_due', 'task_overdue', 'task_updated', 'task_completed', 'task_escalated', 'task_blocked',
    'approval_required', 'approval_completed',
    'document_updated', 'knowledge_published', 'employee_invited', 'employee_suspended',
    'license_warning', 'subscription_warning', 'companion_alert', 'domain_event',
    'business_pack_event', 'message', 'announcement', 'system',
    'information', 'security_alert', 'verification_required', 'customer_alert', 'custom_alert',
    'security_login', 'security_device', 'security_permission', 'security_suspicious'
  )
);

alter table public.organization_communication_notifications drop constraint if exists organization_communication_notifications_priority_check;
alter table public.organization_communication_notifications add constraint organization_communication_notifications_priority_check check (
  priority in ('low', 'normal', 'important', 'high', 'critical', 'emergency')
);

alter table public.organization_communication_notifications drop constraint if exists organization_communication_notifications_status_check;
alter table public.organization_communication_notifications add constraint organization_communication_notifications_status_check check (
  status in (
    'pending', 'information', 'attention_required', 'completed', 'requires_approval', 'expired',
    'security_alert', 'verification_required', 'pending_action'
  )
);

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ntf529_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._ntf529_user()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_app_user_id();
$$;

create or replace function public._ntf529_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_notification_orchestration_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id, public._ntf529_user(), p_action, p_summary, p_entity_type, p_entity_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._ntf529_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._ntf529_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_notification_orchestration_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ntf529_ensure_preferences(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_notification_preferences (organization_id, user_id)
  values (p_org_id, p_user_id) on conflict (organization_id, user_id) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Notification Orchestration Center
-- ---------------------------------------------------------------------------
create or replace function public.get_notification_orchestration_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_approvals jsonb;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._ntf529_org();
  v_user_id := public._ntf529_user();
  perform public._ntf529_ensure_settings(v_org_id);
  perform public._ntf529_ensure_preferences(v_org_id, v_user_id);
  perform public._ntf529_log(v_org_id, 'center_view', 'Notification Center viewed', 'center', null,
    jsonb_build_object('section', p_section));

  v_approvals := coalesce(public._cme509_aggregate_approvals(v_org_id, 30), '[]'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', 'The right information should reach the right person at the right time.',
    'philosophy', 'Information creates awareness. Awareness creates action. Action creates results.',
    'notification_types', jsonb_build_array(
      'information', 'approval_required', 'task_assigned', 'task_overdue', 'system',
      'security_alert', 'verification_required', 'companion_alert', 'customer_alert',
      'business_pack_event', 'custom_alert'
    ),
    'priorities', jsonb_build_array('low', 'normal', 'important', 'high', 'critical', 'emergency'),
    'delivery_channels', jsonb_build_array('in_app', 'mobile', 'email', 'desktop', 'browser'),
    'overview', jsonb_build_object(
      'unread', (
        select count(*) from public.organization_communication_notifications
        where organization_id = v_org_id and user_id = v_user_id and read_at is null
      ),
      'critical', (
        select count(*) from public.organization_communication_notifications
        where organization_id = v_org_id and user_id = v_user_id
          and priority in ('critical', 'emergency') and read_at is null
      ),
      'attention_required', (
        select count(*) from public.organization_communication_notifications
        where organization_id = v_org_id and user_id = v_user_id
          and status in ('attention_required', 'requires_approval', 'pending_action') and read_at is null
      ),
      'pending_approvals', jsonb_array_length(v_approvals),
      'executive_alerts', (
        select count(*) from public.organization_executive_alerts
        where organization_id = v_org_id and status = 'active'
      ),
      'task_notifications', (
        select count(*) from public.organization_communication_notifications
        where organization_id = v_org_id and user_id = v_user_id
          and notification_type like 'task_%' and read_at is null
      ),
      'security_alerts', (
        select count(*) from public.organization_communication_notifications
        where organization_id = v_org_id and user_id = v_user_id
          and notification_type like 'security_%' and read_at is null
      )
    ),
    'inbox', public._cme509_aggregate_notifications(v_org_id, v_user_id, 100),
    'unread', coalesce((
      select jsonb_agg(elem order by elem->>'created_at' desc)
      from (
        select elem from jsonb_array_elements(public._cme509_aggregate_notifications(v_org_id, v_user_id, 100)) elem
        where elem->>'read_at' is null
        limit 50
      ) u
    ), '[]'::jsonb),
    'priority', coalesce((
      select jsonb_agg(elem order by elem->>'created_at' desc)
      from (
        select elem from jsonb_array_elements(public._cme509_aggregate_notifications(v_org_id, v_user_id, 100)) elem
        where elem->>'priority' in ('important', 'high', 'critical', 'emergency')
        limit 40
      ) p
    ), '[]'::jsonb),
    'approvals', v_approvals,
    'tasks', coalesce((
      select jsonb_agg(elem order by elem->>'created_at' desc)
      from (
        select elem from jsonb_array_elements(public._cme509_aggregate_notifications(v_org_id, v_user_id, 100)) elem
        where elem->>'notification_type' like 'task_%'
        limit 40
      ) t
    ), '[]'::jsonb),
    'system_alerts', coalesce((
      select jsonb_agg(elem order by elem->>'created_at' desc)
      from (
        select elem from jsonb_array_elements(public._cme509_aggregate_notifications(v_org_id, v_user_id, 100)) elem
        where elem->>'notification_type' in ('system', 'security_alert', 'license_warning', 'subscription_warning')
        limit 40
      ) s
    ), '[]'::jsonb),
    'executive_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_number', a.alert_number, 'alert_type', a.alert_type,
        'priority', a.priority, 'status', a.status, 'title', a.title,
        'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_executive_alerts a
      where a.organization_id = v_org_id and a.status in ('active', 'acknowledged')
      limit 30
    ), '[]'::jsonb),
    'preferences', coalesce((
      select jsonb_build_object(
        'frequency', p.frequency, 'channels', p.channels, 'categories', p.categories,
        'language', p.language, 'quiet_hours_start', p.quiet_hours_start,
        'quiet_hours_end', p.quiet_hours_end, 'working_hours_start', p.working_hours_start,
        'working_hours_end', p.working_hours_end
      )
      from public.organization_notification_preferences p
      where p.organization_id = v_org_id and p.user_id = v_user_id
    ), '{}'::jsonb),
    'routing_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'rule_key', r.rule_key, 'name', r.name,
        'target_role', r.target_role, 'notification_type', r.notification_type,
        'priority', r.priority, 'delivery_channel', r.delivery_channel, 'is_active', r.is_active
      ) order by r.name)
      from public.organization_notification_routing_rules r
      where r.organization_id = v_org_id and r.is_active = true
      limit 30
    ), '[]'::jsonb),
    'digests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'digest_number', d.digest_number, 'digest_type', d.digest_type,
        'summary', d.summary, 'generated_at', d.generated_at
      ) order by d.generated_at desc)
      from public.organization_notification_digests d
      where d.organization_id = v_org_id
        and (d.user_id is null or d.user_id = v_user_id)
      limit 20
    ), '[]'::jsonb),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'delivery_channel', l.delivery_channel,
        'delivery_status', l.delivery_status, 'summary', l.summary, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.organization_notification_delivery_logs l
      where l.organization_id = v_org_id and (l.user_id is null or l.user_id = v_user_id)
      limit 40
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'notification_volume_30d', (
        select count(*) from public.organization_communication_notifications
        where organization_id = v_org_id and created_at >= now() - interval '30 days'
      ),
      'read_rate_pct', least(100, greatest(0,
        coalesce((
          select (count(*) filter (where read_at is not null)::numeric / greatest(count(*), 1)) * 100
          from public.organization_communication_notifications
          where organization_id = v_org_id and user_id = v_user_id
            and created_at >= now() - interval '30 days'
        ), 0)::int
      )),
      'executive_alerts_active', (
        select count(*) from public.organization_executive_alerts
        where organization_id = v_org_id and status = 'active'
      ),
      'digests_generated', (
        select count(*) from public.organization_notification_digests
        where organization_id = v_org_id and generated_at >= now() - interval '30 days'
      )
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_notification_orchestration_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'inbox', 'unread', 'priority', 'approvals', 'tasks', 'system_alerts', 'settings', 'history'
    ),
    'routes', jsonb_build_object(
      'notifications', '/app/notifications',
      'executive_alerts', '/app/executive-alerts',
      'communications', '/app/communications',
      'approvals', '/app/approvals'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_notification_orchestration_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user uuid;
  v_id uuid;
  v_result jsonb;
begin
  v_org_id := public._ntf529_org();
  v_user := public._ntf529_user();
  perform public._ntf529_ensure_settings(v_org_id);
  perform public._ntf529_ensure_preferences(v_org_id, v_user);

  if p_action_type in (
    'mark_read', 'archive_notification', 'update_preferences', 'create_routing_rule',
    'create_executive_alert', 'acknowledge_executive_alert', 'resolve_executive_alert',
    'generate_digest', 'create_notification', 'escalate_alert'
  ) then
    perform public._irp_require_permission('notifications.manage');
  else
    perform public._irp_require_permission('notifications.view');
  end if;

  if p_action_type = 'mark_read' then
    v_result := public.perform_communication_management_action('mark_read', p_payload);
    insert into public.organization_notification_delivery_logs (
      organization_id, notification_id, user_id, delivery_channel, delivery_status, summary
    ) values (
      v_org_id, nullif(p_payload->>'notification_id', '')::uuid, v_user,
      'in_app', 'read', 'Notification marked read'
    );
    perform public._ntf529_log(v_org_id, 'notification_read', 'Notification read', 'notification',
      nullif(p_payload->>'notification_id', '')::uuid, p_payload);
    return coalesce(v_result, jsonb_build_object('ok', true));

  elsif p_action_type = 'create_notification' then
    v_result := public.perform_communication_management_action('create_notification', p_payload);
    perform public._ntf529_log(v_org_id, 'notification_created', 'Notification created', 'notification', null, p_payload);
    return v_result;

  elsif p_action_type = 'update_preferences' then
    update public.organization_notification_preferences set
      frequency = coalesce(p_payload->>'frequency', frequency),
      channels = coalesce(p_payload->'channels', channels),
      categories = coalesce(p_payload->'categories', categories),
      language = coalesce(p_payload->>'language', language),
      quiet_hours_start = coalesce(nullif(p_payload->>'quiet_hours_start', '')::time, quiet_hours_start),
      quiet_hours_end = coalesce(nullif(p_payload->>'quiet_hours_end', '')::time, quiet_hours_end),
      updated_at = now()
    where organization_id = v_org_id and user_id = v_user;
    perform public._ntf529_log(v_org_id, 'preference_changed', 'Notification preferences updated', 'preferences', v_user, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_routing_rule' then
    insert into public.organization_notification_routing_rules (
      organization_id, rule_key, name, description, target_role, target_department_id,
      notification_type, priority, delivery_channel, domain_id, business_pack_key
    ) values (
      v_org_id,
      coalesce(p_payload->>'rule_key', 'rule-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'name', 'Routing rule'),
      coalesce(p_payload->>'description', ''),
      p_payload->>'target_role',
      nullif(p_payload->>'target_department_id', '')::uuid,
      coalesce(p_payload->>'notification_type', 'custom_alert'),
      coalesce(p_payload->>'priority', 'normal'),
      coalesce(p_payload->>'delivery_channel', 'in_app'),
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key'
    ) returning id into v_id;
    perform public._ntf529_log(v_org_id, 'routing_rule_created', 'Notification routing rule created', 'routing', v_id, p_payload);
    return jsonb_build_object('ok', true, 'rule_id', v_id);

  elsif p_action_type = 'create_executive_alert' then
    insert into public.organization_executive_alerts (
      organization_id, alert_number, alert_type, priority, status, title, summary,
      domain_id, business_pack_key, owner_user_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'alert_number', public._ntf529_next_number(v_org_id, 'EXA', 'organization_executive_alerts')),
      coalesce(p_payload->>'alert_type', 'operational_risk'),
      coalesce(p_payload->>'priority', 'high'),
      'active',
      coalesce(p_payload->>'title', 'Executive alert'),
      coalesce(p_payload->>'summary', ''),
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user)
    ) returning id into v_id;
    perform public._ntf529_log(v_org_id, 'executive_alert_created', 'Executive alert created', 'executive_alert', v_id, p_payload);
    return jsonb_build_object('ok', true, 'alert_id', v_id);

  elsif p_action_type = 'acknowledge_executive_alert' then
    v_id := (p_payload->>'alert_id')::uuid;
    update public.organization_executive_alerts set
      status = 'acknowledged', acknowledged_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ntf529_log(v_org_id, 'executive_alert_acknowledged', 'Executive alert acknowledged', 'executive_alert', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'resolve_executive_alert' then
    v_id := (p_payload->>'alert_id')::uuid;
    update public.organization_executive_alerts set
      status = 'resolved', resolved_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._ntf529_log(v_org_id, 'executive_alert_resolved', 'Executive alert resolved', 'executive_alert', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'generate_digest' then
    insert into public.organization_notification_digests (
      organization_id, digest_number, digest_type, user_id, summary, items
    ) values (
      v_org_id,
      public._ntf529_next_number(v_org_id, 'DIG', 'organization_notification_digests'),
      coalesce(p_payload->>'digest_type', 'daily'),
      v_user,
      coalesce(p_payload->>'summary', 'Daily notification digest'),
      coalesce(p_payload->'items', '[]'::jsonb)
    ) returning id into v_id;
    perform public._ntf529_log(v_org_id, 'digest_generated', 'Notification digest generated', 'digest', v_id, p_payload);
    return jsonb_build_object('ok', true, 'digest_id', v_id);

  elsif p_action_type = 'escalate_alert' then
    insert into public.organization_executive_alerts (
      organization_id, alert_number, alert_type, priority, status, title, summary
    ) values (
      v_org_id,
      public._ntf529_next_number(v_org_id, 'EXA', 'organization_executive_alerts'),
      'operational_risk', 'critical', 'active',
      coalesce(p_payload->>'title', 'Escalated alert'),
      coalesce(p_payload->>'summary', 'Alert escalated to executive attention')
    ) returning id into v_id;
    perform public._ntf529_log(v_org_id, 'alert_escalated', 'Alert escalated', 'executive_alert', v_id, p_payload);
    return jsonb_build_object('ok', true, 'alert_id', v_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_notification_orchestration_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_comm jsonb;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._ntf529_org();
  v_user_id := public._ntf529_user();
  perform public._ntf529_ensure_settings(v_org_id);

  v_comm := public.get_companion_communication_context();

  if p_query is not null and length(trim(p_query)) > 0 then
    perform public._ntf529_log(v_org_id, 'companion_query', 'Companion notification query', null, null,
      jsonb_build_object('query', trim(p_query)));
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion ensures the right information reaches the right people.',
    'query', p_query,
    'unread_notifications', v_comm->'unread_notifications',
    'companion_alerts', v_comm->'companion_alerts',
    'pending_approvals', v_comm->'pending_approvals',
    'overdue_tasks', v_comm->'overdue_tasks',
    'executive_alerts', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'priority', priority))
      from public.organization_executive_alerts
      where organization_id = v_org_id and status = 'active'
      limit 5
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Show my notifications.',
      'Show critical alerts.',
      'Generate executive summary.',
      'Which alerts require action?',
      'Show unread items.'
    ),
    'routes', jsonb_build_object(
      'notifications', '/app/notifications',
      'executive_alerts', '/app/executive-alerts',
      'approvals', '/app/approvals'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_notification_orchestration_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._ntf529_org();
  v_user_id := public._ntf529_user();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('notifications.manage', v_org_id),
    'unread', (
      select count(*) from public.organization_communication_notifications
      where organization_id = v_org_id and user_id = v_user_id and read_at is null
    ),
    'critical', (
      select count(*) from public.organization_communication_notifications
      where organization_id = v_org_id and user_id = v_user_id
        and priority in ('critical', 'emergency') and read_at is null
    ),
    'executive_alerts', (
      select count(*) from public.organization_executive_alerts
      where organization_id = v_org_id and status = 'active'
    ),
    'routes', jsonb_build_object(
      'notifications', '/app/notifications',
      'executive_alerts', '/app/executive-alerts',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('notifications', '/app/notifications'));
end; $$;

-- Module registry (extends notifications module)
do $$ begin
  perform public._mre501_seed_module(
    'notifications', 'Notifications & Alerts', 'notifications', 'operations',
    'Notification inbox, routing, digests, executive alerts, and communication orchestration.',
    'starter', null, 'operations', '/app/notifications', 'licensed', 5
  );
exception when others then null;
end $$;

grant execute on function public.get_notification_orchestration_center(text) to authenticated;
grant execute on function public.perform_notification_orchestration_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_notification_orchestration_context(text) to authenticated;
grant execute on function public.get_my_notification_orchestration_summary() to authenticated;
