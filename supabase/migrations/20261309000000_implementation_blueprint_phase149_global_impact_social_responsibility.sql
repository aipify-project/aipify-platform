-- Implementation Blueprint Phase 149 — Global Impact & Social Responsibility Engine
-- Extends Social Impact & Purpose Engine (Phase 118) at /app/social-impact-purpose-engine.
-- Global Intelligence & Interorganizational Era (141–150).
-- Helpers: _gisrb149_* (never collide with _sipe_*, _sipbp118_*)

-- ---------------------------------------------------------------------------
-- 1. Optional tenant-scoped tables (extend Phase 118 — metadata scaffolds)
-- ---------------------------------------------------------------------------
create table if not exists public.social_impact_community_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  initiative_type text not null check (
    initiative_type in (
      'volunteer_activity', 'community_partnership', 'educational_outreach',
      'scholarship_program', 'local_economic_contribution', 'professional_development'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'paused', 'completed', 'archived')
  ),
  participation_count int not null default 0,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, initiative_key)
);

create index if not exists social_impact_community_initiatives_tenant_idx
  on public.social_impact_community_initiatives (tenant_id, initiative_type, status);

alter table public.social_impact_community_initiatives enable row level security;
revoke all on public.social_impact_community_initiatives from authenticated, anon;

create table if not exists public.social_impact_wellbeing_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_key text not null,
  program_type text not null check (
    program_type in (
      'mental_wellbeing', 'work_life_balance', 'recognition', 'learning_opportunities',
      'career_growth', 'psychological_safety', 'inclusive_leadership', 'collective_care'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'paused', 'completed', 'archived')
  ),
  adoption_count int not null default 0,
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, program_key)
);

create index if not exists social_impact_wellbeing_programs_tenant_idx
  on public.social_impact_wellbeing_programs (tenant_id, program_type, status);

alter table public.social_impact_wellbeing_programs enable row level security;
revoke all on public.social_impact_wellbeing_programs from authenticated, anon;

create table if not exists public.social_impact_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_key text not null,
  report_type text not null check (
    report_type in (
      'community_contribution_summary', 'employee_development_review',
      'knowledge_sharing_report', 'gp_impact_statement', 'leadership_reflection',
      'purpose_alignment_review', 'stewardship_outcome'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published_summary', 'archived')
  ),
  reflection_notes text check (reflection_notes is null or char_length(reflection_notes) <= 500),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, report_key)
);

create index if not exists social_impact_reports_tenant_idx
  on public.social_impact_reports (tenant_id, report_type, status);

alter table public.social_impact_reports enable row level security;
revoke all on public.social_impact_reports from authenticated, anon;

create table if not exists public.social_impact_executive_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_dimension text not null check (
    review_dimension in (
      'employee_experiences', 'community_relationships', 'technology_impacts',
      'organizational_culture', 'purpose_alignment', 'gp_contributions', 'stewardship_outcomes'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists social_impact_executive_reviews_tenant_idx
  on public.social_impact_executive_reviews (tenant_id, review_dimension, status);

alter table public.social_impact_executive_reviews enable row level security;
revoke all on public.social_impact_executive_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Blueprint helpers (_gisrb149_*)
-- ---------------------------------------------------------------------------
create or replace function public._gisrb149_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 149 — Global Impact & Social Responsibility at /app/social-impact-purpose-engine. Extends Social Impact & Purpose Engine Phase 118 — do NOT create duplicate impact center or social scoring systems. Global Intelligence Era (141–150). Authentic responsibility and measurable contribution — NOT virtue signaling, NOT social scoring/ranking organizations. Distinct from Purpose & Values A.82 + Phase 138 at /app/purpose-values-engine (values alignment — cross-link only). Distinct from Impact Engine A.85 at /app/impact-engine (outcome measurement — cross-link only). Distinct from Innovation & Impact A.28 at /app/innovation-impact-engine. Distinct from Platform Anonymised Impact at /platform/impact (marketing proof — NOT tenant social scoring). Helpers _gisrb149_* — never collide with _sipe_*, _sipbp118_*. Growth Partner not Affiliate.';
$$;

create or replace function public._gisrb149_mission()
returns text language sql immutable as $$
  select 'Help organizations steward authentic social responsibility — tracking community initiatives, supporting employee wellbeing programs, reporting contributions thoughtfully, and guiding leadership reflection — without scoring worth, imposing ideology, or replacing executive accountability.';
$$;

create or replace function public._gisrb149_philosophy()
returns text language sql immutable as $$
  select 'Authentic responsibility and measurable contribution — not virtue signaling or PR campaigns. People First. Stewardship through responsibility. Growth Partner not Affiliate. Impact Companion encourages awareness; humans define commitments and accountability.';
$$;

create or replace function public._gisrb149_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Impact & Social Responsibility extends Phase 118 Purpose Center with Global Intelligence Era depth. Purpose & Values A.82, Impact Engine A.85, and Platform Anonymised Impact remain authoritative for their domains. Aipify informs and prepares; executives retain accountability.';
$$;

create or replace function public._gisrb149_vision()
returns text language sql immutable as $$
  select 'Organizations contribute meaningfully to communities and people — visible stewardship, thoughtful reporting, and leadership reflection — because authentic responsibility builds trust that marketing cannot manufacture.';
$$;

create or replace function public._gisrb149_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_impact_center', 'label', 'Global impact center', 'description', 'Impact dashboards, community initiative tracking, wellbeing programs, contribution reporting, leadership reflection, GP impact reviews, purpose alignment insights, impact knowledge libraries'),
    jsonb_build_object('key', 'social_responsibility_engine', 'label', 'Social responsibility engine', 'description', 'Community investment, employee support, educational contributions, knowledge sharing, mentorship, GP development, responsible technology, ethical business conduct'),
    jsonb_build_object('key', 'community_impact_engine', 'label', 'Community impact engine', 'description', 'Volunteer activities, partnerships, educational outreach, scholarships, local economic contributions, professional development'),
    jsonb_build_object('key', 'employee_wellbeing_framework', 'label', 'Employee wellbeing framework', 'description', 'Organizational initiatives — mental wellbeing, work-life balance, recognition, learning, career growth, psychological safety, inclusive leadership — NOT surveillance'),
    jsonb_build_object('key', 'impact_reporting_engine', 'label', 'Impact reporting engine', 'description', 'Community contribution summaries, employee development reviews, knowledge sharing reports, GP impact statements, leadership reflection, purpose alignment reviews'),
    jsonb_build_object('key', 'impact_companion', 'label', 'Impact Companion', 'description', 'Reflection prompts, opportunity identification, knowledge recommendations, reporting guidance — does NOT assign morality or social scores'),
    jsonb_build_object('key', 'growth_partner_impact', 'label', 'Growth Partner impact program', 'description', 'Mentorship, educational activities, knowledge sharing, community leadership, professional development, responsible business practices'),
    jsonb_build_object('key', 'executive_impact_reviews', 'label', 'Executive impact reviews', 'description', 'Employee experiences, community relationships, technology impacts, culture, purpose alignment, GP contributions, stewardship outcomes')
  );
$$;

create or replace function public._gisrb149_global_impact_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global impact center — eight capabilities extending Phase 118 Purpose Center with Global Intelligence Era social responsibility depth.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'impact_dashboards', 'label', 'Impact dashboards', 'description', 'Aggregate initiative and contribution visibility — metadata only'),
      jsonb_build_object('key', 'community_initiative_tracking', 'label', 'Community initiative tracking', 'description', 'Volunteer, partnerships, educational outreach — participation counts only'),
      jsonb_build_object('key', 'wellbeing_programs', 'label', 'Employee wellbeing programs', 'description', 'Organizational initiative scaffolds — NOT employee surveillance'),
      jsonb_build_object('key', 'contribution_reporting', 'label', 'Social contribution reporting', 'description', 'Thoughtful contribution summaries — not performative ESG scoring'),
      jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection frameworks', 'description', 'Executive reflection records — humans decide accountability'),
      jsonb_build_object('key', 'gp_impact_reviews', 'label', 'Growth Partner impact reviews', 'description', 'GP mentorship and community leadership contributions — cross-link /app/growth-partner-operations'),
      jsonb_build_object('key', 'purpose_alignment_insights', 'label', 'Purpose alignment insights', 'description', 'Cross-link Purpose & Values Phase 138 — reflection not ideology'),
      jsonb_build_object('key', 'impact_knowledge_libraries', 'label', 'Impact knowledge libraries', 'description', 'Approved impact knowledge — cross-link Global Knowledge Exchange Phase 141')
    )
  );
$$;

create or replace function public._gisrb149_social_responsibility_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'community_investment', 'label', 'Community investment', 'description', 'Sustained community program stewardship — metadata counts'),
    jsonb_build_object('key', 'employee_support_programs', 'label', 'Employee support programs', 'description', 'Wellbeing and resilience initiatives — cross-link Self Love A.76'),
    jsonb_build_object('key', 'educational_contributions', 'label', 'Educational contributions', 'description', 'Educational outreach and scholarship programs'),
    jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'description', 'Approved knowledge contributions — cross-link Phase 141'),
    jsonb_build_object('key', 'professional_mentorship', 'label', 'Professional mentorship', 'description', 'Voluntary mentorship programs — cross-link Community'),
    jsonb_build_object('key', 'gp_development', 'label', 'Growth Partner development', 'description', 'GP professional development and community leadership'),
    jsonb_build_object('key', 'responsible_technology', 'label', 'Responsible technology', 'description', 'Ethical technology stewardship — cross-link AI Ethics'),
    jsonb_build_object('key', 'ethical_business_conduct', 'label', 'Ethical business conduct', 'description', 'Conduct frameworks — cross-link Ecosystem Governance 119/146')
  );
$$;

create or replace function public._gisrb149_community_impact_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'volunteer_activities', 'label', 'Volunteer activities', 'description', 'Organized volunteer participation — aggregate metadata only'),
    jsonb_build_object('key', 'community_partnerships', 'label', 'Community partnerships', 'description', 'Local and regional partnership programs'),
    jsonb_build_object('key', 'educational_outreach', 'label', 'Educational outreach', 'description', 'Educational access and outreach initiatives'),
    jsonb_build_object('key', 'scholarships', 'label', 'Scholarships', 'description', 'Scholarship and educational sponsorship programs'),
    jsonb_build_object('key', 'local_economic_contributions', 'label', 'Local economic contributions', 'description', 'Regional economic stewardship — metadata only'),
    jsonb_build_object('key', 'professional_development_programs', 'label', 'Professional development programs', 'description', 'Community professional development — cross-link GP Ops 114')
  );
$$;

create or replace function public._gisrb149_employee_wellbeing_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Employee wellbeing framework — organizational initiatives, NOT employee surveillance.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'mental_wellbeing', 'label', 'Mental wellbeing'),
      jsonb_build_object('key', 'work_life_balance', 'label', 'Work-life balance'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'cross_link', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'learning_opportunities', 'label', 'Learning opportunities'),
      jsonb_build_object('key', 'career_growth', 'label', 'Career growth'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety'),
      jsonb_build_object('key', 'inclusive_leadership', 'label', 'Inclusive leadership', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'collective_care', 'label', 'Collective care', 'cross_link', '/app/self-love-engine')
    ),
    'employee_experience_route', '/app/organizational-health-engine',
    'boundary_note', 'Organizational initiative scaffolds only — no individual monitoring or surveillance.'
  );
$$;

create or replace function public._gisrb149_impact_reporting_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'community_contribution_summaries', 'label', 'Community contribution summaries', 'description', 'Aggregate community impact reporting — metadata only'),
    jsonb_build_object('key', 'employee_development_reviews', 'label', 'Employee development reviews', 'description', 'Development program summaries — not individual performance surveillance'),
    jsonb_build_object('key', 'knowledge_sharing_reports', 'label', 'Knowledge sharing reports', 'description', 'Knowledge contribution summaries — cross-link Phase 141'),
    jsonb_build_object('key', 'gp_impact_statements', 'label', 'Growth Partner impact statements', 'description', 'GP community and mentorship contributions'),
    jsonb_build_object('key', 'leadership_reflection_reports', 'label', 'Leadership reflection reports', 'description', 'Executive reflection records — humans retain accountability'),
    jsonb_build_object('key', 'purpose_alignment_reviews', 'label', 'Purpose alignment reviews', 'description', 'Cross-link Purpose & Values Phase 138 — reflection not scoring')
  );
$$;

create or replace function public._gisrb149_impact_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Impact Companion — reflection prompts, opportunity identification, knowledge recommendations, reporting guidance, community initiative support, leadership summaries.',
    'may', jsonb_build_array(
      'Reflection prompts', 'Impact opportunity identification', 'Knowledge recommendations',
      'Reporting guidance', 'Community initiative support', 'Leadership summaries'
    ),
    'must_avoid', jsonb_build_array(
      'Assigning social scores or morality ratings',
      'Judging organizational worth',
      'Imposing ideology',
      'Publishing sensitive information',
      'Replacing executive accountability'
    ),
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'reflection_prompt', 'prompt', 'Two community initiatives are active — shall Aipify prepare a calm contribution summary for leadership reflection?', 'consideration', 'Awareness not judgment — humans decide next steps'),
      jsonb_build_object('emoji', '🌹', 'key', 'wellbeing_opportunity', 'prompt', 'A wellbeing program adoption signal is growing — would reviewing one organizational initiative before expanding feel wise?', 'consideration', 'Encourage support — never replace human care'),
      jsonb_build_object('emoji', '🔔', 'key', 'knowledge_recommendation', 'prompt', 'An approved impact knowledge article from Global Knowledge Exchange may inform your next community report — available when you are ready.', 'consideration', 'Cross-link Phase 141 — no pressure framing')
    ),
    'boundary_note', 'Impact Companion encourages awareness — does NOT assign morality or social scores.'
  );
$$;

create or replace function public._gisrb149_growth_partner_impact_program()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner impact program — mentorship, education, knowledge sharing, community leadership, professional development, responsible business practices.',
    'program_types', jsonb_build_array(
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship'),
      jsonb_build_object('key', 'educational_activities', 'label', 'Educational activities'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
      jsonb_build_object('key', 'community_leadership', 'label', 'Community leadership'),
      jsonb_build_object('key', 'professional_development', 'label', 'Professional development'),
      jsonb_build_object('key', 'responsible_business_practices', 'label', 'Responsible business practices')
    ),
    'cross_link', '/app/growth-partner-operations',
    'terminology_note', 'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._gisrb149_executive_impact_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive impact reviews — seven dimensions. Awareness supports stewardship — not image management or social scoring.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'employee_experiences', 'label', 'Employee experiences', 'cross_link', '/app/organizational-health-engine'),
      jsonb_build_object('key', 'community_relationships', 'label', 'Community relationships', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'technology_impacts', 'label', 'Technology impacts', 'cross_link', '/app/ai-ethics-responsible-use-engine'),
      jsonb_build_object('key', 'organizational_culture', 'label', 'Organizational culture'),
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'gp_contributions', 'label', 'Growth Partner contributions', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'stewardship_outcomes', 'label', 'Stewardship outcomes', 'cross_link', '/app/impact-engine')
    ),
    'boundary_note', 'Executive reflection metadata — humans retain accountability.'
  );
$$;

create or replace function public._gisrb149_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'No social scores or organizational worth rankings',
    'No moral judgment or ideology enforcement',
    'No publishing sensitive operational or personal information',
    'No replacement of executive accountability for impact decisions',
    'No performative ESG gamification or virtue signaling automation',
    'No duplicating Impact Engine A.85 or Platform Anonymised Impact RPCs'
  );
$$;

create or replace function public._gisrb149_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — compassion, empathy, service, recognition, personal growth, collective care in organizational impact stewardship.',
    'values', jsonb_build_array('compassion', 'empathy', 'service', 'recognition', 'personal_growth', 'collective_care'),
    'vision', 'Organizations that care for people contribute more meaningfully to communities.',
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._gisrb149_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Impact reporting audit trails via social_impact_purpose_audit_logs',
    'Executive review histories with RBAC via social_impact_purpose permissions',
    'Community participation controls — metadata counts only, no PII',
    'Wellbeing program metadata — organizational aggregates, NOT individual surveillance',
    '2FA recommended for social_impact_purpose.manage administrators',
    'Human oversight required default true — preserved from Phase 118'
  );
$$;

create or replace function public._gisrb149_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'social_impact_purpose_118', 'label', 'Social Impact & Purpose Phase 118', 'route', '/app/social-impact-purpose-engine', 'relationship', 'Base Purpose Center — extended, not duplicated'),
    jsonb_build_object('key', 'purpose_values_138', 'label', 'Purpose & Values A.82 + Phase 138', 'route', '/app/purpose-values-engine', 'relationship', 'Values alignment — cross-link only'),
    jsonb_build_object('key', 'impact_engine', 'label', 'Impact Engine A.85', 'route', '/app/impact-engine', 'relationship', 'Outcome measurement — cross-link only'),
    jsonb_build_object('key', 'innovation_impact', 'label', 'Innovation & Impact A.28', 'route', '/app/innovation-impact-engine', 'relationship', 'Innovation impact cross-link'),
    jsonb_build_object('key', 'platform_impact', 'label', 'Platform Anonymised Impact', 'route', '/platform/impact', 'relationship', 'Marketing proof — NOT tenant social scoring'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Wellbeing principles — cross-link'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'relationship', 'Human Values Charter — cross-link'),
    jsonb_build_object('key', 'employee_experience_96', 'label', 'Employee Experience Phase 96', 'route', '/app/organizational-health-engine', 'relationship', 'Wellbeing cross-link — aggregate metadata only'),
    jsonb_build_object('key', 'ecosystem_governance', 'label', 'Ecosystem Governance Phase 119/146', 'route', '/app/ecosystem-governance', 'relationship', 'Governance and certification cross-link'),
    jsonb_build_object('key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Impact knowledge libraries — cross-link'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Operations Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'GP impact program — cross-link')
  );
$$;

create or replace function public._gisrb149_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group AS dogfoods Global Impact & Social Responsibility through transparent stewardship metadata — community knowledge contributions, Growth Partner mentorship programs, and leadership reflection practices.',
    'practices', jsonb_build_array(
      'Purpose Center visibility in daily operations',
      'Community knowledge contributions via Global Knowledge Exchange',
      'Growth Partner mentorship and educational outreach',
      'Leadership reflection records — metadata only',
      'No performative scoring of Aipify or customer organizations'
    )
  );
$$;

create or replace function public._gisrb149_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Authentic responsibility — not virtue signaling or PR campaigns',
    'Measurable contribution — thoughtful reporting, not performative ESG scoring',
    'Humans define commitments; Impact Companion encourages awareness',
    'Growth Partner not Affiliate — professional stewardship',
    'People First — stewardship through responsibility',
    'No ranking or scoring organizations — reflection not judgment'
  );
$$;

create or replace function public._gisrb149_privacy_note()
returns text language sql immutable as $$
  select 'Global Impact & Social Responsibility metadata only — initiative summaries, participation counts, and reflection records. No PII. No individual employee surveillance. Humans define purpose and accountability; Impact Companion supports awareness.';
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed helpers
-- ---------------------------------------------------------------------------
create or replace function public._gisrb149_seed_tenant(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._sipe_ensure_settings(p_tenant_id);
  perform public._sipe_seed_initiatives(p_tenant_id);
  perform public._sipe_seed_commitments(p_tenant_id);
  perform public._sipe_seed_alignment_snapshots(p_tenant_id);
  perform public._sipe_seed_impact_indicators(p_tenant_id);

  if not exists (select 1 from public.social_impact_community_initiatives where tenant_id = p_tenant_id limit 1) then
    insert into public.social_impact_community_initiatives (
      tenant_id, initiative_key, initiative_type, title, summary, status, participation_count
    ) values
      (p_tenant_id, 'volunteer-q2', 'volunteer_activity', 'Quarterly volunteer stewardship', 'Team volunteer participation tracked as aggregate metadata — no individual PII.', 'active', 24),
      (p_tenant_id, 'edu-outreach', 'educational_outreach', 'Educational outreach program', 'Approved educational contributions — thoughtful not performative.', 'active', 12),
      (p_tenant_id, 'local-partner', 'community_partnership', 'Regional community partnership', 'Local impact partnership — stewardship not marketing.', 'active', 8),
      (p_tenant_id, 'scholarship-pilot', 'scholarship_program', 'Scholarship pilot program', 'Educational access sponsorship — metadata counts only.', 'planned', 0),
      (p_tenant_id, 'pro-dev-community', 'professional_development', 'Community professional development', 'Professional development for community partners — cross-link GP Ops.', 'active', 6);
  end if;

  if not exists (select 1 from public.social_impact_wellbeing_programs where tenant_id = p_tenant_id limit 1) then
    insert into public.social_impact_wellbeing_programs (
      tenant_id, program_key, program_type, title, summary, status, adoption_count
    ) values
      (p_tenant_id, 'mental-wellbeing', 'mental_wellbeing', 'Mental wellbeing initiatives', 'Organizational mental wellbeing programs — NOT individual surveillance.', 'active', 45),
      (p_tenant_id, 'work-life', 'work_life_balance', 'Work-life balance support', 'Healthy boundary initiatives — Self Love principles in organizations.', 'active', 38),
      (p_tenant_id, 'recognition-practices', 'recognition', 'Recognition practices', 'Recognition program adoption — cross-link Gratitude A.89.', 'active', 22),
      (p_tenant_id, 'learning-access', 'learning_opportunities', 'Learning opportunities', 'Learning access for purpose-aligned programs.', 'active', 31),
      (p_tenant_id, 'psych-safety', 'psychological_safety', 'Psychological safety initiatives', 'Inclusive leadership and psychological safety — organizational scaffolds.', 'planned', 0);
  end if;

  if not exists (select 1 from public.social_impact_reports where tenant_id = p_tenant_id limit 1) then
    insert into public.social_impact_reports (
      tenant_id, report_key, report_type, title, summary, status
    ) values
      (p_tenant_id, 'community-q1', 'community_contribution_summary', 'Q1 community contribution summary', 'Aggregate community impact metadata — visible not hidden.', 'published_summary'),
      (p_tenant_id, 'gp-impact', 'gp_impact_statement', 'Growth Partner impact statement', 'GP mentorship and community leadership contributions.', 'review'),
      (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership reflection record', 'Executive reflection on stewardship outcomes — humans retain accountability.', 'draft');
  end if;

  if not exists (select 1 from public.social_impact_executive_reviews where tenant_id = p_tenant_id limit 1) then
    insert into public.social_impact_executive_reviews (
      tenant_id, review_key, review_dimension, title, reflection_summary, status
    ) values
      (p_tenant_id, 'culture-review', 'organizational_culture', 'Organizational culture reflection', 'Culture stewardship signals — reflection not scoring.', 'review'),
      (p_tenant_id, 'purpose-align', 'purpose_alignment', 'Purpose alignment review', 'Purpose alignment reflection — cross-link Phase 138.', 'draft'),
      (p_tenant_id, 'community-rel', 'community_relationships', 'Community relationships review', 'Community partnership health — metadata only.', 'completed');
  end if;
end; $$;

create or replace function public._gisrb149_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_sipe jsonb;
  v_community_initiatives int;
  v_wellbeing_programs int;
  v_impact_reports int;
  v_executive_reviews int;
begin
  perform public._gisrb149_seed_tenant(p_tenant_id);
  v_sipe := public._sipbp118_engagement_summary(p_tenant_id);

  select count(*) into v_community_initiatives from public.social_impact_community_initiatives
  where tenant_id = p_tenant_id and status in ('active', 'planned');
  select count(*) into v_wellbeing_programs from public.social_impact_wellbeing_programs
  where tenant_id = p_tenant_id and status in ('active', 'planned');
  select count(*) into v_impact_reports from public.social_impact_reports
  where tenant_id = p_tenant_id and status in ('draft', 'review', 'published_summary');
  select count(*) into v_executive_reviews from public.social_impact_executive_reviews
  where tenant_id = p_tenant_id and status in ('draft', 'review', 'completed');

  return jsonb_build_object(
    'active_initiatives', coalesce((v_sipe->>'active_initiatives')::int, 0),
    'active_commitments', coalesce((v_sipe->>'active_commitments')::int, 0),
    'community_initiatives', v_community_initiatives,
    'wellbeing_programs', v_wellbeing_programs,
    'impact_reports', v_impact_reports,
    'executive_reviews', v_executive_reviews,
    'global_impact_capabilities_count', 8,
    'social_responsibility_domains_count', 8,
    'community_impact_types_count', 6,
    'wellbeing_framework_areas_count', 8,
    'impact_reporting_types_count', 6,
    'executive_review_dimensions_count', 7,
    'gp_impact_program_types_count', 6,
    'cross_links_count', jsonb_array_length(public._gisrb149_integration_links()),
    'privacy_note', public._gisrb149_privacy_note()
  );
end; $$;

create or replace function public._gisrb149_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._gisrb149_seed_tenant(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'global_impact_center', 'label', 'Global impact center — eight capabilities', 'met', jsonb_array_length(public._gisrb149_global_impact_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'social_responsibility_engine', 'label', 'Social responsibility engine — eight domains', 'met', jsonb_array_length(public._gisrb149_social_responsibility_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'community_impact_engine', 'label', 'Community impact engine — six types', 'met', jsonb_array_length(public._gisrb149_community_impact_engine()) = 6, 'note', null),
    jsonb_build_object('key', 'wellbeing_framework', 'label', 'Employee wellbeing framework — eight areas', 'met', jsonb_array_length(public._gisrb149_employee_wellbeing_framework()->'areas') = 8, 'note', 'NOT surveillance'),
    jsonb_build_object('key', 'impact_reporting', 'label', 'Impact reporting engine — six report types', 'met', jsonb_array_length(public._gisrb149_impact_reporting_engine()) = 6, 'note', null),
    jsonb_build_object('key', 'impact_companion', 'label', 'Impact Companion — awareness not morality', 'met', jsonb_array_length(public._gisrb149_impact_companion()->'examples') >= 3, 'note', null),
    jsonb_build_object('key', 'gp_impact_program', 'label', 'Growth Partner impact — six program types', 'met', jsonb_array_length(public._gisrb149_growth_partner_impact_program()->'program_types') = 6, 'note', 'Growth Partner not Affiliate'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive impact reviews — seven dimensions', 'met', jsonb_array_length(public._gisrb149_executive_impact_reviews()->'dimensions') = 7, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no social scores', 'met', jsonb_array_length(public._gisrb149_companion_limitations()) >= 5, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration cross-links documented', 'met', jsonb_array_length(public._gisrb149_integration_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'phase118_preserved', 'label', 'Phase 118 baseline tables and RPCs preserved', 'met', to_regclass('public.social_impact_purpose_settings') is not null, 'note', '_sipe_* and _sipbp118_* intact'),
    jsonb_build_object('key', 'community_initiatives_seeded', 'label', 'Community initiatives scaffold seeded', 'met', exists (select 1 from public.social_impact_community_initiatives where tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'wellbeing_programs_seeded', 'label', 'Wellbeing programs scaffold seeded', 'met', exists (select 1 from public.social_impact_wellbeing_programs where tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.social_impact_purpose_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null)
  );
end; $$;

create or replace function public._gisrb149_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 149 — Global Impact & Social Responsibility Engine',
    'doc', 'GLOBAL_IMPACT_SOCIAL_RESPONSIBILITY_ENGINE_PHASE149.md',
    'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
    'route', '/app/social-impact-purpose-engine',
    'era', 'Global Intelligence & Interorganizational Era (141–150)',
    'mapping_note', 'Extends Phase 118 with Global Intelligence Era social responsibility depth — no duplicate impact center.',
    'distinction_note', public._gisrb149_distinction_note(),
    'mission', public._gisrb149_mission(),
    'philosophy', public._gisrb149_philosophy(),
    'abos_principle', public._gisrb149_abos_principle(),
    'vision', public._gisrb149_vision(),
    'objectives', public._gisrb149_objectives(),
    'global_impact_center', public._gisrb149_global_impact_center(),
    'social_responsibility_engine', public._gisrb149_social_responsibility_engine(),
    'community_impact_engine', public._gisrb149_community_impact_engine(),
    'employee_wellbeing_framework', public._gisrb149_employee_wellbeing_framework(),
    'impact_reporting_engine', public._gisrb149_impact_reporting_engine(),
    'impact_companion', public._gisrb149_impact_companion(),
    'growth_partner_impact_program', public._gisrb149_growth_partner_impact_program(),
    'executive_impact_reviews', public._gisrb149_executive_impact_reviews(),
    'companion_limitations', public._gisrb149_companion_limitations(),
    'self_love_connection', public._gisrb149_self_love_connection(),
    'security_requirements', public._gisrb149_security_requirements(),
    'integration_links', public._gisrb149_integration_links(),
    'dogfooding', public._gisrb149_dogfooding(),
    'engagement_summary', public._gisrb149_engagement_summary(p_tenant_id),
    'success_criteria', public._gisrb149_success_criteria(p_tenant_id),
    'vision_phrases', public._gisrb149_vision_phrases(),
    'privacy_note', public._gisrb149_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_community_initiative(
  p_initiative_type text,
  p_title text,
  p_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._sipe_require_tenant();
  perform public._gisrb149_seed_tenant(v_tenant_id);

  if p_initiative_type not in (
    'volunteer_activity', 'community_partnership', 'educational_outreach',
    'scholarship_program', 'local_economic_contribution', 'professional_development'
  ) then
    raise exception 'invalid_initiative_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'community_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.social_impact_community_initiatives (
    tenant_id, initiative_key, initiative_type, title, summary, status, metadata
  )
  values (
    v_tenant_id, v_key, p_initiative_type, trim(p_title),
    coalesce(nullif(trim(p_summary), ''), 'Community initiative metadata — aggregate counts only.'),
    'planned',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._sipe_log_audit(
    v_tenant_id, 'community_initiative_recorded', trim(p_title),
    jsonb_build_object('initiative_type', p_initiative_type, 'initiative_id', v_id)
  );

  return jsonb_build_object(
    'success', true,
    'initiative_id', v_id,
    'initiative_key', v_key,
    'status', 'planned',
    'privacy_note', public._gisrb149_privacy_note()
  );
end; $$;

create or replace function public.record_executive_impact_review(
  p_review_dimension text,
  p_title text,
  p_reflection_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := public._sipe_require_tenant();
  perform public._gisrb149_seed_tenant(v_tenant_id);

  if p_review_dimension not in (
    'employee_experiences', 'community_relationships', 'technology_impacts',
    'organizational_culture', 'purpose_alignment', 'gp_contributions', 'stewardship_outcomes'
  ) then
    raise exception 'invalid_review_dimension';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'exec_review_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.social_impact_executive_reviews (
    tenant_id, review_key, review_dimension, title, reflection_summary, status, metadata
  )
  values (
    v_tenant_id, v_key, p_review_dimension, trim(p_title),
    coalesce(nullif(trim(p_reflection_summary), ''), 'Executive reflection metadata — humans retain accountability.'),
    'draft',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  perform public._sipe_log_audit(
    v_tenant_id, 'executive_impact_review_recorded', trim(p_title),
    jsonb_build_object('review_dimension', p_review_dimension, 'review_id', v_id)
  );

  return jsonb_build_object(
    'success', true,
    'review_id', v_id,
    'review_key', v_key,
    'status', 'draft',
    'privacy_note', public._gisrb149_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL Phase 118 fields; append Phase 149
-- ---------------------------------------------------------------------------
create or replace function public.get_social_impact_purpose_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.social_impact_purpose_settings;
  v_metrics jsonb;
  v_engagement jsonb;
  v_phase149_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._sipe_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._sipe_ensure_settings(v_tenant_id);
  perform public._gisrb149_seed_tenant(v_tenant_id);
  v_metrics := public._sipe_refresh_metrics(v_tenant_id);
  v_engagement := public._sipbp118_engagement_summary(v_tenant_id);
  v_phase149_engagement := public._gisrb149_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'active_initiatives', v_metrics->'active_initiatives',
    'active_commitments', v_metrics->'active_commitments',
    'avg_initiative_progress', v_metrics->'avg_initiative_progress',
    'philosophy', public._sipbp118_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint_phase118', jsonb_build_object(
      'phase', 'Phase 118 — Social Impact & Purpose Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE118_SOCIAL_IMPACT_PURPOSE.md',
      'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
      'route', '/app/social-impact-purpose-engine',
      'mapping_note', 'Purpose Center + Social Impact — cross-link Purpose & Values and Impact Engine.'
    ),
    'social_impact_purpose_mission', public._sipbp118_mission(),
    'social_impact_purpose_abos_principle', public._sipbp118_abos_principle(),
    'social_impact_purpose_engagement_summary', v_engagement,
    'social_impact_purpose_note', 'Social Impact & Purpose Engine — Purpose is action not marketing. People First. Stewardship through responsibility.',
    'social_impact_purpose_vision_note', public._sipbp118_vision(),
    'implementation_blueprint_phase149', jsonb_build_object(
      'phase', 'Phase 149 — Global Impact & Social Responsibility Engine',
      'doc', 'GLOBAL_IMPACT_SOCIAL_RESPONSIBILITY_ENGINE_PHASE149.md',
      'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
      'route', '/app/social-impact-purpose-engine',
      'era', 'Global Intelligence & Interorganizational Era (141–150)',
      'mapping_note', 'Extends Phase 118 with Global Intelligence Era social responsibility depth.'
    ),
    'gisrb149_mission', public._gisrb149_mission(),
    'gisrb149_abos_principle', public._gisrb149_abos_principle(),
    'gisrb149_engagement_summary', v_phase149_engagement,
    'gisrb149_note', 'Global Impact & Social Responsibility (ABOS Phase 149) — authentic responsibility, not virtue signaling. No social scoring.',
    'gisrb149_companion_note', 'Impact Companion encourages awareness — does NOT assign morality or social scores.'
  );
end; $$;

create or replace function public.get_social_impact_purpose_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.social_impact_purpose_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._sipe_require_tenant());
  v_settings := public._sipe_ensure_settings(v_tenant_id);
  perform public._gisrb149_seed_tenant(v_tenant_id);
  v_metrics := public._sipe_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'enabled', v_settings.enabled,
    'purpose_visibility', v_settings.purpose_visibility,
    'wellbeing_programs_enabled', v_settings.wellbeing_programs_enabled,
    'community_programs_enabled', v_settings.community_programs_enabled,
    'philosophy', public._sipbp118_philosophy(),
    'safety_note', 'Social Impact & Purpose Engine — metadata-only initiatives. Purpose & Values A.82 and Impact Engine A.85 remain authoritative. Humans define purpose.',
    'active_initiatives', v_metrics->'active_initiatives',
    'active_commitments', v_metrics->'active_commitments',
    'avg_initiative_progress', v_metrics->'avg_initiative_progress',
    'total_participation', v_metrics->'total_participation',
    'alignment_snapshots', v_metrics->'alignment_snapshots',
    'impact_indicators_count', v_metrics->'impact_indicators',
    'initiatives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'initiative_key', i.initiative_key, 'initiative_type', i.initiative_type,
        'title', i.title, 'summary', i.summary, 'status', i.status,
        'progress_pct', i.progress_pct, 'participation_count', i.participation_count
      ) order by i.progress_pct desc)
      from public.social_impact_purpose_initiatives i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'commitments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'commitment_key', c.commitment_key, 'commitment_area', c.commitment_area,
        'title', c.title, 'summary', c.summary, 'status', c.status,
        'progress_pct', c.progress_pct, 'target_date', c.target_date
      ) order by c.progress_pct desc)
      from public.social_impact_purpose_commitments c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'alignment_snapshots_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alignment_dimension', a.alignment_dimension,
        'reflection_summary', a.reflection_summary, 'alignment_signal', a.alignment_signal,
        'confidence', a.confidence, 'captured_at', a.captured_at
      ) order by a.captured_at desc)
      from public.social_impact_purpose_alignment_snapshots a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'impact_indicators', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ind.id, 'indicator_key', ind.indicator_key, 'indicator_type', ind.indicator_type,
        'summary', ind.summary, 'trend_pct', ind.trend_pct, 'value_numeric', ind.value_numeric,
        'confidence', ind.confidence, 'captured_at', ind.captured_at
      ) order by ind.captured_at desc)
      from public.social_impact_purpose_impact_indicators ind where ind.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'initiative_type_scaffolds', public._sipe_initiative_type_scaffolds(),
    'integration_links', public._sipbp118_integration_links(),
    'implementation_blueprint_phase118', jsonb_build_object(
      'phase', 'Phase 118 — Social Impact & Purpose Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE118_SOCIAL_IMPACT_PURPOSE.md',
      'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
      'route', '/app/social-impact-purpose-engine',
      'mapping_note', 'Purpose Center + Social Impact — cross-link authoritative engines.'
    ),
    'social_impact_purpose_engine_note', 'Social Impact & Purpose Engine (ABOS Phase 118) — Purpose Center + social impact initiatives. Cross-link /app/purpose-values-engine and /app/impact-engine — do NOT duplicate.',
    'social_impact_purpose_blueprint', public._sipbp118_blueprint_block(v_tenant_id),
    'social_impact_purpose_distinction_note', public._sipbp118_distinction_note(),
    'social_impact_purpose_mission', public._sipbp118_mission(),
    'social_impact_purpose_philosophy', public._sipbp118_philosophy(),
    'social_impact_purpose_abos_principle', public._sipbp118_abos_principle(),
    'social_impact_purpose_objectives', public._sipbp118_objectives(),
    'purpose_center_meta', public._sipbp118_purpose_center(),
    'social_impact_initiatives_meta', public._sipbp118_social_impact_initiatives(),
    'employee_wellbeing_meta', public._sipbp118_employee_wellbeing(),
    'purpose_alignment_meta', public._sipbp118_purpose_alignment_engine(),
    'impact_tracking_meta', public._sipbp118_impact_tracking(),
    'companion_responsibilities_meta', public._sipbp118_companion_responsibilities(),
    'growth_partner_participation_meta', public._sipbp118_growth_partner_participation(),
    'self_love_in_organizations_meta', public._sipbp118_self_love_in_organizations(),
    'community_impact_programs_meta', public._sipbp118_community_impact_programs(),
    'executive_purpose_dashboard_meta', public._sipbp118_executive_purpose_dashboard(),
    'sipbp118_cross_links', public._sipbp118_cross_links(),
    'social_impact_purpose_limitation_principles', public._sipbp118_limitation_principles(),
    'social_impact_purpose_companion_adaptation', public._sipbp118_companion_adaptation(),
    'sipbp118_integration_links', public._sipbp118_integration_links(),
    'social_impact_purpose_engagement_summary', public._sipbp118_engagement_summary(v_tenant_id),
    'social_impact_purpose_success_criteria', public._sipbp118_success_criteria(v_tenant_id),
    'social_impact_purpose_success_metrics', public._sipbp118_success_metrics(),
    'social_impact_purpose_vision', public._sipbp118_vision(),
    'social_impact_purpose_privacy_note', 'Social Impact & Purpose metadata only — initiative summaries and aggregate indicators. No PII. Humans define purpose; Companions support action.',
    'implementation_blueprint_phase149', jsonb_build_object(
      'phase', 'Phase 149 — Global Impact & Social Responsibility Engine',
      'doc', 'GLOBAL_IMPACT_SOCIAL_RESPONSIBILITY_ENGINE_PHASE149.md',
      'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
      'route', '/app/social-impact-purpose-engine',
      'era', 'Global Intelligence & Interorganizational Era (141–150)',
      'mapping_note', 'Extends Phase 118 with Global Intelligence Era social responsibility depth — no duplicate impact center.'
    ),
    'global_impact_social_responsibility_note', 'Global Impact & Social Responsibility (ABOS Phase 149) — authentic responsibility and measurable contribution. No social scoring or organizational ranking.',
    'gisrb149_distinction_note', public._gisrb149_distinction_note(),
    'gisrb149_mission', public._gisrb149_mission(),
    'gisrb149_philosophy', public._gisrb149_philosophy(),
    'gisrb149_abos_principle', public._gisrb149_abos_principle(),
    'gisrb149_vision', public._gisrb149_vision(),
    'gisrb149_objectives', public._gisrb149_objectives(),
    'global_impact_center', public._gisrb149_global_impact_center(),
    'social_responsibility_engine', public._gisrb149_social_responsibility_engine(),
    'community_impact_engine', public._gisrb149_community_impact_engine(),
    'employee_wellbeing_framework', public._gisrb149_employee_wellbeing_framework(),
    'impact_reporting_engine', public._gisrb149_impact_reporting_engine(),
    'impact_companion', public._gisrb149_impact_companion(),
    'growth_partner_impact_program', public._gisrb149_growth_partner_impact_program(),
    'executive_impact_reviews_meta', public._gisrb149_executive_impact_reviews(),
    'gisrb149_companion_limitations', public._gisrb149_companion_limitations(),
    'gisrb149_self_love_connection', public._gisrb149_self_love_connection(),
    'gisrb149_security_requirements', public._gisrb149_security_requirements(),
    'gisrb149_integration_links', public._gisrb149_integration_links(),
    'gisrb149_dogfooding', public._gisrb149_dogfooding(),
    'gisrb149_blueprint', public._gisrb149_blueprint_block(v_tenant_id),
    'gisrb149_engagement_summary', public._gisrb149_engagement_summary(v_tenant_id),
    'gisrb149_success_criteria', public._gisrb149_success_criteria(v_tenant_id),
    'gisrb149_vision_phrases', public._gisrb149_vision_phrases(),
    'gisrb149_privacy_note', public._gisrb149_privacy_note(),
    'phase149_sections', jsonb_build_object(
      'community_initiatives', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ci.id, 'initiative_key', ci.initiative_key, 'initiative_type', ci.initiative_type,
          'title', ci.title, 'summary', ci.summary, 'status', ci.status,
          'participation_count', ci.participation_count
        ) order by ci.updated_at desc)
        from public.social_impact_community_initiatives ci where ci.tenant_id = v_tenant_id
        limit 30
      ), '[]'::jsonb),
      'wellbeing_programs', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', wp.id, 'program_key', wp.program_key, 'program_type', wp.program_type,
          'title', wp.title, 'summary', wp.summary, 'status', wp.status,
          'adoption_count', wp.adoption_count
        ) order by wp.updated_at desc)
        from public.social_impact_wellbeing_programs wp where wp.tenant_id = v_tenant_id
        limit 30
      ), '[]'::jsonb),
      'impact_reports', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', r.id, 'report_key', r.report_key, 'report_type', r.report_type,
          'title', r.title, 'summary', r.summary, 'status', r.status
        ) order by r.updated_at desc)
        from public.social_impact_reports r where r.tenant_id = v_tenant_id
        limit 30
      ), '[]'::jsonb),
      'executive_reviews', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', er.id, 'review_key', er.review_key, 'review_dimension', er.review_dimension,
          'title', er.title, 'reflection_summary', er.reflection_summary, 'status', er.status
        ) order by er.updated_at desc)
        from public.social_impact_executive_reviews er where er.tenant_id = v_tenant_id
        limit 30
      ), '[]'::jsonb)
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants & KC category
-- ---------------------------------------------------------------------------
grant execute on function public._gisrb149_distinction_note() to authenticated;
grant execute on function public._gisrb149_mission() to authenticated;
grant execute on function public._gisrb149_philosophy() to authenticated;
grant execute on function public._gisrb149_abos_principle() to authenticated;
grant execute on function public._gisrb149_vision() to authenticated;
grant execute on function public._gisrb149_objectives() to authenticated;
grant execute on function public._gisrb149_global_impact_center() to authenticated;
grant execute on function public._gisrb149_social_responsibility_engine() to authenticated;
grant execute on function public._gisrb149_community_impact_engine() to authenticated;
grant execute on function public._gisrb149_employee_wellbeing_framework() to authenticated;
grant execute on function public._gisrb149_impact_reporting_engine() to authenticated;
grant execute on function public._gisrb149_impact_companion() to authenticated;
grant execute on function public._gisrb149_growth_partner_impact_program() to authenticated;
grant execute on function public._gisrb149_executive_impact_reviews() to authenticated;
grant execute on function public._gisrb149_companion_limitations() to authenticated;
grant execute on function public._gisrb149_self_love_connection() to authenticated;
grant execute on function public._gisrb149_security_requirements() to authenticated;
grant execute on function public._gisrb149_integration_links() to authenticated;
grant execute on function public._gisrb149_dogfooding() to authenticated;
grant execute on function public._gisrb149_vision_phrases() to authenticated;
grant execute on function public._gisrb149_privacy_note() to authenticated;
grant execute on function public._gisrb149_seed_tenant(uuid) to authenticated;
grant execute on function public._gisrb149_engagement_summary(uuid) to authenticated;
grant execute on function public._gisrb149_success_criteria(uuid) to authenticated;
grant execute on function public._gisrb149_blueprint_block(uuid) to authenticated;
grant execute on function public.record_community_initiative(text, text, text, jsonb) to authenticated;
grant execute on function public.record_executive_impact_review(text, text, text, jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-impact-social-responsibility-blueprint', 'Global Impact & Social Responsibility (ABOS Phase 149)',
  'Global Impact & Social Responsibility — extends Phase 118 with community initiatives, wellbeing programs, impact reporting, and leadership reflection. No social scoring.',
  'authenticated', 149
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-impact-social-responsibility-blueprint' and tenant_id is null
);

do $$ declare v_tenant_id uuid; begin
  for v_tenant_id in select id from public.customers loop perform public._gisrb149_seed_tenant(v_tenant_id); end loop;
end $$;
