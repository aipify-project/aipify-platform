-- Implementation Blueprint Phase 153 — Institutional Wisdom & Decision Heritage Engine
-- Legacy & Future Stewardship Era (151–160). Extends Decision Intelligence Phase 125.
-- Helpers: _iwdhbp153_* (never collide with _dein_*, _deibp125_*).
-- Cross-links Future Leaders 151, Org Memory 152, Wisdom A.93, Collective Decision 137, ODSE A.54 — never duplicate.

-- ---------------------------------------------------------------------------
-- 1. Optional tenant-scoped heritage tables (metadata scaffolds — extend Phase 125)
-- ---------------------------------------------------------------------------
create table if not exists public.decision_heritage_archives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  archive_key text not null,
  workspace_key text,
  title text not null,
  decision_summary text not null check (char_length(decision_summary) <= 500),
  context_summary text check (char_length(context_summary) <= 500),
  alternatives_summary text check (char_length(alternatives_summary) <= 500),
  status text not null default 'active' check (status in ('draft', 'active', 'archived', 'review')),
  visibility text not null default 'leadership' check (visibility in ('leadership', 'executive', 'governance')),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, archive_key)
);

create index if not exists decision_heritage_archives_tenant_idx
  on public.decision_heritage_archives (tenant_id, status);

alter table public.decision_heritage_archives enable row level security;
revoke all on public.decision_heritage_archives from authenticated, anon;

create table if not exists public.decision_heritage_outcome_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  archive_key text,
  workspace_key text,
  title text not null,
  what_happened_summary text check (char_length(what_happened_summary) <= 500),
  assumptions_accurate_summary text check (char_length(assumptions_accurate_summary) <= 500),
  surprises_summary text check (char_length(surprises_summary) <= 500),
  future_leader_guidance_summary text check (char_length(future_leader_guidance_summary) <= 500),
  differently_summary text check (char_length(differently_summary) <= 500),
  status text not null default 'active' check (status in ('scheduled', 'active', 'completed', 'archived')),
  reviewed_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists decision_heritage_outcome_reviews_tenant_idx
  on public.decision_heritage_outcome_reviews (tenant_id, status, reviewed_at desc);

alter table public.decision_heritage_outcome_reviews enable row level security;
revoke all on public.decision_heritage_outcome_reviews from authenticated, anon;

create table if not exists public.decision_heritage_executive_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  archive_key text,
  reflection_type text not null check (
    reflection_type in (
      'decision_experience', 'transformation_insight', 'governance_lesson',
      'cultural_consideration', 'future_recommendation', 'leadership_reflection'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);

create index if not exists decision_heritage_executive_reflections_tenant_idx
  on public.decision_heritage_executive_reflections (tenant_id, reflection_type, status);

alter table public.decision_heritage_executive_reflections enable row level security;
revoke all on public.decision_heritage_executive_reflections from authenticated, anon;

create table if not exists public.decision_heritage_pattern_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  pattern_type text not null check (
    pattern_type in (
      'success_pattern', 'risk_theme', 'leadership_blind_spot_aggregate',
      'governance_strength', 'cultural_influence', 'transformation_behavior'
    )
  ),
  title text not null,
  theme_summary text not null check (char_length(theme_summary) <= 500),
  status text not null default 'active' check (status in ('active', 'archived')),
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{"metadata_only":true,"learning_not_judgment":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);

create index if not exists decision_heritage_pattern_snapshots_tenant_idx
  on public.decision_heritage_pattern_snapshots (tenant_id, pattern_type, status);

alter table public.decision_heritage_pattern_snapshots enable row level security;
revoke all on public.decision_heritage_pattern_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Heritage seed + metrics helpers
-- ---------------------------------------------------------------------------
create or replace function public._iwdhbp153_seed_archives(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_heritage_archives where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_heritage_archives (
    tenant_id, archive_key, workspace_key, title, decision_summary, context_summary,
    alternatives_summary, status, visibility
  ) values
    (p_tenant_id, 'platform-expansion-archive', 'platform-expansion',
     'Platform expansion strategic archive',
     'Phased expansion into adjacent market segments — human judgment preserved in metadata.',
     'Market signals from foresight center · capacity metrics · partner feedback summaries.',
     'Full expansion · phased rollout · partner-led growth — alternatives documented.',
     'active', 'executive'),
    (p_tenant_id, 'governance-update-archive', 'governance-update',
     'Governance policy update archive',
     'Incremental approval policy update for sensitive operational actions.',
     'Board expectations · existing policy framework · compliance landscape signals.',
     'Incremental update · comprehensive rewrite · defer to next quarter.',
     'active', 'governance');
end; $$;

create or replace function public._iwdhbp153_seed_outcome_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_heritage_outcome_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_heritage_outcome_reviews (
    tenant_id, review_key, archive_key, workspace_key, title,
    what_happened_summary, assumptions_accurate_summary, surprises_summary,
    future_leader_guidance_summary, differently_summary, status, reviewed_at
  ) values
    (p_tenant_id, 'expansion-q2-outcome', 'platform-expansion-archive', 'platform-expansion',
     'Q2 expansion outcome review',
     'Phase-one rollout completed with measured operational strain — metadata summary only.',
     'Market demand sustained · GP readiness partially validated · capacity sufficient for phase one.',
     'Partner onboarding took longer than expected — learning opportunity not blame.',
     'Build GP readiness checkpoint into expansion playbook for future leaders.',
     'Schedule assumption review before each phase — structured reflection.',
     'completed', now() - interval '7 days');
end; $$;

create or replace function public._iwdhbp153_seed_executive_reflections(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_heritage_executive_reflections where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_heritage_executive_reflections (
    tenant_id, reflection_key, archive_key, reflection_type, title, reflection_summary, status
  ) values
    (p_tenant_id, 'expansion-leadership-reflection', 'platform-expansion-archive',
     'decision_experience', 'Expansion leadership reflection',
     'Phased approach balanced growth with operational stability — humility about unknown competitive response.',
     'active'),
    (p_tenant_id, 'governance-transformation-insight', 'governance-update-archive',
     'governance_lesson', 'Governance evolution insight',
     'Clearer accountability reduced ambiguity without blocking reversible decisions — cultural patience required.',
     'active');
end; $$;

create or replace function public._iwdhbp153_seed_pattern_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_heritage_pattern_snapshots where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_heritage_pattern_snapshots (
    tenant_id, snapshot_key, pattern_type, title, theme_summary, status
  ) values
    (p_tenant_id, 'phased-rollout-success', 'success_pattern', 'Phased rollout success pattern',
     'Structured assumption reviews before each phase correlate with smoother operational transitions — aggregate theme only.',
     'active'),
    (p_tenant_id, 'partner-readiness-risk', 'risk_theme', 'Partner readiness risk theme',
     'GP enablement timing frequently underestimated — common risk theme for future leader awareness.',
     'active');
end; $$;

create or replace function public._iwdhbp153_refresh_heritage_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_archives int;
  v_outcome_reviews int;
  v_reflections int;
  v_patterns int;
begin
  perform public._iwdhbp153_seed_archives(p_tenant_id);
  perform public._iwdhbp153_seed_outcome_reviews(p_tenant_id);
  perform public._iwdhbp153_seed_executive_reflections(p_tenant_id);
  perform public._iwdhbp153_seed_pattern_snapshots(p_tenant_id);

  select count(*) into v_archives from public.decision_heritage_archives
  where tenant_id = p_tenant_id and status in ('active', 'review', 'draft');
  select count(*) into v_outcome_reviews from public.decision_heritage_outcome_reviews
  where tenant_id = p_tenant_id and status in ('active', 'completed', 'scheduled');
  select count(*) into v_reflections from public.decision_heritage_executive_reflections
  where tenant_id = p_tenant_id and status in ('active', 'draft');
  select count(*) into v_patterns from public.decision_heritage_pattern_snapshots
  where tenant_id = p_tenant_id and status = 'active';

  return jsonb_build_object(
    'heritage_archives', v_archives,
    'outcome_reviews', v_outcome_reviews,
    'executive_reflections', v_reflections,
    'pattern_snapshots', v_patterns,
    'decision_heritage_center_capabilities_count', 8,
    'journal_capture_fields_count', 7,
    'outcome_review_prompts_count', 5,
    'executive_reflection_dimensions_count', 5,
    'wisdom_companion_supports_count', 6,
    'pattern_theme_types_count', 6,
    'institutional_wisdom_assets_count', 6,
    'future_leader_preparation_areas_count', 5
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint metadata helpers (_iwdhbp153_*)
-- ---------------------------------------------------------------------------
create or replace function public._iwdhbp153_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 153 — Institutional Wisdom & Decision Heritage Engine at /app/decision-intelligence-engine. Extends Decision Intelligence & Executive Advisory Phase 125 (_dein_*, _deibp125_*) — Legacy & Future Stewardship Era (151–160). Preserve reasoning not glorify past; wisdom compounds across generations. **Does NOT create duplicate Decision Heritage Center or Wisdom Engine A.93 RPCs** — cross-link /app/wisdom-engine only. Distinct from Future Leaders Phase 151 at /app/future-leaders-engine (leadership development — cross-link). Distinct from Organizational Legacy Phase 152 at /app/organizational-memory-engine (institutional memory — cross-link). Distinct from Collective Decision Phase 137 at /app/collective-decision-council-engine. Distinct from ODSE A.54 at /app/organizational-decision-support-engine (org decision register — cross-link). Distinct from personal DSE at /app/assistant/decisions. Helpers _iwdhbp153_* only — never collide with _dein_*, _deibp125_*. Patterns support learning NOT judgment.';
$$;

create or replace function public._iwdhbp153_mission()
returns text language sql immutable as $$
  select 'Preserve institutional decision wisdom — strategic archives, outcome reviews, and executive reflections that help future leaders learn from history without glorifying the past or resisting thoughtful change.';
$$;

create or replace function public._iwdhbp153_philosophy()
returns text language sql immutable as $$
  select 'Preserve understanding not only outcomes — wisdom compounds. Not to glorify past or resist change. Growth Partner not Affiliate. People First. Wisdom before speed. Patterns support learning NOT judgment.';
$$;

create or replace function public._iwdhbp153_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Decision Heritage Center extends Decision Intelligence Phase 125 with institutional wisdom archives, outcome reviews, and aggregate pattern themes — metadata only; Wisdom Companion supports understanding, never rewrites history or replaces executive accountability.';
$$;

create or replace function public._iwdhbp153_vision()
returns text language sql immutable as $$
  select 'Organizations should inherit decision wisdom generously — future leaders access historical context, executive reflections, and lessons learned so institutional judgment strengthens across generations.';
$$;

create or replace function public._iwdhbp153_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'preserve_reasoning', 'emoji', '🦉', 'label', 'Preserve decision reasoning', 'description', 'Strategic archives capture context, alternatives, and rationale — metadata only'),
    jsonb_build_object('key', 'outcome_learning', 'emoji', '🌹', 'label', 'Outcome learning', 'description', 'Periodic outcome reviews — what happened, surprises, future leader guidance'),
    jsonb_build_object('key', 'executive_reflection', 'emoji', '❤️', 'label', 'Executive reflection', 'description', 'Leadership reflection libraries — transformation and governance lessons'),
    jsonb_build_object('key', 'institutional_patterns', 'emoji', '🔔', 'label', 'Institutional patterns', 'description', 'Aggregate pattern themes — learning NOT judgment or individual scoring'),
    jsonb_build_object('key', 'future_leader_prep', 'emoji', '🦉', 'label', 'Future leader preparation', 'description', 'Cross-link Future Leaders Phase 151 — historical context for succession'),
    jsonb_build_object('key', 'wisdom_compounding', 'emoji', '🌹', 'label', 'Wisdom compounding', 'description', 'Institutional wisdom library — cross-link Org Memory Phase 152 and A.34'),
    jsonb_build_object('key', 'transparent_heritage', 'emoji', '🔔', 'label', 'Transparent heritage', 'description', 'Decision review frameworks with RBAC and audit — no improper confidential reveal'),
    jsonb_build_object('key', 'humility_learning', 'emoji', '❤️', 'label', 'Humility in learning', 'description', 'Self Love connection — compassion toward past decisions and commitment to growth')
  );
$$;

create or replace function public._iwdhbp153_decision_heritage_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision Heritage Center — eight capabilities for institutional decision wisdom.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'decision_journals', 'label', 'Decision journals', 'description', 'Extends Phase 125 journals — metadata captures for heritage depth'),
      jsonb_build_object('key', 'strategic_archives', 'label', 'Strategic archives', 'description', 'Strategic decision archive metadata — summary, context, alternatives'),
      jsonb_build_object('key', 'executive_reflection_libraries', 'label', 'Executive reflection libraries', 'description', 'Leadership reflection metadata — governance and transformation insights'),
      jsonb_build_object('key', 'outcome_tracking', 'label', 'Outcome tracking', 'description', 'Periodic outcome review records — assumptions, surprises, guidance'),
      jsonb_build_object('key', 'lessons_learned_repositories', 'label', 'Lessons learned repositories', 'description', 'Institutional lessons — cross-link Org Memory A.34 decision register'),
      jsonb_build_object('key', 'decision_review_frameworks', 'label', 'Decision review frameworks', 'description', 'Structured review scaffolds — humans interpret relevance'),
      jsonb_build_object('key', 'knowledge_connections', 'label', 'Knowledge connections', 'description', 'KC and Wisdom A.93 cross-links — experience-to-guidance'),
      jsonb_build_object('key', 'institutional_memory_dashboards', 'label', 'Institutional memory dashboards', 'description', 'Heritage visibility — cross-link Phase 152 org memory')
    )
  );
$$;

create or replace function public._iwdhbp153_decision_journal_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision journal engine — seven metadata captures for heritage depth.',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'decision_summary', 'label', 'Decision summary', 'description', 'Clear decision statement metadata — max ~500 chars'),
      jsonb_build_object('key', 'strategic_context', 'label', 'Strategic context', 'description', 'Context known at decision time — cross-link foresight and alignment'),
      jsonb_build_object('key', 'alternatives', 'label', 'Alternatives', 'description', 'Options considered — expand thinking not outcomes'),
      jsonb_build_object('key', 'stakeholders_consulted', 'label', 'Stakeholders consulted', 'description', 'Role labels only — no PII or raw transcripts'),
      jsonb_build_object('key', 'expected_outcomes', 'label', 'Expected outcomes', 'description', 'Hypothesized results — not guarantees'),
      jsonb_build_object('key', 'known_risks', 'label', 'Known risks', 'description', 'Risks documented at decision time — stewardship not alarm'),
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections', 'description', 'Executive reflection metadata — human judgment preserved')
    ),
    'boundary_note', 'Journal heritage metadata only — never raw meeting transcripts or PII.'
  );
$$;

create or replace function public._iwdhbp153_outcome_review_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Outcome review engine — five reflection prompts. Learn without blame.',
    'prompts', jsonb_build_array(
      jsonb_build_object('key', 'what_happened', 'label', 'What happened?', 'description', 'Actual outcomes vs expectations — honest metadata summary'),
      jsonb_build_object('key', 'assumptions_accurate', 'label', 'Were assumptions accurate?', 'description', 'Which hypotheses held and which did not'),
      jsonb_build_object('key', 'surprises', 'label', 'What surprised us?', 'description', 'Unexpected outcomes — learning opportunity'),
      jsonb_build_object('key', 'future_leader_guidance', 'label', 'Future leader guidance', 'description', 'What would help successors — cross-link Phase 151'),
      jsonb_build_object('key', 'what_differently', 'label', 'What would we do differently?', 'description', 'Improvements for next time — no blame framing')
    ),
    'boundary_note', 'Outcome reviews strengthen institutional wisdom — cross-link Organizational Memory A.34.'
  );
$$;

create or replace function public._iwdhbp153_executive_reflection_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive reflection engine — five reflection dimensions for leadership heritage.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'decision_experiences', 'label', 'Decision experiences', 'description', 'What leadership learned from significant decisions'),
      jsonb_build_object('key', 'transformation_insights', 'label', 'Transformation insights', 'description', 'Organizational change narratives — metadata only'),
      jsonb_build_object('key', 'governance_lessons', 'label', 'Governance lessons', 'description', 'Policy and accountability learnings — cross-link Phase 123'),
      jsonb_build_object('key', 'cultural_considerations', 'label', 'Cultural considerations', 'description', 'People First impact and cultural context'),
      jsonb_build_object('key', 'future_recommendations', 'label', 'Future recommendations', 'description', 'Guidance for successors — humans decide relevance')
    ),
    'boundary_note', 'Reflection scaffolds preserve wisdom — never rewrite historical records.'
  );
$$;

create or replace function public._iwdhbp153_wisdom_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Companion — six supports. Understanding NOT reinterpretation.',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'decision_summaries', 'label', 'Decision summaries', 'description', 'Summarize approved heritage metadata for context retrieval'),
      jsonb_build_object('key', 'historical_context_retrieval', 'label', 'Historical context retrieval', 'description', 'Retrieve relevant archive metadata when asked — explain sources'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Gentle reflection prompts for leadership preparation'),
      jsonb_build_object('key', 'outcome_comparisons', 'label', 'Outcome comparisons', 'description', 'Compare expected vs actual outcome metadata — no judgment scoring'),
      jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery', 'description', 'Cross-link KC A.5 and Wisdom A.93 — approved knowledge only'),
      jsonb_build_object('key', 'leadership_preparation', 'label', 'Leadership preparation', 'description', 'Prepare heritage context for future leaders — cross-link Phase 151')
    ),
    'boundary_note', 'Wisdom Companion supports understanding — does NOT rewrite history or determine future decisions.'
  );
$$;

create or replace function public._iwdhbp153_decision_pattern_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision pattern engine — aggregate themes only. Learning NOT judgment.',
    'pattern_types', jsonb_build_array(
      jsonb_build_object('key', 'success_patterns', 'label', 'Repeated success patterns', 'description', 'Aggregate themes from positive outcomes — not individual evaluation'),
      jsonb_build_object('key', 'risk_themes', 'label', 'Common risk themes', 'description', 'Recurring risk patterns for awareness — stewardship not alarm'),
      jsonb_build_object('key', 'leadership_blind_spots', 'label', 'Leadership blind spots (aggregates)', 'description', 'Aggregate oversight themes — never individual judgment scores'),
      jsonb_build_object('key', 'governance_strengths', 'label', 'Governance strengths', 'description', 'Governance patterns that supported good outcomes'),
      jsonb_build_object('key', 'cultural_influences', 'label', 'Cultural influences', 'description', 'Cultural context themes — People First'),
      jsonb_build_object('key', 'transformation_behaviors', 'label', 'Transformation behaviors', 'description', 'Change and transformation pattern aggregates')
    ),
    'boundary_note', 'Pattern snapshots are aggregate themes — never individual judgment or ranking.'
  );
$$;

create or replace function public._iwdhbp153_institutional_wisdom_library()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Institutional wisdom library — six asset types. Cross-link Phase 152 org memory.',
    'assets', jsonb_build_array(
      jsonb_build_object('key', 'leadership_lessons', 'label', 'Leadership lessons', 'description', 'Executive reflection and decision experience metadata'),
      jsonb_build_object('key', 'governance_insights', 'label', 'Governance insights', 'description', 'Policy evolution and accountability learnings'),
      jsonb_build_object('key', 'transformation_narratives', 'label', 'Transformation narratives', 'description', 'Change journey metadata — cross-link Legacy A.86'),
      jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories', 'description', 'Strategic archives and outcome reviews — cross-link ODSE A.54 register'),
      jsonb_build_object('key', 'gp_experiences', 'label', 'GP experiences', 'description', 'Growth Partner partnership decision metadata — cross-link GP Ops'),
      jsonb_build_object('key', 'executive_reflections', 'label', 'Executive reflections', 'description', 'Leadership reflection library entries')
    ),
    'org_memory_route', '/app/organizational-memory-engine'
  );
$$;

create or replace function public._iwdhbp153_future_leader_preparation_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future leader preparation — five heritage access areas. Cross-link Phase 151.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'historical_decisions', 'label', 'Historical decisions access', 'description', 'Strategic archives and decision journals for successor context'),
      jsonb_build_object('key', 'executive_reflections', 'label', 'Executive reflections', 'description', 'Leadership reflection libraries — metadata only'),
      jsonb_build_object('key', 'transformation_stories', 'label', 'Transformation stories', 'description', 'Organizational change narratives — cross-link Phase 152'),
      jsonb_build_object('key', 'governance_experiences', 'label', 'Governance experiences', 'description', 'Governance lesson metadata for continuity prep'),
      jsonb_build_object('key', 'institutional_values', 'label', 'Institutional values', 'description', 'Values and principles context — cross-link Purpose & Values A.82')
    ),
    'future_leaders_route', '/app/future-leaders-engine',
    'boundary_note', 'Preparation scaffolds — Future Leaders Phase 151 owns development pathways.'
  );
$$;

create or replace function public._iwdhbp153_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Companion limitations — five boundaries.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'no_rewrite_records', 'label', 'No rewriting records', 'description', 'Never alter or rewrite historical decision archives'),
      jsonb_build_object('key', 'no_suppress_interpretations', 'label', 'No suppressing interpretations', 'description', 'Never hide alternative viewpoints or dissenting history'),
      jsonb_build_object('key', 'no_determine_future_decisions', 'label', 'No determining future decisions', 'description', 'Never decide outcomes for current or future leaders'),
      jsonb_build_object('key', 'no_replace_accountability', 'label', 'No replacing accountability', 'description', 'Executive accountability remains with humans — companion prepares context only'),
      jsonb_build_object('key', 'no_improper_confidential_reveal', 'label', 'No improper confidential reveal', 'description', 'RBAC and visibility controls — never expose confidential histories improperly')
    )
  );
$$;

create or replace function public._iwdhbp153_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in decision heritage — humility, curiosity, and compassion toward past decisions.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'humility', 'label', 'Humility', 'description', 'Past decisions were made with available information — wisdom not blame'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Explore what can be learned without defensiveness'),
      jsonb_build_object('key', 'acceptance', 'label', 'Acceptance of imperfection', 'description', 'Not every decision ages perfectly — growth is the point'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition of growth', 'description', 'Celebrate how institutional judgment has evolved'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion toward past decisions', 'description', 'People First framing — no guilt or surveillance'),
      jsonb_build_object('key', 'commitment', 'label', 'Commitment to learning', 'description', 'Heritage exists to strengthen future wisdom')
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports thoughtful leadership — never pressure or judgment.'
  );
$$;

create or replace function public._iwdhbp153_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'archive_audit_logs', 'label', 'Decision archive audit logs', 'description', 'Full audit via decision_intelligence_audit_logs and heritage access events'),
    jsonb_build_object('key', 'executive_access_controls', 'label', 'Executive access controls', 'description', 'Visibility levels: leadership, executive, governance — RBAC enforced'),
    jsonb_build_object('key', 'rbac', 'label', 'RBAC', 'description', 'decision_intelligence.view and decision_intelligence.manage permissions'),
    jsonb_build_object('key', 'historical_access_tracking', 'label', 'Historical access tracking', 'description', 'Audit when heritage metadata is retrieved — transparency required'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', '2FA expected for executive heritage access — cross-link Security Dashboard')
  );
$$;

create or replace function public._iwdhbp153_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Future leader preparation — cross-link only'),
    jsonb_build_object('key', 'org_memory', 'label', 'Organizational Legacy Phase 152', 'route', '/app/organizational-memory-engine', 'relationship', 'Institutional memory — cross-link only, never duplicate OME RPCs'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Phase 125', 'route', '/app/decision-intelligence-engine', 'relationship', 'Executive advisory foundation — all _dein_* and _deibp125_* preserved'),
    jsonb_build_object('key', 'wisdom_engine', 'label', 'Wisdom Engine A.93', 'route', '/app/wisdom-engine', 'relationship', 'Experience-to-guidance — cross-link only, never duplicate _wis_* RPCs'),
    jsonb_build_object('key', 'collective_decision', 'label', 'Collective Decision Phase 137', 'route', '/app/collective-decision-council-engine', 'relationship', 'Council perspectives — cross-link only'),
    jsonb_build_object('key', 'odse', 'label', 'ODSE A.54', 'route', '/app/organizational-decision-support-engine', 'relationship', 'Org decision register — cross-link only, never duplicate _odse_*'),
    jsonb_build_object('key', 'org_memory_a34', 'label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'relationship', 'Decision register and experience memory — cross-link'),
    jsonb_build_object('key', 'personal_dse', 'label', 'Personal DSE Phase 38/60', 'route', '/app/assistant/decisions', 'relationship', 'Individual decision guidance — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Humility and compassion in heritage reflection')
  );
$$;

create or replace function public._iwdhbp153_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify dogfoods decision heritage — internal strategic archives and outcome reviews for platform evolution.',
    'examples', jsonb_build_array(
      'Platform expansion archives inform phased rollout decisions',
      'Governance policy update heritage supports board alignment conversations',
      'Outcome reviews capture GP readiness lessons for ecosystem growth',
      'Pattern snapshots highlight recurring operational themes — aggregate only'
    ),
    'boundary_note', 'Internal heritage metadata only — no customer operational data in platform dogfooding examples.'
  );
$$;

create or replace function public._iwdhbp153_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'heritage_preservation', 'label', 'Heritage preservation depth'),
    jsonb_build_object('key', 'outcome_review_cadence', 'label', 'Outcome review cadence'),
    jsonb_build_object('key', 'executive_reflection_engagement', 'label', 'Executive reflection engagement'),
    jsonb_build_object('key', 'future_leader_preparedness', 'label', 'Future leader preparedness'),
    jsonb_build_object('key', 'institutional_learning', 'label', 'Institutional learning velocity'),
    jsonb_build_object('key', 'pattern_awareness', 'label', 'Pattern awareness without judgment'),
    jsonb_build_object('key', 'heritage_transparency', 'label', 'Heritage access transparency'),
    jsonb_build_object('key', 'wisdom_compounding', 'label', 'Wisdom compounding across generations')
  );
$$;

create or replace function public._iwdhbp153_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Preserve understanding not only outcomes — wisdom compounds.',
    'Not to glorify past or resist change.',
    'Patterns support learning NOT judgment.',
    'Growth Partner not Affiliate. People First.',
    'Humans decide; Wisdom Companion prepares context.'
  );
$$;

create or replace function public._iwdhbp153_privacy_note()
returns text language sql immutable as $$
  select 'Legacy & Future Stewardship Phase 153 — decision heritage metadata only. Aggregate pattern themes — no individual judgment scores. RBAC and audit for archive access. No PII, raw transcripts, or improper confidential reveal. Humans retain executive accountability.';
$$;

create or replace function public._iwdhbp153_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_125 jsonb;
  v_heritage jsonb;
begin
  perform public._dein_ensure_settings(p_tenant_id);
  v_125 := public._deibp125_engagement_summary(p_tenant_id);
  v_heritage := public._iwdhbp153_refresh_heritage_metrics(p_tenant_id);

  return v_125 || v_heritage || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._iwdhbp153_objectives()),
    'heritage_center_capabilities', jsonb_array_length((public._iwdhbp153_decision_heritage_center()->'capabilities')),
    'journal_capture_fields', jsonb_array_length((public._iwdhbp153_decision_journal_engine()->'captures')),
    'outcome_review_prompts', jsonb_array_length((public._iwdhbp153_outcome_review_engine()->'prompts')),
    'executive_reflection_dimensions', jsonb_array_length((public._iwdhbp153_executive_reflection_engine()->'dimensions')),
    'wisdom_companion_supports', jsonb_array_length((public._iwdhbp153_wisdom_companion()->'supports')),
    'pattern_theme_types', jsonb_array_length((public._iwdhbp153_decision_pattern_engine()->'pattern_types')),
    'institutional_wisdom_assets', jsonb_array_length((public._iwdhbp153_institutional_wisdom_library()->'assets')),
    'future_leader_areas', jsonb_array_length((public._iwdhbp153_future_leader_preparation_engine()->'areas')),
    'companion_limitations_count', jsonb_array_length((public._iwdhbp153_companion_limitations()->'limitations')),
    'integration_links_count', jsonb_array_length(public._iwdhbp153_integration_links()),
    'success_metrics_count', jsonb_array_length(public._iwdhbp153_success_metrics()),
    'phase153_privacy_note', public._iwdhbp153_privacy_note()
  );
end; $$;

create or replace function public._iwdhbp153_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_heritage jsonb;
begin
  v_heritage := public._iwdhbp153_refresh_heritage_metrics(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Legacy & Stewardship objectives documented', 'met', jsonb_array_length(public._iwdhbp153_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'heritage_center', 'label', 'Decision Heritage Center — eight capabilities', 'met', jsonb_array_length((public._iwdhbp153_decision_heritage_center()->'capabilities')) = 8, 'note', null),
    jsonb_build_object('key', 'journal_engine', 'label', 'Decision journal engine — seven captures', 'met', jsonb_array_length((public._iwdhbp153_decision_journal_engine()->'captures')) = 7, 'note', 'Metadata only.'),
    jsonb_build_object('key', 'outcome_review', 'label', 'Outcome review engine — five prompts', 'met', jsonb_array_length((public._iwdhbp153_outcome_review_engine()->'prompts')) = 5, 'note', 'Learn without blame.'),
    jsonb_build_object('key', 'executive_reflection', 'label', 'Executive reflection engine — five dimensions', 'met', jsonb_array_length((public._iwdhbp153_executive_reflection_engine()->'dimensions')) = 5, 'note', null),
    jsonb_build_object('key', 'wisdom_companion', 'label', 'Wisdom Companion — six supports', 'met', jsonb_array_length((public._iwdhbp153_wisdom_companion()->'supports')) = 6, 'note', 'Does NOT rewrite history.'),
    jsonb_build_object('key', 'pattern_engine', 'label', 'Decision pattern engine — six theme types', 'met', jsonb_array_length((public._iwdhbp153_decision_pattern_engine()->'pattern_types')) = 6, 'note', 'Learning NOT judgment.'),
    jsonb_build_object('key', 'wisdom_library', 'label', 'Institutional wisdom library — six assets', 'met', jsonb_array_length((public._iwdhbp153_institutional_wisdom_library()->'assets')) = 6, 'note', 'Cross-link Phase 152.'),
    jsonb_build_object('key', 'future_leader_prep', 'label', 'Future leader preparation — five areas', 'met', jsonb_array_length((public._iwdhbp153_future_leader_preparation_engine()->'areas')) = 5, 'note', 'Cross-link Phase 151.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five documented', 'met', jsonb_array_length((public._iwdhbp153_companion_limitations()->'limitations')) = 5, 'note', 'No improper confidential reveal.'),
    jsonb_build_object('key', 'security_requirements', 'label', 'Security requirements — five documented', 'met', jsonb_array_length(public._iwdhbp153_security_requirements()) = 5, 'note', 'RBAC and audit.'),
    jsonb_build_object('key', 'integration_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._iwdhbp153_integration_links()) >= 9, 'note', null),
    jsonb_build_object('key', 'phase125_preserved', 'label', 'Phase 125 _dein_* and _deibp125_* fields preserved', 'met', jsonb_array_length(public._deibp125_objectives()) = 8, 'note', 'Phase 153 layers on Phase 125 — does not replace.'),
    jsonb_build_object('key', 'heritage_archives', 'label', 'Heritage archives seeded or captured', 'met', coalesce((v_heritage->>'heritage_archives')::int, 0) >= 1, 'note', null),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 153 vs Phase 125 distinction documented', 'met', position('Phase 125' in public._iwdhbp153_distinction_note()) > 0, 'note', public._iwdhbp153_distinction_note())
  );
end; $$;

create or replace function public._iwdhbp153_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', 'Phase 153 — Institutional Wisdom & Decision Heritage Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE153_INSTITUTIONAL_WISDOM_DECISION_HERITAGE.md',
    'spec_doc', 'INSTITUTIONAL_WISDOM_DECISION_HERITAGE_ENGINE_PHASE153.md',
    'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
    'era', 'Legacy & Future Stewardship Era (151–160)',
    'route', '/app/decision-intelligence-engine',
    'distinction_note', public._iwdhbp153_distinction_note(),
    'mission', public._iwdhbp153_mission(),
    'philosophy', public._iwdhbp153_philosophy(),
    'abos_principle', public._iwdhbp153_abos_principle(),
    'vision', public._iwdhbp153_vision(),
    'objectives', public._iwdhbp153_objectives(),
    'decision_heritage_center', public._iwdhbp153_decision_heritage_center(),
    'decision_journal_engine', public._iwdhbp153_decision_journal_engine(),
    'outcome_review_engine', public._iwdhbp153_outcome_review_engine(),
    'executive_reflection_engine', public._iwdhbp153_executive_reflection_engine(),
    'wisdom_companion', public._iwdhbp153_wisdom_companion(),
    'decision_pattern_engine', public._iwdhbp153_decision_pattern_engine(),
    'institutional_wisdom_library', public._iwdhbp153_institutional_wisdom_library(),
    'future_leader_preparation_engine', public._iwdhbp153_future_leader_preparation_engine(),
    'companion_limitations', public._iwdhbp153_companion_limitations(),
    'self_love_connection', public._iwdhbp153_self_love_connection(),
    'security_requirements', public._iwdhbp153_security_requirements(),
    'integration_links', public._iwdhbp153_integration_links(),
    'dogfooding', public._iwdhbp153_dogfooding(),
    'success_metrics', public._iwdhbp153_success_metrics(),
    'success_criteria', public._iwdhbp153_success_criteria(p_tenant_id),
    'engagement_summary', public._iwdhbp153_engagement_summary(p_tenant_id),
    'vision_phrases', public._iwdhbp153_vision_phrases(),
    'privacy_note', public._iwdhbp153_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs (metadata scaffolds)
-- ---------------------------------------------------------------------------
create or replace function public.archive_decision_heritage_entry(
  p_title text,
  p_decision_summary text,
  p_context_summary text default null,
  p_alternatives_summary text default null,
  p_workspace_key text default null,
  p_visibility text default 'leadership',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._dein_require_tenant();

  if p_title is null or trim(p_title) = '' or p_decision_summary is null or trim(p_decision_summary) = '' then
    raise exception 'title_and_decision_summary_required';
  end if;

  if p_visibility is not null and p_visibility not in ('leadership', 'executive', 'governance') then
    raise exception 'invalid_visibility';
  end if;

  v_key := 'heritage_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.decision_heritage_archives (
    tenant_id, archive_key, workspace_key, title, decision_summary,
    context_summary, alternatives_summary, status, visibility, metadata
  )
  values (
    v_tenant_id, v_key, p_workspace_key, trim(p_title), left(trim(p_decision_summary), 500),
    case when p_context_summary is not null then left(trim(p_context_summary), 500) else null end,
    case when p_alternatives_summary is not null then left(trim(p_alternatives_summary), 500) else null end,
    'active', coalesce(p_visibility, 'leadership'),
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._dein_log_audit(v_tenant_id, 'heritage_archive_created', trim(p_title),
    jsonb_build_object('archive_key', v_key, 'visibility', coalesce(p_visibility, 'leadership')));

  return jsonb_build_object(
    'success', true,
    'archive_id', v_id,
    'archive_key', v_key,
    'status', 'active',
    'companion_limitation', 'Wisdom Companion does NOT rewrite historical records.',
    'privacy_note', public._iwdhbp153_privacy_note()
  );
end; $$;

create or replace function public.record_decision_outcome_review(
  p_title text,
  p_archive_key text default null,
  p_what_happened_summary text default null,
  p_assumptions_accurate_summary text default null,
  p_surprises_summary text default null,
  p_future_leader_guidance_summary text default null,
  p_differently_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._dein_require_tenant();

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'outcome_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.decision_heritage_outcome_reviews (
    tenant_id, review_key, archive_key, title,
    what_happened_summary, assumptions_accurate_summary, surprises_summary,
    future_leader_guidance_summary, differently_summary, status, metadata
  )
  values (
    v_tenant_id, v_key, p_archive_key, trim(p_title),
    case when p_what_happened_summary is not null then left(trim(p_what_happened_summary), 500) else null end,
    case when p_assumptions_accurate_summary is not null then left(trim(p_assumptions_accurate_summary), 500) else null end,
    case when p_surprises_summary is not null then left(trim(p_surprises_summary), 500) else null end,
    case when p_future_leader_guidance_summary is not null then left(trim(p_future_leader_guidance_summary), 500) else null end,
    case when p_differently_summary is not null then left(trim(p_differently_summary), 500) else null end,
    'active',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._dein_log_audit(v_tenant_id, 'outcome_review_recorded', trim(p_title),
    jsonb_build_object('review_key', v_key, 'archive_key', p_archive_key));

  return jsonb_build_object(
    'success', true,
    'review_id', v_id,
    'review_key', v_key,
    'status', 'active',
    'companion_limitation', 'Patterns support learning NOT judgment.',
    'privacy_note', public._iwdhbp153_privacy_note()
  );
end; $$;

create or replace function public.record_executive_decision_reflection(
  p_reflection_type text,
  p_title text,
  p_reflection_summary text,
  p_archive_key text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._dein_require_tenant();

  if p_reflection_type is null or p_reflection_type not in (
    'decision_experience', 'transformation_insight', 'governance_lesson',
    'cultural_consideration', 'future_recommendation', 'leadership_reflection'
  ) then
    raise exception 'invalid_reflection_type';
  end if;

  if p_title is null or trim(p_title) = '' or p_reflection_summary is null or trim(p_reflection_summary) = '' then
    raise exception 'title_and_reflection_summary_required';
  end if;

  v_key := 'reflection_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.decision_heritage_executive_reflections (
    tenant_id, reflection_key, archive_key, reflection_type, title, reflection_summary, status, metadata
  )
  values (
    v_tenant_id, v_key, p_archive_key, p_reflection_type, trim(p_title), left(trim(p_reflection_summary), 500),
    'active',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._dein_log_audit(v_tenant_id, 'executive_reflection_recorded', trim(p_title),
    jsonb_build_object('reflection_key', v_key, 'reflection_type', p_reflection_type));

  return jsonb_build_object(
    'success', true,
    'reflection_id', v_id,
    'reflection_key', v_key,
    'status', 'active',
    'companion_limitation', 'Wisdom Companion does NOT replace executive accountability.',
    'privacy_note', public._iwdhbp153_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard + Card RPC — preserve ALL Phase 125 _dein_* and _deibp125_*; append Phase 153
-- ---------------------------------------------------------------------------
create or replace function public.get_decision_intelligence_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.decision_intelligence_settings;
  v_metrics jsonb;
  v_engagement jsonb;
  v_heritage jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._dein_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._dein_ensure_settings(v_tenant_id);
  perform public._dein_seed_workspaces(v_tenant_id);
  perform public._dein_seed_journal_entries(v_tenant_id);
  perform public._dein_seed_assumption_reviews(v_tenant_id);
  perform public._dein_seed_outcome_learnings(v_tenant_id);
  v_metrics := public._dein_refresh_metrics(v_tenant_id);
  v_engagement := public._deibp125_engagement_summary(v_tenant_id);
  v_heritage := public._iwdhbp153_refresh_heritage_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'decision_quality_score', v_metrics->'decision_quality_score',
    'active_workspaces', v_metrics->'active_workspaces',
    'journal_entries', v_metrics->'journal_entries',
    'philosophy', public._deibp125_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'intelligence_center_enabled', v_settings.intelligence_center_enabled,
    'implementation_blueprint_phase125', jsonb_build_object(
      'phase', 'Phase 125 — Decision Intelligence & Executive Advisory Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE125_DECISION_INTELLIGENCE_EXECUTIVE_ADVISORY.md',
      'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
      'route', '/app/decision-intelligence-engine',
      'mapping_note', 'Humans decide — advisory scaffolds only.'
    ),
    'decision_intelligence_mission', public._deibp125_mission(),
    'decision_intelligence_abos_principle', public._deibp125_abos_principle(),
    'decision_intelligence_engagement_summary', v_engagement,
    'decision_intelligence_vision_note', public._deibp125_vision(),
    'implementation_blueprint_phase153', jsonb_build_object(
      'phase', 'Phase 153 — Institutional Wisdom & Decision Heritage Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE153_INSTITUTIONAL_WISDOM_DECISION_HERITAGE.md',
      'spec_doc', 'INSTITUTIONAL_WISDOM_DECISION_HERITAGE_ENGINE_PHASE153.md',
      'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/decision-intelligence-engine',
      'mapping_note', 'Legacy era decision heritage depth — all Phase 125 fields preserved.'
    ),
    'phase153_mission', public._iwdhbp153_mission(),
    'phase153_abos_principle', public._iwdhbp153_abos_principle(),
    'phase153_vision', public._iwdhbp153_vision(),
    'phase153_engagement_summary', public._iwdhbp153_engagement_summary(v_tenant_id),
    'phase153_heritage_archives', v_heritage->'heritage_archives',
    'phase153_note', 'Legacy & Future Stewardship Phase 153 — institutional decision heritage, outcome reviews, and wisdom compounding on Phase 125 scaffolds.',
    'phase153_distinction_note', public._iwdhbp153_distinction_note()
  );
end; $$;

create or replace function public.get_decision_intelligence_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.decision_intelligence_settings;
  v_metrics jsonb;
  v_heritage jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._dein_require_tenant());
  v_settings := public._dein_ensure_settings(v_tenant_id);
  perform public._dein_seed_workspaces(v_tenant_id);
  perform public._dein_seed_journal_entries(v_tenant_id);
  perform public._dein_seed_assumption_reviews(v_tenant_id);
  perform public._dein_seed_outcome_learnings(v_tenant_id);
  v_metrics := public._dein_refresh_metrics(v_tenant_id);
  v_heritage := public._iwdhbp153_refresh_heritage_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'intelligence_center_enabled', v_settings.intelligence_center_enabled,
    'advisory_briefings_enabled', v_settings.advisory_briefings_enabled,
    'assumption_reviews_enabled', v_settings.assumption_reviews_enabled,
    'tradeoff_analysis_enabled', v_settings.tradeoff_analysis_enabled,
    'outcome_tracking_enabled', v_settings.outcome_tracking_enabled,
    'reflection_sessions_enabled', v_settings.reflection_sessions_enabled,
    'philosophy', public._deibp125_philosophy(),
    'distinction_note', public._deibp125_distinction_note(),
    'safety_note', 'Decision Intelligence Center — humans decide. Metadata-only journal and workspace records. No binding recommendations.',
    'decision_quality_score', v_metrics->'decision_quality_score',
    'active_workspaces', v_metrics->'active_workspaces',
    'journal_entries', v_metrics->'journal_entries',
    'assumption_reviews', v_metrics->'assumption_reviews',
    'outcome_learnings', v_metrics->'outcome_learnings',
    'intelligence_center_capabilities_count', v_metrics->'intelligence_center_capabilities_count',
    'workspace_fields_count', v_metrics->'workspace_fields_count',
    'assumption_types_count', v_metrics->'assumption_types_count',
    'workspaces', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workspace_key', w.workspace_key, 'title', w.title,
        'decision_statement', w.decision_statement, 'status', w.status,
        'cross_link_route', w.cross_link_route
      ) order by w.updated_at desc)
      from public.decision_intelligence_workspaces w where w.tenant_id = v_tenant_id and w.status in ('active', 'draft', 'review')
    ), '[]'::jsonb),
    'journals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', j.id, 'journal_key', j.journal_key, 'workspace_key', j.workspace_key,
        'title', j.title, 'decision_date', j.decision_date, 'status', j.status,
        'rationale_summary', j.rationale_summary
      ) order by j.updated_at desc)
      from public.decision_intelligence_journal_entries j where j.tenant_id = v_tenant_id and j.status in ('active', 'review')
    ), '[]'::jsonb),
    'assumptions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'assumption_key', a.assumption_key, 'assumption_type', a.assumption_type,
        'title', a.title, 'summary', a.summary, 'confidence', a.confidence, 'status', a.status
      ) order by a.updated_at desc)
      from public.decision_intelligence_assumption_reviews a where a.tenant_id = v_tenant_id and a.status in ('active', 'challenged', 'validated')
    ), '[]'::jsonb),
    'outcome_learnings_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'learning_key', o.learning_key, 'title', o.title,
        'what_worked_summary', o.what_worked_summary, 'change_summary', o.change_summary,
        'captured_at', o.captured_at, 'status', o.status
      ) order by o.captured_at desc)
      from public.decision_intelligence_outcome_learnings o where o.tenant_id = v_tenant_id and o.status in ('active', 'review')
    ), '[]'::jsonb),
    'workspace_field_scaffolds', public._dein_workspace_field_scaffolds(),
    'assumption_type_scaffolds', public._dein_assumption_type_scaffolds(),
    'tradeoff_question_scaffolds', public._dein_tradeoff_questions(),
    'stakeholder_group_scaffolds', public._dein_stakeholder_groups(),
    'integration_links', public._deibp125_cross_links(),
    'implementation_blueprint_phase125', jsonb_build_object(
      'phase', 'Phase 125 — Decision Intelligence & Executive Advisory Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE125_DECISION_INTELLIGENCE_EXECUTIVE_ADVISORY.md',
      'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
      'route', '/app/decision-intelligence-engine',
      'mapping_note', 'Humans decide — advisory scaffolds only.'
    ),
    'decision_intelligence_blueprint', public._deibp125_blueprint_block(v_tenant_id),
    'decision_intelligence_mission', public._deibp125_mission(),
    'decision_intelligence_philosophy', public._deibp125_philosophy(),
    'decision_intelligence_abos_principle', public._deibp125_abos_principle(),
    'decision_intelligence_objectives', public._deibp125_objectives(),
    'decision_intelligence_center', public._deibp125_decision_intelligence_center(),
    'decision_workspaces', public._deibp125_decision_workspaces(),
    'executive_advisory_companion', public._deibp125_executive_advisory_companion(),
    'assumption_intelligence', public._deibp125_assumption_intelligence(),
    'tradeoff_analysis', public._deibp125_tradeoff_analysis(),
    'stakeholder_impact', public._deibp125_stakeholder_impact(),
    'decision_journal', public._deibp125_decision_journal(),
    'outcome_learning', public._deibp125_outcome_learning(),
    'executive_reflection', public._deibp125_executive_reflection(),
    'companion_limitations', public._deibp125_companion_limitations(),
    'self_love_in_decisions', public._deibp125_self_love_in_decisions(),
    'decision_knowledge_library', public._deibp125_decision_knowledge_library(),
    'deibp125_cross_links', public._deibp125_cross_links(),
    'limitation_principles', public._deibp125_limitation_principles(),
    'companion_adaptation', public._deibp125_companion_adaptation(),
    'engagement_summary', public._deibp125_engagement_summary(v_tenant_id),
    'success_criteria', public._deibp125_success_criteria(v_tenant_id),
    'success_metrics', public._deibp125_success_metrics(),
    'decision_intelligence_vision', public._deibp125_vision(),
    'privacy_note', 'Decision intelligence metadata only — workspace scaffolds, journal summaries, assumption reviews. No customer email, chat, meeting transcripts, or PII. Humans decide.',
    'implementation_blueprint_phase153', jsonb_build_object(
      'phase', 'Phase 153 — Institutional Wisdom & Decision Heritage Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE153_INSTITUTIONAL_WISDOM_DECISION_HERITAGE.md',
      'spec_doc', 'INSTITUTIONAL_WISDOM_DECISION_HERITAGE_ENGINE_PHASE153.md',
      'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/decision-intelligence-engine',
      'mapping_note', 'Legacy era decision heritage depth — strategic archives, outcome reviews, executive reflections, pattern themes. All Phase 125 fields preserved.'
    ),
    'decision_heritage_blueprint', public._iwdhbp153_blueprint_block(v_tenant_id),
    'phase153_distinction_note', public._iwdhbp153_distinction_note(),
    'phase153_mission', public._iwdhbp153_mission(),
    'phase153_philosophy', public._iwdhbp153_philosophy(),
    'phase153_abos_principle', public._iwdhbp153_abos_principle(),
    'phase153_vision', public._iwdhbp153_vision(),
    'phase153_objectives', public._iwdhbp153_objectives(),
    'phase153_decision_heritage_center', public._iwdhbp153_decision_heritage_center(),
    'phase153_decision_journal_engine', public._iwdhbp153_decision_journal_engine(),
    'phase153_outcome_review_engine', public._iwdhbp153_outcome_review_engine(),
    'phase153_executive_reflection_engine', public._iwdhbp153_executive_reflection_engine(),
    'phase153_wisdom_companion', public._iwdhbp153_wisdom_companion(),
    'phase153_decision_pattern_engine', public._iwdhbp153_decision_pattern_engine(),
    'phase153_institutional_wisdom_library', public._iwdhbp153_institutional_wisdom_library(),
    'phase153_future_leader_preparation_engine', public._iwdhbp153_future_leader_preparation_engine(),
    'phase153_companion_limitations', public._iwdhbp153_companion_limitations(),
    'phase153_self_love_connection', public._iwdhbp153_self_love_connection(),
    'phase153_security_requirements', public._iwdhbp153_security_requirements(),
    'iwdhbp153_integration_links', public._iwdhbp153_integration_links(),
    'phase153_dogfooding', public._iwdhbp153_dogfooding(),
    'phase153_success_metrics', public._iwdhbp153_success_metrics(),
    'phase153_success_criteria', public._iwdhbp153_success_criteria(v_tenant_id),
    'phase153_engagement_summary', public._iwdhbp153_engagement_summary(v_tenant_id),
    'phase153_vision_phrases', public._iwdhbp153_vision_phrases(),
    'phase153_heritage_metrics', v_heritage,
    'decision_heritage_note', 'Legacy & Future Stewardship Phase 153 — preserve reasoning not glorify past; wisdom compounds. Wisdom Companion supports understanding — does NOT rewrite history.',
    'phase153_privacy_note', public._iwdhbp153_privacy_note(),
    'phase153_sections', jsonb_build_object(
      'heritage_archives', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ha.id, 'archive_key', ha.archive_key, 'title', ha.title,
          'decision_summary', ha.decision_summary, 'status', ha.status, 'visibility', ha.visibility
        ) order by ha.updated_at desc)
        from public.decision_heritage_archives ha where ha.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb),
      'outcome_reviews', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', orv.id, 'review_key', orv.review_key, 'title', orv.title,
          'what_happened_summary', orv.what_happened_summary, 'status', orv.status
        ) order by orv.updated_at desc)
        from public.decision_heritage_outcome_reviews orv where orv.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb),
      'executive_reflections', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', er.id, 'reflection_key', er.reflection_key, 'reflection_type', er.reflection_type,
          'title', er.title, 'reflection_summary', er.reflection_summary, 'status', er.status
        ) order by er.updated_at desc)
        from public.decision_heritage_executive_reflections er where er.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb),
      'pattern_snapshots', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ps.id, 'snapshot_key', ps.snapshot_key, 'pattern_type', ps.pattern_type,
          'title', ps.title, 'theme_summary', ps.theme_summary, 'status', ps.status
        ) order by ps.captured_at desc)
        from public.decision_heritage_pattern_snapshots ps where ps.tenant_id = v_tenant_id limit 20
      ), '[]'::jsonb)
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._iwdhbp153_distinction_note() to authenticated;
grant execute on function public._iwdhbp153_mission() to authenticated;
grant execute on function public._iwdhbp153_philosophy() to authenticated;
grant execute on function public._iwdhbp153_abos_principle() to authenticated;
grant execute on function public._iwdhbp153_vision() to authenticated;
grant execute on function public._iwdhbp153_objectives() to authenticated;
grant execute on function public._iwdhbp153_decision_heritage_center() to authenticated;
grant execute on function public._iwdhbp153_decision_journal_engine() to authenticated;
grant execute on function public._iwdhbp153_outcome_review_engine() to authenticated;
grant execute on function public._iwdhbp153_executive_reflection_engine() to authenticated;
grant execute on function public._iwdhbp153_wisdom_companion() to authenticated;
grant execute on function public._iwdhbp153_decision_pattern_engine() to authenticated;
grant execute on function public._iwdhbp153_institutional_wisdom_library() to authenticated;
grant execute on function public._iwdhbp153_future_leader_preparation_engine() to authenticated;
grant execute on function public._iwdhbp153_companion_limitations() to authenticated;
grant execute on function public._iwdhbp153_self_love_connection() to authenticated;
grant execute on function public._iwdhbp153_security_requirements() to authenticated;
grant execute on function public._iwdhbp153_integration_links() to authenticated;
grant execute on function public._iwdhbp153_dogfooding() to authenticated;
grant execute on function public._iwdhbp153_success_metrics() to authenticated;
grant execute on function public._iwdhbp153_vision_phrases() to authenticated;
grant execute on function public._iwdhbp153_privacy_note() to authenticated;
grant execute on function public._iwdhbp153_engagement_summary(uuid) to authenticated;
grant execute on function public._iwdhbp153_success_criteria(uuid) to authenticated;
grant execute on function public._iwdhbp153_blueprint_block(uuid) to authenticated;
grant execute on function public._iwdhbp153_refresh_heritage_metrics(uuid) to authenticated;
grant execute on function public.archive_decision_heritage_entry(text, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.record_decision_outcome_review(text, text, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.record_executive_decision_reflection(text, text, text, text, jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'institutional-wisdom-decision-heritage-blueprint-phase153', 'Institutional Wisdom & Decision Heritage (Phase 153)',
  'Legacy & Future Stewardship Phase 153 — extends Decision Intelligence Phase 125 with decision heritage archives, outcome reviews, executive reflections, and aggregate pattern themes. Wisdom Companion supports understanding — does NOT rewrite history.',
  'authenticated', 153
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'institutional-wisdom-decision-heritage-blueprint-phase153' and tenant_id is null
);
