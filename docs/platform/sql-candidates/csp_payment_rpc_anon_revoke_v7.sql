-- PREPARED_ONLY
-- APPLY_BLOCKED_UNTIL_SERVICE_ROLE_CLIENT
--
-- P0: Production Core still grants EXECUTE on these SECURITY DEFINER functions
-- to anon (and, through PUBLIC, to any PostgREST role that has not been revoked).
-- handle_payment_webhook_event can change subscription rows for a supplied customer id.
-- PR #365 closed unsigned HTTP webhook access. This file does not apply that fix.
--
-- Do not apply until the signed Stripe webhook route calls the RPC with the
-- service role after signature verification. The current route uses the anon
-- cookie client, so revoking anon would also stop legitimate signed webhooks.
-- No amount, plan, or Stripe secret changes are included.

revoke all on function public.handle_payment_webhook_event(text, text, jsonb, uuid) from public;
revoke all on function public.handle_payment_webhook_event(text, text, jsonb, uuid) from anon;
revoke all on function public.handle_payment_webhook_event(text, text, jsonb, uuid) from authenticated;

revoke all on function public.register_trial_payment_method(text) from public;
revoke all on function public.register_trial_payment_method(text) from anon;
revoke all on function public.register_trial_payment_method(text) from authenticated;

grant execute on function public.handle_payment_webhook_event(text, text, jsonb, uuid) to service_role;
grant execute on function public.register_trial_payment_method(text) to service_role;
