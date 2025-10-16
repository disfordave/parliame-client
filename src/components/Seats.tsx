import { useRef, useEffect } from "react";

import { useI18n } from "../i18n/i18n";
import { useDispatch } from "react-redux";
import { setLocale } from "../i18n/i18nSlice";

import { Party } from "@/types";
import { CaretDownIcon } from "@/components/icons/Icons";
import { countries } from "@/data/countries";
import { useAllowTieBreaker, useDefaultCountryValue, useSelectedParties, useIsEditMode, useParties, useSortBy } from "@/lib/zustandStore";
import { PartyButton } from "@/components/PartyButton";

interface ButtonConfig {
  label: string;
  onClick: () => void;
}

const Seats = () => {
  const { parties, setParties } = useParties();
  const { selectedParties, setSelectedParties } = useSelectedParties();
  const { isEditMode, setIsEditMode } = useIsEditMode();
  const { sortBy, setSortBy } = useSortBy();
  const { allowTieBreaker, setAllowTieBreaker } = useAllowTieBreaker();
  const { defaultCountryValue, setDefaultCountryValue } = useDefaultCountryValue();

  const total = parties.reduce((acc, party) => acc + party.seats, 0);
  
  const selectedTotal = selectedParties.reduce(
    (acc, party) => acc + party.seats,
    0,
  );
  // const totalPositions =
  //   selectedParties.reduce((acc, party) => acc + party.position, 0) /
  //   selectedParties.length;
  const langDispatch = useDispatch();

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
      langDispatch(setLocale(lang));
    }
  }, []);

  const selectRef = useRef<HTMLSelectElement | null>(null);
  const i = useI18n();
  const majorityThreshold = (
    total % 2 === 0
      ? total / 2 + (allowTieBreaker ? 0 : 1)
      : Math.ceil(total / 2)
  ) as number;

  const sort = (a: Party, b: Party) => {
    if (isEditMode) return 0; // Stop sorting if edit mode is on
    if (sortBy === "name") {
      const aIsIndependent = a.isIndependent === true;
      const bIsIndependent = b.isIndependent === true;

      // If both are independent, maintain original order
      if (aIsIndependent && bIsIndependent) return 0;

      // If only a is independent, push it to the end
      if (aIsIndependent) return 1;

      // If only b is independent, push it to the end
      if (bIsIndependent) return -1;

      return a.shortName.localeCompare(b.shortName);
    }
    if (sortBy === "seats") {
      const aIsIndependent = a.isIndependent === true;
      const bIsIndependent = b.isIndependent === true;

      // If both are independent, maintain original order
      if (aIsIndependent && bIsIndependent) return 0;

      // If only a is independent, push it to the end
      if (aIsIndependent) return 1;

      // If only b is independent, push it to the end
      if (bIsIndependent) return -1;

      // If neither is independent, sort by seats in descending order
      return b.seats - a.seats;
    }
    if (sortBy === "position") return a.position - b.position;
    return 0;
  };

  const buttonConfigurations: ButtonConfig[] = [
    {
      label: i("controls.selectAll"),
      onClick: () => setSelectedParties([...parties]),
    },
    {
      label: i("controls.deselectAll"),
      onClick: () => setSelectedParties([]),
    },
    {
      label: i("controls.left"),
      onClick: () => {
        const leftParties = parties.filter((party) => party.position < 0);
        setSelectedParties(leftParties);
      },
    },
    {
      label: i("controls.right"),
      onClick: () => {
        const rightParties = parties.filter((party) => party.position > 0);
        setSelectedParties(rightParties);
      },
    },
    {
      label: i("controls.leftWithoutFarLeft"),
      onClick: () => {
        const leftParties = parties.filter(
          (party) => party.position < 0 && party.position > -100,
        );
        setSelectedParties(leftParties);
      },
    },
    {
      label: i("controls.rightWithoutFarRight"),
      onClick: () => {
        const rightParties = parties.filter(
          (party) => party.position > 0 && party.position < 100,
        );
        setSelectedParties(rightParties);
      },
    },
    {
      label: i("controls.leftWing"),
      onClick: () => {
        const leftParties = parties.filter((party) => party.position <= -75);
        setSelectedParties(leftParties);
      },
    },
    {
      label: i("controls.rightWing"),
      onClick: () => {
        const rightParties = parties.filter((party) => party.position >= 75);
        setSelectedParties(rightParties);
      },
    },
    {
      label: i("controls.centre"),
      onClick: () => {
        const centerParties = parties.filter(
          (party) =>
            party.position <= 25 &&
            party.position >= -25 &&
            !party.isIndependent,
        );
        setSelectedParties(centerParties);
      },
    },
    {
      label: i("controls.grandCentre"),
      onClick: () => {
        const centerParties = parties.filter(
          (party) =>
            party.position < 75 && party.position > -75 && !party.isIndependent,
        );
        setSelectedParties(centerParties);
      },
    },
    {
      label: i("controls.grandWithoutExtremes"),
      onClick: () => {
        const grandParties = parties.filter(
          (party) =>
            party.position > -100 &&
            party.position < 100 &&
            !party.isIndependent,
        );
        setSelectedParties(grandParties);
      },
    },
  ];

  const sortButtonConfigs = [
    { label: i("body.name"), sortByKey: "name", title: "Sort by Name" },
    {
      label: i("body.position"),
      sortByKey: "position",
      title: "Sort by Political Position",
    },
    { label: i("body.seats"), sortByKey: "seats", title: "Sort by Seats" },
  ] as {
    label: string;
    sortByKey: "name" | "position" | "seats";
    title: string;
  }[];

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
            .sort((a, b) => sort(a, b))
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
        <div className="flex-1 justify-start text-nowrap sm:w-auto">
          <label className="flex items-center gap-2">
            <span className="relative">
              <input
                title="Allow Tie Breaker"
                type="checkbox"
                name="allowTieBreaker"
                id="allowTieBreaker"
                className="absolute h-full w-full opacity-0"
                checked={allowTieBreaker}
                onChange={() => {
                  setAllowTieBreaker(!allowTieBreaker);
                }}
              />
              <div
                role="checkbox"
                aria-label={"Allow Tie Breaker"}
                aria-checked={allowTieBreaker}
                className={`${
                  allowTieBreaker
                    ? "bg-violet-600 dark:bg-violet-400"
                    : "bg-gray-200 dark:bg-gray-700"
                } flex aspect-square size-6 items-center justify-center overflow-hidden rounded-full transition-colors`}
              >
                {allowTieBreaker ? (
                  <div className="flex h-full w-full items-center justify-center text-white dark:text-gray-950">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-white dark:bg-gray-700 dark:text-gray-950"></div>
                )}
              </div>
            </span>
            <span className="select-none text-wrap">
              {i("body.allowTieBreaker")}
            </span>
          </label>
        </div>
        <div className="order-3 flex w-full overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-lg sm:order-2 sm:w-auto">
          {sortButtonConfigs.map((config, index) => (
            <button
              key={index}
              onClick={() => setSortBy(config.sortByKey)}
              className={`${
                sortBy === config.sortByKey
                  ? "bg-violet-600 text-white dark:bg-violet-400 dark:text-gray-950"
                  : "bg-gray-200 dark:bg-gray-700"
              } flex-1 px-2 py-1 transition-colors`}
              title={config.title}
            >
              {config.label}
            </button>
          ))}
        </div>
        <div className="order-2 flex flex-1 select-none items-center justify-end gap-2 sm:order-3">
          <span
            title={"Switch to View Mode"}
            className="cursor-default select-none"
            onClick={() => setIsEditMode(false)}
          >
            {i("body.view")}
          </span>
          <div
            onClick={() => setIsEditMode(!isEditMode)}
            className={`relative flex h-6 w-12 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700`}
            title={isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"}
          >
            <div
              className={`h-full w-6 rounded-full bg-violet-600 transition-all dark:bg-violet-400 ${
                isEditMode ? "translate-x-full rtl:-translate-x-full" : ""
              }`}
            ></div>
          </div>
          <span
            title="Switch to Edit Mode"
            className="cursor-default select-none"
            onClick={() => setIsEditMode(true)}
          >
            {i("body.edit")}
          </span>
        </div>
      </div>
      <ul
        className={`grid grid-cols-1 gap-4 transition-all xs:grid-cols-2 sm:grid-cols-3 sm:gap-4`}
      >
        {parties
          .sort((a, b) => sort(a, b))
          .map((party, index) => (
            <li key={index}>
              <PartyButton
                party={party}
              />
            </li>
          ))}
        {isEditMode && (
          <li className="flex h-full w-full items-center justify-center">
            <button
              onClick={() => {
                setParties([
                  ...parties,
                  {
                    name: "",
                    shortName: "",
                    seats: 0,
                    colour: "#6B7280",
                    position: 0,
                    isIndependent: false,
                  },
                ]);
              }}
              className="m-4 aspect-square w-1/3 rounded-full border-2 border-transparent bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              type="button"
              title="Add Party"
              aria-label="Add Party"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="m-auto size-2/3 stroke-2 text-gray-950 dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </li>
        )}
      </ul>
      {parties.length <= 0 && (
        <p className="text-center">{i("body.noParties")}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 overflow-auto rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
        {buttonConfigurations.map((buttonConfig, index) => (
          <button
            key={index}
            onClick={buttonConfig.onClick}
            className="text-nowrap rounded-full border-2 border-transparent bg-white px-3 py-1 transition-colors hover:border-violet-600 dark:bg-gray-900 dark:hover:border-violet-400"
            type="button"
            title={buttonConfig.label}
            aria-label={buttonConfig.label}
            aria-describedby={buttonConfig.label}
            aria-disabled={false}
          >
            {buttonConfig.label}
          </button>
        ))}
      </div>

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
