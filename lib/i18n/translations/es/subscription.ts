import type { SubscriptionDict } from "@/lib/i18n/dictionary/subscription";

export const subscription = {
  pageHeaders: {
    subscriptionEyebrow: "Pilu Elite y Premium", growTitle: "Crece con Pilu", growDescription: "Mejora el plan de toda tu familia — Sonidos para dormir, Pregunta a Pilu ilimitado, Recuerdos ilimitados, Informes IA y más.",
    accountEyebrow: "Cuenta", accountSubscriptionTitle: "Suscripción", accountSubscriptionDescription: "El plan actual de Pilu de tu familia.",
    plansTitle: "Planes", plansDescription: "Compara Gratuito, Elite y Premium y elige lo que mejor se adapte a tu familia.",
  },
  planComparison: {
    billingPeriodAriaLabel: "Período de facturación", monthly: "Mensual", yearly: "Anual",
    unavailableAndroidOnly: "La suscripción funciona desde la app de Pilu para Android. Abre Pilu en tu dispositivo Android para mejorar tu plan — se aplicará a toda tu familia en cualquier lugar, incluido aquí.",
    purchaseIncomplete: "La compra no se completó. Inténtalo de nuevo.",
    purchaseUnconfirmed: "Todavía no pudimos confirmar esta compra. Se actualizará en breve.",
    welcomeTemplate: "Ya está todo listo — ¡bienvenido a Pilu {plan}!",
    yourPlan: "Tu plan", seePriceInPlayStore: "Ver precio en Play Store", freeFeatures: "Seguimiento básico del bebé, cronología y uso compartido en familia",
    openingPlayStore: "Abriendo Play Store…", chooseTemplate: "Elegir {tier}",
    tierNames: { free: "Gratuito", elite: "Elite", premium: "Premium" },
  },
  status: {
    labels: { active: "Activa", grace_period: "Problema de pago — en período de gracia", on_hold: "Problema de pago — en espera", paused: "Pausada", canceled: "Cancelada", expired: "Caducada", pending: "Pendiente" },
    freePlanHeading: "Estás en el plan Gratuito", freePlanBody: "Mejora a Elite o Premium para desbloquear Sonidos para dormir, Pregunta a Pilu ilimitado, Recuerdos ilimitados e Informes IA.", seePlans: "Ver planes",
    renews: "Se renueva", doesNotRenew: "No se renueva", currentPeriodEnds: "El período actual termina",
    manageNote: "Las suscripciones se gestionan a través de Google Play — cancela, cambia de plan o actualiza el pago allí.",
    manageInPlay: "Gestionar en Google Play", changePlan: "Cambiar de plan", dateFallback: "—",
  },
  upgradePrompt: { eyebrowSuffixTemplate: "{feature} es una función de Pilu Elite", seeElitePremium: "Ver Pilu Elite y Premium" },
  plans: {
    featureLabels: {
      sleep_sounds: "Sonidos para dormir", unlimited_ai: "Pregunta a Pilu ilimitado", unlimited_memories: "Recuerdos ilimitados",
      ai_reports: "Informes IA", advanced_ai: "IA avanzada", ai_vision: "Escaneos de Pilu Vision ilimitados",
    },
    tierTagline: {
      free: "Lo esencial, con suavidad, para cada familia.",
      elite: "Sonidos para dormir, Pregunta a Pilu ilimitado, Recuerdos, Pilu Vision e Informes IA.",
      premium: "Todo lo de Elite, más IA avanzada.",
    },
  },
} satisfies SubscriptionDict;
