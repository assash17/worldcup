"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { YearSelector } from "./YearSelector";
import { formatWorldCupShort } from "@/lib/openfootball/hosts";
import { getHostsForYear } from "@/lib/openfootball/manifest-client";
import { useWorldCupYears } from "@/lib/hooks/useWorldCupYears";
import { parseYearParam, type WorldCupYear } from "@/lib/openfootball/years";

const editionLinks = [
  { href: "/groups", label: "Group Stage" },
  { href: "/tournament", label: "Tournament" },
];

const globalLinks = [
  { href: "/history", label: "History" },
  { href: "/stats/teams", label: "Teams" },
  { href: "/stats/compare", label: "Head-to-Head" },
];

function isGlobalStatsPath(pathname: string): boolean {
  return (
    pathname.startsWith("/history") ||
    pathname.startsWith("/stats") ||
    pathname.startsWith("/team")
  );
}

function NavigationContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { manifest, knownYears, defaultYear } = useWorldCupYears();
  const year = parseYearParam(searchParams.get("year"), knownYears, defaultYear);
  const isGlobalPage = isGlobalStatsPath(pathname);
  const hosts = manifest ? getHostsForYear(manifest, year) : "…";

  const withYear = (href: string) => `${href}?year=${year}`;

  const onYearChange = (nextYear: WorldCupYear) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(nextYear));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="bg-[var(--wc-green)] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--wc-gold)]">
              FIFA World Cup
            </p>
            <h1 className="text-xl font-bold">
              {isGlobalPage ? "History & Statistics" : formatWorldCupShort(year, hosts)}
            </h1>
          </div>
          {!isGlobalPage && (
            <Link
              href="/history"
              className="self-start text-sm text-white/80 underline-offset-2 hover:text-white hover:underline"
            >
              All-time stats →
            </Link>
          )}
          {isGlobalPage && (
            <Link
              href={`/groups?year=${defaultYear}`}
              className="self-start text-sm text-white/80 underline-offset-2 hover:text-white hover:underline"
            >
              Tournament records →
            </Link>
          )}
        </div>

        {isGlobalPage ? (
          <nav className="flex flex-wrap gap-2 border-t border-white/20 pt-3">
            {globalLinks.map((link) => {
              const active =
                pathname.startsWith(link.href) ||
                (link.href === "/stats/teams" && pathname.startsWith("/team"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
        ) : (
          <div className="flex flex-wrap items-center gap-3 border-t border-white/20 pt-3">
            <YearSelector year={year} manifest={manifest} onChange={onYearChange} />
            <nav className="flex flex-wrap gap-2">
              {editionLinks.map((link) => {
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
        )}
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
