-- Phase 363 — Organizational Signal Engine
-- Feature owner: Customer App — /app/executive/organizational-signals
-- Helpers: _osig_* (engine), _osigbp363_* (blueprint)

create table if not exists public.aipify_osig_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (review_cadence in ('monthly', 'quarterly', 'annual')),
  metadata jsonb not null default '{"metadata_only":true,"no_predictive_certainty":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_osig_center_settings enable row level security;
revoke all on public.aipify_osig_center_settings from authenticated, anon;

create table if not exists public.aipify_osig_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in ('customer', 'workforce', 'leadership', 'strategic', 'operational', 'external')),
  signal_type text not null check (signal_type in (
    'weak_signals', 'emerging_trends', 'repeating_patterns', 'discussion_areas', 'proactive_opportunities'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_osig_center_signals enable row level security;
revoke all on public.aipify_osig_center_signals from authenticated, anon;

create table if not exists public.aipify_osig_center_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  question_key text not null,
  question_type text not null check (question_type in (
    'what_patterns_emerging', 'observations_deserve_attention', 'additional_context_needed',
    'signals_as_opportunities', 'responding_proportionately'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, question_key)
);
alter table public.aipify_osig_center_questions enable row level security;
revoke all on public.aipify_osig_center_questions from authenticated, anon;

create table if not exists public.aipify_osig_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in ('customer', 'workforce', 'leadership', 'strategic', 'operational', 'external')),
  title text not null,
  summary text not null default '',
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'archived')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_osig_center_initiatives enable row level security;
revoke all on public.aipify_osig_center_initiatives from authenticated, anon;

create table if not exists public.aipify_osig_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly_signal', 'quarterly_strategic', 'leadership_reflection', 'annual_assessment'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_osig_center_reviews enable row level security;
revoke all on public.aipify_osig_center_reviews from authenticated, anon;

create table if not exists public.aipify_osig_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'emerging_trend', 'leadership_reflection', 'strategic_observation',
    'organizational_response', 'learning_development'
  )),
  domain text not null default 'strategic' check (domain in ('customer', 'workforce', 'leadership', 'strategic', 'operational', 'external')),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_osig_center_timeline enable row level security;
revoke all on public.aipify_osig_center_timeline from authenticated, anon;

create table if not exists public.aipify_osig_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in ('customer', 'workforce', 'leadership', 'strategic', 'operational', 'external')),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_osig_center_milestones enable row level security;
revoke all on public.aipify_osig_center_milestones from authenticated, anon;

create table if not exists public.aipify_osig_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_osig_center_insights enable row level security;
revoke all on public.aipify_osig_center_insights from authenticated, anon;

create table if not exists public.aipify_osig_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_osig_center_recommendations enable row level security;
revoke all on public.aipify_osig_center_recommendations from authenticated, anon;

create table if not exists public.aipify_osig_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'reflection_session' check (session_type in (
    'reflection_session', 'strategic_discussion', 'leadership_session'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_osig_center_sessions enable row level security;
revoke all on public.aipify_osig_center_sessions from authenticated, anon;

create table if not exists public.aipify_osig_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null,
  signal_score int not null default 0 check (signal_score between 0 and 100),
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_osig_center_snapshots enable row level security;
revoke all on public.aipify_osig_center_snapshots from authenticated, anon;

create table if not exists public.aipify_osig_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'signal_report_generated', 'reflection_participation',
    'strategic_discussion', 'recommendation_surfaced', 'governance_override',
    'view_center', 'signal_initiative'
  )),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_osig_center_audit_logs enable row level security;
revoke all on public.aipify_osig_center_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_signal_center_engine', v.description
from (values
  ('org_signal.view', 'View Organizational Signal Center', 'Review organizational signals and emerging themes'),
  ('org_signal.manage', 'Manage Organizational Signal Center', 'Schedule reviews, generate reports, and coordinate signal discussions'),
  ('org_signal.contribute', 'Contribute Signal Observations', 'Submit signal observations and interpretation notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_signal.view'), ('owner', 'org_signal.manage'), ('owner', 'org_signal.contribute'),
  ('administrator', 'org_signal.view'), ('administrator', 'org_signal.manage'), ('administrator', 'org_signal.contribute'),
  ('manager', 'org_signal.view'), ('manager', 'org_signal.manage'),
  ('employee', 'org_signal.view'),
  ('support_agent', 'org_signal.view'), ('moderator', 'org_signal.view'), ('viewer', 'org_signal.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_signal_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_signal_center_engine"]'::jsonb;

create or replace function public._osigbp363_core_principle() returns text language sql immutable as $$
  select 'Organizations rarely fail without warning. Signals appear long before outcomes become visible. The ability to notice and interpret weak signals is a strategic advantage.';
$$;

create or replace function public._osigbp363_philosophy() returns text language sql immutable as $$
  select 'Signals are indicators — they are not certainties. Aipify supports early awareness and responsible interpretation, never predictive certainty or fear-based leadership.';
$$;

create or replace function public._osigbp363_vision() returns text language sql immutable as $$
  select 'Help leaders strengthen awareness, identify emerging opportunities and navigate complexity before small observations become major events.';
$$;

create or replace function public._osigbp363_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer', 'label', 'Customer signals'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce signals'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership signals'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic signals'),
    jsonb_build_object('key', 'operational', 'label', 'Operational signals'),
    jsonb_build_object('key', 'external', 'label', 'External signals')
  );
$$;

create or replace function public._osigbp363_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 55 then 'healthy'
    when p_score >= 35 then 'developing'
    else 'signal_awareness_recommended'
  end;
$$;

create or replace function public._osigbp363_privacy_note() returns text language sql immutable as $$
  select 'Signal Center stores organizational metadata and trend summaries only — never predicts outcomes with certainty, generates unnecessary alarm, or replaces executive judgment.';
$$;

create or replace function public._osigbp363_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 363 — Organizational Signal Engine',
    'route', '/app/executive/organizational-signals',
    'core_principle', public._osigbp363_core_principle(),
    'philosophy', public._osigbp363_philosophy(),
    'vision', public._osigbp363_vision(),
    'domains', public._osigbp363_domains(),
    'privacy_note', public._osigbp363_privacy_note()
  );
$$;

create or replace function public._osig_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._osig_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_osig_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._osig_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_osig_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_osig_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig363_1', 'customer', 'emerging_trends', 'Customer theme frequency', 'Several customer themes demonstrate increasing frequency.', 'attention'),
  (p_tenant, 'sig363_2', 'workforce', 'repeating_patterns', 'Collaboration strengthening', 'Cross-functional collaboration indicators continue strengthening.', 'positive'),
  (p_tenant, 'sig363_3', 'leadership', 'weak_signals', 'Reflection participation', 'Leadership reflection participation shows consistent engagement.', 'positive'),
  (p_tenant, 'sig363_4', 'operational', 'discussion_areas', 'Operational trends', 'Several operational trends may warrant future discussion.', 'neutral'),
  (p_tenant, 'sig363_5', 'strategic', 'proactive_opportunities', 'Emerging opportunities', 'Emerging customer patterns may present opportunities for improvement.', 'attention')
  on conflict do nothing;

  insert into public.aipify_osig_center_questions (
    tenant_id, question_key, question_type, title, summary
  ) values
  (p_tenant, 'que363_1', 'what_patterns_emerging', 'Emerging patterns', 'What patterns are emerging?'),
  (p_tenant, 'que363_2', 'observations_deserve_attention', 'Observations deserving attention', 'Which observations deserve attention?'),
  (p_tenant, 'que363_3', 'additional_context_needed', 'Additional context', 'What additional context is needed?'),
  (p_tenant, 'que363_4', 'signals_as_opportunities', 'Signals as opportunities', 'Which signals may represent opportunities?'),
  (p_tenant, 'que363_5', 'responding_proportionately', 'Proportional response', 'Are we responding proportionately?')
  on conflict do nothing;

  insert into public.aipify_osig_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini363_1', 'customer', 'Customer theme review', 'Review emerging customer themes with appropriate leadership context.', 'in_progress'),
  (p_tenant, 'ini363_2', 'operational', 'Operational signal discussion', 'Schedule discussion on operational trends requiring attention.', 'planned'),
  (p_tenant, 'ini363_3', 'strategic', 'Strategic observation follow-up', 'Follow up on strategic signal patterns with proportionate response.', 'planned')
  on conflict do nothing;

  insert into public.aipify_osig_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev363_m', 'monthly_signal', 'Monthly signal review — emerging themes and observation effectiveness.', 'pending'),
  (p_tenant, 'rev363_q', 'quarterly_strategic', 'Quarterly strategic discussion — pattern awareness and response readiness.', 'pending'),
  (p_tenant, 'rev363_l', 'leadership_reflection', 'Leadership reflection session — signal interpretation and judgment.', 'pending'),
  (p_tenant, 'rev363_a', 'annual_assessment', 'Annual organizational assessment — signal awareness evolution.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_osig_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl363_1', 'emerging_trend', 'customer', 'Customer theme identified', 'Emerging customer support themes noted for leadership review.', now() - interval '45 days'),
  (p_tenant, 'tl363_2', 'leadership_reflection', 'leadership', 'Leadership reflection completed', 'Leadership reflection strengthened signal interpretation practices.', now() - interval '30 days'),
  (p_tenant, 'tl363_3', 'learning_development', 'workforce', 'Learning participation trend', 'Learning participation continues contributing positively to adaptability.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_osig_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil363_q', 'strategic', 'Signal milestone archived', 'Organizational signal milestone archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_osig_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins363_1', 'Several operational trends may warrant future discussion.', 'medium'),
  (p_tenant, 'ins363_2', 'Learning participation continues contributing positively to adaptability.', 'medium'),
  (p_tenant, 'ins363_3', 'Emerging customer patterns may present opportunities for improvement.', 'low')
  on conflict do nothing;

  insert into public.aipify_osig_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec363_1', 'Several emerging themes may benefit from executive discussion.', 'high'),
  (p_tenant, 'rec363_2', 'Reflection practices continue strengthening signal interpretation.', 'medium'),
  (p_tenant, 'rec363_3', 'Customer observations should remain a strategic priority.', 'low')
  on conflict do nothing;

  insert into public.aipify_osig_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses363_1', 'reflection_session', 'Reflection session — emerging patterns and proportional response.', 'pending'),
  (p_tenant, 'ses363_2', 'strategic_discussion', 'Strategic discussion — signal interpretation and opportunity awareness.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_osig_center_snapshots (
    tenant_id, snapshot_key, period_label, signal_score, summary, captured_at
  ) values
  (p_tenant, 'snap363_q', 'Current quarter', 80, 'Organizational signal snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._osig_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sig as (
    select count(*) filter (where signal_tone = 'positive') as positive_count,
      count(*) filter (where signal_tone = 'attention') as attention_count,
      count(*) as total_count
    from public.aipify_osig_center_signals where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status in ('planned', 'in_progress')) as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_osig_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_osig_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'signal_score', greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 5 + coalesce((select completed_count from rev), 0) * 3)),
    'signal_health_label', public._osigbp363_health_label(greatest(0, least(100, 70 + coalesce((select positive_count from sig), 0) * 4 + coalesce((select completed_count from ini), 0) * 5 + coalesce((select completed_count from rev), 0) * 3))::int),
    'emerging_themes_detected', coalesce((select total_count from sig), 0),
    'significant_trends_pct', 76,
    'executive_attention_pct', 72,
    'observation_effectiveness_pct', 81,
    'reflection_participation_pct', 79,
    'response_readiness_pct', 77,
    'pattern_awareness_pct', 83,
    'learning_integration_pct', 78,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_signal_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._osig_require_tenant());
  perform public._irp_require_permission('org_signal.view', v_tenant);

  if not exists (select 1 from public.aipify_osig_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._osig_seed(v_tenant);
  end if;

  perform public._osig_log(v_tenant, 'view_center', 'Signal Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-signals',
    'dashboard', public._osig_dashboard_metrics(v_tenant),
    'organizational_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_osig_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'interpretation_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'question_key', q.question_key, 'question_type', q.question_type,
      'title', q.title, 'summary', q.summary
    ) order by q.question_key) from public.aipify_osig_center_questions q where q.tenant_id = v_tenant), '[]'::jsonb),
    'signal_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_osig_center_initiatives i where i.tenant_id = v_tenant and i.status <> 'archived'), '[]'::jsonb),
    'signal_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_osig_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_osig_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'signal_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_osig_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'signal_score', s.signal_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_osig_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osig_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osig_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'signal_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_osig_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'emerging_themes', 'Emerging organizational themes reflect thoughtful observation — not predictive certainty.',
      'strategic_observation', 'Strategic observation indicators show disciplined attentiveness across domains.',
      'response_readiness', 'Response readiness measures suggest proportional preparedness without alarm.',
      'opportunity_awareness', 'Opportunity awareness trends encourage curiosity before premature conclusions.'
    ),
    'signal_domains', public._osigbp363_domains(),
    'blueprint', public._osigbp363_blueprint_summary(),
    'links', jsonb_build_object(
      'signal_center', '/app/executive/organizational-signals',
      'executive', '/app/executive',
      'organizational_focus', '/app/executive/organizational-focus',
      'organizational_simplicity', '/app/executive/organizational-simplicity',
      'organizational_clarity', '/app/executive/organizational-clarity',
      'purposeful_execution', '/app/executive/purposeful-execution',
      'continuous_improvement', '/app/executive/continuous-improvement'
    ),
    'privacy_note', public._osigbp363_privacy_note(),
    'can_manage', public._irp_has_permission('org_signal.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_signal.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_signal_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._osig_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_signal_report', 'print_executive_summary', 'export_signal_snapshot',
    'coordinate_leadership_discussion', 'archive_signal_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_signal.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_osig_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._osig_log(v_tenant, 'review_completed', 'Signal review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_osig_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._osig_log(v_tenant, 'reflection_participation', 'Signal session completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._osig_log(v_tenant, 'reflection_participation', 'Reflection session scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_osig_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._osig_log(v_tenant, 'signal_initiative', 'Signal initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_osig_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_osig_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_signal_report' then
      perform public._osig_log(v_tenant, 'signal_report_generated', 'Signal report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._osig_log(v_tenant, 'signal_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_signal_snapshot' then
      insert into public.aipify_osig_center_snapshots (
        tenant_id, snapshot_key, period_label, signal_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'signal_score')::int, (public._osig_dashboard_metrics(v_tenant)->>'signal_score')::int),
        left(coalesce(p_payload->>'summary', 'Signal snapshot exported.'), 500)
      );
      perform public._osig_log(v_tenant, 'signal_report_generated', 'Signal snapshot exported', p_payload);
    elsif v_action = 'coordinate_leadership_discussion' then
      perform public._osig_log(v_tenant, 'strategic_discussion', 'Leadership discussion coordinated', p_payload);
    elsif v_action = 'archive_signal_milestone' then
      insert into public.aipify_osig_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'strategic'),
        left(coalesce(p_payload->>'title', 'Signal milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Signal milestone archived.'), 500)
      );
      perform public._osig_log(v_tenant, 'review_completed', 'Signal milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_signal.manage', v_tenant);
    update public.aipify_osig_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._osig_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_signal.contribute', v_tenant);
    perform public._osig_log(v_tenant, 'signal_initiative', 'Signal observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_signal_center(uuid) to authenticated;
grant execute on function public.process_organizational_signal_action(jsonb) to authenticated;
