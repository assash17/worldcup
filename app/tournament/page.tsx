"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { BracketView } from "@/components/BracketView";
import { Tabs } from "@/components/Tabs";
import { formatWorldCupTitle } from "@/lib/openfootball/hosts";
import { useWorldCupData } from "@/lib/hooks/useWorldCupData";
import { useYearFromUrl, useYearNavigation } from "@/lib/hooks/useYearNavigation";
import type { TournamentTab } from "@/lib/types";

function TournamentContent() {
  const searchParams = useSearchParams();
  const year = useYearFromUrl();
  const { setTab } = useYearNavigation();
  const { data, loading, error } = useWorldCupData(year);

  const tabParam = searchParams.get("tab") ?? "all";
  const validTabs = useMemo(() => {
    if (!data) return new Set<string>(["all"]);
    return new Set(["all", ...data.knockoutRounds.map((r) => r.key)]);
  }, [data]);

  const activeTab: TournamentTab = validTabs.has(tabParam) ? tabParam : "all";

  const tabs = useMemo(() => {
    if (!data) return [{ id: "all" as TournamentTab, label: "All" }];
    return [
      { id: "all" as TournamentTab, label: "All" },
      ...data.knockoutRounds.map((round) => ({
        id: round.key,
        label: round.label,
      })),
    ];
  }, [data]);

  if (loading) {
    return <p className="text-gray-500">Loading tournament...</p>;
  }

  if (error || !data) {
    return <p className="text-red-600">{error ?? "Failed to load data"}</p>;
  }

  if (data.knockoutMatches.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-bold text-[var(--wc-green)]">
          Knockout Stage
        </h2>
        <p className="text-gray-500">
          No knockout stage data for {formatWorldCupTitle(year, data.hosts)}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[var(--wc-green)]">
        Knockout Stage
      </h2>
      <p className="mb-4 text-sm text-gray-500">
        {formatWorldCupTitle(year, data.hosts)}
      </p>
      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={(tab) => setTab("/tournament", tab === "all" ? null : tab)}
      />
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <BracketView
          matches={data.knockoutMatches}
          rounds={data.knockoutRounds}
          year={year}
          filter={activeTab}
        />
      </div>
    </div>
  );
}

export default function TournamentPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <TournamentContent />
    </Suspense>
  );
}
