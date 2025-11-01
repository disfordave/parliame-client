/*
    Parliament (parliament-seats) is a tool for visualizing and calculating
    the distribution of seats in a parliamentary system.

    Copyright (C) 2025 @disfordave

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { countries } from "@/data/countries";
import { sort } from "@/utils/sort";
import {
  useSelectedParties,
  useIsEditMode,
  useParties,
  useSortBy,
  useI18n,
  useSelectedCountry,
} from "@/lib/zustandStore";
import {
  PartyButton,
  AllowTieBreakerButton,
  SwitchViewModeButton,
  SortButton,
  CoalitionBySpectrumButtons,
  AddNewPartyButton,
  SeatsGraph,
  CountryListDropdown,
  JsonShareButton,
  PieChart,
} from "@/components/ui/app";

const Seats = () => {
  const { parties, setParties } = useParties();
  const { selectedParties, setSelectedParties } = useSelectedParties();
  const { isEditMode } = useIsEditMode();
  const { sortBy } = useSortBy();
  const { i, setLocale } = useI18n();
  const { setSelectedCountry } = useSelectedCountry();

  const [countriesState, setCountriesState] = useState(null);
  const [selectedCountryState, setSelectedCountryState] = useState<any>(null);
  const [chambers, setChambers] = useState(null);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [polls, setPolls] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [partyData, setPartyData] = useState<any[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(document.location.search);
    const countryName = queryParams.get("country");
    const lang = queryParams.get("lang");
    const country = countries.find((country) => country.name === countryName);
    if (country) {
      setSelectedCountry(country);
      setParties(country.parties);
      setSelectedParties(country.parties);
    } else {
      const country = countries.find(
        (country) => country.name === "European Union",
      );
      if (country) {
        setSelectedCountry(country);
        setParties(country.parties);
        setSelectedParties(country.parties);
      }
    }

    if (lang && ["en", "fr", "de", "nl"].includes(lang)) {
      setLocale(lang);
    }
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await fetch("http://localhost:3000/countries");
      const json = await data.json();
      setCountriesState(json);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        "http://localhost:3000/chambers/" + selectedCountryState?.code,
      );
      const json = await data.json();
      setChambers(json);
    };
    fetchData();
  }, [selectedCountryState, countriesState]);

  useEffect(() => {
    const fetchPolls = async () => {
      const data = await fetch(
        "http://localhost:3000/polls/" + selectedChamber + "?electionOnly=true",
      );
      const json = await data.json();
      setPolls(json);
    };
    fetchPolls();
  }, [countriesState, selectedCountryState, chambers, selectedChamber]);

  useEffect(() => {
    const fetchPartyData = async () => {
      if (selectedPoll) {
        const promises = (selectedPoll as any).results.map(
          async (party: any) => {
            const data = await fetch(
              `http://localhost:3000/parties/${selectedCountryState.code}/${party.partyId}`,
            );
            const partyDetails = await data.json();
            return {
              ...partyDetails,
              seats: party.seats, // Use seats from poll results, not party details
            };
          },
        );
        const fetchedParties = await Promise.all(promises);

        const mappedParties = fetchedParties.map((p) => ({
          name: p.name,
          shortName: p.shortName,
          seats: p.seats,
          colour: p.colour,
          position: p.position,
          isIndependent: false,
        }));

        setPartyData(fetchedParties);
        setParties(mappedParties);
        setSelectedParties(mappedParties);
      }
    };
    fetchPartyData();
  }, [selectedPoll]);

  return (
    <div>
      <div>
        {countriesState && (countriesState as any[]).length > 0 && (
          <div className="mb-4 flex flex-col items-start">
            {(countriesState as any[]).map((country: any) => (
              <button
                onClick={() => {
                  setSelectedCountryState(country);
                }}
                className={
                  selectedCountryState === country
                    ? "bg-red-500 text-white"
                    : ""
                }
                key={country.code}
              >
                {country.name} {country.emoji}
              </button>
            ))}
          </div>
        )}
        <div className="mb-4 flex flex-col items-start">
          {chambers &&
            (chambers as any[]).map((item: any) => (
              <button
                onClick={() => setSelectedChamber(item.id)}
                className={
                  selectedChamber === item.id ? "bg-blue-500 text-white" : ""
                }
                key={item.id}
              >
                {item.name} ({item.countryCode})
              </button>
            ))}
        </div>
        {polls && (polls as any[]).length > 0 ? (
          <div className="mb-4 flex flex-col items-start">
            {(polls as any[]).map((poll: any) => (
              <button
                onClick={() => setSelectedPoll(poll)}
                className={
                  selectedPoll === poll ? "bg-green-500 text-white" : ""
                }
                key={poll.id}
              >
                {poll.name} - {new Date(poll.date).toLocaleDateString()}
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-4">No polls available</p>
        )}
      </div>
      <div className="mt-4 block lg:hidden">
        <CountryListDropdown />
      </div>
      <div className="-mb-4 aspect-video h-full w-full md:-mb-8">
        <PieChart
          parties={parties}
          selectedParties={selectedParties}
          isEditMode={isEditMode}
          sortBy={sortBy}
        />
      </div>
      <div className="sticky top-0 z-10 mx-auto w-[calc(100%-2rem)] pb-2 pt-4 sx:w-3/4">
        <SeatsGraph />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <AllowTieBreakerButton />
        <SortButton />
        <SwitchViewModeButton />
      </div>
      <>
        <ul
          className={`grid grid-cols-1 gap-4 transition-all xs:grid-cols-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4`}
        >
          {parties
            .sort((a, b) => sort(a, b, isEditMode, sortBy))
            .map((party, index) => (
              <li key={index}>
                <PartyButton party={party} />
              </li>
            ))}
          {isEditMode && (
            <li className="flex h-full w-full items-center justify-center">
              <AddNewPartyButton />
            </li>
          )}
        </ul>
      </>
      {parties.length <= 0 && !isEditMode && (
        <p className="text-center">{i("body.noParties")}</p>
      )}
      <CoalitionBySpectrumButtons />
      <button
        onClick={() => {
          setParties([]);
          setSelectedParties([]);
          setSelectedCountry(null);
        }}
        className="mt-4 w-full rounded-lg border-2 border-gray-200 p-2 dark:border-gray-700"
      >
        {i("buttons.clear")}
      </button>
      <JsonShareButton />
    </div>
  );
};

export default Seats;
