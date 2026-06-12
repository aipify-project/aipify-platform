-- Implementation Blueprint Phase 142 — Trust Network & Verified Organization Ecosystem Engine
-- Extends Trust & Reputation Engine (Phase A.72 + ABOS Phase 26 + Phase 57 + Phase 116). No duplicate trust surface.

-- ---------------------------------------------------------------------------
-- 1. Optional tenant-scoped tables (ecosystem trust — distinct from A.72 entity profiles)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_trust_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  verification_type text not null check (
    verification_type in (
      'business_identity', 'org_number', 'domain', 'executive_ownership',
      'growth_partner_status', 'enterprise_readiness', 'governance_participation'
    )
  ),
  status text not null default 'pending' check (
    status in ('pending', 'under_review', 'verified', 'rejected', 'expired', 'revoked')
  ),
  verified_at timestamptz,
  requested_by uuid references public.users (id) on delete set null,
  reviewed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_trust_verifications_org_idx
  on public.organization_trust_verifications (organization_id, verification_type, status);

alter table public.organization_trust_verifications enable row level security;
revoke all on public.organization_trust_verifications from authenticated, anon;

create table if not exists public.organization_ecosystem_trust_profiles (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  display_name text not null,
  country_code text,
  industry_key text,
  verification_status text not null default 'unverified' check (
    verification_status in ('unverified', 'pending', 'partially_verified', 'verified')
  ),
  growth_partner_status text not null default 'none' check (
    growth_partner_status in ('none', 'applicant', 'certified', 'premier')
  ),
  years_in_ecosystem numeric(4, 1) not null default 0,
  knowledge_contributions_count int not null default 0,
  community_participation_count int not null default 0,
  enterprise_certification_keys jsonb not null default '[]'::jsonb,
  public_profile_visible boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_ecosystem_trust_profiles enable row level security;
revoke all on public.organization_ecosystem_trust_profiles from authenticated, anon;

create table if not exists public.growth_partner_trust_certifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  program_key text not null,
  certification_level text not null default 'foundations' check (
    certification_level in ('foundations', 'professional', 'expert', 'premier')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'active', 'renewal_due', 'suspended', 'revoked')
  ),
  certified_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, program_key)
);

create index if not exists growth_partner_trust_certifications_org_idx
  on public.growth_partner_trust_certifications (organization_id, status);

alter table public.growth_partner_trust_certifications enable row level security;
revoke all on public.growth_partner_trust_certifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Distinction note & blueprint metadata helpers (_tnvebp142_*)
-- ---------------------------------------------------------------------------
create or replace function public._tnvebp142_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 142 — Trust Network & Verified Organization Ecosystem at /app/trust-reputation-engine. Extends Trust & Reputation Engine Phase A.72, Blueprint Phase 26, Phase 57, and Phase 116. Distinct from consumer ratings and social scores — verification, participation, and professionalism only. Distinct from Phase 116 relationship trust (internal patterns). Verification not exclusivity; trust earned not assumed. Cross-link Ecosystem Governance Phase 119 /app/ecosystem-governance, Partner Certification /app/partners, Global Knowledge Exchange Phase 141 /app/global-knowledge-exchange-engine, Enterprise Readiness A.30, Trust & Action Phase 30 /app/approvals. NO five-star ratings, popularity rankings, social scoring, or gamified trust.';
$$;

create or replace function public._tnvebp142_blueprint_mission()
returns text language sql immutable as $$
  select 'Build a voluntary Trust Network where organizations earn credibility through verification, professional participation, and transparent ecosystem contribution — not popularity contests.';
$$;

create or replace function public._tnvebp142_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Trust earned through verification and transparency — NOT popularity contests or manipulation. People First. Metadata and professional signals only. Growth Partner not Affiliate.';
$$;

create or replace function public._tnvebp142_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Trust Network surfaces verification and participation signals; Aipify guides preparation; executives approve; humans retain worth and governance authority.';
$$;

create or replace function public._tnvebp142_blueprint_vision()
returns text language sql immutable as $$
  select 'A professional ecosystem where verified organizations, Growth Partners, and knowledge contributors collaborate with integrity — trust visible through actions, not rankings.';
$$;

create or replace function public._tnvebp142_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'voluntary_verification', 'label', 'Voluntary verification', 'description', 'Organizations opt into identity and domain verification — never forced exclusivity'),
    jsonb_build_object('key', 'professional_trust_profiles', 'label', 'Professional trust profiles', 'description', 'Public-facing indicators — badges, tenure, contributions — not star ratings'),
    jsonb_build_object('key', 'growth_partner_certification', 'label', 'Growth Partner certification', 'description', 'Certification levels based on implementations and ethical standards — not sales volume'),
    jsonb_build_object('key', 'trust_signal_actions', 'label', 'Trust signals from actions', 'description', 'Verification, contributions, governance participation — actions not popularity'),
    jsonb_build_object('key', 'procurement_readiness', 'label', 'Procurement readiness', 'description', 'Verification docs, security statements, governance summaries for enterprise buyers'),
    jsonb_build_object('key', 'ecosystem_participation', 'label', 'Ecosystem participation', 'description', 'Knowledge sharing and community engagement counts — aggregate metadata'),
    jsonb_build_object('key', 'reputation_safeguards', 'label', 'Reputation safeguards', 'description', 'Explicit prohibition of social scores, rankings, and gamification'),
    jsonb_build_object('key', 'cross_engine_integrity', 'label', 'Cross-engine integrity', 'description', 'Cross-link Phase 141, 119, partners, enterprise readiness — do not duplicate RPCs')
  );
$$;

create or replace function public._tnvebp142_aipify_trust_network()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Voluntary verification network — organizations, Growth Partners, consultants, technology partners, knowledge contributors, enterprise customers.',
    'participant_types', jsonb_build_array(
      jsonb_build_object('key', 'organizations', 'label', 'Organizations', 'description', 'Customer organizations with verified business identity'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'Certified implementation and advisory partners — never Affiliate'),
      jsonb_build_object('key', 'consultants', 'label', 'Consultants', 'description', 'Professional advisors with governance participation'),
      jsonb_build_object('key', 'technology_partners', 'label', 'Technology partners', 'description', 'Integration and platform partners with verified domains'),
      jsonb_build_object('key', 'knowledge_contributors', 'label', 'Knowledge contributors', 'description', 'Cross-link Global Knowledge Exchange Phase 141'),
      jsonb_build_object('key', 'enterprise_customers', 'label', 'Enterprise customers', 'description', 'Enterprise readiness and procurement signals — cross-link A.30')
    )
  );
$$;

create or replace function public._tnvebp142_verified_organization_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'business_identity', 'label', 'Business identity', 'description', 'Legal entity name and jurisdiction — metadata only, no PII dumps'),
    jsonb_build_object('key', 'org_number', 'label', 'Organization number', 'description', 'Validated registration number with executive approval workflow'),
    jsonb_build_object('key', 'executive_ownership', 'label', 'Executive ownership', 'description', 'Executive contact structures for procurement — not personal data exposure'),
    jsonb_build_object('key', 'domain_verification', 'label', 'Domain verification', 'description', 'Verified domain ownership for trust profile publication'),
    jsonb_build_object('key', 'growth_partner_status', 'label', 'Growth Partner status', 'description', 'GP applicant, certified, or premier — cross-link /app/partners'),
    jsonb_build_object('key', 'enterprise_readiness', 'label', 'Enterprise readiness', 'description', 'Enterprise readiness signals — cross-link Enterprise Readiness A.30')
  );
$$;

create or replace function public._tnvebp142_organization_trust_profile_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'name', 'label', 'Organization name', 'description', 'Display name on trust profile'),
    jsonb_build_object('key', 'country', 'label', 'Country', 'description', 'Jurisdiction indicator'),
    jsonb_build_object('key', 'industry', 'label', 'Industry', 'description', 'Industry category — professional context'),
    jsonb_build_object('key', 'verification_status', 'label', 'Verification status', 'description', 'Unverified, pending, partially verified, or verified'),
    jsonb_build_object('key', 'gp_status', 'label', 'Growth Partner status', 'description', 'GP certification tier — not a popularity badge'),
    jsonb_build_object('key', 'ecosystem_tenure', 'label', 'Years in ecosystem', 'description', 'Ecosystem longevity — tenure not rank'),
    jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'description', 'Aggregate contribution count — cross-link Phase 141'),
    jsonb_build_object('key', 'community_participation', 'label', 'Community participation', 'description', 'Participation count — engagement not score'),
    jsonb_build_object('key', 'enterprise_certifications', 'label', 'Enterprise certifications', 'description', 'Professional certification keys — not star ratings')
  );
$$;

create or replace function public._tnvebp142_growth_partner_trust_program()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner trust program — certification, implementations, customer success contributions, knowledge sharing, ethical standards, governance participation.',
    'partners_route', '/app/partners',
    'growth_partner_ops_route', '/app/growth-partner-operations',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'certification', 'label', 'Certification levels', 'description', 'Foundations, professional, expert, premier — earned through standards'),
      jsonb_build_object('key', 'implementations', 'label', 'Implementations', 'description', 'Successful deployment outcomes — metadata aggregates'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer success contributions', 'description', 'Outcome patterns supporting customers — not vanity metrics'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'description', 'Ecosystem knowledge contributions — cross-link Phase 141'),
      jsonb_build_object('key', 'ethical_standards', 'label', 'Ethical standards', 'description', 'Ethics and governance alignment — cross-link Phase 119'),
      jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation', 'description', 'Active participation in ecosystem governance forums')
    )
  );
$$;

create or replace function public._tnvebp142_trust_signal_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'verification', 'label', 'Verification', 'description', 'Completed verification types — business identity, domain, org number'),
    jsonb_build_object('key', 'contributions', 'label', 'Contributions', 'description', 'Knowledge and community contribution aggregates'),
    jsonb_build_object('key', 'certification_levels', 'label', 'Certification levels', 'description', 'GP and enterprise certification tiers earned'),
    jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation', 'description', 'Ecosystem governance engagement — cross-link Phase 119'),
    jsonb_build_object('key', 'support_quality', 'label', 'Support quality aggregates', 'description', 'Support quality metadata — not customer rating scores'),
    jsonb_build_object('key', 'community_engagement', 'label', 'Community engagement', 'description', 'Participation counts — not popularity rankings'),
    jsonb_build_object('key', 'ecosystem_longevity', 'label', 'Ecosystem longevity', 'description', 'Years in ecosystem and sustained participation')
  );
$$;

create or replace function public._tnvebp142_procurement_readiness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'verification_docs', 'label', 'Verification documentation', 'description', 'Verified business identity and domain records for procurement packets'),
    jsonb_build_object('key', 'security_statements', 'label', 'Security statements', 'description', 'Security posture summaries — cross-link Trust Architecture'),
    jsonb_build_object('key', 'governance_summaries', 'label', 'Governance summaries', 'description', 'Governance participation and policy adherence summaries'),
    jsonb_build_object('key', 'compliance_readiness', 'label', 'Compliance readiness', 'description', 'Compliance readiness indicators — metadata only'),
    jsonb_build_object('key', 'gp_verification', 'label', 'Growth Partner verification', 'description', 'GP certification status for partner-led deployments'),
    jsonb_build_object('key', 'executive_contacts', 'label', 'Executive contact structures', 'description', 'Approved executive contact metadata for enterprise buyers')
  );
$$;

create or replace function public._tnvebp142_trust_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust Companion guides verification preparation, certification readiness, governance recommendations, trust profile summaries, and Growth Partner navigation — does not assign worth.',
    'may', jsonb_build_array(
      'Guide verification document preparation and domain validation steps',
      'Summarize certification requirements for Growth Partner programs',
      'Recommend governance participation opportunities — cross-link Phase 119',
      'Prepare trust profile summaries for executive review before publication',
      'Navigate Growth Partner certification paths — cross-link /app/partners'
    ),
    'must_avoid', jsonb_build_array(
      'Assigning human or organizational worth or rank',
      'Publishing confidential verification details without approval',
      'Surfacing private data or PII in trust profiles',
      'Generating social scores or star ratings',
      'Overriding governance or verification approval workflows'
    )
  );
$$;

create or replace function public._tnvebp142_reputation_safeguards()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Verification, participation, and professionalism — never popularity contests.',
    'do_not', jsonb_build_array(
      'Five-star ratings or star-based reputation',
      'Popularity rankings or leaderboards',
      'Social scoring or influence scores',
      'Gamified trust badges based on engagement tricks',
      'Universal reputation scores comparing unrelated organizations',
      'Hidden scoring algorithms without explainability'
    ),
    'do', jsonb_build_array(
      'Voluntary verification with executive approval',
      'Professional participation and contribution counts',
      'Certification levels earned through standards',
      'Governance participation indicators',
      'Transparent trust profile fields with human review',
      'Procurement-ready documentation summaries'
    )
  );
$$;

create or replace function public._tnvebp142_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'No ranking human value — companions guide, never judge worth',
    'No confidential publish without executive approval',
    'No private data reveal in public trust profiles',
    'No social scores or star ratings of any kind',
    'No governance override — verification requires human approval',
    'No automated exclusivity — verification is voluntary participation'
  );
$$;

create or replace function public._tnvebp142_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Integrity, humility, consistency, mutual respect, and professional responsibility — trust profiles reflect stewardship, not competition.',
    'practices', jsonb_build_array(
      'Integrity — verification claims match documented reality',
      'Humility — trust is earned over time, not claimed overnight',
      'Consistency — sustained professional participation matters',
      'Mutual respect — ecosystem peers are collaborators, not rivals',
      'Professional responsibility — executives own publication decisions'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Trust Network stores professional metadata, not wellbeing content.'
  );
$$;

create or replace function public._tnvebp142_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'verification_audit', 'label', 'Verification audit', 'description', 'Every verification state change is auditable'),
    jsonb_build_object('key', 'executive_approval', 'label', 'Executive approval', 'description', 'Public profile publication requires executive approval'),
    jsonb_build_object('key', 'domain_verification', 'label', 'Domain verification', 'description', 'Domain ownership validated before domain badge'),
    jsonb_build_object('key', 'org_number_validation', 'label', 'Organization number validation', 'description', 'Org number verification with review workflow'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', '2FA recommended for verification administrators — /app/settings/two-factor')
  );
$$;

create or replace function public._tnvebp142_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Trust & Reputation A.72 + Blueprint 26/57/116', 'route', '/app/trust-reputation-engine', 'note', 'THIS blueprint extends — preserve all prior fields'),
    jsonb_build_object('label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'note', 'Knowledge contribution cross-link — do not duplicate'),
    jsonb_build_object('label', 'Ecosystem Governance Phase 119', 'route', '/app/ecosystem-governance', 'note', 'Governance participation cross-link'),
    jsonb_build_object('label', 'Partner Certification', 'route', '/app/partners', 'note', 'Growth Partner certification programs'),
    jsonb_build_object('label', 'Enterprise Readiness A.30', 'route', '/app/enterprise-readiness-engine', 'note', 'Enterprise readiness signals'),
    jsonb_build_object('label', 'Trust & Action Phase 30', 'route', '/app/approvals', 'note', 'Verification approval gates'),
    jsonb_build_object('label', 'Growth Partner Operations Phase 114', 'route', '/app/growth-partner-operations', 'note', 'Partner operations cross-link'),
    jsonb_build_object('label', 'Trust Architecture', 'route', '/app/settings/security', 'note', 'Security statements for procurement')
  );
$$;

create or replace function public._tnvebp142_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group and Unonight pilot verify first — transparent verification, not marketing badges.',
    'aipify_group', jsonb_build_object(
      'organization', 'Aipify Group AS',
      'note', 'Platform operator participates in Trust Network with full audit transparency'
    ),
    'unonight', jsonb_build_object(
      'organization', 'Unonight',
      'note', 'First customer pilot — voluntary verification and GP certification readiness'
    )
  );
$$;

create or replace function public._tnvebp142_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Trust earned through verification — not assumed through popularity',
    'Professional participation over social scoring',
    'Growth Partner certification through standards — not sales volume',
    'Verification guides procurement — transparency builds confidence',
    'Ecosystem tenure reflects commitment — not competitive rank'
  );
$$;

create or replace function public._tnvebp142_privacy_note()
returns text language sql immutable as $$
  select 'Trust Network data is organization-scoped, explainable, and auditable. Metadata only — no PII dumps, no hidden social scores, no star ratings. Public profiles require executive approval.';
$$;

-- ---------------------------------------------------------------------------
-- 3. Ecosystem profile helpers
-- ---------------------------------------------------------------------------
create or replace function public._tnvebp142_ensure_ecosystem_profile(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_name text; v_years numeric;
begin
  select o.name into v_name from public.organizations o where o.id = p_org_id;
  if v_name is null then return; end if;

  select round(
    greatest(0, extract(epoch from (now() - o.created_at)) / (365.25 * 86400))::numeric,
    1
  ) into v_years
  from public.organizations o where o.id = p_org_id;

  insert into public.organization_ecosystem_trust_profiles (
    organization_id, display_name, years_in_ecosystem
  )
  values (p_org_id, v_name, coalesce(v_years, 0))
  on conflict (organization_id) do update
  set display_name = excluded.display_name,
      years_in_ecosystem = coalesce(public.organization_ecosystem_trust_profiles.years_in_ecosystem, excluded.years_in_ecosystem),
      updated_at = now();
end; $$;

create or replace function public._tnvebp142_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
  v_verified int := 0;
  v_pending int := 0;
  v_gp_active int := 0;
  v_profile_visible boolean := false;
  v_knowledge int := 0;
  v_community int := 0;
begin
  perform public._tnvebp142_ensure_ecosystem_profile(p_org_id);
  v_base := public._trrbp116_engagement_summary(p_org_id);

  select count(*) filter (where status = 'verified'),
         count(*) filter (where status in ('pending', 'under_review'))
  into v_verified, v_pending
  from public.organization_trust_verifications
  where organization_id = p_org_id;

  select count(*) into v_gp_active
  from public.growth_partner_trust_certifications
  where organization_id = p_org_id and status = 'active';

  select public_profile_visible, knowledge_contributions_count, community_participation_count
  into v_profile_visible, v_knowledge, v_community
  from public.organization_ecosystem_trust_profiles
  where organization_id = p_org_id;

  return v_base || jsonb_build_object(
    'verified_verifications', coalesce(v_verified, 0),
    'pending_verifications', coalesce(v_pending, 0),
    'active_gp_certifications', coalesce(v_gp_active, 0),
    'public_profile_visible', coalesce(v_profile_visible, false),
    'knowledge_contributions_count', coalesce(v_knowledge, 0),
    'community_participation_count', coalesce(v_community, 0),
    'phase142_note', 'Phase 142 Trust Network engagement — verification and participation counts only; extends Phase 116 engagement summary.',
    'privacy_note', public._tnvebp142_privacy_note()
  );
end; $$;

create or replace function public._tnvebp142_blueprint_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_verified int := 0;
  v_pending int := 0;
begin
  v_engagement := public._tnvebp142_engagement_summary(p_org_id);
  v_verified := coalesce((v_engagement->>'verified_verifications')::int, 0);
  v_pending := coalesce((v_engagement->>'pending_verifications')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'reputation_safeguards',
      'label', 'Reputation safeguards — explicit DO NOT for social scores',
      'met', jsonb_array_length(public._tnvebp142_reputation_safeguards()->'do_not') >= 6,
      'note', 'No star ratings, rankings, or gamified trust.'
    ),
    jsonb_build_object(
      'key', 'verified_organization_engine',
      'label', 'Verified organization engine — six verification dimensions',
      'met', jsonb_array_length(public._tnvebp142_verified_organization_engine()) >= 6,
      'note', 'Business identity, org number, domain, GP status, enterprise readiness.'
    ),
    jsonb_build_object(
      'key', 'trust_signal_engine',
      'label', 'Trust signal engine — seven action-based signals',
      'met', jsonb_array_length(public._tnvebp142_trust_signal_engine()) >= 7,
      'note', 'Actions not popularity.'
    ),
    jsonb_build_object(
      'key', 'growth_partner_program',
      'label', 'Growth Partner trust program — six areas',
      'met', jsonb_array_length(public._tnvebp142_growth_partner_trust_program()->'areas') >= 6,
      'note', 'Certification through standards — not sales volume.'
    ),
    jsonb_build_object(
      'key', 'procurement_readiness',
      'label', 'Procurement readiness — six enterprise buyer supports',
      'met', jsonb_array_length(public._tnvebp142_procurement_readiness_engine()) >= 6,
      'note', 'Verification docs and governance summaries.'
    ),
    jsonb_build_object(
      'key', 'trust_companion',
      'label', 'Trust Companion — guides without assigning worth',
      'met', jsonb_array_length(public._tnvebp142_trust_companion()->'may') >= 5,
      'note', 'Preparation and guidance only.'
    ),
    jsonb_build_object(
      'key', 'companion_limitations',
      'label', 'Companion limitations — six boundaries',
      'met', jsonb_array_length(public._tnvebp142_companion_limitations()) >= 6,
      'note', 'No ranking human value.'
    ),
    jsonb_build_object(
      'key', 'security_requirements',
      'label', 'Security requirements — audit, approval, 2FA cross-link',
      'met', jsonb_array_length(public._tnvebp142_security_requirements()) >= 5,
      'note', 'Executive approval for public profiles.'
    ),
    jsonb_build_object(
      'key', 'cross_links',
      'label', 'Cross-links Phase 141, 119, partners, enterprise readiness',
      'met', jsonb_array_length(public._tnvebp142_integration_links()) >= 7,
      'note', 'Extend related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'live_verification',
      'label', 'Live verification workflow',
      'met', v_verified > 0 or v_pending > 0 or to_regclass('public.organization_trust_verifications') is not null,
      'note', case when v_verified = 0 and v_pending = 0 then 'Request organization trust verification to begin workflow.' else null end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs — verification request & trust profile
-- ---------------------------------------------------------------------------
create or replace function public.request_organization_trust_verification(
  p_verification_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
begin
  perform public._irp_require_permission('trust.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._tnvebp142_ensure_ecosystem_profile(v_org_id);

  if p_verification_type is null or p_verification_type not in (
    'business_identity', 'org_number', 'domain', 'executive_ownership',
    'growth_partner_status', 'enterprise_readiness', 'governance_participation'
  ) then
    raise exception 'invalid_verification_type';
  end if;

  insert into public.organization_trust_verifications (
    organization_id, verification_type, status, requested_by, metadata
  )
  values (
    v_org_id, p_verification_type, 'pending', v_user_id,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;

  update public.organization_ecosystem_trust_profiles
  set verification_status = case
      when verification_status = 'verified' then 'verified'
      else 'pending'
    end,
    updated_at = now()
  where organization_id = v_org_id;

  perform public._tre_log(
    v_org_id, 'trust_verification_requested', 'organization_trust_verification', v_id,
    jsonb_build_object('verification_type', p_verification_type, 'status', 'pending')
  );

  return jsonb_build_object(
    'success', true,
    'verification_id', v_id,
    'status', 'pending',
    'approval_note', 'Executive review required — Trust & Action Phase 30 cross-link for sensitive verification types.',
    'privacy_note', public._tnvebp142_privacy_note()
  );
end; $$;

create or replace function public.get_organization_trust_profile(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile jsonb;
  v_verifications jsonb;
  v_certifications jsonb;
begin
  perform public._irp_require_permission('trust.view');
  v_org_id := coalesce(p_org_id, public._mta_require_organization());
  perform public._tnvebp142_ensure_ecosystem_profile(v_org_id);

  select row_to_json(p)::jsonb into v_profile
  from public.organization_ecosystem_trust_profiles p
  where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(row_to_json(v) order by v.created_at desc), '[]'::jsonb) into v_verifications
  from public.organization_trust_verifications v
  where v.organization_id = v_org_id
  limit 20;

  select coalesce(jsonb_agg(row_to_json(c) order by c.created_at desc), '[]'::jsonb) into v_certifications
  from public.growth_partner_trust_certifications c
  where c.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'organization_id', v_org_id,
    'ecosystem_profile', v_profile,
    'verifications', v_verifications,
    'growth_partner_certifications', v_certifications,
    'profile_fields', public._tnvebp142_organization_trust_profile_fields(),
    'reputation_safeguards', public._tnvebp142_reputation_safeguards(),
    'engagement_summary', public._tnvebp142_engagement_summary(v_org_id),
    'privacy_note', public._tnvebp142_privacy_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL A.72 + Phase 26 + 57 + 116; append Phase 142
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_reputation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('trust.view');
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);
  perform public._tnvebp142_ensure_ecosystem_profile(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Earned trust through transparent reputation signals — metadata only, humans review expansion.',
    'principles', jsonb_build_array(
      'Metadata-only reputation signals',
      'Entity-scoped trust profiles',
      'Human review for trust expansion',
      'Revocation with audit trail',
      'Delegated trust hooks for enterprise admins',
      'Voluntary verification — no social scores or star ratings'
    ),
    'summary', public._tre_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'trust_profiles', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc, p.entity_type)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status in ('active', 'under_review')
        limit 40
      ), '[]'::jsonb),
      'trust_trends', coalesce((
        select jsonb_agg(jsonb_build_object(
          'entity_type', p.entity_type,
          'avg_score', round(avg(p.trust_score)::numeric, 1),
          'profile_count', count(*),
          'trusted_count', count(*) filter (where p.trust_level in ('trusted', 'highly_trusted'))
        ) order by avg(p.trust_score) desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
        group by p.entity_type
      ), '[]'::jsonb),
      'trusted_workflows', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
          and p.entity_type in ('workflow', 'automation')
          and p.trust_level in ('trusted', 'highly_trusted')
        limit 20
      ), '[]'::jsonb),
      'approval_quality', coalesce((
        select jsonb_agg(jsonb_build_object(
          'signal_type', s.signal_type,
          'avg_value', round(avg(s.signal_value)::numeric, 1),
          'signal_count', count(*)
        ) order by avg(s.signal_value) desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
          and s.signal_type in ('approval_accuracy', 'policy_adherence', 'positive_audit')
          and s.recorded_at >= now() - interval '90 days'
        group by s.signal_type
      ), '[]'::jsonb),
      'reputation_indicators', coalesce((
        select jsonb_agg(row_to_json(s) order by s.recorded_at desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'recent_outcomes', coalesce((
        select jsonb_agg(row_to_json(o) order by o.created_at desc)
        from public.organization_trust_outcomes o
        where o.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb),
      'ecosystem_trust_profile', (
        select row_to_json(ep)::jsonb
        from public.organization_ecosystem_trust_profiles ep
        where ep.organization_id = v_org_id
      ),
      'trust_verifications', coalesce((
        select jsonb_agg(row_to_json(v) order by v.created_at desc)
        from public.organization_trust_verifications v
        where v.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb),
      'gp_trust_certifications', coalesce((
        select jsonb_agg(row_to_json(c) order by c.created_at desc)
        from public.growth_partner_trust_certifications c
        where c.organization_id = v_org_id
      ), '[]'::jsonb)
    ),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_trust_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._tre_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'human_oversight', 'Oversight approvals inform trust expansion decisions — A.40',
      'secure_ai_actions', 'AI action approval accuracy feeds reputation signals — A.3',
      'workflow_orchestration', 'Workflow execution patterns contribute to workflow trust — A.42',
      'governance_policy', 'Policy adherence signals strengthen governance trust — A.14',
      'enterprise_delegated_admins', 'Delegated admin scopes enable enterprise trust delegation — A.30/A.41',
      'trust_network', 'Voluntary verification and ecosystem trust profiles — Phase 142'
    ),
    'integration_summaries', jsonb_build_object(
      'human_oversight', public._tre_human_oversight_summary(v_org_id),
      'secure_ai_actions', public._tre_secure_ai_actions_summary(v_org_id),
      'workflow_orchestration', public._tre_workflow_summary(v_org_id),
      'governance_policy', public._tre_governance_summary(v_org_id),
      'enterprise_delegated_admins', public._tre_delegated_trust_summary(v_org_id)
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 142 — Trust Network & Verified Organization Ecosystem',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE142_TRUST_NETWORK_VERIFIED_ORGANIZATION_ECOSYSTEM.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine',
      'mapping_note', 'ABOS Blueprint Phase 142 maps to Trust & Reputation Engine Phase A.72 — extends Phase 26, 57, and 116 with Trust Network, verified organization engine, GP trust program, trust signals from actions, procurement readiness, and reputation safeguards.'
    ),
    'implementation_blueprint_phase57', jsonb_build_object(
      'phase', 'Phase 57 — Companion Relationship & Trust Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE57_COMPANION_RELATIONSHIP_TRUST.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase26', jsonb_build_object(
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase116', jsonb_build_object(
      'phase', 'Phase 116 — Trust, Reputation & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE116_TRUST_REPUTATION_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'trust_relationship_note', 'Trust & Relationship Engine (ABOS Phase 26) — extends Trust & Reputation Engine Phase A.72 with blueprint metadata, relationship objectives, principles, and live engagement summary.',
    'companion_relationship_trust_note', 'Companion Relationship & Trust Engine (ABOS Phase 57) — companion trust development on A.72 reputation profiles with continuity, reliability, boundaries, and organizational trust pillars.',
    'trust_reputation_relationship_note', 'Trust, Reputation & Relationship Engine (ABOS Phase 116) — trust framework dimensions, relationship health categories, reputation profiles, trust insights, early warnings, recognition cross-link, trust recovery, Growth Partner trust, enterprise governance, and privacy/ethics on A.72 profiles.',
    'trust_network_verified_ecosystem_note', 'Trust Network & Verified Organization Ecosystem (ABOS Phase 142) — voluntary verification, professional trust profiles, Growth Partner certification, action-based trust signals, procurement readiness, and explicit reputation safeguards — NO star ratings or social scores.',
    'blueprint_philosophy', public._trrbp116_blueprint_philosophy(),
    'blueprint_mission', public._trrbp116_blueprint_mission(),
    'blueprint_abos_principle', public._trrbp116_blueprint_abos_principle(),
    'vision', public._trrbp116_blueprint_vision(),
    'blueprint_distinction_note', public._trrbp116_distinction_note(),
    'phase142_distinction_note', public._tnvebp142_distinction_note(),
    'phase142_mission', public._tnvebp142_blueprint_mission(),
    'phase142_philosophy', public._tnvebp142_blueprint_philosophy(),
    'phase142_abos_principle', public._tnvebp142_blueprint_abos_principle(),
    'phase142_vision', public._tnvebp142_blueprint_vision(),
    'relationship_objectives', public._trbp_blueprint_relationship_objectives(),
    'relationship_principles', public._trbp_blueprint_relationship_principles(),
    'example_phrases', public._trbp_blueprint_example_phrases(),
    'trust_signals', public._trbp_blueprint_trust_signals(),
    'companion_examples', public._trbp_blueprint_companion_examples(),
    'blueprint_boundaries', public._trbp_blueprint_boundaries(),
    'self_love_connection', public._trbp_blueprint_self_love_connection(),
    'dogfooding', public._trbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._trbp_blueprint_integration_links(),
    'engagement_summary', public._tnvebp142_engagement_summary(v_org_id),
    'success_criteria', public._trbp_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._trbp_blueprint_vision_phrases(),
    'phase142_vision_phrases', public._tnvebp142_vision_phrases(),
    'companion_objectives', public._crtbp_blueprint_objectives(),
    'trust_principles', public._crtbp_blueprint_trust_principles(),
    'avoid_practices', public._crtbp_blueprint_avoid_practices(),
    'relationship_continuity', public._crtbp_blueprint_relationship_continuity(),
    'companion_reliability', public._crtbp_blueprint_companion_reliability(),
    'companion_self_love', public._crtbp_blueprint_self_love_connection(),
    'boundary_principles', public._crtbp_blueprint_boundary_principles(),
    'trust_signal_indicators', public._crtbp_blueprint_trust_signals(),
    'organizational_trust', public._crtbp_blueprint_organizational_trust(),
    'dogfooding_phase57', public._crtbp_blueprint_dogfooding(),
    'companion_integration_links', public._crtbp_blueprint_integration_links(),
    'companion_success_criteria', public._crtbp_blueprint_success_criteria(v_org_id),
    'companion_vision_phrases', public._crtbp_blueprint_vision_phrases(),
    'phase116_objectives', public._trrbp116_blueprint_objectives(),
    'trust_framework_dimensions', public._trrbp116_trust_framework_dimensions(),
    'relationship_health_categories', public._trrbp116_relationship_health_categories(),
    'reputation_profile_types', public._trrbp116_reputation_profiles(),
    'trust_insights_questions', public._trrbp116_trust_insights_questions(),
    'early_warning_signals', public._trrbp116_early_warning_signals(),
    'recognition_types', public._trrbp116_recognition_types(),
    'trust_recovery_framework', public._trrbp116_trust_recovery_framework(),
    'companion_responsibilities', public._trrbp116_companion_responsibilities(),
    'growth_partner_trust_model', public._trrbp116_growth_partner_trust_model(),
    'enterprise_trust_governance', public._trrbp116_enterprise_trust_governance(),
    'privacy_ethics_principles', public._trrbp116_privacy_ethics_principles(),
    'self_love_in_relationships', public._trrbp116_self_love_in_relationships(),
    'phase116_integration_links', public._trrbp116_cross_links(),
    'limitation_principles', public._trrbp116_limitation_principles(),
    'companion_adaptation', public._trrbp116_companion_adaptation(),
    'phase116_success_metrics', public._trrbp116_success_metrics(),
    'phase116_success_criteria', public._trrbp116_blueprint_success_criteria(v_org_id),
    'phase142_objectives', public._tnvebp142_blueprint_objectives(),
    'aipify_trust_network', public._tnvebp142_aipify_trust_network(),
    'verified_organization_engine', public._tnvebp142_verified_organization_engine(),
    'organization_trust_profile_fields', public._tnvebp142_organization_trust_profile_fields(),
    'growth_partner_trust_program', public._tnvebp142_growth_partner_trust_program(),
    'trust_signal_engine', public._tnvebp142_trust_signal_engine(),
    'procurement_readiness_engine', public._tnvebp142_procurement_readiness_engine(),
    'trust_companion', public._tnvebp142_trust_companion(),
    'reputation_safeguards', public._tnvebp142_reputation_safeguards(),
    'phase142_companion_limitations', public._tnvebp142_companion_limitations(),
    'phase142_self_love_connection', public._tnvebp142_self_love_connection(),
    'phase142_security_requirements', public._tnvebp142_security_requirements(),
    'phase142_integration_links', public._tnvebp142_integration_links(),
    'dogfooding_phase142', public._tnvebp142_dogfooding(),
    'phase142_success_criteria', public._tnvebp142_blueprint_success_criteria(v_org_id),
    'organization_trust_profile', public.get_organization_trust_profile(v_org_id),
    'privacy_note', public._tnvebp142_privacy_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve Phase 26 + 57 + 116 + append Phase 142 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_reputation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);
  perform public._tnvebp142_ensure_ecosystem_profile(v_org_id);
  v_summary := public._tre_executive_summary_block(v_org_id);
  v_engagement := public._tnvebp142_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Trust & Reputation — earned trust through verification and transparent metadata signals.',
    'active_profiles', v_summary->'active_profiles',
    'trusted_profiles', v_summary->'trusted_profiles',
    'under_review_profiles', v_summary->'under_review_profiles',
    'avg_trust_score', v_summary->'avg_trust_score',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 142 — Trust Network & Verified Organization Ecosystem',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE142_TRUST_NETWORK_VERIFIED_ORGANIZATION_ECOSYSTEM.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase116', jsonb_build_object(
      'phase', 'Phase 116 — Trust, Reputation & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE116_TRUST_REPUTATION_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase57', jsonb_build_object(
      'phase', 'Phase 57 — Companion Relationship & Trust Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE57_COMPANION_RELATIONSHIP_TRUST.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase26', jsonb_build_object(
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'mission', public._tnvebp142_blueprint_mission(),
    'abos_principle', public._tnvebp142_blueprint_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Trust Network & Verified Organization Ecosystem (ABOS Phase 142) — extends Phase A.72, 26, 57, and 116 with voluntary verification, professional trust profiles, GP certification, action-based signals, and reputation safeguards.',
    'companion_note', 'Verification and participation — Aipify guides preparation; executives approve; no star ratings or social scores.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants & KC category
-- ---------------------------------------------------------------------------
grant execute on function public._tnvebp142_distinction_note() to authenticated;
grant execute on function public._tnvebp142_blueprint_mission() to authenticated;
grant execute on function public._tnvebp142_blueprint_philosophy() to authenticated;
grant execute on function public._tnvebp142_blueprint_abos_principle() to authenticated;
grant execute on function public._tnvebp142_blueprint_vision() to authenticated;
grant execute on function public._tnvebp142_blueprint_objectives() to authenticated;
grant execute on function public._tnvebp142_aipify_trust_network() to authenticated;
grant execute on function public._tnvebp142_verified_organization_engine() to authenticated;
grant execute on function public._tnvebp142_organization_trust_profile_fields() to authenticated;
grant execute on function public._tnvebp142_growth_partner_trust_program() to authenticated;
grant execute on function public._tnvebp142_trust_signal_engine() to authenticated;
grant execute on function public._tnvebp142_procurement_readiness_engine() to authenticated;
grant execute on function public._tnvebp142_trust_companion() to authenticated;
grant execute on function public._tnvebp142_reputation_safeguards() to authenticated;
grant execute on function public._tnvebp142_companion_limitations() to authenticated;
grant execute on function public._tnvebp142_self_love_connection() to authenticated;
grant execute on function public._tnvebp142_security_requirements() to authenticated;
grant execute on function public._tnvebp142_integration_links() to authenticated;
grant execute on function public._tnvebp142_dogfooding() to authenticated;
grant execute on function public._tnvebp142_vision_phrases() to authenticated;
grant execute on function public._tnvebp142_privacy_note() to authenticated;
grant execute on function public._tnvebp142_ensure_ecosystem_profile(uuid) to authenticated;
grant execute on function public._tnvebp142_engagement_summary(uuid) to authenticated;
grant execute on function public._tnvebp142_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public.request_organization_trust_verification(text, jsonb) to authenticated;
grant execute on function public.get_organization_trust_profile(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'trust-network-verified-organization-ecosystem-blueprint', 'Trust Network & Verified Organization Ecosystem (ABOS Phase 142)',
  'Trust Network & Verified Organization Ecosystem — extends Phase A.72, 26, 57, and 116 with voluntary verification, professional trust profiles, Growth Partner certification, action-based trust signals, procurement readiness, and reputation safeguards.',
  'authenticated', 106
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'trust-network-verified-organization-ecosystem-blueprint' and tenant_id is null
);
