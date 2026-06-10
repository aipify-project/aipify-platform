-- Self-Learning Architecture & Dual Intelligence Model (foundation phase)
-- Privacy-safe pattern learning only — no customer content storage

-- ---------------------------------------------------------------------------
-- Environment awareness
-- ---------------------------------------------------------------------------
alter table public.customers
  add column if not exists environment_type text not null default 'customer' check (
    environment_type in ('internal', 'pilot', 'customer', 'enterprise')
  );

alter table public.installations
  add column if not exists environment_type text not null default 'customer' check (
    environment_type in ('internal', 'pilot', 'customer', 'enterprise')
  );

create or replace function public.derive_environment_type(p_company_id uuid)
returns text
language sql
stable
set search_path = public
as $$
  select case
    when exists (
      select 1 from public.companies c
      where c.id = p_company_id and c.is_platform = true
    ) then 'internal'
    when exists (
      select 1 from public.companies c
      where c.id = p_company_id and c.slug = 'unonight'
    ) then 'pilot'
    else 'customer'
  end;
$$;

update public.customers c
set environment_type = public.derive_environment_type(c.company_id)
where c.environment_type = 'customer';

update public.installations i
set environment_type = public.derive_environment_type(i.company_id)
where i.environment_type = 'customer';

-- ---------------------------------------------------------------------------
-- 1. ai_learning_events
-- ---------------------------------------------------------------------------
create table if not exists public.ai_learning_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  environment_type text not null check (
    environment_type in ('internal', 'pilot', 'customer', 'enterprise')
  ),
  event_type text not null check (
    event_type in ('detection', 'diagnosis', 'recommendation', 'healing')
  ),
  event_category text not null check (
    event_category in (
      'automation',
      'webhook',
      'support',
      'integration',
      'onboarding',
      'health',
      'billing',
      'system'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  resolution_type text check (
    resolution_type in ('auto', 'manual', 'dismissed', 'pending', 'approved')
  ),
  created_at timestamptz not null default now()
);

create index if not exists ai_learning_events_tenant_id_idx
  on public.ai_learning_events (tenant_id);
create index if not exists ai_learning_events_environment_idx
  on public.ai_learning_events (environment_type, created_at desc);
create index if not exists ai_learning_events_category_idx
  on public.ai_learning_events (event_category, event_type);

-- ---------------------------------------------------------------------------
-- 2. ai_patterns
-- ---------------------------------------------------------------------------
create table if not exists public.ai_patterns (
  id uuid primary key default gen_random_uuid(),
  pattern_name text not null unique,
  category text not null,
  detection_count integer not null default 0 check (detection_count >= 0),
  success_rate integer not null default 0 check (success_rate between 0 and 100),
  recommended_action text not null,
  approved_for_global_use boolean not null default false,
  source_environment text check (
    source_environment in ('internal', 'pilot', 'customer', 'enterprise')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_patterns_category_idx on public.ai_patterns (category);
create index if not exists ai_patterns_approved_idx
  on public.ai_patterns (approved_for_global_use) where approved_for_global_use = true;

-- ---------------------------------------------------------------------------
-- 3. ai_recommendation_effectiveness
-- ---------------------------------------------------------------------------
create table if not exists public.ai_recommendation_effectiveness (
  id uuid primary key default gen_random_uuid(),
  recommendation_type text not null unique,
  times_presented integer not null default 0 check (times_presented >= 0),
  times_accepted integer not null default 0 check (times_accepted >= 0),
  times_dismissed integer not null default 0 check (times_dismissed >= 0),
  successful_outcomes integer not null default 0 check (successful_outcomes >= 0),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. ai_self_healing_executions
-- ---------------------------------------------------------------------------
create table if not exists public.ai_self_healing_executions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  healing_action text not null,
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  execution_result text not null default 'pending_approval' check (
    execution_result in ('success', 'failed', 'skipped', 'pending_approval')
  ),
  execution_time_ms integer,
  requires_approval boolean not null default false,
  approved_by text,
  metadata jsonb not null default '{}'::jsonb,
  executed_at timestamptz not null default now()
);

create index if not exists ai_self_healing_tenant_id_idx
  on public.ai_self_healing_executions (tenant_id);
create index if not exists ai_self_healing_executed_at_idx
  on public.ai_self_healing_executions (tenant_id, executed_at desc);

-- RLS: platform RPC access only
alter table public.ai_learning_events enable row level security;
alter table public.ai_patterns enable row level security;
alter table public.ai_recommendation_effectiveness enable row level security;
alter table public.ai_self_healing_executions enable row level security;

revoke all on public.ai_learning_events from authenticated, anon;
revoke all on public.ai_patterns from authenticated, anon;
revoke all on public.ai_recommendation_effectiveness from authenticated, anon;
revoke all on public.ai_self_healing_executions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Core recording functions
-- ---------------------------------------------------------------------------
create or replace function public.record_ai_learning_event(
  p_tenant_id uuid,
  p_environment_type text,
  p_event_type text,
  p_event_category text,
  p_metadata jsonb default '{}'::jsonb,
  p_resolution_type text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_env text;
begin
  v_env := coalesce(
    p_environment_type,
    (select c.environment_type from public.customers c where c.id = p_tenant_id),
    'customer'
  );

  insert into public.ai_learning_events (
    tenant_id, environment_type, event_type, event_category, metadata, resolution_type
  )
  values (p_tenant_id, v_env, p_event_type, p_event_category, p_metadata, p_resolution_type)
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_ai_learning_event(uuid, text, text, text, jsonb, text)
  to authenticated;

create or replace function public.upsert_ai_pattern(
  p_pattern_name text,
  p_category text,
  p_recommended_action text,
  p_source_environment text default 'internal',
  p_increment_detection boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.ai_patterns (
    pattern_name, category, detection_count, recommended_action, source_environment, updated_at
  )
  values (
    p_pattern_name,
    p_category,
    case when p_increment_detection then 1 else 0 end,
    p_recommended_action,
    p_source_environment,
    now()
  )
  on conflict (pattern_name) do update set
    detection_count = public.ai_patterns.detection_count + case when p_increment_detection then 1 else 0 end,
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.upsert_ai_pattern(text, text, text, text, boolean)
  to authenticated;

create or replace function public.track_recommendation_effectiveness(
  p_recommendation_type text,
  p_outcome text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ai_recommendation_effectiveness (recommendation_type, updated_at)
  values (p_recommendation_type, now())
  on conflict (recommendation_type) do nothing;

  update public.ai_recommendation_effectiveness
  set
    times_presented = times_presented + case when p_outcome = 'presented' then 1 else 0 end,
    times_accepted = times_accepted + case when p_outcome = 'accepted' then 1 else 0 end,
    times_dismissed = times_dismissed + case when p_outcome = 'dismissed' then 1 else 0 end,
    successful_outcomes = successful_outcomes + case when p_outcome = 'successful' then 1 else 0 end,
    updated_at = now()
  where recommendation_type = p_recommendation_type;
end;
$$;

grant execute on function public.track_recommendation_effectiveness(text, text)
  to authenticated;

create or replace function public.record_self_healing_execution(
  p_tenant_id uuid,
  p_healing_action text,
  p_risk_level text default 'low',
  p_execution_result text default 'pending_approval',
  p_execution_time_ms integer default null,
  p_requires_approval boolean default false,
  p_approved_by text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_result text;
begin
  v_result := p_execution_result;
  if p_risk_level in ('high', 'critical') then
    v_result := 'pending_approval';
  elsif p_risk_level = 'medium' and p_requires_approval then
    v_result := 'pending_approval';
  elsif p_risk_level = 'low' and not p_requires_approval then
    v_result := coalesce(nullif(p_execution_result, 'pending_approval'), 'success');
  end if;

  insert into public.ai_self_healing_executions (
    tenant_id, healing_action, risk_level, execution_result,
    execution_time_ms, requires_approval, approved_by, metadata
  )
  values (
    p_tenant_id, p_healing_action, p_risk_level, v_result,
    p_execution_time_ms, p_requires_approval, p_approved_by, p_metadata
  )
  returning id into v_id;

  perform public.record_ai_learning_event(
    p_tenant_id,
    (select environment_type from public.customers where id = p_tenant_id),
    'healing',
    'system',
    jsonb_build_object('healing_action', p_healing_action, 'risk_level', p_risk_level, 'result', v_result),
    case when v_result = 'pending_approval' then 'pending' else 'auto' end
  );

  perform public.record_customer_timeline_event(
    p_tenant_id,
    'system',
    'Self-healing action recorded',
    p_healing_action,
    jsonb_build_object('risk_level', p_risk_level, 'result', v_result),
    now()
  );

  return v_id;
end;
$$;

grant execute on function public.record_self_healing_execution(
  uuid, text, text, text, integer, boolean, text, jsonb
) to authenticated;

-- ---------------------------------------------------------------------------
-- Bundle RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_self_learning(p_tenant_id uuid)
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
    'environment_type', (
      select c.environment_type from public.customers c where c.id = p_tenant_id
    ),
    'learning_events', coalesce(
      (select jsonb_agg(row_to_json(le.*) order by le.created_at desc)
       from public.ai_learning_events le
       where le.tenant_id = p_tenant_id
       limit 50),
      '[]'::jsonb
    ),
    'self_healing_executions', coalesce(
      (select jsonb_agg(row_to_json(sh.*) order by sh.executed_at desc)
       from public.ai_self_healing_executions sh
       where sh.tenant_id = p_tenant_id
       limit 30),
      '[]'::jsonb
    ),
    'patterns', coalesce(
      (select jsonb_agg(row_to_json(p.*) order by p.detection_count desc)
       from public.ai_patterns p
       where p.approved_for_global_use = true),
      '[]'::jsonb
    ),
    'recommendation_effectiveness', coalesce(
      (select jsonb_agg(row_to_json(re.*) order by re.times_presented desc)
       from public.ai_recommendation_effectiveness re),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_self_learning(uuid) to authenticated;

create or replace function public.get_platform_learning_overview()
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
      (select jsonb_agg(row_to_json(p.*) order by p.detection_count desc)
       from public.ai_patterns p),
      '[]'::jsonb
    ),
    'recommendation_effectiveness', coalesce(
      (select jsonb_agg(row_to_json(re.*) order by re.times_presented desc)
       from public.ai_recommendation_effectiveness re),
      '[]'::jsonb
    ),
    'learning_by_environment', coalesce(
      (select jsonb_object_agg(env_stats.environment_type, env_stats.event_count)
       from (
         select le.environment_type, count(*)::integer as event_count
         from public.ai_learning_events le
         where le.created_at >= now() - interval '30 days'
         group by le.environment_type
       ) env_stats),
      '{}'::jsonb
    ),
    'recent_healing_executions', coalesce(
      (select jsonb_agg(row_to_json(sh.*) order by sh.executed_at desc)
       from public.ai_self_healing_executions sh
       limit 20),
      '[]'::jsonb
    ),
    'totals', jsonb_build_object(
      'patterns', (select count(*) from public.ai_patterns),
      'approved_patterns', (select count(*) from public.ai_patterns where approved_for_global_use),
      'learning_events_30d', (
        select count(*) from public.ai_learning_events
        where created_at >= now() - interval '30 days'
      ),
      'healing_executions_30d', (
        select count(*) from public.ai_self_healing_executions
        where executed_at >= now() - interval '30 days'
      )
    )
  );
end;
$$;

grant execute on function public.get_platform_learning_overview() to authenticated;

-- Extend intelligence bundle with self-learning slice
create or replace function public.get_customer_intelligence_foundation(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_bundle jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  perform public.refresh_customer_intelligence_scores(p_tenant_id);

  v_bundle := jsonb_build_object(
    'timeline', coalesce(
      (select jsonb_agg(row_to_json(ct.*) order by ct.event_date desc)
       from public.customer_timeline ct
       where ct.tenant_id = p_tenant_id
       limit 100),
      '[]'::jsonb
    ),
    'ai_recommendations', coalesce(
      (select jsonb_agg(row_to_json(ar.*) order by ar.created_at desc)
       from public.ai_recommendations ar
       where ar.tenant_id = p_tenant_id and ar.status = 'active'),
      '[]'::jsonb
    ),
    'success_score', (
      select row_to_json(css.*)
      from public.customer_success_scores css
      where css.tenant_id = p_tenant_id
    ),
    'installation_health', (
      select row_to_json(ih.*)
      from public.installation_health ih
      where ih.tenant_id = p_tenant_id
    ),
    'automation_runs', coalesce(
      (select jsonb_agg(row_to_json(ar.*) order by ar.executed_at desc)
       from public.automation_runs ar
       where ar.tenant_id = p_tenant_id
       limit 50),
      '[]'::jsonb
    ),
    'opportunity_signals', coalesce(
      (select jsonb_agg(row_to_json(os.*) order by os.detected_at desc)
       from public.opportunity_signals os
       where os.tenant_id = p_tenant_id and os.status = 'active'),
      '[]'::jsonb
    )
  );

  return v_bundle || jsonb_build_object(
    'self_learning', public.get_customer_self_learning(p_tenant_id)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Automatic learning triggers
-- ---------------------------------------------------------------------------
create or replace function public.trg_learning_automation_run()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_env text;
begin
  if new.status in ('failed', 'warning') then
    select c.environment_type into v_env
    from public.customers c where c.id = new.tenant_id;

    perform public.record_ai_learning_event(
      new.tenant_id,
      v_env,
      'detection',
      'automation',
      jsonb_build_object(
        'automation_name', new.automation_name,
        'status', new.status,
        'pattern_hint', 'automation_failure'
      ),
      'pending'
    );

    perform public.upsert_ai_pattern(
      'Automation failures after configuration changes',
      'automation',
      'Review automation settings and retry failed jobs',
      v_env,
      true
    );
  end if;
  return new;
end;
$$;

drop trigger if exists learning_automation_run on public.automation_runs;
create trigger learning_automation_run
  after insert on public.automation_runs
  for each row execute function public.trg_learning_automation_run();

create or replace function public.trg_learning_recommendation_outcome()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.track_recommendation_effectiveness(new.title, 'presented');
  elsif old.status is distinct from new.status then
    if new.status = 'dismissed' then
      perform public.track_recommendation_effectiveness(new.title, 'dismissed');
    elsif new.status = 'executed' then
      perform public.track_recommendation_effectiveness(new.title, 'accepted');
      perform public.track_recommendation_effectiveness(new.title, 'successful');
      perform public.record_ai_learning_event(
        new.tenant_id,
        (select environment_type from public.customers where id = new.tenant_id),
        'recommendation',
        'system',
        jsonb_build_object('recommendation_type', new.title, 'outcome', 'executed'),
        'approved'
      );
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists learning_recommendation_outcome on public.ai_recommendations;
create trigger learning_recommendation_outcome
  after insert or update on public.ai_recommendations
  for each row execute function public.trg_learning_recommendation_outcome();

create or replace function public.trg_learning_integration_error()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_env text;
begin
  if new.status = 'error' and (tg_op = 'INSERT' or old.status is distinct from 'error') then
    select c.id, c.environment_type
    into v_tenant_id, v_env
    from public.customers c
    join public.installations i on i.company_id = c.company_id
    where i.id = new.installation_id
    limit 1;

    if v_tenant_id is not null then
      perform public.record_ai_learning_event(
        v_tenant_id,
        v_env,
        'detection',
        'integration',
        jsonb_build_object(
          'integration_key', new.integration_key,
          'pattern_hint', 'integration_disconnect'
        ),
        'pending'
      );

      perform public.upsert_ai_pattern(
        'Webhook failures increase after integration updates',
        'integration',
        'Reconnect integration and run health scan',
        v_env,
        true
      );
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists learning_integration_error on public.installation_integrations;
create trigger learning_integration_error
  after insert or update on public.installation_integrations
  for each row execute function public.trg_learning_integration_error();

-- Keep dismiss tracking in sync
create or replace function public.dismiss_ai_recommendation(p_recommendation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  update public.ai_recommendations
  set status = 'dismissed', dismissed_at = now()
  where id = p_recommendation_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Seed approved global patterns & pilot learning data
-- ---------------------------------------------------------------------------
insert into public.ai_patterns (pattern_name, category, detection_count, success_rate, recommended_action, approved_for_global_use, source_environment)
values
  ('Webhook failures increase after integration updates', 'integration', 12, 78, 'Reconnect integration and verify webhook endpoint', true, 'internal'),
  ('Customers who complete onboarding require less support', 'onboarding', 24, 85, 'Prioritize onboarding completion for trial customers', true, 'pilot'),
  ('Support tickets about billing peak near trial expiration', 'billing', 18, 72, 'Proactive billing outreach before trial ends', true, 'pilot'),
  ('Health scans identify recurring installation problems', 'health', 31, 81, 'Run installation health scan and review diagnostics', true, 'internal')
on conflict (pattern_name) do nothing;

insert into public.ai_recommendation_effectiveness (recommendation_type, times_presented, times_accepted, times_dismissed, successful_outcomes)
values
  ('Trial ending soon', 45, 12, 8, 10),
  ('Customer inactivity detected', 32, 6, 14, 5),
  ('Integration incomplete', 28, 9, 5, 7),
  ('Reconnect Stripe integration', 15, 4, 2, 3)
on conflict (recommendation_type) do nothing;

do $$
declare
  v_tenant_id uuid;
  v_env text;
begin
  select id, environment_type into v_tenant_id, v_env
  from public.customers where customer_number = 'AIP-000001' limit 1;

  if v_tenant_id is null then return; end if;

  perform public.record_ai_learning_event(
    v_tenant_id, v_env, 'detection', 'health',
    '{"signal":"inactive_trial","days_inactive":21}'::jsonb, 'pending'
  );
  perform public.record_ai_learning_event(
    v_tenant_id, v_env, 'diagnosis', 'integration',
    '{"issue":"stripe_pending","severity":"medium"}'::jsonb, 'manual'
  );
  perform public.record_ai_learning_event(
    v_tenant_id, v_env, 'recommendation', 'onboarding',
    '{"action":"schedule_onboarding_call"}'::jsonb, 'approved'
  );

  perform public.record_self_healing_execution(
    v_tenant_id, 'Retry webhook deliveries', 'low', 'success', 340, false, null,
    '{"retries":3}'::jsonb
  );
  perform public.record_self_healing_execution(
    v_tenant_id, 'Re-run installation health scan', 'low', 'success', 1200, false, null,
    '{"scan_type":"full"}'::jsonb
  );
  perform public.record_self_healing_execution(
    v_tenant_id, 'Pause subscription billing', 'high', 'pending_approval', null, true, null,
    '{"reason":"payment_failure"}'::jsonb
  );
end;
$$;
