# Staging E2E plan — contact write after dependency sync + RPC

**Status:** PLAN ONLY — do not execute until owner JA for (1) dependency sync, (2) contact RPC, (3) E2E.  
**Project:** `auedugihkduoaikfusqe`  
**Forbidden:** Production writes · UnoNight / real customer mutation · email send · invoice mutation

## Prerequisites

| # | Check | Notes |
|---|--------|--------|
| 1 | Dependency sync applied | SHA `5b67e2df…2d5f` verified via read-only probes |
| 2 | Contact RPC applied | SHA `0cf8938b…cd6b` |
| 3 | ≥1 row in `platform_admins` | Staging probe 2026-11-27: **0 admins** — seed/link a Staging Platform Admin identity before authorized E2E (separate controlled step; not part of dependency SQL) |
| 4 | Synthetic customer only | Insert or pick a Staging-only row; never Production IDs |

## Synthetic customer (after dependency sync)

Use a dedicated UUID reserved for QA, e.g. `aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee`.

```sql
-- ONLY after dependency sync; ONLY on Staging; ONLY synthetic id
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

Cleanup after E2E (owner-approved):

```sql
delete from public.platform_admin_audit_logs
where target_type = 'customer'
  and target_id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

delete from public.customers
where id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
```

## Cases

### A — Unauthorized update (must fail)

As a non–platform-admin authenticated session (or `set local role authenticated` without `platform_admins` row for `auth.uid()`):

```sql
select public.update_platform_portal_customer_primary_contact(
  'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  'Should Not Persist',
  '+4799999999',
  true, true, true,
  'unauthorized probe',
  null
);
```

**Expect:** exception `forbidden: platform_admin required` (or equivalent).  
**Verify:** `customers.full_name` / `phone` unchanged; no new audit row for this actor.

### B — Missing confirmation / bad reason (must fail)

As platform admin:

- `p_confirmation = false` → `confirmation_required`
- reason length &lt; 3 → `invalid_internal_reason`
- invalid phone → `invalid_phone`

**Expect:** no row mutation; no audit success row for those attempts.

### C — Authorized update + audit (must succeed)

```sql
select public.update_platform_portal_customer_primary_contact(
  'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  'Staging Contact QA Updated',
  '+4700000002',
  true, true, true,
  'Staging E2E primary contact update',
  'STAGING-E2E-CONTACT-1'
);
```

**Expect:** `ok=true`, `audit_id` present.  
**Verify:**

```sql
select full_name, phone from public.customers
where id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
-- full_name = Staging Contact QA Updated, phone = +4700000002

select action_type, target_id, metadata
from public.platform_admin_audit_logs
where action_type = 'customer_primary_contact_update'
  and target_id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'
order by created_at desc
limit 1;
-- metadata.before / metadata.after / metadata.reason present
```

### D — UI smoke (after Core green)

Platform → Kunde 360 → Kontakt → Oppdater kontakt on synthetic customer.  
APP read path shows same name/phone. Fail-closed `core_gate_pending` must be gone only after RPC apply.

## JA line for E2E (after sync + RPC)

```
JA STAGING E2E CONTACT WRITE on synthetic customer after RPC apply
```
