-- Phase A.93 — Wisdom Engine (ABOS)
-- Transform knowledge + experience into thoughtful guidance — trade-offs, humility, long-term thinking.
-- Distinct from DSE Phase 38, Organizational Decision Support A.54, Strategic Intelligence A.31,
-- Curiosity & Discovery A.87, Legacy A.86, Organizational Memory A.34 (integrates as source).

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
    'hope_engine',
    'wisdom_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_wisdom_engine_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wisdom_engine_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  humility_mode_enabled boolean not null default true,
  trade_off_prompts_enabled boolean not null default true,
  pause_before_major_decisions boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_wisdom_engine_settings enable row level security;
revoke all on public.organization_wisdom_engine_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_wisdom_insights (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wisdom_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_type text not null check (
    source_type in ('memory', 'lesson', 'impact', 'relationship', 'kc', 'reflection', 'outcome')
  ),
  summary text not null check (char_length(summary) <= 500),
  trade_offs jsonb not null default '[]'::jsonb,
  humility_note text check (char_length(humility_note) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_wisdom_insights_org_src_idx
  on public.organization_wisdom_insights (organization_id, source_type, created_at desc);

alter table public.organization_wisdom_insights enable row level security;
revoke all on public.organization_wisdom_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_wisdom_guidance_prompts
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wisdom_guidance_prompts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prompt text not null check (char_length(prompt) <= 500),
  context_summary text check (char_length(context_summary) <= 500),
  considerations jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'reviewed', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_wisdom_guidance_prompts_org_idx
  on public.organization_wisdom_guidance_prompts (organization_id, status, created_at desc);

alter table public.organization_wisdom_guidance_prompts enable row level security;
revoke all on public.organization_wisdom_guidance_prompts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'wisdom_engine', v.description
from (values
  ('wisdom_engine.view', 'View Wisdom Engine', 'View wisdom dashboard and thoughtful guidance'),
  ('wisdom_engine.manage', 'Manage Wisdom Engine', 'Update wisdom engine settings and preferences'),
  ('wisdom_engine.export', 'Export Wisdom Engine', 'Export wisdom insights and guidance summaries'),
  ('wisdom_engine.guidance.review', 'Review Wisdom Guidance', 'Review or dismiss wisdom guidance prompts')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'wisdom_engine.view'), ('owner', 'wisdom_engine.manage'),
  ('owner', 'wisdom_engine.export'), ('owner', 'wisdom_engine.guidance.review'),
  ('administrator', 'wisdom_engine.view'), ('administrator', 'wisdom_engine.manage'),
  ('administrator', 'wisdom_engine.export'), ('administrator', 'wisdom_engine.guidance.review'),
  ('manager', 'wisdom_engine.view'), ('manager', 'wisdom_engine.manage'),
  ('manager', 'wisdom_engine.export'), ('manager', 'wisdom_engine.guidance.review'),
  ('employee', 'wisdom_engine.view'), ('employee', 'wisdom_engine.export'),
  ('employee', 'wisdom_engine.guidance.review'),
  ('support_agent', 'wisdom_engine.view'),
  ('moderator', 'wisdom_engine.view'),
  ('viewer', 'wisdom_engine.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_wis_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._wis_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'wis_' || p_action_type,
    'wisdom_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._wis_ensure_settings(p_organization_id uuid)
returns public.organization_wisdom_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_wisdom_engine_settings;
begin
  insert into public.organization_wisdom_engine_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_wisdom_engine_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._wis_wisdom_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'memory', 'label', 'Organizational memory', 'description', 'Registered lessons and approved org memory from A.34.'),
    jsonb_build_object('key', 'lesson', 'label', 'Lessons learned', 'description', 'Reflection after setbacks and improvement outcomes.'),
    jsonb_build_object('key', 'impact', 'label', 'Impact observations', 'description', 'Measured outcomes and consequence patterns from Impact Engine A.85.'),
    jsonb_build_object('key', 'relationship', 'label', 'Relationship patterns', 'description', 'Metadata patterns from relationship and stakeholder context.'),
    jsonb_build_object('key', 'kc', 'label', 'Knowledge Center', 'description', 'Approved policies, procedures, and organizational knowledge articles.'),
    jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Post-decision and post-setback reflection summaries — metadata only.'),
    jsonb_build_object('key', 'outcome', 'label', 'Long-term outcomes', 'description', 'Historical experiences and long-horizon consequence tracking.')
  );
$$;

create or replace function public._wis_wisdom_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'What was learned before — apply experience, not only information',
    'Trade-offs matter — name pros, cons, and what you may give up',
    'What matters most — priorities over convenience',
    'Consequences — short-term gain vs long-term trust and purpose',
    'Short vs long term — balance urgency with stewardship',
    'Humility — acknowledge limits and factors you cannot evaluate',
    'Human judgment — people decide; Aipify prepares and frames'
  );
$$;

create or replace function public._wis_thoughtful_guidance_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'scenario', 'Similar past approach',
      'guidance', 'A similar approach worked before in comparable conditions — consider what changed since then.',
      'trade_off', 'Speed of reuse vs fit to current context'
    ),
    jsonb_build_object(
      'scenario', 'Pros and cons framing',
      'guidance', 'Option A may improve efficiency; Option B may preserve trust with customers who value transparency.',
      'trade_off', 'Efficiency vs trust'
    ),
    jsonb_build_object(
      'scenario', 'Valid perspectives',
      'guidance', 'Different stakeholders may weigh this differently — finance, operations, and customer-facing teams each have valid perspectives.',
      'trade_off', 'Alignment vs inclusive deliberation'
    ),
    jsonb_build_object(
      'scenario', 'Long-term pride',
      'guidance', 'Which choice would you be proud of years later — for people, purpose, and reputation?',
      'trade_off', 'Immediate outcome vs lasting responsibility'
    )
  );
$$;

create or replace function public._wis_humility_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'There are factors I cannot evaluate from available information.',
    'Human judgment is important here — I can frame options, not decide for you.',
    'Additional expertise may be valuable before committing to this path.',
    'Outcomes depend on context I do not fully see — treat this as preparation, not certainty.',
    'Past patterns suggest possibilities, not guarantees.'
  );
$$;

create or replace function public._wis_self_love_note()
returns text language sql immutable as $$
  select 'Self Love in wisdom: pause before major decisions, learn from mistakes without harsh self-judgment, reduce impulsive choices, and create space for perspective — thoughtful beats rushed.';
$$;

create or replace function public._wis_trust_note()
returns text language sql immutable as $$
  select 'Transparent, balanced, respectful guidance with honest limitations. Metadata only — insight summaries (max 500 chars), trade-off framing, and guidance prompt status — never raw conversations, emails, or PII.';
$$;

create or replace function public._wis_growth_note()
returns text language sql immutable as $$
  select 'Growth & Evolution A.81 — experience becomes insight through continuous learning. Wisdom synthesizes that insight into guidance for decisions you can stand behind.';
$$;

create or replace function public._wis_seed_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_wisdom_insights
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_wisdom_insights (
    organization_id, source_type, summary, trade_offs, humility_note, metadata
  ) values
    (p_organization_id, 'lesson',
     'Prior rush to automate support replies reduced trust when edge cases were mishandled.',
     '[{"pro":"Faster first response","con":"Lower trust on complex cases","priority":"trust"}]'::jsonb,
     'Human review remained essential for sensitive categories.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'impact',
     'Transparent delay communication improved retention vs silent backlog growth.',
     '[{"pro":"Honest expectations","con":"Short-term satisfaction dip","priority":"long_term_trust"}]'::jsonb,
     'Outcome patterns vary by customer segment.',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'memory',
     'Org memory: escalation playbook revision after repeated mis-triage in billing category.',
     '[{"pro":"Consistent handling","con":"Setup time for training","priority":"quality"}]'::jsonb,
     null,
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'reflection',
     'Post-setback review: cutting onboarding steps sped signup but increased early churn.',
     '[{"pro":"Conversion speed","con":"Activation depth","priority":"sustainable_growth"}]'::jsonb,
     'Additional customer research recommended before repeating.',
     '{"seed": true, "metadata_only": true}'::jsonb);

  insert into public.organization_wisdom_guidance_prompts (
    organization_id, prompt, context_summary, considerations, status, metadata
  ) values
    (p_organization_id,
     'Before approving this policy change, what similar decisions taught us — and what trade-offs matter most now?',
     'Policy update under review — efficiency vs stakeholder trust.',
     '["Past rollout friction","Training burden","Long-term compliance risk"]'::jsonb,
     'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id,
     'If we optimize for speed here, what might we sacrifice in customer trust or team capacity?',
     'Operational bottleneck — short-term throughput vs sustainable load.',
     '["Support backlog","Team burnout signals","Customer expectation patterns"]'::jsonb,
     'pending',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id,
     'Which choice aligns with what matters most — and would we be proud of it years later?',
     'Strategic fork — revenue acceleration vs purpose-aligned growth.',
     '["Purpose & Values charter","Long-term reputation","Valid stakeholder perspectives"]'::jsonb,
     'reviewed',
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_wisdom_engine_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_wisdom_engine_settings;
begin
  perform public._irp_require_permission('wisdom_engine.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._wis_ensure_settings(v_org_id);

  update public.organization_wisdom_engine_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    humility_mode_enabled = coalesce(
      (p_payload->>'humility_mode_enabled')::boolean, humility_mode_enabled
    ),
    trade_off_prompts_enabled = coalesce(
      (p_payload->>'trade_off_prompts_enabled')::boolean, trade_off_prompts_enabled
    ),
    pause_before_major_decisions = coalesce(
      (p_payload->>'pause_before_major_decisions')::boolean, pause_before_major_decisions
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._wis_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'humility_mode_enabled', v_row.humility_mode_enabled,
    'trade_off_prompts_enabled', v_row.trade_off_prompts_enabled,
    'pause_before_major_decisions', v_row.pause_before_major_decisions,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. review_wisdom_guidance_prompt
-- ---------------------------------------------------------------------------
create or replace function public.review_wisdom_guidance_prompt(
  p_prompt_id uuid,
  p_action text default 'review'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_wisdom_guidance_prompts;
  v_action text;
  v_status text;
begin
  perform public._irp_require_permission('wisdom_engine.guidance.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_action := lower(coalesce(nullif(trim(p_action), ''), 'review'));

  v_status := case
    when v_action in ('dismiss', 'dismissed') then 'dismissed'
    else 'reviewed'
  end;

  update public.organization_wisdom_guidance_prompts set
    status = v_status,
    updated_at = now(),
    metadata = metadata || jsonb_build_object(
      'reviewed_by', v_user_id,
      'reviewed_at', now(),
      'metadata_only', true
    )
  where id = p_prompt_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Guidance prompt not found';
  end if;

  perform public._wis_log(v_org_id, v_user_id, 'guidance_prompt_' || v_status, jsonb_build_object(
    'prompt_id', v_row.id,
    'status', v_row.status,
    'metadata_only', true
  ));

  return jsonb_build_object(
    'success', true,
    'prompt_id', v_row.id,
    'status', v_row.status
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_wisdom_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_insights int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('wisdom_engine.view');
  v_org_id := public._mta_require_organization();
  perform public._wis_ensure_settings(v_org_id);
  perform public._wis_seed_data(v_org_id);

  select count(*) into v_insights
  from public.organization_wisdom_insights where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_wisdom_guidance_prompts
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Wisdom is context, trade-offs, and humility — not just answers.',
    'insight_count', v_insights,
    'pending_prompts', v_pending,
    'enabled', (select enabled from public.organization_wisdom_engine_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_wisdom_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_wisdom_engine_settings;
begin
  perform public._irp_require_permission('wisdom_engine.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._wis_ensure_settings(v_org_id);
  perform public._wis_seed_data(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Wisdom is context, trade-offs, and humility — not just answers. Apply knowledge responsibly; determine which questions matter most.',
    'mission',
      'Better decisions through learning from experience, balancing priorities, and weighing long-term consequences.',
    'abos_principle',
      'Intelligence answers questions; wisdom determines which questions matter.',
    'vision',
      'Decisions you can be proud of years later — thoughtful, responsible, centered on people and purpose; move forward with care.',
    'distinction_note',
      'Distinct from Assistant DSE Phase 38 (/app/assistant/decisions), Organizational Decision Support A.54, Strategic Intelligence A.31, Curiosity & Discovery A.87, Legacy A.86, and Organizational Memory A.34 (source). Wisdom = experience-to-guidance synthesis, trade-off framing, humility, long-term thinking.',
    'wisdom_sources', public._wis_wisdom_sources(),
    'wisdom_principles', public._wis_wisdom_principles(),
    'thoughtful_guidance_examples', public._wis_thoughtful_guidance_examples(),
    'humility_examples', public._wis_humility_examples(),
    'self_love_note', public._wis_self_love_note(),
    'trust_note', public._wis_trust_note(),
    'growth_note', public._wis_growth_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_insights', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', i.id,
          'source_type', i.source_type,
          'summary', i.summary,
          'trade_offs', i.trade_offs,
          'humility_note', i.humility_note,
          'metadata', i.metadata,
          'created_at', i.created_at,
          'updated_at', i.updated_at
        ) order by i.created_at desc
      )
      from (
        select * from public.organization_wisdom_insights
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) i
    ), '[]'::jsonb),
    'pending_prompts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'prompt', p.prompt,
          'context_summary', p.context_summary,
          'considerations', p.considerations,
          'status', p.status,
          'metadata', p.metadata,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) order by p.created_at desc
      )
      from (
        select * from public.organization_wisdom_guidance_prompts
        where organization_id = v_org_id and status = 'pending'
        order by created_at desc
        limit 10
      ) p
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'insight_count', coalesce((
        select count(*) from public.organization_wisdom_insights where organization_id = v_org_id
      ), 0),
      'insights_by_source', coalesce((
        select jsonb_object_agg(source_type, cnt)
        from (
          select source_type, count(*) as cnt
          from public.organization_wisdom_insights
          where organization_id = v_org_id
          group by source_type
        ) t
      ), '{}'::jsonb),
      'prompt_count', coalesce((
        select count(*) from public.organization_wisdom_guidance_prompts where organization_id = v_org_id
      ), 0),
      'prompts_by_status', coalesce((
        select jsonb_object_agg(status, cnt)
        from (
          select status, count(*) as cnt
          from public.organization_wisdom_guidance_prompts
          where organization_id = v_org_id
          group by status
        ) s
      ), '{}'::jsonb),
      'pending_prompts', coalesce((
        select count(*) from public.organization_wisdom_guidance_prompts
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'humility_mode_enabled', v_settings.humility_mode_enabled,
      'trade_off_prompts_enabled', v_settings.trade_off_prompts_enabled,
      'pause_before_major_decisions', v_settings.pause_before_major_decisions
    ),
    'integration_links', jsonb_build_object(
      'organizational_memory', '/app/organizational-memory-engine',
      'organizational_decision_support', '/app/organizational-decision-support-engine',
      'decision_support_assistant', '/app/assistant/decisions',
      'impact_engine', '/app/impact-engine',
      'growth_evolution', '/app/growth-evolution-engine',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('wisdom_engine.manage'),
      'can_export', public._irp_has_permission('wisdom_engine.export'),
      'can_review_guidance', public._irp_has_permission('wisdom_engine.guidance.review')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_wisdom_engine_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_wisdom_engine_settings;
begin
  perform public._irp_require_permission('wisdom_engine.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._wis_ensure_settings(v_org_id);
  perform public._wis_seed_data(v_org_id);

  perform public._wis_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'wisdom_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy',
      'Wisdom is context, trade-offs, and humility — not just answers. Apply knowledge responsibly.',
    'mission',
      'Better decisions through learning from experience, balancing priorities, and weighing long-term consequences.',
    'abos_principle',
      'Intelligence answers questions; wisdom determines which questions matter.',
    'vision',
      'Decisions you can be proud of years later — thoughtful, responsible, centered on people and purpose.',
    'wisdom_sources', public._wis_wisdom_sources(),
    'wisdom_principles', public._wis_wisdom_principles(),
    'thoughtful_guidance_examples', public._wis_thoughtful_guidance_examples(),
    'humility_examples', public._wis_humility_examples(),
    'self_love_note', public._wis_self_love_note(),
    'trust_note', public._wis_trust_note(),
    'growth_note', public._wis_growth_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_insights', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', i.id,
          'source_type', i.source_type,
          'summary', i.summary,
          'trade_offs', i.trade_offs,
          'humility_note', i.humility_note,
          'created_at', i.created_at
        ) order by i.created_at desc
      )
      from public.organization_wisdom_insights i
      where i.organization_id = v_org_id
      order by i.created_at desc
      limit 50
    ), '[]'::jsonb),
    'pending_prompts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'prompt', p.prompt,
          'context_summary', p.context_summary,
          'considerations', p.considerations,
          'status', p.status,
          'created_at', p.created_at
        ) order by p.created_at desc
      )
      from public.organization_wisdom_guidance_prompts p
      where p.organization_id = v_org_id
      order by p.created_at desc
      limit 50
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'insight_count', coalesce((
        select count(*) from public.organization_wisdom_insights where organization_id = v_org_id
      ), 0),
      'prompt_count', coalesce((
        select count(*) from public.organization_wisdom_guidance_prompts where organization_id = v_org_id
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('wisdom_engine.manage'),
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
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported',
    'pcp_settings_changed', 'pcp_comfort_moment_recorded', 'pcp_report_exported',
    'wis_settings_changed', 'wis_guidance_prompt_reviewed', 'wis_guidance_prompt_dismissed', 'wis_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'gre_%'
    or p_action_type like 'pcp_%' or p_action_type like 'wis_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'wisdom-engine', 'Wisdom Engine',
  'Experience-to-guidance synthesis — trade-off framing, humility, and long-term thinking for thoughtful decisions.',
  'authenticated', 110
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'wisdom-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_wisdom_engine_card() to authenticated;
grant execute on function public.get_wisdom_engine_dashboard() to authenticated;
grant execute on function public.update_wisdom_engine_settings(jsonb) to authenticated;
grant execute on function public.review_wisdom_guidance_prompt(uuid, text) to authenticated;
grant execute on function public.export_wisdom_engine_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._wis_ensure_settings(v_org_id);
    perform public._wis_seed_data(v_org_id);
  end loop;
end; $$;
