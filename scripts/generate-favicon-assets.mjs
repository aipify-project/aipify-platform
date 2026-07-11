/**
 * Generates global favicon and PWA icon assets from assets/brand/aipify-symbol.svg
 * Run: node scripts/generate-favicon-assets.mjs
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const brandDir = join(root, "assets", "brand");

const masterSvg = readFileSync(join(brandDir, "aipify-symbol.svg"));
const maskableSvg = readFileSync(join(brandDir, "aipify-symbol-maskable.svg"));

const rasterTargets = [
  { file: "favicon-16x16.png", size: 16 },
  { file: "favicon-32x32.png", size: 32 },
  { file: "favicon-48x48.png", size: 48 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
];

async function writePng(svgBuffer, size, destPath) {
  await sharp(svgBuffer).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(destPath);
}

async function main() {
  for (const { file, size } of rasterTargets) {
    await writePng(masterSvg, size, join(publicDir, file));
    console.log(`✓ public/${file}`);
  }

  await writePng(maskableSvg, 512, join(publicDir, "maskable-icon-512.png"));
  console.log("✓ public/maskable-icon-512.png");

  copyFileSync(join(brandDir, "aipify-symbol.svg"), join(publicDir, "favicon.svg"));
  copyFileSync(join(brandDir, "safari-pinned-tab.svg"), join(publicDir, "safari-pinned-tab.svg"));
  console.log("✓ public/favicon.svg, public/safari-pinned-tab.svg");

  // Icons are served from public/ via AIPIFY_GLOBAL_ICONS (lib/branding/favicon-metadata.ts).
  // Do not write app/icon.svg, app/favicon.ico, or app/apple-icon.png — file-based metadata
  // under app/ breaks Vercel split-build onBuildComplete (ENOTDIR on app/*/route).

  const icoSizes = [16, 32, 48];
  const icoBuffers = await Promise.all(
    icoSizes.map((size) =>
      sharp(masterSvg).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    ),
  );

  const { default: pngToIco } = await import("png-to-ico");
  const ico = await pngToIco(icoBuffers);
  writeFileSync(join(publicDir, "favicon.ico"), ico);
  console.log("✓ public/favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
