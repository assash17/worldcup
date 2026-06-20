"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MatchScoreDisplay } from "@/components/MatchScoreDisplay";
import { TeamName } from "@/components/TeamName";
import { useStatsCache } from "@/lib/hooks/useStatsCache";
import {
  getAppearanceResultDisplay,
  getBestResultSummary,
} from "@/lib/stats/team-records";
import type { BestResultSummary, TeamAppearance, TeamHistorySummary } from "@/lib/stats/types";
import { getActualMatchSides, getTeamMatchResult } from "@/lib/stats/match-display";
import type { TeamMatchRecord } from "@/lib/stats/types";
import { getMatchHref } from "@/lib/match-links";
import { formatMatchDateTime } from "@/lib/match-datetime";
import {
  MATCH_RESULT_BADGE_CLASS,
  MATCH_RESULT_ROW_CLASS,
} from "@/lib/match-result-styles";
import type { WorldCupYear } from "@/lib/openfootball/years";

export function TeamHistoryPage() {
  const params = useParams<{ name: string }>();
  const team = decodeURIComponent(params.name);
  const { cache, loading, error } = useStatsCache();

  if (loading) {
    return <p className="text-gray-500">Loading team history...</p>;
  }

  if (error || !cache) {
    return <p className="text-red-600">{error ?? "Failed to load team history"}</p>;
  }

  const history = cache.teams[team];

  if (!history) {
    return (
      <div>
        <p className="text-red-600">Team not found.</p>
        <Link
          href="/history"
          className="mt-4 inline-block text-sm text-[var(--wc-green)] hover:underline"
        >
          Back to history
        </Link>
      </div>
    );
  }

  const hostsByYear = Object.fromEntries(
    cache.editions.map((edition) => [edition.year, edition.hosts]),
  ) as Record<WorldCupYear, string>;
  const bestResult = getBestResultSummary(history.appearances, (year) =>
    hostsByYear[year] ?? "",
  );

  return (
    <div>
      <Link
        href="/stats/teams"
        className="mb-4 inline-block text-sm text-[var(--wc-green)] hover:underline"
      >
        ← Back to team records
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <TeamName team={team} flagSize={32} bold className="text-2xl" />
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <AppearancesCard
          count={history.appearances.length}
          appearances={history.appearances}
          hostsByYear={hostsByYear}
        />
        <RecordCard history={history} />
        <GoalsCard scored={history.totalGF} conceded={history.totalGA} />
      </div>
      <BestResultCard summary={bestResult} className="mb-6" />

      <div className="space-y-4">
        {history.appearances.map((appearance) => (
          <AppearanceSection
            key={appearance.year}
            team={team}
            appearance={appearance}
            hosts={hostsByYear[appearance.year] ?? ""}
          />
        ))}
      </div>
    </div>
  );
}

function AppearancesCard({
  count,
  appearances,
  hostsByYear,
}: {
  count: number;
  appearances: TeamAppearance[];
  hostsByYear: Record<WorldCupYear, string>;
}) {
  return (
    <details className="group rounded-md border border-gray-200 bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-4 py-3 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-gray-500">Appearances</p>
          <span className="text-xs text-gray-400 group-open:hidden">Show list</span>
          <span className="hidden text-xs text-gray-400 group-open:inline">Hide list</span>
        </div>
        <p className="mt-1 text-lg font-semibold text-gray-900">{count}</p>
      </summary>
      <ul className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
        {appearances.map((appearance) => (
          <li key={appearance.year} className="flex flex-wrap items-center gap-x-2 py-1">
            <Link
              href={`/groups?year=${appearance.year}`}
              className="font-medium text-[var(--wc-green)] hover:underline"
            >
              {appearance.year}
            </Link>
            <span className="text-gray-400">—</span>
            <span>{hostsByYear[appearance.year] ?? "—"}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function RecordCard({ history }: { history: TeamHistorySummary }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">Record</p>
      <p className="mt-1 inline-flex items-center gap-1.5 tabular-nums">
        <span className={MATCH_RESULT_BADGE_CLASS.win}>{history.totalWins}</span>
        <span className="text-sm text-gray-400">–</span>
        <span className={MATCH_RESULT_BADGE_CLASS.draw}>{history.totalDraws}</span>
        <span className="text-sm text-gray-400">–</span>
        <span className={MATCH_RESULT_BADGE_CLASS.loss}>{history.totalLosses}</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">Wins – draws – losses</p>
    </div>
  );
}

function GoalsCard({ scored, conceded }: { scored: number; conceded: number }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">Goals</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Scored</p>
          <p className="text-lg font-semibold tabular-nums text-gray-900">{scored}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Conceded</p>
          <p className="text-lg font-semibold tabular-nums text-gray-900">{conceded}</p>
        </div>
      </div>
    </div>
  );
}

function BestResultCard({
  summary,
  className = "",
}: {
  summary: BestResultSummary | null;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm ${className}`}
    >
      <p className="text-xs uppercase tracking-wide text-gray-500">Best result</p>
      {summary ? (
        <>
          <p className="mt-1 text-lg font-semibold text-gray-900">{summary.result}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {summary.editions.map((edition) => (
              <li key={edition.year}>
                {edition.year} — {edition.hosts}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-1 text-lg font-semibold text-gray-900">—</p>
      )}
    </div>
  );
}

function AppearanceSection({
  team,
  appearance,
  hosts,
}: {
  team: string;
  appearance: TeamAppearance;
  hosts: string;
}) {
  const { phase, finish } = getAppearanceResultDisplay(appearance.result);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <Link
              href={`/groups?year=${appearance.year}`}
              className="text-[var(--wc-green)] hover:underline"
            >
              {appearance.year}
            </Link>
            <span className="font-normal text-gray-500"> — {hosts}</span>
          </h3>
          <AppearanceResultBadge phase={phase} finish={finish} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <span className={MATCH_RESULT_BADGE_CLASS.win}>{appearance.won}</span>
            <span className="text-gray-400">–</span>
            <span className={MATCH_RESULT_BADGE_CLASS.draw}>{appearance.drawn}</span>
            <span className="text-gray-400">–</span>
            <span className={MATCH_RESULT_BADGE_CLASS.loss}>{appearance.lost}</span>
          </span>
          <span className="inline-flex items-center gap-3 tabular-nums text-gray-600">
            <span>
              <span className="text-xs text-gray-500">Scored </span>
              {appearance.gf}
            </span>
            <span>
              <span className="text-xs text-gray-500">Conceded </span>
              {appearance.ga}
            </span>
          </span>
        </div>
      </div>
      <ul className="space-y-2">
        {appearance.matches.map((match: TeamMatchRecord) => {
          const sides = getActualMatchSides(team, match);
          const result = getTeamMatchResult(team, match);
          const rowClass = result
            ? MATCH_RESULT_ROW_CLASS[result]
            : "border-gray-100 bg-white";

          return (
            <li
              key={`${appearance.year}-${match.matchId}`}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm ${rowClass}`}
            >
              <span className="text-gray-500">
                {formatMatchDateTime(match.date, match.time)} · {match.round}
              </span>
              <span className="flex items-center gap-2">
                <TeamName
                  team={sides.homeTeam}
                  link
                  flagSize={14}
                  bold={sides.homeTeam === team}
                />
                <MatchScoreDisplay {...sides} played={match.played} size="sm" />
                <TeamName
                  team={sides.awayTeam}
                  link
                  flagSize={14}
                  bold={sides.awayTeam === team}
                />
              </span>
              <Link
                href={getMatchHref(appearance.year, match.matchId)}
                className="text-[var(--wc-green)] hover:underline"
              >
                Details
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function AppearanceResultBadge({
  phase,
  finish,
}: {
  phase: "Group stage" | "Tournament";
  finish: string;
}) {
  if (phase === "Group stage") {
    return (
      <span className="mt-2 inline-flex rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
        Group stage
      </span>
    );
  }

  return (
    <span className="mt-2 inline-flex flex-wrap items-center gap-1.5 text-xs">
      <span className="rounded border border-[var(--wc-green)]/30 bg-[var(--wc-green)]/10 px-2 py-0.5 font-medium text-[var(--wc-green)]">
        Tournament
      </span>
      <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium text-gray-700">
        {finish}
      </span>
    </span>
  );
}
