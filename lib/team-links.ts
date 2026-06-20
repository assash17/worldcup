export function getTeamHref(team: string): string {
  return `/team/${encodeURIComponent(team)}`;
}
