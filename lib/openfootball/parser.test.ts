import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseWorldCup } from "./parser";
import type { OpenFootballWorldCup } from "./types";

function cup(matches: OpenFootballWorldCup["matches"]): OpenFootballWorldCup {
  return { name: "World Cup Test", matches };
}

describe("parseWorldCup scores", () => {
  it("parses object score with ft", () => {
    const data = parseWorldCup(
      2018,
      cup([
        {
          round: "Final",
          date: "2018-07-15",
          team1: "France",
          team2: "Croatia",
          score: { ft: [4, 2] },
        },
      ]),
    );
    const final = data.matches[0];
    assert.equal(final.played, true);
    assert.equal(final.homeScore, 4);
    assert.equal(final.awayScore, 2);
    assert.equal(final.winner, "France");
  });

  it("parses legacy array score", () => {
    const data = parseWorldCup(
      2002,
      cup([
        {
          round: "Final",
          date: "2002-06-30",
          team1: "Germany",
          team2: "Brazil",
          score: [0, 2],
        },
      ]),
    );
    const final = data.matches[0];
    assert.equal(final.played, true);
    assert.equal(final.homeScore, 0);
    assert.equal(final.awayScore, 2);
    assert.equal(final.winner, "Brazil");
  });

  it("parses penalties on object score", () => {
    const data = parseWorldCup(
      2006,
      cup([
        {
          round: "Final",
          date: "2006-07-09",
          team1: "Italy",
          team2: "France",
          score: { ft: [1, 1], p: [5, 3] },
        },
      ]),
    );
    const final = data.matches[0];
    assert.equal(final.homePenalties, 5);
    assert.equal(final.awayPenalties, 3);
    assert.equal(final.winner, "Italy");
  });

  it("marks canceled fixtures without score", () => {
    const data = parseWorldCup(
      1938,
      cup([
        {
          round: "First round",
          date: "1938-06-05",
          team1: "Sweden",
          team2: "Austria",
          status: "canceled",
        },
      ]),
    );
    const match = data.matches[0];
    assert.equal(match.canceled, true);
    assert.equal(match.played, false);
  });

  it("marks missing score as unplayed", () => {
    const data = parseWorldCup(
      2026,
      cup([
        {
          round: "Matchday 1",
          date: "2026-06-11",
          team1: "Mexico",
          team2: "TBD",
          group: "Group A",
        },
      ]),
    );
    const match = data.matches[0];
    assert.equal(match.played, false);
    assert.equal(match.homeScore, null);
    assert.equal(match.awayScore, null);
  });
});