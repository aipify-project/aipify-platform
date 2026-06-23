-- P1.03 — resolve ambiguous get_customer_relationship_center() overload (RSI vs CRM517).
-- Keep the CRM517 signature with optional p_section; drop the legacy zero-arg RSI overload.

drop function if exists public.get_customer_relationship_center();
