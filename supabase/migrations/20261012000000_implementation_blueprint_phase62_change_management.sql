-- Implementation Blueprint Phase 62 — Change Management Engine
-- Extends Change Management Engine Phase A.47 at /app/change-management-engine. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._cmbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 62 — Change Management Engine at /app/change-management-engine. Extends Change Management Engine Phase A.47 (20260823000000_change_management_engine_phase_a47.sql). Distinct from Evolution Governance & Change Management Phase 84 at /app/evolution (Aipify software evolution proposals — not org change initiatives). Distinct from Enterprise Deployment Framework Phase 92 change management section at /app/enterprise/framework. Distinct from Stakeholder Communication Engine A.53 at /app/stakeholder-communication-engine (cross-link for communication support). Distinct from Learning & Training A.36, Customer Success A.26, Deployment & Environment A.20, Human Oversight A.40 (integration cross-links only). Distinct from Organizational Health Blueprint Phase 61 A.56 at /app/organizational-health-engine. Engine helpers use _cme_* — blueprint helpers MUST use _cmbp_* (do not collide with _cme_*). All A.47 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._cmbp_mission()
returns text language sql immutable as $$
  select 'Help organizations introduce new systems, processes, structures, and ways of working while supporting people affected.';
$$;

create or replace function public._cmbp_philosophy()
returns text language sql immutable as $$
  select 'People resist uncertainty, confusion, and lack of involvement — not change itself. Successful change requires communication, support, and empathy.';
$$;

create or replace function public._cmbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — change is not just implementation; help people move confidently from one reality to another.';
$$;

create or replace function public._cmbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'change_planning', 'label', 'Change planning', 'description', 'Structured initiatives with impact assessment, milestones, and accountable ownership'),
    jsonb_build_object('key', 'communication_guidance', 'label', 'Communication guidance', 'description', 'Transparent announcements, FAQs, leadership talking points, and progress updates'),
    jsonb_build_object('key', 'stakeholder_awareness', 'label', 'Stakeholder awareness', 'description', 'Who is affected, what concerns may arise, and where to raise questions — metadata only'),
    jsonb_build_object('key', 'adoption_support', 'label', 'Adoption support', 'description', 'Training recommendations, companion onboarding, reinforcement reminders — nurtured not assumed'),
    jsonb_build_object('key', 'progress_visibility', 'label', 'Progress visibility', 'description', 'Milestones, adoption metrics, and completion updates visible to leaders and teams'),
    jsonb_build_object('key', 'reinforcement_strategies', 'label', 'Reinforcement strategies', 'description', 'Celebration messages, follow-up communications, and sustained adoption review')
  );
$$;

create or replace function public._cmbp_change_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational',
      'description', 'New workflows, process redesign, policy updates',
      'examples', jsonb_build_array('Workflow redesign', 'Policy updates', 'Process improvements', 'Operational policy alignment')
    ),
    jsonb_build_object(
      'key', 'technology',
      'label', 'Technology',
      'description', 'Software implementations, migrations, AI adoption',
      'examples', jsonb_build_array('Module activation', 'System migration', 'AI adoption', 'Integration rollout')
    ),
    jsonb_build_object(
      'key', 'organizational',
      'label', 'Organizational',
      'description', 'Restructuring, leadership transitions, growth-related changes',
      'examples', jsonb_build_array('Role changes', 'Leadership transition', 'Team restructuring', 'Growth scaling')
    )
  );
$$;

create or replace function public._cmbp_readiness_assessment()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Change readiness assessment prepares leaders and teams — why the change is necessary, who is affected, concerns to address, support structures, and how success is defined.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'why_necessary', 'label', 'Why necessary', 'description', 'Clear rationale — business case and human impact without pressure'),
      jsonb_build_object('key', 'who_affected', 'label', 'Who affected', 'description', 'Teams, roles, and workflows impacted — metadata only, no PII'),
      jsonb_build_object('key', 'concerns', 'label', 'Concerns', 'description', 'Anticipated questions, workload impact, and uncertainty areas'),
      jsonb_build_object('key', 'support_structures', 'label', 'Support structures', 'description', 'Training, communication plans, champions, and escalation paths'),
      jsonb_build_object('key', 'success_definition', 'label', 'Success definition', 'description', 'Measurable adoption outcomes and qualitative confidence indicators')
    ),
    'a47_note', 'A.47 change_initiatives and change_impact_assessments store operational readiness metadata — Phase 62 adds human-centered framing.'
  );
$$;

create or replace function public._cmbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'communication_gap',
      'scenario', 'Additional communication may help',
      'example', '🦉 Stakeholders on the support team may benefit from another briefing before go-live — additional communication may help reduce uncertainty.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'stakeholder_preparation',
      'scenario', 'Stakeholders may need more preparation',
      'example', '🌹 Training completion for this initiative is below target — stakeholders may need more preparation time before the next milestone.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'milestone_success',
      'scenario', 'Milestone completed successfully',
      'example', '🔔 Impact assessment milestone completed successfully — consider a brief progress update to reinforce momentum and acknowledge effort.'
    )
  );
$$;

create or replace function public._cmbp_communication_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Communication support helps leaders explain change with clarity and empathy — templates and guidance, not automated messaging without approval.',
    'resources', jsonb_build_array(
      jsonb_build_object('key', 'announcement_templates', 'label', 'Announcement templates', 'description', 'Stakeholder announcements and rollout messages via change_communication_plans'),
      jsonb_build_object('key', 'faqs', 'label', 'FAQs', 'description', 'Anticipated questions with honest answers — cross-link Knowledge Center'),
      jsonb_build_object('key', 'leadership_talking_points', 'label', 'Leadership talking points', 'description', 'Why, what, when, support available, and where to raise concerns'),
      jsonb_build_object('key', 'progress_updates', 'label', 'Progress updates', 'description', 'Milestone and adoption progress summaries — metadata only'),
      jsonb_build_object('key', 'celebration_messages', 'label', 'Celebration messages', 'description', 'Completion updates that recognize effort without pressure')
    ),
    'stakeholder_communication_route', '/app/stakeholder-communication-engine',
    'boundary_note', 'Stakeholder Communication A.53 handles multi-channel delivery — Change Management A.47 owns initiative-scoped plans; cross-link, do not duplicate.'
  );
$$;

create or replace function public._cmbp_adoption_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adoption is nurtured, not assumed — training, companion onboarding, reinforcement reminders, and Knowledge Center resources support people through transition.',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'training_recommendations', 'label', 'Training recommendations', 'description', 'Learning path assignments via assign_change_training() — A.36 hook'),
      jsonb_build_object('key', 'companion_onboarding', 'label', 'Companion onboarding', 'description', 'Guided module adoption with explainable companion assistance'),
      jsonb_build_object('key', 'reinforcement_reminders', 'label', 'Reinforcement reminders', 'description', 'Gentle follow-ups on milestones and adoption metrics — never guilt-based'),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center resources', 'description', 'Approved guides and FAQs — metadata references only')
    ),
    'learning_route', '/app/learning-training-engine',
    'boundary_note', 'Learning & Training A.36 owns paths and completion — Change Management links metadata only.'
  );
$$;

create or replace function public._cmbp_resistance_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resistance often signals unmet needs — respond with empathy, not blame. Understand concerns before pushing adoption.',
    'common_concerns', jsonb_build_array(
      jsonb_build_object('key', 'workload', 'label', 'Workload concerns', 'description', 'Additional tasks during transition — acknowledge and plan recovery'),
      jsonb_build_object('key', 'fear_unknown', 'label', 'Fear of the unknown', 'description', 'Uncertainty about new tools or roles — transparent communication reduces anxiety'),
      jsonb_build_object('key', 'lack_understanding', 'label', 'Lack of understanding', 'description', 'Why the change matters — repeat rationale without condescension'),
      jsonb_build_object('key', 'unclear_expectations', 'label', 'Unclear expectations', 'description', 'What success looks like and what support is available')
    ),
    'response_tone', 'Empathy and dialogue — never punitive framing or hidden pressure'
  );
$$;

create or replace function public._cmbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports change adoption — patience, compassion, recovery periods, and recognition of progress. Adjustment often requires time.',
    'practices', jsonb_build_array(
      'Patience — transitions deserve time; no urgency traps during demanding periods',
      'Compassion — acknowledge strain without guilt or blame',
      'Recovery periods — plan pacing alongside rollout milestones',
      'Progress recognition — celebrate milestones and steady improvement'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Change Management stores initiative metadata, not wellbeing content.'
  );
$$;

create or replace function public._cmbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights surface adoption progress, stakeholder engagement observations, and positive momentum indicators — metadata only, humans decide action.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'adoption_progress', 'label', 'Adoption progress', 'description', 'Engagement, workflow utilization, training completion, and outcome metrics'),
      jsonb_build_object('key', 'stakeholder_engagement', 'label', 'Stakeholder engagement', 'description', 'Communication plan status, pending milestones, and release cadence'),
      jsonb_build_object('key', 'positive_momentum', 'label', 'Positive momentum', 'description', 'Completed milestones, released communications, and improving adoption trends')
    ),
    'dialogue_note', 'Insights inform leadership conversations — never automated mandates or surveillance framing'
  );
$$;

create or replace function public._cmbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust during change means transparency — why changes occur, expected outcomes, support provided, and where concerns can be raised.',
    'users_should_see', jsonb_build_array(
      'Why — clear rationale for each initiative and communication',
      'Expected outcomes — success definition and adoption targets',
      'Support provided — training, communication, and escalation paths',
      'Where to raise concerns — human channels; Aipify prepares, humans respond'
    ),
    'license_route', '/app/license',
    'audit_note', 'Change lifecycle events logged via _cme_log() — metadata only, no raw customer content.'
  );
$$;

create or replace function public._cmbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates change management patterns internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product evolution, Sales Expert program, organizational scaling, companion enhancements',
      'focus', jsonb_build_array(
        'Product evolution rollouts with structured communication',
        'Sales Expert program adoption and training alignment',
        'Organizational scaling — role and workflow changes',
        'Companion enhancements with transparent release notes'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce module adoption and workflow change',
      'focus', jsonb_build_array(
        'Support AI and commerce module rollouts',
        'Training completion before go-live milestones',
        'Stakeholder communication for operational changes',
        'Human-reviewed adoption metrics and milestone completion'
      )
    )
  );
$$;

create or replace function public._cmbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Transformation without losing people — leaders supported, employees included.',
    'This change was handled thoughtfully.',
    'Help people move confidently from one reality to another.',
    'Communication, support, and empathy — not just implementation checklists.',
    'Constructive resistance handled with dialogue — organizational resilience grows.'
  );
$$;

create or replace function public._cmbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Evolution Governance (Phase 84)', 'route', '/app/evolution', 'note', 'Aipify software evolution proposals — not org change initiatives'),
    jsonb_build_object('label', 'Enterprise Deployment Framework (Phase 92)', 'route', '/app/enterprise/framework', 'note', 'Enterprise deployment change section — distinct from A.47 org initiatives'),
    jsonb_build_object('label', 'Stakeholder Communication (A.53)', 'route', '/app/stakeholder-communication-engine', 'note', 'Multi-channel delivery — cross-link for communication support'),
    jsonb_build_object('label', 'Learning & Training (A.36)', 'route', '/app/learning-training-engine', 'note', 'Training paths — assign_change_training() metadata hook'),
    jsonb_build_object('label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine', 'note', 'Adoption health alignment — cross-link only'),
    jsonb_build_object('label', 'Deployment & Environment (A.20)', 'route', '/app/deployment-environment-management-engine', 'note', 'Deployment schedules — _cme_deployment_summary cross-link'),
    jsonb_build_object('label', 'Human Oversight (A.40)', 'route', '/app/human-oversight-engine', 'note', 'High-impact changes respect approval patterns'),
    jsonb_build_object('label', 'Organizational Health (Phase 61 / A.56)', 'route', '/app/organizational-health-engine', 'note', 'Change readiness indicators — distinct from initiative management'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center', 'note', 'Approved guides and FAQs — metadata references'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Patience and recovery during transition — principle only'),
    jsonb_build_object('label', 'License & Trust Center', 'route', '/app/license', 'note', 'Ownership transparency during platform changes')
  );
$$;

create or replace function public._cmbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total_initiatives int := 0;
  v_active int := 0;
  v_completed int := 0;
  v_pending_milestones int := 0;
  v_completed_milestones int := 0;
  v_pending_communications int := 0;
  v_adoption_metrics int := 0;
begin
  select count(*) into v_total_initiatives
  from public.change_initiatives where organization_id = p_org_id;

  select count(*) into v_active
  from public.change_initiatives
  where organization_id = p_org_id and status in ('planning', 'in_progress');

  select count(*) into v_completed
  from public.change_initiatives
  where organization_id = p_org_id and status = 'completed';

  select count(*) into v_pending_milestones
  from public.change_milestones
  where organization_id = p_org_id and status = 'pending';

  select count(*) into v_completed_milestones
  from public.change_milestones
  where organization_id = p_org_id and status = 'completed';

  select count(*) into v_pending_communications
  from public.change_communication_plans
  where organization_id = p_org_id and status in ('draft', 'scheduled');

  select count(*) into v_adoption_metrics
  from public.change_adoption_metrics
  where organization_id = p_org_id
    and recorded_at >= now() - interval '90 days';

  return jsonb_build_object(
    'total_initiatives', coalesce(v_total_initiatives, 0),
    'active_initiatives', coalesce(v_active, 0),
    'completed_initiatives', coalesce(v_completed, 0),
    'pending_milestones', coalesce(v_pending_milestones, 0),
    'completed_milestones', coalesce(v_completed_milestones, 0),
    'pending_communications', coalesce(v_pending_communications, 0),
    'adoption_metrics_90d', coalesce(v_adoption_metrics, 0),
    'privacy_note', 'Engagement counts only — metadata, no PII.'
  );
end; $$;

create or replace function public._cmbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_total int := 0;
  v_active int := 0;
  v_completed int := 0;
  v_metrics int := 0;
begin
  v_engagement := public._cmbp_engagement_summary(p_org_id);
  v_total := coalesce((v_engagement->>'total_initiatives')::int, 0);
  v_active := coalesce((v_engagement->>'active_initiatives')::int, 0);
  v_completed := coalesce((v_engagement->>'completed_initiatives')::int, 0);
  v_metrics := coalesce((v_engagement->>'adoption_metrics_90d')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'structured_initiatives',
      'label', 'Structured initiatives — change planning with milestones and assessments',
      'met', v_total > 0,
      'note', case when v_total = 0 then 'Create a change initiative to begin structured adoption.' else null end
    ),
    jsonb_build_object(
      'key', 'improved_adoption',
      'label', 'Improved adoption — metrics and training hooks documented',
      'met', v_metrics > 0 or v_active > 0,
      'note', 'Record adoption metrics and assign training where paths exist.'
    ),
    jsonb_build_object(
      'key', 'stakeholder_confidence',
      'label', 'Stakeholder confidence — communication support and readiness assessment',
      'met', jsonb_array_length(public._cmbp_communication_support()->'resources') >= 5,
      'note', 'Transparent announcements, FAQs, and progress updates.'
    ),
    jsonb_build_object(
      'key', 'constructive_resistance',
      'label', 'Constructive resistance handling — empathy not blame',
      'met', jsonb_array_length(public._cmbp_resistance_awareness()->'common_concerns') >= 4,
      'note', 'Understand workload, fear, understanding, and expectation gaps.'
    ),
    jsonb_build_object(
      'key', 'organizational_resilience',
      'label', 'Organizational resilience — reinforcement and leadership insights',
      'met', jsonb_array_length(public._cmbp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion change guidance — 🦉🌹🔔 examples for leaders',
      'met', jsonb_array_length(public._cmbp_companion_guidance()) >= 3,
      'note', 'Additional communication, preparation, and milestone celebration.'
    ),
    jsonb_build_object(
      'key', 'readiness_assessment',
      'label', 'Change readiness assessment — why, who, concerns, support, success',
      'met', jsonb_array_length(public._cmbp_readiness_assessment()->'dimensions') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'change_types',
      'label', 'Change types — operational, technology, organizational',
      'met', jsonb_array_length(public._cmbp_change_types()) >= 3,
      'note', 'Blueprint framing distinct from A.47 initiative change_type enum.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — patience, compassion, recovery, progress recognition',
      'met', true,
      'note', 'Adjustment often requires time — principle only.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — why, outcomes, support, concern channels',
      'met', jsonb_array_length(public._cmbp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Evolution Phase 84, Enterprise Phase 92, Stakeholder A.53, Org Health Phase 61',
      'met', jsonb_array_length(public._cmbp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate evolution or stakeholder delivery logic.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group product evolution, Sales Expert, scaling, companion',
      'met', (public._cmbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'completed_initiatives',
      'label', 'Completed initiatives — measurable outcomes and celebration',
      'met', v_completed > 0 or v_total > 0,
      'note', case when v_completed = 0 and v_total > 0 then format('%s active initiative(s) in progress.', v_active) else null end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.47 fields; append Phase 62
-- ---------------------------------------------------------------------------
create or replace function public.get_change_management_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('changes.view');
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-centered adoption — transparent communication, structured implementation, measurable outcomes.',
    'principles', jsonb_build_array(
      'Human-centered adoption',
      'Transparent communication',
      'Structured implementation',
      'Measurable outcomes',
      'Audit-supported accountability'
    ),
    'summary', jsonb_build_object(
      'total_initiatives', coalesce((
        select count(*) from public.change_initiatives where organization_id = v_org_id
      ), 0),
      'active', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status in ('planning', 'in_progress')
      ), 0),
      'completed', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_communications', coalesce((
        select count(*) from public.change_communication_plans
        where organization_id = v_org_id and status in ('draft', 'scheduled')
      ), 0),
      'pending_milestones', coalesce((
        select count(*) from public.change_milestones
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'initiatives', coalesce((
      select jsonb_agg(row_to_json(ci) order by ci.created_at desc)
      from public.change_initiatives ci where ci.organization_id = v_org_id
    ), '[]'::jsonb),
    'impact_assessments', coalesce((
      select jsonb_agg(row_to_json(ia) order by ia.created_at desc)
      from public.change_impact_assessments ia where ia.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'communication_plans', coalesce((
      select jsonb_agg(row_to_json(cp) order by cp.created_at desc)
      from public.change_communication_plans cp where cp.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'adoption_metrics', coalesce((
      select jsonb_agg(row_to_json(am) order by am.recorded_at desc)
      from public.change_adoption_metrics am where am.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.initiative_id, m.milestone_order)
      from public.change_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'deployment_environment', 'Extends Deployment & Environment Management (A.20)',
      'customer_success', 'Aligns adoption metrics with Customer Success (A.26)',
      'learning_training', 'Training assignments hook to Learning & Training (A.36) — metadata only',
      'human_oversight', 'High-impact changes respect Human Oversight (A.40) approval patterns'
    ),
    'integration_summaries', jsonb_build_object(
      'learning', public._cme_learning_summary(v_org_id),
      'deployment', public._cme_deployment_summary(v_org_id),
      'customer_success', public._cme_customer_success_summary(v_org_id)
    ),
    'implementation_blueprint_phase62', jsonb_build_object(
      'phase', 'Phase 62 — Change Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_MANAGEMENT.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'route', '/app/change-management-engine',
      'mapping_note', 'ABOS Blueprint Phase 62 extends A.47 with human-centered change framing — communication, adoption support, resistance awareness, and leadership insights.'
    ),
    'change_management_note', 'Change Management Engine (ABOS Phase 62) — extends Phase A.47 with people-centered change adoption, readiness assessment, companion guidance, and live engagement summary.',
    'blueprint_distinction_note', public._cmbp_distinction_note(),
    'blueprint_mission', public._cmbp_mission(),
    'blueprint_philosophy', public._cmbp_philosophy(),
    'blueprint_abos_principle', public._cmbp_abos_principle(),
    'vision', 'Transformation without losing people — leaders supported, employees included; this change was handled thoughtfully.',
    'blueprint_objectives', public._cmbp_objectives(),
    'blueprint_change_types', public._cmbp_change_types(),
    'readiness_assessment', public._cmbp_readiness_assessment(),
    'companion_guidance', public._cmbp_companion_guidance(),
    'communication_support', public._cmbp_communication_support(),
    'adoption_support', public._cmbp_adoption_support(),
    'resistance_awareness', public._cmbp_resistance_awareness(),
    'self_love_connection', public._cmbp_self_love_connection(),
    'leadership_insights', public._cmbp_leadership_insights(),
    'trust_connection', public._cmbp_trust_connection(),
    'dogfooding', public._cmbp_dogfooding(),
    'blueprint_integration_links', public._cmbp_integration_links(),
    'engagement_summary', public._cmbp_engagement_summary(v_org_id),
    'success_criteria', public._cmbp_success_criteria(v_org_id),
    'vision_phrases', public._cmbp_vision_phrases(),
    'privacy_note', 'Change management data is organization-scoped, explainable, and auditable. Metadata only — no PII.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.47 fields; append Phase 62 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_change_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);
  v_engagement := public._cmbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Structured change adoption with transparent communication and measurable outcomes.',
    'active_initiatives', coalesce((
      select count(*) from public.change_initiatives
      where organization_id = v_org_id and status in ('planning', 'in_progress')
    ), 0),
    'pending_milestones', coalesce((
      select count(*) from public.change_milestones
      where organization_id = v_org_id and status = 'pending'
    ), 0),
    'implementation_blueprint_phase62', jsonb_build_object(
      'phase', 'Phase 62 — Change Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_MANAGEMENT.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'route', '/app/change-management-engine'
    ),
    'mission', public._cmbp_mission(),
    'abos_principle', public._cmbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Change Management Engine (ABOS Phase 62) — extends Phase A.47 with people-centered adoption, communication support, and live success criteria.',
    'change_note', 'Help people move confidently from one reality to another — humans lead; Aipify prepares and informs.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._cmbp_distinction_note() to authenticated;
grant execute on function public._cmbp_mission() to authenticated;
grant execute on function public._cmbp_philosophy() to authenticated;
grant execute on function public._cmbp_abos_principle() to authenticated;
grant execute on function public._cmbp_objectives() to authenticated;
grant execute on function public._cmbp_change_types() to authenticated;
grant execute on function public._cmbp_readiness_assessment() to authenticated;
grant execute on function public._cmbp_companion_guidance() to authenticated;
grant execute on function public._cmbp_communication_support() to authenticated;
grant execute on function public._cmbp_adoption_support() to authenticated;
grant execute on function public._cmbp_resistance_awareness() to authenticated;
grant execute on function public._cmbp_self_love_connection() to authenticated;
grant execute on function public._cmbp_leadership_insights() to authenticated;
grant execute on function public._cmbp_trust_connection() to authenticated;
grant execute on function public._cmbp_dogfooding() to authenticated;
grant execute on function public._cmbp_vision_phrases() to authenticated;
grant execute on function public._cmbp_integration_links() to authenticated;
grant execute on function public._cmbp_engagement_summary(uuid) to authenticated;
grant execute on function public._cmbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'change-management-blueprint-phase62', 'Change Management Engine (ABOS Phase 62)',
  'Change Management Engine — extends Phase A.47 with human-centered change adoption, readiness assessment, communication and adoption support, resistance awareness, and leadership insights.',
  'authenticated', 106
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'change-management-blueprint-phase62' and tenant_id is null
);
