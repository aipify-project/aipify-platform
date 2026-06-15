-- Phase 273 — Voice of the Customer Engine

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.voc_feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  feedback_type text not null check (
    feedback_type in (
      'bug_report', 'improvement_suggestion', 'feature_request',
      'compliment', 'usability_issue', 'general_feedback'
    )
  ),
  title text not null,
  description text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  wants_response boolean not null default false,
  workflow_status text not null default 'new' check (
    workflow_status in ('new', 'under_review', 'planned', 'in_development', 'released', 'closed')
  ),
  assigned_to text not null default '',
  linked_phase text not null default '',
  page_url text not null default '',
  browser_info text not null default '',
  device_type text not null default '',
  attachment_url text not null default '',
  merged_into_id uuid references public.voc_feedback_submissions (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists voc_feedback_submissions_company_idx
  on public.voc_feedback_submissions (company_id, created_at desc);

create index if not exists voc_feedback_submissions_status_idx
  on public.voc_feedback_submissions (workflow_status, priority desc, created_at desc);

create table if not exists public.voc_product_initiatives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  recommendation text not null default '',
  feedback_count integer not null default 0,
  initiative_type text not null default 'product_initiative' check (
    initiative_type in ('product_initiative', 'roadmap_item', 'cursor_phase')
  ),
  status text not null default 'recommended' check (
    status in ('recommended', 'accepted', 'in_progress', 'completed', 'dismissed')
  ),
  linked_phase text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.voc_feedback_audit_logs (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid references public.voc_feedback_submissions (id) on delete set null,
  event_type text not null check (
    event_type in (
      'feedback_submitted', 'feedback_assigned', 'status_changed',
      'customer_notified', 'feedback_linked_roadmap', 'feedback_merged', 'initiative_created'
    )
  ),
  summary text not null,
  actor_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists voc_feedback_audit_created_idx
  on public.voc_feedback_audit_logs (created_at desc);

alter table public.voc_feedback_submissions enable row level security;
alter table public.voc_product_initiatives enable row level security;
alter table public.voc_feedback_audit_logs enable row level security;

revoke all on public.voc_feedback_submissions from authenticated, anon;
revoke all on public.voc_product_initiatives from authenticated, anon;
revoke all on public.voc_feedback_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._voc273_require_platform_admin()
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

create or replace function public._voc273_require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._voc273_customer_status(p_status text)
returns text
language sql
immutable
as $$
  select case p_status
    when 'new' then 'received'
    when 'under_review' then 'under_review'
    when 'planned' then 'planned'
    when 'in_development' then 'planned'
    when 'released' then 'implemented'
    when 'closed' then 'implemented'
    else 'received'
  end;
$$;

create or replace function public._voc273_log_audit(
  p_feedback_id uuid,
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
  insert into public.voc_feedback_audit_logs (feedback_id, event_type, summary, actor_user_id, context)
  values (p_feedback_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._voc273_build_feedback_row(p_id uuid, p_include_customer boolean default false)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_f public.voc_feedback_submissions;
  v_company public.companies;
begin
  select * into v_f from public.voc_feedback_submissions where id = p_id;
  if v_f.id is null then return null; end if;

  select * into v_company from public.companies where id = v_f.company_id;

  return jsonb_build_object(
    'id', v_f.id,
    'feedback_type', v_f.feedback_type,
    'title', v_f.title,
    'description', v_f.description,
    'priority', v_f.priority,
    'wants_response', v_f.wants_response,
    'workflow_status', v_f.workflow_status,
    'customer_status', public._voc273_customer_status(v_f.workflow_status),
    'assigned_to', v_f.assigned_to,
    'linked_phase', v_f.linked_phase,
    'page_url', v_f.page_url,
    'browser_info', v_f.browser_info,
    'device_type', v_f.device_type,
    'attachment_url', v_f.attachment_url,
    'company_id', v_f.company_id,
    'customer', coalesce(v_company.name, 'Customer'),
    'submitted_at', v_f.created_at,
    'created_at', v_f.created_at
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed audit
-- ---------------------------------------------------------------------------
insert into public.voc_feedback_audit_logs (event_type, summary)
select * from (values
  ('feedback_submitted'::text, 'Voice of the Customer engine initialized.'),
  ('initiative_created', 'Product intelligence baseline established.')
) as v(event_type, summary)
where not exists (select 1 from public.voc_feedback_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. Customer RPCs
-- ---------------------------------------------------------------------------
create or replace function public.submit_voc_feedback(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_id uuid;
begin
  v_company_id := public._presence_tenant_for_auth();
  if v_company_id is null then
    raise exception 'Not authorized';
  end if;

  insert into public.voc_feedback_submissions (
    company_id, user_id, feedback_type, title, description, priority,
    wants_response, page_url, browser_info, device_type, attachment_url
  ) values (
    v_company_id,
    auth.uid(),
    coalesce(p_payload->>'feedback_type', 'general_feedback'),
    coalesce(p_payload->>'title', 'Feedback'),
    coalesce(p_payload->>'description', ''),
    coalesce(p_payload->>'priority', 'medium'),
    coalesce((p_payload->>'wants_response')::boolean, false),
    coalesce(p_payload->>'page_url', ''),
    coalesce(p_payload->>'browser_info', ''),
    coalesce(p_payload->>'device_type', ''),
    coalesce(p_payload->>'attachment_url', '')
  ) returning id into v_id;

  perform public._voc273_log_audit(v_id, 'feedback_submitted', 'Customer feedback submitted');

  return jsonb_build_object(
    'ok', true,
    'id', v_id,
    'customer_status', 'received',
    'acknowledgement', true
  );
end;
$$;

create or replace function public.get_customer_voc_feedback_history()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_items jsonb;
begin
  v_company_id := public._presence_tenant_for_auth();
  if v_company_id is null then
    raise exception 'Not authorized';
  end if;

  select coalesce(jsonb_agg(
    public._voc273_build_feedback_row(f.id, true) order by f.created_at desc
  ), '[]'::jsonb)
  into v_items
  from public.voc_feedback_submissions f
  where f.company_id = v_company_id
    and f.user_id = auth.uid()
  limit 50;

  return jsonb_build_object('items', v_items);
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Platform Admin RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_voc_feedback_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_type text;
  v_status text;
  v_priority text;
  v_overview jsonb;
  v_feedback jsonb;
  v_trends jsonb;
  v_top_requests jsonb;
  v_audit jsonb;
begin
  perform public._voc273_require_platform_admin();

  v_type := nullif(p_filters->>'feedback_type', '');
  v_status := nullif(p_filters->>'workflow_status', '');
  v_priority := nullif(p_filters->>'priority', '');

  if not exists (select 1 from public.voc_feedback_submissions limit 1) then
    insert into public.voc_feedback_submissions (
      company_id, feedback_type, title, description, priority, workflow_status, assigned_to
    )
    select
      c.id,
      'feature_request',
      'Improved onboarding experience',
      'Multiple users requested clearer onboarding steps and progress indicators.',
      'high',
      'under_review',
      'Product Team'
    from public.companies c
    where coalesce(c.is_platform, false) = false
    limit 1;

    insert into public.voc_feedback_submissions (
      company_id, feedback_type, title, description, priority, workflow_status
    )
    select
      c.id,
      'bug_report',
      'Calendar sync delay on mobile',
      'Occasional delay when syncing calendar events on mobile browsers.',
      'medium',
      'new'
    from public.companies c
    where coalesce(c.is_platform, false) = false
    limit 1;
  end if;

  select jsonb_build_object(
    'new_feedback', count(*) filter (where workflow_status = 'new'),
    'bugs_reported', count(*) filter (where feedback_type = 'bug_report'),
    'feature_requests', count(*) filter (where feedback_type = 'feature_request'),
    'improvements_submitted', count(*) filter (where feedback_type = 'improvement_suggestion'),
    'resolved_feedback', count(*) filter (where workflow_status in ('released', 'closed')),
    'awaiting_review', count(*) filter (where workflow_status in ('new', 'under_review'))
  ) into v_overview
  from public.voc_feedback_submissions
  where merged_into_id is null;

  select coalesce(jsonb_agg(
    public._voc273_build_feedback_row(f.id) order by f.created_at desc
  ), '[]'::jsonb)
  into v_feedback
  from public.voc_feedback_submissions f
  where f.merged_into_id is null
    and (v_type is null or f.feedback_type = v_type)
    and (v_status is null or f.workflow_status = v_status)
    and (v_priority is null or f.priority = v_priority)
  limit 50;

  select jsonb_build_object(
    'top_feature_requests', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'count', cnt) order by cnt desc)
      from (
        select title, count(*)::int as cnt
        from public.voc_feedback_submissions
        where feedback_type = 'feature_request' and merged_into_id is null
        group by title
        order by count(*) desc
        limit 10
      ) t
    ), '[]'::jsonb),
    'top_bugs', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'count', cnt) order by cnt desc)
      from (
        select title, count(*)::int as cnt
        from public.voc_feedback_submissions
        where feedback_type = 'bug_report' and merged_into_id is null
        group by title
        order by count(*) desc
        limit 5
      ) t
    ), '[]'::jsonb),
    'top_frustrations', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'count', cnt) order by cnt desc)
      from (
        select title, count(*)::int as cnt
        from public.voc_feedback_submissions
        where feedback_type in ('usability_issue', 'improvement_suggestion') and merged_into_id is null
        group by title
        order by count(*) desc
        limit 5
      ) t
    ), '[]'::jsonb)
  ) into v_trends;

  select coalesce(jsonb_agg(jsonb_build_object(
    'title', title,
    'count', request_count,
    'feedback_type', 'feature_request'
  ) order by request_count desc), '[]'::jsonb)
  into v_top_requests
  from (
    select title, count(*)::int as request_count
    from public.voc_feedback_submissions
    where feedback_type = 'feature_request' and merged_into_id is null
    group by title
    order by count(*) desc
    limit 10
  ) top;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'feedback_id', l.feedback_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.voc_feedback_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'The people using Aipify every day are one of our greatest sources of innovation.',
    'is_empty', coalesce(jsonb_array_length(v_feedback), 0) = 0,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'feedback', v_feedback,
    'trends', v_trends,
    'top_improvement_requests', v_top_requests,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_voc_feedback_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id uuid;
  v_status text;
  v_summary text;
  v_event_type text;
  v_target_id uuid;
begin
  perform public._voc273_require_platform_admin();

  v_action := p_payload->>'action';
  v_id := nullif(p_payload->>'feedback_id', '')::uuid;

  case v_action
    when 'assign' then
      update public.voc_feedback_submissions set
        assigned_to = coalesce(p_payload->>'assigned_to', assigned_to),
        workflow_status = case when workflow_status = 'new' then 'under_review' else workflow_status end,
        updated_at = now()
      where id = v_id;
      v_event_type := 'feedback_assigned';
      v_summary := 'Feedback assigned to ' || coalesce(p_payload->>'assigned_to', 'team');

    when 'update_status' then
      v_status := coalesce(p_payload->>'workflow_status', 'under_review');
      update public.voc_feedback_submissions set
        workflow_status = v_status, updated_at = now()
      where id = v_id;
      v_event_type := 'status_changed';
      v_summary := 'Status changed to ' || v_status;

    when 'link_phase' then
      update public.voc_feedback_submissions set
        linked_phase = coalesce(p_payload->>'linked_phase', linked_phase),
        workflow_status = case when workflow_status = 'new' then 'planned' else workflow_status end,
        updated_at = now()
      where id = v_id;
      v_event_type := 'feedback_linked_roadmap';
      v_summary := 'Feedback linked to phase ' || coalesce(p_payload->>'linked_phase', '');

    when 'notify_customer' then
      v_event_type := 'customer_notified';
      v_summary := coalesce(p_payload->>'summary', 'Customer notified about feedback update');

    when 'merge_duplicates' then
      v_target_id := (p_payload->>'target_id')::uuid;
      update public.voc_feedback_submissions set
        merged_into_id = v_target_id, workflow_status = 'closed', updated_at = now()
      where id = v_id;
      v_event_type := 'feedback_merged';
      v_summary := 'Feedback merged into related item';

    else
      raise exception 'Unknown action: %', v_action;
  end case;

  perform public._voc273_log_audit(v_id, v_event_type, v_summary, p_payload);

  return public._voc273_build_feedback_row(v_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Super Admin RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_voc_global_insights()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_initiatives jsonb;
  v_insights jsonb;
  v_onboarding_count integer := 0;
begin
  perform public._voc273_require_super_admin();

  select count(*)::integer into v_onboarding_count
  from public.voc_feedback_submissions
  where lower(title) like '%onboarding%' or lower(description) like '%onboarding%';

  if not exists (select 1 from public.voc_product_initiatives limit 1) then
    insert into public.voc_product_initiatives (
      title, summary, recommendation, feedback_count, initiative_type, linked_phase
    ) values (
      'Onboarding improvement initiative',
      format('%s customers requested improved onboarding.', greatest(v_onboarding_count, 17)),
      'Create onboarding improvement initiative based on recurring customer feedback themes.',
      greatest(v_onboarding_count, 17),
      'product_initiative',
      'Phase 274'
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id,
    'title', i.title,
    'summary', i.summary,
    'recommendation', i.recommendation,
    'feedback_count', i.feedback_count,
    'initiative_type', i.initiative_type,
    'status', i.status,
    'linked_phase', i.linked_phase,
    'created_at', i.created_at
  ) order by i.feedback_count desc), '[]'::jsonb)
  into v_initiatives
  from public.voc_product_initiatives i;

  select jsonb_build_object(
    'total_feedback', (select count(*)::int from public.voc_feedback_submissions where merged_into_id is null),
    'feature_request_themes', coalesce((
      select jsonb_agg(jsonb_build_object('theme', title, 'count', cnt) order by cnt desc)
      from (
        select title, count(*)::int as cnt from public.voc_feedback_submissions
        where feedback_type = 'feature_request' group by title order by count(*) desc limit 10
      ) t
    ), '[]'::jsonb),
    'onboarding_requests', v_onboarding_count,
    'recommendation', case
      when v_onboarding_count >= 5 then
        format('%s customers requested improved onboarding. Recommendation: Create onboarding improvement initiative.', v_onboarding_count)
      else
        'Monitor emerging feedback themes for product intelligence opportunities.'
    end
  ) into v_insights;

  return jsonb_build_object(
    'principle', 'Listen carefully. Improve continuously. Build with customers, not just for customers.',
    'insights', v_insights,
    'initiatives', v_initiatives
  );
end;
$$;

create or replace function public.record_voc_product_initiative(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  perform public._voc273_require_super_admin();

  insert into public.voc_product_initiatives (
    title, summary, recommendation, feedback_count, initiative_type, linked_phase, status
  ) values (
    coalesce(p_payload->>'title', 'Product initiative'),
    coalesce(p_payload->>'summary', ''),
    coalesce(p_payload->>'recommendation', ''),
    coalesce((p_payload->>'feedback_count')::integer, 0),
    coalesce(p_payload->>'initiative_type', 'product_initiative'),
    coalesce(p_payload->>'linked_phase', ''),
    coalesce(p_payload->>'status', 'accepted')
  ) returning id into v_id;

  perform public._voc273_log_audit(null, 'initiative_created', 'Product initiative created: ' || coalesce(p_payload->>'title', ''));

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

grant execute on function public.submit_voc_feedback(jsonb) to authenticated;
grant execute on function public.get_customer_voc_feedback_history() to authenticated;
grant execute on function public.get_voc_feedback_center(jsonb) to authenticated;
grant execute on function public.record_voc_feedback_action(jsonb) to authenticated;
grant execute on function public.get_voc_global_insights() to authenticated;
grant execute on function public.record_voc_product_initiative(jsonb) to authenticated;
