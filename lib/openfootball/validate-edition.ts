import { isEditionComplete } from "./edition-status";
import { countResolvedMatches } from "./match-resolution";
import type { WorldCupData } from "./types";
import type { EditionSummary } from "@/lib/stats/types";

const MIN_PLAYED_RATIO = 0.95;

export class EditionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EditionValidationError";
  }
}

export function validateEditionSummary(summary: EditionSummary): void {
  if (summary.totalMatches === 0) {
    throw new EditionValidationError(
      `World Cup ${summary.year}: no matches in dataset`,
    );
  }

  const resolvedMatches = summary.resolvedMatches ?? summary.playedMatches;

  if (
    !isEditionComplete(summary.year, resolvedMatches, summary.totalMatches)
  ) {
    return;
  }

  const ratio = resolvedMatches / summary.totalMatches;
  if (ratio < MIN_PLAYED_RATIO) {
    throw new EditionValidationError(
      `World Cup ${summary.year}: expected at least ${MIN_PLAYED_RATIO * 100}% resolved matches, got ${resolvedMatches}/${summary.totalMatches} (${(ratio * 100).toFixed(1)}%)`,
    );
  }
}

export function validateAllEditions(summaries: EditionSummary[]): void {
  for (const summary of summaries) {
    validateEditionSummary(summary);
  }
}

export function validateWorldCupData(data: WorldCupData): void {
  const playedMatches = data.matches.filter((m) => m.played).length;
  const resolvedMatches = countResolvedMatches(data.matches);
  validateEditionSummary({
    year: data.year,
    hosts: data.hosts,
    champion: null,
    runnerUp: null,
    thirdPlace: null,
    fourthPlace: null,
    teamCount: 0,
    totalGoals: 0,
    totalMatches: data.matches.length,
    playedMatches,
    resolvedMatches,
    complete: isEditionComplete(
      data.year,
      resolvedMatches,
      data.matches.length,
    ),
    status: "completed",
  });
}