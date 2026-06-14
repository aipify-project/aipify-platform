-- Phase A.88 — Wonder Engine (ABOS)
-- Preserve amazement — progress can be inspiring; maintain sense of possibility.
-- Distinct from Impact A.85, Legacy A.86, Curiosity & Discovery A.87, Humor/Playful bell, Growth & Evolution A.81.

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
    'wonder_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_wonder_engine_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wonder_engine_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  wonder_moments_enabled boolean not null default true,
  reflection_prompts_enabled boolean not null default true,
  celebration_cadence text not null default 'normal' check (
    celebration_cadence in ('low', 'normal')
  ),
  authenticity_guardrails boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_wonder_engine_settings enable row level security;
revoke all on public.organization_wonder_engine_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_wonder_moments (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wonder_moments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  moment_type text not null check (
    moment_type in (
      'milestone', 'challenge_overcome', 'customer_impact',
      'team_extraordinary', 'vision_becoming_reality'
    )
  ),
  title text not null check (char_length(title) <= 200),
  summary text not null check (char_length(summary) <= 500),
  significance_note text check (char_length(significance_note) <= 500),
  acknowledged boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_wonder_moments_org_idx
  on public.organization_wonder_moments (organization_id, acknowledged, created_at desc);

alter table public.organization_wonder_moments enable row level security;
revoke all on public.organization_wonder_moments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_wonder_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wonder_reflections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prompt text not null check (char_length(prompt) <= 500),
  context_summary text check (char_length(context_summary) <= 500),
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'dismissed')
  ),
  suggested_pause_note text check (char_length(suggested_pause_note) <= 300),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_wonder_reflections_org_status_idx
  on public.organization_wonder_reflections (organization_id, status, created_at desc);

alter table public.organization_wonder_reflections enable row level security;
revoke all on public.organization_wonder_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'wonder_engine', v.description
from (values
  ('wonder_engine.view', 'View Wonder Engine', 'View wonder dashboard, moments, and reflection prompts'),
  ('wonder_engine.manage', 'Manage Wonder Engine', 'Update wonder settings and acknowledge wonder moments'),
  ('wonder_engine.export', 'Export Wonder Engine', 'Export wonder engine report'),
  ('wonder_engine.reflections.acknowledge', 'Acknowledge Wonder Reflections', 'Acknowledge or dismiss wonder reflection prompts')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'wonder_engine.view'), ('owner', 'wonder_engine.manage'),
  ('owner', 'wonder_engine.export'), ('owner', 'wonder_engine.reflections.acknowledge'),
  ('administrator', 'wonder_engine.view'), ('administrator', 'wonder_engine.manage'),
  ('administrator', 'wonder_engine.export'), ('administrator', 'wonder_engine.reflections.acknowledge'),
  ('manager', 'wonder_engine.view'), ('manager', 'wonder_engine.manage'),
  ('manager', 'wonder_engine.export'), ('manager', 'wonder_engine.reflections.acknowledge'),
  ('employee', 'wonder_engine.view'), ('employee', 'wonder_engine.export'),
  ('employee', 'wonder_engine.reflections.acknowledge'),
  ('support_agent', 'wonder_engine.view'),
  ('moderator', 'wonder_engine.view'),
  ('viewer', 'wonder_engine.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_wne_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._wne_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'wne_' || p_action_type,
    'wonder_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._wne_ensure_settings(p_organization_id uuid)
returns public.organization_wonder_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_wonder_engine_settings;
begin
  insert into public.organization_wonder_engine_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_wonder_engine_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._wne_moments_of_wonder_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'milestone',
      'label', 'Milestone',
      'description', 'Meaningful progress reached — worth pausing to notice how far you have come.'
    ),
    jsonb_build_object(
      'key', 'challenge_overcome',
      'label', 'Challenge overcome',
      'description', 'A difficulty resolved — resilience and persistence made something possible.'
    ),
    jsonb_build_object(
      'key', 'customer_impact',
      'label', 'Customer impact',
      'description', 'Real people benefited — the work mattered beyond internal metrics.'
    ),
    jsonb_build_object(
      'key', 'team_extraordinary',
      'label', 'Team extraordinary',
      'description', 'Someone went above expectations — human effort that deserves recognition.'
    ),
    jsonb_build_object(
      'key', 'vision_becoming_reality',
      'label', 'Vision becoming reality',
      'description', 'What once felt distant is now tangible — possibility becoming proof.'
    )
  );
$$;

create or replace function public._wne_reflection_prompt_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'five_years_ago',
      'prompt', 'Five years ago, would you have believed you would be here today?',
      'context', 'Long-horizon appreciation — how far the journey has come.'
    ),
    jsonb_build_object(
      'key', 'appreciate_distance',
      'prompt', 'Take a moment to appreciate how far you have come — not only what remains.',
      'context', 'Progress recognition — success should not become invisible through familiarity.'
    ),
    jsonb_build_object(
      'key', 'small_decisions',
      'prompt', 'Which small decisions along the way made the biggest difference?',
      'context', 'Quiet pivots — wonder in the compound effect of consistent choices.'
    ),
    jsonb_build_object(
      'key', 'impossible_to_reality',
      'prompt', 'What once felt impossible is now part of how you work — what changed?',
      'context', 'Impossible to reality — healthy amazement at genuine transformation.'
    )
  );
$$;

create or replace function public._wne_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Never artificial — authenticity over performance.',
    'should_avoid', jsonb_build_array(
      'Excessive praise that feels unearned',
      'Empty motivation without substance',
      'Manufactured emotion or forced enthusiasm',
      'Constant celebration that dilutes meaning',
      'Praise that obscures real challenges still ahead'
    )
  );
$$;

create or replace function public._wne_self_love_note()
returns text language sql immutable as $$
  select 'Self Love: celebrate progress, recognize effort, express gratitude, and protect the joy of building. Success should not become invisible through familiarity — wonder keeps meaningful work emotionally alive.';
$$;

create or replace function public._wne_impact_note()
returns text language sql immutable as $$
  select 'Impact Engine A.85 measures what changed — outcomes and signals. Wonder Engine reconnects you to why those changes matter — emotional appreciation, not measurement.';
$$;

create or replace function public._wne_legacy_note()
returns text language sql immutable as $$
  select 'Legacy Engine A.86 preserves stories and milestones for the long term. Wonder Engine offers emotional reconnection in the present — authentic amazement, not archival narrative.';
$$;

create or replace function public._wne_companion_note()
returns text language sql immutable as $$
  select 'Companion presence: pause to appreciate progress — wonder should inspire, not slow meaningful work. Brief, authentic moments of reflection, not interruption for its own sake.';
$$;

create or replace function public._wne_seed_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_wonder_moments
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_wonder_moments (
    organization_id, moment_type, title, summary, significance_note, acknowledged, metadata
  ) values
    (p_organization_id, 'milestone', 'First sustainable support rhythm',
     'Support operations reached a steady, humane pace — not crisis mode.',
     'A quiet milestone: the team built something that lasts.',
     false, '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'challenge_overcome', 'Recovered after a difficult launch week',
     'A high-pressure period ended with learning, not blame.',
     'Resilience noted — difficulty overcome together.',
     false, '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'customer_impact', 'Customers report clearer, faster answers',
     'Outcome metadata suggests fewer repeat contacts and better first responses.',
     'Real people benefited — the work mattered.',
     true, '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'vision_becoming_reality', 'Install-first workflow is now normal',
     'What once required explanation is now how the team works every day.',
     'Vision becoming routine — still worth marveling at.',
     false, '{"seed": true, "metadata_only": true}'::jsonb);

  insert into public.organization_wonder_reflections (
    organization_id, prompt, context_summary, status, suggested_pause_note, metadata
  ) values
    (p_organization_id,
     'Five years ago, would you have believed you would be here today?',
     'Long-horizon appreciation for organizational progress.',
     'pending',
     'A brief pause — no urgency. Just notice how far you have come.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id,
     'Take a moment to appreciate how far you have come — not only what remains.',
     'Progress recognition — protect joy of building.',
     'pending',
     'Thirty seconds of honest gratitude. Then continue.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id,
     'Which small decisions along the way made the biggest difference?',
     'Compound effect of consistent choices.',
     'acknowledged',
     null,
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_wonder_engine_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_cadence text;
  v_row public.organization_wonder_engine_settings;
begin
  perform public._irp_require_permission('wonder_engine.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._wne_ensure_settings(v_org_id);

  v_cadence := nullif(trim(p_payload->>'celebration_cadence'), '');
  if v_cadence is not null and v_cadence not in ('low', 'normal') then
    raise exception 'celebration_cadence must be low or normal';
  end if;

  update public.organization_wonder_engine_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    wonder_moments_enabled = coalesce(
      (p_payload->>'wonder_moments_enabled')::boolean, wonder_moments_enabled
    ),
    reflection_prompts_enabled = coalesce(
      (p_payload->>'reflection_prompts_enabled')::boolean, reflection_prompts_enabled
    ),
    celebration_cadence = coalesce(v_cadence, celebration_cadence),
    authenticity_guardrails = coalesce(
      (p_payload->>'authenticity_guardrails')::boolean, authenticity_guardrails
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._wne_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'celebration_cadence', v_row.celebration_cadence,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. acknowledge reflection + moment
-- ---------------------------------------------------------------------------
create or replace function public.acknowledge_wonder_reflection(
  p_reflection_id uuid,
  p_action text default 'acknowledge'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_status text;
  v_row public.organization_wonder_reflections%rowtype;
begin
  perform public._irp_require_permission('wonder_engine.reflections.acknowledge');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_status := case when p_action = 'dismiss' then 'dismissed' else 'acknowledged' end;

  update public.organization_wonder_reflections set
    status = v_status,
    updated_at = now()
  where id = p_reflection_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Reflection not found';
  end if;

  perform public._wne_log(v_org_id, v_user_id, 'reflection_' || v_status, jsonb_build_object(
    'reflection_id', v_row.id,
    'metadata_only', true
  ));

  return jsonb_build_object('success', true, 'reflection_id', v_row.id, 'status', v_status);
end; $$;

create or replace function public.acknowledge_wonder_moment(p_moment_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_wonder_moments%rowtype;
begin
  perform public._irp_require_permission('wonder_engine.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_wonder_moments set
    acknowledged = true,
    updated_at = now()
  where id = p_moment_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Wonder moment not found';
  end if;

  perform public._wne_log(v_org_id, v_user_id, 'moment_acknowledged', jsonb_build_object(
    'moment_id', v_row.id,
    'moment_type', v_row.moment_type,
    'metadata_only', true
  ));

  return jsonb_build_object('success', true, 'moment_id', v_row.id, 'acknowledged', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_wonder_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_moments int := 0;
  v_pending int := 0;
  v_unack int := 0;
begin
  perform public._irp_require_permission('wonder_engine.view');
  v_org_id := public._mta_require_organization();
  perform public._wne_ensure_settings(v_org_id);
  perform public._wne_seed_data(v_org_id);

  select count(*) into v_moments
  from public.organization_wonder_moments where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_wonder_reflections
  where organization_id = v_org_id and status = 'pending';

  select count(*) into v_unack
  from public.organization_wonder_moments
  where organization_id = v_org_id and acknowledged = false;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Wonder fuels innovation and resilience — healthy possibility, not constant excitement.',
    'moment_count', v_moments,
    'pending_reflections', v_pending,
    'unacknowledged_moments', v_unack,
    'enabled', (select enabled from public.organization_wonder_engine_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_wonder_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_wonder_engine_settings;
begin
  perform public._irp_require_permission('wonder_engine.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._wne_ensure_settings(v_org_id);
  perform public._wne_seed_data(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Progress can be inspiring — not only practical. Preserve amazement and a sense of possibility.',
    'mission', 'Preserve optimism, celebrate possibility, and stay connected to the excitement of building something meaningful.',
    'abos_principle', 'Efficiency builds capability; wonder preserves humanity.',
    'vision', 'You did. And it has been an incredible journey.',
    'distinction_note',
      'Distinct from Impact Engine A.85 (outcome measurement), Legacy Engine A.86 (story preservation), Curiosity & Discovery A.87 (exploration prompts), Humor/Playful bell (light humor), and Growth & Evolution A.81 (growth orchestration). Wonder = possibility, authentic amazement, reflection prompts, emotional appreciation.',
    'moments_of_wonder_types', public._wne_moments_of_wonder_types(),
    'reflection_prompt_examples', public._wne_reflection_prompt_examples(),
    'self_love_note', public._wne_self_love_note(),
    'impact_note', public._wne_impact_note(),
    'legacy_note', public._wne_legacy_note(),
    'companion_note', public._wne_companion_note(),
    'boundaries', public._wne_boundaries(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'title', m.title,
          'summary', m.summary,
          'significance_note', m.significance_note,
          'acknowledged', m.acknowledged,
          'metadata', m.metadata,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) order by m.created_at desc
      )
      from (
        select * from public.organization_wonder_moments
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) m
    ), '[]'::jsonb),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'context_summary', r.context_summary,
          'status', r.status,
          'suggested_pause_note', r.suggested_pause_note,
          'metadata', r.metadata,
          'created_at', r.created_at,
          'updated_at', r.updated_at
        ) order by r.created_at desc
      )
      from (
        select * from public.organization_wonder_reflections
        where organization_id = v_org_id and status = 'pending'
        order by created_at desc
        limit 10
      ) r
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_wonder_moments where organization_id = v_org_id
      ), 0),
      'unacknowledged_moments', coalesce((
        select count(*) from public.organization_wonder_moments
        where organization_id = v_org_id and acknowledged = false
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_wonder_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'wonder_moments_enabled', v_settings.wonder_moments_enabled,
      'reflection_prompts_enabled', v_settings.reflection_prompts_enabled,
      'celebration_cadence', v_settings.celebration_cadence,
      'authenticity_guardrails', v_settings.authenticity_guardrails
    ),
    'integration_links', jsonb_build_object(
      'impact_engine', '/app/impact-engine',
      'legacy_engine', '/app/legacy-engine',
      'curiosity_discovery', '/app/curiosity-discovery-engine',
      'growth_evolution', '/app/growth-evolution-engine',
      'companion_identity', '/app/companion-identity-engine',
      'personality', '/app/personality',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('wonder_engine.manage'),
      'can_export', public._irp_has_permission('wonder_engine.export'),
      'can_acknowledge_reflections', public._irp_has_permission('wonder_engine.reflections.acknowledge')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_wonder_engine_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_wonder_engine_settings;
begin
  perform public._irp_require_permission('wonder_engine.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._wne_ensure_settings(v_org_id);
  perform public._wne_seed_data(v_org_id);

  perform public._wne_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'wonder_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy', 'Progress can be inspiring — preserve amazement and healthy possibility.',
    'mission', 'Preserve optimism, celebrate possibility, stay connected to building something meaningful.',
    'abos_principle', 'Efficiency builds capability; wonder preserves humanity.',
    'vision', 'You did. And it has been an incredible journey.',
    'moments_of_wonder_types', public._wne_moments_of_wonder_types(),
    'reflection_prompt_examples', public._wne_reflection_prompt_examples(),
    'self_love_note', public._wne_self_love_note(),
    'impact_note', public._wne_impact_note(),
    'legacy_note', public._wne_legacy_note(),
    'companion_note', public._wne_companion_note(),
    'boundaries', public._wne_boundaries(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'title', m.title,
          'summary', m.summary,
          'significance_note', m.significance_note,
          'acknowledged', m.acknowledged,
          'created_at', m.created_at
        ) order by m.created_at desc
      )
      from public.organization_wonder_moments m
      where m.organization_id = v_org_id
      order by m.created_at desc
      limit 50
    ), '[]'::jsonb),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'context_summary', r.context_summary,
          'status', r.status,
          'suggested_pause_note', r.suggested_pause_note,
          'created_at', r.created_at
        ) order by r.created_at desc
      )
      from public.organization_wonder_reflections r
      where r.organization_id = v_org_id and r.status = 'pending'
      order by r.created_at desc
      limit 25
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_wonder_moments where organization_id = v_org_id
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_wonder_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('wonder_engine.manage'),
      'can_export', true,
      'can_acknowledge_reflections', public._irp_has_permission('wonder_engine.reflections.acknowledge')
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
    'wne_settings_changed', 'wne_reflection_acknowledged', 'wne_reflection_dismissed',
    'wne_moment_acknowledged', 'wne_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'wne_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'wonder-engine', 'Wonder Engine',
  'Preserve amazement and healthy possibility — authentic reflection prompts, wonder moments, and emotional appreciation of progress.',
  'authenticated', 108
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'wonder-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_wonder_engine_card() to authenticated;
grant execute on function public.get_wonder_engine_dashboard() to authenticated;
grant execute on function public.update_wonder_engine_settings(jsonb) to authenticated;
grant execute on function public.acknowledge_wonder_reflection(uuid, text) to authenticated;
grant execute on function public.acknowledge_wonder_moment(uuid) to authenticated;
grant execute on function public.export_wonder_engine_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._wne_ensure_settings(v_org_id);
    perform public._wne_seed_data(v_org_id);
  end loop;
end; $$;
