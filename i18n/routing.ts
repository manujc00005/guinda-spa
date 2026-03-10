import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "en", "fr"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/aviso-legal": {
      es: "/aviso-legal",
      en: "/legal-notice",
      fr: "/mentions-legales",
    },
    "/privacidad": {
      es: "/privacidad",
      en: "/privacy-policy",
      fr: "/politique-de-confidentialite",
    },
    "/cookies": "/cookies",
    "/cancelaciones": {
      es: "/cancelaciones",
      en: "/cancellation-policy",
      fr: "/politique-dannulation",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
