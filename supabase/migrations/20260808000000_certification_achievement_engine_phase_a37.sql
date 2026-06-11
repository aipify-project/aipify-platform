-- Phase A.37 — Certification & Achievement Engine
-- Extends Learning & Training Engine (A.36) with certifications, badges, and team readiness.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'certification_achievement_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. certification_definitions
-- ---------------------------------------------------------------------------
create table if not exists public.certification_definitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  certification_key text not null,
  name text not null,
  description text,
  target_role text not null default 'viewer' check (
    target_role in ('owner', 'administrator', 'manager', 'support_agent', 'viewer')
  ),
  expiration_policy text not null default 'fixed_days' check (
    expiration_policy in ('none', 'fixed_days', 'annual_renewal')
  ),
  validity_period_days int check (validity_period_days is null or validity_period_days > 0),
  certificate_prefix text not null default 'GEN',
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, certification_key)
);

create index if not exists certification_definitions_org_role_idx
  on public.certification_definitions (organization_id, target_role, status);

alter table public.certification_definitions enable row level security;
revoke all on public.certification_definitions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. user_certifications
-- ---------------------------------------------------------------------------
create table if not exists public.user_certifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  certification_definition_id uuid not null references public.certification_definitions (id) on delete cascade,
  certificate_number text not null,
  certificate_status text not null default 'active' check (
    certificate_status in ('active', 'expired', 'revoked')
  ),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references public.users (id) on delete set null,
  revoke_reason text,
  issued_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, certificate_number)
);

create index if not exists user_certifications_org_user_idx
  on public.user_certifications (organization_id, user_id, certificate_status);

create index if not exists user_certifications_def_idx
  on public.user_certifications (certification_definition_id, certificate_status);

alter table public.user_certifications enable row level security;
revoke all on public.user_certifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. achievement_badges
-- ---------------------------------------------------------------------------
create table if not exists public.achievement_badges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  badge_key text not null,
  name text not null,
  description text,
  module_key text,
  display_on_profile boolean not null default true,
  icon_ref text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, badge_key)
);

alter table public.achievement_badges enable row level security;
revoke all on public.achievement_badges from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. user_achievement_badges
-- ---------------------------------------------------------------------------
create table if not exists public.user_achievement_badges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  badge_id uuid not null references public.achievement_badges (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  awarded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, badge_id)
);

create index if not exists user_achievement_badges_user_idx
  on public.user_achievement_badges (organization_id, user_id);

alter table public.user_achievement_badges enable row level security;
revoke all on public.user_achievement_badges from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. certification_requirements
-- ---------------------------------------------------------------------------
create table if not exists public.certification_requirements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  certification_definition_id uuid not null references public.certification_definitions (id) on delete cascade,
  learning_path_id uuid references public.learning_paths (id) on delete set null,
  training_assessment_id uuid references public.training_assessments (id) on delete set null,
  passing_threshold int not null default 80 check (passing_threshold between 0 and 100),
  renewal_required boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (organization_id, certification_definition_id, learning_path_id, training_assessment_id)
);

alter table public.certification_requirements enable row level security;
revoke all on public.certification_requirements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'certification_achievement', v.description
from (values
  ('certifications.view', 'View Certifications', 'View certifications and achievement badges'),
  ('certifications.issue', 'Issue Certifications', 'Issue certifications to team members'),
  ('certifications.revoke', 'Revoke Certifications', 'Revoke issued certifications'),
  ('certifications.export', 'Export Certifications', 'Export certificate metadata and PDF scaffold'),
  ('certifications.manage', 'Manage Certifications', 'Manage certification definitions and requirements')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'certifications.view'), ('owner', 'certifications.issue'),
  ('owner', 'certifications.revoke'), ('owner', 'certifications.export'),
  ('owner', 'certifications.manage'),
  ('administrator', 'certifications.view'), ('administrator', 'certifications.issue'),
  ('administrator', 'certifications.revoke'), ('administrator', 'certifications.export'),
  ('administrator', 'certifications.manage'),
  ('manager', 'certifications.view'), ('manager', 'certifications.issue'),
  ('manager', 'certifications.export'),
  ('support_agent', 'certifications.view'),
  ('viewer', 'certifications.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_cae_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cae_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'certification_achievement',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._cae_european_date(p_value timestamptz)
returns text language sql immutable as $$
  select case
    when p_value is null then null
    else to_char(p_value at time zone 'UTC', 'DD.MM.YYYY')
  end;
$$;

create or replace function public._cae_generate_certificate_number(
  p_organization_id uuid,
  p_prefix text
)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_number text;
  v_attempt int := 0;
begin
  loop
    v_number := 'AIP-' || upper(coalesce(nullif(trim(p_prefix), ''), 'GEN')) || '-' ||
      lpad((floor(random() * 999999)::int)::text, 6, '0');
    exit when not exists (
      select 1 from public.user_certifications uc
      where uc.organization_id = p_organization_id and uc.certificate_number = v_number
    );
    v_attempt := v_attempt + 1;
    if v_attempt > 20 then
      raise exception 'Unable to generate unique certificate number';
    end if;
  end loop;
  return v_number;
end; $$;

create or replace function public._cae_user_display_name(p_user_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(nullif(trim(u.name), ''), split_part(u.email, '@', 1), 'Team Member')
  from public.users u
  where u.id = p_user_id
  limit 1;
$$;

create or replace function public._cae_build_certificate_template(
  p_user_name text,
  p_certification_name text,
  p_issued_at timestamptz,
  p_expires_at timestamptz
)
returns text language sql immutable as $$
  select format(
    E'Aipify Certification\n\nThis certifies that %s has successfully completed %s.\n\nIssued: %s\n%s\n\nCertificate metadata only — no operational PII.',
    p_user_name,
    p_certification_name,
    public._cae_european_date(p_issued_at),
    case
      when p_expires_at is null then 'No expiration'
      else 'Valid until: ' || public._cae_european_date(p_expires_at)
    end
  );
$$;

create or replace function public._cae_expires_at(
  p_policy text,
  p_validity_days int,
  p_issued_at timestamptz default now()
)
returns timestamptz language sql immutable as $$
  select case p_policy
    when 'none' then null
    when 'annual_renewal' then p_issued_at + interval '1 year'
    when 'fixed_days' then p_issued_at + make_interval(days => coalesce(p_validity_days, 365))
    else p_issued_at + make_interval(days => coalesce(p_validity_days, 365))
  end;
$$;

create or replace function public._cae_seed_org_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_support_cert_id uuid;
  v_admin_cert_id uuid;
  v_owner_cert_id uuid;
  v_support_path_id uuid;
  v_admin_path_id uuid;
  v_owner_path_id uuid;
  v_support_badge_id uuid;
  v_admin_badge_id uuid;
begin
  perform public._lte_seed_org_content(p_organization_id);

  insert into public.certification_definitions (
    organization_id, certification_key, name, description, target_role,
    expiration_policy, validity_period_days, certificate_prefix
  )
  select p_organization_id, v.key, v.name, v.desc, v.role, v.policy, v.days, v.prefix
  from (values
    ('support_ai_certified', 'Support AI Certified', 'Certifies Support AI module readiness.', 'support_agent', 'fixed_days', 365, 'SUP'),
    ('admin_operations_certified', 'Admin Operations Certified', 'Certifies operations dashboard and approval workflows.', 'administrator', 'fixed_days', 365, 'ADM'),
    ('owner_governance_certified', 'Governance Certified', 'Certifies enterprise governance foundations.', 'owner', 'annual_renewal', 365, 'GOV')
  ) as v(key, name, desc, role, policy, days, prefix)
  on conflict (organization_id, certification_key) do nothing;

  select id into v_support_cert_id from public.certification_definitions
  where organization_id = p_organization_id and certification_key = 'support_ai_certified';
  select id into v_admin_cert_id from public.certification_definitions
  where organization_id = p_organization_id and certification_key = 'admin_operations_certified';
  select id into v_owner_cert_id from public.certification_definitions
  where organization_id = p_organization_id and certification_key = 'owner_governance_certified';

  select id into v_support_path_id from public.learning_paths
  where organization_id = p_organization_id and path_key = 'support_ai_basics';
  select id into v_admin_path_id from public.learning_paths
  where organization_id = p_organization_id and path_key = 'admin_operations';
  select id into v_owner_path_id from public.learning_paths
  where organization_id = p_organization_id and path_key = 'owner_governance';

  if v_support_cert_id is not null and v_support_path_id is not null then
    insert into public.certification_requirements (
      organization_id, certification_definition_id, learning_path_id, passing_threshold, renewal_required, sort_order
    )
    values (p_organization_id, v_support_cert_id, v_support_path_id, 100, true, 1)
    on conflict do nothing;
  end if;

  if v_admin_cert_id is not null and v_admin_path_id is not null then
    insert into public.certification_requirements (
      organization_id, certification_definition_id, learning_path_id, passing_threshold, renewal_required, sort_order
    )
    values (p_organization_id, v_admin_cert_id, v_admin_path_id, 100, true, 1)
    on conflict do nothing;
  end if;

  if v_owner_cert_id is not null and v_owner_path_id is not null then
    insert into public.certification_requirements (
      organization_id, certification_definition_id, learning_path_id, passing_threshold, renewal_required, sort_order
    )
    values (p_organization_id, v_owner_cert_id, v_owner_path_id, 100, true, 1)
    on conflict do nothing;
  end if;

  insert into public.achievement_badges (
    organization_id, badge_key, name, description, module_key, display_on_profile, icon_ref
  )
  select p_organization_id, v.key, v.name, v.desc, v.module, true, v.icon
  from (values
    ('support_ai_expert', 'Support AI Expert', 'Completed Support AI certification.', 'support_ai_engine', 'badge-support'),
    ('admin_ops_ready', 'Operations Ready', 'Completed Admin Operations certification.', 'operations_dashboard_engine', 'badge-admin'),
    ('governance_leader', 'Governance Leader', 'Completed Governance certification.', 'governance_policy_engine', 'badge-governance')
  ) as v(key, name, desc, module, icon)
  on conflict (organization_id, badge_key) do nothing;

  select id into v_support_badge_id from public.achievement_badges
  where organization_id = p_organization_id and badge_key = 'support_ai_expert';
  select id into v_admin_badge_id from public.achievement_badges
  where organization_id = p_organization_id and badge_key = 'admin_ops_ready';
end; $$;

create or replace function public._cae_check_eligibility(
  p_organization_id uuid,
  p_user_id uuid,
  p_certification_definition_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_def public.certification_definitions;
  v_required int;
  v_met int;
  v_user_role text;
begin
  select * into v_def from public.certification_definitions
  where id = p_certification_definition_id and organization_id = p_organization_id;
  if not found then
    return jsonb_build_object('eligible', false, 'reason', 'Certification not found');
  end if;

  v_user_role := public._lte_user_role(p_organization_id, p_user_id);
  if v_def.target_role <> 'viewer' and v_user_role <> v_def.target_role then
    return jsonb_build_object(
      'eligible', false,
      'reason', 'Role mismatch',
      'required_role', v_def.target_role,
      'user_role', v_user_role
    );
  end if;

  select count(*) into v_required
  from public.certification_requirements cr
  where cr.certification_definition_id = p_certification_definition_id
    and cr.organization_id = p_organization_id;

  if v_required = 0 then
    return jsonb_build_object('eligible', true, 'requirements_met', 0, 'requirements_total', 0);
  end if;

  select count(*) into v_met
  from public.certification_requirements cr
  join public.user_learning_progress ulp
    on ulp.learning_path_id = cr.learning_path_id
   and ulp.organization_id = cr.organization_id
   and ulp.user_id = p_user_id
  where cr.certification_definition_id = p_certification_definition_id
    and cr.organization_id = p_organization_id
    and ulp.status = 'completed'
    and ulp.completion_percentage >= cr.passing_threshold;

  return jsonb_build_object(
    'eligible', v_met >= v_required,
    'requirements_met', v_met,
    'requirements_total', v_required,
    'reason', case when v_met >= v_required then 'Requirements met' else 'Training incomplete' end
  );
end; $$;

create or replace function public._cae_team_readiness(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'target_role', cd.target_role,
      'certification_key', cd.certification_key,
      'certification_name', cd.name,
      'certified_count', coalesce(stats.certified_count, 0),
      'eligible_team_count', coalesce(stats.team_count, 0),
      'readiness_label', coalesce(stats.certified_count, 0)::text || '/' ||
        coalesce(nullif(stats.team_count, 0), stats.certified_count, 0)::text || ' certified',
      'readiness_pct', case
        when coalesce(stats.team_count, 0) = 0 then 0
        else round(100.0 * stats.certified_count / stats.team_count)::int
      end,
      'privacy_note', 'Aggregate counts only — no individual PII.'
    ) order by cd.target_role, cd.certification_key)
    from public.certification_definitions cd
    left join lateral (
      select
        count(distinct u.id) filter (
          where uc.certificate_status = 'active'
            and (uc.expires_at is null or uc.expires_at > now())
        ) as certified_count,
        count(distinct u.id) filter (
          where u.role = cd.target_role or cd.target_role = 'viewer'
        ) as team_count
      from public.users u
      left join public.user_certifications uc
        on uc.user_id = u.id
       and uc.certification_definition_id = cd.id
       and uc.organization_id = cd.organization_id
      where u.company_id = p_organization_id
        and (cd.target_role = 'viewer' or u.role = cd.target_role)
    ) stats on true
    where cd.organization_id = p_organization_id and cd.status = 'active'
  ), '[]'::jsonb);
end; $$;

create or replace function public._cae_refresh_expired()
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.user_certifications
  set certificate_status = 'expired', updated_at = now()
  where certificate_status = 'active'
    and expires_at is not null
    and expires_at < now();
end; $$;

-- ---------------------------------------------------------------------------
-- 8. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.issue_user_certification(
  p_user_id uuid,
  p_certification_definition_id uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_issuer uuid;
  v_def public.certification_definitions;
  v_eligibility jsonb;
  v_row public.user_certifications;
  v_expires timestamptz;
  v_badge_id uuid;
begin
  perform public._irp_require_permission('certifications.issue');
  v_org_id := public._mta_require_organization();
  v_issuer := public._mta_app_user_id();
  perform public._cae_seed_org_content(v_org_id);
  perform public._cae_refresh_expired();

  select * into v_def from public.certification_definitions
  where id = p_certification_definition_id and organization_id = v_org_id and status = 'active';
  if not found then raise exception 'Certification definition not found'; end if;

  v_eligibility := public._cae_check_eligibility(v_org_id, p_user_id, p_certification_definition_id);
  if not coalesce((v_eligibility->>'eligible')::boolean, false) then
    raise exception 'User not eligible: %', coalesce(v_eligibility->>'reason', 'requirements not met');
  end if;

  if exists (
    select 1 from public.user_certifications uc
    where uc.organization_id = v_org_id
      and uc.user_id = p_user_id
      and uc.certification_definition_id = p_certification_definition_id
      and uc.certificate_status = 'active'
      and (uc.expires_at is null or uc.expires_at > now())
  ) then
    raise exception 'Active certification already exists for this user';
  end if;

  v_expires := public._cae_expires_at(v_def.expiration_policy, v_def.validity_period_days, now());

  insert into public.user_certifications (
    organization_id, user_id, certification_definition_id, certificate_number,
    certificate_status, issued_at, expires_at, issued_by
  )
  values (
    v_org_id, p_user_id, p_certification_definition_id,
    public._cae_generate_certificate_number(v_org_id, v_def.certificate_prefix),
    'active', now(), v_expires, v_issuer
  )
  returning * into v_row;

  select ab.id into v_badge_id
  from public.achievement_badges ab
  where ab.organization_id = v_org_id
    and ab.status = 'active'
    and (
      (v_def.certification_key = 'support_ai_certified' and ab.badge_key = 'support_ai_expert')
      or (v_def.certification_key = 'admin_operations_certified' and ab.badge_key = 'admin_ops_ready')
      or (v_def.certification_key = 'owner_governance_certified' and ab.badge_key = 'governance_leader')
    )
  limit 1;

  if v_badge_id is not null then
    insert into public.user_achievement_badges (organization_id, user_id, badge_id, awarded_by)
    values (v_org_id, p_user_id, v_badge_id, v_issuer)
    on conflict (organization_id, user_id, badge_id) do nothing;
  end if;

  perform public._cae_log(v_org_id, 'certification_issued', 'user_certification', v_row.id,
    jsonb_build_object(
      'user_id', p_user_id,
      'certification_key', v_def.certification_key,
      'certificate_number', v_row.certificate_number
    ));

  return jsonb_build_object(
    'certification', row_to_json(v_row),
    'user_name', public._cae_user_display_name(p_user_id),
    'certification_name', v_def.name,
    'issued_at_european', public._cae_european_date(v_row.issued_at),
    'expires_at_european', public._cae_european_date(v_row.expires_at),
    'template_text', public._cae_build_certificate_template(
      public._cae_user_display_name(p_user_id), v_def.name, v_row.issued_at, v_row.expires_at
    )
  );
end; $$;

create or replace function public.revoke_user_certification(
  p_user_certification_id uuid,
  p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_revoker uuid;
  v_row public.user_certifications;
begin
  perform public._irp_require_permission('certifications.revoke');
  v_org_id := public._mta_require_organization();
  v_revoker := public._mta_app_user_id();

  update public.user_certifications
  set certificate_status = 'revoked',
      revoked_at = now(),
      revoked_by = v_revoker,
      revoke_reason = p_reason,
      updated_at = now()
  where id = p_user_certification_id
    and organization_id = v_org_id
    and certificate_status = 'active'
  returning * into v_row;

  if not found then raise exception 'Active certification not found'; end if;

  perform public._cae_log(v_org_id, 'certification_revoked', 'user_certification', v_row.id,
    jsonb_build_object('certificate_number', v_row.certificate_number, 'reason', p_reason));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.export_user_certificate(
  p_user_certification_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_uc public.user_certifications;
  v_def public.certification_definitions;
  v_user_name text;
  v_template text;
  v_html text;
begin
  perform public._irp_require_permission('certifications.export');
  v_org_id := public._mta_require_organization();
  perform public._cae_refresh_expired();

  select * into v_uc from public.user_certifications
  where id = p_user_certification_id and organization_id = v_org_id;
  if not found then raise exception 'Certification not found'; end if;

  select * into v_def from public.certification_definitions where id = v_uc.certification_definition_id;
  v_user_name := public._cae_user_display_name(v_uc.user_id);
  v_template := public._cae_build_certificate_template(
    v_user_name, v_def.name, v_uc.issued_at, v_uc.expires_at
  );

  v_html := format(
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Aipify Certificate</title></head><body style="font-family:serif;padding:48px;"><h1>Aipify Certification</h1><p>This certifies that <strong>%s</strong> has successfully completed <strong>%s</strong>.</p><p>Certificate ID: %s</p><p>Issued: %s</p><p>%s</p></body></html>',
    v_user_name,
    v_def.name,
    v_uc.certificate_number,
    public._cae_european_date(v_uc.issued_at),
    case
      when v_uc.expires_at is null then 'No expiration'
      else 'Valid until: ' || public._cae_european_date(v_uc.expires_at)
    end
  );

  perform public._cae_log(v_org_id, 'certification_exported', 'user_certification', v_uc.id,
    jsonb_build_object('certificate_number', v_uc.certificate_number));

  return jsonb_build_object(
    'certificate_number', v_uc.certificate_number,
    'user_name', v_user_name,
    'certification_name', v_def.name,
    'issued_at', v_uc.issued_at,
    'issued_at_european', public._cae_european_date(v_uc.issued_at),
    'expires_at', v_uc.expires_at,
    'expires_at_european', public._cae_european_date(v_uc.expires_at),
    'certificate_status', v_uc.certificate_status,
    'template_text', v_template,
    'html_scaffold', v_html,
    'export_format', 'structured_json_with_html_scaffold',
    'privacy_note', 'Export contains display name and certificate metadata only.'
  );
end; $$;

create or replace function public.get_user_achievement_badges(p_user_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('certifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := coalesce(p_user_id, public._mta_app_user_id());

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'badge_key', ab.badge_key,
      'name', ab.name,
      'description', ab.description,
      'module_key', ab.module_key,
      'display_on_profile', ab.display_on_profile,
      'icon_ref', ab.icon_ref,
      'awarded_at', uab.awarded_at,
      'awarded_at_european', public._cae_european_date(uab.awarded_at)
    ) order by uab.awarded_at desc)
    from public.user_achievement_badges uab
    join public.achievement_badges ab on ab.id = uab.badge_id
    where uab.organization_id = v_org_id
      and uab.user_id = v_user_id
      and ab.display_on_profile = true
      and ab.status = 'active'
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_certification_achievement_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('certifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._cae_seed_org_content(v_org_id);
  perform public._cae_refresh_expired();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Certifications recognize module readiness built on Learning & Training (A.36) — metadata only.',
    'principles', jsonb_build_array(
      'Certifications require completed training paths where configured',
      'European date format (DD.MM.YYYY) on all certificate surfaces',
      'Team readiness aggregates — Support 12/15 certified style summaries',
      'Achievement badges scaffold for user profile display',
      'PDF export via structured metadata + HTML scaffold — no raw PII storage'
    ),
    'summary', jsonb_build_object(
      'active_certifications', coalesce((
        select count(*) from public.user_certifications
        where organization_id = v_org_id and user_id = v_user_id
          and certificate_status = 'active'
          and (expires_at is null or expires_at > now())
      ), 0),
      'expired_certifications', coalesce((
        select count(*) from public.user_certifications
        where organization_id = v_org_id and user_id = v_user_id
          and certificate_status in ('expired', 'revoked')
      ), 0),
      'revoked_certifications', coalesce((
        select count(*) from public.user_certifications
        where organization_id = v_org_id and user_id = v_user_id
          and certificate_status = 'revoked'
      ), 0),
      'badges_awarded', coalesce((
        select count(*) from public.user_achievement_badges
        where organization_id = v_org_id and user_id = v_user_id
      ), 0),
      'definitions_count', coalesce((
        select count(*) from public.certification_definitions
        where organization_id = v_org_id and status = 'active'
      ), 0)
    ),
    'my_certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', uc.id,
        'certificate_number', uc.certificate_number,
        'certification_key', cd.certification_key,
        'certification_name', cd.name,
        'certificate_status', uc.certificate_status,
        'issued_at', uc.issued_at,
        'issued_at_european', public._cae_european_date(uc.issued_at),
        'expires_at', uc.expires_at,
        'expires_at_european', public._cae_european_date(uc.expires_at),
        'eligible', public._cae_check_eligibility(v_org_id, v_user_id, cd.id)
      ) order by uc.issued_at desc)
      from public.user_certifications uc
      join public.certification_definitions cd on cd.id = uc.certification_definition_id
      where uc.organization_id = v_org_id and uc.user_id = v_user_id
    ), '[]'::jsonb),
    'certification_definitions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id,
        'certification_key', cd.certification_key,
        'name', cd.name,
        'description', cd.description,
        'target_role', cd.target_role,
        'expiration_policy', cd.expiration_policy,
        'validity_period_days', cd.validity_period_days,
        'eligibility', public._cae_check_eligibility(v_org_id, v_user_id, cd.id)
      ) order by cd.target_role, cd.certification_key)
      from public.certification_definitions cd
      where cd.organization_id = v_org_id and cd.status = 'active'
    ), '[]'::jsonb),
    'team_readiness', case
      when public._irp_has_permission('certifications.manage')
        or public._irp_has_permission('certifications.issue') then public._cae_team_readiness(v_org_id)
      else '[]'::jsonb
    end,
    'achievement_badges', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ab.id,
        'badge_key', ab.badge_key,
        'name', ab.name,
        'description', ab.description,
        'module_key', ab.module_key,
        'display_on_profile', ab.display_on_profile
      ) order by ab.badge_key)
      from public.achievement_badges ab
      where ab.organization_id = v_org_id and ab.status = 'active'
    ), '[]'::jsonb),
    'user_badges', public.get_user_achievement_badges(v_user_id),
    'training_integration', jsonb_build_object(
      'learning_training_route', '/app/learning-training-engine',
      'note', 'Certification requirements link to A.36 learning paths and assessments'
    ),
    'distinction_note', 'Internal team certifications — distinct from Partner Certification Ecosystem (Phase 91).'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_certification_achievement_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_active int;
  v_expired int;
  v_badges int;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._cae_seed_org_content(v_org_id);
  perform public._cae_refresh_expired();

  select
    count(*) filter (where certificate_status = 'active' and (expires_at is null or expires_at > now())),
    count(*) filter (where certificate_status in ('expired', 'revoked'))
  into v_active, v_expired
  from public.user_certifications
  where organization_id = v_org_id and user_id = v_user_id;

  select count(*) into v_badges
  from public.user_achievement_badges
  where organization_id = v_org_id and user_id = v_user_id;

  return jsonb_build_object(
    'has_organization', true,
    'active_certifications', v_active,
    'expired_certifications', v_expired,
    'badges_awarded', v_badges,
    'philosophy', 'Certifications and achievements for module readiness.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'certification_issued', 'certification_revoked', 'certification_exported',
    'achievement_badge_awarded', 'certification_definition_updated'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'certification-achievement-engine', 'Certification & Achievement Engine', 'Internal certifications, badges, and team readiness built on Learning & Training (A.36).', 'authenticated', 73
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'certification-achievement-engine' and tenant_id is null);

grant execute on function public.issue_user_certification(uuid, uuid) to authenticated;
grant execute on function public.revoke_user_certification(uuid, text) to authenticated;
grant execute on function public.export_user_certificate(uuid) to authenticated;
grant execute on function public.get_user_achievement_badges(uuid) to authenticated;
grant execute on function public.get_certification_achievement_engine_dashboard() to authenticated;
grant execute on function public.get_certification_achievement_engine_card() to authenticated;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._cae_seed_org_content(v_org_id);
  end loop;
end $$;
