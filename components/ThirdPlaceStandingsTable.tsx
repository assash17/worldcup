import { BEST_THIRD_PLACE_QUALIFIERS } from "@/lib/standings";
import type { ThirdPlaceStanding } from "@/lib/types";
import { TeamName } from "./TeamName";

interface ThirdPlaceStandingsTableProps {
  standings: ThirdPlaceStanding[];
}

function StatHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-0 py-2 text-center font-medium ${className}`}>
      {children}
    </th>
  );
}

function StatCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-0 py-2 text-center tabular-nums ${className}`}>
      {children}
    </td>
  );
}

export function ThirdPlaceStandingsTable({
  standings,
}: ThirdPlaceStandingsTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-[var(--wc-green)]">
        Best Third-Place Teams
      </h2>
      <p className="mb-3 text-sm text-gray-500">
        Top {BEST_THIRD_PLACE_QUALIFIERS} advance to the Round of 32
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] table-fixed text-left text-sm">
          <colgroup>
            <col style={{ width: 28 }} />
            <col style={{ width: 72 }} />
            <col />
            <col style={{ width: 28 }} />
            <col style={{ width: 28 }} />
            <col style={{ width: 28 }} />
            <col style={{ width: 28 }} />
            <col style={{ width: 28 }} />
            <col style={{ width: 28 }} />
            <col style={{ width: 28 }} />
            <col style={{ width: 34 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-1 text-left">#</th>
              <th className="py-2 pr-2 text-left">Group</th>
              <th className="py-2 pr-2 text-left">Team</th>
              <StatHeader>P</StatHeader>
              <StatHeader>W</StatHeader>
              <StatHeader>D</StatHeader>
              <StatHeader>L</StatHeader>
              <StatHeader>GF</StatHeader>
              <StatHeader>GA</StatHeader>
              <StatHeader>GD</StatHeader>
              <StatHeader className="font-semibold">Pts</StatHeader>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr
                key={`${row.group}-${row.team}`}
                className={`border-b border-gray-100 ${
                  row.rank <= BEST_THIRD_PLACE_QUALIFIERS
                    ? "bg-green-50 font-medium"
                    : ""
                }`}
              >
                <td className="py-2 pr-1 tabular-nums">{row.rank}</td>
                <td className="py-2 pr-2 text-gray-600">{row.group}</td>
                <td className="py-2 pr-2" title={row.team}>
                  <TeamName team={row.team} flagSize={16} link />
                </td>
                <StatCell>{row.played}</StatCell>
                <StatCell>{row.won}</StatCell>
                <StatCell>{row.drawn}</StatCell>
                <StatCell>{row.lost}</StatCell>
                <StatCell>{row.gf}</StatCell>
                <StatCell>{row.ga}</StatCell>
                <StatCell>{row.gd > 0 ? `+${row.gd}` : row.gd}</StatCell>
                <StatCell className="font-semibold">{row.pts}</StatCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
