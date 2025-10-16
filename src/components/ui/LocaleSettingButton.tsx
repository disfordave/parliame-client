import { useI18n } from "@/lib/zustandStore";

export default function LocaleSettingButton() {
  const { locale, setLocale } = useI18n();

  const locales = ["en", "fr", "de", "nl"];
  return (
    <>
      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg flex overflow-hidden">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={`appearance-none px-2 py-1 transition-colors duration-300 ${
              locale === loc
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-white dark:bg-gray-900"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}