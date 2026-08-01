import type { SubscriptionDict } from "@/lib/i18n/dictionary/subscription";

export const subscription = {
  pageHeaders: {
    subscriptionEyebrow: "Pilu Elite și Premium", growTitle: "Crește alături de Pilu", growDescription: "Fă upgrade la planul întregii tale familii — Sunete pentru somn, Întreabă Pilu nelimitat, Amintiri nelimitate, Rapoarte AI și multe altele.",
    accountEyebrow: "Cont", accountSubscriptionTitle: "Abonament", accountSubscriptionDescription: "Planul Pilu actual al familiei tale.",
    plansTitle: "Planuri", plansDescription: "Compară Gratuit, Elite și Premium și alege ce se potrivește familiei tale.",
  },
  planComparison: {
    billingPeriodAriaLabel: "Perioadă de facturare", monthly: "Lunar", yearly: "Anual",
    unavailableAndroidOnly: "Abonarea funcționează din aplicația Pilu pentru Android. Deschide Pilu pe dispozitivul tău Android pentru a face upgrade — planul tău se va aplica întregii tale familii, oriunde, inclusiv aici.",
    purchaseIncomplete: "Achiziția nu s-a finalizat. Te rugăm să încerci din nou.",
    purchaseUnconfirmed: "Nu am putut confirma încă această achiziție. Se va actualiza în curând.",
    welcomeTemplate: "Ești gata — bun venit la Pilu {plan}!",
    yourPlan: "Planul tău", seePriceInPlayStore: "Vezi prețul în Play Store", freeFeatures: "Urmărirea de bază a bebelușului, cronologie și partajare în familie",
    openingPlayStore: "Se deschide Play Store…", chooseTemplate: "Alege {tier}",
    tierNames: { free: "Gratuit", elite: "Elite", premium: "Premium" },
  },
  status: {
    labels: { active: "Activ", grace_period: "Problemă de plată — în perioadă de grație", on_hold: "Problemă de plată — suspendat", paused: "Pus pe pauză", canceled: "Anulat", expired: "Expirat", pending: "În așteptare" },
    freePlanHeading: "Ești pe planul Gratuit", freePlanBody: "Fă upgrade la Elite sau Premium pentru a debloca Sunete pentru somn, Întreabă Pilu nelimitat, Amintiri nelimitate și Rapoarte AI.", seePlans: "Vezi planurile",
    renews: "Se reînnoiește", doesNotRenew: "Nu se reînnoiește", currentPeriodEnds: "Perioada curentă se încheie",
    manageNote: "Abonamentele sunt gestionate prin Google Play — anulează, schimbă planul sau actualizează plata acolo.",
    manageInPlay: "Gestionează în Google Play", changePlan: "Schimbă planul", dateFallback: "—",
  },
  upgradePrompt: { eyebrowSuffixTemplate: "{feature} este o funcție Pilu Elite", seeElitePremium: "Vezi Pilu Elite și Premium" },
  plans: {
    featureLabels: {
      sleep_sounds: "Sunete pentru somn", unlimited_ai: "Întreabă Pilu nelimitat", unlimited_memories: "Amintiri nelimitate",
      ai_reports: "Rapoarte AI", advanced_ai: "AI avansat", ai_vision: "Scanări Pilu Vision nelimitate",
    },
    tierTagline: {
      free: "Elementele de bază, cu blândețe, pentru orice familie.",
      elite: "Sunete pentru somn, Întreabă Pilu nelimitat, Amintiri, Pilu Vision și Rapoarte AI.",
      premium: "Tot ce oferă Elite, plus AI avansat.",
    },
  },
} satisfies SubscriptionDict;
