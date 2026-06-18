-- Phase 425 — Apple-Level Customer Experience, Adoption & Delight Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/platform/customer-experience. Helpers: _gceade425_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.customer_experience_adoption_delight_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  experience_score integer not null default 82 check (experience_score between 0 and 100),
  onboarding_completion_percent integer not null default 45 check (onboarding_completion_percent between 0 and 100),
  adoption_score integer not null default 68 check (adoption_score between 0 and 100),
  retention_score integer not null default 74 check (retention_score between 0 and 100),
  companion_engagement_score integer not null default 71 check (companion_engagement_score between 0 and 100),
  overall_success_score integer not null default 76 check (overall_success_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_experience_adoption_delight_engine_onboarding_steps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  step_key text not null,
  step_title text not null,
  step_category text not null default 'guided_setup' check (
    step_category in ('guided_setup', 'quick_win', 'companion_guidance', 'recommended_action', 'milestone')
  ),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'skipped')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, step_key)
);

create index if not exists customer_experience_adoption_delight_engine_onboarding_steps_tenant_idx
  on public.customer_experience_adoption_delight_engine_onboarding_steps (tenant_id, status);

create table if not exists public.customer_experience_adoption_delight_engine_first_impressions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  impression_key text not null,
  impression_title text not null,
  impression_type text not null check (
    impression_type in (
      'first_login', 'first_organization', 'first_companion_interaction', 'first_business_pack',
      'first_integration', 'first_workflow', 'first_success'
    )
  ),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, impression_key)
);

create index if not exists customer_experience_adoption_delight_engine_first_impressions_tenant_idx
  on public.customer_experience_adoption_delight_engine_first_impressions (tenant_id, impression_type);

create table if not exists public.customer_experience_adoption_delight_engine_getting_started (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  progress_key text not null,
  progress_title text not null,
  progress_category text not null check (
    progress_category in ('setup', 'organization', 'integration', 'companion', 'knowledge', 'business_pack')
  ),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, progress_key)
);

create index if not exists customer_experience_adoption_delight_engine_getting_started_tenant_idx
  on public.customer_experience_adoption_delight_engine_getting_started (tenant_id, progress_category);

create table if not exists public.customer_experience_adoption_delight_engine_success_moments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  moment_key text not null,
  moment_title text not null,
  moment_type text not null check (
    moment_type in (
      'first_login', 'first_integration', 'first_workflow', 'first_customer',
      'first_revenue', 'first_automation', 'milestone', 'achievement'
    )
  ),
  status text not null default 'pending' check (status in ('pending', 'celebrated', 'acknowledged')),
  celebration_level text not null default 'standard' check (celebration_level in ('subtle', 'standard', 'highlight')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, moment_key)
);

create index if not exists customer_experience_adoption_delight_engine_success_moments_tenant_idx
  on public.customer_experience_adoption_delight_engine_success_moments (tenant_id, moment_type);

create table if not exists public.customer_experience_adoption_delight_engine_companion_moments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  moment_key text not null,
  moment_title text not null,
  moment_type text not null check (
    moment_type in (
      'welcome_back', 'improvements_identified', 'task_completed', 'milestone_reached',
      'attention_required', 'success_recognition'
    )
  ),
  status text not null default 'active' check (status in ('active', 'dismissed', 'archived')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, moment_key)
);

create index if not exists customer_experience_adoption_delight_engine_companion_moments_tenant_idx
  on public.customer_experience_adoption_delight_engine_companion_moments (tenant_id, moment_type);

create table if not exists public.customer_experience_adoption_delight_engine_adoption_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_category text not null check (
    metric_category in ('feature', 'workflow', 'companion', 'business_pack', 'industry_pack', 'integration')
  ),
  adoption_percent integer not null default 0 check (adoption_percent between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_key)
);

create index if not exists customer_experience_adoption_delight_engine_adoption_metrics_tenant_idx
  on public.customer_experience_adoption_delight_engine_adoption_metrics (tenant_id, metric_category);

create table if not exists public.customer_experience_adoption_delight_engine_success_journeys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  journey_key text not null,
  journey_title text not null,
  journey_stage text not null check (
    journey_stage in (
      'new_customer', 'growing_customer', 'advanced_customer', 'enterprise_customer',
      'growth_partner', 'platform_admin', 'executive_user'
    )
  ),
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, journey_key)
);

create index if not exists customer_experience_adoption_delight_engine_success_journeys_tenant_idx
  on public.customer_experience_adoption_delight_engine_success_journeys (tenant_id, journey_stage);

create table if not exists public.customer_experience_adoption_delight_engine_retention_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_type text not null check (
    signal_type in (
      'dormant_user', 'low_adoption', 'unused_feature', 'workflow_gap',
      'knowledge_gap', 'training_opportunity', 'success_risk'
    )
  ),
  risk_level text not null default 'moderate' check (risk_level in ('low', 'moderate', 'high')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists customer_experience_adoption_delight_engine_retention_signals_tenant_idx
  on public.customer_experience_adoption_delight_engine_retention_signals (tenant_id, signal_type);

create table if not exists public.customer_experience_adoption_delight_engine_delight_moments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  delight_key text not null,
  delight_title text not null,
  delight_type text not null check (
    delight_type in ('achievement', 'milestone', 'success_summary', 'companion_recognition', 'progress_celebration', 'team_achievement', 'organization_win')
  ),
  status text not null default 'pending' check (status in ('pending', 'delivered', 'acknowledged')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, delight_key)
);

create index if not exists customer_experience_adoption_delight_engine_delight_moments_tenant_idx
  on public.customer_experience_adoption_delight_engine_delight_moments (tenant_id, delight_type);

create table if not exists public.customer_experience_adoption_delight_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'onboarding_support', 'undiscovered_feature', 'approaching_milestone',
      'underutilized_workflow', 'success_improving'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists customer_experience_adoption_delight_engine_intelligence_signals_tenant_idx
  on public.customer_experience_adoption_delight_engine_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.customer_experience_adoption_delight_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'incomplete_onboarding', 'feature_recommended', 'approaching_milestone',
      'celebrate_success', 'additional_guidance'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists customer_experience_adoption_delight_engine_advisor_signals_tenant_idx
  on public.customer_experience_adoption_delight_engine_advisor_signals (tenant_id, created_at desc);

create table if not exists public.customer_experience_adoption_delight_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'onboarding_started', 'onboarding_completed', 'milestone_reached',
      'success_journey_updated', 'achievement_awarded', 'experience_recommendation_generated',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customer_experience_adoption_delight_engine_audit_logs_tenant_idx
  on public.customer_experience_adoption_delight_engine_audit_logs (tenant_id, created_at desc);

alter table public.customer_experience_adoption_delight_engine_settings enable row level security;
alter table public.customer_experience_adoption_delight_engine_onboarding_steps enable row level security;
alter table public.customer_experience_adoption_delight_engine_first_impressions enable row level security;
alter table public.customer_experience_adoption_delight_engine_getting_started enable row level security;
alter table public.customer_experience_adoption_delight_engine_success_moments enable row level security;
alter table public.customer_experience_adoption_delight_engine_companion_moments enable row level security;
alter table public.customer_experience_adoption_delight_engine_adoption_metrics enable row level security;
alter table public.customer_experience_adoption_delight_engine_success_journeys enable row level security;
alter table public.customer_experience_adoption_delight_engine_retention_signals enable row level security;
alter table public.customer_experience_adoption_delight_engine_delight_moments enable row level security;
alter table public.customer_experience_adoption_delight_engine_intelligence_signals enable row level security;
alter table public.customer_experience_adoption_delight_engine_advisor_signals enable row level security;
alter table public.customer_experience_adoption_delight_engine_audit_logs enable row level security;

revoke all on public.customer_experience_adoption_delight_engine_settings from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_onboarding_steps from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_first_impressions from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_getting_started from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_success_moments from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_companion_moments from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_adoption_metrics from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_success_journeys from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_retention_signals from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_delight_moments from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_intelligence_signals from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_advisor_signals from authenticated, anon;
revoke all on public.customer_experience_adoption_delight_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'customer_experience_adoption_delight_engine', v.description
from (values
  ('customer_experience_adoption_delight.view', 'View Customer Experience', 'View experience overview, onboarding, adoption, companion presence, and success journeys'),
  ('customer_experience_adoption_delight.manage', 'Manage Customer Experience', 'Configure onboarding, milestones, journeys, achievements, and experience recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gceade425_*
-- ---------------------------------------------------------------------------
create or replace function public._gceade425_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Customer Experience Center requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._gceade425_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.customer_experience_adoption_delight_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gceade425_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.customer_experience_adoption_delight_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.customer_experience_adoption_delight_engine_settings;
begin
  insert into public.customer_experience_adoption_delight_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.customer_experience_adoption_delight_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._gceade425_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_onboarding_steps where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_onboarding_steps (tenant_id, step_key, step_title, step_category, status, progress_percent, summary) values
      (p_tenant_id, 'OB-SETUP', 'Guided workspace setup', 'guided_setup', 'in_progress', 60, 'Establish organization profile and preferences.'),
      (p_tenant_id, 'OB-COMPANION', 'Meet your Companion', 'companion_guidance', 'pending', 0, 'First Companion interaction and personalization.'),
      (p_tenant_id, 'OB-INTEGRATE', 'Connect first integration', 'recommended_action', 'pending', 0, 'Install Aipify and connect your primary system.'),
      (p_tenant_id, 'OB-QUICKWIN', 'Complete a quick win', 'quick_win', 'pending', 0, 'Achieve first operational success within 24 hours.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_first_impressions where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_first_impressions (tenant_id, impression_key, impression_title, impression_type, status, summary) values
      (p_tenant_id, 'FI-LOGIN', 'First login', 'first_login', 'completed', 'Welcome — workspace established.'),
      (p_tenant_id, 'FI-ORG', 'First organization', 'first_organization', 'completed', 'Organization profile created.'),
      (p_tenant_id, 'FI-COMPANION', 'First Companion interaction', 'first_companion_interaction', 'pending', 'Introduce yourself to Aipify Companion.'),
      (p_tenant_id, 'FI-INTEGRATION', 'First integration', 'first_integration', 'pending', 'Connect your primary business system.'),
      (p_tenant_id, 'FI-WORKFLOW', 'First workflow', 'first_workflow', 'pending', 'Run your first guided workflow.'),
      (p_tenant_id, 'FI-SUCCESS', 'First success', 'first_success', 'pending', 'Celebrate your first measurable outcome.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_getting_started where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_getting_started (tenant_id, progress_key, progress_title, progress_category, progress_percent, summary) values
      (p_tenant_id, 'GS-SETUP', 'Setup progress', 'setup', 55, 'Core workspace configuration underway.'),
      (p_tenant_id, 'GS-ORG', 'Organization progress', 'organization', 70, 'Team and roles partially configured.'),
      (p_tenant_id, 'GS-INT', 'Integration progress', 'integration', 30, 'Primary integration pending.'),
      (p_tenant_id, 'GS-COMP', 'Companion progress', 'companion', 40, 'Companion personalization in progress.'),
      (p_tenant_id, 'GS-KNOW', 'Knowledge progress', 'knowledge', 25, 'Knowledge base setup started.'),
      (p_tenant_id, 'GS-BP', 'Business Pack progress', 'business_pack', 15, 'Explore relevant Business Packs.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_adoption_metrics where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_adoption_metrics (tenant_id, metric_key, metric_title, metric_category, adoption_percent, summary) values
      (p_tenant_id, 'AD-FEATURE', 'Feature adoption', 'feature', 62, 'Core features in active use.'),
      (p_tenant_id, 'AD-WORKFLOW', 'Workflow adoption', 'workflow', 48, 'Guided workflows gaining traction.'),
      (p_tenant_id, 'AD-COMPANION', 'Companion adoption', 'companion', 55, 'Companion engagement growing.'),
      (p_tenant_id, 'AD-BP', 'Business Pack adoption', 'business_pack', 22, 'Business Packs being evaluated.'),
      (p_tenant_id, 'AD-INT', 'Integration adoption', 'integration', 35, 'First integration in progress.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_success_journeys where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_success_journeys (tenant_id, journey_key, journey_title, journey_stage, status, progress_percent, summary) values
      (p_tenant_id, 'SJ-NEW', 'New customer journey', 'new_customer', 'active', 45, 'Onboarding and first wins in progress.'),
      (p_tenant_id, 'SJ-GROW', 'Growing customer path', 'growing_customer', 'paused', 0, 'Unlock after onboarding completion.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_companion_moments where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_companion_moments (tenant_id, moment_key, moment_title, moment_type, summary) values
      (p_tenant_id, 'CM-WELCOME', 'Welcome back', 'welcome_back', 'Aipify is ready to continue where you left off.'),
      (p_tenant_id, 'CM-IMPROVE', 'Improvements identified', 'improvements_identified', 'Several workflow improvements were identified for your review.'),
      (p_tenant_id, 'CM-ATTENTION', 'Attention required', 'attention_required', 'One onboarding step remains incomplete.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_retention_signals where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_retention_signals (tenant_id, signal_key, signal_title, signal_type, risk_level, summary) values
      (p_tenant_id, 'RT-FEATURE', 'Unused features detected', 'unused_feature', 'moderate', 'Approval Center not yet explored.'),
      (p_tenant_id, 'RT-KNOW', 'Knowledge gap', 'knowledge_gap', 'low', 'Business DNA profile incomplete.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_success_moments where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_success_moments (tenant_id, moment_key, moment_title, moment_type, status, celebration_level, summary) values
      (p_tenant_id, 'SM-LOGIN', 'First login complete', 'first_login', 'celebrated', 'subtle', 'Workspace established successfully.'),
      (p_tenant_id, 'SM-MILESTONE', 'Onboarding milestone approaching', 'milestone', 'pending', 'highlight', 'Complete guided setup to unlock next journey.');
  end if;
  if not exists (select 1 from public.customer_experience_adoption_delight_engine_delight_moments where tenant_id = p_tenant_id limit 1) then
    insert into public.customer_experience_adoption_delight_engine_delight_moments (tenant_id, delight_key, delight_title, delight_type, status, summary) values
      (p_tenant_id, 'DL-PROGRESS', 'Progress celebration', 'progress_celebration', 'pending', 'Setup progress reached 50% — keep going.'),
      (p_tenant_id, 'DL-COMPANION', 'Companion recognition', 'companion_recognition', 'pending', 'Companion engagement milestone approaching.');
  end if;
end; $$;

create or replace function public._gceade425_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.customer_experience_adoption_delight_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.customer_experience_adoption_delight_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'incomplete_onboarding', 'An onboarding step remains incomplete.', 'Integration step blocking quick wins.', 'Complete first integration to unlock workflows.', 'low', 'high'),
    (p_tenant_id, 'feature_recommended', 'A feature is recommended.', 'Approval Center improves trust and control.', 'Explore Approval Center for action governance.', 'low', 'moderate'),
    (p_tenant_id, 'approaching_milestone', 'A milestone is approaching.', 'Guided setup 60% complete.', 'Finish workspace setup this week.', 'moderate', 'high'),
    (p_tenant_id, 'celebrate_success', 'A success should be celebrated.', 'First login milestone achieved.', 'Acknowledge team progress in Companion.', 'low', 'high'),
    (p_tenant_id, 'additional_guidance', 'Additional guidance may be helpful.', 'Business Pack adoption low.', 'Review recommended Business Packs for your industry.', 'moderate', 'moderate');
end; $$;

create or replace function public._gceade425_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.customer_experience_adoption_delight_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.customer_experience_adoption_delight_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'onboarding_support', 'A user may need onboarding support.', 'Integration step pending for 5+ days.', 'Offer guided install assistance.', 'high'),
    (p_tenant_id, 'undiscovered_feature', 'A feature remains undiscovered.', 'Command Center unused this week.', 'Surface Command Center in next session.', 'moderate'),
    (p_tenant_id, 'approaching_milestone', 'A milestone is approaching.', 'Setup progress at 55%.', 'Complete organization configuration.', 'high'),
    (p_tenant_id, 'underutilized_workflow', 'A workflow is underutilized.', 'Approval workflow adoption at 48%.', 'Recommend approval workflow training.', 'moderate'),
    (p_tenant_id, 'success_improving', 'Customer success is improving.', 'Companion engagement up 8%.', 'Continue guided quick wins.', 'high');
end; $$;

create or replace function public._gceade425_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.customer_experience_adoption_delight_engine_settings;
begin
  select * into v_settings from public.customer_experience_adoption_delight_engine_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'onboarding_completion', coalesce(v_settings.onboarding_completion_percent, 45),
    'feature_adoption', coalesce(v_settings.adoption_score, 68),
    'companion_engagement', coalesce(v_settings.companion_engagement_score, 71),
    'retention', coalesce(v_settings.retention_score, 74),
    'experience_score', coalesce(v_settings.experience_score, 82),
    'overall_success_score', coalesce(v_settings.overall_success_score, 76),
    'onboarding_steps_total', (select count(*)::integer from public.customer_experience_adoption_delight_engine_onboarding_steps where tenant_id = p_tenant_id),
    'onboarding_steps_completed', (select count(*)::integer from public.customer_experience_adoption_delight_engine_onboarding_steps where tenant_id = p_tenant_id and status = 'completed'),
    'success_moments_pending', (select count(*)::integer from public.customer_experience_adoption_delight_engine_success_moments where tenant_id = p_tenant_id and status = 'pending'),
    'retention_risks', (select count(*)::integer from public.customer_experience_adoption_delight_engine_retention_signals where tenant_id = p_tenant_id and risk_level in ('moderate', 'high')),
    'customer_health', coalesce(v_settings.overall_success_score, 76)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_experience_adoption_delight_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid;
  v_settings public.customer_experience_adoption_delight_engine_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('customer_experience_adoption_delight.view');
  v_ctx := public._gceade425_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gceade425_ensure_settings(v_org_id, v_tenant_id);
  perform public._gceade425_seed_defaults(v_tenant_id);
  perform public._gceade425_seed_advisor(v_tenant_id);
  perform public._gceade425_seed_intelligence(v_tenant_id);
  v_overview := public._gceade425_overview_block(v_tenant_id);
  perform public._gceade425_log_audit(v_tenant_id, 'dashboard_viewed', 'Customer experience center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'Every screen should help the customer succeed. Every interaction should create confidence.',
    'mission', 'Customer Experience & Adoption Engine — onboarding, adoption, delight, Companion presence, and long-term engagement.',
    'abos_principle', 'Customers should feel like Aipify is helping them succeed — not like they are learning software.',
    'customer_onboarding_route', '/app/customer-onboarding-engine',
    'customer_success_route', '/app/customer-success-engine',
    'install_route', '/app/install',
    'assistant_route', '/app/assistant',
    'distinction_note', 'Experience metadata and adoption signals — not raw customer operational content.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/platform/customer-experience'),
      jsonb_build_object('key', 'onboarding', 'route', '/app/platform/customer-experience#onboarding'),
      jsonb_build_object('key', 'adoption', 'route', '/app/platform/customer-experience#adoption'),
      jsonb_build_object('key', 'companion', 'route', '/app/platform/customer-experience#companion'),
      jsonb_build_object('key', 'journeys', 'route', '/app/platform/customer-experience#journeys'),
      jsonb_build_object('key', 'delight', 'route', '/app/platform/customer-experience#delight'),
      jsonb_build_object('key', 'retention', 'route', '/app/platform/customer-experience#retention'),
      jsonb_build_object('key', 'analytics', 'route', '/app/platform/customer-experience#analytics')
    ),
    'core_languages', jsonb_build_array('en', 'no', 'sv', 'da', 'pl', 'uk'),
    'loading_experience_principles', jsonb_build_array(
      'aipify_companion_icon', 'companion_presence_ring', 'contextual_status', 'progress_indicators'
    ),
    'empty_state_framework', jsonb_build_object(
      'explanation', true, 'benefits', true, 'examples', true, 'recommended_next_step', true,
      'companion_help', true, 'quick_actions', true
    ),
    'trust_framework', jsonb_build_object(
      'transparency', true, 'predictability', true, 'consistency', true,
      'reliability', true, 'governance', true, 'human_oversight', true
    ),
    'onboarding_steps', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'step_key',s.step_key,'step_title',s.step_title,'step_category',s.step_category,'status',s.status,'progress_percent',s.progress_percent,'summary',s.summary) order by s.progress_percent desc) from public.customer_experience_adoption_delight_engine_onboarding_steps s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'first_impressions', coalesce((select jsonb_agg(jsonb_build_object('id',f.id,'impression_key',f.impression_key,'impression_title',f.impression_title,'impression_type',f.impression_type,'status',f.status,'summary',f.summary) order by f.updated_at desc) from public.customer_experience_adoption_delight_engine_first_impressions f where f.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'getting_started', coalesce((select jsonb_agg(jsonb_build_object('id',g.id,'progress_key',g.progress_key,'progress_title',g.progress_title,'progress_category',g.progress_category,'progress_percent',g.progress_percent,'summary',g.summary) order by g.progress_percent desc) from public.customer_experience_adoption_delight_engine_getting_started g where g.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'success_moments', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'moment_key',m.moment_key,'moment_title',m.moment_title,'moment_type',m.moment_type,'status',m.status,'celebration_level',m.celebration_level,'summary',m.summary) order by m.updated_at desc) from public.customer_experience_adoption_delight_engine_success_moments m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'companion_moments', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'moment_key',c.moment_key,'moment_title',c.moment_title,'moment_type',c.moment_type,'status',c.status,'summary',c.summary) order by c.updated_at desc) from public.customer_experience_adoption_delight_engine_companion_moments c where c.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'adoption_metrics', coalesce((select jsonb_agg(jsonb_build_object('id',a.id,'metric_key',a.metric_key,'metric_title',a.metric_title,'metric_category',a.metric_category,'adoption_percent',a.adoption_percent,'summary',a.summary) order by a.adoption_percent desc) from public.customer_experience_adoption_delight_engine_adoption_metrics a where a.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'success_journeys', coalesce((select jsonb_agg(jsonb_build_object('id',j.id,'journey_key',j.journey_key,'journey_title',j.journey_title,'journey_stage',j.journey_stage,'status',j.status,'progress_percent',j.progress_percent,'summary',j.summary) order by j.progress_percent desc) from public.customer_experience_adoption_delight_engine_success_journeys j where j.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'retention_signals', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'signal_key',r.signal_key,'signal_title',r.signal_title,'signal_type',r.signal_type,'risk_level',r.risk_level,'summary',r.summary) order by r.updated_at desc) from public.customer_experience_adoption_delight_engine_retention_signals r where r.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'delight_moments', coalesce((select jsonb_agg(jsonb_build_object('id',d.id,'delight_key',d.delight_key,'delight_title',d.delight_title,'delight_type',d.delight_type,'status',d.status,'summary',d.summary) order by d.updated_at desc) from public.customer_experience_adoption_delight_engine_delight_moments d where d.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.customer_experience_adoption_delight_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.customer_experience_adoption_delight_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.customer_experience_adoption_delight_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'customer_adoption', v_overview->>'feature_adoption',
      'customer_satisfaction', v_overview->>'experience_score',
      'retention', v_overview->>'retention',
      'companion_engagement', v_overview->>'companion_engagement',
      'feature_adoption', v_overview->>'feature_adoption',
      'customer_health', v_overview->>'customer_health',
      'growth_trend', 'improving'
    ),
    'governance', jsonb_build_object(
      'tenant_isolation', true,
      'human_oversight', true,
      'transparent_progress', true,
      'companion_non_intrusive', true,
      'experience_personalization', true
    ),
    'privacy_note', 'Experience and adoption metadata isolated per tenant — guidance without exposing operational content.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.customer_experience_adoption_delight_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('customer_experience_adoption_delight.manage');
  v_ctx := public._gceade425_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gceade425_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'start_onboarding' then
    update public.customer_experience_adoption_delight_engine_onboarding_steps set status = 'in_progress', updated_at = now()
    where tenant_id = v_tenant_id and step_key = coalesce(p_payload->>'step_key', 'OB-SETUP') returning id into v_id;
    perform public._gceade425_log_audit(v_tenant_id, 'onboarding_started', 'Onboarding started', jsonb_build_object('step_id', v_id));
    return jsonb_build_object('ok', true, 'step_id', v_id);
  end if;

  if v_action = 'complete_onboarding_step' then
    update public.customer_experience_adoption_delight_engine_onboarding_steps set
      status = 'completed', progress_percent = 100, updated_at = now()
    where tenant_id = v_tenant_id and step_key = coalesce(p_payload->>'step_key', '') returning id into v_id;
    update public.customer_experience_adoption_delight_engine_settings set
      onboarding_completion_percent = least(100, onboarding_completion_percent + 10),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gceade425_log_audit(v_tenant_id, 'onboarding_completed', 'Onboarding step completed', jsonb_build_object('step_id', v_id));
    return jsonb_build_object('ok', true, 'step_id', v_id);
  end if;

  if v_action = 'record_milestone' then
    insert into public.customer_experience_adoption_delight_engine_success_moments (tenant_id, moment_key, moment_title, moment_type, status, celebration_level, summary)
    values (v_tenant_id, coalesce(p_payload->>'moment_key','SM-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'moment_title','New milestone'), coalesce(p_payload->>'moment_type','milestone'), 'celebrated', coalesce(p_payload->>'celebration_level','standard'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._gceade425_log_audit(v_tenant_id, 'milestone_reached', 'Milestone reached', jsonb_build_object('moment_id', v_id));
    return jsonb_build_object('ok', true, 'moment_id', v_id);
  end if;

  if v_action = 'award_achievement' then
    insert into public.customer_experience_adoption_delight_engine_delight_moments (tenant_id, delight_key, delight_title, delight_type, status, summary)
    values (v_tenant_id, coalesce(p_payload->>'delight_key','DL-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'delight_title','Achievement'), coalesce(p_payload->>'delight_type','achievement'), 'delivered', coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._gceade425_log_audit(v_tenant_id, 'achievement_awarded', 'Achievement awarded', jsonb_build_object('delight_id', v_id));
    return jsonb_build_object('ok', true, 'delight_id', v_id);
  end if;

  if v_action = 'update_journey' then
    update public.customer_experience_adoption_delight_engine_success_journeys set
      progress_percent = least(100, coalesce((p_payload->>'progress_percent')::integer, progress_percent + 5)),
      status = coalesce(p_payload->>'status', status),
      summary = coalesce(p_payload->>'summary', summary),
      updated_at = now()
    where tenant_id = v_tenant_id and journey_key = coalesce(p_payload->>'journey_key', '') returning id into v_id;
    perform public._gceade425_log_audit(v_tenant_id, 'success_journey_updated', 'Success journey updated', jsonb_build_object('journey_id', v_id));
    return jsonb_build_object('ok', true, 'journey_id', v_id);
  end if;

  if v_action = 'generate_recommendation' then
    insert into public.customer_experience_adoption_delight_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence)
    values (v_tenant_id, 'additional_guidance', coalesce(p_payload->>'observation','Experience recommendation generated.'), coalesce(p_payload->>'impact',''), coalesce(p_payload->>'recommendation','Review onboarding progress and adoption gaps.'), 'low', 'moderate')
    returning id into v_id;
    perform public._gceade425_log_audit(v_tenant_id, 'experience_recommendation_generated', 'Experience recommendation generated', jsonb_build_object('signal_id', v_id));
    return jsonb_build_object('ok', true, 'signal_id', v_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.customer_experience_adoption_delight_engine_settings set
      experience_score = least(100, experience_score + 1),
      adoption_score = least(100, adoption_score + 1),
      overall_success_score = least(100, overall_success_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gceade425_log_audit(v_tenant_id, 'analytics_refreshed', 'Experience analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;
