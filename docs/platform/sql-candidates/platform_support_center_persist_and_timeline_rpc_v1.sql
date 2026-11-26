-- PREPARED_ONLY — Platform Support Center persist + timeline RPCs V1
-- NOT APPLIED. Requires exact owner YES naming this file + SHA-256.
--
-- Purpose (minimum additive Core):
--   1) Durable signature get/upsert for platform_support_signatures
--   2) Durable template list/upsert/archive for platform_support_reply_templates
--   3) Extend get_platform_app_portal_support_request timeline with
--      platform_support_ticket_messages (+ keep existing audit events)
--   4) Optional list filter p_assigned_support_owner_id for Mine tab
--
-- Existing on Production (verified 2026-11-26):
--   tables: platform_support_signatures, platform_support_reply_templates,
--           platform_support_ticket_messages, platform_support_ticket_admin_audit
--   write RPCs: platform_support_post_internal_note,
--               platform_support_post_external_reply_draft,
--               platform_support_update_ticket_status,
--               platform_support_assign_ticket
--   read RPCs: list_platform_app_portal_support_requests,
--              get_platform_app_portal_support_request,
--              get_platform_app_portal_support_request_counts
--
-- Missing: CRUD RPCs for signature/templates; message rows in detail timeline;
--          assignee filter on list RPC.
--
-- Safety:
--   - security definer + _ppsf258_require_platform_access()
--   - revoke all from public/anon; grant execute to authenticated only
--   - no broad table grants; no drop of companies/users/access helpers
--   - company_name must remain 'Aipify Group AS'; website/support email aipify.ai only
--   - archive templates = soft (is_active false), never hard-delete history
--
-- Do not apply until owner YES.

select 'PREPARED_ONLY_platform_support_center_persist_and_timeline_rpc_v1' as draft_marker;

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
    return jsonb_build_object('ok', true, 'found', false);
  end if;
  return jsonb_build_object(
    'ok', true,
    'found', true,
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
begin
  perform public._ppsf258_require_platform_access();
  if v_uid is null then
    raise exception 'platform portal access denied';
  end if;
  if char_length(btrim(coalesce(p_display_name, ''))) < 1 then
    raise exception 'invalid argument';
  end if;

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
    left(btrim(p_display_name), 120),
    left(btrim(coalesce(p_agent_name_default, '')), 120),
    left(btrim(coalesce(p_agent_title_default, '')), 120),
    'Aipify Group AS',
    'https://aipify.ai',
    'support@aipify.ai',
    left(btrim(coalesce(p_phone, '')), 40),
    left(btrim(coalesce(p_address_line, '')), 200),
    'https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png',
    coalesce(p_include_logo, true),
    true,
    v_uid
  )
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id, 'version', v_version);
end;
$$;

revoke all on function public.platform_support_upsert_signature(text, text, text, text, text, boolean) from public, anon;
grant execute on function public.platform_support_upsert_signature(text, text, text, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- Templates: list active (+ optional archived), upsert version, soft-archive
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
        'is_starter', t.is_starter
      ) as obj
    from public.platform_support_reply_templates t
    where p_include_archived or t.is_active = true
    order by t.template_key, t.locale, t.version desc
  ) x;
  return jsonb_build_object('ok', true, 'items', v_items);
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
  p_body_text text
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
  v_locale text := lower(btrim(coalesce(p_locale, 'no')));
begin
  perform public._ppsf258_require_platform_access();
  if v_uid is null then
    raise exception 'platform portal access denied';
  end if;
  if char_length(btrim(coalesce(p_template_key, ''))) < 1
     or char_length(btrim(coalesce(p_name, ''))) < 2
     or char_length(btrim(coalesce(p_subject, ''))) < 2
     or char_length(btrim(coalesce(p_body_text, ''))) < 10 then
    raise exception 'invalid argument';
  end if;
  if v_locale not in ('en', 'no', 'sv', 'da', 'pl', 'uk', 'es') then
    raise exception 'invalid argument';
  end if;

  select coalesce(max(version), 0) + 1 into v_version
  from public.platform_support_reply_templates
  where template_key = btrim(p_template_key) and locale = v_locale;

  update public.platform_support_reply_templates
  set is_active = false
  where template_key = btrim(p_template_key) and locale = v_locale and is_active = true;

  insert into public.platform_support_reply_templates (
    template_key, version, name, category, locale, subject, body_text,
    allowed_variables, is_active, is_starter, created_by
  ) values (
    left(btrim(p_template_key), 80),
    v_version,
    left(btrim(p_name), 160),
    left(btrim(coalesce(p_category, 'general')), 40),
    v_locale,
    left(btrim(p_subject), 200),
    left(btrim(p_body_text), 20000),
    array['customer_name','ticket_number','product_name','agent_name']::text[],
    true,
    false,
    v_uid
  )
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id, 'version', v_version);
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
  v_locale text := lower(btrim(coalesce(p_locale, 'no')));
  v_n integer;
begin
  perform public._ppsf258_require_platform_access();
  update public.platform_support_reply_templates
  set is_active = false
  where template_key = btrim(p_template_key)
    and locale = v_locale
    and is_active = true;
  get diagnostics v_n = row_count;
  if v_n = 0 then
    raise exception 'not found';
  end if;
  return jsonb_build_object('ok', true, 'archived', true);
end;
$$;

revoke all on function public.platform_support_archive_template(text, text) from public, anon;
grant execute on function public.platform_support_archive_template(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Detail timeline: include ticket messages (notes + drafts) with audit events
-- Replaces get_platform_app_portal_support_request body carefully — same signature.
-- ---------------------------------------------------------------------------
-- NOTE: Full CREATE OR REPLACE of get_platform_app_portal_support_request must
-- copy the existing function from
-- docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql
-- and extend v_timeline union with:
--
--   select jsonb_build_object(
--     'at', m.created_at,
--     'event_type', case
--       when m.direction = 'internal_note' then 'internal_note'
--       when m.direction = 'outbound' then 'external_reply_draft'
--       else m.direction
--     end,
--     'description', left(coalesce(m.body_text, ''), 500),
--     'performed_by', m.author_user_id,
--     'metadata', jsonb_build_object(
--       'message_id', m.id,
--       'delivery_status', m.delivery_status,
--       'direction', m.direction
--     )
--   )
--   from public.platform_support_ticket_messages m
--   where m.ticket_id = p_id
--
-- Merged with existing audit timeline, ordered by at desc, limited.
--
-- This file marks the contract; apply job should paste the complete REPLACE
-- from the live Production function definition to avoid drift.

select 'PREPARED_ONLY_timeline_extension_requires_live_get_function_body' as timeline_note;

-- ---------------------------------------------------------------------------
-- List: optional assignee filter for Mine tab (additive param with default null)
-- ---------------------------------------------------------------------------
-- Prefer a NEW overload or ALTER of list_platform_app_portal_support_requests
-- adding:
--   p_assigned_support_owner_id uuid default null
-- and filter:
--   and (p_assigned_support_owner_id is null
--        or r.assigned_support_owner_id = p_assigned_support_owner_id)
--
-- Do not change existing callers; default null preserves current behaviour.

select 'PREPARED_ONLY_list_assignee_filter_add_param_default_null' as list_filter_note;
