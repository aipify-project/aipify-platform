-- Fix companion_recommendations aggregate ordering in executive command center GET.

create or replace function public.get_organization_executive_command_center(p_section text default 'overview')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_since jsonb := '{}'::jsonb;
  v_health_avg integer;
begin
  if not public.has_organization_permission('executive.view') then
    raise exception 'Permission denied: executive.view';
  end if;

  v_user_id := public._mta_app_user_id();

  select c.id
  into v_org_id
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.id = v_user_id
  limit 1;

  if v_org_id is null then
    raise exception 'Organization context required';
  end if;

  if to_regprocedure('public._aact538_build_since_last_login(uuid,uuid,boolean)') is not null and v_user_id is not null then
    begin
      v_since := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
    exception when others then
      v_since := '{}'::jsonb;
    end;
  end if;

  select coalesce(round(avg(health_score)), 78) into v_health_avg
  from public.organization_ecc590_health where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Executives should not need to search for information — information should come to them.',
      'privacy_note', 'Executive command metadata only — leadership decides outcomes.',
      'overall_health_score', v_health_avg,
      'activity_since_login', v_since,
      'stats', jsonb_build_object(
        'since_last_login_items', (select count(*) from public.organization_ecc590_since_last_login where organization_id = v_org_id),
        'open_alerts', (select count(*) from public.organization_ecc590_alerts where organization_id = v_org_id and alert_status = 'open'),
        'pending_actions', (select count(*) from public.organization_ecc590_actions where organization_id = v_org_id and action_status = 'pending'),
        'open_opportunities', (select count(*) from public.organization_ecc590_opportunities where organization_id = v_org_id and opportunity_status = 'open'),
        'critical_items', (select count(*) from public.organization_ecc590_alerts where organization_id = v_org_id and priority = 'critical' and alert_status = 'open')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(row_obj)
        from (
          select jsonb_build_object(
            'alert_title', a.alert_title,
            'recommendation', a.companion_recommendation
          ) as row_obj
          from public.organization_ecc590_alerts a
          where a.organization_id = v_org_id and a.alert_status = 'open'
          order by case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end
          limit 5
        ) ranked
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Executives should not need to search for information — information should come to them.',
    'privacy_note', 'Executive command metadata only.',
    'overall_health_score', v_health_avg,
    'activity_since_login', v_since,
    'since_last_login', coalesce((select jsonb_agg(jsonb_build_object(
      'item_key', s.item_key, 'item_title', s.item_title, 'item_category', s.item_category,
      'item_count', s.item_count, 'priority', s.priority, 'summary', s.summary
    ) order by case s.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end)
    from public.organization_ecc590_since_last_login s where s.organization_id = v_org_id), '[]'::jsonb),
    'briefings', coalesce((select jsonb_agg(jsonb_build_object(
      'briefing_key', b.briefing_key, 'briefing_title', b.briefing_title, 'briefing_type', b.briefing_type,
      'revenue_summary', b.revenue_summary, 'customer_summary', b.customer_summary,
      'risk_summary', b.risk_summary, 'operational_summary', b.operational_summary,
      'growth_summary', b.growth_summary, 'companion_recommendations', b.companion_recommendations,
      'briefing_status', b.briefing_status, 'summary', b.summary
    ) order by b.briefing_type) from public.organization_ecc590_briefings b where b.organization_id = v_org_id), '[]'::jsonb),
    'health', coalesce((select jsonb_agg(jsonb_build_object(
      'health_key', h.health_key, 'health_title', h.health_title, 'health_score', h.health_score,
      'health_status', h.health_status, 'summary', h.summary
    ) order by h.health_title) from public.organization_ecc590_health h where h.organization_id = v_org_id), '[]'::jsonb),
    'alerts', coalesce((select jsonb_agg(jsonb_build_object(
      'alert_key', a.alert_key, 'alert_title', a.alert_title, 'alert_type', a.alert_type,
      'priority', a.priority, 'alert_status', a.alert_status,
      'companion_recommendation', a.companion_recommendation, 'summary', a.summary
    ) order by case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end)
    from public.organization_ecc590_alerts a where a.organization_id = v_org_id), '[]'::jsonb),
    'opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
      'opportunity_type', o.opportunity_type, 'priority', o.priority,
      'opportunity_status', o.opportunity_status, 'recommendation', o.recommendation, 'summary', o.summary
    ) order by o.opportunity_title) from public.organization_ecc590_opportunities o where o.organization_id = v_org_id), '[]'::jsonb),
    'actions', coalesce((select jsonb_agg(jsonb_build_object(
      'action_key', a.action_key, 'action_title', a.action_title, 'action_type', a.action_type,
      'priority', a.priority, 'action_status', a.action_status, 'due_at', a.due_at,
      'record_href', a.record_href, 'summary', a.summary
    ) order by case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end)
    from public.organization_ecc590_actions a where a.organization_id = v_org_id), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', t.event_key, 'event_title', t.event_title, 'event_type', t.event_type,
      'occurred_at', t.occurred_at, 'summary', t.summary
    ) order by t.occurred_at desc) from public.organization_ecc590_timeline t where t.organization_id = v_org_id), '[]'::jsonb),
    'board_reports', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title,
      'report_type', r.report_type, 'report_status', r.report_status, 'summary', r.summary
    ) order by r.report_title) from public.organization_ecc590_board_reports r where r.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'events_count', p.events_count,
      'risks_count', p.risks_count, 'opportunities_count', p.opportunities_count,
      'approvals_count', p.approvals_count, 'alerts_count', p.alerts_count, 'summary', p.summary
    ) order by p.pack_title) from public.organization_ecc590_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_ecc590_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_executive', jsonb_build_object(
      'since_last_login', true, 'critical_alerts', true, 'approvals', true,
      'risks', true, 'revenue', true, 'companion_summary', true
    ),
    'command_prompts', jsonb_build_array(
      'Summarize my organization.',
      'Show major changes.',
      'Prepare leadership briefing.',
      'Show top risks.',
      'Show top opportunities.',
      'Prepare board update.'
    )
  );
end;
$$;
