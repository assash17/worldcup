# FIFA World Cup Dashboard

A Next.js dashboard for FIFA World Cup group stages and knockout tournaments, powered by [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json).

## Features

- **Group Stage** — standings and match results for every group in each tournament
- **Tournament** — knockout rounds from Round of 32 through the Final (when applicable)
- **All editions** — 1930 through 2026 (every FIFA World Cup year in openfootball, excluding the 2025 Club World Cup)
- **Year selector** — switch tournaments from the navigation bar

## Data source

Match data is fetched at runtime from:

`https://raw.githubusercontent.com/openfootball/worldcup.json/master/{year}/worldcup.json`

Results are cached for one hour via Next.js revalidation.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — defaults to the 2026 edition.

## Pages

| Route | Description |
|-------|-------------|
| `/groups?year=2022` | Group stage standings and results |
| `/tournament?year=2022` | Knockout bracket by round |
| `/match/g-0?year=2022` | Full match details (click any match to open) |

## Flags

Team flags are shown next to every country name. Flag images are served from [flagcdn.com](https://flagcdn.com) using ISO country codes, with a static mapping for historical teams (e.g. West Germany, Soviet Union) and UK home nations (England, Scotland, Wales).

Lookup API (optional):

```
GET /api/flags/Qatar
```

Returns `{ team, code, flagUrl, source }` using the local mapping with [REST Countries](https://restcountries.com) as fallback.

## Notes

- Tournaments without a knockout stage (e.g. 1950) show the final round as a group on the Group Stage page.
- Unplayed matches (future fixtures) display `-` for the score.
- Penalty shootout results are shown when provided in the source data.
