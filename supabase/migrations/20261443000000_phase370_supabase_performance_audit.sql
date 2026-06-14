-- Phase 370 — Supabase resource & performance audit (safe, non-destructive)

-- Unread notification counts are fetched frequently by command center and companion presence.
create index if not exists presence_notifications_tenant_unread_created_idx
  on public.presence_notifications (tenant_id, created_at desc)
  where status = 'unread';

-- Engagement events power presence summaries; keep tenant-scoped scans fast.
create index if not exists presence_engagement_events_tenant_created_idx
  on public.presence_engagement_events (tenant_id, created_at desc);

-- Platform admin audit reads are time-ordered.
create index if not exists platform_admin_audit_logs_created_idx
  on public.platform_admin_audit_logs (created_at desc);

comment on index public.presence_notifications_tenant_unread_created_idx is
  'Phase 370: speeds unread notification count queries for presence surfaces.';
