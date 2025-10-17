import {
  useSelectedParties,
  useParties,
  useSelectedCountry,
} from "@/lib/zustandStore";
import { countries } from "@/data/countries";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons/Icons";
import { Country } from "@/types";
import { AnimatePresence, motion } from "motion/react";

export default function CountryListDropdown() {
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

  function select(country: Country) {
    setSelectedCountry(country);
    const findCountry = countries.find((c) => c.name === country.name);
    if (findCountry) {
      setParties(findCountry.parties);
      setSelectedParties(findCountry.parties);
    } else {
      setSelectedCountry(null);
      setParties([]);
      setSelectedParties([]);
    }
    setOpenCountryList(false);
  }

  return (
    <div
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpenCountryList(false);
        }
      }}
    >
      <button
        onClick={() => {
          setOpenCountryList(!openCountryList);
        }}
        className={`w-full rounded-lg border-2 border-gray-200 p-2 pe-1 transition-colors duration-300 dark:border-gray-700 ${
          openCountryList
            ? "bg-gray-200 dark:bg-gray-700"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="flex items-center justify-between gap-1">
          {selectedCountry ? (
            <div className="flex gap-1">
              <span>{selectedCountry.name}</span>
              <span>{selectedCountry.emoji}</span>
            </div>
          ) : (
            <>
              <span>Custom</span>
            </>
          )}
          <ChevronDownIcon
            className={`transition-transform duration-300 ${openCountryList ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div className="relative">
        <AnimatePresence>
          {openCountryList && (
            <>
              <motion.div
                key="modal"
                transition={{
                  duration: 0.3,
                }}
                initial={{ opacity: 0, translateY: -8 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -2 }}
                className="absolute top-0 z-[75] max-h-[50vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900"
                ref={dropdownRef}
              >
                <ul>
                  <li>
                    <span className="px-2 py-1 text-sm opacity-75">Custom</span>
                    <ul>
                      <li>
                        <button
                          onClick={() => {
                            if (selectedCountry) {
                              setSelectedCountry(null);
                              setParties([]);
                              setSelectedParties([]);
                            }
                            setOpenCountryList(false);
                          }}
                          className={`w-full p-2 transition-colors duration-300 ${
                            !selectedCountry
                              ? "bg-gray-200 dark:bg-gray-700"
                              : "bg-white hover:bg-gray-100 dark:bg-gray-900 hover:dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex gap-1">
                            <span>Custom</span>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="px-2 py-1 text-sm opacity-75">
                      Sample Countries
                    </span>
                    <ul>
                      {countries
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((country) => (
                          <li
                            key={country.name}
                            value={country.name}
                            id={country.name}
                          >
                            <button
                              onClick={() => {
                                select(country);
                              }}
                              className={`w-full p-2 transition-colors duration-300 ${
                                selectedCountry === country
                                  ? "bg-gray-200 dark:bg-gray-700"
                                  : "bg-white hover:bg-gray-100 dark:bg-gray-900 hover:dark:bg-gray-800"
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
                  </li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
