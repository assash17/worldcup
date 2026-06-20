import type { WorldCupYear } from "@/lib/openfootball/years";

export interface EditionSummary {
  year: WorldCupYear;
  hosts: string;
  champion: string | null;
  runnerUp: string | null;
  thirdPlace: string | null;
  fourthPlace: string | null;
  teamCount: number;
  totalGoals: number;
  totalMatches: number;
  playedMatches: number;
}

export interface TeamMatchRecord {
  year: WorldCupYear;
  matchId: string;
  date: string;
  time: string | null;
  round: string;
  opponent: string;
  home: boolean;
  homeScore: number | null;
  awayScore: number | null;
  htHomeScore: number | null;
  htAwayScore: number | null;
  etHomeScore: number | null;
  etAwayScore: number | null;
  homePenalties: number | null;
  awayPenalties: number | null;
  played: boolean;
}

export interface TeamAppearance {
  year: WorldCupYear;
  result: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  matches: TeamMatchRecord[];
}

export interface BestResultEdition {
  year: WorldCupYear;
  hosts: string;
}

export interface BestResultSummary {
  result: string;
  editions: BestResultEdition[];
}

export interface TeamHistorySummary {
  team: string;
  appearances: TeamAppearance[];
  totalMatches: number;
  totalWins: number;
  totalDraws: number;
  totalLosses: number;
  totalGF: number;
  totalGA: number;
}

export interface HeadToHeadMatch {
  year: WorldCupYear;
  matchId: string;
  date: string;
  round: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  htHomeScore: number | null;
  htAwayScore: number | null;
  etHomeScore: number | null;
  etAwayScore: number | null;
  homePenalties: number | null;
  awayPenalties: number | null;
  played: boolean;
}

export interface HeadToHeadSummary {
  team1: string;
  team2: string;
  team1Wins: number;
  team2Wins: number;
  draws: number;
  matches: HeadToHeadMatch[];
}

export interface StatsCache {
  generatedAt: string;
  editions: EditionSummary[];
  teams: Record<string, TeamHistorySummary>;
  teamList: string[];
}
