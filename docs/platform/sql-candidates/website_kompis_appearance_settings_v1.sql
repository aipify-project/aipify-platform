-- PREPARED_ONLY — do not apply until exact owner Staging approval, then separate Production approval.
-- AIPIFY — Website Kompis appearance settings Core contract V1 (APP configuration)
--
-- PURPOSE
--   Tenant-scoped appearance settings for visitor widget presentation controls
--   that APP may edit after activation. Public widget runtime is NOT changed here
--   and must keep reading only an approved published snapshot (future phase).
--
-- EFFECTS (when applied)
--   + public.website_kompis_appearance_settings
--   + public.get_website_kompis_appearance_settings()
--   + public.upsert_website_kompis_appearance_settings(text, text, boolean, text)
--   revoke all from public/anon/authenticated (grants deferred to activation YES)
--
-- NON-EFFECTS
--   Does NOT grant EXECUTE to authenticated until separate activation YES
--   Does NOT mutate Website Kompis public-chain embed/widget files
--   Does NOT enable Stripe, provision, or media upload
--   Does NOT seed tenant rows
--
-- OWNER GATES
--   1) Staging YES (apply)
--   2) Staging activation YES (grants + APP writer gate)
--   3) Separate Production apply YES
--   4) Separate Production activation YES
--   APPLY_BLOCKED_UNTIL_OWNER_YES
--
-- DEPENDS ON
--   public.organizations (or equivalent tenant table used by get_app_organization_context)
--   Helper pattern: resolve tenant from auth.uid() via existing APP org context helpers
--
-- ROLLBACK
--   DROP FUNCTION public.upsert_website_kompis_appearance_settings(text, text, boolean, text);
--   DROP FUNCTION public.get_website_kompis_appearance_settings();
--   DROP TABLE public.website_kompis_appearance_settings;

begin;

create table if not exists public.website_kompis_appearance_settings (
  organization_id uuid primary key,
  accent_token text not null
    check (accent_token in ('companion_purple', 'soft_indigo', 'slate')),
  welcome_message text
    check (welcome_message is null or char_length(welcome_message) <= 160),
  show_branding boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid null
);

revoke all on table public.website_kompis_appearance_settings from public, anon, authenticated;

create or replace function public.get_website_kompis_appearance_settings()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_row public.website_kompis_appearance_settings%rowtype;
begin
  -- Tenant resolution must use the same APP organization context as other APP RPCs.
  -- Placeholder: replace with canonical helper used in production Core when applying.
  begin
    select (public.get_app_organization_context()->>'organization_id')::uuid into v_org;
  exception when others then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end;

  if v_org is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select * into v_row
  from public.website_kompis_appearance_settings
  where organization_id = v_org;

  if not found then
    return jsonb_build_object(
      'ok', true,
      'exists', false,
      'organization_id', v_org,
      'accent_token', 'companion_purple',
      'welcome_message', null,
      'show_branding', true,
      'updated_at', null
    );
  end if;

  return jsonb_build_object(
    'ok', true,
    'exists', true,
    'organization_id', v_row.organization_id,
    'accent_token', v_row.accent_token,
    'welcome_message', v_row.welcome_message,
    'show_branding', v_row.show_branding,
    'updated_at', v_row.updated_at
  );
end;
$$;

create or replace function public.upsert_website_kompis_appearance_settings(
  p_accent_token text,
  p_welcome_message text,
  p_show_branding boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_user uuid := auth.uid();
  v_welcome text := nullif(btrim(coalesce(p_welcome_message, '')), '');
  v_row public.website_kompis_appearance_settings%rowtype;
begin
  if v_user is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if p_idempotency_key is null or length(btrim(p_idempotency_key)) < 8 then
    return jsonb_build_object('ok', false, 'error', 'idempotency_required');
  end if;

  if p_accent_token is null
     or p_accent_token not in ('companion_purple', 'soft_indigo', 'slate') then
    return jsonb_build_object('ok', false, 'error', 'invalid_accent');
  end if;

  if v_welcome is not null and char_length(v_welcome) > 160 then
    return jsonb_build_object('ok', false, 'error', 'welcome_too_long');
  end if;

  if p_show_branding is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_branding');
  end if;

  begin
    select (public.get_app_organization_context()->>'organization_id')::uuid into v_org;
  exception when others then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end;

  if v_org is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  insert into public.website_kompis_appearance_settings (
    organization_id, accent_token, welcome_message, show_branding, updated_at, updated_by
  ) values (
    v_org, p_accent_token, v_welcome, p_show_branding, now(), v_user
  )
  on conflict (organization_id) do update
    set accent_token = excluded.accent_token,
        welcome_message = excluded.welcome_message,
        show_branding = excluded.show_branding,
        updated_at = now(),
        updated_by = excluded.updated_by
  returning * into strict v_row;

  return jsonb_build_object(
    'ok', true,
    'organization_id', v_row.organization_id,
    'accent_token', v_row.accent_token,
    'welcome_message', v_row.welcome_message,
    'show_branding', v_row.show_branding,
    'updated_at', v_row.updated_at,
    'idempotency_key', p_idempotency_key
  );
exception when others then
  return jsonb_build_object('ok', false, 'error', 'unavailable');
end;
$$;

revoke all on function public.get_website_kompis_appearance_settings() from public, anon, authenticated;
revoke all on function public.upsert_website_kompis_appearance_settings(text, text, boolean, text) from public, anon, authenticated;

commit;
