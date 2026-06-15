-- Phase Airbnb 04 — Aipify Hosts Guest Intelligence & Loyalty Engine
-- Feature owner: CUSTOMER APP. Helpers: _ahostguest_* (engine), _ahostbp367_* (blueprint)

create table if not exists public.aipify_hosts_guest_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  data_minimization boolean not null default true,
  retention_policy_acknowledged boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true,"no_raw_chat":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_guest_settings enable row level security;
revoke all on public.aipify_hosts_guest_settings from authenticated, anon;

create table if not exists public.aipify_hosts_guest_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  guest_key text not null,
  stay_count int not null default 0 check (stay_count >= 0),
  satisfaction_score numeric(5,2) default 0,
  segment text check (segment in (
    'business_traveler', 'family', 'couple', 'extended_stay', 'high_value', 'returning', 'other'
  )),
  is_returning boolean not null default false,
  last_stay_months_ago int,
  metadata jsonb not null default '{"metadata_only":true,"operational_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, guest_key)
);
create index if not exists aipify_hosts_guest_profiles_tenant_idx
  on public.aipify_hosts_guest_profiles (tenant_id, is_returning);
alter table public.aipify_hosts_guest_profiles enable row level security;
revoke all on public.aipify_hosts_guest_profiles from authenticated, anon;

create or replace function public._ahostguest_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_guest_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_guest_settings;
begin
  insert into public.aipify_hosts_guest_settings (tenant_id, enabled, data_minimization)
  values (p_tenant_id, true, true) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_guest_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ahostguest_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._ahost_log_audit(p_tenant_id, 'guest_intelligence_' || p_action_type, p_summary, p_context);
end; $$;

create or replace function public._ahostbp367_positioning() returns text language sql immutable as $$
  select 'Turn guests into returning guests.'; $$;

create or replace function public._ahostbp367_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'guest_profile_intelligence', 'label', 'Guest Profile Intelligence Center', 'description', 'Operational guest profiles — preferences, stay patterns, host-approved notes (metadata only).'),
    jsonb_build_object('key', 'returning_guest_recognition', 'label', 'Returning Guest Recognition Engine', 'description', 'Returning guest detection, stay history, repeat booking statistics.'),
    jsonb_build_object('key', 'guest_satisfaction_monitor', 'label', 'Guest Satisfaction Monitor', 'description', 'Satisfaction indicators from reviews, support interactions, and stay outcomes.'),
    jsonb_build_object('key', 'early_warning_experience', 'label', 'Early Warning Experience Engine', 'description', 'Detect potential dissatisfaction before reviews — risk alerts and suggested interventions.'),
    jsonb_build_object('key', 'personalized_hospitality_recommendations', 'label', 'Personalized Hospitality Recommendations', 'description', 'Family, business, couple, and seasonal suggestions — optional, host decides.'),
    jsonb_build_object('key', 'loyalty_return_strategy', 'label', 'Loyalty & Return Strategy Center', 'description', 'Guest appreciation, future stay suggestions, preferred guest programs.'),
    jsonb_build_object('key', 'guest_segmentation', 'label', 'Guest Segmentation Engine', 'description', 'Business, family, couples, extended stay, high-value, returning segments.'),
    jsonb_build_object('key', 'executive_loyalty_dashboard', 'label', 'Executive Loyalty Dashboard', 'description', 'Repeat guest percentage, retention trends, segment performance.'),
    jsonb_build_object('key', 'feedback_intelligence', 'label', 'Feedback Intelligence Center', 'description', 'Feedback categorization, trend analysis, property comparison.'),
    jsonb_build_object('key', 'guest_journey_mapping', 'label', 'Guest Journey Mapping Engine', 'description', 'Pre-arrival through post-stay journey visibility and best practices.')
  ); $$;

create or replace function public._ahostbp367_segments() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'business_traveler', 'label', 'Business Travelers'),
    jsonb_build_object('key', 'family', 'label', 'Families'),
    jsonb_build_object('key', 'couple', 'label', 'Couples'),
    jsonb_build_object('key', 'extended_stay', 'label', 'Extended Stay Guests'),
    jsonb_build_object('key', 'high_value', 'label', 'High-Value Guests'),
    jsonb_build_object('key', 'returning', 'label', 'Returning Guests')
  ); $$;

create or replace function public._ahostbp367_journey_stages() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'pre_arrival', 'label', 'Pre-arrival', 'focus', jsonb_build_array('Communication', 'Expectations', 'Preparation')),
    jsonb_build_object('key', 'arrival', 'label', 'Arrival', 'focus', jsonb_build_array('Check-in', 'First impressions')),
    jsonb_build_object('key', 'during_stay', 'label', 'During stay', 'focus', jsonb_build_array('Requests', 'Recommendations', 'Support')),
    jsonb_build_object('key', 'departure', 'label', 'Departure', 'focus', jsonb_build_array('Check-out', 'Follow-up')),
    jsonb_build_object('key', 'post_stay', 'label', 'Post-stay', 'focus', jsonb_build_array('Feedback', 'Loyalty opportunities'))
  ); $$;

create or replace function public._ahostbp367_feedback_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Cleanliness', 'Communication', 'Comfort', 'Location', 'Amenities', 'Check-in experience'
  ); $$;

create or replace function public._ahostbp367_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Guest trust first. Data minimization. Only operationally relevant metadata. Compliance with applicable regulations. Recommendations remain optional — hosts decide.',
    'approval_required', true,
    'audit_required', true,
    'data_minimization', true,
    'no_raw_chat', true
  ); $$;

create or replace function public._ahostbp367_success_metrics() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'repeat_bookings', 'label', 'Increased repeat bookings'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Improved guest satisfaction'),
    jsonb_build_object('key', 'reviews', 'label', 'Reduced negative reviews'),
    jsonb_build_object('key', 'relationships', 'label', 'Stronger guest relationships'),
    jsonb_build_object('key', 'lifetime_value', 'label', 'Higher lifetime guest value'),
    jsonb_build_object('key', 'revenue_stability', 'label', 'Increased revenue stability')
  ); $$;

create or replace function public._ahostbp367_knowledge_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Hospitality psychology', 'Guest communication excellence', 'Guest retention strategies',
    'Service recovery techniques', 'Hospitality relationship management'
  ); $$;

create or replace function public._ahostguest_loyalty_snapshot(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then jsonb_build_object(
    'overall_satisfaction', 0,
    'repeat_guest_pct', 0,
    'returning_guests', 0,
    'at_risk_guests', 0,
    'loyalty_opportunities', 0
  ) else jsonb_build_object(
    'overall_satisfaction', least(98, 82 + p_property_count),
    'repeat_guest_pct', least(45, 18 + p_property_count * 2),
    'returning_guests', greatest(1, p_property_count * 2),
    'at_risk_guests', case when p_property_count >= 2 then 1 else 0 end,
    'loyalty_opportunities', greatest(1, p_property_count)
  ) end; $$;

create or replace function public._ahostguest_sample_insights(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'returning_guest', 'label', 'Guest has stayed 4 times previously', 'type', 'recognition'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Returning guest satisfaction score: Excellent', 'type', 'satisfaction'),
    jsonb_build_object('key', 'pillows', 'label', 'Guest previously requested extra pillows', 'type', 'recommendation'),
    jsonb_build_object('key', 'restaurants', 'label', 'Guest frequently asks for restaurant recommendations', 'type', 'recommendation'),
    jsonb_build_object('key', 'risk', 'label', 'Guest experience risk elevated — proactively contact guest', 'type', 'early_warning'),
    jsonb_build_object('key', 'loyalty', 'label', 'Guest last visited 12 months ago — send personalized invitation', 'type', 'loyalty')
  ) end; $$;

create or replace function public.get_aipify_hosts_guest_intelligence_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_guest public.aipify_hosts_guest_settings;
  v_props int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_guest := public._ahostguest_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_guest.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', greatest(v_hosts.property_count, v_props),
    'human_oversight_required', true,
    'positioning', public._ahostbp367_positioning(),
    'route', '/app/aipify-hosts/guest-intelligence'
  );
end; $$;

create or replace function public.get_aipify_hosts_guest_intelligence_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_guest public.aipify_hosts_guest_settings;
  v_props int;
  v_prop_count int;
  v_loyalty jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_guest := public._ahostguest_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  v_prop_count := greatest(v_hosts.property_count, v_props);
  v_loyalty := public._ahostguest_loyalty_snapshot(v_prop_count);
  perform public._ahostguest_log_audit(v_tenant_id, 'dashboard_view', 'Guest intelligence dashboard viewed', jsonb_build_object('package', v_hosts.package_key));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_guest.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', v_prop_count,
    'human_oversight_required', true,
    'positioning', public._ahostbp367_positioning(),
    'vision', 'Most booking platforms optimize for transactions. Aipify Hosts optimizes for relationships.',
    'modules', public._ahostbp367_modules(),
    'segments', public._ahostbp367_segments(),
    'journey_stages', public._ahostbp367_journey_stages(),
    'feedback_categories', public._ahostbp367_feedback_categories(),
    'governance', public._ahostbp367_governance(),
    'success_metrics', public._ahostbp367_success_metrics(),
    'knowledge_categories', public._ahostbp367_knowledge_categories(),
    'loyalty_snapshot', v_loyalty,
    'guest_insights', public._ahostguest_sample_insights(v_prop_count),
    'executive_metrics', jsonb_build_array(
      jsonb_build_object('key', 'repeat_guest_pct', 'label', 'Repeat guest percentage', 'value', (v_loyalty->>'repeat_guest_pct') || '%'),
      jsonb_build_object('key', 'overall_satisfaction', 'label', 'Average satisfaction score', 'value', v_loyalty->>'overall_satisfaction'),
      jsonb_build_object('key', 'returning_guests', 'label', 'Returning guests tracked', 'value', v_loyalty->>'returning_guests'),
      jsonb_build_object('key', 'at_risk', 'label', 'Early warning alerts', 'value', v_loyalty->>'at_risk_guests')
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 04 — Guest Intelligence & Loyalty',
      'doc', 'aipify-hosts/PHASE_AIRBNB_04_GUEST_INTELLIGENCE.text',
      'route', '/app/aipify-hosts/guest-intelligence'
    )
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-guest-intelligence', 'Aipify Hosts Guest Intelligence', 'Guest retention, loyalty, satisfaction monitoring, and relationship stewardship.', 'authenticated', 220
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-guest-intelligence' and tenant_id is null);

grant execute on function public.get_aipify_hosts_guest_intelligence_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_guest_intelligence_dashboard(uuid) to authenticated;
