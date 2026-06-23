-- POST-P1.01 — Companion conversation attachments & active artifact context
-- Feature owner: CUSTOMER APP (shared Companion chat)

create table if not exists public.companion_conversation_attachments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  conversation_id text not null check (char_length(conversation_id) <= 120),
  storage_path text not null check (char_length(storage_path) <= 500),
  original_filename text not null check (char_length(original_filename) <= 180),
  mime_type text not null check (char_length(mime_type) <= 120),
  category text not null check (category in ('image', 'pdf', 'document', 'text', 'other')),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 10485760),
  security_status text not null default 'approved' check (
    security_status in ('pending', 'approved', 'rejected')
  ),
  provenance_source text not null default 'user_upload' check (
    provenance_source in ('user_upload', 'clipboard_paste', 'drag_drop', 'file_picker')
  ),
  metadata jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  retention_expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companion_conversation_attachments_tenant_conv_idx
  on public.companion_conversation_attachments (tenant_id, conversation_id, created_at desc)
  where deleted_at is null;

create index if not exists companion_conversation_attachments_user_idx
  on public.companion_conversation_attachments (tenant_id, user_id, created_at desc)
  where deleted_at is null;

create table if not exists public.companion_conversation_artifact_state (
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  conversation_id text not null check (char_length(conversation_id) <= 120),
  active_attachment_id uuid references public.companion_conversation_attachments (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, user_id, conversation_id)
);

alter table public.companion_conversation_attachments enable row level security;
alter table public.companion_conversation_artifact_state enable row level security;
revoke all on public.companion_conversation_attachments from authenticated, anon;
revoke all on public.companion_conversation_artifact_state from authenticated, anon;

insert into storage.buckets (id, name, public, file_size_limit)
values ('companion-attachments', 'companion-attachments', false, 10485760)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

create or replace function public._companion_attachment_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.register_companion_conversation_attachment(
  p_conversation_id text,
  p_storage_path text,
  p_original_filename text,
  p_mime_type text,
  p_category text,
  p_byte_size bigint,
  p_provenance_source text default 'user_upload',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._companion_attachment_user_id();

  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  if p_byte_size <= 0 or p_byte_size > 10485760 then
    return jsonb_build_object('ok', false, 'error', 'invalid_size');
  end if;

  insert into public.companion_conversation_attachments (
    tenant_id,
    user_id,
    conversation_id,
    storage_path,
    original_filename,
    mime_type,
    category,
    byte_size,
    security_status,
    provenance_source,
    metadata
  ) values (
    v_tenant_id,
    v_user_id,
    left(coalesce(p_conversation_id, ''), 120),
    left(coalesce(p_storage_path, ''), 500),
    left(coalesce(p_original_filename, ''), 180),
    left(coalesce(p_mime_type, ''), 120),
    left(coalesce(p_category, 'other'), 32),
    p_byte_size,
    'approved',
    left(coalesce(p_provenance_source, 'user_upload'), 32),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  insert into public.companion_conversation_artifact_state (
    tenant_id,
    user_id,
    conversation_id,
    active_attachment_id,
    updated_at
  ) values (
    v_tenant_id,
    v_user_id,
    left(coalesce(p_conversation_id, ''), 120),
    v_id,
    now()
  )
  on conflict (tenant_id, user_id, conversation_id) do update
  set active_attachment_id = excluded.active_attachment_id,
      updated_at = now();

  return jsonb_build_object(
    'ok', true,
    'attachment_id', v_id,
    'security_status', 'approved'
  );
exception
  when others then
    return jsonb_build_object('ok', false, 'error', 'insert_failed');
end;
$$;

create or replace function public.list_companion_conversation_attachments(
  p_conversation_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_rows jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._companion_attachment_user_id();

  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant', 'attachments', '[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'attachment_id', a.id,
      'conversation_id', a.conversation_id,
      'original_filename', a.original_filename,
      'mime_type', a.mime_type,
      'category', a.category,
      'byte_size', a.byte_size,
      'security_status', a.security_status,
      'provenance_source', a.provenance_source,
      'created_at', a.created_at,
      'preview_available', a.category in ('image', 'text', 'pdf')
    ) order by a.created_at desc
  ), '[]'::jsonb)
  into v_rows
  from public.companion_conversation_attachments a
  where a.tenant_id = v_tenant_id
    and a.user_id = v_user_id
    and a.conversation_id = left(coalesce(p_conversation_id, ''), 120)
    and a.deleted_at is null;

  return jsonb_build_object('ok', true, 'attachments', v_rows);
end;
$$;

create or replace function public.get_companion_conversation_attachment_access(
  p_attachment_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_row public.companion_conversation_attachments%rowtype;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._companion_attachment_user_id();

  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select *
  into v_row
  from public.companion_conversation_attachments a
  where a.id = p_attachment_id
    and a.deleted_at is null
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  if v_row.tenant_id <> v_tenant_id or v_row.user_id <> v_user_id then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object(
    'ok', true,
    'attachment_id', v_row.id,
    'conversation_id', v_row.conversation_id,
    'storage_path', v_row.storage_path,
    'original_filename', v_row.original_filename,
    'mime_type', v_row.mime_type,
    'category', v_row.category,
    'byte_size', v_row.byte_size,
    'security_status', v_row.security_status,
    'provenance_source', v_row.provenance_source,
    'created_at', v_row.created_at,
    'preview_available', v_row.category in ('image', 'text', 'pdf')
  );
end;
$$;

create or replace function public.set_companion_active_artifact(
  p_conversation_id text,
  p_attachment_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._companion_attachment_user_id();

  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  if not exists (
    select 1
    from public.companion_conversation_attachments a
    where a.id = p_attachment_id
      and a.tenant_id = v_tenant_id
      and a.user_id = v_user_id
      and a.conversation_id = left(coalesce(p_conversation_id, ''), 120)
      and a.deleted_at is null
  ) then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  insert into public.companion_conversation_artifact_state (
    tenant_id,
    user_id,
    conversation_id,
    active_attachment_id,
    updated_at
  ) values (
    v_tenant_id,
    v_user_id,
    left(coalesce(p_conversation_id, ''), 120),
    p_attachment_id,
    now()
  )
  on conflict (tenant_id, user_id, conversation_id) do update
  set active_attachment_id = excluded.active_attachment_id,
      updated_at = now();

  return jsonb_build_object('ok', true, 'active_attachment_id', p_attachment_id);
end;
$$;

create or replace function public.get_companion_active_artifact(
  p_conversation_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_active_id uuid;
  v_row public.companion_conversation_attachments%rowtype;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._companion_attachment_user_id();

  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select s.active_attachment_id
  into v_active_id
  from public.companion_conversation_artifact_state s
  where s.tenant_id = v_tenant_id
    and s.user_id = v_user_id
    and s.conversation_id = left(coalesce(p_conversation_id, ''), 120);

  if v_active_id is null then
    return jsonb_build_object('ok', true, 'active_artifact', null);
  end if;

  select *
  into v_row
  from public.companion_conversation_attachments a
  where a.id = v_active_id
    and a.deleted_at is null
  limit 1;

  if not found then
    return jsonb_build_object('ok', true, 'active_artifact', null);
  end if;

  return jsonb_build_object(
    'ok', true,
    'active_artifact', jsonb_build_object(
      'attachment_id', v_row.id,
      'conversation_id', v_row.conversation_id,
      'label', v_row.original_filename,
      'category', v_row.category,
      'mime_type', v_row.mime_type,
      'byte_size', v_row.byte_size,
      'selected_at', now()
    )
  );
end;
$$;

create or replace function public.soft_delete_companion_conversation_attachment(
  p_attachment_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._companion_attachment_user_id();

  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  update public.companion_conversation_attachments a
  set deleted_at = now(),
      updated_at = now()
  where a.id = p_attachment_id
    and a.tenant_id = v_tenant_id
    and a.user_id = v_user_id
    and a.deleted_at is null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  update public.companion_conversation_artifact_state s
  set active_attachment_id = null,
      updated_at = now()
  where s.tenant_id = v_tenant_id
    and s.user_id = v_user_id
    and s.active_attachment_id = p_attachment_id;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.register_companion_conversation_attachment(
  text, text, text, text, text, bigint, text, jsonb
) to authenticated;
grant execute on function public.list_companion_conversation_attachments(text) to authenticated;
grant execute on function public.get_companion_conversation_attachment_access(uuid) to authenticated;
grant execute on function public.set_companion_active_artifact(text, uuid) to authenticated;
grant execute on function public.get_companion_active_artifact(text) to authenticated;
grant execute on function public.soft_delete_companion_conversation_attachment(uuid) to authenticated;

-- Private bucket — tenant-scoped object paths: {tenant_id}/{user_id}/{conversation_id}/{attachment_id}/{filename}
create policy companion_attachments_select_own
on storage.objects for select
to authenticated
using (
  bucket_id = 'companion-attachments'
  and (storage.foldername(name))[1] = public._presence_tenant_for_auth()::text
  and (storage.foldername(name))[2] = public._companion_attachment_user_id()::text
);

create policy companion_attachments_insert_own
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'companion-attachments'
  and (storage.foldername(name))[1] = public._presence_tenant_for_auth()::text
  and (storage.foldername(name))[2] = public._companion_attachment_user_id()::text
);

create policy companion_attachments_delete_own
on storage.objects for delete
to authenticated
using (
  bucket_id = 'companion-attachments'
  and (storage.foldername(name))[1] = public._presence_tenant_for_auth()::text
  and (storage.foldername(name))[2] = public._companion_attachment_user_id()::text
);
