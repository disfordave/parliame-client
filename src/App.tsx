import { useState } from "react";
import "./App.css";

export interface Party {
  name: string;
  shortName: string;
  seats: number;
  colour: string;
}

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

// const EditIcon = () => {
//   return (
//     <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
//   </svg>
//   </>
//   )
// }

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

const countries: { name: string, parties: Party[] }[] = [
  {
    name: "Germany",
    parties: [
      {
        name: "CDU/CSU",
        shortName: "CDU/CSU",
        seats: 196,
        colour: "#000000",
      },
      {
        name: "Sozialdemokratische Partei Deutschlands",
        shortName: "SPD",
        seats: 207,
        colour: "#ff0000",
      },
      {
        name: "Alternative für Deutschland",
        shortName: "AfD",
        seats: 77,
        colour: "#009ee0",
      },
      {
        name: "Freie Demokratische Partei",
        shortName: "FDP",
        seats: 91,
        colour: "#ffed00",
      },
      {
        name: "Die Linke",
        shortName: "Linke",
        seats: 28,
        colour: "#8c3473",
      },
      {
        name: "Bündnis 90/Die Grünen",
        shortName: "Grüne",
        seats: 117,
        colour: "#64a12d",
      },
      {
        name: "Bündnis Sahra Wagenknecht",
        shortName: "BSW",
        seats: 10,
        colour: "#792351",
      }, {
        name: "Andere",
        shortName: "Andere",
        seats: 7,
        colour: "#808080",
      }
    ]
  },
  {
    name: "Belgium",
    parties: [
      {
        name: "Nieuw-Vlaamse Alliantie",
        shortName: "N-VA",
        seats: 24,
        colour: "#FCBD1B",
      },
      {
        name: "Vlaams Belang",
        shortName: "VB",
        seats: 20,
        colour: "#FFE500",
      },
      {
        name: "Open Vlaamse Liberalen en Democraten",
        shortName: "Open VLD",
        seats: 7,
        colour: "#005daa",
      },
      {
        name: "Vooruit",
        shortName: "Vooruit",
        seats: 13,
        colour: "#ff0014",
      },
      {
        name: "Groen",
        shortName: "Groen",
        seats: 6,
        colour: "#03ae5c",
      },
      {
        name: "Christen-Democratisch en Vlaams",
        shortName: "CD&V",
        seats: 11,
        colour: "#ff8000",
      },
      {
        name: "Partij van de Arbeid/Parti du Travail de Belgique",
        shortName: "PVDA-PTB",
        seats: 15,
        colour: "#c04",
      },
      {
        name: "Mouvement Réformateur",
        shortName: "MR",
        seats: 20,
        colour: "#002eff",
      },
      {
        name: "Ecolo",
        shortName: "Ecolo",
        seats: 3,
        colour: "#008d40",
      },
      {
        name: "DéFI",
        shortName: "DéFI",
        seats: 1,
        colour: "#dd007a",
      },
      {
        name: "Parti Socialiste",
        shortName: "PS",
        seats: 16,
        colour: "#ff0000",
      },
      {
        name: "Les Engagés",
        shortName: "LE",
        seats: 14,
        colour: "#00e6d2",
      },
    ]
  },
  {
    name: "United Kingdom",
    parties: [
      {
        name: "Labour Party",
        shortName: "Labour",
        seats: 403,
        colour: "#e4003b",
      },
      {
        name: "Conservative Party",
        shortName: "Conservative",
        seats: 121,
        colour: "#0087DC"
      },
      {
        name: "Liberal Democrats",
        shortName: "Lib Dems",
        seats: 72,
        colour: "#FAA61A"
      },
      {
        name: "Scottish National Party",
        shortName: "SNP",
        seats: 9,
        colour: "#FDF38E"
      },
      {
        name: "Democratic Unionist Party",
        shortName: "DUP",
        seats: 5,
        colour: "#D46A4C"
      },
      {
        name: "Reform UK",
        shortName: "Reform",
        seats: 5,
        colour: "#12B6CF"
      },
      {
        name: "Green Party",
        shortName: "Green",
        seats: 4,
        colour: "#02A95B"
      }, 
      {
        name: "Plaid Cymru",
        shortName: "PC",
        seats: 4,
        colour: "#005B54"
      },
      {
        name: "Social Democratic and Labour Party",
        shortName: "SDLP",
        seats: 2,
        colour: "#2AA82C"
      },
      {
        name: "Alliance Party of Northern Ireland",
        shortName: "APNI",
        seats: 1,
        colour: "#F6CB2F"
      },
      {
        name: "Traditional Unionist Voice",
        shortName: "TUV",
        seats: 1,
        colour: "#0C3A6A"
      },
      {
        name: "Ulster Unionist Party",
        shortName: "UUP",
        seats: 1,
        colour: "#48A5EE"
      },
      {
        name: "Independents",
        shortName: "Ind",
        seats: 9,
        colour: "#808080"
      },
      {
        name: "Speaker",
        shortName: "Speaker",
        seats: 1,
        colour: "#000000"
      },
      {
        name: "Independent Alliance",
        shortName: "IA",
        seats: 5,
        colour: "#555"
      }
    ]
  },
  {
    name: "Austria",
    parties: [
      {
        name: "Österreichische Volkspartei",
        shortName: "ÖVP",
        seats: 51,
        colour: "#63C3D0",
      },
      {
        name: "Sozialdemokratische Partei Österreichs",
        shortName: "SPÖ",
        seats: 41,
        colour: "#E42712",
      },
      {
        name: "Freiheitliche Partei Österreichs",
        shortName: "FPÖ",
        seats: 57,
        colour: "#0056A2",
      },
      {
        name: "Die Grünen – Die Grüne Alternative",
        shortName: "Grüne",
        seats: 16,
        colour: "#87B529",
      },
      {
        name: "Neos – Das Neue Österreich",
        shortName: "NEOS",
        seats: 18,
        colour: "#CB1667",
      }
    ]
  }
]

const PartyButton = ({
  party,
  selectedParties,
  setSelectedParties,
  setParties,
  parties,
}: {
  party: Party;
  selectedParties: Party[];
  setSelectedParties: React.Dispatch<React.SetStateAction<Party[]>>;
  setParties: React.Dispatch<React.SetStateAction<Party[]>>;
  parties: Party[];
}) => {
  const [onHover, setOnHover] = useState(false);

  return (
    <div
      className="relative"
      onMouseOver={() => setOnHover(true)}
      onMouseOut={() => setOnHover(false)}
    >
      <button
        onClick={() => {
          if (selectedParties.includes(party)) {
            setSelectedParties(selectedParties.filter((p) => p !== party));
          } else {
            setSelectedParties([...selectedParties, party]);
          }
        }}
        type="button"
        className="flex gap-2 items-center border-2 hover:border-violet-300 p-2 rounded-lg w-full transition-all duration-300 "
        style={{
          borderColor: selectedParties.includes(party)
            ? party.colour
            : "#e5e7eb",
        }}
      >
        <div
          className="size-4 aspect-square rounded-full"
          style={{ backgroundColor: party.colour }}
        ></div>
        <span className="line-clamp-1">{party.shortName}</span>
        <span className=" text-lg font-semibold">{party.seats}</span>
      </button>

      <button
        onClick={
          // () => {
          //   setPartyNameInput(party.name)
          //   setPartyShortNameInput(party.shortName)
          //   setPartySeatsInput(party.seats)
          //   setPartyColourInput(party.colour)
          // }
          () => {
            setParties(parties.filter((p) => p !== party));
            if (selectedParties.includes(party)) {
              setSelectedParties(selectedParties.filter((p) => p !== party));
            }
          }
        }
        type="button"
        className={`absolute top-[25%] right-2 hover:opacity-75 transition-opacity ${
          onHover ? "opacity-100" : "opacity-0"
        }`}
      >
        <TrashIcon />
      </button>
    </div>
  );
};

function App() {
  const [totalSeats, setTotalSeats] = useState(150);
  const [parties, setParties] = useState<Party[]>(countries[1].parties);
  const [selectedParties, setSelectedParties] = useState<Party[]>([]);

  const [totalSeatsInput, setTotalSeatsInput] = useState(150);
  const [partyNameInput, setPartyNameInput] = useState("");
  const [partyShortNameInput, setPartyShortNameInput] = useState("");
  const [partySeatsInput, setPartySeatsInput] = useState(0);
  const [partyColourInput, setPartyColourInput] = useState("#000000");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTotalSeats(totalSeatsInput);
    setParties([
      ...parties,
      {
        // @ts-expect-error this means to be string you mf typescript.
        name: e.currentTarget["name"].value,
        shortName: e.currentTarget["shortName"].value,
        seats: parseInt(e.currentTarget["seats"].value),
        colour: e.currentTarget["colour"].value,
      },
    ]);
    // const form = e.currentTarget
    // const name = form['name'].value
    // const shortName = form['shortName'].value
    // const seats = parseInt(form['seats'].value)
    // const colour = form['colour'].value
    // setParties([...parties, {name, shortName, seats, colour}])
  };

  const total = parties.reduce((acc, party) => acc + party.seats, 0)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mt-4">
        {/* <Chart parties={selectedParites} totalSeats={totalSeats} /> */}
        <div className="flex justify-between items-center">
          <p className="flex-1">
            {selectedParties.reduce((acc, party) => acc + party.seats, 0)} /{" "}
            {total} seats filled
          </p>
          <CaretDownIcon />
          <div className="flex-1">
            {/* <p className="text-right">{Math.ceil(totalSeats / 2)} for majority</p> */}
          </div>
          {/* <p>{(totalSeats / 2 < selectedParties.reduce((acc, party) => acc + party.seats, 0)) ? 'Meer dan de helft van de zetels is ingevuld' : 'Minder dan de helft van de zetels is ingevuld'}</p> */}
        </div>
        <div className="relative flex rounded-lg overflow-hidden bg-gray-200 h-12 w-full transition-all">
          {parties
            .sort((a, b) =>
              a.seats === b.seats
                ? b.name.localeCompare(a.name)
                : b.seats - a.seats
            )
            .map((party) => (
              <div
                key={party.shortName}
                style={{
                  backgroundColor: party.colour,
                  minWidth: "0%",
                  width: selectedParties.includes(party)
                    ? `${(party.seats / total) * 100}%`
                    : "0%",
                }}
                className="h-full transition-[width] duration-300 text-ellipsis overflow-hidden text-nowrap"
              ></div>
            ))}
          <div className="absolute w-1 h-full bg-background-elevated left-[calc(50%-2px)] bg-white"></div>
        </div>
      </div>

      <p className="mb-4">
        {totalSeats / 2 <
        selectedParties.reduce((acc, party) => acc + party.seats, 0) ? (
          <span className="text-violet-500">
            More than half of the seats are filled
          </span>
        ) : (
          <span className="text-rose-500">
            Less than half of the seats are filled
          </span>
        )}
      </p>

      <ul
        className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-4 transition-all`}
      >
        {parties
          .sort((a, b) => b.seats - a.seats)
          .map((party) => (
            <li key={party.shortName}>
              <PartyButton
                parties={parties}
                party={party}
                selectedParties={selectedParties}
                setSelectedParties={setSelectedParties}
                setParties={setParties}
              />
            </li>
          ))}
      </ul>
      {parties.length <= 0 && <p className="text-center">No parties</p>}

      <div className="flex gap-4">
        {
          countries.map((country) => (
            <button key={country.name} onClick={() => {
              setParties(country.parties)
              setTotalSeats(country.parties.reduce((acc, party) => acc + party.seats, 0))
              setSelectedParties([])
            }} className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200">{country.name}</button>
          ))
        }
      
      </div>
      <button
        onClick={() => 
          setSelectedParties([...parties])
        }
        className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200"
      >
        Select All
      </button>
      <button
        onClick={() => setSelectedParties([])}
        className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200"
      >
        Deselect All
      </button>
      <button
        onClick={() => {
          setParties([]);
          setSelectedParties([]);
        }}
        className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200"
      >
        Reset All
      </button>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <label htmlFor="totalSeats">Total Seats</label>
        <input
          type="number"
          id="totalSeats"
          className="block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          value={totalSeatsInput}
          onChange={(e) => setTotalSeatsInput(parseInt(e.target.value))}
        />
        <label htmlFor="name">Party Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          value={partyNameInput}
          onChange={(e) => setPartyNameInput(e.target.value)}
        />
        <label htmlFor="shortName">Short Name</label>
        <input
          type="text"
          name="shortName"
          id="shortName"
          className="block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          value={partyShortNameInput}
          onChange={(e) => setPartyShortNameInput(e.target.value)}
        />
        <label htmlFor="seats">Seats</label>
        <input
          type="number"
          name="seats"
          id="seats"
          className="block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          value={partySeatsInput}
          onChange={(e) => setPartySeatsInput(parseInt(e.target.value))}
        />
        <label htmlFor="colour">Colour</label>
        <input
          type="color"
          id="colour"
          className=""
          value={partyColourInput}
          onChange={(e) => setPartyColourInput(e.target.value)}
        />
        <button type="submit" className="p-2 border rounded-lg">
          Button
        </button>
      </form>
    </div>
  );
}

export default App;
