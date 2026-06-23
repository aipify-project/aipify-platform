-- P1.01 live E2E flow repair — command brief metrics, CRM/procurement APP access.

-- ---------------------------------------------------------------------------
-- 1. Fix organization_business_packs pack count (no status column on table)
-- ---------------------------------------------------------------------------
create or replace function public._acsc295_org_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_team_count integer := 0;
  v_2fa_count integer := 0;
  v_2fa_eligible integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_connected integer := 0;
  v_academy_completions integer := 0;
  v_academy_certs integer := 0;
  v_academy_assignments_done integer := 0;
  v_academy_assignments_total integer := 0;
  v_operations_records integer := 0;
  v_compliance_records integer := 0;
  v_org_id uuid;
  v_two_fa_percent integer := null;
begin
  select count(*)::int into v_team_count
  from public.users u
  where u.company_id = p_company_id
    and coalesce(u.status, 'active') not in ('disabled', 'inactive');

  v_org_id := public._cs621_organization_id_for_company(p_company_id);

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa_count
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true
      and coalesce(u.status, 'active') not in ('disabled', 'inactive');
    v_2fa_eligible := v_team_count;
  end if;

  if v_2fa_eligible > 0 then
    v_two_fa_percent := round((v_2fa_count::numeric / v_2fa_eligible) * 100)::int;
  end if;

  if v_org_id is not null and to_regclass('public.organization_business_packs') is not null then
    select count(*)::int into v_packs
    from public.organization_business_packs obp
    where obp.organization_id = v_org_id;
  elsif to_regclass('public.tenant_modules') is not null and v_org_id is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_org_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int, count(*) filter (where ic.status = 'connected')::int
    into v_integrations, v_connected
    from public.app_portal_integration_connections ic
    where ic.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_completions') is not null then
    select count(*)::int into v_academy_completions
    from public.app_portal_academy_completions co where co.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_certifications') is not null then
    select count(*)::int into v_academy_certs
    from public.app_portal_academy_certifications ce
    where ce.company_id = p_company_id and ce.status = 'earned';
  end if;

  if to_regclass('public.app_portal_academy_assignments') is not null then
    select count(*) filter (where a.status = 'completed')::int,
           count(*)::int
    into v_academy_assignments_done, v_academy_assignments_total
    from public.app_portal_academy_assignments a
    where a.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_commitments where company_id = p_company_id);
  end if;
  if to_regclass('public.app_portal_briefings') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_briefings where company_id = p_company_id);
  end if;
  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_strategy_initiatives where company_id = p_company_id);
  end if;

  if to_regclass('public.app_portal_compliance_policies') is not null then
    select count(*)::int into v_compliance_records
    from public.app_portal_compliance_policies cp where cp.company_id = p_company_id;
  end if;

  return jsonb_build_object(
    'team_count', v_team_count,
    'two_fa_count', v_2fa_count,
    'two_fa_eligible', v_2fa_eligible,
    'two_fa_adoption_percent', v_two_fa_percent,
    'packs', v_packs,
    'business_packs', v_packs,
    'integrations', v_integrations,
    'integrations_connected', v_connected,
    'academy_completions', v_academy_completions,
    'academy_certifications', v_academy_certs,
    'academy_assignments_completed', v_academy_assignments_done,
    'academy_assignments_total', v_academy_assignments_total,
    'operations_records', v_operations_records,
    'compliance_records', v_compliance_records
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. APP owner/admin CRM + procurement permissions (directory live reads)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('customers.view', 'View Customers', 'customers', 'Customers — view profiles, contacts, and relationships'),
  ('customers.manage', 'Manage Customers', 'customers', 'Customers — create, update, assign, and manage leads'),
  ('procurement.view', 'View Procurement', 'procurement', 'Procurement — view requests, vendors, contracts, and orders'),
  ('procurement.manage', 'Manage Procurement', 'procurement', 'Procurement — create, approve, and manage purchasing operations')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (
  select role, key from (values
    ('owner', 'customers.view'),
    ('owner', 'customers.manage'),
    ('owner', 'procurement.view'),
    ('owner', 'procurement.manage'),
    ('administrator', 'customers.view'),
    ('administrator', 'customers.manage'),
    ('administrator', 'procurement.view'),
    ('administrator', 'procurement.manage'),
    ('manager', 'customers.view'),
    ('manager', 'procurement.view'),
    ('viewer', 'customers.view'),
    ('viewer', 'procurement.view')
  ) as t(role, key)
) as v
where not exists (
  select 1
  from public.organization_role_permissions rp
  where rp.organization_id = o.id
    and rp.role = v.role
    and rp.permission_key = v.key
);

-- Enable customers + procurement modules where marketplace definitions exist.
insert into public.organization_modules (organization_id, module_key, status, activated_at)
select o.id, v.module_key, 'active', now()
from public.organizations o
cross join (values ('customers'), ('procurement')) as v(module_key)
where exists (
  select 1 from public.marketplace_modules mm where mm.module_key = v.module_key
)
and not exists (
  select 1
  from public.organization_modules om
  where om.organization_id = o.id
    and om.module_key = v.module_key
);

update public.organization_modules om
set status = 'active',
    activated_at = coalesce(om.activated_at, now()),
    updated_at = now()
where om.module_key in ('customers', 'procurement')
  and om.status not in ('active', 'beta');

-- ---------------------------------------------------------------------------
-- 3. Extend sync_app_organization_access for new organizations
-- ---------------------------------------------------------------------------
create or replace function public.sync_app_organization_access(p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_module_key text;
begin
  if p_organization_id is null then return; end if;

  perform public._irp_seed_role_permissions(p_organization_id);

  insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
  select v.key, v.label, v.module_key, v.description
  from (values
    ('notifications.view', 'View Notifications', 'notification_communication', 'View organization notification center'),
    ('notifications.manage', 'Manage Notifications', 'notification_communication', 'Manage notification delivery preferences'),
    ('self_support.view', 'View Self Support', null, 'Access APP self-support areas'),
    ('success.view', 'View Customer Success', null, 'Access customer success center'),
    ('executive.view', 'View Executive Center', null, 'Access executive command center'),
    ('customers.view', 'View Customers', 'customers', 'Customers — view profiles, contacts, and relationships'),
    ('customers.manage', 'Manage Customers', 'customers', 'Customers — create, update, assign, and manage leads'),
    ('procurement.view', 'View Procurement', 'procurement', 'Procurement — view requests, vendors, contracts, and orders'),
    ('procurement.manage', 'Manage Procurement', 'procurement', 'Procurement — create, approve, and manage purchasing operations')
  ) as v(key, label, module_key, description)
  where not exists (
    select 1 from public.aipify_permissions p where p.permission_key = v.key
  );

  insert into public.organization_role_permissions (organization_id, role, permission_key)
  select p_organization_id, v.role, v.key
  from (values
    ('owner', 'notifications.view'),
    ('owner', 'notifications.manage'),
    ('owner', 'self_support.view'),
    ('owner', 'success.view'),
    ('owner', 'executive.view'),
    ('owner', 'customers.view'),
    ('owner', 'customers.manage'),
    ('owner', 'procurement.view'),
    ('owner', 'procurement.manage'),
    ('administrator', 'notifications.view'),
    ('administrator', 'notifications.manage'),
    ('administrator', 'self_support.view'),
    ('administrator', 'success.view'),
    ('administrator', 'executive.view'),
    ('administrator', 'customers.view'),
    ('administrator', 'customers.manage'),
    ('administrator', 'procurement.view'),
    ('administrator', 'procurement.manage'),
    ('manager', 'notifications.view'),
    ('manager', 'self_support.view'),
    ('manager', 'success.view'),
    ('manager', 'executive.view'),
    ('manager', 'customers.view'),
    ('manager', 'procurement.view'),
    ('support_agent', 'notifications.view'),
    ('support_agent', 'self_support.view'),
    ('support_agent', 'success.view'),
    ('viewer', 'notifications.view'),
    ('viewer', 'self_support.view'),
    ('viewer', 'success.view'),
    ('viewer', 'executive.view'),
    ('viewer', 'customers.view'),
    ('viewer', 'procurement.view')
  ) as v(role, key)
  on conflict (organization_id, role, permission_key) do nothing;

  foreach v_module_key in array array[
    'notification_communication',
    'support_ai',
    'operations_center',
    'strategic_intelligence',
    'customers',
    'procurement'
  ] loop
    if exists (
      select 1 from public.marketplace_modules mm where mm.module_key = v_module_key
    ) and not exists (
      select 1 from public.organization_modules om
      where om.organization_id = p_organization_id
        and om.module_key = v_module_key
    ) then
      insert into public.organization_modules (
        organization_id,
        module_key,
        status,
        activated_at
      ) values (
        p_organization_id,
        v_module_key,
        'active',
        now()
      );
    elsif exists (
      select 1 from public.organization_modules om
      where om.organization_id = p_organization_id
        and om.module_key = v_module_key
        and om.status not in ('active', 'beta')
    ) then
      update public.organization_modules
      set status = 'active',
          activated_at = coalesce(activated_at, now()),
          updated_at = now()
      where organization_id = p_organization_id
        and module_key = v_module_key;
    end if;
  end loop;

  if exists (select 1 from pg_proc where proname = '_ls510_ensure_state') then
    perform public._ls510_ensure_state(p_organization_id);
    perform public._ls510_sync_from_subscription(p_organization_id);
  end if;

  if exists (select 1 from pg_proc where proname = '_ecc590_seed') then
    perform public._ecc590_seed(p_organization_id);
  end if;
end;
$$;

revoke all on function public.sync_app_organization_access(uuid) from public, anon, authenticated;
