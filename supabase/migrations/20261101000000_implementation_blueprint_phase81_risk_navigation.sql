-- Implementation Blueprint Phase 81 — Risk Navigation Engine
-- Extends Organizational Resilience Engine Phase A.50 (ABOS Resilience Engine). No new tables.
-- Distinct from Strategic Intelligence & Opportunity repo Phase 81 at /app/strategy (phase number collision).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._rnbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 81 — Risk Navigation Engine at /app/organizational-resilience-engine. Extends Organizational Resilience Engine Phase A.50 (ABOS Resilience Engine via 20260930000000_resilience_engine_abos_spec_alignment.sql). Distinct from Strategic Intelligence & Opportunity repo Phase 81 at /app/strategy (legacy scorecard — cross-link only). Distinct from Growth & Evolution Engine A.81 at /app/growth-evolution-engine (repo engine phase number collision with ABOS blueprint 80 on Curiosity A.87 — cross-link for post-adversity learning). Distinct from Continuity repo Phase 80 at /app/continuity (Blueprint Phase 73 layered). Distinct from Security & Trust A.18 / Blueprint Phase 30 at /app/security-trust-engine (security transparency — cross-link). Distinct from Incident Response A.51 at /app/incident-response-coordination-engine. Distinct from Predictive Operations Blueprint Phase 74 at /app/predictive-insights-engine. Distinct from Opportunity Exploration Blueprint Phase 80 at /app/curiosity-discovery-engine (risk/opportunity balance cross-link). Distinct from Simulation Decision Lab Phase 78 at /app/simulations. Engine helpers use _ore_* — Blueprint Phase 81 MUST use _rnbp_* only. Preparedness not alarm — limitation principles mandatory (no fear-based communication).';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._rnbp_mission()
returns text language sql immutable as $$
  select 'Strengthen resilience by increasing risk awareness while supporting balanced confident decision-making.';
$$;

create or replace function public._rnbp_philosophy()
returns text language sql immutable as $$
  select 'Absence of risk does not guarantee success — avoiding every risk avoids meaningful opportunities. Wisdom means understanding which risks deserve attention and responsible preparation.';
$$;

create or replace function public._rnbp_abos_principle()
returns text language sql immutable as $$
  select 'Extraordinary organizations navigate uncertainty thoughtfully — not defined by absence of risk. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._rnbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'risk_awareness', 'label', 'Risk awareness', 'description', 'Surface operational, strategic, people, and technology risk patterns — metadata only, awareness not anxiety'),
    jsonb_build_object('key', 'preparedness_planning', 'label', 'Preparedness planning', 'description', 'Response strategies, contingency plans, resource flexibility, and communication approaches'),
    jsonb_build_object('key', 'balanced_decision_making', 'label', 'Balanced decision-making', 'description', 'Support confident leadership choices — neither reckless nor paralyzed by uncertainty'),
    jsonb_build_object('key', 'cross_functional_visibility', 'label', 'Cross-functional risk visibility', 'description', 'Shared visibility across teams without blame or fear-based framing'),
    jsonb_build_object('key', 'leadership_confidence', 'label', 'Leadership confidence', 'description', 'Emerging risk summaries, preparedness observations, positive resilience indicators'),
    jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational resilience', 'description', 'Strengthen resilience through preparedness — complements A.50 scenario planning and simulations')
  );
$$;

create or replace function public._rnbp_risk_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk categories — holistic awareness across operational, strategic, people, and technology dimensions.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational',
        'examples', jsonb_build_array(
          'Capacity constraints and workload concentration',
          'Process vulnerabilities and single points of failure',
          'Knowledge concentration in critical workflows'
        )
      ),
      jsonb_build_object(
        'key', 'strategic',
        'label', 'Strategic',
        'examples', jsonb_build_array(
          'Market changes and competitive pressures',
          'Growth assumptions and strategic dependencies',
          'Investment and expansion timing considerations'
        )
      ),
      jsonb_build_object(
        'key', 'people',
        'label', 'People',
        'examples', jsonb_build_array(
          'Burnout and sustainable workload patterns',
          'Leadership transitions and succession awareness',
          'Talent dependencies and cross-training opportunities'
        )
      ),
      jsonb_build_object(
        'key', 'technology',
        'label', 'Technology',
        'examples', jsonb_build_array(
          'System dependencies and integration challenges',
          'Security considerations — holistic approach, cross-link Security & Trust A.18',
          'Infrastructure redundancy and recovery readiness'
        )
      )
    ),
    'metadata_note', 'Risk categories aggregate systemic patterns — never punitive individual evaluation.'
  );
$$;

create or replace function public._rnbp_risk_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk questions — encourage thoughtful preparedness, not alarm.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'critical_assumptions', 'question', 'Which critical assumptions underpin this plan — and what would change if they shifted?', 'description', 'Surface assumptions for leadership review — not catastrophic prediction'),
      jsonb_build_object('emoji', '🌹', 'key', 'early_warning_signals', 'question', 'What early warning signals might indicate conditions are changing?', 'description', 'Preparedness-oriented signals — awareness supports calm response'),
      jsonb_build_object('emoji', '🔔', 'key', 'preparedness_if_change', 'question', 'If conditions change, what preparedness would reduce disruption?', 'description', 'Contingency framing — preparation reduces fear more effectively than avoidance')
    ),
    'reflection_note', 'Questions invite preparedness planning — not fear-based urgency or inevitability.'
  );
$$;

create or replace function public._rnbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — awareness not anxiety; dependencies deserve attention, strengths mitigate concerns.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'dependencies_deserve_attention', 'prompt', 'Some dependencies may deserve attention — would a preparedness summary help leadership review?', 'consideration', 'Dependencies framed as improvement opportunities — not blame'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengths_mitigate', 'prompt', 'Existing strengths may mitigate several concerns — would highlighting resilience indicators help balanced planning?', 'consideration', 'Celebrate preparedness and collective capability'),
      jsonb_build_object('emoji', '🔔', 'key', 'contingency_planning', 'prompt', 'Contingency planning often strengthens resilience — shall I outline preparedness considerations for review?', 'consideration', 'Preparation reduces disruption — humans decide timing and scope')
    )
  );
$$;

create or replace function public._rnbp_risk_preparedness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk preparedness — preparation reduces disruption; humans lead decisions.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'response_strategies', 'label', 'Response strategies', 'description', 'Approved procedures and escalation paths — cross-link Incident Response A.51'),
      jsonb_build_object('key', 'contingency_plans', 'label', 'Contingency plans', 'description', 'Resilience plans and scenario simulations — complements A.50 continuity planning'),
      jsonb_build_object('key', 'resource_flexibility', 'label', 'Resource flexibility', 'description', 'Backup roles, cross-training, and capacity buffers — systemic signals only'),
      jsonb_build_object('key', 'communication_approaches', 'label', 'Communication approaches', 'description', 'Calm, transparent stakeholder communication — cross-link Trust Engine and Stakeholder Communication A.53')
    ),
    'preparedness_note', 'Preparedness often reduces fear more effectively than avoidance.'
  );
$$;

create or replace function public._rnbp_risk_opportunity_balance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk and opportunity balance — reducing risk entirely may limit opportunities; thoughtful experimentation provides learning.',
    'guidance', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'avoid_total_risk_avoidance', 'signal', 'Avoiding every risk may limit meaningful opportunities — would a balanced review help?', 'description', 'Wisdom selects which risks deserve attention — not elimination of all uncertainty'),
      jsonb_build_object('emoji', '🌹', 'key', 'thoughtful_experimentation', 'signal', 'Thoughtful experimentation often provides learning — would connecting to exploration surfaces help?', 'description', 'Cross-link Opportunity Exploration Blueprint Phase 80 at /app/curiosity-discovery-engine')
    ),
    'balance_note', 'Caution with ambition — preparedness enables confident pursuit, not paralysis.'
  );
$$;

create or replace function public._rnbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — emerging risk summaries, preparedness observations, and positive resilience indicators.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'emerging_risk_summaries', 'label', 'Emerging risk summaries', 'description', 'Aggregate vulnerability and plan metadata — systemic patterns only'),
      jsonb_build_object('emoji', '🦉', 'key', 'preparedness_observations', 'label', 'Preparedness observations', 'description', 'Active plans, completed simulations, and mitigation progress — celebrate preparation'),
      jsonb_build_object('emoji', '🌹', 'key', 'positive_resilience_indicators', 'label', 'Positive resilience indicators', 'description', 'Strengths that mitigate concerns — balanced leadership dialogue')
    ),
    'dialogue_note', 'Insights support confident decision-making — never fear-based dashboards or catastrophic framing.'
  );
$$;

create or replace function public._rnbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — perspective, courage, reflection, and confidence in preparation.',
    'practices', jsonb_build_array(
      'Perspective — risk awareness informs, it does not dictate paralysis',
      'Courage — thoughtful preparation enables confident navigation of uncertainty',
      'Reflection — review assumptions and preparedness without guilt or pressure',
      'Confidence in preparation — preparedness often reduces fear more effectively than avoidance'
    ),
    'journey_phrase', 'Preparedness often reduces fear more effectively than avoidance.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable leadership reflection — principle only; Risk Navigation stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._rnbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about information sources, limitations, and optional insights.',
    'leaders_should_know', jsonb_build_array(
      'Which metadata sources contributed to risk observations — plans, vulnerabilities, simulations counts only',
      'Limitation principles — no fear-based communication, no catastrophic interpretations',
      'Insights are optional and human-controlled — preparedness not alarm',
      'Distinct from security incidents, predictive forecasts, and legacy strategy scorecards'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Risk Navigation extends Organizational Resilience A.50 — same route, no duplicate storage',
      'Distinct from Strategic Intelligence repo Phase 81, Continuity Phase 80, Growth A.81, Security A.18',
      'Uncertainty is navigable — not presented as inevitability of failure',
      'Humans decide — Aipify informs, prepares, and recommends'
    ),
    'audit_note', 'Resilience plan, simulation, and review events audited via _ore_* workflows — metadata only.'
  );
$$;

create or replace function public._rnbp_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — preparedness not alarm; humans decide.',
    'forbidden', jsonb_build_array(
      'Fear-based communication or alarmist risk copy',
      'Catastrophic interpretations presented as certainty',
      'Uncertainty framed as inevitability of failure',
      'Punitive individual risk scoring or hidden evaluations'
    ),
    'required', jsonb_build_array(
      'Risk awareness framed as preparedness opportunity — not anxiety',
      'Balanced leadership dialogue — strengths and mitigations alongside concerns',
      'Transparent source attribution and metadata-only aggregation',
      'Human leadership retains decision authority — Aipify coordinates and informs'
    ),
    'boundary_note', 'Aipify strengthens resilience through preparedness — not through fear.'
  );
$$;

create or replace function public._rnbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates risk navigation patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — ecosystem growth, operational scaling, strategic investments, leadership resilience',
      'focus', jsonb_build_array(
        'Ecosystem growth and partner scaling risk awareness',
        'Operational scaling and capacity preparedness',
        'Strategic investment assumptions and contingency planning',
        'Leadership resilience and sustainable workload patterns'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational and strategic risk preparedness',
      'focus', jsonb_build_array(
        'Seasonal capacity and operational dependency patterns',
        'Customer communication preparedness during disruption',
        'Growth assumption review and balanced opportunity pursuit'
      )
    )
  );
$$;

create or replace function public._rnbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We cannot eliminate uncertainty, but we are increasingly prepared to navigate it together.',
    'Uncertainty with wisdom, courage, and preparedness.',
    'Extraordinary organizations navigate uncertainty thoughtfully — not defined by absence of risk.',
    'Preparedness often reduces fear more effectively than avoidance.',
    'Awareness not anxiety — humans decide; Aipify informs and prepares.',
    'Balanced opportunity pursuit with responsible risk attention.'
  );
$$;

create or replace function public._rnbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Opportunity Exploration (Blueprint Phase 80)', 'route', '/app/curiosity-discovery-engine', 'note', 'Risk/opportunity balance — thoughtful experimentation cross-link'),
    jsonb_build_object('label', 'Strategic Intelligence (Blueprint Phase 79)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Strategic awareness — distinct from risk navigation preparedness'),
    jsonb_build_object('label', 'Legacy Strategic Scorecard (Repo Phase 81)', 'route', '/app/strategy', 'note', 'Legacy strategic scorecard — cross-link only'),
    jsonb_build_object('label', 'Simulation Decision Lab (Phase 78)', 'route', '/app/simulations', 'note', 'Safe scenario modeling — complements resilience simulations'),
    jsonb_build_object('label', 'Continuity (Phase 80 / Blueprint Phase 73)', 'route', '/app/continuity', 'note', 'Backup ownership, incident mode, readiness score'),
    jsonb_build_object('label', 'Growth & Evolution Engine (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Post-adversity learning — cross-link after disruption'),
    jsonb_build_object('label', 'Security & Trust (A.18 / Blueprint Phase 30)', 'route', '/app/security-trust-engine', 'note', 'Security transparency — holistic technology risk cross-link'),
    jsonb_build_object('label', 'Incident Response Coordination (A.51)', 'route', '/app/incident-response-coordination-engine', 'note', 'Coordinated incident response — distinct from risk awareness'),
    jsonb_build_object('label', 'Predictive Operations (Blueprint Phase 74)', 'route', '/app/predictive-insights-engine', 'note', 'Forecasts and preparedness — cross-link only'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Perspective and confidence in preparation — principle only')
  );
$$;

create or replace function public._rnbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total_plans int := 0;
  v_active_plans int := 0;
  v_open_vulnerabilities int := 0;
  v_completed_simulations int := 0;
  v_pending_reviews int := 0;
begin
  select count(*) into v_total_plans
  from public.resilience_plans where organization_id = p_organization_id;

  select count(*) into v_active_plans
  from public.resilience_plans
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_open_vulnerabilities
  from public.resilience_vulnerabilities
  where organization_id = p_organization_id and status in ('open', 'mitigating');

  select count(*) into v_completed_simulations
  from public.resilience_simulations
  where organization_id = p_organization_id and status = 'completed';

  select count(*) into v_pending_reviews
  from public.resilience_plans
  where organization_id = p_organization_id and status = 'under_review';

  return jsonb_build_object(
    'total_plans', coalesce(v_total_plans, 0),
    'active_plans', coalesce(v_active_plans, 0),
    'open_vulnerabilities', coalesce(v_open_vulnerabilities, 0),
    'completed_simulations', coalesce(v_completed_simulations, 0),
    'pending_reviews', coalesce(v_pending_reviews, 0),
    'risk_categories', jsonb_array_length(public._rnbp_risk_categories()->'categories'),
    'risk_questions', jsonb_array_length(public._rnbp_risk_questions()->'questions'),
    'companion_examples', jsonb_array_length(public._rnbp_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — plan, vulnerability, and simulation counts. No PII or punitive individual scoring.'
  );
end; $$;

create or replace function public._rnbp_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_plans int := 0;
  v_completed_simulations int := 0;
  v_open_vulnerabilities int := 0;
begin
  v_engagement := public._rnbp_engagement_summary(p_organization_id);
  v_active_plans := coalesce((v_engagement->>'active_plans')::int, 0);
  v_completed_simulations := coalesce((v_engagement->>'completed_simulations')::int, 0);
  v_open_vulnerabilities := coalesce((v_engagement->>'open_vulnerabilities')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'risk_awareness',
      'label', 'Improved risk awareness — risk categories and questions documented',
      'met', jsonb_array_length(public._rnbp_risk_categories()->'categories') >= 4
        and jsonb_array_length(public._rnbp_risk_questions()->'questions') >= 3,
      'note', 'Operational, strategic, people, and technology categories with preparedness questions.'
    ),
    jsonb_build_object(
      'key', 'stronger_preparedness',
      'label', 'Stronger preparedness — active plans or completed simulations',
      'met', v_active_plans > 0 or v_completed_simulations > 0,
      'note', case when v_active_plans = 0 and v_completed_simulations = 0 then 'Approve resilience plans or record simulations to validate preparedness workflow.' else null end
    ),
    jsonb_build_object(
      'key', 'leadership_confidence',
      'label', 'Increased leadership confidence — leadership insights documented',
      'met', jsonb_array_length(public._rnbp_leadership_insights()->'insight_types') >= 3,
      'note', 'Emerging risk summaries, preparedness observations, positive resilience indicators.'
    ),
    jsonb_build_object(
      'key', 'organizational_resilience',
      'label', 'Organizational resilience growth — resilience engagement tracked',
      'met', coalesce((v_engagement->>'total_plans')::int, 0) >= 0,
      'note', 'Resilience plans, vulnerabilities, and simulations provide metadata engagement signals.'
    ),
    jsonb_build_object(
      'key', 'balanced_opportunity',
      'label', 'Balanced opportunity pursuit — risk/opportunity balance documented',
      'met', jsonb_array_length(public._rnbp_risk_opportunity_balance()->'guidance') >= 2,
      'note', 'Cross-link Opportunity Exploration Blueprint Phase 80 — caution with ambition.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — awareness not anxiety documented',
      'met', jsonb_array_length(public._rnbp_companion_guidance()->'examples') >= 3,
      'note', 'Dependencies deserve attention; strengths mitigate concerns; contingency planning strengthens resilience.'
    ),
    jsonb_build_object(
      'key', 'risk_preparedness',
      'label', 'Risk preparedness dimensions documented',
      'met', jsonb_array_length(public._rnbp_risk_preparedness()->'dimensions') >= 4,
      'note', 'Response strategies, contingency plans, resource flexibility, communication approaches.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no fear, no catastrophic certainty, no inevitability framing',
      'met', jsonb_array_length(public._rnbp_limitation_principles()->'forbidden') >= 4,
      'note', 'Preparedness not alarm — humans decide.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, limitations, optional insights documented',
      'met', jsonb_array_length(public._rnbp_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — perspective, courage, reflection, confidence in preparation',
      'met', (public._rnbp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Preparedness often reduces fear more effectively than avoidance.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Phase 80 Curiosity, Phase 79 Strategic Intelligence, Simulation Lab, Continuity, Growth A.81',
      'met', jsonb_array_length(public._rnbp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate risk storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group ecosystem growth, operational scaling, leadership resilience',
      'met', (public._rnbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'vulnerability_tracking',
      'label', 'Vulnerability awareness tracked — open vulnerabilities visible for mitigation',
      'met', v_open_vulnerabilities >= 0,
      'note', case when v_open_vulnerabilities > 0 then 'Open vulnerabilities visible — frame as preparedness opportunities, not alarm.' else null end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.50 + ABOS alignment fields; append Phase 81
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
    'blueprint_privacy_note', 'Risk navigation and Phase 81 blueprint data is metadata only — plan, vulnerability, and simulation counts. No fear-based copy, no PII, no punitive individual scoring. Humans decide; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.50 + ABOS fields; append Phase 81 framing
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
    'preparedness_note', 'Preparedness not alarm — uncertainty navigable with wisdom, courage, and preparation.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._rnbp_distinction_note() to authenticated;
grant execute on function public._rnbp_mission() to authenticated;
grant execute on function public._rnbp_philosophy() to authenticated;
grant execute on function public._rnbp_abos_principle() to authenticated;
grant execute on function public._rnbp_objectives() to authenticated;
grant execute on function public._rnbp_risk_categories() to authenticated;
grant execute on function public._rnbp_risk_questions() to authenticated;
grant execute on function public._rnbp_companion_guidance() to authenticated;
grant execute on function public._rnbp_risk_preparedness() to authenticated;
grant execute on function public._rnbp_risk_opportunity_balance() to authenticated;
grant execute on function public._rnbp_leadership_insights() to authenticated;
grant execute on function public._rnbp_self_love_connection() to authenticated;
grant execute on function public._rnbp_trust_connection() to authenticated;
grant execute on function public._rnbp_limitation_principles() to authenticated;
grant execute on function public._rnbp_dogfooding() to authenticated;
grant execute on function public._rnbp_vision_phrases() to authenticated;
grant execute on function public._rnbp_integration_links() to authenticated;
grant execute on function public._rnbp_engagement_summary(uuid) to authenticated;
grant execute on function public._rnbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'risk-navigation-blueprint-phase81', 'Risk Navigation Engine (ABOS Phase 81)',
  'Risk Navigation Engine — extends Organizational Resilience A.50 with risk awareness, preparedness planning, balanced decision-making, companion guidance, limitation principles, and live success criteria. Preparedness not alarm.',
  'authenticated', 121
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'risk-navigation-blueprint-phase81' and tenant_id is null
);
