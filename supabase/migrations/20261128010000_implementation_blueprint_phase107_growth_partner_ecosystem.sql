-- Implementation Blueprint Phase 107 — Growth Partner Ecosystem Engine
-- Extends Partner & Certification Ecosystem repo Phase 91 at /app/partners. No new tables.
-- Distinct from Marketplace Partner Ecosystem A.45 at /app/marketplace-partner-ecosystem-foundation-engine.
-- Distinct from Partner Success A.73 at /app/partner-success-engine.
-- Distinct from Organizational Resilience Blueprint Phase 91 at /app/organizational-resilience-engine.
-- Phase collision: Blueprint Phase 107 (Growth Partner) extends repo Phase 91 (Partner Certification) — same route.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._gpebp107_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 107 — Growth Partner Ecosystem Engine at /app/partners. Extends Partner & Certification Ecosystem repo Phase 91 (_pce_*) and preserves ALL baseline dashboard and card fields. Growth Partners not affiliates — entrepreneurs, educators, implementation specialists. Distinct from Marketplace Partner Ecosystem A.45 at /app/marketplace-partner-ecosystem-foundation-engine (marketplace connectors). Distinct from Partner Success A.73 at /app/partner-success-engine (partner portfolio health for customer orgs). Distinct from Sales Expert OS Phase 33 / A.95 at /app/sales-expert-engine (Sales Expert as Growth Partner type — cross-link). Distinct from Certification & Achievement A.37 at /app/certification-achievement-engine (internal team certs — NOT partner certification). Cross-links Learning & Training A.36, Customer Success A.26, Academy/KC. Blueprint Phase 91 Organizational Resilience at /app/organizational-resilience-engine is unrelated. Helpers use _gpebp107_* — never collide with _pce_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._gpebp107_mission()
returns text language sql immutable as $$
  select 'A thriving ecosystem of independent businesses supporting implementation, education, consulting, and customer success.';
$$;

create or replace function public._gpebp107_philosophy()
returns text language sql immutable as $$
  select 'Growth Partners, not affiliates — entrepreneurs, educators, implementation specialists, and trusted advisors. Aipify succeeds when partners succeed.';
$$;

create or replace function public._gpebp107_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — partnership not extraction. Competence-based certification, credible specializations, and ecosystem stewardship. Aipify informs and prepares partner programs; humans govern certification quality and high-impact program decisions.';
$$;

create or replace function public._gpebp107_vision()
returns text language sql immutable as $$
  select 'We did not simply purchase software. We gained a trusted partner who helped us succeed.';
$$;

create or replace function public._gpebp107_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'partner_recruitment', 'label', 'Partner recruitment', 'emoji', '🦉', 'description', 'Identify and welcome qualified independent businesses into the Growth Partner program'),
    jsonb_build_object('key', 'partner_education', 'label', 'Partner education', 'emoji', '🌹', 'description', 'Training, playbooks, and learning paths that build real competence — cross-link Learning & Training A.36'),
    jsonb_build_object('key', 'certification_pathways', 'label', 'Certification pathways', 'emoji', '🔔', 'description', 'Certified → Professional → Elite tiers mapped to credible _pce_tier_label() levels'),
    jsonb_build_object('key', 'customer_matching', 'label', 'Customer matching', 'emoji', '🦉', 'description', 'Match customers with partners by geography, language, industry, and platform specialization'),
    jsonb_build_object('key', 'revenue_opportunities', 'label', 'Revenue opportunities', 'emoji', '🌹', 'description', 'Implementation, onboarding, workshops, consulting, and support agreements — ethical and transparent'),
    jsonb_build_object('key', 'ecosystem_stewardship', 'label', 'Ecosystem stewardship', 'emoji', '🔔', 'description', 'Community leadership, mentorship, and long-term partner success — not disposable channels')
  );
$$;

create or replace function public._gpebp107_who_can_become()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Who can become a Growth Partner — independent businesses with expertise and customer commitment.',
    'partner_types', jsonb_build_array(
      jsonb_build_object('key', 'consultants', 'label', 'Consultants', 'description', 'Independent advisors guiding Aipify adoption and governance'),
      jsonb_build_object('key', 'agencies', 'label', 'Agencies', 'description', 'Implementation and managed service agencies'),
      jsonb_build_object('key', 'sales_experts', 'label', 'Sales Experts', 'description', 'Sales Expert OS Phase 33 / A.95 — cross-link /app/sales-expert-engine'),
      jsonb_build_object('key', 'platform_specialists', 'label', 'Shopify & WordPress specialists', 'description', 'Platform-specific implementation and onboarding expertise'),
      jsonb_build_object('key', 'it_professionals', 'label', 'IT professionals', 'description', 'Integration, deployment, and technical support specialists'),
      jsonb_build_object('key', 'trainers', 'label', 'Trainers & educators', 'description', 'Workshops, adoption programs, and certification coaching'),
      jsonb_build_object('key', 'entrepreneurs', 'label', 'Entrepreneurs', 'description', 'Independent businesses building services around Aipify customer success')
    ),
    'boundary_note', 'Growth Partner terminology only — never Affiliate language. See PARTNER_TERMINOLOGY_UPDATE.md.'
  );
$$;

create or replace function public._gpebp107_partner_business_opportunities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner business opportunities — ethical revenue through customer outcomes, not extraction.',
    'opportunities', jsonb_build_array(
      jsonb_build_object('key', 'implementations', 'label', 'Implementations', 'description', 'Full Aipify deployment and configuration for customer environments'),
      jsonb_build_object('key', 'onboarding', 'label', 'Onboarding programs', 'description', 'Structured customer onboarding and adoption support'),
      jsonb_build_object('key', 'workshops', 'label', 'Workshops & training', 'description', 'Team workshops and capability building sessions'),
      jsonb_build_object('key', 'adoption', 'label', 'Adoption programs', 'description', 'Sustained adoption coaching and change support'),
      jsonb_build_object('key', 'consulting', 'label', 'Consulting & advisory', 'description', 'Governance, strategy, and operational consulting'),
      jsonb_build_object('key', 'support_agreements', 'label', 'Support agreements', 'description', 'Managed support and ongoing customer success services'),
      jsonb_build_object('key', 'governance_advisory', 'label', 'Governance advisory', 'description', 'Trust, ethics, and quality governance guidance'),
      jsonb_build_object('key', 'industry_specialization', 'label', 'Industry specialization', 'description', 'Vertical expertise — retail, services, enterprise, and commerce')
    ),
    'boundary_note', 'Revenue opportunities require transparent engagement — humans approve high-impact program decisions.'
  );
$$;

create or replace function public._gpebp107_partner_certification_levels()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Competence-based certification — Certified → Professional → Elite mapped to _pce_tier_label() tiers.',
    'levels', jsonb_build_array(
      jsonb_build_object(
        'key', 'certified_partner',
        'label', 'Certified Partner',
        'description', 'Foundations and core competence — verified through certification tracks and examinations',
        'maps_to_tier', 'certified',
        'maps_to_tier_label', public._pce_tier_label('certified')
      ),
      jsonb_build_object(
        'key', 'professional_partner',
        'label', 'Professional Partner',
        'description', 'Proven delivery, customer outcomes, and advanced specializations',
        'maps_to_tier', 'sales_expert',
        'maps_to_tier_label', public._pce_tier_label('sales_expert')
      ),
      jsonb_build_object(
        'key', 'elite_partner',
        'label', 'Elite Partner',
        'description', 'Leadership, innovation, ecosystem stewardship, and mentorship',
        'maps_to_tier', 'expert',
        'maps_to_tier_label', public._pce_tier_label('expert')
      )
    ),
    'entry_tier_note', 'Sales Representative tier (' || public._pce_tier_label('sales_representative') || ') is onboarding — not a certification endpoint.',
    'boundary_note', 'Certification quality must not be diluted for recruitment volume — limitation principles apply.'
  );
$$;

create or replace function public._gpebp107_partner_portal()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner portal — training, resources, and certification tracking in one Growth Partner workspace.',
    'sections', jsonb_build_array(
      jsonb_build_object('key', 'training', 'label', 'Training materials', 'description', 'Courses, assessments, and certification track progress'),
      jsonb_build_object('key', 'playbooks', 'label', 'Playbooks', 'description', 'Implementation, onboarding, and customer success playbooks'),
      jsonb_build_object('key', 'decks', 'label', 'Pitch decks & proposals', 'description', 'Sales enablement and proposal templates'),
      jsonb_build_object('key', 'onboarding_guides', 'label', 'Onboarding guides', 'description', 'Step-by-step partner and customer onboarding'),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'description', 'Partner guides, FAQ, and certification documentation'),
      jsonb_build_object('key', 'marketing_resources', 'label', 'Marketing resources', 'description', 'Banners, social assets, and industry messaging — Growth Partner terminology'),
      jsonb_build_object('key', 'certification_tracking', 'label', 'Certification tracking', 'description', 'Digital credentials, progress, and renewal status')
    ),
    'route', '/app/partners',
    'boundary_note', 'Portal resources are scaffolding — humans govern certification awards and program changes.'
  );
$$;

create or replace function public._gpebp107_partner_matching_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner matching — metadata-based recommendations; humans confirm customer-partner engagements.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'geography', 'label', 'Geography', 'description', 'Country and region alignment for local implementation support'),
      jsonb_build_object('key', 'language', 'label', 'Language', 'description', 'Partner languages matched to customer team preferences'),
      jsonb_build_object('key', 'industry', 'label', 'Industry expertise', 'description', 'Vertical specialization and industry track record'),
      jsonb_build_object('key', 'platform', 'label', 'Platform specialization', 'description', 'Shopify, WordPress, custom integrations, and commerce platforms'),
      jsonb_build_object('key', 'availability', 'label', 'Availability', 'description', 'Capacity signals and engagement readiness — illustrative metadata only')
    ),
    'boundary_note', 'Matching prepares introductions — never auto-assigns partners without human approval.'
  );
$$;

create or replace function public._gpebp107_marketing_resource_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Marketing resource center — Growth Partner assets with credible, professional terminology.',
    'resources', jsonb_build_array(
      jsonb_build_object('key', 'banners', 'label', 'Banners & display assets', 'description', 'Web and partner directory banners'),
      jsonb_build_object('key', 'social', 'label', 'Social media assets', 'description', 'LinkedIn, community, and educational social templates'),
      jsonb_build_object('key', 'educational', 'label', 'Educational materials', 'description', 'Guides explaining Aipify value — not hype or guaranteed outcomes'),
      jsonb_build_object('key', 'landing_templates', 'label', 'Landing page templates', 'description', 'Partner-branded landing scaffolds with compliance review'),
      jsonb_build_object('key', 'video', 'label', 'Video resources', 'description', 'Training videos and customer success stories'),
      jsonb_build_object('key', 'industry_messaging', 'label', 'Industry messaging', 'description', 'Vertical-specific value propositions and case patterns')
    ),
    'terminology_note', 'Growth Partner terminology only — never Affiliate. See PARTNER_TERMINOLOGY_UPDATE.md.',
    'boundary_note', 'Marketing resources support partner businesses — Aipify does not run partner marketing autonomously.'
  );
$$;

create or replace function public._gpebp107_partner_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner recognition — celebrate competence, community, and customer outcomes.',
    'categories', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'success_awards', 'label', 'Success awards', 'description', 'Celebrate partner and customer outcome milestones'),
      jsonb_build_object('emoji', '❤️', 'key', 'community_leadership', 'label', 'Community leadership', 'description', 'Forums, advisory councils, and ecosystem contribution'),
      jsonb_build_object('emoji', '🦉', 'key', 'innovation', 'label', 'Innovation recognition', 'description', 'New practices, implementation excellence, and shared learnings'),
      jsonb_build_object('emoji', '🔔', 'key', 'mentorship', 'label', 'Mentorship', 'description', 'Guide emerging partners — optional, non-pressured mentorship paths')
    ),
    'boundary_note', 'Recognition is human-governed — not automated volume-based awards.'
  );
$$;

create or replace function public._gpebp107_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner Companion guidance — warm, professional, non-intrusive. Partnership not extraction.',
    'companion_name', 'Growth Partner Companion',
    'not_label', 'AI partner recruitment bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'certification_path', 'prompt', 'Your certification progress is strong — would a pathway summary for Professional Partner help you plan next steps?', 'consideration', 'Competence-based growth — not volume pressure'),
      jsonb_build_object('emoji', '🌹', 'key', 'customer_matching', 'prompt', 'A customer in your region needs Shopify onboarding support — shall Aipify prepare a matching summary for your review?', 'consideration', 'Humans confirm engagements — matching is metadata only'),
      jsonb_build_object('emoji', '🔔', 'key', 'sustainable_growth', 'prompt', 'Your partner scorecard shows strong customer feedback — would celebrating one outcome before taking on more engagements feel wise?', 'consideration', 'Self Love cross-link — sustainable partner businesses')
    ),
    'boundary_note', 'Growth Partner Companion scaffolds programs — never treats partners as disposable sales channels.'
  );
$$;

create or replace function public._gpebp107_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable partner businesses grow at a human pace.',
    'quotes', jsonb_build_array(
      'Your partner business can grow at a pace that protects wellbeing — competence and customer outcomes beat volume-for-volume''s sake.',
      'Celebrating one customer success deeply matters more than chasing the next opportunity immediately.',
      'Certification journeys are marathons — rest and reflection are part of professional growth.',
      'Partnership not extraction — your independent business deserves sustainable rhythms.'
    ),
    'practices', jsonb_build_array(
      'Pause before over-committing to engagements — capacity awareness protects quality',
      'Celebrate certification milestones — not only the next tier',
      'Mentorship is optional — never pressured recruitment over success',
      'Cross-link Self Love A.76 rhythms for sustainable business growth'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Growth Partner engine stores partner metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._gpebp107_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — Aipify leadership stewards the Growth Partner ecosystem.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'certification_quality', 'label', 'Certification quality stewardship', 'description', 'Leadership goveres competence standards — no diluted certification for volume'),
      jsonb_build_object('key', 'ethical_engagement', 'label', 'Ethical partner engagement', 'description', 'Transparent opportunities, compliance, and brand usage standards'),
      jsonb_build_object('key', 'ecosystem_health', 'label', 'Ecosystem health oversight', 'description', 'Scorecards, feedback, and recognition aligned with customer outcomes'),
      jsonb_build_object('key', 'long_term_success', 'label', 'Long-term partner success', 'description', 'Stewardship over extraction — partners succeed when customers succeed')
    ),
    'boundary_note', 'Leadership connection is governance scaffolding — high-impact program decisions require human approval.'
  );
$$;

create or replace function public._gpebp107_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent Growth Partner credentials — what certifications represent and how to verify them.',
    'users_should_see', jsonb_build_array(
      'What each certification level represents — competence, specializations, and renewal requirements',
      'Digital credential verification via verify_partner_credential — transparent status and expiry',
      'Compliance records — code of conduct, data protection, ethical AI, brand usage',
      'Partner directory metadata — geography, languages, industry, and service offerings'
    ),
    'operators_should_understand', jsonb_build_array(
      'Growth Partner program is scaffolding — not automated partner assignment or recruitment bots',
      'Certification tracks map to _pce_tier_label() — Certified, Professional, Elite blueprint framing',
      'Cross-links Trust & Action Engine — sensitive program decisions may need approval context',
      'Platform aggregates only at platform governance — tenant partner data stays tenant-scoped'
    ),
    'audit_note', 'pce_lead_registered, pce_compliance_accepted, pce_briefing_generated — metadata only via partner_ecosystem_audit_log.'
  );
$$;

create or replace function public._gpebp107_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — partnership not extraction in the Growth Partner ecosystem.',
    'must_avoid', jsonb_build_array(
      'Disposable sales channels or short-term transactional partner focus',
      'Recruitment volume over partner success and customer outcomes',
      'Diluted certification standards to inflate partner counts',
      'Affiliate language — Growth Partner terminology only per PARTNER_TERMINOLOGY_UPDATE.md'
    ),
    'required', jsonb_build_array(
      'Competence-based certification pathways — Certified → Professional → Elite',
      'Human approval for high-impact program decisions — human_oversight_required true',
      'Transparent credential verification and compliance tracking',
      'Growth Partner Companion tone — Aipify informs and prepares; humans govern programs'
    ),
    'boundary_note', 'Aipify succeeds when partners succeed — extraction models are incompatible with ABOS principles.'
  );
$$;

create or replace function public._gpebp107_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate Growth Partner patterns on internal certification and Sales Expert journeys before broad rollout.',
    'sales_expert_ecosystem', jsonb_build_object(
      'route', '/app/sales-expert-engine',
      'role', 'Sales Expert OS Phase 33 / A.95 — Growth Partner type validation',
      'focus', jsonb_build_array(
        'Sales Expert certification cross-links to partner certification tracks',
        'Marketing center resources — Growth Partner terminology',
        'Independent business portal notice and professional engagement patterns'
      )
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — certification journeys, limitation principles, KC FAQ',
      'focus', jsonb_build_array(
        'Growth Partner Companion guidance examples (🦉🌹🔔)',
        'Certification level mapping to _pce_tier_label()',
        'Marketing resource center terminology audit — no Affiliate language',
        'Knowledge Center FAQ — implementation-blueprint-phase107-faq'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — partner matching and customer success cross-links',
      'focus', jsonb_build_array(
        'Partner directory and credential verification workflow',
        'Lead registration with human oversight',
        'Customer Success A.26 cross-link for outcome tracking'
      )
    )
  );
$$;

create or replace function public._gpebp107_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We did not simply purchase software. We gained a trusted partner who helped us succeed.',
    'Growth Partners, not affiliates — Aipify succeeds when partners succeed.',
    'Partnership not extraction — competence-based certification and ecosystem stewardship.',
    '🦉 Certification pathways build real competence — not volume badges.',
    '🌹 Customer matching connects expertise with need — humans confirm engagements.',
    '🔔 Sustainable partner businesses grow at a human pace.',
    'Your independent business deserves credible certification and ethical opportunities.'
  );
$$;

create or replace function public._gpebp107_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'partner_certification_phase91', 'label', 'Partner Certification (Repo Phase 91)', 'route', '/app/partners', 'note', 'Baseline portal — certification tracks, credentials, directory'),
    jsonb_build_object('key', 'marketplace_a45', 'label', 'Marketplace Partner Ecosystem (A.45)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Marketplace connectors — distinct from Growth Partner program'),
    jsonb_build_object('key', 'partner_success_a73', 'label', 'Partner Success (A.73)', 'route', '/app/partner-success-engine', 'note', 'Partner portfolio health for customer orgs — distinct'),
    jsonb_build_object('key', 'sales_expert_phase33', 'label', 'Sales Expert OS (Phase 33 / A.95)', 'route', '/app/sales-expert-engine', 'note', 'Sales Expert as Growth Partner type — cross-link'),
    jsonb_build_object('key', 'certification_achievement_a37', 'label', 'Certification & Achievement (A.37)', 'route', '/app/certification-achievement-engine', 'note', 'Internal team certs — NOT partner certification'),
    jsonb_build_object('key', 'learning_training_a36', 'label', 'Learning & Training (A.36)', 'route', '/app/learning-training-engine', 'note', 'Partner education cross-link'),
    jsonb_build_object('key', 'customer_success_a26', 'label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine', 'note', 'Customer outcomes cross-link'),
    jsonb_build_object('key', 'aipify_academy', 'label', 'Aipify Academy', 'route', '/app/aipify-academy', 'note', 'Certification courses and assessments'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Training materials and partner guides'),
    jsonb_build_object('key', 'ecosystem_intelligence_phase88', 'label', 'Ecosystem Intelligence (Phase 88)', 'route', '/app/ecosystem', 'note', 'Partner relationship mapping — cross-link'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable partner business rhythms — principle only'),
    jsonb_build_object('key', 'enterprise_deployment_a39', 'label', 'Enterprise Deployment (A.39)', 'route', '/app/enterprise-deployment-governance-engine', 'note', 'Enterprise partner deployment framework')
  );
$$;

create or replace function public._gpebp107_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_health jsonb;
  v_partners int := 0;
  v_tracks int := 0;
  v_credentials int := 0;
  v_resources int := 0;
begin
  perform public._pce_ensure_settings(p_tenant_id);
  v_health := public._pce_ecosystem_health(p_tenant_id);

  select count(*) into v_partners from public.partner_ecosystem_profiles
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_tracks from public.partner_certification_tracks
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_credentials from public.partner_digital_credentials
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_resources from public.partner_ecosystem_resources
  where tenant_id = p_tenant_id and status = 'active';

  return jsonb_build_object(
    'ecosystem_score', coalesce((v_health->>'ecosystem_score')::numeric, 0),
    'active_partners', coalesce((v_health->>'active_partners')::int, 0),
    'certified_partners', coalesce((v_health->>'certified_partners')::int, 0),
    'open_leads', coalesce((v_health->>'open_leads')::int, 0),
    'compliance_pct', coalesce((v_health->>'compliance_pct')::numeric, 0),
    'certification_tracks', v_tracks,
    'active_credentials', v_credentials,
    'portal_resources', v_resources,
    'objectives_documented', jsonb_array_length(public._gpebp107_objectives()),
    'certification_levels', jsonb_array_length(public._gpebp107_partner_certification_levels()->'levels'),
    'matching_dimensions', jsonb_array_length(public._gpebp107_partner_matching_engine()->'dimensions'),
    'companion_examples', jsonb_array_length(public._gpebp107_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._gpebp107_integration_links()),
    'privacy_note', 'Aggregate partner ecosystem counts and blueprint scaffolds only — no raw customer PII or partner contact content in blueprint metadata.'
  );
end; $$;

create or replace function public._gpebp107_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_partners int := 0;
begin
  perform public._pce_ensure_settings(p_tenant_id);
  perform public._pce_seed_tracks(p_tenant_id);
  perform public._pce_seed_resources(p_tenant_id);
  v_engagement := public._gpebp107_engagement_summary(p_tenant_id);
  v_partners := coalesce((v_engagement->>'active_partners')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'partner_recruitment',
      'label', 'Partner recruitment — qualified independent businesses (🦉)',
      'met', v_partners >= 1,
      'note', case when v_partners < 1 then 'Seed or register Growth Partners in the directory.' else null end
    ),
    jsonb_build_object(
      'key', 'partner_education',
      'label', 'Partner education — training and playbooks documented',
      'met', coalesce((v_engagement->>'portal_resources')::int, 0) >= 1,
      'note', 'Cross-link Learning & Training A.36 and Academy.'
    ),
    jsonb_build_object(
      'key', 'certification_pathways',
      'label', 'Certification pathways — Certified → Professional → Elite mapped to _pce_tier_label()',
      'met', jsonb_array_length(public._gpebp107_partner_certification_levels()->'levels') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'customer_matching',
      'label', 'Customer matching — geography, language, industry, platform, availability',
      'met', jsonb_array_length(public._gpebp107_partner_matching_engine()->'dimensions') >= 5,
      'note', 'Matching prepares — humans confirm engagements.'
    ),
    jsonb_build_object(
      'key', 'revenue_opportunities',
      'label', 'Revenue opportunities — ethical partner business models documented',
      'met', jsonb_array_length(public._gpebp107_partner_business_opportunities()->'opportunities') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'ecosystem_stewardship',
      'label', 'Ecosystem stewardship — recognition and community leadership (🌹❤️🦉🔔)',
      'met', jsonb_array_length(public._gpebp107_partner_recognition()->'categories') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'who_can_become',
      'label', 'Who can become — consultant, agency, Sales Expert, platform specialist paths',
      'met', jsonb_array_length(public._gpebp107_who_can_become()->'partner_types') >= 5,
      'note', 'Never Affiliate language.'
    ),
    jsonb_build_object(
      'key', 'partner_portal',
      'label', 'Partner portal — training, playbooks, KC, certification tracking',
      'met', jsonb_array_length(public._gpebp107_partner_portal()->'sections') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'marketing_resource_center',
      'label', 'Marketing resource center — Growth Partner assets documented',
      'met', jsonb_array_length(public._gpebp107_marketing_resource_center()->'resources') >= 5,
      'note', 'Growth Partner terminology only.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Growth Partner Companion guidance — partnership not extraction',
      'met', jsonb_array_length(public._gpebp107_companion_guidance()->'examples') >= 3,
      'note', 'Growth Partner Companion — not generic AI recruitment bot.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no disposable channels or diluted certification',
      'met', jsonb_array_length(public._gpebp107_limitation_principles()->'must_avoid') >= 4,
      'note', 'Partnership not extraction.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent credentials and compliance',
      'met', jsonb_array_length(public._gpebp107_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable partner business rhythms',
      'met', jsonb_array_length(public._gpebp107_self_love_connection()->'quotes') >= 2,
      'note', 'Sustainable growth pacing for independent businesses.'
    ),
    jsonb_build_object(
      'key', 'leadership_connection',
      'label', 'Leadership connection — Aipify stewardship of certification quality',
      'met', jsonb_array_length(public._gpebp107_leadership_connection()->'dimensions') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 91 baseline fields preserved on dashboard',
      'met', to_regclass('public.partner_ecosystem_settings') is not null,
      'note', '_pce_* tables and RPC behavior intact.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links A.45, A.73, Phase 33 Sales Expert, A.37, A.36, A.26, Academy, KC',
      'met', jsonb_array_length(public._gpebp107_integration_links()) >= 10,
      'note', 'Distinct from Marketplace A.45 and Partner Success A.73.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sales Expert ecosystem and certification journeys',
      'met', (public._gpebp107_dogfooding()->'sales_expert_ecosystem') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — partnership not extraction',
      'met', true,
      'note', 'Humans govern certification quality; Aipify informs and prepares.'
    )
  );
end; $$;

create or replace function public._gpebp107_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 107 — Growth Partner Ecosystem Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE107_GROWTH_PARTNER_ECOSYSTEM.md',
    'engine_phase', 'Repo Phase 91 Partner & Certification Ecosystem',
    'route', '/app/partners',
    'mapping_note', 'ABOS Blueprint Phase 107 extends repo Phase 91 with Growth Partner framing. Distinct from Marketplace A.45, Partner Success A.73, and Organizational Resilience Blueprint Phase 91.',
    'distinction_note', public._gpebp107_distinction_note(),
    'mission', public._gpebp107_mission(),
    'philosophy', public._gpebp107_philosophy(),
    'abos_principle', public._gpebp107_abos_principle(),
    'objectives', public._gpebp107_objectives(),
    'who_can_become', public._gpebp107_who_can_become(),
    'partner_business_opportunities', public._gpebp107_partner_business_opportunities(),
    'partner_certification_levels', public._gpebp107_partner_certification_levels(),
    'partner_portal', public._gpebp107_partner_portal(),
    'partner_matching_engine', public._gpebp107_partner_matching_engine(),
    'marketing_resource_center', public._gpebp107_marketing_resource_center(),
    'partner_recognition', public._gpebp107_partner_recognition(),
    'companion_guidance', public._gpebp107_companion_guidance(),
    'self_love_connection', public._gpebp107_self_love_connection(),
    'leadership_connection', public._gpebp107_leadership_connection(),
    'trust_connection', public._gpebp107_trust_connection(),
    'limitation_principles', public._gpebp107_limitation_principles(),
    'dogfooding', public._gpebp107_dogfooding(),
    'success_criteria', public._gpebp107_success_criteria(p_tenant_id),
    'vision', public._gpebp107_vision(),
    'vision_phrases', public._gpebp107_vision_phrases(),
    'integration_links', public._gpebp107_integration_links(),
    'engagement_summary', public._gpebp107_engagement_summary(p_tenant_id),
    'privacy_note', 'Growth Partner blueprint data is metadata only — partner directory summaries, certification progress, credential codes. No Affiliate language. Humans govern programs; Aipify Growth Partner Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 107
-- ---------------------------------------------------------------------------
create or replace function public.get_partner_ecosystem_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_health jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_health := public._pce_ecosystem_health(v_tenant_id);
  v_engagement := public._gpebp107_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'ecosystem_score', v_health->'ecosystem_score',
    'active_partners', v_health->'active_partners',
    'certified_partners', v_health->'certified_partners',
    'open_leads', v_health->'open_leads',
    'philosophy', 'Enable others to succeed with Aipify — professional partner engagement.',
    'human_oversight_required', true,
    'implementation_blueprint_phase107', jsonb_build_object(
      'phase', 'Phase 107 — Growth Partner Ecosystem Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE107_GROWTH_PARTNER_ECOSYSTEM.md',
      'engine_phase', 'Repo Phase 91 Partner & Certification Ecosystem',
      'route', '/app/partners',
      'mapping_note', 'ABOS Blueprint Phase 107 extends repo Phase 91 — Growth Partners not affiliates. Distinct from Marketplace A.45 and Partner Success A.73.'
    ),
    'growth_partner_mission', public._gpebp107_mission(),
    'growth_partner_abos_principle', public._gpebp107_abos_principle(),
    'growth_partner_engagement_summary', v_engagement,
    'growth_partner_note', 'Growth Partner Ecosystem Engine (ABOS Phase 107) — partnership not extraction; humans govern certification quality.',
    'growth_partner_vision_note', public._gpebp107_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 107
-- ---------------------------------------------------------------------------
create or replace function public.get_partner_ecosystem_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.partner_ecosystem_settings;
  v_health jsonb;
begin
  v_tenant_id := public._pce_require_tenant();
  v_settings := public._pce_ensure_settings(v_tenant_id);
  perform public._pce_seed_tracks(v_tenant_id);
  perform public._pce_seed_resources(v_tenant_id);
  perform public._pce_seed_partners(v_tenant_id);
  perform public._pce_seed_certifications(v_tenant_id);
  perform public._pce_seed_leads(v_tenant_id);
  perform public._pce_seed_compliance(v_tenant_id);
  perform public._pce_calculate_scorecards(v_tenant_id);
  v_health := public._pce_ecosystem_health(v_tenant_id);
  perform public._pce_trust_explanation(v_tenant_id,
    (v_health->>'ecosystem_score')::numeric, 'Partner Ecosystem Health');

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'program_enabled', v_settings.program_enabled,
    'lead_referral_enabled', v_settings.lead_referral_enabled,
    'public_directory_enabled', v_settings.public_directory_enabled,
    'philosophy', 'Enable others to succeed with Aipify — professional partner engagement.',
    'safety_note', 'Aipify supports partner success. High-impact program decisions require human approval.',
    'ecosystem_score', v_health->'ecosystem_score',
    'active_partners', v_health->'active_partners',
    'certified_partners', v_health->'certified_partners',
    'avg_partner_score', v_health->'avg_partner_score',
    'open_leads', v_health->'open_leads',
    'compliance_pct', v_health->'compliance_pct',
    'partner_categories', jsonb_build_array(
      'Implementation Partners', 'Certified Consultants', 'Development Partners',
      'Technology Partners', 'Strategic Alliance Partners', 'Training Partners',
      'Managed Service Providers', 'Sales Partners'
    ),
    'partner_tiers', jsonb_build_array(
      jsonb_build_object('tier', 'sales_representative', 'label', public._pce_tier_label('sales_representative')),
      jsonb_build_object('tier', 'sales_expert', 'label', public._pce_tier_label('sales_expert')),
      jsonb_build_object('tier', 'certified', 'label', public._pce_tier_label('certified')),
      jsonb_build_object('tier', 'expert', 'label', public._pce_tier_label('expert'))
    ),
    'partners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'partner_name', p.partner_name, 'partner_type', p.partner_type,
        'partner_tier', p.partner_tier, 'partner_tier_label', public._pce_tier_label(p.partner_tier),
        'status', p.status, 'country', p.country, 'industry_expertise', p.industry_expertise,
        'languages', p.languages, 'service_offerings', p.service_offerings, 'description', p.description
      ) order by case p.partner_tier
        when 'expert' then 1 when 'certified' then 2 when 'sales_expert' then 3 when 'sales_representative' then 4 else 5 end)
      from public.partner_ecosystem_profiles p where p.tenant_id = v_tenant_id and p.status = 'active' limit 20
    ), '[]'::jsonb),
    'certification_tracks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'track_key', t.track_key, 'title', t.title, 'description', t.description,
        'certification_area', t.certification_area, 'requirements', t.requirements, 'renewal_months', t.renewal_months
      ))
      from public.partner_certification_tracks t where t.tenant_id = v_tenant_id and t.status = 'active'
    ), '[]'::jsonb),
    'certification_progress', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cp.id, 'partner_name', p.partner_name, 'track_title', t.title,
        'status', cp.status, 'progress_pct', cp.progress_pct, 'expires_at', cp.expires_at
      ) order by cp.progress_pct desc)
      from public.partner_certification_progress cp
      join public.partner_ecosystem_profiles p on p.id = cp.partner_id
      join public.partner_certification_tracks t on t.id = cp.track_id
      where cp.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'digital_credentials', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'credential_code', c.credential_code, 'title', c.title,
        'partner_name', p.partner_name, 'badge_label', c.badge_label,
        'status', c.status, 'issued_at', c.issued_at, 'expires_at', c.expires_at
      ) order by c.issued_at desc)
      from public.partner_digital_credentials c
      join public.partner_ecosystem_profiles p on p.id = c.partner_id
      where c.tenant_id = v_tenant_id and c.status = 'active' limit 10
    ), '[]'::jsonb),
    'scorecards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'partner_name', p.partner_name, 'partner_tier', p.partner_tier,
        'partner_tier_label', public._pce_tier_label(p.partner_tier),
        'overall_score', sc.overall_score, 'certification_completion', sc.certification_completion,
        'customer_feedback_score', sc.customer_feedback_score, 'implementation_success', sc.implementation_success
      ) order by sc.overall_score desc)
      from public.partner_ecosystem_scorecards sc
      join public.partner_ecosystem_profiles p on p.id = sc.partner_id
      where p.tenant_id = v_tenant_id
      limit 10
    ), '[]'::jsonb),
    'lead_registrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'opportunity_name', l.opportunity_name, 'company_name', l.company_name,
        'country', l.country, 'estimated_value', l.estimated_value, 'status', l.status,
        'partner_name', p.partner_name, 'protection_expires_at', l.protection_expires_at
      ) order by l.created_at desc)
      from public.partner_lead_registrations l
      left join public.partner_ecosystem_profiles p on p.id = l.partner_id
      where l.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'resource_type', r.resource_type, 'url', r.url
      ))
      from public.partner_ecosystem_resources r where r.tenant_id = v_tenant_id and r.status = 'active'
    ), '[]'::jsonb),
    'recognition_awards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'award_type', a.award_type, 'title', a.title,
        'description', a.description, 'partner_name', p.partner_name, 'year', a.year
      ) order by a.awarded_at desc)
      from public.partner_recognition_awards a
      left join public.partner_ecosystem_profiles p on p.id = a.partner_id
      where a.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'compliance_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cr.id, 'partner_id', cr.partner_id, 'partner_name', p.partner_name,
        'compliance_type', cr.compliance_type,
        'status', cr.status, 'accepted_at', cr.accepted_at, 'expires_at', cr.expires_at
      ))
      from public.partner_compliance_records cr
      join public.partner_ecosystem_profiles p on p.id = cr.partner_id
      where cr.tenant_id = v_tenant_id and cr.status = 'pending' limit 10
    ), '[]'::jsonb),
    'community_engagement', jsonb_build_array(
      'Partner forums', 'Advisory councils', 'Beta programs',
      'Product feedback initiatives', 'Innovation workshops'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.partner_ecosystem_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'knowledge_center', 'Partner & Certification Program education',
      'aipify_academy', 'Certification courses and assessments',
      'billing', 'Partner revenue and packaging',
      'enterprise_deployment', 'Enterprise partner deployment framework',
      'marketplace_governance', 'Quality standards for commerce partners',
      'ecosystem_intelligence', 'Partner relationship mapping'
    ),
    'implementation_blueprint_phase107', jsonb_build_object(
      'phase', 'Phase 107 — Growth Partner Ecosystem Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE107_GROWTH_PARTNER_ECOSYSTEM.md',
      'engine_phase', 'Repo Phase 91 Partner & Certification Ecosystem',
      'route', '/app/partners',
      'mapping_note', 'ABOS Blueprint Phase 107 extends repo Phase 91 — Growth Partners not affiliates. Distinct from Marketplace A.45 and Partner Success A.73.'
    ),
    'growth_partner_ecosystem_engine_note', 'Growth Partner Ecosystem Engine (ABOS Phase 107) — thriving ecosystem of independent businesses supporting implementation, education, consulting, and customer success — partnership not extraction.',
    'growth_partner_ecosystem_blueprint', public._gpebp107_blueprint_block(v_tenant_id),
    'growth_partner_distinction_note', public._gpebp107_distinction_note(),
    'growth_partner_mission', public._gpebp107_mission(),
    'growth_partner_philosophy', public._gpebp107_philosophy(),
    'growth_partner_abos_principle', public._gpebp107_abos_principle(),
    'growth_partner_objectives', public._gpebp107_objectives(),
    'growth_partner_who_can_become', public._gpebp107_who_can_become(),
    'growth_partner_business_opportunities', public._gpebp107_partner_business_opportunities(),
    'growth_partner_certification_levels', public._gpebp107_partner_certification_levels(),
    'growth_partner_portal', public._gpebp107_partner_portal(),
    'growth_partner_matching_engine', public._gpebp107_partner_matching_engine(),
    'growth_partner_marketing_resource_center', public._gpebp107_marketing_resource_center(),
    'growth_partner_recognition', public._gpebp107_partner_recognition(),
    'growth_partner_companion_guidance', public._gpebp107_companion_guidance(),
    'growth_partner_self_love_connection', public._gpebp107_self_love_connection(),
    'growth_partner_leadership_connection', public._gpebp107_leadership_connection(),
    'growth_partner_trust_connection', public._gpebp107_trust_connection(),
    'growth_partner_limitation_principles', public._gpebp107_limitation_principles(),
    'growth_partner_dogfooding', public._gpebp107_dogfooding(),
    'gpebp107_integration_links', public._gpebp107_integration_links(),
    'growth_partner_engagement_summary', public._gpebp107_engagement_summary(v_tenant_id),
    'growth_partner_success_criteria', public._gpebp107_success_criteria(v_tenant_id),
    'growth_partner_vision', public._gpebp107_vision(),
    'growth_partner_vision_phrases', public._gpebp107_vision_phrases(),
    'growth_partner_privacy_note', 'Growth Partner metadata only — no Affiliate language, no automated partner assignment. Humans govern programs; Aipify Growth Partner Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._gpebp107_distinction_note() to authenticated;
grant execute on function public._gpebp107_mission() to authenticated;
grant execute on function public._gpebp107_philosophy() to authenticated;
grant execute on function public._gpebp107_abos_principle() to authenticated;
grant execute on function public._gpebp107_vision() to authenticated;
grant execute on function public._gpebp107_objectives() to authenticated;
grant execute on function public._gpebp107_who_can_become() to authenticated;
grant execute on function public._gpebp107_partner_business_opportunities() to authenticated;
grant execute on function public._gpebp107_partner_certification_levels() to authenticated;
grant execute on function public._gpebp107_partner_portal() to authenticated;
grant execute on function public._gpebp107_partner_matching_engine() to authenticated;
grant execute on function public._gpebp107_marketing_resource_center() to authenticated;
grant execute on function public._gpebp107_partner_recognition() to authenticated;
grant execute on function public._gpebp107_companion_guidance() to authenticated;
grant execute on function public._gpebp107_self_love_connection() to authenticated;
grant execute on function public._gpebp107_leadership_connection() to authenticated;
grant execute on function public._gpebp107_trust_connection() to authenticated;
grant execute on function public._gpebp107_limitation_principles() to authenticated;
grant execute on function public._gpebp107_dogfooding() to authenticated;
grant execute on function public._gpebp107_vision_phrases() to authenticated;
grant execute on function public._gpebp107_integration_links() to authenticated;
grant execute on function public._gpebp107_engagement_summary(uuid) to authenticated;
grant execute on function public._gpebp107_success_criteria(uuid) to authenticated;
grant execute on function public._gpebp107_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'growth-partner-ecosystem-blueprint-phase107', 'Growth Partner Ecosystem Engine (ABOS Phase 107)',
  'Growth Partner Ecosystem Engine — independent businesses supporting implementation, education, consulting, and customer success. Growth Partners not affiliates. See PARTNER_TERMINOLOGY_UPDATE.md.',
  'authenticated', 137
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'growth-partner-ecosystem-blueprint-phase107' and tenant_id is null
);
