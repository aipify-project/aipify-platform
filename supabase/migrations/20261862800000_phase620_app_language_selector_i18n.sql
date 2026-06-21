-- Phase 620 — APP language preference on user profile (mirrors timezone pattern).

alter table public.users
  add column if not exists preferred_locale text;

create or replace function public.update_user_preferred_locale(p_locale text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_locale text := lower(trim(coalesce(p_locale, '')));
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if v_locale not in ('en', 'no', 'sv', 'da') then
    raise exception 'Unsupported locale';
  end if;

  update public.users
  set preferred_locale = v_locale
  where auth_user_id = auth.uid()
  returning id into v_user_id;

  if v_user_id is null then
    raise exception 'User not found';
  end if;

  return jsonb_build_object('ok', true, 'locale', v_locale);
end;
$$;

grant execute on function public.update_user_preferred_locale(text) to authenticated;

create or replace function public.resolve_app_ui_locale(p_accept_language text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_org public.organizations;
  v_customer_id uuid;
  v_locale text;
begin
  if auth.uid() is null then
    return jsonb_build_object('locale', 'en', 'source', 'default');
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_user.preferred_locale is not null and v_user.preferred_locale in ('en', 'no', 'sv', 'da') then
    return jsonb_build_object('locale', v_user.preferred_locale, 'source', 'user_preference');
  end if;

  if v_user.company_id is not null then
    select c.id into v_customer_id from public.customers c where c.company_id = v_user.company_id limit 1;
    if v_customer_id is not null then
      select o.* into v_org from public.organizations o where o.id = v_customer_id;
      if v_org.default_language in ('en', 'no', 'sv', 'da') then
        return jsonb_build_object('locale', v_org.default_language, 'source', 'organization_default');
      end if;
    end if;
  end if;

  if p_accept_language is not null then
    v_locale := lower(split_part(trim(split_part(p_accept_language, ',', 1)), ';', 1));
    if v_locale like 'nb-%' or v_locale like 'nn-%' or v_locale = 'nb' or v_locale = 'nn' then
      return jsonb_build_object('locale', 'no', 'source', 'browser');
    end if;
    if v_locale like 'no-%' or v_locale = 'no' then
      return jsonb_build_object('locale', 'no', 'source', 'browser');
    end if;
    if v_locale like 'sv-%' or v_locale = 'sv' then
      return jsonb_build_object('locale', 'sv', 'source', 'browser');
    end if;
    if v_locale like 'da-%' or v_locale = 'da' then
      return jsonb_build_object('locale', 'da', 'source', 'browser');
    end if;
    if v_locale like 'en-%' or v_locale = 'en' then
      return jsonb_build_object('locale', 'en', 'source', 'browser');
    end if;
  end if;

  return jsonb_build_object('locale', 'en', 'source', 'default');
end;
$$;

grant execute on function public.resolve_app_ui_locale(text) to authenticated;
