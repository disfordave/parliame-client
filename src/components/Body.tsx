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
} from "@/components/ui/app";
import { ResponsivePie } from "@nivo/pie";

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

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="mt-4 block lg:hidden">
        <CountryListDropdown />
      </div>
      <div className="-mb-4 h-48 w-full xs:h-48 sx:h-64 md:h-80 lg:h-96">
        <ResponsivePie
          data={[
            ...selectedParties
              .sort((a, b) => sort(a, b, isEditMode, sortBy))
              .map((party) => ({
                id: party.name.length < 1 ? party.shortName : party.name,
                label: party.name.length < 1 ? party.shortName : party.name,
                value: party.seats,
                color: party.colour,
              })),
            {
              id: "empty",
              label: "empty",
              value:
                parties.reduce((acc, party) => acc + party.seats, 0) -
                selectedParties.reduce((acc, party) => acc + party.seats, 0),
              color: isDarkMode ? "#374151" : "#e5e7eb"
            },
          ]}
          startAngle={-90}
          endAngle={90}
          margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
          sortByValue={false}
          innerRadius={0.4}
          colors={{ datum: "data.color" }}
          activeOuterRadiusOffset={8}
          enableArcLinkLabels={false}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          enableArcLabels={false}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          isInteractive={false}
          transitionMode="innerRadius"
          motionConfig="default"
        />
      </div>
      <div className="sticky top-0 z-10 mx-auto w-[calc(100%-2rem)] pb-2 pt-4 sx:w-3/4">
        <SeatsGraph />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
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
