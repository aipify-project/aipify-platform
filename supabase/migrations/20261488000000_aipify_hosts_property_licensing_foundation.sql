-- Aipify Hosts — Property Licensing Foundation
-- One platform. One codebase. One feature set. Capacity-only limits.
-- Helpers: _ahostlic_* (licensing)

alter table public.aipify_hosts_settings
  drop constraint if exists aipify_hosts_settings_package_key_check;

alter table public.aipify_hosts_settings
  add column if not exists property_limit int,
  add column if not exists plan_type text,
  add column if not exists additional_property_licenses int not null default 0;

-- Migrate legacy plan keys to capacity-based naming
update public.aipify_hosts_settings
set package_key = case package_key
  when 'hosts_starter' then 'hosts_5'
  when 'hosts_professional' then 'hosts_10'
  when 'hosts_business' then 'hosts_20'
  else package_key
end
where package_key in ('hosts_starter', 'hosts_professional', 'hosts_business');

update public.aipify_hosts_settings
set plan_type = package_key
where plan_type in ('hosts_starter', 'hosts_professional', 'hosts_business')
   or plan_type is null;

alter table public.aipify_hosts_settings
  add constraint aipify_hosts_settings_package_key_check check (
    package_key in ('hosts_solo', 'hosts_5', 'hosts_10', 'hosts_20', 'hosts_enterprise')
  );

create or replace function public._ahostlic_normalize_plan(p_plan_type text)
returns text language sql immutable as $$
  select case p_plan_type
    when 'hosts_starter' then 'hosts_5'
    when 'hosts_professional' then 'hosts_10'
    when 'hosts_business' then 'hosts_20'
    else p_plan_type
  end;
$$;

create or replace function public._ahostlic_default_limit(p_plan_type text)
returns int language sql immutable as $$
  select case public._ahostlic_normalize_plan(p_plan_type)
    when 'hosts_solo' then 1
    when 'hosts_5' then 5
    when 'hosts_10' then 10
    when 'hosts_20' then 20
    when 'hosts_enterprise' then 999
    else 5
  end;
$$;

create or replace function public._ahostlic_module_keys()
returns jsonb language sql immutable as $$
  select coalesce(
    (
      select jsonb_agg(m->>'key')
      from jsonb_array_elements(public._ahostbp364_modules()) m
    ),
    '[]'::jsonb
  );
$$;

create or replace function public._ahostlic_packages()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'hosts_solo', 'label', 'Hosts Solo', 'target', 'Individual hosts — one property',
      'property_limit', 1, 'modules', public._ahostlic_module_keys()
    ),
    jsonb_build_object(
      'key', 'hosts_5', 'label', 'Hosts 5', 'target', 'Small hospitality businesses — up to 5 properties',
      'property_limit', 5, 'modules', public._ahostlic_module_keys()
    ),
    jsonb_build_object(
      'key', 'hosts_10', 'label', 'Hosts 10', 'target', 'Professional operators — up to 10 properties',
      'property_limit', 10, 'modules', public._ahostlic_module_keys()
    ),
    jsonb_build_object(
      'key', 'hosts_20', 'label', 'Hosts 20', 'target', 'Established hospitality businesses — up to 20 properties',
      'property_limit', 20, 'modules', public._ahostlic_module_keys()
    ),
    jsonb_build_object(
      'key', 'hosts_enterprise', 'label', 'Hosts Enterprise', 'target', 'Large operators — custom property limits via sales',
      'property_limit', null, 'modules', public._ahostlic_module_keys(), 'custom_limit', true, 'contact_sales', true
    )
  );
$$;

create or replace function public._ahostlic_base_limit(
  p_settings public.aipify_hosts_settings
) returns int language plpgsql stable as $$
declare v_plan text;
        v_default int;
begin
  v_plan := public._ahostlic_normalize_plan(p_settings.package_key);
  v_default := public._ahostlic_default_limit(v_plan);
  if v_plan = 'hosts_enterprise' and p_settings.property_limit is not null then
    return p_settings.property_limit;
  end if;
  return coalesce(p_settings.property_limit, v_default);
end;
$$;

create or replace function public._ahostlic_resolve_limit(
  p_settings public.aipify_hosts_settings
) returns int language plpgsql stable as $$
begin
  return public._ahostlic_base_limit(p_settings) + coalesce(p_settings.additional_property_licenses, 0);
end;
$$;

create or replace function public._ahostlic_sync_settings(p_tenant_id uuid)
returns public.aipify_hosts_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_settings;
        v_plan text;
begin
  v_settings := public._ahost_ensure_settings(p_tenant_id);
  v_plan := public._ahostlic_normalize_plan(v_settings.package_key);
  if v_plan <> v_settings.package_key then
    update public.aipify_hosts_settings
    set package_key = v_plan, plan_type = v_plan, updated_at = now()
    where tenant_id = p_tenant_id
    returning * into v_settings;
  end if;
  update public.aipify_hosts_settings
  set
    plan_type = coalesce(plan_type, package_key),
    property_limit = case
      when public._ahostlic_normalize_plan(package_key) = 'hosts_enterprise' and property_limit is not null then property_limit
      else public._ahostlic_default_limit(package_key)
    end,
    updated_at = now()
  where tenant_id = p_tenant_id
  returning * into v_settings;
  return v_settings;
end;
$$;

create or replace function public._ahost_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_settings;
begin
  insert into public.aipify_hosts_settings (tenant_id, enabled, package_key)
  values (p_tenant_id, true, 'hosts_5')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_settings where tenant_id = p_tenant_id;
  return v_settings;
end;
$$;

create or replace function public._ahostlic_active_property_count(p_tenant_id uuid)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int
  from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active';
$$;

create or replace function public._ahostlic_capacity_label(p_active int, p_limit int)
returns text language sql immutable as $$
  select p_active::text || ' / ' || p_limit::text || ' properties';
$$;

create or replace function public.assert_aipify_hosts_property_capacity(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_hosts_settings;
  v_active int;
  v_base int;
  v_limit int;
  v_allowed boolean;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ahost_require_tenant());
  v_settings := public._ahostlic_sync_settings(v_tenant_id);
  v_active := public._ahostlic_active_property_count(v_tenant_id);
  v_base := public._ahostlic_base_limit(v_settings);
  v_limit := public._ahostlic_resolve_limit(v_settings);
  v_allowed := v_active < v_limit;
  return jsonb_build_object(
    'allowed', v_allowed,
    'can_add_property', v_allowed,
    'plan_type', v_settings.package_key,
    'base_property_limit', v_base,
    'additional_property_licenses', coalesce(v_settings.additional_property_licenses, 0),
    'property_limit', v_limit,
    'active_property_count', v_active,
    'remaining_capacity', greatest(0, v_limit - v_active),
    'upgrade_required', not v_allowed,
    'at_capacity', not v_allowed,
    'capacity_label', public._ahostlic_capacity_label(v_active, v_limit),
    'principle', 'Customers buy operational capacity — not different functionality.'
  );
end;
$$;

create or replace function public.set_aipify_hosts_plan(
  p_plan_type text,
  p_property_limit int default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_hosts_settings;
  v_active int;
  v_plan text;
  v_base int;
  v_effective int;
  v_old_plan text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_plan := public._ahostlic_normalize_plan(p_plan_type);
  if v_plan not in ('hosts_solo', 'hosts_5', 'hosts_10', 'hosts_20', 'hosts_enterprise') then
    raise exception 'Invalid Aipify Hosts plan type';
  end if;
  v_settings := public._ahost_ensure_settings(v_tenant_id);
  v_old_plan := v_settings.package_key;
  v_base := case
    when v_plan = 'hosts_enterprise' then coalesce(p_property_limit, v_settings.property_limit, 999)
    else public._ahostlic_default_limit(v_plan)
  end;
  v_effective := v_base + coalesce(v_settings.additional_property_licenses, 0);
  v_active := public._ahostlic_active_property_count(v_tenant_id);
  if v_active > v_effective then
    raise exception 'Downgrade blocked: reduce active properties to % or fewer before switching plans', v_effective;
  end if;
  update public.aipify_hosts_settings
  set
    package_key = v_plan,
    plan_type = v_plan,
    property_limit = v_base,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;
  perform public._ahost_log_audit(
    v_tenant_id,
    'license_plan_change',
    'Aipify Hosts plan updated',
    jsonb_build_object(
      'from_plan', v_old_plan,
      'to_plan', v_plan,
      'base_property_limit', v_base,
      'effective_property_limit', public._ahostlic_resolve_limit(v_settings),
      'active_property_count', v_active
    )
  );
  return jsonb_build_object(
    'success', true,
    'plan_type', v_settings.package_key,
    'property_limit', public._ahostlic_resolve_limit(v_settings),
    'active_property_count', v_active,
    'licensing', public.assert_aipify_hosts_property_capacity(v_tenant_id)
  );
end;
$$;

create or replace function public.add_aipify_hosts_property_license(
  p_count int default 1,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_hosts_settings;
  v_count int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_count := greatest(1, coalesce(p_count, 1));
  v_settings := public._ahostlic_sync_settings(v_tenant_id);
  if v_settings.package_key = 'hosts_enterprise' then
    raise exception 'Enterprise plans use custom limits — contact sales for additional capacity';
  end if;
  update public.aipify_hosts_settings
  set
    additional_property_licenses = coalesce(additional_property_licenses, 0) + v_count,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;
  perform public._ahost_log_audit(
    v_tenant_id,
    'additional_property_license_purchased',
    'Additional Aipify Hosts property license added',
    jsonb_build_object(
      'count', v_count,
      'total_additional_licenses', v_settings.additional_property_licenses,
      'effective_property_limit', public._ahostlic_resolve_limit(v_settings)
    )
  );
  return jsonb_build_object(
    'success', true,
    'additional_property_licenses', v_settings.additional_property_licenses,
    'licensing', public.assert_aipify_hosts_property_capacity(v_tenant_id)
  );
end;
$$;

create or replace function public.create_aipify_hosts_property(
  p_display_name text,
  p_platform_source text default 'direct',
  p_property_key text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_capacity jsonb;
  v_key text;
  v_property public.aipify_hosts_properties;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if coalesce(trim(p_display_name), '') = '' then
    raise exception 'Property display name is required';
  end if;
  v_capacity := public.assert_aipify_hosts_property_capacity(v_tenant_id);
  if coalesce((v_capacity->>'allowed')::boolean, false) is not true then
    return jsonb_build_object(
      'success', false,
      'error_code', 'property_limit_reached',
      'licensing', v_capacity,
      'upgrade_required', true
    );
  end if;
  v_key := coalesce(
    nullif(trim(p_property_key), ''),
    'property_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)
  );
  insert into public.aipify_hosts_properties (
    tenant_id, property_key, display_name, platform_source, status, health_score
  ) values (
    v_tenant_id,
    v_key,
    trim(p_display_name),
    coalesce(nullif(trim(p_platform_source), ''), 'direct'),
    'active',
    75
  )
  returning * into v_property;
  update public.aipify_hosts_settings
  set property_count = public._ahostlic_active_property_count(v_tenant_id), updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._ahost_log_audit(
    v_tenant_id,
    'property_created',
    'Property added to Aipify Hosts workspace',
    jsonb_build_object(
      'property_key', v_property.property_key,
      'display_name', v_property.display_name,
      'licensing', public.assert_aipify_hosts_property_capacity(v_tenant_id)
    )
  );
  return jsonb_build_object(
    'success', true,
    'property', jsonb_build_object(
      'id', v_property.id,
      'property_key', v_property.property_key,
      'display_name', v_property.display_name,
      'platform_source', v_property.platform_source,
      'health_score', v_property.health_score,
      'status', v_property.status
    ),
    'licensing', public.assert_aipify_hosts_property_capacity(v_tenant_id)
  );
end;
$$;

create or replace function public._ahost_module_enabled(p_package text, p_module text)
returns boolean language sql immutable as $$
  select true;
$$;

create or replace function public.get_aipify_hosts_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_hosts_settings;
  v_licensing jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ahostlic_sync_settings(v_tenant_id);
  v_licensing := public.assert_aipify_hosts_property_capacity(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'package_key', v_settings.package_key,
    'plan_type', v_settings.package_key,
    'property_count', (v_licensing->>'active_property_count')::int,
    'property_limit', (v_licensing->>'property_limit')::int,
    'human_oversight_required', v_settings.human_oversight_required,
    'positioning', public._ahostbp364_positioning(),
    'route', '/app/aipify-hosts',
    'licensing', v_licensing
  );
end;
$$;

create or replace function public.get_aipify_hosts_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_hosts_settings;
  v_health numeric;
  v_licensing jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_settings := public._ahostlic_sync_settings(v_tenant_id);
  v_licensing := public.assert_aipify_hosts_property_capacity(v_tenant_id);
  select coalesce(avg(health_score), 0)
  into v_health
  from public.aipify_hosts_properties
  where tenant_id = v_tenant_id and status = 'active';
  perform public._ahost_log_audit(
    v_tenant_id,
    'dashboard_view',
    'Aipify Hosts dashboard viewed',
    jsonb_build_object('package', v_settings.package_key, 'licensing', v_licensing)
  );
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'package_key', v_settings.package_key,
    'plan_type', v_settings.package_key,
    'property_count', (v_licensing->>'active_property_count')::int,
    'property_limit', (v_licensing->>'property_limit')::int,
    'human_oversight_required', v_settings.human_oversight_required,
    'positioning', public._ahostbp364_positioning(),
    'licensing', v_licensing,
    'licensing_principle', 'Customers buy operational capacity — not different functionality.',
    'platforms', public._ahostbp364_platforms(),
    'modules', public._ahostbp364_modules(),
    'packages', public._ahostlic_packages(),
    'executive_widgets', public._ahostbp364_executive_widgets(),
    'success_metrics', public._ahostbp364_success_metrics(),
    'governance', public._ahostbp364_governance(),
    'property_health_score', round(v_health, 1),
    'properties', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id, 'property_key', p.property_key, 'display_name', p.display_name,
          'platform_source', p.platform_source, 'health_score', p.health_score, 'status', p.status
        ) order by p.display_name
      )
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Aipify Hosts — Property Licensing Foundation',
      'doc', 'aipify-hosts/FOUNDATION_01_PROPERTY_LICENSING.text',
      'route', '/app/aipify-hosts'
    )
  );
end;
$$;

update public.business_packs
set components = jsonb_set(
  coalesce(components, '{}'::jsonb),
  '{packages}',
  jsonb_build_array('hosts_solo', 'hosts_5', 'hosts_10', 'hosts_20', 'hosts_enterprise')
),
updated_at = now()
where pack_key = 'hospitality';

update public.aipify_hosts_settings
set
  plan_type = public._ahostlic_normalize_plan(package_key),
  property_limit = public._ahostlic_default_limit(package_key)
where property_limit is null;

grant execute on function public.assert_aipify_hosts_property_capacity(uuid) to authenticated;
grant execute on function public.create_aipify_hosts_property(text, text, text, uuid) to authenticated;
grant execute on function public.set_aipify_hosts_plan(text, int, uuid) to authenticated;
grant execute on function public.add_aipify_hosts_property_license(int, uuid) to authenticated;
