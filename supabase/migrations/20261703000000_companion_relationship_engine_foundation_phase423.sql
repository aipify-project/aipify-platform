-- Phase 423 — Enterprise Identity, Personality & Companion Relationship Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/companion/relationship. Helpers: _gcri423_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.companion_identity_relationship_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  companion_name text not null default 'Aipify',
  companion_identity text not null default 'companion' check (
    companion_identity in ('companion')
  ),
  relationship_mode text not null default 'adaptive' check (
    relationship_mode in ('observer', 'adaptive', 'personalized', 'enterprise')
  ),
  relationship_strength_score integer not null default 72 check (relationship_strength_score between 0 and 100),
  trust_score integer not null default 78 check (trust_score between 0 and 100),
  relationship_health_score integer not null default 80 check (relationship_health_score between 0 and 100),
  personalization_enabled boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companion_identity_relationship_engine_user_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  tone text not null default 'professional' check (
    tone in ('professional', 'friendly', 'supportive', 'encouraging', 'calm', 'confident', 'respectful', 'adaptive')
  ),
  detail_level text not null default 'balanced' check (detail_level in ('brief', 'balanced', 'detailed')),
  communication_style text not null default 'executive' check (
    communication_style in (
      'executive', 'employee', 'customer', 'partner', 'industry', 'regional', 'adaptive'
    )
  ),
  notification_style text not null default 'calm' check (
    notification_style in ('minimal', 'calm', 'standard', 'proactive')
  ),
  humor_preference text not null default 'subtle' check (
    humor_preference in ('none', 'subtle', 'light', 'warm')
  ),
  interaction_preference text not null default 'balanced' check (
    interaction_preference in ('minimal', 'balanced', 'engaged')
  ),
  companion_theme text not null default 'professional' check (
    companion_theme in ('professional', 'warm', 'executive', 'minimal')
  ),
  personalization_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists companion_identity_relationship_engine_user_preferences_tenant_idx
  on public.companion_identity_relationship_engine_user_preferences (tenant_id, user_id);

create table if not exists public.companion_identity_relationship_engine_personality_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  profile_key text not null,
  profile_title text not null,
  personality_type text not null check (
    personality_type in (
      'professional', 'friendly', 'supportive', 'encouraging', 'calm', 'confident', 'respectful', 'adaptive'
    )
  ),
  core_value text not null default '',
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_key)
);

create index if not exists companion_identity_relationship_engine_personality_profiles_tenant_idx
  on public.companion_identity_relationship_engine_personality_profiles (tenant_id, personality_type);

create table if not exists public.companion_identity_relationship_engine_communication_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  profile_key text not null,
  profile_title text not null,
  audience_type text not null check (
    audience_type in ('executive', 'employee', 'customer', 'partner', 'industry', 'regional')
  ),
  tone text not null default 'professional',
  detail_level text not null default 'balanced',
  summary text not null default '',
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_key)
);

create index if not exists companion_identity_relationship_engine_communication_profiles_tenant_idx
  on public.companion_identity_relationship_engine_communication_profiles (tenant_id, audience_type);

create table if not exists public.companion_identity_relationship_engine_memories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  memory_key text not null,
  memory_title text not null,
  memory_type text not null check (
    memory_type in ('preference', 'interaction', 'communication', 'learning', 'milestone')
  ),
  summary text not null default '',
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'removed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists companion_identity_relationship_engine_memories_tenant_idx
  on public.companion_identity_relationship_engine_memories (tenant_id, approval_status);

create table if not exists public.companion_identity_relationship_engine_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  milestone_key text not null,
  milestone_title text not null,
  milestone_type text not null check (
    milestone_type in (
      'first_interaction', 'first_success', 'major_achievement', 'organization_anniversary',
      'growth_milestone', 'companion_milestone'
    )
  ),
  achieved boolean not null default false,
  summary text not null default '',
  achieved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (tenant_id, milestone_key)
);

create index if not exists companion_identity_relationship_engine_milestones_tenant_idx
  on public.companion_identity_relationship_engine_milestones (tenant_id, milestone_type);

create table if not exists public.companion_identity_relationship_engine_trust_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (
    signal_type in (
      'consistency', 'reliability', 'accuracy', 'helpfulness', 'responsiveness', 'relationship_strength'
    )
  ),
  signal_title text not null,
  score integer not null default 75 check (score between 0 and 100),
  observation text not null default '',
  status text not null default 'active' check (status in ('active', 'improving', 'declining')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists companion_identity_relationship_engine_trust_signals_tenant_idx
  on public.companion_identity_relationship_engine_trust_signals (tenant_id, signal_type);

create table if not exists public.companion_identity_relationship_engine_interactions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  interaction_key text not null,
  interaction_type text not null check (
    interaction_type in ('briefing', 'notification', 'assistant', 'command_center', 'desktop', 'mobile', 'web')
  ),
  summary text not null default '',
  satisfaction_score integer check (satisfaction_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  unique (tenant_id, interaction_key)
);

create index if not exists companion_identity_relationship_engine_interactions_tenant_idx
  on public.companion_identity_relationship_engine_interactions (tenant_id, occurred_at desc);

create table if not exists public.companion_identity_relationship_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'preference_changed', 'milestone_occurred', 'trust_improved', 'engagement_increased', 'personalization_recommended'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists companion_identity_relationship_engine_intelligence_signals_tenant_idx
  on public.companion_identity_relationship_engine_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.companion_identity_relationship_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'update_preference', 'milestone_approaching', 'trust_increased', 'engagement_improved'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'low' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists companion_identity_relationship_engine_advisor_signals_tenant_idx
  on public.companion_identity_relationship_engine_advisor_signals (tenant_id, created_at desc);

create table if not exists public.companion_identity_relationship_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'preference_updated', 'communication_style_changed', 'milestone_reached', 'memory_approved',
      'memory_removed', 'trust_score_updated', 'companion_theme_changed', 'personalization_disabled',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists companion_identity_relationship_engine_audit_logs_tenant_idx
  on public.companion_identity_relationship_engine_audit_logs (tenant_id, created_at desc);

alter table public.companion_identity_relationship_engine_settings enable row level security;
alter table public.companion_identity_relationship_engine_user_preferences enable row level security;
alter table public.companion_identity_relationship_engine_personality_profiles enable row level security;
alter table public.companion_identity_relationship_engine_communication_profiles enable row level security;
alter table public.companion_identity_relationship_engine_memories enable row level security;
alter table public.companion_identity_relationship_engine_milestones enable row level security;
alter table public.companion_identity_relationship_engine_trust_signals enable row level security;
alter table public.companion_identity_relationship_engine_interactions enable row level security;
alter table public.companion_identity_relationship_engine_intelligence_signals enable row level security;
alter table public.companion_identity_relationship_engine_advisor_signals enable row level security;
alter table public.companion_identity_relationship_engine_audit_logs enable row level security;

revoke all on public.companion_identity_relationship_engine_settings from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_user_preferences from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_personality_profiles from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_communication_profiles from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_memories from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_milestones from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_trust_signals from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_interactions from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_intelligence_signals from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_advisor_signals from authenticated, anon;
revoke all on public.companion_identity_relationship_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'companion_relationship_engine', v.description
from (values
  ('companion_relationship.view', 'View Companion Relationship', 'View companion identity, personality, preferences, trust, and relationship history'),
  ('companion_relationship.manage', 'Manage Companion Relationship', 'Update preferences, approve memories, record milestones, and manage personalization')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gcri423_*
-- ---------------------------------------------------------------------------
create or replace function public._gcri423_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Companion Relationship requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan, 'user_id', auth.uid());
end; $$;

create or replace function public._gcri423_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.companion_identity_relationship_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gcri423_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.companion_identity_relationship_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.companion_identity_relationship_engine_settings;
begin
  insert into public.companion_identity_relationship_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.companion_identity_relationship_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._gcri423_ensure_user_preferences(p_tenant_id uuid, p_user_id uuid)
returns public.companion_identity_relationship_engine_user_preferences language plpgsql security definer set search_path = public as $$
declare v_row public.companion_identity_relationship_engine_user_preferences;
begin
  insert into public.companion_identity_relationship_engine_user_preferences (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.companion_identity_relationship_engine_user_preferences where tenant_id = p_tenant_id and user_id = p_user_id;
  end if;
  return v_row;
end; $$;

create or replace function public._gcri423_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.companion_identity_relationship_engine_personality_profiles where tenant_id = p_tenant_id limit 1) then
    insert into public.companion_identity_relationship_engine_personality_profiles (tenant_id, profile_key, profile_title, personality_type, core_value, description) values
      (p_tenant_id, 'PERS-PRO', 'Professional companion', 'professional', 'People First', 'Calm, competent, executive-ready communication.'),
      (p_tenant_id, 'PERS-SUP', 'Supportive companion', 'supportive', 'Wisdom Before Speed', 'Encouraging guidance without pressure.'),
      (p_tenant_id, 'PERS-ADP', 'Adaptive companion', 'adaptive', 'Trust Before Automation', 'Adjusts tone and detail to context and audience.');
  end if;
  if not exists (select 1 from public.companion_identity_relationship_engine_communication_profiles where tenant_id = p_tenant_id limit 1) then
    insert into public.companion_identity_relationship_engine_communication_profiles (tenant_id, profile_key, profile_title, audience_type, tone, detail_level, summary) values
      (p_tenant_id, 'COMM-EXE', 'Executive communication', 'executive', 'professional', 'brief', 'High-signal summaries with clear next steps.'),
      (p_tenant_id, 'COMM-EMP', 'Employee communication', 'employee', 'friendly', 'balanced', 'Clear guidance with supportive tone.'),
      (p_tenant_id, 'COMM-CUS', 'Customer communication', 'customer', 'respectful', 'detailed', 'Professional warmth aligned with brand identity.');
  end if;
  if not exists (select 1 from public.companion_identity_relationship_engine_trust_signals where tenant_id = p_tenant_id limit 1) then
    insert into public.companion_identity_relationship_engine_trust_signals (tenant_id, signal_key, signal_type, signal_title, score, observation) values
      (p_tenant_id, 'TRUST-CON', 'consistency', 'Communication consistency', 82, 'Tone and identity remain stable across surfaces.'),
      (p_tenant_id, 'TRUST-REL', 'reliability', 'Operational reliability', 79, 'Companion follows through on prepared actions.'),
      (p_tenant_id, 'TRUST-ACC', 'accuracy', 'Guidance accuracy', 76, 'Recommendations align with approved metadata.'),
      (p_tenant_id, 'TRUST-HLP', 'helpfulness', 'Perceived helpfulness', 84, 'Users report actionable guidance.'),
      (p_tenant_id, 'TRUST-RSP', 'responsiveness', 'Responsiveness', 80, 'Presence and notifications respect preferences.');
  end if;
  if not exists (select 1 from public.companion_identity_relationship_engine_milestones where tenant_id = p_tenant_id limit 1) then
    insert into public.companion_identity_relationship_engine_milestones (tenant_id, milestone_key, milestone_title, milestone_type, achieved, summary, achieved_at) values
      (p_tenant_id, 'MS-FIRST', 'First interaction', 'first_interaction', true, 'Companion relationship established.', now() - interval '90 days'),
      (p_tenant_id, 'MS-SUCCESS', 'First operational success', 'first_success', true, 'First approved action completed successfully.', now() - interval '60 days'),
      (p_tenant_id, 'MS-GROW', 'Growth milestone', 'growth_milestone', false, 'Organization expansion milestone approaching.', null);
  end if;
  if not exists (select 1 from public.companion_identity_relationship_engine_memories where tenant_id = p_tenant_id limit 1) then
    insert into public.companion_identity_relationship_engine_memories (tenant_id, memory_key, memory_title, memory_type, summary, approval_status) values
      (p_tenant_id, 'MEM-PREF-001', 'Prefers concise executive briefings', 'preference', 'User prefers brief morning summaries.', 'approved'),
      (p_tenant_id, 'MEM-COMM-001', 'Calm notification style', 'communication', 'Notifications should remain calm and non-intrusive.', 'approved');
  end if;
  if not exists (select 1 from public.companion_identity_relationship_engine_interactions where tenant_id = p_tenant_id limit 1) then
    insert into public.companion_identity_relationship_engine_interactions (tenant_id, interaction_key, interaction_type, summary, satisfaction_score) values
      (p_tenant_id, 'INT-001', 'briefing', 'Executive briefing engagement', 88),
      (p_tenant_id, 'INT-002', 'command_center', 'Command Center quick action usage', 82),
      (p_tenant_id, 'INT-003', 'assistant', 'Assistant guidance session', 85);
  end if;
end; $$;

create or replace function public._gcri423_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_identity_relationship_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.companion_identity_relationship_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'update_preference', 'A communication preference should be updated.', 'Executive briefings may benefit from shorter format.', 'Review detail level and notification style.', 'low', 'high'),
    (p_tenant_id, 'milestone_approaching', 'A milestone is approaching.', 'Growth milestone within 30 days.', 'Prepare companion acknowledgment and review.', 'low', 'moderate'),
    (p_tenant_id, 'trust_increased', 'Trust has increased significantly.', 'Consistency scores improved this quarter.', 'Maintain current communication style.', 'low', 'high'),
    (p_tenant_id, 'engagement_improved', 'Relationship engagement improved.', 'Command Center usage trending up.', 'Consider adaptive personalization for power users.', 'moderate', 'moderate');
end; $$;

create or replace function public._gcri423_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_identity_relationship_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.companion_identity_relationship_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'preference_changed', 'Communication preferences changed.', 'Tone shifted toward more concise updates.', 'Validate preference with user review.', 'high'),
    (p_tenant_id, 'milestone_occurred', 'A relationship milestone occurred.', 'First success milestone achieved.', 'Record milestone in relationship history.', 'high'),
    (p_tenant_id, 'trust_improved', 'Trust signals improved.', 'Reliability and helpfulness scores increased.', 'Continue consistent companion identity.', 'moderate'),
    (p_tenant_id, 'engagement_increased', 'Companion engagement increased.', 'Desktop and web presence usage up.', 'Monitor satisfaction metrics.', 'moderate'),
    (p_tenant_id, 'personalization_recommended', 'Additional personalization recommended.', 'User interaction patterns suggest adaptive tone.', 'Offer preference review in Relationship Center.', 'moderate');
end; $$;

create or replace function public._gcri423_overview_block(p_tenant_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.companion_identity_relationship_engine_settings; v_prefs public.companion_identity_relationship_engine_user_preferences;
begin
  select * into v_settings from public.companion_identity_relationship_engine_settings where tenant_id = p_tenant_id;
  select * into v_prefs from public.companion_identity_relationship_engine_user_preferences where tenant_id = p_tenant_id and user_id = p_user_id;
  return jsonb_build_object(
    'companion_status', case when coalesce(v_settings.enabled, true) then 'active' else 'paused' end,
    'relationship_strength', coalesce(v_settings.relationship_strength_score, 72),
    'interactions', (select count(*)::integer from public.companion_identity_relationship_engine_interactions where tenant_id = p_tenant_id),
    'preferences_count', (select count(*)::integer from public.companion_identity_relationship_engine_memories where tenant_id = p_tenant_id and approval_status = 'approved'),
    'trust_score', coalesce(v_settings.trust_score, 78),
    'communication_style', coalesce(v_prefs.communication_style, 'adaptive'),
    'relationship_health_score', coalesce(v_settings.relationship_health_score, 80),
    'engagement_score', 76,
    'user_satisfaction', 84,
    'companion_adoption', 68
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_relationship_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_user_id uuid;
  v_settings public.companion_identity_relationship_engine_settings; v_prefs public.companion_identity_relationship_engine_user_preferences;
  v_overview jsonb;
begin
  perform public._irp_require_permission('companion_relationship.view');
  v_ctx := public._gcri423_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_settings := public._gcri423_ensure_settings(v_org_id, v_tenant_id);
  v_prefs := public._gcri423_ensure_user_preferences(v_tenant_id, v_user_id);
  perform public._gcri423_seed_defaults(v_tenant_id);
  perform public._gcri423_seed_advisor(v_tenant_id);
  perform public._gcri423_seed_intelligence(v_tenant_id);
  v_overview := public._gcri423_overview_block(v_tenant_id, v_user_id);
  perform public._gcri423_log_audit(v_tenant_id, 'dashboard_viewed', 'Companion relationship center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'People remember how systems make them feel. Trust is built through consistency.',
    'mission', 'Companion Relationship Engine — consistent identity, adaptive communication, and responsible personalization.',
    'abos_principle', 'There is only one Aipify — a trusted companion, not a chatbot, tool, or collection of separate assistants.',
    'identity_foundation', jsonb_build_object(
      'companion_name', coalesce(v_settings.companion_name, 'Aipify'),
      'identity', 'companion',
      'not_labels', jsonb_build_array('chatbot', 'assistant', 'tool')
    ),
    'core_values', jsonb_build_array(
      'People First', 'Technology Second', 'Self Love', 'Wisdom Before Speed',
      'Trust Before Automation', 'Help Before Sales', 'Responsibility Before Power'
    ),
    'identity_relationship_route', '/app/companion/identity-relationship',
    'personalization_route', '/app/companion/personalization',
    'trust_adoption_route', '/app/companion/trust-adoption',
    'assistant_identity_route', '/app/assistant/identity',
    'distinction_note', 'Relationship metadata only — users control personalization, memory permissions, and review.',
    'settings', row_to_json(v_settings)::jsonb,
    'user_preferences', row_to_json(v_prefs)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/companion/relationship'),
      jsonb_build_object('key', 'personality', 'route', '/app/companion/relationship#personality'),
      jsonb_build_object('key', 'communication', 'route', '/app/companion/relationship#communication'),
      jsonb_build_object('key', 'identity', 'route', '/app/companion/relationship#identity'),
      jsonb_build_object('key', 'history', 'route', '/app/companion/relationship#history'),
      jsonb_build_object('key', 'trust', 'route', '/app/companion/relationship#trust'),
      jsonb_build_object('key', 'analytics', 'route', '/app/companion/relationship#analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/companion/relationship#governance')
    ),
    'personality_profiles', coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'profile_key',p.profile_key,'profile_title',p.profile_title,'personality_type',p.personality_type,'core_value',p.core_value,'description',p.description) order by p.updated_at desc) from public.companion_identity_relationship_engine_personality_profiles p where p.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'communication_profiles', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'profile_key',c.profile_key,'profile_title',c.profile_title,'audience_type',c.audience_type,'tone',c.tone,'detail_level',c.detail_level,'summary',c.summary) order by c.updated_at desc) from public.companion_identity_relationship_engine_communication_profiles c where c.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'relationship_memories', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'memory_key',m.memory_key,'memory_title',m.memory_title,'memory_type',m.memory_type,'summary',m.summary,'approval_status',m.approval_status) order by m.recorded_at desc) from public.companion_identity_relationship_engine_memories m where m.tenant_id = v_tenant_id limit 15), '[]'::jsonb),
    'milestones', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'milestone_key',m.milestone_key,'milestone_title',m.milestone_title,'milestone_type',m.milestone_type,'achieved',m.achieved,'summary',m.summary,'achieved_at',m.achieved_at) order by m.achieved desc, m.milestone_type) from public.companion_identity_relationship_engine_milestones m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'trust_signals', coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'signal_key',t.signal_key,'signal_type',t.signal_type,'signal_title',t.signal_title,'score',t.score,'observation',t.observation,'status',t.status) order by t.updated_at desc) from public.companion_identity_relationship_engine_trust_signals t where t.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'interaction_history', coalesce((select jsonb_agg(jsonb_build_object('id',i.id,'interaction_key',i.interaction_key,'interaction_type',i.interaction_type,'summary',i.summary,'satisfaction_score',i.satisfaction_score,'occurred_at',i.occurred_at) order by i.occurred_at desc) from public.companion_identity_relationship_engine_interactions i where i.tenant_id = v_tenant_id limit 15), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.companion_identity_relationship_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.companion_identity_relationship_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.companion_identity_relationship_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'companion_adoption', v_overview->>'companion_adoption',
      'engagement', v_overview->>'engagement_score',
      'trust', v_overview->>'trust_score',
      'relationship_strength', v_overview->>'relationship_strength',
      'companion_value', v_overview->>'user_satisfaction',
      'user_satisfaction', v_overview->>'user_satisfaction',
      'growth_trend', 'improving'
    ),
    'governance', jsonb_build_object(
      'user_controls_personalization', true,
      'user_controls_memory', true,
      'user_can_review_preferences', true,
      'user_can_disable_personalization', true,
      'trust_transparent', true
    ),
    'privacy_note', 'Relationship data isolated per organization. Personal preferences isolated per user. Companion identity consistent globally.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.companion_relationship_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_user_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('companion_relationship.manage');
  v_ctx := public._gcri423_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._gcri423_ensure_settings(v_org_id, v_tenant_id);
  perform public._gcri423_ensure_user_preferences(v_tenant_id, v_user_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'update_preference' then
    update public.companion_identity_relationship_engine_user_preferences set
      tone = coalesce(p_payload->>'tone', tone),
      detail_level = coalesce(p_payload->>'detail_level', detail_level),
      communication_style = coalesce(p_payload->>'communication_style', communication_style),
      notification_style = coalesce(p_payload->>'notification_style', notification_style),
      humor_preference = coalesce(p_payload->>'humor_preference', humor_preference),
      interaction_preference = coalesce(p_payload->>'interaction_preference', interaction_preference),
      updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
    perform public._gcri423_log_audit(v_tenant_id, 'preference_updated', 'Communication preference updated', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'change_communication_style' then
    update public.companion_identity_relationship_engine_user_preferences set
      communication_style = coalesce(p_payload->>'communication_style', 'adaptive'),
      tone = coalesce(p_payload->>'tone', tone),
      updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
    perform public._gcri423_log_audit(v_tenant_id, 'communication_style_changed', 'Communication style changed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'change_companion_theme' then
    update public.companion_identity_relationship_engine_user_preferences set
      companion_theme = coalesce(p_payload->>'companion_theme', 'professional'),
      updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
    perform public._gcri423_log_audit(v_tenant_id, 'companion_theme_changed', 'Companion theme changed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'approve_memory' then
    update public.companion_identity_relationship_engine_memories set approval_status = 'approved'
    where tenant_id = v_tenant_id and memory_key = coalesce(p_payload->>'memory_key','') returning id into v_id;
    perform public._gcri423_log_audit(v_tenant_id, 'memory_approved', 'Relationship memory approved', jsonb_build_object('memory_id', v_id));
    return jsonb_build_object('ok', true, 'memory_id', v_id);
  end if;

  if v_action = 'remove_memory' then
    update public.companion_identity_relationship_engine_memories set approval_status = 'removed'
    where tenant_id = v_tenant_id and memory_key = coalesce(p_payload->>'memory_key','') returning id into v_id;
    perform public._gcri423_log_audit(v_tenant_id, 'memory_removed', 'Relationship memory removed', jsonb_build_object('memory_id', v_id));
    return jsonb_build_object('ok', true, 'memory_id', v_id);
  end if;

  if v_action = 'record_milestone' then
    update public.companion_identity_relationship_engine_milestones set achieved = true, achieved_at = now(), summary = coalesce(p_payload->>'summary', summary)
    where tenant_id = v_tenant_id and milestone_key = coalesce(p_payload->>'milestone_key','') returning id into v_id;
    if v_id is null then
      insert into public.companion_identity_relationship_engine_milestones (tenant_id, user_id, milestone_key, milestone_title, milestone_type, achieved, summary, achieved_at)
      values (v_tenant_id, v_user_id, coalesce(p_payload->>'milestone_key','MS-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'milestone_title','Relationship milestone'), coalesce(p_payload->>'milestone_type','companion_milestone'), true, coalesce(p_payload->>'summary',''), now())
      returning id into v_id;
    end if;
    perform public._gcri423_log_audit(v_tenant_id, 'milestone_reached', 'Relationship milestone reached', jsonb_build_object('milestone_id', v_id));
    return jsonb_build_object('ok', true, 'milestone_id', v_id);
  end if;

  if v_action = 'update_trust_score' then
    update public.companion_identity_relationship_engine_settings set
      trust_score = least(100, trust_score + coalesce((p_payload->>'delta')::integer, 1)),
      relationship_strength_score = least(100, relationship_strength_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gcri423_log_audit(v_tenant_id, 'trust_score_updated', 'Trust score updated', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'disable_personalization' then
    update public.companion_identity_relationship_engine_user_preferences set personalization_enabled = false, updated_at = now() where tenant_id = v_tenant_id and user_id = v_user_id;
    update public.companion_identity_relationship_engine_settings set personalization_enabled = false, updated_at = now() where tenant_id = v_tenant_id;
    perform public._gcri423_log_audit(v_tenant_id, 'personalization_disabled', 'Personalization disabled by user', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'refresh_analytics' then
    update public.companion_identity_relationship_engine_settings set
      relationship_health_score = least(100, relationship_health_score + 1),
      relationship_strength_score = least(100, relationship_strength_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gcri423_log_audit(v_tenant_id, 'analytics_refreshed', 'Companion analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;
