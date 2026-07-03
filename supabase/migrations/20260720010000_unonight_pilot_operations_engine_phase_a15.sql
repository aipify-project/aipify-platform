-- Phase A.15 — Unonight Pilot Operations Engine
-- Principle: validate A-phase modules with first pilot customer — metadata-only metrics, tenant-scoped.

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
    'quality_guardian_engine', 'unonight_pilot_operations_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. pilot_metrics (metadata counts only — no raw customer content)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  measurement_period text not null default '30d' check (
    measurement_period in ('daily', 'weekly', '30d', '90d', 'pilot_lifetime')
  ),
  created_at timestamptz not null default now()
);

create index if not exists pilot_metrics_org_key_idx
  on public.pilot_metrics (organization_id, metric_key, measurement_period, created_at desc);

alter table public.pilot_metrics enable row level security;
revoke all on public.pilot_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. pilot_feedback (metadata summaries only — no raw PII)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_feedback (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  feedback_type text not null check (
    feedback_type in (
      'support_quality', 'admin_assistant', 'knowledge_center', 'approval_workflow',
      'integration_stability', 'overall_satisfaction', 'recommendation_outcome'
    )
  ),
  source text not null default 'dashboard' check (
    source in ('dashboard', 'support_ai', 'admin_assistant', 'integration', 'manual', 'survey')
  ),
  rating int check (rating between 1 and 5),
  comment_summary text,
  submitted_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint pilot_feedback_summary_len check (
    comment_summary is null or char_length(comment_summary) <= 500
  )
);

create index if not exists pilot_feedback_org_idx
  on public.pilot_feedback (organization_id, feedback_type, created_at desc);

alter table public.pilot_feedback enable row level security;
revoke all on public.pilot_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. pilot_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  milestone_key text not null,
  title text not null,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'blocked')
  ),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, milestone_key)
);

create index if not exists pilot_milestones_org_status_idx
  on public.pilot_milestones (organization_id, status, created_at);

alter table public.pilot_milestones enable row level security;
revoke all on public.pilot_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. unonight_pilot_config (org-specific pilot configuration)
-- ---------------------------------------------------------------------------
create table if not exists public.unonight_pilot_config (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  pilot_status text not null default 'active' check (
    pilot_status in ('pending', 'active', 'paused', 'completed')
  ),
  organization_type text not null default 'pilot_customer',
  health_status text not null default 'healthy' check (
    health_status in ('excellent', 'healthy', 'needs_attention', 'critical')
  ),
  module_flags jsonb not null default '{
    "admin_assistant": true,
    "support_ai": true,
    "knowledge_center": true,
    "audit_log": true,
    "operations_dashboard": true,
    "governance_engine": true,
    "quality_guardian": true,
    "integration_engine": true
  }'::jsonb,
  pilot_objectives jsonb not null default '[
    "support_ai", "admin_assistant", "knowledge_center", "approval_workflows",
    "audit_logging", "integration_stability", "quality_monitoring"
  ]'::jsonb,
  last_health_check_at timestamptz,
  provisioned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.unonight_pilot_config enable row level security;
revoke all on public.unonight_pilot_config from authenticated, anon;

-- Fix revoke on pilot_milestones (typo above used pilot_feedback twice)
revoke all on public.pilot_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'unonight_pilot', v.description
from (values
  ('pilot.view', 'View Pilot Operations', 'View Unonight pilot dashboard and metrics'),
  ('pilot.manage', 'Manage Pilot Operations', 'Update milestones and record pilot metrics'),
  ('pilot.feedback', 'Submit Pilot Feedback', 'Submit pilot feedback and satisfaction ratings'),
  ('pilot.configure', 'Configure Pilot', 'Provision and configure pilot modules and settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'pilot.view'), ('owner', 'pilot.manage'), ('owner', 'pilot.feedback'), ('owner', 'pilot.configure'),
  ('administrator', 'pilot.view'), ('administrator', 'pilot.manage'), ('administrator', 'pilot.feedback'), ('administrator', 'pilot.configure'),
  ('manager', 'pilot.view'), ('manager', 'pilot.feedback'),
  ('support_agent', 'pilot.view'), ('support_agent', 'pilot.feedback'),
  ('viewer', 'pilot.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- Extend internal plan modules for pilot engines
insert into public.plan_modules (plan_key, module_key, enabled)
select v.plan, v.module, true
from (values
  ('internal', 'customer_onboarding_engine'),
  ('internal', 'aipify_self_support_engine'),
  ('internal', 'quality_guardian_engine'),
  ('internal', 'unonight_pilot_operations_engine')
) as v(plan, module)
where not exists (
  select 1 from public.plan_modules pm where pm.plan_key = v.plan and pm.module_key = v.module
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_upo_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._upo_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'unonight_pilot',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._upo_org_id_by_slug(p_slug text default 'unonight')
returns uuid language sql stable security definer set search_path = public as $$
  select o.id from public.organizations o where o.slug = p_slug limit 1;
$$;

create or replace function public._upo_is_pilot_org(p_organization_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organizations o
    where o.id = p_organization_id
      and (
        o.slug = 'unonight'
        or exists (
          select 1 from public.unonight_pilot_config c
          where c.organization_id = o.id and c.pilot_status in ('active', 'paused')
        )
      )
  );
$$;

create or replace function public._upo_require_pilot_org(p_organization_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization(p_organization_id);
  if not public._upo_is_pilot_org(v_org_id) then
    raise exception 'Pilot operations are only available for active pilot organizations';
  end if;
  return v_org_id;
end; $$;

create or replace function public._upo_ensure_config(p_organization_id uuid)
returns public.unonight_pilot_config language plpgsql security definer set search_path = public as $$
declare v_row public.unonight_pilot_config;
begin
  insert into public.unonight_pilot_config (organization_id, pilot_status, provisioned_at)
  values (p_organization_id, 'active', now())
  on conflict (organization_id) do nothing;

  select * into v_row from public.unonight_pilot_config where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._upo_seed_milestones(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.pilot_milestones (organization_id, milestone_key, title, status)
  select p_organization_id, v.key, v.title, v.status
  from (values
    ('support_pilot_started', 'Support AI pilot — receive inquiries and measure efficiency', 'in_progress'),
    ('admin_pilot_started', 'Admin Assistant pilot — since-last-login and task recommendations', 'in_progress'),
    ('knowledge_pilot_started', 'Knowledge Center pilot — docs, gaps, and FAQ improvements', 'pending'),
    ('quality_pilot_started', 'Quality Guardian pilot — recurring issues and bottlenecks', 'pending'),
    ('integration_connected', 'Unonight integration connected and stable', 'pending'),
    ('approval_workflow_validated', 'Approval workflows validated with audit trail', 'pending'),
    ('audit_logging_validated', 'Audit logging verified across pilot modules', 'pending'),
    ('ai_recommendation_acceptance', 'AI recommendation acceptance baseline established', 'pending'),
    ('kc_utilization_target', 'Knowledge Center utilization target reached', 'pending'),
    ('administrator_satisfaction', 'Administrator satisfaction baseline recorded', 'pending'),
    ('pilot_go_live', 'Pilot go-live readiness confirmed', 'pending')
  ) as v(key, title, status)
  on conflict (organization_id, milestone_key) do nothing;
end; $$;

create or replace function public._upo_enable_pilot_modules(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.organization_modules set enabled = true, updated_at = now()
  where organization_id = p_organization_id
    and module_key in (
      'admin_assistant', 'support_ai', 'knowledge_center', 'audit_log',
      'integrations', 'operations_center'
    );

  insert into public.organization_modules (organization_id, module_key, enabled, plan_required)
  select p_organization_id, v.key, true, 'internal'
  from (values
    ('admin_assistant'), ('support_ai'), ('knowledge_center'), ('audit_log'),
    ('integrations'), ('operations_center')
  ) as v(key)
  on conflict (organization_id, module_key) do update set enabled = true, updated_at = now();

  if exists (select 1 from pg_proc where proname = '_spm_sync_tenant_modules') then
    perform public._spm_sync_tenant_modules(p_organization_id);
  end if;

  update public.tenant_modules set enabled = true, licensed = true, status = 'enabled', updated_at = now()
  where tenant_id = p_organization_id
    and module_key in (
      'admin_assistant_engine', 'support_ai_engine', 'knowledge_center_engine',
      'operations_dashboard_engine', 'integration_engine', 'quality_guardian_engine',
      'customer_onboarding_engine', 'aipify_self_support_engine', 'unonight_pilot_operations_engine'
    );
end; $$;

create or replace function public._upo_aggregate_module_metrics(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_open_support int := 0;
  v_resolved_support int := 0;
  v_escalated int := 0;
  v_avg_response_hours numeric := 0;
  v_pending_tasks int := 0;
  v_pending_recommendations int := 0;
  v_accepted_recommendations int := 0;
  v_rejected_recommendations int := 0;
  v_published_articles int := 0;
  v_kc_gaps int := 0;
  v_pending_approvals int := 0;
  v_audit_events_30d int := 0;
  v_failed_integrations int := 0;
  v_connected_integrations int := 0;
  v_open_quality int := 0;
  v_pending_quality_recs int := 0;
  v_self_support_active int := 0;
  v_onboarding_pct numeric := 0;
  v_support_ai_acceptance numeric := 0;
begin
  select count(*) into v_open_support
  from public.organization_support_cases
  where organization_id = p_organization_id and status not in ('resolved', 'closed');

  select count(*) into v_resolved_support
  from public.organization_support_cases
  where organization_id = p_organization_id and status in ('resolved', 'closed')
    and updated_at > now() - interval '30 days';

  select count(*) into v_escalated
  from public.organization_support_cases
  where organization_id = p_organization_id and escalated_at is not null
    and escalated_at > now() - interval '30 days';

  select coalesce(avg(extract(epoch from (first_response_at - created_at)) / 3600), 0)
  into v_avg_response_hours
  from public.organization_support_cases
  where organization_id = p_organization_id and first_response_at is not null
    and created_at > now() - interval '30 days';

  select count(*) into v_pending_tasks
  from public.admin_tasks
  where organization_id = p_organization_id and status in ('pending', 'in_progress');

  select count(*) into v_pending_recommendations
  from public.admin_assistant_recommendations
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_accepted_recommendations
  from public.admin_assistant_recommendations
  where organization_id = p_organization_id and status = 'accepted'
    and updated_at > now() - interval '30 days';

  select count(*) into v_rejected_recommendations
  from public.admin_assistant_recommendations
  where organization_id = p_organization_id and status = 'rejected'
    and updated_at > now() - interval '30 days';

  select count(*) into v_published_articles
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'published';

  select count(*) into v_kc_gaps
  from public.support_ai_knowledge_gaps
  where organization_id = p_organization_id and status = 'open';

  select count(*) into v_pending_approvals
  from public.ai_action_requests
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_audit_events_30d
  from public.audit_logs
  where organization_id = p_organization_id and created_at > now() - interval '30 days';

  select count(*) into v_failed_integrations
  from public.organization_integrations
  where organization_id = p_organization_id and enabled and status = 'failed';

  select count(*) into v_connected_integrations
  from public.organization_integrations
  where organization_id = p_organization_id and enabled and status in ('active', 'connected');

  select count(*) into v_open_quality
  from public.organization_quality_checks
  where organization_id = p_organization_id and status in ('open', 'investigating');

  select count(*) into v_pending_quality_recs
  from public.quality_recommendations
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_self_support_active
  from public.self_support_conversations
  where organization_id = p_organization_id and status = 'active';

  select coalesce(completion_percentage, 0) into v_onboarding_pct
  from public.organization_onboarding where organization_id = p_organization_id;

  select coalesce(
    round(
      count(*) filter (where r.response_mode = 'automatic' and r.status = 'sent')::numeric
      / nullif(count(*)::numeric, 0) * 100, 1
    ), 0
  ) into v_support_ai_acceptance
  from public.support_ai_responses r
  where r.organization_id = p_organization_id and r.created_at > now() - interval '30 days';

  return jsonb_build_object(
    'support', jsonb_build_object(
      'open_cases', v_open_support,
      'resolved_30d', v_resolved_support,
      'escalations_30d', v_escalated,
      'avg_first_response_hours', round(v_avg_response_hours, 2),
      'ai_acceptance_rate_pct', v_support_ai_acceptance
    ),
    'admin_assistant', jsonb_build_object(
      'pending_tasks', v_pending_tasks,
      'pending_recommendations', v_pending_recommendations,
      'accepted_recommendations_30d', v_accepted_recommendations,
      'rejected_recommendations_30d', v_rejected_recommendations
    ),
    'knowledge_center', jsonb_build_object(
      'published_articles', v_published_articles,
      'open_gaps', v_kc_gaps,
      'utilization_proxy', v_published_articles
    ),
    'governance', jsonb_build_object(
      'pending_approvals', v_pending_approvals,
      'audit_events_30d', v_audit_events_30d
    ),
    'integrations', jsonb_build_object(
      'connected', v_connected_integrations,
      'failed', v_failed_integrations
    ),
    'quality', jsonb_build_object(
      'open_checks', v_open_quality,
      'pending_recommendations', v_pending_quality_recs
    ),
    'self_support', jsonb_build_object(
      'active_conversations', v_self_support_active
    ),
    'onboarding', jsonb_build_object(
      'completion_pct', v_onboarding_pct
    )
  );
end; $$;

create or replace function public._upo_compute_health(p_organization_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_metrics jsonb;
  v_score int := 100;
  v_status text := 'excellent';
  v_open_support int;
  v_failed_integrations int;
  v_pending_approvals int;
  v_open_quality int;
  v_milestones_done int;
  v_milestones_total int;
  v_unonight_connected boolean := false;
begin
  v_metrics := public._upo_aggregate_module_metrics(p_organization_id);

  v_open_support := (v_metrics->'support'->>'open_cases')::int;
  v_failed_integrations := (v_metrics->'integrations'->>'failed')::int;
  v_pending_approvals := (v_metrics->'governance'->>'pending_approvals')::int;
  v_open_quality := (v_metrics->'quality'->>'open_checks')::int;

  if v_open_support > 10 then v_score := v_score - 15;
  elsif v_open_support > 5 then v_score := v_score - 8;
  end if;

  if v_failed_integrations >= 2 then v_score := v_score - 20;
  elsif v_failed_integrations = 1 then v_score := v_score - 10;
  end if;

  if v_pending_approvals > 10 then v_score := v_score - 12;
  elsif v_pending_approvals > 5 then v_score := v_score - 6;
  end if;

  if v_open_quality > 5 then v_score := v_score - 10;
  elsif v_open_quality > 2 then v_score := v_score - 5;
  end if;

  select count(*) filter (where status = 'completed'), count(*)
  into v_milestones_done, v_milestones_total
  from public.pilot_milestones where organization_id = p_organization_id;

  if v_milestones_total > 0 and v_milestones_done::numeric / v_milestones_total < 0.3 then
    v_score := v_score - 8;
  end if;

  select exists (
    select 1 from public.organization_integrations
    where organization_id = p_organization_id and integration_key = 'unonight' and enabled
  ) into v_unonight_connected;

  if not v_unonight_connected then v_score := v_score - 10; end if;

  v_score := greatest(0, least(100, v_score));

  v_status := case
    when v_score >= 90 then 'excellent'
    when v_score >= 75 then 'healthy'
    when v_score >= 55 then 'needs_attention'
    else 'critical'
  end;

  update public.unonight_pilot_config set
    health_status = v_status,
    last_health_check_at = now(),
    updated_at = now()
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'score', v_score,
    'status', v_status,
    'factors', jsonb_build_object(
      'open_support_cases', v_open_support,
      'failed_integrations', v_failed_integrations,
      'pending_approvals', v_pending_approvals,
      'open_quality_checks', v_open_quality,
      'milestones_completed', v_milestones_done,
      'milestones_total', v_milestones_total,
      'unonight_integration_connected', v_unonight_connected
    ),
    'module_metrics', v_metrics
  );
end; $$;

create or replace function public._upo_snapshot_success_metrics(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._upo_aggregate_module_metrics(p_organization_id);

  insert into public.pilot_metrics (organization_id, metric_key, metric_value, measurement_period)
  values
    (p_organization_id, 'support_open_cases', (v_metrics->'support'->>'open_cases')::numeric, '30d'),
    (p_organization_id, 'support_resolved_30d', (v_metrics->'support'->>'resolved_30d')::numeric, '30d'),
    (p_organization_id, 'support_avg_response_hours', (v_metrics->'support'->>'avg_first_response_hours')::numeric, '30d'),
    (p_organization_id, 'ai_recommendation_acceptance_pct', (v_metrics->'support'->>'ai_acceptance_rate_pct')::numeric, '30d'),
    (p_organization_id, 'kc_published_articles', (v_metrics->'knowledge_center'->>'published_articles')::numeric, '30d'),
    (p_organization_id, 'pending_approvals', (v_metrics->'governance'->>'pending_approvals')::numeric, '30d'),
    (p_organization_id, 'admin_recommendations_accepted_30d', (v_metrics->'admin_assistant'->>'accepted_recommendations_30d')::numeric, '30d');
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Pilot RPCs
-- ---------------------------------------------------------------------------
create or replace function public._upo_provision_unonight_pilot_internal()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_config public.unonight_pilot_config;
  v_integration jsonb;
begin
  v_org_id := public._upo_org_id_by_slug('unonight');

  if v_org_id is null then
    v_org_id := public._mta_provision_organization(
      'Unonight', 'unonight', 'internal', 'active', 'pilot@unonight.com'
    );
  else
    update public.organizations set
      name = 'Unonight',
      subscription_plan = 'internal',
      status = 'active',
      updated_at = now()
    where id = v_org_id;
  end if;

  perform public._upo_enable_pilot_modules(v_org_id);
  v_config := public._upo_ensure_config(v_org_id);
  perform public._upo_seed_milestones(v_org_id);

  update public.unonight_pilot_config set
    pilot_status = 'active',
    organization_type = 'pilot_customer',
    provisioned_at = coalesce(provisioned_at, now()),
    module_flags = '{
      "admin_assistant": true,
      "support_ai": true,
      "knowledge_center": true,
      "audit_log": true,
      "operations_dashboard": true,
      "governance_engine": true,
      "quality_guardian": true,
      "integration_engine": true
    }'::jsonb,
    updated_at = now()
  where organization_id = v_org_id;

  if exists (select 1 from pg_proc where proname = 'connect_unonight_integration') then
    v_integration := public.connect_unonight_integration('{"provisioned_by":"unonight_pilot_operations_engine"}'::jsonb);
  end if;

  perform public._upo_compute_health(v_org_id);
  perform public._upo_snapshot_success_metrics(v_org_id);

  perform public._upo_log(v_org_id, 'pilot_provisioned', 'unonight_pilot', v_config.id,
    jsonb_build_object('slug', 'unonight', 'plan', 'internal', 'integration', coalesce(v_integration, '{}'::jsonb)));

  perform public._upo_log(v_org_id, 'pilot_module_activated', 'unonight_pilot', v_config.id,
    jsonb_build_object('modules', (select module_flags from public.unonight_pilot_config where organization_id = v_org_id)));

  return jsonb_build_object(
    'organization_id', v_org_id,
    'slug', 'unonight',
    'subscription_plan', 'internal',
    'pilot_status', 'active',
    'health_status', (select health_status from public.unonight_pilot_config where organization_id = v_org_id),
    'integration', coalesce(v_integration, '{}'::jsonb),
    'milestones_seeded', (select count(*) from public.pilot_milestones where organization_id = v_org_id)
  );
end; $$;

create or replace function public.provision_unonight_pilot()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    perform public._irp_require_permission('pilot.configure');
  end if;
  return public._upo_provision_unonight_pilot_internal();
end; $$;

create or replace function public.record_pilot_metric(
  p_metric_key text,
  p_metric_value numeric,
  p_measurement_period text default '30d'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('pilot.manage');
  v_org_id := public._upo_require_pilot_org();

  insert into public.pilot_metrics (organization_id, metric_key, metric_value, measurement_period)
  values (v_org_id, p_metric_key, p_metric_value, p_measurement_period)
  returning id into v_id;

  perform public._upo_log(v_org_id, 'pilot_metric_recorded', 'pilot_metric', v_id,
    jsonb_build_object('metric_key', p_metric_key, 'metric_value', p_metric_value, 'period', p_measurement_period));

  return jsonb_build_object('id', v_id, 'metric_key', p_metric_key, 'metric_value', p_metric_value);
end; $$;

create or replace function public.submit_pilot_feedback(
  p_feedback_type text,
  p_source text default 'dashboard',
  p_rating int default null,
  p_comment_summary text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('pilot.feedback');
  v_org_id := public._upo_require_pilot_org();

  if p_comment_summary is not null and char_length(p_comment_summary) > 500 then
    raise exception 'Comment summary must be 500 characters or less';
  end if;

  insert into public.pilot_feedback (
    organization_id, feedback_type, source, rating, comment_summary, submitted_by
  ) values (
    v_org_id, p_feedback_type, p_source, p_rating, p_comment_summary, public._mta_app_user_id()
  ) returning id into v_id;

  perform public._upo_log(v_org_id, 'pilot_feedback_submitted', 'pilot_feedback', v_id,
    jsonb_build_object('feedback_type', p_feedback_type, 'source', p_source, 'rating', p_rating));

  return jsonb_build_object('id', v_id, 'feedback_type', p_feedback_type, 'rating', p_rating);
end; $$;

create or replace function public.update_pilot_milestone(
  p_milestone_key text,
  p_status text default 'completed'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.pilot_milestones;
begin
  perform public._irp_require_permission('pilot.manage');
  v_org_id := public._upo_require_pilot_org();

  update public.pilot_milestones set
    status = p_status,
    completed_at = case when p_status = 'completed' then now() else completed_at end
  where organization_id = v_org_id and milestone_key = p_milestone_key
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Milestone not found: %', p_milestone_key;
  end if;

  perform public._upo_log(v_org_id, 'pilot_milestone_updated', 'pilot_milestone', v_row.id,
    jsonb_build_object('milestone_key', p_milestone_key, 'status', p_status));

  perform public._upo_compute_health(v_org_id);

  return jsonb_build_object('id', v_row.id, 'milestone_key', p_milestone_key, 'status', p_status);
end; $$;

create or replace function public.get_pilot_health(p_organization_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('pilot.view');
  v_org_id := public._upo_require_pilot_org(p_organization_id);
  return public._upo_compute_health(v_org_id);
end; $$;

create or replace function public.get_unonight_pilot_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_config public.unonight_pilot_config;
  v_health jsonb;
  v_org public.organizations;
  v_avg_feedback numeric;
  v_unonight_integration jsonb;
begin
  perform public._irp_require_permission('pilot.view');
  v_org_id := public._upo_require_pilot_org();
  v_config := public._upo_ensure_config(v_org_id);
  v_health := public._upo_compute_health(v_org_id);
  select * into v_org from public.organizations where id = v_org_id;

  select coalesce(avg(rating), 0) into v_avg_feedback
  from public.pilot_feedback
  where organization_id = v_org_id and rating is not null
    and created_at > now() - interval '90 days';

  select jsonb_build_object(
    'connected', enabled and status in ('active', 'connected'),
    'status', status,
    'last_sync_at', last_sync_at
  ) into v_unonight_integration
  from public.organization_integrations
  where organization_id = v_org_id and integration_key = 'unonight'
  limit 1;

  return jsonb_build_object(
    'has_organization', true,
    'is_unonight_pilot', v_org.slug = 'unonight',
    'philosophy', 'Unonight validates Aipify as an independent SaaS platform — learnings strengthen the product without coupling systems.',
    'safety_note', 'Pilot metrics store counts and metadata only. No customer email, chat, or order content is retained in pilot tables.',
    'principles', jsonb_build_array(
      'Unonight is a customer — not the platform owner',
      'Aipify improvements ship centrally',
      'Pilot learnings strengthen the SaaS platform',
      'Metadata-only measurement',
      'Full audit accountability'
    ),
    'organization', jsonb_build_object(
      'id', v_org.id,
      'name', v_org.name,
      'slug', v_org.slug,
      'subscription_plan', v_org.subscription_plan,
      'status', v_org.status
    ),
    'config', jsonb_build_object(
      'pilot_status', v_config.pilot_status,
      'organization_type', v_config.organization_type,
      'health_status', v_config.health_status,
      'module_flags', v_config.module_flags,
      'pilot_objectives', v_config.pilot_objectives,
      'last_health_check_at', v_config.last_health_check_at,
      'provisioned_at', v_config.provisioned_at
    ),
    'pilot_health', v_health,
    'support_improvements', v_health->'module_metrics'->'support',
    'recommendation_outcomes', jsonb_build_object(
      'admin_assistant', v_health->'module_metrics'->'admin_assistant',
      'quality', v_health->'module_metrics'->'quality',
      'support_ai_acceptance_pct', v_health->'module_metrics'->'support'->'ai_acceptance_rate_pct'
    ),
    'unresolved_issues', coalesce((
      select jsonb_agg(issue order by issue->>'severity' desc)
      from (
        select jsonb_build_object(
          'type', 'support_case', 'severity', case priority when 'urgent' then 4 when 'high' then 3 else 2 end,
          'title', title, 'status', status, 'id', id
        ) as issue
        from public.organization_support_cases
        where organization_id = v_org_id and status not in ('resolved', 'closed')
        union all
        select jsonb_build_object(
          'type', 'quality_check', 'severity', case severity when 'critical' then 4 when 'high' then 3 else 2 end,
          'title', title, 'status', status, 'id', id
        )
        from public.organization_quality_checks
        where organization_id = v_org_id and status in ('open', 'investigating')
        union all
        select jsonb_build_object(
          'type', 'self_support', 'severity', 2,
          'title', subject, 'status', status, 'id', id
        )
        from public.self_support_conversations
        where organization_id = v_org_id and status in ('active', 'escalated')
      ) sub
      limit 15
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'milestone_key', m.milestone_key, 'title', m.title,
        'status', m.status, 'completed_at', m.completed_at, 'created_at', m.created_at
      ) order by case m.status when 'completed' then 1 when 'in_progress' then 0 else 2 end, m.created_at)
      from public.pilot_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'recent_metrics', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pm.id, 'metric_key', pm.metric_key, 'metric_value', pm.metric_value,
        'measurement_period', pm.measurement_period, 'created_at', pm.created_at
      ) order by pm.created_at desc)
      from public.pilot_metrics pm
      where pm.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'recent_feedback', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'feedback_type', f.feedback_type, 'source', f.source,
        'rating', f.rating, 'comment_summary', f.comment_summary, 'created_at', f.created_at
      ) order by f.created_at desc)
      from public.pilot_feedback f
      where f.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'administrator_satisfaction', jsonb_build_object(
      'avg_rating_90d', round(v_avg_feedback, 2),
      'feedback_count_90d', (select count(*) from public.pilot_feedback where organization_id = v_org_id and created_at > now() - interval '90 days')
    ),
    'unonight_integration', coalesce(v_unonight_integration, jsonb_build_object('connected', false)),
    'module_snapshots', v_health->'module_metrics'
  );
end; $$;

create or replace function public.get_unonight_pilot_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_health_status text; v_score int;
begin
  v_org_id := public._mta_require_organization();
  if not public._upo_is_pilot_org(v_org_id) then
    return jsonb_build_object('has_organization', false, 'is_pilot', false);
  end if;

  select health_status into v_health_status
  from public.unonight_pilot_config where organization_id = v_org_id;

  select (public._upo_compute_health(v_org_id)->>'score')::int into v_score;

  return jsonb_build_object(
    'has_organization', true,
    'is_pilot', true,
    'health_status', coalesce(v_health_status, 'healthy'),
    'health_score', coalesce(v_score, 0),
    'milestones_completed', (
      select count(*) from public.pilot_milestones
      where organization_id = v_org_id and status = 'completed'
    ),
    'milestones_total', (select count(*) from public.pilot_milestones where organization_id = v_org_id),
    'philosophy', 'Unonight pilot operations — validate Support AI, Admin Assistant, KC, approvals, and integrations.'
  );
exception when others then
  return jsonb_build_object('has_organization', false, 'is_pilot', false);
end; $$;

create or replace function public.get_platform_unonight_pilot_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_org_id := public._upo_org_id_by_slug('unonight');

  return jsonb_build_object(
    'privacy_note', 'Aggregates only — no customer operational content, email, chat, or order data.',
    'pilot_provisioned', v_org_id is not null,
    'organization_slug', 'unonight',
    'active_pilot_configs', (select count(*) from public.unonight_pilot_config where pilot_status = 'active'),
    'total_pilot_feedback', (select count(*) from public.pilot_feedback),
    'avg_pilot_rating', (
      select round(avg(rating), 2) from public.pilot_feedback where rating is not null
    ),
    'milestones_completed', (
      select count(*) from public.pilot_milestones where status = 'completed'
    ),
    'health_status', (
      select health_status from public.unonight_pilot_config where organization_id = v_org_id limit 1
    )
  );
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
    'pilot_provisioned', 'pilot_module_activated', 'pilot_configuration_changed',
    'pilot_feedback_submitted', 'pilot_metric_recorded', 'pilot_milestone_updated',
    'pilot_recommendation_outcome_recorded', 'pilot_override_applied'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'unonight-pilot-operations-engine', 'Unonight Pilot Operations Engine', 'First pilot customer operations — validate Support AI, Admin Assistant, KC, approvals, audit, and integrations.', 'authenticated', 62
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'unonight-pilot-operations-engine' and tenant_id is null);

grant execute on function public.provision_unonight_pilot() to authenticated;
grant execute on function public.record_pilot_metric(text, numeric, text) to authenticated;
grant execute on function public.submit_pilot_feedback(text, text, int, text) to authenticated;
grant execute on function public.update_pilot_milestone(text, text) to authenticated;
grant execute on function public.get_pilot_health(uuid) to authenticated;
grant execute on function public.get_unonight_pilot_dashboard() to authenticated;
grant execute on function public.get_unonight_pilot_engine_card() to authenticated;
grant execute on function public.get_platform_unonight_pilot_overview() to authenticated;
