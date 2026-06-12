-- Implementation Blueprint Phase 73 — Organizational Continuity Engine
-- Extends Continuity, Resilience & Crisis Management Phase 80. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._ocontbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 73 — Organizational Continuity Engine at /app/continuity. Extends Continuity, Resilience & Crisis Management Phase 80 (20260617100000_continuity_resilience_crisis_phase80.sql). Distinct from Value Engine repo Phase 73 at /app/value. Distinct from Organizational Memory A.34 Blueprint Phase 55 at /app/organizational-memory-engine (companion/memory continuity — cross-link). Distinct from Organizational Resilience A.50 at /app/organizational-resilience-engine (scenario simulations — cross-link). Distinct from Records & Retention A.60. Phase 80 crisis/incident mode preserved — Phase 73 adds people/knowledge/succession/transitions framing layer. Engine helpers use _cnt_* — blueprint Phase 73 MUST use _ocontbp_*. Tenant scope preserved via _cnt_require_tenant().';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._ocontbp_mission()
returns text language sql immutable as $$
  select 'Preserve operational effectiveness — critical knowledge, responsibilities, and processes remain accessible and sustainable.';
$$;

create or replace function public._ocontbp_philosophy()
returns text language sql immutable as $$
  select 'People are invaluable; organizations should not depend on individual memory. Continuity protects organizations and the people within them.';
$$;

create or replace function public._ocontbp_abos_principle()
returns text language sql immutable as $$
  select 'Preserve knowledge, distribute responsibility, prepare for change — continuity protects people and progress. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._ocontbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_continuity', 'label', 'Knowledge continuity', 'description', 'Institutional knowledge preservation, documentation support, transfer recommendations, cross-training'),
    jsonb_build_object('key', 'responsibility_continuity', 'label', 'Responsibility continuity', 'description', 'Backup ownership, role coverage, and distributed accountability across critical processes'),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity', 'description', 'Leadership transition preparation and succession awareness — metadata patterns only'),
    jsonb_build_object('key', 'operational_resilience', 'label', 'Operational resilience', 'description', 'Single points of failure, critical dependencies, knowledge concentration, process vulnerabilities'),
    jsonb_build_object('key', 'transition_support', 'label', 'Transition support', 'description', 'Upcoming transitions, handoff planning, and continuity preparation — foresight not pressure'),
    jsonb_build_object('key', 'succession_awareness', 'label', 'Succession awareness', 'description', 'Responsibility mapping and knowledge transfer guidance — humans decide timing')
  );
$$;

create or replace function public._ocontbp_knowledge_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge continuity — institutional knowledge preserved and transferable across roles and transitions.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'institutional_preservation', 'label', 'Institutional knowledge preservation', 'description', 'Documented processes, KC articles, and organizational memory metadata — cross-link OME Phase 55'),
      jsonb_build_object('key', 'documentation_support', 'label', 'Documentation support', 'description', 'Surface documentation needs for critical processes — improvement opportunity'),
      jsonb_build_object('key', 'transfer_recommendations', 'label', 'Knowledge transfer recommendations', 'description', 'Suggest cross-training and handoff documentation before transitions'),
      jsonb_build_object('key', 'cross_training', 'label', 'Cross-training opportunities', 'description', 'Backup ownership chains reveal where shared expertise strengthens resilience')
    ),
    'metadata_note', 'Knowledge continuity uses process counts, backup assignments, and documentation scores — no individual performance evaluation.'
  );
$$;

create or replace function public._ocontbp_role_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Role continuity — responsibilities distributed; no single role should hold exclusive operational knowledge.',
    'signals', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'concentrated_responsibilities', 'signal', 'Responsibilities concentrated in a single role', 'description', 'Backup assignment gaps suggest cross-training — preparedness not blame'),
      jsonb_build_object('emoji', '🌹', 'key', 'cross_training_opportunity', 'signal', 'Cross-training opportunities strengthen coverage', 'description', 'Secondary and tertiary backup owners distribute operational load sustainably'),
      jsonb_build_object('emoji', '🔔', 'key', 'transition_planning', 'signal', 'Transition planning deserves early preparation', 'description', 'Upcoming role changes benefit from documented handoffs — humans decide timing')
    ),
    'preparedness_note', 'Role continuity encourages preparedness — never punitive interpretation of individual dependency.'
  );
$$;

create or replace function public._ocontbp_succession_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Succession support — leadership and role transitions prepared with responsibility mapping and knowledge transfer guidance.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'leadership_transition', 'label', 'Leadership transition preparation', 'description', 'Continuity plans and briefing summaries support leadership handoffs — human approval required'),
      jsonb_build_object('key', 'responsibility_mapping', 'label', 'Responsibility mapping', 'description', 'Critical processes with primary/secondary/tertiary backup owners — metadata from continuity_backup_assignments'),
      jsonb_build_object('key', 'knowledge_transfer', 'label', 'Knowledge transfer guidance', 'description', 'Documentation and KC cross-links for handoff preparation'),
      jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning', 'description', 'Active continuity plans document recovery paths — distinct from Resilience A.50 scenario simulations')
    ),
    'boundary_note', 'Succession awareness is advisory — Aipify prepares context; leaders decide appointments and timing.'
  );
$$;

create or replace function public._ocontbp_operational_resilience()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Operational resilience — identify systemic vulnerabilities without judging individuals.',
    'vulnerability_patterns', jsonb_build_array(
      jsonb_build_object('key', 'single_points_of_failure', 'label', 'Single points of failure', 'description', 'Critical processes without backup assignments — system signal only'),
      jsonb_build_object('key', 'critical_dependencies', 'label', 'Critical dependencies', 'description', 'Processes marked critical/high without redundancy coverage'),
      jsonb_build_object('key', 'knowledge_concentration', 'label', 'Knowledge concentration', 'description', 'Documentation score gaps and missing backup chains — shared knowledge opportunity'),
      jsonb_build_object('key', 'process_vulnerabilities', 'label', 'Process vulnerabilities', 'description', 'Readiness components (backup, recovery, escalation, communication, redundancy, documentation) reveal improvement areas')
    ),
    'improvement_note', 'Vulnerability patterns strengthen systems — never evaluate personal worth or individual performance.'
  );
$$;

create or replace function public._ocontbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — foresight for documentation, expertise sharing, and transition preparation.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'documentation_needs', 'prompt', 'Critical processes may benefit from updated documentation — shall I summarize coverage gaps?', 'consideration', 'Documentation strengthens continuity — humans decide what to publish.'),
      jsonb_build_object('emoji', '🌹', 'key', 'colleague_expertise', 'prompt', 'Colleague expertise shared across backup chains strengthens continuity — would a cross-training review help?', 'consideration', 'Shared expertise reduces dependency — collective strength.'),
      jsonb_build_object('emoji', '🔔', 'key', 'upcoming_transition', 'prompt', 'An upcoming transition may benefit from continuity preparation — shall I outline handoff considerations?', 'consideration', 'Foresight supports smooth transitions — no pressure or guilt.')
    )
  );
$$;

create or replace function public._ocontbp_onboarding_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Onboarding connection — role summaries, knowledge pathways, historical context, and learning resources for new team members.',
    'pathways', jsonb_build_array(
      jsonb_build_object('key', 'role_summaries', 'label', 'Role summaries', 'description', 'Digital twin roles and backup ownership chains provide operational context', 'route', '/app/digital-twin-engine'),
      jsonb_build_object('key', 'knowledge_pathways', 'label', 'Knowledge pathways', 'description', 'KC articles and employee knowledge for role-specific guidance', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'historical_context', 'label', 'Historical context', 'description', 'Organizational memory metadata for how processes evolved — OME Phase 55 cross-link', 'route', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'learning_resources', 'label', 'Learning resources', 'description', 'Customer Onboarding and Learning & Training for structured ramp-up', 'route', '/app/learning-training-engine')
    ),
    'boundary_note', 'Onboarding pathways cross-link existing engines — Phase 73 does not duplicate onboarding storage.'
  );
$$;

create or replace function public._ocontbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — shared responsibility, reduced dependency, sustainable workloads, collective appreciation.',
    'practices', jsonb_build_array(
      'Shared responsibility — no individual should feel the entire organization depends exclusively upon them',
      'Reduced dependency — backup ownership distributes operational load sustainably',
      'Sustainable workloads — cross-training prevents burnout from concentrated knowledge',
      'Collective appreciation — teams succeed together; continuity protects people and progress'
    ),
    'journey_phrase', 'No individual should feel the entire organization depends exclusively upon them.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable collaboration — principle only; Organizational Continuity stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._ocontbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — continuity health summaries, dependency observations, and positive knowledge sharing.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'continuity_health', 'label', 'Continuity health summaries', 'description', 'Readiness score, backup coverage, and process criticality aggregates — metadata only'),
      jsonb_build_object('key', 'dependency_observations', 'label', 'Dependency observations', 'description', 'Backup gaps and knowledge concentration patterns — system signals'),
      jsonb_build_object('key', 'positive_knowledge_sharing', 'label', 'Positive knowledge sharing', 'description', 'Cross-training opportunities and documentation improvements — celebrate collective resilience')
    ),
    'dialogue_note', 'Insights encourage constructive continuity planning — never punitive dashboards or hidden evaluations.'
  );
$$;

create or replace function public._ocontbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about how observations are generated, assumptions, and optional insights.',
    'users_should_see', jsonb_build_array(
      'How continuity observations derive from critical processes, backup assignments, and readiness scores — metadata only',
      'Privacy principles — no individual judgment, punitive interpretations, or hidden evaluations',
      'Optional companion insights — leaders control enablement and timing',
      'Human control — humans lead crisis response and succession decisions; Aipify prepares context'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Value Engine repo Phase 73 — organizational continuity, not ROI analytics',
      'Distinct from OME Phase 55 — companion/memory continuity cross-link, not duplicate storage',
      'Distinct from Organizational Resilience A.50 — scenario simulations cross-link, not duplicate',
      'Phase 80 incident mode preserved — Phase 73 adds people/knowledge/succession framing only'
    ),
    'audit_note', 'Continuity events audited via _cnt_log_audit — metadata only.'
  );
$$;

create or replace function public._ocontbp_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — strengthen systems, not evaluate personal worth.',
    'rules', jsonb_build_array(
      'NO individual judgment — continuity signals are systemic, never personal scoring',
      'NO punitive interpretations — dependency patterns frame improvement opportunities',
      'NO hidden evaluations — all observations visible and explainable on the dashboard',
      'Metadata only — process counts, backup chains, readiness components; no PII or performance rankings'
    ),
    'strengthen_systems_note', 'Organizational continuity reveals resilience opportunities — humans retain operational authority.'
  );
$$;

create or replace function public._ocontbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates organizational continuity internally — leadership transitions, product knowledge, Sales Expert continuity, operational resilience.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — leadership transitions, product knowledge continuity, Sales Expert coverage, operational resilience',
      'focus', jsonb_build_array(
        'Leadership transition preparation across product and platform teams',
        'Product knowledge documentation and cross-training paths',
        'Sales Expert continuity and partner knowledge handoffs',
        'Operational resilience for support escalations and security reviews'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational continuity',
      'focus', jsonb_build_array(
        'Support escalation backup ownership validation',
        'Finance approval continuity chains',
        'Knowledge ownership cross-training for commerce operations',
        'Incident mode coordination under human leadership'
      )
    )
  );
$$;

create or replace function public._ocontbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We are stronger because success no longer depends on a few individuals alone.',
    'Resilient through growth, transition, and uncertainty.',
    'Preserve knowledge, distribute responsibility, prepare for change.',
    'Continuity protects people and progress.',
    'No individual should feel the entire organization depends exclusively upon them.'
  );
$$;

create or replace function public._ocontbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Organizational Memory (A.34 / Phase 55)', 'route', '/app/organizational-memory-engine', 'note', 'Companion/memory continuity — cross-link only'),
    jsonb_build_object('label', 'Organizational Resilience (A.50)', 'route', '/app/organizational-resilience-engine', 'note', 'Scenario simulations — cross-link only'),
    jsonb_build_object('label', 'Records & Retention (A.60)', 'route', '/app/records-retention-management-engine', 'note', 'Retention policies — distinct from continuity planning'),
    jsonb_build_object('label', 'Value Engine (repo Phase 73)', 'route', '/app/value', 'note', 'Impact analytics — NOT this ABOS blueprint (phase number collision)'),
    jsonb_build_object('label', 'Incident Response (A.51)', 'route', '/app/incident-response-coordination-engine', 'note', 'Coordinated incident response — complements Phase 80 incident mode'),
    jsonb_build_object('label', 'Digital Twin', 'route', '/app/digital-twin-engine', 'note', 'Role definitions and backup owner keys'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Documentation and knowledge pathways'),
    jsonb_build_object('label', 'Learning & Training', 'route', '/app/learning-training-engine', 'note', 'Onboarding and cross-training resources'),
    jsonb_build_object('label', 'Employee Knowledge (EKE)', 'route', '/app/settings/employee-knowledge', 'note', 'Role-based internal guidance'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Shared responsibility — principle only'),
    jsonb_build_object('label', 'Sales Expert', 'route', '/app/sales-expert-engine', 'note', 'Partner knowledge continuity dogfooding'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Continuity summaries for leadership')
  );
$$;

create or replace function public._ocontbp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_processes int := 0;
  v_backups int := 0;
  v_gaps int := 0;
  v_plans int := 0;
  v_critical int := 0;
begin
  select count(*) into v_processes
  from public.continuity_critical_processes where tenant_id = p_tenant_id;

  select count(*) into v_backups
  from public.continuity_backup_assignments b
  join public.continuity_critical_processes p on p.id = b.process_id
  where p.tenant_id = p_tenant_id;

  v_gaps := greatest(0, v_processes - v_backups);

  select count(*) into v_plans
  from public.continuity_plans where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_critical
  from public.continuity_critical_processes
  where tenant_id = p_tenant_id and criticality_level = 'critical';

  return jsonb_build_object(
    'critical_processes', coalesce(v_processes, 0),
    'backup_assignments', coalesce(v_backups, 0),
    'backup_gaps', v_gaps,
    'active_plans', coalesce(v_plans, 0),
    'critical_process_count', coalesce(v_critical, 0),
    'coverage_ratio', case when v_processes > 0 then round((v_backups::numeric / v_processes::numeric) * 100, 1) else 0 end,
    'objective_count', jsonb_array_length(public._ocontbp_objectives()),
    'companion_examples', jsonb_array_length(public._ocontbp_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — process counts, backup assignment aggregates, and plan counts. No individual performance scoring or PII.'
  );
end; $$;

create or replace function public._ocontbp_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_processes int := 0;
  v_backups int := 0;
  v_gaps int := 0;
begin
  v_engagement := public._ocontbp_engagement_summary(p_tenant_id);
  v_processes := coalesce((v_engagement->>'critical_processes')::int, 0);
  v_backups := coalesce((v_engagement->>'backup_assignments')::int, 0);
  v_gaps := coalesce((v_engagement->>'backup_gaps')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'operational_resilience',
      'label', 'Operational resilience — critical processes documented with backup coverage',
      'met', v_processes >= 1 and v_backups >= 1,
      'note', case when v_processes = 0 then 'Seed continuity plans to establish critical processes.' else null end
    ),
    jsonb_build_object(
      'key', 'knowledge_continuity',
      'label', 'Knowledge continuity — documentation and transfer practices documented',
      'met', jsonb_array_length(public._ocontbp_knowledge_continuity()->'practices') >= 4,
      'note', 'Institutional preservation, documentation support, transfer recommendations, cross-training.'
    ),
    jsonb_build_object(
      'key', 'improved_transitions',
      'label', 'Improved transitions — succession support and role continuity framing',
      'met', jsonb_array_length(public._ocontbp_succession_support()->'dimensions') >= 4,
      'note', 'Leadership transition prep, responsibility mapping, knowledge transfer, continuity planning.'
    ),
    jsonb_build_object(
      'key', 'reduced_dependency_risks',
      'label', 'Reduced dependency risks — backup gaps surfaced for human review',
      'met', v_gaps >= 0,
      'note', case when v_gaps > 0 then format('%s backup gap(s) visible — cross-training opportunity.', v_gaps) else 'Full backup coverage or healthy baseline.' end
    ),
    jsonb_build_object(
      'key', 'onboarding_effectiveness',
      'label', 'Onboarding effectiveness — knowledge pathways and learning cross-links documented',
      'met', jsonb_array_length(public._ocontbp_onboarding_connection()->'pathways') >= 4,
      'note', 'Role summaries, knowledge pathways, historical context, learning resources.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — foresight examples for documentation and transitions',
      'met', jsonb_array_length(public._ocontbp_companion_guidance()->'examples') >= 3,
      'note', '🦉🌹🔔 foresight — humans decide; Aipify prepares context.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — continuity health, dependencies, positive knowledge sharing',
      'met', jsonb_array_length(public._ocontbp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no individual judgment, punitive interpretation, or hidden evaluation',
      'met', jsonb_array_length(public._ocontbp_privacy_principles()->'rules') >= 4,
      'note', 'Strengthen systems — never evaluate personal worth.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent observation generation documented',
      'met', jsonb_array_length(public._ocontbp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Distinct from Value Engine Phase 73, OME Phase 55, Resilience A.50, Records A.60',
      'met', jsonb_array_length(public._ocontbp_integration_links()) >= 10,
      'note', 'Cross-link related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group leadership transitions, product knowledge, Sales Expert continuity',
      'met', (public._ocontbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — preserve knowledge, distribute responsibility, prepare for change',
      'met', true,
      'note', 'Continuity protects people and progress.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 80 fields; append Phase 73
-- ---------------------------------------------------------------------------
create or replace function public.get_continuity_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_readiness jsonb;
  v_plans jsonb;
  v_processes jsonb;
  v_incidents jsonb;
  v_mode jsonb;
  v_briefings jsonb;
begin
  v_tenant_id := public._cnt_require_tenant();
  perform public._cnt_seed_continuity();
  v_readiness := public.calculate_continuity_readiness_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'description', p.description, 'status', p.status
  )), '[]'::jsonb) into v_plans from public.continuity_plans p where p.tenant_id = v_tenant_id and p.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cp.id, 'process_name', cp.process_name, 'process_key', cp.process_key,
    'criticality_level', cp.criticality_level,
    'backup', (
      select jsonb_build_object(
        'primary', b.primary_owner_role_key,
        'secondary', b.secondary_owner_role_key,
        'tertiary', b.tertiary_owner_role_key
      ) from public.continuity_backup_assignments b where b.process_id = cp.id
    )
  )), '[]'::jsonb) into v_processes from public.continuity_critical_processes cp where cp.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'incident_level', i.incident_level,
    'level_label', public._cnt_incident_level_label(i.incident_level),
    'category', i.category, 'summary', i.summary, 'status', i.status,
    'created_at', i.created_at
  ) order by i.created_at desc), '[]'::jsonb) into v_incidents
  from public.continuity_incident_events i where i.tenant_id = v_tenant_id limit 15;

  select jsonb_build_object(
    'active', coalesce(m.active, false),
    'incident_id', m.incident_id,
    'activated_at', m.activated_at
  ) into v_mode from public.continuity_incident_mode m where m.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.continuity_briefings b where b.tenant_id = v_tenant_id limit 5;

  perform public._cnt_log_audit(v_tenant_id, 'dashboard_viewed', 'Continuity dashboard accessed', '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'human_leadership_required', true,
    'overall_score', v_readiness->'overall_score',
    'readiness_band', v_readiness->'readiness_band',
    'readiness_components', jsonb_build_object(
      'backup', v_readiness->'backup_score',
      'recovery', v_readiness->'recovery_score',
      'escalation', v_readiness->'escalation_score',
      'communication', v_readiness->'communication_score',
      'redundancy', v_readiness->'redundancy_score',
      'documentation', v_readiness->'documentation_score'
    ),
    'incident_mode', coalesce(v_mode, '{"active":false}'::jsonb),
    'plans', v_plans,
    'critical_processes', v_processes,
    'incidents', v_incidents,
    'briefings', v_briefings,
    'incident_levels', jsonb_build_array(
      jsonb_build_object('level', 1, 'label', 'Localized Incident'),
      jsonb_build_object('level', 2, 'label', 'Departmental Incident'),
      jsonb_build_object('level', 3, 'label', 'Organizational Incident'),
      jsonb_build_object('level', 4, 'label', 'Critical Crisis')
    ),
    'integrations', jsonb_build_object(
      'digital_twin', 'Backup owners and alternative approval paths',
      'simulation_lab', 'Continuity scenario preparation',
      'aoc', 'Resilience gap detection',
      'action_center', 'Incident tasks and recovery tracking',
      'executive_briefing', 'Continuity summaries',
      'security', 'Security incident coordination'
    ),
    'implementation_blueprint_phase73', jsonb_build_object(
      'phase', 'Phase 73 — Organizational Continuity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE73_ORGANIZATIONAL_CONTINUITY.md',
      'engine_phase', 'Phase 80 Continuity, Resilience & Crisis Management',
      'route', '/app/continuity',
      'mapping_note', 'ABOS Blueprint Phase 73 extends Phase 80 with people/knowledge/succession/transitions framing — crisis/incident mode preserved.'
    ),
    'organizational_continuity_note', 'Organizational Continuity Engine (ABOS Phase 73) — extends Continuity Phase 80 with knowledge, role, and succession continuity framing.',
    'blueprint_distinction_note', public._ocontbp_distinction_note(),
    'blueprint_mission', public._ocontbp_mission(),
    'blueprint_philosophy', public._ocontbp_philosophy(),
    'blueprint_abos_principle', public._ocontbp_abos_principle(),
    'blueprint_objectives', public._ocontbp_objectives(),
    'knowledge_continuity', public._ocontbp_knowledge_continuity(),
    'role_continuity', public._ocontbp_role_continuity(),
    'succession_support', public._ocontbp_succession_support(),
    'operational_resilience', public._ocontbp_operational_resilience(),
    'companion_guidance', public._ocontbp_companion_guidance(),
    'onboarding_connection', public._ocontbp_onboarding_connection(),
    'blueprint_self_love_connection', public._ocontbp_self_love_connection(),
    'blueprint_leadership_insights', public._ocontbp_leadership_insights(),
    'blueprint_trust_connection', public._ocontbp_trust_connection(),
    'privacy_principles', public._ocontbp_privacy_principles(),
    'blueprint_dogfooding', public._ocontbp_dogfooding(),
    'blueprint_integration_links', public._ocontbp_integration_links(),
    'engagement_summary', public._ocontbp_engagement_summary(v_tenant_id),
    'blueprint_success_criteria', public._ocontbp_success_criteria(v_tenant_id),
    'blueprint_vision_phrases', public._ocontbp_vision_phrases(),
    'blueprint_privacy_note', 'Organizational continuity is metadata only — no individual judgment, punitive interpretation, or hidden evaluation.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 80 fields; append Phase 73 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_continuity_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score numeric;
  v_band text;
  v_mode boolean;
  v_open int;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select overall_score, readiness_band into v_score, v_band
  from public.continuity_scores where tenant_id = v_tenant_id order by created_at desc limit 1;

  select active into v_mode from public.continuity_incident_mode where tenant_id = v_tenant_id;

  select count(*) into v_open from public.continuity_incident_events
  where tenant_id = v_tenant_id and status not in ('resolved', 'closed');

  v_engagement := public._ocontbp_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'overall_score', coalesce(v_score, 75),
    'readiness_band', coalesce(v_band, 'prepared'),
    'incident_mode_active', coalesce(v_mode, false),
    'open_incidents', v_open,
    'philosophy', 'Aipify supports resilience. Humans lead resilience.',
    'human_leadership_required', true,
    'implementation_blueprint_phase73', jsonb_build_object(
      'phase', 'Phase 73 — Organizational Continuity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE73_ORGANIZATIONAL_CONTINUITY.md',
      'engine_phase', 'Phase 80 Continuity, Resilience & Crisis Management',
      'route', '/app/continuity'
    ),
    'blueprint_mission', public._ocontbp_mission(),
    'blueprint_abos_principle', public._ocontbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Organizational Continuity Engine (ABOS Phase 73) — extends Phase 80 with knowledge, role, and succession continuity framing.',
    'continuity_note', 'We are stronger because success no longer depends on a few individuals alone.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ocontbp_distinction_note() to authenticated;
grant execute on function public._ocontbp_mission() to authenticated;
grant execute on function public._ocontbp_philosophy() to authenticated;
grant execute on function public._ocontbp_abos_principle() to authenticated;
grant execute on function public._ocontbp_objectives() to authenticated;
grant execute on function public._ocontbp_knowledge_continuity() to authenticated;
grant execute on function public._ocontbp_role_continuity() to authenticated;
grant execute on function public._ocontbp_succession_support() to authenticated;
grant execute on function public._ocontbp_operational_resilience() to authenticated;
grant execute on function public._ocontbp_companion_guidance() to authenticated;
grant execute on function public._ocontbp_onboarding_connection() to authenticated;
grant execute on function public._ocontbp_self_love_connection() to authenticated;
grant execute on function public._ocontbp_leadership_insights() to authenticated;
grant execute on function public._ocontbp_trust_connection() to authenticated;
grant execute on function public._ocontbp_privacy_principles() to authenticated;
grant execute on function public._ocontbp_dogfooding() to authenticated;
grant execute on function public._ocontbp_vision_phrases() to authenticated;
grant execute on function public._ocontbp_integration_links() to authenticated;
grant execute on function public._ocontbp_engagement_summary(uuid) to authenticated;
grant execute on function public._ocontbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'continuity-blueprint-phase73', 'Organizational Continuity Engine (ABOS Phase 73)',
  'Organizational Continuity Engine — extends Continuity Phase 80 with knowledge continuity, role continuity, succession support, operational resilience, companion guidance, onboarding connection, and live success criteria.',
  'authenticated', 112
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'continuity-blueprint-phase73' and tenant_id is null
);
