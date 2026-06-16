-- Foundation 08 — Business Pack Marketplace Engine
-- Feature owner: PLATFORM FOUNDATION. Helpers: _bpmke_* (engine), _bpmkef08_* (blueprint)
-- Core principle: Discover. Understand. Install. Scale.

create table if not exists public.business_pack_marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  marketplace_visibility text not null default 'published' check (
    marketplace_visibility in ('draft', 'published', 'hidden', 'partner_only')
  ),
  marketplace_category text not null,
  starting_price_monthly numeric(10, 2),
  pricing_label text not null,
  trial_available boolean not null default true,
  install_available boolean not null default true,
  upgrade_available boolean not null default true,
  license_available boolean not null default true,
  supported_languages jsonb not null default '["en","no","sv","da"]'::jsonb,
  popular_rank integer not null default 100,
  recently_added_at timestamptz not null default now(),
  view_count bigint not null default 0,
  trial_activation_count bigint not null default 0,
  install_count bigint not null default 0,
  upgrade_conversion_count bigint not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.business_pack_marketplace_listings enable row level security;
revoke all on public.business_pack_marketplace_listings from authenticated, anon;

create table if not exists public.business_pack_marketplace_install_progress (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  workflow_step text not null default 'pack_details' check (
    workflow_step in (
      'marketplace', 'pack_details', 'choose_license', 'accept_terms',
      'choose_languages', 'review_permissions', 'activate', 'guided_setup', 'ready'
    )
  ),
  steps_completed jsonb not null default '[]'::jsonb,
  trial_ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, pack_key)
);

create index if not exists business_pack_marketplace_install_progress_tenant_idx
  on public.business_pack_marketplace_install_progress (tenant_id, workflow_step);

alter table public.business_pack_marketplace_install_progress enable row level security;
revoke all on public.business_pack_marketplace_install_progress from authenticated, anon;

create table if not exists public.business_pack_marketplace_analytics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  pack_key text not null,
  event_type text not null check (
    event_type in (
      'pack_view', 'trial_activation', 'installation', 'upgrade_conversion',
      'language_selection', 'install_step', 'release_notes_view'
    )
  ),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_marketplace_analytics_pack_idx
  on public.business_pack_marketplace_analytics (pack_key, event_type, created_at desc);

alter table public.business_pack_marketplace_analytics enable row level security;
revoke all on public.business_pack_marketplace_analytics from authenticated, anon;

create table if not exists public.business_pack_marketplace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  pack_key text,
  action text not null check (
    action in (
      'listing_published', 'listing_updated', 'home_view', 'listing_view',
      'install_started', 'install_step_advanced', 'trial_started', 'pack_activated',
      'upgrade_started', 'update_applied'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.business_pack_marketplace_audit_logs enable row level security;
revoke all on public.business_pack_marketplace_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_pack_marketplace', v.description
from (values
  ('business_pack_marketplace.view', 'View Business Pack Marketplace', 'Discover and browse marketplace listings'),
  ('business_pack_marketplace.install', 'Install Business Packs', 'Install and activate business packs'),
  ('business_pack_marketplace.manage', 'Manage Business Pack Marketplace', 'Manage marketplace listings and visibility'),
  ('business_pack_marketplace.publish', 'Publish Marketplace Listings', 'Publish approved marketplace listings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_pack_marketplace.view'), ('owner', 'business_pack_marketplace.install'),
  ('administrator', 'business_pack_marketplace.view'), ('administrator', 'business_pack_marketplace.install'),
  ('manager', 'business_pack_marketplace.view'),
  ('viewer', 'business_pack_marketplace.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bpmke_require_view()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.is_platform_admin() then return; end if;
  perform public._irp_require_permission('business_pack_marketplace.view');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bpmke_require_install()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_require_permission('business_pack_marketplace.install');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bpmke_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._bpmke_log(
  p_tenant_id uuid, p_pack_key text, p_action text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.business_pack_marketplace_audit_logs (tenant_id, pack_key, action, summary, actor_user_id, context)
  values (p_tenant_id, p_pack_key, p_action, p_summary, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._bpmkef08_principle()
returns text language sql immutable as $$
  select 'Discover. Understand. Install. Scale.';
$$;

create or replace function public._bpmkef08_commercial_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Paid = Access Now',
    'No manual activation',
    'No support involvement for standard installs',
    'Immediate entitlement updates on approved payment'
  );
$$;

create or replace function public._bpmkef08_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'hospitality', 'commerce', 'support', 'executive', 'operations',
    'human_resources', 'marketing', 'intelligence', 'productivity', 'governance'
  );
$$;

create or replace function public._bpmkef08_install_flow()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'marketplace', 'pack_details', 'choose_license', 'accept_terms',
    'choose_languages', 'review_permissions', 'activate', 'guided_setup', 'ready_to_use'
  );
$$;

create or replace function public._bpmkef08_home_sections()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'recommended_for_you', 'label', 'Recommended For You'),
    jsonb_build_object('key', 'installed', 'label', 'Installed Business Packs'),
    jsonb_build_object('key', 'popular', 'label', 'Popular Business Packs'),
    jsonb_build_object('key', 'recently_added', 'label', 'Recently Added'),
    jsonb_build_object('key', 'continue_setup', 'label', 'Continue Setup'),
    jsonb_build_object('key', 'upgrade_opportunities', 'label', 'Upgrade Opportunities')
  );
$$;

create or replace function public._bpmke_seed_listings()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from pg_proc where proname = '_bpie_seed_identity') then
    perform public._bpie_seed_identity();
  end if;
  if exists (select 1 from pg_proc where proname = '_bple_seed_definitions') then
    perform public._bple_seed_definitions();
  end if;

  insert into public.business_pack_marketplace_listings (
    pack_key, marketplace_visibility, marketplace_category, starting_price_monthly,
    pricing_label, trial_available, install_available, popular_rank, recently_added_at, published_at
  )
  select
    i.pack_key,
    case when i.status in ('active', 'beta') then 'published' else 'draft' end,
    i.pack_category,
    coalesce(
      (select (t->>'monthly_price')::numeric from jsonb_array_elements(l.tiers) t order by (t->>'monthly_price')::numeric nulls last limit 1),
      99
    ),
    coalesce(
      'From €' || (select (t->>'monthly_price') from jsonb_array_elements(l.tiers) t where t->>'monthly_price' is not null order by (t->>'monthly_price')::numeric limit 1) || ' / month',
      'Contact sales'
    ),
    i.status in ('active', 'beta'),
    i.install_allowed and i.status in ('active', 'beta'),
    case i.pack_key
      when 'aipify_hosts' then 10 when 'aipify_commerce' then 20 when 'aipify_support' then 30
      when 'aipify_executive' then 40 when 'aipify_growth' then 50 else 60
    end,
    coalesce(i.published_at, i.created_at, now()),
    coalesce(i.published_at, now())
  from public.business_pack_identity i
  left join public.business_pack_license_definitions l on l.pack_key = i.pack_key
  on conflict (pack_key) do update set
    marketplace_category = excluded.marketplace_category,
    starting_price_monthly = excluded.starting_price_monthly,
    pricing_label = excluded.pricing_label,
    trial_available = excluded.trial_available,
    install_available = excluded.install_available,
    marketplace_visibility = excluded.marketplace_visibility,
    updated_at = now();
end; $$;

create or replace function public._bpmke_is_installed(p_tenant_id uuid, p_pack_key text, p_catalog_key text)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if exists (select 1 from pg_proc where proname = '_mssa_pack_installed') then
    return public._mssa_pack_installed(p_tenant_id, p_pack_key, coalesce(p_catalog_key, p_pack_key));
  end if;
  return exists(
    select 1 from public.business_pack_marketplace_install_progress
    where tenant_id = p_tenant_id and pack_key = p_pack_key and workflow_step = 'ready'
  );
end; $$;

create or replace function public._bpmke_listing_card(p_tenant_id uuid, p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_i public.business_pack_identity;
  v_l public.business_pack_marketplace_listings;
  v_installed boolean;
  v_card_status text := 'available';
  v_upgrade_required boolean := false;
  v_trial_days_left integer;
begin
  select * into v_i from public.business_pack_identity where pack_key = p_pack_key;
  select * into v_l from public.business_pack_marketplace_listings where pack_key = p_pack_key;
  if v_i.id is null then return null; end if;

  v_installed := public._bpmke_is_installed(p_tenant_id, v_i.pack_key, v_i.catalog_pack_key);

  if exists (
    select 1 from public.business_pack_license_tenant_state s
    where s.tenant_id = p_tenant_id and s.pack_key = p_pack_key
      and (s.metadata->>'upgrade_required')::boolean = true
  ) then
    v_upgrade_required := true;
  end if;

  v_card_status := case
    when v_i.status in ('coming_soon', 'retired') then v_i.status
    when v_i.status = 'deprecated' then 'deprecated'
    when v_installed then 'installed'
    when v_upgrade_required then 'upgrade_required'
    when coalesce(v_l.trial_available, false) and not v_installed then 'trial_available'
    else 'available'
  end;

  select greatest(0, extract(day from trial_ends_at - now())::integer) into v_trial_days_left
  from public.marketplace_self_service_activations
  where tenant_id = p_tenant_id and pack_key = p_pack_key and activation_status = 'trial'
  limit 1;

  return jsonb_build_object(
    'pack_key', v_i.pack_key,
    'pack_name', v_i.pack_name,
    'pack_logo_url', v_i.pack_logo_url,
    'category', v_i.pack_category,
    'version', v_i.version,
    'status', v_i.status,
    'status_badge', v_i.status,
    'short_description', v_i.short_description,
    'starting_price', coalesce(v_l.pricing_label, 'Contact sales'),
    'starting_price_monthly', v_l.starting_price_monthly,
    'trial_available', coalesce(v_l.trial_available, false),
    'install_available', coalesce(v_l.install_available, v_i.install_allowed),
    'card_status', v_card_status,
    'installed', v_installed,
    'upgrade_required', v_upgrade_required,
    'trial_days_left', v_trial_days_left,
    'supported_languages', coalesce(v_l.supported_languages, '["en","no","sv","da"]'::jsonb),
    'landing_route', '/app/marketplace/packs/' || v_i.pack_key,
    'install_route', '/app/marketplace/packs/' || v_i.pack_key || '/install',
    'license_route', '/app/marketplace/packs/' || v_i.pack_key || '/license',
    'knowledge_route', '/app/marketplace/packs/' || v_i.pack_key || '/knowledge',
    'workspace_route', v_i.workspace_route
  );
end; $$;

create or replace function public._bpmke_recommendations(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_installed text[];
  v_recs jsonb := '[]'::jsonb;
begin
  select coalesce(array_agg(pack_key), array[]::text[]) into v_installed
  from public.marketplace_self_service_activations
  where tenant_id = p_tenant_id and activation_status in ('active', 'trial');

  if public._bpmke_is_installed(p_tenant_id, 'aipify_hosts', 'hospitality') then
    v_recs := v_recs || jsonb_build_array('aipify_executive', 'aipify_support', 'general_business');
  elsif public._bpmke_is_installed(p_tenant_id, 'aipify_commerce', 'e_commerce') then
    v_recs := v_recs || jsonb_build_array('aipify_support', 'aipify_growth');
  else
    v_recs := v_recs || jsonb_build_array('aipify_hosts', 'general_business', 'aipify_support');
  end if;

  return v_recs;
end; $$;

create or replace function public.get_business_pack_marketplace_home(p_locale text default 'en')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_all_cards jsonb := '[]'::jsonb;
  v_pack record;
  v_card jsonb;
  v_recommended jsonb := '[]'::jsonb;
  v_installed jsonb := '[]'::jsonb;
  v_popular jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
  v_continue jsonb := '[]'::jsonb;
  v_upgrades jsonb := '[]'::jsonb;
  v_rec_key text;
begin
  perform public._bpmke_require_view();
  v_tenant_id := public._bpmke_require_tenant();
  perform public._bpmke_seed_listings();

  for v_pack in
    select l.pack_key from public.business_pack_marketplace_listings l
    join public.business_pack_identity i on i.pack_key = l.pack_key
    where l.marketplace_visibility = 'published'
    order by l.popular_rank, i.pack_name
  loop
    v_card := public._bpmke_listing_card(v_tenant_id, v_pack.pack_key);
    if v_card is not null then v_all_cards := v_all_cards || jsonb_build_array(v_card); end if;
  end loop;

  for v_rec_key in
    select jsonb_array_elements_text(public._bpmke_recommendations(v_tenant_id))
  loop
    v_card := public._bpmke_listing_card(v_tenant_id, v_rec_key);
    if v_card is not null and (v_card->>'installed')::boolean = false then
      v_recommended := v_recommended || jsonb_build_array(v_card);
    end if;
  end loop;

  select coalesce(jsonb_agg(c), '[]'::jsonb) into v_installed
  from jsonb_array_elements(v_all_cards) c where (c->>'installed')::boolean = true;

  select coalesce(jsonb_agg(card order by rank), '[]'::jsonb) into v_popular
  from (
    select public._bpmke_listing_card(v_tenant_id, l.pack_key) as card, l.popular_rank as rank
    from public.business_pack_marketplace_listings l
    where l.marketplace_visibility = 'published'
    order by l.popular_rank
    limit 6
  ) t;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', l.pack_key,
    'card', public._bpmke_listing_card(v_tenant_id, l.pack_key),
    'recently_added_at', l.recently_added_at
  ) order by l.recently_added_at desc), '[]'::jsonb) into v_recent
  from public.business_pack_marketplace_listings l
  where l.marketplace_visibility = 'published'
  limit 6;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', p.pack_key,
    'workflow_step', p.workflow_step,
    'card', public._bpmke_listing_card(v_tenant_id, p.pack_key),
    'install_route', '/app/marketplace/packs/' || p.pack_key || '/install'
  )), '[]'::jsonb) into v_continue
  from public.business_pack_marketplace_install_progress p
  where p.tenant_id = v_tenant_id and p.workflow_step is distinct from 'ready';

  select coalesce(jsonb_agg(c), '[]'::jsonb) into v_upgrades
  from jsonb_array_elements(v_all_cards) c
  where (c->>'upgrade_required')::boolean = true or (c->>'card_status') = 'upgrade_required';

  perform public._bpmke_log(v_tenant_id, null, 'home_view', 'Marketplace home viewed', jsonb_build_object('locale', p_locale));

  return jsonb_build_object(
    'found', true,
    'principle', public._bpmkef08_principle(),
    'commercial_principles', public._bpmkef08_commercial_principles(),
    'locale', coalesce(nullif(p_locale, ''), 'en'),
    'categories', public._bpmkef08_categories(),
    'installation_flow', public._bpmkef08_install_flow(),
    'home_sections', public._bpmkef08_home_sections(),
    'sections', jsonb_build_object(
      'recommended_for_you', v_recommended,
      'installed', v_installed,
      'popular', v_popular,
      'recently_added', coalesce((select jsonb_agg(r->'card') from jsonb_array_elements(v_recent) r), '[]'::jsonb),
      'continue_setup', v_continue,
      'upgrade_opportunities', v_upgrades
    ),
    'all_listings', v_all_cards,
    'governance_note', 'Growth Partners may view and demonstrate approved packs — never activate without customer authorization.',
    'marketplace_route', '/app/marketplace/business-packs'
  );
end; $$;

create or replace function public.get_business_pack_marketplace_listing(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_i public.business_pack_identity;
  v_l public.business_pack_marketplace_listings;
  v_card jsonb;
  v_progress public.business_pack_marketplace_install_progress;
begin
  perform public._bpmke_require_view();
  v_tenant_id := public._bpmke_require_tenant();
  perform public._bpmke_seed_listings();

  select * into v_i from public.business_pack_identity where pack_key = p_pack_key;
  select * into v_l from public.business_pack_marketplace_listings where pack_key = p_pack_key;
  if v_i.id is null then return jsonb_build_object('found', false, 'pack_key', p_pack_key); end if;

  v_card := public._bpmke_listing_card(v_tenant_id, p_pack_key);

  select * into v_progress from public.business_pack_marketplace_install_progress
  where tenant_id = v_tenant_id and pack_key = p_pack_key;

  update public.business_pack_marketplace_listings set view_count = view_count + 1 where pack_key = p_pack_key;
  insert into public.business_pack_marketplace_analytics (tenant_id, pack_key, event_type)
  values (v_tenant_id, p_pack_key, 'pack_view');
  perform public._bpmke_log(v_tenant_id, p_pack_key, 'listing_view', 'Pack listing viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', public._bpmkef08_principle(),
    'listing', v_card,
    'identity', jsonb_build_object(
      'pack_name', v_i.pack_name,
      'long_description', v_i.long_description,
      'intended_audience', v_i.intended_audience,
      'key_benefits', v_i.key_benefits,
      'features', v_i.features,
      'primary_use_cases', v_i.primary_use_cases,
      'expected_outcomes', v_i.expected_outcomes,
      'business_value', v_i.business_value
    ),
    'marketplace', jsonb_build_object(
      'visibility', v_l.marketplace_visibility,
      'category', v_l.marketplace_category,
      'pricing_label', v_l.pricing_label,
      'trial_available', v_l.trial_available,
      'license_available', v_l.license_available,
      'supported_languages', v_l.supported_languages
    ),
    'foundation_routes', jsonb_build_object(
      'landing', '/app/marketplace/packs/' || p_pack_key,
      'license', '/app/marketplace/packs/' || p_pack_key || '/license',
      'languages', '/app/marketplace/packs/' || p_pack_key || '/languages',
      'legal', '/app/marketplace/packs/' || p_pack_key || '/legal',
      'knowledge', '/app/marketplace/packs/' || p_pack_key || '/knowledge',
      'install', '/app/marketplace/packs/' || p_pack_key || '/install',
      'release_notes', '/app/marketplace/packs/' || p_pack_key || '/knowledge?category=release_notes'
    ),
    'supported_actions', jsonb_build_array(
      'view_details', 'start_trial', 'install', 'upgrade', 'expand_languages', 'access_knowledge', 'view_release_notes'
    ),
    'install_progress', case when v_progress.id is null then null else jsonb_build_object(
      'workflow_step', v_progress.workflow_step,
      'steps_completed', v_progress.steps_completed,
      'trial_ends_at', v_progress.trial_ends_at
    ) end,
    'installation_flow', public._bpmkef08_install_flow()
  );
end; $$;

create or replace function public.get_business_pack_marketplace_install(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_progress public.business_pack_marketplace_install_progress;
  v_card jsonb;
  v_legal_blocked boolean := true;
begin
  perform public._bpmke_require_view();
  v_tenant_id := public._bpmke_require_tenant();
  perform public._bpmke_seed_listings();

  v_card := public._bpmke_listing_card(v_tenant_id, p_pack_key);
  if v_card is null then return jsonb_build_object('found', false); end if;

  select * into v_progress from public.business_pack_marketplace_install_progress
  where tenant_id = v_tenant_id and pack_key = p_pack_key;

  if not found then
    insert into public.business_pack_marketplace_install_progress (tenant_id, pack_key, workflow_step)
    values (v_tenant_id, p_pack_key, 'choose_license')
    returning * into v_progress;
    perform public._bpmke_log(v_tenant_id, p_pack_key, 'install_started', 'Installation workflow started', '{}'::jsonb);
  end if;

  if exists (select 1 from pg_proc where proname = 'get_business_pack_legal_center') then
    begin
      v_legal_blocked := coalesce((
        select (get_business_pack_legal_center(p_pack_key)->'overview'->>'activation_blocked')::boolean
      ), true);
    exception when others then
      v_legal_blocked := false;
    end;
  else
    v_legal_blocked := false;
  end if;

  return jsonb_build_object(
    'found', true,
    'pack_key', p_pack_key,
    'listing', v_card,
    'workflow_step', v_progress.workflow_step,
    'steps_completed', v_progress.steps_completed,
    'installation_flow', public._bpmkef08_install_flow(),
    'step_routes', jsonb_build_object(
      'choose_license', '/app/marketplace/packs/' || p_pack_key || '/license',
      'accept_terms', '/app/marketplace/packs/' || p_pack_key || '/legal',
      'choose_languages', '/app/marketplace/packs/' || p_pack_key || '/languages',
      'review_permissions', '/app/settings/modules',
      'guided_setup', coalesce(v_card->>'workspace_route', '/app/install')
    ),
    'activation_blocked_pending_legal', v_legal_blocked,
    'commercial_principles', public._bpmkef08_commercial_principles()
  );
end; $$;

create or replace function public.get_business_pack_marketplace_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpmke_require_view();
  perform public._bpmke_seed_listings();

  return jsonb_build_object(
    'has_access', true,
    'is_platform_admin', public.is_platform_admin(),
    'principle', public._bpmkef08_principle(),
    'commercial_principles', public._bpmkef08_commercial_principles(),
    'categories', public._bpmkef08_categories(),
    'installation_flow', public._bpmkef08_install_flow(),
    'governance', jsonb_build_object(
      'super_admin', 'Defines marketplace standards and approves Business Packs',
      'platform_admin', 'Publishes marketplace listings and manages visibility',
      'customers', 'Discover and manage eligible packs',
      'growth_partners', 'View and demonstrate approved packs — no unauthorized activation'
    ),
    'forbidden', jsonb_build_array(
      'Growth Partners activating packs without customer authorization',
      'Manual activation after approved payment',
      'Publishing packs without marketplace listing requirements'
    ),
    'summary', jsonb_build_object(
      'published_listings', (select count(*) from public.business_pack_marketplace_listings where marketplace_visibility = 'published'),
      'total_views', (select coalesce(sum(view_count), 0) from public.business_pack_marketplace_listings),
      'trial_activations', (select coalesce(sum(trial_activation_count), 0) from public.business_pack_marketplace_listings),
      'installations', (select coalesce(sum(install_count), 0) from public.business_pack_marketplace_listings),
      'upgrade_conversions', (select coalesce(sum(upgrade_conversion_count), 0) from public.business_pack_marketplace_listings),
      'analytics_events', (select count(*) from public.business_pack_marketplace_analytics),
      'in_progress_installs', (select count(*) from public.business_pack_marketplace_install_progress where workflow_step <> 'ready')
    ),
    'listings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', l.pack_key,
        'category', l.marketplace_category,
        'visibility', l.marketplace_visibility,
        'pricing_label', l.pricing_label,
        'view_count', l.view_count,
        'install_count', l.install_count,
        'marketplace_route', '/app/marketplace/packs/' || l.pack_key
      ) order by l.popular_rank)
      from public.business_pack_marketplace_listings l
    ), '[]'::jsonb),
    'top_viewed', coalesce((
      select jsonb_agg(jsonb_build_object('pack_key', pack_key, 'view_count', view_count) order by view_count desc)
      from (select pack_key, view_count from public.business_pack_marketplace_listings order by view_count desc limit 10) t
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(row_to_json(a) order by a.created_at desc)
      from (select * from public.business_pack_marketplace_audit_logs order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'success_criteria', jsonb_build_array(
      'Customers confidently discover and activate packs without assistance',
      'Marketplace is the central growth engine of Aipify',
      'Paid = Access Now — immediate entitlement updates'
    )
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.get_business_pack_marketplace_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bpmke_seed_listings();
  return jsonb_build_object(
    'has_access', true,
    'listing_count', (select count(*) from public.business_pack_marketplace_listings where marketplace_visibility = 'published'),
    'principle', public._bpmkef08_principle()
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.perform_business_pack_marketplace_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_next_step text;
  v_result jsonb;
begin
  v_tenant_id := public._bpmke_require_tenant();

  if p_action_type = 'start_trial' then
    perform public._bpmke_require_install();
    if exists (select 1 from pg_proc where proname = 'perform_marketplace_self_service_action') then
      v_result := public.perform_marketplace_self_service_action('start_trial', p_pack_key, p_payload);
    end if;
    update public.business_pack_marketplace_listings set trial_activation_count = trial_activation_count + 1 where pack_key = p_pack_key;
    insert into public.business_pack_marketplace_analytics (tenant_id, pack_key, event_type) values (v_tenant_id, p_pack_key, 'trial_activation');
    perform public._bpmke_log(v_tenant_id, p_pack_key, 'trial_started', 'Trial started from marketplace', p_payload);
    return coalesce(v_result, jsonb_build_object('action', p_action_type, 'status', 'trial_started', 'message', 'Trial activated — explore the pack workspace.'));
  end if;

  if p_action_type = 'activate_pack' then
    perform public._bpmke_require_install();
    if exists (select 1 from pg_proc where proname = 'perform_marketplace_self_service_action') then
      v_result := public.perform_marketplace_self_service_action('activate', p_pack_key, p_payload);
    end if;
    update public.business_pack_marketplace_listings set install_count = install_count + 1 where pack_key = p_pack_key;
    insert into public.business_pack_marketplace_install_progress (tenant_id, pack_key, workflow_step, steps_completed)
    values (v_tenant_id, p_pack_key, 'ready', '["activate"]'::jsonb)
    on conflict (tenant_id, pack_key) do update set workflow_step = 'ready', updated_at = now();
    insert into public.business_pack_marketplace_analytics (tenant_id, pack_key, event_type) values (v_tenant_id, p_pack_key, 'installation');
    perform public._bpmke_log(v_tenant_id, p_pack_key, 'pack_activated', 'Pack activated — Paid = Access Now', p_payload);
    return coalesce(v_result, jsonb_build_object('action', p_action_type, 'status', 'activated', 'message', 'Pack activated. Entitlements updated immediately.'));
  end if;

  if p_action_type = 'advance_install_step' then
    v_next_step := coalesce(p_payload->>'next_step', 'activate');
    insert into public.business_pack_marketplace_install_progress (tenant_id, pack_key, workflow_step, steps_completed)
    values (v_tenant_id, p_pack_key, v_next_step, coalesce(p_payload->'steps_completed', '[]'::jsonb))
    on conflict (tenant_id, pack_key) do update set
      workflow_step = v_next_step,
      steps_completed = coalesce(p_payload->'steps_completed', public.business_pack_marketplace_install_progress.steps_completed),
      updated_at = now();
    insert into public.business_pack_marketplace_analytics (tenant_id, pack_key, event_type, context)
    values (v_tenant_id, p_pack_key, 'install_step', jsonb_build_object('step', v_next_step));
    perform public._bpmke_log(v_tenant_id, p_pack_key, 'install_step_advanced', 'Install step: ' || v_next_step, p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'advanced', 'workflow_step', v_next_step);
  end if;

  if p_action_type = 'start_upgrade' then
    perform public._bpmke_require_install();
    update public.business_pack_marketplace_listings set upgrade_conversion_count = upgrade_conversion_count + 1 where pack_key = p_pack_key;
    insert into public.business_pack_marketplace_analytics (tenant_id, pack_key, event_type) values (v_tenant_id, p_pack_key, 'upgrade_conversion');
    perform public._bpmke_log(v_tenant_id, p_pack_key, 'upgrade_started', 'Upgrade started from marketplace', p_payload);
    return jsonb_build_object(
      'action', p_action_type,
      'status', 'redirect',
      'license_route', '/app/marketplace/packs/' || p_pack_key || '/license',
      'message', 'Paid = Access Now — upgrade applies immediately upon approved payment.'
    );
  end if;

  if p_action_type = 'publish_listing' then
    if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
    update public.business_pack_marketplace_listings
    set marketplace_visibility = 'published', published_at = now(), updated_at = now()
    where pack_key = p_pack_key;
    perform public._bpmke_log(v_tenant_id, p_pack_key, 'listing_published', 'Marketplace listing published', p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'published');
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_business_pack_marketplace_kc()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'marketplace', 'Marketplace',
    'Discover, install, upgrade, and manage Aipify Business Packs.', 385
  );
  perform public._ahostkc_seed_article('marketplace', 'understanding-business-packs', 'Understanding Business Packs',
    'Business Packs are modular operational capabilities — identity, licensing, languages, legal, and knowledge unified in the Marketplace.');
  perform public._ahostkc_seed_article('marketplace', 'installing-business-packs', 'Installing Business Packs',
    'Installation workflow: choose license, accept terms, choose languages, review permissions, activate, guided setup.');
  perform public._ahostkc_seed_article('marketplace', 'choosing-the-right-license', 'Choosing the Right License',
    'Select capacity-based licensing aligned to your operations. Paid = Access Now — no manual activation.');
  perform public._ahostkc_seed_article('marketplace', 'managing-installed-packs', 'Managing Installed Packs',
    'View installed packs, versions, license status, capacity usage, and available updates from the Marketplace.');
  perform public._ahostkc_seed_article('marketplace', 'upgrading-business-packs', 'Upgrading Business Packs',
    'When capacity or features require expansion, upgrade recommendations guide you through license selection and instant activation.');
end; $$;

select public._bpmke_seed_listings();
select public.seed_business_pack_marketplace_kc();

grant execute on function public.get_business_pack_marketplace_home(text) to authenticated;
grant execute on function public.get_business_pack_marketplace_listing(text) to authenticated;
grant execute on function public.get_business_pack_marketplace_install(text) to authenticated;
grant execute on function public.get_business_pack_marketplace_engine_dashboard() to authenticated;
grant execute on function public.get_business_pack_marketplace_engine_card() to authenticated;
grant execute on function public.perform_business_pack_marketplace_action(text, text, jsonb) to authenticated;
