import {
  getFlagCdnUrl,
  getTeamFlagCode,
  getTeamFlagUrl,
  isPlaceholderTeam,
} from "./team-codes";

interface RestCountryResult {
  cca2?: string;
  flags?: { png?: string; svg?: string };
  name?: { common?: string };
}

const REST_COUNTRIES_BASE = "https://restcountries.com/v3.1";

export interface FlagLookupResult {
  team: string;
  code: string | null;
  flagUrl: string | null;
  source: "mapping" | "restcountries" | "none";
}

export async function lookupTeamFlag(team: string): Promise<FlagLookupResult> {
  const mappedCode = getTeamFlagCode(team);
  if (mappedCode) {
    return {
      team,
      code: mappedCode,
      flagUrl: getFlagCdnUrl(mappedCode),
      source: "mapping",
    };
  }

  if (isPlaceholderTeam(team)) {
    return { team, code: null, flagUrl: null, source: "none" };
  }

  try {
    const response = await fetch(
      `${REST_COUNTRIES_BASE}/name/${encodeURIComponent(team)}?fields=name,cca2,flags`,
      { next: { revalidate: 86400 } },
    );

    if (!response.ok) {
      return { team, code: null, flagUrl: null, source: "none" };
    }

    const results = (await response.json()) as RestCountryResult[];
    const match = results[0];
    const code = match?.cca2?.toLowerCase() ?? null;
    const flagUrl =
      match?.flags?.png ??
      (code ? getFlagCdnUrl(code) : null) ??
      getTeamFlagUrl(team);

    return {
      team,
      code,
      flagUrl,
      source: flagUrl ? "restcountries" : "none",
    };
  } catch {
    return { team, code: null, flagUrl: null, source: "none" };
  }
}
