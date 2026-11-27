import {
  getEditionStatus,
  isEditionComplete,
} from "@/lib/openfootball/edition-status";
import { countResolvedMatches } from "@/lib/openfootball/match-resolution";
import type { WorldCupData } from "@/lib/openfootball/types";
import type { WorldCupYear } from "@/lib/openfootball/years";
import { computeGroupStandings } from "@/lib/standings";
import type { EditionSummary } from "./types";
import { collectTeams, countTotalGoals, getLoser } from "./helpers";

export function extractEditionSummary(data: WorldCupData): EditionSummary {
  const final = data.knockoutMatches.find((m) => m.roundKey === "final");
  const third = data.knockoutMatches.find((m) => m.roundKey === "third");

  let champion: string | null = null;
  let runnerUp: string | null = null;
  let thirdPlace: string | null = null;
  let fourthPlace: string | null = null;

  if (final?.played) {
    champion = final.winner;
    runnerUp = getLoser(final);
  } else {
    const finalRoundMatches = data.groupMatches.filter(
      (m) => m.group === "Final Round",
    );
    if (finalRoundMatches.length > 0) {
      const standings = computeGroupStandings(
        "Final Round",
        data.groupMatches,
      );
      champion = standings[0]?.team ?? null;
      runnerUp = standings[1]?.team ?? null;
      thirdPlace = standings[2]?.team ?? null;
      fourthPlace = standings[3]?.team ?? null;
    }
  }

  if (third?.played) {
    thirdPlace = third.winner;
    fourthPlace = getLoser(third);
  }

  const playedMatches = data.matches.filter((m) => m.played).length;
  const resolvedMatches = countResolvedMatches(data.matches);
  const totalMatches = data.matches.length;
  const status = getEditionStatus(data.year, resolvedMatches, totalMatches);
  const complete = isEditionComplete(data.year, resolvedMatches, totalMatches);

  if (!complete) {
    champion = null;
    runnerUp = null;
    thirdPlace = null;
    fourthPlace = null;
  }

  return {
    year: data.year as WorldCupYear,
    hosts: data.hosts,
    status,
    complete,
    champion,
    runnerUp,
    thirdPlace,
    fourthPlace,
    teamCount: collectTeams(data.matches).length,
    totalGoals: countTotalGoals(data.matches),
    totalMatches,
    playedMatches,
    resolvedMatches,
  };
}

export function editionStatusFromWorldCupData(data: WorldCupData) {
  const resolvedMatches = countResolvedMatches(data.matches);
  return getEditionStatus(data.year, resolvedMatches, data.matches.length);
}
