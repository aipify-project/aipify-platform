-- AIPIFY.KOMPIS.WEBSITE.APPROVAL.FAIL.CLOSED.LIVE.V1
-- Fail-closed publish/rollback CORE approval scope. Apply-side effects = 0
-- (function/constraint DDL only; cleanup is a separate authenticated RPC call).

-- ---------------------------------------------------------------------------
-- 1. Columns for locale + idempotency on bindings
-- ---------------------------------------------------------------------------
alter table public.kompis_operator_core_approval_bindings
  add column if not exists locale text;

alter table public.kompis_operator_core_approval_bindings
  add column if not exists idempotency_key text;

alter table public.kompis_operator_core_approval_bindings
  add column if not exists cancelled_at timestamptz;

alter table public.kompis_operator_core_approval_bindings
  add column if not exists cancel_reason text;

create unique index if not exists idx_kompis_core_approval_idempotency
  on public.kompis_operator_core_approval_bindings (organization_id, idempotency_key)
  where idempotency_key is not null and cancelled_at is null;

-- Reject incomplete publish/rollback bindings on insert/update (fail-closed).
-- Historical incomplete rows remain until audited cleanup RPC cancels them.
create or replace function public._kompis_core_approval_binding_scope_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if NEW.cancelled_at is not null then
    return NEW;
  end if;

  if NEW.tool_key = 'website_publish_approved_draft' then
    if NEW.website_id is null
       or NEW.path is null
       or NEW.candidate_id is null
       or NEW.expected_current_version_id is null
       or NEW.locale is null
       or NEW.action_checksum is null
       or NEW.idempotency_key is null
       or coalesce(NEW.scope_json, '{}'::jsonb) = '{}'::jsonb then
      raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
    end if;
  end if;

  if NEW.tool_key = 'website_publish_rollback' then
    if NEW.website_id is null
       or NEW.path is null
       or NEW.target_version_id is null
       or NEW.expected_current_version_id is null
       or NEW.action_checksum is null
       or NEW.idempotency_key is null
       or coalesce(NEW.scope_json, '{}'::jsonb) = '{}'::jsonb then
      raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_kompis_core_approval_binding_scope_guard
  on public.kompis_operator_core_approval_bindings;
create trigger trg_kompis_core_approval_binding_scope_guard
  before insert or update on public.kompis_operator_core_approval_bindings
  for each row
  execute function public._kompis_core_approval_binding_scope_guard();

revoke all on function public._kompis_core_approval_binding_scope_guard() from public, anon;

-- ---------------------------------------------------------------------------
-- 2. Canonical checksum + scope validators
-- ---------------------------------------------------------------------------
create or replace function public._kompis_website_approval_action_checksum(
  p_organization_id uuid,
  p_run_id uuid,
  p_step_id uuid,
  p_tool_key text,
  p_website_id uuid,
  p_path text,
  p_candidate_or_target uuid,
  p_expected_current_version_id uuid,
  p_locale text,
  p_reason text
)
returns text
language sql
immutable
set search_path = public
as $$
  select encode(
    extensions.digest(
      convert_to(
        coalesce(p_organization_id::text, '') || '|' ||
        coalesce(p_run_id::text, '') || '|' ||
        coalesce(p_step_id::text, '') || '|' ||
        coalesce(lower(btrim(p_tool_key)), '') || '|' ||
        coalesce(p_website_id::text, '') || '|' ||
        coalesce(p_path, '') || '|' ||
        coalesce(p_candidate_or_target::text, '') || '|' ||
        coalesce(p_expected_current_version_id::text, '') || '|' ||
        coalesce(p_locale, '') || '|' ||
        coalesce(p_reason, ''),
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );
$$;

revoke all on function public._kompis_website_approval_action_checksum(uuid, uuid, uuid, text, uuid, text, uuid, uuid, text, text)
  from public, anon;
grant execute on function public._kompis_website_approval_action_checksum(uuid, uuid, uuid, text, uuid, text, uuid, uuid, text, text)
  to authenticated, service_role;

create or replace function public._kompis_normalize_website_path(p_path text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  v_path text := nullif(btrim(coalesce(p_path, '')), '');
begin
  if v_path is null then
    return null;
  end if;
  if left(v_path, 1) <> '/' then
    return null;
  end if;
  if v_path ~* '(://|\.\.|<)' then
    return null;
  end if;
  if char_length(v_path) > 200 then
    return null;
  end if;
  if v_path = '/' then
    return null;
  end if;
  return regexp_replace(v_path, '/{2,}', '/', 'g');
end;
$$;

revoke all on function public._kompis_normalize_website_path(text) from public, anon;
grant execute on function public._kompis_normalize_website_path(text) to authenticated, service_role;

create or replace function public._kompis_assert_publish_approval_scope(p_scope jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  v_scope jsonb := coalesce(p_scope, '{}'::jsonb);
  v_website uuid;
  v_path text;
  v_candidate uuid;
  v_expected uuid;
  v_locale text;
  v_reason text;
  v_checksum text;
  v_idem text;
begin
  begin
    v_website := nullif(v_scope->>'website_id', '')::uuid;
  exception when others then
    v_website := null;
  end;
  v_path := public._kompis_normalize_website_path(v_scope->>'path');
  begin
    v_candidate := nullif(v_scope->>'candidate_id', '')::uuid;
  exception when others then
    v_candidate := null;
  end;
  begin
    v_expected := nullif(v_scope->>'expected_current_version_id', '')::uuid;
  exception when others then
    v_expected := null;
  end;
  v_locale := left(nullif(btrim(coalesce(v_scope->>'locale', '')), ''), 16);
  v_reason := left(nullif(btrim(coalesce(
    v_scope->>'reason',
    coalesce(v_scope->>'internal_reason', v_scope->>'internalReason')
  )), ''), 500);
  v_checksum := nullif(btrim(coalesce(v_scope->>'action_checksum', '')), '');
  v_idem := nullif(btrim(coalesce(v_scope->>'idempotency_key', '')), '');

  if v_website is null
     or v_path is null
     or v_candidate is null
     or v_expected is null
     or v_locale is null
     or v_reason is null
     or v_checksum is null
     or v_idem is null then
    raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'website_id', v_website,
    'path', v_path,
    'candidate_id', v_candidate,
    'expected_current_version_id', v_expected,
    'locale', v_locale,
    'reason', v_reason,
    'action_checksum', v_checksum,
    'idempotency_key', v_idem
  );
end;
$$;

revoke all on function public._kompis_assert_publish_approval_scope(jsonb) from public, anon;
grant execute on function public._kompis_assert_publish_approval_scope(jsonb) to authenticated, service_role;

create or replace function public._kompis_assert_rollback_approval_scope(p_scope jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  v_scope jsonb := coalesce(p_scope, '{}'::jsonb);
  v_website uuid;
  v_path text;
  v_target uuid;
  v_expected uuid;
  v_locale text;
  v_reason text;
  v_checksum text;
  v_idem text;
begin
  begin
    v_website := nullif(v_scope->>'website_id', '')::uuid;
  exception when others then
    v_website := null;
  end;
  v_path := public._kompis_normalize_website_path(v_scope->>'path');
  begin
    v_target := nullif(v_scope->>'target_version_id', '')::uuid;
  exception when others then
    v_target := null;
  end;
  begin
    v_expected := nullif(v_scope->>'expected_current_version_id', '')::uuid;
  exception when others then
    v_expected := null;
  end;
  v_locale := left(nullif(btrim(coalesce(v_scope->>'locale', '')), ''), 16);
  v_reason := left(nullif(btrim(coalesce(
    v_scope->>'reason',
    coalesce(v_scope->>'internal_reason', v_scope->>'internalReason')
  )), ''), 500);
  v_checksum := nullif(btrim(coalesce(v_scope->>'action_checksum', '')), '');
  v_idem := nullif(btrim(coalesce(v_scope->>'idempotency_key', '')), '');

  if v_website is null
     or v_path is null
     or v_target is null
     or v_expected is null
     or v_reason is null
     or v_checksum is null
     or v_idem is null then
    raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'website_id', v_website,
    'path', v_path,
    'target_version_id', v_target,
    'expected_current_version_id', v_expected,
    'locale', v_locale,
    'reason', v_reason,
    'action_checksum', v_checksum,
    'idempotency_key', v_idem
  );
end;
$$;

revoke all on function public._kompis_assert_rollback_approval_scope(jsonb) from public, anon;
grant execute on function public._kompis_assert_rollback_approval_scope(jsonb) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. Fail-closed request_kompis_operator_core_approval
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
  v_validated jsonb;
  v_existing public.kompis_operator_core_approval_bindings;
  v_action_id uuid;
  v_email text;
  v_desc text;
  v_path text;
  v_website_id uuid;
  v_candidate_id uuid;
  v_target_id uuid;
  v_expected_id uuid;
  v_locale text;
  v_checksum text;
  v_idem text;
  v_reason text;
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

  if v_tool = 'website_publish_approved_draft' then
    v_validated := public._kompis_assert_publish_approval_scope(v_scope);
    v_website_id := (v_validated->>'website_id')::uuid;
    v_path := v_validated->>'path';
    v_candidate_id := (v_validated->>'candidate_id')::uuid;
    v_expected_id := (v_validated->>'expected_current_version_id')::uuid;
    v_locale := v_validated->>'locale';
    v_reason := v_validated->>'reason';
    v_checksum := v_validated->>'action_checksum';
    v_idem := v_validated->>'idempotency_key';
  else
    v_validated := public._kompis_assert_rollback_approval_scope(v_scope);
    v_website_id := (v_validated->>'website_id')::uuid;
    v_path := v_validated->>'path';
    v_target_id := (v_validated->>'target_version_id')::uuid;
    v_expected_id := (v_validated->>'expected_current_version_id')::uuid;
    v_locale := nullif(v_validated->>'locale', '');
    v_reason := v_validated->>'reason';
    v_checksum := v_validated->>'action_checksum';
    v_idem := v_validated->>'idempotency_key';
  end if;

  -- Tenant + website ownership
  if not exists (
    select 1 from public.customer_websites w
    where w.id = v_website_id and w.organization_id = v_org
  ) then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;

  if v_tool = 'website_publish_approved_draft' then
    if not exists (
      select 1 from public.customer_website_versions v
      where v.id = v_candidate_id
        and v.website_id = v_website_id
        and v.organization_id = v_org
        and v.status in ('candidate', 'preview_verified', 'built')
    ) then
      -- allow candidate or published-history statuses used by CMS
      if not exists (
        select 1 from public.customer_website_versions v
        where v.id = v_candidate_id
          and v.website_id = v_website_id
          and v.organization_id = v_org
      ) then
        raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
      end if;
    end if;
  end if;

  select * into v_existing
  from public.kompis_operator_core_approval_bindings
  where organization_id = v_org
    and idempotency_key = v_idem
    and cancelled_at is null
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

  select * into v_existing
  from public.kompis_operator_core_approval_bindings
  where organization_id = v_org
    and run_id = v_run.id
    and tool_key = v_tool
    and coalesce(step_id, '00000000-0000-0000-0000-000000000000'::uuid)
        = coalesce(p_step_id, '00000000-0000-0000-0000-000000000000'::uuid)
    and cancelled_at is null
  limit 1;

  if v_existing.id is not null then
    if v_existing.action_checksum is distinct from v_checksum then
      raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
    end if;
    return jsonb_build_object(
      'id', v_existing.id,
      'action_request_id', v_existing.action_request_id,
      'tool_key', v_existing.tool_key,
      'idempotent_replay', true,
      'expires_at', v_existing.expires_at,
      'used_at', v_existing.used_at
    );
  end if;

  v_desc := case
    when v_tool = 'website_publish_approved_draft' then
      'Kompis requests publish of a website draft candidate for path ' || left(v_path, 120) || '.'
    else
      'Kompis requests rollback of a published website version for path ' || left(v_path, 120) || '.'
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
    left(coalesce(v_reason, v_desc), 500),
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
        'locale', v_locale,
        'candidate_id', v_candidate_id,
        'target_version_id', v_target_id,
        'expected_current_version_id', v_expected_id,
        'action_checksum', v_checksum,
        'idempotency_key', v_idem,
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
      'tool_key', v_tool,
      'action_checksum', v_checksum
    )
  );

  insert into public.kompis_operator_core_approval_bindings (
    organization_id, run_id, step_id, tool_key, action_request_id,
    website_id, path, candidate_id, target_version_id, expected_current_version_id,
    locale, action_checksum, idempotency_key, scope_json, expires_at
  ) values (
    v_org, v_run.id, p_step_id, v_tool, v_action_id,
    v_website_id, v_path, v_candidate_id, v_target_id, v_expected_id,
    v_locale, v_checksum, v_idem, v_validated || jsonb_build_object('tool_key', v_tool), v_expires
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
      'binding_id', v_existing.id,
      'action_checksum', v_checksum
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


-- ---------------------------------------------------------------------------
-- 4. Fail-closed assert (no nullable wildcard bypass)
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
  v_validated jsonb;
  v_binding public.kompis_operator_core_approval_bindings;
  v_req public.action_requests%rowtype;
  v_path text;
  v_website_id uuid;
  v_candidate_id uuid;
  v_target_id uuid;
  v_expected_id uuid;
  v_locale text;
  v_checksum text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;

  if not public._kompis_operator_tool_requires_core_approval(v_tool) then
    return jsonb_build_object('ok', true, 'required', false);
  end if;

  if v_tool = 'website_publish_approved_draft' then
    v_validated := public._kompis_assert_publish_approval_scope(v_scope);
    v_website_id := (v_validated->>'website_id')::uuid;
    v_path := v_validated->>'path';
    v_candidate_id := (v_validated->>'candidate_id')::uuid;
    v_expected_id := (v_validated->>'expected_current_version_id')::uuid;
    v_locale := v_validated->>'locale';
    v_checksum := v_validated->>'action_checksum';
  else
    v_validated := public._kompis_assert_rollback_approval_scope(v_scope);
    v_website_id := (v_validated->>'website_id')::uuid;
    v_path := v_validated->>'path';
    v_target_id := (v_validated->>'target_version_id')::uuid;
    v_expected_id := (v_validated->>'expected_current_version_id')::uuid;
    v_locale := nullif(v_validated->>'locale', '');
    v_checksum := v_validated->>'action_checksum';
  end if;

  select * into v_binding
  from public.kompis_operator_core_approval_bindings
  where organization_id = v_org
    and run_id = p_run_id
    and tool_key = v_tool
    and cancelled_at is null
    and (p_step_id is null or step_id = p_step_id)
  order by created_at desc
  limit 1
  for update;

  if v_binding.id is null then
    raise exception 'CORE_APPROVAL_REQUIRED' using errcode = 'P0001';
  end if;

  -- Binding must already be complete; execute input cannot fill gaps.
  if v_tool = 'website_publish_approved_draft' then
    if v_binding.website_id is null
       or v_binding.path is null
       or v_binding.candidate_id is null
       or v_binding.expected_current_version_id is null
       or v_binding.locale is null
       or v_binding.action_checksum is null then
      raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
    end if;
  else
    if v_binding.website_id is null
       or v_binding.path is null
       or v_binding.target_version_id is null
       or v_binding.expected_current_version_id is null
       or v_binding.action_checksum is null then
      raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
    end if;
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

  -- Exact equality (fail closed — no null bypass)
  if v_binding.organization_id <> v_org then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;
  if v_binding.website_id is distinct from v_website_id then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;
  if v_binding.path is distinct from v_path then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;
  if v_tool = 'website_publish_approved_draft' then
    if v_binding.candidate_id is distinct from v_candidate_id then
      raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
    end if;
    if v_binding.locale is distinct from v_locale then
      raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
    end if;
  else
    if v_binding.target_version_id is distinct from v_target_id then
      raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
    end if;
  end if;
  if v_binding.expected_current_version_id is distinct from v_expected_id then
    raise exception 'STALE_EXPECTED_VERSION' using errcode = 'P0001';
  end if;
  if v_binding.action_checksum is distinct from v_checksum then
    raise exception 'SCOPE_MISMATCH' using errcode = 'P0001';
  end if;
  if p_step_id is not null and v_binding.step_id is not null and v_binding.step_id is distinct from p_step_id then
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
-- 5. create_app_kompis_operator_run — merge step scope; fail closed on incomplete
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
  v_step_id uuid;
  v_core_request_id uuid;
  v_requested jsonb;
  v_scope jsonb;
  v_step_scope jsonb;
  v_err text;
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

  if v_needs_core then
    v_status := 'planned';
    v_approval := 'pending';
  elsif v_requires then
    v_status := 'awaiting_approval';
    v_approval := 'pending';
  else
    v_status := 'planned';
    v_approval := 'not_required';
  end if;

  insert into public.kompis_operator_runs (
    conversation_id, organization_id, requested_by, request_text, normalized_request,
    intent, user_summary, risk_class, requires_approval, status, approval_status,
    idempotency_key, plan_json, started_at, core_approval_required
  ) values (
    v_conv.id, v_org, v_user, v_request, lower(v_request),
    v_plan->>'intent', v_plan->>'userSummary', v_risk, v_requires, v_status, v_approval,
    v_key, v_plan, now(), v_needs_core
  ) returning id into v_run_id;

  v_scope := coalesce(v_plan->'scope', '{}'::jsonb);

  for v_step in select * from jsonb_array_elements(v_plan->'steps')
  loop
    v_seq := coalesce((v_step->>'sequence')::int, 0);
    v_tool := v_step->>'toolKey';
    insert into public.kompis_operator_steps (
      run_id, sequence, tool_key, tool_version, risk_class, purpose, requires_approval, status
    ) values (
      v_run_id,
      v_seq,
      v_tool,
      coalesce(v_step->>'toolVersion', '1'),
      coalesce((v_step->>'riskClass')::int, v_risk),
      coalesce(v_step->>'purpose', ''),
      coalesce(
        (v_step->>'requiresApproval')::boolean,
        v_requires or public._kompis_operator_tool_requires_core_approval(v_tool)
      ),
      'pending'
    ) returning id into v_step_id;

    if public._kompis_operator_tool_requires_core_approval(v_tool) then
      v_step_scope := v_scope || coalesce(v_step->'safeInput', '{}'::jsonb);
      begin
        v_requested := public.request_kompis_operator_core_approval(
          v_run_id,
          v_step_id,
          v_tool,
          v_step_scope
        );
      exception
        when others then
          get stacked diagnostics v_err = message_text;
          if v_err like '%APPROVAL_SCOPE_INCOMPLETE%' then
            raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
          end if;
          raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
      end;

      v_core_request_id := nullif(v_requested->>'action_request_id', '')::uuid;
      if v_core_request_id is null then
        raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
      end if;
    end if;
  end loop;

  if v_needs_core then
    if v_core_request_id is null then
      raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
    end if;
    update public.kompis_operator_runs
    set
      status = 'awaiting_approval',
      approval_status = 'pending',
      core_approval_required = true,
      core_approval_request_id = v_core_request_id,
      requires_approval = true,
      updated_at = now()
    where id = v_run_id;
    v_status := 'awaiting_approval';
    v_approval := 'pending';
  end if;

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
      'core_approval_required', v_needs_core,
      'core_approval_request_id', v_core_request_id
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
    'core_approval_request_id', v_core_request_id,
    'plan', v_plan
  );
end;
$$;

revoke all on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) from public, anon;
grant execute on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) to authenticated;


-- ---------------------------------------------------------------------------
-- 6. Prepare publish approval after draft/preview (authoritative scope fill)
-- ---------------------------------------------------------------------------
create or replace function public.prepare_kompis_website_publish_approval_from_run(
  p_run_id uuid,
  p_reason text default null
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
  v_website public.customer_websites;
  v_draft public.kompis_operator_drafts;
  v_candidate jsonb;
  v_step_id uuid;
  v_path text;
  v_locale text;
  v_reason text;
  v_checksum text;
  v_idem text;
  v_scope jsonb;
  v_requested jsonb;
  v_candidate_id uuid;
  v_key text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;

  select * into v_run
  from public.kompis_operator_runs
  where id = p_run_id and organization_id = v_org
  for update;
  if v_run.id is null then
    raise exception 'RUN_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_run.core_approval_request_id is not null then
    return jsonb_build_object(
      'ok', true,
      'idempotent_replay', true,
      'action_request_id', v_run.core_approval_request_id,
      'status', v_run.status
    );
  end if;

  select * into v_website
  from public.customer_websites
  where organization_id = v_org
  limit 1;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  select * into v_draft
  from public.kompis_operator_drafts
  where organization_id = v_org
    and run_id = v_run.id
    and draft_kind = 'website_page'
  order by created_at desc
  limit 1;
  if v_draft.id is null then
    raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
  end if;

  v_path := public._kompis_normalize_website_path(coalesce(v_draft.body->>'path', v_run.plan_json#>>'{scope,path}'));
  v_locale := left(nullif(btrim(coalesce(v_draft.locale, v_run.plan_json#>>'{scope,locale}', 'no')), ''), 16);
  if v_path is null or v_locale is null then
    raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
  end if;

  v_reason := left(nullif(btrim(coalesce(
    p_reason,
    'Prepare publish approval for verified website draft candidate.'
  )), ''), 500);

  v_key := 'kor-prep-' || replace(v_run.id::text, '-', '') || '-' || replace(v_draft.id::text, '-', '');
  v_key := left(v_key, 128);

  v_candidate := public.build_customer_website_candidate_from_drafts(
    array[v_draft.id],
    array[v_locale],
    jsonb_build_object(v_draft.id::text, v_draft.version),
    v_reason,
    v_key
  );
  v_candidate_id := nullif(v_candidate->>'id', '')::uuid;
  if v_candidate_id is null then
    raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
  end if;

  if v_website.current_version_id is null then
    raise exception 'APPROVAL_SCOPE_INCOMPLETE' using errcode = 'P0001';
  end if;

  insert into public.kompis_operator_steps (
    run_id, sequence, tool_key, tool_version, risk_class, purpose, requires_approval, status
  )
  select
    v_run.id,
    coalesce((select max(sequence) from public.kompis_operator_steps where run_id = v_run.id), 0) + 1,
    'website_publish_approved_draft',
    '1',
    2,
    'Publish approved website draft via the Website CMS candidate/publish pipeline',
    true,
    'pending'
  where not exists (
    select 1 from public.kompis_operator_steps
    where run_id = v_run.id and tool_key = 'website_publish_approved_draft'
  )
  returning id into v_step_id;

  if v_step_id is null then
    select id into v_step_id
    from public.kompis_operator_steps
    where run_id = v_run.id and tool_key = 'website_publish_approved_draft'
    order by sequence desc
    limit 1;
  end if;

  v_checksum := public._kompis_website_approval_action_checksum(
    v_org,
    v_run.id,
    v_step_id,
    'website_publish_approved_draft',
    v_website.id,
    v_path,
    v_candidate_id,
    v_website.current_version_id,
    v_locale,
    v_reason
  );
  v_idem := 'kompis-core-approval:' || v_checksum;

  v_scope := jsonb_build_object(
    'website_id', v_website.id,
    'path', v_path,
    'candidate_id', v_candidate_id,
    'expected_current_version_id', v_website.current_version_id,
    'locale', v_locale,
    'reason', v_reason,
    'action_checksum', v_checksum,
    'idempotency_key', v_idem,
    'confirmation', true,
    'draft_id', v_draft.id
  );

  v_requested := public.request_kompis_operator_core_approval(
    v_run.id,
    v_step_id,
    'website_publish_approved_draft',
    v_scope
  );

  update public.kompis_operator_runs
  set
    status = 'awaiting_approval',
    approval_status = 'pending',
    core_approval_required = true,
    core_approval_request_id = nullif(v_requested->>'action_request_id', '')::uuid,
    requires_approval = true,
    plan_json = coalesce(plan_json, '{}'::jsonb) || jsonb_build_object(
      'preparedPublishScope', v_scope,
      'preparePublishAfterPreview', true
    ),
    updated_at = now()
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org,
    'kompis_website_publish_approval_prepared',
    'success',
    'kompis_operator',
    left(v_reason, 200),
    'operator',
    null,
    jsonb_build_object(
      'run_id', v_run.id,
      'step_id', v_step_id,
      'candidate_id', v_candidate_id,
      'action_request_id', v_requested->>'action_request_id',
      'path', v_path,
      'locale', v_locale
    )
  );

  return jsonb_build_object(
    'ok', true,
    'action_request_id', v_requested->>'action_request_id',
    'candidate_id', v_candidate_id,
    'path', v_path,
    'locale', v_locale,
    'expected_current_version_id', v_website.current_version_id,
    'scope', v_scope
  );
end;
$$;

revoke all on function public.prepare_kompis_website_publish_approval_from_run(uuid, text) from public, anon;
grant execute on function public.prepare_kompis_website_publish_approval_from_run(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Audited cleanup of incomplete / false-pending website approvals
-- ---------------------------------------------------------------------------
create or replace function public.cancel_incomplete_kompis_website_approval(
  p_action_request_id uuid,
  p_reason text default 'Approval scope was incomplete and unsafe for execution.'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_req public.action_requests%rowtype;
  v_binding public.kompis_operator_core_approval_bindings;
  v_reason text := left(nullif(btrim(coalesce(p_reason, '')), ''), 500);
  v_email text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  if v_reason is null then
    v_reason := 'Approval scope was incomplete and unsafe for execution.';
  end if;

  select * into v_req
  from public.action_requests
  where id = p_action_request_id and tenant_id = v_org
  for update;
  if v_req.id is null then
    raise exception 'NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_binding
  from public.kompis_operator_core_approval_bindings
  where action_request_id = v_req.id and organization_id = v_org
  for update;

  -- Only cancel incomplete publish scopes or already-cancelled bindings' pending requests.
  if v_binding.id is not null
     and v_binding.tool_key = 'website_publish_approved_draft'
     and v_binding.cancelled_at is null
     and (
       v_binding.website_id is null
       or v_binding.path is null
       or v_binding.candidate_id is null
       or v_binding.expected_current_version_id is null
       or v_binding.action_checksum is null
       or coalesce(v_binding.scope_json, '{}'::jsonb) = '{}'::jsonb
     ) then
    update public.kompis_operator_core_approval_bindings
    set
      cancelled_at = now(),
      cancel_reason = v_reason,
      updated_at = now()
    where id = v_binding.id;
  elsif v_binding.id is null then
    -- allow cancelling orphan pending website publish requests without binding fields
    null;
  else
    raise exception 'CLEANUP_NOT_ELIGIBLE' using errcode = 'P0001';
  end if;

  if v_req.status = 'pending' then
    update public.action_requests
    set status = 'cancelled', updated_at = now()
    where id = v_req.id;
  end if;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  perform public.log_action_audit(
    v_req.id,
    'cancelled',
    coalesce(v_email, 'system'),
    jsonb_build_object('reason', v_reason, 'source', 'kompis_fail_closed_cleanup')
  );

  update public.kompis_operator_runs
  set
    status = 'failed',
    approval_status = 'cancelled',
    safe_error_code = 'approval_scope_incomplete',
    result_summary = v_reason,
    updated_at = now()
  where organization_id = v_org
    and core_approval_request_id = v_req.id
    and status in ('awaiting_approval', 'planned');

  perform public.record_trust_audit_event(
    v_org,
    'kompis_incomplete_website_approval_cancelled',
    'success',
    'kompis_operator',
    left(v_reason, 200),
    'operator',
    null,
    jsonb_build_object(
      'action_request_id', v_req.id,
      'binding_id', v_binding.id,
      'reason', v_reason
    )
  );

  return jsonb_build_object(
    'ok', true,
    'action_request_id', v_req.id,
    'status', 'cancelled',
    'binding_cancelled', v_binding.id is not null
  );
end;
$$;

revoke all on function public.cancel_incomplete_kompis_website_approval(uuid, text) from public, anon;
grant execute on function public.cancel_incomplete_kompis_website_approval(uuid, text) to authenticated;

create or replace function public.cancel_false_pending_kompis_operator_run(
  p_run_id uuid,
  p_reason text default 'Run was awaiting approval without a valid CORE approval.'
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
  v_reason text := left(nullif(btrim(coalesce(p_reason, '')), ''), 500);
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  if v_reason is null then
    v_reason := 'Run was awaiting approval without a valid CORE approval.';
  end if;

  select * into v_run
  from public.kompis_operator_runs
  where id = p_run_id and organization_id = v_org
  for update;
  if v_run.id is null then
    raise exception 'RUN_NOT_FOUND' using errcode = 'P0001';
  end if;

  -- Only false awaiting states without CORE approval id
  if v_run.status <> 'awaiting_approval' or v_run.core_approval_request_id is not null then
    raise exception 'CLEANUP_NOT_ELIGIBLE' using errcode = 'P0001';
  end if;

  update public.kompis_operator_runs
  set
    status = 'cancelled',
    approval_status = 'cancelled',
    safe_error_code = 'false_pending_without_core_approval',
    result_summary = v_reason,
    updated_at = now()
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org,
    'kompis_false_pending_run_cancelled',
    'success',
    'kompis_operator',
    left(v_reason, 200),
    'operator',
    null,
    jsonb_build_object('run_id', v_run.id, 'reason', v_reason)
  );

  return jsonb_build_object('ok', true, 'run_id', v_run.id, 'status', 'cancelled');
end;
$$;

revoke all on function public.cancel_false_pending_kompis_operator_run(uuid, text) from public, anon;
grant execute on function public.cancel_false_pending_kompis_operator_run(uuid, text) to authenticated;

