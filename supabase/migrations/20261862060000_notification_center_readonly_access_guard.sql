-- Phase 620 P1 — align Notification Center RPC with read-only notifications.view gate.

create or replace function public.get_notification_orchestration_center(p_section text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_approvals jsonb;
begin
  if not public.has_organization_permission('notifications.view') then
    raise exception 'Permission denied: notifications.view';
  end if;

  v_user_id := public._mta_app_user_id();

  select c.id
  into v_org_id
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.id = v_user_id
  limit 1;

  if v_org_id is null then
    raise exception 'Organization context required';
  end if;

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
end;
$$;

grant execute on function public.get_notification_orchestration_center(text) to authenticated;
