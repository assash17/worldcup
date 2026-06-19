export const WORLD_CUP_YEARS = [
  1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982,
  1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026,
] as const;

export type WorldCupYear = (typeof WORLD_CUP_YEARS)[number];

export const DEFAULT_YEAR: WorldCupYear = 2026;

export function isValidYear(value: string | number): value is WorldCupYear {
  const year = typeof value === "string" ? Number(value) : value;
  return (WORLD_CUP_YEARS as readonly number[]).includes(year);
}

export function parseYearParam(value: string | null): WorldCupYear {
  if (value && isValidYear(value)) return Number(value) as WorldCupYear;
  return DEFAULT_YEAR;
}
