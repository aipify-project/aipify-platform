-- Implementation Blueprint Phase 26 — Trust & Relationship Engine
-- Spec alignment extending Trust & Reputation Engine (Phase A.72). No new tables.

create or replace function public._trbp_blueprint_relationship_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'consistent_experiences', 'label', 'Consistent experiences', 'description', 'Reliable companion behaviour across sessions, channels, and modules — same respectful tone every time'),
    jsonb_build_object('key', 'transparent_recommendations', 'label', 'Transparent recommendations', 'description', 'Every suggestion explains why it appears and which signals contributed — metadata only'),
    jsonb_build_object('key', 'clear_explanations', 'label', 'Clear explanations', 'description', 'Recommendations include reasoning, confidence, and optional trade-offs — never opaque guidance'),
    jsonb_build_object('key', 'respectful_communication', 'label', 'Respectful communication', 'description', 'Professional, calm tone — supportive without pressure, familiarity, or guilt'),
    jsonb_build_object('key', 'responsible_assistance', 'label', 'Responsible assistance', 'description', 'Prepare and inform; humans approve sensitive actions — never silent auto-execution'),
    jsonb_build_object('key', 'long_term_confidence', 'label', 'Long-term confidence', 'description', 'Trust profiles and reputation signals accumulate over time — earned slowly, reviewed honestly')
  );
$$;

create or replace function public._trbp_blueprint_relationship_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'keep_promises', 'label', 'Keep promises', 'description', 'Follow through on stated capabilities, timelines, and commitments — under-promise, over-deliver'),
    jsonb_build_object('key', 'admit_uncertainty', 'label', 'Admit uncertainty', 'description', 'Say when Aipify is not fully confident; offer alternatives instead of false certainty'),
    jsonb_build_object('key', 'explain_recommendations', 'label', 'Explain recommendations', 'description', 'Document what influenced guidance and why a path is suggested'),
    jsonb_build_object('key', 'respect_boundaries', 'label', 'Respect boundaries', 'description', 'Honour quiet hours, preferences, and explicit limits — never overstep'),
    jsonb_build_object('key', 'support_autonomy', 'label', 'Support autonomy', 'description', 'Users decide; Aipify informs and prepares — human control always retained'),
    jsonb_build_object('key', 'remember_harmless_preferences', 'label', 'Remember harmless preferences', 'description', 'Recall communication style and harmless operational preferences with user consent')
  );
$$;

create or replace function public._trbp_blueprint_example_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'not_fully_confident', 'phrase', 'I am not fully confident about this yet — here is what I do know.'),
    jsonb_build_object('key', 'explore_another_approach', 'phrase', 'We could explore another approach if you prefer.'),
    jsonb_build_object('key', 'previous_successful_outcomes', 'phrase', 'Based on previous successful outcomes in your organization, this path may fit.'),
    jsonb_build_object('key', 'why_recommendation', 'phrase', 'Here is why Aipify recommends this — and what would change the guidance.'),
    jsonb_build_object('key', 'your_decision', 'phrase', 'You decide — Aipify has prepared the options and trade-offs.')
  );
$$;

create or replace function public._trbp_blueprint_trust_signals()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust signals are explainable metadata — why recommendations appear, what influences guidance, uncertainty acknowledged, human control preserved.',
    'users_should_see', jsonb_build_array(
      'Why each recommendation appears and which reputation signals contributed',
      'What influences guidance — trust profiles, approval accuracy, policy adherence',
      'Uncertainty acknowledged — confidence levels and alternative paths offered',
      'Human control — expansion review, revocation, and approval gates before sensitive actions'
    ),
    'operators_should_understand', jsonb_build_array(
      'Entity-scoped trust profiles track workflows, automations, approvals, knowledge, support, governance',
      'Reputation signals are metadata-only — never raw customer records or conversations',
      'Trust expansion requires human review when expansion_review_required is enabled',
      'Revocation and outcomes are audited — trust lost quickly if patterns break'
    ),
    'audit_note', 'Trust profile changes, expansion reviews, and signal recordings logged — metadata only, no PII.'
  );
$$;

create or replace function public._trbp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'preferred_styles',
      'scenario', 'Preferred communication styles remembered respectfully',
      'example', '🌹 Aipify remembers you prefer concise summaries — I will keep briefings focused unless you ask for detail.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'milestones',
      'scenario', 'Milestones acknowledged without pressure',
      'example', '🔔 Your team reached a trust milestone on workflow approvals — steady consistency builds confidence over time.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'thoughtful_perspective',
      'scenario', 'Thoughtful perspective when uncertainty exists',
      'example', '🦉 I am not fully confident about this path yet — here are two alternatives worth comparing before you decide.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'self_love_demanding_periods',
      'scenario', 'Self Love during demanding periods',
      'example', '❤️ This has been a demanding week — celebrate the progress you have made; sustainable pace matters more than speed.'
    )
  );
$$;

create or replace function public._trbp_blueprint_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust grows through thousands of small honest moments — never manufactured intimacy or pressure.',
    'should_avoid', jsonb_build_array(
      'Fake human emotions — Aipify is transparent about being an operations companion, not a person',
      'Manipulation — no guilt, urgency traps, or pressure to rely beyond appropriate scope',
      'Excessive familiarity — respectful professional tone; never forced casual intimacy',
      'Overstepping preferences — quiet hours, communication style, and explicit limits are honoured',
      'Silent trust expansion — humans review before widening automated scope'
    ),
    'preserved_a72', jsonb_build_array(
      'Entity-scoped trust profiles and metadata-only reputation signals',
      'Human review for trust expansion and revocation with audit trail',
      'Integration with Human Oversight, Secure AI Actions, Workflow, and Governance'
    )
  );
$$;

create or replace function public._trbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports reflection, celebrates progress, encourages sustainable habits, and offers compassion during demanding periods — trust includes caring for pace.',
    'practices', jsonb_build_array(
      'Reflection — honest summaries without judgment when workloads intensify',
      'Celebrate progress — acknowledge milestones and steady improvement',
      'Sustainable habits — recommend pacing over urgency; trust grows slowly',
      'Compassion during demanding periods — supportive tone, never guilt',
      'Long-term relationship — appropriate reliance, not dependency'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. Trust & Reputation stores metadata signals, not wellbeing content.'
  );
$$;

create or replace function public._trbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates trust and relationship consistency internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion consistency, executive confidence, support reliability, communication quality',
      'focus', jsonb_build_array('Consistent companion tone across Command Center and assistant', 'Executive trust summaries before leadership decisions', 'Support reliability signals feeding reputation profiles', 'Transparent recommendation explanations in internal workflows')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce and support trust relationship patterns',
      'focus', jsonb_build_array('Workflow trust profiles for commerce operations', 'Support quality reputation signals', 'Human-reviewed trust expansion before automation widening', 'Appropriate reliance on proactive and approval flows')
    )
  );
$$;

create or replace function public._trbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Trust & Action Engine (Phase 30)', 'route', '/app/approvals', 'note', 'Sensitive action approvals — distinct from reputation profiles'),
    jsonb_build_object('label', 'Trust Architecture Security Dashboard', 'route', '/app/settings/security', 'note', 'Customer security transparency — distinct from A.72 reputation'),
    jsonb_build_object('label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine', 'note', 'Communication style and identity trust fields'),
    jsonb_build_object('label', 'Relationship Intelligence (A.78)', 'route', '/app/relationship-intelligence-engine', 'note', 'Organizational relationship intelligence — distinct from personal RSI'),
    jsonb_build_object('label', 'Personal RSI', 'route', '/app/assistant/relationships', 'note', 'Personal relationship assistant — not organizational trust profiles'),
    jsonb_build_object('label', 'License & Trust Center', 'route', '/app/license', 'note', 'Subscription trust and ownership transparency'),
    jsonb_build_object('label', 'Proactive Companion (A.79)', 'route', '/app/proactive-companion-engine', 'note', 'Proactive assistance — trust through transparent nudges'),
    jsonb_build_object('label', 'Presence Comfort (A.90)', 'route', '/app/presence-comfort-protocol', 'note', 'Comfort and pacing — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Legacy Trust Engine (Phase 76)', 'route', '/app/trust', 'note', 'Decision explanations and Trust Score — distinct from A.72 reputation'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing during demanding periods — principle only'),
    jsonb_build_object('label', 'Human Oversight (A.40)', 'route', '/app/human-oversight-engine', 'note', 'Oversight approvals inform trust expansion'),
    jsonb_build_object('label', 'Secure AI Actions (A.3)', 'route', '/app/secure-ai-action-engine', 'note', 'Approval accuracy feeds reputation signals')
  );
$$;

create or replace function public._trbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'An honest, consistent, genuinely helpful companion — one interaction at a time.',
    'Trust grows slowly through thousands of small moments — lost quickly when promises break.',
    'Technology earns trust through actions, not slogans.',
    'Appropriate reliance — Aipify informs and prepares; humans decide.',
    'Transparent recommendations build long-term confidence across every module.'
  );
$$;

create or replace function public._trbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_outcomes_total int := 0;
  v_outcomes_30d int := 0;
  v_expansion_approved int := 0;
  v_expansion_rejected int := 0;
  v_revocations int := 0;
  v_signals_90d int := 0;
  v_auto_signal boolean := true;
  v_expansion_review boolean := true;
begin
  v_summary := public._tre_executive_summary_block(p_org_id);

  select count(*) into v_outcomes_total
  from public.organization_trust_outcomes
  where organization_id = p_org_id;

  select count(*) into v_outcomes_30d
  from public.organization_trust_outcomes
  where organization_id = p_org_id
    and created_at >= now() - interval '30 days';

  select count(*) into v_expansion_approved
  from public.organization_trust_outcomes
  where organization_id = p_org_id and outcome_type = 'expansion_approved';

  select count(*) into v_expansion_rejected
  from public.organization_trust_outcomes
  where organization_id = p_org_id and outcome_type = 'expansion_rejected';

  select count(*) into v_revocations
  from public.organization_trust_outcomes
  where organization_id = p_org_id and outcome_type = 'revocation';

  select count(*) into v_signals_90d
  from public.organization_trust_signals s
  join public.organization_trust_profiles p on p.id = s.profile_id
  where p.organization_id = p_org_id
    and s.recorded_at >= now() - interval '90 days';

  select coalesce(s.auto_signal_enabled, true), coalesce(s.expansion_review_required, true)
  into v_auto_signal, v_expansion_review
  from public.organization_trust_settings s
  where s.organization_id = p_org_id;

  return jsonb_build_object(
    'active_profiles', coalesce((v_summary->>'active_profiles')::int, 0),
    'trusted_profiles', coalesce((v_summary->>'trusted_profiles')::int, 0),
    'under_review_profiles', coalesce((v_summary->>'under_review_profiles')::int, 0),
    'revoked_profiles', coalesce((v_summary->>'revoked_profiles')::int, 0),
    'avg_trust_score', coalesce((v_summary->>'avg_trust_score')::numeric, 0),
    'recent_signals_30d', coalesce((v_summary->>'recent_signals')::int, 0),
    'entity_type_count', coalesce((v_summary->>'entity_type_count')::int, 0),
    'outcomes_total', v_outcomes_total,
    'outcomes_last_30d', v_outcomes_30d,
    'expansion_approved', v_expansion_approved,
    'expansion_rejected', v_expansion_rejected,
    'revocations', v_revocations,
    'signals_last_90d', v_signals_90d,
    'auto_signal_enabled', v_auto_signal,
    'expansion_review_required', v_expansion_review,
    'privacy_note', 'Counts only — no trust profile content beyond summaries, customer records, or PII.'
  );
end; $$;

create or replace function public._trbp_blueprint_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_trusted int := 0;
  v_active int := 0;
  v_signals_30d int := 0;
  v_outcomes int := 0;
  v_under_review int := 0;
  v_avg_score numeric := 0;
begin
  v_engagement := public._trbp_engagement_summary(p_org_id);
  v_trusted := coalesce((v_engagement->>'trusted_profiles')::int, 0);
  v_active := coalesce((v_engagement->>'active_profiles')::int, 0);
  v_signals_30d := coalesce((v_engagement->>'recent_signals_30d')::int, 0);
  v_outcomes := coalesce((v_engagement->>'outcomes_total')::int, 0);
  v_under_review := coalesce((v_engagement->>'under_review_profiles')::int, 0);
  v_avg_score := coalesce((v_engagement->>'avg_trust_score')::numeric, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'trustworthy_perception',
      'label', 'Trustworthy perception — trusted profiles and healthy average scores',
      'met', v_trusted > 0 or v_avg_score >= 50,
      'note', case when v_trusted = 0 and v_avg_score < 50 then 'Seed trust profiles and record positive signals to demonstrate trustworthy perception.' else null end
    ),
    jsonb_build_object(
      'key', 'consistent_companion',
      'label', 'Consistent companion — active profiles across entity types',
      'met', v_active >= 3,
      'note', case when v_active < 3 then 'Trust profiles seed across workflow, approval, knowledge, support, and governance entity types.' else null end
    ),
    jsonb_build_object(
      'key', 'transparent_recommendations',
      'label', 'Transparent recommendations — trust signals and explanations documented',
      'met', v_signals_30d > 0 or jsonb_array_length(public._trbp_blueprint_trust_signals()->'users_should_see') >= 4,
      'note', 'Why recommendations appear; what influences guidance; uncertainty acknowledged.'
    ),
    jsonb_build_object(
      'key', 'long_term_engagement',
      'label', 'Long-term engagement — outcomes and signals accumulate over time',
      'met', v_outcomes > 0 or v_signals_30d > 0,
      'note', case when v_outcomes = 0 and v_signals_30d = 0 then 'Record trust outcomes or reputation signals to demonstrate long-term engagement.' else null end
    ),
    jsonb_build_object(
      'key', 'appropriate_reliance',
      'label', 'Appropriate reliance — human review before trust expansion',
      'met', coalesce((v_engagement->>'expansion_review_required')::boolean, true) or v_under_review >= 0,
      'note', 'Expansion review and revocation paths preserve human control.'
    ),
    jsonb_build_object(
      'key', 'relationship_objectives',
      'label', 'Relationship objectives documented — consistency, transparency, explanations, respect, responsibility, confidence',
      'met', jsonb_array_length(public._trbp_blueprint_relationship_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'relationship_principles',
      'label', 'Relationship principles documented — promises, uncertainty, explanations, boundaries, autonomy, preferences',
      'met', jsonb_array_length(public._trbp_blueprint_relationship_principles()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_examples',
      'label', 'Companion examples documented (🌹🔔🦉❤️) — styles, milestones, perspective, Self Love',
      'met', jsonb_array_length(public._trbp_blueprint_companion_examples()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'example_phrases',
      'label', 'Example phrases documented — not fully confident, explore alternatives, successful outcomes',
      'met', jsonb_array_length(public._trbp_blueprint_example_phrases()) >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — reflection, progress, sustainable habits, compassion',
      'met', true,
      'note', 'Self Love is a principle — appropriate reliance, not dependency.'
    ),
    jsonb_build_object(
      'key', 'blueprint_boundaries',
      'label', 'Boundaries enforced — no fake emotions, manipulation, excessive familiarity, overstepping',
      'met', jsonb_array_length(public._trbp_blueprint_boundaries()->'should_avoid') >= 5,
      'note', 'Phase A.72 trust profiles and expansion review preserved.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Trust & Action, Security Dashboard, Companion Identity, RSI, License',
      'met', jsonb_array_length(public._trbp_blueprint_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate approvals, security, or personal RSI logic.'
    ),
    jsonb_build_object(
      'key', 'trust_signals_documented',
      'label', 'Trust signals documented — why, influences, uncertainty, human control',
      'met', (public._trbp_blueprint_trust_signals()->>'principle') is not null,
      'note', 'Technology earns trust through actions, not slogans.'
    )
  );
end; $$;

create or replace function public._trbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Trust & Action Engine Phase 30 /app/approvals (sensitive action approvals), Trust Architecture Security Dashboard /app/settings/security (customer security transparency), Companion Identity A.84 /app/companion-identity-engine (communication style), Relationship Intelligence A.78 /app/relationship-intelligence-engine (organizational — not personal RSI at /app/assistant/relationships), License Center /app/license, Legacy Trust Engine Phase 76 /app/trust (decision explanations), Proactive Companion A.79 /app/proactive-companion-engine, and Presence Comfort A.90 /app/presence-comfort-protocol. Phase A.72 entity-scoped trust profiles, reputation signals, and expansion review preserved.';
$$;

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
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine',
      'mapping_note', 'ABOS Blueprint Phase 26 maps to Trust & Reputation Engine Phase A.72 — extend, do not duplicate Trust & Action, Security Dashboard, Companion Identity, or personal RSI.'
    ),
    'trust_relationship_note', 'Trust & Relationship Engine (ABOS Phase 26) — extends Trust & Reputation Engine Phase A.72 with blueprint metadata, relationship objectives, principles, and live engagement summary.',
    'blueprint_philosophy', 'Trust grows slowly through thousands of small moments — reliable, respectful, transparent, helpful, consistent; lost quickly when promises break.',
    'blueprint_mission', 'Build and maintain trusted long-term relationships — trust earned through consistency, transparency, and reliability.',
    'blueprint_abos_principle', 'Technology earns trust through actions, not slogans.',
    'vision', 'An honest, consistent, genuinely helpful companion — one interaction at a time.',
    'blueprint_distinction_note', public._trbp_distinction_note(),
    'relationship_objectives', public._trbp_blueprint_relationship_objectives(),
    'relationship_principles', public._trbp_blueprint_relationship_principles(),
    'example_phrases', public._trbp_blueprint_example_phrases(),
    'trust_signals', public._trbp_blueprint_trust_signals(),
    'companion_examples', public._trbp_blueprint_companion_examples(),
    'blueprint_boundaries', public._trbp_blueprint_boundaries(),
    'self_love_connection', public._trbp_blueprint_self_love_connection(),
    'dogfooding', public._trbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._trbp_blueprint_integration_links(),
    'engagement_summary', public._trbp_engagement_summary(v_org_id),
    'success_criteria', public._trbp_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._trbp_blueprint_vision_phrases(),
    'privacy_note', 'Trust & relationship signals are organization-scoped, explainable, and auditable. Metadata only — no raw customer content.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_trust_reputation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);
  v_summary := public._tre_executive_summary_block(v_org_id);
  v_engagement := public._trbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Trust & Reputation — earned trust through transparent metadata signals.',
    'active_profiles', v_summary->'active_profiles',
    'trusted_profiles', v_summary->'trusted_profiles',
    'under_review_profiles', v_summary->'under_review_profiles',
    'avg_trust_score', v_summary->'avg_trust_score',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'mission', 'Build and maintain trusted long-term relationships — consistency, transparency, reliability.',
    'abos_principle', 'Technology earns trust through actions, not slogans.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Trust & Relationship Engine (ABOS Phase 26) — extends Phase A.72 with relationship objectives, principles, trust signals, and live success criteria.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._trbp_blueprint_relationship_objectives() to authenticated;
grant execute on function public._trbp_blueprint_relationship_principles() to authenticated;
grant execute on function public._trbp_blueprint_example_phrases() to authenticated;
grant execute on function public._trbp_blueprint_trust_signals() to authenticated;
grant execute on function public._trbp_blueprint_companion_examples() to authenticated;
grant execute on function public._trbp_blueprint_boundaries() to authenticated;
grant execute on function public._trbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._trbp_blueprint_dogfooding() to authenticated;
grant execute on function public._trbp_blueprint_integration_links() to authenticated;
grant execute on function public._trbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._trbp_engagement_summary(uuid) to authenticated;
grant execute on function public._trbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'trust-relationship-blueprint', 'Trust & Relationship Engine (ABOS Phase 26)',
  'Trust & Relationship Engine — extends Phase A.72 with relationship objectives, principles, trust signals, companion examples, and live engagement summary.',
  'authenticated', 103
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'trust-relationship-blueprint' and tenant_id is null
);
