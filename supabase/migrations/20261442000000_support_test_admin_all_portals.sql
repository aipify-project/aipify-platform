-- TEST ONLY — grant support@aipify.ai access to Customer, Platform Admin, and Super Admin portals.
-- Remove or disable before production hardening.

create or replace function public.seed_support_test_admin()
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
  v_company_id uuid;
  v_email text := 'support@aipify.ai';
  v_password text := 'AipifySupport2026!Test';
  v_full_name text := 'Aipify Support';
begin
  select id
  into v_company_id
  from public.companies
  where slug in ('aipify', 'aipify-ai')
    and coalesce(is_platform, false) = true
  order by created_at
  limit 1;

  if v_company_id is null then
    insert into public.companies (name, slug, is_platform)
    values ('Aipify Group AS', 'aipify', true)
    on conflict (slug) do update
      set name = excluded.name,
          is_platform = true
    returning id into v_company_id;
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
        'full_name', v_full_name,
        'company_slug', 'aipify'
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

  insert into public.platform_admins (auth_user_id, role)
  values (v_user_id, 'super_admin')
  on conflict (auth_user_id) do update
    set role = excluded.role;

  insert into public.users (auth_user_id, company_id, full_name, role)
  values (v_user_id, v_company_id, v_full_name, 'owner')
  on conflict (auth_user_id) do update
    set company_id = excluded.company_id,
        full_name = excluded.full_name,
        role = excluded.role;

  return v_user_id;
end;
$$;

revoke execute on function public.seed_support_test_admin() from public, anon, authenticated;

select public.seed_support_test_admin();

comment on function public.seed_support_test_admin() is
  'TEST ONLY: provisions support@aipify.ai with super_admin + customer owner on Aipify Group. Disable before production.';
