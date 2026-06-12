-- Implementation Blueprint Phase 53 — Life Events & Human Moments Engine
-- Extends Gratitude & Recognition Engine (Phase A.89 + Phase 9). Consent-first human moments scaffold.

-- ---------------------------------------------------------------------------
-- 1. human_moments_settings — consent flags only; no raw DOB storage
-- Future opt-in: metadata may hold birthday_month_day_hash — documented, not populated by default
-- ---------------------------------------------------------------------------
create table if not exists public.human_moments_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null,
  birthday_visible boolean not null default false,
  birthday_notifications_enabled boolean not null default false,
  anniversary_visible boolean not null default false,
  anniversary_notifications_enabled boolean not null default false,
  certification_celebrations_enabled boolean not null default true,
  community_contributions_visible boolean not null default true,
  personal_achievements_visible boolean not null default true,
  sales_milestones_visible boolean not null default false,
  display_preference text not null default 'private' check (
    display_preference in ('private', 'team', 'organization')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists human_moments_settings_org_idx
  on public.human_moments_settings (organization_id, user_id);

alter table public.human_moments_settings enable row level security;
revoke all on public.human_moments_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._lehmbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 53 — Life Events & Human Moments at /app/gratitude-recognition-engine. Distinct from Presence & Comfort A.90 (/app/presence-comfort-protocol) — comfort roses during difficulty, not life-event celebrations. Sales Expert Performance Phase 41 — sales milestones live in partner portal, not duplicated here. PAME (/app/assistant/memory) — user-owned important people; Human Moments uses consent-based recognition only, metadata not raw date storage unless user opts in via human_moments_settings. LifeOS A.32 — personal life areas remain separate. Self Love A.76 — wellbeing principles cross-linked. Certification A.37 / Enterprise Deployment Phase 37 — certification celebration events cross-linked. Cross-links: Companion Identity A.84, Employee Knowledge Engine, Sales Expert community Phase 47. All Phase A.89 and Phase 9 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._lehmbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Help people honor meaningful life and professional moments — birthdays, anniversaries, certifications, community contributions, and personal achievements — with warm, optional, consent-based recognition that never feels intrusive.';
$$;

create or replace function public._lehmbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Human moments matter — celebrate with respect, never pressure. Consent before visibility; metadata before raw dates; optional participation always.';
$$;

create or replace function public._lehmbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) strengthens human connection through thoughtful celebration — people decide what to share; Aipify prepares gentle recognition.';
$$;

create or replace function public._lehmbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'birthdays', 'label', 'Birthday experiences', 'emoji', '🌹', 'description', 'Optional respectful birthday recognition — consent required before any visibility or notification'),
    jsonb_build_object('key', 'work_anniversaries', 'label', 'Professional anniversaries', 'emoji', '🔔', 'description', '1-year, 5-year, and 10-year Aipify tenure milestones — metadata summaries only'),
    jsonb_build_object('key', 'certification_celebrations', 'label', 'Certification celebrations', 'emoji', '🦉', 'description', 'Sales Expert and Elite certification milestones — cross-link Certification A.37'),
    jsonb_build_object('key', 'sales_milestones', 'label', 'Sales milestones', 'emoji', '🔔', 'description', 'Partner portal sales achievements — cross-link Phase 41; aggregate metadata only here'),
    jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'emoji', '🦉', 'description', 'Mentorship thanks and community participation — cross-link Sales Expert community Phase 47'),
    jsonb_build_object('key', 'personal_achievements', 'label', 'Personal achievements', 'emoji', '❤️', 'description', 'Honest progress and perseverance — Self Love aligned, never perfectionism pressure')
  );
$$;

create or replace function public._lehmbp_blueprint_birthday_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🌹',
    'label', 'Birthday experiences',
    'principle', 'Optional, respectful, consent required — never assume or announce without explicit opt-in.',
    'consent_required', true,
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'gentle_acknowledgment', 'example', 'If you have chosen to share your birthday, Aipify may offer a warm acknowledgment — you can dismiss it anytime.'),
      jsonb_build_object('emoji', '🔔', 'key', 'team_celebration', 'example', 'Team members who opted in may receive a quiet bell moment — never a broadcast without consent.'),
      jsonb_build_object('emoji', '❤️', 'key', 'pass_forward', 'example', 'Would you like to send a Digital Recognition Rose to someone whose support mattered this year?')
    ),
    'avoid', jsonb_build_array('Announcing birthdays without consent', 'Age disclosure', 'Pressure to participate', 'Storing raw date of birth without explicit opt-in architecture'),
    'settings_keys', jsonb_build_array('birthday_visible', 'birthday_notifications_enabled'),
    'future_scaffold', 'birthday_month_day_hash in metadata — future opt-in only; not populated by default'
  );
$$;

create or replace function public._lehmbp_blueprint_professional_anniversaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🔔',
    'label', 'Professional anniversaries',
    'principle', 'Honor sustained contribution — 1, 5, and 10 years of Aipify tenure with quiet celebration.',
    'milestones', jsonb_build_array(
      jsonb_build_object('years', 1, 'label', 'First year', 'example', '🔔 One year with Aipify — thank you for the steady presence you bring.'),
      jsonb_build_object('years', 5, 'label', 'Five years', 'example', '🔔 Five years of contribution — lasting impact is built in everyday moments.'),
      jsonb_build_object('years', 10, 'label', 'Ten years', 'example', '🔔 A decade of dedication — your perseverance shaped how this organization works.')
    ),
    'settings_keys', jsonb_build_array('anniversary_visible', 'anniversary_notifications_enabled'),
    'boundary', 'Tenure metadata from organization membership — no personal employment history beyond Aipify context.'
  );
$$;

create or replace function public._lehmbp_blueprint_certification_celebrations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🦉',
    'label', 'Certification celebrations',
    'principle', 'Celebrate earned expertise — Sales Expert and Elite tiers cross-link Certification Engine A.37.',
    'tiers', jsonb_build_array(
      jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'elite', 'label', 'Elite / Expert', 'route', '/app/marketplace-partner-ecosystem-foundation-engine')
    ),
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'text', 'Certification milestone reached — expertise earned through human review deserves recognition.'),
      jsonb_build_object('emoji', '🌹', 'text', 'Thank you for mentoring others toward certification — community strength grows.')
    ),
    'certification_route', '/app/enterprise-readiness-engine',
    'certification_phase', 'A.37',
    'settings_key', 'certification_celebrations_enabled'
  );
$$;

create or replace function public._lehmbp_blueprint_community_contributions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🦉',
    'label', 'Community contributions',
    'principle', 'Mentorship thanks and forum participation — cross-link Sales Expert community Phase 47 and Employee Knowledge.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'text', 'Mentorship session completed — thank you for guiding a colleague.'),
      jsonb_build_object('emoji', '🌹', 'text', 'Community answer helped a partner — knowledge shared strengthens the ecosystem.'),
      jsonb_build_object('emoji', '🔔', 'text', 'Advisory council contribution noted — thoughtful participation matters.')
    ),
    'sales_community_route', '/app/sales-expert-engine',
    'sales_community_phase', 47,
    'employee_knowledge_route', '/app/settings/employee-knowledge',
    'settings_key', 'community_contributions_visible'
  );
$$;

create or replace function public._lehmbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Reflection, gratitude, and honest progress — Human Moments align with Self Love without perfectionism or guilt.',
    'practices', jsonb_build_array(
      'Celebrate effort and recovery — not only polished outcomes',
      'Personal achievements are optional to share — never mandatory visibility',
      'Gratitude for perseverance during demanding seasons',
      'Sustainable growth — one moment at a time'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'settings_key', 'personal_achievements_visible'
  );
$$;

create or replace function public._lehmbp_blueprint_companion_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Warm, respectful, optional, non-intrusive — Companion Identity A.84 tone for human moments.',
    'qualities', jsonb_build_array('Warm but professional', 'Respectful of cultural sensitivity', 'Optional — dismiss or snooze anytime', 'Non-intrusive — no alert spam', 'Consent-first visibility'),
    'companion_identity_route', '/app/companion-identity-engine',
    'companion_identity_phase', 'A.84',
    'cultural_note', 'i18n en/no/sv/da — culturally sensitive phrasing; never assume Western celebration norms.'
  );
$$;

create or replace function public._lehmbp_blueprint_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Consent, control, and metadata — users control sharing, notifications, and display scope.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'birthday_visible', 'label', 'Birthday visibility opt-in'),
      jsonb_build_object('key', 'anniversary_visible', 'label', 'Work anniversary visibility opt-in'),
      jsonb_build_object('key', 'display_preference', 'label', 'Display scope — private, team, or organization'),
      jsonb_build_object('key', 'notification_toggles', 'label', 'Per-category notification consent'),
      jsonb_build_object('key', 'metadata_only', 'label', 'No raw DOB in RPC payloads — future hash scaffold documented only')
    ),
    'trust_note', 'Metadata and aggregate celebration counts only — no PII in dashboard RPCs.',
    'settings_table', 'human_moments_settings'
  );
$$;

create or replace function public._lehmbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates human moments internally; Unonight pilots consent-based birthday and anniversary scaffolds.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — consent flags, companion tone review, cultural i18n validation',
      'focus', jsonb_build_array('human_moments_settings defaults', 'Certification celebration cross-links', 'Comfort vs recognition rose boundaries')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — optional team celebrations in support workflows',
      'focus', jsonb_build_array('Work anniversary metadata', 'Community mentorship thanks', 'Consent-first birthday scaffold')
    )
  );
$$;

create or replace function public._lehmbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine'),
    jsonb_build_object('key', 'presence_comfort', 'label', 'Presence & Comfort (A.90)', 'route', '/app/presence-comfort-protocol', 'note', 'Comfort roses — not life events'),
    jsonb_build_object('key', 'pame_memory', 'label', 'PAME Memory', 'route', '/app/assistant/memory', 'note', 'User-owned important people — distinct consent model'),
    jsonb_build_object('key', 'life_os', 'label', 'LifeOS (A.32)', 'route', '/app/assistant/life', 'note', 'Personal life areas separate'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('key', 'certification', 'label', 'Certification (A.37 / Phase 37)', 'route', '/app/enterprise-readiness-engine'),
    jsonb_build_object('key', 'sales_expert_community', 'label', 'Sales Expert Community (Phase 47)', 'route', '/app/sales-expert-engine'),
    jsonb_build_object('key', 'sales_performance', 'label', 'Sales Performance (Phase 41)', 'route', '/app/sales-expert-engine', 'note', 'Partner portal milestones — not duplicated'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge')
  );
$$;

create or replace function public._lehmbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Human moments deserve warmth — never intrusion.',
    'Consent before celebration — people choose what to share.',
    '🌹 A quiet acknowledgment when someone opted in — dismissible anytime.',
    '🔔 Tenure milestones honor sustained contribution — not comparison leaderboards.',
    '🦉 Certification earned through human review — expertise celebrated with humility.',
    'Metadata protects privacy — the person owns their story.',
    'Cultural sensitivity in every locale — celebration adapts to context.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Settings helpers
-- ---------------------------------------------------------------------------
create or replace function public._lehmbp_ensure_settings(
  p_organization_id uuid,
  p_user_id uuid
)
returns public.human_moments_settings language plpgsql security definer set search_path = public as $$
declare v_row public.human_moments_settings;
begin
  insert into public.human_moments_settings (organization_id, user_id)
  values (p_organization_id, p_user_id)
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.human_moments_settings
  where organization_id = p_organization_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._lehmbp_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'lehmbp_' || p_action_type,
    'gratitude_recognition_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public.update_human_moments_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.human_moments_settings;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._lehmbp_ensure_settings(v_org_id, v_user_id);

  update public.human_moments_settings set
    birthday_visible = coalesce((p_payload->>'birthday_visible')::boolean, birthday_visible),
    birthday_notifications_enabled = coalesce(
      (p_payload->>'birthday_notifications_enabled')::boolean, birthday_notifications_enabled
    ),
    anniversary_visible = coalesce((p_payload->>'anniversary_visible')::boolean, anniversary_visible),
    anniversary_notifications_enabled = coalesce(
      (p_payload->>'anniversary_notifications_enabled')::boolean, anniversary_notifications_enabled
    ),
    certification_celebrations_enabled = coalesce(
      (p_payload->>'certification_celebrations_enabled')::boolean, certification_celebrations_enabled
    ),
    community_contributions_visible = coalesce(
      (p_payload->>'community_contributions_visible')::boolean, community_contributions_visible
    ),
    personal_achievements_visible = coalesce(
      (p_payload->>'personal_achievements_visible')::boolean, personal_achievements_visible
    ),
    sales_milestones_visible = coalesce(
      (p_payload->>'sales_milestones_visible')::boolean, sales_milestones_visible
    ),
    display_preference = coalesce(nullif(trim(p_payload->>'display_preference'), ''), display_preference),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id
  returning * into v_row;

  perform public._lehmbp_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'birthday_visible', v_row.birthday_visible,
    'anniversary_visible', v_row.anniversary_visible,
    'display_preference', v_row.display_preference,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Live moments summary (metadata only)
-- ---------------------------------------------------------------------------
create or replace function public._lehmbp_moments_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_human_moment_count int := 0;
  v_birthday_opt_in int := 0;
  v_anniversary_opt_in int := 0;
  v_cert_opt_in int := 0;
  v_community_opt_in int := 0;
  v_personal_opt_in int := 0;
  v_by_category jsonb := '{}'::jsonb;
begin
  perform public._gre_ensure_settings(p_organization_id);
  perform public._gre_seed_moments(p_organization_id);

  select count(*) into v_human_moment_count
  from public.organization_gratitude_moments
  where organization_id = p_organization_id
    and coalesce(metadata->>'human_moment', 'false') = 'true';

  select count(*) into v_birthday_opt_in
  from public.human_moments_settings
  where organization_id = p_organization_id and birthday_visible = true;

  select count(*) into v_anniversary_opt_in
  from public.human_moments_settings
  where organization_id = p_organization_id and anniversary_visible = true;

  select count(*) into v_cert_opt_in
  from public.human_moments_settings
  where organization_id = p_organization_id and certification_celebrations_enabled = true;

  select count(*) into v_community_opt_in
  from public.human_moments_settings
  where organization_id = p_organization_id and community_contributions_visible = true;

  select count(*) into v_personal_opt_in
  from public.human_moments_settings
  where organization_id = p_organization_id and personal_achievements_visible = true;

  select coalesce(jsonb_object_agg(category, cnt), '{}'::jsonb) into v_by_category
  from (
    select coalesce(metadata->>'human_moment_category', 'uncategorized') as category, count(*) as cnt
    from public.organization_gratitude_moments
    where organization_id = p_organization_id
      and coalesce(metadata->>'human_moment', 'false') = 'true'
    group by coalesce(metadata->>'human_moment_category', 'uncategorized')
  ) t;

  return jsonb_build_object(
    'human_moment_count', v_human_moment_count,
    'celebration_counts_by_category', v_by_category,
    'consent_summary', jsonb_build_object(
      'birthday_visible_count', v_birthday_opt_in,
      'anniversary_visible_count', v_anniversary_opt_in,
      'certification_celebrations_enabled_count', v_cert_opt_in,
      'community_contributions_visible_count', v_community_opt_in,
      'personal_achievements_visible_count', v_personal_opt_in
    ),
    'privacy_note', 'Aggregate celebration counts and consent opt-in totals only — no raw dates, names, or PII.',
    'summary_text', format(
      '%s human moment celebrations recorded; %s birthday opt-ins; %s anniversary opt-ins.',
      v_human_moment_count, v_birthday_opt_in, v_anniversary_opt_in
    )
  );
end; $$;

create or replace function public._lehmbp_seed_human_moments(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_gratitude_moments
    where organization_id = p_organization_id
      and coalesce(metadata->>'human_moment', 'false') = 'true'
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_gratitude_moments (
    organization_id, moment_type, summary, recognition_target_role, status, metadata
  ) values
    (p_organization_id, 'milestone',
     'Work anniversary milestone noted — one year of steady contribution celebrated with consent.',
     'colleague', 'acknowledged',
     '{"seed": true, "human_moment": true, "human_moment_category": "work_anniversary", "metadata_only": true}'::jsonb),
    (p_organization_id, 'above_and_beyond',
     'Certification celebration — Sales Expert tier earned through human review.',
     'colleague', 'celebrated',
     '{"seed": true, "human_moment": true, "human_moment_category": "certification", "metadata_only": true}'::jsonb),
    (p_organization_id, 'consistent_helper',
     'Community mentorship thanks — guidance shared in partner forum.',
     'colleague', 'pending',
     '{"seed": true, "human_moment": true, "human_moment_category": "community_contribution", "metadata_only": true}'::jsonb),
    (p_organization_id, 'milestone',
     'Personal achievement — honest progress on a demanding goal, shared optionally.',
     'self', 'pending',
     '{"seed": true, "human_moment": true, "human_moment_category": "personal_achievement", "metadata_only": true}'::jsonb);
end; $$;

create or replace function public._lehmbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_human_count int := 0;
  v_birthday_opt int := 0;
begin
  perform public._lehmbp_seed_human_moments(p_organization_id);
  v_summary := public._lehmbp_moments_summary(p_organization_id);
  v_human_count := coalesce((v_summary->>'human_moment_count')::int, 0);
  v_birthday_opt := coalesce((v_summary->'consent_summary'->>'birthday_visible_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six human moment objectives documented — birthdays through personal achievements',
      'met', jsonb_array_length(public._lehmbp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'consent_first',
      'label', 'Consent-first privacy — human_moments_settings scaffold with no raw DOB storage',
      'met', to_regclass('public.human_moments_settings') is not null,
      'note', 'birthday_month_day_hash documented as future opt-in only — not populated by default.'
    ),
    jsonb_build_object(
      'key', 'birthday_experiences',
      'label', 'Birthday experiences optional and respectful — consent required',
      'met', (public._lehmbp_blueprint_birthday_experiences()->>'consent_required')::boolean = true,
      'note', null
    ),
    jsonb_build_object(
      'key', 'professional_anniversaries',
      'label', 'Professional anniversary milestones — 1, 5, and 10 year tenure',
      'met', jsonb_array_length(public._lehmbp_blueprint_professional_anniversaries()->'milestones') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'human_moments_recorded',
      'label', 'Human moment celebrations recorded with metadata categories',
      'met', v_human_count >= 2,
      'note', case when v_human_count < 2 then 'Seed or capture human moments with human_moment metadata.' else null end
    ),
    jsonb_build_object(
      'key', 'comfort_boundary',
      'label', 'Distinct from Presence & Comfort A.90 comfort roses',
      'met', true,
      'note', 'Comfort roses live in /app/presence-comfort-protocol — life events here are consent-based celebrations.'
    ),
    jsonb_build_object(
      'key', 'pame_boundary',
      'label', 'Distinct from PAME important people — consent-based recognition only',
      'met', true,
      'note', 'PAME stores user-owned relationship metadata; Human Moments never stores raw dates without opt-in.'
    ),
    jsonb_build_object(
      'key', 'companion_principles',
      'label', 'Companion principles — warm, respectful, optional, non-intrusive',
      'met', jsonb_array_length(public._lehmbp_blueprint_companion_principles()->'qualities') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to Companion Identity, Employee Knowledge, Sales Expert community, Certification',
      'met', jsonb_array_length(public._lehmbp_blueprint_integration_links()) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'cultural_i18n',
      'label', 'Cultural sensitivity — en/no/sv/da i18n keys for human moments copy',
      'met', true,
      'note', 'Locales must use consent-first, non-intrusive tone — never artificial celebration pressure.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve Phase 9; append Phase 53
-- ---------------------------------------------------------------------------
create or replace function public.get_gratitude_recognition_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_moments int := 0;
  v_roses int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('gratitude_recognition.view');
  v_org_id := public._mta_require_organization();
  perform public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);
  perform public._lehmbp_seed_human_moments(v_org_id);

  select count(*) into v_moments
  from public.organization_gratitude_moments where organization_id = v_org_id;

  select count(*) into v_roses
  from public.organization_digital_rose_recognitions where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_gratitude_moments
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sincere, human recognition strengthens relationships — help people express appreciation.',
    'moment_count', v_moments,
    'rose_count', v_roses,
    'pending_moments', v_pending,
    'enabled', (select enabled from public.organization_gratitude_recognition_settings where organization_id = v_org_id),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 9 — Recognition & Celebration Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md',
      'engine_phase', 'A.89 Gratitude & Recognition Engine',
      'route', '/app/gratitude-recognition-engine'
    ),
    'gratitude_recognition_engine_note', 'Recognition & Celebration Foundation (ABOS Phase 9) — extends Gratitude & Recognition Engine (Phase A.89).',
    'implementation_blueprint_phase53', jsonb_build_object(
      'phase', 53,
      'title', 'Life Events & Human Moments Engine',
      'engine_phase', 'A.89',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE53_LIFE_EVENTS_HUMAN_MOMENTS.md',
      'route', '/app/gratitude-recognition-engine'
    ),
    'human_moments_mission', public._lehmbp_blueprint_mission(),
    'human_moments_summary', public._lehmbp_moments_summary(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard RPC — preserve ALL Phase A.89 + Phase 9; append Phase 53
-- ---------------------------------------------------------------------------
create or replace function public.get_gratitude_recognition_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_gratitude_recognition_settings;
  v_human_settings public.human_moments_settings;
begin
  perform public._irp_require_permission('gratitude_recognition.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);
  perform public._lehmbp_seed_human_moments(v_org_id);
  v_human_settings := public._lehmbp_ensure_settings(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Sincere, human recognition strengthens relationships — help people express appreciation in everyday work.',
    'mission',
      'Notice effort, celebrate milestones, and express appreciation more frequently — genuine, timely, human, encouraging, inclusive.',
    'abos_principle',
      'Recognition strengthens people — small gestures create lasting memories.',
    'vision',
      'Cultures where appreciation, gratitude, and recognition are natural in everyday work.',
    'distinction_note',
      'Distinct from Human Success Phase 82 (/app/human-success), Wonder Engine A.88, Legacy A.86, Humor & Personal Connection (/app/personality), and Relationship Intelligence A.78/RSI. Also distinct from Presence & Comfort A.90 (/app/presence-comfort-protocol) — comfort roses vs recognition roses. Gratitude & Recognition A.89 = peer appreciation, digital rose gestures, gratitude moments, boundary-safe warmth.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 9 — Recognition & Celebration Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md',
      'engine_phase', 'A.89 Gratitude & Recognition Engine',
      'route', '/app/gratitude-recognition-engine',
      'mapping_note', 'ABOS Blueprint Phase 9 maps to Gratitude & Recognition Engine A.89 — extend, do not duplicate.'
    ),
    'gratitude_recognition_engine_note', 'Recognition & Celebration Foundation (ABOS Phase 9) — extends Gratitude & Recognition Engine (Phase A.89).',
    'recognition_categories', public._gre_recognition_categories(),
    'bell_moments', public._gre_bell_moments(),
    'recognition_roses', public._gre_recognition_roses(),
    'self_recognition', public._gre_self_recognition(),
    'self_love_connection', public._gre_self_love_connection(),
    'trust_connection', public._gre_trust_connection(),
    'org_configuration_boundaries', public._gre_org_configuration_boundaries(),
    'dogfooding', public._gre_blueprint_dogfooding(),
    'success_criteria', public._gre_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._gre_vision_phrases(),
    'gratitude_moment_types', public._gre_gratitude_moment_types(),
    'red_rose_moment', public._gre_red_rose_moment(),
    'boundary_phrases', public._gre_boundary_phrases(),
    'self_love_note', public._gre_self_love_note(),
    'trust_note', public._gre_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'summary', m.summary,
          'recognition_target_role', m.recognition_target_role,
          'status', m.status,
          'metadata', m.metadata,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) order by m.created_at desc
      )
      from (
        select * from public.organization_gratitude_moments
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) m
    ), '[]'::jsonb),
    'recent_roses', jsonb_build_object(
      'count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0),
      'last_sent_at', (
        select max(rose_sent_at) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      )
    ),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_gratitude_moments where organization_id = v_org_id
      ), 0),
      'moments_by_type', coalesce((
        select jsonb_object_agg(moment_type, cnt)
        from (
          select moment_type, count(*) as cnt
          from public.organization_gratitude_moments
          where organization_id = v_org_id
          group by moment_type
        ) t
      ), '{}'::jsonb),
      'moments_by_status', coalesce((
        select jsonb_object_agg(status, cnt)
        from (
          select status, count(*) as cnt
          from public.organization_gratitude_moments
          where organization_id = v_org_id
          group by status
        ) s
      ), '{}'::jsonb),
      'rose_count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0),
      'digital_rose_enabled', v_settings.digital_rose_enabled,
      'gratitude_moments_enabled', v_settings.gratitude_moments_enabled
    ),
    'integration_links', jsonb_build_object(
      'companion_identity', '/app/companion-identity-engine',
      'personality', '/app/personality',
      'presence_comfort', '/app/presence-comfort-protocol',
      'presence_comfort_note', 'Comfort roses (A.90) — distinct from recognition roses (A.89)',
      'self_love_naming', 'SELF_LOVE_NAMING_STANDARD.md',
      'human_success', '/app/human-success',
      'relationship_intelligence', '/app/relationship-intelligence-engine',
      'inclusion_humanity', '/app/inclusion-humanity-engine',
      'impact_engine', '/app/impact-engine',
      'legacy_engine', '/app/legacy-engine',
      'wonder_engine', '/app/wonder-engine',
      'purpose_values', '/app/purpose-values-engine',
      'recognition_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md',
      'pame_memory', '/app/assistant/memory',
      'life_os', '/app/assistant/life',
      'self_love', '/app/self-love-engine',
      'employee_knowledge', '/app/settings/employee-knowledge',
      'sales_expert_community', '/app/sales-expert-engine',
      'human_moments_blueprint', 'IMPLEMENTATION_BLUEPRINT_PHASE53_LIFE_EVENTS_HUMAN_MOMENTS.md'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('gratitude_recognition.manage'),
      'can_export', public._irp_has_permission('gratitude_recognition.export'),
      'can_send_rose', public._irp_has_permission('gratitude_recognition.rose.send')
    ),
    'implementation_blueprint_phase53', jsonb_build_object(
      'phase', 53,
      'title', 'Life Events & Human Moments Engine',
      'engine_phase', 'A.89',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE53_LIFE_EVENTS_HUMAN_MOMENTS.md',
      'route', '/app/gratitude-recognition-engine',
      'mapping_note', 'ABOS Blueprint Phase 53 extends A.89 with consent-based life events — preserves Phase 9 fields.'
    ),
    'human_moments_mission', public._lehmbp_blueprint_mission(),
    'human_moments_philosophy', public._lehmbp_blueprint_philosophy(),
    'human_moments_abos_principle', public._lehmbp_blueprint_abos_principle(),
    'human_moments_objectives', public._lehmbp_blueprint_objectives(),
    'birthday_experiences', public._lehmbp_blueprint_birthday_experiences(),
    'professional_anniversaries', public._lehmbp_blueprint_professional_anniversaries(),
    'certification_celebrations', public._lehmbp_blueprint_certification_celebrations(),
    'community_contributions', public._lehmbp_blueprint_community_contributions(),
    'human_moments_self_love_connection', public._lehmbp_blueprint_self_love_connection(),
    'companion_principles', public._lehmbp_blueprint_companion_principles(),
    'privacy_principles', public._lehmbp_blueprint_privacy_principles(),
    'human_moments_settings', row_to_json(v_human_settings)::jsonb,
    'human_moments_summary', public._lehmbp_moments_summary(v_org_id),
    'human_moments_dogfooding', public._lehmbp_blueprint_dogfooding(),
    'lehmbp_integration_links', public._lehmbp_blueprint_integration_links(),
    'human_moments_success_criteria', public._lehmbp_blueprint_success_criteria(v_org_id),
    'human_moments_vision_phrases', public._lehmbp_blueprint_vision_phrases(),
    'human_moments_distinction_note', public._lehmbp_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit allowlist extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_rejected', 'rrme_disposal_approved', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed',
    'pce_nudge_dismissed', 'pce_nudge_snoozed', 'pce_nudge_acted',
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported',
    'pfe_item_created', 'pfe_item_updated', 'pfe_recommendation_resolved',
    'pfe_org_settings_changed', 'pfe_summary_exported',
    'pve_value_upserted', 'pve_settings_changed', 'pve_reflection_acknowledged',
    'pve_reflection_dismissed', 'pve_report_exported',
    'ihe_settings_changed', 'ihe_reflection_acknowledged', 'ihe_reflection_dismissed',
    'ihe_report_exported',
    'cie_settings_changed', 'cie_report_exported',
    'ime_settings_changed', 'ime_summary_generated', 'ime_report_exported',
    'leg_settings_changed', 'leg_milestone_acknowledged', 'leg_report_exported',
    'cde_settings_changed', 'cde_prompt_explored', 'cde_prompt_dismissed', 'cde_report_exported',
    'wne_settings_changed', 'wne_reflection_acknowledged', 'wne_reflection_dismissed',
    'wne_moment_acknowledged', 'wne_report_exported',
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%'
    or p_action_type like 'cde_%' or p_action_type like 'wne_%' or p_action_type like 'gre_%'
    or p_action_type like 'lehmbp_%';
$$;

-- ---------------------------------------------------------------------------
-- 9. Grants + KC category
-- ---------------------------------------------------------------------------
grant execute on function public._lehmbp_distinction_note() to authenticated;
grant execute on function public._lehmbp_blueprint_mission() to authenticated;
grant execute on function public._lehmbp_blueprint_philosophy() to authenticated;
grant execute on function public._lehmbp_blueprint_abos_principle() to authenticated;
grant execute on function public._lehmbp_blueprint_objectives() to authenticated;
grant execute on function public._lehmbp_blueprint_birthday_experiences() to authenticated;
grant execute on function public._lehmbp_blueprint_professional_anniversaries() to authenticated;
grant execute on function public._lehmbp_blueprint_certification_celebrations() to authenticated;
grant execute on function public._lehmbp_blueprint_community_contributions() to authenticated;
grant execute on function public._lehmbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._lehmbp_blueprint_companion_principles() to authenticated;
grant execute on function public._lehmbp_blueprint_privacy_principles() to authenticated;
grant execute on function public._lehmbp_blueprint_dogfooding() to authenticated;
grant execute on function public._lehmbp_blueprint_integration_links() to authenticated;
grant execute on function public._lehmbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._lehmbp_moments_summary(uuid) to authenticated;
grant execute on function public._lehmbp_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public.update_human_moments_settings(jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'life-events-human-moments-blueprint', 'Life Events & Human Moments (ABOS Phase 53)',
  'Consent-based life events and human moments — birthdays, anniversaries, certifications, and community contributions. Extends Gratitude & Recognition A.89.',
  'authenticated', 111
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'life-events-human-moments-blueprint' and tenant_id is null
);
