"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useWorldCupYears } from "@/lib/hooks/useWorldCupYears";
import { parseYearParam, type WorldCupYear } from "@/lib/openfootball/years";

export function useYearFromUrl(): WorldCupYear {
  const searchParams = useSearchParams();
  const { knownYears, defaultYear } = useWorldCupYears();
  return parseYearParam(searchParams.get("year"), knownYears, defaultYear);
}

export function useYearNavigation() {
  const router = useRouter();
  const year = useYearFromUrl();

  const setTab = (pathname: string, tab: string | null) => {
    const params = new URLSearchParams();
    params.set("year", String(year));
    if (tab && tab !== "all") {
      params.set("tab", tab);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return { year, setTab };
}
