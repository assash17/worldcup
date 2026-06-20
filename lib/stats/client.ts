export function getStatsCacheUrl(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/data/stats/cache.json`;
}
