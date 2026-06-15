-- Phase 276 — Product Roadmap & Idea Management Engine

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.product_roadmap_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'improvement' check (
    category in (
      'new_feature', 'improvement', 'technical_debt', 'security_enhancement',
      'customer_request', 'growth_opportunity', 'strategic_initiative'
    )
  ),
  source text not null default 'internal_product' check (
    source in (
      'customer_feedback', 'super_admin', 'platform_admin', 'growth_partner',
      'support_team', 'internal_product', 'executive_review'
    )
  ),
  roadmap_view text not null default 'under_consideration' check (
    roadmap_view in ('now', 'next', 'later', 'under_consideration', 'completed')
  ),
  strategic_value text not null default 'medium' check (
    strategic_value in ('critical', 'high', 'medium', 'low')
  ),
  customer_impact text not null default 'medium' check (
    customer_impact in ('critical', 'high', 'medium', 'low')
  ),
  estimated_effort text not null default 'medium' check (
    estimated_effort in ('xs', 'small', 'medium', 'large', 'xl')
  ),
  priority text not null default 'medium' check (
    priority in ('critical', 'high', 'medium', 'low', 'future_consideration')
  ),
  status text not null default 'new' check (
    status in (
      'new', 'under_review', 'approved', 'planned', 'in_development',
      'testing', 'released', 'declined'
    )
  ),
  owner text not null default '',
  target_release text not null default '',
  release_window text not null default '',
  related_phases text[] not null default '{}'::text[],
  score_customer_demand integer not null default 50 check (score_customer_demand between 0 and 100),
  score_revenue_potential integer not null default 50 check (score_revenue_potential between 0 and 100),
  score_strategic_alignment integer not null default 50 check (score_strategic_alignment between 0 and 100),
  score_implementation_complexity integer not null default 50 check (score_implementation_complexity between 0 and 100),
  score_risk_reduction integer not null default 50 check (score_risk_reduction between 0 and 100),
  score_competitive_advantage integer not null default 50 check (score_competitive_advantage between 0 and 100),
  composite_score integer not null default 50 check (composite_score between 0 and 100),
  deferred boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  released_at timestamptz
);

create index if not exists product_roadmap_items_status_idx
  on public.product_roadmap_items (status, priority, roadmap_view);

create index if not exists product_roadmap_items_view_idx
  on public.product_roadmap_items (roadmap_view, updated_at desc);

create table if not exists public.product_roadmap_request_links (
  id uuid primary key default gen_random_uuid(),
  roadmap_item_id uuid not null references public.product_roadmap_items (id) on delete cascade,
  request_source text not null check (
    request_source in ('customer_feedback', 'enterprise', 'growth_partner')
  ),
  request_id uuid,
  request_label text not null default '',
  company_name text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists product_roadmap_request_links_item_idx
  on public.product_roadmap_request_links (roadmap_item_id);

create table if not exists public.product_roadmap_release_communications (
  id uuid primary key default gen_random_uuid(),
  roadmap_item_id uuid not null references public.product_roadmap_items (id) on delete cascade,
  channel text not null check (
    channel in ('release_notes', 'customer_announcement', 'in_app_notification')
  ),
  status text not null default 'pending' check (status in ('pending', 'published', 'skipped')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists product_roadmap_release_item_idx
  on public.product_roadmap_release_communications (roadmap_item_id, channel);

create table if not exists public.product_roadmap_audit_logs (
  id uuid primary key default gen_random_uuid(),
  roadmap_item_id uuid references public.product_roadmap_items (id) on delete set null,
  event_type text not null check (
    event_type in (
      'idea_created', 'priority_changed', 'status_updated', 'roadmap_released',
      'customer_linkage_modified', 'roadmap_view_changed', 'release_communication_published'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists product_roadmap_audit_created_idx
  on public.product_roadmap_audit_logs (created_at desc);

alter table public.product_roadmap_items enable row level security;
alter table public.product_roadmap_request_links enable row level security;
alter table public.product_roadmap_release_communications enable row level security;
alter table public.product_roadmap_audit_logs enable row level security;

revoke all on public.product_roadmap_items from authenticated, anon;
revoke all on public.product_roadmap_request_links from authenticated, anon;
revoke all on public.product_roadmap_release_communications from authenticated, anon;
revoke all on public.product_roadmap_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._prim276_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._prim276_log_audit(
  p_item_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.product_roadmap_audit_logs (roadmap_item_id, event_type, summary, context)
  values (p_item_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._prim276_composite_score(
  p_demand int, p_revenue int, p_alignment int,
  p_complexity int, p_risk int, p_competitive int
)
returns integer
language sql
immutable
as $$
  select greatest(0, least(100, round(
    (
      p_demand * 0.25 + p_revenue * 0.2 + p_alignment * 0.2 +
      (100 - p_complexity) * 0.15 + p_risk * 0.1 + p_competitive * 0.1
    )::numeric
  )::int));
$$;

create or replace function public._prim276_build_item_row(p_item public.product_roadmap_items)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_links jsonb;
  v_link_count integer;
  v_enterprise_count integer;
  v_partner_count integer;
begin
  select count(*)::int,
         count(*) filter (where request_source = 'enterprise')::int,
         count(*) filter (where request_source = 'growth_partner')::int
  into v_link_count, v_enterprise_count, v_partner_count
  from public.product_roadmap_request_links
  where roadmap_item_id = p_item.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'request_source', l.request_source,
    'request_label', l.request_label,
    'company_name', l.company_name
  ) order by l.created_at), '[]'::jsonb)
  into v_links
  from public.product_roadmap_request_links l
  where l.roadmap_item_id = p_item.id;

  return jsonb_build_object(
    'id', p_item.id,
    'title', p_item.title,
    'description', p_item.description,
    'category', p_item.category,
    'source', p_item.source,
    'roadmap_view', p_item.roadmap_view,
    'strategic_value', p_item.strategic_value,
    'customer_impact', p_item.customer_impact,
    'estimated_effort', p_item.estimated_effort,
    'priority', p_item.priority,
    'status', p_item.status,
    'owner', p_item.owner,
    'target_release', p_item.target_release,
    'release_window', p_item.release_window,
    'related_phases', to_jsonb(p_item.related_phases),
    'scores', jsonb_build_object(
      'customer_demand', p_item.score_customer_demand,
      'revenue_potential', p_item.score_revenue_potential,
      'strategic_alignment', p_item.score_strategic_alignment,
      'implementation_complexity', p_item.score_implementation_complexity,
      'risk_reduction', p_item.score_risk_reduction,
      'competitive_advantage', p_item.score_competitive_advantage,
      'composite', p_item.composite_score
    ),
    'deferred', p_item.deferred,
    'supporting_requests', v_link_count,
    'enterprise_requests', v_enterprise_count,
    'growth_partner_requests', v_partner_count,
    'request_links', v_links,
    'created_at', p_item.created_at,
    'updated_at', p_item.updated_at,
    'released_at', p_item.released_at
  );
end;
$$;

create or replace function public._prim276_seed_if_empty()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.product_roadmap_items limit 1) then return; end if;

  insert into public.product_roadmap_items (
    title, description, category, source, roadmap_view, priority, status,
    owner, target_release, release_window, related_phases,
    score_customer_demand, score_revenue_potential, score_strategic_alignment,
    score_implementation_complexity, score_risk_reduction, score_competitive_advantage,
    composite_score, customer_impact, strategic_value, estimated_effort
  ) values
    (
      'Unified Customer Journey Dashboard',
      'Consolidate lifecycle, health, and journey analytics into a single platform view.',
      'new_feature', 'customer_feedback', 'now', 'high', 'in_development',
      'Product Team', 'Q2 2026', '2026-H1', array['275', '276'],
      85, 70, 90, 55, 40, 75, 78, 'high', 'high', 'large'
    ),
    (
      'Roadmap Center & Idea Management',
      'Structured intake, prioritization, and release tracking for product initiatives.',
      'strategic_initiative', 'internal_product', 'now', 'critical', 'testing',
      'Platform Product', 'Q2 2026', '2026-H1', array['276'],
      60, 55, 95, 45, 30, 65, 72, 'medium', 'critical', 'medium'
    ),
    (
      'Payment Health Alert Refinements',
      'Reduce false positives in payment health monitoring for enterprise tenants.',
      'improvement', 'support_team', 'next', 'medium', 'planned',
      'Billing Squad', 'Q3 2026', '2026-H2', array[]::text[],
      70, 65, 60, 35, 80, 50, 68, 'high', 'medium', 'small'
    ),
    (
      'Legacy API Deprecation Cleanup',
      'Remove deprecated install API endpoints after migration window closes.',
      'technical_debt', 'platform_admin', 'later', 'low', 'approved',
      'Engineering', 'Q4 2026', '2026-H2', array[]::text[],
      20, 15, 50, 70, 60, 20, 38, 'low', 'low', 'medium'
    ),
    (
      'Enterprise SSO Hardening',
      'Additional audit logging and session controls for enterprise SSO flows.',
      'security_enhancement', 'executive_review', 'next', 'high', 'under_review',
      'Trust Team', 'Q3 2026', '2026-H2', array[]::text[],
      55, 80, 85, 60, 95, 70, 76, 'high', 'high', 'large'
    ),
    (
      'Growth Partner Onboarding Wizard',
      'Guided onboarding for new growth partners with certification checkpoints.',
      'growth_opportunity', 'growth_partner', 'under_consideration', 'medium', 'new',
      'Partner Ops', 'TBD', '2026-H2', array[]::text[],
      45, 75, 70, 50, 25, 80, 62, 'medium', 'high', 'large'
    ),
    (
      'Share Feedback Widget Enhancements',
      'Contextual feedback prompts tied to active workspace modules.',
      'customer_request', 'customer_feedback', 'completed', 'medium', 'released',
      'Product Team', 'Q1 2026', '2026-H1', array['273'],
      90, 50, 75, 30, 20, 55, 70, 'high', 'medium', 'small'
    );

  insert into public.product_roadmap_request_links (roadmap_item_id, request_source, request_label, company_name)
  select i.id, 'customer_feedback', 'Unified analytics view request', 'Pilot Customer'
  from public.product_roadmap_items i where i.title like 'Unified Customer%';

  insert into public.product_roadmap_request_links (roadmap_item_id, request_source, request_label, company_name)
  select i.id, 'enterprise', 'Enterprise SSO audit requirements', 'Enterprise Tenant'
  from public.product_roadmap_items i where i.title like 'Enterprise SSO%';

  insert into public.product_roadmap_request_links (roadmap_item_id, request_source, request_label, company_name)
  select i.id, 'growth_partner', 'Partner onboarding simplification', 'Growth Partner'
  from public.product_roadmap_items i where i.title like 'Growth Partner%';

  insert into public.product_roadmap_audit_logs (event_type, summary)
  values
    ('idea_created', 'Product Roadmap Center initialized with seed initiatives.'),
    ('status_updated', 'Roadmap scoring framework activated.');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_product_roadmap_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_items jsonb;
  v_views jsonb;
  v_audit jsonb;
  v_category text;
  v_priority text;
  v_status text;
  v_source text;
  v_view text;
  v_release_window text;
begin
  perform public._prim276_require_platform_admin();
  perform public._prim276_seed_if_empty();

  v_category := nullif(p_filters->>'category', '');
  v_priority := nullif(p_filters->>'priority', '');
  v_status := nullif(p_filters->>'status', '');
  v_source := nullif(p_filters->>'source', '');
  v_view := nullif(p_filters->>'roadmap_view', '');
  v_release_window := nullif(p_filters->>'release_window', '');

  v_overview := jsonb_build_object(
    'planned_initiatives', (select count(*)::int from public.product_roadmap_items where status in ('planned', 'approved')),
    'in_development', (select count(*)::int from public.product_roadmap_items where status = 'in_development'),
    'ready_for_release', (select count(*)::int from public.product_roadmap_items where status = 'testing'),
    'customer_requested_features', (select count(*)::int from public.product_roadmap_items where category = 'customer_request' and status <> 'declined'),
    'recently_completed', (select count(*)::int from public.product_roadmap_items where status = 'released' and released_at >= now() - interval '90 days'),
    'deferred_items', (select count(*)::int from public.product_roadmap_items where deferred = true or priority = 'future_consideration')
  );

  v_views := jsonb_build_array(
    jsonb_build_object('key', 'now', 'count', (select count(*) from public.product_roadmap_items where roadmap_view = 'now')),
    jsonb_build_object('key', 'next', 'count', (select count(*) from public.product_roadmap_items where roadmap_view = 'next')),
    jsonb_build_object('key', 'later', 'count', (select count(*) from public.product_roadmap_items where roadmap_view = 'later')),
    jsonb_build_object('key', 'under_consideration', 'count', (select count(*) from public.product_roadmap_items where roadmap_view = 'under_consideration')),
    jsonb_build_object('key', 'completed', 'count', (select count(*) from public.product_roadmap_items where roadmap_view = 'completed'))
  );

  select coalesce(jsonb_agg(public._prim276_build_item_row(i) order by
    case i.priority
      when 'critical' then 1 when 'high' then 2 when 'medium' then 3 when 'low' then 4 else 5
    end,
    i.composite_score desc
  ), '[]'::jsonb)
  into v_items
  from public.product_roadmap_items i
  where (v_category is null or i.category = v_category)
    and (v_priority is null or i.priority = v_priority)
    and (v_status is null or i.status = v_status)
    and (v_source is null or i.source = v_source)
    and (v_view is null or i.roadmap_view = v_view)
    and (v_release_window is null or i.release_window = v_release_window);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'roadmap_item_id', l.roadmap_item_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.product_roadmap_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'The best product roadmaps are shaped by customer needs, strategic thinking, and disciplined execution.',
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'roadmap_views', v_views,
    'items', v_items,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_product_roadmap_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_item_id uuid;
  v_item public.product_roadmap_items;
  v_scores jsonb;
  v_composite integer;
  v_channel text;
begin
  perform public._prim276_require_platform_admin();

  v_action := p_payload->>'action';
  v_item_id := (p_payload->>'id')::uuid;

  case v_action
    when 'create_idea' then
      v_scores := coalesce(p_payload->'scores', '{}'::jsonb);
      v_composite := public._prim276_composite_score(
        coalesce((v_scores->>'customer_demand')::int, 50),
        coalesce((v_scores->>'revenue_potential')::int, 50),
        coalesce((v_scores->>'strategic_alignment')::int, 50),
        coalesce((v_scores->>'implementation_complexity')::int, 50),
        coalesce((v_scores->>'risk_reduction')::int, 50),
        coalesce((v_scores->>'competitive_advantage')::int, 50)
      );
      insert into public.product_roadmap_items (
        title, description, category, source, roadmap_view, priority, status,
        owner, target_release, release_window, related_phases,
        strategic_value, customer_impact, estimated_effort,
        score_customer_demand, score_revenue_potential, score_strategic_alignment,
        score_implementation_complexity, score_risk_reduction, score_competitive_advantage,
        composite_score
      ) values (
        coalesce(p_payload->>'title', 'New initiative'),
        coalesce(p_payload->>'description', ''),
        coalesce(p_payload->>'category', 'improvement'),
        coalesce(p_payload->>'source', 'internal_product'),
        coalesce(p_payload->>'roadmap_view', 'under_consideration'),
        coalesce(p_payload->>'priority', 'medium'),
        'new',
        coalesce(p_payload->>'owner', ''),
        coalesce(p_payload->>'target_release', ''),
        coalesce(p_payload->>'release_window', ''),
        coalesce(
          (select array_agg(value) from jsonb_array_elements_text(coalesce(p_payload->'related_phases', '[]'::jsonb))),
          array[]::text[]
        ),
        coalesce(p_payload->>'strategic_value', 'medium'),
        coalesce(p_payload->>'customer_impact', 'medium'),
        coalesce(p_payload->>'estimated_effort', 'medium'),
        coalesce((v_scores->>'customer_demand')::int, 50),
        coalesce((v_scores->>'revenue_potential')::int, 50),
        coalesce((v_scores->>'strategic_alignment')::int, 50),
        coalesce((v_scores->>'implementation_complexity')::int, 50),
        coalesce((v_scores->>'risk_reduction')::int, 50),
        coalesce((v_scores->>'competitive_advantage')::int, 50),
        v_composite
      )
      returning * into v_item;
      perform public._prim276_log_audit(v_item.id, 'idea_created', 'Roadmap idea created.', p_payload);
      v_item_id := v_item.id;

    when 'update_status' then
      update public.product_roadmap_items set
        status = coalesce(p_payload->>'status', status),
        roadmap_view = case
          when coalesce(p_payload->>'status', status) = 'released' then 'completed'
          else roadmap_view
        end,
        released_at = case
          when coalesce(p_payload->>'status', status) = 'released' then now()
          else released_at
        end,
        updated_at = now()
      where id = v_item_id;
      perform public._prim276_log_audit(
        v_item_id, 'status_updated',
        coalesce(p_payload->>'summary', 'Roadmap status updated.'), p_payload
      );

    when 'update_priority' then
      update public.product_roadmap_items set
        priority = coalesce(p_payload->>'priority', priority),
        deferred = coalesce(p_payload->>'priority', priority) = 'future_consideration',
        updated_at = now()
      where id = v_item_id;
      perform public._prim276_log_audit(
        v_item_id, 'priority_changed',
        coalesce(p_payload->>'summary', 'Roadmap priority changed.'), p_payload
      );

    when 'update_roadmap_view' then
      update public.product_roadmap_items set
        roadmap_view = coalesce(p_payload->>'roadmap_view', roadmap_view),
        updated_at = now()
      where id = v_item_id;
      perform public._prim276_log_audit(
        v_item_id, 'roadmap_view_changed',
        coalesce(p_payload->>'summary', 'Roadmap view updated.'), p_payload
      );

    when 'link_customer_request' then
      insert into public.product_roadmap_request_links (
        roadmap_item_id, request_source, request_id, request_label, company_name
      ) values (
        v_item_id,
        coalesce(p_payload->>'request_source', 'customer_feedback'),
        (p_payload->>'request_id')::uuid,
        coalesce(p_payload->>'request_label', 'Customer request'),
        coalesce(p_payload->>'company_name', '')
      );
      perform public._prim276_log_audit(
        v_item_id, 'customer_linkage_modified',
        coalesce(p_payload->>'summary', 'Customer request linked to roadmap item.'), p_payload
      );

    when 'publish_release' then
      update public.product_roadmap_items set
        status = 'released',
        roadmap_view = 'completed',
        released_at = now(),
        updated_at = now()
      where id = v_item_id;

      foreach v_channel in array coalesce(
        (select array_agg(value) from jsonb_array_elements_text(coalesce(p_payload->'channels', '[]'::jsonb))),
        array['release_notes']::text[]
      )
      loop
        insert into public.product_roadmap_release_communications (roadmap_item_id, channel, status, published_at)
        values (v_item_id, v_channel, 'published', now());
        perform public._prim276_log_audit(
          v_item_id, 'release_communication_published',
          format('Release published via %s.', v_channel),
          jsonb_build_object('channel', v_channel)
        );
      end loop;

      perform public._prim276_log_audit(
        v_item_id, 'roadmap_released',
        coalesce(p_payload->>'summary', 'Roadmap item released.'), p_payload
      );

    when 'decline' then
      update public.product_roadmap_items set
        status = 'declined',
        updated_at = now()
      where id = v_item_id;
      perform public._prim276_log_audit(
        v_item_id, 'status_updated',
        coalesce(p_payload->>'summary', 'Roadmap item declined.'), p_payload
      );

    else
      raise exception 'Invalid action';
  end case;

  return public.get_product_roadmap_center(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_product_roadmap_center(jsonb) to authenticated;
grant execute on function public.record_product_roadmap_action(jsonb) to authenticated;
