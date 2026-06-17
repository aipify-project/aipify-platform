-- Phase 336 — Partner Sales Materials Center
-- Feature owner: GROWTH PARTNER PORTAL. Route: /partner/materials. Helpers: _gpm336_*

create table if not exists public.growth_partner_portal_sales_materials (
  id uuid primary key default gen_random_uuid(),
  material_key text not null unique,
  title text not null,
  description text not null default '',
  category text not null check (
    category in (
      'product_brochure', 'sales_presentation', 'one_pager', 'executive_summary',
      'proposal_template', 'roi_calculator', 'case_study', 'demo_script',
      'discovery_guide', 'objection_guide', 'pricing_guide', 'business_pack_guide',
      'industry_playbook', 'competitive_comparison', 'email_template', 'social_asset',
      'video_material', 'webinar_material', 'campaign_pack'
    )
  ),
  language_code text not null default 'en' check (
    language_code in ('en', 'no', 'sv', 'da', 'de', 'fr', 'es', 'pl', 'uk')
  ),
  format_type text not null default 'pdf' check (
    format_type in ('pdf', 'pptx', 'docx', 'xlsx', 'video', 'image', 'canva', 'adobe')
  ),
  industry text not null default '',
  business_pack text not null default '',
  version_label text not null default '1.0',
  is_current boolean not null default true,
  published_at date not null default current_date,
  usage_recommendations text not null default '',
  release_notes text not null default '',
  download_count integer not null default 0,
  preview_url text not null default '',
  download_url text not null default '',
  customizable boolean not null default false,
  sales_access boolean not null default true,
  search_document text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gpp_sales_materials_cat_idx
  on public.growth_partner_portal_sales_materials (category, language_code, is_current);
create index if not exists gpp_sales_materials_search_idx
  on public.growth_partner_portal_sales_materials using gin (to_tsvector('simple', search_document));
alter table public.growth_partner_portal_sales_materials enable row level security;
revoke all on public.growth_partner_portal_sales_materials from authenticated, anon;

create table if not exists public.growth_partner_portal_sales_material_versions (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.growth_partner_portal_sales_materials (id) on delete cascade,
  version_label text not null,
  release_notes text not null default '',
  published_at date not null default current_date,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  unique (material_id, version_label)
);
alter table public.growth_partner_portal_sales_material_versions enable row level security;
revoke all on public.growth_partner_portal_sales_material_versions from authenticated, anon;

create table if not exists public.growth_partner_portal_sales_material_downloads (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  material_id uuid not null references public.growth_partner_portal_sales_materials (id) on delete cascade,
  actor_auth_user_id uuid,
  action_type text not null default 'download' check (
    action_type in ('download', 'preview', 'share', 'save')
  ),
  created_at timestamptz not null default now()
);
create index if not exists gpp_sales_material_dl_org_idx
  on public.growth_partner_portal_sales_material_downloads (partner_org_id, material_id, created_at desc);
alter table public.growth_partner_portal_sales_material_downloads enable row level security;
revoke all on public.growth_partner_portal_sales_material_downloads from authenticated, anon;

create table if not exists public.growth_partner_portal_sales_material_favorites (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  material_id uuid not null references public.growth_partner_portal_sales_materials (id) on delete cascade,
  auth_user_id uuid not null,
  created_at timestamptz not null default now(),
  unique (partner_org_id, material_id, auth_user_id)
);
alter table public.growth_partner_portal_sales_material_favorites enable row level security;
revoke all on public.growth_partner_portal_sales_material_favorites from authenticated, anon;

create table if not exists public.growth_partner_portal_sales_material_collections (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  collection_key text not null,
  title text not null,
  description text not null default '',
  collection_type text not null default 'saved' check (
    collection_type in ('saved', 'bundle', 'campaign_pack')
  ),
  pack_type text not null default '',
  auth_user_id uuid not null,
  created_at timestamptz not null default now(),
  unique (partner_org_id, collection_key, auth_user_id)
);
alter table public.growth_partner_portal_sales_material_collections enable row level security;
revoke all on public.growth_partner_portal_sales_material_collections from authenticated, anon;

create table if not exists public.growth_partner_portal_sales_material_collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.growth_partner_portal_sales_material_collections (id) on delete cascade,
  material_id uuid not null references public.growth_partner_portal_sales_materials (id) on delete cascade,
  sort_order integer not null default 100,
  unique (collection_id, material_id)
);
alter table public.growth_partner_portal_sales_material_collection_items enable row level security;
revoke all on public.growth_partner_portal_sales_material_collection_items from authenticated, anon;

create table if not exists public.growth_partner_portal_sales_material_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid references public.growth_partner_portal_organizations (id) on delete set null,
  material_id uuid references public.growth_partner_portal_sales_materials (id) on delete set null,
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_sales_material_audit_idx
  on public.growth_partner_portal_sales_material_audit_logs (created_at desc);
alter table public.growth_partner_portal_sales_material_audit_logs enable row level security;
revoke all on public.growth_partner_portal_sales_material_audit_logs from authenticated, anon;

create or replace function public._gpm336bp_positioning() returns text language sql immutable as $$
  select 'Professional, centrally maintained sales materials — always the latest approved version. Learn Aipify, download, contact, present, and close without starting from scratch.'; $$;

create or replace function public._gpm336_member_role(p_org_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(public._gppf05_member_role(p_org_id), ''); $$;

create or replace function public._gpm336_can_access(p_org_id uuid, p_write boolean default false)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_role text := public._gpm336_member_role(p_org_id);
  v_perms jsonb := public._gpp331_member_permissions(p_org_id);
begin
  if v_role in ('partner_owner', 'owner', 'partner_manager', 'manager') then return true; end if;
  if coalesce((v_perms->>'access_materials')::boolean, false) = false and v_role = 'viewer' then
    return not p_write;
  end if;
  if v_role in ('sales_member', 'sales_representative', 'trainer', 'advisor', 'viewer') then
    return not p_write;
  end if;
  return coalesce((v_perms->>'access_materials')::boolean, false);
end; $$;

create or replace function public._gpm336_can_favorite(p_org_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_role text := public._gpm336_member_role(p_org_id);
begin
  if v_role = 'viewer' then return false; end if;
  return public._gpm336_can_access(p_org_id, false);
end; $$;

create or replace function public._gpm336_log_audit(
  p_org_id uuid, p_material_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_sales_material_audit_logs (
    partner_org_id, material_id, event_type, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_material_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpm336_build_search(p_title text, p_desc text, p_cat text, p_lang text)
returns text language sql immutable as $$
  select lower(trim(coalesce(p_title, '') || ' ' || coalesce(p_desc, '') || ' ' || coalesce(p_cat, '') || ' ' || coalesce(p_lang, ''))); $$;

create or replace function public._gpm336_seed_catalog()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_sales_materials (
    material_key, title, description, category, language_code, format_type,
    industry, business_pack, version_label, usage_recommendations, release_notes,
    download_count, customizable, sales_access, search_document, sort_order
  ) values
    ('abos-executive-summary-en', 'Aipify Business Operating System — Executive Summary', 'One-page executive overview of ABOS for C-level conversations.', 'executive_summary', 'en', 'pdf', '', '', '2.1', 'Use in first executive meeting.', 'Updated positioning for ABOS.', 420, false, true, public._gpm336_build_search('ABOS Executive Summary', 'executive overview', 'executive_summary', 'en'), 10),
    ('sales-deck-en', 'Aipify Sales Presentation', 'Professional sales deck covering value, modules, and customer outcomes.', 'sales_presentation', 'en', 'pptx', '', '', '3.0', 'Primary presentation for discovery and demo calls.', 'New module slides added.', 890, true, true, public._gpm336_build_search('Sales Presentation', 'sales deck', 'sales_presentation', 'en'), 20),
    ('one-pager-en', 'Aipify One-Pager', 'Concise product one-pager for email attachments.', 'one_pager', 'en', 'pdf', '', '', '1.5', 'Attach to first outreach email.', 'Minor copy refresh.', 650, false, true, public._gpm336_build_search('One-Pager', 'product summary', 'one_pager', 'en'), 30),
    ('roi-calculator-en', 'Aipify ROI Calculator', 'Spreadsheet to estimate operational ROI for prospects.', 'roi_calculator', 'en', 'xlsx', '', '', '1.2', 'Use during qualification.', 'Added enterprise tier inputs.', 310, true, true, public._gpm336_build_search('ROI Calculator', 'spreadsheet', 'roi_calculator', 'en'), 40),
    ('discovery-guide-en', 'Discovery Call Guide', 'Structured discovery questions and qualification framework.', 'discovery_guide', 'en', 'docx', '', '', '1.0', 'Use on every first call.', 'Initial release.', 520, false, true, public._gpm336_build_search('Discovery Call Guide', 'qualification', 'discovery_guide', 'en'), 50),
    ('objection-pricing-en', 'Pricing Objection Handling', 'Responses to common pricing and value objections.', 'objection_guide', 'en', 'pdf', '', '', '1.1', 'Review before negotiation calls.', 'Added enterprise procurement notes.', 280, false, true, public._gpm336_build_search('Pricing Objections', 'objection handling', 'objection_guide', 'en'), 60),
    ('objection-security-en', 'Security & Trust Objections', 'Enterprise security, privacy, and trust responses.', 'objection_guide', 'en', 'pdf', '', '', '1.0', 'Use with security stakeholders.', 'Initial release.', 190, false, true, public._gpm336_build_search('Security Objections', 'trust architecture', 'objection_guide', 'en'), 70),
    ('email-first-contact-en', 'First Contact Email Template', 'Professional first outreach email template.', 'email_template', 'en', 'docx', '', '', '1.0', 'Personalize opening paragraph only.', 'Initial release.', 440, true, true, public._gpm336_build_search('First Contact Email', 'outreach', 'email_template', 'en'), 80),
    ('email-follow-up-en', 'Follow-Up Email Sequence', 'Three-part follow-up sequence after initial contact.', 'email_template', 'en', 'docx', '', '', '1.0', 'Send 2–3 days apart.', 'Initial release.', 360, true, true, public._gpm336_build_search('Follow-Up Email', 'sequence', 'email_template', 'en'), 90),
    ('social-linkedin-en', 'LinkedIn Partner Posts', 'Approved LinkedIn post templates for partners.', 'social_asset', 'en', 'canva', '', '', '1.0', 'Post once per week maximum.', 'Initial release.', 220, true, true, public._gpm336_build_search('LinkedIn Posts', 'social', 'social_asset', 'en'), 100),
    ('pack-startup-en', 'Startup Sales Campaign Pack', 'Bundled materials for startup prospects.', 'campaign_pack', 'en', 'pdf', 'startup', '', '1.0', 'Complete startup sales motion.', 'Initial pack.', 150, false, true, public._gpm336_build_search('Startup Pack', 'campaign', 'campaign_pack', 'en'), 110),
    ('pack-enterprise-en', 'Enterprise Sales Campaign Pack', 'Executive summaries, security briefs, and enterprise deck.', 'campaign_pack', 'en', 'pdf', 'enterprise', '', '1.0', 'Use for 500+ employee orgs.', 'Initial pack.', 175, false, true, public._gpm336_build_search('Enterprise Pack', 'campaign', 'campaign_pack', 'en'), 120),
    ('pack-hosts-en', 'Aipify Hosts Business Pack Guide', 'Sales guide for Aipify Hosts module.', 'business_pack_guide', 'en', 'pdf', 'hospitality', 'aipify_hosts', '1.0', 'For hospitality prospects.', 'Initial release.', 95, false, true, public._gpm336_build_search('Hosts Pack', 'business pack', 'business_pack_guide', 'en'), 130),
    ('case-study-en', 'Customer Success Case Study', 'Anonymised operational impact case study.', 'case_study', 'en', 'pdf', '', '', '1.0', 'Share after discovery.', 'Initial release.', 240, false, true, public._gpm336_build_search('Case Study', 'success story', 'case_study', 'en'), 140),
    ('brochure-no', 'Aipify Produktbrosjyre', 'Norwegian product brochure.', 'product_brochure', 'no', 'pdf', '', '', '1.0', 'For Norwegian prospects.', 'Initial release.', 80, false, true, public._gpm336_build_search('Produktbrosjyre', 'brochure', 'product_brochure', 'no'), 150)
  on conflict (material_key) do nothing;

  insert into public.growth_partner_portal_sales_material_versions (material_id, version_label, release_notes, is_current)
  select m.id, m.version_label, m.release_notes, true
  from public.growth_partner_portal_sales_materials m
  on conflict (material_id, version_label) do nothing;
end; $$;

create or replace function public._gpm336_readiness_score(p_org_id uuid)
returns integer language plpgsql stable security definer set search_path = public as $$
declare
  v_academy integer := 0;
  v_downloads integer := 0;
  v_favorites integer := 0;
begin
  select coalesce(round(avg(coalesce(pr.progress_pct, 0)))::int, 0) into v_academy
  from public.growth_partner_portal_academy_modules m
  left join public.growth_partner_portal_academy_progress pr
    on pr.module_id = m.id and pr.partner_org_id = p_org_id;

  select count(*)::int into v_downloads
  from public.growth_partner_portal_sales_material_downloads
  where partner_org_id = p_org_id;

  select count(*)::int into v_favorites
  from public.growth_partner_portal_sales_material_favorites
  where partner_org_id = p_org_id;

  return least(100, v_academy / 2 + least(v_downloads * 5, 30) + least(v_favorites * 3, 20));
end; $$;

create or replace function public._gpm336_material_json(p_org_id uuid, m public.growth_partner_portal_sales_materials)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_fav boolean := false;
begin
  select exists(
    select 1 from public.growth_partner_portal_sales_material_favorites f
    where f.partner_org_id = p_org_id and f.material_id = m.id and f.auth_user_id = auth.uid()
  ) into v_fav;

  return jsonb_build_object(
    'id', m.id,
    'material_key', m.material_key,
    'title', m.title,
    'description', m.description,
    'category', m.category,
    'language_code', m.language_code,
    'format_type', m.format_type,
    'industry', m.industry,
    'business_pack', m.business_pack,
    'version_label', m.version_label,
    'is_current', m.is_current,
    'published_at', m.published_at::text,
    'updated_at', m.updated_at::text,
    'download_count', m.download_count,
    'usage_recommendations', m.usage_recommendations,
    'release_notes', m.release_notes,
    'customizable', m.customizable,
    'preview_url', m.preview_url,
    'download_url', m.download_url,
    'is_favorite', v_fav
  );
end; $$;

create or replace function public.get_partner_materials(
  p_category text default null,
  p_language text default null,
  p_format text default null,
  p_industry text default null,
  p_business_pack text default null,
  p_version text default null,
  p_search text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role text;
  v_materials jsonb;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;
  if not public._gpm336_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false, 'access_denied', true);
  end if;

  perform public._gpp331_provision(v_org_id);
  perform public._gpm336_seed_catalog();
  v_role := public._gpm336_member_role(v_org_id);

  select coalesce(jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.sort_order), '[]'::jsonb)
  into v_materials
  from public.growth_partner_portal_sales_materials m
  where m.is_current = true
    and (p_category is null or m.category = p_category)
    and (p_language is null or m.language_code = p_language)
    and (p_format is null or m.format_type = p_format)
    and (p_industry is null or m.industry = p_industry)
    and (p_business_pack is null or m.business_pack = p_business_pack)
    and (p_version is null or m.version_label = p_version)
    and (p_search is null or m.search_document like '%' || lower(trim(p_search)) || '%')
    and (
      v_role in ('partner_owner', 'owner', 'partner_manager', 'manager')
      or (m.sales_access = true and v_role in ('sales_member', 'sales_representative', 'trainer', 'advisor', 'viewer'))
    );

  return jsonb_build_object(
    'has_access', true,
    'can_write', public._gpm336_can_access(v_org_id, true),
    'can_favorite', public._gpm336_can_favorite(v_org_id),
    'team_role', v_role,
    'positioning', public._gpm336bp_positioning(),
    'dashboard', jsonb_build_object(
      'available_materials', (select count(*) from public.growth_partner_portal_sales_materials where is_current),
      'recently_updated', coalesce((
        select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.updated_at desc)
        from (select * from public.growth_partner_portal_sales_materials where is_current order by updated_at desc limit 5) m
      ), '[]'::jsonb),
      'most_downloaded', coalesce((
        select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.download_count desc)
        from (select * from public.growth_partner_portal_sales_materials where is_current order by download_count desc limit 5) m
      ), '[]'::jsonb),
      'language_coverage', coalesce((
        select jsonb_agg(distinct language_code) from public.growth_partner_portal_sales_materials where is_current
      ), '[]'::jsonb),
      'readiness_score', public._gpm336_readiness_score(v_org_id)
    ),
    'materials', coalesce(v_materials, '[]'::jsonb),
    'centers', jsonb_build_object(
      'discovery', coalesce((
        select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.sort_order)
        from public.growth_partner_portal_sales_materials m
        where m.is_current and m.category = 'discovery_guide'
      ), '[]'::jsonb),
      'objections', coalesce((
        select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.sort_order)
        from public.growth_partner_portal_sales_materials m
        where m.is_current and m.category = 'objection_guide'
      ), '[]'::jsonb),
      'email_templates', coalesce((
        select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.sort_order)
        from public.growth_partner_portal_sales_materials m
        where m.is_current and m.category = 'email_template'
      ), '[]'::jsonb),
      'social', coalesce((
        select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.sort_order)
        from public.growth_partner_portal_sales_materials m
        where m.is_current and m.category = 'social_asset'
      ), '[]'::jsonb),
      'campaign_packs', coalesce((
        select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.sort_order)
        from public.growth_partner_portal_sales_materials m
        where m.is_current and m.category = 'campaign_pack'
      ), '[]'::jsonb)
    ),
    'empty_state', jsonb_build_object(
      'title', 'No materials available.',
      'message', 'Aipify provides professional sales and marketing materials to help Growth Partners succeed.',
      'cta', 'Browse Materials'
    )
  );
end; $$;

create or replace function public.get_partner_materials_categories()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null or not public._gpm336_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false);
  end if;
  perform public._gpm336_seed_catalog();

  return jsonb_build_object(
    'has_access', true,
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object(
        'category', c.category,
        'count', c.cnt
      ) order by c.category)
      from (
        select category, count(*)::int as cnt
        from public.growth_partner_portal_sales_materials
        where is_current
        group by category
      ) c
    ), '[]'::jsonb),
    'formats', coalesce((
      select jsonb_agg(distinct format_type) from public.growth_partner_portal_sales_materials where is_current
    ), '[]'::jsonb),
    'languages', coalesce((
      select jsonb_agg(distinct language_code) from public.growth_partner_portal_sales_materials where is_current
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_partner_materials_favorites()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpm336_can_access(v_org_id, false) then return jsonb_build_object('has_access', false); end if;

  return jsonb_build_object(
    'has_access', true,
    'favorites', coalesce((
      select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by f.created_at desc)
      from public.growth_partner_portal_sales_material_favorites f
      join public.growth_partner_portal_sales_materials m on m.id = f.material_id
      where f.partner_org_id = v_org_id and f.auth_user_id = auth.uid()
    ), '[]'::jsonb),
    'collections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'collection_type', c.collection_type,
        'pack_type', c.pack_type,
        'item_count', (select count(*) from public.growth_partner_portal_sales_material_collection_items ci where ci.collection_id = c.id)
      ) order by c.created_at desc)
      from public.growth_partner_portal_sales_material_collections c
      where c.partner_org_id = v_org_id and c.auth_user_id = auth.uid()
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_partner_materials_recommended()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null or not public._gpm336_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false);
  end if;
  perform public._gpm336_seed_catalog();

  return jsonb_build_object(
    'has_access', true,
    'recommended', coalesce((
      select jsonb_agg(public._gpm336_material_json(v_org_id, m) order by m.sort_order)
      from public.growth_partner_portal_sales_materials m
      where m.is_current
        and m.category in ('sales_presentation', 'one_pager', 'discovery_guide', 'executive_summary')
      limit 6
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.toggle_partner_material_favorite(p_material_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpm336_can_favorite(v_org_id) then
    raise exception 'Favorite access not available for your role';
  end if;

  if exists(
    select 1 from public.growth_partner_portal_sales_material_favorites
    where partner_org_id = v_org_id and material_id = p_material_id and auth_user_id = auth.uid()
  ) then
    delete from public.growth_partner_portal_sales_material_favorites
    where partner_org_id = v_org_id and material_id = p_material_id and auth_user_id = auth.uid();
    perform public._gpm336_log_audit(v_org_id, p_material_id, 'favorite_removed', 'Material removed from favorites.', '{}'::jsonb);
  else
    insert into public.growth_partner_portal_sales_material_favorites (partner_org_id, material_id, auth_user_id)
    values (v_org_id, p_material_id, auth.uid());
    perform public._gpm336_log_audit(v_org_id, p_material_id, 'favorite_added', 'Material added to favorites.', '{}'::jsonb);
  end if;

  return public.get_partner_materials_favorites();
end; $$;

create or replace function public.record_partner_material_download(
  p_material_id uuid,
  p_action_type text default 'download'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  if not public._gpm336_can_access(v_org_id, false) then
    raise exception 'Materials access required';
  end if;

  insert into public.growth_partner_portal_sales_material_downloads (
    partner_org_id, material_id, actor_auth_user_id, action_type
  ) values (v_org_id, p_material_id, auth.uid(), coalesce(p_action_type, 'download'));

  if p_action_type = 'download' then
    update public.growth_partner_portal_sales_materials set
      download_count = download_count + 1, updated_at = now()
    where id = p_material_id;
  end if;

  perform public._gpm336_log_audit(
    v_org_id, p_material_id, 'material_' || coalesce(p_action_type, 'download'),
    'Partner material action recorded.', jsonb_build_object('action', p_action_type)
  );

  return jsonb_build_object('ok', true, 'material_id', p_material_id);
end; $$;

create or replace function public.get_partner_material_versions(p_material_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null or not public._gpm336_can_access(v_org_id, false) then
    return jsonb_build_object('has_access', false);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'versions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'version_label', v.version_label,
        'release_notes', v.release_notes,
        'published_at', v.published_at::text,
        'is_current', v.is_current
      ) order by v.published_at desc)
      from public.growth_partner_portal_sales_material_versions v
      where v.material_id = p_material_id
    ), '[]'::jsonb)
  );
end; $$;

grant execute on function public.get_partner_materials(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.get_partner_materials_categories() to authenticated;
grant execute on function public.get_partner_materials_favorites() to authenticated;
grant execute on function public.get_partner_materials_recommended() to authenticated;
grant execute on function public.toggle_partner_material_favorite(uuid) to authenticated;
grant execute on function public.record_partner_material_download(uuid, text) to authenticated;
grant execute on function public.get_partner_material_versions(uuid) to authenticated;
