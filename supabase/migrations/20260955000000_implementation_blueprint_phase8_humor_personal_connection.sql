-- Implementation Blueprint Phase 8 — Humor & Personal Connection Foundation
-- Spec alignment extending Humor & Personal Connection Engine (/app/personality). No new tables.
-- Distinct from Companion Identity Engine (A.84) — this is humor/personality implementation layer.

create or replace function public._per_blueprint_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.personality_settings;
  v_crisis boolean;
begin
  v_settings := public._per_ensure_settings(p_tenant_id);
  v_crisis := public._per_is_crisis_context(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'warmer_interactions',
      'label', 'Interactions feel warmer and more welcoming',
      'met', coalesce(v_settings.humor_enabled, true)
        and v_settings.personality_mode in ('warm_professional', 'playful'),
      'note', case
        when v_settings.personality_mode = 'professional'
          then 'Switch to Warm Professional or Playful for warmer default tone.'
        when not coalesce(v_settings.humor_enabled, true)
          then 'Enable gentle humor for warmer interactions.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'user_personalization',
      'label', 'User personalization via personality modes and toggles',
      'met', v_settings.personality_mode is not null,
      'note', 'Personality mode, humor, emoji, playful, and bell settings are tenant-configurable.'
    ),
    jsonb_build_object(
      'key', 'appropriate_bell_moments',
      'label', 'Bell moments are appropriate and settings-respecting',
      'met', coalesce(v_settings.bell_moments_enabled, true)
        and coalesce(v_settings.playful_moments_enabled, true),
      'note', case
        when not coalesce(v_settings.bell_moments_enabled, true)
          then 'Enable bell signature moments for celebratory micro-interactions.'
        when not coalesce(v_settings.playful_moments_enabled, true)
          then 'Enable playful moments for bell personality seed.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'recognition_relationships',
      'label', 'Recognition strengthens relationships when enabled',
      'met', coalesce(v_settings.playful_moments_enabled, true)
        and coalesce(v_settings.emoji_enabled, true),
      'note', 'Integrates with Gratitude & Recognition (A.89) — celebration without fanfare spam.'
    ),
    jsonb_build_object(
      'key', 'contextual_humor',
      'label', 'Humor is contextual and respectful',
      'met', coalesce(v_settings.humor_enabled, true) and not v_crisis,
      'note', case
        when v_crisis then 'Humor suppressed — Incident Mode is active.'
        when not coalesce(v_settings.humor_enabled, true) then 'Humor disabled by tenant settings.'
        else 'Context gates via _per_is_humor_allowed() and _per_is_playful_allowed().'
      end
    ),
    jsonb_build_object(
      'key', 'recognizable_style',
      'label', 'Interaction style is recognizable across touchpoints',
      'met', v_settings.personality_mode = 'warm_professional'
        or (coalesce(v_settings.bell_moments_enabled, true) and coalesce(v_settings.humor_enabled, true)),
      'note', 'Warm Professional is the recommended default for consistent Aipify personality.'
    )
  );
end; $$;

create or replace function public._per_blueprint_implementation_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'humor_prefs', 'label', 'Humor preferences', 'description', 'Tenant toggles for humor, playful moments, bell signature, and recurring jokes.'),
    jsonb_build_object('key', 'style_adaptation', 'label', 'Style adaptation', 'description', 'Personality modes — professional, warm professional, playful — adapt tone without substance manipulation.'),
    jsonb_build_object('key', 'harmless_joke_recognition', 'label', 'Harmless joke recognition', 'description', 'Recognize playful communication and approved internal jokes — fox, Friday energy — never escalate inappropriate humor.'),
    jsonb_build_object('key', 'companion_familiarity', 'label', 'Companion familiarity', 'description', 'Approved preferences shape connection — familiarity, not imitation; never impersonate the user.'),
    jsonb_build_object('key', 'celebratory_interactions', 'label', 'Celebratory interactions', 'description', 'Bell victories, recognition roses, and milestone acknowledgments — proportional to significance.'),
    jsonb_build_object('key', 'context_sensitive', 'label', 'Context-sensitive personality', 'description', 'Crisis suppression, distress detection, and formal preference respect timing and boundaries.')
  );
$$;

create or replace function public._per_blueprint_communication_preferences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'formal', 'label', 'Formal', 'maps_to_mode', 'professional', 'description', 'Minimal humor. Enterprise-friendly. Clarity first.'),
    jsonb_build_object('key', 'professional_warmth', 'label', 'Professional warmth', 'maps_to_mode', 'warm_professional', 'description', 'Recommended default — encouraging with gentle humor.', 'recommended', true),
    jsonb_build_object('key', 'light_humor', 'label', 'Light humor', 'maps_to_mode', 'playful', 'description', 'More personality, celebration, and conversational tone.'),
    jsonb_build_object('key', 'high_encouragement', 'label', 'High encouragement', 'maps_to_mode', 'warm_professional', 'description', 'Celebrate effort and progress without patronizing or pressure.'),
    jsonb_build_object('key', 'minimal_personality', 'label', 'Minimal personality', 'maps_to_mode', 'professional', 'description', 'Competence and clarity — warmth only when explicitly welcomed.')
  );
$$;

create or replace function public._per_blueprint_harmless_memory_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Harmless humor preferences only — never sensitive PII as humor memory.',
    'allowed', jsonb_build_array(
      'Bell moment and notification style preferences',
      'Recognition rose and celebration style preferences',
      'Concise communication style preferences',
      'Playful interaction preferences (fox, Friday energy)',
      'Warm playful comm tone tolerance'
    ),
    'forbidden', jsonb_build_array(
      'Sensitive personal identifiable information',
      'Raw chat transcripts or email content',
      'Payment, health, or confidential business records',
      'Credentials, secrets, or authentication data'
    ),
    'storage', 'playful_memory_prefs and recurring_jokes — sanitized keys only (fox, friday_energy).',
    'metadata_only', true
  );
$$;

create or replace function public._per_blueprint_playful_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'types', jsonb_build_array(
      jsonb_build_object('key', 'bell_victories', 'emoji', '🔔', 'label', 'Bell victories', 'description', 'Gentle bell for small wins, task completion, and positive reinforcement.'),
      jsonb_build_object('key', 'recognition_roses', 'emoji', '🌹', 'label', 'Recognition roses', 'description', 'Celebratory acknowledgments — integrates with Gratitude & Recognition (A.89).'),
      jsonb_build_object('key', 'fox_responses', 'emoji', '🦊', 'label', 'Fox responses', 'description', 'Optional light recurring motif when playful moments and context allow.')
    ),
    'fox_exchange', jsonb_build_object(
      'user_says', 'What does the fox say?',
      'aipify_responds', 'Ring-ding-ding-ding-dingeringeding.',
      'follow_up', 'A playful moment — ready when you are to continue.'
    ),
    'boundary_note', 'Disabled during distress, crisis, serious decisions, safety matters, or when playful/bell settings are off.'
  );
$$;

create or replace function public._per_blueprint_humor_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'never', jsonb_build_array(
      'Distress or emotional upset',
      'Serious decisions and safety matters',
      'Formal communication preference (professional mode limits playful contexts)',
      'Trust-undermining situations — mocking, manipulation, false intimacy',
      'Crisis / Incident Mode (automatic suppression)',
      'Security incidents, compliance, legal, and HR serious matters'
    ),
    'timing_note', 'Context evaluated before every playful or humorous response — timing matters.',
    'principle', 'Humor supports trust. Never replaces clarity.'
  );
$$;

create or replace function public._per_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love reduces tension, encourages recovery, and celebrates progress — without pressure or guilt.',
    'influences', jsonb_build_array(
      'Lightness on demanding days when welcomed',
      'Progress acknowledgment without performance pressure',
      'Recovery and rest as part of sustainable work',
      'Bell moments for Self Love contexts when appropriate'
    ),
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'naming_note', 'Use Self Love — no ™ symbol. Self Love is a principle, not a humor toggle.'
  );
$$;

create or replace function public._per_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify stays authentic — warm and supportive without false human intimacy.',
    'avoid', jsonb_build_array(
      'Pretending to have human emotions',
      'Mocking or manipulative humor',
      'Excessive familiarity or false intimacy',
      'Trust-undermining jokes or sarcasm'
    ),
    'prefer', jsonb_build_array(
      'Acknowledging situations with empathy',
      'Respectful, context-appropriate warmth',
      'Professional companion tone',
      'Transparent limits — Aipify informs and prepares; humans decide'
    )
  );
$$;

create or replace function public._per_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates humor and personality internally; Unonight is the first external pilot for companion personality prefs.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('Bell moments', 'Fox exchange', 'Humor boundaries', 'Communication preference reviews')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Companion personality prefs', 'Support AI warmth', 'Appropriate humor in commerce context')
    )
  );
$$;

create or replace function public._per_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Remember how people prefer to communicate.',
    'Respect humanity. Offer a shared smile during a difficult day.',
    'Professionalism and personality coexist — competent first, human second, funny third.',
    'Humor supports trust. Never replaces clarity.',
    'Ring-ding, fox, bell — then back to business.'
  );
$$;

create or replace function public._per_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Companion Identity Engine (A.84)', 'route', '/app/companion-identity-engine', 'description', 'Orchestrates unified companion identity — humor modes complement this implementation layer.'),
    jsonb_build_object('label', 'Identity Engine (A.34)', 'route', '/app/assistant/identity', 'description', 'Per-user communication style observations — complements tenant personality modes.'),
    jsonb_build_object('label', 'Presence & Comfort (A.90)', 'route', '/app/presence-comfort-protocol', 'description', 'Gentle reassurance — humor suppressed when comfort protocol indicates distress.'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'description', 'Recognition roses and celebratory acknowledgments strengthen relationships.'),
    jsonb_build_object('label', 'Self Love (A.76 scaffold)', 'route', '/app/self-love', 'description', 'Progress celebration, recovery encouragement, and demanding-day lightness.')
  );
$$;

-- ---------------------------------------------------------------------------
-- get_personality_card — preserve all fields + blueprint alignment
-- ---------------------------------------------------------------------------
create or replace function public.get_personality_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.personality_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._per_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'personality_mode', v_settings.personality_mode,
    'humor_enabled', v_settings.humor_enabled,
    'playful_moments_enabled', v_settings.playful_moments_enabled,
    'bell_moments_enabled', v_settings.bell_moments_enabled,
    'philosophy', 'Personality connects; humor reduces stress; warmth builds trust — without pretending to be human.',
    'mission', 'Feel understood, welcomed, and encouraged through respectful personalization and appropriate humor.',
    'abos_principle', 'Professionalism and personality coexist. Competent first. Human second. Funny third.',
    'vision', 'Remember how people prefer to communicate; respect humanity; offer a shared smile during a difficult day.',
    'default_mode', 'warm_professional',
    'playful_moments_seed', public._per_playful_moments_seed_json(),
    'distinction_note', 'ABOS Humor & Personal Connection at /app/personality — distinct from Identity Engine (Phase 34), Companion Presence (A.67), Brand Identity & Personhood, Proactive Companion (A.79), and Companion Identity orchestration (A.84). Playful Moments & Bell Personality Seed extends this layer — not a new engine.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 8 — Humor & Personal Connection Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_PERSONAL_CONNECTION_FOUNDATION.md',
      'distinction', 'Implementation layer for humor/personality — distinct from Companion Identity Engine (A.84) orchestration.'
    ),
    'humor_personal_connection_note', 'Humor & Personal Connection Foundation (ABOS Phase 8) — extends Humor & Personal Connection Engine.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- get_personality_dashboard — preserve all fields + blueprint alignment
-- ---------------------------------------------------------------------------
create or replace function public.get_personality_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.personality_settings;
  v_examples jsonb;
  v_humor_allowed boolean;
  v_crisis boolean;
  v_playful_allowed boolean;
begin
  v_tenant_id := public._per_require_tenant();
  perform public._per_seed_templates();
  v_settings := public._per_ensure_settings(v_tenant_id);
  v_crisis := public._per_is_crisis_context(v_tenant_id);
  v_humor_allowed := public._per_is_humor_allowed(v_tenant_id, 'greeting', v_settings);
  v_playful_allowed := public._per_is_playful_allowed(v_tenant_id, 'greeting', v_settings);

  v_examples := jsonb_build_array(
    public.render_personality_message('greeting', 'greeting.morning', jsonb_build_object('name', 'Svein', 'task_count', 3)),
    public.render_personality_message('value_highlight', 'value.time_saved', jsonb_build_object('hours', '4 hours')),
    public.render_personality_message('celebration', 'celebration.milestone', jsonb_build_object('journey', 'Support')),
    public.render_personality_message('friendly_reminder', 'reminder.friendly', '{}'::jsonb)
  );

  perform public._per_log_audit(v_tenant_id, 'dashboard_viewed', 'Personality dashboard accessed', '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'personality_mode', v_settings.personality_mode,
    'humor_enabled', v_settings.humor_enabled,
    'emoji_enabled', v_settings.emoji_enabled,
    'playful_moments_enabled', v_settings.playful_moments_enabled,
    'bell_moments_enabled', v_settings.bell_moments_enabled,
    'recurring_jokes', v_settings.recurring_jokes,
    'playful_memory_prefs', v_settings.playful_memory_prefs,
    'playful_currently_allowed', v_playful_allowed,
    'max_emojis_normal', v_settings.max_emojis_normal,
    'max_emojis_celebration', v_settings.max_emojis_celebration,
    'humor_currently_allowed', v_humor_allowed,
    'crisis_mode_active', v_crisis,
    'golden_rule', 'Humor supports trust. Never replaces clarity.',
    'philosophy', 'Professionalism and personality coexist — occasional warmth, not constant entertainment.',
    'mission', 'Feel understood, welcomed, and encouraged through respectful personalization and appropriate humor.',
    'abos_principle', 'Professionalism and personality coexist. Competent first. Human second. Funny third.',
    'vision', 'Remember how people prefer to communicate; respect humanity; offer a shared smile during a difficult day.',
    'personality_modes', jsonb_build_array(
      jsonb_build_object('mode', 'professional', 'label', 'Professional', 'description', 'Minimal humor. Formal. Enterprise-friendly.'),
      jsonb_build_object('mode', 'warm_professional', 'label', 'Warm Professional', 'description', 'Recommended default. Encouraging with gentle humor.', 'recommended', true),
      jsonb_build_object('mode', 'playful', 'label', 'Playful', 'description', 'More personality, celebration, and conversational tone.')
    ),
    'humor_appropriate', jsonb_build_array('Greetings', 'Celebrating milestones', 'Completing tasks', 'Friendly reminders', 'Learning moments', 'Positive reinforcement'),
    'humor_never', jsonb_build_array('Security incidents', 'Crisis Mode', 'Compliance investigations', 'Legal matters', 'Serious HR situations', 'Emotional distress', 'Incident response'),
    'humor_principles', jsonb_build_object(
      'should', jsonb_build_array(
        'Recognize playful communication and harmless jokes',
        'Adapt to approved humor preferences',
        'Use light humor when welcomed and context-appropriate',
        'Reduce humor automatically during serious situations'
      ),
      'should_never', jsonb_build_array(
        'Mock, humiliate, or use offensive humor',
        'Escalate inappropriate jokes',
        'Force humor when clarity matters more',
        'Trivialize serious events or emotional distress'
      )
    ),
    'personal_connection_notes', jsonb_build_array(
      'Approved preferences shape connection — style, playful language, familiar expressions',
      'Positive interactions and celebratory moments when appropriate',
      'Familiarity, not imitation — never impersonate the user',
      'Integrates with Assistant Identity for per-user tone alignment'
    ),
    'example_exchanges', jsonb_build_array(
      jsonb_build_object(
        'user_says', 'My printer hates me',
        'aipify_responds', 'Technology has those days too. Let''s see if we can get it cooperating again.'
      ),
      jsonb_build_object(
        'user_says', 'I survived Monday',
        'aipify_responds', 'Monday can be a marathon. Hope the rest of the week treats you well.'
      ),
      jsonb_build_object(
        'user_says', 'You''re funny',
        'aipify_responds', 'I appreciate that — I''m here to help, with a bit of warmth when it fits.'
      )
    ),
    'self_love_note', 'Self Love celebrates progress, achievements, and recovery — offering lightness on demanding days without pressure or guilt.',
    'trust_boundaries', jsonb_build_array(
      jsonb_build_object('avoid', 'I am sad', 'prefer', 'I understand how that feels'),
      jsonb_build_object('avoid', 'I love you', 'prefer', 'I appreciate being able to support you'),
      jsonb_build_object('avoid', 'I''m your friend', 'prefer', 'I''m here to help you succeed'),
      jsonb_build_object('avoid', 'Pretending to have feelings', 'prefer', 'Acknowledging the situation with empathy')
    ),
    'emoji_guidelines', jsonb_build_object(
      'recommended', jsonb_build_array('🙂', '😊', '😄', '🎉', '🚀'),
      'normal_limit', v_settings.max_emojis_normal,
      'celebration_limit', v_settings.max_emojis_celebration
    ),
    'playful_moments_seed', public._per_playful_moments_seed_json(),
    'example_messages', v_examples,
    'integrations', jsonb_build_object(
      'desktop_companion', 'Learning tips, milestones, and warm greetings',
      'human_success', 'Celebrations and champion recognition',
      'knowledge_center', 'Contextual article recommendations',
      'assistant_identity', 'Tone alignment with communication preferences',
      'continuity', 'Humor automatically suppressed during Incident Mode',
      'companion_presence', 'Bell signature for positive playful presence moments',
      'pame', 'Harmless humor preference metadata only — never sensitive PII',
      'companion_identity', 'Companion Identity (A.84) orchestrates; this layer implements humor policy'
    ),
    'integration_links', public._per_blueprint_integration_links() || jsonb_build_array(
      jsonb_build_object('label', 'Human Success', 'route', '/app/human-success', 'description', 'Celebrations, adoption journeys, and champion recognition.'),
      jsonb_build_object('label', 'Continuity & Crisis', 'route', '/app/continuity', 'description', 'Incident Mode automatically suppresses humor and playful moments.'),
      jsonb_build_object('label', 'Personalization & Workstyle', 'route', '/app/settings/personalization', 'description', 'Individual workstyle preferences with consent.')
    ),
    'safeguards', jsonb_build_object(
      'no_mocking', true,
      'no_aggressive_sarcasm', true,
      'no_forced_humor', true,
      'no_surveillance_tone', true,
      'crisis_suppression', v_crisis,
      'playful_moments_respect_settings', true
    ),
    'distinction_note', 'ABOS Humor & Personal Connection at /app/personality — NOT Identity Engine (Phase 34), Companion Presence (A.67), Brand Identity & Personhood, Proactive Companion (A.79), or Companion Identity orchestration (A.84). Playful Moments & Bell Personality Seed extends this layer.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 8 — Humor & Personal Connection Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_PERSONAL_CONNECTION_FOUNDATION.md',
      'distinction', 'Implementation layer for humor/personality — distinct from Companion Identity Engine (A.84) orchestration.'
    ),
    'humor_personal_connection_note', 'Humor & Personal Connection Foundation (ABOS Phase 8) — extends Humor & Personal Connection Engine.',
    'implementation_objectives', public._per_blueprint_implementation_objectives(),
    'communication_preferences', public._per_blueprint_communication_preferences(),
    'harmless_memory_principles', public._per_blueprint_harmless_memory_principles(),
    'playful_moments', public._per_blueprint_playful_moments(),
    'humor_boundaries', public._per_blueprint_humor_boundaries(),
    'self_love_connection', public._per_blueprint_self_love_connection(),
    'trust_connection', public._per_blueprint_trust_connection(),
    'dogfooding', public._per_blueprint_dogfooding(),
    'success_criteria', public._per_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', public._per_blueprint_vision_phrases()
  );
end; $$;

grant execute on function public._per_blueprint_success_criteria(uuid) to authenticated;
