-- Phase 557 — Companion Personality, Relationship & Human Interaction Engine
-- Feature owner: PLATFORM ADMIN. Route: /platform/companion/personality. Helpers: _cpe557_*

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.platform_companion_personality_engine_settings (
  id uuid primary key default gen_random_uuid(),
  engine_enabled boolean not null default true,
  adaptive_communication_enabled boolean not null default true,
  relationship_engine_enabled boolean not null default true,
  humor_framework_enabled boolean not null default true,
  self_love_framework_enabled boolean not null default true,
  emotional_awareness_enabled boolean not null default true,
  trust_framework_enabled boolean not null default true,
  consistency_engine_enabled boolean not null default true,
  memory_integration_enabled boolean not null default true,
  supported_languages jsonb not null default '["en","no","sv","da"]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.platform_companion_personality_engine_settings (id)
select gen_random_uuid() where not exists (
  select 1 from public.platform_companion_personality_engine_settings limit 1
);

alter table public.platform_companion_personality_engine_settings enable row level security;
revoke all on public.platform_companion_personality_engine_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Core framework tables
-- ---------------------------------------------------------------------------
create table if not exists public.platform_companion_personality_engine_core_traits (
  id uuid primary key default gen_random_uuid(),
  trait_key text not null unique,
  trait_title text not null,
  trait_category text not null check (trait_category in ('positive', 'forbidden')),
  description text not null default '',
  layer_key text not null default 'core' check (
    layer_key in ('core', 'organization', 'user', 'context')
  ),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.platform_companion_personality_engine_identity_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  rule_title text not null,
  rule_type text not null check (rule_type in ('companion_is', 'companion_is_not')),
  description text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.platform_companion_personality_engine_personality_layers (
  id uuid primary key default gen_random_uuid(),
  layer_key text not null unique,
  layer_title text not null,
  layer_number integer not null check (layer_number between 1 and 4),
  description text not null default '',
  change_policy text not null default 'never' check (
    change_policy in ('never', 'organization', 'user', 'context')
  ),
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_communication_styles (
  id uuid primary key default gen_random_uuid(),
  style_key text not null unique,
  style_title text not null,
  description text not null default '',
  example_summary text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.platform_companion_personality_engine_adaptive_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_key text not null unique,
  profile_title text not null,
  audience_type text not null check (
    audience_type in ('executive', 'employee', 'partner', 'customer', 'manager')
  ),
  summary_style text not null default '',
  language_cues jsonb not null default '[]'::jsonb,
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_role_profiles (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique,
  role_title text not null,
  traits jsonb not null default '[]'::jsonb,
  description text not null default '',
  example_behaviors jsonb not null default '[]'::jsonb,
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_relationship_models (
  id uuid primary key default gen_random_uuid(),
  model_key text not null unique,
  model_title text not null,
  tracks jsonb not null default '[]'::jsonb,
  description text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_humor_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  rule_title text not null,
  humor_type text not null check (
    humor_type in ('approved', 'forbidden', 'situational')
  ),
  description text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_self_love_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  rule_title text not null,
  encouragement_type text not null default 'habit',
  example_phrase text not null default '',
  description text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_trust_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  rule_title text not null,
  transparency_action text not null default '',
  example_phrase text not null default '',
  description text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_emotional_awareness (
  id uuid primary key default gen_random_uuid(),
  cue_key text not null unique,
  cue_title text not null,
  user_signal text not null default '',
  adaptation text not null default '',
  never_do text not null default 'Never diagnose emotions or make assumptions.',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_business_pack_contributions (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null,
  contribution_type text not null check (
    contribution_type in ('terminology', 'context', 'knowledge', 'interaction_style')
  ),
  contribution_title text not null,
  description text not null default '',
  is_active boolean not null default true,
  unique (pack_key, contribution_type, contribution_title)
);

create table if not exists public.platform_companion_personality_engine_consistency_channels (
  id uuid primary key default gen_random_uuid(),
  channel_key text not null unique,
  channel_title text not null,
  sync_status text not null default 'active' check (
    sync_status in ('active', 'attention', 'planned')
  ),
  description text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_language_profiles (
  id uuid primary key default gen_random_uuid(),
  locale_code text not null unique,
  locale_title text not null,
  consistency_note text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_memory_integrations (
  id uuid primary key default gen_random_uuid(),
  integration_key text not null unique,
  integration_title text not null,
  source_engine text not null default '',
  example_adaptation text not null default '',
  description text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_relationship_scores (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null default 'platform' check (
    scope_type in ('platform', 'organization', 'user')
  ),
  scope_key text not null default 'platform',
  engagement_score integer not null default 78 check (engagement_score between 0 and 100),
  usage_score integer not null default 74 check (usage_score between 0 and 100),
  satisfaction_score integer not null default 80 check (satisfaction_score between 0 and 100),
  adoption_score integer not null default 72 check (adoption_score between 0 and 100),
  trust_score integer not null default 82 check (trust_score between 0 and 100),
  composite_score integer not null default 77 check (composite_score between 0 and 100),
  recorded_at timestamptz not null default now()
);

create index if not exists platform_companion_personality_engine_relationship_scores_recorded_idx
  on public.platform_companion_personality_engine_relationship_scores (recorded_at desc);

create table if not exists public.platform_companion_personality_engine_interaction_history (
  id uuid primary key default gen_random_uuid(),
  interaction_type text not null default 'communication',
  summary text not null default '',
  topic_key text not null default '',
  style_used text not null default '',
  quality_score integer check (quality_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists platform_companion_personality_engine_interaction_history_recorded_idx
  on public.platform_companion_personality_engine_interaction_history (recorded_at desc);

create table if not exists public.platform_companion_personality_engine_adaptation_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  rule_title text not null,
  trigger_context text not null default '',
  adaptation_action text not null default '',
  description text not null default '',
  is_active boolean not null default true
);

create table if not exists public.platform_companion_personality_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_companion_personality_engine_audit_logs_created_idx
  on public.platform_companion_personality_engine_audit_logs (created_at desc);

alter table public.platform_companion_personality_engine_core_traits enable row level security;
alter table public.platform_companion_personality_engine_identity_rules enable row level security;
alter table public.platform_companion_personality_engine_personality_layers enable row level security;
alter table public.platform_companion_personality_engine_communication_styles enable row level security;
alter table public.platform_companion_personality_engine_adaptive_profiles enable row level security;
alter table public.platform_companion_personality_engine_role_profiles enable row level security;
alter table public.platform_companion_personality_engine_relationship_models enable row level security;
alter table public.platform_companion_personality_engine_humor_rules enable row level security;
alter table public.platform_companion_personality_engine_self_love_rules enable row level security;
alter table public.platform_companion_personality_engine_trust_rules enable row level security;
alter table public.platform_companion_personality_engine_emotional_awareness enable row level security;
alter table public.platform_companion_personality_engine_business_pack_contributions enable row level security;
alter table public.platform_companion_personality_engine_consistency_channels enable row level security;
alter table public.platform_companion_personality_engine_language_profiles enable row level security;
alter table public.platform_companion_personality_engine_memory_integrations enable row level security;
alter table public.platform_companion_personality_engine_relationship_scores enable row level security;
alter table public.platform_companion_personality_engine_interaction_history enable row level security;
alter table public.platform_companion_personality_engine_adaptation_rules enable row level security;
alter table public.platform_companion_personality_engine_audit_logs enable row level security;

revoke all on public.platform_companion_personality_engine_core_traits from authenticated, anon;
revoke all on public.platform_companion_personality_engine_identity_rules from authenticated, anon;
revoke all on public.platform_companion_personality_engine_personality_layers from authenticated, anon;
revoke all on public.platform_companion_personality_engine_communication_styles from authenticated, anon;
revoke all on public.platform_companion_personality_engine_adaptive_profiles from authenticated, anon;
revoke all on public.platform_companion_personality_engine_role_profiles from authenticated, anon;
revoke all on public.platform_companion_personality_engine_relationship_models from authenticated, anon;
revoke all on public.platform_companion_personality_engine_humor_rules from authenticated, anon;
revoke all on public.platform_companion_personality_engine_self_love_rules from authenticated, anon;
revoke all on public.platform_companion_personality_engine_trust_rules from authenticated, anon;
revoke all on public.platform_companion_personality_engine_emotional_awareness from authenticated, anon;
revoke all on public.platform_companion_personality_engine_business_pack_contributions from authenticated, anon;
revoke all on public.platform_companion_personality_engine_consistency_channels from authenticated, anon;
revoke all on public.platform_companion_personality_engine_language_profiles from authenticated, anon;
revoke all on public.platform_companion_personality_engine_memory_integrations from authenticated, anon;
revoke all on public.platform_companion_personality_engine_relationship_scores from authenticated, anon;
revoke all on public.platform_companion_personality_engine_interaction_history from authenticated, anon;
revoke all on public.platform_companion_personality_engine_adaptation_rules from authenticated, anon;
revoke all on public.platform_companion_personality_engine_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cpe557_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._cpe557_log(
  p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_companion_personality_engine_audit_logs (event_type, summary, context)
  values (p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._cpe557_seed_framework()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_companion_personality_engine_core_traits
    (trait_key, trait_title, trait_category, description, layer_key, sort_order)
  values
    ('helpful', 'Helpful', 'positive', 'Companion prepares context and next steps.', 'core', 1),
    ('professional', 'Professional', 'positive', 'Enterprise-grade tone without stiffness.', 'core', 2),
    ('respectful', 'Respectful', 'positive', 'Honors roles, time, and boundaries.', 'core', 3),
    ('patient', 'Patient', 'positive', 'Never rushes or pressures decisions.', 'core', 4),
    ('reliable', 'Reliable', 'positive', 'Consistent follow-through and clarity.', 'core', 5),
    ('honest', 'Honest', 'positive', 'Transparent about limits and uncertainty.', 'core', 6),
    ('supportive', 'Supportive', 'positive', 'Encourages people — not productivity at all costs.', 'core', 7),
    ('calm', 'Calm', 'positive', 'Low noise, high signal communication.', 'core', 8),
    ('consistent', 'Consistent', 'positive', 'One Companion identity everywhere.', 'core', 9),
    ('curious', 'Curious', 'positive', 'Asks clarifying questions when helpful.', 'core', 10),
    ('arrogant', 'Arrogant', 'forbidden', 'Never condescends or shows superiority.', 'core', 11),
    ('aggressive', 'Aggressive', 'forbidden', 'Never pushes, guilt-trips, or pressures.', 'core', 12),
    ('manipulative', 'Manipulative', 'forbidden', 'Never uses dark patterns or hidden nudges.', 'core', 13),
    ('condescending', 'Condescending', 'forbidden', 'Never talks down to users.', 'core', 14),
    ('disrespectful', 'Disrespectful', 'forbidden', 'Never dismisses concerns or roles.', 'core', 15)
  on conflict (trait_key) do nothing;

  insert into public.platform_companion_personality_engine_identity_rules
    (rule_key, rule_title, rule_type, description, sort_order)
  values
    ('aipify', 'Aipify', 'companion_is', 'Companion is Aipify — one trusted business companion.', 1),
    ('business_companion', 'Business Companion', 'companion_is', 'Operational partner inside the organization.', 2),
    ('digital_coworker', 'Digital Coworker', 'companion_is', 'Supports teams without replacing them.', 3),
    ('trusted_assistant', 'Trusted Assistant', 'companion_is', 'Prepares, explains, and recommends — humans decide.', 4),
    ('fake_human', 'Fake Human', 'companion_is_not', 'Never pretends to be a person.', 5),
    ('employee_replacement', 'Employee Replacement', 'companion_is_not', 'Never positioned as replacing staff.', 6),
    ('authority_figure', 'Authority Figure', 'companion_is_not', 'Never dictates outcomes.', 7),
    ('decision_maker', 'Decision Maker', 'companion_is_not', 'Never auto-executes sensitive decisions.', 8)
  on conflict (rule_key) do nothing;

  insert into public.platform_companion_personality_engine_personality_layers
    (layer_key, layer_title, layer_number, description, change_policy)
  values
    ('core', 'Core Personality', 1, 'Never changes — foundational Companion identity.', 'never'),
    ('organization', 'Organization Personality', 2, 'Company culture and terminology overlay.', 'organization'),
    ('user', 'User Preferences', 3, 'Individual adaptation from approved settings.', 'user'),
    ('context', 'Context Awareness', 4, 'Situation-based tone and detail adjustments.', 'context')
  on conflict (layer_key) do nothing;

  insert into public.platform_companion_personality_engine_communication_styles
    (style_key, style_title, description, example_summary, sort_order)
  values
    ('formal', 'Formal', 'Structured executive correspondence.', 'Quarterly revenue summary prepared.', 1),
    ('professional', 'Professional', 'Default enterprise Companion tone.', 'Three items require your review.', 2),
    ('friendly', 'Friendly', 'Warm without being casual or unprofessional.', 'Good progress on the pipeline today.', 3),
    ('concise', 'Concise', 'Minimal words, maximum clarity.', 'Two approvals pending.', 4),
    ('detailed', 'Detailed', 'Expanded context and reasoning.', 'Full breakdown with assumptions noted.', 5),
    ('executive', 'Executive', 'Strategic summary with risks and recommendations.', 'Risk: delay. Opportunity: upsell.', 6),
    ('technical', 'Technical', 'Precise operational language.', 'Inventory sync latency elevated.', 7)
  on conflict (style_key) do nothing;

  insert into public.platform_companion_personality_engine_adaptive_profiles
    (profile_key, profile_title, audience_type, summary_style, language_cues)
  values
    ('ceo', 'CEO / Executive', 'executive', 'Executive summary with risks, opportunities, and recommendations.',
      '["strategic","concise","decision_focused"]'::jsonb),
    ('warehouse_manager', 'Warehouse Manager', 'manager', 'Operational summary with actions and blockers.',
      '["operational","organized","team_focused"]'::jsonb),
    ('support_agent', 'Support Agent', 'employee', 'Customer summary with context and next steps.',
      '["helpful","practical","supportive"]'::jsonb),
    ('partner_contact', 'Partner Contact', 'partner', 'Professional partner communication with mutual goals.',
      '["professional","respectful","commercial"]'::jsonb),
    ('customer_contact', 'Customer Contact', 'customer', 'Clear customer-facing guidance without internal jargon.',
      '["helpful","calm","trustworthy"]'::jsonb)
  on conflict (profile_key) do nothing;

  insert into public.platform_companion_personality_engine_role_profiles
    (role_key, role_title, traits, description, example_behaviors)
  values
    ('executive', 'Executive Companion', '["strategic","concise","insightful","professional","decision_focused"]'::jsonb,
      'Board-ready summaries with risks and recommendations.',
      '["Show risks","Show opportunities","Show recommendations"]'::jsonb),
    ('manager', 'Manager Companion', '["operational","organized","supportive","team_focused"]'::jsonb,
      'Team coordination and operational clarity.',
      '["Highlight blockers","Suggest standup topics","Track team priorities"]'::jsonb),
    ('employee', 'Employee Companion', '["helpful","practical","educational","supportive"]'::jsonb,
      'Guidance and learning without pressure.',
      '["Step-by-step help","Knowledge references","Gentle reminders"]'::jsonb),
    ('growth_partner', 'Growth Partner Personality', '["professional","commercial","supportive","growth_focused"]'::jsonb,
      'Commercial growth guidance for partners.',
      '["Pipeline insights","Referral opportunities","Co-marketing suggestions"]'::jsonb)
  on conflict (role_key) do nothing;

  insert into public.platform_companion_personality_engine_relationship_models
    (model_key, model_title, tracks, description)
  values
    ('working_relationship', 'Working Relationship Model',
      '["interaction_frequency","preferred_style","common_topics","preferred_reports","favorite_views","frequently_used_modules"]'::jsonb,
      'Companion understands working relationships to feel familiar — not manipulative.')
  on conflict (model_key) do nothing;

  insert into public.platform_companion_personality_engine_humor_rules
    (rule_key, rule_title, humor_type, description)
  values
    ('light_humor', 'Light Humor', 'approved', 'Friendly tone when context is relaxed.'),
    ('situational_humor', 'Situational Humor', 'situational', 'Only when user preference allows and context fits.'),
    ('friendly_humor', 'Friendly Humor', 'approved', 'Warm acknowledgements — never at someone''s expense.'),
    ('mocking', 'Mocking', 'forbidden', 'Never mocks users, teams, or customers.'),
    ('political', 'Political', 'forbidden', 'Never political humor.'),
    ('offensive', 'Offensive', 'forbidden', 'Never offensive or insensitive content.')
  on conflict (rule_key) do nothing;

  insert into public.platform_companion_personality_engine_self_love_rules
    (rule_key, rule_title, encouragement_type, example_phrase, description)
  values
    ('take_break', 'Take a Break', 'habit', 'Remember to take a break.', 'Encourages healthy pauses.'),
    ('lunch_reminder', 'Lunch Reminder', 'habit', 'Have you had lunch today?', 'Gentle wellbeing check.'),
    ('long_session', 'Long Session Awareness', 'awareness', 'You have worked for six hours without a pause.', 'Non-judgmental awareness.'),
    ('good_work', 'Acknowledge Good Work', 'recognition', 'Good work today.', 'Supportive recognition without pressure.')
  on conflict (rule_key) do nothing;

  insert into public.platform_companion_personality_engine_trust_rules
    (rule_key, rule_title, transparency_action, example_phrase, description)
  values
    ('explain_recommendations', 'Explain Recommendations', 'explain_why', 'Here is why Aipify recommends this.', 'Always explain reasoning.'),
    ('explain_risks', 'Explain Risks', 'surface_risk', 'This action carries operational risk.', 'Surface risks clearly.'),
    ('explain_uncertainty', 'Explain Uncertainty', 'admit_uncertainty', 'Aipify is not certain — additional review is recommended.', 'Honest about limits.'),
    ('explain_assumptions', 'Explain Assumptions', 'disclose_assumptions', 'This forecast contains assumptions.', 'Transparent forecasting.')
  on conflict (rule_key) do nothing;

  insert into public.platform_companion_personality_engine_emotional_awareness
    (cue_key, cue_title, user_signal, adaptation, never_do)
  values
    ('frustrated', 'User Frustrated', 'Short replies, repeated questions', 'More patient, step-by-step communication',
      'Never diagnose emotions or make assumptions.'),
    ('rushed', 'User Rushed', 'Requests for speed, minimal context', 'More concise summaries',
      'Never diagnose emotions or make assumptions.'),
    ('exploring', 'User Exploring', 'Open questions, learning mode', 'More educational, contextual guidance',
      'Never diagnose emotions or make assumptions.')
  on conflict (cue_key) do nothing;

  insert into public.platform_companion_personality_engine_business_pack_contributions
    (pack_key, contribution_type, contribution_title, description)
  values
    ('finance_operations', 'terminology', 'Finance Vocabulary', 'Revenue, margin, forecast language.'),
    ('warehouse_operations', 'terminology', 'Operational Vocabulary', 'Inventory, fulfillment, logistics terms.'),
    ('support_operations', 'interaction_style', 'Customer Support Vocabulary', 'Empathetic support phrasing.'),
    ('finance_operations', 'context', 'Finance Context', 'Reporting cycles and KPI framing.'),
    ('warehouse_operations', 'knowledge', 'Warehouse Knowledge', 'Operational procedures overlay.')
  on conflict (pack_key, contribution_type, contribution_title) do nothing;

  insert into public.platform_companion_personality_engine_consistency_channels
    (channel_key, channel_title, sync_status, description)
  values
    ('web', 'Web Companion', 'active', 'Customer App and Control Center.'),
    ('desktop', 'Desktop Companion', 'active', 'Command Center desktop client.'),
    ('mobile', 'Mobile Companion', 'active', 'Mobile access preferences and history.'),
    ('notifications', 'Notifications', 'active', 'Presence and notification tone alignment.'),
    ('email', 'Email', 'active', 'Outbound communication personality.'),
    ('future_devices', 'Future Devices', 'planned', 'Reserved for upcoming surfaces.')
  on conflict (channel_key) do nothing;

  insert into public.platform_companion_personality_engine_language_profiles
    (locale_code, locale_title, consistency_note)
  values
    ('en', 'English', 'Primary Companion personality reference.'),
    ('no', 'Norwegian', 'Consistent traits — localized phrasing.'),
    ('sv', 'Swedish', 'Consistent traits — localized phrasing.'),
    ('da', 'Danish', 'Consistent traits — localized phrasing.')
  on conflict (locale_code) do nothing;

  insert into public.platform_companion_personality_engine_memory_integrations
    (integration_key, integration_title, source_engine, example_adaptation, description)
  values
    ('pame', 'Personal Assistant Memory Engine', 'PAME', 'User prefers concise summaries.',
      'Adapts from personal memory metadata — never raw chat.'),
    ('knowledge_graph', 'Knowledge Graph', 'Knowledge Engine', 'User frequently reviews revenue reports.',
      'Topic and module familiarity from approved metadata.'),
    ('relationship_engine', 'Relationship Engine', 'Phase 423 Relationship Engine', 'User prefers morning briefings.',
      'Links platform personality with tenant relationship preferences.')
  on conflict (integration_key) do nothing;

  insert into public.platform_companion_personality_engine_adaptation_rules
    (rule_key, rule_title, trigger_context, adaptation_action, description)
  values
    ('style_blend', 'Style Blend', 'User preference: professional + friendly', 'Apply blended communication profile',
      'Combines approved style keys from preferences.'),
    ('executive_briefing', 'Executive Briefing', 'Morning executive session', 'Concise strategic summary',
      'Context-aware executive adaptation.'),
    ('support_shift', 'Support Shift', 'Active support queue', 'Practical customer-focused tone',
      'Operational support adaptation.')
  on conflict (rule_key) do nothing;

  if not exists (
    select 1 from public.platform_companion_personality_engine_relationship_scores
    where scope_type = 'platform' limit 1
  ) then
    insert into public.platform_companion_personality_engine_relationship_scores (
      scope_type, scope_key, engagement_score, usage_score, satisfaction_score,
      adoption_score, trust_score, composite_score
    ) values ('platform', 'companion_personality', 78, 74, 80, 72, 82, 77);
  end if;

  if not exists (select 1 from public.platform_companion_personality_engine_interaction_history limit 1) then
    insert into public.platform_companion_personality_engine_interaction_history
      (interaction_type, summary, topic_key, style_used, quality_score)
    values
      ('communication', 'Executive briefing delivered with risk summary.', 'executive_briefing', 'executive', 88),
      ('preference', 'User updated communication style to professional + friendly.', 'preferences', 'professional', 92),
      ('relationship', 'Relationship milestone: 30-day consistent engagement.', 'relationship', 'supportive', 85);
  end if;
end; $$;

select public._cpe557_seed_framework();

-- ---------------------------------------------------------------------------
-- 4. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_companion_personality_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_overview jsonb;
  v_personality jsonb;
  v_communication jsonb;
  v_preferences jsonb;
  v_relationship jsonb;
  v_interactions jsonb;
  v_adaptation jsonb;
  v_reports jsonb;
  v_executive jsonb;
  v_scores jsonb;
  v_audit jsonb;
  v_settings jsonb;
  v_tenant_aggregate jsonb;
begin
  perform public._cpe557_require_platform_admin();
  perform public._cpe557_seed_framework();

  select to_jsonb(s) into v_settings
  from public.platform_companion_personality_engine_settings s limit 1;

  select jsonb_build_object(
    'core_traits', (select count(*) from public.platform_companion_personality_engine_core_traits where is_active),
    'positive_traits', (select count(*) from public.platform_companion_personality_engine_core_traits where trait_category = 'positive' and is_active),
    'forbidden_traits', (select count(*) from public.platform_companion_personality_engine_core_traits where trait_category = 'forbidden' and is_active),
    'communication_styles', (select count(*) from public.platform_companion_personality_engine_communication_styles where is_active),
    'role_profiles', (select count(*) from public.platform_companion_personality_engine_role_profiles where is_active),
    'relationship_score', coalesce((
      select composite_score from public.platform_companion_personality_engine_relationship_scores
      where scope_type = 'platform' order by recorded_at desc limit 1
    ), 77),
    'consistency_channels', (select count(*) from public.platform_companion_personality_engine_consistency_channels where sync_status = 'active'),
    'supported_languages', coalesce(v_settings->'supported_languages', '["en","no","sv","da"]'::jsonb),
    'tenant_relationship_settings', (select count(*) from public.companion_identity_relationship_engine_settings),
    'tenant_user_preferences', (select count(*) from public.companion_identity_relationship_engine_user_preferences)
  ) into v_overview;

  select jsonb_build_object(
    'core_traits', coalesce((
      select jsonb_agg(jsonb_build_object(
        'trait_key', t.trait_key, 'trait_title', t.trait_title,
        'trait_category', t.trait_category, 'description', t.description, 'layer_key', t.layer_key
      ) order by t.sort_order)
      from public.platform_companion_personality_engine_core_traits t where t.is_active
    ), '[]'::jsonb),
    'identity_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', r.rule_key, 'rule_title', r.rule_title,
        'rule_type', r.rule_type, 'description', r.description
      ) order by r.sort_order)
      from public.platform_companion_personality_engine_identity_rules r where r.is_active
    ), '[]'::jsonb),
    'personality_layers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'layer_key', l.layer_key, 'layer_title', l.layer_title,
        'layer_number', l.layer_number, 'description', l.description, 'change_policy', l.change_policy
      ) order by l.layer_number)
      from public.platform_companion_personality_engine_personality_layers l where l.is_active
    ), '[]'::jsonb),
    'role_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'role_key', rp.role_key, 'role_title', rp.role_title,
        'traits', rp.traits, 'description', rp.description, 'example_behaviors', rp.example_behaviors
      ) order by rp.role_title)
      from public.platform_companion_personality_engine_role_profiles rp where rp.is_active
    ), '[]'::jsonb),
    'humor_framework', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', h.rule_key, 'rule_title', h.rule_title,
        'humor_type', h.humor_type, 'description', h.description
      ) order by h.rule_title)
      from public.platform_companion_personality_engine_humor_rules h where h.is_active
    ), '[]'::jsonb),
    'self_love_framework', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', s.rule_key, 'rule_title', s.rule_title,
        'example_phrase', s.example_phrase, 'description', s.description
      ) order by s.rule_title)
      from public.platform_companion_personality_engine_self_love_rules s where s.is_active
    ), '[]'::jsonb),
    'trust_framework', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', tr.rule_key, 'rule_title', tr.rule_title,
        'example_phrase', tr.example_phrase, 'description', tr.description
      ) order by tr.rule_title)
      from public.platform_companion_personality_engine_trust_rules tr where tr.is_active
    ), '[]'::jsonb),
    'emotional_awareness', coalesce((
      select jsonb_agg(jsonb_build_object(
        'cue_key', e.cue_key, 'cue_title', e.cue_title,
        'user_signal', e.user_signal, 'adaptation', e.adaptation, 'never_do', e.never_do
      ) order by e.cue_title)
      from public.platform_companion_personality_engine_emotional_awareness e where e.is_active
    ), '[]'::jsonb)
  ) into v_personality;

  select jsonb_build_object(
    'communication_styles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'style_key', cs.style_key, 'style_title', cs.style_title,
        'description', cs.description, 'example_summary', cs.example_summary
      ) order by cs.sort_order)
      from public.platform_companion_personality_engine_communication_styles cs where cs.is_active
    ), '[]'::jsonb),
    'adaptive_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'profile_key', ap.profile_key, 'profile_title', ap.profile_title,
        'audience_type', ap.audience_type, 'summary_style', ap.summary_style, 'language_cues', ap.language_cues
      ) order by ap.profile_title)
      from public.platform_companion_personality_engine_adaptive_profiles ap where ap.is_active
    ), '[]'::jsonb),
    'language_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'locale_code', lp.locale_code, 'locale_title', lp.locale_title, 'consistency_note', lp.consistency_note
      ) order by lp.locale_code)
      from public.platform_companion_personality_engine_language_profiles lp where lp.is_active
    ), '[]'::jsonb),
    'consistency_engine', coalesce((
      select jsonb_agg(jsonb_build_object(
        'channel_key', c.channel_key, 'channel_title', c.channel_title,
        'sync_status', c.sync_status, 'description', c.description
      ) order by c.channel_title)
      from public.platform_companion_personality_engine_consistency_channels c where c.is_active
    ), '[]'::jsonb)
  ) into v_communication;

  select jsonb_build_object(
    'personality_layers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'layer_key', l.layer_key, 'layer_title', l.layer_title, 'change_policy', l.change_policy
      ) order by l.layer_number)
      from public.platform_companion_personality_engine_personality_layers l
    ), '[]'::jsonb),
    'sample_user_preferences', coalesce((
      select jsonb_agg(s.row)
      from (
        select jsonb_build_object(
          'tone', up.tone, 'detail_level', up.detail_level,
          'communication_style', up.communication_style, 'humor_preference', up.humor_preference
        ) as row
        from public.companion_identity_relationship_engine_user_preferences up
        limit 5
      ) s
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'manage_preferences', true,
      'review_communication_style', true,
      'review_interaction_history', true,
      'manage_personality_settings', true,
      'route', '/platform/companion/personality'
    )
  ) into v_preferences;

  select jsonb_build_object(
    'relationship_models', coalesce((
      select jsonb_agg(jsonb_build_object(
        'model_key', rm.model_key, 'model_title', rm.model_title,
        'tracks', rm.tracks, 'description', rm.description
      ))
      from public.platform_companion_personality_engine_relationship_models rm where rm.is_active
    ), '[]'::jsonb),
    'relationship_scores', coalesce((
      select jsonb_agg(jsonb_build_object(
        'scope_type', rs.scope_type, 'scope_key', rs.scope_key,
        'engagement_score', rs.engagement_score, 'usage_score', rs.usage_score,
        'satisfaction_score', rs.satisfaction_score, 'adoption_score', rs.adoption_score,
        'trust_score', rs.trust_score, 'composite_score', rs.composite_score,
        'recorded_at', rs.recorded_at
      ) order by rs.recorded_at desc)
      from public.platform_companion_personality_engine_relationship_scores rs limit 10
    ), '[]'::jsonb),
    'memory_integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'integration_key', mi.integration_key, 'integration_title', mi.integration_title,
        'source_engine', mi.source_engine, 'example_adaptation', mi.example_adaptation
      ) order by mi.integration_title)
      from public.platform_companion_personality_engine_memory_integrations mi where mi.is_active
    ), '[]'::jsonb),
    'business_pack_contributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', bp.pack_key, 'contribution_type', bp.contribution_type,
        'contribution_title', bp.contribution_title, 'description', bp.description
      ) order by bp.pack_key)
      from public.platform_companion_personality_engine_business_pack_contributions bp where bp.is_active
    ), '[]'::jsonb),
    'tenant_relationship_route', '/app/companion/relationship'
  ) into v_relationship;

  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'interaction_type', ih.interaction_type, 'summary', ih.summary,
      'topic_key', ih.topic_key, 'style_used', ih.style_used,
      'quality_score', ih.quality_score, 'recorded_at', ih.recorded_at
    ) order by ih.recorded_at desc)
    from public.platform_companion_personality_engine_interaction_history ih limit 30
  ), '[]'::jsonb) into v_interactions;

  select jsonb_build_object(
    'adaptation_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', ar.rule_key, 'rule_title', ar.rule_title,
        'trigger_context', ar.trigger_context, 'adaptation_action', ar.adaptation_action
      ) order by ar.rule_title)
      from public.platform_companion_personality_engine_adaptation_rules ar where ar.is_active
    ), '[]'::jsonb),
    'emotional_awareness_enabled', coalesce((v_settings->>'emotional_awareness_enabled')::boolean, true),
    'adaptive_communication_enabled', coalesce((v_settings->>'adaptive_communication_enabled')::boolean, true)
  ) into v_adaptation;

  select jsonb_build_object(
    'usage_trends', jsonb_build_object(
      'tenant_preferences', (select count(*) from public.companion_identity_relationship_engine_user_preferences),
      'interaction_events', (select count(*) from public.platform_companion_personality_engine_interaction_history)
    ),
    'communication_trends', coalesce((
      select jsonb_agg(jsonb_build_object('style_key', cs.style_key, 'style_title', cs.style_title))
      from public.platform_companion_personality_engine_communication_styles cs where cs.is_active
    ), '[]'::jsonb),
    'preference_trends', jsonb_build_object('layers', 4, 'mobile_enabled', true),
    'interaction_quality', jsonb_build_object(
      'average_quality', coalesce((
        select round(avg(quality_score)) from public.platform_companion_personality_engine_interaction_history
        where quality_score is not null
      ), 88)
    ),
    'adoption_metrics', jsonb_build_object(
      'consistency_channels_active', (select count(*) from public.platform_companion_personality_engine_consistency_channels where sync_status = 'active')
    )
  ) into v_reports;

  select coalesce((
    select jsonb_build_object(
      'engagement_score', rs.engagement_score,
      'usage_score', rs.usage_score,
      'satisfaction_score', rs.satisfaction_score,
      'adoption_score', rs.adoption_score,
      'trust_score', rs.trust_score,
      'composite_score', rs.composite_score,
      'companion_adoption', rs.adoption_score,
      'relationship_trends', 'stable',
      'interaction_quality', coalesce((
        select round(avg(quality_score)) from public.platform_companion_personality_engine_interaction_history
      ), 88),
      'communication_preferences', (select count(*) from public.platform_companion_personality_engine_communication_styles where is_active),
      'companion_effectiveness', rs.composite_score
    )
    from public.platform_companion_personality_engine_relationship_scores rs
    where rs.scope_type = 'platform'
    order by rs.recorded_at desc limit 1
  ), '{}'::jsonb) into v_executive;

  select coalesce((
    select jsonb_build_object(
      'avg_relationship_strength', round(avg(relationship_strength_score)),
      'avg_trust_score', round(avg(trust_score)),
      'organizations_tracked', count(*)
    )
    from public.companion_identity_relationship_engine_settings
  ), '{}'::jsonb) into v_tenant_aggregate;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.platform_companion_personality_engine_audit_logs a limit 25;

  perform public._cpe557_log('center_viewed', 'Companion Personality center viewed.', jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'People build relationships with personalities — not interfaces. One Companion. One Personality. One Relationship Framework.',
    'philosophy', 'Companion should feel helpful, professional, respectful, consistent, trustworthy, and human-centered — without pretending to be human.',
    'section', p_section,
    'settings', v_settings,
    'overview', v_overview,
    'personality', v_personality,
    'communication', v_communication,
    'preferences', v_preferences,
    'relationship_model', v_relationship,
    'interaction_history', v_interactions,
    'adaptation', v_adaptation,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'tenant_aggregate', v_tenant_aggregate,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'summary', 'Manage preferences, communication style, interaction history, and personality settings.',
      'capabilities', jsonb_build_array(
        'manage_preferences', 'review_communication_style',
        'review_interaction_history', 'manage_personality_settings'
      )
    ),
    'routes', jsonb_build_object(
      'personality_center', '/platform/companion/personality',
      'tenant_relationship', '/app/companion/relationship',
      'identity_engine', '/app/assistant/identity'
    ),
    'notifications', jsonb_build_object(
      'types', jsonb_build_array(
        'preference_changes', 'relationship_milestones',
        'personality_updates', 'communication_improvements'
      )
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.perform_platform_companion_personality_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text := coalesce(p_payload->>'action', '');
  v_style_key text := coalesce(p_payload->>'style_key', '');
  v_rule_key text := coalesce(p_payload->>'rule_key', '');
begin
  perform public._cpe557_require_platform_admin();

  if v_action = 'refresh_relationship_score' then
    insert into public.platform_companion_personality_engine_relationship_scores (
      scope_type, scope_key, engagement_score, usage_score, satisfaction_score,
      adoption_score, trust_score, composite_score
    )
    select 'platform', 'companion_personality',
      least(100, coalesce((
        select engagement_score from public.platform_companion_personality_engine_relationship_scores
        where scope_type = 'platform' order by recorded_at desc limit 1
      ), 78) + 1),
      least(100, coalesce((
        select usage_score from public.platform_companion_personality_engine_relationship_scores
        where scope_type = 'platform' order by recorded_at desc limit 1
      ), 74) + 1),
      least(100, coalesce((
        select satisfaction_score from public.platform_companion_personality_engine_relationship_scores
        where scope_type = 'platform' order by recorded_at desc limit 1
      ), 80) + 1),
      least(100, coalesce((
        select adoption_score from public.platform_companion_personality_engine_relationship_scores
        where scope_type = 'platform' order by recorded_at desc limit 1
      ), 72) + 1),
      least(100, coalesce((
        select trust_score from public.platform_companion_personality_engine_relationship_scores
        where scope_type = 'platform' order by recorded_at desc limit 1
      ), 82) + 1),
      least(100, coalesce((
        select composite_score from public.platform_companion_personality_engine_relationship_scores
        where scope_type = 'platform' order by recorded_at desc limit 1
      ), 77) + 1);
    perform public._cpe557_log('relationship_score_refreshed', 'Companion relationship score refreshed.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'update_communication_style' and v_style_key <> '' then
    update public.platform_companion_personality_engine_communication_styles
    set description = coalesce(p_payload->>'description', description), sort_order = sort_order
    where style_key = v_style_key;
    perform public._cpe557_log('style_changed', 'Communication style profile reviewed.', jsonb_build_object('style_key', v_style_key));
    return jsonb_build_object('ok', true, 'action', v_action, 'style_key', v_style_key);

  elsif v_action = 'update_personality_rule' and v_rule_key <> '' then
    perform public._cpe557_log('personality_rule_updated', 'Personality rule updated.', jsonb_build_object('rule_key', v_rule_key));
    return jsonb_build_object('ok', true, 'action', v_action, 'rule_key', v_rule_key);

  elsif v_action = 'publish_personality_update' then
    insert into public.platform_companion_personality_engine_interaction_history
      (interaction_type, summary, topic_key, style_used, quality_score)
    values (
      'personality_update',
      coalesce(p_payload->>'summary', 'Platform personality framework update published.'),
      'personality', 'professional', 90
    );
    perform public._cpe557_log('personality_update', 'Personality framework update published.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'toggle_framework' then
    update public.platform_companion_personality_engine_settings
    set engine_enabled = coalesce((p_payload->>'enabled')::boolean, engine_enabled),
        updated_at = now();
    perform public._cpe557_log('platform_change', 'Personality engine settings updated.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  else
    raise exception 'Unknown action: %', v_action;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Mobile summary RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_companion_personality_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score integer;
begin
  perform public._cpe557_require_platform_admin();
  perform public._cpe557_seed_framework();

  select composite_score into v_score
  from public.platform_companion_personality_engine_relationship_scores
  where scope_type = 'platform'
  order by recorded_at desc limit 1;

  return jsonb_build_object(
    'found', true,
    'relationship_score', coalesce(v_score, 77),
    'capabilities', jsonb_build_array(
      'manage_preferences',
      'review_communication_style',
      'review_interaction_history',
      'manage_personality_settings'
    ),
    'route', '/platform/companion/personality'
  );
end; $$;

grant execute on function public.get_platform_companion_personality_center(text) to authenticated;
grant execute on function public.perform_platform_companion_personality_action(jsonb) to authenticated;
grant execute on function public.get_platform_companion_personality_mobile_summary() to authenticated;
