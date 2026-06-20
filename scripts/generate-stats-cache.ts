import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { buildStatsCache } from "../lib/stats/build-cache";

async function main() {
  console.log("Generating stats cache...");
  const cache = await buildStatsCache();

  const outDir = join(process.cwd(), "public", "data", "stats");
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "cache.json");
  writeFileSync(outPath, JSON.stringify(cache, null, 2), "utf-8");

  console.log(
    `Wrote ${outPath} (${cache.editions.length} editions, ${cache.teamList.length} teams)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
