import type { ParsedGroupMatch, TeamStanding } from "./types";

interface TeamStats {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
}

function initStats(teams: string[]): Map<string, TeamStats> {
  const map = new Map<string, TeamStats>();
  for (const team of teams) {
    map.set(team, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
    });
  }
  return map;
}

function headToHeadPts(
  teamA: string,
  teamB: string,
  matches: ParsedGroupMatch[],
): { ptsA: number; ptsB: number; gdA: number; gdB: number; gfA: number; gfB: number } {
  let ptsA = 0;
  let ptsB = 0;
  let gfA = 0;
  let gfB = 0;

  for (const m of matches) {
    const involvesA = m.home === teamA || m.away === teamA;
    const involvesB = m.home === teamB || m.away === teamB;
    if (!involvesA || !involvesB || !m.played) continue;

    const homeScore = m.homeScore!;
    const awayScore = m.awayScore!;

    if (m.home === teamA) {
      gfA += homeScore;
      gfB += awayScore;
      if (homeScore > awayScore) ptsA += 3;
      else if (homeScore < awayScore) ptsB += 3;
      else {
        ptsA += 1;
        ptsB += 1;
      }
    } else {
      gfA += awayScore;
      gfB += homeScore;
      if (awayScore > homeScore) ptsA += 3;
      else if (awayScore < homeScore) ptsB += 3;
      else {
        ptsA += 1;
        ptsB += 1;
      }
    }
  }

  return { ptsA, ptsB, gdA: gfA - gfB, gdB: gfB - gfA, gfA, gfB };
}

function compareStandings(
  a: TeamStats,
  b: TeamStats,
  matches: ParsedGroupMatch[],
): number {
  const gdA = a.gf - a.ga;
  const gdB = b.gf - b.ga;
  const ptsA = a.won * 3 + a.drawn;
  const ptsB = b.won * 3 + b.drawn;

  if (ptsB !== ptsA) return ptsB - ptsA;
  if (gdB !== gdA) return gdB - gdA;
  if (b.gf !== a.gf) return b.gf - a.gf;

  const h2h = headToHeadPts(a.team, b.team, matches);
  if (h2h.ptsB !== h2h.ptsA) return h2h.ptsB - h2h.ptsA;
  if (h2h.gdB !== h2h.gdA) return h2h.gdB - h2h.gdA;
  if (h2h.gfB !== h2h.gfA) return h2h.gfB - h2h.gfA;

  return a.team.localeCompare(b.team);
}

function getTeamsInGroup(
  group: string,
  matches: ParsedGroupMatch[],
): string[] {
  const teams = new Set<string>();
  for (const m of matches) {
    if (m.group !== group) continue;
    teams.add(m.home);
    teams.add(m.away);
  }
  return [...teams].sort((a, b) => a.localeCompare(b));
}

export function computeGroupStandings(
  group: string,
  matches: ParsedGroupMatch[],
): TeamStanding[] {
  const groupMatches = matches.filter((m) => m.group === group);
  const playedMatches = groupMatches.filter((m) => m.played);
  const stats = initStats(getTeamsInGroup(group, groupMatches));

  for (const m of playedMatches) {
    const home = stats.get(m.home);
    const away = stats.get(m.away);
    if (!home || !away) continue;

    const homeScore = m.homeScore!;
    const awayScore = m.awayScore!;

    home.played += 1;
    away.played += 1;
    home.gf += homeScore;
    home.ga += awayScore;
    away.gf += awayScore;
    away.ga += homeScore;

    if (homeScore > awayScore) {
      home.won += 1;
      away.lost += 1;
    } else if (homeScore < awayScore) {
      away.won += 1;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
    }
  }

  const sorted = [...stats.values()].sort((a, b) =>
    compareStandings(a, b, playedMatches),
  );

  return sorted.map((s, index) => ({
    team: s.team,
    played: s.played,
    won: s.won,
    drawn: s.drawn,
    lost: s.lost,
    gf: s.gf,
    ga: s.ga,
    gd: s.gf - s.ga,
    pts: s.won * 3 + s.drawn,
    rank: index + 1,
  }));
}

export function computeAllStandings(
  matches: ParsedGroupMatch[],
  groups: string[],
): Record<string, TeamStanding[]> {
  const result: Record<string, TeamStanding[]> = {};
  for (const group of groups) {
    result[group] = computeGroupStandings(group, matches);
  }
  return result;
}
