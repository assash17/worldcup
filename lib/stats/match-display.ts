import type { TeamMatchRecord } from "./types";

export function getActualMatchSides(
  team: string,
  match: TeamMatchRecord,
): {
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  htHomeScore: number | null;
  htAwayScore: number | null;
  etHomeScore: number | null;
  etAwayScore: number | null;
  homePenalties: number | null;
  awayPenalties: number | null;
} {
  return {
    homeTeam: match.home ? team : match.opponent,
    awayTeam: match.home ? match.opponent : team,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    htHomeScore: match.htHomeScore,
    htAwayScore: match.htAwayScore,
    etHomeScore: match.etHomeScore,
    etAwayScore: match.etAwayScore,
    homePenalties: match.homePenalties,
    awayPenalties: match.awayPenalties,
  };
}
