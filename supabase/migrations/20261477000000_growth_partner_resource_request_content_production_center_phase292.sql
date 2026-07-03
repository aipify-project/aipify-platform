-- Phase 292 — Growth Partner Resource Request & Content Production Center

-- ---------------------------------------------------------------------------
-- 1. Content requests
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_content_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  request_title text not null,
  resource_type text not null check (
    resource_type in (
      'social_media_campaign', 'tiktok_video', 'linkedin_campaign', 'presentation_deck',
      'one_pager', 'industry_brochure', 'email_sequence', 'webinar_materials',
      'event_materials', 'customer_case_study', 'product_demo_video', 'industry_campaign'
    )
  ),
  industry text not null default '',
  target_audience text not null default 'small_business' check (
    target_audience in (
      'small_business', 'enterprise', 'healthcare', 'accounting', 'ecommerce',
      'education', 'government', 'manufacturing'
    )
  ),
  country text not null default 'NO',
  language text not null default 'en' check (language in ('en', 'no', 'sv', 'da')),
  business_objective text not null default '',
  additional_notes text not null default '',
  desired_completion_date date,
  status text not null default 'submitted' check (
    status in (
      'submitted', 'under_review', 'approved', 'in_production',
      'internal_review', 'published', 'declined'
    )
  ),
  priority_score integer not null default 50 check (priority_score between 0 and 100),
  assigned_owner text not null default '',
  assigned_partner text not null default '',
  production_progress integer not null default 0 check (production_progress between 0 and 100),
  clarification_required boolean not null default false,
  clarification_message text not null default '',
  published_asset_id uuid references public.growth_partner_marketing_assets (id) on delete set null,
  delivery_method text not null default 'marketing_center' check (
    delivery_method in (
      'marketing_center', 'direct_download', 'campaign_library', 'presentation_center'
    )
  ),
  duplicate_recommendations jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists growth_partner_content_requests_tenant_idx
  on public.growth_partner_content_requests (tenant_id, status, created_at desc);

create index if not exists growth_partner_content_requests_type_idx
  on public.growth_partner_content_requests (resource_type, industry, language);

alter table public.growth_partner_content_requests enable row level security;
revoke all on public.growth_partner_content_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Notifications
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_content_request_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_id uuid not null references public.growth_partner_content_requests (id) on delete cascade,
  notification_type text not null check (
    notification_type in ('submitted', 'approved', 'clarification_required', 'published', 'declined')
  ),
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_content_request_notifications_tenant_idx
  on public.growth_partner_content_request_notifications (tenant_id, created_at desc);

alter table public.growth_partner_content_request_notifications enable row level security;
revoke all on public.growth_partner_content_request_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_content_request_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  request_id uuid references public.growth_partner_content_requests (id) on delete set null,
  event_type text not null check (
    event_type in (
      'request_submitted', 'request_approved', 'request_declined', 'asset_published',
      'request_fulfilled', 'clarification_requested', 'owner_assigned', 'production_advanced'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_content_request_audit_created_idx
  on public.growth_partner_content_request_audit_logs (created_at desc);

alter table public.growth_partner_content_request_audit_logs enable row level security;
revoke all on public.growth_partner_content_request_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._gprc292_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._gprc292_resolve_tenant()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._gprc292_current_user_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1);
end; $$;

create or replace function public._gprc292_log_audit(
  p_tenant_id uuid, p_request_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_content_request_audit_logs (tenant_id, request_id, event_type, summary, context)
  values (p_tenant_id, p_request_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._gprc292_notify(
  p_tenant_id uuid, p_request_id uuid, p_type text, p_message text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_content_request_notifications (tenant_id, request_id, notification_type, message)
  values (p_tenant_id, p_request_id, p_type, p_message);
end; $$;

create or replace function public._gprc292_asset_category(p_resource_type text)
returns text language plpgsql immutable as $$
begin
  return case p_resource_type
    when 'social_media_campaign' then 'social_media_graphic'
    when 'tiktok_video' then 'social_media_graphic'
    when 'linkedin_campaign' then 'social_media_graphic'
    when 'presentation_deck' then 'presentation_deck'
    when 'one_pager' then 'product_one_pager'
    when 'industry_brochure' then 'brochure'
    when 'email_sequence' then 'email_template'
    when 'webinar_materials' then 'presentation_deck'
    when 'event_materials' then 'banner'
    when 'customer_case_study' then 'case_study'
    when 'product_demo_video' then 'social_media_graphic'
    when 'industry_campaign' then 'banner'
    else 'banner'
  end;
end; $$;

create or replace function public._gprc292_compute_priority(
  p_target_audience text, p_resource_type text, p_industry text
)
returns integer language plpgsql immutable as $$
declare v_score integer := 50;
begin
  if p_target_audience = 'enterprise' then v_score := v_score + 20; end if;
  if p_resource_type in ('industry_campaign', 'product_demo_video', 'customer_case_study') then
    v_score := v_score + 10;
  end if;
  if p_industry <> '' then v_score := v_score + 5; end if;
  if extract(month from now()) in (10, 11, 12) then v_score := v_score + 5; end if;
  return least(100, v_score);
end; $$;

create or replace function public._gprc292_find_duplicates(
  p_resource_type text, p_industry text, p_language text, p_exclude_id uuid default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_category text := public._gprc292_asset_category(p_resource_type);
  v_assets jsonb;
  v_requests jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'kind', 'asset', 'id', a.id, 'title', a.asset_name,
    'match_score', 90, 'reason', 'Existing published asset matches this resource type.'
  )), '[]'::jsonb)
  into v_assets
  from (
    select id, asset_name from public.growth_partner_marketing_assets
    where status in ('published', 'approved')
      and category = v_category
      and (p_language = '' or language = p_language)
    limit 3
  ) a;

  select coalesce(jsonb_agg(jsonb_build_object(
    'kind', 'request', 'id', r.id, 'title', r.request_title,
    'match_score', 70, 'reason', 'Similar request already in progress or completed.'
  )), '[]'::jsonb)
  into v_requests
  from (
    select id, request_title from public.growth_partner_content_requests
    where resource_type = p_resource_type
      and (p_exclude_id is null or id <> p_exclude_id)
      and status not in ('declined')
      and (p_industry = '' or industry ilike '%' || p_industry || '%')
    limit 3
  ) r;

  return v_assets || v_requests;
end; $$;

create or replace function public._gprc292_seed_if_empty()
returns void language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
begin
  if exists (select 1 from public.growth_partner_content_requests limit 1) then return; end if;

  select c.id into v_tenant
  from public.customers c
  join public.companies co on co.id = c.company_id
  where co.slug = 'unonight'
  limit 1;
  if v_tenant is null then
    select c.id into v_tenant from public.customers c where not coalesce(c.is_platform, false) limit 1;
  end if;
  if v_tenant is null then return; end if;

  insert into public.growth_partner_content_requests (
    tenant_id, request_title, resource_type, industry, target_audience, country, language,
    business_objective, status, priority_score, production_progress
  ) values
    (v_tenant, 'Healthcare LinkedIn Campaign — Norway', 'linkedin_campaign', 'Healthcare', 'healthcare', 'NO', 'no',
     'Generate enterprise healthcare leads in Norway.', 'in_production', 75, 60),
    (v_tenant, 'Enterprise Presentation Deck Q3', 'presentation_deck', 'Cross-industry', 'enterprise', 'NO', 'en',
     'Support enterprise procurement conversations.', 'internal_review', 85, 90);

  perform public._gprc292_log_audit(v_tenant, null, 'request_submitted', 'Content request center seeded.', '{}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Overview RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_growth_partner_content_request_center(p_surface text default 'partner')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_overview jsonb;
  v_requests jsonb;
  v_notifications jsonb;
  v_audit jsonb;
  v_reporting jsonb;
  v_workflow jsonb;
  v_delivery jsonb;
  v_principle text := 'Growth Partners should spend their time building relationships and creating value for customers.';
  v_foundation text := 'Aipify Group AS empowers Growth Partners with professional resources that strengthen the brand and increase their chances of success.';
  v_avg_days numeric;
begin
  perform public._gprc292_seed_if_empty();
  v_tenant_id := public._gprc292_resolve_tenant();

  if p_surface = 'super' then
    perform public._gprc292_require_super_admin();
  elsif p_surface = 'partner' then
    if v_tenant_id is null then return jsonb_build_object('has_access', false); end if;
  else
    raise exception 'Unknown surface';
  end if;

  select coalesce(round(avg(extract(epoch from (published_at - created_at)) / 86400), 1), 0)
  into v_avg_days
  from public.growth_partner_content_requests
  where status = 'published' and published_at is not null
    and (p_surface = 'super' or tenant_id = v_tenant_id);

  v_overview := jsonb_build_object(
    'open_requests', (
      select count(*)::int from public.growth_partner_content_requests r
      where r.status in ('submitted', 'under_review')
        and (p_surface = 'super' or r.tenant_id = v_tenant_id)
    ),
    'in_production', (
      select count(*)::int from public.growth_partner_content_requests r
      where r.status = 'in_production'
        and (p_surface = 'super' or r.tenant_id = v_tenant_id)
    ),
    'awaiting_review', (
      select count(*)::int from public.growth_partner_content_requests r
      where r.status = 'internal_review'
        and (p_surface = 'super' or r.tenant_id = v_tenant_id)
    ),
    'completed_requests', (
      select count(*)::int from public.growth_partner_content_requests r
      where r.status = 'published'
        and (p_surface = 'super' or r.tenant_id = v_tenant_id)
    ),
    'recently_published_assets', (
      select count(*)::int from public.growth_partner_marketing_assets a
      where a.status = 'published' and a.updated_at >= now() - interval '30 days'
    ),
    'average_delivery_time', coalesce(v_avg_days, 0)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'tenant_id', r.tenant_id, 'request_title', r.request_title,
    'resource_type', r.resource_type, 'industry', r.industry,
    'target_audience', r.target_audience, 'country', r.country, 'language', r.language,
    'business_objective', r.business_objective, 'additional_notes', r.additional_notes,
    'desired_completion_date', r.desired_completion_date, 'status', r.status,
    'priority_score', r.priority_score, 'assigned_owner', r.assigned_owner,
    'assigned_partner', r.assigned_partner, 'production_progress', r.production_progress,
    'clarification_required', r.clarification_required, 'clarification_message', r.clarification_message,
    'published_asset_id', r.published_asset_id, 'delivery_method', r.delivery_method,
    'duplicate_recommendations', r.duplicate_recommendations,
    'created_at', r.created_at, 'updated_at', r.updated_at, 'published_at', r.published_at
  ) order by r.priority_score desc, r.created_at desc), '[]'::jsonb)
  into v_requests
  from public.growth_partner_content_requests r
  where p_surface = 'super' or r.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'request_id', n.request_id, 'notification_type', n.notification_type,
    'message', n.message, 'read_at', n.read_at, 'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb)
  into v_notifications
  from public.growth_partner_content_request_notifications n
  where p_surface = 'super' or n.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', al.id, 'request_id', al.request_id, 'event_type', al.event_type,
    'summary', al.summary, 'created_at', al.created_at
  ) order by al.created_at desc), '[]'::jsonb)
  into v_audit
  from public.growth_partner_content_request_audit_logs al
  where p_surface = 'super' or al.tenant_id = v_tenant_id
  limit 25;

  v_reporting := jsonb_build_object(
    'most_requested_types', coalesce((
      select jsonb_agg(jsonb_build_object('resource_type', t.resource_type, 'request_count', t.cnt))
      from (
        select resource_type, count(*)::int as cnt
        from public.growth_partner_content_requests
        where p_surface = 'super' or tenant_id = v_tenant_id
        group by resource_type order by cnt desc limit 5
      ) t
    ), '[]'::jsonb),
    'industry_demand', coalesce((
      select jsonb_agg(jsonb_build_object('industry', t.industry, 'request_count', t.cnt))
      from (
        select industry, count(*)::int as cnt
        from public.growth_partner_content_requests
        where industry <> '' and (p_surface = 'super' or tenant_id = v_tenant_id)
        group by industry order by cnt desc limit 5
      ) t
    ), '[]'::jsonb),
    'average_production_days', coalesce(v_avg_days, 0),
    'partner_satisfaction', 92
  );

  v_workflow := jsonb_build_array(
    jsonb_build_object('stage', 'submitted', 'label_key', 'submitted'),
    jsonb_build_object('stage', 'under_review', 'label_key', 'underReview'),
    jsonb_build_object('stage', 'approved', 'label_key', 'approved'),
    jsonb_build_object('stage', 'in_production', 'label_key', 'inProduction'),
    jsonb_build_object('stage', 'internal_review', 'label_key', 'internalReview'),
    jsonb_build_object('stage', 'published', 'label_key', 'published')
  );

  v_delivery := jsonb_build_array(
    'marketing_center', 'direct_download', 'campaign_library', 'presentation_center'
  );

  return jsonb_build_object(
    'has_access', true,
    'surface', p_surface,
    'overview', v_overview,
    'requests', coalesce(v_requests, '[]'::jsonb),
    'notifications', coalesce(v_notifications, '[]'::jsonb),
    'audit', coalesce(v_audit, '[]'::jsonb),
    'reporting', v_reporting,
    'workflow_stages', v_workflow,
    'delivery_methods', v_delivery,
    'principle', v_principle,
    'foundation_principle', v_foundation
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_growth_partner_content_request_action(
  p_surface text default 'partner',
  p_action text default '',
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_request_id uuid;
  v_request public.growth_partner_content_requests%rowtype;
  v_duplicates jsonb;
  v_asset_id uuid;
  v_category text;
begin
  p_payload := coalesce(p_payload, '{}'::jsonb);
  v_tenant_id := public._gprc292_resolve_tenant();
  v_user_id := public._gprc292_current_user_id();

  if p_action = 'submit_request' then
    if v_tenant_id is null then raise exception 'Tenant required'; end if;

    v_duplicates := public._gprc292_find_duplicates(
      coalesce(p_payload->>'resource_type', 'presentation_deck'),
      coalesce(p_payload->>'industry', ''),
      coalesce(p_payload->>'language', 'en'),
      null
    );

    insert into public.growth_partner_content_requests (
      tenant_id, user_id, request_title, resource_type, industry, target_audience,
      country, language, business_objective, additional_notes, desired_completion_date,
      status, priority_score, duplicate_recommendations
    ) values (
      v_tenant_id, v_user_id,
      coalesce(p_payload->>'request_title', 'Resource request'),
      coalesce(p_payload->>'resource_type', 'presentation_deck'),
      coalesce(p_payload->>'industry', ''),
      coalesce(p_payload->>'target_audience', 'small_business'),
      coalesce(p_payload->>'country', 'NO'),
      coalesce(p_payload->>'language', 'en'),
      coalesce(p_payload->>'business_objective', ''),
      coalesce(p_payload->>'additional_notes', ''),
      nullif(p_payload->>'desired_completion_date', '')::date,
      'submitted',
      public._gprc292_compute_priority(
        coalesce(p_payload->>'target_audience', 'small_business'),
        coalesce(p_payload->>'resource_type', 'presentation_deck'),
        coalesce(p_payload->>'industry', '')
      ),
      v_duplicates
    ) returning id into v_request_id;

    perform public._gprc292_log_audit(v_tenant_id, v_request_id, 'request_submitted', 'Resource request submitted.', p_payload);
    perform public._gprc292_notify(v_tenant_id, v_request_id, 'submitted', 'Your resource request has been submitted for review.');
    return jsonb_build_object('ok', true, 'request_id', v_request_id, 'duplicate_recommendations', v_duplicates);
  end if;

  if p_surface <> 'super' then
    raise exception 'Action requires Super Admin authorization';
  end if;

  perform public._gprc292_require_super_admin();
  v_request_id := nullif(p_payload->>'request_id', '')::uuid;
  select * into v_request from public.growth_partner_content_requests where id = v_request_id;
  if not found then raise exception 'Request not found'; end if;

  if p_action = 'approve_request' then
    update public.growth_partner_content_requests
    set status = 'approved', updated_at = now(), clarification_required = false
    where id = v_request_id;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'request_approved', 'Request approved for production.', p_payload);
    perform public._gprc292_notify(v_request.tenant_id, v_request_id, 'approved', 'Your resource request has been approved and enters production.');
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'decline_request' then
    update public.growth_partner_content_requests set status = 'declined', updated_at = now() where id = v_request_id;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'request_declined', coalesce(p_payload->>'reason', 'Request declined.'), p_payload);
    perform public._gprc292_notify(v_request.tenant_id, v_request_id, 'declined', 'Your resource request was declined. Contact Aipify for details.');
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'assign_owner' then
    update public.growth_partner_content_requests
    set assigned_owner = coalesce(p_payload->>'assigned_owner', assigned_owner),
        status = case when status = 'submitted' then 'under_review' else status end,
        updated_at = now()
    where id = v_request_id;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'owner_assigned', 'Internal owner assigned.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'assign_partner' then
    update public.growth_partner_content_requests
    set assigned_partner = coalesce(p_payload->>'assigned_partner', assigned_partner), updated_at = now()
    where id = v_request_id;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'owner_assigned', 'Production partner assigned.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'request_clarification' then
    update public.growth_partner_content_requests
    set clarification_required = true,
        clarification_message = coalesce(p_payload->>'message', 'Additional information required.'),
        status = 'under_review', updated_at = now()
    where id = v_request_id;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'clarification_requested', 'Clarification requested from partner.', p_payload);
    perform public._gprc292_notify(v_request.tenant_id, v_request_id, 'clarification_required', coalesce(p_payload->>'message', 'Clarification required on your resource request.'));
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'start_production' then
    update public.growth_partner_content_requests
    set status = 'in_production', production_progress = greatest(production_progress, 10), updated_at = now()
    where id = v_request_id;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'production_advanced', 'Content creation started.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'advance_production' then
    update public.growth_partner_content_requests
    set production_progress = least(100, production_progress + coalesce((p_payload->>'progress_delta')::int, 25)),
        status = case when production_progress + coalesce((p_payload->>'progress_delta')::int, 25) >= 100
          then 'internal_review' else 'in_production' end,
        updated_at = now()
    where id = v_request_id;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'production_advanced', 'Production progress updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'publish_request' then
    v_category := public._gprc292_asset_category(v_request.resource_type);
    insert into public.growth_partner_marketing_assets (
      asset_name, category, language, version, status, file_format, metadata
    ) values (
      v_request.request_title,
      v_category,
      v_request.language,
      '1.0',
      'published',
      'pdf',
      jsonb_build_object('content_request_id', v_request_id, 'delivery_method', coalesce(p_payload->>'delivery_method', v_request.delivery_method))
    ) returning id into v_asset_id;

    update public.growth_partner_content_requests
    set status = 'published', published_asset_id = v_asset_id, published_at = now(),
        delivery_method = coalesce(p_payload->>'delivery_method', delivery_method),
        production_progress = 100, updated_at = now()
    where id = v_request_id;

    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'asset_published', 'Asset published to Marketing Center.', p_payload);
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'request_fulfilled', 'Resource request fulfilled.', p_payload);
    perform public._gprc292_notify(v_request.tenant_id, v_request_id, 'published', 'Your requested asset is now available in the Marketing Center.');
    return jsonb_build_object('ok', true, 'asset_id', v_asset_id);
  end if;

  if p_action = 'archive_published_asset' then
    if v_request.published_asset_id is not null then
      update public.growth_partner_marketing_assets set status = 'archived', updated_at = now()
      where id = v_request.published_asset_id;
    end if;
    perform public._gprc292_log_audit(v_request.tenant_id, v_request_id, 'asset_published', 'Published asset archived.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', p_action;
end; $$;

notify pgrst, 'reload schema';
