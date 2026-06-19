import type { TeamStanding } from "@/lib/types";
import { TeamName } from "./TeamName";

interface StandingsTableProps {
  standings: TeamStanding[];
  compact?: boolean;
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

export function StandingsTable({
  standings,
  compact = false,
}: StandingsTableProps) {
  const statWidth = compact ? 22 : 28;
  const rankWidth = compact ? 22 : 28;
  const ptsWidth = compact ? 28 : 34;

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full min-w-[280px] table-fixed text-left ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <colgroup>
          <col style={{ width: rankWidth }} />
          <col />
          <col style={{ width: statWidth }} />
          <col style={{ width: statWidth }} />
          <col style={{ width: statWidth }} />
          <col style={{ width: statWidth }} />
          <col style={{ width: statWidth }} />
          <col style={{ width: statWidth }} />
          <col style={{ width: statWidth }} />
          <col style={{ width: ptsWidth }} />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-1 text-left">#</th>
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
              key={row.team}
              className={`border-b border-gray-100 ${
                row.rank <= 2
                  ? "bg-green-50 font-medium"
                  : row.rank === 3
                    ? "bg-amber-50"
                    : ""
              }`}
            >
              <td className="py-2 pr-1 tabular-nums">{row.rank}</td>
              <td className="py-2 pr-2" title={row.team}>
                <TeamName team={row.team} flagSize={compact ? 14 : 16} />
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
  );
}
