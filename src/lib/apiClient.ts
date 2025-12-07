import type {
  Chamber,
  Country,
  CountryParty,
  CreateChamberPayload,
  CreateCountryPayload,
  CreatePartyPayload,
  CreatePollPayload,
  PollDetails,
  PollSummary,
  User,
} from "../types/dataAdmin";

export const API_BASE = "https://api.parliame.com";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const response = await fetch(url, {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }

  return (await response.json()) as T;
}

export async function getUser(): Promise<User | null> {
  try {
    return await fetchJson<User>("/auth/user");
  } catch {
    return null;
  }
}

export async function logoutUser() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });
}

export const getCountries = () => fetchJson<Country[]>("/countries");

export const createCountry = (payload: CreateCountryPayload) =>
  fetchJson<Country>("/countries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const getCountryParties = (countryCode: string) =>
  fetchJson<CountryParty[]>(`/parties?country=${countryCode}`);

export const createParty = (payload: CreatePartyPayload) =>
  fetchJson<CountryParty>("/parties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const getChambers = (countryCode: string) =>
  fetchJson<Chamber[]>(`/chambers?country=${countryCode}`);

export const createChamber = (payload: CreateChamberPayload) =>
  fetchJson<Chamber>("/chambers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const getPolls = (chamberId: string) =>
  fetchJson<PollSummary[]>(
    `/polls?type=election&chamber=${chamberId}&electionOnly=true`,
  );

export const createPoll = (payload: CreatePollPayload) =>
  fetchJson<PollSummary>("/polls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const getPollDetails = (pollId: string) =>
  fetchJson<PollDetails>(`/polls/${pollId}`);

export { fetchJson };
