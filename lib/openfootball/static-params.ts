import { fetchWorldCupData } from "./fetch";
import { WORLD_CUP_YEARS } from "./years";

export async function getAllMatchIds(): Promise<{ id: string }[]> {
  const ids = new Set<string>();

  for (const year of WORLD_CUP_YEARS) {
    const data = await fetchWorldCupData(year);
    for (const match of data.matches) {
      ids.add(match.id);
    }
  }

  return [...ids].map((id) => ({ id }));
}
