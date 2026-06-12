-- Phase A.82 — Purpose & Values Engine
-- Organizational ABOS engine for tenant purpose, stated values, alignment signals, and reflection prompts.
-- Distinct from Brand Identity (Aipify product naming), Business DNA, Strategic Alignment A.55, and AI Ethics governance.

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
    'purpose_values_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_purpose_values_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_purpose_values_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  purpose_statement text,
  purpose_questions jsonb not null default '[]'::jsonb,
  celebrate_value_aligned_wins boolean not null default true,
  reflection_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_purpose_values_settings enable row level security;
revoke all on public.organization_purpose_values_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_stated_values
-- ---------------------------------------------------------------------------
create table if not exists public.organization_stated_values (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  value_key text not null,
  label text not null,
  description text not null check (char_length(description) <= 500),
  operational_hints jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, value_key)
);

create index if not exists organization_stated_values_org_active_idx
  on public.organization_stated_values (organization_id, active, sort_order);

alter table public.organization_stated_values enable row level security;
revoke all on public.organization_stated_values from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_values_alignment_signals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_values_alignment_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  value_key text not null,
  signal_type text not null check (
    signal_type in ('alignment', 'drift', 'celebration', 'tension', 'opportunity')
  ),
  summary text not null check (char_length(summary) <= 500),
  alignment_score numeric(5,2) check (alignment_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_values_alignment_signals_org_idx
  on public.organization_values_alignment_signals (organization_id, created_at desc);

alter table public.organization_values_alignment_signals enable row level security;
revoke all on public.organization_values_alignment_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_values_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.organization_values_reflections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prompt text not null check (char_length(prompt) <= 500),
  context_summary text check (char_length(context_summary) <= 500),
  suggested_considerations jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'dismissed', 'acknowledged')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_values_reflections_org_status_idx
  on public.organization_values_reflections (organization_id, status, created_at desc);

alter table public.organization_values_reflections enable row level security;
revoke all on public.organization_values_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'purpose_values_engine', v.description
from (values
  ('purpose_values.view', 'View Purpose & Values', 'View purpose and values dashboard and alignment signals'),
  ('purpose_values.manage', 'Manage Purpose & Values', 'Update organizational purpose settings and reflections'),
  ('purpose_values.values.edit', 'Edit Stated Values', 'Create and update organizational stated values'),
  ('purpose_values.export', 'Export Purpose & Values', 'Export purpose and values alignment report')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'purpose_values.view'), ('owner', 'purpose_values.manage'),
  ('owner', 'purpose_values.values.edit'), ('owner', 'purpose_values.export'),
  ('administrator', 'purpose_values.view'), ('administrator', 'purpose_values.manage'),
  ('administrator', 'purpose_values.values.edit'), ('administrator', 'purpose_values.export'),
  ('manager', 'purpose_values.view'), ('manager', 'purpose_values.manage'),
  ('manager', 'purpose_values.values.edit'), ('manager', 'purpose_values.export'),
  ('employee', 'purpose_values.view'), ('employee', 'purpose_values.export'),
  ('support_agent', 'purpose_values.view'),
  ('moderator', 'purpose_values.view'),
  ('viewer', 'purpose_values.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_pve_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._pve_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'pve_' || p_action_type,
    'purpose_values_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._pve_ensure_settings(p_organization_id uuid)
returns public.organization_purpose_values_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_purpose_values_settings;
begin
  insert into public.organization_purpose_values_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_purpose_values_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._pve_purpose_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'why_exist', 'label', 'Why we exist', 'description', 'The fundamental reason the organization exists — problems solved and impact aspired.'),
    jsonb_build_object('key', 'who_served', 'label', 'Who we serve', 'description', 'Customers, communities, and stakeholders whose needs shape daily decisions.'),
    jsonb_build_object('key', 'impact', 'label', 'Impact aspired', 'description', 'The meaningful change the organization seeks — beyond efficiency alone.'),
    jsonb_build_object('key', 'principles', 'label', 'Guiding principles', 'description', 'Operational principles that bridge intention and execution.')
  );
$$;

create or replace function public._pve_example_values()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('value_key', 'integrity', 'label', 'Integrity', 'description', 'Honest commitments, ethical consistency, and trustworthy actions.'),
    jsonb_build_object('value_key', 'innovation', 'label', 'Innovation', 'description', 'Thoughtful experimentation that serves purpose — not change for its own sake.'),
    jsonb_build_object('value_key', 'inclusion', 'label', 'Inclusion', 'description', 'Respectful communication and diverse perspectives in decisions.'),
    jsonb_build_object('value_key', 'excellence', 'label', 'Excellence', 'description', 'Quality and care in how work is done — how you succeed matters.'),
    jsonb_build_object('value_key', 'transparency', 'label', 'Transparency', 'description', 'Open communication, explainability, and accountable governance.'),
    jsonb_build_object('value_key', 'sustainability', 'label', 'Sustainability', 'description', 'Sustainable rhythms — ambition balanced with wellbeing.'),
    jsonb_build_object('value_key', 'customer_obsession', 'label', 'Customer obsession', 'description', 'Customer care shapes support, CX, and operational priorities.'),
    jsonb_build_object('value_key', 'continuous_learning', 'label', 'Continuous learning', 'description', 'Knowledge sharing and growth without pressure or guilt.')
  );
$$;

create or replace function public._pve_values_aware_assistance_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('value_key', 'transparency', 'example', 'Aipify recommends explaining trade-offs openly before this approval proceeds.'),
    jsonb_build_object('value_key', 'customer_obsession', 'example', 'Support queue patterns suggest prioritizing customer response readiness — aligned with your stated values.'),
    jsonb_build_object('value_key', 'inclusion', 'example', 'Meeting summary includes diverse stakeholder perspectives — respectful coordination, not surveillance.'),
    jsonb_build_object('value_key', 'sustainability', 'example', 'Capacity signals suggest protecting focus time — sustainable pace over urgency pressure.')
  );
$$;

create or replace function public._pve_decision_support_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('prompt', 'Does this decision align with your stated values?', 'consideration', 'Review integrity, transparency, and customer care implications.'),
    jsonb_build_object('prompt', 'What trade-offs matter most here?', 'consideration', 'Meaningful progress may require deferring efficiency-only shortcuts.'),
    jsonb_build_object('prompt', 'How does trust factor into this choice?', 'consideration', 'Ethical consistency and honest communication strengthen long-term trust.')
  );
$$;

create or replace function public._pve_culture_support_areas()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Reinforce value-aligned behaviors in daily operations',
    'Celebrate value-aligned wins — metadata summaries only',
    'Knowledge sharing that respects approved sources',
    'Respectful communication and inclusion in coordination',
    'Bridge intention and execution without replacing human judgment'
  );
$$;

create or replace function public._pve_seed_values(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_stated_values
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_stated_values (
    organization_id, value_key, label, description, operational_hints, sort_order, active, metadata
  )
  select
    p_organization_id,
    v.value_key,
    v.label,
    v.description,
    v.hints,
    v.sort_order,
    true,
    '{"seed": true, "metadata_only": true}'::jsonb
  from (values
    ('integrity', 'Integrity', 'Honest commitments, ethical consistency, and trustworthy actions.',
     '["Explain decisions openly","Honor commitments","Escalate ethical concerns"]'::jsonb, 1),
    ('transparency', 'Transparency', 'Open communication, explainability, and accountable governance.',
     '["Provide reasoning with recommendations","Document trade-offs","Share outcomes honestly"]'::jsonb, 2),
    ('customer_obsession', 'Customer obsession', 'Customer care shapes support, CX, and operational priorities.',
     '["Prioritize customer impact in support triage","Review CX patterns","Celebrate service wins"]'::jsonb, 3),
    ('inclusion', 'Inclusion', 'Respectful communication and diverse perspectives in decisions.',
     '["Include stakeholder voices","Use respectful language","Avoid exclusionary shortcuts"]'::jsonb, 4),
    ('continuous_learning', 'Continuous learning', 'Knowledge sharing and growth without pressure or guilt.',
     '["Share approved knowledge","Capture lessons learned","Support team development"]'::jsonb, 5)
  ) as v(value_key, label, description, hints, sort_order);

  update public.organization_purpose_values_settings set
    purpose_statement = coalesce(
      purpose_statement,
      'We exist to help organizations operate with clarity, trust, and meaningful progress — technology strengthens identity, it does not replace it.'
    ),
    purpose_questions = case
      when purpose_questions = '[]'::jsonb then jsonb_build_array(
        'Why does our organization exist?',
        'What problems do we solve and for whom?',
        'What impact do we aspire to create?',
        'Which values must guide daily decisions?'
      )
      else purpose_questions
    end,
    updated_at = now()
  where organization_id = p_organization_id;

  if not exists (
    select 1 from public.organization_values_alignment_signals
    where organization_id = p_organization_id
    limit 1
  ) then
    insert into public.organization_values_alignment_signals (
      organization_id, value_key, signal_type, summary, alignment_score, metadata
    ) values
      (p_organization_id, 'transparency', 'alignment',
       'Recent approval workflows include explainability metadata — aligned with transparency value.',
       82.5, '{"seed": true, "metadata_only": true}'::jsonb),
      (p_organization_id, 'customer_obsession', 'celebration',
       'Support response readiness improved this week — a value-aligned operational win.',
       88.0, '{"seed": true, "metadata_only": true}'::jsonb),
      (p_organization_id, 'sustainability', 'opportunity',
       'Capacity signals suggest reviewing workload balance — sustainable rhythms over urgency.',
       71.0, '{"seed": true, "metadata_only": true}'::jsonb);
  end if;

  if not exists (
    select 1 from public.organization_values_reflections
    where organization_id = p_organization_id
    limit 1
  ) then
    insert into public.organization_values_reflections (
      organization_id, prompt, context_summary, suggested_considerations, status, metadata
    ) values
      (p_organization_id,
       'Before approving this operational change, does it align with your stated values?',
       'A pending workflow change may affect customer communication patterns.',
       '["Review transparency and customer care implications","Consider trust and ethical consistency","Humans decide — Aipify prepares context only"]'::jsonb,
       'pending', '{"seed": true, "metadata_only": true}'::jsonb),
      (p_organization_id,
       'What trade-offs matter most for this quarter''s priorities?',
       'Strategic and operational items are active — alignment check recommended.',
       '["Meaningful progress vs efficiency-only shortcuts","Ambition balanced with wellbeing","Progress without purpose equals drift"]'::jsonb,
       'pending', '{"seed": true, "metadata_only": true}'::jsonb);
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. list / upsert values
-- ---------------------------------------------------------------------------
create or replace function public.list_organization_stated_values(p_active_only boolean default true)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  perform public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', v.id,
        'value_key', v.value_key,
        'label', v.label,
        'description', v.description,
        'operational_hints', v.operational_hints,
        'sort_order', v.sort_order,
        'active', v.active,
        'metadata', v.metadata,
        'created_at', v.created_at,
        'updated_at', v.updated_at
      ) order by v.sort_order asc, v.label asc
    )
    from public.organization_stated_values v
    where v.organization_id = v_org_id
      and (not p_active_only or v.active = true)
  ), '[]'::jsonb);
end; $$;

create or replace function public.upsert_organization_stated_value(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_stated_values%rowtype;
  v_id uuid;
begin
  perform public._irp_require_permission('purpose_values.values.edit');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if nullif(trim(p_payload->>'value_key'), '') is null then
    raise exception 'value_key required';
  end if;
  if nullif(trim(p_payload->>'label'), '') is null then
    raise exception 'label required';
  end if;
  if nullif(trim(p_payload->>'description'), '') is null then
    raise exception 'description required';
  end if;

  v_id := nullif(p_payload->>'id', '')::uuid;

  if v_id is not null then
    update public.organization_stated_values set
      value_key = coalesce(nullif(trim(p_payload->>'value_key'), ''), value_key),
      label = coalesce(nullif(trim(p_payload->>'label'), ''), label),
      description = coalesce(left(nullif(trim(p_payload->>'description'), ''), 500), description),
      operational_hints = coalesce(p_payload->'operational_hints', operational_hints),
      sort_order = coalesce((p_payload->>'sort_order')::int, sort_order),
      active = coalesce((p_payload->>'active')::boolean, active),
      metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
      updated_at = now()
    where id = v_id and organization_id = v_org_id
    returning * into v_row;
  else
    insert into public.organization_stated_values (
      organization_id, value_key, label, description, operational_hints, sort_order, active, metadata
    ) values (
      v_org_id,
      trim(p_payload->>'value_key'),
      trim(p_payload->>'label'),
      left(trim(p_payload->>'description'), 500),
      coalesce(p_payload->'operational_hints', '[]'::jsonb),
      coalesce((p_payload->>'sort_order')::int, 0),
      coalesce((p_payload->>'active')::boolean, true),
      coalesce(p_payload->'metadata', '{}'::jsonb)
    )
    on conflict (organization_id, value_key) do update set
      label = excluded.label,
      description = excluded.description,
      operational_hints = excluded.operational_hints,
      sort_order = excluded.sort_order,
      active = excluded.active,
      metadata = organization_stated_values.metadata || excluded.metadata,
      updated_at = now()
    returning * into v_row;
  end if;

  if v_row.id is null then
    raise exception 'Stated value not found';
  end if;

  perform public._pve_log(v_org_id, v_user_id, 'value_upserted', jsonb_build_object(
    'value_id', v_row.id,
    'value_key', v_row.value_key,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. update settings + acknowledge reflection
-- ---------------------------------------------------------------------------
create or replace function public.update_purpose_values_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_purpose_values_settings;
begin
  perform public._irp_require_permission('purpose_values.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._pve_ensure_settings(v_org_id);

  update public.organization_purpose_values_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    purpose_statement = case
      when p_payload ? 'purpose_statement' then nullif(trim(p_payload->>'purpose_statement'), '')
      else purpose_statement
    end,
    purpose_questions = coalesce(p_payload->'purpose_questions', purpose_questions),
    celebrate_value_aligned_wins = coalesce(
      (p_payload->>'celebrate_value_aligned_wins')::boolean, celebrate_value_aligned_wins
    ),
    reflection_enabled = coalesce((p_payload->>'reflection_enabled')::boolean, reflection_enabled),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._pve_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.acknowledge_values_reflection(
  p_reflection_id uuid,
  p_action text default 'acknowledge'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_status text;
  v_row public.organization_values_reflections%rowtype;
begin
  perform public._irp_require_permission('purpose_values.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_status := case when p_action = 'dismiss' then 'dismissed' else 'acknowledged' end;

  update public.organization_values_reflections set
    status = v_status,
    updated_at = now()
  where id = p_reflection_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Reflection not found';
  end if;

  perform public._pve_log(v_org_id, v_user_id, 'reflection_' || v_status, jsonb_build_object(
    'reflection_id', v_row.id,
    'metadata_only', true
  ));

  return jsonb_build_object('success', true, 'reflection_id', v_row.id, 'status', v_status);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_purpose_values_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_active_values int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  perform public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);

  select count(*) into v_active_values
  from public.organization_stated_values
  where organization_id = v_org_id and active = true;

  select count(*) into v_pending
  from public.organization_values_reflections
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Actions align with values — bridge intention and execution for meaningful progress.',
    'active_values', v_active_values,
    'pending_reflections', v_pending,
    'enabled', (select enabled from public.organization_purpose_values_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_purpose_values_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_purpose_values_settings;
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Actions align with values — bridge intention and execution; meaningful progress matters as much as efficiency.',
    'mission', 'Keep organizations connected to purpose and values during daily operations, growth, and change.',
    'abos_principle', 'How you succeed matters as much as whether — purpose provides meaning, values provide direction. Aipify informs and prepares; humans decide.',
    'vision', 'The companion understands why the organization exists — technology strengthens identity, it does not replace it.',
    'distinction_note', 'Distinct from Brand Identity & Personhood Standard (Aipify product naming), Business DNA Engine (/app/settings/business-dna), Strategic Alignment Engine A.55, and AI Ethics & Responsible Use governance. This engine holds tenant organizational purpose and values for decision alignment and culture support.',
    'purpose_framework', public._pve_purpose_framework(),
    'example_values', public._pve_example_values(),
    'values_aware_assistance_examples', public._pve_values_aware_assistance_examples(),
    'decision_support_examples', public._pve_decision_support_examples(),
    'culture_support_areas', public._pve_culture_support_areas(),
    'self_love_note', 'Self Love (A.76 planned) monitors alignment overload, ambition vs wellbeing, and sustainable rhythms — never sacrifice values under pressure.',
    'trust_engine_note', 'Trust Engine integration: transparency, ethical consistency, honest communication, and responsible governance reinforce stated values.',
    'growth_evolution_note', 'Growth & Evolution (A.81 planned): evolve without compromising identity — progress without purpose equals drift.',
    'settings', row_to_json(v_settings)::jsonb,
    'stated_values', public.list_organization_stated_values(true),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'value_key', s.value_key,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'alignment_score', s.alignment_score,
          'metadata', s.metadata,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_values_alignment_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 10
      ) s
    ), '[]'::jsonb),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'context_summary', r.context_summary,
          'suggested_considerations', r.suggested_considerations,
          'status', r.status,
          'metadata', r.metadata,
          'created_at', r.created_at,
          'updated_at', r.updated_at
        ) order by r.created_at desc
      )
      from public.organization_values_reflections r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'active_values', coalesce((
        select count(*) from public.organization_stated_values
        where organization_id = v_org_id and active = true
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_values_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'recent_signals', coalesce((
        select count(*) from public.organization_values_alignment_signals
        where organization_id = v_org_id
          and created_at > now() - interval '30 days'
      ), 0),
      'has_purpose_statement', v_settings.purpose_statement is not null
    ),
    'integration_links', jsonb_build_object(
      'business_dna', '/app/settings/business-dna',
      'strategic_alignment', '/app/strategic-alignment-engine',
      'organizational_decision_support', '/app/organizational-decision-support-engine',
      'trust_reputation', '/app/trust-reputation-engine',
      'organizational_health', '/app/organizational-health-engine',
      'change_management', '/app/change-management-engine',
      'goals_okr', '/app/goals-okr-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('purpose_values.manage'),
      'can_edit_values', public._irp_has_permission('purpose_values.values.edit'),
      'can_export', public._irp_has_permission('purpose_values.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_purpose_values_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_purpose_values_settings;
begin
  perform public._irp_require_permission('purpose_values.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);

  perform public._pve_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'purpose_values',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'purpose_framework', public._pve_purpose_framework(),
    'stated_values', public.list_organization_stated_values(false),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'value_key', s.value_key,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'alignment_score', s.alignment_score,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_values_alignment_signals s
      where s.organization_id = v_org_id
      order by s.created_at desc
      limit 50
    ), '[]'::jsonb),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'status', r.status,
          'created_at', r.created_at
        ) order by r.created_at desc
      )
      from public.organization_values_reflections r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'active_values', coalesce((
        select count(*) from public.organization_stated_values
        where organization_id = v_org_id and active = true
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_values_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('purpose_values.manage'),
      'can_edit_values', public._irp_has_permission('purpose_values.values.edit'),
      'can_export', true
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Audit allowlist extension
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
    'pfe_org_settings_changed', 'pfe_summary_exported',
    'pve_value_upserted', 'pve_settings_changed', 'pve_reflection_acknowledged',
    'pve_reflection_dismissed', 'pve_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%';
$$;

-- ---------------------------------------------------------------------------
-- 11. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'purpose-values-engine', 'Purpose & Values Engine',
  'Organizational purpose, stated values, alignment signals, and reflection prompts — ABOS Identity/Culture pillar.',
  'authenticated', 104
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'purpose-values-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 12. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_purpose_values_engine_card() to authenticated;
grant execute on function public.get_purpose_values_engine_dashboard() to authenticated;
grant execute on function public.list_organization_stated_values(boolean) to authenticated;
grant execute on function public.upsert_organization_stated_value(jsonb) to authenticated;
grant execute on function public.update_purpose_values_settings(jsonb) to authenticated;
grant execute on function public.acknowledge_values_reflection(uuid, text) to authenticated;
grant execute on function public.export_purpose_values_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 13. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._pve_ensure_settings(v_org_id);
    perform public._pve_seed_values(v_org_id);
  end loop;
end; $$;
