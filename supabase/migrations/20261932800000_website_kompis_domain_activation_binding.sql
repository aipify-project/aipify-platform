-- WEBSITE.KOMPIS.V2.06 — Domain activation binding for Website Kompis
-- Builds on: 20261932700000_website_kompis_install_config_storage.sql
-- Feature owner: Customer App (APP) · Core resolves trusted install/domain binding

-- ---------------------------------------------------------------------------
-- 1. Verified domain access helper (customer_domains + installation link)
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_assert_verified_domain_access(p_domain_id uuid)
returns table (
  tenant_id uuid,
  domain text,
  install_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_row public.customer_domains;
  v_install_id uuid;
  v_domain text;
begin
  if p_domain_id is null then
    raise exception 'Domain id required';
  end if;

  v_tenant_id := public._wpkf_require_owner_admin();

  select *
  into v_row
  from public.customer_domains cd
  where cd.id = p_domain_id
    and cd.customer_id = v_tenant_id
    and cd.status <> 'removed'
  limit 1;

  if v_row.id is null then
    raise exception 'Domain not found or access denied';
  end if;

  if v_row.verification_status <> 'verified' then
    raise exception 'Domain must be verified before Website Kompis activation';
  end if;

  if v_row.status <> 'active' then
    raise exception 'Domain must be active before Website Kompis activation';
  end if;

  v_domain := v_row.domain;
  v_install_id := v_row.installation_id;

  if v_install_id is null then
    select i.id
    into v_install_id
    from public.installations i
    where i.revoked_at is null
      and i.status in ('ready', 'installing', 'active', 'warning')
      and (
        i.customer_id = v_tenant_id
        or exists (
          select 1
          from public.customers c
          where c.id = v_tenant_id
            and c.company_id = i.company_id
        )
      )
      and public.normalize_domain(i.site_url) = v_domain
    limit 1;
  end if;

  if v_install_id is null then
    raise exception 'No installation linked to verified domain';
  end if;

  tenant_id := v_tenant_id;
  domain := v_domain;
  install_id := v_install_id;
  return next;
end;
$$;

create or replace function public._wpkf_public_embed_payload(
  p_install_id uuid,
  p_domain text,
  p_enabled boolean,
  p_status text,
  p_normalized jsonb
)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select jsonb_build_object(
    'ok', true,
    'install_id', p_install_id,
    'domain', p_domain,
    'status', p_status,
    'enabled', p_enabled,
    'normalized_config', coalesce(p_normalized, '{}'::jsonb)
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Activate Website Kompis for a verified customer domain
-- ---------------------------------------------------------------------------
create or replace function public.activate_website_kompis_for_domain(p_domain_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_binding record;
  v_existing public.tenant_public_companion_install_config;
  v_merged jsonb;
  v_normalized jsonb;
begin
  select *
  into v_binding
  from public._wpkf_assert_verified_domain_access(p_domain_id)
  limit 1;

  v_merged := public._wpkf_sanitize_install_config_patch(
    jsonb_build_object('enabled', true)
  );

  select *
  into v_existing
  from public.tenant_public_companion_install_config c
  where c.install_id = v_binding.install_id
    and c.tenant_id = v_binding.tenant_id
  limit 1;

  if v_existing.id is null then
    insert into public.tenant_public_companion_install_config (
      tenant_id,
      install_id,
      config,
      updated_by
    )
    values (
      v_binding.tenant_id,
      v_binding.install_id,
      v_merged,
      public._wpkf_current_user_id()
    )
    returning * into v_existing;
  else
    v_merged := public._wpkf_merge_install_config(v_existing.config, v_merged);

    update public.tenant_public_companion_install_config c
    set
      config = v_merged,
      updated_at = now(),
      updated_by = public._wpkf_current_user_id()
    where c.id = v_existing.id
    returning * into v_existing;
  end if;

  v_normalized := public._wpkf_normalize_install_config_json(v_existing.config, 'no');

  perform public._wpkf_record_audit_event(
    v_binding.tenant_id,
    null,
    'activated',
    null,
    'active',
    null,
    v_binding.install_id,
    v_binding.domain,
    jsonb_build_object(
      'scope',
      'website_kompis_domain_activation',
      'domain_id',
      p_domain_id,
      'normalized_config',
      v_normalized
    )
  );

  return public._wpkf_public_embed_payload(
    v_binding.install_id,
    v_binding.domain,
    (v_normalized ->> 'enabled')::boolean,
    'active',
    v_normalized
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Deactivate Website Kompis for a verified customer domain
-- ---------------------------------------------------------------------------
create or replace function public.deactivate_website_kompis_for_domain(p_domain_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_binding record;
  v_existing public.tenant_public_companion_install_config;
  v_merged jsonb;
  v_normalized jsonb;
begin
  select *
  into v_binding
  from public._wpkf_assert_verified_domain_access(p_domain_id)
  limit 1;

  select *
  into v_existing
  from public.tenant_public_companion_install_config c
  where c.install_id = v_binding.install_id
    and c.tenant_id = v_binding.tenant_id
  limit 1;

  v_merged := public._wpkf_sanitize_install_config_patch(
    jsonb_build_object('enabled', false)
  );

  if v_existing.id is null then
    insert into public.tenant_public_companion_install_config (
      tenant_id,
      install_id,
      config,
      updated_by
    )
    values (
      v_binding.tenant_id,
      v_binding.install_id,
      v_merged,
      public._wpkf_current_user_id()
    )
    returning * into v_existing;
  else
    v_merged := public._wpkf_merge_install_config(v_existing.config, v_merged);

    update public.tenant_public_companion_install_config c
    set
      config = v_merged,
      updated_at = now(),
      updated_by = public._wpkf_current_user_id()
    where c.id = v_existing.id
    returning * into v_existing;
  end if;

  v_normalized := public._wpkf_normalize_install_config_json(v_existing.config, 'no');

  perform public._wpkf_record_audit_event(
    v_binding.tenant_id,
    null,
    'deactivated',
    'active',
    'disabled',
    null,
    v_binding.install_id,
    v_binding.domain,
    jsonb_build_object(
      'scope',
      'website_kompis_domain_activation',
      'domain_id',
      p_domain_id,
      'normalized_config',
      v_normalized
    )
  );

  return public._wpkf_public_embed_payload(
    v_binding.install_id,
    v_binding.domain,
    (v_normalized ->> 'enabled')::boolean,
    'disabled',
    v_normalized
  );
end;
$$;

revoke all on function public._wpkf_assert_verified_domain_access(uuid) from public, anon, authenticated;
revoke all on function public._wpkf_public_embed_payload(uuid, text, boolean, text, jsonb) from public, anon, authenticated;

revoke all on function public.activate_website_kompis_for_domain(uuid) from public, anon;
revoke all on function public.deactivate_website_kompis_for_domain(uuid) from public, anon;

grant execute on function public.activate_website_kompis_for_domain(uuid) to authenticated;
grant execute on function public.deactivate_website_kompis_for_domain(uuid) to authenticated;
