-- Implementation Blueprint Phase 146 — Global Ecosystem Certification & Professional Standards Engine
-- Extends Ecosystem Governance & Certification Engine Phase 119 at /app/ecosystem-governance.
-- Helpers: _gecsbp146_* (blueprint — never collide with _egce_*, _egcbp119_*, _pce_*)

-- ---------------------------------------------------------------------------
-- 1. Optional scaffold tables (metadata only — extend Phase 119, no duplicate GP tables)
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_professional_directory_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_key text not null,
  display_name text not null,
  participant_type text not null check (
    participant_type in (
      'growth_partner', 'implementation_specialist', 'governance_professional',
      'support_specialist', 'executive_advisor', 'commerce_specialist',
      'knowledge_steward', 'training_provider', 'internal_team'
    )
  ),
  certification_status text not null default 'in_progress' check (
    certification_status in ('not_started', 'in_progress', 'certified', 'maintenance', 'review_due', 'expired')
  ),
  gp_status text,
  gp_tier_label text,
  expertise_areas jsonb not null default '[]'::jsonb,
  industry_experience jsonb not null default '[]'::jsonb,
  regional_presence jsonb not null default '[]'::jsonb,
  contributions_summary text,
  public_visible boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"no_star_ratings":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, entry_key)
);

create index if not exists ecosystem_professional_directory_entries_tenant_idx
  on public.ecosystem_professional_directory_entries (tenant_id, participant_type, status);

alter table public.ecosystem_professional_directory_entries enable row level security;
revoke all on public.ecosystem_professional_directory_entries from authenticated, anon;

create table if not exists public.ecosystem_certification_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'annual_review', 'refresher', 'recertification', 'governance_update',
      'security_training', 'companion_capability', 'professional_development'
    )
  ),
  title text not null,
  summary text not null,
  participant_key text,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'follow_up', 'cancelled')
  ),
  scheduled_at timestamptz,
  completed_at timestamptz,
  next_due_at timestamptz,
  recertification_cadence_months int,
  support_not_punishment_note text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists ecosystem_certification_reviews_tenant_idx
  on public.ecosystem_certification_reviews (tenant_id, review_type, status);

alter table public.ecosystem_certification_reviews enable row level security;
revoke all on public.ecosystem_certification_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helpers (_gecsbp146_* engine scaffolds)
-- ---------------------------------------------------------------------------
create or replace function public._gecsbp146_seed_professional_directory(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_professional_directory_entries where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_professional_directory_entries (
    tenant_id, entry_key, display_name, participant_type, certification_status,
    gp_status, gp_tier_label, expertise_areas, industry_experience, regional_presence,
    contributions_summary, public_visible
  ) values
    (
      p_tenant_id, 'gp-nordic-steward', 'Nordic Steward GP', 'growth_partner', 'certified',
      'advanced', public._pce_tier_label('advanced'),
      '["companion_implementation","governance_alignment","enterprise_rollout"]'::jsonb,
      '["professional_services","retail","healthcare"]'::jsonb,
      '["nordics","emea"]'::jsonb,
      'Knowledge contributions and governance participation — professionalism not popularity.',
      true
    ),
    (
      p_tenant_id, 'gov-advisor-emea', 'EMEA Governance Advisor', 'governance_professional', 'maintenance',
      null, null,
      '["companion_governance","policy_libraries","audit_programs"]'::jsonb,
      '["financial_services","technology"]'::jsonb,
      '["emea"]'::jsonb,
      'Stewardship through responsibility — voluntary governance alignment.',
      false
    ),
    (
      p_tenant_id, 'knowledge-steward-kc', 'Knowledge Steward', 'knowledge_steward', 'certified',
      null, null,
      '["knowledge_center","training_paths","best_practices"]'::jsonb,
      '["saas","operations"]'::jsonb,
      '["global"]'::jsonb,
      'Cross-link Global Knowledge Exchange Phase 141 — metadata contributions only.',
      true
    );
end; $$;

create or replace function public._gecsbp146_seed_certification_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_certification_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_certification_reviews (
    tenant_id, review_key, review_type, title, summary, participant_key, status,
    scheduled_at, next_due_at, recertification_cadence_months, support_not_punishment_note
  ) values
    (
      p_tenant_id, 'annual-gp-nordic-2026', 'annual_review',
      'Annual Growth Partner certification review', 'Supportive annual review — excellence through support not fear.',
      'gp-nordic-steward', 'scheduled', now() + interval '21 days', now() + interval '12 months', 12,
      'Reviews support improvement — failure triggers review, not automatic punishment.'
    ),
    (
      p_tenant_id, 'governance-refresher-q2', 'refresher',
      'Governance standards refresher', 'Updated companion governance training — cross-link Aipify University Phase 115.',
      null, 'scheduled', now() + interval '45 days', now() + interval '12 months', 12,
      'Self Love — education before evaluation.'
    ),
    (
      p_tenant_id, 'recert-gov-advisor', 'recertification',
      'Governance professional recertification cycle', 'Recertification maintenance — voluntary alignment, org retains autonomy.',
      'gov-advisor-emea', 'in_progress', now(), now() + interval '6 months', 24,
      'Professional excellence cultivated through support — not gatekeeping.'
    );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint metadata helpers (_gecsbp146_*)
-- ---------------------------------------------------------------------------
create or replace function public._gecsbp146_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 146 — Global Ecosystem Certification & Professional Standards at /app/ecosystem-governance. Extends Ecosystem Governance & Certification Engine Phase 119 — adds Global Intelligence Era (141–150) professional standards depth. Distinct from Partner Certification Phase 91 /app/partners (_pce_tier_label() authoritative — cross-link NOT duplicate). Distinct from Certification & Achievement A.37 /app/certification-achievement-engine (internal tenant certs). Distinct from Trust Network Phase 142 /app/trust-reputation-engine (GP trust verification). Distinct from Global Compliance Phase 145 /app/compliance-regulatory-readiness-engine (GP compliance support). Excellence through support not fear — not exclusivity or gatekeeping. Professional directory — professionalism NOT popularity; NO star ratings. Helpers _gecsbp146_* — never collide with _egce_*, _egcbp119_*, _pce_*. Growth Partner terminology only — never Affiliate.';
$$;

create or replace function public._gecsbp146_mission()
returns text language sql immutable as $$
  select 'Cultivate professional excellence across the Aipify ecosystem through supportive certification standards, continuous learning, and recognized competence — guides growth, protects customers, and honors human dignity.';
$$;

create or replace function public._gecsbp146_philosophy()
returns text language sql immutable as $$
  select 'Professional excellence cultivated through support not fear. Standards build confidence — not bureaucracy or gatekeeping. Certification recognizes commitment and competence — never personal worth. People First. Stewardship through responsibility. Growth Partner not Affiliate.';
$$;

create or replace function public._gecsbp146_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Certification Center extends Phase 119 Ecosystem Governance with Global Intelligence Era professional standards. Domain RPCs at /app/partners, /app/trust-reputation-engine, and /app/certification-achievement-engine remain authoritative. Humans approve significant certification outcomes.';
$$;

create or replace function public._gecsbp146_vision()
returns text language sql immutable as $$
  select 'Our ecosystem recognizes professional excellence with integrity — Growth Partners supported, professionals empowered, customers confident, innovation responsible.';
$$;

create or replace function public._gecsbp146_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'professional_standards', 'label', 'Professional standards', 'emoji', '🦉', 'description', 'Integrity, transparency, and people-centered practices across certification pathways'),
    jsonb_build_object('key', 'supportive_certification', 'label', 'Supportive certification', 'emoji', '🌹', 'description', 'Excellence through support not fear — reviews guide improvement'),
    jsonb_build_object('key', 'gp_accreditation', 'label', 'Growth Partner accreditation', 'emoji', '🔔', 'description', 'Operational competence mapped to _pce_tier_label() — cross-link Phase 91 and 142'),
    jsonb_build_object('key', 'continuous_learning', 'label', 'Continuous learning', 'emoji', '🦉', 'description', 'Annual reviews, refreshers, and professional development — cross-link University 115'),
    jsonb_build_object('key', 'executive_education', 'label', 'Executive education', 'emoji', '🌹', 'description', 'Companion governance and human-companion collaboration leadership'),
    jsonb_build_object('key', 'professional_directory', 'label', 'Professional directory', 'emoji', '🔔', 'description', 'Verified professionals — certification status and expertise, NOT popularity rankings'),
    jsonb_build_object('key', 'global_era_depth', 'label', 'Global Intelligence Era depth', 'emoji', '🦉', 'description', 'Phase 146 extends Phase 119 for era 141–150 interorganizational professionalism'),
    jsonb_build_object('key', 'cross_engine_integrity', 'label', 'Cross-engine integrity', 'emoji', '🌹', 'description', 'Cross-link 119, 142, 145, 115, 91, 141, A.37 — do not duplicate RPCs')
  );
$$;

create or replace function public._gecsbp146_global_certification_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global Certification Center — professional standards depth for Global Intelligence Era (141–150).',
    'route', '/app/ecosystem-governance',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'certification_programs', 'label', 'Certification programs', 'description', 'Program keys, levels, recertification cadence — metadata on Phase 119 programs'),
      jsonb_build_object('key', 'development_tracks', 'label', 'Development tracks', 'description', 'Structured learning paths — cross-link Aipify University Phase 115'),
      jsonb_build_object('key', 'skills_assessments', 'label', 'Skills assessments', 'description', 'Demonstrated capability assessments — support not punishment'),
      jsonb_build_object('key', 'gp_accreditation', 'label', 'Growth Partner accreditation', 'description', 'GP tiers via _pce_tier_label() — cross-link /app/partners'),
      jsonb_build_object('key', 'executive_education', 'label', 'Executive education', 'description', 'Companion governance and transformation leadership'),
      jsonb_build_object('key', 'companion_governance_training', 'label', 'Companion governance training', 'description', 'Responsible companion deployment standards'),
      jsonb_build_object('key', 'recertification', 'label', 'Recertification cycles', 'description', 'Annual reviews, refreshers, maintenance requirements'),
      jsonb_build_object('key', 'certification_dashboards', 'label', 'Certification dashboards', 'description', 'Governance maturity and professional directory visibility')
    )
  );
$$;

create or replace function public._gecsbp146_certification_framework_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certification framework engine — seven professional pathways. Demonstrated capability, not marketing claims.',
    'pathways', jsonb_build_array(
      jsonb_build_object('key', 'administrator', 'label', 'Administrator', 'route', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner', 'route', '/app/partners'),
      jsonb_build_object('key', 'support_specialist', 'label', 'Support specialist', 'route', '/app/support-ai-engine'),
      jsonb_build_object('key', 'executive_companion_strategist', 'label', 'Executive Companion strategist', 'route', '/app/executive-intelligence'),
      jsonb_build_object('key', 'governance_professional', 'label', 'Governance professional', 'route', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'commerce_specialist', 'label', 'Commerce specialist', 'route', '/app/commerce-intelligence'),
      jsonb_build_object('key', 'knowledge_steward', 'label', 'Knowledge steward', 'route', '/app/knowledge-center-engine')
    ),
    'boundary_note', 'Phase 119 certification programs remain authoritative — Phase 146 adds pathway scaffolds and professional standards depth.'
  );
$$;

create or replace function public._gecsbp146_growth_partner_accreditation_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner accreditation — operational competence, ethical conduct, and customer success — never Affiliate.',
    'partners_route', '/app/partners',
    'trust_reputation_route', '/app/trust-reputation-engine',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'operational_competence', 'label', 'Operational competence', 'description', 'Successful implementations and deployment quality'),
      jsonb_build_object('key', 'implementation_experience', 'label', 'Implementation experience', 'description', 'Documented implementation patterns — metadata only'),
      jsonb_build_object('key', 'ethical_conduct', 'label', 'Ethical conduct', 'description', 'Governance alignment and responsible innovation'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer success', 'description', 'Outcome patterns supporting customers — not vanity metrics'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'description', 'Cross-link Global Knowledge Exchange Phase 141'),
      jsonb_build_object('key', 'continuous_education', 'label', 'Continuous education', 'description', 'Cross-link Aipify University Phase 115 — refreshers and governance updates')
    )
  );
$$;

create or replace function public._gecsbp146_continuous_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Continuous learning engine — lifelong professional development with compassion.',
    'university_route', '/app/aipify-university',
    'activities', jsonb_build_array(
      jsonb_build_object('key', 'annual_reviews', 'label', 'Annual reviews', 'description', 'Supportive certification maintenance reviews'),
      jsonb_build_object('key', 'refreshers', 'label', 'Refreshers', 'description', 'Governance and security training updates'),
      jsonb_build_object('key', 'governance_updates', 'label', 'Governance updates', 'description', 'Policy and standards acknowledgements'),
      jsonb_build_object('key', 'security_training', 'label', 'Security training', 'description', 'RBAC, 2FA, audit logging awareness'),
      jsonb_build_object('key', 'companion_capability_updates', 'label', 'Companion capability updates', 'description', 'Responsible companion deployment refreshers'),
      jsonb_build_object('key', 'professional_development_paths', 'label', 'Professional development paths', 'description', 'Structured learning tracks — cross-link University 115')
    )
  );
$$;

create or replace function public._gecsbp146_professional_standards_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Professional standards framework — integrity and stewardship across the ecosystem.',
    'standards', jsonb_build_array(
      jsonb_build_object('key', 'integrity', 'label', 'Integrity'),
      jsonb_build_object('key', 'transparency', 'label', 'Transparency'),
      jsonb_build_object('key', 'respect', 'label', 'Respect'),
      jsonb_build_object('key', 'professional_excellence', 'label', 'Professional excellence'),
      jsonb_build_object('key', 'responsible_technology', 'label', 'Responsible technology'),
      jsonb_build_object('key', 'people_centered_practices', 'label', 'People-centered practices'),
      jsonb_build_object('key', 'confidentiality', 'label', 'Confidentiality'),
      jsonb_build_object('key', 'stewardship', 'label', 'Stewardship')
    )
  );
$$;

create or replace function public._gecsbp146_certification_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certification Companion — calm supportive guidance. Does NOT lower standards or guarantee competence.',
    'companion_name', 'Certification Companion',
    'not_label', 'AI certification bot',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'learning_recommendations', 'label', 'Learning recommendations'),
      jsonb_build_object('key', 'certification_prep', 'label', 'Certification preparation'),
      jsonb_build_object('key', 'knowledge_retrieval', 'label', 'Knowledge retrieval'),
      jsonb_build_object('key', 'governance_guidance', 'label', 'Governance guidance'),
      jsonb_build_object('key', 'training_summaries', 'label', 'Training summaries'),
      jsonb_build_object('key', 'progress_tracking', 'label', 'Progress tracking')
    ),
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'recertification_due', 'prompt', 'Two recertification reviews are approaching — shall Aipify prepare a supportive preparation summary?', 'consideration', 'Support not fear — education before evaluation'),
      jsonb_build_object('emoji', '🌹', 'key', 'learning_path', 'prompt', 'A governance refresher aligns with your certification maintenance — would exploring the learning path feel wise?', 'consideration', 'Continuous learning — curiosity not pressure'),
      jsonb_build_object('emoji', '🔔', 'key', 'directory_update', 'prompt', 'Your professional directory entry may benefit from an expertise update — would you like to review it together?', 'consideration', 'Professionalism not popularity — no rankings')
    ),
    'boundary_note', 'Companion prepares and informs — humans decide certification outcomes.'
  );
$$;

create or replace function public._gecsbp146_executive_education_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive education engine — leadership for human-companion collaboration era.',
    'executive_intelligence_route', '/app/executive-intelligence',
    'topics', jsonb_build_array(
      jsonb_build_object('key', 'companion_governance', 'label', 'Companion governance'),
      jsonb_build_object('key', 'executive_decision_support', 'label', 'Executive decision support'),
      jsonb_build_object('key', 'org_transformation', 'label', 'Organizational transformation'),
      jsonb_build_object('key', 'human_companion_collaboration', 'label', 'Human-companion collaboration'),
      jsonb_build_object('key', 'trust_frameworks', 'label', 'Trust frameworks'),
      jsonb_build_object('key', 'future_of_work_leadership', 'label', 'Future of work leadership')
    )
  );
$$;

create or replace function public._gecsbp146_professional_directory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Professional directory — certification status, expertise, and regional presence. Professionalism NOT popularity.',
    'no_star_ratings', true,
    'fields', jsonb_build_array(
      jsonb_build_object('key', 'certification_status', 'label', 'Certification status'),
      jsonb_build_object('key', 'gp_status', 'label', 'Growth Partner status'),
      jsonb_build_object('key', 'expertise', 'label', 'Expertise areas'),
      jsonb_build_object('key', 'industry_experience', 'label', 'Industry experience'),
      jsonb_build_object('key', 'regional_presence', 'label', 'Regional presence'),
      jsonb_build_object('key', 'contributions', 'label', 'Knowledge contributions')
    ),
    'boundary_note', 'NO star ratings, popularity rankings, or social scores — cross-link Trust Network Phase 142 for verification.'
  );
$$;

create or replace function public._gecsbp146_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certification Companion limitations — support excellence, never manipulate or diminish human worth.',
    'must_avoid', jsonb_build_array(
      'Guarantee competence or certification outcomes',
      'Manipulate assessments or evaluation criteria',
      'Reveal confidential participant information',
      'Lower professional standards to ease certification',
      'Assign personal worth based on certification status',
      'Create fear, shame, or gatekeeping pressure',
      'Star ratings or popularity rankings in directory'
    ),
    'required', jsonb_build_array(
      'human_oversight_required for significant certification decisions',
      'Metadata-only directory and review records',
      'Support not punishment framing for maintenance gaps',
      'Cross-link authoritative domain surfaces',
      'Growth Partner terminology — never Affiliate'
    )
  );
$$;

create or replace function public._gecsbp146_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in certification — confidence, humility, and lifelong learning.',
    'practices', jsonb_build_array(
      'confidence', 'humility', 'curiosity', 'lifelong_learning',
      'balance', 'recognition_of_progress'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Certification recognizes progress — never diminishes human worth.'
  );
$$;

create or replace function public._gecsbp146_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security requirements — certification audit logs, identity verification, GP validation, RBAC, 2FA.',
    'requirements', jsonb_build_array(
      'certification_audit_logs', 'identity_verification', 'gp_validation',
      'rbac', '2fa_enforcement', 'review_histories', 'evidence_preservation'
    ),
    'two_factor_route', '/app/settings/two-factor',
    'boundary_note', 'Metadata only — no customer operational content in certification tables.'
  );
$$;

create or replace function public._gecsbp146_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ecosystem_governance_119', 'label', 'Ecosystem Governance Phase 119', 'route', '/app/ecosystem-governance', 'relationship', 'Foundation — Phase 146 extends, do NOT duplicate _egce_*'),
    jsonb_build_object('key', 'trust_reputation_142', 'label', 'Trust Network Phase 142', 'route', '/app/trust-reputation-engine', 'relationship', 'GP trust certification cross-link'),
    jsonb_build_object('key', 'compliance_145', 'label', 'Global Compliance Phase 145', 'route', '/app/compliance-regulatory-readiness-engine', 'relationship', 'GP compliance support cross-link'),
    jsonb_build_object('key', 'aipify_university_115', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'relationship', 'Continuous learning hub'),
    jsonb_build_object('key', 'partner_certification_91', 'label', 'Partner Certification Phase 91', 'route', '/app/partners', 'relationship', '_pce_tier_label() authoritative'),
    jsonb_build_object('key', 'global_knowledge_exchange_141', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Knowledge contributions cross-link'),
    jsonb_build_object('key', 'certification_achievement_a37', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine', 'relationship', 'Internal tenant certs — distinct')
  );
$$;

create or replace function public._gecsbp146_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Global Ecosystem Certification standards internally with metadata-only professional directory entries, supportive recertification reviews, and Growth Partner accreditation cross-links. No star ratings. Growth Partner terminology throughout.';
$$;

create or replace function public._gecsbp146_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Excellence through support not fear.',
    'Professionalism not popularity.',
    'Certification recognizes commitment — not superiority.',
    'Lifelong learning with humility and curiosity.',
    'People First — humans decide certification outcomes.'
  );
$$;

create or replace function public._gecsbp146_privacy_note()
returns text language sql immutable as $$
  select 'Global Ecosystem Certification metadata only — certification status, directory scaffolds, and review schedules. No PII, star ratings, or popularity rankings. Humans approve significant certification outcomes.';
$$;

create or replace function public._gecsbp146_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_directory_count int;
  v_certified_directory int;
  v_reviews_scheduled int;
  v_reviews_in_progress int;
  v_pathways_count int;
  v_standards_count int;
begin
  perform public._gecsbp146_seed_professional_directory(p_tenant_id);
  perform public._gecsbp146_seed_certification_reviews(p_tenant_id);

  select count(*) into v_directory_count from public.ecosystem_professional_directory_entries
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_certified_directory from public.ecosystem_professional_directory_entries
  where tenant_id = p_tenant_id and status = 'active' and certification_status in ('certified', 'maintenance');
  select count(*) into v_reviews_scheduled from public.ecosystem_certification_reviews
  where tenant_id = p_tenant_id and status = 'scheduled';
  select count(*) into v_reviews_in_progress from public.ecosystem_certification_reviews
  where tenant_id = p_tenant_id and status in ('in_progress', 'follow_up');

  v_pathways_count := jsonb_array_length(public._gecsbp146_certification_framework_engine()->'pathways');
  v_standards_count := jsonb_array_length(public._gecsbp146_professional_standards_framework()->'standards');

  return jsonb_build_object(
    'professional_directory_count', v_directory_count,
    'certified_professionals_count', v_certified_directory,
    'certification_reviews_scheduled', v_reviews_scheduled,
    'certification_reviews_in_progress', v_reviews_in_progress,
    'certification_pathways_count', v_pathways_count,
    'professional_standards_count', v_standards_count,
    'global_certification_capabilities_count', jsonb_array_length(public._gecsbp146_global_certification_center()->'capabilities'),
    'continuous_learning_activities_count', jsonb_array_length(public._gecsbp146_continuous_learning_engine()->'activities'),
    'gp_accreditation_areas_count', jsonb_array_length(public._gecsbp146_growth_partner_accreditation_engine()->'areas'),
    'executive_education_topics_count', jsonb_array_length(public._gecsbp146_executive_education_engine()->'topics'),
    'integration_links_count', jsonb_array_length(public._gecsbp146_integration_links())
  );
end; $$;

create or replace function public._gecsbp146_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; v_egce jsonb;
begin
  perform public._egce_ensure_settings(p_tenant_id);
  perform public._gecsbp146_seed_professional_directory(p_tenant_id);
  perform public._gecsbp146_seed_certification_reviews(p_tenant_id);
  v_metrics := public._gecsbp146_refresh_metrics(p_tenant_id);
  v_egce := public._egcbp119_engagement_summary(p_tenant_id);

  return jsonb_build_object(
    'governance_maturity_score', coalesce((v_egce->>'governance_maturity_score')::numeric, 0),
    'professional_directory_count', coalesce((v_metrics->>'professional_directory_count')::int, 0),
    'certified_professionals_count', coalesce((v_metrics->>'certified_professionals_count')::int, 0),
    'certification_reviews_scheduled', coalesce((v_metrics->>'certification_reviews_scheduled')::int, 0),
    'certification_reviews_in_progress', coalesce((v_metrics->>'certification_reviews_in_progress')::int, 0),
    'certification_pathways_count', coalesce((v_metrics->>'certification_pathways_count')::int, 0),
    'professional_standards_count', coalesce((v_metrics->>'professional_standards_count')::int, 0),
    'global_certification_capabilities_count', coalesce((v_metrics->>'global_certification_capabilities_count')::int, 0),
    'integration_links_count', coalesce((v_metrics->>'integration_links_count')::int, 0),
    'privacy_note', public._gecsbp146_privacy_note()
  );
end; $$;

create or replace function public._gecsbp146_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._egce_ensure_settings(p_tenant_id);
  perform public._gecsbp146_seed_professional_directory(p_tenant_id);
  perform public._gecsbp146_seed_certification_reviews(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'global_certification_center', 'label', 'Global Certification Center — eight capabilities', 'met', jsonb_array_length(public._gecsbp146_global_certification_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'certification_pathways', 'label', 'Certification framework — seven pathways', 'met', jsonb_array_length(public._gecsbp146_certification_framework_engine()->'pathways') = 7, 'note', null),
    jsonb_build_object('key', 'gp_accreditation', 'label', 'GP accreditation — six areas', 'met', jsonb_array_length(public._gecsbp146_growth_partner_accreditation_engine()->'areas') = 6, 'note', null),
    jsonb_build_object('key', 'continuous_learning', 'label', 'Continuous learning — six activities', 'met', jsonb_array_length(public._gecsbp146_continuous_learning_engine()->'activities') = 6, 'note', null),
    jsonb_build_object('key', 'professional_standards', 'label', 'Professional standards — eight standards', 'met', jsonb_array_length(public._gecsbp146_professional_standards_framework()->'standards') = 8, 'note', null),
    jsonb_build_object('key', 'executive_education', 'label', 'Executive education — six topics', 'met', jsonb_array_length(public._gecsbp146_executive_education_engine()->'topics') = 6, 'note', null),
    jsonb_build_object('key', 'directory_fields', 'label', 'Professional directory — six fields, no star ratings', 'met', (public._gecsbp146_professional_directory_engine()->>'no_star_ratings')::boolean = true, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._gecsbp146_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — seven cross-links', 'met', jsonb_array_length(public._gecsbp146_integration_links()) = 7, 'note', null),
    jsonb_build_object('key', 'directory_seeded', 'label', 'Professional directory seeded', 'met', (select count(*) >= 3 from public.ecosystem_professional_directory_entries e where e.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Certification reviews seeded', 'met', (select count(*) >= 3 from public.ecosystem_certification_reviews r where r.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'phase119_preserved', 'label', 'Phase 119 baseline preserved', 'met', to_regclass('public.ecosystem_governance_settings') is not null, 'note', '_egce_* helpers intact'),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._gecsbp146_objectives()) = 8, 'note', null)
  );
end; $$;

create or replace function public._gecsbp146_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 146 — Global Ecosystem Certification & Professional Standards Engine',
    'doc', 'GLOBAL_ECOSYSTEM_CERTIFICATION_PROFESSIONAL_STANDARDS_ENGINE_PHASE146.md',
    'engine_phase', 'Extends Repo Phase 119 Ecosystem Governance & Certification Engine',
    'route', '/app/ecosystem-governance',
    'mapping_note', 'Global Intelligence Era (141–150) professional standards depth — domain RPCs remain authoritative.',
    'distinction_note', public._gecsbp146_distinction_note(),
    'mission', public._gecsbp146_mission(),
    'philosophy', public._gecsbp146_philosophy(),
    'abos_principle', public._gecsbp146_abos_principle(),
    'vision', public._gecsbp146_vision(),
    'objectives', public._gecsbp146_objectives(),
    'global_certification_center', public._gecsbp146_global_certification_center(),
    'certification_framework_engine', public._gecsbp146_certification_framework_engine(),
    'growth_partner_accreditation_engine', public._gecsbp146_growth_partner_accreditation_engine(),
    'continuous_learning_engine', public._gecsbp146_continuous_learning_engine(),
    'professional_standards_framework', public._gecsbp146_professional_standards_framework(),
    'certification_companion', public._gecsbp146_certification_companion(),
    'executive_education_engine', public._gecsbp146_executive_education_engine(),
    'professional_directory_engine', public._gecsbp146_professional_directory_engine(),
    'companion_limitations', public._gecsbp146_companion_limitations(),
    'self_love_connection', public._gecsbp146_self_love_connection(),
    'security_requirements', public._gecsbp146_security_requirements(),
    'integration_links', public._gecsbp146_integration_links(),
    'dogfooding', public._gecsbp146_dogfooding(),
    'success_criteria', public._gecsbp146_success_criteria(p_tenant_id),
    'engagement_summary', public._gecsbp146_engagement_summary(p_tenant_id),
    'vision_phrases', public._gecsbp146_vision_phrases(),
    'privacy_note', public._gecsbp146_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_certification_review(
  p_review_type text,
  p_title text,
  p_summary text,
  p_participant_key text default null,
  p_scheduled_at timestamptz default null,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._egce_require_tenant());
  if p_review_type not in (
    'annual_review', 'refresher', 'recertification', 'governance_update',
    'security_training', 'companion_capability', 'professional_development'
  ) then raise exception 'Invalid review type'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.ecosystem_certification_reviews (
    tenant_id, review_key, review_type, title, summary, participant_key, status, scheduled_at,
    support_not_punishment_note
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500), p_participant_key,
    'scheduled', coalesce(p_scheduled_at, now() + interval '30 days'),
    'Reviews support improvement — not punishment.'
  )
  returning id into v_id;
  perform public._egce_log_audit(v_tenant_id, 'certification_review_scheduled', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.register_professional_directory_entry(
  p_entry_key text,
  p_display_name text,
  p_participant_type text,
  p_expertise_areas jsonb default '[]'::jsonb,
  p_regional_presence jsonb default '[]'::jsonb,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._egce_require_tenant());
  insert into public.ecosystem_professional_directory_entries (
    tenant_id, entry_key, display_name, participant_type, expertise_areas, regional_presence,
    certification_status, metadata
  ) values (
    v_tenant_id, p_entry_key, p_display_name, p_participant_type,
    coalesce(p_expertise_areas, '[]'::jsonb), coalesce(p_regional_presence, '[]'::jsonb),
    'in_progress', '{"metadata_only":true,"no_star_ratings":true}'::jsonb
  )
  on conflict (tenant_id, entry_key) do update set
    display_name = excluded.display_name,
    participant_type = excluded.participant_type,
    expertise_areas = excluded.expertise_areas,
    regional_presence = excluded.regional_presence,
    updated_at = now()
  returning id into v_id;
  perform public._egce_log_audit(v_tenant_id, 'directory_entry_registered', left(p_display_name, 120),
    jsonb_build_object('entry_id', v_id, 'entry_key', p_entry_key, 'no_star_ratings', true));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPCs — preserve ALL Phase 119 fields + append Phase 146
-- ---------------------------------------------------------------------------
create or replace function public.get_ecosystem_governance_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_governance_settings;
  v_metrics jsonb;
  v_engagement jsonb;
  v_phase146 jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._egce_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._egce_ensure_settings(v_tenant_id);
  perform public._egce_seed_programs(v_tenant_id);
  perform public._egce_seed_certification_records(v_tenant_id);
  perform public._egce_seed_audit_reviews(v_tenant_id);
  perform public._egce_seed_policy_entries(v_tenant_id);
  perform public._egce_seed_trust_badges(v_tenant_id);
  perform public._gecsbp146_seed_professional_directory(v_tenant_id);
  perform public._gecsbp146_seed_certification_reviews(v_tenant_id);
  v_metrics := public._egce_refresh_metrics(v_tenant_id);
  v_engagement := public._egcbp119_engagement_summary(v_tenant_id);
  v_phase146 := public._gecsbp146_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'governance_maturity_score', v_metrics->'governance_maturity_score',
    'certified_participants', v_metrics->'certified_participants',
    'active_trust_badges', v_metrics->'active_trust_badges',
    'philosophy', public._egcbp119_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'voluntary_alignment_enabled', v_settings.voluntary_alignment_enabled,
    'implementation_blueprint_phase119', jsonb_build_object(
      'phase', 'Phase 119 — Ecosystem Governance & Certification Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE119_ECOSYSTEM_GOVERNANCE_CERTIFICATION.md',
      'engine_phase', 'Repo Phase 119 Ecosystem Governance & Certification Engine',
      'route', '/app/ecosystem-governance',
      'mapping_note', 'Ecosystem-wide governance — domain RPCs remain authoritative.'
    ),
    'implementation_blueprint_phase146', jsonb_build_object(
      'phase', 'Phase 146 — Global Ecosystem Certification & Professional Standards Engine',
      'doc', 'GLOBAL_ECOSYSTEM_CERTIFICATION_PROFESSIONAL_STANDARDS_ENGINE_PHASE146.md',
      'engine_phase', 'Extends Repo Phase 119 Ecosystem Governance & Certification Engine',
      'route', '/app/ecosystem-governance',
      'mapping_note', 'Global Intelligence Era (141–150) professional standards depth.'
    ),
    'ecosystem_governance_mission', public._egcbp119_mission(),
    'ecosystem_governance_abos_principle', public._egcbp119_abos_principle(),
    'ecosystem_governance_engagement_summary', v_engagement,
    'ecosystem_governance_vision_note', public._egcbp119_vision(),
    'gecsbp146_mission', public._gecsbp146_mission(),
    'gecsbp146_philosophy', public._gecsbp146_philosophy(),
    'gecsbp146_abos_principle', public._gecsbp146_abos_principle(),
    'gecsbp146_engagement_summary', v_phase146,
    'gecsbp146_vision_note', public._gecsbp146_vision(),
    'gecsbp146_distinction_note', public._gecsbp146_distinction_note(),
    'global_ecosystem_certification_note', 'Global Ecosystem Certification & Professional Standards (ABOS Phase 146) — extends Phase 119 with professional standards depth, directory, recertification reviews, and continuous learning cross-links.'
  );
end; $$;

create or replace function public.get_ecosystem_governance_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_governance_settings;
  v_metrics jsonb;
  v_phase146_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._egce_require_tenant());
  v_settings := public._egce_ensure_settings(v_tenant_id);
  perform public._egce_seed_programs(v_tenant_id);
  perform public._egce_seed_certification_records(v_tenant_id);
  perform public._egce_seed_audit_reviews(v_tenant_id);
  perform public._egce_seed_policy_entries(v_tenant_id);
  perform public._egce_seed_trust_badges(v_tenant_id);
  perform public._gecsbp146_seed_professional_directory(v_tenant_id);
  perform public._gecsbp146_seed_certification_reviews(v_tenant_id);
  v_metrics := public._egce_refresh_metrics(v_tenant_id);
  v_phase146_metrics := public._gecsbp146_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_enabled', v_settings.governance_enabled,
    'voluntary_alignment_enabled', v_settings.voluntary_alignment_enabled,
    'certification_oversight_enabled', v_settings.certification_oversight_enabled,
    'audit_programs_enabled', v_settings.audit_programs_enabled,
    'mandatory_2fa_for_governance_roles', v_settings.mandatory_2fa_for_governance_roles,
    'policy_acknowledgement_required', v_settings.policy_acknowledgement_required,
    'philosophy', public._egcbp119_philosophy(),
    'distinction_note', public._egcbp119_distinction_note(),
    'safety_note', 'Ecosystem Governance Center — metadata-only certification and audit records. Reviews support improvement — not punishment. Humans approve significant governance outcomes.',
    'governance_maturity_score', v_metrics->'governance_maturity_score',
    'certified_participants', v_metrics->'certified_participants',
    'certifications_in_review', v_metrics->'certifications_in_review',
    'active_trust_badges', v_metrics->'active_trust_badges',
    'open_audit_reviews', v_metrics->'open_audit_reviews',
    'active_policies', v_metrics->'active_policies',
    'certification_programs_count', v_metrics->'certification_programs_count',
    'gp_levels_count', v_metrics->'gp_levels_count',
    'companion_assessment_areas_count', v_metrics->'companion_assessment_areas_count',
    'policy_topics_count', v_metrics->'policy_topics_count',
    'trust_badge_types_count', v_metrics->'trust_badge_types_count',
    'governance_functions_count', v_metrics->'governance_functions_count',
    'certification_programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'title', p.title,
        'program_type', p.program_type, 'cross_link_route', p.cross_link_route, 'status', p.status
      ) order by p.sort_order, p.title)
      from public.ecosystem_governance_certification_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'certification_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'participant_key', r.participant_key, 'participant_type', r.participant_type,
        'certification_level', r.certification_level, 'certification_level_label', r.certification_level_label,
        'status', r.status, 'progress_pct', r.progress_pct,
        'maintenance_requirements_met', r.maintenance_requirements_met
      ) order by r.updated_at desc)
      from public.ecosystem_governance_certification_records r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'audit_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'review_type', a.review_type, 'title', a.title, 'summary', a.summary,
        'status', a.status, 'priority', a.priority, 'scheduled_at', a.scheduled_at,
        'findings_count', a.findings_count, 'support_not_punishment_note', a.support_not_punishment_note
      ) order by a.scheduled_at nulls last)
      from public.ecosystem_governance_audit_reviews a
      where a.tenant_id = v_tenant_id and a.status in ('scheduled', 'in_progress', 'follow_up')
    ), '[]'::jsonb),
    'policy_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pe.id, 'policy_key', pe.policy_key, 'title', pe.title, 'summary', pe.summary,
        'topic', pe.topic, 'acknowledgement_required', pe.acknowledgement_required, 'status', pe.status
      ) order by pe.sort_order, pe.title)
      from public.ecosystem_governance_policy_entries pe where pe.tenant_id = v_tenant_id and pe.status = 'active'
    ), '[]'::jsonb),
    'trust_badges', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'badge_key', b.badge_key, 'badge_type', b.badge_type, 'title', b.title,
        'summary', b.summary, 'granted_to_key', b.granted_to_key, 'status', b.status, 'granted_at', b.granted_at
      ) order by b.granted_at desc)
      from public.ecosystem_governance_trust_badges b
      where b.tenant_id = v_tenant_id and b.status = 'active'
    ), '[]'::jsonb),
    'gp_certification_levels', public._egce_gp_certification_level_mappings(),
    'companion_assessment_areas', public._egce_companion_assessment_areas(),
    'certification_maintenance_requirements', public._egce_certification_maintenance_requirements(),
    'audit_review_types', public._egce_audit_review_types(),
    'policy_topic_scaffolds', public._egce_policy_topic_scaffolds(),
    'trust_badge_scaffolds', public._egce_trust_badge_scaffolds(),
    'governance_center_functions', public._egce_governance_center_functions(),
    'integration_links', public._egcbp119_cross_links(),
    'implementation_blueprint_phase119', jsonb_build_object(
      'phase', 'Phase 119 — Ecosystem Governance & Certification Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE119_ECOSYSTEM_GOVERNANCE_CERTIFICATION.md',
      'engine_phase', 'Repo Phase 119 Ecosystem Governance & Certification Engine',
      'route', '/app/ecosystem-governance',
      'mapping_note', 'Ecosystem-wide governance center — domain RPCs remain authoritative.'
    ),
    'ecosystem_governance_blueprint', public._egcbp119_blueprint_block(v_tenant_id),
    'ecosystem_governance_mission', public._egcbp119_mission(),
    'ecosystem_governance_philosophy', public._egcbp119_philosophy(),
    'ecosystem_governance_abos_principle', public._egcbp119_abos_principle(),
    'ecosystem_governance_objectives', public._egcbp119_objectives(),
    'governance_center_meta', public._egcbp119_governance_center(),
    'certification_framework_meta', public._egcbp119_certification_framework(),
    'audit_programs_meta', public._egcbp119_audit_programs(),
    'policy_library_meta', public._egcbp119_policy_library(),
    'trust_badging_meta', public._egcbp119_trust_badging(),
    'continuous_improvement_meta', public._egcbp119_continuous_improvement(),
    'enterprise_integration_meta', public._egcbp119_enterprise_integration(),
    'security_requirements_meta', public._egcbp119_security_requirements(),
    'self_love_in_governance', public._egcbp119_self_love_in_governance(),
    'egcbp119_cross_links', public._egcbp119_cross_links(),
    'ecosystem_governance_limitation_principles', public._egcbp119_limitation_principles(),
    'ecosystem_governance_companion_adaptation', public._egcbp119_companion_adaptation(),
    'ecosystem_governance_engagement_summary', public._egcbp119_engagement_summary(v_tenant_id),
    'ecosystem_governance_success_criteria', public._egcbp119_success_criteria(v_tenant_id),
    'ecosystem_governance_success_metrics', public._egcbp119_success_metrics(),
    'ecosystem_governance_vision', public._egcbp119_vision(),
    'privacy_note', 'Ecosystem governance metadata only — certification status, audit schedules, and policy scaffolds. No customer email, chat, or PII. Humans approve significant governance outcomes.',
    'implementation_blueprint_phase146', jsonb_build_object(
      'phase', 'Phase 146 — Global Ecosystem Certification & Professional Standards Engine',
      'doc', 'GLOBAL_ECOSYSTEM_CERTIFICATION_PROFESSIONAL_STANDARDS_ENGINE_PHASE146.md',
      'engine_phase', 'Extends Repo Phase 119 Ecosystem Governance & Certification Engine',
      'route', '/app/ecosystem-governance',
      'mapping_note', 'Global Intelligence Era (141–150) professional standards depth.'
    ),
    'global_ecosystem_certification_blueprint', public._gecsbp146_blueprint_block(v_tenant_id),
    'global_ecosystem_certification_note', 'Global Ecosystem Certification & Professional Standards (ABOS Phase 146) — extends Phase 119 with professional standards depth, professional directory, recertification reviews, and continuous learning cross-links. Excellence through support not fear.',
    'gecsbp146_distinction_note', public._gecsbp146_distinction_note(),
    'gecsbp146_mission', public._gecsbp146_mission(),
    'gecsbp146_philosophy', public._gecsbp146_philosophy(),
    'gecsbp146_abos_principle', public._gecsbp146_abos_principle(),
    'gecsbp146_vision', public._gecsbp146_vision(),
    'gecsbp146_objectives', public._gecsbp146_objectives(),
    'global_certification_center_meta', public._gecsbp146_global_certification_center(),
    'certification_framework_engine_meta', public._gecsbp146_certification_framework_engine(),
    'growth_partner_accreditation_meta', public._gecsbp146_growth_partner_accreditation_engine(),
    'continuous_learning_engine_meta', public._gecsbp146_continuous_learning_engine(),
    'professional_standards_framework_meta', public._gecsbp146_professional_standards_framework(),
    'certification_companion_meta', public._gecsbp146_certification_companion(),
    'executive_education_engine_meta', public._gecsbp146_executive_education_engine(),
    'professional_directory_engine_meta', public._gecsbp146_professional_directory_engine(),
    'gecsbp146_companion_limitations', public._gecsbp146_companion_limitations(),
    'gecsbp146_self_love_connection', public._gecsbp146_self_love_connection(),
    'gecsbp146_security_requirements', public._gecsbp146_security_requirements(),
    'gecsbp146_integration_links', public._gecsbp146_integration_links(),
    'gecsbp146_dogfooding', public._gecsbp146_dogfooding(),
    'gecsbp146_engagement_summary', public._gecsbp146_engagement_summary(v_tenant_id),
    'gecsbp146_success_criteria', public._gecsbp146_success_criteria(v_tenant_id),
    'gecsbp146_vision_phrases', public._gecsbp146_vision_phrases(),
    'gecsbp146_privacy_note', public._gecsbp146_privacy_note(),
    'professional_directory_count', v_phase146_metrics->'professional_directory_count',
    'certified_professionals_count', v_phase146_metrics->'certified_professionals_count',
    'certification_reviews_scheduled', v_phase146_metrics->'certification_reviews_scheduled',
    'certification_reviews_in_progress', v_phase146_metrics->'certification_reviews_in_progress',
    'certification_pathways_count', v_phase146_metrics->'certification_pathways_count',
    'professional_standards_count', v_phase146_metrics->'professional_standards_count',
    'professional_directory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'entry_key', e.entry_key, 'display_name', e.display_name,
        'participant_type', e.participant_type, 'certification_status', e.certification_status,
        'gp_status', e.gp_status, 'gp_tier_label', e.gp_tier_label,
        'expertise_areas', e.expertise_areas, 'regional_presence', e.regional_presence,
        'contributions_summary', e.contributions_summary, 'public_visible', e.public_visible
      ) order by e.display_name)
      from public.ecosystem_professional_directory_entries e
      where e.tenant_id = v_tenant_id and e.status = 'active'
    ), '[]'::jsonb),
    'certification_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cr.id, 'review_key', cr.review_key, 'review_type', cr.review_type,
        'title', cr.title, 'summary', cr.summary, 'participant_key', cr.participant_key,
        'status', cr.status, 'scheduled_at', cr.scheduled_at, 'next_due_at', cr.next_due_at,
        'recertification_cadence_months', cr.recertification_cadence_months,
        'support_not_punishment_note', cr.support_not_punishment_note
      ) order by cr.scheduled_at nulls last)
      from public.ecosystem_certification_reviews cr
      where cr.tenant_id = v_tenant_id and cr.status in ('scheduled', 'in_progress', 'follow_up')
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants & KC category
-- ---------------------------------------------------------------------------
grant execute on function public.record_certification_review(text, text, text, text, timestamptz, uuid) to authenticated;
grant execute on function public.register_professional_directory_entry(text, text, text, jsonb, jsonb, uuid) to authenticated;
grant execute on function public._gecsbp146_distinction_note() to authenticated;
grant execute on function public._gecsbp146_mission() to authenticated;
grant execute on function public._gecsbp146_philosophy() to authenticated;
grant execute on function public._gecsbp146_abos_principle() to authenticated;
grant execute on function public._gecsbp146_vision() to authenticated;
grant execute on function public._gecsbp146_objectives() to authenticated;
grant execute on function public._gecsbp146_global_certification_center() to authenticated;
grant execute on function public._gecsbp146_certification_framework_engine() to authenticated;
grant execute on function public._gecsbp146_growth_partner_accreditation_engine() to authenticated;
grant execute on function public._gecsbp146_continuous_learning_engine() to authenticated;
grant execute on function public._gecsbp146_professional_standards_framework() to authenticated;
grant execute on function public._gecsbp146_certification_companion() to authenticated;
grant execute on function public._gecsbp146_executive_education_engine() to authenticated;
grant execute on function public._gecsbp146_professional_directory_engine() to authenticated;
grant execute on function public._gecsbp146_companion_limitations() to authenticated;
grant execute on function public._gecsbp146_self_love_connection() to authenticated;
grant execute on function public._gecsbp146_security_requirements() to authenticated;
grant execute on function public._gecsbp146_integration_links() to authenticated;
grant execute on function public._gecsbp146_dogfooding() to authenticated;
grant execute on function public._gecsbp146_vision_phrases() to authenticated;
grant execute on function public._gecsbp146_privacy_note() to authenticated;
grant execute on function public._gecsbp146_engagement_summary(uuid) to authenticated;
grant execute on function public._gecsbp146_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-ecosystem-certification-professional-standards-blueprint', 'Global Ecosystem Certification & Professional Standards (ABOS Phase 146)',
  'Global Ecosystem Certification & Professional Standards — extends Phase 119 with Global Intelligence Era professional standards, directory, recertification, and continuous learning cross-links.',
  'authenticated', 156
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-ecosystem-certification-professional-standards-blueprint' and tenant_id is null
);
