-- Phase 527 — Marketing, Campaigns & Brand Operations Engine
-- Marketing should be measurable. Brands should remain consistent. One marketing execution layer.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketing_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enable_campaigns boolean not null default true,
  enable_brand_governance boolean not null default true,
  enable_partner_materials boolean not null default true,
  require_content_approval boolean not null default true,
  require_asset_approval boolean not null default true,
  companion_marketing_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_marketing_settings enable row level security;
revoke all on public.organization_marketing_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Campaigns
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  campaign_number text,
  name text not null,
  description text not null default '',
  campaign_type text not null default 'custom' check (
    campaign_type in (
      'brand', 'lead_generation', 'product_launch', 'event', 'recruitment',
      'customer_retention', 'partner', 'custom'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'needs_attention', 'paused', 'completed', 'cancelled')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  owner_user_id uuid references public.users (id) on delete set null,
  audience_id uuid,
  budget_amount numeric(14, 2),
  budget_currency text not null default 'NOK',
  start_date date,
  end_date date,
  goals jsonb not null default '[]'::jsonb,
  assets jsonb not null default '[]'::jsonb,
  performance_metrics jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  launched_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, campaign_number)
);

create index if not exists organization_marketing_campaigns_org_idx
  on public.organization_marketing_campaigns (organization_id, status, updated_at desc);

alter table public.organization_marketing_campaigns enable row level security;
revoke all on public.organization_marketing_campaigns from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Audiences
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketing_audiences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  audience_number text,
  name text not null,
  segment text not null default 'custom' check (
    segment in (
      'customers', 'prospects', 'partners', 'employees', 'vendors',
      'newsletter_subscribers', 'custom'
    )
  ),
  size_estimate int not null default 0,
  country text,
  language text,
  industry text,
  customer_type text,
  tags jsonb not null default '[]'::jsonb,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, audience_number)
);

create index if not exists organization_marketing_audiences_org_idx
  on public.organization_marketing_audiences (organization_id, segment, updated_at desc);

alter table public.organization_marketing_audiences enable row level security;
revoke all on public.organization_marketing_audiences from authenticated, anon;

alter table public.organization_marketing_campaigns
  drop constraint if exists organization_marketing_campaigns_audience_id_fkey;

alter table public.organization_marketing_campaigns
  add constraint organization_marketing_campaigns_audience_id_fkey
  foreign key (audience_id) references public.organization_marketing_audiences (id) on delete set null;

-- ---------------------------------------------------------------------------
-- 4. Content
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketing_content (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  content_number text,
  title text not null,
  description text not null default '',
  content_type text not null default 'article' check (
    content_type in (
      'article', 'email', 'newsletter', 'social_post', 'campaign_asset',
      'video', 'image', 'document', 'template'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'revision_required', 'archived')
  ),
  campaign_id uuid references public.organization_marketing_campaigns (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  owner_user_id uuid references public.users (id) on delete set null,
  channel_keys jsonb not null default '[]'::jsonb,
  version int not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, content_number)
);

create index if not exists organization_marketing_content_org_idx
  on public.organization_marketing_content (organization_id, status, updated_at desc);

alter table public.organization_marketing_content enable row level security;
revoke all on public.organization_marketing_content from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Brand assets
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketing_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_number text,
  title text not null,
  description text not null default '',
  asset_type text not null default 'image' check (
    asset_type in (
      'logo', 'brand_guidelines', 'image', 'video', 'icon', 'template',
      'presentation', 'document', 'custom'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'expired', 'archived')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  owner_user_id uuid references public.users (id) on delete set null,
  version int not null default 1,
  expires_at timestamptz,
  file_ref text,
  metadata jsonb not null default '{}'::jsonb,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, asset_number)
);

create index if not exists organization_marketing_assets_org_idx
  on public.organization_marketing_assets (organization_id, status, asset_type);

alter table public.organization_marketing_assets enable row level security;
revoke all on public.organization_marketing_assets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Channels
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketing_channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  channel_key text not null,
  name text not null,
  channel_type text not null default 'custom' check (
    channel_type in (
      'email', 'website', 'blog', 'social_media', 'partner', 'advertising', 'custom'
    )
  ),
  platform text,
  is_active boolean not null default true,
  domain_id uuid references public.organization_domains (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, channel_key)
);

create index if not exists organization_marketing_channels_org_idx
  on public.organization_marketing_channels (organization_id, is_active);

alter table public.organization_marketing_channels enable row level security;
revoke all on public.organization_marketing_channels from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Calendar events & partner materials
-- ---------------------------------------------------------------------------
create table if not exists public.organization_marketing_calendar_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_number text,
  title text not null,
  event_type text not null default 'campaign_launch' check (
    event_type in (
      'campaign_launch', 'content_publication', 'event_date', 'partner_activity',
      'review_deadline', 'custom'
    )
  ),
  campaign_id uuid references public.organization_marketing_campaigns (id) on delete set null,
  content_id uuid references public.organization_marketing_content (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  domain_id uuid references public.organization_domains (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, event_number)
);

create index if not exists organization_marketing_calendar_events_org_idx
  on public.organization_marketing_calendar_events (organization_id, starts_at);

alter table public.organization_marketing_calendar_events enable row level security;
revoke all on public.organization_marketing_calendar_events from authenticated, anon;

create table if not exists public.organization_marketing_partner_materials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  material_number text,
  title text not null,
  description text not null default '',
  material_type text not null default 'campaign_asset' check (
    material_type in ('campaign_asset', 'landing_page', 'tracking_link', 'template', 'custom')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'approved', 'distributed', 'archived')
  ),
  campaign_id uuid references public.organization_marketing_campaigns (id) on delete set null,
  asset_id uuid references public.organization_marketing_assets (id) on delete set null,
  partner_referral_required boolean not null default true,
  referral_link_template text,
  metadata jsonb not null default '{}'::jsonb,
  distributed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, material_number)
);

create index if not exists organization_marketing_partner_materials_org_idx
  on public.organization_marketing_partner_materials (organization_id, status);

alter table public.organization_marketing_partner_materials enable row level security;
revoke all on public.organization_marketing_partner_materials from authenticated, anon;

create table if not exists public.organization_marketing_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_marketing_audit_org_idx
  on public.organization_marketing_audit_logs (organization_id, created_at desc);

alter table public.organization_marketing_audit_logs enable row level security;
revoke all on public.organization_marketing_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._mkt527_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._mkt527_user()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_app_user_id();
$$;

create or replace function public._mkt527_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_marketing_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id,
    public._mkt527_user(),
    p_action, p_summary, p_entity_type, p_entity_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._mkt527_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._mkt527_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_marketing_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Marketing Center
-- ---------------------------------------------------------------------------
create or replace function public.get_marketing_brand_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('marketing.view');
  v_org_id := public._mkt527_org();
  perform public._mkt527_ensure_settings(v_org_id);
  perform public._mkt527_log(v_org_id, 'center_view', 'Marketing Center viewed', 'center', null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Marketing should be measurable. Brands should remain consistent.',
    'philosophy', 'Marketing creates awareness. Relationships create trust. Trust creates customers.',
    'overview', jsonb_build_object(
      'active_campaigns', (
        select count(*) from public.organization_marketing_campaigns
        where organization_id = v_org_id and status = 'active'
      ),
      'needs_attention', (
        select count(*) from public.organization_marketing_campaigns
        where organization_id = v_org_id and status = 'needs_attention'
      ),
      'draft_campaigns', (
        select count(*) from public.organization_marketing_campaigns
        where organization_id = v_org_id and status = 'draft'
      ),
      'audiences', (
        select count(*) from public.organization_marketing_audiences where organization_id = v_org_id
      ),
      'approved_content', (
        select count(*) from public.organization_marketing_content
        where organization_id = v_org_id and status = 'approved'
      ),
      'pending_content_review', (
        select count(*) from public.organization_marketing_content
        where organization_id = v_org_id and status in ('draft', 'review')
      ),
      'approved_assets', (
        select count(*) from public.organization_marketing_assets
        where organization_id = v_org_id and status = 'approved'
      ),
      'active_channels', (
        select count(*) from public.organization_marketing_channels
        where organization_id = v_org_id and is_active = true
      ),
      'partner_materials', (
        select count(*) from public.organization_marketing_partner_materials
        where organization_id = v_org_id and status in ('approved', 'distributed')
      ),
      'upcoming_events', (
        select count(*) from public.organization_marketing_calendar_events
        where organization_id = v_org_id and starts_at >= now()
      ),
      'brand_health_score', least(100, greatest(0,
        (select count(*) from public.organization_marketing_assets
         where organization_id = v_org_id and status = 'approved') * 10 +
        (select count(*) from public.organization_marketing_content
         where organization_id = v_org_id and status = 'approved') * 2
      ))
    ),
    'campaigns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'campaign_number', c.campaign_number, 'name', c.name,
        'campaign_type', c.campaign_type, 'status', c.status,
        'budget_amount', c.budget_amount, 'budget_currency', c.budget_currency,
        'start_date', c.start_date, 'end_date', c.end_date,
        'performance_metrics', c.performance_metrics,
        'domain_id', c.domain_id, 'business_pack_key', c.business_pack_key,
        'updated_at', c.updated_at
      ) order by c.updated_at desc)
      from public.organization_marketing_campaigns c
      where c.organization_id = v_org_id and c.status <> 'cancelled'
      limit 40
    ), '[]'::jsonb),
    'audiences', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'audience_number', a.audience_number, 'name', a.name,
        'segment', a.segment, 'size_estimate', a.size_estimate,
        'country', a.country, 'language', a.language, 'tags', a.tags,
        'updated_at', a.updated_at
      ) order by a.updated_at desc)
      from public.organization_marketing_audiences a
      where a.organization_id = v_org_id
      limit 40
    ), '[]'::jsonb),
    'content', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'content_number', c.content_number, 'title', c.title,
        'content_type', c.content_type, 'status', c.status, 'version', c.version,
        'campaign_id', c.campaign_id, 'channel_keys', c.channel_keys,
        'updated_at', c.updated_at
      ) order by c.updated_at desc)
      from public.organization_marketing_content c
      where c.organization_id = v_org_id and c.status <> 'archived'
      limit 40
    ), '[]'::jsonb),
    'assets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'asset_number', a.asset_number, 'title', a.title,
        'asset_type', a.asset_type, 'status', a.status, 'version', a.version,
        'expires_at', a.expires_at, 'updated_at', a.updated_at
      ) order by a.updated_at desc)
      from public.organization_marketing_assets a
      where a.organization_id = v_org_id and a.status <> 'archived'
      limit 40
    ), '[]'::jsonb),
    'channels', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'channel_key', ch.channel_key, 'name', ch.name,
        'channel_type', ch.channel_type, 'platform', ch.platform, 'is_active', ch.is_active
      ) order by ch.name)
      from public.organization_marketing_channels ch
      where ch.organization_id = v_org_id
      limit 30
    ), '[]'::jsonb),
    'calendar_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'event_number', e.event_number, 'title', e.title,
        'event_type', e.event_type, 'starts_at', e.starts_at, 'ends_at', e.ends_at,
        'campaign_id', e.campaign_id
      ) order by e.starts_at)
      from public.organization_marketing_calendar_events e
      where e.organization_id = v_org_id and e.starts_at >= now() - interval '7 days'
      limit 30
    ), '[]'::jsonb),
    'partner_materials', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'material_number', m.material_number, 'title', m.title,
        'material_type', m.material_type, 'status', m.status,
        'partner_referral_required', m.partner_referral_required,
        'referral_link_template', m.referral_link_template,
        'distributed_at', m.distributed_at
      ) order by m.updated_at desc)
      from public.organization_marketing_partner_materials m
      where m.organization_id = v_org_id and m.status <> 'archived'
      limit 30
    ), '[]'::jsonb),
    'pending_content', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'content_type', c.content_type, 'status', c.status
      ) order by c.updated_at)
      from public.organization_marketing_content c
      where c.organization_id = v_org_id and c.status in ('draft', 'review', 'revision_required')
      limit 20
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'campaign_performance', coalesce((
        select jsonb_agg(jsonb_build_object(
          'name', name, 'status', status,
          'reach', coalesce((performance_metrics->>'reach')::int, 0),
          'leads', coalesce((performance_metrics->>'leads_generated')::int, 0),
          'roi', coalesce((performance_metrics->>'roi')::numeric, 0)
        ) order by updated_at desc)
        from (
          select name, status, performance_metrics, updated_at
          from public.organization_marketing_campaigns
          where organization_id = v_org_id and status in ('active', 'completed')
          order by updated_at desc limit 10
        ) x
      ), '[]'::jsonb),
      'audience_growth', (
        select coalesce(sum(size_estimate), 0) from public.organization_marketing_audiences
        where organization_id = v_org_id
      ),
      'content_approved', (
        select count(*) from public.organization_marketing_content
        where organization_id = v_org_id and status = 'approved'
      ),
      'top_content', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'content_type', content_type) order by updated_at desc)
        from (
          select title, content_type, updated_at from public.organization_marketing_content
          where organization_id = v_org_id and status = 'approved'
          order by updated_at desc limit 5
        ) x
      ), '[]'::jsonb),
      'partner_distributed', (
        select count(*) from public.organization_marketing_partner_materials
        where organization_id = v_org_id and status = 'distributed'
      ),
      'marketing_roi_estimate', coalesce((
        select sum(coalesce((performance_metrics->>'roi')::numeric, 0))
        from public.organization_marketing_campaigns
        where organization_id = v_org_id and status in ('active', 'completed')
      ), 0)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_marketing_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'campaign_statuses', jsonb_build_array('draft', 'active', 'needs_attention', 'paused', 'completed', 'cancelled'),
    'content_statuses', jsonb_build_array('draft', 'review', 'approved', 'revision_required', 'archived'),
    'campaign_types', jsonb_build_array(
      'brand', 'lead_generation', 'product_launch', 'event', 'recruitment',
      'customer_retention', 'partner', 'custom'
    ),
    'sections', jsonb_build_array(
      'overview', 'campaigns', 'content', 'audiences', 'channels', 'assets', 'performance', 'reports'
    ),
    'routes', jsonb_build_object(
      'marketing', '/app/marketing',
      'campaigns', '/app/marketing/campaigns',
      'audiences', '/app/marketing/audiences',
      'content', '/app/marketing/content',
      'assets', '/app/marketing/assets'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_marketing_brand_operations_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_user uuid;
begin
  v_org_id := public._mkt527_org();
  v_user := public._mkt527_user();
  perform public._mkt527_ensure_settings(v_org_id);

  if p_action_type in (
    'create_campaign', 'activate_campaign', 'pause_campaign', 'complete_campaign',
    'create_audience', 'create_content', 'approve_content', 'reject_content',
    'create_asset', 'approve_asset', 'create_channel', 'create_calendar_event',
    'create_partner_material', 'distribute_partner_material', 'update_campaign_metrics'
  ) then
    perform public._irp_require_permission('marketing.manage');
  else
    perform public._irp_require_permission('marketing.view');
  end if;

  if p_action_type = 'create_campaign' then
    insert into public.organization_marketing_campaigns (
      organization_id, campaign_number, name, description, campaign_type, status,
      department_id, domain_id, business_pack_key, owner_user_id, audience_id,
      budget_amount, budget_currency, start_date, end_date, goals
    ) values (
      v_org_id,
      coalesce(p_payload->>'campaign_number', public._mkt527_next_number(v_org_id, 'CMP', 'organization_marketing_campaigns')),
      coalesce(p_payload->>'name', 'Campaign'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'campaign_type', 'custom'),
      'draft',
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user),
      nullif(p_payload->>'audience_id', '')::uuid,
      nullif(p_payload->>'budget_amount', '')::numeric,
      coalesce(p_payload->>'budget_currency', 'NOK'),
      nullif(p_payload->>'start_date', '')::date,
      nullif(p_payload->>'end_date', '')::date,
      coalesce(p_payload->'goals', '[]'::jsonb)
    ) returning id into v_id;
    perform public._mkt527_log(v_org_id, 'campaign_created', 'Campaign created', 'campaign', v_id, p_payload);
    return jsonb_build_object('ok', true, 'campaign_id', v_id);

  elsif p_action_type = 'activate_campaign' then
    v_id := (p_payload->>'campaign_id')::uuid;
    update public.organization_marketing_campaigns set
      status = 'active', launched_at = coalesce(launched_at, now()), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._mkt527_log(v_org_id, 'campaign_activated', 'Campaign activated', 'campaign', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'pause_campaign' then
    v_id := (p_payload->>'campaign_id')::uuid;
    update public.organization_marketing_campaigns set status = 'paused', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._mkt527_log(v_org_id, 'campaign_paused', 'Campaign paused', 'campaign', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'complete_campaign' then
    v_id := (p_payload->>'campaign_id')::uuid;
    update public.organization_marketing_campaigns set
      status = 'completed', completed_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._mkt527_log(v_org_id, 'campaign_completed', 'Campaign completed', 'campaign', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_audience' then
    insert into public.organization_marketing_audiences (
      organization_id, audience_number, name, segment, size_estimate,
      country, language, industry, customer_type, department_id, domain_id, owner_user_id, tags
    ) values (
      v_org_id,
      coalesce(p_payload->>'audience_number', public._mkt527_next_number(v_org_id, 'AUD', 'organization_marketing_audiences')),
      coalesce(p_payload->>'name', 'Audience'),
      coalesce(p_payload->>'segment', 'custom'),
      coalesce((p_payload->>'size_estimate')::int, 0),
      p_payload->>'country',
      p_payload->>'language',
      p_payload->>'industry',
      p_payload->>'customer_type',
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user),
      coalesce(p_payload->'tags', '[]'::jsonb)
    ) returning id into v_id;
    perform public._mkt527_log(v_org_id, 'audience_created', 'Audience created', 'audience', v_id, p_payload);
    return jsonb_build_object('ok', true, 'audience_id', v_id);

  elsif p_action_type = 'create_content' then
    insert into public.organization_marketing_content (
      organization_id, content_number, title, description, content_type, status,
      campaign_id, department_id, domain_id, business_pack_key, owner_user_id, channel_keys
    ) values (
      v_org_id,
      coalesce(p_payload->>'content_number', public._mkt527_next_number(v_org_id, 'CNT', 'organization_marketing_content')),
      coalesce(p_payload->>'title', 'Content'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'content_type', 'article'),
      'draft',
      nullif(p_payload->>'campaign_id', '')::uuid,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user),
      coalesce(p_payload->'channel_keys', '[]'::jsonb)
    ) returning id into v_id;
    perform public._mkt527_log(v_org_id, 'content_created', 'Marketing content created', 'content', v_id, p_payload);
    return jsonb_build_object('ok', true, 'content_id', v_id);

  elsif p_action_type = 'approve_content' then
    v_id := (p_payload->>'content_id')::uuid;
    update public.organization_marketing_content set
      status = 'approved', approved_at = now(), version = version + 1, updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._mkt527_log(v_org_id, 'content_approved', 'Marketing content approved', 'content', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_content' then
    v_id := (p_payload->>'content_id')::uuid;
    update public.organization_marketing_content set
      status = 'revision_required', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._mkt527_log(v_org_id, 'content_rejected', 'Marketing content revision required', 'content', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_asset' then
    insert into public.organization_marketing_assets (
      organization_id, asset_number, title, description, asset_type, status,
      department_id, domain_id, business_pack_key, owner_user_id, file_ref, expires_at
    ) values (
      v_org_id,
      coalesce(p_payload->>'asset_number', public._mkt527_next_number(v_org_id, 'AST', 'organization_marketing_assets')),
      coalesce(p_payload->>'title', 'Asset'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'asset_type', 'image'),
      'draft',
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user),
      p_payload->>'file_ref',
      nullif(p_payload->>'expires_at', '')::timestamptz
    ) returning id into v_id;
    perform public._mkt527_log(v_org_id, 'asset_uploaded', 'Brand asset uploaded', 'asset', v_id, p_payload);
    return jsonb_build_object('ok', true, 'asset_id', v_id);

  elsif p_action_type = 'approve_asset' then
    v_id := (p_payload->>'asset_id')::uuid;
    update public.organization_marketing_assets set
      status = 'approved', approved_at = now(), version = version + 1, updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._mkt527_log(v_org_id, 'asset_approved', 'Brand asset approved', 'asset', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_channel' then
    insert into public.organization_marketing_channels (
      organization_id, channel_key, name, channel_type, platform, is_active, domain_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'channel_key', 'channel-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'name', 'Channel'),
      coalesce(p_payload->>'channel_type', 'custom'),
      p_payload->>'platform',
      coalesce((p_payload->>'is_active')::boolean, true),
      nullif(p_payload->>'domain_id', '')::uuid
    ) returning id into v_id;
    perform public._mkt527_log(v_org_id, 'channel_created', 'Marketing channel created', 'channel', v_id, p_payload);
    return jsonb_build_object('ok', true, 'channel_id', v_id);

  elsif p_action_type = 'create_calendar_event' then
    insert into public.organization_marketing_calendar_events (
      organization_id, event_number, title, event_type, campaign_id, content_id,
      starts_at, ends_at, domain_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'event_number', public._mkt527_next_number(v_org_id, 'CAL', 'organization_marketing_calendar_events')),
      coalesce(p_payload->>'title', 'Marketing event'),
      coalesce(p_payload->>'event_type', 'campaign_launch'),
      nullif(p_payload->>'campaign_id', '')::uuid,
      nullif(p_payload->>'content_id', '')::uuid,
      coalesce(nullif(p_payload->>'starts_at', '')::timestamptz, now()),
      nullif(p_payload->>'ends_at', '')::timestamptz,
      nullif(p_payload->>'domain_id', '')::uuid
    ) returning id into v_id;
    perform public._mkt527_log(v_org_id, 'calendar_event_created', 'Marketing calendar event created', 'calendar', v_id, p_payload);
    return jsonb_build_object('ok', true, 'event_id', v_id);

  elsif p_action_type = 'distribute_partner_material' then
    v_id := (p_payload->>'material_id')::uuid;
    update public.organization_marketing_partner_materials set
      status = 'distributed', distributed_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id and partner_referral_required = true;
    perform public._mkt527_log(v_org_id, 'partner_material_distributed', 'Partner material distributed with referral link', 'partner_material', v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_partner_material' then
    insert into public.organization_marketing_partner_materials (
      organization_id, material_number, title, description, material_type, status,
      campaign_id, asset_id, partner_referral_required, referral_link_template
    ) values (
      v_org_id,
      coalesce(p_payload->>'material_number', public._mkt527_next_number(v_org_id, 'PMT', 'organization_marketing_partner_materials')),
      coalesce(p_payload->>'title', 'Partner material'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'material_type', 'campaign_asset'),
      'draft',
      nullif(p_payload->>'campaign_id', '')::uuid,
      nullif(p_payload->>'asset_id', '')::uuid,
      coalesce((p_payload->>'partner_referral_required')::boolean, true),
      p_payload->>'referral_link_template'
    ) returning id into v_id;
    perform public._mkt527_log(v_org_id, 'partner_material_created', 'Partner material created', 'partner_material', v_id, p_payload);
    return jsonb_build_object('ok', true, 'material_id', v_id);

  elsif p_action_type = 'update_campaign_metrics' then
    v_id := (p_payload->>'campaign_id')::uuid;
    update public.organization_marketing_campaigns set
      performance_metrics = coalesce(performance_metrics, '{}'::jsonb) || coalesce(p_payload->'metrics', '{}'::jsonb),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._mkt527_log(v_org_id, 'campaign_metrics_updated', 'Campaign performance updated', 'campaign', v_id, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_marketing_brand_operations_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('marketing.view');
  v_org_id := public._mkt527_org();
  perform public._mkt527_ensure_settings(v_org_id);

  if p_query is not null and length(trim(p_query)) > 0 then
    perform public._mkt527_log(v_org_id, 'companion_query', 'Companion marketing query', null, null,
      jsonb_build_object('query', trim(p_query)));
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands campaigns, audiences, channels, content, and performance.',
    'query', p_query,
    'active_campaigns', coalesce((
      select jsonb_agg(jsonb_build_object('name', name, 'status', status, 'campaign_type', campaign_type))
      from public.organization_marketing_campaigns
      where organization_id = v_org_id and status = 'active'
      limit 10
    ), '[]'::jsonb),
    'needs_attention', coalesce((
      select jsonb_agg(jsonb_build_object('name', name, 'status', status))
      from public.organization_marketing_campaigns
      where organization_id = v_org_id and status = 'needs_attention'
      limit 5
    ), '[]'::jsonb),
    'top_content', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'content_type', content_type))
      from (
        select title, content_type from public.organization_marketing_content
        where organization_id = v_org_id and status = 'approved'
        order by updated_at desc limit 5
      ) x
    ), '[]'::jsonb),
    'audience_summary', (
      select coalesce(sum(size_estimate), 0) from public.organization_marketing_audiences
      where organization_id = v_org_id
    ),
    'companion_prompts', jsonb_build_array(
      'Show active campaigns.',
      'Which campaigns need attention?',
      'Generate campaign summary.',
      'Show audience growth.',
      'Which content performs best?'
    ),
    'routes', jsonb_build_object(
      'marketing', '/app/marketing',
      'campaigns', '/app/marketing/campaigns',
      'assets', '/app/marketing/assets'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_marketing_brand_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('marketing.view');
  v_org_id := public._mkt527_org();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('marketing.manage', v_org_id),
    'active_campaigns', (
      select count(*) from public.organization_marketing_campaigns
      where organization_id = v_org_id and status = 'active'
    ),
    'pending_content_review', (
      select count(*) from public.organization_marketing_content
      where organization_id = v_org_id and status in ('draft', 'review')
    ),
    'routes', jsonb_build_object(
      'marketing', '/app/marketing',
      'campaigns', '/app/marketing/campaigns',
      'content', '/app/marketing/content',
      'assets', '/app/marketing/assets',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('marketing', '/app/marketing'));
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'marketing', 'Marketing & Brand Operations', 'marketing', 'operations',
    'Campaigns, content, audiences, channels, brand assets, and marketing performance.',
    'growth', null, 'operations', '/app/marketing', 'licensed', 9
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('marketing', 'marketing.view', 'view', 'Marketing — view campaigns, content, assets, and performance'),
    ('marketing', 'marketing.manage', 'manage', 'Marketing — manage campaigns, content approval, assets, and channels')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('marketing', 'marketing.view', 'view', 'Marketing — view campaigns, content, assets, and performance'),
    ('marketing', 'marketing.manage', 'manage', 'Marketing — manage campaigns, content approval, assets, and channels')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_marketing_brand_operations_center(text) to authenticated;
grant execute on function public.perform_marketing_brand_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_marketing_brand_operations_context(text) to authenticated;
grant execute on function public.get_my_marketing_brand_operations_summary() to authenticated;
