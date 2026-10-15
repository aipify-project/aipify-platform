-- =============================================================================
-- NOT_APPLIED — EXECUTABLE DRAFT — DO NOT AUTO-DEPLOY — DO NOT EXECUTE WITHOUT
-- A SEPARATE NAMED OWNER APPLY YES THAT CITES THIS FILE PATH AND SHA-256.
-- =============================================================================
-- Contract: platform_support_tickets_cross_tenant_read_rpc_v1
-- Job: AIPIFY_PLATFORM_SUPPORT_CROSS_TENANT_READ_RPC_PREPARE_V1
--
-- LOCATION RULE:
--   This file lives under docs/platform/ and MUST NOT be copied into
--   supabase/migrations/ or applied by CI/automatic migration runners until
--   an owner-named apply job explicitly relocates/applies it.
--
-- SoT (read-only):
--   public.app_portal_support_requests
--   public.app_portal_support_request_audit_logs  (detail timeline only)
--
-- NOT SoT (must never be mixed into ticket counts returned here):
--   list_platform_support_queue / legacy support_cases shapes
--   usage_statistics.support_requests_handled
--   organization_support_cases / ASO triage pipelines
--
-- Role policy (narrowest explicit policy for this prepare):
--   Active platform_admins with role in (super_admin, platform_support)
--   via public._ppsf258_require_platform_access().
--   Rationale: platform_support exists to operate customer support; both
--   roles need read. Writes/replies remain a SEPARATE owner job and may
--   tighten to super_admin + confirmation.
--   Never grant anon / PUBLIC. Never trust UI role or client-supplied role.
--
-- Explicit non-goals of applying this file:
--   ZERO writes to tickets / audit / companies
--   ZERO email / AI / translation provider calls
--   ZERO channel enum changes / locale columns
--   ZERO Platform UI wiring
--   ZERO changes to APP RLS policies on ticket tables
-- =============================================================================

-- Optional supporting index for Platform list (idempotent; safe if applied later).
create index if not exists app_portal_support_requests_platform_list_idx
  on public.app_portal_support_requests (updated_at desc, status, channel);

-- ---------------------------------------------------------------------------
-- List row projection (data-minimised; no internal_notes; truncated description)
-- ---------------------------------------------------------------------------
create or replace function public._psstrv1_list_item(
  r public.app_portal_support_requests,
  p_company_name text
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', r.id,
    'company_id', r.company_id,
    'company_name', nullif(trim(coalesce(p_company_name, '')), ''),
    'title', r.title,
    'description_preview', left(coalesce(r.description, ''), 200),
    'category', r.category,
    'priority', r.priority,
    'status', r.status,
    'channel', coalesce(nullif(trim(r.channel), ''), 'app_portal'),
    -- Reserved for a future locale column; never invent from UI locale.
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
  );
$$;

revoke all on function public._psstrv1_list_item(public.app_portal_support_requests, text)
  from public, anon;
-- Internal helper: no grant to authenticated (callable only by other security definer funcs).

-- ---------------------------------------------------------------------------
-- Detail projection (bounded body; includes internal_notes for operators)
-- ---------------------------------------------------------------------------
create or replace function public._psstrv1_detail_item(
  r public.app_portal_support_requests,
  p_company_name text
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', r.id,
    'company_id', r.company_id,
    'company_name', nullif(trim(coalesce(p_company_name, '')), ''),
    'title', r.title,
    'description', left(coalesce(r.description, ''), 8000),
    'category', r.category,
    'priority', r.priority,
    'status', r.status,
    'channel', coalesce(nullif(trim(r.channel), ''), 'app_portal'),
    'source_locale', null,
    'related_module', r.related_module,
    'created_by_id', r.created_by,
    'assigned_support_owner_id', r.assigned_support_owner_id,
    'internal_notes', case
      when coalesce(r.internal_notes, '') = '' then null
      else left(r.internal_notes, 2000)
    end,
    'attachments', case
      when jsonb_typeof(r.attachments) = 'array' then r.attachments
      else '[]'::jsonb
    end,
    'created_at', r.created_at,
    'updated_at', r.updated_at,
    'resolved_at', r.resolved_at
  );
$$;

revoke all on function public._psstrv1_detail_item(public.app_portal_support_requests, text)
  from public, anon;

-- ---------------------------------------------------------------------------
-- LIST — cross-tenant read for authorised Platform operators only
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
  where coalesce(c.is_platform, false) = false
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
    where coalesce(c.is_platform, false) = false
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
      'app_portal', 'email', 'chat', 'phone', 'assistant'
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
-- GET — single ticket + bounded audit timeline
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_app_portal_support_request(
  p_id uuid
)
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
    and coalesce(c.is_platform, false) = false;

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

revoke all on function public.get_platform_app_portal_support_request(uuid)
  from public, anon;
grant execute on function public.get_platform_app_portal_support_request(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Aggregate counts from APP SoT only (never usage_statistics)
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
  where coalesce(c.is_platform, false) = false;

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

revoke all on function public.get_platform_app_portal_support_request_counts()
  from public, anon;
grant execute on function public.get_platform_app_portal_support_request_counts()
  to authenticated;

-- Marker for static contract tests / apply gates.
select 'NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1' as draft_marker;
