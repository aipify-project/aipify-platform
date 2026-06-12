-- Implementation Blueprint Phase 50 — Sales Legacy & Success Engine
-- Extends Sales Expert Operating System (A.95 + Phases 41–49, marketing, 43, 44, 47, 48). No new tables.

create or replace function public._slsbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 50 — Sales Legacy & Success at /app/sales-expert-engine Legacy tab (menu: Legacy / Journey). Distinct from Organizational Memory Engine OME Phase 50 at /app/memory (institutional memory for tenant organizations). Distinct from Legacy Engine A.86 at /app/legacy-engine (org wisdom and milestone storytelling). Distinct from Organizational Resilience Engine A.50 (continuity planning). Blueprint Phase 50 celebrates Sales Expert personal and business contribution in the partner portal only — metadata aggregates from _seos_* tables plus Phase 41 milestones and Phase 47 community/mentorship. Cross-links Gratitude A.89, Self Love A.76, Impact A.85 — integrate, never duplicate.';
$$;

create or replace function public._slsbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Help Sales Experts see the meaningful arc of their Aipify journey — reflection, contribution awareness, authentic milestones, and sustainable success that celebrates character and service, not revenue alone.';
$$;

create or replace function public._slsbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Legacy is lived through relationships and consistent care. Milestones should feel authentic. Recognition celebrates contribution and growth — never vanity metrics or comparison shame.';
$$;

create or replace function public._slsbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) partners build lasting value when they can pause, reflect, and see how their work helped organizations — humans decide what matters; Aipify surfaces honest metadata.';
$$;

create or replace function public._slsbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Thoughtful review of partner journey — tenure, milestones, and growth arcs'),
    jsonb_build_object('key', 'contribution_awareness', 'label', 'Contribution awareness', 'description', 'Organizations supported, customers retained, community and mentorship given — metadata only'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestones', 'description', 'First customer, demo, renewal, mentee, international reach — authentic timeline'),
    jsonb_build_object('key', 'growth_visibility', 'label', 'Growth visibility', 'description', 'Training sessions, demos, and community contributions over time'),
    jsonb_build_object('key', 'storytelling', 'label', 'Storytelling', 'description', 'Optional recognition experiences — celebrate character and service'),
    jsonb_build_object('key', 'sustainable_success', 'label', 'Sustainable success', 'description', 'Self Love reflection prompts — pace and purpose over pressure')
  );
$$;

create or replace function public._slsbp_legacy_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_created timestamptz;
  v_tenure_years numeric := 0;
  v_orgs_supported int := 0;
  v_customers_retained int := 0;
  v_demos int := 0;
  v_training_sessions int := 0;
  v_community_contributions int := 0;
  v_mentorship_count int := 0;
  v_milestones_achieved int := 0;
begin
  select o.created_at into v_org_created
  from public.organizations o where o.id = p_organization_id;

  if v_org_created is not null then
    v_tenure_years := round((extract(epoch from now() - v_org_created) / (365.25 * 86400))::numeric, 1);
  end if;

  select count(*)::int into v_orgs_supported
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id
    and c.status in ('active', 'onboarding', 'at_risk');

  select count(*)::int into v_customers_retained
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id
    and c.status = 'active'
    and c.subscription_status = 'active';

  select count(*)::int into v_demos
  from public.organization_sales_expert_bookings b
  where b.organization_id = p_organization_id
    and b.booking_type in ('demo', 'demonstration', 'discovery')
    and b.status in ('completed', 'scheduled');

  if v_demos = 0 then
    select count(*)::int into v_demos
    from public.organization_sales_expert_opportunities o
    where o.organization_id = p_organization_id
      and o.pipeline_stage in ('demo', 'proposal', 'negotiation')
      and o.status in ('open', 'won');
  end if;

  select count(*)::int into v_training_sessions
  from public.organization_sales_expert_commissions cm
  where cm.organization_id = p_organization_id
    and cm.commission_type = 'training'
    and cm.status in ('paid', 'pending', 'approved');

  perform public._scmbp_ensure_settings(p_organization_id);
  perform public._scmbp_seed_org_stories(p_organization_id);

  select count(*)::int into v_community_contributions
  from public.sales_expert_success_stories s
  where s.organization_id = p_organization_id;

  select count(*)::int into v_mentorship_count
  from public.sales_expert_mentorship_links m
  where m.organization_id = p_organization_id
    and m.status in ('active', 'completed');

  v_milestones_achieved := coalesce((
    select count(*)::int from jsonb_array_elements(public._sprbp_milestone_progress(p_organization_id)->'milestones') m
    where coalesce((m->>'met')::boolean, false)
  ), 0);

  return jsonb_build_object(
    'status', 'live_metadata',
    'principle', 'Legacy dashboard aggregates tenant-scoped Sales Expert metadata — celebrates contribution, not revenue alone.',
    'tenure_years', v_tenure_years,
    'orgs_supported', v_orgs_supported,
    'customers_retained', v_customers_retained,
    'demos_delivered', v_demos,
    'training_sessions', v_training_sessions,
    'community_contributions', v_community_contributions,
    'mentorship_relationships', v_mentorship_count,
    'milestones_achieved', v_milestones_achieved,
    'performance_phase41_cross_link', 'Phase 41 milestone recognition — complementary, not duplicated',
    'community_phase47_cross_link', 'Phase 47 community stories and mentorship — aggregated here for legacy view',
    'privacy_note', 'Metadata counts only — no customer PII, email content, or cross-tenant benchmarks.'
  );
exception when others then
  return jsonb_build_object('status', 'metadata_scaffold', 'privacy_note', 'Legacy summary scaffold — metadata only.');
end; $$;

create or replace function public._slsbp_success_timeline(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_first_customer timestamptz;
  v_first_demo timestamptz;
  v_first_renewal timestamptz;
  v_first_mentee timestamptz;
  v_first_international timestamptz;
  v_events jsonb := '[]'::jsonb;
begin
  select min(c.created_at) into v_first_customer
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id
    and c.status in ('active', 'onboarding', 'at_risk');

  select min(b.scheduled_at) into v_first_demo
  from public.organization_sales_expert_bookings b
  where b.organization_id = p_organization_id
    and b.booking_type in ('demo', 'demonstration')
    and b.status in ('completed', 'scheduled');

  if v_first_demo is null then
    select min(o.created_at) into v_first_demo
    from public.organization_sales_expert_opportunities o
    where o.organization_id = p_organization_id and o.pipeline_stage = 'demo';
  end if;

  select min(c.updated_at) into v_first_renewal
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id
    and (
      c.subscription_status = 'active'
      and coalesce(c.metadata->>'renewed', 'false') = 'true'
      or coalesce(c.notes_metadata->>'renewal_conversation', 'false') = 'true'
    );

  select min(m.created_at) into v_first_mentee
  from public.sales_expert_mentorship_links m
  where m.organization_id = p_organization_id
    and m.status in ('active', 'completed');

  select min(c.created_at) into v_first_international
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id
    and (
      coalesce(c.metadata->>'international', 'false') = 'true'
      or coalesce(c.notes_metadata->>'region', '') not in ('', 'nordic', 'no', 'sv', 'da')
      or coalesce(c.metadata->>'country', '') not in ('', 'NO', 'SE', 'DK', 'Norway', 'Sweden', 'Denmark')
    );

  v_events := jsonb_build_array(
    jsonb_build_object(
      'key', 'first_customer', 'emoji', '🔔', 'label', 'First customer',
      'occurred_at', v_first_customer,
      'achieved', v_first_customer is not null,
      'guidance', 'The moment you helped an organization begin their Aipify journey.'
    ),
    jsonb_build_object(
      'key', 'first_demo', 'emoji', '🦉', 'label', 'First demonstration',
      'occurred_at', v_first_demo,
      'achieved', v_first_demo is not null,
      'guidance', 'Your first focused demo — preparation and honesty mattered.'
    ),
    jsonb_build_object(
      'key', 'first_renewal', 'emoji', '🌹', 'label', 'First renewal conversation',
      'occurred_at', v_first_renewal,
      'achieved', v_first_renewal is not null,
      'guidance', 'Relationship-focused renewal — Phase 44 complements this milestone.'
    ),
    jsonb_build_object(
      'key', 'first_mentee', 'emoji', '❤️', 'label', 'First mentee',
      'occurred_at', v_first_mentee,
      'achieved', v_first_mentee is not null,
      'guidance', 'Voluntary mentorship — Phase 47 community legacy.'
    ),
    jsonb_build_object(
      'key', 'first_international_customer', 'emoji', '🌍', 'label', 'First international customer',
      'occurred_at', v_first_international,
      'achieved', v_first_international is not null,
      'guidance', 'Expanding ethical Aipify partnerships beyond your home region.'
    )
  );

  return jsonb_build_object(
    'principle', 'Success timeline surfaces authentic firsts from Sales Expert metadata — optional reflection, never pressure.',
    'events', v_events,
    'companion_emojis', jsonb_build_array('🌹', '🔔', '🦉', '❤️', '🌍'),
    'renewal_phase44_cross_link', 'Customer Renewal & Expansion Phase 44',
    'community_phase47_cross_link', 'Sales Community & Mentorship Phase 47',
    'privacy_note', 'Timeline dates from tenant customer, booking, and mentorship metadata — no PII.'
  );
exception when others then
  return jsonb_build_object('events', '[]'::jsonb, 'privacy_note', 'Timeline scaffold — metadata only.');
end; $$;

create or replace function public._slsbp_impact_insights(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_orgs int := 0;
  v_training int := 0;
  v_demos int := 0;
  v_stories int := 0;
  v_mentorship int := 0;
  v_retained int := 0;
begin
  v_summary := public._slsbp_legacy_summary(p_organization_id);
  v_orgs := coalesce((v_summary->>'orgs_supported')::int, 0);
  v_training := coalesce((v_summary->>'training_sessions')::int, 0);
  v_demos := coalesce((v_summary->>'demos_delivered')::int, 0);
  v_stories := coalesce((v_summary->>'community_contributions')::int, 0);
  v_mentorship := coalesce((v_summary->>'mentorship_relationships')::int, 0);
  v_retained := coalesce((v_summary->>'customers_retained')::int, 0);

  return jsonb_build_object(
    'principle', 'Impact insights are aggregate metadata counts — illustrative phrasing, never customer-identifiable records.',
    'insights', jsonb_build_array(
      jsonb_build_object('key', 'organizations_supported', 'count', v_orgs, 'label', format('%s organizations supported', v_orgs), 'emoji', '🌹'),
      jsonb_build_object('key', 'customers_retained', 'count', v_retained, 'label', format('%s customers retained', v_retained), 'emoji', '🔔'),
      jsonb_build_object('key', 'training_sessions', 'count', v_training, 'label', format('%s training sessions', v_training), 'emoji', '🦉'),
      jsonb_build_object('key', 'demonstrations', 'count', v_demos, 'label', format('%s demonstrations', v_demos), 'emoji', '🔔'),
      jsonb_build_object('key', 'community_stories', 'count', v_stories, 'label', format('%s community contributions', v_stories), 'emoji', '❤️'),
      jsonb_build_object('key', 'mentorship_relationships', 'count', v_mentorship, 'label', format('%s mentorship relationships', v_mentorship), 'emoji', '❤️')
    ),
    'impact_engine_route', '/app/impact-engine',
    'impact_engine_note', 'Impact Engine A.85 — organizational impact proof; Sales Expert legacy is partner-portal scoped',
    'metadata_only', true,
    'privacy_note', 'Counts only — no revenue totals paraded as self-worth; celebrate service and consistency.'
  );
end; $$;

create or replace function public._slsbp_mentorship_legacy(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_community jsonb;
  v_mentored int := 0;
  v_stories int := 0;
begin
  perform public._scmbp_ensure_settings(p_organization_id);
  v_community := public._scmbp_community_summary(p_organization_id);

  select count(*)::int into v_mentored
  from public.sales_expert_mentorship_links m
  where m.organization_id = p_organization_id
    and m.status in ('active', 'completed');

  v_stories := coalesce((v_community->>'stories_count')::int, 0);

  return jsonb_build_object(
    'principle', 'Mentorship legacy celebrates voluntary guidance and knowledge shared — never hierarchy or status games.',
    'mentored_count', v_mentored,
    'community_stories_count', v_stories,
    'active_mentorships', coalesce((v_community->>'active_mentorships')::int, 0),
    'contributors_count', coalesce((v_community->>'contributors_count')::int, 0),
    'knowledge_shared_note', 'Success story library and community hub — Phase 47 metadata summaries only',
    'community_tab_cross_link', 'Phase 47 Community tab — live discussions and mentorship opt-in',
    'gratitude_cross_link', 'Gratitude & Recognition A.89 — voluntary appreciation experiences',
    'privacy_note', 'Mentorship counts and story metadata — no mentee PII.'
  );
end; $$;

create or replace function public._slsbp_blueprint_recognition_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition experiences are optional and authentic — celebrate character, consistency, and contribution.',
    'experiences', jsonb_build_array(
      jsonb_build_object('key', 'community_builder', 'emoji', '🌹', 'label', 'Community Builder', 'description', 'Shared honest stories and answered peer questions that educated others'),
      jsonb_build_object('key', 'trusted_advisor', 'emoji', '🔔', 'label', 'Trusted Advisor', 'description', 'Sustained customer relationships with ethical guidance and renewal care'),
      jsonb_build_object('key', 'five_year_milestone', 'emoji', '🦉', 'label', 'Five-Year Milestone', 'description', 'Five years as an Aipify Sales Expert — reflection on service, not tenure vanity'),
      jsonb_build_object('key', 'legacy_contributor', 'emoji', '❤️', 'label', 'Legacy Contributor', 'description', 'Mentorship, training, and community knowledge that outlasts any single quarter')
    ),
    'optional', true,
    'gratitude_route', '/app/gratitude-recognition-engine',
    'performance_phase41_cross_link', 'Phase 41 milestone recognition — bell moments and encouragement leaderboards',
    'tone', 'authentic_not_boastful'
  );
$$;

create or replace function public._slsbp_blueprint_self_love_reflection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Reflection prompts invite pause and self-respect — sustainable success is paced, not frantic.',
    'prompts', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'prompt', 'What kind of partner do I want to be remembered as — beyond any commission statement?'),
      jsonb_build_object('emoji', '❤️', 'prompt', 'Which customer relationships am I most proud of — and what values did I bring to them?'),
      jsonb_build_object('emoji', '❤️', 'prompt', 'How have I grown since my first customer — in skill, patience, and integrity?'),
      jsonb_build_object('emoji', '❤️', 'prompt', 'What would sustainable success look like for me next year — without comparison to others?')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 — encouragement only; legacy view never implies you must achieve more to matter.'
  );
$$;

create or replace function public._slsbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Your worth is not your pipeline. Legacy reflection supports self-respect and sustainable pacing.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'A quiet quarter does not erase years of honest service — reflection can restore perspective.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Celebrate how you showed up for customers — not only how many subscribed.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences legacy tone — never guilt or comparison.'
  );
$$;

create or replace function public._slsbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Authentic milestones from metadata — honest about scaffolds, never inflated for marketing.',
    'experts_should_understand', jsonb_build_array(
      'Legacy summary aggregates _seos_* customer, commission, booking, and follow-up metadata',
      'Timeline firsts derive from earliest tenant records — may be empty until real activity exists',
      'Impact insights are count metadata only — not customer-identifiable proof statements',
      'Distinct from OME Phase 50 at /app/memory — institutional org memory, not Sales Expert partner legacy',
      'Distinct from Legacy Engine A.86 at /app/legacy-engine — tenant org wisdom, not partner portal journey',
      'Distinct from Organizational Resilience A.50 — continuity planning, not career reflection',
      'Recognition experiences are optional scaffolds — authentic tone, never boastful leaderboards',
      'Phase 41 performance milestones and Phase 47 community data integrate here — not duplicated engines'
    ),
    'metadata_only', true,
    'optional_experiences_note', 'Recognition experiences may be offered — Sales Experts choose whether to engage.'
  );
$$;

create or replace function public._slsbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify Group Sales Experts validate legacy dashboard fields, timeline tone, and recognition authenticity internally first',
      'focus', jsonb_build_array('Contribution-not-revenue messaging', 'Self Love reflection prompts', 'OME/Legacy A.86 distinction accuracy', 'Impact count phrasing')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot Sales Experts review success timeline and recognition experiences before broader partner rollout',
      'note', 'Dogfooding ensures legacy never feels like vanity metrics or mandatory self-promotion'
    )
  );
$$;

create or replace function public._slsbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Sales Experts build legacy through consistent care — organizations remember how you showed up.',
    'Milestones mark authentic firsts — reflection is optional, never pressured.',
    'Sustainable success honors character and contribution — revenue is one signal among many.'
  );
$$;

create or replace function public._slsbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'performance_recognition', 'label', 'Performance & Recognition Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Milestones, bell moments, encouragement leaderboards'),
    jsonb_build_object('key', 'community_mentorship', 'label', 'Community & Mentorship Phase 47', 'route', '/app/sales-expert-engine', 'note', 'Stories, voluntary mentorship, community badges'),
    jsonb_build_object('key', 'operations', 'label', 'Operations Phase 48', 'route', '/app/sales-expert-engine', 'note', 'Independent business visibility — service tracking metadata'),
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition experiences — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Reflection prompts and sustainable pacing'),
    jsonb_build_object('key', 'impact_engine', 'label', 'Impact Engine A.85', 'route', '/app/impact-engine', 'note', 'Organizational impact proof — distinct from partner legacy counts'),
    jsonb_build_object('key', 'legacy_engine_a86', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'note', 'Tenant org wisdom — NOT Sales Expert portal legacy'),
    jsonb_build_object('key', 'ome_phase50', 'label', 'OME Phase 50', 'route', '/app/memory', 'note', 'Organizational memory — NOT this blueprint'),
    jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational Resilience A.50', 'route', '/app/organizational-resilience-engine', 'note', 'Continuity planning — different engine')
  );
$$;

create or replace function public._slsbp_legacy_center_bundle(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'mission', public._slsbp_blueprint_mission(),
    'philosophy', public._slsbp_blueprint_philosophy(),
    'abos_principle', public._slsbp_blueprint_abos_principle(),
    'objectives', public._slsbp_blueprint_objectives(),
    'legacy_summary', public._slsbp_legacy_summary(p_organization_id),
    'success_timeline', public._slsbp_success_timeline(p_organization_id),
    'impact_insights', public._slsbp_impact_insights(p_organization_id),
    'mentorship_legacy', public._slsbp_mentorship_legacy(p_organization_id),
    'recognition_experiences', public._slsbp_blueprint_recognition_experiences(),
    'self_love_reflection', public._slsbp_blueprint_self_love_reflection(),
    'self_love', public._slsbp_blueprint_self_love_connection(),
    'trust', public._slsbp_blueprint_trust_connection(),
    'dogfooding', public._slsbp_blueprint_dogfooding(),
    'distinction_note', public._slsbp_distinction_note(),
    'integration_links', public._slsbp_blueprint_integration_links(),
    'success_criteria', public._slsbp_blueprint_success_criteria(p_organization_id),
    'vision', public._slsbp_blueprint_vision_phrases(),
    'privacy_note', 'Sales Expert legacy metadata only — celebrate contribution, never store customer PII.'
  );
end; $$;

create or replace function public._slsbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_timeline jsonb;
  v_impact jsonb;
begin
  v_summary := public._slsbp_legacy_summary(p_organization_id);
  v_timeline := public._slsbp_success_timeline(p_organization_id);
  v_impact := public._slsbp_impact_insights(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'legacy_objectives', 'label', 'Six legacy objectives documented', 'met', jsonb_array_length(public._slsbp_blueprint_objectives()) = 6, 'note', null),
    jsonb_build_object('key', 'legacy_summary', 'label', 'Legacy summary from _seos_* and Phase 41/47 metadata', 'met', (v_summary->>'principle') is not null, 'note', null),
    jsonb_build_object('key', 'success_timeline', 'label', 'Success timeline with five authentic firsts', 'met', jsonb_array_length(v_timeline->'events') = 5, 'note', 'Emojis 🌹🔔🦉❤️🌍'),
    jsonb_build_object('key', 'impact_insights', 'label', 'Impact insights aggregate counts only', 'met', coalesce((v_impact->>'metadata_only')::boolean, false) = true, 'note', null),
    jsonb_build_object('key', 'mentorship_legacy', 'label', 'Mentorship legacy cross-links Phase 47', 'met', (public._slsbp_mentorship_legacy(p_organization_id)->>'community_tab_cross_link') is not null, 'note', null),
    jsonb_build_object('key', 'recognition_authentic', 'label', 'Recognition experiences use authentic-not-boastful tone', 'met', (public._slsbp_blueprint_recognition_experiences()->>'tone') = 'authentic_not_boastful', 'note', null),
    jsonb_build_object('key', 'self_love_reflection', 'label', 'Self Love reflection prompts documented', 'met', jsonb_array_length(public._slsbp_blueprint_self_love_reflection()->'prompts') >= 4, 'note', null),
    jsonb_build_object('key', 'distinction_note', 'label', 'OME, Legacy A.86, and Resilience A.50 collisions documented', 'met', public._slsbp_distinction_note() like '%OME Phase 50%', 'note', null),
    jsonb_build_object('key', 'trust_optional', 'label', 'Trust connection documents optional recognition experiences', 'met', (public._slsbp_blueprint_trust_connection()->>'optional_experiences_note') is not null, 'note', null),
    jsonb_build_object('key', 'live_metadata', 'label', 'Legacy dashboard derives from tenant metadata', 'met', (v_summary->>'status') in ('live_metadata', 'metadata_scaffold'), 'note', case when coalesce((v_summary->>'orgs_supported')::int, 0) = 0 then 'Add customers to populate legacy dashboard.' else null end)
  );
end; $$;


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
  perform public._scmbp_ensure_settings(v_org_id);
  perform public._sobmbp_ensure_business_goals(v_org_id);
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
  ) || jsonb_build_object(
    'implementation_blueprint_phase44', jsonb_build_object(
      'phase', 44,
      'title', 'Customer Renewal & Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE44_CUSTOMER_RENEWAL_EXPANSION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Renewal & Expansion tab; distinct from Autonomous Execution Framework Phase 44 (/app/action-center).'
    ),
    'renewal_expansion_mission', 'Help Sales Experts nurture long-term customer partnerships through renewal awareness, health insights, and consultative expansion — never aggressive upsell.',
    'renewal_expansion_philosophy', 'Renewals should feel intentional, not accidental. Customer health metadata supports care — never surveillance or blame.',
    'renewal_expansion_abos_principle', 'Aipify Business Operating System (ABOS) partnerships grow when organizations succeed — humans decide, Aipify prepares renewal conversations with clarity.',
    'renewal_expansion_objectives', public._crebp_blueprint_objectives(),
    'renewal_dashboard_fields', public._crebp_blueprint_renewal_dashboard_fields(),
    'renewal_expansion_summary', public._crebp_renewal_summary(v_org_id),
    'renewal_companion_examples', public._crebp_blueprint_companion_examples(),
    'customer_health_insights', public._crebp_blueprint_health_insights(),
    'success_review_questions', public._crebp_blueprint_success_review_questions(),
    'expansion_opportunities', public._crebp_blueprint_expansion_opportunities(),
    'renewal_playbooks', public._crebp_blueprint_renewal_playbooks(),
    'customer_celebration_experiences', public._crebp_blueprint_celebration_experiences(),
    'churn_prevention_support', public._crebp_blueprint_churn_prevention(),
    'renewal_sales_expert_insights', public._crebp_blueprint_sales_expert_insights(),
    'renewal_expansion_self_love_connection', public._crebp_blueprint_self_love_connection(),
    'renewal_expansion_trust_connection', public._crebp_blueprint_trust_connection(),
    'renewal_expansion_dogfooding', public._crebp_blueprint_dogfooding(),
    'renewal_expansion_success_criteria', public._crebp_blueprint_success_criteria(v_org_id),
    'renewal_expansion_vision_phrases', public._crebp_blueprint_vision_phrases(),
    'renewal_expansion_distinction_note', public._crebp_distinction_note(),
    'renewal_expansion_integration_links', public._crebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase48', jsonb_build_object(
      'phase', 48,
      'title', 'Sales Operations & Business Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE48_SALES_OPERATIONS_BUSINESS_MANAGEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Operations tab; cross-links commercial, performance, renewal, goals, capacity, Self Love; distinct from Value Realization A.48.'
    ),
    'sales_operations_mission', 'Help independent Sales Experts see revenue, goals, capacity, and service obligations clearly — so they can build sustainable Aipify businesses.',
    'sales_operations_philosophy', 'Operational visibility supports planning. Forecasts inform; they never pressure. You operate your own business — Aipify augments awareness.',
    'sales_operations_abos_principle', 'Aipify Business Operating System (ABOS) partners thrive with honest metadata, sustainable pacing, and human judgment — not automated business management.',
    'sales_operations_objectives', public._sobmbp_blueprint_objectives(),
    'sales_operations_dashboard_fields', public._sobmbp_blueprint_business_dashboard_fields(),
    'sales_operations_summary', public._sobmbp_operations_summary(v_org_id),
    'sales_business_goal_management', public._sobmbp_blueprint_goal_management(),
    'sales_business_goals_summary', public._sobmbp_business_goals_summary(v_org_id),
    'sales_capacity_awareness', public._sobmbp_blueprint_capacity_awareness(),
    'sales_service_tracking', public._sobmbp_blueprint_service_tracking(),
    'sales_forecasting_support', public._sobmbp_blueprint_forecasting_support(),
    'sales_operations_self_love_connection', public._sobmbp_blueprint_self_love_connection(),
    'sales_operations_trust_connection', public._sobmbp_blueprint_trust_connection(),
    'sales_operations_dogfooding', public._sobmbp_blueprint_dogfooding(),
    'sales_operations_success_criteria', public._sobmbp_blueprint_success_criteria(v_org_id),
    'sales_operations_vision_phrases', public._sobmbp_blueprint_vision_phrases(),
    'sales_operations_distinction_note', public._sobmbp_distinction_note(),
    'sales_operations_integration_links', public._sobmbp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase47', jsonb_build_object(
      'phase', 47,
      'title', 'Sales Community & Mentorship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE47_SALES_COMMUNITY_MENTORSHIP.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Community tab; peer learning and voluntary mentorship within partner portal.'
    ),
    'sales_community_mission', public._scmbp_blueprint_mission(),
    'sales_community_philosophy', public._scmbp_blueprint_philosophy(),
    'sales_community_abos_principle', public._scmbp_blueprint_abos_principle(),
    'sales_community_objectives', public._scmbp_blueprint_objectives(),
    'sales_expert_community_center', public._scmbp_community_center_bundle(v_org_id),
    'sales_community_distinction_note', public._scmbp_distinction_note(),
    'sales_community_integration_links', public._scmbp_blueprint_integration_links(),
    'sales_community_success_criteria', public._scmbp_blueprint_success_criteria(v_org_id),
    'sales_community_vision_phrases', public._scmbp_blueprint_vision_phrases()
  ) || jsonb_build_object(
    'implementation_blueprint_phase49', jsonb_build_object(
      'phase', 49,
      'title', 'Sales Intelligence & Opportunity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE49_SALES_INTELLIGENCE_OPPORTUNITY.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Intelligence tab; partner portal opportunity guidance only. Distinct from Predictive Insights A.66, Strategic Intelligence A.31, Industry Intelligence A.44, Cross-Tenant A.71.'
    ),
    'sales_intelligence_mission', 'Help Sales Experts see their pipeline clearly, prioritize thoughtfully, and act with integrity — intelligence informs, humans decide.',
    'sales_intelligence_philosophy', 'Not every opportunity is urgent. Scores and categories support focus — sustainable pacing protects wellbeing and professional judgment.',
    'sales_intelligence_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through informed, relationship-first sales — Aipify prepares context; Sales Experts choose every action.',
    'sales_intelligence_objectives', public._siobp_blueprint_objectives(),
    'opportunity_insights', public._siobp_blueprint_opportunity_insights(),
    'sales_intelligence_summary', public._siobp_intelligence_summary(v_org_id),
    'pipeline_intelligence', public._siobp_pipeline_insights(v_org_id),
    'industry_insights', public._siobp_blueprint_industry_insights(),
    'follow_up_intelligence', public._siobp_follow_up_intelligence(v_org_id),
    'opportunity_scoring', public._siobp_opportunity_scores(v_org_id),
    'sales_intelligence_self_love_connection', public._siobp_blueprint_self_love_connection(),
    'sales_intelligence_trust_connection', public._siobp_blueprint_trust_connection(),
    'sales_intelligence_dogfooding', public._siobp_blueprint_dogfooding(),
    'sales_intelligence_success_criteria', public._siobp_blueprint_success_criteria(v_org_id),
    'sales_intelligence_vision_phrases', public._siobp_blueprint_vision_phrases(),
    'sales_intelligence_distinction_note', public._siobp_distinction_note(),
    'sales_intelligence_integration_links', public._siobp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase47', jsonb_build_object(
      'phase', 47,
      'title', 'Sales Community & Mentorship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE47_SALES_COMMUNITY_MENTORSHIP.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Community tab; peer learning and voluntary mentorship within partner portal.'
    ),
    'sales_community_mission', public._scmbp_blueprint_mission(),
    'sales_community_philosophy', public._scmbp_blueprint_philosophy(),
    'sales_community_abos_principle', public._scmbp_blueprint_abos_principle(),
    'sales_community_objectives', public._scmbp_blueprint_objectives(),
    'sales_expert_community_center', public._scmbp_community_center_bundle(v_org_id),
    'sales_community_distinction_note', public._scmbp_distinction_note(),
    'sales_community_integration_links', public._scmbp_blueprint_integration_links(),
    'sales_community_success_criteria', public._scmbp_blueprint_success_criteria(v_org_id),
    'sales_community_vision_phrases', public._scmbp_blueprint_vision_phrases()
  ) || jsonb_build_object(
    'implementation_blueprint_phase48', jsonb_build_object(
      'phase', 48,
      'title', 'Sales Operations & Business Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE48_SALES_OPERATIONS_BUSINESS_MANAGEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Operations tab; cross-links commercial, performance, renewal, goals, capacity, Self Love; distinct from Value Realization A.48.'
    ),
    'sales_operations_mission', 'Help independent Sales Experts see revenue, goals, capacity, and service obligations clearly — so they can build sustainable Aipify businesses.',
    'sales_operations_philosophy', 'Operational visibility supports planning. Forecasts inform; they never pressure. You operate your own business — Aipify augments awareness.',
    'sales_operations_abos_principle', 'Aipify Business Operating System (ABOS) partners thrive with honest metadata, sustainable pacing, and human judgment — not automated business management.',
    'sales_operations_objectives', public._sobmbp_blueprint_objectives(),
    'sales_operations_dashboard_fields', public._sobmbp_blueprint_business_dashboard_fields(),
    'sales_operations_summary', public._sobmbp_operations_summary(v_org_id),
    'sales_business_goal_management', public._sobmbp_blueprint_goal_management(),
    'sales_business_goals_summary', public._sobmbp_business_goals_summary(v_org_id),
    'sales_capacity_awareness', public._sobmbp_blueprint_capacity_awareness(),
    'sales_service_tracking', public._sobmbp_blueprint_service_tracking(),
    'sales_forecasting_support', public._sobmbp_blueprint_forecasting_support(),
    'sales_operations_self_love_connection', public._sobmbp_blueprint_self_love_connection(),
    'sales_operations_trust_connection', public._sobmbp_blueprint_trust_connection(),
    'sales_operations_dogfooding', public._sobmbp_blueprint_dogfooding(),
    'sales_operations_success_criteria', public._sobmbp_blueprint_success_criteria(v_org_id),
    'sales_operations_vision_phrases', public._sobmbp_blueprint_vision_phrases(),
    'sales_operations_distinction_note', public._sobmbp_distinction_note(),
    'sales_operations_integration_links', public._sobmbp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase50', jsonb_build_object(
      'phase', 50,
      'title', 'Sales Legacy & Success Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE50_SALES_LEGACY_SUCCESS.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Legacy / Journey tab; Sales Expert personal and business legacy in partner portal only. Distinct from OME Phase 50, Legacy Engine A.86, Organizational Resilience A.50.'
    ),
    'sales_legacy_mission', public._slsbp_blueprint_mission(),
    'sales_legacy_philosophy', public._slsbp_blueprint_philosophy(),
    'sales_legacy_abos_principle', public._slsbp_blueprint_abos_principle(),
    'sales_legacy_objectives', public._slsbp_blueprint_objectives(),
    'sales_legacy_summary', public._slsbp_legacy_summary(v_org_id),
    'sales_success_timeline', public._slsbp_success_timeline(v_org_id),
    'sales_impact_insights', public._slsbp_impact_insights(v_org_id),
    'sales_mentorship_legacy', public._slsbp_mentorship_legacy(v_org_id),
    'sales_legacy_recognition', public._slsbp_blueprint_recognition_experiences(),
    'sales_legacy_self_love_reflection', public._slsbp_blueprint_self_love_reflection(),
    'sales_legacy_center', public._slsbp_legacy_center_bundle(v_org_id),
    'sales_legacy_self_love_connection', public._slsbp_blueprint_self_love_connection(),
    'sales_legacy_trust_connection', public._slsbp_blueprint_trust_connection(),
    'sales_legacy_dogfooding', public._slsbp_blueprint_dogfooding(),
    'sales_legacy_success_criteria', public._slsbp_blueprint_success_criteria(v_org_id),
    'sales_legacy_vision_phrases', public._slsbp_blueprint_vision_phrases(),
    'sales_legacy_distinction_note', public._slsbp_distinction_note(),
    'sales_legacy_integration_links', public._slsbp_blueprint_integration_links()
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
  v_renewal jsonb;
  v_intelligence jsonb;
  v_community jsonb;
  v_ops jsonb;
  v_legacy jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  perform public._scmbp_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);
  v_demo_env := public._sdebp_blueprint_demo_environments();
  v_demo_links := public._sdebp_demo_links_summary(v_org_id);
  v_renewal := public._crebp_renewal_summary(v_org_id);
  v_intelligence := public._siobp_intelligence_summary(v_org_id);
  v_community := public._scmbp_community_summary(v_org_id);
  v_ops := public._sobmbp_operations_summary(v_org_id);
  v_legacy := public._slsbp_legacy_summary(v_org_id);

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
    'customer_renewal_expansion_phase', 44,
    'sales_intelligence_opportunity_phase', 49,
    'sales_community_mentorship_phase', 47,
    'sales_operations_business_management_phase', 48,
    'sales_legacy_success_phase', 50,
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
    'renewal_upcoming_count', v_renewal->'upcoming_renewals_count',
    'renewal_at_risk_count', v_renewal->'at_risk_count',
    'renewal_brief_summary', format(
      '%s upcoming · %s at-risk · readiness %s%%',
      coalesce(v_renewal->>'upcoming_renewals_count', '0'),
      coalesce(v_renewal->>'at_risk_count', '0'),
      coalesce(v_renewal->>'average_readiness_pct', '0')
    ),
    'intelligence_stale_count', v_intelligence->'stale_opportunities_count',
    'intelligence_demo_candidates_count', v_intelligence->'demo_candidates_count',
    'intelligence_brief_summary', format(
      '%s open · %s demo candidates · %s stale',
      coalesce(v_intelligence->>'active_opportunities', '0'),
      coalesce(v_intelligence->>'demo_candidates_count', '0'),
      coalesce(v_intelligence->>'stale_opportunities_count', '0')
    ),
    'community_stories_count', v_community->'stories_count',
    'community_active_mentorships', v_community->'active_mentorships',
    'community_brief_summary', format(
      '%s stories · %s mentorships · %s contributors',
      coalesce(v_community->>'stories_count', '0'),
      coalesce(v_community->>'active_mentorships', '0'),
      coalesce(v_community->>'contributors_count', '0')
    ),
    'operations_active_customers', v_ops->'active_customers',
    'operations_support_obligations', v_ops->'support_obligations',
    'operations_brief_summary', format(
      '%s customers · %s support obligations',
      coalesce(v_ops->>'active_customers', '0'),
      coalesce(v_ops->>'support_obligations', '0')
    ),
    'legacy_orgs_supported', v_legacy->'orgs_supported',
    'legacy_tenure_years', v_legacy->'tenure_years',
    'legacy_brief_summary', format(
      '%s yrs · %s orgs · %s retained',
      coalesce(v_legacy->>'tenure_years', '0'),
      coalesce(v_legacy->>'orgs_supported', '0'),
      coalesce(v_legacy->>'customers_retained', '0')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;


grant execute on function public._slsbp_distinction_note() to authenticated;
grant execute on function public._slsbp_blueprint_mission() to authenticated;
grant execute on function public._slsbp_blueprint_philosophy() to authenticated;
grant execute on function public._slsbp_blueprint_abos_principle() to authenticated;
grant execute on function public._slsbp_blueprint_objectives() to authenticated;
grant execute on function public._slsbp_legacy_summary(uuid) to authenticated;
grant execute on function public._slsbp_success_timeline(uuid) to authenticated;
grant execute on function public._slsbp_impact_insights(uuid) to authenticated;
grant execute on function public._slsbp_mentorship_legacy(uuid) to authenticated;
grant execute on function public._slsbp_blueprint_recognition_experiences() to authenticated;
grant execute on function public._slsbp_blueprint_self_love_reflection() to authenticated;
grant execute on function public._slsbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._slsbp_blueprint_trust_connection() to authenticated;
grant execute on function public._slsbp_blueprint_dogfooding() to authenticated;
grant execute on function public._slsbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._slsbp_blueprint_integration_links() to authenticated;
grant execute on function public._slsbp_legacy_center_bundle(uuid) to authenticated;
grant execute on function public._slsbp_blueprint_success_criteria(uuid) to authenticated;
