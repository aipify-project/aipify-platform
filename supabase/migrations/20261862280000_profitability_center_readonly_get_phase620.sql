-- Phase 620 P1 — Profitability Center shared read-only GET repair.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('profitability.view', 'View Profitability', null, 'View profitability center, margins, costs, and reports'),
  ('profitability.manage', 'Manage Profitability', null, 'Manage profitability policies, pricing, and allocations')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'profitability.view'), ('owner', 'profitability.manage'),
  ('administrator', 'profitability.view'), ('administrator', 'profitability.manage'),
  ('manager', 'profitability.view'), ('manager', 'profitability.manage'),
  ('support_agent', 'profitability.view'),
  ('viewer', 'profitability.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

insert into public.organization_prof615_settings (organization_id)
select o.id
from public.organizations o
where not exists (
  select 1
  from public.organization_prof615_settings s
  where s.organization_id = o.id
)
on conflict (organization_id) do nothing;

create or replace function public._prof615_read_settings(p_org_id uuid)
returns public.organization_prof615_settings
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.organization_prof615_settings;
begin
  select * into v_row
  from public.organization_prof615_settings
  where organization_id = p_org_id;

  if found then
    return v_row;
  end if;

  v_row.organization_id := p_org_id;
  v_row.profitability_center_enabled := true;
  v_row.margin_calculation_enabled := true;
  v_row.price_recommendations_enabled := true;
  v_row.overhead_allocation_enabled := true;
  v_row.scenario_lab_enabled := true;
  v_row.approval_workflow_enabled := true;
  v_row.companion_advisor_enabled := true;
  v_row.never_present_estimates_as_audited := true;
  v_row.audit_logging_required := true;
  v_row.metadata := '{}'::jsonb;
  v_row.updated_at := now();
  return v_row;
end;
$$;

create or replace function public.get_organization_profitability_settings()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_settings public.organization_prof615_settings;
begin
  v_org_id := public._prof615_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  v_settings := public._prof615_read_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'settings', jsonb_build_object(
      'profitability_center_enabled', coalesce(v_settings.profitability_center_enabled, true),
      'margin_calculation_enabled', coalesce(v_settings.margin_calculation_enabled, true),
      'price_recommendations_enabled', coalesce(v_settings.price_recommendations_enabled, true),
      'overhead_allocation_enabled', coalesce(v_settings.overhead_allocation_enabled, true),
      'scenario_lab_enabled', coalesce(v_settings.scenario_lab_enabled, true),
      'approval_workflow_enabled', coalesce(v_settings.approval_workflow_enabled, true),
      'companion_advisor_enabled', coalesce(v_settings.companion_advisor_enabled, true),
      'never_present_estimates_as_audited', coalesce(v_settings.never_present_estimates_as_audited, true)
    ),
    'principle', 'Never present estimates as audited profit — data quality must remain explicit.'
  );
end;
$$;

create or replace function public.get_organization_profitability_center(p_section text default 'overview')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_settings public.organization_prof615_settings;
  v_rows jsonb := '[]'::jsonb;
begin
  v_org_id := public._prof615_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  v_settings := public._prof615_read_settings(v_org_id);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section, 'engine', 'profitability_phase615',
      'principle', 'Aipify models service profitability — verified revenue, estimated costs, never audited profit without explicit data quality.',
      'privacy_note', 'Profitability metadata is tenant-scoped. Estimates are never presented as audited financial statements.',
      'distinction_note', 'Verified revenue → Estimated labor & consumables → Margin result → Human approval → Operational decision',
      'data_quality_warning', 'Never present estimates as audited profit — check data_quality on every margin result.',
      'section_count', 39,
      'settings', jsonb_build_object(
        'margin_calculation_enabled', coalesce(v_settings.margin_calculation_enabled, true),
        'price_recommendations_enabled', coalesce(v_settings.price_recommendations_enabled, true),
        'never_present_estimates_as_audited', coalesce(v_settings.never_present_estimates_as_audited, true),
        'companion_advisor_enabled', coalesce(v_settings.companion_advisor_enabled, true)
      ),
      'stats', jsonb_build_object(
        'services_tracked', (select count(*) from public.organization_prof615_service_cost_profiles where organization_id = v_org_id),
        'margin_results', (select count(*) from public.organization_prof615_margin_results where organization_id = v_org_id),
        'open_exceptions', (select count(*) from public.organization_prof615_profitability_exceptions where organization_id = v_org_id and record_status in ('incomplete_data', 'negative_margin')),
        'pending_approvals', (select count(*) from public.organization_prof615_approvals where organization_id = v_org_id and record_status = 'approval_required'),
        'recalculation_pending', (select count(*) from public.organization_prof615_calculation_queue where organization_id = v_org_id and record_status = 'recalculation_pending'),
        'price_recommendations', (select count(*) from public.organization_prof615_price_recommendations where organization_id = v_org_id)
      ),
      'sections_registry', coalesce((select jsonb_agg(jsonb_build_object(
        'section_key', s.section_key, 'section_number', s.section_number,
        'domain_key', s.domain_key, 'section_title', s.section_title, 'summary', s.summary
      ) order by s.section_number) from public.prof615_section_defs s), '[]'::jsonb),
      'profitability_status_defs', coalesce((select jsonb_agg(public._prof615_status(d.status_key) order by d.status_key)
        from public.prof615_profitability_status_defs d), '[]'::jsonb),
      'data_quality_defs', coalesce((select jsonb_agg(public._prof615_data_quality(d.quality_key) order by d.quality_key)
        from public.prof615_data_quality_defs d), '[]'::jsonb),
      'service_profitability_cards', public._prof615_section_rows(v_org_id, 'service_profitability_cards'),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('key', 'exceptions', 'observation', 'Incomplete cost data blocks reliable margin assertions.',
          'recommendation', 'Resolve exceptions and link Phase 614 labor signals before pricing decisions.', 'href', '/app/profitability/exceptions'),
        jsonb_build_object('key', 'pricing', 'observation', 'Price recommendations may require approval before list price changes.',
          'recommendation', 'Review Price Recommendation Engine outputs with data quality labels.', 'href', '/app/profitability/pricing')
      ),
      'integrations', public._prof615_section_rows(v_org_id, 'integration_hub')
    );
  end if;

  case v_section
    when 'services' then v_rows := public._prof615_section_rows(v_org_id, 'service_cost_profiles');
    when 'pricing' then v_rows := public._prof615_section_rows(v_org_id, 'price_recommendation_engine');
    when 'costs' then v_rows := public._prof615_section_rows(v_org_id, 'service_cost_versions');
    when 'margins' then v_rows := public._prof615_section_rows(v_org_id, 'margin_results');
    when 'employees' then v_rows := public._prof615_section_rows(v_org_id, 'employee_profitability');
    when 'locations' then v_rows := public._prof615_section_rows(v_org_id, 'location_cost_models');
    when 'resources' then v_rows := public._prof615_section_rows(v_org_id, 'resource_profitability');
    when 'products' then v_rows := public._prof615_section_rows(v_org_id, 'product_profitability');
    when 'customers' then v_rows := public._prof615_section_rows(v_org_id, 'customer_profitability');
    when 'forecasts' then v_rows := public._prof615_section_rows(v_org_id, 'forecasts');
    when 'scenarios' then v_rows := public._prof615_section_rows(v_org_id, 'scenario_lab');
    when 'recommendations' then v_rows := public._prof615_section_rows(v_org_id, 'recommendations');
    when 'approvals' then v_rows := public._prof615_section_rows(v_org_id, 'approvals');
    when 'policies' then v_rows := public._prof615_section_rows(v_org_id, 'policy_center');
    when 'reports' then v_rows := public._prof615_section_rows(v_org_id, 'reports_catalog');
    when 'allocations' then v_rows := public._prof615_section_rows(v_org_id, 'overhead_allocation_engine');
    when 'exceptions' then v_rows := public._prof615_section_rows(v_org_id, 'exception_center');
    else v_rows := '[]'::jsonb;
  end case;

  return jsonb_build_object(
    'found', true, 'section', v_section, 'engine', 'profitability_phase615',
    'principle', 'Aipify models service profitability — never present estimates as audited profit.',
    'privacy_note', 'Check data_quality on every margin result before operational decisions.',
    'data_quality_warning', 'Estimates are not audited profit.',
    'profitability_status_defs', coalesce((select jsonb_agg(public._prof615_status(d.status_key) order by d.status_key)
      from public.prof615_profitability_status_defs d), '[]'::jsonb),
    'data_quality_defs', coalesce((select jsonb_agg(public._prof615_data_quality(d.quality_key) order by d.quality_key)
      from public.prof615_data_quality_defs d), '[]'::jsonb),
    'records', v_rows,
    'service_profitability_cards', public._prof615_section_rows(v_org_id, 'service_profitability_cards'),
    'integrations', public._prof615_section_rows(v_org_id, 'integration_hub'),
    'since_last_login', coalesce((select jsonb_build_object(
      'open_exceptions', (select count(*) from public.organization_prof615_profitability_exceptions where organization_id = v_org_id and record_status in ('incomplete_data', 'negative_margin')),
      'pending_approvals', (select count(*) from public.organization_prof615_approvals where organization_id = v_org_id and record_status = 'approval_required'),
      'summary', 'Profitability changes since last login.'
    )), '{}'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_prof615_audit_logs where organization_id = v_org_id order by created_at desc limit 15
    ) l), '[]'::jsonb)
  );
end;
$$;

grant execute on function public._prof615_read_settings(uuid) to authenticated;
grant execute on function public.get_organization_profitability_settings() to authenticated;
grant execute on function public.get_organization_profitability_center(text) to authenticated;
