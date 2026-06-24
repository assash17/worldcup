const GITHUB_CONTENTS_URL =
  "https://api.github.com/repos/openfootball/worldcup.json/contents";

const EXCLUDED_YEARS = new Set([1942, 1946, 2025]);

export async function discoverWorldCupYears(): Promise<number[]> {
  const response = await fetch(GITHUB_CONTENTS_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "worldcup-dashboard",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to discover World Cup years from openfootball (${response.status})`,
    );
  }

  const entries = (await response.json()) as { name: string; type: string }[];

  return entries
    .filter((entry) => entry.type === "dir" && /^\d{4}$/.test(entry.name))
    .map((entry) => Number(entry.name))
    .filter((year) => year >= 1930 && !EXCLUDED_YEARS.has(year))
    .sort((a, b) => a - b);
}
