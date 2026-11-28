-- AIPIFY_SUPPORT_PUBLIC_DELIVERY_AND_SUCCESS_STATE_V1
-- SQL CANDIDATE ONLY — DO NOT APPLY without exact owner YES naming this file.
--
-- Root cause:
--   platform_support_intake_web_create / partner_create store guest tickets on the
--   platform company (companies.is_platform = true).
--   list/get/counts Platform Admin RPCs currently require:
--     where coalesce(c.is_platform, false) = false
--   so public web tickets (e.g. SUP-1067A439) are invisible in Admin Support.
--
-- Fix (additive CREATE OR REPLACE only — no table DDL, no data mutation):
--   Include platform-company rows when channel is web or partner.
--   Add web/partner to list channel_values metadata.
--
-- Predicate replacement (all three RPCs):
--   FROM: coalesce(c.is_platform, false) = false
--   TO:   (
--           coalesce(c.is_platform, false) = false
--           or coalesce(nullif(trim(r.channel), ''), 'app_portal') in ('web', 'partner')
--         )
--
-- Owner YES text (exact):
--   YES — apply docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_v1.sql
--   to Production Core (qbcqoixhrvhnuwphefvw) for AIPIFY_SUPPORT_PUBLIC_DELIVERY_AND_SUCCESS_STATE_V1
--
-- After apply, SUP-1067A439 must appear under Platform Admin Support when filtering
-- channel=web (or with no channel filter), status=open, company name Aipify.

-- ---------------------------------------------------------------------------
-- LIST
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
  p_page_size integer default 25,
  p_assigned_support_owner_id uuid default null
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
      p_assigned_support_owner_id is null
      or r.assigned_support_owner_id = p_assigned_support_owner_id
    )
    and (
      v_search = ''
      or r.title ilike '%' || v_search || '%'
      or r.description ilike '%' || v_search || '%'
      or replace(r.id::text, '-', '') ilike '%' || replace(v_search, '-', '') || '%'
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
        p_assigned_support_owner_id is null
        or r.assigned_support_owner_id = p_assigned_support_owner_id
      )
      and (
        v_search = ''
        or r.title ilike '%' || v_search || '%'
        or r.description ilike '%' || v_search || '%'
        or replace(r.id::text, '-', '') ilike '%' || replace(v_search, '-', '') || '%'
      )
    order by
      case when v_sort = 'updated_asc' then r.updated_at end asc nulls last,
      case when v_sort = 'created_desc' then r.created_at end desc nulls last,
      case when v_sort = 'created_asc' then r.created_at end asc nulls last,
      case when v_sort = 'priority_desc' then
        case r.priority
          when 'urgent' then 4
          when 'critical' then 4
          when 'high' then 3
          when 'medium' then 2
          when 'normal' then 2
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
      'sort', v_sort,
      'assigned_support_owner_id', p_assigned_support_owner_id
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

revoke all on function public.list_platform_app_portal_support_requests(
  text, text, text, text, uuid, timestamptz, timestamptz, text, text, integer, integer, uuid
) from public, anon;
grant execute on function public.list_platform_app_portal_support_requests(
  text, text, text, text, uuid, timestamptz, timestamptz, text, text, integer, integer, uuid
) to authenticated, service_role;

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
grant execute on function public.get_platform_app_portal_support_request_counts() to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- GET (detail)
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

  select coalesce(jsonb_agg(e.entry order by e.sort_at asc, e.sort_key asc), '[]'::jsonb)
  into v_timeline
  from (
    select *
    from (
      select
        m.created_at as sort_at,
        m.id::text as sort_key,
        jsonb_build_object(
          'id', m.id,
          'at', m.created_at,
          'created_at', m.created_at,
          'event_type', case
            when m.direction = 'internal_note' then 'internal_note'
            when m.direction = 'outbound' then 'external_reply_draft'
            when m.direction = 'inbound' then 'inbound_message'
            else coalesce(nullif(btrim(m.direction), ''), 'message')
          end,
          'description', left(coalesce(m.body_text, ''), 500),
          'performed_by', m.author_user_id,
          'metadata', jsonb_build_object(
            'kind', 'message',
            'message_id', m.id,
            'delivery_status', m.delivery_status,
            'direction', m.direction,
            'author_role', m.author_role
          )
        ) as entry
      from public.platform_support_ticket_messages m
      where m.ticket_id = v_row.id

      union all

      select
        a.created_at as sort_at,
        a.id::text as sort_key,
        jsonb_build_object(
          'id', a.id,
          'at', a.created_at,
          'created_at', a.created_at,
          'event_type', a.event_type,
          'description', left(coalesce(a.description, ''), 500),
          'performed_by', a.performed_by,
          'metadata', coalesce(a.metadata, '{}'::jsonb) || jsonb_build_object('kind', 'admin_audit')
        ) as entry
      from public.platform_support_ticket_admin_audit a
      where a.ticket_id = v_row.id

      union all

      select
        l.created_at as sort_at,
        l.id::text as sort_key,
        jsonb_build_object(
          'id', l.id,
          'at', l.created_at,
          'created_at', l.created_at,
          'event_type', l.event_type,
          'description', left(coalesce(l.description, ''), 300),
          'performed_by', l.performed_by,
          'metadata', jsonb_build_object('kind', 'app_audit')
        ) as entry
      from public.app_portal_support_request_audit_logs l
      where l.request_id = v_row.id
        and l.company_id = v_row.company_id
    ) u
    order by u.sort_at asc, u.sort_key asc
    limit 200
  ) e;

  return jsonb_build_object(
    'ok', true,
    'found', true,
    'source', 'app_portal_support_requests',
    'privacy_note',
      'Platform Support detail read of APP ticket SoT. Timeline includes messages, admin audit, and APP request audit.',
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
grant execute on function public.get_platform_app_portal_support_request(uuid) to authenticated, service_role;
