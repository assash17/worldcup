"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getWorldCupYearsUrl } from "@/lib/openfootball/manifest-client";
import type { WorldCupYearsManifest } from "@/lib/openfootball/manifest-types";
import { getDefaultYear, getKnownYears } from "@/lib/openfootball/years";

export function useWorldCupYears() {
  const [manifest, setManifest] = useState<WorldCupYearsManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getWorldCupYearsUrl());
      if (!response.ok) {
        throw new Error(`Failed to load World Cup years (${response.status})`);
      }
      const json = (await response.json()) as WorldCupYearsManifest;
      setManifest(json);
    } catch (err) {
      setManifest(null);
      setError(err instanceof Error ? err.message : "Failed to load years");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const knownYears = useMemo(
    () => getKnownYears(manifest?.years.map((edition) => edition.year)),
    [manifest],
  );

  const defaultYear = useMemo(() => getDefaultYear(knownYears), [knownYears]);

  return {
    manifest,
    knownYears,
    defaultYear,
    loading,
    error,
    reload: load,
  };
}
