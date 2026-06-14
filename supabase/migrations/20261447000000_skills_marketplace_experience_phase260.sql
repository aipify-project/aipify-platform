-- Phase 260 — Skills Marketplace Experience Engine

create or replace function public._sme_release_stage(p_skill_status text)
returns text
language sql
immutable
as $$
  select case coalesce(p_skill_status, 'planned')
    when 'planned' then 'internal_development'
    when 'beta' then 'pilot_customers'
    when 'active' then 'stable_release'
    when 'deprecated' then 'stable_release'
    else 'internal_development'
  end;
$$;

create or replace function public._sme_display_status(p_skill_status text, p_tenant_status text)
returns text
language sql
immutable
as $$
  select case
    when p_tenant_status in ('warning', 'failed') then 'requires_attention'
    when p_tenant_status = 'paused' then 'paused'
    when p_skill_status = 'beta' then 'pilot'
    when p_skill_status = 'beta' and p_tenant_status is not null then 'beta'
    when coalesce(p_tenant_status, p_skill_status) in ('active', 'installed') then 'operational'
    else 'operational'
  end;
$$;

create or replace function public._sme_marketplace_category(p_category text)
returns text
language sql
immutable
as $$
  select case lower(coalesce(p_category, 'operational'))
    when 'executive' then 'executive'
    when 'support' then 'support'
    when 'commerce' then 'commerce'
    when 'marketing' then 'growth'
    when 'moderation' then 'compliance'
    when 'governance' then 'compliance'
    when 'knowledge' then 'knowledge'
    when 'companion' then 'companion'
    when 'automation' then 'automation'
    when 'operational' then 'operations'
    when 'analytics' then 'operations'
    when 'quality' then 'operations'
    when 'developer' then 'operations'
    when 'industry' then 'operations'
    else 'operations'
  end;
$$;

create or replace function public._sme_activation_method(
  p_installed boolean,
  p_plan_allowed boolean,
  p_requires_approval boolean,
  p_skill_status text
)
returns text
language sql
immutable
as $$
  select case
    when p_skill_status = 'planned' then 'coming_soon'
    when not p_plan_allowed then 'request_access'
    when p_installed then 'active'
    when p_requires_approval then 'request_access'
    else 'activate'
  end;
$$;

create or replace function public._sme_recommendation_keys(p_category text)
returns jsonb
language sql
immutable
as $$
  select case public._sme_marketplace_category(p_category)
    when 'executive' then jsonb_build_object('reason_key', 'executive_visibility', 'impact_key', 'executive_impact')
    when 'support' then jsonb_build_object('reason_key', 'support_efficiency', 'impact_key', 'support_impact')
    when 'commerce' then jsonb_build_object('reason_key', 'commerce_margins', 'impact_key', 'commerce_impact')
    when 'knowledge' then jsonb_build_object('reason_key', 'knowledge_retention', 'impact_key', 'knowledge_impact')
    when 'growth' then jsonb_build_object('reason_key', 'growth_expansion', 'impact_key', 'growth_impact')
    when 'automation' then jsonb_build_object('reason_key', 'automation_efficiency', 'impact_key', 'automation_impact')
    when 'companion' then jsonb_build_object('reason_key', 'companion_productivity', 'impact_key', 'companion_impact')
    when 'compliance' then jsonb_build_object('reason_key', 'compliance_confidence', 'impact_key', 'compliance_impact')
    else jsonb_build_object('reason_key', 'operations_efficiency', 'impact_key', 'operations_impact')
  end;
$$;

create or replace function public.get_skills_marketplace_experience(p_scope text default 'customer')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_overview jsonb;
  v_installed jsonb;
  v_recommended jsonb;
  v_marketplace jsonb;
  v_governance jsonb;
  v_performance jsonb;
  v_pipeline jsonb;
begin
  v_pipeline := jsonb_build_array(
    jsonb_build_object('key', 'internal_development', 'order', 1),
    jsonb_build_object('key', 'customer_zero', 'order', 2),
    jsonb_build_object('key', 'pilot_customers', 'order', 3),
    jsonb_build_object('key', 'growth_partners', 'order', 4),
    jsonb_build_object('key', 'stable_release', 'order', 5)
  );

  if p_scope = 'platform' then
    if not public.is_platform_admin() then
      raise exception 'Not authorized';
    end if;

    select jsonb_build_object(
      'installed_count', (select count(*)::int from public.tenant_skills where status in ('installed', 'active', 'paused', 'warning')),
      'available_count', (select count(*)::int from public.skills where status in ('active', 'beta')),
      'pilot_count', (select count(*)::int from public.skills where status = 'beta'),
      'pending_reviews', (
        select count(*)::int from public.tenant_skills ts
        join public.skills sk on sk.id = ts.skill_id
        where sk.requires_approval = true and ts.status = 'installed'
      )
    ) into v_overview;

    select coalesce(jsonb_agg(row order by row ->> 'name'), '[]'::jsonb) into v_installed
    from (
      select jsonb_build_object(
        'key', sk.key,
        'name', sk.name,
        'description', sk.description,
        'display_status', public._sme_display_status(sk.status, null),
        'version', sk.current_version,
        'environment', case when sk.status = 'beta' then 'testing' else 'production' end,
        'owner', coalesce(sk.author, 'Aipify'),
        'category', public._sme_marketplace_category(sk.category),
        'release_stage', public._sme_release_stage(sk.status),
        'install_count', (select count(*)::int from public.tenant_skills ts where ts.skill_id = sk.id)
      ) as row
      from public.skills sk
      where sk.status in ('active', 'beta')
      order by sk.name
      limit 24
    ) s;

    select coalesce(jsonb_agg(row order by row ->> 'name'), '[]'::jsonb) into v_marketplace
    from (
      select jsonb_build_object(
        'key', sk.key,
        'name', sk.name,
        'description', sk.description,
        'category', public._sme_marketplace_category(sk.category),
        'operational_status', sk.status,
        'estimated_value_key', public._sme_recommendation_keys(sk.category) ->> 'impact_key',
        'activation_method', public._sme_activation_method(false, true, sk.requires_approval, sk.status),
        'release_stage', public._sme_release_stage(sk.status),
        'minimum_plan', sk.minimum_plan,
        'requires_approval', sk.requires_approval
      ) as row
      from public.skills sk
      where sk.status in ('active', 'beta', 'planned')
      order by sk.category, sk.name
    ) m;

    select coalesce(jsonb_agg(row), '[]'::jsonb) into v_governance
    from (
      select jsonb_build_object(
        'key', sk.key,
        'name', sk.name,
        'permission_scope', coalesce(sk.required_permissions::text, '[]'),
        'risk_level', sk.risk_level,
        'owner', coalesce(sk.author, 'Aipify'),
        'requires_approval', sk.requires_approval,
        'last_review_at', sk.updated_at,
        'status', 'under_review'
      ) as row
      from public.skills sk
      where sk.requires_approval = true or sk.risk_level in ('high', 'medium')
      order by sk.risk_level desc, sk.name
      limit 12
    ) g;

    select coalesce(jsonb_agg(row order by (row ->> 'success_rate')::numeric desc), '[]'::jsonb) into v_performance
    from (
      select jsonb_build_object(
        'key', sk.key,
        'name', sk.name,
        'success_rate', round(avg(public.compute_skill_success_score(ts.id)))::int,
        'usage_frequency', count(ts.id)::int,
        'business_impact_key', public._sme_recommendation_keys(sk.category) ->> 'impact_key',
        'avg_execution_ms', 0,
        'satisfaction_score', least(5, round(avg(public.compute_skill_success_score(ts.id)) / 20.0, 1))
      ) as row
      from public.skills sk
      join public.tenant_skills ts on ts.skill_id = sk.id
      where ts.status in ('active', 'installed', 'paused', 'warning')
      group by sk.key, sk.name, sk.category
      having count(ts.id) > 0
      order by avg(public.compute_skill_success_score(ts.id)) desc
      limit 8
    ) p;

    v_recommended := coalesce((
      select jsonb_agg(row)
      from (
        select jsonb_build_object(
          'key', sk.key,
          'name', sk.name,
          'description', sk.description,
          'category', public._sme_marketplace_category(sk.category),
          'reason_key', public._sme_recommendation_keys(sk.category) ->> 'reason_key',
          'impact_key', public._sme_recommendation_keys(sk.category) ->> 'impact_key',
          'activation_method', public._sme_activation_method(false, true, sk.requires_approval, sk.status)
        ) as row
        from public.skills sk
        where sk.status in ('active', 'beta')
        order by case sk.category when 'Executive' then 1 when 'Support' then 2 when 'Operational' then 3 else 4 end, sk.name
        limit 4
      ) r
    ), '[]'::jsonb);

    return jsonb_build_object(
      'scope', 'platform',
      'overview', v_overview,
      'installed_skills', v_installed,
      'recommended_skills', v_recommended,
      'marketplace', v_marketplace,
      'pipeline', v_pipeline,
      'governance', v_governance,
      'performance', v_performance,
      'principle', 'Skills are business capabilities — expand what your organization can do.'
    );
  end if;

  -- Customer scope
  v_tenant_id := public._ss_require_tenant();
  v_plan := public._ss_tenant_plan(v_tenant_id);

  select jsonb_build_object(
    'installed_count', (
      select count(*)::int from public.tenant_skills
      where tenant_id = v_tenant_id and status in ('installed', 'active', 'paused', 'warning')
    ),
    'available_count', (
      select count(*)::int from public.skills sk
      where sk.status in ('active', 'beta')
        and not exists (
          select 1 from public.tenant_skills ts
          where ts.tenant_id = v_tenant_id and ts.skill_id = sk.id and ts.status not in ('disabled')
        )
    ),
    'pilot_count', (
      select count(*)::int from public.tenant_skills ts
      join public.skills sk on sk.id = ts.skill_id
      where ts.tenant_id = v_tenant_id and sk.status = 'beta'
    ),
    'pending_reviews', (
      select count(*)::int from public.tenant_skills ts
      join public.skills sk on sk.id = ts.skill_id
      where ts.tenant_id = v_tenant_id
        and sk.requires_approval = true
        and ts.status = 'installed'
    )
  ) into v_overview;

  select coalesce(jsonb_agg(row order by row ->> 'name'), '[]'::jsonb) into v_installed
  from (
    select jsonb_build_object(
      'tenant_skill_id', ts.id,
      'key', sk.key,
      'name', sk.name,
      'description', sk.description,
      'display_status', public._sme_display_status(sk.status, ts.status),
      'version', ts.version,
      'environment', case when sk.status = 'beta' then 'testing' else 'production' end,
      'owner', coalesce(sk.author, 'Aipify'),
      'category', public._sme_marketplace_category(sk.category),
      'release_stage', public._sme_release_stage(sk.status),
      'success_rate', public.compute_skill_success_score(ts.id),
      'health_score', coalesce(sh.health_score, 100)
    ) as row
    from public.tenant_skills ts
    join public.skills sk on sk.id = ts.skill_id
    left join public.skill_health sh on sh.tenant_skill_id = ts.id
    where ts.tenant_id = v_tenant_id and ts.status not in ('disabled', 'archived')
    order by sk.name
  ) i;

  select coalesce(jsonb_agg(row order by row ->> 'name'), '[]'::jsonb) into v_marketplace
  from (
    select jsonb_build_object(
      'key', sk.key,
      'name', sk.name,
      'description', sk.description,
      'category', public._sme_marketplace_category(sk.category),
      'operational_status', sk.status,
      'estimated_value_key', public._sme_recommendation_keys(sk.category) ->> 'impact_key',
      'activation_method', public._sme_activation_method(
        exists (select 1 from public.tenant_skills ts where ts.tenant_id = v_tenant_id and ts.skill_id = sk.id and ts.status not in ('disabled')),
        public._ss_plan_allows(v_plan, sk.minimum_plan),
        sk.requires_approval,
        sk.status
      ),
      'release_stage', public._sme_release_stage(sk.status),
      'minimum_plan', sk.minimum_plan,
      'requires_approval', sk.requires_approval,
      'installed', exists (
        select 1 from public.tenant_skills ts
        where ts.tenant_id = v_tenant_id and ts.skill_id = sk.id and ts.status not in ('disabled')
      ),
      'plan_allowed', public._ss_plan_allows(v_plan, sk.minimum_plan)
    ) as row
    from public.skills sk
    where sk.status in ('active', 'beta', 'planned')
    order by sk.category, sk.name
  ) m;

  select coalesce(jsonb_agg(row), '[]'::jsonb) into v_recommended
  from (
    select jsonb_build_object(
      'key', sk.key,
      'name', sk.name,
      'description', sk.description,
      'category', public._sme_marketplace_category(sk.category),
      'reason_key', public._sme_recommendation_keys(sk.category) ->> 'reason_key',
      'impact_key', public._sme_recommendation_keys(sk.category) ->> 'impact_key',
      'activation_method', public._sme_activation_method(
        false,
        public._ss_plan_allows(v_plan, sk.minimum_plan),
        sk.requires_approval,
        sk.status
      ),
      'plan_allowed', public._ss_plan_allows(v_plan, sk.minimum_plan)
    ) as row
    from public.skills sk
    where sk.status in ('active', 'beta')
      and public._ss_plan_allows(v_plan, sk.minimum_plan)
      and not exists (
        select 1 from public.tenant_skills ts
        where ts.tenant_id = v_tenant_id and ts.skill_id = sk.id and ts.status not in ('disabled')
      )
    order by case sk.category
      when 'Executive' then 1 when 'Support' then 2 when 'Operational' then 3
      when 'Knowledge' then 4 else 5 end, sk.name
    limit 4
  ) r;

  select coalesce(jsonb_agg(row), '[]'::jsonb) into v_governance
  from (
    select jsonb_build_object(
      'key', sk.key,
      'name', sk.name,
      'tenant_skill_id', ts.id,
      'permission_scope', coalesce(sk.required_permissions::text, '[]'),
      'risk_level', sk.risk_level,
      'owner', coalesce(sk.author, 'Aipify'),
      'requires_approval', sk.requires_approval,
      'last_review_at', ts.updated_at,
      'status', case when ts.status = 'installed' and sk.requires_approval then 'pending_approval' else 'under_review' end,
      'unapproved_permissions', (
        select count(*)::int from public.skill_permissions sp
        where sp.tenant_skill_id = ts.id and sp.approved = false
      )
    ) as row
    from public.tenant_skills ts
    join public.skills sk on sk.id = ts.skill_id
    where ts.tenant_id = v_tenant_id
      and (sk.requires_approval = true or sk.risk_level in ('high', 'medium')
        or exists (select 1 from public.skill_permissions sp where sp.tenant_skill_id = ts.id and sp.approved = false))
    order by sk.risk_level desc, sk.name
    limit 8
  ) g;

  select coalesce(jsonb_agg(row order by (row ->> 'success_rate')::numeric desc), '[]'::jsonb) into v_performance
  from (
    select jsonb_build_object(
      'key', sk.key,
      'name', sk.name,
      'tenant_skill_id', ts.id,
      'success_rate', public.compute_skill_success_score(ts.id),
      'usage_frequency', (
        select count(*)::int from public.skill_audit_logs sal
        where sal.tenant_skill_id = ts.id and sal.created_at > now() - interval '7 days'
      ),
      'business_impact_key', public._sme_recommendation_keys(sk.category) ->> 'impact_key',
      'avg_execution_ms', 0,
      'satisfaction_score', least(5, round(public.compute_skill_success_score(ts.id) / 20.0, 1))
    ) as row
    from public.tenant_skills ts
    join public.skills sk on sk.id = ts.skill_id
    where ts.tenant_id = v_tenant_id and ts.status in ('active', 'installed', 'paused', 'warning')
    order by public.compute_skill_success_score(ts.id) desc
    limit 8
  ) p;

  return jsonb_build_object(
    'scope', 'customer',
    'tenant_id', v_tenant_id,
    'plan', v_plan,
    'overview', v_overview,
    'installed_skills', v_installed,
    'recommended_skills', v_recommended,
    'marketplace', v_marketplace,
    'pipeline', v_pipeline,
    'governance', v_governance,
    'performance', v_performance,
    'principle', 'Skills are business capabilities — expand what your organization can do.'
  );
end;
$$;

grant execute on function public.get_skills_marketplace_experience(text) to authenticated;
