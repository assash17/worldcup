import type { WorldCupYear } from "./years";

export const WORLD_CUP_HOSTS: Record<WorldCupYear, string> = {
  1930: "Uruguay",
  1934: "Italy",
  1938: "France",
  1950: "Brazil",
  1954: "Switzerland",
  1958: "Sweden",
  1962: "Chile",
  1966: "England",
  1970: "Mexico",
  1974: "West Germany",
  1978: "Argentina",
  1982: "Spain",
  1986: "Mexico",
  1990: "Italy",
  1994: "United States",
  1998: "France",
  2002: "South Korea & Japan",
  2006: "Germany",
  2010: "South Africa",
  2014: "Brazil",
  2018: "Russia",
  2022: "Qatar",
  2026: "Canada, Mexico & United States",
};

export function getWorldCupHosts(year: WorldCupYear): string {
  return WORLD_CUP_HOSTS[year];
}

export function formatWorldCupTitle(year: WorldCupYear): string {
  return `FIFA World Cup ${year} — ${getWorldCupHosts(year)}`;
}

export function formatWorldCupShort(year: WorldCupYear): string {
  return `${year} — ${getWorldCupHosts(year)}`;
}

export function formatYearOption(year: WorldCupYear): string {
  return `${year} (${getWorldCupHosts(year)})`;
}
