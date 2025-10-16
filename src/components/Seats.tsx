import { useEffect } from "react";
import { countries } from "@/data/countries";
import {
  useSelectedParties,
  useIsEditMode,
  useParties,
  useSortBy,
  useI18n,
  useSelectedCountry,
} from "@/lib/zustandStore";
import { PartyButton } from "@/components/PartyButton";
import { sort } from "@/utils/sort";
import AllowTieBreakerButton from "./ui/AllowTieBreakerButton";
import SwitchViewModeButton from "./ui/SwitchViewModeButton";
import SortButton from "./ui/SortButton";
import CoalitionBySpectrumButtons from "./ui/CoalitionBySpectrumButtons";
import AddNewPartyButton from "./ui/AddNewPartyButton";
import SeatsGraph from "./ui/SeatsGraph";
import CountryList from "./ui/CountryListDropdown";
import JsonShareButton from "./ui/JsonShareButton";

const Seats = () => {
  const { parties, setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { isEditMode } = useIsEditMode();
  const { sortBy } = useSortBy();
  const { i, setLocale } = useI18n();
  const { setSelectedCountry } = useSelectedCountry();

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

  return (
    <div>
      <CountryList />
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
      <JsonShareButton />
    </div>
  );
};

export default Seats;
