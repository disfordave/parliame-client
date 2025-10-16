import { useEffect, useState } from "react";
import { useI18n } from "@/lib/zustandStore";

type Theme = "light" | "dark" | "auto";

export default function ThemeButton() {
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
    <select
      className="appearance-none rounded-lg border-2 border-gray-200 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900"
      value={theme}
      title={"Appearance"}
      onChange={(e) => setTheme(e.target.value as "light" | "dark" | "auto")}
    >
      <option value={"light"}>{i("appearance.light")}</option>
      <option value={"dark"}>{i("appearance.dark")}</option>
      <option value={"auto"}>{i("appearance.auto")}</option>
    </select>
  );
}
