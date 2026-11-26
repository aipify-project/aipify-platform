-- PREPARED_ONLY — do not apply until exact owner Staging/Production approval.
-- AIPIFY PAYMENT CORE SECURITY V1
-- Closes unintended PostgREST EXECUTE on SECURITY DEFINER payment mutation RPCs.
-- Does not change subscription/commission business rules or function bodies.
-- Safe no-op when a target function is absent (e.g. incomplete Staging schemas).

do $payment_security$
begin
  -- handle_payment_webhook_event: subscription mutations — service_role only.
  if to_regprocedure('public.handle_payment_webhook_event(text, text, jsonb, uuid)') is not null then
    execute $sql$
      revoke all on function public.handle_payment_webhook_event(text, text, jsonb, uuid)
        from public, anon, authenticated, service_role
    $sql$;
    execute $sql$
      grant execute on function public.handle_payment_webhook_event(text, text, jsonb, uuid)
        to service_role
    $sql$;
  end if;

  -- register_trial_payment_method: tenant-scoped install trial helper.
  -- Remove PUBLIC/anon leakage; keep authenticated (tenant gate inside) + service_role (webhook).
  if to_regprocedure('public.register_trial_payment_method(text)') is not null then
    execute $sql$
      revoke all on function public.register_trial_payment_method(text)
        from public, anon, authenticated, service_role
    $sql$;
    execute $sql$
      grant execute on function public.register_trial_payment_method(text)
        to authenticated, service_role
    $sql$;
  end if;
end
$payment_security$;
