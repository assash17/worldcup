import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { WorldCupData } from "@/lib/openfootball/types";
import { extractEditionSummary } from "./editions";

function baseData(overrides: Partial<WorldCupData>): WorldCupData {
  return {
    year: 2026,
    name: "World Cup 2026",
    hosts: "USA",
    matches: [],
    matchesById: {},
    groupMatches: [],
    knockoutMatches: [],
    groups: [],
    knockoutRounds: [],
    ...overrides,
  };
}

describe("extractEditionSummary", () => {
  it("clears podium when edition is in progress", () => {
    const futureYear = new Date().getFullYear() + 1;
    const summary = extractEditionSummary(
      baseData({
        year: futureYear,
        matches: [
          {
            id: "k-0",
            type: "knockout",
            group: null,
            round: "Final",
            roundKey: "final",
            matchday: null,
            date: "2030-07-01",
            time: null,
            ground: null,
            home: "A",
            away: "B",
            homeScore: 2,
            awayScore: 1,
            htHomeScore: null,
            htAwayScore: null,
            etHomeScore: null,
            etAwayScore: null,
            homePenalties: null,
            awayPenalties: null,
            goalsHome: [],
            goalsAway: [],
            played: true,
            canceled: false,
            winner: "A",
            order: 1,
          },
        ],
        knockoutMatches: [],
        groupMatches: [],
      }),
    );
    assert.equal(summary.status, "scheduled");
    assert.equal(summary.complete, false);
    assert.equal(summary.champion, null);
  });

  it("keeps champion when knockout final is played and complete", () => {
    const match = {
      id: "k-0",
      type: "knockout" as const,
      group: null,
      round: "Final",
      roundKey: "final" as const,
      matchday: null,
      date: "2022-12-18",
      time: null,
      ground: null,
      home: "Argentina",
      away: "France",
      homeScore: 3,
      awayScore: 3,
      htHomeScore: null,
      htAwayScore: null,
      etHomeScore: 2,
      etAwayScore: 2,
      homePenalties: 4,
      awayPenalties: 2,
      goalsHome: [],
      goalsAway: [],
      played: true,
      canceled: false,
      winner: "Argentina",
      order: 1,
    };
    const summary = extractEditionSummary(
      baseData({
        year: 2022,
        matches: [match],
        knockoutMatches: [match],
      }),
    );
    assert.equal(summary.complete, true);
    assert.equal(summary.champion, "Argentina");
  });

  it("treats canceled fixtures as resolved for edition status", () => {
    const summary = extractEditionSummary(
      baseData({
        year: 1938,
        knockoutMatches: [
          {
            id: "k-8",
            type: "knockout",
            group: null,
            round: "Final",
            roundKey: "final",
            matchday: null,
            date: "1938-06-19",
            time: null,
            ground: null,
            home: "Italy",
            away: "Hungary",
            homeScore: 4,
            awayScore: 2,
            htHomeScore: null,
            htAwayScore: null,
            etHomeScore: null,
            etAwayScore: null,
            homePenalties: null,
            awayPenalties: null,
            goalsHome: [],
            goalsAway: [],
            played: true,
            canceled: false,
            winner: "Italy",
            order: 1,
          },
        ],
        matches: [
          {
            id: "g-0",
            type: "group",
            group: "Ungrouped",
            round: "First round",
            roundKey: null,
            matchday: null,
            date: "1938-06-05",
            time: null,
            ground: null,
            home: "Sweden",
            away: "Austria",
            homeScore: null,
            awayScore: null,
            htHomeScore: null,
            htAwayScore: null,
            etHomeScore: null,
            etAwayScore: null,
            homePenalties: null,
            awayPenalties: null,
            goalsHome: [],
            goalsAway: [],
            played: false,
            canceled: true,
            winner: null,
            order: null,
          },
        ],
        groupMatches: [],
      }),
    );
    assert.equal(summary.complete, true);
    assert.equal(summary.status, "completed");
    assert.equal(summary.champion, "Italy");
  });
});