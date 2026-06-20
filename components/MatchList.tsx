import Link from "next/link";
import type { ParsedMatch } from "@/lib/openfootball/types";
import { formatScoreDisplay } from "@/lib/match-score";
import { getMatchHref } from "@/lib/match-links";
import type { WorldCupYear } from "@/lib/openfootball/years";
import { TeamName } from "./TeamName";

interface MatchListProps {
  matches: ParsedMatch[];
  year: WorldCupYear;
  compact?: boolean;
}

function groupMatchesByRound(matches: ParsedMatch[]) {
  const byRound = new Map<string, ParsedMatch[]>();

  for (const match of matches) {
    const key =
      match.matchday !== null
        ? `Matchday ${match.matchday}`
        : match.round || "Matches";
    const list = byRound.get(key) ?? [];
    list.push(match);
    byRound.set(key, list);
  }

  return [...byRound.entries()].map(([label, roundMatches]) => ({
    label,
    matches: roundMatches.sort((a, b) => a.date.localeCompare(b.date)),
  }));
}

export function MatchList({ matches, year, compact = false }: MatchListProps) {
  const sections = groupMatchesByRound(matches);

  return (
    <div className={`space-y-3 ${compact ? "text-xs" : "text-sm"}`}>
      {sections.map(({ label, matches: roundMatches }) => (
        <div key={label}>
          <p className="mb-1 font-semibold text-gray-500">{label}</p>
          <div className="space-y-2">
            {roundMatches.map((match) => (
              <Link
                key={match.id}
                href={getMatchHref(year, match.id)}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 transition hover:border-[var(--wc-green)] hover:bg-green-50"
              >
                <TeamName team={match.home} align="right" flagSize={compact ? 14 : 18} className="flex-1" link />
                <span className="mx-2 min-w-16 text-center font-bold text-[var(--wc-green)]">
                  {formatScoreDisplay(
                    match.homeScore,
                    match.awayScore,
                    match.played,
                  )}
                </span>
                <TeamName team={match.away} align="left" flagSize={compact ? 14 : 18} className="flex-1" link />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
