import Link from "next/link";
import { TeamName } from "./TeamName";
import type { EditionSummary } from "@/lib/stats/types";
import { formatScoreDisplay } from "@/lib/match-score";

interface EditionTimelineProps {
  editions: EditionSummary[];
}

export function EditionTimeline({ editions }: EditionTimelineProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Year</th>
            <th className="py-2 pr-4">Host</th>
            <th className="py-2 pr-4">Champion</th>
            <th className="py-2 pr-4">Runner-up</th>
            <th className="py-2 pr-4">Third</th>
            <th className="py-2 pr-4">Fourth</th>
            <th className="py-2 pr-4">Teams</th>
            <th className="py-2">Goals</th>
          </tr>
        </thead>
        <tbody>
          {editions.map((edition) => (
            <tr key={edition.year} className="border-b border-gray-100">
              <td className="py-3 pr-4 tabular-nums">
                <Link
                  href={`/groups?year=${edition.year}`}
                  className="text-[var(--wc-green)] hover:underline"
                >
                  {edition.year}
                </Link>
              </td>
              <td className="py-3 pr-4">{edition.hosts}</td>
              <td className="py-3 pr-4">
                {edition.champion ? (
                  <TeamName team={edition.champion} link flagSize={16} />
                ) : (
                  "—"
                )}
              </td>
              <td className="py-3 pr-4">
                {edition.runnerUp ? (
                  <TeamName team={edition.runnerUp} link flagSize={16} />
                ) : (
                  "—"
                )}
              </td>
              <td className="py-3 pr-4">
                {edition.thirdPlace ? (
                  <TeamName team={edition.thirdPlace} link flagSize={16} />
                ) : (
                  "—"
                )}
              </td>
              <td className="py-3 pr-4">
                {edition.fourthPlace ? (
                  <TeamName team={edition.fourthPlace} link flagSize={16} />
                ) : (
                  "—"
                )}
              </td>
              <td className="py-3 pr-4 tabular-nums">{edition.teamCount}</td>
              <td className="py-3 tabular-nums">{edition.totalGoals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MatchScoreText({
  homeScore,
  awayScore,
  played,
}: {
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
}) {
  return (
    <span className="tabular-nums font-semibold text-[var(--wc-green)]">
      {formatScoreDisplay(homeScore, awayScore, played)}
    </span>
  );
}
