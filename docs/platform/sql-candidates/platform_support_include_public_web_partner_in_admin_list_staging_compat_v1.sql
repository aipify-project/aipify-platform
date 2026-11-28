-- AIPIFY_PLATFORM_SUPPORT_ADMIN_VISIBILITY_STAGING_COMPAT_V1
-- SQL CANDIDATE ONLY — DO NOT APPLY without exact owner YES naming this file.
-- Target: Staging Core auedugihkduoaikfusqe
--
-- Purpose:
--   Staging-compatible twin of Production candidate
--   docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_v1.sql
--   (SHA256 ec2bf7fa4fb326bd5132a80b3c8eff06f79e6102511aee5438427b42244ff611 — leave that file unchanged).
--
-- Based on live Staging RPC bodies (read-only export). Preserves:
--   - 11-arg list signature (NO p_assigned_support_owner_id)
--   - Staging get timeline shape (APP audit logs only, limit 100)
--   - Staging counts return format
--   - SECURITY DEFINER + search_path=public
--   - _ppsf258_require_platform_access()
--   - Staging grants: authenticated only (no service_role grant expansion)
--   - No new overload
--
-- Predicate change only (list count + list items + get + counts):
--   FROM: coalesce(c.is_platform, false) = false
--   TO:   (
--           coalesce(c.is_platform, false) = false
--           or coalesce(nullif(trim(r.channel), ''), 'app_portal') in ('web', 'partner')
--         )
-- Plus list channel_values metadata: add 'web', 'partner'.
--
-- Intended visibility matrix:
--   APP (app_portal on non-platform company) → visible
--   web / partner on platform company → visible
--   other channels on platform company → still hidden
--
-- Owner YES text (Staging only):
--   YES — apply docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_staging_compat_v1.sql
--   to Staging Core (auedugihkduoaikfusqe) for AIPIFY_PLATFORM_SUPPORT_ADMIN_VISIBILITY_STAGING_COMPAT_V1
--
-- Rollback: re-apply prior Staging function bodies (predicate = is_platform false only;
-- channel_values without web/partner). No table/data changes to reverse.

-- ---------------------------------------------------------------------------
-- LIST (11-arg Staging signature)
-- ---------------------------------------------------------------------------
create or replace function public.list_platform_app_portal_support_requests(
  p_status text default null,
  p_channel text default null,
  p_category text default null,
  p_priority text default null,
  p_company_id uuid default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_search text default null,
  p_sort text default null,
  p_page integer default 1,
  p_page_size integer default 25
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_page integer := greatest(coalesce(p_page, 1), 1);
  v_page_size integer := least(greatest(coalesce(p_page_size, 25), 1), 50);
  v_offset integer;
  v_total integer := 0;
  v_items jsonb := '[]'::jsonb;
  v_sort text := lower(coalesce(nullif(trim(p_sort), ''), 'updated_desc'));
  v_search text := left(trim(coalesce(p_search, '')), 80);
  v_status text := nullif(trim(coalesce(p_status, '')), '');
  v_channel text := nullif(trim(coalesce(p_channel, '')), '');
  v_category text := nullif(trim(coalesce(p_category, '')), '');
  v_priority text := nullif(trim(coalesce(p_priority, '')), '');
begin
  perform public._ppsf258_require_platform_access();

  v_offset := (v_page - 1) * v_page_size;

  select count(*)::integer
  into v_total
  from public.app_portal_support_requests r
  join public.companies c on c.id = r.company_id
  where (
      coalesce(c.is_platform, false) = false
      or coalesce(nullif(trim(r.channel), ''), 'app_portal') in ('web', 'partner')
    )
    and (v_status is null or r.status = v_status)
    and (v_channel is null or coalesce(nullif(trim(r.channel), ''), 'app_portal') = v_channel)
    and (v_category is null or r.category = v_category)
    and (v_priority is null or r.priority = v_priority)
    and (p_company_id is null or r.company_id = p_company_id)
    and (p_date_from is null or r.updated_at >= p_date_from)
    and (p_date_to is null or r.updated_at <= p_date_to)
    and (
      v_search = ''
      or r.title ilike '%' || v_search || '%'
      or r.description ilike '%' || v_search || '%'
    );

  select coalesce(jsonb_agg(s.item), '[]'::jsonb)
  into v_items
  from (
    select
      jsonb_build_object(
        'id', r.id,
        'company_id', r.company_id,
        'company_name', nullif(trim(coalesce(c.name, '')), ''),
        'title', r.title,
        'description_preview', left(coalesce(r.description, ''), 200),
        'category', r.category,
        'priority', r.priority,
        'status', r.status,
        'channel', coalesce(nullif(trim(r.channel), ''), 'app_portal'),
        'source_locale', null,
        'related_module', r.related_module,
        'assigned_support_owner_id', r.assigned_support_owner_id,
        'attachment_count', case
          when jsonb_typeof(r.attachments) = 'array' then jsonb_array_length(r.attachments)
          else 0
        end,
        'created_at', r.created_at,
        'updated_at', r.updated_at,
        'resolved_at', r.resolved_at
      ) as item
    from public.app_portal_support_requests r
    join public.companies c on c.id = r.company_id
    where (
        coalesce(c.is_platform, false) = false
        or coalesce(nullif(trim(r.channel), ''), 'app_portal') in ('web', 'partner')
      )
      and (v_status is null or r.status = v_status)
      and (
        v_channel is null
        or coalesce(nullif(trim(r.channel), ''), 'app_portal') = v_channel
      )
      and (v_category is null or r.category = v_category)
      and (v_priority is null or r.priority = v_priority)
      and (p_company_id is null or r.company_id = p_company_id)
      and (p_date_from is null or r.updated_at >= p_date_from)
      and (p_date_to is null or r.updated_at <= p_date_to)
      and (
        v_search = ''
        or r.title ilike '%' || v_search || '%'
        or r.description ilike '%' || v_search || '%'
      )
    order by
      case when v_sort = 'updated_asc' then r.updated_at end asc nulls last,
      case when v_sort = 'created_desc' then r.created_at end desc nulls last,
      case when v_sort = 'created_asc' then r.created_at end asc nulls last,
      case when v_sort = 'priority_desc' then
        case r.priority
          when 'urgent' then 4
          when 'high' then 3
          when 'medium' then 2
          else 1
        end
      end desc nulls last,
      r.updated_at desc,
      r.id desc
    offset v_offset
    limit v_page_size
  ) s;

  return jsonb_build_object(
    'ok', true,
    'source', 'app_portal_support_requests',
    'privacy_note',
      'Platform Support read of APP ticket SoT. Not usage_statistics. Not legacy support_cases queue. Bodies truncated in list.',
    'channel_values', jsonb_build_array(
      'app_portal', 'email', 'chat', 'phone', 'assistant', 'web', 'partner'
    ),
    'items', v_items,
    'pagination', jsonb_build_object(
      'page', v_page,
      'page_size', v_page_size,
      'total', v_total,
      'total_pages', case
        when v_total = 0 then 0
        else ceil(v_total::numeric / v_page_size)::integer
      end
    ),
    'filters', jsonb_build_object(
      'status', v_status,
      'channel', v_channel,
      'category', v_category,
      'priority', v_priority,
      'company_id', p_company_id,
      'date_from', p_date_from,
      'date_to', p_date_to,
      'search', nullif(v_search, ''),
      'sort', v_sort
    )
  );
exception
  when others then
    -- Fail closed: do not leak underlying table/row details to unauthorised callers.
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.list_platform_app_portal_support_requests(
  text, text, text, text, uuid, timestamptz, timestamptz, text, text, integer, integer
) from public, anon;
grant execute on function public.list_platform_app_portal_support_requests(
  text, text, text, text, uuid, timestamptz, timestamptz, text, text, integer, integer
) to authenticated;

-- ---------------------------------------------------------------------------
-- COUNTS
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_app_portal_support_request_counts()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_open integer := 0;
  v_waiting integer := 0;
  v_resolved integer := 0;
  v_total integer := 0;
begin
  perform public._ppsf258_require_platform_access();

  select
    count(*)::integer,
    count(*) filter (
      where r.status in ('open', 'in_review', 'reopened')
    )::integer,
    count(*) filter (
      where r.status in ('waiting_for_customer', 'waiting_for_aipify')
    )::integer,
    count(*) filter (
      where r.status in ('resolved', 'closed', 'archived')
    )::integer
  into v_total, v_open, v_waiting, v_resolved
  from public.app_portal_support_requests r
  join public.companies c on c.id = r.company_id
  where (
      coalesce(c.is_platform, false) = false
      or coalesce(nullif(trim(r.channel), ''), 'app_portal') in ('web', 'partner')
    );

  return jsonb_build_object(
    'ok', true,
    'source', 'app_portal_support_requests',
    'privacy_note',
      'Counts are APP ticket SoT only. Do not display alongside usage_statistics.support_requests_handled as one metric.',
    'counts', jsonb_build_object(
      'total', v_total,
      'open', v_open,
      'waiting', v_waiting,
      'resolved_or_closed', v_resolved
    )
  );
exception
  when others then
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.get_platform_app_portal_support_request_counts() from public, anon;
grant execute on function public.get_platform_app_portal_support_request_counts() to authenticated;

-- ---------------------------------------------------------------------------
-- GET (Staging timeline shape)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_app_portal_support_request(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.app_portal_support_requests;
  v_company_name text;
  v_timeline jsonb := '[]'::jsonb;
begin
  perform public._ppsf258_require_platform_access();

  if p_id is null then
    return jsonb_build_object(
      'ok', false,
      'found', false,
      'source', 'app_portal_support_requests',
      'error', 'not_found'
    );
  end if;

  select r.*
  into v_row
  from public.app_portal_support_requests r
  join public.companies c on c.id = r.company_id
  where r.id = p_id
    and (
      coalesce(c.is_platform, false) = false
      or coalesce(nullif(trim(r.channel), ''), 'app_portal') in ('web', 'partner')
    );

  if not found then
    -- Same shape for missing vs inaccessible-to-non-admin is handled by auth gate above.
    return jsonb_build_object(
      'ok', false,
      'found', false,
      'source', 'app_portal_support_requests',
      'error', 'not_found'
    );
  end if;

  select c.name into v_company_name
  from public.companies c
  where c.id = v_row.company_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', l.id,
        'event_type', l.event_type,
        'description', left(coalesce(l.description, ''), 300),
        'performed_by', l.performed_by,
        'created_at', l.created_at
      )
      order by l.created_at asc
    ),
    '[]'::jsonb
  )
  into v_timeline
  from (
    select l.*
    from public.app_portal_support_request_audit_logs l
    where l.request_id = v_row.id
      and l.company_id = v_row.company_id
    order by l.created_at asc
    limit 100
  ) l;

  return jsonb_build_object(
    'ok', true,
    'found', true,
    'source', 'app_portal_support_requests',
    'privacy_note',
      'Platform Support detail read of APP ticket SoT. Audit trail preserved read-only. source_locale reserved null until Core column exists.',
    'item', public._psstrv1_detail_item(v_row, v_company_name),
    'timeline', v_timeline
  );
exception
  when others then
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.get_platform_app_portal_support_request(uuid) from public, anon;
grant execute on function public.get_platform_app_portal_support_request(uuid) to authenticated;
