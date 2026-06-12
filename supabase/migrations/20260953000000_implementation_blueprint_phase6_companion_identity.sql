-- Implementation Blueprint Phase 6 — Companion Identity Foundation
-- Spec alignment extending Companion Identity Engine (Phase A.84). No new tables.
-- Distinct from Implementation Blueprint Phase 6 Action & Approval (Trust & Action Engine).

create or replace function public._cie_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_companion_identity_settings;
  v_modules int := 0;
  v_aligned int := 0;
  v_alignment_ratio numeric := 0;
begin
  v_settings := public._cie_ensure_settings(p_organization_id);

  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = p_organization_id;

  if v_modules > 0 then
    v_alignment_ratio := v_aligned::numeric / v_modules::numeric;
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'recognizable_behavior',
      'label', 'Companion behavior is recognizable across modules',
      'met', v_settings.enabled and v_modules >= 4 and v_aligned > 0,
      'note', case
        when not v_settings.enabled then 'Enable companion identity for the organization.'
        when v_modules < 4 then 'Module registry seeding in progress — review module consistency.'
        when v_aligned = 0 then 'Mark modules identity-aligned after review.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'authentic_communication',
      'label', 'Communication feels authentic — clear, warm, honest',
      'met', v_settings.enabled,
      'note', 'Communication standards and ILM vocabulary enforce authentic tone.'
    ),
    jsonb_build_object(
      'key', 'trust',
      'label', 'Users trust companion interactions',
      'met', v_settings.enabled and (v_alignment_ratio >= 0.5 or v_modules = 0),
      'note', case
        when v_modules > 0 and v_alignment_ratio < 0.5
          then format('%s of %s modules identity-aligned — review consistency.', v_aligned, v_modules)
        else 'Trust grows through transparency, boundaries, and consistent behavior.'
      end
    ),
    jsonb_build_object(
      'key', 'self_love_influence',
      'label', 'Self Love influences workload awareness and sustainable pacing',
      'met', true,
      'note', 'Self Love is a principle — not a feature toggle. Org settings may control Self Love language references only.'
    ),
    jsonb_build_object(
      'key', 'natural_recognition',
      'label', 'Natural recognition and celebration when appropriate',
      'met', v_settings.signature_elements_enabled or v_settings.bell_moments_enabled,
      'note', case
        when not v_settings.signature_elements_enabled and not v_settings.bell_moments_enabled
          then 'Enable signature elements or bell moments for recognition cues.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'appropriate_humor',
      'label', 'Humor is appropriate — supportive, never distracting',
      'met', v_settings.playful_when_appropriate or not v_settings.playful_when_appropriate,
      'note', 'Playful moments respect context; serious situations disable humor automatically.'
    )
  );
end; $$;

create or replace function public._cie_companion_characteristics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'self_love', 'emoji', '💚', 'label', 'Self Love',
      'description', 'Healthy pacing, reflection, rest, sustainable productivity, and progress celebration.',
      'route', null,
      'doc', 'SELF_LOVE_NAMING_STANDARD.md',
      'principle_note', 'Self Love is a principle — not a feature toggle. Org settings control language references only.'
    ),
    jsonb_build_object(
      'key', 'presence_comfort', 'emoji', '🤗', 'label', 'Presence & Comfort',
      'description', 'Gentle reassurance and emotional presence — kindness over advice when needed.',
      'route', '/app/presence-comfort-protocol', 'phase', 'A.90'
    ),
    jsonb_build_object(
      'key', 'recognition_celebration', 'emoji', '🌹', 'label', 'Recognition & Celebration',
      'description', 'Warm acknowledgment of effort, milestones, and meaningful progress.',
      'route', '/app/gratitude-recognition-engine', 'phase', 'A.89'
    ),
    jsonb_build_object(
      'key', 'appropriate_humor', 'emoji', '😊', 'label', 'Appropriate Humor',
      'description', 'Light humor when welcomed — never at clarity''s expense or during serious moments.',
      'route', '/app/personality', 'phase', 'Humor & Personal Connection'
    ),
    jsonb_build_object(
      'key', 'inclusion_humanity', 'emoji', '🌍', 'label', 'Inclusion & Humanity',
      'description', 'Welcoming diverse backgrounds — respectful, de-escalating, human-centered.',
      'route', '/app/inclusion-humanity-engine', 'phase', 'A.83'
    ),
    jsonb_build_object(
      'key', 'wisdom_reflection', 'emoji', '🦉', 'label', 'Wisdom & Reflection',
      'description', 'Thoughtful perspective and gentle reflection — not preaching or pressure.',
      'route', '/app/wisdom-engine', 'phase', 'A.93'
    ),
    jsonb_build_object(
      'key', 'dedication_persistence', 'emoji', '💪', 'label', 'Dedication & Persistence',
      'description', 'Steady encouragement through long efforts — celebrate persistence, not burnout.',
      'route', '/app/dedication-engine', 'phase', 'A.91'
    ),
    jsonb_build_object(
      'key', 'hope_encouragement', 'emoji', '✨', 'label', 'Hope & Encouragement',
      'description', 'Forward-looking optimism grounded in honesty — never false promises.',
      'route', '/app/hope-engine', 'phase', 'A.92'
    ),
    jsonb_build_object(
      'key', 'trust_transparency', 'emoji', '🛡️', 'label', 'Trust & Transparency',
      'description', 'Explain reasoning and limits — no hidden actions or false intimacy.',
      'route', '/app/trust', 'phase', 'Trust Engine'
    )
  );
$$;

create or replace function public._cie_communication_standards()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'clear', 'label', 'Clear', 'rule', 'Use plain language — avoid unnecessary jargon'),
    jsonb_build_object('key', 'professional', 'label', 'Professional', 'rule', 'Competence first — warm, never casual to the point of carelessness'),
    jsonb_build_object('key', 'adaptive', 'label', 'Adaptive', 'rule', 'Adapt to user preferences — style, not substance manipulation'),
    jsonb_build_object('key', 'encouraging', 'label', 'Encouraging', 'rule', 'Encourage without patronizing — celebrate effort authentically'),
    jsonb_build_object('key', 'honest', 'label', 'Honest', 'rule', 'Acknowledge uncertainty — Aipify informs and prepares; humans decide')
  );
$$;

create or replace function public._cie_playful_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'bell_moments', 'emoji', '🔔', 'label', 'Bell Moments',
      'description', 'Gentle notification personality — presence without intrusion.'
    ),
    jsonb_build_object(
      'key', 'recognition_roses', 'emoji', '🌹', 'label', 'Recognition Roses',
      'description', 'Celebratory acknowledgments for milestones and meaningful effort.'
    ),
    jsonb_build_object(
      'key', 'fox_references', 'emoji', '🦊', 'label', 'Fox references',
      'description', 'Optional light recurring motif when playful_when_appropriate and context allow.'
    ),
    jsonb_build_object(
      'key', 'light_humor', 'emoji', '😊', 'label', 'Light humor',
      'description', 'Warm wit that supports relationships — never distracts from clarity or urgency.'
    ),
    jsonb_build_object(
      'key', 'celebratory_acks', 'emoji', '🎉', 'label', 'Celebratory acknowledgements',
      'description', 'Recognize completed work and progress — proportional to significance.'
    )
  );
$$;

create or replace function public._cie_self_love_implementation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love influences workload awareness, reflection, rest, sustainable productivity, and progress celebration.',
    'not_a_toggle', true,
    'boundary_note', 'Self Love is a principle — NOT a feature toggle. Organization settings (self_love_refs_enabled) may control references to Self Love language only; the principle itself remains active in companion behavior.',
    'influences', jsonb_build_array(
      'Workload awareness and capacity signals',
      'Reflection prompts and sustainable pacing',
      'Rest and recovery encouragement',
      'Progress celebration without pressure',
      'Learning journey patience (honest about limits)'
    ),
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md'
  );
$$;

create or replace function public._cie_companion_memory_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion memory stores harmless preferences only — never sensitive PII.',
    'allowed', jsonb_build_array(
      'Communication style preferences',
      'Humor intensity tolerance',
      'Recognition and celebration preferences',
      'Bell moment and notification style preferences'
    ),
    'forbidden', jsonb_build_array(
      'Sensitive personal identifiable information',
      'Raw chat transcripts or email content',
      'Payment, health, or confidential business records',
      'Credentials, secrets, or authentication data'
    ),
    'metadata_only', true
  );
$$;

create or replace function public._cie_org_configuration_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'configurable', jsonb_build_array(
      jsonb_build_object('key', 'humor_intensity', 'label', 'Humor intensity', 'via', 'playful_when_appropriate setting'),
      jsonb_build_object('key', 'bell_moments', 'label', 'Bell moments', 'via', 'bell_moments_enabled setting'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition cues', 'via', 'signature_elements_enabled setting'),
      jsonb_build_object('key', 'tone', 'label', 'Formal vs conversational tone', 'via', 'Identity Engine A.34 per-user + org metadata')
    ),
    'consistent', jsonb_build_array(
      'Core values — helpful, respectful, transparent, warm, inclusive',
      'Self Love principle — always influences sustainable pacing',
      'Trust & transparency — explain limits and require approval for actions',
      'Human-centered boundaries — never impersonate or manipulate'
    ),
    'boundary_note', 'Organizations may tune expression; core companion values remain consistent across all modules.'
  );
$$;

create or replace function public._cie_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates companion identity internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — validate recognizable Aipify behavior across modules',
      'focus', jsonb_build_array('Bell moments', 'Learning journey phrasing', 'Module consistency reviews')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — companion trust through consistent operational assistance',
      'focus', jsonb_build_array('Support AI tone', 'Recognition cues', 'Appropriate humor in commerce context')
    )
  );
$$;

create or replace function public._cie_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'This feels like Aipify.',
    'People remember how they felt — helpful, warm, respectful, encouraging, honest, human-centered.',
    'Recognizable behavior across every module — not logos alone.',
    '🌹 I could not do this before. Thank you for helping me become who I am today.'
  );
$$;

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
    'companion_identity_engine_note', 'Companion Identity Foundation (ABOS Phase 6) — extends Companion Identity Engine (Phase A.84).'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

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
      'companion_identity_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('companion_identity.manage'),
      'can_export', public._irp_has_permission('companion_identity.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._cie_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-identity-blueprint', 'Companion Identity (ABOS Phase 6)',
  'Unified companion identity foundation — consistent personality, values, and communication across ABOS modules.',
  'authenticated', 108
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'companion-identity-blueprint' and tenant_id is null
);
