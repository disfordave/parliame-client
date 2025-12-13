/*
    Parliament (parliament-seats) is a tool for visualizing and calculating
    the distribution of seats in a parliamentary system.

    Copyright (C) 2025 @disfordave

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
