-- Phase 272 — Global Announcements & Communication Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.global_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  full_content text not null default '',
  category text not null default 'system_update' check (
    category in (
      'system_update', 'maintenance_notice', 'feature_release', 'security_notification',
      'billing_communication', 'growth_partner_update', 'internal_communication'
    )
  ),
  audience text not null default 'all_customers' check (
    audience in (
      'all_customers', 'trial_customers', 'enterprise_customers', 'growth_partners',
      'super_admins', 'platform_admins', 'internal_teams'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'published', 'expired', 'cancelled', 'archived')
  ),
  delivery_channels jsonb not null default '["in_app","notification_center"]'::jsonb,
  publish_at timestamptz,
  expire_at timestamptz,
  scheduled_at timestamptz,
  requires_approval boolean not null default false,
  approval_status text not null default 'not_required' check (
    approval_status in ('not_required', 'pending', 'approved', 'rejected')
  ),
  created_by text not null default '',
  audience_filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists global_announcements_status_idx
  on public.global_announcements (status, scheduled_at desc nulls last);

create index if not exists global_announcements_category_idx
  on public.global_announcements (category, audience);

create table if not exists public.global_announcement_analytics (
  announcement_id uuid primary key references public.global_announcements (id) on delete cascade,
  views integer not null default 0,
  email_opens integer not null default 0,
  click_rate numeric(5, 2) not null default 0 check (click_rate between 0 and 100),
  delivery_success_rate numeric(5, 2) not null default 100 check (
    delivery_success_rate between 0 and 100
  ),
  updated_at timestamptz not null default now()
);

create table if not exists public.global_announcement_audit_logs (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid references public.global_announcements (id) on delete set null,
  event_type text not null check (
    event_type in (
      'announcement_created', 'announcement_edited', 'announcement_published',
      'announcement_cancelled', 'announcement_archived', 'audience_modified',
      'announcement_scheduled', 'announcement_duplicated', 'announcement_approved'
    )
  ),
  summary text not null,
  actor_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists global_announcement_audit_created_idx
  on public.global_announcement_audit_logs (created_at desc);

alter table public.global_announcements enable row level security;
alter table public.global_announcement_analytics enable row level security;
alter table public.global_announcement_audit_logs enable row level security;

revoke all on public.global_announcements from authenticated, anon;
revoke all on public.global_announcement_analytics from authenticated, anon;
revoke all on public.global_announcement_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._gacc272_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._gacc272_log_audit(
  p_announcement_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.global_announcement_audit_logs (
    announcement_id, event_type, summary, actor_user_id, context
  ) values (
    p_announcement_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end;
$$;

create or replace function public._gacc272_build_row(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_a public.global_announcements;
  v_analytics public.global_announcement_analytics;
begin
  select * into v_a from public.global_announcements where id = p_id;
  if v_a.id is null then return null; end if;

  select * into v_analytics from public.global_announcement_analytics where announcement_id = p_id;

  return jsonb_build_object(
    'id', v_a.id,
    'title', v_a.title,
    'summary', v_a.summary,
    'full_content', v_a.full_content,
    'category', v_a.category,
    'audience', v_a.audience,
    'status', v_a.status,
    'delivery_channels', v_a.delivery_channels,
    'publish_at', v_a.publish_at,
    'expire_at', v_a.expire_at,
    'scheduled_at', v_a.scheduled_at,
    'requires_approval', v_a.requires_approval,
    'approval_status', v_a.approval_status,
    'created_by', v_a.created_by,
    'audience_filters', v_a.audience_filters,
    'created_at', v_a.created_at,
    'analytics', case when v_analytics.announcement_id is null then null else jsonb_build_object(
      'views', v_analytics.views,
      'email_opens', v_analytics.email_opens,
      'click_rate', v_analytics.click_rate,
      'delivery_success_rate', v_analytics.delivery_success_rate
    ) end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed
-- ---------------------------------------------------------------------------
insert into public.global_announcement_audit_logs (event_type, summary)
select * from (values
  ('announcement_created'::text, 'Global announcements center initialized.'),
  ('announcement_published', 'Sample platform communication baseline established.')
) as v(event_type, summary)
where not exists (select 1 from public.global_announcement_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_global_announcement_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_category text;
  v_audience text;
  v_status text;
  v_country text;
  v_language text;
  v_plan text;
  v_overview jsonb;
  v_announcements jsonb;
  v_analytics jsonb;
  v_audit jsonb;
  v_delivery_rate numeric := 98.5;
begin
  perform public._gacc272_require_platform_admin();

  v_category := nullif(p_filters->>'category', '');
  v_audience := nullif(p_filters->>'audience', '');
  v_status := nullif(p_filters->>'status', '');
  v_country := nullif(p_filters->>'country', '');
  v_language := nullif(p_filters->>'language', '');
  v_plan := nullif(p_filters->>'plan', '');

  if not exists (select 1 from public.global_announcements limit 1) then
    insert into public.global_announcements (
      title, summary, full_content, category, audience, status,
      delivery_channels, publish_at, scheduled_at, created_by, requires_approval, approval_status
    ) values
      (
        'Platform maintenance window — March 2026',
        'Scheduled maintenance for core infrastructure upgrades.',
        'Aipify will perform scheduled maintenance to improve platform stability. Services remain available with brief notification delays.',
        'maintenance_notice', 'all_customers', 'published',
        '["in_app","email","dashboard_banner","notification_center"]'::jsonb,
        now() - interval '3 days', now() - interval '5 days', 'Platform Ops', false, 'not_required'
      ),
      (
        'Skills Marketplace experience now available',
        'New premium Skills Marketplace for Business and Enterprise customers.',
        'The Skills Marketplace provides curated operational capabilities with governance and performance insights.',
        'feature_release', 'enterprise_customers', 'published',
        '["in_app","notification_center"]'::jsonb,
        now() - interval '7 days', null, 'Product Team', false, 'not_required'
      ),
      (
        'Q2 Growth Partner program update',
        'Updated commission structure and onboarding materials.',
        'Growth Partners receive refreshed onboarding guides and quarterly performance reporting.',
        'growth_partner_update', 'growth_partners', 'scheduled',
        '["email","notification_center"]'::jsonb,
        null, now() + interval '10 days', 'Partner Success', true, 'pending'
      ),
      (
        'Security advisory — credential rotation reminder',
        'Reminder to review API keys and rotate credentials where appropriate.',
        'As part of ongoing security hygiene, review developer settings and rotate credentials that have not been updated in 90 days.',
        'security_notification', 'all_customers', 'draft',
        '["email","in_app"]'::jsonb,
        null, null, 'Trust & Security', true, 'pending'
      );

    insert into public.global_announcement_analytics (announcement_id, views, email_opens, click_rate, delivery_success_rate)
    select a.id, 1240, 680, 18.5, 99.1
    from public.global_announcements a
    where a.status = 'published'
    limit 1;
  end if;

  update public.global_announcements
  set status = 'expired', updated_at = now()
  where status = 'published'
    and expire_at is not null
    and expire_at < now();

  select coalesce(avg(delivery_success_rate), 98.5) into v_delivery_rate
  from public.global_announcement_analytics;

  select jsonb_build_object(
    'active_announcements', count(*) filter (where status = 'published'),
    'scheduled_messages', count(*) filter (where status = 'scheduled'),
    'draft_messages', count(*) filter (where status = 'draft'),
    'targeted_campaigns', count(*) filter (where audience <> 'all_customers'),
    'delivery_success_rate', round(v_delivery_rate, 1),
    'messages_requiring_review', count(*) filter (
      where requires_approval and approval_status = 'pending'
    )
  ) into v_overview
  from public.global_announcements;

  select coalesce(jsonb_agg(public._gacc272_build_row(a.id) order by a.created_at desc), '[]'::jsonb)
  into v_announcements
  from public.global_announcements a
  where (v_category is null or a.category = v_category)
    and (v_audience is null or a.audience = v_audience)
    and (v_status is null or a.status = v_status)
    and (v_country is null or coalesce(a.audience_filters->>'country', '') = v_country or a.audience_filters->>'country' is null)
    and (v_language is null or coalesce(a.audience_filters->>'language', '') = v_language or a.audience_filters->>'language' is null)
    and (v_plan is null or coalesce(a.audience_filters->>'plan', '') = v_plan or a.audience_filters->>'plan' is null)
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'announcement_id', an.announcement_id,
    'title', a.title,
    'views', an.views,
    'email_opens', an.email_opens,
    'click_rate', an.click_rate,
    'delivery_success_rate', an.delivery_success_rate
  ) order by an.views desc), '[]'::jsonb)
  into v_analytics
  from public.global_announcement_analytics an
  join public.global_announcements a on a.id = an.announcement_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'announcement_id', l.announcement_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.global_announcement_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'Clear, timely communication builds trust across customers, partners, and internal teams.',
    'is_empty', coalesce(jsonb_array_length(v_announcements), 0) = 0,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'announcements', v_announcements,
    'analytics_summary', v_analytics,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_global_announcement_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id uuid;
  v_source public.global_announcements;
  v_new_id uuid;
  v_summary text;
  v_event_type text;
  v_creator text := 'Platform Admin';
begin
  perform public._gacc272_require_platform_admin();

  v_action := p_payload->>'action';
  v_id := nullif(p_payload->>'announcement_id', '')::uuid;

  select coalesce(
    nullif(trim(au.raw_user_meta_data ->> 'full_name'), ''),
    split_part(au.email, '@', 1),
    'Platform Admin'
  ) into v_creator
  from auth.users au where au.id = auth.uid();

  case v_action
    when 'create' then
      insert into public.global_announcements (
        title, summary, full_content, category, audience, status,
        delivery_channels, publish_at, expire_at, scheduled_at,
        requires_approval, approval_status, created_by, audience_filters
      ) values (
        coalesce(p_payload->>'title', 'Untitled announcement'),
        coalesce(p_payload->>'summary', ''),
        coalesce(p_payload->>'full_content', ''),
        coalesce(p_payload->>'category', 'system_update'),
        coalesce(p_payload->>'audience', 'all_customers'),
        'draft',
        coalesce(p_payload->'delivery_channels', '["in_app","notification_center"]'::jsonb),
        nullif(p_payload->>'publish_at', '')::timestamptz,
        nullif(p_payload->>'expire_at', '')::timestamptz,
        nullif(p_payload->>'scheduled_at', '')::timestamptz,
        coalesce((p_payload->>'requires_approval')::boolean, false),
        case when coalesce((p_payload->>'requires_approval')::boolean, false)
          then 'pending' else 'not_required' end,
        v_creator,
        coalesce(p_payload->'audience_filters', '{}'::jsonb)
      ) returning id into v_new_id;
      v_id := v_new_id;
      v_event_type := 'announcement_created';
      v_summary := 'Announcement created: ' || coalesce(p_payload->>'title', 'Untitled');

    when 'edit' then
      update public.global_announcements set
        title = coalesce(p_payload->>'title', title),
        summary = coalesce(p_payload->>'summary', summary),
        full_content = coalesce(p_payload->>'full_content', full_content),
        category = coalesce(p_payload->>'category', category),
        audience = coalesce(p_payload->>'audience', audience),
        delivery_channels = coalesce(p_payload->'delivery_channels', delivery_channels),
        publish_at = coalesce(nullif(p_payload->>'publish_at', '')::timestamptz, publish_at),
        expire_at = coalesce(nullif(p_payload->>'expire_at', '')::timestamptz, expire_at),
        scheduled_at = coalesce(nullif(p_payload->>'scheduled_at', '')::timestamptz, scheduled_at),
        audience_filters = coalesce(p_payload->'audience_filters', audience_filters),
        updated_at = now()
      where id = v_id;
      v_event_type := 'announcement_edited';
      v_summary := 'Announcement edited';

    when 'duplicate' then
      select * into v_source from public.global_announcements where id = v_id;
      insert into public.global_announcements (
        title, summary, full_content, category, audience, status,
        delivery_channels, requires_approval, approval_status, created_by, audience_filters
      ) values (
        v_source.title || ' (Copy)',
        v_source.summary, v_source.full_content, v_source.category, v_source.audience,
        'draft', v_source.delivery_channels, v_source.requires_approval,
        case when v_source.requires_approval then 'pending' else 'not_required' end,
        v_creator, v_source.audience_filters
      ) returning id into v_new_id;
      v_id := v_new_id;
      v_event_type := 'announcement_duplicated';
      v_summary := 'Announcement duplicated';

    when 'publish' then
      update public.global_announcements set
        status = 'published',
        publish_at = coalesce(publish_at, now()),
        approval_status = case
          when requires_approval and approval_status = 'pending' then approval_status
          else 'approved'
        end,
        updated_at = now()
      where id = v_id
        and (not requires_approval or approval_status = 'approved');
      if not found and exists (
        select 1 from public.global_announcements where id = v_id and requires_approval and approval_status = 'pending'
      ) then
        raise exception 'Approval required before publishing';
      end if;
      insert into public.global_announcement_analytics (announcement_id)
      values (v_id) on conflict (announcement_id) do nothing;
      v_event_type := 'announcement_published';
      v_summary := 'Announcement published';

    when 'schedule' then
      update public.global_announcements set
        status = 'scheduled',
        scheduled_at = coalesce(
          nullif(p_payload->>'scheduled_at', '')::timestamptz,
          scheduled_at,
          now() + interval '1 day'
        ),
        updated_at = now()
      where id = v_id;
      v_event_type := 'announcement_scheduled';
      v_summary := 'Announcement scheduled';

    when 'archive' then
      update public.global_announcements set status = 'archived', updated_at = now() where id = v_id;
      v_event_type := 'announcement_archived';
      v_summary := 'Announcement archived';

    when 'cancel' then
      update public.global_announcements set status = 'cancelled', updated_at = now() where id = v_id;
      v_event_type := 'announcement_cancelled';
      v_summary := 'Announcement cancelled';

    when 'approve' then
      update public.global_announcements set
        approval_status = 'approved', updated_at = now()
      where id = v_id and requires_approval;
      v_event_type := 'announcement_approved';
      v_summary := 'Announcement approved for publishing';

    when 'modify_audience' then
      update public.global_announcements set
        audience = coalesce(p_payload->>'audience', audience),
        audience_filters = coalesce(p_payload->'audience_filters', audience_filters),
        updated_at = now()
      where id = v_id;
      v_event_type := 'audience_modified';
      v_summary := 'Announcement audience modified';

    else
      raise exception 'Unknown action: %', v_action;
  end case;

  perform public._gacc272_log_audit(v_id, v_event_type, v_summary, p_payload);

  return public._gacc272_build_row(v_id);
end;
$$;

grant execute on function public.get_global_announcement_center(jsonb) to authenticated;
grant execute on function public.record_global_announcement_action(jsonb) to authenticated;
