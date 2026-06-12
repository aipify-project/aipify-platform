-- Implementation Blueprint Phase 16 — Governance & Quality Guardian Foundation
-- Spec alignment extending Quality Guardian Engine (Phase A.13) with Governance & Policy A.14 summary. No new tables.
-- Primary UI: /app/quality-guardian-engine. Governance config: /app/governance-policy-engine.

-- ---------------------------------------------------------------------------
-- Governance summary from A.14 tables (read-only for QG dashboard)
-- ---------------------------------------------------------------------------
create or replace function public._qge_governance_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.governance_settings;
  v_active_policies int := 0;
  v_open_violations int := 0;
  v_pending_approvals int := 0;
begin
  perform public._gpe_seed_default_policies(p_organization_id);
  v_settings := public._gpe_ensure_settings(p_organization_id);

  select count(*) into v_active_policies
  from public.organization_policies
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_open_violations
  from public.policy_violations
  where organization_id = p_organization_id and status = 'open';

  select count(*) into v_pending_approvals
  from public.ai_action_requests
  where organization_id = p_organization_id and status = 'pending';

  return jsonb_build_object(
    'active_policies', v_active_policies,
    'open_violations', v_open_violations,
    'pending_approvals', v_pending_approvals,
    'review_cadence_days', v_settings.review_cadence_days,
    'ai_autonomy_level', v_settings.ai_autonomy_level,
    'governance_route', '/app/governance-policy-engine',
    'note', 'Read-only summary from Governance & Policy Engine A.14 — configure policies at governance route.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Live success criteria
-- ---------------------------------------------------------------------------
create or replace function public._qge_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.quality_guardian_settings;
  v_checks int := 0;
  v_recommendations int := 0;
  v_active_policies int := 0;
  v_scan_runs int := 0;
begin
  v_settings := public._qge_ensure_settings(p_organization_id);
  perform public._gpe_seed_default_policies(p_organization_id);

  select count(*) into v_checks
  from public.organization_quality_checks
  where organization_id = p_organization_id;

  select count(*) into v_recommendations
  from public.quality_recommendations
  where organization_id = p_organization_id;

  select count(*) into v_active_policies
  from public.organization_policies
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_scan_runs
  from public.audit_logs
  where organization_id = p_organization_id and action_type = 'quality_scan_executed';

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'quality_checks_or_scan',
      'label', 'Quality checks exist or a quality scan has been run',
      'met', v_checks > 0 or v_scan_runs > 0,
      'note', case
        when v_checks = 0 and v_scan_runs = 0 then 'Run a quality scan from the dashboard to detect operational patterns.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'recommendations',
      'label', 'Improvement recommendations surfaced with explainability',
      'met', v_recommendations > 0,
      'note', case
        when v_recommendations = 0 then 'Quality scans generate explainable recommendations when patterns are detected.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'governance_policies_active',
      'label', 'Governance policies active (A.14)',
      'met', v_active_policies > 0,
      'note', case
        when v_active_policies = 0 then 'Activate organization policies in Governance & Policy Engine.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'settings_configured',
      'label', 'Quality Guardian settings configured',
      'met', v_settings.id is not null,
      'note', 'Settings auto-provisioned per organization — adjust thresholds as needed.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Static blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._qge_quality_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational', 'label', 'Operational quality — recurring failures and bottlenecks'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge quality — stale articles and KC review gaps'),
    jsonb_build_object('key', 'support', 'label', 'Support quality — escalations and satisfaction trends'),
    jsonb_build_object('key', 'workflow', 'label', 'Workflow quality — approvals, onboarding, integrations'),
    jsonb_build_object('key', 'companion_consistency', 'label', 'Companion consistency — respectful, trustworthy tone'),
    jsonb_build_object('key', 'governance_compliance', 'label', 'Governance compliance — policy conflicts and violations')
  );
$$;

create or replace function public._qge_governance_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'approvals', 'label', 'Human oversight for sensitive AI actions'),
    jsonb_build_object('key', 'escalation', 'label', 'Clear escalation when confidence or risk is high'),
    jsonb_build_object('key', 'risk_tolerance', 'label', 'AI autonomy level aligned with organization policy'),
    jsonb_build_object('key', 'audit', 'label', 'Immutable accountability for quality and governance events'),
    jsonb_build_object('key', 'access_reviews', 'label', 'Policy review cadence and scheduled reviews'),
    jsonb_build_object('key', 'quality_standards', 'label', 'Organization-wide quality and governance standards')
  );
$$;

create or replace function public._qge_qg_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'recurring_failures', 'label', 'Detect recurring support and operational failures'),
    jsonb_build_object('key', 'policy_conflicts', 'label', 'Surface policy conflicts via governance summary'),
    jsonb_build_object('key', 'kc_reviews', 'label', 'Recommend Knowledge Center reviews for stale content'),
    jsonb_build_object('key', 'bottlenecks', 'label', 'Identify approval and workflow bottlenecks'),
    jsonb_build_object('key', 'approval_inconsistencies', 'label', 'Flag approval inconsistencies and AI rejection spikes'),
    jsonb_build_object('key', 'support_trends', 'label', 'Monitor support quality trends and escalation patterns')
  );
$$;

create or replace function public._qge_companion_quality_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'respectful', 'emoji', '🤝', 'label', 'Respectful — professional, never condescending'),
    jsonb_build_object('key', 'trustworthy', 'emoji', '🔒', 'label', 'Trustworthy — transparent about limits and evidence'),
    jsonb_build_object('key', 'human_centered', 'emoji', '💙', 'label', 'Human-centered — augment people, never replace judgment'),
    jsonb_build_object('key', 'inclusive', 'emoji', '🌍', 'label', 'Inclusive — accessible, considerate language'),
    jsonb_build_object('key', 'thoughtful', 'emoji', '🦉', 'label', 'Thoughtful — context-aware, not reactive'),
    jsonb_build_object('key', 'appropriate_tone', 'emoji', '✨', 'label', 'Appropriate tone — calm, professional communication')
  );
$$;

create or replace function public._qge_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable quality — reduce strain, simplify complexity, balanced workloads — without guilt or pressure.',
    'patterns', jsonb_build_array(
      'Reduce operational strain through early bottleneck detection',
      'Simplify complex workflows flagged by quality scans',
      'Balance workloads via approval backlog visibility',
      'Celebrate resolved quality improvements — metadata only'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._qge_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Quality concerns must be transparent — why raised, evidence shown, humans responsible, change history audited.',
    'qualities', jsonb_build_array(
      'Why — clear reason a check or recommendation appeared',
      'Evidence — metadata signals, not raw customer content',
      'Responsibility — humans resolve, accept, or reject findings',
      'Change history — audit via _qge_log and _gpe_log'
    ),
    'metadata_only', true,
    'audit_note', 'Quality and governance lifecycle logged — metadata only, no raw email, chat, or operational records.'
  );
$$;

create or replace function public._qge_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates quality and governance internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion tone, KC maintenance, support quality, approvals',
      'focus', jsonb_build_array(
        'Companion quality consistency across surfaces',
        'Knowledge Center review recommendations',
        'Support quality trends and escalation patterns',
        'Approval consistency and governance compliance'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — operational quality and governance',
      'focus', jsonb_build_array(
        'Operational quality pattern detection',
        'Governance policy compliance',
        'Support trend monitoring',
        'Workflow bottleneck identification'
      )
    )
  );
$$;

create or replace function public._qge_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🔒',
      'phrase', 'Capability requires governance — trust scales with intelligence.'
    ),
    jsonb_build_object(
      'emoji', '✨',
      'phrase', 'Quality is never accidental — measure, explain, improve.'
    ),
    jsonb_build_object(
      'emoji', '💙',
      'phrase', 'Companion quality is respectful, trustworthy, and human-centered.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'phrase', 'Every quality concern includes evidence — humans decide what changes.'
    )
  );
$$;

create or replace function public._qge_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'governance_policy_engine', 'label', 'Governance & Policy (A.14)', 'route', '/app/governance-policy-engine'),
    jsonb_build_object('key', 'approvals', 'label', 'Approvals', 'route', '/app/approvals'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight (A.40)', 'route', '/app/human-oversight-engine'),
    jsonb_build_object('key', 'audit_accountability', 'label', 'Audit & Accountability', 'route', '/app/audit-accountability'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine'),
    jsonb_build_object('key', 'self_love_engine', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('key', 'support_ai_engine', 'label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
    jsonb_build_object('key', 'knowledge_center_engine', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine')
  );
$$;

-- ---------------------------------------------------------------------------
-- Extend card with blueprint cross-ref
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_guardian_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_checks', (
      select count(*) from public.organization_quality_checks
      where organization_id = v_org_id and status in ('open', 'investigating')
    ),
    'critical_checks', (
      select count(*) from public.organization_quality_checks
      where organization_id = v_org_id and severity = 'critical' and status in ('open', 'investigating')
    ),
    'pending_recommendations', (
      select count(*) from public.quality_recommendations
      where organization_id = v_org_id and status = 'pending'
    ),
    'philosophy', 'Capability requires governance. Trust scales with intelligence. Quality is never accidental.',
    'mission', 'Accountability, transparency, and continuous quality improvement across operations and governance.',
    'abos_principle', 'Organizations that measure quality and govern responsibly scale trust with intelligence.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 16 — Governance & Quality Guardian Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE16_GOVERNANCE_QUALITY_GUARDIAN_FOUNDATION.md',
      'engine_phase', 'A.13 Quality Guardian Engine',
      'integrated_engine', 'A.14 Governance & Policy Engine',
      'route', '/app/quality-guardian-engine'
    ),
    'quality_guardian_engine_note', 'Governance & Quality Guardian Foundation (ABOS Phase 16) — extends Quality Guardian A.13 with A.14 governance summary.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Extend dashboard — preserve ALL existing fields
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_guardian_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.quality_guardian_settings;
  v_scan jsonb;
begin
  perform public._irp_require_permission('quality.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._qge_ensure_settings(v_org_id);

  if v_settings.auto_scan_on_dashboard then
    v_scan := public._qge_run_quality_scan(v_org_id);
  else
    v_scan := jsonb_build_object('skipped', true);
  end if;

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 16 — Governance & Quality Guardian Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE16_GOVERNANCE_QUALITY_GUARDIAN_FOUNDATION.md',
      'engine_phase', 'A.13 Quality Guardian Engine',
      'integrated_engine', 'A.14 Governance & Policy Engine',
      'route', '/app/quality-guardian-engine',
      'mapping_note', 'ABOS Blueprint Phase 16 maps to Quality Guardian A.13 — governance config at /app/governance-policy-engine. Distinct from software QG at /app/quality.'
    ),
    'mission', 'Accountability, transparency, and continuous quality improvement across operations, knowledge, support, workflows, companion consistency, and governance compliance.',
    'philosophy', 'Capability requires governance. Trust scales with intelligence. Quality is never accidental.',
    'abos_principle', 'Organizations that measure quality and govern responsibly scale trust with intelligence — not by accident.',
    'vision', 'Quality and governance together — accountability that scales with intelligence, transparency that builds trust.',
    'quality_guardian_engine_note', 'Governance & Quality Guardian Foundation (ABOS Phase 16) — extends Quality Guardian A.13 with A.14 governance summary.',
    'distinction_note', 'Distinct from Phases 58–59 software QG at /app/quality, Human Oversight A.40, and Trust & Action /app/approvals — cross-link only.',
    'quality_objectives', public._qge_quality_objectives(),
    'governance_objectives', public._qge_governance_objectives(),
    'qg_capabilities', public._qge_qg_capabilities(),
    'companion_quality_principles', public._qge_companion_quality_principles(),
    'self_love_connection', public._qge_self_love_connection(),
    'self_love_note', 'Self Love (A.76) reduces strain and simplifies complexity flagged by quality scans — principle only; Quality Guardian stores metadata, not wellbeing content.',
    'trust_connection', public._qge_trust_connection(),
    'governance_summary', public._qge_governance_summary(v_org_id),
    'dogfooding', public._qge_blueprint_dogfooding(),
    'success_criteria', public._qge_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._qge_vision_phrases(),
    'integration_links', public._qge_integration_links(),
    'safety_note', 'Quality Guardian aggregates metadata from support, knowledge, AI, integrations, and onboarding. No raw customer content is stored in quality tables.',
    'principles', jsonb_build_array(
      'Tenant-aware monitoring',
      'Proactive issue detection',
      'Explainable recommendations',
      'Continuous improvement',
      'Audit-supported accountability'
    ),
    'settings', jsonb_build_object(
      'auto_scan_on_dashboard', v_settings.auto_scan_on_dashboard,
      'max_open_support_cases', v_settings.max_open_support_cases,
      'approval_backlog_threshold', v_settings.approval_backlog_threshold
    ),
    'last_scan', v_scan,
    'trends', public._qge_compute_trends(v_org_id),
    'high_risk_areas', public._qge_high_risk_areas(v_org_id),
    'active_checks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'check_key', c.check_key, 'category', c.category, 'alert_type', c.alert_type,
        'severity', c.severity, 'title', c.title, 'description', c.description, 'status', c.status,
        'signal_count', c.signal_count, 'detected_at', c.detected_at, 'metadata', c.metadata
      ) order by case c.severity when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, c.detected_at desc)
      from public.organization_quality_checks c
      where c.organization_id = v_org_id and c.status in ('open', 'investigating') limit 20
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'quality_check_id', r.quality_check_id, 'issue_summary', r.issue_summary,
        'business_impact', r.business_impact, 'suggested_resolution', r.suggested_resolution,
        'urgency', r.urgency, 'confidence', r.confidence, 'status', r.status, 'created_at', r.created_at
      ) order by case r.urgency when 'critical' then 0 when 'high' then 1 when 'moderate' then 2 else 3 end, r.created_at desc)
      from public.quality_recommendations r
      where r.organization_id = v_org_id and r.status = 'pending' limit 15
    ), '[]'::jsonb),
    'recently_resolved', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'category', c.category, 'severity', c.severity,
        'resolved_at', c.resolved_at
      ) order by c.resolved_at desc)
      from public.organization_quality_checks c
      where c.organization_id = v_org_id and c.status = 'resolved'
        and c.resolved_at > now() - interval '30 days' limit 10
    ), '[]'::jsonb)
  );
end; $$;

-- Minimal cross-ref on governance card
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
    'quality_guardian_blueprint_note', 'ABOS Phase 16 — governance summary also visible on Quality Guardian dashboard at /app/quality-guardian-engine.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._qge_governance_summary(uuid) to authenticated;
grant execute on function public._qge_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'governance-quality-blueprint', 'Governance & Quality Guardian (ABOS Phase 16)',
  'Governance & Quality Guardian Foundation — extends Quality Guardian A.13 with A.14 governance summary and live success criteria.',
  'authenticated', 72
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'governance-quality-blueprint' and tenant_id is null
);
