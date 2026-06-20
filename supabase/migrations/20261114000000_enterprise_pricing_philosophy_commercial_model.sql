-- Enterprise Pricing Philosophy & Commercial Model
-- Guidance metadata for sales and customer transparency — NOT billing enforcement.
-- Spec: AIPIFY_ENTERPRISE_PRICING_PHILOSOPHY_COMMERCIAL_MODEL.md

-- ---------------------------------------------------------------------------
-- 1. Helpers (_eppcm_*)
-- ---------------------------------------------------------------------------
create or replace function public._eppcm_is_owner_or_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  if auth.uid() is null then return false; end if;
  select u.role into v_role from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_role in ('owner', 'admin');
end;
$$;

create or replace function public._eppcm_philosophy_principle()
returns text
language sql
immutable
as $$
  select 'Aipify is priced as a Business Operating System — value follows operational scope, outcomes, and trust governance, not token consumption or chat volume.';
$$;

create or replace function public._eppcm_philosophy_summary()
returns text
language sql
immutable
as $$
  select 'Aipify pricing reflects operational scope and outcomes — not per-message or token metering. See Billing settings for plan guidance.';
$$;

create or replace function public._eppcm_value_based_avoid()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    'Per-token or per-message chatbot pricing',
    'Generic AI API meter billing as the primary product',
    'Comparing Aipify to consumer chatbot subscriptions',
    'Usage-only pricing without operational context',
    'Hidden overage traps on intelligence volume'
  );
$$;

create or replace function public._eppcm_value_based_price_on()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    'Operational scope — installs, domains, users, and licensed modules',
    'Business outcomes — support resolution, knowledge retention, workflow automation',
    'Governance depth — approvals, audit, enterprise security, and SLA',
    'Implementation and change management for Enterprise',
    'Partner-led consulting and onboarding via Sales Experts'
  );
$$;

create or replace function public._eppcm_customer_segments()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'micro',
      'label', 'Micro & solo operators',
      'description', 'Solo entrepreneurs and micro businesses installing Aipify into one system with light support needs.',
      'typical_plan_key', 'starter'
    ),
    jsonb_build_object(
      'key', 'small',
      'label', 'Small business',
      'description', 'Growing SMBs automating customer support and preserving institutional knowledge with Aipify Support.',
      'typical_plan_key', 'growth'
    ),
    jsonb_build_object(
      'key', 'growth',
      'label', 'Growth organizations',
      'description', 'Teams with internal processes, employee knowledge, and cross-functional workflows across multiple installs.',
      'typical_plan_key', 'business'
    ),
    jsonb_build_object(
      'key', 'enterprise',
      'label', 'Enterprise',
      'description', 'Large organizations requiring governance, executive visibility, dedicated success, and custom deployment.',
      'typical_plan_key', 'enterprise'
    )
  );
$$;

create or replace function public._eppcm_plan_pricing_guidance()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object(
      'plan_key', 'starter',
      'package_key', 'starter',
      'plan_key_aliases', jsonb_build_array('starter'),
      'display_name', 'Aipify Starter',
      'usd_range_monthly', '$79–$149',
      'target_segment', 'micro',
      'features', jsonb_build_array(
        'Aipify Core', 'Install Engine', 'Aipify Companion (essential)',
        'Aipify Support (FAQ knowledge)', 'Human approval mode', 'Basic analytics'
      )
    ),
    jsonb_build_object(
      'plan_key', 'growth',
      'package_key', 'professional',
      'plan_key_aliases', jsonb_build_array('growth', 'professional'),
      'display_name', 'Aipify Growth',
      'usd_range_monthly', '$199–$399',
      'target_segment', 'small',
      'features', jsonb_build_array(
        'Business DNA', 'Aipify Support (autonomous operations)',
        'Workflow Orchestration', 'Confidence Engine', 'Proactive Companion', 'Support dashboards'
      )
    ),
    jsonb_build_object(
      'plan_key', 'business',
      'package_key', 'business',
      'plan_key_aliases', jsonb_build_array('business'),
      'display_name', 'Aipify Business',
      'usd_range_monthly', '$499–$999',
      'target_segment', 'growth',
      'features', jsonb_build_array(
        'Employee Knowledge Engine', 'Role-based knowledge access', 'Onboarding Companion',
        'Knowledge Health', 'Internal search', 'Meeting Companion', 'Action Center'
      )
    ),
    jsonb_build_object(
      'plan_key', 'enterprise',
      'package_key', 'enterprise',
      'plan_key_aliases', jsonb_build_array('enterprise'),
      'display_name', 'Aipify Enterprise',
      'usd_range_monthly', 'Custom — typically $1,500+',
      'target_segment', 'enterprise',
      'features', jsonb_build_array(
        'All Aipify suites', 'Executive Insights', 'Advanced security & audit',
        'SLA agreements', 'Multi-region options', 'Dedicated Aipify success',
        'Custom workflows & integrations'
      )
    )
  );
$$;

create or replace function public._eppcm_enterprise_implementation_guidance()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'nok_range', 'NOK 100,000–500,000+',
    'description',
      'Enterprise engagements combine subscription with scoped implementation — discovery, integration, governance design, and rollout.',
    'services', jsonb_build_array(
      'Discovery and operational mapping',
      'Install and domain architecture',
      'Business DNA and knowledge migration',
      'Governance, approvals, and trust policy design',
      'Change management and executive briefing',
      'Training and Sales Expert handoff',
      'Post-launch optimization review'
    )
  );
$$;

create or replace function public._eppcm_sales_expert_pricing_examples()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object(
      'service', 'Discovery meeting & fit assessment',
      'nok_range', 'NOK 2,500–5,000',
      'note', 'Independent Sales Expert business — billed separately from Aipify subscription.'
    ),
    jsonb_build_object(
      'service', 'Implementation project (SMB)',
      'nok_range', 'NOK 50,000–150,000',
      'note', 'Scoped install, Business DNA setup, and team onboarding.'
    ),
    jsonb_build_object(
      'service', 'Enterprise rollout program',
      'nok_range', 'NOK 150,000–500,000+',
      'note', 'Multi-site deployment, governance, and executive alignment.'
    ),
    jsonb_build_object(
      'service', 'Training workshop (half day)',
      'nok_range', 'NOK 15,000–30,000',
      'note', 'Role-based training for owners, support, and operations teams.'
    ),
    jsonb_build_object(
      'service', 'Ongoing advisory retainer',
      'nok_range', 'NOK 5,000–15,000 / month',
      'note', 'Quarterly reviews, upgrade recommendations, and optimization.'
    )
  );
$$;

create or replace function public._eppcm_revenue_model()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'subscription_revenue',
      'Recurring SaaS subscription aligned to plan scope — Starter, Growth, Business, and Enterprise.',
    'implementation_revenue',
      'Enterprise implementation and partner-led services — separate from core subscription.',
    'partner_revenue',
      'Sales Expert and partner ecosystem commissions on qualified customer relationships.',
    'expansion_revenue',
      'Natural upgrades as operational volume, modules, and governance needs grow.',
    'principle',
      'Aipify subscription: Customer ↔ Aipify. Consulting and implementation: Customer ↔ Sales Expert.'
  );
$$;

create or replace function public._eppcm_positioning_comparisons()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object(
      'avoid', 'AI chatbot with per-message pricing',
      'prefer', 'Aipify Business Operating System (ABOS) with modular operational suites'
    ),
    jsonb_build_object(
      'avoid', 'Helpdesk AI add-on',
      'prefer', 'Aipify Support — installed operational companion inside your systems'
    ),
    jsonb_build_object(
      'avoid', 'Token meter like a generic LLM API',
      'prefer', 'Licensed modules and outcomes — support resolution, knowledge, workflows'
    ),
    jsonb_build_object(
      'avoid', 'Consumer AI subscription',
      'prefer', 'Professional operations platform with human approval and audit'
    )
  );
$$;

create or replace function public._eppcm_pricing_signal_expectations()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    'Customers expect transparent plan scope — modules, limits, and upgrade paths.',
    'Enterprise buyers expect implementation scoping separate from subscription.',
    'Sales Experts quote implementation in NOK; Aipify quotes subscription in plan currency.',
    'No surprise token overages — intelligence volume is part of operational scope, not a hidden meter.',
    'Upgrade signals follow usage patterns (support volume, employee knowledge, governance needs).'
  );
$$;

create or replace function public._eppcm_abos_principle()
returns text
language sql
immutable
as $$
  select 'Price Aipify as the Aipify Business Operating System (ABOS) — an install-first operations layer, not a chat interface. Companions (Support, Meeting, Onboarding) are product capabilities, not separate AI tools.';
$$;

create or replace function public._eppcm_vision()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    'Organizations pay for operational partnership — not for counting messages.',
    'Value grows as Aipify learns the business and expands across installs.',
    'Enterprise trust requires governance pricing — not cheapest token rates.',
    'Sales Experts extend Aipify with human implementation; subscription stays with Aipify.',
    'Aipify works in the background so businesses can move forward.'
  );
$$;

create or replace function public._eppcm_enterprise_pricing_philosophy()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'doc', 'AIPIFY_ENTERPRISE_PRICING_PHILOSOPHY_COMMERCIAL_MODEL.md',
    'principle', public._eppcm_philosophy_principle(),
    'value_based_avoid', public._eppcm_value_based_avoid(),
    'value_based_price_on', public._eppcm_value_based_price_on(),
    'customer_segments', public._eppcm_customer_segments(),
    'plan_pricing_guidance', public._eppcm_plan_pricing_guidance(),
    'enterprise_implementation', public._eppcm_enterprise_implementation_guidance(),
    'sales_expert_examples', public._eppcm_sales_expert_pricing_examples(),
    'revenue_model', public._eppcm_revenue_model(),
    'positioning_comparisons', public._eppcm_positioning_comparisons(),
    'pricing_signal_expectations', public._eppcm_pricing_signal_expectations(),
    'abos_principle', public._eppcm_abos_principle(),
    'vision', public._eppcm_vision(),
    'guidance_note',
      'Recommended prices are sales and transparency guidance — not billing engine overrides. Live subscription amounts follow your contracted plan.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Extend get_customer_billing_center — preserve ALL Phase 42 fields
-- ---------------------------------------------------------------------------
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
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_package_key := public._cpa_resolve_package_key(v_tenant_id);
  select * into v_pkg from public.subscription_packages where package_key = v_package_key;
  v_limits := public.get_customer_license_limits(v_tenant_id);

  select * into v_usage
  from public.tenant_usage_metrics
  where tenant_id = v_tenant_id
  order by period_month desc
  limit 1;

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
      'period_month', v_usage.period_month,
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

  if public._eppcm_is_owner_or_admin() then
    v_result := v_result || jsonb_build_object(
      'enterprise_pricing_philosophy', public._eppcm_enterprise_pricing_philosophy()
    );
  end if;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Extend get_customer_license_center — read-only pricing_philosophy_note
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_license_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_company_name text;
  v_license_status text;
  v_limits jsonb;
  v_grace_ends timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id, co.name
  into v_customer_id, v_company_name
  from public.customers c
  join public.companies co on co.id = c.company_id
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('license_center.view')
     and not public.has_organization_permission('license_center.manage') then
    raise exception 'Permission denied: license_center.view';
  end if;

  v_license_status := public.resolve_license_service_status(v_customer_id);
  v_limits := public.get_customer_license_limits(v_customer_id);

  if v_license_status = 'grace_period' then
    v_grace_ends := coalesce(
      (select s.grace_period_ends_at from public.subscriptions s where s.customer_id = v_customer_id),
      now() + interval '3 days'
    );
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'company_name', v_company_name,
    'software_version', '1.0.0',
    'software_owner', 'Aipify Group AS',
    'license_status', v_license_status,
    'grace_period_days', 3,
    'grace_period_ends_at', v_grace_ends,
    'paused_message',
      case
        when v_license_status = 'paused'
          then 'Aipify services are temporarily paused due to an overdue subscription. Services will resume automatically once payment has been received.'
        else null
      end,
    'reactivation_message', 'Welcome back. Aipify has resumed normal operations.',
    'subscription', jsonb_build_object(
      'plan_name', v_limits ->> 'plan_name',
      'plan_type', v_limits ->> 'plan_type',
      'subscription_status', v_limits ->> 'subscription_status',
      'renewal_date', (
        select s.next_billing_date::text
        from public.subscriptions s
        where s.customer_id = v_customer_id
      ),
      'payment_status', (
        select pp.payment_status
        from public.payment_profiles pp
        where pp.customer_id = v_customer_id
        limit 1
      ),
      'installation_count', coalesce((v_limits ->> 'used_installations')::int, 0),
      'domain_count', coalesce((v_limits ->> 'used_domains')::int, 0),
      'user_count', coalesce((v_limits ->> 'used_users')::int, 0),
      'max_installations', v_limits ->> 'max_installations',
      'max_domains', v_limits ->> 'max_domains',
      'max_users', v_limits ->> 'max_users'
    ),
    'legal', jsonb_build_object(
      'website', 'https://aipify.ai',
      'support_email', 'support@aipify.ai',
      'privacy_email', 'privacy@aipify.ai'
    ),
    'pricing_philosophy_note', public._eppcm_philosophy_summary()
  );
end;
$$;

grant execute on function public._eppcm_is_owner_or_admin() to authenticated;
grant execute on function public._eppcm_philosophy_principle() to authenticated;
grant execute on function public._eppcm_philosophy_summary() to authenticated;
grant execute on function public._eppcm_value_based_avoid() to authenticated;
grant execute on function public._eppcm_value_based_price_on() to authenticated;
grant execute on function public._eppcm_customer_segments() to authenticated;
grant execute on function public._eppcm_plan_pricing_guidance() to authenticated;
grant execute on function public._eppcm_enterprise_implementation_guidance() to authenticated;
grant execute on function public._eppcm_sales_expert_pricing_examples() to authenticated;
grant execute on function public._eppcm_revenue_model() to authenticated;
grant execute on function public._eppcm_positioning_comparisons() to authenticated;
grant execute on function public._eppcm_pricing_signal_expectations() to authenticated;
grant execute on function public._eppcm_abos_principle() to authenticated;
grant execute on function public._eppcm_vision() to authenticated;
grant execute on function public._eppcm_enterprise_pricing_philosophy() to authenticated;
