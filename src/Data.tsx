import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useParties, useSelectedParties } from "./lib/zustandStore";

export const API_BASE = "https://api.parliame.com";

export interface User {
  githubId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  role: "admin" | "editor" | "viewer";
}

type Country = {
  code: string;
  name: string;
  emoji?: string;
};

type Chamber = {
  id: string;
  name: string;
  shortName?: string;
  totalSeats?: number;
};

type CountryParty = {
  id: string;
  name: string;
  shortName: string;
  colour?: string;
};

type PollSummary = {
  id: string;
  name: string;
  date: string;
};

type PollResultInput = {
  partyId: string;
  seats: number;
};

type PollResult = {
  seats: number;
  party: {
    name: string;
    shortName: string;
    colour?: string;
    position: number;
  };
};

type PollDetails = {
  id: string;
  results: PollResult[];
};

type LoadingKey = "countries" | "parties" | "chambers" | "polls";

type LoadingState = Record<LoadingKey, boolean>;

async function getUser() {
  try {
    return await fetchJson<User>("/auth/user");
  } catch {
    return null;
  }
}

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

const handleLogout = async () => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });
  window.location.href = "/data";
};

const inputClassNames =
  "me-2 my-1 rounded-md border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400";

const buttonClassNames =
  "rounded-full bg-violet-600 px-2 py-1 text-white dark:bg-violet-400";

const SectionCard = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 ${className ?? ""}`}
  >
    <h2 className="mb-2 text-xl font-bold">{title}</h2>
    {children}
  </div>
);

const UserInformationPanel = ({ user }: { user: User | null }) => {
  if (!user) {
    return (
      <div className="text-center">
        <a href={`${API_BASE}/auth/github`} className={buttonClassNames}>
          Login with GitHub
        </a>
      </div>
    );
  }

  const hasEditAccess = user.role === "admin" || user.role === "editor";

  return (
    <div className="text-center">
      {user.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt="User Avatar"
          className="mx-auto mb-2 size-20 rounded-full"
        />
      )}
      <h2 className="text-lg">
        Welcome, <span className="font-medium">{user.username}</span>
      </h2>
      {hasEditAccess ? (
        <p className="mb-2 text-sm font-semibold text-red-600 dark:text-red-400">
          Role: {user.role.toUpperCase()} (You have edit access)
        </p>
      ) : (
        <p className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
          Role: {user.role.toUpperCase()} (You have view-only access)
        </p>
      )}
      <button onClick={handleLogout} className={buttonClassNames}>
        Logout
      </button>
    </div>
  );
};

export default function Data() {
  const { parties, setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();

  const [user, setUser] = useState<User | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryParties, setCountryParties] = useState<CountryParty[]>([]);
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [selectedChamber, setSelectedChamber] = useState<Chamber | null>(null);
  const [polls, setPolls] = useState<PollSummary[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<PollSummary | null>(null);
  const [newPollResults, setNewPollResults] = useState<PollResultInput[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    countries: false,
    parties: false,
    chambers: false,
    polls: false,
  });

  const updateLoading = useCallback((key: LoadingKey, value: boolean) => {
    setLoading((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleApiError = useCallback((error: unknown, fallbackMessage: string) => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    setErrorMessage(message);
    console.error(error);
  }, []);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  useEffect(() => {
    let active = true;
    const loadCountries = async () => {
      setErrorMessage(null);
      updateLoading("countries", true);
      try {
        const data = await fetchJson<Country[]>("/countries");
        if (!active) return;
        setCountries(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load countries.");
        }
      } finally {
        if (active) {
          updateLoading("countries", false);
        }
      }
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, [handleApiError, updateLoading]);

  useEffect(() => {
    if (!selectedCountry) {
      setCountryParties([]);
      return;
    }

    let active = true;
    const loadParties = async () => {
      updateLoading("parties", true);
      try {
        const data = await fetchJson<CountryParty[]>(
          `/parties?country=${selectedCountry.code}`,
        );
        if (!active) return;
        setCountryParties(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load parties for this country.");
        }
      } finally {
        if (active) {
          updateLoading("parties", false);
        }
      }
    };

    loadParties();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedCountry, updateLoading]);

  useEffect(() => {
    if (!selectedCountry) {
      setChambers([]);
      return;
    }

    let active = true;
    const loadChambers = async () => {
      updateLoading("chambers", true);
      try {
        const data = await fetchJson<Chamber[]>(
          `/chambers?country=${selectedCountry.code}`,
        );
        if (!active) return;
        setChambers(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load chambers.");
        }
      } finally {
        if (active) {
          updateLoading("chambers", false);
        }
      }
    };

    loadChambers();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedCountry, updateLoading]);

  useEffect(() => {
    if (!selectedChamber) {
      setPolls([]);
      return;
    }

    let active = true;
    const loadPolls = async () => {
      updateLoading("polls", true);
      try {
        const data = await fetchJson<PollSummary[]>(
          `/polls?type=election&chamber=${selectedChamber.id}&electionOnly=true`,
        );
        if (!active) return;
        setPolls(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load polls.");
        }
      } finally {
        if (active) {
          updateLoading("polls", false);
        }
      }
    };

    loadPolls();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedChamber, updateLoading]);

  useEffect(() => {
    if (!selectedPoll) {
      setParties([]);
      setSelectedParties([]);
      return;
    }

    let active = true;
    const loadPollDetails = async () => {
      try {
        const data = await fetchJson<PollDetails>(`/polls/${selectedPoll.id}`);
        if (!active) return;
        const partyData = data.results.map((item) => ({
          name: item.party.name,
          shortName: item.party.shortName,
          seats: item.seats,
          colour: item.party.colour ?? "#999999",
          position: item.party.position,
          isIndependent: false,
        }));
        setParties(partyData);
        setSelectedParties(partyData);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load poll results.");
        }
      }
    };

    loadPollDetails();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedPoll, setParties, setSelectedParties]);

  const handleSelectCountry = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      setSelectedChamber(null);
      setSelectedPoll(null);
      setChambers([]);
      setPolls([]);
      setCountryParties([]);
      setNewPollResults([]);
      setParties([]);
      setSelectedParties([]);
    },
    [setParties, setSelectedParties],
  );

  const handleSelectChamber = useCallback(
    (chamber: Chamber) => {
      setSelectedChamber(chamber);
      setSelectedPoll(null);
      setPolls([]);
      setNewPollResults([]);
      setParties([]);
      setSelectedParties([]);
    },
    [setParties, setSelectedParties],
  );

  const handleSeatChange = useCallback((partyId: string, seats: number) => {
    setNewPollResults((prev) => {
      if (!Number.isFinite(seats) || seats < 0) {
        return prev.filter((item) => item.partyId !== partyId);
      }

      const exists = prev.some((item) => item.partyId === partyId);
      return exists
        ? prev.map((item) =>
            item.partyId === partyId ? { ...item, seats } : item,
          )
        : [...prev, { partyId, seats }];
    });
  }, []);

  const handleAddCountry = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload = {
        name: formData.get("name") as string,
        code: formData.get("code") as string,
        emoji: (formData.get("emoji") as string) || undefined,
      };

      try {
        setErrorMessage(null);
        const addedCountry = await fetchJson<Country>("/countries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setCountries((prev) => [...prev, addedCountry]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add country.");
      }
    },
    [handleApiError],
  );

  const handleAddParty = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedCountry) {
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);
      const colour = (formData.get("colour") as string) || "";

      if (colour && !colour.startsWith("#")) {
        alert("Colour must be a valid hex code starting with #");
        return;
      }

      const payload = {
        name: formData.get("name") as string,
        shortName: formData.get("shortName") as string,
        colour,
        position: Number(formData.get("position")),
        country: selectedCountry.code,
      };

      try {
        setErrorMessage(null);
        const addedParty = await fetchJson<CountryParty>("/parties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setCountryParties((prev) => [...prev, addedParty]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add party.");
      }
    },
    [handleApiError, selectedCountry],
  );

  const handleAddChamber = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedCountry) {
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload = {
        name: formData.get("name") as string,
        country: selectedCountry.code,
        shortName: (formData.get("shortName") as string) || undefined,
        totalSeats: Number(formData.get("totalSeats")),
      };

      try {
        setErrorMessage(null);
        const addedChamber = await fetchJson<Chamber>("/chambers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setChambers((prev) => [...prev, addedChamber]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add chamber.");
      }
    },
    [handleApiError, selectedCountry],
  );

  const handleAddPoll = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedCountry || !selectedChamber) {
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload = {
        name: formData.get("name") as string,
        date: formData.get("date") as string,
        country: selectedCountry.code,
        chamber: selectedChamber.id,
        type: "election",
        results: newPollResults,
      };

      try {
        setErrorMessage(null);
        const addedPoll = await fetchJson<PollSummary>("/polls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setPolls((prev) => [...prev, addedPoll]);
        setNewPollResults([]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add poll.");
      }
    },
    [handleApiError, newPollResults, selectedChamber, selectedCountry],
  );

  return (
    <div>
      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[14.5fr_5.5fr]">
        <div className="">
          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950">
              {errorMessage}
            </div>
          )}
          <div className="mb-4 block lg:hidden">
            <SectionCard title="User Information" className="mb-0">
              <UserInformationPanel user={user} />
            </SectionCard>
          </div>
          <div>
            <SectionCard title="Countries & Regions">
              {user && (
                <>
                  <h3 className="my-1 text-lg font-medium">Add new country</h3>
                  <form onSubmit={handleAddCountry}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Country name"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="code"
                      placeholder="Country code"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="emoji"
                      placeholder="Emoji"
                      className={inputClassNames}
                    />
                    <button type="submit" className={buttonClassNames}>
                      Add Country
                    </button>
                  </form>
                </>
              )}
              {loading.countries ? (
                <p className="px-2 py-1">Loading countries...</p>
              ) : countries.length > 0 ? (
                <>
                  <h3 className="my-1 text-lg font-medium">Select Country</h3>
                  <ul className="flex flex-wrap items-start gap-2">
                    {countries.map((country) => (
                      <li key={country.code}>
                        <button
                          onClick={() => handleSelectCountry(country)}
                          className={`${
                            selectedCountry?.code === country.code
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700"
                          } text-nowrap rounded-full px-4 py-2`}
                        >
                          {country.name} {country.emoji}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {user && selectedCountry && (
                    <>
                      <h3 className="my-1 text-lg font-medium">
                        Add Party for {selectedCountry.name}
                      </h3>
                      <form onSubmit={handleAddParty}>
                        <input
                          type="text"
                          name="name"
                          placeholder="Party name"
                          className={inputClassNames}
                          required
                        />
                        <input
                          type="text"
                          name="shortName"
                          placeholder="Short Name"
                          className={inputClassNames}
                          required
                        />
                        <input
                          type="text"
                          name="colour"
                          placeholder="Colour (hex code)"
                          className={inputClassNames}
                          required
                        />
                        <input
                          type="number"
                          min={-100}
                          max={100}
                          step={25}
                          name="position"
                          placeholder="Position (-100 to 100)"
                          className={inputClassNames}
                          required
                        />
                        <label className="mr-2">
                          <input type="checkbox" name="isIndependent" className="mr-1" />
                          Independent
                        </label>
                        <button type="submit" className={buttonClassNames}>
                          Add Party
                        </button>
                      </form>
                    </>
                  )}
                  {loading.parties ? (
                    <p className="px-2 py-1">Loading parties...</p>
                  ) : (
                    countryParties.length > 0 && (
                      <div>
                        <h3 className="my-1 text-lg font-medium">
                          Parties in {selectedCountry?.name}
                        </h3>
                        <ul className="flex flex-wrap items-center gap-2">
                          {countryParties.map((party) => (
                            <li
                              key={party.id}
                              className="flex items-center gap-1 text-nowrap rounded-full bg-gray-200 px-2 py-1 dark:bg-gray-700"
                            >
                              <span
                                className="size-3 flex-shrink-0 rounded-full"
                                style={{
                                  backgroundColor: party.colour || "#999999",
                                }}
                              ></span>
                              {party.shortName} ({party.id})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </>
              ) : (
                <p className="px-2 py-1">No countries available</p>
              )}
            </SectionCard>
            <SectionCard title="Chambers">
              {user && selectedCountry && (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Add Chamber for {selectedCountry.name}
                  </h3>
                  <form onSubmit={handleAddChamber}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Chamber name"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="shortName"
                      placeholder="Short Name"
                      className={inputClassNames}
                    />
                    <input
                      type="number"
                      name="totalSeats"
                      placeholder="Total Seats"
                      className={inputClassNames}
                      required
                    />
                    <button type="submit" className={buttonClassNames}>
                      Add Chamber
                    </button>
                  </form>
                </>
              )}
              {loading.chambers ? (
                <p className="px-2 py-1">Loading chambers...</p>
              ) : chambers.length > 0 ? (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Chambers in {selectedCountry?.name}
                  </h3>
                  <ul className="flex flex-wrap items-start gap-2">
                    {chambers.map((chamber) => (
                      <li key={chamber.id}>
                        <button
                          onClick={() => handleSelectChamber(chamber)}
                          className={`${
                            selectedChamber?.id === chamber.id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700"
                          } text-nowrap rounded-full px-4 py-2`}
                        >
                          {chamber.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="px-2 py-1">No chambers available</p>
              )}
            </SectionCard>
            <SectionCard title="Election & Polls">
              {user && selectedChamber && (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Add Poll for {selectedCountry?.name} - {selectedChamber.name}
                  </h3>
                  <form onSubmit={handleAddPoll}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Poll name"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="date"
                      placeholder="Poll date"
                      className={inputClassNames}
                      required
                    />
                    <div>
                      {countryParties.length > 0 ? (
                        countryParties.map((party) => (
                          <div key={party.id}>
                            <label className="me-2 flex flex-wrap items-center">
                              <p className="flex w-full items-center sm:w-auto">
                                <span
                                  className="mr-2 inline-block h-4 w-4 flex-shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: party.colour || "#999999",
                                  }}
                                ></span>
                                <span className="me-2 text-wrap">{party.name}</span>
                              </p>
                              <input
                                type="number"
                                min="0"
                                placeholder={`Seats (${party.shortName})`}
                                className={inputClassNames}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  const seats = value === "" ? NaN : Number(value);
                                  handleSeatChange(party.id, seats);
                                }}
                              />
                            </label>
                          </div>
                        ))
                      ) : (
                        <p>No parties available for this country.</p>
                      )}
                    </div>
                    <button type="submit" className={buttonClassNames}>
                      Add Poll
                    </button>
                  </form>
                </>
              )}
              {loading.polls ? (
                <p className="px-2 py-1">Loading polls...</p>
              ) : polls.length > 0 ? (
                <div>
                  <h3 className="my-1 text-lg font-medium">
                    Polls for {selectedCountry?.name} - {selectedChamber?.name}
                  </h3>
                  <ul className="flex flex-wrap items-start gap-2">
                    {polls.map((poll) => (
                      <li key={poll.id}>
                        <button
                          onClick={() => setSelectedPoll(poll)}
                          className={`${
                            selectedPoll?.id === poll.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700"
                          } text-nowrap rounded-full px-4 py-2`}
                        >
                          {poll.name} - {new Date(poll.date).toLocaleDateString()}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="px-2 py-1">No polls available</p>
              )}
            </SectionCard>
            {parties.length > 0 && (
              <SectionCard title="Selected Poll Result">
                <ul>
                  {parties.map((party, index) => (
                    <li key={index} className="mb-1 flex items-center">
                      <span
                        className="mr-2 inline-block h-4 w-4 flex-shrink-0 rounded-full"
                        style={{
                          backgroundColor: party.colour || "#999999",
                        }}
                      ></span>
                      {party.name} - Seats: {party.seats}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/"
                  className="mt-2 inline-block text-violet-600 hover:underline dark:text-violet-400"
                >
                  Go to Seat Simulator
                </Link>
              </SectionCard>
            )}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-4 h-[80vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <SectionCard title="User Information" className="mb-0 border-none p-0 shadow-none">
              <UserInformationPanel user={user} />
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
