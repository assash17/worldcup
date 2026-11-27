import { getEditionMirrorUrl } from "./edition-data";
import { parseWorldCup } from "./parser";
import type { OpenFootballWorldCup, WorldCupData } from "./types";

const BASE_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master";

async function fetchRemoteWorldCupRaw(
  year: number,
): Promise<OpenFootballWorldCup> {
  const response = await fetch(`${BASE_URL}/${year}/worldcup.json`);

  if (!response.ok) {
    throw new Error(`Failed to load World Cup ${year} data (${response.status})`);
  }

  return (await response.json()) as OpenFootballWorldCup;
}

export async function fetchWorldCupRaw(year: number): Promise<OpenFootballWorldCup> {
  if (typeof window !== "undefined") {
    try {
      const local = await fetch(getEditionMirrorUrl(year));
      if (local.ok) {
        return (await local.json()) as OpenFootballWorldCup;
      }
    } catch {
      // fall through to remote
    }
  }

  return fetchRemoteWorldCupRaw(year);
}

export async function fetchWorldCupData(year: number): Promise<WorldCupData> {
  const raw = await fetchWorldCupRaw(year);
  return parseWorldCup(year, raw);
}
