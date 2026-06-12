-- Phase A.83 — Inclusion & Humanity Engine
-- Respectful human-centered interaction, de-escalation, inclusion principles, boundaries, Self Love connection.
-- Foundation: Human Values Charter. Distinct from AI Ethics A.46, Purpose & Values A.82, Brand Identity, Trust Engine Phase 76.

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
    'purpose_values_engine',
    'inclusion_humanity_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_inclusion_humanity_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inclusion_humanity_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  de_escalation_enabled boolean not null default true,
  boundary_firmness text not null default 'balanced' check (
    boundary_firmness in ('gentle', 'balanced', 'firm')
  ),
  celebrate_inclusive_wins boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_inclusion_humanity_settings enable row level security;
revoke all on public.organization_inclusion_humanity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_inclusion_principles
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inclusion_principles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  principle_key text not null,
  label text not null,
  description text not null check (char_length(description) <= 500),
  sort_order int not null default 0,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, principle_key)
);

create index if not exists organization_inclusion_principles_org_active_idx
  on public.organization_inclusion_principles (organization_id, active, sort_order);

alter table public.organization_inclusion_principles enable row level security;
revoke all on public.organization_inclusion_principles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_communication_incidents (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_communication_incidents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_type text not null check (
    incident_type in (
      'offensive_language', 'frustration', 'provocation', 'disrespect', 'other'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  response_pattern_used text check (char_length(response_pattern_used) <= 200),
  status text not null default 'logged' check (
    status in ('logged', 'redirected', 'de_escalated', 'closed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_communication_incidents_org_idx
  on public.organization_communication_incidents (organization_id, status, created_at desc);

alter table public.organization_communication_incidents enable row level security;
revoke all on public.organization_communication_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_inclusion_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inclusion_reflections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prompt text not null check (char_length(prompt) <= 500),
  context_summary text check (char_length(context_summary) <= 500),
  suggested_response jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_inclusion_reflections_org_status_idx
  on public.organization_inclusion_reflections (organization_id, status, created_at desc);

alter table public.organization_inclusion_reflections enable row level security;
revoke all on public.organization_inclusion_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'inclusion_humanity_engine', v.description
from (values
  ('inclusion_humanity.view', 'View Inclusion & Humanity', 'View inclusion dashboard and communication incident metadata'),
  ('inclusion_humanity.manage', 'Manage Inclusion & Humanity', 'Acknowledge inclusion reflections and operational inclusion actions'),
  ('inclusion_humanity.settings.manage', 'Manage Inclusion Settings', 'Update inclusion and humanity engine settings'),
  ('inclusion_humanity.export', 'Export Inclusion & Humanity', 'Export inclusion and humanity report')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'inclusion_humanity.view'), ('owner', 'inclusion_humanity.manage'),
  ('owner', 'inclusion_humanity.settings.manage'), ('owner', 'inclusion_humanity.export'),
  ('administrator', 'inclusion_humanity.view'), ('administrator', 'inclusion_humanity.manage'),
  ('administrator', 'inclusion_humanity.settings.manage'), ('administrator', 'inclusion_humanity.export'),
  ('manager', 'inclusion_humanity.view'), ('manager', 'inclusion_humanity.manage'),
  ('manager', 'inclusion_humanity.settings.manage'), ('manager', 'inclusion_humanity.export'),
  ('employee', 'inclusion_humanity.view'), ('employee', 'inclusion_humanity.export'),
  ('support_agent', 'inclusion_humanity.view'),
  ('moderator', 'inclusion_humanity.view'),
  ('viewer', 'inclusion_humanity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ihe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ihe_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'ihe_' || p_action_type,
    'inclusion_humanity_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._ihe_ensure_settings(p_organization_id uuid)
returns public.organization_inclusion_humanity_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_inclusion_humanity_settings;
begin
  insert into public.organization_inclusion_humanity_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_inclusion_humanity_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._ihe_communication_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Respectful — every person deserves dignity in every interaction',
    'Inclusive — welcome diverse backgrounds, cultures, and identities',
    'Professional — calm, constructive, and appropriate for organizational context',
    'Compassionate — acknowledge feelings without judgment or shame',
    'Calm — emotional steadiness even when others are frustrated',
    'Non-confrontational — redirect hostility toward constructive dialogue'
  );
$$;

create or replace function public._ihe_inclusion_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('principle_key', 'dignity', 'label', 'Dignity',
      'description', 'Every person deserves respect regardless of role, background, or circumstance.'),
    jsonb_build_object('principle_key', 'diversity', 'label', 'Diversity',
      'description', 'Welcome diverse backgrounds, cultures, and identities in coordination.'),
    jsonb_build_object('principle_key', 'respect', 'label', 'Respect',
      'description', 'Communication begins from respect, not judgment or condescension.'),
    jsonb_build_object('principle_key', 'inclusion', 'label', 'Inclusion',
      'description', 'Inclusion creates stronger communities — diverse perspectives strengthen organizations.'),
    jsonb_build_object('principle_key', 'coexistence', 'label', 'Coexistence',
      'description', 'You do not need to agree to treat each other well — differences met with curiosity.')
  );
$$;

create or replace function public._ihe_inappropriate_behavior_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'situation', 'offensive_language',
      'guidance', 'Redirect harmful language toward respectful dialogue without shaming.',
      'example_phrases', jsonb_build_array(
        'That language is not appropriate here. I can help if we keep our conversation respectful.'
      )
    ),
    jsonb_build_object(
      'situation', 'frustration',
      'guidance', 'Acknowledge frustration and refocus on constructive resolution.',
      'example_phrases', jsonb_build_array(
        'I hear that you are frustrated. Let us focus on resolving this together.'
      )
    ),
    jsonb_build_object(
      'situation', 'provocation',
      'guidance', 'Maintain professional boundaries and invite constructive dialogue.',
      'example_phrases', jsonb_build_array(
        'Let us keep this conversation professional so I can assist you effectively.'
      )
    ),
    jsonb_build_object(
      'situation', 'disrespect',
      'guidance', 'Set a firm, respectful boundary — assistance continues when dignity is honored.',
      'example_phrases', jsonb_build_array(
        'I will continue when our conversation stays respectful.'
      )
    )
  );
$$;

create or replace function public._ihe_boundary_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Inclusion does not mean accepting harmful behavior — redirect hostility with firm, respectful consistency.',
    'Assistance empowers rather than replaces — humans retain agency over consequential responses.',
    'Metadata only — no raw message content stored in communication incident records.',
    'Reflection prompts support awareness; they do not judge, shame, or pressure.'
  );
$$;

create or replace function public._ihe_kc_faq_topics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('topic', 'What is Inclusion & Humanity?',
      'summary', 'Respectful human-centered interaction, de-escalation, and inclusion principles grounded in the Human Values Charter.'),
    jsonb_build_object('topic', 'How is this different from AI Ethics A.46?',
      'summary', 'AI Ethics governs platform AI behavior; Inclusion & Humanity applies charter-aligned conduct at the tenant level.'),
    jsonb_build_object('topic', 'How is this different from Purpose & Values A.82?',
      'summary', 'Purpose & Values holds tenant stated values; Inclusion & Humanity focuses on how people interact.'),
    jsonb_build_object('topic', 'What are communication incidents?',
      'summary', 'Metadata-only records of interaction patterns — no raw message content stored.'),
    jsonb_build_object('topic', 'Who can manage inclusion settings?',
      'summary', 'inclusion_humanity.settings.manage is required to update engine settings.')
  );
$$;

create or replace function public._ihe_recent_incidents_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_by_type jsonb := '{}'::jsonb;
  v_by_status jsonb := '{}'::jsonb;
  v_total int := 0;
  v_de_escalated int := 0;
begin
  select count(*) into v_total
  from public.organization_communication_incidents
  where organization_id = p_organization_id
    and created_at > now() - interval '30 days';

  select count(*) into v_de_escalated
  from public.organization_communication_incidents
  where organization_id = p_organization_id
    and status = 'de_escalated'
    and created_at > now() - interval '30 days';

  select coalesce(jsonb_object_agg(incident_type, cnt), '{}'::jsonb) into v_by_type
  from (
    select incident_type, count(*)::int as cnt
    from public.organization_communication_incidents
    where organization_id = p_organization_id
      and created_at > now() - interval '30 days'
    group by incident_type
  ) t;

  select coalesce(jsonb_object_agg(status, cnt), '{}'::jsonb) into v_by_status
  from (
    select status, count(*)::int as cnt
    from public.organization_communication_incidents
    where organization_id = p_organization_id
      and created_at > now() - interval '30 days'
    group by status
  ) s;

  return jsonb_build_object(
    'total_30_days', coalesce(v_total, 0),
    'by_type', v_by_type,
    'by_status', v_by_status,
    'de_escalated_count', coalesce(v_de_escalated, 0)
  );
end; $$;

create or replace function public._ihe_seed_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_inclusion_principles
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_inclusion_principles (
    organization_id, principle_key, label, description, sort_order, active, metadata
  )
  select
    p_organization_id,
    v.principle_key,
    v.label,
    v.description,
    v.sort_order,
    true,
    '{"seed": true, "metadata_only": true}'::jsonb
  from (values
    ('dignity', 'Dignity',
     'Every person deserves respect regardless of role, background, or circumstance.', 1),
    ('diversity', 'Diversity',
     'Welcome diverse backgrounds, cultures, and identities in coordination.', 2),
    ('respect', 'Respect',
     'Communication begins from respect, not judgment or condescension.', 3),
    ('inclusion', 'Inclusion',
     'Inclusion creates stronger communities — diverse perspectives strengthen organizations.', 4),
    ('coexistence', 'Coexistence',
     'You do not need to agree to treat each other well — differences met with curiosity.', 5)
  ) as v(principle_key, label, description, sort_order);

  if not exists (
    select 1 from public.organization_communication_incidents
    where organization_id = p_organization_id
    limit 1
  ) then
    insert into public.organization_communication_incidents (
      organization_id, incident_type, summary, response_pattern_used, status, metadata
    ) values
      (p_organization_id, 'frustration',
       'Support coordination patterns suggest elevated frustration tone — de-escalation opportunity.',
       'acknowledge_and_refocus', 'logged', '{"seed": true, "metadata_only": true}'::jsonb),
      (p_organization_id, 'disrespect',
       'Boundary reminder triggered — respectful dialogue required before assistance continues.',
       'firm_respectful_boundary', 'redirected', '{"seed": true, "metadata_only": true}'::jsonb);
  end if;

  if not exists (
    select 1 from public.organization_inclusion_reflections
    where organization_id = p_organization_id
    limit 1
  ) then
    insert into public.organization_inclusion_reflections (
      organization_id, prompt, context_summary, suggested_response, status, metadata
    ) values
      (p_organization_id,
       'Before responding to a tense coordination thread, does your approach honor dignity and inclusion?',
       'Recent communication patterns indicate elevated tone risk — inclusion alignment check.',
       '{"tone": "calm", "phrases": ["I hear that you are frustrated. Let us focus on resolving this together.", "Humans decide — Aipify prepares context only"]}'::jsonb,
       'pending', '{"seed": true, "metadata_only": true}'::jsonb),
      (p_organization_id,
       'Are boundaries being respected — assistance empowers rather than replaces?',
       'Boundary reminder aligned with coexistence and respect principles.',
       '{"tone": "firm_respectful", "phrases": ["I will continue when our conversation stays respectful.", "Metadata only — no raw message content"]}'::jsonb,
       'pending', '{"seed": true, "metadata_only": true}'::jsonb);
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. update settings + acknowledge reflection
-- ---------------------------------------------------------------------------
create or replace function public.update_inclusion_humanity_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_inclusion_humanity_settings;
  v_firmness text;
begin
  perform public._irp_require_permission('inclusion_humanity.settings.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._ihe_ensure_settings(v_org_id);

  v_firmness := nullif(trim(p_payload->>'boundary_firmness'), '');
  if v_firmness is not null and v_firmness not in ('gentle', 'balanced', 'firm') then
    raise exception 'boundary_firmness must be gentle, balanced, or firm';
  end if;

  update public.organization_inclusion_humanity_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    de_escalation_enabled = coalesce((p_payload->>'de_escalation_enabled')::boolean, de_escalation_enabled),
    boundary_firmness = coalesce(v_firmness, boundary_firmness),
    celebrate_inclusive_wins = coalesce(
      (p_payload->>'celebrate_inclusive_wins')::boolean, celebrate_inclusive_wins
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ihe_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'boundary_firmness', v_row.boundary_firmness,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.acknowledge_inclusion_reflection(
  p_reflection_id uuid,
  p_action text default 'acknowledge'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_status text;
  v_row public.organization_inclusion_reflections%rowtype;
begin
  perform public._irp_require_permission('inclusion_humanity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_status := case when p_action = 'dismiss' then 'dismissed' else 'acknowledged' end;

  update public.organization_inclusion_reflections set
    status = v_status,
    updated_at = now()
  where id = p_reflection_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Reflection not found';
  end if;

  perform public._ihe_log(v_org_id, v_user_id, 'reflection_' || v_status, jsonb_build_object(
    'reflection_id', v_row.id,
    'metadata_only', true
  ));

  return jsonb_build_object('success', true, 'reflection_id', v_row.id, 'status', v_status);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_inclusion_humanity_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_active_principles int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('inclusion_humanity.view');
  v_org_id := public._mta_require_organization();
  perform public._ihe_ensure_settings(v_org_id);
  perform public._ihe_seed_data(v_org_id);

  select count(*) into v_active_principles
  from public.organization_inclusion_principles
  where organization_id = v_org_id and active = true;

  select count(*) into v_pending
  from public.organization_inclusion_reflections
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Support people — not judge, shame, or exclude; acknowledge differences with respect.',
    'active_principles', v_active_principles,
    'pending_reflections', v_pending,
    'enabled', (select enabled from public.organization_inclusion_humanity_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_inclusion_humanity_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_inclusion_humanity_settings;
begin
  perform public._irp_require_permission('inclusion_humanity.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._ihe_ensure_settings(v_org_id);
  perform public._ihe_seed_data(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Support people — not judge, shame, or exclude; acknowledge differences with respect.',
    'mission', 'Promote respectful communication, inclusion, understanding, and healthy interactions across organizational work.',
    'abos_principle', 'Technology influences culture — every interaction reinforces dignity, respect, and understanding. Aipify models compassionate communication; humans decide.',
    'vision', 'Known for kindness, professionalism, and fairness — inclusion means everyone feels welcome, even when viewpoints differ.',
    'distinction_note', 'Distinct from AI Ethics & Responsible Use A.46, Purpose & Values Engine A.82, Brand Identity & Personhood Standard, and Trust Engine Phase 76. Built on the Human Values Charter — communication conduct and inclusion principles, not platform ethics governance or product naming.',
    'communication_principles', public._ihe_communication_principles(),
    'inclusion_principles', public._ihe_inclusion_principles(),
    'inappropriate_behavior_guidance', public._ihe_inappropriate_behavior_guidance(),
    'boundary_principles', public._ihe_boundary_principles(),
    'self_love_note', 'Self Love (A.76 planned) connects respectful self-talk, healthy boundaries, and recovery from stress — growth never at the expense of wellbeing.',
    'trust_engine_note', 'Trust Engine integration: explainability, ethical consistency, and honest communication complement respectful interaction patterns.',
    'purpose_values_note', 'Purpose & Values (A.82) holds tenant organizational purpose and stated values; Inclusion & Humanity applies Human Values Charter to interaction patterns.',
    'kc_faq_topics', public._ihe_kc_faq_topics(),
    'settings', row_to_json(v_settings)::jsonb,
    'stated_principles', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'principle_key', p.principle_key,
          'label', p.label,
          'description', p.description,
          'sort_order', p.sort_order,
          'active', p.active,
          'metadata', p.metadata,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) order by p.sort_order asc, p.label asc
      )
      from public.organization_inclusion_principles p
      where p.organization_id = v_org_id and p.active = true
    ), '[]'::jsonb),
    'recent_incidents_summary', public._ihe_recent_incidents_summary(v_org_id),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'context_summary', r.context_summary,
          'suggested_response', r.suggested_response,
          'status', r.status,
          'metadata', r.metadata,
          'created_at', r.created_at,
          'updated_at', r.updated_at
        ) order by r.created_at desc
      )
      from public.organization_inclusion_reflections r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'active_principles', coalesce((
        select count(*) from public.organization_inclusion_principles
        where organization_id = v_org_id and active = true
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_inclusion_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'recent_incidents_30d', coalesce((
        select count(*) from public.organization_communication_incidents
        where organization_id = v_org_id
          and created_at > now() - interval '30 days'
      ), 0),
      'de_escalation_enabled', v_settings.de_escalation_enabled,
      'boundary_firmness', v_settings.boundary_firmness
    ),
    'integration_links', jsonb_build_object(
      'human_values_charter', '/content/knowledge/aipify/abos/articles/human-values-charter',
      'purpose_values', '/app/purpose-values-engine',
      'trust_reputation', '/app/trust-reputation-engine',
      'organizational_health', '/app/organizational-health-engine',
      'change_management', '/app/change-management-engine',
      'stakeholder_communication', '/app/stakeholder-communication-engine',
      'knowledge_center', '/app/knowledge-center?category=inclusion-humanity-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('inclusion_humanity.manage'),
      'can_manage_settings', public._irp_has_permission('inclusion_humanity.settings.manage'),
      'can_export', public._irp_has_permission('inclusion_humanity.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_inclusion_humanity_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_inclusion_humanity_settings;
begin
  perform public._irp_require_permission('inclusion_humanity.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._ihe_ensure_settings(v_org_id);
  perform public._ihe_seed_data(v_org_id);

  perform public._ihe_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'inclusion_humanity',
    'format', coalesce(p_format, 'json'),
    'philosophy', 'Support people — not judge, shame, or exclude; acknowledge differences with respect.',
    'mission', 'Promote respectful communication, inclusion, understanding, and healthy interactions across organizational work.',
    'communication_principles', public._ihe_communication_principles(),
    'inclusion_principles', public._ihe_inclusion_principles(),
    'boundary_principles', public._ihe_boundary_principles(),
    'settings', row_to_json(v_settings)::jsonb,
    'stated_principles', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'principle_key', p.principle_key,
          'label', p.label,
          'description', p.description,
          'sort_order', p.sort_order,
          'active', p.active,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) order by p.sort_order asc, p.label asc
      )
      from public.organization_inclusion_principles p
      where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'recent_incidents_summary', public._ihe_recent_incidents_summary(v_org_id),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'status', r.status,
          'created_at', r.created_at
        ) order by r.created_at desc
      )
      from public.organization_inclusion_reflections r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'active_principles', coalesce((
        select count(*) from public.organization_inclusion_principles
        where organization_id = v_org_id and active = true
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_inclusion_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'recent_incidents_30d', coalesce((
        select count(*) from public.organization_communication_incidents
        where organization_id = v_org_id
          and created_at > now() - interval '30 days'
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('inclusion_humanity.manage'),
      'can_manage_settings', public._irp_has_permission('inclusion_humanity.settings.manage'),
      'can_export', true
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit allowlist extension
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
    'pve_reflection_dismissed', 'pve_report_exported',
    'ihe_settings_changed', 'ihe_reflection_acknowledged', 'ihe_reflection_dismissed',
    'ihe_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%'
    or p_action_type like 'ihe_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'inclusion-humanity-engine', 'Inclusion & Humanity Engine',
  'Respectful human-centered interaction, de-escalation, and inclusion principles — grounded in the Human Values Charter.',
  'authenticated', 105
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'inclusion-humanity-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_inclusion_humanity_engine_card() to authenticated;
grant execute on function public.get_inclusion_humanity_engine_dashboard() to authenticated;
grant execute on function public.update_inclusion_humanity_settings(jsonb) to authenticated;
grant execute on function public.acknowledge_inclusion_reflection(uuid, text) to authenticated;
grant execute on function public.export_inclusion_humanity_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._ihe_ensure_settings(v_org_id);
    perform public._ihe_seed_data(v_org_id);
  end loop;
end; $$;
