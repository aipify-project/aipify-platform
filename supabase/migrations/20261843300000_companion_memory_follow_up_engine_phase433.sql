-- Phase 433 — Companion Memory & Follow-Up Engine (Customer App)
-- Route: /app/companion/memory · Builds on PAME + Phase 328 follow-ups

create table if not exists public.companion_memory_center_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  commitment_detection_enabled boolean not null default true,
  proactive_follow_up_enabled boolean not null default true,
  executive_dashboard_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.companion_memory_commitments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  memory_category text not null check (memory_category in (
    'personal', 'business', 'customer', 'finance', 'projects', 'legal', 'operations'
  )),
  section_key text not null default 'personal_reminders' check (section_key in (
    'personal_reminders', 'business_reminders', 'follow_ups', 'scheduled_actions', 'archived'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_type text not null default 'user_commitment',
  owner_label text not null default '',
  status_key text not null default 'waiting' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'archived', 'snoozed'
  )),
  suggested_action text not null default '',
  due_at timestamptz,
  snoozed_until timestamptz,
  personal_memory_id uuid references public.personal_memories (id) on delete set null,
  follow_up_id uuid references public.companion_follow_up_records (id) on delete set null,
  detection_phrase text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companion_memory_commitments_org_idx
  on public.companion_memory_commitments (organization_id, user_id, section_key, status_key, updated_at desc);

create table if not exists public.companion_memory_center_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists companion_memory_center_audit_org_idx
  on public.companion_memory_center_audit (organization_id, created_at desc);

alter table public.companion_memory_center_settings enable row level security;
alter table public.companion_memory_commitments enable row level security;
alter table public.companion_memory_center_audit enable row level security;
revoke all on public.companion_memory_center_settings from authenticated, anon;
revoke all on public.companion_memory_commitments from authenticated, anon;
revoke all on public.companion_memory_center_audit from authenticated, anon;

create or replace function public._cm433_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_ctx jsonb;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  begin
    v_ctx := public._cfu328_access();
  exception when others then
    v_ctx := jsonb_build_object('can_executive', false, 'can_team', false);
  end;
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  return jsonb_build_object(
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'tenant_id', v_org_id,
    'role', v_role,
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_team', coalesce(v_ctx->>'can_team', 'false') = 'true'
  );
end; $$;

create or replace function public._cm433_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_memory_center_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._cm433_memory_item_json(
  p_id uuid, p_title text, p_summary text, p_source text, p_owner text,
  p_status text, p_section text, p_category text, p_created timestamptz,
  p_updated timestamptz, p_suggested text default '', p_due timestamptz default null,
  p_item_type text default 'commitment'
) returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', p_id, 'title', p_title, 'summary', p_summary, 'source', p_source,
    'owner', p_owner, 'status_key', p_status, 'section_key', p_section,
    'memory_category', p_category, 'created_at', p_created, 'last_activity_at', p_updated,
    'suggested_action', p_suggested, 'due_at', p_due, 'item_type', p_item_type
  );
$$;

create or replace function public._cm433_seed_commitments(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.companion_memory_commitments
    where organization_id = p_org_id and user_id = p_user_id limit 1
  ) then
    return;
  end if;

  insert into public.companion_memory_commitments (
    organization_id, user_id, memory_category, section_key, title, summary,
    source_type, owner_label, status_key, suggested_action, due_at, detection_phrase
  ) values
    (p_org_id, p_user_id, 'personal', 'personal_reminders',
     'Call the supplier', 'Remember to call the supplier tomorrow.',
     'user_commitment', 'You', 'waiting', 'Call Supplier X today.', now() + interval '1 day',
     'Remember to call the supplier tomorrow.'),
    (p_org_id, p_user_id, 'business', 'business_reminders',
     'Review contract before Friday', 'You wanted to review this agreement before Friday.',
     'user_commitment', 'You', 'requires_attention', 'Open contract review today.', now() + interval '3 days',
     'Remind me to review this contract next week.'),
    (p_org_id, p_user_id, 'finance', 'business_reminders',
     'Invoice follow-up', 'The invoice is still unpaid.',
     'companion_detection', 'You', 'requires_attention', 'Review outstanding invoice.', now() + interval '1 day',
     'The invoice is still unpaid.');
end; $$;

create or replace function public.detect_companion_commitment(p_text text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_lower text := lower(trim(coalesce(p_text, '')));
  v_category text := 'personal';
  v_section text := 'personal_reminders';
  v_title text;
  v_confidence text := 'medium';
begin
  perform public._cm433_access();

  if v_lower = '' then
    return jsonb_build_object('detected', false, 'reason', 'empty_text');
  end if;

  if v_lower ~ '(customer|client|proposal|invoice|supplier|vendor|contract|agreement)' then
    v_category := case
      when v_lower ~ 'invoice|payment|unpaid' then 'finance'
      when v_lower ~ 'customer|client|proposal' then 'customer'
      when v_lower ~ 'contract|agreement|legal' then 'legal'
      else 'business'
    end;
    v_section := case when v_category = 'personal' then 'personal_reminders' else 'business_reminders' end;
  end if;

  if v_lower ~ '(project|milestone|deliverable)' then v_category := 'projects'; v_section := 'business_reminders'; end if;
  if v_lower ~ '(operations|process|workflow)' then v_category := 'operations'; v_section := 'business_reminders'; end if;

  if v_lower ~ '(did you ever|have you heard back|send that email|contact.*last)' then
    v_confidence := 'high';
    v_section := 'follow_ups';
    v_category := coalesce(nullif(v_category, 'personal'), 'customer');
  end if;

  if v_lower ~ '(remember|remind|don''t let me forget|do not let me forget|follow up|i will|i need to|need to)' then
    v_confidence := 'high';
    v_title := left(trim(p_text), 200);
    return jsonb_build_object(
      'detected', true,
      'confidence', v_confidence,
      'memory_category', v_category,
      'section_key', v_section,
      'title', v_title,
      'summary', left(trim(p_text), 500),
      'suggested_action', case
        when v_lower ~ 'call' then 'Schedule or complete the call today.'
        when v_lower ~ 'email|send' then 'Send the email or confirm it was sent.'
        when v_lower ~ 'review' then 'Review the item before the due date.'
        else 'Add a reminder and follow up when appropriate.'
      end,
      'requires_confirmation', true,
      'privacy_note', 'Aipify will ask before storing commitments unless you have already confirmed.'
    );
  end if;

  return jsonb_build_object('detected', false, 'reason', 'no_commitment_pattern');
end; $$;

create or replace function public.create_companion_memory_commitment(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_id uuid;
begin
  v_ctx := public._cm433_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.companion_memory_commitments (
    organization_id, user_id, memory_category, section_key, title, summary,
    source_type, owner_label, status_key, suggested_action, due_at, detection_phrase
  ) values (
    v_org_id, v_user_id,
    coalesce(p_payload->>'memory_category', 'personal'),
    coalesce(p_payload->>'section_key', 'personal_reminders'),
    left(coalesce(p_payload->>'title', 'Commitment'), 200),
    left(coalesce(p_payload->>'summary', ''), 500),
    coalesce(p_payload->>'source_type', 'user_commitment'),
    coalesce(p_payload->>'owner_label', 'You'),
    coalesce(p_payload->>'status_key', 'waiting'),
    left(coalesce(p_payload->>'suggested_action', ''), 500),
    nullif(p_payload->>'due_at', '')::timestamptz,
    left(coalesce(p_payload->>'detection_phrase', ''), 500)
  ) returning id into v_id;

  perform public._cm433_log(v_org_id, v_user_id, 'commitment', v_id, 'created', 'Companion memory commitment recorded');

  return jsonb_build_object('ok', true, 'id', v_id);
end; $$;

create or replace function public.manage_companion_memory_item(
  p_item_type text,
  p_item_id uuid,
  p_action text,
  p_patch jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._cm433_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('complete', 'snooze', 'archive', 'delete', 'edit') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'commitment' then
    if p_action = 'delete' then
      delete from public.companion_memory_commitments
      where id = p_item_id and organization_id = v_org_id and user_id = v_user_id;
    elsif p_action = 'complete' then
      update public.companion_memory_commitments set
        status_key = 'completed', completed_at = now(), last_activity_at = now(), updated_at = now()
      where id = p_item_id and organization_id = v_org_id and user_id = v_user_id;
    elsif p_action = 'archive' then
      update public.companion_memory_commitments set
        status_key = 'archived', section_key = 'archived', archived_at = now(), last_activity_at = now(), updated_at = now()
      where id = p_item_id and organization_id = v_org_id and user_id = v_user_id;
    elsif p_action = 'snooze' then
      update public.companion_memory_commitments set
        status_key = 'snoozed',
        snoozed_until = coalesce(nullif(p_patch->>'snoozed_until', '')::timestamptz, now() + interval '1 day'),
        last_activity_at = now(), updated_at = now()
      where id = p_item_id and organization_id = v_org_id and user_id = v_user_id;
    elsif p_action = 'edit' then
      update public.companion_memory_commitments set
        title = coalesce(nullif(p_patch->>'title', ''), title),
        summary = coalesce(nullif(p_patch->>'summary', ''), summary),
        suggested_action = coalesce(nullif(p_patch->>'suggested_action', ''), suggested_action),
        last_activity_at = now(), updated_at = now()
      where id = p_item_id and organization_id = v_org_id and user_id = v_user_id;
    end if;
  elsif p_item_type = 'personal_memory' then
    perform public.update_personal_memory_status(p_item_id,
      case p_action
        when 'complete' then 'completed'
        when 'archive' then 'archived'
        when 'delete' then 'deleted'
        when 'snooze' then 'paused'
        else 'active'
      end);
  elsif p_item_type = 'follow_up' then
    perform public.update_companion_follow_up(
      p_item_id,
      case p_action
        when 'complete' then 'completed'
        when 'archive' then 'archived'
        else null
      end,
      null,
      null,
      null,
      null,
      case p_action
        when 'complete' then 'complete'
        when 'archive' then 'archive'
        when 'snooze' then 'postpone'
        else null
      end,
      case when p_action = 'snooze' then 'snooze' else null end,
      case
        when p_action = 'snooze' then coalesce(nullif(p_patch->>'snoozed_until', '')::date, current_date + 1)
        else null
      end
    );
  end if;

  perform public._cm433_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Memory item updated');

  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

create or replace function public.get_companion_memory_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_tenant_id uuid;
  v_personal jsonb; v_business jsonb; v_followups jsonb; v_scheduled jsonb; v_archived jsonb;
  v_suggestions jsonb; v_executive jsonb := '{}'::jsonb;
begin
  v_ctx := public._cm433_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_tenant_id := v_org_id;

  insert into public.companion_memory_center_settings (organization_id) values (v_org_id) on conflict do nothing;
  perform public._cm433_seed_commitments(v_org_id, v_user_id);
  perform public._cfu328_seed_follow_ups(v_org_id, v_user_id);

  select coalesce(jsonb_agg(
    public._cm433_memory_item_json(
      m.id, m.title, m.description, 'pame', coalesce(u.full_name, 'You'),
      case m.status when 'completed' then 'completed' when 'paused' then 'waiting' else 'waiting' end,
      'personal_reminders', 'personal', m.created_at, m.updated_at,
      'Review reminder', m.memory_date, 'personal_memory'
    ) order by m.updated_at desc), '[]'::jsonb)
  into v_personal
  from public.personal_memories m
  left join public.users u on u.id = m.user_id
  where m.tenant_id = v_tenant_id and m.user_id = v_user_id
    and m.status in ('active', 'paused') and m.category in ('tasks', 'events');

  select coalesce(jsonb_agg(
    public._cm433_memory_item_json(
      c.id, c.title, c.summary, c.source_type, c.owner_label, c.status_key,
      c.section_key, c.memory_category, c.created_at, c.last_activity_at,
      c.suggested_action, c.due_at, 'commitment'
    ) order by c.last_activity_at desc), '[]'::jsonb)
  into v_business
  from public.companion_memory_commitments c
  where c.organization_id = v_org_id and c.user_id = v_user_id
    and c.section_key = 'business_reminders' and c.status_key not in ('archived', 'completed');

  v_personal := v_personal || coalesce((
    select jsonb_agg(public._cm433_memory_item_json(
      c.id, c.title, c.summary, c.source_type, c.owner_label, c.status_key,
      'personal_reminders', c.memory_category, c.created_at, c.last_activity_at,
      c.suggested_action, c.due_at, 'commitment'
    ) order by c.last_activity_at desc)
    from public.companion_memory_commitments c
    where c.organization_id = v_org_id and c.user_id = v_user_id
      and c.section_key = 'personal_reminders' and c.status_key not in ('archived', 'completed')
  ), '[]'::jsonb);

  select coalesce(jsonb_agg(
    public._cm433_memory_item_json(
      f.id, f.title, f.description, f.source_type, f.owner_label,
      case f.status when 'overdue' then 'requires_attention' when 'waiting' then 'waiting' else 'requires_attention' end,
      'follow_ups', f.category, f.created_at, f.updated_at,
      f.recommended_action, f.due_date::timestamptz, 'follow_up'
    ) order by f.updated_at desc), '[]'::jsonb)
  into v_followups
  from public.companion_follow_up_records f
  where f.organization_id = v_org_id and f.user_id = v_user_id
    and f.status not in ('completed', 'archived');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', coalesce(f.title, 'Scheduled reminder'), 'summary', r.reminder_type,
    'source', 'reminder_scheduler', 'owner', 'You', 'status_key', 'waiting',
    'section_key', 'scheduled_actions', 'reminder_date', r.reminder_date,
    'item_type', 'scheduled_action', 'follow_up_id', r.follow_up_id
  ) order by r.reminder_date nulls last), '[]'::jsonb)
  into v_scheduled
  from public.companion_follow_up_reminders r
  join public.companion_follow_up_records f on f.id = r.follow_up_id
  where r.organization_id = v_org_id and r.user_id = v_user_id and r.status = 'scheduled';

  select coalesce(jsonb_agg(
    public._cm433_memory_item_json(
      c.id, c.title, c.summary, c.source_type, c.owner_label, 'archived',
      'archived', c.memory_category, c.created_at, coalesce(c.archived_at, c.updated_at),
      '', null, 'commitment'
    ) order by c.archived_at desc nulls last), '[]'::jsonb)
  into v_archived
  from public.companion_memory_commitments c
  where c.organization_id = v_org_id and c.user_id = v_user_id and c.status_key = 'archived';

  select coalesce(jsonb_agg(jsonb_build_object(
    'status_key', case when f.status = 'overdue' then 'requires_attention' else 'waiting' end,
    'title', f.title,
    'summary', f.explanation,
    'suggested_action', f.recommended_action,
    'companion_prompt', case
      when f.detection_type = 'customer_follow_up' then 'Did you ever send that proposal?'
      when f.status = 'waiting' then 'Have you heard back from the customer?'
      else 'Would you like Aipify to remind you again next week?'
    end
  ) order by f.due_date nulls last), '[]'::jsonb)
  into v_suggestions
  from public.companion_follow_up_records f
  where f.organization_id = v_org_id and f.user_id = v_user_id
    and f.status in ('open', 'overdue', 'waiting', 'pending') limit 8;

  if coalesce(v_ctx->>'can_executive', 'false') = 'true' then
    select jsonb_build_object(
      'overdue_commitments', count(*) filter (where status = 'overdue'),
      'open_follow_ups', count(*) filter (where status in ('open','pending','waiting')),
      'missed_actions', count(*) filter (where status = 'overdue' and detection_type = 'uncompleted_commitment'),
      'outstanding_approvals', count(*) filter (where category = 'approval_requests' and status != 'completed'),
      'items', coalesce(jsonb_agg(public._cfu328_item_json(r) order by r.due_date nulls first), '[]'::jsonb)
    ) into v_executive
    from public.companion_follow_up_records r
    where r.organization_id = v_org_id and r.status not in ('archived', 'completed');
  end if;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Aipify remembers what matters and follows up with care — humans decide.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'sections', jsonb_build_object(
      'personal_reminders', v_personal,
      'business_reminders', v_business,
      'follow_ups', v_followups,
      'scheduled_actions', v_scheduled,
      'archived_memories', v_archived
    ),
    'follow_up_suggestions', v_suggestions,
    'executive_dashboard', v_executive,
    'statistics', jsonb_build_object(
      'personal_count', jsonb_array_length(v_personal),
      'business_count', jsonb_array_length(v_business),
      'follow_up_count', jsonb_array_length(v_followups),
      'scheduled_count', jsonb_array_length(v_scheduled),
      'archived_count', jsonb_array_length(v_archived)
    ),
    'privacy_note', 'Metadata only — Aipify never stores raw chat transcripts in the memory center.'
  );
end; $$;

grant execute on function public.get_companion_memory_center() to authenticated;
grant execute on function public.detect_companion_commitment(text) to authenticated;
grant execute on function public.create_companion_memory_commitment(jsonb) to authenticated;
grant execute on function public.manage_companion_memory_item(text, uuid, text, jsonb) to authenticated;
