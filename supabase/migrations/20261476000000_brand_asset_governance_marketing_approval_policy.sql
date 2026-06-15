-- Brand Asset Governance & Marketing Approval Policy

-- ---------------------------------------------------------------------------
-- 1. Extend asset approval statuses
-- ---------------------------------------------------------------------------
alter table public.growth_partner_marketing_assets drop constraint if exists growth_partner_marketing_assets_status_check;

alter table public.growth_partner_marketing_assets add constraint growth_partner_marketing_assets_status_check check (
  status in ('draft', 'under_review', 'approved', 'published', 'archived')
);

-- ---------------------------------------------------------------------------
-- 2. Marketing requests
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_type text not null check (
    request_type in (
      'local_campaign', 'industry_campaign', 'language_adaptation',
      'event_materials', 'presentation_concept', 'customer_collateral'
    )
  ),
  title text not null,
  description text not null default '',
  workflow_stage text not null default 'submitted' check (
    workflow_stage in (
      'submitted', 'brand_review', 'design_production',
      'legal_review', 'approved', 'published'
    )
  ),
  language text not null default 'en' check (language in ('en', 'no', 'sv', 'da')),
  industry text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_marketing_requests_tenant_idx
  on public.growth_partner_marketing_requests (tenant_id, workflow_stage);

alter table public.growth_partner_marketing_requests enable row level security;
revoke all on public.growth_partner_marketing_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Policy sections
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_policy_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  content text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_marketing_policy_sections enable row level security;
revoke all on public.growth_partner_marketing_policy_sections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Expand audit events
-- ---------------------------------------------------------------------------
alter table public.growth_partner_marketing_audit_logs drop constraint if exists growth_partner_marketing_audit_logs_event_type_check;

alter table public.growth_partner_marketing_audit_logs add constraint growth_partner_marketing_audit_logs_event_type_check check (
  event_type in (
    'asset_uploaded', 'asset_downloaded', 'campaign_published', 'campaign_archived',
    'brand_guideline_updated', 'asset_archived', 'request_submitted', 'request_advanced',
    'request_approved', 'request_rejected', 'asset_published', 'brand_violation_logged',
    'ai_material_reviewed'
  )
);

-- ---------------------------------------------------------------------------
-- 5. Seed policy & sample data
-- ---------------------------------------------------------------------------
create or replace function public._bgap_seed_policy()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.growth_partner_marketing_policy_sections where section_key = 'official_policy') then
    return;
  end if;

  insert into public.growth_partner_marketing_policy_sections (section_key, title, content, sort_order) values
    ('official_policy', 'Official Marketing Policy',
     'Growth Partners, employees, agencies and third parties may only use official marketing materials provided through the Aipify Marketing Center unless explicit written approval has been granted by Aipify Group AS.', 1),
    ('approved_materials', 'Approved Materials',
     'Partners may freely use Marketing Center assets: logos, social graphics, presentation decks, brochures, email templates, case studies, campaign assets, video materials, event materials, and sales one-pagers.', 2),
    ('ai_materials', 'AI-Generated Materials',
     'Aipify may use AI internally to accelerate production. Externally facing AI-generated assets must undergo review and approval before publication.', 3),
    ('disclaimer', 'Disclaimer Requirement',
     'Growth Partners may not imply that independently created materials represent official Aipify communications. Only assets published through official Aipify channels are approved.', 4),
    ('exceptions', 'Exceptions',
     'Written approval from Aipify Group AS may permit co-branded campaigns, regional adaptations, industry-specific campaigns, and strategic partnerships.', 5),
    ('supporting_commitment', 'Aipify Commitment',
     'Aipify Group AS commits to providing a continuously expanding library of professional marketing resources so Growth Partners operate successfully without creating their own materials.', 6),
    ('violations', 'Violations',
     'Repeated misuse of Aipify branding may result in removal of marketing privileges, temporary suspension, mandatory retraining, or termination of Growth Partner agreements in severe cases.', 7);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Replace overview RPC (extends Phase 289)
-- ---------------------------------------------------------------------------
create or replace function public.get_growth_partner_marketing_center(p_surface text default 'partner')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_overview jsonb;
  v_assets jsonb;
  v_campaigns jsonb;
  v_email_templates jsonb;
  v_presentations jsonb;
  v_brand_guidelines jsonb;
  v_analytics jsonb;
  v_audit jsonb;
  v_prohibited jsonb;
  v_policy jsonb;
  v_requests jsonb;
  v_workflow jsonb;
  v_approved_materials jsonb;
  v_principle text := 'Every interaction with the market reflects on Aipify Group AS. Brand consistency builds trust.';
  v_foundation text := 'Professional brands are built through consistency. The strongest Growth Partners are equipped with exceptional resources — not forced to invent their own.';
begin
  perform public._gpmc289_seed_if_empty();
  perform public._bgap_seed_policy();
  v_user_id := public._gpmc289_current_user_id();
  v_tenant_id := public._gpmc289_resolve_tenant();

  if p_surface = 'super' then
    perform public._gpmc289_require_super_admin();
  elsif p_surface = 'partner' then
    if v_tenant_id is null or v_user_id is null then
      return jsonb_build_object('has_access', false);
    end if;
  else
    raise exception 'Unknown surface';
  end if;

  v_overview := jsonb_build_object(
    'available_campaigns', (select count(*)::int from public.growth_partner_marketing_campaigns where status = 'active'),
    'marketing_assets', (select count(*)::int from public.growth_partner_marketing_assets where status in ('published', 'approved')),
    'recently_updated', (
      select count(*)::int from public.growth_partner_marketing_assets
      where status in ('published', 'approved') and updated_at >= now() - interval '30 days'
    ),
    'campaign_performance', coalesce((
      select round(avg(performance_score), 1) from public.growth_partner_marketing_campaigns where status = 'active'
    ), 0),
    'upcoming_promotions', (
      select count(*)::int from public.growth_partner_marketing_campaigns
      where status = 'draft' and start_date > current_date
    ),
    'localized_resources', (
      select count(distinct language)::int from public.growth_partner_marketing_assets where status in ('published', 'approved')
    ),
    'pending_requests', (
      select count(*)::int from public.growth_partner_marketing_requests
      where workflow_stage not in ('published', 'approved')
    )
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'asset_name', a.asset_name, 'category', a.category,
    'language', a.language, 'version', a.version, 'status', a.status,
    'file_format', a.file_format, 'download_count', a.download_count,
    'updated_at', a.updated_at
  ) order by a.download_count desc), '[]'::jsonb)
  into v_assets
  from public.growth_partner_marketing_assets a
  where p_surface = 'super' or a.status in ('published', 'approved');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'campaign_name', c.campaign_name, 'objective', c.objective,
    'campaign_type', c.campaign_type, 'target_audience', c.target_audience,
    'start_date', c.start_date, 'end_date', c.end_date, 'status', c.status,
    'performance_score', c.performance_score,
    'asset_count', (select count(*)::int from public.growth_partner_marketing_campaign_assets ca where ca.campaign_id = c.id)
  ) order by c.start_date desc), '[]'::jsonb)
  into v_campaigns from public.growth_partner_marketing_campaigns c
  where p_surface = 'super' or c.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'template_name', e.template_name, 'template_type', e.template_type,
    'language', e.language, 'subject_line', e.subject_line,
    'body_preview', e.body_preview, 'download_count', e.download_count
  ) order by e.template_name), '[]'::jsonb)
  into v_email_templates from public.growth_partner_marketing_email_templates e
  where p_surface = 'super' or e.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'presentation_type', p.presentation_type,
    'language', p.language, 'slide_count', p.slide_count, 'download_count', p.download_count
  ) order by p.download_count desc), '[]'::jsonb)
  into v_presentations from public.growth_partner_marketing_presentations p
  where p_surface = 'super' or p.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'guideline_key', g.guideline_key, 'title', g.title,
    'content', g.content, 'sort_order', g.sort_order, 'updated_at', g.updated_at
  ) order by g.sort_order), '[]'::jsonb)
  into v_brand_guidelines from public.growth_partner_marketing_brand_guidelines g;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ps.id, 'section_key', ps.section_key, 'title', ps.title,
    'content', ps.content, 'sort_order', ps.sort_order
  ) order by ps.sort_order), '[]'::jsonb)
  into v_policy from public.growth_partner_marketing_policy_sections ps;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'tenant_id', r.tenant_id, 'request_type', r.request_type,
    'title', r.title, 'description', r.description, 'workflow_stage', r.workflow_stage,
    'language', r.language, 'industry', r.industry, 'created_at', r.created_at, 'updated_at', r.updated_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_requests
  from public.growth_partner_marketing_requests r
  where p_surface = 'super' or r.tenant_id = v_tenant_id;

  v_workflow := jsonb_build_array(
    jsonb_build_object('stage', 'submitted', 'label_key', 'submitted'),
    jsonb_build_object('stage', 'brand_review', 'label_key', 'brandReview'),
    jsonb_build_object('stage', 'design_production', 'label_key', 'designProduction'),
    jsonb_build_object('stage', 'legal_review', 'label_key', 'legalReview'),
    jsonb_build_object('stage', 'approved', 'label_key', 'approved'),
    jsonb_build_object('stage', 'published', 'label_key', 'published')
  );

  v_approved_materials := jsonb_build_array(
    'logos', 'social_media_graphics', 'presentation_decks', 'product_brochures',
    'email_templates', 'case_studies', 'campaign_assets', 'video_materials',
    'event_materials', 'sales_one_pagers'
  );

  v_analytics := jsonb_build_object(
    'most_downloaded_assets', coalesce((
      select jsonb_agg(jsonb_build_object('asset_name', a.asset_name, 'download_count', a.download_count))
      from (select asset_name, download_count from public.growth_partner_marketing_assets
            where status in ('published', 'approved') order by download_count desc limit 5) a
    ), '[]'::jsonb),
    'most_used_presentations', coalesce((
      select jsonb_agg(jsonb_build_object('title', p.title, 'download_count', p.download_count))
      from (select title, download_count from public.growth_partner_marketing_presentations
            where status = 'published' order by download_count desc limit 5) p
    ), '[]'::jsonb),
    'highest_performing_campaigns', coalesce((
      select jsonb_agg(jsonb_build_object('campaign_name', c.campaign_name, 'performance_score', c.performance_score))
      from (select campaign_name, performance_score from public.growth_partner_marketing_campaigns
            where status = 'active' order by performance_score desc limit 5) c
    ), '[]'::jsonb),
    'engagement_trend', 'stable'
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', al.id, 'event_type', al.event_type, 'summary', al.summary, 'created_at', al.created_at
  ) order by al.created_at desc), '[]'::jsonb)
  into v_audit from public.growth_partner_marketing_audit_logs al limit 20;

  v_prohibited := jsonb_build_array(
    'modify_official_logos', 'unofficial_advertisements', 'self_made_videos',
    'unofficial_brochures', 'edit_recolor_assets', 'alter_messaging',
    'unofficial_landing_pages', 'independent_certification',
    'unofficial_social_campaigns', 'ai_generated_unofficial'
  );

  return jsonb_build_object(
    'has_access', true,
    'surface', p_surface,
    'overview', v_overview,
    'assets', coalesce(v_assets, '[]'::jsonb),
    'campaigns', coalesce(v_campaigns, '[]'::jsonb),
    'email_templates', coalesce(v_email_templates, '[]'::jsonb),
    'presentations', coalesce(v_presentations, '[]'::jsonb),
    'brand_guidelines', coalesce(v_brand_guidelines, '[]'::jsonb),
    'policy', coalesce(v_policy, '[]'::jsonb),
    'marketing_requests', coalesce(v_requests, '[]'::jsonb),
    'workflow_stages', v_workflow,
    'approved_material_types', v_approved_materials,
    'analytics', v_analytics,
    'audit', coalesce(v_audit, '[]'::jsonb),
    'prohibited_actions', v_prohibited,
    'supported_languages', jsonb_build_array('en', 'no', 'sv', 'da'),
    'principle', v_principle,
    'foundation_principle', v_foundation
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Extend actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_growth_partner_marketing_action(
  p_surface text default 'partner',
  p_action text default '',
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_resource_type text;
  v_resource_id uuid;
  v_export jsonb;
  v_request_id uuid;
  v_next_stage text;
begin
  p_payload := coalesce(p_payload, '{}'::jsonb);
  v_tenant_id := public._gpmc289_resolve_tenant();
  v_user_id := public._gpmc289_current_user_id();

  if p_action = 'download' then
    v_resource_type := coalesce(p_payload->>'resource_type', 'asset');
    v_resource_id := nullif(p_payload->>'resource_id', '')::uuid;
    if v_resource_id is null then raise exception 'resource_id required'; end if;

    if v_resource_type = 'asset' then
      if not exists (
        select 1 from public.growth_partner_marketing_assets
        where id = v_resource_id and status in ('published', 'approved')
      ) then raise exception 'Asset not approved for download'; end if;
    end if;

    insert into public.growth_partner_marketing_downloads (tenant_id, user_id, resource_type, resource_id)
    values (v_tenant_id, v_user_id, v_resource_type, v_resource_id);

    if v_resource_type = 'asset' then
      update public.growth_partner_marketing_assets set download_count = download_count + 1, updated_at = now()
      where id = v_resource_id;
    elsif v_resource_type = 'email_template' then
      update public.growth_partner_marketing_email_templates set download_count = download_count + 1, updated_at = now()
      where id = v_resource_id;
    elsif v_resource_type = 'presentation' then
      update public.growth_partner_marketing_presentations set download_count = download_count + 1, updated_at = now()
      where id = v_resource_id;
    end if;

    perform public._gpmc289_log_audit('asset_downloaded', 'Marketing resource downloaded.', p_payload);
    v_export := jsonb_build_object(
      'format', coalesce(p_payload->>'format', 'pdf'),
      'resource_type', v_resource_type,
      'resource_id', v_resource_id,
      'generated_at', now()
    );
    return jsonb_build_object('ok', true, 'export', v_export);
  end if;

  if p_action = 'submit_request' then
    if v_tenant_id is null then raise exception 'Tenant required'; end if;
    insert into public.growth_partner_marketing_requests (
      tenant_id, request_type, title, description, language, industry, workflow_stage
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'request_type', 'local_campaign'),
      coalesce(p_payload->>'title', 'Marketing request'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'language', 'en'),
      coalesce(p_payload->>'industry', ''),
      'submitted'
    ) returning id into v_request_id;
    perform public._gpmc289_log_audit('request_submitted', 'Marketing request submitted for brand review.', p_payload);
    return jsonb_build_object('ok', true, 'request_id', v_request_id);
  end if;

  if p_surface <> 'super' then
    raise exception 'Action requires Super Admin authorization';
  end if;

  perform public._gpmc289_require_super_admin();

  if p_action = 'advance_request' then
    v_request_id := nullif(p_payload->>'request_id', '')::uuid;
    select case workflow_stage
      when 'submitted' then 'brand_review'
      when 'brand_review' then 'design_production'
      when 'design_production' then 'legal_review'
      when 'legal_review' then 'approved'
      when 'approved' then 'published'
      else workflow_stage
    end into v_next_stage
    from public.growth_partner_marketing_requests where id = v_request_id;

    update public.growth_partner_marketing_requests
    set workflow_stage = v_next_stage, updated_at = now()
    where id = v_request_id;

    perform public._gpmc289_log_audit('request_advanced', format('Request advanced to %s.', v_next_stage), p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'reject_request' then
    update public.growth_partner_marketing_requests
    set workflow_stage = 'submitted', updated_at = now(), metadata = metadata || jsonb_build_object('rejected', true)
    where id = nullif(p_payload->>'request_id', '')::uuid;
    perform public._gpmc289_log_audit('request_rejected', 'Marketing request returned for revision.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'publish_asset' then
    update public.growth_partner_marketing_assets
    set status = 'published', updated_at = now()
    where id = nullif(p_payload->>'asset_id', '')::uuid;
    perform public._gpmc289_log_audit('asset_published', 'Asset published to Marketing Center.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'approve_asset' then
    update public.growth_partner_marketing_assets
    set status = 'approved', updated_at = now()
    where id = nullif(p_payload->>'asset_id', '')::uuid;
    perform public._gpmc289_log_audit('ai_material_reviewed', 'Asset approved after brand review.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'publish_campaign' then
    update public.growth_partner_marketing_campaigns set status = 'active', updated_at = now()
    where id = nullif(p_payload->>'campaign_id', '')::uuid;
    perform public._gpmc289_log_audit('campaign_published', 'Campaign published.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'archive_campaign' then
    update public.growth_partner_marketing_campaigns set status = 'archived', updated_at = now()
    where id = nullif(p_payload->>'campaign_id', '')::uuid;
    perform public._gpmc289_log_audit('campaign_archived', 'Campaign archived.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'archive_asset' then
    update public.growth_partner_marketing_assets set status = 'archived', updated_at = now()
    where id = nullif(p_payload->>'asset_id', '')::uuid;
    perform public._gpmc289_log_audit('asset_archived', 'Asset archived.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'upload_asset' then
    insert into public.growth_partner_marketing_assets (
      asset_name, category, language, version, status, file_format
    ) values (
      coalesce(p_payload->>'asset_name', 'New asset'),
      coalesce(p_payload->>'category', 'banner'),
      coalesce(p_payload->>'language', 'en'),
      coalesce(p_payload->>'version', '1.0'),
      coalesce(p_payload->>'status', 'draft'),
      coalesce(p_payload->>'file_format', 'pdf')
    );
    perform public._gpmc289_log_audit('asset_uploaded', 'Asset uploaded by Super Admin.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'log_violation' then
    perform public._gpmc289_log_audit('brand_violation_logged', coalesce(p_payload->>'summary', 'Brand misuse reported.'), p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'update_brand_guideline' then
    update public.growth_partner_marketing_brand_guidelines
    set content = coalesce(p_payload->>'content', content),
        title = coalesce(p_payload->>'title', title),
        updated_at = now()
    where guideline_key = coalesce(p_payload->>'guideline_key', guideline_key);
    perform public._gpmc289_log_audit('brand_guideline_updated', 'Brand guideline updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', p_action;
end; $$;

notify pgrst, 'reload schema';
