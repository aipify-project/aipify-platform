-- SQL CANDIDATE — NOT APPLIED
-- Task: AIPIFY_UNIFIED_SUPPORT_STAGING_DEPENDENCY_PREFLIGHT_V1
-- Target: Staging auedugihkduoaikfusqe only (separate Production YES later if needed)
-- Purpose: Minimal DDL so Platform public-reply can persist customer_visible inbox rows.
--
-- WHY THIS EXISTS (instead of applying phase271 / full portal_reply now):
--   Staging lacks organization_users, organization_user_context, and
--   _apsf260_require_app_access(). Full phase271 APP RPCs would install but fail
--   at runtime. Full portal_reply also CREATE OR REPLACE reply/publish RPCs that
--   call _apsr271_* (same dependency). This file creates ONLY the messages table.
--
-- Extracted (byte-compatible column contract) from:
--   docs/platform/sql-candidates/customer_self_service_support_profile_portal_reply_v1.sql
--   (SHA a88052557f7f6e1694a824a3702b22bd0e68af5d7d0833aef823203c88874e1e)
-- Does NOT: APP reply RPCs, publish RPC, personal profile RPC, email, Intake V3,
--           phase271, #459, #383.
-- Safe with Intake V3: references app_portal_support_requests only; no channel/partner alters.
--
-- Gate: exact owner YES. Recompute SHA256 after any edit.

create table if not exists public.app_portal_support_request_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.app_portal_support_requests(id) on delete cascade,
  company_id uuid not null,
  author_user_id uuid not null,
  author_role text not null check (author_role in ('customer', 'support')),
  visibility text not null default 'customer_visible'
    check (visibility = 'customer_visible'),
  body text not null check (char_length(body) between 1 and 5000),
  email_status text not null default 'not_sent'
    check (email_status in ('not_sent', 'not_applicable')),
  created_at timestamptz not null default now()
);

create index if not exists app_portal_support_request_messages_request_created_idx
  on public.app_portal_support_request_messages (request_id, created_at);

alter table public.app_portal_support_request_messages enable row level security;
revoke all on public.app_portal_support_request_messages from public, anon, authenticated;

-- ROLLBACK (owner-only):
--   drop table if exists public.app_portal_support_request_messages;
