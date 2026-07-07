-- Align organization access approval org resolution with active APP organization context.
-- _oaa_current_org_id() previously always used home customers.id and ignored
-- organization_user_context, while Companion member fetch uses _presence_tenant_for_auth().

create or replace function public._oaa_current_org_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_customer_id uuid;
  v_org_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then
    return null;
  end if;

  select c.id
  into v_customer_id
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.id = v_user_id
  limit 1;

  if v_customer_id is null then
    return null;
  end if;

  v_org_id := v_customer_id;

  select ouc.organization_id
  into v_org_id
  from public.organization_user_context ouc
  where ouc.user_id = v_user_id
    and exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = ouc.organization_id
        and ou.user_id = v_user_id
        and ou.status = 'active'
    );

  return v_org_id;
end;
$$;

drop function if exists public.has_active_organization_provider_scope(text, text);

create or replace function public.has_active_organization_provider_scope(
  p_provider_key text,
  p_scope_key text,
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
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null or p_provider_key is null or p_scope_key is null then
    return false;
  end if;

  if p_organization_id is not null then
    if public._mta_membership_active(p_organization_id, v_user_id) is null then
      return false;
    end if;
    v_org_id := p_organization_id;
  else
    v_org_id := public._oaa_current_org_id();
  end if;

  if v_org_id is null then
    return false;
  end if;

  return exists (
    select 1
    from public.organization_provider_access_grants g
    where g.organization_id = v_org_id
      and g.provider_key = p_provider_key
      and g.active = true
      and (g.expires_at is null or g.expires_at > now())
      and (g.revoked_at is null)
      and exists (
        select 1
        from jsonb_array_elements_text(g.scope_keys) scope_entry(scope_key)
        where scope_entry.scope_key = p_scope_key
      )
  );
end;
$$;

drop function if exists public.has_active_organization_provider_scopes(text, jsonb);

create or replace function public.has_active_organization_provider_scopes(
  p_provider_key text,
  p_scope_keys jsonb,
  p_organization_id uuid default null
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_scope text;
begin
  if p_provider_key is null then
    return false;
  end if;

  if p_scope_keys is null or jsonb_typeof(p_scope_keys) <> 'array' or jsonb_array_length(p_scope_keys) = 0 then
    return false;
  end if;

  for v_scope in
    select jsonb_array_elements_text(p_scope_keys)
  loop
    if not public.has_active_organization_provider_scope(p_provider_key, v_scope, p_organization_id) then
      return false;
    end if;
  end loop;

  return true;
end;
$$;

grant execute on function public.has_active_organization_provider_scope(text, text, uuid) to authenticated;
grant execute on function public.has_active_organization_provider_scopes(text, jsonb, uuid) to authenticated;
