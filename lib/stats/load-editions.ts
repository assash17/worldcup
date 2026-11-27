import { discoverWorldCupYears } from "@/lib/openfootball/discover-years";
import { fetchWorldCupRaw } from "@/lib/openfootball/fetch";
import { parseWorldCup } from "@/lib/openfootball/parser";
import type { OpenFootballWorldCup, WorldCupData } from "@/lib/openfootball/types";

export interface LoadedEdition {
  year: number;
  raw: OpenFootballWorldCup;
  data: WorldCupData;
}

export async function loadAllEditions(): Promise<LoadedEdition[]> {
  const years = await discoverWorldCupYears();
  const editions: LoadedEdition[] = [];

  for (const year of years) {
    const raw = await fetchWorldCupRaw(year);
    editions.push({ year, raw, data: parseWorldCup(year, raw) });
  }

  return editions;
}

export function collectMatchIdParams(editions: LoadedEdition[]): { id: string }[] {
  const ids = new Set<string>();
  for (const edition of editions) {
    for (const match of edition.data.matches) {
      ids.add(match.id);
    }
  }

  return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map((id) => ({
    id,
  }));
}