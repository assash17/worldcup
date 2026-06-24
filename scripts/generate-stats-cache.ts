import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { buildWorldCupYearsManifest } from "../lib/openfootball/manifest-server";
import { buildStatsCache } from "../lib/stats/build-cache";

async function main() {
  console.log("Generating World Cup years manifest...");
  const manifest = await buildWorldCupYearsManifest();

  const dataDir = join(process.cwd(), "public", "data");
  mkdirSync(dataDir, { recursive: true });

  const manifestPath = join(dataDir, "worldcup-years.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Wrote ${manifestPath} (${manifest.years.length} editions)`);

  console.log("Generating stats cache...");
  const cache = await buildStatsCache();

  const statsDir = join(dataDir, "stats");
  mkdirSync(statsDir, { recursive: true });

  const cachePath = join(statsDir, "cache.json");
  writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
  console.log(
    `Wrote ${cachePath} (${cache.editions.length} editions, ${cache.teamList.length} teams)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
