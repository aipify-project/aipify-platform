-- Phase A.78 — Relationship Intelligence Engine (Organizational)
-- Tenant-level relationship context: internal, customer, partner, community.
-- Distinct from Phase 33 RSI (personal) at /app/assistant/relationships.

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
    'relationship_intelligence_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_relationship_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.organization_relationship_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category text not null check (
    category in ('internal', 'customer', 'partner', 'community')
  ),
  subject_key text not null,
  display_name text not null,
  relationship_strength text not null default 'moderate' check (
    relationship_strength in ('weak', 'moderate', 'strong', 'critical')
  ),
  interaction_frequency text not null default 'occasional' check (
    interaction_frequency in ('rare', 'occasional', 'regular', 'frequent')
  ),
  sentiment_hint text not null default 'neutral' check (
    sentiment_hint in ('positive', 'neutral', 'caution', 'at_risk')
  ),
  status text not null default 'active' check (
    status in ('active', 'inactive', 'archived')
  ),
  settings jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, category, subject_key)
);

create index if not exists organization_relationship_profiles_org_idx
  on public.organization_relationship_profiles (organization_id, category, status);

alter table public.organization_relationship_profiles enable row level security;
revoke all on public.organization_relationship_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_relationship_interactions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_relationship_interactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid not null references public.organization_relationship_profiles (id) on delete cascade,
  interaction_type text not null check (
    interaction_type in (
      'collaboration', 'support', 'escalation', 'review', 'meeting', 'handoff', 'other'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organization_relationship_interactions_profile_idx
  on public.organization_relationship_interactions (profile_id, created_at desc);

alter table public.organization_relationship_interactions enable row level security;
revoke all on public.organization_relationship_interactions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_relationship_insights
-- ---------------------------------------------------------------------------
create table if not exists public.organization_relationship_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid references public.organization_relationship_profiles (id) on delete set null,
  insight_type text not null check (
    insight_type in (
      'collaboration_pattern', 'escalation_path', 'communication_preference',
      'trust_indicator', 'engagement_trend', 'risk_signal', 'opportunity'
    )
  ),
  category text not null check (
    category in ('internal', 'customer', 'partner', 'community')
  ),
  summary text not null check (char_length(summary) <= 500),
  recommended_action text,
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'resolved', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_relationship_insights_org_idx
  on public.organization_relationship_insights (organization_id, status, category);

alter table public.organization_relationship_insights enable row level security;
revoke all on public.organization_relationship_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_relationship_intelligence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_relationship_intelligence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enable_insight_generation boolean not null default true,
  ethical_guardrails_enabled boolean not null default true,
  notify_on_at_risk boolean not null default true,
  default_confidence_threshold text not null default 'moderate' check (
    default_confidence_threshold in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_relationship_intelligence_settings enable row level security;
revoke all on public.organization_relationship_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'relationship_intelligence', v.description
from (values
  ('relationship_intelligence.view', 'View Relationship Intelligence', 'View organizational relationship profiles and insights'),
  ('relationship_intelligence.manage', 'Manage Relationship Intelligence', 'Create and update relationship profiles and interactions'),
  ('relationship_intelligence.insights.resolve', 'Resolve Relationship Insights', 'Acknowledge, resolve, or dismiss relationship insights')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'relationship_intelligence.view'), ('owner', 'relationship_intelligence.manage'), ('owner', 'relationship_intelligence.insights.resolve'),
  ('administrator', 'relationship_intelligence.view'), ('administrator', 'relationship_intelligence.manage'), ('administrator', 'relationship_intelligence.insights.resolve'),
  ('manager', 'relationship_intelligence.view'), ('manager', 'relationship_intelligence.manage'), ('manager', 'relationship_intelligence.insights.resolve'),
  ('support_agent', 'relationship_intelligence.view'),
  ('viewer', 'relationship_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_rie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._rie_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'relationship_intelligence',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._rie_ensure_settings(p_organization_id uuid)
returns public.organization_relationship_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_relationship_intelligence_settings;
begin
  insert into public.organization_relationship_intelligence_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_relationship_intelligence_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._rie_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'total_profiles', coalesce((
      select count(*) from public.organization_relationship_profiles
      where organization_id = p_organization_id and status != 'archived'
    ), 0),
    'active_profiles', coalesce((
      select count(*) from public.organization_relationship_profiles
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'open_insights', coalesce((
      select count(*) from public.organization_relationship_insights
      where organization_id = p_organization_id and status = 'open'
    ), 0),
    'at_risk_profiles', coalesce((
      select count(*) from public.organization_relationship_profiles
      where organization_id = p_organization_id and sentiment_hint = 'at_risk' and status = 'active'
    ), 0),
    'by_category', coalesce((
      select jsonb_object_agg(category, cnt)
      from (
        select category, count(*) as cnt
        from public.organization_relationship_profiles
        where organization_id = p_organization_id and status = 'active'
        group by category
      ) sub
    ), '{}'::jsonb),
    'recent_interactions', coalesce((
      select count(*) from public.organization_relationship_interactions
      where organization_id = p_organization_id
        and created_at >= now() - interval '30 days'
    ), 0)
  );
end; $$;

create or replace function public._rie_integration_links()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'personal_rsi', jsonb_build_object(
      'route', '/app/assistant/relationships',
      'engine', 'RSI',
      'scope', 'personal',
      'note', 'Phase 33 personal relationships — distinct from organizational A.78',
      'metadata_only', true
    ),
    'support_ai', jsonb_build_object(
      'route', '/app/support-ai-engine',
      'scope', 'customer_support',
      'note', 'Support context informed by customer relationship metadata',
      'metadata_only', true
    ),
    'partner_success', jsonb_build_object(
      'route', '/app/partner-success-engine',
      'engine', 'A.73',
      'scope', 'partner',
      'note', 'Partner portfolio health complements partner relationship profiles',
      'metadata_only', true
    )
  );
end; $$;

create or replace function public._rie_relationship_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'internal',
      'label', 'Internal',
      'description', 'Employee, team, manager, and executive relationships within the organization',
      'context_fields', jsonb_build_array('interaction_frequency', 'collaboration_patterns', 'escalation_paths')
    ),
    jsonb_build_object(
      'key', 'customer',
      'label', 'Customer',
      'description', 'Customer account and stakeholder relationships for support and success',
      'context_fields', jsonb_build_array('communication_preferences', 'trust_indicators', 'engagement_trends')
    ),
    jsonb_build_object(
      'key', 'partner',
      'label', 'Partner',
      'description', 'Implementation, reseller, and advisory partner relationships',
      'context_fields', jsonb_build_array('collaboration_patterns', 'renewal_signals', 'escalation_paths')
    ),
    jsonb_build_object(
      'key', 'community',
      'label', 'Community',
      'description', 'Community, ecosystem, and public stakeholder relationships',
      'context_fields', jsonb_build_array('engagement_trends', 'sentiment_hint', 'trust_indicators')
    )
  );
$$;

create or replace function public._rie_ethical_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Never impersonate users or auto-send messages on behalf of the organization',
    'Metadata only — no raw email, chat, or customer conversation content',
    'Suggestions inform humans — Aipify does not manipulate relationships',
    'Trust indicators are illustrative signals, not judgments about people',
    'Self Love monitors relational health without pressure or guilt',
    'Organizational scope only — personal RSI remains at /app/assistant/relationships'
  );
$$;

create or replace function public._rie_seed_org_profiles(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_internal_id uuid;
  v_customer_id uuid;
  v_partner_id uuid;
  v_community_id uuid;
begin
  perform public._rie_ensure_settings(p_organization_id);

  if exists (
    select 1 from public.organization_relationship_profiles
    where organization_id = p_organization_id limit 1
  ) then
    return;
  end if;

  insert into public.organization_relationship_profiles (
    organization_id, category, subject_key, display_name,
    relationship_strength, interaction_frequency, sentiment_hint, status, settings, metadata
  )
  values (
    p_organization_id, 'internal', 'support-ops-team', 'Support Operations Team',
    'strong', 'frequent', 'positive', 'active',
    '{"escalation_path":"manager","communication_preference":"async","metadata_only":true}'::jsonb,
    '{"role":"internal_team","metadata_only":true}'::jsonb
  )
  returning id into v_internal_id;

  insert into public.organization_relationship_profiles (
    organization_id, category, subject_key, display_name,
    relationship_strength, interaction_frequency, sentiment_hint, status, settings, metadata
  )
  values (
    p_organization_id, 'customer', 'enterprise-account-alpha', 'Enterprise Account Alpha',
    'critical', 'regular', 'neutral', 'active',
    '{"communication_preference":"email","trust_indicator":"stable","metadata_only":true}'::jsonb,
    '{"segment":"enterprise","metadata_only":true}'::jsonb
  )
  returning id into v_customer_id;

  insert into public.organization_relationship_profiles (
    organization_id, category, subject_key, display_name,
    relationship_strength, interaction_frequency, sentiment_hint, status, settings, metadata
  )
  values (
    p_organization_id, 'partner', 'nordic-implementation-partners', 'Nordic Implementation Partners',
    'moderate', 'occasional', 'positive', 'active',
    '{"collaboration_pattern":"phased_rollout","metadata_only":true}'::jsonb,
    '{"partner_type":"implementation","metadata_only":true}'::jsonb
  )
  returning id into v_partner_id;

  insert into public.organization_relationship_profiles (
    organization_id, category, subject_key, display_name,
    relationship_strength, interaction_frequency, sentiment_hint, status, settings, metadata
  )
  values (
    p_organization_id, 'community', 'user-community-forum', 'User Community Forum',
    'moderate', 'regular', 'caution', 'active',
    '{"engagement_trend":"growing","metadata_only":true}'::jsonb,
    '{"channel":"community_forum","metadata_only":true}'::jsonb
  )
  returning id into v_community_id;

  insert into public.organization_relationship_interactions (
    organization_id, profile_id, interaction_type, summary, metadata
  )
  values
    (p_organization_id, v_internal_id, 'collaboration',
     'Weekly cross-team sync established — escalation path documented for support handoffs.',
     '{"metadata_only":true}'::jsonb),
    (p_organization_id, v_customer_id, 'support',
     'Quarterly business review scheduled — account health stable with moderate engagement.',
     '{"metadata_only":true}'::jsonb),
    (p_organization_id, v_partner_id, 'review',
     'Partner onboarding checkpoint completed — adoption tracking aligned with success engine.',
     '{"metadata_only":true}'::jsonb);

  insert into public.organization_relationship_insights (
    organization_id, profile_id, insight_type, category, summary,
    recommended_action, confidence, status, metadata
  )
  values
    (p_organization_id, v_internal_id, 'collaboration_pattern', 'internal',
     'Support and operations teams show strong collaboration frequency — consider documenting handoff playbook.',
     'Review escalation path documentation in Knowledge Center', 'high', 'open',
     '{"source":"seed","metadata_only":true}'::jsonb),
    (p_organization_id, v_customer_id, 'engagement_trend', 'customer',
     'Enterprise account engagement is steady — proactive check-in recommended before renewal window.',
     'Schedule executive touchpoint via Customer Success', 'moderate', 'open',
     '{"source":"seed","metadata_only":true}'::jsonb),
    (p_organization_id, v_partner_id, 'trust_indicator', 'partner',
     'Partner adoption checkpoints are on track — renewal readiness aligns with Partner Success engine.',
     'Share adoption summary with partner manager', 'moderate', 'open',
     '{"source":"seed","metadata_only":true}'::jsonb),
    (p_organization_id, v_community_id, 'risk_signal', 'community',
     'Community sentiment shows caution — monitor feedback themes without auto-responding.',
     'Review community themes in Support AI triage', 'low', 'open',
     '{"source":"seed","metadata_only":true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_relationship_intelligence_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._rie_ensure_settings(v_org_id);
  perform public._rie_seed_org_profiles(v_org_id);
  v_summary := public._rie_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational relationship intelligence — metadata only, humans decide.',
    'total_profiles', v_summary->'total_profiles',
    'open_insights', v_summary->'open_insights',
    'at_risk_profiles', v_summary->'at_risk_profiles'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.list_organization_relationship_profiles(p_category text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('relationship_intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._rie_seed_org_profiles(v_org_id);

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'category', p.category,
        'subject_key', p.subject_key,
        'display_name', p.display_name,
        'relationship_strength', p.relationship_strength,
        'interaction_frequency', p.interaction_frequency,
        'sentiment_hint', p.sentiment_hint,
        'status', p.status,
        'settings', p.settings,
        'metadata', p.metadata,
        'interaction_count', (
          select count(*) from public.organization_relationship_interactions i
          where i.profile_id = p.id
        ),
        'open_insight_count', (
          select count(*) from public.organization_relationship_insights ins
          where ins.profile_id = p.id and ins.status = 'open'
        ),
        'created_at', p.created_at,
        'updated_at', p.updated_at
      ) order by p.category, p.display_name
    )
    from public.organization_relationship_profiles p
    where p.organization_id = v_org_id
      and p.status != 'archived'
      and (p_category is null or p.category = p_category)
  ), '[]'::jsonb);
end; $$;

create or replace function public.create_organization_relationship_insight(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_relationship_insights;
  v_profile_id uuid;
begin
  perform public._irp_require_permission('relationship_intelligence.manage');
  v_org_id := public._mta_require_organization();
  perform public._rie_ensure_settings(v_org_id);

  v_profile_id := nullif(trim(p_payload->>'profile_id'), '')::uuid;

  if v_profile_id is not null and not exists (
    select 1 from public.organization_relationship_profiles
    where id = v_profile_id and organization_id = v_org_id
  ) then
    raise exception 'Profile not found';
  end if;

  if nullif(trim(p_payload->>'summary'), '') is null then
    raise exception 'summary is required';
  end if;

  insert into public.organization_relationship_insights (
    organization_id, profile_id, insight_type, category, summary,
    recommended_action, confidence, status, metadata
  )
  values (
    v_org_id,
    v_profile_id,
    coalesce(nullif(trim(p_payload->>'insight_type'), ''), 'opportunity'),
    coalesce(nullif(trim(p_payload->>'category'), ''), 'internal'),
    left(trim(p_payload->>'summary'), 500),
    nullif(trim(p_payload->>'recommended_action'), ''),
    coalesce(nullif(trim(p_payload->>'confidence'), ''), 'moderate'),
    'open',
    coalesce(p_payload->'metadata', '{}'::jsonb)
  )
  returning * into v_row;

  perform public._rie_log(v_org_id, 'rie_insight_created', 'relationship_insight', v_row.id,
    jsonb_build_object('insight_type', v_row.insight_type, 'category', v_row.category));

  return jsonb_build_object('insight', row_to_json(v_row)::jsonb);
end; $$;

create or replace function public.resolve_organization_relationship_insight(
  p_insight_id uuid,
  p_status text default 'resolved',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_relationship_insights;
begin
  perform public._irp_require_permission('relationship_intelligence.insights.resolve');
  v_org_id := public._mta_require_organization();

  if p_status not in ('acknowledged', 'resolved', 'dismissed') then
    raise exception 'Invalid insight status';
  end if;

  update public.organization_relationship_insights
  set
    status = p_status,
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb),
    updated_at = now()
  where id = p_insight_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Insight not found'; end if;

  perform public._rie_log(v_org_id, 'rie_insight_resolved', 'relationship_insight', v_row.id,
    jsonb_build_object('status', v_row.status));

  return jsonb_build_object('insight', row_to_json(v_row)::jsonb);
end; $$;

create or replace function public.get_relationship_intelligence_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_relationship_intelligence_settings;
  v_summary jsonb;
begin
  perform public._irp_require_permission('relationship_intelligence.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._rie_ensure_settings(v_org_id);
  perform public._rie_seed_org_profiles(v_org_id);
  v_summary := public._rie_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Understand relationships within and around your organization — metadata only, never manipulation.',
    'mission', 'Surface interaction patterns, collaboration context, and trust indicators so teams can strengthen relationships with transparency.',
    'abos_principle', 'Aipify Business Operating System (ABOS) augments people — organizational relationship intelligence informs support, management, and executive decisions without replacing human judgment.',
    'self_love_note', 'Self Love monitors relational health across the organization — gentle signals when collaboration patterns need attention, never pressure or guilt.',
    'relationship_categories', public._rie_relationship_categories(),
    'ethical_boundaries', public._rie_ethical_boundaries(),
    'summary', v_summary,
    'settings', row_to_json(v_settings)::jsonb,
    'profiles', public.list_organization_relationship_profiles(null),
    'sample_insights', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', i.id,
          'profile_id', i.profile_id,
          'insight_type', i.insight_type,
          'category', i.category,
          'summary', i.summary,
          'recommended_action', i.recommended_action,
          'confidence', i.confidence,
          'status', i.status,
          'created_at', i.created_at
        ) order by
          case i.status when 'open' then 0 when 'acknowledged' then 1 else 2 end,
          i.created_at desc
      )
      from public.organization_relationship_insights i
      where i.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'recent_interactions', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', ix.id,
          'profile_id', ix.profile_id,
          'interaction_type', ix.interaction_type,
          'summary', ix.summary,
          'created_at', ix.created_at
        ) order by ix.created_at desc
      )
      from public.organization_relationship_interactions ix
      where ix.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'integration_links', public._rie_integration_links()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_relationship_intelligence_manifest(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.organization_relationship_intelligence_settings;
begin
  perform public._irp_require_permission('relationship_intelligence.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._rie_ensure_settings(v_org_id);
  perform public._rie_seed_org_profiles(v_org_id);

  perform public._rie_log(v_org_id, 'rie_manifest_exported', 'relationship_intelligence', null,
    jsonb_build_object('format', coalesce(p_format, 'json'), 'metadata_only', true));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'relationship_intelligence',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', public._rie_summary_block(v_org_id),
    'profiles', public.list_organization_relationship_profiles(null),
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by i.created_at desc)
      from public.organization_relationship_insights i
      where i.organization_id = v_org_id
      limit 100
    ), '[]'::jsonb),
    'integration_links', public._rie_integration_links(),
    'ethical_boundaries', public._rie_ethical_boundaries()
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
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'rie_profile_created', 'rie_profile_updated', 'rie_interaction_recorded',
    'rie_insight_created', 'rie_insight_resolved', 'rie_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed' or p_action_type like 'owe_%' or p_action_type like 'rie_%';
$$;

-- ---------------------------------------------------------------------------
-- 9. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'relationship-intelligence-engine', 'Relationship Intelligence Engine',
  'Organizational relationship context — internal, customer, partner, and community. Metadata only; distinct from personal RSI.',
  'authenticated', 101
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'relationship-intelligence-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_relationship_intelligence_engine_card() to authenticated;
grant execute on function public.get_relationship_intelligence_engine_dashboard() to authenticated;
grant execute on function public.list_organization_relationship_profiles(text) to authenticated;
grant execute on function public.create_organization_relationship_insight(jsonb) to authenticated;
grant execute on function public.resolve_organization_relationship_insight(uuid, text, jsonb) to authenticated;
grant execute on function public.export_relationship_intelligence_manifest(text) to authenticated;
