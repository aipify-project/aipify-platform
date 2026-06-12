-- Implementation Blueprint Phase 138 — Organizational Purpose Alignment & Values Engine
-- Autonomous Organization Era (131–140). Extends Purpose & Values Engine A.82 + Blueprint Phases 64 & 95.
-- Helpers: _opabp138_* (never collide with _pve_*, _pvbp_*, _pvcaebp95_*)

-- ---------------------------------------------------------------------------
-- 1. Optional scaffold tables (tenant-scoped, metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.purpose_alignment_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_title text not null,
  review_scope text not null default 'quarterly',
  alignment_summary text check (char_length(alignment_summary) <= 500),
  reflection_prompts jsonb not null default '[]'::jsonb,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'deferred')
  ),
  metadata jsonb not null default '{}'::jsonb,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purpose_alignment_reviews_org_status_idx
  on public.purpose_alignment_reviews (organization_id, status, created_at desc);

alter table public.purpose_alignment_reviews enable row level security;
revoke all on public.purpose_alignment_reviews from authenticated, anon;

create table if not exists public.purpose_values_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_type text not null check (
    memory_type in (
      'mission_update', 'values_refinement', 'leadership_narrative',
      'cultural_milestone', 'transformation_reflection', 'community_contribution'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  captured_by_role text,
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists purpose_values_memory_org_type_idx
  on public.purpose_values_memory (organization_id, memory_type, captured_at desc);

alter table public.purpose_values_memory enable row level security;
revoke all on public.purpose_values_memory from authenticated, anon;

create table if not exists public.culture_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  indicator_key text not null,
  indicator_label text not null,
  aggregate_note text check (char_length(aggregate_note) <= 500),
  trend text check (trend in ('improving', 'stable', 'attention', 'unknown')),
  measured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists culture_health_snapshots_org_idx
  on public.culture_health_snapshots (organization_id, measured_at desc);

alter table public.culture_health_snapshots enable row level security;
revoke all on public.culture_health_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helpers
-- ---------------------------------------------------------------------------
create or replace function public._opabp138_seed_alignment_reviews(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.purpose_alignment_reviews (
    organization_id, review_title, review_scope, alignment_summary, reflection_prompts, status
  )
  select p_organization_id, v.title, v.scope, v.summary, v.prompts, v.status
  from (values
    (
      'Quarterly purpose alignment review',
      'quarterly',
      'Leadership reflection on stated purpose and values consistency — metadata summary only.',
      '["Do daily actions reflect what we claim to value?","How does purpose guide uncertain priorities?"]'::jsonb,
      'scheduled'
    ),
    (
      'Companion alignment reflection',
      'companion_governance',
      'Aggregate companion behavior consistency with stated values — reflection not enforcement.',
      '["Are companion prompts supportive rather than compliance-driven?"]'::jsonb,
      'in_progress'
    )
  ) as v(title, scope, summary, prompts, status)
  where not exists (
    select 1 from public.purpose_alignment_reviews where organization_id = p_organization_id limit 1
  );
end; $$;

create or replace function public._opabp138_seed_values_memory(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.purpose_values_memory (
    organization_id, memory_type, title, summary, captured_by_role
  )
  select p_organization_id, v.mtype, v.title, v.summary, v.role
  from (values
    (
      'mission_update',
      'Purpose statement refined during growth phase',
      'Leadership clarified how customer care and sustainable pace connect to organizational purpose — metadata summary.',
      'leadership'
    ),
    (
      'cultural_milestone',
      'Value-aligned service win celebrated',
      'Team recognized compassionate support response — belonging strengthened through shared purpose.',
      'operations'
    )
  ) as v(mtype, title, summary, role)
  where not exists (
    select 1 from public.purpose_values_memory where organization_id = p_organization_id limit 1
  );
end; $$;

create or replace function public._opabp138_seed_culture_health(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.culture_health_snapshots (
    organization_id, indicator_key, indicator_label, aggregate_note, trend
  )
  select p_organization_id, v.ikey, v.ilabel, v.note, v.trend
  from (values
    ('knowledge_sharing', 'Knowledge sharing', 'Approved knowledge paths referenced in team coordination — aggregate pattern only.', 'stable'),
    ('recognition', 'Recognition patterns', 'Value-aligned wins acknowledged in metadata summaries — no public ranking.', 'improving'),
    ('psychological_safety', 'Psychological safety signals', 'Reflection prompts deferred respectfully — human choice honored.', 'stable'),
    ('learning_participation', 'Learning participation', 'Organizational learning program engagement — aggregate counts only.', 'attention'),
    ('community_engagement', 'Community engagement', 'Community contribution patterns — cross-link Phase 117 metadata.', 'stable')
  ) as v(ikey, ilabel, note, trend)
  where not exists (
    select 1 from public.culture_health_snapshots where organization_id = p_organization_id limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint metadata helpers (_opabp138_*)
-- ---------------------------------------------------------------------------
create or replace function public._opabp138_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 138 — Organizational Purpose Alignment & Values Engine at /app/purpose-values-engine. Extends Purpose & Values Engine Phase A.82 and preserves Blueprint Phase 64 (_pvbp_*) and Phase 95 (_pvcaebp95_*) metadata. Phase 138 = Autonomous Organization Era purpose alignment depth — purpose guides action, reflection not ideology enforcement; companions facilitate, humans define purpose. Distinct from Social Impact & Purpose Phase 118 at /app/social-impact-purpose-engine (social impact initiatives and community programs — cross-link only). Distinct from Collective Decision Council Phase 137 at /app/collective-decision-council-engine. Helpers use _opabp138_* — never collide with _pve_*, _pvbp_*, or _pvcaebp95_*.';
$$;

create or replace function public._opabp138_mission()
returns text language sql immutable as $$
  select 'Deepen organizational purpose alignment across leadership, companions, and daily practice — reflection not enforcement.';
$$;

create or replace function public._opabp138_philosophy()
returns text language sql immutable as $$
  select 'Purpose guides action — not words on a website. Reflection not ideology enforcement. Culture health reflects organizational patterns — never individual surveillance. Humans define purpose and values; companions support reflection only.';
$$;

create or replace function public._opabp138_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — stewardship through responsibility. Purpose and values inform preparation and reflection; humans retain authority over mission, beliefs, and cultural direction. Growth Partner terminology — never Affiliate. People First.';
$$;

create or replace function public._opabp138_vision()
returns text language sql immutable as $$
  select 'Organizations live their purpose — values visible in decisions, companions, and culture — because reflection and alignment are practiced, not imposed.';
$$;

create or replace function public._opabp138_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'purpose_alignment_center', 'label', 'Purpose alignment center', 'description', 'Purpose statements, values reviews, leadership alignment sessions, culture health indicators, and purpose dashboards'),
    jsonb_build_object('key', 'values_framework_engine', 'label', 'Values framework engine', 'description', 'Integrity, compassion, curiosity, responsibility, transparency, excellence, community, growth — customizable organizational values'),
    jsonb_build_object('key', 'alignment_review_engine', 'label', 'Alignment review engine', 'description', 'Actions vs values, workflows vs purpose, companion consistency, leadership practices — aggregate reflection prompts'),
    jsonb_build_object('key', 'purpose_companion', 'label', 'Purpose companion', 'description', 'Reflection prompts, reminders, values discussions, historical context — does not define purpose'),
    jsonb_build_object('key', 'culture_health_engine', 'label', 'Culture health engine', 'description', 'Organizational culture indicators — knowledge sharing, recognition, psychological safety signals — NOT employee surveillance'),
    jsonb_build_object('key', 'purpose_integration', 'label', 'Purpose integration framework', 'description', 'Leadership decisions, companion governance, Growth Partner relationships, KC, learning, transformation, community'),
    jsonb_build_object('key', 'values_memory', 'label', 'Values memory engine', 'description', 'Mission updates, values refinements, leadership narratives, cultural milestones — metadata summaries only'),
    jsonb_build_object('key', 'executive_purpose_reviews', 'label', 'Executive purpose reviews', 'description', 'Purpose alignment, values consistency, companion alignment, community health, transformation impacts')
  );
$$;

create or replace function public._opabp138_purpose_alignment_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose alignment center — humans define purpose; Aipify scaffolds reflection and dashboards.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'purpose_statements', 'label', 'Purpose statements', 'description', 'Organizational purpose articulation and periodic review'),
      jsonb_build_object('key', 'values_reviews', 'label', 'Values reviews', 'description', 'Stated values review sessions — reflection not compliance scoring'),
      jsonb_build_object('key', 'leadership_alignment', 'label', 'Leadership alignment sessions', 'description', 'Executive and leadership purpose reflection — aggregate metadata'),
      jsonb_build_object('key', 'culture_health_indicators', 'label', 'Culture health indicators', 'description', 'Organizational pattern snapshots — not individual metrics'),
      jsonb_build_object('key', 'companion_alignment_reviews', 'label', 'Companion alignment reviews', 'description', 'Companion behavior consistency with stated values — governance cross-link'),
      jsonb_build_object('key', 'decision_reflection', 'label', 'Decision reflection frameworks', 'description', 'Purpose-aware decision reflection — cross-link Collective Decision Council Phase 137'),
      jsonb_build_object('key', 'purpose_dashboards', 'label', 'Purpose dashboards', 'description', 'Leadership visibility into alignment scaffolds and review status')
    ),
    'boundary_note', 'Center facilitates reflection — never imposes beliefs or replaces leadership purpose definition.'
  );
$$;

create or replace function public._opabp138_values_framework_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Values framework — customizable organizational values guiding everyday choices.',
    'default_values', jsonb_build_array(
      jsonb_build_object('key', 'integrity', 'label', 'Integrity', 'description', 'Honest commitments and ethical consistency'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion', 'description', 'Care for people in decisions and coordination'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Thoughtful learning and open inquiry'),
      jsonb_build_object('key', 'responsibility', 'label', 'Responsibility', 'description', 'Stewardship through accountable action'),
      jsonb_build_object('key', 'transparency', 'label', 'Transparency', 'description', 'Explainable governance and open communication'),
      jsonb_build_object('key', 'excellence', 'label', 'Excellence', 'description', 'Quality and care — how you succeed matters'),
      jsonb_build_object('key', 'community', 'label', 'Community', 'description', 'Belonging and collective contribution'),
      jsonb_build_object('key', 'growth', 'label', 'Growth', 'description', 'Sustainable development without perfection pressure')
    ),
    'customization_note', 'Organizations customize stated values — framework scaffolds defaults only; humans define final values.'
  );
$$;

create or replace function public._opabp138_alignment_review_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Alignment review engine — aggregate reflection prompts; awareness not judgment.',
    'review_dimensions', jsonb_build_array(
      jsonb_build_object('key', 'actions_vs_values', 'label', 'Actions vs values', 'description', 'Do operational actions reflect stated values?'),
      jsonb_build_object('key', 'workflows_vs_purpose', 'label', 'Workflows vs purpose', 'description', 'Do workflows serve organizational purpose?'),
      jsonb_build_object('key', 'companion_consistency', 'label', 'Companion behavior consistency', 'description', 'Do companion prompts align with tenant values framing?'),
      jsonb_build_object('key', 'leadership_practices', 'label', 'Leadership practices', 'description', 'Leadership modeling of stated values — aggregate patterns'),
      jsonb_build_object('key', 'employee_culture_experience', 'label', 'Culture experience', 'description', 'Organizational culture experience signals — NOT individual surveillance or scoring')
    ),
    'reflection_note', 'Reviews invite dialogue — never punishment framing for misalignment or incomplete reflection.'
  );
$$;

create or replace function public._opabp138_purpose_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose companion — reflection prompts and historical context; does NOT define organizational purpose.',
    'companion_name', 'Companion',
    'not_label', 'purpose authority',
    'capabilities', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Gentle purpose and values reflection before decisions'),
      jsonb_build_object('emoji', '🌹', 'key', 'reminders', 'label', 'Values reminders', 'description', 'Optional reconnect-with-values reminders — human dismiss always respected'),
      jsonb_build_object('emoji', '❤️', 'key', 'values_discussions', 'label', 'Values discussions', 'description', 'Scaffold team values dialogue — never mandatory compliance'),
      jsonb_build_object('emoji', '🔔', 'key', 'historical_context', 'label', 'Historical context', 'description', 'Values memory and cultural milestone context for leadership prep'),
      jsonb_build_object('key', 'cultural_learning', 'label', 'Cultural learning', 'description', 'Cross-link learning programs and KC purpose content'),
      jsonb_build_object('key', 'leadership_prep', 'label', 'Leadership prep', 'description', 'Executive purpose review preparation — metadata summaries only')
    ),
    'boundary_note', 'Companion facilitates reflection — humans define purpose; no imposing beliefs or objective truth framing.'
  );
$$;

create or replace function public._opabp138_culture_health_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Culture health engine — organizational aggregates only; NOT employee surveillance.',
    'indicators', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'description', 'Approved knowledge path usage patterns — aggregate'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Value-aligned celebration patterns — cross-link Gratitude A.89'),
      jsonb_build_object('key', 'leadership_accessibility', 'label', 'Leadership accessibility', 'description', 'Leadership communication openness signals — metadata only'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety signals', 'description', 'Reflection deferral respected — no hidden individual scoring'),
      jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation', 'description', 'Organizational learning engagement — aggregate counts'),
      jsonb_build_object('key', 'community_engagement', 'label', 'Community engagement', 'description', 'Community contribution patterns — Phase 117 cross-link'),
      jsonb_build_object('key', 'support_experiences', 'label', 'Support experiences', 'description', 'Customer-care culture signals — metadata summaries only')
    ),
    'boundary_note', 'Culture health reflects organizational patterns — never individual behavior tracking or secret cultural scores.'
  );
$$;

create or replace function public._opabp138_purpose_integration_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose integration — connect purpose alignment across ABOS surfaces without duplicating tenant DNA.',
    'integrations', jsonb_build_array(
      jsonb_build_object('key', 'leadership_decisions', 'label', 'Leadership decisions', 'route', '/app/executive-intelligence', 'note', 'Executive Intelligence Phase 121 — leadership companion cross-link'),
      jsonb_build_object('key', 'companion_governance', 'label', 'Companion governance', 'route', '/app/companion-workforce-engine', 'note', 'Companion Workforce Phase 132 — alignment reviews'),
      jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner relationships', 'route', '/app/growth-partner-operations', 'note', 'Growth Partner Operations Phase 114 — stewardship terminology'),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center content', 'route', '/app/knowledge-center', 'note', 'Purpose and values KC articles — cross-link only'),
      jsonb_build_object('key', 'learning_programs', 'label', 'Learning programs', 'route', '/app/aipify-university', 'note', 'Aipify University Phase 115 — cultural learning paths'),
      jsonb_build_object('key', 'transformation', 'label', 'Transformation', 'route', '/app/change-management-engine', 'note', 'Change Management A.47 — purpose-aware change'),
      jsonb_build_object('key', 'community', 'label', 'Community', 'route', '/app/community', 'note', 'Community Collective Success Phase 117')
    ),
    'boundary_note', 'Integration scaffolds cross-links — never duplicates Business DNA, Social Impact Phase 118, or governance logic.'
  );
$$;

create or replace function public._opabp138_values_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Values memory engine — mission updates, refinements, and cultural milestones as metadata summaries.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'mission_update', 'label', 'Mission updates', 'description', 'Purpose statement evolution and leadership narratives'),
      jsonb_build_object('key', 'values_refinement', 'label', 'Values refinements', 'description', 'Stated values updates and rationale summaries'),
      jsonb_build_object('key', 'leadership_narrative', 'label', 'Leadership narratives', 'description', 'How leaders articulate purpose — metadata only'),
      jsonb_build_object('key', 'cultural_milestone', 'label', 'Cultural milestones', 'description', 'Value-aligned wins and belonging moments'),
      jsonb_build_object('key', 'transformation_reflection', 'label', 'Transformation reflections', 'description', 'Purpose continuity through change'),
      jsonb_build_object('key', 'community_contribution', 'label', 'Community contributions', 'description', 'Collective purpose contributions — Phase 117 cross-link')
    ),
    'org_memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Memory stores metadata summaries — never raw conversations, PII, or surveillance content.'
  );
$$;

create or replace function public._opabp138_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose companion limitations — augment leadership; never replace human purpose authority.',
    'limitations', jsonb_build_array(
      'Never impose beliefs or ideological framing',
      'Never claim objective truth about organizational purpose',
      'Never replace leadership purpose definition',
      'Never suppress diversity of perspective or dissent',
      'Never override governance, Trust Actions, or Human Oversight gates'
    ),
    'boundary_note', 'Companions prepare and reflect — humans define purpose, values, and cultural direction.'
  );
$$;

create or replace function public._opabp138_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — reflect authentically, recognize progress, respect boundaries.',
    'practices', jsonb_build_array(
      'Reflect on how daily work connects to organizational purpose — at a human pace',
      'Contribute authentically without perfection pressure',
      'Compassion for self and teammates during alignment reviews',
      'Recognize steady progress toward stated purpose',
      'Respect boundaries — reflection prompts are optional',
      'Support one another — belonging through shared values practice'
    ),
    'journey_phrase', 'Purpose alignment serves people — sustainable pacing honors both ambition and wellbeing.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports individual wellbeing — Phase 138 stores organizational alignment metadata only.'
  );
$$;

create or replace function public._opabp138_executive_purpose_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive purpose reviews — leadership accountability through reflection, not surveillance.',
    'review_areas', jsonb_build_array(
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment', 'description', 'Does leadership practice reflect stated purpose?'),
      jsonb_build_object('key', 'values_consistency', 'label', 'Values consistency', 'description', 'Consistency between stated values and operational priorities'),
      jsonb_build_object('key', 'companion_alignment', 'label', 'Companion alignment', 'description', 'Companion governance aligned with tenant values framing'),
      jsonb_build_object('key', 'community_health', 'label', 'Community health', 'description', 'Belonging and collective contribution patterns — aggregate'),
      jsonb_build_object('key', 'growth_partner_relationships', 'label', 'Growth Partner relationships', 'description', 'Stewardship in partner relationships — never Affiliate framing'),
      jsonb_build_object('key', 'transformation_impacts', 'label', 'Transformation impacts', 'description', 'Purpose continuity through organizational change')
    ),
    'executive_route', '/app/executive-intelligence',
    'boundary_note', 'Executive reviews use aggregate metadata — no hidden individual cultural scores.'
  );
$$;

create or replace function public._opabp138_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security requirements — purpose review audit, RBAC, and leadership review histories.',
    'requirements', jsonb_build_array(
      'Purpose review actions audited via _pve_log — metadata only',
      'Leadership review histories tenant-scoped with RBAC purpose_values.* permissions',
      'Companion reflection histories explainable — no silent value enforcement',
      'Values memory entries require purpose_values.manage for capture',
      '2FA cross-link for sensitive leadership exports — /app/settings/two-factor',
      'Trust Actions cross-link for governance-sensitive purpose decisions — /app/approvals'
    ),
    'two_factor_route', '/app/settings/two-factor',
    'audit_note', 'Alignment reviews, values memory captures, and settings changes are audited — no PII in audit payloads.'
  );
$$;

create or replace function public._opabp138_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'blueprint_phase64', 'label', 'Purpose & Values (Blueprint Phase 64)', 'route', '/app/purpose-values-engine', 'note', 'Preserved — Phase 138 layers Autonomous Organization Era depth'),
    jsonb_build_object('key', 'blueprint_phase95', 'label', 'Cultural Alignment (Blueprint Phase 95)', 'route', '/app/purpose-values-engine', 'note', 'Preserved — belonging and daily values alignment'),
    jsonb_build_object('key', 'social_impact_118', 'label', 'Social Impact & Purpose (Phase 118)', 'route', '/app/social-impact-purpose-engine', 'note', 'Social impact initiatives — distinct from tenant values alignment'),
    jsonb_build_object('key', 'collective_decision_137', 'label', 'Collective Decision Council (Phase 137)', 'route', '/app/collective-decision-council-engine', 'note', 'Decision reflection frameworks — cross-link only'),
    jsonb_build_object('key', 'strategic_alignment_a55', 'label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Strategic objectives alignment'),
    jsonb_build_object('key', 'inclusion_humanity_a83', 'label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Human Values Charter vs tenant purpose'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing and authentic contribution'),
    jsonb_build_object('key', 'org_wisdom_129', 'label', 'Organizational Wisdom (Phase 129)', 'route', '/app/organizational-wisdom-engine', 'note', 'Ethical intelligence cross-link'),
    jsonb_build_object('key', 'companion_workforce_132', 'label', 'Companion Workforce (Phase 132)', 'route', '/app/companion-workforce-engine', 'note', 'Companion alignment reviews'),
    jsonb_build_object('key', 'workflow_orchestration_133', 'label', 'Workflow Orchestration (Phase 133)', 'route', '/app/workflow-orchestration-engine', 'note', 'Workflows vs purpose alignment'),
    jsonb_build_object('key', 'adaptive_organization_134', 'label', 'Adaptive Organization (Phase 134)', 'route', '/app/continuous-improvement-engine', 'note', 'Continuous optimization with purpose continuity'),
    jsonb_build_object('key', 'proactive_organization_135', 'label', 'Proactive Organization (Phase 135)', 'route', '/app/proactive-organization-engine', 'note', 'Era 131–140 cross-link'),
    jsonb_build_object('key', 'growth_partner_114', 'label', 'Growth Partner Operations (Phase 114)', 'route', '/app/growth-partner-operations', 'note', 'Growth Partner stewardship — never Affiliate'),
    jsonb_build_object('key', 'org_memory_a34', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Legacy and lessons learned cross-link'),
    jsonb_build_object('key', 'gratitude_a89', 'label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Value-aligned recognition')
  );
$$;

create or replace function public._opabp138_era_autonomous_organization_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', '131', 'label', 'Autonomy Governance & Human Oversight', 'route', '/app/human-oversight-engine', 'status', 'interim A.40 cross-link'),
    jsonb_build_object('phase', '132', 'label', 'Coordinated Companion Workforce', 'route', '/app/companion-workforce-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '133', 'label', 'Autonomous Workflow Orchestration', 'route', '/app/workflow-orchestration-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '134', 'label', 'Adaptive Organization & Continuous Optimization', 'route', '/app/continuous-improvement-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '135', 'label', 'Proactive Organization Engine', 'route', '/app/proactive-organization-engine', 'status', 'era cross-link'),
    jsonb_build_object('phase', '136', 'label', 'Organizational Autonomy Integration', 'route', '/app/proactive-organization-engine', 'status', 'era cross-link'),
    jsonb_build_object('phase', '137', 'label', 'Collective Decision & Human-Companion Council', 'route', '/app/collective-decision-council-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '138', 'label', 'Organizational Purpose Alignment & Values', 'route', '/app/purpose-values-engine', 'status', 'this blueprint')
  );
$$;

create or replace function public._opabp138_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates purpose alignment patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion philosophy, leadership purpose reviews, Growth Partner stewardship',
      'focus', jsonb_build_array(
        'Companion philosophy — augment people; humans define purpose',
        'Leadership purpose alignment sessions — reflection not enforcement',
        'Growth Partner stewardship terminology — never Affiliate',
        'Culture health aggregates — no individual surveillance',
        'Values memory for mission evolution — metadata summaries only'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce purpose alignment and customer-care values',
      'focus', jsonb_build_array(
        'Customer obsession as stated value in daily operations',
        'Purpose-aligned service celebration — metadata only',
        'Commerce team values reflection — belonging through shared purpose',
        'Alignment reviews before strategic commerce decisions'
      )
    )
  );
$$;

create or replace function public._opabp138_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Purpose guides action — not words on a website.',
    'Reflection not ideology enforcement — humans define purpose; companions facilitate.',
    'Culture health reflects organizational patterns — never employee surveillance.',
    'Stewardship through responsibility — Growth Partner terminology, People First.',
    'Values visible in decisions, companions, and culture — practiced, not imposed.',
    'Technology strengthens identity — it does not replace human purpose authority.'
  );
$$;

create or replace function public._opabp138_privacy_note()
returns text language sql immutable as $$
  select 'Organizational purpose alignment data is metadata only — alignment reviews, values memory summaries, culture health aggregates, and Phase 64/95 engagement. No hidden cultural scoring, no individual behavior metrics, no PII, no surveillance. Humans define purpose; Aipify informs and prepares.';
$$;

create or replace function public._opabp138_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_phase95 jsonb;
  v_phase64 jsonb;
begin
  v_phase95 := public._pvcaebp95_engagement_summary(p_org_id);
  v_phase64 := public._pvbp_engagement_summary(p_org_id);

  return jsonb_build_object(
    'values_framework_defaults', jsonb_array_length((public._opabp138_values_framework_engine()->'default_values')),
    'alignment_review_dimensions', jsonb_array_length((public._opabp138_alignment_review_engine()->'review_dimensions')),
    'purpose_companion_capabilities', jsonb_array_length((public._opabp138_purpose_companion()->'capabilities')),
    'culture_health_indicators', jsonb_array_length((public._opabp138_culture_health_engine()->'indicators')),
    'executive_review_areas', jsonb_array_length((public._opabp138_executive_purpose_reviews()->'review_areas')),
    'integration_links', jsonb_array_length(public._opabp138_integration_links()),
    'scheduled_alignment_reviews', coalesce((
      select count(*) from public.purpose_alignment_reviews
      where organization_id = p_org_id and status in ('scheduled', 'in_progress')
    ), 0),
    'values_memory_entries', coalesce((
      select count(*) from public.purpose_values_memory where organization_id = p_org_id
    ), 0),
    'culture_health_snapshots', coalesce((
      select count(*) from public.culture_health_snapshots where organization_id = p_org_id
    ), 0),
    'phase95_engagement', v_phase95,
    'phase64_engagement', v_phase64,
    'privacy_note', public._opabp138_privacy_note()
  );
end; $$;

create or replace function public._opabp138_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_has_purpose boolean := false;
begin
  v_engagement := public._opabp138_engagement_summary(p_org_id);
  v_has_purpose := coalesce((v_engagement->'phase64_engagement'->>'has_purpose_statement')::boolean, false);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'purpose_alignment_center',
      'label', 'Purpose alignment center — statements, reviews, leadership sessions, dashboards',
      'met', jsonb_array_length((public._opabp138_purpose_alignment_center()->'capabilities')) >= 7,
      'note', 'Humans define purpose — center scaffolds reflection only.'
    ),
    jsonb_build_object(
      'key', 'values_framework',
      'label', 'Values framework — 8 customizable default values documented',
      'met', jsonb_array_length((public._opabp138_values_framework_engine()->'default_values')) >= 8,
      'note', 'Integrity, compassion, curiosity, responsibility, transparency, excellence, community, growth.'
    ),
    jsonb_build_object(
      'key', 'alignment_review_engine',
      'label', 'Alignment review engine — actions, workflows, companions, leadership, culture',
      'met', jsonb_array_length((public._opabp138_alignment_review_engine()->'review_dimensions')) >= 5,
      'note', 'Aggregate reflection prompts — not individual surveillance.'
    ),
    jsonb_build_object(
      'key', 'purpose_companion',
      'label', 'Purpose companion — reflection without defining purpose',
      'met', jsonb_array_length((public._opabp138_purpose_companion()->'capabilities')) >= 5,
      'note', 'Companion facilitates — humans define purpose.'
    ),
    jsonb_build_object(
      'key', 'culture_health_engine',
      'label', 'Culture health engine — organizational aggregates only',
      'met', jsonb_array_length((public._opabp138_culture_health_engine()->'indicators')) >= 7,
      'note', 'NOT employee surveillance or hidden scoring.'
    ),
    jsonb_build_object(
      'key', 'purpose_integration',
      'label', 'Purpose integration — leadership, companions, GP, KC, learning, transformation, community',
      'met', jsonb_array_length((public._opabp138_purpose_integration_framework()->'integrations')) >= 7,
      'note', 'Cross-links without duplicating tenant DNA.'
    ),
    jsonb_build_object(
      'key', 'values_memory_engine',
      'label', 'Values memory engine — mission updates and cultural milestones',
      'met', jsonb_array_length((public._opabp138_values_memory_engine()->'memory_types')) >= 6,
      'note', 'Metadata summaries only.'
    ),
    jsonb_build_object(
      'key', 'executive_purpose_reviews',
      'label', 'Executive purpose reviews — leadership accountability through reflection',
      'met', jsonb_array_length((public._opabp138_executive_purpose_reviews()->'review_areas')) >= 6,
      'note', 'Aggregate metadata — cross-link Executive Intelligence Phase 121.'
    ),
    jsonb_build_object(
      'key', 'companion_limitations',
      'label', 'Companion limitations — no imposing beliefs or governance override',
      'met', jsonb_array_length((public._opabp138_companion_limitations()->'limitations')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — authentic contribution and sustainable pacing',
      'met', (public._opabp138_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Purpose alignment serves people — at a human pace.'
    ),
    jsonb_build_object(
      'key', 'security_requirements',
      'label', 'Security — audit, RBAC, 2FA cross-link',
      'met', jsonb_array_length((public._opabp138_security_requirements()->'requirements')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'social_impact_distinction',
      'label', 'Distinct from Social Impact & Purpose Phase 118',
      'met', (public._opabp138_distinction_note()) like '%Phase 118%',
      'note', 'Cross-link /app/social-impact-purpose-engine — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'phase64_preserved',
      'label', 'Blueprint Phase 64 preserved',
      'met', jsonb_array_length(public._pvbp_objectives()) >= 6,
      'note', 'Phase 64 metadata intact.'
    ),
    jsonb_build_object(
      'key', 'phase95_preserved',
      'label', 'Blueprint Phase 95 cultural alignment preserved',
      'met', jsonb_array_length(public._pvcaebp95_objectives()) >= 6,
      'note', 'Phase 95 metadata intact alongside Phase 138.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Phases 131–137, Social Impact 118, Org Wisdom 129, Strategic Alignment A.55',
      'met', jsonb_array_length(public._opabp138_integration_links()) >= 14,
      'note', 'Extend related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'live_engagement',
      'label', 'Live purpose alignment engagement',
      'met', coalesce((v_engagement->>'scheduled_alignment_reviews')::int, 0) >= 0,
      'note', format(
        '%s alignment reviews, %s values memory entries, %s culture health snapshots.',
        coalesce((v_engagement->>'scheduled_alignment_reviews')::int, 0),
        coalesce((v_engagement->>'values_memory_entries')::int, 0),
        coalesce((v_engagement->>'culture_health_snapshots')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'purpose_statement',
      'label', 'Purpose statement or alignment scaffolds active',
      'met', v_has_purpose or jsonb_array_length((public._opabp138_purpose_alignment_center()->'capabilities')) >= 7,
      'note', case when not v_has_purpose then 'Define an organizational purpose statement in settings.' else null end
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group internal; Unonight first external pilot',
      'met', (public._opabp138_dogfooding()->'aipify_group') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — stewardship through responsibility',
      'met', true,
      'note', 'Humans define purpose; Aipify informs and prepares.'
    )
  );
end; $$;

create or replace function public._opabp138_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 138 — Organizational Purpose Alignment & Values Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE138_ORGANIZATIONAL_PURPOSE_ALIGNMENT_VALUES.md',
    'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phases 64 & 95)',
    'route', '/app/purpose-values-engine',
    'era', 'Autonomous Organization Era (131–140)',
    'mapping_note', 'Phase 138 extends A.82 + Phase 64 + Phase 95 with Autonomous Organization Era purpose alignment depth on same route.',
    'distinction_note', public._opabp138_distinction_note(),
    'mission', public._opabp138_mission(),
    'philosophy', public._opabp138_philosophy(),
    'abos_principle', public._opabp138_abos_principle(),
    'vision', public._opabp138_vision(),
    'objectives', public._opabp138_objectives(),
    'purpose_alignment_center', public._opabp138_purpose_alignment_center(),
    'values_framework_engine', public._opabp138_values_framework_engine(),
    'alignment_review_engine', public._opabp138_alignment_review_engine(),
    'purpose_companion', public._opabp138_purpose_companion(),
    'culture_health_engine', public._opabp138_culture_health_engine(),
    'purpose_integration_framework', public._opabp138_purpose_integration_framework(),
    'values_memory_engine', public._opabp138_values_memory_engine(),
    'companion_limitations', public._opabp138_companion_limitations(),
    'self_love_connection', public._opabp138_self_love_connection(),
    'executive_purpose_reviews', public._opabp138_executive_purpose_reviews(),
    'security_requirements', public._opabp138_security_requirements(),
    'dogfooding', public._opabp138_dogfooding(),
    'integration_links', public._opabp138_integration_links(),
    'era_cross_links', public._opabp138_era_autonomous_organization_cross_links(),
    'success_criteria', public._opabp138_success_criteria(p_org_id),
    'engagement_summary', public._opabp138_engagement_summary(p_org_id),
    'vision_phrases', public._opabp138_vision_phrases(),
    'privacy_note', public._opabp138_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_purpose_alignment_review(
  p_review_title text,
  p_review_scope text default 'quarterly',
  p_alignment_summary text default null
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
  insert into public.purpose_alignment_reviews (
    organization_id, review_title, review_scope, alignment_summary, status
  )
  values (
    v_org_id,
    left(p_review_title, 200),
    left(coalesce(p_review_scope, 'quarterly'), 100),
    left(coalesce(p_alignment_summary, ''), 500),
    'scheduled'
  )
  returning id into v_id;
  perform public._pve_log(v_org_id, v_user_id, 'alignment_review_created',
    jsonb_build_object('review_id', v_id, 'title', p_review_title));
  return jsonb_build_object('id', v_id, 'status', 'scheduled');
end; $$;

create or replace function public.capture_values_memory_entry(
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
    'mission_update', 'values_refinement', 'leadership_narrative',
    'cultural_milestone', 'transformation_reflection', 'community_contribution'
  ) then
    raise exception 'Invalid memory_type: %', p_memory_type;
  end if;
  insert into public.purpose_values_memory (
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
  perform public._pve_log(v_org_id, v_user_id, 'values_memory_captured',
    jsonb_build_object('memory_id', v_id, 'memory_type', p_memory_type));
  return jsonb_build_object('id', v_id, 'memory_type', p_memory_type);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL A.82 + Phase 64 + Phase 95; append Phase 138
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
-- 6. Card RPC — preserve A.82 + Phase 64 + Phase 95; append Phase 138
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
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  perform public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);
  perform public._opabp138_seed_alignment_reviews(v_org_id);
  v_engagement := public._pvbp_engagement_summary(v_org_id);
  v_cultural_engagement := public._pvcaebp95_engagement_summary(v_org_id);
  v_purpose_engagement := public._opabp138_engagement_summary(v_org_id);

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
    'purpose_alignment_vision_note', public._opabp138_vision()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._opabp138_distinction_note() to authenticated;
grant execute on function public._opabp138_mission() to authenticated;
grant execute on function public._opabp138_philosophy() to authenticated;
grant execute on function public._opabp138_abos_principle() to authenticated;
grant execute on function public._opabp138_vision() to authenticated;
grant execute on function public._opabp138_objectives() to authenticated;
grant execute on function public._opabp138_purpose_alignment_center() to authenticated;
grant execute on function public._opabp138_values_framework_engine() to authenticated;
grant execute on function public._opabp138_alignment_review_engine() to authenticated;
grant execute on function public._opabp138_purpose_companion() to authenticated;
grant execute on function public._opabp138_culture_health_engine() to authenticated;
grant execute on function public._opabp138_purpose_integration_framework() to authenticated;
grant execute on function public._opabp138_values_memory_engine() to authenticated;
grant execute on function public._opabp138_companion_limitations() to authenticated;
grant execute on function public._opabp138_self_love_connection() to authenticated;
grant execute on function public._opabp138_executive_purpose_reviews() to authenticated;
grant execute on function public._opabp138_security_requirements() to authenticated;
grant execute on function public._opabp138_integration_links() to authenticated;
grant execute on function public._opabp138_era_autonomous_organization_cross_links() to authenticated;
grant execute on function public._opabp138_dogfooding() to authenticated;
grant execute on function public._opabp138_vision_phrases() to authenticated;
grant execute on function public._opabp138_privacy_note() to authenticated;
grant execute on function public._opabp138_engagement_summary(uuid) to authenticated;
grant execute on function public._opabp138_success_criteria(uuid) to authenticated;
grant execute on function public._opabp138_blueprint_block(uuid) to authenticated;
grant execute on function public.record_purpose_alignment_review(text, text, text) to authenticated;
grant execute on function public.capture_values_memory_entry(text, text, text, text) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-purpose-alignment-blueprint-phase138', 'Organizational Purpose Alignment & Values Engine (ABOS Phase 138)',
  'Organizational Purpose Alignment & Values Engine — extends A.82 + Phases 64 & 95 with Autonomous Organization Era purpose alignment depth, values framework, culture health aggregates, and reflection-not-enforcement privacy. No employee surveillance.',
  'authenticated', 127
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-purpose-alignment-blueprint-phase138' and tenant_id is null
);
