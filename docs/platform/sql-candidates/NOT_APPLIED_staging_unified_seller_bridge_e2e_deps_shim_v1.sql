-- =============================================================================
-- NOT_APPLIED — STAGING-ONLY deps shim for Unified Seller Bridge E2E
-- Target: auedugihkduoaikfusqe ONLY. Never Production (qbcqoixhrvhnuwphefvw).
-- Purpose: Create *missing* helpers so bridge ensure can run on Staging's thinner
--          schema. Never overwrite helpers that already exist, except the bridge
--          dedicated-org provisioner when Staging lacks Production tables.
-- Does NOT create sellers, bridge profiles, or run E2E.
-- =============================================================================
-- Job: AIPIFY_UNIFIED_SELLER_BRIDGE_STAGING_CRM_PERMISSION_FIX / DEPS_SHIM
-- Prerequisite: bridge SQL already APPLIED_VERIFIED on Staging.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Create-if-absent only (no CREATE OR REPLACE for existing real helpers)
-- ---------------------------------------------------------------------------
do $shim$
begin
  if to_regprocedure('public.slugify_company_name(text)') is null then
    execute $fn$
      create function public.slugify_company_name(p_name text)
      returns text
      language sql
      immutable
      set search_path = public
      as $body$
        select trim(both '-' from regexp_replace(lower(coalesce(p_name, 'partner')), '[^a-z0-9]+', '-', 'g'));
      $body$;
    $fn$;
  end if;

  if to_regprocedure('public._awr_unique_slug(text)') is null then
    execute $fn$
      create function public._awr_unique_slug(p_base text)
      returns text
      language plpgsql
      volatile
      security definer
      set search_path = public
      as $body$
      declare
        v_base text := left(coalesce(nullif(public.slugify_company_name(p_base), ''), 'partner'), 48);
        v_slug text := v_base;
        v_i int := 0;
      begin
        while exists (select 1 from public.organizations o where o.slug = v_slug)
           or exists (select 1 from public.companies c where c.slug = v_slug)
        loop
          v_i := v_i + 1;
          v_slug := left(v_base, 40) || '-' || v_i::text;
          if v_i > 50 then
            v_slug := left(v_base, 24) || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
            exit;
          end if;
        end loop;
        return v_slug;
      end;
      $body$;
    $fn$;
  end if;

  if to_regprocedure('public._gp455a_generate_partner_public_id()') is null then
    execute $fn$
      create function public._gp455a_generate_partner_public_id()
      returns text
      language sql
      volatile
      set search_path = public
      as $body$
        select 'partner_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      $body$;
    $fn$;
  end if;

  if to_regprocedure('public._gp455a_slugify_partner_slug(text)') is null then
    execute $fn$
      create function public._gp455a_slugify_partner_slug(p_name text)
      returns text
      language sql
      immutable
      set search_path = public
      as $body$
        select left(public.slugify_company_name(p_name), 48);
      $body$;
    $fn$;
  end if;

  if to_regprocedure('public.provision_growth_partner_tracking_link(uuid)') is null then
    execute $fn$
      create function public.provision_growth_partner_tracking_link(p_profile_id uuid)
      returns jsonb
      language plpgsql
      security definer
      set search_path = public
      as $body$
      declare
        v_profile public.growth_partner_app_profiles%rowtype;
        v_partner_id text;
        v_slug text;
        v_suffix text;
        v_link_id uuid;
        v_url text;
      begin
        select * into v_profile from public.growth_partner_app_profiles where id = p_profile_id;
        if v_profile.id is null then
          raise exception 'Growth Partner profile not found';
        end if;

        if v_profile.partner_public_id is not null and v_profile.primary_link_slug is not null then
          select id into v_link_id
          from public.growth_partner_tracking_links
          where profile_id = p_profile_id and is_primary = true
          limit 1;
          v_url := public._gp455a_build_partner_url(v_profile.primary_link_slug);
          return jsonb_build_object(
            'ok', true,
            'profile_id', p_profile_id,
            'partner_public_id', v_profile.partner_public_id,
            'slug', v_profile.primary_link_slug,
            'link_id', v_link_id,
            'partner_url', v_url,
            'staging_shim', true
          );
        end if;

        v_partner_id := public._gp455a_generate_partner_public_id();
        v_slug := public._gp455a_slugify_partner_slug(v_profile.full_name);
        v_suffix := substr(replace(v_partner_id, 'partner_', ''), 1, 4);
        if exists (select 1 from public.growth_partner_tracking_links where slug = v_slug) then
          v_slug := v_slug || '-' || v_suffix;
        end if;

        update public.growth_partner_app_profiles
        set partner_public_id = v_partner_id,
            primary_link_slug = v_slug,
            updated_at = now()
        where id = p_profile_id;

        insert into public.growth_partner_tracking_links (profile_id, partner_public_id, slug, link_status, is_primary)
        values (p_profile_id, v_partner_id, v_slug, 'active', true)
        returning id into v_link_id;

        v_url := public._gp455a_build_partner_url(v_slug);
        perform public._gp455a_log_link(
          p_profile_id,
          'link_provisioned',
          'Staging shim provisioned Growth Partner tracking link.',
          jsonb_build_object('partner_public_id', v_partner_id, 'slug', v_slug, 'partner_url', v_url)
        );

        return jsonb_build_object(
          'ok', true,
          'profile_id', p_profile_id,
          'partner_public_id', v_partner_id,
          'slug', v_slug,
          'link_id', v_link_id,
          'partner_url', v_url,
          'staging_shim', true
        );
      end;
      $body$;
    $fn$;
    revoke all on function public.provision_growth_partner_tracking_link(uuid) from public, anon;
    grant execute on function public.provision_growth_partner_tracking_link(uuid) to authenticated;
    execute $c$
      comment on function public.provision_growth_partner_tracking_link(uuid) is
        'STAGING SHIM (create-if-absent) for Unified Seller Bridge E2E — not for Production apply.';
    $c$;
  end if;

  if to_regprocedure('public._gp455_seed_training(uuid)') is null then
    execute $fn$
      create function public._gp455_seed_training(p_profile_id uuid)
      returns void
      language plpgsql
      security definer
      set search_path = public
      as $body$
      begin
        return;
      end;
      $body$;
    $fn$;
  end if;

  -- STAGING CRM fix: always install minimal seed (replaces prior no-op stub).
  -- Grants ONLY growth_partner.view to role growth_partner for the dedicated org.
  execute $fn$
    create or replace function public._gp455_seed_role_permissions(p_org_id uuid)
    returns void
    language plpgsql
    security definer
    set search_path = public
    as $body$
    begin
      if p_org_id is null then
        return;
      end if;
      insert into public.organization_role_permissions (organization_id, role, permission_key)
      values (p_org_id, 'growth_partner', 'growth_partner.view')
      on conflict (organization_id, role, permission_key) do nothing;
    end;
    $body$;
  $fn$;
  execute $c$
    comment on function public._gp455_seed_role_permissions(uuid) is
      'STAGING SHIM — grants only growth_partner.view to role growth_partner for p_org_id. Not Production seed.';
  $c$;

  if to_regprocedure('public._mta_sync_organization_from_customer(uuid)') is null then
    execute $fn$
      create function public._mta_sync_organization_from_customer(p_customer_id uuid)
      returns void
      language plpgsql
      security definer
      set search_path = public
      as $body$
      begin
        return;
      end;
      $body$;
    $fn$;
  end if;

  if to_regprocedure('public._mta_seed_organization_modules(uuid)') is null then
    execute $fn$
      create function public._mta_seed_organization_modules(p_org_id uuid)
      returns void
      language plpgsql
      security definer
      set search_path = public
      as $body$
      begin
        return;
      end;
      $body$;
    $fn$;
  end if;

  if to_regprocedure('public._mta_seed_organization_settings(uuid)') is null then
    execute $fn$
      create function public._mta_seed_organization_settings(p_org_id uuid)
      returns void
      language plpgsql
      security definer
      set search_path = public
      as $body$
      begin
        return;
      end;
      $body$;
    $fn$;
  end if;

  -- Staging lacks Production tenant tables; bridge-applied Production-shaped
  -- _usb_provision_dedicated_gp_org_for_auth cannot succeed. Replace only then.
  -- Never replace when aipify_tenant_profiles exists (real helper path).
  if to_regclass('public.aipify_tenant_profiles') is null
     and to_regprocedure(
       'public._usb_provision_dedicated_gp_org_for_auth(uuid,uuid,text,text,text,text,text,text,text,text,text,text)'
     ) is not null
  then
    execute $fn$
      create or replace function public._usb_provision_dedicated_gp_org_for_auth(
        p_auth_user_id uuid,
        p_csp_partner_id uuid,
        p_full_name text,
        p_company text,
        p_reg text,
        p_country text,
        p_address text,
        p_phone_cc text,
        p_phone_num text,
        p_email text,
        p_partner_status text,
        p_source text
      )
      returns jsonb
      language plpgsql
      volatile
      security definer
      set search_path = public
      as $body$
      declare
        v_user_id uuid;
        v_gp_company_id uuid;
        v_customer_id uuid := gen_random_uuid();
        v_org_id uuid := v_customer_id;
        v_slug text;
      begin
        if p_auth_user_id is null then
          return jsonb_build_object('ok', false, 'error', 'auth_user_required');
        end if;

        -- Refuse attaching to any pre-existing users row (no APP conversion).
        if exists (select 1 from public.users u where u.auth_user_id = p_auth_user_id) then
          return jsonb_build_object(
            'ok', false,
            'error', 'existing_app_user',
            'detail', 'Staging E2E shim refuses reuse of existing public.users identities.'
          );
        end if;

        v_slug := public._awr_unique_slug(public.slugify_company_name(p_company) || '-gp');

        insert into public.companies (name, slug, is_platform)
        values (p_company, v_slug, false)
        returning id into v_gp_company_id;

        insert into public.users (auth_user_id, company_id, full_name, role)
        values (p_auth_user_id, v_gp_company_id, p_full_name, 'owner')
        returning id into v_user_id;

        insert into public.customers (id, company_id, full_name, phone)
        values (
          v_customer_id,
          v_gp_company_id,
          p_full_name,
          coalesce(p_phone_cc, '+47') || ' ' || coalesce(p_phone_num, '00000000')
        );

        -- Staging organizations_subscription_plan_check has no growth_partner.
        insert into public.organizations (
          id, name, slug, status, subscription_plan, default_language, fallback_language, timezone
        ) values (
          v_org_id, p_company, v_slug, 'active', 'internal', 'en', 'en', 'Europe/Oslo'
        );

        perform public._mta_seed_organization_modules(v_org_id);
        perform public._mta_seed_organization_settings(v_org_id);
        perform public._gp455_seed_role_permissions(v_org_id);

        insert into public.organization_users (organization_id, user_id, role, status, joined_at)
        values (v_org_id, v_user_id, 'growth_partner', 'active', now())
        on conflict (organization_id, user_id) do update set
          role = 'growth_partner',
          status = 'active',
          updated_at = now();

        return jsonb_build_object(
          'ok', true,
          'user_id', v_user_id,
          'organization_id', v_org_id,
          'company_id', v_gp_company_id,
          'customer_id', v_customer_id,
          'dedicated', true,
          'staging_shim', true,
          'source', p_source,
          'csp_partner_id', p_csp_partner_id,
          'partner_status', p_partner_status,
          'reg', p_reg,
          'country', p_country,
          'address', p_address,
          'email', p_email
        );
      end;
      $body$;
    $fn$;

    revoke all on function public._usb_provision_dedicated_gp_org_for_auth(
      uuid, uuid, text, text, text, text, text, text, text, text, text, text
    ) from public, anon, authenticated, service_role;

    execute $c$
      comment on function public._usb_provision_dedicated_gp_org_for_auth(
        uuid, uuid, text, text, text, text, text, text, text, text, text, text
      ) is
        'STAGING OVERRIDE — replaces Production-shaped bridge body only when aipify_tenant_profiles is absent. Creates dedicated rows only; refuses existing public.users.';
    $c$;
  end if;
end;
$shim$;
