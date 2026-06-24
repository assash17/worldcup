"use client";

import { formatYearOption } from "@/lib/openfootball/hosts";
import type { WorldCupYearsManifest } from "@/lib/openfootball/manifest-types";
import type { WorldCupYear } from "@/lib/openfootball/years";

interface YearSelectorProps {
  year: WorldCupYear;
  manifest: WorldCupYearsManifest | null;
  onChange: (year: WorldCupYear) => void;
}

export function YearSelector({ year, manifest, onChange }: YearSelectorProps) {
  const editions = manifest?.years ?? [];

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-white/80">Year</span>
      <select
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={editions.length === 0}
        className="min-w-56 rounded-md border-0 bg-white px-3 py-1.5 text-sm font-medium text-[var(--wc-green)] shadow-sm disabled:opacity-60"
      >
        {editions.map((edition) => (
          <option key={edition.year} value={edition.year}>
            {formatYearOption(edition.year, edition.hosts)}
          </option>
        ))}
      </select>
    </label>
  );
}
