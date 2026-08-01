import type { VisionDict } from "@/lib/i18n/dictionary/vision";

export const vision = {
  header: { eyebrow: "Pilu Vision", title: "Scaneaz-o, înțeleg-o", subtitle: "Mâncare, biberoane, etichete, ingrediente, jucării și produse pentru bebeluși — Pilu Vision citește fotografia și explică ce vede." },
  categoryPickerAriaLabel: "Categorie de scanare",
  categoryLabels: { food: "Mâncare", bottle: "Biberon", label: "Etichetă", ingredients: "Ingrediente", toy: "Jucărie", baby_product: "Produs pentru bebeluși", rash: "Analiză iritație", skin: "Observații despre piele", stool: "Observații despre scaun" },
  soonSuffix: "În curând",
  soonTitle: "În curând disponibil",
  analyzing: "Se analizează…",
  takePhoto: "Fă o poză",
  chooseFromGallery: "Alege din galerie",
  quota: { unlimited: "Scanări nelimitate cu planul tău.", remainingTemplate: "{remaining} din {total} scanări gratuite rămase azi.", upgrade: " Treci la nelimitat" },
  result: { removeFromSaved: "Elimină din scanările salvate", saveThisScan: "Salvează această scanare", worthDoubleChecking: "Merită verificat" },
  history: { historyTab: "Istoric", savedTab: "Scanări salvate", listsAriaLabel: "Liste de scanări", emptySaved: "Nimic salvat încă — atinge inima de pe o scanare pentru a o păstra aici.", emptyHistory: "Scanările tale vor apărea aici.", deleteThisScan: "Șterge această scanare" },
  errors: {
    analyzeFailed: "Pilu Vision nu a putut analiza această fotografie acum. Te rugăm să încerci din nou.",
    rateLimited: "Pilu are nevoie de o mică pauză înainte de a analiza o altă fotografie. Te rugăm să încerci din nou peste un minut.",
    photoRequired: "Este necesară o fotografie.",
    categoryUnavailable: "Acest tip de scanare nu este încă disponibil.",
    authRequired: "Este necesară autentificarea",
    familyRequired: "Ai nevoie de o familie înainte de a folosi Pilu Vision",
    babyRequired: "Adaugă profilul bebelușului tău înainte de a folosi Pilu Vision",
    freeLimitTemplate: "Planurile gratuite includ {limit} scanări Pilu Vision pe zi — treci la Elite pentru scanări nelimitate.",
    saveFailed: "Pilu Vision a analizat această fotografie, dar nu a putut fi salvată. Te rugăm să încerci din nou.",
  },
  demo: {
    titleTemplate: "Mod demo: scanare {label}",
    summaryTemplate: "Mod demo: Pilu Vision ar identifica aici ce se află în această fotografie de tip {label}. Gemini nu este conectat, așa că acesta este un substituent.",
    keyPoint: "Mod demo: detaliile notabile din fotografie ar apărea aici.",
    recommendation: "Mod demo: îndrumări blânde pentru pașii următori ar apărea aici.",
    disclaimer: "Răspuns demo — Gemini nu este conectat. Pilu Vision oferă informații generale și nu înlocuiește sfatul medical.",
  },
  safeFallback: {
    title: "Pilu nu a putut citi această fotografie",
    summary: "Pilu nu a putut pregăti o analiză completă pentru această fotografie acum. O fotografie clară și bine luminată a feței produsului sau etichetei funcționează de obicei cel mai bine.",
    recommendation: "Încearcă din nou cu o fotografie mai clară sau verifică direct ambalajul. Dacă ai o întrebare legată de sănătate sau siguranță, este întotdeauna în regulă să contactezi medicul pediatru.",
    disclaimer: "Pilu Vision oferă informații generale și nu înlocuiește sfatul medical sau îndrumările profesionale privind siguranța produselor.",
  },
} satisfies VisionDict;
