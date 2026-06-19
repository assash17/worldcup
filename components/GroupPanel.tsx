import { computeGroupStandings } from "@/lib/standings";
import type { ParsedGroupMatch } from "@/lib/types";
import type { WorldCupYear } from "@/lib/openfootball/years";
import { MatchList } from "./MatchList";
import { StandingsTable } from "./StandingsTable";

interface GroupPanelProps {
  group: string;
  matches: ParsedGroupMatch[];
  year: WorldCupYear;
  compact?: boolean;
}

export function GroupPanel({
  group,
  matches,
  year,
  compact = false,
}: GroupPanelProps) {  const groupMatches = matches.filter((m) => m.group === group);
  const standings = computeGroupStandings(group, matches);

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <h2
        className={`mb-3 font-bold text-[var(--wc-green)] ${
          compact ? "text-sm" : "text-lg"
        }`}
      >
        {group}
      </h2>
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "lg:grid-cols-2"}`}>
        <div className="min-w-0">
          <h3
            className={`mb-2 font-semibold text-gray-600 ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            Standings
          </h3>
          <StandingsTable standings={standings} compact={compact} />
        </div>
        <div>
          <h3
            className={`mb-2 font-semibold text-gray-600 ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            Results
          </h3>
          <MatchList matches={groupMatches} year={year} compact={compact} />
        </div>
      </div>
    </div>
  );
}
