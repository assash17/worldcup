import type { WorldCupEditionMeta, WorldCupYearsManifest } from "./manifest-types";

export type { WorldCupEditionMeta, WorldCupYearsManifest } from "./manifest-types";

export function getWorldCupYearsUrl(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/data/worldcup-years.json`;
}

export function getHostsForYear(
  manifest: WorldCupYearsManifest,
  year: number,
): string {
  return manifest.years.find((edition) => edition.year === year)?.hosts ?? "TBD";
}
