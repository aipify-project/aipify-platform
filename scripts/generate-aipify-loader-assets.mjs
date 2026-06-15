#!/usr/bin/env node
/**
 * Generates /public/loaders/aipify-loader.gif and aipify-loader.webm
 * from the same calm pulse motion used in aipify-loader.json.
 *
 * Run: node scripts/generate-aipify-loader-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { deflateSync } from "node:zlib";
import gifenc from "gifenc";
const { GIFEncoder, quantize, applyPalette } = gifenc;
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/loaders");
const WIDTH = 96;
const HEIGHT = 96;
const FRAMES = 48;
const FPS = 24;

const BG = [250, 250, 252];
const GRADIENT_FROM = [109, 40, 217];
const GRADIENT_TO = [167, 139, 250];
const GLOW = [139, 92, 246];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function setPixel(rgba, x, y, color, alpha = 255) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
  const i = (y * WIDTH + x) * 4;
  const a = alpha / 255;
  rgba[i] = Math.round(lerp(rgba[i], color[0], a));
  rgba[i + 1] = Math.round(lerp(rgba[i + 1], color[1], a));
  rgba[i + 2] = Math.round(lerp(rgba[i + 2], color[2], a));
  rgba[i + 3] = 255;
}

function fillBackground(rgba) {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      setPixel(rgba, x, y, BG, 255);
    }
  }
}

function fillCircle(rgba, cx, cy, radius, color, alpha = 255) {
  const r2 = radius * radius;
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(WIDTH - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(HEIGHT - 1, Math.ceil(cy + radius));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(rgba, x, y, color, alpha);
      }
    }
  }
}

function drawLine(rgba, x0, y0, x1, y1, width, color, alpha = 255) {
  const dist = Math.hypot(x1 - x0, y1 - y1);
  const steps = Math.max(1, Math.ceil(dist * 2));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(x0, x1, t);
    const y = lerp(y0, y1, t);
    fillCircle(rgba, x, y, width / 2, color, alpha);
  }
}

function fillRotatedSquare(rgba, cx, cy, size, color, alpha = 255) {
  const half = size / 2;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const px = x + 0.5 - cx;
      const py = y + 0.5 - cy;
      const rx = (px + py) / Math.SQRT2;
      const ry = (-px + py) / Math.SQRT2;
      if (Math.abs(rx) <= half && Math.abs(ry) <= half) {
        setPixel(rgba, x, y, color, alpha);
      }
    }
  }
}

function mapPoint(x, y, scale, offsetX, offsetY) {
  return [offsetX + x * scale, offsetY + y * scale];
}

function renderFrame(frameIndex) {
  const rgba = new Uint8Array(WIDTH * HEIGHT * 4);
  fillBackground(rgba);

  const loopT = frameIndex / FRAMES;
  const pulse = easeInOutSine(loopT);
  const scale = lerp(0.94, 1, pulse);
  const glowAlpha = Math.round(lerp(28, 72, pulse));
  const iconAlpha = Math.round(lerp(210, 255, pulse));

  const iconScale = (64 / 40) * scale;
  const offsetX = (WIDTH - 40 * iconScale) / 2;
  const offsetY = (HEIGHT - 40 * iconScale) / 2;

  const [topX, topY] = mapPoint(20, 11, iconScale, offsetX, offsetY);
  const [leftX, leftY] = mapPoint(11.5, 29.5, iconScale, offsetX, offsetY);
  const [rightX, rightY] = mapPoint(28.5, 29.5, iconScale, offsetX, offsetY);

  fillCircle(rgba, WIDTH / 2, HEIGHT / 2, 30 * scale, GLOW, glowAlpha);

  const strokeColor = lerpColor(GRADIENT_FROM, GRADIENT_TO, 0.35);
  const fillColor = lerpColor(GRADIENT_FROM, GRADIENT_TO, 0.65);
  const strokeW = 1.6 * iconScale;

  drawLine(rgba, topX, topY, leftX, leftY, strokeW, strokeColor, iconAlpha);
  drawLine(rgba, topX, topY, rightX, rightY, strokeW, strokeColor, iconAlpha);
  fillCircle(rgba, topX, topY, 4.8 * iconScale, fillColor, iconAlpha);
  fillRotatedSquare(rgba, leftX, leftY, 8.6 * iconScale, fillColor, iconAlpha);
  fillRotatedSquare(rgba, rightX, rightY, 8.6 * iconScale, fillColor, iconAlpha);

  return rgba;
}

function writeGif(frames) {
  const gif = GIFEncoder();
  for (const rgba of frames) {
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    gif.writeFrame(index, WIDTH, HEIGHT, {
      palette,
      delay: Math.round(1000 / FPS),
      dispose: 2,
    });
  }
  gif.finish();
  return Buffer.from(gif.bytes());
}

function writePngFrames(frames, tempDir) {
  fs.mkdirSync(tempDir, { recursive: true });
  for (let i = 0; i < frames.length; i++) {
    const rgba = frames[i];
    const filename = path.join(tempDir, `frame-${String(i).padStart(3, "0")}.png`);
    writeRawPng(filename, rgba, WIDTH, HEIGHT);
  }
}

function writeRawPng(filePath, rgba, width, height) {
  const png = createMinimalPng(Buffer.from(rgba), width, height);
  fs.writeFileSync(filePath, png);
}

function createMinimalPng(rgba, width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = createChunk("IHDR", (() => {
    const buf = Buffer.alloc(13);
    buf.writeUInt32BE(width, 0);
    buf.writeUInt32BE(height, 4);
    buf[8] = 8;
    buf[9] = 6;
    buf[10] = 0;
    buf[11] = 0;
    buf[12] = 0;
    return buf;
  })());

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = deflateSync(raw, { level: 9 });
  const idat = createChunk("IDAT", compressed);
  const iend = createChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeWebm(pngDir, outPath) {
  execFileSync(
    ffmpegInstaller.path,
    [
      "-y",
      "-framerate",
      String(FPS),
      "-i",
      path.join(pngDir, "frame-%03d.png"),
      "-c:v",
      "libvpx-vp9",
      "-pix_fmt",
      "yuv420p",
      "-b:v",
      "0",
      "-crf",
      "32",
      "-an",
      "-loop",
      "0",
      outPath,
    ],
    { stdio: "inherit" },
  );
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const frames = Array.from({ length: FRAMES }, (_, i) => renderFrame(i));
const gifPath = path.join(OUT_DIR, "aipify-loader.gif");
const webmPath = path.join(OUT_DIR, "aipify-loader.webm");
const tempDir = path.join(OUT_DIR, ".frames-tmp");

fs.writeFileSync(gifPath, writeGif(frames));
console.log(`Wrote ${gifPath} (${fs.statSync(gifPath).size} bytes)`);

writePngFrames(frames, tempDir);
writeWebm(tempDir, webmPath);
console.log(`Wrote ${webmPath} (${fs.statSync(webmPath).size} bytes)`);

fs.rmSync(tempDir, { recursive: true, force: true });
console.log("Aipify loader GIF/WebM assets generated.");
