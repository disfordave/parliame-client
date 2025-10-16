import {
  useSelectedParties,
  useParties,
  useSelectedCountry,
} from "@/lib/zustandStore";
import { countries } from "@/data/countries";
import { useEffect, useRef, useState } from "react";

export default function CountryList() {
  const { selectedCountry, setSelectedCountry } = useSelectedCountry();
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const [openCountryList, setOpenCountryList] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (openCountryList && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [openCountryList]);

  return (
    <>
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
            <div
              className="absolute top-0 z-[100] max-h-[50vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              ref={dropdownRef}
              tabIndex={0}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setOpenCountryList(false);
                }
              }}
            >
              <ul>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCountry(null);
                      setParties([]);
                      setSelectedParties([]);
                      setOpenCountryList(false);
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
                          }
                          setOpenCountryList(false);
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
    </>
  );
}
