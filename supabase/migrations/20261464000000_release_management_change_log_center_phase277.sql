-- Phase 277 — Release Management & Change Log Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.release_center_records (
  id uuid primary key default gen_random_uuid(),
  release_name text not null,
  release_version text not null,
  release_type text not null check (
    release_type in (
      'major', 'minor', 'hotfix', 'security_update', 'infrastructure_update', 'experimental'
    )
  ),
  description text not null default '',
  planned_date date,
  actual_date date,
  owner text not null default '',
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'planned' check (
    status in (
      'planned', 'in_development', 'internal_testing', 'customer_validation',
      'approved', 'released', 'rolled_back'
    )
  ),
  audience text not null default 'all_customers' check (
    audience in (
      'all_customers', 'enterprise', 'specific_plans', 'growth_partners', 'internal_teams'
    )
  ),
  target_plans text[] not null default '{}'::text[],
  requires_approval boolean not null default false,
  approval_status text not null default 'not_required' check (
    approval_status in ('not_required', 'pending', 'approved', 'revoked')
  ),
  notifications_pending boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists release_center_records_status_idx
  on public.release_center_records (status, planned_date);

create index if not exists release_center_records_type_idx
  on public.release_center_records (release_type, risk_level);

create table if not exists public.release_center_change_log_entries (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.release_center_records (id) on delete cascade,
  version text not null,
  category text not null check (
    category in (
      'new_feature', 'improvement', 'bug_fix', 'security_update',
      'performance', 'deprecated'
    )
  ),
  summary text not null,
  release_date date,
  status text not null default 'planned' check (
    status in (
      'planned', 'in_development', 'internal_testing', 'customer_validation',
      'approved', 'released', 'rolled_back'
    )
  ),
  audience text not null default 'all_customers' check (
    audience in (
      'all_customers', 'enterprise', 'specific_plans', 'growth_partners', 'internal_teams'
    )
  ),
  created_at timestamptz not null default now()
);

create index if not exists release_center_changelog_release_idx
  on public.release_center_change_log_entries (release_id, release_date desc);

create table if not exists public.release_center_approvals (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.release_center_records (id) on delete cascade,
  approval_role text not null check (
    approval_role in ('super_admin', 'product_owner', 'technical_lead')
  ),
  approver text not null default '',
  status text not null default 'pending' check (status in ('pending', 'granted', 'revoked')),
  notes text not null default '',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists release_center_approvals_release_idx
  on public.release_center_approvals (release_id, status);

create table if not exists public.release_center_communications (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.release_center_records (id) on delete cascade,
  channel text not null check (
    channel in ('customer_portal', 'announcement_center', 'email', 'in_app_notification')
  ),
  audience text not null default 'all_customers' check (
    audience in (
      'all_customers', 'enterprise', 'specific_plans', 'growth_partners', 'internal_teams'
    )
  ),
  status text not null default 'pending' check (status in ('pending', 'published', 'skipped')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists release_center_communications_release_idx
  on public.release_center_communications (release_id, channel);

create table if not exists public.release_center_rollbacks (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.release_center_records (id) on delete cascade,
  rollback_reason text not null,
  impact_assessment text not null default '',
  resolution_notes text not null default '',
  recovery_actions text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists release_center_rollbacks_release_idx
  on public.release_center_rollbacks (release_id, created_at desc);

create table if not exists public.release_center_calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'upcoming_release', 'blackout_period', 'maintenance_window', 'enterprise_notice'
    )
  ),
  title text not null,
  summary text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  release_id uuid references public.release_center_records (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists release_center_calendar_starts_idx
  on public.release_center_calendar_events (starts_at);

create table if not exists public.release_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  release_id uuid references public.release_center_records (id) on delete set null,
  event_type text not null check (
    event_type in (
      'release_created', 'release_modified', 'approval_granted', 'approval_revoked',
      'release_published', 'rollback_initiated', 'communication_published'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists release_center_audit_created_idx
  on public.release_center_audit_logs (created_at desc);

alter table public.release_center_records enable row level security;
alter table public.release_center_change_log_entries enable row level security;
alter table public.release_center_approvals enable row level security;
alter table public.release_center_communications enable row level security;
alter table public.release_center_rollbacks enable row level security;
alter table public.release_center_calendar_events enable row level security;
alter table public.release_center_audit_logs enable row level security;

revoke all on public.release_center_records from authenticated, anon;
revoke all on public.release_center_change_log_entries from authenticated, anon;
revoke all on public.release_center_approvals from authenticated, anon;
revoke all on public.release_center_communications from authenticated, anon;
revoke all on public.release_center_rollbacks from authenticated, anon;
revoke all on public.release_center_calendar_events from authenticated, anon;
revoke all on public.release_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._rmcl277_require_platform_admin()
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

create or replace function public._rmcl277_log_audit(
  p_release_id uuid,
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
  insert into public.release_center_audit_logs (release_id, event_type, summary, context)
  values (p_release_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._rmcl277_requires_approval(p_type text, p_risk text)
returns boolean
language sql
immutable
as $$
  select p_type in ('major', 'security_update') or p_risk in ('high', 'critical');
$$;

create or replace function public._rmcl277_build_release_row(p_release public.release_center_records)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_changelog jsonb;
  v_approvals jsonb;
  v_comms jsonb;
  v_rollback jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id,
    'version', c.version,
    'category', c.category,
    'summary', c.summary,
    'release_date', c.release_date,
    'status', c.status,
    'audience', c.audience
  ) order by c.created_at), '[]'::jsonb)
  into v_changelog
  from public.release_center_change_log_entries c
  where c.release_id = p_release.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'approval_role', a.approval_role,
    'approver', a.approver,
    'status', a.status,
    'notes', a.notes,
    'decided_at', a.decided_at
  ) order by a.created_at), '[]'::jsonb)
  into v_approvals
  from public.release_center_approvals a
  where a.release_id = p_release.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id,
    'channel', c.channel,
    'audience', c.audience,
    'status', c.status,
    'published_at', c.published_at
  ) order by c.created_at), '[]'::jsonb)
  into v_comms
  from public.release_center_communications c
  where c.release_id = p_release.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'rollback_reason', r.rollback_reason,
    'impact_assessment', r.impact_assessment,
    'resolution_notes', r.resolution_notes,
    'recovery_actions', r.recovery_actions,
    'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_rollback
  from public.release_center_rollbacks r
  where r.release_id = p_release.id;

  return jsonb_build_object(
    'id', p_release.id,
    'release_name', p_release.release_name,
    'release_version', p_release.release_version,
    'release_type', p_release.release_type,
    'description', p_release.description,
    'planned_date', p_release.planned_date,
    'actual_date', p_release.actual_date,
    'owner', p_release.owner,
    'risk_level', p_release.risk_level,
    'status', p_release.status,
    'audience', p_release.audience,
    'target_plans', to_jsonb(p_release.target_plans),
    'requires_approval', p_release.requires_approval,
    'approval_status', p_release.approval_status,
    'notifications_pending', p_release.notifications_pending,
    'change_log', v_changelog,
    'approvals', v_approvals,
    'communications', v_comms,
    'rollbacks', v_rollback,
    'created_at', p_release.created_at,
    'updated_at', p_release.updated_at
  );
end;
$$;

create or replace function public._rmcl277_seed_if_empty()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_release_id uuid;
begin
  if exists (select 1 from public.release_center_records limit 1) then return; end if;

  insert into public.release_center_records (
    release_name, release_version, release_type, description,
    planned_date, owner, risk_level, status, audience,
    requires_approval, approval_status, notifications_pending
  ) values
    (
      'Aipify Platform 2026.2', '2026.2.0', 'minor',
      'Customer Journey Analytics, Roadmap Center, and Release Center capabilities.',
      current_date + interval '14 days', 'Platform Product', 'medium', 'internal_testing',
      'all_customers', false, 'not_required', true
    ),
    (
      'Security Patch — Auth Hardening', '2026.1.4', 'security_update',
      'Session validation and enterprise SSO audit improvements.',
      current_date + interval '3 days', 'Trust Team', 'high', 'customer_validation',
      'enterprise', true, 'pending', true
    ),
    (
      'Hotfix — Payment Webhook Retry', '2026.1.3-hotfix', 'hotfix',
      'Emergency fix for intermittent payment webhook retries.',
      current_date - interval '2 days', 'Billing Squad', 'medium', 'released',
      'all_customers', false, 'not_required', false
    ),
    (
      'Infrastructure — Database Migration Window', '2026.1-infra', 'infrastructure_update',
      'Scheduled maintenance for database index optimization.',
      current_date + interval '21 days', 'Platform Ops', 'low', 'planned',
      'all_customers', false, 'not_required', true
    )
  returning id into v_release_id;

  insert into public.release_center_records (
    release_name, release_version, release_type, description,
    planned_date, actual_date, owner, risk_level, status, audience,
    requires_approval, approval_status
  ) values (
    'Aipify Platform 2026.1', '2026.1.0', 'major',
    'Voice of Customer Engine, trust statements, and brand foundation updates.',
    current_date - interval '30 days', current_date - interval '28 days',
    'Platform Product', 'high', 'released', 'all_customers', true, 'approved'
  );

  insert into public.release_center_change_log_entries (release_id, version, category, summary, release_date, status, audience)
  select r.id, r.release_version, 'new_feature', 'Release Center and change log management', r.planned_date, r.status, r.audience
  from public.release_center_records r where r.release_version = '2026.2.0';

  insert into public.release_center_change_log_entries (release_id, version, category, summary, release_date, status, audience)
  select r.id, r.release_version, 'security_update', 'Enterprise SSO audit logging enhancements', r.planned_date, r.status, r.audience
  from public.release_center_records r where r.release_version = '2026.1.4';

  insert into public.release_center_change_log_entries (release_id, version, category, summary, release_date, status, audience)
  select r.id, r.release_version, 'bug_fix', 'Payment webhook retry reliability fix', r.actual_date, r.status, r.audience
  from public.release_center_records r where r.release_version = '2026.1.3-hotfix';

  insert into public.release_center_approvals (release_id, approval_role, approver, status, decided_at)
  select r.id, 'super_admin', 'Platform Super Admin', 'granted', now() - interval '5 days'
  from public.release_center_records r where r.release_version = '2026.1.0';

  insert into public.release_center_approvals (release_id, approval_role, status)
  select r.id, role, 'pending'
  from public.release_center_records r
  cross join (values ('super_admin'), ('product_owner'), ('technical_lead')) as roles(role)
  where r.release_version = '2026.1.4';

  insert into public.release_center_calendar_events (event_type, title, summary, starts_at, ends_at, release_id)
  select 'upcoming_release', r.release_name, r.description, r.planned_date::timestamptz, null, r.id
  from public.release_center_records r where r.status in ('planned', 'internal_testing', 'customer_validation');

  insert into public.release_center_calendar_events (event_type, title, summary, starts_at, ends_at)
  values
    ('blackout_period', 'Holiday Change Freeze', 'No non-critical releases during holiday period.', now() + interval '45 days', now() + interval '52 days'),
    ('maintenance_window', 'Database Maintenance', 'Scheduled index optimization window.', now() + interval '21 days', now() + interval '21 days' + interval '4 hours'),
    ('enterprise_notice', 'Enterprise Notice — Security Patch', '14-day notice for enterprise SSO changes.', now() + interval '7 days', now() + interval '14 days');

  insert into public.release_center_audit_logs (event_type, summary)
  values
    ('release_created', 'Release Management & Change Log Center initialized.'),
    ('release_modified', 'Release calendar and approval workflows ready.');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_release_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_releases jsonb;
  v_changelog jsonb;
  v_calendar jsonb;
  v_audit jsonb;
  v_type text;
  v_status text;
  v_owner text;
  v_audience text;
  v_date_from date;
  v_date_to date;
begin
  perform public._rmcl277_require_platform_admin();
  perform public._rmcl277_seed_if_empty();

  v_type := nullif(p_filters->>'release_type', '');
  v_status := nullif(p_filters->>'status', '');
  v_owner := nullif(p_filters->>'owner', '');
  v_audience := nullif(p_filters->>'audience', '');
  v_date_from := (p_filters->>'date_from')::date;
  v_date_to := (p_filters->>'date_to')::date;

  v_overview := jsonb_build_object(
    'upcoming_releases', (select count(*)::int from public.release_center_records where status in ('planned', 'approved') and planned_date >= current_date),
    'releases_in_testing', (select count(*)::int from public.release_center_records where status in ('internal_testing', 'customer_validation')),
    'production_releases', (select count(*)::int from public.release_center_records where status = 'released'),
    'emergency_hotfixes', (select count(*)::int from public.release_center_records where release_type = 'hotfix' and created_at >= now() - interval '30 days'),
    'notifications_pending', (select count(*)::int from public.release_center_records where notifications_pending = true),
    'recently_completed', (select count(*)::int from public.release_center_records where status = 'released' and actual_date >= current_date - interval '90 days')
  );

  select coalesce(jsonb_agg(public._rmcl277_build_release_row(r) order by r.planned_date desc nulls last), '[]'::jsonb)
  into v_releases
  from public.release_center_records r
  where (v_type is null or r.release_type = v_type)
    and (v_status is null or r.status = v_status)
    and (v_owner is null or r.owner ilike '%' || v_owner || '%')
    and (v_audience is null or r.audience = v_audience)
    and (v_date_from is null or coalesce(r.planned_date, r.actual_date) >= v_date_from)
    and (v_date_to is null or coalesce(r.planned_date, r.actual_date) <= v_date_to);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id,
    'release_id', c.release_id,
    'release_name', r.release_name,
    'version', c.version,
    'category', c.category,
    'summary', c.summary,
    'release_date', c.release_date,
    'status', c.status,
    'audience', c.audience
  ) order by c.release_date desc nulls last), '[]'::jsonb)
  into v_changelog
  from public.release_center_change_log_entries c
  join public.release_center_records r on r.id = c.release_id;

  select coalesce(jsonb_agg(row order by (row->>'starts_at')), '[]'::jsonb)
  into v_calendar
  from (
    select jsonb_build_object(
      'id', e.id,
      'event_type', e.event_type,
      'title', e.title,
      'summary', e.summary,
      'starts_at', e.starts_at,
      'ends_at', e.ends_at,
      'release_id', e.release_id
    ) as row
    from public.release_center_calendar_events e
    where e.starts_at >= now() - interval '7 days'
    order by e.starts_at
    limit 20
  ) sub;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'release_id', l.release_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.release_center_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'Customers should never wonder what changed. Transparency builds trust. Communication reduces uncertainty.',
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'releases', v_releases,
    'change_log', v_changelog,
    'calendar', v_calendar,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_release_center_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_release_id uuid;
  v_release public.release_center_records;
  v_requires boolean;
  v_channel text;
  v_role text;
begin
  perform public._rmcl277_require_platform_admin();

  v_action := p_payload->>'action';
  v_release_id := (p_payload->>'id')::uuid;

  case v_action
    when 'create_release' then
      v_requires := public._rmcl277_requires_approval(
        coalesce(p_payload->>'release_type', 'minor'),
        coalesce(p_payload->>'risk_level', 'medium')
      );
      insert into public.release_center_records (
        release_name, release_version, release_type, description,
        planned_date, owner, risk_level, status, audience,
        requires_approval, approval_status, notifications_pending
      ) values (
        coalesce(p_payload->>'release_name', 'New Release'),
        coalesce(p_payload->>'release_version', '0.0.0'),
        coalesce(p_payload->>'release_type', 'minor'),
        coalesce(p_payload->>'description', ''),
        (p_payload->>'planned_date')::date,
        coalesce(p_payload->>'owner', ''),
        coalesce(p_payload->>'risk_level', 'medium'),
        'planned',
        coalesce(p_payload->>'audience', 'all_customers'),
        v_requires,
        case when v_requires then 'pending' else 'not_required' end,
        true
      )
      returning * into v_release;
      v_release_id := v_release.id;

      if v_requires then
        insert into public.release_center_approvals (release_id, approval_role, status)
        select v_release_id, role, 'pending'
        from (values ('super_admin'), ('product_owner'), ('technical_lead')) as t(role);
      end if;

      insert into public.release_center_calendar_events (
        event_type, title, summary, starts_at, release_id
      ) values (
        'upcoming_release', v_release.release_name, v_release.description,
        coalesce(v_release.planned_date, current_date)::timestamptz, v_release_id
      );

      perform public._rmcl277_log_audit(v_release_id, 'release_created', 'Release created.', p_payload);

    when 'update_status' then
      update public.release_center_records set
        status = coalesce(p_payload->>'status', status),
        actual_date = case
          when coalesce(p_payload->>'status', status) = 'released' then coalesce((p_payload->>'actual_date')::date, current_date)
          else actual_date
        end,
        updated_at = now()
      where id = v_release_id;
      perform public._rmcl277_log_audit(
        v_release_id, 'release_modified',
        coalesce(p_payload->>'summary', 'Release status updated.'), p_payload
      );

    when 'grant_approval' then
      v_role := coalesce(p_payload->>'approval_role', 'super_admin');
      update public.release_center_approvals set
        status = 'granted',
        approver = coalesce(p_payload->>'approver', 'Platform Admin'),
        notes = coalesce(p_payload->>'notes', ''),
        decided_at = now()
      where release_id = v_release_id and approval_role = v_role;

      if not exists (
        select 1 from public.release_center_approvals
        where release_id = v_release_id and status = 'pending'
      ) then
        update public.release_center_records set
          approval_status = 'approved',
          status = case when status = 'customer_validation' then 'approved' else status end,
          updated_at = now()
        where id = v_release_id;
      end if;

      perform public._rmcl277_log_audit(
        v_release_id, 'approval_granted',
        format('Approval granted by %s.', v_role), p_payload
      );

    when 'revoke_approval' then
      v_role := coalesce(p_payload->>'approval_role', 'super_admin');
      update public.release_center_approvals set
        status = 'revoked',
        decided_at = now()
      where release_id = v_release_id and approval_role = v_role;
      update public.release_center_records set
        approval_status = 'revoked',
        updated_at = now()
      where id = v_release_id;
      perform public._rmcl277_log_audit(
        v_release_id, 'approval_revoked',
        format('Approval revoked for %s.', v_role), p_payload
      );

    when 'publish_release' then
      update public.release_center_records set
        status = 'released',
        actual_date = coalesce((p_payload->>'actual_date')::date, current_date),
        notifications_pending = false,
        updated_at = now()
      where id = v_release_id;

      foreach v_channel in array coalesce(
        (select array_agg(value) from jsonb_array_elements_text(coalesce(p_payload->'channels', '[]'::jsonb))),
        array['customer_portal', 'announcement_center', 'in_app_notification']::text[]
      )
      loop
        insert into public.release_center_communications (release_id, channel, audience, status, published_at)
        values (
          v_release_id, v_channel,
          coalesce(p_payload->>'audience', 'all_customers'),
          'published', now()
        );
        perform public._rmcl277_log_audit(
          v_release_id, 'communication_published',
          format('Release communication published via %s.', v_channel),
          jsonb_build_object('channel', v_channel)
        );
      end loop;

      perform public._rmcl277_log_audit(
        v_release_id, 'release_published',
        coalesce(p_payload->>'summary', 'Release published to customers.'), p_payload
      );

    when 'initiate_rollback' then
      insert into public.release_center_rollbacks (
        release_id, rollback_reason, impact_assessment, resolution_notes, recovery_actions
      ) values (
        v_release_id,
        coalesce(p_payload->>'rollback_reason', 'Rollback initiated'),
        coalesce(p_payload->>'impact_assessment', ''),
        coalesce(p_payload->>'resolution_notes', ''),
        coalesce(p_payload->>'recovery_actions', '')
      );
      update public.release_center_records set
        status = 'rolled_back',
        updated_at = now()
      where id = v_release_id;
      perform public._rmcl277_log_audit(
        v_release_id, 'rollback_initiated',
        coalesce(p_payload->>'summary', 'Release rollback initiated.'), p_payload
      );

    when 'add_changelog_entry' then
      insert into public.release_center_change_log_entries (
        release_id, version, category, summary, release_date, status, audience
      )
      select
        v_release_id,
        coalesce(p_payload->>'version', r.release_version),
        coalesce(p_payload->>'category', 'improvement'),
        coalesce(p_payload->>'summary', 'Change log entry'),
        coalesce((p_payload->>'release_date')::date, r.planned_date),
        coalesce(p_payload->>'entry_status', r.status),
        coalesce(p_payload->>'audience', r.audience)
      from public.release_center_records r
      where r.id = v_release_id;
      perform public._rmcl277_log_audit(
        v_release_id, 'release_modified',
        'Change log entry added.', p_payload
      );

    else
      raise exception 'Invalid action';
  end case;

  return public.get_release_center(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_release_center(jsonb) to authenticated;
grant execute on function public.record_release_center_action(jsonb) to authenticated;
