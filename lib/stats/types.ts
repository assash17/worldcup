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
  round: string;
  opponent: string;
  home: boolean;
  homeScore: number | null;
  awayScore: number | null;
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
