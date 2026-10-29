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

Five protected files did not match the manifest when `9fba6af8` committed it. Four of them remain observations. `public-companion-ask.ts` was rebaselined again for the owner-approved FAQ-versus-site-index/current-page precedence repair (`AIPIFY_KOMPIS_CORE_FAQ_VS_SITE_INDEX_PRECEDENCE_REPAIR_V1`) and stays out of the drift `files[]` list. The ledger is `website-kompis-public-chain-observed-drift.json`.

| File | Introduced by | What changed |
|---|---|---|
| `components/embed/WebsiteKompisEmbedWidget.tsx` | PR #272 `c2757397` | Page content locale is sent and shown on the reply |
| `lib/marketing/website-kompis-public-answer-policy.ts` | PR #272 `c2757397` | Missing-price sentence is English unless the locale is `no` or `es` |
| `lib/marketing/website-kompis-install-config.ts` | PR #272 `c2757397` | Saved site locale uses the content-language set |
| `lib/marketing/website-kompis-answer-feedback-server.ts` | PR #275 `c20fd8a2` | Feedback overview reads review status; close stays gated |

These remaining rows are an observation so the next edit fails the gate. They do not re-accept the chain.

## Owner-approved source selection, 2026-10-24

The task names Website Kompis Public Chain. The product patch against both `6cbbbe89` and fresh main `5114dcff` is SHA256 `ebfe937e840e230b84cbbba1b96744070199862080a991ae7f1f696d85d40e12`.

| File | Approved SHA256 | Where it is recorded |
|---|---|---|
| `lib/marketing/public-companion-tenant-faq.ts` | `2aff5fc9b817b74f62e5eb2c9e18d430a5a633a8b7cdc0a6f0f21e635892f8ae` | Manifest baseline |
| `lib/marketing/website-kompis-public-page-context.ts` | `998c6297826e264681dc5cefc1e52231a5a561bd644e9cb5145836c03f0bd01b` | Manifest baseline |
| `lib/marketing/website-kompis-grounded-answer.ts` | `e5ae1f56289c7892d93bd5d729038ed153c2fd4a1ac09c31ad8d0782daed6c82` | Manifest baseline |
| `lib/marketing/website-kompis-public-boundary.ts` | `33d11e807f80f2458d23b82b26aa9fdb793c5a6a56051923f2f2ca1e14ff79ca` | Manifest baseline |
| `lib/marketing/public-companion-ask.ts` | `a440a424ff3ba2579b487f55b2ead14bc68b9922cda303dc9471316e3fc63864` | Manifest baseline after FAQ collection observability trace (`AIPIFY_KOMPIS_FAQ_COLLECTION_TRACE_P0`). |
| `lib/marketing/public-companion-tenant-faq.ts` | `ac5c9c680ac5bed0db4e6e495bc2e072ce558576cb04929384de374d35dc9991` | Manifest baseline after FAQ collection observability trace (`AIPIFY_KOMPIS_FAQ_COLLECTION_TRACE_P0`). |
| `lib/marketing/website-kompis-public-ask-trace.ts` | `3ba6f1360f26eeefb786c46abeb8c0316792c5ca2273018ad09b513003d3c91c` | Manifest baseline after FAQ collection observability trace (`AIPIFY_KOMPIS_FAQ_COLLECTION_TRACE_P0`). |

## Gate

`checkWebsiteKompisFreezeIntegrity` runs at the start of `scripts/validate-deployment.ts`, so a production build stops when a protected file changes without a ledger update. `website-kompis-freeze-integrity.test.ts` checks the same rule and the private-path deny list.

## How a change is approved

1. The task names **Website Kompis Public Chain** and the intended delta.
2. Acceptance tests stay green, or the changed expectation is updated in the same change.
3. The manifest hash and this drift ledger are updated together.
4. SQL, ingest, secrets, and Production data stay out unless that task approves them separately.

## Not part of this approval

The site-index alias SQL is not applied. Its SHA256 `f132117cc7ccdbaaff3e251e38ce456b33135bcc41d914c39eeb19b5b4fdef71` is outside this approval. It does not refresh stale documents.
