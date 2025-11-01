/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useParties, useSelectedParties } from "./lib/zustandStore";

export default function Data() {
  const { parties, setParties } = useParties();
  const { selectedParties, setSelectedParties } = useSelectedParties();

  const [countriesState, setCountriesState] = useState(null);
  const [selectedCountryState, setSelectedCountryState] = useState(null);
  const [chambers, setChambers] = useState(null);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [polls, setPolls] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await fetch("http://localhost:3000/api/countries");
      const json = await data.json();
      setCountriesState(json);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        "http://localhost:3000/api/chambers/" +
          (selectedCountryState as any).code,
      );
      const json = await data.json();
      setChambers(json);
    };
    fetchData();
  }, [selectedCountryState, countriesState]);

  useEffect(() => {
    const fetchPolls = async () => {
      const data = await fetch(
        "http://localhost:3000/api/polls/filter?chamber=" +
          (selectedChamber as any).id +
          "&electionOnly=true",
      );
      const json = await data.json();
      setPolls(json);
    };
    fetchPolls();
  }, [countriesState, selectedCountryState, chambers, selectedChamber]);

  useEffect(() => {
    const fetchPartyData = async () => {
      if (selectedPoll) {
        const data = await fetch(
          "http://localhost:3000/api/polls/" + (selectedPoll as any).id,
        );
        const json = await data.json();
        setParties(json.results);
        setSelectedParties(json.results);
        console.log("Parties set:", json.results);
      }
    };
    fetchPartyData();
  }, [selectedPoll]);

  return (
    <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-4">
        <Header />
        <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[14.5fr_5.5fr]">
          <div className="">
            <div className="mb-4 block lg:hidden">
              <div className="rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-2 text-xl font-bold">User Information</h2>
                <p>
                  Select a country, chamber, and election/poll to view party
                  data.
                </p>
              </div>
            </div>
            <div>
              {countriesState && (countriesState as any[]).length > 0 && (
                <div className="mb-4 rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                  <h2 className="mb-2 text-xl font-bold">
                    Countries & Regions
                  </h2>
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
                          } rounded-full px-2 py-1 text-nowrap`}
                        >
                          {country.name} {country.emoji}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mb-4 rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-2 text-xl font-bold">Chambers</h2>
                {chambers && (chambers as any[]).length > 0 ? (
                  <ul className="flex flex-wrap items-start gap-2">
                    {(chambers as any[]).map((item: any) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setSelectedChamber(item)}
                          className={`${selectedChamber === item ? "bg-blue-500 text-white" : "bg-gray-200 p-4 dark:bg-gray-700"} rounded-full px-2 py-1 text-nowrap`}
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-2 py-1">No chambers available</p>
                )}
              </div>
              <div className="mb-4 rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-2 text-xl font-bold">Election & Polls</h2>
                {polls && (polls as any[]).length > 0 ? (
                  <ul className="flex flex-wrap items-start gap-2">
                    {(polls as any[]).map((poll: any) => (
                      <li key={poll.id}>
                        <button
                          onClick={() => setSelectedPoll(poll)}
                          className={`${selectedPoll === poll ? "bg-green-500 text-white" : "bg-gray-200 p-4 dark:bg-gray-700"} rounded-full px-2 py-1 text-nowrap`}
                        >
                          {poll.name} -{" "}
                          {new Date(poll.date).toLocaleDateString()}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-2 py-1">No polls available</p>
                )}
              </div>
              {parties && parties.length > 0 && (
                <div className="rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 ">
                  <h2 className="mb-2 text-xl font-bold">Parties</h2>
                  <ul>
                    {parties.map((p, index) => (
                      <li key={p.partyId} className="mb-1 flex items-center">
                        <span
                          className="mr-2 inline-block h-4 w-4 rounded-full"
                          style={{ backgroundColor: p.party.colour }}
                        ></span>
                        {p.party.name} - Seats: {p.seats}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-4 h-[80vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <div className="">
                <h2 className="mb-2 text-xl font-bold">User Information</h2>
                <p>
                  Select a country, chamber, and election/poll to view party
                  data.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
