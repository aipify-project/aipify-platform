-- Phase 540 — Universal Knowledge Graph, Relationship Engine & Organizational Memory
-- Connect everything. One graph. One organizational memory.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  relationship_explorer_enabled boolean not null default true,
  dependency_mapping_enabled boolean not null default true,
  impact_analysis_enabled boolean not null default true,
  decision_history_enabled boolean not null default true,
  companion_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_knowledge_graph_settings enable row level security;
revoke all on public.organization_knowledge_graph_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Entities
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_type text not null check (
    entity_type in (
      'customer', 'employee', 'supplier', 'partner', 'domain', 'project', 'task',
      'document', 'invoice', 'contract', 'asset', 'inventory_item', 'meeting',
      'business_pack', 'workflow', 'approval', 'department', 'team'
    )
  ),
  entity_key text not null default '',
  title text not null,
  summary text not null default '',
  status text not null default 'active',
  source_table text,
  source_id uuid,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  department_id uuid references public.organization_departments (id) on delete set null,
  record_href text not null default '/app/knowledge-graph',
  connection_count integer not null default 0 check (connection_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_type, entity_key, title)
);

create index if not exists organization_knowledge_graph_entities_org_type_idx
  on public.organization_knowledge_graph_entities (organization_id, entity_type, updated_at desc);
create index if not exists organization_knowledge_graph_entities_org_title_idx
  on public.organization_knowledge_graph_entities (organization_id, lower(title));

alter table public.organization_knowledge_graph_entities enable row level security;
revoke all on public.organization_knowledge_graph_entities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Relationships
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_relationships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  from_entity_id uuid not null references public.organization_knowledge_graph_entities (id) on delete cascade,
  to_entity_id uuid not null references public.organization_knowledge_graph_entities (id) on delete cascade,
  relationship_type text not null check (
    relationship_type in (
      'owns', 'assigned_to', 'provides', 'generated', 'depends_on', 'linked_to',
      'approved_by', 'managed_by', 'part_of', 'supports', 'supplies', 'hosts',
      'installed_on', 'created_by', 'related_to'
    )
  ),
  label text not null default '',
  strength text not null default 'moderate' check (strength in ('weak', 'moderate', 'strong', 'critical')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, from_entity_id, to_entity_id, relationship_type)
);

create index if not exists organization_knowledge_graph_relationships_org_idx
  on public.organization_knowledge_graph_relationships (organization_id, from_entity_id);

alter table public.organization_knowledge_graph_relationships enable row level security;
revoke all on public.organization_knowledge_graph_relationships from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Dependencies
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_id uuid not null references public.organization_knowledge_graph_entities (id) on delete cascade,
  depends_on_entity_id uuid not null references public.organization_knowledge_graph_entities (id) on delete cascade,
  dependency_type text not null check (
    dependency_type in ('business', 'technical', 'supplier', 'employee', 'financial', 'operational')
  ),
  impact_level text not null default 'moderate' check (impact_level in ('low', 'moderate', 'high', 'critical')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, entity_id, depends_on_entity_id, dependency_type)
);

alter table public.organization_knowledge_graph_dependencies enable row level security;
revoke all on public.organization_knowledge_graph_dependencies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Organizational memory records
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_memory_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_id uuid references public.organization_knowledge_graph_entities (id) on delete set null,
  memory_type text not null check (
    memory_type in (
      'decision', 'approval', 'change', 'assignment', 'escalation', 'closure',
      'lesson_learned', 'context', 'historical_note'
    )
  ),
  title text not null,
  summary text not null default '',
  reason text,
  participants jsonb not null default '[]'::jsonb,
  outcome text,
  lessons_learned text,
  occurred_at timestamptz not null default now(),
  actor_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_knowledge_graph_memory_org_idx
  on public.organization_knowledge_graph_memory_records (organization_id, occurred_at desc);

alter table public.organization_knowledge_graph_memory_records enable row level security;
revoke all on public.organization_knowledge_graph_memory_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Decision history
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_id uuid references public.organization_knowledge_graph_entities (id) on delete set null,
  decision_title text not null,
  reason text not null default '',
  participants jsonb not null default '[]'::jsonb,
  approvals jsonb not null default '[]'::jsonb,
  outcome text,
  lessons_learned text,
  decided_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_knowledge_graph_decisions enable row level security;
revoke all on public.organization_knowledge_graph_decisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Timeline events
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_timeline_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_id uuid references public.organization_knowledge_graph_entities (id) on delete set null,
  event_type text not null check (
    event_type in ('created', 'updated', 'approved', 'assigned', 'changed', 'escalated', 'closed')
  ),
  title text not null,
  summary text not null default '',
  actor_user_id uuid references public.users (id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists organization_knowledge_graph_timeline_org_idx
  on public.organization_knowledge_graph_timeline_events (organization_id, occurred_at desc);

alter table public.organization_knowledge_graph_timeline_events enable row level security;
revoke all on public.organization_knowledge_graph_timeline_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_graph_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_knowledge_graph_audit_org_idx
  on public.organization_knowledge_graph_audit_logs (organization_id, created_at desc);

alter table public.organization_knowledge_graph_audit_logs enable row level security;
revoke all on public.organization_knowledge_graph_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._kgraph540_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._kgraph540_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_knowledge_graph_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._kgraph540_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_knowledge_graph_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._kgraph540_entity_json(r public.organization_knowledge_graph_entities)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'entity_type', r.entity_type, 'entity_key', r.entity_key,
    'title', r.title, 'summary', r.summary, 'status', r.status,
    'source_id', r.source_id, 'domain_id', r.domain_id, 'business_pack_key', r.business_pack_key,
    'record_href', r.record_href, 'connection_count', r.connection_count,
    'created_at', r.created_at, 'updated_at', r.updated_at
  );
$$;

create or replace function public._kgraph540_rel_json(r public.organization_knowledge_graph_relationships)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_from jsonb; v_to jsonb;
begin
  select public._kgraph540_entity_json(e) into v_from from public.organization_knowledge_graph_entities e where e.id = r.from_entity_id;
  select public._kgraph540_entity_json(e) into v_to from public.organization_knowledge_graph_entities e where e.id = r.to_entity_id;
  return jsonb_build_object(
    'id', r.id, 'relationship_type', r.relationship_type, 'label', r.label, 'strength', r.strength,
    'from_entity', v_from, 'to_entity', v_to, 'created_at', r.created_at
  );
end; $$;

create or replace function public._kgraph540_upsert_entity(
  p_org_id uuid, p_type text, p_key text, p_title text, p_summary text default '',
  p_source_id uuid default null, p_href text default '/app/knowledge-graph',
  p_pack text default null, p_domain uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.organization_knowledge_graph_entities (
    organization_id, entity_type, entity_key, title, summary, source_id, record_href, business_pack_key, domain_id
  ) values (
    p_org_id, p_type, p_key, p_title, p_summary, p_source_id, p_href, p_pack, p_domain
  )
  on conflict (organization_id, entity_type, entity_key, title) do update set
    summary = excluded.summary, updated_at = now(), source_id = coalesce(excluded.source_id, organization_knowledge_graph_entities.source_id)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._kgraph540_link(
  p_org_id uuid, p_from uuid, p_to uuid, p_type text, p_label text default '', p_strength text default 'moderate'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_from is null or p_to is null or p_from = p_to then return; end if;
  insert into public.organization_knowledge_graph_relationships (
    organization_id, from_entity_id, to_entity_id, relationship_type, label, strength
  ) values (p_org_id, p_from, p_to, p_type, coalesce(nullif(p_label, ''), p_type), p_strength)
  on conflict (organization_id, from_entity_id, to_entity_id, relationship_type) do nothing;
  update public.organization_knowledge_graph_entities set connection_count = connection_count + 1, updated_at = now()
  where id in (p_from, p_to);
end; $$;

create or replace function public._kgraph540_seed_graph(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_count int;
  v_customer uuid; v_contract uuid; v_employee uuid; v_project uuid;
  v_supplier uuid; v_domain uuid; v_pack uuid; v_invoice uuid;
begin
  select count(*) into v_count from public.organization_knowledge_graph_entities where organization_id = p_org_id;
  if v_count > 5 then return v_count; end if;

  v_customer := public._kgraph540_upsert_entity(p_org_id, 'customer', 'seed-1', 'Acme Corporation', 'Enterprise customer', null, '/app/customers');
  v_contract := public._kgraph540_upsert_entity(p_org_id, 'contract', 'seed-c1', 'Annual Service Agreement', 'Renewal in 90 days', null, '/app/customers');
  v_employee := public._kgraph540_upsert_entity(p_org_id, 'employee', 'seed-e1', 'Project Lead', 'Assigned to active projects', null, '/app/people');
  v_project := public._kgraph540_upsert_entity(p_org_id, 'project', 'seed-p1', 'Digital Transformation', 'Active strategic project', null, '/app/projects');
  v_supplier := public._kgraph540_upsert_entity(p_org_id, 'supplier', 'seed-s1', 'Nordic Supplies AS', 'Primary inventory supplier', null, '/app/procurement');
  v_domain := public._kgraph540_upsert_entity(p_org_id, 'domain', 'seed-d1', 'butikk.no', 'Commerce domain', null, '/app/domains');
  v_pack := public._kgraph540_upsert_entity(p_org_id, 'business_pack', 'commerce', 'Commerce Pack', 'Installed on butikk.no', null, '/app/store', 'commerce', null);
  v_invoice := public._kgraph540_upsert_entity(p_org_id, 'invoice', 'seed-i1', 'Invoice #1042', 'Outstanding payment', null, '/app/finance');

  perform public._kgraph540_link(p_org_id, v_customer, v_contract, 'owns', 'Owns', 'strong');
  perform public._kgraph540_link(p_org_id, v_customer, v_invoice, 'linked_to', 'Invoices', 'moderate');
  perform public._kgraph540_link(p_org_id, v_employee, v_project, 'assigned_to', 'Assigned To', 'strong');
  perform public._kgraph540_link(p_org_id, v_customer, v_project, 'linked_to', 'Projects', 'moderate');
  perform public._kgraph540_link(p_org_id, v_supplier, v_project, 'provides', 'Provides', 'moderate');
  perform public._kgraph540_link(p_org_id, v_domain, v_pack, 'installed_on', 'Installed on', 'critical');
  perform public._kgraph540_link(p_org_id, v_supplier, v_pack, 'supplies', 'Supplies', 'moderate');

  insert into public.organization_knowledge_graph_dependencies (
    organization_id, entity_id, depends_on_entity_id, dependency_type, impact_level, summary
  ) values
    (p_org_id, v_customer, v_contract, 'business', 'critical', 'Customer depends on active contract'),
    (p_org_id, v_customer, v_employee, 'employee', 'high', 'Customer account supported by project team'),
    (p_org_id, v_project, v_supplier, 'supplier', 'high', 'Project depends on supplier delivery'),
    (p_org_id, v_domain, v_pack, 'technical', 'critical', 'Domain depends on Commerce Pack')
  on conflict do nothing;

  insert into public.organization_knowledge_graph_decisions (
    organization_id, entity_id, decision_title, reason, participants, outcome, lessons_learned
  ) values
    (p_org_id, v_supplier, 'Supplier X selected for inventory', 'Best price and delivery reliability', '["Procurement", "Operations"]'::jsonb, 'Approved', 'Document supplier criteria for future decisions'),
    (p_org_id, v_project, 'Project Y timeline extended', 'Resource constraints and scope change', '["Project Lead", "Executive"]'::jsonb, 'Delayed 3 weeks', 'Earlier scope review prevents delays');

  insert into public.organization_knowledge_graph_memory_records (
    organization_id, entity_id, memory_type, title, summary, reason, outcome
  ) values
    (p_org_id, v_contract, 'approval', 'Contract approved', 'Annual agreement approved by leadership', 'Renewal terms acceptable', 'Active'),
    (p_org_id, v_customer, 'change', 'Customer tier upgraded', 'Moved to enterprise tier', 'Growth opportunity', 'Increased support allocation');

  insert into public.organization_knowledge_graph_timeline_events (
    organization_id, entity_id, event_type, title, summary, occurred_at
  ) values
    (p_org_id, v_customer, 'created', 'Customer created', 'Acme Corporation added to CRM', now() - interval '30 days'),
    (p_org_id, v_project, 'assigned', 'Team assigned', 'Project team assigned to Digital Transformation', now() - interval '14 days'),
    (p_org_id, v_contract, 'approved', 'Contract approved', 'Annual Service Agreement approved', now() - interval '7 days');

  if to_regclass('public.organization_crm_customers') is not null then
    insert into public.organization_knowledge_graph_entities (
      organization_id, entity_type, entity_key, title, summary, source_id, record_href
    )
    select
      p_org_id, 'customer', c.id::text, coalesce(c.company_name, c.name, 'Customer'),
      coalesce(c.country, ''), c.id, '/app/customers'
    from public.organization_crm_customers c
    where c.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_key, title) do update set
      summary = excluded.summary, updated_at = now();
  end if;

  if to_regclass('public.organization_employee_profiles') is not null then
    insert into public.organization_knowledge_graph_entities (
      organization_id, entity_type, entity_key, title, summary, source_id, record_href
    )
    select
      p_org_id, 'employee', p.id::text, coalesce(p.full_name, p.email, 'Employee'),
      coalesce(p.job_title, ''), p.id, '/app/people'
    from public.organization_employee_profiles p
    where p.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_key, title) do update set
      summary = excluded.summary, updated_at = now();
  end if;

  if to_regclass('public.organization_domains') is not null then
    insert into public.organization_knowledge_graph_entities (
      organization_id, entity_type, entity_key, title, summary, source_id, record_href, domain_id
    )
    select
      p_org_id, 'domain', d.id::text, coalesce(d.domain, 'Domain'),
      coalesce(d.verification_status, 'pending'), d.id, '/app/domains', d.id
    from public.organization_domains d
    where d.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_key, title) do update set
      summary = excluded.summary, updated_at = now();
  end if;

  select count(*) into v_count from public.organization_knowledge_graph_entities where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public._kgraph540_impact_analysis(p_org_id uuid, p_entity_id uuid, p_action text default 'change')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_entity public.organization_knowledge_graph_entities;
begin
  select * into v_entity from public.organization_knowledge_graph_entities where id = p_entity_id and organization_id = p_org_id;
  if v_entity.id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'entity', public._kgraph540_entity_json(v_entity),
    'action', p_action,
    'affected_entities', coalesce((
      select jsonb_agg(public._kgraph540_entity_json(e))
      from (
        select distinct e.*
        from public.organization_knowledge_graph_entities e
        join public.organization_knowledge_graph_relationships r on r.to_entity_id = e.id or r.from_entity_id = e.id
        where r.organization_id = p_org_id and (r.from_entity_id = p_entity_id or r.to_entity_id = p_entity_id)
        limit 20
      ) e
    ), '[]'::jsonb),
    'dependencies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'dependency_type', d.dependency_type, 'impact_level', d.impact_level, 'summary', d.summary,
        'depends_on', public._kgraph540_entity_json(e)
      ))
      from public.organization_knowledge_graph_dependencies d
      join public.organization_knowledge_graph_entities e on e.id = d.depends_on_entity_id
      where d.organization_id = p_org_id and d.entity_id = p_entity_id
    ), '[]'::jsonb),
    'impact_summary', case p_action
      when 'delete' then 'Removing this entity may break connected relationships and dependencies.'
      when 'deactivate' then 'Deactivating may affect dependent workflows, teams, and Business Packs.'
      else 'Changes may ripple through connected entities and dependencies.'
    end
  );
end; $$;

create or replace function public.search_knowledge_graph_entities(p_query text, p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('knowledge_graph.view');
  v_org_id := public._kgraph540_org();

  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._kgraph540_entity_json(e) order by e.connection_count desc, e.updated_at desc)
      from (
        select * from public.organization_knowledge_graph_entities
        where organization_id = v_org_id
          and (p_query is null or trim(p_query) = '' or title ilike '%' || p_query || '%' or summary ilike '%' || p_query || '%' or entity_type ilike '%' || p_query || '%')
        order by connection_count desc, updated_at desc
        limit greatest(p_limit, 1)
      ) e
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Knowledge Graph Center
-- ---------------------------------------------------------------------------
create or replace function public.get_knowledge_graph_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_entity_count int;
  v_rel_count int;
begin
  perform public._irp_require_permission('knowledge_graph.view');
  v_org_id := public._kgraph540_org();
  perform public._kgraph540_ensure_settings(v_org_id);
  perform public._kgraph540_seed_graph(v_org_id);
  select count(*) into v_entity_count from public.organization_knowledge_graph_entities where organization_id = v_org_id;
  select count(*) into v_rel_count from public.organization_knowledge_graph_relationships where organization_id = v_org_id;

  perform public._kgraph540_log(v_org_id, 'center_view', 'Knowledge Graph Center viewed', p_section,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations do not suffer from lack of data. Organizations suffer from disconnected data.',
    'philosophy', 'Data becomes information. Information becomes context. Context becomes understanding.',
    'overview', jsonb_build_object(
      'entity_count', v_entity_count,
      'relationship_count', v_rel_count,
      'dependency_count', (select count(*) from public.organization_knowledge_graph_dependencies where organization_id = v_org_id),
      'memory_records', (select count(*) from public.organization_knowledge_graph_memory_records where organization_id = v_org_id),
      'decisions', (select count(*) from public.organization_knowledge_graph_decisions where organization_id = v_org_id)
    ),
    'entity_types', jsonb_build_array(
      'customer', 'employee', 'supplier', 'partner', 'domain', 'project', 'task', 'document',
      'invoice', 'contract', 'asset', 'inventory_item', 'meeting', 'business_pack', 'workflow'
    ),
    'relationship_types', jsonb_build_array(
      'owns', 'assigned_to', 'provides', 'generated', 'depends_on', 'linked_to', 'approved_by', 'supplies', 'installed_on'
    ),
    'entities', coalesce((
      select jsonb_agg(public._kgraph540_entity_json(e) order by e.connection_count desc, e.title)
      from (select * from public.organization_knowledge_graph_entities where organization_id = v_org_id order by connection_count desc limit 50) e
    ), '[]'::jsonb),
    'relationships', coalesce((
      select jsonb_agg(public._kgraph540_rel_json(r) order by r.created_at desc)
      from (select * from public.organization_knowledge_graph_relationships where organization_id = v_org_id order by created_at desc limit 40) r
    ), '[]'::jsonb),
    'connections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'entity', public._kgraph540_entity_json(e), 'connection_count', e.connection_count
      ) order by e.connection_count desc)
      from (select * from public.organization_knowledge_graph_entities where organization_id = v_org_id and connection_count > 0 order by connection_count desc limit 15) e
    ), '[]'::jsonb),
    'dependencies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'dependency_type', d.dependency_type, 'impact_level', d.impact_level, 'summary', d.summary,
        'entity', public._kgraph540_entity_json(e1), 'depends_on', public._kgraph540_entity_json(e2)
      ))
      from public.organization_knowledge_graph_dependencies d
      join public.organization_knowledge_graph_entities e1 on e1.id = d.entity_id
      join public.organization_knowledge_graph_entities e2 on e2.id = d.depends_on_entity_id
      where d.organization_id = v_org_id
      limit 30
    ), '[]'::jsonb),
    'insights', jsonb_build_object(
      'most_connected', coalesce((
        select jsonb_agg(public._kgraph540_entity_json(e))
        from (select * from public.organization_knowledge_graph_entities where organization_id = v_org_id order by connection_count desc limit 5) e
      ), '[]'::jsonb),
      'critical_dependencies', coalesce((
        select jsonb_agg(jsonb_build_object('summary', summary, 'impact_level', impact_level))
        from public.organization_knowledge_graph_dependencies where organization_id = v_org_id and impact_level in ('high', 'critical') limit 10
      ), '[]'::jsonb),
      'relationship_insights', jsonb_build_array(
        'Customer entities typically connect to contracts, invoices, and projects.',
        'Domain entities link to Business Packs and supplier networks.',
        'High-connection entities are organizational hubs — changes ripple widely.'
      )
    ),
    'organizational_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_type', m.memory_type, 'title', m.title, 'summary', m.summary,
        'reason', m.reason, 'outcome', m.outcome, 'lessons_learned', m.lessons_learned,
        'occurred_at', m.occurred_at, 'entity_id', m.entity_id
      ) order by m.occurred_at desc)
      from (select * from public.organization_knowledge_graph_memory_records where organization_id = v_org_id order by occurred_at desc limit 30) m
    ), '[]'::jsonb),
    'decision_history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'decision_title', d.decision_title, 'reason', d.reason,
        'participants', d.participants, 'approvals', d.approvals, 'outcome', d.outcome,
        'lessons_learned', d.lessons_learned, 'decided_at', d.decided_at, 'entity_id', d.entity_id
      ) order by d.decided_at desc)
      from public.organization_knowledge_graph_decisions d where d.organization_id = v_org_id limit 25
    ), '[]'::jsonb),
    'relationship_explorer', jsonb_build_object(
      'enabled', true,
      'description', 'Navigate Entity → Relationship → Entity visually.',
      'sample_chain', jsonb_build_array('customer', 'projects', 'employees', 'meetings', 'invoices', 'tasks', 'approvals')
    ),
    'knowledge_timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'event_type', t.event_type, 'title', t.title, 'summary', t.summary,
        'occurred_at', t.occurred_at, 'entity_id', t.entity_id
      ) order by t.occurred_at desc)
      from (select * from public.organization_knowledge_graph_timeline_events where organization_id = v_org_id order by occurred_at desc limit 40) t
    ), '[]'::jsonb),
    'domain_intelligence', coalesce((
      select jsonb_agg(public._kgraph540_entity_json(e))
      from public.organization_knowledge_graph_entities e
      where e.organization_id = v_org_id and e.entity_type = 'domain'
    ), '[]'::jsonb),
    'business_pack_integration', coalesce((
      select jsonb_agg(public._kgraph540_entity_json(e))
      from public.organization_knowledge_graph_entities e
      where e.organization_id = v_org_id and e.entity_type = 'business_pack'
    ), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'most_connected_entities', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'connections', connection_count, 'type', entity_type))
        from (select title, connection_count, entity_type from public.organization_knowledge_graph_entities where organization_id = v_org_id order by connection_count desc limit 5) x
      ), '[]'::jsonb),
      'critical_dependencies', (select count(*) from public.organization_knowledge_graph_dependencies where organization_id = v_org_id and impact_level = 'critical'),
      'decision_count', (select count(*) from public.organization_knowledge_graph_decisions where organization_id = v_org_id),
      'companion_highlights', jsonb_build_array(
        'Review entities with the most connections before making changes.',
        'Decision history preserves why choices were made.',
        'Dependencies reveal what breaks when something changes.'
      )
    ),
    'companion_integration', jsonb_build_object(
      'prompts', jsonb_build_array(
        'What should I know about this customer?',
        'Show project history.',
        'Show supplier relationships.',
        'Who approved this contract?',
        'What changed last quarter?',
        'Show everything related to Customer X.'
      ),
      'context_checks', jsonb_build_array('customers', 'projects', 'tasks', 'approvals', 'history', 'documents', 'relationships')
    ),
    'search_integration', jsonb_build_object(
      'route', '/app/search',
      'keyboard_shortcut', 'Cmd+K / Ctrl+K',
      'shows_related', jsonb_build_array('entities', 'documents', 'projects', 'risks', 'approvals')
    ),
    'reports', jsonb_build_object(
      'entity_count', v_entity_count,
      'relationship_count', v_rel_count,
      'dependency_count', (select count(*) from public.organization_knowledge_graph_dependencies where organization_id = v_org_id),
      'memory_growth', (select count(*) from public.organization_knowledge_graph_memory_records where organization_id = v_org_id and occurred_at >= now() - interval '30 days'),
      'operational_complexity', case when v_rel_count > 50 then 'high' when v_rel_count > 20 then 'moderate' else 'building' end
    ),
    'mobile_access', jsonb_build_object('mobile_ready', true),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_knowledge_graph_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'relationships', 'entities', 'connections', 'insights', 'dependencies', 'timeline', 'reports', 'companion'
    ),
    'routes', jsonb_build_object(
      'knowledge_graph', '/app/knowledge-graph',
      'memory', '/app/memory',
      'search', '/app/search',
      'customers', '/app/customers',
      'projects', '/app/projects'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_knowledge_graph_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_from uuid;
  v_to uuid;
  v_impact jsonb;
begin
  v_org_id := public._kgraph540_org();
  perform public._kgraph540_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in ('record_entity', 'record_relationship', 'record_dependency', 'record_memory', 'record_decision') then
    perform public._irp_require_permission('knowledge_graph.manage');
  else
    perform public._irp_require_permission('knowledge_graph.view');
  end if;

  if p_action_type = 'record_entity' then
    v_id := public._kgraph540_upsert_entity(
      v_org_id,
      coalesce(p_payload->>'entity_type', 'document'),
      coalesce(p_payload->>'entity_key', gen_random_uuid()::text),
      coalesce(p_payload->>'title', 'Entity'),
      coalesce(p_payload->>'summary', ''),
      nullif(p_payload->>'source_id', '')::uuid,
      coalesce(p_payload->>'record_href', '/app/knowledge-graph'),
      p_payload->>'business_pack_key',
      nullif(p_payload->>'domain_id', '')::uuid
    );
    perform public._kgraph540_log(v_org_id, 'entity_created', 'Entity recorded', 'entities', p_payload);
    return jsonb_build_object('ok', true, 'entity_id', v_id);

  elsif p_action_type = 'record_relationship' then
    v_from := nullif(p_payload->>'from_entity_id', '')::uuid;
    v_to := nullif(p_payload->>'to_entity_id', '')::uuid;
    perform public._kgraph540_link(v_org_id, v_from, v_to,
      coalesce(p_payload->>'relationship_type', 'related_to'),
      coalesce(p_payload->>'label', ''), coalesce(p_payload->>'strength', 'moderate'));
    perform public._kgraph540_log(v_org_id, 'relationship_created', 'Relationship recorded', 'relationships', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'record_dependency' then
    insert into public.organization_knowledge_graph_dependencies (
      organization_id, entity_id, depends_on_entity_id, dependency_type, impact_level, summary
    ) values (
      v_org_id,
      (p_payload->>'entity_id')::uuid,
      (p_payload->>'depends_on_entity_id')::uuid,
      coalesce(p_payload->>'dependency_type', 'business'),
      coalesce(p_payload->>'impact_level', 'moderate'),
      coalesce(p_payload->>'summary', '')
    )
    on conflict do nothing returning id into v_id;
    perform public._kgraph540_log(v_org_id, 'dependency_added', 'Dependency recorded', 'dependencies', p_payload);
    return jsonb_build_object('ok', true, 'dependency_id', v_id);

  elsif p_action_type = 'record_memory' then
    insert into public.organization_knowledge_graph_memory_records (
      organization_id, entity_id, memory_type, title, summary, reason, outcome, lessons_learned, actor_user_id
    ) values (
      v_org_id, nullif(p_payload->>'entity_id', '')::uuid,
      coalesce(p_payload->>'memory_type', 'historical_note'),
      coalesce(p_payload->>'title', 'Memory record'),
      coalesce(p_payload->>'summary', ''),
      p_payload->>'reason', p_payload->>'outcome', p_payload->>'lessons_learned', v_user_id
    ) returning id into v_id;
    perform public._kgraph540_log(v_org_id, 'memory_record_added', 'Organizational memory recorded', 'memory', p_payload);
    return jsonb_build_object('ok', true, 'memory_id', v_id);

  elsif p_action_type = 'record_decision' then
    insert into public.organization_knowledge_graph_decisions (
      organization_id, entity_id, decision_title, reason, participants, outcome, lessons_learned
    ) values (
      v_org_id, nullif(p_payload->>'entity_id', '')::uuid,
      coalesce(p_payload->>'decision_title', 'Decision'),
      coalesce(p_payload->>'reason', ''),
      coalesce(p_payload->'participants', '[]'::jsonb),
      p_payload->>'outcome', p_payload->>'lessons_learned'
    ) returning id into v_id;
    perform public._kgraph540_log(v_org_id, 'decision_recorded', 'Decision history recorded', 'decisions', p_payload);
    return jsonb_build_object('ok', true, 'decision_id', v_id);

  elsif p_action_type = 'impact_analysis' then
    v_impact := public._kgraph540_impact_analysis(v_org_id, (p_payload->>'entity_id')::uuid, coalesce(p_payload->>'action', 'change'));
    perform public._kgraph540_log(v_org_id, 'impact_analysis_generated', 'Impact analysis generated', 'dependencies', p_payload);
    return jsonb_build_object('ok', true, 'impact', v_impact);

  elsif p_action_type = 'relationship_viewed' then
    perform public._kgraph540_log(v_org_id, 'relationship_viewed', 'Relationship explorer viewed', 'relationships', p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_knowledge_graph_context(p_query text default null, p_entity_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_search jsonb; v_impact jsonb;
declare v_org_id uuid;
begin
  perform public._irp_require_permission('knowledge_graph.view');
  v_org_id := public._kgraph540_org();
  v_center := public.get_knowledge_graph_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_knowledge_graph_entities(p_query, 15);
  end if;
  if p_entity_id is not null then
    v_impact := public._kgraph540_impact_analysis(v_org_id, p_entity_id, 'change');
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion should understand relationships — not only know facts.',
    'query', p_query,
    'entity_id', p_entity_id,
    'center', v_center,
    'search', v_search,
    'impact', v_impact,
    'companion_prompts', v_center->'companion_integration'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_knowledge_graph_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('knowledge_graph.view');
  v_center := public.get_knowledge_graph_operations_center('mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('knowledge_graph.manage', public._kgraph540_org()),
    'overview', v_center->'overview',
    'most_connected', v_center->'insights'->'most_connected',
    'memory_recent', v_center->'organizational_memory',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('knowledge_graph', '/app/knowledge-graph', 'memory', '/app/memory'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'knowledge_graph', 'Knowledge Graph & Organizational Memory', 'knowledge-graph', 'knowledge',
    'Universal knowledge graph — entities, relationships, dependencies, organizational memory, and decision history.',
    'starter', null, 'main', '/app/knowledge-graph', 'licensed', 2
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('knowledge_graph', 'knowledge_graph.view', 'view', 'Knowledge Graph — view entities, relationships, and organizational memory'),
  ('knowledge_graph', 'knowledge_graph.manage', 'manage', 'Knowledge Graph — record entities, relationships, memory, and decisions')
on conflict do nothing;

grant execute on function public._kgraph540_entity_json(public.organization_knowledge_graph_entities) to authenticated;
grant execute on function public._kgraph540_seed_graph(uuid) to authenticated;
grant execute on function public._kgraph540_impact_analysis(uuid, uuid, text) to authenticated;
grant execute on function public.search_knowledge_graph_entities(text, int) to authenticated;
grant execute on function public.get_knowledge_graph_operations_center(text) to authenticated;
grant execute on function public.perform_knowledge_graph_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_knowledge_graph_context(text, uuid) to authenticated;
grant execute on function public.get_my_knowledge_graph_summary() to authenticated;
