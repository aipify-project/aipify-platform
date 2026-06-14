-- Phase A.31 — Strategic Intelligence Foundation Engine

create table if not exists public.strategic_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category text not null check (category in ('efficiency', 'support', 'knowledge', 'governance', 'quality', 'adoption', 'security', 'growth')),
  title text not null,
  summary text not null,
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high', 'critical')),
  confidence_score int not null default 70 check (confidence_score between 0 and 100),
  recommended_action text,
  status text not null default 'new' check (status in ('new', 'acknowledged', 'planned', 'completed', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.strategic_insights enable row level security;
revoke all on public.strategic_insights from authenticated, anon;

create table if not exists public.strategic_insight_recommendations (
  id uuid primary key default gen_random_uuid(),
  insight_id uuid not null references public.strategic_insights (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  business_context text,
  expected_outcome text,
  implementation_effort text not null default 'medium' check (implementation_effort in ('low', 'medium', 'high')),
  urgency_level text not null default 'medium' check (urgency_level in ('low', 'medium', 'high', 'critical')),
  success_indicators jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.strategic_insight_recommendations enable row level security;
revoke all on public.strategic_insight_recommendations from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'strategic_intelligence', v.description
from (values
  ('intelligence.view', 'View Intelligence', 'View strategic insights'),
  ('intelligence.manage', 'Manage Intelligence', 'Generate and manage insights'),
  ('intelligence.dismiss', 'Dismiss Intelligence', 'Dismiss strategic insights'),
  ('intelligence.export', 'Export Intelligence', 'Export strategic reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

create or replace function public._sif_log(
  p_organization_id uuid, p_action_type text, p_entity_type text default 'strategic_intelligence',
  p_entity_id uuid default null, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata);
end; $$;

create or replace function public._sif_generate_insights(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_open_support int; v_quality int; v_adoption int;
begin
  select count(*) into v_open_support from public.organization_support_cases
  where organization_id = p_organization_id and status in ('open', 'escalated');
  if v_open_support > 5 and not exists (
    select 1 from public.strategic_insights where organization_id = p_organization_id and title like 'Support backlog%' and status not in ('dismissed', 'completed')
  ) then
    insert into public.strategic_insights (organization_id, category, title, summary, impact_level, confidence_score, recommended_action)
    values (p_organization_id, 'support', 'Support backlog increasing', format('%s open support cases may indicate workflow strain.', v_open_support), 'high', 75, 'Review support triage and escalation thresholds');
  end if;

  select count(*) into v_quality from public.quality_checks
  where organization_id = p_organization_id and status = 'open';
  if v_quality > 3 and not exists (
    select 1 from public.strategic_insights where organization_id = p_organization_id and category = 'quality' and status = 'new' limit 1
  ) then
    insert into public.strategic_insights (organization_id, category, title, summary, impact_level, confidence_score, recommended_action)
    values (p_organization_id, 'quality', 'Quality alerts need attention', format('%s open quality findings detected.', v_quality), 'medium', 68, 'Prioritize quality guardian recommendations');
  end if;

  if exists (select 1 from public.organization_customer_success where organization_id = p_organization_id and adoption_score < 50) then
    insert into public.strategic_insights (organization_id, category, title, summary, impact_level, confidence_score, recommended_action, status)
    select p_organization_id, 'adoption', 'Low adoption opportunity', 'Module adoption below target — expansion opportunity identified.', 'high', 72, 'Activate underused modules and run onboarding playbook', 'new'
    where not exists (select 1 from public.strategic_insights where organization_id = p_organization_id and category = 'adoption' and status not in ('dismissed', 'completed') limit 1);
  end if;
end; $$;

create or replace function public.dismiss_strategic_insight(p_insight_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('intelligence.dismiss');
  v_org_id := public._mta_require_organization();
  update public.strategic_insights set status = 'dismissed', updated_at = now()
  where id = p_insight_id and organization_id = v_org_id;
  perform public._sif_log(v_org_id, 'insight_dismissed', 'strategic_insight', p_insight_id, '{}'::jsonb);
  return jsonb_build_object('id', p_insight_id, 'status', 'dismissed');
end; $$;

create or replace function public.run_strategic_intelligence_scan()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('intelligence.manage');
  v_org_id := public._mta_require_organization();
  perform public._sif_generate_insights(v_org_id);
  return jsonb_build_object('scanned', true);
end; $$;

create or replace function public.get_strategic_intelligence_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._sif_generate_insights(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Proactive strategic intelligence from operational data — humans decide, Aipify informs.',
    'principles', jsonb_build_array('Explainable recommendations', 'Human-centered decision support', 'Data-driven insights', 'Opportunity and risk detection', 'Metadata only'),
    'summary', jsonb_build_object(
      'new_insights', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'new'), 0),
      'high_impact', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and impact_level in ('high', 'critical') and status not in ('dismissed', 'completed')), 0),
      'completed', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'completed'), 0)
    ),
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, i.created_at desc)
      from public.strategic_insights i where i.organization_id = v_org_id and i.status != 'dismissed'
    ), '[]'::jsonb),
    'priorities', coalesce((
      select jsonb_agg(row_to_json(i) order by i.confidence_score desc)
      from public.strategic_insights i where i.organization_id = v_org_id and i.status in ('new', 'acknowledged', 'planned') limit 5
    ), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_strategic_intelligence_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'new_insights', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'new'), 0),
    'philosophy', 'From reactive to proactive planning.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-intelligence-foundation-engine', 'Strategic Intelligence Foundation', 'Strategic insights, risks, and opportunities.', 'authenticated', 73
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'strategic-intelligence-foundation-engine' and tenant_id is null);

grant execute on function public.get_strategic_intelligence_foundation_engine_dashboard() to authenticated;
grant execute on function public.get_strategic_intelligence_foundation_engine_card() to authenticated;
grant execute on function public.dismiss_strategic_insight(uuid) to authenticated;
grant execute on function public.run_strategic_intelligence_scan() to authenticated;
