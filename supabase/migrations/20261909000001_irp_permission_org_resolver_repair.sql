-- Align IRP permission checks with has_organization_permission org resolution (P1.01 live reads).

create or replace function public._irp_has_permission(
  p_permission_key text,
  p_organization_id uuid default null
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_membership public.organization_users;
  v_override boolean;
  v_module_key text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then return false; end if;
  if not public._irp_user_account_ok(v_user_id) then return false; end if;

  if p_organization_id is not null then
    v_org_id := p_organization_id;
  else
    select c.id
    into v_org_id
    from public.users u
    join public.customers c on c.company_id = u.company_id
    where u.id = v_user_id
    limit 1;

    if v_org_id is null then
      select ouc.organization_id
      into v_org_id
      from public.organization_user_context ouc
      where ouc.user_id = v_user_id;
    end if;

    if v_org_id is null then
      select ou.organization_id
      into v_org_id
      from public.organization_users ou
      where ou.user_id = v_user_id
        and ou.status = 'active'
      order by ou.joined_at nulls last, ou.created_at
      limit 1;
    end if;
  end if;

  if v_org_id is null then return false; end if;

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then return false; end if;

  select granted into v_override
  from public.organization_user_permissions
  where organization_id = v_org_id
    and user_id = v_user_id
    and permission_key = p_permission_key;
  if found then return v_override; end if;

  if not exists (
    select 1
    from public.organization_role_permissions rp
    where rp.organization_id = v_org_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  ) then
    return false;
  end if;

  select module_key into v_module_key
  from public.aipify_permissions
  where permission_key = p_permission_key;

  if v_module_key is not null and exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
  ) and not exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
      and m.status in ('active', 'beta')
  ) then
    return false;
  end if;

  return true;
exception when others then
  return false;
end;
$$;

-- Seed CRM/procurement modules for APP directory providers when registry helpers exist.
do $$
begin
  if exists (select 1 from pg_proc where proname = '_mre501_seed_module') then
    perform public._mre501_seed_module(
      'customers', 'Customers', 'customers', 'operations',
      'Customer, contact, and relationship management for the organization.',
      'starter', null, 'operations', '/app/customers', 'licensed', 5
    );
    perform public._mre501_seed_module(
      'procurement', 'Procurement', 'procurement', 'operations',
      'Purchase requests, vendor operations, contracts, orders, and delivery tracking.',
      'starter', null, 'operations', '/app/procurement', 'licensed', 9
    );
  end if;
exception when others then null;
end $$;

insert into public.marketplace_modules (module_key, module_name, category, description, status)
select v.module_key, v.module_name, v.category, v.description, 'active'
from (values
  ('customers', 'Customers', 'operations', 'Customer relationship management'),
  ('procurement', 'Procurement', 'operations', 'Procurement and supplier operations')
) as v(module_key, module_name, category, description)
where to_regclass('public.marketplace_modules') is not null
  and not exists (
    select 1 from public.marketplace_modules mm where mm.module_key = v.module_key
  );

insert into public.organization_modules (organization_id, module_key, status, activated_at)
select o.id, v.module_key, 'active', now()
from public.organizations o
cross join (values ('customers'), ('procurement')) as v(module_key)
where to_regclass('public.organization_modules') is not null
  and exists (select 1 from public.marketplace_modules mm where mm.module_key = v.module_key)
  and not exists (
    select 1 from public.organization_modules om
    where om.organization_id = o.id and om.module_key = v.module_key
  );

update public.organization_modules
set status = 'active',
    activated_at = coalesce(activated_at, now()),
    updated_at = now()
where module_key in ('customers', 'procurement')
  and status not in ('active', 'beta');

-- Center RPCs perform settings seed + audit inserts; must not be STABLE/read-only.
do $$
begin
  if to_regprocedure('public.get_customer_relationship_center(text)') is not null then
    alter function public.get_customer_relationship_center(text) volatile;
  end if;
  if to_regprocedure('public.get_lead_management_center()') is not null then
    alter function public.get_lead_management_center() volatile;
  end if;
  if to_regprocedure('public.get_procurement_operations_center(text)') is not null then
    alter function public.get_procurement_operations_center(text) volatile;
  end if;
end $$;
