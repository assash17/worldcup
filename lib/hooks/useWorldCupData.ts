"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchWorldCupData } from "@/lib/openfootball/fetch";
import type { WorldCupData } from "@/lib/openfootball/types";
import { FALLBACK_DEFAULT_YEAR, type WorldCupYear } from "@/lib/openfootball/years";

export function useWorldCupData(year: WorldCupYear = FALLBACK_DEFAULT_YEAR) {
  const [data, setData] = useState<WorldCupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const worldCupData = await fetchWorldCupData(year);
      setData(worldCupData);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
