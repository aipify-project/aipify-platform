-- Implementation Blueprint Phase 43 — Sales Engagement & Booking Engine
-- Extends Sales Expert Operating System (Phase A.95 + Phase 41 + Phase 45 + Phase 46 + Marketing Center).

-- ---------------------------------------------------------------------------
-- 1. Extend organization_sales_expert_settings — booking page metadata
-- ---------------------------------------------------------------------------
alter table public.organization_sales_expert_settings
  add column if not exists booking_slug text not null default '',
  add column if not exists booking_page_enabled boolean not null default false;

-- ---------------------------------------------------------------------------
-- 2. organization_sales_expert_bookings — metadata only (no PII in notes)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_expert_bookings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid references public.organization_sales_expert_customers (id) on delete set null,
  booking_type text not null default 'discovery' check (
    booking_type in (
      'discovery', 'demo', 'onboarding', 'follow_up_consultation',
      'support', 'executive', 'commerce', 'community'
    )
  ),
  scheduled_at timestamptz not null,
  duration_minutes int not null default 30 check (duration_minutes between 15 and 180),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')
  ),
  timezone text not null default 'UTC',
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_sales_expert_bookings_org_idx
  on public.organization_sales_expert_bookings (organization_id, scheduled_at desc, status);

alter table public.organization_sales_expert_bookings enable row level security;
revoke all on public.organization_sales_expert_bookings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Booking settings helper — derive slug from expert display name when empty
-- ---------------------------------------------------------------------------
create or replace function public._sebbp_resolve_booking_slug(p_organization_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_sales_expert_settings;
  v_slug text;
begin
  select * into v_settings
  from public.organization_sales_expert_settings
  where organization_id = p_organization_id;

  if v_settings.booking_slug is not null and trim(v_settings.booking_slug) <> '' then
    return lower(trim(v_settings.booking_slug));
  end if;

  v_slug := lower(regexp_replace(
    coalesce(nullif(trim(v_settings.expert_display_name), ''), 'sales-expert'),
    '[^a-zA-Z0-9]+', '-', 'g'
  ));
  v_slug := trim(both '-' from v_slug);
  if v_slug = '' then
    v_slug := 'sales-expert';
  end if;
  return left(v_slug, 64);
end; $$;

create or replace function public._sebbp_ensure_booking_settings(p_organization_id uuid)
returns public.organization_sales_expert_settings language plpgsql security definer set search_path = public as $$
declare
  v_row public.organization_sales_expert_settings;
  v_slug text;
begin
  v_row := public._seos_ensure_settings(p_organization_id);
  if trim(v_row.booking_slug) = '' then
    v_slug := public._sebbp_resolve_booking_slug(p_organization_id);
    update public.organization_sales_expert_settings
    set booking_slug = v_slug,
        booking_link = case
          when trim(booking_link) = '' then format('https://aipify.ai/book/%s', v_slug)
          else booking_link
        end,
        updated_at = now()
    where organization_id = p_organization_id;
    select * into v_row from public.organization_sales_expert_settings where organization_id = p_organization_id;
  end if;
  return v_row;
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Blueprint metadata helpers (_sebbp_*)
-- ---------------------------------------------------------------------------
create or replace function public._sebbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'meeting_scheduling', 'label', 'Meeting scheduling', 'description', 'Personal booking pages and one-to-one calendar coordination'),
    jsonb_build_object('key', 'demo_booking', 'label', 'Demo booking', 'description', 'Discovery and demonstration sessions — install-first positioning'),
    jsonb_build_object('key', 'follow_ups', 'label', 'Follow-up management', 'description', 'Companion nudges and scheduled follow-ups from existing cadences'),
    jsonb_build_object('key', 'meeting_prep', 'label', 'Meeting preparation', 'description', 'Customer background summaries and discovery questions — metadata scaffold'),
    jsonb_build_object('key', 'engagement_tracking', 'label', 'Engagement tracking', 'description', 'Meeting history, upcoming sessions, and action items from pipeline metadata'),
    jsonb_build_object('key', 'calendar_sync', 'label', 'Calendar sync scaffold', 'description', 'Google, Outlook, Apple — conflict avoidance metadata; honest pending/OAuth status')
  );
$$;

create or replace function public._sebbp_blueprint_booking_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Personal booking pages at aipify.ai/book/{slug} — discovery, demos, onboarding, and follow-up consultations.',
    'url_pattern', 'https://aipify.ai/book/{slug}',
    'session_types', jsonb_build_array(
      jsonb_build_object('key', 'discovery', 'label', 'Discovery meeting', 'duration_minutes', 45, 'note', 'Understand workflow before recommending'),
      jsonb_build_object('key', 'demo', 'label', 'Product demonstration', 'duration_minutes', 60, 'note', 'Install-first ABOS walkthrough'),
      jsonb_build_object('key', 'onboarding', 'label', 'Onboarding consultation', 'duration_minutes', 60, 'note', 'Scope, roles, and timeline'),
      jsonb_build_object('key', 'follow_up_consultation', 'label', 'Follow-up consultation', 'duration_minutes', 30, 'note', 'Check-in after demo or proposal')
    ),
    'duration_options_minutes', jsonb_build_array(15, 30, 45, 60, 90),
    'timezone_note', 'Regional date/time display uses Sales Expert locale and visitor timezone selection — scaffold until live booking page ships.',
    'extends', jsonb_build_object(
      'booking_link', 'organization_sales_expert_settings.booking_link',
      'email_placeholder', 'booking_link in email templates'
    ),
    'status', 'metadata_scaffold'
  );
$$;

create or replace function public._sebbp_blueprint_calendar_integrations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify orchestrates calendars — never replaces them. Context Engine / Universal Calendar provides personal calendar cross-link.',
    'status', 'oauth_scaffold',
    'providers', jsonb_build_array(
      jsonb_build_object('key', 'google', 'label', 'Google Calendar', 'oauth_status', 'pending', 'conflict_avoidance', 'metadata_only'),
      jsonb_build_object('key', 'outlook', 'label', 'Microsoft Outlook', 'oauth_status', 'pending', 'conflict_avoidance', 'metadata_only'),
      jsonb_build_object('key', 'apple', 'label', 'Apple Calendar', 'oauth_status', 'pending', 'conflict_avoidance', 'metadata_only')
    ),
    'context_engine_route', '/app/assistant/calendars',
    'honest_note', 'OAuth connections show pending until authorization completes — never fake sync status.',
    'boundary', 'Calendar sync scaffold — conflict avoidance metadata only; not a replacement calendar app.'
  );
$$;

create or replace function public._sebbp_blueprint_discovery_meetings()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Discovery-first — understand workflow before recommending Aipify modules.',
    'prep_scaffold', jsonb_build_array(
      'Review customer org name and pipeline stage metadata',
      'Prepare industry-aware discovery questions from Coach tab guidance',
      'Confirm booking duration and timezone with prospect',
      'Send booking_link placeholder in one-to-one email when appropriate'
    ),
    'discovery_questions', jsonb_build_array(
      'How does your team handle support and operations today?',
      'Where do repetitive tasks slow people down?',
      'What would a successful first 90 days look like?',
      'Who else should join a demonstration session?'
    ),
    'coach_tab_cross_link', 'Phase 45 demonstration_guidance and discovery questions'
  );
$$;

create or replace function public._sebbp_blueprint_demonstration_bookings()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Demonstration bookings support install-first ABOS positioning — never overpromise.',
    'demo_types', jsonb_build_array(
      jsonb_build_object('key', 'support', 'label', 'Support AI demo', 'note', 'Support workflows inside customer admin'),
      jsonb_build_object('key', 'executive', 'label', 'Executive briefing demo', 'note', 'Morning briefings and operational visibility'),
      jsonb_build_object('key', 'commerce', 'label', 'Commerce demo', 'note', 'Operational commerce intelligence — not a storefront replacement'),
      jsonb_build_object('key', 'community', 'label', 'Community & engagement demo', 'note', 'Relationship and engagement surfaces where licensed')
    ),
    'sales_demo_phase42_note', 'Cross-links Sales Demo booking patterns — demo pipeline_stage on opportunities complements booking metadata.',
    'next_steps', jsonb_build_array('Summarize agreements', 'Schedule follow-up consultation', 'Send welcome or onboarding booking link')
  );
$$;

create or replace function public._sebbp_blueprint_follow_up_engagement()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust through consistency — follow-up demonstrates professionalism.',
    'companion_nudges', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'thoughtful_follow_up', 'example', 'A discovery meeting may benefit from a brief, helpful follow-up this week.'),
      jsonb_build_object('emoji', '🔔', 'key', 'scheduled_reminder', 'example', 'You have follow-ups scheduled — consistency often matters more than intensity.'),
      jsonb_build_object('emoji', '🦉', 'key', 'prep_suggestion', 'example', 'Before your next demo, reviewing discovery notes may help the conversation flow naturally.')
    ),
    'extends', 'organization_sales_expert_follow_ups — cadence_days, template_key, scheduled_for, status',
    'email_templates', jsonb_build_array('post_demo_follow_up', 're_engagement', 'introduction'),
    'boundary', 'Companion nudges suggest — Sales Experts decide timing and content.'
  );
$$;

create or replace function public._sebbp_blueprint_meeting_preparation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'metadata_scaffold',
    'principle', 'Prepared conversations build trust — metadata summaries only, no raw customer content.',
    'prep_sections', jsonb_build_array(
      jsonb_build_object('key', 'customer_background', 'label', 'Customer background summary', 'source', 'organization_sales_expert_customers.notes_metadata'),
      jsonb_build_object('key', 'industry_context', 'label', 'Industry context', 'source', 'opportunity and customer metadata'),
      jsonb_build_object('key', 'discovery_questions', 'label', 'Discovery questions', 'source', 'Phase 45 demonstration_guidance'),
      jsonb_build_object('key', 'demo_pathways', 'label', 'Demo pathways', 'source', 'Phase 43 demonstration_bookings demo_types')
    ),
    'coach_cross_link', 'Phase 45/46 Coach and Certification tabs — meeting prep complements coaching, does not duplicate it.',
    'meeting_collaboration_route', '/app/meeting-collaboration-engine',
    'unified_tasks_route', '/app/unified-tasks-engine'
  );
$$;

create or replace function public._sebbp_engagement_history(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_upcoming_bookings jsonb;
  v_recent_bookings jsonb;
  v_upcoming_follow_ups jsonb;
  v_open_opportunities int;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'booking_type', b.booking_type, 'scheduled_at', b.scheduled_at,
    'duration_minutes', b.duration_minutes, 'status', b.status, 'timezone', b.timezone,
    'customer_id', b.customer_id
  ) order by b.scheduled_at), '[]'::jsonb)
  into v_upcoming_bookings
  from public.organization_sales_expert_bookings b
  where b.organization_id = p_organization_id
    and b.status in ('scheduled', 'confirmed')
    and b.scheduled_at >= now()
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'booking_type', b.booking_type, 'scheduled_at', b.scheduled_at,
    'duration_minutes', b.duration_minutes, 'status', b.status
  ) order by b.scheduled_at desc), '[]'::jsonb)
  into v_recent_bookings
  from public.organization_sales_expert_bookings b
  where b.organization_id = p_organization_id
    and b.status = 'completed'
    and b.scheduled_at >= now() - interval '90 days'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'cadence_days', f.cadence_days, 'template_key', f.template_key,
    'scheduled_for', f.scheduled_for, 'status', f.status, 'customer_id', f.customer_id
  ) order by f.scheduled_for), '[]'::jsonb)
  into v_upcoming_follow_ups
  from public.organization_sales_expert_follow_ups f
  where f.organization_id = p_organization_id
    and f.status = 'scheduled'
  limit 20;

  select count(*) into v_open_opportunities
  from public.organization_sales_expert_opportunities
  where organization_id = p_organization_id and status = 'open';

  return jsonb_build_object(
    'upcoming_bookings', v_upcoming_bookings,
    'recent_completed_bookings', v_recent_bookings,
    'upcoming_follow_ups', v_upcoming_follow_ups,
    'open_opportunities', v_open_opportunities,
    'action_items_note', 'Action items cross-link Unified Tasks A.62 — metadata scaffold until task sync ships.',
    'privacy_note', 'Meeting history from booking and follow-up metadata only — no conversation or email content stored.'
  );
end; $$;

create or replace function public._sebbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_sales_expert_settings;
  v_slug text;
  v_upcoming_follow_ups int := 0;
  v_scheduled_bookings int := 0;
  v_upcoming_bookings_7d int := 0;
  v_completed_bookings_30d int := 0;
  v_demo_stage_opportunities int := 0;
begin
  v_settings := public._sebbp_ensure_booking_settings(p_organization_id);
  v_slug := public._sebbp_resolve_booking_slug(p_organization_id);

  select count(*) into v_upcoming_follow_ups
  from public.organization_sales_expert_follow_ups
  where organization_id = p_organization_id
    and status = 'scheduled'
    and scheduled_for <= now() + interval '14 days';

  select count(*) into v_scheduled_bookings
  from public.organization_sales_expert_bookings
  where organization_id = p_organization_id
    and status in ('scheduled', 'confirmed');

  select count(*) into v_upcoming_bookings_7d
  from public.organization_sales_expert_bookings
  where organization_id = p_organization_id
    and status in ('scheduled', 'confirmed')
    and scheduled_at <= now() + interval '7 days'
    and scheduled_at >= now();

  select count(*) into v_completed_bookings_30d
  from public.organization_sales_expert_bookings
  where organization_id = p_organization_id
    and status = 'completed'
    and scheduled_at >= now() - interval '30 days';

  select count(*) into v_demo_stage_opportunities
  from public.organization_sales_expert_opportunities
  where organization_id = p_organization_id
    and status = 'open'
    and pipeline_stage = 'demo';

  return jsonb_build_object(
    'booking_slug', v_slug,
    'booking_page_enabled', v_settings.booking_page_enabled,
    'booking_page_url', format('https://aipify.ai/book/%s', v_slug),
    'booking_link', v_settings.booking_link,
    'upcoming_follow_ups', v_upcoming_follow_ups,
    'scheduled_bookings', v_scheduled_bookings,
    'upcoming_bookings_7d', v_upcoming_bookings_7d,
    'completed_bookings_30d', v_completed_bookings_30d,
    'demo_stage_opportunities', v_demo_stage_opportunities,
    'calendar_sync_status', 'pending_oauth_scaffold',
    'privacy_note', 'Engagement summary from follow-up and booking metadata — no customer PII content.'
  );
end; $$;

create or replace function public._sebbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sustainable engagement pacing — back-to-back meetings without recovery is not success.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Blocking focus time between demos protects energy for the next conversation.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Follow-up can wait until tomorrow — consistency beats exhaustion.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences engagement tone — metadata and encouragement only.'
  );
$$;

create or replace function public._sebbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transparent booking durations, honest calendar integration status, and metadata-only meeting prep.',
    'experts_should_understand', jsonb_build_array(
      'Booking pages and calendar OAuth show honest pending status until live authorization completes',
      'Meeting prep uses customer org names and pipeline metadata — never raw email or chat content',
      'Follow-up counts derive from organization_sales_expert_follow_ups — companion nudges suggest only',
      'Booking notes field remains empty in scaffold — no customer PII stored in notes',
      'Regional date/time respects locale selection; timezone stored per booking metadata',
      'Demonstration bookings cross-link Coach tab guidance — not automated scheduling without approval'
    ),
    'metadata_only', true,
    'insights_generated_from', jsonb_build_array(
      'organization_sales_expert_follow_ups',
      'organization_sales_expert_bookings',
      'organization_sales_expert_opportunities',
      '_sebbp_engagement_summary'
    )
  );
$$;

create or replace function public._sebbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify Group Sales Experts use booking pages and follow-up cadences internally first',
      'focus', jsonb_build_array('Booking URL clarity', 'Follow-up nudge tone', 'Calendar scaffold honesty', 'Meeting prep usefulness')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot Sales Experts validate personal booking pages before broader partner rollout',
      'note', 'Dogfooding ensures engagement tools never feel intrusive or automated without consent'
    )
  );
$$;

create or replace function public._sebbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Trust through consistency — thoughtful follow-up demonstrates professionalism.',
    'Booking should feel personal and respectful — never pressure or mass outreach.',
    'Prepared meetings build confidence — for Sales Experts and the organizations they serve.'
  );
$$;

create or replace function public._sebbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'context_calendars', 'label', 'Context Engine / Universal Calendar', 'route', '/app/assistant/calendars', 'note', 'Personal calendar sync scaffold — not replacement calendar'),
    jsonb_build_object('key', 'sales_coach', 'label', 'Sales Coach Phase 45/46', 'route', '/app/sales-expert-engine', 'note', 'Meeting prep and discovery guidance on Coach tab'),
    jsonb_build_object('key', 'unified_tasks', 'label', 'Unified Tasks A.62', 'route', '/app/unified-tasks-engine', 'note', 'Action items from meetings — cross-link'),
    jsonb_build_object('key', 'meeting_collaboration', 'label', 'Meeting Collaboration A.61', 'route', '/app/meeting-collaboration-engine', 'note', 'Shared meeting metadata scaffold'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable meeting and follow-up pacing'),
    jsonb_build_object('key', 'email_center', 'label', 'Email Center — booking_link placeholder', 'route', '/app/sales-expert-engine', 'note', 'Extends existing one-to-one templates'),
    jsonb_build_object('key', 'performance_recognition', 'label', 'Performance Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Engagement outcomes complement milestone recognition')
  );
$$;

create or replace function public._sebbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Coach & Enablement Phase 45 (daily coaching) and Email Center (one-to-one templates) — Phase 43 is Engagement & Booking tab: personal booking pages, calendar sync scaffold, follow-up engagement, meeting prep, and engagement history within /app/sales-expert-engine. Cross-links Context Engine calendars, Unified Tasks A.62, Meeting Collaboration A.61, Self Love A.76 — never duplicates.';
$$;

create or replace function public._sebbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_settings public.organization_sales_expert_settings;
begin
  v_summary := public._sebbp_engagement_summary(p_organization_id);
  v_settings := public._sebbp_ensure_booking_settings(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'booking_center', 'label', 'Personal booking center documented', 'met', (public._sebbp_blueprint_booking_center()->>'url_pattern') is not null, 'note', null),
    jsonb_build_object('key', 'calendar_integrations', 'label', 'Calendar integration scaffold — honest OAuth status', 'met', jsonb_array_length(public._sebbp_blueprint_calendar_integrations()->'providers') = 3, 'note', 'OAuth pending until live connectors ship'),
    jsonb_build_object('key', 'discovery_meetings', 'label', 'Discovery meeting prep scaffolded', 'met', jsonb_array_length(public._sebbp_blueprint_discovery_meetings()->'discovery_questions') >= 4, 'note', null),
    jsonb_build_object('key', 'demonstration_bookings', 'label', 'Demonstration booking types documented', 'met', jsonb_array_length(public._sebbp_blueprint_demonstration_bookings()->'demo_types') = 4, 'note', null),
    jsonb_build_object('key', 'follow_up_engagement', 'label', 'Follow-up companion nudges scaffolded', 'met', jsonb_array_length(public._sebbp_blueprint_follow_up_engagement()->'companion_nudges') = 3, 'note', null),
    jsonb_build_object('key', 'meeting_preparation', 'label', 'Meeting preparation sections defined', 'met', jsonb_array_length(public._sebbp_blueprint_meeting_preparation()->'prep_sections') >= 4, 'note', 'Metadata scaffold'),
    jsonb_build_object('key', 'engagement_history', 'label', 'Engagement history from bookings and follow-ups', 'met', (public._sebbp_engagement_history(p_organization_id)->>'privacy_note') is not null, 'note', null),
    jsonb_build_object('key', 'booking_settings', 'label', 'Booking slug and page settings available', 'met', coalesce(v_settings.booking_slug, '') <> '', 'note', format('Booking URL: %s', v_summary->>'booking_page_url')),
    jsonb_build_object('key', 'self_love_connection', 'label', 'Self Love connection for sustainable engagement pacing', 'met', (public._sebbp_blueprint_self_love_connection()->>'route') is not null, 'note', null),
    jsonb_build_object('key', 'trust_transparency', 'label', 'Trust connection explains booking and calendar scaffolds', 'met', jsonb_array_length(public._sebbp_blueprint_trust_connection()->'experts_should_understand') >= 6, 'note', null)
  );
end; $$;

-- Extend dashboard — preserve ALL A.95 + Phase 41 + Phase 45 + Phase 46 + Marketing Center; append Phase 43
create or replace function public.get_sales_expert_operating_system_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_sales_expert_settings;
  v_summary jsonb;
  v_base jsonb;
begin
  perform public._irp_require_permission('sales_expert.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._sebbp_ensure_booking_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);

  v_base := jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sales Expert Operating System — partner portal for pipeline, commissions, training, and one-to-one follow-up. Metadata only — no mass email.',
    'principles', jsonb_build_array(
      'Official partner tiers — never Affiliate publicly',
      'Aipify subscription: Customer ↔ Aipify; consulting: Customer ↔ Sales Expert',
      'One-to-one email only — mass campaigns explicitly not supported',
      'Human approval for sensitive commission and program changes',
      'Metadata only — no raw email bodies or customer PII in logs'
    ),
    'privacy_note', 'Customer org names and commission metadata only — no email content or PII stored.',
    'engine_phase', 'A.95',
    'implementation_blueprint', jsonb_build_object(
      'phase', '33-extension',
      'title', 'Sales Expert Operating System',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'parent', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', v_summary,
    'sections', jsonb_build_object(
      'dashboard', jsonb_build_object(
        'revenue_overview', v_summary,
        'monthly_commissions', jsonb_build_object(
          'pending', v_summary->'monthly_commissions_pending',
          'paid', v_summary->'monthly_commissions_paid',
          'forecasted', v_summary->'forecasted_commissions'
        ),
        'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
        'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
        'active_opportunities', v_summary->'active_opportunities'
      ),
      'customers', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'org_name', c.org_name, 'status', c.status,
          'subscription_status', c.subscription_status,
          'onboarding_progress', c.onboarding_progress,
          'next_follow_up', c.next_follow_up,
          'notes_metadata', c.notes_metadata
        ) order by c.next_follow_up nulls last)
        from public.organization_sales_expert_customers c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
          'estimated_value', o.estimated_value, 'currency', o.currency,
          'next_action', o.next_action, 'recommended_action', o.recommended_action,
          'status', o.status, 'customer_id', o.customer_id
        ) order by
          case o.pipeline_stage
            when 'negotiation' then 0 when 'proposal' then 1 when 'demo' then 2 else 3 end)
        from public.organization_sales_expert_opportunities o
        where o.organization_id = v_org_id and o.status = 'open' limit 50
      ), '[]'::jsonb),
      'commissions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'commission_type', c.commission_type, 'amount', c.amount,
          'currency', c.currency, 'status', c.status,
          'subscription_plan_key', c.subscription_plan_key, 'period_month', c.period_month
        ) order by c.period_month desc)
        from public.organization_sales_expert_commissions c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'email_templates', coalesce((
        select jsonb_agg(jsonb_build_object(
          'template_key', t.template_key, 'title', t.title,
          'subject_pattern', t.subject_pattern, 'category', t.category,
          'placeholders', t.placeholders
        ) order by t.template_key)
        from public.organization_sales_expert_email_templates t
        where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'emails', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id, 'template_key', e.template_key, 'subject_metadata', e.subject_metadata,
          'status', e.status, 'delivery_mode', e.delivery_mode,
          'scheduled_for', e.scheduled_for, 'sent_at', e.sent_at
        ) order by e.created_at desc)
        from public.organization_sales_expert_emails e
        where e.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'follow_ups', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', f.id, 'cadence_days', f.cadence_days, 'template_key', f.template_key,
          'scheduled_for', f.scheduled_for, 'status', f.status, 'customer_id', f.customer_id
        ) order by f.scheduled_for)
        from public.organization_sales_expert_follow_ups f
        where f.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'bookings', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', b.id, 'booking_type', b.booking_type, 'scheduled_at', b.scheduled_at,
          'duration_minutes', b.duration_minutes, 'status', b.status,
          'timezone', b.timezone, 'customer_id', b.customer_id
        ) order by b.scheduled_at)
        from public.organization_sales_expert_bookings b
        where b.organization_id = v_org_id
          and b.status in ('scheduled', 'confirmed')
          and b.scheduled_at >= now() - interval '1 day'
        limit 30
      ), '[]'::jsonb)
    ),
    'official_terminology', public._seos_blueprint_official_terminology(),
    'portal_sections', public._seos_blueprint_portal_sections(),
    'blueprint_email_templates', public._seos_blueprint_email_templates_list(),
    'follow_up_cadences', public._seos_blueprint_follow_up_cadences(),
    'implementation_services', public._seos_blueprint_implementation_services_pricing(),
    'subscription_principles', public._seos_blueprint_subscription_principles(),
    'commercial_commission_summary', public._seos_commercial_commission_summary(v_org_id),
    'mass_email_supported', false,
    'integration_links', jsonb_build_array(
      jsonb_build_object('key', 'marketplace_ecosystem', 'label', 'Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'partners', 'label', 'Partner Certification Phase 91', 'route', '/app/partners'),
      jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine'),
      jsonb_build_object('key', 'certification', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine'),
      jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine'),
      jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine')
    ),
    'training_center', jsonb_build_object(
      'foundations_route', '/app/learning-training-engine',
      'certification_route', '/app/certification-achievement-engine',
      'demo_simulations_note', 'Demo simulations scaffold — metadata only',
      'product_updates_note', 'Product update briefings via Notification Engine — metadata cross-link'
    ),
    'resource_library', jsonb_build_object(
      'status', 'metadata_scaffold',
      'categories', jsonb_build_array('Marketing materials', 'Playbooks', 'Product sheets', 'Templates', 'Case studies'),
      'privacy_note', 'Resource metadata only — assets stored in approved KC or partner program surfaces.'
    ),
    'distinction_note', public._seos_distinction_note()
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase41', jsonb_build_object(
      'phase', 41,
      'title', 'Sales Performance & Recognition Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE41_SALES_PERFORMANCE_RECOGNITION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — cross-links Gratitude & Recognition A.89 Phase 9, not a duplicate engine.'
    ),
    'performance_recognition_mission', 'Help Sales Experts maintain momentum, celebrate achievements, and build sustainable businesses around Aipify.',
    'performance_recognition_philosophy', 'Recognition strengthens motivation. Competition should inspire growth. Success should never come at the expense of integrity.',
    'performance_recognition_abos_principle', 'People thrive when their efforts are noticed. Recognition should reinforce values, not ego.',
    'performance_objectives', public._sprbp_blueprint_objectives(),
    'performance_dashboard_fields', public._sprbp_blueprint_performance_dashboard_fields(),
    'performance_summary', public._sprbp_performance_summary(v_org_id),
    'milestone_recognition', public._sprbp_blueprint_milestones(),
    'milestone_progress', public._sprbp_milestone_progress(v_org_id),
    'bell_moments', public._sprbp_blueprint_bell_moments(),
    'recognition_roses', public._sprbp_blueprint_recognition_roses(),
    'leaderboards', public._sprbp_blueprint_leaderboards(),
    'performance_self_love_connection', public._sprbp_blueprint_self_love_connection(),
    'performance_trust_connection', public._sprbp_blueprint_trust_connection(),
    'performance_dogfooding', public._sprbp_blueprint_dogfooding(),
    'performance_vision_phrases', public._sprbp_blueprint_vision_phrases(),
    'performance_integration_links', public._sprbp_blueprint_integration_links(),
    'performance_blueprint_success_criteria', public._sprbp_blueprint_success_criteria(v_org_id),
    'performance_distinction_note', public._sprbp_distinction_note()
  ) || jsonb_build_object(
    'implementation_blueprint_phase45', jsonb_build_object(
      'phase', 45,
      'title', 'Sales Coach & Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Coach & Enablement tab; cross-links Phase 41 bell moments without duplication.'
    ),
    'sales_coach_mission', 'Equip Sales Experts with supportive coaching, enablement guidance, and sustainable pacing — never punitive judgment.',
    'sales_coach_philosophy', 'Coaching strengthens confidence. Guidance should inspire thoughtful action. Success should never come at the expense of wellbeing or integrity.',
    'sales_coach_abos_principle', 'People thrive when they feel equipped and respected. Coaching should reinforce professional growth, not pressure.',
    'sales_companion_roles', public._scebp_blueprint_companion_roles(),
    'sales_coach_dashboard_fields', public._scebp_blueprint_coach_dashboard_fields(),
    'sales_coach_summary', public._scebp_coach_summary(v_org_id),
    'daily_sales_briefing', public._scebp_daily_briefing(v_org_id),
    'sales_activity_recommendations', public._scebp_activity_recommendations(v_org_id),
    'field_sales_coaching', public._scebp_blueprint_field_sales_coaching(),
    'demonstration_guidance', public._scebp_blueprint_demonstration_guidance(),
    'objection_handling_library', public._scebp_blueprint_objection_handling_library(),
    'communication_coaching', public._scebp_blueprint_communication_coaching(),
    'personal_performance_insights', public._scebp_performance_insights(v_org_id),
    'sales_coach_self_love_connection', public._scebp_blueprint_self_love_connection(),
    'sales_coach_bell_moments', public._scebp_blueprint_bell_moments(),
    'sales_training_integration', public._scebp_blueprint_sales_training_integration(),
    'roleplay_simulation', public._scebp_blueprint_roleplay_simulation(),
    'sales_coach_trust_connection', public._scebp_blueprint_trust_connection(),
    'sales_coach_dogfooding', public._scebp_blueprint_dogfooding(),
    'sales_coach_success_criteria', public._scebp_blueprint_success_criteria(v_org_id),
    'sales_coach_vision_phrases', public._scebp_blueprint_vision_phrases(),
    'sales_coach_distinction_note', public._scebp_distinction_note(),
    'sales_coach_integration_links', public._scebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase46', jsonb_build_object(
      'phase', 46,
      'title', 'Sales Coach Certification & Field Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Certification & Field Enablement tab; cross-links A.37, A.36, Phase 91, Phase 45 coach tab.'
    ),
    'sales_certification_mission', 'Develop competent professionals — training strengthens confidence; certification reflects genuine competence.',
    'sales_certification_philosophy', 'Assessment encourages growth, not fear. Mastery not exclusion. Field enablement supports excellence at a sustainable pace.',
    'sales_certification_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through genuine capability — certification means readiness to help organizations work smarter.',
    'sales_training_pathway', public._sccfebp_blueprint_sales_training_pathway(),
    'sales_simulation_engine', public._sccfebp_blueprint_sales_simulation_engine(),
    'telephone_sales_coaching', public._sccfebp_blueprint_telephone_sales_coaching(),
    'assessment_principles', public._sccfebp_blueprint_assessment_principles(),
    'certification_requirements', public._sccfebp_blueprint_certification_requirements(),
    'reassessment_principles', public._sccfebp_blueprint_reassessment_principles(),
    'certification_display', public._sccfebp_blueprint_certification_display(),
    'email_enablement_center', public._sccfebp_blueprint_email_enablement_center(),
    'implementation_pricing_guidance', public._sccfebp_blueprint_implementation_pricing_guidance(),
    'installation_experience_journey', public._sccfebp_blueprint_installation_experience_journey(),
    'field_sales_enablement', public._sccfebp_blueprint_field_sales_enablement(),
    'sales_performance_culture', public._sccfebp_blueprint_sales_performance_culture(),
    'sales_certification_summary', public._sccfebp_certification_summary(v_org_id),
    'sales_certification_self_love_connection', public._sccfebp_blueprint_self_love_connection(),
    'sales_certification_trust_connection', public._sccfebp_blueprint_trust_connection(),
    'sales_certification_dogfooding', public._sccfebp_blueprint_dogfooding(),
    'sales_certification_success_criteria', public._sccfebp_blueprint_success_criteria(v_org_id),
    'sales_certification_vision_phrases', public._sccfebp_blueprint_vision_phrases(),
    'sales_certification_distinction_note', public._sccfebp_distinction_note(),
    'sales_certification_integration_links', public._sccfebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'sales_expert_marketing_center', public._seosmc_marketing_center_bundle(v_org_id)
  ) || jsonb_build_object(
    'implementation_blueprint_phase42', jsonb_build_object(
      'phase', 42,
      'title', 'Sales Demo & Experience Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE42_SALES_DEMO_EXPERIENCE.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Demo tab; cross-links Coach Phase 45/46, Certification Module 4, Simulation Lab Phase 78 (NOT sales demos).'
    ),
    'sales_demo_mission', 'Help Sales Experts deliver outcome-focused demonstrations that help prospects envision a better future.',
    'sales_demo_philosophy', 'People invest in outcomes, not features. Demos should inspire confidence through honest, tailored storytelling.',
    'sales_demo_objectives', public._sdebp_blueprint_objectives(),
    'demo_environments', public._sdebp_blueprint_demo_environments(),
    'demo_data_examples', public._sdebp_blueprint_demo_data_examples(),
    'industry_demonstrations', public._sdebp_blueprint_industry_demonstrations(),
    'demo_guidance', public._sdebp_blueprint_demo_guidance(),
    'discovery_question_library', public._sdebp_blueprint_discovery_question_library(),
    'demo_flow_structure', public._sdebp_blueprint_demo_flow_structure(),
    'custom_demo_experiences', public._sdebp_blueprint_custom_demo_experiences(),
    'demo_links_scaffold', public._sdebp_blueprint_demo_links_scaffold(),
    'demo_links_summary', public._sdebp_demo_links_summary(v_org_id),
    'companion_demo_experience', public._sdebp_blueprint_companion_demo_experience(),
    'sales_demo_self_love_connection', public._sdebp_blueprint_self_love_connection(),
    'sales_demo_trust_connection', public._sdebp_blueprint_trust_connection(),
    'sales_demo_dogfooding', public._sdebp_blueprint_dogfooding(),
    'sales_demo_success_criteria', public._sdebp_blueprint_success_criteria(v_org_id),
    'sales_demo_vision_phrases', public._sdebp_blueprint_vision_phrases(),
    'sales_demo_abos_principle', 'Aipify Business Operating System (ABOS) demos show how operational AI augments people — humans decide, Aipify informs and prepares.',
    'sales_demo_distinction_note', public._sdebp_distinction_note(),
    'sales_demo_integration_links', public._sdebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase43', jsonb_build_object(
      'phase', 43,
      'title', 'Sales Engagement & Booking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE43_SALES_ENGAGEMENT_BOOKING.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Engagement & Booking tab; cross-links Context Engine calendars, Coach 45/46, Unified Tasks A.62, Meeting Collaboration A.61, Self Love A.76.'
    ),
    'engagement_mission', 'Help Sales Experts schedule meetings professionally, follow up consistently, and prepare thoughtfully — trust through consistency.',
    'engagement_philosophy', 'Follow-up demonstrates professionalism. Booking should feel personal and respectful — never pressure or mass outreach.',
    'engagement_abos_principle', 'Aipify Business Operating System (ABOS) partners build trust through prepared, consistent engagement — humans decide; Aipify informs and prepares.',
    'engagement_objectives', public._sebbp_blueprint_objectives(),
    'booking_center', public._sebbp_blueprint_booking_center(),
    'calendar_integrations', public._sebbp_blueprint_calendar_integrations(),
    'discovery_meetings', public._sebbp_blueprint_discovery_meetings(),
    'demonstration_bookings', public._sebbp_blueprint_demonstration_bookings(),
    'follow_up_engagement', public._sebbp_blueprint_follow_up_engagement(),
    'meeting_preparation', public._sebbp_blueprint_meeting_preparation(),
    'engagement_history', public._sebbp_engagement_history(v_org_id),
    'engagement_summary', public._sebbp_engagement_summary(v_org_id),
    'engagement_self_love_connection', public._sebbp_blueprint_self_love_connection(),
    'engagement_trust_connection', public._sebbp_blueprint_trust_connection(),
    'engagement_dogfooding', public._sebbp_blueprint_dogfooding(),
    'engagement_success_criteria', public._sebbp_blueprint_success_criteria(v_org_id),
    'engagement_vision_phrases', public._sebbp_blueprint_vision_phrases(),
    'engagement_distinction_note', public._sebbp_distinction_note(),
    'engagement_integration_links', public._sebbp_blueprint_integration_links()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
  v_perf jsonb;
  v_coach jsonb;
  v_cert jsonb;
  v_marketing jsonb;
  v_demo_env jsonb;
  v_demo_links jsonb;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._sebbp_ensure_booking_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);
  v_demo_env := public._sdebp_blueprint_demo_environments();
  v_demo_links := public._sdebp_demo_links_summary(v_org_id);
  v_engagement := public._sebbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Professional partner portal — Customers, Opportunities, Pipeline, Commission Overview.',
    'engine_phase', 'A.95',
    'route', '/app/sales-expert-engine',
    'active_opportunities', v_summary->'active_opportunities',
    'monthly_commissions_pending', v_summary->'monthly_commissions_pending',
    'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
    'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
    'milestones_achieved', v_perf->'milestones_achieved',
    'performance_recognition_phase', 41,
    'sales_coach_enablement_phase', 45,
    'sales_certification_field_enablement_phase', 46,
    'sales_expert_marketing_center_phase', '33-extension-marketing',
    'sales_demo_experience_phase', 42,
    'sales_engagement_booking_phase', 43,
    'coach_suggested_actions', v_coach->'suggested_next_actions_count',
    'coach_scheduled_demos', v_coach->'scheduled_demos',
    'coach_brief_summary', format(
      '%s follow-ups · %s demos · %s new this month',
      coalesce(v_coach->>'upcoming_follow_ups', '0'),
      coalesce(v_coach->>'scheduled_demos', '0'),
      coalesce(v_coach->>'new_customers_this_month', '0')
    ),
    'certification_tier_label', v_cert->'current_tier_label',
    'certification_attempts_remaining', v_cert->'attempts_remaining',
    'certification_brief_summary', format(
      '%s · %s attempts remaining',
      coalesce(v_cert->>'current_tier_label', 'Training in progress'),
      coalesce(v_cert->>'attempts_remaining', '3')
    ),
    'marketing_link_clicks', v_marketing->'link_clicks',
    'marketing_signups', v_marketing->'signups',
    'marketing_subscriptions', v_marketing->'subscriptions',
    'marketing_brief_summary', format(
      '%s clicks · %s signups · %s subscriptions',
      coalesce(v_marketing->>'link_clicks', '0'),
      coalesce(v_marketing->>'signups', '0'),
      coalesce(v_marketing->>'subscriptions', '0')
    ),
    'demo_environments_count', jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb)),
    'demo_links_active_count', v_demo_links->'active_links_count',
    'demo_brief_summary', format(
      '%s demo environments · %s active links (scaffold)',
      coalesce(jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb))::text, '0'),
      coalesce(v_demo_links->>'active_links_count', '0')
    ),
    'engagement_scheduled_bookings', v_engagement->'scheduled_bookings',
    'engagement_upcoming_bookings_7d', v_engagement->'upcoming_bookings_7d',
    'engagement_booking_page_url', v_engagement->'booking_page_url',
    'engagement_brief_summary', format(
      '%s follow-ups · %s bookings · %s this week',
      coalesce(v_engagement->>'upcoming_follow_ups', '0'),
      coalesce(v_engagement->>'scheduled_bookings', '0'),
      coalesce(v_engagement->>'upcoming_bookings_7d', '0')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._sebbp_resolve_booking_slug(uuid) to authenticated;
grant execute on function public._sebbp_ensure_booking_settings(uuid) to authenticated;
grant execute on function public._sebbp_blueprint_objectives() to authenticated;
grant execute on function public._sebbp_blueprint_booking_center() to authenticated;
grant execute on function public._sebbp_blueprint_calendar_integrations() to authenticated;
grant execute on function public._sebbp_blueprint_discovery_meetings() to authenticated;
grant execute on function public._sebbp_blueprint_demonstration_bookings() to authenticated;
grant execute on function public._sebbp_blueprint_follow_up_engagement() to authenticated;
grant execute on function public._sebbp_blueprint_meeting_preparation() to authenticated;
grant execute on function public._sebbp_engagement_history(uuid) to authenticated;
grant execute on function public._sebbp_engagement_summary(uuid) to authenticated;
grant execute on function public._sebbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._sebbp_blueprint_trust_connection() to authenticated;
grant execute on function public._sebbp_blueprint_dogfooding() to authenticated;
grant execute on function public._sebbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._sebbp_blueprint_integration_links() to authenticated;
grant execute on function public._sebbp_blueprint_success_criteria(uuid) to authenticated;
