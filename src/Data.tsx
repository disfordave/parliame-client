/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParties, useSelectedParties } from "./lib/zustandStore";

export const API_BASE = "http://localhost:3000";

export interface User {
  githubId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export async function getUser() {
  const res = await fetch(`${API_BASE}/auth/user`, { credentials: "include" });
  return res.ok ? res.json() : null;
}

const handleLogout = async () => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "GET",
    credentials: "include", // include cookies
  });
  window.location.href = "/data"; // or use navigate("/")
};

export default function Data() {
  const { parties, setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const [countriesState, setCountriesState] = useState(null);
  const [selectedCountryState, setSelectedCountryState] = useState(null);
  const [chambers, setChambers] = useState(null);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [polls, setPolls] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedCountryPartyData, setSelectedCountryPartyData] = useState<
    any[]
  >([]);
  const [newPollDataResult, setNewPollDataResult] = useState<
    {
      partyId: string;
      seats: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await fetch("http://localhost:3000/countries");
      const json = await data.json();
      setCountriesState(json);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCountryPartyData = async () => {
      if (selectedCountryState) {
        const data = await fetch(
          "http://localhost:3000/parties?country=" +
            (selectedCountryState as any).code,
        );
        const json = await data.json();
        setSelectedCountryPartyData(json as any[]);
      }
    };
    fetchCountryPartyData();
  }, [selectedCountryState]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        "http://localhost:3000/chambers?country=" +
          (selectedCountryState as any).code,
      );
      const json = await data.json();
      setChambers(json);
    };
    if (selectedCountryState) {
      fetchData();
    }
  }, [selectedCountryState, countriesState]);

  useEffect(() => {
    const fetchPolls = async () => {
      const data = await fetch(
        "http://localhost:3000/polls?type=election&chamber=" +
          (selectedChamber as any).id +
          "&electionOnly=true",
      );
      const json = await data.json();
      setPolls(json);
    };
    if (selectedChamber) {
      fetchPolls();
    }
  }, [countriesState, selectedCountryState, chambers, selectedChamber]);

  useEffect(() => {
    const fetchPartyData = async () => {
      if (selectedPoll) {
        const data = await fetch(
          "http://localhost:3000/polls/" + (selectedPoll as any).id,
        );
        const json = await data.json();
        const partyData = json.results.map((item: any) => ({
          name: item.party.name,
          shortName: item.party.shortName,
          seats: item.seats,
          colour: item.party.colour,
          position: item.party.position,
          isIndependent: false,
        }));
        setParties(partyData);
        setSelectedParties(partyData);
      }
    };
    if (selectedPoll) {
      fetchPartyData();
    }
  }, [selectedPoll]);

  return (
    <div>
      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[14.5fr_5.5fr]">
        <div className="">
          <div className="mb-4 block lg:hidden">
            <div className="overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-xl font-bold">User Information</h2>
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                {!user ? (
                  <a href={`${API_BASE}/auth/github`}>
                    <button>Login with GitHub</button>
                  </a>
                ) : (
                  <div>
                    {user.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt="User Avatar"
                        className="mx-auto mb-4 h-16 w-16 rounded-full"
                      />
                    )}
                    <h2>Welcome, {user.username}</h2>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            {countriesState && (countriesState as any[]).length > 0 && (
              <div className="mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-2 text-xl font-bold">Countries & Regions</h2>
                <ul className="flex flex-wrap items-start gap-2">
                  {(countriesState as any[]).map((country: any) => (
                    <li key={country.code}>
                      <button
                        onClick={() => {
                          setSelectedCountryState(country);
                        }}
                        className={`${
                          selectedCountryState === country
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 p-4 dark:bg-gray-700"
                        } text-nowrap rounded-full px-2 py-1`}
                      >
                        {country.name} {country.emoji}
                      </button>
                    </li>
                  ))}
                </ul>
                <h3>Add new country</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const name = formData.get("name") as string;
                    const code = formData.get("code") as string;
                    const emoji = formData.get("emoji") as string;
                    const newCountry = {
                      name,
                      code,
                      emoji,
                    };
                    const addCountry = await fetch(
                      "http://localhost:3000/countries",
                      {
                        credentials: "include",
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newCountry),
                      },
                    );

                    if (!addCountry.ok) {
                      alert(`Error adding country: ${addCountry.statusText}`);
                      return;
                    }
                    const addedCountry = await addCountry.json();

                    if (!addedCountry) return;
                    //@ts-expect-error ts-ignore
                    setCountriesState([
                      ...(countriesState as any[]),
                      addedCountry,
                    ]);
                    form.reset();
                  }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Country name"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                    required
                  />
                  <input
                    type="text"
                    name="code"
                    placeholder="Country code"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                    required
                  />
                  <input
                    type="text"
                    name="emoji"
                    placeholder="Emoji"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-2 py-1 text-white"
                  >
                    Add Country
                  </button>
                </form>
                <ul className="flex flex-wrap items-center gap-2">
                  {selectedCountryPartyData &&
                    (selectedCountryPartyData as any[]).map(
                      (p: any, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-1 text-nowrap rounded-full bg-gray-200 px-2 py-1 dark:bg-gray-700"
                        >
                          <span
                            className="size-3 flex-shrink-0 rounded-full"
                            style={{
                              backgroundColor: p.colour || "#999999",
                            }}
                          ></span>
                          {p.shortName} ({p.id})
                        </li>
                      ),
                    )}
                </ul>
                {selectedCountryState && (
                  <>
                    <h3>Add Party for {(selectedCountryState as any).name}</h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const formData = new FormData(form);
                        const name = formData.get("name") as string;
                        const shortName = formData.get("shortName") as string;
                        const colour = formData.get("colour") as string;
                        const position = formData.get("position") as string;
                        // const isIndependent = formData.get(
                        //   "isIndependent",
                        // ) === "on";
                        const country = selectedCountryState
                          ? (selectedCountryState as any).code
                          : "";

                        if (colour && !colour.startsWith("#")) {
                          alert(
                            "Colour must be a valid hex code starting with #",
                          );
                          return;
                        }
                        const newParty = {
                          name,
                          shortName,
                          colour,
                          position,
                          country,
                        };
                        const addParty = await fetch(
                          "http://localhost:3000/parties",
                          {
                            credentials: "include",
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(newParty),
                          },
                        );

                        if (!addParty.ok) {
                          alert(`Error adding party: ${addParty.statusText}`);
                          return;
                        }
                        const addedParty = await addParty.json();
                        setSelectedCountryPartyData([
                          ...(selectedCountryPartyData as any[]),
                          addedParty,
                        ]);

                        form.reset();
                      }}
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Party name"
                        className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                        required
                      />
                      <input
                        type="text"
                        name="shortName"
                        placeholder="Short Name"
                        className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <input
                        type="text"
                        name="colour"
                        placeholder="Colour (hex code)"
                        className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <input
                        type="text"
                        name="position"
                        placeholder="Position (e.g., left, center, right)"
                        className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <label className="mr-2">
                        <input
                          type="checkbox"
                          name="isIndependent"
                          className="mr-1"
                        />
                        Independent
                      </label>
                      <button
                        type="submit"
                        className="rounded bg-blue-500 px-2 py-1 text-white"
                      >
                        Add Party
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
            <div className="mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-xl font-bold">Chambers</h2>
              {chambers && (chambers as any[]).length > 0 ? (
                <ul className="flex flex-wrap items-start gap-2">
                  {(chambers as any[]).map((item: any) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setSelectedChamber(item)}
                        className={`${selectedChamber === item ? "bg-blue-500 text-white" : "bg-gray-200 p-4 dark:bg-gray-700"} text-nowrap rounded-full px-2 py-1`}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2 py-1">No chambers available</p>
              )}
              {selectedCountryState && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const name = formData.get("name") as string;
                    const country = selectedCountryState
                      ? (selectedCountryState as any).code
                      : "";
                    const shortName = formData.get("shortName") as string;
                    const totalSeats = formData.get("totalSeats") as string;
                    const newCountry = {
                      name,
                      country,
                      shortName,
                      totalSeats: parseInt(totalSeats, 10),
                    };
                    const addChamber = await fetch(
                      "http://localhost:3000/chambers",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newCountry),
                      },
                    );
                    if (!addChamber.ok) {
                      alert(`Error adding chamber: ${addChamber.statusText}`);
                      return;
                    }
                    const addedChamber = await addChamber.json();
                    //@ts-expect-error ts-ignore
                    setChambers([...(chambers as any[]), addedChamber]);

                    form.reset();
                  }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Chamber name"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                    required
                  />
                  <input
                    type="text"
                    name="shortName"
                    placeholder="Short Name"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <input
                    type="number"
                    name="totalSeats"
                    placeholder="Total Seats"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                    required
                  />
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-2 py-1 text-white"
                  >
                    Add Chamber
                  </button>
                </form>
              )}
            </div>
            <div className="mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-xl font-bold">Election & Polls</h2>
              {polls && (polls as any[]).length > 0 ? (
                <ul className="flex flex-wrap items-start gap-2">
                  {(polls as any[]).map((poll: any) => (
                    <li key={poll.id}>
                      <button
                        onClick={() => setSelectedPoll(poll)}
                        className={`${selectedPoll === poll ? "bg-green-500 text-white" : "bg-gray-200 p-4 dark:bg-gray-700"} text-nowrap rounded-full px-2 py-1`}
                      >
                        {poll.name} - {new Date(poll.date).toLocaleDateString()}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2 py-1">No polls available</p>
              )}
              {user && selectedChamber && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const name = formData.get("name") as string;
                    const date = formData.get("date") as string;
                    const newPoll = {
                      name,
                      date,
                      country: (selectedCountryState as any).code,
                      chamber: (selectedChamber as any).id,
                      type: "election",
                      results: newPollDataResult,
                    };
                    const addPoll = await fetch("http://localhost:3000/polls", {
                      credentials: "include",
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(newPoll),
                    });
                    if (!addPoll.ok) {
                      alert(`Error adding poll: ${addPoll.statusText}`);
                      return;
                    }
                    const addedPoll = await addPoll.json();
                    //@ts-expect-error ts-ignore
                    setPolls([...(polls as any[]), addedPoll]);

                    form.reset();
                  }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Poll name"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                    required
                  />
                  <input
                    type="text"
                    name="date"
                    placeholder="Poll date"
                    className="mr-2 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                    required
                  />
                  <div>
                    {selectedCountryPartyData &&
                    selectedCountryPartyData.length > 0 ? (
                      selectedCountryPartyData.map((party: any) => (
                        <div key={party.id} className="mb-2">
                          <label className="mr-2">
                            {party.name} Seats:
                            <input
                              type="number"
                              min="0"
                              className="ml-2 w-20 rounded border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800"
                              onChange={(e) => {
                                const seats = parseInt(e.target.value, 10);
                                setNewPollDataResult((prev) => {
                                  const existingIndex = prev.findIndex(
                                    (item) => item.partyId === party.id,
                                  );
                                  if (isNaN(seats) || seats < 0) {
                                    // Remove entry if seats is invalid
                                    if (existingIndex !== -1) {
                                      const updated = [...prev];
                                      updated.splice(existingIndex, 1);
                                      return updated;
                                    }
                                    return prev;
                                  }
                                  if (existingIndex !== -1) {
                                    const updated = [...prev];
                                    updated[existingIndex].seats = seats;
                                    return updated;
                                  } else {
                                    return [
                                      ...prev,
                                      { partyId: party.id, seats },
                                    ];
                                  }
                                });
                              }}
                            />
                          </label>
                        </div>
                      ))
                    ) : (
                      <p>No parties available for this country.</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-2 py-1 text-white"
                  >
                    Add Poll
                  </button>
                </form>
              )}
            </div>
            {parties && parties.length > 0 && (
              <div className="overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-2 text-xl font-bold">Parties</h2>
                <ul>
                  {parties.map((p, index) => {
                    return (
                      <li key={index} className="mb-1 flex items-center">
                        <span
                          className="mr-2 inline-block h-4 w-4 flex-shrink-0 rounded-full"
                          style={{
                            backgroundColor: p.colour || "#999999",
                          }}
                        ></span>
                        {p.name} - Seats: {p.seats}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-4 h-[80vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <div className="">
              <h2 className="mb-2 text-xl font-bold">User Information</h2>
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                {!user ? (
                  <a href={`${API_BASE}/auth/github`}>
                    <button>Login with GitHub</button>
                  </a>
                ) : (
                  <div>
                    {user.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt="User Avatar"
                        className="mx-auto mb-4 h-16 w-16 rounded-full"
                      />
                    )}
                    <h2>Welcome, {user.username}</h2>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
