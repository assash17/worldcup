"use client";

import { useCallback, useEffect, useState } from "react";
import type { WorldCupData } from "@/lib/openfootball/types";
import { DEFAULT_YEAR, type WorldCupYear } from "@/lib/openfootball/years";

export function useWorldCupData(year: WorldCupYear = DEFAULT_YEAR) {
  const [data, setData] = useState<WorldCupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/worldcup/${year}`);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? `Failed to load World Cup ${year}`);
      }
      const json = (await response.json()) as WorldCupData;
      setData(json);
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
