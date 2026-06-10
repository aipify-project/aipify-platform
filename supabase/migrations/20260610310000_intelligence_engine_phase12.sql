-- Phase 12: Aipify Intelligence Engine (foundation)
-- Learning queue, brain metrics, self-healing strategies, automation categories, global patterns

-- ---------------------------------------------------------------------------
-- intelligence_patterns (learning queue)
-- ---------------------------------------------------------------------------
create table if not exists public.intelligence_patterns (
  id uuid primary key default gen_random_uuid(),
  pattern_title text not null,
  category text not null check (
    category in (
      'support', 'technical', 'onboarding', 'billing', 'automation',
      'integration', 'health', 'system'
    )
  ),
  environment_type text not null check (
    environment_type in ('internal', 'pilot', 'customer', 'enterprise', 'global')
  ),
  tenant_id uuid references public.customers (id) on delete set null,
  detection_count integer not null default 0 check (detection_count >= 0),
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  potential_impact text not null default 'medium' check (
    potential_impact in ('low', 'medium', 'high', 'critical')
  ),
  suggested_action text not null,
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected', 'more_data', 'archived')
  ),
  first_detected timestamptz not null default now(),
  last_detected timestamptz not null default now(),
  source_ai_pattern_id uuid references public.ai_patterns (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists intelligence_patterns_status_idx
  on public.intelligence_patterns (approval_status, last_detected desc);
create index if not exists intelligence_patterns_env_idx
  on public.intelligence_patterns (environment_type, category);

create unique index if not exists intelligence_patterns_title_env_uidx
  on public.intelligence_patterns (pattern_title, environment_type);

-- ---------------------------------------------------------------------------
-- intelligence_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.intelligence_reviews (
  id uuid primary key default gen_random_uuid(),
  pattern_id uuid not null references public.intelligence_patterns (id) on delete cascade,
  reviewer_email text not null,
  action text not null check (
    action in ('approve', 'reject', 'request_more_data')
  ),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists intelligence_reviews_pattern_id_idx
  on public.intelligence_reviews (pattern_id, created_at desc);

-- ---------------------------------------------------------------------------
-- global_patterns (approved, anonymised ecosystem patterns)
-- ---------------------------------------------------------------------------
create table if not exists public.global_patterns (
  id uuid primary key default gen_random_uuid(),
  intelligence_pattern_id uuid references public.intelligence_patterns (id) on delete set null,
  pattern_title text not null unique,
  category text not null,
  suggested_action text not null,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  detection_count integer not null default 0,
  source_environment text not null check (
    source_environment in ('internal', 'pilot', 'customer', 'enterprise')
  ),
  approved_at timestamptz not null default now(),
  approved_by text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pattern_votes
-- ---------------------------------------------------------------------------
create table if not exists public.pattern_votes (
  id uuid primary key default gen_random_uuid(),
  pattern_id uuid not null references public.intelligence_patterns (id) on delete cascade,
  voter_email text not null,
  vote text not null check (vote in ('up', 'down', 'neutral')),
  created_at timestamptz not null default now(),
  unique (pattern_id, voter_email)
);

-- ---------------------------------------------------------------------------
-- healing_strategies
-- ---------------------------------------------------------------------------
create table if not exists public.healing_strategies (
  id uuid primary key default gen_random_uuid(),
  strategy_key text not null unique,
  title text not null,
  description text,
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  auto_execute boolean not null default false,
  category text not null default 'system',
  success_count integer not null default 0,
  failure_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- automation_categories
-- ---------------------------------------------------------------------------
create table if not exists public.automation_categories (
  id uuid primary key default gen_random_uuid(),
  category_key text not null unique,
  title text not null,
  description text,
  badge_label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.automation_categories (category_key, title, description, badge_label, sort_order)
values
  ('ai_generated', 'AI Generated', 'Created by Aipify intelligence.', 'AI Generated', 1),
  ('admin_approved', 'Admin Approved', 'Created and approved by platform admins.', 'Admin Approved', 2),
  ('self_healing', 'Self-Healing', 'Automations capable of automatic repairs.', 'Self-Healing', 3)
on conflict (category_key) do nothing;

alter table public.platform_automations
  add column if not exists category_key text references public.automation_categories (category_key)
    on delete set null default 'admin_approved';

-- ---------------------------------------------------------------------------
-- brain_metrics (snapshot cache)
-- ---------------------------------------------------------------------------
create table if not exists public.brain_metrics (
  id uuid primary key default gen_random_uuid(),
  knowledge_patterns_approved integer not null default 0,
  patterns_awaiting_review integer not null default 0,
  learning_events_30d integer not null default 0,
  self_healing_success_rate integer not null default 0 check (self_healing_success_rate between 0 and 100),
  global_recommendations_generated integer not null default 0,
  learning_confidence integer not null default 0 check (learning_confidence between 0 and 100),
  approved_automations_from_learning integer not null default 0,
  automation_coverage integer not null default 0 check (automation_coverage between 0 and 100),
  recorded_at timestamptz not null default now()
);

create index if not exists brain_metrics_recorded_at_idx
  on public.brain_metrics (recorded_at desc);

-- Compatibility views (spec table names)
create or replace view public.learning_events as
  select * from public.ai_learning_events;

create or replace view public.self_healing_runs as
  select * from public.ai_self_healing_executions;

-- RLS: platform RPC access only
alter table public.intelligence_patterns enable row level security;
alter table public.intelligence_reviews enable row level security;
alter table public.global_patterns enable row level security;
alter table public.pattern_votes enable row level security;
alter table public.healing_strategies enable row level security;
alter table public.automation_categories enable row level security;
alter table public.brain_metrics enable row level security;

revoke all on public.intelligence_patterns from authenticated, anon;
revoke all on public.intelligence_reviews from authenticated, anon;
revoke all on public.global_patterns from authenticated, anon;
revoke all on public.pattern_votes from authenticated, anon;
revoke all on public.healing_strategies from authenticated, anon;
revoke all on public.automation_categories from authenticated, anon;
revoke all on public.brain_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Core functions
-- ---------------------------------------------------------------------------
create or replace function public.upsert_intelligence_pattern(
  p_pattern_title text,
  p_category text,
  p_environment_type text,
  p_suggested_action text,
  p_confidence_score integer default 50,
  p_potential_impact text default 'medium',
  p_tenant_id uuid default null,
  p_source_ai_pattern_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.intelligence_patterns (
    pattern_title, category, environment_type, tenant_id,
    detection_count, confidence_score, potential_impact, suggested_action,
    source_ai_pattern_id, first_detected, last_detected, updated_at
  )
  values (
    p_pattern_title, p_category, p_environment_type, p_tenant_id,
    1, p_confidence_score, p_potential_impact, p_suggested_action,
    p_source_ai_pattern_id, now(), now(), now()
  )
  on conflict (pattern_title, environment_type) do update set
    detection_count = public.intelligence_patterns.detection_count + 1,
    last_detected = now(),
    confidence_score = least(100, public.intelligence_patterns.confidence_score + 2),
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.upsert_intelligence_pattern(
  text, text, text, text, integer, text, uuid, uuid
) to authenticated;

create or replace function public.refresh_brain_metrics()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_healing_total integer;
  v_healing_success integer;
  v_success_rate integer;
  v_avg_confidence numeric;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select count(*), count(*) filter (where execution_result = 'success')
  into v_healing_total, v_healing_success
  from public.ai_self_healing_executions
  where executed_at >= now() - interval '30 days';

  v_success_rate := case
    when v_healing_total = 0 then 0
    else round((v_healing_success::numeric / v_healing_total) * 100)
  end;

  select coalesce(avg(confidence_score), 0)
  into v_avg_confidence
  from public.intelligence_patterns
  where approval_status in ('pending', 'approved');

  insert into public.brain_metrics (
    knowledge_patterns_approved,
    patterns_awaiting_review,
    learning_events_30d,
    self_healing_success_rate,
    global_recommendations_generated,
    learning_confidence,
    approved_automations_from_learning,
    automation_coverage
  )
  values (
    (select count(*) from public.global_patterns where active = true),
    (select count(*) from public.intelligence_patterns where approval_status = 'pending'),
    (select count(*) from public.ai_learning_events where created_at >= now() - interval '30 days'),
    v_success_rate,
    (select count(*) from public.ai_recommendations where created_at >= now() - interval '30 days'),
    round(v_avg_confidence)::integer,
    (select count(*) from public.platform_automations where category_key = 'ai_generated'),
    case
      when (select count(*) from public.platform_automations) = 0 then 0
      else round(
        (select count(*) from public.platform_automations where status = 'active')::numeric
        / (select count(*) from public.platform_automations) * 100
      )::integer
    end
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.refresh_brain_metrics() to authenticated;

create or replace function public.get_intelligence_brain_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_metrics public.brain_metrics%rowtype;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  perform public.refresh_brain_metrics();

  select * into v_metrics
  from public.brain_metrics
  order by recorded_at desc
  limit 1;

  return jsonb_build_object(
    'metrics', coalesce(row_to_json(v_metrics), '{}'::json),
    'recommendations', coalesce(
      (select jsonb_agg(
        jsonb_build_object(
          'id', gp.id,
          'message', gp.pattern_title,
          'suggested_action', gp.suggested_action,
          'confidence', gp.confidence_score,
          'category', gp.category
        )
        order by gp.detection_count desc
      )
      from public.global_patterns gp
      where gp.active = true
      limit 6),
      '[]'::jsonb
    ),
    'recent_reviews', coalesce(
      (select jsonb_agg(row_to_json(ir.*) order by ir.created_at desc)
       from public.intelligence_reviews ir
       limit 10),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_intelligence_brain_dashboard() to authenticated;

create or replace function public.get_intelligence_learning_queue()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'patterns', coalesce(
      (select jsonb_agg(row_to_json(ip.*) order by ip.confidence_score desc, ip.detection_count desc)
       from public.intelligence_patterns ip
       where ip.approval_status in ('pending', 'more_data')),
      '[]'::jsonb
    ),
    'archived', coalesce(
      (select jsonb_agg(row_to_json(ip.*) order by ip.updated_at desc)
       from public.intelligence_patterns ip
       where ip.approval_status in ('rejected', 'archived')
       limit 20),
      '[]'::jsonb
    ),
    'totals', jsonb_build_object(
      'pending', (select count(*) from public.intelligence_patterns where approval_status = 'pending'),
      'more_data', (select count(*) from public.intelligence_patterns where approval_status = 'more_data'),
      'approved', (select count(*) from public.intelligence_patterns where approval_status = 'approved')
    )
  );
end;
$$;

grant execute on function public.get_intelligence_learning_queue() to authenticated;

create or replace function public.get_global_patterns()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (select jsonb_agg(row_to_json(gp.*) order by gp.detection_count desc)
     from public.global_patterns gp
     where gp.active = true),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.get_global_patterns() to authenticated;

create or replace function public.get_self_healing_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_total integer;
  v_success integer;
  v_failed integer;
  v_escalated integer;
  v_avg_ms numeric;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select
    count(*),
    count(*) filter (where execution_result = 'success'),
    count(*) filter (where execution_result = 'failed'),
    count(*) filter (where execution_result = 'pending_approval'),
    coalesce(avg(execution_time_ms) filter (where execution_result = 'success'), 0)
  into v_total, v_success, v_failed, v_escalated, v_avg_ms
  from public.ai_self_healing_executions
  where executed_at >= now() - interval '30 days';

  return jsonb_build_object(
    'totals', jsonb_build_object(
      'attempts', v_total,
      'successful', v_success,
      'failed', v_failed,
      'escalated', v_escalated,
      'avg_resolution_ms', round(v_avg_ms)::integer
    ),
    'strategies', coalesce(
      (select jsonb_agg(row_to_json(hs.*) order by hs.success_count desc)
       from public.healing_strategies hs
       where hs.active = true),
      '[]'::jsonb
    ),
    'recent_runs', coalesce(
      (select jsonb_agg(row_to_json(sh.*) order by sh.executed_at desc)
       from public.ai_self_healing_executions sh
       limit 30),
      '[]'::jsonb
    ),
    'top_pattern', (
      select healing_action
      from public.ai_self_healing_executions
      where executed_at >= now() - interval '30 days'
      group by healing_action
      order by count(*) desc
      limit 1
    ),
    'most_common_incident', (
      select event_category
      from public.ai_learning_events
      where created_at >= now() - interval '30 days'
        and event_type = 'detection'
      group by event_category
      order by count(*) desc
      limit 1
    )
  );
end;
$$;

grant execute on function public.get_self_healing_dashboard() to authenticated;

create or replace function public.get_intelligence_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (select jsonb_agg(
      jsonb_build_object(
        'id', gp.id,
        'message', gp.pattern_title,
        'suggested_action', gp.suggested_action,
        'confidence', gp.confidence_score,
        'category', gp.category,
        'source_environment', gp.source_environment
      )
      order by gp.confidence_score desc
    )
    from public.global_patterns gp
    where gp.active = true
    limit 8),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.get_intelligence_recommendations() to authenticated;

create or replace function public.review_intelligence_pattern(
  p_pattern_id uuid,
  p_action text,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reviewer text;
  v_pattern public.intelligence_patterns%rowtype;
  v_global_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select email into v_reviewer from auth.users where id = auth.uid();

  select * into v_pattern
  from public.intelligence_patterns
  where id = p_pattern_id;

  if v_pattern.id is null then
    raise exception 'Pattern not found';
  end if;

  insert into public.intelligence_reviews (pattern_id, reviewer_email, action, notes)
  values (p_pattern_id, coalesce(v_reviewer, 'platform-admin'), p_action, p_notes);

  if p_action = 'approve' then
    update public.intelligence_patterns
    set approval_status = 'approved', updated_at = now()
    where id = p_pattern_id;

    insert into public.global_patterns (
      intelligence_pattern_id, pattern_title, category, suggested_action,
      confidence_score, detection_count, source_environment, approved_by
    )
    values (
      p_pattern_id,
      v_pattern.pattern_title,
      v_pattern.category,
      v_pattern.suggested_action,
      v_pattern.confidence_score,
      v_pattern.detection_count,
      case when v_pattern.environment_type = 'global' then 'internal' else v_pattern.environment_type end,
      coalesce(v_reviewer, 'platform-admin')
    )
    on conflict (pattern_title) do update set
      detection_count = excluded.detection_count,
      confidence_score = excluded.confidence_score,
      suggested_action = excluded.suggested_action,
      approved_at = now()
    returning id into v_global_id;

    update public.ai_patterns
    set approved_for_global_use = true, updated_at = now()
    where pattern_name = v_pattern.pattern_title;

  elsif p_action = 'reject' then
    update public.intelligence_patterns
    set approval_status = 'archived', updated_at = now()
    where id = p_pattern_id;

  elsif p_action = 'request_more_data' then
    update public.intelligence_patterns
    set approval_status = 'more_data', updated_at = now()
    where id = p_pattern_id;
  end if;

  return jsonb_build_object(
    'pattern_id', p_pattern_id,
    'action', p_action,
    'global_pattern_id', v_global_id
  );
end;
$$;

grant execute on function public.review_intelligence_pattern(uuid, text, text) to authenticated;

create or replace function public.get_intelligence_audit_log()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (
      select jsonb_agg(entry order by entry->>'created_at' desc)
      from (
        select jsonb_build_object(
          'id', ir.id,
          'type', 'review',
          'action', ir.action,
          'pattern_title', ip.pattern_title,
          'reviewer_email', ir.reviewer_email,
          'notes', ir.notes,
          'created_at', ir.created_at
        ) as entry
        from public.intelligence_reviews ir
        join public.intelligence_patterns ip on ip.id = ir.pattern_id
        union all
        select jsonb_build_object(
          'id', le.id,
          'type', 'learning_event',
          'action', le.event_type,
          'pattern_title', le.event_category,
          'reviewer_email', null,
          'notes', le.metadata::text,
          'created_at', le.created_at
        )
        from public.ai_learning_events le
      ) combined
      limit 50
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.get_intelligence_audit_log() to authenticated;

-- Extend list_platform_automations with category
create or replace function public.list_platform_automations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'automation_key', a.automation_key,
          'name', a.name,
          'description', a.description,
          'status', a.status,
          'trigger_type', a.trigger_type,
          'schedule_cron', a.schedule_cron,
          'last_run_at', a.last_run_at,
          'next_run_at', a.next_run_at,
          'last_success_at', a.last_success_at,
          'total_executions', a.total_executions,
          'failure_count', a.failure_count,
          'avg_execution_ms', a.avg_execution_ms,
          'category_key', coalesce(a.category_key, 'admin_approved')
        )
        order by a.name asc
      )
      from public.platform_automations a
    ),
    '[]'::jsonb
  );
end;
$$;

-- Bridge ai_patterns detections into intelligence queue
create or replace function public.trg_sync_intelligence_pattern()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.upsert_intelligence_pattern(
    new.pattern_name,
    case
      when new.category in ('support', 'technical', 'onboarding', 'billing', 'automation', 'integration', 'health', 'system')
        then new.category
      else 'system'
    end,
    coalesce(new.source_environment, 'internal'),
    new.recommended_action,
    least(100, 50 + new.detection_count * 3),
    case when new.detection_count >= 20 then 'high' when new.detection_count >= 10 then 'medium' else 'low' end,
    null,
    new.id
  );
  return new;
end;
$$;

drop trigger if exists sync_intelligence_pattern on public.ai_patterns;
create trigger sync_intelligence_pattern
  after insert or update on public.ai_patterns
  for each row execute function public.trg_sync_intelligence_pattern();

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------
insert into public.healing_strategies (strategy_key, title, description, risk_level, auto_execute, category)
values
  ('retry_webhook', 'Retry webhook', 'Automatically retry failed webhook deliveries.', 'low', true, 'webhook'),
  ('retry_email', 'Retry email delivery', 'Retry failed outbound email deliveries.', 'low', true, 'email'),
  ('reconnect_api', 'Reconnect API', 'Attempt to reconnect a disconnected API integration.', 'low', true, 'integration'),
  ('clear_cache', 'Clear cache', 'Clear stale cache entries causing stale reads.', 'low', true, 'system'),
  ('rebuild_indexes', 'Rebuild indexes', 'Rebuild search indexes after data inconsistencies.', 'low', true, 'system'),
  ('pause_automation', 'Pause automation', 'Pause a failing automation until reviewed.', 'medium', false, 'automation'),
  ('disable_integration', 'Disable failing integration', 'Disable an integration that repeatedly fails.', 'medium', false, 'integration'),
  ('regenerate_credentials', 'Regenerate credentials', 'Rotate API credentials for a failing connection.', 'medium', false, 'integration'),
  ('escalate_security', 'Escalate security action', 'Escalate high-risk security incidents immediately.', 'high', false, 'security')
on conflict (strategy_key) do nothing;

update public.platform_automations
set category_key = case automation_key
  when 'trial_expiration_reminder' then 'ai_generated'
  when 'support_auto_reply' then 'ai_generated'
  when 'installation_health_scan' then 'ai_generated'
  when 'billing_reminder' then 'ai_generated'
  when 'restart_failed_webhook' then 'self_healing'
  when 'retry_failed_email' then 'self_healing'
  when 'reconnect_shopify' then 'self_healing'
  when 'restore_queue_workers' then 'self_healing'
  else 'admin_approved'
end
where category_key is null or category_key = 'admin_approved';

insert into public.intelligence_patterns (
  pattern_title, category, environment_type, detection_count,
  confidence_score, potential_impact, suggested_action, approval_status,
  first_detected, last_detected
)
values
  (
    'Support tickets peak near trial expiration',
    'support', 'pilot', 18, 89, 'high',
    'Enable trial reminder automation.', 'pending',
    now() - interval '45 days', now() - interval '2 days'
  ),
  (
    'Webhook failures increase after integration updates',
    'technical', 'global', 31, 95, 'high',
    'Run automated health scan after updates.', 'approved',
    now() - interval '60 days', now() - interval '1 day'
  ),
  (
    'Customers completing onboarding require less support',
    'onboarding', 'pilot', 24, 87, 'medium',
    'Prioritize onboarding completion for trial customers.', 'pending',
    now() - interval '30 days', now() - interval '3 days'
  ),
  (
    'Billing confusion trends before subscription renewal',
    'billing', 'customer', 14, 76, 'medium',
    'Send proactive billing explanation before renewal.', 'pending',
    now() - interval '20 days', now() - interval '5 days'
  )
on conflict (pattern_title, environment_type) do nothing;

insert into public.global_patterns (
  pattern_title, category, suggested_action, confidence_score,
  detection_count, source_environment, approved_by
)
select
  ip.pattern_title, ip.category, ip.suggested_action, ip.confidence_score,
  ip.detection_count,
  case when ip.environment_type = 'global' then 'internal' else ip.environment_type end,
  'system-seed'
from public.intelligence_patterns ip
where ip.approval_status = 'approved'
on conflict (pattern_title) do nothing;

-- Seed self-healing automations if missing
insert into public.platform_automations (
  automation_key, name, description, status, trigger_type, schedule_cron,
  last_run_at, next_run_at, last_success_at, total_executions, failure_count, avg_execution_ms,
  category_key
)
values
  (
    'restart_failed_webhook', 'Restart Failed Webhook', 'Retries webhook deliveries after transient failures.',
    'active', 'event', null, now() - interval '2 hours', now() + interval '1 hour',
    now() - interval '2 hours', 412, 8, 180, 'self_healing'
  ),
  (
    'retry_failed_email', 'Retry Failed Email', 'Retries failed outbound email deliveries.',
    'active', 'event', null, now() - interval '1 hour', now() + interval '2 hours',
    now() - interval '1 hour', 289, 4, 240, 'self_healing'
  ),
  (
    'reconnect_shopify', 'Reconnect Shopify', 'Attempts to reconnect Shopify integrations after disconnect.',
    'active', 'event', null, now() - interval '4 hours', now() + interval '30 minutes',
    now() - interval '4 hours', 156, 12, 890, 'self_healing'
  ),
  (
    'restore_queue_workers', 'Restore Queue Workers', 'Restarts background queue workers after failures.',
    'active', 'schedule', '0 */6 * * *',
    now() - interval '6 hours', now() + interval '6 hours',
    now() - interval '6 hours', 98, 1, 1200, 'self_healing'
  )
on conflict (automation_key) do update set category_key = excluded.category_key;

insert into public.brain_metrics (
  knowledge_patterns_approved,
  patterns_awaiting_review,
  learning_events_30d,
  self_healing_success_rate,
  global_recommendations_generated,
  learning_confidence,
  approved_automations_from_learning,
  automation_coverage
)
select
  (select count(*) from public.global_patterns where active = true),
  (select count(*) from public.intelligence_patterns where approval_status = 'pending'),
  (select count(*) from public.ai_learning_events where created_at >= now() - interval '30 days'),
  coalesce(
    round(
      (select count(*) filter (where execution_result = 'success')::numeric
       from public.ai_self_healing_executions
       where executed_at >= now() - interval '30 days')
      / nullif((select count(*) from public.ai_self_healing_executions where executed_at >= now() - interval '30 days'), 0)
      * 100
    )::integer,
    0
  ),
  (select count(*) from public.ai_recommendations where created_at >= now() - interval '30 days'),
  coalesce((select round(avg(confidence_score))::integer from public.intelligence_patterns where approval_status in ('pending', 'approved')), 0),
  (select count(*) from public.platform_automations where category_key = 'ai_generated'),
  case
    when (select count(*) from public.platform_automations) = 0 then 0
    else round(
      (select count(*) from public.platform_automations where status = 'active')::numeric
      / (select count(*) from public.platform_automations) * 100
    )::integer
  end;
