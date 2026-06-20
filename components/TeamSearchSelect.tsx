"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface TeamSearchSelectProps {
  teams: string[];
  value?: string;
  placeholder?: string;
  label?: string;
  onChange: (team: string) => void;
}

export function TeamSearchSelect({
  teams,
  value = "",
  placeholder = "Search for a team...",
  label,
  onChange,
}: TeamSearchSelectProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return teams;
    return teams.filter((team) => team.toLowerCase().includes(normalized));
  }, [teams, query]);

  const selectTeam = (team: string) => {
    setQuery(team);
    setOpen(false);
    onChange(team);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {label ? (
        <label className="mb-1 block text-sm text-gray-500">{label}</label>
      ) : null}
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        autoComplete="off"
      />
      {open && filtered.length > 0 ? (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {filtered.slice(0, 50).map((team) => (
            <li key={team}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-green-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectTeam(team)}
              >
                {team}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {open && query.trim() && filtered.length === 0 ? (
        <p className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-lg">
          No teams found.
        </p>
      ) : null}
    </div>
  );
}
