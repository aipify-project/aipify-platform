-- Phase 289 — Growth Partner Marketing Center

-- ---------------------------------------------------------------------------
-- 1. Marketing assets
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_assets (
  id uuid primary key default gen_random_uuid(),
  asset_name text not null,
  category text not null check (
    category in (
      'banner', 'social_media_graphic', 'presentation_deck', 'brochure',
      'email_template', 'landing_page_template', 'product_one_pager',
      'case_study', 'brand_guidelines'
    )
  ),
  language text not null default 'en' check (language in ('en', 'no', 'sv', 'da')),
  version text not null default '1.0',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  file_format text not null default 'pdf' check (
    file_format in ('pdf', 'pptx', 'png', 'jpg', 'zip', 'html')
  ),
  download_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_marketing_assets_status_idx
  on public.growth_partner_marketing_assets (status, category, language);

alter table public.growth_partner_marketing_assets enable row level security;
revoke all on public.growth_partner_marketing_assets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Campaigns
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_name text not null,
  objective text not null default '',
  campaign_type text not null default 'awareness' check (
    campaign_type in (
      'awareness', 'lead_generation', 'product_launch', 'enterprise_outreach',
      'referral_growth', 'seasonal_promotion'
    )
  ),
  target_audience text not null default 'growth_partners',
  start_date date not null default current_date,
  end_date date,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  performance_score numeric(5, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_marketing_campaigns_status_idx
  on public.growth_partner_marketing_campaigns (status, start_date desc);

alter table public.growth_partner_marketing_campaigns enable row level security;
revoke all on public.growth_partner_marketing_campaigns from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Campaign ↔ asset links
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_campaign_assets (
  campaign_id uuid not null references public.growth_partner_marketing_campaigns (id) on delete cascade,
  asset_id uuid not null references public.growth_partner_marketing_assets (id) on delete cascade,
  primary key (campaign_id, asset_id)
);

alter table public.growth_partner_marketing_campaign_assets enable row level security;
revoke all on public.growth_partner_marketing_campaign_assets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Email templates
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_email_templates (
  id uuid primary key default gen_random_uuid(),
  template_name text not null,
  template_type text not null check (
    template_type in (
      'initial_outreach', 'demonstration_invitation', 'follow_up',
      'proposal_delivery', 'renewal_conversation', 'enterprise_introduction'
    )
  ),
  language text not null default 'en' check (language in ('en', 'no', 'sv', 'da')),
  subject_line text not null default '',
  body_preview text not null default '',
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  download_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_marketing_email_templates enable row level security;
revoke all on public.growth_partner_marketing_email_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Presentations
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_presentations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  presentation_type text not null check (
    presentation_type in (
      'what_is_aipify', 'executive_overview', 'enterprise_procurement',
      'growth_partner_introduction', 'customer_success_stories', 'industry_use_case'
    )
  ),
  language text not null default 'en' check (language in ('en', 'no', 'sv', 'da')),
  slide_count integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  download_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_marketing_presentations enable row level security;
revoke all on public.growth_partner_marketing_presentations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Brand guidelines
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_brand_guidelines (
  id uuid primary key default gen_random_uuid(),
  guideline_key text not null unique,
  title text not null,
  content text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_marketing_brand_guidelines enable row level security;
revoke all on public.growth_partner_marketing_brand_guidelines from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Download / usage log
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_downloads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  resource_type text not null check (
    resource_type in ('asset', 'email_template', 'presentation')
  ),
  resource_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_marketing_downloads_resource_idx
  on public.growth_partner_marketing_downloads (resource_type, resource_id, created_at desc);

alter table public.growth_partner_marketing_downloads enable row level security;
revoke all on public.growth_partner_marketing_downloads from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_marketing_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'asset_uploaded', 'asset_downloaded', 'campaign_published',
      'campaign_archived', 'brand_guideline_updated', 'asset_archived'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_marketing_audit_created_idx
  on public.growth_partner_marketing_audit_logs (created_at desc);

alter table public.growth_partner_marketing_audit_logs enable row level security;
revoke all on public.growth_partner_marketing_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._gpmc289_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then
    raise exception 'Not authorized';
  end if;
end; $$;

create or replace function public._gpmc289_resolve_tenant()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._gpmc289_current_user_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_user_id;
end; $$;

create or replace function public._gpmc289_log_audit(
  p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_marketing_audit_logs (event_type, summary, context)
  values (p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._gpmc289_seed_if_empty()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_campaign_id uuid;
  v_asset_id uuid;
begin
  if exists (select 1 from public.growth_partner_marketing_assets limit 1) then return; end if;

  insert into public.growth_partner_marketing_brand_guidelines (guideline_key, title, content, sort_order)
  values
    ('logo_usage', 'Logo Usage Rules', 'Use official Aipify logos only. Never stretch, rotate, or recolor the mark.', 1),
    ('typography', 'Typography Standards', 'Primary: system sans-serif stack. Headlines: semibold. Body: regular.', 2),
    ('messaging', 'Approved Messaging', 'Aipify Business Operating System (ABOS). Growth Partner — never Affiliate.', 3),
    ('color_palette', 'Color Palette', 'Indigo primary · Slate neutral · White backgrounds for enterprise materials.', 4),
    ('tone_of_voice', 'Tone of Voice', 'Professional, calm, People First. Wisdom before speed.', 5);

  insert into public.growth_partner_marketing_assets (
    asset_name, category, language, version, status, file_format, download_count
  ) values
    ('Aipify Partner Banner — Web', 'banner', 'en', '2.1', 'published', 'png', 42),
    ('LinkedIn Outreach Graphic', 'social_media_graphic', 'en', '1.3', 'published', 'png', 87),
    ('Enterprise One-Pager', 'product_one_pager', 'en', '3.0', 'published', 'pdf', 156),
    ('Customer Success Case Study — Retail', 'case_study', 'en', '1.0', 'published', 'pdf', 34),
    ('Partner Brochure — Norwegian', 'brochure', 'no', '1.2', 'published', 'pdf', 28);

  insert into public.growth_partner_marketing_email_templates (
    template_name, template_type, language, subject_line, body_preview, download_count
  ) values
    ('Initial Outreach — Professional', 'initial_outreach', 'en',
     'Introducing Aipify for your organization',
     'A calm, professional introduction to ABOS and how Aipify supports operational teams.', 64),
    ('Demonstration Invitation', 'demonstration_invitation', 'en',
     'Schedule your Aipify demonstration',
     'Invite prospects to a structured demonstration with clear next steps.', 51),
    ('Enterprise Introduction', 'enterprise_introduction', 'en',
     'Aipify for enterprise procurement review',
     'Procurement-ready language for security, governance, and human oversight.', 39);

  insert into public.growth_partner_marketing_presentations (
    title, presentation_type, language, slide_count, download_count
  ) values
    ('What is Aipify?', 'what_is_aipify', 'en', 18, 210),
    ('Executive Overview', 'executive_overview', 'en', 24, 178),
    ('Growth Partner Introduction', 'growth_partner_introduction', 'en', 16, 95),
    ('Enterprise Procurement Pack', 'enterprise_procurement', 'en', 32, 67);

  insert into public.growth_partner_marketing_campaigns (
    campaign_name, objective, campaign_type, target_audience, start_date, end_date, status, performance_score
  ) values (
    'Q2 Enterprise Outreach',
    'Support Growth Partners reaching enterprise prospects with approved materials.',
    'enterprise_outreach', 'enterprise_buyers',
    current_date - 14, current_date + 75, 'active', 78.5
  ) returning id into v_campaign_id;

  select id into v_asset_id from public.growth_partner_marketing_assets
  where asset_name = 'Enterprise One-Pager' limit 1;

  if v_asset_id is not null then
    insert into public.growth_partner_marketing_campaign_assets (campaign_id, asset_id)
    values (v_campaign_id, v_asset_id);
  end if;

  insert into public.growth_partner_marketing_campaigns (
    campaign_name, objective, campaign_type, target_audience, start_date, end_date, status, performance_score
  ) values (
    'Referral Growth — Summer',
    'Encourage partner-led referrals with consistent brand assets.',
    'referral_growth', 'growth_partners',
    current_date + 7, current_date + 90, 'draft', 0
  );

  perform public._gpmc289_log_audit('asset_uploaded', 'Marketing Center seeded with starter assets.', '{}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Overview RPC
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
  v_principle text := 'Growth Partners should never have to guess how to represent Aipify.';
begin
  perform public._gpmc289_seed_if_empty();
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
    'marketing_assets', (select count(*)::int from public.growth_partner_marketing_assets where status = 'published'),
    'recently_updated', (
      select count(*)::int from public.growth_partner_marketing_assets
      where status = 'published' and updated_at >= now() - interval '30 days'
    ),
    'campaign_performance', coalesce((
      select round(avg(performance_score), 1) from public.growth_partner_marketing_campaigns where status = 'active'
    ), 0),
    'upcoming_promotions', (
      select count(*)::int from public.growth_partner_marketing_campaigns
      where status = 'draft' and start_date > current_date
    ),
    'localized_resources', (
      select count(distinct language)::int from public.growth_partner_marketing_assets where status = 'published'
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
  where p_surface = 'super' or a.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'campaign_name', c.campaign_name, 'objective', c.objective,
    'campaign_type', c.campaign_type, 'target_audience', c.target_audience,
    'start_date', c.start_date, 'end_date', c.end_date, 'status', c.status,
    'performance_score', c.performance_score,
    'asset_count', (
      select count(*)::int from public.growth_partner_marketing_campaign_assets ca where ca.campaign_id = c.id
    )
  ) order by c.start_date desc), '[]'::jsonb)
  into v_campaigns
  from public.growth_partner_marketing_campaigns c
  where p_surface = 'super' or c.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'template_name', e.template_name, 'template_type', e.template_type,
    'language', e.language, 'subject_line', e.subject_line,
    'body_preview', e.body_preview, 'download_count', e.download_count
  ) order by e.template_name), '[]'::jsonb)
  into v_email_templates
  from public.growth_partner_marketing_email_templates e
  where p_surface = 'super' or e.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'presentation_type', p.presentation_type,
    'language', p.language, 'slide_count', p.slide_count,
    'download_count', p.download_count
  ) order by p.download_count desc), '[]'::jsonb)
  into v_presentations
  from public.growth_partner_marketing_presentations p
  where p_surface = 'super' or p.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'guideline_key', g.guideline_key, 'title', g.title,
    'content', g.content, 'sort_order', g.sort_order, 'updated_at', g.updated_at
  ) order by g.sort_order), '[]'::jsonb)
  into v_brand_guidelines
  from public.growth_partner_marketing_brand_guidelines g;

  v_analytics := jsonb_build_object(
    'most_downloaded_assets', coalesce((
      select jsonb_agg(jsonb_build_object('asset_name', a.asset_name, 'download_count', a.download_count))
      from (select asset_name, download_count from public.growth_partner_marketing_assets
            where status = 'published' order by download_count desc limit 5) a
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
  into v_audit
  from public.growth_partner_marketing_audit_logs al
  limit 15;

  v_prohibited := jsonb_build_array(
    'modify_official_logos', 'promise_unavailable_features',
    'misleading_pricing', 'outdated_presentations'
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
    'analytics', v_analytics,
    'audit', coalesce(v_audit, '[]'::jsonb),
    'prohibited_actions', v_prohibited,
    'supported_languages', jsonb_build_array('en', 'no', 'sv', 'da'),
    'principle', v_principle
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Actions RPC
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
begin
  p_payload := coalesce(p_payload, '{}'::jsonb);
  v_tenant_id := public._gpmc289_resolve_tenant();
  v_user_id := public._gpmc289_current_user_id();

  if p_action = 'download' then
    v_resource_type := coalesce(p_payload->>'resource_type', 'asset');
    v_resource_id := nullif(p_payload->>'resource_id', '')::uuid;
    if v_resource_id is null then raise exception 'resource_id required'; end if;

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

  if p_surface <> 'super' then
    raise exception 'Action requires Super Admin authorization';
  end if;

  perform public._gpmc289_require_super_admin();

  if p_action = 'publish_campaign' then
    update public.growth_partner_marketing_campaigns
    set status = 'active', updated_at = now()
    where id = nullif(p_payload->>'campaign_id', '')::uuid;
    perform public._gpmc289_log_audit('campaign_published', 'Campaign published.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'archive_campaign' then
    update public.growth_partner_marketing_campaigns
    set status = 'archived', updated_at = now()
    where id = nullif(p_payload->>'campaign_id', '')::uuid;
    perform public._gpmc289_log_audit('campaign_archived', 'Campaign archived.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'archive_asset' then
    update public.growth_partner_marketing_assets
    set status = 'archived', updated_at = now()
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

revoke all on function public.get_growth_partner_marketing_center(text) from public;
revoke all on function public.record_growth_partner_marketing_action(text, text, jsonb) from public;
grant execute on function public.get_growth_partner_marketing_center(text) to authenticated;
grant execute on function public.record_growth_partner_marketing_action(text, text, jsonb) to authenticated;
