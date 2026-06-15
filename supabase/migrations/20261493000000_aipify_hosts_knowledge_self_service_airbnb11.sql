-- Phase Airbnb 11 — Aipify Hosts Knowledge Center & Self-Service Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostss_* (engine), _ahostbp373_* (blueprint)

create table if not exists public.aipify_hosts_knowledge_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  global_search_enabled boolean not null default true,
  metadata jsonb not null default '{"self_service":true,"audit_versions":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_knowledge_settings enable row level security;
revoke all on public.aipify_hosts_knowledge_settings from authenticated, anon;

create table if not exists public.aipify_hosts_knowledge_views (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null,
  article_slug text not null,
  article_title text not null,
  section_key text,
  viewed_at timestamptz not null default now()
);
create index if not exists aipify_hosts_knowledge_views_tenant_user_idx
  on public.aipify_hosts_knowledge_views (tenant_id, user_id, viewed_at desc);
alter table public.aipify_hosts_knowledge_views enable row level security;
revoke all on public.aipify_hosts_knowledge_views from authenticated, anon;

create table if not exists public.aipify_hosts_knowledge_helpful (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null,
  article_slug text not null,
  helpful boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id, article_slug)
);
create index if not exists aipify_hosts_knowledge_helpful_slug_idx
  on public.aipify_hosts_knowledge_helpful (article_slug, helpful);
alter table public.aipify_hosts_knowledge_helpful enable row level security;
revoke all on public.aipify_hosts_knowledge_helpful from authenticated, anon;

create table if not exists public.aipify_hosts_knowledge_versions (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  version_number int not null check (version_number > 0),
  title text not null,
  change_summary text,
  changed_by uuid,
  tenant_id uuid references public.customers (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (article_slug, version_number)
);
alter table public.aipify_hosts_knowledge_versions enable row level security;
revoke all on public.aipify_hosts_knowledge_versions from authenticated, anon;

create table if not exists public.aipify_hosts_knowledge_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_knowledge_events_tenant_idx
  on public.aipify_hosts_knowledge_events (tenant_id, created_at desc);
alter table public.aipify_hosts_knowledge_events enable row level security;
revoke all on public.aipify_hosts_knowledge_events from authenticated, anon;

create or replace function public._ahostss_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_knowledge_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_knowledge_settings;
begin
  insert into public.aipify_hosts_knowledge_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_knowledge_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostss_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_knowledge_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'knowledge_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostss_record_version(
  p_slug text, p_title text, p_summary text default 'Initial published version'
) returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.aipify_hosts_knowledge_versions
    where article_slug = p_slug and version_number = 1
  ) then return; end if;
  insert into public.aipify_hosts_knowledge_versions (
    article_slug, version_number, title, change_summary, changed_by, tenant_id
  ) values (p_slug, 1, p_title, p_summary, auth.uid(), null);
end; $$;

create or replace function public._ahostbp373_positioning() returns text language sql immutable as $$
  select 'Operational guidance when you need it — self-service answers for hospitality hosts, without contacting support.'; $$;

create or replace function public._ahostbp373_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_search', 'label', 'Global Search', 'description', 'Search across Hosts operational guidance.'),
    jsonb_build_object('key', 'category_navigation', 'label', 'Category Navigation', 'description', 'Browse by operational area — guest, property, cleaning, trust, and licensing.'),
    jsonb_build_object('key', 'related_articles', 'label', 'Related Articles', 'description', 'Contextual links to deepen understanding.'),
    jsonb_build_object('key', 'helpful_feedback', 'label', 'Helpful Feedback', 'description', 'Mark articles helpful to improve recommendations.'),
    jsonb_build_object('key', 'version_audit', 'label', 'Version Audit', 'description', 'Article updates are versioned and audit logged.')
  ); $$;

create or replace function public._ahostbp373_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'getting_started', 'label', 'Getting Started', 'article_slugs', jsonb_build_array('add-your-first-property', 'invite-team-members', 'configure-notifications', 'create-operational-routines', 'understand-licensing', 'what-is-aipify-hosts')),
    jsonb_build_object('key', 'guest_management', 'label', 'Guest Management', 'article_slugs', jsonb_build_array('preparing-for-arrivals', 'managing-departures', 'handling-guest-requests', 'preventing-negative-reviews', 'creating-memorable-experiences', 'can-guests-contact-me-directly')),
    jsonb_build_object('key', 'property_management', 'label', 'Property Management', 'article_slugs', jsonb_build_array('can-i-manage-multiple-properties-centrally', 'can-i-track-maintenance-tasks', 'can-recurring-tasks-be-scheduled', 'can-i-document-inspections', 'preventive-maintenance')),
    jsonb_build_object('key', 'cleaning_operations', 'label', 'Cleaning Operations', 'article_slugs', jsonb_build_array('turnover-checklists', 'reporting-issues', 'property-readiness-standards', 'cleaning-best-practices', 'can-cleaning-tasks-be-tracked')),
    jsonb_build_object('key', 'maintenance', 'label', 'Maintenance', 'article_slugs', jsonb_build_array('preventive-maintenance', 'emergency-procedures', 'inspection-routines', 'seasonal-preparation')),
    jsonb_build_object('key', 'team_management', 'label', 'Team Management', 'article_slugs', jsonb_build_array('invite-team-members', 'can-i-add-managers', 'can-cleaners-access-only-relevant-areas', 'can-external-vendors-participate')),
    jsonb_build_object('key', 'trust_compliance', 'label', 'Trust & Compliance', 'article_slugs', jsonb_build_array('house-rules-guidance', 'incident-reporting-standards', 'safety-recommendations', 'governance-expectations', 'is-aipify-hosts-access-controlled')),
    jsonb_build_object('key', 'revenue_optimization', 'label', 'Revenue Optimization', 'article_slugs', jsonb_build_array('can-i-view-operational-reports', 'can-i-compare-properties', 'can-i-identify-operational-trends')),
    jsonb_build_object('key', 'incident_handling', 'label', 'Incident Handling', 'article_slugs', jsonb_build_array('what-happens-if-something-is-damaged', 'can-photos-be-attached-to-incidents', 'can-incidents-be-assigned-to-team-members', 'incident-reporting-standards')),
    jsonb_build_object('key', 'billing_licensing', 'label', 'Billing & Licensing', 'article_slugs', jsonb_build_array('understanding-property-limits', 'upgrading-plans', 'additional-property-licenses', 'enterprise-licensing', 'understand-licensing'))
  ); $$;

create or replace function public._ahostss_article_from_kc(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_row record;
begin
  select a.slug, a.title, a.body, a.tags, c.slug as category_slug, c.name as category_name
  into v_row
  from public.aipify_knowledge_articles a
  left join public.aipify_knowledge_categories c on c.id = a.category_id
  where a.slug = p_slug and a.language = 'en' and a.status = 'published'
    and (a.tenant_id is null or a.is_global = true)
  order by a.tenant_id nulls first
  limit 1;
  if v_row.slug is null then return null; end if;
  return jsonb_build_object(
    'slug', v_row.slug,
    'title', v_row.title,
    'body', v_row.body,
    'category_slug', v_row.category_slug,
    'category_name', v_row.category_name,
    'tags', to_jsonb(coalesce(v_row.tags, array[]::text[]))
  );
end; $$;

create or replace function public._ahostss_article_summary(p_slug text, p_fallback_title text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  v := public._ahostss_article_from_kc(p_slug);
  if v is not null then
    return jsonb_build_object(
      'slug', v ->> 'slug',
      'title', v ->> 'title',
      'excerpt', left(coalesce(v ->> 'body', ''), 180),
      'category_name', v ->> 'category_name'
    );
  end if;
  if p_fallback_title is not null then
    return jsonb_build_object('slug', p_slug, 'title', p_fallback_title, 'excerpt', '', 'category_name', null);
  end if;
  return null;
end; $$;

create or replace function public._ahostss_popular_articles(p_limit int default 6)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(s order by s ->> 'title')
    from (
      select public._ahostss_article_summary(a.slug) as s
      from public.aipify_knowledge_articles a
      where a.language = 'en' and a.status = 'published' and a.tenant_id is null
        and ('aipify-hosts' = any(a.tags) or a.slug like '%aipify-hosts%' or a.source_path like '%aipify-hosts%')
      order by a.published_at desc nulls last
      limit p_limit
    ) q where s is not null
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostss_recent_for_user(p_tenant_id uuid, p_user_id uuid, p_limit int default 5)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(row order by row ->> 'viewed_at' desc)
    from (
      select jsonb_build_object(
        'slug', v.article_slug,
        'title', v.article_title,
        'section_key', v.section_key,
        'viewed_at', v.viewed_at
      ) as row
      from (
        select distinct on (article_slug) article_slug, article_title, section_key, viewed_at
        from public.aipify_hosts_knowledge_views
        where tenant_id = p_tenant_id and user_id = p_user_id
        order by article_slug, viewed_at desc
      ) v
      order by v.viewed_at desc
      limit p_limit
    ) q
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostss_suggested(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_props int;
begin
  select count(*) into v_props from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active';
  if v_props = 0 then
    return jsonb_build_array(
      public._ahostss_article_summary('add-your-first-property', 'Add your first property'),
      public._ahostss_article_summary('understand-licensing', 'Understand licensing'),
      public._ahostss_article_summary('configure-notifications', 'Configure notifications')
    );
  end if;
  return jsonb_build_array(
    public._ahostss_article_summary('preparing-for-arrivals', 'Preparing for arrivals'),
    public._ahostss_article_summary('turnover-checklists', 'Turnover checklists'),
    public._ahostss_article_summary('incident-reporting-standards', 'Incident reporting standards')
  );
end; $$;

create or replace function public.seed_aipify_hosts_knowledge_self_service_airbnb11()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-onboarding', 'Host Onboarding',
    'First steps for new Aipify Hosts workspaces.', 234
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-guest-experience', 'Guest Experience',
    'Arrivals, departures, requests, and memorable stays.', 235
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-maintenance-guides', 'Maintenance Guides',
    'Preventive maintenance, emergencies, and seasonal preparation.', 236
  );
  perform public._ahostkc_ensure_category(
    'aipify-hosts-trust-guides', 'Trust & Governance',
    'House rules, safety, and governance expectations.', 237
  );

  perform public._ahostkc_seed_article('aipify-hosts-onboarding', 'add-your-first-property', 'Add your first property',
    'Register a property in your Aipify Hosts workspace. Open Aipify Hosts, select Add property, enter the property name, and confirm capacity against your licensing plan.');
  perform public._ahostkc_seed_article('aipify-hosts-onboarding', 'invite-team-members', 'Invite team members',
    'Assign managers, cleaners, and maintenance roles with scoped permissions. Owners and admins invite users from Team settings and align access with operational responsibilities.');
  perform public._ahostkc_seed_article('aipify-hosts-onboarding', 'configure-notifications', 'Configure notifications',
    'Set notification preferences for arrivals, cleaning completion, incidents, and approvals. Calm, professional alerts reduce surprises without overwhelming your team.');
  perform public._ahostkc_seed_article('aipify-hosts-onboarding', 'create-operational-routines', 'Create operational routines',
    'Define recurring checklists for turnovers, inspections, and seasonal tasks. Consistent routines improve guest experience and reduce support burden.');
  perform public._ahostkc_seed_article('aipify-hosts-onboarding', 'understand-licensing', 'Understand licensing',
    'Aipify Hosts licensing determines property capacity. All operational modules are included — plans differ by how many properties you may manage.');

  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'preparing-for-arrivals', 'Preparing for arrivals',
    'Review today''s arrivals, confirm cleaning completion, verify access instructions, and prepare welcome materials before guests arrive.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'managing-departures', 'Managing departures',
    'Monitor check-out times, trigger turnover workflows, and document property condition after departure.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'handling-guest-requests', 'Handling guest requests',
    'Respond promptly using approved templates. Escalate maintenance or policy exceptions through governance workflows when required.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'preventing-negative-reviews', 'Preventing negative reviews',
    'Set accurate expectations, maintain readiness standards, and resolve issues before they escalate. Proactive communication builds trust.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'creating-memorable-experiences', 'Creating memorable experiences',
    'Small, thoughtful touches — clear directions, local recommendations, and reliable support — differentiate hospitality operations.');

  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'turnover-checklists', 'Turnover checklists',
    'Use standardized turnover checklists so every property meets readiness standards between guests.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'reporting-issues', 'Reporting issues',
    'Document damage, missing items, or maintenance needs discovered during cleaning. Assign follow-up to the appropriate team member.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'property-readiness-standards', 'Property readiness standards',
    'Define minimum standards for linens, supplies, safety checks, and presentation before marking a property guest-ready.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning-operations', 'cleaning-best-practices', 'Cleaning best practices',
    'Coordinate schedules with arrivals, confirm completion with evidence when required, and escalate blockers early.');

  perform public._ahostkc_seed_article('aipify-hosts-maintenance-guides', 'preventive-maintenance', 'Preventive maintenance',
    'Schedule recurring maintenance for HVAC, plumbing, and exterior assets to prevent guest-impacting failures.');
  perform public._ahostkc_seed_article('aipify-hosts-maintenance-guides', 'emergency-procedures', 'Emergency procedures',
    'Document emergency contacts, shut-off locations, and escalation paths for urgent property issues.');
  perform public._ahostkc_seed_article('aipify-hosts-maintenance-guides', 'inspection-routines', 'Inspection routines',
    'Conduct periodic inspections with notes and photos. Track findings until resolved.');
  perform public._ahostkc_seed_article('aipify-hosts-maintenance-guides', 'seasonal-preparation', 'Seasonal preparation',
    'Prepare properties for seasonal demand — heating, weatherproofing, and amenity updates.');

  perform public._ahostkc_seed_article('aipify-hosts-trust-guides', 'house-rules-guidance', 'House rules guidance',
    'Publish clear, fair house rules. Align messaging with local regulations and guest expectations.');
  perform public._ahostkc_seed_article('aipify-hosts-trust-guides', 'incident-reporting-standards', 'Incident reporting standards',
    'Document incidents with facts, photos, and timestamps. Assign ownership and retain audit history.');
  perform public._ahostkc_seed_article('aipify-hosts-trust-guides', 'safety-recommendations', 'Safety recommendations',
    'Maintain smoke detectors, emergency exits, and safety equipment. Review recommendations regularly.');
  perform public._ahostkc_seed_article('aipify-hosts-trust-guides', 'governance-expectations', 'Governance expectations',
    'Sensitive actions require human approval. Aipify Hosts supports governance — hosts retain legal and operational responsibility.');

  perform public._ahostkc_seed_article('aipify-hosts-billing', 'understanding-property-limits', 'Understanding property limits',
    'Your plan defines how many active properties you may manage. Capacity is visible on the Aipify Hosts dashboard.');
  perform public._ahostkc_seed_article('aipify-hosts-billing', 'upgrading-plans', 'Upgrading plans',
    'When you reach capacity, upgrade your Aipify Hosts plan or purchase additional property licenses.');
  perform public._ahostkc_seed_article('aipify-hosts-billing', 'additional-property-licenses', 'Additional property licenses',
    'Purchase +1 property licenses to add capacity without changing your full plan tier.');
  perform public._ahostkc_seed_article('aipify-hosts-billing', 'enterprise-licensing', 'Enterprise licensing',
    'Enterprise hosts receive custom capacity, dedicated onboarding, and Growth Partner support. Contact sales for enterprise licensing.');

  perform public._ahostss_record_version('add-your-first-property', 'Add your first property', 'Phase Airbnb 11 self-service seed');
  perform public._ahostss_record_version('understand-licensing', 'Understand licensing', 'Phase Airbnb 11 self-service seed');
end; $$;

select public.seed_aipify_hosts_knowledge_self_service_airbnb11();

create or replace function public.get_aipify_hosts_knowledge_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_kc public.aipify_hosts_knowledge_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_kc := public._ahostss_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_kc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp373_positioning(),
    'route', '/app/aipify-hosts/knowledge',
    'section_count', jsonb_array_length(public._ahostbp373_sections())
  );
end; $$;

create or replace function public.get_aipify_hosts_knowledge_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_user uuid; v_kc public.aipify_hosts_knowledge_settings;
  v_hosts public.aipify_hosts_settings; v_sections jsonb; v_sec jsonb; v_articles jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  v_kc := public._ahostss_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_sections := public._ahostbp373_sections();
  select jsonb_agg(
    jsonb_build_object(
      'key', s ->> 'key',
      'label', s ->> 'label',
      'articles', (
        select coalesce(jsonb_agg(public._ahostss_article_summary(slug::text) order by ord), '[]'::jsonb)
        from jsonb_array_elements_text(s -> 'article_slugs') with ordinality as t(slug, ord)
      )
    ) order by s ->> 'label'
  ) into v_articles
  from jsonb_array_elements(v_sections) s;
  perform public._ahostss_log_event(v_tenant_id, 'dashboard_view', 'Knowledge Center viewed', '{}'::jsonb);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_kc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp373_positioning(),
    'modules', public._ahostbp373_modules(),
    'sections', v_articles,
    'popular_articles', public._ahostss_popular_articles(6),
    'suggested_articles', public._ahostss_suggested(v_tenant_id),
    'recent_articles', public._ahostss_recent_for_user(v_tenant_id, v_user, 5),
    'features', jsonb_build_array('helpful_feedback', 'related_articles', 'recommended_reading', 'category_navigation', 'version_audit'),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 11 — Knowledge Center & Self-Service Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_11_KNOWLEDGE_SELF_SERVICE.text',
      'route', '/app/aipify-hosts/knowledge'
    )
  );
end; $$;

create or replace function public.search_aipify_hosts_knowledge(p_query text, p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_q text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_q := trim(coalesce(p_query, ''));
  if length(v_q) < 2 then
    return jsonb_build_object('results', '[]'::jsonb, 'query', v_q);
  end if;
  perform public._ahostss_log_event(v_tenant_id, 'search', 'Knowledge search', jsonb_build_object('query', v_q));
  return jsonb_build_object(
    'query', v_q,
    'results', coalesce((
      select jsonb_agg(public._ahostss_article_summary(a.slug) order by a.title)
      from public.aipify_knowledge_articles a
      where a.language = 'en' and a.status = 'published' and a.tenant_id is null
        and ('aipify-hosts' = any(a.tags) or a.source_path like '%aipify-hosts%')
        and (a.title ilike '%' || v_q || '%' or a.body ilike '%' || v_q || '%')
      limit 20
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_aipify_hosts_knowledge_article(p_slug text, p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_user uuid; v_article jsonb; v_related jsonb; v_helpful boolean; v_versions jsonb;
  v_cat text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  v_article := public._ahostss_article_from_kc(p_slug);
  if v_article is null then
    return jsonb_build_object('found', false, 'slug', p_slug);
  end if;
  v_cat := v_article ->> 'category_slug';
  select coalesce(jsonb_agg(public._ahostss_article_summary(a.slug) order by a.title), '[]'::jsonb)
  into v_related
  from public.aipify_knowledge_articles a
  join public.aipify_knowledge_categories c on c.id = a.category_id
  where a.slug <> p_slug and a.language = 'en' and a.status = 'published' and a.tenant_id is null
    and c.slug = v_cat
  limit 4;
  select helpful into v_helpful from public.aipify_hosts_knowledge_helpful
  where tenant_id = v_tenant_id and user_id = v_user and article_slug = p_slug;
  select coalesce(jsonb_agg(jsonb_build_object(
    'version_number', version_number, 'title', title, 'change_summary', change_summary, 'created_at', created_at
  ) order by version_number desc), '[]'::jsonb)
  into v_versions
  from public.aipify_hosts_knowledge_versions where article_slug = p_slug;
  return jsonb_build_object(
    'found', true,
    'article', v_article,
    'related_articles', v_related,
    'recommended_reading', v_related,
    'versions', v_versions,
    'user_marked_helpful', coalesce(v_helpful, false)
  );
end; $$;

create or replace function public.record_aipify_hosts_knowledge_view(
  p_slug text, p_title text, p_section_key text default null, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  if v_user is null then raise exception 'Authentication required'; end if;
  insert into public.aipify_hosts_knowledge_views (tenant_id, user_id, article_slug, article_title, section_key)
  values (v_tenant_id, v_user, p_slug, p_title, p_section_key);
  perform public._ahostss_log_event(v_tenant_id, 'article_view', p_title, jsonb_build_object('slug', p_slug));
  return jsonb_build_object('recorded', true);
end; $$;

create or replace function public.mark_aipify_hosts_knowledge_helpful(
  p_slug text, p_helpful boolean default true, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  if v_user is null then raise exception 'Authentication required'; end if;
  insert into public.aipify_hosts_knowledge_helpful (tenant_id, user_id, article_slug, helpful)
  values (v_tenant_id, v_user, p_slug, p_helpful)
  on conflict (tenant_id, user_id, article_slug) do update set helpful = excluded.helpful, created_at = now();
  perform public._ahostss_log_event(v_tenant_id, 'helpful_vote', 'Article feedback', jsonb_build_object('slug', p_slug, 'helpful', p_helpful));
  return jsonb_build_object('recorded', true, 'helpful', p_helpful);
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-self-service', 'Aipify Hosts Self-Service', 'Hosts Knowledge Center operational guidance.', 'authenticated', 220
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-self-service' and tenant_id is null);

grant execute on function public.get_aipify_hosts_knowledge_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_knowledge_dashboard(uuid) to authenticated;
grant execute on function public.search_aipify_hosts_knowledge(text, uuid) to authenticated;
grant execute on function public.get_aipify_hosts_knowledge_article(text, uuid) to authenticated;
grant execute on function public.record_aipify_hosts_knowledge_view(text, text, text, uuid) to authenticated;
grant execute on function public.mark_aipify_hosts_knowledge_helpful(text, boolean, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_knowledge_self_service_airbnb11() to authenticated;
