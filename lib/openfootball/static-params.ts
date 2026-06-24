import { fetchWorldCupData } from "./fetch";
import { loadWorldCupYearsManifestSync } from "./manifest-server";

export async function getAllMatchIds(): Promise<{ id: string }[]> {
  const manifest = loadWorldCupYearsManifestSync();
  const ids = new Set<string>();

  for (const edition of manifest.years) {
    const data = await fetchWorldCupData(edition.year);
    for (const match of data.matches) {
      ids.add(match.id);
    }
  }

  return [...ids].map((id) => ({ id }));
}
