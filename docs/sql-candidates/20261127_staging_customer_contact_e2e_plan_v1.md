# Staging E2E plan — primary contact write (authorized)

**Status:** `STAGING_CONTACT_E2E_READY_FOR_OWNER_APPROVAL` — PLAN ONLY  
**Project:** Staging `auedugihkduoaikfusqe` only  
**Contact RPC:** already applied (`update_platform_portal_customer_primary_contact`, PR #456) — **do not reinstall**  
**Forbidden:** Production · re-apply contact RPC · mutate the existing 9 customers · email/invoice/Stripe · admin seed without exact owner YES

## Observed Staging state (2026-11-27, read-only)

| Probe | Value |
|-------|--------|
| `platform_admins` | **0 rows** |
| `auth.users` | **10** — all CSP harness `csp-v6-*@example.com`; none are `platform_admins`; no `last_sign_in_at` |
| Contact RPC | present |
| `customers` | **9** rows (stub contact fields null); synthetic QA id **absent** |
| `platform_admin_audit_logs` | 0 |
| Production contact RPC | **absent** (untouched) |

`is_platform_admin()` = exists row in `platform_admins` for `auth.uid()` (does not filter `status`).

## Identity options (not executed)

### Option A — preferred (least privilege, no new auth user)

Promote **one existing unused Staging harness user** into `platform_admins` as `platform_support` / `active`.

| Field | Value |
|-------|--------|
| Candidate auth user | `f4bd3522-8b32-4a62-8563-aa68da907544` |
| Email | `csp-v6-s-f4bd3522-8b32-4a62-8563-aa68da907544@example.com` |
| Role | `platform_support` (not `super_admin`) |
| Status | `active` |
| Why | Already in Staging `auth.users`; never signed in; FK-ready for audit; no Production identity |

**Unauthorized actor (no promote):** `5cdfeccc-d108-4e7a-85fa-7be5fb51e1e0`  
(`csp-v6-b-5cdfeccc-d108-4e7a-85fa-7be5fb51e1e0@example.com`)

### Option B — isolated new auth user (heavier)

Create a Staging-only Auth user (e.g. reserved `@example.com`) **then** insert `platform_admins`. Requires Auth Admin API + SQL. Only if owner rejects Option A.

### Not allowed without separate YES

- Copying Production `platform_admins` / Production auth users  
- Promoting all 10 harness users  
- Granting `super_admin` when `platform_support` suffices  

## Synthetic customer (dedicated — do not touch the 9)

| Field | Value |
|-------|--------|
| id | `aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee` |
| company_id | `null` |
| initial full_name | `Staging Contact QA` |
| initial phone | `+4700000001` |

## Execution steps (after owner YES only)

### 0) Admin link (Option A)

```sql
insert into public.platform_admins (auth_user_id, role, status)
values (
  'f4bd3522-8b32-4a62-8563-aa68da907544',
  'platform_support',
  'active'
)
on conflict (auth_user_id) do update
set role = excluded.role,
    status = 'active';
```

### 1) Create synthetic customer

```sql
insert into public.customers (id, company_id, full_name, phone)
values (
  'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  null,
  'Staging Contact QA',
  '+4700000001'
)
on conflict (id) do update
set full_name = excluded.full_name,
    phone = excluded.phone,
    updated_at = now();
```

Expect: `customers` count **10** (9 existing + 1 synthetic).

### 2) Case A — unauthorized (must fail)

```sql
select set_config('request.jwt.claim.sub', '5cdfeccc-d108-4e7a-85fa-7be5fb51e1e0', true);
select public.update_platform_portal_customer_primary_contact(
  'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  'Should Not Persist', '+4799999999',
  true, true, true, 'unauthorized probe', null
);
```

**Expect:** `forbidden: platform_admin required`  
**Verify:** name/phone unchanged; no audit success for this actor.

### 3) Case B — validation failures as admin (must fail, no mutate)

```sql
select set_config('request.jwt.claim.sub', 'f4bd3522-8b32-4a62-8563-aa68da907544', true);
-- confirmation false → confirmation_required
-- reason 'ab' → invalid_internal_reason
-- phone '123' → invalid_phone
```

### 4) Case C — authorized name+phone + audit (must succeed)

```sql
select set_config('request.jwt.claim.sub', 'f4bd3522-8b32-4a62-8563-aa68da907544', true);
select public.update_platform_portal_customer_primary_contact(
  'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  'Staging Contact QA Updated',
  '+4700000002',
  true, true, true,
  'Staging E2E primary contact update',
  'STAGING-E2E-CONTACT-1'
);
```

**Verify read-back:**

```sql
select full_name, phone from public.customers
where id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
-- Staging Contact QA Updated / +4700000002

select action_type, target_id, metadata->>'reason',
       metadata->'before', metadata->'after', admin_auth_user_id
from public.platform_admin_audit_logs
where action_type = 'customer_primary_contact_update'
  and target_id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'
order by created_at desc
limit 1;
```

### 5) Optional UI smoke (browser)

Only if harness user has a known login path; Core SQL cases A–C are sufficient for this gate. Production UI must not be used.

## Cleanup (synthetic only — never delete the original 9)

```sql
delete from public.platform_admin_audit_logs
where target_type = 'customer'
  and target_id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

delete from public.customers
where id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

-- Revoke E2E admin link only (keeps harness auth.users intact)
delete from public.platform_admins
where auth_user_id = 'f4bd3522-8b32-4a62-8563-aa68da907544';
```

Post-cleanup expect: customers **9**, audit rows for synthetic id **0**, platform_admins **0** (unless owner keeps the admin link).

## Production isolation

All steps target `auedugihkduoaikfusqe` only. Do not run against `qbcqoixhrvhnuwphefvw`. Production still has no contact RPC.

## Exact owner YES (required before any write)

```
JA STAGING CONTACT E2E auedugihkduoaikfusqe promote auth_user=f4bd3522-8b32-4a62-8563-aa68da907544 role=platform_support + synthetic customer aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee + cleanup
```
