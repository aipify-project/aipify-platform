-- Patch customer success metrics for tenant_modules schema (tenant_id, not company_id).

create or replace function public._acsc295_org_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  v_team_count integer := 0;
  v_2fa_count integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_connected integer := 0;
  v_academy_completions integer := 0;
  v_academy_certs integer := 0;
  v_academy_assignments_done integer := 0;
  v_operations_records integer := 0;
  v_compliance_records integer := 0;
  v_customer_id uuid;
begin
  select c.id into v_customer_id from public.customers c where c.company_id = p_company_id limit 1;

  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa_count
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true;
  end if;

  if v_customer_id is not null and to_regclass('public.organization_business_packs') is not null then
    select count(*)::int into v_packs
    from public.organization_business_packs obp
    where obp.organization_id = v_customer_id;
  elsif v_customer_id is not null and to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id
      and coalesce(tm.enabled, false) = true;
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int, count(*) filter (where ic.status = 'connected')::int
    into v_integrations, v_connected
    from public.app_portal_integration_connections ic where ic.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_completions') is not null then
    select count(*)::int into v_academy_completions
    from public.app_portal_academy_completions co where co.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_certifications') is not null then
    select count(*)::int into v_academy_certs
    from public.app_portal_academy_certifications ce
    where ce.company_id = p_company_id and ce.status = 'earned';
  end if;

  if to_regclass('public.app_portal_academy_assignments') is not null then
    select count(*)::int into v_academy_assignments_done
    from public.app_portal_academy_assignments aa
    where aa.company_id = p_company_id and aa.status = 'completed';
  end if;

  if to_regclass('public.app_portal_operations_records') is not null then
    select count(*)::int into v_operations_records
    from public.app_portal_operations_records op where op.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_compliance_records') is not null then
    select count(*)::int into v_compliance_records
    from public.app_portal_compliance_records cr where cr.company_id = p_company_id;
  end if;

  return jsonb_build_object(
    'team_count', v_team_count,
    'two_fa_adoption_percent', case when v_team_count > 0 then round((v_2fa_count::numeric / v_team_count) * 100)::int else 0 end,
    'business_packs', v_packs,
    'integrations_total', v_integrations,
    'integrations_connected', v_connected,
    'academy_completions', v_academy_completions,
    'academy_certifications', v_academy_certs,
    'academy_assignments_done', v_academy_assignments_done,
    'operations_records', v_operations_records,
    'compliance_records', v_compliance_records
  );
end;
$$;
