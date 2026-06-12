-- Implementation Blueprint Phase 152 — Organizational Legacy & Succession Intelligence Engine
-- Legacy & Future Stewardship Era (151–160). Extends A.34 + Phase 55 + Phase 94 + Phase 126.
-- Helpers: _olsibp152_* (never collide with _omlebp126_*, _omlebp94_*, _mcebp_*, _om_*).
-- Cross-links Future Leaders Phase 151, Legacy A.86 — never duplicate _leg_* / _ltbp_* storage.

-- ---------------------------------------------------------------------------
-- 1. Optional tenant-scoped tables (metadata scaffolds — extend Phase 126)
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_succession_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_key text not null,
  plan_type text not null check (
    plan_type in (
      'role_transition', 'leadership_handoff', 'critical_role',
      'knowledge_transfer', 'stewardship_program', 'continuity_framework'
    )
  ),
  title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'under_review', 'archived')
  ),
  role_metadata jsonb not null default '{}'::jsonb,
  readiness_status text check (
    readiness_status in ('not_started', 'in_progress', 'partially_ready', 'ready_for_review', 'archived')
  ),
  governance_controlled boolean not null default true,
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{"metadata_only":true,"no_successor_names_in_default_ui":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, plan_key)
);

create index if not exists organizational_succession_plans_org_idx
  on public.organizational_succession_plans (organization_id, status, plan_type);

alter table public.organizational_succession_plans enable row level security;
revoke all on public.organizational_succession_plans from authenticated, anon;

create table if not exists public.organizational_critical_knowledge_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entry_key text not null,
  knowledge_domain text not null check (
    knowledge_domain in (
      'key_relationships', 'operational_expertise', 'institutional_narratives',
      'decision_frameworks', 'leadership_wisdom', 'historical_context', 'strategic_knowledge'
    )
  ),
  role_mapping text not null,
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('active', 'under_review', 'archived', 'needs_documentation')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entry_key)
);

create index if not exists organizational_critical_knowledge_registry_org_idx
  on public.organizational_critical_knowledge_registry (organization_id, status, knowledge_domain);

alter table public.organizational_critical_knowledge_registry enable row level security;
revoke all on public.organizational_critical_knowledge_registry from authenticated, anon;

create table if not exists public.organizational_legacy_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'executive_legacy', 'knowledge_preservation', 'values_definition',
      'leadership_reflection', 'continuity_assessment', 'stewardship_review'
    )
  ),
  title text not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'archived')
  ),
  reflection_metadata jsonb not null default '{}'::jsonb,
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, review_key)
);

create index if not exists organizational_legacy_reviews_org_idx
  on public.organizational_legacy_reviews (organization_id, status, review_type);

alter table public.organizational_legacy_reviews enable row level security;
revoke all on public.organizational_legacy_reviews from authenticated, anon;

create table if not exists public.organizational_story_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  story_key text not null,
  story_type text not null check (
    story_type in (
      'founding_story', 'transformation_journey', 'leadership_lesson',
      'customer_success_narrative', 'gp_experience', 'cultural_milestone'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'archived', 'cross_linked_legacy_engine')
  ),
  legacy_engine_cross_link boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, story_key)
);

create index if not exists organizational_story_records_org_idx
  on public.organizational_story_records (organization_id, status, story_type);

alter table public.organizational_story_records enable row level security;
revoke all on public.organizational_story_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers (_olsibp152_*)
-- ---------------------------------------------------------------------------
create or replace function public._olsibp152_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 152 — Organizational Legacy & Succession Intelligence at /app/organizational-memory-engine. Extends Organizational Memory Engine A.34 + Phase 55 + Phase 94 + Enterprise Intelligence Phase 126 (_omlebp126_*) — Legacy & Future Stewardship Era (151–160). **Does NOT choose successors** — thoughtful preparation not fear. **Does NOT create duplicate Legacy Center or Legacy Engine A.86 RPCs** — cross-link _leg_* / _ltbp_* at /app/legacy-engine. Distinct from Future Leaders Phase 151 at /app/future-leaders-engine (leadership development — cross-link only). Distinct from Global Stewardship Phase 150 at /app/global-stewardship-collective-future-engine. Helpers _olsibp152_* only — never collide with _omlebp126_*, _omlebp94_*, _mcebp_*, _om_*. Metadata/governed retention only — humans decide succession outcomes; no individual successor scoring or ranking.';
$$;

create or replace function public._olsibp152_mission()
returns text language sql immutable as $$
  select 'Prepare organizations for continuity through knowledge stewardship — preserving critical wisdom, supporting leadership transitions, and strengthening institutional memory without rigid bureaucracy or fear of change.';
$$;

create or replace function public._olsibp152_philosophy()
returns text language sql immutable as $$
  select 'Thoughtful preparation — not fear of change. Growth Partner not Affiliate. People First. Stewardship through responsibility. Legacy Companion supports preparedness; humans retain executive judgment and governance authority.';
$$;

create or replace function public._olsibp152_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Organizational Legacy & Succession Intelligence extends institutional memory with succession scaffolds, critical knowledge registries, and executive legacy reviews — metadata only; companions inform and prepare, never choose successors.';
$$;

create or replace function public._olsibp152_vision()
returns text language sql immutable as $$
  select 'Organizations should transition leadership with clarity and generosity — preserving what matters, preparing who comes next, and honoring contributions that endure across generations.';
$$;

create or replace function public._olsibp152_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'succession_preparedness', 'label', 'Succession preparedness', 'emoji', '🦉', 'description', 'Succession planning scaffolds and transition readiness — governance-controlled metadata'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'emoji', '🔔', 'description', 'Critical knowledge registry and transfer plans — metadata role mappings only'),
    jsonb_build_object('key', 'leadership_transition', 'label', 'Leadership transition', 'emoji', '❤️', 'description', 'Leadership transition frameworks — cross-link Future Leaders Phase 151'),
    jsonb_build_object('key', 'executive_legacy', 'label', 'Executive legacy reviews', 'emoji', '🌹', 'description', 'Executive legacy review records — what to preserve, values, enduring contributions'),
    jsonb_build_object('key', 'continuity_readiness', 'label', 'Continuity readiness', 'emoji', '🦉', 'description', 'Continuity readiness across leadership, knowledge, operations, and governance dimensions'),
    jsonb_build_object('key', 'institutional_memory', 'label', 'Institutional memory', 'emoji', '🌹', 'description', 'Institutional memory library extending Phase 126 heritage — decision and transformation records'),
    jsonb_build_object('key', 'organizational_storytelling', 'label', 'Organizational storytelling', 'emoji', '❤️', 'description', 'Founding stories and transformation journeys — cross-link Legacy A.86'),
    jsonb_build_object('key', 'stewardship_programs', 'label', 'Stewardship programs', 'emoji', '🔔', 'description', 'Stewardship programs and critical role mapping — no individual ranking')
  );
$$;

create or replace function public._olsibp152_legacy_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'succession_planning_scaffolds', 'label', 'Succession planning scaffolds', 'description', 'Plan metadata scaffolds — governance-controlled; no confidential successor names in default UI'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'description', 'Critical knowledge registry and transfer preparation'),
    jsonb_build_object('key', 'leadership_transition_frameworks', 'label', 'Leadership transition frameworks', 'description', 'Transition readiness and handoff context — cross-link Phase 151'),
    jsonb_build_object('key', 'executive_legacy_reviews', 'label', 'Executive legacy reviews', 'description', 'Executive reflection and legacy review records — metadata only'),
    jsonb_build_object('key', 'critical_role_mapping', 'label', 'Critical role mapping', 'description', 'Critical role identification metadata — not individual successor ranking'),
    jsonb_build_object('key', 'continuity_dashboards', 'label', 'Continuity dashboards', 'description', 'Continuity readiness visibility — cross-link Continuity Phase 73'),
    jsonb_build_object('key', 'stewardship_programs', 'label', 'Stewardship programs', 'description', 'Knowledge stewardship and mentorship program scaffolds'),
    jsonb_build_object('key', 'institutional_memory_libraries', 'label', 'Institutional memory libraries', 'description', 'Heritage library extension — extends Phase 126 _omlebp126_heritage_library()')
  );
$$;

create or replace function public._olsibp152_succession_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'critical_role_identification', 'label', 'Critical role identification', 'description', 'Critical role metadata — dependency awareness, not individual evaluation'),
    jsonb_build_object('key', 'successor_development_pathways', 'label', 'Successor development pathways', 'description', 'Cross-link Future Leaders Phase 151 /app/future-leaders-engine — development not ranking'),
    jsonb_build_object('key', 'transition_readiness', 'label', 'Transition readiness assessments', 'description', 'Readiness assessment scaffolds — humans lead handoff decisions'),
    jsonb_build_object('key', 'knowledge_transfer_plans', 'label', 'Knowledge transfer plans', 'description', 'Structured knowledge transfer metadata — humans lead transfer'),
    jsonb_build_object('key', 'leadership_bench_visibility', 'label', 'Leadership bench visibility', 'description', 'Aggregate bench visibility — NOT individual successor scoring or ranking'),
    jsonb_build_object('key', 'continuity_risk_reviews', 'label', 'Continuity risk reviews', 'description', 'Continuity risk review scaffolds — cross-link Phase 73 /app/continuity')
  );
$$;

create or replace function public._olsibp152_critical_knowledge_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'key_relationships', 'label', 'Key relationships metadata', 'description', 'Relationship continuity metadata — no PII in default payloads'),
    jsonb_build_object('key', 'operational_expertise', 'label', 'Operational expertise', 'description', 'Undocumented process and SME dependency awareness'),
    jsonb_build_object('key', 'institutional_narratives', 'label', 'Institutional narratives', 'description', 'Organizational story metadata — cross-link Legacy A.86'),
    jsonb_build_object('key', 'decision_frameworks', 'label', 'Decision frameworks', 'description', 'Decision rationale histories — cross-link Decision Intelligence Phase 125'),
    jsonb_build_object('key', 'leadership_wisdom', 'label', 'Leadership wisdom', 'description', 'Leadership reflection metadata — honor contributions without PII'),
    jsonb_build_object('key', 'historical_context', 'label', 'Historical context', 'description', 'Transformation and governance evolution context'),
    jsonb_build_object('key', 'strategic_knowledge', 'label', 'Strategic knowledge', 'description', 'Strategic knowledge preservation — metadata summaries only')
  );
$$;

create or replace function public._olsibp152_executive_legacy_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive legacy reviews — reflection and preservation scaffolds; humans define meaning and outcomes.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_to_preserve', 'label', 'What knowledge to preserve', 'description', 'Identify institutional knowledge worth stewarding forward'),
      jsonb_build_object('key', 'preparing_to_lead', 'label', 'Who is preparing to lead', 'description', 'Development pathway awareness — cross-link Phase 151; governance-controlled visibility'),
      jsonb_build_object('key', 'values_definition', 'label', 'Values definition', 'description', 'Values and principles worth carrying forward'),
      jsonb_build_object('key', 'responsibilities_of_influence', 'label', 'Responsibilities of influence', 'description', 'How leadership influence should be stewarded — not surveillance'),
      jsonb_build_object('key', 'contributions_that_endure', 'label', 'Contributions that endure', 'description', 'Honor contributions that strengthen continuity across generations')
    )
  );
$$;

create or replace function public._olsibp152_legacy_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_preservation_guidance', 'label', 'Knowledge preservation guidance', 'description', 'Scaffold critical knowledge documentation — humans approve'),
    jsonb_build_object('key', 'succession_preparation_support', 'label', 'Succession preparation support', 'description', 'Prepare transition context — does NOT choose successors'),
    jsonb_build_object('key', 'leadership_reflection_prompts', 'label', 'Leadership reflection prompts', 'description', 'Gentle reflection prompts — humility and mentorship'),
    jsonb_build_object('key', 'institutional_memory_retrieval', 'label', 'Institutional memory retrieval', 'description', 'Retrieve relevant memory metadata when asked — explain sources'),
    jsonb_build_object('key', 'continuity_planning_assistance', 'label', 'Continuity planning assistance', 'description', 'Continuity planning scaffolds — cross-link Phase 73 and Phase 55'),
    jsonb_build_object('key', 'legacy_review_summaries', 'label', 'Legacy review summaries', 'description', 'Summarize approved legacy review metadata for executive review')
  );
$$;

create or replace function public._olsibp152_continuity_readiness_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity', 'description', 'Leadership handoff readiness — cross-link Executive Intelligence 121'),
    jsonb_build_object('key', 'knowledge_continuity', 'label', 'Knowledge continuity', 'description', 'Critical knowledge coverage and transfer readiness'),
    jsonb_build_object('key', 'operational_continuity', 'label', 'Operational continuity', 'description', 'Operational dependency awareness — cross-link Phase 55 _mcebp_*'),
    jsonb_build_object('key', 'governance_continuity', 'label', 'Governance continuity', 'description', 'Governance and policy continuity — cross-link A.14'),
    jsonb_build_object('key', 'gp_continuity', 'label', 'Growth Partner continuity', 'description', 'GP relationship and ecosystem continuity metadata'),
    jsonb_build_object('key', 'customer_relationship_continuity', 'label', 'Customer relationship continuity', 'description', 'Customer partnership continuity metadata — no customer PII')
  );
$$;

create or replace function public._olsibp152_organizational_storytelling_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational storytelling — cross-link Legacy Engine A.86; never duplicate _leg_* storage.',
    'legacy_engine_route', '/app/legacy-engine',
    'story_types', jsonb_build_array(
      jsonb_build_object('key', 'founding_stories', 'label', 'Founding stories', 'description', 'Origin narratives — metadata summaries; full stories in Legacy A.86'),
      jsonb_build_object('key', 'transformation_journeys', 'label', 'Transformation journeys', 'description', 'Change narratives — institutional learning'),
      jsonb_build_object('key', 'leadership_lessons', 'label', 'Leadership lessons', 'description', 'Leadership wisdom metadata — cross-link Phase 151'),
      jsonb_build_object('key', 'customer_success_narratives', 'label', 'Customer success narratives', 'description', 'Partnership milestones — metadata only'),
      jsonb_build_object('key', 'gp_experiences', 'label', 'Growth Partner experiences', 'description', 'GP ecosystem contribution stories — Growth Partner not Affiliate'),
      jsonb_build_object('key', 'cultural_milestones', 'label', 'Cultural milestones', 'description', 'Cultural traditions and milestones — cross-link Legacy A.86')
    ),
    'boundary_note', 'Story content lives in Legacy A.86 when approved — Phase 152 stores metadata scaffolds and cross-link counts only.'
  );
$$;

create or replace function public._olsibp152_institutional_memory_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories', 'description', 'Decision register and rationale — extends Phase 126 heritage library'),
    jsonb_build_object('key', 'transformation_records', 'label', 'Transformation records', 'description', 'Structural and governance transformation metadata'),
    jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections', 'description', 'Executive legacy review reflections — metadata only'),
    jsonb_build_object('key', 'governance_milestones', 'label', 'Governance milestones', 'description', 'Policy and governance evolution milestones'),
    jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'description', 'Approved knowledge contributions — cross-link KC A.5'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Institutional lessons — metadata summaries from memory archives')
  );
$$;

create or replace function public._olsibp152_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_determine_succession', 'label', 'No determining succession outcomes', 'description', 'Companion never chooses successors or ranks individuals'),
    jsonb_build_object('key', 'no_replace_executive_judgment', 'label', 'No replacing executive judgment', 'description', 'Executives retain accountability for succession and governance decisions'),
    jsonb_build_object('key', 'no_suppress_pathways', 'label', 'No suppressing alternative pathways', 'description', 'Never hide alternative leadership or continuity pathways'),
    jsonb_build_object('key', 'no_reveal_confidential_succession', 'label', 'No revealing confidential succession info', 'description', 'Confidential succession details remain governance-controlled — not in default UI'),
    jsonb_build_object('key', 'no_override_governance', 'label', 'No overriding governance', 'description', 'Never bypass approval policies or governance controls')
  );
$$;

create or replace function public._olsibp152_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in legacy stewardship — humility, mentorship, reflection, recognition of others, acceptance of transition, generosity in knowledge sharing.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'humility', 'label', 'Humility', 'description', 'Leadership transition with grace — not ego or fear'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship', 'description', 'Generous knowledge sharing across generations — cross-link Phase 151'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Thoughtful legacy reflection — not guilt or surveillance'),
      jsonb_build_object('key', 'recognition_of_others', 'label', 'Recognition of others', 'description', 'Honor collective contributions — not performative scoring'),
      jsonb_build_object('key', 'acceptance_of_transition', 'label', 'Acceptance of transition', 'description', 'Change as natural stewardship — thoughtful preparation not fear'),
      jsonb_build_object('key', 'generosity_in_sharing', 'label', 'Generosity in knowledge sharing', 'description', 'Share wisdom generously — institutions grow through stewardship')
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'We prepare the next chapter with humility — honoring what endures and who comes next.'
  );
$$;

create or replace function public._olsibp152_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Succession and legacy metadata require governance-grade security — RBAC, audit logs, and 2FA for sensitive operations.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'succession_audit_logs', 'label', 'Succession planning audit logs', 'description', 'Immutable audit for succession plan and review changes'),
      jsonb_build_object('key', 'knowledge_preservation_permissions', 'label', 'Knowledge preservation permissions', 'description', 'Role-based access for critical knowledge registry — memory.view baseline'),
      jsonb_build_object('key', 'executive_review_histories', 'label', 'Executive review histories', 'description', 'Executive legacy review audit trail — leadership visibility only'),
      jsonb_build_object('key', 'rbac', 'label', 'RBAC', 'description', 'Owner/admin governance for succession metadata; standard users see aggregate scaffolds'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA', 'description', 'Two-factor authentication recommended for executive legacy review operations — /app/settings/two-factor')
    )
  );
$$;

create or replace function public._olsibp152_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'future_leaders_phase151', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'note', 'Leadership development pathways — cross-link only; no duplicate RPCs'),
    jsonb_build_object('key', 'organizational_memory_phase126', 'label', 'Organizational Memory Phase 126', 'route', '/app/organizational-memory-engine', 'note', 'Enterprise Intelligence layer — Phase 152 extends Phase 126 scaffolds'),
    jsonb_build_object('key', 'legacy_engine_a86', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'note', 'Stories and milestones — never duplicate _leg_* / _ltbp_*'),
    jsonb_build_object('key', 'global_stewardship_phase150', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'note', 'Collective future stewardship — cross-link only'),
    jsonb_build_object('key', 'continuity_phase73', 'label', 'Organizational Continuity Phase 73', 'route', '/app/continuity', 'note', 'Succession awareness and continuity planning'),
    jsonb_build_object('key', 'decision_intelligence_phase125', 'label', 'Decision Intelligence Phase 125', 'route', '/app/decision-intelligence-engine', 'note', 'Decision frameworks and advisory context'),
    jsonb_build_object('key', 'records_retention_a60', 'label', 'Records Retention A.60', 'route', '/app/records-retention-management-engine', 'note', 'Retention policies for legacy and knowledge records'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Humility, reflection, and generous knowledge sharing')
  );
$$;

create or replace function public._olsibp152_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group uses Organizational Legacy & Succession Intelligence scaffolds internally — metadata discipline, governance-controlled succession metadata, and cross-linked institutional memory.',
    'practices', jsonb_build_array(
      'Succession plan scaffolds without confidential names in default dashboards',
      'Critical knowledge registry reviewed quarterly by leadership',
      'Executive legacy reviews tied to governance calendar — not surveillance',
      'Story records cross-linked to Legacy A.86 — never duplicated',
      'Continuity readiness dimensions reviewed alongside Phase 73 continuity planning'
    ),
    'boundary_note', 'Dogfooding demonstrates stewardship through responsibility — thoughtful preparation, not fear-driven bureaucracy.'
  );
$$;

create or replace function public._olsibp152_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Prepare for continuity through knowledge stewardship',
    'Thoughtful preparation — not fear of change',
    'Honor contributions that endure',
    'Humans decide; Aipify informs and prepares',
    'Growth Partner not Affiliate — stewardship through responsibility'
  );
$$;

create or replace function public._olsibp152_privacy_note()
returns text language sql immutable as $$
  select 'Legacy & Future Stewardship Phase 152 — metadata and aggregate counts only. No PII, no confidential successor names in default UI, no individual ranking, no surveillance. Humans decide succession outcomes; Aipify scaffolds preparedness.';
$$;

-- ---------------------------------------------------------------------------
-- 3. Engagement summary + success criteria
-- ---------------------------------------------------------------------------
create or replace function public._olsibp152_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_phase126 jsonb;
  v_succession_plans int := 0;
  v_knowledge_entries int := 0;
  v_legacy_reviews int := 0;
  v_story_records int := 0;
begin
  v_phase126 := public._omlebp126_engagement_summary(p_organization_id);

  select count(*) into v_succession_plans
  from public.organizational_succession_plans
  where organization_id = p_organization_id and status in ('active', 'under_review');

  select count(*) into v_knowledge_entries
  from public.organizational_critical_knowledge_registry
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_legacy_reviews
  from public.organizational_legacy_reviews
  where organization_id = p_organization_id and status in ('scheduled', 'in_progress');

  select count(*) into v_story_records
  from public.organizational_story_records
  where organization_id = p_organization_id and status in ('active', 'cross_linked_legacy_engine');

  return v_phase126 || jsonb_build_object(
    'phase152_objectives_count', jsonb_array_length(public._olsibp152_objectives()),
    'legacy_center_capabilities', jsonb_array_length(public._olsibp152_legacy_center()),
    'succession_intelligence_capabilities', jsonb_array_length(public._olsibp152_succession_intelligence_engine()),
    'critical_knowledge_domains', jsonb_array_length(public._olsibp152_critical_knowledge_engine()),
    'executive_legacy_dimensions', jsonb_array_length(public._olsibp152_executive_legacy_reviews()->'dimensions'),
    'legacy_companion_supports', jsonb_array_length(public._olsibp152_legacy_companion()),
    'continuity_readiness_dimensions', jsonb_array_length(public._olsibp152_continuity_readiness_framework()),
    'storytelling_types', jsonb_array_length(public._olsibp152_organizational_storytelling_engine()->'story_types'),
    'institutional_memory_assets', jsonb_array_length(public._olsibp152_institutional_memory_library()),
    'companion_limitations_count', jsonb_array_length(public._olsibp152_companion_limitations()),
    'integration_links_count', jsonb_array_length(public._olsibp152_integration_links()),
    'phase152_active_succession_plans', v_succession_plans,
    'phase152_active_knowledge_entries', v_knowledge_entries,
    'phase152_pending_legacy_reviews', v_legacy_reviews,
    'phase152_active_story_records', v_story_records,
    'privacy_note', public._olsibp152_privacy_note()
  );
end; $$;

create or replace function public._olsibp152_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._olsibp152_engagement_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Legacy & Stewardship objectives documented', 'met', jsonb_array_length(public._olsibp152_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'legacy_center', 'label', 'Legacy Center — eight capabilities', 'met', jsonb_array_length(public._olsibp152_legacy_center()) = 8, 'note', null),
    jsonb_build_object('key', 'succession_intelligence', 'label', 'Succession intelligence engine — six capabilities', 'met', jsonb_array_length(public._olsibp152_succession_intelligence_engine()) = 6, 'note', 'No individual successor ranking.'),
    jsonb_build_object('key', 'critical_knowledge', 'label', 'Critical knowledge engine — seven domains', 'met', jsonb_array_length(public._olsibp152_critical_knowledge_engine()) = 7, 'note', 'Metadata role mappings only.'),
    jsonb_build_object('key', 'executive_legacy', 'label', 'Executive legacy reviews — five dimensions', 'met', jsonb_array_length(public._olsibp152_executive_legacy_reviews()->'dimensions') = 5, 'note', null),
    jsonb_build_object('key', 'legacy_companion', 'label', 'Legacy Companion — six supports', 'met', jsonb_array_length(public._olsibp152_legacy_companion()) = 6, 'note', 'Does NOT choose successors.'),
    jsonb_build_object('key', 'continuity_readiness', 'label', 'Continuity readiness framework — six dimensions', 'met', jsonb_array_length(public._olsibp152_continuity_readiness_framework()) = 6, 'note', 'Cross-link Phase 73 and Phase 55.'),
    jsonb_build_object('key', 'storytelling', 'label', 'Organizational storytelling — six story types', 'met', jsonb_array_length(public._olsibp152_organizational_storytelling_engine()->'story_types') = 6, 'note', 'Cross-link Legacy A.86 — never duplicate.'),
    jsonb_build_object('key', 'institutional_memory', 'label', 'Institutional memory library — six assets', 'met', jsonb_array_length(public._olsibp152_institutional_memory_library()) = 6, 'note', 'Extends Phase 126 heritage library.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._olsibp152_companion_limitations()) = 5, 'note', 'No determining succession outcomes.'),
    jsonb_build_object('key', 'integration_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._olsibp152_integration_links()) >= 8, 'note', null),
    jsonb_build_object('key', 'phase126_preserved', 'label', 'Phase 126 _omlebp126_* fields preserved', 'met', jsonb_array_length(public._omlebp126_objectives()) = 8, 'note', 'Phase 152 layers on Phase 126 — does not replace.'),
    jsonb_build_object('key', 'phase94_preserved', 'label', 'Phase 94 _omlebp94_* fields preserved', 'met', jsonb_array_length(public._omlebp94_objectives()) >= 6, 'note', null),
    jsonb_build_object('key', 'phase55_preserved', 'label', 'Phase 55 _mcebp_* fields preserved', 'met', true, 'note', 'All continuity fields remain on dashboard RPC.'),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 152 vs Phase 126 distinction documented', 'met', position('Phase 126' in public._olsibp152_distinction_note()) > 0, 'note', public._olsibp152_distinction_note())
  );
end; $$;

create or replace function public._olsibp152_blueprint_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '152',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE152_ORGANIZATIONAL_LEGACY_SUCCESSION_INTELLIGENCE.md',
    'spec_doc', 'ORGANIZATIONAL_LEGACY_SUCCESSION_INTELLIGENCE_ENGINE_PHASE152.md',
    'engine_phase', 'A.34 Organizational Memory Engine',
    'era', 'Legacy & Future Stewardship Era (151–160)',
    'route', '/app/organizational-memory-engine',
    'distinction_note', public._olsibp152_distinction_note(),
    'mission', public._olsibp152_mission(),
    'philosophy', public._olsibp152_philosophy(),
    'abos_principle', public._olsibp152_abos_principle(),
    'vision', public._olsibp152_vision(),
    'objectives', public._olsibp152_objectives(),
    'legacy_center', public._olsibp152_legacy_center(),
    'succession_intelligence_engine', public._olsibp152_succession_intelligence_engine(),
    'critical_knowledge_engine', public._olsibp152_critical_knowledge_engine(),
    'executive_legacy_reviews', public._olsibp152_executive_legacy_reviews(),
    'legacy_companion', public._olsibp152_legacy_companion(),
    'continuity_readiness_framework', public._olsibp152_continuity_readiness_framework(),
    'organizational_storytelling_engine', public._olsibp152_organizational_storytelling_engine(),
    'institutional_memory_library', public._olsibp152_institutional_memory_library(),
    'companion_limitations', public._olsibp152_companion_limitations(),
    'self_love_connection', public._olsibp152_self_love_connection(),
    'security_requirements', public._olsibp152_security_requirements(),
    'integration_links', public._olsibp152_integration_links(),
    'dogfooding', public._olsibp152_dogfooding(),
    'success_criteria', public._olsibp152_success_criteria(p_organization_id),
    'engagement_summary', public._olsibp152_engagement_summary(p_organization_id),
    'vision_phrases', public._olsibp152_vision_phrases(),
    'privacy_note', public._olsibp152_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs (metadata scaffolds)
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_legacy_review(
  p_review_type text,
  p_title text,
  p_reflection_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  if p_review_type is null or p_review_type not in (
    'executive_legacy', 'knowledge_preservation', 'values_definition',
    'leadership_reflection', 'continuity_assessment', 'stewardship_review'
  ) then
    raise exception 'invalid_review_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'legacy_review_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.organizational_legacy_reviews (
    organization_id, review_key, review_type, title, status,
    reflection_metadata, scheduled_at, created_by, metadata
  )
  values (
    v_org_id, v_key, p_review_type, trim(p_title), 'scheduled',
    case when p_reflection_summary is not null then jsonb_build_object('summary', left(p_reflection_summary, 500)) else '{}'::jsonb end,
    now() + interval '14 days',
    v_user_id,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  return jsonb_build_object(
    'success', true,
    'review_id', v_id,
    'review_key', v_key,
    'status', 'scheduled',
    'companion_limitation', 'Legacy Companion does NOT choose successors or replace executive judgment.',
    'privacy_note', public._olsibp152_privacy_note()
  );
end; $$;

create or replace function public.register_critical_knowledge_entry(
  p_knowledge_domain text,
  p_role_mapping text,
  p_title text,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  if p_knowledge_domain is null or p_knowledge_domain not in (
    'key_relationships', 'operational_expertise', 'institutional_narratives',
    'decision_frameworks', 'leadership_wisdom', 'historical_context', 'strategic_knowledge'
  ) then
    raise exception 'invalid_knowledge_domain';
  end if;

  if p_role_mapping is null or trim(p_role_mapping) = '' or p_title is null or trim(p_title) = '' then
    raise exception 'role_mapping_and_title_required';
  end if;

  if p_summary is null or trim(p_summary) = '' then
    raise exception 'summary_required';
  end if;

  v_key := 'knowledge_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.organizational_critical_knowledge_registry (
    organization_id, entry_key, knowledge_domain, role_mapping, title, summary,
    status, owner_user_id, metadata
  )
  values (
    v_org_id, v_key, p_knowledge_domain, trim(p_role_mapping), trim(p_title), left(trim(p_summary), 500),
    'active', v_user_id,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  return jsonb_build_object(
    'success', true,
    'entry_id', v_id,
    'entry_key', v_key,
    'status', 'active',
    'privacy_note', public._olsibp152_privacy_note()
  );
end; $$;

create or replace function public.record_continuity_readiness_review(
  p_dimension text,
  p_title text,
  p_readiness_status text default 'in_progress',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  if p_dimension is null or p_dimension not in (
    'leadership_continuity', 'knowledge_continuity', 'operational_continuity',
    'governance_continuity', 'gp_continuity', 'customer_relationship_continuity'
  ) then
    raise exception 'invalid_dimension';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  if p_readiness_status is not null and p_readiness_status not in (
    'not_started', 'in_progress', 'partially_ready', 'ready_for_review', 'archived'
  ) then
    raise exception 'invalid_readiness_status';
  end if;

  v_key := 'continuity_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.organizational_succession_plans (
    organization_id, plan_key, plan_type, title, status, readiness_status,
    role_metadata, owner_user_id, metadata
  )
  values (
    v_org_id, v_key, 'continuity_framework', trim(p_title), 'active',
    coalesce(p_readiness_status, 'in_progress'),
    jsonb_build_object('dimension', p_dimension),
    v_user_id,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true, 'continuity_dimension', p_dimension)
  )
  returning id into v_id;

  return jsonb_build_object(
    'success', true,
    'plan_id', v_id,
    'plan_key', v_key,
    'readiness_status', coalesce(p_readiness_status, 'in_progress'),
    'dimension', p_dimension,
    'companion_limitation', 'No individual successor scoring or ranking.',
    'privacy_note', public._olsibp152_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard + Card RPC — preserve ALL A.34 + Phase 55 + Phase 94 + Phase 126; append Phase 152
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_memory_settings;
  v_continuity_settings public.memory_continuity_settings;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._irp_require_permission(v_org_id, 'memory.view');
  v_settings := public._ome_ensure_settings(v_org_id);
  v_continuity_settings := public._mcebp_ensure_settings(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity. Organizations should not have to relearn the same lessons repeatedly.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'vision', 'Aipify should become a companion that helps organizations remember their journey. Experience deserves to be preserved.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.',
    'core_philosophy', jsonb_build_array(
      'Experience has value',
      'Reflection creates wisdom',
      'Memory strengthens continuity',
      'Organizations should not relearn the same lessons repeatedly'
    ),
    'memory_categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational Memory',
        'examples', jsonb_build_array(
          'Process improvements', 'Incident resolutions', 'Successful interventions', 'Workflow adjustments'
        ),
        'record_categories', jsonb_build_array('process_improvements', 'resolved_incidents', 'operational_decisions')
      ),
      jsonb_build_object(
        'key', 'relationship',
        'label', 'Relationship Memory',
        'examples', jsonb_build_array(
          'Customer preferences', 'Communication styles', 'Long-term partnerships', 'Team collaboration patterns'
        ),
        'record_categories', jsonb_build_array('support_learnings', 'onboarding_lessons')
      ),
      jsonb_build_object(
        'key', 'decision',
        'label', 'Decision Memory',
        'examples', jsonb_build_array(
          'Major decisions', 'Decision rationale', 'Trade-offs considered', 'Outcomes achieved'
        ),
        'record_categories', jsonb_build_array('operational_decisions', 'strategic_decisions', 'approval_precedents')
      ),
      jsonb_build_object(
        'key', 'growth',
        'label', 'Growth Memory',
        'examples', jsonb_build_array(
          'Milestones achieved', 'Challenges overcome', 'Lessons learned', 'Improvements implemented'
        ),
        'record_categories', jsonb_build_array('onboarding_lessons', 'process_improvements', 'support_learnings')
      )
    ),
    'memory_capabilities', jsonb_build_array(
      jsonb_build_object('key', 'recall', 'label', 'Recall previous situations'),
      jsonb_build_object('key', 'surface', 'label', 'Surface relevant experiences'),
      jsonb_build_object('key', 'highlight', 'label', 'Highlight similar events'),
      jsonb_build_object('key', 'recommend', 'label', 'Recommend lessons learned'),
      jsonb_build_object('key', 'preserve', 'label', 'Preserve organizational context')
    ),
    'capability_examples', jsonb_build_array(
      'A similar issue occurred six months ago. Here is how it was resolved.',
      'This decision aligns with a previously successful strategy.',
      'Several lessons emerged from a comparable situation.',
      'You have faced challenges like this before — and you found a way through.'
    ),
    'self_love_note', 'Self Love (A.76 planned) encourages celebrating progress, recognizing resilience, appreciating effort, and reflecting on growth — organizations often forget how far they have come.',
    'trust_connection', jsonb_build_object(
      'principle', 'Organizational Memory should remain transparent.',
      'organizations_should_understand', jsonb_build_array(
        'What is remembered',
        'Why it is relevant',
        'Who contributed the knowledge',
        'How it informs recommendations'
      )
    ),
    'memory_levels', jsonb_build_array(
      jsonb_build_object('level', 'session', 'label', 'Session Memory', 'description', 'Short-term conversational awareness'),
      jsonb_build_object('level', 'workspace', 'label', 'Workspace Memory', 'description', 'Knowledge shared within a specific workspace'),
      jsonb_build_object('level', 'organization', 'label', 'Organizational Memory', 'description', 'Approved institutional knowledge across the organization'),
      jsonb_build_object('level', 'strategic', 'label', 'Strategic Memory', 'description', 'Executive-level insights and decision history')
    ),
    'knowledge_domains', jsonb_build_array(
      'Operational knowledge — SOPs, workflows, support routines, escalation paths',
      'Organizational preferences — communication styles, brand guidelines, terminology, priorities',
      'Historical context — incidents, resolved problems, decisions, lessons learned',
      'Customer intelligence — FAQs, pain points, product knowledge, service expectations',
      'Strategic knowledge — objectives, department goals, KPIs, long-term initiatives'
    ),
    'approved_sources', jsonb_build_array(
      'knowledge_center', 'internal_documentation', 'faq', 'support_conversation',
      'meeting_notes', 'policy_procedure', 'case_resolution'
    ),
    'principles', jsonb_build_array(
      'Humans approve knowledge sources and retention policies',
      'Metadata-only summaries — never raw chat, email, or PII',
      'Distinct from PAME personal memories and Learning Engine',
      'Workspace-scoped memory when organization uses workspaces (A.75)',
      'Scheduled reviews and archival with full audit accountability',
      'Security empowers meaningful work — clear responsibilities strengthen organizations'
    ),
    'distinction_note', 'Distinct from Knowledge Center (A.5) — knowledge is approved documentation; memory is experience captured over time. Distinct from PAME and Learning Engine.',
    'success_criteria', public._ome_abos_success_criteria(v_org_id),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Knowledge Center Engine (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine'),
      jsonb_build_object('label', 'Legacy Engine (A.86)', 'route', '/app/legacy-engine'),
      jsonb_build_object('label', 'Learning Review Center', 'route', '/app/learning'),
      jsonb_build_object('label', 'Organization & Workspaces (A.75)', 'route', '/app/organization-workspace-engine')
    ),
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'active_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'archived_records', coalesce((
        select count(*) from public.organization_memory_records
        where organization_id = v_org_id and status = 'archived'
      ), 0),
      'active_decisions', coalesce((
        select count(*) from public.organization_decision_register
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
      ), 0),
      'by_memory_level', coalesce((
        select jsonb_object_agg(memory_level, cnt)
        from (
          select memory_level, count(*)::int as cnt
          from public.organization_memory_records
          where organization_id = v_org_id and status = 'active'
          group by memory_level
        ) s
      ), '{}'::jsonb)
    ),
    'recent_learnings', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.created_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        order by created_at desc limit 8
      ) r
    ), '[]'::jsonb),
    'recurring_themes', coalesce((
      select jsonb_agg(jsonb_build_object('category', category, 'count', cnt) order by cnt desc)
      from (
        select category, count(*)::int as cnt
        from public.organization_memory_records
        where organization_id = v_org_id and status = 'active'
        group by category order by cnt desc limit 6
      ) t
    ), '[]'::jsonb),
    'frequently_referenced', coalesce((
      select jsonb_agg(public._ome_record_json(r) order by r.reference_count desc, r.updated_at desc)
      from (
        select * from public.organization_memory_records
        where organization_id = v_org_id and status = 'active' and reference_count > 0
        order by reference_count desc, updated_at desc limit 5
      ) r
    ), '[]'::jsonb),
    'archived_decisions', coalesce((
      select jsonb_agg(public._ome_decision_json(d) order by d.updated_at desc)
      from (
        select * from public.organization_decision_register
        where organization_id = v_org_id and status in ('archived', 'superseded')
        order by updated_at desc limit 5
      ) d
    ), '[]'::jsonb),
    'recommended_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rv.id, 'review_type', rv.review_type, 'scheduled_at', rv.scheduled_at,
        'status', rv.status, 'memory_record_id', rv.memory_record_id
      ) order by rv.scheduled_at asc)
      from (
        select * from public.organization_memory_reviews
        where organization_id = v_org_id and status in ('scheduled', 'overdue')
        order by scheduled_at asc limit 5
      ) rv
    ), '[]'::jsonb),
    'privacy_note', 'Organizational Memory stores metadata summaries only. Humans approve sources, remove outdated information, and define retention policies.',
    'implementation_blueprint_phase55', jsonb_build_object(
      'phase', 55,
      'title', 'Memory & Continuity Engine',
      'engine_phase', 'A.34',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE55_MEMORY_CONTINUITY.md',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'ABOS Blueprint Phase 55 extends A.34 with continuity framework — preserves all A.34 and ABOS alignment fields.'
    ),
    'continuity_mission', public._mcebp_blueprint_mission(),
    'continuity_philosophy', public._mcebp_blueprint_philosophy(),
    'continuity_abos_principle', public._mcebp_blueprint_abos_principle(),
    'continuity_objectives', public._mcebp_blueprint_objectives(),
    'continuity_memory_categories', public._mcebp_blueprint_memory_categories(),
    'organizational_continuity', public._mcebp_blueprint_organizational_continuity(),
    'individual_continuity', public._mcebp_blueprint_individual_continuity(),
    'memory_management', public._mcebp_blueprint_memory_management(),
    'continuity_self_love_connection', public._mcebp_blueprint_self_love_connection(),
    'continuity_trust_privacy', public._mcebp_blueprint_trust_privacy(),
    'continuity_companion_principles', public._mcebp_blueprint_companion_principles(),
    'continuity_settings', row_to_json(v_continuity_settings)::jsonb,
    'continuity_summary', public._mcebp_continuity_summary(v_org_id),
    'continuity_dogfooding', public._mcebp_blueprint_dogfooding(),
    'mcebp_integration_links', public._mcebp_blueprint_integration_links(),
    'continuity_success_criteria', public._mcebp_blueprint_success_criteria(v_org_id),
    'continuity_vision_phrases', public._mcebp_blueprint_vision_phrases(),
    'continuity_distinction_note', public._mcebp_distinction_note(),
    'implementation_blueprint_phase94', jsonb_build_object(
      'phase', 'Phase 94 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE94_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'ABOS Blueprint Phase 94 extends A.34 + Phase 55 with unified memory + legacy framing. Cross-links Legacy A.86 + Phase 83 — never duplicate legacy storage.'
    ),
    'organizational_memory_legacy_blueprint', public._omlebp94_organizational_memory_legacy_blueprint_block(v_org_id),
    'memory_legacy_distinction_note', public._omlebp94_distinction_note(),
    'memory_legacy_mission', public._omlebp94_mission(),
    'memory_legacy_philosophy', public._omlebp94_philosophy(),
    'memory_legacy_abos_principle', public._omlebp94_abos_principle(),
    'memory_legacy_objectives', public._omlebp94_objectives(),
    'memory_legacy_categories', public._omlebp94_memory_categories(),
    'memory_legacy_questions', public._omlebp94_memory_questions(),
    'memory_legacy_preservation', public._omlebp94_legacy_preservation(),
    'memory_legacy_companion_guidance', public._omlebp94_companion_guidance(),
    'memory_legacy_meeting_companion_connection', public._omlebp94_meeting_companion_connection(),
    'memory_legacy_knowledge_center_connection', public._omlebp94_knowledge_center_connection(),
    'memory_legacy_self_love_connection', public._omlebp94_self_love_connection(),
    'memory_legacy_trust_connection', public._omlebp94_trust_connection(),
    'memory_legacy_privacy_principles', public._omlebp94_privacy_principles(),
    'memory_legacy_dogfooding', public._omlebp94_dogfooding(),
    'omlebp94_integration_links', public._omlebp94_integration_links(),
    'memory_legacy_engagement_summary', public._omlebp94_engagement_summary(v_org_id),
    'memory_legacy_success_criteria', public._omlebp94_success_criteria(v_org_id),
    'memory_legacy_vision', public._omlebp94_vision(),
    'memory_legacy_vision_phrases', public._omlebp94_vision_phrases(),
    'memory_legacy_privacy_note', 'Organizational Memory Legacy blueprint data is metadata only — no PII, no legacy story content duplication, no surveillance. Humans decide; Aipify informs and prepares.'

    ,
    'implementation_blueprint_phase126', jsonb_build_object(
      'phase', 'Phase 126 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE126_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'spec_doc', 'ORGANIZATIONAL_MEMORY_LEGACY_ENGINE_PHASE126.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'Enterprise Intelligence Phase 126 layers on A.34 + Phase 55 + Phase 94 — memory archives, succession intelligence, storytelling, heritage library. All prior fields preserved.'
    ),
    'enterprise_intelligence_blueprint', public._omlebp126_blueprint_block(v_org_id),
    'phase126_distinction_note', public._omlebp126_distinction_note(),
    'phase126_mission', public._omlebp126_mission(),
    'phase126_philosophy', public._omlebp126_philosophy(),
    'phase126_abos_principle', public._omlebp126_abos_principle(),
    'phase126_vision', public._omlebp126_vision(),
    'phase126_objectives', public._omlebp126_objectives(),
    'phase126_memory_center', public._omlebp126_organizational_memory_center(),
    'phase126_memory_archive_engine', public._omlebp126_memory_archive_engine(),
    'phase126_legacy_engine_captures', public._omlebp126_legacy_engine_captures(),
    'phase126_succession_intelligence', public._omlebp126_succession_intelligence(),
    'phase126_storytelling_framework', public._omlebp126_storytelling_framework(),
    'phase126_critical_knowledge_protection', public._omlebp126_critical_knowledge_protection(),
    'phase126_memory_discovery', public._omlebp126_memory_discovery(),
    'phase126_legacy_companion', public._omlebp126_legacy_companion(),
    'phase126_companion_limitations', public._omlebp126_companion_limitations(),
    'phase126_self_love_connection', public._omlebp126_self_love_connection(),
    'phase126_heritage_library', public._omlebp126_heritage_library(),
    'omlebp126_cross_links', public._omlebp126_cross_links(),
    'phase126_limitation_principles', public._omlebp126_limitation_principles(),
    'phase126_companion_adaptation', public._omlebp126_companion_adaptation(),
    'phase126_success_metrics', public._omlebp126_success_metrics(),
    'phase126_success_criteria', public._omlebp126_success_criteria(v_org_id),
    'phase126_engagement_summary', public._omlebp126_engagement_summary(v_org_id),
    'organizational_memory_enterprise_note', 'Enterprise Intelligence Phase 126 — Organizational Memory & Legacy deepens wisdom preservation, succession intelligence, storytelling, and heritage library on A.34 scaffolds. Humans custodians of legacy — no altering historical records.',
    'phase126_privacy_note', 'Enterprise Intelligence Phase 126 blueprint data is metadata only — memory and legacy aggregate counts. No PII, no legacy story duplication, no surveillance. Humans decide; Aipify informs and prepares.'
    ,
    'implementation_blueprint_phase152', jsonb_build_object(
      'phase', 'Phase 152 — Organizational Legacy & Succession Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE152_ORGANIZATIONAL_LEGACY_SUCCESSION_INTELLIGENCE.md',
      'spec_doc', 'ORGANIZATIONAL_LEGACY_SUCCESSION_INTELLIGENCE_ENGINE_PHASE152.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/organizational-memory-engine',
      'mapping_note', 'Legacy & Future Stewardship Phase 152 layers on A.34 + Phase 55 + Phase 94 + Phase 126 — succession intelligence, critical knowledge registry, executive legacy reviews, continuity readiness. All prior fields preserved.'
    ),
    'legacy_succession_intelligence_blueprint', public._olsibp152_blueprint_block(v_org_id),
    'phase152_distinction_note', public._olsibp152_distinction_note(),
    'phase152_mission', public._olsibp152_mission(),
    'phase152_philosophy', public._olsibp152_philosophy(),
    'phase152_abos_principle', public._olsibp152_abos_principle(),
    'phase152_vision', public._olsibp152_vision(),
    'phase152_objectives', public._olsibp152_objectives(),
    'phase152_legacy_center', public._olsibp152_legacy_center(),
    'phase152_succession_intelligence_engine', public._olsibp152_succession_intelligence_engine(),
    'phase152_critical_knowledge_engine', public._olsibp152_critical_knowledge_engine(),
    'phase152_executive_legacy_reviews', public._olsibp152_executive_legacy_reviews(),
    'phase152_legacy_companion', public._olsibp152_legacy_companion(),
    'phase152_continuity_readiness_framework', public._olsibp152_continuity_readiness_framework(),
    'phase152_organizational_storytelling_engine', public._olsibp152_organizational_storytelling_engine(),
    'phase152_institutional_memory_library', public._olsibp152_institutional_memory_library(),
    'phase152_companion_limitations', public._olsibp152_companion_limitations(),
    'phase152_self_love_connection', public._olsibp152_self_love_connection(),
    'phase152_security_requirements', public._olsibp152_security_requirements(),
    'olsibp152_integration_links', public._olsibp152_integration_links(),
    'phase152_dogfooding', public._olsibp152_dogfooding(),
    'phase152_success_criteria', public._olsibp152_success_criteria(v_org_id),
    'phase152_engagement_summary', public._olsibp152_engagement_summary(v_org_id),
    'phase152_vision_phrases', public._olsibp152_vision_phrases(),
    'organizational_legacy_succession_note', 'Legacy & Future Stewardship Phase 152 — thoughtful succession preparation through knowledge stewardship. Does NOT choose successors. Humans decide; Aipify informs and prepares.',
    'phase152_privacy_note', public._olsibp152_privacy_note(),
    'phase152_sections', jsonb_build_object(
      'succession_plans', coalesce((
        select jsonb_agg(row_to_json(sp) order by sp.updated_at desc)
        from public.organizational_succession_plans sp
        where sp.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb),
      'critical_knowledge_entries', coalesce((
        select jsonb_agg(row_to_json(ck) order by ck.updated_at desc)
        from public.organizational_critical_knowledge_registry ck
        where ck.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb),
      'legacy_reviews', coalesce((
        select jsonb_agg(row_to_json(lr) order by lr.scheduled_at nulls last)
        from public.organizational_legacy_reviews lr
        where lr.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb),
      'story_records', coalesce((
        select jsonb_agg(row_to_json(sr) order by sr.updated_at desc)
        from public.organizational_story_records sr
        where sr.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb)
    )
  );
end; $$;

create or replace function public.get_organizational_memory_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'memory.view');

  return jsonb_build_object(
    'has_organization', true,
    'active_records', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'pending_reviews', coalesce((
      select count(*) from public.organization_memory_reviews
      where organization_id = v_org_id and status in ('scheduled', 'overdue')
    ), 0),
    'philosophy', 'Experience has value. Reflection creates wisdom. Memory strengthens continuity.',
    'mission', 'Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.',
    'abos_principle', 'Knowledge tells us what we know. Memory reminds us who we have become.',
    'knowledge_vs_memory_note', 'Knowledge explains how things should work. Memory captures how things actually unfolded.',
    'implementation_blueprint_phase55', jsonb_build_object(
      'phase', 55,
      'title', 'Memory & Continuity Engine',
      'engine_phase', 'A.34',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE55_MEMORY_CONTINUITY.md',
      'route', '/app/organizational-memory-engine'
    ),
    'continuity_mission', public._mcebp_blueprint_mission(),
    'continuity_summary', public._mcebp_continuity_summary(v_org_id),
    'implementation_blueprint_phase94', jsonb_build_object(
      'phase', 'Phase 94 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE94_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'route', '/app/organizational-memory-engine'
    ),
    'memory_legacy_mission', public._omlebp94_mission(),
    'memory_legacy_abos_principle', public._omlebp94_abos_principle(),
    'memory_legacy_vision', public._omlebp94_vision(),
    'memory_legacy_engagement_summary', public._omlebp94_engagement_summary(v_org_id),
    'memory_legacy_note', 'Organizational Memory & Legacy Engine (ABOS Phase 94) — transform experiences into lasting wisdom; cross-link Legacy A.86 without duplication.',
    'memory_legacy_distinction_note', public._omlebp94_distinction_note()

    ,
    'implementation_blueprint_phase126', jsonb_build_object(
      'phase', 'Phase 126 — Organizational Memory & Legacy Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE126_ORGANIZATIONAL_MEMORY_LEGACY.md',
      'spec_doc', 'ORGANIZATIONAL_MEMORY_LEGACY_ENGINE_PHASE126.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-memory-engine'
    ),
    'phase126_mission', public._omlebp126_mission(),
    'phase126_abos_principle', public._omlebp126_abos_principle(),
    'phase126_vision', public._omlebp126_vision(),
    'phase126_engagement_summary', public._omlebp126_engagement_summary(v_org_id),
    'phase126_note', 'Enterprise Intelligence Phase 126 — preserve wisdom, protect knowledge, succession intelligence, and heritage library on A.34 + Phase 94 scaffolds.',
    'phase126_distinction_note', public._omlebp126_distinction_note()
    ,
    'implementation_blueprint_phase152', jsonb_build_object(
      'phase', 'Phase 152 — Organizational Legacy & Succession Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE152_ORGANIZATIONAL_LEGACY_SUCCESSION_INTELLIGENCE.md',
      'spec_doc', 'ORGANIZATIONAL_LEGACY_SUCCESSION_INTELLIGENCE_ENGINE_PHASE152.md',
      'engine_phase', 'A.34 Organizational Memory Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/organizational-memory-engine'
    ),
    'phase152_mission', public._olsibp152_mission(),
    'phase152_abos_principle', public._olsibp152_abos_principle(),
    'phase152_vision', public._olsibp152_vision(),
    'phase152_engagement_summary', public._olsibp152_engagement_summary(v_org_id),
    'phase152_note', 'Legacy & Future Stewardship Phase 152 — succession intelligence, critical knowledge registry, executive legacy reviews, and continuity readiness on A.34 + Phase 126 scaffolds. Does NOT choose successors.',
    'phase152_distinction_note', public._olsibp152_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._olsibp152_distinction_note() to authenticated;
grant execute on function public._olsibp152_mission() to authenticated;
grant execute on function public._olsibp152_philosophy() to authenticated;
grant execute on function public._olsibp152_abos_principle() to authenticated;
grant execute on function public._olsibp152_vision() to authenticated;
grant execute on function public._olsibp152_objectives() to authenticated;
grant execute on function public._olsibp152_legacy_center() to authenticated;
grant execute on function public._olsibp152_succession_intelligence_engine() to authenticated;
grant execute on function public._olsibp152_critical_knowledge_engine() to authenticated;
grant execute on function public._olsibp152_executive_legacy_reviews() to authenticated;
grant execute on function public._olsibp152_legacy_companion() to authenticated;
grant execute on function public._olsibp152_continuity_readiness_framework() to authenticated;
grant execute on function public._olsibp152_organizational_storytelling_engine() to authenticated;
grant execute on function public._olsibp152_institutional_memory_library() to authenticated;
grant execute on function public._olsibp152_companion_limitations() to authenticated;
grant execute on function public._olsibp152_self_love_connection() to authenticated;
grant execute on function public._olsibp152_security_requirements() to authenticated;
grant execute on function public._olsibp152_integration_links() to authenticated;
grant execute on function public._olsibp152_dogfooding() to authenticated;
grant execute on function public._olsibp152_vision_phrases() to authenticated;
grant execute on function public._olsibp152_privacy_note() to authenticated;
grant execute on function public._olsibp152_engagement_summary(uuid) to authenticated;
grant execute on function public._olsibp152_success_criteria(uuid) to authenticated;
grant execute on function public._olsibp152_blueprint_block(uuid) to authenticated;
grant execute on function public.record_executive_legacy_review(text, text, text, jsonb) to authenticated;
grant execute on function public.register_critical_knowledge_entry(text, text, text, text, jsonb) to authenticated;
grant execute on function public.record_continuity_readiness_review(text, text, text, jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-legacy-succession-intelligence-blueprint-phase152', 'Organizational Legacy & Succession Intelligence (Phase 152)',
  'Legacy & Future Stewardship Phase 152 — extends Organizational Memory Engine A.34 + Phase 126 with succession intelligence, critical knowledge registry, executive legacy reviews, and continuity readiness. Does NOT choose successors.',
  'authenticated', 152
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-legacy-succession-intelligence-blueprint-phase152' and tenant_id is null
);
