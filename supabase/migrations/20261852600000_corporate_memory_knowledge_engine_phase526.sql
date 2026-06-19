-- Phase 526 — Document, Knowledge & Corporate Memory Engine
-- Knowledge should survive employee turnover. One organizational memory layer.
-- Extends: Phase 508 (documents/knowledge), knowledge_articles, organization_documents

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_corporate_memory_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enable_corporate_memory boolean not null default true,
  enable_playbooks boolean not null default true,
  enable_contributions boolean not null default true,
  companion_knowledge_enabled boolean not null default true,
  require_approval_before_publish boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_corporate_memory_settings enable row level security;
revoke all on public.organization_corporate_memory_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Playbooks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_playbooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  playbook_number text,
  playbook_key text not null default '',
  title text not null,
  description text not null default '',
  playbook_type text not null default 'operations' check (
    playbook_type in (
      'sales', 'support', 'warehouse', 'finance', 'growth_partner', 'executive', 'operations', 'custom'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'update_required', 'archived')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  owner_user_id uuid references public.users (id) on delete set null,
  processes jsonb not null default '[]'::jsonb,
  guidelines jsonb not null default '[]'::jsonb,
  templates jsonb not null default '[]'::jsonb,
  best_practices jsonb not null default '[]'::jsonb,
  version int not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, playbook_number)
);

create index if not exists organization_knowledge_playbooks_org_idx
  on public.organization_knowledge_playbooks (organization_id, status, updated_at desc);

alter table public.organization_knowledge_playbooks enable row level security;
revoke all on public.organization_knowledge_playbooks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Corporate memory items
-- ---------------------------------------------------------------------------
create table if not exists public.organization_corporate_memory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_number text,
  memory_type text not null check (
    memory_type in (
      'lessons_learned', 'project_knowledge', 'customer_knowledge', 'process_improvement',
      'department_knowledge', 'best_practice', 'employee_contribution'
    )
  ),
  title text not null,
  description text not null default '',
  content_summary text not null default '',
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'update_required', 'archived')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  owner_user_id uuid references public.users (id) on delete set null,
  related_document_id uuid references public.organization_documents (id) on delete set null,
  related_article_id uuid references public.knowledge_articles (id) on delete set null,
  tags jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, memory_number)
);

create index if not exists organization_corporate_memory_items_org_idx
  on public.organization_corporate_memory_items (organization_id, status, memory_type);

alter table public.organization_corporate_memory_items enable row level security;
revoke all on public.organization_corporate_memory_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Knowledge contributions & search audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_knowledge_contributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contribution_number text,
  contribution_type text not null check (
    contribution_type in (
      'knowledge_article', 'process_improvement', 'lessons_learned',
      'operational_recommendation', 'department_documentation'
    )
  ),
  title text not null,
  description text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'published', 'rejected')
  ),
  submitted_by_user_id uuid references public.users (id) on delete set null,
  reviewed_by_user_id uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  memory_item_id uuid references public.organization_corporate_memory_items (id) on delete set null,
  article_id uuid references public.knowledge_articles (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, contribution_number)
);

create index if not exists organization_knowledge_contributions_org_idx
  on public.organization_knowledge_contributions (organization_id, status, created_at desc);

alter table public.organization_knowledge_contributions enable row level security;
revoke all on public.organization_knowledge_contributions from authenticated, anon;

create table if not exists public.organization_knowledge_search_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  query_text text not null,
  result_count int not null default 0,
  search_scope text not null default 'all',
  created_at timestamptz not null default now()
);

create index if not exists organization_knowledge_search_logs_org_idx
  on public.organization_knowledge_search_logs (organization_id, created_at desc);

alter table public.organization_knowledge_search_logs enable row level security;
revoke all on public.organization_knowledge_search_logs from authenticated, anon;

create table if not exists public.organization_corporate_memory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_corporate_memory_audit_org_idx
  on public.organization_corporate_memory_audit_logs (organization_id, created_at desc);

alter table public.organization_corporate_memory_audit_logs enable row level security;
revoke all on public.organization_corporate_memory_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cm526_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._cm526_user()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_app_user_id();
$$;

create or replace function public._cm526_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_corporate_memory_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id,
    public._cm526_user(),
    p_action, p_summary, p_entity_type, p_entity_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._cm526_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._cm526_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_corporate_memory_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cm526_article_json(p_row public.knowledge_articles)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'knowledge_id', p_row.slug,
    'title', p_row.title,
    'description', coalesce(p_row.summary, ''),
    'category', coalesce(p_row.knowledge_category, ''),
    'status', p_row.status,
    'version', coalesce(p_row.version, 1),
    'department_id', p_row.department_id,
    'domain_id', p_row.domain_id,
    'business_pack_key', p_row.business_pack_key,
    'owner_user_id', p_row.owner_user_id,
    'tags', p_row.tags,
    'view_count', p_row.view_count,
    'updated_at', p_row.updated_at
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Corporate Memory Center (Knowledge Center)
-- ---------------------------------------------------------------------------
create or replace function public.get_corporate_memory_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('corporate_memory.view');
  v_org_id := public._cm526_org();
  perform public._cm526_ensure_settings(v_org_id);
  perform public._cm526_log(v_org_id, 'center_view', 'Corporate Memory Center viewed', 'center', null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Knowledge should survive employee turnover. Documents should not be lost.',
    'philosophy', 'Documents store information. Knowledge creates understanding. Experience creates wisdom.',
    'overview', jsonb_build_object(
      'published_articles', (
        select count(*) from public.knowledge_articles
        where organization_id = v_org_id and status = 'published'
      ),
      'published_documents', (
        select count(*) from public.organization_documents
        where organization_id = v_org_id and status = 'published'
      ),
      'playbooks', (
        select count(*) from public.organization_knowledge_playbooks
        where organization_id = v_org_id and status = 'published'
      ),
      'corporate_memory_items', (
        select count(*) from public.organization_corporate_memory_items
        where organization_id = v_org_id and status = 'published'
      ),
      'pending_contributions', (
        select count(*) from public.organization_knowledge_contributions
        where organization_id = v_org_id and status = 'pending'
      ),
      'pending_reviews', (
        select count(*) from public.knowledge_articles
        where organization_id = v_org_id and status in ('draft', 'review')
      ) + (
        select count(*) from public.organization_documents
        where organization_id = v_org_id and status = 'under_review'
      ),
      'templates', (
        select count(*) from public.organization_document_templates
        where organization_id = v_org_id or is_system = true
      )
    ),
    'knowledge_articles', coalesce((
      select jsonb_agg(public._cm526_article_json(a) order by a.updated_at desc)
      from (
        select * from public.knowledge_articles
        where organization_id = v_org_id and status <> 'archived'
        order by updated_at desc limit 40
      ) a
    ), '[]'::jsonb),
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'document_number', d.document_number, 'title', d.title,
        'category', d.category, 'status', d.status, 'file_type', d.file_type,
        'version', d.version, 'department_id', d.department_id, 'domain_id', d.domain_id,
        'business_pack_key', d.business_pack_key, 'updated_at', d.updated_at
      ) order by d.updated_at desc)
      from public.organization_documents d
      where d.organization_id = v_org_id and d.status <> 'archived'
      limit 40
    ), '[]'::jsonb),
    'policies', coalesce((
      select jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status, 'version', d.version))
      from public.organization_documents d
      where d.organization_id = v_org_id and d.category = 'policies' and d.status <> 'archived'
      limit 30
    ), '[]'::jsonb),
    'procedures', coalesce((
      select jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status, 'version', d.version))
      from public.organization_documents d
      where d.organization_id = v_org_id and d.category = 'procedures' and d.status <> 'archived'
      limit 30
    ), '[]'::jsonb),
    'playbooks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'playbook_number', p.playbook_number, 'title', p.title,
        'playbook_type', p.playbook_type, 'status', p.status, 'version', p.version,
        'business_pack_key', p.business_pack_key, 'updated_at', p.updated_at
      ) order by p.updated_at desc)
      from public.organization_knowledge_playbooks p
      where p.organization_id = v_org_id and p.status <> 'archived'
      limit 30
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_key', t.template_key, 'name', t.name,
        'category', t.category, 'file_type', t.file_type, 'business_pack_key', t.business_pack_key
      ) order by t.name)
      from public.organization_document_templates t
      where t.organization_id = v_org_id or t.is_system = true
      limit 40
    ), '[]'::jsonb),
    'corporate_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_number', m.memory_number, 'title', m.title,
        'memory_type', m.memory_type, 'status', m.status, 'updated_at', m.updated_at
      ) order by m.updated_at desc)
      from public.organization_corporate_memory_items m
      where m.organization_id = v_org_id and m.status <> 'archived'
      limit 30
    ), '[]'::jsonb),
    'contributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'contribution_number', c.contribution_number, 'title', c.title,
        'contribution_type', c.contribution_type, 'status', c.status, 'created_at', c.created_at
      ) order by c.created_at desc)
      from public.organization_knowledge_contributions c
      where c.organization_id = v_org_id
      limit 30
    ), '[]'::jsonb),
    'pending_contributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'contribution_type', c.contribution_type
      ) order by c.created_at)
      from public.organization_knowledge_contributions c
      where c.organization_id = v_org_id and c.status = 'pending'
      limit 20
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'knowledge_usage_month', (
        select count(*) from public.organization_knowledge_search_logs
        where organization_id = v_org_id and created_at >= date_trunc('month', now())
      ),
      'document_views_estimate', (
        select coalesce(sum(view_count), 0) from public.knowledge_articles where organization_id = v_org_id
      ),
      'most_used_articles', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'view_count', view_count) order by view_count desc)
        from (
          select title, view_count from public.knowledge_articles
          where organization_id = v_org_id and status = 'published'
          order by view_count desc nulls last limit 5
        ) x
      ), '[]'::jsonb),
      'missing_knowledge_gaps', (
        select count(*) from public.employee_knowledge_gaps g
        where g.tenant_id = v_org_id and g.status = 'open'
      ),
      'companion_searches', (
        select count(*) from public.organization_knowledge_search_logs
        where organization_id = v_org_id and search_scope = 'companion'
      )
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_corporate_memory_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'knowledge_statuses', jsonb_build_array('draft', 'review', 'published', 'update_required', 'archived'),
    'categories', jsonb_build_array(
      'policies', 'procedures', 'training', 'playbooks', 'guides', 'templates', 'faq',
      'operations', 'support', 'compliance', 'finance', 'custom'
    ),
    'sections', jsonb_build_array(
      'overview', 'articles', 'documents', 'policies', 'procedures', 'playbooks',
      'templates', 'corporate_memory', 'search', 'reports'
    ),
    'routes', jsonb_build_object(
      'knowledge', '/app/knowledge',
      'documents', '/app/documents',
      'playbooks', '/app/playbooks'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_corporate_memory_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_user uuid;
begin
  v_org_id := public._cm526_org();
  v_user := public._cm526_user();
  perform public._cm526_ensure_settings(v_org_id);

  if p_action_type = 'log_search' then
    perform public._irp_require_permission('corporate_memory.view');
    insert into public.organization_knowledge_search_logs (
      organization_id, actor_user_id, query_text, result_count, search_scope
    ) values (
      v_org_id, v_user,
      coalesce(p_payload->>'query', ''),
      coalesce((p_payload->>'result_count')::int, 0),
      coalesce(p_payload->>'search_scope', 'all')
    );
    perform public._cm526_log(v_org_id, 'knowledge_searched', 'Knowledge searched', null, null, p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type in (
    'create_playbook', 'publish_playbook', 'create_memory_item', 'publish_memory_item',
    'submit_contribution', 'approve_contribution', 'reject_contribution', 'publish_article'
  ) then
    perform public._irp_require_permission('corporate_memory.manage');
  else
    perform public._irp_require_permission('corporate_memory.view');
  end if;

  if p_action_type = 'create_playbook' then
    insert into public.organization_knowledge_playbooks (
      organization_id, playbook_number, playbook_key, title, description,
      playbook_type, status, department_id, domain_id, business_pack_key, owner_user_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'playbook_number', public._cm526_next_number(v_org_id, 'PB', 'organization_knowledge_playbooks')),
      coalesce(p_payload->>'playbook_key', 'playbook-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'Playbook'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'playbook_type', 'operations'),
      'draft',
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user)
    ) returning id into v_id;
    perform public._cm526_log(v_org_id, 'playbook_created', 'Playbook created', 'playbook', v_id, p_payload);
    return jsonb_build_object('ok', true, 'playbook_id', v_id);

  elsif p_action_type = 'publish_playbook' then
    v_id := (p_payload->>'playbook_id')::uuid;
    update public.organization_knowledge_playbooks set
      status = 'published', published_at = now(), version = version + 1, updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._cm526_log(v_org_id, 'playbook_published', 'Playbook published', 'playbook', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_memory_item' then
    insert into public.organization_corporate_memory_items (
      organization_id, memory_number, memory_type, title, description, content_summary,
      department_id, domain_id, business_pack_key, owner_user_id, status
    ) values (
      v_org_id,
      coalesce(p_payload->>'memory_number', public._cm526_next_number(v_org_id, 'MEM', 'organization_corporate_memory_items')),
      coalesce(p_payload->>'memory_type', 'lessons_learned'),
      coalesce(p_payload->>'title', 'Memory item'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'content_summary', ''),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user),
      coalesce(p_payload->>'status', 'draft')
    ) returning id into v_id;
    perform public._cm526_log(v_org_id, 'memory_created', 'Corporate memory item created', 'memory', v_id, p_payload);
    return jsonb_build_object('ok', true, 'memory_id', v_id);

  elsif p_action_type = 'publish_memory_item' then
    v_id := (p_payload->>'memory_id')::uuid;
    update public.organization_corporate_memory_items set
      status = 'published', published_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._cm526_log(v_org_id, 'memory_published', 'Corporate memory published', 'memory', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'submit_contribution' then
    insert into public.organization_knowledge_contributions (
      organization_id, contribution_number, contribution_type, title, description,
      submitted_by_user_id, status
    ) values (
      v_org_id,
      coalesce(p_payload->>'contribution_number', public._cm526_next_number(v_org_id, 'CON', 'organization_knowledge_contributions')),
      coalesce(p_payload->>'contribution_type', 'knowledge_article'),
      coalesce(p_payload->>'title', 'Contribution'),
      coalesce(p_payload->>'description', ''),
      v_user,
      'pending'
    ) returning id into v_id;
    perform public._cm526_log(v_org_id, 'contribution_submitted', 'Knowledge contribution submitted', 'contribution', v_id, p_payload);
    return jsonb_build_object('ok', true, 'contribution_id', v_id);

  elsif p_action_type = 'approve_contribution' then
    v_id := (p_payload->>'contribution_id')::uuid;
    update public.organization_knowledge_contributions set
      status = 'approved', reviewed_by_user_id = v_user, reviewed_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._cm526_log(v_org_id, 'contribution_approved', 'Knowledge contribution approved', 'contribution', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_contribution' then
    v_id := (p_payload->>'contribution_id')::uuid;
    update public.organization_knowledge_contributions set
      status = 'rejected', reviewed_by_user_id = v_user, reviewed_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._cm526_log(v_org_id, 'contribution_rejected', 'Knowledge contribution rejected', 'contribution', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'publish_article' then
    v_id := (p_payload->>'article_id')::uuid;
    update public.knowledge_articles set
      status = 'published', published_at = coalesce(published_at, now()), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._cm526_log(v_org_id, 'knowledge_published', 'Knowledge article published', 'article', v_id, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_corporate_memory_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_search jsonb;
begin
  perform public._irp_require_permission('corporate_memory.view');
  v_org_id := public._cm526_org();
  perform public._cm526_ensure_settings(v_org_id);

  if p_query is not null and length(trim(p_query)) > 0 then
    v_search := public.search_global_knowledge_documents(trim(p_query), '{}'::jsonb);
    perform public.perform_corporate_memory_action('log_search', jsonb_build_object(
      'query', trim(p_query),
      'result_count', coalesce(jsonb_array_length(v_search->'documents'), 0) + coalesce(jsonb_array_length(v_search->'knowledge_articles'), 0),
      'search_scope', 'companion'
    ));
  else
    v_search := '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion answers using approved company knowledge.',
    'query', p_query,
    'search_results', v_search,
    'published_policies', coalesce((
      select jsonb_agg(jsonb_build_object('title', d.title))
      from public.organization_documents d
      where d.organization_id = v_org_id and d.category = 'policies' and d.status = 'published'
      limit 5
    ), '[]'::jsonb),
    'published_procedures', coalesce((
      select jsonb_agg(jsonb_build_object('title', d.title))
      from public.organization_documents d
      where d.organization_id = v_org_id and d.category = 'procedures' and d.status = 'published'
      limit 5
    ), '[]'::jsonb),
    'playbooks', coalesce((
      select jsonb_agg(jsonb_build_object('title', p.title, 'playbook_type', p.playbook_type))
      from public.organization_knowledge_playbooks p
      where p.organization_id = v_org_id and p.status = 'published'
      limit 5
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'How does onboarding work?',
      'Show warehouse process.',
      'Find the invoice approval procedure.',
      'Show the latest finance policy.'
    ),
    'routes', jsonb_build_object('knowledge', '/app/knowledge', 'documents', '/app/documents', 'playbooks', '/app/playbooks')
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_corporate_memory_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('corporate_memory.view');
  v_org_id := public._cm526_org();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('corporate_memory.manage', v_org_id),
    'pending_contributions', (
      select count(*) from public.organization_knowledge_contributions
      where organization_id = v_org_id and status = 'pending'
    ),
    'pending_reviews', (
      select count(*) from public.knowledge_articles
      where organization_id = v_org_id and status in ('draft', 'review')
    ),
    'routes', jsonb_build_object(
      'knowledge', '/app/knowledge',
      'documents', '/app/documents',
      'playbooks', '/app/playbooks',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('knowledge', '/app/knowledge'));
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'corporate_memory', 'Corporate Memory', 'corporate_memory', 'knowledge',
    'Documents, knowledge articles, playbooks, templates, and organizational memory.',
    'starter', null, 'knowledge', '/app/knowledge', 'licensed', 8
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('corporate_memory', 'corporate_memory.view', 'view', 'Corporate Memory — view knowledge, documents, playbooks, and search'),
    ('corporate_memory', 'corporate_memory.manage', 'manage', 'Corporate Memory — manage knowledge, contributions, playbooks, and publishing')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('corporate_memory', 'corporate_memory.view', 'view', 'Corporate Memory — view knowledge, documents, playbooks, and search'),
    ('corporate_memory', 'corporate_memory.manage', 'manage', 'Corporate Memory — manage knowledge, contributions, playbooks, and publishing')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_corporate_memory_center(text) to authenticated;
grant execute on function public.perform_corporate_memory_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_corporate_memory_context(text) to authenticated;
grant execute on function public.get_my_corporate_memory_summary() to authenticated;
