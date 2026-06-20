import { computeGroupStandings } from "@/lib/standings";
import type { WorldCupData } from "@/lib/openfootball/types";
import type { WorldCupYear } from "@/lib/openfootball/years";
import {
  getFinalDisplayScores,
  hasPenalties,
  type MatchScoreInput,
} from "@/lib/match-score";
import type {
  BestResultSummary,
  TeamAppearance,
  TeamHistorySummary,
  TeamMatchRecord,
} from "./types";
import { isRealTeam } from "./helpers";

const ROUND_RANK: Record<string, number> = {
  Winner: 100,
  "Runner-up": 90,
  "Third place": 80,
  "Fourth place": 70,
  "Semi-finals": 65,
  "Quarter-finals": 60,
  "Round of 16": 50,
  "Round of 32": 40,
  "Final Round": 35,
  "Group stage": 10,
};

export function normalizeTeamResult(result: string): string {
  const r = result.toLowerCase().trim();

  if (r === "winner") return "Winner";
  if (r === "runner-up" || r === "runner up") return "Runner-up";
  if (r === "third place") return "Third place";
  if (r === "fourth place") return "Fourth place";

  if (
    r.includes("match for third") ||
    r.includes("third place match") ||
    r.includes("third-place match") ||
    r.includes("third place play-off") ||
    r.includes("third-place play-off") ||
    r.includes("third place playoff") ||
    r.includes("third-place playoff")
  ) {
    return "Fourth place";
  }

  if (r.includes("semi")) return "Semi-finals";
  if (r.includes("quarter")) return "Quarter-finals";
  if (r.includes("round of 16")) return "Round of 16";
  if (r.includes("round of 32")) return "Round of 32";
  if (r === "final round") return "Final Round";
  if (r.startsWith("group")) return "Group stage";

  return result;
}

export type AppearancePhase = "Group stage" | "Tournament";

export function getAppearanceResultDisplay(result: string): {
  phase: AppearancePhase;
  finish: string;
} {
  const normalized = normalizeTeamResult(result);

  if (normalized === "Group stage") {
    return { phase: "Group stage", finish: "Group stage" };
  }

  return { phase: "Tournament", finish: normalized };
}

function getResultRank(result: string): number {
  return ROUND_RANK[normalizeTeamResult(result)] ?? 0;
}

function getTeamResult(data: WorldCupData, team: string): string {
  const final = data.knockoutMatches.find((m) => m.roundKey === "final");
  if (final?.played && final.winner === team) return "Winner";
  if (final?.played && final.winner && final.winner !== team) {
    const inFinal = final.home === team || final.away === team;
    if (inFinal) return "Runner-up";
  }

  const third = data.knockoutMatches.find((m) => m.roundKey === "third");
  if (third?.played) {
    if (third.winner === team) return "Third place";
    if (third.home === team || third.away === team) return "Fourth place";
  }

  const teamKnockout = data.knockoutMatches
    .filter((m) => m.home === team || m.away === team)
    .sort((a, b) => (b.order ?? 0) - (a.order ?? 0));

  const latest = teamKnockout[0];
  if (latest?.played) {
    return normalizeTeamResult(latest.round);
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

function toScoreInput(match: TeamMatchRecord): MatchScoreInput {
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
      time: match.time,
      round: match.round,
      opponent: match.home === team ? match.away : match.home,
      home: match.home === team,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      htHomeScore: match.htHomeScore,
      htAwayScore: match.htAwayScore,
      etHomeScore: match.etHomeScore,
      etAwayScore: match.etAwayScore,
      homePenalties: match.homePenalties,
      awayPenalties: match.awayPenalties,
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
    const scores = toScoreInput(match);
    const final = getFinalDisplayScores(scores);
    if (!final) continue;

    played += 1;
    const teamScore = match.home ? final.home : final.away;
    const oppScore = match.home ? final.away : final.home;
    gf += teamScore;
    ga += oppScore;

    if (hasPenalties(scores)) {
      drawn += 1;
    } else if (teamScore > oppScore) {
      won += 1;
    } else if (teamScore < oppScore) {
      lost += 1;
    } else {
      drawn += 1;
    }
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
    result: normalizeTeamResult(getTeamResult(data, team)),
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

export function getBestResultSummary(
  appearances: TeamAppearance[],
  getHosts: (year: WorldCupYear) => string = () => "",
): BestResultSummary | null {
  if (appearances.length === 0) return null;

  let bestRank = -1;
  let bestResult = "";
  const tied: TeamAppearance[] = [];

  for (const appearance of appearances) {
    const normalized = normalizeTeamResult(appearance.result);
    const rank = getResultRank(normalized);
    if (rank > bestRank) {
      bestRank = rank;
      bestResult = normalized;
      tied.length = 0;
      tied.push(appearance);
    } else if (rank === bestRank && rank >= 0) {
      tied.push(appearance);
    }
  }

  if (bestRank < 0 || tied.length === 0) return null;

  return {
    result: bestResult,
    editions: tied
      .map((appearance) => ({
        year: appearance.year,
        hosts: getHosts(appearance.year),
      }))
      .sort((a, b) => b.year - a.year),
  };
}

export function getBestResult(appearances: TeamAppearance[]): string | null {
  return getBestResultSummary(appearances)?.result ?? null;
}
