-- Phase A.80 — Priority & Focus Engine
-- Organizational ABOS engine for priority dimensions and P1–P4 framework with focus support.
-- Distinct from TAG Phase 37 (personal focus) and Goals & OKR A.65 (objectives/key results).

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
    'priority_focus_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_priority_focus_settings (org defaults)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_priority_focus_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  enabled_dimensions jsonb not null default '["operational","strategic","human","knowledge","relationship"]'::jsonb,
  default_priority_level int not null default 3 check (default_priority_level between 1 and 4),
  focus_mode_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_priority_focus_settings enable row level security;
revoke all on public.organization_priority_focus_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_priority_items (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_priority_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dimension text not null check (
    dimension in ('operational', 'strategic', 'human', 'knowledge', 'relationship')
  ),
  priority_level int not null check (priority_level between 1 and 4),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('active', 'completed', 'paused', 'archived')
  ),
  due_hint text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_priority_items_org_level_idx
  on public.organization_priority_items (organization_id, priority_level, status, updated_at desc);
create index if not exists organization_priority_items_org_dimension_idx
  on public.organization_priority_items (organization_id, dimension, status);

alter table public.organization_priority_items enable row level security;
revoke all on public.organization_priority_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_focus_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_focus_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null check (
    recommendation_type in ('focus_suggestion', 'reprioritize', 'wellbeing', 'capacity', 'alignment')
  ),
  summary text not null check (char_length(summary) <= 500),
  priority_level int check (priority_level between 1 and 4),
  status text not null default 'pending' check (
    status in ('pending', 'resolved', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_focus_recommendations_org_status_idx
  on public.organization_focus_recommendations (organization_id, status, priority_level);

alter table public.organization_focus_recommendations enable row level security;
revoke all on public.organization_focus_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_priority_focus_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_priority_focus_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  action_type text not null check (
    action_type in (
      'item_created', 'item_updated', 'recommendation_resolved',
      'org_settings_changed', 'summary_exported'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_priority_focus_audit_org_idx
  on public.organization_priority_focus_audit_logs (organization_id, created_at desc);

alter table public.organization_priority_focus_audit_logs enable row level security;
revoke all on public.organization_priority_focus_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
alter table public.organization_role_permissions drop constraint if exists organization_role_permissions_role_check;
alter table public.organization_role_permissions add constraint organization_role_permissions_role_check check (
  role in ('owner', 'administrator', 'manager', 'support_agent', 'viewer', 'employee', 'moderator')
);

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'priority_focus', v.description
from (values
  ('priority_focus.view', 'View Priority & Focus', 'View priority and focus dashboard and items'),
  ('priority_focus.manage', 'Manage Priority & Focus', 'Create and update organizational priority items and settings'),
  ('priority_focus.recommendations.resolve', 'Resolve Focus Recommendations', 'Resolve or dismiss focus recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'priority_focus.view'), ('owner', 'priority_focus.manage'),
  ('owner', 'priority_focus.recommendations.resolve'),
  ('administrator', 'priority_focus.view'), ('administrator', 'priority_focus.manage'),
  ('administrator', 'priority_focus.recommendations.resolve'),
  ('manager', 'priority_focus.view'), ('manager', 'priority_focus.manage'),
  ('manager', 'priority_focus.recommendations.resolve'),
  ('employee', 'priority_focus.view'), ('employee', 'priority_focus.recommendations.resolve'),
  ('support_agent', 'priority_focus.view'), ('support_agent', 'priority_focus.recommendations.resolve'),
  ('moderator', 'priority_focus.view'), ('moderator', 'priority_focus.recommendations.resolve'),
  ('viewer', 'priority_focus.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_pfe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._pfe_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_priority_focus_audit_logs (
    organization_id, user_id, action_type, metadata
  ) values (
    p_organization_id, p_user_id, p_action_type, coalesce(p_metadata, '{}'::jsonb)
  );

  perform public._mta_create_audit_log(
    p_organization_id,
    'pfe_' || p_action_type,
    'priority_focus',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._pfe_ensure_settings(p_organization_id uuid)
returns public.organization_priority_focus_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_priority_focus_settings;
begin
  insert into public.organization_priority_focus_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_priority_focus_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._pfe_priority_dimensions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational', 'label', 'Operational', 'description', 'Day-to-day workflows, approvals, and operational readiness that keep the organization running.'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic', 'description', 'Longer-horizon initiatives, alignment, and decisions that shape organizational direction.'),
    jsonb_build_object('key', 'human', 'label', 'Human', 'description', 'People wellbeing, capacity, and sustainable pace — never pressure or guilt.'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge', 'description', 'Approved documentation, learning gaps, and knowledge readiness across teams.'),
    jsonb_build_object('key', 'relationship', 'label', 'Relationship', 'description', 'Customer, partner, and team relationship context — coordination without surveillance.')
  );
$$;

create or replace function public._pfe_priority_levels()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'code', 'P1', 'label', 'Critical', 'description', 'Requires attention soon — organizational impact if delayed.'),
    jsonb_build_object('level', 2, 'code', 'P2', 'label', 'Important', 'description', 'Significant value — schedule deliberately without urgency pressure.'),
    jsonb_build_object('level', 3, 'code', 'P3', 'label', 'Planned', 'description', 'Scheduled work that supports steady progress.'),
    jsonb_build_object('level', 4, 'code', 'P4', 'label', 'Optional', 'description', 'Nice-to-have improvements — safe to defer when capacity is limited.')
  );
$$;

create or replace function public._pfe_focus_support()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Clarity over volume — fewer priorities with clear levels beat long undifferentiated lists',
    'Human wellbeing first — capacity and rest are valid inputs to prioritization',
    'Gentle focus cues — suggest where attention may help; never shame or guilt',
    'Integration-aware — links to tasks, OKRs, capacity, and executive insights for context',
    'Self Love monitors overload — may soften recommendations when fatigue signals appear'
  );
$$;

create or replace function public._pfe_proactive_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('example', 'You have two P1 operational items — would you like a calm summary before your next meeting?'),
    jsonb_build_object('example', 'Strategic review window opens tomorrow — P2 items are ready when you have capacity.'),
    jsonb_build_object('example', 'Human dimension note: workload signals suggest protecting focus time this afternoon.'),
    jsonb_build_object('example', 'Knowledge dimension: one approved article review aligns with your P3 planned list.')
  );
$$;

create or replace function public._pfe_executive_insights_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_p1 int := 0;
  v_p2 int := 0;
  v_active int := 0;
begin
  select
    count(*) filter (where priority_level = 1 and status = 'active'),
    count(*) filter (where priority_level = 2 and status = 'active'),
    count(*) filter (where status = 'active')
  into v_p1, v_p2, v_active
  from public.organization_priority_items
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'active_items', v_active,
    'p1_count', v_p1,
    'p2_count', v_p2,
    'summary', case
      when v_p1 > 0 then format('%s critical (P1) and %s important (P2) items need organizational attention — review with calm focus.', v_p1, v_p2)
      when v_p2 > 0 then format('%s important (P2) items are active — strategic and operational balance looks manageable.', v_p2)
      else 'Priority landscape is steady — planned and optional work can proceed at a sustainable pace.'
    end,
    'metadata_only', true
  );
end; $$;

create or replace function public._pfe_active_items_by_level(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_object_agg(
      'p' || priority_level::text,
      item_count
    )
    from (
      select priority_level, count(*) as item_count
      from public.organization_priority_items
      where organization_id = p_organization_id and status = 'active'
      group by priority_level
    ) s
  ), '{"p1":0,"p2":0,"p3":0,"p4":0}'::jsonb);
end; $$;

create or replace function public._pfe_seed_items(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_priority_items
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_priority_items (
    organization_id, dimension, priority_level, title, summary, status, due_hint, metadata
  ) values
    (p_organization_id, 'operational', 1, 'Weekly operational review readiness',
     'Prepare open approvals and task summary before the weekly operations sync.',
     'active', 'This week', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'strategic', 2, 'Quarterly alignment checkpoint',
     'Review strategic initiatives against current OKR progress — metadata summary only.',
     'active', 'Next month', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'human', 2, 'Sustainable workload review',
     'Check capacity signals and protect focus blocks — wellbeing without guilt.',
     'active', 'Ongoing', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'knowledge', 3, 'Approved knowledge refresh',
     'Two documentation items may benefit from review based on support patterns.',
     'active', 'When convenient', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'relationship', 3, 'Partner coordination window',
     'Shared milestone approaching — coordinate handoffs without individual monitoring.',
     'active', 'This month', '{"seed": true, "metadata_only": true}'::jsonb);

  if not exists (
    select 1 from public.organization_focus_recommendations
    where organization_id = p_organization_id
    limit 1
  ) then
    insert into public.organization_focus_recommendations (
      organization_id, recommendation_type, summary, priority_level, status, metadata
    ) values
      (p_organization_id, 'focus_suggestion',
       'Consider reviewing P1 operational items during your next focus block — no urgency pressure.',
       1, 'pending', '{"seed": true, "metadata_only": true}'::jsonb),
      (p_organization_id, 'wellbeing',
       'Human dimension suggests protecting afternoon focus time when capacity signals are elevated.',
       2, 'pending', '{"seed": true, "metadata_only": true}'::jsonb),
      (p_organization_id, 'alignment',
       'Strategic P2 item aligns with Goals & OKR progress — review when convenient.',
       2, 'pending', '{"seed": true, "metadata_only": true}'::jsonb);
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. list_priority_focus_items
-- ---------------------------------------------------------------------------
create or replace function public.list_priority_focus_items(
  p_status text default 'active',
  p_priority_level int default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('priority_focus.view');
  v_org_id := public._mta_require_organization();
  perform public._pfe_seed_items(v_org_id);

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', i.id,
        'dimension', i.dimension,
        'priority_level', i.priority_level,
        'title', i.title,
        'summary', i.summary,
        'status', i.status,
        'due_hint', i.due_hint,
        'metadata', i.metadata,
        'created_at', i.created_at,
        'updated_at', i.updated_at
      ) order by i.priority_level asc, i.updated_at desc
    )
    from public.organization_priority_items i
    where i.organization_id = v_org_id
      and (p_status is null or i.status = p_status)
      and (p_priority_level is null or i.priority_level = p_priority_level)
  ), '[]'::jsonb);
end; $$;

create or replace function public.list_priority_focus_recommendations(p_status text default 'pending')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('priority_focus.view');
  v_org_id := public._mta_require_organization();
  perform public._pfe_seed_items(v_org_id);

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', r.id,
        'recommendation_type', r.recommendation_type,
        'summary', r.summary,
        'priority_level', r.priority_level,
        'status', r.status,
        'metadata', r.metadata,
        'created_at', r.created_at,
        'updated_at', r.updated_at
      ) order by r.priority_level asc nulls last, r.created_at desc
    )
    from public.organization_focus_recommendations r
    where r.organization_id = v_org_id
      and (p_status is null or r.status = p_status)
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. create / update item
-- ---------------------------------------------------------------------------
create or replace function public.create_priority_focus_item(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_priority_items%rowtype;
begin
  perform public._irp_require_permission('priority_focus.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if nullif(trim(p_payload->>'title'), '') is null then
    raise exception 'title required';
  end if;
  if nullif(trim(p_payload->>'summary'), '') is null then
    raise exception 'summary required';
  end if;

  insert into public.organization_priority_items (
    organization_id, dimension, priority_level, title, summary, status, due_hint, metadata
  ) values (
    v_org_id,
    coalesce(nullif(trim(p_payload->>'dimension'), ''), 'operational'),
    coalesce((p_payload->>'priority_level')::int, 3),
    trim(p_payload->>'title'),
    left(trim(p_payload->>'summary'), 500),
    coalesce(nullif(trim(p_payload->>'status'), ''), 'active'),
    nullif(trim(p_payload->>'due_hint'), ''),
    coalesce(p_payload->'metadata', '{}'::jsonb)
  )
  returning * into v_row;

  perform public._pfe_log(v_org_id, v_user_id, 'item_created', jsonb_build_object(
    'item_id', v_row.id,
    'priority_level', v_row.priority_level,
    'dimension', v_row.dimension,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_priority_focus_item(
  p_item_id uuid,
  p_payload jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_priority_items%rowtype;
begin
  perform public._irp_require_permission('priority_focus.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_priority_items set
    dimension = coalesce(nullif(trim(p_payload->>'dimension'), ''), dimension),
    priority_level = coalesce((p_payload->>'priority_level')::int, priority_level),
    title = coalesce(nullif(trim(p_payload->>'title'), ''), title),
    summary = coalesce(left(nullif(trim(p_payload->>'summary'), ''), 500), summary),
    status = coalesce(nullif(trim(p_payload->>'status'), ''), status),
    due_hint = case when p_payload ? 'due_hint' then nullif(trim(p_payload->>'due_hint'), '') else due_hint end,
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where id = p_item_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Priority item not found';
  end if;

  perform public._pfe_log(v_org_id, v_user_id, 'item_updated', jsonb_build_object(
    'item_id', v_row.id,
    'status', v_row.status,
    'priority_level', v_row.priority_level,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. resolve recommendation
-- ---------------------------------------------------------------------------
create or replace function public.resolve_priority_focus_recommendation(
  p_recommendation_id uuid,
  p_action text default 'resolve'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_status text;
  v_row public.organization_focus_recommendations%rowtype;
begin
  perform public._irp_require_permission('priority_focus.recommendations.resolve');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_status := case when p_action = 'dismiss' then 'dismissed' else 'resolved' end;

  update public.organization_focus_recommendations set
    status = v_status,
    updated_at = now()
  where id = p_recommendation_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Recommendation not found';
  end if;

  perform public._pfe_log(v_org_id, v_user_id, 'recommendation_resolved', jsonb_build_object(
    'recommendation_id', v_row.id,
    'action', v_status,
    'metadata_only', true
  ));

  return jsonb_build_object('resolved', true, 'recommendation_id', v_row.id, 'status', v_status);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_priority_focus_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_active int := 0;
  v_p1 int := 0;
begin
  perform public._irp_require_permission('priority_focus.view');
  v_org_id := public._mta_require_organization();
  perform public._pfe_seed_items(v_org_id);

  select
    count(*) filter (where status = 'active'),
    count(*) filter (where status = 'active' and priority_level = 1)
  into v_active, v_p1
  from public.organization_priority_items
  where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Transform overwhelming workloads into clear priorities — supporting org success and human wellbeing.',
    'active_items', v_active,
    'p1_count', v_p1,
    'enabled', (select enabled from public.organization_priority_focus_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_priority_focus_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_priority_focus_settings;
begin
  perform public._irp_require_permission('priority_focus.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._pfe_ensure_settings(v_org_id);
  perform public._pfe_seed_items(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Transform overwhelming workloads into clear priorities that support organizational success and human wellbeing.',
    'mission', 'Provide five priority dimensions and a P1–P4 framework with gentle focus support — never pressure or guilt.',
    'abos_principle', 'Operations augments people — Aipify clarifies priorities and prepares focus; humans decide. Priority & Focus is an ABOS Operations/Assistance capability.',
    'self_love_note', 'Self Love (A.76 planned) monitors fatigue signals and may soften focus recommendations — never shame or urgency language.',
    'distinction_note', 'Distinct from TAG Phase 37 (personal focus at /app/assistant/attention) and Goals & OKR A.65 (objectives/key results).',
    'priority_dimensions', public._pfe_priority_dimensions(),
    'priority_levels', public._pfe_priority_levels(),
    'focus_support', public._pfe_focus_support(),
    'proactive_companion_examples', public._pfe_proactive_companion_examples(),
    'executive_insights_summary', public._pfe_executive_insights_summary(v_org_id),
    'active_items_by_level', public._pfe_active_items_by_level(v_org_id),
    'settings', row_to_json(v_settings)::jsonb,
    'active_items', public.list_priority_focus_items('active', null),
    'focus_recommendations', public.list_priority_focus_recommendations('pending'),
    'summary', jsonb_build_object(
      'active_items', coalesce((
        select count(*) from public.organization_priority_items
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'pending_recommendations', coalesce((
        select count(*) from public.organization_focus_recommendations
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'integration_links', jsonb_build_object(
      'tag_personal_focus', '/app/assistant/attention',
      'goals_okr', '/app/goals-okr-engine',
      'unified_tasks', '/app/unified-task-follow-up-engine',
      'proactive_companion', '/app/proactive-companion-engine',
      'executive_insights', '/app/executive-insights-engine',
      'capacity_workload', '/app/capacity-workload-management-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('priority_focus.manage'),
      'can_resolve_recommendations', public._irp_has_permission('priority_focus.recommendations.resolve')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_priority_focus_summary(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_priority_focus_settings;
begin
  perform public._irp_require_permission('priority_focus.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pfe_ensure_settings(v_org_id);

  perform public._pfe_log(v_org_id, v_user_id, 'summary_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'priority_focus',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'priority_dimensions', public._pfe_priority_dimensions(),
    'priority_levels', public._pfe_priority_levels(),
    'focus_support', public._pfe_focus_support(),
    'executive_insights_summary', public._pfe_executive_insights_summary(v_org_id),
    'active_items_by_level', public._pfe_active_items_by_level(v_org_id),
    'active_items', public.list_priority_focus_items('active', null),
    'focus_recommendations', public.list_priority_focus_recommendations('pending'),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('priority_focus.manage'),
      'can_resolve_recommendations', public._irp_has_permission('priority_focus.recommendations.resolve')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Audit allowlist extension
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
    'pfe_item_created', 'pfe_item_updated', 'pfe_recommendation_resolved',
    'pfe_org_settings_changed', 'pfe_summary_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'pfe_%';
$$;

-- ---------------------------------------------------------------------------
-- 12. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'priority-focus-engine', 'Priority & Focus Engine',
  'Organizational priority dimensions and P1–P4 framework with gentle focus support — ABOS Operations/Assistance pillar.',
  'authenticated', 102
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'priority-focus-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 13. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_priority_focus_engine_card() to authenticated;
grant execute on function public.get_priority_focus_engine_dashboard() to authenticated;
grant execute on function public.list_priority_focus_items(text, int) to authenticated;
grant execute on function public.list_priority_focus_recommendations(text) to authenticated;
grant execute on function public.create_priority_focus_item(jsonb) to authenticated;
grant execute on function public.update_priority_focus_item(uuid, jsonb) to authenticated;
grant execute on function public.resolve_priority_focus_recommendation(uuid, text) to authenticated;
grant execute on function public.export_priority_focus_summary(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 14. Seed settings + sample items per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._pfe_ensure_settings(v_org_id);
    perform public._pfe_seed_items(v_org_id);
  end loop;
end; $$;
