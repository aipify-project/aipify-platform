-- Phase 362 — Organizational Simplicity Engine
-- Feature owner: Customer App — /app/executive/organizational-simplicity
-- Upgrade: adds engine tables; replaces RPCs. Helpers: _osim_* (engine), _osimbp362_* (blueprint)

create table if not exists public.aipify_osim_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in ('strategic', 'operational', 'technical', 'leadership', 'customer', 'organizational')),
  signal_type text not null check (signal_type in (
    'unnecessary_complexity', 'duplicate_workflows', 'excessive_approval_layers',
    'communication_overload', 'usability_barriers'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_osim_center_signals enable row level security;
revoke all on public.aipify_osim_center_signals from authenticated, anon;

create table if not exists public.aipify_osim_center_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  question_key text not null,
  question_type text not null check (question_type in (
    'what_complicates_work', 'easier_to_understand', 'approvals_little_value',
    'avoidable_frustration', 'improve_usability'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, question_key)
);
alter table public.aipify_osim_center_questions enable row level security;
revoke all on public.aipify_osim_center_questions from authenticated, anon;

create table if not exists public.aipify_osim_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in ('strategic', 'operational', 'technical', 'leadership', 'customer', 'organizational')),
  title text not null,
  summary text not null default '',
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'archived')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_osim_center_initiatives enable row level security;
revoke all on public.aipify_osim_center_initiatives from authenticated, anon;

alter table public.aipify_osim_center_reviews drop constraint if exists aipify_osim_center_reviews_review_type_check;
alter table public.aipify_osim_center_reviews add constraint aipify_osim_center_reviews_review_type_check check (
  review_type in (
    'quarterly_simplicity', 'workflow_assessment', 'leadership_reflection', 'annual_evaluation',
    'executive_clarity', 'workflow_optimization', 'annual_simplification'
  )
);

alter table public.aipify_osim_center_timeline drop constraint if exists aipify_osim_center_timeline_event_type_check;
alter table public.aipify_osim_center_timeline add constraint aipify_osim_center_timeline_event_type_check check (
  event_type in (
    'workflow_improvement', 'bureaucracy_reduction', 'communication_refinement',
    'system_consolidation', 'organizational_breakthrough',
    'process_improvement', 'approval_reduction', 'tool_consolidation',
    'communication_enhancement', 'strategic_simplification'
  )
);

alter table public.aipify_osim_center_timeline drop constraint if exists aipify_osim_center_timeline_domain_check;
alter table public.aipify_osim_center_timeline add constraint aipify_osim_center_timeline_domain_check check (
  domain in ('strategic', 'operational', 'technical', 'leadership', 'customer', 'organizational',
    'process', 'communication', 'technology', 'governance', 'customer', 'leadership')
);

alter table public.aipify_osim_center_milestones drop constraint if exists aipify_osim_center_milestones_domain_check;
alter table public.aipify_osim_center_milestones add constraint aipify_osim_center_milestones_domain_check check (
  domain in ('strategic', 'operational', 'technical', 'leadership', 'customer', 'organizational',
    'process', 'communication', 'technology', 'governance', 'customer', 'leadership')
);

alter table public.aipify_osim_center_sessions drop constraint if exists aipify_osim_center_sessions_session_type_check;
alter table public.aipify_osim_center_sessions add constraint aipify_osim_center_sessions_session_type_check check (
  session_type in (
    'simplification_workshop', 'leadership_discussion', 'workflow_session',
    'workflow_review', 'cross_functional_discussion', 'executive_clarity'
  )
);

alter table public.aipify_osim_center_audit_logs drop constraint if exists aipify_osim_center_audit_logs_event_type_check;
alter table public.aipify_osim_center_audit_logs add constraint aipify_osim_center_audit_logs_event_type_check check (
  event_type in (
    'review_completed', 'simplicity_report_generated', 'simplification_initiative',
    'executive_action', 'governance_override', 'view_center', 'reflection_participation',
    'recommendation_surfaced', 'process_improvement'
  )
);

create or replace function public._osimbp362_core_principle() returns text language sql immutable as $$
  select 'Complexity consumes attention. Simplicity creates capacity. Organizations become stronger when they intentionally remove what no longer adds value.';
$$;

create or replace function public._osimbp362_philosophy() returns text language sql immutable as $$
  select 'Simplicity is not oversimplification. Simplicity means making the important understandable, accessible and actionable.';
$$;

create or replace function public._osimbp362_vision() returns text language sql immutable as $$
  select 'Help leaders remove unnecessary friction, improve usability and create environments where people can devote more energy to meaningful work.';
$$;

create or replace function public._osimbp362_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic simplicity'),
    jsonb_build_object('key', 'operational', 'label', 'Operational simplicity'),
    jsonb_build_object('key', 'technical', 'label', 'Technical simplicity'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership simplicity'),
    jsonb_build_object('key', 'customer', 'label', 'Customer simplicity'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational simplicity')
  );
$$;

create or replace function public._osimbp362_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 55 then 'healthy'
    when p_score >= 35 then 'developing'
    else 'simplification_recommended'
  end;
$$;

create or replace function public._osimbp362_privacy_note() returns text language sql immutable as $$
  select 'Simplicity Center stores organizational metadata and trend summaries only — never removes necessary safeguards, ignores nuance, or promotes shortcuts that compromise quality.';
$$;

create or replace function public._osimbp362_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 362 — Organizational Simplicity Engine',
    'route', '/app/executive/organizational-simplicity',
    'core_principle', public._osimbp362_core_principle(),
    'philosophy', public._osimbp362_philosophy(),
    'vision', public._osimbp362_vision(),
    'domains', public._osimbp362_domains(),
    'privacy_note', public._osimbp362_privacy_note()
  );
$$;

create or replace function public._osim_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_osim_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_osim_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig362_1', 'operational', 'duplicate_workflows', 'Duplicate workflows', 'Several approval workflows may benefit from simplification.', 'attention'),
  (p_tenant, 'sig362_2', 'technical', 'usability_barriers', 'Usability barriers', 'Several systems may benefit from improved integration.', 'attention'),
  (p_tenant, 'sig362_3', 'leadership', 'communication_overload', 'Communication clarity', 'Leadership communication demonstrates increasing clarity.', 'positive'),
  (p_tenant, 'sig362_4', 'customer', 'unnecessary_complexity', 'Customer experience', 'Onboarding experiences continue improving through reduced friction.', 'positive'),
  (p_tenant, 'sig362_5', 'organizational', 'excessive_approval_layers', 'Approval layers', 'Information accessibility continues improving organizational effectiveness.', 'neutral')
  on conflict do nothing;

  insert into public.aipify_osim_center_questions (
    tenant_id, question_key, question_type, title, summary
  ) values
  (p_tenant, 'que362_1', 'what_complicates_work', 'What complicates work', 'What unnecessarily complicates work?'),
  (p_tenant, 'que362_2', 'easier_to_understand', 'Easier to understand', 'What can be made easier to understand?'),
  (p_tenant, 'que362_3', 'approvals_little_value', 'Approval value', 'Which approvals add little value?'),
  (p_tenant, 'que362_4', 'avoidable_frustration', 'Avoidable frustration', 'What causes avoidable frustration?'),
  (p_tenant, 'que362_5', 'improve_usability', 'Improve usability', 'How can we improve usability responsibly?')
  on conflict do nothing;

  insert into public.aipify_osim_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini362_1', 'operational', 'Workflow simplification', 'Streamline core operational workflows and reduce administrative burden.', 'in_progress'),
  (p_tenant, 'ini362_2', 'technical', 'Navigation consolidation', 'Reduce system fragmentation through clearer navigation and integration.', 'in_progress'),
  (p_tenant, 'ini362_3', 'leadership', 'Communication refinement', 'Strengthen leadership communication clarity and transparent decisions.', 'planned')
  on conflict do nothing;

  insert into public.aipify_osim_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev362_q', 'quarterly_simplicity', 'Quarterly simplicity review — process clarity and bureaucratic burden.', 'pending'),
  (p_tenant, 'rev362_w', 'workflow_assessment', 'Workflow assessment — duplicate processes and approval layers.', 'pending'),
  (p_tenant, 'rev362_l', 'leadership_reflection', 'Leadership reflection session — communication effectiveness and focused priorities.', 'pending'),
  (p_tenant, 'rev362_a', 'annual_evaluation', 'Annual organizational evaluation — simplicity evolution and usability trends.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_osim_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl362_1', 'workflow_improvement', 'operational', 'Workflow improvement', 'Workflow improvements continue reducing administrative burden.', now() - interval '45 days'),
  (p_tenant, 'tl362_2', 'communication_refinement', 'leadership', 'Communication refinement', 'Leadership communication practices continue strengthening clarity.', now() - interval '30 days'),
  (p_tenant, 'tl362_3', 'system_consolidation', 'technical', 'System consolidation', 'Reduced system fragmentation improved navigation usability.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_osim_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil362_q', 'operational', 'Simplification milestone archived', 'Organizational simplification milestone archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_osim_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins362_1', 'Workflow improvements continue reducing administrative burden.', 'medium'),
  (p_tenant, 'ins362_2', 'Leadership communication demonstrates increasing clarity.', 'medium'),
  (p_tenant, 'ins362_3', 'Several systems may benefit from improved integration.', 'low')
  on conflict do nothing;

  insert into public.aipify_osim_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec362_1', 'Several operational workflows may benefit from simplification.', 'high'),
  (p_tenant, 'rec362_2', 'Leadership communication practices continue strengthening clarity.', 'medium'),
  (p_tenant, 'rec362_3', 'Reducing duplicate processes should remain a strategic consideration.', 'low')
  on conflict do nothing;

  insert into public.aipify_osim_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses362_1', 'simplification_workshop', 'Simplification workshop — friction reduction and workflow assessment.', 'pending'),
  (p_tenant, 'ses362_2', 'leadership_discussion', 'Leadership discussion — organizational usability and thoughtful governance.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_osim_center_snapshots (
    tenant_id, snapshot_key, period_label, simplicity_score, summary, captured_at
  ) values
  (p_tenant, 'snap362_q', 'Current quarter', 82, 'Organizational simplicity snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._osim_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sig as (
    select count(*) filter (where signal_tone = 'positive') as positive_count,
      count(*) filter (where signal_tone = 'attention') as attention_count
    from public.aipify_osim_center_signals where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status in ('planned', 'in_progress')) as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_osim_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_osim_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'simplicity_score', greatest(0, least(100, 72 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 5 - coalesce((select attention_count from sig), 0) * 3)),
    'simplicity_health_label', public._osimbp362_health_label(greatest(0, least(100, 72 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 5 - coalesce((select attention_count from sig), 0) * 3))::int),
    'complexity_reduction_pct', 78,
    'workflow_efficiency_pct', 81,
    'process_clarity_pct', 79,
    'navigation_simplicity_pct', 76,
    'communication_effectiveness_pct', 83,
    'bureaucratic_burden_pct', 34,
    'accessibility_pct', 80,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_simplicity_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._osim_require_tenant());
  perform public._irp_require_permission('org_simplicity.view', v_tenant);

  if not exists (select 1 from public.aipify_osim_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._osim_seed(v_tenant);
  end if;

  perform public._osim_log(v_tenant, 'view_center', 'Simplicity Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-simplicity',
    'dashboard', public._osim_dashboard_metrics(v_tenant),
    'simplicity_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_osim_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'friction_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'question_key', q.question_key, 'question_type', q.question_type,
      'title', q.title, 'summary', q.summary
    ) order by q.question_key) from public.aipify_osim_center_questions q where q.tenant_id = v_tenant), '[]'::jsonb),
    'simplification_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_osim_center_initiatives i where i.tenant_id = v_tenant and i.status <> 'archived'), '[]'::jsonb),
    'simplicity_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_osim_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_osim_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'simplicity_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_osim_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'simplicity_score', s.simplicity_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_osim_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osim_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osim_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'simplicity_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_osim_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'complexity_reduction', 'Complexity reduction indicators reflect thoughtful removal of unnecessary friction.',
      'workflow_efficiency', 'Workflow efficiency measures show gradual improvement across operational domains.',
      'leadership_communication', 'Leadership communication trends demonstrate increasing clarity and transparency.',
      'simplification_opportunities', 'Organizational simplification opportunities remain grounded in responsibility, not oversimplification.'
    ),
    'simplicity_domains', public._osimbp362_domains(),
    'blueprint', public._osimbp362_blueprint_summary(),
    'links', jsonb_build_object(
      'simplicity_center', '/app/executive/organizational-simplicity',
      'executive', '/app/executive',
      'organizational_focus', '/app/executive/organizational-focus',
      'organizational_energy', '/app/executive/organizational-energy',
      'organizational_clarity', '/app/executive/organizational-clarity',
      'purposeful_execution', '/app/executive/purposeful-execution',
      'continuous_improvement', '/app/executive/continuous-improvement'
    ),
    'privacy_note', public._osimbp362_privacy_note(),
    'can_manage', public._irp_has_permission('org_simplicity.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_simplicity.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_simplicity_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._osim_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_simplification_workshop', 'schedule_workflow_review',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_simplification_report', 'print_executive_summary', 'export_simplicity_snapshot', 'export_complexity_snapshot',
    'coordinate_leadership_discussion', 'coordinate_cross_functional_discussion',
    'archive_simplification_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_simplicity.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_osim_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._osim_log(v_tenant, 'review_completed', 'Simplicity review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_osim_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._osim_log(v_tenant, 'reflection_participation', 'Simplicity session completed', p_payload);
    elsif v_action in ('schedule_simplification_workshop', 'schedule_workflow_review') then
      perform public._osim_log(v_tenant, 'simplification_initiative', 'Simplification workshop scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_osim_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._osim_log(v_tenant, 'simplification_initiative', 'Simplification initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_osim_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_osim_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_simplification_report' then
      perform public._osim_log(v_tenant, 'simplicity_report_generated', 'Simplicity report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._osim_log(v_tenant, 'simplicity_report_generated', 'Executive summary exported', p_payload);
    elsif v_action in ('export_simplicity_snapshot', 'export_complexity_snapshot') then
      insert into public.aipify_osim_center_snapshots (
        tenant_id, snapshot_key, period_label, simplicity_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'simplicity_score')::int, (public._osim_dashboard_metrics(v_tenant)->>'simplicity_score')::int),
        left(coalesce(p_payload->>'summary', 'Simplicity snapshot exported.'), 500)
      );
      perform public._osim_log(v_tenant, 'simplicity_report_generated', 'Simplicity snapshot exported', p_payload);
    elsif v_action in ('coordinate_leadership_discussion', 'coordinate_cross_functional_discussion') then
      perform public._osim_log(v_tenant, 'reflection_participation', 'Leadership discussion coordinated', p_payload);
    elsif v_action = 'archive_simplification_milestone' then
      insert into public.aipify_osim_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'operational'),
        left(coalesce(p_payload->>'title', 'Simplification milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Simplification milestone archived.'), 500)
      );
      perform public._osim_log(v_tenant, 'process_improvement', 'Simplification milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_simplicity.manage', v_tenant);
    update public.aipify_osim_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._osim_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_simplicity.contribute', v_tenant);
    perform public._osim_log(v_tenant, 'simplification_initiative', 'Simplicity observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_simplicity_center(uuid) to authenticated;
grant execute on function public.process_organizational_simplicity_action(jsonb) to authenticated;
