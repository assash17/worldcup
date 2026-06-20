"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MatchScoreDisplay } from "@/components/MatchScoreDisplay";
import { TeamName } from "@/components/TeamName";
import { useStatsCache } from "@/lib/hooks/useStatsCache";
import { getBestResult } from "@/lib/stats/team-records";
import { getActualMatchSides } from "@/lib/stats/match-display";
import type { TeamMatchRecord } from "@/lib/stats/types";
import { getMatchHref } from "@/lib/match-links";

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

  const bestResult = getBestResult(history.appearances);

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
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Appearances" value={history.appearances.length} />
        <StatCard label="Best result" value={bestResult ?? "—"} />
        <StatCard
          label="Record"
          value={`${history.totalWins}-${history.totalDraws}-${history.totalLosses}`}
        />
        <StatCard label="Goals" value={`${history.totalGF}:${history.totalGA}`} />
      </div>

      <div className="space-y-4">
        {history.appearances.map((appearance) => (
          <section
            key={appearance.year}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[var(--wc-green)]">
                <Link
                  href={`/groups?year=${appearance.year}`}
                  className="hover:underline"
                >
                  {appearance.year}
                </Link>
              </h3>
              <span className="text-sm text-gray-600">{appearance.result}</span>
              <span className="text-sm tabular-nums text-gray-500">
                {appearance.won}W {appearance.drawn}D {appearance.lost}L ·{" "}
                {appearance.gf}:{appearance.ga}
              </span>
            </div>
            <ul className="space-y-2">
              {appearance.matches.map((match: TeamMatchRecord) => {
                const sides = getActualMatchSides(team, match);
                return (
                <li
                  key={`${appearance.year}-${match.matchId}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-100 px-3 py-2 text-sm"
                >
                  <span className="text-gray-500">
                    {match.date} · {match.round}
                  </span>
                  <span className="flex items-center gap-2">
                    <TeamName team={sides.homeTeam} link flagSize={14} />
                    <MatchScoreDisplay {...sides} played={match.played} size="sm" />
                    <TeamName team={sides.awayTeam} link flagSize={14} />
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
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
