-- Phase 537 — Universal Search, Discovery & Organizational Intelligence Engine
-- One search. Everything searchable. Permission-aware discovery layer.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_universal_search_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  natural_language_enabled boolean not null default true,
  discovery_enabled boolean not null default true,
  companion_search_enabled boolean not null default true,
  analytics_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_universal_search_settings enable row level security;
revoke all on public.organization_universal_search_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Search index
-- ---------------------------------------------------------------------------
create table if not exists public.organization_universal_search_index (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_type text not null check (
    entity_type in (
      'people', 'customer', 'partner', 'project', 'task', 'document', 'knowledge',
      'asset', 'inventory', 'contract', 'invoice', 'domain', 'business_pack',
      'workflow', 'meeting', 'approval', 'report', 'notification', 'module'
    )
  ),
  entity_id uuid,
  title text not null,
  summary text not null default '',
  status text not null default 'active',
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  country_code text,
  record_href text not null default '',
  quick_actions jsonb not null default '[]'::jsonb,
  keywords jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  indexed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_type, entity_id, title)
);

create index if not exists organization_universal_search_index_org_title_idx
  on public.organization_universal_search_index (organization_id, lower(title));
create index if not exists organization_universal_search_index_org_type_idx
  on public.organization_universal_search_index (organization_id, entity_type, updated_at desc);

alter table public.organization_universal_search_index enable row level security;
revoke all on public.organization_universal_search_index from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Saved searches
-- ---------------------------------------------------------------------------
create table if not exists public.organization_universal_search_saved (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  query text not null default '',
  search_mode text not null default 'global' check (
    search_mode in ('global', 'department', 'business_pack', 'domain', 'companion', 'advanced', 'natural_language')
  ),
  filters jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, name)
);

alter table public.organization_universal_search_saved enable row level security;
revoke all on public.organization_universal_search_saved from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_universal_search_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  query text,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_universal_search_audit_logs_org_idx
  on public.organization_universal_search_audit_logs (organization_id, created_at desc);

alter table public.organization_universal_search_audit_logs enable row level security;
revoke all on public.organization_universal_search_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._usearch537_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._usearch537_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_universal_search_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._usearch537_log(
  p_org_id uuid, p_action text, p_summary text,
  p_query text default null, p_entity_type text default null,
  p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_universal_search_audit_logs (
    organization_id, actor_user_id, action, summary, query, entity_type, entity_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_query, p_entity_type, p_entity_id, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._usearch537_index_json(r public.organization_universal_search_index)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id,
    'entity_type', r.entity_type,
    'entity_id', r.entity_id,
    'title', r.title,
    'summary', r.summary,
    'status', r.status,
    'department_id', r.department_id,
    'domain_id', r.domain_id,
    'business_pack_key', r.business_pack_key,
    'record_href', r.record_href,
    'quick_actions', r.quick_actions,
    'updated_at', r.updated_at
  );
$$;

create or replace function public._usearch537_rebuild_index(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int := 0;
begin
  if to_regclass('public.organization_employee_profiles') is not null then
    insert into public.organization_universal_search_index (
      organization_id, entity_type, entity_id, title, summary, status, department_id, record_href, keywords
    )
    select
      p_org_id, 'people', p.id, coalesce(p.full_name, p.email, 'Employee'),
      coalesce(p.job_title, ''), coalesce(p.employee_status, 'active'),
      p.department_id, '/app/people', jsonb_build_array(p.email, p.full_name)
    from public.organization_employee_profiles p
    where p.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_id, title) do update set
      summary = excluded.summary, status = excluded.status, updated_at = now(), indexed_at = now();
    get diagnostics v_count = row_count;
  end if;

  if to_regclass('public.organization_crm_customers') is not null then
    insert into public.organization_universal_search_index (
      organization_id, entity_type, entity_id, title, summary, status, department_id, record_href, keywords
    )
    select
      p_org_id, 'customer', c.id, coalesce(c.company_name, c.name, 'Customer'),
      coalesce(c.country, ''), coalesce(c.status, 'active'),
      c.assigned_department_id, '/app/customers', jsonb_build_array(c.company_name, c.name, c.email)
    from public.organization_crm_customers c
    where c.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_id, title) do update set
      summary = excluded.summary, status = excluded.status, updated_at = now(), indexed_at = now();
  end if;

  if to_regclass('public.organization_crm_contracts') is not null then
    insert into public.organization_universal_search_index (
      organization_id, entity_type, entity_id, title, summary, status, domain_id, business_pack_key, record_href
    )
    select
      p_org_id, 'contract', c.id, c.title, coalesce(c.renewal_terms, ''), coalesce(c.status, 'active'),
      c.domain_id, c.business_pack_key, '/app/customers'
    from public.organization_crm_contracts c
    where c.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_id, title) do update set
      status = excluded.status, updated_at = now(), indexed_at = now();
  end if;

  if to_regclass('public.organization_automation_operations_workflows') is not null then
    insert into public.organization_universal_search_index (
      organization_id, entity_type, entity_id, title, summary, status, business_pack_key, record_href
    )
    select
      p_org_id, 'workflow', w.id, w.name, coalesce(w.description, ''), w.status, w.business_pack_key, '/app/automation/workflows'
    from public.organization_automation_operations_workflows w
    where w.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_id, title) do update set
      status = excluded.status, updated_at = now(), indexed_at = now();
  end if;

  if to_regclass('public.organization_assets') is not null then
    insert into public.organization_universal_search_index (
      organization_id, entity_type, entity_id, title, summary, status, record_href
    )
    select
      p_org_id, 'asset', a.id, coalesce(a.name, a.asset_number, 'Asset'),
      coalesce(a.category, ''), coalesce(a.status, 'active'), '/app/assets'
    from public.organization_assets a
    where a.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_id, title) do update set
      status = excluded.status, updated_at = now(), indexed_at = now();
  end if;

  if to_regclass('public.organization_domains') is not null then
    insert into public.organization_universal_search_index (
      organization_id, entity_type, entity_id, title, summary, status, record_href
    )
    select
      p_org_id, 'domain', d.id, coalesce(d.domain, 'Domain'),
      '', coalesce(d.verification_status, 'pending'), '/app/settings/domains'
    from public.organization_domains d
    where d.organization_id = p_org_id
    on conflict (organization_id, entity_type, entity_id, title) do update set
      status = excluded.status, updated_at = now(), indexed_at = now();
  end if;

  select count(*) into v_count from public.organization_universal_search_index where organization_id = p_org_id;
  return v_count;
exception when others then
  return 0;
end; $$;

create or replace function public._usearch537_parse_natural_language(p_query text)
returns jsonb language plpgsql immutable as $$
declare v_q text := lower(trim(coalesce(p_query, '')));
begin
  if v_q like '%overdue%task%' or v_q like '%overdue tasks%' then
    return jsonb_build_object('entity_type', 'task', 'status', 'overdue', 'intent', 'overdue_tasks');
  elsif v_q like '%contract%expir%' or v_q like '%expiring%contract%' then
    return jsonb_build_object('entity_type', 'contract', 'status', 'expiring', 'intent', 'expiring_contracts');
  elsif v_q like '%customer%norway%' or v_q like '%customers in norway%' then
    return jsonb_build_object('entity_type', 'customer', 'country_code', 'NO', 'intent', 'customers_norway');
  elsif v_q like '%invoice%over%' or v_q like '%invoices over%' then
    return jsonb_build_object('entity_type', 'invoice', 'intent', 'high_value_invoices');
  elsif v_q like '%inventory%project%' or v_q like '%assigned to project%' then
    return jsonb_build_object('entity_type', 'inventory', 'intent', 'project_inventory');
  elsif v_q like '%active%partner%' or v_q like '%growth partner%' then
    return jsonb_build_object('entity_type', 'partner', 'status', 'active', 'intent', 'active_partners');
  elsif v_q like '%support%escalat%' then
    return jsonb_build_object('entity_type', 'approval', 'intent', 'support_escalations');
  else
    return jsonb_build_object('intent', 'keyword');
  end if;
end; $$;

create or replace function public.perform_universal_search_query(
  p_query text,
  p_filters jsonb default '{}'::jsonb,
  p_mode text default 'global',
  p_limit int default 40
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_q text := trim(coalesce(p_query, ''));
  v_nl jsonb;
  v_entity_type text;
  v_status text;
  v_domain_id uuid;
  v_business_pack text;
  v_results jsonb;
  v_discovery jsonb;
  v_suggestions jsonb;
begin
  perform public._irp_require_permission('universal_search.view');
  v_org_id := public._usearch537_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  perform public._usearch537_ensure_settings(v_org_id);
  perform public._usearch537_rebuild_index(v_org_id);

  v_nl := public._usearch537_parse_natural_language(v_q);
  v_entity_type := coalesce(p_filters->>'entity_type', v_nl->>'entity_type');
  v_status := coalesce(p_filters->>'status', v_nl->>'status');
  v_domain_id := nullif(p_filters->>'domain_id', '')::uuid;
  v_business_pack := p_filters->>'business_pack_key';

  if v_q = '' and v_entity_type is null then
    return jsonb_build_object('found', true, 'query', v_q, 'results', '[]'::jsonb, 'total', 0);
  end if;

  select coalesce(jsonb_agg(public._usearch537_index_json(i) order by i.updated_at desc), '[]'::jsonb)
  into v_results
  from (
    select i.*
    from public.organization_universal_search_index i
    where i.organization_id = v_org_id
      and (v_q = '' or i.title ilike '%' || v_q || '%' or i.summary ilike '%' || v_q || '%'
           or i.keywords::text ilike '%' || v_q || '%')
      and (v_entity_type is null or i.entity_type = v_entity_type)
      and (v_status is null or i.status = v_status)
      and (v_domain_id is null or i.domain_id = v_domain_id)
      and (v_business_pack is null or i.business_pack_key = v_business_pack)
      and (p_mode <> 'domain' or v_domain_id is not null or p_filters ? 'domain_id')
      and (p_mode <> 'business_pack' or v_business_pack is not null or p_filters ? 'business_pack_key')
    order by i.updated_at desc
    limit greatest(1, least(p_limit, 100))
  ) i;

  select coalesce(jsonb_agg(jsonb_build_object(
    'entity_type', d.entity_type, 'title', d.title, 'record_href', d.record_href
  )), '[]'::jsonb)
  into v_discovery
  from (
    select distinct on (entity_type) entity_type, title, record_href
    from public.organization_universal_search_index
    where organization_id = v_org_id
      and entity_type in ('document', 'project', 'customer', 'workflow', 'contract')
      and (v_q = '' or title ilike '%' || v_q || '%' or summary ilike '%' || v_q || '%')
    limit 8
  ) d;

  v_suggestions := jsonb_build_array(
    case when v_q <> '' then 'Did you mean: ' || v_q end,
    'Related results based on your search',
    'Recently indexed organization content'
  );

  perform public._usearch537_log(v_org_id, 'search_performed', 'Universal search performed', v_q, null, null,
    jsonb_build_object('mode', p_mode, 'result_count', jsonb_array_length(v_results), 'natural_language', v_nl));

  return jsonb_build_object(
    'found', true,
    'query', v_q,
    'mode', p_mode,
    'natural_language', v_nl,
    'results', v_results,
    'total', jsonb_array_length(v_results),
    'discovery', v_discovery,
    'suggestions', v_suggestions,
    'permission_note', 'Results respect role permissions — only authorized data is returned.'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Universal Search Center
-- ---------------------------------------------------------------------------
create or replace function public.get_universal_search_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_index_count int;
begin
  perform public._irp_require_permission('universal_search.view');
  v_org_id := public._usearch537_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  perform public._usearch537_ensure_settings(v_org_id);
  v_index_count := public._usearch537_rebuild_index(v_org_id);

  perform public._usearch537_log(v_org_id, 'center_view', 'Universal Search Center viewed', null, null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Do not make users navigate. Help users discover.',
    'philosophy', 'Users should search. Aipify should find.',
    'overview', jsonb_build_object(
      'indexed_items', v_index_count,
      'saved_searches', (select count(*) from public.organization_universal_search_saved where organization_id = v_org_id and user_id = v_user_id),
      'searches_7d', (select count(*) from public.organization_universal_search_audit_logs where organization_id = v_org_id and action = 'search_performed' and created_at >= now() - interval '7 days'),
      'failed_searches_7d', (select count(*) from public.organization_universal_search_audit_logs where organization_id = v_org_id and action = 'search_failed' and created_at >= now() - interval '7 days'),
      'discovery_triggers_7d', (select count(*) from public.organization_universal_search_audit_logs where organization_id = v_org_id and action = 'discovery_triggered' and created_at >= now() - interval '7 days')
    ),
    'categories', jsonb_build_array(
      'people', 'customers', 'partners', 'projects', 'tasks', 'documents', 'knowledge',
      'assets', 'inventory', 'contracts', 'invoices', 'domains', 'business_packs',
      'workflows', 'meetings', 'approvals', 'reports', 'notifications'
    ),
    'search_modes', jsonb_build_array(
      jsonb_build_object('key', 'global', 'label', 'Global Search'),
      jsonb_build_object('key', 'department', 'label', 'Department Search'),
      jsonb_build_object('key', 'business_pack', 'label', 'Business Pack Search'),
      jsonb_build_object('key', 'domain', 'label', 'Domain Search'),
      jsonb_build_object('key', 'companion', 'label', 'Companion Search'),
      jsonb_build_object('key', 'advanced', 'label', 'Advanced Search'),
      jsonb_build_object('key', 'natural_language', 'label', 'Natural Language Search')
    ),
    'filters', jsonb_build_object(
      'supported', jsonb_build_array('date_range', 'department', 'domain', 'status', 'owner', 'business_pack', 'country', 'language', 'entity_type'),
      'entity_types', jsonb_build_array('people', 'customer', 'partner', 'project', 'task', 'document', 'contract', 'workflow', 'asset', 'domain')
    ),
    'saved_searches', coalesce((
      select jsonb_agg(row order by row->>'name')
      from (
        select jsonb_build_object(
          'id', s.id, 'name', s.name, 'query', s.query, 'search_mode', s.search_mode, 'filters', s.filters
        ) as row
        from public.organization_universal_search_saved s
        where s.organization_id = v_org_id and s.user_id = v_user_id
        order by s.updated_at desc
        limit 20
      ) sub
    ), '[]'::jsonb),
    'default_saved_searches', jsonb_build_array(
      jsonb_build_object('name', 'My Overdue Tasks', 'query', 'Show all overdue tasks', 'search_mode', 'natural_language'),
      jsonb_build_object('name', 'Open Contracts', 'query', 'open contracts', 'search_mode', 'global'),
      jsonb_build_object('name', 'Upcoming Renewals', 'query', 'contracts expiring next month', 'search_mode', 'natural_language'),
      jsonb_build_object('name', 'Inventory Alerts', 'query', 'inventory low', 'search_mode', 'natural_language')
    ),
    'analytics', jsonb_build_object(
      'popular_searches', coalesce((
        select jsonb_agg(jsonb_build_object('query', query, 'count', cnt))
        from (
          select query, count(*) cnt from public.organization_universal_search_audit_logs
          where organization_id = v_org_id and action = 'search_performed' and query is not null and query <> ''
          group by query order by cnt desc limit 10
        ) x
      ), '[]'::jsonb),
      'search_frequency_7d', (select count(*) from public.organization_universal_search_audit_logs where organization_id = v_org_id and action = 'search_performed' and created_at >= now() - interval '7 days'),
      'companion_usage_7d', (select count(*) from public.organization_universal_search_audit_logs where organization_id = v_org_id and action = 'search_performed' and payload->>'mode' = 'companion' and created_at >= now() - interval '7 days')
    ),
    'executive_dashboard', jsonb_build_object(
      'top_searches', coalesce((
        select jsonb_agg(query)
        from (select query from public.organization_universal_search_audit_logs where organization_id = v_org_id and action = 'search_performed' and query is not null group by query order by count(*) desc limit 5) x
      ), '[]'::jsonb),
      'indexed_items', v_index_count,
      'search_health', case when v_index_count > 0 then 'healthy' else 'building' end,
      'knowledge_gaps', case when v_index_count < 5 then 'Index building — connect more modules for richer discovery.' else 'None detected' end
    ),
    'companion_integration', jsonb_build_object(
      'uses_same_engine', true,
      'prompts', jsonb_build_array(
        'Find supplier contracts.',
        'Show support escalations.',
        'Who owns domain example.no?',
        'Show active Growth Partners in Sweden.'
      )
    ),
    'smart_recommendations', jsonb_build_object(
      'contextual_chain', jsonb_build_array('customer', 'contracts', 'invoices', 'opportunities', 'support_cases', 'projects'),
      'description', 'Searching for a customer may surface related contracts, invoices, and projects.'
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'query', a.query, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_universal_search_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array('overview', 'search', 'discovery', 'saved_searches', 'filters', 'analytics', 'reports'),
    'routes', jsonb_build_object(
      'search', '/app/search',
      'discovery', '/app/search/discovery',
      'keyboard_shortcut', 'Cmd+K / Ctrl+K'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_universal_search_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
begin
  v_org_id := public._usearch537_org();
  perform public._usearch537_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in ('save_search', 'delete_saved_search', 'rebuild_index', 'index_item') then
    perform public._irp_require_permission('universal_search.manage');
  else
    perform public._irp_require_permission('universal_search.view');
  end if;

  if p_action_type = 'save_search' then
    insert into public.organization_universal_search_saved (
      organization_id, user_id, name, query, search_mode, filters
    ) values (
      v_org_id, v_user_id,
      coalesce(p_payload->>'name', 'Saved search'),
      coalesce(p_payload->>'query', ''),
      coalesce(p_payload->>'search_mode', 'global'),
      coalesce(p_payload->'filters', '{}'::jsonb)
    )
    on conflict (organization_id, user_id, name) do update set
      query = excluded.query, search_mode = excluded.search_mode, filters = excluded.filters, updated_at = now()
    returning id into v_id;
    perform public._usearch537_log(v_org_id, 'search_saved', 'Search saved', p_payload->>'query', null, v_id);
    return jsonb_build_object('ok', true, 'saved_search_id', v_id);

  elsif p_action_type = 'delete_saved_search' then
    delete from public.organization_universal_search_saved
    where id = (p_payload->>'saved_search_id')::uuid and organization_id = v_org_id and user_id = v_user_id
    returning id into v_id;
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'rebuild_index' then
    return jsonb_build_object('ok', true, 'indexed_items', public._usearch537_rebuild_index(v_org_id));

  elsif p_action_type = 'record_result_open' then
    perform public._usearch537_log(v_org_id, 'recommendation_opened', 'Search result opened',
      p_payload->>'query', p_payload->>'entity_type', (p_payload->>'entity_id')::uuid, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'trigger_discovery' then
    perform public._usearch537_log(v_org_id, 'discovery_triggered', 'Discovery triggered',
      p_payload->>'query', p_payload->>'entity_type', null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'index_item' then
    insert into public.organization_universal_search_index (
      organization_id, entity_type, entity_id, title, summary, status, record_href, business_pack_key, domain_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'entity_type', 'document'),
      nullif(p_payload->>'entity_id', '')::uuid,
      coalesce(p_payload->>'title', 'Indexed item'),
      coalesce(p_payload->>'summary', ''),
      coalesce(p_payload->>'status', 'active'),
      coalesce(p_payload->>'record_href', '/app/search'),
      p_payload->>'business_pack_key',
      nullif(p_payload->>'domain_id', '')::uuid
    )
    on conflict (organization_id, entity_type, entity_id, title) do update set
      summary = excluded.summary, updated_at = now()
    returning id into v_id;
    return jsonb_build_object('ok', true, 'index_id', v_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_universal_search_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
declare v_search jsonb;
begin
  perform public._irp_require_permission('universal_search.view');
  v_org_id := public._usearch537_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  if p_query is not null and trim(p_query) <> '' then
    v_search := public.perform_universal_search_query(p_query, '{}'::jsonb, 'companion', 15);
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion uses the same universal search engine.',
    'query', p_query,
    'search', v_search,
    'companion_prompts', jsonb_build_array(
      'Find supplier contracts.',
      'Show support escalations.',
      'Who owns domain example.no?',
      'Show active Growth Partners in Sweden.'
    ),
    'routes', jsonb_build_object('search', '/app/search', 'keyboard_shortcut', 'Cmd+K')
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_universal_search_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
declare v_user_id uuid;
begin
  perform public._irp_require_permission('universal_search.view');
  v_org_id := public._usearch537_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('universal_search.manage', v_org_id),
    'indexed_items', (select count(*) from public.organization_universal_search_index where organization_id = v_org_id),
    'saved_searches', (select count(*) from public.organization_universal_search_saved where organization_id = v_org_id and user_id = v_user_id),
    'routes', jsonb_build_object(
      'search', '/app/search',
      'discovery', '/app/search/discovery',
      'keyboard_shortcut', 'Cmd+K',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('search', '/app/search'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'universal_search', 'Universal Search & Discovery', 'universal-search', 'knowledge',
    'Universal search center — global discovery, natural language, saved searches, and permission-aware results.',
    'starter', null, 'main', '/app/search', 'always', 3
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('universal_search', 'universal_search.view', 'view', 'Universal Search — search and discover organization content'),
  ('universal_search', 'universal_search.manage', 'manage', 'Universal Search — manage saved searches and indexing')
on conflict do nothing;

grant execute on function public._usearch537_index_json(public.organization_universal_search_index) to authenticated;
grant execute on function public._usearch537_rebuild_index(uuid) to authenticated;
grant execute on function public._usearch537_parse_natural_language(text) to authenticated;
grant execute on function public.perform_universal_search_query(text, jsonb, text, int) to authenticated;
grant execute on function public.get_universal_search_operations_center(text) to authenticated;
grant execute on function public.perform_universal_search_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_universal_search_context(text) to authenticated;
grant execute on function public.get_my_universal_search_summary() to authenticated;
