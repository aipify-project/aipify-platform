-- Implementation Blueprint Phase 57 — Companion Relationship & Trust Engine
-- Extends Trust & Reputation Engine (Phase A.72 + ABOS Phase 26). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._crtbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 57 — Companion Relationship & Trust Engine at /app/trust-reputation-engine. Extends Trust & Reputation Engine Phase A.72 and Blueprint Phase 26. Distinct from Trust & Action Engine Phase 30 /app/approvals (action approval risk levels — not reputation profiles). Relationship Intelligence A.78 /app/relationship-intelligence-engine (organizational customer/partner context — not companion-user trust). Personal RSI Phase 33 /app/assistant/relationships (user important people — not org trust profiles). Ethics Phase 54 /app/ai-ethics-responsible-use-engine (companion governance). Memory Phase 55 /app/organizational-memory-engine (continuity cross-link only). Blueprint Phase 57 = companion relationship and trust development on A.72 reputation/trust profiles. Cross-links: Proactive Companion Phase 56 /app/proactive-companion-engine, Human Moments Phase 53 /app/gratitude-recognition-engine, Self Love A.76 /app/self-love-engine, Identity Engine A.34 /app/assistant/identity. All Phase A.72 and Phase 26 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._crtbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Develop trusted companion relationships — earned through honesty, reliability, and respectful continuity on organizational trust profiles.';
$$;

create or replace function public._crtbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Companion trust is earned slowly through honest moments — transparent explanations, reliable follow-through, and human-centered interactions; never manufactured intimacy or pressure.';
$$;

create or replace function public._crtbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) earns companion trust through actions — explain, prepare, and respect boundaries; humans decide.';
$$;

create or replace function public._crtbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trust_development', 'label', 'Trust development', 'description', 'Trust profiles and reputation signals accumulate honestly over time — metadata only, human-reviewed expansion'),
    jsonb_build_object('key', 'relationship_continuity', 'label', 'Relationship continuity', 'description', 'Consistent companion tone, remembered preferences, and respectful since-last-time awareness across sessions'),
    jsonb_build_object('key', 'reliability_indicators', 'label', 'Reliability indicators', 'description', 'Reminders delivered, summaries accurate, context preserved — reputation signals reflect follow-through'),
    jsonb_build_object('key', 'personalized_experiences', 'label', 'Personalized experiences', 'description', 'Communication style and harmless preferences honoured with consent — never manipulative personalization'),
    jsonb_build_object('key', 'human_centered_interactions', 'label', 'Human-centered interactions', 'description', 'Professional, calm, respectful — supportive without pressure, guilt, or false certainty'),
    jsonb_build_object('key', 'long_term_engagement', 'label', 'Long-term engagement', 'description', 'Appropriate reliance built over months — companion grows alongside work, not dependency')
  );
$$;

create or replace function public._crtbp_blueprint_trust_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'honesty', 'label', 'Honesty', 'description', 'Admit uncertainty; never imply confidence beyond evidence'),
    jsonb_build_object('key', 'reliability', 'label', 'Reliability', 'description', 'Follow through on reminders, summaries, and stated capabilities'),
    jsonb_build_object('key', 'transparency', 'label', 'Transparency', 'description', 'Explain why guidance appears; surface limitations and data boundaries'),
    jsonb_build_object('key', 'respect', 'label', 'Respect', 'description', 'Honour quiet hours, communication style, and explicit limits'),
    jsonb_build_object('key', 'professionalism', 'label', 'Professionalism', 'description', 'Calm operational companion tone — never forced casual intimacy')
  );
$$;

create or replace function public._crtbp_blueprint_avoid_practices()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Manipulation — no guilt, urgency traps, or pressure to rely beyond appropriate scope',
    'False certainty — say when Aipify is not fully confident; offer alternatives',
    'Excessive familiarity — respectful professional tone; never manufactured intimacy',
    'Pressure — users decide pace; Aipify informs and prepares only'
  );
$$;

create or replace function public._crtbp_blueprint_relationship_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'preferred_context',
      'scenario', 'Preferred communication and context remembered respectfully',
      'example', '🌹 Aipify remembers you prefer concise briefings — summaries stay focused unless you ask for detail.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'thoughtful_continuity',
      'scenario', 'Thoughtful continuity when context shifts',
      'example', '🦉 Since our last conversation on workflow approvals, two outcomes completed — here is what changed and what may need your review.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'gentle_reminders',
      'scenario', 'Gentle reminders without pressure',
      'example', '🔔 A gentle reminder — the trust expansion review for automation workflows is still pending when you are ready.'
    )
  );
$$;

create or replace function public._crtbp_blueprint_companion_reliability()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion reliability strengthens trust — reminders on time, summaries accurate, context preserved, preferences respected.',
    'indicators', jsonb_build_array(
      jsonb_build_object('key', 'reminders', 'label', 'Reminders', 'description', 'Gentle, on-time follow-ups — never guilt-based'),
      jsonb_build_object('key', 'summaries', 'label', 'Summaries', 'description', 'Accurate briefings with explainable sources — metadata only'),
      jsonb_build_object('key', 'context', 'label', 'Context', 'description', 'Since-last-time awareness cross-linked with Memory Phase 55 — never hidden retention'),
      jsonb_build_object('key', 'preferences', 'label', 'Preferences', 'description', 'Harmless communication and operational preferences with user consent')
    ),
    'reputation_signal_types', jsonb_build_array('reminder_reliability', 'summary_accuracy', 'context_continuity', 'preference_adherence')
  );
$$;

create or replace function public._crtbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports companion trust — patience during demanding periods, compassion without judgment, progress recognition, and sustainable expectations.',
    'practices', jsonb_build_array(
      'Patience — no urgency pressure when workloads intensify',
      'Compassion — supportive tone during demanding periods, never guilt',
      'Progress recognition — acknowledge milestones and steady improvement',
      'Sustainable expectations — recommend pacing over speed; trust grows slowly'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Trust & Reputation stores metadata signals, not wellbeing content.'
  );
$$;

create or replace function public._crtbp_blueprint_boundary_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion trust respects human autonomy and real relationships — Aipify supports decisions; humans lead.',
    'should_support', jsonb_build_array(
      'Autonomy — users decide; Aipify informs and prepares',
      'Human relationships — never impersonate or replace personal connections',
      'Support decisions — explain trade-offs; never dictate outcomes'
    ),
    'should_avoid', jsonb_build_array(
      'Dependency — appropriate reliance, not emotional attachment to AI',
      'Replacing humans — augment people; never imply Aipify replaces colleagues or loved ones',
      'Silent scope expansion — human review before widening automated trust'
    ),
    'preserved_a72', jsonb_build_array(
      'Entity-scoped trust profiles and metadata-only reputation signals',
      'Human review for trust expansion and revocation with audit trail',
      'Phase 26 relationship objectives and principles preserved'
    )
  );
$$;

create or replace function public._crtbp_blueprint_trust_signals()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust signals are explainable metadata — users see why guidance appears, confidence levels, transparency notices, and known limitations.',
    'users_should_see', jsonb_build_array(
      'Explanations — why each recommendation or nudge appears',
      'Confidence indicators — honest levels with alternatives when uncertain',
      'Transparency notices — what data influenced guidance and what was excluded',
      'Limitations — what Aipify cannot do; when human review is required'
    ),
    'operators_should_understand', jsonb_build_array(
      'Reputation signals are metadata-only — never raw conversations or PII',
      'Trust expansion requires human review when expansion_review_required is enabled',
      'Cross-links Ethics Phase 54 governance and Memory Phase 55 continuity — do not duplicate',
      'Revocation and outcomes are audited — trust lost quickly when patterns break'
    ),
    'audit_note', 'Trust profile changes, expansion reviews, and signal recordings logged — metadata only.'
  );
$$;

create or replace function public._crtbp_blueprint_organizational_trust()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational trust means predictable companion interactions, transparent governance, and consistent support quality across modules.',
    'pillars', jsonb_build_array(
      jsonb_build_object('key', 'predictable_interactions', 'label', 'Predictable interactions', 'description', 'Consistent tone and behaviour across Command Center, assistant, and modules'),
      jsonb_build_object('key', 'governance', 'label', 'Governance', 'description', 'Ethics Phase 54 and expansion review align with trust profiles — humans approve scope changes'),
      jsonb_build_object('key', 'consistent_support', 'label', 'Consistent support', 'description', 'Support reliability signals feed reputation profiles — metadata outcomes only')
    )
  );
$$;

create or replace function public._crtbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates companion relationship and trust patterns internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — sales coach continuity, reminder reliability, human moments, leadership trust summaries',
      'focus', jsonb_build_array(
        'Sales Expert Engine — trustworthy coaching tone and explainable recommendations',
        'Reminder reliability across Command Center and proactive flows',
        'Human Moments Phase 53 — gratitude and recognition without pressure',
        'Leadership trust summaries before executive decisions'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce companion trust and support reliability',
      'focus', jsonb_build_array(
        'Workflow trust profiles for commerce operations',
        'Support quality reputation signals',
        'Human-reviewed trust expansion before automation widening',
        'Relationship continuity across customer-facing modules'
      )
    )
  );
$$;

create or replace function public._crtbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Trust & Action Engine (Phase 30)', 'route', '/app/approvals', 'note', 'Sensitive action approvals — distinct from reputation profiles'),
    jsonb_build_object('label', 'Relationship Intelligence (A.78)', 'route', '/app/relationship-intelligence-engine', 'note', 'Organizational customer/partner context — not companion-user trust'),
    jsonb_build_object('label', 'Personal RSI (Phase 33)', 'route', '/app/assistant/relationships', 'note', 'User important people — not organizational trust profiles'),
    jsonb_build_object('label', 'Ethics & Companion Governance (Phase 54)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Companion ethics governance — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Memory & Continuity (Phase 55)', 'route', '/app/organizational-memory-engine', 'note', 'Continuity cross-link — context and preferences metadata'),
    jsonb_build_object('label', 'Proactive Companion (Phase 56)', 'route', '/app/proactive-companion-engine', 'note', 'Proactive nudges — trust through transparent assistance'),
    jsonb_build_object('label', 'Human Moments (Phase 53)', 'route', '/app/gratitude-recognition-engine', 'note', 'Gratitude and recognition — human-centered companion moments'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Patience and sustainable pace — principle only'),
    jsonb_build_object('label', 'Identity Engine (A.34)', 'route', '/app/assistant/identity', 'note', 'Communication style adaptation — cross-link companion identity trust'),
    jsonb_build_object('label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine', 'note', 'Companion communication style and identity trust fields'),
    jsonb_build_object('label', 'License & Trust Center', 'route', '/app/license', 'note', 'Subscription trust and ownership transparency'),
    jsonb_build_object('label', 'Legacy Trust Engine (Phase 76)', 'route', '/app/trust', 'note', 'Decision explanations and Trust Score — distinct from A.72 reputation')
  );
$$;

create or replace function public._crtbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'A companion that earns trust through honest, reliable actions — one interaction at a time.',
    'Relationship continuity without manipulation — respectful, transparent, professional.',
    'Appropriate reliance — Aipify informs and prepares; humans decide.',
    'Trust profiles reflect real follow-through — reminders, summaries, context, preferences.',
    'Long-term engagement built on governance, predictability, and consistent support.'
  );
$$;

create or replace function public._crtbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
  v_reliability_signals int := 0;
  v_continuity_signals int := 0;
begin
  v_base := public._trbp_engagement_summary(p_org_id);

  select count(*) into v_reliability_signals
  from public.organization_trust_signals s
  join public.organization_trust_profiles p on p.id = s.profile_id
  where p.organization_id = p_org_id
    and s.signal_type in ('reminder_reliability', 'summary_accuracy', 'context_continuity', 'preference_adherence')
    and s.recorded_at >= now() - interval '90 days';

  select count(*) into v_continuity_signals
  from public.organization_trust_signals s
  join public.organization_trust_profiles p on p.id = s.profile_id
  where p.organization_id = p_org_id
    and s.signal_type in ('context_continuity', 'preference_adherence')
    and s.recorded_at >= now() - interval '30 days';

  return v_base || jsonb_build_object(
    'reliability_signals_90d', v_reliability_signals,
    'continuity_signals_30d', v_continuity_signals,
    'companion_note', 'Phase 57 companion engagement — counts only; extends Phase 26 engagement summary.'
  );
end; $$;

create or replace function public._crtbp_blueprint_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_trusted int := 0;
  v_signals_30d int := 0;
  v_reliability int := 0;
begin
  v_engagement := public._crtbp_engagement_summary(p_org_id);
  v_trusted := coalesce((v_engagement->>'trusted_profiles')::int, 0);
  v_signals_30d := coalesce((v_engagement->>'recent_signals_30d')::int, 0);
  v_reliability := coalesce((v_engagement->>'reliability_signals_90d')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'companion_trust_development',
      'label', 'Companion trust development — trusted profiles and honest reputation signals',
      'met', v_trusted > 0 or v_signals_30d > 0,
      'note', case when v_trusted = 0 and v_signals_30d = 0 then 'Seed trust profiles and record positive companion signals.' else null end
    ),
    jsonb_build_object(
      'key', 'relationship_continuity',
      'label', 'Relationship continuity — examples and principles documented',
      'met', jsonb_array_length(public._crtbp_blueprint_relationship_continuity()) >= 3,
      'note', '🌹🦉🔔 continuity examples without pressure or manipulation.'
    ),
    jsonb_build_object(
      'key', 'reliability_indicators',
      'label', 'Reliability indicators — reminders, summaries, context, preferences',
      'met', v_reliability > 0 or (public._crtbp_blueprint_companion_reliability()->'indicators') is not null,
      'note', 'Companion reliability strengthens earned trust over time.'
    ),
    jsonb_build_object(
      'key', 'trust_principles',
      'label', 'Trust principles — honesty, reliability, transparency, respect, professionalism',
      'met', jsonb_array_length(public._crtbp_blueprint_trust_principles()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'avoid_manipulation',
      'label', 'Avoid manipulation — no false certainty, familiarity traps, or pressure',
      'met', jsonb_array_length(public._crtbp_blueprint_avoid_practices()) >= 4,
      'note', 'Earned trust tone — technology earns trust through actions.'
    ),
    jsonb_build_object(
      'key', 'boundary_principles',
      'label', 'Boundary principles — autonomy, human relationships, support decisions',
      'met', jsonb_array_length(public._crtbp_blueprint_boundary_principles()->'should_support') >= 3,
      'note', 'Avoid dependency and replacing humans.'
    ),
    jsonb_build_object(
      'key', 'trust_signal_indicators',
      'label', 'Trust signal indicators — explanations, confidence, transparency, limitations',
      'met', (public._crtbp_blueprint_trust_signals()->>'principle') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'organizational_trust',
      'label', 'Organizational trust — predictable interactions, governance, consistent support',
      'met', jsonb_array_length(public._crtbp_blueprint_organizational_trust()->'pillars') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — patience, compassion, progress, sustainable expectations',
      'met', true,
      'note', 'Self Love is a principle — appropriate reliance, not dependency.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Trust & Action, RSI, Ethics, Memory, Proactive Companion',
      'met', jsonb_array_length(public._crtbp_blueprint_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate approvals, personal RSI, or ethics logic.'
    ),
    jsonb_build_object(
      'key', 'companion_objectives',
      'label', 'Companion objectives documented — trust development through long-term engagement',
      'met', jsonb_array_length(public._crtbp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — sales coach, reminders, human moments, leadership patterns',
      'met', (public._crtbp_blueprint_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.72 + Phase 26; append Phase 57
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_reputation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('trust.view');
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Earned trust through transparent reputation signals — metadata only, humans review expansion.',
    'principles', jsonb_build_array(
      'Metadata-only reputation signals',
      'Entity-scoped trust profiles',
      'Human review for trust expansion',
      'Revocation with audit trail',
      'Delegated trust hooks for enterprise admins'
    ),
    'summary', public._tre_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'trust_profiles', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc, p.entity_type)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status in ('active', 'under_review')
        limit 40
      ), '[]'::jsonb),
      'trust_trends', coalesce((
        select jsonb_agg(jsonb_build_object(
          'entity_type', p.entity_type,
          'avg_score', round(avg(p.trust_score)::numeric, 1),
          'profile_count', count(*),
          'trusted_count', count(*) filter (where p.trust_level in ('trusted', 'highly_trusted'))
        ) order by avg(p.trust_score) desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
        group by p.entity_type
      ), '[]'::jsonb),
      'trusted_workflows', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
          and p.entity_type in ('workflow', 'automation')
          and p.trust_level in ('trusted', 'highly_trusted')
        limit 20
      ), '[]'::jsonb),
      'approval_quality', coalesce((
        select jsonb_agg(jsonb_build_object(
          'signal_type', s.signal_type,
          'avg_value', round(avg(s.signal_value)::numeric, 1),
          'signal_count', count(*)
        ) order by avg(s.signal_value) desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
          and s.signal_type in ('approval_accuracy', 'policy_adherence', 'positive_audit')
          and s.recorded_at >= now() - interval '90 days'
        group by s.signal_type
      ), '[]'::jsonb),
      'reputation_indicators', coalesce((
        select jsonb_agg(row_to_json(s) order by s.recorded_at desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'recent_outcomes', coalesce((
        select jsonb_agg(row_to_json(o) order by o.created_at desc)
        from public.organization_trust_outcomes o
        where o.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb)
    ),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_trust_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._tre_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'human_oversight', 'Oversight approvals inform trust expansion decisions — A.40',
      'secure_ai_actions', 'AI action approval accuracy feeds reputation signals — A.3',
      'workflow_orchestration', 'Workflow execution patterns contribute to workflow trust — A.42',
      'governance_policy', 'Policy adherence signals strengthen governance trust — A.14',
      'enterprise_delegated_admins', 'Delegated admin scopes enable enterprise trust delegation — A.30/A.41'
    ),
    'integration_summaries', jsonb_build_object(
      'human_oversight', public._tre_human_oversight_summary(v_org_id),
      'secure_ai_actions', public._tre_secure_ai_actions_summary(v_org_id),
      'workflow_orchestration', public._tre_workflow_summary(v_org_id),
      'governance_policy', public._tre_governance_summary(v_org_id),
      'enterprise_delegated_admins', public._tre_delegated_trust_summary(v_org_id)
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 57 — Companion Relationship & Trust Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE57_COMPANION_RELATIONSHIP_TRUST.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine',
      'mapping_note', 'ABOS Blueprint Phase 57 maps to Trust & Reputation Engine Phase A.72 — extends Phase 26 with companion relationship and trust development metadata.'
    ),
    'implementation_blueprint_phase26', jsonb_build_object(
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'trust_relationship_note', 'Trust & Relationship Engine (ABOS Phase 26) — extends Trust & Reputation Engine Phase A.72 with blueprint metadata, relationship objectives, principles, and live engagement summary.',
    'companion_relationship_trust_note', 'Companion Relationship & Trust Engine (ABOS Phase 57) — companion trust development on A.72 reputation profiles with continuity, reliability, boundaries, and organizational trust pillars.',
    'blueprint_philosophy', public._crtbp_blueprint_philosophy(),
    'blueprint_mission', public._crtbp_blueprint_mission(),
    'blueprint_abos_principle', public._crtbp_blueprint_abos_principle(),
    'vision', 'A companion that earns trust through honest, reliable actions — one interaction at a time.',
    'blueprint_distinction_note', public._crtbp_distinction_note(),
    'relationship_objectives', public._trbp_blueprint_relationship_objectives(),
    'relationship_principles', public._trbp_blueprint_relationship_principles(),
    'example_phrases', public._trbp_blueprint_example_phrases(),
    'trust_signals', public._trbp_blueprint_trust_signals(),
    'companion_examples', public._trbp_blueprint_companion_examples(),
    'blueprint_boundaries', public._trbp_blueprint_boundaries(),
    'self_love_connection', public._trbp_blueprint_self_love_connection(),
    'dogfooding', public._trbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._trbp_blueprint_integration_links(),
    'engagement_summary', public._crtbp_engagement_summary(v_org_id),
    'success_criteria', public._trbp_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._trbp_blueprint_vision_phrases(),
    'companion_objectives', public._crtbp_blueprint_objectives(),
    'trust_principles', public._crtbp_blueprint_trust_principles(),
    'avoid_practices', public._crtbp_blueprint_avoid_practices(),
    'relationship_continuity', public._crtbp_blueprint_relationship_continuity(),
    'companion_reliability', public._crtbp_blueprint_companion_reliability(),
    'companion_self_love', public._crtbp_blueprint_self_love_connection(),
    'boundary_principles', public._crtbp_blueprint_boundary_principles(),
    'trust_signal_indicators', public._crtbp_blueprint_trust_signals(),
    'organizational_trust', public._crtbp_blueprint_organizational_trust(),
    'dogfooding_phase57', public._crtbp_blueprint_dogfooding(),
    'companion_integration_links', public._crtbp_blueprint_integration_links(),
    'companion_success_criteria', public._crtbp_blueprint_success_criteria(v_org_id),
    'companion_vision_phrases', public._crtbp_blueprint_vision_phrases(),
    'privacy_note', 'Trust & companion relationship signals are organization-scoped, explainable, and auditable. Metadata only — no raw customer content.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 26 + append Phase 57 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_reputation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);
  v_summary := public._tre_executive_summary_block(v_org_id);
  v_engagement := public._crtbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Trust & Reputation — earned trust through transparent metadata signals.',
    'active_profiles', v_summary->'active_profiles',
    'trusted_profiles', v_summary->'trusted_profiles',
    'under_review_profiles', v_summary->'under_review_profiles',
    'avg_trust_score', v_summary->'avg_trust_score',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 57 — Companion Relationship & Trust Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE57_COMPANION_RELATIONSHIP_TRUST.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase26', jsonb_build_object(
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'mission', public._crtbp_blueprint_mission(),
    'abos_principle', public._crtbp_blueprint_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Companion Relationship & Trust Engine (ABOS Phase 57) — extends Phase A.72 and Phase 26 with companion trust development, continuity, reliability, and live success criteria.',
    'companion_note', 'Earned trust through honest companion actions — humans decide; Aipify explains and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._crtbp_distinction_note() to authenticated;
grant execute on function public._crtbp_blueprint_mission() to authenticated;
grant execute on function public._crtbp_blueprint_philosophy() to authenticated;
grant execute on function public._crtbp_blueprint_abos_principle() to authenticated;
grant execute on function public._crtbp_blueprint_objectives() to authenticated;
grant execute on function public._crtbp_blueprint_trust_principles() to authenticated;
grant execute on function public._crtbp_blueprint_avoid_practices() to authenticated;
grant execute on function public._crtbp_blueprint_relationship_continuity() to authenticated;
grant execute on function public._crtbp_blueprint_companion_reliability() to authenticated;
grant execute on function public._crtbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._crtbp_blueprint_boundary_principles() to authenticated;
grant execute on function public._crtbp_blueprint_trust_signals() to authenticated;
grant execute on function public._crtbp_blueprint_organizational_trust() to authenticated;
grant execute on function public._crtbp_blueprint_dogfooding() to authenticated;
grant execute on function public._crtbp_blueprint_integration_links() to authenticated;
grant execute on function public._crtbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._crtbp_engagement_summary(uuid) to authenticated;
grant execute on function public._crtbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-relationship-trust-blueprint', 'Companion Relationship & Trust Engine (ABOS Phase 57)',
  'Companion Relationship & Trust Engine — extends Phase A.72 and Phase 26 with companion trust development, continuity, reliability indicators, and organizational trust pillars.',
  'authenticated', 104
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'companion-relationship-trust-blueprint' and tenant_id is null
);
