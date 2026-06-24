import { discoverWorldCupYears } from "@/lib/openfootball/discover-years";
import { fetchWorldCupData } from "@/lib/openfootball/fetch";
import { extractEditionSummary } from "./editions";
import { buildAllTeamHistories } from "./team-records";
import type { StatsCache } from "./types";

export async function buildStatsCache(): Promise<StatsCache> {
  const years = await discoverWorldCupYears();
  const datasets = await Promise.all(years.map((year) => fetchWorldCupData(year)));

  const editions = datasets
    .map(extractEditionSummary)
    .sort((a, b) => b.year - a.year);

  const teams = buildAllTeamHistories(datasets);
  const teamList = Object.keys(teams).sort((a, b) => a.localeCompare(b));

  return {
    generatedAt: new Date().toISOString(),
    editions,
    teams,
    teamList,
  };
}
