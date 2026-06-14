-- Phase 358 — Organizational Stewardship Engine
-- Feature owner: Customer App — /app/executive/organizational-stewardship
-- Upgrade: adds engine tables; replaces RPCs. Helpers: _osc_* (engine), _oscbp358_* (blueprint)

create table if not exists public.aipify_osc_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in ('people', 'knowledge', 'resource', 'customer', 'cultural', 'strategic')),
  signal_type text not null check (signal_type in (
    'positive_stewardship_behaviors', 'long_term_investment_patterns', 'knowledge_preservation_opportunities', 'trust_strengthening_initiatives', 'resource_sustainability_improvements'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_osc_center_signals enable row level security;
revoke all on public.aipify_osc_center_signals from authenticated, anon;

create table if not exists public.aipify_osc_center_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  question_key text not null,
  question_type text not null check (question_type in (
    'entrusted_to_us', 'protecting_future_opportunities', 'investing_in_people', 'preserving_knowledge', 'strengthening_trust'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, question_key)
);
alter table public.aipify_osc_center_questions enable row level security;
revoke all on public.aipify_osc_center_questions from authenticated, anon;

create table if not exists public.aipify_osc_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in ('people', 'knowledge', 'resource', 'customer', 'cultural', 'strategic')),
  title text not null,
  summary text not null default '',
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_osc_center_initiatives enable row level security;
revoke all on public.aipify_osc_center_initiatives from authenticated, anon;

create table if not exists public.aipify_osc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'leadership_initiative', 'knowledge_preservation_milestone', 'customer_trust_achievement', 'cultural_development', 'strategic_investment'
  )),
  domain text not null default 'people' check (domain in ('people', 'knowledge', 'resource', 'customer', 'cultural', 'strategic')),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_osc_center_timeline enable row level security;
revoke all on public.aipify_osc_center_timeline from authenticated, anon;

alter table public.aipify_osc_center_reviews drop constraint if exists aipify_osc_center_reviews_review_type_check;
alter table public.aipify_osc_center_reviews add constraint aipify_osc_center_reviews_review_type_check check (
  review_type in (
    'quarterly_stewardship', 'annual_leadership', 'succession_preparedness', 'long_term_planning',
    'leadership_reflection', 'knowledge_continuity', 'annual_assessment'
  )
);

alter table public.aipify_osc_center_milestones drop constraint if exists aipify_osc_center_milestones_domain_check;
alter table public.aipify_osc_center_milestones add constraint aipify_osc_center_milestones_domain_check check (
  domain in ('people', 'customer', 'resource', 'knowledge', 'technology', 'community', 'cultural', 'strategic')
);

alter table public.aipify_osc_center_audit_logs drop constraint if exists aipify_osc_center_audit_logs_event_type_check;
alter table public.aipify_osc_center_audit_logs add constraint aipify_osc_center_audit_logs_event_type_check check (
  event_type in (
    'reflection_completed', 'record_preserved', 'stewardship_report_generated',
    'review_conducted', 'leadership_participation', 'succession_activity', 'governance_override', 'view_center',
    'review_completed', 'reflection_participation', 'leadership_initiative_documented', 'recommendation_surfaced'
  )
);

create or replace function public._oscbp358_core_principle() returns text language sql immutable as $$
  select 'Leadership is not ownership. Leadership is stewardship. Organizations flourish when people recognize that they are temporary caretakers of something larger than themselves.';
$$;

create or replace function public._oscbp358_philosophy() returns text language sql immutable as $$
  select 'Stewardship means acting in ways that strengthen the organization not only for today, but for those who come after.';
$$;

create or replace function public._oscbp358_vision() returns text language sql immutable as $$
  select 'Help leaders care wisely for people, knowledge, resources, and trust so organizations become stronger, more resilient, and better prepared for the generations that follow.';
$$;

create or replace function public._oscbp358_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'people', 'label', 'People stewardship'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge stewardship'),
    jsonb_build_object('key', 'resource', 'label', 'Resource stewardship'),
    jsonb_build_object('key', 'customer', 'label', 'Customer stewardship'),
    jsonb_build_object('key', 'cultural', 'label', 'Cultural stewardship'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic stewardship')
  );
$$;

create or replace function public._oscbp358_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 55 then 'healthy'
    when p_score >= 35 then 'developing'
    else 'stewardship_reinforcement_recommended'
  end;
$$;

create or replace function public._oscbp358_privacy_note() returns text language sql immutable as $$
  select 'Stewardship Center stores organizational metadata and trend summaries only — never replaces executive accountability or promotes authority without responsibility.';
$$;

create or replace function public._oscbp358_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 358 — Organizational Stewardship Engine',
    'route', '/app/executive/organizational-stewardship',
    'core_principle', public._oscbp358_core_principle(),
    'philosophy', public._oscbp358_philosophy(),
    'vision', public._oscbp358_vision(),
    'domains', public._oscbp358_domains(),
    'privacy_note', public._oscbp358_privacy_note()
  );
$$;

create or replace function public._osc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_osc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_osc_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig_people', 'people', 'positive_stewardship_behaviors', 'Leadership mentoring', 'Leadership mentoring continues contributing positively to organizational stewardship.', 'positive'),
  (p_tenant, 'sig_know', 'knowledge', 'knowledge_preservation_opportunities', 'Knowledge transfer', 'Knowledge transfer participation remains an important organizational strength.', 'positive'),
  (p_tenant, 'sig_cust', 'customer', 'trust_strengthening_initiatives', 'Customer trust', 'Customer trust initiatives continue supporting long-term relationships.', 'neutral'),
  (p_tenant, 'sig_res', 'resource', 'resource_sustainability_improvements', 'Resource planning', 'Resource planning practices demonstrate strong future orientation.', 'neutral'),
  (p_tenant, 'sig_strat', 'strategic', 'long_term_investment_patterns', 'Strategic continuity', 'Emerging stewardship gaps warrant thoughtful executive reflection.', 'attention')
  on conflict do nothing;

  insert into public.aipify_osc_center_questions (
    tenant_id, question_key, question_type, title, summary
  ) values
  (p_tenant, 'que_1', 'entrusted_to_us', 'What has been entrusted to us?', 'What has been entrusted to us?'),
  (p_tenant, 'que_2', 'protecting_future_opportunities', 'Protecting future opportunities', 'How are we protecting future opportunities?'),
  (p_tenant, 'que_3', 'investing_in_people', 'Investing in people', 'Are we investing wisely in people?'),
  (p_tenant, 'que_4', 'preserving_knowledge', 'Preserving knowledge', 'Are we preserving important knowledge?'),
  (p_tenant, 'que_5', 'strengthening_trust', 'Strengthening trust', 'How can we strengthen trust over time?')
  on conflict do nothing;

  insert into public.aipify_osc_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini_1', 'people', 'Leadership development initiative', 'Strengthen leadership development and mentorship participation.', 'in_progress'),
  (p_tenant, 'ini_2', 'knowledge', 'Knowledge preservation program', 'Improve documentation quality and wisdom transfer practices.', 'in_progress'),
  (p_tenant, 'ini_3', 'customer', 'Customer trust stewardship', 'Preserve trust through consistent service and promise fulfillment.', 'planned')
  on conflict do nothing;

  insert into public.aipify_osc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_q', 'quarterly_stewardship', 'Quarterly stewardship review — leadership responsibility and resource sustainability.', 'pending'),
  (p_tenant, 'rev_l', 'leadership_reflection', 'Leadership reflection session — ethical decision-making and long-term thinking.', 'pending'),
  (p_tenant, 'rev_k', 'knowledge_continuity', 'Knowledge continuity discussion — institutional learning and preservation.', 'pending'),
  (p_tenant, 'rev_a', 'annual_assessment', 'Annual organizational assessment — stewardship maturity and strategic consistency.', 'pending')
  on conflict do nothing;

  insert into public.aipify_osc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl358_1', 'leadership_initiative', 'people', 'Leadership initiative', 'Leadership development program strengthened mentorship participation.', now() - interval '30 days'),
  (p_tenant, 'tl358_2', 'knowledge_preservation_milestone', 'knowledge', 'Knowledge preservation milestone', 'Institutional learning documentation improved across teams.', now() - interval '45 days'),
  (p_tenant, 'tl358_3', 'customer_trust_achievement', 'customer', 'Customer trust achievement', 'Long-term customer partnership trust milestone recognized.', now() - interval '60 days'),
  (p_tenant, 'tl358_4', 'strategic_investment', 'strategic', 'Strategic investment', 'Future preparedness investment aligned with stewardship principles.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_osc_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil358_q', 'people', 'Stewardship milestone archived', 'Quarterly stewardship milestone archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_osc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins358_1', 'Customer trust initiatives continue supporting long-term relationships.', 'medium'),
  (p_tenant, 'ins358_2', 'Leadership consistency remains a significant contributor to stewardship maturity.', 'medium'),
  (p_tenant, 'ins358_3', 'Resource planning practices demonstrate strong future orientation.', 'low')
  on conflict do nothing;

  insert into public.aipify_osc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec358_1', 'Leadership development initiatives continue strengthening future preparedness.', 'high'),
  (p_tenant, 'rec358_2', 'Knowledge preservation efforts remain strategically important.', 'medium'),
  (p_tenant, 'rec358_3', 'Customer trust investments should continue receiving executive attention.', 'low')
  on conflict do nothing;

  insert into public.aipify_osc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses358_1', 'leadership_reflection', 'Stewardship reflection session — responsible care for entrusted resources.', 'pending'),
  (p_tenant, 'ses358_2', 'succession_discussion', 'Knowledge continuity session — wisdom transfer and future preparedness.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_osc_center_snapshots (
    tenant_id, snapshot_key, period_label, stewardship_score, summary, captured_at
  ) values
  (p_tenant, 'snap358_q', 'Current quarter', 83, 'Organizational stewardship snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._osc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sig as (
    select count(*) filter (where signal_tone = 'positive') as positive_count
    from public.aipify_osc_center_signals where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status = 'in_progress') as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_osc_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_osc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'stewardship_score', greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3)),
    'stewardship_health_label', public._oscbp358_health_label(greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3))::int),
    'leadership_stewardship_pct', 81,
    'trust_preservation_pct', 84,
    'knowledge_continuity_pct', 79,
    'resource_sustainability_pct', 77,
    'strategic_consistency_pct', 80,
    'leadership_responsibility_pct', 82,
    'customer_trust_pct', 85,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_stewardship_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._osc_require_tenant());
  perform public._irp_require_permission('org_stewardship.view', v_tenant);

  if not exists (select 1 from public.aipify_osc_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._osc_seed(v_tenant);
  end if;

  perform public._osc_log(v_tenant, 'view_center', 'Stewardship Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-stewardship',
    'dashboard', public._osc_dashboard_metrics(v_tenant),
    'stewardship_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_osc_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'responsibility_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'question_key', q.question_key, 'question_type', q.question_type,
      'title', q.title, 'summary', q.summary
    ) order by q.question_key) from public.aipify_osc_center_questions q where q.tenant_id = v_tenant), '[]'::jsonb),
    'stewardship_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_osc_center_initiatives i where i.tenant_id = v_tenant), '[]'::jsonb),
    'stewardship_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_osc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_osc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'stewardship_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_osc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'stewardship_score', s.stewardship_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_osc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'stewardship_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_osc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'leadership_responsibility', 'Leadership responsibility indicators reflect ethical decision-making and accountable care.',
      'trust_preservation', 'Trust preservation trends demonstrate consistent customer and stakeholder stewardship.',
      'knowledge_continuity', 'Knowledge continuity measures show ongoing institutional learning preservation.',
      'future_investment_opportunities', 'Future investment opportunities remain grounded in long-term organizational resilience.'
    ),
    'stewardship_domains', public._oscbp358_domains(),
    'blueprint', public._oscbp358_blueprint_summary(),
    'links', jsonb_build_object(
      'stewardship_center', '/app/executive/organizational-stewardship',
      'executive', '/app/executive',
      'organizational_legacy', '/app/executive/organizational-legacy',
      'organizational_identity', '/app/executive/organizational-identity',
      'organizational_wisdom', '/app/executive/organizational-wisdom',
      'organizational_memory', '/app/knowledge-center/organizational-memory'
    ),
    'privacy_note', public._oscbp358_privacy_note(),
    'can_manage', public._irp_has_permission('org_stewardship.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_stewardship.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_stewardship_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._osc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_stewardship_report', 'print_executive_summary', 'export_stewardship_snapshot',
    'coordinate_leadership_discussion', 'archive_stewardship_milestone', 'complete_initiative',
    'schedule_leadership_reflection', 'coordinate_succession_discussion'
  ) then
    perform public._irp_require_permission('org_stewardship.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_osc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._osc_log(v_tenant, 'review_completed', 'Stewardship review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_osc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._osc_log(v_tenant, 'reflection_participation', 'Stewardship session completed', p_payload);
    elsif v_action in ('schedule_reflection_session', 'schedule_leadership_reflection') then
      perform public._osc_log(v_tenant, 'reflection_participation', 'Reflection session scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_osc_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._osc_log(v_tenant, 'leadership_initiative_documented', 'Stewardship initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_osc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_osc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_stewardship_report' then
      perform public._osc_log(v_tenant, 'stewardship_report_generated', 'Stewardship report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._osc_log(v_tenant, 'stewardship_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_stewardship_snapshot' then
      insert into public.aipify_osc_center_snapshots (
        tenant_id, snapshot_key, period_label, stewardship_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'stewardship_score')::int, (public._osc_dashboard_metrics(v_tenant)->>'stewardship_score')::int),
        left(coalesce(p_payload->>'summary', 'Stewardship snapshot exported.'), 500)
      );
      perform public._osc_log(v_tenant, 'stewardship_report_generated', 'Stewardship snapshot exported', p_payload);
    elsif v_action in ('coordinate_leadership_discussion', 'coordinate_succession_discussion') then
      perform public._osc_log(v_tenant, 'reflection_participation', 'Leadership discussion coordinated', p_payload);
    elsif v_action = 'archive_stewardship_milestone' then
      insert into public.aipify_osc_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'people'),
        left(coalesce(p_payload->>'title', 'Stewardship milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Stewardship milestone archived.'), 500)
      );
      perform public._osc_log(v_tenant, 'review_completed', 'Stewardship milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_stewardship.manage', v_tenant);
    update public.aipify_osc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._osc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_stewardship.contribute', v_tenant);
    perform public._osc_log(v_tenant, 'reflection_participation', 'Stewardship observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;
