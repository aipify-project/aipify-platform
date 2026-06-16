-- Phase 259 — GROWTH Portal Structure Foundation

create or replace function public._gpsf259_resolve_growth_role()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_team_role text;
begin
  if auth.uid() is null then
    return null;
  end if;

  if exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
      and coalesce(pa.status, 'active') = 'active'
  ) then
    return 'super_admin';
  end if;

  select m.team_role
  into v_team_role
  from public.growth_partner_portal_members m
  where m.auth_user_id = auth.uid()
    and m.member_status = 'active'
  order by m.created_at
  limit 1;

  if v_team_role = 'partner_manager' then
    return 'growth_manager';
  end if;

  if v_team_role in ('partner_owner', 'sales_member') then
    return 'growth_partner';
  end if;

  return null;
end;
$$;

create or replace function public._gpsf259_require_growth_access()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := public._gpsf259_resolve_growth_role();
  if v_role is null then
    raise exception 'Growth portal access denied';
  end if;
  return v_role;
end;
$$;

revoke all on function public._gpsf259_resolve_growth_role() from public, anon;
revoke all on function public._gpsf259_require_growth_access() from public, anon;
grant execute on function public._gpsf259_resolve_growth_role() to authenticated;
grant execute on function public._gpsf259_require_growth_access() to authenticated;

create or replace function public.get_growth_portal_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := public._gpsf259_resolve_growth_role();
  return jsonb_build_object(
    'has_access', v_role is not null,
    'role', coalesce(v_role, 'none')
  );
end;
$$;

revoke all on function public.get_growth_portal_access() from public, anon;
grant execute on function public.get_growth_portal_access() to authenticated;

create or replace function public.get_growth_portal_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
  v_org_id uuid;
  v_stats jsonb := '{}'::jsonb;
  v_leads_assigned integer := 0;
  v_converted integer := 0;
  v_total_leads integer := 0;
  v_conversion_rate numeric := 0;
  v_pipeline jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_rankings jsonb := '[]'::jsonb;
  v_monthly jsonb := '{}'::jsonb;
  v_referrals jsonb := '{}'::jsonb;
  v_certification_progress integer := 0;
begin
  v_role := public._gpsf259_require_growth_access();

  if v_role = 'super_admin' then
    v_org_id := public._gppf05_resolve_org();
  else
    v_org_id := public._gppf05_provision_membership();
  end if;

  if v_org_id is not null then
    perform public._gppf05_seed_academy_catalog();
    perform public._gppf05_seed_demo(v_org_id);
    v_stats := public._gppf05_dashboard_stats(v_org_id);

    select count(*)::int
    into v_leads_assigned
    from public.growth_partner_portal_leads l
    where l.partner_org_id = v_org_id
      and l.lead_status not in ('converted', 'lost');

    select count(*)::int
    into v_converted
    from public.growth_partner_portal_leads l
    where l.partner_org_id = v_org_id
      and l.lead_status = 'converted';

    select count(*)::int
    into v_total_leads
    from public.growth_partner_portal_leads l
    where l.partner_org_id = v_org_id;

    v_conversion_rate := round(
      100.0 * v_converted / nullif(v_total_leads, 0),
      1
    );

    select coalesce(jsonb_agg(
      jsonb_build_object(
        'stage', s.stage,
        'count', s.count
      )
      order by s.sort_order
    ), '[]'::jsonb)
    into v_pipeline
    from (
      select l.lead_status as stage, count(*)::int as count,
        case l.lead_status
          when 'new' then 1
          when 'contacted' then 2
          when 'qualified' then 3
          when 'trial_started' then 4
          when 'converted' then 5
          else 6
        end as sort_order
      from public.growth_partner_portal_leads l
      where l.partner_org_id = v_org_id
      group by l.lead_status
    ) s;

    select coalesce(jsonb_agg(
      jsonb_build_object(
        'id', l.id,
        'company_name', l.company_name,
        'contact_name', coalesce(l.contact_name, ''),
        'lead_status', l.lead_status,
        'follow_up_at', l.updated_at
      )
      order by l.updated_at asc
    ), '[]'::jsonb)
    into v_follow_ups
    from (
      select *
      from public.growth_partner_portal_leads
      where partner_org_id = v_org_id
        and lead_status in ('new', 'contacted', 'qualified')
      order by updated_at asc
      limit 5
    ) l;

    select coalesce(avg(p.progress_pct), 0)::int
    into v_certification_progress
    from public.growth_partner_portal_academy_progress p
    where p.partner_org_id = v_org_id;

    v_referrals := jsonb_build_object(
      'active', coalesce((v_stats->>'active_referrals')::int, 0),
      'converted', (
        select count(*)::int
        from public.growth_partner_portal_referrals r
        where r.partner_org_id = v_org_id
          and r.referral_status in ('converted', 'rewarded')
      ),
      'invited', (
        select count(*)::int
        from public.growth_partner_portal_referrals r
        where r.partner_org_id = v_org_id
          and r.referral_status = 'invited'
      )
    );

    v_monthly := jsonb_build_object(
      'leads_this_month', coalesce((v_stats->>'leads_this_month')::int, 0),
      'converted_customers', coalesce((v_stats->>'converted_customers')::int, 0),
      'pending_commissions', coalesce((v_stats->>'pending_commissions')::numeric, 0),
      'upcoming_payouts', coalesce((v_stats->>'upcoming_payouts')::numeric, 0)
    );
  end if;

  v_rankings := jsonb_build_array(
    jsonb_build_object('rank', 1, 'label', 'Regional leaders', 'score', 92),
    jsonb_build_object('rank', 2, 'label', 'Your organization', 'score', 78),
    jsonb_build_object('rank', 3, 'label', 'Network average', 'score', 71)
  );

  return jsonb_build_object(
    'principle', 'Dedicated environment for Growth Partners — acquire customers, improve performance, and grow with Aipify.',
    'access_role', v_role,
    'leads_assigned', v_leads_assigned,
    'conversion_metrics', jsonb_build_object(
      'conversion_rate_pct', v_conversion_rate,
      'converted', v_converted,
      'total_leads', v_total_leads
    ),
    'pipeline_overview', v_pipeline,
    'upcoming_follow_ups', v_follow_ups,
    'partner_rankings', v_rankings,
    'monthly_performance_summary', v_monthly,
    'referral_statistics', v_referrals,
    'certification_progress', v_certification_progress,
    'certification_status', coalesce(v_stats->>'certification_status', 'pending'),
    'privacy_note', 'Growth Partner operational metrics only — no customer business content.'
  );
end;
$$;

revoke all on function public.get_growth_portal_dashboard() from public, anon;
grant execute on function public.get_growth_portal_dashboard() to authenticated;
