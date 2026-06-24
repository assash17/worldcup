import {
  getMatchResultForTeam,
  type MatchScoreInput,
} from "@/lib/match-score";
import type { HeadToHeadMatch, HeadToHeadSummary, TeamHistorySummary } from "./types";

function toScoreInput(match: {
  homeScore: number | null;
  awayScore: number | null;
  htHomeScore?: number | null;
  htAwayScore?: number | null;
  etHomeScore?: number | null;
  etAwayScore?: number | null;
  homePenalties?: number | null;
  awayPenalties?: number | null;
  played: boolean;
}): MatchScoreInput {
  return {
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    htHomeScore: match.htHomeScore,
    htAwayScore: match.htAwayScore,
    etHomeScore: match.etHomeScore,
    etAwayScore: match.etAwayScore,
    homePenalties: match.homePenalties,
    awayPenalties: match.awayPenalties,
    played: match.played,
  };
}

function countResult(
  scores: MatchScoreInput,
  homeTeam: string,
  awayTeam: string,
  team1: string,
): "team1" | "team2" | "draw" | null {
  const team1Result = getMatchResultForTeam(scores, homeTeam, awayTeam, team1);
  if (!team1Result) return null;
  if (team1Result === "win") return "team1";
  if (team1Result === "loss") return "team2";
  return "draw";
}

export function getHeadToHeadMatchResultForTeam1(
  match: HeadToHeadMatch,
  team1: string,
) {
  return getMatchResultForTeam(toScoreInput(match), match.home, match.away, team1);
}

export function orientHeadToHeadMatchForTeam1(
  match: HeadToHeadMatch,
  team1: string,
  team2: string,
): MatchScoreInput & { played: boolean } {
  if (match.home === team1 && match.away === team2) {
    return toScoreInput(match);
  }

  return {
    homeScore: match.awayScore,
    awayScore: match.homeScore,
    htHomeScore: match.htAwayScore,
    htAwayScore: match.htHomeScore,
    etHomeScore: match.etAwayScore,
    etAwayScore: match.etHomeScore,
    homePenalties: match.awayPenalties,
    awayPenalties: match.homePenalties,
    played: match.played,
  };
}

export function computeHeadToHeadFromCache(
  teams: Record<string, TeamHistorySummary>,
  team1: string,
  team2: string,
): HeadToHeadSummary {
  const history1 = teams[team1];
  const matches: HeadToHeadMatch[] = [];
  let team1Wins = 0;
  let team2Wins = 0;
  let draws = 0;

  if (!history1) {
    return { team1, team2, team1Wins: 0, team2Wins: 0, draws: 0, matches: [] };
  }

  for (const appearance of history1.appearances) {
    for (const match of appearance.matches) {
      if (match.opponent !== team2) continue;

      const homeTeam = match.home ? team1 : team2;
      const awayTeam = match.home ? team2 : team1;

      matches.push({
        year: appearance.year,
        matchId: match.matchId,
        date: match.date,
        round: match.round,
        home: homeTeam,
        away: awayTeam,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        htHomeScore: match.htHomeScore,
        htAwayScore: match.htAwayScore,
        etHomeScore: match.etHomeScore,
        etAwayScore: match.etAwayScore,
        homePenalties: match.homePenalties,
        awayPenalties: match.awayPenalties,
        played: match.played,
      });

      const result = countResult(
        toScoreInput(match),
        homeTeam,
        awayTeam,
        team1,
      );
      if (result === "team1") team1Wins += 1;
      else if (result === "team2") team2Wins += 1;
      else if (result === "draw") draws += 1;
    }
  }

  matches.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.date.localeCompare(a.date);
  });

  return { team1, team2, team1Wins, team2Wins, draws, matches };
}
