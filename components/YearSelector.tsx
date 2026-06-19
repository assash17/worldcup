"use client";

import { formatYearOption } from "@/lib/openfootball/hosts";
import { WORLD_CUP_YEARS, type WorldCupYear } from "@/lib/openfootball/years";

interface YearSelectorProps {
  year: WorldCupYear;
  onChange: (year: WorldCupYear) => void;
}

export function YearSelector({ year, onChange }: YearSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-white/80">Year</span>
      <select
        value={year}
        onChange={(e) => onChange(Number(e.target.value) as WorldCupYear)}
        className="min-w-56 rounded-md border-0 bg-white px-3 py-1.5 text-sm font-medium text-[var(--wc-green)] shadow-sm"
      >
        {[...WORLD_CUP_YEARS].reverse().map((y) => (
          <option key={y} value={y}>
            {formatYearOption(y)}
          </option>
        ))}
      </select>
    </label>
  );
}
