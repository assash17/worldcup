import type { KnockoutRoundKey } from "./types";

const KNOCKOUT_ROUND_LABELS: Record<KnockoutRoundKey, string> = {
  round32: "Round of 32",
  round16: "Round of 16",
  quarter: "Quarter-finals",
  semi: "Semi-finals",
  third: "3rd Place",
  final: "Final",
  other: "Knockout",
};

const KNOCKOUT_ROUND_ORDER: KnockoutRoundKey[] = [
  "round32",
  "round16",
  "quarter",
  "semi",
  "final",
  "third",
  "other",
];

export function isThirdPlaceRound(round: string): boolean {
  const r = round.toLowerCase();
  return (
    r.includes("match for third") ||
    r.includes("third-place") ||
    r.includes("third place") ||
    r.includes("3rd place") ||
    (r.includes("3rd") && r.includes("play"))
  );
}

export function isKnockoutRound(round: string): boolean {
  const r = round.toLowerCase();
  if (r === "final round") return false;
  if (r.startsWith("matchday")) return false;
  if (r === "first round") return false;
  if (r.startsWith("group")) return false;

  return (
    r.includes("semi") ||
    r.includes("quarter") ||
    r.includes("round of") ||
    r === "final" ||
    isThirdPlaceRound(round)
  );
}

export function normalizeKnockoutRoundKey(round: string): KnockoutRoundKey {
  const r = round.toLowerCase();
  if (r.includes("round of 32")) return "round32";
  if (r.includes("round of 16")) return "round16";
  if (r.includes("quarter")) return "quarter";
  if (r.includes("semi")) return "semi";
  if (isThirdPlaceRound(round)) return "third";
  if (r === "final") return "final";
  return "other";
}

export function getKnockoutRoundLabel(key: KnockoutRoundKey): string {
  return KNOCKOUT_ROUND_LABELS[key];
}

export function compareKnockoutRoundKeys(a: KnockoutRoundKey, b: KnockoutRoundKey): number {
  return KNOCKOUT_ROUND_ORDER.indexOf(a) - KNOCKOUT_ROUND_ORDER.indexOf(b);
}

export function parseMatchday(round: string): number | null {
  const match = round.match(/matchday\s+(\d+)/i);
  return match ? Number(match[1]) : null;
}

export function compareGroups(a: string, b: string): number {
  const numA = a.match(/\d+/);
  const numB = b.match(/\d+/);
  if (numA && numB) return Number(numA[0]) - Number(numB[0]);

  const letterA = a.match(/group\s+([a-z])/i);
  const letterB = b.match(/group\s+([a-z])/i);
  if (letterA && letterB) return letterA[1].localeCompare(letterB[1]);

  return a.localeCompare(b);
}
