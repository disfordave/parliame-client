import en from './en.json' with { type: 'json' };
import fr from './fr.json' with { type: 'json' };

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
    if (locale !== 'en' && locale !== 'fr') {
        return locate(en, id) || id
    } else {
        return locate(locale === 'fr' ? fr : en, id) || id
    }
}

export const useI18n = () => {
    return (id: string) => translate({ locale: 'fr', id })
}
