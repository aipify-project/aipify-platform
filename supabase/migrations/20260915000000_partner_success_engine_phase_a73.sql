-- Phase A.73 — Partner Success Engine
-- Partner portfolio health, onboarding, adoption, and renewal readiness.
-- Extends Customer Success (A.26), Enterprise Deployment (A.39),
-- Change Management (A.47), Organizational Benchmarking (A.58).

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
    'partner_success_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_partner_records
-- ---------------------------------------------------------------------------
create table if not exists public.organization_partner_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_name text not null,
  partner_type text not null check (
    partner_type in (
      'implementation_partner', 'consultant', 'reseller', 'msp',
      'onboarding_specialist', 'enterprise_advisor'
    )
  ),
  status text not null default 'prospect' check (
    status in ('prospect', 'active', 'suspended', 'archived')
  ),
  primary_contact jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_partner_records_org_idx
  on public.organization_partner_records (organization_id, status, partner_type);

alter table public.organization_partner_records enable row level security;
revoke all on public.organization_partner_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_partner_engagements
-- ---------------------------------------------------------------------------
create table if not exists public.organization_partner_engagements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_id uuid not null references public.organization_partner_records (id) on delete cascade,
  engagement_type text not null check (
    engagement_type in ('implementation', 'onboarding', 'advisory', 'enablement', 'renewal')
  ),
  onboarding_status text not null default 'in_progress' check (
    onboarding_status in ('not_started', 'in_progress', 'completed', 'stalled')
  ),
  adoption_score int not null default 50 check (adoption_score >= 0 and adoption_score <= 100),
  renewal_readiness text not null default 'medium' check (
    renewal_readiness in ('low', 'medium', 'high', 'critical')
  ),
  open_risks jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_partner_engagements_org_idx
  on public.organization_partner_engagements (organization_id, partner_id, engagement_type);

alter table public.organization_partner_engagements enable row level security;
revoke all on public.organization_partner_engagements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_partner_success_outcomes
-- ---------------------------------------------------------------------------
create table if not exists public.organization_partner_success_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_id uuid references public.organization_partner_records (id) on delete set null,
  engagement_id uuid references public.organization_partner_engagements (id) on delete set null,
  outcome_type text not null check (
    outcome_type in ('implementation_pattern', 'barrier', 'best_practice', 'lesson')
  ),
  outcome_summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organization_partner_success_outcomes_org_idx
  on public.organization_partner_success_outcomes (organization_id, outcome_type, created_at desc);

alter table public.organization_partner_success_outcomes enable row level security;
revoke all on public.organization_partner_success_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_partner_success_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_partner_success_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_engagement_type text not null default 'implementation' check (
    default_engagement_type in ('implementation', 'onboarding', 'advisory', 'enablement', 'renewal')
  ),
  adoption_target int not null default 75 check (adoption_target >= 0 and adoption_target <= 100),
  renewal_review_cadence_days int not null default 90 check (renewal_review_cadence_days > 0),
  notify_on_risk boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_partner_success_settings enable row level security;
revoke all on public.organization_partner_success_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'partner_success', v.description
from (values
  ('partners.view', 'View Partner Success', 'View partner portfolio and success metrics'),
  ('partners.manage', 'Manage Partner Success', 'Create and update partner records and engagements'),
  ('partners.export', 'Export Partner Success', 'Export partner success manifests'),
  ('partners.review', 'Review Partner Success', 'Record partner success reviews and outcomes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'partners.view'), ('owner', 'partners.manage'), ('owner', 'partners.export'), ('owner', 'partners.review'),
  ('administrator', 'partners.view'), ('administrator', 'partners.manage'), ('administrator', 'partners.export'), ('administrator', 'partners.review'),
  ('manager', 'partners.view'), ('manager', 'partners.manage'), ('manager', 'partners.export'), ('manager', 'partners.review'),
  ('support_agent', 'partners.view'),
  ('viewer', 'partners.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_pse_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._pse_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'partner_success',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._pse_ensure_settings(p_organization_id uuid)
returns public.organization_partner_success_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_partner_success_settings;
begin
  insert into public.organization_partner_success_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_partner_success_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._pse_customer_success_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_customer_success' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'health_score', coalesce((
      select health_score from public.organization_customer_success where organization_id = p_organization_id
    ), 0),
    'adoption_score', coalesce((
      select adoption_score from public.organization_customer_success where organization_id = p_organization_id
    ), 0),
    'onboarding_status', coalesce((
      select onboarding_status from public.organization_customer_success where organization_id = p_organization_id
    ), 'unknown'),
    'renewal_risk', coalesce((
      select renewal_risk from public.organization_customer_success where organization_id = p_organization_id
    ), 'unknown'),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pse_enterprise_deployment_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'registered_devices' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'registered_devices', coalesce((
      select count(*) from public.registered_devices where organization_id = p_organization_id
    ), 0),
    'active_seats', coalesce((
      select count(*) from public.organization_seats
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'pending_invites', coalesce((
      select count(*) from public.deployment_email_invites
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pse_change_management_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'change_initiatives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_initiatives', coalesce((
      select count(*) from public.change_initiatives
      where organization_id = p_organization_id and status in ('planning', 'in_progress')
    ), 0),
    'adoption_metrics', coalesce((
      select count(*) from public.change_adoption_metrics
      where organization_id = p_organization_id
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pse_benchmarking_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'benchmark_profiles' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'profiles_count', coalesce((
      select count(*) from public.benchmark_profiles where organization_id = p_organization_id
    ), 0),
    'below_benchmark_count', coalesce((
      select count(*) from public.benchmark_comparisons
      where organization_id = p_organization_id and position_metadata->>'position' = 'below'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pse_capture_memory_hook(
  p_organization_id uuid,
  p_outcome_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'partner_success',
    left(coalesce(p_summary, 'Partner success outcome recorded'), 500),
    jsonb_build_object(
      'source', 'partner_success_engine',
      'outcome_id', p_outcome_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._pse_portfolio_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_partner_success_settings;
  v_avg_adoption numeric;
  v_customer_health int;
begin
  v_settings := public._pse_ensure_settings(p_organization_id);

  select round(avg(e.adoption_score)) into v_avg_adoption
  from public.organization_partner_engagements e
  where e.organization_id = p_organization_id;

  if exists (select 1 from pg_tables where tablename = 'organization_customer_success' and schemaname = 'public') then
    select health_score into v_customer_health
    from public.organization_customer_success where organization_id = p_organization_id;
  end if;

  return jsonb_build_object(
    'active_partners', coalesce((
      select count(*) from public.organization_partner_records
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'prospect_partners', coalesce((
      select count(*) from public.organization_partner_records
      where organization_id = p_organization_id and status = 'prospect'
    ), 0),
    'active_engagements', coalesce((
      select count(*) from public.organization_partner_engagements
      where organization_id = p_organization_id
    ), 0),
    'avg_adoption_score', coalesce(v_avg_adoption, 0),
    'customer_health_score', coalesce(v_customer_health, 0),
    'stalled_onboarding', coalesce((
      select count(*) from public.organization_partner_engagements
      where organization_id = p_organization_id and onboarding_status = 'stalled'
    ), 0),
    'high_renewal_risk', coalesce((
      select count(*) from public.organization_partner_engagements
      where organization_id = p_organization_id and renewal_readiness in ('high', 'critical')
    ), 0),
    'open_risk_count', coalesce((
      select sum(jsonb_array_length(e.open_risks))
      from public.organization_partner_engagements e
      where e.organization_id = p_organization_id
    ), 0),
    'adoption_target', v_settings.adoption_target,
    'outcomes_recorded', coalesce((
      select count(*) from public.organization_partner_success_outcomes
      where organization_id = p_organization_id
    ), 0)
  );
end; $$;

create or replace function public._pse_seed_org_partners(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_partner_id uuid;
  v_engagement_id uuid;
begin
  perform public._pse_ensure_settings(p_organization_id);

  if exists (select 1 from public.organization_partner_records where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.organization_partner_records (
    organization_id, partner_name, partner_type, status, primary_contact, metadata
  )
  values (
    p_organization_id,
    'Nordic Implementation Partners',
    'implementation_partner',
    'active',
    '{"role":"partner_manager","channel":"email","metadata_only":true}'::jsonb,
    '{"region":"nordics","certified":true}'::jsonb
  )
  returning id into v_partner_id;

  insert into public.organization_partner_engagements (
    organization_id, partner_id, engagement_type, onboarding_status,
    adoption_score, renewal_readiness, open_risks, metadata
  )
  values (
    p_organization_id, v_partner_id, 'implementation', 'in_progress',
    68, 'medium',
    '[{"risk_key":"training_gap","severity":"medium","metadata_only":true}]'::jsonb,
    '{"phase":"rollout","metadata_only":true}'::jsonb
  )
  returning id into v_engagement_id;

  insert into public.organization_partner_records (
    organization_id, partner_name, partner_type, status, primary_contact, metadata
  )
  values (
    p_organization_id,
    'Enterprise Advisory Group',
    'enterprise_advisor',
    'prospect',
    '{"role":"advisor","channel":"portal","metadata_only":true}'::jsonb,
    '{"focus":"renewal_readiness"}'::jsonb
  );

  insert into public.organization_partner_success_outcomes (
    organization_id, partner_id, engagement_id, outcome_type, outcome_summary, metadata
  )
  values (
    p_organization_id, v_partner_id, v_engagement_id,
    'implementation_pattern',
    'Phased module rollout with weekly adoption checkpoints improves partner-led onboarding completion.',
    '{"source":"seed","metadata_only":true}'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.upsert_organization_partner_record(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_partner_records;
  v_id uuid;
begin
  perform public._irp_require_permission('partners.manage');
  v_org_id := public._mta_require_organization();
  perform public._pse_ensure_settings(v_org_id);

  v_id := nullif(trim(p_payload->>'id'), '')::uuid;

  if v_id is not null then
    update public.organization_partner_records
    set
      partner_name = coalesce(nullif(trim(p_payload->>'partner_name'), ''), partner_name),
      partner_type = coalesce(nullif(trim(p_payload->>'partner_type'), ''), partner_type),
      status = coalesce(nullif(trim(p_payload->>'status'), ''), status),
      primary_contact = coalesce(p_payload->'primary_contact', primary_contact),
      metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
      updated_at = now()
    where id = v_id and organization_id = v_org_id
    returning * into v_row;

    if v_row.id is null then raise exception 'Partner record not found'; end if;

    perform public._pse_log(v_org_id, 'pse_partner_updated', 'partner_record', v_row.id,
      jsonb_build_object('partner_name', v_row.partner_name, 'status', v_row.status));
  else
    if nullif(trim(p_payload->>'partner_name'), '') is null then
      raise exception 'partner_name is required';
    end if;

    insert into public.organization_partner_records (
      organization_id, partner_name, partner_type, status, primary_contact, metadata
    )
    values (
      v_org_id,
      trim(p_payload->>'partner_name'),
      coalesce(nullif(trim(p_payload->>'partner_type'), ''), 'implementation_partner'),
      coalesce(nullif(trim(p_payload->>'status'), ''), 'prospect'),
      coalesce(p_payload->'primary_contact', '{}'::jsonb),
      coalesce(p_payload->'metadata', '{}'::jsonb)
    )
    returning * into v_row;

    perform public._pse_log(v_org_id, 'pse_partner_created', 'partner_record', v_row.id,
      jsonb_build_object('partner_name', v_row.partner_name, 'partner_type', v_row.partner_type));
  end if;

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_partner_status(p_partner_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_partner_records;
begin
  perform public._irp_require_permission('partners.manage');
  v_org_id := public._mta_require_organization();

  update public.organization_partner_records
  set status = coalesce(nullif(trim(p_status), ''), status), updated_at = now()
  where id = p_partner_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Partner record not found'; end if;

  perform public._pse_log(v_org_id, 'pse_partner_status_changed', 'partner_record', v_row.id,
    jsonb_build_object('status', v_row.status));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.create_partner_engagement(
  p_partner_id uuid,
  p_engagement_type text default 'implementation',
  p_onboarding_status text default 'in_progress',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_partner_engagements;
begin
  perform public._irp_require_permission('partners.manage');
  v_org_id := public._mta_require_organization();

  if not exists (
    select 1 from public.organization_partner_records
    where id = p_partner_id and organization_id = v_org_id
  ) then
    raise exception 'Partner record not found';
  end if;

  insert into public.organization_partner_engagements (
    organization_id, partner_id, engagement_type, onboarding_status, metadata
  )
  values (
    v_org_id, p_partner_id,
    coalesce(nullif(trim(p_engagement_type), ''), 'implementation'),
    coalesce(nullif(trim(p_onboarding_status), ''), 'in_progress'),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._pse_log(v_org_id, 'pse_engagement_created', 'partner_engagement', v_row.id,
    jsonb_build_object('engagement_type', v_row.engagement_type, 'partner_id', p_partner_id));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_partner_success_review(
  p_engagement_id uuid,
  p_review_summary text default null,
  p_adoption_score int default null,
  p_renewal_readiness text default null,
  p_open_risks jsonb default null,
  p_outcome_type text default 'lesson',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_engagement public.organization_partner_engagements;
  v_outcome public.organization_partner_success_outcomes;
begin
  perform public._irp_require_permission('partners.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_partner_engagements
  set
    adoption_score = coalesce(p_adoption_score, adoption_score),
    renewal_readiness = coalesce(nullif(trim(p_renewal_readiness), ''), renewal_readiness),
    open_risks = coalesce(p_open_risks, open_risks),
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb),
    updated_at = now()
  where id = p_engagement_id and organization_id = v_org_id
  returning * into v_engagement;

  if v_engagement.id is null then raise exception 'Engagement not found'; end if;

  insert into public.organization_partner_success_outcomes (
    organization_id, partner_id, engagement_id, outcome_type, outcome_summary, recorded_by, metadata
  )
  values (
    v_org_id, v_engagement.partner_id, v_engagement.id,
    coalesce(nullif(trim(p_outcome_type), ''), 'lesson'),
    left(coalesce(p_review_summary, 'Partner success review recorded'), 500),
    v_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_outcome;

  perform public._pse_capture_memory_hook(
    v_org_id, v_outcome.id, v_outcome.outcome_summary,
    jsonb_build_object('engagement_id', p_engagement_id, 'outcome_type', v_outcome.outcome_type)
  );

  perform public._pse_log(v_org_id, 'pse_review_recorded', 'partner_success_outcome', v_outcome.id,
    jsonb_build_object(
      'engagement_id', p_engagement_id,
      'adoption_score', v_engagement.adoption_score,
      'renewal_readiness', v_engagement.renewal_readiness
    ));

  return jsonb_build_object(
    'engagement', row_to_json(v_engagement)::jsonb,
    'outcome', row_to_json(v_outcome)::jsonb
  );
end; $$;

create or replace function public.export_partner_success_manifest(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.organization_partner_success_settings;
begin
  perform public._irp_require_permission('partners.export');
  v_org_id := public._mta_require_organization();
  v_settings := public._pse_ensure_settings(v_org_id);
  perform public._pse_seed_org_partners(v_org_id);

  perform public._pse_log(v_org_id, 'pse_manifest_exported', 'partner_success', null,
    jsonb_build_object('format', coalesce(p_format, 'json')));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'partner_success',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', public._pse_portfolio_summary_block(v_org_id),
    'partners', coalesce((
      select jsonb_agg(row_to_json(p) order by p.created_at desc)
      from public.organization_partner_records p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'engagements', coalesce((
      select jsonb_agg(row_to_json(e) order by e.updated_at desc)
      from public.organization_partner_engagements e where e.organization_id = v_org_id
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.created_at desc)
      from public.organization_partner_success_outcomes o where o.organization_id = v_org_id
      limit 100
    ), '[]'::jsonb),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._pse_customer_success_summary(v_org_id),
      'enterprise_deployment', public._pse_enterprise_deployment_summary(v_org_id),
      'change_management', public._pse_change_management_summary(v_org_id),
      'organizational_benchmarking', public._pse_benchmarking_summary(v_org_id)
    )
  );
end; $$;

create or replace function public.get_executive_partner_portfolio_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('partners.view');
  v_org_id := public._mta_require_organization();
  perform public._pse_seed_org_partners(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Partner portfolio health — metadata only, humans review renewal readiness.',
    'summary', public._pse_portfolio_summary_block(v_org_id),
    'top_risks', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'partner_name', p.partner_name,
          'engagement_type', e.engagement_type,
          'renewal_readiness', e.renewal_readiness,
          'open_risks', e.open_risks
        ) order by
          case e.renewal_readiness when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end
      )
      from public.organization_partner_engagements e
      join public.organization_partner_records p on p.id = e.partner_id
      where e.organization_id = v_org_id and e.renewal_readiness in ('high', 'critical')
      limit 10
    ), '[]'::jsonb),
    'opportunities', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'partner_name', p.partner_name,
          'partner_type', p.partner_type,
          'status', p.status,
          'adoption_score', e.adoption_score
        ) order by e.adoption_score desc
      )
      from public.organization_partner_records p
      left join public.organization_partner_engagements e on e.partner_id = p.id
      where p.organization_id = v_org_id and p.status in ('prospect', 'active')
      limit 10
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_partner_success_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_partner_success_settings;
begin
  perform public._irp_require_permission('partners.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._pse_ensure_settings(v_org_id);
  perform public._pse_seed_org_partners(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Partner success through adoption tracking, onboarding visibility, and renewal readiness — metadata only, no PII.',
    'principles', jsonb_build_array(
      'Partner contact metadata only — never store raw communications',
      'Adoption and renewal readiness drive portfolio health',
      'Integrates Customer Success, Deployment, Change, and Benchmarking',
      'Human-reviewed outcomes become organizational memory',
      'Full audit accountability for partner actions'
    ),
    'summary', public._pse_portfolio_summary_block(v_org_id),
    'settings', row_to_json(v_settings)::jsonb,
    'sections', jsonb_build_object(
      'customer_health', public._pse_customer_success_summary(v_org_id),
      'onboarding', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'partner_name', p.partner_name,
            'engagement_type', e.engagement_type,
            'onboarding_status', e.onboarding_status,
            'adoption_score', e.adoption_score
          ) order by
            case e.onboarding_status when 'stalled' then 0 when 'in_progress' then 1 else 2 end
        )
        from public.organization_partner_engagements e
        join public.organization_partner_records p on p.id = e.partner_id
        where e.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'adoption', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'partner_name', p.partner_name,
            'adoption_score', e.adoption_score,
            'renewal_readiness', e.renewal_readiness
          ) order by e.adoption_score asc
        )
        from public.organization_partner_engagements e
        join public.organization_partner_records p on p.id = e.partner_id
        where e.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'risks', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'partner_name', p.partner_name,
            'engagement_type', e.engagement_type,
            'renewal_readiness', e.renewal_readiness,
            'open_risks', e.open_risks
          ) order by
            case e.renewal_readiness when 'critical' then 0 when 'high' then 1 else 2 end
        )
        from public.organization_partner_engagements e
        join public.organization_partner_records p on p.id = e.partner_id
        where e.organization_id = v_org_id
          and (e.renewal_readiness in ('high', 'critical') or jsonb_array_length(e.open_risks) > 0)
        limit 30
      ), '[]'::jsonb),
      'renewal_readiness', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'partner_name', p.partner_name,
            'renewal_readiness', e.renewal_readiness,
            'adoption_score', e.adoption_score
          ) order by
            case e.renewal_readiness when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end
        )
        from public.organization_partner_engagements e
        join public.organization_partner_records p on p.id = e.partner_id
        where e.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'partner_name', p.partner_name,
            'partner_type', p.partner_type,
            'status', p.status,
            'adoption_score', coalesce(e.adoption_score, 0),
            'opportunity', case
              when p.status = 'prospect' then 'activate_partnership'
              when coalesce(e.adoption_score, 0) >= v_settings.adoption_target then 'expand_engagement'
              else 'improve_adoption'
            end
          ) order by coalesce(e.adoption_score, 0) desc
        )
        from public.organization_partner_records p
        left join public.organization_partner_engagements e on e.partner_id = p.id and e.organization_id = p.organization_id
        where p.organization_id = v_org_id and p.status in ('prospect', 'active')
        limit 30
      ), '[]'::jsonb)
    ),
    'partners', coalesce((
      select jsonb_agg(row_to_json(p) order by p.status, p.partner_name)
      from public.organization_partner_records p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'engagements', coalesce((
      select jsonb_agg(row_to_json(e) order by e.updated_at desc)
      from public.organization_partner_engagements e where e.organization_id = v_org_id
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.created_at desc)
      from public.organization_partner_success_outcomes o where o.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'customer_success', 'Health and adoption context from Customer Success Engine — A.26',
      'enterprise_deployment', 'Device and seat rollout metadata — A.39',
      'change_management', 'Change initiative and adoption signals — A.47',
      'organizational_benchmarking', 'Benchmark position metadata — A.58'
    ),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._pse_customer_success_summary(v_org_id),
      'enterprise_deployment', public._pse_enterprise_deployment_summary(v_org_id),
      'change_management', public._pse_change_management_summary(v_org_id),
      'organizational_benchmarking', public._pse_benchmarking_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_partner_success_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._pse_seed_org_partners(v_org_id);
  v_summary := public._pse_portfolio_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Partner Success — portfolio health, adoption, and renewal readiness.',
    'active_partners', v_summary->'active_partners',
    'avg_adoption_score', v_summary->'avg_adoption_score',
    'high_renewal_risk', v_summary->'high_renewal_risk',
    'customer_health_score', v_summary->'customer_health_score'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit allowlist extension
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
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'partner-success-engine', 'Partner Success Engine', 'Partner portfolio health, onboarding, adoption, and renewal readiness — metadata only.', 'authenticated', 99
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'partner-success-engine' and tenant_id is null);

grant execute on function public.upsert_organization_partner_record(jsonb) to authenticated;
grant execute on function public.update_partner_status(uuid, text) to authenticated;
grant execute on function public.create_partner_engagement(uuid, text, text, jsonb) to authenticated;
grant execute on function public.record_partner_success_review(uuid, text, int, text, jsonb, text, jsonb) to authenticated;
grant execute on function public.export_partner_success_manifest(text) to authenticated;
grant execute on function public.get_executive_partner_portfolio_summary() to authenticated;
grant execute on function public.get_partner_success_engine_dashboard() to authenticated;
grant execute on function public.get_partner_success_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._pse_ensure_settings(v_org_id);
    perform public._pse_seed_org_partners(v_org_id);
  end loop;
end $$;
