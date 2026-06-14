-- Phase A.28 — Innovation & Impact Engine
-- Evidence-based impact measurement, baselines, case studies, and reports.

-- ---------------------------------------------------------------------------
-- 1. organization_impact_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.organization_impact_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  baseline_value numeric not null default 0,
  current_value numeric not null default 0,
  improvement_percentage numeric not null default 0,
  measurement_period text not null default 'monthly' check (
    measurement_period in ('weekly', 'monthly', 'quarterly', 'annual')
  ),
  category text not null default 'efficiency' check (
    category in ('support', 'admin', 'efficiency', 'satisfaction', 'onboarding', 'adoption')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key, measurement_period)
);

alter table public.organization_impact_metrics enable row level security;
revoke all on public.organization_impact_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. impact_case_studies
-- ---------------------------------------------------------------------------
create table if not exists public.impact_case_studies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  study_key text not null,
  title text not null,
  summary text,
  before_summary text,
  after_summary text,
  measurable_outcomes jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, study_key)
);

alter table public.impact_case_studies enable row level security;
revoke all on public.impact_case_studies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. impact_reports
-- ---------------------------------------------------------------------------
create table if not exists public.impact_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null check (report_type in ('monthly', 'pilot', 'executive', 'innovation')),
  period_start date,
  period_end date,
  status text not null default 'generated' check (status in ('draft', 'generated', 'exported')),
  summary_metadata jsonb not null default '{}'::jsonb,
  generated_by uuid references public.users (id) on delete set null,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.impact_reports enable row level security;
revoke all on public.impact_reports from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'innovation_impact', v.description
from (values
  ('impact.view', 'View Impact', 'View impact metrics and dashboards'),
  ('impact.export', 'Export Impact', 'Export impact reports'),
  ('impact.manage', 'Manage Impact', 'Capture baselines and manage case studies')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

create or replace function public._iie_log(
  p_organization_id uuid, p_action_type text, p_entity_type text default 'impact',
  p_entity_id uuid default null, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata);
end; $$;

create or replace function public._iie_seed_metrics(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_impact_metrics (organization_id, metric_key, baseline_value, current_value, improvement_percentage, category)
  select p_organization_id, v.key, v.baseline, v.current, v.improvement, v.cat
  from (values
    ('support_first_response_minutes', 120, 45, 62.5, 'support'),
    ('support_resolution_hours', 48, 24, 50.0, 'support'),
    ('admin_task_completion_rate', 60, 78, 30.0, 'admin'),
    ('approval_turnaround_hours', 72, 36, 50.0, 'efficiency'),
    ('onboarding_days', 14, 7, 50.0, 'onboarding'),
    ('recommendation_acceptance_rate', 40, 65, 62.5, 'adoption')
  ) as v(key, baseline, current, improvement, cat)
  on conflict (organization_id, metric_key, measurement_period) do nothing;
end; $$;

create or replace function public.capture_impact_baseline(
  p_metric_key text, p_baseline_value numeric
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_impact_metrics;
begin
  perform public._irp_require_permission('impact.manage');
  v_org_id := public._mta_require_organization();
  perform public._iie_seed_metrics(v_org_id);
  update public.organization_impact_metrics
  set baseline_value = p_baseline_value,
      improvement_percentage = case when p_baseline_value > 0
        then round(((baseline_value - current_value) / p_baseline_value) * 100, 2) else 0 end,
      updated_at = now()
  where organization_id = v_org_id and metric_key = p_metric_key
  returning * into v_row;
  perform public._iie_log(v_org_id, 'baseline_changed', 'impact_metric', v_row.id, jsonb_build_object('metric_key', p_metric_key));
  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_impact_report(p_report_type text default 'monthly')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('impact.export');
  v_org_id := public._mta_require_organization();
  perform public._iie_seed_metrics(v_org_id);
  insert into public.impact_reports (organization_id, report_type, period_start, period_end, summary_metadata)
  values (
    v_org_id, p_report_type, date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date,
    jsonb_build_object(
      'metrics_count', (select count(*) from public.organization_impact_metrics where organization_id = v_org_id),
      'avg_improvement', (select round(avg(improvement_percentage), 2) from public.organization_impact_metrics where organization_id = v_org_id)
    )
  ) returning id into v_id;
  perform public._iie_log(v_org_id, 'impact_report_exported', 'impact_report', v_id, jsonb_build_object('report_type', p_report_type));
  return jsonb_build_object('id', v_id, 'report_type', p_report_type);
end; $$;

create or replace function public.get_innovation_impact_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('impact.view');
  v_org_id := public._mta_require_organization();
  perform public._iie_seed_metrics(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Evidence-based impact measurement — baselines, improvements, and outcome documentation.',
    'principles', jsonb_build_array('Tenant-aware measurement', 'Outcome-focused insights', 'Historical comparisons', 'Pilot validation support', 'Metadata only — no PII'),
    'summary', jsonb_build_object(
      'avg_improvement', coalesce((select round(avg(improvement_percentage), 2) from public.organization_impact_metrics where organization_id = v_org_id), 0),
      'metrics_tracked', coalesce((select count(*) from public.organization_impact_metrics where organization_id = v_org_id), 0),
      'case_studies', coalesce((select count(*) from public.impact_case_studies where organization_id = v_org_id), 0)
    ),
    'metrics', coalesce((select jsonb_agg(row_to_json(m) order by m.improvement_percentage desc) from public.organization_impact_metrics m where m.organization_id = v_org_id), '[]'::jsonb),
    'case_studies', coalesce((select jsonb_agg(row_to_json(c) order by c.created_at desc) from public.impact_case_studies c where c.organization_id = v_org_id limit 10), '[]'::jsonb),
    'recent_reports', coalesce((select jsonb_agg(row_to_json(r) order by r.generated_at desc) from public.impact_reports r where r.organization_id = v_org_id limit 5), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_innovation_impact_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._iie_seed_metrics(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'avg_improvement', coalesce((select round(avg(improvement_percentage), 2) from public.organization_impact_metrics where organization_id = v_org_id), 0),
    'philosophy', 'Measurable business value from Aipify adoption.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'innovation-impact-engine', 'Innovation & Impact Engine', 'Impact measurement, baselines, and outcome documentation.', 'authenticated', 71
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'innovation-impact-engine' and tenant_id is null);

grant execute on function public.get_innovation_impact_engine_dashboard() to authenticated;
grant execute on function public.get_innovation_impact_engine_card() to authenticated;
grant execute on function public.capture_impact_baseline(text, numeric) to authenticated;
grant execute on function public.generate_impact_report(text) to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop perform public._iie_seed_metrics(v_org_id); end loop;
end $$;
