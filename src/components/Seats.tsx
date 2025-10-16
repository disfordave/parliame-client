import { useEffect, useState } from "react";

import { Country, Party } from "@/types";
import { countries } from "@/data/countries";
import {
  useSelectedParties,
  useIsEditMode,
  useParties,
  useSortBy,
  useI18n,
} from "@/lib/zustandStore";
import { PartyButton } from "@/components/PartyButton";
import { sort } from "@/utils/sort";
import AllowTieBreakerButton from "./ui/AllowTieBreakerButton";
import SwitchViewModeButton from "./ui/SwitchViewModeButton";
import SortButton from "./ui/SortButton";
import CoalitionBySpectrumButtons from "./ui/CoalitionBySpectrumButtons";
import AddNewPartyButton from "./ui/AddNewPartyButton";
import SeatsGraph from "./ui/SeatsGraph";

const Seats = () => {
  const { parties, setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { isEditMode } = useIsEditMode();
  const { sortBy } = useSortBy();
  const { i, setLocale } = useI18n();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries.find((c) => c.name === "European Union") ?? null,
  );
  const [openCountryList, setOpenCountryList] = useState<boolean>(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(document.location.search);
    const countryName = queryParams.get("country");
    const lang = queryParams.get("lang");
    console.log("Country from URL:", countryName);
    // setDefaultCountryValue(countryName ?? "European Union");
    const country = countries.find((country) => country.name === countryName);
    if (country) {
      setSelectedCountry(country);
      setParties(country.parties);
      setSelectedParties(country.parties);
      // setDefaultCountryValue(country.name);
    } else {
      const country = countries.find(
        (country) => country.name === "European Union",
      );
      if (country) {
        setSelectedCountry(country);
        setParties(country.parties);
        setSelectedParties(country.parties);
        // setDefaultCountryValue(country.name);
      }
    }

    if (lang && ["en", "fr", "de", "nl"].includes(lang)) {
      setLocale(lang);
    }
  }, []);

  return (
    <div>
      <button
        onClick={() => setOpenCountryList(!openCountryList)}
        className="w-full rounded-lg border-2 border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="flex gap-1">
          {selectedCountry ? (
            <>
              <span>{selectedCountry.name}</span>
              <span>{selectedCountry.emoji}</span>
            </>
          ) : (
            <>
              <span>Custom</span>
            </>
          )}
        </div>
      </button>
      <div className="relative">
        {openCountryList && (
          <>
            <div className="absolute top-0 z-[100] max-h-[50vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              <ul>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCountry(null);
                      setParties([]);
                      setSelectedParties([]);
                      return;
                    }}
                    className={`w-full p-2 transition-colors duration-300 ${
                      !selectedCountry
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex gap-1">
                      <span>Custom</span>
                    </div>
                  </button>
                </li>
                {countries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((country) => (
                    <li key={country.name} value={country.name}>
                      <button
                        onClick={() => {
                          setSelectedCountry(country);
                          const findCountry = countries.find(
                            (c) => c.name === country.name,
                          );
                          if (findCountry) {
                            setParties(findCountry.parties);
                            setSelectedParties(findCountry.parties);
                          } else {
                            setSelectedCountry(null);
                            setParties([]);
                            setSelectedParties([]);
                            return;
                          }
                        }}
                        className={`w-full p-2 transition-colors duration-300 ${
                          selectedCountry === country
                            ? "bg-gray-200 dark:bg-gray-700"
                            : "bg-white dark:bg-gray-900"
                        }`}
                      >
                        <div className="flex gap-1">
                          <span>{country.name}</span>
                          <span>{country.emoji}</span>
                        </div>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>
      <SeatsGraph />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <AllowTieBreakerButton />
        <SortButton />
        <SwitchViewModeButton />
      </div>
      {parties.length > 0 ? (
        <>
          <ul
            className={`grid grid-cols-1 gap-4 transition-all xs:grid-cols-2 sm:grid-cols-3 sm:gap-4`}
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
      ) : (
        <>
          <p className="text-center">{i("body.noParties")}</p>
        </>
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
      <button
        onClick={() => {
          const data = JSON.stringify(parties);
          const blob = new Blob([data], { type: "text/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "parties.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="mt-4 w-full rounded-lg border-2 border-gray-200 p-2 dark:border-gray-700"
        type="button"
        title="Export Parties"
        aria-label="Export Parties"
        aria-describedby="Export Parties"
        aria-disabled={false}
      >
        {i("buttons.exportParties")}
      </button>
      <input
        type="file"
        accept=".json"
        className="mt-4 max-w-full"
        title="Import Parties"
        aria-label="Import Parties"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target?.result;
            if (!data) return;

            try {
              const parsedData = JSON.parse(data as string);

              // Check if parsedData is an array and conforms to Party structure
              if (
                Array.isArray(parsedData) &&
                parsedData.every(
                  (item) =>
                    typeof item.name === "string" &&
                    typeof item.shortName === "string" &&
                    typeof item.seats === "number" &&
                    typeof item.colour === "string" &&
                    typeof item.position === "number" &&
                    (typeof item.isIndependent === "boolean" ||
                      item.isIndependent === undefined),
                )
              ) {
                setParties(parsedData as Party[]);
                setSelectedParties(parsedData as Party[]);
                setSelectedCountry(null);
              } else {
                console.error("Uploaded JSON file has an incorrect format");
                alert(
                  "The uploaded file has an incorrect format. Please upload a valid JSON file.",
                );
              }
            } catch (error) {
              console.error("Error parsing JSON file:", error);
              alert(
                "Failed to parse the JSON file. Please ensure it's in the correct format.",
              );
            }
          };
          reader.readAsText(file);
        }}
      />
    </div>
  );
};

export default Seats;
