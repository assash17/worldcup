import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { buildWorldCupYearsManifest } from "../lib/openfootball/manifest-server";
import { validateAllEditions } from "../lib/openfootball/validate-edition";
import { buildStatsCacheFromEditions } from "../lib/stats/build-cache";
import { collectMatchIdParams, loadAllEditions } from "../lib/stats/load-editions";

async function main() {
  console.log("Generating World Cup years manifest...");
  const manifest = await buildWorldCupYearsManifest();

  const dataDir = join(process.cwd(), "public", "data");
  mkdirSync(dataDir, { recursive: true });

  const manifestPath = join(dataDir, "worldcup-years.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Wrote ${manifestPath} (${manifest.years.length} editions)`);

  console.log("Loading editions from openfootball...");
  const editions = await loadAllEditions();

  const editionsDir = join(dataDir, "editions");
  const stagingDir = join(dataDir, ".editions-staging");
  rmSync(stagingDir, { recursive: true, force: true });
  mkdirSync(stagingDir, { recursive: true });

  for (const edition of editions) {
    const filePath = join(stagingDir, `${edition.year}.json`);
    writeFileSync(filePath, JSON.stringify(edition.raw, null, 2), "utf-8");
  }

  rmSync(editionsDir, { recursive: true, force: true });
  mkdirSync(editionsDir, { recursive: true });
  for (const edition of editions) {
    const from = join(stagingDir, `${edition.year}.json`);
    const to = join(editionsDir, `${edition.year}.json`);
    writeFileSync(to, readFileSync(from, "utf-8"), "utf-8");
  }
  rmSync(stagingDir, { recursive: true, force: true });
  console.log(`Wrote ${editions.length} edition mirrors under public/data/editions/`);

  console.log("Generating stats cache...");
  const cache = buildStatsCacheFromEditions(editions);
  validateAllEditions(cache.editions);
  console.log("Edition validation passed.");

  const statsDir = join(dataDir, "stats");
  mkdirSync(statsDir, { recursive: true });

  const cachePath = join(statsDir, "cache.json");
  const cacheStaging = join(statsDir, "cache.json.tmp");
  writeFileSync(cacheStaging, JSON.stringify(cache, null, 2), "utf-8");
  rmSync(cachePath, { force: true });
  writeFileSync(cachePath, readFileSync(cacheStaging, "utf-8"), "utf-8");
  rmSync(cacheStaging, { force: true });
  console.log(
    `Wrote ${cachePath} (${cache.editions.length} editions, ${cache.teamList.length} teams)`,
  );

  const matchIds = collectMatchIdParams(editions);
  const matchIdsPath = join(dataDir, "match-ids.json");
  const matchIdsStaging = join(dataDir, "match-ids.json.tmp");
  writeFileSync(matchIdsStaging, JSON.stringify(matchIds, null, 2), "utf-8");
  rmSync(matchIdsPath, { force: true });
  writeFileSync(matchIdsPath, readFileSync(matchIdsStaging, "utf-8"), "utf-8");
  rmSync(matchIdsStaging, { force: true });
  console.log(`Wrote ${matchIdsPath} (${matchIds.length} match routes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});