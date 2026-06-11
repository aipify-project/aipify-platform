-- Phase A.44 — Industry Intelligence Foundation Engine
-- Industry-specific patterns, terminology, and operational guidance.
-- Integrates Business Packs (A.43), Organizational Memory (A.34), Strategic Intelligence (A.31).

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
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. industry_profiles (global catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.industry_profiles (
  id uuid primary key default gen_random_uuid(),
  industry_key text not null unique,
  industry_name text not null,
  description text,
  status text not null default 'active' check (
    status in ('active', 'beta', 'deprecated', 'archived')
  ),
  knowledge_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists industry_profiles_status_idx
  on public.industry_profiles (status, industry_key);

alter table public.industry_profiles enable row level security;
revoke all on public.industry_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_industry_assignments (tenant profile assignment)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_industry_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  industry_profile_id uuid not null references public.industry_profiles (id) on delete restrict,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references public.users (id) on delete set null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_industry_assignments_profile_idx
  on public.organization_industry_assignments (industry_profile_id);

alter table public.organization_industry_assignments enable row level security;
revoke all on public.organization_industry_assignments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_industry_settings (customization)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_industry_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  insights_enabled boolean not null default true,
  custom_terminology jsonb not null default '[]'::jsonb,
  priorities jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_industry_settings enable row level security;
revoke all on public.organization_industry_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. industry_insights (tenant insights)
-- ---------------------------------------------------------------------------
create table if not exists public.industry_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  industry_profile_id uuid not null references public.industry_profiles (id) on delete restrict,
  category text not null check (
    category in ('benchmark', 'improvement', 'risk', 'opportunity', 'alignment', 'terminology')
  ),
  title text not null,
  recommendation text not null,
  impact_level text not null default 'medium' check (
    impact_level in ('low', 'medium', 'high', 'strategic')
  ),
  status text not null default 'active' check (
    status in ('active', 'overridden', 'disabled', 'acknowledged')
  ),
  override_recommendation text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists industry_insights_org_idx
  on public.industry_insights (organization_id, status, impact_level);

create index if not exists industry_insights_profile_idx
  on public.industry_insights (organization_id, industry_profile_id, category);

alter table public.industry_insights enable row level security;
revoke all on public.industry_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'industry_intelligence', v.description
from (values
  ('industry.view', 'View Industry Intelligence', 'View industry profiles, benchmarks, and insights'),
  ('industry.manage', 'Manage Industry Intelligence', 'Assign industry profiles and manage settings'),
  ('industry.override', 'Override Industry Insights', 'Override industry recommendations with human approval'),
  ('industry.export', 'Export Industry Intelligence', 'Export industry insights and benchmarks')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'industry.view'), ('owner', 'industry.manage'), ('owner', 'industry.override'), ('owner', 'industry.export'),
  ('administrator', 'industry.view'), ('administrator', 'industry.manage'), ('administrator', 'industry.override'), ('administrator', 'industry.export'),
  ('manager', 'industry.view'), ('manager', 'industry.override'),
  ('viewer', 'industry.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_iife_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._iife_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'industry_intelligence',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._iife_ensure_settings(p_organization_id uuid)
returns public.organization_industry_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_industry_settings;
begin
  insert into public.organization_industry_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_industry_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._iife_seed_profiles()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.industry_profiles (industry_key, industry_name, description, knowledge_metadata)
  values
    ('membership_platforms', 'Membership Platforms', 'Subscription communities, member engagement, and renewal operations.',
      jsonb_build_object(
        'terminology', jsonb_build_array(
          jsonb_build_object('term', 'Churn', 'definition', 'Rate of members leaving the platform'),
          jsonb_build_object('term', 'MRR', 'definition', 'Monthly recurring revenue from memberships')
        ),
        'workflow_recommendations', jsonb_build_array(
          jsonb_build_object('title', 'Renewal reminder sequence', 'description', 'Automate renewal nudges 30/14/7 days before expiry'),
          jsonb_build_object('title', 'Member onboarding path', 'description', 'Structured first-week engagement for new members')
        ),
        'kpi_suggestions', jsonb_build_array(
          jsonb_build_object('name', 'Member retention rate', 'description', 'Percentage of members renewing each period'),
          jsonb_build_object('name', 'Engagement score', 'description', 'Active participation per member cohort')
        ),
        'best_practices', jsonb_build_array(
          jsonb_build_object('title', 'Segment by engagement tier', 'description', 'Tailor outreach to active vs dormant members'),
          jsonb_build_object('title', 'Transparent billing', 'description', 'Clear renewal and cancellation communication')
        ),
        'common_risks', jsonb_build_array(
          jsonb_build_object('title', 'Silent churn', 'severity', 'high', 'mitigation', 'Monitor login frequency and engagement drops'),
          jsonb_build_object('title', 'Payment failure backlog', 'severity', 'medium', 'mitigation', 'Retry dunning with human escalation path')
        ),
        'benchmarks', jsonb_build_array(
          jsonb_build_object('metric', 'Annual retention', 'typical_range', '75–90%'),
          jsonb_build_object('metric', 'Support response time', 'typical_range', '< 4 hours')
        ),
        'future_hooks', jsonb_build_object(
          'external_data_sources', 'scaffold', 'industry_reports', 'scaffold',
          'benchmarking', 'scaffold', 'partner_ecosystems', 'scaffold'
        ),
        'sample_insights', jsonb_build_array(
          jsonb_build_object('category', 'improvement', 'title', 'Improve renewal communication', 'recommendation', 'Add proactive renewal reminders 30 days before expiry to reduce silent churn.', 'impact_level', 'high'),
          jsonb_build_object('category', 'risk', 'title', 'Monitor dormant member cohort', 'recommendation', 'Members inactive 60+ days have elevated churn risk — consider re-engagement campaigns.', 'impact_level', 'medium'),
          jsonb_build_object('category', 'opportunity', 'title', 'Tiered membership upsell', 'recommendation', 'Engaged members may upgrade to premium tiers — review upgrade triggers.', 'impact_level', 'strategic')
        )
      )
    ),
    ('e_commerce', 'E-Commerce', 'Online retail operations, fulfillment, and customer experience.',
      jsonb_build_object(
        'terminology', jsonb_build_array(
          jsonb_build_object('term', 'AOV', 'definition', 'Average order value'),
          jsonb_build_object('term', 'Cart abandonment', 'definition', 'Checkout started but not completed')
        ),
        'workflow_recommendations', jsonb_build_array(
          jsonb_build_object('title', 'Order fulfillment SLA', 'description', 'Track pick-pack-ship within defined windows'),
          jsonb_build_object('title', 'Returns handling', 'description', 'Standardize RMA and refund approval flow')
        ),
        'kpi_suggestions', jsonb_build_array(
          jsonb_build_object('name', 'Conversion rate', 'description', 'Visitors who complete purchase'),
          jsonb_build_object('name', 'Fulfillment accuracy', 'description', 'Orders shipped without errors')
        ),
        'best_practices', jsonb_build_array(
          jsonb_build_object('title', 'Inventory visibility', 'description', 'Real-time stock levels on product pages'),
          jsonb_build_object('title', 'Post-purchase support', 'description', 'Proactive shipping and delivery updates')
        ),
        'common_risks', jsonb_build_array(
          jsonb_build_object('title', 'Stockout during promotions', 'severity', 'high', 'mitigation', 'Pre-promotion inventory audit'),
          jsonb_build_object('title', 'Chargeback spikes', 'severity', 'medium', 'mitigation', 'Clear product descriptions and delivery timelines')
        ),
        'benchmarks', jsonb_build_array(
          jsonb_build_object('metric', 'Cart conversion', 'typical_range', '2–4%'),
          jsonb_build_object('metric', 'Return rate', 'typical_range', '5–15%')
        ),
        'future_hooks', jsonb_build_object(
          'external_data_sources', 'scaffold', 'industry_reports', 'scaffold',
          'benchmarking', 'scaffold', 'partner_ecosystems', 'scaffold'
        ),
        'sample_insights', jsonb_build_array(
          jsonb_build_object('category', 'improvement', 'title', 'Reduce cart abandonment', 'recommendation', 'Review checkout friction points and add recovery emails within 24 hours.', 'impact_level', 'high'),
          jsonb_build_object('category', 'benchmark', 'title', 'Fulfillment SLA alignment', 'recommendation', 'Industry typical ship-within-2-days — compare your current fulfillment metrics.', 'impact_level', 'medium'),
          jsonb_build_object('category', 'alignment', 'title', 'E-Commerce Business Pack', 'recommendation', 'Activate the E-Commerce Business Pack for modules and workflows aligned to retail operations.', 'impact_level', 'strategic')
        )
      )
    ),
    ('professional_services', 'Professional Services', 'Consulting, agencies, and billable service delivery.',
      jsonb_build_object(
        'terminology', jsonb_build_array(
          jsonb_build_object('term', 'Utilization', 'definition', 'Billable hours as percentage of capacity'),
          jsonb_build_object('term', 'Scope creep', 'definition', 'Unplanned expansion of project deliverables')
        ),
        'workflow_recommendations', jsonb_build_array(
          jsonb_build_object('title', 'Project kickoff checklist', 'description', 'Standardize scope, timeline, and stakeholder sign-off'),
          jsonb_build_object('title', 'Time tracking review', 'description', 'Weekly utilization and billing reconciliation')
        ),
        'kpi_suggestions', jsonb_build_array(
          jsonb_build_object('name', 'Billable utilization', 'description', 'Target 70–85% for delivery teams'),
          jsonb_build_object('name', 'Client satisfaction', 'description', 'Post-project NPS or feedback score')
        ),
        'best_practices', jsonb_build_array(
          jsonb_build_object('title', 'Written scope boundaries', 'description', 'Document inclusions and exclusions at kickoff'),
          jsonb_build_object('title', 'Regular status cadence', 'description', 'Weekly client updates with risk flags')
        ),
        'common_risks', jsonb_build_array(
          jsonb_build_object('title', 'Unbilled scope expansion', 'severity', 'high', 'mitigation', 'Change request process with approval'),
          jsonb_build_object('title', 'Key person dependency', 'severity', 'medium', 'mitigation', 'Cross-train and document client context')
        ),
        'benchmarks', jsonb_build_array(
          jsonb_build_object('metric', 'Utilization rate', 'typical_range', '70–85%'),
          jsonb_build_object('metric', 'Project margin', 'typical_range', '25–40%')
        ),
        'future_hooks', jsonb_build_object(
          'external_data_sources', 'scaffold', 'industry_reports', 'scaffold',
          'benchmarking', 'scaffold', 'partner_ecosystems', 'scaffold'
        ),
        'sample_insights', jsonb_build_array(
          jsonb_build_object('category', 'risk', 'title', 'Scope creep detection', 'recommendation', 'Review open projects for deliverables exceeding original scope — escalate change requests.', 'impact_level', 'high'),
          jsonb_build_object('category', 'improvement', 'title', 'Utilization visibility', 'recommendation', 'Track billable vs non-billable hours weekly to optimize capacity planning.', 'impact_level', 'medium'),
          jsonb_build_object('category', 'opportunity', 'title', 'Client expansion signals', 'recommendation', 'High-satisfaction clients are candidates for additional service lines.', 'impact_level', 'strategic')
        )
      )
    ),
    ('hospitality', 'Hospitality', 'Hotels, restaurants, and guest experience operations.',
      jsonb_build_object(
        'terminology', jsonb_build_array(
          jsonb_build_object('term', 'RevPAR', 'definition', 'Revenue per available room'),
          jsonb_build_object('term', 'Occupancy rate', 'definition', 'Percentage of rooms or seats filled')
        ),
        'workflow_recommendations', jsonb_build_array(
          jsonb_build_object('title', 'Guest check-in optimization', 'description', 'Reduce wait times with pre-arrival data collection'),
          jsonb_build_object('title', 'Review response protocol', 'description', 'Respond to guest feedback within 24 hours')
        ),
        'kpi_suggestions', jsonb_build_array(
          jsonb_build_object('name', 'Guest satisfaction score', 'description', 'Post-stay or post-visit rating'),
          jsonb_build_object('name', 'Staff turnover', 'description', 'Retention in front-of-house roles')
        ),
        'best_practices', jsonb_build_array(
          jsonb_build_object('title', 'Consistent service standards', 'description', 'Document service rituals for all shifts'),
          jsonb_build_object('title', 'Peak staffing plans', 'description', 'Align staffing to seasonal demand patterns')
        ),
        'common_risks', jsonb_build_array(
          jsonb_build_object('title', 'Negative review amplification', 'severity', 'high', 'mitigation', 'Rapid response and service recovery procedures'),
          jsonb_build_object('title', 'Understaffing during peaks', 'severity', 'medium', 'mitigation', 'Demand forecasting and flexible scheduling')
        ),
        'benchmarks', jsonb_build_array(
          jsonb_build_object('metric', 'Guest satisfaction', 'typical_range', '4.2–4.8 / 5'),
          jsonb_build_object('metric', 'Occupancy', 'typical_range', '65–80%')
        ),
        'future_hooks', jsonb_build_object(
          'external_data_sources', 'scaffold', 'industry_reports', 'scaffold',
          'benchmarking', 'scaffold', 'partner_ecosystems', 'scaffold'
        ),
        'sample_insights', jsonb_build_array(
          jsonb_build_object('category', 'improvement', 'title', 'Guest feedback loop', 'recommendation', 'Implement post-visit surveys and respond within 24 hours to protect reputation.', 'impact_level', 'high'),
          jsonb_build_object('category', 'risk', 'title', 'Peak season staffing', 'recommendation', 'Review staffing plans against occupancy forecasts for upcoming peak periods.', 'impact_level', 'medium'),
          jsonb_build_object('category', 'benchmark', 'title', 'RevPAR comparison', 'recommendation', 'Compare revenue per available unit against industry typical ranges.', 'impact_level', 'low')
        )
      )
    ),
    ('healthcare', 'Healthcare', 'Clinical and healthcare administration with compliance focus.',
      jsonb_build_object(
        'terminology', jsonb_build_array(
          jsonb_build_object('term', 'Patient intake', 'definition', 'Registration and initial assessment workflow'),
          jsonb_build_object('term', 'Care coordination', 'definition', 'Cross-team patient care planning')
        ),
        'workflow_recommendations', jsonb_build_array(
          jsonb_build_object('title', 'Appointment reminder flow', 'description', 'Reduce no-shows with multi-channel reminders'),
          jsonb_build_object('title', 'Incident reporting', 'description', 'Structured adverse event documentation')
        ),
        'kpi_suggestions', jsonb_build_array(
          jsonb_build_object('name', 'Patient wait time', 'description', 'Average time from arrival to care'),
          jsonb_build_object('name', 'Documentation completeness', 'description', 'Required fields completed per visit')
        ),
        'best_practices', jsonb_build_array(
          jsonb_build_object('title', 'Privacy-by-design', 'description', 'Minimize PHI in operational metadata'),
          jsonb_build_object('title', 'Staff training cadence', 'description', 'Regular compliance and procedure refreshers')
        ),
        'common_risks', jsonb_build_array(
          jsonb_build_object('title', 'Documentation gaps', 'severity', 'high', 'mitigation', 'Checklist-driven intake and discharge'),
          jsonb_build_object('title', 'Scheduling bottlenecks', 'severity', 'medium', 'mitigation', 'Capacity planning and waitlist management')
        ),
        'benchmarks', jsonb_build_array(
          jsonb_build_object('metric', 'No-show rate', 'typical_range', '5–15%'),
          jsonb_build_object('metric', 'Patient satisfaction', 'typical_range', '80–90%')
        ),
        'future_hooks', jsonb_build_object(
          'external_data_sources', 'scaffold', 'industry_reports', 'scaffold',
          'benchmarking', 'scaffold', 'partner_ecosystems', 'scaffold'
        ),
        'sample_insights', jsonb_build_array(
          jsonb_build_object('category', 'risk', 'title', 'Documentation compliance', 'recommendation', 'Review incomplete intake records — documentation gaps increase compliance risk.', 'impact_level', 'high'),
          jsonb_build_object('category', 'improvement', 'title', 'Reduce no-shows', 'recommendation', 'Multi-channel appointment reminders typically reduce no-shows by 20–30%.', 'impact_level', 'medium'),
          jsonb_build_object('category', 'opportunity', 'title', 'Care coordination efficiency', 'recommendation', 'Cross-team handoff templates can reduce care coordination delays.', 'impact_level', 'strategic')
        )
      )
    ),
    ('education', 'Education', 'Schools, training providers, and learning program operations.',
      jsonb_build_object(
        'terminology', jsonb_build_array(
          jsonb_build_object('term', 'Enrollment funnel', 'definition', 'Prospect to enrolled student conversion path'),
          jsonb_build_object('term', 'Completion rate', 'definition', 'Students finishing assigned programs')
        ),
        'workflow_recommendations', jsonb_build_array(
          jsonb_build_object('title', 'Student onboarding', 'description', 'Welcome sequence with resource orientation'),
          jsonb_build_object('title', 'At-risk student outreach', 'description', 'Intervene when engagement drops below threshold')
        ),
        'kpi_suggestions', jsonb_build_array(
          jsonb_build_object('name', 'Course completion rate', 'description', 'Percentage completing enrolled programs'),
          jsonb_build_object('name', 'Instructor response time', 'description', 'Time to answer student questions')
        ),
        'best_practices', jsonb_build_array(
          jsonb_build_object('title', 'Clear learning outcomes', 'description', 'Publish objectives at course start'),
          jsonb_build_object('title', 'Regular progress checkpoints', 'description', 'Milestone reviews to catch struggling learners')
        ),
        'common_risks', jsonb_build_array(
          jsonb_build_object('title', 'Low completion rates', 'severity', 'high', 'mitigation', 'Early engagement monitoring and support'),
          jsonb_build_object('title', 'Instructor overload', 'severity', 'medium', 'mitigation', 'Cohort sizing and TA support ratios')
        ),
        'benchmarks', jsonb_build_array(
          jsonb_build_object('metric', 'Completion rate', 'typical_range', '60–85%'),
          jsonb_build_object('metric', 'Student satisfaction', 'typical_range', '4.0–4.5 / 5')
        ),
        'future_hooks', jsonb_build_object(
          'external_data_sources', 'scaffold', 'industry_reports', 'scaffold',
          'benchmarking', 'scaffold', 'partner_ecosystems', 'scaffold'
        ),
        'sample_insights', jsonb_build_array(
          jsonb_build_object('category', 'improvement', 'title', 'At-risk learner outreach', 'recommendation', 'Identify learners with declining engagement and trigger support outreach.', 'impact_level', 'high'),
          jsonb_build_object('category', 'benchmark', 'title', 'Completion rate comparison', 'recommendation', 'Compare program completion rates against education industry benchmarks.', 'impact_level', 'medium'),
          jsonb_build_object('category', 'opportunity', 'title', 'Learning path expansion', 'recommendation', 'High-completion cohorts may be ready for advanced program offerings.', 'impact_level', 'strategic')
        )
      )
    ),
    ('manufacturing', 'Manufacturing', 'Production, supply chain, and quality operations.',
      jsonb_build_object(
        'terminology', jsonb_build_array(
          jsonb_build_object('term', 'OEE', 'definition', 'Overall equipment effectiveness'),
          jsonb_build_object('term', 'Lead time', 'definition', 'Time from order to delivery')
        ),
        'workflow_recommendations', jsonb_build_array(
          jsonb_build_object('title', 'Quality inspection gates', 'description', 'Checkpoint inspections at production stages'),
          jsonb_build_object('title', 'Supplier review cadence', 'description', 'Quarterly supplier performance assessment')
        ),
        'kpi_suggestions', jsonb_build_array(
          jsonb_build_object('name', 'Defect rate', 'description', 'Units failing quality checks'),
          jsonb_build_object('name', 'On-time delivery', 'description', 'Orders shipped by promised date')
        ),
        'best_practices', jsonb_build_array(
          jsonb_build_object('title', 'Preventive maintenance', 'description', 'Scheduled equipment servicing to reduce downtime'),
          jsonb_build_object('title', 'Supplier diversification', 'description', 'Avoid single-source critical components')
        ),
        'common_risks', jsonb_build_array(
          jsonb_build_object('title', 'Supply chain disruption', 'severity', 'high', 'mitigation', 'Safety stock and alternate supplier mapping'),
          jsonb_build_object('title', 'Quality drift', 'severity', 'medium', 'mitigation', 'Statistical process control monitoring')
        ),
        'benchmarks', jsonb_build_array(
          jsonb_build_object('metric', 'OEE', 'typical_range', '65–85%'),
          jsonb_build_object('metric', 'Defect rate', 'typical_range', '< 2%')
        ),
        'future_hooks', jsonb_build_object(
          'external_data_sources', 'scaffold', 'industry_reports', 'scaffold',
          'benchmarking', 'scaffold', 'partner_ecosystems', 'scaffold'
        ),
        'sample_insights', jsonb_build_array(
          jsonb_build_object('category', 'risk', 'title', 'Supply chain visibility', 'recommendation', 'Map critical component suppliers and maintain safety stock thresholds.', 'impact_level', 'high'),
          jsonb_build_object('category', 'improvement', 'title', 'Quality gate enforcement', 'recommendation', 'Ensure inspection checkpoints are documented at each production stage.', 'impact_level', 'medium'),
          jsonb_build_object('category', 'benchmark', 'title', 'OEE target alignment', 'recommendation', 'Compare equipment effectiveness against manufacturing industry typical ranges.', 'impact_level', 'low')
        )
      )
    )
  on conflict (industry_key) do update set
    industry_name = excluded.industry_name,
    description = excluded.description,
    knowledge_metadata = excluded.knowledge_metadata,
    updated_at = now();
end; $$;

create or replace function public._iife_seed_org_insights(
  p_organization_id uuid,
  p_profile_id uuid
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_samples jsonb;
  v_sample jsonb;
begin
  select coalesce(knowledge_metadata->'sample_insights', '[]'::jsonb)
  into v_samples
  from public.industry_profiles where id = p_profile_id;

  for v_sample in select jsonb_array_elements(v_samples)
  loop
    if not exists (
      select 1 from public.industry_insights
      where organization_id = p_organization_id
        and industry_profile_id = p_profile_id
        and title = v_sample->>'title'
    ) then
      insert into public.industry_insights (
        organization_id, industry_profile_id, category, title, recommendation, impact_level, metadata
      )
      values (
        p_organization_id, p_profile_id,
        coalesce(v_sample->>'category', 'improvement'),
        v_sample->>'title',
        v_sample->>'recommendation',
        coalesce(v_sample->>'impact_level', 'medium'),
        jsonb_build_object('seeded', true)
      );
    end if;
  end loop;
end; $$;

create or replace function public._iife_business_pack_alignment(p_organization_id uuid, p_industry_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_pack_keys text[];
begin
  v_pack_keys := case p_industry_key
    when 'membership_platforms' then array['membership_platform']
    when 'e_commerce' then array['e_commerce']
    when 'professional_services' then array['professional_services']
    when 'hospitality' then array['general_business']
    when 'healthcare' then array['general_business']
    when 'education' then array['general_business']
    when 'manufacturing' then array['general_business']
    else array['general_business']
  end;

  if not exists (select 1 from pg_tables where tablename = 'business_packs' and schemaname = 'public') then
    return '[]'::jsonb;
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'pack_key', bp.pack_key,
      'pack_name', bp.pack_name,
      'is_active', exists (
        select 1 from public.organization_business_packs obp
        where obp.organization_id = p_organization_id and obp.business_pack_id = bp.id
      ),
      'alignment_note', format('Recommended for %s industry profile', p_industry_key)
    ))
    from public.business_packs bp
    where bp.pack_key = any(v_pack_keys) and bp.status in ('active', 'beta')
  ), '[]'::jsonb);
end; $$;

create or replace function public._iife_strategic_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'strategic_insights' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'new_insights', coalesce((
      select count(*) from public.strategic_insights
      where organization_id = p_organization_id and status = 'new'
    ), 0),
    'high_impact', coalesce((
      select count(*) from public.strategic_insights
      where organization_id = p_organization_id
        and impact_level in ('high', 'critical') and status not in ('dismissed', 'completed')
    ), 0)
  );
end; $$;

create or replace function public._iife_memory_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_memory_records' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'active_records', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'recent_decisions', coalesce((
      select count(*) from public.organization_decision_register
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.assign_organization_industry_profile(p_industry_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile public.industry_profiles;
  v_assignment public.organization_industry_assignments;
  v_user_id uuid;
begin
  perform public._irp_require_permission('industry.manage');
  v_org_id := public._mta_require_organization();
  perform public._iife_seed_profiles();

  select * into v_profile from public.industry_profiles
  where industry_key = p_industry_key and status in ('active', 'beta');
  if v_profile.id is null then raise exception 'Industry profile not found'; end if;

  v_user_id := public._mta_app_user_id();
  perform public._iife_ensure_settings(v_org_id);

  insert into public.organization_industry_assignments (
    organization_id, industry_profile_id, assigned_by
  )
  values (v_org_id, v_profile.id, v_user_id)
  on conflict (organization_id) do update set
    industry_profile_id = excluded.industry_profile_id,
    assigned_at = now(),
    assigned_by = excluded.assigned_by,
    status = 'active',
    updated_at = now()
  returning * into v_assignment;

  perform public._iife_seed_org_insights(v_org_id, v_profile.id);

  perform public._iife_log(
    v_org_id, 'industry_profile_assigned', 'industry_profile', v_profile.id,
    jsonb_build_object('industry_key', p_industry_key, 'industry_name', v_profile.industry_name)
  );

  return jsonb_build_object(
    'assignment', row_to_json(v_assignment)::jsonb,
    'profile', row_to_json(v_profile)::jsonb,
    'status', 'assigned'
  );
end; $$;

create or replace function public.override_industry_insight(
  p_insight_id uuid,
  p_override_recommendation text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.industry_insights;
begin
  perform public._irp_require_permission('industry.override');
  v_org_id := public._mta_require_organization();

  if coalesce(trim(p_override_recommendation), '') = '' then
    raise exception 'Override recommendation required';
  end if;

  update public.industry_insights
  set status = 'overridden',
      override_recommendation = left(p_override_recommendation, 2000),
      updated_at = now()
  where id = p_insight_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Industry insight not found'; end if;

  perform public._iife_log(
    v_org_id, 'industry_insight_overridden', 'industry_insight', v_row.id,
    jsonb_build_object('title', v_row.title, 'override_length', char_length(p_override_recommendation))
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.disable_organization_industry_insights(p_disabled boolean default true)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.organization_industry_settings;
begin
  perform public._irp_require_permission('industry.manage');
  v_org_id := public._mta_require_organization();

  insert into public.organization_industry_settings (organization_id, insights_enabled)
  values (v_org_id, not coalesce(p_disabled, true))
  on conflict (organization_id) do update set
    insights_enabled = not coalesce(p_disabled, true),
    updated_at = now()
  returning * into v_settings;

  if coalesce(p_disabled, true) then
    update public.industry_insights
    set status = 'disabled', updated_at = now()
    where organization_id = v_org_id and status = 'active';
  end if;

  perform public._iife_log(
    v_org_id, 'industry_insights_toggled', 'industry_settings', v_settings.id,
    jsonb_build_object('insights_enabled', v_settings.insights_enabled)
  );

  return row_to_json(v_settings)::jsonb;
end; $$;

create or replace function public.customize_organization_industry_settings(p_settings jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.organization_industry_settings;
begin
  perform public._irp_require_permission('industry.manage');
  v_org_id := public._mta_require_organization();

  insert into public.organization_industry_settings (organization_id)
  values (v_org_id)
  on conflict (organization_id) do nothing;

  update public.organization_industry_settings
  set custom_terminology = case
        when p_settings ? 'custom_terminology' then coalesce(p_settings->'custom_terminology', '[]'::jsonb)
        else custom_terminology
      end,
      priorities = case
        when p_settings ? 'priorities' then coalesce(p_settings->'priorities', '[]'::jsonb)
        else priorities
      end,
      metadata = coalesce(metadata, '{}'::jsonb) || coalesce(p_settings->'metadata', '{}'::jsonb),
      updated_at = now()
  where organization_id = v_org_id
  returning * into v_settings;

  if p_settings ? 'custom_terminology' then
    perform public._iife_log(
      v_org_id, 'industry_terminology_updated', 'industry_settings', v_settings.id,
      jsonb_build_object('term_count', jsonb_array_length(v_settings.custom_terminology))
    );
  end if;

  if p_settings ? 'priorities' then
    perform public._iife_log(
      v_org_id, 'industry_priorities_updated', 'industry_settings', v_settings.id,
      jsonb_build_object('priority_count', jsonb_array_length(v_settings.priorities))
    );
  end if;

  return row_to_json(v_settings)::jsonb;
end; $$;

create or replace function public.export_organization_industry_insights()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_profile_key text;
begin
  perform public._irp_require_permission('industry.export');
  v_org_id := public._mta_require_organization();

  select ip.industry_key into v_profile_key
  from public.organization_industry_assignments oia
  join public.industry_profiles ip on ip.id = oia.industry_profile_id
  where oia.organization_id = v_org_id;

  perform public._iife_log(
    v_org_id, 'industry_insights_exported', 'industry_intelligence', null,
    jsonb_build_object('industry_key', v_profile_key)
  );

  return jsonb_build_object(
    'exported_at', now(),
    'industry_key', v_profile_key,
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.industry_insights i
      where i.organization_id = v_org_id and i.status not in ('disabled')
    ), '[]'::jsonb),
    'metadata_only', true,
    'privacy_note', 'Export contains metadata and recommendations only — no PII.'
  );
end; $$;

create or replace function public.get_industry_intelligence_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile public.industry_profiles;
  v_settings public.organization_industry_settings;
  v_metadata jsonb;
begin
  perform public._irp_require_permission('industry.view');
  v_org_id := public._mta_require_organization();
  perform public._iife_seed_profiles();
  v_settings := public._iife_ensure_settings(v_org_id);

  select ip.* into v_profile
  from public.organization_industry_assignments oia
  join public.industry_profiles ip on ip.id = oia.industry_profile_id
  where oia.organization_id = v_org_id and oia.status = 'active'
  limit 1;

  v_metadata := coalesce(v_profile.knowledge_metadata, '{}'::jsonb);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Industry-specific intelligence — patterns, terminology, and operational priorities with human oversight. Extends Business Packs (A.43), Organizational Memory (A.34), and Strategic Intelligence (A.31).',
    'principles', jsonb_build_array(
      'Tenant-aware industry guidance',
      'Explainable recommendations with impact levels',
      'Human override — never silent changes',
      'Metadata only — no PII storage',
      'Audit-supported accountability',
      'Business Pack alignment where applicable'
    ),
    'summary', jsonb_build_object(
      'profile_assigned', v_profile.id is not null,
      'industry_key', v_profile.industry_key,
      'industry_name', v_profile.industry_name,
      'insights_enabled', v_settings.insights_enabled,
      'active_insights', coalesce((
        select count(*) from public.industry_insights
        where organization_id = v_org_id and status in ('active', 'overridden', 'acknowledged')
      ), 0),
      'high_impact_insights', coalesce((
        select count(*) from public.industry_insights
        where organization_id = v_org_id
          and impact_level in ('high', 'strategic')
          and status not in ('disabled')
      ), 0),
      'overridden_count', coalesce((
        select count(*) from public.industry_insights
        where organization_id = v_org_id and status = 'overridden'
      ), 0),
      'custom_terms', jsonb_array_length(coalesce(v_settings.custom_terminology, '[]'::jsonb)),
      'priorities_count', jsonb_array_length(coalesce(v_settings.priorities, '[]'::jsonb))
    ),
    'assigned_profile', case when v_profile.id is not null then row_to_json(v_profile)::jsonb else null end,
    'settings', row_to_json(v_settings)::jsonb,
    'benchmarks', coalesce(v_metadata->'benchmarks', '[]'::jsonb),
    'recommended_improvements', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.industry_insights i
      where i.organization_id = v_org_id
        and i.category in ('improvement', 'benchmark')
        and i.status not in ('disabled')
        and v_settings.insights_enabled
    ), '[]'::jsonb),
    'common_risks', coalesce(v_metadata->'common_risks', '[]'::jsonb),
    'strategic_opportunities', coalesce((
      select jsonb_agg(row_to_json(i) order by i.created_at desc)
      from public.industry_insights i
      where i.organization_id = v_org_id
        and i.category = 'opportunity'
        and i.status not in ('disabled')
        and v_settings.insights_enabled
    ), '[]'::jsonb),
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, i.created_at desc)
      from public.industry_insights i
      where i.organization_id = v_org_id
        and i.status not in ('disabled')
        and v_settings.insights_enabled
    ), '[]'::jsonb),
    'terminology', coalesce(v_metadata->'terminology', '[]'::jsonb) || coalesce(v_settings.custom_terminology, '[]'::jsonb),
    'workflow_recommendations', coalesce(v_metadata->'workflow_recommendations', '[]'::jsonb),
    'kpi_suggestions', coalesce(v_metadata->'kpi_suggestions', '[]'::jsonb),
    'best_practices', coalesce(v_metadata->'best_practices', '[]'::jsonb),
    'business_pack_alignment', case
      when v_profile.industry_key is not null then public._iife_business_pack_alignment(v_org_id, v_profile.industry_key)
      else '[]'::jsonb
    end,
    'integration_summaries', jsonb_build_object(
      'strategic_intelligence', public._iife_strategic_summary(v_org_id),
      'organizational_memory', public._iife_memory_summary(v_org_id),
      'business_packs', jsonb_build_object(
        'route', '/app/business-packs-foundation-engine',
        'note', 'Activate aligned Business Packs for modules and workflows'
      )
    ),
    'future_hooks', coalesce(v_metadata->'future_hooks', jsonb_build_object(
      'external_data_sources', 'scaffold',
      'industry_reports', 'scaffold',
      'benchmarking', 'scaffold',
      'partner_ecosystems', 'scaffold'
    )),
    'available_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'industry_key', ip.industry_key,
        'industry_name', ip.industry_name,
        'description', ip.description,
        'status', ip.status
      ) order by ip.industry_name)
      from public.industry_profiles ip where ip.status in ('active', 'beta')
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_industry_intelligence_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_industry_name text; v_insights int;
begin
  v_org_id := public._mta_require_organization();

  select ip.industry_name into v_industry_name
  from public.organization_industry_assignments oia
  join public.industry_profiles ip on ip.id = oia.industry_profile_id
  where oia.organization_id = v_org_id;

  select count(*) into v_insights
  from public.industry_insights
  where organization_id = v_org_id and status in ('active', 'overridden');

  return jsonb_build_object(
    'has_organization', true,
    'industry_name', v_industry_name,
    'active_insights', coalesce(v_insights, 0),
    'philosophy', 'Industry-specific guidance with human oversight.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
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
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'license_created', 'seat_assigned', 'seat_revoked',
    'device_registered', 'device_revoked',
    'enrollment_token_created', 'enrollment_token_revoked',
    'deployment_invite_sent', 'domain_verification_started',
    'sso_config_updated', 'scim_settings_updated',
    'baseline_changed', 'impact_report_exported',
    'compliance_review_completed', 'compliance_report_exported', 'compliance_status_changed',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'industry-intelligence-foundation-engine', 'Industry Intelligence Foundation Engine', 'Industry-specific patterns, terminology, benchmarks, and operational guidance with human oversight.', 'authenticated', 78
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'industry-intelligence-foundation-engine' and tenant_id is null);

select public._iife_seed_profiles();

grant execute on function public.assign_organization_industry_profile(text) to authenticated;
grant execute on function public.override_industry_insight(uuid, text) to authenticated;
grant execute on function public.disable_organization_industry_insights(boolean) to authenticated;
grant execute on function public.customize_organization_industry_settings(jsonb) to authenticated;
grant execute on function public.export_organization_industry_insights() to authenticated;
grant execute on function public.get_industry_intelligence_foundation_engine_dashboard() to authenticated;
grant execute on function public.get_industry_intelligence_foundation_engine_card() to authenticated;
