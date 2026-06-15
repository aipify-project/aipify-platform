-- Phase 292 — Playbook Center read-only page load (remove lazy seed from GET RPC)

create or replace function public.get_platform_playbook_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_playbooks jsonb;
  v_templates jsonb;
  v_executions jsonb;
  v_audit jsonb;
  v_category_filter text;
  v_status_filter text;
  v_trigger_filter text;
  v_owner_filter text;
  v_outcome_filter text;
begin
  perform public._pbe281_require_platform_admin();

  v_category_filter := nullif(p_filters->>'category', '');
  v_status_filter := nullif(p_filters->>'status', '');
  v_trigger_filter := nullif(p_filters->>'trigger_type', '');
  v_owner_filter := nullif(p_filters->>'owner', '');
  v_outcome_filter := nullif(p_filters->>'outcome', '');

  v_overview := jsonb_build_object(
    'active_playbooks', (select count(*)::int from public.platform_playbooks where status = 'active' and is_template = false),
    'scheduled_automations', (select count(*)::int from public.platform_playbooks where status = 'active' and trigger_type = 'scheduled' and is_template = false),
    'running_automations', (select count(*)::int from public.platform_playbooks where status = 'active' and trigger_type <> 'manual' and is_template = false),
    'failed_executions', (select count(*)::int from public.platform_playbook_executions where outcome = 'failed'),
    'pending_approvals', (select count(*)::int from public.platform_playbook_executions where approval_status = 'pending'),
    'recently_completed', (
      select count(*)::int from public.platform_playbook_executions
      where outcome in ('successful', 'partially_successful')
        and executed_at >= now() - interval '7 days'
    )
  );

  select coalesce(jsonb_agg(public._pbe281_build_playbook_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_playbooks
  from public.platform_playbooks p
  where p.is_template = false
    and (nullif(p_filters->>'playbook_id', '') is null or p.id = (p_filters->>'playbook_id')::uuid)
    and (v_category_filter is null or p.category = v_category_filter)
    and (v_status_filter is null or p.status = v_status_filter)
    and (v_trigger_filter is null or p.trigger_type = v_trigger_filter)
    and (v_owner_filter is null or p.owner ilike '%' || v_owner_filter || '%');

  select coalesce(jsonb_agg(public._pbe281_build_playbook_row(p) order by p.name), '[]'::jsonb)
  into v_templates
  from public.platform_playbooks p
  where p.is_template = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'playbook_id', e.playbook_id,
    'playbook_name', p.name,
    'trigger_event', e.trigger_event,
    'outcome', e.outcome,
    'duration_seconds', e.duration_seconds,
    'owner', e.owner,
    'manual_intervention', e.manual_intervention,
    'approval_status', e.approval_status,
    'executed_at', e.executed_at
  ) order by e.executed_at desc), '[]'::jsonb)
  into v_executions
  from public.platform_playbook_executions e
  join public.platform_playbooks p on p.id = e.playbook_id
  where (v_outcome_filter is null or e.outcome = v_outcome_filter)
    and (nullif(p_filters->>'playbook_id', '') is null or e.playbook_id = (p_filters->>'playbook_id')::uuid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'playbook_id', l.playbook_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.platform_playbook_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'The best organizations do not rely solely on memory. They build repeatable systems that help people perform consistently and confidently.',
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'playbooks', v_playbooks,
    'templates', v_templates,
    'executions', v_executions,
    'audit', v_audit
  );
end;
$$;
