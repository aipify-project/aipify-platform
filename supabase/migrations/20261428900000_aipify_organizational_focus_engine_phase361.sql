-- Phase 361 — Organizational Focus Engine
-- Feature owner: Customer App — /app/executive/organizational-focus
-- Upgrade: adds engine tables; replaces RPCs. Helpers: _ofc_* (engine), _ofcbp361_* (blueprint)

create table if not exists public.aipify_ofc_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in ('strategic', 'leadership', 'team', 'customer', 'operational', 'organizational')),
  signal_type text not null check (signal_type in (
    'competing_priorities', 'attention_fragmentation', 'initiative_overload', 'concentration_opportunities', 'execution_distractions'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_ofc_center_signals enable row level security;
revoke all on public.aipify_ofc_center_signals from authenticated, anon;

create table if not exists public.aipify_ofc_center_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  question_key text not null,
  question_type text not null check (question_type in (
    'what_matters_most', 'initiatives_deserve_attention', 'what_to_stop', 'attention_diluted', 'simplify_execution'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, question_key)
);
alter table public.aipify_ofc_center_questions enable row level security;
revoke all on public.aipify_ofc_center_questions from authenticated, anon;

create table if not exists public.aipify_ofc_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in ('strategic', 'leadership', 'team', 'customer', 'operational', 'organizational')),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_ofc_center_milestones enable row level security;
revoke all on public.aipify_ofc_center_milestones from authenticated, anon;

create table if not exists public.aipify_ofc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'reflection_session' check (session_type in (
    'reflection_session', 'prioritization_session', 'leadership_discussion'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_ofc_center_sessions enable row level security;
revoke all on public.aipify_ofc_center_sessions from authenticated, anon;

alter table public.aipify_ofc_center_initiatives drop constraint if exists aipify_ofc_center_initiatives_domain_check;
alter table public.aipify_ofc_center_initiatives add constraint aipify_ofc_center_initiatives_domain_check check (
  domain in ('strategic', 'leadership', 'team', 'customer', 'operational', 'organizational')
);

alter table public.aipify_ofc_center_reviews drop constraint if exists aipify_ofc_center_reviews_review_type_check;
alter table public.aipify_ofc_center_reviews add constraint aipify_ofc_center_reviews_review_type_check check (
  review_type in (
    'monthly_focus', 'quarterly_prioritization', 'leadership_reflection', 'annual_strategic_assessment',
    'weekly', 'monthly', 'quarterly', 'annual'
  )
);

alter table public.aipify_ofc_center_timeline add column if not exists domain text not null default 'strategic';
alter table public.aipify_ofc_center_timeline drop constraint if exists aipify_ofc_center_timeline_event_type_check;
alter table public.aipify_ofc_center_timeline add constraint aipify_ofc_center_timeline_event_type_check check (
  event_type in (
    'strategic_priorities_established', 'initiative_consolidation', 'leadership_reflection', 'execution_breakthrough', 'organizational_simplification',
    'priority_shift', 'initiative_added', 'initiative_completed', 'focus_improvement', 'executive_intervention'
  )
);

alter table public.aipify_ofc_center_audit_logs drop constraint if exists aipify_ofc_center_audit_logs_event_type_check;
alter table public.aipify_ofc_center_audit_logs add constraint aipify_ofc_center_audit_logs_event_type_check check (
  event_type in (
    'review_completed', 'prioritization_decision', 'recommendation_generated',
    'executive_action', 'initiative_adjustment', 'governance_override', 'view_center',
    'reflection_participation', 'leadership_initiative_documented', 'recommendation_surfaced',
    'focus_report_generated'
  )
);

create or replace function public._ofcbp361_core_principle() returns text language sql immutable as $$
  select 'Organizations rarely fail because they care about too little. They often struggle because they attempt to focus on too much at the same time. Focus creates clarity.';
$$;

create or replace function public._ofcbp361_philosophy() returns text language sql immutable as $$
  select 'Focus is not doing fewer important things. Focus is intentionally directing limited attention toward what creates the greatest value.';
$$;

create or replace function public._ofcbp361_vision() returns text language sql immutable as $$
  select 'Help leaders strengthen clarity, reduce distraction and ensure that the organization''s energy remains directed toward what matters most.';
$$;

create or replace function public._ofcbp361_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic focus'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership focus'),
    jsonb_build_object('key', 'team', 'label', 'Team focus'),
    jsonb_build_object('key', 'customer', 'label', 'Customer focus'),
    jsonb_build_object('key', 'operational', 'label', 'Operational focus'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational focus')
  );
$$;

create or replace function public._ofcbp361_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 55 then 'healthy'
    when p_score >= 35 then 'developing'
    else 'focus_reinforcement_recommended'
  end;
$$;

create or replace function public._ofcbp361_privacy_note() returns text language sql immutable as $$
  select 'Focus Center stores organizational metadata and trend summaries only — never promotes tunnel vision, replaces executive judgment, or oversimplifies organizational complexity.';
$$;

create or replace function public._ofcbp361_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 361 — Organizational Focus Engine',
    'route', '/app/executive/organizational-focus',
    'core_principle', public._ofcbp361_core_principle(),
    'philosophy', public._ofcbp361_philosophy(),
    'vision', public._ofcbp361_vision(),
    'domains', public._ofcbp361_domains(),
    'privacy_note', public._ofcbp361_privacy_note()
  );
$$;

create or replace function public._ofc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_ofc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_ofc_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig361_1', 'strategic', 'concentration_opportunities', 'Priority clarity', 'Strategic priorities remain well aligned across departments.', 'positive'),
  (p_tenant, 'sig361_2', 'leadership', 'competing_priorities', 'Leadership reinforcement', 'Leadership communication continues reinforcing strategic focus.', 'positive'),
  (p_tenant, 'sig361_3', 'team', 'initiative_overload', 'Initiative overload', 'Several initiatives may benefit from stronger prioritization.', 'attention'),
  (p_tenant, 'sig361_4', 'operational', 'execution_distractions', 'Workflow complexity', 'Several workflows may benefit from simplification.', 'attention'),
  (p_tenant, 'sig361_5', 'organizational', 'attention_fragmentation', 'Attention fragmentation', 'Attention dilution warrants thoughtful executive review.', 'neutral')
  on conflict do nothing;

  insert into public.aipify_ofc_center_questions (
    tenant_id, question_key, question_type, title, summary
  ) values
  (p_tenant, 'que361_1', 'what_matters_most', 'What matters most', 'What matters most right now?'),
  (p_tenant, 'que361_2', 'initiatives_deserve_attention', 'Initiative attention', 'Which initiatives deserve our full attention?'),
  (p_tenant, 'que361_3', 'what_to_stop', 'What to stop', 'What should we stop doing?'),
  (p_tenant, 'que361_4', 'attention_diluted', 'Attention dilution', 'Where is attention being diluted?'),
  (p_tenant, 'que361_5', 'simplify_execution', 'Simplify execution', 'How can we simplify execution?')
  on conflict do nothing;

  insert into public.aipify_ofc_center_initiatives (
    tenant_id, initiative_key, domain, title, owner_label, summary, focus_score, status
  ) values
  (p_tenant, 'ini361_1', 'strategic', 'Strategic priority consolidation', 'Executive team', 'Align initiative portfolio with highest-value strategic outcomes.', 82, 'active'),
  (p_tenant, 'ini361_2', 'team', 'Context switching reduction', 'Operations', 'Reduce context switching through clearer ownership and prioritization.', 76, 'active'),
  (p_tenant, 'ini361_3', 'operational', 'Workflow simplification', 'Process lead', 'Eliminate unnecessary complexity in core workflows.', 71, 'active')
  on conflict do nothing;

  insert into public.aipify_ofc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev361_m', 'monthly_focus', 'Monthly focus review — priority alignment and initiative concentration.', 'pending'),
  (p_tenant, 'rev361_q', 'quarterly_prioritization', 'Quarterly prioritization discussion — strategic discipline and resource concentration.', 'pending'),
  (p_tenant, 'rev361_l', 'leadership_reflection', 'Leadership reflection session — attention discipline and communication consistency.', 'pending'),
  (p_tenant, 'rev361_a', 'annual_strategic_assessment', 'Annual strategic assessment — focus evolution and execution clarity.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_ofc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl361_1', 'strategic_priorities_established', 'strategic', 'Strategic priorities established', 'Executive team clarified top organizational priorities for the quarter.', now() - interval '45 days'),
  (p_tenant, 'tl361_2', 'initiative_consolidation', 'team', 'Initiative consolidation', 'Cross-functional initiative portfolio consolidated for clearer execution.', now() - interval '30 days'),
  (p_tenant, 'tl361_3', 'organizational_simplification', 'operational', 'Workflow simplification', 'Operational simplification reduced execution distractions.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_ofc_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil361_q', 'strategic', 'Focus milestone archived', 'Strategic focus milestone archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_ofc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins361_1', 'Strategic priorities remain well aligned across departments.', 'medium'),
  (p_tenant, 'ins361_2', 'Execution effectiveness continues improving through clearer ownership.', 'medium'),
  (p_tenant, 'ins361_3', 'Several workflows may benefit from simplification.', 'low')
  on conflict do nothing;

  insert into public.aipify_ofc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec361_1', 'Several strategic initiatives may benefit from clearer prioritization.', 'high'),
  (p_tenant, 'rec361_2', 'Leadership reinforcement remains an important contributor to focus.', 'medium'),
  (p_tenant, 'rec361_3', 'Execution simplicity should remain a strategic consideration.', 'low')
  on conflict do nothing;

  insert into public.aipify_ofc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses361_1', 'prioritization_session', 'Prioritization session — what matters most and what to stop.', 'pending'),
  (p_tenant, 'ses361_2', 'leadership_discussion', 'Leadership discussion — strategic concentration and focus discipline.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_ofc_center_snapshots (
    tenant_id, snapshot_key, initiative_label, focus_score, summary, captured_at
  ) values
  (p_tenant, 'snap361_q', 'Current quarter', 81, 'Organizational focus snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._ofc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sig as (
    select count(*) filter (where signal_tone = 'positive') as positive_count
    from public.aipify_ofc_center_signals where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status in ('active', 'in_progress')) as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_ofc_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_ofc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'focus_score', greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3)),
    'focus_health_label', public._ofcbp361_health_label(greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3))::int),
    'priority_alignment_pct', 84,
    'initiative_concentration_pct', 79,
    'execution_clarity_pct', 81,
    'priority_clarity_pct', 83,
    'initiative_overload_risk_pct', 28,
    'leadership_consistency_pct', 82,
    'resource_concentration_pct', 78,
    'strategic_discipline_pct', 80,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_focus_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._ofc_require_tenant());
  perform public._irp_require_permission('org_focus.view', v_tenant);

  if not exists (select 1 from public.aipify_ofc_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._ofc_seed(v_tenant);
  end if;

  perform public._ofc_log(v_tenant, 'view_center', 'Focus Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-focus',
    'dashboard', public._ofc_dashboard_metrics(v_tenant),
    'focus_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_ofc_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'priority_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'question_key', q.question_key, 'question_type', q.question_type,
      'title', q.title, 'summary', q.summary
    ) order by q.question_key) from public.aipify_ofc_center_questions q where q.tenant_id = v_tenant), '[]'::jsonb),
    'focus_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary,
      'status', case i.status when 'active' then 'in_progress' when 'archived' then 'completed' else i.status end
    ) order by i.focus_score desc)
      from public.aipify_ofc_center_initiatives i where i.tenant_id = v_tenant and i.status <> 'archived'), '[]'::jsonb),
    'focus_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_ofc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_ofc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'focus_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_ofc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.initiative_label,
      'focus_score', s.focus_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_ofc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ofc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ofc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'focus_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_ofc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'priority_alignment', 'Priority alignment indicators reflect disciplined attention toward highest-value outcomes.',
      'strategic_concentration', 'Strategic concentration trends demonstrate intentional resource allocation.',
      'leadership_reinforcement', 'Leadership reinforcement measures show consistent communication of priorities.',
      'focus_opportunities', 'Organizational focus opportunities remain grounded in reflection, not excessive minimalism.'
    ),
    'focus_domains', public._ofcbp361_domains(),
    'blueprint', public._ofcbp361_blueprint_summary(),
    'links', jsonb_build_object(
      'focus_center', '/app/executive/organizational-focus',
      'executive', '/app/executive',
      'organizational_energy', '/app/executive/organizational-energy',
      'organizational_clarity', '/app/executive/organizational-clarity',
      'organizational_simplicity', '/app/executive/organizational-simplicity',
      'purposeful_execution', '/app/executive/purposeful-execution',
      'change_management', '/app/executive/change-management'
    ),
    'privacy_note', public._ofcbp361_privacy_note(),
    'can_manage', public._irp_has_permission('org_focus.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_focus.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_focus_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._ofc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session', 'schedule_prioritization_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_focus_report', 'print_executive_summary', 'export_focus_snapshot',
    'coordinate_leadership_discussion', 'archive_focus_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_focus.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_ofc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._ofc_log(v_tenant, 'review_completed', 'Focus review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_ofc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._ofc_log(v_tenant, 'reflection_participation', 'Focus session completed', p_payload);
    elsif v_action in ('schedule_reflection_session', 'schedule_prioritization_session') then
      perform public._ofc_log(v_tenant, 'reflection_participation', 'Focus session scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_ofc_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._ofc_log(v_tenant, 'leadership_initiative_documented', 'Focus initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_ofc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_ofc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_focus_report' then
      perform public._ofc_log(v_tenant, 'focus_report_generated', 'Focus report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._ofc_log(v_tenant, 'focus_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_focus_snapshot' then
      insert into public.aipify_ofc_center_snapshots (
        tenant_id, snapshot_key, initiative_label, focus_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'focus_score')::int, (public._ofc_dashboard_metrics(v_tenant)->>'focus_score')::int),
        left(coalesce(p_payload->>'summary', 'Focus snapshot exported.'), 500)
      );
      perform public._ofc_log(v_tenant, 'focus_report_generated', 'Focus snapshot exported', p_payload);
    elsif v_action = 'coordinate_leadership_discussion' then
      perform public._ofc_log(v_tenant, 'reflection_participation', 'Leadership discussion coordinated', p_payload);
    elsif v_action = 'archive_focus_milestone' then
      insert into public.aipify_ofc_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'strategic'),
        left(coalesce(p_payload->>'title', 'Focus milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Focus milestone archived.'), 500)
      );
      perform public._ofc_log(v_tenant, 'review_completed', 'Focus milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_focus.manage', v_tenant);
    update public.aipify_ofc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._ofc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_focus.contribute', v_tenant);
    perform public._ofc_log(v_tenant, 'prioritization_decision', 'Focus observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_focus_center(uuid) to authenticated;
grant execute on function public.process_organizational_focus_action(jsonb) to authenticated;
