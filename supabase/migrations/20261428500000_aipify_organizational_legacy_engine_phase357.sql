-- Phase 357 — Organizational Legacy Engine
-- Feature owner: Customer App — /app/executive/organizational-legacy
-- Upgrade: adds engine tables; replaces RPCs. Helpers: _olc_* (engine), _olcbp357_* (blueprint)

-- ---------------------------------------------------------------------------
-- 1. New engine tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_olc_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in ('customer', 'employee', 'leadership', 'cultural', 'community', 'organizational')),
  signal_type text not null check (signal_type in (
    'positive_long_term_patterns', 'stewardship_strengths', 'knowledge_preservation_opportunities', 'legacy_risks', 'high_impact_contributions'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_olc_center_signals enable row level security;
revoke all on public.aipify_olc_center_signals from authenticated, anon;

create table if not exists public.aipify_olc_center_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  question_key text not null,
  question_type text not null check (question_type in (
    'beyond_immediate_results', 'customer_remember', 'knowledge_preserve', 'traditions_continue', 'impact_leave_behind'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, question_key)
);
alter table public.aipify_olc_center_questions enable row level security;
revoke all on public.aipify_olc_center_questions from authenticated, anon;

create table if not exists public.aipify_olc_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in ('customer', 'employee', 'leadership', 'cultural', 'community', 'organizational')),
  title text not null,
  summary text not null default '',
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_olc_center_initiatives enable row level security;
revoke all on public.aipify_olc_center_initiatives from authenticated, anon;

create table if not exists public.aipify_olc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'annual_legacy', 'leadership_reflection', 'succession_planning', 'purpose_stewardship'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_olc_center_reviews enable row level security;
revoke all on public.aipify_olc_center_reviews from authenticated, anon;

create table if not exists public.aipify_olc_center_legacy_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in ('customer', 'employee', 'leadership', 'cultural', 'community', 'organizational')),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_olc_center_legacy_milestones enable row level security;
revoke all on public.aipify_olc_center_legacy_milestones from authenticated, anon;

alter table public.aipify_olc_center_audit_logs drop constraint if exists aipify_olc_center_audit_logs_event_type_check;
alter table public.aipify_olc_center_audit_logs add constraint aipify_olc_center_audit_logs_event_type_check check (
  event_type in (
    'reflection_completed', 'record_preserved', 'legacy_report_generated',
    'archive_updated', 'executive_session', 'governance_override', 'view_center',
    'review_completed', 'reflection_participation', 'succession_initiative_documented', 'recommendation_surfaced'
  )
);

-- ---------------------------------------------------------------------------
-- 2. Blueprint — _olcbp357_*
-- ---------------------------------------------------------------------------
create or replace function public._olcbp357_core_principle() returns text language sql immutable as $$
  select 'Organizations are remembered not only for what they achieve, but for how they achieve it and what they leave behind. Legacy is built every day.';
$$;

create or replace function public._olcbp357_philosophy() returns text language sql immutable as $$
  select 'Legacy is not reputation management — it is the accumulated impact of an organization''s actions over time.';
$$;

create or replace function public._olcbp357_vision() returns text language sql immutable as $$
  select 'Help leaders preserve wisdom, strengthen stewardship and build organizations whose contributions continue creating value long after today''s objectives have been achieved.';
$$;

create or replace function public._olcbp357_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer', 'label', 'Customer legacy'),
    jsonb_build_object('key', 'employee', 'label', 'Employee legacy'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership legacy'),
    jsonb_build_object('key', 'cultural', 'label', 'Cultural legacy'),
    jsonb_build_object('key', 'community', 'label', 'Community legacy'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational legacy')
  );
$$;

create or replace function public._olcbp357_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 55 then 'healthy'
    when p_score >= 35 then 'developing'
    else 'legacy_reinforcement_recommended'
  end;
$$;

create or replace function public._olcbp357_privacy_note() returns text language sql immutable as $$
  select 'Legacy Center stores organizational metadata and trend summaries only — never creates vanity metrics, rewrites history, or replaces ethical leadership.';
$$;

create or replace function public._olcbp357_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 357 — Organizational Legacy Engine',
    'route', '/app/executive/organizational-legacy',
    'core_principle', public._olcbp357_core_principle(),
    'philosophy', public._olcbp357_philosophy(),
    'vision', public._olcbp357_vision(),
    'domains', public._olcbp357_domains(),
    'privacy_note', public._olcbp357_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Engine — updated seed, metrics, RPCs
-- ---------------------------------------------------------------------------
create or replace function public._olc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_olc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_olc_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig_lead', 'leadership', 'stewardship_strengths', 'Leadership mentoring', 'Leadership mentoring initiatives continue strengthening organizational continuity.', 'positive'),
  (p_tenant, 'sig_cust', 'customer', 'positive_long_term_patterns', 'Customer trust', 'Customer trust remains a meaningful contributor to organizational legacy.', 'positive'),
  (p_tenant, 'sig_cult', 'cultural', 'high_impact_contributions', 'Cultural practices', 'Several long-standing practices continue contributing positively to organizational identity.', 'neutral'),
  (p_tenant, 'sig_org', 'organizational', 'knowledge_preservation_opportunities', 'Knowledge transfer', 'Knowledge transfer initiatives remain important for preserving institutional wisdom.', 'neutral'),
  (p_tenant, 'sig_comm', 'community', 'legacy_risks', 'Community engagement', 'Emerging legacy risks warrant thoughtful stewardship review.', 'attention')
  on conflict do nothing;

  insert into public.aipify_olc_center_questions (
    tenant_id, question_key, question_type, title, summary
  ) values
  (p_tenant, 'que_1', 'beyond_immediate_results', 'Beyond immediate results', 'What are we building beyond immediate results?'),
  (p_tenant, 'que_2', 'customer_remember', 'Customer remembrance', 'How will customers remember us?'),
  (p_tenant, 'que_3', 'knowledge_preserve', 'Knowledge preservation', 'What knowledge should be preserved?'),
  (p_tenant, 'que_4', 'traditions_continue', 'Traditions worth continuing', 'What traditions deserve continuation?'),
  (p_tenant, 'que_5', 'impact_leave_behind', 'Impact we hope to leave', 'What impact do we hope to leave behind?')
  on conflict do nothing;

  insert into public.aipify_olc_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini_1', 'leadership', 'Leadership mentoring program', 'Strengthen succession readiness and wisdom sharing across leadership.', 'in_progress'),
  (p_tenant, 'ini_2', 'customer', 'Customer trust stewardship', 'Preserve long-term partnerships and consistent service quality.', 'in_progress'),
  (p_tenant, 'ini_3', 'organizational', 'Knowledge preservation program', 'Document institutional learning and innovation contributions.', 'planned')
  on conflict do nothing;

  insert into public.aipify_olc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_a', 'annual_legacy', 'Annual legacy review — long-term impact and stewardship quality.', 'pending'),
  (p_tenant, 'rev_l', 'leadership_reflection', 'Leadership reflection session — ethical consistency and wisdom sharing.', 'pending'),
  (p_tenant, 'rev_s', 'succession_planning', 'Succession planning discussion — leadership continuity and preparation.', 'pending'),
  (p_tenant, 'rev_p', 'purpose_stewardship', 'Purpose and stewardship assessment — values consistency and positive contribution.', 'pending')
  on conflict do nothing;

  insert into public.aipify_olc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl357_1', 'founding_event', 'founding', 'Foundational milestone', 'Organization established with purpose-driven stewardship principles.', now() - interval '30 days'),
  (p_tenant, 'tl357_2', 'org_transition', 'leadership', 'Leadership transition', 'Leadership transition preserved institutional wisdom and continuity.', now() - interval '45 days'),
  (p_tenant, 'tl357_3', 'major_achievement', 'customer', 'Significant achievement', 'Long-standing customer partnership milestone documented.', now() - interval '60 days'),
  (p_tenant, 'tl357_4', 'cultural_moment', 'cultural', 'Cultural development', 'Shared traditions reinforced cultural resilience.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_olc_center_legacy_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil_q', 'organizational', 'Legacy milestone archived', 'Quarterly legacy milestone archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_olc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins357_1', 'Several long-standing practices continue contributing positively to organizational identity.', 'medium'),
  (p_tenant, 'ins357_2', 'Knowledge transfer initiatives remain important for preserving institutional wisdom.', 'medium'),
  (p_tenant, 'ins357_3', 'Leadership consistency supports long-term credibility.', 'low')
  on conflict do nothing;

  insert into public.aipify_olc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec357_1', 'Leadership mentoring remains an important contributor to long-term continuity.', 'high'),
  (p_tenant, 'rec357_2', 'Knowledge preservation efforts should continue receiving executive attention.', 'medium'),
  (p_tenant, 'rec357_3', 'Customer trust initiatives strengthen the organization''s enduring impact.', 'low')
  on conflict do nothing;

  insert into public.aipify_olc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses357_1', 'leadership_reflection', 'Legacy reflection session — stewardship quality and long-term contribution.', 'pending'),
  (p_tenant, 'ses357_2', 'stewardship_review', 'Stewardship session — knowledge preservation and succession readiness.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_olc_center_snapshots (
    tenant_id, snapshot_key, period_label, legacy_score, summary, captured_at
  ) values
  (p_tenant, 'snap357_q', 'Current quarter', 82, 'Organizational legacy snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._olc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sig as (
    select count(*) filter (where signal_tone = 'positive') as positive_count
    from public.aipify_olc_center_signals where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status = 'in_progress') as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_olc_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_olc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'legacy_score', greatest(0, least(100, 68 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3)),
    'legacy_health_label', public._olcbp357_health_label(greatest(0, least(100, 68 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3))::int),
    'positive_impact_pct', 84,
    'stewardship_quality_pct', 82,
    'knowledge_preservation_pct', 79,
    'leadership_succession_pct', 77,
    'customer_trust_pct', 86,
    'cultural_resilience_pct', 80,
    'values_consistency_pct', 81,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_legacy_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._olc_require_tenant());
  perform public._irp_require_permission('org_legacy.view', v_tenant);

  if not exists (select 1 from public.aipify_olc_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._olc_seed(v_tenant);
  end if;

  perform public._olc_log(v_tenant, 'view_center', 'Legacy Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-legacy',
    'dashboard', public._olc_dashboard_metrics(v_tenant),
    'legacy_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_olc_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'legacy_questions', coalesce((select jsonb_agg(jsonb_build_object(
      'question_key', q.question_key, 'question_type', q.question_type,
      'title', q.title, 'summary', q.summary
    ) order by q.question_key) from public.aipify_olc_center_questions q where q.tenant_id = v_tenant), '[]'::jsonb),
    'legacy_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_olc_center_initiatives i where i.tenant_id = v_tenant), '[]'::jsonb),
    'legacy_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_olc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_olc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'legacy_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_olc_center_legacy_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'legacy_score', s.legacy_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_olc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_olc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_olc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'legacy_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_olc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'stewardship_indicators', 'Stewardship indicators reflect responsible long-term thinking and ethical consistency.',
      'leadership_continuity', 'Leadership continuity measures demonstrate succession readiness and wisdom sharing.',
      'knowledge_preservation', 'Knowledge preservation trends show ongoing institutional learning stewardship.',
      'contribution_opportunities', 'Long-term contribution opportunities remain grounded in humility and purposeful impact.'
    ),
    'legacy_domains', public._olcbp357_domains(),
    'blueprint', public._olcbp357_blueprint_summary(),
    'links', jsonb_build_object(
      'legacy_center', '/app/executive/organizational-legacy',
      'executive', '/app/executive',
      'organizational_identity', '/app/executive/organizational-identity',
      'organizational_wisdom', '/app/executive/organizational-wisdom',
      'organizational_memory', '/app/executive/organizational-memory',
      'organizational_stewardship', '/app/executive/organizational-stewardship',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'privacy_note', public._olcbp357_privacy_note(),
    'can_manage', public._irp_has_permission('org_legacy.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_legacy.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_legacy_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._olc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_legacy_report', 'print_executive_summary', 'export_legacy_snapshot',
    'coordinate_leadership_discussion', 'archive_legacy_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_legacy.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_olc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._olc_log(v_tenant, 'review_completed', 'Legacy review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_olc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._olc_log(v_tenant, 'reflection_participation', 'Legacy session completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._olc_log(v_tenant, 'reflection_participation', 'Reflection session scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_olc_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._olc_log(v_tenant, 'succession_initiative_documented', 'Legacy initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_olc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_olc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_legacy_report' then
      perform public._olc_log(v_tenant, 'legacy_report_generated', 'Legacy report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._olc_log(v_tenant, 'legacy_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_legacy_snapshot' then
      insert into public.aipify_olc_center_snapshots (
        tenant_id, snapshot_key, period_label, legacy_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'legacy_score')::int, (public._olc_dashboard_metrics(v_tenant)->>'legacy_score')::int),
        left(coalesce(p_payload->>'summary', 'Legacy snapshot exported.'), 500)
      );
      perform public._olc_log(v_tenant, 'legacy_report_generated', 'Legacy snapshot exported', p_payload);
    elsif v_action = 'coordinate_leadership_discussion' then
      perform public._olc_log(v_tenant, 'reflection_participation', 'Leadership discussion coordinated', p_payload);
    elsif v_action = 'archive_legacy_milestone' then
      insert into public.aipify_olc_center_legacy_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'organizational'),
        left(coalesce(p_payload->>'title', 'Legacy milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Legacy milestone archived.'), 500)
      );
      perform public._olc_log(v_tenant, 'review_completed', 'Legacy milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_legacy.manage', v_tenant);
    update public.aipify_olc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._olc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_legacy.contribute', v_tenant);
    perform public._olc_log(v_tenant, 'reflection_participation', 'Legacy observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;
