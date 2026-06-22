-- Fix APP feature entitlements: resolve plan_key from subscriptions (not license center JSON).

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
      v_plan := 'starter';
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

grant execute on function public.get_app_portal_feature_access(text) to authenticated;

-- Customer Success view should not be blocked by an inactive module registry row.
update public.aipify_permissions
set module_key = null
where permission_key = 'success.view'
  and module_key is not null;
