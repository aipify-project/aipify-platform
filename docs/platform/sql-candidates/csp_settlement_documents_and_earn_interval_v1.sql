-- PREPARED_ONLY
-- APPLY_BLOCKED until the owner replies YES to this exact file.
-- Accidental execution stops before any schema change.

do $$
begin
  raise exception 'APPLY_BLOCKED csp_settlement_documents_and_earn_interval_v1';
end $$;

-- Scope
-- 1. Numbered commission statement, separate from public.invoices and enterprise_invoices.
-- 2. Read model for paid_at and payment_reference. Today those values exist only inside csp_audit_events.
-- 3. Earn rule: monthly after 2 successful paid periods, annual after the first confirmed annual payment,
--    one-time after the first qualifying payment. No renewal commission.
-- Rollback
-- Drop only csp_settlement_documents and csp_settlement_document_seq.
-- Do not drop csp_monthly_settlements, csp_settlement_lines, csp_commission_ledger, or csp_audit_events.
-- Do not delete a paid settlement row.

-- create sequence public.csp_settlement_document_seq;
--
-- create table public.csp_settlement_documents (
--   id uuid primary key default gen_random_uuid(),
--   settlement_id uuid not null unique references public.csp_monthly_settlements (id) on delete restrict,
--   document_number text not null unique,
--   document_type text not null default 'commission_statement'
--     check (document_type = 'commission_statement'),
--   issued_at timestamptz not null default now(),
--   created_at timestamptz not null default now()
-- );
--
-- alter table public.csp_monthly_settlements
--   add column paid_at timestamptz,
--   add column payment_reference text,
--   add column paid_by uuid;
--
-- csp_transition_settlement must keep the current lock and the current status machine.
-- On p_to = 'paid' it must write paid_at, payment_reference and paid_by on the settlement row
-- and keep the existing idempotent payout ledger key 'csp:payout:' || settlement id.
-- It must not allocate a document number.
-- A separate admin RPC may insert csp_settlement_documents only when:
--   status in ('closed','paid'),
--   line totals match,
--   tax treatment is explicitly supplied,
--   and no document row exists for that settlement.
-- csp_list_monthly_settlements must return document_number, paid_at and payment_reference
-- for the caller's own scope. Platform admin sees every partner. A partner sees only their rows.
--
-- Earn interval belongs in csp_apply_paid_period_event, not in the client:
--   monthly  -> earn on the second successful paid period
--   annual   -> earn on the first confirmed annual payment
--   one_time -> earn on the first qualifying payment
--   refund or chargeback -> reversal review, history retained
-- Until that function is applied, yearly and one-time sales must not be shown as earned.
