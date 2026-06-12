-- Implementation Blueprint Phase 157 — Organizational Wisdom Council & Ethical Foresight Engine
-- Legacy & Future Stewardship Era (151–160). Extends Organizational Wisdom & Ethical Intelligence Phase 129.
-- Helpers: _owcebp157_* (never collide with _owebp129_*, _owis_*).
-- Cross-links Collective Decision Council Phase 137, Wisdom A.93, AI Ethics A.46, Decision Heritage 153,
-- Purpose Renewal 156, Renewal 155, Legacy era 151–154, Board Governance 123, Strategic Foresight 122 — do NOT duplicate.

-- ---------------------------------------------------------------------------
-- 1. Optional tables (tenant-scoped metadata scaffolds — extend Phase 129)
-- ---------------------------------------------------------------------------
create table if not exists public.wisdom_council_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'wisdom_review', 'stakeholder_reflection', 'leadership_dialogue',
      'future_impact', 'executive_preparation', 'council_session'
    )
  ),
  title text not null,
  reflection_summary text check (reflection_summary is null or char_length(reflection_summary) <= 500),
  stakeholder_summary text check (stakeholder_summary is null or char_length(stakeholder_summary) <= 500),
  foresight_summary text check (foresight_summary is null or char_length(foresight_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'active', 'review', 'archived')),
  cross_link_route text,
  metadata jsonb not null default '{"metadata_only":true,"not_ethical_authority":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists wisdom_council_reviews_tenant_idx
  on public.wisdom_council_reviews (tenant_id, review_type, status);

alter table public.wisdom_council_reviews enable row level security;
revoke all on public.wisdom_council_reviews from authenticated, anon;

create table if not exists public.ethical_foresight_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'foresight_workshop' check (
    session_type in ('foresight_workshop', 'ethical_exploration', 'future_impact_review', 'assumption_challenge')
  ),
  title text not null,
  who_benefits_summary text check (who_benefits_summary is null or char_length(who_benefits_summary) <= 500),
  unintended_harm_summary text check (unintended_harm_summary is null or char_length(unintended_harm_summary) <= 500),
  assumptions_summary text check (assumptions_summary is null or char_length(assumptions_summary) <= 500),
  future_generations_summary text check (future_generations_summary is null or char_length(future_generations_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'active', 'review', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"should_we_not_just_can_we":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, session_key)
);

create index if not exists ethical_foresight_sessions_tenant_idx
  on public.ethical_foresight_sessions (tenant_id, session_type, status);

alter table public.ethical_foresight_sessions enable row level security;
revoke all on public.ethical_foresight_sessions from authenticated, anon;

create table if not exists public.wisdom_memory_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_key text not null,
  entry_type text not null check (
    entry_type in (
      'leadership_reflection', 'ethical_discussion', 'governance_narrative',
      'transformation_lesson', 'decision_history', 'stakeholder_experience'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  cross_link_route text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, entry_key)
);

create index if not exists wisdom_memory_entries_tenant_idx
  on public.wisdom_memory_entries (tenant_id, entry_type, status);

alter table public.wisdom_memory_entries enable row level security;
revoke all on public.wisdom_memory_entries from authenticated, anon;

create table if not exists public.stakeholder_awareness_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  stakeholder_group text not null check (
    stakeholder_group in (
      'employees', 'customers', 'growth_partners', 'communities',
      'knowledge_contributors', 'future_leaders', 'society'
    )
  ),
  title text not null,
  theme_summary text not null check (char_length(theme_summary) <= 500),
  signal_strength text not null default 'moderate' check (signal_strength in ('low', 'moderate', 'high')),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{"metadata_only":true,"awareness_not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);

create index if not exists stakeholder_awareness_snapshots_tenant_idx
  on public.stakeholder_awareness_snapshots (tenant_id, stakeholder_group, status);

alter table public.stakeholder_awareness_snapshots enable row level security;
revoke all on public.stakeholder_awareness_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helper
-- ---------------------------------------------------------------------------
create or replace function public._owcebp157_seed(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.wisdom_council_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.wisdom_council_reviews (
    tenant_id, review_key, review_type, title, reflection_summary, stakeholder_summary,
    foresight_summary, status, cross_link_route
  ) values
    (p_tenant_id, 'quarterly-wisdom-council', 'wisdom_review', 'Quarterly wisdom council review',
     'Should we pursue this expansion — not just can we?', 'Employees · customers · communities — awareness themes only.',
     'Long-term trust and intergenerational stewardship.', 'active', '/app/purpose-values-engine'),
    (p_tenant_id, 'leadership-dialogue-q2', 'leadership_dialogue', 'Leadership dialogue framework session',
     'Values guiding major operational choices this quarter.', 'Future leaders and knowledge contributors perspectives.',
     'Future impact review scaffold — cross-link Strategic Foresight Phase 122.', 'draft', '/app/strategic-foresight-engine');

  insert into public.ethical_foresight_sessions (
    tenant_id, session_key, session_type, title,
    who_benefits_summary, unintended_harm_summary, assumptions_summary, future_generations_summary, status
  ) values
    (p_tenant_id, 'companion-expansion-foresight', 'foresight_workshop', 'Companion expansion foresight workshop',
     'Customers may gain faster support · employees may gain efficiency tools.', 'Change fatigue and uneven adoption possible.',
     'Voluntary adoption with adequate support.', 'Next-generation workforce inherits companion governance culture.', 'active'),
    (p_tenant_id, 'automation-dignity-review', 'ethical_exploration', 'Automation and dignity exploration',
     'Operational efficiency gains for teams and customers.', 'Roles displaced without transition support.',
     'Automation always preserves human dignity.', 'Cultural consequences of speed-over-reflection.', 'review');

  insert into public.wisdom_memory_entries (
    tenant_id, entry_key, entry_type, title, summary, status, cross_link_route
  ) values
    (p_tenant_id, 'transformation-2024', 'transformation_lesson', '2024 transformation reflection',
     'Metadata summary — change with humility preserved institutional trust.', 'active', '/app/change-management-engine'),
    (p_tenant_id, 'decision-heritage-q1', 'decision_history', 'Q1 decision heritage note',
     'Decision rationale themes — cross-link Decision Heritage Phase 153.', 'active', '/app/decision-intelligence-engine'),
    (p_tenant_id, 'governance-narrative-board', 'governance_narrative', 'Board governance narrative scaffold',
     'Governance transparency themes — cross-link Phase 123.', 'active', '/app/governance-policy-engine');

  insert into public.stakeholder_awareness_snapshots (
    tenant_id, snapshot_key, stakeholder_group, title, theme_summary, signal_strength, status
  ) values
    (p_tenant_id, 'employees-q2', 'employees', 'Q2 employee consideration themes',
     'Aggregate awareness themes — workforce perspective, not individual surveillance.', 'moderate', 'active'),
    (p_tenant_id, 'future-leaders-q2', 'future_leaders', 'Q2 future leaders awareness',
     'Intergenerational leadership themes — cross-link Phase 151.', 'moderate', 'active'),
    (p_tenant_id, 'society-q2', 'society', 'Q2 societal consideration themes',
     'Broader societal impact awareness — stewardship not surveillance.', 'low', 'active');
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint metadata helpers (_owcebp157_*)
-- ---------------------------------------------------------------------------
create or replace function public._owcebp157_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 157 — Organizational Wisdom Council & Ethical Foresight at /app/organizational-wisdom-engine. Extends Phase 129 Organizational Wisdom & Ethical Intelligence (_owebp129_*) — Legacy & Future Stewardship Era (151–160). **NOT ethical authority** — expands perspective, does NOT determine morality. Distinct from Collective Decision Council Phase 137 at /app/collective-decision-council-engine (decision council — cross-link only, never duplicate _cdcc_*); Wisdom Engine A.93 at /app/wisdom-engine (cross-link only); AI Ethics A.46 + Phase 54 at /app/ai-ethics-responsible-use-engine (cross-link only); Decision Heritage Phase 153 at /app/decision-intelligence-engine; Purpose Renewal Phase 156 at /app/purpose-values-engine; Renewal Phase 155 at /app/change-management-engine; Board Governance Phase 123 at /app/governance-policy-engine; Strategic Foresight Phase 122 at /app/strategic-foresight-engine. Helpers _owcebp157_* only — never collide with _owebp129_*, _owis_*. Should we do this — not just can we. Wisdom before speed.';
$$;

create or replace function public._owcebp157_mission()
returns text language sql immutable as $$
  select 'Cultivate organizational wisdom before irreversible decisions — expand perspective through wisdom council reviews, ethical foresight workshops, and stakeholder awareness without replacing leadership or becoming ethical authority.';
$$;

create or replace function public._owcebp157_philosophy()
returns text language sql immutable as $$
  select 'Wisdom before speed. Growth Partner not Affiliate. People First. Stewardship through responsibility. Wisdom Companion supports awareness — does NOT impose ideology, determine right/wrong, override executive authority, replace governance, or suppress alternative viewpoints. Metadata only.';
$$;

create or replace function public._owcebp157_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Wisdom Council & Ethical Foresight extends Phase 129 Wisdom Center with council reviews, foresight workshops, and wisdom memory — perspective expansion not moral verdicts; humans decide.';
$$;

create or replace function public._owcebp157_vision()
returns text language sql immutable as $$
  select 'Organizations should pause wisely before irreversible choices — cultivating foresight, honoring stakeholders, and shaping futures worthy of trust across generations.';
$$;

create or replace function public._owcebp157_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'wisdom_council_reviews', 'emoji', '🦉', 'label', 'Wisdom council reviews', 'description', 'Structured wisdom review sessions — should we, not just can we'),
    jsonb_build_object('key', 'ethical_foresight', 'emoji', '🌹', 'label', 'Ethical foresight workshops', 'description', 'Foresight workshops exploring unintended harm and future generations'),
    jsonb_build_object('key', 'stakeholder_awareness', 'emoji', '🔔', 'label', 'Stakeholder awareness', 'description', 'Seven stakeholder consideration themes — awareness NOT surveillance'),
    jsonb_build_object('key', 'executive_wisdom', 'emoji', '🦉', 'label', 'Executive wisdom reviews', 'description', 'Trade-offs, values, unexplored risks — humans decide'),
    jsonb_build_object('key', 'wisdom_memory', 'emoji', '🌹', 'label', 'Wisdom memory', 'description', 'Leadership reflections and ethical discussion metadata — cross-link Phase 153'),
    jsonb_build_object('key', 'ethical_innovation', 'emoji', '🔔', 'label', 'Ethical innovation balance', 'description', 'Innovation vs stewardship · efficiency vs humanity tensions'),
    jsonb_build_object('key', 'future_consequences', 'emoji', '🦉', 'label', 'Future consequence framing', 'description', 'Short and long-term implications — cross-link Strategic Foresight 122'),
    jsonb_build_object('key', 'perspective_expansion', 'emoji', '🌹', 'label', 'Perspective expansion', 'description', 'Wisdom Companion expands thinking — never moral authority')
  );
$$;

create or replace function public._owcebp157_wisdom_council_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Council Center — eight capabilities extending Phase 129 Wisdom Center.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'wisdom_reviews', 'label', 'Wisdom reviews', 'description', 'Council wisdom review session scaffolds — metadata only'),
      jsonb_build_object('key', 'stakeholder_reflection_sessions', 'label', 'Stakeholder reflection sessions', 'description', 'Multi-stakeholder reflection — roles not individuals'),
      jsonb_build_object('key', 'ethical_foresight_workshops', 'label', 'Ethical foresight workshops', 'description', 'Workshop records exploring consequences and assumptions'),
      jsonb_build_object('key', 'leadership_dialogue_frameworks', 'label', 'Leadership dialogue frameworks', 'description', 'Structured leadership dialogue scaffolds'),
      jsonb_build_object('key', 'future_impact_reviews', 'label', 'Future impact reviews', 'description', 'Future shaping reviews — cross-link Strategic Foresight 122'),
      jsonb_build_object('key', 'companion_reflection_support', 'label', 'Companion reflection support', 'description', 'Wisdom Companion reflection prompts — no verdicts'),
      jsonb_build_object('key', 'executive_preparation_programs', 'label', 'Executive preparation programs', 'description', 'Executive wisdom preparation scaffolds'),
      jsonb_build_object('key', 'wisdom_dashboards', 'label', 'Wisdom dashboards', 'description', 'Council and foresight visibility — aggregate metadata')
    )
  );
$$;

create or replace function public._owcebp157_ethical_foresight_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ethical foresight engine — five reflection questions. Aipify does NOT determine morality.',
    'questions', jsonb_build_array(
      jsonb_build_object('key', 'who_benefits', 'label', 'Who benefits?', 'description', 'Stakeholder groups that may gain — roles not individuals'),
      jsonb_build_object('key', 'unintended_harm', 'label', 'What unintended harm might emerge?', 'description', 'Second-order and hidden impacts worth exploring'),
      jsonb_build_object('key', 'assumptions', 'label', 'What assumptions shape our thinking?', 'description', 'Visible hypotheses worth challenging before acting'),
      jsonb_build_object('key', 'responsibilities_of_opportunity', 'label', 'What are the responsibilities of this opportunity?', 'description', 'Stewardship obligations when capability exists'),
      jsonb_build_object('key', 'future_generations', 'label', 'How might future generations view this?', 'description', 'Intergenerational and long-term perspective')
    )
  );
$$;

create or replace function public._owcebp157_stakeholder_awareness_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stakeholder awareness framework — seven groups. Awareness NOT surveillance.',
    'stakeholders', jsonb_build_array(
      jsonb_build_object('key', 'employees', 'label', 'Employees', 'description', 'Workforce consideration themes — aggregate only'),
      jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Customer trust and experience awareness'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'Partner ecosystem perspective — Growth Partner not Affiliate'),
      jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'Community impact awareness — cross-link Inclusion A.83'),
      jsonb_build_object('key', 'knowledge_contributors', 'label', 'Knowledge contributors', 'description', 'KC and wisdom contributors — cross-link Org Memory'),
      jsonb_build_object('key', 'future_leaders', 'label', 'Future leaders', 'description', 'Next-generation perspective — cross-link Phase 151'),
      jsonb_build_object('key', 'society', 'label', 'Society', 'description', 'Broader societal consideration themes')
    ),
    'boundary_note', 'Stakeholder snapshots store anonymized aggregate awareness themes only — never individual surveillance or performance evaluation.'
  );
$$;

create or replace function public._owcebp157_executive_wisdom_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive wisdom reviews — five reflection dimensions. Humans retain authority.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'optimizing_for_what', 'label', 'What are we optimizing for?', 'description', 'Clarify true objectives beyond immediate metrics'),
      jsonb_build_object('key', 'trade_offs', 'label', 'What trade-offs are we accepting?', 'description', 'Visible costs and compromises worth naming'),
      jsonb_build_object('key', 'values_guiding', 'label', 'What values guide this decision?', 'description', 'Cross-link Purpose Renewal Phase 156'),
      jsonb_build_object('key', 'unexplored_risks', 'label', 'What risks remain unexplored?', 'description', 'Humility about unknowns before irreversible action'),
      jsonb_build_object('key', 'future_shaping', 'label', 'How does this shape the future?', 'description', 'Long-term institutional and cultural consequences')
    )
  );
$$;

create or replace function public._owcebp157_wisdom_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Companion — six supports. Perspective expansion — does NOT define morality.',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'perspective_expansion', 'label', 'Perspective expansion', 'description', 'Broaden viewpoints before significant choices'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Gentle questions for pause and consideration'),
      jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery', 'description', 'KC and wisdom memory connections'),
      jsonb_build_object('key', 'stakeholder_mapping', 'label', 'Stakeholder mapping', 'description', 'Seven-group awareness scaffold — not surveillance'),
      jsonb_build_object('key', 'scenario_exploration', 'label', 'Scenario exploration', 'description', 'Future consequence scenarios — cross-link Foresight 122'),
      jsonb_build_object('key', 'executive_preparation', 'label', 'Executive preparation', 'description', 'Wisdom review preparation for leadership')
    )
  );
$$;

create or replace function public._owcebp157_ethical_innovation_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ethical innovation engine — five stewardship tensions to explore.',
    'tensions', jsonb_build_array(
      jsonb_build_object('key', 'innovation_vs_stewardship', 'label', 'Innovation vs stewardship', 'description', 'Bold progress with responsible guardrails'),
      jsonb_build_object('key', 'growth_vs_responsibility', 'label', 'Growth vs responsibility', 'description', 'Scale without abandoning values'),
      jsonb_build_object('key', 'efficiency_vs_humanity', 'label', 'Efficiency vs humanity', 'description', 'Operational speed with human dignity preserved'),
      jsonb_build_object('key', 'automation_vs_dignity', 'label', 'Automation vs dignity', 'description', 'Technology that augments rather than diminishes'),
      jsonb_build_object('key', 'speed_vs_reflection', 'label', 'Speed vs reflection', 'description', 'Wisdom before speed — pause before irreversible choices')
    )
  );
$$;

create or replace function public._owcebp157_future_consequence_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future consequence framework — six dimensions. Cross-link Strategic Foresight Phase 122.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'short_term_outcomes', 'label', 'Short-term outcomes', 'description', 'Immediate operational and financial effects'),
      jsonb_build_object('key', 'long_term_implications', 'label', 'Long-term implications', 'description', 'Institutional trajectory over years'),
      jsonb_build_object('key', 'intergenerational_effects', 'label', 'Intergenerational effects', 'description', 'Impact on future leaders and next generations'),
      jsonb_build_object('key', 'cultural_consequences', 'label', 'Cultural consequences', 'description', 'How choices shape organizational culture'),
      jsonb_build_object('key', 'operational_dependencies', 'label', 'Operational dependencies', 'description', 'Systems and processes that inherit the decision'),
      jsonb_build_object('key', 'governance_responsibilities', 'label', 'Governance responsibilities', 'description', 'Board and policy accountability — cross-link Phase 123')
    ),
    'cross_link_route', '/app/strategic-foresight-engine'
  );
$$;

create or replace function public._owcebp157_wisdom_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom memory engine — six metadata record types.',
    'record_types', jsonb_build_array(
      jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflections', 'description', 'Executive and leadership reflection metadata'),
      jsonb_build_object('key', 'ethical_discussion', 'label', 'Ethical discussions', 'description', 'Council and workshop discussion summaries'),
      jsonb_build_object('key', 'governance_narrative', 'label', 'Governance narratives', 'description', 'Board and policy context — cross-link Phase 123'),
      jsonb_build_object('key', 'transformation_lesson', 'label', 'Transformation lessons', 'description', 'Change and renewal lessons — cross-link Phase 155'),
      jsonb_build_object('key', 'decision_history', 'label', 'Decision histories', 'description', 'Decision heritage metadata — cross-link Phase 153'),
      jsonb_build_object('key', 'stakeholder_experience', 'label', 'Stakeholder experiences', 'description', 'Aggregate stakeholder theme records — not surveillance')
    )
  );
$$;

create or replace function public._owcebp157_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Companion limitations — five never.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'no_impose_ideology', 'label', 'No imposing ideology', 'description', 'Aipify never imposes organizational or political ideology'),
      jsonb_build_object('key', 'no_determine_morality', 'label', 'No determining right/wrong', 'description', 'Reflection supports — humans retain moral agency'),
      jsonb_build_object('key', 'no_override_authority', 'label', 'No overriding executive authority', 'description', 'Perspective expansion never overrides leadership decisions'),
      jsonb_build_object('key', 'no_replace_governance', 'label', 'No replacing governance', 'description', 'Cross-link Phase 123 — governance bodies decide policy'),
      jsonb_build_object('key', 'no_suppress_viewpoints', 'label', 'No suppressing viewpoints', 'description', 'Alternative perspectives welcomed — never silenced')
    )
  );
$$;

create or replace function public._owcebp157_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in wisdom council — humility and compassion in foresight.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'humility', 'label', 'Humility', 'description', 'Acknowledge limits of certainty before acting'),
      jsonb_build_object('key', 'empathy', 'label', 'Empathy', 'description', 'Consider stakeholder experiences with care'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Pause before irreversible choices'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion', 'description', 'No shame for imperfect past choices'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Explore assumptions without judgment'),
      jsonb_build_object('key', 'respect', 'label', 'Respect', 'description', 'Honor dissenting viewpoints in council dialogue')
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Wisdom council reflection includes self-compassion — never shame-based motivation.'
  );
$$;

create or replace function public._owcebp157_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security requirements for wisdom council and foresight metadata.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'wisdom_review_audit', 'label', 'Wisdom review audit logs', 'description', 'All council review actions logged in organizational_wisdom_audit_logs'),
      jsonb_build_object('key', 'executive_reflection_history', 'label', 'Executive reflection histories', 'description', 'Reflection metadata with RBAC — owner/admin manage'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control', 'description', 'organizational_wisdom.view and organizational_wisdom.manage permissions'),
      jsonb_build_object('key', 'governance_documentation', 'label', 'Governance documentation controls', 'description', 'Cross-link Phase 123 governance register'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', '2FA expected for wisdom council management actions')
    )
  );
$$;

create or replace function public._owcebp157_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'phase129', 'label', 'Organizational Wisdom Phase 129', 'route', '/app/organizational-wisdom-engine', 'relationship', 'Foundation Wisdom Center — all _owebp129_* preserved'),
    jsonb_build_object('key', 'future_leaders_151', 'label', 'Future Leaders (Phase 151)', 'route', '/app/future-leaders-engine', 'relationship', 'Future leaders stakeholder perspective'),
    jsonb_build_object('key', 'org_legacy_152', 'label', 'Organizational Legacy (Phase 152)', 'route', '/app/organizational-memory-engine', 'relationship', 'Institutional memory cross-link'),
    jsonb_build_object('key', 'decision_heritage_153', 'label', 'Decision Heritage (Phase 153)', 'route', '/app/decision-intelligence-engine', 'relationship', 'Decision history wisdom memory'),
    jsonb_build_object('key', 'resilience_154', 'label', 'Organizational Resilience (Phase 154)', 'route', '/app/organizational-resilience-engine', 'relationship', 'Risk and continuity perspective'),
    jsonb_build_object('key', 'renewal_155', 'label', 'Organizational Renewal (Phase 155)', 'route', '/app/change-management-engine', 'relationship', 'Renewal and transformation lessons'),
    jsonb_build_object('key', 'purpose_renewal_156', 'label', 'Purpose Renewal (Phase 156)', 'route', '/app/purpose-values-engine', 'relationship', 'Values guiding decisions'),
    jsonb_build_object('key', 'decision_council_137', 'label', 'Collective Decision Council (Phase 137)', 'route', '/app/collective-decision-council-engine', 'relationship', 'Decision council — cross-link only, never duplicate _cdcc_*'),
    jsonb_build_object('key', 'wisdom_a93', 'label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'relationship', 'Experience-to-guidance — cross-link only'),
    jsonb_build_object('key', 'ai_ethics_a46', 'label', 'AI Ethics (A.46)', 'route', '/app/ai-ethics-responsible-use-engine', 'relationship', 'Deploy/govern ethically — cross-link only'),
    jsonb_build_object('key', 'board_governance_123', 'label', 'Board Governance (Phase 123)', 'route', '/app/governance-policy-engine', 'relationship', 'Governance integration'),
    jsonb_build_object('key', 'strategic_foresight_122', 'label', 'Strategic Foresight (Phase 122)', 'route', '/app/strategic-foresight-engine', 'relationship', 'Future consequence framework'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'relationship', 'Humility and compassion in wisdom'),
    jsonb_build_object('key', 'inclusion_a83', 'label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'relationship', 'Human Values Charter')
  );
$$;

create or replace function public._owcebp157_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group uses wisdom council scaffolds internally before customer rollout.',
    'practices', jsonb_build_array(
      'Quarterly wisdom council review metadata for major platform decisions',
      'Ethical foresight workshops before irreversible architecture choices',
      'Stakeholder awareness snapshots for Growth Partner and customer impact themes',
      'Wisdom memory entries for transformation lessons — metadata only'
    )
  );
$$;

create or replace function public._owcebp157_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Cultivate wisdom before irreversible decisions',
    'Should we do this — not just can we',
    'Wisdom before speed',
    'Perspective expansion — not moral authority',
    'Humans decide; Aipify informs and prepares',
    'Growth Partner not Affiliate — stewardship through responsibility'
  );
$$;

create or replace function public._owcebp157_privacy_note()
returns text language sql immutable as $$
  select 'Wisdom Council & Ethical Foresight blueprint data is metadata only — council review summaries, foresight workshop themes, aggregate stakeholder awareness. No PII, no surveillance, no moral verdicts. Humans retain moral agency and executive authority.';
$$;

create or replace function public._owcebp157_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_council_reviews int;
  v_foresight_sessions int;
  v_wisdom_memory int;
  v_stakeholder_snapshots int;
begin
  perform public._owis_ensure_settings(p_tenant_id);
  perform public._owcebp157_seed(p_tenant_id);

  select count(*) into v_council_reviews from public.wisdom_council_reviews
  where tenant_id = p_tenant_id and status in ('active', 'draft', 'review');
  select count(*) into v_foresight_sessions from public.ethical_foresight_sessions
  where tenant_id = p_tenant_id and status in ('active', 'draft', 'review');
  select count(*) into v_wisdom_memory from public.wisdom_memory_entries
  where tenant_id = p_tenant_id and status in ('active', 'review');
  select count(*) into v_stakeholder_snapshots from public.stakeholder_awareness_snapshots
  where tenant_id = p_tenant_id and status in ('active', 'review');

  return jsonb_build_object(
    'wisdom_council_reviews', v_council_reviews,
    'ethical_foresight_sessions', v_foresight_sessions,
    'wisdom_memory_entries', v_wisdom_memory,
    'stakeholder_awareness_snapshots', v_stakeholder_snapshots,
    'wisdom_council_capabilities_count', jsonb_array_length((public._owcebp157_wisdom_council_center()->'capabilities')),
    'ethical_foresight_questions_count', jsonb_array_length((public._owcebp157_ethical_foresight_engine()->'questions')),
    'stakeholder_groups_count', jsonb_array_length((public._owcebp157_stakeholder_awareness_framework()->'stakeholders')),
    'integration_links_count', jsonb_array_length(public._owcebp157_integration_links()),
    'privacy_note', public._owcebp157_privacy_note()
  );
end; $$;

create or replace function public._owcebp157_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._owis_ensure_settings(p_tenant_id);
  perform public._owcebp157_seed(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Objectives — eight documented', 'met', jsonb_array_length(public._owcebp157_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'wisdom_council_center', 'label', 'Wisdom Council Center — eight capabilities', 'met', jsonb_array_length((public._owcebp157_wisdom_council_center()->'capabilities')) = 8, 'note', null),
    jsonb_build_object('key', 'ethical_foresight', 'label', 'Ethical foresight — five questions', 'met', jsonb_array_length((public._owcebp157_ethical_foresight_engine()->'questions')) = 5, 'note', null),
    jsonb_build_object('key', 'stakeholder_awareness', 'label', 'Stakeholder awareness — seven groups', 'met', jsonb_array_length((public._owcebp157_stakeholder_awareness_framework()->'stakeholders')) = 7, 'note', null),
    jsonb_build_object('key', 'executive_wisdom', 'label', 'Executive wisdom reviews — five dimensions', 'met', jsonb_array_length((public._owcebp157_executive_wisdom_reviews()->'dimensions')) = 5, 'note', null),
    jsonb_build_object('key', 'wisdom_companion', 'label', 'Wisdom Companion — six supports', 'met', jsonb_array_length((public._owcebp157_wisdom_companion()->'supports')) = 6, 'note', null),
    jsonb_build_object('key', 'ethical_innovation', 'label', 'Ethical innovation — five tensions', 'met', jsonb_array_length((public._owcebp157_ethical_innovation_engine()->'tensions')) = 5, 'note', null),
    jsonb_build_object('key', 'future_consequences', 'label', 'Future consequence framework — six dimensions', 'met', jsonb_array_length((public._owcebp157_future_consequence_framework()->'dimensions')) = 6, 'note', null),
    jsonb_build_object('key', 'wisdom_memory', 'label', 'Wisdom memory engine — six record types', 'met', jsonb_array_length((public._owcebp157_wisdom_memory_engine()->'record_types')) = 6, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five documented', 'met', jsonb_array_length((public._owcebp157_companion_limitations()->'limitations')) = 5, 'note', null),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love connection — six practices', 'met', jsonb_array_length((public._owcebp157_self_love_connection()->'practices')) = 6, 'note', null),
    jsonb_build_object('key', 'security', 'label', 'Security requirements — five documented', 'met', jsonb_array_length((public._owcebp157_security_requirements()->'requirements')) = 5, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links documented', 'met', jsonb_array_length(public._owcebp157_integration_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'phase129_preserved', 'label', 'Phase 129 _owebp129_* fields preserved', 'met', true, 'note', 'All Phase 129 dashboard fields intact'),
    jsonb_build_object('key', 'not_ethical_authority', 'label', 'NOT ethical authority distinction documented', 'met', true, 'note', '_owcebp157_distinction_note()'),
    jsonb_build_object('key', 'cdcc_distinction', 'label', 'Phase 137 _cdcc_* duplication avoided', 'met', true, 'note', 'Cross-link only'),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Phase 157 metadata tables and RPCs', 'met', to_regclass('public.wisdom_council_reviews') is not null, 'note', '_owcebp157_* helpers intact')
  );
end; $$;

create or replace function public._owcebp157_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 157 — Organizational Wisdom Council & Ethical Foresight Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE157_ORGANIZATIONAL_WISDOM_COUNCIL_ETHICAL_FORESIGHT.md',
    'engine_phase', 'Phase 129 Organizational Wisdom & Ethical Intelligence Engine extension',
    'era', 'Legacy & Future Stewardship Era (151–160)',
    'route', '/app/organizational-wisdom-engine',
    'mapping_note', 'Wisdom Council & Ethical Foresight — perspective expansion not moral authority. All _owebp129_* preserved.',
    'distinction_note', public._owcebp157_distinction_note(),
    'mission', public._owcebp157_mission(),
    'philosophy', public._owcebp157_philosophy(),
    'abos_principle', public._owcebp157_abos_principle(),
    'vision', public._owcebp157_vision(),
    'objectives', public._owcebp157_objectives(),
    'wisdom_council_center', public._owcebp157_wisdom_council_center(),
    'ethical_foresight_engine', public._owcebp157_ethical_foresight_engine(),
    'stakeholder_awareness_framework', public._owcebp157_stakeholder_awareness_framework(),
    'executive_wisdom_reviews', public._owcebp157_executive_wisdom_reviews(),
    'wisdom_companion', public._owcebp157_wisdom_companion(),
    'ethical_innovation_engine', public._owcebp157_ethical_innovation_engine(),
    'future_consequence_framework', public._owcebp157_future_consequence_framework(),
    'wisdom_memory_engine', public._owcebp157_wisdom_memory_engine(),
    'companion_limitations', public._owcebp157_companion_limitations(),
    'self_love_connection', public._owcebp157_self_love_connection(),
    'security_requirements', public._owcebp157_security_requirements(),
    'integration_links', public._owcebp157_integration_links(),
    'dogfooding', public._owcebp157_dogfooding(),
    'success_criteria', public._owcebp157_success_criteria(p_tenant_id),
    'engagement_summary', public._owcebp157_engagement_summary(p_tenant_id),
    'vision_phrases', public._owcebp157_vision_phrases(),
    'privacy_note', public._owcebp157_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs (metadata scaffolds)
-- ---------------------------------------------------------------------------
create or replace function public.record_wisdom_council_review(
  p_review_type text,
  p_title text,
  p_reflection_summary text default null,
  p_stakeholder_summary text default null,
  p_foresight_summary text default null,
  p_cross_link_route text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._owis_require_tenant();

  if p_review_type is null or p_review_type not in (
    'wisdom_review', 'stakeholder_reflection', 'leadership_dialogue',
    'future_impact', 'executive_preparation', 'council_session'
  ) then
    raise exception 'invalid_review_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'council_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.wisdom_council_reviews (
    tenant_id, review_key, review_type, title, reflection_summary,
    stakeholder_summary, foresight_summary, status, cross_link_route, metadata
  )
  values (
    v_tenant_id, v_key, p_review_type, trim(p_title),
    left(trim(coalesce(p_reflection_summary, '')), 500),
    left(trim(coalesce(p_stakeholder_summary, '')), 500),
    left(trim(coalesce(p_foresight_summary, '')), 500),
    'active', p_cross_link_route,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true, 'not_ethical_authority', true)
  )
  returning id into v_id;

  perform public._owis_log_audit(v_tenant_id, 'wisdom_council_review_recorded', trim(p_title),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));

  return jsonb_build_object(
    'success', true,
    'review_id', v_id,
    'review_key', v_key,
    'status', 'active',
    'companion_limitation', 'Wisdom Companion does NOT determine morality or override executive authority.',
    'privacy_note', public._owcebp157_privacy_note()
  );
end; $$;

create or replace function public.record_ethical_foresight_session(
  p_session_type text,
  p_title text,
  p_who_benefits_summary text default null,
  p_unintended_harm_summary text default null,
  p_assumptions_summary text default null,
  p_future_generations_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._owis_require_tenant();

  if p_session_type is null or p_session_type not in (
    'foresight_workshop', 'ethical_exploration', 'future_impact_review', 'assumption_challenge'
  ) then
    raise exception 'invalid_session_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'foresight_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.ethical_foresight_sessions (
    tenant_id, session_key, session_type, title,
    who_benefits_summary, unintended_harm_summary, assumptions_summary,
    future_generations_summary, status, metadata
  )
  values (
    v_tenant_id, v_key, p_session_type, trim(p_title),
    left(trim(coalesce(p_who_benefits_summary, '')), 500),
    left(trim(coalesce(p_unintended_harm_summary, '')), 500),
    left(trim(coalesce(p_assumptions_summary, '')), 500),
    left(trim(coalesce(p_future_generations_summary, '')), 500),
    'active',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._owis_log_audit(v_tenant_id, 'ethical_foresight_session_recorded', trim(p_title),
    jsonb_build_object('session_id', v_id, 'session_type', p_session_type));

  return jsonb_build_object(
    'success', true,
    'session_id', v_id,
    'session_key', v_key,
    'status', 'active',
    'privacy_note', public._owcebp157_privacy_note()
  );
end; $$;

create or replace function public.record_wisdom_memory_entry(
  p_entry_type text,
  p_title text,
  p_summary text,
  p_cross_link_route text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._owis_require_tenant();

  if p_entry_type is null or p_entry_type not in (
    'leadership_reflection', 'ethical_discussion', 'governance_narrative',
    'transformation_lesson', 'decision_history', 'stakeholder_experience'
  ) then
    raise exception 'invalid_entry_type';
  end if;

  if p_title is null or trim(p_title) = '' or p_summary is null or trim(p_summary) = '' then
    raise exception 'title_and_summary_required';
  end if;

  v_key := 'memory_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.wisdom_memory_entries (
    tenant_id, entry_key, entry_type, title, summary, status, cross_link_route, metadata
  )
  values (
    v_tenant_id, v_key, p_entry_type, trim(p_title), left(trim(p_summary), 500),
    'active', p_cross_link_route,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._owis_log_audit(v_tenant_id, 'wisdom_memory_entry_recorded', trim(p_title),
    jsonb_build_object('entry_id', v_id, 'entry_type', p_entry_type));

  return jsonb_build_object(
    'success', true,
    'entry_id', v_id,
    'entry_key', v_key,
    'status', 'active',
    'privacy_note', public._owcebp157_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard + Card RPC — preserve ALL Phase 129 _owebp129_*; append Phase 157
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_wisdom_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.organizational_wisdom_settings;
  v_metrics jsonb;
  v_engagement jsonb;
  v_phase157_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._owis_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._owis_ensure_settings(v_tenant_id);
  perform public._owis_seed_reflection_workspaces(v_tenant_id);
  perform public._owis_seed_ethics_reviews(v_tenant_id);
  perform public._owis_seed_culture_snapshots(v_tenant_id);
  perform public._owis_seed_practices(v_tenant_id);
  perform public._owcebp157_seed(v_tenant_id);
  v_metrics := public._owis_refresh_metrics(v_tenant_id);
  v_engagement := public._owebp129_engagement_summary(v_tenant_id);
  v_phase157_engagement := public._owcebp157_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'wisdom_maturity_score', v_metrics->'wisdom_maturity_score',
    'active_reflection_workspaces', v_metrics->'active_reflection_workspaces',
    'ethics_reviews', v_metrics->'ethics_reviews',
    'philosophy', public._owebp129_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'wisdom_center_enabled', v_settings.wisdom_center_enabled,
    'implementation_blueprint_phase129', jsonb_build_object(
      'phase', 'Phase 129 — Organizational Wisdom & Ethical Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE129_ORGANIZATIONAL_WISDOM_ETHICAL_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 129 Organizational Wisdom & Ethical Intelligence Engine',
      'route', '/app/organizational-wisdom-engine',
      'mapping_note', 'Reflection and discernment — humans retain moral agency.'
    ),
    'organizational_wisdom_mission', public._owebp129_mission(),
    'organizational_wisdom_abos_principle', public._owebp129_abos_principle(),
    'organizational_wisdom_engagement_summary', v_engagement,
    'organizational_wisdom_vision_note', public._owebp129_vision(),
    'implementation_blueprint_phase157', jsonb_build_object(
      'phase', 'Phase 157 — Organizational Wisdom Council & Ethical Foresight Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE157_ORGANIZATIONAL_WISDOM_COUNCIL_ETHICAL_FORESIGHT.md',
      'spec_doc', 'ORGANIZATIONAL_WISDOM_COUNCIL_ETHICAL_FORESIGHT_ENGINE_PHASE157.md',
      'engine_phase', 'Phase 129 Organizational Wisdom & Ethical Intelligence Engine extension',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/organizational-wisdom-engine',
      'mapping_note', 'Wisdom Council & Ethical Foresight — perspective expansion not moral authority.'
    ),
    'phase157_mission', public._owcebp157_mission(),
    'phase157_abos_principle', public._owcebp157_abos_principle(),
    'phase157_vision', public._owcebp157_vision(),
    'phase157_engagement_summary', v_phase157_engagement,
    'phase157_note', 'Legacy & Future Stewardship Phase 157 — wisdom council reviews, ethical foresight workshops, and stakeholder awareness on Phase 129 scaffolds. NOT ethical authority.',
    'phase157_distinction_note', public._owcebp157_distinction_note()
  );
end; $$;

create or replace function public.get_organizational_wisdom_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.organizational_wisdom_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._owis_require_tenant());
  v_settings := public._owis_ensure_settings(v_tenant_id);
  perform public._owis_seed_reflection_workspaces(v_tenant_id);
  perform public._owis_seed_ethics_reviews(v_tenant_id);
  perform public._owis_seed_culture_snapshots(v_tenant_id);
  perform public._owis_seed_practices(v_tenant_id);
  perform public._owcebp157_seed(v_tenant_id);
  v_metrics := public._owis_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'wisdom_center_enabled', v_settings.wisdom_center_enabled,
    'ethical_reflection_enabled', v_settings.ethical_reflection_enabled,
    'values_alignment_enabled', v_settings.values_alignment_enabled,
    'decision_reflection_enabled', v_settings.decision_reflection_enabled,
    'perspective_expansion_enabled', v_settings.perspective_expansion_enabled,
    'governance_integration_enabled', v_settings.governance_integration_enabled,
    'culture_insights_enabled', v_settings.culture_insights_enabled,
    'philosophy', public._owebp129_philosophy(),
    'distinction_note', public._owebp129_distinction_note(),
    'safety_note', 'Wisdom Center — reflection and transparency. Aipify does NOT determine right or wrong. Culture insight = aggregate themes not surveillance.',
    'wisdom_maturity_score', v_metrics->'wisdom_maturity_score',
    'active_reflection_workspaces', v_metrics->'active_reflection_workspaces',
    'ethics_reviews', v_metrics->'ethics_reviews',
    'culture_theme_snapshots', v_metrics->'culture_theme_snapshots',
    'wisdom_practices_count', v_metrics->'wisdom_practices_count',
    'wisdom_center_capabilities_count', v_metrics->'wisdom_center_capabilities_count',
    'ethical_questions_count', v_metrics->'ethical_questions_count',
    'values_dimensions_count', v_metrics->'values_dimensions_count',
    'perspective_groups_count', v_metrics->'perspective_groups_count',
    'reflection_workspaces', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workspace_key', w.workspace_key, 'title', w.title,
        'reflection_topic', w.reflection_topic, 'status', w.status,
        'cross_link_route', w.cross_link_route
      ) order by w.updated_at desc)
      from public.organizational_wisdom_reflection_workspaces w where w.tenant_id = v_tenant_id and w.status in ('active', 'draft', 'review')
    ), '[]'::jsonb),
    'ethics_reviews_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'workspace_key', r.workspace_key,
        'title', r.title, 'who_benefits_summary', r.who_benefits_summary,
        'who_harmed_summary', r.who_harmed_summary, 'status', r.status
      ) order by r.updated_at desc)
      from public.organizational_wisdom_ethics_reviews r where r.tenant_id = v_tenant_id and r.status in ('active', 'review')
    ), '[]'::jsonb),
    'culture_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'snapshot_key', c.snapshot_key, 'theme_area', c.theme_area,
        'title', c.title, 'theme_summary', c.theme_summary,
        'signal_strength', c.signal_strength, 'status', c.status
      ) order by c.captured_at desc)
      from public.organizational_wisdom_culture_theme_snapshots c where c.tenant_id = v_tenant_id and c.status in ('active', 'review')
    ), '[]'::jsonb),
    'wisdom_practices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'practice_key', p.practice_key, 'practice_type', p.practice_type,
        'title', p.title, 'summary', p.summary, 'status', p.status,
        'cross_link_route', p.cross_link_route
      ) order by p.updated_at desc)
      from public.organizational_wisdom_practices p where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'ethical_question_scaffolds', public._owis_ethical_questions(),
    'values_dimension_scaffolds', public._owis_values_dimensions(),
    'perspective_group_scaffolds', public._owis_perspective_groups(),
    'decision_ethics_prompt_scaffolds', public._owis_decision_ethics_prompts(),
    'culture_insight_area_scaffolds', public._owis_culture_insight_areas(),
    'wisdom_practice_scaffolds', public._owis_wisdom_practice_scaffolds(),
    'integration_links', public._owebp129_cross_links(),
    'implementation_blueprint_phase129', jsonb_build_object(
      'phase', 'Phase 129 — Organizational Wisdom & Ethical Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE129_ORGANIZATIONAL_WISDOM_ETHICAL_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 129 Organizational Wisdom & Ethical Intelligence Engine',
      'route', '/app/organizational-wisdom-engine',
      'mapping_note', 'Reflection and discernment — humans retain moral agency.'
    ),
    'organizational_wisdom_blueprint', public._owebp129_blueprint_block(v_tenant_id),
    'organizational_wisdom_mission', public._owebp129_mission(),
    'organizational_wisdom_philosophy', public._owebp129_philosophy(),
    'organizational_wisdom_abos_principle', public._owebp129_abos_principle(),
    'organizational_wisdom_objectives', public._owebp129_objectives(),
    'wisdom_center', public._owebp129_wisdom_center(),
    'ethical_intelligence_engine', public._owebp129_ethical_intelligence_engine(),
    'values_alignment_engine', public._owebp129_values_alignment_engine(),
    'multi_perspective_framework', public._owebp129_multi_perspective_framework(),
    'wisdom_companion', public._owebp129_wisdom_companion(),
    'decision_ethics_review', public._owebp129_decision_ethics_review(),
    'culture_insight_engine', public._owebp129_culture_insight_engine(),
    'wisdom_practices_library', public._owebp129_wisdom_practices_library(),
    'companion_limitations', public._owebp129_companion_limitations(),
    'self_love_in_wisdom', public._owebp129_self_love_in_wisdom(),
    'ethical_governance_integration', public._owebp129_ethical_governance_integration(),
    'owebp129_cross_links', public._owebp129_cross_links(),
    'limitation_principles', public._owebp129_limitation_principles(),
    'companion_adaptation', public._owebp129_companion_adaptation(),
    'engagement_summary', public._owebp129_engagement_summary(v_tenant_id),
    'success_criteria', public._owebp129_success_criteria(v_tenant_id),
    'success_metrics', public._owebp129_success_metrics(),
    'organizational_wisdom_vision', public._owebp129_vision(),
    'privacy_note', 'Organizational wisdom metadata only — reflection scaffolds, ethics review summaries, aggregate culture themes. No customer email, chat, individual evaluation, or PII. Humans retain moral agency.',
    'implementation_blueprint_phase157', jsonb_build_object(
      'phase', 'Phase 157 — Organizational Wisdom Council & Ethical Foresight Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE157_ORGANIZATIONAL_WISDOM_COUNCIL_ETHICAL_FORESIGHT.md',
      'spec_doc', 'ORGANIZATIONAL_WISDOM_COUNCIL_ETHICAL_FORESIGHT_ENGINE_PHASE157.md',
      'engine_phase', 'Phase 129 Organizational Wisdom & Ethical Intelligence Engine extension',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/organizational-wisdom-engine',
      'mapping_note', 'Wisdom Council & Ethical Foresight — perspective expansion not moral authority. All _owebp129_* preserved.'
    ),
    'wisdom_council_ethical_foresight_blueprint', public._owcebp157_blueprint_block(v_tenant_id),
    'phase157_distinction_note', public._owcebp157_distinction_note(),
    'phase157_mission', public._owcebp157_mission(),
    'phase157_philosophy', public._owcebp157_philosophy(),
    'phase157_abos_principle', public._owcebp157_abos_principle(),
    'phase157_vision', public._owcebp157_vision(),
    'phase157_objectives', public._owcebp157_objectives(),
    'phase157_wisdom_council_center', public._owcebp157_wisdom_council_center(),
    'phase157_ethical_foresight_engine', public._owcebp157_ethical_foresight_engine(),
    'phase157_stakeholder_awareness_framework', public._owcebp157_stakeholder_awareness_framework(),
    'phase157_executive_wisdom_reviews', public._owcebp157_executive_wisdom_reviews(),
    'phase157_wisdom_companion', public._owcebp157_wisdom_companion(),
    'phase157_ethical_innovation_engine', public._owcebp157_ethical_innovation_engine(),
    'phase157_future_consequence_framework', public._owcebp157_future_consequence_framework(),
    'phase157_wisdom_memory_engine', public._owcebp157_wisdom_memory_engine(),
    'phase157_companion_limitations', public._owcebp157_companion_limitations(),
    'phase157_self_love_connection', public._owcebp157_self_love_connection(),
    'phase157_security_requirements', public._owcebp157_security_requirements(),
    'owcebp157_integration_links', public._owcebp157_integration_links(),
    'phase157_dogfooding', public._owcebp157_dogfooding(),
    'phase157_success_criteria', public._owcebp157_success_criteria(v_tenant_id),
    'phase157_engagement_summary', public._owcebp157_engagement_summary(v_tenant_id),
    'phase157_vision_phrases', public._owcebp157_vision_phrases(),
    'organizational_wisdom_council_note', 'Legacy & Future Stewardship Phase 157 — cultivate wisdom before irreversible decisions. NOT ethical authority — expands perspective not replaces leadership.',
    'phase157_privacy_note', public._owcebp157_privacy_note(),
    'phase157_sections', jsonb_build_object(
      'wisdom_council_reviews', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', cr.id, 'review_key', cr.review_key, 'review_type', cr.review_type,
          'title', cr.title, 'reflection_summary', cr.reflection_summary,
          'status', cr.status, 'cross_link_route', cr.cross_link_route
        ) order by cr.updated_at desc)
        from public.wisdom_council_reviews cr where cr.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb),
      'ethical_foresight_sessions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', fs.id, 'session_key', fs.session_key, 'session_type', fs.session_type,
          'title', fs.title, 'who_benefits_summary', fs.who_benefits_summary,
          'status', fs.status
        ) order by fs.updated_at desc)
        from public.ethical_foresight_sessions fs where fs.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb),
      'wisdom_memory_entries', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', wm.id, 'entry_key', wm.entry_key, 'entry_type', wm.entry_type,
          'title', wm.title, 'summary', wm.summary, 'status', wm.status,
          'cross_link_route', wm.cross_link_route
        ) order by wm.updated_at desc)
        from public.wisdom_memory_entries wm where wm.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb),
      'stakeholder_awareness_snapshots', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', sa.id, 'snapshot_key', sa.snapshot_key, 'stakeholder_group', sa.stakeholder_group,
          'title', sa.title, 'theme_summary', sa.theme_summary,
          'signal_strength', sa.signal_strength, 'status', sa.status
        ) order by sa.captured_at desc)
        from public.stakeholder_awareness_snapshots sa where sa.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb)
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._owcebp157_distinction_note() to authenticated;
grant execute on function public._owcebp157_mission() to authenticated;
grant execute on function public._owcebp157_philosophy() to authenticated;
grant execute on function public._owcebp157_abos_principle() to authenticated;
grant execute on function public._owcebp157_vision() to authenticated;
grant execute on function public._owcebp157_objectives() to authenticated;
grant execute on function public._owcebp157_wisdom_council_center() to authenticated;
grant execute on function public._owcebp157_ethical_foresight_engine() to authenticated;
grant execute on function public._owcebp157_stakeholder_awareness_framework() to authenticated;
grant execute on function public._owcebp157_executive_wisdom_reviews() to authenticated;
grant execute on function public._owcebp157_wisdom_companion() to authenticated;
grant execute on function public._owcebp157_ethical_innovation_engine() to authenticated;
grant execute on function public._owcebp157_future_consequence_framework() to authenticated;
grant execute on function public._owcebp157_wisdom_memory_engine() to authenticated;
grant execute on function public._owcebp157_companion_limitations() to authenticated;
grant execute on function public._owcebp157_self_love_connection() to authenticated;
grant execute on function public._owcebp157_security_requirements() to authenticated;
grant execute on function public._owcebp157_integration_links() to authenticated;
grant execute on function public._owcebp157_dogfooding() to authenticated;
grant execute on function public._owcebp157_vision_phrases() to authenticated;
grant execute on function public._owcebp157_privacy_note() to authenticated;
grant execute on function public._owcebp157_engagement_summary(uuid) to authenticated;
grant execute on function public._owcebp157_success_criteria(uuid) to authenticated;
grant execute on function public._owcebp157_blueprint_block(uuid) to authenticated;
grant execute on function public.record_wisdom_council_review(text, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.record_ethical_foresight_session(text, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.record_wisdom_memory_entry(text, text, text, text, jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-wisdom-council-ethical-foresight-blueprint-phase157', 'Organizational Wisdom Council & Ethical Foresight (Phase 157)',
  'Legacy & Future Stewardship Phase 157 — extends Organizational Wisdom Phase 129 with wisdom council reviews, ethical foresight workshops, and stakeholder awareness. NOT ethical authority.',
  'authenticated', 157
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-wisdom-council-ethical-foresight-blueprint-phase157' and tenant_id is null
);
