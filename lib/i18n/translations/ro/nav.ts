import type { NavDict } from "@/lib/i18n/dictionary/nav";

export const nav = {
  sections: {
    main: "Principal",
    baby: "Bebeluș",
    discover: "Descoperă",
    elite: "Pilu Elite",
    family: "Familie",
    account: "Cont",
  },
  items: {
    home: { label: "Acasă", description: "O privire blândă asupra zilei bebelușului tău." },
    askPilu: { label: "Întreabă-l pe Pilu", description: "Un spațiu gândit pentru întrebările tale ca părinte." },
    timeline: { label: "Cronologie", description: "O cronologie calmă a micilor momente." },
    quickAdd: { label: "Adăugare rapidă", description: "Surprinde un moment din câteva atingeri." },
    babyProfile: { label: "Profilul bebelușului", description: "Profilul bebelușului tău și detaliile familiei." },
    feeding: { label: "Hrănire", description: "Un loc simplu pentru ritmurile de hrănire." },
    sleep: { label: "Somn", description: "Un mod mai blând de a înțelege somnul." },
    diapers: { label: "Scutece", description: "O privire rapidă asupra schimbărilor de scutece." },
    growth: { label: "Creștere", description: "Urmărește creșterea bebelușului tău, în ritmul lui." },
    milestones: { label: "Repere de dezvoltare", description: "Sărbătorește fiecare lucru nou." },
    vaccines: { label: "Vaccinuri", description: "Ține aproape momentele importante de îngrijire." },
    medicine: { label: "Medicamente", description: "Un loc calm pentru notițe despre medicamente." },
    library: { label: "Biblioteca Pilu", description: "Îndrumări utile pentru fiecare etapă." },
    firstAid: { label: "Primul ajutor", description: "Informații esențiale de prim ajutor, de încredere, pentru părinți." },
    solidFoods: { label: "Alimente solide", description: "Un ghid blând pentru primele alimente." },
    memoryBook: { label: "Carte de amintiri", description: "Salvează momentele pe care vrei să ți le amintești." },
    sleepSounds: { label: "Sunete pentru somn", description: "Sunete premium pentru rutine liniștitoare." },
    reports: { label: "Rapoarte AI", description: "Rezumate gândite ale tiparelor bebelușului tău." },
    vision: { label: "Pilu Vision", description: "Scanează alimente, biberoane, etichete și altele." },
    smartRoutines: { label: "Rutine inteligente", description: "Rutine flexibile care se adaptează familiei tale." },
    family: { label: "Părinți partajați", description: "Ține-i pe toți sincronizați în îngrijire." },
    notifications: { label: "Notificări", description: "Amintirile și actualizările blânde de la Pilu." },
    settings: { label: "Setări", description: "Personalizează-ți experiența Pilu." },
    subscription: { label: "Abonament", description: "Gestionează-ți planul Pilu." },
    help: { label: "Ajutor și suport", description: "Suntem aici atunci când ai nevoie de noi." },
  },
  gates: {
    sleepSounds: {
      title: "Sunetele pentru somn fac parte din Pilu Elite",
      description: "Sunete blânde, selectate cu grijă, care ajută bebelușul să se liniștească — deblocate cu Elite sau Premium.",
    },
    reports: {
      title: "Rapoartele AI fac parte din Pilu Elite",
      description: "Rezumate zilnice, săptămânale și lunare gândite despre tiparele bebelușului tău — deblocate cu Elite sau Premium.",
    },
  },
} satisfies NavDict;
