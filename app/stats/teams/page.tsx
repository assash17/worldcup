"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { TeamSearchSelect } from "@/components/TeamSearchSelect";
import { useStatsCache } from "@/lib/hooks/useStatsCache";
import { getTeamHref } from "@/lib/team-links";

function TeamsContent() {
  const router = useRouter();
  const { cache, loading, error } = useStatsCache();

  if (loading) {
    return <p className="text-gray-500">Loading teams...</p>;
  }

  if (error || !cache) {
    return <p className="text-red-600">{error ?? "Failed to load teams"}</p>;
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[var(--wc-green)]">
        Team Records
      </h2>
      <p className="mb-4 text-sm text-gray-500">
        Search for a national team to view their World Cup history.
      </p>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <TeamSearchSelect
          teams={cache.teamList}
          label="Team"
          placeholder="Type to search (e.g. Brazil, Germany)..."
          onChange={(team) => {
            if (team) router.push(getTeamHref(team));
          }}
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        <Link href="/history" className="text-[var(--wc-green)] hover:underline">
          Back to history
        </Link>
      </p>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <TeamsContent />
    </Suspense>
  );
}
