import "./App.css";
import Seats from "./components/Seats";
import {useEffect, useState} from "react";
import {useI18n} from './i18n/i18n'

type Theme = "light" | "dark" | "auto";

function App() {

  const i = useI18n().i

  const [theme, setTheme] = useState<Theme>(
    (localStorage.theme as Theme) || "auto"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const effectiveTheme =
        theme === "auto"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : theme;

      // update DOM
      document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
    };

    // Apply immediately
    applyTheme();

    // Only watch system preference if we're in auto mode
    if (theme === "auto") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme === "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = theme;
    }
  }, [theme]);


  return (
    <div className="bg-white dark:bg-gray-900 text-gray-950 dark:text-white min-h-screen transition-colors duration-300">
        <div className="max-w-2xl mx-auto p-4 ">
            <div className={"flex justify-between items-center  mb-4"}>
                <h1 className="text-2xl font-bold">{i('parliament')}</h1>
                <select
                    className="px-2 py-1 border-2 rounded-lg border-gray-200 dark:border-gray-700 appearance-none bg-white dark:bg-gray-900"
                    value={theme} title={"Appearance"} onChange={
                    (e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')
                }>
                    <option value={'light'}>{i('light')}</option>
                    <option value={'dark'}>{i('dark')}</option>
                    <option value={'auto'}>{i('auto')}</option>
                </select>

            </div>
            <Seats/>
            <div className={"mt-4 italic opacity-75"}>
                <p>
                    Feel free to contact me through <a className={"underline hover:no-underline"} href={"https://disfordave.com/projects/parliament/#comments"} rel={"noreferrer noopener"} target={"_blank"}>my website</a> if you have any issues or suggestions.
                </p>
            </div>
            <footer className={"p-8 text-center"}>
                <p>&copy; {new Date().getFullYear()} <a className={"hover:underline no-underline"} href={"https://disfordave.com"} rel={"noreferrer noopener"} target={"_blank"}>@disfordave</a> </p>
            </footer>
        </div>
    </div>
  );
}

export default App;
