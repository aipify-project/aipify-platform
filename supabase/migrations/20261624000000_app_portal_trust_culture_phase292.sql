-- Phase 292 (APP) — Organizational Trust & Culture Center

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.app_portal_culture_check_ins (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  frequency text not null default 'on_demand' check (frequency in (
    'weekly', 'monthly', 'quarterly', 'on_demand'
  )),
  status text not null default 'active' check (status in ('scheduled', 'active', 'closed')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  questions jsonb not null default '[]'::jsonb,
  voluntary_note text not null default 'Participation is voluntary and responses remain anonymous.',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_culture_check_ins_company_idx
  on public.app_portal_culture_check_ins (company_id, status, created_at desc);

create table if not exists public.app_portal_culture_responses (
  id uuid primary key default gen_random_uuid(),
  check_in_id uuid not null references public.app_portal_culture_check_ins (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  dimension text not null check (dimension in (
    'trust', 'collaboration', 'communication', 'recognition', 'accountability',
    'inclusion', 'psychological_safety', 'leadership_confidence',
    'organizational_alignment', 'learning_mindset'
  )),
  question_id text not null,
  question_type text not null check (question_type in (
    'rating_scale', 'multiple_choice', 'free_text', 'agreement_scale'
  )),
  rating_value integer check (rating_value is null or rating_value between 1 and 5),
  choice_value text,
  text_reflection text not null default '',
  department text not null default '',
  participant_hash text not null,
  created_at timestamptz not null default now(),
  unique (check_in_id, question_id, participant_hash)
);

create index if not exists app_portal_culture_responses_company_idx
  on public.app_portal_culture_responses (company_id, dimension, created_at desc);

create index if not exists app_portal_culture_responses_check_in_idx
  on public.app_portal_culture_responses (check_in_id, dimension);

create table if not exists public.app_portal_culture_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_culture_audit_idx
  on public.app_portal_culture_audit_logs (company_id, created_at desc);

alter table public.app_portal_culture_check_ins enable row level security;
alter table public.app_portal_culture_responses enable row level security;
alter table public.app_portal_culture_audit_logs enable row level security;
revoke all on public.app_portal_culture_check_ins from authenticated, anon;
revoke all on public.app_portal_culture_responses from authenticated, anon;
revoke all on public.app_portal_culture_audit_logs from authenticated, anon;

create or replace function public._aotc292_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_view_insights', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aotc292_anonymity_threshold()
returns integer
language sql
immutable
as $$ select 5; $$;

create or replace function public._aotc292_default_questions()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('id', 'trust-1', 'dimension', 'trust', 'type', 'rating_scale', 'text', 'I trust my colleagues to act with integrity.'),
    jsonb_build_object('id', 'collaboration-1', 'dimension', 'collaboration', 'type', 'rating_scale', 'text', 'Teams collaborate effectively across the organization.'),
    jsonb_build_object('id', 'communication-1', 'dimension', 'communication', 'type', 'rating_scale', 'text', 'Communication is open and transparent.'),
    jsonb_build_object('id', 'recognition-1', 'dimension', 'recognition', 'type', 'rating_scale', 'text', 'Contributions are recognized appropriately.'),
    jsonb_build_object('id', 'accountability-1', 'dimension', 'accountability', 'type', 'rating_scale', 'text', 'People follow through on commitments.'),
    jsonb_build_object('id', 'inclusion-1', 'dimension', 'inclusion', 'type', 'rating_scale', 'text', 'Everyone feels included and respected.'),
    jsonb_build_object('id', 'psychological_safety-1', 'dimension', 'psychological_safety', 'type', 'agreement_scale', 'text', 'I feel safe sharing ideas without fear of negative consequences.'),
    jsonb_build_object('id', 'leadership_confidence-1', 'dimension', 'leadership_confidence', 'type', 'rating_scale', 'text', 'Leadership inspires confidence in the direction of the organization.'),
    jsonb_build_object('id', 'organizational_alignment-1', 'dimension', 'organizational_alignment', 'type', 'rating_scale', 'text', 'Teams understand how their work connects to organizational goals.'),
    jsonb_build_object('id', 'learning_mindset-1', 'dimension', 'learning_mindset', 'type', 'rating_scale', 'text', 'The organization encourages learning from experience.'),
    jsonb_build_object('id', 'reflection-1', 'dimension', 'trust', 'type', 'free_text', 'text', 'What would most improve trust and culture in your organization?')
  );
$$;

create or replace function public._aotc292_trend_direction(p_current numeric, p_prior numeric, p_count integer)
returns text
language plpgsql
immutable
as $$
begin
  if p_count < public._aotc292_anonymity_threshold() then return 'insufficient_data'; end if;
  if p_prior is null or p_prior = 0 then return 'stable'; end if;
  if p_current - p_prior >= 0.3 then return 'improving'; end if;
  if p_prior - p_current >= 0.3 then return 'declining'; end if;
  return 'stable';
end;
$$;

create or replace function public._aotc292_dimension_aggregate(
  p_company_id uuid,
  p_dimension text,
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_department text default null
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_count integer;
  v_avg numeric;
  v_prior_avg numeric;
  v_threshold integer := public._aotc292_anonymity_threshold();
begin
  select count(*)::int, round(avg(r.rating_value)::numeric, 2)
  into v_count, v_avg
  from public.app_portal_culture_responses r
  where r.company_id = p_company_id
    and r.dimension = p_dimension
    and r.rating_value is not null
    and (p_from is null or r.created_at >= p_from)
    and (p_to is null or r.created_at <= p_to)
    and (p_department is null or trim(p_department) = '' or r.department = p_department);

  if v_count < v_threshold then
    return jsonb_build_object(
      'dimension', p_dimension,
      'score', null,
      'response_count', v_count,
      'suppressed', true,
      'trend_direction', 'insufficient_data',
      'anonymity_note', 'Results hidden until minimum response threshold is met.'
    );
  end if;

  select round(avg(r.rating_value)::numeric, 2) into v_prior_avg
  from public.app_portal_culture_responses r
  where r.company_id = p_company_id
    and r.dimension = p_dimension
    and r.rating_value is not null
    and r.created_at < coalesce(p_from, now() - interval '90 days')
    and r.created_at >= coalesce(p_from, now() - interval '90 days') - interval '90 days'
    and (p_department is null or trim(p_department) = '' or r.department = p_department);

  return jsonb_build_object(
    'dimension', p_dimension,
    'score', v_avg,
    'response_count', v_count,
    'suppressed', false,
    'trend_direction', public._aotc292_trend_direction(v_avg, v_prior_avg, v_count),
    'anonymity_note', 'Aggregate results only. Individual responses are never displayed.'
  );
end;
$$;

create or replace function public._aotc292_build_recommendations(p_dimensions jsonb, p_trend text)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_dim jsonb;
begin
  if p_trend = 'improving' then
    v_recs := v_recs || jsonb_build_object('id', 'celebrate', 'key', 'celebrateTrends', 'priority', 'low');
  elsif p_trend = 'declining' then
    v_recs := v_recs || jsonb_build_object('id', 'review-trust', 'key', 'reviewDecliningTrust', 'priority', 'high');
  end if;
  for v_dim in select * from jsonb_array_elements(p_dimensions)
  loop
    if (v_dim->>'trend_direction') = 'declining' and coalesce((v_dim->>'suppressed')::boolean, false) = false then
      v_recs := v_recs || jsonb_build_object('id', 'dim-' || (v_dim->>'dimension'), 'key', 'reviewDecliningTrust', 'dimension', v_dim->>'dimension', 'priority', 'high');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'recognition', 'key', 'encourageRecognition', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'collaboration', 'key', 'facilitateCollaboration', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'pulse', 'key', 'schedulePulseSurvey', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_culture_overview(
  p_dimension text default null,
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_department text default null,
  p_trend text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_dims text[] := array[
    'trust', 'collaboration', 'communication', 'recognition', 'accountability',
    'inclusion', 'psychological_safety', 'leadership_confidence',
    'organizational_alignment', 'learning_mindset'
  ];
  v_dim text;
  v_dimensions jsonb := '[]'::jsonb;
  v_agg jsonb;
  v_culture_sum numeric := 0;
  v_culture_count integer := 0;
  v_trust_score numeric;
  v_participants integer;
  v_eligible integer;
  v_participation_rate numeric := 0;
  v_overall_trend text := 'insufficient_data';
  v_attention jsonb := '[]'::jsonb;
  v_check_ins jsonb := '[]'::jsonb;
begin
  v_ctx := public._aotc292_access_context();
  if coalesce(v_ctx->>'can_view_insights', 'false') <> 'true' then
    raise exception 'Culture insights require leadership access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;

  foreach v_dim in array v_dims
  loop
    if p_dimension is null or p_dimension = v_dim then
      v_agg := public._aotc292_dimension_aggregate(v_company_id, v_dim, p_from, p_to, p_department);
      if coalesce((v_agg->>'suppressed')::boolean, false) = false then
        v_culture_sum := v_culture_sum + (v_agg->>'score')::numeric;
        v_culture_count := v_culture_count + 1;
        if v_dim = 'trust' then v_trust_score := (v_agg->>'score')::numeric; end if;
        if (v_agg->>'trend_direction') in ('declining', 'insufficient_data') and (v_agg->>'score')::numeric < 3.5 then
          v_attention := v_attention || v_agg;
        end if;
      end if;
      if p_trend is null or (v_agg->>'trend_direction') = p_trend then
        v_dimensions := v_dimensions || v_agg;
      end if;
    end if;
  end loop;

  select count(distinct r.participant_hash)::int into v_participants
  from public.app_portal_culture_responses r
  where r.company_id = v_company_id
    and (p_from is null or r.created_at >= p_from)
    and (p_to is null or r.created_at <= p_to);

  select count(*)::int into v_eligible
  from public.users u where u.company_id = v_company_id and u.status = 'active';

  if v_eligible > 0 then
    v_participation_rate := round((v_participants::numeric / v_eligible) * 100, 1);
  end if;

  if v_culture_count > 0 then
    v_overall_trend := public._aotc292_trend_direction(
      v_culture_sum / v_culture_count,
      null,
      v_culture_count * public._aotc292_anonymity_threshold()
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'frequency', c.frequency, 'status', c.status,
    'starts_at', c.starts_at, 'ends_at', c.ends_at, 'created_at', c.created_at
  ) order by c.created_at desc), '[]'::jsonb)
  into v_check_ins
  from public.app_portal_culture_check_ins c
  where c.company_id = v_company_id
  limit 10;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'snapshot', jsonb_build_object(
      'culture_score', case when v_culture_count > 0 then round(v_culture_sum / v_culture_count, 2) else null end,
      'trust_score', v_trust_score,
      'participation_rate', v_participation_rate,
      'participation_count', v_participants,
      'eligible_count', v_eligible,
      'trend_direction', v_overall_trend,
      'improvement_momentum', case when v_overall_trend = 'improving' then 'positive' when v_overall_trend = 'declining' then 'needs_attention' else 'neutral' end,
      'areas_requiring_attention', v_attention,
      'anonymity_threshold', public._aotc292_anonymity_threshold()
    ),
    'dimensions', v_dimensions,
    'check_ins', v_check_ins,
    'recommendations', public._aotc292_build_recommendations(v_dimensions, v_overall_trend),
    'principle', 'Healthy organizations build trust intentionally and improve culture continuously.',
    'privacy_note', 'Individual responses are never displayed. Results appear only in aggregate when anonymity thresholds are met.'
  );
end;
$$;

create or replace function public.get_app_portal_culture_dimension(
  p_dimension text,
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_department text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_agg jsonb;
  v_history jsonb := '[]'::jsonb;
  v_participation jsonb := '[]'::jsonb;
  v_strengths jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
begin
  v_ctx := public._aotc292_access_context();
  if coalesce(v_ctx->>'can_view_insights', 'false') <> 'true' then
    raise exception 'Culture dimension insights require leadership access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;

  v_agg := public._aotc292_dimension_aggregate(v_company_id, p_dimension, p_from, p_to, p_department);

  if coalesce((v_agg->>'suppressed')::boolean, false) = false then
    if (v_agg->>'score')::numeric >= 4 then
      v_strengths := jsonb_build_array(jsonb_build_object('id', 'strength-1', 'text', 'Strong aggregate indicator for this dimension.'));
    end if;
    if (v_agg->>'score')::numeric < 3.5 or (v_agg->>'trend_direction') = 'declining' then
      v_opportunities := jsonb_build_array(jsonb_build_object('id', 'opp-1', 'text', 'Consider focused improvement initiatives for this dimension.'));
    end if;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'period', date_trunc('month', r.created_at),
    'score', round(avg(r.rating_value)::numeric, 2),
    'response_count', count(*)
  ) order by date_trunc('month', r.created_at)), '[]'::jsonb)
  into v_history
  from public.app_portal_culture_responses r
  where r.company_id = v_company_id
    and r.dimension = p_dimension
    and r.rating_value is not null
    and (p_from is null or r.created_at >= p_from)
    and (p_to is null or r.created_at <= p_to)
    and (p_department is null or trim(p_department) = '' or r.department = p_department)
  group by date_trunc('month', r.created_at)
  having count(*) >= public._aotc292_anonymity_threshold();

  select coalesce(jsonb_agg(jsonb_build_object(
    'check_in_id', c.id, 'title', c.title, 'response_count', cnt.cnt
  ) order by c.created_at desc), '[]'::jsonb)
  into v_participation
  from public.app_portal_culture_check_ins c
  join lateral (
    select count(distinct r.participant_hash)::int as cnt
    from public.app_portal_culture_responses r
    where r.check_in_id = c.id and r.dimension = p_dimension
  ) cnt on true
  where c.company_id = v_company_id
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_culture_audit_logs l
  where l.company_id = v_company_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'dimension', v_agg,
    'historical_trends', v_history,
    'participation_history', v_participation,
    'strengths', v_strengths,
    'improvement_opportunities', v_opportunities,
    'recommended_actions', public._aotc292_build_recommendations(jsonb_build_array(v_agg), v_agg->>'trend_direction'),
    'review_history', v_audit,
    'privacy_note', 'Aggregate results only. Individual responses are never displayed.'
  );
end;
$$;

create or replace function public.create_app_portal_culture_check_in(
  p_title text,
  p_description text default '',
  p_frequency text default 'on_demand',
  p_questions jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_c public.app_portal_culture_check_ins;
begin
  v_ctx := public._aotc292_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Culture check-in creation requires leadership access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_culture_check_ins (
    company_id, title, description, frequency, status, questions, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 2000),
    coalesce(nullif(trim(p_frequency), ''), 'on_demand'),
    'active',
    coalesce(p_questions, public._aotc292_default_questions()),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_culture_audit_logs (company_id, event_type, description, performed_by, metadata)
  values (v_company_id, 'check_in_created', 'Culture check-in launched', v_user_id, jsonb_build_object('check_in_id', v_id));

  select * into v_c from public.app_portal_culture_check_ins where id = v_id;
  return jsonb_build_object(
    'created', true,
    'check_in', jsonb_build_object(
      'id', v_c.id, 'title', v_c.title, 'frequency', v_c.frequency,
      'status', v_c.status, 'questions', v_c.questions, 'voluntary_note', v_c.voluntary_note
    )
  );
end;
$$;

create or replace function public.submit_app_portal_culture_response(
  p_check_in_id uuid,
  p_question_id text,
  p_dimension text,
  p_question_type text,
  p_rating_value integer default null,
  p_choice_value text default null,
  p_text_reflection text default '',
  p_department text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_hash text;
  v_check_in public.app_portal_culture_check_ins;
begin
  v_ctx := public._aotc292_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select * into v_check_in from public.app_portal_culture_check_ins
  where id = p_check_in_id and company_id = v_company_id and status = 'active';
  if v_check_in.id is null then raise exception 'Active culture check-in not found'; end if;

  v_hash := encode(extensions.digest(v_user_id::text || p_check_in_id::text, 'sha256'), 'hex');

  insert into public.app_portal_culture_responses (
    check_in_id, company_id, dimension, question_id, question_type,
    rating_value, choice_value, text_reflection, department, participant_hash
  ) values (
    p_check_in_id,
    v_company_id,
    p_dimension,
    left(trim(p_question_id), 100),
    p_question_type,
    case when p_rating_value is not null then greatest(1, least(5, p_rating_value)) else null end,
    nullif(trim(p_choice_value), ''),
    left(coalesce(p_text_reflection, ''), 2000),
    left(coalesce(p_department, ''), 200),
    v_hash
  )
  on conflict (check_in_id, question_id, participant_hash) do update set
    rating_value = excluded.rating_value,
    choice_value = excluded.choice_value,
    text_reflection = excluded.text_reflection,
    department = excluded.department,
    created_at = now();

  return jsonb_build_object(
    'submitted', true,
    'anonymous', true,
    'message', 'Thank you. Your response has been recorded anonymously.'
  );
end;
$$;

grant execute on function public.list_app_portal_culture_overview(text, timestamptz, timestamptz, text, text) to authenticated;
grant execute on function public.get_app_portal_culture_dimension(text, timestamptz, timestamptz, text) to authenticated;
grant execute on function public.create_app_portal_culture_check_in(text, text, text, jsonb) to authenticated;
grant execute on function public.submit_app_portal_culture_response(uuid, text, text, text, integer, text, text, text) to authenticated;
