import 'server-only';

type Dictionary = {
    [ key: string ]: string | { [ key: string ]: string };
};

const dictionaries: { [key: string]: () => Promise<Dictionary> } = {
    en: () => import('../public/data/en.json').then((module) => module.default),
    bn: () => import('../public/data/bn.json').then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
    if (!dictionaries[locale]) {
        console.warn(`Locale '${locale}' not found, falling back to 'en'`);
        locale = 'en';
    }

    return dictionaries[locale]();
};