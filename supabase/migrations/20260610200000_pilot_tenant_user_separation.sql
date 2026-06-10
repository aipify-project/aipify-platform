-- Link new auth users to existing tenants via company_slug metadata.
-- Seeds a dedicated customer login for the pilot tenant (owner role).

create or replace function public.resolve_tenant_company(
  p_company_slug text,
  p_company_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_company_name text;
  v_slug text;
  v_base_slug text;
  v_suffix int := 0;
begin
  if coalesce(p_company_slug, '') <> '' then
    select id
    into v_company_id
    from public.companies
    where slug = p_company_slug
    limit 1;

    if v_company_id is null then
      raise exception 'Tenant company not found for slug: %', p_company_slug;
    end if;

    return v_company_id;
  end if;

  v_company_name := coalesce(nullif(trim(p_company_name), ''), 'My Company');
  v_base_slug := public.slugify_company_name(v_company_name);
  v_slug := v_base_slug;

  while exists (select 1 from public.companies where slug = v_slug) loop
    v_suffix := v_suffix + 1;
    v_slug := v_base_slug || '-' || v_suffix;
  end loop;

  insert into public.companies (name, slug)
  values (v_company_name, v_slug)
  returning id into v_company_id;

  return v_company_id;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_company_name text;
  v_company_slug text;
  v_full_name text;
begin
  v_full_name := coalesce(new.raw_user_meta_data ->> 'full_name', '');
  v_company_name := coalesce(new.raw_user_meta_data ->> 'company_name', '');
  v_company_slug := coalesce(new.raw_user_meta_data ->> 'company_slug', '');

  if v_full_name = '' then
    v_full_name := split_part(new.email, '@', 1);
  end if;

  v_company_id := public.resolve_tenant_company(v_company_slug, v_company_name);

  insert into public.users (auth_user_id, company_id, full_name, role)
  values (new.id, v_company_id, v_full_name, 'owner');

  return new;
end;
$$;

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
  v_company_slug text;
  v_full_name text;
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
  v_company_slug := coalesce(v_auth_user.raw_user_meta_data ->> 'company_slug', '');

  if v_full_name = '' then
    v_full_name := split_part(v_auth_user.email, '@', 1);
  end if;

  v_company_id := public.resolve_tenant_company(v_company_slug, v_company_name);

  insert into public.users (auth_user_id, company_id, full_name, role)
  values (v_auth_user.id, v_company_id, v_full_name, 'owner');
end;
$$;

create or replace function public.seed_pilot_tenant_user()
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
  v_company_id uuid;
  v_email text := 'admin@unonight.com';
  v_password text := 'Unonight2026!Setup';
begin
  select id
  into v_company_id
  from public.companies
  where slug = 'unonight'
    and is_platform = false
  limit 1;

  if v_company_id is null then
    return null;
  end if;

  select id
  into v_user_id
  from auth.users
  where email = v_email
  limit 1;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      extensions.crypt(v_password, extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'full_name', 'Unonight Admin',
        'company_slug', 'unonight'
      ),
      now(),
      now()
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    values (
      v_user_id,
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      v_user_id::text,
      now(),
      now(),
      now()
    );
  end if;

  if not exists (
    select 1
    from public.users
    where auth_user_id = v_user_id
  ) then
    insert into public.users (auth_user_id, company_id, full_name, role)
    values (v_user_id, v_company_id, 'Unonight Admin', 'owner');
  else
    update public.users
    set company_id = v_company_id,
        full_name = 'Unonight Admin',
        role = 'owner'
    where auth_user_id = v_user_id
      and company_id <> v_company_id;
  end if;

  return v_user_id;
end;
$$;

revoke execute on function public.seed_pilot_tenant_user() from public, anon, authenticated;

select public.seed_pilot_tenant_user();
