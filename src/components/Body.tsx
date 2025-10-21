/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
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
