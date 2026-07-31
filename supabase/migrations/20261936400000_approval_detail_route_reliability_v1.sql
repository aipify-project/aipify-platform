-- AIPIFY.KOMPIS.APPROVAL.DETAIL.ROUTE.RELIABILITY.V1
-- Merge CORE.APPROVAL pending requests into ECC actions with canonical
-- `/app/approvals?request=<uuid>` deep links. Retire showcase seed cards
-- that linked to a bare `/app/approvals` list (false pending).
-- Apply side effects: metadata status updates only — no approval decisions,
-- no CMS writes, no website/version mutation.

-- ---------------------------------------------------------------------------
-- 1) Retire false-pending seed approval cards (no CORE id in href)
-- ---------------------------------------------------------------------------
update public.organization_ecc590_actions
set
  action_status = 'completed',
  summary = case
    when coalesce(nullif(trim(summary), ''), '') = '' then 'Retired showcase approval placeholder.'
    when summary ilike '%retired showcase%' then summary
    else summary || ' (retired showcase approval placeholder.)'
  end
where lower(coalesce(action_type, '')) like '%approval%'
  and action_status = 'pending'
  and (
    lower(coalesce(action_key, '')) in ('approval_trust')
    or lower(coalesce(action_key, '')) like 'ps620:%'
    or (
      lower(coalesce(action_title, '')) = 'pending trust approval'
      and (
        record_href is null
        or trim(record_href) = ''
        or trim(record_href) = '/app/approvals'
        or position('request=' in coalesce(record_href, '')) = 0
      )
    )
  );

-- ---------------------------------------------------------------------------
-- 2) ECC GET — pending CORE approvals with canonical detail href
-- ---------------------------------------------------------------------------
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
  v_core_pending integer := 0;
  v_actions jsonb := '[]'::jsonb;
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

  select coalesce(count(*), 0)
  into v_core_pending
  from public.action_requests ar
  where ar.tenant_id = v_org_id
    and ar.status in ('pending', 'awaiting_approval');

  select coalesce(jsonb_agg(row_obj order by sort_rank, created_sort desc), '[]'::jsonb)
  into v_actions
  from (
    -- CORE.APPROVAL pending (canonical deep link)
    select
      jsonb_build_object(
        'action_key', 'core_approval:' || ar.id::text,
        'action_title', case
          when ar.action_name = 'website_publish_approved_draft' then 'Kompis website publish'
          when ar.action_name = 'website_publish_rollback' then 'Kompis website rollback'
          else coalesce(nullif(trim(ar.action_name), ''), 'Pending approval')
        end,
        'action_type', 'approval',
        'priority', case
          when ar.risk_level >= 3 then 'critical'
          when ar.risk_level = 2 then 'urgent'
          when ar.risk_level = 1 then 'attention'
          else 'information'
        end,
        'action_status', 'pending',
        'due_at', null,
        'record_href', '/app/approvals?request=' || ar.id::text,
        'summary', coalesce(ae.explanation, ar.description, 'Action awaiting approval.'),
        'approval_id', ar.id,
        'source', case
          when ar.resource_type = 'kompis_operator_run' then 'kompis'
          else 'trust_action'
        end
      ) as row_obj,
      case
        when ar.risk_level >= 3 then 1
        when ar.risk_level = 2 then 2
        when ar.risk_level = 1 then 3
        else 4
      end as sort_rank,
      ar.created_at as created_sort
    from public.action_requests ar
    left join public.action_explanations ae on ae.action_request_id = ar.id
    where ar.tenant_id = v_org_id
      and ar.status in ('pending', 'awaiting_approval')

    union all

    -- Non-approval ECC operational actions (unchanged)
    select
      jsonb_build_object(
        'action_key', a.action_key,
        'action_title', a.action_title,
        'action_type', a.action_type,
        'priority', a.priority,
        'action_status', a.action_status,
        'due_at', a.due_at,
        'record_href', a.record_href,
        'summary', a.summary
      ) as row_obj,
      case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end as sort_rank,
      coalesce(a.due_at, now()) as created_sort
    from public.organization_ecc590_actions a
    where a.organization_id = v_org_id
      and a.action_status = 'pending'
      and lower(coalesce(a.action_type, '')) not like '%approval%'

    union all

    -- Approval ECC rows only when they already carry a concrete request= UUID
    select
      jsonb_build_object(
        'action_key', a.action_key,
        'action_title', a.action_title,
        'action_type', a.action_type,
        'priority', a.priority,
        'action_status', a.action_status,
        'due_at', a.due_at,
        'record_href', a.record_href,
        'summary', a.summary
      ) as row_obj,
      case a.priority when 'critical' then 1 when 'urgent' then 2 when 'attention' then 3 else 4 end as sort_rank,
      coalesce(a.due_at, now()) as created_sort
    from public.organization_ecc590_actions a
    where a.organization_id = v_org_id
      and a.action_status = 'pending'
      and lower(coalesce(a.action_type, '')) like '%approval%'
      and a.record_href ~* 'request=[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
      and lower(coalesce(a.action_key, '')) not like 'ps620:%'
      and lower(coalesce(a.action_key, '')) <> 'approval_trust'
  ) merged;

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
        'pending_actions', v_core_pending + (
          select count(*) from public.organization_ecc590_actions a
          where a.organization_id = v_org_id
            and a.action_status = 'pending'
            and lower(coalesce(a.action_type, '')) not like '%approval%'
        ),
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
    'actions', v_actions,
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

revoke all on function public.get_organization_executive_command_center(text) from public, anon;
grant execute on function public.get_organization_executive_command_center(text) to authenticated;

comment on function public.get_organization_executive_command_center(text) is
  'ECC read model: CORE pending approvals use canonical /app/approvals?request=<uuid>; seed approval placeholders excluded.';
