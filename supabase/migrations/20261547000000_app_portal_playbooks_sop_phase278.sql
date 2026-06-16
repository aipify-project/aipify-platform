-- Phase 278 (APP) — Organizational Playbooks & SOP Center

create table if not exists public.app_portal_playbooks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'customer_support', 'employee_onboarding', 'incident_response', 'security_procedures',
    'billing_operations', 'approval_processes', 'business_pack_operations',
    'integration_management', 'executive_processes', 'custom'
  )),
  owner_id uuid references public.users (id) on delete set null,
  contributor_ids jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in (
    'draft', 'active', 'under_review', 'archived'
  )),
  version_number integer not null default 1,
  review_frequency text check (review_frequency is null or review_frequency in (
    'monthly', 'quarterly', 'semi_annual', 'annual'
  )),
  last_reviewed_date date,
  related_modules jsonb not null default '[]'::jsonb,
  related_knowledge_articles jsonb not null default '[]'::jsonb,
  notes text not null default '',
  access_count integer not null default 0,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_playbooks_company_idx
  on public.app_portal_playbooks (company_id, category, status, updated_at desc);

create table if not exists public.app_portal_playbook_steps (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.app_portal_playbooks (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  step_order integer not null default 1,
  title text not null default '',
  description text not null default '',
  responsible_role text not null default '',
  requires_approval boolean not null default false,
  related_resources jsonb not null default '[]'::jsonb,
  checklist_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_playbook_steps_playbook_idx
  on public.app_portal_playbook_steps (playbook_id, step_order);

create table if not exists public.app_portal_playbook_versions (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.app_portal_playbooks (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  version_number integer not null,
  change_summary text not null default '',
  snapshot jsonb not null default '{}'::jsonb,
  updated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_playbook_versions_playbook_idx
  on public.app_portal_playbook_versions (playbook_id, version_number desc);

create table if not exists public.app_portal_playbook_audit_logs (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.app_portal_playbooks (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_playbook_audit_idx
  on public.app_portal_playbook_audit_logs (playbook_id, created_at desc);

alter table public.app_portal_playbooks enable row level security;
alter table public.app_portal_playbook_steps enable row level security;
alter table public.app_portal_playbook_versions enable row level security;
alter table public.app_portal_playbook_audit_logs enable row level security;
revoke all on public.app_portal_playbooks from authenticated, anon;
revoke all on public.app_portal_playbook_steps from authenticated, anon;
revoke all on public.app_portal_playbook_versions from authenticated, anon;
revoke all on public.app_portal_playbook_audit_logs from authenticated, anon;

create or replace function public._appb278_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', (v_access->>'organization_role') in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._appb278_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._appb278_needs_review(p_last_reviewed date, p_status text)
returns boolean
language sql
stable
as $$
  select p_status in ('active', 'under_review')
    and (p_last_reviewed is null or p_last_reviewed < current_date - interval '90 days');
$$;

create or replace function public._appb278_step_row(s public.app_portal_playbook_steps)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', s.id,
    'step_order', s.step_order,
    'title', s.title,
    'description', left(s.description, 1000),
    'responsible_role', s.responsible_role,
    'requires_approval', s.requires_approval,
    'related_resources', s.related_resources,
    'checklist_items', s.checklist_items
  );
$$;

create or replace function public._appb278_playbook_row(p public.app_portal_playbooks)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'description', left(p.description, 500),
    'category', p.category,
    'owner_id', p.owner_id,
    'owner_name', public._appb278_user_name(p.owner_id),
    'contributor_ids', p.contributor_ids,
    'status', p.status,
    'version_number', p.version_number,
    'review_frequency', p.review_frequency,
    'last_reviewed_date', p.last_reviewed_date,
    'related_modules', p.related_modules,
    'related_knowledge_articles', p.related_knowledge_articles,
    'notes', left(p.notes, 300),
    'access_count', p.access_count,
    'needs_review', public._appb278_needs_review(p.last_reviewed_date, p.status),
    'created_at', p.created_at,
    'updated_at', p.updated_at
  );
end;
$$;

create or replace function public._appb278_build_recommendations(p_items jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_item jsonb;
begin
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if (v_item->>'owner_id') is null and (v_item->>'status') <> 'archived' then
      v_recs := v_recs || jsonb_build_object('id', 'owner-' || (v_item->>'id'), 'key', 'addOwnership', 'playbook_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'needs_review')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || (v_item->>'id'), 'key', 'reviewOutdated', 'playbook_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'status') = 'draft' then
      v_recs := v_recs || jsonb_build_object('id', 'activate-' || (v_item->>'id'), 'key', 'activateDraft', 'playbook_id', v_item->>'id', 'priority', 'low');
    end if;
  end loop;
  if jsonb_array_length(v_recs) = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'create-recurring', 'key', 'createRecurring', 'priority', 'low');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'update-changes', 'key', 'updateAfterChanges', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public._appb278_save_version(
  p_playbook_id uuid,
  p_company_id uuid,
  p_version_number integer,
  p_change_summary text,
  p_updated_by uuid,
  p_snapshot jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_portal_playbook_versions (
    playbook_id, company_id, version_number, change_summary, snapshot, updated_by
  ) values (
    p_playbook_id, p_company_id, p_version_number,
    left(coalesce(p_change_summary, ''), 500),
    coalesce(p_snapshot, '{}'::jsonb),
    p_updated_by
  );
end;
$$;

create or replace function public._appb278_replace_steps(
  p_playbook_id uuid,
  p_company_id uuid,
  p_steps jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_step jsonb;
  v_order integer := 0;
begin
  delete from public.app_portal_playbook_steps where playbook_id = p_playbook_id;

  if p_steps is null or jsonb_typeof(p_steps) <> 'array' then return; end if;

  for v_step in select * from jsonb_array_elements(p_steps)
  loop
    v_order := v_order + 1;
    insert into public.app_portal_playbook_steps (
      playbook_id, company_id, step_order, title, description,
      responsible_role, requires_approval, related_resources, checklist_items
    ) values (
      p_playbook_id,
      p_company_id,
      coalesce((v_step->>'step_order')::integer, v_order),
      left(coalesce(v_step->>'title', ''), 200),
      left(coalesce(v_step->>'description', ''), 3000),
      left(coalesce(v_step->>'responsible_role', ''), 120),
      coalesce((v_step->>'requires_approval')::boolean, false),
      coalesce(v_step->'related_resources', '[]'::jsonb),
      coalesce(v_step->'checklist_items', '[]'::jsonb)
    );
  end loop;
end;
$$;

create or replace function public.list_app_portal_playbooks(
  p_category text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_review_before date default null,
  p_recently_updated boolean default null,
  p_related_module text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_active integer := 0;
  v_draft integer := 0;
  v_archived integer := 0;
  v_needs_review integer := 0;
  v_recent jsonb := '[]'::jsonb;
  v_frequent jsonb := '[]'::jsonb;
begin
  v_ctx := public._appb278_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._appb278_playbook_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_playbooks p
  where p.company_id = v_company_id
    and (p_category is null or p.category = p_category)
    and (p_owner_id is null or p.owner_id = p_owner_id)
    and (p_status is null or p.status = p_status)
    and (p_review_before is null or p.last_reviewed_date <= p_review_before)
    and (
      p_recently_updated is null or p_recently_updated = false
      or p.updated_at >= now() - interval '30 days'
    )
    and (
      p_related_module is null
      or coalesce(p.related_modules, '[]'::jsonb) @> jsonb_build_array(p_related_module)
    )
    and (
      p_search is null or trim(p_search) = ''
      or p.title ilike '%' || trim(p_search) || '%'
      or p.description ilike '%' || trim(p_search) || '%'
      or p.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active from public.app_portal_playbooks p where p.company_id = v_company_id and p.status = 'active';
  select count(*)::int into v_draft from public.app_portal_playbooks p where p.company_id = v_company_id and p.status = 'draft';
  select count(*)::int into v_archived from public.app_portal_playbooks p where p.company_id = v_company_id and p.status = 'archived';
  select count(*)::int into v_needs_review
  from public.app_portal_playbooks p
  where p.company_id = v_company_id and public._appb278_needs_review(p.last_reviewed_date, p.status);

  select coalesce(jsonb_agg(public._appb278_playbook_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_playbooks where company_id = v_company_id order by updated_at desc limit 5) p;

  select coalesce(jsonb_agg(public._appb278_playbook_row(p) order by p.access_count desc), '[]'::jsonb)
  into v_frequent
  from (select * from public.app_portal_playbooks where company_id = v_company_id and status = 'active' order by access_count desc limit 5) p;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'draft', v_draft,
      'archived', v_archived,
      'needs_review', v_needs_review,
      'recently_updated', v_recent,
      'most_accessed', v_frequent
    ),
    'recommendations', public._appb278_build_recommendations(v_items),
    'principle', 'Standardized playbooks preserve institutional knowledge — human teams define and maintain procedures.'
  );
end;
$$;

create or replace function public.get_app_portal_playbook(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_playbooks;
  v_steps jsonb := '[]'::jsonb;
  v_contributors jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_activity jsonb := '[]'::jsonb;
  v_versions jsonb := '[]'::jsonb;
begin
  v_ctx := public._appb278_access_context();
  select * into v_p from public.app_portal_playbooks where id = p_id;
  if v_p.id is null then return jsonb_build_object('found', false); end if;
  if v_p.company_id <> (v_ctx->>'company_id')::uuid then
    raise exception 'Playbook access denied';
  end if;

  update public.app_portal_playbooks set access_count = access_count + 1 where id = p_id;

  select coalesce(jsonb_agg(public._appb278_step_row(s) order by s.step_order), '[]'::jsonb)
  into v_steps
  from public.app_portal_playbook_steps s where s.playbook_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object('user_id', u.id, 'name', u.full_name)), '[]'::jsonb)
  into v_contributors
  from public.users u
  where u.id in (
    select t.value::uuid from jsonb_array_elements_text(coalesce(v_p.contributor_ids, '[]'::jsonb)) as t(value)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._appb278_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_playbook_audit_logs l where l.playbook_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id, 'version_number', v.version_number, 'change_summary', v.change_summary,
    'updated_by', public._appb278_user_name(v.updated_by), 'created_at', v.created_at
  ) order by v.version_number desc), '[]'::jsonb)
  into v_versions
  from public.app_portal_playbook_versions v where v.playbook_id = p_id;

  v_activity := v_audit;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'playbook', public._appb278_playbook_row(v_p) || jsonb_build_object(
      'description_full', v_p.description,
      'notes_full', v_p.notes
    ),
    'steps', v_steps,
    'contributors', v_contributors,
    'version_history', v_versions,
    'activity_timeline', v_activity,
    'audit_history', v_audit,
    'recommendations', public._appb278_build_recommendations(jsonb_build_array(public._appb278_playbook_row(v_p)))
  );
end;
$$;

create or replace function public.create_app_portal_playbook(
  p_title text,
  p_description text default '',
  p_category text default 'custom',
  p_owner_id uuid default null,
  p_contributor_ids jsonb default '[]'::jsonb,
  p_status text default 'draft',
  p_review_frequency text default null,
  p_related_modules jsonb default '[]'::jsonb,
  p_related_knowledge_articles jsonb default '[]'::jsonb,
  p_notes text default '',
  p_steps jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_p public.app_portal_playbooks;
  v_snapshot jsonb;
begin
  v_ctx := public._appb278_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Playbook creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_playbooks (
    company_id, title, description, category, owner_id, contributor_ids, status,
    review_frequency, related_modules, related_knowledge_articles, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'custom'),
    p_owner_id,
    coalesce(p_contributor_ids, '[]'::jsonb),
    coalesce(nullif(trim(p_status), ''), 'draft'),
    nullif(trim(p_review_frequency), ''),
    coalesce(p_related_modules, '[]'::jsonb),
    coalesce(p_related_knowledge_articles, '[]'::jsonb),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  perform public._appb278_replace_steps(v_id, v_company_id, p_steps);

  insert into public.app_portal_playbook_audit_logs (playbook_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Playbook created', v_user_id);

  select * into v_p from public.app_portal_playbooks where id = v_id;
  select jsonb_build_object(
    'playbook', public._appb278_playbook_row(v_p),
    'steps', coalesce((select jsonb_agg(public._appb278_step_row(s) order by s.step_order) from public.app_portal_playbook_steps s where s.playbook_id = v_id), '[]'::jsonb)
  ) into v_snapshot;

  perform public._appb278_save_version(v_id, v_company_id, 1, 'Initial version', v_user_id, v_snapshot);

  return jsonb_build_object('created', true, 'playbook', public._appb278_playbook_row(v_p));
end;
$$;

create or replace function public.update_app_portal_playbook(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_owner_id uuid default null,
  p_contributor_ids jsonb default null,
  p_status text default null,
  p_review_frequency text default null,
  p_last_reviewed_date date default null,
  p_related_modules jsonb default null,
  p_related_knowledge_articles jsonb default null,
  p_notes text default null,
  p_steps jsonb default null,
  p_change_summary text default null,
  p_clear_owner boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_playbooks;
  v_user_id uuid;
  v_new_version integer;
  v_snapshot jsonb;
  v_content_changed boolean := false;
begin
  v_ctx := public._appb278_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Playbook update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_playbooks where id = p_id;
  if v_p.id is null then raise exception 'Playbook not found'; end if;
  if v_p.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  v_content_changed := p_title is not null or p_description is not null or p_steps is not null or p_status is not null;

  update public.app_portal_playbooks set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    owner_id = case when p_clear_owner then null when p_owner_id is not null then p_owner_id else owner_id end,
    contributor_ids = coalesce(p_contributor_ids, contributor_ids),
    status = coalesce(nullif(trim(p_status), ''), status),
    review_frequency = case when p_review_frequency is not null then nullif(trim(p_review_frequency), '') else review_frequency end,
    last_reviewed_date = coalesce(p_last_reviewed_date, last_reviewed_date),
    related_modules = coalesce(p_related_modules, related_modules),
    related_knowledge_articles = coalesce(p_related_knowledge_articles, related_knowledge_articles),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    version_number = case when v_content_changed then version_number + 1 else version_number end,
    updated_at = now()
  where id = p_id;

  if p_steps is not null then
    perform public._appb278_replace_steps(p_id, v_p.company_id, p_steps);
  end if;

  if v_content_changed then
    select * into v_p from public.app_portal_playbooks where id = p_id;
    v_new_version := v_p.version_number;
    select jsonb_build_object(
      'playbook', public._appb278_playbook_row(v_p),
      'steps', coalesce((select jsonb_agg(public._appb278_step_row(s) order by s.step_order) from public.app_portal_playbook_steps s where s.playbook_id = p_id), '[]'::jsonb)
    ) into v_snapshot;
    perform public._appb278_save_version(
      p_id, v_p.company_id, v_new_version,
      coalesce(nullif(trim(p_change_summary), ''), 'Playbook updated'),
      v_user_id, v_snapshot
    );
  end if;

  insert into public.app_portal_playbook_audit_logs (playbook_id, company_id, event_type, description, performed_by)
  values (p_id, v_p.company_id, 'updated', coalesce(nullif(trim(p_change_summary), ''), 'Playbook updated'), v_user_id);

  select * into v_p from public.app_portal_playbooks where id = p_id;
  return jsonb_build_object('updated', true, 'playbook', public._appb278_playbook_row(v_p));
end;
$$;

create or replace function public.list_app_portal_playbook_versions(p_playbook_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_playbooks;
  v_versions jsonb := '[]'::jsonb;
begin
  v_ctx := public._appb278_access_context();
  select * into v_p from public.app_portal_playbooks where id = p_playbook_id;
  if v_p.id is null then return jsonb_build_object('found', false); end if;
  if v_p.company_id <> (v_ctx->>'company_id')::uuid then
    raise exception 'Playbook access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id,
    'version_number', v.version_number,
    'change_summary', v.change_summary,
    'updated_by', public._appb278_user_name(v.updated_by),
    'updated_by_id', v.updated_by,
    'created_at', v.created_at,
    'snapshot', v.snapshot
  ) order by v.version_number desc), '[]'::jsonb)
  into v_versions
  from public.app_portal_playbook_versions v where v.playbook_id = p_playbook_id;

  return jsonb_build_object(
    'found', true,
    'playbook_id', p_playbook_id,
    'current_version', v_p.version_number,
    'versions', v_versions
  );
end;
$$;

grant execute on function public.list_app_portal_playbooks(text, uuid, text, date, boolean, text, text) to authenticated;
grant execute on function public.get_app_portal_playbook(uuid) to authenticated;
grant execute on function public.create_app_portal_playbook(text, text, text, uuid, jsonb, text, text, jsonb, jsonb, text, jsonb) to authenticated;
grant execute on function public.update_app_portal_playbook(uuid, text, text, text, uuid, jsonb, text, text, date, jsonb, jsonb, text, jsonb, text, boolean) to authenticated;
grant execute on function public.list_app_portal_playbook_versions(uuid) to authenticated;
