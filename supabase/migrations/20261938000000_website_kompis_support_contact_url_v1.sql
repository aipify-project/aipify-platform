-- AIPIFY.KOMPIS.CORE.SUPPORT.APP.FALLBACK.07
-- Extend existing jsonb install-config allowlist with supportContactUrl.
-- No new table. No customer seeds. Idempotent create-or-replace.

create or replace function public._wpkf_sanitize_install_config_patch(p_patch jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  v_patch jsonb := coalesce(p_patch, '{}'::jsonb);
  v_result jsonb := '{}'::jsonb;
  v_sources jsonb;
  v_key text;
  v_source_key text;
  v_forbidden constant text[] := array[
    'iconUrl', 'iconPath', 'tenantId', 'tenant_id', 'installId', 'customerId', 'companyId'
  ];
  v_support text;
begin
  if jsonb_typeof(v_patch) <> 'object' then
    return '{}'::jsonb;
  end if;

  if v_patch ? 'website_kompis' and jsonb_typeof(v_patch -> 'website_kompis') = 'object' then
    v_patch := v_patch -> 'website_kompis';
  elsif v_patch ? 'websiteKompis' and jsonb_typeof(v_patch -> 'websiteKompis') = 'object' then
    v_patch := v_patch -> 'websiteKompis';
  end if;

  for v_key in
    select key
    from jsonb_object_keys(v_patch) as key
  loop
    if v_key = any (v_forbidden) then
      continue;
    end if;

    if v_key in (
      'enabled',
      'iconVariant',
      'defaultLocale',
      'fallbackTone',
      'welcomeMessageVariant',
      'updatedAt'
    ) then
      v_result := v_result || jsonb_build_object(v_key, v_patch -> v_key);
    elsif v_key = 'supportContactUrl' then
      if jsonb_typeof(v_patch -> v_key) = 'null' then
        v_result := v_result || jsonb_build_object('supportContactUrl', null);
      elsif jsonb_typeof(v_patch -> v_key) = 'string' then
        v_support := nullif(btrim(v_patch ->> v_key), '');
        if v_support is null then
          v_result := v_result || jsonb_build_object('supportContactUrl', null);
        elsif char_length(v_support) <= 500 then
          v_result := v_result || jsonb_build_object('supportContactUrl', v_support);
        end if;
      end if;
    elsif v_key = 'sources' and jsonb_typeof(v_patch -> 'sources') = 'object' then
      v_sources := '{}'::jsonb;
      for v_source_key in
        select key
        from jsonb_object_keys(v_patch -> 'sources') as key
      loop
        if v_source_key in ('faq', 'currentPage', 'publicSiteIndex', 'aipifyPublic')
          and jsonb_typeof(v_patch -> 'sources' -> v_source_key) = 'boolean' then
          v_sources := v_sources || jsonb_build_object(
            v_source_key,
            v_patch -> 'sources' -> v_source_key
          );
        end if;
      end loop;
      if v_sources <> '{}'::jsonb then
        v_result := v_result || jsonb_build_object('sources', v_sources);
      end if;
    end if;
  end loop;

  return v_result;
end;
$$;

create or replace function public._wpkf_normalize_install_config_json(
  p_raw jsonb,
  p_locale text default 'no'
)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  v_raw jsonb := coalesce(p_raw, '{}'::jsonb);
  v_block jsonb := '{}'::jsonb;
  v_sources jsonb;
  v_fallback_locale text := public._wpkf_install_config_locale(
    to_jsonb(p_locale),
    'no'
  );
  v_source_key text;
  v_sources_valid boolean := true;
  v_support text;
  v_result jsonb;
begin
  if jsonb_typeof(v_raw) <> 'object' then
    v_raw := '{}'::jsonb;
  end if;

  if v_raw ? 'website_kompis' and jsonb_typeof(v_raw -> 'website_kompis') = 'object' then
    v_block := v_raw -> 'website_kompis';
  elsif v_raw ? 'websiteKompis' and jsonb_typeof(v_raw -> 'websiteKompis') = 'object' then
    v_block := v_raw -> 'websiteKompis';
  elsif v_raw ? 'enabled'
    or v_raw ? 'iconVariant'
    or v_raw ? 'sources'
    or v_raw ? 'fallbackTone'
    or v_raw ? 'welcomeMessageVariant'
    or v_raw ? 'defaultLocale'
    or v_raw ? 'supportContactUrl' then
    v_block := v_raw;
  end if;

  if v_block ? 'sources' and jsonb_typeof(v_block -> 'sources') = 'object' then
    for v_source_key in
      select key
      from jsonb_object_keys(v_block -> 'sources') as key
    loop
      if v_source_key in ('faq', 'currentPage', 'publicSiteIndex', 'aipifyPublic')
        and jsonb_typeof(v_block -> 'sources' -> v_source_key) <> 'boolean' then
        v_sources_valid := false;
        exit;
      end if;
    end loop;

    if v_sources_valid then
      v_sources := jsonb_build_object(
        'faq', public._wpkf_install_config_bool(v_block -> 'sources' -> 'faq', true),
        'currentPage', public._wpkf_install_config_bool(v_block -> 'sources' -> 'currentPage', true),
        'publicSiteIndex', public._wpkf_install_config_bool(v_block -> 'sources' -> 'publicSiteIndex', false),
        'aipifyPublic', public._wpkf_install_config_bool(v_block -> 'sources' -> 'aipifyPublic', true)
      );
    else
      v_sources := jsonb_build_object(
        'faq', true,
        'currentPage', true,
        'publicSiteIndex', false,
        'aipifyPublic', true
      );
    end if;
  else
    v_sources := jsonb_build_object(
      'faq', true,
      'currentPage', true,
      'publicSiteIndex', false,
      'aipifyPublic', true
    );
  end if;

  v_support := nullif(btrim(coalesce(v_block ->> 'supportContactUrl', '')), '');
  if v_support is not null and char_length(v_support) > 500 then
    v_support := null;
  end if;

  v_result := jsonb_build_object(
    'enabled', public._wpkf_install_config_bool(v_block -> 'enabled', true),
    'iconVariant', public._wpkf_allowed_icon_variant(v_block ->> 'iconVariant'),
    'defaultLocale', public._wpkf_install_config_locale(
      v_block -> 'defaultLocale',
      v_fallback_locale
    ),
    'fallbackTone', case
      when v_block ->> 'fallbackTone' in ('professional-friendly', 'short-direct')
      then v_block ->> 'fallbackTone'
      else 'professional-friendly'
    end,
    'sources', v_sources,
    'welcomeMessageVariant', case
      when v_block ->> 'welcomeMessageVariant' in ('standard', 'compact')
      then v_block ->> 'welcomeMessageVariant'
      else 'standard'
    end,
    'supportContactUrl', v_support
  );

  return v_result;
end;
$$;
