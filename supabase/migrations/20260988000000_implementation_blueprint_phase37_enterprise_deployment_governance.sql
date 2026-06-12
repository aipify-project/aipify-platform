-- Implementation Blueprint Phase 37 — Enterprise Deployment & Governance Engine
-- Extends Enterprise Readiness Engine (Phase A.30). No new tables — metadata scaffold only.
-- Naming note: distinct from Enterprise Deployment Phase 66, Framework Phase 92, Governance A.14, Device Rollout A.39.

create or replace function public._edgbp_mission()
returns text language sql immutable as $$
  select 'Enterprise requires trust → visibility → governance — approachable while meeting enterprise expectations for deployment flexibility, IAM, and executive oversight.';
$$;

create or replace function public._edgbp_philosophy()
returns text language sql immutable as $$
  select 'Enterprise adoption succeeds when organizations see clear responsibilities, honest scaffolds, and accountable governance — not complexity disguised as control.';
$$;

create or replace function public._edgbp_abos_principle()
returns text language sql immutable as $$
  select 'One Aipify Business Operating System — deployable where the enterprise needs it, governed how leadership requires it, transparent to every stakeholder.';
$$;

create or replace function public._edgbp_enterprise_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'multi_org_structures', 'label', 'Multi-org structures', 'description', 'Parent org, regional orgs, departments, teams — hierarchy metadata scaffold'),
    jsonb_build_object('key', 'advanced_governance', 'label', 'Advanced governance', 'description', 'Approval workflows, retention policies, permission reviews — cross-link Governance & Policy A.14'),
    jsonb_build_object('key', 'regional_admin', 'label', 'Regional administrators', 'description', 'Delegated admin scopes for region, division, department — extends A.30 delegated admins'),
    jsonb_build_object('key', 'enterprise_iam', 'label', 'Enterprise IAM', 'description', 'SSO, SAML, directory sync, advanced roles — honest future-ready scaffolds'),
    jsonb_build_object('key', 'deployment_flexibility', 'label', 'Deployment flexibility', 'description', 'Cloud, hybrid, on-premise models — shared vs customer responsibility documented'),
    jsonb_build_object('key', 'executive_oversight', 'label', 'Executive oversight', 'description', 'Cross-org trends, milestones, recognition — cross-link Executive Insights A.35')
  );
$$;

create or replace function public._edgbp_deployment_models()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Deployment model selection defines responsibility boundaries — Aipify manages intelligence layer; customers retain data ownership.',
    'models', jsonb_build_array(
      jsonb_build_object(
        'key', 'cloud',
        'label', 'Cloud',
        'status', 'scaffold',
        'description', 'Fully managed Aipify — automatic updates, simplified administration, Aipify-operated infrastructure',
        'responsibilities', jsonb_build_object('aipify', jsonb_build_array('Platform updates', 'Managed infrastructure', 'Security patches'), 'customer', jsonb_build_array('User access', 'Business configuration', 'Approval policies'))
      ),
      jsonb_build_object(
        'key', 'hybrid',
        'label', 'Hybrid',
        'status', 'scaffold',
        'description', 'Shared responsibility — controlled integrations, regional data residency requirements, split hosting',
        'responsibilities', jsonb_build_object('aipify', jsonb_build_array('Core intelligence layer', 'Update coordination'), 'customer', jsonb_build_array('Regional hosting boundaries', 'Integration endpoints', 'Network controls'))
      ),
      jsonb_build_object(
        'key', 'on_premise',
        'label', 'On-premise',
        'status', 'scaffold',
        'description', 'Customer-managed hosting — enhanced control, internal hosting, customer-operated infrastructure boundaries',
        'responsibilities', jsonb_build_object('aipify', jsonb_build_array('Software delivery', 'Compatibility guidance'), 'customer', jsonb_build_array('Infrastructure', 'Patch scheduling', 'Internal security perimeter'))
      )
    ),
    'framework_route', '/app/enterprise/framework',
    'deployment_route', '/app/enterprise',
    'device_rollout_route', '/app/enterprise-deployment-device-rollout-engine',
    'safety_note', 'Scaffold metadata only — actual deployment configuration lives in Enterprise Deployment Phase 66/92 and Device Rollout A.39.'
  );
$$;

create or replace function public._edgbp_identity_access_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise IAM integrates with customer identity systems — SSO and directory sync are future-ready scaffolds, not fake-connected toggles.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'sso', 'label', 'Single Sign-On (SSO)', 'status', 'scaffold', 'note', 'SAML/OIDC enterprise identity provider integration — configure in Device Rollout A.39 when available'),
      jsonb_build_object('key', 'saml', 'label', 'SAML federation', 'status', 'scaffold', 'note', 'Enterprise IdP metadata exchange — honest future-ready scaffold'),
      jsonb_build_object('key', 'directory_sync', 'label', 'Directory sync (SCIM)', 'status', 'scaffold', 'note', 'User and group provisioning from corporate directory — cross-link A.39 enrollment'),
      jsonb_build_object('key', 'advanced_roles', 'label', 'Advanced roles', 'status', 'active', 'note', 'Delegated admin scopes team · department · division · region via A.30'),
      jsonb_build_object('key', 'regional_administrators', 'label', 'Regional administrators', 'status', 'scaffold', 'note', 'Region-scoped delegated admins — extends enterprise_delegated_admins scope=region')
    ),
    'identity_route', '/app/identity-access',
    'device_rollout_route', '/app/enterprise-deployment-device-rollout-engine',
    'organization_workspace_route', '/app/organization-workspace-engine',
    'boundary', 'IAM scaffolds document intent — never expose fake connected state for SSO/SAML until integration completes.'
  );
$$;

create or replace function public._edgbp_multi_entity_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise customers operate across entities — parent org coordinates; regional orgs and departments retain scoped autonomy.',
    'hierarchy', jsonb_build_array(
      jsonb_build_object('level', 1, 'key', 'parent_org', 'label', 'Parent organization', 'description', 'Enterprise-wide governance, executive reporting, global policies'),
      jsonb_build_object('level', 2, 'key', 'regional_org', 'label', 'Regional organizations', 'description', 'Regional administrators, localized compliance, market-specific deployment'),
      jsonb_build_object('level', 3, 'key', 'department', 'label', 'Departments', 'description', 'Department approval chains, scoped delegated admins, operational boundaries'),
      jsonb_build_object('level', 4, 'key', 'team', 'label', 'Teams', 'description', 'Team-level permissions, onboarding milestones, training readiness'),
      jsonb_build_object('level', 5, 'key', 'user', 'label', 'Users', 'description', 'Individual access, identity profile, human oversight accountability')
    ),
    'organization_workspace_route', '/app/organization-workspace-engine',
    'cross_link_note', 'Multi-entity hierarchy metadata — Organization & Workspace Engine A.75 owns workspace switching; do not duplicate org tables here.'
  );
$$;

create or replace function public._edgbp_governance_controls()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Governance controls make enterprise accountability visible — approval workflows, retention, audit reporting, compliance visibility, permission reviews.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'approval_workflows', 'label', 'Approval workflows', 'description', 'Multi-step approval chains with emergency override audit — A.30 enterprise_approval_chains'),
      jsonb_build_object('key', 'retention_policies', 'label', 'Retention policies', 'description', 'Audit retention days and metadata lifecycle — governance_posture setting scaffold'),
      jsonb_build_object('key', 'audit_reporting', 'label', 'Audit reporting', 'description', 'Executive, operational, governance, audit preparation reports — metadata only'),
      jsonb_build_object('key', 'compliance_visibility', 'label', 'Compliance visibility', 'description', 'Cross-link Compliance & Regulatory Readiness A.29 — readiness scaffolds, not legal counsel'),
      jsonb_build_object('key', 'permission_reviews', 'label', 'Permission reviews', 'description', 'Periodic delegated admin and role permission review — Human Oversight A.40 accountability')
    ),
    'governance_policy_route', '/app/governance-policy-engine',
    'compliance_route', '/app/compliance-regulatory-readiness-engine',
    'human_oversight_route', '/app/human-oversight-engine',
    'cross_link_note', 'Governance & Policy Engine A.14 owns policy catalog — Enterprise Readiness extends with enterprise-specific chains and readiness scores.'
  );
$$;

create or replace function public._edgbp_executive_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive capabilities provide cross-org visibility without exposing PII — insights, trends, milestones, and recognition at enterprise scale.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'executive_insights', 'label', 'Executive insights', 'description', 'Organization health, risks, opportunities — Executive Insights A.35'),
      jsonb_build_object('emoji', '📈', 'key', 'cross_org_trends', 'label', 'Cross-org trends', 'description', 'Readiness dimension trends and deployment posture across entities — metadata aggregates'),
      jsonb_build_object('emoji', '🔔', 'key', 'milestones', 'label', 'Enterprise milestones', 'description', 'Onboarding milestones, deployment readiness, governance score milestones'),
      jsonb_build_object('emoji', '🌹', 'key', 'recognition', 'label', 'Recognition', 'description', 'Celebrate enterprise adoption wins — human-centered leadership at scale')
    ),
    'executive_insights_route', '/app/executive-insights-engine',
    'boundary', 'Executive payloads are metadata and summary scores only — no individual employee PII or operational records.'
  );
$$;

create or replace function public._edgbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sustainable enterprise decision-making requires healthy communication and human-centered leadership — Self Love A.76 supports reflection, not pressure.',
    'connections', jsonb_build_array(
      'Sustainable decision-making during complex enterprise rollouts',
      'Healthy communication across regional teams and executive stakeholders',
      'Human-centered leadership at scale — celebrate progress, normalize setbacks',
      'Reduce governance fatigue — approachable controls, not bureaucratic overwhelm'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary', 'Principle and cross-link only — Self Love Engine owns reflection workflows; Enterprise Readiness stores no personal wellbeing content.'
  );
$$;

create or replace function public._edgbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise trust requires transparent deployment responsibilities, security boundaries, governance capabilities, and compliance expectations.',
    'users_should_understand', jsonb_build_array(
      'Which deployment responsibilities belong to Aipify vs the customer for each model',
      'Security boundaries — SSO/SAML scaffolds are future-ready until integration completes',
      'How governance scores and readiness dimensions are calculated — metadata only',
      'Compliance readiness scaffolds are not legal or regulatory advice',
      'Level 4 critical actions remain prohibited for AI — human approval required'
    ),
    'operators_should_understand', jsonb_build_array(
      'Delegated admin assignments and approval overrides are fully audited',
      'Enterprise exports contain metadata and summary scores — no PII',
      'Deployment model flags (dedicated_ready, hybrid_ready, on_prem_ready) reflect readiness, not live connection',
      'Cross-links to Phase 66, Phase 92, and A.39 for actual deployment configuration'
    ),
    'security_route', '/app/settings/security',
    'license_route', '/app/license',
    'metadata_only', true
  );
$$;

create or replace function public._edgbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates enterprise governance internally; Unonight exercises enterprise readiness as first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — delegated admin scopes, approval chains, deployment readiness hooks, executive reporting metadata',
      'focus', jsonb_build_array('Multi-step approval chain audit', 'Enterprise onboarding milestone tracking', 'Deployment model scaffold accuracy', 'Governance score transparency')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — enterprise governance and deployment readiness in production tenant',
      'focus', jsonb_build_array('Delegated administration workflows', 'Enterprise security posture review', 'Integration landscape readiness', 'Executive readiness reporting')
    )
  );
$$;

create or replace function public._edgbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Enterprise trust grows when deployment responsibilities are clear and governance is approachable — not hidden behind complexity.',
    'Visibility before control — executives see readiness; operators configure accountability.',
    'One Aipify — deployable in the cloud, hybrid, or on-premise without sacrificing transparency.',
    'Human-centered enterprise leadership celebrates milestones and sustains teams through complex rollouts.',
    'Governance that protects without overwhelming — metadata only, humans decide.'
  );
$$;

create or replace function public._edgbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy Engine A.14', 'route', '/app/governance-policy-engine', 'note', 'Policy catalog, approval templates — enterprise chains extend here'),
    jsonb_build_object('key', 'enterprise_deployment', 'label', 'Enterprise Deployment Phase 66', 'route', '/app/enterprise', 'note', 'Customer enterprise deployment workspace — not duplicate of A.30 readiness'),
    jsonb_build_object('key', 'enterprise_framework', 'label', 'Enterprise Deployment Framework Phase 92', 'route', '/app/enterprise/framework', 'note', 'Framework assessments and deployment planning'),
    jsonb_build_object('key', 'device_rollout', 'label', 'Device Rollout Engine A.39', 'route', '/app/enterprise-deployment-device-rollout-engine', 'note', 'SSO/SCIM readiness, device enrollment, silent install'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights A.35', 'route', '/app/executive-insights-engine', 'note', 'Cross-org executive reporting and health metadata'),
    jsonb_build_object('key', 'compliance', 'label', 'Compliance & Regulatory Readiness A.29', 'route', '/app/compliance-regulatory-readiness-engine', 'note', 'Regulatory readiness scaffolds — not legal counsel'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'note', 'AI accountability, override tracking, high-risk monitoring'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable decision-making and human-centered leadership'),
    jsonb_build_object('key', 'organization_workspace', 'label', 'Organization & Workspace A.75', 'route', '/app/organization-workspace-engine', 'note', 'Multi-entity workspace switching and role scaffolds'),
    jsonb_build_object('key', 'deployment_env', 'label', 'Deployment & Environment A.20', 'route', '/app/deployment-environment-management-engine', 'note', 'Environment management and rollout coordination')
  );
$$;

create or replace function public._edgbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 37 extends Enterprise Readiness Engine A.30 at /app/enterprise-readiness-engine — distinct from Enterprise Deployment Phase 66 (/app/enterprise), Framework Phase 92 (/app/enterprise/framework), Governance & Policy A.14 (/app/governance-policy-engine), and Device Rollout A.39 (/app/enterprise-deployment-device-rollout-engine). Readiness scores and governance metadata live here; actual deployment configuration and SSO enrollment live in cross-linked engines.';
$$;

create or replace function public._edgbp_enterprise_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score int := 0;
  v_delegated int := 0;
  v_chains int := 0;
  v_milestones_pending int := 0;
  v_governance_score int := 0;
  v_sso_enabled boolean := false;
begin
  v_score := public._ere_overall_score(p_organization_id);
  select count(*) into v_delegated from public.enterprise_delegated_admins where organization_id = p_organization_id;
  select count(*) into v_chains from public.enterprise_approval_chains where organization_id = p_organization_id and status = 'active';
  select count(*) into v_milestones_pending from public.enterprise_onboarding_milestones
  where organization_id = p_organization_id and status in ('pending', 'in_progress', 'blocked');
  select coalesce(score, 0) into v_governance_score from public.enterprise_readiness_assessments
  where organization_id = p_organization_id and assessment_dimension = 'governance';
  select coalesce((setting_value->>'sso_enabled')::boolean, false) into v_sso_enabled
  from public.organization_enterprise_settings
  where organization_id = p_organization_id and setting_key = 'security_posture';

  return jsonb_build_object(
    'overall_readiness_score', v_score,
    'health_status', public._ere_health_status(v_score),
    'delegated_admin_count', v_delegated,
    'active_approval_chains', v_chains,
    'pending_milestones', v_milestones_pending,
    'governance_score', v_governance_score,
    'sso_scaffold_documented', true,
    'sso_connected', v_sso_enabled,
    'privacy_note', 'Counts and scores from tenant-scoped enterprise tables only — no PII in summary.'
  );
end; $$;

create or replace function public._edgbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_score int := 0;
  v_delegated int := 0;
  v_chains int := 0;
  v_governance_score int := 0;
begin
  v_summary := public._edgbp_enterprise_summary(p_organization_id);
  v_score := coalesce((v_summary->>'overall_readiness_score')::int, 0);
  v_delegated := coalesce((v_summary->>'delegated_admin_count')::int, 0);
  v_chains := coalesce((v_summary->>'active_approval_chains')::int, 0);
  v_governance_score := coalesce((v_summary->>'governance_score')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'enterprise_objectives',
      'label', 'Enterprise objectives documented — multi-org, IAM, governance, deployment, executive oversight',
      'met', jsonb_array_length(public._edgbp_enterprise_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'deployment_models',
      'label', 'Deployment models scaffold documented — cloud, hybrid, on-premise',
      'met', jsonb_array_length((public._edgbp_deployment_models()->'models')) >= 3,
      'note', 'Configure actual deployment in Phase 66/92 and A.39.'
    ),
    jsonb_build_object(
      'key', 'iam_scaffold',
      'label', 'Enterprise IAM scaffold documented — SSO, SAML, directory sync, advanced roles',
      'met', jsonb_array_length((public._edgbp_identity_access_management()->'capabilities')) >= 5,
      'note', 'SSO/SAML are future-ready scaffolds until A.39 integration completes.'
    ),
    jsonb_build_object(
      'key', 'multi_entity_hierarchy',
      'label', 'Multi-entity support hierarchy documented — parent → regional → department → team → user',
      'met', jsonb_array_length((public._edgbp_multi_entity_support()->'hierarchy')) >= 5,
      'note', 'Workspace switching via Organization & Workspace A.75.'
    ),
    jsonb_build_object(
      'key', 'governance_controls',
      'label', 'Governance controls cross-linked to A.14, A.29, A.40',
      'met', jsonb_array_length((public._edgbp_governance_controls()->'controls')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'executive_capabilities',
      'label', 'Executive capabilities documented — insights, trends, milestones, recognition',
      'met', jsonb_array_length((public._edgbp_executive_capabilities()->'capabilities')) >= 4,
      'note', 'Cross-org metadata via Executive Insights A.35.'
    ),
    jsonb_build_object(
      'key', 'readiness_score',
      'label', 'Overall enterprise readiness score meets healthy threshold',
      'met', v_score >= 55,
      'note', case when v_score < 55 then 'Advance readiness assessments across governance, security, and deployment dimensions.' else format('Current score %s.', v_score) end
    ),
    jsonb_build_object(
      'key', 'approval_chains',
      'label', 'At least one active approval chain configured',
      'met', v_chains >= 1,
      'note', case when v_chains = 0 then 'Seed or activate enterprise approval chains.' else null end
    ),
    jsonb_build_object(
      'key', 'governance_score',
      'label', 'Governance readiness dimension assessed',
      'met', v_governance_score > 0,
      'note', format('Governance score %s.', v_governance_score)
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection for sustainable enterprise leadership documented',
      'met', jsonb_array_length((public._edgbp_self_love_connection()->'connections')) >= 4,
      'note', 'Principle only — route /app/self-love-engine.'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection explains deployment responsibilities and security boundaries',
      'met', jsonb_array_length((public._edgbp_trust_connection()->'users_should_understand')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to A.14, Phase 66, Phase 92, A.39, A.35, A.29, A.40, A.76, A.75',
      'met', jsonb_array_length(public._edgbp_integration_links()) >= 9,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from Phase 66, Phase 92, A.14, A.39 documented',
      'met', length(public._edgbp_distinction_note()) > 50,
      'note', 'Blueprint Phase 37 extends A.30 — not a duplicate route.'
    )
  );
end; $$;

-- Extend dashboard — preserve ALL A.30 fields; append Phase 37 blueprint
create or replace function public.get_enterprise_readiness_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_score int;
  v_integration jsonb;
  v_security jsonb;
  v_base jsonb;
begin
  perform public._irp_require_permission('enterprise.view');
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);
  v_score := public._ere_overall_score(v_org_id);

  select setting_value into v_integration
  from public.organization_enterprise_settings
  where organization_id = v_org_id and setting_key = 'integration_landscape';

  select setting_value into v_security
  from public.organization_enterprise_settings
  where organization_id = v_org_id and setting_key = 'security_posture';

  v_base := jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Enterprise readiness through scalable governance, delegated administration, and accountable deployment — metadata only.',
    'principles', jsonb_build_array(
      'Advanced role structures and delegated administration',
      'Multi-step approval chains with emergency override audit',
      'Dedicated enterprise onboarding milestones',
      'Integration with Governance (A.14) and Deployment (A.20)',
      'Level 4 critical actions prohibited for AI'
    ),
    'summary', jsonb_build_object(
      'overall_readiness_score', v_score,
      'health_status', public._ere_health_status(v_score),
      'delegated_admin_count', coalesce((select count(*) from public.enterprise_delegated_admins where organization_id = v_org_id), 0),
      'active_approval_chains', coalesce((select count(*) from public.enterprise_approval_chains where organization_id = v_org_id and status = 'active'), 0),
      'pending_milestones', coalesce((select count(*) from public.enterprise_onboarding_milestones where organization_id = v_org_id and status in ('pending', 'in_progress', 'blocked')), 0),
      'integration_connected_count', coalesce((v_integration->>'connected_count')::int, 0)
    ),
    'health_overview', jsonb_build_object(
      'overall_score', v_score,
      'status', public._ere_health_status(v_score),
      'dimensions', coalesce((
        select jsonb_agg(row_to_json(a) order by a.assessment_dimension)
        from public.enterprise_readiness_assessments a
        where a.organization_id = v_org_id
          and a.assessment_dimension in ('governance', 'security', 'integrations', 'operations', 'deployment')
      ), '[]'::jsonb)
    ),
    'approval_bottlenecks', public._ere_approval_bottlenecks(v_org_id),
    'security_posture', coalesce(v_security, '{}'::jsonb),
    'integration_landscape', coalesce(v_integration, '{}'::jsonb),
    'operational_risks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'milestone_key', m.milestone_key,
        'milestone_title', m.milestone_title,
        'category', m.category,
        'status', m.status,
        'training_readiness_score', m.training_readiness_score
      ) order by m.category)
      from public.enterprise_onboarding_milestones m
      where m.organization_id = v_org_id and m.status in ('pending', 'blocked', 'in_progress')
    ), '[]'::jsonb),
    'delegated_admins', coalesce((
      select jsonb_agg(row_to_json(d) order by d.created_at desc)
      from public.enterprise_delegated_admins d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'approval_chains', coalesce((
      select jsonb_agg(row_to_json(c) order by c.chain_key)
      from public.enterprise_approval_chains c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'onboarding_milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.category, m.milestone_key)
      from public.enterprise_onboarding_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'enterprise_settings', coalesce((
      select jsonb_object_agg(s.setting_key, s.setting_value)
      from public.organization_enterprise_settings s where s.organization_id = v_org_id
    ), '{}'::jsonb),
    'deployment_readiness', public._ere_deployment_hooks(v_org_id),
    'reports_available', jsonb_build_array('executive', 'operational', 'governance', 'audit_preparation')
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase37', jsonb_build_object(
      'phase', 37,
      'title', 'Enterprise Deployment & Governance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE37_ENTERPRISE_DEPLOYMENT_GOVERNANCE.md',
      'engine_phase', 'Phase A.30 — Enterprise Readiness Engine',
      'route', '/app/enterprise-readiness-engine',
      'mapping_note', 'ABOS Blueprint Phase 37 extends A.30 — distinct from Phase 66, Phase 92, A.14, and A.39.'
    ),
    'enterprise_deployment_governance_mission', public._edgbp_mission(),
    'enterprise_deployment_governance_philosophy', public._edgbp_philosophy(),
    'enterprise_objectives', public._edgbp_enterprise_objectives(),
    'deployment_models', public._edgbp_deployment_models(),
    'identity_access_management', public._edgbp_identity_access_management(),
    'multi_entity_support', public._edgbp_multi_entity_support(),
    'governance_controls', public._edgbp_governance_controls(),
    'executive_capabilities', public._edgbp_executive_capabilities(),
    'enterprise_self_love_connection', public._edgbp_self_love_connection(),
    'enterprise_trust_connection', public._edgbp_trust_connection(),
    'enterprise_dogfooding', public._edgbp_dogfooding(),
    'enterprise_success_criteria', public._edgbp_blueprint_success_criteria(v_org_id),
    'enterprise_vision_phrases', public._edgbp_vision_phrases(),
    'enterprise_abos_principle', public._edgbp_abos_principle(),
    'enterprise_distinction_note', public._edgbp_distinction_note(),
    'enterprise_integration_links', public._edgbp_integration_links(),
    'enterprise_summary', public._edgbp_enterprise_summary(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_enterprise_readiness_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_score int; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);
  v_score := public._ere_overall_score(v_org_id);
  v_summary := public._edgbp_enterprise_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'overall_readiness_score', v_score,
    'health_status', public._ere_health_status(v_score),
    'philosophy', 'Enterprise readiness with accountable governance and flexible deployment.',
    'implementation_blueprint_phase37', jsonb_build_object(
      'phase', 37,
      'title', 'Enterprise Deployment & Governance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE37_ENTERPRISE_DEPLOYMENT_GOVERNANCE.md',
      'engine_phase', 'Phase A.30',
      'route', '/app/enterprise-readiness-engine'
    ),
    'enterprise_deployment_governance_phase', 37,
    'enterprise_abos_principle', public._edgbp_abos_principle(),
    'enterprise_summary', v_summary,
    'blueprint_note', 'Enterprise Deployment & Governance Engine (ABOS Phase 37) — extends A.30 with deployment models, IAM scaffolds, multi-entity hierarchy, governance controls, and live success criteria.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._edgbp_mission() to authenticated;
grant execute on function public._edgbp_philosophy() to authenticated;
grant execute on function public._edgbp_abos_principle() to authenticated;
grant execute on function public._edgbp_enterprise_objectives() to authenticated;
grant execute on function public._edgbp_deployment_models() to authenticated;
grant execute on function public._edgbp_identity_access_management() to authenticated;
grant execute on function public._edgbp_multi_entity_support() to authenticated;
grant execute on function public._edgbp_governance_controls() to authenticated;
grant execute on function public._edgbp_executive_capabilities() to authenticated;
grant execute on function public._edgbp_self_love_connection() to authenticated;
grant execute on function public._edgbp_trust_connection() to authenticated;
grant execute on function public._edgbp_dogfooding() to authenticated;
grant execute on function public._edgbp_vision_phrases() to authenticated;
grant execute on function public._edgbp_integration_links() to authenticated;
grant execute on function public._edgbp_distinction_note() to authenticated;
grant execute on function public._edgbp_enterprise_summary(uuid) to authenticated;
grant execute on function public._edgbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'enterprise-deployment-governance-blueprint', 'Enterprise Deployment & Governance Engine (ABOS Phase 37)',
  'Enterprise Deployment & Governance Engine — extends A.30 with deployment models, IAM scaffolds, multi-entity hierarchy, governance controls, and live success criteria.',
  'authenticated', 105
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'enterprise-deployment-governance-blueprint' and tenant_id is null
);
