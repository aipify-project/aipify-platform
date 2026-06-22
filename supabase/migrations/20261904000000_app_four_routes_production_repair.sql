-- APP four routes production repair — store catalog empty state, success.view alignment, feature access stability.

-- ---------------------------------------------------------------------------
-- 1. Permissions — never gate success/health on inactive module registry rows
-- ---------------------------------------------------------------------------
update public.aipify_permissions
set module_key = null
where permission_key in ('success.view', 'customer_health.view', 'customer_health.manage')
  and module_key is not null;

-- ---------------------------------------------------------------------------
-- 2. Business Pack marketplace view — avoid legacy IRP throws
-- ---------------------------------------------------------------------------
create or replace function public._bpmke_require_view()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_platform_admin() then
    return;
  end if;
  if public.has_organization_permission('business_pack_marketplace.view') then
    return;
  end if;
  if public.has_organization_permission('business_packs.view') then
    return;
  end if;
  raise exception 'Permission denied: business_pack_marketplace.view';
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. App Store home — never 500; return professional empty catalog
-- ---------------------------------------------------------------------------
create or replace function public.get_app_store_home(p_locale text default 'en')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_all_cards jsonb := '[]'::jsonb;
  v_pack record;
  v_card jsonb;
  v_recommended jsonb := '[]'::jsonb;
  v_installed jsonb := '[]'::jsonb;
  v_popular jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
  v_marketplace jsonb := '[]'::jsonb;
  v_my_licenses jsonb := '[]'::jsonb;
  v_rec_key text;
  v_catalog_ready boolean := false;
  v_locale text := coalesce(nullif(trim(p_locale), ''), 'en');
begin
  begin
    perform public._bpmke_require_view();
    v_tenant_id := public._bpmke_require_tenant();
  exception
    when others then
      if sqlerrm ilike '%permission denied%' then
        raise;
      end if;
      return jsonb_build_object(
        'found', true,
        'catalog_pending', true,
        'principle', coalesce(public._as502_principle(), 'Business Packs extend Aipify where your organization needs them.'),
        'locale', v_locale,
        'categories', coalesce(public._as502_categories(), '[]'::jsonb),
        'seat_tiers', coalesce(public._as502_seat_tiers(), '[]'::jsonb),
        'installation_flow', coalesce(public._as502_install_flow(), '[]'::jsonb),
        'sections', jsonb_build_object(
          'installed', '[]'::jsonb,
          'marketplace', '[]'::jsonb,
          'recommended', '[]'::jsonb,
          'popular', '[]'::jsonb,
          'recently_added', '[]'::jsonb,
          'my_licenses', '[]'::jsonb
        ),
        'governance_note', 'Business Pack listings will appear here as they are published for your organization.',
        'module_access_route', '/app/settings/module-access',
        'licenses_route', '/app/licenses'
      );
  end;

  v_catalog_ready := to_regclass('public.business_pack_marketplace_listings') is not null
    and to_regclass('public.business_pack_identity') is not null
    and to_regprocedure('public._as502_pack_card(uuid, text)') is not null;

  if not v_catalog_ready then
    return jsonb_build_object(
      'found', true,
      'catalog_pending', true,
      'principle', coalesce(public._as502_principle(), 'Business Packs extend Aipify where your organization needs them.'),
      'locale', v_locale,
      'categories', coalesce(public._as502_categories(), '[]'::jsonb),
      'seat_tiers', coalesce(public._as502_seat_tiers(), '[]'::jsonb),
      'installation_flow', coalesce(public._as502_install_flow(), '[]'::jsonb),
      'sections', jsonb_build_object(
        'installed', '[]'::jsonb,
        'marketplace', '[]'::jsonb,
        'recommended', '[]'::jsonb,
        'popular', '[]'::jsonb,
        'recently_added', '[]'::jsonb,
        'my_licenses', '[]'::jsonb
      ),
      'governance_note', 'Business Pack listings will appear here as they are published for your organization.',
      'module_access_route', '/app/settings/module-access',
      'licenses_route', '/app/licenses'
    );
  end if;

  begin
    perform public._bpmke_seed_listings();
  exception when others then
    null;
  end;

  for v_pack in
    select l.pack_key
    from public.business_pack_marketplace_listings l
    join public.business_pack_identity i on i.pack_key = l.pack_key
    where l.marketplace_visibility = 'published'
    order by l.popular_rank, i.pack_name
  loop
    begin
      v_card := public._as502_pack_card(v_tenant_id, v_pack.pack_key);
      if v_card is not null then
        v_all_cards := v_all_cards || jsonb_build_array(v_card);
      end if;
    exception when others then
      continue;
    end;
  end loop;

  if to_regprocedure('public._as502_recommendations(uuid)') is not null then
    for v_rec_key in
      select jsonb_array_elements_text(public._as502_recommendations(v_tenant_id))
    loop
      begin
        v_card := public._as502_pack_card(v_tenant_id, v_rec_key);
        if v_card is not null and coalesce((v_card->>'installed')::boolean, false) = false then
          v_recommended := v_recommended || jsonb_build_array(v_card);
        end if;
      exception when others then
        continue;
      end;
    end loop;
  end if;

  select coalesce(jsonb_agg(c), '[]'::jsonb)
  into v_installed
  from jsonb_array_elements(v_all_cards) c
  where (c->>'installed')::boolean = true;

  select coalesce(jsonb_agg(card order by rank), '[]'::jsonb)
  into v_popular
  from (
    select public._as502_pack_card(v_tenant_id, l.pack_key) as card, l.popular_rank as rank
    from public.business_pack_marketplace_listings l
    where l.marketplace_visibility = 'published'
    order by l.popular_rank
    limit 8
  ) t
  where card is not null;

  select coalesce(
    jsonb_agg(public._as502_pack_card(v_tenant_id, l.pack_key) order by l.recently_added_at desc),
    '[]'::jsonb
  )
  into v_recent
  from public.business_pack_marketplace_listings l
  where l.marketplace_visibility = 'published'
  limit 8;

  v_marketplace := v_all_cards;

  if to_regclass('public.business_pack_license_tenant_state') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'pack_key', s.pack_key,
      'tier_key', s.tier_key,
      'capacity_limit', s.capacity_limit,
      'license_status', s.license_status,
      'renewal_date', s.renewal_date,
      'usage_count', s.usage_count,
      'card', public._as502_pack_card(v_tenant_id, s.pack_key)
    )), '[]'::jsonb)
    into v_my_licenses
    from public.business_pack_license_tenant_state s
    where s.tenant_id = v_tenant_id
      and s.license_status in ('active', 'trial', 'grace_period');
  end if;

  return jsonb_build_object(
    'found', true,
    'catalog_pending', jsonb_array_length(v_marketplace) = 0,
    'principle', coalesce(public._as502_principle(), 'Business Packs extend Aipify where your organization needs them.'),
    'locale', v_locale,
    'categories', coalesce(public._as502_categories(), '[]'::jsonb),
    'seat_tiers', coalesce(public._as502_seat_tiers(), '[]'::jsonb),
    'installation_flow', coalesce(public._as502_install_flow(), '[]'::jsonb),
    'sections', jsonb_build_object(
      'installed', coalesce(v_installed, '[]'::jsonb),
      'marketplace', coalesce(v_marketplace, '[]'::jsonb),
      'recommended', coalesce(v_recommended, '[]'::jsonb),
      'popular', coalesce(v_popular, '[]'::jsonb),
      'recently_added', coalesce(v_recent, '[]'::jsonb),
      'my_licenses', coalesce(v_my_licenses, '[]'::jsonb)
    ),
    'governance_note', 'Business Pack listings will appear here as they are published for your organization.',
    'module_access_route', '/app/settings/module-access',
    'licenses_route', '/app/licenses'
  );
exception
  when others then
    if sqlerrm ilike '%permission denied%' then
      raise;
    end if;
    return jsonb_build_object(
      'found', true,
      'catalog_pending', true,
      'principle', coalesce(public._as502_principle(), 'Business Packs extend Aipify where your organization needs them.'),
      'locale', v_locale,
      'categories', '[]'::jsonb,
      'seat_tiers', '[]'::jsonb,
      'installation_flow', '[]'::jsonb,
      'sections', jsonb_build_object(
        'installed', '[]'::jsonb,
        'marketplace', '[]'::jsonb,
        'recommended', '[]'::jsonb,
        'popular', '[]'::jsonb,
        'recently_added', '[]'::jsonb,
        'my_licenses', '[]'::jsonb
      ),
      'governance_note', 'Business Pack listings will appear here as they are published for your organization.',
      'module_access_route', '/app/settings/module-access',
      'licenses_route', '/app/licenses'
    );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Customer Success — align RPC access with success.view permission key
-- ---------------------------------------------------------------------------
create or replace function public._acsc295_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
begin
  if not public.has_organization_permission('success.view') then
    raise exception 'Permission denied: success.view';
  end if;

  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_admin', v_role in ('organization_owner', 'organization_admin'),
    'is_member', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Feature access — stable lifetime / premium plan resolution (idempotent)
-- ---------------------------------------------------------------------------
create or replace function public.get_app_portal_feature_access(p_feature text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_plan text := 'starter';
  v_enabled boolean := true;
  v_feature text := coalesce(nullif(trim(p_feature), ''), 'core');
  v_premium_plans text[] := array['business', 'enterprise', 'professional', 'growth', 'lifetime', 'internal'];
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  if v_company_id is not null then
    begin
      select c.id, coalesce(s.plan_key, 'starter')
      into v_customer_id, v_plan
      from public.customers c
      left join public.subscriptions s on s.customer_id = c.id
      where c.company_id = v_company_id
      order by s.updated_at desc nulls last, s.created_at desc nulls last
      limit 1;

      if v_plan is null or v_plan = 'starter' then
        if v_customer_id is not null and exists (
          select 1 from pg_proc where proname = 'get_customer_license_limits'
        ) then
          v_plan := coalesce(
            public.get_customer_license_limits(v_customer_id)->>'plan_key',
            v_plan,
            'starter'
          );
        end if;
      end if;
    exception when others then
      v_plan := coalesce(v_access->>'plan_key', 'starter');
    end;
  end if;

  if v_feature in ('business_packs', 'workflows', 'advanced_insights') then
    v_enabled := v_plan = any(v_premium_plans);
  elsif v_feature in ('team_management', 'billing') then
    v_enabled := v_plan not in ('paused');
  else
    v_enabled := true;
  end if;

  return jsonb_build_object(
    'feature', v_feature,
    'enabled', v_enabled,
    'plan_key', v_plan,
    'upgrade_required', not v_enabled,
    'upgrade_href', '/app/billing/upgrade'
  );
exception when others then
  return jsonb_build_object(
    'feature', v_feature,
    'enabled', false,
    'plan_key', coalesce(v_plan, 'starter'),
    'upgrade_required', true,
    'upgrade_href', '/app/billing/upgrade'
  );
end;
$$;

grant execute on function public.get_app_store_home(text) to authenticated;
grant execute on function public._bpmke_require_view() to authenticated;
grant execute on function public._acsc295_access_context() to authenticated;
grant execute on function public.get_app_portal_feature_access(text) to authenticated;

notify pgrst, 'reload schema';
