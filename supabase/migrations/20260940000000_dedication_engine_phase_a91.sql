-- Phase A.91 — Dedication Engine (ABOS)
-- Persistent companion support philosophy — follow-through, balanced perseverance, dependable help.
-- Distinct from Proactive Companion A.79, Resilience Engine A.50, Trust Engine Phase 76, Unified Task Follow-Up A.62.

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
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine',
    'impact_engine',
    'legacy_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'gratitude_recognition_engine',
    'presence_comfort_protocol',
    'dedication_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_dedication_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_dedication_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  persistence_messaging_enabled boolean not null default true,
  balance_with_self_love boolean not null default true,
  max_retry_explorations int not null default 3 check (max_retry_explorations between 1 and 10),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_dedication_settings enable row level security;
revoke all on public.organization_dedication_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_dedication_signals (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_dedication_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'solution_retry', 'clarification_requested', 'alternative_offered',
      'task_persistence', 'progress_acknowledged'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_dedication_signals_org_idx
  on public.organization_dedication_signals (organization_id, signal_type, created_at desc);

alter table public.organization_dedication_signals enable row level security;
revoke all on public.organization_dedication_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_dedication_commitments (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_dedication_commitments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  commitment_type text not null check (
    commitment_type in (
      'solution_follow_through', 'complex_task_support', 'continued_exploration',
      'patient_assistance', 'progress_commitment'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('active', 'completed', 'paused')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_dedication_commitments_org_idx
  on public.organization_dedication_commitments (organization_id, status, created_at desc);

alter table public.organization_dedication_commitments enable row level security;
revoke all on public.organization_dedication_commitments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'dedication_engine', v.description
from (values
  ('dedication_engine.view', 'View Dedication Engine', 'View dedication dashboard and follow-through patterns'),
  ('dedication_engine.manage', 'Manage Dedication Engine', 'Update dedication settings'),
  ('dedication_engine.export', 'Export Dedication Engine', 'Export dedication and perseverance reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'dedication_engine.view'), ('owner', 'dedication_engine.manage'),
  ('owner', 'dedication_engine.export'),
  ('administrator', 'dedication_engine.view'), ('administrator', 'dedication_engine.manage'),
  ('administrator', 'dedication_engine.export'),
  ('manager', 'dedication_engine.view'), ('manager', 'dedication_engine.manage'),
  ('manager', 'dedication_engine.export'),
  ('employee', 'dedication_engine.view'),
  ('support_agent', 'dedication_engine.view'),
  ('moderator', 'dedication_engine.view'),
  ('viewer', 'dedication_engine.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_ded_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ded_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'ded_' || p_action_type,
    'dedication_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._ded_ensure_settings(p_organization_id uuid)
returns public.organization_dedication_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_dedication_settings;
begin
  insert into public.organization_dedication_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_dedication_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._ded_dedication_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'explore_solutions',
      'label', 'Explore solutions',
      'description', 'Try another path before concluding something cannot be done.'
    ),
    jsonb_build_object(
      'key', 'clarify',
      'label', 'Clarify',
      'description', 'Ask what matters most when the goal or constraint is unclear.'
    ),
    jsonb_build_object(
      'key', 'offer_alternatives',
      'label', 'Offer alternatives',
      'description', 'Present options so people can choose the next best step together.'
    ),
    jsonb_build_object(
      'key', 'learn_from_failures',
      'label', 'Learn from failures',
      'description', 'Treat setbacks as information — adjust and try again with patience.'
    ),
    jsonb_build_object(
      'key', 'patient_support',
      'label', 'Patient support',
      'description', 'Stay present for complex work without rushing or giving up early.'
    ),
    jsonb_build_object(
      'key', 'complex_task_support',
      'label', 'Complex task support',
      'description', 'Break down hard problems and continue assisting across sessions.'
    )
  );
$$;

create or replace function public._ded_example_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Let me explore another approach.',
    'Could you clarify what outcome matters most here?',
    'Here is an alternative we can try together.',
    'That did not work yet — let us learn from it and adjust.',
    'Complex work takes time — I will stay with you on this.',
    'We made progress today; we can continue tomorrow.',
    'I will do my best — I may need a bit more information to help.',
    'Let us explore this together step by step.'
  );
$$;

create or replace function public._ded_boundary_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'avoid', jsonb_build_array(
      'I can solve everything',
      'I will never fail',
      'Guaranteed perfect outcomes',
      'No limits — work until exhaustion',
      'Abandoning support when the first attempt fails'
    ),
    'prefer', jsonb_build_array(
      'I will do my best',
      'I may need more information',
      'Let us explore this together',
      'We made progress — we can continue tomorrow',
      'Dependable support with healthy boundaries'
    )
  );
$$;

create or replace function public._ded_hard_work_balance_note()
returns text language sql immutable as $$
  select 'Hard work with balance — sustainable effort, rest, and healthy boundaries. Dedication does not glorify exhaustion; Self Love includes knowing when to pause and return refreshed.';
$$;

create or replace function public._ded_self_love_note()
returns text language sql immutable as $$
  select 'Self Love means sustainable perseverance — honoring rest, protecting focus, and celebrating small steps without demanding perfection from yourself or others.';
$$;

create or replace function public._ded_proactive_companion_note()
returns text language sql immutable as $$
  select 'Proactive Companion A.79 offers timely organizational nudges. Dedication Engine governs how Aipify persists in support — progress today, unfinished but meaningful, continue tomorrow with small dependable steps.';
$$;

create or replace function public._ded_trust_note()
returns text language sql immutable as $$
  select 'Follow through with honest communication — dependable continued support. Metadata only: signal and commitment summaries (max 500 chars), never raw conversations or PII.';
$$;

create or replace function public._ded_signal_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'solution_retry', 'label', 'Solution retry', 'description', 'Another approach attempted after an initial attempt did not succeed.'),
    jsonb_build_object('key', 'clarification_requested', 'label', 'Clarification requested', 'description', 'Asked for clarity to support the right next step.'),
    jsonb_build_object('key', 'alternative_offered', 'label', 'Alternative offered', 'description', 'Presented an alternative path or option.'),
    jsonb_build_object('key', 'task_persistence', 'label', 'Task persistence', 'description', 'Continued support on a complex or multi-step task.'),
    jsonb_build_object('key', 'progress_acknowledged', 'label', 'Progress acknowledged', 'description', 'Recognized meaningful progress even when work remains unfinished.')
  );
$$;

create or replace function public._ded_seed_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_dedication_signals
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_dedication_signals (
    organization_id, signal_type, summary, metadata
  ) values
    (p_organization_id, 'solution_retry',
     'Explored a second approach after the first integration path did not resolve the issue.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'clarification_requested',
     'Asked which outcome mattered most before recommending next steps on a complex workflow.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'alternative_offered',
     'Offered an alternative configuration path when the preferred option was unavailable.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'task_persistence',
     'Continued multi-step support on a lengthy data migration task across sessions.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'progress_acknowledged',
     'Acknowledged meaningful progress today — remaining work scheduled to continue tomorrow.',
     '{"seed": true, "metadata_only": true}'::jsonb);

  insert into public.organization_dedication_commitments (
    organization_id, commitment_type, summary, status, metadata
  ) values
    (p_organization_id, 'solution_follow_through',
     'Follow through on resolving the customer onboarding blocker — active exploration in progress.',
     'active', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'complex_task_support',
     'Sustained assistance on quarterly reporting automation — complex, multi-phase work.',
     'active', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'continued_exploration',
     'Continue exploring integration options until a dependable path is confirmed.',
     'active', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'patient_assistance',
     'Patient support for a new team learning Aipify modules — pace respects their schedule.',
     'paused', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'progress_commitment',
     'Documented progress on workflow cleanup — completed phase one; phase two next week.',
     'completed', '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_dedication_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_dedication_settings;
  v_max_retry int;
begin
  perform public._irp_require_permission('dedication_engine.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._ded_ensure_settings(v_org_id);

  if p_payload ? 'max_retry_explorations' then
    v_max_retry := (p_payload->>'max_retry_explorations')::int;
    if v_max_retry < 1 or v_max_retry > 10 then
      raise exception 'max_retry_explorations must be between 1 and 10';
    end if;
  end if;

  update public.organization_dedication_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    persistence_messaging_enabled = coalesce(
      (p_payload->>'persistence_messaging_enabled')::boolean, persistence_messaging_enabled
    ),
    balance_with_self_love = coalesce(
      (p_payload->>'balance_with_self_love')::boolean, balance_with_self_love
    ),
    max_retry_explorations = coalesce(
      (p_payload->>'max_retry_explorations')::int, max_retry_explorations
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ded_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'persistence_messaging_enabled', v_row.persistence_messaging_enabled,
    'max_retry_explorations', v_row.max_retry_explorations,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_dedication_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_signals int := 0;
  v_commitments int := 0;
  v_active int := 0;
begin
  perform public._irp_require_permission('dedication_engine.view');
  v_org_id := public._mta_require_organization();
  perform public._ded_ensure_settings(v_org_id);
  perform public._ded_seed_data(v_org_id);

  select count(*) into v_signals
  from public.organization_dedication_signals where organization_id = v_org_id;

  select count(*) into v_commitments
  from public.organization_dedication_commitments where organization_id = v_org_id;

  select count(*) into v_active
  from public.organization_dedication_commitments
  where organization_id = v_org_id and status = 'active';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Effort, consistency, and showing up — dependable support that is persistent, not perfect.',
    'signal_count', v_signals,
    'commitment_count', v_commitments,
    'active_commitments', v_active,
    'enabled', (select enabled from public.organization_dedication_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_dedication_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_dedication_settings;
begin
  perform public._irp_require_permission('dedication_engine.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._ded_ensure_settings(v_org_id);
  perform public._ded_seed_data(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Effort, consistency, and showing up — dependable support that is persistent, not perfect.',
    'mission',
      'Consistent, diligent, dependable support so people move forward with confidence.',
    'abos_principle',
      'Dedication means continuing to care enough to try again — not perfection.',
    'vision',
      'A diligent, consistent, committed companion — designed to help people move forward.',
    'distinction_note',
      'Distinct from Proactive Companion A.79 (timely nudges), Resilience Engine ABOS/A.50 (crisis recovery), Trust Engine Phase 76 (decision explainability), and Unified Task Follow-Up A.62 (task tracking). Dedication = persistent companion support philosophy, follow-through patterns, balanced perseverance.',
    'dedication_principles', public._ded_dedication_principles(),
    'example_phrases', public._ded_example_phrases(),
    'signal_types', public._ded_signal_types(),
    'hard_work_balance_note', public._ded_hard_work_balance_note(),
    'self_love_note', public._ded_self_love_note(),
    'proactive_companion_note', public._ded_proactive_companion_note(),
    'trust_note', public._ded_trust_note(),
    'boundary_phrases', public._ded_boundary_phrases(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'metadata', s.metadata,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_dedication_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'active_commitments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'commitment_type', c.commitment_type,
          'summary', c.summary,
          'status', c.status,
          'metadata', c.metadata,
          'created_at', c.created_at,
          'updated_at', c.updated_at
        ) order by c.updated_at desc
      )
      from (
        select * from public.organization_dedication_commitments
        where organization_id = v_org_id and status = 'active'
        order by updated_at desc
        limit 10
      ) c
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_dedication_signals where organization_id = v_org_id
      ), 0),
      'signals_by_type', coalesce((
        select jsonb_object_agg(signal_type, cnt)
        from (
          select signal_type, count(*) as cnt
          from public.organization_dedication_signals
          where organization_id = v_org_id
          group by signal_type
        ) t
      ), '{}'::jsonb),
      'commitment_count', coalesce((
        select count(*) from public.organization_dedication_commitments where organization_id = v_org_id
      ), 0),
      'commitments_by_status', coalesce((
        select jsonb_object_agg(status, cnt)
        from (
          select status, count(*) as cnt
          from public.organization_dedication_commitments
          where organization_id = v_org_id
          group by status
        ) st
      ), '{}'::jsonb),
      'active_commitment_count', coalesce((
        select count(*) from public.organization_dedication_commitments
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'persistence_messaging_enabled', v_settings.persistence_messaging_enabled,
      'balance_with_self_love', v_settings.balance_with_self_love,
      'max_retry_explorations', v_settings.max_retry_explorations
    ),
    'integration_links', jsonb_build_object(
      'proactive_companion', '/app/proactive-companion-engine',
      'organizational_resilience', '/app/organizational-resilience-engine',
      'trust_engine', '/app/trust',
      'unified_task_follow_up', '/app/unified-task-follow-up-engine',
      'companion_identity', '/app/companion-identity-engine',
      'impact_engine', '/app/impact-engine',
      'purpose_values', '/app/purpose-values-engine',
      'presence_comfort', '/app/presence-comfort-protocol'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('dedication_engine.manage'),
      'can_export', public._irp_has_permission('dedication_engine.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_dedication_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_dedication_settings;
begin
  perform public._irp_require_permission('dedication_engine.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._ded_ensure_settings(v_org_id);
  perform public._ded_seed_data(v_org_id);

  perform public._ded_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'dedication_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy',
      'Effort, consistency, and showing up — dependable support that is persistent, not perfect.',
    'mission',
      'Consistent, diligent, dependable support so people move forward with confidence.',
    'abos_principle',
      'Dedication means continuing to care enough to try again — not perfection.',
    'vision',
      'A diligent, consistent, committed companion — designed to help people move forward.',
    'dedication_principles', public._ded_dedication_principles(),
    'example_phrases', public._ded_example_phrases(),
    'signal_types', public._ded_signal_types(),
    'hard_work_balance_note', public._ded_hard_work_balance_note(),
    'self_love_note', public._ded_self_love_note(),
    'proactive_companion_note', public._ded_proactive_companion_note(),
    'trust_note', public._ded_trust_note(),
    'boundary_phrases', public._ded_boundary_phrases(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_dedication_signals s
      where s.organization_id = v_org_id
      order by s.created_at desc
      limit 50
    ), '[]'::jsonb),
    'active_commitments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'commitment_type', c.commitment_type,
          'summary', c.summary,
          'status', c.status,
          'created_at', c.created_at
        ) order by c.updated_at desc
      )
      from public.organization_dedication_commitments c
      where c.organization_id = v_org_id
      order by c.updated_at desc
      limit 50
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_dedication_signals where organization_id = v_org_id
      ), 0),
      'commitment_count', coalesce((
        select count(*) from public.organization_dedication_commitments where organization_id = v_org_id
      ), 0),
      'active_commitment_count', coalesce((
        select count(*) from public.organization_dedication_commitments
        where organization_id = v_org_id and status = 'active'
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('dedication_engine.manage'),
      'can_export', true
    )
  );
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
    'rrme_disposal_requested', 'rrme_disposal_rejected', 'rrme_disposal_approved', 'rrme_disposal_completed',
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
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed',
    'pce_nudge_dismissed', 'pce_nudge_snoozed', 'pce_nudge_acted',
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported',
    'pfe_item_created', 'pfe_item_updated', 'pfe_recommendation_resolved',
    'pfe_org_settings_changed', 'pfe_summary_exported',
    'pve_value_upserted', 'pve_settings_changed', 'pve_reflection_acknowledged',
    'pve_reflection_dismissed', 'pve_report_exported',
    'ihe_settings_changed', 'ihe_reflection_acknowledged', 'ihe_reflection_dismissed',
    'ihe_report_exported',
    'cie_settings_changed', 'cie_report_exported',
    'ime_settings_changed', 'ime_summary_generated', 'ime_report_exported',
    'leg_settings_changed', 'leg_milestone_acknowledged', 'leg_report_exported',
    'cde_settings_changed', 'cde_prompt_explored', 'cde_prompt_dismissed', 'cde_report_exported',
    'wne_settings_changed', 'wne_reflection_acknowledged', 'wne_reflection_dismissed',
    'wne_moment_acknowledged', 'wne_report_exported',
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported',
    'pcp_settings_changed', 'pcp_comfort_moment_recorded', 'pcp_report_exported',
    'ded_settings_changed', 'ded_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%'
    or p_action_type like 'cde_%' or p_action_type like 'wne_%' or p_action_type like 'gre_%'
    or p_action_type like 'pcp_%' or p_action_type like 'ded_%';
$$;

-- ---------------------------------------------------------------------------
-- 9. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'dedication-engine', 'Dedication Engine',
  'Persistent companion support philosophy — follow-through patterns, balanced perseverance, and dependable help.',
  'authenticated', 110
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'dedication-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_dedication_engine_card() to authenticated;
grant execute on function public.get_dedication_engine_dashboard() to authenticated;
grant execute on function public.update_dedication_settings(jsonb) to authenticated;
grant execute on function public.export_dedication_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 11. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._ded_ensure_settings(v_org_id);
    perform public._ded_seed_data(v_org_id);
  end loop;
end; $$;
