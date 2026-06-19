-- Phase 509 — Communications, Messaging & Notification Engine
-- Universal communication layer for all APP organizations and Business Packs
-- Aggregates task/calendar/document notifications from Phases 506–508

-- ---------------------------------------------------------------------------
-- 1. Messages & announcements
-- ---------------------------------------------------------------------------
create table if not exists public.organization_communication_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  message_type text not null default 'direct' check (
    message_type in ('direct', 'team', 'department', 'organization', 'system', 'companion')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'information', 'attention_required', 'completed', 'requires_approval', 'expired')
  ),
  priority text not null default 'normal' check (
    priority in ('normal', 'important', 'critical', 'emergency')
  ),
  subject text not null,
  body text not null default '',
  sender_user_id uuid references public.users (id) on delete set null,
  recipient_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  read_at timestamptz,
  archived_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_communication_announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  body text not null default '',
  scope text not null default 'organization' check (
    scope in ('organization', 'department', 'role', 'business_pack', 'domain')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  role_key text,
  published_by uuid references public.users (id) on delete set null,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_communication_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  notification_type text not null check (
    notification_type in (
      'task_assigned', 'task_due', 'task_overdue', 'approval_required', 'approval_completed',
      'document_updated', 'knowledge_published', 'employee_invited', 'employee_suspended',
      'license_warning', 'subscription_warning', 'companion_alert', 'domain_event',
      'business_pack_event', 'message', 'announcement', 'system'
    )
  ),
  priority text not null default 'normal' check (
    priority in ('normal', 'important', 'critical', 'emergency')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'information', 'attention_required', 'completed', 'requires_approval', 'expired')
  ),
  summary text not null,
  source_type text,
  source_id uuid,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_communication_activity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  activity_type text not null check (
    activity_type in (
      'task', 'approval', 'document', 'knowledge', 'employee', 'business_pack',
      'companion', 'announcement', 'message', 'calendar', 'license'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  source_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_communication_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_communication_messages enable row level security;
alter table public.organization_communication_announcements enable row level security;
alter table public.organization_communication_notifications enable row level security;
alter table public.organization_communication_activity enable row level security;
alter table public.organization_communication_audit_logs enable row level security;

revoke all on public.organization_communication_messages from authenticated, anon;
revoke all on public.organization_communication_announcements from authenticated, anon;
revoke all on public.organization_communication_notifications from authenticated, anon;
revoke all on public.organization_communication_activity from authenticated, anon;
revoke all on public.organization_communication_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Permissions & modules
-- ---------------------------------------------------------------------------
do $$ begin
  if exists (select 1 from pg_proc where proname = '_mre501_seed_module') then
    perform public._mre501_seed_module(
      'communications', 'Communications', 'communications', 'operations',
      'Internal messaging, announcements, and inbox.', 'starter', null, 'operations', '/app/communications', 'licensed', 4
    );
    perform public._mre501_seed_module(
      'activity', 'Activity', 'activity', 'operations',
      'Organization activity feed.', 'starter', null, 'operations', '/app/activity', 'licensed', 8
    );
  end if;
  if exists (select 1 from pg_proc where proname = '_rpm504_register_module_permissions') then
    perform public._rpm504_register_module_permissions('communications');
    perform public._rpm504_register_module_permissions('activity');
    perform public._rpm504_register_module_permissions('notifications');
  end if;
end $$;

update public.aipify_module_registry set route_href = '/app/notifications', updated_at = now() where module_key = 'notifications';

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cme509_log(
  p_org_id uuid, p_action text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_communication_audit_logs (
    organization_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._cme509_message_json(m public.organization_communication_messages)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', m.id, 'message_type', m.message_type, 'status', m.status, 'priority', m.priority,
    'subject', m.subject, 'body', left(m.body, 500), 'sender_user_id', m.sender_user_id,
    'recipient_user_id', m.recipient_user_id, 'read_at', m.read_at, 'created_at', m.created_at
  );
end; $$;

create or replace function public._cme509_record_activity(
  p_org_id uuid, p_type text, p_summary text, p_actor uuid default null,
  p_dept uuid default null, p_domain uuid default null, p_pack text default null, p_source uuid default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_communication_activity (
    organization_id, activity_type, summary, actor_user_id, department_id, domain_id, business_pack_key, source_id
  ) values (p_org_id, p_type, p_summary, p_actor, p_dept, p_domain, p_pack, p_source);
end; $$;

create or replace function public._cme509_aggregate_notifications(p_org_id uuid, p_user_id uuid, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(row order by row->>'created_at' desc)
    from (
      select jsonb_build_object(
        'id', n.id, 'notification_type', n.notification_type, 'priority', n.priority,
        'status', n.status, 'summary', n.summary, 'source', 'communication', 'read_at', n.read_at,
        'created_at', n.created_at
      ) as row
      from public.organization_communication_notifications n
      where n.organization_id = p_org_id and n.user_id = p_user_id
      union all
      select jsonb_build_object(
        'id', t.id, 'notification_type', t.notification_type, 'priority', 'normal',
        'status', 'pending', 'summary', t.summary, 'source', 'task', 'read_at', t.read_at,
        'created_at', t.created_at
      )
      from public.organization_task_notifications t
      where t.organization_id = p_org_id and t.user_id = p_user_id
      union all
      select jsonb_build_object(
        'id', c.id, 'notification_type', c.notification_type, 'priority', 'normal',
        'status', 'pending', 'summary', c.summary, 'source', 'calendar', 'read_at', c.read_at,
        'created_at', c.created_at
      )
      from public.organization_calendar_notifications c
      where c.organization_id = p_org_id and c.user_id = p_user_id
      union all
      select jsonb_build_object(
        'id', d.id, 'notification_type', d.notification_type, 'priority', 'normal',
        'status', 'pending', 'summary', d.summary, 'source', 'document', 'read_at', d.read_at,
        'created_at', d.created_at
      )
      from public.organization_document_notifications d
      where d.organization_id = p_org_id and d.user_id = p_user_id
    ) combined
    limit p_limit
  ), '[]'::jsonb);
end; $$;

create or replace function public._cme509_aggregate_approvals(p_org_id uuid, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(row order by row->>'created_at' desc)
    from (
      select jsonb_build_object(
        'approval_id', a.id, 'approval_type', 'task', 'title', t.title,
        'approval_status', a.approval_status, 'created_at', a.created_at
      ) as row
      from public.organization_task_approvals a
      join public.organization_tasks t on t.id = a.task_id
      where a.organization_id = p_org_id and a.approval_status = 'pending'
      union all
      select jsonb_build_object(
        'approval_id', a.id, 'approval_type', 'document', 'title', d.title,
        'approval_status', a.approval_status, 'created_at', a.created_at
      )
      from public.organization_document_approvals a
      join public.organization_documents d on d.id = a.document_id
      where a.organization_id = p_org_id and a.approval_status = 'pending'
      union all
      select jsonb_build_object(
        'approval_id', a.id, 'approval_type', 'calendar', 'title', e.title,
        'approval_status', a.approval_status, 'created_at', a.created_at
      )
      from public.organization_calendar_approvals a
      join public.organization_calendar_events e on e.id = a.event_id
      where a.organization_id = p_org_id and a.approval_status = 'pending'
      union all
      select jsonb_build_object(
        'approval_id', l.id, 'approval_type', 'leave', 'title', 'Leave request',
        'approval_status', l.status, 'created_at', l.created_at
      )
      from public.organization_calendar_leave l
      where l.organization_id = p_org_id and l.status = 'pending'
    ) combined
    limit p_limit
  ), '[]'::jsonb);
exception when others then
  return '[]'::jsonb;
end; $$;

-- Business Pack communication entry point
create or replace function public.create_business_pack_communication(
  p_pack_key text,
  p_notification_type text,
  p_summary text,
  p_priority text default 'normal',
  p_user_id uuid default null,
  p_domain_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('communications.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := coalesce(p_user_id, public._mta_app_user_id());

  insert into public.organization_communication_notifications (
    organization_id, user_id, notification_type, priority, summary,
    source_type, domain_id, business_pack_key
  ) values (
    v_org_id, v_user_id, coalesce(p_notification_type, 'business_pack_event'),
    coalesce(p_priority, 'normal'), p_summary, p_pack_key, p_domain_id, p_pack_key
  );

  perform public._cme509_record_activity(v_org_id, 'business_pack', p_summary, v_user_id, null, p_domain_id, p_pack_key, null);
  perform public._cme509_log(v_org_id, 'notification_created', 'Business Pack notification', jsonb_build_object('pack_key', p_pack_key));
  return jsonb_build_object('ok', true);
end; $$;

-- Communication Management Center
create or replace function public.get_communication_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('communications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees should not need five different systems to communicate.',
    'structure', 'PLATFORM → APP → COMMUNICATION ENGINE → EMPLOYEES',
    'message_statuses', jsonb_build_array('pending', 'information', 'attention_required', 'completed', 'requires_approval', 'expired'),
    'priorities', jsonb_build_array('normal', 'important', 'critical', 'emergency'),
    'overview', jsonb_build_object(
      'unread_messages', (select count(*) from public.organization_communication_messages where organization_id = v_org_id and recipient_user_id = v_user_id and read_at is null and archived_at is null),
      'unread_notifications', (select count(*) from public.organization_communication_notifications where organization_id = v_org_id and user_id = v_user_id and read_at is null),
      'pending_approvals', jsonb_array_length(public._cme509_aggregate_approvals(v_org_id, 100)),
      'announcements', (select count(*) from public.organization_communication_announcements where organization_id = v_org_id and status = 'published')
    ),
    'inbox', coalesce((
      select jsonb_agg(public._cme509_message_json(m) order by m.created_at desc)
      from (
        select * from public.organization_communication_messages
        where organization_id = v_org_id and (recipient_user_id = v_user_id or recipient_user_id is null)
          and archived_at is null order by created_at desc limit 50
      ) m
    ), '[]'::jsonb),
    'direct_messages', coalesce((
      select jsonb_agg(public._cme509_message_json(m) order by m.created_at desc)
      from (
        select * from public.organization_communication_messages
        where organization_id = v_org_id and message_type = 'direct'
          and (sender_user_id = v_user_id or recipient_user_id = v_user_id)
        order by created_at desc limit 30
      ) m
    ), '[]'::jsonb),
    'announcements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'body', left(a.body, 300), 'scope', a.scope,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_communication_announcements a
      where a.organization_id = v_org_id and a.status = 'published'
      limit 30
    ), '[]'::jsonb),
    'notifications_preview', public._cme509_aggregate_notifications(v_org_id, v_user_id, 20),
    'approvals_preview', public._cme509_aggregate_approvals(v_org_id, 10),
    'activity_preview', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', act.id, 'activity_type', act.activity_type, 'summary', act.summary, 'created_at', act.created_at
      ) order by act.created_at desc)
      from public.organization_communication_activity act
      where act.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'department_feeds', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department_id', d.id, 'department_name', d.name,
        'message_count', (select count(*) from public.organization_communication_messages m where m.organization_id = v_org_id and m.department_id = d.id)
      ) order by d.name)
      from public.organization_departments d where d.organization_id = v_org_id and d.is_active = true
    ), '[]'::jsonb),
    'routes', jsonb_build_object(
      'notifications', '/app/notifications',
      'approvals', '/app/approvals',
      'activity', '/app/activity'
    ),
    'reports', jsonb_build_object(
      'unread_messages', (select count(*) from public.organization_communication_messages where organization_id = v_org_id and read_at is null),
      'notification_volume_30d', (select count(*) from public.organization_communication_notifications where organization_id = v_org_id and created_at >= now() - interval '30 days')
    )
  );
end; $$;

-- Notification Management Center
create or replace function public.get_notification_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return jsonb_build_object(
    'found', true,
    'principle', 'One Notification Engine — tasks, approvals, documents, Companion, and Business Packs in one place.',
    'notification_types', jsonb_build_array(
      'task_assigned', 'task_due', 'task_overdue', 'approval_required', 'approval_completed',
      'document_updated', 'knowledge_published', 'companion_alert', 'business_pack_event', 'license_warning'
    ),
    'priorities', jsonb_build_array('normal', 'important', 'critical', 'emergency'),
    'overview', jsonb_build_object(
      'unread', (select count(*) from public.organization_communication_notifications where organization_id = v_org_id and user_id = v_user_id and read_at is null),
      'critical', (select count(*) from public.organization_communication_notifications where organization_id = v_org_id and user_id = v_user_id and priority = 'critical' and read_at is null),
      'attention_required', (select count(*) from public.organization_communication_notifications where organization_id = v_org_id and user_id = v_user_id and status = 'attention_required')
    ),
    'notifications', public._cme509_aggregate_notifications(v_org_id, v_user_id, 100),
    'communications_route', '/app/communications'
  );
exception when others then
  perform public._irp_require_permission('communications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'notifications', public._cme509_aggregate_notifications(v_org_id, v_user_id, 100),
    'communications_route', '/app/communications'
  );
end; $$;

-- Activity Feed Center
create or replace function public.get_activity_feed_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('activity.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'found', true,
    'principle', 'Recent work, approvals, updates, and Companion suggestions in one feed.',
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', act.id, 'activity_type', act.activity_type, 'summary', act.summary,
        'actor_user_id', act.actor_user_id, 'department_id', act.department_id,
        'business_pack_key', act.business_pack_key, 'created_at', act.created_at
      ) order by act.created_at desc)
      from public.organization_communication_activity act
      where act.organization_id = v_org_id
      limit 100
    ), '[]'::jsonb),
    'recent_tasks', coalesce((
      select jsonb_agg(jsonb_build_object('id', t.id, 'title', t.title, 'status', t.status, 'updated_at', t.updated_at) order by t.updated_at desc)
      from (select * from public.organization_tasks where organization_id = v_org_id order by updated_at desc limit 10) t
    ), '[]'::jsonb),
    'recent_documents', coalesce((
      select jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status, 'updated_at', d.updated_at) order by d.updated_at desc)
      from (select * from public.organization_documents where organization_id = v_org_id order by updated_at desc limit 10) d
    ), '[]'::jsonb),
    'communications_route', '/app/communications'
  );
exception when others then
  perform public._irp_require_permission('communications.view');
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'found', true,
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object('id', act.id, 'activity_type', act.activity_type, 'summary', act.summary, 'created_at', act.created_at) order by act.created_at desc)
      from public.organization_communication_activity act where act.organization_id = v_org_id limit 100
    ), '[]'::jsonb)
  );
end; $$;

-- Unified Approval Center (Phase 509 aggregation)
create or replace function public.get_unified_approval_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_pending jsonb;
begin
  perform public._irp_require_permission('communications.view');
  v_org_id := public._mta_require_organization();
  v_pending := public._cme509_aggregate_approvals(v_org_id, 100);

  return jsonb_build_object(
    'found', true,
    'principle', 'All approval types in one place — tasks, documents, schedules, leave, and custom.',
    'approval_types', jsonb_build_array('task', 'document', 'calendar', 'leave', 'expense', 'custom'),
    'pending', v_pending,
    'pending_count', jsonb_array_length(coalesce(v_pending, '[]'::jsonb)),
    'routes', jsonb_build_object('trust_approvals', '/app/approvals', 'communications', '/app/communications')
  );
end; $$;

-- Actions
create or replace function public.perform_communication_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid; v_user_id uuid; v_msg_id uuid; v_row public.organization_communication_messages;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_msg_id := nullif(p_payload->>'message_id', '')::uuid;

  if p_action_type = 'send_message' then
    perform public._irp_require_permission('communications.manage');
    insert into public.organization_communication_messages (
      organization_id, message_type, subject, body, sender_user_id, recipient_user_id,
      department_id, domain_id, business_pack_key, priority, status
    ) values (
      v_org_id, coalesce(p_payload->>'message_type', 'direct'),
      left(trim(p_payload->>'subject'), 200), left(coalesce(p_payload->>'body', ''), 2000),
      v_user_id, nullif(p_payload->>'recipient_user_id', '')::uuid,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(p_payload->>'priority', 'normal'), 'pending'
    ) returning * into v_row;
    if v_row.recipient_user_id is not null then
      insert into public.organization_communication_notifications (
        organization_id, user_id, notification_type, summary, source_type, source_id
      ) values (v_org_id, v_row.recipient_user_id, 'message', 'New message: ' || v_row.subject, 'message', v_row.id);
    end if;
    perform public._cme509_record_activity(v_org_id, 'message', 'Message sent: ' || v_row.subject, v_user_id);
    perform public._cme509_log(v_org_id, 'message_sent', 'Message sent', p_payload);
    return jsonb_build_object('ok', true, 'message', public._cme509_message_json(v_row));

  elsif p_action_type = 'create_announcement' then
    perform public._irp_require_permission('communications.manage');
    insert into public.organization_communication_announcements (
      organization_id, title, body, scope, department_id, domain_id, business_pack_key, role_key, published_by
    ) values (
      v_org_id, left(trim(p_payload->>'title'), 200), left(coalesce(p_payload->>'body', ''), 2000),
      coalesce(p_payload->>'scope', 'organization'),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key', p_payload->>'role_key', v_user_id
    );
    perform public._cme509_record_activity(v_org_id, 'announcement', 'Announcement: ' || (p_payload->>'title'), v_user_id);
    perform public._cme509_log(v_org_id, 'announcement_created', 'Announcement published', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'mark_read' then
    perform public._irp_require_permission('communications.view');
    update public.organization_communication_messages set read_at = now(), status = 'completed', updated_at = now()
    where id = v_msg_id and organization_id = v_org_id and recipient_user_id = v_user_id;
    update public.organization_communication_notifications set read_at = now(), status = 'completed'
    where id = nullif(p_payload->>'notification_id', '')::uuid and organization_id = v_org_id and user_id = v_user_id;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'archive_message' then
    perform public._irp_require_permission('communications.view');
    update public.organization_communication_messages set archived_at = now(), updated_at = now()
    where id = v_msg_id and organization_id = v_org_id;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_notification' then
    perform public._irp_require_permission('communications.manage');
    insert into public.organization_communication_notifications (
      organization_id, user_id, notification_type, priority, status, summary, domain_id, business_pack_key
    ) values (
      v_org_id, coalesce(nullif(p_payload->>'user_id', '')::uuid, v_user_id),
      coalesce(p_payload->>'notification_type', 'system'),
      coalesce(p_payload->>'priority', 'normal'),
      coalesce(p_payload->>'status', 'pending'),
      p_payload->>'summary', nullif(p_payload->>'domain_id', '')::uuid, p_payload->>'business_pack_key'
    );
    perform public._cme509_log(v_org_id, 'notification_generated', 'Notification created', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

-- Search
create or replace function public.search_communications(p_query text default '', p_filters jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_q text := trim(coalesce(p_query, ''));
begin
  if not (public._irp_has_permission('communications.view') or public._irp_has_permission('notifications.view')) then
    raise exception 'Permission denied';
  end if;
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'found', true, 'query', v_q,
    'messages', coalesce((
      select jsonb_agg(public._cme509_message_json(m) order by m.created_at desc)
      from public.organization_communication_messages m
      where m.organization_id = v_org_id
        and (length(v_q) = 0 or m.subject ilike '%' || v_q || '%' or m.body ilike '%' || v_q || '%')
      limit 25
    ), '[]'::jsonb),
    'announcements', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title, 'body', left(a.body, 200)))
      from public.organization_communication_announcements a
      where a.organization_id = v_org_id and a.status = 'published'
        and (length(v_q) = 0 or a.title ilike '%' || v_q || '%' or a.body ilike '%' || v_q || '%')
      limit 25
    ), '[]'::jsonb),
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object('id', act.id, 'summary', act.summary, 'activity_type', act.activity_type))
      from public.organization_communication_activity act
      where act.organization_id = v_org_id and (length(v_q) = 0 or act.summary ilike '%' || v_q || '%')
      limit 25
    ), '[]'::jsonb)
  );
end; $$;

-- Companion context
create or replace function public.get_companion_communication_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_overdue int; v_pending_approvals int;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select count(*) into v_overdue from public.organization_tasks
  where organization_id = v_org_id and assigned_user_id = v_user_id and status = 'overdue';

  v_pending_approvals := jsonb_array_length(coalesce(public._cme509_aggregate_approvals(v_org_id, 100), '[]'::jsonb));

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps everyone stay informed — reminders, priorities, and daily briefings.',
    'overdue_tasks', v_overdue,
    'pending_approvals', v_pending_approvals,
    'unread_messages', (select count(*) from public.organization_communication_messages where organization_id = v_org_id and recipient_user_id = v_user_id and read_at is null),
    'unread_notifications', (select count(*) from public.organization_communication_notifications where organization_id = v_org_id and user_id = v_user_id and read_at is null),
    'companion_alerts', coalesce((
      select jsonb_agg(jsonb_build_object('summary', n.summary, 'priority', n.priority))
      from public.organization_communication_notifications n
      where n.organization_id = v_org_id and n.user_id = v_user_id and n.read_at is null
      limit 5
    ), '[]'::jsonb),
    'routes', jsonb_build_object(
      'communications', '/app/communications',
      'notifications', '/app/notifications',
      'activity', '/app/activity',
      'approvals', '/app/approvals'
    ),
    'supported_intents', jsonb_build_array(
      'since_last_login', 'overdue_tasks', 'pending_approvals', 'unread_messages', 'daily_briefing'
    ),
    'briefing_hint', case
      when v_overdue > 0 then 'You have ' || v_overdue || ' overdue task(s).'
      when v_pending_approvals > 0 then 'You have ' || v_pending_approvals || ' approval(s) waiting.'
      else 'No urgent items require attention.'
    end
  );
exception when others then
  return jsonb_build_object('found', false);
end; $$;

-- Navigation sync
do $$ begin
  if exists (select 1 from pg_proc where proname = '_dmn505_upsert_nav') then
    perform public._dmn505_upsert_nav(
      'communications', 'Communications', 'operations', 'message-square', '/app/communications',
      'communications', 'communications.view', null, 'app', 4, false, false
    );
    perform public._dmn505_upsert_nav(
      'notifications', 'Notifications', 'operations', 'bell', '/app/notifications',
      'notifications', 'notifications.view', null, 'app', 5, false, false
    );
    perform public._dmn505_upsert_nav(
      'activity', 'Activity', 'operations', 'activity', '/app/activity',
      'activity', 'activity.view', null, 'app', 8, false, false
    );
  end if;
end $$;

grant execute on function public.get_communication_management_center() to authenticated;
grant execute on function public.get_notification_management_center() to authenticated;
grant execute on function public.get_activity_feed_center() to authenticated;
grant execute on function public.get_unified_approval_center() to authenticated;
grant execute on function public.perform_communication_management_action(text, jsonb) to authenticated;
grant execute on function public.search_communications(text, jsonb) to authenticated;
grant execute on function public.create_business_pack_communication(text, text, text, text, uuid, uuid, jsonb) to authenticated;
grant execute on function public.get_companion_communication_context() to authenticated;
