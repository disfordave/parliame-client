import "./App.css";
import { useEffect, useState } from "react";
import Seats from "@/components/Seats";
import { useI18n } from "@/lib/zustandStore";
import LocaleSettingButton from "./components/ui/LocaleSettingButton";

type Theme = "light" | "dark" | "auto";

function App() {
  const { i } = useI18n();
  const [theme, setTheme] = useState<Theme>(
    (localStorage.theme as Theme) || "auto",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const effectiveTheme =
        theme === "auto" ? (mediaQuery.matches ? "dark" : "light") : theme;

      // update DOM
      document.documentElement.classList.toggle(
        "dark",
        effectiveTheme === "dark",
      );
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
    <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-2xl p-4">
        <div
          className={"mb-4 flex flex-wrap items-center justify-between gap-2"}
        >
          <div className={"flex items-center gap-1"}>
            <img src={"/favicon.svg"} alt={"Parliament"} className={"size-8"} />
            <h1 className="text-2xl font-bold">{i("parliament")}</h1>
          </div>
          <div className="ms-2 flex gap-2">
            <LocaleSettingButton />
          </div>
        </div>
        <Seats />
        <div className={"mt-4 italic opacity-75"}>
          <p>
            {i("footer.feelFree")}{" "}
            <a
              className={"underline hover:no-underline"}
              href={"https://disfordave.com/projects/parliament/#comments"}
              rel={"noreferrer noopener"}
              target={"_blank"}
            >
              {i("footer.myWebsite")}
            </a>{" "}
            {i("footer.ifYouHave")}
          </p>
        </div>
        <footer
          className={
            "flex flex-wrap items-center justify-between gap-2 py-8 text-start"
          }
        >
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              className={"no-underline hover:underline"}
              href={"https://disfordave.com"}
              rel={"noreferrer noopener"}
              target={"_blank"}
            >
              @disfordave
            </a>{" "}
          </p>
          <select
            className="appearance-none rounded-lg border-2 border-gray-200 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900"
            value={theme}
            title={"Appearance"}
            onChange={(e) =>
              setTheme(e.target.value as "light" | "dark" | "auto")
            }
          >
            <option value={"light"}>{i("appearance.light")}</option>
            <option value={"dark"}>{i("appearance.dark")}</option>
            <option value={"auto"}>{i("appearance.auto")}</option>
          </select>
        </footer>
      </div>
    </div>
  );
}

export default App;
