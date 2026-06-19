import type { GoalEvent, ParsedMatch } from "@/lib/openfootball/types";
import { formatScoreDisplay, hasPenalties } from "@/lib/match-score";
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

function ScoreBlock({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  return (
    <div className="rounded-md bg-gray-50 px-4 py-2 text-center">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-lg font-bold text-[var(--wc-green)]">
        {home} : {away}
      </p>
    </div>
  );
}

export function MatchDetailView({ match }: MatchDetailViewProps) {
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
  const homeWins = match.winner === match.home;
  const awayWins = match.winner === match.away;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <TeamName
            team={match.home}
            align="right"
            bold={homeWins}
            flagSize={32}
            className="w-full text-lg md:justify-end"
          />
          <div className="text-center">
            <p
              className={`text-3xl font-bold ${
                scoreText === "-" ? "text-gray-400" : "text-[var(--wc-green)]"
              }`}
            >
              {scoreText}
            </p>
            {showPenalties && (
              <p className="mt-1 text-sm text-amber-700">
                Penalties {match.homePenalties}-{match.awayPenalties}
              </p>
            )}
            {!match.played && (
              <p className="mt-1 text-sm text-gray-400">Not played yet</p>
            )}
          </div>
          <TeamName
            team={match.away}
            align="left"
            bold={awayWins}
            flagSize={32}
            className="w-full text-lg"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Date" value={match.date} />
        <DetailItem label="Time" value={match.time ?? "—"} />
        <DetailItem label="Round" value={match.round} />
        <DetailItem label="Venue" value={match.ground ?? "—"} />
        {match.group && <DetailItem label="Group" value={match.group} />}
        {match.matchday !== null && (
          <DetailItem label="Matchday" value={String(match.matchday)} />
        )}
      </div>

      {match.played && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {match.htHomeScore !== null && match.htAwayScore !== null && (
            <ScoreBlock
              label="Half-time"
              home={match.htHomeScore}
              away={match.htAwayScore}
            />
          )}
          {match.etHomeScore !== null && match.etAwayScore !== null && (
            <ScoreBlock
              label="Extra time"
              home={match.etHomeScore}
              away={match.etAwayScore}
            />
          )}
          {showPenalties && (
            <ScoreBlock
              label="Penalties"
              home={match.homePenalties!}
              away={match.awayPenalties!}
            />
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
