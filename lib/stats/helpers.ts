import { isPlaceholderTeam } from "@/lib/flags/team-codes";
import type { ParsedMatch } from "@/lib/openfootball/types";
import { formatScoreDisplay } from "@/lib/match-score";

export function isRealTeam(team: string): boolean {
  return !isPlaceholderTeam(team);
}

export function collectTeams(matches: ParsedMatch[]): string[] {
  const teams = new Set<string>();
  for (const match of matches) {
    if (isRealTeam(match.home)) teams.add(match.home);
    if (isRealTeam(match.away)) teams.add(match.away);
  }
  return [...teams].sort((a, b) => a.localeCompare(b));
}

export function formatMatchScore(match: ParsedMatch): string | null {
  if (!match.played) return null;
  return formatScoreDisplay(match.homeScore, match.awayScore, true);
}

export function countTotalGoals(matches: ParsedMatch[]): number {
  let total = 0;
  for (const match of matches) {
    if (match.played && match.homeScore !== null && match.awayScore !== null) {
      total += match.homeScore + match.awayScore;
    }
  }
  return total;
}

export function getLoser(match: ParsedMatch): string | null {
  if (!match.winner) return null;
  return match.winner === match.home ? match.away : match.home;
}
