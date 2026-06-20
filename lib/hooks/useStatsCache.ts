"use client";

import { useCallback, useEffect, useState } from "react";
import { getStatsCacheUrl } from "@/lib/stats/client";
import type { StatsCache } from "@/lib/stats/types";

export function useStatsCache() {
  const [cache, setCache] = useState<StatsCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getStatsCacheUrl());
      if (!response.ok) {
        throw new Error(`Failed to load stats cache (${response.status})`);
      }
      const json = (await response.json()) as StatsCache;
      setCache(json);
    } catch (err) {
      setCache(null);
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { cache, loading, error, reload: load };
}
