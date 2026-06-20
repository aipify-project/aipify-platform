-- Phase 29 — Learning Engine (controlled customer learning)

-- ---------------------------------------------------------------------------
-- 1. Customer learning settings
-- ---------------------------------------------------------------------------
create table if not exists public.customer_learning_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  learning_mode text not null default 'assisted' check (
    learning_mode in ('disabled', 'assisted', 'adaptive')
  ),
  adaptive_consent_at timestamptz,
  disabled_at timestamptz,
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
  confidence_score integer not null default 50 check (confidence_score between 0 and 100),
  confidence_level text not null default 'medium' check (
    confidence_level in ('low', 'medium', 'high')
  ),
  skill_key text,
  explanation text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'removed', 'disabled')),
  learned_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists customer_learning_memory_tenant_idx
  on public.customer_learning_memory (tenant_id, learned_at desc);

alter table public.customer_learning_memory enable row level security;
revoke all on public.customer_learning_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Review / audit history
-- ---------------------------------------------------------------------------
create table if not exists public.customer_learning_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_id uuid references public.customer_learning_memory (id) on delete set null,
  action_type text not null check (
    action_type in (
      'recorded', 'removed', 'mode_changed', 'adaptive_consent', 'adaptive_revoked', 'disabled'
    )
  ),
  actor_user_id uuid references public.users (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists customer_learning_reviews_tenant_idx
  on public.customer_learning_reviews (tenant_id, created_at desc);

alter table public.customer_learning_reviews enable row level security;
revoke all on public.customer_learning_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._confidence_level_from_score(p_score integer)
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

create or replace function public.ensure_customer_learning_settings(p_tenant_id uuid)
returns public.customer_learning_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.customer_learning_settings;
begin
  insert into public.customer_learning_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.customer_learning_settings
  where tenant_id = p_tenant_id;

  return v_row;
end;
$$;

grant execute on function public.ensure_customer_learning_settings(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Record learning memory
-- ---------------------------------------------------------------------------
create or replace function public.record_customer_learning_memory(
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
  v_tenant_id uuid;
  v_settings public.customer_learning_settings;
  v_id uuid;
  v_level text;
  v_similar integer;
  v_explanation text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_settings := public.ensure_customer_learning_settings(v_tenant_id);

  if v_settings.learning_mode = 'disabled' or v_settings.disabled_at is not null then
    return null;
  end if;

  if p_source_type in (
    'user_preference', 'notification_engagement'
  ) and v_settings.learning_mode <> 'adaptive' then
    return null;
  end if;

  v_level := public._confidence_level_from_score(coalesce(p_confidence_score, 50));

  select count(*)::integer into v_similar
  from public.customer_learning_memory m
  where m.tenant_id = v_tenant_id
    and m.pattern_type = p_pattern_type
    and m.status = 'active';

  v_similar := v_similar + 1;

  v_explanation := coalesce(
    p_explanation,
    case
      when v_similar >= 20 and v_level = 'high'
        then format('Based on %s similar approvals, Aipify is highly confident.', v_similar)
      when v_similar >= 8
        then format('Based on %s similar outcomes, Aipify has moderate confidence.', v_similar)
      else 'Aipify recorded an approved pattern to improve future suggestions.'
    end
  );

  insert into public.customer_learning_memory (
    tenant_id, pattern_type, source_type, approval_source,
    confidence_score, confidence_level, skill_key, explanation, metadata
  )
  values (
    v_tenant_id, p_pattern_type, p_source_type, p_approval_source,
    coalesce(p_confidence_score, 50), v_level, p_skill_key, v_explanation,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  insert into public.customer_learning_reviews (
    tenant_id, memory_id, action_type, actor_user_id, notes
  )
  select v_tenant_id, v_id, 'recorded', u.id, p_pattern_type
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  perform public.record_ai_learning_event(
    v_tenant_id,
    (select c.environment_type from public.customers c where c.id = v_tenant_id),
    'recommendation',
    'system',
    jsonb_build_object(
      'pattern_type', p_pattern_type,
      'source_type', p_source_type,
      'confidence_level', v_level
    ),
    'approved'
  );

  return v_id;
end;
$$;

grant execute on function public.record_customer_learning_memory(
  text, text, text, integer, text, text, jsonb
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
  v_plan text;
  v_env text;
  v_limits jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select * into v_settings from public.customer_learning_settings where tenant_id = v_tenant_id;
  if not found then
    v_settings.tenant_id := v_tenant_id;
    v_settings.learning_mode := 'assisted';
  end if;
  v_limits := public.get_customer_license_limits(v_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');

  select c.environment_type into v_env
  from public.customers c
  where c.id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Aipify learns WITH the customer — not FROM the customer. You remain in control.',
    'learning_mode', v_settings.learning_mode,
    'adaptive_consent', v_settings.adaptive_consent_at is not null,
    'adaptive_allowed', v_plan in ('business', 'enterprise') and v_env in ('pilot', 'enterprise', 'customer'),
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
        'confidence_level', public._confidence_level_from_score(ar.confidence_score),
        'confidence_score', ar.confidence_score
      ) order by ar.confidence_score desc)
      from public.ai_recommendations ar
      where ar.tenant_id = v_tenant_id and ar.status = 'active'
      limit 5),
      '[]'::jsonb
    ),
    'approval_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'action_type', r.action_type,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.customer_learning_reviews r
      where r.tenant_id = v_tenant_id
      limit 20),
      '[]'::jsonb
    ),
    'governance', jsonb_build_object(
      'rollout_stage', case v_env
        when 'internal' then 'Aipify Internal'
        when 'pilot' then 'Unonight Pilot'
        else 'General Availability'
      end,
      'environment_type', v_env
    )
  );
end;
$$;

grant execute on function public.get_customer_learning_center() to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Update learning settings
-- ---------------------------------------------------------------------------
create or replace function public.update_customer_learning_settings(
  p_learning_mode text default null,
  p_adaptive_consent boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_learning_settings;
  v_plan text;
  v_env text;
  v_limits jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_settings := public.ensure_customer_learning_settings(v_tenant_id);
  v_limits := public.get_customer_license_limits(v_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');

  select c.environment_type into v_env
  from public.customers c
  where c.id = v_tenant_id;

  if p_learning_mode is not null then
    if p_learning_mode not in ('disabled', 'assisted', 'adaptive') then
      raise exception 'Invalid learning mode';
    end if;

    if p_learning_mode = 'adaptive' then
      if v_plan not in ('business', 'enterprise') then
        raise exception 'Adaptive learning requires Business plan or higher';
      end if;
      if coalesce(p_adaptive_consent, false) = false and v_settings.adaptive_consent_at is null then
        raise exception 'Adaptive learning requires explicit consent';
      end if;
    end if;

    update public.customer_learning_settings
    set
      learning_mode = p_learning_mode,
      disabled_at = case when p_learning_mode = 'disabled' then now() else null end,
      adaptive_consent_at = case
        when p_learning_mode = 'adaptive' and coalesce(p_adaptive_consent, v_settings.adaptive_consent_at is not null)
          then coalesce(v_settings.adaptive_consent_at, now())
        when p_learning_mode <> 'adaptive' then null
        else adaptive_consent_at
      end,
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_settings;

    insert into public.customer_learning_reviews (tenant_id, action_type, actor_user_id, notes)
    select v_tenant_id,
      case when p_learning_mode = 'disabled' then 'disabled' else 'mode_changed' end,
      u.id,
      p_learning_mode
    from public.users u where u.auth_user_id = auth.uid() limit 1;
  elsif p_adaptive_consent is not null then
    update public.customer_learning_settings
    set
      adaptive_consent_at = case when p_adaptive_consent then now() else null end,
      learning_mode = case
        when p_adaptive_consent and learning_mode = 'assisted' then 'adaptive'
        when not p_adaptive_consent and learning_mode = 'adaptive' then 'assisted'
        else learning_mode
      end,
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_settings;

    insert into public.customer_learning_reviews (tenant_id, action_type, actor_user_id)
    select v_tenant_id,
      case when p_adaptive_consent then 'adaptive_consent' else 'adaptive_revoked' end,
      u.id
    from public.users u where u.auth_user_id = auth.uid() limit 1;
  end if;

  return jsonb_build_object(
    'learning_mode', v_settings.learning_mode,
    'adaptive_consent', v_settings.adaptive_consent_at is not null
  );
end;
$$;

grant execute on function public.update_customer_learning_settings(text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Remove learning memory entry
-- ---------------------------------------------------------------------------
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
  set status = 'removed', reviewed_at = now()
  where id = p_memory_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Learning memory not found';
  end if;

  insert into public.customer_learning_reviews (tenant_id, memory_id, action_type, actor_user_id)
  select v_tenant_id, p_memory_id, 'removed', u.id
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  return jsonb_build_object('removed', true);
end;
$$;

grant execute on function public.remove_customer_learning_memory(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Learn from recommendation actions
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
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  if p_action not in ('approve', 'dismiss') then
    raise exception 'Invalid action';
  end if;

  if p_source = 'customer' then
    if p_action = 'dismiss' then
      update public.customer_recommendations
      set dismissed_at = now()
      where id = p_recommendation_id and customer_id = v_tenant_id;
    end if;
  elsif p_source = 'ai' then
    update public.ai_recommendations
    set status = case when p_action = 'approve' then 'executed' else 'dismissed' end,
        dismissed_at = case when p_action = 'dismiss' then now() else dismissed_at end
    where id = p_recommendation_id and tenant_id = v_tenant_id;
  else
    raise exception 'Invalid source';
  end if;

  if p_action = 'approve' then
    perform public.record_customer_learning_memory(
      'recommendation_acceptance',
      'approved_recommendation',
      p_source,
      72,
      null,
      'Aipify learned from an approved recommendation and will suggest similar improvements.',
      jsonb_build_object('recommendation_id', p_recommendation_id)
    );
  end if;

  perform public.record_presence_engagement(
    'recommendation_action', p_action, null, 'web',
    jsonb_build_object('recommendation_id', p_recommendation_id, 'source', p_source)
  );

  return jsonb_build_object('ok', true, 'action', p_action);
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Platform learning governance overview
-- ---------------------------------------------------------------------------
create or replace function public.get_learning_governance_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_pilot_id uuid;
  v_pilot_memories integer;
  v_customer_memories integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select c.id into v_pilot_id from public.customers c where c.slug = 'unonight' limit 1;

  select count(*) into v_pilot_memories
  from public.customer_learning_memory m
  where m.tenant_id = v_pilot_id and m.status = 'active';

  select count(*) into v_customer_memories
  from public.customer_learning_memory m
  where m.status = 'active';

  return jsonb_build_object(
    'rollout_pipeline', jsonb_build_array(
      jsonb_build_object('stage', 'Aipify Internal', 'status', 'complete'),
      jsonb_build_object('stage', 'Unonight', 'status', case when v_pilot_id is not null then 'active' else 'pending' end),
      jsonb_build_object('stage', 'Beta Customers', 'status', 'planned'),
      jsonb_build_object('stage', 'General Availability', 'status', 'planned')
    ),
    'safeguards', jsonb_build_array(
      'No raw customer content in learning memory',
      'Assisted mode is default',
      'Adaptive requires explicit consent',
      'Customers can remove learnings at any time'
    ),
    'pilot', jsonb_build_object(
      'tenant_slug', 'unonight',
      'active_memories', coalesce(v_pilot_memories, 0)
    ),
    'totals', jsonb_build_object(
      'active_memories', coalesce(v_customer_memories, 0),
      'disabled_tenants', (
        select count(*) from public.customer_learning_settings where learning_mode = 'disabled'
      ),
      'adaptive_tenants', (
        select count(*) from public.customer_learning_settings
        where learning_mode = 'adaptive' and adaptive_consent_at is not null
      )
    )
  );
end;
$$;

grant execute on function public.get_learning_governance_overview() to authenticated;

-- ---------------------------------------------------------------------------
-- 11. Seed Unonight pilot learnings
-- ---------------------------------------------------------------------------
insert into public.customer_learning_settings (tenant_id, learning_mode)
select c.id, 'assisted'
from public.customers c
where c.slug = 'unonight'
on conflict (tenant_id) do nothing;

insert into public.customer_learning_memory (
  tenant_id, pattern_type, source_type, approval_source,
  confidence_score, confidence_level, skill_key, explanation, metadata
)
select c.id, v.pattern_type, v.source_type, 'unonight_pilot',
  v.confidence_score, public._confidence_level_from_score(v.confidence_score),
  v.skill_key, v.explanation, '{}'::jsonb
from public.customers c
cross join (
  values
    (
      'executive_summary_timing',
      'user_preference',
      82,
      'support_ai',
      'Aipify noticed that you approve executive summaries before 09:00 and adjusted delivery timing.'
    ),
    (
      'notification_frequency',
      'notification_engagement',
      76,
      null,
      'Aipify reduced notification frequency because similar alerts were frequently dismissed.'
    ),
    (
      'recommendation_acceptance',
      'approved_recommendation',
      68,
      'operations',
      'Aipify learned from approved recommendations to prioritise operational efficiency suggestions.'
    )
) as v(pattern_type, source_type, confidence_score, skill_key, explanation)
where c.slug = 'unonight'
  and not exists (
    select 1 from public.customer_learning_memory m
    where m.tenant_id = c.id and m.pattern_type = v.pattern_type
  );
