-- Implementation Blueprint Phase 67 — Board & Governance Companion Engine
-- Extends Governance & Policy Engine Phase A.14. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._bgcbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 67 — Board & Governance Companion Engine at /app/governance-policy-engine. Extends Governance & Policy Engine Phase A.14 (20260719000000_governance_policy_engine_phase_a14.sql). Distinct from Security, Compliance & Data Governance repo Phase 67 at /app/security and /app/compliance — ABOS blueprint 67 is this board companion spec. Distinct from Marketplace Governance Phase 90 at /app/marketplace-governance. Distinct from Compliance & Regulatory Readiness A.29 at /app/compliance-regulatory-readiness-engine (cross-link). Distinct from AI Ethics A.46 and Blueprint Phases 54/65 (companion evolution council). Distinct from Quality Guardian Phase 16 dual mapping (QG summary only — A.14 is config home). Distinct from Executive Companion Blueprint Phase 66 on Executive Insights A.35 (cross-link for board prep). Distinct from Enterprise Readiness Phase 37. Engine helpers use _gpe_* — blueprint Phase 67 MUST use _bgcbp_* only. All A.14 dashboard and card fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._bgcbp_mission()
returns text language sql immutable as $$
  select 'Help boards improve decision preparedness, strategic oversight, and accountability — preserve human judgment and independence.';
$$;

create or replace function public._bgcbp_philosophy()
returns text language sql immutable as $$
  select 'Governance creates responsible structures; strong boards navigate uncertainty with wisdom and discipline — not controlling every decision.';
$$;

create or replace function public._bgcbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — governance safeguards long-term wellbeing; balances accountability with wisdom.';
$$;

create or replace function public._bgcbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'board_preparation', 'label', 'Board preparation', 'description', 'Key developments, strategic topics, changes since last meeting, achievements'),
    jsonb_build_object('key', 'governance_visibility', 'label', 'Governance visibility', 'description', 'Policy status, review cadence, violations, and approval posture — metadata only'),
    jsonb_build_object('key', 'strategic_oversight', 'label', 'Strategic oversight', 'description', 'Strategic initiatives, org health indicators, financial summaries (metadata only), leadership priorities'),
    jsonb_build_object('key', 'risk_awareness', 'label', 'Risk awareness', 'description', 'Dependencies, emerging issues, risk exposure changes — preparedness not fear'),
    jsonb_build_object('key', 'meeting_effectiveness', 'label', 'Meeting effectiveness', 'description', 'Agenda prep, board packet summaries, governance reminders, follow-up tracking'),
    jsonb_build_object('key', 'stewardship_support', 'label', 'Stewardship support', 'description', 'Long-term stewardship, ethical decision-making, decision continuity and historical context')
  );
$$;

create or replace function public._bgcbp_board_preparation()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '📈',
      'key', 'key_developments',
      'scenario', 'Key developments since last board meeting',
      'example', '📈 Here are key developments and strategic topics since your last board meeting — prepared when directors are ready to review.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'strategic_topics',
      'scenario', 'Strategic topics for thoughtful board dialogue',
      'example', '🦉 These strategic topics may benefit from board discussion — context and metadata summaries only, no urgency implied.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'changes_since_last',
      'scenario', 'Governance and operational changes since last meeting',
      'example', '🔔 Policy reviews, approval posture, and governance milestones changed since the last meeting — available for board packet preparation.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'achievements',
      'scenario', 'Achievements and stewardship milestones',
      'example', '🌹 Several stewardship milestones and governance achievements progressed — recognition without pressure to accelerate every agenda item.'
    )
  );
$$;

create or replace function public._bgcbp_board_meeting_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Board meeting support scaffolds agenda prep, board packet summaries, governance reminders, follow-up tracking, and decision history references — Aipify prepares, directors decide.',
    'support_types', jsonb_build_array(
      jsonb_build_object('key', 'agenda_prep', 'label', 'Agenda preparation', 'description', 'Governance topics, policy reviews, and strategic items for board agenda — metadata only'),
      jsonb_build_object('key', 'board_packet', 'label', 'Board packet summaries', 'description', 'Concise governance and strategic summaries for director review — no raw financial records'),
      jsonb_build_object('key', 'governance_reminders', 'label', 'Governance reminders', 'description', 'Scheduled policy reviews, overdue items, and stewardship milestones'),
      jsonb_build_object('key', 'follow_up_tracking', 'label', 'Follow-up tracking', 'description', 'Outstanding board commitments and action items from prior meetings — metadata counts'),
      jsonb_build_object('key', 'decision_history', 'label', 'Decision history references', 'description', 'Previous board decisions and governance milestones for continuity')
    ),
    'meeting_collaboration_route', '/app/meeting-collaboration-intelligence-engine',
    'boundary_note', 'Meeting support scaffolds inform board conversations — directors retain independence and final judgment.'
  );
$$;

create or replace function public._bgcbp_strategic_oversight()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic oversight provides balanced visibility — strategic initiatives, org health indicators, financial summaries (metadata only), risk observations, and leadership priorities.',
    'oversight_areas', jsonb_build_array(
      jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiatives', 'description', 'Active objectives and alignment signals — cross-link Strategic Alignment A.55'),
      jsonb_build_object('key', 'org_health', 'label', 'Org health indicators', 'description', 'Aggregate organizational health scores — metadata only, cross-link A.56'),
      jsonb_build_object('key', 'financial_summaries', 'label', 'Financial summaries', 'description', 'Metadata framing only — trend indicators and summary counts, never raw financial records or PII'),
      jsonb_build_object('key', 'risk_observations', 'label', 'Risk observations', 'description', 'Governance violations, pending high-risk approvals, and policy drift signals'),
      jsonb_build_object('key', 'leadership_priorities', 'label', 'Leadership priorities', 'description', 'Executive companion cross-link for board-ready leadership context — Phase 66 A.35')
    ),
    'balanced_oversight_note', 'Balanced oversight — preparedness and stewardship, not micromanagement of management decisions.',
    'executive_companion_route', '/app/executive-insights-engine',
    'org_health_route', '/app/organizational-health-engine',
    'boundary_note', 'Financial summaries are metadata/scaffold framing only — no raw financial records stored in governance tables.'
  );
$$;

create or replace function public._bgcbp_risk_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'dependencies',
      'scenario', 'Governance dependencies and policy interconnections',
      'example', '🦉 Several governance policies interconnect — this dependency map may help the board assess oversight coverage, not assign blame.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'emerging_issues',
      'scenario', 'Emerging governance issues for board awareness',
      'example', '🔔 Emerging policy violations and review gaps deserve board awareness — preparedness framing, not alarm.'
    ),
    jsonb_build_object(
      'emoji', '📈',
      'key', 'risk_exposure_changes',
      'scenario', 'Risk exposure changes since last meeting',
      'example', '📈 Risk exposure indicators shifted since the last board meeting — metadata summaries for director review when ready.'
    )
  );
$$;

create or replace function public._bgcbp_governance_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'accountability', 'emoji', '🔒', 'label', 'Accountability — clear ownership and audit-supported governance actions'),
    jsonb_build_object('key', 'transparency', 'emoji', '✨', 'label', 'Transparency — explainable policies, violations, and review status'),
    jsonb_build_object('key', 'independence', 'emoji', '🦉', 'label', 'Independence — board judgment preserved; Aipify informs, never replaces directors'),
    jsonb_build_object('key', 'long_term_stewardship', 'emoji', '🌹', 'label', 'Long-term stewardship — decisions evaluated for sustained organizational wellbeing'),
    jsonb_build_object('key', 'ethical_decision_making', 'emoji', '💙', 'label', 'Ethical decision-making — cross-link AI Ethics A.46 and companion governance Phase 54/65')
  );
$$;

create or replace function public._bgcbp_decision_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision continuity connects previous board decisions, outstanding commitments, governance milestones, and historical context — metadata references only.',
    'continuity_elements', jsonb_build_array(
      jsonb_build_object('key', 'previous_decisions', 'label', 'Previous decisions', 'description', 'Prior governance policy activations, review completions, and approval posture changes'),
      jsonb_build_object('key', 'outstanding_commitments', 'label', 'Outstanding commitments', 'description', 'Open violations, pending reviews, and scheduled policy reviews awaiting board attention'),
      jsonb_build_object('key', 'governance_milestones', 'label', 'Governance milestones', 'description', 'Policy review cadence, autonomy level settings, and retention defaults'),
      jsonb_build_object('key', 'historical_context', 'label', 'Historical context', 'description', 'Audit-supported governance event metadata — no raw operational records')
    ),
    'audit_route', '/app/audit-accountability',
    'boundary_note', 'Continuity scaffolds support informed board dialogue — directors interpret context and decide action.'
  );
$$;

create or replace function public._bgcbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports reflection, perspective, deliberate pacing, and recognition of contribution — Good governance often involves patience and thoughtful dialogue.',
    'companion_patterns', jsonb_build_array(
      'Reflection — board preparation includes space for perspective, not only urgency',
      'Deliberate pacing — governance conversations benefit from patience and thoughtful dialogue',
      'Recognition of contribution — acknowledge director and leadership stewardship without pressure',
      'Recovery between intensive governance cycles contributes to long-term board effectiveness'
    ),
    'governance_phrase', 'Good governance often involves patience and thoughtful dialogue.',
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — Board & Governance Companion stores metadata scaffolds, not personal wellbeing content.'
  );
$$;

create or replace function public._bgcbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about what informs board observations, stated assumptions, and optional insights — directors always decide.',
    'what_informs_observations', jsonb_build_array(
      'Active organization policies and configuration metadata',
      'Policy violation counts and severity summaries — no raw customer content',
      'Scheduled and overdue policy review status',
      'Pending AI approval counts and autonomy level settings',
      'Cross-linked executive and organizational health metadata summaries'
    ),
    'assumptions', jsonb_build_array(
      'Financial summaries are metadata/scaffold framing only — never raw financial records',
      'Board companion scaffolds inform — directors retain independence and final judgment',
      'Risk awareness emphasizes preparedness, not fear-based governance'
    ),
    'optional_insights', jsonb_build_array(
      'Governance recommendations are optional — rationale and priority always visible',
      'Strategic oversight items cross-linked from other engines — hypothesis-labeled where applicable',
      'Companion examples (📈🦉🔔🌹) are patterns — not directives to the board'
    ),
    'audit_note', 'Governance lifecycle events logged via _gpe_log — metadata only, no PII or raw operational records.'
  );
$$;

create or replace function public._bgcbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates board and governance companion patterns internally — leadership oversight, strategic reviews, ecosystem stewardship, and ethical governance.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — leadership oversight, strategic reviews, ecosystem stewardship, ethical governance',
      'focus', jsonb_build_array(
        'Leadership oversight — quarterly board preparation and governance review cadence',
        'Strategic reviews — cross-link Executive Companion Phase 66 for board-ready briefings',
        'Ecosystem stewardship — marketplace and partner governance cross-links',
        'Ethical governance — AI Ethics A.46 and companion evolution council Phase 54/65 alignment'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce governance and board oversight scaffolding',
      'focus', jsonb_build_array(
        'Governance policy compliance and review cadence for pilot operations',
        'Board preparation metadata for leadership strategic sessions',
        'Risk awareness without alarmist framing — preparedness focus',
        'Decision continuity across governance milestones and policy reviews'
      )
    )
  );
$$;

create or replace function public._bgcbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Thoughtful, prepared, effective boards — governance conversations become more meaningful.',
    'Our governance conversations have become more meaningful.',
    'Governance safeguards long-term wellbeing — accountability balanced with wisdom.',
    'Strong boards navigate uncertainty with discipline — not controlling every decision.',
    'Board independence preserved — Aipify informs, directors decide.'
  );
$$;

create or replace function public._bgcbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Governance & Policy Engine (A.14)', 'route', '/app/governance-policy-engine', 'note', 'Primary engine — Phase 67 board companion extends A.14'),
    jsonb_build_object('label', 'Quality Guardian (Phase 16 / A.13)', 'route', '/app/quality-guardian-engine', 'note', 'Governance summary read-only — A.14 is config home'),
    jsonb_build_object('label', 'Executive Companion (Phase 66 / A.35)', 'route', '/app/executive-insights-engine', 'note', 'Board prep and leadership context — cross-link only'),
    jsonb_build_object('label', 'Compliance & Regulatory Readiness (A.29)', 'route', '/app/compliance-regulatory-readiness-engine', 'note', 'Operational compliance readiness — cross-link, not duplicate'),
    jsonb_build_object('label', 'Security Compliance (repo Phase 67)', 'route', '/app/security', 'note', 'Distinct from ABOS Blueprint Phase 67 — security/compliance data governance'),
    jsonb_build_object('label', 'Marketplace Governance (Phase 90)', 'route', '/app/marketplace-governance', 'note', 'Marketplace governance — distinct surface'),
    jsonb_build_object('label', 'AI Ethics (A.46)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Ethical AI governance — cross-link for board ethical oversight'),
    jsonb_build_object('label', 'Companion Evolution Council (Phase 65)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Values-driven capability review — layered on A.46 Phase 54/65'),
    jsonb_build_object('label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Aggregate health indicators for strategic oversight'),
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Strategic initiatives and objective alignment'),
    jsonb_build_object('label', 'Audit & Accountability', 'route', '/app/audit-accountability', 'note', 'Immutable governance audit trail — metadata only'),
    jsonb_build_object('label', 'Approvals / Trust & Action', 'route', '/app/approvals', 'note', 'Human oversight for sensitive AI actions'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Reflection, pacing, and thoughtful dialogue — principle only'),
    jsonb_build_object('label', 'Meeting & Collaboration (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Board meeting lifecycle and follow-up tracking scaffold')
  );
$$;

create or replace function public._bgcbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active_policies int := 0;
  v_open_violations int := 0;
  v_scheduled_reviews int := 0;
  v_overdue_reviews int := 0;
  v_pending_approvals int := 0;
begin
  perform public._gpe_seed_default_policies(p_org_id);

  select count(*) into v_active_policies
  from public.organization_policies
  where organization_id = p_org_id and status = 'active';

  select count(*) into v_open_violations
  from public.policy_violations
  where organization_id = p_org_id and status in ('open', 'acknowledged');

  select count(*) into v_scheduled_reviews
  from public.policy_reviews
  where organization_id = p_org_id and status = 'scheduled' and scheduled_at >= now();

  select count(*) into v_overdue_reviews
  from public.policy_reviews
  where organization_id = p_org_id and status = 'overdue';

  select count(*) into v_pending_approvals
  from public.ai_action_requests
  where organization_id = p_org_id and status = 'pending';

  return jsonb_build_object(
    'active_policies', coalesce(v_active_policies, 0),
    'open_violations', coalesce(v_open_violations, 0),
    'scheduled_reviews', coalesce(v_scheduled_reviews, 0),
    'overdue_reviews', coalesce(v_overdue_reviews, 0),
    'pending_approvals', coalesce(v_pending_approvals, 0),
    'board_preparation_examples', jsonb_array_length(public._bgcbp_board_preparation()),
    'risk_awareness_examples', jsonb_array_length(public._bgcbp_risk_awareness()),
    'governance_principles_documented', jsonb_array_length(public._bgcbp_governance_principles()),
    'privacy_note', 'Metadata counts only — no raw financial records, PII, or operational content.'
  );
end; $$;

create or replace function public._bgcbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active int := 0;
begin
  v_engagement := public._bgcbp_engagement_summary(p_org_id);
  v_active := coalesce((v_engagement->>'active_policies')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'board_preparation',
      'label', 'Board preparation — key developments, strategic topics, changes, achievements',
      'met', jsonb_array_length(public._bgcbp_board_preparation()) >= 4,
      'note', '📈🦉🔔🌹 companion preparation patterns documented.'
    ),
    jsonb_build_object(
      'key', 'meeting_support',
      'label', 'Board meeting support — agenda, packets, reminders, follow-up, decision history',
      'met', jsonb_array_length(public._bgcbp_board_meeting_support()->'support_types') >= 5,
      'note', 'Meeting support scaffolds — directors retain independence.'
    ),
    jsonb_build_object(
      'key', 'strategic_oversight',
      'label', 'Strategic oversight — initiatives, org health, financial metadata, risks, priorities',
      'met', jsonb_array_length(public._bgcbp_strategic_oversight()->'oversight_areas') >= 5,
      'note', 'Financial summaries metadata/scaffold framing only.'
    ),
    jsonb_build_object(
      'key', 'risk_awareness',
      'label', 'Risk awareness — dependencies, emerging issues, exposure changes',
      'met', jsonb_array_length(public._bgcbp_risk_awareness()) >= 3,
      'note', '🦉🔔📈 preparedness not fear.'
    ),
    jsonb_build_object(
      'key', 'governance_principles',
      'label', 'Governance principles — accountability, transparency, independence, stewardship, ethics',
      'met', jsonb_array_length(public._bgcbp_governance_principles()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'decision_continuity',
      'label', 'Decision continuity — previous decisions, commitments, milestones, historical context',
      'met', jsonb_array_length(public._bgcbp_decision_continuity()->'continuity_elements') >= 4,
      'note', 'Audit-supported metadata references only.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — reflection, pacing, recognition, thoughtful dialogue',
      'met', (public._bgcbp_self_love_connection()->>'governance_phrase') is not null,
      'note', 'Good governance often involves patience and thoughtful dialogue.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust — what informs observations, assumptions, optional insights',
      'met', (public._bgcbp_trust_connection()->'optional_insights') is not null,
      'note', 'Directors always decide — Aipify informs.'
    ),
    jsonb_build_object(
      'key', 'governance_engagement',
      'label', 'Live governance engagement summary from A.14 tables',
      'met', v_engagement ? 'active_policies',
      'note', format(
        '%s active policies, %s open violations, %s scheduled reviews, %s pending approvals.',
        coalesce((v_engagement->>'active_policies')::int, 0),
        coalesce((v_engagement->>'open_violations')::int, 0),
        coalesce((v_engagement->>'scheduled_reviews')::int, 0),
        coalesce((v_engagement->>'pending_approvals')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'policies_active',
      'label', 'Governance policies active for board visibility',
      'met', v_active > 0,
      'note', case when v_active = 0 then 'Seed default policies via A.14 dashboard.' else null end
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Security Phase 67, Marketplace Phase 90, Compliance A.29, Ethics 54/65',
      'met', jsonb_array_length(public._bgcbp_integration_links()) >= 12,
      'note', 'Extend A.14 — do not duplicate routes.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group leadership oversight and ethical governance',
      'met', (public._bgcbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'board_independence',
      'label', 'Board independence preserved — Aipify informs, directors decide',
      'met', true,
      'note', 'No automated board decisions or director impersonation.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.14 fields; append Phase 67
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_policy_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.governance_settings;
  v_pending_approvals int;
begin
  perform public._irp_require_permission('governance.view');
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);
  v_settings := public._gpe_ensure_settings(v_org_id);

  select count(*) into v_pending_approvals
  from public.ai_action_requests where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Tenant-aware governance with human oversight for sensitive actions, transparent decision-making, and full audit support.',
    'safety_note', 'High and critical risk actions always require human approval. Level 4 critical actions are prohibited for AI.',
    'principles', jsonb_build_array(
      'Tenant-aware governance',
      'Human oversight for sensitive actions',
      'Transparent decision-making',
      'Configurable policies',
      'Full audit support'
    ),
    'settings', jsonb_build_object(
      'ai_autonomy_level', v_settings.ai_autonomy_level,
      'retention_defaults', v_settings.retention_defaults,
      'review_cadence_days', v_settings.review_cadence_days
    ),
    'active_policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'policy_key', p.policy_key, 'policy_name', p.policy_name,
        'category', p.category, 'status', p.status, 'configuration', p.configuration
      ) order by p.category, p.policy_name)
      from public.organization_policies p
      where p.organization_id = v_org_id and p.status = 'active'
    ), '[]'::jsonb),
    'policy_violations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'policy_id', v.policy_id, 'policy_name', p.policy_name,
        'violation_type', v.violation_type, 'severity', v.severity,
        'description', v.description, 'status', v.status, 'detected_at', v.detected_at
      ) order by v.detected_at desc)
      from public.policy_violations v
      join public.organization_policies p on p.id = v.policy_id
      where v.organization_id = v_org_id and v.status in ('open', 'acknowledged') limit 15
    ), '[]'::jsonb),
    'upcoming_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'policy_id', r.policy_id, 'policy_name', p.policy_name,
        'scheduled_at', r.scheduled_at, 'status', r.status, 'owner_user_id', r.owner_user_id
      ) order by r.scheduled_at asc)
      from public.policy_reviews r
      join public.organization_policies p on p.id = r.policy_id
      where r.organization_id = v_org_id and r.status in ('scheduled', 'overdue') limit 10
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'action_key', a.action_key, 'risk_level', a.risk_level,
        'status', a.status, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.ai_action_requests a
      where a.organization_id = v_org_id and a.status = 'pending' limit 10
    ), '[]'::jsonb),
    'pending_approval_count', v_pending_approvals,
    'approval_requirements', jsonb_build_object(
      'low', public._gpe_check_approval_requirements(v_org_id, 'low'),
      'medium', public._gpe_check_approval_requirements(v_org_id, 'medium'),
      'high', public._gpe_check_approval_requirements(v_org_id, 'high')
    ),
    'governance_recommendations', coalesce((
      select jsonb_agg(rec order by (rec->>'priority')::int)
      from (
        select jsonb_build_object(
          'key', 'review_high_risk_pending',
          'title', 'Review pending high-risk approvals',
          'priority', 1,
          'reason', 'High-risk AI actions require owner approval per governance policy'
        ) as rec
        where v_pending_approvals > 0
        union all
        select jsonb_build_object(
          'key', 'schedule_policy_review',
          'title', 'Schedule quarterly policy review',
          'priority', 2,
          'reason', 'Regular policy reviews maintain governance health'
        ) as rec
        where not exists (
          select 1 from public.policy_reviews
          where organization_id = v_org_id and status = 'scheduled'
            and scheduled_at > now()
        )
        union all
        select jsonb_build_object(
          'key', 'run_violation_scan',
          'title', 'Run policy violation scan',
          'priority', 3,
          'reason', 'Detect drift from active governance policies'
        ) as rec
        where exists (
          select 1 from public.organization_policies
          where organization_id = v_org_id and status = 'active'
        )
      ) s
    ), '[]'::jsonb),
    'policy_categories', jsonb_build_array(
      'ai_autonomy', 'approval', 'support', 'access', 'knowledge_publishing', 'integration', 'retention'
    ),
    'autonomy_levels', jsonb_build_array(
      'advisory_only', 'approval_required', 'limited_automation', 'organization_defined'
    ),
    'integrates_with', jsonb_build_array('action_policies', 'ai_action_requests', 'audit_logs', 'trust_action_engine'),
    'implementation_blueprint_phase67', jsonb_build_object(
      'phase', 'Phase 67 — Board & Governance Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE67_BOARD_GOVERNANCE_COMPANION.md',
      'engine_phase', 'Phase A.14 Governance & Policy Engine',
      'route', '/app/governance-policy-engine',
      'mapping_note', 'ABOS Blueprint Phase 67 extends A.14 with board preparation, strategic oversight, risk awareness, and governance companion patterns. Distinct from Security Compliance repo Phase 67 at /app/security.'
    ),
    'board_governance_companion_note', 'Board & Governance Companion Engine (ABOS Phase 67) — extends Governance & Policy A.14 with board preparation, meeting support, strategic oversight, and decision continuity.',
    'blueprint_distinction_note', public._bgcbp_distinction_note(),
    'blueprint_mission', public._bgcbp_mission(),
    'blueprint_philosophy', public._bgcbp_philosophy(),
    'blueprint_abos_principle', public._bgcbp_abos_principle(),
    'vision', 'Thoughtful, prepared, effective boards — Our governance conversations have become more meaningful.',
    'blueprint_objectives', public._bgcbp_objectives(),
    'board_preparation', public._bgcbp_board_preparation(),
    'board_meeting_support', public._bgcbp_board_meeting_support(),
    'strategic_oversight', public._bgcbp_strategic_oversight(),
    'risk_awareness', public._bgcbp_risk_awareness(),
    'blueprint_governance_principles', public._bgcbp_governance_principles(),
    'decision_continuity', public._bgcbp_decision_continuity(),
    'self_love_connection', public._bgcbp_self_love_connection(),
    'trust_connection', public._bgcbp_trust_connection(),
    'dogfooding', public._bgcbp_dogfooding(),
    'blueprint_integration_links', public._bgcbp_integration_links(),
    'engagement_summary', public._bgcbp_engagement_summary(v_org_id),
    'success_criteria', public._bgcbp_success_criteria(v_org_id),
    'vision_phrases', public._bgcbp_vision_phrases(),
    'metadata_note', 'Board companion uses metadata only — no raw financial records, no PII. Financial summaries are scaffold framing only.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 16 + A.14 fields; append Phase 67
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_policy_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'active_policies', (select count(*) from public.organization_policies where organization_id = v_org_id and status = 'active'),
    'open_violations', (select count(*) from public.policy_violations where organization_id = v_org_id and status = 'open'),
    'pending_approvals', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'pending'),
    'upcoming_reviews', (select count(*) from public.policy_reviews where organization_id = v_org_id and status = 'scheduled' and scheduled_at >= now()),
    'philosophy', 'Configurable governance policies with human oversight.',
    'quality_guardian_blueprint_note', 'ABOS Phase 16 — governance summary also visible on Quality Guardian dashboard at /app/quality-guardian-engine.',
    'implementation_blueprint_phase67', jsonb_build_object(
      'phase', 'Phase 67 — Board & Governance Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE67_BOARD_GOVERNANCE_COMPANION.md',
      'engine_phase', 'Phase A.14 Governance & Policy Engine',
      'route', '/app/governance-policy-engine'
    ),
    'mission', public._bgcbp_mission(),
    'abos_principle', public._bgcbp_abos_principle(),
    'engagement_summary', public._bgcbp_engagement_summary(v_org_id),
    'blueprint_note', 'Board & Governance Companion Engine (ABOS Phase 67) — extends A.14 with board preparation, strategic oversight, and live success criteria.',
    'governance_note', 'Governance safeguards long-term wellbeing — directors decide, Aipify informs.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._bgcbp_distinction_note() to authenticated;
grant execute on function public._bgcbp_mission() to authenticated;
grant execute on function public._bgcbp_philosophy() to authenticated;
grant execute on function public._bgcbp_abos_principle() to authenticated;
grant execute on function public._bgcbp_objectives() to authenticated;
grant execute on function public._bgcbp_board_preparation() to authenticated;
grant execute on function public._bgcbp_board_meeting_support() to authenticated;
grant execute on function public._bgcbp_strategic_oversight() to authenticated;
grant execute on function public._bgcbp_risk_awareness() to authenticated;
grant execute on function public._bgcbp_governance_principles() to authenticated;
grant execute on function public._bgcbp_decision_continuity() to authenticated;
grant execute on function public._bgcbp_self_love_connection() to authenticated;
grant execute on function public._bgcbp_trust_connection() to authenticated;
grant execute on function public._bgcbp_dogfooding() to authenticated;
grant execute on function public._bgcbp_vision_phrases() to authenticated;
grant execute on function public._bgcbp_integration_links() to authenticated;
grant execute on function public._bgcbp_engagement_summary(uuid) to authenticated;
grant execute on function public._bgcbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'board-governance-companion-blueprint-phase67', 'Board & Governance Companion (ABOS Phase 67)',
  'Board & Governance Companion Engine — extends Governance & Policy A.14 with board preparation, strategic oversight, risk awareness, decision continuity, and live success criteria.',
  'authenticated', 108
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'board-governance-companion-blueprint-phase67' and tenant_id is null
);
