-- Fix SECURITY DEFINER warnings on compatibility views.
-- Views in Postgres default to SECURITY DEFINER (run as the view owner),
-- which bypasses RLS of the querying user.
-- Adding security_invoker = true restores the expected RLS behaviour.

create or replace view public.self_healing_runs
  with (security_invoker = true)
as
  select * from public.ai_self_healing_executions;

create or replace view public.community_health_scores
  with (security_invoker = true)
as
select
  id,
  tenant_id,
  health_score,
  contribution_score as intelligence_score,
  calculated_at
from public.community_scores;
