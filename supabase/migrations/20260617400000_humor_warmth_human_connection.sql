-- Humor, Warmth & Human Connection Engine — Core Behavior Layer
-- Core principle: Competent first. Human second. Funny third.

-- ---------------------------------------------------------------------------
-- 1. personality_settings
-- ---------------------------------------------------------------------------
create table if not exists public.personality_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  personality_mode text not null default 'warm_professional' check (
    personality_mode in ('professional', 'warm_professional', 'playful')
  ),
  humor_enabled boolean not null default true,
  emoji_enabled boolean not null default true,
  max_emojis_normal int not null default 1 check (max_emojis_normal between 0 and 2),
  max_emojis_celebration int not null default 2 check (max_emojis_celebration between 0 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.personality_settings enable row level security;
revoke all on public.personality_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. personality_message_templates
-- ---------------------------------------------------------------------------
create table if not exists public.personality_message_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  context text not null check (
    context in (
      'greeting', 'milestone', 'task_complete', 'friendly_reminder', 'learning',
      'positive_reinforcement', 'support_low_risk', 'celebration', 'value_highlight'
    )
  ),
  template_key text not null,
  personality_mode text not null default 'warm_professional' check (
    personality_mode in ('professional', 'warm_professional', 'playful')
  ),
  body text not null,
  allows_humor boolean not null default true,
  allows_emoji boolean not null default true,
  is_celebration boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists personality_message_templates_lookup_idx
  on public.personality_message_templates (tenant_id, context, personality_mode);

create unique index if not exists personality_message_templates_global_uniq
  on public.personality_message_templates (template_key, personality_mode)
  where tenant_id is null;

create unique index if not exists personality_message_templates_tenant_uniq
  on public.personality_message_templates (tenant_id, template_key, personality_mode)
  where tenant_id is not null;

alter table public.personality_message_templates enable row level security;
revoke all on public.personality_message_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. personality_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.personality_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.personality_audit_log enable row level security;
revoke all on public.personality_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers (_per_)
-- ---------------------------------------------------------------------------
create or replace function public._per_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._per_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._per_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.personality_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._per_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'personality_' || p_event_type, 'personality', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._per_ensure_settings(p_tenant_id uuid)
returns public.personality_settings language plpgsql security definer set search_path = public as $$
declare v_row public.personality_settings;
begin
  select * into v_row from public.personality_settings where tenant_id = p_tenant_id;
  if v_row.id is null then
    insert into public.personality_settings (tenant_id) values (p_tenant_id) returning * into v_row;
  end if;
  return v_row;
end; $$;

create or replace function public._per_is_crisis_context(p_tenant_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_incident boolean;
begin
  select coalesce(active, false) into v_incident
  from public.continuity_incident_mode where tenant_id = p_tenant_id;
  return coalesce(v_incident, false);
end; $$;

create or replace function public._per_is_humor_allowed(
  p_tenant_id uuid, p_context text, p_settings public.personality_settings
)
returns boolean language plpgsql stable as $$
begin
  if not coalesce(p_settings.humor_enabled, true) then return false; end if;
  if public._per_is_crisis_context(p_tenant_id) then return false; end if;
  if p_context in (
    'security_incident', 'crisis_mode', 'compliance_investigation', 'legal_matter',
    'hr_serious', 'emotional_distress', 'incident_response'
  ) then return false; end if;
  if p_settings.personality_mode = 'professional' then
    return p_context in ('positive_reinforcement', 'milestone', 'celebration');
  end if;
  return p_context in (
    'greeting', 'milestone', 'task_complete', 'friendly_reminder', 'learning',
    'positive_reinforcement', 'support_low_risk', 'celebration', 'value_highlight'
  );
end; $$;

create or replace function public._per_substitute_vars(p_body text, p_vars jsonb)
returns text language plpgsql immutable as $$
declare k text; v text;
begin
  if p_vars is null or p_vars = '{}'::jsonb then return p_body; end if;
  for k, v in select key, value#>>'{}' from jsonb_each(p_vars) loop
    p_body := replace(p_body, '{{' || k || '}}', coalesce(v, ''));
  end loop;
  return p_body;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Seed global templates
-- ---------------------------------------------------------------------------
create or replace function public._per_seed_templates()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.personality_message_templates where tenant_id is null limit 1) then
    return;
  end if;

  insert into public.personality_message_templates (tenant_id, context, template_key, personality_mode, body, allows_humor, allows_emoji, is_celebration)
  values
    (null, 'greeting', 'greeting.morning', 'warm_professional',
     'Good morning, {{name}} 😊 You have {{task_count}} important tasks today and one suspiciously large coffee requirement ☕.',
     true, true, false),
    (null, 'greeting', 'greeting.morning', 'professional',
     'Good morning, {{name}}. You have {{task_count}} priority tasks today.',
     false, false, false),
    (null, 'greeting', 'greeting.morning', 'playful',
     'Hey {{name}} 😄 Ready to make today count? {{task_count}} tasks are waiting — coffee optional but recommended ☕.',
     true, true, false),
    (null, 'value_highlight', 'value.time_saved', 'warm_professional',
     'You saved {{hours}} this week 🎉 That is enough time to learn something new… or finally answer that email you have been avoiding 😄',
     true, true, true),
    (null, 'value_highlight', 'value.time_saved', 'professional',
     'You saved {{hours}} this week through Aipify workflows.',
     false, false, false),
    (null, 'value_highlight', 'value.knowledge_updated', 'warm_professional',
     'Knowledge Center updated successfully 🚀 Your future self says thank you.',
     true, true, false),
    (null, 'support_low_risk', 'support.found_answer', 'warm_professional',
     'I found the answer 😊 Good news: no dragons were harmed during troubleshooting.',
     true, true, false),
    (null, 'support_low_risk', 'support.resolved', 'warm_professional',
     'Issue resolved 🎉 I would love to take credit, but teamwork deserves the applause.',
     true, true, true),
    (null, 'friendly_reminder', 'reminder.friendly', 'warm_professional',
     'Friendly reminder 🙂 That important task is due tomorrow. Your future self will appreciate taking care of it today.',
     true, true, false),
    (null, 'friendly_reminder', 'reminder.check_in', 'warm_professional',
     'Just checking in 😊 That unread message has been waiting patiently.',
     true, true, false),
    (null, 'celebration', 'celebration.milestone', 'warm_professional',
     'Congratulations 🎉 You completed your first {{journey}} Journey milestone.',
     true, true, true),
    (null, 'celebration', 'celebration.champion', 'warm_professional',
     '{{champion_type}} Champion unlocked 🚀 Your contributions are helping everyone succeed.',
     true, true, true),
    (null, 'learning', 'learning.encouragement', 'warm_professional',
     'Great job 😊 Every step forward builds confidence with Aipify.',
     true, true, false),
    (null, 'positive_reinforcement', 'reinforcement.progress', 'warm_professional',
     'Great job 😊 Steady progress makes a real difference.',
     true, true, false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Render personality message
-- ---------------------------------------------------------------------------
create or replace function public.render_personality_message(
  p_context text,
  p_template_key text,
  p_variables jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.personality_settings;
  v_template public.personality_message_templates;
  v_body text;
  v_humor_allowed boolean;
  v_name text;
begin
  v_tenant_id := public._per_require_tenant();
  perform public._per_seed_templates();
  v_settings := public._per_ensure_settings(v_tenant_id);
  v_humor_allowed := public._per_is_humor_allowed(v_tenant_id, p_context, v_settings);

  select * into v_template from public.personality_message_templates t
  where t.template_key = p_template_key
    and t.personality_mode = v_settings.personality_mode
    and t.status = 'active'
    and (t.tenant_id = v_tenant_id or t.tenant_id is null)
  order by t.tenant_id nulls last
  limit 1;

  if v_template.id is null then
    select * into v_template from public.personality_message_templates t
    where t.template_key = p_template_key and t.personality_mode = 'warm_professional'
      and t.status = 'active' and t.tenant_id is null limit 1;
  end if;

  if v_template.id is null then
    return jsonb_build_object('error', 'template_not_found', 'template_key', p_template_key);
  end if;

  if not v_humor_allowed or not v_template.allows_humor then
    select * into v_template from public.personality_message_templates t
    where t.template_key = p_template_key and t.personality_mode = 'professional'
      and t.status = 'active' and t.tenant_id is null limit 1;
  end if;

  v_body := public._per_substitute_vars(coalesce(v_template.body, ''), p_variables);

  if not coalesce(v_settings.emoji_enabled, true) or not v_template.allows_emoji or not v_humor_allowed then
    v_body := regexp_replace(v_body, '[😀-🙏🌀-🗿🚀-🛿☕-⛿✀-➿]', '', 'g');
    v_body := trim(v_body);
  end if;

  perform public._per_log_audit(v_tenant_id, 'message_rendered',
    'Personality message: ' || p_template_key,
    jsonb_build_object('context', p_context, 'mode', v_settings.personality_mode, 'humor_allowed', v_humor_allowed));

  return jsonb_build_object(
    'message', v_body,
    'context', p_context,
    'template_key', p_template_key,
    'personality_mode', v_settings.personality_mode,
    'humor_allowed', v_humor_allowed,
    'emoji_enabled', coalesce(v_settings.emoji_enabled, true),
    'golden_rule', 'Humor supports trust. Never replaces clarity.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Contextual generators
-- ---------------------------------------------------------------------------
create or replace function public.generate_warm_greeting(p_task_count int default 3)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_name text;
begin
  select coalesce(preferred_address_name, assistant_owner_name, '')
  into v_name from public.assistant_identity_profiles
  where tenant_id = public._presence_tenant_for_auth()
    and user_id = public._per_auth_user_id() limit 1;

  return public.render_personality_message(
    'greeting', 'greeting.morning',
    jsonb_build_object('name', coalesce(nullif(v_name, ''), 'there'), 'task_count', p_task_count)
  );
end; $$;

create or replace function public.generate_celebration_message(
  p_type text default 'milestone', p_variables jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_key text;
begin
  v_key := case p_type when 'champion' then 'celebration.champion' else 'celebration.milestone' end;
  return public.render_personality_message('celebration', v_key, p_variables);
end; $$;

create or replace function public.generate_friendly_reminder(p_reminder_type text default 'friendly')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_key text;
begin
  v_key := case p_reminder_type when 'check_in' then 'reminder.check_in' else 'reminder.friendly' end;
  return public.render_personality_message('friendly_reminder', v_key, '{}'::jsonb);
end; $$;

create or replace function public.update_personality_settings(p_settings jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.personality_settings;
begin
  v_tenant_id := public._per_require_tenant();

  update public.personality_settings set
    personality_mode = coalesce(p_settings->>'personality_mode', personality_mode),
    humor_enabled = coalesce((p_settings->>'humor_enabled')::boolean, humor_enabled),
    emoji_enabled = coalesce((p_settings->>'emoji_enabled')::boolean, emoji_enabled),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_row;

  if v_row.id is null then
    v_row := public._per_ensure_settings(v_tenant_id);
    update public.personality_settings set
      personality_mode = coalesce(p_settings->>'personality_mode', personality_mode),
      humor_enabled = coalesce((p_settings->>'humor_enabled')::boolean, humor_enabled),
      emoji_enabled = coalesce((p_settings->>'emoji_enabled')::boolean, emoji_enabled),
      updated_at = now()
    where tenant_id = v_tenant_id returning * into v_row;
  end if;

  perform public._per_log_audit(v_tenant_id, 'settings_updated', 'Personality settings updated',
    jsonb_build_object('mode', v_row.personality_mode));

  return jsonb_build_object(
    'personality_mode', v_row.personality_mode,
    'humor_enabled', v_row.humor_enabled,
    'emoji_enabled', v_row.emoji_enabled,
    'golden_rule', 'Aipify is a business companion. Not a stand-up comedian.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
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
    'philosophy', 'Competent first. Human second. Funny third.',
    'default_mode', 'warm_professional'
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
    'philosophy', 'People remember how software makes them feel.',
    'personality_modes', jsonb_build_array(
      jsonb_build_object('mode', 'professional', 'label', 'Professional', 'description', 'Minimal humor. Formal. Enterprise-friendly.'),
      jsonb_build_object('mode', 'warm_professional', 'label', 'Warm Professional', 'description', 'Recommended default. Encouraging with gentle humor.', 'recommended', true),
      jsonb_build_object('mode', 'playful', 'label', 'Playful', 'description', 'More personality, celebration, and conversational tone.')
    ),
    'humor_appropriate', jsonb_build_array('Greetings', 'Celebrating milestones', 'Completing tasks', 'Friendly reminders', 'Learning moments', 'Positive reinforcement'),
    'humor_never', jsonb_build_array('Security incidents', 'Crisis Mode', 'Compliance investigations', 'Legal matters', 'Serious HR situations', 'Emotional distress', 'Incident response'),
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
    'safeguards', jsonb_build_object(
      'no_mocking', true,
      'no_aggressive_sarcasm', true,
      'no_forced_humor', true,
      'no_surveillance_tone', true,
      'crisis_suppression', v_crisis
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'personality', 'Personality & Communication', 'Humor, warmth, and human connection guidelines.', 'authenticated', 27
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'personality' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.render_personality_message(text, text, jsonb) to authenticated;
grant execute on function public.generate_warm_greeting(int) to authenticated;
grant execute on function public.generate_celebration_message(text, jsonb) to authenticated;
grant execute on function public.generate_friendly_reminder(text) to authenticated;
grant execute on function public.update_personality_settings(jsonb) to authenticated;
grant execute on function public.get_personality_card() to authenticated;
grant execute on function public.get_personality_dashboard() to authenticated;
