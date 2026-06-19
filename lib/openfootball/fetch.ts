import { parseWorldCup } from "./parser";
import type { OpenFootballWorldCup, WorldCupData } from "./types";

const BASE_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master";

export async function fetchWorldCupData(year: number): Promise<WorldCupData> {
  const response = await fetch(`${BASE_URL}/${year}/worldcup.json`);

  if (!response.ok) {
    throw new Error(`Failed to load World Cup ${year} data (${response.status})`);
  }

  const raw = (await response.json()) as OpenFootballWorldCup;
  return parseWorldCup(year, raw);
}
