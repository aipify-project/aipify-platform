-- Phase 41 — Employee Knowledge Engine (EKE)
-- Internal knowledge partner: acquisition, role permissions, onboarding, employee Q&A.

-- ---------------------------------------------------------------------------
-- 1. eke_settings
-- ---------------------------------------------------------------------------
create table if not exists public.eke_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  employee_assistant_enabled boolean not null default true,
  gap_detection_enabled boolean not null default true,
  onboarding_enabled boolean not null default true,
  improvement_loop_enabled boolean not null default true,
  require_admin_approval boolean not null default true,
  video_support_enabled boolean not null default false,
  privacy_settings jsonb not null default '{
    "store_query_history": true,
    "show_sources_to_employees": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.eke_settings enable row level security;
revoke all on public.eke_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. employee_knowledge_items
-- ---------------------------------------------------------------------------
create table if not exists public.employee_knowledge_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null check (
    category in (
      'company_info', 'policies', 'operational_procedures', 'product_knowledge',
      'support_procedures', 'training_content'
    )
  ),
  title text not null,
  content text not null,
  source_type text not null default 'manual',
  source_reference text,
  steps jsonb not null default '[]'::jsonb,
  roles_visible jsonb not null default '[]'::jsonb,
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  approved boolean not null default false,
  view_count integer not null default 0,
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employee_knowledge_items_tenant_idx
  on public.employee_knowledge_items (tenant_id, category, approved);

alter table public.employee_knowledge_items enable row level security;
revoke all on public.employee_knowledge_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. knowledge_permissions
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  role_name text not null,
  knowledge_category text not null,
  access_level text not null default 'read' check (
    access_level in ('read', 'contribute', 'admin')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, role_name, knowledge_category)
);

alter table public.knowledge_permissions enable row level security;
revoke all on public.knowledge_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. employee_knowledge_sources
-- ---------------------------------------------------------------------------
create table if not exists public.employee_knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_type text not null,
  source_label text not null,
  source_url text,
  status text not null default 'pending' check (
    status in ('pending', 'imported', 'rejected', 'failed')
  ),
  items_imported integer not null default 0,
  approved_by text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employee_knowledge_sources enable row level security;
revoke all on public.employee_knowledge_sources from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. employee_knowledge_gaps
-- ---------------------------------------------------------------------------
create table if not exists public.employee_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null,
  question text not null,
  occurrence_count integer not null default 1,
  confidence_at_detection integer,
  status text not null default 'open' check (
    status in ('open', 'suggested', 'resolved', 'dismissed')
  ),
  suggestion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employee_knowledge_gaps enable row level security;
revoke all on public.employee_knowledge_gaps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. employee_onboarding_paths
-- ---------------------------------------------------------------------------
create table if not exists public.employee_onboarding_paths (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  role_name text not null,
  title text not null,
  description text not null default '',
  modules jsonb not null default '[]'::jsonb,
  required_categories jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, role_name)
);

alter table public.employee_onboarding_paths enable row level security;
revoke all on public.employee_onboarding_paths from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. employee_onboarding_progress
-- ---------------------------------------------------------------------------
create table if not exists public.employee_onboarding_progress (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  path_id uuid not null references public.employee_onboarding_paths (id) on delete cascade,
  completed_modules jsonb not null default '[]'::jsonb,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, path_id)
);

alter table public.employee_onboarding_progress enable row level security;
revoke all on public.employee_onboarding_progress from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. employee_knowledge_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.employee_knowledge_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  actor_type text not null default 'user',
  actor_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists employee_knowledge_audit_tenant_idx
  on public.employee_knowledge_audit_logs (tenant_id, created_at desc);

alter table public.employee_knowledge_audit_logs enable row level security;
revoke all on public.employee_knowledge_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._eke_user_role()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select u.role into v_role from public.users u where u.auth_user_id = auth.uid() limit 1;
  return coalesce(v_role, 'staff');
end;
$$;

create or replace function public.record_eke_audit_event(
  p_tenant_id uuid,
  p_event_type text,
  p_actor_type text default 'user',
  p_actor_id text default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.employee_knowledge_audit_logs (
    tenant_id, event_type, actor_type, actor_id, details
  )
  values (
    p_tenant_id, p_event_type, p_actor_type,
    coalesce(p_actor_id, auth.uid()::text), p_details
  )
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._eke_role_can_access_category(
  p_tenant_id uuid,
  p_role text,
  p_category text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_role in ('owner', 'admin') then return true; end if;
  return exists (
    select 1 from public.knowledge_permissions kp
    where kp.tenant_id = p_tenant_id
      and kp.role_name = p_role
      and kp.knowledge_category = p_category
      and kp.access_level in ('read', 'contribute', 'admin')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. ensure_eke_settings + defaults
-- ---------------------------------------------------------------------------
create or replace function public.ensure_eke_settings(p_tenant_id uuid)
returns public.eke_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.eke_settings;
  v_role text;
begin
  insert into public.eke_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row from public.eke_settings where tenant_id = p_tenant_id;

  if not exists (select 1 from public.knowledge_permissions where tenant_id = p_tenant_id limit 1) then
    foreach v_role in array array['owner', 'admin', 'support', 'staff'] loop
      insert into public.knowledge_permissions (tenant_id, role_name, knowledge_category, access_level)
      values
        (p_tenant_id, v_role, 'company_info', case when v_role in ('owner', 'admin') then 'admin' else 'read' end),
        (p_tenant_id, v_role, 'policies', 'read'),
        (p_tenant_id, v_role, 'operational_procedures', case when v_role in ('owner', 'admin', 'support') then 'read' else 'read' end),
        (p_tenant_id, v_role, 'product_knowledge', 'read'),
        (p_tenant_id, v_role, 'support_procedures', case when v_role = 'support' then 'contribute' else 'read' end),
        (p_tenant_id, v_role, 'training_content', 'read')
      on conflict (tenant_id, role_name, knowledge_category) do nothing;
    end loop;
  end if;

  if not exists (select 1 from public.employee_onboarding_paths where tenant_id = p_tenant_id limit 1) then
    insert into public.employee_onboarding_paths (tenant_id, role_name, title, description, modules, required_categories)
    values
      (p_tenant_id, 'support', 'Support onboarding', 'Essential support procedures and policies',
        '["Welcome", "Support procedures", "Escalation paths", "Customer tone"]'::jsonb,
        '["policies", "support_procedures", "training_content"]'::jsonb),
      (p_tenant_id, 'staff', 'General onboarding', 'Company overview and core policies',
        '["Welcome", "Company values", "Core policies"]'::jsonb,
        '["company_info", "policies", "training_content"]'::jsonb),
      (p_tenant_id, 'admin', 'Administrator onboarding', 'Full operational knowledge',
        '["Systems", "Approvals", "Escalation", "Business DNA"]'::jsonb,
        '["operational_procedures", "policies", "product_knowledge"]'::jsonb);
  end if;

  return v_row;
end;
$$;

create or replace function public.update_eke_settings(
  p_employee_assistant_enabled boolean default null,
  p_gap_detection_enabled boolean default null,
  p_onboarding_enabled boolean default null,
  p_improvement_loop_enabled boolean default null,
  p_require_admin_approval boolean default null,
  p_video_support_enabled boolean default null,
  p_privacy_settings jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  perform public.ensure_eke_settings(v_tenant_id);

  update public.eke_settings
  set
    employee_assistant_enabled = coalesce(p_employee_assistant_enabled, employee_assistant_enabled),
    gap_detection_enabled = coalesce(p_gap_detection_enabled, gap_detection_enabled),
    onboarding_enabled = coalesce(p_onboarding_enabled, onboarding_enabled),
    improvement_loop_enabled = coalesce(p_improvement_loop_enabled, improvement_loop_enabled),
    require_admin_approval = coalesce(p_require_admin_approval, require_admin_approval),
    video_support_enabled = coalesce(p_video_support_enabled, video_support_enabled),
    privacy_settings = coalesce(p_privacy_settings, privacy_settings),
    updated_at = now()
  where tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. CRUD knowledge items
-- ---------------------------------------------------------------------------
create or replace function public.create_employee_knowledge_item(
  p_category text,
  p_title text,
  p_content text,
  p_source_type text default 'manual',
  p_source_reference text default null,
  p_steps jsonb default '[]'::jsonb,
  p_roles_visible jsonb default '[]'::jsonb,
  p_confidence_score integer default 70,
  p_approved boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
  v_settings public.eke_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_settings := public.ensure_eke_settings(v_tenant_id);

  insert into public.employee_knowledge_items (
    tenant_id, category, title, content, source_type, source_reference,
    steps, roles_visible, confidence_score, approved
  )
  values (
    v_tenant_id, p_category, p_title, p_content, p_source_type, p_source_reference,
    p_steps, p_roles_visible,
    p_confidence_score,
    case when v_settings.require_admin_approval then coalesce(p_approved, false) else true end
  )
  returning id into v_id;

  perform public.record_eke_audit_event(
    v_tenant_id, 'knowledge_created', 'user', null,
    jsonb_build_object('id', v_id, 'category', p_category)
  );
  return v_id;
end;
$$;

create or replace function public.approve_employee_knowledge_item(p_item_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();

  update public.employee_knowledge_items
  set approved = true, updated_at = now()
  where id = p_item_id and tenant_id = v_tenant_id;

  perform public.record_eke_audit_event(
    v_tenant_id, 'knowledge_approved', 'user', null,
    jsonb_build_object('item_id', p_item_id)
  );
  return jsonb_build_object('approved', true);
end;
$$;

create or replace function public.import_employee_knowledge_source(
  p_source_type text,
  p_source_label text,
  p_source_url text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();

  insert into public.employee_knowledge_sources (
    tenant_id, source_type, source_label, source_url, status, approved_by, metadata
  )
  values (
    v_tenant_id, p_source_type, p_source_label, p_source_url,
    'imported', auth.uid()::text, p_metadata
  )
  returning id into v_id;

  perform public.record_eke_audit_event(
    v_tenant_id, 'knowledge_imported', 'user', null,
    jsonb_build_object('source_id', v_id, 'label', p_source_label)
  );
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. search + answer employee question
-- ---------------------------------------------------------------------------
create or replace function public.search_employee_knowledge(
  p_query text,
  p_category text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_role text;
  v_q text := lower(trim(p_query));
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_role := public._eke_user_role();
  perform public.ensure_eke_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'results', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', k.id, 'category', k.category, 'title', k.title,
        'excerpt', left(k.content, 200), 'confidence_score', k.confidence_score,
        'source_reference', k.source_reference
      ) order by k.view_count desc, k.confidence_score desc)
      from public.employee_knowledge_items k
      where k.tenant_id = v_tenant_id and k.approved
        and (p_category is null or k.category = p_category)
        and public._eke_role_can_access_category(v_tenant_id, v_role, k.category)
        and (
          lower(k.title) like '%' || v_q || '%'
          or lower(k.content) like '%' || v_q || '%'
        )
      limit 10),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.detect_employee_knowledge_gap(
  p_tenant_id uuid,
  p_category text,
  p_question text,
  p_confidence integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.eke_settings;
begin
  select * into v_settings from public.eke_settings where tenant_id = p_tenant_id;
  if not coalesce(v_settings.gap_detection_enabled, true) then return; end if;

  if exists (
    select 1 from public.employee_knowledge_gaps
    where tenant_id = p_tenant_id and lower(question) = lower(p_question) and status = 'open'
  ) then
    update public.employee_knowledge_gaps
    set occurrence_count = occurrence_count + 1, updated_at = now()
    where tenant_id = p_tenant_id and lower(question) = lower(p_question) and status = 'open';
  else
    insert into public.employee_knowledge_gaps (
      tenant_id, category, question, confidence_at_detection, suggestion
    )
    values (
      p_tenant_id, p_category, p_question, p_confidence,
      format('Employees frequently ask about %s. Would you like me to draft an internal guide?', p_category)
    );
  end if;
end;
$$;

create or replace function public.answer_employee_question(p_question text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_role text;
  v_settings public.eke_settings;
  v_item public.employee_knowledge_items;
  v_q text := lower(trim(p_question));
  v_confidence integer := 25;
  v_confidence_level text := 'low';
  v_steps jsonb := '[]'::jsonb;
  v_related jsonb;
  v_category text := 'operational_procedures';
  v_answer text;
  v_title text := 'No approved knowledge found';
  v_source_ref text;
  v_item_id uuid;
  v_support_answer text;
  v_support_question text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_role := public._eke_user_role();
  v_settings := public.ensure_eke_settings(v_tenant_id);

  if not v_settings.employee_assistant_enabled then
    return jsonb_build_object('has_customer', true, 'enabled', false);
  end if;

  if v_q ~ '(refund|return)' then v_category := 'support_procedures';
  elsif v_q ~ '(policy|gdpr|privacy|compliance)' then v_category := 'policies';
  elsif v_q ~ '(product|feature|price)' then v_category := 'product_knowledge';
  elsif v_q ~ '(onboard|training|welcome)' then v_category := 'training_content';
  elsif v_q ~ '(who approves|invoice|finance)' then v_category := 'operational_procedures';
  elsif v_q ~ '(verify|moderat|marketplace|gift card)' then v_category := 'support_procedures';
  end if;

  select * into v_item
  from public.employee_knowledge_items k
  where k.tenant_id = v_tenant_id and k.approved
    and public._eke_role_can_access_category(v_tenant_id, v_role, k.category)
    and (
      lower(k.title) like '%' || v_q || '%'
      or lower(k.content) like '%' || v_q || '%'
      or (k.category = v_category and lower(k.content) like '%' || split_part(v_q, ' ', 1) || '%')
    )
  order by
    case when k.category = v_category then 0 else 1 end,
    k.confidence_score desc,
    k.view_count desc
  limit 1;

  if v_item.id is not null then
    v_confidence := v_item.confidence_score;
    v_steps := v_item.steps;
    v_answer := v_item.content;
    v_title := v_item.title;
    v_source_ref := v_item.source_reference;
    v_item_id := v_item.id;
    update public.employee_knowledge_items
    set view_count = view_count + 1, last_viewed_at = now()
    where id = v_item.id;
  else
    select k.answer, k.question into v_support_answer, v_support_question
    from public.support_knowledge_items k
    where k.tenant_id = v_tenant_id and k.approved
      and public._eke_role_can_access_category(v_tenant_id, v_role, 'support_procedures')
      and (lower(k.question) like '%' || v_q || '%' or lower(k.answer) like '%' || v_q || '%')
    order by k.created_at desc
    limit 1;

    if v_support_answer is not null then
      v_confidence := 55;
      v_answer := v_support_answer;
      v_title := coalesce(v_support_question, 'Business DNA knowledge');
      v_category := 'support_procedures';
    end if;
  end if;

  v_confidence_level := case
    when v_confidence >= 80 then 'high'
    when v_confidence >= 50 then 'medium'
    else 'low'
  end;

  if v_answer is null or v_confidence < 50 then
    perform public.detect_employee_knowledge_gap(v_tenant_id, v_category, p_question, v_confidence);
  end if;

  select coalesce(
    (select jsonb_agg(jsonb_build_object('id', k.id, 'title', k.title) order by k.view_count desc)
    from public.employee_knowledge_items k
    where k.tenant_id = v_tenant_id and k.approved
      and k.category = v_category
      and k.id is distinct from v_item_id
    limit 3),
    '[]'::jsonb
  ) into v_related;

  perform public.record_eke_audit_event(
    v_tenant_id, 'question_answered', 'user', null,
    jsonb_build_object('question', left(p_question, 100), 'confidence', v_confidence_level)
  );

  return jsonb_build_object(
    'has_customer', true,
    'question', p_question,
    'answer', coalesce(
      v_answer,
      'I could not find approved documentation for this. I recommend escalating to your manager or admin.'
    ),
    'title', v_title,
    'category', v_category,
    'confidence_score', v_confidence,
    'confidence_level', v_confidence_level,
    'steps', v_steps,
    'source_reference', v_source_ref,
    'related', v_related,
    'escalate_recommended', v_confidence_level = 'low',
    'ethical_note', 'Aipify provides guidance — you retain judgment and make the final decision.',
    'supporting_documentation', case when v_source_ref is not null
      then jsonb_build_array(v_source_ref) else '[]'::jsonb end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Health score + onboarding + feedback
-- ---------------------------------------------------------------------------
create or replace function public.calculate_employee_knowledge_health(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_score integer := 0;
  v_items integer;
  v_categories integer;
  v_gaps_open integer;
  v_avg_confidence numeric;
  v_recent_updates integer;
  v_onboarding_pct numeric;
  v_level text;
  v_label text;
begin
  select count(*) into v_items
  from public.employee_knowledge_items where tenant_id = p_tenant_id and approved;

  select count(distinct category) into v_categories
  from public.employee_knowledge_items where tenant_id = p_tenant_id and approved;

  select count(*) into v_gaps_open
  from public.employee_knowledge_gaps where tenant_id = p_tenant_id and status = 'open';

  select coalesce(avg(confidence_score), 0) into v_avg_confidence
  from public.employee_knowledge_items where tenant_id = p_tenant_id and approved;

  select count(*) into v_recent_updates
  from public.employee_knowledge_items
  where tenant_id = p_tenant_id and updated_at >= now() - interval '30 days';

  select coalesce(avg(progress_percent), 0) into v_onboarding_pct
  from public.employee_onboarding_progress where tenant_id = p_tenant_id;

  v_score := least(100,
    (case when v_items >= 20 then 25 when v_items >= 5 then 15 when v_items >= 1 then 8 else 0 end) +
    (case when v_categories >= 5 then 20 when v_categories >= 3 then 12 else 0 end) +
    (case when v_avg_confidence >= 80 then 15 when v_avg_confidence >= 60 then 10 else 5 end) +
    (case when v_recent_updates >= 3 then 15 when v_recent_updates >= 1 then 8 else 0 end) +
    (case when v_gaps_open = 0 then 15 when v_gaps_open <= 3 then 8 else 0 end) +
    (case when v_onboarding_pct >= 75 then 10 when v_onboarding_pct >= 25 then 5 else 0 end)
  );

  v_level := case
    when v_score <= 25 then 'critical'
    when v_score <= 50 then 'limited'
    when v_score <= 75 then 'operational'
    else 'strong'
  end;

  v_label := case v_level
    when 'critical' then 'Critical gaps — documentation urgently needed'
    when 'limited' then 'Limited coverage — expand approved knowledge'
    when 'operational' then 'Operational readiness — knowledge supports daily work'
    else 'Strong organizational knowledge maturity'
  end;

  return jsonb_build_object(
    'health_score', v_score,
    'level', v_level,
    'health_label', v_label,
    'factors', jsonb_build_object(
      'approved_items', v_items,
      'categories_covered', v_categories,
      'open_gaps', v_gaps_open,
      'avg_confidence', round(v_avg_confidence),
      'recent_updates', v_recent_updates,
      'onboarding_completion_avg', round(v_onboarding_pct)
    )
  );
end;
$$;

create or replace function public.get_onboarding_path_for_role(p_role_name text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_role text;
  v_path public.employee_onboarding_paths;
  v_user_id uuid;
  v_progress public.employee_onboarding_progress;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_role := coalesce(p_role_name, public._eke_user_role());
  perform public.ensure_eke_settings(v_tenant_id);

  select * into v_path
  from public.employee_onboarding_paths
  where tenant_id = v_tenant_id and role_name = v_role and active
  limit 1;

  if v_path.id is null then
    select * into v_path
    from public.employee_onboarding_paths
    where tenant_id = v_tenant_id and role_name = 'staff' and active
    limit 1;
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_user_id is not null and v_path.id is not null then
    select * into v_progress
    from public.employee_onboarding_progress
    where tenant_id = v_tenant_id and user_id = v_user_id and path_id = v_path.id;
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'role', v_role,
    'path', case when v_path.id is null then null else jsonb_build_object(
      'id', v_path.id, 'title', v_path.title, 'description', v_path.description,
      'modules', v_path.modules, 'required_categories', v_path.required_categories
    ) end,
    'progress', case when v_progress.id is null then null else jsonb_build_object(
      'progress_percent', v_progress.progress_percent,
      'completed_modules', v_progress.completed_modules,
      'completed_at', v_progress.completed_at
    ) end
  );
end;
$$;

create or replace function public.record_onboarding_progress(
  p_module text,
  p_completed boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_role text;
  v_path public.employee_onboarding_paths;
  v_modules jsonb;
  v_total integer;
  v_done integer;
  v_pct integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  v_role := public._eke_user_role();
  select * into v_path
  from public.employee_onboarding_paths
  where tenant_id = v_tenant_id and role_name = v_role and active
  limit 1;

  if v_path.id is null then return jsonb_build_object('has_customer', true, 'updated', false); end if;

  insert into public.employee_onboarding_progress (tenant_id, user_id, path_id, completed_modules)
  values (v_tenant_id, v_user_id, v_path.id, '[]'::jsonb)
  on conflict (tenant_id, user_id, path_id) do nothing;

  if p_completed then
    update public.employee_onboarding_progress
    set completed_modules = completed_modules || to_jsonb(p_module),
        updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id and path_id = v_path.id
      and not (completed_modules @> to_jsonb(p_module));
  end if;

  select completed_modules into v_modules
  from public.employee_onboarding_progress
  where tenant_id = v_tenant_id and user_id = v_user_id and path_id = v_path.id;

  v_total := jsonb_array_length(v_path.modules);
  v_done := jsonb_array_length(v_modules);
  v_pct := case when v_total > 0 then least(100, (v_done * 100) / v_total) else 0 end;

  update public.employee_onboarding_progress
  set progress_percent = v_pct,
      completed_at = case when v_pct >= 100 then now() else null end,
      updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id and path_id = v_path.id;

  perform public.record_eke_audit_event(
    v_tenant_id, 'training_completed', 'user', v_user_id::text,
    jsonb_build_object('module', p_module, 'progress_percent', v_pct)
  );

  return jsonb_build_object('has_customer', true, 'progress_percent', v_pct);
end;
$$;

create or replace function public.record_employee_knowledge_feedback(
  p_question text,
  p_helpful boolean,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.eke_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select * into v_settings from public.eke_settings where tenant_id = v_tenant_id;

  perform public.record_eke_audit_event(
    v_tenant_id, 'knowledge_feedback', 'user', null,
    jsonb_build_object('question', left(p_question, 200), 'helpful', p_helpful, 'note', p_note)
  );

  if coalesce(v_settings.improvement_loop_enabled, true) and not p_helpful then
    perform public.detect_employee_knowledge_gap(v_tenant_id, 'operational_procedures', p_question, 30);
  end if;

  return jsonb_build_object('recorded', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. get_customer_employee_knowledge_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_employee_knowledge_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_role text;
  v_settings public.eke_settings;
  v_health jsonb;
  v_bde_health jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_role := public._eke_user_role();
  v_settings := public.ensure_eke_settings(v_tenant_id);
  v_health := public.calculate_employee_knowledge_health(v_tenant_id);
  v_bde_health := public.calculate_business_dna_health(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'user_role', v_role,
    'settings', jsonb_build_object(
      'employee_assistant_enabled', v_settings.employee_assistant_enabled,
      'gap_detection_enabled', v_settings.gap_detection_enabled,
      'onboarding_enabled', v_settings.onboarding_enabled,
      'improvement_loop_enabled', v_settings.improvement_loop_enabled,
      'require_admin_approval', v_settings.require_admin_approval,
      'video_support_enabled', v_settings.video_support_enabled,
      'privacy_settings', v_settings.privacy_settings
    ),
    'health', v_health,
    'business_dna_health', v_bde_health,
    'knowledge_items', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', k.id, 'category', k.category, 'title', k.title,
        'content', left(k.content, 300), 'confidence_score', k.confidence_score,
        'approved', k.approved, 'view_count', k.view_count,
        'source_reference', k.source_reference, 'steps', k.steps
      ) order by k.view_count desc, k.updated_at desc)
      from public.employee_knowledge_items k
      where k.tenant_id = v_tenant_id
        and public._eke_role_can_access_category(v_tenant_id, v_role, k.category)
      limit 50),
      '[]'::jsonb
    ),
    'pending_approval', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', k.id, 'category', k.category, 'title', k.title, 'confidence_score', k.confidence_score
      ) order by k.created_at desc)
      from public.employee_knowledge_items k
      where k.tenant_id = v_tenant_id and not k.approved
      limit 20),
      '[]'::jsonb
    ),
    'most_viewed', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', k.id, 'title', k.title, 'view_count', k.view_count, 'category', k.category
      ) order by k.view_count desc)
      from public.employee_knowledge_items k
      where k.tenant_id = v_tenant_id and k.approved
        and public._eke_role_can_access_category(v_tenant_id, v_role, k.category)
      limit 10),
      '[]'::jsonb
    ),
    'knowledge_gaps', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', g.id, 'category', g.category, 'question', g.question,
        'occurrence_count', g.occurrence_count, 'suggestion', g.suggestion, 'status', g.status
      ) order by g.occurrence_count desc)
      from public.employee_knowledge_gaps g
      where g.tenant_id = v_tenant_id and g.status = 'open'
      limit 15),
      '[]'::jsonb
    ),
    'permissions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', p.id, 'role_name', p.role_name, 'knowledge_category', p.knowledge_category,
        'access_level', p.access_level
      ) order by p.role_name, p.knowledge_category)
      from public.knowledge_permissions p where p.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'sources', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', s.id, 'source_type', s.source_type, 'source_label', s.source_label,
        'source_url', s.source_url, 'status', s.status, 'items_imported', s.items_imported
      ) order by s.created_at desc)
      from public.employee_knowledge_sources s where s.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'onboarding', public.get_onboarding_path_for_role(v_role),
    'recent_updates', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', k.id, 'title', k.title, 'category', k.category, 'updated_at', k.updated_at
      ) order by k.updated_at desc)
      from public.employee_knowledge_items k
      where k.tenant_id = v_tenant_id and k.approved
      limit 10),
      '[]'::jsonb
    ),
    'audit_log', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'event_type', a.event_type, 'actor_type', a.actor_type,
        'details', a.details, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.employee_knowledge_audit_logs a where a.tenant_id = v_tenant_id limit 25),
      '[]'::jsonb
    ),
    'categories', jsonb_build_array(
      jsonb_build_object('id', 'company_info', 'label', 'Company Information'),
      jsonb_build_object('id', 'policies', 'label', 'Policies'),
      jsonb_build_object('id', 'operational_procedures', 'label', 'Operational Procedures'),
      jsonb_build_object('id', 'product_knowledge', 'label', 'Product Knowledge'),
      jsonb_build_object('id', 'support_procedures', 'label', 'Support Procedures'),
      jsonb_build_object('id', 'training_content', 'label', 'Training Content')
    ),
    'ethical_principles', jsonb_build_array(
      'Aipify empowers employees — it does not replace critical thinking',
      'Guidance is provided; humans make final decisions',
      'Only approved sources are learned and surfaced',
      'Role-based access protects sensitive documentation'
    ),
    'privacy_note', 'Knowledge belongs to the organization. Employees only see content authorized for their role.',
    'integrations', jsonb_build_object(
      'business_dna', 'Operational context from Business DNA enriches employee answers',
      'support_operations', 'Support gaps inform internal documentation priorities',
      'learning_engine', 'Approved training content feeds the knowledge base'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 15. Platform overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_employee_knowledge_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access employee knowledge content. Aggregates only.',
    'eke_profiles', (select count(*) from public.eke_settings),
    'approved_items', (select count(*) from public.employee_knowledge_items where approved),
    'pending_items', (select count(*) from public.employee_knowledge_items where not approved),
    'open_gaps', (select count(*) from public.employee_knowledge_gaps where status = 'open'),
    'onboarding_paths', (select count(*) from public.employee_onboarding_paths where active),
    'avg_health_score', coalesce(
      (select round(avg((public.calculate_employee_knowledge_health(tenant_id) ->> 'health_score')::numeric))::integer
      from public.eke_settings),
      0
    )
  );
end;
$$;

grant execute on function public._eke_user_role() to authenticated;
grant execute on function public._eke_role_can_access_category(uuid, text, text) to authenticated;
grant execute on function public.record_eke_audit_event(uuid, text, text, text, jsonb) to authenticated;
grant execute on function public.ensure_eke_settings(uuid) to authenticated;
grant execute on function public.update_eke_settings(boolean, boolean, boolean, boolean, boolean, boolean, jsonb) to authenticated;
grant execute on function public.create_employee_knowledge_item(text, text, text, text, text, jsonb, jsonb, integer, boolean) to authenticated;
grant execute on function public.approve_employee_knowledge_item(uuid) to authenticated;
grant execute on function public.import_employee_knowledge_source(text, text, text, jsonb) to authenticated;
grant execute on function public.search_employee_knowledge(text, text) to authenticated;
grant execute on function public.detect_employee_knowledge_gap(uuid, text, text, integer) to authenticated;
grant execute on function public.answer_employee_question(text) to authenticated;
grant execute on function public.calculate_employee_knowledge_health(uuid) to authenticated;
grant execute on function public.get_onboarding_path_for_role(text) to authenticated;
grant execute on function public.record_onboarding_progress(text, boolean) to authenticated;
grant execute on function public.record_employee_knowledge_feedback(text, boolean, text) to authenticated;
grant execute on function public.get_customer_employee_knowledge_center() to authenticated;
grant execute on function public.get_platform_employee_knowledge_overview() to authenticated;

