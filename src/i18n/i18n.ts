import { useSelector } from 'react-redux';
import en from './en.json' with { type: 'json' };
import fr from './fr.json' with { type: 'json' };
import de from './de.json' with { type: 'json' };
import nl from './nl.json' with { type: 'json' };
import { selectLocale } from './i18nSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function locate(obj: any, path: string) {

  const pathString = path.split('.');
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

function translate({
    locale, id
}: {
    locale: string,
    id: string
}) {
    if (locale !== 'en' && locale !== 'fr' && locale !== 'de' && locale !== 'nl') {
        return locate(en, id) || id
    } else {
        return locate(locale === 'fr' ? fr : locale === 'de' ? de : locale === 'nl' ? nl : en, id) || id
    }
}

export const useI18n = () => {
    const locale = useSelector(selectLocale);
    return (id: string) => translate({ locale, id })
}
