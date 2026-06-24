# FIFA World Cup Dashboard

A Next.js dashboard for FIFA World Cup group stages and knockout tournaments, powered by [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json).

**Live site:** [https://assash17.github.io/worldcup/](https://assash17.github.io/worldcup/)

## Features

- **Group Stage** — standings and match results for every group in each tournament
- **Tournament** — knockout rounds from Round of 32 through the Final (when applicable)
- **Match details** — click any match for scores, venue, goals, and more
- **History** — all-time podium table by year with hosts and top-four finishers
- **Team Records** — search and view any national team's World Cup history
- **Head-to-Head** — compare two national teams across all World Cup meetings
- **Team flags** — country flags shown next to every team name
- **All editions** — auto-discovered from openfootball (1930 onward; 2025 Club World Cup excluded)
- **Year selector** — switch tournaments from the navigation bar, with host country shown

## Data source

Match data is fetched at runtime in the browser from:

`https://raw.githubusercontent.com/openfootball/worldcup.json/master/{year}/worldcup.json`

Available tournament years are listed in `public/data/worldcup-years.json`, regenerated from the openfootball repository.

Historical stats (history, team records, head-to-head) are precomputed into `public/data/stats/cache.json`. This cache is **not** rebuilt on every site deploy; it is refreshed **once per day** by a scheduled GitHub Actions workflow.

Team flags are loaded from [flagcdn.com](https://flagcdn.com) using ISO country codes.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — defaults to the latest available edition.

Regenerate the stats cache and years manifest locally:

```bash
npm run generate:stats
```

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
| `/match/g-0?year=2022` | Full match details (click any match) |
| `/history` | All-time World Cup winners and podium |
| `/stats/teams` | Search and view team World Cup history |
| `/stats/compare?team1=Brazil&team2=Argentina` | Head-to-head between two teams |
| `/team/Brazil` | Team World Cup history |

## Deployment (GitHub Pages)

- **Code changes** — pushing to `main` runs [Deploy to GitHub Pages](.github/workflows/deploy-pages.yml) (uses the committed data files; does not regenerate stats).
- **Daily data refresh** — [Refresh stats and deploy](.github/workflows/refresh-stats.yml) runs on a schedule (UTC midnight), fetches the latest openfootball data, updates `public/data/`, commits if changed, rebuilds, and redeploys.

When openfootball adds a new edition (e.g. 2030), it appears in the year list after the next successful daily refresh (up to ~24 hours). Group/tournament pages use live JSON, so match updates can appear sooner once the year is listed in `worldcup-years.json`.

1. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
2. The site is available at [https://assash17.github.io/worldcup/](https://assash17.github.io/worldcup/).

## Notes

- Tournaments without a knockout stage (e.g. 1950) show the final round as a group on the Group Stage page.
- Unplayed matches (future fixtures) display `-` for the score.
- Penalty shootout results are shown when provided in the source data.
- 2026 placeholder teams (`W73`, `1A`, etc.) have no flag until the draw is finalized.
