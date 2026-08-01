import type { HomeDict } from "@/lib/i18n/dictionary/home";

export const home = {
  greeting: {
    morning: "Bună dimineața,",
    afternoon: "Bună ziua,",
    evening: "Bună seara,",
    night: "Noapte bună,",
  },
  askPiluCard: {
    heading: "Întreabă-l pe Pilu",
    description: "Întrebări despre hrănire, somn, plâns sau dezvoltarea bebelușului tău?",
    button: "Vorbește cu Pilu",
  },
  insightCard: {
    heading: "Perspectiva zilei",
    body: "{name} a avut o noapte bună — 6h 45m de somn cu 2 treziri și s-a hrănit bine.",
    footer: "Pe baza activității simulate de azi.",
  },
  latestReportCard: {
    eyebrow: "Pilu Elite",
    emptyHeading: "Primul tău raport AI este gata de generat",
    emptyDescription: "Un rezumat calm al hrănirii, somnului, creșterii și momentelor fericite.",
    generateButton: "Generează raportul",
    latestPrefix: "Cel mai recent raport AI",
    viewButton: "Vezi raportul complet",
  },
  nextMilestoneCard: {
    label: "Următorul reper",
    body: "Este posibil ca {name} să înceapă în curând {milestone}.",
    footer: "Îndrumări generale de dezvoltare",
    button: "Explorează reperele de dezvoltare",
  },
  careItemCard: {
    label: "Următorul element de îngrijire",
    medicineScheduled: "{medicine} programat la ora {time}",
    vaccineAppointment: "Programare pentru vaccin pe {date}",
    noneScheduled: "Niciun element de îngrijire programat",
    footer: "Program local introdus de părinte",
    button: "Vezi detalii",
  },
  recentMemoryCard: {
    label: "Amintire recentă",
    favorite: "Păstrată ca favorită",
    button: "Deschide Cartea de amintiri",
  },
  remindersCard: {
    todayHeading: "Amintirile de azi",
    upcomingHeading: "Amintiri viitoare",
    button: "Gestionează amintirile",
  },
  quickAdd: {
    heading: "Adăugare rapidă",
    subheading: "Înregistrează o activitate recentă",
    sheetTitle: "Adăugare rapidă",
    closeLabel: "Închide adăugarea rapidă",
  },
  recentActivity: {
    heading: "Activitate recentă",
    subheading: "O privire scurtă asupra zilei de azi",
    button: "Vezi cronologia",
  },
  floatingAddButtonLabel: "Deschide adăugarea rapidă",
  activityAddedToast: "Activitate adăugată în Cronologie",
} satisfies HomeDict;
