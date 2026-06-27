-- P1.12C3ZQ — APT610 instant availability slot read surface.
-- Expose ISO bookable windows from organization_apt610_availability_rules via
-- get_organization_appointment_center availability_rules JSON (backward compatible).

alter table public.organization_apt610_availability_rules
  add column if not exists service_key text,
  add column if not exists employee_key text,
  add column if not exists resource_key text,
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists timezone text,
  add column if not exists availability_status text;

alter table public.organization_apt610_availability_rules
  drop constraint if exists organization_apt610_availability_rules_instant_window_chk;

alter table public.organization_apt610_availability_rules
  add constraint organization_apt610_availability_rules_instant_window_chk
  check (
    (starts_at is null and ends_at is null)
    or (starts_at is not null and ends_at is not null and ends_at > starts_at)
  );

create or replace function public.get_organization_appointment_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text;
  v_settings public.organization_apt610_settings;
  v_appointments int;
  v_waiting int;
  v_revenue numeric;
begin
  v_org_id := public._apt610_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  v_section := public._apt610_normalize_section(p_section);
  perform public._apt610_seed(v_org_id);
  select * into v_settings from public.organization_apt610_settings where organization_id = v_org_id;

  select count(*) into v_appointments from public.organization_apt610_appointments where organization_id = v_org_id;
  select count(*) into v_waiting from public.organization_apt610_waiting_list where organization_id = v_org_id;
  select coalesce(sum(revenue_amount), 0) into v_revenue from public.organization_apt610_appointments where organization_id = v_org_id;

  perform public._apt610_log(v_org_id, 'center_view', format('Appointment center viewed — section %s', v_section));

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Aipify books transparently — never impersonates your team. Icon + text status always.',
      'privacy_note', 'Private calendar titles are never shown to customers. Transaction-safe slot holds.',
      'vacation_message', 'Slapp av – Aipify svarer, booker og fyller kalenderen',
      'settings', jsonb_build_object(
        'prevent_double_booking', v_settings.prevent_double_booking,
        'overbooking_allowed', v_settings.overbooking_allowed,
        'companion_booking_enabled', v_settings.companion_booking_enabled,
        'companion_never_impersonates', v_settings.companion_never_impersonates,
        'hide_private_calendar_titles', v_settings.hide_private_calendar_titles,
        'slot_hold_minutes', v_settings.slot_hold_minutes,
        'vacation_revenue_mode_enabled', v_settings.vacation_revenue_mode_enabled
      ),
      'stats', jsonb_build_object(
        'appointments', v_appointments,
        'waiting_list', v_waiting,
        'services', (select count(*) from public.organization_apt610_services where organization_id = v_org_id),
        'calendar_revenue', v_revenue,
        'active_holds', (select count(*) from public.organization_apt610_slot_holds where organization_id = v_org_id and hold_status = 'active')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'item_title', w.customer_label, 'recommendation', w.summary, 'priority_score', w.priority_score
        ) order by w.priority_score desc)
        from public.organization_apt610_waiting_list w where w.organization_id = v_org_id limit 3
      ), '[]'::jsonb),
      'booking_statuses', coalesce((
        select jsonb_agg(jsonb_build_object(
          'status_key', s.status_key, 'status_title', s.status_title, 'icon_key', s.icon_key, 'text_label', s.text_label
        ) order by s.status_key) from public.apt610_status_defs s
      ), '[]'::jsonb),
      'business_pack', coalesce((
        select jsonb_build_object('pack_key', b.pack_key, 'pack_title', b.pack_title, 'route_prefix', b.route_prefix)
        from public.organization_apt610_business_pack b where b.organization_id = v_org_id limit 1
      ), '{}'::jsonb),
      'routes', jsonb_build_object(
        'center', '/app/appointments',
        'services', '/app/appointments/services',
        'waiting_list', '/app/appointments/waiting-list',
        'vacation_coverage', '/app/appointments/vacation-coverage',
        'policies', '/app/appointments/policies'
      )
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Aipify books transparently — never impersonates your team.',
    'privacy_note', 'Metadata only for external calendars. Overbooking prohibited by default.',
    'vacation_message', 'Slapp av – Aipify svarer, booker og fyller kalenderen',
    'stats', jsonb_build_object(
      'appointments', v_appointments, 'waiting_list', v_waiting, 'calendar_revenue', v_revenue
    ),
    'scopes', coalesce((select jsonb_agg(jsonb_build_object('scope_key', s.scope_key, 'scope_title', s.scope_title, 'summary', s.summary) order by s.scope_key)
      from public.apt610_scope_defs s), '[]'::jsonb),
    'channels', coalesce((select jsonb_agg(jsonb_build_object('channel_key', c.channel_key, 'channel_title', c.channel_title, 'summary', c.summary) order by c.channel_key)
      from public.apt610_channel_defs c), '[]'::jsonb),
    'services', coalesce((select jsonb_agg(jsonb_build_object(
      'service_key', s.service_key, 'service_title', s.service_title, 'duration_minutes', s.duration_minutes,
      'prep_minutes', s.prep_minutes, 'cleanup_minutes', s.cleanup_minutes, 'buffer_minutes', s.buffer_minutes,
      'variable_duration', s.variable_duration, 'price_amount', s.price_amount, 'status_key', s.status_key, 'summary', s.summary
    ) order by s.service_title) from public.organization_apt610_services s where s.organization_id = v_org_id), '[]'::jsonb),
    'appointments', coalesce((select jsonb_agg(jsonb_build_object(
      'appointment_key', a.appointment_key, 'appointment_title', a.appointment_title, 'service_key', a.service_key,
      'customer_label', a.customer_label, 'employee_label', a.employee_label, 'location_label', a.location_label,
      'channel_key', a.channel_key, 'status_key', a.status_key, 'starts_at', a.starts_at, 'ends_at', a.ends_at,
      'revenue_amount', a.revenue_amount, 'summary', a.summary
    ) order by a.starts_at) from public.organization_apt610_appointments a where a.organization_id = v_org_id), '[]'::jsonb),
    'customers', coalesce((select jsonb_agg(jsonb_build_object(
      'customer_key', c.customer_key, 'customer_label', c.customer_label, 'timezone', c.timezone,
      'locale_code', c.locale_code, 'notes_protected', c.notes_protected, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_apt610_customers c where c.organization_id = v_org_id), '[]'::jsonb),
    'employees', coalesce((select jsonb_agg(jsonb_build_object(
      'employee_key', e.employee_key, 'employee_label', e.employee_label, 'eligible_services', e.eligible_services,
      'calendar_source', e.calendar_source, 'status_key', e.status_key, 'summary', e.summary
    )) from public.organization_apt610_employees e where e.organization_id = v_org_id), '[]'::jsonb),
    'locations', coalesce((select jsonb_agg(jsonb_build_object(
      'location_key', l.location_key, 'location_title', l.location_title, 'location_type', l.location_type,
      'timezone', l.timezone, 'status_key', l.status_key, 'summary', l.summary
    )) from public.organization_apt610_locations l where l.organization_id = v_org_id), '[]'::jsonb),
    'resources', coalesce((select jsonb_agg(jsonb_build_object(
      'resource_key', r.resource_key, 'resource_title', r.resource_title, 'resource_type', r.resource_type,
      'exclusive', r.exclusive, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_apt610_resources r where r.organization_id = v_org_id), '[]'::jsonb),
    'availability_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', a.rule_key,
      'rule_title', a.rule_title,
      'rule_type', a.rule_type,
      'revalidation_enabled', a.revalidation_enabled,
      'status_key', a.status_key,
      'summary', a.summary,
      'service_key', a.service_key,
      'employee_key', a.employee_key,
      'resource_key', a.resource_key,
      'start_at', a.starts_at,
      'end_at', a.ends_at,
      'timezone', coalesce(nullif(trim(a.timezone), ''), 'Europe/Oslo'),
      'availability_status', coalesce(
        nullif(trim(a.availability_status), ''),
        case when a.starts_at is not null and a.ends_at is not null then 'available' else null end
      )
    ) order by a.starts_at nulls last, a.rule_key)
      from public.organization_apt610_availability_rules a where a.organization_id = v_org_id), '[]'::jsonb),
    'slot_holds', coalesce((select jsonb_agg(jsonb_build_object(
      'hold_key', h.hold_key, 'resource_ref', h.resource_ref, 'employee_ref', h.employee_ref,
      'expires_at', h.expires_at, 'hold_status', h.hold_status, 'status_key', h.status_key, 'summary', h.summary
    )) from public.organization_apt610_slot_holds h where h.organization_id = v_org_id), '[]'::jsonb),
    'waiting_list', coalesce((select jsonb_agg(jsonb_build_object(
      'wait_key', w.wait_key, 'customer_label', w.customer_label, 'service_key', w.service_key,
      'priority_score', w.priority_score, 'smart_match_enabled', w.smart_match_enabled,
      'status_key', w.status_key, 'summary', w.summary
    ) order by w.priority_score desc) from public.organization_apt610_waiting_list w where w.organization_id = v_org_id), '[]'::jsonb),
    'payments', coalesce((select jsonb_agg(jsonb_build_object(
      'payment_key', p.payment_key, 'payment_title', p.payment_title, 'payment_type', p.payment_type,
      'amount', p.amount, 'provider_key', p.provider_key, 'payment_status', p.payment_status,
      'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_apt610_payments p where p.organization_id = v_org_id), '[]'::jsonb),
    'policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_type', p.policy_type,
      'requires_approval', p.requires_approval, 'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_apt610_policies p where p.organization_id = v_org_id), '[]'::jsonb),
    'calendar_connections', coalesce((select jsonb_agg(jsonb_build_object(
      'connection_key', c.connection_key, 'provider_key', c.provider_key, 'provider_title', c.provider_title,
      'source_of_truth', c.source_of_truth, 'privacy_mode', c.privacy_mode,
      'integration_status', c.integration_status, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_apt610_calendar_connections c where c.organization_id = v_org_id), '[]'::jsonb),
    'vacation_integration', coalesce((select jsonb_agg(jsonb_build_object(
      'integration_key', v.integration_key, 'integration_title', v.integration_title,
      'phase606_ref', v.phase606_ref, 'vacation_revenue_mode', v.vacation_revenue_mode,
      'return_date_protected', v.return_date_protected, 'post_vacation_buffer_days', v.post_vacation_buffer_days,
      'status_key', v.status_key, 'summary', v.summary
    )) from public.organization_apt610_vacation_integration v where v.organization_id = v_org_id), '[]'::jsonb),
    'phase_integrations', coalesce((select jsonb_agg(jsonb_build_object(
      'integration_key', i.integration_key, 'integration_title', i.integration_title,
      'source_phase', i.source_phase, 'metadata_only', i.metadata_only,
      'status_key', i.status_key, 'summary', i.summary
    )) from public.organization_apt610_phase_integrations i where i.organization_id = v_org_id), '[]'::jsonb),
    'capacity_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', c.rule_key, 'rule_title', c.rule_title, 'optimization_type', c.optimization_type,
      'overbooking_prohibited', c.overbooking_prohibited, 'dynamic_pricing_governed', c.dynamic_pricing_governed,
      'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_apt610_capacity_rules c where c.organization_id = v_org_id), '[]'::jsonb),
    'analytics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', a.metric_key, 'metric_title', a.metric_title, 'metric_value', a.metric_value,
      'metric_type', a.metric_type, 'status_key', a.status_key, 'summary', a.summary
    )) from public.organization_apt610_analytics a where a.organization_id = v_org_id), '[]'::jsonb),
    'reports', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title, 'report_type', r.report_type,
      'metric_value', r.metric_value, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_apt610_reports r where r.organization_id = v_org_id), '[]'::jsonb),
    'section_items', public._apt610_section_items_json(v_org_id, case
      when v_section in ('overview', 'calendar', 'appointments', 'customers', 'services', 'employees', 'locations', 'resources', 'availability', 'waiting_list', 'payments', 'vacation_coverage', 'policies', 'reports') then null
      else v_section end),
    'section_detail', public._apt610_section_items_json(v_org_id, v_section),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_apt610_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'booking_statuses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'status_key', s.status_key, 'status_title', s.status_title, 'icon_key', s.icon_key, 'text_label', s.text_label
      ) order by s.status_key) from public.apt610_status_defs s
    ), '[]'::jsonb),
    'sections_registered', 115,
    'routes', jsonb_build_object(
      'center', '/app/appointments',
      'services', '/app/appointments/services',
      'waiting_list', '/app/appointments/waiting-list',
      'vacation_coverage', '/app/appointments/vacation-coverage',
      'policies', '/app/appointments/policies'
    )
  );
end; $$;
