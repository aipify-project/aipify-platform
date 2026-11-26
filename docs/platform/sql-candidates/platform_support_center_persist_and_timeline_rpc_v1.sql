-- PREPARED_ONLY — Platform Support Center persist + timeline RPCs V1
-- NOT APPLIED. Requires exact owner YES naming this file + SHA-256.
--
-- Delivers:
--   1) Concurrent-safe signature get / upsert (versioned)
--   2) Concurrent-safe template list / upsert / archive (versioned, soft archive)
--   3) get_platform_app_portal_support_request timeline =
--        messages + platform admin audit + APP request audit
--   4) list_platform_app_portal_support_requests + p_assigned_support_owner_id
--        (server-side Mine filter with pagination)
--
-- Key rules:
--   - template_key / category normalized once; reject if invalid — never truncate
--     into a different identity
--   - advisory xact locks around version allocation
--   - security definer + _ppsf258_require_platform_access()
--   - revoke all from public/anon; grant execute to authenticated only
--   - company_name locked to Aipify Group AS; website/email aipify.ai only
--   - no email send / DNS / secrets
--
-- Do not apply until owner YES.

select 'PREPARED_ONLY_platform_support_center_persist_and_timeline_rpc_v1' as draft_marker;

-- ---------------------------------------------------------------------------
-- Shared key normalizer (template_key / category)
-- Rejects over-length or invalid characters — does not silently truncate.
-- ---------------------------------------------------------------------------
create or replace function public._pscpv1_normalize_key(
  p_raw text,
  p_field text default 'template_key'
)
returns text
language plpgsql
immutable
as $$
declare
  v text := lower(btrim(coalesce(p_raw, '')));
begin
  if v = '' then
    raise exception 'invalid argument: % required', p_field;
  end if;
  if char_length(v) > 80 then
    raise exception 'invalid argument: % too long', p_field;
  end if;
  if v !~ '^[a-z0-9][a-z0-9_-]{0,79}$' then
    raise exception 'invalid argument: % format', p_field;
  end if;
  return v;
end;
$$;

revoke all on function public._pscpv1_normalize_key(text, text) from public, anon;

create or replace function public._pscpv1_normalize_locale(p_raw text)
returns text
language plpgsql
immutable
as $$
declare
  v text := lower(btrim(coalesce(p_raw, 'no')));
begin
  if v not in ('en', 'no', 'sv', 'da', 'pl', 'uk', 'es') then
    raise exception 'invalid argument: locale';
  end if;
  return v;
end;
$$;

revoke all on function public._pscpv1_normalize_locale(text) from public, anon;

-- ---------------------------------------------------------------------------
-- Signature: get active + upsert new version (deactivates prior active)
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_get_active_signature()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.platform_support_signatures%rowtype;
begin
  perform public._ppsf258_require_platform_access();
  select * into v_row
  from public.platform_support_signatures s
  where s.is_active = true
  order by s.version desc
  limit 1;
  if not found then
    return jsonb_build_object('ok', true, 'found', false, 'source', 'platform_support_signatures');
  end if;
  return jsonb_build_object(
    'ok', true,
    'found', true,
    'source', 'platform_support_signatures',
    'signature', jsonb_build_object(
      'id', v_row.id,
      'version', v_row.version,
      'display_name', v_row.display_name,
      'agent_name_default', v_row.agent_name_default,
      'agent_title_default', v_row.agent_title_default,
      'company_name', v_row.company_name,
      'website_url', v_row.website_url,
      'support_email', v_row.support_email,
      'phone', v_row.phone,
      'address_line', v_row.address_line,
      'logo_url', v_row.logo_url,
      'include_logo', v_row.include_logo,
      'is_active', v_row.is_active
    )
  );
exception
  when others then
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    if position('platform portal access denied' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.platform_support_get_active_signature() from public, anon;
grant execute on function public.platform_support_get_active_signature() to authenticated;

create or replace function public.platform_support_upsert_signature(
  p_display_name text,
  p_agent_name_default text default '',
  p_agent_title_default text default '',
  p_phone text default '',
  p_address_line text default '',
  p_include_logo boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_version integer;
  v_id uuid;
  v_display text := btrim(coalesce(p_display_name, ''));
  v_agent text := btrim(coalesce(p_agent_name_default, ''));
  v_title text := btrim(coalesce(p_agent_title_default, ''));
  v_phone text := btrim(coalesce(p_phone, ''));
  v_address text := btrim(coalesce(p_address_line, ''));
begin
  perform public._ppsf258_require_platform_access();
  if v_uid is null then
    raise exception 'Platform portal access denied';
  end if;
  if char_length(v_display) < 1 or char_length(v_display) > 120 then
    raise exception 'invalid argument: display_name';
  end if;
  if char_length(v_agent) > 120 or char_length(v_title) > 120 then
    raise exception 'invalid argument: agent fields';
  end if;
  if char_length(v_phone) > 40 or char_length(v_address) > 200 then
    raise exception 'invalid argument: contact fields';
  end if;

  -- Serialize version allocation across concurrent writers.
  perform pg_advisory_xact_lock(hashtextextended('platform_support_signatures', 0));

  select coalesce(max(version), 0) + 1 into v_version
  from public.platform_support_signatures;

  update public.platform_support_signatures
  set is_active = false
  where is_active = true;

  insert into public.platform_support_signatures (
    version, display_name, agent_name_default, agent_title_default,
    company_name, website_url, support_email, phone, address_line,
    logo_url, include_logo, is_active, created_by
  ) values (
    v_version,
    v_display,
    v_agent,
    v_title,
    'Aipify Group AS',
    'https://aipify.ai',
    'support@aipify.ai',
    v_phone,
    v_address,
    'https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png',
    coalesce(p_include_logo, true),
    true,
    v_uid
  )
  returning id into v_id;

  return jsonb_build_object(
    'ok', true,
    'id', v_id,
    'version', v_version,
    'source', 'platform_support_signatures'
  );
exception
  when unique_violation then
    raise exception 'invalid argument: concurrent signature version conflict';
  when others then
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    if position('platform portal access denied' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    if position('invalid argument' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.platform_support_upsert_signature(text, text, text, text, text, boolean) from public, anon;
grant execute on function public.platform_support_upsert_signature(text, text, text, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- Templates: list / upsert / soft-archive
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_list_templates(
  p_include_archived boolean default false
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_items jsonb;
begin
  perform public._ppsf258_require_platform_access();
  select coalesce(jsonb_agg(x.obj order by x.name), '[]'::jsonb)
  into v_items
  from (
    select distinct on (t.template_key, t.locale)
      t.name,
      jsonb_build_object(
        'id', t.id,
        'template_key', t.template_key,
        'version', t.version,
        'name', t.name,
        'category', t.category,
        'locale', t.locale,
        'subject', t.subject,
        'body_text', t.body_text,
        'allowed_variables', t.allowed_variables,
        'is_active', t.is_active,
        'is_starter', t.is_starter,
        'archived', (not t.is_active)
      ) as obj
    from public.platform_support_reply_templates t
    where p_include_archived or t.is_active = true
    order by t.template_key, t.locale, t.version desc
  ) x;
  return jsonb_build_object(
    'ok', true,
    'source', 'platform_support_reply_templates',
    'items', v_items
  );
exception
  when others then
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    if position('platform portal access denied' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.platform_support_list_templates(boolean) from public, anon;
grant execute on function public.platform_support_list_templates(boolean) to authenticated;

create or replace function public.platform_support_upsert_template(
  p_template_key text,
  p_name text,
  p_category text,
  p_locale text,
  p_subject text,
  p_body_text text,
  p_is_starter boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key text;
  v_category text;
  v_locale text;
  v_name text := btrim(coalesce(p_name, ''));
  v_subject text := btrim(coalesce(p_subject, ''));
  v_body text := btrim(coalesce(p_body_text, ''));
  v_version integer;
  v_id uuid;
  v_lock_key bigint;
begin
  perform public._ppsf258_require_platform_access();
  if v_uid is null then
    raise exception 'Platform portal access denied';
  end if;

  v_key := public._pscpv1_normalize_key(p_template_key, 'template_key');
  v_category := public._pscpv1_normalize_key(coalesce(nullif(btrim(p_category), ''), 'general'), 'category');
  v_locale := public._pscpv1_normalize_locale(p_locale);

  if char_length(v_name) < 2 or char_length(v_name) > 160 then
    raise exception 'invalid argument: name';
  end if;
  if char_length(v_subject) < 2 or char_length(v_subject) > 200 then
    raise exception 'invalid argument: subject';
  end if;
  if char_length(v_body) < 10 or char_length(v_body) > 20000 then
    raise exception 'invalid argument: body';
  end if;

  v_lock_key := hashtextextended(v_key || ':' || v_locale, 0);
  perform pg_advisory_xact_lock(v_lock_key);

  select coalesce(max(version), 0) + 1 into v_version
  from public.platform_support_reply_templates
  where template_key = v_key and locale = v_locale;

  update public.platform_support_reply_templates
  set is_active = false
  where template_key = v_key and locale = v_locale and is_active = true;

  insert into public.platform_support_reply_templates (
    template_key, version, name, category, locale, subject, body_text,
    allowed_variables, is_active, is_starter, created_by
  ) values (
    v_key,
    v_version,
    v_name,
    v_category,
    v_locale,
    v_subject,
    v_body,
    array['customer_name','ticket_number','product_name','agent_name']::text[],
    true,
    coalesce(p_is_starter, false),
    v_uid
  )
  returning id into v_id;

  return jsonb_build_object(
    'ok', true,
    'id', v_id,
    'template_key', v_key,
    'locale', v_locale,
    'version', v_version,
    'source', 'platform_support_reply_templates'
  );
exception
  when unique_violation then
    raise exception 'invalid argument: concurrent template version conflict';
  when others then
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    if position('platform portal access denied' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    if position('invalid argument' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.platform_support_upsert_template(text, text, text, text, text, text, boolean) from public, anon;
grant execute on function public.platform_support_upsert_template(text, text, text, text, text, text, boolean) to authenticated;

-- Backward-compatible 6-arg wrapper (defaults is_starter false)
create or replace function public.platform_support_upsert_template(
  p_template_key text,
  p_name text,
  p_category text,
  p_locale text,
  p_subject text,
  p_body_text text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.platform_support_upsert_template(
    p_template_key, p_name, p_category, p_locale, p_subject, p_body_text, false
  );
end;
$$;

revoke all on function public.platform_support_upsert_template(text, text, text, text, text, text) from public, anon;
grant execute on function public.platform_support_upsert_template(text, text, text, text, text, text) to authenticated;

create or replace function public.platform_support_archive_template(
  p_template_key text,
  p_locale text default 'no'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_locale text;
  v_n integer;
  v_lock_key bigint;
begin
  perform public._ppsf258_require_platform_access();
  v_key := public._pscpv1_normalize_key(p_template_key, 'template_key');
  v_locale := public._pscpv1_normalize_locale(p_locale);
  v_lock_key := hashtextextended(v_key || ':' || v_locale, 0);
  perform pg_advisory_xact_lock(v_lock_key);

  update public.platform_support_reply_templates
  set is_active = false
  where template_key = v_key
    and locale = v_locale
    and is_active = true;
  get diagnostics v_n = row_count;
  if v_n = 0 then
    raise exception 'not found';
  end if;
  return jsonb_build_object(
    'ok', true,
    'archived', true,
    'template_key', v_key,
    'locale', v_locale,
    'source', 'platform_support_reply_templates'
  );
exception
  when others then
    if sqlerrm = 'Platform portal access denied' then
      raise;
    end if;
    if position('platform portal access denied' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    if sqlerrm = 'not found' or position('invalid argument' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.platform_support_archive_template(text, text) from public, anon;
grant execute on function public.platform_support_archive_template(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Detail: timeline = messages + admin audit + APP request audit
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

revoke all on function public.get_platform_app_portal_support_request(uuid)
  from public, anon;
grant execute on function public.get_platform_app_portal_support_request(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- List: add server-side assignee filter (Mine) while preserving callers
-- Drop previous 11-arg signature; recreate with optional assignee param.
-- ---------------------------------------------------------------------------
drop function if exists public.list_platform_app_portal_support_requests(
  text, text, text, text, uuid, timestamptz, timestamptz, text, text, integer, integer
);

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
  where coalesce(c.is_platform, false) = false
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
) to authenticated;

select 'PREPARED_ONLY_platform_support_center_persist_and_timeline_rpc_v1_complete' as draft_marker;
