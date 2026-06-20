-- Phase 620 P1 — APP portal menu module permission registry (organization_role_permissions).

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('activity_history.view', 'View Activity History', null, 'View organization activity history'),
  ('activity_history.manage', 'Manage Activity History', null, 'Manage activity history settings'),
  ('decisions.view', 'View Decision Center', null, 'View organizational decisions'),
  ('decisions.manage', 'Manage Decision Center', null, 'Create and update decisions'),
  ('follow_ups.view', 'View Follow-Ups', null, 'View organizational follow-ups'),
  ('follow_ups.manage', 'Manage Follow-Ups', null, 'Manage follow-up items'),
  ('goals.view', 'View Goals', null, 'View organizational goals'),
  ('goals.manage', 'Manage Goals', null, 'Manage organizational goals'),
  ('playbooks.view', 'View Playbooks', null, 'View organizational playbooks'),
  ('playbooks.manage', 'Manage Playbooks', null, 'Manage playbooks'),
  ('risks.view', 'View Risks', null, 'View risk register'),
  ('risks.manage', 'Manage Risks', null, 'Manage risks'),
  ('compliance.view', 'View Compliance', null, 'View compliance policies'),
  ('compliance.manage', 'Manage Compliance', null, 'Manage compliance policies'),
  ('meetings.view', 'View Meetings', null, 'View meetings and outcomes'),
  ('meetings.manage', 'Manage Meetings', null, 'Manage meetings'),
  ('continuity.view', 'View Continuity', null, 'View continuity plans'),
  ('continuity.manage', 'Manage Continuity', null, 'Manage continuity plans'),
  ('learning.view', 'View Learning', null, 'View learning and improvement'),
  ('learning.manage', 'Manage Learning', null, 'Manage learning records'),
  ('capacity.view', 'View Capacity', null, 'View capacity and workload'),
  ('capacity.manage', 'Manage Capacity', null, 'Manage capacity records'),
  ('success_value.view', 'View Success Value', null, 'View success value initiatives'),
  ('success_value.manage', 'Manage Success Value', null, 'Manage success initiatives'),
  ('strategy.view', 'View Strategy', null, 'View strategy execution'),
  ('strategy.manage', 'Manage Strategy', null, 'Manage strategy initiatives'),
  ('prioritization.view', 'View Prioritization', null, 'View prioritization engine'),
  ('prioritization.manage', 'Manage Prioritization', null, 'Manage prioritization'),
  ('commitments.view', 'View Commitments', null, 'View commitment tracking'),
  ('commitments.manage', 'Manage Commitments', null, 'Manage commitments'),
  ('briefings.view', 'View Briefings', null, 'View intelligence briefings'),
  ('briefings.manage', 'Manage Briefings', null, 'Manage briefings'),
  ('momentum.view', 'View Momentum', null, 'View organizational momentum'),
  ('momentum.manage', 'Manage Momentum', null, 'Manage momentum insights'),
  ('resilience.view', 'View Resilience', null, 'View resilience center'),
  ('resilience.manage', 'Manage Resilience', null, 'Manage resilience'),
  ('executive_companion.view', 'View Executive Companion', null, 'View executive companion'),
  ('executive_companion.manage', 'Manage Executive Companion', null, 'Manage executive companion'),
  ('benchmarking.view', 'View Benchmarking', null, 'View enterprise benchmarking'),
  ('benchmarking.manage', 'Manage Benchmarking', null, 'Manage benchmarking'),
  ('predictive_intelligence.view', 'View Predictive Intelligence', null, 'View predictive intelligence'),
  ('predictive_intelligence.manage', 'Manage Predictive Intelligence', null, 'Manage predictions'),
  ('scenario_planning.view', 'View Scenario Planning', null, 'View scenario planning'),
  ('scenario_planning.manage', 'Manage Scenario Planning', null, 'Manage scenarios'),
  ('executive_foresight.view', 'View Executive Foresight', null, 'View executive foresight'),
  ('executive_foresight.manage', 'Manage Executive Foresight', null, 'Manage foresight'),
  ('strategic_opportunities.view', 'View Strategic Opportunities', null, 'View strategic opportunities'),
  ('strategic_opportunities.manage', 'Manage Strategic Opportunities', null, 'Manage opportunities'),
  ('organizational_forecasting.view', 'View Organizational Forecasting', null, 'View forecasting'),
  ('organizational_forecasting.manage', 'Manage Organizational Forecasting', null, 'Manage forecasting'),
  ('enterprise_readiness.view', 'View Enterprise Readiness', null, 'View enterprise readiness'),
  ('enterprise_readiness.manage', 'Manage Enterprise Readiness', null, 'Manage readiness'),
  ('cross_functional_intelligence.view', 'View Cross-Functional Intelligence', null, 'View cross-functional intelligence'),
  ('cross_functional_intelligence.manage', 'Manage Cross-Functional Intelligence', null, 'Manage CFI'),
  ('intelligence_command_center.view', 'View Intelligence Command Center', null, 'View intelligence command center'),
  ('intelligence_command_center.manage', 'Manage Intelligence Command Center', null, 'Manage ICC'),
  ('future_state_planning.view', 'View Future State Planning', null, 'View future state planning'),
  ('future_state_planning.manage', 'Manage Future State Planning', null, 'Manage future state'),
  ('trust_culture.view', 'View Trust & Culture', null, 'View trust and culture center'),
  ('trust_culture.manage', 'Manage Trust & Culture', null, 'Manage culture dimensions'),
  ('support_requests.view', 'View Support Requests', null, 'View support request center'),
  ('support_requests.manage', 'Manage Support Requests', null, 'Manage support requests'),
  ('customer_academy.view', 'View Customer Academy', null, 'View customer academy'),
  ('customer_academy.manage', 'Manage Customer Academy', null, 'Manage academy'),
  ('customer_health.view', 'View Customer Health', null, 'View customer health'),
  ('customer_health.manage', 'Manage Customer Health', null, 'Manage customer health'),
  ('business_packs.view', 'View Business Packs', null, 'View business pack intelligence'),
  ('business_packs.manage', 'Manage Business Packs', null, 'Manage business pack modules'),
  ('operations_center.view', 'View Operations Center', null, 'View ABOS command center'),
  ('operations_center.manage', 'Manage Operations Center', null, 'Manage operations center')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (
  select role, key from (values
    ('owner', 'activity_history.view'), ('owner', 'activity_history.manage'),
    ('owner', 'decisions.view'), ('owner', 'decisions.manage'),
    ('owner', 'follow_ups.view'), ('owner', 'follow_ups.manage'),
    ('owner', 'goals.view'), ('owner', 'goals.manage'),
    ('owner', 'playbooks.view'), ('owner', 'playbooks.manage'),
    ('owner', 'risks.view'), ('owner', 'risks.manage'),
    ('owner', 'compliance.view'), ('owner', 'compliance.manage'),
    ('owner', 'meetings.view'), ('owner', 'meetings.manage'),
    ('owner', 'continuity.view'), ('owner', 'continuity.manage'),
    ('owner', 'learning.view'), ('owner', 'learning.manage'),
    ('owner', 'capacity.view'), ('owner', 'capacity.manage'),
    ('owner', 'success_value.view'), ('owner', 'success_value.manage'),
    ('owner', 'strategy.view'), ('owner', 'strategy.manage'),
    ('owner', 'prioritization.view'), ('owner', 'prioritization.manage'),
    ('owner', 'commitments.view'), ('owner', 'commitments.manage'),
    ('owner', 'briefings.view'), ('owner', 'briefings.manage'),
    ('owner', 'momentum.view'), ('owner', 'momentum.manage'),
    ('owner', 'resilience.view'), ('owner', 'resilience.manage'),
    ('owner', 'executive_companion.view'), ('owner', 'executive_companion.manage'),
    ('owner', 'benchmarking.view'), ('owner', 'benchmarking.manage'),
    ('owner', 'predictive_intelligence.view'), ('owner', 'predictive_intelligence.manage'),
    ('owner', 'scenario_planning.view'), ('owner', 'scenario_planning.manage'),
    ('owner', 'executive_foresight.view'), ('owner', 'executive_foresight.manage'),
    ('owner', 'strategic_opportunities.view'), ('owner', 'strategic_opportunities.manage'),
    ('owner', 'organizational_forecasting.view'), ('owner', 'organizational_forecasting.manage'),
    ('owner', 'enterprise_readiness.view'), ('owner', 'enterprise_readiness.manage'),
    ('owner', 'cross_functional_intelligence.view'), ('owner', 'cross_functional_intelligence.manage'),
    ('owner', 'intelligence_command_center.view'), ('owner', 'intelligence_command_center.manage'),
    ('owner', 'future_state_planning.view'), ('owner', 'future_state_planning.manage'),
    ('owner', 'trust_culture.view'), ('owner', 'trust_culture.manage'),
    ('owner', 'support_requests.view'), ('owner', 'support_requests.manage'),
    ('owner', 'customer_academy.view'), ('owner', 'customer_academy.manage'),
    ('owner', 'customer_health.view'), ('owner', 'customer_health.manage'),
    ('owner', 'business_packs.view'), ('owner', 'business_packs.manage'),
    ('owner', 'operations_center.view'), ('owner', 'operations_center.manage'),
    ('administrator', 'activity_history.view'), ('administrator', 'activity_history.manage'),
    ('administrator', 'decisions.view'), ('administrator', 'decisions.manage'),
    ('administrator', 'follow_ups.view'), ('administrator', 'follow_ups.manage'),
    ('administrator', 'goals.view'), ('administrator', 'goals.manage'),
    ('administrator', 'playbooks.view'), ('administrator', 'playbooks.manage'),
    ('administrator', 'risks.view'), ('administrator', 'risks.manage'),
    ('administrator', 'compliance.view'), ('administrator', 'compliance.manage'),
    ('administrator', 'meetings.view'), ('administrator', 'meetings.manage'),
    ('administrator', 'continuity.view'), ('administrator', 'continuity.manage'),
    ('administrator', 'learning.view'), ('administrator', 'learning.manage'),
    ('administrator', 'capacity.view'), ('administrator', 'capacity.manage'),
    ('administrator', 'success_value.view'), ('administrator', 'success_value.manage'),
    ('administrator', 'strategy.view'), ('administrator', 'strategy.manage'),
    ('administrator', 'prioritization.view'), ('administrator', 'prioritization.manage'),
    ('administrator', 'commitments.view'), ('administrator', 'commitments.manage'),
    ('administrator', 'briefings.view'), ('administrator', 'briefings.manage'),
    ('administrator', 'momentum.view'), ('administrator', 'momentum.manage'),
    ('administrator', 'resilience.view'), ('administrator', 'resilience.manage'),
    ('administrator', 'executive_companion.view'), ('administrator', 'executive_companion.manage'),
    ('administrator', 'benchmarking.view'), ('administrator', 'benchmarking.manage'),
    ('administrator', 'predictive_intelligence.view'), ('administrator', 'predictive_intelligence.manage'),
    ('administrator', 'scenario_planning.view'), ('administrator', 'scenario_planning.manage'),
    ('administrator', 'executive_foresight.view'), ('administrator', 'executive_foresight.manage'),
    ('administrator', 'strategic_opportunities.view'), ('administrator', 'strategic_opportunities.manage'),
    ('administrator', 'organizational_forecasting.view'), ('administrator', 'organizational_forecasting.manage'),
    ('administrator', 'enterprise_readiness.view'), ('administrator', 'enterprise_readiness.manage'),
    ('administrator', 'cross_functional_intelligence.view'), ('administrator', 'cross_functional_intelligence.manage'),
    ('administrator', 'intelligence_command_center.view'), ('administrator', 'intelligence_command_center.manage'),
    ('administrator', 'future_state_planning.view'), ('administrator', 'future_state_planning.manage'),
    ('administrator', 'trust_culture.view'), ('administrator', 'trust_culture.manage'),
    ('administrator', 'support_requests.view'), ('administrator', 'support_requests.manage'),
    ('administrator', 'customer_academy.view'), ('administrator', 'customer_academy.manage'),
    ('administrator', 'customer_health.view'), ('administrator', 'customer_health.manage'),
    ('administrator', 'business_packs.view'), ('administrator', 'business_packs.manage'),
    ('administrator', 'operations_center.view'), ('administrator', 'operations_center.manage'),
    ('manager', 'activity_history.view'), ('manager', 'decisions.view'), ('manager', 'follow_ups.view'),
    ('manager', 'goals.view'), ('manager', 'playbooks.view'), ('manager', 'risks.view'),
    ('manager', 'compliance.view'), ('manager', 'meetings.view'), ('manager', 'continuity.view'),
    ('manager', 'learning.view'), ('manager', 'capacity.view'), ('manager', 'success_value.view'),
    ('manager', 'strategy.view'), ('manager', 'prioritization.view'), ('manager', 'commitments.view'),
    ('manager', 'briefings.view'), ('manager', 'momentum.view'), ('manager', 'resilience.view'),
    ('manager', 'executive_companion.view'), ('manager', 'benchmarking.view'),
    ('manager', 'predictive_intelligence.view'), ('manager', 'scenario_planning.view'),
    ('manager', 'executive_foresight.view'), ('manager', 'strategic_opportunities.view'),
    ('manager', 'organizational_forecasting.view'), ('manager', 'enterprise_readiness.view'),
    ('manager', 'cross_functional_intelligence.view'), ('manager', 'intelligence_command_center.view'),
    ('manager', 'future_state_planning.view'), ('manager', 'trust_culture.view'),
    ('manager', 'support_requests.view'), ('manager', 'customer_academy.view'),
    ('manager', 'customer_health.view'), ('manager', 'business_packs.view'),
    ('manager', 'operations_center.view'),
    ('support_agent', 'activity_history.view'), ('support_agent', 'decisions.view'),
    ('support_agent', 'follow_ups.view'), ('support_agent', 'goals.view'), ('support_agent', 'playbooks.view'),
    ('support_agent', 'risks.view'), ('support_agent', 'compliance.view'), ('support_agent', 'meetings.view'),
    ('support_agent', 'learning.view'), ('support_agent', 'capacity.view'), ('support_agent', 'briefings.view'),
    ('support_agent', 'momentum.view'), ('support_agent', 'resilience.view'), ('support_agent', 'trust_culture.view'),
    ('support_agent', 'support_requests.view'), ('support_agent', 'customer_academy.view'),
    ('support_agent', 'customer_health.view'),
    ('viewer', 'activity_history.view'), ('viewer', 'decisions.view'), ('viewer', 'follow_ups.view'),
    ('viewer', 'goals.view'), ('viewer', 'playbooks.view'), ('viewer', 'risks.view'),
    ('viewer', 'compliance.view'), ('viewer', 'meetings.view'), ('viewer', 'continuity.view'),
    ('viewer', 'learning.view'), ('viewer', 'capacity.view'), ('viewer', 'success_value.view'),
    ('viewer', 'strategy.view'), ('viewer', 'prioritization.view'), ('viewer', 'commitments.view'),
    ('viewer', 'briefings.view'), ('viewer', 'momentum.view'), ('viewer', 'resilience.view'),
    ('viewer', 'executive_companion.view'), ('viewer', 'benchmarking.view'),
    ('viewer', 'predictive_intelligence.view'), ('viewer', 'scenario_planning.view'),
    ('viewer', 'executive_foresight.view'), ('viewer', 'strategic_opportunities.view'),
    ('viewer', 'organizational_forecasting.view'), ('viewer', 'enterprise_readiness.view'),
    ('viewer', 'cross_functional_intelligence.view'), ('viewer', 'intelligence_command_center.view'),
    ('viewer', 'future_state_planning.view'), ('viewer', 'trust_culture.view'),
    ('viewer', 'support_requests.view'), ('viewer', 'customer_academy.view'),
    ('viewer', 'customer_health.view'), ('viewer', 'business_packs.view'),
    ('viewer', 'operations_center.view')
  ) as t(role, key)
) as v
on conflict (organization_id, role, permission_key) do nothing;

-- Phase 260 re-apply guard: preserve canonical APP access resolver (notifications.view depends on ready context).
create or replace function public._apsf260_require_app_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_company_id uuid;
  v_customer_id uuid;
  v_sub_status text;
  v_license_status text;
begin
  if auth.uid() is null then
    raise exception 'APP portal access denied';
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user.id is null then
    raise exception 'APP portal access denied';
  end if;

  v_company_id := v_user.company_id;

  if exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then
    return jsonb_build_object(
      'organization_role', 'organization_owner',
      'company_id', v_company_id,
      'license_status', 'active'
    );
  end if;

  if public._apsf260_map_org_role(v_user.role) is null then
    raise exception 'APP portal access denied';
  end if;

  v_sub_status := public._apsf260_subscription_status(v_company_id);

  if v_sub_status is not null and v_sub_status not in ('active', 'trialing', 'past_due') then
    raise exception 'Active subscription required';
  end if;

  select c.id into v_customer_id from public.customers c where c.company_id = v_user.company_id limit 1;

  if v_customer_id is not null then
    v_license_status := public.resolve_license_service_status(v_customer_id);
    if v_license_status is not null and v_license_status not in ('active', 'grace_period') then
      raise exception 'Active subscription required';
    end if;
  end if;

  return jsonb_build_object(
    'organization_role', public._apsf260_map_org_role(v_user.role),
    'company_id', v_user.company_id,
    'license_status', coalesce(v_license_status, v_sub_status, 'active')
  );
end;
$$;

notify pgrst, 'reload schema';
