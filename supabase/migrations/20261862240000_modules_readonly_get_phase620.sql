-- Phase 620 P1 — Settings Modules read-only GET repair.

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'modules.view'), ('owner', 'modules.manage'),
  ('administrator', 'modules.view'), ('administrator', 'modules.manage'),
  ('manager', 'modules.view'),
  ('support_agent', 'modules.view'),
  ('viewer', 'modules.view')
) as v(role, key)
where exists (select 1 from public.aipify_permissions p where p.permission_key = v.key)
on conflict (organization_id, role, permission_key) do nothing;

create or replace function public._cpa_read_module_enabled(p_tenant_id uuid, p_module_key text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.tenant_modules;
begin
  select * into v_row
  from public.tenant_modules
  where tenant_id = p_tenant_id and module_key = p_module_key;

  if v_row.id is null then
    return false;
  end if;

  return v_row.licensed
    and v_row.enabled
    and v_row.status in ('enabled', 'trial', 'beta');
end;
$$;

create or replace function public.get_customer_modules_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_package_key text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('modules.view')
     and not public.has_organization_permission('modules.manage') then
    raise exception 'Permission denied: modules.view';
  end if;

  v_package_key := public._cpa_resolve_package_key(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'current_package', v_package_key,
    'installed_modules', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'module_key', tm.module_key,
        'enabled', tm.enabled,
        'licensed', tm.licensed,
        'status', tm.status,
        'activated_at', tm.activated_at,
        'expires_at', tm.expires_at
      ) order by tm.module_key)
      from public.tenant_modules tm where tm.tenant_id = v_tenant_id and tm.licensed),
      '[]'::jsonb
    ),
    'available_modules', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'module_key', m,
        'licensed', public._cpa_read_module_enabled(v_tenant_id, m)
      ))
      from (
        select distinct jsonb_array_elements_text(sp.module_keys) as m
        from public.subscription_packages sp where sp.active
      ) all_mods
      where not exists (
        select 1 from public.tenant_modules tm
        where tm.tenant_id = v_tenant_id and tm.module_key = all_mods.m and tm.licensed
      )),
      '[]'::jsonb
    ),
    'trial_modules', coalesce(
      (select jsonb_agg(jsonb_build_object('module_key', tm.module_key, 'status', tm.status))
      from public.tenant_modules tm
      where tm.tenant_id = v_tenant_id and tm.status = 'trial'),
      '[]'::jsonb
    ),
    'upgrade_recommendations', public.get_upgrade_recommendations(v_tenant_id),
    'feature_flag_states', jsonb_build_array('enabled', 'disabled', 'trial', 'beta', 'deprecated', 'enterprise_only'),
    'packages', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'package_key', sp.package_key,
        'package_name', sp.package_name,
        'package_type', sp.package_type,
        'module_count', jsonb_array_length(sp.module_keys)
      ) order by sp.sort_order)
      from public.subscription_packages sp where sp.active),
      '[]'::jsonb
    ),
    'documentation_note', 'Each module maps to an Aipify capability. Enable only purchased modules.',
    'integrations', jsonb_build_object(
      'license_center', 'Subscription status at /app/license',
      'skillos', 'Skills respect plan and module gates',
      'trust_actions', 'Enterprise-only actions require enterprise package'
    )
  );
end;
$$;

grant execute on function public._cpa_read_module_enabled(uuid, text) to authenticated;
