export function getEditionMirrorUrl(year: number): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/data/editions/${year}.json`;
}

export function getEditionMirrorPath(year: number): string {
  return `editions/${year}.json`;
}