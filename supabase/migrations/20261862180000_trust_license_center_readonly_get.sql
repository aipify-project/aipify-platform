-- Phase 620 P1 — Trust & License Center read-only GET repair.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('trust_center.view', 'View Trust Center', null, 'View organization trust center'),
  ('trust_center.manage', 'Manage Trust Center', null, 'Manage trust center actions'),
  ('license_center.view', 'View License Center', null, 'View license and subscription center'),
  ('license_center.manage', 'Manage License Center', null, 'Manage license subscription actions')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'trust_center.view'), ('owner', 'trust_center.manage'),
  ('owner', 'license_center.view'), ('owner', 'license_center.manage'),
  ('administrator', 'trust_center.view'), ('administrator', 'trust_center.manage'),
  ('administrator', 'license_center.view'), ('administrator', 'license_center.manage'),
  ('manager', 'trust_center.view'), ('manager', 'license_center.view'),
  ('support_agent', 'trust_center.view'), ('support_agent', 'license_center.view'),
  ('viewer', 'trust_center.view'), ('viewer', 'license_center.view')
) as v(role, key) on conflict (organization_id, role, permission_key) do nothing;

insert into public.organization_trust_center_settings (organization_id)
select o.id from public.organizations o
where not exists (select 1 from public.organization_trust_center_settings s where s.organization_id = o.id)
on conflict (organization_id) do nothing;

insert into public.organization_app_license_state (organization_id)
select o.id from public.organizations o
where not exists (select 1 from public.organization_app_license_state s where s.organization_id = o.id)
on conflict (organization_id) do nothing;

insert into public.organization_user_capacity_pool (organization_id)
select o.id from public.organizations o
where not exists (select 1 from public.organization_user_capacity_pool s where s.organization_id = o.id)
on conflict (organization_id) do nothing;

create or replace function public._ls510_capacity_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_included int;
  v_purchased int;
  v_capacity int;
  v_active int;
  v_pending int;
  v_used int;
  v_available int;
  v_status text;
begin
  select included_capacity, purchased_capacity
  into v_included, v_purchased
  from public.organization_user_capacity_pool
  where organization_id = p_org_id;

  v_capacity := case
    when v_included is null and v_purchased = 0 then null
    else coalesce(v_included, 0) + coalesce(v_purchased, 0)
  end;

  select count(*) into v_active
  from public.organization_employee_profiles p
  where p.organization_id = p_org_id and p.employee_status = 'active';

  select count(*) into v_pending
  from public.organization_employee_invitations i
  where i.organization_id = p_org_id and i.status = 'pending';

  v_used := v_active + v_pending;
  v_available := case
    when v_capacity is null or v_included is null and v_purchased = 0 then null
    else greatest(0, v_capacity - v_used)
  end;

  v_status := case
    when v_capacity is null then 'unlimited'
    when v_used >= v_capacity then 'upgrade_required'
    when v_used >= v_capacity * 0.9 then 'near_capacity'
    else 'full'
  end;

  return jsonb_build_object(
    'included_capacity', v_included,
    'purchased_capacity', v_purchased,
    'total_capacity', v_capacity,
    'active_employees', v_active,
    'pending_invitations', v_pending,
    'used', v_used,
    'available', v_available,
    'capacity_status', v_status,
    'principle', 'Employees are capacity. Business Packs provide functionality — not artificial feature limits.'
  );
end; $$;

create or replace function public._ls510_app_license_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_row public.organization_app_license_state;
  v_plan text;
  v_sub_status text;
  v_renewal date;
  v_license_status text;
  v_app_status text;
begin
  select * into v_row from public.organization_app_license_state where organization_id = p_org_id;

  select s.plan_key, s.status, s.expires_at::date
  into v_plan, v_sub_status, v_renewal
  from public.organization_subscriptions s
  where s.organization_id = p_org_id
  limit 1;

  if v_plan is null then
    select coalesce(s.plan_key, s.plan_type, 'business'), s.status, s.next_billing_date::date
    into v_plan, v_sub_status, v_renewal
    from public.subscriptions s
    where s.customer_id = p_org_id
    order by s.created_at desc
    limit 1;
  end if;

  if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
    v_license_status := public.resolve_license_service_status(p_org_id);
  else
    v_license_status := coalesce(v_row.app_license_status, 'active');
  end if;

  v_app_status := coalesce(
    v_row.app_license_status,
    case
      when v_license_status = 'paused' then 'suspended'
      when v_license_status = 'grace_period' then 'grace_period'
      when v_sub_status = 'trial' then 'trial'
      when v_sub_status in ('active', 'trialing', 'internal') then 'active'
      when v_sub_status in ('cancelled', 'expired') then 'cancelled'
      else 'active'
    end
  );

  return jsonb_build_object(
    'license_type', coalesce(v_row.license_type, case when v_plan = 'enterprise' then 'enterprise' else 'app' end),
    'status', v_app_status,
    'renewal_date', coalesce(v_row.renewal_date, v_renewal),
    'plan_key', coalesce(v_plan, 'business'),
    'includes', jsonb_build_array(
      'APP Organization', 'Companion', 'Core Modules', 'Settings', 'Billing',
      'License Management', 'Business Pack Marketplace', 'Domain Management'
    ),
    'access_blocked', v_app_status in ('suspended', 'cancelled'),
    'allowed_when_suspended', jsonb_build_array('billing', 'invoices', 'support', 'renewal', 'licenses')
  );
end; $$;

create or replace function public.get_license_subscription_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_domains jsonb;
  v_packs jsonb;
  v_domain_packs jsonb;
  v_invoices jsonb;
  v_audit jsonb;
  v_sub jsonb := '{}'::jsonb;
  v_limits jsonb := '{}'::jsonb;
  v_pack_count int;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  if not public.has_organization_permission('license_center.view')
     and not public.has_organization_permission('license_center.manage') then
    raise exception 'Permission denied: license_center.view';
  end if;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    v_sub := coalesce(public.get_customer_license_center()->'subscription', '{}'::jsonb);
  end if;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_limits') then
    v_limits := coalesce(public.get_customer_license_limits(v_org_id), '{}'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'domain', d.domain, 'display_name', coalesce(d.display_name, d.domain),
    'domain_status', d.domain_status, 'license_status', d.license_status, 'is_primary', d.is_primary
  ) order by d.is_primary desc, d.domain), '[]'::jsonb)
  into v_domains
  from public.organization_domains d
  where d.organization_id = v_org_id and d.domain_status in ('pending', 'active');

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', s.pack_key,
    'tier_key', s.tier_key,
    'license_status', s.license_status,
    'renewal_date', s.renewal_date,
    'capacity_limit', s.capacity_limit,
    'card', case when exists (select 1 from pg_proc where proname = '_as502_pack_card')
      then public._as502_pack_card(v_org_id, s.pack_key) else '{}'::jsonb end
  )), '[]'::jsonb)
  into v_packs
  from public.business_pack_license_tenant_state s
  where s.tenant_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'domain_id', i.domain_id, 'domain', d.domain, 'pack_key', i.pack_key,
    'license_status', i.license_status, 'installed_at', i.installed_at
  ) order by i.installed_at desc), '[]'::jsonb)
  into v_domain_packs
  from public.domain_business_pack_installations i
  join public.organization_domains d on d.id = i.domain_id
  where i.organization_id = v_org_id and i.license_status = 'active';

  select count(distinct pack_key) into v_pack_count
  from (
    select pack_key from public.business_pack_license_tenant_state where tenant_id = v_org_id and license_status in ('active', 'trial')
    union
    select pack_key from public.domain_business_pack_installations where organization_id = v_org_id and license_status = 'active'
  ) t;

  begin
    select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
    into v_invoices
    from (
      select inv.id, inv.status, inv.due_date, inv.amount
      from public.invoices inv
      where inv.customer_id = v_org_id
      order by inv.due_date desc nulls last
      limit 5
    ) t;
  exception when undefined_table then
    v_invoices := '[]'::jsonb;
  end;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action, 'summary', a.summary, 'license_type', a.license_type,
    'pack_key', a.pack_key, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.organization_license_subscription_audit_logs
    where organization_id = v_org_id
    order by created_at desc limit 10
  ) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Business Packs provide functionality. Licenses provide scale. Domains define deployment. Employees consume capacity.',
    'structure', 'PLATFORM → APP → LICENSES → DOMAINS → BUSINESS PACKS → EMPLOYEES',
    'app_license', public._ls510_app_license_summary(v_org_id),
    'domain_licenses', public._dl505_license_summary(v_org_id),
    'domains', v_domains,
    'capacity', public._ls510_capacity_summary(v_org_id),
    'business_packs', v_packs,
    'domain_pack_installations', v_domain_packs,
    'subscription', v_sub || jsonb_build_object('limits', v_limits),
    'overview', jsonb_build_object(
      'domains_used', (public._dl505_license_summary(v_org_id)->>'used')::int,
      'domains_purchased', (public._dl505_license_summary(v_org_id)->>'purchased')::int,
      'employees_active', (public._ls510_capacity_summary(v_org_id)->>'active_employees')::int,
      'employees_capacity', public._ls510_capacity_summary(v_org_id)->'total_capacity',
      'business_pack_count', v_pack_count,
      'renewal_date', public._ls510_app_license_summary(v_org_id)->>'renewal_date'
    ),
    'reports', jsonb_build_object(
      'license_usage', jsonb_build_object(
        'app_status', public._ls510_app_license_summary(v_org_id)->>'status',
        'domain_usage_pct', case
          when (public._dl505_license_summary(v_org_id)->>'purchased')::int > 0
          then round(100.0 * (public._dl505_license_summary(v_org_id)->>'used')::numeric
            / nullif((public._dl505_license_summary(v_org_id)->>'purchased')::numeric, 0), 1)
          else 0 end,
        'employee_capacity_pct', case
          when (public._ls510_capacity_summary(v_org_id)->>'total_capacity') is not null
            and (public._ls510_capacity_summary(v_org_id)->>'total_capacity')::int > 0
          then round(100.0 * (public._ls510_capacity_summary(v_org_id)->>'used')::numeric
            / (public._ls510_capacity_summary(v_org_id)->>'total_capacity')::numeric, 1)
          else null end,
        'business_pack_adoption', v_pack_count
      ),
      'renewal_forecast', jsonb_build_object(
        'app_renewal', public._ls510_app_license_summary(v_org_id)->>'renewal_date',
        'packs_renewing_30d', (
          select count(*) from public.business_pack_license_tenant_state
          where tenant_id = v_org_id and license_status = 'active'
            and renewal_date between current_date and current_date + 30
        )
      )
    ),
    'upgrade_center', jsonb_build_object(
      'purchase_capacity_route', '/app/store/capacity',
      'purchase_domain_route', '/app/store/additional_domain_license',
      'upgrade_subscription_route', '/app/settings/billing',
      'install_packs_route', '/app/store',
      'enterprise_route', '/app/support'
    ),
    'recent_invoices', v_invoices,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'billing', '/app/settings/billing',
      'trust_center', '/app/license',
      'domains', '/app/domains',
      'store', '/app/store',
      'employees', '/app/employees'
    ),
    'subscription_statuses', jsonb_build_array(
      jsonb_build_object('key', 'active', 'label', 'Active', 'access', 'full'),
      jsonb_build_object('key', 'trial', 'label', 'Trial', 'access', 'limited_time'),
      jsonb_build_object('key', 'grace_period', 'label', 'Grace Period', 'access', 'warning'),
      jsonb_build_object('key', 'suspended', 'label', 'Suspended', 'access', 'billing_only'),
      jsonb_build_object('key', 'cancelled', 'label', 'Cancelled', 'access', 'disabled')
    ),
    'commercial_principle', 'Small companies receive the same Business Packs and functionality. Larger organizations pay for scale — not hidden features.'
  );
end; $$;

create or replace function public.get_organization_trust_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
  v_overview jsonb;
  v_identities jsonb;
  v_verifications jsonb;
  v_devices jsonb;
  v_sessions jsonb;
  v_events jsonb;
  v_audit jsonb;
  v_permissions jsonb;
  v_compliance jsonb;
  v_partner jsonb;
  v_org_verify jsonb;
  v_score jsonb;
  v_exec jsonb;
  v_reports jsonb;
  v_advisor jsonb;
  v_governance jsonb;
  v_execution jsonb;
begin
  v_org_id := public._trust551_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  if not public.has_organization_permission('trust_center.view')
     and not public.has_organization_permission('trust_center.manage') then
    raise exception 'Permission denied: trust_center.view';
  end if;

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'trust_score', coalesce((select trust_score from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 80),
    'security_score', coalesce((select security_score from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 80),
    'trust_status', coalesce((select trust_status from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 'trusted'),
    'security_status', coalesce((select security_status_label from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 'healthy'),
    'verification_status', coalesce((select status from public.organization_trust_verifications where organization_id = v_org_id order by updated_at desc limit 1), 'pending'),
    'two_factor_adoption_pct', coalesce((select two_factor_adoption_pct from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 0),
    'device_health_pct', coalesce((select device_trust_pct from public.organization_trust_score_snapshots where organization_id = v_org_id order by recorded_at desc limit 1), 0),
    'active_sessions', (select count(*) from public.organization_trust_sessions where organization_id = v_org_id and status = 'active'),
    'registered_identities', (select count(*) from public.organization_trust_identities where organization_id = v_org_id),
    'trusted_devices', (select count(*) from public.organization_trust_devices where organization_id = v_org_id and approval_status = 'trusted'),
    'pending_verifications', (select count(*) from public.organization_trust_verifications where organization_id = v_org_id and status in ('pending', 'review_required')),
    'recent_security_events', (select count(*) from public.organization_trust_security_events where organization_id = v_org_id and created_at > now() - interval '7 days')
  ) into v_overview;

  select coalesce(jsonb_agg(to_jsonb(i) order by i.display_name), '[]'::jsonb)
  into v_identities from public.organization_trust_identities i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(v) order by v.updated_at desc), '[]'::jsonb)
  into v_verifications from public.organization_trust_verifications v where v.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(d) order by d.last_activity_at desc), '[]'::jsonb)
  into v_devices from public.organization_trust_devices d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(s) order by s.started_at desc), '[]'::jsonb)
  into v_sessions from public.organization_trust_sessions s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(e) order by e.created_at desc), '[]'::jsonb)
  into v_events from public.organization_trust_security_events e where e.organization_id = v_org_id limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'event_category', a.event_category,
    'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit from public.organization_trust_center_audit_logs a where a.organization_id = v_org_id limit 30;

  select coalesce(jsonb_agg(to_jsonb(p) order by p.permission_scope), '[]'::jsonb)
  into v_permissions from public.organization_trust_permission_snapshots p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(c) order by c.engine_key), '[]'::jsonb)
  into v_compliance from public.organization_trust_compliance_links c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(p) order by p.partner_name), '[]'::jsonb)
  into v_partner from public.organization_trust_partner_verifications p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(to_jsonb(o) order by o.verification_type), '[]'::jsonb)
  into v_org_verify from public.organization_trust_org_verifications o where o.organization_id = v_org_id;

  select to_jsonb(s) into v_score
  from public.organization_trust_score_snapshots s
  where s.organization_id = v_org_id order by s.recorded_at desc limit 1;

  v_exec := jsonb_build_object(
    'trust_score', v_overview->'trust_score',
    'security_score', v_overview->'security_score',
    'verification_coverage_pct', coalesce(v_score->'verification_coverage_pct', '0'),
    'audit_events_30d', (select count(*) from public.organization_trust_center_audit_logs where organization_id = v_org_id and created_at > now() - interval '30 days'),
    'critical_risks', (select count(*) from public.organization_trust_security_events where organization_id = v_org_id and severity = 'critical' and not resolved),
    'partner_verification_pending', (select count(*) from public.organization_trust_partner_verifications where organization_id = v_org_id and not payout_eligible)
  );

  v_reports := jsonb_build_object(
    'security_activity', v_overview->'recent_security_events',
    'verification_pending', v_overview->'pending_verifications',
    'two_factor_adoption_pct', v_overview->'two_factor_adoption_pct',
    'device_health_pct', v_overview->'device_health_pct',
    'audit_events_30d', v_exec->'audit_events_30d',
    'compliance_engines', jsonb_array_length(coalesce(v_compliance, '[]'::jsonb))
  );

  v_advisor := jsonb_build_object(
    'principle', 'Trust is earned through visibility. Aipify explains security in clear language — humans decide.',
    'advisor_prompts', jsonb_build_array(
      'Which devices are unverified or suspicious?',
      'Who changed permissions recently?',
      'What verification steps are still pending?',
      'Show recent audit history for sensitive actions.',
      'Review trust status and recommended next steps.'
    ),
    'suspicious_devices', (select count(*) from public.organization_trust_devices where organization_id = v_org_id and approval_status in ('unrecognized', 'suspicious')),
    'unverified_identities', (select count(*) from public.organization_trust_identities where organization_id = v_org_id and verification_status in ('pending', 'review_required'))
  );

  v_governance := jsonb_build_object(
    'companion_verifies', jsonb_build_array(
      'permissions', 'roles', 'domain_access', 'business_pack_access',
      'connector_permissions', 'approval_rules'
    ),
    'never_bypasses', true,
    'identity_protection', jsonb_build_array(
      'two_factor', 'device_approval', 'session_verification', 'risk_detection', 'suspicious_activity_monitoring'
    )
  );

  v_execution := jsonb_build_object(
    'flow', jsonb_build_array(
      'action_requested', 'permissions_verified', 'approvals_verified',
      'execution_approved', 'action_performed', 'audit_logged'
    ),
    'engines', jsonb_build_array('execution_engine', 'automation_engine', 'approvals', 'companion')
  );

  return jsonb_build_object(
    'found', true,
    'section', coalesce(p_section, 'overview'),
    'principle', 'Trust must be visible. Security must be understandable. Organizations should know who did what, when, why, and whether it was authorized.',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', v_overview,
    'identity_engine', jsonb_build_object('identities', v_identities),
    'verification_engine', jsonb_build_object('verifications', v_verifications, 'organization_verifications', v_org_verify),
    'device_trust_center', jsonb_build_object('devices', v_devices),
    'session_management', jsonb_build_object('sessions', v_sessions),
    'security_events', v_events,
    'identity_protection', v_governance->'identity_protection',
    'two_factor_center', jsonb_build_object(
      'adoption_pct', v_overview->'two_factor_adoption_pct',
      'methods', jsonb_build_array('authenticator_apps', 'backup_codes', 'recovery_flow', 'hardware_keys_future'),
      'route', '/app/trust/2fa'
    ),
    'partner_verification', v_partner,
    'organization_verification', v_org_verify,
    'audit_history', v_audit,
    'permission_explorer', jsonb_build_object('snapshots', v_permissions),
    'companion_trust_advisor', v_advisor,
    'compliance_integration', v_compliance,
    'security_score_engine', coalesce(v_score, '{}'::jsonb),
    'platform_governor', v_governance,
    'execution_coordination', v_execution,
    'executive_dashboard', v_exec,
    'reports', v_reports,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'devices', true, 'sessions', true, 'two_factor', true,
      'security_events', true, 'trust_status', true
    ),
    'routes', jsonb_build_object(
      'trust_center', '/app/trust',
      'devices', '/app/trust/devices',
      'two_factor', '/app/trust/2fa',
      'audit', '/app/trust/audit',
      'security_settings', '/app/settings/security',
      'approvals', '/app/approvals'
    )
  );
end; $$;

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

notify pgrst, 'reload schema';
