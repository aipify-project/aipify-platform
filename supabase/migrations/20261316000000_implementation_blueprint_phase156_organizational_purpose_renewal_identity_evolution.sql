-- Implementation Blueprint Phase 156 — Organizational Purpose Renewal & Identity Evolution Engine
-- Legacy & Future Stewardship Era (151–160). Extends Purpose & Values Engine A.82 + Phases 64, 95 & 138.
-- Helpers: _oprebp156_* (never collide with _pve_*, _pvbp_*, _pvcaebp95_*, _opabp138_*)

-- ---------------------------------------------------------------------------
-- 1. Optional scaffold tables (tenant-scoped, metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.purpose_renewal_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_title text not null,
  review_scope text not null default 'annual' check (
    review_scope in ('annual', 'growth_phase', 'leadership_transition', 'transformation', 'stewardship')
  ),
  renewal_summary text check (char_length(renewal_summary) <= 500),
  reflection_prompts jsonb not null default '[]'::jsonb,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'deferred')
  ),
  metadata jsonb not null default '{}'::jsonb,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purpose_renewal_reviews_org_status_idx
  on public.purpose_renewal_reviews (organization_id, status, created_at desc);

alter table public.purpose_renewal_reviews enable row level security;
revoke all on public.purpose_renewal_reviews from authenticated, anon;

create table if not exists public.purpose_identity_evolution_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workshop_title text not null,
  workshop_scope text not null default 'identity_evolution' check (
    workshop_scope in (
      'identity_evolution', 'cultural_transformation', 'leadership_evolution',
      'companion_integration', 'governance_maturity', 'community_expectations'
    )
  ),
  summary text check (char_length(summary) <= 500),
  reflection_prompts jsonb not null default '[]'::jsonb,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'deferred')
  ),
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purpose_identity_evolution_records_org_idx
  on public.purpose_identity_evolution_records (organization_id, status, created_at desc);

alter table public.purpose_identity_evolution_records enable row level security;
revoke all on public.purpose_identity_evolution_records from authenticated, anon;

create table if not exists public.purpose_memory_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_type text not null check (
    memory_type in (
      'mission_history', 'values_evolution', 'leadership_reflection',
      'transformation_narrative', 'institutional_milestone', 'purpose_review'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  captured_by_role text,
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists purpose_memory_entries_org_type_idx
  on public.purpose_memory_entries (organization_id, memory_type, captured_at desc);

alter table public.purpose_memory_entries enable row level security;
revoke all on public.purpose_memory_entries from authenticated, anon;

create table if not exists public.cultural_continuity_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_type text not null check (
    record_type in (
      'organizational_story', 'leadership_tradition', 'knowledge_sharing_practice',
      'recognition_ritual', 'learning_principle', 'community_commitment'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists cultural_continuity_records_org_type_idx
  on public.cultural_continuity_records (organization_id, record_type, captured_at desc);

alter table public.cultural_continuity_records enable row level security;
revoke all on public.cultural_continuity_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helpers
-- ---------------------------------------------------------------------------
create or replace function public._oprebp156_seed_renewal_reviews(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.purpose_renewal_reviews (
    organization_id, review_title, review_scope, renewal_summary, reflection_prompts, status
  )
  select p_organization_id, v.title, v.scope, v.summary, v.prompts, v.status
  from (values
    (
      'Annual purpose renewal review',
      'annual',
      'Leadership reflection on whether stated purpose still resonates after growth — metadata summary only.',
      '["Does our purpose still resonate with who we have become?","What responsibilities come with our success?"]'::jsonb,
      'scheduled'
    ),
    (
      'Identity evolution workshop',
      'growth_phase',
      'Identity evolution workshop scaffold — intentional change without forgetting why we began.',
      '["What strengths now define us?","What should remain unchanged as we evolve?"]'::jsonb,
      'in_progress'
    )
  ) as v(title, scope, summary, prompts, status)
  where not exists (
    select 1 from public.purpose_renewal_reviews where organization_id = p_organization_id limit 1
  );
end; $$;

create or replace function public._oprebp156_seed_identity_evolution(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.purpose_identity_evolution_records (
    organization_id, workshop_title, workshop_scope, summary, reflection_prompts, status
  )
  select p_organization_id, v.title, v.scope, v.summary, v.prompts, v.status
  from (values
    (
      'Cultural transformation reflection',
      'cultural_transformation',
      'Aggregate reflection on cultural evolution through growth — not rebranding exercises.',
      '["How has our culture matured while honoring our origins?"]'::jsonb,
      'scheduled'
    ),
    (
      'Governance maturity alignment',
      'governance_maturity',
      'Purpose alignment through governance maturity — cross-link Change Management Phase 155.',
      '["Does governance maturity reflect our evolving purpose?"]'::jsonb,
      'in_progress'
    )
  ) as v(title, scope, summary, prompts, status)
  where not exists (
    select 1 from public.purpose_identity_evolution_records where organization_id = p_organization_id limit 1
  );
end; $$;

create or replace function public._oprebp156_seed_purpose_memory(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.purpose_memory_entries (
    organization_id, memory_type, title, summary, captured_by_role
  )
  select p_organization_id, v.mtype, v.title, v.summary, v.role
  from (values
    (
      'mission_history',
      'Mission evolution through growth phase',
      'Leadership documented how original mission informed expansion — metadata summary; cross-link Org Legacy Phase 152.',
      'leadership'
    ),
    (
      'values_evolution',
      'Values refinement after scale milestone',
      'Stated values refined to reflect mature operations while preserving core commitments — metadata only.',
      'leadership'
    )
  ) as v(mtype, title, summary, role)
  where not exists (
    select 1 from public.purpose_memory_entries where organization_id = p_organization_id limit 1
  );
end; $$;

create or replace function public._oprebp156_seed_cultural_continuity(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.cultural_continuity_records (
    organization_id, record_type, title, summary
  )
  select p_organization_id, v.rtype, v.title, v.summary
  from (values
    (
      'organizational_story',
      'Founding story preserved through growth',
      'Institutional story library entry — how the organization began and why purpose endures — metadata summary.'
    ),
    (
      'recognition_ritual',
      'Value-aligned milestone celebration ritual',
      'Recognition ritual honoring purpose-aligned wins — cross-link Gratitude A.89 metadata only.'
    )
  ) as v(rtype, title, summary)
  where not exists (
    select 1 from public.cultural_continuity_records where organization_id = p_organization_id limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint metadata helpers (_oprebp156_*)
-- ---------------------------------------------------------------------------
create or replace function public._oprebp156_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 156 — Organizational Purpose Renewal & Identity Evolution Engine at /app/purpose-values-engine. Extends Purpose & Values Engine Phase A.82 and preserves Blueprint Phases 64 (_pvbp_*), 95 (_pvcaebp95_*), and 138 (_opabp138_*). Phase 156 = Legacy & Future Stewardship Era (151–160) purpose renewal depth — revisit purpose through reflection and alignment, NOT reaction or rebranding; purpose alive not frozen nor abandoned. Distinct from Phase 138 alignment (daily practice) and Phase 118 social impact at /app/social-impact-purpose-engine (cross-link only). Helpers use _oprebp156_* — never collide with prior prefixes.';
$$;

create or replace function public._oprebp156_mission()
returns text language sql immutable as $$
  select 'Help organizations revisit purpose through reflection and intentional identity evolution — evolve without forgetting why you began.';
$$;

create or replace function public._oprebp156_philosophy()
returns text language sql immutable as $$
  select 'Revisit purpose through reflection and alignment — not reaction or rebranding. Evolve intentionally without forgetting why you began. Purpose alive — not frozen, not abandoned. Humans define purpose; companions support reflection only.';
$$;

create or replace function public._oprebp156_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — stewardship through responsibility. Purpose renewal informs preparation and reflection; humans retain authority over mission, identity, and cultural direction. Growth Partner terminology — never Affiliate. People First.';
$$;

create or replace function public._oprebp156_vision()
returns text language sql immutable as $$
  select 'Organizations renew purpose with wisdom — identity evolves intentionally, cultural continuity is preserved, and stewardship grows through reflection not reaction.';
$$;

create or replace function public._oprebp156_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'purpose_renewal_center', 'label', 'Purpose renewal center', 'description', 'Purpose reviews, values reflection programs, identity evolution workshops, leadership alignment, companion reflection, culture assessments, dashboards, institutional story libraries'),
    jsonb_build_object('key', 'purpose_evolution_engine', 'label', 'Purpose evolution engine', 'description', 'Does purpose resonate, responsibilities of growth, stakeholder expectations, strengths, what remains unchanged'),
    jsonb_build_object('key', 'values_continuity_framework', 'label', 'Values continuity framework', 'description', 'Core values, leadership behaviors, customer commitments, community relationships, GP expectations, companion principles'),
    jsonb_build_object('key', 'identity_evolution_engine', 'label', 'Identity evolution engine', 'description', 'Cultural transformation, leadership evolution, companion integration, governance maturity, community expectations — cross-link Phase 155'),
    jsonb_build_object('key', 'purpose_companion', 'label', 'Purpose companion', 'description', 'Reflection prompts, summaries, knowledge discovery, values discussions, leadership prep — does NOT define purpose'),
    jsonb_build_object('key', 'executive_purpose_reviews', 'label', 'Executive purpose reviews', 'description', 'Responsibilities of success, essential values, future shaping, culture experience aggregates — NOT surveillance'),
    jsonb_build_object('key', 'cultural_continuity_engine', 'label', 'Cultural continuity engine', 'description', 'Organizational stories, leadership traditions, knowledge sharing, recognition rituals, learning principles, community commitments'),
    jsonb_build_object('key', 'purpose_memory_engine', 'label', 'Purpose memory engine', 'description', 'Mission histories, values evolution, leadership reflections, transformation narratives — cross-link Phase 152')
  );
$$;

create or replace function public._oprebp156_purpose_renewal_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose renewal center — humans define purpose; Aipify scaffolds reflection, renewal reviews, and institutional story libraries.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'purpose_reviews', 'label', 'Purpose reviews', 'description', 'Periodic purpose renewal sessions — reflection not reaction'),
      jsonb_build_object('key', 'values_reflection_programs', 'label', 'Values reflection programs', 'description', 'Structured values continuity reflection — not compliance scoring'),
      jsonb_build_object('key', 'identity_evolution_workshops', 'label', 'Identity evolution workshops', 'description', 'Intentional identity evolution workshops — not rebranding exercises'),
      jsonb_build_object('key', 'leadership_alignment_sessions', 'label', 'Leadership alignment sessions', 'description', 'Executive renewal alignment — aggregate metadata'),
      jsonb_build_object('key', 'companion_reflection_support', 'label', 'Companion reflection support', 'description', 'Companion scaffolds renewal reflection — does not define identity'),
      jsonb_build_object('key', 'culture_assessments', 'label', 'Culture assessments', 'description', 'Organizational culture continuity signals — not individual surveillance'),
      jsonb_build_object('key', 'purpose_dashboards', 'label', 'Purpose dashboards', 'description', 'Renewal review status and evolution scaffolds'),
      jsonb_build_object('key', 'institutional_story_libraries', 'label', 'Institutional story libraries', 'description', 'Mission histories and cultural continuity stories — metadata summaries')
    ),
    'boundary_note', 'Center facilitates renewal reflection — never imposes ideology or replaces human stewardship.'
  );
$$;

create or replace function public._oprebp156_purpose_evolution_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose evolution engine — does purpose still resonate as the organization grows?',
    'evolution_questions', jsonb_build_array(
      jsonb_build_object('key', 'purpose_resonance', 'label', 'Does purpose resonate?', 'description', 'Does stated purpose still resonate with who we have become?'),
      jsonb_build_object('key', 'growth_responsibilities', 'label', 'Responsibilities of growth', 'description', 'What responsibilities come with organizational success and scale?'),
      jsonb_build_object('key', 'stakeholder_expectations', 'label', 'Stakeholder expectations evolved', 'description', 'How have customer, community, and GP expectations evolved?'),
      jsonb_build_object('key', 'strengths_define_us', 'label', 'Strengths define us', 'description', 'What organizational strengths now define our identity?'),
      jsonb_build_object('key', 'what_unchanged', 'label', 'What remains unchanged', 'description', 'What purpose commitments must remain unchanged through evolution?')
    ),
    'reflection_note', 'Evolution invites dialogue — never reactionary rebranding or abandonment of founding purpose.'
  );
$$;

create or replace function public._oprebp156_values_continuity_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Values continuity framework — preserve core commitments while allowing thoughtful refinement.',
    'continuity_dimensions', jsonb_build_array(
      jsonb_build_object('key', 'core_values', 'label', 'Core values', 'description', 'Which values are non-negotiable through growth and change?'),
      jsonb_build_object('key', 'leadership_behaviors', 'label', 'Leadership behaviors', 'description', 'How leadership models values through evolution — aggregate patterns'),
      jsonb_build_object('key', 'customer_commitments', 'label', 'Customer commitments', 'description', 'Customer-care values continuity through scale'),
      jsonb_build_object('key', 'community_relationships', 'label', 'Community relationships', 'description', 'Community and belonging commitments — Phase 117 cross-link'),
      jsonb_build_object('key', 'gp_expectations', 'label', 'Growth Partner expectations', 'description', 'Stewardship in partner relationships — never Affiliate framing'),
      jsonb_build_object('key', 'companion_principles', 'label', 'Companion principles', 'description', 'Companion behavior aligned with renewed values framing')
    ),
    'customization_note', 'Organizations define values continuity — framework scaffolds reflection only.'
  );
$$;

create or replace function public._oprebp156_identity_evolution_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Identity evolution engine — intentional cultural and organizational identity maturation.',
    'evolution_dimensions', jsonb_build_array(
      jsonb_build_object('key', 'cultural_transformation', 'label', 'Cultural transformation', 'description', 'How culture evolves while honoring origins — not reaction'),
      jsonb_build_object('key', 'leadership_evolution', 'label', 'Leadership evolution', 'description', 'Leadership identity maturation — cross-link Future Leaders Phase 151'),
      jsonb_build_object('key', 'companion_integration', 'label', 'Companion integration', 'description', 'Companion role in renewed organizational identity — governance cross-link'),
      jsonb_build_object('key', 'governance_maturity', 'label', 'Governance maturity', 'description', 'Purpose alignment through governance maturity — cross-link Change Management Phase 155'),
      jsonb_build_object('key', 'community_expectations', 'label', 'Community expectations', 'description', 'Evolving community and ecosystem expectations'),
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment', 'description', 'Renewed purpose alignment through identity evolution — extends Phase 138')
    ),
    'boundary_note', 'Identity evolution is leadership-led — companions prepare and reflect, never define organizational identity.'
  );
$$;

create or replace function public._oprebp156_purpose_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose companion — renewal reflection prompts and knowledge discovery; does NOT define organizational identity.',
    'companion_name', 'Companion',
    'not_label', 'identity authority',
    'capabilities', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Gentle purpose renewal reflection before strategic decisions'),
      jsonb_build_object('emoji', '🌹', 'key', 'purpose_summaries', 'label', 'Purpose summaries', 'description', 'Mission history and evolution context for leadership prep'),
      jsonb_build_object('emoji', '❤️', 'key', 'values_discussions', 'label', 'Values discussions', 'description', 'Scaffold values continuity dialogue — never mandatory compliance'),
      jsonb_build_object('emoji', '🔔', 'key', 'knowledge_discovery', 'label', 'Knowledge discovery', 'description', 'KC and institutional story context for renewal sessions'),
      jsonb_build_object('key', 'leadership_preparation', 'label', 'Leadership preparation', 'description', 'Executive renewal review preparation — metadata summaries only'),
      jsonb_build_object('key', 'alignment_reviews', 'label', 'Alignment reviews', 'description', 'Renewal alignment review scaffolds — extends Phase 138 alignment')
    ),
    'boundary_note', 'Companion facilitates renewal reflection — humans define purpose and identity; no imposing beliefs.'
  );
$$;

create or replace function public._oprebp156_executive_purpose_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive purpose reviews — stewardship accountability through renewal reflection, not surveillance.',
    'review_areas', jsonb_build_array(
      jsonb_build_object('key', 'success_responsibilities', 'label', 'Responsibilities of success', 'description', 'How leadership stewards success without losing purpose'),
      jsonb_build_object('key', 'essential_values', 'label', 'Essential values', 'description', 'Which values must endure through evolution'),
      jsonb_build_object('key', 'future_shaping', 'label', 'Future shaping', 'description', 'How renewed purpose shapes organizational future — cross-link Global Stewardship Phase 150'),
      jsonb_build_object('key', 'employee_culture_experience', 'label', 'Culture experience aggregates', 'description', 'Organizational culture experience signals — NOT individual surveillance'),
      jsonb_build_object('key', 'gp_ecosystem_experience', 'label', 'GP ecosystem experience', 'description', 'Growth Partner ecosystem stewardship patterns — aggregate metadata'),
      jsonb_build_object('key', 'renewal_readiness', 'label', 'Renewal readiness', 'description', 'Leadership readiness for intentional purpose renewal')
    ),
    'executive_route', '/app/executive-intelligence',
    'boundary_note', 'Executive reviews use aggregate metadata — no hidden individual cultural scores.'
  );
$$;

create or replace function public._oprebp156_cultural_continuity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cultural continuity engine — preserve stories, traditions, and rituals that connect present to origins.',
    'continuity_types', jsonb_build_array(
      jsonb_build_object('key', 'organizational_stories', 'label', 'Organizational stories', 'description', 'Founding and milestone narratives — institutional story library'),
      jsonb_build_object('key', 'leadership_traditions', 'label', 'Leadership traditions', 'description', 'Leadership stewardship traditions through generations'),
      jsonb_build_object('key', 'knowledge_sharing_practices', 'label', 'Knowledge sharing practices', 'description', 'How organizational knowledge passes between eras'),
      jsonb_build_object('key', 'recognition_rituals', 'label', 'Recognition rituals', 'description', 'Value-aligned celebration rituals — Gratitude A.89 cross-link'),
      jsonb_build_object('key', 'learning_principles', 'label', 'Learning principles', 'description', 'Organizational learning principles that preserve purpose'),
      jsonb_build_object('key', 'community_commitments', 'label', 'Community commitments', 'description', 'Community belonging commitments through evolution')
    ),
    'boundary_note', 'Cultural continuity stores metadata summaries — never raw conversations or surveillance content.'
  );
$$;

create or replace function public._oprebp156_purpose_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose memory engine — mission histories, values evolution, and transformation narratives as metadata summaries.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'mission_history', 'label', 'Mission histories', 'description', 'How mission evolved through growth phases'),
      jsonb_build_object('key', 'values_evolution', 'label', 'Values evolution', 'description', 'Stated values refinement and continuity rationale'),
      jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflections', 'description', 'Leadership renewal narratives — metadata only'),
      jsonb_build_object('key', 'transformation_narrative', 'label', 'Transformation narratives', 'description', 'Purpose continuity through organizational change'),
      jsonb_build_object('key', 'institutional_milestone', 'label', 'Institutional milestones', 'description', 'Milestones that shaped organizational identity'),
      jsonb_build_object('key', 'purpose_review', 'label', 'Purpose reviews', 'description', 'Renewal review outcomes — metadata summaries')
    ),
    'org_memory_route', '/app/organizational-memory-engine',
    'org_legacy_route', '/app/organizational-memory-engine',
    'boundary_note', 'Cross-link Phase 152 Organizational Legacy — memory stores metadata summaries only.'
  );
$$;

create or replace function public._oprebp156_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose companion limitations — augment stewardship; never replace human purpose authority.',
    'limitations', jsonb_build_array(
      'Never define organizational identity',
      'Never override leadership purpose and values decisions',
      'Never impose ideology or belief systems',
      'Never suppress diverse viewpoints or dissent',
      'Never replace human stewardship of purpose renewal'
    ),
    'boundary_note', 'Companions prepare and reflect — humans define purpose, identity, and cultural direction.'
  );
$$;

create or replace function public._oprebp156_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — reflection, compassion, curiosity, and patience during purposeful change.',
    'practices', jsonb_build_array(
      'Reflect on growth with compassion — change need not be rushed',
      'Curiosity about evolving identity without perfection pressure',
      'Authenticity in how individuals connect work to renewed purpose',
      'Recognition of growth — celebrate steady stewardship progress',
      'Patience during change — renewal at a sustainable human pace',
      'Respect boundaries — renewal prompts are optional'
    ),
    'journey_phrase', 'Purpose renewal serves people — sustainable pacing honors both ambition and wellbeing during evolution.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports individual wellbeing — Phase 156 stores organizational renewal metadata only.'
  );
$$;

create or replace function public._oprebp156_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security requirements — purpose renewal audit, leadership reflection histories, RBAC, knowledge preservation.',
    'requirements', jsonb_build_array(
      'Purpose renewal review actions audited via _pve_log — metadata only',
      'Leadership reflection histories tenant-scoped with RBAC purpose_values.* permissions',
      'Purpose memory and cultural continuity entries require purpose_values.manage',
      'Knowledge preservation controls — institutional stories metadata only',
      '2FA cross-link for sensitive leadership exports — /app/settings/two-factor',
      'Trust Actions cross-link for governance-sensitive renewal decisions — /app/approvals'
    ),
    'two_factor_route', '/app/settings/two-factor',
    'audit_note', 'Renewal reviews, memory captures, and continuity entries are audited — no PII in audit payloads.'
  );
$$;

create or replace function public._oprebp156_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'future_leaders_151', 'label', 'Future Leaders (Phase 151)', 'route', '/app/future-leaders-engine', 'note', 'Intergenerational leadership evolution — cross-link only'),
    jsonb_build_object('key', 'org_legacy_152', 'label', 'Organizational Legacy (Phase 152)', 'route', '/app/organizational-memory-engine', 'note', 'Legacy succession and institutional memory — cross-link only'),
    jsonb_build_object('key', 'decision_heritage_153', 'label', 'Decision Heritage (Phase 153)', 'route', '/app/decision-intelligence-engine', 'note', 'Decision wisdom through purpose evolution — cross-link only'),
    jsonb_build_object('key', 'resilience_154', 'label', 'Organizational Resilience (Phase 154)', 'route', '/app/organizational-resilience-engine', 'note', 'Adaptive continuity through purpose renewal — cross-link only'),
    jsonb_build_object('key', 'change_management_155', 'label', 'Change Management (Phase 155)', 'route', '/app/change-management-engine', 'note', 'Purpose-aware change and governance maturity — cross-link only'),
    jsonb_build_object('key', 'purpose_alignment_138', 'label', 'Purpose Alignment (Phase 138)', 'route', '/app/purpose-values-engine', 'note', 'Daily purpose alignment — Phase 156 layers renewal depth'),
    jsonb_build_object('key', 'social_impact_118', 'label', 'Social Impact & Purpose (Phase 118)', 'route', '/app/social-impact-purpose-engine', 'note', 'Social impact initiatives — distinct from tenant purpose renewal'),
    jsonb_build_object('key', 'global_stewardship_150', 'label', 'Global Stewardship (Phase 150)', 'route', '/app/global-stewardship-collective-future-engine', 'note', 'Long-term stewardship cross-link'),
    jsonb_build_object('key', 'inclusion_humanity_a83', 'label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Human Values Charter vs tenant purpose renewal'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Compassion and patience during purposeful change'),
    jsonb_build_object('key', 'blueprint_phase64', 'label', 'Purpose & Values (Blueprint Phase 64)', 'route', '/app/purpose-values-engine', 'note', 'Preserved — Phase 156 layers Legacy era depth'),
    jsonb_build_object('key', 'blueprint_phase95', 'label', 'Cultural Alignment (Blueprint Phase 95)', 'route', '/app/purpose-values-engine', 'note', 'Preserved — belonging and daily values alignment'),
    jsonb_build_object('key', 'gratitude_a89', 'label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition rituals cross-link')
  );
$$;

create or replace function public._oprebp156_era_legacy_stewardship_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', '151', 'label', 'Intergenerational Leadership & Future Leaders', 'route', '/app/future-leaders-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '152', 'label', 'Organizational Legacy & Succession Intelligence', 'route', '/app/organizational-memory-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '153', 'label', 'Decision Heritage & Organizational Wisdom', 'route', '/app/decision-intelligence-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '154', 'label', 'Organizational Resilience & Adaptive Continuity', 'route', '/app/organizational-resilience-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '155', 'label', 'Change Management & Organizational Renewal', 'route', '/app/change-management-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '156', 'label', 'Organizational Purpose Renewal & Identity Evolution', 'route', '/app/purpose-values-engine', 'status', 'this blueprint')
  );
$$;

create or replace function public._oprebp156_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates purpose renewal patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion philosophy, leadership renewal reviews, Growth Partner stewardship',
      'focus', jsonb_build_array(
        'Purpose renewal through reflection — not reaction or rebranding',
        'Identity evolution workshops — humans define purpose',
        'Institutional story libraries — metadata summaries only',
        'Cultural continuity rituals — no individual surveillance',
        'Growth Partner stewardship terminology — never Affiliate'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce purpose renewal and customer-care values continuity',
      'focus', jsonb_build_array(
        'Customer obsession continuity through growth milestones',
        'Purpose-aligned service celebration — metadata only',
        'Commerce team renewal reflection — belonging through shared purpose',
        'Identity evolution without forgetting founding customer-care mission'
      )
    )
  );
$$;

create or replace function public._oprebp156_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Revisit purpose through reflection — not reaction or rebranding.',
    'Evolve intentionally without forgetting why you began.',
    'Purpose alive — not frozen, not abandoned.',
    'Humans define purpose; companions support renewal reflection only.',
    'Stewardship through responsibility — Growth Partner terminology, People First.',
    'Cultural continuity connects present growth to founding purpose.'
  );
$$;

create or replace function public._oprebp156_privacy_note()
returns text language sql immutable as $$
  select 'Organizational purpose renewal data is metadata only — renewal reviews, identity evolution workshops, purpose memory summaries, cultural continuity records, and preserved Phase 64/95/138 engagement. No hidden cultural scoring, no individual behavior metrics, no PII, no surveillance. Humans define purpose; Aipify informs and prepares.';
$$;

create or replace function public._oprebp156_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_phase138 jsonb;
  v_phase95 jsonb;
  v_phase64 jsonb;
begin
  v_phase138 := public._opabp138_engagement_summary(p_org_id);
  v_phase95 := public._pvcaebp95_engagement_summary(p_org_id);
  v_phase64 := public._pvbp_engagement_summary(p_org_id);

  return jsonb_build_object(
    'purpose_renewal_center_capabilities', jsonb_array_length((public._oprebp156_purpose_renewal_center()->'capabilities')),
    'purpose_evolution_questions', jsonb_array_length((public._oprebp156_purpose_evolution_engine()->'evolution_questions')),
    'values_continuity_dimensions', jsonb_array_length((public._oprebp156_values_continuity_framework()->'continuity_dimensions')),
    'identity_evolution_dimensions', jsonb_array_length((public._oprebp156_identity_evolution_engine()->'evolution_dimensions')),
    'purpose_companion_capabilities', jsonb_array_length((public._oprebp156_purpose_companion()->'capabilities')),
    'executive_review_areas', jsonb_array_length((public._oprebp156_executive_purpose_reviews()->'review_areas')),
    'cultural_continuity_types', jsonb_array_length((public._oprebp156_cultural_continuity_engine()->'continuity_types')),
    'purpose_memory_types', jsonb_array_length((public._oprebp156_purpose_memory_engine()->'memory_types')),
    'integration_links', jsonb_array_length(public._oprebp156_integration_links()),
    'scheduled_renewal_reviews', coalesce((
      select count(*) from public.purpose_renewal_reviews
      where organization_id = p_org_id and status in ('scheduled', 'in_progress')
    ), 0),
    'identity_evolution_workshops', coalesce((
      select count(*) from public.purpose_identity_evolution_records where organization_id = p_org_id
    ), 0),
    'purpose_memory_entries', coalesce((
      select count(*) from public.purpose_memory_entries where organization_id = p_org_id
    ), 0),
    'cultural_continuity_records', coalesce((
      select count(*) from public.cultural_continuity_records where organization_id = p_org_id
    ), 0),
    'phase138_engagement', v_phase138,
    'phase95_engagement', v_phase95,
    'phase64_engagement', v_phase64,
    'privacy_note', public._oprebp156_privacy_note()
  );
end; $$;

create or replace function public._oprebp156_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_has_purpose boolean := false;
begin
  v_engagement := public._oprebp156_engagement_summary(p_org_id);
  v_has_purpose := coalesce((v_engagement->'phase64_engagement'->>'has_purpose_statement')::boolean, false);

  return jsonb_build_array(
    jsonb_build_object('key', 'purpose_renewal_center', 'label', 'Purpose renewal center — reviews, workshops, story libraries', 'met', jsonb_array_length((public._oprebp156_purpose_renewal_center()->'capabilities')) >= 8, 'note', 'Humans define purpose — center scaffolds renewal reflection only.'),
    jsonb_build_object('key', 'purpose_evolution_engine', 'label', 'Purpose evolution engine — resonance, growth responsibilities, strengths', 'met', jsonb_array_length((public._oprebp156_purpose_evolution_engine()->'evolution_questions')) >= 5, 'note', 'Reflection not reaction.'),
    jsonb_build_object('key', 'values_continuity_framework', 'label', 'Values continuity framework — core values through evolution', 'met', jsonb_array_length((public._oprebp156_values_continuity_framework()->'continuity_dimensions')) >= 6, 'note', null),
    jsonb_build_object('key', 'identity_evolution_engine', 'label', 'Identity evolution engine — cultural and leadership maturation', 'met', jsonb_array_length((public._oprebp156_identity_evolution_engine()->'evolution_dimensions')) >= 6, 'note', 'Cross-link Phase 155 change management.'),
    jsonb_build_object('key', 'purpose_companion', 'label', 'Purpose companion — renewal reflection without defining identity', 'met', jsonb_array_length((public._oprebp156_purpose_companion()->'capabilities')) >= 5, 'note', 'Companion facilitates — humans define purpose.'),
    jsonb_build_object('key', 'executive_purpose_reviews', 'label', 'Executive purpose reviews — stewardship through renewal reflection', 'met', jsonb_array_length((public._oprebp156_executive_purpose_reviews()->'review_areas')) >= 6, 'note', 'Aggregate metadata — not surveillance.'),
    jsonb_build_object('key', 'cultural_continuity_engine', 'label', 'Cultural continuity engine — stories, traditions, rituals', 'met', jsonb_array_length((public._oprebp156_cultural_continuity_engine()->'continuity_types')) >= 6, 'note', 'Metadata summaries only.'),
    jsonb_build_object('key', 'purpose_memory_engine', 'label', 'Purpose memory engine — mission histories and values evolution', 'met', jsonb_array_length((public._oprebp156_purpose_memory_engine()->'memory_types')) >= 6, 'note', 'Cross-link Phase 152 organizational legacy.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no defining identity or overriding leadership', 'met', jsonb_array_length((public._oprebp156_companion_limitations()->'limitations')) >= 5, 'note', null),
    jsonb_build_object('key', 'self_love_connection', 'label', 'Self Love connection — compassion and patience during change', 'met', (public._oprebp156_self_love_connection()->>'journey_phrase') is not null, 'note', 'Renewal at a sustainable human pace.'),
    jsonb_build_object('key', 'security_requirements', 'label', 'Security — audit, RBAC, knowledge preservation, 2FA cross-link', 'met', jsonb_array_length((public._oprebp156_security_requirements()->'requirements')) >= 5, 'note', null),
    jsonb_build_object('key', 'phase138_preserved', 'label', 'Blueprint Phase 138 preserved', 'met', jsonb_array_length((public._opabp138_purpose_alignment_center()->'capabilities')) >= 7, 'note', 'Phase 138 alignment metadata intact.'),
    jsonb_build_object('key', 'phase118_distinction', 'label', 'Distinct from Social Impact & Purpose Phase 118', 'met', (public._oprebp156_distinction_note()) like '%Phase 118%', 'note', 'Cross-link /app/social-impact-purpose-engine — do not duplicate.'),
    jsonb_build_object('key', 'integration_links', 'label', 'Cross-links Phases 151–155, 138, 118, 150, A.83, Self Love', 'met', jsonb_array_length(public._oprebp156_integration_links()) >= 12, 'note', 'Extend related engines — do not duplicate.'),
    jsonb_build_object('key', 'live_engagement', 'label', 'Live purpose renewal engagement', 'met', coalesce((v_engagement->>'scheduled_renewal_reviews')::int, 0) >= 0, 'note', format('%s renewal reviews, %s evolution workshops, %s memory entries, %s continuity records.', coalesce((v_engagement->>'scheduled_renewal_reviews')::int, 0), coalesce((v_engagement->>'identity_evolution_workshops')::int, 0), coalesce((v_engagement->>'purpose_memory_entries')::int, 0), coalesce((v_engagement->>'cultural_continuity_records')::int, 0))),
    jsonb_build_object('key', 'purpose_statement', 'label', 'Purpose statement or renewal scaffolds active', 'met', v_has_purpose or jsonb_array_length((public._oprebp156_purpose_renewal_center()->'capabilities')) >= 8, 'note', case when not v_has_purpose then 'Define an organizational purpose statement in settings.' else null end),
    jsonb_build_object('key', 'dogfooding', 'label', 'Dogfooding — Aipify Group internal; Unonight first external pilot', 'met', (public._oprebp156_dogfooding()->'aipify_group') is not null, 'note', null),
    jsonb_build_object('key', 'abos_principle', 'label', 'ABOS principle — stewardship through responsibility', 'met', true, 'note', 'Humans define purpose; Aipify informs and prepares.')
  );
end; $$;

create or replace function public._oprebp156_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 156 — Organizational Purpose Renewal & Identity Evolution Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE156_ORGANIZATIONAL_PURPOSE_RENEWAL_IDENTITY_EVOLUTION.md',
    'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phases 64, 95 & 138)',
    'route', '/app/purpose-values-engine',
    'era', 'Legacy & Future Stewardship Era (151–160)',
    'mapping_note', 'Phase 156 extends A.82 + Phases 64, 95 & 138 with Legacy era purpose renewal depth on same route.',
    'distinction_note', public._oprebp156_distinction_note(),
    'mission', public._oprebp156_mission(),
    'philosophy', public._oprebp156_philosophy(),
    'abos_principle', public._oprebp156_abos_principle(),
    'vision', public._oprebp156_vision(),
    'objectives', public._oprebp156_objectives(),
    'purpose_renewal_center', public._oprebp156_purpose_renewal_center(),
    'purpose_evolution_engine', public._oprebp156_purpose_evolution_engine(),
    'values_continuity_framework', public._oprebp156_values_continuity_framework(),
    'identity_evolution_engine', public._oprebp156_identity_evolution_engine(),
    'purpose_companion', public._oprebp156_purpose_companion(),
    'executive_purpose_reviews', public._oprebp156_executive_purpose_reviews(),
    'cultural_continuity_engine', public._oprebp156_cultural_continuity_engine(),
    'purpose_memory_engine', public._oprebp156_purpose_memory_engine(),
    'companion_limitations', public._oprebp156_companion_limitations(),
    'self_love_connection', public._oprebp156_self_love_connection(),
    'security_requirements', public._oprebp156_security_requirements(),
    'dogfooding', public._oprebp156_dogfooding(),
    'integration_links', public._oprebp156_integration_links(),
    'era_cross_links', public._oprebp156_era_legacy_stewardship_cross_links(),
    'success_criteria', public._oprebp156_success_criteria(p_org_id),
    'engagement_summary', public._oprebp156_engagement_summary(p_org_id),
    'vision_phrases', public._oprebp156_vision_phrases(),
    'privacy_note', public._oprebp156_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_purpose_renewal_review(
  p_review_title text,
  p_review_scope text default 'annual',
  p_renewal_summary text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('purpose_values.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := auth.uid();
  if p_review_scope not in ('annual', 'growth_phase', 'leadership_transition', 'transformation', 'stewardship') then
    raise exception 'Invalid review_scope: %', p_review_scope;
  end if;
  insert into public.purpose_renewal_reviews (
    organization_id, review_title, review_scope, renewal_summary, status
  )
  values (
    v_org_id,
    left(p_review_title, 200),
    left(coalesce(p_review_scope, 'annual'), 100),
    left(coalesce(p_renewal_summary, ''), 500),
    'scheduled'
  )
  returning id into v_id;
  perform public._pve_log(v_org_id, v_user_id, 'purpose_renewal_review_created',
    jsonb_build_object('review_id', v_id, 'title', p_review_title));
  return jsonb_build_object('id', v_id, 'status', 'scheduled');
end; $$;

create or replace function public.record_purpose_memory_entry(
  p_memory_type text,
  p_title text,
  p_summary text,
  p_captured_by_role text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('purpose_values.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := auth.uid();
  if p_memory_type not in (
    'mission_history', 'values_evolution', 'leadership_reflection',
    'transformation_narrative', 'institutional_milestone', 'purpose_review'
  ) then
    raise exception 'Invalid memory_type: %', p_memory_type;
  end if;
  insert into public.purpose_memory_entries (
    organization_id, memory_type, title, summary, captured_by_role
  )
  values (
    v_org_id,
    p_memory_type,
    left(p_title, 200),
    left(p_summary, 500),
    left(coalesce(p_captured_by_role, ''), 100)
  )
  returning id into v_id;
  perform public._pve_log(v_org_id, v_user_id, 'purpose_memory_entry_captured',
    jsonb_build_object('memory_id', v_id, 'memory_type', p_memory_type));
  return jsonb_build_object('id', v_id, 'memory_type', p_memory_type);
end; $$;

create or replace function public.record_cultural_continuity_entry(
  p_record_type text,
  p_title text,
  p_summary text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('purpose_values.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := auth.uid();
  if p_record_type not in (
    'organizational_story', 'leadership_tradition', 'knowledge_sharing_practice',
    'recognition_ritual', 'learning_principle', 'community_commitment'
  ) then
    raise exception 'Invalid record_type: %', p_record_type;
  end if;
  insert into public.cultural_continuity_records (
    organization_id, record_type, title, summary
  )
  values (
    v_org_id,
    p_record_type,
    left(p_title, 200),
    left(p_summary, 500)
  )
  returning id into v_id;
  perform public._pve_log(v_org_id, v_user_id, 'cultural_continuity_entry_captured',
    jsonb_build_object('record_id', v_id, 'record_type', p_record_type));
  return jsonb_build_object('id', v_id, 'record_type', p_record_type);
end; $$;

-- 5. Dashboard RPC — preserve ALL A.82 + Phase 64 + Phase 95 + Phase 138; append Phase 156
-- ---------------------------------------------------------------------------
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
  perform public._opabp138_seed_alignment_reviews(v_org_id);
  perform public._opabp138_seed_values_memory(v_org_id);
  perform public._opabp138_seed_culture_health(v_org_id);
  perform public._oprebp156_seed_renewal_reviews(v_org_id);
  perform public._oprebp156_seed_identity_evolution(v_org_id);
  perform public._oprebp156_seed_purpose_memory(v_org_id);
  perform public._oprebp156_seed_cultural_continuity(v_org_id);

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
      'has_purpose_statement', v_settings.purpose_statement is not null,
      'alignment_reviews', coalesce((
        select count(*) from public.purpose_alignment_reviews where organization_id = v_org_id
      ), 0),
      'values_memory_entries', coalesce((
        select count(*) from public.purpose_values_memory where organization_id = v_org_id
      ), 0),
      'culture_health_snapshots', coalesce((
        select count(*) from public.culture_health_snapshots where organization_id = v_org_id
      ), 0),
      'renewal_reviews', coalesce((
        select count(*) from public.purpose_renewal_reviews where organization_id = v_org_id
      ), 0),
      'identity_evolution_workshops', coalesce((
        select count(*) from public.purpose_identity_evolution_records where organization_id = v_org_id
      ), 0),
      'phase156_purpose_memory_entries', coalesce((
        select count(*) from public.purpose_memory_entries where organization_id = v_org_id
      ), 0),
      'cultural_continuity_records', coalesce((
        select count(*) from public.cultural_continuity_records where organization_id = v_org_id
      ), 0)
    ),
    'integration_links', jsonb_build_object(
      'business_dna', '/app/settings/business-dna',
      'strategic_alignment', '/app/strategic-alignment-engine',
      'organizational_decision_support', '/app/organizational-decision-support-engine',
      'trust_reputation', '/app/trust-reputation-engine',
      'organizational_health', '/app/organizational-health-engine',
      'change_management', '/app/change-management-engine',
      'goals_okr', '/app/goals-okr-engine',
      'social_impact_purpose', '/app/social-impact-purpose-engine',
      'collective_decision_council', '/app/collective-decision-council-engine',
      'organizational_wisdom', '/app/organizational-wisdom-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('purpose_values.manage'),
      'can_edit_values', public._irp_has_permission('purpose_values.values.edit'),
      'can_export', public._irp_has_permission('purpose_values.export')
    ),
    'implementation_blueprint_phase64', jsonb_build_object(
      'phase', 'Phase 64 — Purpose & Values Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE64_PURPOSE_VALUES.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine',
      'route', '/app/purpose-values-engine',
      'mapping_note', 'ABOS Blueprint Phase 64 extends A.82 with purpose discovery, values in action, decision alignment, organizational storytelling, leadership insights, and live success criteria.'
    ),
    'purpose_values_note', 'Purpose & Values Engine (ABOS Phase 64) — extends Phase A.82 with values-in-action framing, purpose discovery questions, organizational storytelling, and leadership reflection prompts.',
    'blueprint_distinction_note', public._pvbp_distinction_note(),
    'blueprint_mission', public._pvbp_mission(),
    'blueprint_philosophy', public._pvbp_philosophy(),
    'blueprint_abos_principle', public._pvbp_abos_principle(),
    'blueprint_objectives', public._pvbp_objectives(),
    'purpose_discovery', public._pvbp_purpose_discovery(),
    'values_exploration', public._pvbp_values_exploration(),
    'values_in_action', public._pvbp_values_in_action(),
    'decision_alignment', public._pvbp_decision_alignment(),
    'organizational_storytelling', public._pvbp_organizational_storytelling(),
    'self_love_connection', public._pvbp_self_love_connection(),
    'leadership_insights', public._pvbp_leadership_insights(),
    'trust_connection', public._pvbp_trust_connection(),
    'dogfooding', public._pvbp_dogfooding(),
    'blueprint_integration_links', public._pvbp_integration_links(),
    'engagement_summary', public._pvbp_engagement_summary(v_org_id),
    'success_criteria', public._pvbp_success_criteria(v_org_id),
    'vision_phrases', public._pvbp_vision_phrases(),
    'privacy_note', 'Purpose and values data is metadata only — stated values, alignment signal summaries, and reflection prompts. No raw customer content, chat, or PII. Humans decide; Aipify informs and prepares.',
    'implementation_blueprint_phase95', jsonb_build_object(
      'phase', 'Phase 95 — Purpose, Values & Cultural Alignment Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE95_PURPOSE_VALUES_CULTURAL_ALIGNMENT.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phase 64)',
      'route', '/app/purpose-values-engine',
      'mapping_note', 'ABOS Blueprint Phase 95 extends A.82 + Phase 64 with cultural alignment framing. Distinct from Sales Expert A.95 at /app/sales-expert-engine (phase number collision).'
    ),
    'purpose_values_cultural_alignment_note', 'Purpose, Values & Cultural Alignment Engine (ABOS Phase 95) — align everyday actions with values and purpose; strengthen belonging — alignment not control.',
    'purpose_values_cultural_alignment_blueprint', public._pvcaebp95_blueprint_block(v_org_id),
    'cultural_alignment_distinction_note', public._pvcaebp95_distinction_note(),
    'cultural_alignment_mission', public._pvcaebp95_mission(),
    'cultural_alignment_philosophy', public._pvcaebp95_philosophy(),
    'cultural_alignment_abos_principle', public._pvcaebp95_abos_principle(),
    'cultural_alignment_objectives', public._pvcaebp95_objectives(),
    'cultural_alignment_purpose_questions', public._pvcaebp95_purpose_questions(),
    'cultural_alignment_values_reflection_questions', public._pvcaebp95_values_reflection_questions(),
    'cultural_alignment_cultural_observations', public._pvcaebp95_cultural_observations(),
    'cultural_alignment_onboarding_connection', public._pvcaebp95_onboarding_connection(),
    'cultural_alignment_companion_guidance', public._pvcaebp95_companion_guidance(),
    'cultural_alignment_recognition_connection', public._pvcaebp95_recognition_connection(),
    'cultural_alignment_self_love_connection', public._pvcaebp95_self_love_connection(),
    'cultural_alignment_leadership_connection', public._pvcaebp95_leadership_connection(),
    'cultural_alignment_trust_connection', public._pvcaebp95_trust_connection(),
    'cultural_alignment_privacy_principles', public._pvcaebp95_privacy_principles(),
    'cultural_alignment_dogfooding', public._pvcaebp95_dogfooding(),
    'cultural_alignment_integration_links', public._pvcaebp95_integration_links(),
    'cultural_alignment_engagement_summary', public._pvcaebp95_engagement_summary(v_org_id),
    'cultural_alignment_success_criteria', public._pvcaebp95_success_criteria(v_org_id),
    'cultural_alignment_vision', public._pvcaebp95_vision(),
    'cultural_alignment_vision_phrases', public._pvcaebp95_vision_phrases(),
    'cultural_alignment_privacy_note', 'Cultural alignment blueprint data is metadata only — no hidden cultural scoring, no individual behavior metrics, no PII. Humans decide; Aipify informs and prepares.',
    'implementation_blueprint_phase138', jsonb_build_object(
      'phase', 'Phase 138 — Organizational Purpose Alignment & Values Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE138_ORGANIZATIONAL_PURPOSE_ALIGNMENT_VALUES.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phases 64 & 95)',
      'route', '/app/purpose-values-engine',
      'era', 'Autonomous Organization Era (131–140)',
      'mapping_note', 'Phase 138 extends A.82 + Phase 64 + Phase 95 with Autonomous Organization Era purpose alignment depth. Distinct from Social Impact & Purpose Phase 118.'
    ),
    'organizational_purpose_alignment_note', 'Organizational Purpose Alignment & Values Engine (ABOS Phase 138) — purpose guides action; reflection not ideology enforcement; humans define purpose, companions facilitate.',
    'organizational_purpose_alignment_blueprint', public._opabp138_blueprint_block(v_org_id),
    'purpose_alignment_distinction_note', public._opabp138_distinction_note(),
    'purpose_alignment_mission', public._opabp138_mission(),
    'purpose_alignment_philosophy', public._opabp138_philosophy(),
    'purpose_alignment_abos_principle', public._opabp138_abos_principle(),
    'purpose_alignment_objectives', public._opabp138_objectives(),
    'purpose_alignment_center', public._opabp138_purpose_alignment_center(),
    'purpose_alignment_values_framework', public._opabp138_values_framework_engine(),
    'purpose_alignment_review_engine', public._opabp138_alignment_review_engine(),
    'purpose_alignment_companion', public._opabp138_purpose_companion(),
    'purpose_alignment_culture_health', public._opabp138_culture_health_engine(),
    'purpose_alignment_integration_framework', public._opabp138_purpose_integration_framework(),
    'purpose_alignment_values_memory_engine', public._opabp138_values_memory_engine(),
    'purpose_alignment_companion_limitations', public._opabp138_companion_limitations(),
    'purpose_alignment_self_love_connection', public._opabp138_self_love_connection(),
    'purpose_alignment_executive_reviews', public._opabp138_executive_purpose_reviews(),
    'purpose_alignment_security_requirements', public._opabp138_security_requirements(),
    'purpose_alignment_dogfooding', public._opabp138_dogfooding(),
    'purpose_alignment_integration_links', public._opabp138_integration_links(),
    'purpose_alignment_era_cross_links', public._opabp138_era_autonomous_organization_cross_links(),
    'purpose_alignment_engagement_summary', public._opabp138_engagement_summary(v_org_id),
    'purpose_alignment_success_criteria', public._opabp138_success_criteria(v_org_id),
    'purpose_alignment_vision', public._opabp138_vision(),
    'purpose_alignment_vision_phrases', public._opabp138_vision_phrases(),
    'purpose_alignment_privacy_note', public._opabp138_privacy_note(),
    'alignment_reviews', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from public.purpose_alignment_reviews r
      where r.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'values_memory_entries', coalesce((
      select jsonb_agg(row_to_json(m) order by m.captured_at desc)
      from public.purpose_values_memory m
      where m.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),

    'implementation_blueprint_phase156', jsonb_build_object(
      'phase', 'Phase 156 — Organizational Purpose Renewal & Identity Evolution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE156_ORGANIZATIONAL_PURPOSE_RENEWAL_IDENTITY_EVOLUTION.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phases 64, 95 & 138)',
      'route', '/app/purpose-values-engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'mapping_note', 'Phase 156 extends A.82 + Phases 64, 95 & 138 with Legacy era purpose renewal depth. Distinct from Social Impact & Purpose Phase 118.'
    ),
    'organizational_purpose_renewal_note', 'Organizational Purpose Renewal & Identity Evolution Engine (ABOS Phase 156) — revisit purpose through reflection not reaction; evolve intentionally without forgetting why you began.',
    'organizational_purpose_renewal_blueprint', public._oprebp156_blueprint_block(v_org_id),
    'purpose_renewal_distinction_note', public._oprebp156_distinction_note(),
    'purpose_renewal_mission', public._oprebp156_mission(),
    'purpose_renewal_philosophy', public._oprebp156_philosophy(),
    'purpose_renewal_abos_principle', public._oprebp156_abos_principle(),
    'purpose_renewal_objectives', public._oprebp156_objectives(),
    'purpose_renewal_center', public._oprebp156_purpose_renewal_center(),
    'purpose_evolution_engine', public._oprebp156_purpose_evolution_engine(),
    'values_continuity_framework', public._oprebp156_values_continuity_framework(),
    'identity_evolution_engine', public._oprebp156_identity_evolution_engine(),
    'purpose_renewal_companion', public._oprebp156_purpose_companion(),
    'purpose_renewal_executive_reviews', public._oprebp156_executive_purpose_reviews(),
    'cultural_continuity_engine', public._oprebp156_cultural_continuity_engine(),
    'purpose_memory_engine', public._oprebp156_purpose_memory_engine(),
    'purpose_renewal_companion_limitations', public._oprebp156_companion_limitations(),
    'purpose_renewal_self_love_connection', public._oprebp156_self_love_connection(),
    'purpose_renewal_security_requirements', public._oprebp156_security_requirements(),
    'purpose_renewal_dogfooding', public._oprebp156_dogfooding(),
    'purpose_renewal_integration_links', public._oprebp156_integration_links(),
    'purpose_renewal_era_cross_links', public._oprebp156_era_legacy_stewardship_cross_links(),
    'purpose_renewal_engagement_summary', public._oprebp156_engagement_summary(v_org_id),
    'purpose_renewal_success_criteria', public._oprebp156_success_criteria(v_org_id),
    'purpose_renewal_vision', public._oprebp156_vision(),
    'purpose_renewal_vision_phrases', public._oprebp156_vision_phrases(),
    'purpose_renewal_privacy_note', public._oprebp156_privacy_note(),
    'purpose_renewal_reviews', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from public.purpose_renewal_reviews r
      where r.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'purpose_identity_evolution_records', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.purpose_identity_evolution_records e
      where e.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'phase156_purpose_memory_entries', coalesce((
      select jsonb_agg(row_to_json(m) order by m.captured_at desc)
      from public.purpose_memory_entries m
      where m.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'cultural_continuity_records', coalesce((
      select jsonb_agg(row_to_json(c) order by c.created_at desc)
      from public.cultural_continuity_records c
      where c.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'culture_health_snapshots', coalesce((
      select jsonb_agg(row_to_json(c) order by c.measured_at desc)
      from public.culture_health_snapshots c
      where c.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve A.82 + Phase 64 + Phase 95 + Phase 138; append Phase 156
-- ---------------------------------------------------------------------------
create or replace function public.get_purpose_values_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_active_values int := 0;
  v_pending int := 0;
  v_engagement jsonb;
  v_cultural_engagement jsonb;
  v_purpose_engagement jsonb;
  v_renewal_engagement jsonb;
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  perform public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);
  perform public._opabp138_seed_alignment_reviews(v_org_id);
  v_engagement := public._pvbp_engagement_summary(v_org_id);
  v_cultural_engagement := public._pvcaebp95_engagement_summary(v_org_id);
  v_purpose_engagement := public._opabp138_engagement_summary(v_org_id);
  perform public._oprebp156_seed_renewal_reviews(v_org_id);
  v_renewal_engagement := public._oprebp156_engagement_summary(v_org_id);

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
    'enabled', (select enabled from public.organization_purpose_values_settings where organization_id = v_org_id),
    'implementation_blueprint_phase64', jsonb_build_object(
      'phase', 'Phase 64 — Purpose & Values Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE64_PURPOSE_VALUES.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine',
      'route', '/app/purpose-values-engine'
    ),
    'mission', public._pvbp_mission(),
    'abos_principle', public._pvbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Purpose & Values Engine (ABOS Phase 64) — extends A.82 with purpose discovery, values in action, and live success criteria.',
    'values_note', 'Purpose provides direction; values provide boundaries — culture practiced intentionally, not decoratively.',
    'implementation_blueprint_phase95', jsonb_build_object(
      'phase', 'Phase 95 — Purpose, Values & Cultural Alignment Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE95_PURPOSE_VALUES_CULTURAL_ALIGNMENT.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phase 64)',
      'route', '/app/purpose-values-engine'
    ),
    'cultural_alignment_mission', public._pvcaebp95_mission(),
    'cultural_alignment_abos_principle', public._pvcaebp95_abos_principle(),
    'cultural_alignment_engagement_summary', v_cultural_engagement,
    'cultural_alignment_note', 'Purpose, Values & Cultural Alignment Engine (ABOS Phase 95) — align everyday actions with values and purpose; strengthen belonging.',
    'cultural_alignment_vision_note', public._pvcaebp95_vision(),
    'implementation_blueprint_phase138', jsonb_build_object(
      'phase', 'Phase 138 — Organizational Purpose Alignment & Values Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE138_ORGANIZATIONAL_PURPOSE_ALIGNMENT_VALUES.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phases 64 & 95)',
      'route', '/app/purpose-values-engine',
      'era', 'Autonomous Organization Era (131–140)'
    ),
    'purpose_alignment_mission', public._opabp138_mission(),
    'purpose_alignment_abos_principle', public._opabp138_abos_principle(),
    'purpose_alignment_engagement_summary', v_purpose_engagement,
    'purpose_alignment_note', 'Organizational Purpose Alignment & Values Engine (ABOS Phase 138) — purpose guides action; reflection not enforcement.',
    'purpose_alignment_vision_note', public._opabp138_vision(),
    'implementation_blueprint_phase156', jsonb_build_object(
      'phase', 'Phase 156 — Organizational Purpose Renewal & Identity Evolution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE156_ORGANIZATIONAL_PURPOSE_RENEWAL_IDENTITY_EVOLUTION.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phases 64, 95 & 138)',
      'route', '/app/purpose-values-engine',
      'era', 'Legacy & Future Stewardship Era (151–160)'
    ),
    'purpose_renewal_mission', public._oprebp156_mission(),
    'purpose_renewal_abos_principle', public._oprebp156_abos_principle(),
    'purpose_renewal_engagement_summary', v_renewal_engagement,
    'purpose_renewal_note', 'Organizational Purpose Renewal & Identity Evolution Engine (ABOS Phase 156) — reflection not reaction; purpose alive not frozen nor abandoned.',
    'purpose_renewal_vision_note', public._oprebp156_vision()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._oprebp156_distinction_note() to authenticated;
grant execute on function public._oprebp156_mission() to authenticated;
grant execute on function public._oprebp156_philosophy() to authenticated;
grant execute on function public._oprebp156_abos_principle() to authenticated;
grant execute on function public._oprebp156_vision() to authenticated;
grant execute on function public._oprebp156_objectives() to authenticated;
grant execute on function public._oprebp156_purpose_renewal_center() to authenticated;
grant execute on function public._oprebp156_purpose_evolution_engine() to authenticated;
grant execute on function public._oprebp156_values_continuity_framework() to authenticated;
grant execute on function public._oprebp156_identity_evolution_engine() to authenticated;
grant execute on function public._oprebp156_purpose_companion() to authenticated;
grant execute on function public._oprebp156_executive_purpose_reviews() to authenticated;
grant execute on function public._oprebp156_cultural_continuity_engine() to authenticated;
grant execute on function public._oprebp156_purpose_memory_engine() to authenticated;
grant execute on function public._oprebp156_companion_limitations() to authenticated;
grant execute on function public._oprebp156_self_love_connection() to authenticated;
grant execute on function public._oprebp156_security_requirements() to authenticated;
grant execute on function public._oprebp156_integration_links() to authenticated;
grant execute on function public._oprebp156_era_legacy_stewardship_cross_links() to authenticated;
grant execute on function public._oprebp156_dogfooding() to authenticated;
grant execute on function public._oprebp156_vision_phrases() to authenticated;
grant execute on function public._oprebp156_privacy_note() to authenticated;
grant execute on function public._oprebp156_engagement_summary(uuid) to authenticated;
grant execute on function public._oprebp156_success_criteria(uuid) to authenticated;
grant execute on function public._oprebp156_blueprint_block(uuid) to authenticated;
grant execute on function public.record_purpose_renewal_review(text, text, text) to authenticated;
grant execute on function public.record_purpose_memory_entry(text, text, text, text) to authenticated;
grant execute on function public.record_cultural_continuity_entry(text, text, text) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-purpose-renewal-blueprint-phase156', 'Organizational Purpose Renewal & Identity Evolution Engine (ABOS Phase 156)',
  'Organizational Purpose Renewal & Identity Evolution Engine — extends A.82 + Phases 64, 95 & 138 with Legacy era purpose renewal depth, identity evolution workshops, cultural continuity, and reflection-not-reaction privacy. No employee surveillance.',
  'authenticated', 135
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-purpose-renewal-blueprint-phase156' and tenant_id is null
);
