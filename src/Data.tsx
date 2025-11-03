/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParties, useSelectedParties } from "./lib/zustandStore";
import { Link } from "react-router";

export const API_BASE = "https://api.parliame.com";

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
      const data = await fetch(API_BASE + "/countries");
      const json = await data.json();
      setCountriesState(json);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCountryPartyData = async () => {
      if (selectedCountryState) {
        const data = await fetch(
          API_BASE + "/parties?country=" + (selectedCountryState as any).code,
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
        API_BASE + "/chambers?country=" + (selectedCountryState as any).code,
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
        API_BASE +
          "/polls?type=election&chamber=" +
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
          API_BASE + "/polls/" + (selectedPoll as any).id,
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

  const inputClassNames =
    "me-2 my-1 rounded-md border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400";

  const buttonClassNames =
    "rounded-full bg-violet-600 px-2 py-1 text-white dark:bg-violet-400";
  return (
    <div>
      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[14.5fr_5.5fr]">
        <div className="">
          <div className="mb-4 block lg:hidden">
            <div className="overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-xl font-bold">User Information</h2>
              <div style={{ textAlign: "center" }}>
                {!user ? (
                  <a
                    href={`${API_BASE}/auth/github`}
                    className={buttonClassNames}
                  >
                    Login with GitHub
                  </a>
                ) : (
                  <div>
                    {user.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt="User Avatar"
                        className="mx-auto mb-2 size-20 rounded-full"
                      />
                    )}
                    <h2 className="text-lg">
                      Welcome,{" "}
                      <span className="font-medium">{user.username}</span>
                    </h2>
                    <button onClick={handleLogout} className={buttonClassNames}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-1 text-xl font-bold">Countries & Regions</h2>
              {user && (
                <>
                  <h3 className="my-1 text-lg font-medium">Add new country</h3>
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
                      const addCountry = await fetch(API_BASE + "/countries", {
                        credentials: "include",
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newCountry),
                      });

                      if (!addCountry.ok) {
                        alert(`Error adding country: ${addCountry.statusText}`);
                        return;
                      }
                      const addedCountry = await addCountry.json();

                      if (!addedCountry) return;
                      //@ts-expect-error ts-ignore
                      setCountriesState([
                        ...(countriesState as unknown as any[]),
                        addedCountry,
                      ]);
                      form.reset();
                    }}
                  >
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
              {countriesState && (countriesState as any[]).length > 0 && (
                <>
                  <h3 className="my-1 text-lg font-medium">Select Country</h3>
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
                  {user && selectedCountryState && (
                    <>
                      <h3 className="my-1 text-lg font-medium">
                        Add Party for {(selectedCountryState as any).name}
                      </h3>
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
                          const addParty = await fetch(API_BASE + "/parties", {
                            credentials: "include",
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(newParty),
                          });

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
                          <input
                            type="checkbox"
                            name="isIndependent"
                            className="mr-1"
                          />
                          Independent
                        </label>
                        <button type="submit" className={buttonClassNames}>
                          Add Party
                        </button>
                      </form>
                    </>
                  )}
                  {selectedCountryPartyData &&
                    selectedCountryPartyData.length > 0 && (
                      <div>
                        <h3 className="my-1 text-lg font-medium">
                          Parties in{" "}
                          {selectedCountryState &&
                            (selectedCountryState as any).name}
                        </h3>
                        <ul className="flex flex-wrap items-center gap-2">
                          {(selectedCountryPartyData as any[]).map(
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
                      </div>
                    )}
                </>
              )}
            </div>
            <div className="mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-xl font-bold">Chambers</h2>
              {user && selectedCountryState && (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Add Chamber for {(selectedCountryState as any).name}
                  </h3>
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
                      const addChamber = await fetch(API_BASE + "/chambers", {
                        credentials: "include",
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newCountry),
                      });
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
              {chambers && (chambers as any[]).length > 0 ? (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Chambers in {(selectedCountryState as any).name}
                  </h3>
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
                </>
              ) : (
                <p className="px-2 py-1">No chambers available</p>
              )}
            </div>
            <div className="mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-xl font-bold">Election & Polls</h2>

              {user && selectedChamber && (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Add Poll for {(selectedCountryState as any).name} -{" "}
                    {(selectedChamber as any).name}
                  </h3>
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
                      const addPoll = await fetch(API_BASE + "/polls", {
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
                      {selectedCountryPartyData &&
                      selectedCountryPartyData.length > 0 ? (
                        selectedCountryPartyData.map((party: any) => (
                          <div key={party.id} className="">
                            <label className="me-2 flex flex-wrap items-center">
                              <p className="flex w-full items-center sm:w-auto">
                                <span
                                  className="mr-2 inline-block h-4 w-4 flex-shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: party.colour || "#999999",
                                  }}
                                ></span>
                                <span className="me-2 text-wrap">
                                  {party.name}
                                </span>
                              </p>
                              <input
                                type="number"
                                min="0"
                                placeholder={"Seats" + ` (${party.shortName})`}
                                className={inputClassNames}
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
                    <button type="submit" className={buttonClassNames}>
                      Add Poll
                    </button>
                  </form>
                </>
              )}
              {polls && (polls as any[]).length > 0 ? (
                <div>
                  <h3 className="my-1 text-lg font-medium">
                    Polls for {(selectedCountryState as any).name} -{" "}
                    {(selectedChamber as any).name}
                  </h3>
                  <ul className="flex flex-wrap items-start gap-2">
                    {(polls as any[]).map((poll: any) => (
                      <li key={poll.id}>
                        <button
                          onClick={() => setSelectedPoll(poll)}
                          className={`${selectedPoll === poll ? "bg-green-500 text-white" : "bg-gray-200 p-4 dark:bg-gray-700"} text-nowrap rounded-full px-2 py-1`}
                        >
                          {poll.name} -{" "}
                          {new Date(poll.date).toLocaleDateString()}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="px-2 py-1">No polls available</p>
              )}
            </div>
            {parties && parties.length > 0 && (
              <div className="overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-2 text-xl font-bold">Selected Poll Result</h2>
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
                <Link
                  to="/"
                  className="mt-2 inline-block text-violet-600 hover:underline dark:text-violet-400"
                >
                  Go to Seat Simulator
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-4 h-[80vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <div className="">
              <h2 className="mb-2 text-xl font-bold">User Information</h2>
              <div style={{ textAlign: "center" }}>
                {!user ? (
                  <a
                    href={`${API_BASE}/auth/github`}
                    className={buttonClassNames}
                  >
                    Login with GitHub
                  </a>
                ) : (
                  <div>
                    {user.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt="User Avatar"
                        className="mx-auto mb-2 size-20 rounded-full"
                      />
                    )}
                    <h2 className="text-lg">
                      Welcome,{" "}
                      <span className="font-medium">{user.username}</span>
                    </h2>
                    <button onClick={handleLogout} className={buttonClassNames}>
                      Logout
                    </button>
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
