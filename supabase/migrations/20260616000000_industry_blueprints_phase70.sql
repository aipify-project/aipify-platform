-- Phase 70 — Industry Blueprints & Vertical Operating Models

-- ---------------------------------------------------------------------------
-- 1. industry_blueprints
-- ---------------------------------------------------------------------------
create table if not exists public.industry_blueprints (
  id uuid primary key default gen_random_uuid(),
  blueprint_key text not null unique,
  title text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  industry_category text not null,
  business_size_fit text[] not null default '{}',
  supported_deployment_modes text[] not null default '{cloud_saas}',
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high')),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'deprecated', 'archived')
  ),
  version text not null default '1.0.0',
  blueprint_manifest jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists industry_blueprints_status_idx
  on public.industry_blueprints (status, industry_category);

alter table public.industry_blueprints enable row level security;
revoke all on public.industry_blueprints from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. blueprint_versions
-- ---------------------------------------------------------------------------
create table if not exists public.blueprint_versions (
  id uuid primary key default gen_random_uuid(),
  blueprint_id uuid not null references public.industry_blueprints (id) on delete cascade,
  version text not null,
  changelog text,
  manifest jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('draft', 'published', 'deprecated')),
  created_at timestamptz not null default now(),
  unique (blueprint_id, version)
);

alter table public.blueprint_versions enable row level security;
revoke all on public.blueprint_versions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. tenant_industry_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_industry_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  selected_blueprint_id uuid references public.industry_blueprints (id) on delete set null,
  industry_category text,
  business_model text,
  business_size text,
  primary_goals text[] not null default '{}',
  selected_at timestamptz,
  selected_by_user_id uuid references public.users (id) on delete set null,
  confidence_score numeric,
  discovery_answers jsonb not null default '{}'::jsonb,
  auto_recommend_packs boolean not null default true,
  notify_new_packs boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tenant_industry_profiles enable row level security;
revoke all on public.tenant_industry_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. blueprint_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.blueprint_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  blueprint_id uuid not null references public.industry_blueprints (id) on delete cascade,
  recommendation_type text not null,
  title text not null,
  summary text,
  reason text,
  priority int not null default 0,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high')),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected', 'applied', 'dismissed')
  ),
  target_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blueprint_recommendations_tenant_idx
  on public.blueprint_recommendations (tenant_id, status, priority desc);

alter table public.blueprint_recommendations enable row level security;
revoke all on public.blueprint_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. tenant_blueprint_installs
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_blueprint_installs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  blueprint_id uuid not null references public.industry_blueprints (id) on delete cascade,
  version text not null,
  status text not null default 'pending' check (
    status in ('pending', 'applying', 'applied', 'partially_applied', 'failed', 'rolled_back', 'archived')
  ),
  applied_by_user_id uuid references public.users (id) on delete set null,
  applied_at timestamptz,
  install_summary text,
  installed_items jsonb not null default '{}'::jsonb,
  failed_items jsonb not null default '{}'::jsonb,
  approval_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tenant_blueprint_installs_tenant_idx
  on public.tenant_blueprint_installs (tenant_id, created_at desc);

alter table public.tenant_blueprint_installs enable row level security;
revoke all on public.tenant_blueprint_installs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. blueprint_install_events
-- ---------------------------------------------------------------------------
create table if not exists public.blueprint_install_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  blueprint_id uuid not null references public.industry_blueprints (id) on delete cascade,
  install_id uuid references public.tenant_blueprint_installs (id) on delete set null,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists blueprint_install_events_tenant_idx
  on public.blueprint_install_events (tenant_id, created_at desc);

alter table public.blueprint_install_events enable row level security;
revoke all on public.blueprint_install_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers (_ibp_)
-- ---------------------------------------------------------------------------
create or replace function public._ibp_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ibp_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._ibp_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._ibp_log_event(
  p_tenant_id uuid, p_blueprint_id uuid, p_install_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.blueprint_install_events (
    tenant_id, blueprint_id, install_id, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_blueprint_id, p_install_id, p_event_type, p_summary,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._ibp_auth_user_id())
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'blueprint_' || p_event_type, 'industry_blueprints', 'logged', p_user_id, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._ibp_blueprint_json(p_bp public.industry_blueprints)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_bp.id, 'blueprint_key', p_bp.blueprint_key, 'slug', p_bp.slug,
    'title', p_bp.title, 'short_description', p_bp.short_description,
    'industry_category', p_bp.industry_category, 'risk_level', p_bp.risk_level,
    'version', p_bp.version, 'business_size_fit', p_bp.business_size_fit,
    'supported_deployment_modes', p_bp.supported_deployment_modes
  );
$$;

create or replace function public._ibp_ensure_profile(p_tenant_id uuid)
returns public.tenant_industry_profiles language plpgsql security definer set search_path = public as $$
declare v_row public.tenant_industry_profiles;
begin
  insert into public.tenant_industry_profiles (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.tenant_industry_profiles where tenant_id = p_tenant_id;
  return v_row;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Seed official blueprints
-- ---------------------------------------------------------------------------
create or replace function public._ibp_seed_blueprints()
returns void language plpgsql security definer set search_path = public as $$
declare v_bp public.industry_blueprints;
begin
  perform public._mkp_seed_catalog();

  insert into public.industry_blueprints (
    blueprint_key, slug, title, short_description, long_description, industry_category,
    business_size_fit, supported_deployment_modes, risk_level, status, version, blueprint_manifest
  ) values
    ('aipify.industry.ecommerce', 'ecommerce', 'E-commerce',
     'Online store setup with support, quality monitoring, and order workflows.',
     'Recommended operating model for e-commerce: Support AI, product image Quality Guardian, order follow-up workflows, return/refund FAQ, and daily sales/support briefing.',
     'ecommerce', '{solo,small,medium}', '{cloud_saas,hybrid}', 'medium', 'published', '1.0.0',
     '{"recommended_skills":["support-assistant","knowledge-center","quality-guardian","image-guardian","executive-briefing","approval-center"],"recommended_marketplace_items":["aipify.support_starter_pack","aipify.website_quality_pack"],"recommended_workflows":["order_followup","return_request","delayed_delivery"],"knowledge_categories":["orders","shipping","returns"],"quality_checks":["product_image_size","checkout_link_health"],"governance":{"external_customer_email":"approval_required"}}'::jsonb),
    ('aipify.industry.restaurant', 'restaurant-hospitality', 'Restaurant / Hospitality',
     'Booking, menu, hours support with local SEO quality checks.',
     'Operating model for restaurants and hospitality: booking FAQ, opening hours support, menu update workflow, review response templates, and daily booking brief.',
     'restaurant_hospitality', '{solo,small,medium}', '{cloud_saas,hybrid}', 'low', 'published', '1.0.0',
     '{"recommended_skills":["support-assistant","knowledge-center","desktop-companion","quality-guardian","executive-briefing"],"recommended_marketplace_items":["aipify.support_starter_pack","aipify.desktop_companion_pack"],"recommended_workflows":["booking_question","menu_update","review_response"],"knowledge_categories":["booking","menu","hours"],"quality_checks":["booking_link","mobile_homepage"]}'::jsonb),
    ('aipify.industry.agency', 'agency-consulting', 'Agency / Consulting',
     'Client onboarding, project follow-up, and proposal templates.',
     'Operating model for agencies: client onboarding, project follow-up workflows, proposal templates, and monthly client value reports.',
     'agency_consulting', '{solo,small,medium}', '{cloud_saas,hybrid}', 'low', 'published', '1.0.0',
     '{"recommended_skills":["knowledge-center","executive-briefing","memory-engine","desktop-companion"],"recommended_marketplace_items":["aipify.executive_briefing_pack","aipify.memory_learning_pack"],"recommended_workflows":["client_onboarding","proposal_followup","monthly_report"]}'::jsonb),
    ('aipify.industry.saas', 'saas-company', 'SaaS Company',
     'Product support, quality monitoring, and automation suggestions.',
     'Operating model for SaaS: Support AI, Quality Guardian, automation suggestions, approval center, and learning feedback loop.',
     'saas', '{small,medium,enterprise}', '{cloud_saas,hybrid}', 'medium', 'published', '1.0.0',
     '{"recommended_skills":["support-assistant","knowledge-center","quality-guardian","approval-center","executive-briefing","memory-engine"],"recommended_marketplace_items":["aipify.support_starter_pack","aipify.website_quality_pack","aipify.governance_starter_pack"],"recommended_workflows":["onboarding","bug_report","feature_request","support_escalation"]}'::jsonb),
    ('aipify.industry.law_firm', 'law-firm', 'Law Firm',
     'High privacy governance with internal knowledge and strict approvals.',
     'Operating model for law firms: Knowledge Center, strict governance, compliance defaults, and restricted external AI actions.',
     'law_firm', '{solo,small,medium}', '{cloud_saas,hybrid,on_premise}', 'high', 'published', '1.0.0',
     '{"recommended_skills":["knowledge-center","approval-center","desktop-companion"],"recommended_marketplace_items":["aipify.governance_starter_pack","aipify.security_compliance_starter_pack","aipify.knowledge_center_starter_pack"],"recommended_workflows":["client_intake","document_request","deadline_reminder"],"governance":{"external_customer_email":"approval_required","strict_audit":true}}'::jsonb),
    ('aipify.industry.education', 'education-school', 'Education / School',
     'Student/parent FAQ, policy lookup, and privacy-strict governance.',
     'Operating model for schools: Knowledge Center, Support AI, compliance defaults, and privacy-strict governance for student data.',
     'education', '{small,medium,enterprise}', '{cloud_saas,hybrid}', 'medium', 'published', '1.0.0',
     '{"recommended_skills":["knowledge-center","support-assistant","approval-center"],"recommended_marketplace_items":["aipify.knowledge_center_starter_pack","aipify.security_compliance_starter_pack"],"recommended_workflows":["parent_faq","policy_lookup","it_help_request"],"governance":{"student_data":"restricted"}}'::jsonb),
    ('aipify.industry.municipality', 'municipality-public-sector', 'Municipality / Public Sector',
     'Hybrid deployment, compliance, intranet quality, and case routing.',
     'Operating model for public sector: Knowledge Center, compliance, enterprise deployment, intranet quality checks, and strict audit.',
     'municipality', '{medium,enterprise}', '{hybrid,on_premise}', 'high', 'published', '1.0.0',
     '{"recommended_skills":["knowledge-center","approval-center","quality-guardian"],"recommended_marketplace_items":["aipify.security_compliance_starter_pack","aipify.governance_starter_pack"],"recommended_workflows":["citizen_inquiry","policy_lookup","data_access_request"],"deployment_note":"hybrid_or_on_premise_recommended"}'::jsonb),
    ('aipify.industry.local_service', 'local-service-business', 'Local Service Business',
     'Booking, pricing, service area support with follow-up reminders.',
     'Operating model for local service businesses: Support AI, booking workflows, price questions, follow-up reminders, and quality checks.',
     'local_service', '{solo,small}', '{cloud_saas,hybrid}', 'low', 'published', '1.0.0',
     '{"recommended_skills":["support-assistant","knowledge-center","desktop-companion","quality-guardian","executive-briefing"],"recommended_marketplace_items":["aipify.support_starter_pack","aipify.desktop_companion_pack"],"recommended_workflows":["booking_request","price_question","follow_up_reminder"]}'::jsonb)
  on conflict (blueprint_key) do update set
    title = excluded.title, short_description = excluded.short_description,
    long_description = excluded.long_description, blueprint_manifest = excluded.blueprint_manifest,
    status = excluded.status, updated_at = now();

  for v_bp in select * from public.industry_blueprints where status = 'published'
  loop
    insert into public.blueprint_versions (blueprint_id, version, changelog, manifest, status)
    values (v_bp.id, v_bp.version, 'Initial official release', v_bp.blueprint_manifest, 'published')
    on conflict (blueprint_id, version) do nothing;
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Recommendation engine
-- ---------------------------------------------------------------------------
create or replace function public.generate_blueprint_recommendations(p_blueprint_key text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile public.tenant_industry_profiles;
  v_bp public.industry_blueprints;
  v_skill text;
  v_item text;
  v_workflow text;
  v_count int := 0;
  v_priority int;
begin
  v_tenant_id := public._ibp_require_tenant();
  perform public._ibp_seed_blueprints();
  v_profile := public._ibp_ensure_profile(v_tenant_id);

  if p_blueprint_key is not null then
    select * into v_bp from public.industry_blueprints
    where (blueprint_key = p_blueprint_key or slug = p_blueprint_key) and status = 'published';
  elsif v_profile.selected_blueprint_id is not null then
    select * into v_bp from public.industry_blueprints where id = v_profile.selected_blueprint_id;
  end if;

  if v_bp.id is null then
    return jsonb_build_object('generated', 0, 'reason', 'no_blueprint_selected');
  end if;

  update public.tenant_industry_profiles set
    selected_blueprint_id = v_bp.id, industry_category = v_bp.industry_category,
    selected_at = coalesce(selected_at, now()), updated_at = now()
  where tenant_id = v_tenant_id;

  delete from public.blueprint_recommendations
  where tenant_id = v_tenant_id and blueprint_id = v_bp.id and status = 'pending';

  v_priority := 100;
  for v_skill in select jsonb_array_elements_text(v_bp.blueprint_manifest->'recommended_skills')
  loop
    if not exists(select 1 from public.tenant_skills ts join public.skills s on s.id = ts.skill_id
                  where ts.tenant_id = v_tenant_id and s.key = v_skill and ts.status in ('installed','active')) then
      insert into public.blueprint_recommendations (
        tenant_id, blueprint_id, recommendation_type, title, summary, reason, priority, risk_level, target_ref, metadata
      ) values (
        v_tenant_id, v_bp.id, 'skill', 'Install Skill: ' || v_skill,
        'Recommended by ' || v_bp.title || ' blueprint',
        'Industry blueprint recommends this capability for your business type',
        v_priority, 'low', v_skill, jsonb_build_object('skill_key', v_skill)
      );
      v_count := v_count + 1;
    end if;
    v_priority := v_priority - 5;
  end loop;

  v_priority := 90;
  for v_item in select jsonb_array_elements_text(v_bp.blueprint_manifest->'recommended_marketplace_items')
  loop
    if not exists(select 1 from public.tenant_marketplace_installs ti
                  join public.marketplace_items mi on mi.id = ti.item_id
                  where ti.tenant_id = v_tenant_id and mi.item_key = v_item
                    and ti.status not in ('uninstalled','failed')) then
      insert into public.blueprint_recommendations (
        tenant_id, blueprint_id, recommendation_type, title, summary, reason, priority, risk_level, target_ref, metadata
      ) values (
        v_tenant_id, v_bp.id, 'marketplace_item', 'Install Pack: ' || v_item,
        'Marketplace pack recommended for ' || v_bp.industry_category,
        'Bundled templates, skills, and knowledge for your industry',
        v_priority, 'medium', v_item, jsonb_build_object('item_key', v_item)
      );
      v_count := v_count + 1;
    end if;
    v_priority := v_priority - 5;
  end loop;

  v_priority := 70;
  for v_workflow in select jsonb_array_elements_text(v_bp.blueprint_manifest->'recommended_workflows')
  loop
    if not exists(
      select 1 from public.blueprint_recommendations
      where tenant_id = v_tenant_id and blueprint_id = v_bp.id
        and recommendation_type = 'workflow' and target_ref = v_workflow
        and status not in ('rejected', 'dismissed')
    ) then
      insert into public.blueprint_recommendations (
        tenant_id, blueprint_id, recommendation_type, title, summary, reason, priority, risk_level, target_ref
      ) values (
        v_tenant_id, v_bp.id, 'workflow', 'Enable workflow: ' || replace(v_workflow, '_', ' '),
        'Industry workflow template', 'Common workflow for ' || v_bp.industry_category,
        v_priority, 'low', v_workflow
      );
      v_count := v_count + 1;
    end if;
    v_priority := v_priority - 3;
  end loop;

  perform public._ibp_log_event(v_tenant_id, v_bp.id, null, 'recommendation_created',
    v_count || ' recommendations generated', jsonb_build_object('count', v_count));

  return jsonb_build_object('generated', v_count, 'blueprint_key', v_bp.blueprint_key);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Apply blueprint
-- ---------------------------------------------------------------------------
create or replace function public.precheck_blueprint_apply(p_blueprint_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_bp public.industry_blueprints;
  v_mode text;
  v_policy jsonb;
begin
  v_tenant_id := public._ibp_require_tenant();
  perform public._ibp_seed_blueprints();

  select * into v_bp from public.industry_blueprints
  where (blueprint_key = p_blueprint_key or slug = p_blueprint_key) and status = 'published';
  if v_bp.id is null then return jsonb_build_object('allowed', false, 'reason', 'blueprint_not_found'); end if;

  v_mode := coalesce(
    (select deployment_mode from public.tenant_deployment_settings where tenant_id = v_tenant_id),
    'cloud_saas'
  );
  if not (v_mode = any(v_bp.supported_deployment_modes)) then
    return jsonb_build_object('allowed', false, 'reason', 'deployment_incompatible', 'deployment_mode', v_mode);
  end if;

  v_policy := public.evaluate_policy(jsonb_build_object(
    'action_key', 'blueprint_apply',
    'resource_type', 'industry_blueprints',
    'resource_id', v_bp.blueprint_key,
    'actor_type', 'user',
    'data_classification', case v_bp.risk_level when 'high' then 'confidential' else 'internal' end,
    'context', jsonb_build_object('risk_level', v_bp.risk_level)
  ));

  return jsonb_build_object(
    'allowed', coalesce((v_policy->>'allow')::boolean, false) and not coalesce((v_policy->>'blocked')::boolean, false),
    'requires_approval', v_bp.risk_level in ('medium', 'high') or coalesce((v_policy->>'requires_approval')::boolean, false),
    'blueprint', public._ibp_blueprint_json(v_bp),
    'policy', v_policy,
    'pending_recommendations', (select count(*) from public.blueprint_recommendations
      where tenant_id = v_tenant_id and blueprint_id = v_bp.id and status in ('pending','accepted'))
  );
end; $$;

create or replace function public.apply_industry_blueprint(
  p_blueprint_key text, p_approve boolean default false, p_recommendation_ids uuid[] default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_bp public.industry_blueprints;
  v_precheck jsonb;
  v_install_id uuid;
  v_rec public.blueprint_recommendations;
  v_result jsonb;
  v_installed jsonb := '[]'::jsonb;
  v_failed jsonb := '[]'::jsonb;
  v_applied int := 0;
begin
  v_tenant_id := public._ibp_require_tenant();
  v_user_id := public._ibp_auth_user_id();
  perform public._ibp_require_admin();

  v_precheck := public.precheck_blueprint_apply(p_blueprint_key);
  if (v_precheck->>'requires_approval')::boolean and not p_approve then
    return jsonb_build_object('status', 'approval_required', 'precheck', v_precheck);
  end if;
  if not coalesce((v_precheck->>'allowed')::boolean, false) then
    return jsonb_build_object('status', 'precheck_failed', 'precheck', v_precheck);
  end if;

  select * into v_bp from public.industry_blueprints
  where blueprint_key = p_blueprint_key or slug = p_blueprint_key;

  perform public.generate_blueprint_recommendations(p_blueprint_key);

  insert into public.tenant_blueprint_installs (
    tenant_id, blueprint_id, version, status, applied_by_user_id
  ) values (v_tenant_id, v_bp.id, v_bp.version, 'applying', v_user_id)
  returning id into v_install_id;

  perform public._ibp_log_event(v_tenant_id, v_bp.id, v_install_id, 'install_started', 'Applying blueprint', '{}'::jsonb, v_user_id);

  for v_rec in
    select * from public.blueprint_recommendations
    where tenant_id = v_tenant_id and blueprint_id = v_bp.id
      and status in ('pending', 'accepted')
      and (p_recommendation_ids is null or id = any(p_recommendation_ids))
      and recommendation_type in ('skill', 'marketplace_item')
    order by priority desc
  loop
    begin
      if v_rec.recommendation_type = 'skill' then
        v_result := public.install_tenant_skill(v_rec.target_ref, p_approve or v_rec.risk_level = 'low');
      elsif v_rec.recommendation_type = 'marketplace_item' then
        v_result := public.install_marketplace_item(v_rec.target_ref, p_approve or v_rec.risk_level = 'low');
      end if;
      update public.blueprint_recommendations set status = 'applied', updated_at = now() where id = v_rec.id;
      v_installed := v_installed || jsonb_build_array(jsonb_build_object('id', v_rec.id, 'result', v_result));
      v_applied := v_applied + 1;
    exception when others then
      v_failed := v_failed || jsonb_build_array(jsonb_build_object('id', v_rec.id, 'error', sqlerrm));
    end;
  end loop;

  update public.tenant_blueprint_installs set
    status = case when jsonb_array_length(v_failed) > 0 then 'partially_applied' else 'applied' end,
    applied_at = now(), install_summary = v_applied || ' items applied',
    installed_items = v_installed, failed_items = v_failed, updated_at = now()
  where id = v_install_id;

  update public.tenant_industry_profiles set
    selected_blueprint_id = v_bp.id, industry_category = v_bp.industry_category,
    selected_at = now(), selected_by_user_id = v_user_id, updated_at = now()
  where tenant_id = v_tenant_id;

  perform public._ibp_log_event(v_tenant_id, v_bp.id, v_install_id, 'install_completed',
    v_applied || ' recommendations applied', jsonb_build_object('applied', v_applied), v_user_id);

  begin
    perform public.emit_orchestration_event(jsonb_build_object(
      'source_module', 'industry_blueprints', 'source_type', 'blueprint_apply',
      'source_id', v_install_id::text, 'event_type', 'blueprint.applied',
      'severity', 'info', 'payload', jsonb_build_object('blueprint_key', v_bp.blueprint_key)
    ));
  exception when others then null;
  end;

  return jsonb_build_object(
    'status', case when jsonb_array_length(v_failed) > 0 then 'partially_applied' else 'applied' end,
    'install_id', v_install_id, 'applied', v_applied, 'installed', v_installed, 'failed', v_failed
  );
end; $$;

create or replace function public.update_blueprint_recommendation(p_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ibp_require_tenant();
  perform public._ibp_require_admin();
  update public.blueprint_recommendations set status = p_status, updated_at = now()
  where id = p_id and tenant_id = v_tenant_id
    and p_status in ('accepted', 'rejected', 'dismissed');
  return jsonb_build_object('updated', true, 'status', p_status);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Completeness score
-- ---------------------------------------------------------------------------
create or replace function public.get_blueprint_completeness_score()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile public.tenant_industry_profiles;
  v_bp public.industry_blueprints;
  v_total int := 0;
  v_applied int := 0;
  v_score numeric;
begin
  v_tenant_id := public._ibp_require_tenant();
  select * into v_profile from public.tenant_industry_profiles where tenant_id = v_tenant_id;
  if v_profile.selected_blueprint_id is null then
    return jsonb_build_object('has_blueprint', false, 'score', 0, 'message', 'No industry blueprint selected');
  end if;

  select * into v_bp from public.industry_blueprints where id = v_profile.selected_blueprint_id;
  select count(*) into v_total from public.blueprint_recommendations
  where tenant_id = v_tenant_id and blueprint_id = v_bp.id
    and recommendation_type in ('skill', 'marketplace_item');
  select count(*) into v_applied from public.blueprint_recommendations
  where tenant_id = v_tenant_id and blueprint_id = v_bp.id and status = 'applied';

  v_score := case when v_total = 0 then 100 else round((v_applied::numeric / v_total) * 100, 1) end;

  return jsonb_build_object(
    'has_blueprint', true,
    'blueprint', public._ibp_blueprint_json(v_bp),
    'score', v_score,
    'total_recommendations', v_total,
    'applied_count', v_applied,
    'pending_count', v_total - v_applied
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_industry_blueprint_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_completeness jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._ibp_seed_blueprints();
  v_completeness := public.get_blueprint_completeness_score();
  return jsonb_build_object(
    'has_customer', true,
    'completeness_score', v_completeness->'score',
    'has_blueprint', coalesce((v_completeness->>'has_blueprint')::boolean, false),
    'blueprint_title', v_completeness->'blueprint'->>'title',
    'philosophy', 'Tell Aipify your industry — get a recommended operating model, not a blank setup.',
    'privacy_note', 'Blueprints recommend; you review and approve before anything is applied.'
  );
end; $$;

create or replace function public.get_industry_blueprints_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile public.tenant_industry_profiles;
  v_completeness jsonb;
  v_recs jsonb;
  v_applied jsonb;
begin
  v_tenant_id := public._ibp_require_tenant();
  perform public._ibp_seed_blueprints();
  v_profile := public._ibp_ensure_profile(v_tenant_id);
  v_completeness := public.get_blueprint_completeness_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_type', r.recommendation_type, 'title', r.title,
    'summary', r.summary, 'reason', r.reason, 'priority', r.priority,
    'risk_level', r.risk_level, 'status', r.status, 'target_ref', r.target_ref
  ) order by r.priority desc), '[]'::jsonb) into v_recs
  from public.blueprint_recommendations r
  where r.tenant_id = v_tenant_id and r.status in ('pending', 'accepted')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'status', i.status, 'applied_at', i.applied_at,
    'blueprint', public._ibp_blueprint_json(b)
  ) order by i.applied_at desc nulls last), '[]'::jsonb) into v_applied
  from public.tenant_blueprint_installs i
  join public.industry_blueprints b on b.id = i.blueprint_id
  where i.tenant_id = v_tenant_id and i.status in ('applied', 'partially_applied')
  limit 5;

  return jsonb_build_object(
    'has_customer', true,
    'profile', row_to_json(v_profile)::jsonb,
    'completeness', v_completeness,
    'pending_recommendations', v_recs,
    'applied_installs', v_applied
  );
end; $$;

create or replace function public.list_industry_blueprints(
  p_industry text default null, p_size text default null, p_limit int default 50
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ibp_seed_blueprints();
  return jsonb_build_object('blueprints',
    coalesce((
      select jsonb_agg(public._ibp_blueprint_json(b) order by b.title)
      from public.industry_blueprints b
      where b.status = 'published'
        and (p_industry is null or b.industry_category = p_industry)
        and (p_size is null or p_size = any(b.business_size_fit))
      limit coalesce(p_limit, 50)
    ), '[]'::jsonb));
end; $$;

create or replace function public.get_industry_blueprint(p_blueprint_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_bp public.industry_blueprints; v_versions jsonb;
begin
  perform public._ibp_seed_blueprints();
  select * into v_bp from public.industry_blueprints
  where (blueprint_key = p_blueprint_key or slug = p_blueprint_key) and status = 'published';
  if v_bp.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(row_to_json(v)::jsonb), '[]'::jsonb) into v_versions
  from public.blueprint_versions v where v.blueprint_id = v_bp.id;

  return jsonb_build_object(
    'blueprint', row_to_json(v_bp)::jsonb,
    'versions', v_versions,
    'precheck', public.precheck_blueprint_apply(v_bp.blueprint_key)
  );
end; $$;

create or replace function public.get_tenant_industry_profile()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_profile public.tenant_industry_profiles; v_bp jsonb;
begin
  v_tenant_id := public._ibp_require_tenant();
  v_profile := public._ibp_ensure_profile(v_tenant_id);
  if v_profile.selected_blueprint_id is not null then
    select public._ibp_blueprint_json(b) into v_bp from public.industry_blueprints b where b.id = v_profile.selected_blueprint_id;
  end if;
  return jsonb_build_object('has_customer', true, 'profile', row_to_json(v_profile)::jsonb, 'blueprint', v_bp);
end; $$;

create or replace function public.update_tenant_industry_profile(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_bp_id uuid;
begin
  v_tenant_id := public._ibp_require_tenant();
  v_user_id := public._ibp_auth_user_id();
  perform public._ibp_ensure_profile(v_tenant_id);

  if p_patch ? 'blueprint_key' then
    select id into v_bp_id from public.industry_blueprints
    where blueprint_key = p_patch->>'blueprint_key' or slug = p_patch->>'blueprint_key';
  elsif p_patch ? 'selected_blueprint_id' then
    v_bp_id := (p_patch->>'selected_blueprint_id')::uuid;
  end if;

  update public.tenant_industry_profiles set
    selected_blueprint_id = coalesce(v_bp_id, selected_blueprint_id),
    industry_category = coalesce(p_patch->>'industry_category', industry_category),
    business_model = coalesce(p_patch->>'business_model', business_model),
    business_size = coalesce(p_patch->>'business_size', business_size),
    primary_goals = coalesce(
      (select array_agg(x) from jsonb_array_elements_text(p_patch->'primary_goals') x),
      primary_goals
    ),
    discovery_answers = coalesce(p_patch->'discovery_answers', discovery_answers),
    auto_recommend_packs = coalesce((p_patch->>'auto_recommend_packs')::boolean, auto_recommend_packs),
    notify_new_packs = coalesce((p_patch->>'notify_new_packs')::boolean, notify_new_packs),
    selected_at = case when v_bp_id is not null then now() else selected_at end,
    selected_by_user_id = case when v_bp_id is not null then v_user_id else selected_by_user_id end,
    updated_at = now()
  where tenant_id = v_tenant_id;

  if v_bp_id is not null then
    perform public.generate_blueprint_recommendations(
      (select blueprint_key from public.industry_blueprints where id = v_bp_id)
    );
  end if;

  return public.get_tenant_industry_profile();
end; $$;

create or replace function public.list_blueprint_recommendations(p_status text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ibp_require_tenant();
  return jsonb_build_object('recommendations',
    coalesce((
      select jsonb_agg(row_to_json(r)::jsonb order by r.priority desc)
      from public.blueprint_recommendations r
      where r.tenant_id = v_tenant_id and (p_status is null or r.status = p_status)
    ), '[]'::jsonb));
end; $$;

create or replace function public.list_blueprint_applied()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ibp_require_tenant();
  return jsonb_build_object('installs',
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'status', i.status, 'applied_at', i.applied_at,
        'install_summary', i.install_summary, 'installed_items', i.installed_items,
        'blueprint', public._ibp_blueprint_json(b)
      ) order by i.applied_at desc nulls last)
      from public.tenant_blueprint_installs i
      join public.industry_blueprints b on b.id = i.blueprint_id
      where i.tenant_id = v_tenant_id
    ), '[]'::jsonb));
end; $$;

-- ---------------------------------------------------------------------------
-- 13. KC category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'industry-blueprints', 'Industry Blueprints', 'Vertical operating models and industry setup guides.', 'authenticated', 15
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'industry-blueprints' and tenant_id is null);

select public._ibp_seed_blueprints();

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.generate_blueprint_recommendations(text) to authenticated;
grant execute on function public.precheck_blueprint_apply(text) to authenticated;
grant execute on function public.apply_industry_blueprint(text, boolean, uuid[]) to authenticated;
grant execute on function public.update_blueprint_recommendation(uuid, text) to authenticated;
grant execute on function public.get_blueprint_completeness_score() to authenticated;
grant execute on function public.get_industry_blueprint_card() to authenticated;
grant execute on function public.get_industry_blueprints_dashboard() to authenticated;
grant execute on function public.list_industry_blueprints(text, text, int) to authenticated;
grant execute on function public.get_industry_blueprint(text) to authenticated;
grant execute on function public.get_tenant_industry_profile() to authenticated;
grant execute on function public.update_tenant_industry_profile(jsonb) to authenticated;
grant execute on function public.list_blueprint_recommendations(text) to authenticated;
grant execute on function public.list_blueprint_applied() to authenticated;
