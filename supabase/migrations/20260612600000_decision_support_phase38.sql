-- Phase 38 — Decision Support Engine (DSE)
-- Business-first guidance with explainability. Aipify advises — humans decide.

-- ---------------------------------------------------------------------------
-- 1. dse_settings
-- ---------------------------------------------------------------------------
create table if not exists public.dse_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  recommendations_enabled boolean not null default true,
  proactivity_level text not null default 'balanced' check (
    proactivity_level in ('minimal', 'balanced', 'proactive')
  ),
  business_domains_enabled jsonb not null default '{
    "support": true,
    "administrative": true,
    "executive": true,
    "operational": true
  }'::jsonb,
  personal_decisions_enabled boolean not null default true,
  use_historical_data boolean not null default true,
  presentation_style text not null default 'balanced' check (
    presentation_style in ('concise', 'balanced', 'detailed')
  ),
  privacy_settings jsonb not null default '{
    "share_business_insights": false,
    "store_decision_history": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.dse_settings enable row level security;
revoke all on public.dse_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. decision_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.decision_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  decision_type text not null check (
    decision_type in ('operational', 'strategic', 'personal')
  ),
  domain text not null check (
    domain in ('support', 'administrative', 'executive', 'operational', 'personal')
  ),
  title text not null,
  recommendation text not null,
  reasoning jsonb not null default '[]'::jsonb,
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  risk_indicators jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  trade_offs jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'accepted_guidance', 'dismissed', 'deferred')
  ),
  source text not null default 'analysis' check (
    source in ('analysis', 'assistant', 'system')
  ),
  linked_resource_type text,
  linked_resource_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decision_recommendations_user_idx
  on public.decision_recommendations (tenant_id, user_id, status);

alter table public.decision_recommendations enable row level security;
revoke all on public.decision_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. decision_history — user responses (transparency)
-- ---------------------------------------------------------------------------
create table if not exists public.decision_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  recommendation_id uuid references public.decision_recommendations (id) on delete set null,
  title text not null,
  user_response text not null check (
    user_response in ('accepted_guidance', 'dismissed', 'deferred', 'decided_independently')
  ),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.decision_history enable row level security;
revoke all on public.decision_history from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public.ensure_dse_settings(
  p_tenant_id uuid,
  p_user_id uuid
)
returns public.dse_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.dse_settings;
begin
  insert into public.dse_settings (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;

  select * into v_row from public.dse_settings
  where tenant_id = p_tenant_id and user_id = p_user_id;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. update_dse_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_dse_settings(
  p_recommendations_enabled boolean default null,
  p_proactivity_level text default null,
  p_business_domains_enabled jsonb default null,
  p_personal_decisions_enabled boolean default null,
  p_use_historical_data boolean default null,
  p_presentation_style text default null,
  p_privacy_settings jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  perform public.ensure_dse_settings(v_tenant_id, v_user_id);

  update public.dse_settings
  set
    recommendations_enabled = coalesce(p_recommendations_enabled, recommendations_enabled),
    proactivity_level = coalesce(p_proactivity_level, proactivity_level),
    business_domains_enabled = coalesce(p_business_domains_enabled, business_domains_enabled),
    personal_decisions_enabled = coalesce(p_personal_decisions_enabled, personal_decisions_enabled),
    use_historical_data = coalesce(p_use_historical_data, use_historical_data),
    presentation_style = coalesce(p_presentation_style, presentation_style),
    privacy_settings = coalesce(p_privacy_settings, privacy_settings),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. respond_to_decision
-- ---------------------------------------------------------------------------
create or replace function public.respond_to_decision(
  p_recommendation_id uuid,
  p_response text,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_rec public.decision_recommendations;
  v_status text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_rec
  from public.decision_recommendations
  where id = p_recommendation_id and tenant_id = v_tenant_id and user_id = v_user_id;

  if v_rec.id is null then raise exception 'Recommendation not found'; end if;

  v_status := case p_response
    when 'accept' then 'accepted_guidance'
    when 'defer' then 'deferred'
    else 'dismissed'
  end;

  update public.decision_recommendations
  set status = v_status, updated_at = now()
  where id = p_recommendation_id;

  insert into public.decision_history (
    tenant_id, user_id, recommendation_id, title, user_response, notes
  )
  values (
    v_tenant_id, v_user_id, p_recommendation_id, v_rec.title,
    case p_response when 'accept' then 'accepted_guidance' when 'defer' then 'deferred' else 'dismissed' end,
    coalesce(p_notes, '')
  );

  return jsonb_build_object('status', v_status);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. analyze_decisions — generate recommendations from context
-- ---------------------------------------------------------------------------
create or replace function public.analyze_decisions()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.dse_settings;
  v_pending_actions integer;
  v_high_risk integer;
  v_tasks integer;
  v_stale_goals integer;
  v_meetings_today integer;
  v_inserted integer := 0;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_settings := public.ensure_dse_settings(v_tenant_id, v_user_id);

  if not v_settings.recommendations_enabled then
    return jsonb_build_object('has_customer', true, 'analyzed', false, 'message', 'Recommendations disabled');
  end if;

  select count(*) into v_pending_actions
  from public.action_requests where tenant_id = v_tenant_id and status = 'pending';

  select count(*) into v_high_risk
  from public.action_requests where tenant_id = v_tenant_id and status = 'pending' and risk_level >= 3;

  select count(*) into v_tasks
  from public.personal_memories m
  where m.tenant_id = v_tenant_id and m.status = 'active' and m.category = 'tasks';

  select count(*) into v_stale_goals
  from public.user_goals g
  where g.tenant_id = v_tenant_id and g.user_id = v_user_id and g.status = 'active'
    and coalesce(g.last_worked_at, g.created_at) < now() - interval '14 days';

  select count(*) into v_meetings_today
  from public.calendar_events e
  where e.tenant_id = v_tenant_id and e.user_id = v_user_id
    and e.status = 'scheduled' and e.starts_at::date = current_date;

  -- Support prioritization (business-first)
  if (v_settings.business_domains_enabled ->> 'support')::boolean and v_pending_actions > 0 then
    if not exists (
      select 1 from public.decision_recommendations
      where tenant_id = v_tenant_id and user_id = v_user_id
        and domain = 'support' and status = 'pending'
        and title like 'Prioritize pending approvals%'
    ) then
      insert into public.decision_recommendations (
        tenant_id, user_id, decision_type, domain, title, recommendation,
        reasoning, confidence, risk_indicators, evidence
      )
      values (
        v_tenant_id, v_user_id, 'operational', 'support',
        format('Prioritize pending approvals (%s items)', v_pending_actions),
        format('Review %s pending action request(s) — %s high-risk item(s) may need immediate attention.',
          v_pending_actions, v_high_risk),
        jsonb_build_array(
          'Pending approvals affect customer response times',
          'High-risk items historically require human intervention',
          'Business support remains Aipify''s core mission'
        ),
        case when v_high_risk > 0 then 'high' when v_pending_actions >= 5 then 'moderate' else 'low' end,
        case when v_high_risk > 0 then jsonb_build_array('Escalation risk if delayed') else '[]'::jsonb end,
        jsonb_build_array(jsonb_build_object('type', 'action_requests', 'count', v_pending_actions))
      );
      v_inserted := v_inserted + 1;
    end if;
  end if;

  -- Executive / workload
  if (v_settings.business_domains_enabled ->> 'executive')::boolean
    and v_tasks + v_meetings_today >= 8 then
    if not exists (
      select 1 from public.decision_recommendations
      where tenant_id = v_tenant_id and user_id = v_user_id
        and domain = 'executive' and status = 'pending'
        and created_at > now() - interval '3 days'
    ) then
      insert into public.decision_recommendations (
        tenant_id, user_id, decision_type, domain, title, recommendation,
        reasoning, confidence, risk_indicators, trade_offs
      )
      values (
        v_tenant_id, v_user_id, 'strategic', 'executive',
        'Workload exceeds normal capacity',
        'Consider postponing lower-priority activities and protecting focus time for strategic work.',
        jsonb_build_array(
          'Current task and meeting load is elevated',
          'Initiatives align best when capacity is protected',
          'You retain final authority on what to postpone'
        ),
        'moderate',
        jsonb_build_array('Potential overload', 'Delayed follow-up risk'),
        jsonb_build_array('Postpone admin tasks vs. maintain responsiveness')
      );
      v_inserted := v_inserted + 1;
    end if;
  end if;

  -- Personal goal alignment
  if v_settings.personal_decisions_enabled and v_stale_goals > 0 then
    if not exists (
      select 1 from public.decision_recommendations
      where tenant_id = v_tenant_id and user_id = v_user_id
        and domain = 'personal' and status = 'pending'
        and title like 'Realign with goals%'
    ) then
      insert into public.decision_recommendations (
        tenant_id, user_id, decision_type, domain, title, recommendation,
        reasoning, confidence
      )
      values (
        v_tenant_id, v_user_id, 'personal', 'personal',
        format('Realign with goals (%s need attention)', v_stale_goals),
        'Which goal deserves your next focused block of time?',
        jsonb_build_array(
          'Stated goals have not received recent attention',
          'Aligning time with values reduces decision fatigue',
          'Personal support complements — never replaces — business focus'
        ),
        'moderate'
      );
      v_inserted := v_inserted + 1;
    end if;
  end if;

  -- Meeting acceptance guidance
  if v_settings.personal_decisions_enabled and v_meetings_today >= 4 then
    if not exists (
      select 1 from public.decision_recommendations
      where tenant_id = v_tenant_id and user_id = v_user_id
        and status = 'pending' and title like 'Evaluate meeting load%'
        and created_at > now() - interval '1 day'
    ) then
      insert into public.decision_recommendations (
        tenant_id, user_id, decision_type, domain, title, recommendation,
        reasoning, confidence, trade_offs
      )
      values (
        v_tenant_id, v_user_id, 'personal', 'operational',
        format('Evaluate meeting load (%s today)', v_meetings_today),
        'Before accepting new meetings, consider which protect priorities vs. add fragmentation.',
        jsonb_build_array(
          'Meeting density affects deep work capacity',
          'Calendar intelligence from Context Engine',
          'You decide — Aipify only clarifies trade-offs'
        ),
        'moderate',
        jsonb_build_array('Accept for relationship value vs. protect focus time')
      );
      v_inserted := v_inserted + 1;
    end if;
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'analyzed', true,
    'recommendations_added', v_inserted,
    'context', jsonb_build_object(
      'pending_actions', v_pending_actions,
      'high_risk_actions', v_high_risk,
      'active_tasks', v_tasks,
      'stale_goals', v_stale_goals,
      'meetings_today', v_meetings_today
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. get_customer_decisions_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_decisions_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.dse_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public.ensure_dse_settings(v_tenant_id, v_user_id);
  perform public.analyze_decisions();

  return jsonb_build_object(
    'has_customer', true,
    'settings', jsonb_build_object(
      'recommendations_enabled', v_settings.recommendations_enabled,
      'proactivity_level', v_settings.proactivity_level,
      'business_domains_enabled', v_settings.business_domains_enabled,
      'personal_decisions_enabled', v_settings.personal_decisions_enabled,
      'use_historical_data', v_settings.use_historical_data,
      'presentation_style', v_settings.presentation_style,
      'privacy_settings', v_settings.privacy_settings
    ),
    'pending_decisions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'decision_type', r.decision_type, 'domain', r.domain,
        'title', r.title, 'recommendation', r.recommendation,
        'reasoning', r.reasoning, 'confidence', r.confidence,
        'risk_indicators', r.risk_indicators, 'evidence', r.evidence,
        'trade_offs', r.trade_offs, 'created_at', r.created_at
      ) order by
        case r.confidence when 'high' then 0 when 'moderate' then 1 else 2 end,
        r.created_at desc)
      from public.decision_recommendations r
      where r.tenant_id = v_tenant_id and r.user_id = v_user_id
        and r.status = 'pending'),
      '[]'::jsonb
    ),
    'business_insights', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'domain', r.domain, 'title', r.title,
        'recommendation', r.recommendation, 'confidence', r.confidence
      ) order by r.created_at desc)
      from public.decision_recommendations r
      where r.tenant_id = v_tenant_id and r.user_id = v_user_id
        and r.status = 'pending'
        and r.domain in ('support', 'administrative', 'executive', 'operational')
      limit 8),
      '[]'::jsonb
    ),
    'priority_opportunities', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ar.id, 'title', ar.action_name, 'risk_level', ar.risk_level,
        'description', ar.description, 'confidence', case
          when ar.risk_level >= 3 then 'high'
          when ar.risk_level >= 2 then 'moderate'
          else 'low'
        end
      ) order by ar.risk_level desc)
      from public.action_requests ar
      where ar.tenant_id = v_tenant_id and ar.status = 'pending'
      limit 5),
      '[]'::jsonb
    ),
    'risk_indicators', coalesce(
      (select jsonb_agg(distinct elem)
      from public.decision_recommendations r,
        jsonb_array_elements_text(r.risk_indicators) elem
      where r.tenant_id = v_tenant_id and r.user_id = v_user_id
        and r.status = 'pending' and jsonb_array_length(r.risk_indicators) > 0),
      '[]'::jsonb
    ),
    'decision_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', h.id, 'title', h.title, 'user_response', h.user_response,
        'notes', h.notes, 'created_at', h.created_at
      ) order by h.created_at desc)
      from public.decision_history h
      where h.tenant_id = v_tenant_id and h.user_id = v_user_id
        and (v_settings.privacy_settings ->> 'store_decision_history')::boolean is not false
      limit 15),
      '[]'::jsonb
    ),
    'framework', jsonb_build_array(
      'Identify available options',
      'Gather relevant context',
      'Evaluate consequences',
      'Align with goals and values',
      'Review recommendations',
      'You make the final decision'
    ),
    'privacy_note', 'Recommendations are guidance only. You always retain final authority. Business data stays protected.',
    'ethical_principles', jsonb_build_array(
      'Aipify never makes decisions for you',
      'No manipulation or pressure',
      'Explainability on every recommendation',
      'Business-first — personal support is optional'
    ),
    'integrations', jsonb_build_object(
      'trust_actions', 'Support prioritization and escalation',
      'goals_dreams', 'Goal alignment context',
      'attention_guardian', 'Workload and focus trade-offs',
      'context_engine', 'Calendar and scheduling decisions',
      'learning_engine', 'May improve strategies — you retain control'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Platform overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_decisions_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access decision content. Aggregates only.',
    'dse_profiles', (select count(*) from public.dse_settings),
    'pending_recommendations', (select count(*) from public.decision_recommendations where status = 'pending'),
    'accepted_guidance', (select count(*) from public.decision_history where user_response = 'accepted_guidance'),
    'by_domain', coalesce(
      (select jsonb_object_agg(domain, cnt)
      from (select domain, count(*)::integer as cnt from public.decision_recommendations group by domain) sub),
      '{}'::jsonb
    ),
    'by_confidence', coalesce(
      (select jsonb_object_agg(confidence, cnt)
      from (select confidence, count(*)::integer as cnt from public.decision_recommendations group by confidence) sub),
      '{}'::jsonb
    )
  );
end;
$$;

grant execute on function public.ensure_dse_settings(uuid, uuid) to authenticated;
grant execute on function public.update_dse_settings(boolean, text, jsonb, boolean, boolean, text, jsonb) to authenticated;
grant execute on function public.respond_to_decision(uuid, text, text) to authenticated;
grant execute on function public.analyze_decisions() to authenticated;
grant execute on function public.get_customer_decisions_center() to authenticated;
grant execute on function public.get_platform_decisions_overview() to authenticated;
