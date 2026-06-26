export type {
  ParsedGroupMatch,
  ParsedKnockoutMatch,
  ParsedMatch,
  KnockoutRoundKey,
  WorldCupData,
  GoalEvent,
} from "./openfootball/types";

export interface TeamStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  rank: number;
}

export interface ThirdPlaceStanding extends TeamStanding {
  group: string;
}

export type GroupTab = "all" | string;

export type TournamentTab = "all" | string;
