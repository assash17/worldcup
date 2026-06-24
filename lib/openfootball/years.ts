export type WorldCupYear = number;

export const MIN_WORLD_CUP_YEAR = 1930;

export const FALLBACK_DEFAULT_YEAR = 2026;

export function getKnownYears(years: number[] | undefined): number[] {
  return years ?? [];
}

export function getDefaultYear(years: number[] | undefined): WorldCupYear {
  if (years?.length) return Math.max(...years);
  return FALLBACK_DEFAULT_YEAR;
}

export function isValidYear(
  value: string | number,
  knownYears?: number[],
): value is WorldCupYear {
  const year = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(year) || year < MIN_WORLD_CUP_YEAR) {
    return false;
  }

  if (knownYears?.length) {
    return knownYears.includes(year);
  }

  return true;
}

export function parseYearParam(
  value: string | null,
  knownYears?: number[],
  defaultYear?: WorldCupYear,
): WorldCupYear {
  if (value && isValidYear(value, knownYears)) {
    return Number(value);
  }

  return defaultYear ?? getDefaultYear(knownYears);
}
