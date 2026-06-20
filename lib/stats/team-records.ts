import { computeGroupStandings } from "@/lib/standings";
import type { WorldCupData } from "@/lib/openfootball/types";
import type { WorldCupYear } from "@/lib/openfootball/years";
import type { TeamAppearance, TeamHistorySummary, TeamMatchRecord } from "./types";
import { isRealTeam } from "./helpers";

const ROUND_RANK: Record<string, number> = {
  Winner: 100,
  "Runner-up": 90,
  "Third place": 80,
  "Semi-finals": 70,
  "Quarter-finals": 60,
  "Round of 16": 50,
  "Round of 32": 40,
  "Final Round": 35,
  "Group stage": 10,
};

function getTeamResult(data: WorldCupData, team: string): string {
  const final = data.knockoutMatches.find((m) => m.roundKey === "final");
  if (final?.played && final.winner === team) return "Winner";
  if (final?.played && final.winner && final.winner !== team) {
    const inFinal = final.home === team || final.away === team;
    if (inFinal) return "Runner-up";
  }

  const third = data.knockoutMatches.find((m) => m.roundKey === "third");
  if (third?.played && third.winner === team) return "Third place";

  const teamKnockout = data.knockoutMatches
    .filter((m) => m.home === team || m.away === team)
    .sort((a, b) => (b.order ?? 0) - (a.order ?? 0));

  const latest = teamKnockout[0];
  if (latest?.played) {
    if (latest.winner === team) {
      return latest.round;
    }
    return latest.round;
  }

  const finalRound = data.groupMatches.filter((m) => m.group === "Final Round");
  if (finalRound.some((m) => m.home === team || m.away === team)) {
    const standings = computeGroupStandings("Final Round", data.groupMatches);
    const rank = standings.findIndex((s) => s.team === team) + 1;
    if (rank === 1) return "Winner";
    if (rank === 2) return "Runner-up";
    if (rank === 3) return "Third place";
    return "Final Round";
  }

  return "Group stage";
}

function buildTeamMatchRecords(
  data: WorldCupData,
  team: string,
): TeamMatchRecord[] {
  return data.matches
    .filter((m) => m.home === team || m.away === team)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((match) => ({
      year: data.year as WorldCupYear,
      matchId: match.id,
      date: match.date,
      round: match.round,
      opponent: match.home === team ? match.away : match.home,
      home: match.home === team,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      played: match.played,
    }));
}

function summarizeMatches(matches: TeamMatchRecord[]) {
  let won = 0;
  let drawn = 0;
  let lost = 0;
  let gf = 0;
  let ga = 0;
  let played = 0;

  for (const match of matches) {
    if (!match.played || match.homeScore === null || match.awayScore === null) {
      continue;
    }

    played += 1;
    const teamScore = match.home ? match.homeScore : match.awayScore;
    const oppScore = match.home ? match.awayScore : match.homeScore;
    gf += teamScore;
    ga += oppScore;

    if (teamScore > oppScore) won += 1;
    else if (teamScore < oppScore) lost += 1;
    else drawn += 1;
  }

  return { played, won, drawn, lost, gf, ga };
}

export function buildTeamAppearance(
  data: WorldCupData,
  team: string,
): TeamAppearance {
  const matches = buildTeamMatchRecords(data, team);
  const stats = summarizeMatches(matches);

  return {
    year: data.year as WorldCupYear,
    result: getTeamResult(data, team),
    ...stats,
    matches,
  };
}

export function buildAllTeamHistories(
  datasets: WorldCupData[],
): Record<string, TeamHistorySummary> {
  const teams = new Set<string>();

  for (const data of datasets) {
    for (const match of data.matches) {
      if (isRealTeam(match.home)) teams.add(match.home);
      if (isRealTeam(match.away)) teams.add(match.away);
    }
  }

  const result: Record<string, TeamHistorySummary> = {};

  for (const team of teams) {
    const appearances = datasets
      .filter((data) =>
        data.matches.some((m) => m.home === team || m.away === team),
      )
      .map((data) => buildTeamAppearance(data, team))
      .sort((a, b) => b.year - a.year);

    result[team] = {
      team,
      appearances,
      totalMatches: appearances.reduce((sum, a) => sum + a.played, 0),
      totalWins: appearances.reduce((sum, a) => sum + a.won, 0),
      totalDraws: appearances.reduce((sum, a) => sum + a.drawn, 0),
      totalLosses: appearances.reduce((sum, a) => sum + a.lost, 0),
      totalGF: appearances.reduce((sum, a) => sum + a.gf, 0),
      totalGA: appearances.reduce((sum, a) => sum + a.ga, 0),
    };
  }

  return result;
}

export function getBestResult(appearances: TeamAppearance[]): string | null {
  if (appearances.length === 0) return null;

  return appearances.reduce((best, appearance) => {
    const bestRank = ROUND_RANK[best] ?? 0;
    const currentRank = ROUND_RANK[appearance.result] ?? 0;
    return currentRank > bestRank ? appearance.result : best;
  }, appearances[0].result);
}
