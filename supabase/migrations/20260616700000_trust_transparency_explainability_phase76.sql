-- Phase 76 — Trust, Transparency & Explainability Engine

-- ---------------------------------------------------------------------------
-- 1. decision_explanations
-- ---------------------------------------------------------------------------
create table if not exists public.decision_explanations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  decision_id text not null,
  decision_type text not null check (
    decision_type in (
      'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
      'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
      'learning', 'security', 'agent_collaboration'
    )
  ),
  source_module text not null,
  summary text not null,
  reasoning text,
  information_used jsonb not null default '[]'::jsonb,
  rules_applied jsonb not null default '[]'::jsonb,
  confidence_level text not null default 'medium' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  alternatives_considered jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  explanation_layers jsonb not null default '{}'::jsonb,
  overridden boolean not null default false,
  escalated boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tenant_id, decision_id)
);

create index if not exists decision_explanations_tenant_idx
  on public.decision_explanations (tenant_id, decision_type, created_at desc);

alter table public.decision_explanations enable row level security;
revoke all on public.decision_explanations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. explanation_events
-- ---------------------------------------------------------------------------
create table if not exists public.explanation_events (
  id uuid primary key default gen_random_uuid(),
  explanation_id uuid not null references public.decision_explanations (id) on delete cascade,
  event_type text not null,
  actor text not null default 'system',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists explanation_events_explanation_idx
  on public.explanation_events (explanation_id, created_at desc);

alter table public.explanation_events enable row level security;
revoke all on public.explanation_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. explainability_trust_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.explainability_trust_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  recorded_at timestamptz not null default now()
);

create index if not exists explainability_trust_metrics_tenant_idx
  on public.explainability_trust_metrics (tenant_id, metric_key, recorded_at desc);

alter table public.explainability_trust_metrics enable row level security;
revoke all on public.explainability_trust_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. explanation_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.explanation_feedback (
  id uuid primary key default gen_random_uuid(),
  explanation_id uuid not null references public.decision_explanations (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  rating text not null check (
    rating in ('helpful', 'unclear', 'incorrect', 'needs_more_detail')
  ),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.explanation_feedback enable row level security;
revoke all on public.explanation_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. explainability_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.explainability_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists explainability_audit_tenant_idx
  on public.explainability_audit_log (tenant_id, created_at desc);

alter table public.explainability_audit_log enable row level security;
revoke all on public.explainability_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_tte_)
-- ---------------------------------------------------------------------------
create or replace function public._tte_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._tte_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._tte_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.explainability_audit_log (
    tenant_id, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_event_type, p_summary,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._tte_auth_user_id())
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'explainability_' || p_event_type, 'decision_explanations', 'logged', p_user_id, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._tte_explanation_json(p_row public.decision_explanations)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'id', p_row.id, 'decision_id', p_row.decision_id, 'decision_type', p_row.decision_type,
    'source_module', p_row.source_module, 'summary', p_row.summary, 'reasoning', p_row.reasoning,
    'information_used', p_row.information_used, 'rules_applied', p_row.rules_applied,
    'confidence_level', p_row.confidence_level,
    'alternatives_considered', p_row.alternatives_considered,
    'recommended_actions', p_row.recommended_actions,
    'explanation_layers', p_row.explanation_layers,
    'overridden', p_row.overridden, 'escalated', p_row.escalated,
    'created_at', p_row.created_at
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Generate explanation
-- ---------------------------------------------------------------------------
create or replace function public.generate_decision_explanation(
  p_decision_id text,
  p_decision_type text,
  p_source_module text,
  p_summary text,
  p_reasoning text default null,
  p_information_used jsonb default '[]'::jsonb,
  p_rules_applied jsonb default '[]'::jsonb,
  p_confidence_level text default 'medium',
  p_alternatives jsonb default '[]'::jsonb,
  p_recommended_actions jsonb default '[]'::jsonb,
  p_layers jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.decision_explanations;
  v_simple text;
begin
  v_tenant_id := public._tte_require_tenant();
  v_simple := coalesce(p_layers->>'simple', p_summary);

  insert into public.decision_explanations (
    tenant_id, decision_id, decision_type, source_module, summary, reasoning,
    information_used, rules_applied, confidence_level,
    alternatives_considered, recommended_actions, explanation_layers,
    escalated
  ) values (
    v_tenant_id, p_decision_id, p_decision_type, p_source_module, p_summary, p_reasoning,
    coalesce(p_information_used, '[]'::jsonb), coalesce(p_rules_applied, '[]'::jsonb),
    coalesce(p_confidence_level, 'medium'),
    coalesce(p_alternatives, '[]'::jsonb), coalesce(p_recommended_actions, '[]'::jsonb),
    coalesce(p_layers, '{}'::jsonb) || jsonb_build_object('simple', v_simple),
    coalesce(p_confidence_level, 'medium') = 'low'
  )
  on conflict (tenant_id, decision_id) do update set
    summary = excluded.summary, reasoning = excluded.reasoning,
    information_used = excluded.information_used, rules_applied = excluded.rules_applied,
    confidence_level = excluded.confidence_level,
    alternatives_considered = excluded.alternatives_considered,
    recommended_actions = excluded.recommended_actions,
    explanation_layers = excluded.explanation_layers
  returning * into v_row;

  insert into public.explanation_events (explanation_id, event_type, actor, metadata)
  values (v_row.id, 'generated', 'system', jsonb_build_object('decision_type', p_decision_type));

  perform public._tte_log_audit(v_tenant_id, 'explanation_generated',
    'Explanation generated: ' || p_summary,
    jsonb_build_object('explanation_id', v_row.id, 'decision_id', p_decision_id));

  return public._tte_explanation_json(v_row);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Seed sample explanations
-- ---------------------------------------------------------------------------
create or replace function public._tte_seed_explanations()
returns void language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return; end if;

  perform public.generate_decision_explanation(
    'gov-block-external-email-' || v_tenant_id::text, 'governance', 'governance',
    'External communication blocked — approval required.',
    'Risk Level: High. Policy Rule external_email_approval_v2 prevented automatic execution due to missing Governance approval.',
    '["pending_support_draft","customer_email_detected"]'::jsonb,
    '["external_email_approval_v2","governance_high_risk"]'::jsonb,
    'high',
    '["send_without_approval","queue_for_review"]'::jsonb,
    '["Submit approval request","Edit draft before sending"]'::jsonb,
    '{"simple":"This action was blocked because external customer communication requires approval.","operational":"Governance flagged high-risk external email. Approval workflow required.","technical":"Policy Rule external_email_approval_v2 blocked execution."}'::jsonb
  );

  perform public.generate_decision_explanation(
    'mkp-rec-support-pack-' || v_tenant_id::text, 'marketplace', 'marketplace',
    'Support Pack recommended based on support volume and Knowledge Gaps.',
    'Increased support volume, repeated Knowledge Gaps, and positive outcomes from similar configurations.',
    '["support_volume_30d","knowledge_gaps_count","similar_tenant_outcomes"]'::jsonb,
    '["marketplace_recommendation_engine"]'::jsonb,
    'high',
    '["knowledge_pack_only","no_action"]'::jsonb,
    '["Review Support Pack","Install from Marketplace"]'::jsonb,
    '{"simple":"We recommend the Support Pack because support volume increased and knowledge gaps were detected."}'::jsonb
  );

  perform public.generate_decision_explanation(
    'ibp-restaurant-' || v_tenant_id::text, 'blueprint', 'industry_blueprints',
    'Restaurant Blueprint recommended — 91% industry alignment.',
    'Booking-related workflows detected, hospitality support patterns identified.',
    '["booking_workflows","hospitality_keywords","support_patterns"]'::jsonb,
    '["blueprint_recommendation_engine"]'::jsonb,
    'high',
    '["generic_saas_blueprint"]'::jsonb,
    '["Review Blueprint","Apply via Marketplace"]'::jsonb,
    '{"simple":"Restaurant Blueprint fits your booking and hospitality patterns."}'::jsonb
  );

  perform public.generate_decision_explanation(
    'desktop-reminder-' || v_tenant_id::text, 'desktop', 'desktop_companion',
    'Reminder sent — task due tomorrow.',
    'Task due tomorrow, user assigned as owner, previous reminders were ignored.',
    '["task_due_date","assignee_match","reminder_history"]'::jsonb,
    '["desktop_reminder_policy"]'::jsonb,
    'medium',
    '["wait_until_due","escalate_to_manager"]'::jsonb,
    '["Complete task","Snooze reminder","Reassign task"]'::jsonb,
    '{"simple":"This notification was sent because the task is due tomorrow."}'::jsonb
  );

  perform public.generate_decision_explanation(
    'val-time-saved-' || v_tenant_id::text, 'value', 'value_engine',
    'Estimated 15 hours saved from support drafts.',
    '180 support drafts × 5-minute conservative estimate per draft.',
    '["support_drafts_accepted_180","time_rule_5min_per_draft"]'::jsonb,
    '["value_engine_conservative_rules"]'::jsonb,
    'high',
    '["exclude_quality_events"]'::jsonb,
    '["View Value Report","Configure ROI settings"]'::jsonb,
    '{"simple":"Aipify saved an estimated 15 hours from accepted support drafts."}'::jsonb
  );

  perform public.generate_decision_explanation(
    'agent-collab-support-' || v_tenant_id::text, 'agent_collaboration', 'collaboration_agents',
    'Support scenario escalated to support lead.',
    'Support Agent requested assistance. Knowledge Agent provided context. Governance required approval. Action Agent created task.',
    '["low_confidence_support","knowledge_articles_found","governance_approval_required"]'::jsonb,
    '["agent_orchestration_flow","governance_wins_on_disagreement"]'::jsonb,
    'medium',
    '["auto_send_response"]'::jsonb,
    '["Review task","Approve external response"]'::jsonb,
    '{"simple":"Agents collaborated and escalated because approval was required."}'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Feedback, override, view tracking
-- ---------------------------------------------------------------------------
create or replace function public.submit_explanation_feedback(
  p_explanation_id uuid, p_rating text, p_comment text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid;
begin
  v_tenant_id := public._tte_require_tenant();
  v_user_id := public._tte_auth_user_id();

  insert into public.explanation_feedback (explanation_id, tenant_id, user_id, rating, comment)
  values (p_explanation_id, v_tenant_id, v_user_id, p_rating, p_comment)
  returning id into v_id;

  insert into public.explanation_events (explanation_id, event_type, actor, metadata)
  values (p_explanation_id, 'feedback', coalesce(v_user_id::text, 'user'),
    jsonb_build_object('rating', p_rating));

  perform public._tte_log_audit(v_tenant_id, 'feedback_submitted',
    'Explanation feedback: ' || p_rating, jsonb_build_object('feedback_id', v_id));

  return jsonb_build_object('status', 'recorded', 'feedback_id', v_id);
end; $$;

create or replace function public.override_decision_explanation(
  p_explanation_id uuid, p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.decision_explanations;
begin
  v_tenant_id := public._tte_require_tenant();

  update public.decision_explanations
  set overridden = true
  where id = p_explanation_id and tenant_id = v_tenant_id
  returning * into v_row;

  if v_row.id is null then return jsonb_build_object('status', 'not_found'); end if;

  insert into public.explanation_events (explanation_id, event_type, actor, metadata)
  values (p_explanation_id, 'override', public._tte_auth_user_id()::text,
    jsonb_build_object('reason', p_reason));

  perform public._tte_log_audit(v_tenant_id, 'human_override',
    'Human override on explanation', jsonb_build_object('explanation_id', p_explanation_id));

  return jsonb_build_object('status', 'overridden', 'explanation', public._tte_explanation_json(v_row));
end; $$;

create or replace function public.record_explanation_view(p_explanation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._tte_require_tenant();

  if not exists(
    select 1 from public.decision_explanations where id = p_explanation_id and tenant_id = v_tenant_id
  ) then
    return jsonb_build_object('status', 'not_found');
  end if;

  insert into public.explanation_events (explanation_id, event_type, actor)
  values (p_explanation_id, 'viewed', coalesce(public._tte_auth_user_id()::text, 'user'));

  perform public._tte_log_audit(v_tenant_id, 'explanation_viewed', null,
    jsonb_build_object('explanation_id', p_explanation_id));

  return jsonb_build_object('status', 'recorded');
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Trust score & metrics jobs
-- ---------------------------------------------------------------------------
create or replace function public.calculate_explainability_trust_score()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_total int;
  v_viewed int;
  v_helpful int;
  v_overrides int;
  v_escalations int;
  v_coverage numeric;
  v_view_rate numeric;
  v_satisfaction numeric;
  v_override_rate numeric;
  v_score numeric;
begin
  v_tenant_id := public._tte_require_tenant();
  perform public._tte_seed_explanations();

  select count(*) into v_total from public.decision_explanations where tenant_id = v_tenant_id;
  select count(distinct explanation_id) into v_viewed
  from public.explanation_events e
  join public.decision_explanations d on d.id = e.explanation_id
  where d.tenant_id = v_tenant_id and e.event_type = 'viewed';

  select count(*) into v_helpful
  from public.explanation_feedback f
  where f.tenant_id = v_tenant_id and f.rating = 'helpful';

  select count(*) into v_overrides from public.decision_explanations
  where tenant_id = v_tenant_id and overridden;

  select count(*) into v_escalations from public.decision_explanations
  where tenant_id = v_tenant_id and escalated;

  v_coverage := case when v_total > 0 then 100 else 0 end;
  v_view_rate := case when v_total > 0 then round(v_viewed::numeric / v_total * 100, 1) else 0 end;
  v_satisfaction := case when v_helpful > 0 then least(100, v_helpful * 10) else 50 end;
  v_override_rate := case when v_total > 0 then round(v_overrides::numeric / v_total * 100, 1) else 0 end;

  v_score := greatest(0, least(100, round(
    v_coverage * 0.25 + v_view_rate * 0.2 + v_satisfaction * 0.25 +
    (100 - v_override_rate) * 0.15 + (100 - least(v_escalations * 5, 50)) * 0.15
  , 1)));

  insert into public.explainability_trust_metrics (tenant_id, metric_key, metric_value)
  values
    (v_tenant_id, 'trust_score', v_score),
    (v_tenant_id, 'explanation_coverage', v_coverage),
    (v_tenant_id, 'explanation_view_rate', v_view_rate),
    (v_tenant_id, 'explanation_satisfaction', v_satisfaction),
    (v_tenant_id, 'override_frequency', v_override_rate),
    (v_tenant_id, 'human_escalation_rate', v_escalations);

  perform public._tte_log_audit(v_tenant_id, 'trust_score_recalculated',
    'Trust Score: ' || v_score, jsonb_build_object('trust_score', v_score));

  return jsonb_build_object(
    'trust_score', v_score,
    'explanation_coverage', v_coverage,
    'view_rate', v_view_rate,
    'satisfaction', v_satisfaction,
    'override_rate', v_override_rate,
    'escalations', v_escalations,
    'total_explanations', v_total
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_score numeric; v_total int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select metric_value into v_score from public.explainability_trust_metrics
  where tenant_id = v_tenant_id and metric_key = 'trust_score'
  order by recorded_at desc limit 1;

  select count(*) into v_total from public.decision_explanations where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'trust_score', coalesce(v_score, 75),
    'explanation_count', v_total,
    'philosophy', 'No important decision without explanation.',
    'privacy_note', 'Explanations never expose secrets or cross-tenant data.'
  );
end; $$;

create or replace function public.get_trust_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_trust jsonb;
  v_explanations jsonb;
  v_metrics jsonb;
  v_feedback jsonb;
begin
  v_tenant_id := public._tte_require_tenant();
  v_trust := public.calculate_explainability_trust_score();

  select coalesce(jsonb_agg(public._tte_explanation_json(d) order by d.created_at desc), '[]'::jsonb)
  into v_explanations
  from public.decision_explanations d where d.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'metric_key', m.metric_key, 'metric_value', m.metric_value, 'recorded_at', m.recorded_at
  ) order by m.recorded_at desc), '[]'::jsonb)
  into v_metrics
  from public.explainability_trust_metrics m
  where m.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'rating', f.rating, 'comment', f.comment, 'created_at', f.created_at
  ) order by f.created_at desc), '[]'::jsonb)
  into v_feedback
  from public.explanation_feedback f where f.tenant_id = v_tenant_id limit 10;

  return jsonb_build_object(
    'has_customer', true,
    'trust_score', v_trust->'trust_score',
    'coverage', v_trust->'explanation_coverage',
    'view_rate', v_trust->'view_rate',
    'override_rate', v_trust->'override_rate',
    'escalations', v_trust->'escalations',
    'explanations', v_explanations,
    'metrics', v_metrics,
    'recent_feedback', v_feedback
  );
end; $$;

create or replace function public.get_decision_explanation(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.decision_explanations; v_events jsonb;
begin
  v_tenant_id := public._tte_require_tenant();
  select * into v_row from public.decision_explanations
  where id = p_id and tenant_id = v_tenant_id;
  if v_row.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', e.event_type, 'actor', e.actor, 'metadata', e.metadata, 'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb) into v_events
  from public.explanation_events e where e.explanation_id = p_id;

  perform public.record_explanation_view(p_id);

  return jsonb_build_object(
    'explanation', public._tte_explanation_json(v_row),
    'events', v_events
  );
end; $$;

create or replace function public.get_decision_explanation_by_decision(p_decision_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.decision_explanations;
begin
  v_tenant_id := public._tte_require_tenant();
  select * into v_row from public.decision_explanations
  where decision_id = p_decision_id and tenant_id = v_tenant_id;
  if v_row.id is null then return jsonb_build_object('error', 'not_found'); end if;
  return public.get_decision_explanation(v_row.id);
end; $$;

create or replace function public.list_decision_explanations(p_decision_type text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._tte_require_tenant();
  perform public._tte_seed_explanations();

  return jsonb_build_object('explanations', coalesce((
    select jsonb_agg(public._tte_explanation_json(d) order by d.created_at desc)
    from public.decision_explanations d
    where d.tenant_id = v_tenant_id
      and (p_decision_type is null or d.decision_type = p_decision_type)
  ), '[]'::jsonb));
end; $$;

end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'trust', 'Trust & Explainability', 'How Aipify explains decisions and earns trust.', 'authenticated', 20
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'trust' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 13. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.generate_decision_explanation(text, text, text, text, text, jsonb, jsonb, text, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.submit_explanation_feedback(uuid, text, text) to authenticated;
grant execute on function public.override_decision_explanation(uuid, text) to authenticated;
grant execute on function public.record_explanation_view(uuid) to authenticated;
grant execute on function public.calculate_explainability_trust_score() to authenticated;
grant execute on function public.get_trust_card() to authenticated;
grant execute on function public.get_trust_dashboard() to authenticated;
grant execute on function public.get_decision_explanation(uuid) to authenticated;
grant execute on function public.get_decision_explanation_by_decision(text) to authenticated;
grant execute on function public.list_decision_explanations(text) to authenticated;
