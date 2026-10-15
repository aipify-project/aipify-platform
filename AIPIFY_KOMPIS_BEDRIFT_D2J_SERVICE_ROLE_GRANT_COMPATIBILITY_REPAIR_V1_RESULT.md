# AIPIFY — KOMPIS BEDRIFT D2J — SERVICE_ROLE GRANT COMPATIBILITY REPAIR V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS** — privilege regression repaired in new NOT_APPLIED SQL; **READY FOR OWNER APPLY DECISION** on the **new** SHA |
| Production / Staging SQL apply | **NOT performed** |
| Branch | `feat/kompis-bedrift-d2j-service-role-grant-compatibility-repair-v1` |
| Base | `e458f368` (`origin/main`, D2I RESULT) |

This RESULT is **not** owner approval to APPLY SQL.

---

## 1. Before / after privilege contract

| Role | Production today (5-arg) | D2G v1 after DROP/CREATE (would-be) | D2J v1.1 after DROP/CREATE |
|---|---|---|---|
| `authenticated` | EXECUTE | EXECUTE | EXECUTE |
| `service_role` | EXECUTE | **Missing** | EXECUTE |
| `anon` / `PUBLIC` | No | No | No |

| RPC | Production | After v1.1 apply |
|---|---|---|
| Overloads | One 5-arg | One 6-arg (`p_environment_type` default `production`) |
| SECURITY DEFINER + `search_path=public` | Yes | Yes (unchanged intent) |
| Internal create | Impossible (hardcoded production) | Fail-closed (super_admin + helper false) |

---

## 2. File identity

| Item | Value |
|---|---|
| **Apply candidate path** | `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_1_service_role_grant.sql` |
| **Apply candidate SHA-256** | `546c60b949f85097479207de8ad9e1a8bbe313e25e0def7d0f2732db70f78584` |
| Under `supabase/migrations/` | **No** |
| Non-comment lines | 353 |
| **Superseded path (do not apply)** | `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql` |
| **Superseded SHA-256** | `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b` |
| Why old SHA invalid for apply | Omits `GRANT EXECUTE … TO service_role` after dropping the 5-arg overload (D2I finding) |
| Diff vs v1 | Header + single additional `GRANT … TO service_role` + rollback note; enforcement body unchanged |

---

## 3. Tests

| Test | Result |
|---|---|
| Disposable apply v1.1 (`127.0.0.1:55433`, container removed) | **PASS** exit 0 |
| Privilege matrix P01–P08 | **PASS 8/8** (`authenticated`+`service_role` yes; `anon`/`public` no; support/super internal denied; production create ok) |
| D2H security matrix re-run on v1.1 | **PASS 21/21** |
| Static contract tests | **PASS** |
| Frozen WK | **PASS 46/46** |
| Step B stash | **PASS** preserved |
| Platform flags | **PASS** still false/false |
| Production write | **NOT RUN** |

---

## 4. Still not claimed / out of scope

- Stripe / CMS public publish gates (**BLOCKED** separately)
- Helper authorize / Platform RPC connect / sandbox create (**not** in this job)
- LIVE Core enforcement (**not** applied)

---

## 5. OWNER APPLY YES/NO packet

**Authorize a separate named job to apply ONLY:**

- File: `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_1_service_role_grant.sql`
- SHA-256: `546c60b949f85097479207de8ad9e1a8bbe313e25e0def7d0f2732db70f78584`

**What would change on apply:** replace 5-arg create with 6-arg; add fail-closed internal gates + exposure/immutability triggers; grants EXECUTE to `authenticated` **and** `service_role`.

**Must not include:** sandbox create, invite, Bedrift, helper flip, Platform connect, applying superseded SHA `83056fb8…`.

Apply plan: `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_1_APPLY_PLAN.md`.

---

## 6. Next single step

Owner **APPLY YES/NO** for the **v1.1** path + SHA above.
