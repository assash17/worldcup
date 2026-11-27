import { extractEditionSummary } from "./editions";
import { loadAllEditions, type LoadedEdition } from "./load-editions";
import { buildAllTeamHistories } from "./team-records";
import type { StatsCache } from "./types";

export function buildStatsCacheFromEditions(editions: LoadedEdition[]): StatsCache {
  const datasets = editions.map((edition) => edition.data);

  const summaries = datasets
    .map(extractEditionSummary)
    .sort((a, b) => b.year - a.year);

  const teams = buildAllTeamHistories(datasets);
  const teamList = Object.keys(teams).sort((a, b) => a.localeCompare(b));

  return {
    generatedAt: new Date().toISOString(),
    editions: summaries,
    teams,
    teamList,
  };
}

export async function buildStatsCache(): Promise<StatsCache> {
  const editions = await loadAllEditions();
  return buildStatsCacheFromEditions(editions);
}
