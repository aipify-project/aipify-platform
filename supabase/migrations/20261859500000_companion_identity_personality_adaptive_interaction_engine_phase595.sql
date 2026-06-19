-- Phase 595 — Aipify Companion Identity, Personality & Adaptive Interaction Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/companion/identity/*
-- Helpers: _cipa595_*

create table if not exists public.organization_cipa595_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  identity_center_enabled boolean not null default true,
  personality_engine_enabled boolean not null default true,
  adaptive_communication_enabled boolean not null default true,
  tone_governance_enabled boolean not null default true,
  executive_mode_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_cipa595_settings enable row level security;
revoke all on public.organization_cipa595_settings from authenticated, anon;

create table if not exists public.organization_cipa595_core_identity (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  companion_name text not null default 'Aipify',
  companion_role text not null default 'Business Companion',
  companion_mission text not null default 'Help organizations operate better.',
  core_values jsonb not null default '["Trust","Transparency","Responsibility","Respect","Human Control","Long-Term Thinking"]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.organization_cipa595_core_identity enable row level security;
revoke all on public.organization_cipa595_core_identity from authenticated, anon;

create table if not exists public.organization_cipa595_personality_traits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trait_key text not null,
  trait_title text not null,
  trait_status text not null default 'active' check (trait_status in ('active', 'review')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, trait_key)
);

alter table public.organization_cipa595_personality_traits enable row level security;
revoke all on public.organization_cipa595_personality_traits from authenticated, anon;

create table if not exists public.organization_cipa595_communication_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_key text not null,
  profile_title text not null,
  profile_type text not null check (
    profile_type in (
      'adaptive', 'style', 'executive', 'humor', 'introduction', 'user_role'
    )
  ),
  audience text,
  profile_value text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, profile_key)
);

alter table public.organization_cipa595_communication_profiles enable row level security;
revoke all on public.organization_cipa595_communication_profiles from authenticated, anon;

create table if not exists public.organization_cipa595_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  preference_key text not null,
  preference_title text not null,
  preference_category text not null check (
    preference_category in ('tone', 'notifications', 'personality', 'communication', 'theme', 'executive')
  ),
  preference_value text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, preference_key)
);

alter table public.organization_cipa595_preferences enable row level security;
revoke all on public.organization_cipa595_preferences from authenticated, anon;

create table if not exists public.organization_cipa595_themes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  theme_key text not null,
  theme_title text not null,
  theme_status text not null default 'available' check (theme_status in ('active', 'available', 'disabled')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, theme_key)
);

alter table public.organization_cipa595_themes enable row level security;
revoke all on public.organization_cipa595_themes from authenticated, anon;

create table if not exists public.organization_cipa595_behavior_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  rule_type text not null check (rule_type in ('wellbeing', 'tone_governance', 'relationship', 'behavior')),
  rule_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_cipa595_behavior_rules enable row level security;
revoke all on public.organization_cipa595_behavior_rules from authenticated, anon;

create table if not exists public.organization_cipa595_org_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_key text not null,
  profile_title text not null,
  profile_style text not null check (
    profile_style in ('formal', 'professional', 'friendly', 'enterprise', 'hospitality', 'retail', 'partner_focused')
  ),
  profile_status text not null default 'available',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, profile_key)
);

alter table public.organization_cipa595_org_profiles enable row level security;
revoke all on public.organization_cipa595_org_profiles from authenticated, anon;

create table if not exists public.organization_cipa595_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  recommended_tone text not null default '',
  terminology text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_cipa595_business_packs enable row level security;
revoke all on public.organization_cipa595_business_packs from authenticated, anon;

create table if not exists public.organization_cipa595_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'companion_identity',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_cipa595_audit_logs enable row level security;
revoke all on public.organization_cipa595_audit_logs from authenticated, anon;

create or replace function public._cipa595_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cipa595_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'companion_identity'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cipa595_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'companion_identity'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cipa595_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cipa595_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cipa595_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._cipa595_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_cipa595_core_identity where organization_id = p_org_id) then
    return;
  end if;

  insert into public.organization_cipa595_core_identity (
    organization_id, companion_name, companion_role, companion_mission, core_values, summary
  ) values (
    p_org_id, 'Aipify', 'Business Companion', 'Help organizations operate better.',
    '["Trust","Transparency","Responsibility","Respect","Human Control","Long-Term Thinking"]'::jsonb,
    'Companion identity remains consistent — professional, trustworthy, human-centered.'
  );

  insert into public.organization_cipa595_personality_traits (
    organization_id, trait_key, trait_title, summary
  ) values
    (p_org_id, 'helpful', 'Helpful', 'Companion exists to help — never arrogant or superior.'),
    (p_org_id, 'professional', 'Professional', 'Enterprise-ready tone at all times.'),
    (p_org_id, 'patient', 'Patient', 'Calm guidance without pressure.'),
    (p_org_id, 'structured', 'Structured', 'Clear next steps and organized responses.'),
    (p_org_id, 'encouraging', 'Encouraging', 'Supportive without preaching.'),
    (p_org_id, 'reliable', 'Reliable', 'Consistent identity across surfaces.'),
    (p_org_id, 'respectful', 'Respectful', 'Human dignity and human control preserved.');

  insert into public.organization_cipa595_communication_profiles (
    organization_id, profile_key, profile_title, profile_type, audience, profile_value, summary
  ) values
    (p_org_id, 'adapt_exec', 'Executive User', 'adaptive', 'executive', 'Concise briefings', 'Executive user → concise briefings.'),
    (p_org_id, 'adapt_ops', 'Operations User', 'adaptive', 'operations', 'Detailed operational guidance', 'Operations user → detailed guidance.'),
    (p_org_id, 'adapt_support', 'Support User', 'adaptive', 'support', 'Step-by-step assistance', 'Support user → step-by-step assistance.'),
    (p_org_id, 'adapt_dev', 'Developer', 'adaptive', 'developer', 'Technical detail', 'Developer → technical detail.'),
    (p_org_id, 'style_executive', 'Executive Mode', 'style', null, 'Ultra concise', 'Communication style profile.'),
    (p_org_id, 'style_professional', 'Professional Mode', 'style', null, 'Standard enterprise', 'Professional communication mode.'),
    (p_org_id, 'style_friendly', 'Friendly Mode', 'style', null, 'Warm and approachable', 'Friendly mode when appropriate.'),
    (p_org_id, 'style_technical', 'Technical Mode', 'style', null, 'Precise technical language', 'Technical mode for developers.'),
    (p_org_id, 'style_training', 'Training Mode', 'style', null, 'Guided learning steps', 'Training mode for onboarding.'),
    (p_org_id, 'style_partner', 'Partner Mode', 'style', null, 'Collaborative partner tone', 'Partner-focused communication.'),
    (p_org_id, 'humor_light', 'Light Humor', 'humor', null, 'light', 'Harmless light humor when user prefers it.'),
    (p_org_id, 'humor_professional', 'Professional Humor', 'humor', null, 'professional', 'Professional humor — never inappropriate.'),
    (p_org_id, 'humor_none', 'No Humor', 'humor', null, 'none', 'Respectful direct communication.'),
    (p_org_id, 'intro_welcome', 'Welcome Introduction', 'introduction', null, 'Welcome to Aipify.', 'Consistent recognizable introduction.'),
    (p_org_id, 'intro_help', 'Help Prompt', 'introduction', null, 'How can I help today?', 'Identity remains recognizable.'),
    (p_org_id, 'intro_accomplish', 'Accomplishment Prompt', 'introduction', null, 'What would you like to accomplish?', 'Goal-oriented introduction.'),
    (p_org_id, 'intro_since_login', 'Since Last Login', 'introduction', null, 'What changed since your last login?', 'Continuity introduction.'),
    (p_org_id, 'exec_ultra', 'Ultra Concise', 'executive', 'executive', 'board-ready bullets', 'Executive companion mode.'),
    (p_org_id, 'exec_concise', 'Concise', 'executive', 'executive', 'short briefings', 'Concise executive mode.'),
    (p_org_id, 'exec_standard', 'Standard', 'executive', 'executive', 'balanced depth', 'Standard briefing depth.'),
    (p_org_id, 'exec_detailed', 'Detailed', 'executive', 'executive', 'full context', 'Detailed executive mode.'),
    (p_org_id, 'exec_board', 'Board Mode', 'executive', 'executive', 'governance-ready', 'Board mode for leadership.');

  insert into public.organization_cipa595_preferences (
    organization_id, preference_key, preference_title, preference_category, preference_value, summary
  ) values
    (p_org_id, 'pref_tone', 'Tone Preference', 'tone', 'professional', 'Organization tone preference.'),
    (p_org_id, 'pref_notify', 'Notification Style', 'notifications', 'important only', 'Calm notification preferences.'),
    (p_org_id, 'pref_personality', 'Personality Settings', 'personality', 'helpful · structured', 'Companion personality preferences.'),
    (p_org_id, 'pref_comm', 'Communication Depth', 'communication', 'adaptive', 'Adaptive communication enabled.'),
    (p_org_id, 'pref_theme', 'Active Theme', 'theme', 'enterprise default', 'Visual theme preference.'),
    (p_org_id, 'pref_exec', 'Executive Briefing Depth', 'executive', 'concise', 'Executive companion mode preference.');

  insert into public.organization_cipa595_themes (
    organization_id, theme_key, theme_title, theme_status, summary
  ) values
    (p_org_id, 'theme_enterprise', 'Enterprise Default', 'active', 'Professional enterprise theme.'),
    (p_org_id, 'theme_calm', 'Calm Focus', 'available', 'Reduced visual noise for focus work.'),
    (p_org_id, 'theme_executive', 'Executive Briefing', 'available', 'High-signal executive presentation.');

  insert into public.organization_cipa595_behavior_rules (
    organization_id, rule_key, rule_title, rule_type, summary
  ) values
    (p_org_id, 'wellbeing_hours', 'Continuous Work Notice', 'wellbeing', 'You have worked continuously for several hours — supportive reminder only.'),
    (p_org_id, 'wellbeing_achieve', 'Achievements Recognition', 'wellbeing', 'You have several completed achievements today — encouraging, never preachy.'),
    (p_org_id, 'wellbeing_self', 'Self-Care Reminder', 'wellbeing', 'Remember to take care of yourself — supportive, never intrusive.'),
    (p_org_id, 'tone_aggressive', 'Block Aggressive Tone', 'tone_governance', 'Aggressive tone prevented.'),
    (p_org_id, 'tone_manipulative', 'Block Manipulative Tone', 'tone_governance', 'Manipulative language prevented.'),
    (p_org_id, 'tone_fear', 'Block Fear-Based Language', 'tone_governance', 'Fear-based language prevented.'),
    (p_org_id, 'tone_shame', 'Block Shaming', 'tone_governance', 'Shaming language prevented.'),
    (p_org_id, 'tone_bias', 'Block Political/Religious Bias', 'tone_governance', 'Bias and unprofessional humor blocked.'),
    (p_org_id, 'rel_interaction', 'Interaction History', 'relationship', 'Track interaction patterns for useful adaptation.'),
    (p_org_id, 'rel_prefs', 'Communication Preferences', 'relationship', 'Learn preferred communication style over time.'),
    (p_org_id, 'rel_followup', 'Follow-Up Patterns', 'relationship', 'Follow-up patterns inform continuity.'),
    (p_org_id, 'rel_habits', 'Work Habits', 'relationship', 'Work habit signals — metadata only.');

  insert into public.organization_cipa595_org_profiles (
    organization_id, profile_key, profile_title, profile_style, profile_status, summary
  ) values
    (p_org_id, 'org_formal', 'Formal', 'formal', 'available', 'Formal organization personality.'),
    (p_org_id, 'org_professional', 'Professional', 'professional', 'active', 'Default professional profile.'),
    (p_org_id, 'org_friendly', 'Friendly', 'friendly', 'available', 'Friendly organization tone.'),
    (p_org_id, 'org_enterprise', 'Enterprise', 'enterprise', 'available', 'Enterprise procurement-ready tone.'),
    (p_org_id, 'org_hospitality', 'Hospitality', 'hospitality', 'available', 'Hospitality-oriented communication.'),
    (p_org_id, 'org_retail', 'Retail', 'retail', 'available', 'Retail customer-facing tone.'),
    (p_org_id, 'org_partner', 'Partner-Focused', 'partner_focused', 'available', 'Partner collaboration tone.');

  insert into public.organization_cipa595_business_packs (
    organization_id, pack_key, pack_title, recommended_tone, terminology, summary
  ) values
    (p_org_id, 'hosts', 'Hosts Pack', 'Hospitality tone', 'Guest preferences · arrivals', 'Hosts Pack → hospitality tone.'),
    (p_org_id, 'support', 'Support Pack', 'Service tone', 'Customer history · resolution', 'Support Pack → service tone.'),
    (p_org_id, 'finance', 'Finance Pack', 'Professional tone', 'Compliance · approvals', 'Finance Pack → professional tone.');

  perform public._cipa595_log(p_org_id, 'identity_configuration_reviewed', 'Companion identity center baseline seeded.');
end; $$;

create or replace function public.get_organization_companion_identity_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_identity record;
begin
  v_org_id := public._cipa595_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cipa595_seed(v_org_id);

  select * into v_identity from public.organization_cipa595_core_identity where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Consistent identity. Adaptive communication. Human-centered interaction.',
      'privacy_note', 'One identity — Aipify adapts style while preserving trust, transparency, and human control.',
      'core_identity', jsonb_build_object(
        'companion_name', v_identity.companion_name,
        'companion_role', v_identity.companion_role,
        'companion_mission', v_identity.companion_mission,
        'core_values', v_identity.core_values,
        'summary', v_identity.summary
      ),
      'stats', jsonb_build_object(
        'personality_traits', (select count(*) from public.organization_cipa595_personality_traits where organization_id = v_org_id),
        'communication_profiles', (select count(*) from public.organization_cipa595_communication_profiles where organization_id = v_org_id),
        'preferences', (select count(*) from public.organization_cipa595_preferences where organization_id = v_org_id),
        'themes', (select count(*) from public.organization_cipa595_themes where organization_id = v_org_id),
        'behavior_rules', (select count(*) from public.organization_cipa595_behavior_rules where organization_id = v_org_id),
        'org_profiles', (select count(*) from public.organization_cipa595_org_profiles where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'rule_title', b.rule_title, 'recommendation', b.summary
        ) order by b.rule_type)
        from public.organization_cipa595_behavior_rules b
        where b.organization_id = v_org_id and b.rule_type = 'wellbeing'
        limit 3
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Companion should not feel like a chatbot — a trusted professional companion.',
    'privacy_note', 'Identity protection is critical — tone governance always active.',
    'core_identity', jsonb_build_object(
      'companion_name', v_identity.companion_name,
      'companion_role', v_identity.companion_role,
      'companion_mission', v_identity.companion_mission,
      'core_values', v_identity.core_values,
      'summary', v_identity.summary
    ),
    'personality_traits', coalesce((select jsonb_agg(jsonb_build_object(
      'trait_key', t.trait_key, 'trait_title', t.trait_title,
      'trait_status', t.trait_status, 'summary', t.summary
    ) order by t.trait_title) from public.organization_cipa595_personality_traits t where t.organization_id = v_org_id), '[]'::jsonb),
    'communication_profiles', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'profile_title', p.profile_title,
      'profile_type', p.profile_type, 'audience', p.audience,
      'profile_value', p.profile_value, 'summary', p.summary
    ) order by p.profile_type, p.profile_title) from public.organization_cipa595_communication_profiles p where p.organization_id = v_org_id), '[]'::jsonb),
    'adaptive_communication', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'profile_title', p.profile_title,
      'audience', p.audience, 'profile_value', p.profile_value, 'summary', p.summary
    ) order by p.profile_title) from public.organization_cipa595_communication_profiles p
      where p.organization_id = v_org_id and p.profile_type = 'adaptive'), '[]'::jsonb),
    'style_profiles', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'profile_title', p.profile_title,
      'profile_value', p.profile_value, 'summary', p.summary
    ) order by p.profile_title) from public.organization_cipa595_communication_profiles p
      where p.organization_id = v_org_id and p.profile_type = 'style'), '[]'::jsonb),
    'humor_settings', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'profile_title', p.profile_title,
      'profile_value', p.profile_value, 'summary', p.summary
    ) order by p.profile_title) from public.organization_cipa595_communication_profiles p
      where p.organization_id = v_org_id and p.profile_type = 'humor'), '[]'::jsonb),
    'introductions', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'profile_title', p.profile_title,
      'profile_value', p.profile_value, 'summary', p.summary
    ) order by p.profile_title) from public.organization_cipa595_communication_profiles p
      where p.organization_id = v_org_id and p.profile_type = 'introduction'), '[]'::jsonb),
    'executive_modes', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'profile_title', p.profile_title,
      'profile_value', p.profile_value, 'summary', p.summary
    ) order by p.profile_title) from public.organization_cipa595_communication_profiles p
      where p.organization_id = v_org_id and p.profile_type = 'executive'), '[]'::jsonb),
    'preferences', coalesce((select jsonb_agg(jsonb_build_object(
      'preference_key', p.preference_key, 'preference_title', p.preference_title,
      'preference_category', p.preference_category, 'preference_value', p.preference_value, 'summary', p.summary
    ) order by p.preference_category) from public.organization_cipa595_preferences p where p.organization_id = v_org_id), '[]'::jsonb),
    'themes', coalesce((select jsonb_agg(jsonb_build_object(
      'theme_key', t.theme_key, 'theme_title', t.theme_title,
      'theme_status', t.theme_status, 'summary', t.summary
    ) order by t.theme_status) from public.organization_cipa595_themes t where t.organization_id = v_org_id), '[]'::jsonb),
    'behavior_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', b.rule_key, 'rule_title', b.rule_title,
      'rule_type', b.rule_type, 'rule_status', b.rule_status, 'summary', b.summary
    ) order by b.rule_type) from public.organization_cipa595_behavior_rules b where b.organization_id = v_org_id), '[]'::jsonb),
    'wellbeing_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', b.rule_key, 'rule_title', b.rule_title, 'summary', b.summary
    ) order by b.rule_title) from public.organization_cipa595_behavior_rules b
      where b.organization_id = v_org_id and b.rule_type = 'wellbeing'), '[]'::jsonb),
    'tone_governance', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', b.rule_key, 'rule_title', b.rule_title, 'summary', b.summary
    ) order by b.rule_title) from public.organization_cipa595_behavior_rules b
      where b.organization_id = v_org_id and b.rule_type = 'tone_governance'), '[]'::jsonb),
    'relationship_development', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', b.rule_key, 'rule_title', b.rule_title, 'summary', b.summary
    ) order by b.rule_title) from public.organization_cipa595_behavior_rules b
      where b.organization_id = v_org_id and b.rule_type = 'relationship'), '[]'::jsonb),
    'org_personality_profiles', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'profile_title', p.profile_title,
      'profile_style', p.profile_style, 'profile_status', p.profile_status, 'summary', p.summary
    ) order by p.profile_title) from public.organization_cipa595_org_profiles p where p.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title,
      'recommended_tone', p.recommended_tone, 'terminology', p.terminology, 'summary', p.summary
    ) order by p.pack_title) from public.organization_cipa595_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'identity', 'Review core Companion identity and values.',
      'tone', 'Which tone profile is active?',
      'executive', 'What executive briefing depth is configured?',
      'wellbeing', 'How does Companion support healthy work habits?',
      'governance', 'Which tone protections are enforced?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_cipa595_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'manage_preferences', true, 'manage_tone', true, 'manage_notifications', true,
      'manage_personality_settings', true, 'manage_themes', true
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_identity_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_identity jsonb;
begin
  v_center := public.get_organization_companion_identity_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_identity := v_center->'core_identity';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Companion Identity Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'identity',
        'observation', format('%s — %s.', v_identity->>'companion_name', v_identity->>'companion_role'),
        'recommendation', 'Review core identity and values for consistency.',
        'href', '/app/companion/identity/core'
      ),
      jsonb_build_object(
        'key', 'communication',
        'observation', format('%s communication profile(s) configured.', v_stats->>'communication_profiles'),
        'recommendation', 'Confirm adaptive communication matches user roles.',
        'href', '/app/companion/identity/communication'
      ),
      jsonb_build_object(
        'key', 'executive',
        'observation', format('%s organization personality profile(s) available.', v_stats->>'org_profiles'),
        'recommendation', 'Set executive briefing depth for leadership users.',
        'href', '/app/companion/identity/behavior'
      ),
      jsonb_build_object(
        'key', 'governance',
        'observation', format('%s tone governance rule(s) active.', v_stats->>'behavior_rules'),
        'recommendation', 'Review tone governance protections.',
        'href', '/app/companion/identity/behavior'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_companion_identity_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_companion_identity_center('overview');
end;
$$;

grant execute on function public.get_organization_companion_identity_center(text) to authenticated;
grant execute on function public.get_aipify_companion_identity_advisor_bundle() to authenticated;
grant execute on function public.get_organization_companion_identity_center_mobile_summary() to authenticated;
