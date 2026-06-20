import {
  compareGroups,
  compareKnockoutRoundKeys,
  getKnockoutRoundLabel,
  isKnockoutRound,
  normalizeKnockoutRoundKey,
  parseMatchday,
} from "./rounds";
import { getWorldCupHosts } from "./hosts";
import type {
  GoalEvent,
  OpenFootballGoal,
  OpenFootballMatch,
  OpenFootballWorldCup,
  ParsedGroupMatch,
  ParsedKnockoutMatch,
  ParsedMatch,
  WorldCupData,
} from "./types";
import type { WorldCupYear } from "./years";

function parseScores(score?: {
  ft?: [number, number];
  ht?: [number, number];
  et?: [number, number];
  p?: [number, number];
}) {
  if (!score?.ft) {
    return {
      homeScore: null,
      awayScore: null,
      htHomeScore: null,
      htAwayScore: null,
      etHomeScore: null,
      etAwayScore: null,
      homePenalties: null,
      awayPenalties: null,
      played: false,
    };
  }

  return {
    homeScore: score.ft[0],
    awayScore: score.ft[1],
    htHomeScore: score.ht?.[0] ?? null,
    htAwayScore: score.ht?.[1] ?? null,
    etHomeScore: score.et?.[0] ?? null,
    etAwayScore: score.et?.[1] ?? null,
    homePenalties: score.p?.[0] ?? null,
    awayPenalties: score.p?.[1] ?? null,
    played: true,
  };
}

function formatGoalMinute(goal: OpenFootballGoal): string {
  const base = String(goal.minute);
  if (goal.offset) {
    return `${base}+${goal.offset}`;
  }
  return base;
}

function parseGoals(goals?: OpenFootballGoal[]): GoalEvent[] {
  if (!goals?.length) return [];

  return goals.map((goal) => ({
    name: goal.name,
    minute: formatGoalMinute(goal),
    penalty: goal.penalty === true,
    owngoal: goal.owngoal === true,
  }));
}

function getWinner(
  home: string,
  away: string,
  homeScore: number | null,
  awayScore: number | null,
  etHomeScore: number | null,
  etAwayScore: number | null,
  homePenalties: number | null,
  awayPenalties: number | null,
): string | null {
  if (homeScore === null || awayScore === null) return null;
  if (homeScore > awayScore) return home;
  if (awayScore > homeScore) return away;

  if (etHomeScore !== null && etAwayScore !== null) {
    if (etHomeScore > etAwayScore) return home;
    if (etAwayScore > etHomeScore) return away;
  }

  if (homePenalties !== null && awayPenalties !== null) {
    if (homePenalties > awayPenalties) return home;
    if (awayPenalties > homePenalties) return away;
  }
  return null;
}

function makeMatchId(prefix: "g" | "k", index: number): string {
  return `${prefix}-${index}`;
}

function buildMatch(
  raw: OpenFootballMatch,
  id: string,
  type: ParsedMatch["type"],
  extra: Pick<
    ParsedMatch,
    "group" | "roundKey" | "matchday" | "order"
  >,
): ParsedMatch {
  const scores = parseScores(raw.score);

  return {
    id,
    type,
    group: extra.group,
    round: raw.round,
    roundKey: extra.roundKey,
    matchday: extra.matchday,
    date: raw.date,
    time: raw.time ?? null,
    ground: raw.ground ?? null,
    home: raw.team1,
    away: raw.team2,
    goalsHome: parseGoals(raw.goals1),
    goalsAway: parseGoals(raw.goals2),
    ...scores,
    winner: getWinner(
      raw.team1,
      raw.team2,
      scores.homeScore,
      scores.awayScore,
      scores.etHomeScore,
      scores.etAwayScore,
      scores.homePenalties,
      scores.awayPenalties,
    ),
    order: extra.order,
  };
}

export function parseWorldCup(year: number, data: OpenFootballWorldCup): WorldCupData {
  const matches: ParsedMatch[] = [];
  let groupIndex = 0;
  let knockoutIndex = 0;

  for (const match of data.matches) {
    if (isKnockoutRound(match.round)) {
      const roundKey = normalizeKnockoutRoundKey(match.round);
      const id = makeMatchId("k", knockoutIndex++);
      matches.push(
        buildMatch(match, id, "knockout", {
          group: null,
          roundKey,
          matchday: null,
          order: knockoutIndex,
        }),
      );
      continue;
    }

    const group =
      match.group ??
      (match.round.toLowerCase() === "final round" ? "Final Round" : "Ungrouped");

    const id = makeMatchId("g", groupIndex++);
    matches.push(
      buildMatch(match, id, "group", {
        group,
        roundKey: null,
        matchday: parseMatchday(match.round),
        order: null,
      }),
    );
  }

  const matchesById = Object.fromEntries(matches.map((match) => [match.id, match]));
  const groupMatches = matches.filter(
    (match): match is ParsedGroupMatch => match.type === "group",
  );
  const knockoutMatches = matches.filter(
    (match): match is ParsedKnockoutMatch => match.type === "knockout",
  );

  const groups = [...new Set(groupMatches.map((m) => m.group!))].sort(compareGroups);

  const roundKeys = [
    ...new Set(
      knockoutMatches
        .map((m) => m.roundKey)
        .filter((key): key is NonNullable<typeof key> => key !== null),
    ),
  ].sort(compareKnockoutRoundKeys);

  const knockoutRounds = roundKeys.map((key) => ({
    key,
    label: getKnockoutRoundLabel(key),
  }));

  return {
    year,
    name: data.name,
    hosts: getWorldCupHosts(year as WorldCupYear),
    matches,
    matchesById,
    groupMatches,
    knockoutMatches,
    groups,
    knockoutRounds,
  };
}
