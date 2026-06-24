"use client";

import Link from "next/link";
import { Suspense } from "react";
import { EditionTimeline } from "@/components/StatsTables";
import { useStatsCache } from "@/lib/hooks/useStatsCache";

function HistoryContent() {
  const { cache, loading, error } = useStatsCache();

  if (loading) {
    return <p className="text-gray-500">Loading history...</p>;
  }

  if (error || !cache) {
    return <p className="text-red-600">{error ?? "Failed to load history"}</p>;
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[var(--wc-green)]">
        World Cup History
      </h2>
      <p className="mb-4 text-sm text-gray-500">
        {cache.editions.length > 0 ? (
          <>
            All FIFA World Cup editions from{" "}
            {Math.min(...cache.editions.map((edition) => edition.year))} to{" "}
            {Math.max(...cache.editions.map((edition) => edition.year))}. Click a
            year to open that tournament.
          </>
        ) : (
          <>All FIFA World Cup editions. Click a year to open that tournament.</>
        )}
      </p>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <EditionTimeline editions={cache.editions} />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Browse{" "}
        <Link href="/stats/teams" className="text-[var(--wc-green)] hover:underline">
          team records
        </Link>{" "}
        or compare teams in{" "}
        <Link href="/stats/compare" className="text-[var(--wc-green)] hover:underline">
          head-to-head
        </Link>
        .
      </p>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <HistoryContent />
    </Suspense>
  );
}
