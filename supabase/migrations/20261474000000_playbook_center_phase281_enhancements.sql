-- Phase 281 patch — Playbook Center enhancements (overview, actions, audit events)

alter table public.platform_playbook_audit_logs drop constraint if exists platform_playbook_audit_logs_event_type_check;

alter table public.platform_playbook_audit_logs add constraint platform_playbook_audit_logs_event_type_check
  check (
    event_type in (
      'playbook_created', 'playbook_updated', 'playbook_executed',
      'playbook_activated', 'playbook_paused', 'playbook_archived',
      'approval_granted', 'approval_rejected', 'automation_disabled'
    )
  );

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
  perform public._pbe281_seed_if_empty();

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

create or replace function public.record_platform_playbook_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id uuid;
  v_playbook_id uuid;
  v_template_id uuid;
begin
  perform public._pbe281_require_platform_admin();

  v_action := p_payload->>'action';
  v_id := (p_payload->>'id')::uuid;
  v_playbook_id := coalesce((p_payload->>'playbook_id')::uuid, v_id);
  v_template_id := (p_payload->>'template_id')::uuid;

  case v_action
    when 'create_playbook' then
      insert into public.platform_playbooks (
        name, category, description, owner, trigger_type, status, condition_summary, requires_approval
      ) values (
        coalesce(p_payload->>'name', 'New playbook'),
        coalesce(p_payload->>'category', 'support_operations'),
        coalesce(p_payload->>'description', ''),
        coalesce(p_payload->>'owner', ''),
        coalesce(p_payload->>'trigger_type', 'manual'),
        'draft',
        coalesce(p_payload->>'condition_summary', ''),
        coalesce((p_payload->>'requires_approval')::boolean, false)
      )
      returning id into v_playbook_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_created', 'Playbook created.', p_payload);

    when 'create_from_template' then
      insert into public.platform_playbooks (
        name, category, description, owner, trigger_type, status, condition_summary, requires_approval
      )
      select
        coalesce(p_payload->>'name', t.name || ' (copy)'),
        t.category,
        t.description,
        coalesce(p_payload->>'owner', t.owner),
        t.trigger_type,
        'draft',
        t.condition_summary,
        t.requires_approval
      from public.platform_playbooks t
      where t.id = v_template_id
      returning id into v_playbook_id;

      insert into public.platform_playbook_steps (playbook_id, step_order, action_type, label)
      select v_playbook_id, s.step_order, s.action_type, s.label
      from public.platform_playbook_steps s
      where s.playbook_id = v_template_id;

      perform public._pbe281_log_audit(v_playbook_id, 'playbook_created', 'Playbook created from template.', p_payload);

    when 'update_playbook' then
      update public.platform_playbooks set
        name = coalesce(p_payload->>'name', name),
        description = coalesce(p_payload->>'description', description),
        owner = coalesce(p_payload->>'owner', owner),
        category = coalesce(p_payload->>'category', category),
        trigger_type = coalesce(p_payload->>'trigger_type', trigger_type),
        condition_summary = coalesce(p_payload->>'condition_summary', condition_summary),
        requires_approval = coalesce((p_payload->>'requires_approval')::boolean, requires_approval),
        updated_at = now()
      where id = v_playbook_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_updated', 'Playbook updated.', p_payload);

    when 'duplicate_playbook' then
      v_template_id := v_playbook_id;
      insert into public.platform_playbooks (
        name, category, description, owner, trigger_type, status, condition_summary, requires_approval
      )
      select
        coalesce(p_payload->>'name', p.name || ' (copy)'),
        p.category,
        p.description,
        coalesce(p_payload->>'owner', p.owner),
        p.trigger_type,
        'draft',
        p.condition_summary,
        p.requires_approval
      from public.platform_playbooks p
      where p.id = v_template_id
      returning id into v_playbook_id;

      insert into public.platform_playbook_steps (playbook_id, step_order, action_type, label)
      select v_playbook_id, s.step_order, s.action_type, s.label
      from public.platform_playbook_steps s
      where s.playbook_id = v_template_id;

      perform public._pbe281_log_audit(v_playbook_id, 'playbook_created', 'Playbook duplicated.', p_payload);

    when 'update_status' then
      update public.platform_playbooks set
        status = coalesce(p_payload->>'status', status),
        updated_at = now()
      where id = v_playbook_id;
      perform public._pbe281_log_audit(
        v_playbook_id,
        case coalesce(p_payload->>'status', '')
          when 'active' then 'playbook_activated'
          when 'paused' then 'playbook_paused'
          when 'archived' then 'playbook_archived'
          else 'playbook_updated'
        end,
        coalesce(p_payload->>'summary', format('Playbook status updated to %s.', coalesce(p_payload->>'status', ''))),
        p_payload
      );

    when 'disable_automation' then
      update public.platform_playbooks set status = 'paused', updated_at = now() where id = v_playbook_id;
      perform public._pbe281_log_audit(v_playbook_id, 'automation_disabled', 'Automation disabled (paused).', p_payload);

    when 'execute_playbook' then
      insert into public.platform_playbook_executions (
        playbook_id, trigger_event, outcome, duration_seconds, owner,
        manual_intervention, approval_status
      ) values (
        v_playbook_id,
        coalesce(p_payload->>'trigger_event', 'Manual execution'),
        coalesce(p_payload->>'outcome', 'successful'),
        coalesce((p_payload->>'duration_seconds')::integer, 60),
        coalesce(p_payload->>'owner', ''),
        coalesce((p_payload->>'manual_intervention')::boolean, false),
        case when (select requires_approval from public.platform_playbooks where id = v_playbook_id)
          then 'pending' else null end
      )
      returning id into v_id;

      update public.platform_playbooks set last_executed_at = now(), updated_at = now() where id = v_playbook_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_executed', coalesce(p_payload->>'summary', 'Playbook executed.'), p_payload);

    when 'retry_execution' then
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      insert into public.platform_playbook_executions (
        playbook_id, trigger_event, outcome, duration_seconds, owner, manual_intervention
      )
      select
        playbook_id,
        'Retry: ' || trigger_event,
        'successful',
        duration_seconds,
        owner,
        false
      from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_executed', 'Execution retried.', p_payload);

    when 'escalate_execution' then
      update public.platform_playbook_executions set manual_intervention = true where id = v_id;
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_executed', 'Execution escalated for review.', p_payload);

    when 'grant_approval' then
      update public.platform_playbook_executions set approval_status = 'granted' where id = v_id;
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'approval_granted', coalesce(p_payload->>'summary', 'Approval granted.'), p_payload);

    when 'reject_approval' then
      update public.platform_playbook_executions set approval_status = 'rejected', outcome = 'cancelled' where id = v_id;
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'approval_rejected', coalesce(p_payload->>'summary', 'Approval rejected.'), p_payload);

    else
      raise exception 'Invalid action';
  end case;

  return public.get_platform_playbook_center(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_platform_playbook_center(jsonb) to authenticated;
grant execute on function public.record_platform_playbook_action(jsonb) to authenticated;

notify pgrst, 'reload schema';
