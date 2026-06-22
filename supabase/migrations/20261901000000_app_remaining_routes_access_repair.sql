-- APP remaining routes access repair — business store helpers, permissions, graceful catalog empty state.

-- ---------------------------------------------------------------------------
-- 1. Marketplace permission helpers (missing on partial remote apply)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('business_pack_marketplace.view', 'View Business Pack Marketplace', null, 'Discover and browse marketplace listings'),
  ('business_pack_marketplace.install', 'Install Business Packs', null, 'Install marketplace Business Packs')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (
  select role, key from (values
    ('owner', 'business_pack_marketplace.view'),
    ('owner', 'business_pack_marketplace.install'),
    ('administrator', 'business_pack_marketplace.view'),
    ('administrator', 'business_pack_marketplace.install'),
    ('manager', 'business_pack_marketplace.view'),
    ('viewer', 'business_pack_marketplace.view')
  ) as t(role, key)
) as v
where not exists (
  select 1
  from public.organization_role_permissions rp
  where rp.organization_id = o.id
    and rp.role = v.role
    and rp.permission_key = v.key
);

create or replace function public._bpmke_require_tenant()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_access jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is not null then
    return v_tenant_id;
  end if;

  v_access := public._apsf260_require_app_access();
  v_tenant_id := (v_access->>'company_id')::uuid;
  if v_tenant_id is null then
    raise exception 'No tenant context';
  end if;
  return v_tenant_id;
end;
$$;

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
  perform public._irp_require_permission('business_pack_marketplace.view');
exception
  when others then
    if public.is_platform_admin() then
      return;
    end if;
    raise;
end;
$$;

create or replace function public._bpmke_seed_listings()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if to_regclass('public.business_pack_marketplace_listings') is null then
    return;
  end if;

  if exists (select 1 from pg_proc where proname = '_bpie_seed_identity') then
    perform public._bpie_seed_identity();
  end if;
  if exists (select 1 from pg_proc where proname = '_bple_seed_definitions') then
    perform public._bple_seed_definitions();
  end if;

  if to_regclass('public.business_pack_identity') is null then
    return;
  end if;

  insert into public.business_pack_marketplace_listings (
    pack_key, marketplace_visibility, marketplace_category, starting_price_monthly,
    pricing_label, trial_available, install_available, popular_rank, recently_added_at, published_at
  )
  select
    i.pack_key,
    case when i.status in ('active', 'beta') then 'published' else 'draft' end,
    i.pack_category,
    99,
    'Contact sales',
    i.status in ('active', 'beta'),
    i.install_allowed and i.status in ('active', 'beta'),
    60,
    now(),
    now()
  from public.business_pack_identity i
  where not exists (
    select 1 from public.business_pack_marketplace_listings l where l.pack_key = i.pack_key
  );
exception
  when others then
    return;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. App Store home — organization tenant + graceful empty catalog
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
begin
  perform public._bpmke_require_view();
  v_tenant_id := public._bpmke_require_tenant();

  v_catalog_ready := to_regclass('public.business_pack_marketplace_listings') is not null
    and to_regclass('public.business_pack_identity') is not null
    and to_regprocedure('public._as502_pack_card(uuid, text)') is not null;

  if not v_catalog_ready then
    return jsonb_build_object(
      'found', true,
      'catalog_pending', true,
      'principle', public._as502_principle(),
      'locale', coalesce(nullif(p_locale, ''), 'en'),
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

  perform public._bpmke_seed_listings();

  for v_pack in
    select l.pack_key
    from public.business_pack_marketplace_listings l
    join public.business_pack_identity i on i.pack_key = l.pack_key
    where l.marketplace_visibility = 'published'
    order by l.popular_rank, i.pack_name
  loop
    v_card := public._as502_pack_card(v_tenant_id, v_pack.pack_key);
    if v_card is not null then
      v_all_cards := v_all_cards || jsonb_build_array(v_card);
    end if;
  end loop;

  if to_regprocedure('public._as502_recommendations(uuid)') is not null then
    for v_rec_key in
      select jsonb_array_elements_text(public._as502_recommendations(v_tenant_id))
    loop
      v_card := public._as502_pack_card(v_tenant_id, v_rec_key);
      if v_card is not null and coalesce((v_card->>'installed')::boolean, false) = false then
        v_recommended := v_recommended || jsonb_build_array(v_card);
      end if;
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

  if to_regprocedure('public._as502_log(uuid, text, text, text, jsonb)') is not null then
    perform public._as502_log(
      v_tenant_id,
      'store',
      'store_view',
      'App Store home viewed',
      jsonb_build_object('locale', p_locale)
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'catalog_pending', jsonb_array_length(v_marketplace) = 0,
    'principle', public._as502_principle(),
    'locale', coalesce(nullif(p_locale, ''), 'en'),
    'categories', public._as502_categories(),
    'seat_tiers', public._as502_seat_tiers(),
    'installation_flow', public._as502_install_flow(),
    'sections', jsonb_build_object(
      'installed', coalesce(v_installed, '[]'::jsonb),
      'marketplace', coalesce(v_marketplace, '[]'::jsonb),
      'recommended', coalesce(v_recommended, '[]'::jsonb),
      'popular', coalesce(v_popular, '[]'::jsonb),
      'recently_added', coalesce(v_recent, '[]'::jsonb),
      'my_licenses', coalesce(v_my_licenses, '[]'::jsonb)
    ),
    'governance_note', 'APP owner controls employee module visibility after install — employees inherit APP license only when granted.',
    'module_access_route', '/app/settings/module-access',
    'licenses_route', '/app/licenses',
    'future_proof_rule', 'Every future Business Pack must be installable through the App Store via Module Registry and License Engine.'
  );
end;
$$;

grant execute on function public.get_app_store_home(text) to authenticated;
grant execute on function public._bpmke_require_tenant() to authenticated;
grant execute on function public._bpmke_require_view() to authenticated;
grant execute on function public._bpmke_seed_listings() to authenticated;
