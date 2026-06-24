const HOST_OVERRIDES: Record<number, string> = {
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

export function parseHostsFromEditionName(
  name: string,
  year: number,
): string | null {
  let cleaned = name.trim();
  cleaned = cleaned.replace(new RegExp(`\\b${year}\\b`, "g"), "");
  cleaned = cleaned.replace(/\bFIFA\b/gi, "");
  cleaned = cleaned.replace(/\bWorld Cup\b/gi, "");
  cleaned = cleaned.replace(/^[\s\-–—|:]+|[\s\-–—|:]+$/g, "");
  cleaned = cleaned.trim();

  return cleaned || null;
}

export function resolveWorldCupHosts(year: number, editionName: string): string {
  const override = HOST_OVERRIDES[year];
  if (override) return override;

  const parsed = parseHostsFromEditionName(editionName, year);
  if (parsed) return parsed;

  return "TBD";
}

export function formatWorldCupTitle(year: number, hosts: string): string {
  return `FIFA World Cup ${year} — ${hosts}`;
}

export function formatWorldCupShort(year: number, hosts: string): string {
  return `${year} — ${hosts}`;
}

export function formatYearOption(year: number, hosts: string): string {
  return `${year} (${hosts})`;
}
