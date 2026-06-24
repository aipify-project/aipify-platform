-- Align presence tenant resolution with active APP organization context.
-- get_app_organization_context() honors organization_user_context; _presence_tenant_for_auth()
-- previously always returned customers.id, causing preferences/feed to miss the active org.

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
  into v_org_id
  from public.organization_user_context ouc
  where ouc.user_id = v_user.id
    and exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = ouc.organization_id
        and ou.user_id = v_user.id
        and ou.status = 'active'
    );

  return v_org_id;
end;
$$;
