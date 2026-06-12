-- Implementation Blueprint Phase 91 — Organizational Resilience & Recovery Engine
-- Extends Organizational Resilience Engine Phase A.50 + Blueprint Phase 81 Risk Navigation. No new tables.
-- Distinct from Partner Certification repo Phase 91 at /app/partners and Dedication Engine A.91.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._orrbp91_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 91 — Organizational Resilience & Recovery Engine at /app/organizational-resilience-engine. Extends Organizational Resilience Engine Phase A.50 and Blueprint Phase 81 Risk Navigation (_rnbp_*). Phase 81 = navigation/preparedness; Phase 91 = recovery/adversity learning. Distinct from Partner & Certification Ecosystem repo Phase 91 at /app/partners (phase number collision). Distinct from Dedication Engine A.91 at /app/dedication-engine (repo engine phase collision). Distinct from Hope Engine A.92 at /app/hope-engine (cross-link). Distinct from Presence & Comfort A.90 (cross-link). Cross-links Continuity Phase 80 / Blueprint Phase 73, Incident Response A.51, Simulation Lab Blueprint Phase 84, Security & Trust A.18, Executive Insights A.35, Self Love A.76. Helpers use _orrbp91_* only — never collide with _ore_* or _rnbp_*. Support not unrealistic optimism — no toxic positivity.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._orrbp91_mission()
returns text language sql immutable as $$
  select 'Prepare for, respond to, recover from operational, strategic, and human challenges.';
$$;

create or replace function public._orrbp91_philosophy()
returns text language sql immutable as $$
  select 'Resilience means moving forward despite difficulty — learning through adversity. Recovery is not linear; organizations grow wiser when they reflect honestly and strengthen connection.';
$$;

create or replace function public._orrbp91_abos_principle()
returns text language sql immutable as $$
  select 'Strength is revealed in difficult moments — Aipify informs, prepares, and supports recovery; humans decide pace and priorities.';
$$;

create or replace function public._orrbp91_vision()
returns text language sql immutable as $$
  select 'We faced difficult circumstances, but we emerged wiser, stronger and more connected.';
$$;

create or replace function public._orrbp91_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'recovery_preparedness', 'label', 'Recovery preparedness', 'description', 'Structured readiness for operational, strategic, and human challenges — metadata only'),
    jsonb_build_object('key', 'response_coordination', 'label', 'Response coordination', 'description', 'Clear information and approved procedures during disruption — humans lead decisions'),
    jsonb_build_object('key', 'structured_recovery', 'label', 'Structured recovery', 'description', 'Recovery periods, capability rebuilding, and sustainable pace after adversity'),
    jsonb_build_object('key', 'adversity_learning', 'label', 'Adversity learning', 'description', 'Capture lessons, strengthen capabilities, integrate wisdom — cross-link Growth A.81'),
    jsonb_build_object('key', 'people_resilience', 'label', 'People resilience', 'description', 'Support teams through difficulty without minimizing concerns — hope-strengthening'),
    jsonb_build_object('key', 'cultural_strengthening', 'label', 'Cultural strengthening', 'description', 'Emerge wiser, stronger, and more connected through honest recovery reflection')
  );
$$;

create or replace function public._orrbp91_resilience_domains()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience domains — operational, people, strategic, and cultural dimensions of recovery.',
    'domains', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational',
        'examples', jsonb_build_array(
          'Process continuity and service recovery priorities',
          'Workflow adaptation during and after disruption',
          'Integration redundancy and fallback procedures'
        )
      ),
      jsonb_build_object(
        'key', 'people',
        'label', 'People',
        'examples', jsonb_build_array(
          'Team wellbeing and sustainable workloads during recovery',
          'Leadership support and clear role expectations',
          'Recovery periods after intense response efforts'
        )
      ),
      jsonb_build_object(
        'key', 'strategic',
        'label', 'Strategic',
        'examples', jsonb_build_array(
          'Priority decisions under uncertainty',
          'Adaptation choices and long-term capability rebuilding',
          'Strategic reflection after adversity — cross-link Executive Insights A.35'
        )
      ),
      jsonb_build_object(
        'key', 'cultural',
        'label', 'Cultural',
        'examples', jsonb_build_array(
          'Shared purpose and trust through difficulty',
          'Connection and hope-strengthening — cross-link Hope Engine A.92',
          'Honest acknowledgment without toxic positivity'
        )
      )
    ),
    'metadata_note', 'Domains aggregate systemic recovery patterns — never punitive individual evaluation.'
  );
$$;

create or replace function public._orrbp91_resilience_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience questions — encourage honest reflection and hope-strengthening, not minimization.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'learning', 'question', 'What can we learn from what happened?', 'description', 'Wisdom-oriented reflection — adversity as learning opportunity'),
      jsonb_build_object('emoji', '🌹', 'key', 'what_helped', 'question', 'What helped us navigate this difficulty?', 'description', 'Celebrate strengths and effective responses — never minimize struggle'),
      jsonb_build_object('emoji', '❤️', 'key', 'hope_connection', 'question', 'How can we strengthen hope and connection during recovery?', 'description', 'Hope-strengthening — cross-link Hope A.92 and Presence & Comfort A.90'),
      jsonb_build_object('emoji', '🔔', 'key', 'future_preparedness', 'question', 'What would support us if similar conditions arise again?', 'description', 'Forward-looking preparedness — complements Phase 81 risk navigation')
    ),
    'reflection_note', 'Questions invite recovery reflection — not pressure to move on before teams are ready.'
  );
$$;

create or replace function public._orrbp91_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — strengthen hope, never minimize; acknowledge difficulty honestly.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'honest_acknowledgment', 'prompt', 'Difficulty deserves honest acknowledgment — would a recovery summary help leadership review what happened?', 'consideration', 'Never minimize — frame as learning opportunity'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengths_recognition', 'prompt', 'Existing strengths and what helped may deserve recognition — shall I highlight resilience indicators from reviews?', 'consideration', 'Celebrate what worked — balanced recovery dialogue'),
      jsonb_build_object('emoji', '🔔', 'key', 'forward_movement', 'prompt', 'Forward movement often strengthens hope — would outlining recovery considerations for review help?', 'consideration', 'Humans decide pace — Aipify prepares and informs')
    )
  );
$$;

create or replace function public._orrbp91_recovery_reflection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recovery reflection — what happened, what helped, what hindered, lessons learned.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'what_happened', 'label', 'What happened', 'description', 'Factual summary scaffold — metadata only via resilience reviews, no raw incident content'),
      jsonb_build_object('key', 'what_helped', 'label', 'What helped', 'description', 'Strengths, procedures, and responses that supported recovery'),
      jsonb_build_object('key', 'what_hindered', 'label', 'What hindered', 'description', 'Obstacles and gaps — improvement opportunities, not blame'),
      jsonb_build_object('key', 'lessons', 'label', 'Lessons', 'description', 'Wisdom for future preparedness — cross-link Continuous Improvement A.33 and Growth A.81')
    ),
    'reflection_note', 'Humans decide what to capture — Aipify scaffolds structured review, never stores PII or raw communications.'
  );
$$;

create or replace function public._orrbp91_learning_through_adversity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning through adversity — post-event reviews, capability strengthening, wisdom integration.',
    'practices', jsonb_build_array(
      'Structured resilience reviews after simulations and real events — metadata only',
      'Capability strengthening observations from completed plans and mitigations',
      'Wisdom integration cross-link Growth & Evolution A.81 and Organizational Memory A.34',
      'Continuous improvement workflow scaffold — humans approve lessons learned'
    ),
    'learning_note', 'Adversity teaches when reflection is honest — not when recovery is rushed or minimized.'
  );
$$;

create or replace function public._orrbp91_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — recovery summaries, strengths observed, lessons for balanced dialogue.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'recovery_summaries', 'label', 'Recovery summaries', 'description', 'Aggregate plan, review, and simulation metadata — systemic patterns only'),
      jsonb_build_object('emoji', '🦉', 'key', 'strengths_observed', 'label', 'Strengths observed', 'description', 'What helped and positive resilience indicators — celebrate without toxic positivity'),
      jsonb_build_object('emoji', '🌹', 'key', 'lessons_for_leadership', 'label', 'Lessons for leadership', 'description', 'Review findings metadata — honest reflection for executive dialogue via A.35')
    ),
    'dialogue_note', 'Insights support hope-strengthening recovery — never pressure, guilt, or unrealistic optimism.'
  );
$$;

create or replace function public._orrbp91_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — compassionate recovery periods, sustainable pace, celebration of progress.',
    'practices', jsonb_build_array(
      'Compassionate recovery periods after intense response — no guilt for sustainable pace',
      'Honest reflection without pressure to move on before ready',
      'Celebration of progress and strengths observed during recovery',
      'Sustainable workload adjustments — cross-link Time & Attention Guardian'
    ),
    'journey_phrase', 'Moving forward despite difficulty — learning through adversity with compassion.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable recovery reflection — principle only; Recovery Blueprint stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._orrbp91_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent recovery communication — sources, limitations, optional insights.',
    'leaders_should_know', jsonb_build_array(
      'Which metadata sources contributed to recovery observations — plans, reviews, simulations counts only',
      'Limitation principles — no toxic positivity, no minimizing concerns, no predictable recovery timelines',
      'Insights are optional and human-controlled — recovery pace is human-led',
      'Distinct from incident response content, security incidents, and raw operational records'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Recovery Blueprint extends Organizational Resilience A.50 and Risk Navigation Phase 81 — same route',
      'Distinct from Partner Certification repo Phase 91, Dedication A.91, Hope A.92, Presence A.90',
      'Every recovery is unique — not presented with predictable assumptions',
      'Humans decide — Aipify informs, prepares, and supports hope-strengthening recovery'
    ),
    'audit_note', 'Resilience plan, review, and simulation events audited via _ore_* workflows — metadata only.'
  );
$$;

create or replace function public._orrbp91_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — support honest recovery; never toxic positivity or minimization.',
    'forbidden', jsonb_build_array(
      'Toxic positivity or unrealistic optimism during recovery',
      'Minimizing legitimate concerns or difficulty experienced',
      'Predictable recovery assumptions — every recovery is unique',
      'Pressure to move on before teams are ready'
    ),
    'required', jsonb_build_array(
      'Honest acknowledgment of difficulty — hope-strengthening not minimization',
      'Human-paced recovery with leadership retaining decision authority',
      'Balanced dialogue — strengths and lessons alongside honest challenges',
      'Transparent source attribution and metadata-only aggregation'
    ),
    'boundary_note', 'Aipify supports recovery through honest reflection — not through toxic positivity.'
  );
$$;

create or replace function public._orrbp91_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates recovery patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — operational disruptions, product incidents, ecosystem changes, leadership transitions, support escalations',
      'focus', jsonb_build_array(
        'Operational disruptions and service recovery patterns',
        'Product incidents and post-incident review metadata',
        'Ecosystem and partner scaling changes',
        'Leadership transitions and sustainable recovery periods',
        'Support escalation recovery and knowledge gap closure'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational recovery and seasonal disruption patterns',
      'focus', jsonb_build_array(
        'Seasonal capacity recovery and customer communication',
        'Post-disruption review and capability strengthening',
        'Team recovery periods after peak operational intensity'
      )
    )
  );
$$;

create or replace function public._orrbp91_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We faced difficult circumstances, but we emerged wiser, stronger and more connected.',
    'Moving forward despite difficulty — learning through adversity.',
    'Honest recovery strengthens hope — never minimize, never toxic positivity.',
    'Humans decide pace and priorities — Aipify informs, prepares, and supports.',
    'Strength is revealed in difficult moments — connection grows through honest reflection.',
    'Recovery is not linear — wisdom emerges when reflection is honest and compassionate.'
  );
$$;

create or replace function public._orrbp91_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Continuity (Phase 80 / Blueprint Phase 73)', 'route', '/app/continuity', 'note', 'Backup ownership, incident mode, readiness score — complements recovery planning'),
    jsonb_build_object('label', 'Incident Response Coordination (A.51)', 'route', '/app/incident-response-coordination-engine', 'note', 'Coordinated incident response — distinct from recovery reflection'),
    jsonb_build_object('label', 'Hope Engine (A.92)', 'route', '/app/hope-engine', 'note', 'Hope and forward momentum — cross-link for recovery'),
    jsonb_build_object('label', 'Presence & Comfort (A.90)', 'route', '/app/presence-comfort-protocol', 'note', 'Calm presence during difficulty — cross-link only'),
    jsonb_build_object('label', 'Simulation Lab (Blueprint Phase 84)', 'route', '/app/simulations', 'note', 'Ecosystem scenario planning — complements resilience simulations'),
    jsonb_build_object('label', 'Security & Trust (A.18)', 'route', '/app/security-trust-engine', 'note', 'Security transparency — holistic recovery cross-link'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive recovery summaries — metadata integration'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable recovery reflection — principle only'),
    jsonb_build_object('label', 'Risk Navigation (Blueprint Phase 81)', 'route', '/app/organizational-resilience-engine', 'note', 'Preparedness/navigation focus — Phase 91 is recovery/adversity learning on same route'),
    jsonb_build_object('label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Post-adversity learning cycles and capability strengthening'),
    jsonb_build_object('label', 'Partner Certification (Repo Phase 91)', 'route', '/app/partners', 'note', 'Partner ecosystem — phase number collision only'),
    jsonb_build_object('label', 'Dedication Engine (A.91)', 'route', '/app/dedication-engine', 'note', 'Dedication and commitment — repo engine phase collision')
  );
$$;

create or replace function public._orrbp91_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total_plans int := 0;
  v_active_plans int := 0;
  v_completed_reviews int := 0;
  v_completed_simulations int := 0;
  v_open_vulnerabilities int := 0;
begin
  select count(*) into v_total_plans
  from public.resilience_plans where organization_id = p_organization_id;

  select count(*) into v_active_plans
  from public.resilience_plans
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_completed_reviews
  from public.resilience_reviews where organization_id = p_organization_id;

  select count(*) into v_completed_simulations
  from public.resilience_simulations
  where organization_id = p_organization_id and status = 'completed';

  select count(*) into v_open_vulnerabilities
  from public.resilience_vulnerabilities
  where organization_id = p_organization_id and status in ('open', 'mitigating');

  return jsonb_build_object(
    'total_plans', coalesce(v_total_plans, 0),
    'active_plans', coalesce(v_active_plans, 0),
    'completed_reviews', coalesce(v_completed_reviews, 0),
    'completed_simulations', coalesce(v_completed_simulations, 0),
    'open_vulnerabilities', coalesce(v_open_vulnerabilities, 0),
    'resilience_domains', jsonb_array_length(public._orrbp91_resilience_domains()->'domains'),
    'resilience_questions', jsonb_array_length(public._orrbp91_resilience_questions()->'questions'),
    'recovery_reflection_dimensions', jsonb_array_length(public._orrbp91_recovery_reflection()->'dimensions'),
    'companion_examples', jsonb_array_length(public._orrbp91_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — plan, review, vulnerability, and simulation counts. No PII, no toxic positivity copy, no wellbeing content.'
  );
end; $$;

create or replace function public._orrbp91_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_completed_reviews int := 0;
  v_completed_simulations int := 0;
  v_active_plans int := 0;
begin
  v_engagement := public._orrbp91_engagement_summary(p_organization_id);
  v_completed_reviews := coalesce((v_engagement->>'completed_reviews')::int, 0);
  v_completed_simulations := coalesce((v_engagement->>'completed_simulations')::int, 0);
  v_active_plans := coalesce((v_engagement->>'active_plans')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'recovery_preparedness',
      'label', 'Recovery preparedness — resilience domains and questions documented',
      'met', jsonb_array_length(public._orrbp91_resilience_domains()->'domains') >= 4
        and jsonb_array_length(public._orrbp91_resilience_questions()->'questions') >= 4,
      'note', 'Operational, people, strategic, and cultural domains with hope-strengthening questions.'
    ),
    jsonb_build_object(
      'key', 'structured_recovery',
      'label', 'Structured recovery — active plans or completed reviews/simulations',
      'met', v_active_plans > 0 or v_completed_reviews > 0 or v_completed_simulations > 0,
      'note', case when v_active_plans = 0 and v_completed_reviews = 0 and v_completed_simulations = 0 then 'Approve resilience plans or record reviews/simulations to validate recovery workflow.' else null end
    ),
    jsonb_build_object(
      'key', 'adversity_learning',
      'label', 'Adversity learning — recovery reflection and learning documented',
      'met', jsonb_array_length(public._orrbp91_recovery_reflection()->'dimensions') >= 4
        and (public._orrbp91_learning_through_adversity()->>'principle') is not null,
      'note', 'What happened, what helped, what hindered, lessons — metadata scaffold.'
    ),
    jsonb_build_object(
      'key', 'people_resilience',
      'label', 'People resilience — companion guidance strengthens hope without minimization',
      'met', jsonb_array_length(public._orrbp91_companion_guidance()->'examples') >= 3,
      'note', 'Honest acknowledgment, strengths recognition, forward movement — never minimize.'
    ),
    jsonb_build_object(
      'key', 'cultural_strengthening',
      'label', 'Cultural strengthening — vision and leadership insights documented',
      'met', (public._orrbp91_vision()) is not null
        and jsonb_array_length(public._orrbp91_leadership_insights()->'insight_types') >= 3,
      'note', 'Emerge wiser, stronger, and more connected through honest recovery.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no toxic positivity, minimization, or predictable recovery assumptions',
      'met', jsonb_array_length(public._orrbp91_limitation_principles()->'forbidden') >= 4,
      'note', 'Support honest recovery — humans decide pace.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, limitations, optional insights documented',
      'met', jsonb_array_length(public._orrbp91_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — compassionate recovery and sustainable pace',
      'met', (public._orrbp91_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Moving forward despite difficulty — learning through adversity with compassion.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Continuity, Incident Response, Hope, Simulations, Security, Executive Insights, Phase 81',
      'met', jsonb_array_length(public._orrbp91_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate recovery storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — operational disruptions, product incidents, leadership transitions',
      'met', (public._orrbp91_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'phase81_distinction',
      'label', 'Phase 81 Risk Navigation preserved — navigation/preparedness distinct from recovery focus',
      'met', true,
      'note', 'Phase 81 = risk awareness and preparedness; Phase 91 = recovery and adversity learning.'
    )
  );
end; $$;

create or replace function public._orrbp91_recovery_blueprint_block(p_organization_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 91 — Organizational Resilience & Recovery Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE91_ORGANIZATIONAL_RESILIENCE_RECOVERY.md',
    'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
    'route', '/app/organizational-resilience-engine',
    'mapping_note', 'ABOS Blueprint Phase 91 extends A.50 + Phase 81 with recovery focus, adversity learning, hope-strengthening companion guidance, and live success criteria. Distinct from Partner Certification repo Phase 91 and Dedication A.91.',
    'distinction_note', public._orrbp91_distinction_note(),
    'mission', public._orrbp91_mission(),
    'philosophy', public._orrbp91_philosophy(),
    'abos_principle', public._orrbp91_abos_principle(),
    'objectives', public._orrbp91_objectives(),
    'resilience_questions', public._orrbp91_resilience_questions(),
    'resilience_domains', public._orrbp91_resilience_domains(),
    'companion_guidance', public._orrbp91_companion_guidance(),
    'recovery_reflection', public._orrbp91_recovery_reflection(),
    'learning_through_adversity', public._orrbp91_learning_through_adversity(),
    'self_love_connection', public._orrbp91_self_love_connection(),
    'leadership_insights', public._orrbp91_leadership_insights(),
    'trust_connection', public._orrbp91_trust_connection(),
    'limitation_principles', public._orrbp91_limitation_principles(),
    'dogfooding', public._orrbp91_dogfooding(),
    'success_criteria', public._orrbp91_success_criteria(p_organization_id),
    'vision', public._orrbp91_vision(),
    'vision_phrases', public._orrbp91_vision_phrases(),
    'integration_links', public._orrbp91_integration_links(),
    'engagement_summary', public._orrbp91_engagement_summary(p_organization_id),
    'privacy_note', 'Recovery blueprint data is metadata only — plan, review, vulnerability, and simulation counts. No toxic positivity, no PII, no wellbeing content. Humans decide pace; Aipify informs and supports.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.50 + Phase 81 fields; append Phase 91
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resilience.view');
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'purpose', 'Help organizations remain stable, adaptive, and effective during disruption, uncertainty, and crisis.',
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'principles', jsonb_build_array(
      'Preparedness',
      'Operational continuity',
      'Role clarity',
      'Structured recovery',
      'Continuous learning',
      'Audit accountability'
    ),
    'resilience_dimensions', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational',
        'examples', jsonb_build_array(
          'Critical process continuity and fallback procedures',
          'Service recovery priorities during disruption',
          'Integration and workflow redundancy'
        )
      ),
      jsonb_build_object(
        'key', 'knowledge',
        'label', 'Knowledge',
        'examples', jsonb_build_array(
          'Documented procedures and approved playbooks',
          'Role clarity and escalation paths',
          'Institutional memory capture after events'
        )
      ),
      jsonb_build_object(
        'key', 'human',
        'label', 'Human',
        'examples', jsonb_build_array(
          'Team capacity and backup role assignments',
          'Recovery periods after intense response',
          'Sustainable workload during prolonged disruption'
        )
      ),
      jsonb_build_object(
        'key', 'customer',
        'label', 'Customer',
        'examples', jsonb_build_array(
          'Communication during disruption',
          'Service expectations and status transparency',
          'Coordinated customer-facing updates'
        )
      ),
      jsonb_build_object(
        'key', 'strategic',
        'label', 'Strategic',
        'examples', jsonb_build_array(
          'Priority decisions during crisis',
          'Adaptation choices under uncertainty',
          'Long-term recovery and capability rebuilding'
        )
      )
    ),
    'crisis_support_guidance', 'During disruption, Aipify surfaces relevant information, approved procedures, and clear next steps — coordinating response while humans lead decisions.',
    'crisis_examples', jsonb_build_array(
      'Here is what we know and what we are doing next.',
      'These are the approved procedures for this scenario.',
      'Human leadership retains decision authority — Aipify coordinates and informs.',
      'Roles and escalation paths are visible — reducing confusion during uncertainty.'
    ),
    'self_love_note', 'Self Love (A.76) supports recovery periods, overload detection, post-event reflection, celebrating progress, and sustainable adjustments — never pressure or guilt during crisis recovery.',
    'growth_evolution_note', 'Growth & Evolution (A.81) integrates post-adversity lessons learned, improvements, capabilities strengthened, and wisdom from difficulty — at /app/growth-evolution-engine.',
    'trust_engine_note', 'Trust Engine (Phase 76) provides calm, transparent, honest communication during uncertainty — explainability at /app/trust.',
    'continuity_phase80_note', 'Continuity, Resilience & Crisis (Phase 80) at /app/continuity handles backup ownership, incident mode, readiness score, and crisis briefings — complements A.50 scenario planning.',
    'distinction_note', 'ABOS Resilience Engine maps to Organizational Resilience Engine A.50 at /app/organizational-resilience-engine — not a new route. Distinct from Phase 80 Continuity (/app/continuity), Organizational Health A.56 (/app/organizational-health-engine), and Growth & Evolution A.81 (/app/growth-evolution-engine).',
    'integration_links', jsonb_build_array(
      jsonb_build_object(
        'label', 'Continuity, Resilience & Crisis (Phase 80)',
        'route', '/app/continuity',
        'description', 'Backup ownership, incident mode, readiness score — complements scenario planning.'
      ),
      jsonb_build_object(
        'label', 'Growth & Evolution Engine (A.81)',
        'route', '/app/growth-evolution-engine',
        'description', 'Post-adversity learning cycles, lessons learned, and capability strengthening.'
      ),
      jsonb_build_object(
        'label', 'Trust Engine (Phase 76)',
        'route', '/app/trust',
        'description', 'Calm, transparent, honest communication during uncertainty.'
      ),
      jsonb_build_object(
        'label', 'Organizational Health (A.56)',
        'route', '/app/organizational-health-engine',
        'description', 'Aggregate health indicators — distinct from resilience planning.'
      ),
      jsonb_build_object(
        'label', 'Incident Response Coordination (A.51)',
        'route', '/app/incident-response-coordination-engine',
        'description', 'Coordinated incident response with ownership and escalation.'
      )
    ),
    'summary', jsonb_build_object(
      'total_plans', coalesce((
        select count(*) from public.resilience_plans where organization_id = v_org_id
      ), 0),
      'active_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'draft_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'open_vulnerabilities', coalesce((
        select count(*) from public.resilience_vulnerabilities
        where organization_id = v_org_id and status in ('open', 'mitigating')
      ), 0),
      'completed_simulations', coalesce((
        select count(*) from public.resilience_simulations
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'under_review'
      ), 0)
    ),
    'plans', coalesce((
      select jsonb_agg(row_to_json(rp) order by rp.created_at desc)
      from public.resilience_plans rp where rp.organization_id = v_org_id
    ), '[]'::jsonb),
    'simulations', coalesce((
      select jsonb_agg(row_to_json(rs) order by rs.created_at desc)
      from public.resilience_simulations rs where rs.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'vulnerabilities', coalesce((
      select jsonb_agg(row_to_json(rv) order by rv.created_at desc)
      from public.resilience_vulnerabilities rv where rv.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(rr) order by rr.review_date desc)
      from public.resilience_reviews rr where rr.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ore_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'security_trust', 'Extends Security & Trust (A.18) with vulnerability tracking',
      'operations_center', 'Aligns with Operations Center Foundation (A.32) event context',
      'executive_insights', 'Executive summary via get_resilience_executive_summary() — A.35',
      'organizational_memory', 'Review completion may capture lessons learned — metadata only (A.34)',
      'continuous_improvement', 'Findings scaffold improvement workflow (A.33)'
    ),
    'integration_summaries', jsonb_build_object(
      'security', public._ore_security_summary(v_org_id),
      'operations', public._ore_operations_summary(v_org_id),
      'memory', public._ore_memory_summary(v_org_id),
      'improvement', public._ore_improvement_summary(v_org_id)
    ),
    'implementation_blueprint_phase81', jsonb_build_object(
      'phase', 'Phase 81 — Risk Navigation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_NAVIGATION.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'ABOS Blueprint Phase 81 extends A.50 with risk awareness, preparedness planning, balanced decision-making, companion guidance, limitation principles, and live success criteria. Distinct from Strategic Intelligence repo Phase 81 at /app/strategy (phase number collision).'
    ),
    'risk_navigation_engine_note', 'Risk Navigation Engine (ABOS Phase 81) — navigate uncertainty with preparedness not alarm; strengthens resilience through balanced risk awareness and confident decision-making.',
    'blueprint_distinction_note', public._rnbp_distinction_note(),
    'blueprint_mission', public._rnbp_mission(),
    'blueprint_philosophy', public._rnbp_philosophy(),
    'blueprint_abos_principle', public._rnbp_abos_principle(),
    'blueprint_objectives', public._rnbp_objectives(),
    'risk_categories', public._rnbp_risk_categories(),
    'risk_questions', public._rnbp_risk_questions(),
    'companion_guidance', public._rnbp_companion_guidance(),
    'risk_preparedness', public._rnbp_risk_preparedness(),
    'risk_opportunity_balance', public._rnbp_risk_opportunity_balance(),
    'leadership_insights', public._rnbp_leadership_insights(),
    'blueprint_self_love_connection', public._rnbp_self_love_connection(),
    'blueprint_trust_connection', public._rnbp_trust_connection(),
    'limitation_principles', public._rnbp_limitation_principles(),
    'blueprint_dogfooding', public._rnbp_dogfooding(),
    'blueprint_integration_links', public._rnbp_integration_links(),
    'engagement_summary', public._rnbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._rnbp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._rnbp_vision_phrases(),
    'blueprint_privacy_note', 'Risk navigation and Phase 81 blueprint data is metadata only — plan, vulnerability, and simulation counts. No fear-based copy, no PII, no punitive individual scoring. Humans decide; Aipify informs and prepares.',
    'implementation_blueprint_phase91', jsonb_build_object(
      'phase', 'Phase 91 — Organizational Resilience & Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE91_ORGANIZATIONAL_RESILIENCE_RECOVERY.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'ABOS Blueprint Phase 91 extends A.50 + Phase 81 with recovery focus, adversity learning, and hope-strengthening guidance. Distinct from Partner Certification repo Phase 91 and Dedication A.91.'
    ),
    'recovery_engine_note', 'Organizational Resilience & Recovery Engine (ABOS Phase 91) — prepare, respond, recover, and learn through adversity with hope-strengthening guidance — never toxic positivity.',
    'organizational_resilience_recovery_blueprint', public._orrbp91_recovery_blueprint_block(v_org_id),
    'recovery_distinction_note', public._orrbp91_distinction_note(),
    'recovery_mission', public._orrbp91_mission(),
    'recovery_philosophy', public._orrbp91_philosophy(),
    'recovery_abos_principle', public._orrbp91_abos_principle(),
    'recovery_objectives', public._orrbp91_objectives(),
    'recovery_resilience_questions', public._orrbp91_resilience_questions(),
    'recovery_resilience_domains', public._orrbp91_resilience_domains(),
    'recovery_companion_guidance', public._orrbp91_companion_guidance(),
    'recovery_reflection', public._orrbp91_recovery_reflection(),
    'recovery_learning_through_adversity', public._orrbp91_learning_through_adversity(),
    'recovery_leadership_insights', public._orrbp91_leadership_insights(),
    'recovery_self_love_connection', public._orrbp91_self_love_connection(),
    'recovery_trust_connection', public._orrbp91_trust_connection(),
    'recovery_limitation_principles', public._orrbp91_limitation_principles(),
    'recovery_dogfooding', public._orrbp91_dogfooding(),
    'recovery_integration_links', public._orrbp91_integration_links(),
    'recovery_engagement_summary', public._orrbp91_engagement_summary(v_org_id),
    'recovery_success_criteria', public._orrbp91_success_criteria(v_org_id),
    'recovery_vision', public._orrbp91_vision(),
    'recovery_vision_phrases', public._orrbp91_vision_phrases(),
    'recovery_privacy_note', 'Recovery blueprint data is metadata only — no toxic positivity, no PII, no wellbeing content. Humans decide pace; Aipify informs and supports.'

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.50 + Phase 81 fields; append Phase 91 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);
  v_engagement := public._rnbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = v_org_id and status in ('open', 'mitigating')
    ), 0),
    'implementation_blueprint_phase81', jsonb_build_object(
      'phase', 'Phase 81 — Risk Navigation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_NAVIGATION.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine'
    ),
    'blueprint_mission', public._rnbp_mission(),
    'blueprint_abos_principle', public._rnbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Risk Navigation Engine (ABOS Phase 81) — risk awareness, preparedness planning, and balanced decision-making with preparedness not alarm.',
    'preparedness_note', 'Preparedness not alarm — uncertainty navigable with wisdom, courage, and preparation.',
    'implementation_blueprint_phase91', jsonb_build_object(
      'phase', 'Phase 91 — Organizational Resilience & Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE91_ORGANIZATIONAL_RESILIENCE_RECOVERY.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine'
    ),
    'recovery_mission', public._orrbp91_mission(),
    'recovery_abos_principle', public._orrbp91_abos_principle(),
    'recovery_engagement_summary', public._orrbp91_engagement_summary(v_org_id),
    'recovery_note', 'Organizational Resilience & Recovery Engine (ABOS Phase 91) — recovery, adversity learning, and hope-strengthening with honest acknowledgment.',
    'recovery_vision_note', 'We faced difficult circumstances, but we emerged wiser, stronger and more connected.'

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._orrbp91_distinction_note() to authenticated;
grant execute on function public._orrbp91_mission() to authenticated;
grant execute on function public._orrbp91_philosophy() to authenticated;
grant execute on function public._orrbp91_abos_principle() to authenticated;
grant execute on function public._orrbp91_vision() to authenticated;
grant execute on function public._orrbp91_objectives() to authenticated;
grant execute on function public._orrbp91_resilience_domains() to authenticated;
grant execute on function public._orrbp91_resilience_questions() to authenticated;
grant execute on function public._orrbp91_companion_guidance() to authenticated;
grant execute on function public._orrbp91_recovery_reflection() to authenticated;
grant execute on function public._orrbp91_learning_through_adversity() to authenticated;
grant execute on function public._orrbp91_leadership_insights() to authenticated;
grant execute on function public._orrbp91_self_love_connection() to authenticated;
grant execute on function public._orrbp91_trust_connection() to authenticated;
grant execute on function public._orrbp91_limitation_principles() to authenticated;
grant execute on function public._orrbp91_dogfooding() to authenticated;
grant execute on function public._orrbp91_vision_phrases() to authenticated;
grant execute on function public._orrbp91_integration_links() to authenticated;
grant execute on function public._orrbp91_engagement_summary(uuid) to authenticated;
grant execute on function public._orrbp91_success_criteria(uuid) to authenticated;
grant execute on function public._orrbp91_recovery_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-resilience-recovery-blueprint-phase91', 'Organizational Resilience & Recovery Engine (ABOS Phase 91)',
  'Organizational Resilience & Recovery Engine — extends Organizational Resilience A.50 + Phase 81 with recovery focus, adversity learning, hope-strengthening companion guidance, and live success criteria. No toxic positivity.',
  'authenticated', 122
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-resilience-recovery-blueprint-phase91' and tenant_id is null
);
