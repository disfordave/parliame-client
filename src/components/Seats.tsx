import { useState } from "react";
import { Party } from "../App";
import { countries } from "./countries";

const CaretDownIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-caret-down-fill"
        viewBox="0 0 16 16"
      >
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
      </svg>
    </>
  );
};

const TrashIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </>
  );
};

const getposition = (position: number) => {
  const ranges = [
    { min: 100, max: Infinity, full: "Far right", short: "RR" },
    { min: 75, max: 99, full: "Right-wing", short: "Rr" },
    { min: 50, max: 74, full: "Centre right", short: "rr" },
    { min: 25, max: 49, full: "Lean right", short: "r" },
    { min: -24, max: 24, full: "Centre", short: "C" },
    { min: -49, max: -25, full: "Lean left", short: "l" },
    { min: -74, max: -50, full: "Centre left", short: "ll" },
    { min: -99, max: -75, full: "Left-wing", short: "Ll" },
    { min: -Infinity, max: -100, full: "Far left", short: "LL" },
  ];

  const match = ranges.find(
    (range) => position >= range.min && position <= range.max
  );

  return match || { full: "Centre", short: "C" };
};

const PartyButton = ({
  party,
  selectedParties,
  setSelectedParties,
  setParties,
  parties,
  isEditMode,
}: {
  party: Party;
  selectedParties: Party[];
  setSelectedParties: React.Dispatch<React.SetStateAction<Party[]>>;
  setParties: React.Dispatch<React.SetStateAction<Party[]>>;
  parties: Party[];
  isEditMode: boolean;
}) => {
  const selected = selectedParties.includes(party);
  //   const colour = party.isIndependent ? "#6B7280" : party.colour;
  const colour = party.colour;
  const partyName = party.isIndependent
    ? party.shortName.length > 0
      ? party.shortName + " (I)"
      : "Independent"
    : party.shortName;

  const shortDesc = `${partyName} (${party.seats})`;

  return (
    <div
      onClick={() => {
        if (isEditMode) return;
        if (selected) {
          setSelectedParties(selectedParties.filter((p) => p !== party));
        } else {
          setSelectedParties([...selectedParties, party]);
        }
      }}
      className={`${
        isEditMode ? "" : "cursor-pointer"
      } overflow-hidden flex gap-2 items-center border-2 hover:border-violet-300 p-2 rounded-lg w-full transition-all duration-300`}
      style={{
        borderColor: selected ? colour : "#e5e7eb",
        flexDirection: isEditMode ? "column" : "row",
      }}
      title={
        isEditMode
          ? ""
          : selected
          ? `Deselect ${shortDesc}`
          : `Select ${shortDesc}`
      }
      // disabled={isEditMode}
    >
      <div
        className={`relative ${
          isEditMode ? "w-full flex justify-center items-center" : ""
        }`}
      >
        {isEditMode && (
          <input
            name="partyColour"
            type="color"
            className="w-full cursor-pointer opacity-0 absolute"
            value={colour}
            onChange={(e) => {
              const newParty = { ...party, colour: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p))
                );
              }
            }}
          />
        )}
        <div
          className={` transition-all  ${
            isEditMode
              ? "h-6 w-full rounded-md border"
              : "size-4 aspect-square rounded-full"
          }`}
          style={{ backgroundColor: colour }}
        ></div>
      </div>
      <span className={isEditMode ? "w-full" : "truncate"}>
        {isEditMode ? (
          <input
            name="partyName"
            type="text"
            placeholder="Party Name"
            className="w-full outline-none border-b"
            value={party.shortName}
            onChange={(e) => {
              const newParty = { ...party, shortName: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p))
                );
              }
            }}
          />
        ) : (
          partyName
        )}
      </span>
      <span
        className={` font-semibold 
            ${isEditMode ? "w-full" : "text-nowrap"}`}
      >
        {isEditMode ? (
          <input
            name="seats"
            type="number"
            placeholder="Seats"
            className="w-full outline-none border-b"
            min={0}
            max={99999}
            value={party.seats.toFixed(0)}
            onChange={(e) => {
              const newParty = { ...party, seats: parseInt(e.target.value) };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p))
                );
              }

              if (e.target.value.length <= 0) {
                const newParty = { ...party, seats: 0 };
                setParties(parties.map((p) => (p === party ? newParty : p)));
                if (selected) {
                  setSelectedParties(
                    selectedParties.map((p) => (p === party ? newParty : p))
                  );
                }
              }
            }}
          />
        ) : (
          party.seats
        )}
      </span>
      {isEditMode ? (
        <>
          <div className="flex flex-col gap-2 items-center w-full">
            <input
              name="position"
              dir="ltr"
              id="position-range"
              step={25}
              className="w-full appearance-none rounded-full bg-gray-200"
              type="range"
              min="-100"
              max="100"
              value={party.position}
              onChange={(e) => {
                const newParty = {
                  ...party,
                  position: parseInt(e.target.value),
                };
                setParties(parties.map((p) => (p === party ? newParty : p)));
                if (selected) {
                  setSelectedParties(
                    selectedParties.map((p) => (p === party ? newParty : p))
                  );
                }
              }}
            />
            <label
              htmlFor="position-range"
              className="flex justify-between text-center"
            >
              <span>{getposition(party.position).full}</span>
            </label>
          </div>
          <div>
            <label className="flex gap-1 items-center">
              <input
                type="checkbox"
                name="isIndependent"
                value={party.isIndependent ? "1" : "0"}
                checked={party.isIndependent}
                onChange={(e) => {
                  const newParty = {
                    ...party,
                    isIndependent: e.target.checked,
                  };
                  setParties(parties.map((p) => (p === party ? newParty : p)));
                  if (selected) {
                    setSelectedParties(
                      selectedParties.map((p) => (p === party ? newParty : p))
                    );
                  }
                }}
              />
              <span className="select-none">Independent</span>
            </label>
          </div>
          <div className="w-full flex justify-evenly items-center gap-2">
            <button
              onClick={() => {
                if (selected) {
                  setSelectedParties(
                    selectedParties.filter((p) => p !== party)
                  );
                } else {
                  setSelectedParties([...selectedParties, party]);
                }
              }}
              type="button"
              title={selected ? "Deselect party" : "Select party"}
              aria-label={selected ? "Deselect party" : "Select party"}
            >
              {selected ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                setParties(parties.filter((p) => p !== party));
                if (selected) {
                  setSelectedParties(
                    selectedParties.filter((p) => p !== party)
                  );
                }
              }}
              type="button"
              className={`hover:opacity-75 transition-opacity `}
              title="Remove party"
              aria-label="Remove party"
            >
              <TrashIcon />
            </button>
          </div>
        </>
      ) : (
        <span className="text-nowrap font-mono">
          {`[${getposition(party.position).short}]`}
        </span>
      )}
    </div>
  );
};

const Seats = () => {
  const [parties, setParties] = useState<Party[]>(countries[1].parties);
  const [selectedParties, setSelectedParties] = useState<Party[]>(
    countries[1].parties
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "seats" | "position">("seats");
  const total = parties.reduce((acc, party) => acc + party.seats, 0);

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

  return (
    <>
      {/* <div className="">


        <input
          type="radio"
          name="isEditMode"
          id="isView"
          checked={!isEditMode}
          onChange={() => {
            setIsEditMode(false);
          }}
          value={0}
        />
        <label htmlFor="isView">View</label>
        <input
          type="radio"
          name="isEditMode"
          id="isEdit"
          checked={isEditMode}
          onChange={() => {
            setIsEditMode(true);
          }}
          value={1}
        />
        <label htmlFor="isEdit">Edit</label>
      </div> */}
      <select
        defaultValue={countries[1].name}
        
        onChange={(e) => {
          if (e.target.value === "CustomValue") {
            setParties([]);
            setSelectedParties([]);
            return;
          }
          const country = countries.find(
            (country) => country.name === e.target.value
          );
          if (country) {
            setParties(country.parties);
            setSelectedParties(country.parties);
          }
        }}
        id="countries-datalist"
        className="p-2 border-2 rounded-lg w-full border-gray-200 appearance-none bg-white"
      >
        <option value="CustomValue">Custom</option>
        <optgroup label="Sample">
          {countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((country) => (
              <option
                key={country.name}
                //   onClick={() => {
                //     setParties(country.parties);
                //     //   setTotalSeats(
                //     //     country.parties.reduce((acc, party) => acc + party.seats, 0)
                //     //   );
                //     setSelectedParties(country.parties);
                //   }}
                value={country.name}
              >
                {country.name}
              </option>
            ))}
        </optgroup>
      </select>
      <div className=" sticky top-0 z-50 bg-white py-4 border-b px-4 -mx-4 sm:-mx-0 sm:px-0 mb-4">
        {/* <Chart parties={selectedParites} totalSeats={totalSeats} /> */}
        <div className="flex justify-between items-center">
          <p className="flex-1">
                 
        {total / 2 <
        selectedParties.reduce((acc, party) => acc + party.seats, 0) ? (
          <span className="text-violet-500">
            Majority
          </span>
        ) : (
          <span className="text-rose-500">
            Minority
          </span>
        )}

        
      
            {/* {
               sortBy === "name" ? "ABC..." : sortBy === "seats" ? "Biggest" : "Left"
            } */}
          </p>
          <div className="">
            <CaretDownIcon />
          </div>
          <div className="flex-1 flex justify-end text-end">
            <p>
            {
            total % 2 === 0 ? (total / 2 + 1) : Math.ceil(total / 2)
        } for majority
            </p>
            {/* {
                sortBy === "name" ? "...XYZ" : sortBy === "seats" ? "Smallest" : "Right"
            } */}
            {/* <p className="text-right">{Math.ceil(totalSeats / 2)} for majority</p> */}
          </div>
          {/* <p>{(totalSeats / 2 < selectedParties.reduce((acc, party) => acc + party.seats, 0)) ? 'Meer dan de helft van de zetels is ingevuld' : 'Minder dan de helft van de zetels is ingevuld'}</p> */}
        </div>
        <div className="relative flex rounded-lg overflow-hidden bg-gray-200 h-12 w-full transition-all">
          {parties
            .sort((a, b) => sort(a, b))
            .map((party, index) => (
              <div
                key={index}
                style={{
                  //   backgroundColor: party.isIndependent
                  //     ? "#6B7280"
                  //     : party.colour,
                  backgroundColor: party.colour,
                  minWidth: "0%",
                  width: selectedParties.includes(party)
                    ? `${(party.seats / total) * 100}%`
                    : "0%",
                }}
                className={`h-full transition-[width] duration-300 r-0 text-ellipsis overflow-hidden text-nowrap`}

                // ${
                //     sortBy === "position" ? (party.position < 0 ? "" : (party.position === 0 ? "mx-auto" : ((parties[index - 1] && parties[index - 1].position < 0) ? "ml-auto" : ""))) : ""
                // }
              ></div>
            ))}
          <div className="absolute border-l-2 border-violet-500 border-dashed h-full bg-background-elevated left-[calc(50%-1px)] "></div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex-1 justify-start text-nowrap sm:w-auto">
          <p className=" text-lg tabular-nums ">
            <span className="font-semibold">{selectedParties.reduce((acc, party) => acc + party.seats, 0)}</span> /{" "}
            {total}
          </p>
        </div>
        <div className="flex sm:order-2 order-3 rounded-lg overflow-y-hidden overflow-x-scroll whitespace-nowrap sm:w-auto w-full">
          <button
            onClick={() => setSortBy("name")}
            className={`${
              sortBy === "name" ? "bg-violet-500 text-white" : "bg-gray-200"
            } px-2 py-1 transition-colors flex-1`}
          >
            Name
          </button>
          <button
            onClick={() => setSortBy("position")}
            className={`${
              sortBy === "position" ? "bg-violet-500 text-white" : "bg-gray-200"
            } px-2 py-1 transition-colors flex-1`}
          >
            Position
          </button>
          <button
            onClick={() => setSortBy("seats")}
            className={`${
              sortBy === "seats" ? "bg-violet-500 text-white" : "bg-gray-200"
            } px-2 py-1 transition-colors flex-1`}
          >
            Seats
          </button>
        </div>
        <div className=" select-none flex sm:order-3 order-2 items-center gap-2 flex-1 justify-end">
          <span onClick={() => setIsEditMode(false)}>View</span>
          <div
            onClick={() => setIsEditMode(!isEditMode)}
            className={` cursor-pointer rounded-full relative w-12 h-6 bg-gray-200 flex `}
          >
            <div
              className={`h-full w-6 rounded-full bg-violet-500 transition-all ${
                isEditMode ? "translate-x-full rtl:-translate-x-full" : ""
              }`}
            ></div>
          </div>
          <span onClick={() => setIsEditMode(true)}>Edit</span>
        </div>
      </div>
      <ul
        className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-4 transition-all`}
      >
        {parties
          .sort((a, b) => sort(a, b))
          .map((party, index) => (
            <li key={index}>
              <PartyButton
                parties={parties}
                party={party}
                selectedParties={selectedParties}
                setSelectedParties={setSelectedParties}
                setParties={setParties}
                isEditMode={isEditMode}
              />
            </li>
          ))}
        {isEditMode && (
          <li className="w-full h-full justify-center flex items-center">
            <button
              onClick={() => {
                setParties([
                  ...parties,
                  {
                    name: "New Party",
                    shortName: "",
                    seats: 0,
                    colour: "#6B7280",
                    position: 0,
                    isIndependent: false,
                  },
                ]);
              }}
              className="p-2 border-2 border-transparent rounded-full w-1/3  aspect-square m-4 bg-gray-400 transition-colors hover:bg-gray-500 "
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
                className="size-2/3 stroke-2 text-white m-auto"
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
      {parties.length <= 0 && <p className="text-center">No parties</p>}

      <div className="flex gap-2 flex-wrap mt-4 bg-gray-200 rounded-2xl p-4">
        <button
          onClick={() => setSelectedParties([...parties])}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
        >
          Select All
        </button>
        <button
        onClick={() => setSelectedParties([])}
        className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
      >
        Deselect All
      </button>
        <button
          onClick={() => {
            const leftParties = parties.filter((party) => party.position < 0);
            setSelectedParties(leftParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Left"
          aria-label="Select Left"
          aria-describedby="Select Left"
          aria-disabled={false}
        >
          Left
        </button>
        <button
          onClick={() => {
            const rightParties = parties.filter((party) => party.position > 0);
            setSelectedParties(rightParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Right"
          aria-label="Select Right"
          aria-describedby="Select Right"
          aria-disabled={false}
        >
          Right
        </button>
        <button
          onClick={() => {
            const leftParties = parties.filter(
              (party) => party.position < 0 && party.position > -100
            );
            setSelectedParties(leftParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Left"
          aria-label="Select Left"
          aria-describedby="Select Left"
          aria-disabled={false}
        >
          Left (without far left)
        </button>
        <button
          onClick={() => {
            const rightParties = parties.filter(
              (party) => party.position > 0 && party.position < 100
            );
            setSelectedParties(rightParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Right"
          aria-label="Select Right"
          aria-describedby="Select Right"
          aria-disabled={false}
        >
          Right (without far right)
        </button>
        <button
          onClick={() => {
            const rightParties = parties.filter(
              (party) => party.position <= -75
            );
            setSelectedParties(rightParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Right"
          aria-label="Select Right"
          aria-describedby="Select Right"
          aria-disabled={false}
        >
          Left-wing
        </button>
        <button
          onClick={() => {
            const rightParties = parties.filter(
              (party) => party.position >= 75
            );
            setSelectedParties(rightParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Right"
          aria-label="Select Right"
          aria-describedby="Select Right"
          aria-disabled={false}
        >
          Right-wing
        </button>
        <button
          onClick={() => {
            const rightParties = parties.filter(
              (party) =>
                party.position < 75 &&
                party.position > -75 &&
                !party.isIndependent
            );
            setSelectedParties(rightParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Right"
          aria-label="Select Right"
          aria-describedby="Select Right"
          aria-disabled={false}
        >
          Grand (centre)
        </button>
        <button
          onClick={() => {
            const rightParties = parties.filter(
              (party) =>
                party.position > -100 &&
                party.position < 100 &&
                !party.isIndependent
            );
            setSelectedParties(rightParties);
          }}
          className="px-4 py-2 border-2 border-transparent hover:border-violet-500 transition-colors rounded-full bg-white border-gray-200 text-nowrap"
          type="button"
          title="Select Right"
          aria-label="Select Right"
          aria-describedby="Select Right"
          aria-disabled={false}
        >
          Grand (without extremists)
        </button>
      </div>
      <button
        onClick={() => {
          setParties([]);
          setSelectedParties([]);
        }}
        className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200"
      >
        Reset All
      </button>
      <button
        onClick={() => {
          const data = JSON.stringify(parties);
          const blob = new Blob([data], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "parties.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200"
        type="button"
        title="Export Parties"
        aria-label="Export Parties"
        aria-describedby="Export Parties"
        aria-disabled={false}
      >
        Export Parties
      </button>
      <input
        type="file"
        accept=".json"
        className="mt-4 max-w-full"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target?.result;
            if (!data) return;
            const parsedData = JSON.parse(data as string);
            setParties(parsedData);
            setSelectedParties(parsedData);
          };
          reader.readAsText(file);
        }}
      />
    </>
  );
};

export default Seats;
