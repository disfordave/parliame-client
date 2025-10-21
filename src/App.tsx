import "./App.css";
import Body from "@/components/Body";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { countries } from "./data/countries";
import { useI18n, useParties, useSelectedCountry, useSelectedParties } from "./lib/zustandStore";
import { Country } from "./types";

function App() {
  const { i } = useI18n();
    const { selectedCountry, setSelectedCountry } = useSelectedCountry();
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();

  return (
    <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-6xl p-4">
        <Header />
        <div className="flex gap-4 ">
          <Body />
          <div className="basis-1/2 pt-4 hidden lg:block">
            <div className="w-full h-[80vh] sticky top-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
              <h2 className="px-2 py-1 text-xl font-semibold">
                {i("header.countries")}
              </h2>
              <ul>
                <li>
                  <span className="px-2 py-1 text-sm opacity-75">
                    {i("header.custom")}
                  </span>
                  <ul>
                    <li>
                      <button
                        onClick={() => {
                          if (selectedCountry) {
                            setSelectedCountry(null);
                            setParties([]);
                            setSelectedParties([]);
                          }
                        }}
                        className={`w-full p-2 transition-colors duration-300 ${
                          !selectedCountry
                            ? "bg-gray-200 dark:bg-gray-700"
                            : "bg-white hover:bg-gray-100 dark:bg-gray-900 hover:dark:bg-gray-800"
                        }`}
                      >
                        <div className="flex gap-1">
                          <span>{i("header.custom")}</span>
                        </div>
                      </button>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="px-2 py-1 text-sm opacity-75">
                    {i("header.sampleCountries")}
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
                                
                                }

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
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
