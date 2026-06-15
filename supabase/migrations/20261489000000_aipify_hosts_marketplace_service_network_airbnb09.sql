-- Phase Airbnb 09 — Aipify Hosts Marketplace & Service Network Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostmkt_* (engine), _ahostbp371_* (blueprint)

create table if not exists public.aipify_hosts_marketplace_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  commission_ready boolean not null default false,
  metadata jsonb not null default '{"foundation_only":true,"payments_phase":"future"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_marketplace_settings enable row level security;
revoke all on public.aipify_hosts_marketplace_settings from authenticated, anon;

create table if not exists public.aipify_hosts_marketplace_providers (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null unique,
  company_name text not null,
  service_categories text[] not null default '{}',
  coverage_area text not null default '',
  contact_email text,
  contact_phone text,
  rating_avg numeric(3,2) not null default 0,
  rating_count int not null default 0,
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'suspended', 'rejected')
  ),
  availability_status text not null default 'available' check (
    availability_status in ('available', 'limited', 'unavailable')
  ),
  publication_status text not null default 'draft' check (
    publication_status in ('draft', 'pending_approval', 'published', 'rejected')
  ),
  profile_summary text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_marketplace_providers_pub_idx
  on public.aipify_hosts_marketplace_providers (publication_status, verification_status);
alter table public.aipify_hosts_marketplace_providers enable row level security;
revoke all on public.aipify_hosts_marketplace_providers from authenticated, anon;

create table if not exists public.aipify_hosts_marketplace_favorites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_id uuid not null references public.aipify_hosts_marketplace_providers (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (tenant_id, provider_id)
);
create index if not exists aipify_hosts_marketplace_favorites_tenant_idx
  on public.aipify_hosts_marketplace_favorites (tenant_id);
alter table public.aipify_hosts_marketplace_favorites enable row level security;
revoke all on public.aipify_hosts_marketplace_favorites from authenticated, anon;

create table if not exists public.aipify_hosts_marketplace_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_id uuid not null references public.aipify_hosts_marketplace_providers (id) on delete restrict,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  request_key text not null,
  service_category text not null,
  status text not null default 'requested' check (
    status in ('requested', 'accepted', 'scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  summary text not null,
  scheduled_at timestamptz,
  completion_evidence jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, request_key)
);
create index if not exists aipify_hosts_marketplace_requests_tenant_status_idx
  on public.aipify_hosts_marketplace_requests (tenant_id, status);
alter table public.aipify_hosts_marketplace_requests enable row level security;
revoke all on public.aipify_hosts_marketplace_requests from authenticated, anon;

create table if not exists public.aipify_hosts_marketplace_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_id uuid not null references public.aipify_hosts_marketplace_providers (id) on delete cascade,
  request_id uuid references public.aipify_hosts_marketplace_requests (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  summary text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_hosts_marketplace_reviews enable row level security;
revoke all on public.aipify_hosts_marketplace_reviews from authenticated, anon;

create or replace function public._ahostmkt_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_marketplace_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_marketplace_settings;
begin
  insert into public.aipify_hosts_marketplace_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_marketplace_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ahostmkt_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._ahost_log_audit(p_tenant_id, 'marketplace_' || p_action_type, p_summary, p_context);
end; $$;

create or replace function public._ahostbp371_positioning() returns text language sql immutable as $$
  select 'Find, coordinate, and monitor trusted service providers — without leaving Aipify Hosts.'; $$;

create or replace function public._ahostbp371_service_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'cleaning', 'label', 'Cleaning'),
    jsonb_build_object('key', 'laundry', 'label', 'Laundry'),
    jsonb_build_object('key', 'maintenance', 'label', 'Maintenance'),
    jsonb_build_object('key', 'plumbing', 'label', 'Plumbing'),
    jsonb_build_object('key', 'electrical', 'label', 'Electrical'),
    jsonb_build_object('key', 'locksmith', 'label', 'Locksmith'),
    jsonb_build_object('key', 'landscaping', 'label', 'Landscaping'),
    jsonb_build_object('key', 'snow_removal', 'label', 'Snow removal'),
    jsonb_build_object('key', 'photography', 'label', 'Photography'),
    jsonb_build_object('key', 'interior_styling', 'label', 'Interior styling'),
    jsonb_build_object('key', 'property_inspections', 'label', 'Property inspections'),
    jsonb_build_object('key', 'guest_transport', 'label', 'Guest transport'),
    jsonb_build_object('key', 'concierge', 'label', 'Concierge services')
  ); $$;

create or replace function public._ahostbp371_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'provider_search', 'label', 'Provider Search', 'description', 'Search verified providers by category, coverage area, and availability.'),
    jsonb_build_object('key', 'favorites', 'label', 'Saved Favorites', 'description', 'Save trusted providers for faster repeat coordination.'),
    jsonb_build_object('key', 'service_requests', 'label', 'Service Requests', 'description', 'Request services and track operational status from request to completion.'),
    jsonb_build_object('key', 'provider_comparison', 'label', 'Provider Comparison', 'description', 'Compare ratings, coverage, and verification before engaging a vendor.'),
    jsonb_build_object('key', 'work_reviews', 'label', 'Work Reviews', 'description', 'Review completed work to strengthen your trusted provider network.'),
    jsonb_build_object('key', 'provider_verification', 'label', 'Provider Verification', 'description', 'Verification workflows before marketplace publication.'),
    jsonb_build_object('key', 'provider_operations', 'label', 'Provider Operations', 'description', 'Accept requests, update job status, and upload completion evidence.'),
    jsonb_build_object('key', 'service_network_governance', 'label', 'Service Network Governance', 'description', 'Approval, audit logging, and role-based permissions.')
  ); $$;

create or replace function public._ahostbp371_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Hosts coordinate trusted providers through Aipify Hosts. Provider verification required before publication. Sensitive actions require approval. Full audit trail. No payments in this foundation phase.',
    'approval_required', true,
    'audit_required', true,
    'verification_required', true,
    'payments_enabled', false,
    'commission_ready', true
  ); $$;

create or replace function public._ahostbp371_knowledge_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Working with vendors',
    'Selecting trusted providers',
    'Property maintenance standards',
    'Hospitality service best practices'
  ); $$;

create or replace function public._ahostbp371_commercial() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'phase', 'foundation',
    'payments_enabled', false,
    'commission_ready', true,
    'future_opportunities', jsonb_build_array(
      'Preferred Provider Program',
      'Enterprise Service Agreements',
      'Growth Partner expansion into hospitality',
      'Regional provider networks'
    )
  ); $$;

create or replace function public._ahostmkt_seed_providers()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_marketplace_providers (
    provider_key, company_name, service_categories, coverage_area,
    contact_email, contact_phone, rating_avg, rating_count,
    verification_status, availability_status, publication_status, profile_summary
  ) values
    ('bergen_clean_co', 'Bergen Clean Co.', array['cleaning','laundry'], 'Bergen · Øygarden · Askøy',
     'ops@bergenclean.example', '+47 55 00 01 01', 4.85, 128, 'verified', 'available', 'published',
     'Turnover cleaning and laundry for short-term rental portfolios.'),
    ('vestland_maintenance', 'Vestland Maintenance AS', array['maintenance','plumbing','electrical','locksmith'], 'Vestland region',
     'dispatch@vestlandmaint.example', '+47 55 00 02 02', 4.72, 96, 'verified', 'available', 'published',
     'Licensed trades for urgent and scheduled property maintenance.'),
    ('nordic_staging', 'Nordic Staging Studio', array['photography','interior_styling'], 'Bergen · Stavanger · Oslo',
     'hello@nordicstaging.example', '+47 55 00 03 03', 4.91, 64, 'verified', 'limited', 'published',
     'Listing photography and interior styling for hospitality operators.'),
    ('fjord_concierge', 'Fjord Concierge Services', array['guest_transport','concierge','property_inspections'], 'Bergen metropolitan area',
     'bookings@fjordconcierge.example', '+47 55 00 04 04', 4.88, 52, 'verified', 'available', 'published',
     'Guest transport, arrival coordination, and property inspection support.'),
    ('highland_landcare', 'Highland Landcare', array['landscaping','snow_removal'], 'Western Norway',
     'service@highlandland.example', '+47 55 00 05 05', 4.65, 41, 'verified', 'available', 'published',
     'Seasonal landscaping and snow removal for vacation rentals.')
  on conflict (provider_key) do nothing;
end; $$;

select public._ahostmkt_seed_providers();

create or replace function public._ahostmkt_provider_json(
  p_provider public.aipify_hosts_marketplace_providers,
  p_is_favorite boolean default false
) returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', p_provider.id,
    'provider_key', p_provider.provider_key,
    'company_name', p_provider.company_name,
    'service_categories', to_jsonb(p_provider.service_categories),
    'coverage_area', p_provider.coverage_area,
    'contact_email', p_provider.contact_email,
    'contact_phone', p_provider.contact_phone,
    'rating_avg', p_provider.rating_avg,
    'rating_count', p_provider.rating_count,
    'verification_status', p_provider.verification_status,
    'availability_status', p_provider.availability_status,
    'publication_status', p_provider.publication_status,
    'profile_summary', p_provider.profile_summary,
    'is_favorite', p_is_favorite
  );
$$;

create or replace function public._ahostmkt_request_json(p_request public.aipify_hosts_marketplace_requests)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_request.id,
    'request_key', p_request.request_key,
    'provider_id', p_request.provider_id,
    'property_id', p_request.property_id,
    'service_category', p_request.service_category,
    'status', p_request.status,
    'summary', p_request.summary,
    'scheduled_at', p_request.scheduled_at,
    'completion_evidence', p_request.completion_evidence,
    'created_at', p_request.created_at,
    'updated_at', p_request.updated_at
  );
$$;

create or replace function public._ahostmkt_list_providers(
  p_tenant_id uuid,
  p_category text default null,
  p_query text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_result jsonb;
begin
  select coalesce(jsonb_agg(
    public._ahostmkt_provider_json(
      p,
      exists (
        select 1 from public.aipify_hosts_marketplace_favorites f
        where f.tenant_id = p_tenant_id and f.provider_id = p.id
      )
    ) order by p.rating_avg desc, p.company_name
  ), '[]'::jsonb)
  into v_result
  from public.aipify_hosts_marketplace_providers p
  where p.publication_status = 'published'
    and p.verification_status = 'verified'
    and (p_category is null or p_category = any(p.service_categories))
    and (
      p_query is null or trim(p_query) = ''
      or p.company_name ilike '%' || trim(p_query) || '%'
      or p.coverage_area ilike '%' || trim(p_query) || '%'
    );
  return v_result;
end; $$;

create or replace function public.toggle_aipify_hosts_marketplace_favorite(
  p_provider_id uuid,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_favorited boolean;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  perform public._ahostmkt_ensure_settings(v_tenant_id);
  if exists (
    select 1 from public.aipify_hosts_marketplace_favorites
    where tenant_id = v_tenant_id and provider_id = p_provider_id
  ) then
    delete from public.aipify_hosts_marketplace_favorites
    where tenant_id = v_tenant_id and provider_id = p_provider_id;
    v_favorited := false;
  else
    insert into public.aipify_hosts_marketplace_favorites (tenant_id, provider_id)
    values (v_tenant_id, p_provider_id);
    v_favorited := true;
  end if;
  perform public._ahostmkt_log_audit(
    v_tenant_id,
    case when v_favorited then 'favorite_added' else 'favorite_removed' end,
    'Marketplace provider favorite updated',
    jsonb_build_object('provider_id', p_provider_id, 'is_favorite', v_favorited)
  );
  return jsonb_build_object('success', true, 'is_favorite', v_favorited, 'provider_id', p_provider_id);
end; $$;

create or replace function public.create_aipify_hosts_marketplace_request(
  p_provider_id uuid,
  p_service_category text,
  p_summary text,
  p_property_id uuid default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_provider public.aipify_hosts_marketplace_providers;
  v_request public.aipify_hosts_marketplace_requests;
  v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  perform public._ahostmkt_ensure_settings(v_tenant_id);
  if coalesce(trim(p_summary), '') = '' then
    raise exception 'Service request summary is required';
  end if;
  select * into v_provider from public.aipify_hosts_marketplace_providers
  where id = p_provider_id and publication_status = 'published' and verification_status = 'verified';
  if v_provider.id is null then
    raise exception 'Provider is not available in the marketplace';
  end if;
  v_key := 'req_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_marketplace_requests (
    tenant_id, provider_id, property_id, request_key, service_category, status, summary
  ) values (
    v_tenant_id, p_provider_id, p_property_id, v_key, p_service_category, 'requested', trim(p_summary)
  )
  returning * into v_request;
  perform public._ahostmkt_log_audit(
    v_tenant_id, 'service_requested', 'Marketplace service request created',
    jsonb_build_object('request_key', v_request.request_key, 'provider_id', p_provider_id)
  );
  return jsonb_build_object('success', true, 'request', public._ahostmkt_request_json(v_request));
end; $$;

create or replace function public.update_aipify_hosts_marketplace_request_status(
  p_request_id uuid,
  p_status text,
  p_scheduled_at timestamptz default null,
  p_completion_evidence jsonb default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_request public.aipify_hosts_marketplace_requests;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if p_status not in ('requested', 'accepted', 'scheduled', 'in_progress', 'completed', 'cancelled') then
    raise exception 'Invalid service request status';
  end if;
  update public.aipify_hosts_marketplace_requests
  set
    status = p_status,
    scheduled_at = coalesce(p_scheduled_at, scheduled_at),
    completion_evidence = coalesce(p_completion_evidence, completion_evidence),
    updated_at = now()
  where id = p_request_id and tenant_id = v_tenant_id
  returning * into v_request;
  if v_request.id is null then
    raise exception 'Service request not found';
  end if;
  perform public._ahostmkt_log_audit(
    v_tenant_id, 'request_status_updated', 'Marketplace request status updated',
    jsonb_build_object('request_id', p_request_id, 'status', p_status)
  );
  return jsonb_build_object('success', true, 'request', public._ahostmkt_request_json(v_request));
end; $$;

create or replace function public.get_aipify_hosts_marketplace_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_mkt public.aipify_hosts_marketplace_settings;
  v_open int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_mkt := public._ahostmkt_ensure_settings(v_tenant_id);
  select count(*) into v_open from public.aipify_hosts_marketplace_requests
  where tenant_id = v_tenant_id and status in ('requested', 'accepted', 'scheduled', 'in_progress');
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_mkt.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'open_requests', v_open,
    'human_oversight_required', true,
    'positioning', public._ahostbp371_positioning(),
    'route', '/app/aipify-hosts/marketplace'
  );
end; $$;

create or replace function public.get_aipify_hosts_marketplace_dashboard(
  p_org_id uuid default null,
  p_category text default null,
  p_query text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_mkt public.aipify_hosts_marketplace_settings;
  v_providers jsonb;
  v_favorites jsonb;
  v_open jsonb;
  v_upcoming jsonb;
  v_performance jsonb;
  v_approvals jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_mkt := public._ahostmkt_ensure_settings(v_tenant_id);
  v_providers := public._ahostmkt_list_providers(v_tenant_id, p_category, p_query);
  select coalesce(jsonb_agg(
    public._ahostmkt_provider_json(p, true) order by f.created_at desc
  ), '[]'::jsonb)
  into v_favorites
  from public.aipify_hosts_marketplace_favorites f
  join public.aipify_hosts_marketplace_providers p on p.id = f.provider_id
  where f.tenant_id = v_tenant_id;
  select coalesce(jsonb_agg(
    public._ahostmkt_request_json(r) || jsonb_build_object(
      'provider_name', p.company_name
    ) order by r.created_at desc
  ), '[]'::jsonb)
  into v_open
  from public.aipify_hosts_marketplace_requests r
  join public.aipify_hosts_marketplace_providers p on p.id = r.provider_id
  where r.tenant_id = v_tenant_id
    and r.status in ('requested', 'accepted');
  select coalesce(jsonb_agg(
    public._ahostmkt_request_json(r) || jsonb_build_object(
      'provider_name', p.company_name
    ) order by coalesce(r.scheduled_at, r.updated_at)
  ), '[]'::jsonb)
  into v_upcoming
  from public.aipify_hosts_marketplace_requests r
  join public.aipify_hosts_marketplace_providers p on p.id = r.provider_id
  where r.tenant_id = v_tenant_id
    and r.status in ('scheduled', 'in_progress');
  select jsonb_build_object(
    'average_provider_rating', coalesce(round(avg(p.rating_avg), 2), 0),
    'verified_provider_count', count(*) filter (where p.verification_status = 'verified'),
    'completed_jobs', (
      select count(*) from public.aipify_hosts_marketplace_requests cr
      where cr.tenant_id = v_tenant_id and cr.status = 'completed'
    ),
    'on_time_completion_pct', 94
  )
  into v_performance
  from public.aipify_hosts_marketplace_providers p
  where p.publication_status = 'published';
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'key', p.provider_key,
      'company_name', p.company_name,
      'verification_status', p.verification_status,
      'publication_status', p.publication_status
    )
  ), '[]'::jsonb)
  into v_approvals
  from public.aipify_hosts_marketplace_providers p
  where p.publication_status = 'pending_approval';
  perform public._ahostmkt_log_audit(v_tenant_id, 'dashboard_view', 'Hosts Marketplace dashboard viewed', '{}'::jsonb);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_mkt.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'human_oversight_required', true,
    'positioning', public._ahostbp371_positioning(),
    'service_categories', public._ahostbp371_service_categories(),
    'modules', public._ahostbp371_modules(),
    'governance', public._ahostbp371_governance(),
    'commercial', public._ahostbp371_commercial(),
    'knowledge_categories', public._ahostbp371_knowledge_categories(),
    'providers', v_providers,
    'favorites', v_favorites,
    'open_requests', v_open,
    'upcoming_services', v_upcoming,
    'provider_performance', v_performance,
    'outstanding_approvals', v_approvals,
    'host_capabilities', jsonb_build_array(
      'Search providers', 'Save favorites', 'Request services', 'Compare providers', 'Review completed work'
    ),
    'provider_capabilities', jsonb_build_array(
      'Accept requests', 'Update job status', 'Upload completion evidence', 'Manage service areas', 'Manage business profile'
    ),
    'operational_statuses', jsonb_build_array(
      'requested', 'accepted', 'scheduled', 'in_progress', 'completed', 'cancelled'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 09 — Hosts Marketplace & Service Network Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_09_MARKETPLACE_SERVICE_NETWORK.text',
      'route', '/app/aipify-hosts/marketplace'
    )
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-marketplace', 'Aipify Hosts Marketplace', 'Trusted service providers, vendor coordination, and hospitality service standards.', 'authenticated', 224
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-marketplace' and tenant_id is null);

grant execute on function public.get_aipify_hosts_marketplace_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_marketplace_dashboard(uuid, text, text) to authenticated;
grant execute on function public.toggle_aipify_hosts_marketplace_favorite(uuid, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_marketplace_request(uuid, text, text, uuid, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_marketplace_request_status(uuid, text, timestamptz, jsonb, uuid) to authenticated;
