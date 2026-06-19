import Link from "next/link";
import {
  formatScoreDisplay,
  hasPenalties,
} from "@/lib/match-score";
import type { ParsedKnockoutMatch } from "@/lib/openfootball/types";
import { getMatchHref } from "@/lib/match-links";
import type { WorldCupYear } from "@/lib/openfootball/years";
import { TeamName } from "./TeamName";

interface MatchCardProps {
  match: ParsedKnockoutMatch;
  year: WorldCupYear;
  large?: boolean;
}

export function MatchCard({ match, year, large = false }: MatchCardProps) {
  const homeWins = match.winner === match.home;
  const awayWins = match.winner === match.away;
  const scoreText = formatScoreDisplay(
    match.homeScore,
    match.awayScore,
    match.played,
  );
  const showPenalties = hasPenalties(
    match.homeScore,
    match.awayScore,
    match.homePenalties,
    match.awayPenalties,
    match.played,
  );

  return (
    <Link
      href={getMatchHref(year, match.id)}
      className={`block rounded-md border bg-white transition hover:border-[var(--wc-green)] hover:shadow-md ${
        large ? "min-w-52 p-3 text-sm" : "min-w-44 p-2 text-xs"
      } border-gray-200 shadow-sm`}
    >
      <p className="mb-1 text-[10px] font-medium text-gray-400">{match.date}</p>
      <div className="space-y-1">
        <TeamName team={match.home} bold={homeWins} flagSize={large ? 18 : 14} />
        <div
          className={`text-center font-bold ${
            scoreText === "-" ? "text-gray-400" : "text-[var(--wc-green)]"
          }`}
        >
          {scoreText}
        </div>
        <TeamName team={match.away} bold={awayWins} flagSize={large ? 18 : 14} />
      </div>
      {showPenalties && (
        <p className="mt-1 text-center text-[10px] text-amber-700">
          Pen {match.homePenalties}-{match.awayPenalties}
        </p>
      )}
    </Link>
  );
}
