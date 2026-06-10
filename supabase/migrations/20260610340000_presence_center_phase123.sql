-- Phase 12.3: Presence Center refinements (executive operations center)

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
  where approval_status in ('pending', 'pending_review');

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

alter table public.presence_settings
  add column if not exists sound_mode text not null default 'off'
    check (sound_mode in ('off', 'minimal', 'enabled')),
  add column if not exists learning_notifications boolean not null default true,
  add column if not exists view_mode text not null default 'operations'
    check (view_mode in ('executive', 'operations'));

update public.presence_settings
set sound_mode = case when sound_enabled then 'enabled' else 'off' end
where sound_mode = 'off' and sound_enabled = true;

-- Rich history metadata for expandable events
update public.presence_events
set metadata = jsonb_build_object(
  'trigger', 'Scheduled installation health scan',
  'actions', jsonb_build_array('Scanned active installations', 'Validated webhook endpoints', 'Recorded health score'),
  'outcome', 'Completed successfully'
)
where title = 'Health scan completed' and surface = 'platform';

update public.presence_events
set metadata = jsonb_build_object(
  'trigger', 'Support automation queue',
  'actions', jsonb_build_array('Classified incoming requests', 'Applied approved reply templates', 'Escalated edge cases'),
  'outcome', '3 cases resolved automatically'
)
where title = 'Support AI resolved 3 cases' and surface = 'platform';

update public.presence_events
set metadata = jsonb_build_object(
  'trigger', 'Webhook delivery failure detected',
  'actions', jsonb_build_array('Retried failed deliveries', 'Revalidated endpoint credentials', 'Confirmed delivery success'),
  'outcome', 'Webhook reconnected successfully'
)
where title = 'Webhook reconnected successfully' and surface = 'platform';

update public.presence_events
set metadata = jsonb_build_object(
  'trigger', 'Medium-risk healing strategy threshold',
  'actions', jsonb_build_array('Detected automation update scope', 'Classified as medium risk', 'Queued for human approval'),
  'outcome', 'Awaiting administrator confirmation'
)
where title = 'Approval requested for automation update' and surface = 'platform';

update public.presence_events
set metadata = jsonb_build_object(
  'trigger', 'Cross-environment pattern detection',
  'actions', jsonb_build_array('Correlated operational signals', 'Excluded customer content', 'Logged learning candidate'),
  'outcome', 'Pattern queued for review'
)
where title = 'Operational pattern discovered' and surface = 'platform';

update public.presence_events
set metadata = jsonb_build_object(
  'trigger', 'Weekly executive schedule',
  'actions', jsonb_build_array('Collected metrics', 'Generated summary', 'Flagged recommendations'),
  'outcome', 'Completed successfully'
)
where title = 'Executive summary prepared' and surface = 'platform';

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
  v_health_prev integer;
  v_health_delta integer;
  v_environments integer;
  v_recommendations_pending integer;
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
  from public.intelligence_patterns
  where approval_status in ('pending', 'pending_review');

  v_pending := v_pending + coalesce((
    select count(*) from public.ai_self_healing_executions
    where execution_result = 'pending_approval'
      and executed_at >= now() - interval '24 hours'
  ), 0);

  select count(*) into v_healing_today
  from public.ai_self_healing_executions
  where executed_at >= date_trunc('day', now())
    and execution_result = 'success';

  select count(*) into v_learning_today
  from public.ai_learning_events
  where created_at >= date_trunc('day', now());

  select count(*) into v_automations
  from public.platform_automations where status = 'active';

  v_health := coalesce((
    select automation_coverage from public.brain_metrics
    order by recorded_at desc limit 1
  ), 90);

  v_health_prev := coalesce((
    select automation_coverage from public.brain_metrics
    where recorded_at <= now() - interval '7 days'
    order by recorded_at desc limit 1
  ), v_health - 4);

  v_health_delta := v_health - v_health_prev;

  select
    coalesce((select count(*) from public.customer_installations where status in ('active', 'pending')), 0)
    + coalesce((select count(*) from public.customers where customer_status in ('active', 'trial')), 0)
    + 2
  into v_environments;

  select count(*) into v_recommendations_pending
  from public.intelligence_patterns
  where approval_status in ('pending', 'pending_review');

  return jsonb_build_object(
    'state', v_state,
    'activity', coalesce(v_activity, '{}'::jsonb),
    'snapshot', jsonb_build_object(
      'environments_monitored', v_environments,
      'learning_events_today', v_learning_today,
      'healing_completed_today', v_healing_today,
      'recommendations_pending', v_recommendations_pending
    ),
    'health_trend', jsonb_build_object(
      'score', v_health,
      'delta_week', v_health_delta,
      'contributors', jsonb_build_array(
        'Reduced escalations',
        'Improved automation success',
        'Faster healing response'
      )
    ),
    'approval_context', case
      when v_state in ('human_approval_required', 'critical_attention') then jsonb_build_object(
        'risk_level', coalesce(v_activity->>'risk_level', 'medium'),
        'reasons', jsonb_build_array(
          'Financial impact detected',
          'Customer-facing change proposed',
          'Automation threshold exceeded',
          'Configuration update suggested'
        )
      )
      else null
    end,
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
      (select jsonb_agg(rec order by (rec->>'confidence')::int desc)
       from (
         select jsonb_build_object(
           'id', gp.id,
           'message', gp.pattern_title,
           'confidence', gp.confidence_score,
           'impact_level', case
             when gp.confidence_score >= 95 then 'critical'
             when gp.confidence_score >= 85 then 'high'
             when gp.confidence_score >= 65 then 'medium'
             else 'low'
           end,
           'what_happened', gp.pattern_title,
           'why_matters', coalesce(gp.potential_impact_items->>0, 'Operational reliability and customer experience may be affected.'),
           'suggested_action', gp.suggested_action,
           'if_ignored', case
             when gp.category ilike '%webhook%' then 'Automation interruptions may continue after integration updates.'
             when gp.category ilike '%onboard%' then 'Onboarding friction and support load may persist.'
             else 'Related operational issues may continue without intervention.'
           end
         ) as rec
         from public.global_patterns gp
         where gp.active = true
         limit 5
       ) items),
      '[]'::jsonb
    ),
    'executive_summary', (
      select 'Platform health at ' || v_health::text || '% with ' || v_learning_today::text
        || ' learning signals today and ' || v_healing_today::text || ' successful healing actions.'
    ),
    'settings', coalesce(
      (select jsonb_build_object(
        'animation_intensity', ps.animation_intensity,
        'presence_visible', ps.presence_visible,
        'executive_summaries', ps.executive_summaries,
        'self_healing_notifications', ps.self_healing_notifications,
        'approval_notifications', ps.approval_notifications,
        'sound_enabled', ps.sound_enabled,
        'sound_mode', ps.sound_mode,
        'learning_notifications', ps.learning_notifications,
        'view_mode', ps.view_mode
      )
      from public.presence_settings ps
      where ps.surface = p_surface and ps.tenant_id is null),
      jsonb_build_object(
        'animation_intensity', 'normal',
        'presence_visible', true,
        'executive_summaries', true,
        'self_healing_notifications', true,
        'approval_notifications', true,
        'sound_enabled', false,
        'sound_mode', 'off',
        'learning_notifications', true,
        'view_mode', 'operations'
      )
    )
  );
end;
$$;

drop function if exists public.update_presence_settings(text, text, boolean, boolean, boolean, boolean, boolean);

create or replace function public.update_presence_settings(
  p_surface text,
  p_animation_intensity text default null,
  p_presence_visible boolean default null,
  p_executive_summaries boolean default null,
  p_self_healing_notifications boolean default null,
  p_approval_notifications boolean default null,
  p_sound_enabled boolean default null,
  p_sound_mode text default null,
  p_learning_notifications boolean default null,
  p_view_mode text default null
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
    sound_enabled = coalesce(
      p_sound_enabled,
      case p_sound_mode when 'enabled' then true when 'off' then false else sound_enabled end
    ),
    sound_mode = coalesce(p_sound_mode, sound_mode),
    learning_notifications = coalesce(p_learning_notifications, learning_notifications),
    view_mode = coalesce(p_view_mode, view_mode),
    updated_at = now()
  where surface = p_surface and tenant_id is null;

  return (select jsonb_build_object(
    'animation_intensity', ps.animation_intensity,
    'presence_visible', ps.presence_visible,
    'executive_summaries', ps.executive_summaries,
    'self_healing_notifications', ps.self_healing_notifications,
    'approval_notifications', ps.approval_notifications,
    'sound_enabled', ps.sound_enabled,
    'sound_mode', ps.sound_mode,
    'learning_notifications', ps.learning_notifications,
    'view_mode', ps.view_mode
  )
  from public.presence_settings ps
  where ps.surface = p_surface and ps.tenant_id is null);
end;
$$;

grant execute on function public.update_presence_settings(
  text, text, boolean, boolean, boolean, boolean, boolean, text, boolean, text
) to authenticated;
