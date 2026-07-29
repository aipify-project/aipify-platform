-- APP Kompis Operator Workspace V1 + Platform high-risk write gate.
-- Reuses canonical website_kompis delivery. No customer seeds. No apply-side effects.

create or replace function public._platform_require_high_risk_write()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
      and coalesce(pa.status, 'active') = 'active'
  ) then
    raise exception 'Platform high-risk write denied' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public._platform_require_high_risk_write() from public, anon;
grant execute on function public._platform_require_high_risk_write() to authenticated;

create table if not exists public.kompis_operator_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  created_by uuid not null,
  title text not null default '',
  locale text not null default 'en',
  status text not null default 'active'
    check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kompis_operator_runs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.kompis_operator_conversations(id) on delete cascade,
  organization_id uuid not null,
  requested_by uuid not null,
  request_text text not null,
  normalized_request text not null default '',
  planner_version text not null default 'v1',
  model_identifier text not null default 'deterministic_planner_v1',
  intent text,
  user_summary text,
  risk_class smallint not null default 0 check (risk_class between 0 and 3),
  requires_approval boolean not null default false,
  status text not null default 'planned'
    check (status in (
      'understanding','planning','checking_access','awaiting_approval','executing',
      'verifying','completed','partial','attention','blocked','failed','rejected','planned'
    )),
  approval_status text not null default 'not_required'
    check (approval_status in ('not_required','pending','approved','rejected')),
  idempotency_key text not null,
  plan_json jsonb not null default '{}'::jsonb,
  result_summary text,
  safe_error_code text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create table if not exists public.kompis_operator_steps (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.kompis_operator_runs(id) on delete cascade,
  sequence int not null,
  tool_key text not null,
  tool_version text not null default '1',
  risk_class smallint not null default 0 check (risk_class between 0 and 3),
  purpose text not null default '',
  requires_approval boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending','ready','running','completed','failed','skipped','blocked')),
  safe_input_summary jsonb not null default '{}'::jsonb,
  result_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (run_id, sequence)
);

create table if not exists public.kompis_operator_approvals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.kompis_operator_runs(id) on delete cascade,
  step_id uuid references public.kompis_operator_steps(id) on delete set null,
  approved_by uuid,
  role_snapshot text,
  confirmation boolean not null default false,
  reason text,
  decision text not null check (decision in ('approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists kompis_operator_conversations_org_updated_idx
  on public.kompis_operator_conversations (organization_id, updated_at desc);
create index if not exists kompis_operator_runs_org_created_idx
  on public.kompis_operator_runs (organization_id, created_at desc);
create index if not exists kompis_operator_runs_conversation_idx
  on public.kompis_operator_runs (conversation_id, created_at desc);
create index if not exists kompis_operator_steps_run_seq_idx
  on public.kompis_operator_steps (run_id, sequence);

alter table public.kompis_operator_conversations enable row level security;
alter table public.kompis_operator_runs enable row level security;
alter table public.kompis_operator_steps enable row level security;
alter table public.kompis_operator_approvals enable row level security;

-- No direct table policies for authenticated — access via SECURITY DEFINER RPCs only.

create or replace function public._kompis_operator_tool_allowed(p_tool_key text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select p_tool_key in (
    'customer_profile_read',
    'agreement_status_read',
    'license_status_read',
    'domain_installation_status_read',
    'website_kompis_status_read',
    'app_access_status_read',
    'support_cases_read',
    'notifications_read',
    'organization_members_read',
    'activity_summary_read',
    'support_case_create',
    'support_case_reply',
    'notification_mark_read',
    'organization_profile_draft',
    'content_draft_create'
  );
$$;

create or replace function public._kompis_operator_require_access()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant jsonb;
  v_org_id uuid;
  v_customer_id uuid;
  v_role text;
  v_module public.tenant_modules;
  v_install uuid;
  v_domain text;
  v_ack jsonb;
  v_user_id uuid;
  v_reasons jsonb := '[]'::jsonb;
  v_available boolean := true;
begin
  if auth.uid() is null then
    raise exception 'UNAUTHENTICATED' using errcode = 'P0001';
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then
    raise exception 'MEMBERSHIP_MISSING' using errcode = 'P0001';
  end if;

  v_tenant := public._app_resolve_customer_tenant_for_auth();
  v_org_id := nullif(v_tenant->>'organization_id', '')::uuid;
  v_customer_id := nullif(v_tenant->>'customer_id', '')::uuid;
  v_role := nullif(v_tenant->>'organization_role', '');

  if v_org_id is null or v_customer_id is null then
    v_available := false;
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','organization_required','satisfied',false));
  else
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','organization_required','satisfied',true));
  end if;

  select * into v_module
  from public.tenant_modules
  where tenant_id = v_customer_id
    and module_key = 'website_kompis'
  limit 1;

  if v_module.id is null
     or coalesce(v_module.licensed, false) is not true
     or coalesce(v_module.enabled, false) is not true
     or lower(coalesce(v_module.status, '')) <> 'enabled'
     or coalesce(v_module.metadata->>'delivery_model', '') <> 'canonical_v1' then
    v_available := false;
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','website_kompis_capability','satisfied',false));
  else
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','website_kompis_capability','satisfied',true));
  end if;

  v_install := nullif(coalesce(v_module.metadata->>'installation_id', ''), '')::uuid;
  v_domain := nullif(btrim(coalesce(v_module.metadata->>'domain', '')), '');
  if v_install is not null and v_domain is not null then
    v_ack := public._platform_portal_app_kompis_ack(v_customer_id, v_install, v_domain);
  else
    v_ack := jsonb_build_object('ok', false);
  end if;

  if coalesce((v_ack->>'ok')::boolean, false) is not true then
    v_available := false;
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','acknowledgement_verified','satisfied',false));
  else
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','acknowledgement_verified','satisfied',true));
  end if;

  if lower(coalesce(v_module.status, '')) in ('suspended','revoked','disabled') then
    v_available := false;
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','not_suspended','satisfied',false));
  else
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object('code','not_suspended','satisfied',true));
  end if;

  return jsonb_build_object(
    'available', v_available,
    'organization_id', v_org_id,
    'customer_id', v_customer_id,
    'user_id', v_user_id,
    'organization_role', v_role,
    'module_id', v_module.id,
    'delivery_id', v_module.metadata->>'delivery_id',
    'parent_license_id', v_module.metadata->>'parent_license_id',
    'installation_id', v_install,
    'domain', v_domain,
    'acknowledgement', v_ack,
    'reasons', v_reasons,
    'suspended', lower(coalesce(v_module.status, '')) = 'suspended',
    'revoked', lower(coalesce(v_module.status, '')) = 'revoked'
  );
end;
$$;

revoke all on function public._kompis_operator_require_access() from public, anon, authenticated;

create or replace function public.get_app_kompis_operator_workspace()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org public.organizations;
  v_sub public.subscriptions;
  v_license public.aipify_billing_license_links;
begin
  begin
    v_access := public._kompis_operator_require_access();
  exception when others then
    if sqlerrm = 'UNAUTHENTICATED' then raise;
    end if;
    return jsonb_build_object(
      'available', false,
      'access_state', sqlerrm,
      'reasons', jsonb_build_array(jsonb_build_object('code','access_denied','satisfied',false))
    );
  end;

  select * into v_org from public.organizations where id = (v_access->>'organization_id')::uuid;
  select * into v_sub from public.subscriptions
    where customer_id = (v_access->>'customer_id')::uuid
    order by case when status = 'active' then 0 else 1 end, created_at desc
    limit 1;
  if nullif(v_access->>'parent_license_id','') is not null then
    select * into v_license from public.aipify_billing_license_links
      where id = (v_access->>'parent_license_id')::uuid;
  end if;

  return jsonb_build_object(
    'available', coalesce((v_access->>'available')::boolean, false),
    'suspended', coalesce((v_access->>'suspended')::boolean, false),
    'revoked', coalesce((v_access->>'revoked')::boolean, false),
    'organization', jsonb_build_object(
      'id', v_org.id,
      'name', v_org.name,
      'slug', v_org.slug,
      'role', v_access->>'organization_role'
    ),
    'agreement', case when v_sub.id is null then null else jsonb_build_object(
      'id', v_sub.id,
      'status', v_sub.status,
      'plan_name', v_sub.plan_name,
      'plan_key', v_sub.plan_key
    ) end,
    'parent_license', case when v_license.id is null then null else jsonb_build_object(
      'id', v_license.id,
      'status', v_license.license_status,
      'product_code', v_license.license_type
    ) end,
    'website_kompis', jsonb_build_object(
      'delivery_id', v_access->>'delivery_id',
      'domain', v_access->>'domain',
      'installation_id', v_access->>'installation_id',
      'acknowledgement_ok', coalesce((v_access->'acknowledgement'->>'ok')::boolean, false)
    ),
    'reasons', coalesce(v_access->'reasons', '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_app_kompis_operator_workspace() from public, anon;
grant execute on function public.get_app_kompis_operator_workspace() to authenticated;

create or replace function public.list_app_kompis_operator_conversations(p_limit int default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_limit int := greatest(1, least(coalesce(p_limit, 20), 50));
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id,
      'title', c.title,
      'locale', c.locale,
      'status', c.status,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    ) order by c.updated_at desc)
    from (
      select * from public.kompis_operator_conversations
      where organization_id = v_org
      order by updated_at desc
      limit v_limit
    ) c
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.list_app_kompis_operator_conversations(int) from public, anon;
grant execute on function public.list_app_kompis_operator_conversations(int) to authenticated;

create or replace function public.create_app_kompis_operator_conversation(p_title text, p_locale text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_id uuid;
  v_title text := left(btrim(coalesce(p_title, '')), 120);
  v_locale text := left(btrim(coalesce(p_locale, 'en')), 16);
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  if v_title = '' then v_title := 'Kompis'; end if;
  if v_locale = '' then v_locale := 'en'; end if;

  insert into public.kompis_operator_conversations (organization_id, created_by, title, locale)
  values (
    (v_access->>'organization_id')::uuid,
    (v_access->>'user_id')::uuid,
    v_title,
    v_locale
  )
  returning id into v_id;

  return jsonb_build_object(
    'id', v_id,
    'title', v_title,
    'locale', v_locale,
    'status', 'active',
    'organization_id', v_access->>'organization_id'
  );
end;
$$;

revoke all on function public.create_app_kompis_operator_conversation(text, text) from public, anon;
grant execute on function public.create_app_kompis_operator_conversation(text, text) to authenticated;

create or replace function public.get_app_kompis_operator_conversation(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_conv public.kompis_operator_conversations;
  v_runs jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_conv from public.kompis_operator_conversations where id = p_id and organization_id = v_org;
  if v_conv.id is null then
    raise exception 'CONVERSATION_NOT_FOUND' using errcode = 'P0001';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'status', r.status,
    'approval_status', r.approval_status,
    'risk_class', r.risk_class,
    'intent', r.intent,
    'user_summary', r.user_summary,
    'requires_approval', r.requires_approval,
    'result_summary', r.result_summary,
    'safe_error_code', r.safe_error_code,
    'created_at', r.created_at,
    'completed_at', r.completed_at,
    'plan', r.plan_json
  ) order by r.created_at desc), '[]'::jsonb)
  into v_runs
  from (
    select * from public.kompis_operator_runs
    where conversation_id = v_conv.id
    order by created_at desc
    limit 20
  ) r;

  return jsonb_build_object(
    'id', v_conv.id,
    'title', v_conv.title,
    'locale', v_conv.locale,
    'status', v_conv.status,
    'created_at', v_conv.created_at,
    'updated_at', v_conv.updated_at,
    'runs', v_runs
  );
end;
$$;

revoke all on function public.get_app_kompis_operator_conversation(uuid) from public, anon;
grant execute on function public.get_app_kompis_operator_conversation(uuid) to authenticated;

create or replace function public.create_app_kompis_operator_run(
  p_conversation_id uuid,
  p_request_text text,
  p_plan jsonb,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_role text;
  v_conv public.kompis_operator_conversations;
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_request text := left(btrim(coalesce(p_request_text, '')), 4000);
  v_plan jsonb := coalesce(p_plan, '{}'::jsonb);
  v_prior public.kompis_operator_runs;
  v_run_id uuid;
  v_risk int;
  v_requires boolean;
  v_step jsonb;
  v_seq int;
  v_tool text;
  v_status text;
  v_approval text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  v_user := (v_access->>'user_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');

  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 or v_key !~ '^kor-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if v_request = '' or char_length(v_request) < 2 then
    raise exception 'INVALID_REQUEST' using errcode = 'P0001';
  end if;

  select * into v_prior
  from public.kompis_operator_runs
  where organization_id = v_org and idempotency_key = v_key
  limit 1;
  if v_prior.id is not null then
    if v_prior.request_text <> v_request or v_prior.conversation_id <> p_conversation_id then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    return jsonb_build_object('id', v_prior.id, 'idempotent_replay', true, 'status', v_prior.status, 'approval_status', v_prior.approval_status, 'plan', v_prior.plan_json);
  end if;

  select * into v_conv from public.kompis_operator_conversations
  where id = p_conversation_id and organization_id = v_org for update;
  if v_conv.id is null then
    raise exception 'CONVERSATION_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_risk := coalesce((v_plan->>'riskClass')::int, 0);
  if v_risk < 0 or v_risk > 3 then
    raise exception 'INVALID_PLAN' using errcode = 'P0001';
  end if;
  if v_risk = 3 then
    raise exception 'CRITICAL_BLOCKED' using errcode = 'P0001';
  end if;

  if jsonb_typeof(v_plan->'steps') <> 'array' or jsonb_array_length(v_plan->'steps') < 1 or jsonb_array_length(v_plan->'steps') > 8 then
    raise exception 'INVALID_PLAN' using errcode = 'P0001';
  end if;

  for v_step in select * from jsonb_array_elements(v_plan->'steps')
  loop
    v_tool := v_step->>'toolKey';
    if not public._kompis_operator_tool_allowed(v_tool) then
      raise exception 'TOOL_NOT_ALLOWED' using errcode = 'P0001';
    end if;
  end loop;

  v_requires := coalesce((v_plan->>'requiresApproval')::boolean, v_risk >= 1);

  v_status := case when v_requires then 'awaiting_approval' else 'planned' end;
  v_approval := case when v_requires then 'pending' else 'not_required' end;

  insert into public.kompis_operator_runs (
    conversation_id, organization_id, requested_by, request_text, normalized_request,
    intent, user_summary, risk_class, requires_approval, status, approval_status,
    idempotency_key, plan_json, started_at
  ) values (
    v_conv.id, v_org, v_user, v_request, lower(v_request),
    v_plan->>'intent', v_plan->>'userSummary', v_risk, v_requires, v_status, v_approval,
    v_key, v_plan, now()
  ) returning id into v_run_id;

  for v_step in select * from jsonb_array_elements(v_plan->'steps')
  loop
    v_seq := coalesce((v_step->>'sequence')::int, 0);
    insert into public.kompis_operator_steps (
      run_id, sequence, tool_key, tool_version, risk_class, purpose, requires_approval, status
    ) values (
      v_run_id,
      v_seq,
      v_step->>'toolKey',
      coalesce(v_step->>'toolVersion', '1'),
      coalesce((v_step->>'riskClass')::int, v_risk),
      coalesce(v_step->>'purpose', ''),
      coalesce((v_step->>'requiresApproval')::boolean, v_requires),
      'pending'
    );
  end loop;

  update public.kompis_operator_conversations set updated_at = now() where id = v_conv.id;

  perform public.record_trust_audit_event(
    v_org,
    'kompis_operator_run_created',
    'success',
    'kompis_operator',
    left(v_request, 200),
    'operator',
    null,
    jsonb_build_object(
      'run_id', v_run_id,
      'risk_class', v_risk,
      'idempotency_key', v_key,
      'conversation_id', v_conv.id
    )
  );

  return jsonb_build_object(
    'id', v_run_id,
    'idempotent_replay', false,
    'status', v_status,
    'approval_status', v_approval,
    'risk_class', v_risk,
    'requires_approval', v_requires,
    'plan', v_plan
  );
end;
$$;

revoke all on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) from public, anon;
grant execute on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) to authenticated;

create or replace function public.approve_app_kompis_operator_run(
  p_run_id uuid,
  p_confirmation boolean,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_role text;
  v_run public.kompis_operator_runs;
  v_reason text := left(btrim(coalesce(p_reason, '')), 500);
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');

  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org for update;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_run.approval_status = 'approved' then
    return jsonb_build_object('id', v_run.id, 'approval_status', 'approved', 'status', v_run.status, 'idempotent_replay', true);
  end if;
  if v_run.approval_status <> 'pending' then
    raise exception 'APPROVAL_NOT_PENDING' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if v_run.risk_class >= 2 and lower(v_role) not in ('owner', 'admin', 'organization_owner', 'organization_admin') then
    raise exception 'APPROVAL_ROLE_REQUIRED' using errcode = 'P0001';
  end if;
  if v_run.risk_class >= 2 and (v_reason is null or char_length(v_reason) < 3) then
    raise exception 'REASON_REQUIRED' using errcode = 'P0001';
  end if;

  insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
  values (v_run.id, (v_access->>'user_id')::uuid, v_role, true, v_reason, 'approved');

  update public.kompis_operator_runs
  set approval_status = 'approved', status = 'planned', updated_at = now()
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org, 'kompis_operator_run_approved', 'success', 'kompis_operator', v_reason, 'operator', null,
    jsonb_build_object('run_id', v_run.id, 'role', v_role)
  );

  return jsonb_build_object('id', v_run.id, 'approval_status', 'approved', 'status', 'planned', 'idempotent_replay', false);
end;
$$;

revoke all on function public.approve_app_kompis_operator_run(uuid, boolean, text) from public, anon;
grant execute on function public.approve_app_kompis_operator_run(uuid, boolean, text) to authenticated;

create or replace function public.reject_app_kompis_operator_run(p_run_id uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_run public.kompis_operator_runs;
  v_reason text := left(btrim(coalesce(p_reason, '')), 500);
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org for update;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_run.approval_status = 'rejected' then
    return jsonb_build_object('id', v_run.id, 'approval_status', 'rejected', 'status', 'rejected', 'idempotent_replay', true);
  end if;

  insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
  values (v_run.id, (v_access->>'user_id')::uuid, v_access->>'organization_role', false, v_reason, 'rejected');

  update public.kompis_operator_runs
  set approval_status = 'rejected', status = 'rejected', completed_at = now(), updated_at = now(), result_summary = 'Plan rejected'
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org, 'kompis_operator_run_rejected', 'blocked', 'kompis_operator', v_reason, 'operator', null,
    jsonb_build_object('run_id', v_run.id)
  );

  return jsonb_build_object('id', v_run.id, 'approval_status', 'rejected', 'status', 'rejected', 'idempotent_replay', false);
end;
$$;

revoke all on function public.reject_app_kompis_operator_run(uuid, text) from public, anon;
grant execute on function public.reject_app_kompis_operator_run(uuid, text) to authenticated;

create or replace function public.get_app_kompis_operator_run(p_run_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_run public.kompis_operator_runs;
  v_steps jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id,
    'sequence', s.sequence,
    'tool_key', s.tool_key,
    'tool_version', s.tool_version,
    'risk_class', s.risk_class,
    'purpose', s.purpose,
    'requires_approval', s.requires_approval,
    'status', s.status,
    'result_summary', s.result_summary
  ) order by s.sequence), '[]'::jsonb)
  into v_steps
  from public.kompis_operator_steps s where s.run_id = v_run.id;

  return jsonb_build_object(
    'id', v_run.id,
    'conversation_id', v_run.conversation_id,
    'status', v_run.status,
    'approval_status', v_run.approval_status,
    'risk_class', v_run.risk_class,
    'requires_approval', v_run.requires_approval,
    'intent', v_run.intent,
    'user_summary', v_run.user_summary,
    'request_text', v_run.request_text,
    'plan', v_run.plan_json,
    'result_summary', v_run.result_summary,
    'safe_error_code', v_run.safe_error_code,
    'idempotency_key', v_run.idempotency_key,
    'created_at', v_run.created_at,
    'completed_at', v_run.completed_at,
    'steps', v_steps
  );
end;
$$;

revoke all on function public.get_app_kompis_operator_run(uuid) from public, anon;
grant execute on function public.get_app_kompis_operator_run(uuid) to authenticated;

create or replace function public.begin_app_kompis_operator_run_execution(p_run_id uuid, p_idempotency_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_run public.kompis_operator_runs;
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org for update;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_key is null or v_key <> v_run.idempotency_key then
    raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
  end if;
  if v_run.status in ('completed', 'partial', 'failed', 'blocked', 'rejected') then
    return jsonb_build_object('id', v_run.id, 'status', v_run.status, 'already_finished', true);
  end if;
  if v_run.requires_approval and v_run.approval_status <> 'approved' then
    raise exception 'APPROVAL_REQUIRED' using errcode = 'P0001';
  end if;
  if v_run.risk_class = 3 then
    raise exception 'CRITICAL_BLOCKED' using errcode = 'P0001';
  end if;

  update public.kompis_operator_runs
  set status = 'executing', updated_at = now(), started_at = coalesce(started_at, now())
  where id = v_run.id;

  return jsonb_build_object('id', v_run.id, 'status', 'executing', 'already_finished', false, 'plan', v_run.plan_json);
end;
$$;

revoke all on function public.begin_app_kompis_operator_run_execution(uuid, text) from public, anon;
grant execute on function public.begin_app_kompis_operator_run_execution(uuid, text) to authenticated;

create or replace function public.record_app_kompis_operator_step_result(
  p_run_id uuid,
  p_sequence int,
  p_status text,
  p_result jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_run public.kompis_operator_runs;
  v_step public.kompis_operator_steps;
  v_status text := lower(btrim(coalesce(p_status, '')));
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org for update;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_run.status <> 'executing' then raise exception 'RUN_NOT_EXECUTING' using errcode = 'P0001'; end if;
  if v_status not in ('completed', 'failed', 'blocked', 'skipped') then
    raise exception 'INVALID_STEP_STATUS' using errcode = 'P0001';
  end if;

  select * into v_step from public.kompis_operator_steps
  where run_id = v_run.id and sequence = p_sequence for update;
  if v_step.id is null then raise exception 'STEP_NOT_FOUND' using errcode = 'P0001'; end if;

  update public.kompis_operator_steps
  set status = v_status, result_summary = coalesce(p_result, '{}'::jsonb), updated_at = now()
  where id = v_step.id;

  return jsonb_build_object('run_id', v_run.id, 'sequence', p_sequence, 'status', v_status);
end;
$$;

revoke all on function public.record_app_kompis_operator_step_result(uuid, int, text, jsonb) from public, anon;
grant execute on function public.record_app_kompis_operator_step_result(uuid, int, text, jsonb) to authenticated;

create or replace function public.complete_app_kompis_operator_run(
  p_run_id uuid,
  p_status text,
  p_result_summary text,
  p_safe_error_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_run public.kompis_operator_runs;
  v_status text := lower(btrim(coalesce(p_status, '')));
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org for update;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_status not in ('completed', 'partial', 'failed', 'blocked', 'attention') then
    raise exception 'INVALID_RUN_STATUS' using errcode = 'P0001';
  end if;

  update public.kompis_operator_runs
  set status = v_status,
      result_summary = left(coalesce(p_result_summary, ''), 1000),
      safe_error_code = nullif(left(coalesce(p_safe_error_code, ''), 80), ''),
      completed_at = now(),
      updated_at = now()
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org,
    'kompis_operator_run_completed',
    case when v_status = 'completed' then 'success' when v_status in ('failed','blocked') then 'failure' else 'pending' end,
    'kompis_operator',
    left(coalesce(p_result_summary, ''), 200),
    'operator',
    null,
    jsonb_build_object('run_id', v_run.id, 'status', v_status, 'safe_error_code', p_safe_error_code)
  );

  return jsonb_build_object('id', v_run.id, 'status', v_status);
end;
$$;

revoke all on function public.complete_app_kompis_operator_run(uuid, text, text, text) from public, anon;
grant execute on function public.complete_app_kompis_operator_run(uuid, text, text, text) to authenticated;


-- High-risk Platform write gate applied to canonical delivery write RPCs

create or replace function public.deliver_platform_customer_app_and_website_kompis(
  p_customer_id uuid,
  p_internal_reason text,
  p_confirmation boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status jsonb;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_prior jsonb;
  v_hash text;
  v_install_id uuid;
  v_license_id uuid;
  v_domain_hostname text;
  v_module public.tenant_modules;
  v_config public.tenant_public_companion_install_config;
  v_ack jsonb;
  v_result jsonb;
  v_reason_lower text;
  v_created boolean := false;
  v_delivery_id uuid := gen_random_uuid();
  v_delivery_status text;
  v_meta jsonb;
begin
  perform public._platform_require_high_risk_write();

  if p_customer_id is null then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001';
  end if;

  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;

  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_reason_lower := lower(v_reason);
  if v_reason_lower ~ '(sk-|rk_|bearer |password|secret|api[_-]?key|totp|mfa|authorization:)' then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  if v_key !~ '^akd-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hash := md5(p_customer_id::text || '|' || v_reason || '|true|deliver');

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_app_kompis_deliver'
    and metadata ->> 'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior ->> 'payload_hash', '') <> v_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    return coalesce(v_prior -> 'result', '{}'::jsonb)
      || jsonb_build_object('idempotent_replay', true, 'created', false);
  end if;

  perform 1 from public.customers where id = p_customer_id for update;

  v_status := public.get_platform_portal_app_kompis_delivery_status(p_customer_id);
  if v_status is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  if coalesce((v_status ->> 'active')::boolean, false) then
    v_result := jsonb_build_object(
      'customer_id', p_customer_id,
      'created', false,
      'idempotent_replay', false,
      'delivery_status', 'active',
      'delivery', jsonb_build_object(
        'id', v_status -> 'existing_delivery' ->> 'id',
        'status', 'active',
        'delivered_at', v_status -> 'existing_delivery' -> 'delivered_at'
      ),
      'parent_license', jsonb_build_object(
        'id', v_status -> 'parent_license' ->> 'id',
        'status', v_status -> 'parent_license' ->> 'status',
        'provisioning_status', 'active'
      ),
      'app_panel', jsonb_build_object(
        'organization_id', v_status -> 'app_panel' ->> 'organization_id',
        'status', v_status -> 'app_panel' ->> 'status'
      ),
      'child_entitlement', jsonb_build_object(
        'id', v_status -> 'child_entitlement' ->> 'id',
        'status', v_status -> 'child_entitlement' ->> 'status',
        'licensed', coalesce((v_status -> 'child_entitlement' ->> 'licensed')::boolean, false),
        'enabled', coalesce((v_status -> 'child_entitlement' ->> 'enabled')::boolean, false)
      ),
      'domain', jsonb_build_object(
        'id', v_status -> 'domain' ->> 'id',
        'hostname', v_status -> 'domain' ->> 'hostname'
      ),
      'installation', jsonb_build_object(
        'id', v_status -> 'installation' ->> 'id',
        'install_id', v_status -> 'installation' ->> 'install_id'
      ),
      'auto_install', jsonb_build_object(
        'config_enabled', coalesce((v_status -> 'auto_install' ->> 'config_enabled')::boolean, false)
      ),
      'acknowledgement', v_status -> 'acknowledgement'
    );

    perform public.record_platform_admin_audit_event(
      'platform_customer_app_kompis_deliver',
      'customer',
      p_customer_id::text,
      jsonb_build_object(
        'customer_id', p_customer_id,
        'organization_id', p_customer_id,
        'agreement_id', v_status -> 'agreement' ->> 'id',
        'parent_license_id', v_status -> 'parent_license' ->> 'id',
        'child_entitlement_id', v_status -> 'child_entitlement' ->> 'id',
        'domain', v_status -> 'domain' ->> 'hostname',
        'installation_id', v_status -> 'installation' ->> 'id',
        'delivery_id', v_status -> 'existing_delivery' ->> 'id',
        'previous_status', 'active',
        'resulting_status', 'active',
        'internal_reason', v_reason,
        'idempotency_key', v_key,
        'payload_hash', v_hash,
        'created', false,
        'reused', true,
        'reconciled', false,
        'already_active', true,
        'acknowledgement_status', 'verified',
        'result', v_result
      )
    );

    return v_result;
  end if;

  if not coalesce((v_status ->> 'eligible')::boolean, false)
     and not (
       coalesce((v_status -> 'child_entitlement' ->> 'licensed')::boolean, false)
       and coalesce((v_status -> 'auto_install' ->> 'config_enabled')::boolean, false)
     )
  then
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'agreement_active' and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'COMMERCIAL_PLAN_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'parent_license_active' and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      if (v_status -> 'parent_license' ->> 'id') is null then
        raise exception 'PARENT_LICENSE_REQUIRED' using errcode = 'P0001';
      end if;
      raise exception 'PARENT_LICENSE_NOT_ELIGIBLE' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' in ('domain_linked', 'domain_verified')
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'DOMAIN_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' in ('installation_linked', 'install_trust_present')
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'INSTALLATION_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'app_panel_resolvable'
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'APP_PANEL_REQUIRED' using errcode = 'P0001';
    end if;
    raise exception 'PREREQUISITES_NOT_MET' using errcode = 'P0001';
  end if;

  v_install_id := (v_status -> 'installation' ->> 'id')::uuid;
  v_license_id := (v_status -> 'parent_license' ->> 'id')::uuid;
  v_domain_hostname := v_status -> 'domain' ->> 'hostname';

  if v_install_id is null then
    raise exception 'INSTALL_ID_REQUIRED' using errcode = 'P0001';
  end if;

  perform 1
  from public.tenant_modules
  where tenant_id = p_customer_id
    and module_key = 'website_kompis'
  for update;

  perform 1
  from public.tenant_public_companion_install_config
  where tenant_id = p_customer_id
    and install_id = v_install_id
  for update;

  select * into v_module
  from public.tenant_modules
  where tenant_id = p_customer_id
    and module_key = 'website_kompis'
  limit 1;

  v_meta := jsonb_build_object(
    'parent_license_id', v_license_id,
    'installation_id', v_install_id,
    'domain', v_domain_hostname,
    'app_panel_organization_id', p_customer_id,
    'delivery_model', 'canonical_v1',
    'delivery_id', v_delivery_id,
    'delivered_at', now()
  );

  if v_module.id is null then
    insert into public.tenant_modules (
      tenant_id,
      module_key,
      licensed,
      enabled,
      status,
      activated_at,
      metadata
    )
    values (
      p_customer_id,
      'website_kompis',
      true,
      true,
      'enabled',
      now(),
      v_meta
    )
    returning * into v_module;
    v_created := true;
  else
    update public.tenant_modules
    set
      licensed = true,
      enabled = true,
      status = 'enabled',
      activated_at = coalesce(activated_at, now()),
      metadata = coalesce(metadata, '{}'::jsonb) || v_meta,
      updated_at = now()
    where id = v_module.id
    returning * into v_module;
  end if;

  select * into v_config
  from public.tenant_public_companion_install_config
  where tenant_id = p_customer_id
    and install_id = v_install_id
  limit 1;

  if v_config.id is null then
    insert into public.tenant_public_companion_install_config (
      tenant_id,
      install_id,
      config,
      updated_by
    )
    values (
      p_customer_id,
      v_install_id,
      public._wpkf_sanitize_install_config_patch(jsonb_build_object('enabled', true)),
      auth.uid()
    )
    returning * into v_config;
    v_created := true;
  else
    update public.tenant_public_companion_install_config
    set
      config = public._wpkf_merge_install_config(
        coalesce(config, '{}'::jsonb),
        public._wpkf_sanitize_install_config_patch(jsonb_build_object('enabled', true))
      ),
      updated_by = auth.uid(),
      updated_at = now()
    where id = v_config.id
    returning * into v_config;
  end if;

  v_ack := public._platform_portal_app_kompis_ack(
    p_customer_id,
    v_install_id,
    v_domain_hostname
  );

  v_delivery_status := case
    when coalesce((v_ack ->> 'ok')::boolean, false) then 'active'
    else 'awaiting_confirmation'
  end;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'created', v_created,
    'idempotent_replay', false,
    'delivery_status', v_delivery_status,
    'delivery', jsonb_build_object(
      'id', v_delivery_id,
      'status', v_delivery_status,
      'delivered_at', now()
    ),
    'parent_license', jsonb_build_object(
      'id', v_license_id,
      'status', v_status -> 'parent_license' ->> 'status',
      'provisioning_status', case
        when v_delivery_status = 'active' then 'active'
        else v_status -> 'parent_license' ->> 'provisioning_status'
      end
    ),
    'app_panel', jsonb_build_object(
      'organization_id', p_customer_id,
      'status', 'ready'
    ),
    'child_entitlement', jsonb_build_object(
      'id', v_module.id,
      'status', v_module.status,
      'licensed', coalesce(v_module.licensed, false),
      'enabled', coalesce(v_module.enabled, false)
    ),
    'domain', jsonb_build_object(
      'id', v_status -> 'domain' ->> 'id',
      'hostname', v_domain_hostname
    ),
    'installation', jsonb_build_object(
      'id', v_install_id,
      'install_id', v_install_id
    ),
    'auto_install', jsonb_build_object(
      'config_enabled', coalesce((v_config.config ->> 'enabled')::boolean, false)
    ),
    'acknowledgement', v_ack
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_app_kompis_deliver',
    'customer',
    p_customer_id::text,
    jsonb_build_object(
      'customer_id', p_customer_id,
      'organization_id', p_customer_id,
      'agreement_id', v_status -> 'agreement' ->> 'id',
      'parent_license_id', v_license_id,
      'child_entitlement_id', v_module.id,
      'app_panel_organization_id', p_customer_id,
      'domain', v_domain_hostname,
      'installation_id', v_install_id,
      'delivery_id', v_delivery_id,
      'install_command', 'runtime_config_sync',
      'previous_status', v_status ->> 'delivery_status',
      'resulting_status', v_delivery_status,
      'internal_reason', v_reason,
      'idempotency_key', v_key,
      'payload_hash', v_hash,
      'created', v_created,
      'reused', not v_created,
      'reconciled', false,
      'acknowledgement_status', case
        when coalesce((v_ack ->> 'ok')::boolean, false) then 'verified'
        else 'pending'
      end,
      'result', v_result
    )
  );

  return v_result;
end;
$$;

revoke all on function public.deliver_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  from public, anon;
grant execute on function public.deliver_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  to authenticated;


create or replace function public.reconcile_platform_customer_app_and_website_kompis(
  p_customer_id uuid,
  p_internal_reason text,
  p_confirmation boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status jsonb;
  v_deliver jsonb;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_prior jsonb;
  v_hash text;
  v_changes text[] := array[]::text[];
  v_result jsonb;
begin
  perform public._platform_require_high_risk_write();

  if p_customer_id is null then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001';
  end if;

  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;

  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  if lower(v_reason) ~ '(sk-|rk_|bearer |password|secret|api[_-]?key|totp|mfa|authorization:)' then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 or v_key !~ '^akd-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hash := md5(p_customer_id::text || '|' || v_reason || '|true|reconcile');

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_app_kompis_reconcile'
    and metadata ->> 'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior ->> 'payload_hash', '') <> v_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    return coalesce(v_prior -> 'result', '{}'::jsonb)
      || jsonb_build_object('idempotent_replay', true, 'created', false, 'reconciled', false);
  end if;

  v_status := public.get_platform_portal_app_kompis_delivery_status(p_customer_id);
  if v_status is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  -- Already fully active with acknowledgement: adopt/verify without writes beyond audit.
  if coalesce((v_status ->> 'active')::boolean, false) then
    if coalesce(v_status -> 'child_entitlement' ->> 'delivery_model', '') is distinct from 'canonical_v1' then
      v_changes := array_append(v_changes, 'adopt_canonical_metadata');
      update public.tenant_modules
      set
        metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
          'parent_license_id', v_status -> 'parent_license' ->> 'id',
          'installation_id', v_status -> 'installation' ->> 'id',
          'domain', v_status -> 'domain' ->> 'hostname',
          'app_panel_organization_id', p_customer_id,
          'delivery_model', 'canonical_v1',
          'delivery_id', coalesce(metadata ->> 'delivery_id', gen_random_uuid()::text),
          'delivered_at', coalesce(metadata ->> 'delivered_at', now()::text),
          'reconciled_at', now()
        ),
        updated_at = now()
      where tenant_id = p_customer_id
        and module_key = 'website_kompis';
    end if;

    v_result := jsonb_build_object(
      'customer_id', p_customer_id,
      'created', false,
      'idempotent_replay', false,
      'reconciled', cardinality(v_changes) > 0,
      'changes', to_jsonb(v_changes),
      'delivery_status', 'active',
      'delivery', jsonb_build_object(
        'id', v_status -> 'existing_delivery' ->> 'id',
        'status', 'active',
        'delivered_at', v_status -> 'existing_delivery' -> 'delivered_at'
      ),
      'parent_license', jsonb_build_object(
        'id', v_status -> 'parent_license' ->> 'id',
        'status', v_status -> 'parent_license' ->> 'status',
        'provisioning_status', 'active'
      ),
      'app_panel', jsonb_build_object(
        'organization_id', v_status -> 'app_panel' ->> 'organization_id',
        'status', v_status -> 'app_panel' ->> 'status'
      ),
      'child_entitlement', jsonb_build_object(
        'id', v_status -> 'child_entitlement' ->> 'id',
        'status', v_status -> 'child_entitlement' ->> 'status',
        'licensed', coalesce((v_status -> 'child_entitlement' ->> 'licensed')::boolean, false),
        'enabled', coalesce((v_status -> 'child_entitlement' ->> 'enabled')::boolean, false)
      ),
      'domain', jsonb_build_object(
        'id', v_status -> 'domain' ->> 'id',
        'hostname', v_status -> 'domain' ->> 'hostname'
      ),
      'installation', jsonb_build_object(
        'id', v_status -> 'installation' ->> 'id',
        'install_id', v_status -> 'installation' ->> 'install_id'
      ),
      'auto_install', jsonb_build_object(
        'config_enabled', coalesce((v_status -> 'auto_install' ->> 'config_enabled')::boolean, false)
      ),
      'acknowledgement', v_status -> 'acknowledgement'
    );

    perform public.record_platform_admin_audit_event(
      'platform_customer_app_kompis_reconcile',
      'customer',
      p_customer_id::text,
      jsonb_build_object(
        'customer_id', p_customer_id,
        'organization_id', p_customer_id,
        'parent_license_id', v_status -> 'parent_license' ->> 'id',
        'child_entitlement_id', v_status -> 'child_entitlement' ->> 'id',
        'domain', v_status -> 'domain' ->> 'hostname',
        'installation_id', v_status -> 'installation' ->> 'id',
        'delivery_id', v_status -> 'existing_delivery' ->> 'id',
        'previous_status', v_status ->> 'delivery_status',
        'resulting_status', 'active',
        'internal_reason', v_reason,
        'idempotency_key', v_key,
        'payload_hash', v_hash,
        'created', false,
        'reused', true,
        'reconciled', cardinality(v_changes) > 0,
        'already_active', true,
        'acknowledgement_status', 'verified',
        'changes', to_jsonb(v_changes),
        'result', v_result
      )
    );

    return v_result;
  end if;

  -- Incomplete but prerequisites OK / partial state: reuse deliver path.
  v_deliver := public.deliver_platform_customer_app_and_website_kompis(
    p_customer_id,
    v_reason,
    true,
    v_key
  );

  v_result := v_deliver || jsonb_build_object(
    'reconciled', true,
    'changes', jsonb_build_array('canonical_delivery')
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_app_kompis_reconcile',
    'customer',
    p_customer_id::text,
    jsonb_build_object(
      'customer_id', p_customer_id,
      'organization_id', p_customer_id,
      'parent_license_id', v_deliver -> 'parent_license' ->> 'id',
      'child_entitlement_id', v_deliver -> 'child_entitlement' ->> 'id',
      'domain', v_deliver -> 'domain' ->> 'hostname',
      'installation_id', v_deliver -> 'installation' ->> 'id',
      'delivery_id', v_deliver -> 'delivery' ->> 'id',
      'previous_status', v_status ->> 'delivery_status',
      'resulting_status', v_deliver ->> 'delivery_status',
      'internal_reason', v_reason,
      'idempotency_key', v_key,
      'payload_hash', v_hash,
      'created', coalesce((v_deliver ->> 'created')::boolean, false),
      'reused', not coalesce((v_deliver ->> 'created')::boolean, false),
      'reconciled', true,
      'acknowledgement_status', case
        when coalesce((v_deliver -> 'acknowledgement' ->> 'ok')::boolean, false) then 'verified'
        else 'pending'
      end,
      'result', v_result
    )
  );

  return v_result;
end;
$$;

revoke all on function public.reconcile_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  from public, anon;
grant execute on function public.reconcile_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  to authenticated;
