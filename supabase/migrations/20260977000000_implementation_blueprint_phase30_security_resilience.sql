-- Implementation Blueprint Phase 30 — Security & Resilience Engine
-- Spec alignment extending Security & Trust Engine (Phase A.18). No new tables.

create or replace function public._srbp_blueprint_security_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'secure_authentication', 'label', 'Secure authentication', 'description', 'MFA readiness, session integrity, and auth audit visibility'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access controls', 'description', 'Least-privilege roles via Identity & Permissions (A.75)'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Audit logging', 'description', 'Immutable trust and security event trails'),
    jsonb_build_object('key', 'integration_boundaries', 'label', 'Integration permission boundaries', 'description', 'Read-only first; explicit approval before expansion'),
    jsonb_build_object('key', 'data_encryption', 'label', 'Data encryption', 'description', 'Metadata-first storage; classification-aware handling'),
    jsonb_build_object('key', 'secret_management', 'label', 'Secure secret management', 'description', 'Credential vault patterns via Integration Engine (A.8)'),
    jsonb_build_object('key', 'session_monitoring', 'label', 'Session monitoring', 'description', 'Active session visibility and revocation paths'),
    jsonb_build_object('key', 'incident_visibility', 'label', 'Incident visibility', 'description', 'Open security incidents and compliance check status')
  );
$$;

create or replace function public._srbp_blueprint_resilience_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'graceful_failure', 'label', 'Graceful failure handling', 'description', 'Degraded-mode guidance without silent data loss'),
    jsonb_build_object('key', 'degradation_strategies', 'label', 'Service degradation strategies', 'description', 'Priority preservation during partial outages'),
    jsonb_build_object('key', 'backup_procedures', 'label', 'Backup procedures', 'description', 'Continuity ownership at /app/continuity (Phase 80)'),
    jsonb_build_object('key', 'disaster_recovery', 'label', 'Disaster recovery planning', 'description', 'Scenario plans via Organizational Resilience (A.50)'),
    jsonb_build_object('key', 'operational_monitoring', 'label', 'Operational monitoring', 'description', 'Health signals via Observability (A.19)'),
    jsonb_build_object('key', 'health_reporting', 'label', 'Health reporting', 'description', 'Compliance scores and readiness summaries'),
    jsonb_build_object('key', 'recovery_documentation', 'label', 'Recovery documentation', 'description', 'Approved playbooks and structured reviews')
  );
$$;

create or replace function public._srbp_blueprint_access_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'least_privilege', 'label', 'Least privilege', 'description', 'Grant only the access required for each role and integration'),
    jsonb_build_object('key', 'explicit_approvals', 'label', 'Explicit approvals', 'description', 'Sensitive access changes require human approval'),
    jsonb_build_object('key', 'regular_reviews', 'label', 'Regular reviews', 'description', 'Periodic access reviews for integrations and elevated permissions'),
    jsonb_build_object('key', 'clear_ownership', 'label', 'Clear ownership', 'description', 'Named owners for policies, reviews, and recovery plans'),
    jsonb_build_object('key', 'immediate_revocation', 'label', 'Immediate revocation', 'description', 'Revoke access promptly when roles change or risk is detected')
  );
$$;

create or replace function public._srbp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('emoji', '🦉', 'key', 'integration_permission_review', 'example', 'An integration permission review may be appropriate.'),
    jsonb_build_object('emoji', '🌹', 'key', 'backup_verification', 'example', 'A backup verification completed successfully.'),
    jsonb_build_object('emoji', '🔔', 'key', 'security_milestone', 'example', 'Security review milestone completed.'),
    jsonb_build_object('emoji', '🛡️', 'key', 'operational_vulnerability', 'example', 'A potential operational vulnerability deserves attention.')
  );
$$;

create or replace function public._srbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security should create confidence, not fear — reduce uncertainty, promote preparedness, encourage healthy operational habits, support teams during incidents.',
    'practices', jsonb_build_array(
      'Reduce uncertainty with clear explanations of protections and monitoring',
      'Promote preparedness through reviews, checks, and documented recovery paths',
      'Encourage healthy operational habits — regular reviews without alarmism',
      'Support teams during incidents with calm, transparent guidance'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences security tone — Security & Trust Engine stores metadata and policy state, not wellbeing content.'
  );
$$;

create or replace function public._srbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should understand what protections exist, what information is monitored, what responsibilities remain theirs, and how incidents are managed.',
    'organizations_should_understand', jsonb_build_array(
      'What protections exist across authentication, access, and integrations',
      'What information is monitored — metadata and audit events, not raw content',
      'What responsibilities remain with the organization — ownership of data and final decisions',
      'How incidents are managed — visibility, escalation, and recovery documentation'
    ),
    'metadata_only', true,
    'transparency_note', 'Trust Architecture default: metadata only — higher access requires explicit approval.'
  );
$$;

create or replace function public._srbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates resilience practices internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('Authentication', 'Backup validation', 'Audit logging', 'Recovery exercises')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Integration permission reviews', 'Operational resilience', 'Commerce environment security boundaries')
    )
  );
$$;

create or replace function public._srbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trust_action', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'note', 'Sensitive action approvals — distinct from A.18 security transparency'),
    jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational Resilience (A.50)', 'route', '/app/organizational-resilience-engine', 'note', 'Scenario plans, simulations, vulnerability tracking'),
    jsonb_build_object('key', 'continuity', 'label', 'Continuity (Phase 80)', 'route', '/app/continuity', 'note', 'Backup ownership, incident mode, readiness score'),
    jsonb_build_object('key', 'security_compliance', 'label', 'Security Compliance (Phase 67)', 'route', '/app/security', 'note', 'Incidents, secrets, policies, data governance'),
    jsonb_build_object('key', 'trust_architecture', 'label', 'Trust Architecture dashboard', 'route', '/app/settings/security', 'note', 'Customer security transparency settings'),
    jsonb_build_object('key', 'observability', 'label', 'Observability (A.19)', 'route', '/app/observability-platform-health-engine', 'note', 'Platform health and maintenance windows'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Connector credentials and sync boundaries'),
    jsonb_build_object('key', 'identity_permissions', 'label', 'Identity & Permissions (A.75)', 'route', '/app/organization-workspace-engine', 'note', 'Role-based access and workspace governance')
  );
$$;

create or replace function public._srbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Confidence grows when preparation exists long before it becomes necessary.',
    'Reliability is earned long before it is tested.',
    'Security created confidence — not fear.',
    'We understood protections before we relied on them.',
    'Resilience was designed intentionally, not added as an afterthought.'
  );
$$;

create or replace function public._srbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_passed int := 0;
  v_total int := 0;
  v_pending_reviews int := 0;
  v_active_policies int := 0;
  v_resilience_plans int := 0;
  v_open_vulnerabilities int := 0;
  v_simulations int := 0;
  v_mfa_required boolean := false;
  v_access_review_required boolean := true;
  v_transparency boolean := true;
begin
  select count(*) filter (where passed), count(*) into v_passed, v_total
  from public.security_compliance_checks where organization_id = p_organization_id;

  select count(*) into v_pending_reviews
  from public.security_access_reviews
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_active_policies
  from public.security_trust_policies
  where organization_id = p_organization_id and status = 'active';

  select coalesce(s.mfa_required, false), coalesce(s.require_access_review, true), coalesce(s.trust_transparency_enabled, true)
  into v_mfa_required, v_access_review_required, v_transparency
  from public.organization_security_settings s
  where s.organization_id = p_organization_id;

  select count(*) into v_resilience_plans
  from public.resilience_plans
  where organization_id = p_organization_id and status in ('active', 'approved', 'under_review');

  select count(*) into v_open_vulnerabilities
  from public.resilience_vulnerabilities
  where organization_id = p_organization_id and status in ('open', 'investigating');

  select count(*) into v_simulations
  from public.resilience_simulations
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'compliance_passed', v_passed,
    'compliance_total', v_total,
    'compliance_score', round((v_passed::numeric / greatest(v_total, 1)) * 100, 1),
    'pending_access_reviews', v_pending_reviews,
    'active_policies', v_active_policies,
    'mfa_required', v_mfa_required,
    'require_access_review', v_access_review_required,
    'trust_transparency_enabled', v_transparency,
    'resilience_plans', v_resilience_plans,
    'open_vulnerabilities', v_open_vulnerabilities,
    'resilience_simulations', v_simulations,
    'privacy_note', 'Counts only — no audit log content, credentials, or PII.'
  );
end; $$;

create or replace function public._srbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_passed int := 0;
  v_total int := 0;
  v_pending int := 0;
  v_policies int := 0;
  v_plans int := 0;
  v_transparency boolean := true;
begin
  v_engagement := public._srbp_engagement_summary(p_organization_id);
  v_passed := coalesce((v_engagement->>'compliance_passed')::int, 0);
  v_total := coalesce((v_engagement->>'compliance_total')::int, 0);
  v_pending := coalesce((v_engagement->>'pending_access_reviews')::int, 0);
  v_policies := coalesce((v_engagement->>'active_policies')::int, 0);
  v_plans := coalesce((v_engagement->>'resilience_plans')::int, 0);
  v_transparency := coalesce((v_engagement->>'trust_transparency_enabled')::boolean, true);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'access_controls_reliable',
      'label', 'Access controls function reliably — compliance checks and review cadence active',
      'met', v_total > 0 and v_passed >= greatest(1, v_total / 2),
      'note', case when v_total = 0 then 'Seed security compliance checks for the organization.' else null end
    ),
    jsonb_build_object(
      'key', 'recovery_documented',
      'label', 'Recovery processes documented — resilience plans or continuity cross-link visible',
      'met', v_plans > 0 or jsonb_array_length(public._srbp_blueprint_integration_links()) >= 6,
      'note', case when v_plans = 0 then 'Create resilience plans at /app/organizational-resilience-engine or configure continuity at /app/continuity.' else null end
    ),
    jsonb_build_object(
      'key', 'audit_visibility',
      'label', 'Audit visibility improves — compliance score tracked and reviews manageable',
      'met', v_total > 0 and v_pending <= 5,
      'note', case when v_pending > 5 then 'Resolve pending access reviews to improve audit visibility.' else null end
    ),
    jsonb_build_object(
      'key', 'security_practices_mature',
      'label', 'Security practices mature continuously — active policies and checks seeded',
      'met', v_policies > 0 and v_total >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'operational_trust',
      'label', 'Organizations trust Aipify operationally — transparency settings enabled',
      'met', v_transparency and v_policies > 0,
      'note', 'Trust transparency and policy framework visible to administrators.'
    ),
    jsonb_build_object(
      'key', 'security_objectives',
      'label', 'Security objectives documented — authentication through incident visibility',
      'met', jsonb_array_length(public._srbp_blueprint_security_objectives()) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'resilience_objectives',
      'label', 'Resilience objectives documented — failure handling through recovery documentation',
      'met', jsonb_array_length(public._srbp_blueprint_resilience_objectives()) >= 7,
      'note', null
    ),
    jsonb_build_object(
      'key', 'access_principles',
      'label', 'Access principles documented — least privilege through immediate revocation',
      'met', jsonb_array_length(public._srbp_blueprint_access_principles()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — confidence, not fear',
      'met', true,
      'note', 'Self Love is a principle — security tone remains calm and transparent.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Trust & Action, Resilience A.50, Continuity, Security Compliance',
      'met', jsonb_array_length(public._srbp_blueprint_integration_links()) >= 7,
      'note', 'Extend related engines — do not duplicate approvals or crisis response logic.'
    )
  );
end; $$;

create or replace function public._srbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Trust & Action Engine at /app/approvals (sensitive action approvals — not Implementation Blueprint Phase 30), Organizational Resilience A.50 /app/organizational-resilience-engine (scenario planning), Continuity Phase 80 /app/continuity (backup ownership), Security Compliance Phase 67 /app/security (incidents and secrets), Trust Architecture /app/settings/security, and Observability A.19 /app/observability-platform-health-engine. Phase A.18 compliance checks, access reviews, and trust policies preserved.';
$$;

create or replace function public.get_security_trust_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_security_settings;
  v_passed int;
  v_total int;
  v_pending int;
begin
  perform public._irp_require_permission('security.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._ste_ensure_settings(v_org_id);
  perform public._ste_seed_compliance_checks(v_org_id);
  perform public._ste_seed_default_policies(v_org_id);

  select count(*) filter (where passed), count(*) into v_passed, v_total
  from public.security_compliance_checks where organization_id = v_org_id;

  select count(*) into v_pending
  from public.security_access_reviews where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'The customer owns the data. Aipify owns the intelligence layer — transparency builds trust.',
    'privacy_note', 'Metadata-first storage. Higher access levels require explicit approval.',
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'compliance_score', round((v_passed::numeric / greatest(v_total, 1)) * 100, 1),
      'active_policies', coalesce((select count(*) from public.security_trust_policies where organization_id = v_org_id and status = 'active'), 0),
      'pending_reviews', v_pending,
      'passed_checks', v_passed,
      'total_checks', v_total
    ),
    'policies', coalesce((
      select jsonb_agg(row_to_json(p) order by p.policy_key)
      from public.security_trust_policies p where p.organization_id = v_org_id and p.status != 'archived'
    ), '[]'::jsonb),
    'access_reviews', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from (select * from public.security_access_reviews where organization_id = v_org_id order by created_at desc limit 10) r
    ), '[]'::jsonb),
    'compliance_checks', coalesce((
      select jsonb_agg(row_to_json(c) order by c.category, c.check_key)
      from public.security_compliance_checks c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'principles', jsonb_build_array(
      'Default access level: metadata only',
      'New integrations: read-only first',
      'Sensitive operations require explicit approval',
      'Immutable audit trail for trust events',
      'Customer data ownership — store patterns, not records'
    ),
    'mission', 'Protect organizations, users, and operational continuity through proactive security practices and resilient system design.',
    'blueprint_philosophy', 'Security should be built into Aipify from the beginning. Resilience should not be an afterthought. Organizations should feel confident relying upon Aipify.',
    'abos_principle', 'Reliability is earned long before it is tested — organizations deserve systems prepared for difficult days.',
    'vision', 'People should feel reassured knowing that resilience has been designed intentionally.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 30,
      'title', 'Security & Resilience Engine',
      'engine_phase', 'A.18',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE30_SECURITY_RESILIENCE.md'
    ),
    'security_objectives', public._srbp_blueprint_security_objectives(),
    'resilience_objectives', public._srbp_blueprint_resilience_objectives(),
    'access_principles', public._srbp_blueprint_access_principles(),
    'companion_examples', public._srbp_blueprint_companion_examples(),
    'self_love_connection', public._srbp_blueprint_self_love_connection(),
    'trust_connection_blueprint', public._srbp_blueprint_trust_connection(),
    'dogfooding_blueprint', public._srbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._srbp_blueprint_integration_links(),
    'blueprint_vision_phrases', public._srbp_blueprint_vision_phrases(),
    'engagement_summary', public._srbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._srbp_blueprint_success_criteria(v_org_id),
    'distinction_note', public._srbp_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_security_trust_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_passed int; v_total int; v_pending int;
begin
  v_org_id := public._mta_require_organization();
  perform public._ste_ensure_settings(v_org_id);

  select count(*) filter (where passed), count(*) into v_passed, v_total
  from public.security_compliance_checks where organization_id = v_org_id;

  select count(*) into v_pending
  from public.security_access_reviews where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'compliance_score', round((v_passed::numeric / greatest(v_total, 1)) * 100, 1),
    'pending_reviews', v_pending,
    'philosophy', 'Transparency and trust through metadata-first security.',
    'mission', 'Protect organizations through proactive security and resilient design.',
    'abos_principle', 'Reliability is earned long before it is tested.',
    'blueprint_phase', 30,
    'engine_phase', 'A.18',
    'route', '/app/security-trust-engine'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._srbp_blueprint_security_objectives() to authenticated;
grant execute on function public._srbp_blueprint_resilience_objectives() to authenticated;
grant execute on function public._srbp_blueprint_access_principles() to authenticated;
grant execute on function public._srbp_blueprint_companion_examples() to authenticated;
grant execute on function public._srbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._srbp_blueprint_trust_connection() to authenticated;
grant execute on function public._srbp_blueprint_dogfooding() to authenticated;
grant execute on function public._srbp_blueprint_integration_links() to authenticated;
grant execute on function public._srbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._srbp_engagement_summary(uuid) to authenticated;
grant execute on function public._srbp_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public._srbp_distinction_note() to authenticated;
