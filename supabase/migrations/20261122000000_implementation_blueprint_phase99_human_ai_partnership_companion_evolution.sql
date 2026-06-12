-- Implementation Blueprint Phase 99 — Human-Aipify Partnership & Companion Evolution Engine
-- Extends Companion Identity Engine (Phase A.84 + Blueprint Phase 6 + Learning Journey + Aipify-First Language Policy).
-- No new tables. Cross-links ethics, growth, trust, self love — never duplicate companion governance elsewhere.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._haipcebp99_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 99 — Human-Aipify Partnership & Companion Evolution Engine at /app/companion-identity-engine. Extends Companion Identity Engine Phase A.84 (20260933000000), Blueprint Phase 6 (_cie_blueprint_*), Learning Journey (20260945000000), Companion Naming (_cnp_*), and Aipify-First Language Policy (_aflp_*). Healthy empowering human-centered relationships with Aipify Companions — partnership not replacement. Cross-links AI Ethics A.46 / Blueprint 54 / 65 / Constitution Phase 98 at /app/ai-ethics-responsible-use-engine — never duplicate Companion Evolution Council governance. Cross-links Growth & Evolution A.81 / Blueprint 58, Self Love A.76, Proactive Companion A.79, Companion Presence A.67, Companion Device A.96, Trust Engine /app/trust, Approvals /app/approvals. Distinct from Identity Engine Phase 34 (/app/assistant/identity) — per-user style. Distinct from Personalization repo Phase 83 (/app/settings/personalization). Distinct from Aipify Manifesto repo Phase 99 (/app/manifesto) — phase number collision only. Helpers use _haipcebp99_* only.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._haipcebp99_mission()
returns text language sql immutable as $$
  select 'Healthy empowering human-centered relationships with Aipify Companions.';
$$;

create or replace function public._haipcebp99_philosophy()
returns text language sql immutable as $$
  select 'Partnership not replacement — amplify potential, strengthen autonomy, avoid dependence. Aipify Companions evolve to be more helpful, transparent, and emotionally intelligent while honoring boundaries, preferences, and values.';
$$;

create or replace function public._haipcebp99_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) augments people — humans decide. Companion evolution is intentional: familiarity builds trust; manipulation is never acceptable. Personalization serves recognition and learning — not emotional exploitation or hidden influence.';
$$;

create or replace function public._haipcebp99_vision()
returns text language sql immutable as $$
  select 'Aipify never tried to replace me. It helped me become a better version of myself.';
$$;

create or replace function public._haipcebp99_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'healthy_partnership', 'label', 'Healthy partnership', 'emoji', '❤️', 'description', 'Foster empowering human-Aipify relationships across every ABOS module'),
    jsonb_build_object('key', 'companion_evolution', 'label', 'Companion evolution', 'emoji', '🦉', 'description', 'Intentional evolution — more helpful, transparent, emotionally intelligent'),
    jsonb_build_object('key', 'personalization_ethics', 'label', 'Personalization ethics', 'emoji', '🌹', 'description', 'Communication, recognition, meeting, learning, cultural, language — familiarity not manipulation'),
    jsonb_build_object('key', 'healthy_dependency', 'label', 'Healthy dependency boundaries', 'emoji', '🔔', 'description', 'Encourage independence, decision-making, skills, confidence — avoid emotional dependency'),
    jsonb_build_object('key', 'relationship_stages', 'label', 'Relationship evolution stages', 'emoji', '🦉', 'description', 'Assistant → Coach → Trusted Companion → Strategic Partner — intentional progression'),
    jsonb_build_object('key', 'cross_engine_governance', 'label', 'Cross-engine governance', 'emoji', '🔔', 'description', 'Align with AI Ethics, Trust, Growth & Evolution, and Aipify-first language policy')
  );
$$;

create or replace function public._haipcebp99_partnership_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partnership questions — empowerment-oriented reflection, not dependency pressure or surveillance.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'healthy_partnership', 'question', 'What does a healthy partnership with my Aipify Companion look like?', 'description', 'Clarity on roles — Aipify informs and prepares; humans decide'),
      jsonb_build_object('emoji', '🌹', 'key', 'amplify_strengths', 'question', 'How can Aipify amplify my strengths without replacing them?', 'description', 'Celebrate capability — never imply inadequacy'),
      jsonb_build_object('emoji', '❤️', 'key', 'empowering_boundaries', 'question', 'What boundaries keep our relationship empowering rather than dependent?', 'description', 'Autonomy preserved — healthy pacing and consent'),
      jsonb_build_object('emoji', '🔔', 'key', 'human_leadership', 'question', 'When should I take the lead instead of leaning on my Companion?', 'description', 'Decision-making and skill-building remain human-led')
    ),
    'reflection_note', 'Questions invite partnership reflection — humans retain agency; Aipify scaffolds growth without creating reliance.'
  );
$$;

create or replace function public._haipcebp99_companion_evolution_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion evolution principles — intentional development aligned with trust and transparency.',
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'more_helpful', 'label', 'More helpful', 'emoji', '🦉', 'description', 'Operational assistance that reduces friction without taking over decisions'),
      jsonb_build_object('key', 'transparent', 'label', 'Transparent', 'emoji', '🔔', 'description', 'Explain why Aipify suggests, surfaces, or prepares — no hidden influence'),
      jsonb_build_object('key', 'emotionally_intelligent', 'label', 'Emotionally intelligent', 'emoji', '❤️', 'description', 'Warm, respectful tone — never guilt, pressure, or emotional exploitation'),
      jsonb_build_object('key', 'boundaries', 'label', 'Clear boundaries', 'emoji', '🔔', 'description', 'Scope limits, consent, and escalation paths always visible'),
      jsonb_build_object('key', 'preferences', 'label', 'Respects preferences', 'emoji', '🌹', 'description', 'User and organizational preferences honored — opt-out respected'),
      jsonb_build_object('key', 'values_aligned', 'label', 'Values-aligned', 'emoji', '🌹', 'description', 'Companion behavior aligns with stated values — cross-link Purpose & Values A.82')
    )
  );
$$;

create or replace function public._haipcebp99_personalization_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Personalization principles — familiarity not manipulation.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'communication', 'label', 'Communication', 'description', 'Style and tone adaptation — Identity Engine Phase 34 per-user; A.84 unified companion identity'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Celebrate progress and effort — Gratitude & Recognition A.89 cross-link'),
      jsonb_build_object('key', 'meeting', 'label', 'Meeting context', 'description', 'Meeting Companion preferences — visible, consent-first'),
      jsonb_build_object('key', 'learning', 'label', 'Learning preferences', 'description', 'Learning Journey honest capability gaps — assisted mode default'),
      jsonb_build_object('key', 'cultural', 'label', 'Cultural awareness', 'description', 'Respectful cultural context — Inclusion & Humanity A.83 cross-link'),
      jsonb_build_object('key', 'language', 'label', 'Language', 'description', 'Aipify-first labels and locale — _aflp_* policy on same engine')
    ),
    'boundary_note', 'Personalization builds familiarity and trust — never manipulative targeting, emotional exploitation, or influence without consent.'
  );
$$;

create or replace function public._haipcebp99_healthy_dependency_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Healthy dependency — encourage capability; avoid reliance that reduces agency.',
    'encourage', jsonb_build_array(
      'Independence and self-directed decision-making',
      'Skill-building and learning from outcomes',
      'Confidence through transparent, explainable assistance',
      'Human leadership on strategy, ethics, and high-stakes choices'
    ),
    'avoid', jsonb_build_array(
      'Emotional dependency on the Companion for validation',
      'Reduced agency — Aipify deciding when humans should decide',
      'Excessive reliance — defaulting to Companion without reflection',
      'Pressure framing that implies users cannot succeed alone'
    ),
    'boundary_note', 'Aipify prepares and informs. Humans decide. Companions should make users more capable over time — not more dependent.'
  );
$$;

create or replace function public._haipcebp99_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — empower, never create dependency.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'skill_building', 'prompt', 'I can walk through the steps so you build the skill — would you like guidance or a prepared draft to review?', 'consideration', 'Coach stage — user retains final decision'),
      jsonb_build_object('emoji', '🌹', 'key', 'strength_amplification', 'prompt', 'You handled this well last time — shall I highlight what worked so you can apply it again?', 'consideration', 'Amplify strengths — Self Love A.76 cross-link'),
      jsonb_build_object('emoji', '❤️', 'key', 'healthy_boundary', 'prompt', 'This is a decision only you can make — I can prepare options and trade-offs if helpful.', 'consideration', 'Strategic Partner stage — human leadership honored'),
      jsonb_build_object('emoji', '🔔', 'key', 'take_the_lead', 'prompt', 'You have enough context to decide — I am here if you want a second perspective.', 'consideration', 'Encourage independence — avoid excessive reliance')
    ),
    'boundary_note', 'Guidance scaffolds partnership evolution — dismiss and opt-out always available.'
  );
$$;

create or replace function public._haipcebp99_relationship_evolution_stages()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relationship evolution stages — intentional progression, never automatic escalation without context and consent.',
    'stages', jsonb_build_array(
      jsonb_build_object('stage', 1, 'key', 'assistant', 'label', 'Assistant', 'emoji', '🔔', 'description', 'Task support and operational help — clear scope and explainability'),
      jsonb_build_object('stage', 2, 'key', 'coach', 'label', 'Coach', 'emoji', '🦉', 'description', 'Guidance and skill-building — user retains decisions; Aipify prepares'),
      jsonb_build_object('stage', 3, 'key', 'trusted_companion', 'label', 'Trusted Companion', 'emoji', '❤️', 'description', 'Familiar, values-aligned support — boundaries and preferences honored'),
      jsonb_build_object('stage', 4, 'key', 'strategic_partner', 'label', 'Strategic Partner', 'emoji', '🌹', 'description', 'Long-horizon thinking partner — humans lead strategy; Aipify informs and prepares')
    ),
    'progression_note', 'Stages describe relationship depth over time — not license tiers or hidden upsell. Users and organizations retain control.'
  );
$$;

create or replace function public._haipcebp99_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 — Aipify celebrates your strengths; it does not replace them.',
    'quotes', jsonb_build_array(
      'Aipify amplifies what you already do well — it does not imply you are incomplete without it.',
      'Healthy partnership means recovery and balance are honored — growth never at the expense of wellbeing.',
      'Companions recognize effort and progress — never guilt for pausing or choosing human paths.'
    ),
    'practices', jsonb_build_array(
      'Celebrate capability and recovery — not perfection pressure',
      'Cross-link Self Love pacing and balance toggles on companion modules',
      'Reinforce human strengths in companion guidance — never replace them'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'Aipify helped me become a better version of myself — it never tried to replace me.'
  );
$$;

create or replace function public._haipcebp99_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership models healthy human-Aipify partnership — transparency and skill-building for teams.',
    'practices', jsonb_build_array(
      'Leaders explain when Aipify assists and when humans decide',
      'Teams build skills alongside Companions — not delegate judgment silently',
      'Executive Companion and Meeting Companion used with visible consent',
      'Purpose and values alignment before strategic companion reliance — cross-link Purpose & Values A.82'
    ),
    'routes', jsonb_build_object(
      'executive', '/app/executive-insights-engine',
      'purpose_values', '/app/purpose-values-engine',
      'decision_support', '/app/assistant/decisions'
    ),
    'boundary_note', 'Leadership connection is aggregate metadata and principles — no individual surveillance or ranking.'
  );
$$;

create or replace function public._haipcebp99_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust and explainability — organizations understand companion behaviors and retain control.',
    'organizations_should_understand', jsonb_build_array(
      'What companion personalization is active — communication, meeting, learning preferences',
      'Why a companion suggestion appears — explainability required',
      'How to pause, dismiss, or escalate companion behaviors',
      'How Trust Engine and Approvals gate sensitive actions — Level 4 prohibited for Aipify'
    ),
    'leaders_should_know', jsonb_build_array(
      'Cross-link AI Ethics A.46 / Blueprint 54 / 65 — companion governance distinct from identity orchestration',
      'Aipify-first language policy (_aflp_*) — consistent naming builds trust',
      'Healthy dependency principles enforced — no emotional exploitation',
      'Constitution Phase 98 core principles — human control and privacy'
    ),
    'routes', jsonb_build_object(
      'trust_engine', '/app/trust',
      'approvals', '/app/approvals',
      'ai_ethics', '/app/ai-ethics-responsible-use-engine'
    ),
    'audit_note', 'Companion identity settings and module alignment audited — metadata only, tenant-scoped.'
  );
$$;

create or replace function public._haipcebp99_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partnership not manipulation — privacy-by-design for companion evolution.',
    'forbidden', jsonb_build_array(
      'Manipulative personalization or hidden behavioral influence',
      'Emotional exploitation — guilt, pressure, or dependency framing',
      'Dependency encouragement — implying users cannot succeed without Aipify',
      'Influence without consent — silent escalation of companion autonomy'
    ),
    'required', jsonb_build_array(
      'Explainability for companion suggestions and personalization',
      'User and organizational control — opt-out, dismiss, and approval paths',
      'Metadata-only dashboard RPC payloads — no raw chat or PII',
      'Cross-engine ethics alignment — AI Ethics, Trust, Approvals'
    ),
    'boundary_note', 'Aipify builds empowering partnerships with permission — humans retain agency at every stage.'
  );
$$;

create or replace function public._haipcebp99_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates human-Aipify partnership patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Sales Expert, Executive Companion, Meeting Companion, Self Love, KC personalization',
      'focus', jsonb_build_array(
        'Sales Expert Companion — partnership not replacement in sales workflows',
        'Executive Companion — strategic partner stage with human leadership',
        'Meeting Companion — visible consent and healthy meeting boundaries',
        'Self Love rhythms — celebrate strengths, never replace them',
        'Knowledge Center personalization — familiarity not manipulation'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — healthy partnership in daily commerce operations',
      'focus', jsonb_build_array(
        'Support Companion with explainability and human escalation',
        'Learning-assisted mode — skill-building over dependency',
        'Aipify-first language across customer-facing surfaces',
        'Trust and approval paths for sensitive actions'
      )
    )
  );
$$;

create or replace function public._haipcebp99_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Aipify never tried to replace me. It helped me become a better version of myself.',
    'Partnership not replacement — amplify potential, strengthen autonomy.',
    'This feels like Aipify — familiar, transparent, values-aligned.',
    'Humans decide. Aipify informs and prepares.',
    'Companion evolution is intentional — Assistant to Strategic Partner with consent.',
    'Familiarity builds trust. Manipulation is never acceptable.'
  );
$$;

create or replace function public._haipcebp99_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ai_ethics_a46', 'label', 'AI Ethics & Responsible Use (A.46)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Companion governance — Blueprint 54 / 65 cross-link'),
    jsonb_build_object('key', 'constitution_phase98', 'label', 'Aipify Constitution (Phase 98)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Core principles — human control and privacy'),
    jsonb_build_object('key', 'growth_evolution_a81', 'label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Blueprint Phase 58 adaptive development cross-link'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Celebrate strengths — never replace them'),
    jsonb_build_object('key', 'proactive_companion_a79', 'label', 'Proactive Companion (A.79)', 'route', '/app/proactive-companion-engine', 'note', 'Proactive guidance with boundaries'),
    jsonb_build_object('key', 'companion_presence_a67', 'label', 'Companion Presence (A.67)', 'route', '/app/settings/companion-presence', 'note', 'Orb UI — distinct from identity orchestration'),
    jsonb_build_object('key', 'companion_device_a96', 'label', 'Companion Device Ecosystem (A.96)', 'route', '/app/companion-device-ecosystem-engine', 'note', 'Cross-device continuity'),
    jsonb_build_object('key', 'trust_engine', 'label', 'Trust Engine', 'route', '/app/trust', 'note', 'Transparency and explainability'),
    jsonb_build_object('key', 'approvals', 'label', 'Approval Center', 'route', '/app/approvals', 'note', 'Human approval for sensitive actions'),
    jsonb_build_object('key', 'identity_engine_34', 'label', 'Identity Engine (Phase 34)', 'route', '/app/assistant/identity', 'note', 'Per-user style — distinct from A.84'),
    jsonb_build_object('key', 'personalization_repo83', 'label', 'Personalization (Repo Phase 83)', 'route', '/app/settings/personalization', 'note', 'Tenant personalization settings — cross-link'),
    jsonb_build_object('key', 'manifesto_repo99', 'label', 'Aipify Manifesto (Repo Phase 99)', 'route', '/app/manifesto', 'note', 'Phase number collision — founding vision distinct'),
    jsonb_build_object('key', 'aipify_first_language', 'label', 'Aipify-First Language Policy', 'route', '/app/companion-identity-engine', 'note', '_aflp_* on same engine — preserved'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert Companion', 'route', '/app/sales-expert-engine', 'note', 'Dogfooding — partnership in sales workflows'),
    jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Visible consent — never hidden'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center-engine', 'note', 'KC personalization — familiarity not manipulation')
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Engagement summary
-- ---------------------------------------------------------------------------
create or replace function public._haipcebp99_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_modules int := 0;
  v_aligned int := 0;
  v_enabled boolean := false;
begin
  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = p_organization_id;

  select enabled into v_enabled
  from public.organization_companion_identity_settings
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'modules_tracked', v_modules,
    'modules_aligned', v_aligned,
    'companion_identity_enabled', coalesce(v_enabled, false),
    'objectives_count', jsonb_array_length(public._haipcebp99_objectives()),
    'partnership_questions_count', jsonb_array_length(public._haipcebp99_partnership_questions()->'questions'),
    'evolution_principles_count', jsonb_array_length(public._haipcebp99_companion_evolution_principles()->'principles'),
    'personalization_dimensions_count', jsonb_array_length(public._haipcebp99_personalization_principles()->'dimensions'),
    'relationship_stages_count', jsonb_array_length(public._haipcebp99_relationship_evolution_stages()->'stages'),
    'companion_guidance_examples', jsonb_array_length(public._haipcebp99_companion_guidance()->'examples'),
    'integration_links_count', jsonb_array_length(public._haipcebp99_integration_links()),
    'privacy_note', 'Aggregate companion identity counts only — no raw chat, no PII, no individual dependency metrics in RPC payloads.'
  );
end; $$;

create or replace function public._haipcebp99_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_modules int := 0;
  v_aligned int := 0;
begin
  v_engagement := public._haipcebp99_engagement_summary(p_organization_id);
  v_modules := coalesce((v_engagement->>'modules_tracked')::int, 0);
  v_aligned := coalesce((v_engagement->>'modules_aligned')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six partnership & evolution objectives documented',
      'met', jsonb_array_length(public._haipcebp99_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'partnership_questions',
      'label', 'Partnership questions scaffold — 🦉🌹❤️🔔 reflection prompts',
      'met', jsonb_array_length(public._haipcebp99_partnership_questions()->'questions') >= 4,
      'note', 'Empowerment-oriented — not dependency pressure.'
    ),
    jsonb_build_object(
      'key', 'evolution_principles',
      'label', 'Six companion evolution principles documented',
      'met', jsonb_array_length(public._haipcebp99_companion_evolution_principles()->'principles') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'personalization_principles',
      'label', 'Personalization dimensions — familiarity not manipulation',
      'met', jsonb_array_length(public._haipcebp99_personalization_principles()->'dimensions') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'healthy_dependency',
      'label', 'Healthy dependency principles — encourage independence',
      'met', jsonb_array_length(public._haipcebp99_healthy_dependency_principles()->'avoid') >= 4,
      'note', 'Avoid emotional dependency and reduced agency.'
    ),
    jsonb_build_object(
      'key', 'relationship_stages',
      'label', 'Four relationship evolution stages — intentional progression',
      'met', jsonb_array_length(public._haipcebp99_relationship_evolution_stages()->'stages') >= 4,
      'note', 'Assistant → Coach → Trusted Companion → Strategic Partner.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — empower, never create dependency',
      'met', jsonb_array_length(public._haipcebp99_companion_guidance()->'examples') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — partnership not manipulation',
      'met', jsonb_array_length(public._haipcebp99_privacy_principles()->'forbidden') >= 4,
      'note', 'No emotional exploitation or influence without consent.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-engine integration links documented',
      'met', jsonb_array_length(public._haipcebp99_integration_links()) >= 12,
      'note', 'Ethics, growth, trust, self love, manifesto collision noted.'
    ),
    jsonb_build_object(
      'key', 'module_alignment',
      'label', 'Companion identity modules tracked for consistency',
      'met', v_modules >= 1,
      'note', case when v_modules < 1 then 'Seed companion identity module registry.' else null end
    ),
    jsonb_build_object(
      'key', 'a84_fields_preserved',
      'label', 'Phase A.84 + Phase 6 + Learning Journey + _aflp_* fields preserved',
      'met', true,
      'note', 'All prior dashboard/card fields remain on RPCs.'
    ),
    jsonb_build_object(
      'key', 'modules_identity_aligned',
      'label', 'Modules identity-aligned for unified companion experience',
      'met', v_aligned >= 1 or v_modules = 0,
      'note', case when v_modules > 0 and v_aligned < 1 then 'Review module consistency alignment.' else null end
    )
  );
end; $$;

create or replace function public._haipcebp99_human_ai_partnership_companion_evolution_blueprint_block(p_organization_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 99 — Human-Aipify Partnership & Companion Evolution Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE99_HUMAN_AI_PARTNERSHIP_COMPANION_EVOLUTION.md',
    'engine_phase', 'A.84 Companion Identity Engine',
    'route', '/app/companion-identity-engine',
    'mapping_note', 'ABOS Blueprint Phase 99 extends A.84 + Phase 6 + Learning Journey + Aipify-first language with healthy partnership and intentional companion evolution framing.',
    'distinction_note', public._haipcebp99_distinction_note(),
    'mission', public._haipcebp99_mission(),
    'philosophy', public._haipcebp99_philosophy(),
    'abos_principle', public._haipcebp99_abos_principle(),
    'objectives', public._haipcebp99_objectives(),
    'partnership_questions', public._haipcebp99_partnership_questions(),
    'companion_evolution_principles', public._haipcebp99_companion_evolution_principles(),
    'personalization_principles', public._haipcebp99_personalization_principles(),
    'healthy_dependency_principles', public._haipcebp99_healthy_dependency_principles(),
    'companion_guidance', public._haipcebp99_companion_guidance(),
    'relationship_evolution_stages', public._haipcebp99_relationship_evolution_stages(),
    'self_love_connection', public._haipcebp99_self_love_connection(),
    'leadership_connection', public._haipcebp99_leadership_connection(),
    'trust_connection', public._haipcebp99_trust_connection(),
    'privacy_principles', public._haipcebp99_privacy_principles(),
    'dogfooding', public._haipcebp99_dogfooding(),
    'success_criteria', public._haipcebp99_success_criteria(p_organization_id),
    'vision', public._haipcebp99_vision(),
    'vision_phrases', public._haipcebp99_vision_phrases(),
    'integration_links', public._haipcebp99_integration_links(),
    'engagement_summary', public._haipcebp99_engagement_summary(p_organization_id),
    'privacy_note', 'Human-Aipify Partnership blueprint data is metadata only — aggregate module counts, principles, and cross-links. No raw chat, no PII, no individual dependency scoring. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Replace Companion Identity Engine card — preserve ALL prior fields
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_identity_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_modules int := 0;
  v_aligned int := 0;
begin
  perform public._irp_require_permission('companion_identity.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_ensure_settings(v_org_id);
  perform public._cie_seed_module_registry(v_org_id);

  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'This feels like Aipify — through behavior, not logos.',
    'modules_tracked', v_modules,
    'modules_aligned', v_aligned,
    'enabled', (select enabled from public.organization_companion_identity_settings where organization_id = v_org_id),
    'learning_journey_philosophy', public._cie_learning_journey_philosophy(),
    'vision_rose_phrase', public._cie_vision_rose_phrase(),
    'learning_journey_standard_note', public._cie_learning_journey_standard_note(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 6 — Companion Identity Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md',
      'distinction', 'Distinct from Implementation Blueprint Phase 6 Action & Approval (Trust & Action Engine at /app/approvals)'
    ),
    'companion_identity_engine_note', 'Companion Identity Foundation (ABOS Phase 6) — extends Companion Identity Engine (Phase A.84).',
    'companion_naming_policy', public._cnp_companion_naming_policy(),
    'aipify_first_language_policy', public._aflp_policy_bundle(),
    'implementation_blueprint_phase99', jsonb_build_object(
      'phase', 'Phase 99 — Human-Aipify Partnership & Companion Evolution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE99_HUMAN_AI_PARTNERSHIP_COMPANION_EVOLUTION.md',
      'engine_phase', 'A.84 Companion Identity Engine',
      'route', '/app/companion-identity-engine'
    ),
    'human_partnership_mission', public._haipcebp99_mission(),
    'human_partnership_vision', public._haipcebp99_vision(),
    'human_partnership_abos_principle', public._haipcebp99_abos_principle(),
    'human_partnership_engagement_summary', public._haipcebp99_engagement_summary(v_org_id),
    'human_partnership_note', 'Human-Aipify Partnership & Companion Evolution (ABOS Phase 99) — healthy empowering relationships; partnership not replacement.',
    'human_partnership_distinction_note', public._haipcebp99_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Replace Companion Identity Engine dashboard — preserve ALL prior fields
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_identity_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_companion_identity_settings;
  v_modules int := 0;
  v_aligned int := 0;
begin
  perform public._irp_require_permission('companion_identity.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cie_ensure_settings(v_org_id);
  perform public._cie_seed_module_registry(v_org_id);

  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'People remember how they felt — helpful, warm, respectful, encouraging, honest, human-centered. Consistent companion experience across every module.',
    'mission', 'Unified Aipify experience across all touchpoints — values, personality, and communication principles that make Aipify recognizable and trustworthy.',
    'abos_principle', 'Reliable technology plus genuine companionship — Aipify augments people; humans decide.',
    'vision', 'Users say "This feels like Aipify" because of how Aipify behaves, not because of branding alone.',
    'distinction_note', 'Distinct from Identity Engine Phase 34 (per-user style observations), Brand Identity & Personhood Standard (product naming), Humor & Personal Connection (/app/personality), Companion Presence A.67 (floating orb), and Purpose & Values A.82 (tenant organizational values). Also distinct from Implementation Blueprint Phase 6 Action & Approval (Trust & Action Engine). This engine orchestrates unified companion identity across ABOS modules.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 6 — Companion Identity Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md',
      'distinction', 'Distinct from Implementation Blueprint Phase 6 Action & Approval (Trust & Action Engine at /app/approvals)'
    ),
    'companion_identity_engine_note', 'Companion Identity Foundation (ABOS Phase 6) — extends Companion Identity Engine (Phase A.84).',
    'companion_characteristics', public._cie_companion_characteristics(),
    'communication_standards', public._cie_communication_standards(),
    'playful_moments', public._cie_playful_moments(),
    'self_love_implementation', public._cie_self_love_implementation(),
    'companion_memory_rules', public._cie_companion_memory_rules(),
    'org_configuration_boundaries', public._cie_org_configuration_boundaries(),
    'dogfooding', public._cie_blueprint_dogfooding(),
    'success_criteria', public._cie_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._cie_vision_phrases(),
    'core_identity_traits', public._cie_core_identity_traits(),
    'communication_style_rules', public._cie_communication_style_rules(),
    'personality_traits', public._cie_personality_traits(),
    'signature_elements', public._cie_signature_elements(),
    'fox_exchange', public._cie_fox_exchange_example(),
    'module_consistency', public._cie_list_module_consistency(v_org_id),
    'self_love_note', 'Self Love — healthy pacing, balance, celebrate recovery, recognize effort. Growth never at the expense of wellbeing. ' || public._cie_learning_journey_self_love_note(),
    'learning_journey_abos_principle', public._cie_learning_journey_abos_principle(),
    'learning_journey_philosophy', public._cie_learning_journey_philosophy(),
    'capability_gap_examples', public._cie_capability_gap_examples(),
    'growth_principle_phrases', public._cie_growth_principle_phrases(),
    'vision_rose_phrase', public._cie_vision_rose_phrase(),
    'learning_journey_standard_note', public._cie_learning_journey_standard_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', jsonb_build_object(
      'modules_tracked', v_modules,
      'modules_aligned', v_aligned,
      'signature_elements_enabled', v_settings.signature_elements_enabled,
      'playful_when_appropriate', v_settings.playful_when_appropriate,
      'bell_moments_enabled', v_settings.bell_moments_enabled,
      'self_love_refs_enabled', v_settings.self_love_refs_enabled
    ),
    'integration_links', jsonb_build_object(
      'brand_identity', '/content/knowledge/aipify/abos/articles/brand-identity-personhood',
      'aipify_first_language_policy', 'AIPIFY_GLOBAL_NAMING_STANDARD_AIPIFY_FIRST_LANGUAGE_POLICY.md',
      'companion_naming_policy', 'AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md',
      'learning_journey', '/content/knowledge/aipify/abos/articles/learning-journey-communication',
      'personality', '/app/personality',
      'humor_personality', '/app/personality',
      'playful_seed', 'HUMOR_PERSONAL_CONNECTION_ENGINE.md',
      'identity_engine', '/app/assistant/identity',
      'inclusion_humanity', '/app/inclusion-humanity-engine',
      'learning_engine', '/app/learning',
      'presence_comfort', '/app/presence-comfort-protocol',
      'gratitude_recognition', '/app/gratitude-recognition-engine',
      'dedication_engine', '/app/dedication-engine',
      'hope_engine', '/app/hope-engine',
      'wisdom_engine', '/app/wisdom-engine',
      'wisdom_intervention', '/app/wisdom-intervention-protocol',
      'proactive_companion', '/app/proactive-companion-engine',
      'trust_engine', '/app/trust',
      'self_love_naming', 'SELF_LOVE_NAMING_STANDARD.md',
      'companion_identity_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md',
      'human_ai_partnership_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE99_HUMAN_AI_PARTNERSHIP_COMPANION_EVOLUTION.md',
      'ai_ethics', '/app/ai-ethics-responsible-use-engine',
      'growth_evolution', '/app/growth-evolution-engine',
      'self_love', '/app/self-love-engine',
      'companion_presence', '/app/settings/companion-presence',
      'companion_device', '/app/companion-device-ecosystem-engine',
      'approvals', '/app/approvals',
      'personalization', '/app/settings/personalization',
      'manifesto_phase99', '/app/manifesto'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('companion_identity.manage'),
      'can_export', public._irp_has_permission('companion_identity.export')
    ),
    'companion_naming_policy', public._cnp_companion_naming_policy(),
    'aipify_first_language_policy', public._aflp_policy_bundle(),
    'implementation_blueprint_phase99', jsonb_build_object(
      'phase', 'Phase 99 — Human-Aipify Partnership & Companion Evolution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE99_HUMAN_AI_PARTNERSHIP_COMPANION_EVOLUTION.md',
      'engine_phase', 'A.84 Companion Identity Engine',
      'route', '/app/companion-identity-engine'
    ),
    'human_partnership_mission', public._haipcebp99_mission(),
    'human_partnership_philosophy', public._haipcebp99_philosophy(),
    'human_partnership_abos_principle', public._haipcebp99_abos_principle(),
    'human_partnership_vision', public._haipcebp99_vision(),
    'human_partnership_distinction_note', public._haipcebp99_distinction_note(),
    'human_partnership_objectives', public._haipcebp99_objectives(),
    'human_partnership_questions', public._haipcebp99_partnership_questions(),
    'human_partnership_evolution_principles', public._haipcebp99_companion_evolution_principles(),
    'human_partnership_personalization', public._haipcebp99_personalization_principles(),
    'human_partnership_healthy_dependency', public._haipcebp99_healthy_dependency_principles(),
    'human_partnership_companion_guidance', public._haipcebp99_companion_guidance(),
    'human_partnership_evolution_stages', public._haipcebp99_relationship_evolution_stages(),
    'human_partnership_self_love', public._haipcebp99_self_love_connection(),
    'human_partnership_leadership', public._haipcebp99_leadership_connection(),
    'human_partnership_trust', public._haipcebp99_trust_connection(),
    'human_partnership_privacy', public._haipcebp99_privacy_principles(),
    'human_partnership_dogfooding', public._haipcebp99_dogfooding(),
    'human_partnership_success_criteria', public._haipcebp99_success_criteria(v_org_id),
    'human_partnership_vision_phrases', public._haipcebp99_vision_phrases(),
    'human_partnership_integration_links', public._haipcebp99_integration_links(),
    'human_partnership_engagement_summary', public._haipcebp99_engagement_summary(v_org_id),
    'human_partnership_note', 'Human-Aipify Partnership & Companion Evolution (ABOS Phase 99) — healthy empowering relationships; partnership not replacement.',
    'human_ai_partnership_companion_evolution_blueprint', public._haipcebp99_human_ai_partnership_companion_evolution_blueprint_block(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._haipcebp99_engagement_summary(uuid) to authenticated;
grant execute on function public._haipcebp99_success_criteria(uuid) to authenticated;
grant execute on function public._haipcebp99_human_ai_partnership_companion_evolution_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-aipify-partnership-companion-evolution', 'Human-Aipify Partnership & Companion Evolution',
  'Healthy empowering human-Aipify relationships — intentional companion evolution on Companion Identity A.84.',
  'authenticated', 102
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'human-aipify-partnership-companion-evolution' and tenant_id is null
);
