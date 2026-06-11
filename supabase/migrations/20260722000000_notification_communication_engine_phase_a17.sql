-- Phase A.17 — Notification & Communication Engine
-- Principle: tenant-aware, role-aware delivery with preferences, digests, and audit support.
-- Extends A.9 organization_notifications via send_organization_notification() mirror.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_communication_notifications
-- ---------------------------------------------------------------------------
create table if not exists public.organization_communication_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  category text not null check (
    category in (
      'support', 'approvals', 'tasks', 'integrations', 'governance',
      'quality', 'onboarding', 'billing', 'system_alerts'
    )
  ),
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  title text not null,
  message text,
  action_url text,
  recommended_action text,
  status text not null default 'pending' check (
    status in ('pending', 'delivered', 'read', 'dismissed', 'failed')
  ),
  delivery_channels jsonb not null default '["in_app"]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  delivered_at timestamptz,
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists org_comm_notifications_org_user_idx
  on public.organization_communication_notifications (organization_id, user_id, status, created_at desc);

create index if not exists org_comm_notifications_org_category_idx
  on public.organization_communication_notifications (organization_id, category, priority, created_at desc);

alter table public.organization_communication_notifications enable row level security;
revoke all on public.organization_communication_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. communication_notification_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.communication_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  preferred_channels jsonb not null default '["in_app","dashboard"]'::jsonb,
  frequency text not null default 'immediate' check (
    frequency in ('immediate', 'daily_digest', 'weekly_digest')
  ),
  quiet_hours jsonb not null default '{"enabled":true,"start":"22:00","end":"07:00","timezone":"Europe/Oslo"}'::jsonb,
  category_subscriptions jsonb not null default '{
    "support":true,"approvals":true,"tasks":true,"integrations":true,
    "governance":true,"quality":true,"onboarding":true,"billing":true,"system_alerts":true
  }'::jsonb,
  critical_bypass_quiet_hours boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists comm_notification_prefs_org_user_idx
  on public.communication_notification_preferences (organization_id, user_id);

alter table public.communication_notification_preferences enable row level security;
revoke all on public.communication_notification_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. communication_digests
-- ---------------------------------------------------------------------------
create table if not exists public.communication_digests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  digest_type text not null check (
    digest_type in ('daily', 'weekly', 'approval', 'support')
  ),
  period_start timestamptz not null,
  period_end timestamptz not null,
  status text not null default 'pending' check (
    status in ('pending', 'generated', 'delivered', 'failed')
  ),
  summary_metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists communication_digests_org_user_idx
  on public.communication_digests (organization_id, user_id, digest_type, created_at desc);

alter table public.communication_digests enable row level security;
revoke all on public.communication_digests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'notification_communication', v.description
from (values
  ('notifications.view', 'View Notifications', 'View organization notifications and history'),
  ('notifications.manage', 'Manage Notifications', 'Mark read, dismiss, and manage notification state'),
  ('notifications.send', 'Send Notifications', 'Send organization notifications to users'),
  ('notifications.configure', 'Configure Notifications', 'Manage notification preferences and digests')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'notifications.view'), ('owner', 'notifications.manage'), ('owner', 'notifications.send'), ('owner', 'notifications.configure'),
  ('administrator', 'notifications.view'), ('administrator', 'notifications.manage'), ('administrator', 'notifications.send'), ('administrator', 'notifications.configure'),
  ('manager', 'notifications.view'), ('manager', 'notifications.manage'), ('manager', 'notifications.configure'),
  ('support_agent', 'notifications.view'), ('support_agent', 'notifications.manage'),
  ('viewer', 'notifications.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_nce_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._nce_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'notification',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._nce_ensure_preferences(
  p_organization_id uuid,
  p_user_id uuid
)
returns public.communication_notification_preferences language plpgsql security definer set search_path = public as $$
declare v_row public.communication_notification_preferences;
begin
  insert into public.communication_notification_preferences (organization_id, user_id)
  values (p_organization_id, p_user_id)
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.communication_notification_preferences
  where organization_id = p_organization_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._nce_map_category_legacy(p_category text)
returns text language sql immutable as $$
  select case p_category
    when 'support' then 'support'
    when 'approvals' then 'approval'
    when 'tasks' then 'task'
    when 'integrations' then 'integration'
    when 'governance' then 'alert'
    when 'quality' then 'alert'
    when 'onboarding' then 'onboarding'
    when 'billing' then 'system'
    when 'system_alerts' then 'system'
    else 'system'
  end;
$$;

create or replace function public._nce_is_quiet_hours(
  p_organization_id uuid,
  p_user_id uuid,
  p_priority text
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_prefs public.communication_notification_preferences;
  v_presence public.presence_notification_preferences;
  v_qh jsonb;
  v_now time;
  v_start time;
  v_end time;
  v_tz text;
  v_mode text;
begin
  if p_priority = 'critical' then
    v_prefs := public._nce_ensure_preferences(p_organization_id, p_user_id);
    if coalesce(v_prefs.critical_bypass_quiet_hours, true) then
      return false;
    end if;
  end if;

  v_prefs := public._nce_ensure_preferences(p_organization_id, p_user_id);
  v_qh := coalesce(v_prefs.quiet_hours, '{}'::jsonb);

  if coalesce((v_qh->>'enabled')::boolean, false) = false then
    return false;
  end if;

  v_tz := coalesce(v_qh->>'timezone', 'UTC');
  v_start := coalesce((v_qh->>'start')::time, '22:00'::time);
  v_end := coalesce((v_qh->>'end')::time, '07:00'::time);
  v_now := (now() at time zone v_tz)::time;

  if v_start <= v_end then
    if v_now >= v_start and v_now < v_end then return true; end if;
  else
    if v_now >= v_start or v_now < v_end then return true; end if;
  end if;

  select * into v_presence
  from public.presence_notification_preferences
  where tenant_id = p_organization_id;

  if v_presence.id is not null then
    v_mode := coalesce(v_presence.quiet_hours_mode, 'standard');
    if v_mode = 'vacation' and v_presence.vacation_until is not null and v_presence.vacation_until >= current_date then
      return true;
    end if;
    if v_mode = 'minimal' and p_priority not in ('high', 'critical') then
      return true;
    end if;
    if v_mode = 'working_hours_only' then
      v_start := coalesce(v_presence.working_hours_start, '09:00'::time);
      v_end := coalesce(v_presence.working_hours_end, '17:00'::time);
      v_tz := coalesce(v_presence.timezone, v_tz);
      v_now := (now() at time zone v_tz)::time;
      if v_now < v_start or v_now >= v_end then return true; end if;
    end if;
  end if;

  return false;
end; $$;

create or replace function public._nce_category_subscribed(
  p_organization_id uuid,
  p_user_id uuid,
  p_category text
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_prefs public.communication_notification_preferences;
begin
  v_prefs := public._nce_ensure_preferences(p_organization_id, p_user_id);
  return coalesce((v_prefs.category_subscriptions->>p_category)::boolean, true);
end; $$;

create or replace function public._nce_mirror_legacy_notification(
  p_organization_id uuid,
  p_user_id uuid,
  p_category text,
  p_title text,
  p_message text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_notifications (
    organization_id, user_id, notification_type, title, message
  ) values (
    p_organization_id, p_user_id, public._nce_map_category_legacy(p_category), p_title, p_message
  );
exception when others then
  null;
end; $$;

create or replace function public._nce_deliver_notification(p_notification_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_n public.organization_communication_notifications;
  v_user_id uuid;
  v_quiet boolean;
  v_status text := 'delivered';
  v_channels jsonb;
begin
  select * into v_n from public.organization_communication_notifications where id = p_notification_id;
  if v_n.id is null then raise exception 'Notification not found'; end if;

  v_user_id := coalesce(v_n.user_id, public._mta_app_user_id());
  if v_user_id is null then
    update public.organization_communication_notifications set status = 'failed' where id = p_notification_id;
    return jsonb_build_object('id', p_notification_id, 'status', 'failed', 'reason', 'no_recipient');
  end if;

  if not public._nce_category_subscribed(v_n.organization_id, v_user_id, v_n.category) then
    update public.organization_communication_notifications set status = 'dismissed', dismissed_at = now()
    where id = p_notification_id;
    return jsonb_build_object('id', p_notification_id, 'status', 'dismissed', 'reason', 'category_unsubscribed');
  end if;

  v_quiet := public._nce_is_quiet_hours(v_n.organization_id, v_user_id, v_n.priority);
  if v_quiet and v_n.priority not in ('high', 'critical') then
    update public.organization_communication_notifications set status = 'pending' where id = p_notification_id;
    return jsonb_build_object('id', p_notification_id, 'status', 'pending', 'reason', 'quiet_hours');
  end if;

  v_channels := coalesce(v_n.delivery_channels, '["in_app"]'::jsonb);

  if v_channels ? 'dashboard' or v_channels ? 'in_app' then
    perform public._nce_mirror_legacy_notification(
      v_n.organization_id, v_user_id, v_n.category, v_n.title, v_n.message
    );
  end if;

  if v_channels ? 'email' then
    -- Scaffold: email delivery hook — metadata only, no PII content stored
    v_channels := v_channels;
  end if;

  update public.organization_communication_notifications set
    status = v_status, delivered_at = now(), user_id = v_user_id
  where id = p_notification_id;

  return jsonb_build_object('id', p_notification_id, 'status', v_status, 'channels', v_channels);
exception when others then
  update public.organization_communication_notifications set status = 'failed' where id = p_notification_id;
  return jsonb_build_object('id', p_notification_id, 'status', 'failed');
end; $$;

create or replace function public._nce_notification_trends(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = p_organization_id
        and (n.user_id is null or n.user_id = p_user_id)
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0),
    'critical_unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = p_organization_id
        and (n.user_id is null or n.user_id = p_user_id)
        and n.priority = 'critical'
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0),
    'delivered_7d', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = p_organization_id
        and n.status = 'delivered' and n.created_at >= now() - interval '7 days'
    ), 0),
    'by_category', coalesce((
      select jsonb_object_agg(category, cnt)
      from (
        select category, count(*) as cnt
        from public.organization_communication_notifications
        where organization_id = p_organization_id and created_at >= now() - interval '30 days'
        group by category
      ) s
    ), '{}'::jsonb)
  );
end; $$;

create or replace function public._nce_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  select ou.user_id into v_user_id
  from public.organization_users ou
  where ou.organization_id = p_organization_id and ou.status = 'active'
  order by case ou.role when 'owner' then 0 when 'administrator' then 1 else 2 end
  limit 1;

  if v_user_id is null then return; end if;

  perform public._nce_ensure_preferences(p_organization_id, v_user_id);

  insert into public.organization_communication_notifications (
    organization_id, user_id, category, priority, title, message, action_url,
    recommended_action, status, delivered_at, delivery_channels
  )
  select p_organization_id, v_user_id, v.cat, v.pri, v.title, v.msg, v.url, v.action, 'delivered', now(), '["in_app","dashboard"]'::jsonb
  from (values
    ('approvals', 'high', 'Approval awaiting review', '2 medium-risk AI actions require your review.', '/app/secure-ai-actions', 'Review pending approvals'),
    ('support', 'medium', 'Support queue update', '3 cases require follow-up today.', '/app/support-ai-engine', 'Open support dashboard'),
    ('integrations', 'medium', 'Integration sync completed', 'Knowledge Center import finished successfully.', '/app/integration-engine', 'View integration status'),
    ('system_alerts', 'critical', 'Organization health attention', 'Critical alert requires acknowledgment.', '/app/operations-dashboard-engine', 'Acknowledge alert')
  ) as v(cat, pri, title, msg, url, action)
  where not exists (
    select 1 from public.organization_communication_notifications n
    where n.organization_id = p_organization_id and n.title = v.title limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.send_organization_notification(
  p_organization_id uuid,
  p_user_id uuid default null,
  p_category text default 'system_alerts',
  p_priority text default 'medium',
  p_title text default '',
  p_message text default null,
  p_action_url text default null,
  p_recommended_action text default null,
  p_delivery_channels jsonb default '["in_app","dashboard"]'::jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_result jsonb;
begin
  if p_title = '' then raise exception 'title required'; end if;

  insert into public.organization_communication_notifications (
    organization_id, user_id, category, priority, title, message, action_url,
    recommended_action, delivery_channels, metadata, status
  ) values (
    p_organization_id, p_user_id, p_category, p_priority, p_title, p_message, p_action_url,
    p_recommended_action, coalesce(p_delivery_channels, '["in_app","dashboard"]'::jsonb),
    coalesce(p_metadata, '{}'::jsonb), 'pending'
  ) returning id into v_id;

  v_result := public._nce_deliver_notification(v_id);

  perform public._nce_log(p_organization_id, 'notification_sent', 'notification', v_id,
    jsonb_build_object('category', p_category, 'priority', p_priority, 'status', v_result->>'status'));

  return jsonb_build_object('id', v_id) || v_result;
end; $$;

create or replace function public.send_notification(
  p_user_id uuid default null,
  p_category text default 'system_alerts',
  p_priority text default 'medium',
  p_title text default '',
  p_message text default null,
  p_action_url text default null,
  p_recommended_action text default null,
  p_delivery_channels jsonb default '["in_app","dashboard"]'::jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('notifications.send');
  v_org_id := public._mta_require_organization();
  return public.send_organization_notification(
    v_org_id, p_user_id, p_category, p_priority, p_title, p_message,
    p_action_url, p_recommended_action, p_delivery_channels, p_metadata
  );
end; $$;

create or replace function public.send_critical_alert(
  p_title text,
  p_message text default null,
  p_action_url text default null,
  p_user_id uuid default null,
  p_category text default 'system_alerts'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_result jsonb;
begin
  perform public._irp_require_permission('notifications.send');
  v_org_id := public._mta_require_organization();

  v_result := public.send_organization_notification(
    v_org_id, p_user_id, p_category, 'critical', p_title, p_message, p_action_url,
    'Review immediately', '["in_app","dashboard","email"]'::jsonb,
    jsonb_build_object('critical_alert', true)
  );

  perform public._nce_log(v_org_id, 'critical_alert_sent', 'notification', (v_result->>'id')::uuid,
    jsonb_build_object('title', p_title, 'category', p_category));

  return v_result;
end; $$;

create or replace function public.mark_notification_read(p_notification_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_n public.organization_communication_notifications;
begin
  perform public._irp_require_permission('notifications.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_n from public.organization_communication_notifications
  where id = p_notification_id and organization_id = v_org_id;

  if v_n.id is null then raise exception 'Notification not found'; end if;
  if v_n.user_id is not null and v_n.user_id <> v_user_id then raise exception 'Access denied'; end if;

  update public.organization_communication_notifications set
    status = 'read', read_at = now()
  where id = p_notification_id;

  update public.organization_notifications set read_at = now()
  where organization_id = v_org_id and title = v_n.title and read_at is null;

  return jsonb_build_object('id', p_notification_id, 'status', 'read');
end; $$;

create or replace function public.dismiss_notification(p_notification_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_n public.organization_communication_notifications;
begin
  perform public._irp_require_permission('notifications.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_n from public.organization_communication_notifications
  where id = p_notification_id and organization_id = v_org_id;

  if v_n.id is null then raise exception 'Notification not found'; end if;
  if v_n.user_id is not null and v_n.user_id <> v_user_id then raise exception 'Access denied'; end if;

  update public.organization_communication_notifications set
    status = 'dismissed', dismissed_at = now()
  where id = p_notification_id;

  perform public._nce_log(v_org_id, 'notification_dismissed', 'notification', p_notification_id,
    jsonb_build_object('category', v_n.category, 'priority', v_n.priority));

  return jsonb_build_object('id', p_notification_id, 'status', 'dismissed');
end; $$;

create or replace function public.get_notification_unread_count()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return jsonb_build_object(
    'unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0),
    'critical_unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and n.priority = 'critical'
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0)
  );
end; $$;

create or replace function public.get_communication_preferences()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_prefs public.communication_notification_preferences;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_prefs := public._nce_ensure_preferences(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'preferences', row_to_json(v_prefs),
    'presence_aligned', exists (
      select 1 from public.presence_notification_preferences p where p.tenant_id = v_org_id
    )
  );
end; $$;

create or replace function public.save_communication_preferences(
  p_preferred_channels jsonb default null,
  p_frequency text default null,
  p_quiet_hours jsonb default null,
  p_category_subscriptions jsonb default null,
  p_critical_bypass_quiet_hours boolean default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_prefs public.communication_notification_preferences;
begin
  perform public._irp_require_permission('notifications.configure');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_prefs := public._nce_ensure_preferences(v_org_id, v_user_id);

  update public.communication_notification_preferences set
    preferred_channels = coalesce(p_preferred_channels, preferred_channels),
    frequency = coalesce(p_frequency, frequency),
    quiet_hours = coalesce(p_quiet_hours, quiet_hours),
    category_subscriptions = coalesce(p_category_subscriptions, category_subscriptions),
    critical_bypass_quiet_hours = coalesce(p_critical_bypass_quiet_hours, critical_bypass_quiet_hours),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id
  returning * into v_prefs;

  perform public._nce_log(v_org_id, 'notification_preferences_saved', 'notification_preferences', v_prefs.id,
    jsonb_build_object('frequency', v_prefs.frequency));

  return jsonb_build_object('preferences', row_to_json(v_prefs));
end; $$;

create or replace function public.generate_communication_digest(
  p_digest_type text default 'daily',
  p_period_start timestamptz default null,
  p_period_end timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_start timestamptz;
  v_end timestamptz;
  v_id uuid;
  v_summary jsonb;
  v_cat_filter text[];
begin
  perform public._irp_require_permission('notifications.configure');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  v_end := coalesce(p_period_end, now());
  v_start := coalesce(p_period_start, case p_digest_type
    when 'weekly' then v_end - interval '7 days'
    else v_end - interval '1 day'
  end);

  v_cat_filter := case p_digest_type
    when 'approval' then array['approvals']
    when 'support' then array['support']
    else null
  end;

  select jsonb_build_object(
    'total', count(*),
    'unread', count(*) filter (where read_at is null and dismissed_at is null),
    'critical', count(*) filter (where priority = 'critical'),
    'by_category', coalesce((
      select jsonb_object_agg(category, cat_cnt)
      from (
        select category, count(*) as cat_cnt
        from public.organization_communication_notifications n2
        where n2.organization_id = v_org_id
          and (n2.user_id is null or n2.user_id = v_user_id)
          and n2.created_at >= v_start and n2.created_at <= v_end
          and (v_cat_filter is null or n2.category = any(v_cat_filter))
        group by category
      ) cats
    ), '{}'::jsonb)
  ) into v_summary
  from public.organization_communication_notifications n
  where n.organization_id = v_org_id
    and (n.user_id is null or n.user_id = v_user_id)
    and n.created_at >= v_start and n.created_at <= v_end
    and (v_cat_filter is null or n.category = any(v_cat_filter));

  insert into public.communication_digests (
    organization_id, user_id, digest_type, period_start, period_end,
    status, summary_metadata, generated_at
  ) values (
    v_org_id, v_user_id, p_digest_type, v_start, v_end,
    'generated', coalesce(v_summary, '{}'::jsonb), now()
  ) returning id into v_id;

  perform public._nce_log(v_org_id, 'notification_digest_generated', 'communication_digest', v_id,
    jsonb_build_object('digest_type', p_digest_type, 'period_start', v_start, 'period_end', v_end));

  return jsonb_build_object('id', v_id, 'digest_type', p_digest_type, 'summary', v_summary);
end; $$;

create or replace function public.get_communication_digests(p_limit int default 10)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return coalesce((
    select jsonb_agg(row_to_json(d) order by d.created_at desc)
    from (
      select id, digest_type, period_start, period_end, status, summary_metadata, generated_at, created_at
      from public.communication_digests
      where organization_id = v_org_id and user_id = v_user_id
      order by created_at desc
      limit greatest(p_limit, 1)
    ) d
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_notification_communication_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_prefs public.communication_notification_preferences;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_prefs := public._nce_ensure_preferences(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Centralized communication across Aipify Core — actionable, preference-aware, and auditable.',
    'safety_note', 'Notification payloads store metadata only — never email content, chat, or PII.',
    'principles', jsonb_build_array(
      'Tenant-aware and role-aware delivery',
      'Configurable preferences with quiet hours alignment',
      'Critical alerts may bypass quiet hours',
      'Action-oriented with direct navigation links',
      'Full audit support for sends, dismissals, and preference changes'
    ),
    'preferences', row_to_json(v_prefs),
    'trends', public._nce_notification_trends(v_org_id, v_user_id),
    'unread_notifications', coalesce((
      select jsonb_agg(row_to_json(n) order by n.created_at desc)
      from (
        select id, category, priority, title, message, action_url, recommended_action,
               status, delivered_at, read_at, created_at
        from public.organization_communication_notifications
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status in ('delivered', 'pending')
          and read_at is null and dismissed_at is null
        order by case priority when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, created_at desc
        limit 20
      ) n
    ), '[]'::jsonb),
    'critical_alerts', coalesce((
      select jsonb_agg(row_to_json(n) order by n.created_at desc)
      from (
        select id, category, priority, title, message, action_url, recommended_action, status, created_at
        from public.organization_communication_notifications
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and priority = 'critical'
          and status in ('delivered', 'pending')
          and read_at is null and dismissed_at is null
        order by created_at desc
        limit 10
      ) n
    ), '[]'::jsonb),
    'recent_history', coalesce((
      select jsonb_agg(row_to_json(n) order by n.created_at desc)
      from (
        select id, category, priority, title, status, read_at, dismissed_at, created_at
        from public.organization_communication_notifications
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
        order by created_at desc
        limit 15
      ) n
    ), '[]'::jsonb),
    'recent_digests', public.get_communication_digests(5),
    'future_channels', jsonb_build_array('push', 'sms', 'messaging', 'desktop')
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_notification_communication_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return jsonb_build_object(
    'has_organization', true,
    'unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0),
    'critical_unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and n.priority = 'critical'
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0),
    'philosophy', 'Organization communication hub — preferences, digests, and actionable alerts.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._nce_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'notification-communication-engine', 'Notification & Communication Engine', 'Centralized organization communication with preferences, digests, and actionable alerts across Aipify Core phases.', 'authenticated', 62
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'notification-communication-engine' and tenant_id is null);

grant execute on function public.send_organization_notification(uuid, uuid, text, text, text, text, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.send_notification(uuid, text, text, text, text, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.send_critical_alert(text, text, text, uuid, text) to authenticated;
grant execute on function public.mark_notification_read(uuid) to authenticated;
grant execute on function public.dismiss_notification(uuid) to authenticated;
grant execute on function public.get_notification_unread_count() to authenticated;
grant execute on function public.get_communication_preferences() to authenticated;
grant execute on function public.save_communication_preferences(jsonb, text, jsonb, jsonb, boolean) to authenticated;
grant execute on function public.generate_communication_digest(text, timestamptz, timestamptz) to authenticated;
grant execute on function public.get_communication_digests(int) to authenticated;
grant execute on function public.get_notification_communication_engine_dashboard() to authenticated;
grant execute on function public.get_notification_communication_engine_card() to authenticated;
