import en from "./en.json" with { type: "json" };
import fr from "./fr.json" with { type: "json" };
import de from "./de.json" with { type: "json" };
import nl from "./nl.json" with { type: "json" };

export const defaultLocale = "en";
export const locales = { en, fr, de, nl } as const;
export type Locale = keyof typeof locales;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function locate(obj: any, path: string) {
  const pathString = path.split(".");
  const arrayPattern = /(.+)\[(\d+)\]/;
  for (let i = 0; i < pathString.length; i++) {
    const match = arrayPattern.exec(pathString[i]);
    if (match) {
      obj = obj[match[1]][parseInt(match[2])];
    } else {
      obj = obj[pathString[i]];
    }
  }

  return obj;
}

export function translate({ locale, id }: { locale: string; id: string }) {
  if (!(locale in locales)) {
    return locate(defaultLocale, id) || id;
  } else {
    return locate(locales[locale as Locale], id) || id;
  }
}
