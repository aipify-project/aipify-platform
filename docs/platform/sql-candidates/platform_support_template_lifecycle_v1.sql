-- PREPARED_ONLY — Platform support template lifecycle V1
-- DO NOT APPLY. Requires a separate owner YES naming this file and its SHA-256.
-- No Staging apply. No Production apply.
--
-- Current applied storage (platform_support_reply_templates) has is_active only.
-- Existing rows: is_active true is Active, is_active false is Archived.
-- This candidate adds Draft, explicit restore, and delete of drafts only.
-- Archive of active templates stays on platform_support_archive_template.
-- Email send, DNS, and secrets are out of scope.

select 'PREPARED_ONLY_platform_support_template_lifecycle_v1' as draft_marker;

alter table public.platform_support_reply_templates
  add column if not exists status text;

update public.platform_support_reply_templates
set status = case when is_active then 'active' else 'archived' end
where status is null;

alter table public.platform_support_reply_templates
  drop constraint if exists platform_support_reply_templates_status_check;

alter table public.platform_support_reply_templates
  add constraint platform_support_reply_templates_status_check
  check (status in ('draft', 'active', 'archived'));

alter table public.platform_support_reply_templates
  alter column status set default 'active';

alter table public.platform_support_reply_templates
  alter column status set not null;

create or replace function public.platform_support_set_template_status(
  p_template_key text,
  p_locale text,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_locale text;
  v_status text := lower(btrim(coalesce(p_status, '')));
  v_n integer;
begin
  perform public._ppsf258_require_platform_access();
  if v_status not in ('draft', 'active', 'archived') then
    raise exception 'invalid argument: status';
  end if;
  v_key := public._pscpv1_normalize_key(p_template_key, 'template_key');
  v_locale := public._pscpv1_normalize_locale(p_locale);

  update public.platform_support_reply_templates
  set
    status = v_status,
    is_active = (v_status = 'active')
  where template_key = v_key
    and locale = v_locale
    and version = (
      select max(version)
      from public.platform_support_reply_templates
      where template_key = v_key and locale = v_locale
    );
  get diagnostics v_n = row_count;
  if v_n = 0 then
    raise exception 'not found';
  end if;

  return jsonb_build_object(
    'ok', true,
    'template_key', v_key,
    'locale', v_locale,
    'status', v_status,
    'source', 'platform_support_reply_templates'
  );
exception
  when others then
    if position('platform portal access denied' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    if position('invalid argument' in lower(sqlerrm)) > 0 or sqlerrm = 'not found' then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.platform_support_set_template_status(text, text, text) from public, anon;
grant execute on function public.platform_support_set_template_status(text, text, text) to authenticated;

create or replace function public.platform_support_delete_draft_template(
  p_template_key text,
  p_locale text
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
begin
  perform public._ppsf258_require_platform_access();
  v_key := public._pscpv1_normalize_key(p_template_key, 'template_key');
  v_locale := public._pscpv1_normalize_locale(p_locale);

  delete from public.platform_support_reply_templates
  where template_key = v_key
    and locale = v_locale
    and status = 'draft'
    and is_starter = false;
  get diagnostics v_n = row_count;
  if v_n = 0 then
    raise exception 'not found';
  end if;

  return jsonb_build_object(
    'ok', true,
    'deleted', true,
    'template_key', v_key,
    'locale', v_locale,
    'source', 'platform_support_reply_templates'
  );
exception
  when others then
    if position('platform portal access denied' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    if sqlerrm = 'not found' or position('invalid argument' in lower(sqlerrm)) > 0 then
      raise;
    end if;
    raise exception 'Platform portal access denied';
end;
$$;

revoke all on function public.platform_support_delete_draft_template(text, text) from public, anon;
grant execute on function public.platform_support_delete_draft_template(text, text) to authenticated;
