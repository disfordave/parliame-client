export interface User {
  githubId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  role: "admin" | "editor" | "viewer";
}

export interface Country {
  code: string;
  name: string;
  emoji?: string;
}

export interface Chamber {
  id: string;
  name: string;
  shortName?: string;
  totalSeats?: number;
}

export interface CountryParty {
  id: string;
  name: string;
  shortName: string;
  colour?: string;
}

export interface PollSummary {
  id: string;
  name: string;
  date: string;
}

export interface PollResultInput {
  partyId: string;
  seats: number;
}

export interface PollResult {
  seats: number;
  party: {
    name: string;
    shortName: string;
    colour?: string;
    position: number;
  };
}

export interface PollDetails {
  id: string;
  results: PollResult[];
}

export type LoadingKey = "countries" | "parties" | "chambers" | "polls";

export type LoadingState = Record<LoadingKey, boolean>;

export interface CreateCountryPayload {
  name: string;
  code: string;
  emoji?: string;
}

export interface CreatePartyPayload {
  name: string;
  shortName: string;
  colour: string;
  position: number;
  country: string;
}

export interface CreateChamberPayload {
  name: string;
  country: string;
  shortName?: string;
  totalSeats: number;
}

export interface CreatePollPayload {
  name: string;
  date: string;
  country: string;
  chamber: string;
  type: "election";
  results: PollResultInput[];
}
