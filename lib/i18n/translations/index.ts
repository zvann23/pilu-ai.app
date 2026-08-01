import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { en } from "@/lib/i18n/translations/en";
import { ro } from "@/lib/i18n/translations/ro";
import { es } from "@/lib/i18n/translations/es";

export const dictionaries: Record<Locale, Dictionary> = { en, ro, es };
