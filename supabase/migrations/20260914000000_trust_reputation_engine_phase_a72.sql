-- Phase A.72 — Trust & Reputation Engine
-- Organizational trust profiles and reputation signals — metadata only.
-- Integrates Human Oversight (A.40), Secure AI Actions (A.3), Workflow (A.42),
-- Governance (A.14), enterprise_delegated_admins (A.30/A.41 scaffold).

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
    'trust_reputation_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_trust_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_type text not null check (
    entity_type in ('workflow', 'automation', 'approval', 'knowledge', 'support', 'governance')
  ),
  entity_id uuid,
  trust_score numeric(5, 2) not null default 50 check (trust_score >= 0 and trust_score <= 100),
  trust_level text not null default 'emerging' check (
    trust_level in ('emerging', 'established', 'trusted', 'highly_trusted')
  ),
  status text not null default 'active' check (
    status in ('active', 'under_review', 'revoked', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_type, entity_id)
);

create index if not exists organization_trust_profiles_org_idx
  on public.organization_trust_profiles (organization_id, entity_type, trust_level, status);

alter table public.organization_trust_profiles enable row level security;
revoke all on public.organization_trust_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_trust_signals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid not null references public.organization_trust_profiles (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'approval_accuracy', 'task_completion', 'support_quality',
      'knowledge_contribution', 'policy_adherence', 'positive_audit'
    )
  ),
  signal_value numeric(8, 2) not null default 0,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists organization_trust_signals_profile_idx
  on public.organization_trust_signals (profile_id, signal_type, recorded_at desc);

alter table public.organization_trust_signals enable row level security;
revoke all on public.organization_trust_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_trust_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  review_cadence_days int not null default 30,
  auto_signal_enabled boolean not null default true,
  expansion_review_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_trust_settings enable row level security;
revoke all on public.organization_trust_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_trust_outcomes (org memory integration)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid references public.organization_trust_profiles (id) on delete set null,
  outcome_type text not null check (
    outcome_type in ('success_pattern', 'revocation', 'lesson', 'expansion_approved', 'expansion_rejected')
  ),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organization_trust_outcomes_org_idx
  on public.organization_trust_outcomes (organization_id, outcome_type, created_at desc);

alter table public.organization_trust_outcomes enable row level security;
revoke all on public.organization_trust_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions — trust.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'trust_reputation', v.description
from (values
  ('trust.view', 'View Trust Profiles', 'View trust and reputation dashboards'),
  ('trust.manage', 'Manage Trust Profiles', 'Configure trust settings and upsert profiles'),
  ('trust.review', 'Review Trust Expansion', 'Review and approve trust level changes'),
  ('trust.export', 'Export Trust Manifest', 'Export trust and reputation reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'trust.view'), ('owner', 'trust.manage'), ('owner', 'trust.review'), ('owner', 'trust.export'),
  ('administrator', 'trust.view'), ('administrator', 'trust.manage'), ('administrator', 'trust.review'), ('administrator', 'trust.export'),
  ('manager', 'trust.view'), ('manager', 'trust.manage'), ('manager', 'trust.review'), ('manager', 'trust.export'),
  ('support_agent', 'trust.view'),
  ('viewer', 'trust.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_tre_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._tre_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_trust_profile',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._tre_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_trust_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._tre_score_to_level(p_score numeric)
returns text language sql immutable as $$
  select case
    when coalesce(p_score, 0) >= 80 then 'highly_trusted'
    when coalesce(p_score, 0) >= 60 then 'trusted'
    when coalesce(p_score, 0) >= 40 then 'established'
    else 'emerging'
  end;
$$;

create or replace function public._tre_human_oversight_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_oversight_approvals' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'pending_approvals', coalesce((
      select count(*) from public.organization_oversight_approvals
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'approved_count', coalesce((
      select count(*) from public.organization_oversight_approvals
      where organization_id = p_organization_id and status = 'approved'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._tre_secure_ai_actions_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'ai_action_requests' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'pending_requests', coalesce((
      select count(*) from public.ai_action_requests
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'approved_requests', coalesce((
      select count(*) from public.ai_action_requests
      where organization_id = p_organization_id and status = 'approved'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._tre_workflow_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_workflows' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_workflows', coalesce((
      select count(*) from public.organization_workflows
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._tre_governance_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_policies' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_policies', coalesce((
      select count(*) from public.organization_policies
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'open_violations', coalesce((
      select count(*) from public.policy_violations
      where organization_id = p_organization_id and status = 'open'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._tre_delegated_trust_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_count int;
begin
  if not exists (select 1 from pg_tables where tablename = 'enterprise_delegated_admins' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  select count(*) into v_count
  from public.enterprise_delegated_admins
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'available', true,
    'delegated_admin_count', coalesce(v_count, 0),
    'delegated_trust_ready', coalesce(v_count, 0) > 0,
    'scopes', coalesce((
      select jsonb_agg(distinct scope)
      from public.enterprise_delegated_admins
      where organization_id = p_organization_id
    ), '[]'::jsonb),
    'scaffold_note', 'A.41 Delegated Trust — full policy engine ships in a future phase'
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._tre_capture_memory_hook(
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
    'trust_reputation',
    left(coalesce(p_summary, 'Trust & reputation outcome recorded'), 500),
    jsonb_build_object(
      'source', 'trust_reputation_engine',
      'outcome_id', p_outcome_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._tre_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._tre_ensure_settings(p_organization_id);

  return jsonb_build_object(
    'active_profiles', coalesce((
      select count(*) from public.organization_trust_profiles
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'trusted_profiles', coalesce((
      select count(*) from public.organization_trust_profiles
      where organization_id = p_organization_id and status = 'active'
        and trust_level in ('trusted', 'highly_trusted')
    ), 0),
    'under_review_profiles', coalesce((
      select count(*) from public.organization_trust_profiles
      where organization_id = p_organization_id and status = 'under_review'
    ), 0),
    'revoked_profiles', coalesce((
      select count(*) from public.organization_trust_profiles
      where organization_id = p_organization_id and status = 'revoked'
    ), 0),
    'avg_trust_score', coalesce((
      select round(avg(trust_score)::numeric, 1)
      from public.organization_trust_profiles
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'recent_signals', coalesce((
      select count(*) from public.organization_trust_signals s
      join public.organization_trust_profiles p on p.id = s.profile_id
      where p.organization_id = p_organization_id
        and s.recorded_at >= now() - interval '30 days'
    ), 0),
    'entity_type_count', coalesce((
      select count(distinct entity_type) from public.organization_trust_profiles
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
end; $$;

create or replace function public._tre_seed_profiles(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_profile_id uuid;
begin
  perform public._tre_ensure_settings(p_organization_id);

  if exists (select 1 from public.organization_trust_profiles where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.organization_trust_profiles (
    organization_id, entity_type, entity_id, trust_score, trust_level, metadata
  )
  values
    (
      p_organization_id, 'workflow', null, 72, 'trusted',
      '{"label":"Support escalation workflow","source":"workflow_orchestration_engine"}'::jsonb
    ),
    (
      p_organization_id, 'automation', null, 55, 'established',
      '{"label":"Ticket triage automation","source":"product_automation"}'::jsonb
    ),
    (
      p_organization_id, 'approval', null, 68, 'trusted',
      '{"label":"AI action approval chain","source":"secure_ai_action"}'::jsonb
    ),
    (
      p_organization_id, 'knowledge', null, 38, 'emerging',
      '{"label":"Knowledge contribution pipeline","source":"knowledge_center_engine"}'::jsonb
    ),
    (
      p_organization_id, 'support', null, 86, 'highly_trusted',
      '{"label":"Support quality baseline","source":"support_ai_engine"}'::jsonb
    ),
    (
      p_organization_id, 'governance', null, 58, 'established',
      '{"label":"Policy adherence monitoring","source":"governance_policy_engine"}'::jsonb
    );

  for v_profile_id in
    select id from public.organization_trust_profiles where organization_id = p_organization_id
  loop
    insert into public.organization_trust_signals (organization_id, profile_id, signal_type, signal_value, metadata)
    values
      (p_organization_id, v_profile_id, 'approval_accuracy', 82, '{"window_days":30}'::jsonb),
      (p_organization_id, v_profile_id, 'policy_adherence', 76, '{"window_days":30}'::jsonb);
  end loop;

  insert into public.organization_trust_outcomes (organization_id, profile_id, outcome_type, summary, metadata)
  select
    p_organization_id, p.id, 'success_pattern',
    'Consistent approval accuracy above threshold for ' || p.entity_type || ' entity.',
    jsonb_build_object('entity_type', p.entity_type, 'metadata_only', true)
  from public.organization_trust_profiles p
  where p.organization_id = p_organization_id and p.trust_level in ('trusted', 'highly_trusted')
  limit 3;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.upsert_organization_trust_profile(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_trust_profiles;
  v_entity_type text := coalesce(nullif(trim(p_payload->>'entity_type'), ''), 'workflow');
  v_entity_id uuid := nullif(p_payload->>'entity_id', '')::uuid;
  v_score numeric := coalesce((p_payload->>'trust_score')::numeric, 50);
  v_level text;
begin
  perform public._irp_require_permission('trust.manage');
  v_org_id := public._mta_require_organization();
  perform public._tre_ensure_settings(v_org_id);

  v_score := greatest(0, least(100, v_score));
  v_level := public._tre_score_to_level(v_score);

  insert into public.organization_trust_profiles (
    organization_id, entity_type, entity_id, trust_score, trust_level, metadata, updated_at
  )
  values (
    v_org_id, v_entity_type, v_entity_id, v_score, v_level,
    coalesce(p_payload->'metadata', '{}'::jsonb), now()
  )
  on conflict (organization_id, entity_type, entity_id)
  do update set
    trust_score = excluded.trust_score,
    trust_level = excluded.trust_level,
    metadata = organization_trust_profiles.metadata || excluded.metadata,
    status = case when organization_trust_profiles.status = 'revoked' then 'active' else organization_trust_profiles.status end,
    updated_at = now()
  returning * into v_row;

  perform public._tre_log(
    v_org_id, 'tre_profile_upserted', 'organization_trust_profile', v_row.id,
    jsonb_build_object('entity_type', v_row.entity_type, 'trust_score', v_row.trust_score)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_trust_level(
  p_profile_id uuid,
  p_level text,
  p_rationale text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_trust_profiles; v_settings public.organization_trust_settings;
begin
  perform public._irp_require_permission('trust.review');
  v_org_id := public._mta_require_organization();
  select * into v_settings from public.organization_trust_settings where organization_id = v_org_id;
  perform public._tre_ensure_settings(v_org_id);

  if p_level not in ('emerging', 'established', 'trusted', 'highly_trusted') then
    raise exception 'Invalid trust level';
  end if;

  if p_level = 'highly_trusted' and coalesce(v_settings.expansion_review_required, true) then
    update public.organization_trust_profiles
    set status = 'under_review', updated_at = now(),
        metadata = metadata || jsonb_build_object('pending_level', p_level, 'rationale', left(coalesce(p_rationale, ''), 500))
    where id = p_profile_id and organization_id = v_org_id and status = 'active'
    returning * into v_row;

    if v_row.id is null then raise exception 'Profile not found or not eligible for review'; end if;

    perform public._tre_log(
      v_org_id, 'tre_level_review_requested', 'organization_trust_profile', v_row.id,
      jsonb_build_object('requested_level', p_level)
    );

    return row_to_json(v_row)::jsonb;
  end if;

  update public.organization_trust_profiles
  set trust_level = p_level,
      trust_score = case p_level
        when 'highly_trusted' then greatest(trust_score, 80)
        when 'trusted' then greatest(trust_score, 60)
        when 'established' then greatest(trust_score, 40)
        else least(trust_score, 39)
      end,
      metadata = metadata || jsonb_build_object('level_rationale', left(coalesce(p_rationale, ''), 500)),
      updated_at = now()
  where id = p_profile_id and organization_id = v_org_id and status in ('active', 'under_review')
  returning * into v_row;

  if v_row.id is null then raise exception 'Profile not found'; end if;

  perform public._tre_log(
    v_org_id, 'tre_level_updated', 'organization_trust_profile', v_row.id,
    jsonb_build_object('trust_level', v_row.trust_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.revoke_organization_trust(
  p_profile_id uuid,
  p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_trust_profiles; v_outcome_id uuid;
begin
  perform public._irp_require_permission('trust.review');
  v_org_id := public._mta_require_organization();

  update public.organization_trust_profiles
  set status = 'revoked', trust_score = 0, trust_level = 'emerging', updated_at = now(),
      metadata = metadata || jsonb_build_object('revoke_reason', left(coalesce(p_reason, ''), 500), 'revoked_at', now())
  where id = p_profile_id and organization_id = v_org_id and status <> 'revoked'
  returning * into v_row;

  if v_row.id is null then raise exception 'Profile not found or already revoked'; end if;

  insert into public.organization_trust_outcomes (
    organization_id, profile_id, outcome_type, summary, metadata, recorded_by
  )
  values (
    v_org_id, v_row.id, 'revocation',
    left(coalesce(p_reason, 'Trust revoked by reviewer'), 500),
    jsonb_build_object('entity_type', v_row.entity_type, 'metadata_only', true),
    public._mta_app_user_id()
  )
  returning id into v_outcome_id;

  perform public._tre_capture_memory_hook(
    v_org_id, v_outcome_id,
    'Trust revoked for ' || v_row.entity_type || ' profile.',
    jsonb_build_object('profile_id', v_row.id)
  );

  perform public._tre_log(
    v_org_id, 'tre_trust_revoked', 'organization_trust_profile', v_row.id,
    jsonb_build_object('entity_type', v_row.entity_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_trust_reputation_signal(
  p_profile_id uuid,
  p_signal_type text,
  p_signal_value numeric default 0,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_profile public.organization_trust_profiles; v_signal public.organization_trust_signals;
  v_avg numeric; v_new_score numeric;
begin
  perform public._irp_require_permission('trust.manage');
  v_org_id := public._mta_require_organization();

  select * into v_profile
  from public.organization_trust_profiles
  where id = p_profile_id and organization_id = v_org_id and status = 'active';

  if v_profile.id is null then raise exception 'Active trust profile not found'; end if;

  if p_signal_type not in (
    'approval_accuracy', 'task_completion', 'support_quality',
    'knowledge_contribution', 'policy_adherence', 'positive_audit'
  ) then
    raise exception 'Invalid signal type';
  end if;

  insert into public.organization_trust_signals (
    organization_id, profile_id, signal_type, signal_value, metadata
  )
  values (
    v_org_id, p_profile_id, p_signal_type,
    greatest(0, least(100, coalesce(p_signal_value, 0))),
    coalesce(p_metadata, '{}'::jsonb) || '{"metadata_only":true}'::jsonb
  )
  returning * into v_signal;

  select avg(signal_value) into v_avg
  from public.organization_trust_signals
  where profile_id = p_profile_id
    and recorded_at >= now() - interval '90 days';

  v_new_score := round(coalesce(v_avg, v_profile.trust_score)::numeric, 2);

  update public.organization_trust_profiles
  set trust_score = v_new_score,
      trust_level = public._tre_score_to_level(v_new_score),
      updated_at = now()
  where id = p_profile_id
  returning * into v_profile;

  perform public._tre_log(
    v_org_id, 'tre_signal_recorded', 'organization_trust_signal', v_signal.id,
    jsonb_build_object('signal_type', p_signal_type, 'signal_value', v_signal.signal_value)
  );

  return jsonb_build_object('signal', row_to_json(v_signal), 'profile', row_to_json(v_profile));
end; $$;

create or replace function public.review_trust_expansion(
  p_profile_id uuid,
  p_approved boolean,
  p_rationale text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_trust_profiles;
  v_pending_level text;
  v_outcome_id uuid;
begin
  perform public._irp_require_permission('trust.review');
  v_org_id := public._mta_require_organization();

  select * into v_row
  from public.organization_trust_profiles
  where id = p_profile_id and organization_id = v_org_id and status = 'under_review';

  if v_row.id is null then raise exception 'Profile not under review'; end if;

  v_pending_level := coalesce(v_row.metadata->>'pending_level', 'highly_trusted');

  if p_approved then
    update public.organization_trust_profiles
    set status = 'active',
        trust_level = v_pending_level,
        trust_score = case v_pending_level
          when 'highly_trusted' then greatest(trust_score, 80)
          when 'trusted' then greatest(trust_score, 60)
          when 'established' then greatest(trust_score, 40)
          else trust_score
        end,
        metadata = metadata - 'pending_level' || jsonb_build_object('expansion_rationale', left(coalesce(p_rationale, ''), 500)),
        updated_at = now()
    where id = p_profile_id
    returning * into v_row;

    insert into public.organization_trust_outcomes (
      organization_id, profile_id, outcome_type, summary, metadata, recorded_by
    )
    values (
      v_org_id, v_row.id, 'expansion_approved',
      'Trust expansion approved to ' || v_pending_level || ' for ' || v_row.entity_type || '.',
      jsonb_build_object('entity_type', v_row.entity_type, 'approved_level', v_pending_level),
      public._mta_app_user_id()
    )
    returning id into v_outcome_id;

    perform public._tre_capture_memory_hook(
      v_org_id, v_outcome_id,
      'Trust expansion approved for ' || v_row.entity_type || '.',
      jsonb_build_object('profile_id', v_row.id, 'level', v_pending_level)
    );
  else
    update public.organization_trust_profiles
    set status = 'active',
        metadata = metadata - 'pending_level' || jsonb_build_object('expansion_rejected', left(coalesce(p_rationale, ''), 500)),
        updated_at = now()
    where id = p_profile_id
    returning * into v_row;

    insert into public.organization_trust_outcomes (
      organization_id, profile_id, outcome_type, summary, metadata, recorded_by
    )
    values (
      v_org_id, v_row.id, 'expansion_rejected',
      'Trust expansion rejected for ' || v_row.entity_type || '.',
      jsonb_build_object('entity_type', v_row.entity_type, 'requested_level', v_pending_level),
      public._mta_app_user_id()
    )
    returning id into v_outcome_id;
  end if;

  perform public._tre_log(
    v_org_id, 'tre_expansion_reviewed', 'organization_trust_profile', v_row.id,
    jsonb_build_object('approved', p_approved, 'level', v_pending_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.export_trust_reputation_manifest(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('trust.export');
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);

  perform public._tre_log(
    v_org_id, 'tre_manifest_exported', 'organization_trust_profile', null,
    jsonb_build_object('format', p_format)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'trust_reputation',
    'format', coalesce(p_format, 'json'),
    'profiles', coalesce((
      select jsonb_agg(row_to_json(p) order by p.trust_score desc, p.entity_type)
      from public.organization_trust_profiles p
      where p.organization_id = v_org_id
      limit 100
    ), '[]'::jsonb),
    'recent_signals', coalesce((
      select jsonb_agg(row_to_json(s) order by s.recorded_at desc)
      from public.organization_trust_signals s
      join public.organization_trust_profiles p on p.id = s.profile_id
      where p.organization_id = v_org_id
      limit 50
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.created_at desc)
      from public.organization_trust_outcomes o
      where o.organization_id = v_org_id
      limit 50
    ), '[]'::jsonb),
    'summary', public._tre_executive_summary_block(v_org_id),
    'integration_summaries', jsonb_build_object(
      'human_oversight', public._tre_human_oversight_summary(v_org_id),
      'secure_ai_actions', public._tre_secure_ai_actions_summary(v_org_id),
      'workflow_orchestration', public._tre_workflow_summary(v_org_id),
      'governance_policy', public._tre_governance_summary(v_org_id),
      'enterprise_delegated_admins', public._tre_delegated_trust_summary(v_org_id)
    )
  );
end; $$;

create or replace function public.get_executive_trust_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('trust.view');
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'summary', public._tre_executive_summary_block(v_org_id),
    'trusted_workflows', coalesce((
      select jsonb_agg(row_to_json(p) order by p.trust_score desc)
      from public.organization_trust_profiles p
      where p.organization_id = v_org_id and p.status = 'active'
        and p.entity_type in ('workflow', 'automation')
        and p.trust_level in ('trusted', 'highly_trusted')
      limit 10
    ), '[]'::jsonb),
    'under_review', coalesce((
      select jsonb_agg(row_to_json(p) order by p.updated_at desc)
      from public.organization_trust_profiles p
      where p.organization_id = v_org_id and p.status = 'under_review'
      limit 10
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_trust_reputation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('trust.view');
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Earned trust through transparent reputation signals — metadata only, humans review expansion.',
    'principles', jsonb_build_array(
      'Metadata-only reputation signals',
      'Entity-scoped trust profiles',
      'Human review for trust expansion',
      'Revocation with audit trail',
      'Delegated trust hooks for enterprise admins'
    ),
    'summary', public._tre_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'trust_profiles', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc, p.entity_type)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status in ('active', 'under_review')
        limit 40
      ), '[]'::jsonb),
      'trust_trends', coalesce((
        select jsonb_agg(jsonb_build_object(
          'entity_type', p.entity_type,
          'avg_score', round(avg(p.trust_score)::numeric, 1),
          'profile_count', count(*),
          'trusted_count', count(*) filter (where p.trust_level in ('trusted', 'highly_trusted'))
        ) order by avg(p.trust_score) desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
        group by p.entity_type
      ), '[]'::jsonb),
      'trusted_workflows', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
          and p.entity_type in ('workflow', 'automation')
          and p.trust_level in ('trusted', 'highly_trusted')
        limit 20
      ), '[]'::jsonb),
      'approval_quality', coalesce((
        select jsonb_agg(jsonb_build_object(
          'signal_type', s.signal_type,
          'avg_value', round(avg(s.signal_value)::numeric, 1),
          'signal_count', count(*)
        ) order by avg(s.signal_value) desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
          and s.signal_type in ('approval_accuracy', 'policy_adherence', 'positive_audit')
          and s.recorded_at >= now() - interval '90 days'
        group by s.signal_type
      ), '[]'::jsonb),
      'reputation_indicators', coalesce((
        select jsonb_agg(row_to_json(s) order by s.recorded_at desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'recent_outcomes', coalesce((
        select jsonb_agg(row_to_json(o) order by o.created_at desc)
        from public.organization_trust_outcomes o
        where o.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb)
    ),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_trust_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._tre_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'human_oversight', 'Oversight approvals inform trust expansion decisions — A.40',
      'secure_ai_actions', 'AI action approval accuracy feeds reputation signals — A.3',
      'workflow_orchestration', 'Workflow execution patterns contribute to workflow trust — A.42',
      'governance_policy', 'Policy adherence signals strengthen governance trust — A.14',
      'enterprise_delegated_admins', 'Delegated admin scopes enable enterprise trust delegation — A.30/A.41'
    ),
    'integration_summaries', jsonb_build_object(
      'human_oversight', public._tre_human_oversight_summary(v_org_id),
      'secure_ai_actions', public._tre_secure_ai_actions_summary(v_org_id),
      'workflow_orchestration', public._tre_workflow_summary(v_org_id),
      'governance_policy', public._tre_governance_summary(v_org_id),
      'enterprise_delegated_admins', public._tre_delegated_trust_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_trust_reputation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);
  v_summary := public._tre_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Trust & Reputation — earned trust through transparent metadata signals.',
    'active_profiles', v_summary->'active_profiles',
    'trusted_profiles', v_summary->'trusted_profiles',
    'under_review_profiles', v_summary->'under_review_profiles',
    'avg_trust_score', v_summary->'avg_trust_score'
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
    'tre_profile_upserted', 'tre_level_updated', 'tre_level_review_requested',
    'tre_trust_revoked', 'tre_signal_recorded', 'tre_expansion_reviewed', 'tre_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'trust-reputation-engine', 'Trust & Reputation Engine', 'Organizational trust profiles and metadata-only reputation signals with human-reviewed expansion — distinct from legacy Trust Engine.', 'authenticated', 99
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'trust-reputation-engine' and tenant_id is null);

grant execute on function public.upsert_organization_trust_profile(jsonb) to authenticated;
grant execute on function public.update_trust_level(uuid, text, text) to authenticated;
grant execute on function public.revoke_organization_trust(uuid, text) to authenticated;
grant execute on function public.record_trust_reputation_signal(uuid, text, numeric, jsonb) to authenticated;
grant execute on function public.review_trust_expansion(uuid, boolean, text) to authenticated;
grant execute on function public.export_trust_reputation_manifest(text) to authenticated;
grant execute on function public.get_executive_trust_summary() to authenticated;
grant execute on function public.get_trust_reputation_engine_dashboard() to authenticated;
grant execute on function public.get_trust_reputation_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._tre_seed_profiles(v_org_id);
  end loop;
end $$;
