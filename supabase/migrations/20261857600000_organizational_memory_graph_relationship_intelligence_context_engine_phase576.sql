-- Phase 576 — Organizational Memory Graph, Relationship Intelligence & Context Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/memory-graph
-- Helpers: _cmomg576_*

create table if not exists public.organization_companion_memory_graph_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  memory_graph_enabled boolean not null default true,
  relationship_engine_enabled boolean not null default true,
  context_engine_enabled boolean not null default true,
  dependency_mapping_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_memory_graph_settings enable row level security;
revoke all on public.organization_companion_memory_graph_settings from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_key text not null,
  entity_title text not null,
  entity_type text not null check (
    entity_type in (
      'employee', 'customer', 'partner', 'project', 'task', 'workflow',
      'document', 'policy', 'knowledge_asset', 'business_pack', 'domain',
      'integration', 'custom'
    )
  ),
  owner_name text not null default '',
  entity_status text not null default 'active' check (
    entity_status in ('active', 'archived', 'pending')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, entity_key)
);

alter table public.organization_companion_memory_graph_entities enable row level security;
revoke all on public.organization_companion_memory_graph_entities from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_relationships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  relationship_key text not null,
  source_entity_key text not null,
  target_entity_key text not null,
  relationship_type text not null check (
    relationship_type in (
      'works_on', 'owns', 'supports', 'approves', 'depends_on',
      'related_to', 'decided_by', 'documented_in', 'custom'
    )
  ),
  relationship_strength text not null default 'moderate' check (
    relationship_strength in ('weak', 'moderate', 'strong', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, relationship_key)
);

alter table public.organization_companion_memory_graph_relationships enable row level security;
revoke all on public.organization_companion_memory_graph_relationships from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connection_key text not null,
  connection_title text not null,
  connection_chain jsonb not null default '[]'::jsonb,
  connection_type text not null check (
    connection_type in (
      'employee_project_customer', 'decision_outcome', 'knowledge_process',
      'customer_contract', 'project_stakeholder', 'custom'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, connection_key)
);

alter table public.organization_companion_memory_graph_connections enable row level security;
revoke all on public.organization_companion_memory_graph_connections from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_knowledge_map (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  knowledge_key text not null,
  knowledge_title text not null,
  owner_name text not null default '',
  related_entities jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  business_pack text not null default '',
  project_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, knowledge_key)
);

alter table public.organization_companion_memory_graph_knowledge_map enable row level security;
revoke all on public.organization_companion_memory_graph_knowledge_map from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_customer_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_key text not null,
  customer_title text not null,
  interactions jsonb not null default '[]'::jsonb,
  contracts jsonb not null default '[]'::jsonb,
  tickets jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  invoices jsonb not null default '[]'::jsonb,
  meetings jsonb not null default '[]'::jsonb,
  knowledge jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, customer_key)
);

alter table public.organization_companion_memory_graph_customer_intel enable row level security;
revoke all on public.organization_companion_memory_graph_customer_intel from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_project_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_key text not null,
  project_title text not null,
  stakeholders jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  approvals jsonb not null default '[]'::jsonb,
  lessons jsonb not null default '[]'::jsonb,
  decisions jsonb not null default '[]'::jsonb,
  knowledge jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, project_key)
);

alter table public.organization_companion_memory_graph_project_intel enable row level security;
revoke all on public.organization_companion_memory_graph_project_intel from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_decision_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  decision_title text not null,
  reasoning text not null default '',
  approvals jsonb not null default '[]'::jsonb,
  related_projects jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  lessons jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, decision_key)
);

alter table public.organization_companion_memory_graph_decision_links enable row level security;
revoke all on public.organization_companion_memory_graph_decision_links from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dependency_key text not null,
  dependency_title text not null,
  dependency_type text not null check (
    dependency_type in (
      'people', 'system', 'process', 'supplier', 'knowledge', 'custom'
    )
  ),
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'high', 'critical')
  ),
  dependency_status text not null default 'active' check (
    dependency_status in ('active', 'mitigated', 'resolved')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, dependency_key)
);

alter table public.organization_companion_memory_graph_dependencies enable row level security;
revoke all on public.organization_companion_memory_graph_dependencies from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  entities jsonb not null default '[]'::jsonb,
  relationships jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  knowledge jsonb not null default '[]'::jsonb,
  decisions jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_memory_graph_business_packs enable row level security;
revoke all on public.organization_companion_memory_graph_business_packs from authenticated, anon;

create table if not exists public.organization_companion_memory_graph_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'memory_graph' check (
    audit_category in (
      'entity', 'relationship', 'dependency', 'context', 'knowledge', 'decision', 'memory_graph'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_memory_graph_audit_logs_org_idx
  on public.organization_companion_memory_graph_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_memory_graph_audit_logs enable row level security;
revoke all on public.organization_companion_memory_graph_audit_logs from authenticated, anon;

create or replace function public._cmomg576_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmomg576_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'memory_graph'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_memory_graph_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'memory_graph'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmomg576_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_memory_graph_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmomg576_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_memory_graph_entities where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_memory_graph_entities (
    organization_id, entity_key, entity_title, entity_type, owner_name, summary
  ) values
    (p_org_id, 'ent_employee_1', 'Project Lead — Anna K.', 'employee', 'HR', 'Employee entity in organizational memory graph.'),
    (p_org_id, 'ent_customer_nordic', 'Nordic Retail Group', 'customer', 'Account Manager', 'Customer entity — complete relationship history tracked.'),
    (p_org_id, 'ent_project_launch', 'Q2 Product Launch', 'project', 'Project Lead', 'Project entity — connected ecosystem.'),
    (p_org_id, 'ent_contract_nordic', 'Nordic Service Contract', 'document', 'Legal', 'Contract linked to customer and project.'),
    (p_org_id, 'ent_decision_pricing', 'Pricing Strategy Decision', 'policy', 'Executive Team', 'Decision entity — linked via Phase 573 Decision Intelligence.'),
    (p_org_id, 'ent_kb_escalation', 'Escalation Procedures', 'knowledge_asset', 'Support Lead', 'Knowledge asset — interconnected in knowledge map.'),
    (p_org_id, 'ent_partner_logistics', 'Logistics Partner AS', 'partner', 'Operations', 'Partner entity in relationship graph.'),
    (p_org_id, 'ent_pack_support', 'Support Pack', 'business_pack', 'Support Lead', 'Business Pack contributes entities and relationships.');

  insert into public.organization_companion_memory_graph_relationships (
    organization_id, relationship_key, source_entity_key, target_entity_key, relationship_type, relationship_strength, summary
  ) values
    (p_org_id, 'rel_emp_project', 'ent_employee_1', 'ent_project_launch', 'works_on', 'strong', 'Employee → Project relationship.'),
    (p_org_id, 'rel_project_customer', 'ent_project_launch', 'ent_customer_nordic', 'supports', 'critical', 'Project → Customer relationship.'),
    (p_org_id, 'rel_customer_contract', 'ent_customer_nordic', 'ent_contract_nordic', 'owns', 'strong', 'Customer → Contract relationship.'),
    (p_org_id, 'rel_decision_project', 'ent_decision_pricing', 'ent_project_launch', 'decided_by', 'moderate', 'Decision → Project impact mapping.'),
    (p_org_id, 'rel_kb_support', 'ent_kb_escalation', 'ent_pack_support', 'documented_in', 'strong', 'Knowledge → Business Pack connection.');

  insert into public.organization_companion_memory_graph_connections (
    organization_id, connection_key, connection_title, connection_chain, connection_type, summary
  ) values
    (p_org_id, 'conn_full_chain', 'Employee → Project → Customer → Contract → Decision → Outcome',
     '["Employee","Project","Customer","Contract","Decision","Outcome"]'::jsonb, 'employee_project_customer',
     'Companion understands context — full relationship chain.'),
    (p_org_id, 'conn_customer_context', 'Customer Context Chain',
     '["Customer","Projects","Support History","Invoices","Documents","Approvals","Decisions","Knowledge"]'::jsonb, 'customer_contract',
     'Customer asks a question — Companion knows full context instantly.');

  insert into public.organization_companion_memory_graph_knowledge_map (
    organization_id, knowledge_key, knowledge_title, owner_name, related_entities, dependencies, business_pack, project_key, summary
  ) values
    (p_org_id, 'km_escalation', 'Escalation Procedures', 'Support Lead',
     '["ent_kb_escalation","ent_customer_nordic","ent_project_launch"]'::jsonb,
     '["Support Pack","Escalation workflow"]'::jsonb, 'support', 'ent_project_launch',
     'Knowledge asset with owners, relationships, and dependencies visualized.'),
    (p_org_id, 'km_pricing', 'Pricing Knowledge Base', 'Finance Lead',
     '["ent_decision_pricing","ent_customer_nordic"]'::jsonb,
     '["Finance Pack","Pricing policy"]'::jsonb, 'finance', '',
     'Knowledge interconnected with decisions and customers.');

  insert into public.organization_companion_memory_graph_customer_intel (
    organization_id, customer_key, customer_title, interactions, contracts, tickets, projects, invoices, meetings, knowledge, summary
  ) values
    (p_org_id, 'cust_nordic', 'Nordic Retail Group',
     '["Q1 review call","Support escalation Mar"]'::jsonb,
     '["Nordic Service Contract"]'::jsonb,
     '["Ticket #1042 — billing","Ticket #1088 — onboarding"]'::jsonb,
     '["Q2 Product Launch"]'::jsonb,
     '["Invoice #2025-041","Invoice #2025-052"]'::jsonb,
     '["Executive briefing Q1"]'::jsonb,
     '["Escalation Procedures","Account playbook"]'::jsonb,
     'Companion understands complete customer history — interactions, contracts, tickets, projects, invoices, meetings, knowledge.');

  insert into public.organization_companion_memory_graph_project_intel (
    organization_id, project_key, project_title, stakeholders, documents, tasks, approvals, lessons, decisions, knowledge, summary
  ) values
    (p_org_id, 'proj_launch', 'Q2 Product Launch',
     '["Anna K.","Support Lead","Account Manager"]'::jsonb,
     '["Project charter","Technical spec"]'::jsonb,
     '["Launch checklist","Beta testing"]'::jsonb,
     '["Budget approval","Go-live sign-off"]'::jsonb,
     '["Timeline buffer lesson"]'::jsonb,
     '["Pricing Strategy Decision"]'::jsonb,
     '["Launch playbook","Escalation Procedures"]'::jsonb,
     'Projects become connected ecosystems — stakeholders, documents, tasks, approvals, lessons, decisions, knowledge.');

  insert into public.organization_companion_memory_graph_decision_links (
    organization_id, decision_key, decision_title, reasoning, approvals, related_projects, outcomes, lessons, summary
  ) values
    (p_org_id, 'dec_pricing', 'Pricing Strategy Decision',
     'Market analysis supported premium tier for enterprise segment.',
     '["CFO approved","Executive team aligned"]'::jsonb,
     '["Q2 Product Launch"]'::jsonb,
     '["Revenue target met","Customer retention stable"]'::jsonb,
     '["Marketing forecast optimism lesson"]'::jsonb,
     'Decision → Reasoning → Approvals → Projects → Outcomes → Lessons — Phase 573 integration.');

  insert into public.organization_companion_memory_graph_dependencies (
    organization_id, dependency_key, dependency_title, dependency_type, risk_level, dependency_status, summary
  ) values
    (p_org_id, 'dep_knowledge_owner', 'Escalation knowledge owner', 'people', 'high', 'active',
     'People dependency — single owner for escalation knowledge.'),
    (p_org_id, 'dep_billing_integration', 'Billing system integration', 'system', 'moderate', 'active',
     'System dependency — customer context requires billing integration.'),
    (p_org_id, 'dep_supplier_logistics', 'Logistics partner SLA', 'supplier', 'high', 'active',
     'Supplier dependency — project delivery depends on logistics partner.'),
    (p_org_id, 'dep_escalation_kb', 'Escalation knowledge base', 'knowledge', 'critical', 'active',
     'Knowledge dependency — support context requires escalation procedures.');

  insert into public.organization_companion_memory_graph_business_packs (
    organization_id, pack_key, pack_title, entities, relationships, dependencies, knowledge, decisions, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack',
     '["Invoices","Contracts"]'::jsonb, '["Customer → Invoice"]'::jsonb,
     '["Billing integration"]'::jsonb, '["Pricing knowledge"]'::jsonb, '["Pricing Strategy"]'::jsonb,
     'Finance Pack → Financial Relationships.'),
    (p_org_id, 'support', 'Support Pack',
     '["Tickets","Customers"]'::jsonb, '["Customer → Ticket"]'::jsonb,
     '["Escalation knowledge"]'::jsonb, '["Escalation Procedures"]'::jsonb, '[]'::jsonb,
     'Support Pack → Customer Relationships.'),
    (p_org_id, 'warehouse', 'Warehouse Pack',
     '["Inventory","Suppliers"]'::jsonb, '["Supplier → Inventory"]'::jsonb,
     '["Logistics partner"]'::jsonb, '[]'::jsonb, '[]'::jsonb,
     'Warehouse Pack → Inventory Relationships.');
end; $$;

create or replace function public.get_organization_companion_memory_graph_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_entities jsonb; v_relationships jsonb;
  v_connections jsonb; v_knowledge_map jsonb; v_customer_intel jsonb; v_project_intel jsonb;
  v_decision_links jsonb; v_dependencies jsonb; v_packs jsonb; v_executive jsonb;
  v_companion jsonb; v_reports jsonb; v_audit jsonb;
begin
  v_org_id := public._cmomg576_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmomg576_ensure_settings(v_org_id);
  perform public._cmomg576_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_entities', (select count(*) from public.organization_companion_memory_graph_entities where organization_id = v_org_id),
    'total_relationships', (select count(*) from public.organization_companion_memory_graph_relationships where organization_id = v_org_id),
    'total_connections', (select count(*) from public.organization_companion_memory_graph_connections where organization_id = v_org_id),
    'knowledge_assets', (select count(*) from public.organization_companion_memory_graph_knowledge_map where organization_id = v_org_id),
    'customer_networks', (select count(*) from public.organization_companion_memory_graph_customer_intel where organization_id = v_org_id),
    'project_networks', (select count(*) from public.organization_companion_memory_graph_project_intel where organization_id = v_org_id),
    'decision_links', (select count(*) from public.organization_companion_memory_graph_decision_links where organization_id = v_org_id),
    'active_dependencies', (select count(*) from public.organization_companion_memory_graph_dependencies where organization_id = v_org_id and dependency_status = 'active')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'entity_key', e.entity_key, 'entity_title', e.entity_title, 'entity_type', e.entity_type,
    'owner_name', e.owner_name, 'entity_status', e.entity_status, 'summary', e.summary
  ) order by e.entity_type, e.entity_title), '[]'::jsonb)
  into v_entities from public.organization_companion_memory_graph_entities e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'relationship_key', r.relationship_key, 'source_entity_key', r.source_entity_key,
    'target_entity_key', r.target_entity_key, 'relationship_type', r.relationship_type,
    'relationship_strength', r.relationship_strength, 'summary', r.summary
  ) order by r.relationship_strength desc), '[]'::jsonb)
  into v_relationships from public.organization_companion_memory_graph_relationships r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'connection_key', c.connection_key, 'connection_title', c.connection_title,
    'connection_chain', c.connection_chain, 'connection_type', c.connection_type, 'summary', c.summary
  ) order by c.connection_title), '[]'::jsonb)
  into v_connections from public.organization_companion_memory_graph_connections c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'knowledge_key', k.knowledge_key, 'knowledge_title', k.knowledge_title, 'owner_name', k.owner_name,
    'related_entities', k.related_entities, 'dependencies', k.dependencies,
    'business_pack', k.business_pack, 'project_key', k.project_key, 'summary', k.summary
  ) order by k.knowledge_title), '[]'::jsonb)
  into v_knowledge_map from public.organization_companion_memory_graph_knowledge_map k where k.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer_key', ci.customer_key, 'customer_title', ci.customer_title,
    'interactions', ci.interactions, 'contracts', ci.contracts, 'tickets', ci.tickets,
    'projects', ci.projects, 'invoices', ci.invoices, 'meetings', ci.meetings,
    'knowledge', ci.knowledge, 'summary', ci.summary
  ) order by ci.customer_title), '[]'::jsonb)
  into v_customer_intel from public.organization_companion_memory_graph_customer_intel ci where ci.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'project_key', pi.project_key, 'project_title', pi.project_title,
    'stakeholders', pi.stakeholders, 'documents', pi.documents, 'tasks', pi.tasks,
    'approvals', pi.approvals, 'lessons', pi.lessons, 'decisions', pi.decisions,
    'knowledge', pi.knowledge, 'summary', pi.summary
  ) order by pi.project_title), '[]'::jsonb)
  into v_project_intel from public.organization_companion_memory_graph_project_intel pi where pi.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'decision_key', dl.decision_key, 'decision_title', dl.decision_title, 'reasoning', dl.reasoning,
    'approvals', dl.approvals, 'related_projects', dl.related_projects,
    'outcomes', dl.outcomes, 'lessons', dl.lessons, 'summary', dl.summary
  ) order by dl.decision_title), '[]'::jsonb)
  into v_decision_links from public.organization_companion_memory_graph_decision_links dl where dl.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'dependency_key', d.dependency_key, 'dependency_title', d.dependency_title,
    'dependency_type', d.dependency_type, 'risk_level', d.risk_level,
    'dependency_status', d.dependency_status, 'summary', d.summary
  ) order by case d.risk_level when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_dependencies from public.organization_companion_memory_graph_dependencies d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
    'entities', bp.entities, 'relationships', bp.relationships,
    'dependencies', bp.dependencies, 'knowledge', bp.knowledge, 'decisions', bp.decisions, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_memory_graph_business_packs bp where bp.organization_id = v_org_id;

  select jsonb_build_object(
    'key_relationships', v_relationships,
    'critical_dependencies', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select jsonb_build_object('title', dependency_title, 'risk_level', risk_level) as x
      from public.organization_companion_memory_graph_dependencies
      where organization_id = v_org_id and risk_level in ('high', 'critical') limit 5
    ) t),
    'knowledge_health', v_knowledge_map,
    'customer_networks', v_customer_intel,
    'project_networks', v_project_intel,
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Review escalation knowledge dependency', 'reason', 'Critical knowledge dependency — single owner risk'),
      jsonb_build_object('title', 'Prepare Nordic customer context briefing', 'reason', 'Meeting scheduled — full customer history available'),
      jsonb_build_object('title', 'Connect pricing decision to project outcomes', 'reason', 'Decision impact mapping incomplete')
    )
  ) into v_executive;

  select jsonb_build_object(
    'context_advisor_prompts', jsonb_build_array(
      'What should I know before this meeting?', 'Show related decisions.',
      'Show related projects.', 'Show customer history.', 'Show dependencies.',
      'Generate context briefing.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_dashboard', v_executive,
    'knowledge_map', v_knowledge_map,
    'dependencies', v_dependencies,
    'customer_intelligence', v_customer_intel,
    'project_intelligence', v_project_intel
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_memory_graph_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Information without context creates confusion. Context creates understanding.',
    'philosophy', 'One Memory Graph. One Context Engine. One Organizational Relationship Framework.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'entities', v_entities,
    'relationships', v_relationships,
    'connections', v_connections,
    'knowledge', v_knowledge_map,
    'knowledge_map', v_knowledge_map,
    'decisions', v_decision_links,
    'decision_links', v_decision_links,
    'projects', v_project_intel,
    'project_intelligence', v_project_intel,
    'customer_intelligence', v_customer_intel,
    'dependencies', v_dependencies,
    'business_packs', v_packs,
    'executive_dashboard', v_executive,
    'recommendations', (v_executive->'companion_recommendations'),
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'memory_graph_center', '/app/memory-graph',
      'decision_intelligence', '/app/decisions',
      'learning_center', '/app/learning-center'
    ),
    'mobile_access', jsonb_build_object(
      'review_context', true, 'review_relationships', true,
      'review_dependencies', true, 'generate_briefings', true, 'review_entity_history', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_memory_graph_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
begin
  v_org_id := public._cmomg576_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_graph' then
    perform public._cmomg576_log(v_org_id, 'graph_updated', 'Memory graph refreshed', p_payload, 'memory_graph');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_entity' then
    perform public._cmomg576_log(v_org_id, 'entity_created', 'Entity created', p_payload, 'entity');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_relationship' then
    perform public._cmomg576_log(v_org_id, 'relationship_added', 'Relationship added', p_payload, 'relationship');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'identify_dependency' then
    perform public._cmomg576_log(v_org_id, 'dependency_identified', 'Dependency identified', p_payload, 'dependency');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'connect_knowledge' then
    perform public._cmomg576_log(v_org_id, 'knowledge_connected', 'Knowledge connected', p_payload, 'knowledge');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'connect_decision' then
    perform public._cmomg576_log(v_org_id, 'decision_connected', 'Decision connected', p_payload, 'decision');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_context_briefing' then
    perform public._cmomg576_log(v_org_id, 'context_report_generated', 'Context briefing generated', p_payload, 'context');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_memory_graph_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmomg576_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_memory_graph_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/memory-graph');
end; $$;

create or replace function public.get_assistant_companion_context_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmomg576_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands not only what exists — but how everything connects.',
    'advisor_prompts', jsonb_build_array(
      'What should I know before this meeting?', 'Show related decisions.',
      'Show customer history.', 'Show dependencies.', 'Generate context briefing.'
    ),
    'total_entities', (select count(*) from public.organization_companion_memory_graph_entities where organization_id = v_org_id),
    'total_relationships', (select count(*) from public.organization_companion_memory_graph_relationships where organization_id = v_org_id),
    'active_dependencies', (select count(*) from public.organization_companion_memory_graph_dependencies where organization_id = v_org_id and dependency_status = 'active'),
    'route', '/app/memory-graph'
  );
end; $$;

grant execute on function public.get_organization_companion_memory_graph_center(text) to authenticated;
grant execute on function public.perform_organization_companion_memory_graph_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_memory_graph_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_context_advisor_context() to authenticated;
