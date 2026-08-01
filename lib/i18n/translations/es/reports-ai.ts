import type { ReportsAiDict } from "@/lib/i18n/dictionary/reports-ai";

export const reportsAi = {
  demo: {
    overviewTemplate: "Modo demo: Pilu usaría los datos de {name} para escribir aquí un resumen tranquilo y personalizado. Gemini no está conectado, así que esto es un marcador de posición.",
    highlightFeedingsTemplate: "{count} tomas registradas",
    highlightSleepTemplate: "{hours}h de sueño registradas",
    highlightDiapersTemplate: "{count} cambios de pañal registrados",
    routineTrends: "Modo demo: aquí aparecería una descripción amable de los ritmos que Pilu notó.",
    sleepSummary: "Modo demo: aquí aparecería un resumen cálido de los patrones de sueño.",
    feedingSummary: "Modo demo: aquí aparecería un resumen cálido de los patrones de alimentación.",
    growthProgressWithDataTemplate: "Modo demo: la última medición de {name} fue de {weight} kg.",
    growthProgressEmpty: "Modo demo: aún no hay mediciones de crecimiento disponibles para este período.",
    milestonesWithDataTemplate: "Modo demo: se alcanzaron {count} hito(s) en este período.",
    milestonesEmpty: "Modo demo: no se marcó ningún hito como alcanzado en este período.",
    happyMomentsWithDataTemplate: "Modo demo: se guardaron {count} recuerdo(s) en este período.",
    happyMomentsEmpty: "Modo demo: no se guardó ningún recuerdo en este período.",
    suggestion1: "Fíjate en los patrones a lo largo del tiempo, no solo en un día concreto.",
    suggestion2: "Sigue guardando pequeños momentos en el Libro de recuerdos — se acumulan de forma preciosa.",
    pediatricianQuestion1: "¿Hay algo sobre nuestra rutina actual que recomendarías ajustar?",
    disclaimer: "Respuesta de demostración — Gemini no está conectado. Pilu ofrece información general sobre crianza y no sustituye el consejo médico.",
  },
  safeFallback: {
    overview: "Pilu no ha podido preparar un informe completo ahora mismo, pero aquí tienes un marcador de posición amable basado en lo disponible.",
    routineTrends: "No hubo suficiente información disponible para describir las rutinas esta vez.",
    sleepSummary: "La información sobre el sueño aparecerá aquí una vez que se genere un informe.",
    feedingSummary: "La información sobre la alimentación aparecerá aquí una vez que se genere un informe.",
    growthProgress: "La información sobre el crecimiento aparecerá aquí una vez que se genere un informe.",
    milestones: "La información sobre los hitos aparecerá aquí una vez que se genere un informe.",
    happyMoments: "Los momentos felices aparecerán aquí una vez que se genere un informe.",
    suggestion: "Intenta generar este informe de nuevo dentro de un momento.",
    disclaimer: "Pilu ofrece información general sobre crianza y no sustituye el consejo médico.",
  },
  routeErrors: {
    rateLimited: "Pilu necesita una pequeña pausa antes de generar otro informe. Inténtalo de nuevo dentro de un minuto.",
    badRequest: "No se pudo leer la solicitud de informe.",
    serverError: "Pilu no ha podido preparar este informe ahora mismo. Inténtalo de nuevo.",
  },
} satisfies ReportsAiDict;
