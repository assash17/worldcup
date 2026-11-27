import type { OpenFootballMatch, ParsedMatch } from "./types";

const CANCELED_STATUSES = new Set([
  "canceled",
  "cancelled",
  "walkover",
  "forfeit",
  "forfeited",
  "abandoned",
]);

export function isOpenFootballMatchCanceled(raw: OpenFootballMatch): boolean {
  const status = raw.status?.toLowerCase().trim();
  if (!status) return false;
  return CANCELED_STATUSES.has(status);
}

export function isMatchResolved(match: Pick<ParsedMatch, "played" | "canceled">): boolean {
  return match.played || match.canceled;
}

export function countResolvedMatches(
  matches: Pick<ParsedMatch, "played" | "canceled">[],
): number {
  return matches.filter(isMatchResolved).length;
}