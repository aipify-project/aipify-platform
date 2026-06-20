-- Phase 620 P1 — Team, Governance, Briefing, Operations & Recommendations read-only GET repair.
-- Fixes: certifications.view blocking team badges, governance _irp writes, briefing/follow-ups INSERT on GET,
-- legacy tm.company_id / ar.company_id / u.updated_at in APP portal operations RPCs.

-- ---------------------------------------------------------------------------
-- 1. Shared tenant resolver (company_id → customers.id for tenant_modules / action_requests)
-- ---------------------------------------------------------------------------
create or replace function public._ap620_customer_id_for_company(p_company_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id from public.customers c where c.company_id = p_company_id limit 1;
$$;

-- ---------------------------------------------------------------------------
-- 2. Idempotent provisioning (never on GET)
-- ---------------------------------------------------------------------------
insert into public.aipify_briefing_settings (tenant_id)
select c.id from public.customers c
where not exists (select 1 from public.aipify_briefing_settings s where s.tenant_id = c.id)
on conflict (tenant_id) do nothing;

insert into public.organization_governance_settings (organization_id)
select c.id from public.customers c
where not exists (select 1 from public.organization_governance_settings s where s.organization_id = c.id)
on conflict (organization_id) do nothing;

insert into public.companion_follow_up_settings (organization_id)
select c.id from public.customers c
where not exists (select 1 from public.companion_follow_up_settings s where s.organization_id = c.id)
on conflict (organization_id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Team — users.view canonical; badges optional when certifications unavailable
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_team_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_company_id uuid;
begin
  if not public.has_organization_permission('users.view') then
    raise exception 'Permission denied: users.view';
  end if;

  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select c.company_id into v_company_id
  from public.customers c
  where c.id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'members', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', u.id,
        'name', u.full_name,
        'email', coalesce(au.email, ''),
        'role', u.role,
        'status', 'active'
      ) order by u.created_at)
      from public.users u
      left join auth.users au on au.id = u.auth_user_id
      where u.company_id = v_company_id),
      '[]'::jsonb
    ),
    'invitations', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ti.id,
        'email', ti.email,
        'role', ti.role,
        'status', ti.status,
        'created_at', ti.created_at
      ) order by ti.created_at desc)
      from public.team_invitations ti
      where ti.customer_id = v_tenant_id),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.get_user_achievement_badges(p_user_id uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  if not public.has_organization_permission('certifications.view') then
    return '[]'::jsonb;
  end if;

  select c.id into v_org_id
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_org_id is null then
    return '[]'::jsonb;
  end if;

  v_user_id := coalesce(p_user_id, public._mta_app_user_id());

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'badge_key', ab.badge_key,
      'name', ab.name,
      'description', ab.description,
      'module_key', ab.module_key,
      'display_on_profile', ab.display_on_profile,
      'icon_ref', ab.icon_ref,
      'awarded_at', uab.awarded_at,
      'awarded_at_european', public._cae_european_date(uab.awarded_at)
    ) order by uab.awarded_at desc)
    from public.user_achievement_badges uab
    join public.achievement_badges ab on ab.id = uab.badge_id
    where uab.organization_id = v_org_id
      and uab.user_id = v_user_id
      and ab.display_on_profile = true
      and ab.status = 'active'
  ), '[]'::jsonb);
exception
  when others then
    return '[]'::jsonb;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Briefing settings — read-only GET
-- ---------------------------------------------------------------------------
create or replace function public._bs_read_settings(p_tenant_id uuid)
returns public.aipify_briefing_settings
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.aipify_briefing_settings;
begin
  select * into v_row from public.aipify_briefing_settings where tenant_id = p_tenant_id;
  if found then return v_row; end if;
  v_row.tenant_id := p_tenant_id;
  v_row.enabled := true;
  v_row.since_last_login_enabled := true;
  v_row.daily_brief_enabled := true;
  v_row.executive_brief_enabled := false;
  v_row.operational_brief_enabled := true;
  v_row.default_daily_time := '08:00';
  v_row.default_timezone := 'Europe/Oslo';
  v_row.max_default_items := 12;
  v_row.include_quality := true;
  v_row.include_support := true;
  v_row.include_knowledge := true;
  v_row.include_governance := true;
  v_row.include_automation := true;
  v_row.include_insights := true;
  v_row.include_integrations := true;
  v_row.include_memory := true;
  return v_row;
end;
$$;

create or replace function public.get_briefing_settings()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_briefing_settings;
begin
  v_tenant_id := public._bs_require_tenant();
  v_row := public._bs_read_settings(v_tenant_id);
  return jsonb_build_object(
    'enabled', v_row.enabled,
    'since_last_login_enabled', v_row.since_last_login_enabled,
    'daily_brief_enabled', v_row.daily_brief_enabled,
    'executive_brief_enabled', v_row.executive_brief_enabled,
    'operational_brief_enabled', v_row.operational_brief_enabled,
    'default_daily_time', v_row.default_daily_time,
    'default_timezone', v_row.default_timezone,
    'max_default_items', v_row.max_default_items,
    'include_quality', v_row.include_quality,
    'include_support', v_row.include_support,
    'include_knowledge', v_row.include_knowledge,
    'include_governance', v_row.include_governance,
    'include_automation', v_row.include_automation,
    'include_insights', v_row.include_insights,
    'include_integrations', v_row.include_integrations,
    'include_memory', coalesce(v_row.include_memory, true)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Governance Management Center — has_organization_permission; no writes on GET
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_management_center(p_section text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_scope jsonb;
  v_overview jsonb;
  v_policies jsonb;
  v_approvals jsonb;
  v_access_reviews jsonb;
  v_compliance jsonb;
  v_risks jsonb;
  v_controls jsonb;
  v_audit jsonb;
  v_reports jsonb;
begin
  if not public.has_organization_permission('governance.view')
     and not public.has_organization_permission('governance.manage') then
    raise exception 'Permission denied: governance.view';
  end if;

  v_org_id := public._ogv515_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  begin
    v_user_id := public._mta_app_user_id();
  exception when others then
    v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  end;

  begin
    v_scope := public._rae514_actor_scope(v_org_id);
  exception when others then
    v_scope := jsonb_build_object('scope', 'organization');
  end;

  select jsonb_build_object(
    'governance_health', public._ogv515_health_score(v_org_id),
    'open_risks', (select count(*) from public.organization_governance_risks where organization_id = v_org_id and status in ('open', 'mitigating')),
    'pending_approvals', (select count(*) from public.organization_governance_approval_requests where organization_id = v_org_id and status = 'pending'),
    'pending_access_reviews', (select count(*) from public.organization_governance_access_reviews where organization_id = v_org_id and status in ('scheduled', 'in_progress', 'overdue')),
    'active_policies', (select count(*) from public.organization_governance_policies where organization_id = v_org_id and status = 'active'),
    'expiring_policies', (select count(*) from public.organization_governance_policies where organization_id = v_org_id and status = 'expiring'),
    'pending_acknowledgements', (
      select count(*) from public.organization_governance_policies p
      where p.organization_id = v_org_id and p.status = 'active' and p.requires_acknowledgement
        and not exists (
          select 1 from public.organization_governance_policy_acknowledgements a
          where a.policy_id = p.id and a.user_id = v_user_id and a.response = 'accepted'
        )
    ),
    'compliance_attention', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status in ('requires_attention', 'high_risk', 'critical_risk')),
    'control_violations_30d', (
      select count(*) from public.organization_governance_audit_logs
      where organization_id = v_org_id and event_type = 'control_violation' and created_at >= now() - interval '30 days'
    )
  ) into v_overview;

  select coalesce(jsonb_agg(public._ogv515_policy_json(p) order by p.updated_at desc), '[]'::jsonb)
  into v_policies
  from (
    select * from public.organization_governance_policies
    where organization_id = v_org_id and status <> 'retired'
    order by updated_at desc limit 50
  ) p;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'request_type', r.request_type, 'title', r.title, 'summary', r.summary,
    'status', r.status, 'companion_suggested', r.companion_suggested, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_approvals
  from public.organization_governance_approval_requests r
  where r.organization_id = v_org_id and r.status = 'pending'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_key', r.review_key, 'title', r.title, 'status', r.status,
    'due_date', r.due_date,
    'item_count', (select count(*) from public.organization_governance_access_review_items i where i.review_id = r.id)
  ) order by r.due_date nulls last), '[]'::jsonb)
  into v_access_reviews
  from public.organization_governance_access_reviews r
  where r.organization_id = v_org_id and r.status <> 'cancelled'
  limit 30;

  select jsonb_build_object(
    'compliant', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'compliant'),
    'requires_attention', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'requires_attention'),
    'high_risk', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'high_risk'),
    'critical_risk', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'critical_risk'),
    'records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'compliance_type', c.compliance_type, 'status', c.status,
        'title', c.title, 'summary', c.summary, 'due_date', c.due_date
      ) order by c.updated_at desc)
      from (select * from public.organization_governance_compliance_records where organization_id = v_org_id order by updated_at desc limit 20) c
    ), '[]'::jsonb)
  ) into v_compliance;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_number', r.risk_number, 'category', r.category, 'title', r.title,
    'impact', r.impact, 'likelihood', r.likelihood, 'status', r.status, 'mitigation_plan', r.mitigation_plan
  ) order by case r.impact when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_risks
  from public.organization_governance_risks r
  where r.organization_id = v_org_id and r.status <> 'closed'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'control_key', c.control_key, 'title', c.title, 'control_type', c.control_type,
    'trigger_action', c.trigger_action, 'is_active', c.is_active
  ) order by c.title), '[]'::jsonb)
  into v_controls
  from public.organization_governance_controls c
  where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'event_category', a.event_category,
    'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.organization_governance_audit_logs where organization_id = v_org_id order by created_at desc limit 25) a;

  select jsonb_build_object(
    'policy_compliance', (select count(*) from public.organization_governance_policies where organization_id = v_org_id and status = 'active'),
    'access_reviews_open', (select count(*) from public.organization_governance_access_reviews where organization_id = v_org_id and status in ('scheduled', 'in_progress', 'overdue')),
    'audit_events_30d', (select count(*) from public.organization_governance_audit_logs where organization_id = v_org_id and created_at >= now() - interval '30 days'),
    'approval_stats', jsonb_build_object(
      'pending', (select count(*) from public.organization_governance_approval_requests where organization_id = v_org_id and status = 'pending'),
      'approved_30d', (select count(*) from public.organization_governance_approval_requests where organization_id = v_org_id and status = 'approved' and updated_at >= now() - interval '30 days')
    ),
    'control_violations', (select count(*) from public.organization_governance_audit_logs where organization_id = v_org_id and event_type = 'control_violation')
  ) into v_reports;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify helps organizations operate efficiently. Governance ensures they operate responsibly.',
    'companion_note', 'Companion may recommend actions. Companion may not bypass governance.',
    'structure', 'PLATFORM → APP → GOVERNANCE ENGINE → DEPARTMENTS → EMPLOYEES',
    'visibility', v_scope,
    'overview', v_overview,
    'policies', v_policies,
    'approvals', v_approvals,
    'access_reviews', v_access_reviews,
    'compliance', v_compliance,
    'risks', v_risks,
    'controls', v_controls,
    'audit_recent', v_audit,
    'reports', v_reports,
    'routes', jsonb_build_object(
      'policies', '/app/governance/policies',
      'access_reviews', '/app/governance/access-reviews',
      'compliance', '/app/governance/compliance',
      'risk', '/app/governance/risk',
      'audit', '/app/governance/audit',
      'controls', '/app/governance/controls',
      'approval_center', '/app/governance/approval-center',
      'permissions', '/app/governance/permissions-access',
      'trust', '/app/governance/trust-transparency',
      'tacc', '/app/governance/trust'
    ),
    'sections', jsonb_build_array(
      'overview', 'policies', 'approvals', 'access_reviews', 'compliance',
      'audit', 'risk', 'controls', 'reports'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Companion follow-up dashboard — read-only GET (operations uses list_app_portal_follow_ups)
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_follow_up_dashboard(
  p_status text default null, p_priority text default null, p_owner text default null,
  p_department text default null, p_category text default null, p_due_from date default null,
  p_due_to date default null, p_search text default null
) returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_role text;
  v_items jsonb;
  v_timeline jsonb;
  v_open int;
  v_overdue int;
  v_upcoming int;
  v_completed int;
  v_total int;
  v_health int;
  v_success numeric;
begin
  v_ctx := public._cfu328_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');

  select count(*) filter (where status in ('open','pending','waiting')),
         count(*) filter (where status = 'overdue'),
         count(*) filter (where status in ('open','pending') and due_date >= current_date and due_date <= current_date + 7),
         count(*) filter (where status = 'completed'),
         count(*)
  into v_open, v_overdue, v_upcoming, v_completed, v_total
  from public.companion_follow_up_records
  where organization_id = v_org_id and user_id = v_user_id and status != 'archived';

  v_success := case when v_total = 0 then 0 else round((v_completed::numeric / v_total) * 100, 1) end;
  v_health := greatest(0, least(100, 100 - (v_overdue * 12) - (v_open / 2)::int));

  select coalesce(jsonb_agg(public._cfu328_item_json(r) order by
    case r.status when 'overdue' then 1 when 'open' then 2 when 'waiting' then 3 when 'pending' then 4 else 5 end,
    case r.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end),'[]'::jsonb)
  into v_items
  from public.companion_follow_up_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id and r.status != 'archived'
    and (p_status is null or r.status = p_status)
    and (p_priority is null or r.priority = p_priority)
    and (p_owner is null or r.assigned_to ilike '%'||trim(p_owner)||'%' or r.owner_label ilike '%'||trim(p_owner)||'%')
    and (p_department is null or r.department ilike '%'||trim(p_department)||'%')
    and (p_category is null or r.category = p_category)
    and (p_due_from is null or r.due_date >= p_due_from)
    and (p_due_to is null or r.due_date <= p_due_to)
    and (p_search is null or trim(p_search) = ''
         or r.title ilike '%'||trim(p_search)||'%' or r.description ilike '%'||trim(p_search)||'%'
         or r.explanation ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (select * from public.companion_follow_up_timeline t
    where t.organization_id = v_org_id and (t.user_id = v_user_id or t.user_id is null)
    order by t.created_at desc limit 12) t;

  return jsonb_build_object(
    'found', true,
    'has_follow_ups', v_total > 0,
    'role', v_role,
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive','false') = 'true',
    'follow_up_health_score', v_health,
    'open_count', v_open,
    'overdue_count', v_overdue,
    'upcoming_count', v_upcoming,
    'completed_count', v_completed,
    'success_rate', v_success,
    'items', v_items,
    'timeline', v_timeline,
    'usage_example', 'You mentioned following up with this customer but no activity has been recorded.',
    'privacy_note', 'Aipify assists with follow-up recommendations. Users remain responsible for decisions and communication.',
    'principle', 'Help users keep commitments. Improve accountability. Support trust and reliability.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Business Pack Recommendations — tenant_modules.tenant_id
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_business_pack_recommendation_engine(
  p_industry text default null,
  p_category text default null,
  p_complexity text default null,
  p_business_impact text default null,
  p_confidence_level text default null,
  p_installed_status text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_user_id uuid;
  v_items jsonb;
  v_filtered jsonb;
  v_installed jsonb := '[]'::jsonb;
  v_saved jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
  v_categories jsonb := '[]'::jsonb;
begin
  if not public.has_organization_permission('business_recommendations.view')
     and not public.has_organization_permission('business_recommendations.manage') then
    raise exception 'Permission denied: business_recommendations.view';
  end if;

  v_ctx := public._abpre302_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);
  v_user_id := (v_ctx->>'user_id')::uuid;

  v_items := public._abpre302_build_recommendations(v_company_id, v_user_id);
  v_filtered := public._abpre302_filter_items(
    v_items, p_industry, p_category, p_complexity, p_business_impact,
    p_confidence_level, p_installed_status, p_search
  );

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'pack_key', tm.module_key, 'name', initcap(replace(tm.module_key, '_', ' ')), 'status', tm.status
    )), '[]'::jsonb)
    into v_installed
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if coalesce(v_ctx->>'can_full', 'false') = 'true' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'pack_key', s.pack_key, 'saved_at', s.saved_at
    ) order by s.saved_at desc), '[]'::jsonb)
    into v_saved
    from public.app_portal_business_pack_saved_recommendations s
    where s.company_id = v_company_id and s.saved_by = v_user_id;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('pack_key', rv.pack_key, 'viewed_at', rv.viewed_at)), '[]'::jsonb)
  into v_recent
  from (
    select v.pack_key, max(v.viewed_at) as viewed_at
    from public.app_portal_business_pack_recommendation_views v
    where v.company_id = v_company_id and v.viewed_by = v_user_id
    group by v.pack_key
    order by max(v.viewed_at) desc
    limit 5
  ) rv;

  select coalesce(jsonb_agg(distinct r->>'category'), '[]'::jsonb) into v_categories
  from jsonb_array_elements(v_filtered) r;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'has_recommendations', jsonb_array_length(v_filtered) > 0,
    'recommendations', v_filtered,
    'installed_packs', v_installed,
    'saved_recommendations', v_saved,
    'recently_viewed', v_recent,
    'operational_categories', v_categories,
    'principle', 'Aipify provides advisory recommendations — organizations always decide what to install.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Executive Insights — action_requests.tenant_id + tenant_modules.tenant_id
-- ---------------------------------------------------------------------------
create or replace function public.get_app_portal_executive_insights()
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
  v_health integer := 82;
  v_trend text := 'stable';
  v_pending_approvals integer := 0;
  v_critical_support integer := 0;
  v_blocked_actions integer := 0;
  v_unread_notifications integer := 0;
  v_billing_issue boolean := false;
  v_sub_status text := 'active';
  v_team_new integer := 0;
  v_integrations integer := 0;
  v_packs_installed integer := 0;
  v_tasks_completed integer := 0;
  v_priorities jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_since_last_login jsonb := '{}'::jsonb;
  v_factors jsonb := '[]'::jsonb;
  v_priority_count integer := 0;
begin
  v_access := public._apei267_require_executive_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
  end if;

  if to_regclass('public.support_cases') is not null then
    select count(*)::int into v_critical_support
    from public.support_cases sc
    where sc.tenant_id = v_customer_id
      and sc.status not in ('resolved', 'closed')
      and sc.risk_level in ('high', 'critical');
  end if;

  if to_regclass('public.aipify_actions') is not null and v_customer_id is not null then
    select count(*)::int into v_blocked_actions
    from public.aipify_actions a
    where a.tenant_id = v_customer_id and a.status = 'blocked';
  end if;

  if to_regclass('public.presence_notifications') is not null then
    select count(*)::int into v_unread_notifications
    from public.presence_notifications pn
    where pn.company_id = v_company_id and pn.read_at is null;
  end if;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    begin
      v_sub_status := coalesce(public.get_customer_license_center()->'subscription'->>'status', 'active');
      v_billing_issue := v_sub_status in ('past_due', 'paused', 'canceled');
    exception when others then null;
    end;
  end if;

  select count(*)::int into v_team_new
  from public.users u
  where u.company_id = v_company_id
    and u.created_at > now() - interval '30 days';

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int into v_integrations
    from public.app_portal_integration_connections c
    where c.company_id = v_company_id and c.status = 'connected';
  elsif to_regclass('public.calendar_connections') is not null then
    select count(*)::int into v_integrations
    from public.calendar_connections cc
    where cc.company_id = v_company_id and cc.status = 'connected';
  end if;

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int into v_packs_installed
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.aipify_actions') is not null and v_customer_id is not null then
    select count(*)::int into v_tasks_completed
    from public.aipify_actions a
    where a.tenant_id = v_customer_id
      and a.status = 'executed'
      and a.executed_at > now() - interval '7 days';
  end if;

  v_health := greatest(25, least(98,
    100
    - v_pending_approvals * 4
    - v_critical_support * 8
    - v_blocked_actions * 6
    - case when v_billing_issue then 15 else 0 end
    - case when v_unread_notifications > 10 then 5 else 0 end
  ));

  v_trend := case
    when v_pending_approvals + v_critical_support + v_blocked_actions = 0 then 'improving'
    when v_pending_approvals + v_critical_support > 3 then 'declining'
    else 'stable'
  end;

  v_factors := jsonb_build_array(
    jsonb_build_object('key', 'support_backlog', 'label', 'Support backlog', 'value', v_critical_support, 'status', case when v_critical_support > 0 then 'warning' else 'healthy' end),
    jsonb_build_object('key', 'pending_approvals', 'label', 'Pending approvals', 'value', v_pending_approvals, 'status', case when v_pending_approvals > 3 then 'warning' when v_pending_approvals > 0 then 'monitor' else 'healthy' end),
    jsonb_build_object('key', 'operational_delays', 'label', 'Operational delays', 'value', v_blocked_actions, 'status', case when v_blocked_actions > 0 then 'warning' else 'healthy' end),
    jsonb_build_object('key', 'billing', 'label', 'Billing status', 'value', v_sub_status, 'status', case when v_billing_issue then 'critical' else 'healthy' end),
    jsonb_build_object('key', 'notifications', 'label', 'Unread notifications', 'value', v_unread_notifications, 'status', case when v_unread_notifications > 10 then 'warning' else 'healthy' end)
  );

  if v_pending_approvals > 0 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'review-approvals',
      'title', format('Review %s pending approval%s', v_pending_approvals, case when v_pending_approvals = 1 then '' else 's' end),
      'href', '/app/approvals',
      'kind', 'approval'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_critical_support > 0 and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'resolve-support',
      'title', format('Resolve %s critical support case%s', v_critical_support, case when v_critical_support = 1 then '' else 's' end),
      'href', '/app/support',
      'kind', 'support'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_integrations = 0 and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'connect-integration',
      'title', 'Complete integration setup',
      'href', '/app/platform/integrations/connect',
      'kind', 'integration'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_blocked_actions > 0 and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'unblock-actions',
      'title', format('Assign owner to %s blocked task%s', v_blocked_actions, case when v_blocked_actions = 1 then '' else 's' end),
      'href', '/app/action-center',
      'kind', 'task'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_billing_issue and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'billing-review',
      'title', 'Review billing and subscription status',
      'href', '/app/billing/subscription',
      'kind', 'billing'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if exists (select 1 from pg_proc where proname = 'get_since_last_login_engine') then
    begin
      v_since_last_login := public.get_since_last_login_engine('customer', false);
    exception when others then
      v_since_last_login := jsonb_build_object(
        'new_team_members', v_team_new,
        'integrations_connected', v_integrations,
        'business_packs_installed', v_packs_installed,
        'tasks_completed', v_tasks_completed,
        'major_events', '[]'::jsonb,
        'billing_events', case when v_billing_issue then jsonb_build_array('Subscription requires attention') else '[]'::jsonb end
      );
    end;
  else
    v_since_last_login := jsonb_build_object(
      'new_team_members', v_team_new,
      'integrations_connected', v_integrations,
      'business_packs_installed', v_packs_installed,
      'tasks_completed', v_tasks_completed,
      'major_events', '[]'::jsonb,
      'billing_events', case when v_billing_issue then jsonb_build_array('Subscription requires attention') else '[]'::jsonb end
    );
  end if;

  if v_tasks_completed > 0 then
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'tasks-completed',
      'title', format('%s task%s completed this week', v_tasks_completed, case when v_tasks_completed = 1 then '' else 's' end),
      'detail', 'Operational momentum is positive',
      'severity', 'low'
    );
  end if;

  if v_integrations > 0 then
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'integrations-active',
      'title', format('%s integration%s connected', v_integrations, case when v_integrations = 1 then '' else 's' end),
      'detail', 'Systems are connected and operational',
      'severity', 'low'
    );
  end if;

  if v_health >= 75 and v_trend in ('stable', 'improving') then
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'org-health',
      'title', 'Organization health is strong',
      'detail', 'Continue current operational practices',
      'severity', 'low'
    );
  end if;

  if v_pending_approvals > 2 then
    v_risks := v_risks || jsonb_build_object(
      'id', 'approval-backlog',
      'title', 'Approvals accumulating',
      'detail', format('%s decisions awaiting review', v_pending_approvals),
      'severity', case when v_pending_approvals > 5 then 'high' when v_pending_approvals > 3 then 'medium' else 'low' end
    );
  end if;

  if v_billing_issue then
    v_risks := v_risks || jsonb_build_object(
      'id', 'billing-risk',
      'title', 'Billing requires attention',
      'detail', format('Subscription status: %s', v_sub_status),
      'severity', 'high'
    );
  end if;

  if v_blocked_actions > 0 then
    v_risks := v_risks || jsonb_build_object(
      'id', 'blocked-operations',
      'title', 'Operational delays detected',
      'detail', format('%s blocked execution item%s', v_blocked_actions, case when v_blocked_actions = 1 then '' else 's' end),
      'severity', case when v_blocked_actions > 2 then 'high' else 'medium' end
    );
  end if;

  if v_critical_support > 0 then
    v_risks := v_risks || jsonb_build_object(
      'id', 'support-critical',
      'title', 'Critical support cases open',
      'detail', format('%s case%s need executive awareness', v_critical_support, case when v_critical_support = 1 then '' else 's' end),
      'severity', 'high'
    );
  end if;

  v_recommendations := jsonb_build_array(
    jsonb_build_object(
      'id', 'team-review',
      'title', 'Schedule a team review',
      'why', 'Align on priorities and unblock decisions',
      'expected_impact', 'Faster resolution of pending items',
      'action', 'Open Command Center',
      'href', '/app/command-center'
    ),
    jsonb_build_object(
      'id', 'approval-delegation',
      'title', 'Enable approval delegation',
      'why', 'Reduce approval bottlenecks for routine decisions',
      'expected_impact', 'Lower pending approval count',
      'action', 'Review approval policies',
      'href', '/app/approvals'
    )
  );

  if v_packs_installed = 0 then
    v_recommendations := v_recommendations || jsonb_build_object(
      'id', 'install-pack',
      'title', 'Install Support Business Pack',
      'why', 'Expand operational capabilities for your team',
      'expected_impact', 'Improved support and workflow coverage',
      'action', 'Explore Business Packs',
      'href', '/app/business-packs/available'
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'principle', 'Executive Insights supports decision-making. Final decisions remain under human control.',
    'sparse_data', (v_pending_approvals + v_critical_support + v_blocked_actions + v_packs_installed + v_integrations) = 0,
    'health', jsonb_build_object(
      'score', v_health,
      'trend', v_trend,
      'status', public._apei267_health_band(v_health),
      'status_label', initcap(replace(public._apei267_health_band(v_health), '_', ' ')),
      'factors', v_factors
    ),
    'priorities', v_priorities,
    'since_last_login', v_since_last_login,
    'opportunities', v_opportunities,
    'risks', v_risks,
    'recommendations', v_recommendations
  );
exception when others then
  return jsonb_build_object(
    'found', false,
    'has_access', false,
    'error', sqlerrm
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Decision Center list — tenant_modules + action_requests tenant_id
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_decisions(
  p_category text default null,
  p_status text default null,
  p_owner_id uuid default null,
  p_impact_level text default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_outcome_rating integer default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_suggestions jsonb := '[]'::jsonb;
  v_packs integer := 0;
  v_recent_approvals integer := 0;
begin
  v_ctx := public._apdc269_access_context();
  if coalesce(v_ctx->>'can_read', 'false') <> 'true' then
    raise exception 'Decision Center access denied';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);

  select coalesce(jsonb_agg(public._apdc269_decision_row(d) order by d.decision_date desc), '[]'::jsonb)
  into v_items
  from public.app_portal_decisions d
  where d.company_id = v_company_id
    and (p_category is null or d.category = p_category)
    and (p_status is null or d.status = p_status)
    and (p_owner_id is null or d.decision_owner_id = p_owner_id)
    and (p_impact_level is null or d.impact_level = p_impact_level)
    and (p_date_from is null or d.decision_date >= p_date_from)
    and (p_date_to is null or d.decision_date <= p_date_to)
    and (p_outcome_rating is null or d.outcome_rating = p_outcome_rating)
    and (
      p_search is null or trim(p_search) = ''
      or d.title ilike '%' || trim(p_search) || '%'
      or d.description ilike '%' || trim(p_search) || '%'
    );

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id
      and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_recent_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id
      and ar.status = 'approved'
      and ar.updated_at > now() - interval '14 days';
  end if;

  if v_packs > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-business-pack',
      'title', 'New Business Pack adopted — consider documenting the decision',
      'category', 'technology',
      'impact_level', 'moderate',
      'requires_review', true
    );
  end if;

  if v_recent_approvals > 2 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-operational-change',
      'title', 'Major operational changes detected through recent approvals',
      'category', 'operational',
      'impact_level', 'high',
      'requires_review', true
    );
  end if;

  v_suggestions := v_suggestions || jsonb_build_object(
    'id', 'suggest-strategic-review',
    'title', 'Periodic strategic decision review recommended',
    'category', 'strategic',
    'impact_level', 'moderate',
    'requires_review', true
  );

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'suggestions', v_suggestions,
    'principle', 'Aipify supports human decision-making through documentation and organizational memory. Final authority always remains with people.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Follow-ups list — action_requests.tenant_id
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_follow_ups(
  p_category text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_priority text default null,
  p_overdue_only boolean default false
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_suggestions jsonb := '[]'::jsonb;
  v_reminders jsonb := '[]'::jsonb;
  v_pending_approvals integer := 0;
  v_open_support integer := 0;
  v_blocked integer := 0;
begin
  v_ctx := public._apfuc268_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);

  select coalesce(jsonb_agg(public._apfuc268_follow_up_row(f) order by
    case f.priority when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end,
    f.due_at asc nulls last,
    f.created_at desc
  ), '[]'::jsonb)
  into v_items
  from public.app_portal_follow_ups f
  where f.company_id = v_company_id
    and public._apfuc268_can_view_follow_up(f.company_id, f.assigned_owner_id, f.created_by, v_ctx)
    and (p_category is null or f.category = p_category)
    and (p_owner_id is null or f.assigned_owner_id = p_owner_id)
    and (p_status is null or f.status = p_status)
    and (p_priority is null or f.priority = p_priority)
    and (not p_overdue_only or (f.due_at < now() and f.status not in ('completed', 'cancelled')));

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
  end if;

  if to_regclass('public.support_cases') is not null and v_customer_id is not null then
    select count(*)::int into v_open_support
    from public.support_cases sc
    where sc.tenant_id = v_customer_id
      and sc.status not in ('resolved', 'closed', 'auto_replied');
  end if;

  if to_regclass('public.aipify_actions') is not null and v_customer_id is not null then
    select count(*)::int into v_blocked
    from public.aipify_actions a
    where a.tenant_id = v_customer_id and a.status = 'blocked';
  end if;

  if v_pending_approvals > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-approval-backlog',
      'title', format('Approval has remained pending (%s awaiting review)', v_pending_approvals),
      'category', 'pending_decision',
      'priority', case when v_pending_approvals > 3 then 'high' else 'medium' end,
      'suggested_next_action', 'Review pending approvals and assign owners',
      'related_module', 'approvals',
      'requires_review', true
    );
  end if;

  if v_open_support > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-customer-reply',
      'title', 'Customer may not have received a reply',
      'category', 'customer_follow_up',
      'priority', 'high',
      'suggested_next_action', 'Review open support cases and confirm responses',
      'related_module', 'support',
      'requires_review', true
    );
  end if;

  if v_blocked > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-strategic-stall',
      'title', format('Strategic action%s have not progressed', case when v_blocked > 1 then 's' else '' end),
      'category', 'strategic_reminder',
      'priority', 'medium',
      'suggested_next_action', 'Unblock or reassign stalled initiatives',
      'related_module', 'action_center',
      'requires_review', true
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'message', format('This commitment has been open for %s days.', greatest(1, extract(day from now() - f.created_at)::int)),
    'follow_up_id', f.id,
    'title', f.title
  ) order by f.created_at asc), '[]'::jsonb)
  into v_reminders
  from public.app_portal_follow_ups f
  where f.company_id = v_company_id
    and f.status not in ('completed', 'cancelled')
    and f.created_at < now() - interval '14 days'
    and public._apfuc268_can_view_follow_up(f.company_id, f.assigned_owner_id, f.created_by, v_ctx)
  limit 5;

  if v_pending_approvals > 0 then
    v_reminders := v_reminders || jsonb_build_object(
      'message', 'This approval has exceeded its expected response time.',
      'follow_up_id', null,
      'title', 'Pending approvals'
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'suggestions', v_suggestions,
    'smart_reminders', v_reminders,
    'categories', jsonb_build_array(
      'customer_follow_up', 'internal_follow_up', 'pending_decision',
      'waiting_external', 'strategic_reminder', 'overdue_commitment'
    ),
    'principle', 'Follow-ups preserve commitments — Aipify surfaces what needs attention, people decide what happens next.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Activity History — action_requests + tenant_modules tenant_id
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_activity_history(
  p_event_type text default null,
  p_module text default null,
  p_user_id uuid default null,
  p_severity text default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_org_name text;
  v_items jsonb := '[]'::jsonb;
  v_chunk jsonb;
  r record;
begin
  v_ctx := public._apah270_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);
  v_org_name := coalesce(v_ctx->>'organization_name', 'Organization');

  if to_regclass('public.app_portal_follow_up_audit_logs') is not null then
    for r in
      select l.id, l.event_type, l.description, l.performed_by, l.created_at, l.follow_up_id, l.metadata,
             f.title as entity_title, u.full_name as user_name
      from public.app_portal_follow_up_audit_logs l
      join public.app_portal_follow_ups f on f.id = l.follow_up_id
      left join public.users u on u.id = l.performed_by
      where l.company_id = v_company_id
        and public._apah270_can_view_event(l.performed_by, v_ctx)
      order by l.created_at desc
      limit 100
    loop
      v_chunk := public._apah270_event_row(
        'fu-' || r.id::text,
        case when r.event_type = 'status_changed' and coalesce(r.metadata->>'status', '') = 'completed' then 'follow_up_completed' else 'follow_up_updated' end,
        coalesce(r.entity_title, 'Follow-up activity'),
        r.description,
        'follow_ups',
        r.performed_by,
        r.user_name,
        r.created_at,
        v_org_name,
        r.follow_up_id,
        'follow_up',
        case
          when r.event_type = 'status_changed' and coalesce(r.metadata->>'status', '') = 'completed' then 'notice'
          when coalesce((r.metadata->>'is_suggestion')::boolean, false) then 'notice'
          else 'info'
        end,
        '/app/operations/follow-ups/' || r.follow_up_id::text
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  if to_regclass('public.app_portal_decision_audit_logs') is not null then
    for r in
      select l.id, l.event_type, l.description, l.performed_by, l.created_at, l.decision_id,
             d.title as entity_title, u.full_name as user_name
      from public.app_portal_decision_audit_logs l
      join public.app_portal_decisions d on d.id = l.decision_id
      left join public.users u on u.id = l.performed_by
      where l.company_id = v_company_id
        and public._apah270_can_view_event(l.performed_by, v_ctx)
      order by l.created_at desc
      limit 100
    loop
      v_chunk := public._apah270_event_row(
        'dc-' || r.id::text,
        case when r.event_type = 'evaluated' then 'decision_evaluated' else 'decision_recorded' end,
        coalesce(r.entity_title, 'Decision activity'),
        r.description,
        'decision_center',
        r.performed_by,
        r.user_name,
        r.created_at,
        v_org_name,
        r.decision_id,
        'decision',
        case when r.event_type = 'evaluated' then 'important' when r.event_type = 'created' then 'notice' else 'info' end,
        '/app/operations/decision-center/' || r.decision_id::text
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    for r in
      select ar.id, ar.action_name, ar.status, ar.risk_level, ar.created_at, ar.updated_at
      from public.action_requests ar
      where ar.tenant_id = v_customer_id
        and coalesce(v_ctx->>'can_manage', 'false') = 'true'
      order by ar.created_at desc
      limit 50
    loop
      v_chunk := public._apah270_event_row(
        'ar-' || r.id::text || '-req',
        'approval_requested',
        coalesce(r.action_name, 'Approval request'),
        format('Approval requested — status %s', r.status),
        'approvals',
        null,
        'System',
        r.created_at,
        v_org_name,
        r.id,
        'approval',
        case when r.risk_level >= 3 then 'critical' when r.risk_level >= 2 then 'important' else 'notice' end,
        '/app/approvals'
      );
      v_items := v_items || jsonb_build_array(v_chunk);
      if r.status in ('approved', 'rejected') then
        v_chunk := public._apah270_event_row(
          'ar-' || r.id::text || '-done',
          'approval_completed',
          coalesce(r.action_name, 'Approval completed'),
          format('Approval %s', r.status),
          'approvals',
          null,
          'System',
          coalesce(r.updated_at, r.created_at),
          v_org_name,
          r.id,
          'approval',
          case when r.status = 'rejected' then 'important' else 'notice' end,
          '/app/approvals'
        );
        v_items := v_items || jsonb_build_array(v_chunk);
      end if;
    end loop;
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    for r in
      select c.id, c.provider_key, c.status, c.created_by, c.updated_at, u.full_name as user_name
      from public.app_portal_integration_connections c
      left join public.users u on u.id = c.created_by
      where c.company_id = v_company_id
        and c.status = 'connected'
        and public._apah270_can_view_event(c.created_by, v_ctx)
      order by c.updated_at desc
      limit 50
    loop
      v_chunk := public._apah270_event_row(
        'ic-' || r.id::text,
        'integration_connected',
        format('Integration connected — %s', r.provider_key),
        format('Provider %s is connected', r.provider_key),
        'integrations',
        r.created_by,
        r.user_name,
        r.updated_at,
        v_org_name,
        r.id,
        'integration',
        'notice',
        '/app/platform/integrations/connected'
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  if to_regclass('public.tenant_modules') is not null
     and v_customer_id is not null
     and coalesce(v_ctx->>'can_manage', 'false') = 'true' then
    for r in
      select tm.id, tm.module_key, tm.created_at
      from public.tenant_modules tm
      where tm.tenant_id = v_customer_id
        and tm.status in ('enabled', 'trial', 'beta')
      order by tm.created_at desc
      limit 30
    loop
      v_chunk := public._apah270_event_row(
        'bp-' || r.id::text,
        'business_pack_installed',
        format('Business Pack — %s', r.module_key),
        format('Module %s enabled', r.module_key),
        'business_packs',
        null,
        'System',
        r.created_at,
        v_org_name,
        r.id,
        'business_pack',
        'notice',
        '/app/business-packs/installed'
      );
      v_items := v_items || jsonb_build_array(v_chunk);
    end loop;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'events', (
      select coalesce(jsonb_agg(e order by (e->>'timestamp') desc), '[]'::jsonb)
      from (
        select e
        from jsonb_array_elements(v_items) e
        where (p_event_type is null or e->>'event_type' = p_event_type)
          and (p_module is null or e->>'module_source' = p_module)
          and (p_user_id is null or (e->>'user_id')::uuid = p_user_id)
          and (p_severity is null or e->>'severity' = p_severity)
          and (p_date_from is null or (e->>'timestamp')::timestamptz >= p_date_from)
          and (p_date_to is null or (e->>'timestamp')::timestamptz <= p_date_to)
          and (
            p_search is null or trim(p_search) = ''
            or e->>'title' ilike '%' || trim(p_search) || '%'
            or e->>'description' ilike '%' || trim(p_search) || '%'
          )
      ) filtered
    ),
    'principle', 'Activity history preserves a transparent record of organizational actions.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Capability Center — users.last_login_at; tenant_id; read-only GET
-- ---------------------------------------------------------------------------
create or replace function public._apmc275_compute_bundle(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_customer_id uuid;
  v_team integer := 0;
  v_admins integer := 0;
  v_active integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_2fa integer := 0;
  v_pending_approvals integer := 0;
  v_open_follow_ups integer := 0;
  v_completed_follow_ups integer := 0;
  v_decisions integer := 0;
  v_activity_events integer := 0;
  v_onboarding_started boolean := false;
  v_scores jsonb := '{}'::jsonb;
  v_categories jsonb := '[]'::jsonb;
  v_overall integer := 0;
  v_governance integer;
  v_operations integer;
  v_collaboration integer;
  v_knowledge integer;
  v_customer_success integer;
  v_security integer;
  v_integrations_score integer;
  v_packs_score integer;
  v_decisions_score integer;
  v_memory integer;
  v_self integer;
begin
  v_customer_id := public._ap620_customer_id_for_company(p_company_id);

  select count(*)::int, count(*) filter (where u.role in ('owner', 'admin'))::int,
         count(*) filter (
           where u.last_login_at is not null
             and u.last_login_at > now() - interval '14 days'
         )::int
  into v_team, v_admins, v_active
  from public.users u where u.company_id = p_company_id;

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int into v_integrations
    from public.app_portal_integration_connections ic
    where ic.company_id = p_company_id and ic.status = 'connected';
  end if;

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true;
  end if;

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*) filter (where f.status not in ('completed', 'cancelled'))::int,
           count(*) filter (where f.status = 'completed')::int
    into v_open_follow_ups, v_completed_follow_ups
    from public.app_portal_follow_ups f where f.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    select count(*)::int into v_decisions
    from public.app_portal_decisions d where d.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_activity_events') is not null then
    select count(*)::int into v_activity_events
    from public.app_portal_activity_events e where e.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_onboarding_progress') is not null then
    select op.started_at is not null into v_onboarding_started
    from public.app_portal_onboarding_progress op where op.company_id = p_company_id;
  end if;

  v_governance := least(100, greatest(10, 25 + v_admins * 15 + case when v_pending_approvals = 0 then 20 else 5 end + least(v_team * 3, 20)));
  v_operations := least(100, greatest(10, 20 + v_completed_follow_ups * 5 + case when v_open_follow_ups <= 2 then 25 else 5 end + least(v_activity_events, 30)));
  v_collaboration := least(100, greatest(10, 20 + v_active * 8 + least(v_team * 5, 35)));
  v_knowledge := least(100, greatest(15, 20 + case when v_onboarding_started then 15 else 0 end + coalesce(public._apmc275_latest_self_level(p_company_id, 'knowledge_management'), 0) * 8));
  v_customer_success := least(100, greatest(10, 15 + v_packs * 15 + v_integrations * 10 + case when v_onboarding_started then 15 else 0 end));
  v_security := least(100, greatest(5, 15 + v_2fa * 20 + v_admins * 5));
  v_integrations_score := least(100, greatest(5, 10 + v_integrations * 25));
  v_packs_score := least(100, greatest(5, 10 + v_packs * 20));
  v_decisions_score := least(100, greatest(10, 15 + v_decisions * 8 + case when v_pending_approvals > 0 then 10 else 0 end));
  v_memory := least(100, greatest(10, 15 + least(v_activity_events * 2, 40) + v_completed_follow_ups * 3));

  v_self := public._apmc275_latest_self_level(p_company_id, 'governance');
  v_categories := v_categories || public._apmc275_build_category('governance', v_governance, v_self, 'governanceRoles', 'governanceApprovals', 'governanceAction', 'approvals', 'knowledgeGovernance');

  v_self := public._apmc275_latest_self_level(p_company_id, 'operations');
  v_categories := v_categories || public._apmc275_build_category('operations', v_operations, v_self, 'operationsFollowThrough', 'operationsBacklog', 'operationsAction', 'followUps', 'knowledgeOperations');

  v_self := public._apmc275_latest_self_level(p_company_id, 'collaboration');
  v_categories := v_categories || public._apmc275_build_category('collaboration', v_collaboration, v_self, 'collaborationTeam', 'collaborationEngagement', 'collaborationAction', 'teamManagement', 'knowledgeCollaboration');

  v_self := public._apmc275_latest_self_level(p_company_id, 'knowledge_management');
  v_categories := v_categories || public._apmc275_build_category('knowledge_management', v_knowledge, v_self, 'knowledgeFoundation', 'knowledgeDepth', 'knowledgeAction', 'knowledgeCenter', 'knowledgeResources');

  v_self := public._apmc275_latest_self_level(p_company_id, 'customer_success');
  v_categories := v_categories || public._apmc275_build_category('customer_success', v_customer_success, v_self, 'customerSuccessAdoption', 'customerSuccessExpansion', 'customerSuccessAction', 'successCenter', 'knowledgeCustomerSuccess');

  v_self := public._apmc275_latest_self_level(p_company_id, 'security');
  v_categories := v_categories || public._apmc275_build_category('security', v_security, v_self, 'securityAwareness', 'securityHardening', 'securityAction', 'accountSecurity', 'knowledgeSecurity');

  v_self := public._apmc275_latest_self_level(p_company_id, 'integrations');
  v_categories := v_categories || public._apmc275_build_category('integrations', v_integrations_score, v_self, 'integrationsConnected', 'integrationsExpansion', 'integrationsAction', 'integrationsHub', 'knowledgeIntegrations');

  v_self := public._apmc275_latest_self_level(p_company_id, 'business_pack_adoption');
  v_categories := v_categories || public._apmc275_build_category('business_pack_adoption', v_packs_score, v_self, 'packsActive', 'packsBreadth', 'packsAction', 'businessPacks', 'knowledgeBusinessPacks');

  v_self := public._apmc275_latest_self_level(p_company_id, 'decision_processes');
  v_categories := v_categories || public._apmc275_build_category('decision_processes', v_decisions_score, v_self, 'decisionsTracked', 'decisionsFormalization', 'decisionsAction', 'decisionCenter', 'knowledgeDecisions');

  v_self := public._apmc275_latest_self_level(p_company_id, 'organizational_memory');
  v_categories := v_categories || public._apmc275_build_category('organizational_memory', v_memory, v_self, 'memoryActivity', 'memoryDocumentation', 'memoryAction', 'activityHistory', 'knowledgeMemory');

  v_scores := jsonb_build_object(
    'governance', v_governance,
    'operations', v_operations,
    'collaboration', v_collaboration,
    'knowledge_management', v_knowledge,
    'customer_success', v_customer_success,
    'security', v_security,
    'integrations', v_integrations_score,
    'business_pack_adoption', v_packs_score,
    'decision_processes', v_decisions_score,
    'organizational_memory', v_memory
  );

  select round(avg(x)::numeric)::integer into v_overall
  from (
    select (value)::int as x from jsonb_each_text(v_scores)
  ) s;

  return jsonb_build_object(
    'overall_score', coalesce(v_overall, 0),
    'overall_level', public._apmc275_score_to_level(coalesce(v_overall, 0)),
    'overall_level_key', public._apmc275_level_key(public._apmc275_score_to_level(coalesce(v_overall, 0))),
    'category_scores', v_scores,
    'categories', v_categories,
    'has_activity', v_team > 1 or v_packs > 0 or v_integrations > 0 or v_activity_events > 0
  );
end;
$$;

create or replace function public.get_app_portal_capability_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_bundle jsonb;
  v_categories jsonb;
  v_history jsonb := '[]'::jsonb;
  v_prev integer;
  v_trend text := 'stable';
  v_highest jsonb := '[]'::jsonb;
  v_lowest jsonb := '[]'::jsonb;
  v_focus jsonb := '[]'::jsonb;
  v_milestones jsonb := '[]'::jsonb;
  v_recommendations jsonb;
begin
  v_access := public._apmc275_require_capability_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_bundle := public._apmc275_compute_bundle(v_company_id);
  v_categories := coalesce(v_bundle->'categories', '[]'::jsonb);

  select coalesce(jsonb_agg(jsonb_build_object(
    'recorded_at', h.recorded_at,
    'overall_score', h.overall_score,
    'category_scores', h.category_scores
  ) order by h.recorded_at desc), '[]'::jsonb)
  into v_history
  from (
    select * from public.app_portal_maturity_history h
    where h.company_id = v_company_id
    order by h.recorded_at desc
    limit 12
  ) h;

  select h.overall_score into v_prev
  from public.app_portal_maturity_history h
  where h.company_id = v_company_id
  order by h.recorded_at desc
  offset 1 limit 1;

  if v_prev is not null then
    if (v_bundle->>'overall_score')::integer > v_prev then v_trend := 'improving';
    elsif (v_bundle->>'overall_score')::integer < v_prev then v_trend := 'declining';
    end if;
  elsif (v_bundle->>'has_activity')::boolean then
    v_trend := 'improving';
  end if;

  select coalesce(jsonb_agg(x.c), '[]'::jsonb)
  into v_highest
  from (
    select e.value as c
    from jsonb_array_elements(v_categories) e
    order by (e.value->>'level')::int desc
    limit 3
  ) x;

  select coalesce(jsonb_agg(x.c), '[]'::jsonb)
  into v_lowest
  from (
    select e.value as c
    from jsonb_array_elements(v_categories) e
    order by (e.value->>'level')::int asc
    limit 3
  ) x;

  select coalesce(jsonb_agg(jsonb_build_object('key', c->>'key', 'level', c->>'level')), '[]'::jsonb)
  into v_focus
  from jsonb_array_elements(v_categories) c
  where (c->>'level')::integer <= 2;

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', c->>'key',
    'level', c->>'level',
    'completed_at', now()
  )), '[]'::jsonb)
  into v_milestones
  from jsonb_array_elements(v_categories) c
  where (c->>'level')::integer >= 4;

  v_recommendations := public._apmc275_build_recommendations(v_categories);

  return jsonb_build_object(
    'found', true,
    'has_activity', coalesce((v_bundle->>'has_activity')::boolean, false),
    'dashboard', jsonb_build_object(
      'overall_score', (v_bundle->>'overall_score')::integer,
      'overall_level', (v_bundle->>'overall_level')::integer,
      'overall_level_key', v_bundle->>'overall_level_key',
      'trend', v_trend,
      'highest_categories', v_highest,
      'lowest_categories', v_lowest,
      'focus_areas', v_focus
    ),
    'categories', v_categories,
    'recommendations', v_recommendations,
    'progress', jsonb_build_object(
      'history', v_history,
      'trend', v_trend,
      'recent_milestones', v_milestones,
      'continued_focus', v_focus
    ),
    'principle', 'Self-improvement over time — your organization compared only to its own progress.'
  );
end;
$$;

notify pgrst, 'reload schema';
