import { defaultLocale, I18nLocales } from "@/config/i18n";
import "server-only";

export interface Dictionary {
  translation: {
    paths: {
      projectReveal: string;
      whoAmI: string;
    };
    header: {
      title: string;
      whoAmILink: string;
    };
    footer: {
      copyright: string;
      builtBy: string;
      hostedBy: string;
    };
    homePage: {
      byText: string;
      heroTitle: string;
      heroHighlightText: string;
      heroDescription: string;
      featuredPostsTitle: string;
      ctaText: string;
    };
    postPage: {
      breadcrumbHome: string;
      notFoundTitle: string;
      likeButtonLabel: string;
    };
  };
}

const dictionaries: { [key: string]: () => Promise<Dictionary> } = {
  [I18nLocales.EN_US]: () =>
    import(`./dictionaries/${I18nLocales.EN_US}.json`).then(
      (module) => module.default,
    ),
  [I18nLocales.FR_FR]: () =>
    import(`./dictionaries/${I18nLocales.FR_FR}.json`).then(
      (module) => module.default,
    ),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (!dictionaries[locale]) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
};
