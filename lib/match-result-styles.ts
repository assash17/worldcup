import type { MatchResult } from "@/lib/match-score";

export const MATCH_RESULT_ROW_CLASS: Record<MatchResult, string> = {
  win: "bg-green-50 border-green-200",
  draw: "bg-amber-50 border-amber-200",
  loss: "bg-red-50 border-red-200",
};

export const MATCH_RESULT_BADGE_CLASS: Record<MatchResult, string> = {
  win: "inline-flex min-w-7 items-center justify-center rounded border border-green-200 bg-green-50 px-2 py-0.5 font-semibold tabular-nums text-green-800",
  draw: "inline-flex min-w-7 items-center justify-center rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-semibold tabular-nums text-amber-800",
  loss: "inline-flex min-w-7 items-center justify-center rounded border border-red-200 bg-red-50 px-2 py-0.5 font-semibold tabular-nums text-red-800",
};
