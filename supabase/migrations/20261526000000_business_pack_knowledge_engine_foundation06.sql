-- Foundation 06 — Business Pack Knowledge Engine
-- Feature owner: PLATFORM FOUNDATION. Helpers: _bpke_* (engine), _bpkef06_* (blueprint)
-- Core principle: Knowledge should scale faster than support.

create table if not exists public.business_pack_knowledge_definitions (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  publication_status text not null default 'published' check (
    publication_status in ('draft', 'published', 'requires_update', 'withdrawn')
  ),
  supported_locales jsonb not null default '["en","no","sv","da"]'::jsonb,
  knowledge_structure jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.business_pack_knowledge_definitions enable row level security;
revoke all on public.business_pack_knowledge_definitions from authenticated, anon;

create table if not exists public.business_pack_knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null,
  article_slug text not null,
  category text not null check (
    category in (
      'overview', 'getting_started', 'features', 'best_practices',
      'troubleshooting', 'release_notes', 'upgrade_guidance', 'advanced_topics'
    )
  ),
  locale text not null default 'en' check (locale in ('en', 'no', 'sv', 'da')),
  title text not null,
  summary text not null,
  body text not null,
  keywords jsonb not null default '[]'::jsonb,
  context_surfaces jsonb not null default '[]'::jsonb,
  version text not null default '1.0.0',
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  view_count integer not null default 0,
  helpful_count integer not null default 0,
  not_helpful_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  unique (pack_key, article_slug, locale, version)
);

create index if not exists business_pack_knowledge_articles_pack_idx
  on public.business_pack_knowledge_articles (pack_key, locale, category);

create index if not exists business_pack_knowledge_articles_search_idx
  on public.business_pack_knowledge_articles using gin (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(body, ''))
  );

alter table public.business_pack_knowledge_articles enable row level security;
revoke all on public.business_pack_knowledge_articles from authenticated, anon;

create table if not exists public.business_pack_knowledge_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  article_id uuid not null references public.business_pack_knowledge_articles (id) on delete cascade,
  pack_key text not null,
  helpful boolean not null,
  suggestion text,
  created_at timestamptz not null default now(),
  actor_user_id uuid references public.users (id) on delete set null
);

create index if not exists business_pack_knowledge_feedback_article_idx
  on public.business_pack_knowledge_feedback (article_id, created_at desc);

alter table public.business_pack_knowledge_feedback enable row level security;
revoke all on public.business_pack_knowledge_feedback from authenticated, anon;

create table if not exists public.business_pack_knowledge_search_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  pack_key text not null,
  query text not null,
  locale text not null default 'en',
  results_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_knowledge_search_logs_pack_idx
  on public.business_pack_knowledge_search_logs (pack_key, created_at desc);

alter table public.business_pack_knowledge_search_logs enable row level security;
revoke all on public.business_pack_knowledge_search_logs from authenticated, anon;

create table if not exists public.business_pack_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null,
  query text not null,
  locale text not null default 'en',
  occurrence_count integer not null default 1,
  resolved boolean not null default false,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (pack_key, query, locale)
);

alter table public.business_pack_knowledge_gaps enable row level security;
revoke all on public.business_pack_knowledge_gaps from authenticated, anon;

create table if not exists public.business_pack_knowledge_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  pack_key text not null,
  action text not null check (
    action in (
      'article_created', 'article_updated', 'article_published', 'translation_updated',
      'article_viewed', 'feedback_submitted', 'search_recorded', 'gap_detected', 'center_view'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_knowledge_audit_tenant_idx
  on public.business_pack_knowledge_audit_logs (tenant_id, created_at desc);

alter table public.business_pack_knowledge_audit_logs enable row level security;
revoke all on public.business_pack_knowledge_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_pack_knowledge', v.description
from (values
  ('business_pack_knowledge.view', 'View Business Pack Knowledge', 'View pack knowledge center and articles'),
  ('business_pack_knowledge.feedback', 'Rate Pack Knowledge', 'Rate articles and suggest improvements'),
  ('business_pack_knowledge.manage', 'Manage Business Pack Knowledge', 'Maintain pack-specific knowledge'),
  ('business_pack_knowledge.publish', 'Publish Business Pack Knowledge', 'Publish approved knowledge content')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_pack_knowledge.view'), ('owner', 'business_pack_knowledge.feedback'),
  ('administrator', 'business_pack_knowledge.view'), ('administrator', 'business_pack_knowledge.feedback'),
  ('manager', 'business_pack_knowledge.view'),
  ('viewer', 'business_pack_knowledge.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bpke_require_view()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.is_platform_admin() then return; end if;
  perform public._irp_require_permission('business_pack_knowledge.view');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bpke_require_feedback()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_require_permission('business_pack_knowledge.feedback');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bpke_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._bpke_log(
  p_tenant_id uuid, p_pack_key text, p_action text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.business_pack_knowledge_audit_logs (tenant_id, pack_key, action, summary, actor_user_id, context)
  values (p_tenant_id, p_pack_key, p_action, p_summary, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._bpkef06_principle()
returns text language sql immutable as $$
  select 'Knowledge should scale faster than support — customers find answers quickly without contacting support.';
$$;

create or replace function public._bpkef06_knowledge_structure()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'overview', 'label', 'Overview', 'order', 1),
    jsonb_build_object('key', 'getting_started', 'label', 'Getting Started', 'order', 2),
    jsonb_build_object('key', 'features', 'label', 'Using Features', 'order', 3),
    jsonb_build_object('key', 'best_practices', 'label', 'Best Practices', 'order', 4),
    jsonb_build_object('key', 'troubleshooting', 'label', 'Troubleshooting', 'order', 5),
    jsonb_build_object('key', 'release_notes', 'label', 'Release Notes', 'order', 6),
    jsonb_build_object('key', 'upgrade_guidance', 'label', 'Upgrade Guidance', 'order', 7),
    jsonb_build_object('key', 'advanced_topics', 'label', 'Advanced Topics', 'order', 8)
  );
$$;

create or replace function public._bpkef06_mandatory_categories()
returns jsonb language sql immutable as $$
  select '["getting_started","features","best_practices","troubleshooting","release_notes","upgrade_guidance"]'::jsonb;
$$;

create or replace function public._bpke_localized_text(
  p_locale text, p_key text, p_pack_name text
) returns text language plpgsql immutable as $$
begin
  return case p_key
    when 'overview_title' then case p_locale
      when 'no' then 'Oversikt over ' || p_pack_name
      when 'sv' then 'Översikt av ' || p_pack_name
      when 'da' then 'Oversigt over ' || p_pack_name
      else p_pack_name || ' overview' end
    when 'what_is_title' then case p_locale
      when 'no' then 'Hva er ' || p_pack_name || '?'
      when 'sv' then 'Vad är ' || p_pack_name || '?'
      when 'da' then 'Hvad er ' || p_pack_name || '?'
      else 'What is ' || p_pack_name || '?' end
    when 'who_for_title' then case p_locale
      when 'no' then 'Hvem er ' || p_pack_name || ' for?'
      when 'sv' then 'Vem är ' || p_pack_name || ' till för?'
      when 'da' then 'Hvem er ' || p_pack_name || ' til?'
      else 'Who is ' || p_pack_name || ' for?' end
    when 'how_start_title' then case p_locale
      when 'no' then 'Kom i gang med ' || p_pack_name
      when 'sv' then 'Kom igång med ' || p_pack_name
      when 'da' then 'Kom i gang med ' || p_pack_name
      else 'How do I get started with ' || p_pack_name || '?' end
    when 'features_title' then case p_locale
      when 'no' then 'Kjernefunksjoner'
      when 'sv' then 'Kärnfunktioner'
      when 'da' then 'Kernefunktioner'
      else 'Core feature explanations' end
    when 'config_title' then case p_locale
      when 'no' then 'Konfigurasjonsguide'
      when 'sv' then 'Konfigurationsguide'
      when 'da' then 'Konfigurationsguide'
      else 'Configuration guide' end
    when 'best_practices_title' then case p_locale
      when 'no' then 'Anbefalte arbeidsflyter'
      when 'sv' then 'Rekommenderade arbetsflöden'
      when 'da' then 'Anbefalede arbejdsgange'
      else 'Recommended workflows' end
    when 'common_errors_title' then case p_locale
      when 'no' then 'Vanlige feil og løsninger'
      when 'sv' then 'Vanliga fel och lösningar'
      when 'da' then 'Almindelige fejl og løsninger'
      else 'Common errors and recovery' end
    when 'integration_title' then case p_locale
      when 'no' then 'Integrasjonsproblemer'
      when 'sv' then 'Integrationsproblem'
      when 'da' then 'Integrationsproblemer'
      else 'Integration issues' end
    when 'release_title' then case p_locale
      when 'no' then 'Siste versjon'
      when 'sv' then 'Senaste versionen'
      when 'da' then 'Seneste version'
      else 'Latest release notes' end
    when 'upgrade_when_title' then case p_locale
      when 'no' then 'Når bør jeg oppgradere?'
      when 'sv' then 'När ska jag uppgradera?'
      when 'da' then 'Hvornår skal jeg opgradere?'
      else 'When should I upgrade?' end
    when 'upgrade_capacity_title' then case p_locale
      when 'no' then 'Kapasitetshensyn'
      when 'sv' then 'Kapacitetsöverväganden'
      when 'da' then 'Kapacitetsovervejelser'
      else 'Capacity considerations' end
    when 'advanced_title' then case p_locale
      when 'no' then 'Avanserte emner'
      when 'sv' then 'Avancerade ämnen'
      when 'da' then 'Avancerede emner'
      else 'Advanced configuration' end
    else p_key
  end;
end; $$;

create or replace function public._bpke_localized_summary(
  p_locale text, p_key text, p_pack_name text
) returns text language plpgsql immutable as $$
begin
  return case p_locale
    when 'no' then 'Praktisk veiledning for ' || p_pack_name || ' — klar, handlingsorientert og uten unødvendig jargon.'
    when 'sv' then 'Praktisk vägledning för ' || p_pack_name || ' — tydlig, handlingsbar och utan onödig jargong.'
    when 'da' then 'Praktisk vejledning til ' || p_pack_name || ' — klar, handlingsorienteret og uden unødvendigt jargon.'
    else 'Practical guidance for ' || p_pack_name || ' — clear, actionable, and free of unnecessary jargon.'
  end;
end; $$;

create or replace function public._bpke_localized_body(
  p_locale text, p_key text, p_pack_name text
) returns text language plpgsql immutable as $$
begin
  return case p_locale
    when 'no' then p_pack_name || ' hjelper teamet ditt med daglige operasjoner. Start med oversikten, aktiver nødvendige moduler, og følg anbefalte arbeidsflyter. Kontakt support bare når feilsøking ikke løser problemet.'
    when 'sv' then p_pack_name || ' hjälper ditt team med dagliga operationer. Börja med översikten, aktivera nödvändiga moduler och följ rekommenderade arbetsflöden. Kontakta support endast när felsökning inte löser problemet.'
    when 'da' then p_pack_name || ' hjælper dit team med daglige operationer. Start med oversigten, aktiver nødvendige moduler og følg anbefalede arbejdsgange. Kontakt support kun når fejlfinding ikke løser problemet.'
    else p_pack_name || ' helps your team with everyday operations. Start with the overview, activate required modules, and follow recommended workflows. Contact support only when troubleshooting does not resolve the issue.'
  end;
end; $$;

create or replace function public._bpke_seed_article(
  p_pack_key text, p_pack_name text, p_locale text,
  p_slug text, p_category text, p_title_key text,
  p_keywords jsonb, p_context jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_pack_knowledge_articles (
    pack_key, article_slug, category, locale, title, summary, body, keywords, context_surfaces
  ) values (
    p_pack_key, p_slug, p_category, p_locale,
    public._bpke_localized_text(p_locale, p_title_key, p_pack_name),
    public._bpke_localized_summary(p_locale, p_title_key, p_pack_name),
    public._bpke_localized_body(p_locale, p_title_key, p_pack_name),
    p_keywords, p_context
  ) on conflict (pack_key, article_slug, locale, version) do update set
    title = excluded.title,
    summary = excluded.summary,
    body = excluded.body,
    keywords = excluded.keywords,
    context_surfaces = excluded.context_surfaces,
    updated_at = now();
end; $$;

create or replace function public._bpke_seed_knowledge()
returns void language plpgsql security definer set search_path = public as $$
declare v_pack record;
  v_locale text;
begin
  for v_pack in
    select * from (values
      ('aipify_hosts', 'Aipify Hosts'),
      ('aipify_commerce', 'Aipify Commerce'),
      ('aipify_support', 'Aipify Support'),
      ('aipify_executive', 'Aipify Executive'),
      ('aipify_growth', 'Aipify Growth'),
      ('general_business', 'Aipify Essentials')
    ) as t(pack_key, pack_name)
  loop
    insert into public.business_pack_knowledge_definitions (
      pack_key, pack_name, publication_status, supported_locales, knowledge_structure, published_at
    ) values (
      v_pack.pack_key, v_pack.pack_name, 'published',
      '["en","no","sv","da"]'::jsonb,
      public._bpkef06_knowledge_structure(),
      now()
    ) on conflict (pack_key) do update set
      pack_name = excluded.pack_name,
      knowledge_structure = excluded.knowledge_structure,
      publication_status = 'published',
      updated_at = now();

    foreach v_locale in array array['en', 'no', 'sv', 'da']
    loop
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'pack-overview', 'overview', 'overview_title', '["overview","introduction"]'::jsonb, '[]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'what-is-pack', 'getting_started', 'what_is_title', '["getting started","faq"]'::jsonb, '[]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'who-is-it-for', 'getting_started', 'who_for_title', '["audience","faq"]'::jsonb, '[]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'how-to-get-started', 'getting_started', 'how_start_title', '["setup","install"]'::jsonb, '["installation"]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'core-features', 'features', 'features_title', '["features","how-to"]'::jsonb, '["features"]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'configuration-guide', 'features', 'config_title', '["configuration","setup"]'::jsonb, '["installation"]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'recommended-workflows', 'best_practices', 'best_practices_title', '["workflow","success"]'::jsonb, '[]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'common-errors', 'troubleshooting', 'common_errors_title', '["error","recovery"]'::jsonb, '[]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'integration-issues', 'troubleshooting', 'integration_title', '["integration","connection"]'::jsonb, '["integrations"]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'latest-release', 'release_notes', 'release_title', '["release","changelog"]'::jsonb, '[]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'when-to-upgrade', 'upgrade_guidance', 'upgrade_when_title', '["upgrade","plan"]'::jsonb, '["licensing"]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'capacity-considerations', 'upgrade_guidance', 'upgrade_capacity_title', '["capacity","license"]'::jsonb, '["licensing"]'::jsonb);
      perform public._bpke_seed_article(v_pack.pack_key, v_pack.pack_name, v_locale,
        'advanced-configuration', 'advanced_topics', 'advanced_title', '["advanced","enterprise"]'::jsonb, '["integrations"]'::jsonb);
    end loop;
  end loop;
end; $$;

create or replace function public.get_business_pack_knowledge_center(
  p_pack_key text,
  p_locale text default 'en',
  p_search text default null,
  p_category text default null,
  p_context_surface text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_def public.business_pack_knowledge_definitions;
  v_locale text := coalesce(nullif(trim(p_locale), ''), 'en');
  v_results_count integer := 0;
begin
  perform public._bpke_require_view();
  v_tenant_id := public._bpke_require_tenant();
  perform public._bpke_seed_knowledge();

  if v_locale not in ('en', 'no', 'sv', 'da') then v_locale := 'en'; end if;

  select * into v_def from public.business_pack_knowledge_definitions where pack_key = p_pack_key;
  if v_def.id is null then
    return jsonb_build_object('found', false, 'pack_key', p_pack_key);
  end if;

  if p_search is not null and length(trim(p_search)) > 0 then
    select count(*) into v_results_count
    from public.business_pack_knowledge_articles a
    where a.pack_key = p_pack_key and a.locale = v_locale
      and (
        a.title ilike '%' || trim(p_search) || '%'
        or a.summary ilike '%' || trim(p_search) || '%'
        or a.body ilike '%' || trim(p_search) || '%'
        or a.keywords::text ilike '%' || trim(p_search) || '%'
      )
      and (p_category is null or a.category = p_category);

    insert into public.business_pack_knowledge_search_logs (tenant_id, pack_key, query, locale, results_count)
    values (v_tenant_id, p_pack_key, trim(p_search), v_locale, v_results_count);

    if v_results_count = 0 then
      insert into public.business_pack_knowledge_gaps (pack_key, query, locale, occurrence_count, last_seen_at)
      values (p_pack_key, trim(p_search), v_locale, 1, now())
      on conflict (pack_key, query, locale) do update set
        occurrence_count = public.business_pack_knowledge_gaps.occurrence_count + 1,
        last_seen_at = now();
      perform public._bpke_log(v_tenant_id, p_pack_key, 'gap_detected', 'Failed search: ' || trim(p_search),
        jsonb_build_object('query', trim(p_search), 'locale', v_locale));
    end if;

    perform public._bpke_log(v_tenant_id, p_pack_key, 'search_recorded', 'Knowledge search performed',
      jsonb_build_object('query', trim(p_search), 'results_count', v_results_count));
  end if;

  perform public._bpke_log(v_tenant_id, p_pack_key, 'center_view', 'Knowledge center viewed',
    jsonb_build_object('locale', v_locale, 'category', p_category, 'context', p_context_surface));

  return jsonb_build_object(
    'found', true,
    'principle', public._bpkef06_principle(),
    'pack_key', p_pack_key,
    'locale', v_locale,
    'definition', jsonb_build_object(
      'pack_name', v_def.pack_name,
      'publication_status', v_def.publication_status,
      'supported_locales', v_def.supported_locales,
      'knowledge_structure', v_def.knowledge_structure
    ),
    'structure', public._bpkef06_knowledge_structure(),
    'mandatory_categories', public._bpkef06_mandatory_categories(),
    'articles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'article_slug', a.article_slug,
        'category', a.category,
        'title', a.title,
        'summary', a.summary,
        'body', a.body,
        'keywords', a.keywords,
        'context_surfaces', a.context_surfaces,
        'version', a.version,
        'published_at', a.published_at,
        'updated_at', a.updated_at,
        'view_count', a.view_count,
        'helpful_count', a.helpful_count,
        'not_helpful_count', a.not_helpful_count,
        'helpfulness_percent', case
          when (a.helpful_count + a.not_helpful_count) = 0 then null
          else round(100.0 * a.helpful_count / (a.helpful_count + a.not_helpful_count))
        end
      ) order by a.category, a.title)
      from public.business_pack_knowledge_articles a
      where a.pack_key = p_pack_key and a.locale = v_locale
        and (p_category is null or a.category = p_category)
        and (
          p_search is null or length(trim(p_search)) = 0
          or a.title ilike '%' || trim(p_search) || '%'
          or a.summary ilike '%' || trim(p_search) || '%'
          or a.body ilike '%' || trim(p_search) || '%'
          or a.keywords::text ilike '%' || trim(p_search) || '%'
        )
    ), '[]'::jsonb),
    'contextual_articles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'article_slug', a.article_slug,
        'category', a.category,
        'title', a.title,
        'summary', a.summary,
        'context_surfaces', a.context_surfaces
      ) order by a.category)
      from public.business_pack_knowledge_articles a
      where a.pack_key = p_pack_key and a.locale = v_locale
        and p_context_surface is not null
        and a.context_surfaces @> jsonb_build_array(p_context_surface)
      limit 6
    ), '[]'::jsonb),
    'analytics', jsonb_build_object(
      'total_articles', (select count(*) from public.business_pack_knowledge_articles where pack_key = p_pack_key and locale = v_locale),
      'total_views', (select coalesce(sum(view_count), 0) from public.business_pack_knowledge_articles where pack_key = p_pack_key),
      'open_gaps', (select count(*) from public.business_pack_knowledge_gaps where pack_key = p_pack_key and not resolved)
    ),
    'governance_note', 'Customers consume knowledge. Platform Admin publishes approved content. Pack owners maintain pack-specific articles.',
    'knowledge_center_route', '/app/marketplace/packs/' || p_pack_key || '/knowledge'
  );
end; $$;

create or replace function public.get_business_pack_knowledge_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpke_require_view();
  perform public._bpke_seed_knowledge();

  return jsonb_build_object(
    'has_access', true,
    'is_platform_admin', public.is_platform_admin(),
    'principle', public._bpkef06_principle(),
    'knowledge_structure', public._bpkef06_knowledge_structure(),
    'mandatory_categories', public._bpkef06_mandatory_categories(),
    'supported_locales', '["en","no","sv","da"]'::jsonb,
    'governance', jsonb_build_object(
      'super_admin', 'Defines knowledge standards',
      'platform_admin', 'Publishes approved content',
      'pack_owners', 'Maintain pack-specific knowledge',
      'customers', 'Consume knowledge resources',
      'growth_partners', 'Access sales-relevant knowledge materials'
    ),
    'forbidden', jsonb_build_array(
      'Excessive jargon and internal-only terminology in customer-facing articles',
      'Publishing knowledge without version and update metadata'
    ),
    'summary', jsonb_build_object(
      'pack_definitions', (select count(*) from public.business_pack_knowledge_definitions where publication_status = 'published'),
      'knowledge_articles', (select count(*) from public.business_pack_knowledge_articles),
      'feedback_records', (select count(*) from public.business_pack_knowledge_feedback),
      'open_knowledge_gaps', (select count(*) from public.business_pack_knowledge_gaps where not resolved),
      'audit_events', (select count(*) from public.business_pack_knowledge_audit_logs)
    ),
    'definitions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', d.pack_key,
        'pack_name', d.pack_name,
        'publication_status', d.publication_status,
        'article_count', (select count(*) from public.business_pack_knowledge_articles a where a.pack_key = d.pack_key),
        'knowledge_center_route', '/app/marketplace/packs/' || d.pack_key || '/knowledge'
      ) order by d.pack_name)
      from public.business_pack_knowledge_definitions d
    ), '[]'::jsonb),
    'top_articles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', a.pack_key,
        'title', a.title,
        'view_count', a.view_count,
        'helpful_count', a.helpful_count
      ) order by a.view_count desc)
      from (select * from public.business_pack_knowledge_articles order by view_count desc limit 10) a
    ), '[]'::jsonb),
    'top_searches', coalesce((
      select jsonb_agg(jsonb_build_object('query', q.query, 'count', q.cnt) order by q.cnt desc)
      from (
        select query, count(*) as cnt from public.business_pack_knowledge_search_logs
        group by query order by count(*) desc limit 10
      ) q
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(row_to_json(a) order by a.created_at desc)
      from (select * from public.business_pack_knowledge_audit_logs order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'success_criteria', jsonb_build_array(
      'Customers find answers quickly without contacting support',
      'Knowledge reduces repetitive support requests',
      'All packs include getting started, features, troubleshooting, and upgrade guidance'
    )
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.get_business_pack_knowledge_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpke_seed_knowledge();
  return jsonb_build_object(
    'has_access', true,
    'pack_count', (select count(*) from public.business_pack_knowledge_definitions where publication_status = 'published'),
    'article_count', (select count(*) from public.business_pack_knowledge_articles),
    'principle', public._bpkef06_principle()
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.perform_business_pack_knowledge_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_article_id uuid;
begin
  v_tenant_id := public._bpke_require_tenant();

  if p_action_type = 'record_article_view' then
    v_article_id := (p_payload->>'article_id')::uuid;
    update public.business_pack_knowledge_articles
    set view_count = view_count + 1, updated_at = now()
    where id = v_article_id and pack_key = p_pack_key;
    perform public._bpke_log(v_tenant_id, p_pack_key, 'article_viewed', 'Article viewed', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'recorded');
  end if;

  if p_action_type = 'rate_article' then
    perform public._bpke_require_feedback();
    v_article_id := (p_payload->>'article_id')::uuid;
    insert into public.business_pack_knowledge_feedback (
      tenant_id, article_id, pack_key, helpful, suggestion, actor_user_id
    ) values (
      v_tenant_id, v_article_id, p_pack_key,
      coalesce((p_payload->>'helpful')::boolean, true),
      p_payload->>'suggestion',
      public._mta_app_user_id()
    );
    if coalesce((p_payload->>'helpful')::boolean, true) then
      update public.business_pack_knowledge_articles set helpful_count = helpful_count + 1 where id = v_article_id;
    else
      update public.business_pack_knowledge_articles set not_helpful_count = not_helpful_count + 1 where id = v_article_id;
    end if;
    perform public._bpke_log(v_tenant_id, p_pack_key, 'feedback_submitted', 'Article feedback submitted', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'submitted', 'message', 'Thank you for your feedback.');
  end if;

  if p_action_type = 'suggest_improvement' then
    perform public._bpke_require_feedback();
    v_article_id := (p_payload->>'article_id')::uuid;
    insert into public.business_pack_knowledge_feedback (
      tenant_id, article_id, pack_key, helpful, suggestion, actor_user_id
    ) values (
      v_tenant_id, v_article_id, p_pack_key, true, p_payload->>'suggestion', public._mta_app_user_id()
    );
    perform public._bpke_log(v_tenant_id, p_pack_key, 'feedback_submitted', 'Improvement suggested', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'submitted', 'message', 'Suggestion received. Thank you.');
  end if;

  if p_action_type = 'publish_knowledge' then
    if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
    perform public._bpke_seed_knowledge();
    update public.business_pack_knowledge_definitions
    set publication_status = 'published', published_at = now(), updated_at = now()
    where pack_key = p_pack_key;
    perform public._bpke_log(v_tenant_id, p_pack_key, 'article_published', 'Knowledge published', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'published');
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_business_pack_knowledge_kc()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'business-pack-knowledge', 'Business Pack Knowledge',
    'Getting started guides, troubleshooting, release notes, and upgrade guidance for Aipify Business Packs.', 380
  );
  perform public._ahostkc_seed_article('business-pack-knowledge', 'knowledge-scales-faster', 'Knowledge scales faster than support',
    'Every Business Pack includes structured knowledge — getting started, features, best practices, troubleshooting, release notes, and upgrade guidance.');
  perform public._ahostkc_seed_article('business-pack-knowledge', 'using-pack-knowledge-search', 'Using pack knowledge search',
    'Search by keyword, filter by category, and find contextual articles on licensing, installation, and integrations.');
  perform public._ahostkc_seed_article('business-pack-knowledge', 'rating-articles', 'Rating knowledge articles',
    'Rate article helpfulness and suggest improvements to help Aipify close knowledge gaps.');
  perform public._ahostkc_seed_article('business-pack-knowledge', 'localized-knowledge', 'Localized knowledge (en, no, sv, da)',
    'All pack knowledge supports English, Norwegian, Swedish, and Danish.');
  perform public._ahostkc_seed_article('business-pack-knowledge', 'support-deflection', 'Support deflection goals',
    'Knowledge should enable customers to solve common issues independently and reduce repetitive support requests.');
end; $$;

select public._bpke_seed_knowledge();
select public.seed_business_pack_knowledge_kc();

grant execute on function public.get_business_pack_knowledge_center(text, text, text, text, text) to authenticated;
grant execute on function public.get_business_pack_knowledge_engine_dashboard() to authenticated;
grant execute on function public.get_business_pack_knowledge_engine_card() to authenticated;
grant execute on function public.perform_business_pack_knowledge_action(text, text, jsonb) to authenticated;
