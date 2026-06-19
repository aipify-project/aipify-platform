-- Phase 596 — Aipify Companion Self-Improvement, Feedback Intelligence & Experience Evolution Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/feedback/*
-- Helpers: _cife596_*

create table if not exists public.organization_cife596_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  feedback_center_enabled boolean not null default true,
  experience_signal_enabled boolean not null default true,
  satisfaction_engine_enabled boolean not null default true,
  quality_engine_enabled boolean not null default true,
  improvement_engine_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_cife596_settings enable row level security;
revoke all on public.organization_cife596_settings from authenticated, anon;

create table if not exists public.organization_cife596_feedback (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  feedback_key text not null,
  feedback_title text not null,
  feedback_type text not null check (
    feedback_type in (
      'thumbs_up', 'thumbs_down', 'quick', 'detailed', 'feature', 'companion', 'workflow'
    )
  ),
  feedback_status text not null default 'open',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, feedback_key)
);

alter table public.organization_cife596_feedback enable row level security;
revoke all on public.organization_cife596_feedback from authenticated, anon;

create table if not exists public.organization_cife596_suggestions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  suggestion_key text not null,
  suggestion_title text not null,
  suggestion_type text not null default 'improvement',
  suggestion_status text not null default 'pending',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, suggestion_key)
);

alter table public.organization_cife596_suggestions enable row level security;
revoke all on public.organization_cife596_suggestions from authenticated, anon;

create table if not exists public.organization_cife596_ratings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rating_key text not null,
  rating_title text not null,
  rating_category text not null check (
    rating_category in ('companion', 'feature', 'business_pack', 'support', 'knowledge')
  ),
  rating_level text not null check (
    rating_level in ('excellent', 'positive', 'mixed', 'improvement_required')
  ),
  score integer not null default 75 check (score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rating_key)
);

alter table public.organization_cife596_ratings enable row level security;
revoke all on public.organization_cife596_ratings from authenticated, anon;

create table if not exists public.organization_cife596_experience_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_type text not null check (
    signal_type in (
      'helpful_response', 'unhelpful_response', 'repeated_question', 'escalation',
      'ignored_suggestion', 'successful_suggestion'
    )
  ),
  signal_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, signal_key)
);

alter table public.organization_cife596_experience_signals enable row level security;
revoke all on public.organization_cife596_experience_signals from authenticated, anon;

create table if not exists public.organization_cife596_improvements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  improvement_key text not null,
  improvement_title text not null,
  improvement_type text not null check (
    improvement_type in (
      'missing_knowledge', 'confusing_workflow', 'repeated_problem',
      'weak_adoption', 'training_gap', 'knowledge_article'
    )
  ),
  improvement_status text not null default 'proposed',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, improvement_key)
);

alter table public.organization_cife596_improvements enable row level security;
revoke all on public.organization_cife596_improvements from authenticated, anon;

create table if not exists public.organization_cife596_quality_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_type text not null check (
    metric_type in (
      'response_accuracy', 'recommendation_quality', 'task_completion',
      'user_satisfaction', 'follow_up_success', 'knowledge_usage'
    )
  ),
  metric_score integer not null default 75 check (metric_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, metric_key)
);

alter table public.organization_cife596_quality_metrics enable row level security;
revoke all on public.organization_cife596_quality_metrics from authenticated, anon;

create table if not exists public.organization_cife596_feedback_loops (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  loop_key text not null,
  loop_title text not null,
  loop_stage text not null check (
    loop_stage in ('feedback', 'review', 'improvement', 'implementation', 'validation', 'outcome')
  ),
  loop_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, loop_key)
);

alter table public.organization_cife596_feedback_loops enable row level security;
revoke all on public.organization_cife596_feedback_loops from authenticated, anon;

create table if not exists public.organization_cife596_feature_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_key text not null,
  request_title text not null,
  request_source text not null check (
    request_source in ('customer', 'partner', 'enterprise', 'internal', 'feature')
  ),
  request_status text not null default 'visible',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, request_key)
);

alter table public.organization_cife596_feature_requests enable row level security;
revoke all on public.organization_cife596_feature_requests from authenticated, anon;

create table if not exists public.organization_cife596_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  gap_key text not null,
  gap_title text not null,
  gap_type text not null check (
    gap_type in ('missing_article', 'weak_article', 'frequent_question', 'repeated_search', 'failed_search')
  ),
  gap_status text not null default 'identified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, gap_key)
);

alter table public.organization_cife596_knowledge_gaps enable row level security;
revoke all on public.organization_cife596_knowledge_gaps from authenticated, anon;

create table if not exists public.organization_cife596_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  feedback_count integer not null default 0,
  request_count integer not null default 0,
  satisfaction_score integer not null default 75 check (satisfaction_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_cife596_business_packs enable row level security;
revoke all on public.organization_cife596_business_packs from authenticated, anon;

create table if not exists public.organization_cife596_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'companion_feedback',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_cife596_audit_logs enable row level security;
revoke all on public.organization_cife596_audit_logs from authenticated, anon;

create or replace function public._cife596_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cife596_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'companion_feedback'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cife596_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'companion_feedback'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cife596_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cife596_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cife596_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._cife596_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_cife596_feedback where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_cife596_feedback (
    organization_id, feedback_key, feedback_title, feedback_type, feedback_status, summary
  ) values
    (p_org_id, 'fb_thumbs_up', 'Briefing summary helpful', 'thumbs_up', 'open', 'Quick positive feedback.'),
    (p_org_id, 'fb_thumbs_down', 'Support workflow unclear', 'thumbs_down', 'open', 'Quick negative signal.'),
    (p_org_id, 'fb_quick', 'Quick feedback — faster approvals', 'quick', 'open', 'Organizations should easily provide feedback.'),
    (p_org_id, 'fb_detailed', 'Detailed feedback — onboarding steps', 'detailed', 'open', 'Detailed feedback captured.'),
    (p_org_id, 'fb_feature', 'Feature feedback — export reports', 'feature', 'open', 'Feature-level feedback.'),
    (p_org_id, 'fb_companion', 'Companion feedback — tone consistency', 'companion', 'open', 'Companion experience feedback.'),
    (p_org_id, 'fb_workflow', 'Workflow feedback — renewal process', 'workflow', 'open', 'Workflow feedback signal.');

  insert into public.organization_cife596_suggestions (
    organization_id, suggestion_key, suggestion_title, suggestion_type, suggestion_status, summary
  ) values
    (p_org_id, 'sug_adopt', 'Add guided adoption checklist', 'improvement', 'pending', 'Companion proposes improvement.'),
    (p_org_id, 'sug_notify', 'Reduce notification noise option', 'improvement', 'pending', 'User suggestion for experience.');

  insert into public.organization_cife596_ratings (
    organization_id, rating_key, rating_title, rating_category, rating_level, score, summary
  ) values
    (p_org_id, 'rate_companion', 'Companion Satisfaction', 'companion', 'positive', 82, 'Companion satisfaction measured.'),
    (p_org_id, 'rate_feature', 'Feature Satisfaction', 'feature', 'positive', 78, 'Feature satisfaction tracked.'),
    (p_org_id, 'rate_pack', 'Support Pack Satisfaction', 'business_pack', 'mixed', 68, 'Business Pack satisfaction.'),
    (p_org_id, 'rate_support', 'Support Satisfaction', 'support', 'excellent', 91, 'Support satisfaction excellent.'),
    (p_org_id, 'rate_knowledge', 'Knowledge Satisfaction', 'knowledge', 'improvement_required', 58, 'Knowledge area needs improvement.');

  insert into public.organization_cife596_experience_signals (
    organization_id, signal_key, signal_title, signal_type, signal_count, summary
  ) values
    (p_org_id, 'sig_helpful', 'Helpful Responses', 'helpful_response', 124, 'Companion learns from helpful patterns.'),
    (p_org_id, 'sig_unhelpful', 'Unhelpful Responses', 'unhelpful_response', 18, 'Experience signal for improvement.'),
    (p_org_id, 'sig_repeat', 'Repeated Questions', 'repeated_question', 9, 'Repeated question pattern detected.'),
    (p_org_id, 'sig_escalation', 'Escalations', 'escalation', 4, 'Escalation signal tracked.'),
    (p_org_id, 'sig_ignored', 'Ignored Suggestions', 'ignored_suggestion', 6, 'Suggestions ignored by users.'),
    (p_org_id, 'sig_success', 'Successful Suggestions', 'successful_suggestion', 47, 'Successful suggestion outcomes.');

  insert into public.organization_cife596_improvements (
    organization_id, improvement_key, improvement_title, improvement_type, improvement_status, summary
  ) values
    (p_org_id, 'imp_knowledge', 'Missing knowledge — refund policy', 'missing_knowledge', 'proposed', 'Identify missing knowledge.'),
    (p_org_id, 'imp_workflow', 'Confusing workflow — approval chain', 'confusing_workflow', 'proposed', 'Confusing workflow identified.'),
    (p_org_id, 'imp_repeat', 'Repeated problem — login recovery', 'repeated_problem', 'proposed', 'Repeated problem pattern.'),
    (p_org_id, 'imp_adopt', 'Weak adoption — Analytics Pack', 'weak_adoption', 'proposed', 'Weak adoption area.'),
    (p_org_id, 'imp_training', 'Training gap — new admin onboarding', 'training_gap', 'proposed', 'Training gap identified.');

  insert into public.organization_cife596_quality_metrics (
    organization_id, metric_key, metric_title, metric_type, metric_score, summary
  ) values
    (p_org_id, 'qual_accuracy', 'Response Accuracy', 'response_accuracy', 86, 'Measure Companion effectiveness.'),
    (p_org_id, 'qual_rec', 'Recommendation Quality', 'recommendation_quality', 80, 'Recommendation quality score.'),
    (p_org_id, 'qual_task', 'Task Completion Success', 'task_completion', 77, 'Task completion success rate.'),
    (p_org_id, 'qual_sat', 'User Satisfaction', 'user_satisfaction', 83, 'User satisfaction metric.'),
    (p_org_id, 'qual_follow', 'Follow-Up Success', 'follow_up_success', 74, 'Follow-up success tracked.'),
    (p_org_id, 'qual_knowledge', 'Knowledge Usage', 'knowledge_usage', 71, 'Knowledge usage effectiveness.');

  insert into public.organization_cife596_feedback_loops (
    organization_id, loop_key, loop_title, loop_stage, loop_status, summary
  ) values
    (p_org_id, 'loop_feedback', 'Feedback captured', 'feedback', 'active', 'Organizational feedback loop — feedback stage.'),
    (p_org_id, 'loop_review', 'Leadership review', 'review', 'active', 'Review stage in feedback loop.'),
    (p_org_id, 'loop_improve', 'Improvement planned', 'improvement', 'active', 'Improvement stage.'),
    (p_org_id, 'loop_impl', 'Implementation in progress', 'implementation', 'active', 'Implementation stage.'),
    (p_org_id, 'loop_valid', 'Validation pending', 'validation', 'active', 'Validation stage.'),
    (p_org_id, 'loop_outcome', 'Outcome measured', 'outcome', 'active', 'Outcome stage — continuous improvement.');

  insert into public.organization_cife596_feature_requests (
    organization_id, request_key, request_title, request_source, request_status, summary
  ) values
    (p_org_id, 'req_customer', 'Customer request — SSO integration', 'customer', 'visible', 'Customer feature request.'),
    (p_org_id, 'req_partner', 'Partner request — API webhooks', 'partner', 'visible', 'Partner request tracked.'),
    (p_org_id, 'req_enterprise', 'Enterprise request — audit export', 'enterprise', 'visible', 'Enterprise request visible.'),
    (p_org_id, 'req_internal', 'Internal request — bulk actions', 'internal', 'visible', 'Internal request logged.');

  insert into public.organization_cife596_knowledge_gaps (
    organization_id, gap_key, gap_title, gap_type, gap_status, summary
  ) values
    (p_org_id, 'gap_missing', 'Missing article — billing FAQ', 'missing_article', 'identified', 'Missing knowledge article.'),
    (p_org_id, 'gap_weak', 'Weak article — install guide v3', 'weak_article', 'identified', 'Weak article flagged.'),
    (p_org_id, 'gap_faq', 'FAQ — password reset steps', 'frequent_question', 'identified', 'Frequently asked question.'),
    (p_org_id, 'gap_search', 'Repeated search — export data', 'repeated_search', 'identified', 'Repeated search pattern.'),
    (p_org_id, 'gap_failed', 'Failed search — compliance report', 'failed_search', 'identified', 'Failed search signal.');

  insert into public.organization_cife596_business_packs (
    organization_id, pack_key, pack_title, feedback_count, request_count, satisfaction_score, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 14, 3, 72, 'Support Pack → support feedback.'),
    (p_org_id, 'hosts', 'Hosts Pack', 8, 2, 85, 'Hosts Pack → host feedback.'),
    (p_org_id, 'finance', 'Finance Pack', 5, 1, 79, 'Finance Pack → finance feedback.');

  perform public._cife596_log(p_org_id, 'feedback_submitted', 'Feedback center baseline seeded.');
end; $$;

create or replace function public.get_organization_feedback_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_avg_quality integer;
  v_avg_satisfaction integer;
begin
  v_org_id := public._cife596_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cife596_seed(v_org_id);

  v_avg_quality := coalesce((
    select round(avg(metric_score)) from public.organization_cife596_quality_metrics where organization_id = v_org_id
  ), 75);
  v_avg_satisfaction := coalesce((
    select round(avg(score)) from public.organization_cife596_ratings where organization_id = v_org_id
  ), 75);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'The best companions improve over time — governed, transparent, and safe.',
      'privacy_note', 'Experience evolution without changing identity or losing trust.',
      'executive_dashboard', jsonb_build_object(
        'companion_satisfaction', v_avg_satisfaction,
        'companion_quality', v_avg_quality,
        'open_feedback', (select count(*) from public.organization_cife596_feedback where organization_id = v_org_id),
        'improvement_opportunities', (select count(*) from public.organization_cife596_improvements where organization_id = v_org_id),
        'feature_requests', (select count(*) from public.organization_cife596_feature_requests where organization_id = v_org_id),
        'knowledge_gaps', (select count(*) from public.organization_cife596_knowledge_gaps where organization_id = v_org_id)
      ),
      'stats', jsonb_build_object(
        'feedback', (select count(*) from public.organization_cife596_feedback where organization_id = v_org_id),
        'suggestions', (select count(*) from public.organization_cife596_suggestions where organization_id = v_org_id),
        'ratings', (select count(*) from public.organization_cife596_ratings where organization_id = v_org_id),
        'experience_signals', (select count(*) from public.organization_cife596_experience_signals where organization_id = v_org_id),
        'improvements', (select count(*) from public.organization_cife596_improvements where organization_id = v_org_id),
        'quality_metrics', (select count(*) from public.organization_cife596_quality_metrics where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'improvement_title', i.improvement_title, 'recommendation', i.summary
        ) order by i.improvement_type)
        from public.organization_cife596_improvements i
        where i.organization_id = v_org_id
        limit 4
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Companion continuously helps improve the experience — without sacrificing governance.',
    'privacy_note', 'Metadata-first feedback intelligence — human review always available.',
    'executive_dashboard', jsonb_build_object(
      'companion_satisfaction', v_avg_satisfaction,
      'companion_quality', v_avg_quality,
      'open_feedback', (select count(*) from public.organization_cife596_feedback where organization_id = v_org_id),
      'improvement_opportunities', (select count(*) from public.organization_cife596_improvements where organization_id = v_org_id),
      'feature_requests', (select count(*) from public.organization_cife596_feature_requests where organization_id = v_org_id),
      'knowledge_gaps', (select count(*) from public.organization_cife596_knowledge_gaps where organization_id = v_org_id)
    ),
    'feedback', coalesce((select jsonb_agg(jsonb_build_object(
      'feedback_key', f.feedback_key, 'feedback_title', f.feedback_title,
      'feedback_type', f.feedback_type, 'feedback_status', f.feedback_status, 'summary', f.summary
    ) order by f.feedback_type) from public.organization_cife596_feedback f where f.organization_id = v_org_id), '[]'::jsonb),
    'suggestions', coalesce((select jsonb_agg(jsonb_build_object(
      'suggestion_key', s.suggestion_key, 'suggestion_title', s.suggestion_title,
      'suggestion_type', s.suggestion_type, 'suggestion_status', s.suggestion_status, 'summary', s.summary
    ) order by s.suggestion_status) from public.organization_cife596_suggestions s where s.organization_id = v_org_id), '[]'::jsonb),
    'ratings', coalesce((select jsonb_agg(jsonb_build_object(
      'rating_key', r.rating_key, 'rating_title', r.rating_title,
      'rating_category', r.rating_category, 'rating_level', r.rating_level,
      'score', r.score, 'summary', r.summary
    ) order by r.score) from public.organization_cife596_ratings r where r.organization_id = v_org_id), '[]'::jsonb),
    'experience_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'signal_title', s.signal_title,
      'signal_type', s.signal_type, 'signal_count', s.signal_count, 'summary', s.summary
    ) order by s.signal_count desc) from public.organization_cife596_experience_signals s where s.organization_id = v_org_id), '[]'::jsonb),
    'improvements', coalesce((select jsonb_agg(jsonb_build_object(
      'improvement_key', i.improvement_key, 'improvement_title', i.improvement_title,
      'improvement_type', i.improvement_type, 'improvement_status', i.improvement_status, 'summary', i.summary
    ) order by i.improvement_type) from public.organization_cife596_improvements i where i.organization_id = v_org_id), '[]'::jsonb),
    'quality_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'metric_title', m.metric_title,
      'metric_type', m.metric_type, 'metric_score', m.metric_score, 'summary', m.summary
    ) order by m.metric_score desc) from public.organization_cife596_quality_metrics m where m.organization_id = v_org_id), '[]'::jsonb),
    'feedback_loops', coalesce((select jsonb_agg(jsonb_build_object(
      'loop_key', l.loop_key, 'loop_title', l.loop_title,
      'loop_stage', l.loop_stage, 'loop_status', l.loop_status, 'summary', l.summary
    ) order by l.loop_stage) from public.organization_cife596_feedback_loops l where l.organization_id = v_org_id), '[]'::jsonb),
    'feature_requests', coalesce((select jsonb_agg(jsonb_build_object(
      'request_key', r.request_key, 'request_title', r.request_title,
      'request_source', r.request_source, 'request_status', r.request_status, 'summary', r.summary
    ) order by r.request_source) from public.organization_cife596_feature_requests r where r.organization_id = v_org_id), '[]'::jsonb),
    'knowledge_gaps', coalesce((select jsonb_agg(jsonb_build_object(
      'gap_key', g.gap_key, 'gap_title', g.gap_title,
      'gap_type', g.gap_type, 'gap_status', g.gap_status, 'summary', g.summary
    ) order by g.gap_type) from public.organization_cife596_knowledge_gaps g where g.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title,
      'feedback_count', p.feedback_count, 'request_count', p.request_count,
      'satisfaction_score', p.satisfaction_score, 'summary', p.summary
    ) order by p.feedback_count desc) from public.organization_cife596_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'frustrations', 'What frustrates users?',
      'works_best', 'What works best?',
      'improve_next', 'What should improve next?',
      'pack_feedback', 'Which Business Pack receives the most feedback?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_cife596_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'submit_feedback', true, 'review_requests', true, 'review_improvements', true,
      'review_satisfaction', true, 'generate_reports', true
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_experience_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_feedback_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Experience Report',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'frustrations',
        'observation', format('%s unhelpful signal(s) and %s improvement item(s).', v_stats->>'experience_signals', v_stats->>'improvements'),
        'recommendation', 'Review what frustrates users and prioritize fixes.',
        'href', '/app/feedback/insights'
      ),
      jsonb_build_object(
        'key', 'works_best',
        'observation', format('Companion quality score %s — satisfaction %s.', v_exec->>'companion_quality', v_exec->>'companion_satisfaction'),
        'recommendation', 'Double down on patterns that work best.',
        'href', '/app/feedback/ratings'
      ),
      jsonb_build_object(
        'key', 'improve_next',
        'observation', format('%s knowledge gap(s) identified.', v_exec->>'knowledge_gaps'),
        'recommendation', 'Address top knowledge improvements next.',
        'href', '/app/feedback/improvements'
      ),
      jsonb_build_object(
        'key', 'pack_feedback',
        'observation', format('%s open feedback item(s) across organization.', v_exec->>'open_feedback'),
        'recommendation', 'Review Business Pack feedback distribution.',
        'href', '/app/feedback/reports'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_feedback_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_feedback_center('overview');
end;
$$;

grant execute on function public.get_organization_feedback_center(text) to authenticated;
grant execute on function public.get_aipify_companion_experience_advisor_bundle() to authenticated;
grant execute on function public.get_organization_feedback_center_mobile_summary() to authenticated;
