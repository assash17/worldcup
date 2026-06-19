export interface OpenFootballGoal {
  name: string;
  minute: number | string;
  offset?: number;
  penalty?: boolean;
  owngoal?: boolean;
}

export interface OpenFootballScore {
  ft?: [number, number];
  ht?: [number, number];
  et?: [number, number];
  p?: [number, number];
}

export interface OpenFootballMatch {
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: OpenFootballScore;
  goals1?: OpenFootballGoal[];
  goals2?: OpenFootballGoal[];
  group?: string;
  ground?: string;
}

export interface OpenFootballWorldCup {
  name: string;
  matches: OpenFootballMatch[];
}

export interface GoalEvent {
  name: string;
  minute: string;
  penalty: boolean;
  owngoal: boolean;
}

export type MatchType = "group" | "knockout";

export type KnockoutRoundKey =
  | "round32"
  | "round16"
  | "quarter"
  | "semi"
  | "third"
  | "final"
  | "other";

export interface ParsedMatch {
  id: string;
  type: MatchType;
  group: string | null;
  round: string;
  roundKey: KnockoutRoundKey | null;
  matchday: number | null;
  date: string;
  time: string | null;
  ground: string | null;
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
  goalsHome: GoalEvent[];
  goalsAway: GoalEvent[];
  played: boolean;
  winner: string | null;
  order: number | null;
}

export type ParsedGroupMatch = ParsedMatch & { type: "group" };
export type ParsedKnockoutMatch = ParsedMatch & { type: "knockout" };

export interface WorldCupData {
  year: number;
  name: string;
  hosts: string;
  matches: ParsedMatch[];
  matchesById: Record<string, ParsedMatch>;
  groupMatches: ParsedGroupMatch[];
  knockoutMatches: ParsedKnockoutMatch[];
  groups: string[];
  knockoutRounds: { key: KnockoutRoundKey; label: string }[];
}
