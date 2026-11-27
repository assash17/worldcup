import { readFileSync } from "fs";
import { join } from "path";

export function getAllMatchIds(): { id: string }[] {
  const path = join(process.cwd(), "public", "data", "match-ids.json");
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as { id: string }[];
  } catch {
    return [];
  }
}