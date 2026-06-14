-- Phase 17 — Install Engine Foundation (heartbeat, discovery, human validation)

-- ---------------------------------------------------------------------------
-- 1. Expand token verification for current lifecycle statuses
-- ---------------------------------------------------------------------------
create or replace function public.verify_installation_token(p_token text)
returns table (
  installation_id uuid,
  company_id uuid,
  system_type text,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
begin
  if p_token is null or length(p_token) < 20 then
    return;
  end if;

  v_hash := public.hash_installation_token(p_token);

  return query
  select i.id, i.company_id, i.system_type, i.status
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.status in (
      'draft',
      'pending_verification',
      'ready',
      'installing',
      'active',
      'warning'
    )
    and i.revoked_at is null;
end;
$$;

revoke execute on function public.verify_installation_token(text) from public, authenticated;
grant execute on function public.verify_installation_token(text) to anon;

-- ---------------------------------------------------------------------------
-- 2. Embedded heartbeat
-- ---------------------------------------------------------------------------
create or replace function public.record_installation_heartbeat(
  p_token text,
  p_status text,
  p_details jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_installation public.installations;
  v_mapped_status text;
begin
  if p_token is null or length(p_token) < 20 then
    raise exception 'Invalid installation token';
  end if;

  if p_status not in ('healthy', 'warning', 'disconnected', 'pending_update', 'paused') then
    raise exception 'Invalid heartbeat status';
  end if;

  v_hash := public.hash_installation_token(p_token);

  select * into v_installation
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.revoked_at is null
  limit 1;

  if v_installation.id is null then
    raise exception 'Installation not found';
  end if;

  v_mapped_status := case
    when p_status = 'healthy' then 'active'
    when p_status in ('warning', 'pending_update') then 'warning'
    when p_status in ('disconnected', 'paused') then 'suspended'
  end;

  update public.installations
  set
    last_seen_at = now(),
    status = case
      when v_installation.status = 'archived' then v_installation.status
      else v_mapped_status
    end,
    health_status = case
      when p_status = 'healthy' then 'healthy'
      when p_status in ('warning', 'pending_update') then 'needs_attention'
      else 'critical'
    end,
    provisioning_config = coalesce(provisioning_config, '{}'::jsonb) || jsonb_build_object(
      'heartbeat',
      jsonb_build_object(
        'status', p_status,
        'reported_at', now(),
        'details', coalesce(p_details, '{}'::jsonb)
      )
    ),
    updated_at = now()
  where id = v_installation.id;

  return jsonb_build_object(
    'installation_id', v_installation.id,
    'heartbeat_status', p_status,
    'last_seen_at', now()
  );
end;
$$;

revoke execute on function public.record_installation_heartbeat(text, text, jsonb) from public;
grant execute on function public.record_installation_heartbeat(text, text, jsonb) to anon;

-- ---------------------------------------------------------------------------
-- 3. Environment discovery snapshot
-- ---------------------------------------------------------------------------
create or replace function public.save_installation_discovery(
  p_installation_id uuid,
  p_discovery jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_installation public.installations;
begin
  select * into v_installation
  from public.installations i
  where i.id = p_installation_id
    and i.revoked_at is null;

  if v_installation.id is null then
    raise exception 'Installation not found';
  end if;

  update public.installations
  set
    provisioning_config = coalesce(provisioning_config, '{}'::jsonb) || jsonb_build_object(
      'discovery',
      p_discovery,
      'discovery_saved_at', now()
    ),
    updated_at = now()
  where id = p_installation_id;

  return jsonb_build_object('installation_id', p_installation_id, 'saved', true);
end;
$$;

revoke execute on function public.save_installation_discovery(uuid, jsonb) from public, anon;
grant execute on function public.save_installation_discovery(uuid, jsonb) to anon;

-- ---------------------------------------------------------------------------
-- 4. Human validation (approve / modify / reject)
-- ---------------------------------------------------------------------------
create or replace function public.validate_installation_discovery(
  p_installation_id uuid,
  p_action text,
  p_overrides jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_installation public.installations;
  v_learning_started timestamptz;
begin
  if p_action not in ('approve', 'modify', 'reject') then
    raise exception 'Invalid validation action';
  end if;

  select i.*
  into v_installation
  from public.installations i
  join public.customers c on c.company_id = i.company_id
  join public.company_users cu on cu.company_id = c.company_id
  where i.id = p_installation_id
    and cu.auth_user_id = auth.uid()
  limit 1;

  if v_installation.id is null then
    raise exception 'Installation not found or access denied';
  end if;

  v_learning_started := case
    when p_action in ('approve', 'modify') then now()
    else null
  end;

  update public.installations
  set
    provisioning_config = coalesce(provisioning_config, '{}'::jsonb) || jsonb_build_object(
      'validation',
      jsonb_build_object(
        'action', p_action,
        'overrides', coalesce(p_overrides, '{}'::jsonb),
        'validated_at', now()
      ),
      'learning_phase_started_at', v_learning_started
    ),
    updated_at = now()
  where id = p_installation_id;

  if v_installation.customer_id is not null and p_action in ('approve', 'modify') then
    perform public.refresh_customer_onboarding(v_installation.customer_id);
  end if;

  return jsonb_build_object(
    'installation_id', p_installation_id,
    'action', p_action,
    'learning_phase_started_at', v_learning_started
  );
end;
$$;

grant execute on function public.validate_installation_discovery(uuid, text, jsonb) to authenticated;
