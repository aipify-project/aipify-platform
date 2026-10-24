import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type FreezeHashLedgerEntry = {
  path: string;
  manifestSha256: string;
  observedSha256: string;
};

export type FreezeIntegrityIssue = {
  path: string;
  reason: string;
};

type ManifestFile = { path: string; sha256: string };

/** Explain one protected file. Null means the hash is allowed. */
export function explainWebsiteKompisFreezeHash(input: {
  path: string;
  manifestSha256: string;
  actualSha256: string;
  ledger: FreezeHashLedgerEntry | null;
}): string | null {
  const matchesManifest = input.actualSha256 === input.manifestSha256;
  if (matchesManifest && input.ledger) {
    return "drift ledger still lists a file that matches the manifest";
  }
  if (matchesManifest) return null;
  if (!input.ledger) {
    return "protected file hash differs from the manifest and is not in the observed-drift ledger";
  }
  if (input.ledger.manifestSha256 !== input.manifestSha256) {
    return "drift ledger manifest hash does not match the frozen manifest";
  }
  if (input.ledger.observedSha256 !== input.actualSha256) {
    return "protected file changed again after the observed drift was recorded";
  }
  return null;
}

export function checkWebsiteKompisFreezeIntegrity(root: string): FreezeIntegrityIssue[] {
  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(root, "docs/integrations/website-kompis-public-chain-frozen-manifest.json"),
      "utf8",
    ),
  ) as { protectedRuntimeFiles: ManifestFile[] };
  const ledger = JSON.parse(
    fs.readFileSync(
      path.join(root, "docs/integrations/website-kompis-public-chain-observed-drift.json"),
      "utf8",
    ),
  ) as { files: FreezeHashLedgerEntry[] };

  const issues: FreezeIntegrityIssue[] = [];
  const ledgerByPath = new Map(ledger.files.map((file) => [file.path, file]));
  const protectedPaths = new Set(manifest.protectedRuntimeFiles.map((file) => file.path));

  for (const file of manifest.protectedRuntimeFiles) {
    const actualSha256 = createHash("sha256")
      .update(fs.readFileSync(path.join(root, file.path)))
      .digest("hex");
    const reason = explainWebsiteKompisFreezeHash({
      path: file.path,
      manifestSha256: file.sha256,
      actualSha256,
      ledger: ledgerByPath.get(file.path) ?? null,
    });
    if (reason) issues.push({ path: file.path, reason });
  }

  for (const file of ledger.files) {
    if (!protectedPaths.has(file.path)) {
      issues.push({
        path: file.path,
        reason: "drift ledger names a file that is not in the frozen manifest",
      });
    }
  }

  return issues;
}
