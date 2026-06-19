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

export function hasPenalties(
  homeScore: number | null,
  awayScore: number | null,
  homePenalties: number | null,
  awayPenalties: number | null,
  played: boolean,
): boolean {
  return (
    played &&
    homeScore !== null &&
    awayScore !== null &&
    homeScore === awayScore &&
    homePenalties !== null &&
    awayPenalties !== null
  );
}
