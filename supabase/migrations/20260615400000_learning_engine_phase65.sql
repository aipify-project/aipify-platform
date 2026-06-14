-- Phase 65 — Learning Engine & Feedback Loop System

-- ---------------------------------------------------------------------------
-- 1. learning_settings (tenant — Phase 65 expanded controls)
-- ---------------------------------------------------------------------------
create table if not exists public.learning_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  allow_support_learning boolean not null default true,
  allow_quality_learning boolean not null default true,
  allow_automation_learning boolean not null default true,
  allow_notification_learning boolean not null default true,
  allow_briefing_learning boolean not null default true,
  allow_action_learning boolean not null default true,
  require_admin_review_rules boolean not null default true,
  retention_days int not null default 365,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.learning_settings enable row level security;
revoke all on public.learning_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. learning_events
-- ---------------------------------------------------------------------------
-- Phase 12 exposed ai_learning_events as a view; Phase 65 replaces with a tenant table.
drop view if exists public.learning_events cascade;
drop table if exists public.learning_events cascade;

create table public.learning_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  source_module text not null,
  source_id uuid,
  event_type text not null check (
    event_type in (
      'suggestion_approved', 'suggestion_rejected', 'action_completed', 'action_dismissed',
      'automation_success', 'automation_failed', 'incident_false_positive',
      'support_answer_helpful', 'support_answer_unhelpful', 'knowledge_gap_resolved',
      'notification_muted', 'brief_item_opened', 'feedback_positive', 'feedback_negative'
    )
  ),
  user_decision text,
  outcome text,
  confidence_before numeric(5,3),
  confidence_after numeric(5,3),
  explanation text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists learning_events_tenant_idx
  on public.learning_events (tenant_id, created_at desc);

create index if not exists learning_events_tenant_type_idx
  on public.learning_events (tenant_id, event_type, created_at desc);

alter table public.learning_events enable row level security;
revoke all on public.learning_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. learning_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.learning_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  source_module text not null,
  source_id uuid,
  feedback_type text not null check (
    feedback_type in ('helpful', 'not_helpful', 'false_positive', 'irrelevant', 'too_noisy', 'approved', 'rejected')
  ),
  comment text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists learning_feedback_tenant_idx
  on public.learning_feedback (tenant_id, created_at desc);

alter table public.learning_feedback enable row level security;
revoke all on public.learning_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. learning_outcomes
-- ---------------------------------------------------------------------------
create table if not exists public.learning_outcomes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_module text not null,
  source_id uuid,
  outcome_type text not null check (
    outcome_type in ('completed', 'dismissed', 'delegated', 'delayed', 'escalated', 'resolved', 'failed')
  ),
  outcome_summary text not null default '',
  time_to_outcome_minutes int,
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists learning_outcomes_tenant_idx
  on public.learning_outcomes (tenant_id, recorded_at desc);

alter table public.learning_outcomes enable row level security;
revoke all on public.learning_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. learning_rules (learned prioritization / filtering rules)
-- ---------------------------------------------------------------------------
create table if not exists public.learning_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rule_key text not null,
  source_module text not null,
  title text not null,
  description text not null default '',
  condition_json jsonb not null default '{}'::jsonb,
  adjustment_json jsonb not null default '{}'::jsonb,
  requires_review boolean not null default false,
  reviewed_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, rule_key)
);

alter table public.learning_rules enable row level security;
revoke all on public.learning_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. learning_scores (pattern confidence adjustments)
-- ---------------------------------------------------------------------------
create table if not exists public.learning_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pattern_key text not null,
  source_module text not null,
  current_score numeric(5,2) not null default 50 check (current_score >= 0 and current_score <= 100),
  score_delta numeric(5,2) not null default 0,
  positive_count int not null default 0,
  negative_count int not null default 0,
  explanation text not null default '',
  last_adjusted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, pattern_key)
);

create index if not exists learning_scores_tenant_idx
  on public.learning_scores (tenant_id, current_score desc);

alter table public.learning_scores enable row level security;
revoke all on public.learning_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. learning_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.learning_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  action_type text not null,
  action_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists learning_audit_log_tenant_idx
  on public.learning_audit_log (tenant_id, created_at desc);

alter table public.learning_audit_log enable row level security;
revoke all on public.learning_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_lrn_)
-- ---------------------------------------------------------------------------
create or replace function public._lrn_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._lrn_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._lrn_ensure_settings(p_tenant_id uuid)
returns public.learning_settings language plpgsql security definer set search_path = public as $$
declare v_row public.learning_settings;
begin
  insert into public.learning_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.learning_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._lrn_log_audit(
  p_tenant_id uuid, p_user_id uuid, p_action_type text, p_summary text, p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.learning_audit_log (tenant_id, user_id, action_type, action_summary, metadata)
  values (p_tenant_id, p_user_id, p_action_type, coalesce(p_summary, ''), coalesce(p_metadata, '{}'::jsonb));
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'learning.' || p_action_type, 'learning_engine', 'success', null,
    jsonb_build_object('summary', p_summary)
  );
end; $$;

create or replace function public._lrn_adjust_score(
  p_tenant_id uuid,
  p_pattern_key text,
  p_source_module text,
  p_delta numeric,
  p_positive boolean,
  p_explanation text default ''
)
returns void language plpgsql security definer set search_path = public as $$
declare v_score numeric;
begin
  insert into public.learning_scores (
    tenant_id, pattern_key, source_module, current_score, score_delta,
    positive_count, negative_count, explanation
  ) values (
    p_tenant_id, p_pattern_key, p_source_module,
    greatest(0, least(100, 50 + p_delta)), p_delta,
    case when p_positive then 1 else 0 end,
    case when p_positive then 0 else 1 end,
    coalesce(p_explanation, '')
  )
  on conflict (tenant_id, pattern_key) do update set
    current_score = greatest(0, least(100, public.learning_scores.current_score + excluded.score_delta)),
    score_delta = excluded.score_delta,
    positive_count = public.learning_scores.positive_count + excluded.positive_count,
    negative_count = public.learning_scores.negative_count + excluded.negative_count,
    explanation = coalesce(nullif(excluded.explanation, ''), public.learning_scores.explanation),
    last_adjusted_at = now();
end; $$;

-- KC category
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'learning-engine', 'Learning Engine', 'How Aipify learns safely from feedback and outcomes.', 'authenticated', 65
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'learning-engine' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 9. Record learning event + score adjustment
-- ---------------------------------------------------------------------------
create or replace function public.record_learning_event(
  p_source_module text,
  p_source_id uuid,
  p_event_type text,
  p_user_decision text default null,
  p_outcome text default null,
  p_confidence_before numeric default null,
  p_confidence_after numeric default null,
  p_explanation text default '',
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.learning_settings;
  v_id uuid;
  v_delta numeric := 0;
  v_positive boolean := true;
  v_pattern_key text;
begin
  v_tenant_id := public._lrn_require_tenant();
  v_user_id := public._lrn_auth_user_id();
  v_settings := public._lrn_ensure_settings(v_tenant_id);
  if not v_settings.enabled then return null; end if;

  if p_source_module = 'support' and not v_settings.allow_support_learning then return null; end if;
  if p_source_module = 'quality' and not v_settings.allow_quality_learning then return null; end if;
  if p_source_module = 'automation' and not v_settings.allow_automation_learning then return null; end if;
  if p_source_module = 'desktop' and not v_settings.allow_notification_learning then return null; end if;
  if p_source_module = 'briefing' and not v_settings.allow_briefing_learning then return null; end if;
  if p_source_module = 'action_hub' and not v_settings.allow_action_learning then return null; end if;

  insert into public.learning_events (
    tenant_id, user_id, source_module, source_id, event_type,
    user_decision, outcome, confidence_before, confidence_after, explanation, metadata
  ) values (
    v_tenant_id, v_user_id, p_source_module, p_source_id, p_event_type,
    p_user_decision, p_outcome, p_confidence_before, p_confidence_after,
    coalesce(p_explanation, ''), coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;

  v_pattern_key := p_source_module || '.' || p_event_type;
  v_delta := case p_event_type
    when 'suggestion_approved' then 5 when 'action_completed' then 4 when 'support_answer_helpful' then 5
    when 'knowledge_gap_resolved' then 3 when 'automation_success' then 4 when 'brief_item_opened' then 2
    when 'suggestion_rejected' then -5 when 'action_dismissed' then -4 when 'support_answer_unhelpful' then -5
    when 'incident_false_positive' then -8 when 'notification_muted' then -6 when 'automation_failed' then -5
    else 0
  end;
  v_positive := v_delta >= 0;

  if v_delta <> 0 then
    perform public._lrn_adjust_score(
      v_tenant_id, v_pattern_key, p_source_module, v_delta, v_positive,
      coalesce(p_explanation, 'Adjusted from ' || p_event_type)
    );
  end if;

  perform public._lrn_log_audit(v_tenant_id, v_user_id, 'event_recorded', p_event_type, p_metadata);
  return v_id;
end; $$;

create or replace function public.record_learning_feedback(
  p_source_module text,
  p_source_id uuid,
  p_feedback_type text,
  p_comment text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  v_user_id := public._lrn_auth_user_id();
  if v_user_id is null then raise exception 'User not found'; end if;

  insert into public.learning_feedback (tenant_id, user_id, source_module, source_id, feedback_type, comment, metadata)
  values (v_tenant_id, v_user_id, p_source_module, p_source_id, p_feedback_type, p_comment, coalesce(p_metadata, '{}'::jsonb))
  returning id into v_id;

  perform public.record_learning_event(
    p_source_module, p_source_id,
    case when p_feedback_type in ('helpful', 'approved', 'false_positive') then 'feedback_positive' else 'feedback_negative' end,
    p_feedback_type, null, null, null,
    coalesce(p_comment, 'User feedback: ' || p_feedback_type), p_metadata
  );

  return v_id;
end; $$;

create or replace function public.record_learning_outcome(
  p_source_module text,
  p_source_id uuid,
  p_outcome_type text,
  p_outcome_summary text default '',
  p_time_to_outcome_minutes int default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();

  insert into public.learning_outcomes (
    tenant_id, source_module, source_id, outcome_type, outcome_summary,
    time_to_outcome_minutes, metadata
  ) values (
    v_tenant_id, p_source_module, p_source_id, p_outcome_type,
    coalesce(p_outcome_summary, ''), p_time_to_outcome_minutes, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;

  perform public.record_learning_event(
    p_source_module, p_source_id,
    case when p_outcome_type in ('completed', 'resolved') then 'action_completed'
         when p_outcome_type = 'dismissed' then 'action_dismissed'
         else 'suggestion_approved' end,
    p_outcome_type, p_outcome_summary, null, null,
    'Outcome recorded: ' || p_outcome_type, p_metadata
  );

  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Collect signals from integrated modules
-- ---------------------------------------------------------------------------
create or replace function public.collect_learning_signals(p_since timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_since timestamptz;
  v_settings public.learning_settings;
  v_count int := 0;
  r record;
begin
  v_tenant_id := public._lrn_require_tenant();
  v_settings := public._lrn_ensure_settings(v_tenant_id);
  if not v_settings.enabled then return jsonb_build_object('collected', 0, 'enabled', false); end if;
  v_since := coalesce(p_since, now() - interval '14 days');

  if v_settings.allow_action_learning then
    for r in
      select ad.action_item_id, ad.decision_type, ad.note, ai.source_module, ai.title
      from public.action_decisions ad
      join public.action_items ai on ai.id = ad.action_item_id
      where ad.tenant_id = v_tenant_id and ad.created_at >= v_since
    loop
      perform public.record_learning_event(
        'action_hub', r.action_item_id,
        case when r.decision_type = 'complete' then 'action_completed'
             when r.decision_type = 'dismiss' then 'action_dismissed'
             else 'suggestion_approved' end,
        r.decision_type, r.title, null, null, r.note, '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;

    for r in
      select af.action_item_id, af.feedback_type, af.comment, ai.source_module
      from public.action_feedback af
      join public.action_items ai on ai.id = af.action_item_id
      where af.tenant_id = v_tenant_id and af.created_at >= v_since
    loop
      perform public.record_learning_feedback('action_hub', r.action_item_id, r.feedback_type, r.comment, '{}'::jsonb);
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.allow_quality_learning then
    for r in
      select id, incident_key, title, metadata
      from public.aipify_quality_incidents
      where tenant_id = v_tenant_id and status = 'false_positive' and updated_at >= v_since
    loop
      perform public.record_learning_event(
        'quality', r.id, 'incident_false_positive', 'marked_false_positive', r.title,
        null, null, 'Quality incident marked as false positive', coalesce(r.metadata, '{}'::jsonb)
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.allow_action_learning then
    for r in
      select id, feedback_type, comment, target_type, target_id
      from public.memory_feedback
      where tenant_id = v_tenant_id and created_at >= v_since
    loop
      perform public.record_learning_feedback('memory', r.target_id, r.feedback_type, r.comment,
        jsonb_build_object('target_type', r.target_type));
      v_count := v_count + 1;
    end loop;
  end if;

  return jsonb_build_object('collected', v_count, 'enabled', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard & queries
-- ---------------------------------------------------------------------------
create or replace function public.get_learning_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._lrn_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', (select enabled from public.learning_settings where tenant_id = v_tenant_id),
    'total_events', (select count(*) from public.learning_events where tenant_id = v_tenant_id),
    'positive_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('helpful', 'approved')),
    'negative_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected')),
    'philosophy', 'Observe → Suggest → User decides → Outcome → Feedback → Learning updated',
    'privacy_note', 'Learning is tenant-isolated, explainable, auditable, and reversible.'
  );
end; $$;

create or replace function public.get_learning_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  perform public._lrn_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'metrics', jsonb_build_object(
      'total_events', (select count(*) from public.learning_events where tenant_id = v_tenant_id),
      'positive_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('helpful', 'approved')),
      'negative_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected')),
      'false_positives_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'incident_false_positive'),
      'suggestions_improved', (select count(*) from public.learning_scores where tenant_id = v_tenant_id and current_score > 55),
      'automations_improved', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'automation_success'),
      'noisy_notifications_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'notification_muted')
    ),
    'top_patterns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pattern_key', ls.pattern_key, 'source_module', ls.source_module,
        'current_score', ls.current_score, 'positive_count', ls.positive_count,
        'negative_count', ls.negative_count, 'explanation', ls.explanation
      ) order by ls.current_score desc)
      from public.learning_scores ls where ls.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'recent_priority_adjustments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'explanation', le.explanation, 'confidence_before', le.confidence_before,
        'confidence_after', le.confidence_after, 'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id
        and le.confidence_after is not null limit 10
    ), '[]'::jsonb),
    'recent_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'user_decision', le.user_decision, 'outcome', le.outcome, 'explanation', le.explanation,
        'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_learning_events(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  return jsonb_build_object(
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'source_module', le.source_module, 'source_id', le.source_id,
        'event_type', le.event_type, 'user_decision', le.user_decision, 'outcome', le.outcome,
        'explanation', le.explanation, 'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id limit p_limit
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_learning_rules()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  return jsonb_build_object(
    'rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', lr.id, 'rule_key', lr.rule_key, 'source_module', lr.source_module,
        'title', lr.title, 'description', lr.description, 'requires_review', lr.requires_review,
        'is_active', lr.is_active, 'updated_at', lr.updated_at
      ) order by lr.updated_at desc)
      from public.learning_rules lr where lr.tenant_id = v_tenant_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_learning_audit_log(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  return jsonb_build_object(
    'logs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', la.id, 'action_type', la.action_type, 'action_summary', la.action_summary,
        'created_at', la.created_at
      ) order by la.created_at desc)
      from public.learning_audit_log la where la.tenant_id = v_tenant_id limit p_limit
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_learning_engine_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_s public.learning_settings;
begin
  v_tenant_id := public._lrn_require_tenant();
  v_s := public._lrn_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'enabled', v_s.enabled,
    'allow_support_learning', v_s.allow_support_learning,
    'allow_quality_learning', v_s.allow_quality_learning,
    'allow_automation_learning', v_s.allow_automation_learning,
    'allow_notification_learning', v_s.allow_notification_learning,
    'allow_briefing_learning', v_s.allow_briefing_learning,
    'allow_action_learning', v_s.allow_action_learning,
    'require_admin_review_rules', v_s.require_admin_review_rules,
    'retention_days', v_s.retention_days
  );
end; $$;

create or replace function public.update_learning_engine_settings(p_settings jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  v_user_id := public._lrn_auth_user_id();
  insert into public.learning_settings (tenant_id) values (v_tenant_id) on conflict (tenant_id) do nothing;
  update public.learning_settings set
    enabled = coalesce((p_settings->>'enabled')::boolean, enabled),
    allow_support_learning = coalesce((p_settings->>'allow_support_learning')::boolean, allow_support_learning),
    allow_quality_learning = coalesce((p_settings->>'allow_quality_learning')::boolean, allow_quality_learning),
    allow_automation_learning = coalesce((p_settings->>'allow_automation_learning')::boolean, allow_automation_learning),
    allow_notification_learning = coalesce((p_settings->>'allow_notification_learning')::boolean, allow_notification_learning),
    allow_briefing_learning = coalesce((p_settings->>'allow_briefing_learning')::boolean, allow_briefing_learning),
    allow_action_learning = coalesce((p_settings->>'allow_action_learning')::boolean, allow_action_learning),
    require_admin_review_rules = coalesce((p_settings->>'require_admin_review_rules')::boolean, require_admin_review_rules),
    retention_days = coalesce((p_settings->>'retention_days')::int, retention_days),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._lrn_log_audit(v_tenant_id, v_user_id, 'settings_updated', 'Learning settings updated', p_settings);
  return public.get_learning_engine_settings();
end; $$;

create or replace function public.reset_tenant_learning()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  v_user_id := public._lrn_auth_user_id();

  delete from public.learning_scores where tenant_id = v_tenant_id;
  delete from public.learning_rules where tenant_id = v_tenant_id;

  perform public._lrn_log_audit(v_tenant_id, v_user_id, 'learning_reset', 'Tenant learning scores and rules reset', '{}'::jsonb);
  return jsonb_build_object('reset', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Unonight pilot seed
-- ---------------------------------------------------------------------------
create or replace function public.seed_unonight_pilot_learning()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_count int := 0;
begin
  select c.id into v_tenant_id
  from public.customers c
  join public.companies co on co.id = c.company_id
  where lower(co.slug) = 'unonight' or lower(c.name) like '%unonight%'
  limit 1;

  if v_tenant_id is null then
    return jsonb_build_object('seeded', 0, 'reason', 'unonight_tenant_not_found');
  end if;

  perform public._lrn_ensure_settings(v_tenant_id);

  insert into public.learning_events (tenant_id, source_module, event_type, user_decision, outcome, confidence_before, confidence_after, explanation)
  values
    (v_tenant_id, 'unonight', 'suggestion_approved', 'verification_review', 'Morning verification cluster', 0.5, 0.65, 'Unonight pilot: verification reviews are frequently completed in morning sessions.'),
    (v_tenant_id, 'support', 'support_answer_helpful', 'draft_accepted', 'Drafts accepted with minor edits', 0.55, 0.7, 'Unonight pilot: support draft templates are often accepted with small edits.'),
    (v_tenant_id, 'quality', 'incident_false_positive', 'marketplace_alert', 'Image alert noise reduced', 0.6, 0.45, 'Unonight pilot: reduce noise from similar marketplace image checks.'),
    (v_tenant_id, 'briefing', 'brief_item_opened', 'verification_first', 'Opened first in morning brief', 0.5, 0.72, 'Unonight pilot: prioritize verification reminders in morning briefing.');
  v_count := 4;

  perform public._lrn_adjust_score(v_tenant_id, 'unonight.suggestion_approved', 'unonight', 5, true, 'Verification reviews accepted often');
  perform public._lrn_adjust_score(v_tenant_id, 'quality.incident_false_positive', 'quality', -8, false, 'Marketplace image false positives');

  insert into public.learning_rules (tenant_id, rule_key, source_module, title, description, condition_json, adjustment_json, requires_review, is_active)
  values (
    v_tenant_id, 'unonight.morning.verification', 'briefing',
    'Prioritize morning verification reminders',
    'Verification briefing items are opened and completed quickly in morning sessions.',
    '{"time_window": "morning", "category": "verification"}'::jsonb,
    '{"priority_boost": 15}'::jsonb, false, true
  ) on conflict (tenant_id, rule_key) do update set updated_at = now();
  v_count := v_count + 1;

  return jsonb_build_object('seeded', v_count, 'tenant_id', v_tenant_id);
end; $$;

-- Grants
grant execute on function public.record_learning_event(text, uuid, text, text, text, numeric, numeric, text, jsonb) to authenticated;
grant execute on function public.record_learning_feedback(text, uuid, text, text, jsonb) to authenticated;
grant execute on function public.record_learning_outcome(text, uuid, text, text, int, jsonb) to authenticated;
grant execute on function public.collect_learning_signals(timestamptz) to authenticated;
grant execute on function public.get_learning_engine_card() to authenticated;
grant execute on function public.get_learning_engine_dashboard() to authenticated;
grant execute on function public.get_learning_events(int) to authenticated;
grant execute on function public.get_learning_rules() to authenticated;
grant execute on function public.get_learning_audit_log(int) to authenticated;
grant execute on function public.get_learning_engine_settings() to authenticated;
grant execute on function public.update_learning_engine_settings(jsonb) to authenticated;
grant execute on function public.reset_tenant_learning() to authenticated;
grant execute on function public.seed_unonight_pilot_learning() to authenticated;
