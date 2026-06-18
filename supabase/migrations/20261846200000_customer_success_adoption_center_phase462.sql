-- Phase 462 — Aipify Customer Success & Adoption Center (Customer App)
-- Route hub: /app/customer-success

create table if not exists public.customer_success_adoption_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  health_score int not null default 0 check (health_score between 0 and 100),
  health_band text not null default 'at_risk' check (
    health_band in ('excellent', 'healthy', 'at_risk', 'critical')
  ),
  adoption_score int not null default 0 check (adoption_score between 0 and 100),
  engagement_score int not null default 0 check (engagement_score between 0 and 100),
  retention_risk_level text not null default 'moderate' check (
    retention_risk_level in ('low', 'moderate', 'high', 'critical')
  ),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_success_health_dimensions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dimension_key text not null check (dimension_key in (
    'platform_usage', 'user_activity', 'knowledge_usage', 'companion_activity',
    'business_pack_adoption', 'training_completion', 'support_activity'
  )),
  title text not null,
  score_label text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, dimension_key)
);

create table if not exists public.customer_success_adoption_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'active_users', 'inactive_users', 'weekly_usage', 'monthly_usage',
    'feature_adoption', 'companion_usage', 'business_pack_adoption'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.customer_success_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_key text not null,
  title text not null,
  goal_summary text not null default '' check (char_length(goal_summary) <= 500),
  milestone_label text not null default '',
  target_outcome text not null default '',
  review_date_label text not null default '',
  owner_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, plan_key)
);

create table if not exists public.customer_success_expansion_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  opportunity_type text not null default 'feature' check (
    opportunity_type in ('feature', 'business_pack', 'department', 'growth')
  ),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, opportunity_key)
);

create table if not exists public.customer_success_training (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  module_title text not null,
  training_category text not null default 'recommended' check (
    training_category in ('assigned', 'completed', 'recommended', 'certification')
  ),
  progress_label text not null default '',
  status_key text not null default 'waiting',
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

create table if not exists public.customer_success_engagement (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  engagement_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_value text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create table if not exists public.customer_success_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_name text not null,
  utilization_category text not null default 'installed' check (
    utilization_category in ('installed', 'active', 'underutilized', 'expansion_candidate')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  usage_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, pack_key)
);

create table if not exists public.customer_success_journey (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  journey_stage text not null check (journey_stage in (
    'signup', 'onboarding', 'launch', 'adoption', 'optimization', 'expansion'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  progress_label text not null default '',
  status_key text not null default 'information',
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (organization_id, journey_stage)
);

create table if not exists public.customer_success_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null check (review_key in (
    'day_30', 'day_90', 'day_180', 'annual'
  )),
  title text not null,
  achievements text not null default '' check (char_length(achievements) <= 500),
  challenges text not null default '' check (char_length(challenges) <= 500),
  recommendations text not null default '' check (char_length(recommendations) <= 500),
  review_date_label text not null default '',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, review_key)
);

create table if not exists public.customer_success_retention_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  risk_type text not null default 'usage' check (
    risk_type in ('low_usage', 'low_engagement', 'training_gap', 'support_frustration', 'inactive_team')
  ),
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now(),
  unique (organization_id, risk_key)
);

create table if not exists public.customer_success_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_key text not null,
  title text not null,
  task_type text not null default 'follow_up' check (
    task_type in ('follow_up', 'training', 'optimization', 'executive_review')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  due_label text not null default '',
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now(),
  unique (organization_id, task_key)
);

create table if not exists public.customer_success_companion_advice (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advice_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  recommendation text not null default '' check (char_length(recommendation) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, advice_key)
);

create table if not exists public.customer_success_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'health_score', 'adoption_score', 'engagement_score', 'training_progress'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.customer_success_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  title text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, recommendation_key)
);

create table if not exists public.customer_success_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '' check (char_length(description) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists customer_success_audit_org_idx
  on public.customer_success_audit (organization_id, created_at desc);

alter table public.customer_success_adoption_settings enable row level security;
alter table public.customer_success_health_dimensions enable row level security;
alter table public.customer_success_adoption_metrics enable row level security;
alter table public.customer_success_plans enable row level security;
alter table public.customer_success_expansion_opportunities enable row level security;
alter table public.customer_success_training enable row level security;
alter table public.customer_success_engagement enable row level security;
alter table public.customer_success_business_packs enable row level security;
alter table public.customer_success_journey enable row level security;
alter table public.customer_success_reviews enable row level security;
alter table public.customer_success_retention_risks enable row level security;
alter table public.customer_success_tasks enable row level security;
alter table public.customer_success_companion_advice enable row level security;
alter table public.customer_success_executive_metrics enable row level security;
alter table public.customer_success_recommendations enable row level security;
alter table public.customer_success_audit enable row level security;

revoke all on public.customer_success_adoption_settings from authenticated, anon;
revoke all on public.customer_success_health_dimensions from authenticated, anon;
revoke all on public.customer_success_adoption_metrics from authenticated, anon;
revoke all on public.customer_success_plans from authenticated, anon;
revoke all on public.customer_success_expansion_opportunities from authenticated, anon;
revoke all on public.customer_success_training from authenticated, anon;
revoke all on public.customer_success_engagement from authenticated, anon;
revoke all on public.customer_success_business_packs from authenticated, anon;
revoke all on public.customer_success_journey from authenticated, anon;
revoke all on public.customer_success_reviews from authenticated, anon;
revoke all on public.customer_success_retention_risks from authenticated, anon;
revoke all on public.customer_success_tasks from authenticated, anon;
revoke all on public.customer_success_companion_advice from authenticated, anon;
revoke all on public.customer_success_executive_metrics from authenticated, anon;
revoke all on public.customer_success_recommendations from authenticated, anon;
revoke all on public.customer_success_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'customer_success_adoption_center', v.description
from (values
  ('customer_success_adoption.view', 'View Customer Success & Adoption Center', 'View health scores, adoption, success plans, and retention signals'),
  ('customer_success_adoption.manage', 'Manage Customer Success & Adoption Center', 'Manage success plans, reviews, and customer success tasks')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'customer_success_adoption.view'), ('owner', 'customer_success_adoption.manage'),
  ('administrator', 'customer_success_adoption.view'), ('administrator', 'customer_success_adoption.manage'),
  ('manager', 'customer_success_adoption.view'),
  ('employee', 'customer_success_adoption.view'),
  ('support_agent', 'customer_success_adoption.view'),
  ('moderator', 'customer_success_adoption.view'),
  ('viewer', 'customer_success_adoption.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._csc462_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if not public._irp_has_permission('customer_success_adoption.view', v_org_id) then
    return jsonb_build_object('found', false, 'error', 'Access denied');
  end if;
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_manage', public._irp_has_permission('customer_success_adoption.manage', v_org_id),
    'can_executive', public._irp_has_permission('customer_success_adoption.manage', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._csc462_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.customer_success_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._csc462_health_band(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 85 then 'excellent'
    when p_score >= 70 then 'healthy'
    when p_score >= 50 then 'at_risk'
    else 'critical'
  end;
$$;

create or replace function public._csc462_band_status(p_band text)
returns text language sql immutable as $$
  select case p_band
    when 'excellent' then 'verified'
    when 'healthy' then 'information'
    when 'at_risk' then 'requires_attention'
    else 'not_allowed'
  end;
$$;

create or replace function public._csc462_compute_health(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_avg numeric;
  v_score int;
  v_band text;
begin
  select avg(nullif(regexp_replace(score_label, '[^0-9]', '', 'g'), '')::numeric)
  into v_avg
  from public.customer_success_health_dimensions
  where organization_id = p_org_id;

  v_score := coalesce(round(v_avg)::int, 0);
  v_band := public._csc462_health_band(v_score);

  update public.customer_success_adoption_settings
  set health_score = v_score, health_band = v_band, updated_at = now()
  where organization_id = p_org_id;

  update public.customer_success_executive_metrics
  set metric_value = v_score || '%',
      trend_label = initcap(replace(v_band, '_', ' ')),
      status_key = public._csc462_band_status(v_band),
      updated_at = now()
  where organization_id = p_org_id and metric_key = 'health_score';

  return v_score;
end; $$;

create or replace function public._csc462_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.customer_success_adoption_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.customer_success_health_dimensions where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.customer_success_health_dimensions
    (organization_id, dimension_key, title, score_label, trend_label, status_key)
  values
    (p_org_id, 'platform_usage', 'Platform Usage', '72%', 'Steady weekly activity', 'information'),
    (p_org_id, 'user_activity', 'User Activity', '58%', '3 inactive users this week', 'requires_attention'),
    (p_org_id, 'knowledge_usage', 'Knowledge Usage', '45%', 'Knowledge Center underutilized', 'requires_attention'),
    (p_org_id, 'companion_activity', 'Companion Activity', '68%', 'Daily briefings opened regularly', 'information'),
    (p_org_id, 'business_pack_adoption', 'Business Pack Adoption', '52%', '2 packs installed, 1 active', 'information'),
    (p_org_id, 'training_completion', 'Training Completion', '40%', 'Required modules incomplete', 'waiting'),
    (p_org_id, 'support_activity', 'Support Activity', '75%', 'Response times within target', 'verified');

  insert into public.customer_success_adoption_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'active_users', '12', '+2 this month', 'verified'),
    (p_org_id, 'inactive_users', '3', 'Needs follow-up', 'requires_attention'),
    (p_org_id, 'weekly_usage', '847 sessions', '+12% vs last week', 'information'),
    (p_org_id, 'monthly_usage', '3,240 sessions', 'On track', 'information'),
    (p_org_id, 'feature_adoption', '64%', 'Command Center most used', 'information'),
    (p_org_id, 'companion_usage', '71%', 'Briefings and recommendations', 'verified'),
    (p_org_id, 'business_pack_adoption', '52%', 'Commerce Pack leading', 'information');

  insert into public.customer_success_plans
    (organization_id, plan_key, title, goal_summary, milestone_label, target_outcome, review_date_label, owner_label, status_key)
  values
    (p_org_id, 'support_response', 'Improve support response times', 'Reduce average first response time across support workflows.', 'Q2 milestone', 'Under 4 hours average', 'Jun 30, 2026', 'Support Lead', 'information'),
    (p_org_id, 'reduce_admin', 'Reduce manual administration', 'Automate recurring operational tasks with approved Aipify actions.', 'Phase 1 complete', '20% admin time saved', 'Jul 15, 2026', 'Operations Manager', 'waiting'),
    (p_org_id, 'operational_visibility', 'Increase operational visibility', 'Expand executive briefing adoption across leadership team.', 'Executive rollout', 'Weekly briefing engagement', 'Aug 1, 2026', 'Owner', 'information'),
    (p_org_id, 'compliance', 'Improve compliance readiness', 'Complete compliance training and audit documentation.', 'Audit prep', '100% required training', 'Sep 30, 2026', 'Administrator', 'waiting');

  insert into public.customer_success_expansion_opportunities
    (organization_id, opportunity_key, title, insight, opportunity_type, status_key)
  values
    (p_org_id, 'commerce_pack', 'Commerce Pack recommended', 'Retail operations signals suggest Commerce Pack would accelerate value.', 'business_pack', 'information'),
    (p_org_id, 'finance_pack', 'Finance Pack recommended', 'Accounting integration gap identified — Finance Pack available.', 'business_pack', 'information'),
    (p_org_id, 'analytics_module', 'Advanced analytics unused', 'Analytics module licensed but not activated by any team.', 'feature', 'requires_attention'),
    (p_org_id, 'operations_dept', 'Operations department inactive', 'Operations team has not logged in for 14 days.', 'department', 'requires_attention');

  insert into public.customer_success_training
    (organization_id, module_key, module_title, training_category, progress_label, status_key, sort_order)
  values
    (p_org_id, 'owner_success', 'Owner Success Fundamentals', 'assigned', 'Not started', 'waiting', 1),
    (p_org_id, 'admin_adoption', 'Admin Adoption Workshop', 'assigned', 'In progress — 40%', 'information', 2),
    (p_org_id, 'companion_mastery', 'Companion Mastery', 'recommended', 'Not started', 'information', 3),
    (p_org_id, 'support_excellence', 'Support Excellence', 'completed', 'Completed', 'completed', 4),
    (p_org_id, 'core_certification', 'Core Certification', 'certification', '25%', 'waiting', 5);

  insert into public.customer_success_engagement
    (organization_id, engagement_key, title, summary, metric_value, status_key)
  values
    (p_org_id, 'login_frequency', 'Login frequency', 'Average logins per active user per week.', '4.2', 'information'),
    (p_org_id, 'feature_depth', 'Feature depth', 'Number of distinct modules used per user.', '6', 'verified'),
    (p_org_id, 'companion_interactions', 'Companion interactions', 'Weekly Companion conversations and actions.', '128', 'information'),
    (p_org_id, 'approval_engagement', 'Approval engagement', 'Approval Center response rate.', '92%', 'verified');

  insert into public.customer_success_business_packs
    (organization_id, pack_key, pack_name, utilization_category, summary, usage_label, status_key)
  values
    (p_org_id, 'support', 'Support Pack', 'active', 'Primary operational pack — high utilization.', '87%', 'verified'),
    (p_org_id, 'commerce', 'Commerce Pack', 'installed', 'Installed but adoption building.', '34%', 'information'),
    (p_org_id, 'hosts', 'Aipify Hosts', 'underutilized', 'Licensed — limited team usage detected.', '18%', 'requires_attention'),
    (p_org_id, 'warehouse', 'Warehouse Pack', 'expansion_candidate', 'Recommended based on operations profile.', 'Not installed', 'information');

  insert into public.customer_success_journey
    (organization_id, journey_stage, title, summary, progress_label, status_key, sort_order)
  values
    (p_org_id, 'signup', 'Signup', 'Organization established with Aipify.', 'Complete', 'completed', 1),
    (p_org_id, 'onboarding', 'Onboarding', 'Implementation and setup in progress.', 'In progress', 'information', 2),
    (p_org_id, 'launch', 'Launch', 'Organization launch readiness.', 'Pending', 'waiting', 3),
    (p_org_id, 'adoption', 'Adoption', 'Team adoption and daily usage.', 'Early stage', 'information', 4),
    (p_org_id, 'optimization', 'Optimization', 'Workflow optimization and automation.', 'Not started', 'waiting', 5),
    (p_org_id, 'expansion', 'Expansion', 'Business Pack and module expansion.', 'Opportunities identified', 'information', 6);

  insert into public.customer_success_reviews
    (organization_id, review_key, title, achievements, challenges, recommendations, review_date_label, status_key)
  values
    (p_org_id, 'day_30', '30-Day Review', 'Workspace established, core team invited.', 'Knowledge Center still sparse.', 'Upload policies and complete admin training.', 'Scheduled', 'waiting'),
    (p_org_id, 'day_90', '90-Day Review', 'Pending — adoption metrics tracked.', 'Training gaps for support team.', 'Schedule support excellence training.', 'Upcoming', 'waiting'),
    (p_org_id, 'day_180', '180-Day Review', 'Not yet due.', '—', 'Plan expansion pack evaluation.', 'Future', 'waiting'),
    (p_org_id, 'annual', 'Annual Review', 'Not yet due.', '—', 'Executive success plan refresh.', 'Future', 'waiting');

  insert into public.customer_success_retention_risks
    (organization_id, risk_key, title, insight, risk_type, status_key)
  values
    (p_org_id, 'low_usage_team', 'Inactive operations team', 'Operations department has not engaged in 14 days.', 'inactive_team', 'requires_attention'),
    (p_org_id, 'training_gap', 'Training completion gap', 'Required modules incomplete for 2 administrators.', 'training_gap', 'requires_attention'),
    (p_org_id, 'support_sentiment', 'Support frustration signal', 'Two escalated support cases unresolved beyond SLA.', 'support_frustration', 'requires_attention'),
    (p_org_id, 'engagement_decline', 'Weekly engagement decline', 'Overall weekly usage down 8% vs prior month.', 'low_engagement', 'information');

  insert into public.customer_success_tasks
    (organization_id, task_key, title, task_type, summary, due_label, status_key)
  values
    (p_org_id, 'follow_up_inactive', 'Follow up with inactive users', 'follow_up', 'Contact 3 users who have not logged in this week.', 'This week', 'waiting'),
    (p_org_id, 'training_admin', 'Complete admin training', 'training', 'Finish Admin Adoption Workshop for remaining administrators.', 'Jun 30', 'information'),
    (p_org_id, 'optimize_briefing', 'Optimize executive briefings', 'optimization', 'Review briefing content with leadership team.', 'Jul 15', 'information'),
    (p_org_id, 'exec_review_q2', 'Q2 executive success review', 'executive_review', 'Schedule 90-day success review with owner.', 'Jul 1', 'waiting');

  insert into public.customer_success_companion_advice
    (organization_id, advice_key, title, insight, recommendation, status_key)
  values
    (p_org_id, 'support_decline', 'Support team adoption declining', 'Support module usage dropped 12% this month.', 'Schedule a support team training session and review workflow configuration.', 'requires_attention'),
    (p_org_id, 'training_recommended', 'Additional training recommended', 'Two administrators have incomplete required modules.', 'Assign Admin Adoption Workshop and set a completion deadline.', 'information'),
    (p_org_id, 'commerce_growth', 'Commerce Pack adoption increasing', 'Commerce module usage up 22% — strong expansion signal.', 'Consider advanced Commerce Pack features and share success with leadership.', 'verified');

  insert into public.customer_success_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'health_score', '62%', 'At risk', 'requires_attention'),
    (p_org_id, 'adoption_score', '64%', 'Growing steadily', 'information'),
    (p_org_id, 'engagement_score', '71%', 'Above baseline', 'verified'),
    (p_org_id, 'training_progress', '40%', 'Required modules incomplete', 'waiting');

  insert into public.customer_success_recommendations
    (organization_id, recommendation_key, title, insight, status_key)
  values
    (p_org_id, 'activate_commerce', 'Activate Commerce Pack workflows', 'Commerce Pack is installed but underutilized — guided setup available.', 'information'),
    (p_org_id, 'knowledge_upload', 'Expand Knowledge Center content', 'Low knowledge usage correlates with support escalations.', 'requires_attention'),
    (p_org_id, 'reengage_operations', 'Re-engage operations team', 'Inactive team detected — success plan review recommended.', 'requires_attention');

  update public.customer_success_adoption_settings
  set adoption_score = 64, engagement_score = 71, retention_risk_level = 'moderate'
  where organization_id = p_org_id;

  perform public._csc462_compute_health(p_org_id);

  perform public._csc462_log(
    p_org_id, null, 'customer_success_center', null, 'seed',
    'Customer Success & Adoption Center initialized with health and adoption baseline.'
  );
end; $$;

create or replace function public.get_customer_success_adoption_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_org public.organizations;
  v_settings public.customer_success_adoption_settings;
  v_health_score int;
  v_health_band text;
  v_health_status text;
  v_health_dimensions jsonb := '[]'::jsonb;
  v_adoption jsonb := '[]'::jsonb;
  v_plans jsonb := '[]'::jsonb;
  v_expansion jsonb := '[]'::jsonb;
  v_training jsonb := '[]'::jsonb;
  v_engagement jsonb := '[]'::jsonb;
  v_packs jsonb := '[]'::jsonb;
  v_journey jsonb := '[]'::jsonb;
  v_reviews jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_tasks jsonb := '[]'::jsonb;
  v_advice jsonb := '[]'::jsonb;
  v_executive jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
begin
  v_ctx := public._csc462_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return v_ctx;
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._csc462_seed(v_org_id);
  v_health_score := public._csc462_compute_health(v_org_id);

  select * into v_org from public.organizations where id = v_org_id;
  select * into v_settings from public.customer_success_adoption_settings where organization_id = v_org_id;

  v_health_band := coalesce(v_settings.health_band, public._csc462_health_band(v_health_score));
  v_health_status := public._csc462_band_status(v_health_band);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dimension_key', d.dimension_key, 'title', d.title,
    'score_label', d.score_label, 'trend_label', d.trend_label,
    'status_key', d.status_key, 'item_type', 'health_dimension'
  ) order by d.dimension_key), '[]'::jsonb)
  into v_health_dimensions from public.customer_success_health_dimensions d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'adoption_metric'
  ) order by m.metric_key), '[]'::jsonb)
  into v_adoption from public.customer_success_adoption_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'plan_key', p.plan_key, 'title', p.title, 'goal_summary', p.goal_summary,
    'milestone_label', p.milestone_label, 'target_outcome', p.target_outcome,
    'review_date_label', p.review_date_label, 'owner_label', p.owner_label,
    'status_key', p.status_key, 'item_type', 'success_plan'
  ) order by p.title), '[]'::jsonb)
  into v_plans from public.customer_success_plans p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'opportunity_key', e.opportunity_key, 'title', e.title, 'insight', e.insight,
    'opportunity_type', e.opportunity_type, 'status_key', e.status_key, 'item_type', 'expansion'
  ) order by e.title), '[]'::jsonb)
  into v_expansion from public.customer_success_expansion_opportunities e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'module_key', t.module_key, 'module_title', t.module_title,
    'training_category', t.training_category, 'progress_label', t.progress_label,
    'status_key', t.status_key, 'sort_order', t.sort_order, 'item_type', 'training'
  ) order by t.sort_order), '[]'::jsonb)
  into v_training from public.customer_success_training t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'engagement_key', e.engagement_key, 'title', e.title, 'summary', e.summary,
    'metric_value', e.metric_value, 'status_key', e.status_key, 'item_type', 'engagement'
  ) order by e.title), '[]'::jsonb)
  into v_engagement from public.customer_success_engagement e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'pack_key', p.pack_key, 'pack_name', p.pack_name,
    'utilization_category', p.utilization_category, 'summary', p.summary,
    'usage_label', p.usage_label, 'status_key', p.status_key, 'item_type', 'business_pack'
  ) order by p.utilization_category, p.pack_name), '[]'::jsonb)
  into v_packs from public.customer_success_business_packs p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', j.id, 'journey_stage', j.journey_stage, 'title', j.title, 'summary', j.summary,
    'progress_label', j.progress_label, 'status_key', j.status_key,
    'sort_order', j.sort_order, 'item_type', 'journey'
  ) order by j.sort_order), '[]'::jsonb)
  into v_journey from public.customer_success_journey j where j.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_key', r.review_key, 'title', r.title,
    'achievements', r.achievements, 'challenges', r.challenges,
    'recommendations', r.recommendations, 'review_date_label', r.review_date_label,
    'status_key', r.status_key, 'item_type', 'review'
  ) order by r.review_key), '[]'::jsonb)
  into v_reviews from public.customer_success_reviews r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_key', r.risk_key, 'title', r.title, 'insight', r.insight,
    'risk_type', r.risk_type, 'status_key', r.status_key, 'item_type', 'retention_risk'
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_risks from public.customer_success_retention_risks r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'task_key', t.task_key, 'title', t.title, 'task_type', t.task_type,
    'summary', t.summary, 'due_label', t.due_label, 'status_key', t.status_key, 'item_type', 'task'
  ) order by t.due_label), '[]'::jsonb)
  into v_tasks from public.customer_success_tasks t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'advice_key', a.advice_key, 'title', a.title,
    'insight', a.insight, 'recommendation', a.recommendation,
    'status_key', a.status_key, 'item_type', 'companion_advice'
  ) order by a.updated_at desc), '[]'::jsonb)
  into v_advice from public.customer_success_companion_advice a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by e.metric_key), '[]'::jsonb)
  into v_executive from public.customer_success_executive_metrics e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_key', r.recommendation_key, 'title', r.title,
    'insight', r.insight, 'status_key', r.status_key, 'item_type', 'recommendation'
  ) order by r.title), '[]'::jsonb)
  into v_recommendations from public.customer_success_recommendations r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', audit_row.id, 'item_type', audit_row.item_type, 'action', audit_row.action,
    'description', audit_row.description, 'created_at', audit_row.created_at, 'item_type_label', 'audit'
  )), '[]'::jsonb)
  into v_audit
  from (
    select a.id, a.item_type, a.action, a.description, a.created_at
    from public.customer_success_audit a
    where a.organization_id = v_org_id
    order by a.created_at desc
    limit 20
  ) audit_row;

  return jsonb_build_object(
    'found', true,
    'organization_name', v_org.name,
    'plan_label', initcap(replace(v_org.subscription_plan, '_', ' ')),
    'health_score', v_health_score,
    'health_band', v_health_band,
    'health_status_key', v_health_status,
    'health_band_label', initcap(replace(v_health_band, '_', ' ')),
    'adoption_score', coalesce(v_settings.adoption_score, 0),
    'engagement_score', coalesce(v_settings.engagement_score, 0),
    'retention_risk_level', coalesce(v_settings.retention_risk_level, 'moderate'),
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'governance_note', 'Success reviews, health changes, recommendations, and customer interactions are fully audited.',
    'privacy_note', 'Customer success data is tenant-scoped. Platform Admin sees aggregates only.',
    'health_dimensions', v_health_dimensions,
    'adoption_metrics', v_adoption,
    'success_plans', v_plans,
    'expansion_opportunities', v_expansion,
    'training_center', v_training,
    'engagement', v_engagement,
    'business_pack_usage', v_packs,
    'customer_journey', v_journey,
    'success_reviews', v_reviews,
    'retention_risks', v_risks,
    'success_tasks', v_tasks,
    'companion_advice', v_advice,
    'executive_overview', v_executive,
    'top_recommendations', v_recommendations,
    'audit_history', v_audit,
    'statistics', jsonb_build_object(
      'health_dimension_count', jsonb_array_length(v_health_dimensions),
      'expansion_count', jsonb_array_length(v_expansion),
      'risk_count', jsonb_array_length(v_risks),
      'task_count', jsonb_array_length(v_tasks)
    )
  );
end; $$;

grant execute on function public.get_customer_success_adoption_center() to authenticated;
