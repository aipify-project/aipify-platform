-- Repair Unonight pilot APP context: license state, employee seat, business packs, entitlements.
-- Idempotent — safe to re-run for pilot tenant only (slug: unonight).

create or replace function public.repair_unonight_pilot_app_context()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_org_id uuid;
  v_customer_id uuid;
  v_user_id uuid;
  v_ou_id uuid;
  v_pack_id uuid;
  v_pack_key text;
  v_item_id uuid;
  v_item_key text;
  v_module_key text;
  v_pack_keys text[] := array['general_business', 'support_operations', 'hospitality'];
  v_item_keys text[] := array[
    'aipify.support_starter_pack',
    'aipify.executive_briefing_pack',
    'aipify.governance_starter_pack'
  ];
  v_module_keys text[] := array[
    'self_support',
    'customer_success',
    'companion',
    'command_center',
    'license_center'
  ];
begin
  select co.id, c.id, o.id
  into v_company_id, v_customer_id, v_org_id
  from public.companies co
  join public.customers c on c.company_id = co.id
  join public.organizations o on o.id = c.id
  where co.slug = 'unonight'
    and co.is_platform = false
  limit 1;

  if v_org_id is null then
    return jsonb_build_object('ok', false, 'reason', 'unonight_not_found');
  end if;

  perform public._mta_sync_organization_from_customer(v_customer_id);
  perform public._mta_backfill_memberships(v_customer_id);

  if exists (select 1 from pg_proc where proname = '_ls510_ensure_state') then
    perform public._ls510_ensure_state(v_org_id);
    perform public._ls510_sync_from_subscription(v_org_id);
  end if;

  select u.id, ou.id
  into v_user_id, v_ou_id
  from public.users u
  join auth.users au on au.id = u.auth_user_id
  join public.organization_users ou
    on ou.user_id = u.id
   and ou.organization_id = v_org_id
   and ou.status = 'active'
  where lower(au.email) = lower('admin@unonight.com')
  limit 1;

  if v_user_id is not null then
    update public.users
    set company_id = v_company_id,
        role = 'owner',
        status = coalesce(status, 'active')
    where id = v_user_id;

    update public.organization_users
    set role = 'owner',
        status = 'active',
        updated_at = now()
    where id = v_ou_id;

    insert into public.organization_user_context (user_id, organization_id, updated_at)
    values (v_user_id, v_org_id, now())
    on conflict (user_id) do update
      set organization_id = excluded.organization_id,
          updated_at = now();

    if not exists (
      select 1
      from public.organization_employee_profiles ep
      where ep.organization_id = v_org_id
        and ep.organization_user_id = v_ou_id
    ) then
      insert into public.organization_employee_profiles (
        organization_id,
        organization_user_id,
        full_name,
        email,
        org_role,
        employee_status,
        start_date,
        employee_number
      )
      select
        v_org_id,
        v_ou_id,
        coalesce(u.full_name, 'Unonight Admin'),
        au.email,
        'owner',
        'active',
        current_date,
        'UNO-001'
      from public.users u
      join auth.users au on au.id = u.auth_user_id
      where u.id = v_user_id;
    else
      update public.organization_employee_profiles ep
      set employee_status = 'active',
          org_role = 'owner',
          email = coalesce(ep.email, (select au.email from auth.users au join public.users u on u.auth_user_id = au.id where u.id = v_user_id)),
          updated_at = now()
      where ep.organization_id = v_org_id
        and ep.organization_user_id = v_ou_id;
    end if;
  end if;

  foreach v_pack_key in array v_pack_keys loop
    select id into v_pack_id
    from public.business_packs
    where pack_key = v_pack_key
    limit 1;

    if v_pack_id is not null
       and not exists (
         select 1
         from public.organization_business_packs obp
         where obp.organization_id = v_org_id
           and obp.business_pack_id = v_pack_id
       ) then
      insert into public.organization_business_packs (
        organization_id,
        business_pack_id,
        activated_at
      ) values (
        v_org_id,
        v_pack_id,
        now()
      );
    end if;

    if exists (select 1 from pg_proc where proname = 'activate_business_pack_modules') then
      begin
        perform public.activate_business_pack_modules(v_customer_id, v_pack_key);
      exception
        when others then null;
      end;
    end if;
  end loop;

  foreach v_module_key in array v_module_keys loop
    insert into public.tenant_modules (
      tenant_id,
      module_key,
      enabled,
      licensed,
      status,
      enabled_at
    ) values (
      v_customer_id,
      v_module_key,
      true,
      true,
      'enabled',
      now()
    )
    on conflict (tenant_id, module_key) do update set
      enabled = true,
      licensed = true,
      status = 'enabled',
      enabled_at = coalesce(public.tenant_modules.enabled_at, excluded.enabled_at),
      updated_at = now();
  end loop;

  if exists (select 1 from pg_proc where proname = '_mkp_seed_catalog') then
    perform public._mkp_seed_catalog();
  end if;

  foreach v_item_key in array v_item_keys loop
    select id into v_item_id
    from public.marketplace_items
    where item_key = v_item_key
      and status = 'published'
    limit 1;

    if v_item_id is not null then
      insert into public.marketplace_entitlements (
        tenant_id,
        item_id,
        entitlement_type,
        starts_at
      ) values (
        v_customer_id,
        v_item_id,
        'active',
        now()
      )
      on conflict (tenant_id, item_id) do update set
        entitlement_type = 'active',
        updated_at = now();
    end if;
  end loop;

  return jsonb_build_object(
    'ok', true,
    'organization_id', v_org_id,
    'customer_id', v_customer_id,
    'user_id', v_user_id,
    'business_packs', (
      select count(*) from public.organization_business_packs where organization_id = v_org_id
    ),
    'entitlements', (
      select count(*) from public.marketplace_entitlements where tenant_id = v_customer_id
    ),
    'tenant_modules', (
      select count(*) from public.tenant_modules where tenant_id = v_customer_id and enabled = true
    ),
    'employee_profile', exists (
      select 1
      from public.organization_employee_profiles ep
      where ep.organization_id = v_org_id
        and ep.organization_user_id = v_ou_id
        and ep.employee_status = 'active'
    ),
    'app_license_state', exists (
      select 1 from public.organization_app_license_state where organization_id = v_org_id
    )
  );
end;
$$;

revoke all on function public.repair_unonight_pilot_app_context() from public, anon, authenticated;

select public.repair_unonight_pilot_app_context();
