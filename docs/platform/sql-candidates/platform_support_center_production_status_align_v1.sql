-- =============================================================================
-- PREPARED_ONLY → Production Support Center status align V1
-- Additive only: widen app_portal_support_requests.status check to include
-- Support Center write transitions used by platform_support_update_ticket_status
-- and the Platform UI (new, in_progress, waiting_internal).
--
-- Does NOT drop data. Does NOT change other columns/RPCs.
-- =============================================================================

alter table public.app_portal_support_requests
  drop constraint if exists app_portal_support_requests_status_check;

alter table public.app_portal_support_requests
  add constraint app_portal_support_requests_status_check
  check (status = any (array[
    'open'::text,
    'in_review'::text,
    'waiting_for_customer'::text,
    'waiting_for_aipify'::text,
    'resolved'::text,
    'closed'::text,
    'reopened'::text,
    'archived'::text,
    'new'::text,
    'in_progress'::text,
    'waiting_internal'::text
  ]));

select 'PREPARED_ONLY_platform_support_center_production_status_align_v1' as draft_marker;
