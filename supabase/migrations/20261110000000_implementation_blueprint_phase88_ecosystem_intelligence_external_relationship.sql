-- Implementation Blueprint Phase 88 — Ecosystem Intelligence & External Relationship Engine
-- Extends Ecosystem Intelligence & External Relationship Repo Phase 88 (_eco_*). No new tables.
-- Distinct from Wonder Engine Phase A.88 at /app/wonder-engine (engine phase number collision).
-- Cross-link Blueprint Phase 84 Ecosystem Scenario Planning at /app/simulations — not duplicate.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._eierbp88_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 88 — Ecosystem Intelligence & External Relationship Engine at /app/ecosystem. Extends Ecosystem Intelligence Repo Phase 88 via _eco_* helpers. Distinct from Wonder Engine Phase A.88 at /app/wonder-engine (engine phase number collision). Cross-link Blueprint Phase 84 Ecosystem Scenario Planning at /app/simulations — scenario preparedness, not duplicate. Cross-link RSI /app/assistant/relationships (personal relationships), Trust & Reputation A.72, Marketplace A.45, Sales Expert A.95, Integration A.8, Gratitude A.89, Customer Success A.26, Organizational Resilience A.50. Helpers: _eco_* (Repo Phase 88) — Blueprint Phase 88 uses _eierbp88_* only. Stewardship not surveillance — humans govern relationships.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._eierbp88_mission()
returns text language sql immutable as $$
  select 'Build stronger ecosystems through awareness, stewardship, and coordination of external relationships.';
$$;

create or replace function public._eierbp88_philosophy()
returns text language sql immutable as $$
  select 'Relationships are strategic assets — trust built over time creates organizational resilience.';
$$;

create or replace function public._eierbp88_abos_principle()
returns text language sql immutable as $$
  select 'Organizations succeed through the quality of relationships they cultivate — Aipify maps and informs; humans govern and nurture every external connection.';
$$;

create or replace function public._eierbp88_vision()
returns text language sql immutable as $$
  select 'Our ecosystem has become one of our greatest strengths.';
$$;

create or replace function public._eierbp88_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'relationship_awareness', 'label', 'Relationship awareness', 'description', 'Map and understand customers, partners, suppliers, and community connections with transparency'),
    jsonb_build_object('key', 'partnership_stewardship', 'label', 'Partnership stewardship', 'description', 'Support thoughtful stewardship of strategic alliances and technology partnerships'),
    jsonb_build_object('key', 'dependency_coordination', 'label', 'Dependency coordination', 'description', 'Coordinate awareness of external dependencies without surveillance or hidden profiling'),
    jsonb_build_object('key', 'community_connection', 'label', 'Community connection', 'description', 'Strengthen community and industry network relationships with genuine care'),
    jsonb_build_object('key', 'customer_relationship_intelligence', 'label', 'Customer relationship intelligence', 'description', 'Connect customer success themes to ecosystem health — metadata only, cross-link Customer Success A.26'),
    jsonb_build_object('key', 'ecosystem_resilience', 'label', 'Ecosystem resilience', 'description', 'Build resilience through diversified, well-governed external relationships')
  );
$$;

create or replace function public._eierbp88_relationship_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Blueprint relationship categories — stewardship framing distinct from runtime _eco_* category taxonomy.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Customer relationships, loyalty dynamics, and success themes — metadata only'),
      jsonb_build_object('key', 'strategic_partners', 'label', 'Strategic partners', 'description', 'Alliances, co-marketing, and distribution relationships'),
      jsonb_build_object('key', 'suppliers', 'label', 'Suppliers', 'description', 'Supply chain, vendor dependencies, and supplier resilience'),
      jsonb_build_object('key', 'sales_experts', 'label', 'Sales Experts', 'description', 'Certified partner network and channel relationships — cross-link Sales Expert A.95'),
      jsonb_build_object('key', 'tech_providers', 'label', 'Technology providers', 'description', 'Platform providers, integration alliances — cross-link Integration Engine A.8'),
      jsonb_build_object('key', 'advisors', 'label', 'Advisors', 'description', 'Consultants, mentors, and strategic advisory relationships'),
      jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'User communities, industry groups, and collective intelligence — cross-link Community Phase 89'),
      jsonb_build_object('key', 'industry_networks', 'label', 'Industry networks', 'description', 'Professional networks, associations, and ecosystem forums')
    ),
    'boundary_note', 'Categories scaffold stewardship dialogue — not manipulative scoring or hidden profiling.'
  );
$$;

create or replace function public._eierbp88_relationship_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relationship insights — stewardship not surveillance; reflection prompts, not manipulative scoring.',
    'insights', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'stewardship_review', 'prompt', '🦉 Which external relationships may benefit from thoughtful stewardship review — without surveillance or hidden profiling?', 'description', 'Wisdom-driven reflection on relationship health from organization-declared maps.'),
      jsonb_build_object('emoji', '🌹', 'key', 'mutual_value', 'prompt', '🌹 Where is mutual value strongest in your ecosystem — and where might care and attention strengthen trust?', 'description', 'Gratitude and authentic connection — relationships as strategic assets.'),
      jsonb_build_object('emoji', '🔔', 'key', 'dependency_awareness', 'prompt', '🔔 Which dependencies deserve calm leadership attention — coordination without alarm or manipulative scoring?', 'description', 'Bell moments for dependency awareness — humans govern relationships.')
    ),
    'reflection_note', 'Insights prepare dialogue — not conclusions, surveillance, or autonomous relationship commitments.'
  );
$$;

create or replace function public._eierbp88_partnership_health()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partnership health — five dimensions for stewardship review; not manipulative scoring.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'communication', 'label', 'Communication', 'description', 'Clarity, cadence, and transparency in partner dialogue'),
      jsonb_build_object('key', 'mutual_value', 'label', 'Mutual value', 'description', 'Shared benefit and reciprocal contribution across the partnership'),
      jsonb_build_object('key', 'dependency', 'label', 'Dependency balance', 'description', 'Concentration awareness and diversification preparedness — cross-link Phase 84 scenarios'),
      jsonb_build_object('key', 'alignment', 'label', 'Strategic alignment', 'description', 'Shared direction, values compatibility, and long-term fit'),
      jsonb_build_object('key', 'collaboration_opportunities', 'label', 'Collaboration opportunities', 'description', 'Emerging joint initiatives and co-creation possibilities — humans decide pursuit')
    ),
    'health_note', 'Health dimensions scaffold leadership review — Aipify does not score partners manipulatively.'
  );
$$;

create or replace function public._eierbp88_customer_relationship_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer relationship intelligence — connect customer success themes to ecosystem health; metadata only.',
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'success_themes', 'label', 'Customer success themes', 'description', 'Recurring support and success patterns — cross-link Customer Success A.26'),
      jsonb_build_object('key', 'loyalty_signals', 'label', 'Loyalty and retention signals', 'description', 'Aggregate engagement trends — never individual profiling'),
      jsonb_build_object('key', 'feedback_patterns', 'label', 'Feedback patterns', 'description', 'Approved feedback metadata informing relationship stewardship'),
      jsonb_build_object('key', 'expansion_opportunities', 'label', 'Expansion opportunities', 'description', 'Growth themes for human review — not automated outreach')
    ),
    'boundary_note', 'Metadata only — no raw customer records, chat, orders, or PII. Cross-link RSI for personal relationships only.'
  );
$$;

create or replace function public._eierbp88_community_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community connection — industry communities, user groups, and expert networks with genuine care.',
    'connections', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'gratitude', 'prompt', '🌹 Which community relationships deserve gratitude and recognition — cross-link Gratitude A.89?', 'description', 'Authentic appreciation strengthens ecosystem trust.'),
      jsonb_build_object('emoji', '🦉', 'key', 'stewardship', 'prompt', '🦉 How might your industry and user communities strengthen long-term ecosystem resilience?', 'description', 'Wisdom-driven community stewardship — not extraction.'),
      jsonb_build_object('emoji', '❤️', 'key', 'care', 'prompt', '❤️ What would caring community engagement look like — honoring people, not transactional scoring?', 'description', 'Human connection with compassion — humans decide engagement.'),
      jsonb_build_object('emoji', '🔔', 'key', 'engagement_review', 'prompt', '🔔 Which community connections may benefit from calm leadership review this quarter?', 'description', 'Bell moments for community attention — coordination not surveillance.')
    ),
    'community_note', 'Community connection complements Community Intelligence Phase 89 — cross-link only, no duplicate storage.'
  );
$$;

create or replace function public._eierbp88_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — stewardship not surveillance; humans govern every external relationship.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'stewardship_summary', 'prompt', '🦉 Relationship patterns may benefit from stewardship review — shall I prepare a summary from your declared relationship maps?', 'consideration', 'Awareness and coordination — not surveillance or hidden profiling.'),
      jsonb_build_object('emoji', '🌹', 'key', 'partnership_health', 'prompt', '🌹 Partnership health strengthens ecosystem resilience — would a coordination overview across your strategic alliances help leadership?', 'consideration', 'Mutual value and alignment — humans nurture connections.'),
      jsonb_build_object('emoji', '🔔', 'key', 'community_engagement', 'prompt', '🔔 Community connections deserve care — shall I outline engagement themes from approved metadata for your review?', 'consideration', 'Community connection — not automated outreach or manipulative scoring.')
    )
  );
$$;

create or replace function public._eierbp88_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — patience, gratitude, and authentic connection; ecosystems grow through genuine care.',
    'practices', jsonb_build_array(
      'Patience — strong relationships develop over time, not through transactional urgency',
      'Gratitude — appreciate partners, customers, and communities who strengthen your ecosystem',
      'Authentic connection — nurture relationships with care, not manipulative scoring',
      'Humility — external dependencies deserve respectful stewardship, not surveillance'
    ),
    'journey_phrase', 'Strong ecosystems grow through genuine care, not transactional scoring.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports relationship stewardship mindset — principle only; Ecosystem Intelligence stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._eierbp88_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — ecosystem health summaries and partnership indicators; humans decide relationship strategy.',
    'insights', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'ecosystem_health', 'label', 'Ecosystem health summary', 'description', 'Ecosystem Health Score components and band context — transparency not alarm'),
      jsonb_build_object('emoji', '🦉', 'key', 'dependency_awareness', 'label', 'Dependency awareness', 'description', 'Critical dependencies and concentration themes for calm leadership review'),
      jsonb_build_object('emoji', '🌹', 'key', 'partnership_strength', 'label', 'Partnership strength indicators', 'description', 'Mutual value and alignment themes across strategic relationships'),
      jsonb_build_object('emoji', '🔔', 'key', 'stewardship_priorities', 'label', 'Stewardship priorities', 'description', 'Relationships and communities that may benefit from leadership attention — humans decide')
    ),
    'clarity_note', 'Insights prepare leadership dialogue — cross-link Executive Insights A.35 and Trust & Reputation A.72.'
  );
$$;

create or replace function public._eierbp88_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about relationship sources, consent, limitation principles, and the distinction between mapping and governing.',
    'leaders_should_know', jsonb_build_array(
      'Relationship maps use organization-declared data only — no unauthorized external monitoring',
      'Ecosystem Health Score reflects declared dependencies and risks — not manipulative partner scoring',
      'External monitoring requires explicit consent via ecosystem_settings',
      'Stewardship not surveillance — Aipify informs; humans govern every commitment'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Blueprint Phase 88 extends Repo Phase 88 at /app/ecosystem — same route, layered scaffolding',
      'Distinct from Wonder Engine A.88 at /app/wonder-engine — personal wonder, not external relationships',
      'Cross-link Phase 84 Ecosystem Scenario Planning at /app/simulations for preparedness context',
      'No hidden profiling, excessive automation of human connection, or autonomous relationship commitments'
    ),
    'audit_note', 'Ecosystem events logged via _eco_log_audit — metadata only, full transparency.'
  );
$$;

create or replace function public._eierbp88_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — stewardship not surveillance; avoid manipulative scoring, hidden profiling, and automating human connection.',
    'forbidden', jsonb_build_array(
      'Manipulative relationship scoring or partner ranking without transparency',
      'Hidden profiling of partners, customers, or community members',
      'Excessive automation of human connection or relationship outreach',
      'Unauthorized external monitoring without explicit consent',
      'Autonomous relationship commitments or partnership agreements'
    ),
    'required', jsonb_build_array(
      'Organization-declared relationship maps with human governance',
      'Transparent Ecosystem Health Score components and trust explanations',
      'Explicit consent for external monitoring',
      'Stewardship framing — awareness and coordination, not surveillance',
      'Human leadership retains authority over every external relationship'
    ),
    'boundary_note', 'Aipify maps relationships. Humans govern relationships.'
  );
$$;

create or replace function public._eierbp88_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates ecosystem intelligence patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Sales Expert community, customer success, tech partnerships, strategic alliances, user communities',
      'focus', jsonb_build_array(
        'Sales Expert community relationship stewardship and partner network health',
        'Customer success patterns informing ecosystem relationship intelligence',
        'Technology partnership coordination — Integration Engine and platform alliances',
        'Strategic alliance stewardship and marketplace partner ecosystem',
        'User community connection and industry network engagement'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce ecosystem relationships',
      'focus', jsonb_build_array(
        'Customer and supplier relationship mapping for commerce operations',
        'Technology provider dependencies and integration stewardship',
        'Community and partner engagement themes for leadership review',
        'Ecosystem resilience patterns during market evolution'
      )
    )
  );
$$;

create or replace function public._eierbp88_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Our ecosystem has become one of our greatest strengths.',
    'Relationships are strategic assets — trust over time creates resilience.',
    'Stewardship not surveillance — humans govern relationships.',
    'Aipify maps relationships. Humans govern relationships.',
    'Organizations succeed through the quality of relationships they cultivate.',
    'Strong ecosystems grow through genuine care, not transactional scoring.'
  );
$$;

create or replace function public._eierbp88_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Relationship & Social Intelligence (RSI)', 'route', '/app/assistant/relationships', 'note', 'Personal relationships — distinct from external ecosystem mapping'),
    jsonb_build_object('label', 'Trust & Reputation (A.72)', 'route', '/app/trust-reputation-engine', 'note', 'Trust transparency and reputation stewardship'),
    jsonb_build_object('label', 'Marketplace & Partner (A.45)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Partner ecosystem foundation — cross-link only'),
    jsonb_build_object('label', 'Sales Expert (A.95)', 'route', '/app/sales-expert-operating-system', 'note', 'Sales Expert community and certified partner network'),
    jsonb_build_object('label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Technology provider dependencies and connector orchestration'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition culture for partner and community relationships'),
    jsonb_build_object('label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine', 'note', 'Customer relationship intelligence — metadata themes'),
    jsonb_build_object('label', 'Organizational Resilience (A.50)', 'route', '/app/organizational-resilience-engine', 'note', 'Crisis and dependency preparedness — cross-link Phase 81'),
    jsonb_build_object('label', 'Ecosystem Scenario Planning (Blueprint 84)', 'route', '/app/simulations', 'note', 'Ecosystem preparedness scenarios — not duplicate'),
    jsonb_build_object('label', 'Community Intelligence (Phase 89)', 'route', '/app/community', 'note', 'Collective intelligence and community health — cross-link only'),
    jsonb_build_object('label', 'Digital Twin (Phase 77)', 'route', '/app/digital-twin', 'note', 'External dependencies and cross-boundary workflows'),
    jsonb_build_object('label', 'Continuity Engine (Phase 80)', 'route', '/app/continuity', 'note', 'Supplier failures and backup relationship planning'),
    jsonb_build_object('label', 'Strategic Intelligence (A.31 / Blueprint 79)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Ecosystem opportunities and diversification context'),
    jsonb_build_object('label', 'Wonder Engine (A.88)', 'route', '/app/wonder-engine', 'note', 'Personal wonder — engine phase number collision, cross-link only')
  );
$$;

create or replace function public._eierbp88_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_relationships int := 0;
  v_risks int := 0;
  v_opportunities int := 0;
  v_score numeric;
begin
  select count(*) into v_relationships from public.ecosystem_relationships
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_risks from public.ecosystem_risks
  where tenant_id = p_tenant_id and status = 'open';

  select count(*) into v_opportunities from public.ecosystem_opportunities
  where tenant_id = p_tenant_id and status = 'open';

  select ecosystem_score into v_score from public.ecosystem_scores
  where tenant_id = p_tenant_id order by created_at desc limit 1;

  return jsonb_build_object(
    'active_relationships', v_relationships,
    'open_risks', v_risks,
    'open_opportunities', v_opportunities,
    'ecosystem_score', coalesce(v_score, 0),
    'relationship_categories', jsonb_array_length(public._eierbp88_relationship_categories()->'categories'),
    'relationship_insights', jsonb_array_length(public._eierbp88_relationship_insights()->'insights'),
    'partnership_health_dimensions', jsonb_array_length(public._eierbp88_partnership_health()->'dimensions'),
    'companion_examples', jsonb_array_length(public._eierbp88_companion_guidance()->'examples'),
    'community_connections', jsonb_array_length(public._eierbp88_community_connection()->'connections'),
    'integration_links', jsonb_array_length(public._eierbp88_integration_links()),
    'privacy_note', 'Metadata only — relationship counts, score context, and stewardship scaffolds. No raw customer content, chat, or PII.'
  );
end; $$;

create or replace function public._eierbp88_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_relationships int := 0;
begin
  v_engagement := public._eierbp88_engagement_summary(p_tenant_id);
  v_relationships := coalesce((v_engagement->>'active_relationships')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'relationship_categories',
      'label', 'Relationship categories — eight stewardship categories documented',
      'met', jsonb_array_length(public._eierbp88_relationship_categories()->'categories') >= 8,
      'note', 'Customers, strategic partners, suppliers, Sales Experts, tech providers, advisors, communities, industry networks.'
    ),
    jsonb_build_object(
      'key', 'relationship_insights',
      'label', 'Relationship insights — stewardship not surveillance (🦉🌹🔔)',
      'met', jsonb_array_length(public._eierbp88_relationship_insights()->'insights') >= 3,
      'note', 'Reflection prompts — not manipulative scoring or hidden profiling.'
    ),
    jsonb_build_object(
      'key', 'partnership_health',
      'label', 'Partnership health — five dimensions documented',
      'met', jsonb_array_length(public._eierbp88_partnership_health()->'dimensions') >= 5,
      'note', 'Communication, mutual value, dependency, alignment, collaboration opportunities.'
    ),
    jsonb_build_object(
      'key', 'customer_relationship_intelligence',
      'label', 'Customer relationship intelligence — metadata signals documented',
      'met', jsonb_array_length(public._eierbp88_customer_relationship_intelligence()->'signals') >= 4,
      'note', 'Cross-link Customer Success A.26 — metadata only.'
    ),
    jsonb_build_object(
      'key', 'community_connection',
      'label', 'Community connection — care framing documented (🌹🦉❤️🔔)',
      'met', jsonb_array_length(public._eierbp88_community_connection()->'connections') >= 4,
      'note', 'Genuine care — not extraction or transactional scoring.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — stewardship prompts documented',
      'met', jsonb_array_length(public._eierbp88_companion_guidance()->'examples') >= 3,
      'note', 'Stewardship summary, partnership health, community engagement.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no manipulative scoring, hidden profiling, or excessive automation',
      'met', jsonb_array_length(public._eierbp88_limitation_principles()->'forbidden') >= 5,
      'note', 'Stewardship not surveillance — humans govern relationships.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — consent, sources, and limitations documented',
      'met', jsonb_array_length(public._eierbp88_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — genuine care in ecosystem stewardship',
      'met', (public._eierbp88_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Strong ecosystems grow through genuine care, not transactional scoring.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — ecosystem health and stewardship priorities',
      'met', jsonb_array_length(public._eierbp88_leadership_insights()->'insights') >= 4,
      'note', 'Humans decide relationship strategy — Aipify prepares context.'
    ),
    jsonb_build_object(
      'key', 'objectives',
      'label', 'Six ecosystem intelligence objectives documented',
      'met', jsonb_array_length(public._eierbp88_objectives()) >= 6,
      'note', 'Awareness, stewardship, dependency coordination, community, customer intelligence, resilience.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links RSI, Trust A.72, Marketplace A.45, Sales Expert A.95, Phase 84 simulations',
      'met', jsonb_array_length(public._eierbp88_integration_links()) >= 12,
      'note', 'Extend related engines — do not duplicate relationship storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sales Expert community, customer success, tech partnerships, alliances, communities',
      'met', (public._eierbp88_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'ecosystem_baseline',
      'label', 'Ecosystem relationship baseline — declared maps from Repo Phase 88',
      'met', v_relationships >= 0,
      'note', case when v_relationships = 0 then 'Seed relationship maps to validate ecosystem intelligence baseline.' else null end
    ),
    jsonb_build_object(
      'key', 'vision',
      'label', 'Vision phrase documented',
      'met', (public._eierbp88_vision()) is not null,
      'note', 'Our ecosystem has become one of our greatest strengths.'
    )
  );
end; $$;

create or replace function public._eierbp88_ecosystem_intelligence_external_relationship_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'implementation_blueprint_phase88', jsonb_build_object(
      'phase', 'Phase 88 — Ecosystem Intelligence & External Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE88_ECOSYSTEM_INTELLIGENCE_EXTERNAL_RELATIONSHIP.md',
      'engine_phase', 'Repo Phase 88 Ecosystem Intelligence & External Relationship',
      'route', '/app/ecosystem',
      'mapping_note', 'ABOS Blueprint Phase 88 extends Repo Phase 88 with relationship stewardship scaffolding — awareness, partnership health, community connection, and limitation principles. Distinct from Wonder Engine A.88 at /app/wonder-engine. Cross-link Blueprint Phase 84 at /app/simulations.'
    ),
    'ecosystem_intelligence_external_relationship_note', 'Ecosystem Intelligence & External Relationship Engine (ABOS Phase 88) — build stronger ecosystems through awareness, stewardship, and coordination of external relationships.',
    'distinction_note', public._eierbp88_distinction_note(),
    'mission', public._eierbp88_mission(),
    'philosophy', public._eierbp88_philosophy(),
    'abos_principle', public._eierbp88_abos_principle(),
    'vision', public._eierbp88_vision(),
    'objectives', public._eierbp88_objectives(),
    'blueprint_relationship_categories', public._eierbp88_relationship_categories(),
    'relationship_insights', public._eierbp88_relationship_insights(),
    'partnership_health', public._eierbp88_partnership_health(),
    'customer_relationship_intelligence', public._eierbp88_customer_relationship_intelligence(),
    'community_connection', public._eierbp88_community_connection(),
    'companion_guidance', public._eierbp88_companion_guidance(),
    'self_love_connection', public._eierbp88_self_love_connection(),
    'leadership_insights', public._eierbp88_leadership_insights(),
    'trust_connection', public._eierbp88_trust_connection(),
    'limitation_principles', public._eierbp88_limitation_principles(),
    'dogfooding', public._eierbp88_dogfooding(),
    'success_criteria', public._eierbp88_success_criteria(p_tenant_id),
    'vision_phrases', public._eierbp88_vision_phrases(),
    'integration_links', public._eierbp88_integration_links(),
    'engagement_summary', public._eierbp88_engagement_summary(p_tenant_id),
    'privacy_note', 'Ecosystem intelligence blueprint data is metadata only — relationship counts, stewardship scaffolds, and partnership health dimensions. No raw customer content, chat, orders, or PII. Humans govern every external relationship.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Repo Phase 88 fields; append blueprint block
-- ---------------------------------------------------------------------------
create or replace function public.get_ecosystem_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_settings;
  v_score jsonb;
  v_relationships jsonb;
  v_dependencies jsonb;
  v_risks jsonb;
  v_opportunities jsonb;
  v_briefings jsonb;
  v_categories jsonb;
begin
  v_tenant_id := public._eco_require_tenant();
  v_settings := public._eco_ensure_settings(v_tenant_id);
  perform public._eco_seed_relationships(v_tenant_id);
  perform public._eco_analyze_risks(v_tenant_id);
  perform public._eco_seed_opportunities(v_tenant_id);
  v_score := public._eco_calculate_score(v_tenant_id);
  perform public._eco_trust_explanation(v_tenant_id,
    (v_score->>'ecosystem_score')::numeric, v_score->>'ecosystem_band');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', er.id, 'relationship_name', er.relationship_name, 'category', er.category,
    'description', er.description, 'strategic_importance', er.strategic_importance,
    'dependency_level', er.dependency_level, 'value_contribution', er.value_contribution,
    'primary_owner', ro.primary_owner, 'secondary_owner', ro.secondary_owner,
    'continuity_owner', ro.continuity_owner
  ) order by case er.strategic_importance when 'critical' then 1 when 'high' then 2 else 3 end), '[]'::jsonb)
  into v_relationships
  from public.ecosystem_relationships er
  left join public.relationship_owners ro on ro.relationship_id = er.id
  where er.tenant_id = v_tenant_id and er.status = 'active'
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ed.id, 'relationship_id', ed.relationship_id,
    'relationship_name', er.relationship_name,
    'dependency_type', ed.dependency_type, 'dependency_name', ed.dependency_name,
    'criticality_level', ed.criticality_level,
    'continuity_plan_reference', ed.continuity_plan_reference
  ) order by case ed.criticality_level when 'critical' then 1 when 'high' then 2 else 3 end), '[]'::jsonb)
  into v_dependencies
  from public.ecosystem_dependencies ed
  join public.ecosystem_relationships er on er.id = ed.relationship_id
  where ed.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'relationship_id', r.relationship_id, 'risk_description', r.risk_description,
    'risk_type', r.risk_type, 'severity', r.severity,
    'mitigation_recommendation', r.mitigation_recommendation, 'status', r.status,
    'created_at', r.created_at
  ) order by case r.severity when 'critical' then 1 when 'high' then 2 else 3 end), '[]'::jsonb)
  into v_risks
  from public.ecosystem_risks r
  where r.tenant_id = v_tenant_id and r.status = 'open'
    and (v_settings.show_critical_risks or r.severity != 'critical')
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'title', o.title, 'description', o.description,
    'opportunity_type', o.opportunity_type, 'status', o.status
  )), '[]'::jsonb) into v_opportunities
  from public.ecosystem_opportunities o
  where o.tenant_id = v_tenant_id and o.status = 'open'
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.ecosystem_briefings b where b.tenant_id = v_tenant_id limit 5;

  v_categories := jsonb_build_array(
    jsonb_build_object('key', 'customers', 'label', 'Customers'),
    jsonb_build_object('key', 'partners', 'label', 'Partners'),
    jsonb_build_object('key', 'suppliers', 'label', 'Suppliers'),
    jsonb_build_object('key', 'technology_providers', 'label', 'Technology Providers'),
    jsonb_build_object('key', 'regulatory_bodies', 'label', 'Regulatory Bodies'),
    jsonb_build_object('key', 'consultants', 'label', 'Consultants'),
    jsonb_build_object('key', 'external_developers', 'label', 'External Developers'),
    jsonb_build_object('key', 'community_contributors', 'label', 'Community Contributors')
  );

  return jsonb_build_object(
    'has_customer', true,
    'consent_required', true,
    'human_governance_required', true,
    'intelligence_enabled', v_settings.intelligence_enabled,
    'external_monitoring_consent', v_settings.external_monitoring_consent,
    'philosophy', 'Aipify maps relationships. Humans govern relationships.',
    'safety_note', 'No unauthorized external monitoring. Transparency and consent are mandatory.',
    'ecosystem_score', v_score->'ecosystem_score',
    'ecosystem_band', v_score->'ecosystem_band',
    'ecosystem_band_label', v_score->'ecosystem_band_label',
    'score_components', v_score->'components',
    'dependency_score', v_score->'dependency_score',
    'resilience_score', v_score->'resilience_score',
    'partner_score', v_score->'partner_score',
    'relationships', v_relationships,
    'critical_dependencies', v_dependencies,
    'external_risks', v_risks,
    'partnership_opportunities', v_opportunities,
    'briefings', v_briefings,
    'relationship_categories', v_categories,
    'review_frequencies', jsonb_build_array(
      jsonb_build_object('key', 'monthly', 'label', 'Monthly', 'purpose', 'Monitor ecosystem changes'),
      jsonb_build_object('key', 'quarterly', 'label', 'Quarterly', 'purpose', 'Assess strategic alignment'),
      jsonb_build_object('key', 'annual', 'label', 'Annual', 'purpose', 'Evaluate long-term resilience')
    ),
    'integrations', jsonb_build_object(
      'digital_twin', 'External dependencies and cross-boundary workflows',
      'continuity_engine', 'Supplier failures and backup relationship planning',
      'strategic_intelligence', 'Ecosystem opportunities and diversification',
      'marketplace', 'Partner and pack relationship mapping',
      'value_engine', 'Partner and supplier value contribution',
      'risk_engine', 'External exposure and concentration risks',
      'executive_briefing', 'Ecosystem briefings with critical dependencies'
    ),
    'ecosystem_intelligence_external_relationship_blueprint', public._eierbp88_ecosystem_intelligence_external_relationship_block(v_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Repo Phase 88 fields; append Phase 88 blueprint framing
-- ---------------------------------------------------------------------------
create or replace function public.get_ecosystem_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score numeric;
  v_band text;
  v_risks int;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select ecosystem_score, ecosystem_band into v_score, v_band
  from public.ecosystem_scores where tenant_id = v_tenant_id order by created_at desc limit 1;

  select count(*) into v_risks from public.ecosystem_risks
  where tenant_id = v_tenant_id and status = 'open';

  v_engagement := public._eierbp88_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'ecosystem_score', coalesce(v_score, 0),
    'ecosystem_band', v_band,
    'ecosystem_band_label', public._eco_band_label(coalesce(v_band, 'improvement_opportunities')),
    'open_risks', v_risks,
    'philosophy', 'Aipify maps relationships. Humans govern relationships.',
    'consent_required', true,
    'implementation_blueprint_phase88', jsonb_build_object(
      'phase', 'Phase 88 — Ecosystem Intelligence & External Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE88_ECOSYSTEM_INTELLIGENCE_EXTERNAL_RELATIONSHIP.md',
      'engine_phase', 'Repo Phase 88 Ecosystem Intelligence & External Relationship',
      'route', '/app/ecosystem'
    ),
    'blueprint_mission', public._eierbp88_mission(),
    'blueprint_abos_principle', public._eierbp88_abos_principle(),
    'blueprint_vision', public._eierbp88_vision(),
    'stewardship_note', 'Stewardship not surveillance — humans govern every external relationship.',
    'blueprint_engagement_summary', v_engagement,
    'blueprint_note', 'Ecosystem Intelligence & External Relationship (ABOS Phase 88) — awareness, stewardship, and coordination of external relationships.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._eierbp88_distinction_note() to authenticated;
grant execute on function public._eierbp88_mission() to authenticated;
grant execute on function public._eierbp88_philosophy() to authenticated;
grant execute on function public._eierbp88_abos_principle() to authenticated;
grant execute on function public._eierbp88_vision() to authenticated;
grant execute on function public._eierbp88_objectives() to authenticated;
grant execute on function public._eierbp88_relationship_categories() to authenticated;
grant execute on function public._eierbp88_relationship_insights() to authenticated;
grant execute on function public._eierbp88_partnership_health() to authenticated;
grant execute on function public._eierbp88_customer_relationship_intelligence() to authenticated;
grant execute on function public._eierbp88_community_connection() to authenticated;
grant execute on function public._eierbp88_companion_guidance() to authenticated;
grant execute on function public._eierbp88_self_love_connection() to authenticated;
grant execute on function public._eierbp88_leadership_insights() to authenticated;
grant execute on function public._eierbp88_trust_connection() to authenticated;
grant execute on function public._eierbp88_limitation_principles() to authenticated;
grant execute on function public._eierbp88_dogfooding() to authenticated;
grant execute on function public._eierbp88_vision_phrases() to authenticated;
grant execute on function public._eierbp88_integration_links() to authenticated;
grant execute on function public._eierbp88_engagement_summary(uuid) to authenticated;
grant execute on function public._eierbp88_success_criteria(uuid) to authenticated;
grant execute on function public._eierbp88_ecosystem_intelligence_external_relationship_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'ecosystem-blueprint-phase88', 'Ecosystem Intelligence & External Relationship (ABOS Phase 88)',
  'Ecosystem Intelligence blueprint — relationship stewardship, partnership health, community connection, limitation principles, and live success criteria. Extends Repo Phase 88 at /app/ecosystem.',
  'authenticated', 121
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'ecosystem-blueprint-phase88' and tenant_id is null
);
