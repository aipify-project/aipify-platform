-- AIPIFY.KOMPIS.WEBSITE.TOOLS.CORE.APPROVAL.INTEGRATION.V1
-- Explicit website tool allowlist parity + Trust & Action (Approval Center) as
-- authoritative CORE.APPROVAL for publish/rollback. Apply-side effects = 0.

-- ---------------------------------------------------------------------------
-- 1. Explicit tool allowlist (no wildcard) — TS registry parity
-- ---------------------------------------------------------------------------
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
    'support_case_read',
    'notifications_read',
    'organization_members_read',
    'activity_summary_read',
    'knowledge_search',
    'content_inventory_read',
    'operator_history_read',
    'website_overview_read',
    'website_pages_read',
    'website_page_read',
    'website_navigation_read',
    'website_seo_audit',
    'website_content_quality_audit',
    'website_locale_coverage_read',
    'website_publish_history_read',
    'website_health_read',
    'website_preview_status_read',
    'website_page_draft_create',
    'website_page_draft_update',
    'website_seo_draft_update',
    'website_navigation_draft_update',
    'website_translation_draft_create',
    'website_section_draft_update',
    'website_image_metadata_draft_update',
    'website_draft_preview_create',
    'website_publish_approved_draft',
    'website_publish_rollback',
    'support_case_create',
    'support_case_reply',
    'notification_mark_read',
    'organization_profile_draft',
    'content_draft_create',
    'content_draft_update',
    'knowledge_draft_create'
  );
$$;

revoke all on function public._kompis_operator_tool_allowed(text) from public, anon;
grant execute on function public._kompis_operator_tool_allowed(text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 2. Tools that require authoritative CORE.APPROVAL (Approval Center)
-- ---------------------------------------------------------------------------
create or replace function public._kompis_operator_tool_requires_core_approval(p_tool_key text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select p_tool_key in (
    'website_publish_approved_draft',
    'website_publish_rollback'
  );
$$;

revoke all on function public._kompis_operator_tool_requires_core_approval(text) from public, anon;
grant execute on function public._kompis_operator_tool_requires_core_approval(text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. Binding table — Kompis run/step ↔ action_requests (CORE.APPROVAL)
-- ---------------------------------------------------------------------------
create table if not exists public.kompis_operator_core_approval_bindings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.customers(id) on delete cascade,
  run_id uuid not null references public.kompis_operator_runs(id) on delete cascade,
  step_id uuid references public.kompis_operator_steps(id) on delete set null,
  tool_key text not null,
  action_request_id uuid not null references public.action_requests(id) on delete restrict,
  website_id uuid,
  path text,
  candidate_id uuid,
  target_version_id uuid,
  expected_current_version_id uuid,
  action_checksum text,
  scope_json jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kompis_core_approval_tool_check check (
    tool_key in ('website_publish_approved_draft', 'website_publish_rollback')
  )
);

create unique index if not exists idx_kompis_core_approval_unique_scope
  on public.kompis_operator_core_approval_bindings (
    organization_id,
    run_id,
    tool_key,
    coalesce(step_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

create index if not exists idx_kompis_core_approval_action
  on public.kompis_operator_core_approval_bindings (action_request_id);

create index if not exists idx_kompis_core_approval_run
  on public.kompis_operator_core_approval_bindings (organization_id, run_id);

alter table public.kompis_operator_core_approval_bindings enable row level security;

drop policy if exists kompis_core_approval_bindings_select on public.kompis_operator_core_approval_bindings;
create policy kompis_core_approval_bindings_select
  on public.kompis_operator_core_approval_bindings
  for select
  to authenticated
  using (
    organization_id = public._presence_tenant_for_auth()
  );

revoke all on table public.kompis_operator_core_approval_bindings from public, anon;
grant select on table public.kompis_operator_core_approval_bindings to authenticated;
grant all on table public.kompis_operator_core_approval_bindings to service_role;

alter table public.kompis_operator_runs
  add column if not exists core_approval_required boolean not null default false;

alter table public.kompis_operator_runs
  add column if not exists core_approval_request_id uuid references public.action_requests(id);

alter table public.kompis_operator_steps
  add column if not exists core_approval_request_id uuid references public.action_requests(id);

-- ---------------------------------------------------------------------------
-- 4. Request CORE.APPROVAL (idempotent) via Trust & Action action_requests
-- ---------------------------------------------------------------------------
create or replace function public.request_kompis_operator_core_approval(
  p_run_id uuid,
  p_step_id uuid,
  p_tool_key text,
  p_scope jsonb default '{}'::jsonb
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
  v_run public.kompis_operator_runs;
  v_step public.kompis_operator_steps;
  v_tool text := lower(btrim(coalesce(p_tool_key, '')));
  v_scope jsonb := coalesce(p_scope, '{}'::jsonb);
  v_existing public.kompis_operator_core_approval_bindings;
  v_action_id uuid;
  v_email text;
  v_desc text;
  v_path text;
  v_website_id uuid;
  v_candidate_id uuid;
  v_target_id uuid;
  v_expected_id uuid;
  v_checksum text;
  v_expires timestamptz := now() + interval '24 hours';
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  v_user := (v_access->>'user_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');

  if not public._kompis_operator_tool_requires_core_approval(v_tool) then
    raise exception 'CORE_APPROVAL_NOT_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_run
  from public.kompis_operator_runs
  where id = p_run_id and organization_id = v_org
  for update;
  if v_run.id is null then
    raise exception 'RUN_NOT_FOUND' using errcode = 'P0001';
  end if;

  if p_step_id is not null then
    select * into v_step
    from public.kompis_operator_steps
    where id = p_step_id and run_id = v_run.id
    for update;
    if v_step.id is null then
      raise exception 'STEP_NOT_FOUND' using errcode = 'P0001';
    end if;
    if v_step.tool_key <> v_tool then
      raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
    end if;
  end if;

  select * into v_existing
  from public.kompis_operator_core_approval_bindings
  where organization_id = v_org
    and run_id = v_run.id
    and tool_key = v_tool
    and coalesce(step_id, '00000000-0000-0000-0000-000000000000'::uuid)
        = coalesce(p_step_id, '00000000-0000-0000-0000-000000000000'::uuid)
  limit 1;

  if v_existing.id is not null then
    return jsonb_build_object(
      'id', v_existing.id,
      'action_request_id', v_existing.action_request_id,
      'tool_key', v_existing.tool_key,
      'idempotent_replay', true,
      'expires_at', v_existing.expires_at,
      'used_at', v_existing.used_at
    );
  end if;

  v_path := nullif(btrim(coalesce(v_scope->>'path', '')), '');
  v_website_id := nullif(v_scope->>'website_id', '')::uuid;
  v_candidate_id := nullif(v_scope->>'candidate_id', '')::uuid;
  v_target_id := nullif(v_scope->>'target_version_id', '')::uuid;
  v_expected_id := nullif(v_scope->>'expected_current_version_id', '')::uuid;
  v_checksum := nullif(btrim(coalesce(v_scope->>'action_checksum', '')), '');

  v_desc := case
    when v_tool = 'website_publish_approved_draft' then
      'Kompis requests publish of a website draft candidate'
      || case when v_path is not null then (' for path ' || left(v_path, 120)) else '' end
      || '.'
    else
      'Kompis requests rollback of a published website version'
      || case when v_path is not null then (' for path ' || left(v_path, 120)) else '' end
      || '.'
  end;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.id = v_user
  limit 1;

  insert into public.action_requests (
    tenant_id, skill_id, action_name, description, risk_level,
    resource_type, resource_id, requested_by, undo_available,
    approver_role_required, status
  ) values (
    v_org,
    null,
    v_tool,
    left(v_desc, 500),
    3,
    'kompis_operator_run',
    v_run.id::text,
    coalesce(v_email, 'system'),
    v_tool = 'website_publish_rollback',
    public._action_approver_role(3),
    'pending'
  )
  returning id into v_action_id;

  insert into public.action_explanations (
    action_request_id, explanation, confidence_score, supporting_events
  ) values (
    v_action_id,
    'Aipify prepared this website change through Kompis. Review scope, then approve or reject in Approval Center.',
    80,
    jsonb_build_array(
      jsonb_build_object(
        'source', 'kompis_operator',
        'run_id', v_run.id,
        'step_id', p_step_id,
        'tool_key', v_tool,
        'website_id', v_website_id,
        'path', v_path,
        'candidate_id', v_candidate_id,
        'target_version_id', v_target_id,
        'expected_current_version_id', v_expected_id,
        'action_checksum', v_checksum,
        'role_snapshot', v_role
      )
    )
  );

  perform public.log_action_audit(
    v_action_id,
    'requested',
    coalesce(v_email, 'system'),
    jsonb_build_object(
      'source', 'kompis_operator',
      'run_id', v_run.id,
      'tool_key', v_tool
    )
  );

  insert into public.kompis_operator_core_approval_bindings (
    organization_id, run_id, step_id, tool_key, action_request_id,
    website_id, path, candidate_id, target_version_id, expected_current_version_id,
    action_checksum, scope_json, expires_at
  ) values (
    v_org, v_run.id, p_step_id, v_tool, v_action_id,
    v_website_id, v_path, v_candidate_id, v_target_id, v_expected_id,
    v_checksum, v_scope, v_expires
  )
  returning * into v_existing;

  update public.kompis_operator_runs
  set
    core_approval_required = true,
    core_approval_request_id = v_action_id,
    requires_approval = true,
    updated_at = now()
  where id = v_run.id;

  if p_step_id is not null then
    update public.kompis_operator_steps
    set core_approval_request_id = v_action_id, updated_at = now()
    where id = p_step_id;
  end if;

  perform public.record_trust_audit_event(
    v_org,
    'kompis_operator_core_approval_requested',
    'success',
    'kompis_operator',
    left(v_desc, 200),
    'operator',
    null,
    jsonb_build_object(
      'run_id', v_run.id,
      'step_id', p_step_id,
      'tool_key', v_tool,
      'action_request_id', v_action_id,
      'binding_id', v_existing.id
    )
  );

  return jsonb_build_object(
    'id', v_existing.id,
    'action_request_id', v_action_id,
    'tool_key', v_tool,
    'idempotent_replay', false,
    'expires_at', v_expires,
    'used_at', null
  );
end;
$$;

revoke all on function public.request_kompis_operator_core_approval(uuid, uuid, text, jsonb) from public, anon;
grant execute on function public.request_kompis_operator_core_approval(uuid, uuid, text, jsonb) to authenticated;

-- Update binding scope while CORE approval is still pending (candidate/path filled after preview)
create or replace function public.update_kompis_operator_core_approval_scope(
  p_run_id uuid,
  p_tool_key text,
  p_scope jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_tool text := lower(btrim(coalesce(p_tool_key, '')));
  v_scope jsonb := coalesce(p_scope, '{}'::jsonb);
  v_binding public.kompis_operator_core_approval_bindings;
  v_req public.action_requests%rowtype;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;

  if not public._kompis_operator_tool_requires_core_approval(v_tool) then
    raise exception 'CORE_APPROVAL_NOT_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_binding
  from public.kompis_operator_core_approval_bindings
  where organization_id = v_org
    and run_id = p_run_id
    and tool_key = v_tool
  order by created_at desc
  limit 1
  for update;

  if v_binding.id is null then
    raise exception 'CORE_APPROVAL_REQUIRED' using errcode = 'P0001';
  end if;
  if v_binding.used_at is not null then
    raise exception 'CORE_APPROVAL_ALREADY_USED' using errcode = 'P0001';
  end if;

  select * into v_req
  from public.action_requests
  where id = v_binding.action_request_id
    and tenant_id = v_org
  for update;

  if v_req.id is null or v_req.status not in ('pending', 'approved') then
    raise exception 'CORE_APPROVAL_REQUIRED' using errcode = 'P0001';
  end if;

  update public.kompis_operator_core_approval_bindings
  set
    website_id = coalesce(nullif(v_scope->>'website_id', '')::uuid, website_id),
    path = coalesce(nullif(btrim(coalesce(v_scope->>'path', '')), ''), path),
    candidate_id = coalesce(nullif(v_scope->>'candidate_id', '')::uuid, candidate_id),
    target_version_id = coalesce(nullif(v_scope->>'target_version_id', '')::uuid, target_version_id),
    expected_current_version_id = coalesce(
      nullif(v_scope->>'expected_current_version_id', '')::uuid,
      expected_current_version_id
    ),
    action_checksum = coalesce(nullif(btrim(coalesce(v_scope->>'action_checksum', '')), ''), action_checksum),
    scope_json = coalesce(scope_json, '{}'::jsonb) || v_scope,
    updated_at = now()
  where id = v_binding.id
  returning * into v_binding;

  return jsonb_build_object(
    'id', v_binding.id,
    'action_request_id', v_binding.action_request_id,
    'tool_key', v_binding.tool_key,
    'path', v_binding.path,
    'candidate_id', v_binding.candidate_id,
    'target_version_id', v_binding.target_version_id,
    'expected_current_version_id', v_binding.expected_current_version_id
  );
end;
$$;

revoke all on function public.update_kompis_operator_core_approval_scope(uuid, text, jsonb) from public, anon;
grant execute on function public.update_kompis_operator_core_approval_scope(uuid, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Assert CORE approval ready for exact scope (no consume)
-- ---------------------------------------------------------------------------
create or replace function public.assert_kompis_operator_core_approval_ready(
  p_run_id uuid,
  p_step_id uuid,
  p_tool_key text,
  p_scope jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_tool text := lower(btrim(coalesce(p_tool_key, '')));
  v_scope jsonb := coalesce(p_scope, '{}'::jsonb);
  v_binding public.kompis_operator_core_approval_bindings;
  v_req public.action_requests%rowtype;
  v_path text := nullif(btrim(coalesce(v_scope->>'path', '')), '');
  v_website_id uuid := nullif(v_scope->>'website_id', '')::uuid;
  v_candidate_id uuid := nullif(v_scope->>'candidate_id', '')::uuid;
  v_target_id uuid := nullif(v_scope->>'target_version_id', '')::uuid;
  v_expected_id uuid := nullif(v_scope->>'expected_current_version_id', '')::uuid;
  v_checksum text := nullif(btrim(coalesce(v_scope->>'action_checksum', '')), '');
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;

  if not public._kompis_operator_tool_requires_core_approval(v_tool) then
    return jsonb_build_object('ok', true, 'required', false);
  end if;

  select * into v_binding
  from public.kompis_operator_core_approval_bindings
  where organization_id = v_org
    and run_id = p_run_id
    and tool_key = v_tool
    and (p_step_id is null or step_id = p_step_id or step_id is null)
  order by created_at desc
  limit 1
  for update;

  if v_binding.id is null then
    raise exception 'CORE_APPROVAL_REQUIRED' using errcode = 'P0001';
  end if;

  if v_binding.used_at is not null then
    raise exception 'CORE_APPROVAL_ALREADY_USED' using errcode = 'P0001';
  end if;

  if v_binding.expires_at <= now() then
    raise exception 'CORE_APPROVAL_EXPIRED' using errcode = 'P0001';
  end if;

  select * into v_req
  from public.action_requests
  where id = v_binding.action_request_id
    and tenant_id = v_org
  for update;

  if v_req.id is null then
    raise exception 'CORE_APPROVAL_REQUIRED' using errcode = 'P0001';
  end if;

  if v_req.status = 'rejected' then
    raise exception 'CORE_APPROVAL_REJECTED' using errcode = 'P0001';
  end if;
  if v_req.status = 'cancelled' or v_req.status = 'canceled' then
    raise exception 'CORE_APPROVAL_CANCELLED' using errcode = 'P0001';
  end if;
  if v_req.status <> 'approved' then
    raise exception 'CORE_APPROVAL_REQUIRED' using errcode = 'P0001';
  end if;

  if v_binding.website_id is not null and v_website_id is not null and v_binding.website_id <> v_website_id then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;
  if v_binding.path is not null and v_path is not null and v_binding.path <> v_path then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;
  if v_tool = 'website_publish_approved_draft' then
    if v_binding.candidate_id is not null and v_candidate_id is not null and v_binding.candidate_id <> v_candidate_id then
      raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
    end if;
  end if;
  if v_tool = 'website_publish_rollback' then
    if v_binding.target_version_id is not null and v_target_id is not null and v_binding.target_version_id <> v_target_id then
      raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
    end if;
  end if;
  if v_binding.expected_current_version_id is not null
     and v_expected_id is not null
     and v_binding.expected_current_version_id <> v_expected_id then
    raise exception 'STALE_EXPECTED_VERSION' using errcode = 'P0001';
  end if;
  if v_binding.action_checksum is not null
     and v_checksum is not null
     and v_binding.action_checksum <> v_checksum then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'ok', true,
    'required', true,
    'binding_id', v_binding.id,
    'action_request_id', v_binding.action_request_id,
    'status', v_req.status,
    'expires_at', v_binding.expires_at
  );
end;
$$;

revoke all on function public.assert_kompis_operator_core_approval_ready(uuid, uuid, text, jsonb) from public, anon;
grant execute on function public.assert_kompis_operator_core_approval_ready(uuid, uuid, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Consume CORE approval (single-use)
-- ---------------------------------------------------------------------------
create or replace function public.consume_kompis_operator_core_approval(
  p_run_id uuid,
  p_step_id uuid,
  p_tool_key text,
  p_scope jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ready jsonb;
  v_binding_id uuid;
  v_action_id uuid;
  v_access jsonb;
  v_org uuid;
  v_email text;
begin
  v_ready := public.assert_kompis_operator_core_approval_ready(p_run_id, p_step_id, p_tool_key, p_scope);
  if coalesce((v_ready->>'required')::boolean, false) is not true then
    return v_ready;
  end if;

  v_access := public._kompis_operator_require_access();
  v_org := (v_access->>'organization_id')::uuid;
  v_binding_id := (v_ready->>'binding_id')::uuid;
  v_action_id := (v_ready->>'action_request_id')::uuid;

  update public.kompis_operator_core_approval_bindings
  set used_at = now(), updated_at = now()
  where id = v_binding_id
    and organization_id = v_org
    and used_at is null;

  if not found then
    raise exception 'CORE_APPROVAL_ALREADY_USED' using errcode = 'P0001';
  end if;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  perform public.log_action_audit(
    v_action_id,
    'executed',
    coalesce(v_email, 'system'),
    jsonb_build_object(
      'source', 'kompis_operator',
      'run_id', p_run_id,
      'step_id', p_step_id,
      'tool_key', p_tool_key,
      'binding_id', v_binding_id
    )
  );

  perform public.record_trust_audit_event(
    v_org,
    'kompis_operator_core_approval_consumed',
    'success',
    'kompis_operator',
    left(p_tool_key, 80),
    'operator',
    null,
    jsonb_build_object(
      'run_id', p_run_id,
      'step_id', p_step_id,
      'tool_key', p_tool_key,
      'action_request_id', v_action_id,
      'binding_id', v_binding_id
    )
  );

  return jsonb_build_object(
    'ok', true,
    'binding_id', v_binding_id,
    'action_request_id', v_action_id,
    'consumed', true
  );
end;
$$;

revoke all on function public.consume_kompis_operator_core_approval(uuid, uuid, text, jsonb) from public, anon;
grant execute on function public.consume_kompis_operator_core_approval(uuid, uuid, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Sync Kompis run when Approval Center decides (mirror, not authority)
-- ---------------------------------------------------------------------------
create or replace function public._kompis_sync_run_from_core_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_binding public.kompis_operator_core_approval_bindings;
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;
  if new.status is not distinct from old.status then
    return new;
  end if;
  if new.status not in ('approved', 'rejected') then
    return new;
  end if;

  select * into v_binding
  from public.kompis_operator_core_approval_bindings
  where action_request_id = new.id
  limit 1;
  if v_binding.id is null then
    return new;
  end if;

  if new.status = 'approved' then
    insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
    select
      v_binding.run_id,
      ou.user_id,
      coalesce(ou.role::text, 'administrator'),
      true,
      'Mirrored from Approval Center (CORE.APPROVAL).',
      'approved'
    from public.organization_users ou
    where ou.organization_id = v_binding.organization_id
      and ou.status = 'active'
      and ou.role in ('owner', 'administrator')
    order by case when ou.role = 'owner' then 0 else 1 end
    limit 1;

    -- Mirror only: do not unlock publish by local authority. Run may already be
    -- locally approved for draft/preview; CORE approval unlocks publish steps.
    update public.kompis_operator_runs
    set
      core_approval_request_id = new.id,
      updated_at = now()
    where id = v_binding.run_id
      and organization_id = v_binding.organization_id
      and approval_status <> 'rejected';
  elsif new.status = 'rejected' then
    insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
    select
      v_binding.run_id,
      ou.user_id,
      coalesce(ou.role::text, 'administrator'),
      false,
      'Rejected in Approval Center (CORE.APPROVAL).',
      'rejected'
    from public.organization_users ou
    where ou.organization_id = v_binding.organization_id
      and ou.status = 'active'
      and ou.role in ('owner', 'administrator')
    order by case when ou.role = 'owner' then 0 else 1 end
    limit 1;

    update public.kompis_operator_runs
    set
      approval_status = 'rejected',
      status = 'rejected',
      core_approval_request_id = new.id,
      updated_at = now()
    where id = v_binding.run_id
      and organization_id = v_binding.organization_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_kompis_sync_run_from_core_approval on public.action_requests;
create trigger trg_kompis_sync_run_from_core_approval
  after update of status on public.action_requests
  for each row
  execute function public._kompis_sync_run_from_core_approval();

-- ---------------------------------------------------------------------------
-- 8. Local approve cannot override CORE.APPROVAL for publish/rollback runs
-- ---------------------------------------------------------------------------
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
  v_needs_core boolean := false;
  v_step record;
  v_binding public.kompis_operator_core_approval_bindings;
  v_requested jsonb := '{}'::jsonb;
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

  select exists (
    select 1
    from public.kompis_operator_steps s
    where s.run_id = v_run.id
      and public._kompis_operator_tool_requires_core_approval(s.tool_key)
  ) into v_needs_core;

  -- Local approve may unlock draft/preview execution. Publish/rollback remain
  -- gated by assert/consume against Approval Center (CORE.APPROVAL).
  if v_needs_core or v_run.core_approval_required then
    for v_step in
      select *
      from public.kompis_operator_steps s
      where s.run_id = v_run.id
        and public._kompis_operator_tool_requires_core_approval(s.tool_key)
      order by s.sequence
    loop
      select * into v_binding
      from public.kompis_operator_core_approval_bindings b
      where b.organization_id = v_org
        and b.run_id = v_run.id
        and b.tool_key = v_step.tool_key
      order by b.created_at desc
      limit 1;

      if v_binding.id is null then
        v_requested := public.request_kompis_operator_core_approval(
          v_run.id,
          v_step.id,
          v_step.tool_key,
          coalesce(v_run.plan_json->'scope', '{}'::jsonb)
        );
      else
        v_requested := jsonb_build_object(
          'action_request_id', v_binding.action_request_id,
          'idempotent_replay', true
        );
      end if;
    end loop;
  end if;

  insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
  values (v_run.id, (v_access->>'user_id')::uuid, v_role, true, v_reason, 'approved');

  update public.kompis_operator_runs
  set approval_status = 'approved', status = 'planned', updated_at = now()
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org, 'kompis_operator_run_approved', 'success', 'kompis_operator', v_reason, 'operator', null,
    jsonb_build_object(
      'run_id', v_run.id,
      'role', v_role,
      'core_gated', v_needs_core,
      'core_approval_request_id', v_requested->>'action_request_id'
    )
  );

  return jsonb_build_object(
    'id', v_run.id,
    'approval_status', 'approved',
    'status', 'planned',
    'core_approval_required', v_needs_core or v_run.core_approval_required,
    'core_approval_request_id', v_requested->>'action_request_id',
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.approve_app_kompis_operator_run(uuid, boolean, text) from public, anon;
grant execute on function public.approve_app_kompis_operator_run(uuid, boolean, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Mark create_run when plan includes core-gated tools
-- ---------------------------------------------------------------------------
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
  v_plan jsonb := coalesce(p_plan, '{}'::jsonb);
  v_request text := left(btrim(coalesce(p_request_text, '')), 4000);
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_prior public.kompis_operator_runs;
  v_risk int;
  v_requires boolean;
  v_status text;
  v_approval text;
  v_run_id uuid;
  v_step jsonb;
  v_tool text;
  v_seq int;
  v_needs_core boolean := false;
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
    return jsonb_build_object(
      'id', v_prior.id,
      'idempotent_replay', true,
      'status', v_prior.status,
      'approval_status', v_prior.approval_status,
      'core_approval_required', v_prior.core_approval_required,
      'core_approval_request_id', v_prior.core_approval_request_id,
      'plan', v_prior.plan_json
    );
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
    if public._kompis_operator_tool_requires_core_approval(v_tool) then
      v_needs_core := true;
    end if;
  end loop;

  v_requires := coalesce((v_plan->>'requiresApproval')::boolean, v_risk >= 1) or v_needs_core;

  v_status := case when v_requires then 'awaiting_approval' else 'planned' end;
  v_approval := case when v_requires then 'pending' else 'not_required' end;

  insert into public.kompis_operator_runs (
    conversation_id, organization_id, requested_by, request_text, normalized_request,
    intent, user_summary, risk_class, requires_approval, status, approval_status,
    idempotency_key, plan_json, started_at, core_approval_required
  ) values (
    v_conv.id, v_org, v_user, v_request, lower(v_request),
    v_plan->>'intent', v_plan->>'userSummary', v_risk, v_requires, v_status, v_approval,
    v_key, v_plan, now(), v_needs_core
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
      coalesce(
        (v_step->>'requiresApproval')::boolean,
        v_requires or public._kompis_operator_tool_requires_core_approval(v_step->>'toolKey')
      ),
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
      'conversation_id', v_conv.id,
      'core_approval_required', v_needs_core
    )
  );

  return jsonb_build_object(
    'id', v_run_id,
    'idempotent_replay', false,
    'status', v_status,
    'approval_status', v_approval,
    'risk_class', v_risk,
    'requires_approval', v_requires,
    'core_approval_required', v_needs_core,
    'plan', v_plan
  );
end;
$$;

revoke all on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) from public, anon;
grant execute on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 10. begin_execution also blocks when CORE approval still pending
-- ---------------------------------------------------------------------------
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

  -- CORE.APPROVAL is enforced per publish/rollback step (assert/consume), not at
  -- begin — so draft/preview can run before Approval Center decides.

  update public.kompis_operator_runs
  set status = 'executing', updated_at = now(), started_at = coalesce(started_at, now())
  where id = v_run.id;

  return jsonb_build_object(
    'id', v_run.id,
    'status', 'executing',
    'already_finished', false,
    'core_approval_required', v_run.core_approval_required,
    'core_approval_request_id', v_run.core_approval_request_id,
    'plan', v_run.plan_json
  );
end;
$$;

revoke all on function public.begin_app_kompis_operator_run_execution(uuid, text) from public, anon;
grant execute on function public.begin_app_kompis_operator_run_execution(uuid, text) to authenticated;

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
  v_core_status text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;

  select ar.status into v_core_status
  from public.action_requests ar
  where ar.id = v_run.core_approval_request_id
    and ar.tenant_id = v_org;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id,
    'sequence', s.sequence,
    'tool_key', s.tool_key,
    'tool_version', s.tool_version,
    'risk_class', s.risk_class,
    'purpose', s.purpose,
    'requires_approval', s.requires_approval,
    'status', s.status,
    'result_summary', s.result_summary,
    'core_approval_request_id', s.core_approval_request_id
  ) order by s.sequence), '[]'::jsonb)
  into v_steps
  from public.kompis_operator_steps s where s.run_id = v_run.id;

  return jsonb_build_object(
    'id', v_run.id,
    'conversation_id', v_run.conversation_id,
    'status', v_run.status,
    'approval_status', v_run.approval_status,
    'core_approval_required', v_run.core_approval_required,
    'core_approval_request_id', v_run.core_approval_request_id,
    'core_approval_status', v_core_status,
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
