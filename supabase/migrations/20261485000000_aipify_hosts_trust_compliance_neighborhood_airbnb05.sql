-- Phase Airbnb 05 — Aipify Hosts Trust, Compliance & Neighborhood Intelligence Engine
-- Feature owner: CUSTOMER APP. Helpers: _ahosttrust_* (engine), _ahostbp368_* (blueprint)

create table if not exists public.aipify_hosts_trust_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  legal_acknowledgement boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true,"recommendations_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_trust_settings enable row level security;
revoke all on public.aipify_hosts_trust_settings from authenticated, anon;

create table if not exists public.aipify_hosts_compliance_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_key text not null,
  compliance_area text not null check (compliance_area in (
    'registration', 'safety', 'insurance', 'emergency', 'policy', 'neighborhood', 'house_rules'
  )),
  status text not null default 'attention_required' check (status in ('compliant', 'attention_required', 'action_overdue')),
  summary text,
  due_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, item_key)
);
create index if not exists aipify_hosts_compliance_items_tenant_idx
  on public.aipify_hosts_compliance_items (tenant_id, status);
alter table public.aipify_hosts_compliance_items enable row level security;
revoke all on public.aipify_hosts_compliance_items from authenticated, anon;

create or replace function public._ahosttrust_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_trust_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_trust_settings;
begin
  insert into public.aipify_hosts_trust_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_trust_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ahosttrust_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._ahost_log_audit(p_tenant_id, 'trust_compliance_' || p_action_type, p_summary, p_context);
end; $$;

create or replace function public._ahostbp368_positioning() returns text language sql immutable as $$
  select 'Growth through trust.'; $$;

create or replace function public._ahostbp368_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'local_regulation_intelligence', 'label', 'Local Regulation Intelligence Center', 'description', 'Regulatory reminders, permit tracking, compliance checklists — recommendations only.'),
    jsonb_build_object('key', 'property_compliance_dashboard', 'label', 'Property Compliance Dashboard', 'description', 'Registration, safety, insurance, emergency contacts, policy completion status.'),
    jsonb_build_object('key', 'neighborhood_relationship_center', 'label', 'Neighborhood Relationship Center', 'description', 'Noise incidents, community concerns, resolution documentation, preventive actions.'),
    jsonb_build_object('key', 'house_rule_enforcement', 'label', 'House Rule Enforcement Assistant', 'description', 'Rule confirmations, reminders, violation documentation, escalation procedures.'),
    jsonb_build_object('key', 'safety_operations_center', 'label', 'Safety Operations Center', 'description', 'Smoke/CO checks, emergency exits, first aid, fire extinguisher inspections.'),
    jsonb_build_object('key', 'insurance_readiness', 'label', 'Insurance Readiness Engine', 'description', 'Document references, renewal reminders, incident documentation, claims guidance.'),
    jsonb_build_object('key', 'operational_ethics', 'label', 'Operational Ethics Engine', 'description', 'Responsible practices — respect guests, neighbors, employees, communities.'),
    jsonb_build_object('key', 'trust_score_dashboard', 'label', 'Trust Score Dashboard', 'description', 'Safety rates, incident response, community concerns, compliance readiness.'),
    jsonb_build_object('key', 'executive_governance_center', 'label', 'Executive Governance Center', 'description', 'Board reporting, portfolio oversight, risk summaries.'),
    jsonb_build_object('key', 'responsible_hospitality_knowledge', 'label', 'Responsible Hospitality Knowledge Center', 'description', 'Regulatory awareness, safety, community, ethics, governance excellence.')
  ); $$;

create or replace function public._ahostbp368_compliance_areas() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'registration', 'label', 'Registration requirements'),
    jsonb_build_object('key', 'safety', 'label', 'Safety inspections'),
    jsonb_build_object('key', 'insurance', 'label', 'Insurance documentation'),
    jsonb_build_object('key', 'emergency', 'label', 'Emergency contact information'),
    jsonb_build_object('key', 'policy', 'label', 'Internal policy completion')
  ); $$;

create or replace function public._ahostbp368_house_rule_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Noise expectations', 'Smoking policies', 'Visitor limitations', 'Parking guidance', 'Waste disposal guidance'
  ); $$;

create or replace function public._ahostbp368_safety_areas() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Smoke detector checks', 'Carbon monoxide checks', 'Emergency exit documentation',
    'First aid availability', 'Fire extinguisher inspections'
  ); $$;

create or replace function public._ahostbp368_ethics_principles() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Respect guests', 'Respect neighbors', 'Respect employees', 'Respect local communities', 'Operate transparently'
  ); $$;

create or replace function public._ahostbp368_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recommendations only. Legal responsibility remains with the host. All compliance acknowledgements, safety completions, and governance actions are audit logged.',
    'approval_required', true,
    'audit_required', true,
    'recommendations_only', true
  ); $$;

create or replace function public._ahostbp368_success_metrics() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'incidents', 'label', 'Fewer preventable incidents'),
    jsonb_build_object('key', 'community', 'label', 'Improved community relationships'),
    jsonb_build_object('key', 'safety', 'label', 'Higher safety completion rates'),
    jsonb_build_object('key', 'transparency', 'label', 'Better operational transparency'),
    jsonb_build_object('key', 'compliance', 'label', 'Reduced compliance oversights'),
    jsonb_build_object('key', 'trust', 'label', 'Increased organizational trust')
  ); $$;

create or replace function public._ahostbp368_knowledge_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Regulatory awareness', 'Safety standards', 'Community relationships',
    'Incident preparedness', 'Hospitality ethics', 'Governance excellence'
  ); $$;

create or replace function public._ahosttrust_snapshot(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then jsonb_build_object(
    'trust_score', 0,
    'compliance_ready_pct', 0,
    'safety_completion_pct', 0,
    'attention_required', 0,
    'action_overdue', 0,
    'community_concerns', 0
  ) else jsonb_build_object(
    'trust_score', least(95, 72 + p_property_count * 3),
    'compliance_ready_pct', least(92, 68 + p_property_count * 2),
    'safety_completion_pct', least(98, 75 + p_property_count * 2),
    'attention_required', case when p_property_count >= 2 then 2 else 1 end,
    'action_overdue', case when p_property_count >= 3 then 1 else 0 end,
    'community_concerns', case when p_property_count >= 2 then 1 else 0 end
  ) end; $$;

create or replace function public._ahosttrust_regulatory_alerts(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'registration', 'label', 'Rental registration expires in 45 days', 'status', 'attention_required'),
    jsonb_build_object('key', 'fire_safety', 'label', 'Fire safety documentation requires review', 'status', 'attention_required'),
    jsonb_build_object('key', 'noise', 'label', 'Property received repeated late-night noise complaints', 'status', 'action_overdue', 'suggestion', 'Review house rules and guest communication')
  ) end; $$;

create or replace function public.get_aipify_hosts_trust_compliance_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_trust public.aipify_hosts_trust_settings;
  v_props int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_trust := public._ahosttrust_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_trust.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', greatest(v_hosts.property_count, v_props),
    'human_oversight_required', true,
    'positioning', public._ahostbp368_positioning(),
    'route', '/app/aipify-hosts/trust-compliance'
  );
end; $$;

create or replace function public.get_aipify_hosts_trust_compliance_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_trust public.aipify_hosts_trust_settings;
  v_props int;
  v_prop_count int;
  v_snapshot jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_trust := public._ahosttrust_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  v_prop_count := greatest(v_hosts.property_count, v_props);
  v_snapshot := public._ahosttrust_snapshot(v_prop_count);
  perform public._ahosttrust_log_audit(v_tenant_id, 'dashboard_view', 'Trust & compliance dashboard viewed', jsonb_build_object('package', v_hosts.package_key));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_trust.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', v_prop_count,
    'human_oversight_required', true,
    'positioning', public._ahostbp368_positioning(),
    'vision', 'Sustainable growth is built on trust — responsibility, transparency, community impact, and regulatory readiness.',
    'modules', public._ahostbp368_modules(),
    'compliance_areas', public._ahostbp368_compliance_areas(),
    'house_rule_categories', public._ahostbp368_house_rule_categories(),
    'safety_areas', public._ahostbp368_safety_areas(),
    'ethics_principles', public._ahostbp368_ethics_principles(),
    'governance', public._ahostbp368_governance(),
    'success_metrics', public._ahostbp368_success_metrics(),
    'knowledge_categories', public._ahostbp368_knowledge_categories(),
    'trust_snapshot', v_snapshot,
    'regulatory_alerts', public._ahosttrust_regulatory_alerts(v_prop_count),
    'executive_metrics', jsonb_build_array(
      jsonb_build_object('key', 'trust_score', 'label', 'Trust Score', 'value', v_snapshot->>'trust_score'),
      jsonb_build_object('key', 'compliance_ready', 'label', 'Compliance readiness', 'value', (v_snapshot->>'compliance_ready_pct') || '%'),
      jsonb_build_object('key', 'safety_completion', 'label', 'Safety completion rate', 'value', (v_snapshot->>'safety_completion_pct') || '%'),
      jsonb_build_object('key', 'attention_required', 'label', 'Items requiring attention', 'value', v_snapshot->>'attention_required')
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 05 — Trust, Compliance & Neighborhood Intelligence',
      'doc', 'aipify-hosts/PHASE_AIRBNB_05_TRUST_AND_COMPLIANCE.text',
      'route', '/app/aipify-hosts/trust-compliance'
    )
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-trust-compliance', 'Aipify Hosts Trust & Compliance', 'Regulatory readiness, safety, neighborhood relations, and responsible hospitality.', 'authenticated', 221
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-trust-compliance' and tenant_id is null);

grant execute on function public.get_aipify_hosts_trust_compliance_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_trust_compliance_dashboard(uuid) to authenticated;
