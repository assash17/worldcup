import type { TeamMatchRecord } from "./types";

export function getActualMatchSides(
  team: string,
  match: TeamMatchRecord,
): {
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
} {
  return {
    homeTeam: match.home ? team : match.opponent,
    awayTeam: match.home ? match.opponent : team,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  };
}
