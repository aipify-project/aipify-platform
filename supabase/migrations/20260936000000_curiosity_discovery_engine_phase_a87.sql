-- Phase A.87 — Curiosity & Discovery Engine (ABOS)
-- Inspire exploration, learning, and innovation — stay curious when successful.
-- Distinct from Learning Engine, Innovation & Impact A.28, Innovation Experimentation, and Growth & Evolution A.81 (integrates).

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
    'curiosity_discovery_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_curiosity_discovery_engine_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_curiosity_discovery_engine_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  encourage_experimentation boolean not null default true,
  prompt_cadence text not null default 'weekly' check (
    prompt_cadence in ('weekly', 'monthly', 'quarterly')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_curiosity_discovery_engine_settings enable row level security;
revoke all on public.organization_curiosity_discovery_engine_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_discovery_prompts
-- ---------------------------------------------------------------------------
create table if not exists public.organization_discovery_prompts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category text not null check (
    category in ('operational', 'customer', 'knowledge', 'innovation', 'human')
  ),
  prompt text not null check (char_length(prompt) <= 500),
  context_summary text check (char_length(context_summary) <= 500),
  status text not null default 'pending' check (
    status in ('pending', 'explored', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_discovery_prompts_org_cat_idx
  on public.organization_discovery_prompts (organization_id, category, status, created_at desc);

alter table public.organization_discovery_prompts enable row level security;
revoke all on public.organization_discovery_prompts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_discovery_signals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_discovery_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category text not null check (
    category in ('operational', 'customer', 'knowledge', 'innovation', 'human')
  ),
  summary text not null check (char_length(summary) <= 500),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_discovery_signals_org_cat_idx
  on public.organization_discovery_signals (organization_id, category, created_at desc);

alter table public.organization_discovery_signals enable row level security;
revoke all on public.organization_discovery_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'curiosity_discovery_engine', v.description
from (values
  ('curiosity_discovery.view', 'View Curiosity & Discovery Engine', 'View discovery dashboard and exploration prompts'),
  ('curiosity_discovery.manage', 'Manage Curiosity & Discovery Engine', 'Update curiosity settings and discovery preferences'),
  ('curiosity_discovery.export', 'Export Curiosity & Discovery Engine', 'Export discovery prompts and signal summaries'),
  ('curiosity_discovery.prompts.explore', 'Explore Discovery Prompts', 'Mark discovery prompts as explored or dismissed')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'curiosity_discovery.view'), ('owner', 'curiosity_discovery.manage'),
  ('owner', 'curiosity_discovery.export'), ('owner', 'curiosity_discovery.prompts.explore'),
  ('administrator', 'curiosity_discovery.view'), ('administrator', 'curiosity_discovery.manage'),
  ('administrator', 'curiosity_discovery.export'), ('administrator', 'curiosity_discovery.prompts.explore'),
  ('manager', 'curiosity_discovery.view'), ('manager', 'curiosity_discovery.manage'),
  ('manager', 'curiosity_discovery.export'), ('manager', 'curiosity_discovery.prompts.explore'),
  ('employee', 'curiosity_discovery.view'), ('employee', 'curiosity_discovery.export'),
  ('employee', 'curiosity_discovery.prompts.explore'),
  ('support_agent', 'curiosity_discovery.view'),
  ('moderator', 'curiosity_discovery.view'),
  ('viewer', 'curiosity_discovery.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_cde_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cde_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'cde_' || p_action_type,
    'curiosity_discovery_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._cde_ensure_settings(p_organization_id uuid)
returns public.organization_curiosity_discovery_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_curiosity_discovery_engine_settings;
begin
  insert into public.organization_curiosity_discovery_engine_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_curiosity_discovery_engine_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._cde_discovery_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational discovery',
      'bullets', jsonb_build_array(
        'What if we simplified this workflow?',
        'Where does friction hide in daily operations?',
        'What would make handoffs clearer for everyone?'
      )
    ),
    jsonb_build_object(
      'key', 'customer',
      'label', 'Customer discovery',
      'bullets', jsonb_build_array(
        'What do customers wish we understood better?',
        'Where could clearer communication prevent repeat contacts?',
        'What would surprise-and-delight look like at our scale?'
      )
    ),
    jsonb_build_object(
      'key', 'knowledge',
      'label', 'Knowledge discovery',
      'bullets', jsonb_build_array(
        'Which questions keep coming back — and why?',
        'What knowledge would help new team members on day one?',
        'What approved learning could we extend further?'
      )
    ),
    jsonb_build_object(
      'key', 'innovation',
      'label', 'Innovation discovery',
      'bullets', jsonb_build_array(
        'What small experiment could we try this week?',
        'What assumption deserves a gentle challenge?',
        'What would we build if we started fresh today?'
      )
    ),
    jsonb_build_object(
      'key', 'human',
      'label', 'Human discovery',
      'bullets', jsonb_build_array(
        'What helps teams feel safe to ask questions?',
        'Where could we create more space for reflection?',
        'What would healthy experimentation look like here?'
      )
    )
  );
$$;

create or replace function public._cde_question_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'simplify', 'question', 'What if we simplified this process?'),
    jsonb_build_object('key', 'customer_perspective', 'question', 'What would a new customer notice first?'),
    jsonb_build_object('key', 'beginner_mindset', 'question', 'What would we try if we had a beginner''s mindset?'),
    jsonb_build_object('key', 'assumption', 'question', 'Which assumption deserves a gentle challenge this week?'),
    jsonb_build_object('key', 'learning_safety', 'question', 'How can mistakes become lessons without fear?')
  );
$$;

create or replace function public._cde_trust_note()
returns text language sql immutable as $$
  select 'Questions are welcomed; ideas are respected; mistakes become lessons. Metadata only — no raw customer conversations, emails, or PII. Curiosity fuels evolution with psychological safety.';
$$;

create or replace function public._cde_self_love_note()
returns text language sql immutable as $$
  select 'Self Love: reflection, healthy experimentation, and psychological safety — learn without fear. Success should not close curiosity.';
$$;

create or replace function public._cde_seed_prompts(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_discovery_prompts
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_discovery_prompts (
    organization_id, category, prompt, context_summary, status, metadata
  ) values
    (p_organization_id, 'operational',
     'What if we simplified our support triage handoff?',
     'Operational friction signals suggest clearer ownership could help.',
     'pending', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'customer',
     'What would a new customer notice about our response quality?',
     'Customer discovery — perspective-taking without storing message content.',
     'pending', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'knowledge',
     'Which repeat questions could become Knowledge Center articles?',
     'Knowledge discovery — gap patterns from metadata only.',
     'explored', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'innovation',
     'What small experiment could we try to reduce context switching?',
     'Innovation discovery — healthy experimentation with low risk.',
     'pending', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'human',
     'How can we make it safer to ask "what if?" on this team?',
     'Human discovery — psychological safety and beginner''s mindset.',
     'pending', '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

create or replace function public._cde_seed_signals(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_discovery_signals
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_discovery_signals (
    organization_id, category, summary, confidence, metadata
  ) values
    (p_organization_id, 'operational',
     'Workflow metadata suggests a simplification opportunity in support handoffs.',
     'moderate', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'knowledge',
     'Repeat question patterns indicate a KC article opportunity.',
     'high', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'human',
     'Team reflection cadence could support safer experimentation.',
     'low', '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_curiosity_discovery_engine_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_curiosity_discovery_engine_settings;
begin
  perform public._irp_require_permission('curiosity_discovery.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._cde_ensure_settings(v_org_id);

  update public.organization_curiosity_discovery_engine_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    encourage_experimentation = coalesce(
      (p_payload->>'encourage_experimentation')::boolean, encourage_experimentation
    ),
    prompt_cadence = coalesce(nullif(trim(p_payload->>'prompt_cadence'), ''), prompt_cadence),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._cde_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'prompt_cadence', v_row.prompt_cadence,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. explore + dismiss prompt
-- ---------------------------------------------------------------------------
create or replace function public.explore_discovery_prompt(p_prompt_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_discovery_prompts;
begin
  perform public._irp_require_permission('curiosity_discovery.prompts.explore');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_discovery_prompts set
    status = 'explored',
    updated_at = now()
  where id = p_prompt_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Prompt not found';
  end if;

  perform public._cde_log(v_org_id, v_user_id, 'prompt_explored', jsonb_build_object(
    'prompt_id', v_row.id,
    'category', v_row.category,
    'metadata_only', true
  ));

  return jsonb_build_object(
    'success', true,
    'prompt_id', v_row.id,
    'status', v_row.status
  );
end; $$;

create or replace function public.dismiss_discovery_prompt(p_prompt_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_discovery_prompts;
begin
  perform public._irp_require_permission('curiosity_discovery.prompts.explore');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_discovery_prompts set
    status = 'dismissed',
    updated_at = now()
  where id = p_prompt_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Prompt not found';
  end if;

  perform public._cde_log(v_org_id, v_user_id, 'prompt_dismissed', jsonb_build_object(
    'prompt_id', v_row.id,
    'category', v_row.category,
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
create or replace function public.get_curiosity_discovery_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_prompts int := 0;
  v_pending int := 0;
  v_signals int := 0;
begin
  perform public._irp_require_permission('curiosity_discovery.view');
  v_org_id := public._mta_require_organization();
  perform public._cde_ensure_settings(v_org_id);
  perform public._cde_seed_prompts(v_org_id);
  perform public._cde_seed_signals(v_org_id);

  select count(*) into v_prompts
  from public.organization_discovery_prompts where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_discovery_prompts
  where organization_id = v_org_id and status = 'pending';

  select count(*) into v_signals
  from public.organization_discovery_signals where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Answers solve today; curiosity creates tomorrow.',
    'prompt_count', v_prompts,
    'pending_prompts', v_pending,
    'signal_count', v_signals,
    'enabled', (select enabled from public.organization_curiosity_discovery_engine_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_curiosity_discovery_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_curiosity_discovery_engine_settings;
begin
  perform public._irp_require_permission('curiosity_discovery.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cde_ensure_settings(v_org_id);
  perform public._cde_seed_prompts(v_org_id);
  perform public._cde_seed_signals(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'The future belongs to curious organizations — questions matter more than immediate answers.',
    'mission', 'Discover better ways of working, learning, and creating value.',
    'abos_principle', 'Answers solve today; curiosity creates tomorrow.',
    'vision', 'What if?',
    'distinction_note',
      'Distinct from Learning Engine (/app/learning), Innovation & Impact A.28 (/app/innovation-impact-engine), Innovation Experimentation phases, and Growth & Evolution A.81 (/app/growth-evolution-engine). Curiosity = exploration prompts, discovery categories, question-led culture.',
    'discovery_categories', public._cde_discovery_categories(),
    'question_examples', public._cde_question_examples(),
    'self_love_note', public._cde_self_love_note(),
    'trust_note', public._cde_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_prompts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'category', p.category,
          'prompt', p.prompt,
          'context_summary', p.context_summary,
          'status', p.status,
          'metadata', p.metadata,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) order by p.created_at desc
      )
      from (
        select * from public.organization_discovery_prompts
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) p
    ), '[]'::jsonb),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'category', s.category,
          'summary', s.summary,
          'confidence', s.confidence,
          'metadata', s.metadata,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_discovery_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'prompt_count', coalesce((
        select count(*) from public.organization_discovery_prompts where organization_id = v_org_id
      ), 0),
      'pending_prompts', coalesce((
        select count(*) from public.organization_discovery_prompts
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'explored_prompts', coalesce((
        select count(*) from public.organization_discovery_prompts
        where organization_id = v_org_id and status = 'explored'
      ), 0),
      'prompts_by_category', coalesce((
        select jsonb_object_agg(category, cnt)
        from (
          select category, count(*) as cnt
          from public.organization_discovery_prompts
          where organization_id = v_org_id
          group by category
        ) d
      ), '{}'::jsonb),
      'signal_count', coalesce((
        select count(*) from public.organization_discovery_signals where organization_id = v_org_id
      ), 0),
      'encourage_experimentation', v_settings.encourage_experimentation,
      'prompt_cadence', v_settings.prompt_cadence
    ),
    'integration_links', jsonb_build_object(
      'learning_engine', '/app/learning',
      'innovation_impact', '/app/innovation-impact-engine',
      'growth_evolution', '/app/growth-evolution-engine',
      'continuous_improvement', '/app/continuous-improvement-engine',
      'legacy_engine', '/app/legacy-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('curiosity_discovery.manage'),
      'can_export', public._irp_has_permission('curiosity_discovery.export'),
      'can_explore_prompts', public._irp_has_permission('curiosity_discovery.prompts.explore')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_curiosity_discovery_engine_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_curiosity_discovery_engine_settings;
begin
  perform public._irp_require_permission('curiosity_discovery.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._cde_ensure_settings(v_org_id);
  perform public._cde_seed_prompts(v_org_id);
  perform public._cde_seed_signals(v_org_id);

  perform public._cde_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'curiosity_discovery_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy', 'Answers solve today; curiosity creates tomorrow.',
    'mission', 'Discover better ways of working, learning, and creating value.',
    'abos_principle', 'Answers solve today; curiosity creates tomorrow.',
    'vision', 'What if?',
    'discovery_categories', public._cde_discovery_categories(),
    'question_examples', public._cde_question_examples(),
    'trust_note', public._cde_trust_note(),
    'self_love_note', public._cde_self_love_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_prompts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'category', p.category,
          'prompt', p.prompt,
          'context_summary', p.context_summary,
          'status', p.status,
          'created_at', p.created_at
        ) order by p.created_at desc
      )
      from public.organization_discovery_prompts p
      where p.organization_id = v_org_id
      order by p.created_at desc
      limit 50
    ), '[]'::jsonb),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'category', s.category,
          'summary', s.summary,
          'confidence', s.confidence,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_discovery_signals s
      where s.organization_id = v_org_id
      order by s.created_at desc
      limit 50
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'prompt_count', coalesce((
        select count(*) from public.organization_discovery_prompts where organization_id = v_org_id
      ), 0),
      'signal_count', coalesce((
        select count(*) from public.organization_discovery_signals where organization_id = v_org_id
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('curiosity_discovery.manage'),
      'can_export', true,
      'can_explore_prompts', public._irp_has_permission('curiosity_discovery.prompts.explore')
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
    'cde_settings_changed', 'cde_prompt_explored', 'cde_prompt_dismissed', 'cde_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%'
    or p_action_type like 'cde_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'curiosity-discovery-engine', 'Curiosity & Discovery Engine',
  'Inspire exploration, learning, and innovation — exploration prompts, discovery categories, and question-led culture.',
  'authenticated', 109
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'curiosity-discovery-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_curiosity_discovery_engine_card() to authenticated;
grant execute on function public.get_curiosity_discovery_engine_dashboard() to authenticated;
grant execute on function public.update_curiosity_discovery_engine_settings(jsonb) to authenticated;
grant execute on function public.explore_discovery_prompt(uuid) to authenticated;
grant execute on function public.dismiss_discovery_prompt(uuid) to authenticated;
grant execute on function public.export_curiosity_discovery_engine_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._cde_ensure_settings(v_org_id);
    perform public._cde_seed_prompts(v_org_id);
    perform public._cde_seed_signals(v_org_id);
  end loop;
end; $$;
