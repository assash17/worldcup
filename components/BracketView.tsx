import type { KnockoutRoundKey, ParsedKnockoutMatch } from "@/lib/openfootball/types";
import type { WorldCupYear } from "@/lib/openfootball/years";
import { compareKnockoutRoundKeys } from "@/lib/openfootball/rounds";
import { MatchCard } from "./MatchCard";

interface BracketViewProps {
  matches: ParsedKnockoutMatch[];
  rounds: { key: string; label: string }[];
  year: WorldCupYear;
  filter?: string;
}
function filterMatches(
  matches: ParsedKnockoutMatch[],
  filter?: string,
): ParsedKnockoutMatch[] {
  if (!filter || filter === "all") return matches;
  return matches.filter((m) => m.roundKey === filter);
}

export function BracketView({ matches, rounds, year, filter }: BracketViewProps) {
  const filtered = filterMatches(matches, filter);

  if (filter && filter !== "all") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((match) => (
            <MatchCard key={match.id} match={match} year={year} large />
          ))}
      </div>
    );
  }

  const sortedRounds = [...rounds].sort((a, b) =>
    compareKnockoutRoundKeys(
      a.key as KnockoutRoundKey,
      b.key as KnockoutRoundKey,
    ),
  );

  const mainRounds = sortedRounds.filter((r) => r.key !== "third");
  const thirdRound = sortedRounds.find((r) => r.key === "third");

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {mainRounds.map(({ key, label }) => {
          const roundMatches = matches
            .filter((m) => m.roundKey === key)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          if (roundMatches.length === 0) return null;

          return (
            <div key={key} className="flex flex-col">
              <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                {label}
              </h3>
              <div className="flex flex-1 flex-col justify-around gap-3">
                {roundMatches.map((match) => (
                  <MatchCard key={match.id} match={match} year={year} />
                ))}
              </div>
            </div>
          );
        })}
        {thirdRound && (
          <div className="flex flex-col">
            <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
              {thirdRound.label}
            </h3>
            <div className="flex flex-1 flex-col justify-center gap-3">
              {matches
                .filter((m) => m.roundKey === "third")
                .map((match) => (
                  <MatchCard key={match.id} match={match} year={year} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
