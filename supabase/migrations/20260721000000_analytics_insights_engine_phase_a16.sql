-- Phase A.16 — Analytics & Insights Engine
-- Principle: tenant-aware operational analytics — counts and trends only, no PII.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'analytics_insights_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_analytics_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.organization_analytics_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  metric_type text not null default 'count' check (
    metric_type in ('count', 'rate', 'duration_hours', 'score', 'percentage')
  ),
  measurement_period text not null default 'snapshot' check (
    measurement_period in ('snapshot', 'daily', 'weekly', 'monthly')
  ),
  period_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (organization_id, metric_key, measurement_period, period_date)
);

create index if not exists organization_analytics_metrics_org_idx
  on public.organization_analytics_metrics (organization_id, metric_key, period_date desc);

alter table public.organization_analytics_metrics enable row level security;
revoke all on public.organization_analytics_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. analytics_insights
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_key text not null,
  category text not null check (
    category in (
      'support_performance', 'admin_assistant', 'knowledge_center',
      'approval_workflows', 'integration_reliability', 'ai_recommendations',
      'onboarding_effectiveness'
    )
  ),
  title text not null,
  description text,
  severity text not null default 'moderate' check (
    severity in ('informational', 'moderate', 'high', 'critical')
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  suggested_action text,
  status text not null default 'active' check (
    status in ('active', 'acknowledged', 'resolved', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, insight_key)
);

create index if not exists analytics_insights_org_status_idx
  on public.analytics_insights (organization_id, status, severity, created_at desc);

alter table public.analytics_insights enable row level security;
revoke all on public.analytics_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. analytics_reports
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null check (report_type in ('weekly', 'monthly', 'custom')),
  period_start timestamptz not null,
  period_end timestamptz not null,
  status text not null default 'pending' check (
    status in ('pending', 'generating', 'ready', 'failed', 'archived')
  ),
  summary_metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz,
  export_format text not null default 'json' check (export_format in ('json', 'csv')),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists analytics_reports_org_idx
  on public.analytics_reports (organization_id, report_type, created_at desc);

alter table public.analytics_reports enable row level security;
revoke all on public.analytics_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. analytics_settings
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  enabled_categories jsonb not null default '[
    "support_performance","admin_assistant","knowledge_center",
    "approval_workflows","integration_reliability","ai_recommendations",
    "onboarding_effectiveness"
  ]'::jsonb,
  scheduled_reports jsonb not null default '[]'::jsonb,
  retention_days int not null default 365,
  role_visibility jsonb not null default '{}'::jsonb,
  auto_refresh_on_dashboard boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.analytics_settings enable row level security;
revoke all on public.analytics_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'analytics_insights', v.description
from (values
  ('analytics.view', 'View Analytics', 'Access analytics dashboards and insights'),
  ('analytics.export', 'Export Analytics Reports', 'Export summary analytics reports'),
  ('analytics.manage', 'Manage Analytics', 'Configure analytics settings and scheduled reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'analytics.view'), ('owner', 'analytics.export'), ('owner', 'analytics.manage'),
  ('administrator', 'analytics.view'), ('administrator', 'analytics.export'), ('administrator', 'analytics.manage'),
  ('manager', 'analytics.view'), ('manager', 'analytics.export'),
  ('support_agent', 'analytics.view'),
  ('viewer', 'analytics.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_aie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._aie_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'analytics',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._aie_user_role(p_organization_id uuid default null)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_role text;
begin
  v_org_id := public._mta_require_organization(p_organization_id);
  select ou.role into v_role
  from public.organization_users ou
  where ou.organization_id = v_org_id
    and ou.user_id = public._mta_app_user_id()
    and ou.status = 'active';
  return coalesce(v_role, 'viewer');
exception when others then
  return 'viewer';
end; $$;

create or replace function public._aie_default_role_visibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'owner', jsonb_build_array(
      'support_performance','admin_assistant','knowledge_center',
      'approval_workflows','integration_reliability','ai_recommendations','onboarding_effectiveness'
    ),
    'administrator', jsonb_build_array(
      'support_performance','admin_assistant','knowledge_center',
      'approval_workflows','integration_reliability','ai_recommendations','onboarding_effectiveness'
    ),
    'manager', jsonb_build_array(
      'support_performance','admin_assistant','knowledge_center',
      'approval_workflows','ai_recommendations','onboarding_effectiveness'
    ),
    'support_agent', jsonb_build_array('support_performance','knowledge_center'),
    'viewer', jsonb_build_array('support_performance','knowledge_center','onboarding_effectiveness')
  );
$$;

create or replace function public._aie_ensure_settings(p_organization_id uuid)
returns public.analytics_settings language plpgsql security definer set search_path = public as $$
declare v_row public.analytics_settings;
begin
  insert into public.analytics_settings (organization_id, role_visibility)
  values (p_organization_id, public._aie_default_role_visibility())
  on conflict (organization_id) do nothing;
  select * into v_row from public.analytics_settings where organization_id = p_organization_id;
  if v_row.role_visibility = '{}'::jsonb then
    update public.analytics_settings
    set role_visibility = public._aie_default_role_visibility(), updated_at = now()
    where organization_id = p_organization_id;
    select * into v_row from public.analytics_settings where organization_id = p_organization_id;
  end if;
  return v_row;
end; $$;

create or replace function public._aie_visible_categories(p_organization_id uuid, p_role text)
returns text[] language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.analytics_settings;
  v_role_cats jsonb;
  v_enabled jsonb;
  v_cat text;
  v_result text[] := '{}';
begin
  v_settings := public._aie_ensure_settings(p_organization_id);
  v_role_cats := coalesce(v_settings.role_visibility -> p_role, '[]'::jsonb);
  v_enabled := v_settings.enabled_categories;

  for v_cat in
    select jsonb_array_elements_text(v_role_cats)
  loop
    if v_enabled ? v_cat then
      v_result := array_append(v_result, v_cat);
    end if;
  end loop;

  return v_result;
end; $$;

create or replace function public._aie_upsert_metric(
  p_organization_id uuid,
  p_metric_key text,
  p_metric_value numeric,
  p_metric_type text default 'count',
  p_measurement_period text default 'snapshot',
  p_period_date date default current_date
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_analytics_metrics (
    organization_id, metric_key, metric_value, metric_type, measurement_period, period_date
  ) values (
    p_organization_id, p_metric_key, p_metric_value, p_metric_type, p_measurement_period, p_period_date
  )
  on conflict (organization_id, metric_key, measurement_period, period_date) do update set
    metric_value = excluded.metric_value,
    metric_type = excluded.metric_type,
    created_at = now();
end; $$;

create or replace function public._aie_collect_metrics(p_organization_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_today date := current_date;
  v_open_support int;
  v_closed_30d int;
  v_avg_first_resp numeric;
  v_avg_resolution numeric;
  v_escalation_rate numeric;
  v_pos_sat int; v_neg_sat int;
  v_tasks_completed int; v_tasks_overdue int;
  v_rec_accepted int; v_rec_rejected int;
  v_pending_approvals int;
  v_published int; v_drafts int; v_stale int; v_gaps int;
  v_ai_gen int; v_ai_accepted int; v_ai_rejected int; v_ai_failed int;
  v_sync_ok int; v_sync_fail int; v_webhook_fail int;
  v_int_healthy int; v_int_degraded int;
  v_onboard_pct numeric;
  v_count int := 0;
begin
  -- Support (A.7)
  select count(*) into v_open_support
  from public.organization_support_cases
  where organization_id = p_organization_id
    and status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal');

  select count(*) into v_closed_30d
  from public.organization_support_cases
  where organization_id = p_organization_id
    and status in ('resolved', 'closed')
    and coalesce(resolved_at, updated_at) > now() - interval '30 days';

  select coalesce(avg(extract(epoch from (first_response_at - created_at)) / 3600), 0) into v_avg_first_resp
  from public.organization_support_cases
  where organization_id = p_organization_id and first_response_at is not null
    and created_at > now() - interval '30 days';

  select coalesce(avg(extract(epoch from (resolved_at - created_at)) / 3600), 0) into v_avg_resolution
  from public.organization_support_cases
  where organization_id = p_organization_id and resolved_at is not null
    and resolved_at > now() - interval '30 days';

  select case when count(*) > 0
    then round(count(*) filter (where escalated_at is not null)::numeric / count(*)::numeric, 3)
    else 0 end into v_escalation_rate
  from public.organization_support_cases
  where organization_id = p_organization_id and created_at > now() - interval '30 days';

  select
    count(*) filter (where s.rating = 'positive'),
    count(*) filter (where s.rating = 'negative')
  into v_pos_sat, v_neg_sat
  from public.support_case_satisfaction s
  join public.organization_support_cases c on c.id = s.case_id
  where c.organization_id = p_organization_id and s.created_at > now() - interval '30 days';

  perform public._aie_upsert_metric(p_organization_id, 'support.open_cases', v_open_support, 'count', 'snapshot', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'support.closed_cases_30d', v_closed_30d, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'support.avg_first_response_hours', round(v_avg_first_resp, 2), 'duration_hours', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'support.avg_resolution_hours', round(v_avg_resolution, 2), 'duration_hours', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'support.escalation_rate', v_escalation_rate, 'rate', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'support.positive_satisfaction_30d', v_pos_sat, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'support.negative_satisfaction_30d', v_neg_sat, 'count', 'daily', v_today);
  v_count := v_count + 7;

  -- Admin Assistant (A.6)
  select count(*) into v_tasks_completed
  from public.admin_tasks
  where organization_id = p_organization_id and status = 'completed'
    and updated_at > now() - interval '30 days';

  select count(*) into v_tasks_overdue
  from public.admin_tasks
  where organization_id = p_organization_id
    and status not in ('completed', 'cancelled')
    and due_date is not null and due_date < now();

  select
    count(*) filter (where status = 'accepted'),
    count(*) filter (where status = 'rejected')
  into v_rec_accepted, v_rec_rejected
  from public.admin_assistant_recommendations
  where organization_id = p_organization_id
    and coalesce(resolved_at, created_at) > now() - interval '30 days';

  select count(*) into v_pending_approvals
  from public.ai_action_requests
  where organization_id = p_organization_id and status = 'pending';

  perform public._aie_upsert_metric(p_organization_id, 'admin.tasks_completed_30d', v_tasks_completed, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'admin.tasks_overdue', v_tasks_overdue, 'count', 'snapshot', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'admin.recommendations_accepted_30d', v_rec_accepted, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'admin.recommendations_rejected_30d', v_rec_rejected, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'admin.pending_approvals', v_pending_approvals, 'count', 'snapshot', v_today);
  v_count := v_count + 5;

  -- Knowledge Center (A.5)
  select count(*) into v_published
  from public.knowledge_articles where organization_id = p_organization_id and status = 'published';

  select count(*) into v_drafts
  from public.knowledge_articles where organization_id = p_organization_id and status = 'draft';

  select count(*) into v_stale
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'published'
    and review_due_at is not null and review_due_at < now();

  select count(*) into v_gaps
  from (
    select id from public.support_ai_knowledge_gaps where organization_id = p_organization_id and status = 'open'
    union all
    select id from public.self_support_knowledge_gaps where organization_id = p_organization_id and status = 'open'
  ) g;

  perform public._aie_upsert_metric(p_organization_id, 'knowledge.published_articles', v_published, 'count', 'snapshot', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'knowledge.draft_articles', v_drafts, 'count', 'snapshot', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'knowledge.outdated_articles', v_stale, 'count', 'snapshot', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'knowledge.open_gaps', v_gaps, 'count', 'snapshot', v_today);
  v_count := v_count + 4;

  -- AI recommendations (A.3)
  select
    count(*),
    count(*) filter (where status in ('approved', 'executed')),
    count(*) filter (where status = 'rejected'),
    count(*) filter (where status = 'failed')
  into v_ai_gen, v_ai_accepted, v_ai_rejected, v_ai_failed
  from public.ai_action_requests
  where organization_id = p_organization_id and created_at > now() - interval '30 days';

  perform public._aie_upsert_metric(p_organization_id, 'ai.actions_generated_30d', v_ai_gen, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'ai.actions_accepted_30d', v_ai_accepted, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'ai.actions_rejected_30d', v_ai_rejected, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'ai.actions_failed_30d', v_ai_failed, 'count', 'daily', v_today);
  v_count := v_count + 4;

  -- Integrations (A.8)
  select
    count(*) filter (where status = 'success'),
    count(*) filter (where status = 'failed')
  into v_sync_ok, v_sync_fail
  from public.integration_sync_logs
  where organization_id = p_organization_id and started_at > now() - interval '30 days';

  select count(*) into v_webhook_fail
  from public.integration_webhook_events
  where organization_id = p_organization_id and status = 'failed'
    and created_at > now() - interval '30 days';

  select
    count(*) filter (where status = 'connected' and enabled = true),
    count(*) filter (where status in ('error', 'degraded'))
  into v_int_healthy, v_int_degraded
  from public.organization_integrations
  where organization_id = p_organization_id;

  perform public._aie_upsert_metric(p_organization_id, 'integration.successful_syncs_30d', v_sync_ok, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'integration.failed_syncs_30d', v_sync_fail, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'integration.webhook_failures_30d', v_webhook_fail, 'count', 'daily', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'integration.healthy_count', v_int_healthy, 'count', 'snapshot', v_today);
  perform public._aie_upsert_metric(p_organization_id, 'integration.degraded_count', v_int_degraded, 'count', 'snapshot', v_today);
  v_count := v_count + 5;

  -- Onboarding (A.10)
  select coalesce(completion_percentage, 0) into v_onboard_pct
  from public.organization_onboarding
  where organization_id = p_organization_id;

  perform public._aie_upsert_metric(p_organization_id, 'onboarding.completion_pct', coalesce(v_onboard_pct, 0), 'percentage', 'snapshot', v_today);
  v_count := v_count + 1;

  return jsonb_build_object('metrics_collected', v_count, 'period_date', v_today);
end; $$;

create or replace function public._aie_upsert_insight(
  p_organization_id uuid,
  p_insight_key text,
  p_category text,
  p_title text,
  p_description text,
  p_severity text,
  p_confidence text,
  p_suggested_action text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.analytics_insights (
    organization_id, insight_key, category, title, description,
    severity, confidence, suggested_action, metadata, status
  ) values (
    p_organization_id, p_insight_key, p_category, p_title, p_description,
    p_severity, p_confidence, p_suggested_action, p_metadata, 'active'
  )
  on conflict (organization_id, insight_key) do update set
    title = excluded.title,
    description = excluded.description,
    severity = excluded.severity,
    confidence = excluded.confidence,
    suggested_action = excluded.suggested_action,
    metadata = excluded.metadata,
    updated_at = now(),
    status = case
      when public.analytics_insights.status in ('dismissed', 'resolved') then public.analytics_insights.status
      else 'active'
    end
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._aie_generate_insights(p_organization_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_created int := 0;
  v_open_support int;
  v_avg_first_resp numeric;
  v_prior_first_resp numeric;
  v_pending_approvals int;
  v_gaps int;
  v_sync_fail int; v_sync_total int;
  v_onboard_pct numeric;
  v_onboard_started timestamptz;
  v_neg_sat int;
begin
  select metric_value into v_open_support
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'support.open_cases'
    and measurement_period = 'snapshot'
  order by period_date desc limit 1;

  select metric_value into v_avg_first_resp
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'support.avg_first_response_hours'
    and measurement_period = 'daily'
  order by period_date desc limit 1;

  select coalesce(avg(metric_value), 0) into v_prior_first_resp
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'support.avg_first_response_hours'
    and measurement_period = 'daily'
    and period_date between current_date - 14 and current_date - 8;

  if v_avg_first_resp > 0 and v_prior_first_resp > 0 and v_avg_first_resp > v_prior_first_resp * 1.25 then
    perform public._aie_upsert_insight(
      p_organization_id, 'support_delays_increasing', 'support_performance',
      'Support response times are increasing',
      format('Average first response rose from %s to %s hours over recent periods.', round(v_prior_first_resp, 1), round(v_avg_first_resp, 1)),
      'high', 'high',
      'Review open cases, assign owners, and enable Support AI draft mode for faster initial replies.',
      jsonb_build_object('prior_hours', v_prior_first_resp, 'current_hours', v_avg_first_resp)
    );
    v_created := v_created + 1;
  end if;

  select metric_value into v_pending_approvals
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'admin.pending_approvals'
  order by period_date desc limit 1;

  if coalesce(v_pending_approvals, 0) > 5 then
    perform public._aie_upsert_insight(
      p_organization_id, 'approval_bottleneck', 'approval_workflows',
      'Approval workflow bottleneck detected',
      format('%s AI actions awaiting approval.', v_pending_approvals::int),
      case when v_pending_approvals > 10 then 'critical' else 'high' end, 'high',
      'Review pending actions in Secure AI Actions and adjust policies for low-risk automation.',
      jsonb_build_object('pending_count', v_pending_approvals)
    );
    v_created := v_created + 1;
  end if;

  select metric_value into v_gaps
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'knowledge.open_gaps'
  order by period_date desc limit 1;

  if coalesce(v_gaps, 0) >= 3 then
    perform public._aie_upsert_insight(
      p_organization_id, 'knowledge_gaps_affecting_support', 'knowledge_center',
      'Knowledge gaps may affect support quality',
      format('%s open knowledge gaps from support and self-service.', v_gaps::int),
      'moderate', 'high',
      'Create FAQ articles for top gaps and publish updates in Knowledge Center.',
      jsonb_build_object('gap_count', v_gaps)
    );
    v_created := v_created + 1;
  end if;

  select metric_value into v_sync_fail
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'integration.failed_syncs_30d'
  order by period_date desc limit 1;

  select coalesce(v_sync_fail, 0) + coalesce((
    select metric_value from public.organization_analytics_metrics
    where organization_id = p_organization_id and metric_key = 'integration.successful_syncs_30d'
    order by period_date desc limit 1
  ), 0) into v_sync_total;

  if coalesce(v_sync_fail, 0) >= 3 or (v_sync_total > 0 and v_sync_fail / v_sync_total > 0.2) then
    perform public._aie_upsert_insight(
      p_organization_id, 'integration_instability', 'integration_reliability',
      'Integration sync instability detected',
      format('%s failed syncs in the last 30 days.', coalesce(v_sync_fail, 0)::int),
      case when v_sync_fail >= 5 then 'high' else 'moderate' end, 'moderate',
      'Review integration health in Integration Engine and rotate credentials if needed.',
      jsonb_build_object('failed_syncs', v_sync_fail, 'total_syncs', v_sync_total)
    );
    v_created := v_created + 1;
  end if;

  select completion_percentage, started_at into v_onboard_pct, v_onboard_started
  from public.organization_onboarding
  where organization_id = p_organization_id;

  if v_onboard_started is not null
    and v_onboard_started < now() - interval '14 days'
    and coalesce(v_onboard_pct, 0) < 50 then
    perform public._aie_upsert_insight(
      p_organization_id, 'onboarding_needs_attention', 'onboarding_effectiveness',
      'Onboarding progress below expected pace',
      format('Completion at %s%% after more than 14 days.', round(coalesce(v_onboard_pct, 0), 0)),
      'moderate', 'high',
      'Resume the onboarding checklist and review Knowledge Center recommendations.',
      jsonb_build_object('completion_pct', v_onboard_pct)
    );
    v_created := v_created + 1;
  end if;

  select metric_value into v_neg_sat
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'support.negative_satisfaction_30d'
  order by period_date desc limit 1;

  if coalesce(v_neg_sat, 0) >= 3 then
    perform public._aie_upsert_insight(
      p_organization_id, 'support_satisfaction_declining', 'support_performance',
      'Negative satisfaction trend detected',
      format('%s negative satisfaction ratings in the last 30 days.', v_neg_sat::int),
      'high', 'high',
      'Review recent negative cases and audit Support AI draft quality.',
      jsonb_build_object('negative_count', v_neg_sat)
    );
    v_created := v_created + 1;
  end if;

  return jsonb_build_object('insights_generated', v_created);
end; $$;

create or replace function public._aie_compute_health(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score int := 100;
  v_open_support numeric;
  v_pending_approvals numeric;
  v_int_degraded numeric;
  v_gaps numeric;
  v_status text;
begin
  select coalesce(metric_value, 0) into v_open_support
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'support.open_cases'
  order by period_date desc limit 1;

  select coalesce(metric_value, 0) into v_pending_approvals
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'admin.pending_approvals'
  order by period_date desc limit 1;

  select coalesce(metric_value, 0) into v_int_degraded
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'integration.degraded_count'
  order by period_date desc limit 1;

  select coalesce(metric_value, 0) into v_gaps
  from public.organization_analytics_metrics
  where organization_id = p_organization_id and metric_key = 'knowledge.open_gaps'
  order by period_date desc limit 1;

  v_score := v_score - least(30, (v_open_support * 2)::int);
  v_score := v_score - least(20, (v_pending_approvals * 3)::int);
  v_score := v_score - least(20, (v_int_degraded * 10)::int);
  v_score := v_score - least(15, (v_gaps * 3)::int);
  v_score := greatest(0, v_score);

  v_status := case
    when v_score >= 85 then 'excellent'
    when v_score >= 70 then 'healthy'
    when v_score >= 50 then 'needs_attention'
    else 'critical'
  end;

  return jsonb_build_object(
    'score', v_score,
    'status', v_status,
    'factors', jsonb_build_object(
      'open_support_cases', v_open_support,
      'pending_approvals', v_pending_approvals,
      'degraded_integrations', v_int_degraded,
      'knowledge_gaps', v_gaps
    )
  );
end; $$;

create or replace function public._aie_get_trends(
  p_organization_id uuid,
  p_category text default null,
  p_days int default 30
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_prefix text;
begin
  v_prefix := case p_category
    when 'support_performance' then 'support.'
    when 'admin_assistant' then 'admin.'
    when 'knowledge_center' then 'knowledge.'
    when 'approval_workflows' then 'admin.'
    when 'integration_reliability' then 'integration.'
    when 'ai_recommendations' then 'ai.'
    when 'onboarding_effectiveness' then 'onboarding.'
    else null
  end;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key,
      'metric_type', m.metric_type,
      'period_date', m.period_date,
      'metric_value', m.metric_value
    ) order by m.metric_key, m.period_date)
    from public.organization_analytics_metrics m
    where m.organization_id = p_organization_id
      and m.period_date >= current_date - p_days
      and (v_prefix is null or m.metric_key like v_prefix || '%')
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.refresh_analytics_metrics()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_result jsonb;
begin
  perform public._irp_require_permission('analytics.manage');
  v_org_id := public._mta_require_organization();
  v_result := public._aie_collect_metrics(v_org_id);
  perform public._aie_log(v_org_id, 'analytics_metrics_refreshed', 'analytics', null, v_result);
  return v_result;
end; $$;

create or replace function public.generate_analytics_insights()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_collect jsonb; v_result jsonb;
begin
  perform public._irp_require_permission('analytics.manage');
  v_org_id := public._mta_require_organization();
  v_collect := public._aie_collect_metrics(v_org_id);
  v_result := public._aie_generate_insights(v_org_id);
  perform public._aie_log(v_org_id, 'analytics_insight_generated', 'analytics', null,
    v_result || jsonb_build_object('metrics', v_collect));
  return v_result;
end; $$;

create or replace function public.get_analytics_metrics(
  p_category text default null,
  p_days int default 30
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_role text; v_visible text[];
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._mta_require_organization();
  v_role := public._aie_user_role(v_org_id);
  v_visible := public._aie_visible_categories(v_org_id, v_role);

  if p_category is not null and not (p_category = any(v_visible)) then
    raise exception 'Category not visible for your role';
  end if;

  return jsonb_build_object(
    'metrics', public._aie_get_trends(v_org_id, p_category, p_days),
    'visible_categories', to_jsonb(v_visible)
  );
end; $$;

create or replace function public.get_analytics_insights_list(
  p_status text default 'active',
  p_limit int default 25
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_role text; v_visible text[];
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._mta_require_organization();
  v_role := public._aie_user_role(v_org_id);
  v_visible := public._aie_visible_categories(v_org_id, v_role);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', i.id, 'insight_key', i.insight_key, 'category', i.category,
      'title', i.title, 'description', i.description, 'severity', i.severity,
      'confidence', i.confidence, 'suggested_action', i.suggested_action,
      'status', i.status, 'metadata', i.metadata, 'created_at', i.created_at
    ) order by case i.severity when 'critical' then 0 when 'high' then 1 when 'moderate' then 2 else 3 end, i.created_at desc)
    from public.analytics_insights i
    where i.organization_id = v_org_id
      and i.status = coalesce(nullif(p_status, ''), 'active')
      and i.category = any(v_visible)
    limit p_limit
  ), '[]'::jsonb);
end; $$;

create or replace function public.create_analytics_report(
  p_report_type text default 'weekly',
  p_period_start timestamptz default null,
  p_period_end timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_report public.analytics_reports;
  v_start timestamptz;
  v_end timestamptz;
  v_summary jsonb;
begin
  perform public._irp_require_permission('analytics.export');
  v_org_id := public._mta_require_organization();

  v_end := coalesce(p_period_end, now());
  v_start := coalesce(p_period_start, case p_report_type
    when 'monthly' then v_end - interval '30 days'
    when 'custom' then v_end - interval '7 days'
    else v_end - interval '7 days'
  end);

  perform public._aie_collect_metrics(v_org_id);

  v_summary := jsonb_build_object(
    'report_type', p_report_type,
    'period_start', v_start,
    'period_end', v_end,
    'health', public._aie_compute_health(v_org_id),
    'metrics', public._aie_get_trends(v_org_id, null, 30),
    'insights', public.get_analytics_insights_list('active', 10),
    'privacy_note', 'Summary metadata only — no email, chat, orders, or PII.'
  );

  insert into public.analytics_reports (
    organization_id, report_type, period_start, period_end,
    status, summary_metadata, generated_at, created_by
  ) values (
    v_org_id, p_report_type, v_start, v_end,
    'ready', v_summary, now(), public._mta_app_user_id()
  ) returning * into v_report;

  perform public._aie_log(v_org_id, 'analytics_report_created', 'analytics_report', v_report.id,
    jsonb_build_object('report_type', p_report_type, 'period_start', v_start, 'period_end', v_end));

  return jsonb_build_object(
    'id', v_report.id,
    'report_type', v_report.report_type,
    'status', v_report.status,
    'period_start', v_report.period_start,
    'period_end', v_report.period_end,
    'generated_at', v_report.generated_at
  );
end; $$;

create or replace function public.export_analytics_report(p_report_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_report public.analytics_reports;
begin
  perform public._irp_require_permission('analytics.export');
  v_org_id := public._mta_require_organization();

  select * into v_report from public.analytics_reports
  where id = p_report_id and organization_id = v_org_id;

  if v_report.id is null then
    raise exception 'Report not found';
  end if;

  perform public._aie_log(v_org_id, 'analytics_report_exported', 'analytics_report', v_report.id,
    jsonb_build_object('report_type', v_report.report_type, 'export_format', v_report.export_format));

  return jsonb_build_object(
    'id', v_report.id,
    'report_type', v_report.report_type,
    'export_format', v_report.export_format,
    'period_start', v_report.period_start,
    'period_end', v_report.period_end,
    'generated_at', v_report.generated_at,
    'summary', v_report.summary_metadata,
    'privacy_note', 'Export contains aggregate counts and trends only — no PII.'
  );
end; $$;

create or replace function public.get_analytics_trends(
  p_category text default null,
  p_days int default 30
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._mta_require_organization();
  return public._aie_get_trends(v_org_id, p_category, p_days);
end; $$;

create or replace function public.get_analytics_insights_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
  v_settings public.analytics_settings;
  v_visible text[];
  v_refresh jsonb;
  v_health jsonb;
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._mta_require_organization();
  v_role := public._aie_user_role(v_org_id);
  v_settings := public._aie_ensure_settings(v_org_id);
  v_visible := public._aie_visible_categories(v_org_id, v_role);

  if v_settings.auto_refresh_on_dashboard then
    v_refresh := public._aie_collect_metrics(v_org_id);
    perform public._aie_generate_insights(v_org_id);
  else
    v_refresh := jsonb_build_object('skipped', true);
  end if;

  v_health := public._aie_compute_health(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Operational analytics with actionable insights — tenant-aware, role-aware, and explainable.',
    'safety_note', 'Analytics stores aggregate counts and trends only. No email, chat, orders, or PII.',
    'principles', jsonb_build_array(
      'Tenant-aware analytics',
      'Role-aware visibility',
      'Actionable insights',
      'Historical trend analysis',
      'Explainable recommendations'
    ),
    'user_role', v_role,
    'visible_categories', to_jsonb(v_visible),
    'settings', jsonb_build_object(
      'enabled_categories', v_settings.enabled_categories,
      'retention_days', v_settings.retention_days,
      'auto_refresh_on_dashboard', v_settings.auto_refresh_on_dashboard,
      'scheduled_reports', v_settings.scheduled_reports
    ),
    'last_refresh', v_refresh,
    'organization_health', v_health,
    'kpi_overview', coalesce((
      select jsonb_object_agg(m.metric_key, jsonb_build_object(
        'value', m.metric_value, 'type', m.metric_type, 'period_date', m.period_date
      ))
      from (
        select distinct on (metric_key) metric_key, metric_value, metric_type, period_date
        from public.organization_analytics_metrics
        where organization_id = v_org_id
          and (
            (metric_key like 'support.%' and 'support_performance' = any(v_visible))
            or (metric_key like 'admin.%' and ('admin_assistant' = any(v_visible) or 'approval_workflows' = any(v_visible)))
            or (metric_key like 'knowledge.%' and 'knowledge_center' = any(v_visible))
            or (metric_key like 'ai.%' and 'ai_recommendations' = any(v_visible))
            or (metric_key like 'integration.%' and 'integration_reliability' = any(v_visible))
            or (metric_key like 'onboarding.%' and 'onboarding_effectiveness' = any(v_visible))
          )
        order by metric_key, period_date desc
      ) m
    ), '{}'::jsonb),
    'trends', public._aie_get_trends(v_org_id, null, 14),
    'insights', public.get_analytics_insights_list('active', 15),
    'reports', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'report_type', r.report_type, 'status', r.status,
        'period_start', r.period_start, 'period_end', r.period_end,
        'generated_at', r.generated_at, 'export_format', r.export_format
      ) order by r.created_at desc)
      from public.analytics_reports r
      where r.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'improvement_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'insight_key', i.insight_key, 'title', i.title, 'severity', i.severity,
        'confidence', i.confidence, 'suggested_action', i.suggested_action
      ) order by case i.severity when 'critical' then 0 when 'high' then 1 else 2 end)
      from public.analytics_insights i
      where i.organization_id = v_org_id and i.status = 'active'
        and i.category = any(v_visible)
      limit 5
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_analytics_insights_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_health jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._aie_collect_metrics(v_org_id);
  v_health := public._aie_compute_health(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'health_score', v_health -> 'score',
    'health_status', v_health -> 'status',
    'active_insights', (
      select count(*) from public.analytics_insights
      where organization_id = v_org_id and status = 'active'
    ),
    'metrics_tracked', (
      select count(distinct metric_key) from public.organization_analytics_metrics
      where organization_id = v_org_id
    ),
    'philosophy', 'Operational analytics across your organization.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_analytics_reports_list(p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', r.id, 'report_type', r.report_type, 'status', r.status,
      'period_start', r.period_start, 'period_end', r.period_end,
      'generated_at', r.generated_at, 'export_format', r.export_format,
      'created_at', r.created_at
    ) order by r.created_at desc)
    from public.analytics_reports r
    where r.organization_id = v_org_id
    limit p_limit
  ), '[]'::jsonb);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'analytics_metrics_refreshed', 'analytics_insight_generated', 'analytics_report_created',
    'analytics_report_exported', 'analytics_settings_updated', 'analytics_scheduled_report_created'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._aie_ensure_settings(v_org_id);
    perform public._aie_collect_metrics(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'analytics-insights-engine', 'Analytics & Insights Engine', 'Tenant operational analytics with KPIs, trends, insights, and exportable summary reports.', 'authenticated', 62
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'analytics-insights-engine' and tenant_id is null);

grant execute on function public.refresh_analytics_metrics() to authenticated;
grant execute on function public.generate_analytics_insights() to authenticated;
grant execute on function public.get_analytics_metrics(text, int) to authenticated;
grant execute on function public.get_analytics_insights_list(text, int) to authenticated;
grant execute on function public.create_analytics_report(text, timestamptz, timestamptz) to authenticated;
grant execute on function public.export_analytics_report(uuid) to authenticated;
grant execute on function public.get_analytics_trends(text, int) to authenticated;
grant execute on function public.get_analytics_reports_list(int) to authenticated;
grant execute on function public.get_analytics_insights_engine_dashboard() to authenticated;
grant execute on function public.get_analytics_insights_engine_card() to authenticated;
