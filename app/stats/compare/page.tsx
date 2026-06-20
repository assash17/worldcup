"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { MatchScoreDisplay } from "@/components/MatchScoreDisplay";
import { TeamName } from "@/components/TeamName";
import { TeamSearchSelect } from "@/components/TeamSearchSelect";
import { useStatsCache } from "@/lib/hooks/useStatsCache";
import { computeHeadToHeadFromCache, getHeadToHeadMatchResultForTeam1, orientHeadToHeadMatchForTeam1 } from "@/lib/stats/h2h";
import { getMatchHref } from "@/lib/match-links";
import {
  MATCH_RESULT_BADGE_CLASS,
  MATCH_RESULT_ROW_CLASS,
} from "@/lib/match-result-styles";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cache, loading, error } = useStatsCache();

  const team1Param = searchParams.get("team1") ?? "";
  const team2Param = searchParams.get("team2") ?? "";

  const h2h = useMemo(() => {
    if (!cache || !team1Param || !team2Param || team1Param === team2Param) {
      return null;
    }
    return computeHeadToHeadFromCache(cache.teams, team1Param, team2Param);
  }, [cache, team1Param, team2Param]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `/stats/compare?${query}` : "/stats/compare");
  };

  if (loading) {
    return <p className="text-gray-500">Loading head-to-head...</p>;
  }

  if (error || !cache) {
    return <p className="text-red-600">{error ?? "Failed to load stats"}</p>;
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[var(--wc-green)]">
        Head-to-Head
      </h2>
      <p className="mb-4 text-sm text-gray-500">
        World Cup finals history between two national teams.
      </p>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-6">
          <TeamSearchSelect
            teams={cache.teamList}
            value={team1Param}
            label="Team A"
            placeholder="Search team A..."
            onChange={(team) =>
              updateParams({ team1: team || null, team2: team2Param || null })
            }
          />
          <TeamSearchSelect
            teams={cache.teamList}
            value={team2Param}
            label="Team B"
            placeholder="Search team B..."
            onChange={(team) =>
              updateParams({ team1: team1Param || null, team2: team || null })
            }
          />
        </div>

        {!team1Param || !team2Param ? (
          <p className="text-sm text-gray-500">Select two teams to compare.</p>
        ) : team1Param === team2Param ? (
          <p className="text-sm text-gray-500">Choose two different teams.</p>
        ) : h2h ? (
          <div>
            <p className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <TeamName team={h2h.team1} link bold flagSize={18} />
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <span className={MATCH_RESULT_BADGE_CLASS.win}>{h2h.team1Wins}</span>
                <span className="text-gray-400">–</span>
                <span className={MATCH_RESULT_BADGE_CLASS.draw}>{h2h.draws}</span>
                <span className="text-gray-400">–</span>
                <span className={MATCH_RESULT_BADGE_CLASS.loss}>{h2h.team2Wins}</span>
              </span>
              <TeamName team={h2h.team2} link bold flagSize={18} />
              <span className="text-gray-500">(wins – draws – wins)</span>
            </p>
            {h2h.matches.length === 0 ? (
              <p className="text-sm text-gray-500">
                No World Cup meetings between these teams.
              </p>
            ) : (
              <ul className="space-y-2">
                {h2h.matches.map((match) => {
                  const result = getHeadToHeadMatchResultForTeam1(match, team1Param);
                  const oriented = orientHeadToHeadMatchForTeam1(
                    match,
                    team1Param,
                    team2Param,
                  );
                  const rowClass = result
                    ? MATCH_RESULT_ROW_CLASS[result]
                    : "bg-white border-gray-200";

                  return (
                  <li
                    key={`${match.year}-${match.matchId}`}
                    className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm ${rowClass}`}
                  >
                    <span className="text-gray-500">
                      {match.year} · {match.round}
                    </span>
                    <span className="flex items-center gap-2">
                      <TeamName team={team1Param} link flagSize={14} />
                      <MatchScoreDisplay {...oriented} size="sm" />
                      <TeamName team={team2Param} link flagSize={14} />
                    </span>
                    <Link
                      href={getMatchHref(match.year, match.matchId)}
                      className="text-[var(--wc-green)] hover:underline"
                    >
                      Details
                    </Link>
                  </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}
      </section>

      <p className="mt-4 text-sm text-gray-500">
        <Link href="/history" className="text-[var(--wc-green)] hover:underline">
          Back to history
        </Link>
      </p>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <CompareContent />
    </Suspense>
  );
}
