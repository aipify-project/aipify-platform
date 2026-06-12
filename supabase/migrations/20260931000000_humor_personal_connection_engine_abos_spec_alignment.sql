-- ABOS Humor & Personal Connection Engine — spec alignment
-- Extends Humor, Warmth & Human Connection (/app/personality). No new tables.

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
    'philosophy', 'Personality connects; humor reduces stress; warmth builds trust — without pretending to be human.',
    'mission', 'Authentic connection through style adaptation, harmless humor recognition, and natural interactions.',
    'abos_principle', 'Professionalism and personality coexist. Competent first. Human second. Funny third.',
    'vision', 'Remember how people prefer to communicate; respect humanity; offer a shared smile during a difficult day.',
    'default_mode', 'warm_professional',
    'distinction_note', 'ABOS Humor & Personal Connection at /app/personality — distinct from Identity Engine (Phase 34), Companion Presence (A.67), Brand Identity & Personhood, and Proactive Companion (A.79).'
  );
end; $$;

create or replace function public.get_personality_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.personality_settings;
  v_examples jsonb;
  v_humor_allowed boolean;
  v_crisis boolean;
begin
  v_tenant_id := public._per_require_tenant();
  perform public._per_seed_templates();
  v_settings := public._per_ensure_settings(v_tenant_id);
  v_crisis := public._per_is_crisis_context(v_tenant_id);
  v_humor_allowed := public._per_is_humor_allowed(v_tenant_id, 'greeting', v_settings);

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
    'max_emojis_normal', v_settings.max_emojis_normal,
    'max_emojis_celebration', v_settings.max_emojis_celebration,
    'humor_currently_allowed', v_humor_allowed,
    'crisis_mode_active', v_crisis,
    'golden_rule', 'Humor supports trust. Never replaces clarity.',
    'philosophy', 'Personality connects; humor reduces stress; warmth builds trust — without pretending to be human.',
    'mission', 'Authentic connection through style adaptation, harmless humor recognition, and natural interactions.',
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
    'example_messages', v_examples,
    'integrations', jsonb_build_object(
      'desktop_companion', 'Learning tips, milestones, and warm greetings',
      'human_success', 'Celebrations and champion recognition',
      'knowledge_center', 'Contextual article recommendations',
      'assistant_identity', 'Tone alignment with communication preferences',
      'continuity', 'Humor automatically suppressed during Incident Mode'
    ),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Assistant Identity (Phase 34)', 'route', '/app/assistant/identity', 'description', 'Per-user communication style observations — complements tenant personality modes.'),
      jsonb_build_object('label', 'Human Success', 'route', '/app/human-success', 'description', 'Celebrations, adoption journeys, and champion recognition.'),
      jsonb_build_object('label', 'Continuity & Crisis', 'route', '/app/continuity', 'description', 'Incident Mode automatically suppresses humor.'),
      jsonb_build_object('label', 'Self Love', 'route', '/app/self-love', 'description', 'Progress celebration and demanding-day lightness.'),
      jsonb_build_object('label', 'Personalization & Workstyle', 'route', '/app/settings/personalization', 'description', 'Individual workstyle preferences with consent.')
    ),
    'safeguards', jsonb_build_object(
      'no_mocking', true,
      'no_aggressive_sarcasm', true,
      'no_forced_humor', true,
      'no_surveillance_tone', true,
      'crisis_suppression', v_crisis
    ),
    'distinction_note', 'ABOS Humor & Personal Connection at /app/personality — NOT Identity Engine (Phase 34), Companion Presence (A.67), Brand Identity & Personhood, or Proactive Companion (A.79).'
  );
end; $$;
