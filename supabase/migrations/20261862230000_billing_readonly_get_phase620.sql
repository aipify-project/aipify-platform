-- Phase 620 P1 — Billing settings read-only GET repair.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('billing.view', 'View Billing', null, 'View organization billing and subscription summary'),
  ('billing.manage', 'Manage Billing', null, 'Manage billing settings and subscription changes')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'billing.view'), ('owner', 'billing.manage'),
  ('administrator', 'billing.view'), ('administrator', 'billing.manage'),
  ('manager', 'billing.view'),
  ('support_agent', 'billing.view'),
  ('viewer', 'billing.view')
) as v(role, key) on conflict (organization_id, role, permission_key) do nothing;

insert into public.tenant_usage_metrics (tenant_id, period_month)
select c.id, date_trunc('month', now())::date
from public.customers c
where not exists (
  select 1 from public.tenant_usage_metrics t
  where t.tenant_id = c.id
    and t.period_month = date_trunc('month', now())::date
)
on conflict (tenant_id, period_month) do nothing;

create or replace function public.get_customer_billing_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_package_key text;
  v_pkg public.subscription_packages;
  v_limits jsonb;
  v_usage public.tenant_usage_metrics;
  v_modules jsonb;
  v_result jsonb;
  v_has_usage boolean := false;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('billing.view')
     and not public.has_organization_permission('billing.manage') then
    raise exception 'Permission denied: billing.view';
  end if;

  v_package_key := public._cpa_resolve_package_key(v_tenant_id);
  select * into v_pkg from public.subscription_packages where package_key = v_package_key;
  v_limits := public.get_customer_license_limits(v_tenant_id);

  select * into v_usage
  from public.tenant_usage_metrics
  where tenant_id = v_tenant_id
  order by period_month desc
  limit 1;
  v_has_usage := found;

  select coalesce(
    jsonb_agg(jsonb_build_object(
      'module_key', tm.module_key,
      'enabled', tm.enabled,
      'licensed', tm.licensed,
      'status', tm.status
    ) order by tm.module_key),
    '[]'::jsonb
  ) into v_modules
  from public.tenant_modules tm
  where tm.tenant_id = v_tenant_id and tm.licensed;

  v_result := jsonb_build_object(
    'has_customer', true,
    'current_package', jsonb_build_object(
      'package_key', v_package_key,
      'package_name', coalesce(v_pkg.package_name, 'Aipify Starter'),
      'description', coalesce(v_pkg.description, ''),
      'features', coalesce(v_pkg.features, '[]'::jsonb)
    ),
    'enabled_modules', v_modules,
    'usage', jsonb_build_object(
      'period_month', case when v_has_usage then v_usage.period_month else date_trunc('month', now())::date end,
      'support_cases_handled', coalesce(v_usage.support_cases_handled, 0),
      'autonomous_resolutions', coalesce(v_usage.autonomous_resolutions, 0),
      'knowledge_searches', coalesce(v_usage.knowledge_searches, 0),
      'employee_interactions', coalesce(v_usage.employee_interactions, 0),
      'insight_reports_generated', coalesce(v_usage.insight_reports_generated, 0),
      'api_calls', coalesce(v_usage.api_calls, 0),
      'ai_usage_volume', coalesce(v_usage.ai_usage_volume, 0)
    ),
    'tenant_limits', v_limits,
    'upgrade_options', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'package_key', sp.package_key,
        'package_name', sp.package_name,
        'description', sp.description,
        'package_type', sp.package_type
      ) order by sp.sort_order)
      from public.subscription_packages sp
      where sp.active and sp.sort_order > coalesce(v_pkg.sort_order, 0)),
      '[]'::jsonb
    ),
    'addon_marketplace', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'addon_key', sp.package_key,
        'name', sp.package_name,
        'description', sp.description,
        'features', sp.features
      ))
      from public.subscription_packages sp
      where sp.package_type = 'addon' and sp.active),
      '[]'::jsonb
    ),
    'upgrade_recommendations', public.get_upgrade_recommendations(v_tenant_id),
    'billing_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'plan_name', s.plan_name,
        'status', s.status,
        'next_billing_date', s.next_billing_date,
        'updated_at', s.updated_at
      ) order by s.updated_at desc)
      from public.subscriptions s where s.customer_id = v_tenant_id limit 6),
      '[]'::jsonb
    ),
    'suites', jsonb_build_array(
      jsonb_build_object('key', 'aipify_core', 'label', 'Aipify Core'),
      jsonb_build_object('key', 'support_suite', 'label', 'Support Suite'),
      jsonb_build_object('key', 'operations_suite', 'label', 'Operations Suite'),
      jsonb_build_object('key', 'knowledge_suite', 'label', 'Knowledge Suite'),
      jsonb_build_object('key', 'insights_suite', 'label', 'Insights Suite'),
      jsonb_build_object('key', 'enterprise_intelligence_suite', 'label', 'Enterprise Intelligence Suite')
    ),
    'privacy_note', 'Billing shows package and usage aggregates. Payment details remain in your subscription provider.',
    'positioning', 'A modular AI-powered business operations platform designed to help organizations automate customer support, preserve institutional knowledge, improve operational efficiency, and scale through intelligent automation.'
  );

  if public.has_organization_permission('billing.manage') then
    v_result := v_result || jsonb_build_object(
      'enterprise_pricing_philosophy', public._eppcm_enterprise_pricing_philosophy()
    );
  end if;

  return v_result;
end;
$$;
