import type { GoalEvent, ParsedMatch } from "@/lib/openfootball/types";
import {
  getScoreBreakdown,
  toHomeAwayScoreInput,
} from "@/lib/match-score";
import { formatMatchDateTime } from "@/lib/match-datetime";
import { MatchScoreDisplay } from "./MatchScoreDisplay";
import { TeamName } from "./TeamName";

interface MatchDetailViewProps {
  match: ParsedMatch;
}

function GoalList({
  goals,
  teamScore,
  played,
}: {
  goals: GoalEvent[];
  teamScore: number | null;
  played: boolean;
}) {
  if (goals.length > 0) {
    return (
      <ul className="space-y-1">
        {goals.map((goal, index) => (
          <li key={`${goal.name}-${goal.minute}-${index}`} className="text-sm">
            <span className="font-medium">{goal.name}</span>
            <span className="text-gray-500">
              {" "}
              {goal.minute}&apos;
              {goal.penalty ? " (pen)" : ""}
              {goal.owngoal ? " (og)" : ""}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (!played || teamScore === null) {
    return <p className="text-sm text-gray-400">—</p>;
  }

  if (teamScore === 0) {
    return <p className="text-sm text-gray-400">No goals</p>;
  }

  return (
    <p className="text-sm text-gray-400">Scorer data not available</p>
  );
}

function ScoreBreakdownTable({
  homeTeam,
  awayTeam,
  scores,
}: {
  homeTeam: string;
  awayTeam: string;
  scores: ReturnType<typeof toHomeAwayScoreInput>;
}) {
  const breakdown = getScoreBreakdown(scores);
  if (breakdown.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">Score breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4 text-left font-medium">Period</th>
              <th className="py-2 pr-4 text-right font-medium">{homeTeam}</th>
              <th className="py-2 text-right font-medium">{awayTeam}</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((item) => (
              <tr
                key={item.label}
                className={`border-b border-gray-100 ${
                  item.highlight ? "bg-green-50 font-semibold" : ""
                }`}
              >
                <td className="py-2.5 pr-4 text-gray-700">{item.label}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-[var(--wc-green)]">
                  {item.home}
                </td>
                <td className="py-2.5 text-right tabular-nums text-[var(--wc-green)]">
                  {item.away}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MatchDetailView({ match }: MatchDetailViewProps) {
  const scores = toHomeAwayScoreInput(match);
  const homeWins = match.winner === match.home;
  const awayWins = match.winner === match.away;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex w-full flex-col items-end gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Home
            </span>
            <TeamName
              team={match.home}
              align="right"
              bold={homeWins}
              flagSize={32}
              link
              className="text-lg"
            />
          </div>
          <div className="text-center">
            <MatchScoreDisplay {...scores} size="lg" />
            {!match.played && (
              <p className="mt-1 text-sm text-gray-400">Not played yet</p>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Away
            </span>
            <TeamName
              team={match.away}
              align="left"
              bold={awayWins}
              flagSize={32}
              link
              className="text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem
          label="Date"
          value={formatMatchDateTime(match.date, match.time)}
        />
        <DetailItem label="Round" value={match.round} />
        <DetailItem label="Venue" value={match.ground ?? "—"} />
        {match.group && <DetailItem label="Group" value={match.group} />}
        {match.matchday !== null && (
          <DetailItem label="Matchday" value={String(match.matchday)} />
        )}
      </div>

      {match.played && (
        <ScoreBreakdownTable
          homeTeam={match.home}
          awayTeam={match.away}
          scores={scores}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Home
          </h3>
          <h3 className="mb-3 font-semibold text-gray-700">
            <TeamName team={match.home} flagSize={20} />
          </h3>
          <GoalList
            goals={match.goalsHome}
            teamScore={match.homeScore}
            played={match.played}
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Away
          </h3>
          <h3 className="mb-3 font-semibold text-gray-700">
            <TeamName team={match.away} flagSize={20} />
          </h3>
          <GoalList
            goals={match.goalsAway}
            teamScore={match.awayScore}
            played={match.played}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
