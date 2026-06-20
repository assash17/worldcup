import type { WorldCupData } from "@/lib/openfootball/types";
import type { WorldCupYear } from "@/lib/openfootball/years";
import type { HeadToHeadMatch, HeadToHeadSummary, TeamHistorySummary } from "./types";
import { isRealTeam } from "./helpers";

export function computeHeadToHead(
  datasets: WorldCupData[],
  team1: string,
  team2: string,
): HeadToHeadSummary {
  const matches: HeadToHeadMatch[] = [];
  let team1Wins = 0;
  let team2Wins = 0;
  let draws = 0;

  for (const data of datasets) {
    for (const match of data.matches) {
      const involvesBoth =
        (match.home === team1 && match.away === team2) ||
        (match.home === team2 && match.away === team1);

      if (!involvesBoth) continue;

      matches.push({
        year: data.year as WorldCupYear,
        matchId: match.id,
        date: match.date,
        round: match.round,
        home: match.home,
        away: match.away,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        played: match.played,
      });

      if (
        !match.played ||
        match.homeScore === null ||
        match.awayScore === null
      ) {
        continue;
      }

      if (match.homeScore === match.awayScore) {
        draws += 1;
        continue;
      }

      const winner =
        match.homeScore > match.awayScore ? match.home : match.away;
      if (winner === team1) team1Wins += 1;
      else if (winner === team2) team2Wins += 1;
    }
  }

  matches.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.date.localeCompare(a.date);
  });

  return { team1, team2, team1Wins, team2Wins, draws, matches };
}

export function getComparableTeams(datasets: WorldCupData[]): string[] {
  const teams = new Set<string>();
  for (const data of datasets) {
    for (const match of data.matches) {
      if (isRealTeam(match.home)) teams.add(match.home);
      if (isRealTeam(match.away)) teams.add(match.away);
    }
  }
  return [...teams].sort((a, b) => a.localeCompare(b));
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
        played: match.played,
      });

      if (
        !match.played ||
        match.homeScore === null ||
        match.awayScore === null
      ) {
        continue;
      }

      const team1Score = match.home ? match.homeScore : match.awayScore;
      const team2Score = match.home ? match.awayScore : match.homeScore;

      if (team1Score === team2Score) {
        draws += 1;
      } else if (team1Score > team2Score) {
        team1Wins += 1;
      } else {
        team2Wins += 1;
      }
    }
  }

  matches.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.date.localeCompare(a.date);
  });

  return { team1, team2, team1Wins, team2Wins, draws, matches };
}
