-- Phase 85 — Outcomes, ROI & Success Validation Engine
-- Core principle: Aipify validates outcomes. Humans interpret outcomes.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes'
  )
);

-- ---------------------------------------------------------------------------
-- 1. success_hypotheses
-- ---------------------------------------------------------------------------
create table if not exists public.success_hypotheses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null default 'operational' check (
    category in (
      'operational', 'knowledge', 'support', 'governance', 'human_success',
      'strategic', 'continuity', 'marketplace'
    )
  ),
  initiative_type text not null default 'general' check (
    initiative_type in (
      'general', 'faq', 'pack', 'automation', 'workflow', 'governance',
      'feature', 'evolution', 'strategy', 'onboarding'
    )
  ),
  title text not null,
  description text not null,
  hypothesis text not null,
  expected_outcome text not null,
  validation_metrics jsonb not null default '[]'::jsonb,
  validation_window text not null default 'short_term' check (
    validation_window in ('immediate', 'short_term', 'medium_term', 'long_term')
  ),
  owner_id uuid references public.users (id) on delete set null,
  source_module text,
  source_ref_id uuid,
  estimated_value numeric(12, 2),
  status text not null default 'in_review' check (
    status in ('hypothesis', 'measuring', 'in_review', 'validated', 'partially_validated', 'not_validated')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists success_hypotheses_tenant_idx
  on public.success_hypotheses (tenant_id, status, category, created_at desc);

alter table public.success_hypotheses enable row level security;
revoke all on public.success_hypotheses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. outcome_measurements
-- ---------------------------------------------------------------------------
create table if not exists public.outcome_measurements (
  id uuid primary key default gen_random_uuid(),
  hypothesis_id uuid not null references public.success_hypotheses (id) on delete cascade,
  metric_name text not null,
  expected_value numeric(14, 4),
  actual_value numeric(14, 4),
  unit text not null default 'count',
  evidence jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists outcome_measurements_hypothesis_idx
  on public.outcome_measurements (hypothesis_id, recorded_at desc);

alter table public.outcome_measurements enable row level security;
revoke all on public.outcome_measurements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. validation_results
-- ---------------------------------------------------------------------------
create table if not exists public.validation_results (
  id uuid primary key default gen_random_uuid(),
  hypothesis_id uuid not null references public.success_hypotheses (id) on delete cascade,
  validation_status text not null check (
    validation_status in ('validated', 'partially_validated', 'not_validated', 'in_review')
  ),
  findings text not null,
  lessons_learned text,
  what_happened text,
  why_it_happened text,
  what_should_change text,
  validated_at timestamptz not null default now()
);

create index if not exists validation_results_hypothesis_idx
  on public.validation_results (hypothesis_id, validated_at desc);

alter table public.validation_results enable row level security;
revoke all on public.validation_results from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. roi_reports
-- ---------------------------------------------------------------------------
create table if not exists public.roi_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  hypothesis_id uuid references public.success_hypotheses (id) on delete set null,
  initiative_type text not null default 'general',
  title text not null,
  estimated_roi numeric(14, 2) not null default 0,
  actual_roi numeric(14, 2) not null default 0,
  variance numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists roi_reports_tenant_idx
  on public.roi_reports (tenant_id, created_at desc);

alter table public.roi_reports enable row level security;
revoke all on public.roi_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. success_kpis (custom KPI framework)
-- ---------------------------------------------------------------------------
create table if not exists public.success_kpis (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  kpi_key text not null,
  name text not null,
  description text,
  target_value numeric(14, 4),
  current_value numeric(14, 4) not null default 0,
  unit text not null default 'count',
  category text not null default 'operational',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, kpi_key)
);

alter table public.success_kpis enable row level security;
revoke all on public.success_kpis from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. success_scorecards
-- ---------------------------------------------------------------------------
create table if not exists public.success_scorecards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  validated_success_score numeric(5, 2) not null default 0 check (validated_success_score between 0 and 100),
  validated_outcomes_score numeric(5, 2) not null default 0,
  partial_outcomes_score numeric(5, 2) not null default 0,
  learning_quality_score numeric(5, 2) not null default 0,
  value_realization_score numeric(5, 2) not null default 0,
  continuous_improvement_score numeric(5, 2) not null default 0,
  evidence_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists success_scorecards_tenant_idx
  on public.success_scorecards (tenant_id, created_at desc);

alter table public.success_scorecards enable row level security;
revoke all on public.success_scorecards from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. success_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.success_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.success_briefings enable row level security;
revoke all on public.success_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. outcomes_settings
-- ---------------------------------------------------------------------------
create table if not exists public.outcomes_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  validation_enabled boolean not null default true,
  show_failed_initiatives boolean not null default true,
  default_validation_window text not null default 'short_term',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.outcomes_settings enable row level security;
revoke all on public.outcomes_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. outcomes_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.outcomes_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.outcomes_audit_log enable row level security;
revoke all on public.outcomes_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers (_out_)
-- ---------------------------------------------------------------------------
create or replace function public._out_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._out_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._out_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.outcomes_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._out_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'outcomes_' || p_event_type, 'outcomes', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._out_ensure_settings(p_tenant_id uuid)
returns public.outcomes_settings language plpgsql security definer set search_path = public as $$
declare v_row public.outcomes_settings;
begin
  insert into public.outcomes_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.outcomes_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._out_window_days(p_window text)
returns int language sql immutable as $$
  select case p_window
    when 'immediate' then 7
    when 'short_term' then 30
    when 'medium_term' then 90
    when 'long_term' then 365
    else 30
  end;
$$;

create or replace function public._out_window_label(p_window text)
returns text language sql immutable as $$
  select case p_window
    when 'immediate' then 'Immediate (7 days)'
    when 'short_term' then 'Short-Term (30 days)'
    when 'medium_term' then 'Medium-Term (90 days)'
    when 'long_term' then 'Long-Term (365 days)'
    else p_window
  end;
$$;

create or replace function public._out_trust_explanation(
  p_hypothesis public.success_hypotheses,
  p_action text default 'validated'
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'out-' || p_hypothesis.id::text,
    'outcomes',
    'outcomes',
    'Outcome validation: ' || p_hypothesis.title,
    'Category: ' || p_hypothesis.category || '. Expected: ' || p_hypothesis.expected_outcome,
    coalesce(p_hypothesis.validation_metrics, '[]'::jsonb),
    jsonb_build_array('evidence_based_validation', 'no_metric_manipulation', 'transparent_reporting'),
    'medium',
    '["defer_validation","extend_window"]'::jsonb,
    jsonb_build_array('Review measurements', 'Interpret findings', 'Apply lessons learned'),
    jsonb_build_object(
      'simple', 'Aipify compared expected outcomes to actual results. Humans interpret what the evidence means.',
      'operational', 'Validation ' || p_action || ' for ' || p_hypothesis.title || '. Limitations documented in findings.',
      'technical', 'Hypothesis ' || p_hypothesis.id::text || ' from ' || coalesce(p_hypothesis.source_module, 'manual')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Seed hypotheses from integrated sources
-- ---------------------------------------------------------------------------
create or replace function public._out_seed_hypotheses(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_settings public.outcomes_settings;
  v_hyp public.success_hypotheses;
  v_faq_count int;
  v_hours_saved numeric;
  v_roi public.roi_settings;
begin
  v_settings := public._out_ensure_settings(p_tenant_id);
  if not v_settings.validation_enabled then return; end if;
  v_roi := public._val_ensure_roi_settings(p_tenant_id);

  -- Evolution proposals → outcome hypotheses
  insert into public.success_hypotheses (
    tenant_id, category, initiative_type, title, description, hypothesis,
    expected_outcome, validation_metrics, validation_window, source_module, source_ref_id,
    estimated_value, status
  )
  select
    p_tenant_id,
    case ep.category
      when 'knowledge' then 'knowledge'
      when 'policy' then 'governance'
      when 'marketplace' then 'marketplace'
      else 'operational'
    end,
    'evolution',
    'Validate: ' || ep.title,
    ep.description,
    'We believe this change will deliver measurable benefit: ' || coalesce(ep.expected_benefits, ep.title),
    coalesce(ep.expected_benefits, 'Measurable operational improvement'),
    jsonb_build_array(
      jsonb_build_object('metric', 'time_saved_hours', 'expected', 2),
      jsonb_build_object('metric', 'adoption_rate', 'expected', 0.7)
    ),
    'short_term',
    'evolution_governance',
    ep.id,
    coalesce((ep.expected_value->>'strategic_value')::numeric, 0),
    'measuring'
  from public.evolution_proposals ep
  where ep.tenant_id = p_tenant_id
    and ep.status in ('implemented', 'validated')
  and not exists (
    select 1 from public.success_hypotheses sh
    where sh.tenant_id = p_tenant_id and sh.source_ref_id = ep.id and sh.source_module = 'evolution_governance'
  )
  limit 5;

  -- Knowledge FAQ hypothesis from value events
  select count(*), coalesce(sum(estimated_time_saved_minutes), 0) / 60.0
  into v_faq_count, v_hours_saved
  from public.value_events
  where tenant_id = p_tenant_id
    and event_type in ('faq_deflected', 'faq_resolved', 'knowledge_gap_resolved')
    and created_at > now() - interval '30 days';

  if v_faq_count > 0 and not exists (
    select 1 from public.success_hypotheses
    where tenant_id = p_tenant_id and title = 'Knowledge FAQ reduces support demand'
  ) then
    insert into public.success_hypotheses (
      tenant_id, category, initiative_type, title, description, hypothesis,
      expected_outcome, validation_metrics, validation_window, source_module,
      estimated_value, status
    ) values (
      p_tenant_id, 'knowledge', 'faq',
      'Knowledge FAQ reduces support demand',
      'Knowledge Center content deflects support inquiries.',
      'We believe FAQ and knowledge articles reduce repeated support questions.',
      'Reduced support volume and faster self-service resolution.',
      jsonb_build_array(
        jsonb_build_object('metric', 'faq_deflections', 'expected', greatest(v_faq_count, 5)),
        jsonb_build_object('metric', 'hours_saved', 'expected', greatest(v_hours_saved, 1))
      ),
      'short_term', 'value_engine',
      v_hours_saved * coalesce(v_roi.default_hourly_rate, 45),
      'measuring'
    );
  end if;

  -- Strategic recommendations → strategic outcome hypotheses
  insert into public.success_hypotheses (
    tenant_id, category, initiative_type, title, description, hypothesis,
    expected_outcome, validation_metrics, validation_window, source_module, source_ref_id,
    status
  )
  select
    p_tenant_id, 'strategic', 'strategy',
    'Validate strategy: ' || left(rec.summary, 80),
    coalesce(rec.opportunity_description, rec.summary),
    'We believe this strategic initiative will create measurable value.',
    coalesce(rec.expected_benefits, 'Strategic value realization'),
    jsonb_build_array(jsonb_build_object('metric', 'value_realization', 'expected', 1)),
    'medium_term', 'strategic_intelligence', rec.id, 'in_review'
  from public.strategic_recommendations rec
  where rec.tenant_id = p_tenant_id and rec.status = 'approved'
  and not exists (
    select 1 from public.success_hypotheses sh
    where sh.tenant_id = p_tenant_id and sh.source_ref_id = rec.id and sh.source_module = 'strategic_intelligence'
  )
  limit 3;

  -- Default KPIs if none exist
  insert into public.success_kpis (tenant_id, kpi_key, name, description, target_value, unit, category)
  select p_tenant_id, v.kpi_key, v.name, v.description, v.target_value, v.unit, v.category
  from (values
    ('support_response_time', 'Support Response Time', 'Average first response time target', 60::numeric, 'minutes', 'support'),
    ('knowledge_adoption', 'Knowledge Center Adoption', 'Monthly unique Knowledge Center users', 50::numeric, 'users', 'knowledge'),
    ('automation_hours_saved', 'Automation Hours Saved', 'Monthly hours saved via automations', 10::numeric, 'hours', 'operational'),
    ('governance_compliance', 'Governance Compliance Rate', 'Percentage of actions following policy', 95::numeric, 'percent', 'governance'),
    ('adoption_score', 'Human Success Adoption', 'Organization adoption score target', 75::numeric, 'score', 'human_success')
  ) as v(kpi_key, name, description, target_value, unit, category)
  where not exists (select 1 from public.success_kpis where tenant_id = p_tenant_id and kpi_key = v.kpi_key);

  -- Auto-measure hypotheses in measuring status
  for v_hyp in
    select * from public.success_hypotheses
    where tenant_id = p_tenant_id and status in ('measuring', 'hypothesis', 'in_review')
    limit 20
  loop
    perform public._out_auto_measure(v_hyp.id);
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Auto-measure and ROI
-- ---------------------------------------------------------------------------
create or replace function public._out_auto_measure(p_hypothesis_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_hyp public.success_hypotheses;
  v_tenant_id uuid;
  v_faq_actual int;
  v_hours_actual numeric;
  v_estimated_roi numeric;
  v_actual_roi numeric;
begin
  select * into v_hyp from public.success_hypotheses where id = p_hypothesis_id;
  if v_hyp.id is null then return; end if;
  v_tenant_id := v_hyp.tenant_id;

  if v_hyp.initiative_type = 'faq' or v_hyp.category = 'knowledge' then
    select count(*), coalesce(sum(estimated_time_saved_minutes), 0) / 60.0
    into v_faq_actual, v_hours_actual
    from public.value_events
    where tenant_id = v_tenant_id
      and event_type in ('faq_deflected', 'faq_resolved', 'knowledge_gap_resolved')
      and created_at > now() - (public._out_window_days(v_hyp.validation_window) || ' days')::interval;

    insert into public.outcome_measurements (hypothesis_id, metric_name, expected_value, actual_value, unit, evidence)
    values
      (p_hypothesis_id, 'faq_deflections',
        coalesce((v_hyp.validation_metrics->0->>'expected')::numeric, 5),
        v_faq_actual, 'count',
        jsonb_build_object('source', 'value_events', 'window_days', public._out_window_days(v_hyp.validation_window))),
      (p_hypothesis_id, 'hours_saved',
        coalesce((v_hyp.validation_metrics->1->>'expected')::numeric, 1),
        v_hours_actual, 'hours',
        jsonb_build_object('source', 'value_events', 'conservative', true));
  end if;

  v_estimated_roi := coalesce(v_hyp.estimated_value, 0);
  select coalesce(sum(estimated_value), sum(estimated_time_saved_minutes) / 60.0 * 45)
  into v_actual_roi
  from public.value_events
  where tenant_id = v_tenant_id
    and created_at > now() - (public._out_window_days(v_hyp.validation_window) || ' days')::interval;

  if v_estimated_roi > 0 or v_actual_roi > 0 then
    insert into public.roi_reports (
      tenant_id, hypothesis_id, initiative_type, title,
      estimated_roi, actual_roi, variance, evidence
    )
    select
      v_tenant_id, p_hypothesis_id, v_hyp.initiative_type,
      'ROI: ' || v_hyp.title,
      v_estimated_roi, coalesce(v_actual_roi, 0),
      coalesce(v_actual_roi, 0) - v_estimated_roi,
      jsonb_build_object('measurement_source', 'value_engine', 'transparent', true)
    where not exists (
      select 1 from public.roi_reports
      where hypothesis_id = p_hypothesis_id
        and created_at > now() - interval '1 day'
    );
  end if;
end; $$;

create or replace function public._out_calculate_success_score(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_total int;
  v_validated int;
  v_partial int;
  v_failed int;
  v_lessons int;
  v_roi_positive int;
  v_roi_total int;
  v_validated_score numeric;
  v_partial_score numeric;
  v_learning_score numeric;
  v_value_score numeric;
  v_improvement_score numeric;
  v_overall numeric;
  v_id uuid;
begin
  select count(*) into v_total from public.success_hypotheses where tenant_id = p_tenant_id;
  select count(*) into v_validated from public.validation_results vr
    join public.success_hypotheses sh on sh.id = vr.hypothesis_id
    where sh.tenant_id = p_tenant_id and vr.validation_status = 'validated';
  select count(*) into v_partial from public.validation_results vr
    join public.success_hypotheses sh on sh.id = vr.hypothesis_id
    where sh.tenant_id = p_tenant_id and vr.validation_status = 'partially_validated';
  select count(*) into v_failed from public.validation_results vr
    join public.success_hypotheses sh on sh.id = vr.hypothesis_id
    where sh.tenant_id = p_tenant_id and vr.validation_status = 'not_validated';
  select count(*) into v_lessons from public.validation_results vr
    join public.success_hypotheses sh on sh.id = vr.hypothesis_id
    where sh.tenant_id = p_tenant_id and coalesce(vr.lessons_learned, '') <> '';

  v_validated_score := case when v_total > 0 then (v_validated::numeric / v_total) * 100 else 50 end;
  v_partial_score := case when v_total > 0 then (v_partial::numeric / v_total) * 50 else 25 end;
  v_learning_score := case when (v_validated + v_partial + v_failed) > 0
    then (v_lessons::numeric / greatest(v_validated + v_partial + v_failed, 1)) * 100 else 40 end;

  select count(*) filter (where variance >= 0), count(*)
  into v_roi_positive, v_roi_total
  from public.roi_reports where tenant_id = p_tenant_id;

  v_value_score := case when v_roi_total > 0 then (v_roi_positive::numeric / v_roi_total) * 100 else 50 end;
  v_improvement_score := least(100, 50 + v_validated * 5 + v_lessons * 3);

  v_overall := round((
    v_validated_score * 0.30 +
    v_partial_score * 0.15 +
    v_learning_score * 0.20 +
    v_value_score * 0.20 +
    v_improvement_score * 0.15
  )::numeric, 2);

  insert into public.success_scorecards (
    tenant_id, validated_success_score,
    validated_outcomes_score, partial_outcomes_score,
    learning_quality_score, value_realization_score, continuous_improvement_score,
    evidence_summary
  ) values (
    p_tenant_id, v_overall,
    v_validated_score, v_partial_score,
    v_learning_score, v_value_score, v_improvement_score,
    jsonb_build_object(
      'total_hypotheses', v_total,
      'validated', v_validated,
      'partially_validated', v_partial,
      'not_validated', v_failed,
      'lessons_captured', v_lessons,
      'failed_visible', true
    )
  ) returning id into v_id;

  return jsonb_build_object(
    'scorecard_id', v_id,
    'validated_success_score', v_overall,
    'components', jsonb_build_object(
      'validated_outcomes', v_validated_score,
      'partial_outcomes', v_partial_score,
      'learning_quality', v_learning_score,
      'value_realization', v_value_score,
      'continuous_improvement', v_improvement_score
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Validation RPCs
-- ---------------------------------------------------------------------------
create or replace function public.validate_outcome_hypothesis(
  p_hypothesis_id uuid,
  p_validation_status text,
  p_findings text,
  p_lessons_learned text default null,
  p_what_happened text default null,
  p_why_it_happened text default null,
  p_what_should_change text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hyp public.success_hypotheses;
  v_result_id uuid;
begin
  v_tenant_id := public._out_require_tenant();
  select * into v_hyp from public.success_hypotheses
  where id = p_hypothesis_id and tenant_id = v_tenant_id;
  if v_hyp.id is null then raise exception 'Hypothesis not found'; end if;
  if p_validation_status not in ('validated', 'partially_validated', 'not_validated', 'in_review') then
    raise exception 'Invalid validation status';
  end if;

  perform public._out_auto_measure(p_hypothesis_id);

  insert into public.validation_results (
    hypothesis_id, validation_status, findings, lessons_learned,
    what_happened, why_it_happened, what_should_change
  ) values (
    p_hypothesis_id, p_validation_status, p_findings,
    p_lessons_learned, p_what_happened, p_why_it_happened, p_what_should_change
  ) returning id into v_result_id;

  update public.success_hypotheses
  set status = p_validation_status, updated_at = now()
  where id = p_hypothesis_id;

  perform public._out_calculate_success_score(v_tenant_id);
  perform public._out_log_audit(v_tenant_id, 'validation_' || p_validation_status,
    'Validated hypothesis: ' || v_hyp.title,
    jsonb_build_object('hypothesis_id', p_hypothesis_id, 'result_id', v_result_id));
  perform public._out_trust_explanation(v_hyp, p_validation_status);

  return jsonb_build_object(
    'validation_status', p_validation_status,
    'result_id', v_result_id,
    'human_interpretation_required', true,
    'note', 'Aipify validates outcomes. Humans interpret what value means.'
  );
end; $$;

create or replace function public.record_outcome_measurement(
  p_hypothesis_id uuid,
  p_metric_name text,
  p_expected_value numeric,
  p_actual_value numeric,
  p_unit text default 'count'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._out_require_tenant();
  if not exists (
    select 1 from public.success_hypotheses where id = p_hypothesis_id and tenant_id = v_tenant_id
  ) then raise exception 'Hypothesis not found'; end if;

  insert into public.outcome_measurements (hypothesis_id, metric_name, expected_value, actual_value, unit)
  values (p_hypothesis_id, p_metric_name, p_expected_value, p_actual_value, coalesce(p_unit, 'count'))
  returning id into v_id;

  perform public._out_log_audit(v_tenant_id, 'measurement_recorded',
    'Measurement: ' || p_metric_name,
    jsonb_build_object('hypothesis_id', p_hypothesis_id, 'measurement_id', v_id));

  return jsonb_build_object('measurement_id', v_id);
end; $$;

create or replace function public.generate_success_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_id uuid;
  v_summary text;
  v_content jsonb;
  v_score numeric;
  v_validated int;
  v_failed int;
begin
  v_tenant_id := public._out_require_tenant();
  perform public._out_seed_hypotheses(v_tenant_id);

  select validated_success_score into v_score
  from public.success_scorecards where tenant_id = v_tenant_id
  order by created_at desc limit 1;

  select count(*) into v_validated from public.validation_results vr
    join public.success_hypotheses sh on sh.id = vr.hypothesis_id
    where sh.tenant_id = v_tenant_id and vr.validation_status = 'validated';

  select count(*) into v_failed from public.validation_results vr
    join public.success_hypotheses sh on sh.id = vr.hypothesis_id
    where sh.tenant_id = v_tenant_id and vr.validation_status = 'not_validated';

  v_summary := 'Success score ' || coalesce(v_score, 0) || '/100. ' ||
    v_validated || ' validated initiatives, ' || v_failed || ' failed assumptions documented.';

  v_content := jsonb_build_object(
    'validated_success_score', coalesce(v_score, 0),
    'validated_initiatives', coalesce((
      select jsonb_agg(jsonb_build_object('title', sh.title, 'findings', vr.findings))
      from public.validation_results vr
      join public.success_hypotheses sh on sh.id = vr.hypothesis_id
      where sh.tenant_id = v_tenant_id and vr.validation_status = 'validated'
      limit 10
    ), '[]'::jsonb),
    'failed_assumptions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', sh.title, 'lessons_learned', vr.lessons_learned,
        'what_happened', vr.what_happened, 'what_should_change', vr.what_should_change
      ))
      from public.validation_results vr
      join public.success_hypotheses sh on sh.id = vr.hypothesis_id
      where sh.tenant_id = v_tenant_id and vr.validation_status = 'not_validated'
      limit 10
    ), '[]'::jsonb),
    'roi_trends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', r.title, 'estimated_roi', r.estimated_roi,
        'actual_roi', r.actual_roi, 'variance', r.variance
      ) order by r.created_at desc)
      from public.roi_reports r where r.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'emerging_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('title', sh.title, 'category', sh.category))
      from public.success_hypotheses sh
      where sh.tenant_id = v_tenant_id and sh.status in ('measuring', 'in_review')
      limit 5
    ), '[]'::jsonb),
    'human_interpretation_required', true,
    'failed_initiatives_visible', true
  );

  insert into public.success_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_content)
  returning id into v_id;

  perform public._out_log_audit(v_tenant_id, 'briefing_generated', v_summary,
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', v_content);
end; $$;

create or replace function public.upsert_success_kpi(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._out_require_tenant();
  insert into public.success_kpis (
    tenant_id, kpi_key, name, description, target_value, current_value, unit, category, active
  ) values (
    v_tenant_id,
    p_patch->>'kpi_key',
    p_patch->>'name',
    p_patch->>'description',
    (p_patch->>'target_value')::numeric,
    coalesce((p_patch->>'current_value')::numeric, 0),
    coalesce(p_patch->>'unit', 'count'),
    coalesce(p_patch->>'category', 'operational'),
    coalesce((p_patch->>'active')::boolean, true)
  )
  on conflict (tenant_id, kpi_key) do update set
    name = excluded.name,
    description = excluded.description,
    target_value = excluded.target_value,
    current_value = coalesce(excluded.current_value, success_kpis.current_value),
    unit = excluded.unit,
    category = excluded.category,
    active = excluded.active,
    updated_at = now()
  returning id into v_id;

  perform public._out_log_audit(v_tenant_id, 'kpi_modified', 'KPI updated: ' || (p_patch->>'name'),
    jsonb_build_object('kpi_id', v_id, 'kpi_key', p_patch->>'kpi_key'));

  return jsonb_build_object('kpi_id', v_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_outcomes_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score numeric;
  v_open int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select validated_success_score into v_score
  from public.success_scorecards where tenant_id = v_tenant_id
  order by created_at desc limit 1;

  select count(*) into v_open from public.success_hypotheses
  where tenant_id = v_tenant_id and status in ('measuring', 'in_review', 'hypothesis');

  return jsonb_build_object(
    'has_customer', true,
    'validated_success_score', coalesce(v_score, 0),
    'open_hypotheses', v_open,
    'philosophy', 'Aipify validates outcomes. Humans interpret outcomes.',
    'human_interpretation_required', true
  );
end; $$;

create or replace function public.get_outcomes_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.outcomes_settings;
  v_score jsonb;
  v_hypotheses jsonb;
  v_validated jsonb;
  v_failed jsonb;
  v_roi jsonb;
  v_kpis jsonb;
  v_briefings jsonb;
  v_lessons jsonb;
  v_total_value numeric;
begin
  v_tenant_id := public._out_require_tenant();
  v_settings := public._out_ensure_settings(v_tenant_id);
  perform public._out_seed_hypotheses(v_tenant_id);
  v_score := public._out_calculate_success_score(v_tenant_id);

  select coalesce(sum(actual_roi), 0) into v_total_value
  from public.roi_reports where tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'category', h.category, 'initiative_type', h.initiative_type,
    'title', h.title, 'description', h.description, 'hypothesis', h.hypothesis,
    'expected_outcome', h.expected_outcome,
    'validation_window', h.validation_window,
    'validation_window_label', public._out_window_label(h.validation_window),
    'status', h.status, 'estimated_value', h.estimated_value,
    'source_module', h.source_module, 'created_at', h.created_at
  ) order by h.created_at desc), '[]'::jsonb) into v_hypotheses
  from public.success_hypotheses h where h.tenant_id = v_tenant_id limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'title', h.title, 'category', h.category,
    'validation_status', vr.validation_status, 'findings', vr.findings,
    'validated_at', vr.validated_at
  ) order by vr.validated_at desc), '[]'::jsonb) into v_validated
  from public.validation_results vr
  join public.success_hypotheses h on h.id = vr.hypothesis_id
  where h.tenant_id = v_tenant_id and vr.validation_status = 'validated'
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'title', h.title, 'category', h.category,
    'validation_status', vr.validation_status, 'findings', vr.findings,
    'lessons_learned', vr.lessons_learned,
    'what_happened', vr.what_happened,
    'why_it_happened', vr.why_it_happened,
    'what_should_change', vr.what_should_change,
    'validated_at', vr.validated_at
  ) order by vr.validated_at desc), '[]'::jsonb) into v_failed
  from public.validation_results vr
  join public.success_hypotheses h on h.id = vr.hypothesis_id
  where h.tenant_id = v_tenant_id and vr.validation_status = 'not_validated'
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'initiative_type', r.initiative_type,
    'estimated_roi', r.estimated_roi, 'actual_roi', r.actual_roi,
    'variance', r.variance, 'currency', r.currency, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb) into v_roi
  from public.roi_reports r where r.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', k.id, 'kpi_key', k.kpi_key, 'name', k.name, 'description', k.description,
    'target_value', k.target_value, 'current_value', k.current_value,
    'unit', k.unit, 'category', k.category, 'active', k.active
  )), '[]'::jsonb) into v_kpis
  from public.success_kpis k where k.tenant_id = v_tenant_id and k.active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.success_briefings b where b.tenant_id = v_tenant_id limit 5;

  select coalesce(jsonb_agg(jsonb_build_object(
    'title', h.title, 'lessons_learned', vr.lessons_learned,
    'what_should_change', vr.what_should_change
  )), '[]'::jsonb) into v_lessons
  from public.validation_results vr
  join public.success_hypotheses h on h.id = vr.hypothesis_id
  where h.tenant_id = v_tenant_id and coalesce(vr.lessons_learned, '') <> ''
  limit 10;

  return jsonb_build_object(
    'has_customer', true,
    'human_interpretation_required', true,
    'validation_enabled', v_settings.validation_enabled,
    'show_failed_initiatives', v_settings.show_failed_initiatives,
    'philosophy', 'Aipify validates outcomes. Humans interpret outcomes.',
    'safety_note', 'Failed initiatives are never hidden. Evidence remains transparent.',
    'validated_success_score', v_score->'validated_success_score',
    'score_components', v_score->'components',
    'total_value_generated', v_total_value,
    'hypotheses', v_hypotheses,
    'validated_initiatives', v_validated,
    'failed_initiatives', case when v_settings.show_failed_initiatives then v_failed else '[]'::jsonb end,
    'roi_reports', v_roi,
    'kpis', v_kpis,
    'briefings', v_briefings,
    'lessons_learned', v_lessons,
    'validation_windows', jsonb_build_array(
      jsonb_build_object('key', 'immediate', 'label', 'Immediate (7 days)'),
      jsonb_build_object('key', 'short_term', 'label', 'Short-Term (30 days)'),
      jsonb_build_object('key', 'medium_term', 'label', 'Medium-Term (90 days)'),
      jsonb_build_object('key', 'long_term', 'label', 'Long-Term (365 days)')
    ),
    'outcome_categories', jsonb_build_array(
      jsonb_build_object('key', 'operational', 'label', 'Operational Outcomes'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Outcomes'),
      jsonb_build_object('key', 'support', 'label', 'Support Outcomes'),
      jsonb_build_object('key', 'governance', 'label', 'Governance Outcomes'),
      jsonb_build_object('key', 'human_success', 'label', 'Human Success Outcomes'),
      jsonb_build_object('key', 'strategic', 'label', 'Strategic Outcomes'),
      jsonb_build_object('key', 'continuity', 'label', 'Continuity Outcomes'),
      jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Outcomes')
    ),
    'integrations', jsonb_build_object(
      'value_engine', 'Estimates and actuals from value events',
      'learning_engine', 'Refines assumptions from validated and failed outcomes',
      'strategic_intelligence', 'Validated outcomes influence priorities',
      'human_success', 'Adoption and confidence measurements',
      'governance', 'Approval and compliance outcome tracking',
      'marketplace', 'Pack ROI and time-to-value',
      'executive_briefing', 'Success briefings with ROI trends'
    )
  );
end; $$;

create or replace function public.get_outcome_hypothesis_detail(p_hypothesis_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._out_require_tenant();
  return jsonb_build_object(
    'hypothesis', (
      select jsonb_build_object(
        'id', h.id, 'category', h.category, 'title', h.title,
        'description', h.description, 'hypothesis', h.hypothesis,
        'expected_outcome', h.expected_outcome,
        'validation_metrics', h.validation_metrics,
        'validation_window', h.validation_window,
        'validation_window_label', public._out_window_label(h.validation_window),
        'status', h.status, 'estimated_value', h.estimated_value
      )
      from public.success_hypotheses h
      where h.id = p_hypothesis_id and h.tenant_id = v_tenant_id
    ),
    'measurements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'metric_name', m.metric_name,
        'expected_value', m.expected_value, 'actual_value', m.actual_value,
        'unit', m.unit, 'recorded_at', m.recorded_at
      ) order by m.recorded_at desc)
      from public.outcome_measurements m where m.hypothesis_id = p_hypothesis_id
    ), '[]'::jsonb),
    'validation_results', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', vr.id, 'validation_status', vr.validation_status,
        'findings', vr.findings, 'lessons_learned', vr.lessons_learned,
        'what_happened', vr.what_happened, 'why_it_happened', vr.why_it_happened,
        'what_should_change', vr.what_should_change, 'validated_at', vr.validated_at
      ) order by vr.validated_at desc)
      from public.validation_results vr where vr.hypothesis_id = p_hypothesis_id
    ), '[]'::jsonb),
    'human_interpretation_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'outcomes', 'Outcomes & Success Validation', 'ROI validation, KPI guides, and lessons learned.', 'authenticated', 30
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'outcomes' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 16. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_outcomes_card() to authenticated;
grant execute on function public.get_outcomes_dashboard() to authenticated;
grant execute on function public.get_outcome_hypothesis_detail(uuid) to authenticated;
grant execute on function public.validate_outcome_hypothesis(uuid, text, text, text, text, text, text) to authenticated;
grant execute on function public.record_outcome_measurement(uuid, text, numeric, numeric, text) to authenticated;
grant execute on function public.generate_success_briefing() to authenticated;
grant execute on function public.upsert_success_kpi(jsonb) to authenticated;
