-- Fix _presence_tenant_for_auth(): preserve customer fallback when organization_user_context has no row.
-- SELECT INTO v_org_id directly was nulling the fallback and returning has_customer:false for active APP orgs.

create or replace function public._presence_tenant_for_auth()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_customer_id uuid;
  v_org_id uuid;
  v_context_org_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.* into v_user
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user.id is null then
    return null;
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_user.company_id
  limit 1;

  if v_customer_id is null then
    return null;
  end if;

  v_org_id := v_customer_id;

  select ouc.organization_id
  into v_context_org_id
  from public.organization_user_context ouc
  where ouc.user_id = v_user.id
    and exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = ouc.organization_id
        and ou.user_id = v_user.id
        and ou.status = 'active'
    )
  limit 1;

  if v_context_org_id is not null then
    v_org_id := v_context_org_id;
  end if;

  return v_org_id;
end;
$$;
