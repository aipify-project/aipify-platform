-- Phase 620 repair — APP customer route access (false-baseline recovery)
-- Restores missing support history RPC, lifetime feature entitlements, and CFI readonly GET.

-- ---------------------------------------------------------------------------
-- 1. Support history schema + RPC (migration 20261862700000 was recorded but incomplete)
-- ---------------------------------------------------------------------------
alter table public.app_portal_support_requests
  add column if not exists channel text not null default 'app_portal';

alter table public.app_portal_support_requests
  add column if not exists resolved_at timestamptz;

alter table public.app_portal_support_requests
  drop constraint if exists app_portal_support_requests_status_check;

alter table public.app_portal_support_requests
  add constraint app_portal_support_requests_status_check
  check (status in (
    'open', 'in_review', 'waiting_for_customer', 'waiting_for_aipify',
    'resolved', 'closed', 'reopened', 'archived'
  ));

alter table public.app_portal_support_requests
  drop constraint if exists app_portal_support_requests_channel_check;

alter table public.app_portal_support_requests
  add constraint app_portal_support_requests_channel_check
  check (channel in ('app_portal', 'email', 'chat', 'phone', 'assistant'));

create index if not exists app_portal_support_requests_history_idx
  on public.app_portal_support_requests (company_id, status, updated_at desc)
  where status in ('resolved', 'closed', 'reopened', 'archived');

create or replace function public._apsr271_request_row(r public.app_portal_support_requests)
returns jsonb
language plpgsql
stable
as $$
declare
  v_creator text;
  v_assignee text;
begin
  select coalesce(u.full_name, 'Unknown') into v_creator from public.users u where u.id = r.created_by;
  select coalesce(u.full_name, 'Unassigned') into v_assignee from public.users u where u.id = r.assigned_support_owner_id;
  return jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'description', left(r.description, 500),
    'category', r.category,
    'priority', r.priority,
    'status', r.status,
    'channel', coalesce(r.channel, 'app_portal'),
    'created_by_id', r.created_by,
    'created_by', coalesce(v_creator, 'Unknown'),
    'assigned_support_owner_id', r.assigned_support_owner_id,
    'assigned_support_owner', coalesce(v_assignee, 'Unassigned'),
    'related_module', r.related_module,
    'attachments', r.attachments,
    'internal_notes', case when r.internal_notes = '' then null else left(r.internal_notes, 200) end,
    'created_at', r.created_at,
    'updated_at', r.updated_at,
    'resolved_at', r.resolved_at
  );
end;
$$;

create or replace function public.get_app_portal_support_history(
  p_status text default null,
  p_category text default null,
  p_priority text default null,
  p_channel text default null,
  p_assigned uuid default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_search text default null,
  p_sort text default null,
  p_page integer default 1,
  p_page_size integer default 10
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
  v_page integer := greatest(coalesce(p_page, 1), 1);
  v_page_size integer := least(greatest(coalesce(p_page_size, 10), 1), 50);
  v_offset integer;
  v_total integer := 0;
  v_items jsonb := '[]'::jsonb;
  v_overview jsonb;
  v_insights jsonb;
  v_sort text := lower(coalesce(nullif(trim(p_sort), ''), 'updated_desc'));
  v_historical text[] := array['resolved', 'closed', 'reopened', 'archived'];
begin
  v_ctx := public._apsr271_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_offset := (v_page - 1) * v_page_size;

  select count(*)::integer into v_total
  from public.app_portal_support_requests r
  where r.company_id = v_company_id
    and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
    and (
      (p_status is not null and r.status = p_status)
      or (p_status is null and r.status = any(v_historical))
    )
    and (p_category is null or r.category = p_category)
    and (p_priority is null or r.priority = p_priority)
    and (p_channel is null or coalesce(r.channel, 'app_portal') = p_channel)
    and (p_assigned is null or r.assigned_support_owner_id = p_assigned)
    and (p_date_from is null or r.updated_at >= p_date_from)
    and (p_date_to is null or r.updated_at <= p_date_to)
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.description ilike '%' || trim(p_search) || '%'
    );

  select coalesce(jsonb_agg(public._apsr271_request_row(r)), '[]'::jsonb)
  into v_items
  from (
    select r.*
    from public.app_portal_support_requests r
    where r.company_id = v_company_id
      and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
      and (
        (p_status is not null and r.status = p_status)
        or (p_status is null and r.status = any(v_historical))
      )
      and (p_category is null or r.category = p_category)
      and (p_priority is null or r.priority = p_priority)
      and (p_channel is null or coalesce(r.channel, 'app_portal') = p_channel)
      and (p_assigned is null or r.assigned_support_owner_id = p_assigned)
      and (p_date_from is null or r.updated_at >= p_date_from)
      and (p_date_to is null or r.updated_at <= p_date_to)
      and (
        p_search is null or trim(p_search) = ''
        or r.title ilike '%' || trim(p_search) || '%'
        or r.description ilike '%' || trim(p_search) || '%'
      )
    order by
      case when v_sort = 'updated_asc' then r.updated_at end asc,
      case when v_sort = 'created_desc' then r.created_at end desc,
      case when v_sort = 'created_asc' then r.created_at end asc,
      case when v_sort = 'title_asc' then r.title end asc,
      case when v_sort = 'priority_desc' then
        case r.priority when 'urgent' then 4 when 'high' then 3 when 'medium' then 2 else 1 end
      end desc,
      r.updated_at desc
    offset v_offset
    limit v_page_size
  ) r;

  select jsonb_build_object(
    'total_historical', count(*) filter (where r.status = any(v_historical)),
    'resolved', count(*) filter (where r.status = 'resolved'),
    'closed', count(*) filter (where r.status = 'closed'),
    'reopened', count(*) filter (where r.status = 'reopened'),
    'archived', count(*) filter (where r.status = 'archived'),
    'avg_resolution_days', coalesce(
      round(avg(extract(epoch from (coalesce(r.resolved_at, r.updated_at) - r.created_at)) / 86400.0)::numeric, 1),
      0
    )
  )
  into v_overview
  from public.app_portal_support_requests r
  where r.company_id = v_company_id
    and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
    and r.status = any(v_historical);

  select jsonb_build_object(
    'top_categories', coalesce((
      select jsonb_agg(jsonb_build_object('category', x.category, 'count', x.cnt) order by x.cnt desc)
      from (
        select r.category, count(*)::integer as cnt
        from public.app_portal_support_requests r
        where r.company_id = v_company_id
          and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
          and r.status = any(v_historical)
        group by r.category
        order by cnt desc
        limit 3
      ) x
    ), '[]'::jsonb),
    'reopen_rate_percent', case
      when coalesce((v_overview->>'total_historical')::integer, 0) = 0 then 0
      else round(
        100.0 * coalesce((v_overview->>'reopened')::numeric, 0)
        / greatest((v_overview->>'total_historical')::numeric, 1),
        1
      )
    end,
    'most_recent_resolution_at', (
      select max(coalesce(r.resolved_at, r.updated_at))
      from public.app_portal_support_requests r
      where r.company_id = v_company_id
        and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
        and r.status in ('resolved', 'closed', 'archived')
    )
  )
  into v_insights;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_reopen', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'overview', v_overview,
    'insights', v_insights,
    'items', v_items,
    'pagination', jsonb_build_object(
      'page', v_page,
      'page_size', v_page_size,
      'total', v_total,
      'total_pages', case when v_total = 0 then 0 else ceil(v_total::numeric / v_page_size)::integer end
    ),
    'principle', 'Support History preserves resolved cases for your organization — transparent audit trails, no cross-tenant visibility.'
  );
end;
$$;

grant execute on function public.get_app_portal_support_history(text, text, text, text, uuid, timestamptz, timestamptz, text, text, integer, integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Lifetime / internal plans — standard APP entitlements (no hardcoded bypass)
-- ---------------------------------------------------------------------------
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
  v_plan text := 'starter';
  v_enabled boolean := true;
  v_feature text := coalesce(nullif(trim(p_feature), ''), 'core');
  v_premium_plans text[] := array['business', 'enterprise', 'professional', 'growth', 'lifetime', 'internal'];
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    begin
      v_plan := coalesce(
        public.get_customer_license_center()->'subscription'->>'plan_key',
        'starter'
      );
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
    'upgrade_required', true,
    'upgrade_href', '/app/billing/upgrade'
  );
end;
$$;

grant execute on function public.get_app_portal_feature_access(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Cross-functional intelligence — strip sync-on-read from STABLE list RPC
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_cross_functional_intelligence(
  p_department     text  default null,
  p_team           text  default null,
  p_dependency_type text default null,
  p_risk_level     text  default null,
  p_priority       text  default null,
  p_review_status  text  default null,
  p_search         text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_deps jsonb; v_collab jsonb; v_friction jsonb;
  v_health integer; v_collab_score integer;
  v_dep_score integer; v_proc_score integer;
  v_attention jsonb := '[]'::jsonb; v_opportunities jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._acfi318_manager_categories();

  v_health      := public._acfi318_health_score(v_company_id);
  v_collab_score := public._acfi318_collaboration_score(v_company_id);
  v_dep_score   := public._acfi318_dependency_score(v_company_id);
  v_proc_score  := public._acfi318_process_alignment_score(v_company_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',d.id,'dependency_key',d.dependency_key,
    'from_department',d.from_department,'to_department',d.to_department,
    'dependency_type',d.dependency_type,'dependency_strength',d.dependency_strength,
    'risk_level',d.risk_level,'review_status',d.review_status,
    'leadership_owner',d.leadership_owner,'description',d.description,
    'recommended_review',d.recommended_review
  ) order by case d.risk_level when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_deps
  from public.app_portal_cfi_dependencies d
  where d.company_id = v_company_id
    and (p_department   is null or d.from_department ilike '%'||trim(p_department)||'%'
         or d.to_department ilike '%'||trim(p_department)||'%')
    and (p_dependency_type is null or d.dependency_type = p_dependency_type)
    and (p_risk_level   is null or d.risk_level = p_risk_level)
    and (p_review_status is null or d.review_status = p_review_status)
    and (p_search        is null or trim(p_search) = ''
         or d.from_department ilike '%'||trim(p_search)||'%'
         or d.to_department ilike '%'||trim(p_search)||'%'
         or d.description ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'collaboration_key',c.collaboration_key,
    'department_a',c.department_a,'department_b',c.department_b,
    'category',c.category,'collaboration_type',c.collaboration_type,
    'health_status',c.health_status,'description',c.description,
    'improvement_opportunity',c.improvement_opportunity,
    'priority',c.priority,'leadership_owner',c.leadership_owner
  ) order by case c.health_status when 'high_priority' then 1 when 'needs_attention' then 2
                                   when 'stable' then 3 else 4 end),'[]'::jsonb)
  into v_collab
  from public.app_portal_cfi_collaboration c
  where c.company_id = v_company_id
    and (v_can_full or c.category = any(v_mgr_cats))
    and (p_department is null
         or c.department_a ilike '%'||trim(p_department)||'%'
         or c.department_b ilike '%'||trim(p_department)||'%')
    and (p_priority   is null or c.priority = p_priority)
    and (p_search     is null or trim(p_search) = ''
         or c.department_a ilike '%'||trim(p_search)||'%'
         or c.department_b ilike '%'||trim(p_search)||'%'
         or c.description ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',f.id,'friction_key',f.friction_key,'title',f.title,
    'severity',f.severity,'description',f.description,
    'recommended_action',f.recommended_action,'status',f.status
  ) order by case f.severity when 'critical' then 1 when 'high' then 2
                             when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_friction
  from public.app_portal_cfi_friction f
  where f.company_id = v_company_id
    and (p_search is null or trim(p_search) = ''
         or f.title ilike '%'||trim(p_search)||'%'
         or f.description ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object('id',c2.id,'title',
    c2.department_a||' ↔ '||c2.department_b)),'[]'::jsonb)
  into v_attention
  from public.app_portal_cfi_collaboration c2
  where c2.company_id = v_company_id
    and c2.health_status in ('needs_attention','high_priority');

  select coalesce(jsonb_agg(jsonb_build_object('id',c3.id,'title',
    c3.improvement_opportunity)),'[]'::jsonb)
  into v_opportunities
  from public.app_portal_cfi_collaboration c3
  where c3.company_id = v_company_id
    and c3.collaboration_type in ('emerging','weak')
    and c3.improvement_opportunity <> '';

  return jsonb_build_object(
    'found',                       true,
    'can_full',                    v_can_full,
    'can_view',                    coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',                  coalesce(v_ctx->>'can_review','false') = 'true',
    'has_intelligence_data',       v_deps <> '[]'::jsonb,
    'cross_functional_health_score', v_health,
    'department_collaboration_score', v_collab_score,
    'organizational_dependency_score', v_dep_score,
    'process_alignment_score',     v_proc_score,
    'executive_summary', case
      when v_deps = '[]'::jsonb then 'No cross-functional intelligence insights are available yet.'
      when v_health >= 75 then 'Cross-functional collaboration appears healthy.'
      when v_dep_score < 55 then
        'Certain organizational dependencies may create bottlenecks.'
      when v_collab_score < 60 then
        'Communication alignment may improve execution speed.'
      else 'Several departments are dependent on the same operational resources.'
    end,
    'areas_requiring_attention',   v_attention,
    'improvement_opportunities',   v_opportunities,
    'dependencies',                v_deps,
    'collaboration',               v_collab,
    'friction',                    v_friction,
    'recommendations',             public._acfi318_build_recommendations(v_company_id),
    'advisory_note',
      'Cross-functional insights are advisory — Aipify identifies patterns; leadership decides how to act.',
    'principle',
      'Understanding how teams work together improves performance — final decisions remain with leadership.'
  );
end; $$;

grant execute on function public.list_app_portal_cross_functional_intelligence(text,text,text,text,text,text,text) to authenticated;
