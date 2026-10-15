# AIPIFY_PLATFORM_CUSTOMER_DETAIL_LAYOUT_COMPACTION_V1_RESULT

## Status

**PARTIAL pending CI/merge** — layout compaction implemented; logic unchanged. Fill PR/merge/deploy after LIVE.

## Baseline

| Item | Value |
|---|---|
| Worktree | `/Users/veltrix/Development/aipify-platform-customer-detail-layout-compaction-v1` |
| Branch | `fix/platform-customer-detail-layout-compaction-v1` |
| Base | `origin/main` @ `2db69cf8` |
| Scope | Platform customer detail UI only (`/platform/customers/[id]`) |

## What changed (visual / IA)

1. **Header + KPI strip merged** into one operations card (name, slug/orgnr, status chips, compact metric row).
2. **Denser cards**: `SectionCard` / `MetricCard` / control-plane / tables use tighter padding and type scale.
3. **Desktop grid** `lg:grid-cols-12` — primary column `7/8`, sticky operational aside `5/4`.
4. **Left**: business (IDs in disclosure), agreement, licenses, domains, entitlements, Website Kompis activated services.
5. **Right (sticky)**: contact identity, App Kompis, runtime delivery, Kompis Bedrift, org admin, customer status — still separate cards.
6. Primary actions moved into **section header actions** (manage plan / create license / add domain / activate WK) so CTAs stay visible without bulky footers.

## Explicitly not changed

- No SQL, secrets, auth/role/password, Bedrift/admin execute paths, runtime verification rules, contact-identity PATCH contract, activation gates.
- High-risk confirmations / authorize buttons remain in the same panels.
- No Customer App / UnoNight public surfaces.
- Frozen Website Kompis public chain untouched.

## Testing

| Gate | Result |
|---|---|
| `tsx lib/platform-portal/customer-detail.test.ts` | **PASS** |
| `tsx lib/platform-portal/admin-provisioning.test.ts` | **PASS** |
| `tsx lib/platform-portal/kompis-bedrift-activation.test.ts` | **PASS** |
| `tsx lib/platform-portal/app-kompis-delivery.test.ts` | **PASS** |
| Authenticated runtime visual QA | Pending / may be blocked by Platform login |

## PR / deploy

| Item | Value |
|---|---|
| PR | _pending_ |
| Head | _pending_ |
| Merge SHA | _pending_ |
| Deploy | _pending_ |
