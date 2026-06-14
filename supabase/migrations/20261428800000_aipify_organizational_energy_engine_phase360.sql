-- Phase 360 — Organizational Energy Engine
-- Feature owner: Customer App — /app/executive/organizational-energy
-- Upgrade: adds engine tables; replaces RPCs. Helpers: _oec_* (engine), _oecbp360_* (blueprint)

create table if not exists public.aipify_oec_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in ('individual', 'team', 'leadership', 'customer', 'operational', 'organizational')),
  signal_type text not null check (signal_type in (
    'energy_sources', 'energy_drains', 'sustainable_momentum_patterns', 'friction_points', 'recovery_opportunities'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_oec_center_signals enable row level security;
revoke all on public.aipify_oec_center_signals from authenticated, anon;

create table if not exists public.aipify_oec_center_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  question_key text not null,
  question_type text not null check (question_type in (
    'current_energizers', 'unnecessary_drains', 'sustainable_pacing', 'systems_supporting_people', 'strengthen_momentum'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, question_key)
);
alter table public.aipify_oec_center_questions enable row level security;
revoke all on public.aipify_oec_center_questions from authenticated, anon;

create table if not exists public.aipify_oec_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in ('individual', 'team', 'leadership', 'customer', 'operational', 'organizational')),
  title text not null,
  summary text not null default '',
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_oec_center_initiatives enable row level security;
revoke all on public.aipify_oec_center_initiatives from authenticated, anon;

create table if not exists public.aipify_oec_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in ('individual', 'team', 'leadership', 'customer', 'operational', 'organizational')),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_oec_center_milestones enable row level security;
revoke all on public.aipify_oec_center_milestones from authenticated, anon;

create table if not exists public.aipify_oec_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'reflection_session' check (session_type in (
    'reflection_session', 'stewardship_session', 'leadership_discussion'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_oec_center_sessions enable row level security;
revoke all on public.aipify_oec_center_sessions from authenticated, anon;

alter table public.aipify_oec_center_reviews drop constraint if exists aipify_oec_center_reviews_review_type_check;
alter table public.aipify_oec_center_reviews add constraint aipify_oec_center_reviews_review_type_check check (
  review_type in (
    'monthly_energy', 'quarterly_leadership_reflection', 'team_sustainability', 'annual_assessment',
    'monthly', 'quarterly', 'annual', 'executive_wellbeing'
  )
);

alter table public.aipify_oec_center_timeline add column if not exists domain text not null default 'organizational';
alter table public.aipify_oec_center_timeline drop constraint if exists aipify_oec_center_timeline_event_type_check;
alter table public.aipify_oec_center_timeline add constraint aipify_oec_center_timeline_event_type_check check (
  event_type in (
    'recovery_milestone', 'momentum_breakthrough', 'leadership_reflection', 'collaboration_achievement', 'sustainability_initiative',
    'intensity_period', 'recovery_period', 'initiative_peak', 'strategic_pause', 'org_transition'
  )
);

alter table public.aipify_oec_center_audit_logs drop constraint if exists aipify_oec_center_audit_logs_event_type_check;
alter table public.aipify_oec_center_audit_logs add constraint aipify_oec_center_audit_logs_event_type_check check (
  event_type in (
    'review_completed', 'recommendation_generated', 'executive_reflection',
    'sustainability_initiative', 'trend_archived', 'governance_override', 'view_center',
    'reflection_participation', 'leadership_initiative_documented', 'recommendation_surfaced',
    'energy_report_generated'
  )
);

create or replace function public._oecbp360_core_principle() returns text language sql immutable as $$
  select 'Organizations do not run on strategy alone. They run on human energy. Energy determines whether people can execute, collaborate, innovate and persevere over time.';
$$;

create or replace function public._oecbp360_philosophy() returns text language sql immutable as $$
  select 'Energy is not constant intensity. Energy is the sustainable capacity to contribute meaningfully.';
$$;

create or replace function public._oecbp360_vision() returns text language sql immutable as $$
  select 'Help leaders strengthen momentum, preserve resilience and ensure that the energy required for meaningful work remains sustainable for the future.';
$$;

create or replace function public._oecbp360_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'individual', 'label', 'Individual energy'),
    jsonb_build_object('key', 'team', 'label', 'Team energy'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership energy'),
    jsonb_build_object('key', 'customer', 'label', 'Customer energy'),
    jsonb_build_object('key', 'operational', 'label', 'Operational energy'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational energy')
  );
$$;

create or replace function public._oecbp360_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'thriving'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'balanced'
    when p_score >= 35 then 'strained'
    else 'energy_reinforcement_recommended'
  end;
$$;

create or replace function public._oecbp360_privacy_note() returns text language sql immutable as $$
  select 'Energy Center stores organizational metadata and trend summaries only — never monitors individuals, encourages burnout, or replaces leadership responsibility.';
$$;

create or replace function public._oecbp360_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 360 — Organizational Energy Engine',
    'route', '/app/executive/organizational-energy',
    'core_principle', public._oecbp360_core_principle(),
    'philosophy', public._oecbp360_philosophy(),
    'vision', public._oecbp360_vision(),
    'domains', public._oecbp360_domains(),
    'privacy_note', public._oecbp360_privacy_note()
  );
$$;

create or replace function public._oec_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_oec_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_oec_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig360_1', 'team', 'energy_sources', 'Collaboration vitality', 'Cross-functional collaboration continues contributing positively to organizational energy.', 'positive'),
  (p_tenant, 'sig360_2', 'leadership', 'sustainable_momentum_patterns', 'Leadership consistency', 'Leadership consistency continues supporting organizational confidence.', 'positive'),
  (p_tenant, 'sig360_3', 'operational', 'friction_points', 'Workflow friction', 'Several operational workflows may benefit from simplification.', 'attention'),
  (p_tenant, 'sig360_4', 'organizational', 'recovery_opportunities', 'Recovery awareness', 'Recovery practices remain an important contributor to sustainable performance.', 'neutral'),
  (p_tenant, 'sig360_5', 'customer', 'energy_drains', 'Service intensity', 'Customer service intensity warrants thoughtful capacity review.', 'attention')
  on conflict do nothing;

  insert into public.aipify_oec_center_questions (
    tenant_id, question_key, question_type, title, summary
  ) values
  (p_tenant, 'que360_1', 'current_energizers', 'Current energizers', 'What currently energizes our organization?'),
  (p_tenant, 'que360_2', 'unnecessary_drains', 'Unnecessary drains', 'What is unnecessarily draining people?'),
  (p_tenant, 'que360_3', 'sustainable_pacing', 'Sustainable pacing', 'Are we pacing ourselves sustainably?'),
  (p_tenant, 'que360_4', 'systems_supporting_people', 'Systems support', 'Are systems supporting people effectively?'),
  (p_tenant, 'que360_5', 'strengthen_momentum', 'Strengthen momentum', 'What small changes could strengthen momentum?')
  on conflict do nothing;

  insert into public.aipify_oec_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini360_1', 'team', 'Collaboration vitality program', 'Strengthen shared motivation and supportive team dynamics.', 'in_progress'),
  (p_tenant, 'ini360_2', 'operational', 'Workflow simplification', 'Reduce friction and improve meeting effectiveness.', 'in_progress'),
  (p_tenant, 'ini360_3', 'organizational', 'Recovery awareness initiative', 'Document recovery milestones and sustainable pacing practices.', 'planned')
  on conflict do nothing;

  insert into public.aipify_oec_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev360_m', 'monthly_energy', 'Monthly energy review — momentum, recovery awareness, and sustainable pacing.', 'pending'),
  (p_tenant, 'rev360_q', 'quarterly_leadership_reflection', 'Quarterly leadership reflection — sustainability and resilience.', 'pending'),
  (p_tenant, 'rev360_t', 'team_sustainability', 'Team sustainability discussion — collaboration and capacity preservation.', 'pending'),
  (p_tenant, 'rev360_a', 'annual_assessment', 'Annual organizational assessment — energy trends and long-term effectiveness.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_oec_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl360_1', 'recovery_milestone', 'leadership', 'Leadership reflection period', 'Protected reflection period for executive team recovery.', now() - interval '45 days'),
  (p_tenant, 'tl360_2', 'momentum_breakthrough', 'team', 'Collaboration achievement', 'Cross-functional team achieved sustained delivery momentum.', now() - interval '30 days'),
  (p_tenant, 'tl360_3', 'sustainability_initiative', 'operational', 'Process simplification', 'Workflow improvements helped preserve team capacity.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_oec_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil360_q', 'team', 'Collaboration milestone archived', 'Team collaboration energy milestone archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_oec_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins360_1', 'Leadership consistency continues supporting organizational confidence.', 'medium'),
  (p_tenant, 'ins360_2', 'Recognition practices remain an important contributor to engagement.', 'medium'),
  (p_tenant, 'ins360_3', 'Workflow improvements may help preserve team capacity.', 'low')
  on conflict do nothing;

  insert into public.aipify_oec_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec360_1', 'Recognition practices continue supporting positive momentum.', 'high'),
  (p_tenant, 'rec360_2', 'Operational simplification may strengthen organizational capacity.', 'medium'),
  (p_tenant, 'rec360_3', 'Leadership reflection remains important for sustaining resilience.', 'low')
  on conflict do nothing;

  insert into public.aipify_oec_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses360_1', 'reflection_session', 'Energy reflection session — sustainable pacing and recovery awareness.', 'pending'),
  (p_tenant, 'ses360_2', 'leadership_discussion', 'Leadership discussion — capacity preservation and momentum.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_oec_center_snapshots (
    tenant_id, snapshot_key, period_label, energy_score, summary, captured_at
  ) values
  (p_tenant, 'snap360_q', 'Current quarter', 78, 'Organizational energy snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._oec_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sig as (
    select count(*) filter (where signal_tone = 'positive') as positive_count
    from public.aipify_oec_center_signals where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status = 'in_progress') as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_oec_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_oec_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'energy_score', greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3)),
    'energy_health_label', public._oecbp360_health_label(greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3))::int),
    'momentum_indicators_pct', 82,
    'recovery_awareness_pct', 78,
    'engagement_trends_pct', 80,
    'sustainable_pacing_pct', 76,
    'collaboration_quality_pct', 83,
    'leadership_consistency_pct', 81,
    'operational_friction_pct', 32,
    'recovery_effectiveness_pct', 77,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_energy_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._oec_require_tenant());
  perform public._irp_require_permission('org_energy.view', v_tenant);

  if not exists (select 1 from public.aipify_oec_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._oec_seed(v_tenant);
  end if;

  perform public._oec_log(v_tenant, 'view_center', 'Energy Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-energy',
    'dashboard', public._oec_dashboard_metrics(v_tenant),
    'energy_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_oec_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'balance_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'question_key', q.question_key, 'question_type', q.question_type,
      'title', q.title, 'summary', q.summary
    ) order by q.question_key) from public.aipify_oec_center_questions q where q.tenant_id = v_tenant), '[]'::jsonb),
    'energy_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_oec_center_initiatives i where i.tenant_id = v_tenant), '[]'::jsonb),
    'energy_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_oec_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_oec_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'energy_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_oec_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'energy_score', s.energy_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_oec_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oec_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oec_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'energy_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_oec_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'organizational_momentum', 'Organizational momentum indicators reflect healthy engagement without glorifying exhaustion.',
      'leadership_sustainability', 'Leadership sustainability measures show reflective capacity and emotional steadiness.',
      'collaboration_effectiveness', 'Collaboration effectiveness trends demonstrate supportive team dynamics and shared motivation.',
      'capacity_preservation_opportunities', 'Capacity preservation opportunities remain grounded in balance, not productivity obsession.'
    ),
    'energy_domains', public._oecbp360_domains(),
    'blueprint', public._oecbp360_blueprint_summary(),
    'links', jsonb_build_object(
      'energy_center', '/app/executive/organizational-energy',
      'executive', '/app/executive',
      'organizational_focus', '/app/executive/organizational-focus',
      'organizational_health', '/app/executive/organizational-health',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'purposeful_execution', '/app/executive/purposeful-execution',
      'change_management', '/app/executive/change-management'
    ),
    'privacy_note', public._oecbp360_privacy_note(),
    'can_manage', public._irp_has_permission('org_energy.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_energy.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_energy_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._oec_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_energy_report', 'print_executive_summary', 'export_energy_snapshot',
    'coordinate_leadership_discussion', 'archive_energy_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_energy.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_oec_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._oec_log(v_tenant, 'review_completed', 'Energy review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_oec_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._oec_log(v_tenant, 'reflection_participation', 'Energy session completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._oec_log(v_tenant, 'reflection_participation', 'Reflection session scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_oec_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._oec_log(v_tenant, 'leadership_initiative_documented', 'Energy initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_oec_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_oec_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_energy_report' then
      perform public._oec_log(v_tenant, 'energy_report_generated', 'Energy report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._oec_log(v_tenant, 'energy_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_energy_snapshot' then
      insert into public.aipify_oec_center_snapshots (
        tenant_id, snapshot_key, period_label, energy_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'energy_score')::int, (public._oec_dashboard_metrics(v_tenant)->>'energy_score')::int),
        left(coalesce(p_payload->>'summary', 'Energy snapshot exported.'), 500)
      );
      perform public._oec_log(v_tenant, 'energy_report_generated', 'Energy snapshot exported', p_payload);
    elsif v_action = 'coordinate_leadership_discussion' then
      perform public._oec_log(v_tenant, 'reflection_participation', 'Leadership discussion coordinated', p_payload);
    elsif v_action = 'archive_energy_milestone' then
      insert into public.aipify_oec_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'organizational'),
        left(coalesce(p_payload->>'title', 'Energy milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Energy milestone archived.'), 500)
      );
      perform public._oec_log(v_tenant, 'review_completed', 'Energy milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_energy.manage', v_tenant);
    update public.aipify_oec_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._oec_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_energy.contribute', v_tenant);
    perform public._oec_log(v_tenant, 'reflection_participation', 'Energy observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_energy_center(uuid) to authenticated;
grant execute on function public.process_organizational_energy_action(jsonb) to authenticated;
