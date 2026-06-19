"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MatchDetailView } from "@/components/MatchDetailView";
import { formatWorldCupTitle } from "@/lib/openfootball/hosts";
import { useWorldCupData } from "@/lib/hooks/useWorldCupData";
import { useYearFromUrl } from "@/lib/hooks/useYearNavigation";

export function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const year = useYearFromUrl();
  const { data, loading, error } = useWorldCupData(year);
  const matchId = decodeURIComponent(params.id);
  const match = data?.matchesById[matchId];

  if (loading) {
    return <p className="text-gray-500">Loading match...</p>;
  }

  if (error || !data) {
    return <p className="text-red-600">{error ?? "Failed to load data"}</p>;
  }

  if (!match) {
    return (
      <div>
        <p className="text-red-600">Match not found.</p>
        <Link
          href={`/groups?year=${year}`}
          className="mt-4 inline-block text-sm text-[var(--wc-green)] hover:underline"
        >
          Back to Group Stage
        </Link>
      </div>
    );
  }

  const backHref =
    match.type === "knockout"
      ? `/tournament?year=${year}`
      : `/groups?year=${year}${match.group ? `&tab=${encodeURIComponent(match.group)}` : ""}`;

  return (
    <div>
      <Link
        href={backHref}
        className="mb-4 inline-block text-sm text-[var(--wc-green)] hover:underline"
      >
        ← Back
      </Link>
      <h2 className="mb-1 text-2xl font-bold text-[var(--wc-green)]">
        Match Details
      </h2>
      <p className="mb-6 text-sm text-gray-500">{formatWorldCupTitle(year)}</p>
      <MatchDetailView match={match} />
    </div>
  );
}
