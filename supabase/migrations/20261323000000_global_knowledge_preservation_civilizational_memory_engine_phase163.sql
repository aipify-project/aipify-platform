-- Phase 163 — Global Knowledge Preservation & Civilizational Memory Engine
-- Post-Enterprise & Civilizational Era (161–170). Dedicated Civilizational Memory Center.
-- Distinct from Global Knowledge Exchange Phase 141 (/app/global-knowledge-exchange-engine — exchange, cross-link only).
-- Distinct from Organizational Memory Phase 152 (/app/organizational-memory-engine — tenant legacy/succession, cross-link only).
-- Helpers: _gcme_* (engine), _gcmebp163_* (blueprint — never collide with _gkee_*, _gkeebp141_*, _olsibp152_*, _om_*)

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
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion',
    'commerce_companion', 'aipify_core_platform', 'multi_tenant_architecture',
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
    'relationship_intelligence_engine',
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
    'wisdom_engine',
    'wisdom_intervention_protocol',
    'sales_expert_engine',
    'security_trust_engine',
    'api_platform_engine',
    'companion_device_ecosystem_engine',
    'companion_marketplace',
    'growth_partner_operations',
    'aipify_university',
    'social_impact_purpose',
    'ecosystem_governance',
    'ecosystem_orchestration',
    'executive_intelligence',
    'strategic_foresight_engine',
    'decision_intelligence_engine',
    'organizational_wisdom_engine',
    'companion_workforce',
    'proactive_organization',
    'collective_decision_council',
    'human_potential_augmented_work',
    'augmented_organization',
    'global_knowledge_exchange',
    'global_ecosystem_marketplace',
    'future_leaders_engine',
    'organizational_sensemaking_engine',
    'living_enterprise_engine',
    'civilizational_memory_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. civilizational_memory_settings
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_memory_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  preservation_readiness_level int not null default 1 check (preservation_readiness_level between 1 and 5),
  curation_stage text not null default 'discernment_review' check (
    curation_stage in (
      'discernment_review', 'essential_selection', 'stewardship_curation',
      'legacy_integration', 'cross_generational_readiness', 'civilizational_stewardship'
    )
  ),
  discernment_required boolean not null default true,
  cross_org_sharing_opt_in boolean not null default false,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council', 'knowledge_stewards')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.civilizational_memory_settings enable row level security;
revoke all on public.civilizational_memory_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. civilizational_memory_archives
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_memory_archives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  archive_key text not null,
  archive_type text not null check (
    archive_type in (
      'wisdom_lesson', 'operational_discovery', 'governance_record',
      'support_innovation', 'gp_contribution', 'companion_best_practice',
      'transformation_insight', 'leadership_experience'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'under_review', 'archived', 'outdated')
  ),
  cross_org_shareable boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, archive_key)
);

create index if not exists civilizational_memory_archives_tenant_idx
  on public.civilizational_memory_archives (tenant_id, archive_type, status, captured_at desc);

alter table public.civilizational_memory_archives enable row level security;
revoke all on public.civilizational_memory_archives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. civilizational_memory_stewardship_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_memory_stewardship_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'essential_knowledge', 'outdated_knowledge', 'identity_shaping',
      'leadership_reflection', 'archival_governance', 'cross_generational_learning'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'completed', 'archived')
  ),
  curation_signal text not null default 'stable' check (
    curation_signal in ('emerging', 'stable', 'strong', 'needs_attention', 'outdated')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists civilizational_memory_stewardship_reviews_tenant_idx
  on public.civilizational_memory_stewardship_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.civilizational_memory_stewardship_reviews enable row level security;
revoke all on public.civilizational_memory_stewardship_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. civilizational_memory_legacy_entries
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_memory_legacy_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_key text not null,
  entry_type text not null check (
    entry_type in (
      'leadership_narrative', 'transformation_history', 'gp_contribution',
      'governance_milestone', 'lessons_learned', 'companion_evolution'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'archived', 'cross_linked_legacy_engine')
  ),
  legacy_engine_cross_link boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, entry_key)
);

create index if not exists civilizational_memory_legacy_entries_tenant_idx
  on public.civilizational_memory_legacy_entries (tenant_id, entry_type, status, captured_at desc);

alter table public.civilizational_memory_legacy_entries enable row level security;
revoke all on public.civilizational_memory_legacy_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. civilizational_memory_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_memory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.civilizational_memory_audit_logs enable row level security;
revoke all on public.civilizational_memory_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'civilizational_memory_engine', v.description
from (values
  ('civilizational_memory.view', 'View Civilizational Memory Center', 'View knowledge archives, wisdom libraries, and institutional memory dashboards'),
  ('civilizational_memory.manage', 'Manage Civilizational Memory Center', 'Update preservation settings, archive metadata, and stewardship programs'),
  ('civilizational_memory.steward', 'Steward Civilizational Memory', 'Conduct wisdom curation reviews and archival governance cycles')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'civilizational_memory.view'), ('owner', 'civilizational_memory.manage'), ('owner', 'civilizational_memory.steward'),
  ('administrator', 'civilizational_memory.view'), ('administrator', 'civilizational_memory.manage'), ('administrator', 'civilizational_memory.steward'),
  ('manager', 'civilizational_memory.view'), ('manager', 'civilizational_memory.steward'),
  ('employee', 'civilizational_memory.view'),
  ('support_agent', 'civilizational_memory.view'),
  ('moderator', 'civilizational_memory.view'),
  ('viewer', 'civilizational_memory.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_gcme_)
-- ---------------------------------------------------------------------------
create or replace function public._gcme_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._gcme_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._gcme_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._gcme_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.civilizational_memory_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gcme_ensure_settings(p_tenant_id uuid)
returns public.civilizational_memory_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.civilizational_memory_settings;
begin
  insert into public.civilizational_memory_settings (tenant_id, preservation_readiness_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.civilizational_memory_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._gcme_seed_archives(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_memory_archives where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_memory_archives (
    tenant_id, archive_key, archive_type, title, summary, status
  ) values
    (p_tenant_id, 'wisdom-lesson-1', 'wisdom_lesson', 'Institutional wisdom lesson scaffold',
     'Essential lesson metadata — discernment required; not digital clutter.', 'active'),
    (p_tenant_id, 'operational-discovery-1', 'operational_discovery', 'Operational discovery archive',
     'Operational lesson metadata — cross-link Organizational Memory Phase 152.', 'active'),
    (p_tenant_id, 'governance-record-1', 'governance_record', 'Governance milestone record',
     'Governance evolution metadata — humans retain judgment.', 'draft'),
    (p_tenant_id, 'support-innovation-1', 'support_innovation', 'Support innovation contribution',
     'Support innovation metadata — metadata summaries only.', 'active'),
    (p_tenant_id, 'gp-contribution-1', 'gp_contribution', 'Growth Partner contribution archive',
     'GP ecosystem contribution — Growth Partner not Affiliate.', 'active'),
    (p_tenant_id, 'companion-practice-1', 'companion_best_practice', 'Companion best practice archive',
     'Companion evolution best practice metadata — does NOT rewrite history.', 'draft'),
    (p_tenant_id, 'transformation-insight-1', 'transformation_insight', 'Transformation insight archive',
     'Transformation lesson metadata — cross-link Change Management Phase 155.', 'active'),
    (p_tenant_id, 'leadership-experience-1', 'leadership_experience', 'Leadership experience archive',
     'Leadership narrative metadata — cross-link Future Leaders Phase 151.', 'draft');
end; $$;

create or replace function public._gcme_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_memory_stewardship_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_memory_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary, curation_signal
  ) values
    (p_tenant_id, 'essential-knowledge', 'essential_knowledge', 'Essential knowledge evaluation',
     'What wisdom deserves preservation — discernment not hoarding everything.', 'stable'),
    (p_tenant_id, 'outdated-knowledge', 'outdated_knowledge', 'Outdated knowledge review',
     'Identify knowledge to retire — not digital clutter.', 'needs_attention'),
    (p_tenant_id, 'identity-shaping', 'identity_shaping', 'Identity-shaping stories review',
     'Stories that shape institutional identity — cross-link Purpose Phase 156.', 'stable'),
    (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership reflection cycle',
     'Leadership reflection metadata — cross-link Future Leaders Phase 151.', 'emerging'),
    (p_tenant_id, 'archival-governance', 'archival_governance', 'Archival governance review',
     'Archival governance and retention — cross-link Records Retention A.60.', 'stable'),
    (p_tenant_id, 'cross-generational', 'cross_generational_learning', 'Cross-generational learning review',
     'Lessons for future leaders — cross-link Phase 151 and Living Enterprise Phase 160.', 'emerging');
end; $$;

create or replace function public._gcme_seed_legacy_entries(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_memory_legacy_entries where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_memory_legacy_entries (
    tenant_id, entry_key, entry_type, title, summary, status, legacy_engine_cross_link
  ) values
    (p_tenant_id, 'leadership-narrative-1', 'leadership_narrative', 'Leadership narrative scaffold',
     'Leadership narrative metadata — remembrance not revision.', 'draft', false),
    (p_tenant_id, 'transformation-history-1', 'transformation_history', 'Transformation history entry',
     'Transformation history metadata — cross-link Change Management Phase 155.', 'active', false),
    (p_tenant_id, 'gp-contribution-legacy-1', 'gp_contribution', 'Growth Partner legacy contribution',
     'GP contribution metadata — Growth Partner not Affiliate.', 'active', false),
    (p_tenant_id, 'governance-milestone-1', 'governance_milestone', 'Governance milestone entry',
     'Governance milestone metadata — cross-link Decision Heritage Phase 153.', 'draft', false),
    (p_tenant_id, 'lessons-learned-1', 'lessons_learned', 'Institutional lessons learned',
     'Lessons learned metadata — wisdom before speed.', 'active', false),
    (p_tenant_id, 'companion-evolution-1', 'companion_evolution', 'Companion evolution history',
     'Companion evolution metadata — does NOT alter historical records.', 'draft', true);
end; $$;

create or replace function public._gcme_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.civilizational_memory_settings;
  v_archives_count int;
  v_reviews_count int;
  v_legacy_count int;
  v_preservation_score numeric;
begin
  select * into v_settings from public.civilizational_memory_settings where tenant_id = p_tenant_id;
  select count(*) into v_archives_count from public.civilizational_memory_archives where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.civilizational_memory_stewardship_reviews where tenant_id = p_tenant_id;
  select count(*) into v_legacy_count from public.civilizational_memory_legacy_entries where tenant_id = p_tenant_id;
  v_preservation_score := round(
    coalesce(v_settings.preservation_readiness_level, 1) * 12.0
    + least(v_archives_count, 8) * 3.0
    + least(v_reviews_count, 6) * 3.5
    + least(v_legacy_count, 6) * 2.5,
    1
  );

  return jsonb_build_object(
    'civilizational_memory_score', v_preservation_score,
    'preservation_readiness_level', coalesce(v_settings.preservation_readiness_level, 1),
    'curation_stage', coalesce(v_settings.curation_stage, 'discernment_review'),
    'archives_count', v_archives_count,
    'stewardship_reviews_count', v_reviews_count,
    'legacy_entries_count', v_legacy_count,
    'cross_links_count', jsonb_array_length(public._gcmebp163_integration_links()),
    'discernment_required', coalesce(v_settings.discernment_required, true)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_gcmebp163_*)
-- ---------------------------------------------------------------------------
create or replace function public._gcmebp163_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 163 — Global Knowledge Preservation & Civilizational Memory Engine at /app/civilizational-memory-engine. Post-Enterprise & Civilizational Era (161–170). **Preservation requires discernment** — NOT preserve everything; NOT digital clutter; NOT rewrite history. Distinct from Global Knowledge Exchange Phase 141 at /app/global-knowledge-exchange-engine (exchange — cross-link only, never duplicate _gkee_* / _gkeebp141_*). Distinct from Organizational Memory Phase 152 at /app/organizational-memory-engine (tenant legacy/succession — cross-link only, never duplicate _olsibp152_* / _om_*). Distinct from Knowledge Center A.5 at /app/knowledge-center-engine (articles — cross-link only). Distinct from Living Enterprise Phase 160 at /app/living-enterprise-engine (living memory — cross-link only). Helpers _gcmebp163_* only — never collide with _gkee_*, _gkeebp141_*, _olsibp152_*, _om_*. Metadata summaries max ~500 chars; governed retention; humans decide what endures.';
$$;

create or replace function public._gcmebp163_mission()
returns text language sql immutable as $$
  select 'Safeguard institutional wisdom with discernment — preserving essential knowledge, leadership narratives, and transformation lessons for future generations without hoarding, clutter, or rewriting history.';
$$;

create or replace function public._gcmebp163_philosophy()
returns text language sql immutable as $$
  select 'Wisdom before speed. Preservation requires discernment — not everything, not clutter. Growth Partner not Affiliate. People First. Stewardship through responsibility. Memory Companion supports remembrance; humans retain judgment and governance authority.';
$$;

create or replace function public._gcmebp163_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Civilizational Memory Center curates knowledge archives, wisdom libraries, and institutional memory with governed retention — metadata only; companions inform and prepare, never alter records or determine truth.';
$$;

create or replace function public._gcmebp163_vision()
returns text language sql immutable as $$
  select 'Organizations should leave wisdom worth inheriting — honoring predecessors, learning from imperfection, and preparing future leaders with clarity and humility.';
$$;

create or replace function public._gcmebp163_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'civilizational_memory_center', 'label', 'Civilizational Memory Center', 'emoji', '📜', 'description', 'Knowledge archives, wisdom libraries, and institutional memory dashboards'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'emoji', '🦉', 'description', 'Leadership experiences and operational discoveries — metadata only'),
    jsonb_build_object('key', 'wisdom_curation', 'label', 'Wisdom curation', 'emoji', '🔔', 'description', 'Essential knowledge evaluation — discernment not hoarding'),
    jsonb_build_object('key', 'institutional_networks', 'label', 'Institutional memory networks', 'emoji', '🕸️', 'description', 'Cross-org knowledge stewards — opt-in sharing with Phase 141'),
    jsonb_build_object('key', 'memory_companion', 'label', 'Memory Companion', 'emoji', '❤️', 'description', 'Remembrance support — does NOT rewrite history'),
    jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'emoji', '🌹', 'description', 'Review cycles and cross-generational learning — cross-link Phase 151'),
    jsonb_build_object('key', 'legacy_library', 'label', 'Legacy library', 'emoji', '📚', 'description', 'Transformation narratives — cross-link Legacy A.86'),
    jsonb_build_object('key', 'discernment_governance', 'label', 'Discernment governance', 'emoji', '⚖️', 'description', 'Archival governance with executive approval and RBAC')
  );
$$;

create or replace function public._gcmebp163_civilizational_memory_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Civilizational Memory Center — eight capabilities. Discernment required — not digital clutter.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_archives', 'label', 'Knowledge archives', 'description', 'Wisdom and lesson archive metadata — governed retention'),
      jsonb_build_object('key', 'wisdom_libraries', 'label', 'Wisdom libraries', 'description', 'Curated essential knowledge collections'),
      jsonb_build_object('key', 'leadership_narratives', 'label', 'Leadership narratives', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'transformation_histories', 'label', 'Transformation histories', 'cross_link', '/app/change-management-engine'),
      jsonb_build_object('key', 'operational_lessons', 'label', 'Operational lessons', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'governance_records', 'label', 'Governance records', 'cross_link', '/app/decision-intelligence-engine'),
      jsonb_build_object('key', 'knowledge_stewardship_programs', 'label', 'Knowledge stewardship programs'),
      jsonb_build_object('key', 'institutional_memory_dashboards', 'label', 'Institutional memory dashboards')
    )
  );
$$;

create or replace function public._gcmebp163_knowledge_preservation_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_experiences', 'label', 'Leadership experiences', 'description', 'Leadership reflection metadata — cross-link Phase 151'),
    jsonb_build_object('key', 'transformation_insights', 'label', 'Transformation insights', 'description', 'Change and renewal lessons — cross-link Phase 155'),
    jsonb_build_object('key', 'governance_lessons', 'label', 'Governance lessons', 'description', 'Policy and governance evolution metadata'),
    jsonb_build_object('key', 'support_innovations', 'label', 'Support innovations', 'description', 'Support practice contributions — metadata only'),
    jsonb_build_object('key', 'gp_contributions', 'label', 'Growth Partner contributions', 'description', 'GP ecosystem wisdom — Growth Partner not Affiliate'),
    jsonb_build_object('key', 'companion_best_practices', 'label', 'Companion best practices', 'description', 'Companion evolution histories — does NOT alter records'),
    jsonb_build_object('key', 'operational_discoveries', 'label', 'Operational discoveries', 'description', 'Operational lesson metadata — cross-link Phase 152')
  );
$$;

create or replace function public._gcmebp163_wisdom_curation_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom curation — discernment required. NOT preserve everything.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'essential_knowledge', 'label', 'Essential knowledge evaluation', 'description', 'What wisdom deserves preservation'),
      jsonb_build_object('key', 'lessons_for_future_leaders', 'label', 'Lessons for future leaders', 'description', 'Cross-link Future Leaders Phase 151'),
      jsonb_build_object('key', 'experiences_to_preserve', 'label', 'Experiences worth preserving', 'description', 'Leadership and transformation narratives'),
      jsonb_build_object('key', 'outdated_knowledge', 'label', 'Outdated knowledge', 'description', 'Knowledge to retire — not clutter'),
      jsonb_build_object('key', 'identity_shaping_stories', 'label', 'Identity-shaping stories', 'description', 'Stories that shape institutional identity — cross-link Purpose Phase 156')
    )
  );
$$;

create or replace function public._gcmebp163_institutional_memory_networks()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Institutional memory networks — opt-in cross-org sharing scaffolds. Metadata only.',
    'networks', jsonb_build_array(
      jsonb_build_object('key', 'organizations', 'label', 'Organizations', 'description', 'Tenant-scoped institutional memory'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'GP knowledge stewards — never Affiliate'),
      jsonb_build_object('key', 'knowledge_stewards', 'label', 'Knowledge stewards', 'description', 'Designated stewardship roles — RBAC controlled'),
      jsonb_build_object('key', 'executive_communities', 'label', 'Executive communities', 'description', 'Executive reflection communities — governance visibility'),
      jsonb_build_object('key', 'support_networks', 'label', 'Support networks', 'description', 'Support innovation sharing — metadata only'),
      jsonb_build_object('key', 'professional_associations', 'label', 'Professional associations', 'description', 'Cross-link Global Knowledge Exchange Phase 141 — opt-in only')
    ),
    'exchange_route', '/app/global-knowledge-exchange-engine',
    'boundary_note', 'Phase 141 remains authoritative for exchange — Phase 163 stores preservation metadata scaffolds only.'
  );
$$;

create or replace function public._gcmebp163_memory_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Memory Companion supports remembrance — does NOT rewrite history, suppress experiences, determine truth, replace judgment, or improperly reveal confidential info.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_summaries', 'label', 'Knowledge summaries', 'description', 'Summarize approved archive metadata when asked'),
      jsonb_build_object('key', 'wisdom_retrieval', 'label', 'Wisdom retrieval', 'description', 'Retrieve relevant wisdom metadata — explain sources'),
      jsonb_build_object('key', 'historical_context', 'label', 'Historical context', 'description', 'Provide historical context — not revision'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Gentle stewardship reflection prompts'),
      jsonb_build_object('key', 'legacy_preparation', 'label', 'Legacy preparation', 'description', 'Legacy preparation scaffolds — cross-link Legacy A.86'),
      jsonb_build_object('key', 'learning_recommendations', 'label', 'Learning recommendations', 'description', 'Cross-generational learning — cross-link Phase 151')
    ),
    'must_not', jsonb_build_array(
      'Alter historical records',
      'Suppress alternative experiences',
      'Determine truth or moral verdicts',
      'Replace institutional judgment',
      'Improperly reveal confidential information'
    )
  );
$$;

create or replace function public._gcmebp163_knowledge_stewardship_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ownership', 'label', 'Knowledge ownership', 'description', 'Stewardship ownership and accountability metadata'),
    jsonb_build_object('key', 'review_cycles', 'label', 'Review cycles', 'description', 'Periodic curation and archival governance reviews'),
    jsonb_build_object('key', 'archival_governance', 'label', 'Archival governance', 'description', 'Retention and archival policies — cross-link Records Retention A.60'),
    jsonb_build_object('key', 'institutional_storytelling', 'label', 'Institutional storytelling', 'description', 'Story metadata — cross-link Legacy A.86'),
    jsonb_build_object('key', 'leadership_reflection_programs', 'label', 'Leadership reflection programs', 'description', 'Executive reflection programs — cross-link Phase 151'),
    jsonb_build_object('key', 'cross_generational_learning', 'label', 'Cross-generational learning', 'description', 'Lessons for future leaders — cross-link Future Leaders Phase 151')
  );
$$;

create or replace function public._gcmebp163_legacy_library_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy library — cross-link Legacy Engine A.86; never duplicate _leg_* storage.',
    'legacy_engine_route', '/app/legacy-engine',
    'entry_types', jsonb_build_array(
      jsonb_build_object('key', 'transformation_narratives', 'label', 'Transformation narratives', 'description', 'Change journeys — metadata summaries'),
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections', 'description', 'Leadership wisdom metadata'),
      jsonb_build_object('key', 'gp_contributions', 'label', 'Growth Partner contributions', 'description', 'GP legacy contributions — Growth Partner not Affiliate'),
      jsonb_build_object('key', 'companion_evolution_histories', 'label', 'Companion evolution histories', 'description', 'Companion evolution metadata — does NOT alter records'),
      jsonb_build_object('key', 'governance_milestones', 'label', 'Governance milestones', 'description', 'Policy evolution milestones'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Institutional lessons — metadata summaries')
    ),
    'boundary_note', 'Full legacy stories live in Legacy A.86 when approved — Phase 163 stores metadata scaffolds and cross-link counts only.'
  );
$$;

create or replace function public._gcmebp163_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Memory Companion limitations — remembrance support only.',
    'must_avoid', jsonb_build_array(
      'Alter historical records or approved archives',
      'Suppress alternative experiences or perspectives',
      'Determine truth, morality, or institutional meaning',
      'Replace institutional judgment or governance decisions',
      'Improperly reveal confidential succession, legal, or personnel information'
    )
  );
$$;

create or replace function public._gcmebp163_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 in civilizational memory — humility, curiosity, recognition of predecessors, respect for experience, compassion toward imperfection, commitment to learning.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'humility', 'label', 'Humility', 'description', 'Honor what came before — not ego or clutter'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Learn from predecessors with openness'),
      jsonb_build_object('key', 'recognition_of_predecessors', 'label', 'Recognition of predecessors', 'description', 'Acknowledge contributions that endure'),
      jsonb_build_object('key', 'respect_for_experience', 'label', 'Respect for experience', 'description', 'Respect lived institutional experience'),
      jsonb_build_object('key', 'compassion_toward_imperfection', 'label', 'Compassion toward imperfection', 'description', 'Learn from mistakes without shame'),
      jsonb_build_object('key', 'commitment_to_learning', 'label', 'Commitment to learning', 'description', 'Cross-generational learning — cross-link Phase 151')
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'We preserve wisdom with humility — honoring predecessors and preparing who comes next.'
  );
$$;

create or replace function public._gcmebp163_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Civilizational memory security — archive audit logs, knowledge access controls, executive approval histories, RBAC, and 2FA for sensitive stewardship.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'archive_audit_logs', 'label', 'Archive audit logs', 'description', 'Immutable audit via civilizational_memory_audit_logs'),
      jsonb_build_object('key', 'knowledge_access_controls', 'label', 'Knowledge access controls', 'description', 'RBAC via civilizational_memory permissions'),
      jsonb_build_object('key', 'executive_approval_histories', 'label', 'Executive approval histories', 'description', 'Executive stewardship review audit trail'),
      jsonb_build_object('key', 'rbac', 'label', 'RBAC', 'description', 'Owner/admin manage; stewards conduct reviews; standard users view aggregates'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA', 'description', 'Two-factor authentication recommended for civilizational_memory.manage', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._gcmebp163_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'description', 'Civic collaboration — cross-link only'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector', 'label', 'Cross-Sector Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'description', 'Cross-sector collaboration — cross-link only'),
    jsonb_build_object('phase', 141, 'key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'description', 'Exchange — cross-link only, never duplicate _gkee_*'),
    jsonb_build_object('phase', 152, 'key', 'organizational_memory', 'label', 'Organizational Memory Phase 152', 'route', '/app/organizational-memory-engine', 'description', 'Tenant legacy/succession — cross-link only'),
    jsonb_build_object('key', 'legacy_engine_a86', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'description', 'Stories and milestones — never duplicate _leg_*'),
    jsonb_build_object('phase', 153, 'key', 'decision_heritage', 'label', 'Decision Heritage Phase 153', 'route', '/app/decision-intelligence-engine', 'description', 'Decision heritage — cross-link only'),
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'description', 'Cross-generational learning — cross-link only'),
    jsonb_build_object('phase', 160, 'key', 'living_enterprise', 'label', 'Living Enterprise Phase 160', 'route', '/app/living-enterprise-engine', 'description', 'Living memory — cross-link only'),
    jsonb_build_object('key', 'knowledge_center_a5', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center-engine', 'description', 'Articles and documentation — cross-link only'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'description', 'Humility, curiosity, and respect for experience')
  );
$$;

create or replace function public._gcmebp163_dogfooding()
returns text language sql immutable as $$
  select 'Aipify Group uses Civilizational Memory scaffolds internally — discernment-first preservation, governed retention metadata, and cross-linked institutional memory. Growth Partner terminology throughout. NOT digital clutter — wisdom before speed.';
$$;

create or replace function public._gcmebp163_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Preservation requires discernment — not everything, not clutter.',
    'Wisdom before speed.',
    'Honor predecessors — prepare future leaders.',
    'Humans decide what endures; Aipify scaffolds remembrance.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._gcmebp163_privacy_note()
returns text language sql immutable as $$
  select 'Civilizational Memory Phase 163 — metadata and aggregate counts only. Summaries max ~500 chars. No PII, no confidential records in default UI, no truth determination, no history revision. Humans decide preservation outcomes; Memory Companion supports remembrance.';
$$;

create or replace function public._gcmebp163_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._gcme_ensure_settings(p_org_id);
  perform public._gcme_seed_archives(p_org_id);
  perform public._gcme_seed_reviews(p_org_id);
  perform public._gcme_seed_legacy_entries(p_org_id);
  v_metrics := public._gcme_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'civilizational_memory_score', coalesce((v_metrics->>'civilizational_memory_score')::numeric, 0),
    'preservation_readiness_level', coalesce((v_metrics->>'preservation_readiness_level')::int, 1),
    'curation_stage', coalesce(v_metrics->>'curation_stage', 'discernment_review'),
    'archives_count', coalesce((v_metrics->>'archives_count')::int, 0),
    'stewardship_reviews_count', coalesce((v_metrics->>'stewardship_reviews_count')::int, 0),
    'legacy_entries_count', coalesce((v_metrics->>'legacy_entries_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._gcmebp163_integration_links()),
    'privacy_note', public._gcmebp163_privacy_note(),
    'discernment_required', coalesce((v_metrics->>'discernment_required')::boolean, true),
    'not_digital_clutter', true
  );
end; $$;

create or replace function public._gcmebp163_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._gcme_ensure_settings(p_org_id);
  perform public._gcme_seed_archives(p_org_id);
  perform public._gcme_seed_reviews(p_org_id);
  perform public._gcme_seed_legacy_entries(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'civilizational_memory_center', 'label', 'Civilizational Memory Center — eight capabilities', 'met', jsonb_array_length(public._gcmebp163_civilizational_memory_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation engine — seven domains', 'met', jsonb_array_length(public._gcmebp163_knowledge_preservation_engine()) = 7, 'note', null),
    jsonb_build_object('key', 'wisdom_curation', 'label', 'Wisdom curation framework — five dimensions', 'met', jsonb_array_length(public._gcmebp163_wisdom_curation_framework()->'dimensions') = 5, 'note', null),
    jsonb_build_object('key', 'memory_companion', 'label', 'Memory Companion — six capabilities documented', 'met', jsonb_array_length(public._gcmebp163_memory_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'archives_seeded', 'label', 'Knowledge archives seeded', 'met', (select count(*) >= 8 from public.civilizational_memory_archives a where a.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Stewardship reviews seeded', 'met', (select count(*) >= 6 from public.civilizational_memory_stewardship_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'legacy_seeded', 'label', 'Legacy entries seeded', 'met', (select count(*) >= 6 from public.civilizational_memory_legacy_entries l where l.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'default_readiness', 'label', 'Default preservation readiness level 1 for new tenants', 'met', exists (select 1 from public.civilizational_memory_settings s where s.tenant_id = p_org_id and s.preservation_readiness_level >= 1), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.civilizational_memory_settings s where s.tenant_id = p_org_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'discernment_required', 'label', 'discernment_required default true', 'met', exists (select 1 from public.civilizational_memory_settings s where s.tenant_id = p_org_id and s.discernment_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no history revision', 'met', jsonb_array_length(public._gcmebp163_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._gcmebp163_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 163 baseline tables and RPCs', 'met', to_regclass('public.civilizational_memory_settings') is not null, 'note', '_gcme_* helpers intact')
  );
end; $$;

create or replace function public._gcmebp163_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 163 — Global Knowledge Preservation & Civilizational Memory Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE163_GLOBAL_KNOWLEDGE_PRESERVATION_CIVILIZATIONAL_MEMORY.md',
    'engine_phase', 'Repo Phase 163 Civilizational Memory Engine',
    'route', '/app/civilizational-memory-engine',
    'mapping_note', 'Post-Enterprise Era 161–170 — discernment-first preservation. Era phase engines remain authoritative.',
    'distinction_note', public._gcmebp163_distinction_note(),
    'mission', public._gcmebp163_mission(),
    'philosophy', public._gcmebp163_philosophy(),
    'abos_principle', public._gcmebp163_abos_principle(),
    'vision', public._gcmebp163_vision(),
    'objectives', public._gcmebp163_objectives(),
    'civilizational_memory_center', public._gcmebp163_civilizational_memory_center(),
    'knowledge_preservation_engine', public._gcmebp163_knowledge_preservation_engine(),
    'wisdom_curation_framework', public._gcmebp163_wisdom_curation_framework(),
    'institutional_memory_networks', public._gcmebp163_institutional_memory_networks(),
    'memory_companion', public._gcmebp163_memory_companion(),
    'knowledge_stewardship_engine', public._gcmebp163_knowledge_stewardship_engine(),
    'legacy_library_engine', public._gcmebp163_legacy_library_engine(),
    'companion_limitations', public._gcmebp163_companion_limitations(),
    'self_love_connection', public._gcmebp163_self_love_connection(),
    'security_requirements', public._gcmebp163_security_requirements(),
    'integration_links', public._gcmebp163_integration_links(),
    'dogfooding', public._gcmebp163_dogfooding(),
    'success_criteria', public._gcmebp163_success_criteria(p_org_id),
    'engagement_summary', public._gcmebp163_engagement_summary(p_org_id),
    'vision_phrases', public._gcmebp163_vision_phrases(),
    'privacy_note', public._gcmebp163_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.archive_civilizational_memory_entry(
  p_archive_type text,
  p_title text,
  p_summary text,
  p_cross_org_shareable boolean default false,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gcme_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Archive summary max 500 characters'; end if;
  v_key := p_archive_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civilizational_memory_archives (
    tenant_id, archive_key, archive_type, title, summary, cross_org_shareable
  ) values (v_tenant_id, v_key, p_archive_type, p_title, left(p_summary, 500), coalesce(p_cross_org_shareable, false))
  returning id into v_id;
  perform public._gcme_log_audit(v_tenant_id, 'archive_created', left(p_summary, 120),
    jsonb_build_object('archive_id', v_id, 'archive_type', p_archive_type));
  return v_id;
end; $$;

create or replace function public.record_wisdom_curation_review(
  p_review_type text,
  p_title text,
  p_summary text,
  p_curation_signal text default 'stable',
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gcme_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Review summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civilizational_memory_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary, curation_signal
  ) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500), coalesce(p_curation_signal, 'stable'))
  returning id into v_id;
  perform public._gcme_log_audit(v_tenant_id, 'curation_review_recorded', left(p_summary, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_civilizational_memory_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_memory_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._gcme_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._gcme_ensure_settings(v_tenant_id);
  perform public._gcme_seed_archives(v_tenant_id);
  perform public._gcme_seed_reviews(v_tenant_id);
  perform public._gcme_seed_legacy_entries(v_tenant_id);
  v_metrics := public._gcme_refresh_metrics(v_tenant_id);
  v_engagement := public._gcmebp163_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'civilizational_memory_score', v_metrics->'civilizational_memory_score',
    'preservation_readiness_level', v_settings.preservation_readiness_level,
    'archives_count', v_metrics->'archives_count',
    'philosophy', public._gcmebp163_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'discernment_required', v_settings.discernment_required,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 163 — Global Knowledge Preservation & Civilizational Memory Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE163_GLOBAL_KNOWLEDGE_PRESERVATION_CIVILIZATIONAL_MEMORY.md',
      'engine_phase', 'Repo Phase 163 Civilizational Memory Engine',
      'route', '/app/civilizational-memory-engine',
      'mapping_note', 'Post-Enterprise Era — discernment-first preservation.'
    ),
    'civilizational_memory_mission', public._gcmebp163_mission(),
    'civilizational_memory_abos_principle', public._gcmebp163_abos_principle(),
    'civilizational_memory_engagement_summary', v_engagement,
    'civilizational_memory_note', public._gcmebp163_distinction_note(),
    'civilizational_memory_vision_note', public._gcmebp163_vision()
  );
end; $$;

create or replace function public.get_civilizational_memory_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_memory_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._gcme_require_tenant());
  v_settings := public._gcme_ensure_settings(v_tenant_id);
  perform public._gcme_seed_archives(v_tenant_id);
  perform public._gcme_seed_reviews(v_tenant_id);
  perform public._gcme_seed_legacy_entries(v_tenant_id);
  v_metrics := public._gcme_refresh_metrics(v_tenant_id);
  perform public._gcme_log_audit(v_tenant_id, 'dashboard_view', 'Civilizational Memory dashboard viewed',
    jsonb_build_object('civilizational_memory_score', v_metrics->>'civilizational_memory_score', 'readiness_level', v_settings.preservation_readiness_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'preservation_readiness_level', v_settings.preservation_readiness_level,
    'curation_stage', v_settings.curation_stage,
    'discernment_required', v_settings.discernment_required,
    'cross_org_sharing_opt_in', v_settings.cross_org_sharing_opt_in,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._gcmebp163_philosophy(),
    'safety_note', 'Civilizational Memory Engine — metadata-only aggregates. Discernment required — not digital clutter. Era phase engines remain authoritative — cross-link only.',
    'distinction_note', public._gcmebp163_distinction_note(),
    'civilizational_memory_score', v_metrics->'civilizational_memory_score',
    'archives_count', v_metrics->'archives_count',
    'stewardship_reviews_count', v_metrics->'stewardship_reviews_count',
    'legacy_entries_count', v_metrics->'legacy_entries_count',
    'memory_archives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'archive_key', a.archive_key, 'archive_type', a.archive_type,
        'title', a.title, 'summary', a.summary, 'status', a.status,
        'cross_org_shareable', a.cross_org_shareable, 'captured_at', a.captured_at
      ) order by a.captured_at desc)
      from public.civilizational_memory_archives a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'stewardship_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'curation_signal', r.curation_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.civilizational_memory_stewardship_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'legacy_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'entry_key', l.entry_key, 'entry_type', l.entry_type,
        'title', l.title, 'summary', l.summary, 'status', l.status,
        'legacy_engine_cross_link', l.legacy_engine_cross_link, 'captured_at', l.captured_at
      ) order by l.captured_at desc)
      from public.civilizational_memory_legacy_entries l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._gcmebp163_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 163 — Global Knowledge Preservation & Civilizational Memory Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE163_GLOBAL_KNOWLEDGE_PRESERVATION_CIVILIZATIONAL_MEMORY.md',
      'engine_phase', 'Repo Phase 163 Civilizational Memory Engine',
      'route', '/app/civilizational-memory-engine',
      'mapping_note', 'Post-Enterprise Era — Civilizational Memory Center.'
    ),
    'civilizational_memory_engine_note', 'Civilizational Memory Engine (ABOS Phase 163) — discernment-first preservation. Cross-link era phases — do NOT duplicate RPCs.',
    'civilizational_memory_blueprint', public._gcmebp163_blueprint_block(v_tenant_id),
    'civilizational_memory_distinction_note', public._gcmebp163_distinction_note(),
    'civilizational_memory_mission', public._gcmebp163_mission(),
    'civilizational_memory_philosophy', public._gcmebp163_philosophy(),
    'civilizational_memory_abos_principle', public._gcmebp163_abos_principle(),
    'civilizational_memory_objectives', public._gcmebp163_objectives(),
    'civilizational_memory_center_meta', public._gcmebp163_civilizational_memory_center(),
    'knowledge_preservation_engine_meta', public._gcmebp163_knowledge_preservation_engine(),
    'wisdom_curation_framework_meta', public._gcmebp163_wisdom_curation_framework(),
    'institutional_memory_networks_meta', public._gcmebp163_institutional_memory_networks(),
    'memory_companion_meta', public._gcmebp163_memory_companion(),
    'knowledge_stewardship_engine_meta', public._gcmebp163_knowledge_stewardship_engine(),
    'legacy_library_engine_meta', public._gcmebp163_legacy_library_engine(),
    'companion_limitations_meta', public._gcmebp163_companion_limitations(),
    'self_love_connection_meta', public._gcmebp163_self_love_connection(),
    'security_requirements_meta', public._gcmebp163_security_requirements(),
    'gcmebp163_integration_links', public._gcmebp163_integration_links(),
    'civilizational_memory_engagement_summary', public._gcmebp163_engagement_summary(v_tenant_id),
    'civilizational_memory_success_criteria', public._gcmebp163_success_criteria(v_tenant_id),
    'civilizational_memory_vision', public._gcmebp163_vision(),
    'civilizational_memory_vision_phrases', public._gcmebp163_vision_phrases(),
    'civilizational_memory_privacy_note', public._gcmebp163_privacy_note(),
    'civilizational_memory_dogfooding', public._gcmebp163_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'civilizational-memory-engine', 'Global Knowledge Preservation & Civilizational Memory Engine',
  'Post-Enterprise Era — Civilizational Memory Center. Discernment-first preservation — not digital clutter.',
  'authenticated', 173
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'civilizational-memory-engine' and tenant_id is null
);

grant execute on function public.get_civilizational_memory_engine_card(uuid) to authenticated;
grant execute on function public.get_civilizational_memory_engine_dashboard(uuid) to authenticated;
grant execute on function public.archive_civilizational_memory_entry(text, text, text, boolean, uuid) to authenticated;
grant execute on function public.record_wisdom_curation_review(text, text, text, text, uuid) to authenticated;
grant execute on function public._gcmebp163_distinction_note() to authenticated;
grant execute on function public._gcmebp163_mission() to authenticated;
grant execute on function public._gcmebp163_philosophy() to authenticated;
grant execute on function public._gcmebp163_abos_principle() to authenticated;
grant execute on function public._gcmebp163_vision() to authenticated;
grant execute on function public._gcmebp163_objectives() to authenticated;
grant execute on function public._gcmebp163_civilizational_memory_center() to authenticated;
grant execute on function public._gcmebp163_knowledge_preservation_engine() to authenticated;
grant execute on function public._gcmebp163_wisdom_curation_framework() to authenticated;
grant execute on function public._gcmebp163_institutional_memory_networks() to authenticated;
grant execute on function public._gcmebp163_memory_companion() to authenticated;
grant execute on function public._gcmebp163_knowledge_stewardship_engine() to authenticated;
grant execute on function public._gcmebp163_legacy_library_engine() to authenticated;
grant execute on function public._gcmebp163_companion_limitations() to authenticated;
grant execute on function public._gcmebp163_self_love_connection() to authenticated;
grant execute on function public._gcmebp163_security_requirements() to authenticated;
grant execute on function public._gcmebp163_integration_links() to authenticated;
grant execute on function public._gcmebp163_dogfooding() to authenticated;
grant execute on function public._gcmebp163_vision_phrases() to authenticated;
grant execute on function public._gcmebp163_privacy_note() to authenticated;
grant execute on function public._gcmebp163_engagement_summary(uuid) to authenticated;
grant execute on function public._gcmebp163_success_criteria(uuid) to authenticated;
grant execute on function public._gcmebp163_blueprint_block(uuid) to authenticated;

