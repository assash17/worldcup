export interface MatchScoreInput {
  homeScore: number | null;
  awayScore: number | null;
  htHomeScore?: number | null;
  htAwayScore?: number | null;
  etHomeScore?: number | null;
  etAwayScore?: number | null;
  homePenalties?: number | null;
  awayPenalties?: number | null;
  played: boolean;
}

export function getFinalDisplayScores(
  scores: MatchScoreInput,
): { home: number; away: number } | null {
  if (!scores.played || scores.homeScore === null || scores.awayScore === null) {
    return null;
  }

  const extraTime = getExtraTimeScores(scores);
  if (extraTime) {
    return extraTime;
  }

  return { home: scores.homeScore, away: scores.awayScore };
}

export function getFirstHalfScores(
  scores: MatchScoreInput,
): { home: number; away: number } | null {
  if (scores.htHomeScore === null || scores.htHomeScore === undefined) {
    return null;
  }
  if (scores.htAwayScore === null || scores.htAwayScore === undefined) {
    return null;
  }

  return { home: scores.htHomeScore, away: scores.htAwayScore };
}

export function getSecondHalfScores(
  scores: MatchScoreInput,
): { home: number; away: number } | null {
  if (scores.homeScore === null || scores.awayScore === null) {
    return null;
  }

  const firstHalf = getFirstHalfScores(scores);
  if (!firstHalf) return null;

  return {
    home: scores.homeScore - firstHalf.home,
    away: scores.awayScore - firstHalf.away,
  };
}

export function getExtraTimeScores(
  scores: MatchScoreInput,
): { home: number; away: number } | null {
  if (scores.etHomeScore === null || scores.etHomeScore === undefined) {
    return null;
  }
  if (scores.etAwayScore === null || scores.etAwayScore === undefined) {
    return null;
  }

  return { home: scores.etHomeScore, away: scores.etAwayScore };
}

export interface ScoreBreakdownItem {
  label: string;
  home: number;
  away: number;
  highlight?: boolean;
}

export function getScoreBreakdown(
  scores: MatchScoreInput,
): ScoreBreakdownItem[] {
  if (!scores.played || scores.homeScore === null || scores.awayScore === null) {
    return [];
  }

  const items: ScoreBreakdownItem[] = [];

  const firstHalf = getFirstHalfScores(scores);
  if (firstHalf) {
    items.push({ label: "First half", ...firstHalf });
  }

  const secondHalf = getSecondHalfScores(scores);
  if (secondHalf) {
    items.push({ label: "Second half", ...secondHalf });
  }

  items.push({
    label: "Full time",
    home: scores.homeScore,
    away: scores.awayScore,
  });

  const extraTime = getExtraTimeScores(scores);
  if (extraTime) {
    items.push({ label: "Extra time", ...extraTime });
  }

  if (
    scores.homePenalties !== null &&
    scores.homePenalties !== undefined &&
    scores.awayPenalties !== null &&
    scores.awayPenalties !== undefined
  ) {
    items.push({
      label: "Penalties",
      home: scores.homePenalties,
      away: scores.awayPenalties,
    });
  }

  const final = getFinalDisplayScores(scores);
  if (final) {
    let finalLabel = "Final";
    if (hasPenalties(scores)) {
      finalLabel = "Final result";
    } else if (extraTime) {
      finalLabel = "Final (after extra time)";
    }

    items.push({
      label: finalLabel,
      home: final.home,
      away: final.away,
      highlight: true,
    });
  }

  return items;
}

export function formatScoreDisplay(
  homeScore: number | null,
  awayScore: number | null,
  played = true,
): string {
  if (!played || homeScore === null || awayScore === null) {
    return "-";
  }
  return `${homeScore} : ${awayScore}`;
}

export function formatFinalScoreDisplay(scores: MatchScoreInput): string {
  const final = getFinalDisplayScores(scores);
  if (!final) return "-";
  return formatScoreDisplay(final.home, final.away, true);
}

export function hasPenalties(scores: MatchScoreInput): boolean {
  const final = getFinalDisplayScores(scores);
  if (!final) return false;

  return (
    final.home === final.away &&
    scores.homePenalties !== null &&
    scores.homePenalties !== undefined &&
    scores.awayPenalties !== null &&
    scores.awayPenalties !== undefined
  );
}

export function toMatchScoreInput(match: MatchScoreInput): MatchScoreInput {
  return match;
}

export function toHomeAwayScoreInput(match: MatchScoreInput): MatchScoreInput {
  return {
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    htHomeScore: match.htHomeScore,
    htAwayScore: match.htAwayScore,
    etHomeScore: match.etHomeScore,
    etAwayScore: match.etAwayScore,
    homePenalties: match.homePenalties,
    awayPenalties: match.awayPenalties,
    played: match.played,
  };
}

export type MatchResult = "win" | "draw" | "loss";

export function getMatchResultForTeam(
  scores: MatchScoreInput,
  homeTeam: string,
  awayTeam: string,
  team: string,
): MatchResult | null {
  const final = getFinalDisplayScores(scores);
  if (!final) return null;

  if (hasPenalties(scores)) return "draw";

  if (team !== homeTeam && team !== awayTeam) return null;

  const teamScore = team === homeTeam ? final.home : final.away;
  const oppScore = team === homeTeam ? final.away : final.home;

  if (teamScore > oppScore) return "win";
  if (teamScore < oppScore) return "loss";
  return "draw";
}
