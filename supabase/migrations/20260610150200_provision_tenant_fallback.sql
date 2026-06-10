create or replace function public.provision_tenant_for_auth_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auth_user auth.users%rowtype;
  v_company_id uuid;
  v_company_name text;
  v_full_name text;
  v_slug text;
  v_base_slug text;
  v_suffix int := 0;
begin
  if auth.uid() is null then
    return;
  end if;

  select *
  into v_auth_user
  from auth.users
  where id = auth.uid();

  if not found then
    return;
  end if;

  if exists (
    select 1
    from public.users
    where auth_user_id = v_auth_user.id
  ) then
    return;
  end if;

  v_full_name := coalesce(v_auth_user.raw_user_meta_data ->> 'full_name', '');
  v_company_name := coalesce(v_auth_user.raw_user_meta_data ->> 'company_name', '');

  if v_company_name = '' then
    v_company_name := 'My Company';
  end if;

  if v_full_name = '' then
    v_full_name := split_part(v_auth_user.email, '@', 1);
  end if;

  v_base_slug := public.slugify_company_name(v_company_name);
  v_slug := v_base_slug;

  while exists (select 1 from public.companies where slug = v_slug) loop
    v_suffix := v_suffix + 1;
    v_slug := v_base_slug || '-' || v_suffix;
  end loop;

  insert into public.companies (name, slug)
  values (v_company_name, v_slug)
  returning id into v_company_id;

  insert into public.users (auth_user_id, company_id, full_name, role)
  values (v_auth_user.id, v_company_id, v_full_name, 'owner');
end;
$$;

revoke execute on function public.provision_tenant_for_auth_user() from public, anon;
grant execute on function public.provision_tenant_for_auth_user() to authenticated;
