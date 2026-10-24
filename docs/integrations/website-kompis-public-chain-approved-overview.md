# Website Kompis — approved behavior and freeze gate

This overview does not replace the frozen contract or its manifest. It says what is already accepted, what has drifted, and how a later change is allowed.

## What is frozen

| Kind | Record | What it locks |
|---|---|---|
| Owner-accepted visitor behavior | PR #146, merge `4b7fd0b8`, deploy `dpl_EdcvpRZ5wqstwhjRgBcVr5eiRdUG` | The public ask chain and the four accepted questions on that deploy |
| File manifest | `website-kompis-public-chain-frozen-manifest.json`, last manifest commit `9fba6af8` | SHA256 of 46 protected runtime files |
| Separate, already live | PR #302, PR #303, PR #304 | FAQ review/publish, source chips without a fake link, library totals |

File freeze, behavior freeze, and a fresh site index are different. A stale index is not proof that a protected file changed.

## Observed drift, not a new baseline

Five protected files on current main do not match the manifest. The mismatch was already present when `9fba6af8` committed the manifest. No later commit edited those five files. The ledger is `website-kompis-public-chain-observed-drift.json`.

| File | Introduced by | What changed |
|---|---|---|
| `components/embed/WebsiteKompisEmbedWidget.tsx` | PR #272 `c2757397` | Page content locale is sent and shown on the reply |
| `lib/marketing/public-companion-ask.ts` | PR #272 `c2757397` | Ask locale follows the content-language set |
| `lib/marketing/website-kompis-public-answer-policy.ts` | PR #272 `c2757397` | Missing-price sentence is English unless the locale is `no` or `es` |
| `lib/marketing/website-kompis-install-config.ts` | PR #272 `c2757397` | Saved site locale uses the content-language set |
| `lib/marketing/website-kompis-answer-feedback-server.ts` | PR #275 `c20fd8a2` | Feedback overview reads review status; close stays gated |

These rows are an observation so the next edit fails the gate. They do not re-accept the chain.

## Gate

`checkWebsiteKompisFreezeIntegrity` runs at the start of `scripts/validate-deployment.ts`, so a production build stops when a protected file changes without a ledger update. `website-kompis-freeze-integrity.test.ts` checks the same rule and the private-path deny list.

## How a change is approved

1. The task names **Website Kompis Public Chain** and the intended delta.
2. Acceptance tests stay green, or the changed expectation is updated in the same change.
3. The manifest hash and this drift ledger are updated together.
4. SQL, ingest, secrets, and Production data stay out unless that task approves them separately.

## Not live

The local source-selection candidate `8cb60db8` is not on main. Its patch against `3ea17025` is 16 files, SHA256 `2be4cd5ed80a503ce8c68dec537c2f5f823e1376c539fb3bf752934d5387aa50`. It changes five protected product files so published FAQ and the current page stay on the verified host, private paths stay out, and the safe fallback has no fake source chip. It is not a Production release.

The alias SQL candidate is not applied. It does not refresh stale documents.
