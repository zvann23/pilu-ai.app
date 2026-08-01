import type { ReportsAiDict } from "@/lib/i18n/dictionary/reports-ai";

export const reportsAi = {
  demo: {
    overviewTemplate: "Mod demo: Pilu ar folosi datele lui {name} pentru a scrie aici un rezumat calm și personalizat. Gemini nu este conectat, deci acesta este un substituent.",
    highlightFeedingsTemplate: "{count} hrăniri înregistrate",
    highlightSleepTemplate: "{hours}h de somn înregistrate",
    highlightDiapersTemplate: "{count} schimbări de scutec înregistrate",
    routineTrends: "Mod demo: aici ar apărea o descriere blândă a ritmurilor observate de Pilu.",
    sleepSummary: "Mod demo: aici ar apărea un rezumat cald al tiparelor de somn.",
    feedingSummary: "Mod demo: aici ar apărea un rezumat cald al tiparelor de hrănire.",
    growthProgressWithDataTemplate: "Mod demo: ultima măsurătoare a lui {name} a fost {weight} kg.",
    growthProgressEmpty: "Mod demo: nu sunt disponibile încă măsurători de creștere pentru această perioadă.",
    milestonesWithDataTemplate: "Mod demo: {count} reper(e) de dezvoltare au fost atinse în această perioadă.",
    milestonesEmpty: "Mod demo: niciun reper de dezvoltare nu a fost marcat ca atins în această perioadă.",
    happyMomentsWithDataTemplate: "Mod demo: {count} amintire/amintiri au fost salvate în această perioadă.",
    happyMomentsEmpty: "Mod demo: nicio amintire nu a fost salvată în această perioadă.",
    suggestion1: "Observă tiparele în timp, nu doar o singură zi.",
    suggestion2: "Continuă să salvezi momentele mici în Cartea de amintiri — se adună frumos în timp.",
    pediatricianQuestion1: "Există ceva legat de rutina noastră actuală pe care l-ai recomanda să ajustăm?",
    disclaimer: "Răspuns demo — Gemini nu este conectat. Pilu oferă informații generale pentru părinți și nu înlocuiește sfatul medical.",
  },
  safeFallback: {
    overview: "Pilu nu a putut pregăti un raport complet chiar acum, dar iată un substituent blând bazat pe ce este disponibil.",
    routineTrends: "Nu au fost suficiente informații disponibile pentru a descrie rutinele de această dată.",
    sleepSummary: "Informațiile despre somn vor apărea aici după generarea unui raport.",
    feedingSummary: "Informațiile despre hrănire vor apărea aici după generarea unui raport.",
    growthProgress: "Informațiile despre creștere vor apărea aici după generarea unui raport.",
    milestones: "Informațiile despre reperele de dezvoltare vor apărea aici după generarea unui raport.",
    happyMoments: "Momentele fericite vor apărea aici după generarea unui raport.",
    suggestion: "Încearcă să generezi din nou acest raport peste puțin timp.",
    disclaimer: "Pilu oferă informații generale pentru părinți și nu înlocuiește sfatul medical.",
  },
  routeErrors: {
    rateLimited: "Pilu are nevoie de o mică pauză înainte de a genera un alt raport. Te rugăm să încerci din nou peste un minut.",
    badRequest: "Nu am putut citi cererea de raport.",
    serverError: "Pilu nu a putut pregăti acest raport chiar acum. Te rugăm să încerci din nou.",
  },
} satisfies ReportsAiDict;
