"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { GroupPanel } from "@/components/GroupPanel";
import { Tabs } from "@/components/Tabs";
import { formatWorldCupTitle } from "@/lib/openfootball/hosts";
import { useWorldCupData } from "@/lib/hooks/useWorldCupData";
import { useYearFromUrl, useYearNavigation } from "@/lib/hooks/useYearNavigation";
import type { GroupTab } from "@/lib/types";

function GroupsContent() {
  const searchParams = useSearchParams();
  const year = useYearFromUrl();
  const { setTab } = useYearNavigation();
  const { data, loading, error } = useWorldCupData(year);

  const tabParam = searchParams.get("tab") ?? "all";

  const activeTab: GroupTab = useMemo(() => {
    if (!data) return "all";
    if (tabParam === "all") return "all";
    return data.groups.includes(tabParam) ? tabParam : "all";
  }, [data, tabParam]);

  const tabs = useMemo(() => {
    if (!data) return [{ id: "all" as GroupTab, label: "All" }];
    return [
      { id: "all" as GroupTab, label: "All" },
      ...data.groups.map((group) => ({ id: group, label: group })),
    ];
  }, [data]);

  if (loading) {
    return <p className="text-gray-500">Loading group stage...</p>;
  }

  if (error || !data) {
    return <p className="text-red-600">{error ?? "Failed to load data"}</p>;
  }

  if (data.groupMatches.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-bold text-[var(--wc-green)]">
          Group Stage
        </h2>
        <p className="text-gray-500">
          No group stage data for {formatWorldCupTitle(year)}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[var(--wc-green)]">
        Group Stage
      </h2>
      <p className="mb-4 text-sm text-gray-500">{formatWorldCupTitle(year)}</p>
      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={(tab) => setTab("/groups", tab === "all" ? null : tab)}
      />
      <div className="mt-4">
        {activeTab === "all" ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {data.groups.map((group) => (
              <GroupPanel
                key={group}
                group={group}
                matches={data.groupMatches}
                year={year}
                compact
              />
            ))}
          </div>
        ) : (
          <GroupPanel group={activeTab} matches={data.groupMatches} year={year} />
        )}
      </div>
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <GroupsContent />
    </Suspense>
  );
}
