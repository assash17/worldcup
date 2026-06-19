# FIFA World Cup Dashboard

A Next.js dashboard for FIFA World Cup group stages and knockout tournaments, powered by [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json).

**Live site:** [https://assash17.github.io/worldcup/](https://assash17.github.io/worldcup/)

## Features

- **Group Stage** — standings and match results for every group in each tournament
- **Tournament** — knockout rounds from Round of 32 through the Final (when applicable)
- **Match details** — click any match for scores, venue, goals, and more
- **Team flags** — country flags shown next to every team name
- **All editions** — 1930 through 2026 (every FIFA World Cup year in openfootball, excluding the 2025 Club World Cup)
- **Year selector** — switch tournaments from the navigation bar, with host country shown for each edition

## Data source

Match data is fetched at runtime in the browser from:

`https://raw.githubusercontent.com/openfootball/worldcup.json/master/{year}/worldcup.json`

Team flags are loaded from [flagcdn.com](https://flagcdn.com) using ISO country codes, with a static mapping for historical teams (e.g. West Germany, Soviet Union) and UK home nations (England, Scotland, Wales).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — defaults to the 2026 edition.

### GitHub Pages build (local)

```bash
npm run build:pages
```

Static files are written to `out/`. This uses `basePath: /worldcup` to match the repository name.

## Pages

| Route | Description |
|-------|-------------|
| `/groups?year=2022` | Group stage standings and results |
| `/tournament?year=2022` | Knockout bracket by round |
| `/match/g-0?year=2022` | Full match details (click any match to open) |

## Deployment (GitHub Pages)

This project deploys automatically to GitHub Pages when changes are pushed to `main`.

1. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main` — the [Deploy to GitHub Pages](.github/workflows/deploy-pages.yml) workflow builds and publishes the site.
3. The site is available at [https://assash17.github.io/worldcup/](https://assash17.github.io/worldcup/).

## Notes

- Tournaments without a knockout stage (e.g. 1950) show the final round as a group on the Group Stage page.
- Unplayed matches (future fixtures) display `-` for the score.
- Penalty shootout results are shown when provided in the source data.
- 2026 placeholder teams (`W73`, `1A`, etc.) have no flag until the draw is finalized.
