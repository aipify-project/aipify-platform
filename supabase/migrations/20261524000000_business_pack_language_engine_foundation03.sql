-- Foundation 03 — Business Pack Language Engine
-- Feature owner: PLATFORM FOUNDATION. Helpers: _bplge_* (engine), _bplgef03_* (blueprint)
-- Core principle: Multilingual by Design

create table if not exists public.business_pack_language_definitions (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  mandatory_languages jsonb not null default '["en","no","sv","da"]'::jsonb,
  optional_languages jsonb not null default '["de","es","fr","nl","pl","uk"]'::jsonb,
  default_language text not null default 'en' check (default_language in ('en', 'no', 'sv', 'da', 'de', 'es', 'fr', 'nl', 'pl', 'uk')),
  locale_namespace text not null,
  locale_resource_path text not null,
  translation_status jsonb not null default '{}'::jsonb,
  regional_defaults jsonb not null default '{}'::jsonb,
  localization_scope jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_pack_language_definitions enable row level security;
revoke all on public.business_pack_language_definitions from authenticated, anon;

create table if not exists public.business_pack_language_tenant_state (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  enabled_languages jsonb not null default '["en"]'::jsonb,
  default_language text not null default 'en',
  installation_complete boolean not null default false,
  resources_generated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, pack_key)
);

create index if not exists business_pack_language_tenant_state_tenant_idx
  on public.business_pack_language_tenant_state (tenant_id, pack_key);

alter table public.business_pack_language_tenant_state enable row level security;
revoke all on public.business_pack_language_tenant_state from authenticated, anon;

create table if not exists public.business_pack_language_gaps (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null,
  locale text not null,
  resource_key text,
  surface text not null default 'ui',
  notified_admin boolean not null default false,
  resolved boolean not null default false,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_language_gaps_pack_idx
  on public.business_pack_language_gaps (pack_key, locale, resolved);

alter table public.business_pack_language_gaps enable row level security;
revoke all on public.business_pack_language_gaps from authenticated, anon;

create table if not exists public.business_pack_language_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  pack_key text not null,
  action text not null check (
    action in (
      'language_enabled', 'language_disabled', 'default_language_changed',
      'languages_activated', 'resources_generated', 'installation_completed',
      'translation_gap_logged', 'translation_published', 'center_view'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_language_audit_tenant_idx
  on public.business_pack_language_audit_logs (tenant_id, created_at desc);

alter table public.business_pack_language_audit_logs enable row level security;
revoke all on public.business_pack_language_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_pack_language', v.description
from (values
  ('business_pack_language.view', 'View Business Pack Languages', 'View pack language center and translation status'),
  ('business_pack_language.manage', 'Manage Business Pack Languages', 'Enable languages and set defaults for packs'),
  ('business_pack_language.publish', 'Publish Pack Translations', 'Publish translation updates platform-wide')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_pack_language.view'), ('owner', 'business_pack_language.manage'),
  ('administrator', 'business_pack_language.view'), ('administrator', 'business_pack_language.manage'),
  ('manager', 'business_pack_language.view'),
  ('viewer', 'business_pack_language.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bplge_require_view()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.is_platform_admin() then return; end if;
  perform public._irp_require_permission('business_pack_language.view');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bplge_require_manage()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_require_permission('business_pack_language.manage');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bplge_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._bplge_log(
  p_tenant_id uuid, p_pack_key text, p_action text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.business_pack_language_audit_logs (tenant_id, pack_key, action, summary, actor_user_id, context)
  values (p_tenant_id, p_pack_key, p_action, p_summary, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._bplgef03_principle()
returns text language sql immutable as $$
  select 'Multilingual by Design — every Business Pack must feel native to the customer language and region.';
$$;

create or replace function public._bplgef03_mandatory_languages()
returns jsonb language sql immutable as $$
  select '["en","no","sv","da"]'::jsonb;
$$;

create or replace function public._bplgef03_optional_languages()
returns jsonb language sql immutable as $$
  select '["de","es","fr","nl","pl","uk"]'::jsonb;
$$;

create or replace function public._bplgef03_installation_flow()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'install_business_pack', 'choose_languages', 'activate_languages',
    'generate_pack_resources', 'ready_to_use'
  );
$$;

create or replace function public._bplgef03_localization_scope()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'navigation', 'forms', 'buttons', 'notifications', 'empty_states', 'tooltips',
    'knowledge_articles', 'marketplace_listings', 'terms', 'license_agreements',
    'email_templates', 'pdf_exports'
  );
$$;

create or replace function public._bplgef03_regional_defaults(p_locale text)
returns jsonb language sql immutable as $$
  select case p_locale
    when 'no' then jsonb_build_object('date_format', 'DD.MM.YYYY', 'number_format', 'nb-NO', 'currency', 'NOK', 'timezone', 'Europe/Oslo')
    when 'sv' then jsonb_build_object('date_format', 'YYYY-MM-DD', 'number_format', 'sv-SE', 'currency', 'SEK', 'timezone', 'Europe/Stockholm')
    when 'da' then jsonb_build_object('date_format', 'DD.MM.YYYY', 'number_format', 'da-DK', 'currency', 'DKK', 'timezone', 'Europe/Copenhagen')
    when 'de' then jsonb_build_object('date_format', 'DD.MM.YYYY', 'number_format', 'de-DE', 'currency', 'EUR', 'timezone', 'Europe/Berlin')
    else jsonb_build_object('date_format', 'YYYY-MM-DD', 'number_format', 'en-GB', 'currency', 'EUR', 'timezone', 'Europe/Oslo')
  end;
$$;

create or replace function public._bplge_language_label(p_locale text)
returns text language sql immutable as $$
  select case p_locale
    when 'en' then 'English' when 'no' then 'Norsk' when 'sv' then 'Svenska' when 'da' then 'Dansk'
    when 'de' then 'Deutsch' when 'es' then 'Español' when 'fr' then 'Français'
    when 'nl' then 'Nederlands' when 'pl' then 'Polski' when 'uk' then 'Українська'
    else p_locale
  end;
$$;

create or replace function public._bplge_seed_definitions()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_pack_language_definitions (
    pack_key, pack_name, mandatory_languages, optional_languages, default_language,
    locale_namespace, locale_resource_path, translation_status, regional_defaults, localization_scope
  )
  select
    v.pack_key, v.pack_name,
    public._bplgef03_mandatory_languages(),
    public._bplgef03_optional_languages(),
    'en', v.namespace, v.path,
    v.status::jsonb,
    jsonb_build_object(
      'en', public._bplgef03_regional_defaults('en'),
      'no', public._bplgef03_regional_defaults('no'),
      'sv', public._bplgef03_regional_defaults('sv'),
      'da', public._bplgef03_regional_defaults('da')
    ),
    public._bplgef03_localization_scope()
  from (values
    ('aipify_hosts', 'Aipify Hosts', 'hosts', 'locales/{locale}/hosts.json',
      '{"en":"complete","no":"complete","sv":"complete","da":"complete"}'),
    ('aipify_commerce', 'Aipify Commerce', 'packs/aipify-commerce', 'locales/{locale}/packs/aipify-commerce.json',
      '{"en":"complete","no":"complete","sv":"complete","da":"complete"}'),
    ('aipify_support', 'Aipify Support', 'packs/aipify-support', 'locales/{locale}/packs/aipify-support.json',
      '{"en":"complete","no":"complete","sv":"complete","da":"complete"}'),
    ('aipify_executive', 'Aipify Executive', 'packs/aipify-executive', 'locales/{locale}/packs/aipify-executive.json',
      '{"en":"complete","no":"complete","sv":"complete","da":"complete"}'),
    ('aipify_growth', 'Aipify Growth', 'packs/aipify-growth', 'locales/{locale}/packs/aipify-growth.json',
      '{"en":"complete","no":"complete","sv":"complete","da":"complete"}'),
    ('general_business', 'Aipify Essentials', 'packs/aipify-essentials', 'locales/{locale}/packs/aipify-essentials.json',
      '{"en":"complete","no":"complete","sv":"complete","da":"complete"}')
  ) as v(pack_key, pack_name, namespace, path, status)
  on conflict (pack_key) do update set
    pack_name = excluded.pack_name,
    locale_namespace = excluded.locale_namespace,
    locale_resource_path = excluded.locale_resource_path,
    translation_status = excluded.translation_status,
    updated_at = now();
end; $$;

create or replace function public._bplge_ensure_tenant_state(p_tenant_id uuid, p_pack_key text)
returns public.business_pack_language_tenant_state language plpgsql security definer set search_path = public as $$
declare v_row public.business_pack_language_tenant_state;
begin
  insert into public.business_pack_language_tenant_state (tenant_id, pack_key, enabled_languages, default_language)
  values (p_tenant_id, p_pack_key, '["en"]'::jsonb, 'en')
  on conflict (tenant_id, pack_key) do nothing;
  select * into v_row from public.business_pack_language_tenant_state where tenant_id = p_tenant_id and pack_key = p_pack_key;
  return v_row;
end; $$;

create or replace function public._bplge_build_language_row(p_locale text, p_status text, p_enabled boolean)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'locale', p_locale,
    'label', public._bplge_language_label(p_locale),
    'translation_status', p_status,
    'enabled', p_enabled,
    'regional', public._bplgef03_regional_defaults(p_locale)
  );
$$;

create or replace function public._bplge_log_gap(
  p_pack_key text, p_locale text, p_resource_key text default null, p_surface text default 'ui'
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.business_pack_language_gaps (pack_key, locale, resource_key, surface)
  values (p_pack_key, p_locale, p_resource_key, p_surface)
  returning id into v_id;
  insert into public.business_pack_language_audit_logs (tenant_id, pack_key, action, summary, context)
  values (null, p_pack_key, 'translation_gap_logged', 'Translation gap logged — fallback to default language',
    jsonb_build_object('locale', p_locale, 'resource_key', p_resource_key, 'surface', p_surface));
  return v_id;
end; $$;

create or replace function public.get_business_pack_language_center(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_def public.business_pack_language_definitions;
  v_state public.business_pack_language_tenant_state;
  v_installed jsonb := '[]'::jsonb;
  v_available jsonb := '[]'::jsonb;
  v_locale text;
  v_status text;
  v_enabled boolean;
  v_completion numeric := 0;
  v_mandatory_count int := 0;
  v_complete_count int := 0;
begin
  perform public._bplge_require_view();
  v_tenant_id := public._bplge_require_tenant();
  perform public._bplge_seed_definitions();

  select * into v_def from public.business_pack_language_definitions where pack_key = p_pack_key;
  if v_def.id is null then
    return jsonb_build_object('found', false, 'pack_key', p_pack_key);
  end if;

  v_state := public._bplge_ensure_tenant_state(v_tenant_id, p_pack_key);

  for v_locale in select jsonb_array_elements_text(v_def.mandatory_languages)
  loop
    v_status := coalesce(v_def.translation_status->>v_locale, 'pending');
    v_enabled := v_state.enabled_languages ? v_locale;
    v_mandatory_count := v_mandatory_count + 1;
    if v_status = 'complete' then v_complete_count := v_complete_count + 1; end if;
    if v_enabled then
      v_installed := v_installed || public._bplge_build_language_row(v_locale, v_status, true);
    else
      v_available := v_available || public._bplge_build_language_row(v_locale, v_status, false);
    end if;
  end loop;

  for v_locale in select jsonb_array_elements_text(v_def.optional_languages)
  loop
    v_status := coalesce(v_def.translation_status->>v_locale, 'pending');
    v_enabled := v_state.enabled_languages ? v_locale;
    if v_enabled then
      v_installed := v_installed || public._bplge_build_language_row(v_locale, v_status, true);
    else
      v_available := v_available || public._bplge_build_language_row(v_locale, v_status, false);
    end if;
  end loop;

  v_completion := case when v_mandatory_count > 0 then round((v_complete_count::numeric / v_mandatory_count) * 100, 1) else 0 end;

  perform public._bplge_log(v_tenant_id, p_pack_key, 'center_view', 'Language center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', public._bplgef03_principle(),
    'pack_key', p_pack_key,
    'definition', jsonb_build_object(
      'pack_name', v_def.pack_name,
      'mandatory_languages', v_def.mandatory_languages,
      'optional_languages', v_def.optional_languages,
      'default_language', v_def.default_language,
      'locale_namespace', v_def.locale_namespace,
      'locale_resource_path', v_def.locale_resource_path,
      'localization_scope', v_def.localization_scope,
      'translation_completion_percent', v_completion
    ),
    'overview', jsonb_build_object(
      'installed_languages', v_installed,
      'available_languages', v_available,
      'default_language', v_state.default_language,
      'default_language_label', public._bplge_language_label(v_state.default_language),
      'translation_completion_percent', v_completion,
      'installation_complete', v_state.installation_complete,
      'resources_generated_at', v_state.resources_generated_at
    ),
    'installation_flow', public._bplgef03_installation_flow(),
    'fallback_rules', jsonb_build_array(
      'Display default language when translation unavailable',
      'Log translation gaps automatically',
      'Notify Platform Admin of unresolved gaps'
    ),
    'notifications', jsonb_build_array(
      jsonb_build_object('key', 'installation_completed', 'localized', true),
      jsonb_build_object('key', 'license_upgraded', 'localized', true),
      jsonb_build_object('key', 'trial_ending_soon', 'localized', true),
      jsonb_build_object('key', 'subscription_renewed', 'localized', true)
    ),
    'governance_note', 'Customers select active languages and change defaults. Platform Admin monitors coverage.',
    'language_center_route', '/app/marketplace/packs/' || p_pack_key || '/languages',
    'landing_route', '/app/marketplace/packs/' || p_pack_key
  );
end; $$;

create or replace function public.get_business_pack_language_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bplge_require_view();
  perform public._bplge_seed_definitions();

  return jsonb_build_object(
    'has_access', true,
    'is_platform_admin', public.is_platform_admin(),
    'principle', public._bplgef03_principle(),
    'mandatory_languages', public._bplgef03_mandatory_languages(),
    'optional_languages', public._bplgef03_optional_languages(),
    'installation_flow', public._bplgef03_installation_flow(),
    'localization_scope', public._bplgef03_localization_scope(),
    'governance', jsonb_build_object(
      'super_admin', 'Define global language standards and approve new supported languages',
      'platform_admin', 'Monitor translation coverage and publish translation updates',
      'customers', 'Select active languages, change default, expand language support later',
      'growth_partners', 'View partner materials in supported languages only'
    ),
    'forbidden', jsonb_build_array('Hardcoded text strings in Business Pack UI'),
    'summary', jsonb_build_object(
      'pack_definitions', (select count(*) from public.business_pack_language_definitions),
      'tenant_configurations', (select count(*) from public.business_pack_language_tenant_state),
      'open_translation_gaps', (select count(*) from public.business_pack_language_gaps where not resolved),
      'audit_events', (select count(*) from public.business_pack_language_audit_logs)
    ),
    'definitions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', d.pack_key,
        'pack_name', d.pack_name,
        'locale_namespace', d.locale_namespace,
        'default_language', d.default_language,
        'translation_status', d.translation_status,
        'language_center_route', '/app/marketplace/packs/' || d.pack_key || '/languages'
      ) order by d.pack_name)
      from public.business_pack_language_definitions d
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(row_to_json(a) order by a.created_at desc)
      from (select * from public.business_pack_language_audit_logs order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'success_criteria', jsonb_build_array(
      'Customers experience Aipify as built for their language',
      'Language is integrated capability — not optional translation layer',
      'Marketplace, notifications, and Knowledge Center localized'
    )
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.get_business_pack_language_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bplge_seed_definitions();
  return jsonb_build_object(
    'has_access', true,
    'pack_count', (select count(*) from public.business_pack_language_definitions),
    'principle', public._bplgef03_principle()
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.perform_business_pack_language_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_state public.business_pack_language_tenant_state;
  v_locale text;
  v_enabled jsonb;
begin
  v_tenant_id := public._bplge_require_tenant();
  v_state := public._bplge_ensure_tenant_state(v_tenant_id, p_pack_key);

  if p_action_type = 'enable_language' then
    perform public._bplge_require_manage();
    v_locale := p_payload->>'locale';
    if v_locale is null then raise exception 'locale required'; end if;
    v_enabled := v_state.enabled_languages;
    if not v_enabled ? v_locale then
      v_enabled := v_enabled || to_jsonb(v_locale);
    end if;
    update public.business_pack_language_tenant_state
    set enabled_languages = v_enabled, updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key
    returning * into v_state;
    perform public._bplge_log(v_tenant_id, p_pack_key, 'language_enabled', 'Language enabled: ' || v_locale, p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'enabled', 'locale', v_locale, 'state', row_to_json(v_state)::jsonb);
  end if;

  if p_action_type = 'disable_language' then
    perform public._bplge_require_manage();
    v_locale := p_payload->>'locale';
    if v_locale is null then raise exception 'locale required'; end if;
    if v_locale = v_state.default_language then raise exception 'Cannot disable default language'; end if;
    v_enabled := (
      select coalesce(jsonb_agg(to_jsonb(lang)), '[]'::jsonb)
      from jsonb_array_elements_text(v_state.enabled_languages) lang
      where lang <> v_locale
    );
    update public.business_pack_language_tenant_state
    set enabled_languages = v_enabled, updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key
    returning * into v_state;
    perform public._bplge_log(v_tenant_id, p_pack_key, 'language_disabled', 'Language disabled: ' || v_locale, p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'disabled', 'locale', v_locale, 'state', row_to_json(v_state)::jsonb);
  end if;

  if p_action_type = 'set_default_language' then
    perform public._bplge_require_manage();
    v_locale := p_payload->>'locale';
    if v_locale is null then raise exception 'locale required'; end if;
    v_enabled := v_state.enabled_languages;
    if not v_enabled ? v_locale then
      v_enabled := v_enabled || to_jsonb(v_locale);
    end if;
    update public.business_pack_language_tenant_state
    set default_language = v_locale, enabled_languages = v_enabled, updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key
    returning * into v_state;
    perform public._bplge_log(v_tenant_id, p_pack_key, 'default_language_changed', 'Default language set to ' || v_locale, p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'updated', 'locale', v_locale, 'state', row_to_json(v_state)::jsonb);
  end if;

  if p_action_type = 'activate_languages' then
    perform public._bplge_require_manage();
    v_enabled := coalesce(p_payload->'locales', v_state.enabled_languages);
    update public.business_pack_language_tenant_state
    set enabled_languages = v_enabled, updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key
    returning * into v_state;
    perform public._bplge_log(v_tenant_id, p_pack_key, 'languages_activated', 'Languages activated for pack', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'activated', 'state', row_to_json(v_state)::jsonb);
  end if;

  if p_action_type = 'generate_resources' then
    perform public._bplge_require_manage();
    update public.business_pack_language_tenant_state
    set resources_generated_at = now(), installation_complete = true, updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key
    returning * into v_state;
    perform public._bplge_log(v_tenant_id, p_pack_key, 'resources_generated', 'Pack language resources generated', p_payload);
    perform public._bplge_log(v_tenant_id, p_pack_key, 'installation_completed', 'Language installation complete — ready to use', p_payload);
    return jsonb_build_object(
      'action', p_action_type,
      'status', 'ready',
      'message', 'Pack resources generated for enabled languages. Ready to use.',
      'state', row_to_json(v_state)::jsonb
    );
  end if;

  if p_action_type = 'publish_translations' then
    if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
    perform public._bplge_seed_definitions();
    perform public._bplge_log(v_tenant_id, p_pack_key, 'translation_published', 'Translation update published', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'published');
  end if;

  if p_action_type = 'log_gap' then
    perform public._bplge_log_gap(p_pack_key, coalesce(p_payload->>'locale', 'en'), p_payload->>'resource_key', coalesce(p_payload->>'surface', 'ui'));
    return jsonb_build_object('action', p_action_type, 'status', 'logged', 'fallback', 'default_language');
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_business_pack_language_knowledge()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'business-pack-language', 'Business Pack Language',
    'Multilingual support, language installation, and localization standards for Aipify Business Packs.', 380
  );
  perform public._ahostkc_seed_article('business-pack-language', 'multilingual-by-design', 'Multilingual by Design',
    'Every Aipify Business Pack supports English, Norwegian, Swedish, and Danish from day one. Language is an integrated capability — not an optional translation layer added later.');
  perform public._ahostkc_seed_article('business-pack-language', 'language-installation', 'Language installation workflow',
    'After installing a Business Pack: choose languages, activate them, generate pack resources, and begin using the pack in your team preferred languages.');
  perform public._ahostkc_seed_article('business-pack-language', 'translation-standards', 'Translation standards',
    'All customer-facing content supports localization: navigation, forms, buttons, notifications, empty states, Knowledge Center articles, marketplace listings, terms, emails, and PDF exports. Hardcoded strings are prohibited.');
  perform public._ahostkc_seed_article('business-pack-language', 'fallback-and-gaps', 'Fallback rules and translation gaps',
    'When a translation is unavailable, Aipify displays the default language, logs the gap, and notifies Platform Admin. Expand language support anytime from the Language Center.');
  perform public._ahostkc_seed_article('business-pack-language', 'regional-formats', 'Regional formats',
    'Localization includes date formats, number formats, currency display, and time zones appropriate to each supported language and region.');
end; $$;

select public._bplge_seed_definitions();
select public.seed_business_pack_language_knowledge();

grant execute on function public.get_business_pack_language_center(text) to authenticated;
grant execute on function public.get_business_pack_language_engine_dashboard() to authenticated;
grant execute on function public.get_business_pack_language_engine_card() to authenticated;
grant execute on function public.perform_business_pack_language_action(text, text, jsonb) to authenticated;
