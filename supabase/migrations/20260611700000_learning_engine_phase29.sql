-- Phase 29 — Learning Engine (controlled, transparent, customer-approved learning)

-- ---------------------------------------------------------------------------
-- 1. Tenant learning settings
-- ---------------------------------------------------------------------------
create table if not exists public.customer_learning_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  learning_mode text not null default 'assisted' check (
    learning_mode in ('disabled', 'assisted', 'adaptive')
  ),
  adaptive_consent_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.customer_learning_settings enable row level security;
revoke all on public.customer_learning_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Learning memory (metadata only — no customer content)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_learning_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pattern_type text not null,
  source_type text not null check (
    source_type in (
      'approved_recommendation',
      'approved_automation',
      'approved_response',
      'skill_health_outcome',
      'recommendation_acceptance',
      'user_preference',
      'notification_engagement',
      'support_resolution'
    )
  ),
  approval_source text,
  confidence_level text not null default 'medium' check (
    confidence_level in ('low', 'medium', 'high')
  ),
  confidence_score integer not null default 50 check (confidence_score between 0 and 100),
  skill_key text,
  explanation text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'removed')),
  learned_at timestamptz not null default now(),
  reviewed_at timestamptz,
  removed_at timestamptz
);

create index if not exists customer_learning_memory_tenant_idx
  on public.customer_learning_memory (tenant_id, learned_at desc);

alter table public.customer_learning_memory enable row level security;
revoke all on public.customer_learning_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Learning review audit
-- ---------------------------------------------------------------------------
create table if not exists public.customer_learning_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_id uuid references public.customer_learning_memory (id) on delete set null,
  review_action text not null check (
    review_action in ('approved', 'removed', 'mode_changed', 'disabled')
  ),
  actor_user_id uuid references public.users (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists customer_learning_reviews_tenant_idx
  on public.customer_learning_reviews (tenant_id, created_at desc);

alter table public.customer_learning_reviews enable row level security;
revoke all on public.customer_learning_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Platform learning governance
-- ---------------------------------------------------------------------------
create table if not exists public.platform_learning_policies (
  id uuid primary key default gen_random_uuid(),
  policy_key text not null unique,
  environment_type text not null check (
    environment_type in ('internal', 'pilot', 'customer', 'enterprise')
  ),
  learning_mode_default text not null default 'assisted' check (
    learning_mode_default in ('disabled', 'assisted', 'adaptive')
  ),
  adaptive_allowed boolean not null default false,
  rollout_stage text not null default 'internal' check (
    rollout_stage in ('internal', 'pilot', 'beta', 'ga')
  ),
  safeguards jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.platform_learning_policies enable row level security;
revoke all on public.platform_learning_policies from authenticated, anon;

insert into public.platform_learning_policies (
  policy_key, environment_type, learning_mode_default, adaptive_allowed, rollout_stage, safeguards
)
values
  ('internal_default', 'internal', 'assisted', true, 'internal',
    '{"human_approval_required": true, "content_storage": false}'::jsonb),
  ('pilot_unonight', 'pilot', 'assisted', false, 'pilot',
    '{"human_approval_required": true, "pilot_tenant": "unonight"}'::jsonb),
  ('customer_default', 'customer', 'assisted', false, 'beta',
    '{"human_approval_required": true, "adaptive_requires_consent": true}'::jsonb),
  ('enterprise_default', 'enterprise', 'disabled', false, 'ga',
    '{"human_approval_required": true, "enterprise_opt_in": true}'::jsonb)
on conflict (policy_key) do nothing;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._learning_confidence_level(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 75 then 'high'
    when p_score >= 45 then 'medium'
    else 'low'
  end;
$$;

create or replace function public._ensure_customer_learning_settings(p_tenant_id uuid)
returns public.customer_learning_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.customer_learning_settings;
  v_env text;
  v_default_mode text := 'assisted';
begin
  select c.environment_type into v_env
  from public.customers c where c.id = p_tenant_id;

  select p.learning_mode_default into v_default_mode
  from public.platform_learning_policies p
  where p.environment_type = coalesce(v_env, 'customer')
  limit 1;

  insert into public.customer_learning_settings (tenant_id, learning_mode)
  values (p_tenant_id, coalesce(v_default_mode, 'assisted'))
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.customer_learning_settings
  where tenant_id = p_tenant_id;

  return v_row;
end;
$$;

create or replace function public.record_customer_learning_memory(
  p_tenant_id uuid,
  p_pattern_type text,
  p_source_type text,
  p_approval_source text default null,
  p_confidence_score integer default 50,
  p_skill_key text default null,
  p_explanation text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.customer_learning_settings;
  v_level text;
  v_id uuid;
  v_explanation text;
begin
  v_settings := public._ensure_customer_learning_settings(p_tenant_id);

  if v_settings.learning_mode = 'disabled' then
    return null;
  end if;

  if v_settings.learning_mode = 'adaptive'
    and v_settings.adaptive_consent_at is null then
    return null;
  end if;

  v_level := public._learning_confidence_level(p_confidence_score);
  v_explanation := coalesce(
    nullif(trim(p_explanation), ''),
    'Aipify recorded an approved pattern to improve future suggestions.'
  );

  insert into public.customer_learning_memory (
    tenant_id, pattern_type, source_type, approval_source,
    confidence_level, confidence_score, skill_key, explanation, metadata
  )
  values (
    p_tenant_id, p_pattern_type, p_source_type, p_approval_source,
    v_level, p_confidence_score, p_skill_key, v_explanation,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_customer_learning_memory(
  uuid, text, text, text, integer, text, text, jsonb
) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Customer Learning Review Center bundle
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_learning_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_learning_settings;
  v_env text;
  v_policy public.platform_learning_policies;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public._ensure_customer_learning_settings(v_tenant_id);

  select c.environment_type into v_env
  from public.customers c where c.id = v_tenant_id;

  select * into v_policy
  from public.platform_learning_policies p
  where p.environment_type = coalesce(v_env, 'customer')
  limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Aipify learns WITH the customer — not FROM the customer. You remain in control.',
    'learning_mode', v_settings.learning_mode,
    'adaptive_consent', v_settings.adaptive_consent_at is not null,
    'adaptive_allowed', coalesce(v_policy.adaptive_allowed, false),
    'recent_learnings', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'pattern_type', m.pattern_type,
        'source_type', m.source_type,
        'approval_source', m.approval_source,
        'confidence_level', m.confidence_level,
        'confidence_score', m.confidence_score,
        'skill_key', m.skill_key,
        'explanation', m.explanation,
        'status', m.status,
        'learned_at', m.learned_at,
        'reviewed_at', m.reviewed_at
      ) order by m.learned_at desc)
      from public.customer_learning_memory m
      where m.tenant_id = v_tenant_id and m.status = 'active'
      limit 25),
      '[]'::jsonb
    ),
    'suggested_improvements', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ar.id,
        'title', ar.title,
        'description', ar.recommendation,
        'confidence_level', public._learning_confidence_level(ar.confidence_score),
        'confidence_score', ar.confidence_score
      ) order by ar.confidence_score desc)
      from public.ai_recommendations ar
      where ar.tenant_id = v_tenant_id and ar.status = 'active'
      limit 8),
      '[]'::jsonb
    ),
    'approval_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id,
        'action_type', coalesce(e.action_type, e.event_type),
        'created_at', e.created_at
      ) order by e.created_at desc)
      from public.presence_engagement_events e
      where e.tenant_id = v_tenant_id
        and e.event_type in ('recommendation_action', 'quick_action', 'notification_action')
      limit 15),
      '[]'::jsonb
    ),
    'governance', jsonb_build_object(
      'rollout_stage', coalesce(v_policy.rollout_stage, 'beta'),
      'environment_type', coalesce(v_env, 'customer')
    )
  );
end;
$$;

grant execute on function public.get_customer_learning_center() to authenticated;

create or replace function public.update_customer_learning_settings(
  p_learning_mode text,
  p_adaptive_consent boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_env text;
  v_policy public.platform_learning_policies;
  v_row public.customer_learning_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  if p_learning_mode not in ('disabled', 'assisted', 'adaptive') then
    raise exception 'Invalid learning mode';
  end if;

  select c.environment_type into v_env
  from public.customers c where c.id = v_tenant_id;

  select * into v_policy
  from public.platform_learning_policies p
  where p.environment_type = coalesce(v_env, 'customer')
  limit 1;

  if p_learning_mode = 'adaptive' then
    if not coalesce(v_policy.adaptive_allowed, false) and v_env <> 'internal' then
      raise exception 'Adaptive learning requires explicit consent and plan eligibility';
    end if;
    if not p_adaptive_consent then
      raise exception 'Adaptive learning requires explicit customer consent';
    end if;
  end if;

  insert into public.customer_learning_settings (tenant_id, learning_mode, adaptive_consent_at)
  values (
    v_tenant_id,
    p_learning_mode,
    case when p_learning_mode = 'adaptive' and p_adaptive_consent then now() else null end
  )
  on conflict (tenant_id) do update set
    learning_mode = excluded.learning_mode,
    adaptive_consent_at = case
      when excluded.learning_mode = 'adaptive' and p_adaptive_consent then now()
      when excluded.learning_mode <> 'adaptive' then null
      else customer_learning_settings.adaptive_consent_at
    end,
    updated_at = now()
  returning * into v_row;

  insert into public.customer_learning_reviews (
    tenant_id, review_action, note
  )
  values (
    v_tenant_id,
    'mode_changed',
    'Learning mode set to ' || p_learning_mode
  );

  return jsonb_build_object(
    'learning_mode', v_row.learning_mode,
    'adaptive_consent', v_row.adaptive_consent_at is not null
  );
end;
$$;

grant execute on function public.update_customer_learning_settings(text, boolean) to authenticated;

create or replace function public.remove_customer_learning_memory(p_memory_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  update public.customer_learning_memory
  set status = 'removed', removed_at = now(), reviewed_at = now()
  where id = p_memory_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Learning memory not found';
  end if;

  insert into public.customer_learning_reviews (
    tenant_id, memory_id, review_action, note
  )
  values (v_tenant_id, p_memory_id, 'removed', 'Customer removed learning memory');

  return jsonb_build_object('removed', true, 'memory_id', p_memory_id);
end;
$$;

grant execute on function public.remove_customer_learning_memory(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Wire recommendation approvals into learning memory
-- ---------------------------------------------------------------------------
create or replace function public.perform_customer_recommendation_action(
  p_recommendation_id uuid,
  p_source text,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_title text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  if p_action not in ('approve', 'dismiss') then
    raise exception 'Invalid action';
  end if;

  if p_source = 'customer' then
    select cr.recommendation_key into v_title
    from public.customer_recommendations cr
    where cr.id = p_recommendation_id and cr.customer_id = v_tenant_id;

    if p_action = 'dismiss' then
      update public.customer_recommendations
      set dismissed_at = now()
      where id = p_recommendation_id and customer_id = v_tenant_id;
    elsif p_action = 'approve' then
      perform public.record_customer_learning_memory(
        v_tenant_id,
        'recommendation_acceptance',
        'approved_recommendation',
        v_title,
        72,
        null,
        'Aipify learned from an approved recommendation and will suggest similar improvements.',
        jsonb_build_object('recommendation_id', p_recommendation_id, 'source', p_source)
      );
    end if;
  elsif p_source = 'ai' then
    select ar.title into v_title
    from public.ai_recommendations ar
    where ar.id = p_recommendation_id and ar.tenant_id = v_tenant_id;

    update public.ai_recommendations
    set status = case when p_action = 'approve' then 'executed' else 'dismissed' end,
        dismissed_at = case when p_action = 'dismiss' then now() else dismissed_at end
    where id = p_recommendation_id and tenant_id = v_tenant_id;

    if p_action = 'approve' then
      perform public.record_customer_learning_memory(
        v_tenant_id,
        'recommendation_acceptance',
        'approved_recommendation',
        v_title,
        80,
        null,
        'Aipify learned from an approved recommendation and will suggest similar improvements.',
        jsonb_build_object('recommendation_id', p_recommendation_id, 'source', p_source)
      );
    end if;
  else
    raise exception 'Invalid source';
  end if;

  perform public.record_presence_engagement(
    'recommendation_action', p_action, null, 'web',
    jsonb_build_object('recommendation_id', p_recommendation_id, 'source', p_source)
  );

  return jsonb_build_object('ok', true, 'action', p_action);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Platform governance bundle
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_learning_governance()
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
    'policies', coalesce(
      (select jsonb_agg(row_to_json(p.*) order by p.environment_type)
       from public.platform_learning_policies p),
      '[]'::jsonb
    ),
    'overview', public.get_platform_learning_overview(),
    'rollout', jsonb_build_array(
      jsonb_build_object('stage', 'internal', 'label', 'Aipify Internal'),
      jsonb_build_object('stage', 'pilot', 'label', 'Unonight Pilot'),
      jsonb_build_object('stage', 'beta', 'label', 'Beta Customers'),
      jsonb_build_object('stage', 'ga', 'label', 'General Availability')
    ),
    'safeguards', jsonb_build_object(
      'human_approval_required', true,
      'forbidden_content_storage', true,
      'tenant_isolation', true
    )
  );
end;
$$;

grant execute on function public.get_platform_learning_governance() to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Seed pilot learning memory for Unonight
-- ---------------------------------------------------------------------------
insert into public.customer_learning_memory (
  tenant_id, pattern_type, source_type, approval_source,
  confidence_level, confidence_score, skill_key, explanation, metadata
)
select
  c.id,
  'notification_frequency',
  'notification_engagement',
  'presence_engagement',
  'medium',
  62,
  'presence',
  'Aipify reduced notification frequency because similar alerts were frequently dismissed.',
  '{"dismiss_rate": 34}'::jsonb
from public.customers c
where c.slug = 'unonight'
  and not exists (
    select 1 from public.customer_learning_memory m
    where m.tenant_id = c.id and m.pattern_type = 'notification_frequency'
  );

insert into public.customer_learning_memory (
  tenant_id, pattern_type, source_type, approval_source,
  confidence_level, confidence_score, explanation
)
select
  c.id,
  'executive_summary_timing',
  'user_preference',
  'approved_recommendation',
  'high',
  84,
  'Aipify noticed that you approve executive summaries before 09:00 and adjusted delivery timing.'
from public.customers c
where c.slug = 'unonight'
  and not exists (
    select 1 from public.customer_learning_memory m
    where m.tenant_id = c.id and m.pattern_type = 'executive_summary_timing'
  );
