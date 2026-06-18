import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SHAPES = ["diamond", "circle", "triangle", "square", "star"] as const;
export type VerificationShape = (typeof SHAPES)[number];

export type VerificationChallenge = {
  challengeId: string;
  targetShape: VerificationShape;
  options: { id: string; shape: VerificationShape; rotation: number }[];
  token: string;
  expiresAt: number;
};

function secret(): string {
  return process.env.PUBLIC_FORM_VERIFICATION_SECRET ?? "aipify-dev-form-verification-v1";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function shapeGlyph(shape: VerificationShape): string {
  switch (shape) {
    case "diamond":
      return "◆";
    case "circle":
      return "●";
    case "triangle":
      return "▲";
    case "square":
      return "■";
    case "star":
      return "★";
  }
}

export { shapeGlyph, SHAPES };

export function createVerificationChallenge(): VerificationChallenge {
  const challengeId = randomBytes(12).toString("hex");
  const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]!;
  const correctIndex = Math.floor(Math.random() * 4);

  const distractors = SHAPES.filter((s) => s !== targetShape);
  const options = Array.from({ length: 4 }, (_, i) => {
    const shape = i === correctIndex ? targetShape : distractors[i % distractors.length]!;
    return {
      id: `${challengeId}-${i}`,
      shape,
      rotation: i === correctIndex ? 0 : [90, 180, 270][i % 3]!,
    };
  });

  const expiresAt = Date.now() + 10 * 60 * 1000;
  const payload = `${challengeId}:${correctIndex}:${expiresAt}`;
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;

  return { challengeId, targetShape, options, token, expiresAt };
}

export function verifyHumanChallenge(token: string, selectedIndex: number): boolean {
  if (!token || !Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) return false;

  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return false;

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expectedSig = sign(payload);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return false;
  } catch {
    return false;
  }

  const [challengeId, answerIndexRaw, expiresAtRaw] = payload.split(":");
  if (!challengeId || !answerIndexRaw || !expiresAtRaw) return false;

  const answerIndex = Number(answerIndexRaw);
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(answerIndex) || !Number.isFinite(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;

  return answerIndex === selectedIndex;
}
