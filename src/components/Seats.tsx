import { useRef, useEffect } from "react";

import { Party } from "@/types";
import { CaretDownIcon } from "@/components/icons/Icons";
import { countries } from "@/data/countries";
import {
  useAllowTieBreaker,
  useDefaultCountryValue,
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

const Seats = () => {
  const { parties, setParties } = useParties();
  const { selectedParties, setSelectedParties } = useSelectedParties();
  const { isEditMode } = useIsEditMode();
  const { sortBy } = useSortBy();
  const { allowTieBreaker } = useAllowTieBreaker();
  const { defaultCountryValue, setDefaultCountryValue } =
    useDefaultCountryValue();
  const { i, setLocale } = useI18n();
  const total = parties.reduce((acc, party) => acc + party.seats, 0);

  const selectedTotal = selectedParties.reduce(
    (acc, party) => acc + party.seats,
    0,
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(document.location.search);
    const countryName = queryParams.get("country");
    const lang = queryParams.get("lang");
    console.log("Country from URL:", countryName);
    setDefaultCountryValue(countryName ?? "European Union");
    const country = countries.find((country) => country.name === countryName);
    if (country) {
      setParties(country.parties);
      setSelectedParties(country.parties);
      setDefaultCountryValue(country.name);
    } else {
      const country = countries.find(
        (country) => country.name === "European Union",
      );
      if (country) {
        setParties(country.parties);
        setSelectedParties(country.parties);
        setDefaultCountryValue(country.name);
      }
    }

    if (lang && ["en", "fr", "de", "nl"].includes(lang)) {
      setLocale(lang);
    }
  }, []);

  const selectRef = useRef<HTMLSelectElement | null>(null);



  const majorityThreshold = (
    total % 2 === 0
      ? total / 2 + (allowTieBreaker ? 0 : 1)
      : Math.ceil(total / 2)
  ) as number;

  return (
    <div>
      <select
        ref={selectRef}
        value={defaultCountryValue ?? "European Union"}
        title="Select Country"
        aria-label="Select Country"
        onChange={(e) => {
          if (e.target.value === "CustomValue") {
            setParties([]);
            setSelectedParties([]);
            return;
          }
          const country = countries.find(
            (country) => country.name === e.target.value,
          );
          if (country) {
            setParties(country.parties);
            setSelectedParties(country.parties);
          }
          setDefaultCountryValue(e.target.value);
        }}
        id="countries-datalist"
        className="w-full appearance-none rounded-lg border-2 border-gray-200 bg-white p-2 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="CustomValue">{i("header.custom")}</option>
        <optgroup label="Sample">
          {countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((country) => (
              <option key={country.name} value={country.name}>
                {`${country.name}${country.emoji ? " " + country.emoji : ""}`}
              </option>
            ))}
        </optgroup>
      </select>

      <div className="sticky top-0 z-50 -mx-4 mb-4 bg-white px-4 pt-4 transition-colors duration-300 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <p className="flex-1">
            {selectedTotal === total || selectedTotal === 0 ? (
              ""
            ) : allowTieBreaker && majorityThreshold === selectedTotal ? (
              <span className="line-clamp-1 text-emerald-600 dark:text-emerald-400">
                {i("body.tieBreakerEnabled")}
              </span>
            ) : (total % 2 === 0 ? total / 2 + 1 : Math.ceil(total / 2)) <=
              selectedTotal ? (
              <span className="line-clamp-1 text-violet-600 dark:text-violet-400">
                {selectedTotal - majorityThreshold + (allowTieBreaker ? 0 : 1)}{" "}
                {selectedTotal -
                  majorityThreshold +
                  (allowTieBreaker ? 0 : 1) ===
                1
                  ? i("header.seat")
                  : i("header.seats")}{" "}
                {i("header.majority")}
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">{`${
                majorityThreshold - selectedTotal
              } ${
                majorityThreshold - selectedTotal === 1
                  ? i("header.seat")
                  : i("header.seats")
              } ${i("header.left")}
                `}</span>
            )}
          </p>
          <div
            className="relative flex items-center justify-center"
            title={`${
              total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)
            } ${i("header.seatsForMajority")}`}
          >
            <CaretDownIcon />
            <p className="absolute left-5 rtl:right-5">
              {total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)}{" "}
            </p>
          </div>
          <div className="flex flex-1 justify-end text-end">
            <p className="tabular-nums">
              <span className="font-semibold">{selectedTotal}</span> / {total}
            </p>
          </div>
        </div>
        <div
          className="relative flex h-12 w-full overflow-hidden rounded-lg bg-gray-200 transition-all dark:bg-gray-700"
          dir={sortBy === "position" ? "ltr" : ""}
        >
          {parties
            .sort((a, b) => sort(a, b, isEditMode, sortBy))
            .map((party, index) => (
              <div
                key={index}
                title={`${
                  party.isIndependent
                    ? party.shortName.length > 0
                      ? party.shortName + " (I)"
                      : "Independent"
                    : party.shortName
                } (${party.seats})`}
                style={{
                  backgroundColor: party.colour,
                  minWidth: "0%",
                  width: selectedParties.includes(party)
                    ? `${(party.seats / total) * 100}%`
                    : "0%",
                }}
                className={`r-0 h-full overflow-hidden text-ellipsis text-nowrap transition-[width] duration-300`}
              ></div>
            ))}
          <div className="bg-background-elevated absolute left-[calc(50%-1px)] h-full border-l-2 border-dashed border-violet-500"></div>
        </div>
        <hr className="-mx-4 mt-4 border-y border-gray-200 transition-colors duration-300 sm:-mx-0 dark:border-gray-700" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <AllowTieBreakerButton />
        <SortButton />
        <SwitchViewModeButton />
      </div>
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
      {parties.length <= 0 && (
        <p className="text-center">{i("body.noParties")}</p>
      )}
      <CoalitionBySpectrumButtons />
      <button
        onClick={() => {
          setParties([]);
          setSelectedParties([]);
          if (selectRef.current) {
            selectRef.current.value = "CustomValue";
          }
          setDefaultCountryValue("CustomValue");
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
                setDefaultCountryValue("CustomValue");
                if (selectRef.current) {
                  selectRef.current.value = "CustomValue";
                }
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
