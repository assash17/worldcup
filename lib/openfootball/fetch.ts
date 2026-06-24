import { parseWorldCup } from "./parser";
import type { OpenFootballWorldCup, WorldCupData } from "./types";

const BASE_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master";

export async function fetchWorldCupRaw(year: number): Promise<OpenFootballWorldCup> {
  const response = await fetch(`${BASE_URL}/${year}/worldcup.json`);

  if (!response.ok) {
    throw new Error(`Failed to load World Cup ${year} data (${response.status})`);
  }

  return (await response.json()) as OpenFootballWorldCup;
}

export async function fetchWorldCupData(year: number): Promise<WorldCupData> {
  const raw = await fetchWorldCupRaw(year);
  return parseWorldCup(year, raw);
}
