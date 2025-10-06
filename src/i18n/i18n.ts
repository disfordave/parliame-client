import en from './en.json' with { type: 'json' };
import fr from './fr.json' with { type: 'json' };

const dict = { en, fr }

function translate({
    locale, id
}: {
    locale: string,
    id: string
}) {
    if (locale !== 'en' && locale !== 'fr') {
        return dict['en'][id]
    } else {
        return dict[locale][id]
    }
}

export const useI18n = () => {
    return {
        i(id: string) {
            return translate({
                locale: 'fr', id
            })
        }
    }
}
