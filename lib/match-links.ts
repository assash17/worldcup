import type { WorldCupYear } from "@/lib/openfootball/years";

export function getMatchHref(year: WorldCupYear, matchId: string): string {
  return `/match/${encodeURIComponent(matchId)}?year=${year}`;
}
