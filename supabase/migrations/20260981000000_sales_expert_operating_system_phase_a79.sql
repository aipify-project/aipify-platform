-- Phase A.95 — Sales Expert Operating System (Blueprint Phase 33 Extension)
-- Partner Portal for Aipify Sales Representatives and Experts — metadata only, no mass email.

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
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'trust_reputation_engine',
    'proactive_companion_engine',
    'growth_evolution_engine',
    'priority_focus_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'impact_engine',
    'legacy_engine',
    'curiosity_discovery_engine',
    'gratitude_recognition_engine',
    'companion_identity_engine',
    'wonder_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'hope_engine',
    'wisdom_engine',
    'wisdom_intervention_protocol',
    'sales_expert_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_sales_expert_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  expert_display_name text not null default '',
  expert_company_name text not null default '',
  booking_link text not null default '',
  personal_link text not null default '',
  mass_email_enabled boolean not null default false,
  one_to_one_email_enabled boolean not null default true,
  follow_up_cadence_days int[] not null default array[14, 30, 90],
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_sales_expert_settings enable row level security;
revoke all on public.organization_sales_expert_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_sales_expert_customers
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  org_name text not null,
  status text not null default 'prospect' check (
    status in ('prospect', 'active', 'onboarding', 'at_risk', 'churned', 'archived')
  ),
  subscription_status text not null default 'none' check (
    subscription_status in ('none', 'trial', 'active', 'paused', 'cancelled')
  ),
  onboarding_progress int not null default 0 check (onboarding_progress >= 0 and onboarding_progress <= 100),
  next_follow_up timestamptz,
  notes_metadata jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_sales_expert_customers_org_idx
  on public.organization_sales_expert_customers (organization_id, status, next_follow_up);

alter table public.organization_sales_expert_customers enable row level security;
revoke all on public.organization_sales_expert_customers from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_sales_expert_opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid references public.organization_sales_expert_customers (id) on delete set null,
  title text not null,
  pipeline_stage text not null default 'discovery' check (
    pipeline_stage in ('discovery', 'qualification', 'demo', 'proposal', 'negotiation', 'won', 'lost')
  ),
  estimated_value numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  next_action text not null default '',
  recommended_action text not null default '',
  status text not null default 'open' check (status in ('open', 'won', 'lost', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_sales_expert_opportunities_org_idx
  on public.organization_sales_expert_opportunities (organization_id, pipeline_stage, status);

alter table public.organization_sales_expert_opportunities enable row level security;
revoke all on public.organization_sales_expert_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_sales_expert_commissions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_commissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid references public.organization_sales_expert_customers (id) on delete set null,
  commission_type text not null default 'subscription_recurring' check (
    commission_type in ('subscription_recurring', 'subscription_enhanced', 'implementation', 'training', 'consulting')
  ),
  amount numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'paid', 'forecasted', 'cancelled')
  ),
  subscription_plan_key text,
  period_month date not null default date_trunc('month', now())::date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_sales_expert_commissions_org_idx
  on public.organization_sales_expert_commissions (organization_id, status, period_month desc);

alter table public.organization_sales_expert_commissions enable row level security;
revoke all on public.organization_sales_expert_commissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. organization_sales_expert_email_templates
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_email_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  title text not null,
  subject_pattern text not null,
  body_scaffold text not null,
  category text not null default 'outreach' check (
    category in ('introduction', 'discovery', 'follow_up', 'outreach', 're_engagement', 'upgrade', 'welcome')
  ),
  placeholders jsonb not null default '["expert_name","company_name","booking_link","personal_link"]'::jsonb,
  is_system boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

alter table public.organization_sales_expert_email_templates enable row level security;
revoke all on public.organization_sales_expert_email_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. organization_sales_expert_emails (sent log — no body PII)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_emails (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid references public.organization_sales_expert_customers (id) on delete set null,
  template_key text,
  subject_metadata text not null default '',
  delivery_mode text not null default 'one_to_one' check (delivery_mode in ('one_to_one', 'scheduled')),
  status text not null default 'prepared' check (
    status in ('prepared', 'scheduled', 'sent', 'failed', 'cancelled')
  ),
  scheduled_for timestamptz,
  sent_at timestamptz,
  performance_metadata jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_sales_expert_emails_org_idx
  on public.organization_sales_expert_emails (organization_id, status, created_at desc);

alter table public.organization_sales_expert_emails enable row level security;
revoke all on public.organization_sales_expert_emails from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. organization_sales_expert_follow_ups
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_follow_ups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid references public.organization_sales_expert_customers (id) on delete set null,
  cadence_days int not null check (cadence_days in (14, 30, 90)),
  template_key text not null,
  scheduled_for timestamptz not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'completed', 'skipped', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_sales_expert_follow_ups_org_idx
  on public.organization_sales_expert_follow_ups (organization_id, status, scheduled_for);

alter table public.organization_sales_expert_follow_ups enable row level security;
revoke all on public.organization_sales_expert_follow_ups from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'sales_expert', v.description
from (values
  ('sales_expert.view', 'View Sales Expert Portal', 'View Sales Expert Operating System dashboard and metadata'),
  ('sales_expert.manage', 'Manage Sales Expert Portal', 'Manage customers, opportunities, commissions, and follow-ups'),
  ('sales_expert.email', 'Send Sales Expert Email', 'Send one-to-one emails — mass campaigns not supported')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'sales_expert.view'), ('owner', 'sales_expert.manage'), ('owner', 'sales_expert.email'),
  ('administrator', 'sales_expert.view'), ('administrator', 'sales_expert.manage'), ('administrator', 'sales_expert.email'),
  ('manager', 'sales_expert.view'), ('manager', 'sales_expert.manage'), ('manager', 'sales_expert.email'),
  ('support_agent', 'sales_expert.view'),
  ('viewer', 'sales_expert.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 9. Helpers (_seos_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._seos_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'sales_expert',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._seos_ensure_settings(p_organization_id uuid)
returns public.organization_sales_expert_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_sales_expert_settings;
begin
  insert into public.organization_sales_expert_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_sales_expert_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._seos_blueprint_official_terminology()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Use official Aipify partner tier titles — never Affiliate publicly.',
    'tiers', jsonb_build_array(
      jsonb_build_object('key', 'sales_representative', 'label', 'Aipify Sales Representative'),
      jsonb_build_object('key', 'sales_expert', 'label', 'Aipify Sales Expert'),
      jsonb_build_object('key', 'certified', 'label', 'Aipify Certified Partner'),
      jsonb_build_object('key', 'expert', 'label', 'Aipify Expert Partner')
    ),
    'portal_terms', jsonb_build_array(
      'Customers', 'Opportunities', 'Pipeline', 'Commission Overview',
      'Certifications', 'Performance Insights', 'Partner Resources'
    ),
    'forbidden_public_terms', jsonb_build_array(
      'Affiliate', 'Affiliate Dashboard', 'Affiliate Earnings', 'Referral Hustle'
    )
  );
$$;

create or replace function public._seos_blueprint_portal_sections()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dashboard', 'label', 'Dashboard', 'route', '/app/sales-expert-engine'),
    jsonb_build_object('key', 'customers', 'label', 'Customers', 'route', '/app/sales-expert-engine#customers'),
    jsonb_build_object('key', 'opportunities', 'label', 'Opportunities', 'route', '/app/sales-expert-engine#opportunities'),
    jsonb_build_object('key', 'commission_center', 'label', 'Commission Overview', 'route', '/app/sales-expert-engine#commissions'),
    jsonb_build_object('key', 'training_center', 'label', 'Training Center', 'route', '/app/sales-expert-engine#training'),
    jsonb_build_object('key', 'resource_library', 'label', 'Partner Resources', 'route', '/app/sales-expert-engine#resources'),
    jsonb_build_object('key', 'email_center', 'label', 'Email Center', 'route', '/app/sales-expert-engine#email'),
    jsonb_build_object('key', 'implementation_services', 'label', 'Implementation Services', 'route', '/app/sales-expert-engine#services')
  );
$$;

create or replace function public._seos_blueprint_email_templates_list()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('template_key', 'introduction', 'title', 'Introduction', 'category', 'introduction'),
    jsonb_build_object('template_key', 'discovery_meeting', 'title', 'Discovery meeting', 'category', 'discovery'),
    jsonb_build_object('template_key', 'post_demo_follow_up', 'title', 'Post-demo follow-up', 'category', 'follow_up'),
    jsonb_build_object('template_key', 'knowledge_outreach', 'title', 'Knowledge Center outreach', 'category', 'outreach'),
    jsonb_build_object('template_key', 'support_outreach', 'title', 'Support AI outreach', 'category', 'outreach'),
    jsonb_build_object('template_key', 'commerce_outreach', 'title', 'Commerce outreach', 'category', 'outreach'),
    jsonb_build_object('template_key', 'executive_outreach', 'title', 'Executive outreach', 'category', 'outreach'),
    jsonb_build_object('template_key', 're_engagement', 'title', 'Re-engagement', 'category', 're_engagement'),
    jsonb_build_object('template_key', 'upgrade_recommendation', 'title', 'Upgrade recommendation', 'category', 'upgrade'),
    jsonb_build_object('template_key', 'welcome_to_aipify', 'title', 'Welcome to Aipify', 'category', 'welcome')
  );
$$;

create or replace function public._seos_blueprint_follow_up_cadences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('cadence_days', 14, 'label', '14-day check-in', 'purpose', 'Early adoption support'),
    jsonb_build_object('cadence_days', 30, 'label', '30-day review', 'purpose', 'Onboarding progress review'),
    jsonb_build_object('cadence_days', 90, 'label', '90-day success review', 'purpose', 'Value realization and expansion')
  );
$$;

create or replace function public._seos_blueprint_implementation_services_pricing()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'currency', 'NOK',
    'principle', 'Customers pay Sales Experts directly for implementation services — separate from Aipify subscription.',
    'services', jsonb_build_array(
      jsonb_build_object('key', 'setup', 'label', 'Setup & configuration', 'suggested_price', 15000),
      jsonb_build_object('key', 'training', 'label', 'Team training', 'suggested_price', 5000),
      jsonb_build_object('key', 'package', 'label', 'Setup + training package', 'suggested_price', 20000)
    ),
    'consulting_note', 'Executive consulting and KC creation priced by Expert Partners — metadata scaffold only.'
  );
$$;

create or replace function public._seos_blueprint_subscription_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_subscription', jsonb_build_object(
      'relationship', 'Customer ↔ Aipify',
      'description', 'Software license and platform subscription — billed by Aipify Group AS'
    ),
    'consulting_services', jsonb_build_object(
      'relationship', 'Customer ↔ Sales Expert',
      'description', 'Implementation, training, and consulting — paid directly to the expert or partner organization'
    ),
    'commission_principle', 'Recurring commission for Sales Representatives; enhanced recurring for Sales Experts — metadata governance only.'
  );
$$;

create or replace function public._seos_seed_email_templates(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_sales_expert_email_templates (
    organization_id, template_key, title, subject_pattern, body_scaffold, category, is_system
  )
  select p_organization_id, v.key, v.title, v.subject, v.body, v.category, true
  from (values
    ('introduction', 'Introduction', 'Introducing {{expert_name}} from {{company_name}}',
      'Hello — I am {{expert_name}} with {{company_name}}. I help organizations adopt Aipify Business Operating System (ABOS). Book time: {{booking_link}}',
      'introduction'),
    ('discovery_meeting', 'Discovery meeting', 'Discovery conversation — {{company_name}}',
      'Thank you for your interest in Aipify. I would like to learn about your goals and recommend a fit. Schedule: {{booking_link}}',
      'discovery'),
    ('post_demo_follow_up', 'Post-demo follow-up', 'Following up on your Aipify demo',
      'It was great showing you Aipify. Next steps and resources: {{personal_link}}',
      'follow_up'),
    ('knowledge_outreach', 'Knowledge Center outreach', 'Knowledge Center resources for your team',
      'Approved KC articles can accelerate adoption — I can help curate a starter pack.',
      'outreach'),
    ('support_outreach', 'Support AI outreach', 'Support AI for your operations team',
      'Support AI works inside your existing systems — happy to outline a pilot approach.',
      'outreach'),
    ('commerce_outreach', 'Commerce outreach', 'Commerce intelligence for your store',
      'Commerce modules integrate with your platform — I can match packs to your workflow.',
      'outreach'),
    ('executive_outreach', 'Executive outreach', 'Executive visibility with Aipify',
      'Executive dashboards and briefings help leadership see operational health — brief overview attached as metadata.',
      'outreach'),
    ('re_engagement', 'Re-engagement', 'Checking in on your Aipify journey',
      'I wanted to reconnect and see if timing has changed for ABOS adoption.',
      're_engagement'),
    ('upgrade_recommendation', 'Upgrade recommendation', 'Plan upgrade recommendation',
      'Based on your usage patterns, a higher plan may unlock modules you need — happy to review options.',
      'upgrade'),
    ('welcome_to_aipify', 'Welcome to Aipify', 'Welcome to Aipify — {{company_name}}',
      'Welcome aboard. I am {{expert_name}}, your Aipify contact. Resources: {{personal_link}} · Book: {{booking_link}}',
      'welcome')
  ) as v(key, title, subject, body, category)
  on conflict (organization_id, template_key) do nothing;
end; $$;

create or replace function public._seos_seed_org_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_customer_id uuid;
begin
  perform public._seos_seed_email_templates(p_organization_id);

  if not exists (
    select 1 from public.organization_sales_expert_customers where organization_id = p_organization_id limit 1
  ) then
    insert into public.organization_sales_expert_customers (
      organization_id, org_name, status, subscription_status, onboarding_progress, next_follow_up, notes_metadata
    )
    values
      (p_organization_id, 'Nordic Retail Pilot', 'onboarding', 'trial', 45, now() + interval '7 days',
        jsonb_build_object('reminder', 'Schedule onboarding checkpoint', 'metadata_only', true)),
      (p_organization_id, 'Workflow Studio Prospect', 'prospect', 'none', 0, now() + interval '3 days',
        jsonb_build_object('reminder', 'Send discovery meeting invite', 'metadata_only', true))
    returning id into v_customer_id;

    insert into public.organization_sales_expert_opportunities (
      organization_id, customer_id, title, pipeline_stage, estimated_value, next_action, recommended_action
    )
    select p_organization_id, c.id, 'ABOS Professional rollout', 'demo', 48000, 'Confirm demo attendees',
      'Recommend Business pack after demo'
    from public.organization_sales_expert_customers c
    where c.organization_id = p_organization_id and c.org_name = 'Nordic Retail Pilot'
    limit 1;

    insert into public.organization_sales_expert_commissions (
      organization_id, commission_type, amount, status, subscription_plan_key, period_month
    )
    values
      (p_organization_id, 'subscription_recurring', 1200, 'pending', 'professional', date_trunc('month', now())::date),
      (p_organization_id, 'subscription_enhanced', 2400, 'forecasted', 'business', (date_trunc('month', now()) + interval '1 month')::date),
      (p_organization_id, 'implementation', 15000, 'paid', null, date_trunc('month', now())::date);

    insert into public.organization_sales_expert_follow_ups (
      organization_id, customer_id, cadence_days, template_key, scheduled_for
    )
    select p_organization_id, c.id, 14, 'post_demo_follow_up', now() + interval '14 days'
    from public.organization_sales_expert_customers c
    where c.organization_id = p_organization_id and c.org_name = 'Nordic Retail Pilot'
    limit 1;
  end if;
end; $$;

create or replace function public._seos_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_pending numeric := 0;
  v_paid numeric := 0;
  v_forecasted numeric := 0;
  v_active_opps int := 0;
  v_upcoming_follow_ups int := 0;
  v_lifetime_value numeric := 0;
begin
  select coalesce(sum(amount), 0) into v_pending
  from public.organization_sales_expert_commissions
  where organization_id = p_organization_id and status = 'pending';

  select coalesce(sum(amount), 0) into v_paid
  from public.organization_sales_expert_commissions
  where organization_id = p_organization_id and status = 'paid';

  select coalesce(sum(amount), 0) into v_forecasted
  from public.organization_sales_expert_commissions
  where organization_id = p_organization_id and status = 'forecasted';

  select count(*) into v_active_opps
  from public.organization_sales_expert_opportunities
  where organization_id = p_organization_id and status = 'open';

  select count(*) into v_upcoming_follow_ups
  from public.organization_sales_expert_follow_ups
  where organization_id = p_organization_id and status = 'scheduled' and scheduled_for <= now() + interval '14 days';

  select coalesce(sum(amount), 0) into v_lifetime_value
  from public.organization_sales_expert_commissions
  where organization_id = p_organization_id and status in ('paid', 'approved');

  return jsonb_build_object(
    'monthly_commissions_pending', v_pending,
    'monthly_commissions_paid', v_paid,
    'forecasted_commissions', v_forecasted,
    'lifetime_subscription_value', v_lifetime_value,
    'active_opportunities', v_active_opps,
    'upcoming_follow_ups', v_upcoming_follow_ups,
    'active_customers', (
      select count(*) from public.organization_sales_expert_customers
      where organization_id = p_organization_id and status in ('active', 'onboarding', 'prospect')
    ),
    'privacy_note', 'Commission and customer metadata only — no email bodies or customer PII stored.'
  );
end; $$;

create or replace function public._seos_commercial_commission_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if to_regclass('public.commercial_partner_commissions') is null then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'pending_total', coalesce((
      select sum(amount) from public.commercial_partner_commissions c
      where c.tenant_id = p_organization_id and c.status = 'pending'
    ), 0),
    'paid_total', coalesce((
      select sum(amount) from public.commercial_partner_commissions c
      where c.tenant_id = p_organization_id and c.status = 'paid'
    ), 0),
    'metadata_only', true,
    'note', 'Commercial partner commissions from Billing Commercial Phase 93 — subscription-linked metadata.'
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._seos_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Partner Success A.73 (portfolio health), Partner Certification Phase 91 /app/partners (cert ecosystem), and Marketplace Ecosystem A.45 /app/marketplace-partner-ecosystem-foundation-engine (expert network governance). Sales Expert OS is the partner-facing portal for pipeline, commissions, training, and one-to-one email — metadata only.';
$$;

-- ---------------------------------------------------------------------------
-- 10. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.send_sales_expert_email(
  p_customer_id uuid,
  p_template_key text,
  p_subject_metadata text default null,
  p_scheduled_for timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_sales_expert_settings;
  v_email_id uuid;
begin
  perform public._irp_require_permission('sales_expert.email');
  v_org_id := public._mta_require_organization();
  v_settings := public._seos_ensure_settings(v_org_id);

  if not v_settings.one_to_one_email_enabled then
    raise exception 'One-to-one email is disabled for this organization';
  end if;

  if v_settings.mass_email_enabled then
    raise exception 'Mass email campaigns are not supported — one-to-one only';
  end if;

  if coalesce(trim(p_template_key), '') = '' then
    raise exception 'Template key required';
  end if;

  insert into public.organization_sales_expert_emails (
    organization_id, customer_id, template_key, subject_metadata, delivery_mode, status, scheduled_for, sent_at
  )
  values (
    v_org_id,
    p_customer_id,
    left(trim(p_template_key), 100),
    left(coalesce(p_subject_metadata, p_template_key), 500),
    case when p_scheduled_for is not null then 'scheduled' else 'one_to_one' end,
    case when p_scheduled_for is not null then 'scheduled' else 'sent' end,
    p_scheduled_for,
    case when p_scheduled_for is null then now() else null end
  )
  returning id into v_email_id;

  perform public._seos_log(v_org_id, 'sales_expert_email_sent', 'sales_expert_email', v_email_id,
    jsonb_build_object('template_key', p_template_key, 'delivery_mode', 'one_to_one', 'metadata_only', true));

  return jsonb_build_object('email_id', v_email_id, 'status', 'sent', 'mass_email_supported', false);
end; $$;

create or replace function public.create_sales_expert_customer(
  p_org_name text,
  p_status text default 'prospect',
  p_subscription_status text default 'none'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('sales_expert.manage');
  v_org_id := public._mta_require_organization();
  if coalesce(trim(p_org_name), '') = '' then raise exception 'Organization name required'; end if;

  insert into public.organization_sales_expert_customers (
    organization_id, org_name, status, subscription_status
  )
  values (v_org_id, left(trim(p_org_name), 200), coalesce(p_status, 'prospect'), coalesce(p_subscription_status, 'none'))
  returning id into v_id;

  perform public._seos_log(v_org_id, 'sales_expert_customer_created', 'sales_expert_customer', v_id,
    jsonb_build_object('org_name', left(trim(p_org_name), 200)));

  return jsonb_build_object('customer_id', v_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard + card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Professional partner portal — Customers, Opportunities, Pipeline, Commission Overview.',
    'engine_phase', 'A.95',
    'route', '/app/sales-expert-engine',
    'active_opportunities', v_summary->'active_opportunities',
    'monthly_commissions_pending', v_summary->'monthly_commissions_pending',
    'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
    'lifetime_subscription_value', v_summary->'lifetime_subscription_value'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_sales_expert_settings;
  v_summary jsonb;
begin
  perform public._irp_require_permission('sales_expert.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sales Expert Operating System — partner portal for pipeline, commissions, training, and one-to-one follow-up. Metadata only — no mass email.',
    'principles', jsonb_build_array(
      'Official partner tiers — never Affiliate publicly',
      'Aipify subscription: Customer ↔ Aipify; consulting: Customer ↔ Sales Expert',
      'One-to-one email only — mass campaigns explicitly not supported',
      'Human approval for sensitive commission and program changes',
      'Metadata only — no raw email bodies or customer PII in logs'
    ),
    'privacy_note', 'Customer org names and commission metadata only — no email content or PII stored.',
    'engine_phase', 'A.95',
    'implementation_blueprint', jsonb_build_object(
      'phase', '33-extension',
      'title', 'Sales Expert Operating System',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'parent', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', v_summary,
    'sections', jsonb_build_object(
      'dashboard', jsonb_build_object(
        'revenue_overview', v_summary,
        'monthly_commissions', jsonb_build_object(
          'pending', v_summary->'monthly_commissions_pending',
          'paid', v_summary->'monthly_commissions_paid',
          'forecasted', v_summary->'forecasted_commissions'
        ),
        'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
        'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
        'active_opportunities', v_summary->'active_opportunities'
      ),
      'customers', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'org_name', c.org_name, 'status', c.status,
          'subscription_status', c.subscription_status,
          'onboarding_progress', c.onboarding_progress,
          'next_follow_up', c.next_follow_up,
          'notes_metadata', c.notes_metadata
        ) order by c.next_follow_up nulls last)
        from public.organization_sales_expert_customers c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
          'estimated_value', o.estimated_value, 'currency', o.currency,
          'next_action', o.next_action, 'recommended_action', o.recommended_action,
          'status', o.status, 'customer_id', o.customer_id
        ) order by
          case o.pipeline_stage
            when 'negotiation' then 0 when 'proposal' then 1 when 'demo' then 2 else 3 end)
        from public.organization_sales_expert_opportunities o
        where o.organization_id = v_org_id and o.status = 'open' limit 50
      ), '[]'::jsonb),
      'commissions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'commission_type', c.commission_type, 'amount', c.amount,
          'currency', c.currency, 'status', c.status,
          'subscription_plan_key', c.subscription_plan_key, 'period_month', c.period_month
        ) order by c.period_month desc)
        from public.organization_sales_expert_commissions c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'email_templates', coalesce((
        select jsonb_agg(jsonb_build_object(
          'template_key', t.template_key, 'title', t.title,
          'subject_pattern', t.subject_pattern, 'category', t.category,
          'placeholders', t.placeholders
        ) order by t.template_key)
        from public.organization_sales_expert_email_templates t
        where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'emails', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id, 'template_key', e.template_key, 'subject_metadata', e.subject_metadata,
          'status', e.status, 'delivery_mode', e.delivery_mode,
          'scheduled_for', e.scheduled_for, 'sent_at', e.sent_at
        ) order by e.created_at desc)
        from public.organization_sales_expert_emails e
        where e.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'follow_ups', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', f.id, 'cadence_days', f.cadence_days, 'template_key', f.template_key,
          'scheduled_for', f.scheduled_for, 'status', f.status, 'customer_id', f.customer_id
        ) order by f.scheduled_for)
        from public.organization_sales_expert_follow_ups f
        where f.organization_id = v_org_id limit 30
      ), '[]'::jsonb)
    ),
    'official_terminology', public._seos_blueprint_official_terminology(),
    'portal_sections', public._seos_blueprint_portal_sections(),
    'blueprint_email_templates', public._seos_blueprint_email_templates_list(),
    'follow_up_cadences', public._seos_blueprint_follow_up_cadences(),
    'implementation_services', public._seos_blueprint_implementation_services_pricing(),
    'subscription_principles', public._seos_blueprint_subscription_principles(),
    'commercial_commission_summary', public._seos_commercial_commission_summary(v_org_id),
    'mass_email_supported', false,
    'integration_links', jsonb_build_array(
      jsonb_build_object('key', 'marketplace_ecosystem', 'label', 'Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'partners', 'label', 'Partner Certification Phase 91', 'route', '/app/partners'),
      jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine'),
      jsonb_build_object('key', 'certification', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine'),
      jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine')
    ),
    'training_center', jsonb_build_object(
      'foundations_route', '/app/learning-training-engine',
      'certification_route', '/app/certification-achievement-engine',
      'demo_simulations_note', 'Demo simulations scaffold — metadata only',
      'product_updates_note', 'Product update briefings via Notification Engine — metadata cross-link'
    ),
    'resource_library', jsonb_build_object(
      'status', 'metadata_scaffold',
      'categories', jsonb_build_array('Marketing materials', 'Playbooks', 'Product sheets', 'Templates', 'Case studies'),
      'privacy_note', 'Resource metadata only — assets stored in approved KC or partner program surfaces.'
    ),
    'distinction_note', public._seos_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._seos_blueprint_official_terminology() to authenticated;
grant execute on function public._seos_blueprint_portal_sections() to authenticated;
grant execute on function public._seos_blueprint_email_templates_list() to authenticated;
grant execute on function public._seos_blueprint_follow_up_cadences() to authenticated;
grant execute on function public._seos_blueprint_implementation_services_pricing() to authenticated;
grant execute on function public._seos_blueprint_subscription_principles() to authenticated;
grant execute on function public._seos_engagement_summary(uuid) to authenticated;
grant execute on function public._seos_distinction_note() to authenticated;
grant execute on function public.get_sales_expert_operating_system_dashboard() to authenticated;
grant execute on function public.get_sales_expert_operating_system_card() to authenticated;
grant execute on function public.send_sales_expert_email(uuid, text, text, timestamptz) to authenticated;
grant execute on function public.create_sales_expert_customer(text, text, text) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'sales-expert-operating-system', 'Sales Expert Operating System (Phase 33 Extension)',
  'Partner portal for Sales Representatives and Experts — pipeline, commissions, training, one-to-one email. Metadata only.',
  'authenticated', 99
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'sales-expert-operating-system' and tenant_id is null
);

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._seos_ensure_settings(v_org_id);
    perform public._seos_seed_org_data(v_org_id);
  end loop;
end $$;
