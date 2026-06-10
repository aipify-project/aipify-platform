import { MAXIMUM_SUCCESS_SCORE, MINIMUM_SUCCESS_SCORE } from "./types";

export function clampSuccessScore(score: number): number {
  return Math.min(MAXIMUM_SUCCESS_SCORE, Math.max(MINIMUM_SUCCESS_SCORE, Math.round(score)));
}

export function formatSuccessScore(score: number): string {
  return `${clampSuccessScore(score)}/100`;
}
