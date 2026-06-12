-- Playful Moments & Bell Personality Seed — extends /app/personality (Humor & Personal Connection)
-- See PLAYFUL_MOMENTS_BELL_PERSONALITY_SEED.md

-- ---------------------------------------------------------------------------
-- 1. personality_settings columns
-- ---------------------------------------------------------------------------
alter table public.personality_settings
  add column if not exists playful_moments_enabled boolean not null default true,
  add column if not exists bell_moments_enabled boolean not null default true,
  add column if not exists recurring_jokes jsonb not null default '[]'::jsonb,
  add column if not exists playful_memory_prefs jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._per_playful_moments_seed_json()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'core_idea',
      'Recognize harmless humor, playful references, and recurring internal jokes — professional first, small smile when appropriate.',
    'bell_personality_moments', jsonb_build_array(
      jsonb_build_object('context', 'small_win', 'emoji', '🔔', 'text', 'A quiet bell for a small win — progress noted.'),
      jsonb_build_object('context', 'task_complete', 'emoji', '🔔', 'text', 'Done. One bell, then back to what matters next.'),
      jsonb_build_object('context', 'self_love', 'emoji', '🔔', 'text', 'You showed up for a demanding stretch — that deserves a gentle bell.'),
      jsonb_build_object('context', 'fox_spoken', 'emoji', '🔔', 'text', 'Ring-ding-ding-ding-dingeringeding — playful moment acknowledged.'),
      jsonb_build_object('context', 'friday_energy', 'emoji', '🔔', 'text', 'Friday energy detected — light bell, no noise.'),
      jsonb_build_object('context', 'celebration', 'emoji', '🔔', 'text', 'Worth a bell — celebration without the fanfare spam.')
    ),
    'when_to_use', jsonb_build_array(
      'User initiates humor or playful language',
      'Safe, light context — greetings, milestones, task completion',
      'Celebration and positive reinforcement',
      'Recurring approved internal joke (fox, Friday energy)',
      'User has appreciated humor in prior interactions'
    ),
    'when_not_to_use', jsonb_build_array(
      'Upset or distressed user',
      'Serious issue, incident, or crisis mode',
      'Safety, legal, health, finance, or compliance matters',
      'Formal communication preference',
      'Risk of sounding dismissive',
      'Organization disabled playful or bell moments'
    ),
    'memory_principle',
      'Harmless humor preferences only — light humor, Self Love phrases, fox/bell refs, warm playful comms. Never sensitive PII as humor memory.',
    'self_love_examples', jsonb_build_array(
      'You handled a demanding stretch well — that counts.',
      'Small steps forward still move the week.',
      'A little lightness is allowed here.',
      'Progress deserves acknowledgment, not pressure.',
      'Recovery and rest are part of the work.'
    ),
    'abos_connection',
      'Playful moments never reduce trust — prioritize helpfulness, trust, respect, inclusion, clarity, and timing.',
    'final_principle',
      'Know when to be serious and when to offer a smile. Ring-ding, fox, bell — then back to business.',
    'fox_exchange', jsonb_build_object(
      'user_says', 'What does the fox say?',
      'aipify_responds', 'Ring-ding-ding-ding-dingeringeding 🦊',
      'follow_up', 'A playful moment — ready when you are to continue.'
    )
  );
$$;

create or replace function public._per_sanitize_recurring_jokes(p_jokes jsonb)
returns jsonb language plpgsql immutable as $$
declare
  v_result jsonb := '[]'::jsonb;
  v_item jsonb;
  v_key text;
begin
  if p_jokes is null or jsonb_typeof(p_jokes) <> 'array' then
    return '[]'::jsonb;
  end if;
  for v_item in select value from jsonb_array_elements(p_jokes) loop
    v_key := lower(trim(coalesce(v_item->>'key', '')));
    if v_key in ('fox', 'friday_energy') then
      v_result := v_result || jsonb_build_array(
        jsonb_build_object(
          'key', v_key,
          'enabled', coalesce((v_item->>'enabled')::boolean, true)
        )
      );
    end if;
  end loop;
  return v_result;
end; $$;

create or replace function public._per_is_playful_allowed(
  p_tenant_id uuid,
  p_context text,
  p_settings public.personality_settings
)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if not coalesce(p_settings.playful_moments_enabled, true) then return false; end if;
  if not coalesce(p_settings.humor_enabled, true) then return false; end if;
  if public._per_is_crisis_context(p_tenant_id) then return false; end if;
  if p_context in (
    'security_incident', 'crisis_mode', 'compliance_investigation', 'legal_matter',
    'hr_serious', 'emotional_distress', 'incident_response', 'upset_user',
    'health', 'finance', 'legal', 'safety'
  ) then return false; end if;
  if p_settings.personality_mode = 'professional' then
    return p_context in ('celebration', 'milestone', 'task_complete', 'small_win');
  end if;
  return true;
end; $$;

-- ---------------------------------------------------------------------------
-- 3. get_playful_bell_moment
-- ---------------------------------------------------------------------------
create or replace function public.get_playful_bell_moment(p_context text default 'task_complete')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.personality_settings;
  v_context text;
  v_moment jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return null; end if;

  v_settings := public._per_ensure_settings(v_tenant_id);
  if not coalesce(v_settings.bell_moments_enabled, true) then return null; end if;

  v_context := lower(trim(coalesce(p_context, 'task_complete')));
  if v_context = 'milestone' then v_context := 'celebration'; end if;

  if not public._per_is_playful_allowed(v_tenant_id, v_context, v_settings) then
    return null;
  end if;

  if not public._per_is_humor_allowed(v_tenant_id, case
    when v_context in ('task_complete', 'small_win') then 'task_complete'
    when v_context = 'self_love' then 'positive_reinforcement'
    when v_context in ('fox_spoken', 'friday_energy') then 'greeting'
    else 'celebration'
  end, v_settings) then
    return null;
  end if;

  select elem into v_moment
  from jsonb_array_elements(public._per_playful_moments_seed_json()->'bell_personality_moments') elem
  where elem->>'context' = v_context
  limit 1;

  if v_moment is null then
    select elem into v_moment
    from jsonb_array_elements(public._per_playful_moments_seed_json()->'bell_personality_moments') elem
    where elem->>'context' = 'task_complete'
    limit 1;
  end if;

  if v_moment is null then return null; end if;

  return jsonb_build_object(
    'context', v_context,
    'emoji', v_moment->>'emoji',
    'text', v_moment->>'text',
    'signature', 'bell',
    'metadata_only', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. update_personality_settings (preserve + extend)
-- ---------------------------------------------------------------------------
create or replace function public.update_personality_settings(p_settings jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.personality_settings;
begin
  v_tenant_id := public._per_require_tenant();

  update public.personality_settings set
    personality_mode = coalesce(p_settings->>'personality_mode', personality_mode),
    humor_enabled = coalesce((p_settings->>'humor_enabled')::boolean, humor_enabled),
    emoji_enabled = coalesce((p_settings->>'emoji_enabled')::boolean, emoji_enabled),
    playful_moments_enabled = coalesce((p_settings->>'playful_moments_enabled')::boolean, playful_moments_enabled),
    bell_moments_enabled = coalesce((p_settings->>'bell_moments_enabled')::boolean, bell_moments_enabled),
    recurring_jokes = case
      when p_settings ? 'recurring_jokes' then public._per_sanitize_recurring_jokes(p_settings->'recurring_jokes')
      else recurring_jokes
    end,
    playful_memory_prefs = case
      when p_settings ? 'playful_memory_prefs' then coalesce(p_settings->'playful_memory_prefs', '{}'::jsonb)
      else playful_memory_prefs
    end,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_row;

  if v_row.id is null then
    v_row := public._per_ensure_settings(v_tenant_id);
    update public.personality_settings set
      personality_mode = coalesce(p_settings->>'personality_mode', personality_mode),
      humor_enabled = coalesce((p_settings->>'humor_enabled')::boolean, humor_enabled),
      emoji_enabled = coalesce((p_settings->>'emoji_enabled')::boolean, emoji_enabled),
      playful_moments_enabled = coalesce((p_settings->>'playful_moments_enabled')::boolean, playful_moments_enabled),
      bell_moments_enabled = coalesce((p_settings->>'bell_moments_enabled')::boolean, bell_moments_enabled),
      recurring_jokes = case
        when p_settings ? 'recurring_jokes' then public._per_sanitize_recurring_jokes(p_settings->'recurring_jokes')
        else recurring_jokes
      end,
      playful_memory_prefs = case
        when p_settings ? 'playful_memory_prefs' then coalesce(p_settings->'playful_memory_prefs', '{}'::jsonb)
        else playful_memory_prefs
      end,
      updated_at = now()
    where tenant_id = v_tenant_id returning * into v_row;
  end if;

  perform public._per_log_audit(v_tenant_id, 'settings_updated', 'Personality settings updated',
    jsonb_build_object(
      'mode', v_row.personality_mode,
      'playful_moments_enabled', v_row.playful_moments_enabled,
      'bell_moments_enabled', v_row.bell_moments_enabled
    ));

  return jsonb_build_object(
    'personality_mode', v_row.personality_mode,
    'humor_enabled', v_row.humor_enabled,
    'emoji_enabled', v_row.emoji_enabled,
    'playful_moments_enabled', v_row.playful_moments_enabled,
    'bell_moments_enabled', v_row.bell_moments_enabled,
    'recurring_jokes', v_row.recurring_jokes,
    'playful_memory_prefs', v_row.playful_memory_prefs,
    'golden_rule', 'Aipify is a business companion. Not a stand-up comedian.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. get_personality_card (preserve ABOS alignment + playful seed)
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
    'mission', 'Authentic connection through style adaptation, harmless humor recognition, and natural interactions.',
    'abos_principle', 'Professionalism and personality coexist. Competent first. Human second. Funny third.',
    'vision', 'Remember how people prefer to communicate; respect humanity; offer a shared smile during a difficult day.',
    'default_mode', 'warm_professional',
    'playful_moments_seed', public._per_playful_moments_seed_json(),
    'distinction_note', 'ABOS Humor & Personal Connection at /app/personality — distinct from Identity Engine (Phase 34), Companion Presence (A.67), Brand Identity & Personhood, and Proactive Companion (A.79). Playful Moments & Bell Personality Seed extends this layer — not a new engine.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. get_personality_dashboard (preserve ABOS alignment + playful seed)
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
    'playful_moments_seed', public._per_playful_moments_seed_json(),
    'example_messages', v_examples,
    'integrations', jsonb_build_object(
      'desktop_companion', 'Learning tips, milestones, and warm greetings',
      'human_success', 'Celebrations and champion recognition',
      'knowledge_center', 'Contextual article recommendations',
      'assistant_identity', 'Tone alignment with communication preferences',
      'continuity', 'Humor automatically suppressed during Incident Mode',
      'companion_presence', 'Bell signature for positive playful presence moments',
      'pame', 'Harmless humor preference metadata only — never sensitive PII'
    ),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Assistant Identity (Phase 34)', 'route', '/app/assistant/identity', 'description', 'Per-user communication style observations — complements tenant personality modes.'),
      jsonb_build_object('label', 'Human Success', 'route', '/app/human-success', 'description', 'Celebrations, adoption journeys, and champion recognition.'),
      jsonb_build_object('label', 'Continuity & Crisis', 'route', '/app/continuity', 'description', 'Incident Mode automatically suppresses humor and playful moments.'),
      jsonb_build_object('label', 'Self Love', 'route', '/app/self-love', 'description', 'Progress celebration and demanding-day lightness.'),
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
    'distinction_note', 'ABOS Humor & Personal Connection at /app/personality — NOT Identity Engine (Phase 34), Companion Presence (A.67), Brand Identity & Personhood, or Proactive Companion (A.79). Playful Moments & Bell Personality Seed extends this layer.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_playful_bell_moment(text) to authenticated;
