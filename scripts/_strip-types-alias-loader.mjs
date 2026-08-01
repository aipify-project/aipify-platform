import { readFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    for (const candidate of [
      path.join(root, rel + ".ts"),
      path.join(root, rel + ".tsx"),
      path.join(root, rel, "index.ts"),
    ]) {
      if (existsSync(candidate)) {
        return { shortCircuit: true, url: pathToFileURL(candidate).href };
      }
    }
  }

  if (
    specifier.startsWith(".") &&
    !specifier.endsWith(".ts") &&
    !specifier.endsWith(".tsx") &&
    !specifier.endsWith(".js") &&
    !specifier.endsWith(".mjs") &&
    !specifier.endsWith(".json")
  ) {
    const parentDir = context.parentURL
      ? path.dirname(fileURLToPath(context.parentURL))
      : process.cwd();
    for (const ext of [".ts", ".tsx", ".js", ".mjs"]) {
      const candidate = path.join(parentDir, specifier + ext);
      if (existsSync(candidate)) {
        return { shortCircuit: true, url: pathToFileURL(candidate).href };
      }
    }
  }

  return nextResolve(specifier, context);
}
