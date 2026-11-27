export type EditionStatus = "completed" | "in_progress" | "scheduled";

export function getEditionStatus(
  year: number,
  resolvedMatches: number,
  totalMatches: number,
): EditionStatus {
  const calendarYear = new Date().getFullYear();
  if (year > calendarYear) return "scheduled";
  if (totalMatches > 0 && resolvedMatches < totalMatches) return "in_progress";
  return "completed";
}

export function isEditionComplete(
  year: number,
  resolvedMatches: number,
  totalMatches: number,
): boolean {
  return getEditionStatus(year, resolvedMatches, totalMatches) === "completed";
}