-- Phase A.92 — Hope Engine (ABOS)
-- Realistic encouragement and balanced optimism during difficulty — hope inspires action, not passivity.
-- Distinct from Wonder A.88, Presence & Comfort A.90, Dedication A.91, Resilience A.50, Growth & Evolution A.81.

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
    'dedication_engine',
    'hope_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_hope_engine_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_hope_engine_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  realistic_encouragement_enabled boolean not null default true,
  highlight_progress boolean not null default true,
  balance_with_self_love boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_hope_engine_settings enable row level security;
revoke all on public.organization_hope_engine_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_hope_signals (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_hope_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  context_type text not null check (
    context_type in (
      'change', 'setback', 'demanding_project', 'failed_attempt',
      'uncertainty', 'invisible_progress', 'personal_challenge'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  encouragement_note text check (char_length(encouragement_note) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_hope_signals_org_idx
  on public.organization_hope_signals (organization_id, context_type, created_at desc);

alter table public.organization_hope_signals enable row level security;
revoke all on public.organization_hope_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_hope_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.organization_hope_reflections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prompt text not null check (char_length(prompt) <= 500),
  balanced_message text check (char_length(balanced_message) <= 500),
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_hope_reflections_org_status_idx
  on public.organization_hope_reflections (organization_id, status, created_at desc);

alter table public.organization_hope_reflections enable row level security;
revoke all on public.organization_hope_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'hope_engine', v.description
from (values
  ('hope_engine.view', 'View Hope Engine', 'View hope dashboard, signals, and balanced encouragement guidance'),
  ('hope_engine.manage', 'Manage Hope Engine', 'Update hope engine settings'),
  ('hope_engine.export', 'Export Hope Engine', 'Export hope engine report'),
  ('hope_engine.reflections.acknowledge', 'Acknowledge Hope Reflections', 'Acknowledge or dismiss hope reflection prompts')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'hope_engine.view'), ('owner', 'hope_engine.manage'),
  ('owner', 'hope_engine.export'), ('owner', 'hope_engine.reflections.acknowledge'),
  ('administrator', 'hope_engine.view'), ('administrator', 'hope_engine.manage'),
  ('administrator', 'hope_engine.export'), ('administrator', 'hope_engine.reflections.acknowledge'),
  ('manager', 'hope_engine.view'), ('manager', 'hope_engine.manage'),
  ('manager', 'hope_engine.export'), ('manager', 'hope_engine.reflections.acknowledge'),
  ('employee', 'hope_engine.view'), ('employee', 'hope_engine.export'),
  ('employee', 'hope_engine.reflections.acknowledge'),
  ('support_agent', 'hope_engine.view'),
  ('moderator', 'hope_engine.view'),
  ('viewer', 'hope_engine.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_hpe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._hpe_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'hpe_' || p_action_type,
    'hope_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._hpe_ensure_settings(p_organization_id uuid)
returns public.organization_hope_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_hope_engine_settings;
begin
  insert into public.organization_hope_engine_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_hope_engine_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._hpe_when_hope_matters()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'change', 'label', 'Organizational change', 'description', 'Transitions and restructuring — maintain perspective while adapting.'),
    jsonb_build_object('key', 'setback', 'label', 'Setback', 'description', 'Disappointments and reversals — setbacks do not define the whole journey.'),
    jsonb_build_object('key', 'demanding_project', 'label', 'Demanding project', 'description', 'Sustained effort under pressure — recognize effort and incremental progress.'),
    jsonb_build_object('key', 'failed_attempt', 'label', 'Failed attempt', 'description', 'Experiments that did not work — learning and next steps still matter.'),
    jsonb_build_object('key', 'uncertainty', 'label', 'Uncertainty', 'description', 'Ambiguous futures — balanced optimism without false certainty.'),
    jsonb_build_object('key', 'invisible_progress', 'label', 'Invisible progress', 'description', 'Work that is hard to measure — effort may be advancing even when outcomes lag.'),
    jsonb_build_object('key', 'personal_challenge', 'label', 'Personal challenge', 'description', 'Individual difficulty alongside work — kindness, recovery, and realistic encouragement.')
  );
$$;

create or replace function public._hpe_communication_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Recognize effort — not only outcomes',
    'Highlight progress — including quiet or incremental gains',
    'Encourage perseverance — without minimizing difficulty',
    'Acknowledge difficulty honestly — hope is not blind optimism',
    'Balanced optimism — improvement remains possible',
    'Inspire action — hope supports the next step, not passivity',
    'Reduce perfectionism — incremental progress counts'
  );
$$;

create or replace function public._hpe_example_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phrase', 'What you are building takes time — the effort you put in still matters.', 'intent', 'recognize_effort'),
    jsonb_build_object('phrase', 'This is hard, and you are making progress even when it is not visible yet.', 'intent', 'invisible_progress'),
    jsonb_build_object('phrase', 'Setbacks are part of the journey — what you learn here can still move you forward.', 'intent', 'setback'),
    jsonb_build_object('phrase', 'One thoughtful next step is enough for today.', 'intent', 'action_oriented'),
    jsonb_build_object('phrase', 'Improvement is still possible — focus on what you can influence next.', 'intent', 'balanced_optimism'),
    jsonb_build_object('phrase', 'You do not have to solve everything at once to be moving in a good direction.', 'intent', 'self_compassion')
  );
$$;

create or replace function public._hpe_boundary_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'avoid', jsonb_build_array(
      'Everything will be fine',
      'It will definitely work out',
      'Just stay positive — nothing to worry about',
      'Unrealistic promises about outcomes or timelines',
      'Minimizing genuine difficulty or loss',
      'Empty cheerleading without acknowledging the challenge'
    ),
    'prefer', jsonb_build_array(
      'This is difficult, and your effort still matters',
      'Improvement remains possible — one step at a time',
      'Setbacks are temporary; growth is still ahead',
      'What you can influence next is enough for now',
      'Progress may be quiet — that does not mean it is absent',
      'Hope supports action — not waiting for things to fix themselves'
    )
  );
$$;

create or replace function public._hpe_self_love_note()
returns text language sql immutable as $$
  select 'Self Love: kindness to yourself, permission to recover, celebrate incremental progress, and reduce perfectionism. Hope paired with self-compassion — not pressure to perform optimism.';
$$;

create or replace function public._hpe_dedication_note()
returns text language sql immutable as $$
  select 'Dedication Engine A.91 (/app/dedication-engine): persistence gives direction and continued effort; Hope Engine adds balanced optimism that effort can still lead somewhere meaningful. Together — keep going with realistic encouragement, not blind slog.';
$$;

create or replace function public._hpe_impact_note()
returns text language sql immutable as $$
  select 'Impact Engine A.85 shows improvement that already happened — measured outcomes and signals. Hope Engine holds that future improvement remains possible — realistic encouragement during difficulty, not outcome reporting.';
$$;

create or replace function public._hpe_seed_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_hope_signals
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_hope_signals (
    organization_id, context_type, summary, encouragement_note, metadata
  ) values
    (p_organization_id, 'setback',
     'Launch milestone slipped — team morale dipped after missed target.',
     'Setbacks are part of the journey; effort and learning from this cycle still matter.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'demanding_project',
     'Sustained delivery push — long hours without visible external wins yet.',
     'What you are building takes time — incremental progress counts even when outcomes lag.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'invisible_progress',
     'Internal refactor and quality work — benefits not yet visible to customers.',
     'Quiet progress is still progress — improvement remains possible.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'uncertainty',
     'Market shift created planning ambiguity — next quarter unclear.',
     'Focus on what you can influence next — balanced optimism without false certainty.',
     '{"seed": true, "metadata_only": true}'::jsonb);

  insert into public.organization_hope_reflections (
    organization_id, prompt, balanced_message, status, metadata
  ) values
    (p_organization_id,
     'What is one sign of progress you might be overlooking because it feels small?',
     'Incremental gains compound — hope notices quiet steps forward.',
     'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id,
     'If this setback is temporary, what is the most thoughtful next step you can take?',
     'Hope inspires action — one step is enough for today.',
     'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id,
     'Where have you persisted before and eventually seen improvement?',
     'Past perseverance is evidence — future improvement remains possible.',
     'acknowledged',
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_hope_engine_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_hope_engine_settings;
begin
  perform public._irp_require_permission('hope_engine.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._hpe_ensure_settings(v_org_id);

  update public.organization_hope_engine_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    realistic_encouragement_enabled = coalesce(
      (p_payload->>'realistic_encouragement_enabled')::boolean, realistic_encouragement_enabled
    ),
    highlight_progress = coalesce(
      (p_payload->>'highlight_progress')::boolean, highlight_progress
    ),
    balance_with_self_love = coalesce(
      (p_payload->>'balance_with_self_love')::boolean, balance_with_self_love
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._hpe_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'realistic_encouragement_enabled', v_row.realistic_encouragement_enabled,
    'highlight_progress', v_row.highlight_progress,
    'balance_with_self_love', v_row.balance_with_self_love,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. acknowledge reflection
-- ---------------------------------------------------------------------------
create or replace function public.acknowledge_hope_reflection(
  p_reflection_id uuid,
  p_action text default 'acknowledge'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_status text;
  v_row public.organization_hope_reflections%rowtype;
begin
  perform public._irp_require_permission('hope_engine.reflections.acknowledge');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_status := case when p_action = 'dismiss' then 'dismissed' else 'acknowledged' end;

  update public.organization_hope_reflections set
    status = v_status,
    updated_at = now()
  where id = p_reflection_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Reflection not found';
  end if;

  perform public._hpe_log(v_org_id, v_user_id, 'reflection_' || v_status, jsonb_build_object(
    'reflection_id', v_row.id,
    'metadata_only', true
  ));

  return jsonb_build_object('success', true, 'reflection_id', v_row.id, 'status', v_status);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_hope_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_signals int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('hope_engine.view');
  v_org_id := public._mta_require_organization();
  perform public._hpe_ensure_settings(v_org_id);
  perform public._hpe_seed_data(v_org_id);

  select count(*) into v_signals
  from public.organization_hope_signals where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_hope_reflections
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Hope is not blind optimism — acknowledge difficulty while improvement remains possible.',
    'signal_count', v_signals,
    'pending_reflections', v_pending,
    'enabled', (select enabled from public.organization_hope_engine_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_hope_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_hope_engine_settings;
begin
  perform public._irp_require_permission('hope_engine.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._hpe_ensure_settings(v_org_id);
  perform public._hpe_seed_data(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Hope is not blind optimism — acknowledge difficulty while improvement remains possible; realistic encouragement during demanding times.',
    'mission',
      'Maintain perspective, confidence, and motivation during uncertainty and difficulty — balanced optimism that supports resilience and action.',
    'abos_principle',
      'Sometimes people need reassurance that their effort still matters — hope inspires action, not passivity.',
    'vision',
      'Setbacks feel temporary; growth remains possible — leave people feeling capable of the next step.',
    'distinction_note',
      'Distinct from Wonder Engine A.88 (amazement and possibility moments), Presence & Comfort A.90 (emotional reassurance protocol), Dedication A.91 (persistent follow-through), Organizational Resilience A.50 (crisis continuity), and Growth & Evolution A.81 (learning cycle orchestration). Hope = realistic encouragement and balanced optimism during difficulty.',
    'when_hope_matters', public._hpe_when_hope_matters(),
    'communication_principles', public._hpe_communication_principles(),
    'example_phrases', public._hpe_example_phrases(),
    'self_love_note', public._hpe_self_love_note(),
    'dedication_note', public._hpe_dedication_note(),
    'impact_note', public._hpe_impact_note(),
    'boundary_phrases', public._hpe_boundary_phrases(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'context_type', s.context_type,
          'summary', s.summary,
          'encouragement_note', s.encouragement_note,
          'metadata', s.metadata,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_hope_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'balanced_message', r.balanced_message,
          'status', r.status,
          'metadata', r.metadata,
          'created_at', r.created_at,
          'updated_at', r.updated_at
        ) order by r.created_at desc
      )
      from (
        select * from public.organization_hope_reflections
        where organization_id = v_org_id and status = 'pending'
        order by created_at desc
        limit 10
      ) r
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_hope_signals where organization_id = v_org_id
      ), 0),
      'signals_by_context', coalesce((
        select jsonb_object_agg(context_type, cnt)
        from (
          select context_type, count(*) as cnt
          from public.organization_hope_signals
          where organization_id = v_org_id
          group by context_type
        ) t
      ), '{}'::jsonb),
      'pending_reflections', coalesce((
        select count(*) from public.organization_hope_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'realistic_encouragement_enabled', v_settings.realistic_encouragement_enabled,
      'highlight_progress', v_settings.highlight_progress,
      'balance_with_self_love', v_settings.balance_with_self_love
    ),
    'integration_links', jsonb_build_object(
      'impact_engine', '/app/impact-engine',
      'wonder_engine', '/app/wonder-engine',
      'presence_comfort_protocol', '/app/presence-comfort-protocol',
      'dedication_engine', '/app/dedication-engine',
      'organizational_resilience_engine', '/app/organizational-resilience-engine',
      'growth_evolution_engine', '/app/growth-evolution-engine',
      'purpose_values_engine', '/app/purpose-values-engine',
      'gratitude_recognition_engine', '/app/gratitude-recognition-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('hope_engine.manage'),
      'can_export', public._irp_has_permission('hope_engine.export'),
      'can_acknowledge_reflections', public._irp_has_permission('hope_engine.reflections.acknowledge')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_hope_engine_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_hope_engine_settings;
begin
  perform public._irp_require_permission('hope_engine.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._hpe_ensure_settings(v_org_id);
  perform public._hpe_seed_data(v_org_id);

  perform public._hpe_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'hope_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy',
      'Hope is not blind optimism — acknowledge difficulty while improvement remains possible.',
    'mission',
      'Maintain perspective, confidence, and motivation during uncertainty and difficulty.',
    'abos_principle',
      'Sometimes people need reassurance that their effort still matters — hope inspires action, not passivity.',
    'vision',
      'Setbacks feel temporary; growth remains possible — capable of the next step.',
    'when_hope_matters', public._hpe_when_hope_matters(),
    'communication_principles', public._hpe_communication_principles(),
    'example_phrases', public._hpe_example_phrases(),
    'self_love_note', public._hpe_self_love_note(),
    'dedication_note', public._hpe_dedication_note(),
    'impact_note', public._hpe_impact_note(),
    'boundary_phrases', public._hpe_boundary_phrases(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'context_type', s.context_type,
          'summary', s.summary,
          'encouragement_note', s.encouragement_note,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_hope_signals s
      where s.organization_id = v_org_id
      order by s.created_at desc
      limit 50
    ), '[]'::jsonb),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'balanced_message', r.balanced_message,
          'status', r.status,
          'created_at', r.created_at
        ) order by r.created_at desc
      )
      from public.organization_hope_reflections r
      where r.organization_id = v_org_id and r.status = 'pending'
      order by r.created_at desc
      limit 25
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_hope_signals where organization_id = v_org_id
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_hope_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('hope_engine.manage'),
      'can_export', true,
      'can_acknowledge_reflections', public._irp_has_permission('hope_engine.reflections.acknowledge')
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
    'leg_settings_changed', 'leg_milestone_acknowledged', 'leg_report_exported',
    'cde_settings_changed', 'cde_prompt_explored', 'cde_prompt_dismissed', 'cde_report_exported',
    'wne_settings_changed', 'wne_reflection_acknowledged', 'wne_reflection_dismissed',
    'wne_moment_acknowledged', 'wne_report_exported',
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported',
    'pcp_settings_changed', 'pcp_comfort_moment_recorded', 'pcp_report_exported',
    'ded_settings_changed', 'ded_report_exported',
    'hpe_settings_changed', 'hpe_reflection_acknowledged', 'hpe_reflection_dismissed',
    'hpe_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%'
    or p_action_type like 'cde_%' or p_action_type like 'wne_%' or p_action_type like 'gre_%'
    or p_action_type like 'pcp_%' or p_action_type like 'ded_%' or p_action_type like 'hpe_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'hope-engine', 'Hope Engine',
  'Realistic encouragement and balanced optimism during difficulty — hope inspires action, not passivity.',
  'authenticated', 111
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'hope-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_hope_engine_card() to authenticated;
grant execute on function public.get_hope_engine_dashboard() to authenticated;
grant execute on function public.update_hope_engine_settings(jsonb) to authenticated;
grant execute on function public.acknowledge_hope_reflection(uuid, text) to authenticated;
grant execute on function public.export_hope_engine_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._hpe_ensure_settings(v_org_id);
    perform public._hpe_seed_data(v_org_id);
  end loop;
end; $$;
