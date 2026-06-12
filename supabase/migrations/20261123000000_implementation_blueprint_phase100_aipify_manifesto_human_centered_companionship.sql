-- Implementation Blueprint Phase 100 — Aipify Manifesto & The Future of Human-Centered Companionship
-- Extends Aipify Manifesto & Founding Vision (repo Phase 99) at /app/manifesto. No new tables.
-- Phase number collision: Platform Install Connectors repo Phase 100 at /app/platform-install;
--   Blueprint Phase 99 Human-AI Partnership at /app/companion-identity-engine (distinct surface).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._amfhcbp100_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 100 — Aipify Manifesto & The Future of Human-Centered Companionship at /app/manifesto. Extends Aipify Manifesto & Founding Vision repo Phase 99 and preserves ALL baseline (_amf_*) dashboard and card fields. Human-centered companionship framing — trusted Business Companion within ABOS, not merely an AI tool. Distinct from Platform Install Connectors repo Phase 100 at /app/platform-install (phase number collision only). Distinct from Blueprint Phase 99 Human-AI Partnership at /app/companion-identity-engine on A.84. Helpers use _amfhcbp100_* — never collide with _amf_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._amfhcbp100_purpose_why_aipify_exists()
returns text language sql immutable as $$
  select 'Businesses should not navigate complexity alone. Aipify exists to be a trusted Business Companion within the Aipify Business Operating System (ABOS) — not merely an AI tool — helping people perform at their best while preserving dignity, agency, and humanity.';
$$;

create or replace function public._amfhcbp100_our_belief()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'people_flourish', 'number', 1, 'title', 'Technology Should Help People Flourish', 'description', 'We believe technology should help people flourish — not diminish human dignity or replace human judgment.'),
    jsonb_build_object('key', 'companionship_matters', 'number', 2, 'title', 'Companionship Matters More Than Automation Volume', 'description', 'We believe companionship matters more than automation volume — intelligent support without surrendering agency.'),
    jsonb_build_object('key', 'trust_earned', 'number', 3, 'title', 'Trust Must Be Earned', 'description', 'We believe trust must be earned through transparency, consistency, human control, and explainability.'),
    jsonb_build_object('key', 'learning_never_ends', 'number', 4, 'title', 'Learning Never Ends', 'description', 'We believe learning never ends — for organizations, for people, and for Aipify itself — with human approval for adaptive learning.'),
    jsonb_build_object('key', 'future_more_human', 'number', 5, 'title', 'The Future Can Become More Human', 'description', 'We believe the future of work can become more human, not less — technology adapting to people, not the reverse.'),
    jsonb_build_object('key', 'wisdom_in_building', 'number', 6, 'title', 'Wisdom in How We Build Matters', 'description', 'We believe wisdom in how we build matters as much as what we build — stewardship over speed alone.'),
    jsonb_build_object('key', 'intelligent_support', 'number', 7, 'title', 'People Deserve Intelligent Support', 'description', 'We believe people deserve intelligent support without surrendering judgment — Aipify prepares; humans decide.')
  );
$$;

create or replace function public._amfhcbp100_our_purpose()
returns text language sql immutable as $$
  select 'To build trusted intelligent systems as a Business Operating System that simplify complexity, empower people, strengthen relationships, and create space for meaningful work.';
$$;

create or replace function public._amfhcbp100_our_vision()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trusted Business Companion — companionship before replacement within ABOS.',
    'bullets', jsonb_build_array(
      'Every organization has access to a trusted Aipify Companion',
      'People spend less time on unnecessary tasks and more on creativity and relationships',
      'Knowledge becomes accessible without surveillance',
      'Technology adapts to people — not the reverse',
      'Success is measured by human flourishing, not output alone'
    )
  );
$$;

create or replace function public._amfhcbp100_what_aipify_is()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'A trusted Business Companion within the Aipify Business Operating System (ABOS)',
    'An intelligent operations partner that augments human capability',
    'A system that prepares, explains, and recommends — humans decide',
    'Transparent, calm, and respectful in every interaction',
    'Designed for companionship before replacement'
  );
$$;

create or replace function public._amfhcbp100_what_aipify_is_not()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Merely a chatbot or automation tool',
    'A replacement for employees or human judgment',
    'A surveillance system disguised as assistance',
    'An uncontrolled agent executing sensitive actions alone',
    'A platform that hides uncertainty or pressures users'
  );
$$;

create or replace function public._amfhcbp100_our_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'people_first', 'label', 'People First', 'description', 'Dignity and agency preserved in every design choice — humans remain in control.'),
    jsonb_build_object('key', 'companionship_before_replacement', 'label', 'Companionship Before Replacement', 'description', 'Augment people; never imply Aipify runs the company alone or replaces employees.'),
    jsonb_build_object('key', 'transparency', 'label', 'Transparency', 'description', 'Explainability, honest limits, visible governance, and audit trails for material decisions.'),
    jsonb_build_object('key', 'wisdom', 'label', 'Wisdom', 'description', 'Thoughtful stewardship over speed alone — build what serves genuine human need.'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love', 'description', 'Sustainable pace, humility, and compassion — not perfection pressure or burnout culture.'),
    jsonb_build_object('key', 'growth', 'label', 'Growth', 'description', 'Organizations and Aipify learn together — assisted default, metadata only, human approval for adaptive learning.'),
    jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Wonder and discovery without judgment — cross-link Curiosity & Discovery engines.'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship', 'description', 'Long-term responsibility for impact on people, organizations, and society.')
  );
$$;

create or replace function public._amfhcbp100_self_love_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love — sustainable pace, humility, and compassion; not perfection pressure.',
    'quotes', jsonb_build_array(
      'You do not need to earn worth through burnout.',
      'Steady progress at a human pace deserves celebration.',
      'Companionship includes permission to rest and reflect.'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle cross-link only; manifesto stores philosophical framing, not personal wellbeing content.'
  );
$$;

create or replace function public._amfhcbp100_companion_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion — warm, wise, honest companionship; never manufactured intimacy or pressure.',
    'qualities', jsonb_build_array('Helpful', 'Professional', 'Calm', 'Trustworthy', 'Respectful', 'Transparent about limits'),
    'route', '/app/companion-identity-engine',
    'phase', 'A.84',
    'partnership_blueprint', 'Blueprint Phase 99 Human-AI Partnership on A.84 — cross-link only',
    'boundary_note', 'Companion scaffolds support — humans decide; never auto-execute sensitive actions or impersonate users.'
  );
$$;

create or replace function public._amfhcbp100_humanity_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Humanity — dignity preserved in every interaction; cross-link Human Values Charter.',
    'commitments', jsonb_build_array(
      'Respectful assistance for all people',
      'Inclusion and belonging without surveillance framing',
      'Never trade dignity for efficiency',
      'Calm, non-alarmist communication'
    ),
    'charter_doc', 'HUMAN_VALUES_CHARTER.md',
    'inclusion_route', '/app/inclusion-humanity-engine',
    'boundary_note', 'Humanity principle governs tone and design — operationalized by Inclusion & Humanity A.83; manifesto provides philosophical anchor.'
  );
$$;

create or replace function public._amfhcbp100_learning_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning — learn with customers; metadata only; assisted default; human approval for adaptive learning.',
    'commitments', jsonb_build_array(
      'Never store raw customer content in learning memory',
      'Default mode is assisted — human approval before learning',
      'Adaptive learning requires explicit consent and plan eligibility',
      'Explanations required whenever behaviour changes'
    ),
    'learning_route', '/app/learning',
    'blueprint_route', '/app/learning',
    'boundary_note', 'Learning Engine Phase 29 — cross-link only; manifesto states philosophical commitment.'
  );
$$;

create or replace function public._amfhcbp100_trust_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust — earned through explainability, audit, human oversight, and transparent governance.',
    'commitments', jsonb_build_array(
      'Every material action explainable and audited',
      'Critical actions prohibited for AI — humans decide',
      'License and data ownership transparent via Trust Center',
      'Ethics governance scales with capability — Blueprint Phase 98 on A.46'
    ),
    'license_route', '/app/license',
    'ethics_route', '/app/ai-ethics-responsible-use-engine',
    'constitution_route', '/app/constitution',
    'boundary_note', 'Trust grows when people understand how Aipify works and who governs it.'
  );
$$;

create or replace function public._amfhcbp100_legacy_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy — build for long-term positive impact; organizational memory with governed retention.',
    'commitments', jsonb_build_array(
      'Preserve institutional knowledge with permission and retention policies',
      'Contribute positively to the future of work',
      'Steward organizational memory — not surveillance archives',
      'Cross-link Purpose & Values for cultural continuity'
    ),
    'memory_route', '/app/organizational-memory-engine',
    'purpose_route', '/app/purpose-values-engine',
    'boundary_note', 'Legacy A.86 and Blueprint Phase 94 — cross-link only; manifesto provides aspirational framing.'
  );
$$;

create or replace function public._amfhcbp100_our_hope()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'confidence_calm', 'number', 1, 'title', 'Confidence and Calm', 'description', 'Organizations navigate complexity with confidence and calm — not alarm or pressure.'),
    jsonb_build_object('key', 'supported_not_replaced', 'number', 2, 'title', 'Supported, Not Replaced', 'description', 'People feel supported rather than replaced by technology.'),
    jsonb_build_object('key', 'honest_companionship', 'number', 3, 'title', 'Honest Companionship', 'description', 'Companionship becomes normal in business operations — honest, optional, and transparent.'),
    jsonb_build_object('key', 'wisdom_over_speed', 'number', 4, 'title', 'Wisdom Over Speed', 'description', 'Future builders choose wisdom over speed alone when capability grows.'),
    jsonb_build_object('key', 'better_version', 'number', 5, 'title', 'A Better Version of Ourselves', 'description', 'Aipify helps people and organizations become a better version of themselves.')
  );
$$;

create or replace function public._amfhcbp100_our_responsibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Building intelligent systems carries responsibility — consider people before features.',
    'questions', jsonb_build_array(
      jsonb_build_object('key', 'should_we_build', 'question', 'Should we build this?', 'answer', 'Only when it serves genuine human need — pause when principles are unclear.'),
      jsonb_build_object('key', 'affect_people', 'question', 'How will it affect people?', 'answer', 'Consider dignity, agency, wellbeing, and unintended consequences before shipping.'),
      jsonb_build_object('key', 'align_principles', 'question', 'Does it align with our principles?', 'answer', 'Constitution, Manifesto, Human Values Charter, and ABOS Foundation must align.'),
      jsonb_build_object('key', 'preserve_dignity', 'question', 'Does it preserve dignity?', 'answer', 'Never trade dignity for efficiency — humans remain accountable for outcomes.')
    )
  );
$$;

create or replace function public._amfhcbp100_the_future()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'title', 'The Future of Human-Centered Companionship',
    'aspiration', 'A future where intelligent companionship is trustworthy, transparent, and universally accessible — where businesses and their people grow together with Aipify as a steady partner.',
    'themes', jsonb_build_array(
      'Trusted companionship in everyday operations',
      'Human agency preserved as capability grows',
      'Global reach with local understanding and respect',
      'Positive contribution to the future of work'
    )
  );
$$;

create or replace function public._amfhcbp100_message_to_future_builders()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'title', 'A Message to Future Builders',
    'message', 'Build with humility. Choose companionship over replacement. Preserve human agency. Be transparent about limits. Never hide uncertainty. Measure success by whether people can honestly say Aipify helped them become a better version of themselves.',
    'guidance', jsonb_build_array(
      'Read Core Foundation and ABOS Foundation before every capability',
      'Register skills and assign risk classes — critical actions require human approval',
      'Protect privacy — metadata first; customer owns operational data',
      'Cross-link Constitution, Manifesto, and Human Values Charter in product decisions',
      'Dogfood internally before external pilots — Unonight first, then broader release'
    )
  );
$$;

create or replace function public._amfhcbp100_abos_principle()
returns text language sql immutable as $$
  select 'The Aipify Business Operating System (ABOS) earns trust through human-centered companionship — Aipify informs and prepares; humans decide. Companionship before replacement; wisdom alongside innovation.';
$$;

create or replace function public._amfhcbp100_vision()
returns text language sql immutable as $$
  select 'Its success will be determined by whether people can honestly say: ''Aipify helped us become a better version of ourselves.''';
$$;

create or replace function public._amfhcbp100_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'abos_foundation', 'label', 'ABOS Foundation', 'doc', 'ABOS_FOUNDATION.md'),
    jsonb_build_object('key', 'core_foundation', 'label', 'Core Foundation', 'doc', 'CORE_FOUNDATION.md'),
    jsonb_build_object('key', 'human_values_charter', 'label', 'Human Values Charter', 'doc', 'HUMAN_VALUES_CHARTER.md'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity A.84', 'route', '/app/companion-identity-engine'),
    jsonb_build_object('key', 'partnership_blueprint_99', 'label', 'Blueprint Phase 99 Human-AI Partnership', 'route', '/app/companion-identity-engine'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values A.82 / Blueprint 95', 'route', '/app/purpose-values-engine'),
    jsonb_build_object('key', 'legacy', 'label', 'Legacy A.86 / Blueprint 94', 'route', '/app/organizational-memory-engine'),
    jsonb_build_object('key', 'trust_ethics', 'label', 'Trust Blueprint 98 on A.46', 'route', '/app/ai-ethics-responsible-use-engine'),
    jsonb_build_object('key', 'constitution', 'label', 'Constitution repo Phase 98', 'route', '/app/constitution'),
    jsonb_build_object('key', 'license', 'label', 'License & Trust Center', 'route', '/app/license'),
    jsonb_build_object('key', 'positioning', 'label', 'Positioning Foundation', 'doc', 'POSITIONING_FOUNDATION.md'),
    jsonb_build_object('key', 'manifesto_repo_99', 'label', 'Manifesto repo Phase 99 (baseline)', 'route', '/app/manifesto'),
    jsonb_build_object('key', 'platform_install_collision', 'label', 'Platform Install repo Phase 100 (collision note)', 'route', '/app/platform-install')
  );
$$;

create or replace function public._amfhcbp100_success_criteria(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
declare
  v_themes int := 0;
  v_acknowledged int := 0;
  v_publications int := 0;
  v_alignment numeric := 0;
begin
  select count(*) into v_themes from public.strategic_themes where tenant_id = p_tenant_id;
  select count(distinct theme_id) into v_acknowledged from public.manifesto_acknowledgements where tenant_id = p_tenant_id;
  select count(*) into v_publications from public.vision_publications where tenant_id = p_tenant_id and status = 'published';
  select coalesce(avg(alignment_score), 91.0) into v_alignment
  from public.vision_updates where tenant_id = p_tenant_id and status = 'completed';

  return jsonb_build_array(
    jsonb_build_object('key', 'founding_statements_seeded', 'label', 'Founding statements available', 'met', exists(select 1 from public.founding_statements where tenant_id = p_tenant_id), 'note', 'Repo Phase 99 baseline preserved'),
    jsonb_build_object('key', 'themes_acknowledged', 'label', 'Strategic themes acknowledged', 'met', v_acknowledged >= least(v_themes, 4), 'note', v_acknowledged::text || ' of ' || v_themes::text || ' themes'),
    jsonb_build_object('key', 'vision_alignment', 'label', 'Vision alignment maintained', 'met', v_alignment >= 85, 'note', round(v_alignment, 1)::text || '% alignment'),
    jsonb_build_object('key', 'publications_active', 'label', 'Vision publications published', 'met', v_publications >= 1, 'note', v_publications::text || ' publications'),
    jsonb_build_object('key', 'human_centered_principles', 'label', 'Human-centered principles documented', 'met', true, 'note', 'Phase 100 blueprint helpers active'),
    jsonb_build_object('key', 'integration_links', 'label', 'Cross-module integration links defined', 'met', true, 'note', 'Constitution, Companion Identity, Trust, Self Love, Legacy'),
    jsonb_build_object('key', 'closing_vision', 'label', 'Closing vision phrase honored', 'met', true, 'note', public._amfhcbp100_vision())
  );
end; $$;

create or replace function public._amfhcbp100_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 100 — Aipify Manifesto & The Future of Human-Centered Companionship',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE100_AIPIFY_MANIFESTO_HUMAN_CENTERED_COMPANIONSHIP.md',
    'engine_phase', 'Repo Phase 99 Aipify Manifesto & Founding Vision',
    'route', '/app/manifesto',
    'mapping_note', 'ABOS Blueprint Phase 100 extends repo Phase 99 manifesto with human-centered companionship framing. Distinct from Platform Install repo Phase 100 and Blueprint Phase 99 partnership on A.84.',
    'distinction_note', public._amfhcbp100_distinction_note(),
    'purpose_why_aipify_exists', public._amfhcbp100_purpose_why_aipify_exists(),
    'our_belief', public._amfhcbp100_our_belief(),
    'our_purpose', public._amfhcbp100_our_purpose(),
    'our_vision', public._amfhcbp100_our_vision(),
    'what_aipify_is', public._amfhcbp100_what_aipify_is(),
    'what_aipify_is_not', public._amfhcbp100_what_aipify_is_not(),
    'our_principles', public._amfhcbp100_our_principles(),
    'self_love_principle', public._amfhcbp100_self_love_principle(),
    'companion_principle', public._amfhcbp100_companion_principle(),
    'humanity_principle', public._amfhcbp100_humanity_principle(),
    'learning_principle', public._amfhcbp100_learning_principle(),
    'trust_principle', public._amfhcbp100_trust_principle(),
    'legacy_principle', public._amfhcbp100_legacy_principle(),
    'our_hope', public._amfhcbp100_our_hope(),
    'our_responsibility', public._amfhcbp100_our_responsibility(),
    'the_future', public._amfhcbp100_the_future(),
    'message_to_future_builders', public._amfhcbp100_message_to_future_builders(),
    'success_criteria', public._amfhcbp100_success_criteria(p_tenant_id),
    'abos_principle', public._amfhcbp100_abos_principle(),
    'vision', public._amfhcbp100_vision(),
    'integration_links', public._amfhcbp100_integration_links(),
    'privacy_note', 'Manifesto blueprint data is philosophical framing and metadata only — theme counts, alignment scores, publication status. No PII, no surveillance metrics. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL repo Phase 99 fields; append Phase 100
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_manifesto_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.manifesto_settings;
  v_version public.manifesto_versions;
  v_metrics jsonb;
  v_user_id uuid;
begin
  v_tenant_id := public._amf_require_tenant();
  v_user_id := public._amf_auth_user_id();
  v_settings := public._amf_ensure_settings(v_tenant_id);
  perform public._amf_seed_founding_statements(v_tenant_id);
  perform public._amf_seed_themes(v_tenant_id);
  perform public._amf_seed_commitments(v_tenant_id);
  perform public._amf_seed_vision_updates(v_tenant_id);
  perform public._amf_seed_publications(v_tenant_id);
  v_metrics := public._amf_refresh_metrics(v_tenant_id);
  perform public._amf_trust_explanation(v_tenant_id, (v_metrics->>'manifesto_score')::numeric);

  select * into v_version from public.manifesto_versions
  where tenant_id = v_tenant_id and version_label = v_settings.current_version limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Purpose beyond functionality.',
    'safety_note', 'The Manifesto provides strategic direction — it complements the Constitution and applicable legal requirements.',
    'manifesto_enabled', v_settings.manifesto_enabled,
    'acknowledgement_required', v_settings.acknowledgement_required,
    'vision_publication_enabled', v_settings.vision_publication_enabled,
    'current_version', v_settings.current_version,
    'review_cycle_months', v_settings.review_cycle_months,
    'manifesto_score', v_metrics->'manifesto_score',
    'themes_count', v_metrics->'themes_count',
    'themes_acknowledged', v_metrics->'themes_acknowledged',
    'vision_alignment_score', v_metrics->'vision_alignment_score',
    'publications_count', v_metrics->'publications_count',
    'founding_belief', coalesce(v_version.founding_belief, 'Businesses should not have to navigate complexity alone.'),
    'aipify_promise', coalesce(v_version.aipify_promise, 'To pursue progress without losing perspective.'),
    'founding_statements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'statement_key', f.statement_key, 'title', f.title, 'content', f.content
      ) order by f.sort_order)
      from public.founding_statements f where f.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'strategic_themes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'theme_key', t.theme_key, 'theme_number', t.theme_number,
        'title', t.title, 'description', t.description, 'category', t.category,
        'acknowledged', exists(
          select 1 from public.manifesto_acknowledgements a
          where a.theme_id = t.id and a.tenant_id = v_tenant_id
            and (a.user_id = v_user_id or a.user_id is null)
        )
      ) order by t.sort_order)
      from public.strategic_themes t where t.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'organizational_commitments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'description', c.description,
        'commitment_type', c.commitment_type, 'status', c.status
      ))
      from public.organizational_commitments c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'vision_updates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', u.id, 'update_type', u.update_type, 'title', u.title,
        'summary', u.summary, 'status', u.status,
        'alignment_score', u.alignment_score, 'scheduled_at', u.scheduled_at
      ) order by u.scheduled_at asc nulls last)
      from public.vision_updates u where u.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'vision_publications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'title', p.title, 'summary', p.summary,
        'audience', p.audience, 'status', p.status, 'published_at', p.published_at
      ) order by p.published_at desc)
      from public.vision_publications p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'target_audiences', jsonb_build_array(
      'Customers', 'Employees', 'Partners', 'Executives',
      'Prospective Employees', 'Advisory Boards', 'Community Members'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.manifesto_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'constitution', 'Principles that guide behavior alongside vision',
      'knowledge_center', 'Vision documentation and FAQ',
      'academy', 'Founding vision learning programs',
      'partners', 'Partner portal vision alignment',
      'global_expansion', 'Local understanding within global vision'
    ),
    'implementation_blueprint_phase100', jsonb_build_object(
      'phase', 'Phase 100 — Aipify Manifesto & The Future of Human-Centered Companionship',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE100_AIPIFY_MANIFESTO_HUMAN_CENTERED_COMPANIONSHIP.md',
      'engine_phase', 'Repo Phase 99 Aipify Manifesto & Founding Vision',
      'route', '/app/manifesto'
    ),
    'human_centered_companionship_note', 'Human-Centered Companionship (ABOS Phase 100) — trusted Business Companion within ABOS; companionship before replacement — all repo Phase 99 fields preserved.',
    'aipify_manifesto_human_centered_companionship_blueprint', public._amfhcbp100_blueprint_block(v_tenant_id),
    'human_centered_companionship_distinction_note', public._amfhcbp100_distinction_note(),
    'human_centered_companionship_purpose', public._amfhcbp100_purpose_why_aipify_exists(),
    'human_centered_companionship_our_belief', public._amfhcbp100_our_belief(),
    'human_centered_companionship_our_purpose', public._amfhcbp100_our_purpose(),
    'human_centered_companionship_our_vision', public._amfhcbp100_our_vision(),
    'human_centered_companionship_what_aipify_is', public._amfhcbp100_what_aipify_is(),
    'human_centered_companionship_what_aipify_is_not', public._amfhcbp100_what_aipify_is_not(),
    'human_centered_companionship_our_principles', public._amfhcbp100_our_principles(),
    'human_centered_companionship_self_love_principle', public._amfhcbp100_self_love_principle(),
    'human_centered_companionship_companion_principle', public._amfhcbp100_companion_principle(),
    'human_centered_companionship_humanity_principle', public._amfhcbp100_humanity_principle(),
    'human_centered_companionship_learning_principle', public._amfhcbp100_learning_principle(),
    'human_centered_companionship_trust_principle', public._amfhcbp100_trust_principle(),
    'human_centered_companionship_legacy_principle', public._amfhcbp100_legacy_principle(),
    'human_centered_companionship_our_hope', public._amfhcbp100_our_hope(),
    'human_centered_companionship_our_responsibility', public._amfhcbp100_our_responsibility(),
    'human_centered_companionship_the_future', public._amfhcbp100_the_future(),
    'human_centered_companionship_message_to_future_builders', public._amfhcbp100_message_to_future_builders(),
    'human_centered_companionship_success_criteria', public._amfhcbp100_success_criteria(v_tenant_id),
    'human_centered_companionship_abos_principle', public._amfhcbp100_abos_principle(),
    'human_centered_companionship_vision', public._amfhcbp100_vision(),
    'human_centered_companionship_integration_links', public._amfhcbp100_integration_links(),
    'human_centered_companionship_privacy_note', 'Manifesto blueprint data is philosophical framing and metadata only. Humans decide; Aipify informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve repo Phase 99 fields; append Phase 100 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_manifesto_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_settings public.manifesto_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._amf_ensure_settings(v_tenant_id);
  perform public._amf_seed_themes(v_tenant_id);
  v_metrics := public._amf_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'manifesto_score', v_metrics->'manifesto_score',
    'themes_count', v_metrics->'themes_count',
    'current_version', v_settings.current_version,
    'philosophy', 'Purpose beyond functionality.',
    'human_oversight_required', true,
    'implementation_blueprint_phase100', jsonb_build_object(
      'phase', 'Phase 100 — Aipify Manifesto & The Future of Human-Centered Companionship',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE100_AIPIFY_MANIFESTO_HUMAN_CENTERED_COMPANIONSHIP.md',
      'route', '/app/manifesto'
    ),
    'human_centered_companionship_abos_principle', public._amfhcbp100_abos_principle(),
    'human_centered_companionship_vision', public._amfhcbp100_vision(),
    'human_centered_companionship_note', 'Human-Centered Companionship (ABOS Phase 100) — trusted Business Companion; companionship before replacement.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._amfhcbp100_distinction_note() to authenticated;
grant execute on function public._amfhcbp100_purpose_why_aipify_exists() to authenticated;
grant execute on function public._amfhcbp100_our_belief() to authenticated;
grant execute on function public._amfhcbp100_our_purpose() to authenticated;
grant execute on function public._amfhcbp100_our_vision() to authenticated;
grant execute on function public._amfhcbp100_what_aipify_is() to authenticated;
grant execute on function public._amfhcbp100_what_aipify_is_not() to authenticated;
grant execute on function public._amfhcbp100_our_principles() to authenticated;
grant execute on function public._amfhcbp100_self_love_principle() to authenticated;
grant execute on function public._amfhcbp100_companion_principle() to authenticated;
grant execute on function public._amfhcbp100_humanity_principle() to authenticated;
grant execute on function public._amfhcbp100_learning_principle() to authenticated;
grant execute on function public._amfhcbp100_trust_principle() to authenticated;
grant execute on function public._amfhcbp100_legacy_principle() to authenticated;
grant execute on function public._amfhcbp100_our_hope() to authenticated;
grant execute on function public._amfhcbp100_our_responsibility() to authenticated;
grant execute on function public._amfhcbp100_the_future() to authenticated;
grant execute on function public._amfhcbp100_message_to_future_builders() to authenticated;
grant execute on function public._amfhcbp100_abos_principle() to authenticated;
grant execute on function public._amfhcbp100_vision() to authenticated;
grant execute on function public._amfhcbp100_integration_links() to authenticated;
grant execute on function public._amfhcbp100_success_criteria(uuid) to authenticated;
grant execute on function public._amfhcbp100_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-manifesto-human-centered-companionship-blueprint-phase100',
  'Aipify Manifesto — Human-Centered Companionship (ABOS Phase 100)',
  'Human-centered companionship framing for the Aipify Manifesto — trusted Business Companion within ABOS, beliefs, principles, hopes, and message to future builders. Extends repo Phase 99.',
  'authenticated', 127
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-manifesto-human-centered-companionship-blueprint-phase100' and tenant_id is null
);
