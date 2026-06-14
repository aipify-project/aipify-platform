-- Phase A.13 — Quality Guardian Engine
-- Principle: tenant-aware operational quality monitoring with explainable recommendations.

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
    'quality_guardian_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. quality_guardian_settings
-- ---------------------------------------------------------------------------
create table if not exists public.quality_guardian_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  auto_scan_on_dashboard boolean not null default true,
  max_open_support_cases int not null default 10,
  stale_article_days int not null default 90,
  escalation_rate_threshold numeric(5, 2) not null default 0.25,
  approval_backlog_threshold int not null default 5,
  ai_rejection_rate_threshold numeric(5, 2) not null default 0.40,
  negative_satisfaction_threshold int not null default 3,
  onboarding_stall_days int not null default 14,
  onboarding_stall_completion_pct numeric(5, 2) not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quality_guardian_settings enable row level security;
revoke all on public.quality_guardian_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_quality_checks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  check_key text not null,
  category text not null check (
    category in (
      'support_quality', 'knowledge_quality', 'ai_recommendation_quality',
      'approval_workflow', 'integration_reliability', 'onboarding_effectiveness',
      'operational_responsiveness'
    )
  ),
  alert_type text not null check (
    alert_type in (
      'outdated_knowledge', 'repeated_support_failures', 'approval_bottleneck',
      'integration_instability', 'low_customer_satisfaction', 'excessive_escalations',
      'unanswered_conversations', 'unpublished_drafts', 'missing_documentation',
      'ai_rejection_spike', 'failed_ai_executions', 'onboarding_stalled',
      'slow_response_times', 'duplicate_content'
    )
  ),
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  title text not null,
  description text,
  status text not null default 'open' check (
    status in ('open', 'investigating', 'resolved', 'ignored')
  ),
  signal_count int not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, check_key)
);

create index if not exists organization_quality_checks_org_status_idx
  on public.organization_quality_checks (organization_id, status, severity, detected_at desc);

alter table public.organization_quality_checks enable row level security;
revoke all on public.organization_quality_checks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. quality_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.quality_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  quality_check_id uuid references public.organization_quality_checks (id) on delete set null,
  issue_summary text not null,
  business_impact text,
  suggested_resolution text not null,
  urgency text not null default 'moderate' check (
    urgency in ('low', 'moderate', 'high', 'critical')
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected', 'dismissed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quality_recommendations_org_status_idx
  on public.quality_recommendations (organization_id, status, urgency, created_at desc);

alter table public.quality_recommendations enable row level security;
revoke all on public.quality_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'quality_guardian', v.description
from (values
  ('quality.view', 'View Quality Guardian', 'View quality alerts and trends'),
  ('quality.manage', 'Manage Quality Guardian', 'Run quality scans and manage settings'),
  ('quality.resolve', 'Resolve Quality Findings', 'Mark quality findings as resolved'),
  ('quality.ignore', 'Ignore Quality Findings', 'Dismiss quality findings as not applicable')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'quality.view'), ('owner', 'quality.manage'), ('owner', 'quality.resolve'), ('owner', 'quality.ignore'),
  ('administrator', 'quality.view'), ('administrator', 'quality.manage'), ('administrator', 'quality.resolve'), ('administrator', 'quality.ignore'),
  ('manager', 'quality.view'), ('manager', 'quality.resolve'),
  ('support_agent', 'quality.view'),
  ('viewer', 'quality.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_qge_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._qge_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'quality_check',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._qge_ensure_settings(p_organization_id uuid)
returns public.quality_guardian_settings language plpgsql security definer set search_path = public as $$
declare v_row public.quality_guardian_settings;
begin
  insert into public.quality_guardian_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.quality_guardian_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._qge_upsert_check(
  p_organization_id uuid,
  p_check_key text,
  p_category text,
  p_alert_type text,
  p_severity text,
  p_title text,
  p_description text,
  p_signal_count int default 1,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_existing public.organization_quality_checks;
begin
  select * into v_existing
  from public.organization_quality_checks
  where organization_id = p_organization_id and check_key = p_check_key;

  if v_existing.id is not null and v_existing.status in ('resolved', 'ignored') then
    return v_existing.id;
  end if;

  insert into public.organization_quality_checks (
    organization_id, check_key, category, alert_type, severity, title, description,
    signal_count, metadata, detected_at, updated_at
  ) values (
    p_organization_id, p_check_key, p_category, p_alert_type, p_severity, p_title, p_description,
    p_signal_count, p_metadata, now(), now()
  )
  on conflict (organization_id, check_key) do update set
    severity = excluded.severity,
    title = excluded.title,
    description = excluded.description,
    signal_count = excluded.signal_count,
    metadata = excluded.metadata,
    detected_at = now(),
    updated_at = now(),
    status = case
      when public.organization_quality_checks.status = 'investigating' then 'investigating'
      else 'open'
    end
  returning id into v_id;

  if v_existing.id is null then
    perform public._qge_log(p_organization_id, 'quality_alert_created', 'quality_check', v_id,
      jsonb_build_object('check_key', p_check_key, 'category', p_category, 'alert_type', p_alert_type, 'severity', p_severity));
  end if;

  return v_id;
end; $$;

create or replace function public._qge_create_recommendation(
  p_organization_id uuid,
  p_check_id uuid,
  p_summary text,
  p_impact text,
  p_resolution text,
  p_urgency text default 'moderate',
  p_confidence text default 'moderate'
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if exists (
    select 1 from public.quality_recommendations
    where organization_id = p_organization_id
      and quality_check_id = p_check_id
      and status = 'pending'
      and issue_summary = p_summary
  ) then
    select id into v_id from public.quality_recommendations
    where organization_id = p_organization_id and quality_check_id = p_check_id and status = 'pending'
    order by created_at desc limit 1;
    return v_id;
  end if;

  insert into public.quality_recommendations (
    organization_id, quality_check_id, issue_summary, business_impact,
    suggested_resolution, urgency, confidence
  ) values (
    p_organization_id, p_check_id, p_summary, p_impact, p_resolution, p_urgency, p_confidence
  ) returning id into v_id;

  return v_id;
end; $$;

create or replace function public._qge_run_quality_scan(p_organization_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.quality_guardian_settings;
  v_check_id uuid;
  v_created int := 0;
  v_open_support int;
  v_escalated int;
  v_negative_sat int;
  v_stale_articles int;
  v_draft_articles int;
  v_pending_approvals int;
  v_rejected_ai int;
  v_failed_ai int;
  v_total_ai int;
  v_failed_integrations int;
  v_open_gaps int;
  v_unanswered_ss int;
  v_onboarding_pct numeric;
  v_onboarding_started timestamptz;
  v_slow_response int;
  v_rejection_rate numeric;
begin
  v_settings := public._qge_ensure_settings(p_organization_id);

  -- Support: unresolved cases
  select count(*) into v_open_support
  from public.organization_support_cases
  where organization_id = p_organization_id
    and status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal');

  if v_open_support > v_settings.max_open_support_cases then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'support_open_cases', 'support_quality', 'repeated_support_failures', 'high',
      'Elevated open support case count',
      format('%s open support cases exceed the threshold of %s.', v_open_support, v_settings.max_open_support_cases),
      v_open_support, jsonb_build_object('open_cases', v_open_support, 'threshold', v_settings.max_open_support_cases)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Support queue backlog detected',
      'Customers may experience delayed responses and lower satisfaction.',
      'Review open cases, assign owners, and prioritize high-priority tickets.',
      case when v_open_support > v_settings.max_open_support_cases * 2 then 'critical' else 'high' end,
      'high'
    );
    v_created := v_created + 1;
  end if;

  -- Support: excessive escalations
  select count(*) into v_escalated
  from public.organization_support_cases
  where organization_id = p_organization_id
    and escalated_at is not null
    and status not in ('resolved', 'closed')
    and escalated_at > now() - interval '30 days';

  if v_escalated >= 3 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'support_excessive_escalations', 'support_quality', 'excessive_escalations',
      case when v_escalated >= 5 then 'critical' else 'high' end,
      'Repeated support escalations',
      format('%s cases escalated in the last 30 days.', v_escalated),
      v_escalated, jsonb_build_object('escalated_count', v_escalated)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Escalation rate above normal',
      'Repeated escalations suggest knowledge gaps or process friction.',
      'Review escalated cases, update Knowledge Center articles, and adjust Support AI confidence thresholds.',
      'high', 'moderate'
    );
    v_created := v_created + 1;
  end if;

  -- Support: negative satisfaction trend
  select count(*) into v_negative_sat
  from public.support_case_satisfaction
  where organization_id = p_organization_id
    and rating = 'negative'
    and created_at > now() - interval '30 days';

  if v_negative_sat >= v_settings.negative_satisfaction_threshold then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'support_negative_satisfaction', 'support_quality', 'low_customer_satisfaction',
      case when v_negative_sat >= v_settings.negative_satisfaction_threshold * 2 then 'critical' else 'high' end,
      'Negative customer satisfaction trend',
      format('%s negative satisfaction ratings in the last 30 days.', v_negative_sat),
      v_negative_sat, jsonb_build_object('negative_ratings', v_negative_sat)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Customer satisfaction declining',
      'Negative feedback may indicate response quality or resolution issues.',
      'Review recent negative cases, audit AI draft quality, and ensure human follow-up on critical topics.',
      'high', 'high'
    );
    v_created := v_created + 1;
  end if;

  -- Support: slow first response
  select count(*) into v_slow_response
  from public.organization_support_cases
  where organization_id = p_organization_id
    and status in ('new', 'open')
    and first_response_at is null
    and created_at < now() - interval '24 hours';

  if v_slow_response >= 2 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'support_slow_response', 'operational_responsiveness', 'slow_response_times', 'medium',
      'Slow support response times',
      format('%s cases without first response after 24 hours.', v_slow_response),
      v_slow_response, jsonb_build_object('slow_response_count', v_slow_response)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Response time SLA at risk',
      'Delayed first responses reduce customer trust.',
      'Assign cases promptly and enable Support AI draft mode for faster initial replies.',
      'moderate', 'high'
    );
    v_created := v_created + 1;
  end if;

  -- Self-support: unanswered conversations
  select count(*) into v_unanswered_ss
  from public.self_support_conversations
  where organization_id = p_organization_id
    and status = 'active'
    and last_confidence_level = 'low'
    and updated_at < now() - interval '48 hours';

  if v_unanswered_ss >= 1 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'self_support_unanswered', 'support_quality', 'unanswered_conversations', 'medium',
      'Unanswered self-support conversations',
      format('%s active conversations with low confidence and no recent progress.', v_unanswered_ss),
      v_unanswered_ss, jsonb_build_object('unanswered_count', v_unanswered_ss)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Self-support conversations need attention',
      'Users may be waiting without resolution.',
      'Review low-confidence conversations and escalate or publish missing Knowledge Center content.',
      'moderate', 'moderate'
    );
    v_created := v_created + 1;
  end if;

  -- Knowledge: outdated articles
  select count(*) into v_stale_articles
  from public.knowledge_articles
  where organization_id = p_organization_id
    and status = 'published'
    and review_due_at is not null
    and review_due_at < now();

  if v_stale_articles >= 1 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'knowledge_outdated', 'knowledge_quality', 'outdated_knowledge',
      case when v_stale_articles >= 5 then 'high' else 'medium' end,
      'Outdated knowledge articles',
      format('%s published articles are past their review date.', v_stale_articles),
      v_stale_articles, jsonb_build_object('stale_count', v_stale_articles)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Knowledge content needs review',
      'Outdated articles may cause incorrect AI and support responses.',
      'Schedule article reviews in Knowledge Center and publish updated versions.',
      case when v_stale_articles >= 5 then 'high' else 'moderate' end, 'high'
    );
    v_created := v_created + 1;
  end if;

  -- Knowledge: unpublished drafts
  select count(*) into v_draft_articles
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'draft';

  if v_draft_articles >= 5 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'knowledge_unpublished_drafts', 'knowledge_quality', 'unpublished_drafts', 'low',
      'Unpublished knowledge drafts accumulating',
      format('%s draft articles remain unpublished.', v_draft_articles),
      v_draft_articles, jsonb_build_object('draft_count', v_draft_articles)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Draft backlog in Knowledge Center',
      'Unpublished content cannot power Support AI or self-service.',
      'Review and publish high-priority drafts or archive obsolete content.',
      'low', 'moderate'
    );
    v_created := v_created + 1;
  end if;

  -- Knowledge: open gaps
  select count(*) into v_open_gaps
  from (
    select id from public.support_ai_knowledge_gaps where organization_id = p_organization_id and status = 'open'
    union all
    select id from public.self_support_knowledge_gaps where organization_id = p_organization_id and status = 'open'
  ) g;

  if v_open_gaps >= 3 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'knowledge_missing_docs', 'knowledge_quality', 'missing_documentation', 'medium',
      'Knowledge gaps detected',
      format('%s open knowledge gaps from support and self-service.', v_open_gaps),
      v_open_gaps, jsonb_build_object('gap_count', v_open_gaps)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Documentation gaps affecting support quality',
      'Repeated unanswered questions reduce self-service effectiveness.',
      'Create FAQ articles for top knowledge gaps and link them in Support AI settings.',
      'moderate', 'high'
    );
    v_created := v_created + 1;
  end if;

  -- AI: approval backlog
  select count(*) into v_pending_approvals
  from public.ai_action_requests
  where organization_id = p_organization_id and status = 'pending';

  if v_pending_approvals > v_settings.approval_backlog_threshold then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'ai_approval_backlog', 'approval_workflow', 'approval_bottleneck', 'high',
      'AI action approval backlog',
      format('%s pending AI actions exceed threshold of %s.', v_pending_approvals, v_settings.approval_backlog_threshold),
      v_pending_approvals, jsonb_build_object('pending_count', v_pending_approvals)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Approval workflow bottleneck',
      'Delayed approvals slow operational AI execution.',
      'Review pending actions in Secure AI Actions and adjust policies for low-risk automation.',
      'high', 'high'
    );
    v_created := v_created + 1;
  end if;

  -- AI: rejection rate
  select
    count(*) filter (where status = 'rejected'),
    count(*)
  into v_rejected_ai, v_total_ai
  from public.ai_action_requests
  where organization_id = p_organization_id
    and created_at > now() - interval '30 days';

  if v_total_ai >= 5 then
    v_rejection_rate := v_rejected_ai::numeric / v_total_ai::numeric;
    if v_rejection_rate >= v_settings.ai_rejection_rate_threshold then
      v_check_id := public._qge_upsert_check(
        p_organization_id, 'ai_rejection_spike', 'ai_recommendation_quality', 'ai_rejection_spike', 'medium',
        'High AI action rejection rate',
        format('%s%% of AI actions rejected in the last 30 days.', round(v_rejection_rate * 100, 1)),
        v_rejected_ai, jsonb_build_object('rejection_rate', v_rejection_rate, 'rejected', v_rejected_ai, 'total', v_total_ai)
      );
      perform public._qge_create_recommendation(
        p_organization_id, v_check_id,
        'AI recommendations frequently rejected',
        'High rejection rates suggest misaligned suggestions or overly aggressive automation.',
        'Review rejected actions, tune AI action policies, and refine Admin Assistant recommendations.',
        'moderate', 'moderate'
      );
      v_created := v_created + 1;
    end if;
  end if;

  -- AI: failed executions
  select count(*) into v_failed_ai
  from public.ai_action_requests
  where organization_id = p_organization_id
    and status = 'failed'
    and updated_at > now() - interval '30 days';

  if v_failed_ai >= 2 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'ai_failed_executions', 'ai_recommendation_quality', 'failed_ai_executions', 'high',
      'Failed AI action executions',
      format('%s AI actions failed in the last 30 days.', v_failed_ai),
      v_failed_ai, jsonb_build_object('failed_count', v_failed_ai)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'AI execution failures detected',
      'Failed actions may leave operational tasks incomplete.',
      'Inspect failed actions in audit logs and verify integration connectivity.',
      'high', 'high'
    );
    v_created := v_created + 1;
  end if;

  -- Integrations: instability
  select count(*) into v_failed_integrations
  from public.organization_integrations
  where organization_id = p_organization_id and status = 'failed' and enabled;

  if v_failed_integrations >= 1 then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'integration_instability', 'integration_reliability', 'integration_instability',
      case when v_failed_integrations >= 2 then 'critical' else 'high' end,
      'Integration instability detected',
      format('%s integrations in failed state.', v_failed_integrations),
      v_failed_integrations, jsonb_build_object('failed_count', v_failed_integrations)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Integration sync failures',
      'Failed integrations disrupt data flow and AI accuracy.',
      'Review integration health in Integration Engine and rotate credentials if needed.',
      case when v_failed_integrations >= 2 then 'critical' else 'high' end, 'high'
    );
    v_created := v_created + 1;
  end if;

  -- Onboarding: stalled
  select completion_percentage, started_at
  into v_onboarding_pct, v_onboarding_started
  from public.organization_onboarding
  where organization_id = p_organization_id;

  if v_onboarding_started is not null
    and v_onboarding_started < now() - (v_settings.onboarding_stall_days || ' days')::interval
    and coalesce(v_onboarding_pct, 0) < v_settings.onboarding_stall_completion_pct
  then
    v_check_id := public._qge_upsert_check(
      p_organization_id, 'onboarding_stalled', 'onboarding_effectiveness', 'onboarding_stalled', 'medium',
      'Onboarding progress stalled',
      format('Completion at %s%% after %s days.', coalesce(v_onboarding_pct, 0), v_settings.onboarding_stall_days),
      1, jsonb_build_object('completion_pct', v_onboarding_pct, 'started_at', v_onboarding_started)
    );
    perform public._qge_create_recommendation(
      p_organization_id, v_check_id,
      'Customer onboarding needs attention',
      'Incomplete onboarding reduces module adoption and support quality.',
      'Complete remaining checklist items and connect core integrations.',
      'moderate', 'high'
    );
    v_created := v_created + 1;
  end if;

  return jsonb_build_object('checks_evaluated', true, 'new_or_updated', v_created);
end; $$;

create or replace function public._qge_compute_trends(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_open int; v_resolved_week int; v_ignored_week int; v_critical int;
begin
  select count(*) into v_open
  from public.organization_quality_checks
  where organization_id = p_organization_id and status in ('open', 'investigating');

  select count(*) into v_resolved_week
  from public.organization_quality_checks
  where organization_id = p_organization_id and status = 'resolved'
    and resolved_at > now() - interval '7 days';

  select count(*) into v_ignored_week
  from public.organization_quality_checks
  where organization_id = p_organization_id and status = 'ignored'
    and updated_at > now() - interval '7 days';

  select count(*) into v_critical
  from public.organization_quality_checks
  where organization_id = p_organization_id and severity = 'critical'
    and status in ('open', 'investigating');

  return jsonb_build_object(
    'open_checks', v_open,
    'resolved_last_7_days', v_resolved_week,
    'ignored_last_7_days', v_ignored_week,
    'critical_open', v_critical
  );
end; $$;

create or replace function public._qge_high_risk_areas(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'category', c.category,
      'open_count', c.cnt,
      'max_severity', c.max_sev
    ) order by c.sev_ord, c.cnt desc)
    from (
      select
        category,
        count(*) as cnt,
        max(severity) as max_sev,
        min(case severity when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end) as sev_ord
      from public.organization_quality_checks
      where organization_id = p_organization_id and status in ('open', 'investigating')
      group by category
    ) c
  ), '[]'::jsonb);
end; $$;

create or replace function public._qge_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._qge_ensure_settings(p_organization_id);

  perform public._qge_upsert_check(
    p_organization_id, 'demo_knowledge_review', 'knowledge_quality', 'outdated_knowledge', 'medium',
    'Knowledge article review due',
    'One published article is past its scheduled review date.',
    1, jsonb_build_object('demo', true)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.run_quality_scan()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_result jsonb;
begin
  perform public._irp_require_permission('quality.manage');
  v_org_id := public._mta_require_organization();
  v_result := public._qge_run_quality_scan(v_org_id);
  perform public._qge_log(v_org_id, 'quality_scan_executed', 'quality_guardian', null, v_result);
  return v_result;
end; $$;

create or replace function public.resolve_quality_check(p_check_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_check public.organization_quality_checks;
begin
  perform public._irp_require_permission('quality.resolve');
  v_org_id := public._mta_require_organization();

  select * into v_check from public.organization_quality_checks
  where id = p_check_id and organization_id = v_org_id;

  if v_check.id is null then raise exception 'Quality check not found'; end if;

  update public.organization_quality_checks set
    status = 'resolved', resolved_at = now(), updated_at = now()
  where id = p_check_id;

  perform public._qge_log(v_org_id, 'quality_check_resolved', 'quality_check', p_check_id,
    jsonb_build_object('check_key', v_check.check_key, 'category', v_check.category));

  return jsonb_build_object('id', p_check_id, 'status', 'resolved');
end; $$;

create or replace function public.ignore_quality_finding(p_check_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_check public.organization_quality_checks;
begin
  perform public._irp_require_permission('quality.ignore');
  v_org_id := public._mta_require_organization();

  select * into v_check from public.organization_quality_checks
  where id = p_check_id and organization_id = v_org_id;

  if v_check.id is null then raise exception 'Quality check not found'; end if;

  update public.organization_quality_checks set
    status = 'ignored', updated_at = now()
  where id = p_check_id;

  perform public._qge_log(v_org_id, 'quality_finding_ignored', 'quality_check', p_check_id,
    jsonb_build_object('check_key', v_check.check_key, 'category', v_check.category));

  return jsonb_build_object('id', p_check_id, 'status', 'ignored');
end; $$;

create or replace function public.accept_quality_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_rec public.quality_recommendations;
begin
  perform public._irp_require_permission('quality.resolve');
  v_org_id := public._mta_require_organization();

  select * into v_rec from public.quality_recommendations
  where id = p_recommendation_id and organization_id = v_org_id;

  if v_rec.id is null then raise exception 'Recommendation not found'; end if;

  update public.quality_recommendations set status = 'accepted', updated_at = now()
  where id = p_recommendation_id;

  if v_rec.quality_check_id is not null then
    update public.organization_quality_checks set status = 'investigating', updated_at = now()
    where id = v_rec.quality_check_id and status = 'open';
  end if;

  perform public._qge_log(v_org_id, 'quality_recommendation_accepted', 'quality_recommendation', p_recommendation_id,
    jsonb_build_object('urgency', v_rec.urgency, 'confidence', v_rec.confidence));

  return jsonb_build_object('id', p_recommendation_id, 'status', 'accepted');
end; $$;

create or replace function public.reject_quality_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_rec public.quality_recommendations;
begin
  perform public._irp_require_permission('quality.manage');
  v_org_id := public._mta_require_organization();

  select * into v_rec from public.quality_recommendations
  where id = p_recommendation_id and organization_id = v_org_id;

  if v_rec.id is null then raise exception 'Recommendation not found'; end if;

  update public.quality_recommendations set status = 'rejected', updated_at = now()
  where id = p_recommendation_id;

  perform public._qge_log(v_org_id, 'quality_recommendation_rejected', 'quality_recommendation', p_recommendation_id,
    jsonb_build_object('urgency', v_rec.urgency));

  return jsonb_build_object('id', p_recommendation_id, 'status', 'rejected');
end; $$;

create or replace function public.get_quality_guardian_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.quality_guardian_settings;
  v_scan jsonb;
begin
  perform public._irp_require_permission('quality.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._qge_ensure_settings(v_org_id);

  if v_settings.auto_scan_on_dashboard then
    v_scan := public._qge_run_quality_scan(v_org_id);
  else
    v_scan := jsonb_build_object('skipped', true);
  end if;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Continuous operational quality monitoring — proactive detection, explainable recommendations, and audit-supported accountability.',
    'safety_note', 'Quality Guardian aggregates metadata from support, knowledge, AI, integrations, and onboarding. No raw customer content is stored in quality tables.',
    'principles', jsonb_build_array(
      'Tenant-aware monitoring',
      'Proactive issue detection',
      'Explainable recommendations',
      'Continuous improvement',
      'Audit-supported accountability'
    ),
    'settings', jsonb_build_object(
      'auto_scan_on_dashboard', v_settings.auto_scan_on_dashboard,
      'max_open_support_cases', v_settings.max_open_support_cases,
      'approval_backlog_threshold', v_settings.approval_backlog_threshold
    ),
    'last_scan', v_scan,
    'trends', public._qge_compute_trends(v_org_id),
    'high_risk_areas', public._qge_high_risk_areas(v_org_id),
    'active_checks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'check_key', c.check_key, 'category', c.category, 'alert_type', c.alert_type,
        'severity', c.severity, 'title', c.title, 'description', c.description, 'status', c.status,
        'signal_count', c.signal_count, 'detected_at', c.detected_at, 'metadata', c.metadata
      ) order by case c.severity when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, c.detected_at desc)
      from public.organization_quality_checks c
      where c.organization_id = v_org_id and c.status in ('open', 'investigating') limit 20
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'quality_check_id', r.quality_check_id, 'issue_summary', r.issue_summary,
        'business_impact', r.business_impact, 'suggested_resolution', r.suggested_resolution,
        'urgency', r.urgency, 'confidence', r.confidence, 'status', r.status, 'created_at', r.created_at
      ) order by case r.urgency when 'critical' then 0 when 'high' then 1 when 'moderate' then 2 else 3 end, r.created_at desc)
      from public.quality_recommendations r
      where r.organization_id = v_org_id and r.status = 'pending' limit 15
    ), '[]'::jsonb),
    'recently_resolved', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'category', c.category, 'severity', c.severity,
        'resolved_at', c.resolved_at
      ) order by c.resolved_at desc)
      from public.organization_quality_checks c
      where c.organization_id = v_org_id and c.status = 'resolved'
        and c.resolved_at > now() - interval '30 days' limit 10
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_quality_guardian_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_checks', (
      select count(*) from public.organization_quality_checks
      where organization_id = v_org_id and status in ('open', 'investigating')
    ),
    'critical_checks', (
      select count(*) from public.organization_quality_checks
      where organization_id = v_org_id and severity = 'critical' and status in ('open', 'investigating')
    ),
    'pending_recommendations', (
      select count(*) from public.quality_recommendations
      where organization_id = v_org_id and status = 'pending'
    ),
    'philosophy', 'Operational quality monitoring across your organization.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
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
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._qge_ensure_settings(v_org_id);
    perform public._qge_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-guardian-engine', 'Quality Guardian Engine', 'Operational quality monitoring with explainable recommendations across support, knowledge, AI, and integrations.', 'authenticated', 61
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-guardian-engine' and tenant_id is null);

grant execute on function public.run_quality_scan() to authenticated;
grant execute on function public.resolve_quality_check(uuid) to authenticated;
grant execute on function public.ignore_quality_finding(uuid) to authenticated;
grant execute on function public.accept_quality_recommendation(uuid) to authenticated;
grant execute on function public.reject_quality_recommendation(uuid) to authenticated;
grant execute on function public.get_quality_guardian_engine_dashboard() to authenticated;
grant execute on function public.get_quality_guardian_engine_card() to authenticated;
