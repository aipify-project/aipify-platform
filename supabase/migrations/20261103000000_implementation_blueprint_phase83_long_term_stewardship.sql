-- Implementation Blueprint Phase 83 — Long-Term Stewardship Engine
-- Extends Legacy Engine Phase A.86. No new tables.
-- Distinct from Inclusion & Humanity Engine A.83, Personalization & Workstyle repo Phase 83, Purpose & Values A.82.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._ltbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 83 — Long-Term Stewardship Engine at /app/legacy-engine. Extends Legacy Engine Phase A.86 (20260935000000_legacy_engine_phase_a86.sql). Distinct from Inclusion & Humanity Engine A.83 at /app/inclusion-humanity-engine (repo engine phase number collision with ABOS blueprint 83). Distinct from Personalization & Workstyle repo Phase 83 at /app/settings/personalization. Distinct from Purpose & Values A.82 / Blueprint Phase 64 at /app/purpose-values-engine (organizational values — cross-link for values-driven stewardship). Distinct from Growth & Evolution A.81 at /app/growth-evolution-engine (sustainable growth cross-link). Distinct from Organizational Memory A.34 at /app/organizational-memory-engine (decision register — integrates). Distinct from Continuity Blueprint Phase 73 at /app/continuity. Distinct from Impact Engine A.85 at /app/impact-engine. Engine helpers use _leg_* — Blueprint Phase 83 MUST use _ltbp_* only. Stewardship = responsibility not pressure — metadata only.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._ltbp_mission()
returns text language sql immutable as $$
  select 'Cultivate responsible, sustainable, values-driven leadership that supports enduring success.';
$$;

create or replace function public._ltbp_philosophy()
returns text language sql immutable as $$
  select 'Stewardship means caring for something beyond oneself — leadership preserves opportunities for tomorrow, not only today''s results.';
$$;

create or replace function public._ltbp_abos_principle()
returns text language sql immutable as $$
  select 'Leadership means caring for people, preserving opportunities, and leaving systems stronger. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._ltbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'long_term_thinking', 'label', 'Long-term thinking', 'description', 'Five-year influence, intergenerational perspective, and enduring value framing'),
    jsonb_build_object('key', 'responsible_leadership', 'label', 'Responsible leadership', 'description', 'Stewardship mindset — responsibility not pressure; service and intentional care'),
    jsonb_build_object('key', 'sustainable_growth', 'label', 'Sustainable growth', 'description', 'Healthy growth that strengthens teams, systems, and values visibility'),
    jsonb_build_object('key', 'values_driven_decisions', 'label', 'Values-driven decision-making', 'description', 'Cross-link Purpose & Values Phase 64 — everyday choices reflect organizational values'),
    jsonb_build_object('key', 'legacy_awareness', 'label', 'Organizational legacy awareness', 'description', 'Reputation, knowledge preservation, leadership development, cultural continuity'),
    jsonb_build_object('key', 'intergenerational_perspective', 'label', 'Intergenerational perspective', 'description', 'Current actions shape futures — wisdom passed forward through stories and milestones')
  );
$$;

create or replace function public._ltbp_stewardship_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship questions — encourage long-term reflection without pressure.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'five_year_influence', 'question', 'How might this decision influence the organization five years from now?', 'description', 'Long-term thinking — not paralysis by distant hypotheticals'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengths_to_preserve', 'question', 'Which strengths should we preserve as the organization grows?', 'description', 'Cultural continuity — traditions central to identity'),
      jsonb_build_object('emoji', '❤️', 'key', 'responsibilities_with_opportunities', 'question', 'What responsibilities accompany the opportunities we pursue?', 'description', 'Stewardship pairs opportunity with care for people and systems'),
      jsonb_build_object('emoji', '🔔', 'key', 'legacy_through_actions', 'question', 'What legacy are we building through our current actions?', 'description', 'Everyday choices shape futures — legacy awareness without manufactured nostalgia')
    ),
    'reflection_note', 'Questions invite stewardship dialogue — responsibility not pressure.'
  );
$$;

create or replace function public._ltbp_sustainable_growth()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sustainable growth — growth strengthens, not weakens, people and systems.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'healthy_growth', 'label', 'Healthy growth evaluation', 'description', 'Pace and scale that support quality, not only expansion metrics'),
      jsonb_build_object('key', 'team_support', 'label', 'Team support during growth', 'description', 'Capacity, onboarding, and sustainable workload — cross-link Growth & Evolution A.81'),
      jsonb_build_object('key', 'system_resilience', 'label', 'System resilience', 'description', 'Processes and knowledge that scale without fragile dependencies'),
      jsonb_build_object('key', 'values_visibility', 'label', 'Values visibility', 'description', 'Values remain visible as organization grows — cross-link Purpose & Values Phase 64')
    ),
    'growth_note', 'Growth should strengthen the organization — not weaken culture, quality, or care for people.'
  );
$$;

create or replace function public._ltbp_legacy_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy awareness — everyday choices shape organizational futures.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'organizational_reputation', 'label', 'Organizational reputation', 'description', 'Trust built through consistent, values-aligned actions over time'),
      jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'description', 'Stories, milestones, and approved learning passed to future teams — integrates Org Memory A.34'),
      jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development', 'description', 'Developing leaders who steward people and systems — cross-link Executive Reflection Phase 82'),
      jsonb_build_object('key', 'community_contribution', 'label', 'Community contribution', 'description', 'Positive impact beyond immediate operations — authentic, not performative'),
      jsonb_build_object('key', 'cultural_continuity', 'label', 'Cultural continuity', 'description', 'Traditions and rhythms worth preserving as the organization evolves')
    ),
    'awareness_note', 'Legacy is shaped daily — A.86 storytelling and milestone recognition make wisdom visible.'
  );
$$;

create or replace function public._ltbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — stewardship as responsibility, not pressure.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'invest_during_growth', 'prompt', 'During rapid growth, investing in people and systems often preserves long-term strength — would a stewardship summary help leadership review?', 'consideration', 'Sustainable scaling — not growth-at-all-costs framing'),
      jsonb_build_object('emoji', '🌹', 'key', 'traditions_central', 'prompt', 'Some traditions may be central to organizational identity — would highlighting strengths to preserve help planning?', 'consideration', 'Cultural continuity deserves intentional care'),
      jsonb_build_object('emoji', '🔔', 'key', 'long_term_discussion', 'prompt', 'Long-term implications often deserve thoughtful discussion — shall I prepare stewardship questions for review?', 'consideration', 'Responsibility not pressure — humans decide timing and scope')
    )
  );
$$;

create or replace function public._ltbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable expectations, perspective, and appreciation for collective effort.',
    'practices', jsonb_build_array(
      'Sustainable expectations — building something meaningful often requires patience',
      'Perspective — stewardship spans years, not only quarterly results',
      'Recognition of contribution — honor progress, challenges, and collective effort',
      'Appreciation for collective effort — leadership serves people, not only metrics'
    ),
    'journey_phrase', 'Building something meaningful often requires patience.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable leadership reflection — principle only; Long-Term Stewardship stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._ltbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — stewardship observations, sustainability reflections, and legacy indicators.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'stewardship_observations', 'label', 'Stewardship observations', 'description', 'Story and milestone metadata — patterns of preservation and celebration'),
      jsonb_build_object('emoji', '🦉', 'key', 'sustainability_reflections', 'label', 'Sustainability reflections', 'description', 'Growth pacing, team support signals, and values visibility themes'),
      jsonb_build_object('emoji', '🌹', 'key', 'legacy_indicators', 'label', 'Legacy indicators', 'description', 'Knowledge, people, customer, and innovation legacy dimensions — A.86 storytelling')
    ),
    'dialogue_note', 'Insights support stewardship discussions — never pressure or guilt-based leadership copy.'
  );
$$;

create or replace function public._ltbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about information sources, limitations, and optional insights.',
    'leaders_should_know', jsonb_build_array(
      'Which metadata sources contributed — legacy story and milestone counts only',
      'Limitation principles — stewardship as responsibility not pressure; no manufactured nostalgia',
      'Insights are optional and human-controlled — long-term framing supports dialogue, not dictation',
      'Distinct from impact measurement, organizational memory registers, and personal workstyle preferences'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Long-Term Stewardship extends Legacy Engine A.86 — same route, no duplicate storage',
      'Distinct from Inclusion & Humanity A.83, Personalization repo Phase 83, Purpose & Values A.82',
      'Values-driven stewardship cross-links Purpose & Values Phase 64 and Growth A.81',
      'Humans decide — Aipify informs, prepares, and recommends'
    ),
    'audit_note', 'Legacy settings, milestone acknowledgment, and export events audited via _leg_* workflows — metadata only.'
  );
$$;

create or replace function public._ltbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates long-term stewardship patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — ecosystem development, companion philosophy, leadership evolution, organizational sustainability',
      'focus', jsonb_build_array(
        'Ecosystem development with enduring partner and customer value',
        'Companion philosophy evolution — stewardship of trust and capability',
        'Leadership evolution and sustainable organizational growth',
        'Organizational sustainability — building systems stronger for tomorrow'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce stewardship, team sustainability, customer legacy',
      'focus', jsonb_build_array(
        'Sustainable growth during seasonal scaling',
        'Knowledge and support quality preservation as operations expand',
        'Customer relationship stewardship and community contribution'
      )
    )
  );
$$;

create or replace function public._ltbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We are building something that will continue creating value long after today''s challenges have passed.',
    'Leadership as responsibility, service, and intentional care.',
    'Stewardship preserves opportunities for tomorrow — not only today''s results.',
    'Growth should strengthen the organization — people, systems, and values.',
    'Everyday choices shape organizational futures.',
    'Building something meaningful often requires patience.',
    'Humans decide — Aipify informs and prepares.'
  );
$$;

create or replace function public._ltbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Purpose & Values (Blueprint Phase 64)', 'route', '/app/purpose-values-engine', 'note', 'Values-driven stewardship — organizational values cross-link'),
    jsonb_build_object('label', 'Growth & Evolution Engine (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Sustainable growth and post-change learning cross-link'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Decision register — integrates with knowledge preservation'),
    jsonb_build_object('label', 'Executive Reflection (Blueprint Phase 82)', 'route', '/app/executive-insights-engine', 'note', 'Leadership development and intentional reflection cross-link'),
    jsonb_build_object('label', 'Companion Evolution Council (Phase 65)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Companion philosophy stewardship — values-driven capability review'),
    jsonb_build_object('label', 'Continuity (Blueprint Phase 73)', 'route', '/app/continuity', 'note', 'Continuity planning and readiness — distinct from legacy storytelling'),
    jsonb_build_object('label', 'Impact Engine (A.85)', 'route', '/app/impact-engine', 'note', 'Outcome measurement — Legacy remembers why it mattered'),
    jsonb_build_object('label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Distinct engine — repo phase number collision with Blueprint 83'),
    jsonb_build_object('label', 'Personalization & Workstyle (Repo Phase 83)', 'route', '/app/settings/personalization', 'note', 'Personal workstyle — distinct from organizational stewardship'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable expectations and perspective — principle only')
  );
$$;

create or replace function public._ltbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_story_count int := 0;
  v_milestone_count int := 0;
  v_uncelebrated int := 0;
  v_stories_by_dimension jsonb := '{}'::jsonb;
begin
  select count(*) into v_story_count
  from public.organization_legacy_stories where organization_id = p_organization_id;

  select count(*) into v_milestone_count
  from public.organization_legacy_milestones where organization_id = p_organization_id;

  select count(*) into v_uncelebrated
  from public.organization_legacy_milestones
  where organization_id = p_organization_id and celebrated = false;

  select coalesce(jsonb_object_agg(dimension, cnt), '{}'::jsonb) into v_stories_by_dimension
  from (
    select dimension, count(*) as cnt
    from public.organization_legacy_stories
    where organization_id = p_organization_id
    group by dimension
  ) d;

  return jsonb_build_object(
    'story_count', coalesce(v_story_count, 0),
    'milestone_count', coalesce(v_milestone_count, 0),
    'uncelebrated_milestones', coalesce(v_uncelebrated, 0),
    'stories_by_dimension', v_stories_by_dimension,
    'stewardship_questions', jsonb_array_length(public._ltbp_stewardship_questions()->'questions'),
    'sustainable_growth_dimensions', jsonb_array_length(public._ltbp_sustainable_growth()->'dimensions'),
    'legacy_awareness_dimensions', jsonb_array_length(public._ltbp_legacy_awareness()->'dimensions'),
    'companion_examples', jsonb_array_length(public._ltbp_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — legacy story and milestone counts. No PII, no manufactured nostalgia.'
  );
end; $$;

create or replace function public._ltbp_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_story_count int := 0;
  v_milestone_count int := 0;
begin
  v_engagement := public._ltbp_engagement_summary(p_organization_id);
  v_story_count := coalesce((v_engagement->>'story_count')::int, 0);
  v_milestone_count := coalesce((v_engagement->>'milestone_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'long_term_thinking',
      'label', 'Stronger long-term thinking — stewardship questions documented',
      'met', jsonb_array_length(public._ltbp_stewardship_questions()->'questions') >= 4,
      'note', 'Five-year influence, strengths to preserve, responsibilities, legacy through actions.'
    ),
    jsonb_build_object(
      'key', 'sustainable_leadership',
      'label', 'Increased sustainable leadership — sustainable growth dimensions documented',
      'met', jsonb_array_length(public._ltbp_sustainable_growth()->'dimensions') >= 4,
      'note', 'Healthy growth, team support, system resilience, values visibility.'
    ),
    jsonb_build_object(
      'key', 'visible_values',
      'label', 'Visible values — values-driven stewardship cross-links documented',
      'met', jsonb_array_length(public._ltbp_integration_links()) >= 8,
      'note', 'Cross-link Purpose & Values Phase 64 for values-driven decision-making.'
    ),
    jsonb_build_object(
      'key', 'stewardship_discussions',
      'label', 'Deeper stewardship discussions — companion guidance documented',
      'met', jsonb_array_length(public._ltbp_companion_guidance()->'examples') >= 3,
      'note', 'Invest during growth, traditions central, long-term implications deserve discussion.'
    ),
    jsonb_build_object(
      'key', 'legacy_awareness',
      'label', 'Growing legacy awareness — stories and milestones tracked',
      'met', v_story_count >= 0 and v_milestone_count >= 0,
      'note', case when v_story_count = 0 and v_milestone_count = 0 then 'Seed or add legacy stories and milestones to validate stewardship engagement.' else null end
    ),
    jsonb_build_object(
      'key', 'legacy_awareness_dimensions',
      'label', 'Legacy awareness dimensions documented',
      'met', jsonb_array_length(public._ltbp_legacy_awareness()->'dimensions') >= 5,
      'note', 'Reputation, knowledge preservation, leadership development, community, cultural continuity.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — stewardship observations documented',
      'met', jsonb_array_length(public._ltbp_leadership_insights()->'insight_types') >= 3,
      'note', 'Stewardship observations, sustainability reflections, legacy indicators.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, limitations, optional insights documented',
      'met', jsonb_array_length(public._ltbp_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable expectations and patience documented',
      'met', (public._ltbp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Building something meaningful often requires patience.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Purpose Phase 64, Growth A.81, Org Memory A.34, Executive Reflection Phase 82, Companion Evolution Phase 65',
      'met', jsonb_array_length(public._ltbp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate stewardship storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group ecosystem development, companion philosophy, organizational sustainability',
      'met', (public._ltbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.86 fields; append Phase 83
-- ---------------------------------------------------------------------------
create or replace function public.get_legacy_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_legacy_engine_settings;
begin
  perform public._irp_require_permission('legacy_engine.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._leg_ensure_settings(v_org_id);
  perform public._leg_seed_stories(v_org_id);
  perform public._leg_seed_milestones(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizations are stories — lessons, challenges, innovations, and support form legacy.',
    'mission', 'Protect organizational wisdom for future employees, customers, and leaders.',
    'abos_principle', 'Remembering why progress mattered.',
    'vision', 'We built something meaningful.',
    'distinction_note',
      'Distinct from Organizational Memory A.34 (/app/organizational-memory-engine), OME Phase 50 (/app/memory), and Impact Engine A.85 (/app/impact-engine). Legacy = storytelling, milestone recognition, wisdom preservation.',
    'legacy_dimensions', public._leg_legacy_dimensions(),
    'storytelling_examples', public._leg_storytelling_examples(),
    'milestone_examples', public._leg_milestone_examples(),
    'self_love_note', public._leg_self_love_note(),
    'trust_note', public._leg_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_stories', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'dimension', s.dimension,
          'title', s.title,
          'summary', s.summary,
          'timeline_ref', s.timeline_ref,
          'metadata', s.metadata,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_legacy_stories
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'recent_milestones', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'milestone_key', m.milestone_key,
          'summary', m.summary,
          'achieved_at', m.achieved_at,
          'celebrated', m.celebrated,
          'metadata', m.metadata,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) order by m.achieved_at desc
      )
      from (
        select * from public.organization_legacy_milestones
        where organization_id = v_org_id
        order by achieved_at desc
        limit 15
      ) m
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'story_count', coalesce((
        select count(*) from public.organization_legacy_stories where organization_id = v_org_id
      ), 0),
      'stories_by_dimension', coalesce((
        select jsonb_object_agg(dimension, cnt)
        from (
          select dimension, count(*) as cnt
          from public.organization_legacy_stories
          where organization_id = v_org_id
          group by dimension
        ) d
      ), '{}'::jsonb),
      'milestone_count', coalesce((
        select count(*) from public.organization_legacy_milestones where organization_id = v_org_id
      ), 0),
      'uncelebrated_milestones', coalesce((
        select count(*) from public.organization_legacy_milestones
        where organization_id = v_org_id and celebrated = false
      ), 0),
      'celebrate_milestones', v_settings.celebrate_milestones,
      'preserve_stories', v_settings.preserve_stories
    ),
    'integration_links', jsonb_build_object(
      'impact_engine', '/app/impact-engine',
      'organizational_memory', '/app/organizational-memory-engine',
      'organizational_memory_timeline', '/app/memory',
      'purpose_values', '/app/purpose-values-engine',
      'growth_evolution', '/app/growth-evolution-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('legacy_engine.manage'),
      'can_export', public._irp_has_permission('legacy_engine.export'),
      'can_acknowledge_milestones', public._irp_has_permission('legacy_engine.milestones.acknowledge')
    ),
    'implementation_blueprint_phase83', jsonb_build_object(
      'phase', 'Phase 83 — Long-Term Stewardship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE83_LONG_TERM_STEWARDSHIP.md',
      'engine_phase', 'A.86 Legacy Engine',
      'route', '/app/legacy-engine',
      'mapping_note', 'ABOS Blueprint Phase 83 extends Legacy Engine A.86 with stewardship mindset, sustainable growth framing, legacy awareness, companion guidance, and live success criteria. Distinct from Inclusion & Humanity A.83 and Personalization repo Phase 83 (phase number collision).'
    ),
    'long_term_stewardship_note', 'Long-Term Stewardship Engine (ABOS Phase 83) — cultivate responsible, sustainable, values-driven leadership that supports enduring success.',
    'blueprint_distinction_note', public._ltbp_distinction_note(),
    'blueprint_mission', public._ltbp_mission(),
    'blueprint_philosophy', public._ltbp_philosophy(),
    'blueprint_abos_principle', public._ltbp_abos_principle(),
    'blueprint_objectives', public._ltbp_objectives(),
    'stewardship_questions', public._ltbp_stewardship_questions(),
    'sustainable_growth', public._ltbp_sustainable_growth(),
    'legacy_awareness', public._ltbp_legacy_awareness(),
    'companion_guidance', public._ltbp_companion_guidance(),
    'blueprint_self_love_connection', public._ltbp_self_love_connection(),
    'leadership_insights', public._ltbp_leadership_insights(),
    'blueprint_trust_connection', public._ltbp_trust_connection(),
    'blueprint_dogfooding', public._ltbp_dogfooding(),
    'blueprint_integration_links', public._ltbp_integration_links(),
    'engagement_summary', public._ltbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._ltbp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._ltbp_vision_phrases(),
    'blueprint_privacy_note', 'Long-term stewardship and Phase 83 blueprint data is metadata only — legacy story and milestone counts. No PII, no manufactured nostalgia, no pressure-based leadership copy. Humans decide; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.86 fields; append Phase 83 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_legacy_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_stories int := 0;
  v_milestones int := 0;
  v_uncelebrated int := 0;
  v_engagement jsonb;
begin
  perform public._irp_require_permission('legacy_engine.view');
  v_org_id := public._mta_require_organization();
  perform public._leg_ensure_settings(v_org_id);
  perform public._leg_seed_stories(v_org_id);
  perform public._leg_seed_milestones(v_org_id);
  v_engagement := public._ltbp_engagement_summary(v_org_id);

  select count(*) into v_stories
  from public.organization_legacy_stories where organization_id = v_org_id;

  select count(*) into v_milestones
  from public.organization_legacy_milestones where organization_id = v_org_id;

  select count(*) into v_uncelebrated
  from public.organization_legacy_milestones
  where organization_id = v_org_id and celebrated = false;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizations are stories — preserve wisdom for future employees, customers, and leaders.',
    'story_count', v_stories,
    'milestone_count', v_milestones,
    'uncelebrated_milestones', v_uncelebrated,
    'enabled', (select enabled from public.organization_legacy_engine_settings where organization_id = v_org_id),
    'implementation_blueprint_phase83', jsonb_build_object(
      'phase', 'Phase 83 — Long-Term Stewardship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE83_LONG_TERM_STEWARDSHIP.md',
      'engine_phase', 'A.86 Legacy Engine',
      'route', '/app/legacy-engine'
    ),
    'blueprint_mission', public._ltbp_mission(),
    'blueprint_abos_principle', public._ltbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Long-Term Stewardship Engine (ABOS Phase 83) — stewardship mindset, sustainable growth, and legacy awareness with responsibility not pressure.',
    'stewardship_note', 'Leadership preserves opportunities for tomorrow — not only today''s results.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ltbp_distinction_note() to authenticated;
grant execute on function public._ltbp_mission() to authenticated;
grant execute on function public._ltbp_philosophy() to authenticated;
grant execute on function public._ltbp_abos_principle() to authenticated;
grant execute on function public._ltbp_objectives() to authenticated;
grant execute on function public._ltbp_stewardship_questions() to authenticated;
grant execute on function public._ltbp_sustainable_growth() to authenticated;
grant execute on function public._ltbp_legacy_awareness() to authenticated;
grant execute on function public._ltbp_companion_guidance() to authenticated;
grant execute on function public._ltbp_self_love_connection() to authenticated;
grant execute on function public._ltbp_leadership_insights() to authenticated;
grant execute on function public._ltbp_trust_connection() to authenticated;
grant execute on function public._ltbp_dogfooding() to authenticated;
grant execute on function public._ltbp_vision_phrases() to authenticated;
grant execute on function public._ltbp_integration_links() to authenticated;
grant execute on function public._ltbp_engagement_summary(uuid) to authenticated;
grant execute on function public._ltbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'long-term-stewardship-blueprint-phase83', 'Long-Term Stewardship Engine (ABOS Phase 83)',
  'Long-Term Stewardship Engine — extends Legacy Engine A.86 with stewardship mindset, sustainable growth framing, legacy awareness, companion guidance, and live success criteria. Responsibility not pressure.',
  'authenticated', 122
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'long-term-stewardship-blueprint-phase83' and tenant_id is null
);
