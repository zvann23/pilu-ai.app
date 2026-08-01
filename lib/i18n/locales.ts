export const locales = ["en", "ro", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ro: "Română",
  es: "Español",
};

/** BCP 47 tags for Intl formatters (Intl.DateTimeFormat, etc.) — en keeps day-before-month GB formatting to match the app's existing date style. */
export const intlLocaleTags: Record<Locale, string> = {
  en: "en-GB",
  ro: "ro-RO",
  es: "es-ES",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
