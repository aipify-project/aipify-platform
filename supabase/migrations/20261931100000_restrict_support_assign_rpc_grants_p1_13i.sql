-- P1.13I — Restrict assign_support_case RPC grants (authenticated session callers only).
-- Feature owner: CUSTOMER APP. Function body unchanged — grants only.

revoke all on function public.assign_support_case(uuid, uuid) from public;
revoke all on function public.assign_support_case(uuid, uuid) from anon;
grant execute on function public.assign_support_case(uuid, uuid) to authenticated;
