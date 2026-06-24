import { readFileSync } from "fs";
import { join } from "path";
import { discoverWorldCupYears } from "./discover-years";
import { fetchWorldCupRaw } from "./fetch";
import { resolveWorldCupHosts } from "./hosts";
import type { WorldCupEditionMeta, WorldCupYearsManifest } from "./manifest-types";

export async function buildWorldCupYearsManifest(): Promise<WorldCupYearsManifest> {
  const years = await discoverWorldCupYears();
  const editions = await Promise.all(
    years.map(async (year): Promise<WorldCupEditionMeta> => {
      const raw = await fetchWorldCupRaw(year);
      return {
        year,
        name: raw.name,
        hosts: resolveWorldCupHosts(year, raw.name),
      };
    }),
  );

  return {
    generatedAt: new Date().toISOString(),
    years: editions.sort((a, b) => b.year - a.year),
  };
}

export function loadWorldCupYearsManifestSync(): WorldCupYearsManifest {
  const path = join(process.cwd(), "public", "data", "worldcup-years.json");
  return JSON.parse(readFileSync(path, "utf-8")) as WorldCupYearsManifest;
}
