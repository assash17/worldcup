"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { YearSelector } from "./YearSelector";
import { formatWorldCupShort } from "@/lib/openfootball/hosts";
import { parseYearParam, type WorldCupYear } from "@/lib/openfootball/years";

const links = [
  { href: "/groups", label: "Group Stage" },
  { href: "/tournament", label: "Tournament" },
];

function NavigationContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const year = parseYearParam(searchParams.get("year"));

  const withYear = (href: string) => `${href}?year=${year}`;

  const onYearChange = (nextYear: WorldCupYear) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(nextYear));
    window.location.href = `${pathname}?${params.toString()}`;
  };

  return (
    <header className="bg-[var(--wc-green)] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--wc-gold)]">
            FIFA World Cup
          </p>
          <h1 className="text-xl font-bold">{formatWorldCupShort(year)}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <YearSelector year={year} onChange={onYearChange} />
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={withYear(link.href)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-white text-[var(--wc-green)]"
                      : "bg-[var(--wc-green-light)] hover:bg-white/20"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Navigation() {
  return (
    <Suspense
      fallback={
        <header className="bg-[var(--wc-green)] px-4 py-4 text-white shadow-md">
          <p className="text-xl font-bold">FIFA World Cup Dashboard</p>
        </header>
      }
    >
      <NavigationContent />
    </Suspense>
  );
}
