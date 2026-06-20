import { readFileSync } from "fs";
import { join } from "path";
import { Suspense } from "react";
import { TeamHistoryPage } from "@/components/TeamHistoryPage";
import type { StatsCache } from "@/lib/stats/types";

function loadTeamList(): string[] {
  try {
    const path = join(process.cwd(), "public", "data", "stats", "cache.json");
    const cache = JSON.parse(readFileSync(path, "utf-8")) as StatsCache;
    return cache.teamList;
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return loadTeamList().map((team) => ({
    name: team,
  }));
}

export default function TeamPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <TeamHistoryPage />
    </Suspense>
  );
}
